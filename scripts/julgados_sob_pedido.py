#!/usr/bin/env python3
"""
julgados_sob_pedido.py — atende os pedidos de "Pedir este julgado" do Diário das Decisões.

Quem busca um julgado que não está no site (ex.: "EDcl no AgInt no REsp 1880254/MT") pode clicar em "Pedir este
julgado": o site grava o pedido no Firestore (coleção pedidos-julgados, um por busca). Este robô lê os pedidos,
entende a classe (com os "no/na": "EDcl no AgInt no REsp"), o número e a UF, procura o acórdão nos dados abertos do
STJ (os "espelhos de acórdãos" que scripts/acordaos_stj.py já baixa para ~/EstudaMana/cache-stj-acordaos/) e, achando,
acrescenta o acórdão ao grupo "Acórdãos STJ" (stj/acordaos/), SEM passar pelo filtro de conteúdo: quem pediu quer
aquele julgado, mesmo que uma rodada normal o descartasse (ex.: embargos rejeitados, recurso só processual).

Por enquanto só o STJ: classes que só existem no STF (RE, ARE, ADI, ADPF…) ficam registradas como "não suportado".
O STJ barra programas na pesquisa de jurisprudência, por isso a fonte é a dos dados abertos (como em teor_stj.py).
Se o acórdão não está no cache (é mais novo que a última coleta), o pedido fica pendente e aparece em
curadoria/julgados-pedidos.json: rode "Atualizar Acordaos STJ.command" e depois este de novo.

Roda no Mac, pelo "Atender Pedidos de Julgados.command":

    python3 scripts/julgados_sob_pedido.py --plano                                  # só lista os pedidos pendentes
    python3 scripts/julgados_sob_pedido.py --max 20                                 # atende até 20
    python3 scripts/julgados_sob_pedido.py --teste "EDcl no AgInt no REsp 1880254/MT"   # procura e mostra, não grava
"""
import argparse, json, re, sys, urllib.parse
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(RAIZ / "scripts"))
import acordaos_stj as ac  # noqa: E402
import indice_fatiado  # noqa: E402
import leis_citadas as lc  # noqa: E402
robo = lc.robo

PEDIDOS = RAIZ / "curadoria" / "julgados-pedidos.json"   # {"feitos": {id: status}, "falhas": {id: {consulta, motivo}}}
FIRESTORE = "https://firestore.googleapis.com/v1/projects/diariodeinformativos/databases/(default)/documents/pedidos-julgados"
API_KEY = "AIzaSyAe0g7Ps4d_uXvh1IiFTtDICwZ91YOUto0"      # chave pública do site (site/conta/nuvem-shared.js)

LIGACAO = {"no", "na", "nos", "nas"}
# classes que só existem no STF: o robô ainda não atende (as outras — REsp, HC, RMS, Rcl… — são procuradas no STJ)
SO_STF = {"re", "are", "adi", "adc", "adpf", "ado", "adin", "ai", "aci", "aco", "ao", "ap", "inq", "mi", "sl", "sta", "rvc",
          "ext", "pps", "prc", "rp", "tpa", "stp"}


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
    """(classe, número, UF) ou None. "EDcl no AgInt no REsp 1880254/MT" → ("EDcl no AgInt no REsp", "1880254", "MT").
    Acha o primeiro número de processo (4 a 9 dígitos, com ou sem pontos) e lê para trás a classe, com os "no/na/nos/nas"."""
    toks = re.sub(r"[,;()]", " ", str(consulta or "")).split()
    achou = None
    for i, t in enumerate(toks):
        m = re.fullmatch(r"(\d{1,3}(?:\.\d{3})+|\d{4,9})(?:\s*[-/]\s*([A-Za-z]{2}))?", t)
        if m:
            achou = (i, m)
            break
    if not achou:
        return None
    i, m = achou
    uf = (m.group(2) or "").upper()
    if not uf and i + 1 < len(toks) and re.fullmatch(r"[-/]?[A-Za-z]{2}", toks[i + 1]):
        uf = toks[i + 1].lstrip("-/").upper()
    j = i - 1
    if j < 0 or not re.fullmatch(r"[A-Za-z]{1,10}", toks[j]):
        return None
    cadeia = [toks[j]]
    j -= 1
    while j >= 1 and toks[j].lower() in LIGACAO and re.fullmatch(r"[A-Za-z]{1,10}", toks[j - 1]):
        cadeia = [toks[j - 1], toks[j]] + cadeia
        j -= 2
    return " ".join(cadeia), m.group(1).replace(".", ""), uf


def so_stf(classe):
    return classe.split()[-1].lower() in SO_STF


def norm(classe):
    return re.sub(r"\s+", " ", str(classe or "")).strip().lower()


def arquivos_do_cache():
    arqs = sorted(ac.CACHE.glob("*/*.json")) + sorted(ac.CACHE.glob("*/zip-*/*.json"))
    return [a for a in arqs if not a.name.startswith("_")]


def procurar(numeros):
    """{número sem zeros à esquerda: [registros do espelho]} — uma passada pelo cache para todos os pedidos
    (cada arquivo só é lido como JSON se o número aparece nele)."""
    achados = {n: [] for n in numeros}
    for arq in arquivos_do_cache():
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


def escolher(registros, classe):
    """Os acórdãos desse processo com exatamente essa classe (acórdão antes de decisão monocrática)."""
    iguais = [d for d in registros if norm(d.get("siglaClasse")) == norm(classe)]
    por_id = {}
    for d in iguais:
        por_id.setdefault(str(d["id"]), d)
    acordaos = [d for d in por_id.values() if "ACÓRDÃO" in str(d.get("tipoDeDecisao") or "").upper()]
    return acordaos or list(por_id.values())


def ids_no_site():
    man = RAIZ / "stj" / "acordaos" / "indice.json"
    return {r[0] for r in indice_fatiado.ler(str(man))["itens"]} if man.exists() else set()


def descrever(d):
    dd = str(d.get("dataDecisao") or "")
    data = f"{dd[6:8]}/{dd[4:6]}/{dd[0:4]}" if len(dd) == 8 else "?"
    return f"{d.get('siglaClasse')} {d.get('numeroProcesso')} — {d.get('nomeOrgaoJulgador')}, julgado em {data}, relator {str(d.get('ministroRelator') or '').title()}"


def lido():
    if PEDIDOS.exists():
        try:
            return json.loads(PEDIDOS.read_text(encoding="utf-8"))
        except ValueError:
            pass
    return {"feitos": {}, "falhas": {}}


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--plano", action="store_true")
    ap.add_argument("--teste")
    ap.add_argument("--max", type=int, default=20)
    a = ap.parse_args()
    dados = lido()
    feitos, falhas = dados.setdefault("feitos", {}), dados.setdefault("falhas", {})
    if a.teste:
        pend = [{"id": "teste", "consulta": a.teste}]
    else:
        pend = [p for p in pedidos() if p["id"] not in feitos]
    print(f"{len(pend)} pedido(s) pendente(s).")
    if a.plano:
        for p in pend:
            print(f"  {p['id']}: {p.get('consulta', '')}  →  {entender(p.get('consulta', '')) or 'não entendi'}")
        return
    pend = pend[:a.max]
    leituras = {}
    for p in pend:
        e = entender(p.get("consulta", ""))
        print(f"  … “{p.get('consulta', '')}”", flush=True)
        if not e:
            print("    não entendi (escreva a classe e o número, ex.: 'EDcl no AgInt no REsp 1880254/MT')")
            feitos[p["id"]] = "nao-entendi"
            falhas[p["id"]] = {"consulta": p.get("consulta", ""), "motivo": "não entendi a classe e o número"}
            continue
        if so_stf(e[0]):
            print(f"    {e[0]} é classe do STF: por enquanto o robô só atende julgados do STJ")
            feitos[p["id"]] = "so-stj"
            falhas[p["id"]] = {"consulta": p.get("consulta", ""), "motivo": "classe do STF (o robô só atende o STJ por enquanto)"}
            continue
        leituras[p["id"]] = e
    if leituras and not arquivos_do_cache():
        print("  o cache dos dados abertos do STJ não existe neste Mac: rode o \"Atualizar Acordaos STJ.command\" e depois este de novo.")
        leituras = {}
    achados = procurar({e[1] for e in leituras.values()}) if leituras else {}
    ja = ids_no_site() if leituras else set()
    novos, ok = [], 0
    for p in pend:
        e = leituras.get(p["id"])
        if not e:
            continue
        classe, num, uf = e
        regs = escolher(achados.get(num, []), classe)
        if not regs:
            outras = sorted({str(d.get("siglaClasse")) for d in achados.get(num, [])})
            motivo = ("o processo existe nos dados abertos, mas só com: " + ", ".join(outras)) if outras else \
                "não achei nos dados abertos do STJ baixados (pode ser mais novo que a última coleta: rode o \"Atualizar Acordaos STJ.command\")"
            print(f"    {motivo}")
            falhas[p["id"]] = {"consulta": p.get("consulta", ""), "motivo": motivo}   # fica pendente: tenta de novo na próxima rodada
            continue
        for d in regs:
            print(f"    achei: {descrever(d)}")
        if a.teste:
            continue
        novas = [d for d in regs if str(d["id"]) not in ja]
        if not novas:
            print("    já está no site")
            feitos[p["id"]] = "ja-no-site"
            falhas.pop(p["id"], None)
            continue
        novos += [ac.item_do_espelho(d) for d in novas]
        feitos[p["id"]] = "ok"
        falhas.pop(p["id"], None)
        ok += 1
    if a.teste:
        return
    if novos:
        ac.acrescentar(novos)
    PEDIDOS.parent.mkdir(exist_ok=True)
    PEDIDOS.write_text(json.dumps(dados, ensure_ascii=False, indent=1), encoding="utf-8")
    pendentes = [i for i in falhas if i not in feitos]
    print(f"{ok} pedido(s) atendido(s); {len(pendentes)} pendente(s) (tentados de novo na próxima rodada); "
          f"{len([i for i in feitos if feitos[i] in ('nao-entendi', 'so-stj')])} sem como atender (ver curadoria/julgados-pedidos.json).")


if __name__ == "__main__":
    main()
