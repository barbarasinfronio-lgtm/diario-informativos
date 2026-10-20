#!/usr/bin/env python3
"""
julgados_sob_pedido.py — atende os pedidos de "Pedir este julgado" do Diário das Decisões.

Quem busca um julgado que não está no site (ex.: "EDcl no AgInt no REsp 1880254/MT") pode clicar em "Pedir este
julgado": o site grava o pedido no Firestore (coleção pedidos-julgados, um por busca). Este robô lê os pedidos, descobre
o TRIBUNAL pela classe do processo ("REsp" só existe no STJ, "RE" e "ADI" só no STF, "RR" e "AIRR" só no TST, "REspe" só
no TSE; "HC", "RHC", "MS", "RMS", "Rcl", "Pet" existem em mais de um, e aí o robô procura em todos), procura o acórdão na
base daquele tribunal e, achando, o acrescenta ao acervo dele no site, SEM passar pelo filtro de conteúdo: quem pediu
quer aquele julgado, mesmo que uma rodada normal o descartasse (embargos rejeitados, recurso só processual). Quem
digita o tribunal na busca ("STF HC 123456") escolhe onde procurar.

Fontes por tribunal (as mesmas que os robôs de acórdãos já baixam, no Mac):
  STJ  dados abertos (espelhos de acórdãos)   ~/EstudaMana/cache-stj-acordaos/   → stj/acordaos/   (acordaos_stj.py)
  STF  pesquisa de jurisprudência             ~/EstudaMana/cache-stf-acordaos/   → stf/acordaos/   (acordaos_stf.py)
  TST, TSE, STM: o tribunal é reconhecido, mas ainda não há fonte para buscar um acórdão qualquer (o acervo do TST só tem
  os precedentes vinculantes, e TSE e STM não têm acervo no site). O pedido fica registrado como "sem-fonte:<tribunal>" em
  curadoria/julgados-pedidos.json e volta a ser tentado quando o tribunal entrar na lista FONTES.
Se o acórdão não está no cache (é mais novo que a última coleta), o pedido fica pendente: rode o "Atualizar Acórdãos.command"
(ou o "Atualizar Acordaos STJ.command") e depois este de novo.

Os ids incluídos por pedido ficam em "incluidos" (por tribunal) no mesmo arquivo: os robôs dos acervos os leem
(julgados_pedidos_ids.py) para não reprovar nem podar esses julgados depois.

Roda no Mac, pelo "Atender Pedidos de Julgados.command":

    python3 scripts/julgados_sob_pedido.py --plano                                  # só lista os pedidos pendentes
    python3 scripts/julgados_sob_pedido.py --max 20                                 # atende até 20
    python3 scripts/julgados_sob_pedido.py --teste "EDcl no AgInt no REsp 1880254/MT"   # procura e mostra, não grava
"""
import argparse, gzip, json, re, sys, urllib.parse
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(RAIZ / "scripts"))
import acordaos_stf as ac_stf  # noqa: E402
import acordaos_stj as ac_stj  # noqa: E402
import indice_fatiado  # noqa: E402
import leis_citadas as lc  # noqa: E402
robo = lc.robo

PEDIDOS = RAIZ / "curadoria" / "julgados-pedidos.json"   # {"feitos": {id: status}, "falhas": {id: {...}}, "incluidos": {"STJ": [ids], "STF": [ids]}}
FIRESTORE = "https://firestore.googleapis.com/v1/projects/diariodeinformativos/databases/(default)/documents/pedidos-julgados"
API_KEY = "AIzaSyAe0g7Ps4d_uXvh1IiFTtDICwZ91YOUto0"      # chave pública do site (site/conta/nuvem-shared.js)

FONTES = ("STJ", "STF")          # tribunais que o robô sabe buscar; os outros ficam "sem-fonte" (ver docstring)
ORDEM = ("STF", "STJ", "TST", "TSE", "STM")
LIGACAO = {"no", "na", "nos", "nas"}
UFS = set("AC AL AP AM BA CE DF ES GO MA MT MS MG PA PB PR PE PI RJ RN RS RO RR SC SP SE TO".split())

# Classe (a última da cadeia: "REsp" em "EDcl no AgInt no REsp") → tribunais em que ela existe.
CLASSES = {
    "STF": {"re", "are", "adi", "adc", "adpf", "ado", "adin", "ai", "aci", "aco", "ao", "ap", "inq", "mi", "sl", "sta", "rvc", "ext",
            "pps", "prc", "rp", "tpa", "stp", "rcl", "hc", "rhc", "ms", "rms", "pet", "ar"},
    "STJ": {"resp", "aresp", "eresp", "earesp", "edv", "ag", "eag", "apn", "iac", "puil", "sec", "sls", "ss", "cc", "cr", "rcl", "hc",
            "rhc", "ms", "rms", "pet", "ar", "ro", "rpv", "pext"},
    "TST": {"rr", "airr", "arr", "rrag", "roar", "airo", "irr", "iuj", "rot"},
    "TSE": {"respe", "respel", "aije", "aime", "rced", "cta", "rcd", "rvi"},
    "STM": {"ap", "rse", "mc"},
}
RE_CNJ = re.compile(r"^(?:((?:[A-Za-z]{1,8}-)*[A-Za-z]{1,8})-)?(\d{1,7}-\d{2}\.\d{4}\.\d\.\d{2}\.\d{4})$")
RE_NUM = re.compile(r"(\d{1,3}(?:\.\d{3})+|\d{4,9})(?:\s*[-/]\s*([A-Za-z]{2}))?")


def pedidos():
    """Pedidos gravados no Firestore: [{"id", "consulta", "em"}]."""
    out, token = [], ""
    while True:
        url = f"{FIRESTORE}?pageSize=300&key={API_KEY}" + (f"&pageToken={urllib.parse.quote(token)}" if token else "")
        status, _, corpo = robo.buscar(url)
        if status != 200:
            raise robo.Falha(f"não consegui ler os pedidos (HTTP {status}); as regras do Firestore já foram publicadas? (firestore.rules)")
        j = json.loads(corpo.decode("utf-8"))
        for d in j.get("documents", []):
            f = {k: (v.get("stringValue") or "") for k, v in d.get("fields", {}).items()}
            f["id"] = d["name"].rsplit("/", 1)[-1]
            out.append(f)
        token = j.get("nextPageToken", "")
        if not token:
            return out


def entender(consulta):
    """None ou {"classe", "base", "num", "uf", "depois", "tribunal", "cnj"}.
    "EDcl no AgInt no REsp 1880254/MT" → classe "EDcl no AgInt no REsp", base "REsp", num "1880254", uf "MT".
    "RE 1037396 AgR-ED" → base "RE", depois "AgR-ED" (o jeito do STF de escrever a cadeia). "STF HC 123456" → tribunal "STF".
    "Ag-AIRR-1000-12.2015.5.02.0001" (número único do CNJ, TST) → num "1000-12.2015.5.02.0001". O tribunal escrito na
    busca (STF, STJ, TST, TSE, STM) vale como escolha de onde procurar."""
    toks = re.sub(r"[,;()]", " ", str(consulta or "")).split()
    tribunal = ""
    resto = []
    for t in toks:
        if t.upper() in ORDEM and not tribunal:
            tribunal = t.upper()
        else:
            resto.append(t)
    toks = resto
    for i, t in enumerate(toks):
        m = RE_CNJ.match(t)
        if m:
            cadeia = (m.group(1) or "").split("-") if m.group(1) else []
            if not cadeia and i > 0 and re.fullmatch(r"[A-Za-z]{1,10}", toks[i - 1]):
                cadeia = [toks[i - 1]]
            if not cadeia:
                return None
            return {"classe": " no ".join(cadeia), "base": cadeia[-1], "num": m.group(2),
                    "uf": "", "depois": "", "tribunal": tribunal, "cnj": True}
    achou = None
    for i, t in enumerate(toks):
        m = re.fullmatch(RE_NUM.pattern, t)
        if m:
            achou = (i, m)
            break
    if not achou:
        return None
    i, m = achou
    uf = (m.group(2) or "").upper()
    depois = ""
    j = i + 1
    if not uf and j < len(toks) and re.fullmatch(r"[-/]?[A-Za-z]{2}", toks[j]) and toks[j].lstrip("-/").upper() in UFS:
        uf = toks[j].lstrip("-/").upper()
        j += 1
    if j < len(toks) and re.fullmatch(r"[A-Za-z]{1,8}(?:-[A-Za-z]{1,8})*", toks[j]) and toks[j].upper() not in UFS:
        depois = toks[j]
    k = i - 1
    if k < 0 or not re.fullmatch(r"[A-Za-z]{1,10}", toks[k]):
        return None
    cadeia = [toks[k]]
    k -= 1
    while k >= 1 and toks[k].lower() in LIGACAO and re.fullmatch(r"[A-Za-z]{1,10}", toks[k - 1]):
        cadeia = [toks[k - 1], toks[k]] + cadeia
        k -= 2
    return {"classe": " ".join(cadeia), "base": cadeia[-1], "num": m.group(1).replace(".", ""), "uf": uf, "depois": depois,
            "tribunal": tribunal, "cnj": False}


def candidatos(e):
    """Em quais tribunais procurar, na ordem. O tribunal escrito na busca manda; senão, os que têm essa classe; se a
    classe é desconhecida, STF e STJ (os que o robô sabe buscar)."""
    if e["tribunal"]:
        return [e["tribunal"]]
    base = e["base"].lower()
    cands = [t for t in ORDEM if base in CLASSES[t]]
    if e["cnj"]:
        cands = [t for t in cands if t in ("TST", "TSE", "STM")] or ["TST"]
    return cands or ["STJ", "STF"]


def norm(texto):
    return re.sub(r"\s+", "", str(texto or "")).lower()


def lido():
    if PEDIDOS.exists():
        try:
            return json.loads(PEDIDOS.read_text(encoding="utf-8"))
        except ValueError:
            pass
    return {}


# ------------------------------------------------------------------- STJ ----
def arquivos_stj():
    arqs = sorted(ac_stj.CACHE.glob("*/*.json")) + sorted(ac_stj.CACHE.glob("*/zip-*/*.json"))
    return [a for a in arqs if not a.name.startswith("_")]


def procurar_stj(numeros):
    """{número sem zeros à esquerda: [registros do espelho]} — uma passada pelo cache para todos os pedidos
    (cada arquivo só é lido como JSON se o número aparece nele)."""
    achados = {n: [] for n in numeros}
    for arq in arquivos_stj():
        try:
            texto = arq.read_text(encoding="utf-8")
        except OSError:
            continue
        if not any(n in texto for n in numeros):
            continue
        try:
            lista = json.loads(texto)
        except ValueError:
            continue
        if not isinstance(lista, list):
            continue
        for d in lista:
            n = str(d.get("numeroProcesso", "")).lstrip("0")
            if n in achados and d.get("id"):
                achados[n].append(d)
    return achados


def escolher_stj(registros, e):
    """Os acórdãos desse processo com exatamente essa classe (acórdão antes de decisão monocrática)."""
    iguais = [d for d in registros if norm(d.get("siglaClasse")) == norm(e["classe"])]
    por_id = {}
    for d in iguais:
        por_id.setdefault(str(d["id"]), d)
    acordaos = [d for d in por_id.values() if "ACÓRDÃO" in str(d.get("tipoDeDecisao") or "").upper()]
    return acordaos or list(por_id.values())


def classes_do_processo_stj(registros):
    return sorted({str(d.get("siglaClasse")) for d in registros})


def descrever_stj(d):
    dd = str(d.get("dataDecisao") or "")
    data = f"{dd[6:8]}/{dd[4:6]}/{dd[0:4]}" if len(dd) == 8 else "?"
    return f"STJ — {d.get('siglaClasse')} {d.get('numeroProcesso')} — {d.get('nomeOrgaoJulgador')}, julgado em {data}, relator {str(d.get('ministroRelator') or '').title()}"


# ------------------------------------------------------------------- STF ----
def arquivos_stf():
    return sorted(ac_stf.CACHE.glob("*.json.gz")) if ac_stf.CACHE.exists() else []


def procurar_stf(numeros):
    """{número sem zeros à esquerda: [registros da pesquisa do STF]} — uma passada pelo cache (um arquivo por mês)."""
    achados = {n: [] for n in numeros}
    for arq in arquivos_stf():
        try:
            with gzip.open(arq, "rt", encoding="utf-8") as f:
                texto = f.read()
        except (OSError, EOFError):
            continue
        if not any(n in texto for n in numeros):
            continue
        try:
            lista = json.loads(texto)
        except ValueError:
            continue
        for d in lista if isinstance(lista, list) else []:
            n = str(d.get("processo_numero", "")).lstrip("0")
            if n in achados and d.get("id"):
                achados[n].append(d)
    return achados


def sigla_stf(e):
    """A sigla do STF para a cadeia pedida: "ED no AgR no RE" → "RE-AgR-ED" (do mais interno para o mais externo);
    "RE 1037396 AgR-ED" já vem nessa ordem."""
    if e["depois"]:
        sufixos = e["depois"].split("-")
    else:
        cadeia = [t for t in e["classe"].split() if t.lower() not in LIGACAO]
        sufixos = list(reversed(cadeia[:-1]))
    return "-".join([e["base"]] + sufixos)


def escolher_stf(registros, e):
    alvo = norm(sigla_stf(e))
    por_id = {}
    for d in registros:
        if norm(d.get("processo_classe_processual_unificada_sigla")) == alvo and d.get("ementa_texto") and d.get("julgamento_data"):
            por_id.setdefault(str(d["id"]).replace("sjur", ""), d)
    return list(por_id.values())


def classes_do_processo_stf(registros):
    return sorted({str(d.get("processo_classe_processual_unificada_sigla")) for d in registros})


def descrever_stf(d):
    return f"STF — {d.get('titulo')} — {d.get('orgao_julgador') or ''}, julgado em {str(d.get('julgamento_data') or '')[:10]}, relator {(d.get('relator_acordao_nome') or d.get('relator_processo_nome') or '').title()}"


def ids_no_site(tribunal):
    if tribunal == "STJ":
        man = RAIZ / "stj" / "acordaos" / "indice.json"
        return {r[0] for r in indice_fatiado.ler(str(man))["itens"]} if man.exists() else set()
    arq = RAIZ / "stf" / "acordaos" / "indice.json"
    return {r[0] for r in json.loads(arq.read_text(encoding="utf-8"))["itens"]} if arq.exists() else set()


FONTE_DE = {
    "STJ": dict(procurar=procurar_stj, escolher=escolher_stj, classes=classes_do_processo_stj, descrever=descrever_stj,
                item=ac_stj.item_do_espelho, gravar=ac_stj.acrescentar, id=lambda d: str(d["id"]), cache=arquivos_stj,
                coleta="Atualizar Acordaos STJ.command"),
    "STF": dict(procurar=procurar_stf, escolher=escolher_stf, classes=classes_do_processo_stf, descrever=descrever_stf,
                item=ac_stf.item_do_acordao, gravar=ac_stf.acrescentar, id=lambda d: str(d["id"]).replace("sjur", ""), cache=arquivos_stf,
                coleta="Atualizar Acórdãos.command"),
}


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--plano", action="store_true")
    ap.add_argument("--teste")
    ap.add_argument("--max", type=int, default=20)
    a = ap.parse_args()
    dados = lido()
    feitos = dados.setdefault("feitos", {})
    falhas = dados.setdefault("falhas", {})
    incluidos = dados.setdefault("incluidos", {})
    # "sem-fonte:TST" volta a ser pendente se o tribunal passou a ter fonte
    for pid, st in list(feitos.items()):
        if st.startswith("sem-fonte:") and any(t in FONTES for t in st.split(":", 1)[1].split(",")):
            del feitos[pid]
    pend = [{"id": "teste", "consulta": a.teste}] if a.teste else [p for p in pedidos() if p["id"] not in feitos]
    print(f"{len(pend)} pedido(s) pendente(s).")
    if a.plano:
        for p in pend:
            e = entender(p.get("consulta", ""))
            print(f"  {p['id']}: {p.get('consulta', '')}  →  " + (f"{e['classe']} {e['num']} {e['uf']}  em {', '.join(candidatos(e))}" if e else "não entendi"))
        return
    pend = pend[:a.max]
    por_id = {}
    for p in pend:
        e = entender(p.get("consulta", ""))
        print(f"  … “{p.get('consulta', '')}”", flush=True)
        if not e:
            print("    não entendi (escreva a classe e o número, ex.: 'EDcl no AgInt no REsp 1880254/MT')")
            feitos[p["id"]] = "nao-entendi"
            falhas[p["id"]] = {"consulta": p.get("consulta", ""), "motivo": "não entendi a classe e o número"}
            continue
        por_id[p["id"]] = (e, candidatos(e))
        print(f"    {e['classe']} {e['num']}{('/' + e['uf']) if e['uf'] else ''} → procurar em {', '.join(por_id[p['id']][1])}")
    # uma passada pelo cache de cada tribunal, para todos os pedidos
    achados = {}
    sem_cache = set()
    for trib, fonte in FONTE_DE.items():
        nums = {e["num"].lstrip("0") for e, cands in por_id.values() if trib in cands}
        if not nums:
            continue
        if not fonte["cache"]():
            sem_cache.add(trib)
            print(f"  o cache do {trib} não existe neste Mac: rode o \"{fonte['coleta']}\" e depois este de novo.")
            continue
        achados[trib] = fonte["procurar"](nums)
    novos = {t: [] for t in FONTE_DE}
    ja = {t: ids_no_site(t) for t in achados if not a.teste}
    ok = 0
    for p in pend:
        if p["id"] not in por_id:
            continue
        e, cands = por_id[p["id"]]
        notas, achou_algum, so_ja_no_site = [], False, True
        for trib in cands:
            if trib not in FONTE_DE:
                notas.append(f"{trib}: ainda sem fonte para buscar acórdãos do {trib}")
                continue
            if trib in sem_cache:
                notas.append(f"{trib}: sem o cache dos dados do {trib} neste Mac")
                continue
            fonte = FONTE_DE[trib]
            todos = achados.get(trib, {}).get(e["num"].lstrip("0"), [])
            regs = fonte["escolher"](todos, e)
            if not regs:
                outras = fonte["classes"](todos)
                notas.append(f"{trib}: " + (("o processo existe, mas só com: " + ", ".join(outras)) if outras else "não achei nos dados baixados (pode ser mais novo que a última coleta)"))
                continue
            achou_algum = True
            for d in regs:
                print(f"    achei: {fonte['descrever'](d)}")
            if a.teste:
                continue
            novas = [d for d in regs if fonte["id"](d) not in ja[trib]]
            if novas:
                so_ja_no_site = False
                novos[trib] += [fonte["item"](d) for d in novas]
                incluidos.setdefault(trib, [])
                incluidos[trib] = sorted(set(incluidos[trib]) | {fonte["id"](d) for d in novas})
            else:
                print(f"    já está no site ({trib})")
        if a.teste:
            for n in notas:
                print(f"    {n}")
            continue
        if achou_algum:
            feitos[p["id"]] = "ok" if not so_ja_no_site else "ja-no-site"
            falhas.pop(p["id"], None)
            ok += 1
        elif all(t not in FONTE_DE for t in cands):
            print(f"    {'; '.join(notas)}")
            feitos[p["id"]] = "sem-fonte:" + ",".join(cands)
            falhas[p["id"]] = {"consulta": p.get("consulta", ""), "motivo": "; ".join(notas)}
        else:
            for n in notas:
                print(f"    {n}")
            falhas[p["id"]] = {"consulta": p.get("consulta", ""), "motivo": "; ".join(notas) + " (rode a coleta de acórdãos e tente de novo)"}   # fica pendente
    if a.teste:
        return
    # grava primeiro a lista dos pedidos (os robôs dos acervos a leem), depois os acervos
    PEDIDOS.parent.mkdir(exist_ok=True)
    PEDIDOS.write_text(json.dumps(dados, ensure_ascii=False, indent=1), encoding="utf-8")
    for trib, itens in novos.items():
        if itens:
            print(f"  gravando {len(itens)} acórdão(s) no acervo do {trib}…")
            FONTE_DE[trib]["gravar"](itens)
    pendentes = [i for i in falhas if i not in feitos]
    sem = [i for i in feitos if feitos[i] in ("nao-entendi",) or feitos[i].startswith("sem-fonte:")]
    print(f"{ok} pedido(s) atendido(s); {len(pendentes)} pendente(s) (tentados de novo na próxima rodada); "
          f"{len(sem)} sem como atender agora (ver curadoria/julgados-pedidos.json).")


if __name__ == "__main__":
    main()
