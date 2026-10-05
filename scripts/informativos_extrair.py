"""
informativos_extrair.py — lê o PDF (ou a página) de um Informativo do STF/STJ e
devolve os julgados prontos para virar cards do Diário das Decisões, e
acrescenta esses cards em informativos/indice.json + informativos/c/NNN.json.

Usado pelo robô (scripts/atualizar_informativos.py, etapa "CARDS"), mas
também funciona sozinho:

    python3 scripts/informativos_extrair.py STF 1227 Informativo_stf_1227.pdf
    python3 scripts/informativos_extrair.py STJ 902 GetPDFINFJ902.pdf --gravar

Sem --gravar só mostra o que encontrou. O formato dos cards é o mesmo de
scripts/informativos_cards.py (que refaz tudo a partir do JSON consolidado).

Leitura do PDF: PyMuPDF (já usado em cobrancas_extrair_texto.py) separa os
parágrafos em blocos; sem ele, usa o texto corrido (pdftotext/PDFKit) dividido
em linhas em branco — funciona, mas o "resumo" do STF pode sair maior.
"""
import hashlib
import html as _html
import json
import os
import re
import sys
import unicodedata
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
BASE = RAIZ / "informativos"
POR_PARTE = 250


# ------------------------------------------------------------------ texto
def _limpa(t):
    t = (t or "").replace("\xad\n", "").replace("\xad", "")
    t = re.sub(r"(\w)- (\w)", r"\1\2", t)           # hifenização de quebra de linha
    t = re.sub(r"\s+", " ", t)
    t = re.sub(r"\s+([,;])", r"\1", t)        # "REsp 1.806.555-SP ," (página do STJ)
    return t.strip()


def blocos_do_texto(texto):
    """Texto corrido → blocos (parágrafos separados por linha em branco)."""
    return [b for b in (_limpa(x) for x in re.split(r"\n\s*\n", texto or "")) if b]


def blocos_de_html(pagina):
    """Página HTML da edição (STJ) → blocos."""
    t = re.sub(r"(?is)<(script|style)\b.*?</\1>", " ", pagina)
    t = re.sub(r"(?i)</?(p|div|li|ul|ol|h\d|tr|table|section|article|br)\b[^>]*>", "\n\n", t)
    t = _html.unescape(re.sub(r"<[^>]+>", " ", t))
    bl = blocos_do_texto(t)
    # na página, os rótulos costumam vir em "Caixa Baixa" e sozinhos: volta a MAIÚSCULAS
    rot = re.compile(r"^(processo|ramo do direito|tema|destaque|informa[çc][õo]es do inteiro teor|informa[çc][õo]es adicionais)\s*:?$", re.I)
    return [b.upper() if rot.match(b) else b for b in bl]


def blocos_de_pdf(corpo, texto_de_pdf=None):
    """Bytes do PDF → blocos. PyMuPDF se houver; senão "texto_de_pdf(corpo)"."""
    try:
        try:
            import pymupdf as fitz
        except ImportError:
            import fitz
        doc = fitz.open(stream=corpo, filetype="pdf")
        saida = []
        for pg in doc:
            for b in pg.get_text("blocks"):
                if len(b) > 6 and b[6] != 0:      # só texto (não imagem)
                    continue
                t = _limpa(b[4])
                if t:
                    saida.append(t)
        if saida:
            return saida
    except Exception:
        pass
    if texto_de_pdf:
        return blocos_do_texto(texto_de_pdf(corpo))
    raise RuntimeError("sem leitor de PDF (instale PyMuPDF: pip3 install pymupdf)")


def _norm(s):
    s = unicodedata.normalize("NFD", (s or "").lower())
    return re.sub(r"[^a-z0-9]+", " ", "".join(c for c in s if unicodedata.category(c) != "Mn")).strip()


PREP = re.compile(r"\b(De|Do|Da|Dos|Das|E|Em)\b")


def _titulo_area(r):
    r = r.split(",")[0].strip().title()
    return PREP.sub(lambda m: m[1].lower(), r)


def _data(p):
    m = re.search(r"(\d{1,2})[./](\d{1,2})[./](\d{4})", p or "")
    return f"{int(m[1]):02d}/{int(m[2]):02d}/{m[3]}" if m else ""


def _corta(t, n=900):
    if len(t) <= n:
        return t
    c = t[:n]
    k = max(c.rfind(". "), c.rfind("; "))
    return c[:k + 1] if k > 200 else c


# ------------------------------------------------------------------ STF
RX_FIM = re.compile(r"^»\s*(?P<p>.+?(?:julgamento|julgado)[^»]*?\d{1,2}\.\d{1,2}\.\d{4})", re.S)
CAB_STF = re.compile(r"^(\d+\s*)?(SUMÁRIO\s*)?INFORMATIVO STF\s*$|^Edição \d+/\d+\s+\d{1,2} de \w+ de \d{4}\s*$"
                     r"|^[123]\s+(PLENÁRIO|TURMAS|INOVAÇÕES NORMATIVAS STF)\s*$|^[12]ª\s+TURMA\s*$"
                     r"|^Nenhum caso foi selecionado\.?\s*$", re.I)


def parse_stf(blocos, info):
    blocos = [b.lstrip("\t ") for b in blocos]
    fins = [i for i, b in enumerate(blocos) if RX_FIM.match(b)]
    if not fins:
        return []
    # o corpo começa depois do último "1 PLENÁRIO" anterior ao primeiro julgado
    ini = 0
    for i, b in enumerate(blocos[:fins[0]]):
        if re.match(r"^1\s+PLENÁRIO\s*$", b):
            ini = i + 1
    itens, de = [], ini
    for f in fins:
        if f < de:
            continue
        trecho = [b for b in blocos[de:f] if not CAB_STF.match(b)]
        marca = RX_FIM.match(blocos[f])["p"]
        de = f + 1
        # "23:59" sobra de linha quebrada logo depois do marcador
        while de < len(blocos) and re.match(r"^(às\s*)?\d{1,2}:\d{2}$", blocos[de]):
            de += 1
        # onde está "Relator:" (a última ocorrência, se o trecho tiver mais de um julgado)
        ir = max((i for i, b in enumerate(trecho) if re.match(r"^Relator(a)?:", b)), default=None)
        if ir is None:
            continue
        resto = trecho[ir + 1:]
        area = next((b for b in resto if re.match(r"^DIREITO\b", b)), "")
        ramo = _titulo_area(re.split(r"\s{2,}|;", area)[0]) if area else ""
        ires = next((i for i, b in enumerate(resto) if re.match(r"^RESUMO:?", b)), None)
        if ires is None:
            continue
        cab = re.match(r"^RESUMO:?\s*(.*)$", resto[ires])
        corpo = ([cab[1]] if cab and cab[1] else []) + [b for i, b in enumerate(resto) if i > ires and b != area
                                                       and not re.fullmatch(r"[A-ZÁÉÍÓÚÂÊÔÃÕÇ;, ()/.-]{15,}", b)]
        if not corpo:
            continue
        tese = _corta(corpo[0])
        teor = " ".join(corpo)
        proc = _limpa(marca)
        tit = re.split(r",\s*relator", proc)[0]
        itens.append(dict(org="STF", info=str(info), area=ramo or _area_kw(tese, proc), tit=tit[:260],
                          tese=tese, proc=proc, data=_data(proc), teor=teor))
    return itens


# ------------------------------------------------------------------ STJ
ROTULO = [("processo", r"PROCESSO\b"), ("ramo", r"RAMO DO DIREITO\b"), ("tema", r"TEMA\b"),
          ("destaque", r"DESTAQUE"), ("teor", r"INFORMAÇÕES DO INTEIRO TEOR\b"),
          ("adic", r"INFORMAÇÕES ADICIONAIS\b")]
RUIDO_STJ = re.compile(r"^(Informativo de Jurisprudência( n\.? ?\d+.*)?|processo\.stj\.jus\.br/\S+ \d+/\d+"
                       r"|Este periódico destaca.*|Número \d+ Brasília.*|VÍDEO DO JULGAMENTO.*)$", re.I)
SECAO = re.compile(r"^(RECURSOS REPETITIVOS|CORTE ESPECIAL|(PRIMEIRA|SEGUNDA|TERCEIRA) SEÇÃO|"
                   r"(PRIMEIRA|SEGUNDA|TERCEIRA|QUARTA|QUINTA|SEXTA) TURMA|QUESTÃO DE ORDEM)\s*$", re.I)


def _rotulo(b):
    for nome, rx in ROTULO:
        m = re.match(rx, b)
        if m:
            return nome, b[m.end():].strip(" :")
    return None, b


def parse_stj(blocos, info):
    # tira cabeçalhos/rodapés, inclusive colados no começo/fim de um bloco
    lim = []
    for b in blocos:
        b = re.sub(r"processo\.stj\.jus\.br/\S+ \d+/\d+", " ", b)
        b = re.sub(r"Informativo de Jurisprudência n\.? ?\d+[^.]*\d{4}\.", " ", b)
        b = _limpa(b)
        b = re.sub(r"^(RECURSOS REPETITIVOS|CORTE ESPECIAL|(PRIMEIRA|SEGUNDA|TERCEIRA) SEÇÃO|"
                   r"(PRIMEIRA|SEGUNDA|TERCEIRA|QUARTA|QUINTA|SEXTA) TURMA)\s*(?=PROCESSO|TEMA|RAMO)", "", b)
        if b and not RUIDO_STJ.match(b):
            lim.append(b)
    # cada julgado termina em "INFORMAÇÕES ADICIONAIS"; o próximo começa no 1º bloco
    # que abre com PROCESSO/TEMA/RAMO/DESTAQUE ou com o nome da seção
    itens_blocos, atual, em_adic = [], [], False
    for b in lim:
        nome, _ = _rotulo(b)
        if nome == "adic":
            em_adic = True
            atual.append(b)
            continue
        if em_adic and (nome in ("processo", "ramo", "tema", "destaque") or SECAO.match(b)):
            itens_blocos.append(atual)
            atual, em_adic = [], False
        if em_adic:
            atual.append(b)          # legislação, súmulas, "saiba mais"…: fica fora dos campos
        else:
            atual.append(b)
    if atual:
        itens_blocos.append(atual)
    itens = []
    for blks in itens_blocos:
        campos = {k: [] for k, _ in ROTULO}
        cur, ultimo_prosa = None, None
        for b in blks:
            nome, resto = _rotulo(b)
            if nome:
                cur = nome
                if nome in ("tema", "destaque", "teor"):
                    ultimo_prosa = nome
                if resto:
                    campos[nome].append(resto)
                continue
            if SECAO.match(b):
                continue
            if cur == "processo" and not re.search(r"julgad[oa] em", " ".join(campos["processo"])):
                campos["processo"].append(b)
            elif cur in ("processo", "ramo", "adic") and ultimo_prosa and cur != "adic":
                campos[ultimo_prosa].append(b)
            elif cur and cur != "adic":
                campos[cur].append(b)
        proc = _limpa(" ".join(campos["processo"]))
        dest = _limpa(" ".join(campos["destaque"]))
        teor = _limpa(" ".join(campos["teor"]))
        if not proc or not dest or not teor:
            if os.environ.get("INF_DEBUG"):
                print("  descartado:", bool(proc), bool(dest), bool(teor), (blks[0] if blks else "")[:80])
            continue
        ramo = _limpa(" ".join(campos["ramo"]))
        tema = _limpa(" ".join(campos["tema"]))
        ramo = _titulo_area(re.split(r",|\s+(?=DIREITO\b)", ramo.replace("DIREITO ", "Direito ", 1))[0]) if ramo else ""
        itens.append(dict(org="STJ", info=str(info), area=ramo or _area_kw(dest, proc),
                          tit=(tema or proc.split(",")[0])[:260], tese=dest, proc=proc,
                          data=_data(re.search(r"julgad[oa] em\s*[\d/]+", proc).group(0)
                                     if re.search(r"julgad[oa] em\s*[\d/]+", proc) else proc), teor=teor))
    return itens


KW = [("Direito Tributário", r"tribut|icms|imposto|contribuiç"), ("Direito Processual Penal", r"processual penal|habeas|prisão|denúncia|inquérito"),
      ("Direito Penal", r"penal|crime|pena\b"), ("Direito Previdenciário", r"previdenci|aposentadoria"), ("Direito do Consumidor", r"consumidor"),
      ("Direito Ambiental", r"ambient"), ("Direito Eleitoral", r"eleitora"), ("Direito do Trabalho", r"trabalhist|trabalhador|justiça do trabalho"),
      ("Direito Administrativo", r"servidor|administra|licita|concurso público|improbidade"), ("Direito Civil", r"civil|contrato|família")]


def _area_kw(tese, proc):
    if re.match(r"(ADI|ADC|ADO|ADPF)\b", proc or ""):
        return "Direito Constitucional"
    t = (tese + " " + (proc or "")).lower()
    return next((v for v, rx in KW if re.search(rx, t)), "Direito Constitucional")


def extrair(org, info, blocos):
    return (parse_stf if org == "STF" else parse_stj)(blocos, info)


# ------------------------------------------------------------------ gravação
def _id(i):
    return hashlib.md5((i["org"] + i["info"] + i["proc"] + i["tese"]).encode()).hexdigest()[:10]


def _chave_data(i):
    m = re.match(r"(\d{2})/(\d{2})/(\d{4})", i["data"] or "")
    return m[3] + m[2] + m[1] if m else "0"


def edicoes_gravadas(base=BASE):
    f = base / "indice.json"
    if not f.exists():
        return {"STF": set(), "STJ": set()}
    d = json.loads(f.read_text(encoding="utf-8"))
    r = {"STF": set(), "STJ": set()}
    for x in d["itens"]:
        r.setdefault(x[1], set()).add(int(x[2]) if str(x[2]).isdigit() else 0)
    return r


def acrescentar(itens, base=BASE):
    """Põe os julgados em informativos/. Devolve a lista de ids gravados.
    Julgado que já está (mesmo id, ou mesma tese no mesmo informativo) é ignorado."""
    f = base / "indice.json"
    d = json.loads(f.read_text(encoding="utf-8"))
    ja_id = {x[0] for x in d["itens"]}
    ja_tese = {(x[1], x[2], _norm(x[5])[:120]) for x in d["itens"]}
    novos = []
    for i in sorted(itens, key=_chave_data, reverse=True):
        i["id"] = _id(i)
        k = (i["org"], i["info"], _norm(i["tese"])[:120])
        if i["id"] in ja_id or k in ja_tese:
            continue
        ja_id.add(i["id"]); ja_tese.add(k)
        novos.append(i)
    if not novos:
        return []
    parte = max((x[8] for x in d["itens"]), default=-1) + 1
    (base / "c").mkdir(parents=True, exist_ok=True)
    linhas = []
    for k in range(0, len(novos), POR_PARTE):
        det = {}
        for i in novos[k:k + POR_PARTE]:
            linhas.append([i["id"], i["org"], i["info"], i["area"], i["tit"], i["tese"], i["proc"], i["data"], parte])
            det[i["id"]] = i["teor"]
        (base / "c" / f"{parte:03d}.json").write_text(json.dumps(det, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
        parte += 1
    d["itens"] = linhas + d["itens"]
    f.write_text(json.dumps(d, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
    return [i["id"] for i in novos]


if __name__ == "__main__":
    a = [x for x in sys.argv[1:] if not x.startswith("--")]
    if len(a) != 3:
        sys.exit(__doc__)
    org, info, arq = a[0].upper(), int(a[1]), Path(a[2])
    bl = (blocos_de_html(arq.read_text(encoding="utf-8", errors="replace")) if arq.suffix.lower() in (".htm", ".html")
          else blocos_de_pdf(arq.read_bytes()))
    its = extrair(org, info, bl)
    for i in its:
        print(f"- [{i['area']}] {i['tit']} · {i['data']}\n    tese: {i['tese'][:160]}\n    proc: {i['proc'][:120]}\n    teor: {len(i['teor'])} caracteres")
    print(len(its), "julgado(s)")
    if "--gravar" in sys.argv:
        print(len(acrescentar(its)), "novo(s) gravado(s)")
