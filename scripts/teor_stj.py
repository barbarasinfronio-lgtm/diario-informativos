"""
teor_stj.py — o "acórdão" de um julgado do STJ (ementa e decisão), para o botão "Buscar o acórdão" do site.

O STJ barra programas na pesquisa de jurisprudência, então a fonte é a dos dados abertos (os "espelhos de
acórdãos" que scripts/acordaos_stj.py já baixa para ~/EstudaMana/cache-stj-acordaos/<conjunto>/AAAAMMDD.json).
O espelho traz o órgão julgador, o relator, as datas, a EMENTA e a DECISÃO (o dispositivo: "Vistos e relatados
estes autos… acordam os Ministros…"), mais tese, referências legislativas e jurisprudência citada quando há. NÃO
traz o relatório e o voto: por isso o texto é rotulado "Acórdão (ementa e decisão)", e não "inteiro teor".

Usado por scripts/teor_sob_pedido.py (pedidos feitos no site). Sozinho:
    python3 scripts/teor_stj.py "AgInt no AREsp 2.840.133-RN, Rel. Ministro …" 25/08/2025
"""
import json
import re
import sys
from datetime import datetime, timedelta
from pathlib import Path

CACHE = Path.home() / "EstudaMana" / "cache-stj-acordaos"
RX = re.compile(r"^((?:[A-Za-z]{2,10}\s+(?:no|na|nos|nas)\s+)*[A-Za-z]{2,10})\s+([\d.]{3,})(\s*-\s*[A-Z]{2}\b)?")
CLASSES_STJ = {"resp", "aresp", "eresp", "earesp", "agint", "agrg", "edcl", "apn", "puil", "iac", "ss", "sls", "sec", "pet", "ar", "cc", "rms", "rhc", "hc", "ms", "rcl"}


def processo_stj(texto):
    """("AgInt no AREsp", "2840133") ou None."""
    m = RX.match(str(texto or "").strip())
    return (re.sub(r"\s+", " ", m[1]), m[2].replace(".", "")) if m else None


def eh_stj(texto):
    """STJ, não STF: número seguido de "-UF" (o STF usa "/UF") ou "Rel. Ministro … Turma/Seção/Corte Especial" no texto."""
    t = str(texto or "")
    m = RX.match(t.strip())
    if not m:
        return False
    if m[3] or re.search(r"Rel\.?\s+Ministr[oa]\b.*?(Turma|Seção|Corte Especial)", t):
        return True
    return m[1].split()[-1].lower() in {"resp", "aresp", "eresp", "earesp", "agint", "agrg", "edcl", "apn", "puil", "iac"}


def chave_stj(texto):
    """"STJ AGINT NO ARESP 2840133" — a mesma chave que o site monta (chaveProcesso em rg-repetitivos-logic.js)."""
    p = processo_stj(texto)
    return f"STJ {p[0].upper()} {p[1]}" if p else ""


def _arquivos(ini, fim):
    """Arquivos do cache cujo nome (data de fechamento do mês) cai entre as duas datas."""
    if not CACHE.exists():
        return []
    i, f = ini.strftime("%Y%m%d"), fim.strftime("%Y%m%d")
    return sorted(x for x in CACHE.glob("*/*.json") if i <= x.stem <= f)


_lidos = {}


def _ler(arq):
    """Cada arquivo é lido uma vez por rodada (vários pedidos usam os mesmos meses)."""
    if arq not in _lidos:
        try:
            j = json.loads(arq.read_text(encoding="utf-8"))
        except ValueError:
            j = []
        _lidos[arq] = j if isinstance(j, list) else []
    return _lidos[arq]


def mais_recente_no_cache():
    nomes = [f.stem for f in CACHE.glob("*/*.json") if re.fullmatch(r"\d{8}", f.stem)] if CACHE.exists() else []
    return max(nomes) if nomes else ""


def achar_espelho(processo, data_ddmmaaaa):
    """O registro do espelho do acórdão (dict) ou levanta LookupError com o motivo.
    Se o texto do processo traz "julgado em dd/mm/aaaa" (julgados de informativos), vale essa data, com tolerância de
    3 dias: é o acórdão exato. Sem ela (repetitivos, teses…), vale o acórdão da mesma classe e número mais perto da
    data do card, até 2 anos antes."""
    p = processo_stj(processo)
    if not p:
        raise LookupError("não entendi o número do processo")
    classe, num = p
    m = re.search(r"julgad[oa] em (\d{1,2})/(\d{1,2})/(\d{4})", str(processo))
    estrito = bool(m)
    try:
        alvo = datetime(int(m[3]), int(m[2]), int(m[1])) if m else datetime.strptime(data_ddmmaaaa, "%d/%m/%Y")
    except ValueError:
        raise LookupError("o card não tem a data do julgamento")
    tolerancia = 3 if estrito else 730
    achados = []
    for f in _arquivos(alvo - timedelta(days=tolerancia), alvo + timedelta(days=60 + (0 if estrito else 120))):
        for r in _ler(f):
            if str(r.get("numeroProcesso", "")).lstrip("0") != num.lstrip("0"):
                continue
            dd = str(r.get("dataDecisao") or "")
            if not re.fullmatch(r"\d{8}", dd):
                continue
            dias = (datetime.strptime(dd, "%Y%m%d") - alvo).days
            if abs(dias) > tolerancia:
                continue
            igual = re.sub(r"\s+", "", str(r.get("siglaClasse") or "")).lower() == re.sub(r"\s+", "", classe).lower()
            acordao = "ACÓRDÃO" in str(r.get("tipoDeDecisao") or "").upper()
            achados.append((not igual, not acordao, abs(dias), -len(r.get("ementa") or ""), r))
    if achados:
        achados.sort(key=lambda a: a[:4])
        return achados[0][4]
    novo = mais_recente_no_cache()
    if not novo or novo < alvo.strftime("%Y%m%d"):
        raise LookupError("os dados abertos baixados ainda não chegam a essa data (rode o \"Atualizar Acordaos STJ.command\")")
    raise LookupError("não achei esse acórdão nos dados abertos do STJ (o conjunto pode não incluí-lo, ou ainda não foi publicado)")


def _data(s):
    s = str(s or "")
    return f"{s[6:8]}/{s[4:6]}/{s[0:4]}" if re.fullmatch(r"\d{8}", s) else ""


def texto_do_espelho(r):
    """Texto para o site: cabeçalho em linhas simples, depois EMENTA e DECISÃO."""
    def lista(v):
        return [str(x).strip() for x in v if str(x).strip()] if isinstance(v, list) else ([str(v).strip()] if v else [])
    publ = re.sub(r"\s+", " ", str(r.get("dataPublicacao") or ""))
    cab = [f"Processo: {r.get('descricaoClasse') or r.get('siglaClasse') or ''} {r.get('numeroProcesso') or ''}".strip(),
           f"Órgão julgador: {r.get('nomeOrgaoJulgador') or ''}", f"Ministro relator: {str(r.get('ministroRelator') or '').title()}",
           f"Julgamento: {_data(r.get('dataDecisao'))}", f"Publicação: {publ}"]
    partes = ["\n".join(l for l in cab if l.split(": ", 1)[-1].strip())]
    if r.get("ementa"):
        partes.append("EMENTA:\n" + str(r["ementa"]).strip())
    if r.get("decisao"):
        partes.append("DECISÃO:\n" + str(r["decisao"]).strip())
    for rotulo, chave in (("Tese jurídica", "teseJuridica"), ("Jurisprudência citada", "jurisprudenciaCitada"), ("Notas", "notas"),
                          ("Informações complementares", "informacoesComplementares")):
        v = lista(r.get(chave))
        if v:
            partes.append(f"{rotulo}:\n" + "\n".join(v))
    refs = r.get("referenciasLegislativas")
    if isinstance(refs, list) and refs:
        partes.append("Referências legislativas:\n" + "\n".join(str(x).strip() for x in refs[:40]))
    return "\n\n".join(p for p in partes if p.strip())


def buscar(processo, data_ddmmaaaa):
    """(texto, False): o espelho do acórdão; nunca é o inteiro teor (sem relatório e voto)."""
    return texto_do_espelho(achar_espelho(processo, data_ddmmaaaa)), False


if __name__ == "__main__":
    if len(sys.argv) < 3:
        sys.exit(__doc__)
    try:
        t, _ = buscar(sys.argv[1], sys.argv[2])
        print(t[:3000])
    except LookupError as e:
        sys.exit(f"sem sucesso: {e}")
