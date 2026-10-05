"""
cobrancas_informativos.py — "Cobrado em…" para os julgados dos Informativos.

Para cada card de informativos/indice.json que ainda não foi cruzado, procura
nas provas da sua pasta Provas (as mesmas de cobrancas_todas_etapas.py) as
questões que citam ou reproduzem a tese, e acrescenta a ligação em
provas/cobrancas.json. O que já foi cruzado fica em
provas/informativos-cruzados.json (cada card é cruzado uma vez só).

Uso:  python3 scripts/cobrancas_informativos.py "<pasta Provas>" [--relatorio]
      (a pasta precisa ter _texto/, feito por cobrancas_extrair_texto.py)

O robô (atualizar_informativos.py, etapa COBRANCAS) chama este script sozinho
quando a pasta está registrada em provas/pasta-das-provas.txt.
"""
import collections, glob, json, os, re, sys, tempfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
args = [a for a in sys.argv[1:] if not a.startswith("--")]
if not args:
    sys.exit(__doc__)
PROVAS_DIR = args[0]
RELATORIO = "--relatorio" in sys.argv
if not os.path.isdir(os.path.join(PROVAS_DIR, "_texto")):
    sys.exit(f"Não achei {os.path.join(PROVAS_DIR, '_texto')} — rode antes scripts/cobrancas_extrair_texto.py")

feitos_f = os.path.join(ROOT, "provas", "informativos-cruzados.json")
feitos = set(json.load(open(feitos_f, encoding="utf-8"))) if os.path.exists(feitos_f) else set()
idx = json.load(open(os.path.join(ROOT, "informativos", "indice.json"), encoding="utf-8"))["itens"]
novos = [x for x in idx if x[0] not in feitos]
if not novos:
    print("Nenhum julgado de informativo novo para cruzar com as provas.")
    sys.exit(0)
print(f"{len(novos)} julgado(s) de informativo para cruzar com as provas…")

# corpus só com os julgados novos (a ligação é a mesma de cobrancas_provas.py)
corpus = [dict(src="dec", key="inf-" + x[0], org=x[1], tipo="informativo", info=str(x[2] or ""), texto=x[5]) for x in novos]
tmp = tempfile.NamedTemporaryFile("w", suffix=".json", delete=False, encoding="utf-8")
json.dump(corpus, tmp, ensure_ascii=False); tmp.close()
os.environ["COBRANCAS_CORPUS"] = tmp.name

src = open(os.path.join(ROOT, "scripts", "cobrancas_provas.py"), encoding="utf-8").read()
et = open(os.path.join(ROOT, "scripts", "cobrancas_todas_etapas.py"), encoding="utf-8").read()
_cwd = os.getcwd(); os.chdir(ROOT)
exec(src[:src.index("LIMIAR=0.6")])
exec(src[src.index("def rotulo(c):"):src.index("CK={")])
exec(et[et.index("LIMIAR = 0.6"):et.index("cob_path =")])   # unidades(), separar(), cargo()…
os.chdir(_cwd)
os.unlink(tmp.name)

cob_path = os.path.join(ROOT, "provas", "cobrancas.json")
COB = json.load(open(cob_path, encoding="utf-8"))
for p in COB["provas"]:
    p.setdefault("etapa", "objetiva")
por_rot = {p["rotulo"]: i for i, p in enumerate(COB["provas"])}
por_chave = {(p["orgao"], p["ano"], p["etapa"]): i for i, p in enumerate(COB["provas"])}
itens = collections.defaultdict(set)
for k, v in COB["itens"].items():
    for x in v: itens[k].add(tuple(x))
cards = dict(COB["cards"])
CK = {(c["src"], c["key"]): c for c in C}

stats = collections.Counter()
for (sigla, ano, etapa, banca), arqs in sorted(unidades().items()):
    base = sigla.split(" (")[0]
    rot = base + " " + ano + (sigla[len(base):] if sigla != base else "") + ROTULO_ETAPA[etapa]
    pi = por_rot.get(rot, por_chave.get((base, ano, etapa)))
    if pi is None:
        stats["prova que não está em cobrancas.json (rode cobrancas_todas_etapas.py)"] += 1
        continue
    partes = []
    for f in sorted(arqs):
        if re.search(r" \(\d\)\.txt$", f):
            continue
        t = open(f, encoding="utf-8", errors="ignore").read()
        if len(t.strip()) < 200: continue
        if etapa != "objetiva" and (len(t) > 800000 or re.search(r"RESPOSTAS DAS [ÚU]LTIMAS|\bVax\b", t[:3000] + f)):
            continue
        partes += [(0, t)] if etapa == "oral" else separar(t, etapa)
    stats["provas lidas"] += 1
    for n, q in partes:
        for i, h, cov in similares(q):
            if cov >= LIMIAR:
                k = "dec:" + C[i]["key"]
                if (pi, n) not in itens[k]:
                    itens[k].add((pi, n)); stats["ligações"] += 1
                if k not in cards:
                    r, fo = rotulo(C[i]); cards[k] = {"rotulo": r, "fonte": fo, "texto": C[i]["texto"][:400]}
print(dict(stats))
if not RELATORIO:
    import datetime
    COB["gerado"] = datetime.date.today().isoformat()
    COB["cards"] = cards
    COB["itens"] = {k: sorted(v) for k, v in itens.items()}
    json.dump(COB, open(cob_path, "w", encoding="utf-8"), ensure_ascii=False, separators=(",", ":"))
    json.dump(sorted(feitos | {x[0] for x in novos}), open(feitos_f, "w", encoding="utf-8"), separators=(",", ":"))
    print("gravado", cob_path)
