"""
cobrancas_todas_etapas.py — acrescenta ao "Cobrado em…" as provas de TODAS as
etapas (objetiva, discursiva/peça, sentença e oral) da pasta Provas do Mac,
de todas as carreiras (magistratura, defensoria, MP, delegado, procuradoria).

Uso:  python3 scripts/cobrancas_extrair_texto.py "<pasta Provas>"   (1º: texto dos PDFs)
      python3 scripts/cobrancas_todas_etapas.py  "<pasta Provas>"   (2º: liga e grava)
      (--relatorio: só mostra o que acharia, sem gravar)

Lê <Provas>/_texto/<tipo>/<BANCA>/<ANO> <SIGLA>/*.txt (tipo = "01 Objetivas",
"02 Discursivas", "03 Sentenças/Cível|Criminal", "04 Oral") e ENAM/<pasta>/*.txt.
Cada concurso + etapa vira uma "prova" em provas/cobrancas.json, com o campo
"etapa"; as provas que já estavam lá (objetivas antigas) são mantidas.
Ligação (a mesma de cobrancas_provas.py): a questão/padrão de resposta cita a
súmula ou o tema pelo número, ou reproduz boa parte do texto da tese/súmula.
Questão 0 = o documento não pôde ser separado em questões (vale o documento todo).
Ficam de fora: gabaritos e programas/pontos da prova oral (só listam assuntos).
"""
import collections, glob, json, os, re, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PROVAS_DIR = sys.argv[1]
RELATORIO = "--relatorio" in sys.argv

# reaproveita corpus, separação de questões e ligação de cobrancas_provas.py
src = open(os.path.join(ROOT, "scripts", "cobrancas_provas.py"), encoding="utf-8").read()
_cwd = os.getcwd(); os.chdir(ROOT)
exec(src[:src.index("LIMIAR=0.6")])
exec(src[src.index("def rotulo(c):"):src.index("CK={")])
os.chdir(_cwd)
LIMIAR = 0.6

ETAPA = {"01 Objetivas": "objetiva", "02 Discursivas": "discursiva", "03 Sentenças": "sentença", "04 Oral": "oral"}
ROTULO_ETAPA = {"objetiva": "", "discursiva": " — prova discursiva", "sentença": " — prova de sentença", "oral": " — prova oral"}
FORA = re.compile(r"gabarit|^gab_|programa|pontos|edital|resultado|convoca|comunicado|instruc|ata[-_ ]|aprovados|recurso", re.I)
# arquivos de padrão/espelho valem mesmo quando o nome tem "gabarito" (ex.: "gabarito-da-prova-discursiva")
PADRAO = re.compile(r"padr|espelho|abordagem|gabarito-da-prova-discursiva|gabarito-prova-de-sentenca", re.I)


def cargo(sigla):
    s = sigla.upper()
    if s.startswith("TRF"): return "Magistratura federal"
    if s.startswith("TJ"): return "Magistratura estadual"
    if s.startswith("ENAM"): return "Magistratura (ENAM)"
    if s.startswith(("DPE", "DPDF", "DPU")): return "Defensoria Pública"
    if s.startswith(("MP", "MPF", "MPT")): return "Ministério Público"
    if s.startswith("PC"): return "Delegado de Polícia"
    if s.startswith(("PGE", "PGM", "PGDF", "AGU")): return "Advocacia pública"
    return ""


def unidades():
    """{(sigla, ano, etapa, banca): [arquivos .txt]}"""
    base = os.path.join(PROVAS_DIR, "_texto")
    u = collections.defaultdict(list)
    for f in glob.glob(os.path.join(base, "**", "*.txt"), recursive=True):
        rel = os.path.relpath(f, base).split(os.sep)
        nome = rel[-1]
        if FORA.search(nome) and not PADRAO.search(nome):
            continue
        if rel[0] == "ENAM":
            m = re.match(r"(\d{4})\s+ENAM\s*-?\s*(.*)", rel[1])
            if not m: continue
            ano, extra = m[1], m[2]
            ed = re.search(r"(\d+)º", extra)
            ed = int(ed[1]) if ed else 1
            suf = " (reaplicação)" if "Reaplica" in extra else "" if ed == 1 or (ed == 1 and ano == "2024") else " (%dº exame)" % ed
            u[("ENAM" + suf, ano, "objetiva", "FGV")].append(f)
            continue
        if rel[0] not in ETAPA or len(rel) < 4:
            continue
        pasta = rel[-2]; banca = rel[-3]
        # "2021 189 TJSP" (nº do concurso), "2015 TJDFT 1º" (1º/2º concurso do ano)
        m = re.match(r"(\d{4})\s+(?:(\d+)\s+)?(\S+?)(?:\s+(\d)º)?$", pasta)
        if not m: continue
        sigla = m[3] + (" (%sº concurso)" % m[4] if m[4] else "")
        u[(sigla, m[1], ETAPA[rel[0]], banca.split(" (")[0].upper().replace("CEBRASPE", "CESPE"))].append(f)
    return u


def citacoes_etapa(q, etapa):
    """Nas objetivas, como sempre. Nas outras (textos longos, onde "tema 3" pode
    ser só "o tema 3 da prova"), o tema só vale com "repercussão geral" ou
    "repetitivo" logo antes ou depois do número."""
    res = citacoes(q, {})
    if etapa == "objetiva":
        return res
    ok = set()
    for m in RX_TEMA.finditer(q):
        perto = q[max(0, m.start() - 120):m.end() + 60]
        if not re.search(r"repercuss[ãa]o geral|repetitiv", perto, re.I):
            continue
        num = m[1].replace(".", "")
        org = "STF" if re.search(r"repercuss", perto, re.I) else "STJ"
        for i in DECKEY.get((org, "Tema", num), []):
            ok.add(C[i]["key"])
    return [(s, k) for s, k in res if s == "sum" or k in ok]


def nome_card(c):
    r, f = rotulo(c)
    if re.search(r"Tema (null|None|undefined) ", r):
        r = f
    return r, f


def separar(txt, etapa):
    """Questões da prova. Objetiva: como em cobrancas_provas.py. Outras: por "QUESTÃO n" ou o documento todo."""
    if etapa == "objetiva":
        qs = questoes(txt)
        if len(qs) >= 30:
            return qs
    L = txt.split("\n")
    marcas = [(i, int(m[1])) for i, l in enumerate(L) for m in [re.match(r"^\W{0,3}Q\s?UEST\s?[ÃA]\s?O\s*(\d{1,2})\b", l, re.I)] if m]
    if 1 <= len({n for _, n in marcas}) <= 30 and etapa != "objetiva":
        out = {}
        for k, (i, n) in enumerate(marcas):
            e = marcas[k + 1][0] if k + 1 < len(marcas) else len(L)
            out[n] = out.get(n, "") + "\n".join(L[i:e])
        return sorted(out.items())
    return [(0, txt)]


cob_path = os.path.join(ROOT, "provas", "cobrancas.json")
COB = json.load(open(cob_path, encoding="utf-8"))
for p in COB["provas"]:
    p.setdefault("etapa", "objetiva")
ja = {(p["orgao"], p["ano"], p["etapa"]) for p in COB["provas"]}
ja_rot = {p["rotulo"] for p in COB["provas"]}
itens = collections.defaultdict(set)
for k, v in COB["itens"].items():
    for x in v: itens[k].add(tuple(x))
cards = dict(COB["cards"])

CK = {(c["src"], c["key"]): c for c in C}
novas, stats = [], collections.Counter()
for (sigla, ano, etapa, banca), arqs in sorted(unidades().items()):
    base = sigla.split(" (")[0]
    rot = base + " " + ano + (sigla[len(base):] if sigla != base else "") + ROTULO_ETAPA[etapa]
    if rot in ja_rot or (base != "ENAM" and (base, ano, etapa) in ja):
        stats["já existia"] += 1; continue
    partes = []
    for f in sorted(arqs):
        if re.search(r" \(\d\)\.txt$", f):   # cópia repetida ("arquivo (1).pdf")
            continue
        t = open(f, encoding="utf-8", errors="ignore").read()
        if len(t.strip()) < 200: stats["sem texto"] += 1; continue
        # apostila de curso com respostas (ex.: compilações de provas orais com
        # centenas de páginas): a súmula citada na resposta do curso não prova
        # que ela foi cobrada — fica de fora
        if etapa != "objetiva" and (len(t) > 800000 or re.search(r"RESPOSTAS DAS [ÚU]LTIMAS|\bVax\b", t[:3000] + f)):
            stats["apostila (fora)"] += 1; print("  fora (apostila):", os.path.relpath(f, PROVAS_DIR)); continue
        # oral: a numeração recomeça em cada malote/ponto — vale a prova, sem nº de questão
        partes += [(0, t)] if etapa == "oral" else separar(t, etapa)
    if not partes: continue
    nq = len({n for n, _ in partes if n}) or 0
    if etapa == "objetiva" and nq < 30:
        stats["objetiva sem questões separadas"] += 1; print("  objetiva não separada:", rot, [os.path.basename(a) for a in arqs]); continue
    pi = len(COB["provas"])
    prova = dict(rotulo=rot, banca=banca, ano=ano, orgao=base, cargo=cargo(sigla), questoes=nq, etapa=etapa)
    lig = 0
    for n, q in partes:
        found = set()
        for s, key in citacoes_etapa(q, etapa): found.add((s, key))
        for i, h, cov in similares(q):
            if cov >= LIMIAR: found.add((C[i]["src"], C[i]["key"]))
        for s, key in found:
            k = ("sum:" + key.replace("|", ":")) if s == "sum" else ("dec:" + key)
            itens[k].add((pi, n)); lig += 1
            if k not in cards:
                c = CK[(s, key)]; r, fo = nome_card(c)
                cards[k] = {"rotulo": r, "fonte": fo, "texto": c["texto"][:400]}
    COB["provas"].append(prova); novas.append((rot, banca, nq, lig))
    stats["provas novas"] += 1; stats["ligações"] += lig

for r in novas:
    print("  %-45s %-10s questões=%-3s ligações=%s" % r)
print(dict(stats))
if not RELATORIO:
    import datetime
    COB["gerado"] = datetime.date.today().isoformat()
    COB["cards"] = cards
    COB["itens"] = {k: sorted(v) for k, v in itens.items()}
    json.dump(COB, open(cob_path, "w", encoding="utf-8"), ensure_ascii=False, separators=(",", ":"))
    print("gravado", cob_path)
