"""
cobrancas_triagem.py — arruma os PDFs SOLTOS na pasta Provas (os que você baixa do PCI Concursos, do
site da banca etc., com nomes como "gabarito (8).pdf" ou "juiz_xiv_prova_objetiva.pdf").

Para cada PDF solto na raiz da pasta, lê o começo do texto e descobre: órgão (TRF4, DPE-SC, TJSP, MPSP,
TRT15…), concurso (nº em romano), ano, banca e etapa (objetiva, discursiva, sentença ou gabarito). Depois
move para o lugar que o "Atualizar Provas" lê:

    <01 Objetivas | 02 Discursivas | 03 Sentenças/Cível|Criminal>/<BANCA>/<ANO [nº] SIGLA>/<arquivo>.pdf

Gabaritos vão para _triagem/gabaritos; cópias idênticas, para _triagem/duplicadas; o que não deu para
identificar fica onde está e é listado no fim (me mande a lista). Nada é apagado.

Uso:  python3 scripts/cobrancas_triagem.py "<pasta Provas>" [--aplicar]   (sem --aplicar só mostra o plano)
Precisa de PyMuPDF (pip install pymupdf). PDF só com imagem (sem texto) não é identificado.
"""
import collections, hashlib, json, os, re, shutil, sys, unicodedata

import fitz

RAIZ = sys.argv[1]
SIMULAR = "--aplicar" not in sys.argv     # sem --aplicar só mostra o plano
if os.path.isdir(os.path.join(RAIZ, "Provas")) and not os.path.isdir(os.path.join(RAIZ, "01 Objetivas")):
    RAIZ = os.path.join(RAIZ, "Provas")

UF = {"ACRE": "AC", "ALAGOAS": "AL", "AMAPA": "AP", "AMAZONAS": "AM", "BAHIA": "BA", "CEARA": "CE",
      "DISTRITO FEDERAL": "DF", "ESPIRITO SANTO": "ES", "GOIAS": "GO", "MARANHAO": "MA", "MATO GROSSO DO SUL": "MS",
      "MATO GROSSO": "MT", "MINAS GERAIS": "MG", "PARA": "PA", "PARAIBA": "PB", "PARANA": "PR", "PERNAMBUCO": "PE",
      "PIAUI": "PI", "RIO DE JANEIRO": "RJ", "RIO GRANDE DO NORTE": "RN", "RIO GRANDE DO SUL": "RS", "RONDONIA": "RO",
      "RORAIMA": "RR", "SANTA CATARINA": "SC", "SAO PAULO": "SP", "SERGIPE": "SE", "TOCANTINS": "TO"}
UF_ORDEM = sorted(UF, key=len, reverse=True)       # "MATO GROSSO DO SUL" antes de "MATO GROSSO"
TRF_DA_UF = {"RJ": 2, "ES": 2, "SP": 3, "MS": 3, "RS": 4, "SC": 4, "PR": 4, "MG": 6, "AC": 1, "AM": 1, "AP": 1, "BA": 1,
             "DF": 1, "GO": 1, "MA": 1, "MT": 1, "PA": 1, "PI": 1, "RO": 1, "RR": 1, "TO": 1, "AL": 5, "CE": 5, "PB": 5,
             "PE": 5, "RN": 5, "SE": 5}
ROMANOS = {"I": 1, "V": 5, "X": 10, "L": 50, "C": 100}


def sem_acento(s):
    return unicodedata.normalize("NFKD", s).encode("ascii", "ignore").decode().upper()


def romano(r):
    n, ant = 0, 0
    for ch in reversed(r):
        v = ROMANOS[ch]
        n += v if v >= ant else -v
        ant = max(ant, v)
    return n


def uf_em(txt):
    for nome in UF_ORDEM:
        if re.search(r"\b" + nome + r"\b", txt):
            return UF[nome]
    return ""


def sigla_de(txt, nome):
    txt = re.sub(r"\s+", " ", txt)        # o título da prova costuma vir quebrado em várias linhas
    t = sem_acento(txt[:5000]) + " " + sem_acento(nome)
    m = re.search(r"TRIBUNAL REGIONAL FEDERAL DA (\d)\s*[ªAO°]?\s*REGIAO|\bTRF\s*-?\s*(\d)\b|\b(\d)\s*[ªAO°]\s*REGIAO", t)
    if m and not re.search(r"TRIBUNAL REGIONAL DO TRABALHO", t[:1500]):
        return "TRF" + next(g for g in m.groups() if g)
    m = re.search(r"TRIBUNAL REGIONAL DO TRABALHO DA (\d+)\s*[ªAO°]?\s*REGIAO|\bTRT\s*-?\s*(\d+)", t)
    if m:
        return "TRT" + next(g for g in m.groups() if g)
    m = re.search(r"INSTITUTO DOS JUIZES FEDERAIS DO ESTADO D[EAO] ([A-Z ]+)", t)
    if m and uf_em(m[1]):
        return "TRF%d" % TRF_DA_UF[uf_em(m[1])]
    if re.search(r"DEFENSORIA PUBLICA DA UNIAO|\bDPU\b", t):
        return "DPU"
    m = re.search(r"DEFENSORIA PUBLICA D[OAE]\w* ESTADO D[EAO]\s+([A-Z ]+)|\bDPE\s*[-/]\s*([A-Z]{2})\b", t)
    if m:
        uf = m[2] or uf_em(m[1])
        if uf:
            return "DPE-" + uf
    m = re.search(r"DEFENSOR(?:A)? PUBLIC[OA] D[OAE]\w* ESTADO D[EAO]\s+([A-Z ]+)", t)
    if m and uf_em(m[1]):
        return "DPE-" + uf_em(m[1])
    if re.search(r"DEFENSORIA PUBLICA DO DISTRITO FEDERAL", t):
        return "DPDF"
    if re.search(r"MINISTERIO PUBLICO FEDERAL", t[:800]):
        return "MPF"
    if re.search(r"MINISTERIO PUBLICO DO TRABALHO", t[:800]):
        return "MPT"
    m = re.search(r"MINISTERIO PUBLICO D[OAE]\w* (?:ESTADO|DISTRITO FEDERAL E TERRITORIOS)?\s*D?[EAO]?\s*([A-Z ]+)", t[:800])
    if m and uf_em(m[1]):
        return "MP" + uf_em(m[1])
    m = re.search(r"TRIBUNAL DE JUSTICA D[OAE]\w* (?:ESTADO )?D?[EAO]?\s*([A-Z ]+)", t[:3000])
    if m:
        if "DISTRITO FEDERAL" in m[1]:
            return "TJDFT"
        if uf_em(m[1]):
            return "TJ" + uf_em(m[1])
    m = re.search(r"\b(TJ[A-Z]{2,3})\b", t)
    return m[1] if m else ""


def banca_de(txt, nome):
    txt = re.sub(r"\s+", " ", txt)
    t = sem_acento(txt[:6000]) + " " + sem_acento(nome)
    for rx, b in [(r"CEBRASPE|CESPE", "CESPE"), (r"\bFGV\b|FUNDACAO GETULIO VARGAS", "FGV"), (r"\bFCC\b|FUNDACAO CARLOS CHAGAS", "FCC"),
                  (r"VUNESP", "VUNESP"), (r"FUNDATEC", "FUNDATEC"), (r"FAURGS", "FAURGS"), (r"NC-?UFPR|UFPR", "UFPR"),
                  (r"IESES", "IESES"), (r"CONSULPLAN", "CONSULPLAN"), (r"IBFC", "IBFC"), (r"FUMARC", "FUMARC"), (r"ACAFE", "ACAFE"),
                  (r"\bFEPESE\b", "FEPESE"), (r"\bIDECAN\b", "IDECAN"), (r"\bIADES\b", "IADES"), (r"\bFEMPERJ\b", "FEMPERJ"),
                  (r"\bFCC\b", "FCC"), (r"UNIVERSIDADE FEDERAL DE SANTA CATARINA|UFSC", "UFSC"), (r"\bFUNCAB\b", "FUNCAB")]:
        if re.search(rx, t):
            return b
    return "OUTRAS"


def etapa_de(txt, nome):
    n = sem_acento(nome)
    t = sem_acento(txt[:2500])
    if re.search(r"GAB|PADRAO|ESPELHO", n) and not re.search(r"PADRAO|ESPELHO", n):
        return "gabarito"
    if re.search(r"^\s*(PODER JUDICIARIO\s+)?(TRIBUNAL[^\n]*\n)?[^\n]{0,80}GABARITO", t[:300]) or re.match(r"\W*GABARITO", t):
        return "gabarito"
    if re.search(r"SENTENCA", n) or re.search(r"PROVA (PRATICA )?DE SENTENCA|COM BASE NO SEGUINTE (RELATO|RELATORIO)", t):
        return "sentenca"
    if re.search(r"ESCRIT|DISCURSIV|SUBJETIV|PECA", n) or re.search(r"PROVA ESCRITA|DISCURSIV|SUBJETIV|PECA PROFISSIONAL", t):
        return "discursiva"
    if re.search(r"ORAL", n):
        return "oral"
    return "objetiva"


def anos_de(txt, nome):
    base = txt[:6000]
    m = re.search(r"(?:Janeiro|Fevereiro|Mar[cç]o|Abril|Maio|Junho|Julho|Agosto|Setembro|Outubro|Novembro|Dezembro)\s*/\s*((?:19|20)\d\d)", base, re.I)
    if m:
        return m[1]
    c = collections.Counter(re.findall(r"\b((?:200[3-9]|201\d|202[0-6]))\b", base))
    if c and c.most_common(1)[0][1] >= 2:       # um ano só uma vez pode ser data de lei citada
        return c.most_common(1)[0][0]
    m = re.search(r"((?:200[3-9]|201\d|202[0-6]))", nome)
    return m[1] if m else ""


def concurso_de(txt):
    m = re.search(r"\b([IVXL]{1,6})\s*[ºo°]?\s*CONCURSO", re.sub(r"\s+", " ", sem_acento(txt[:4000])))
    if m:
        try:
            return romano(m[1])
        except KeyError:
            pass
    m = re.search(r"CONCURSO (?:PUBLICO )?(?:N[ºO°.]*\s*)?(\d{1,3})\b", sem_acento(txt[:3000]))
    return int(m[1]) if m else 0


def concurso_do_nome(nome):
    """"juiz_xiv_prova_objetiva.pdf" → 14; "2_prova_escrita_xi.pdf" → 11."""
    m = re.search(r"(?:^|[_\- ])((?:x{0,2})(?:ix|iv|v?i{0,3}))(?=[_\-. ])", nome.lower())
    for cand in re.findall(r"(?:^|[_\- ])([ivxl]{1,6})(?=[_\-. ])", nome.lower()):
        try:
            return romano(cand.upper())
        except KeyError:
            pass
    return 0


# provas/triagem-manual.json:  {"anos": {"TRF4 14": 2010},  "arquivos": {"nome.pdf": {"sigla","n","ano","etapa","banca"}}}
# Para o que o texto do PDF não diz (ex.: TRF4 não traz o ano; cópias sem órgão). Pode ser editado à mão.
MANUAL = {"anos": {}, "arquivos": {}}
_MAN = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "provas", "triagem-manual.json")
if os.path.exists(_MAN):
    MANUAL.update(json.load(open(_MAN, encoding="utf-8")))


def md5(p):
    h = hashlib.md5()
    with open(p, "rb") as f:
        for b in iter(lambda: f.read(1 << 20), b""):
            h.update(b)
    return h.hexdigest()


def main():
    soltos = sorted(f for f in os.listdir(RAIZ) if f.lower().endswith(".pdf") and os.path.isfile(os.path.join(RAIZ, f)))
    # nomes do tipo "ZZEM__..." já têm a pasta no nome (cópia achatada): ficam como estão
    soltos = [f for f in soltos if not f.startswith("ZZEM__")]
    print(f"{len(soltos)} PDFs soltos em {RAIZ}")
    infos, vistos, dup, nao = [], {}, [], []
    for f in soltos:
        p = os.path.join(RAIZ, f)
        h = md5(p)
        if h in vistos:
            dup.append((f, vistos[h]))
            continue
        vistos[h] = f
        try:
            doc = fitz.open(p)
            txt = "".join(pg.get_text() for pg in list(doc)[:3])
            meta = doc.metadata or {}
        except Exception as e:      # noqa: BLE001
            nao.append((f, f"não abriu ({e})"))
            continue
        txt = "\n".join(l for l in txt.split("\n") if "pcimark" not in l)      # marca d'água do PCI Concursos
        extra = " ".join(str(meta.get(k) or "") for k in ("title", "subject", "keywords", "author"))
        man = MANUAL["arquivos"].get(f, {})        # o que a Barbara/Claude já definiram para este arquivo
        sig = man.get("sigla") or sigla_de(txt + " " + extra, f)
        et = man.get("etapa") or etapa_de(txt, f)
        if not sig or (len(txt.strip()) < 80 and not man):
            ini = re.sub(r"\s+", " ", txt.strip())[:140]
            nao.append((f, "sem texto" if len(txt.strip()) < 80 else f"órgão não identificado | começa com: {ini}"))
            continue
        ano = str(man.get("ano") or "") or anos_de(txt, f)
        if not ano:       # sem ano no texto: tenta o ano de criação do PDF (a banca costuma gerar o caderno no ano da prova)
            m = re.search(r"(20\d\d)", str(meta.get("creationDate") or ""))
            if m and 2003 <= int(m[1]) <= 2025:
                ano = m[1]
        n = man.get("n") or concurso_de(txt) or concurso_do_nome(f)
        if not ano and n and f"{sig} {n}" in MANUAL["anos"]:     # "TRF4 14" → 2010 (provas/triagem-manual.json)
            ano = str(MANUAL["anos"][f"{sig} {n}"])
        infos.append(dict(arq=f, p=p, sigla=sig, etapa=et, ano=ano, n=n, banca=man.get("banca") or banca_de(txt, f),
                          civel=bool(re.search(r"c[ií]vel|civil", f, re.I)), penal=bool(re.search(r"penal|criminal", f, re.I))))
    # concurso que atravessa anos (objetiva em 2015, sentença em 2016): usa o menor ano do grupo
    grupos = collections.defaultdict(list)
    for i in infos:
        if i["n"]:
            grupos[(i["sigla"], i["n"])].append(i)
    for g in grupos.values():
        anos = [x["ano"] for x in g if x["ano"] and x["etapa"] != "gabarito"]
        if anos:
            for x in g:
                x["ano"] = min(anos)
    TIPO = {"objetiva": "01 Objetivas", "discursiva": "02 Discursivas", "sentenca": "03 Sentenças", "oral": "04 Oral"}
    feitos = collections.Counter()
    sem_ano = collections.defaultdict(list)
    for i in infos:
        if not i["ano"]:
            nao.append((i["arq"], f"ano não identificado ({i['sigla']}" + (f", concurso {i['n']}" if i["n"] else "") + ")"))
            sem_ano[f"{i['sigla']} {i['n']}" if i["n"] else i["sigla"]].append(i["arq"])
            continue
        pasta_conc = f"{i['ano']} " + (f"{i['n']} " if i["n"] else "") + i["sigla"]
        if i["etapa"] == "gabarito":
            dest = os.path.join(RAIZ, "_triagem", "gabaritos", pasta_conc)
        else:
            partes = [TIPO[i["etapa"]]]
            if i["etapa"] == "sentenca" and (i["civel"] or i["penal"]):
                partes.append("Criminal" if i["penal"] and not i["civel"] else "Cível")
            dest = os.path.join(RAIZ, *partes, i["banca"], pasta_conc)
        print(f"  {i['arq']}  →  {os.path.relpath(dest, RAIZ)}")
        feitos[i["etapa"]] += 1
        if not SIMULAR:
            os.makedirs(dest, exist_ok=True)
            alvo = os.path.join(dest, i["arq"])
            k = 1
            while os.path.exists(alvo):
                k += 1
                alvo = os.path.join(dest, f"{k}_{i['arq']}")
            shutil.move(i["p"], alvo)
    if dup and not SIMULAR:
        os.makedirs(os.path.join(RAIZ, "_triagem", "duplicadas"), exist_ok=True)
        for f, _ in dup:
            shutil.move(os.path.join(RAIZ, f), os.path.join(RAIZ, "_triagem", "duplicadas", f))
    print(("(simulação) " if SIMULAR else "") + "arrumados:", dict(feitos), "| duplicados:", len(dup), "| não identificados:", len(nao))
    for f, motivo in nao:
        print(f"  ? {f}: {motivo}")
    if sem_ano:
        print("\nFaltam os ANOS destes concursos (me diga, ou preencha em provas/triagem-manual.json → \"anos\"):")
        for k, v in sorted(sem_ano.items()):
            print(f"  \"{k}\": ?    ({len(v)} arquivo(s), ex.: {v[0]})")


if __name__ == "__main__":
    main()
