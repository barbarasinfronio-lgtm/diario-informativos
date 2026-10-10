#!/usr/bin/env python3
"""
decisoes_dos_informativos.py — traz para o Diário das Decisões as decisões do STF que aparecem nos
Informativos (ADI, ADC, ADPF, ADO e Reclamação) mas ainda não estão em "Constitucionalidade" nem em
"Reclamações" (ex.: Rcl 38782, do Informativo 998). Busca o inteiro teor no portal do STF.

Roda no Mac (o portal bloqueia os servidores do GitHub), pelo "Completar Decisões dos Informativos.command":

    python3 scripts/decisoes_dos_informativos.py --plano            # só conta o que falta (roda em qualquer lugar)
    python3 scripts/decisoes_dos_informativos.py --teste "Rcl 38782" # busca e mostra, não grava
    python3 scripts/decisoes_dos_informativos.py --max 100           # 100 por vez; rode de novo para continuar

Para cada card de Informativo do STF, o processo principal é o da etiqueta "(Rcl-38782)" no fim do
título (ou o primeiro número do texto). Se ele não está nos dados, o robô abre a aba "Decisões" do
processo, pega o arquivo "Decisão de Julgamento" do andamento da data do julgamento e grava em
curadoria/decisoes-informativos.json. Depois acrescenta ao controleconst/adi_dados.js ou ao
reclamacoes/reclamacoes-data.js; a curadoria que já existe (GitHub, a cada envio) descarta o que é só
certidão de resultado e marca prioritárias/outras. Falhas ficam em curadoria/decisoes-informativos-falhas.json.
"""
import argparse, collections, json, re, signal, sys, time
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(RAIZ / "scripts"))
import completar_textos_stf as c          # noqa: E402  (achar_incidente, ler_js, gravar_js, ...)
import completar_extras_stf as ex         # noqa: E402  (buscar: inteiro teor da decisão da data)
robo = c.robo

CACHE = RAIZ / "curadoria" / "decisoes-informativos.json"
FALHAS = RAIZ / "curadoria" / "decisoes-informativos-falhas.json"
CONTROLE = "controleconst/adi_dados.js"
RECLAM = "reclamacoes/reclamacoes-data.js"
CLASSES_CONTROLE = ("ADI", "ADC", "ADPF", "ADO")
RX_PROC = re.compile(r"\b(ADI|ADC|ADPF|ADO|ADIn|Rcl|RE|ARE|MS|HC|AP|Pet|ACO|Inq|MI|SL|RHC|RMS)\s*([\d.]+)")
RX_ETIQUETA = re.compile(r"\(\s*(ADI|ADC|ADPF|ADO|Rcl)\s*-\s*(\d+)\s*\)", re.I)


def chaves(s):
    return {(m[1].replace("ADIn", "ADI"), m[2].replace(".", "")) for m in RX_PROC.finditer(s or "")}


def principal(processo):
    """(classe, número) do processo principal de um card de Informativo."""
    m = RX_ETIQUETA.search(processo or "")
    if m:
        cl = m[1].upper() if m[1].lower() != "rcl" else "Rcl"
        return cl, m[2]
    m = RX_PROC.search(processo or "")
    return (m[1].replace("ADIn", "ADI"), m[2].replace(".", "")) if m else (None, None)


def iso(d):          # 03/11/2020 → 2020-11-03
    m = re.match(r"(\d\d)/(\d\d)/(\d{4})", d or "")
    return f"{m[3]}-{m[2]}-{m[1]}" if m else ""


def ler_cache():
    return json.loads(CACHE.read_text(encoding="utf-8")) if CACHE.exists() else {}


def alvos():
    """Decisões dos informativos que ainda não estão nos dados: [(classe, num, data, card)]."""
    ja = set()
    for f in (CONTROLE, RECLAM):
        for d in c.ler_js(f)[1]:
            ja |= chaves(d.get("processo"))
    ix = json.loads((RAIZ / "informativos" / "indice.json").read_text(encoding="utf-8"))["itens"]
    vistos, out = set(), []
    for i in sorted((x for x in ix if x[1] == "STF"), key=lambda x: iso(x[7]), reverse=True):
        cl, num = principal(i[6])
        if cl not in CLASSES_CONTROLE + ("Rcl",) or (cl, num) in ja:
            continue
        if (cl, num, i[7]) in vistos:
            continue
        vistos.add((cl, num, i[7]))
        out.append((cl, num, i[7], i[0]))
    return out


def resultado(t):
    """(resultado, tipoDecisao) lido do texto da decisão; None se não der para saber."""
    x = (t or "").lower()
    ini = x[:600]
    interno = "Decisão em recurso interno" if re.search(r"agravo|embargos de declara", ini) else None
    if re.search(r"parcialmente procedente|procedente em parte|em parte procedente|julgou procedente em parte|parcial procedência", x):
        return "Procedente em parte", interno or "Decisão Final"
    if re.search(r"improcedente|julgou improcedente", x):
        return "Improcedente", interno or "Decisão Final"
    if re.search(r"julgou procedente|procedente a|procedente o pedido|procedente", x):
        return "Procedente", interno or "Decisão Final"
    if re.search(r"referend", x):
        return "Liminar referendada", "Decisão Liminar"
    if re.search(r"indeferiu[^.]{0,80}(cautelar|liminar)|negou[^.]{0,40}(cautelar|liminar)", x):
        return "Liminar indeferida", "Decisão Liminar"
    if re.search(r"deferiu[^.]{0,80}(cautelar|liminar)|concedeu[^.]{0,40}(cautelar|liminar)", x):
        return "Liminar deferida", "Decisão Liminar"
    if re.search(r"prejudicad", x):
        return "Prejudicado", interno or "Decisão Final"
    return None


def orgao(t):
    x = (t or "").lower()
    virtual = " - SESSÃO VIRTUAL" if "virtual" in x[:1500] else ""
    if re.search(r"primeira turma|1ª turma", x[:1500]):
        return "1ª TURMA" + virtual, "Colegiada"
    if re.search(r"segunda turma|2ª turma", x[:1500]):
        return "2ª TURMA" + virtual, "Colegiada"
    if re.search(r"tribunal pleno|plenário|plenario", x[:1500]):
        return "TRIBUNAL PLENO" + virtual, "Colegiada"
    return "STF", "Monocrática"


def entrada(chave, v):
    """Item no formato dos dados do site, ou None se o resultado não foi reconhecido."""
    cl, num = chave.split("|")[0].split()
    data = iso(v["data"])
    r = resultado(v["texto"])
    if not data or not r:
        return None
    base = {"id": f"STF_{cl}_{num}_{data.replace('-', '')}_inf{v['card']}", "processo": f"{cl} {num}"}
    if cl == "Rcl":
        rel, org = orgao(v["texto"])
        return {**base, "tribunal": "STF", "relator": rel, "dataJulgamento": data, "ramo": "Decisão Final",
                "tipo": r[0], "resumo": v["texto"], "completo": True, "orgao": org, "andamento": r[0]}
    return {**base, "classe": cl, "ano": int(data[:4]), "data": data, "relator": "STF", "ramo": "Constitucional",
            "tema": v["texto"], "completo": True, "andamento": r[0], "resultado": r[0], "tipoDecisao": r[1]}


def aplicar(cache):
    """Acrescenta aos dados do site o que está no cache e ainda não está lá. Devolve (controle, reclamações)."""
    novos = {CONTROLE: 0, RECLAM: 0}
    for f in (CONTROLE, RECLAM):
        pre, lista, suf, ind = c.ler_js(f)
        ids = {d["id"] for d in lista}
        ja = set()
        for d in lista:
            ja |= chaves(d.get("processo"))
        for chave, v in cache.items():
            e = entrada(chave, v)
            if not e or e["id"] in ids:
                continue
            cl = chave.split()[0]
            if (f == RECLAM) != (cl == "Rcl"):
                continue
            if (cl, chave.split("|")[0].split()[1]) in ja:
                continue
            lista.append(e)
            ids.add(e["id"])
            novos[f] += 1
        if novos[f]:
            c.gravar_js(f, pre, lista, suf, ind)
    return novos[CONTROLE], novos[RECLAM]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--plano", action="store_true")
    ap.add_argument("--teste")
    ap.add_argument("--max", type=int, default=100)
    ap.add_argument("--espera", type=float, default=1.5)
    ap.add_argument("--so-aplicar", action="store_true", help="não busca nada; só acrescenta aos dados o que já está no cache")
    a = ap.parse_args()
    cache = ler_cache()
    todos = alvos()
    pend = [x for x in todos if f"{x[0]} {x[1]}|{x[2]}" not in cache]
    por = collections.Counter(x[0] for x in pend)
    print(f"{len(todos)} decisões de informativos fora dos dados; {len(todos) - len(pend)} já buscadas; faltam {len(pend)}: {dict(por)}")
    if a.plano:
        return
    if a.so_aplicar:
        print("acrescentadas: controle %d, reclamações %d" % aplicar(cache))
        return
    if a.teste:
        k = c.processo_principal(a.teste)
        pend = [x for x in todos if (x[0].upper(), x[1]) == k]
        print(f"modo teste: {len(pend)} decisão(ões)")
    else:
        pend = pend[:a.max]
    falhas = json.loads(FALHAS.read_text(encoding="utf-8")) if FALHAS.exists() and not a.teste else {}
    incid, ok = {}, 0
    for cl, num, data, card in pend:
        chave = f"{cl} {num}|{data}"
        print(f"  … {cl} {num} ({data})", flush=True)
        try:
            if hasattr(signal, "SIGALRM"):
                signal.signal(signal.SIGALRM, lambda *_: (_ for _ in ()).throw(robo.Falha("passou de 2 minutos; pulei")))
                signal.alarm(120)
            if (cl, num) not in incid:
                incid[(cl, num)] = c.achar_incidente(cl.upper(), num)
                time.sleep(a.espera)
            t = ex.buscar(cl.upper(), num, incid[(cl, num)], data)
            time.sleep(a.espera)
            if hasattr(signal, "SIGALRM"): signal.alarm(0)
        except robo.Falha as e:
            if hasattr(signal, "SIGALRM"): signal.alarm(0)
            if "passou de" in str(e): robo._firefox_fechar()
            falhas[chave] = str(e)[:200]
            print(f"    sem sucesso: {e}")
            continue
        except KeyboardInterrupt:
            print("\ninterrompido; o que já foi buscado está guardado.")
            break
        ok += 1
        r = resultado(t)
        print(f"    {len(t)} caracteres; resultado: {r[0] if r else 'não reconhecido'}")
        if a.teste:
            print("-" * 60 + "\n" + t[:3000] + "\n" + "-" * 60)
            continue
        cache[chave] = {"data": data, "texto": t, "card": card}
        falhas.pop(chave, None)
        CACHE.write_text(json.dumps(cache, ensure_ascii=False, indent=0), encoding="utf-8")
    if not a.teste:
        FALHAS.write_text(json.dumps(falhas, ensure_ascii=False, indent=1), encoding="utf-8")
        print(f"{ok} buscada(s), {len(falhas)} sem sucesso no total.")
        print("acrescentadas aos dados: controle %d, reclamações %d" % aplicar(cache))


if __name__ == "__main__":
    main()
