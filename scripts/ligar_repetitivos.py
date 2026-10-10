"""
ligar_repetitivos.py — liga cada Tema repetitivo do STJ ao seu conteúdo completo:
  • a EMENTA do acórdão (stj/acordaos), achada pelo número do recurso (REsp …)
    ou por "Tema 1.419" no começo da ementa;
  • o julgado do INFORMATIVO do STJ (informativos/), achado por "Tema 1419" no
    título/processo — dá o número do Informativo e o resumo.
Grava stj/repetitivos/NN.json (NN = número do tema ÷ 100), que o Diário das
Decisões baixa só quando o card é aberto. Roda sozinho no GitHub a cada envio de
informativos/indice.json ou stj/acordaos/indice.json (gerar-leves.yml).
"""
import collections, json, os, re, sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import indice_fatiado  # noqa: E402
RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(RAIZ)
rd = lambda f: json.load(open(f, encoding="utf-8"))
s = open("site/decisoes/rg-repetitivos-data.js", encoding="utf-8").read()
R = json.loads(s[s.index("["):s.rindex("]") + 1])
TEMAS = {str(d["tema"]): d for d in R if d.get("orgao") == "STJ" and d.get("tipo") == "repetitivo" and d.get("tema")}
num = lambda p: re.sub(r"\D", "", re.sub(r"/[A-Z]{2}$", "", p or ""))
RX_TEMA = re.compile(r"tema\s*(?:repetitivo\s*)?(?:n[º°.o]*\s*)?(\d\.?\d{2,3})\b", re.I)

# --- acórdãos
ac = indice_fatiado.ler("stj/acordaos/indice.json")["itens"]
por_num = collections.defaultdict(list)
por_tema = collections.defaultdict(list)
for x in ac:
    por_num[num(x[1])].append(x)
    f = RX_TEMA.search(x[6][:400])
    if f and re.search(r"repetitiv|representativo", x[6][:500], re.I):
        por_tema[f[1].replace(".", "")].append(x)
escolha_ac = {}
for t, d in TEMAS.items():
    c = por_num.get(num(d.get("processo")), []) if len(num(d.get("processo"))) >= 5 else []
    c = c or por_tema.get(t, [])
    if c:
        escolha_ac[t] = sorted(c, key=lambda x: x[4])[0]

# --- informativos do STJ
inf = rd("informativos/indice.json")["itens"]
escolha_inf = {}
for x in inf:
    if x[1] != "STJ":
        continue
    for t in set(re.findall(r"Tema\s*(?:Repetitivo\s*)?(?:n\.?\s*)?(\d{1,4})\b", x[4] + " " + x[6])):
        if t in TEMAS and (t not in escolha_inf or (x[2].isdigit() and int(x[2]) > int(escolha_inf[t][2] or 0))):
            escolha_inf[t] = x

# ementas vindas do SCON (scripts/ementas_repetitivos_scon.py), para os temas sem acórdão no índice
scon = rd("stj/repetitivos-scon.json") if os.path.exists("stj/repetitivos-scon.json") else {}

cache = {}
def corpo(base, parte, id_):
    k = (base, parte)
    if k not in cache:
        cache[k] = rd(f"{base}/c/{parte:03d}.json")
    return cache[k].get(id_)

buckets = collections.defaultdict(dict)
for t in sorted((set(escolha_ac) | set(escolha_inf) | set(scon)) & set(TEMAS), key=int):
    e = {}
    a = escolha_ac.get(t)
    if a:
        c = corpo("stj/acordaos", a[9], a[0])
        if c and c.get("ementa"):
            e["ementa"] = c["ementa"]
            e["acordao"] = a[1]
            e["dataAcordao"] = a[4]
            if c.get("dec"): e["decisao"] = c["dec"]
    if "ementa" not in e and t in scon:
        e["ementa"] = scon[t]["ementa"]
        e["acordao"] = scon[t]["acordao"]
        e["dataAcordao"] = scon[t].get("dataAcordao")
        if scon[t].get("decisao"): e["decisao"] = scon[t]["decisao"]
    i = escolha_inf.get(t)
    if i:
        teor = corpo("informativos", i[8], i[0])
        e["info"] = i[2]
        e["infoTese"] = i[5]
        if teor: e["infoTeor"] = teor
    if e:
        buckets[int(t) // 100][t] = e
os.makedirs("stj/repetitivos", exist_ok=True)
for f in os.listdir("stj/repetitivos"):
    if f.endswith(".json") and int(f[:-5]) not in buckets:
        os.remove(os.path.join("stj/repetitivos", f))
for b, dado in buckets.items():
    json.dump(dado, open(f"stj/repetitivos/{b:02d}.json", "w", encoding="utf-8"), ensure_ascii=False, separators=(",", ":"))
n = sum(len(v) for v in buckets.values())
print(f"{n} de {len(TEMAS)} temas repetitivos do STJ com conteúdo completo "
      f"(ementa: {len(escolha_ac)} do índice + {len([t for t in scon if t not in escolha_ac and t in TEMAS])} do SCON; informativo: {len(escolha_inf)}).")
