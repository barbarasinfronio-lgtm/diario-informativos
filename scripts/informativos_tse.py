#!/usr/bin/env python3
"""
informativos_tse.py — lê o PDF de uma edição do Informativo de Jurisprudência do TSE (Infojur) e devolve os julgados
como cards do Diário das Decisões (grupo "Informativos"), no mesmo formato de scripts/informativos_extrair.py.

O Informativo do TSE (a partir de 2025) tem três partes:
  • JURISPRUDÊNCIA HOJE   — o julgado do período (título, "Grandes temas", resumo, processo, tags);
  • JURISPRUDÊNCIA ONTEM  — um julgado antigo ("Há N anos"), com a tese e o processo;
  • COLETÂNEA DE JULGADOS — trechos de ementas por assunto ("Assunto > subassunto", “ementa…”, "Ac. de d/m/aaaa no X n. N, rel. Min. Y.").
Cada um vira um card. A numeração do TSE recomeça todo ano, então o campo "informativo" do card é "15/2026".

    python3 scripts/informativos_tse.py infojur15.pdf 15 2026            # só mostra o que achou
    python3 scripts/informativos_tse.py infojur15.pdf 15 2026 --gravar   # grava em informativos/
"""
import re
import sys
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(RAIZ / "scripts"))
import informativos_extrair as ie  # noqa: E402

AREA = "Direito Eleitoral"
RX_PROC = re.compile(r"^(?:[A-Za-z]{1,4}-)*[A-Za-zÀ-ú]{1,12}\s+n\.?\s*[\d.]+\b")      # "RO n. 060235926", "AgR-REspe n. 168328"
RX_DATA = re.compile(r"(\d{1,2})º?/(\d{1,2})/(\d{4})")


def _sem_espacos(l):
    return re.sub(r"\s+", "", l).upper()


def _ruido(l, pos):
    s = _sem_espacos(l)
    if not s:
        return True
    # cabeçalho de página com letras espaçadas ("J U R I S P R U D Ê N C I A  H O J E"); o título real da seção
    # ("JURISPRUDÊNCIA ONTEM") vem com as letras juntas e é mantido
    if s in {"INFORMATIVODEJURISPRUDÊNCIA", "COLETÂNEADEJULGADOS"}:
        return True
    if s in {"JURISPRUDÊNCIAHOJE", "JURISPRUDÊNCIAONTEM"} and len(l) > 1 and l[1] == " ":
        return True
    if re.fullmatch(r"\d{1,3}", s) or re.fullmatch(r"ANO[IVXLC]+[|\-–]N\.\d+", s):
        return True
    if re.fullmatch(r"\d+º?A\d+DE[A-ZÇ]+DE\d{4}(\|ANO[IVXLC]+[–-]N\.\d+)?", s):          # "1º A 15 DE OUTUBRO DE 2026 | ANO XXVIII – N. 15"
        return True
    if re.search(r"\sp\.\s?\d+\s*$", l) and pos < 12:                       # sumário que se repete no alto de cada página
        return True
    if re.fullmatch(r"_+", s) or re.match(r"^\s*\d?Nota:\s*o julgado", l):
        return True
    return False


def linhas_do_pdf(corpo):
    import fitz
    doc = fitz.open(stream=corpo, filetype="pdf")
    out = []
    for p in doc:
        ls = p.get_text().replace("­", "").split("\n")
        for i, l in enumerate(ls):
            if "FICHA TÉCNICA" in l.upper() and i < 12:
                return out
            if not _ruido(l, i):
                out.append(l.strip())
    return out


def _junta(ls):
    """Junta linhas de um parágrafo, refazendo palavras partidas por hífen no fim da linha."""
    t = ""
    for l in ls:
        if t.endswith("-") and l[:1].islower():
            t = t[:-1] + l
        else:
            t = (t + " " + l).strip()
    return re.sub(r"\s+", " ", t).strip()


def _normaliza_proc(p):
    p = re.sub(r",\s*red\.\s*designad[oa]\s+(?:Min\.?\s*)?", ", rel. p/ acórdão Min. ", p)
    return re.sub(r"\s+", " ", p).strip()


def _curto(proc):
    m = re.search(r"\b(?:no|nos|na|nas)\s+(.+?),\s*(?:rel\.|Rel\.)", proc)
    if m:
        return m.group(1).strip()
    m = re.match(r"^(.+?n\.?\s*[\d.]+)", proc)
    return (m.group(1) if m else proc[:60]).strip()


def _data(proc):
    m = RX_DATA.search(proc)
    return f"{int(m[1]):02d}/{int(m[2]):02d}/{m[3]}" if m else ""


def _item(n, ano, tit, tese, proc, tags, tema=None, tipo="", info_extra=""):
    proc = _normaliza_proc(proc)
    teor = []
    if tipo:
        teor.append(tipo)
    if tema:
        teor.append("Tema: " + tema)
    teor.append(tese)
    if info_extra:
        teor.append(info_extra)
    teor.append("Processo: " + proc)
    if tags:
        teor.append("Tags: " + tags)
    return {"org": "TSE", "info": f"{n}/{ano}", "area": AREA, "tit": tit, "tese": ie._corta(tese, 900), "proc": proc, "data": _data(proc),
            "teor": "\n\n".join(teor)}


def _bloco_noticia(ls, tipo):
    """HOJE / ONTEM: título, 'Grandes temas', (HÁ N ANOS), resumo, linha do processo, tags."""
    if not ls:
        return None
    titulo = ls[0]
    i, tema, corpo, proc, tags = 1, [], [], [], []
    while i < len(ls) and not ls[i].lower().startswith("grandes temas") and i < 4:
        titulo += " " + ls[i]; i += 1
    estado = "tema"
    for l in ls[i:]:
        if re.match(r"^tags?:", l, re.I):
            estado = "tags"; tags.append(re.sub(r"^tags?:\s*", "", l, flags=re.I)); continue
        if l.startswith("¾") or l.lower().startswith("assista"):
            estado = "fim"; continue
        if estado == "fim":
            continue
        if estado == "tags":
            tags.append(l); continue
        if re.match(r"^há\s+\d+\s+anos?$", l, re.I):
            estado = "corpo"; continue
        if l.lower().startswith("grandes temas"):
            estado = "tema"; tema.append(re.sub(r"^grandes temas:\s*", "", l, flags=re.I)); continue
        if estado == "tema":
            # o tema pode quebrar em duas linhas; o resumo começa depois dele
            if tema and tema[-1].rstrip().endswith("."):
                estado = "corpo"
            else:
                tema.append(l); continue
        if estado == "corpo" and ((RX_PROC.match(l) and ("rel." in l or "julgad" in l)) or proc):
            proc.append(l); continue
        if estado in ("corpo", "tema"):
            corpo.append(l)
    if not (corpo and proc):
        return None
    tese = _junta(corpo)
    p = _junta(proc)
    return _item(0, 0, _junta([titulo]), tese, p, _junta(tags), tema=_junta(tema).rstrip("."), tipo=tipo)


def _coletanea(ls):
    """Cada julgado: 'Assunto > …' (1 a 3 linhas), “ementa…”, 'Ac. de d/m/aaaa no X n. N, rel. Min. Y.'
    A ementa só termina na linha que fecha as aspas E é seguida da citação ("Ac. …"): aspas dentro da ementa não valem."""
    RX_CIT = re.compile(r"^(Ac\.|Ac |Res\.|Dec\.)")
    itens, cab, quote, i, n = [], [], [], 0, len(ls)
    while i < n:
        l = ls[i]
        if not quote:
            if l.startswith("“"):
                quote = [l]
            else:
                cab.append(l)
        else:
            quote.append(l)
        if quote and i + 1 < n and RX_CIT.match(ls[i + 1]):          # (às vezes o PDF perde as aspas de fechamento)
            j, cit = i + 1, []
            while j < n:
                cit.append(ls[j])
                if re.search(r"\.\s*$", ls[j]):
                    break
                j += 1
            itens.append((_junta(cab), _junta(quote), _junta(cit)))
            cab, quote, i = [], [], j
        i += 1
    return itens


def extrair_tse(corpo, n, ano):
    ls = linhas_do_pdf(corpo)
    # divide pelas rubricas
    idx_ontem = next((i for i, l in enumerate(ls) if _sem_espacos(l) == "JURISPRUDÊNCIAONTEM"), None)
    idx_col = next((i for i, l in enumerate(ls) if "veículo de divulgação" in l), None)
    fim_hoje = idx_ontem if idx_ontem is not None else (idx_col if idx_col is not None else len(ls))
    hoje = ls[:fim_hoje]
    ontem = ls[idx_ontem + 1: idx_col + 1 - 3] if idx_ontem is not None and idx_col is not None else []
    # a introdução da coletânea ocupa ~5 linhas antes de "veículo de divulgação"
    inicio_col = (idx_col + 1) if idx_col is not None else len(ls)
    if idx_ontem is not None and idx_col is not None:
        k = idx_col
        while k > idx_ontem and not ls[k].startswith("Disponível apenas"):
            k -= 1
        ontem = ls[idx_ontem + 1: k]
    itens = []
    for bloco, tipo in ((hoje, "Jurisprudência hoje"), (ontem, "Jurisprudência ontem")):
        it = _bloco_noticia(bloco, tipo)
        if it:
            it["info"] = f"{n}/{ano}"
            itens.append(it)
    for cab, quote, cit in _coletanea(ls[inicio_col:]):
        tese = quote.strip("“” ")
        it = _item(n, ano, _curto(cit), tese, cit, "", tema=cab, tipo="Coletânea de julgados")
        itens.append(it)
    for it in itens:
        it["info"] = f"{n}/{ano}"
    return itens


def main():
    if len(sys.argv) < 4:
        sys.exit(__doc__)
    arq, n, ano = sys.argv[1], int(sys.argv[2]), int(sys.argv[3])
    itens = extrair_tse(Path(arq).read_bytes(), n, ano)
    for i in itens:
        print(f"- [{i['data']}] {i['tit']} | {i['proc'][:90]}\n    {i['tese'][:140]}")
    print(f"{len(itens)} julgado(s) em TSE {n}/{ano}")
    if "--gravar" in sys.argv:
        ids = ie.acrescentar(itens, substituir="--substituir" in sys.argv)
        print(f"{len(ids)} novo(s) gravado(s) em informativos/")


if __name__ == "__main__":
    main()
