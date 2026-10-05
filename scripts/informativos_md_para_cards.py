#!/usr/bin/env python3
"""
informativos_md_para_cards.py — transforma os Informativos do STF convertidos para .md
(informativo_NNN.md, nºs 1 a ~999) em cards do Diário das Decisões (informativos/).

Uso:  python3 scripts/informativos_md_para_cards.py "<pasta com os .md>"            (só mostra o que acharia)
      python3 scripts/informativos_md_para_cards.py "<pasta>" --gravar               (grava em informativos/)
      python3 scripts/informativos_md_para_cards.py arquivo.md                       (um arquivo só)

Formato do .md: "# Informativo STF nº N — período"; cada julgado é um "## [PLENÁRIO] Título" (nos
antigos "## [] Título"), com o processo em "**ADI 1/DF, rel. Min. X, julgamento em 1.1.2016**" ou no fim
do texto ("RE 1-SP, rel. Min. X, 19.2.97."). Edições que já têm cards (os PDFs de 1000 em diante) não são repetidas.
"""
import json, os, re, sys, unicodedata
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import informativos_extrair as ie

MESES = {m: i + 1 for i, m in enumerate("janeiro fevereiro março abril maio junho julho agosto setembro outubro novembro dezembro".split())}
FIM_SECAO = re.compile(r"^(repercuss|clipping|transcri|inova|outras|informa[cç][aã]o)", re.I)
CORTES = re.compile(r"\n\s*(?:\*\*)?(?:Sessões Ordinárias|CLIPPING|Clipping do|T\s*R\s*A\s*N\s*S\s*C\s*R|TRANSCRI[ÇC][ÕO]ES|INOVA[ÇC][ÕO]ES|OUTRAS INFORMA|Coordenadoria de Jurisprudência)|\n[A-ZÇÃÕÁÉÍÓÚ .-]{4,}\sN\.\s?[\d.-]+\s?\*?\s*\n\s*\n\s*RELATOR")
RX_PROC_FIM = re.compile(r"((?:[A-Z][A-Za-zÀ-ú]{0,8}\s)?(?:[A-Z]{1,6}[\s-]?)?[\d][\d.\-]*(?:[-/][A-Z]{2})?(?:\s*(?:e|,)\s*[\w.\-/]+)*[^.\n]{0,60},\s*rel\.[^\n]{0,200}?\d{1,2}\.\d{1,2}\.\d{2,4}\.?)\s*(?:\([^)]*\))?\s*$")
KW = [("Direito Tributário", r"tribut|\bicms\b|\bimposto|contribui[cç][aã]o (social|previd)|\bcofins\b|\bpis\b|\bipi\b|\biss\b"), ("Direito Processual Penal", r"processual penal|habeas|pris[aã]o|den[uú]ncia|inqu[eé]rito|j[uú]ri|pron[uú]ncia"),
      ("Direito Penal", r"\bpena\b|crime|penal|delito"), ("Direito Previdenciário", r"previdenci|aposentadoria|pens[aã]o"), ("Direito do Consumidor", r"consumidor"),
      ("Direito Ambiental", r"ambient"), ("Direito Eleitoral", r"eleitora|elegibilidade|partido"), ("Direito do Trabalho", r"trabalhist|trabalhador|justi[cç]a do trabalho|fgts"),
      ("Direito Administrativo", r"servidor|administra|licita|concurso p[uú]blico|improbidade|remunera"), ("Direito Civil", r"civil|contrato|fam[ií]lia|usucapi|indeniza")]


def area(t, proc):
    if re.match(r"(ADI|ADIn|ADC|ADO|ADPF)\b", proc or ""):
        return "Direito Constitucional"
    t = (t or "").lower()
    return next((v for v, rx in KW if re.search(rx, t)), "Direito Constitucional")


def ano4(a):
    a = int(a)
    return a if a > 99 else (1900 + a if a >= 80 else 2000 + a)


def data_proc(p):
    m = re.search(r"(\d{1,2})\.(\d{1,2})\.(\d{2,4})\.?\s*(?:\(|$)|(\d{1,2})\.(\d{1,2})\.(\d{2,4})\.?$", (p or "").strip())
    m = re.findall(r"(\d{1,2})\.(\d{1,2})\.(\d{2,4})", p or "")
    if not m:
        return ""
    d, mo, a = m[-1]
    return f"{int(d):02d}/{int(mo):02d}/{ano4(a)}"


def data_periodo(per):
    """"17 a 21 de fevereiro de 1997" / "28 de novembro a 2 de dezembro de 2016" → data final."""
    m = re.search(r"(\d{1,2})[ºo°]?\s+de\s+(\w+)\s+de\s+(\d{4})\s*$", per.strip().rstrip("."))
    if m and m[2].lower() in MESES:
        return f"{int(m[1]):02d}/{MESES[m[2].lower()]:02d}/{m[3]}"
    return ""


def limpa_titulo(t):
    t = re.sub(r"\s+", " ", t).strip()
    return re.sub(r"\s*-\s*\d+\s*$", "", t), t


def colegiado_de(txt):
    u = unicodedata.normalize("NFD", txt.upper())
    u = "".join(c for c in u if unicodedata.category(c) != "Mn")
    if "PRIMEIRA TURMA" in u or re.search(r"\b1\s?TURMA", u): return "Primeira Turma"
    if "SEGUNDA TURMA" in u or re.search(r"\b2\s?TURMA", u): return "Segunda Turma"
    if "PLENARIO" in u: return "Plenário"
    return ""


def extrair(caminho):
    t = open(caminho, encoding="utf-8", errors="replace").read()
    m = re.match(r"#\s*Informativo STF n[ºo°]\s*(\d+)\s*[—–-]\s*(.*)", t)
    if not m:
        mm = re.search(r"informativo_(?:informativo)?(\d+)", os.path.basename(caminho))
        numero, periodo = (int(mm[1]) if mm else None), ""
    else:
        numero, periodo = int(m[1]), m[2].strip()
    dper = data_periodo(periodo)
    # secções "## [COLEGIADO] Título" até o próximo "## " ou "---"
    partes = re.split(r"(?m)^## \[(.*?)\] (.*)$", t)
    itens, ultimo = [], ""
    for i in range(1, len(partes), 3):
        col, titulo, corpo = partes[i], partes[i + 1].strip(), partes[i + 2]
        tnorm = re.sub(r"\s+", "", titulo)
        if re.match(r"^(clipping|transcri|inova|outras)", tnorm, re.I):
            break                      # daqui para a frente não há mais julgados
        if FIM_SECAO.match(tnorm):
            continue                   # "repercussao" (índice) e afins: pula só esta seção
        corpo = corpo.split("\n---", 1)[0] if "\n---" in corpo else corpo
        ultimo_corte = CORTES.search("\n" + corpo)
        if ultimo_corte:
            corpo = ("\n" + corpo)[:ultimo_corte.start()]
        # colegiado: do colchete, ou do último cabeçalho solto ("PRIMEIRA TURMA") visto no texto anterior
        c = colegiado_de(col) or ultimo or "Plenário"
        for solto in re.findall(r"(?m)^\s*(PLEN[ÁA]RIO|PRIMEIRA TURMA|SEGUNDA TURMA)\s*$", partes[i + 2]):
            ultimo = colegiado_de(solto)
        ultimo = c if not ultimo else (colegiado_de(col) or ultimo)
        linhas = [l.rstrip() for l in corpo.strip().splitlines()]
        proc = ""
        corpo_l = []
        for l in linhas:
            s = l.strip()
            if re.fullmatch(r"(PLEN[ÁA]RIO|PRIMEIRA TURMA|SEGUNDA TURMA|1[ªa]? TURMA|2[ªa]? TURMA)", s, re.I):
                continue     # cabeçalho da próxima seção, que veio parar no fim deste texto
            if re.fullmatch(r"\d[ªa]\s*Parte:?", s):
                continue     # restos da conversão ("1ª Parte:")
            if not s or set(s) <= {"*"}:
                corpo_l.append("")
                continue
            mp = re.fullmatch(r"\*\*(.+?,\s*rel\..+?)\*\*", s)
            if mp and not proc:
                proc = mp[1]
                continue
            base_t = re.sub(r"\s*-\s*\d+\s*$", "", titulo)
            if re.fullmatch(re.escape(base_t) + r"(?:" + re.escape(base_t) + r")?(?:\s*-\s*\d+)?", s):
                continue     # o título repetido no texto ("Título" + "Título - 2")
            corpo_l.append(s)
        texto = re.sub(r"\n{3,}", "\n\n", "\n".join(corpo_l)).strip()
        texto = re.sub(r"\s+", " ", texto)
        if not proc:
            mp = RX_PROC_FIM.search(texto)
            if mp:
                proc = mp[1].strip()
                texto = texto[:mp.start()].strip()
            elif re.search(r",\s*rel\.", texto[-260:]):      # processo no fim, em formato menos comum
                k = texto.rfind(", rel.")
                ini = max(texto.rfind(". ", 0, k) + 2, k - 300, 0)
                if re.search(r"\d{1,2}\.\d{1,2}\.\d{2,4}", texto[k:]):
                    proc = texto[ini:].strip()
                    texto = texto[:ini].strip()
        else:
            texto = re.sub(re.escape(proc), "", texto).strip()
        if not texto:
            continue
        base, tit_orig = limpa_titulo(titulo)
        itens.append(dict(org="STF", info=str(numero), area=area(texto + " " + base, proc), tit=base[:260],
                          tese=ie._corta(texto, 700), proc=proc or f"Informativo STF nº {numero}", data=data_proc(proc) or dper,
                          teor=texto, _col=c, _orig=tit_orig))
    # junta as partes "- 1", "- 2" do mesmo julgado (mesmo título-base e mesmo processo)
    juntos = []
    for it in itens:
        if juntos and it["tit"] == juntos[-1]["tit"] and it["_orig"] != it["tit"] and (it["proc"] == juntos[-1]["proc"] or it["proc"].startswith("Informativo") or juntos[-1]["proc"].startswith("Informativo")):
            juntos[-1]["teor"] = (juntos[-1]["teor"] + " " + it["teor"]).strip()
            if it["proc"] and not it["proc"].startswith("Informativo"):
                juntos[-1]["proc"] = it["proc"]; juntos[-1]["data"] = it["data"] or juntos[-1]["data"]
        else:
            juntos.append(it)
    for it in juntos:
        it["tese"] = ie._corta(it["teor"], 700)
        it.pop("_col", None); it.pop("_orig", None)
    return numero, juntos


if __name__ == "__main__":
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    if not args:
        sys.exit(__doc__)
    alvo = args[0]
    arqs = [alvo] if os.path.isfile(alvo) else sorted(
        (os.path.join(r, f) for r, _, fs in os.walk(alvo) for f in fs if re.match(r"informativo_(informativo)?\d+\.md$", f, re.I)),
        key=lambda p: int(re.search(r"(\d+)\.md$", p)[1]))
    if not arqs:
        sys.exit(f"Não achei informativo_NNN.md em {alvo!r}")
    ja = ie.edicoes_gravadas().get("STF", set())
    todos, sem = [], []
    for a in arqs:
        n, its = extrair(a)
        if n in ja:
            continue
        if not its: sem.append(n)
        todos.extend(its)
    print(f"{len(arqs)} arquivos; {len(todos)} julgados em {len({i['info'] for i in todos})} informativos; sem julgados: {sem[:20]}")
    if "--gravar" in sys.argv:
        ids = ie.acrescentar(todos)
        print(f"{len(ids)} card(s) novo(s) gravado(s) em informativos/.")
    else:
        for i in todos[:6]:
            print(f"- STF {i['info']} · {i['area']} · {i['tit']} · {i['data']}\n    proc: {i['proc'][:90]}\n    tese: {i['tese'][:160]}")
