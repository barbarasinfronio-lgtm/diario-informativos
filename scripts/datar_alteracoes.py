#!/usr/bin/env python3
"""
datar_alteracoes.py — descobre QUANDO cada lei do acervo foi alterada pela última vez.

O Planalto quase sempre cita a norma alteradora só com o ano ("Redação dada pela Lei nº 14.994, de
2024"). O leitor antigo só aceitava data completa e por isso 453 das 521 leis monitoradas ficaram
sem data (e o aviso "Leis alteradas desde…" nunca disparava).

Aqui:
 1. lê os textos já gravados em leis/texto/ (as mesmas notas do Planalto);
 2. junta todas as datas COMPLETAS que aparecem em qualquer lei (Lei nº 14.994 = 9.10.2024 …);
 3. para as normas só com o ano, estima o dia: leis, leis complementares e emendas são numeradas em
    ordem cronológica, então a data sai da interpolação entre as vizinhas conhecidas (e nunca sai do ano
    citado);
 4. grava em leis/alteracoes.json: ultimaAlteracao, ultimaNorma e ultimaAprox (true = data estimada).

O robô (etapa LEIS) chama atualizar() a cada rodada; também roda sozinho:
    python3 scripts/datar_alteracoes.py
"""
import datetime, json, re, sys
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
ARQ = RAIZ / "leis" / "alteracoes.json"
TEXTO = RAIZ / "leis" / "texto"

MESES = {"janeiro": 1, "fevereiro": 2, "marco": 3, "março": 3, "abril": 4, "maio": 5, "junho": 6, "julho": 7,
         "agosto": 8, "setembro": 9, "outubro": 10, "novembro": 11, "dezembro": 12}
SIGLA = {"emenda constitucional de revisão": "ecr", "emenda constitucional": "ec", "lei complementar": "lc",
         "medida provisória": "mp", "decreto-lei": "dl", "lei": "lei"}
NOMES = {"ecr": "Emenda Constitucional de Revisão", "ec": "Emenda Constitucional", "lc": "Lei Complementar",
         "mp": "Medida Provisória", "dl": "Decreto-Lei", "lei": "Lei"}
NOTA = re.compile(
    r"(?:Reda[çc][ãa]o\s+dada|Inclu[íi]d[oa]s?|Acrescid[oa]s?|Acrescentad[oa]s?|Revogad[oa]s?|"
    r"Renumerad[oa]s?|Alterad[oa]s?|Suprimid[oa]s?|Transformad[oa]s?)\s+(?:pel[oa]s?|por)\s+"
    r"(Emenda\s+Constitucional\s+de\s+Revis[ãa]o|Emenda\s+Constitucional|Lei\s+Complementar|"
    r"Medida\s+Provis[óo]ria|Decreto-Lei|Lei)\s+n[ºo°.]*\s*(\d[\d.]*)\s*,?\s*de\s+"
    r"(?:(\d{1,2})[º°o]?\s*\.\s*(\d{1,2})\s*\.\s*(\d{4})|"
    r"(\d{1,2})[º°o]?\s+de\s+([a-zç]+)\s+de\s+(\d{4})|"
    r"(\d{4}))", re.I)


def ordinal(iso):
    return datetime.date.fromisoformat(iso).toordinal()


def iso_de(o):
    return datetime.date.fromordinal(int(round(o))).isoformat()


def notas_do_texto(paragrafos):
    """[(sigla, número, ano, iso completo ou None)] das notas de alteração de um texto."""
    t = re.sub(r"\s+", " ", " ".join(paragrafos))
    out = []
    for m in NOTA.finditer(t):
        sigla = SIGLA.get(re.sub(r"\s+", " ", m.group(1)).lower().replace("ã", "ã"))
        if not sigla:
            continue
        try:
            num = int(m.group(2).replace(".", "").rstrip(".") or 0)
        except ValueError:
            continue
        iso, ano = None, None
        try:
            if m.group(3):
                ano = int(m.group(5)); iso = f"{ano:04d}-{int(m.group(4)):02d}-{int(m.group(3)):02d}"
            elif m.group(6):
                mes = MESES.get(m.group(7).lower())
                ano = int(m.group(8))
                iso = f"{ano:04d}-{mes:02d}-{int(m.group(6)):02d}" if mes else None
            else:
                ano = int(m.group(9))
            if iso:
                datetime.date.fromisoformat(iso)
        except (ValueError, TypeError):
            iso = None
        if ano and 1900 <= ano <= 2100 and num:
            out.append((sigla, num, ano, iso))
    return out


CABECALHO = re.compile(
    r"\b(EMENDA\s+CONSTITUCIONAL|LEI\s+COMPLEMENTAR|MEDIDA\s+PROVIS[ÓO]RIA|DECRETO-LEI|LEI)\s+N[ºO°.]*\s*(\d[\d.]*)\s*,?\s*DE\s+"
    r"(\d{1,2})[ºO°]?\s+DE\s+([A-ZÇ]+)\s+DE\s+(\d{4})")


def cabecalho_do_texto(paragrafos):
    """(sigla, número, iso) da própria norma, lida do título ("LEI Nº 15.358, DE 5 DE MARÇO DE 2026")."""
    t = re.sub(r"\s+", " ", " ".join(paragrafos[:12]))
    m = CABECALHO.search(t)
    if not m:
        return None
    sigla = SIGLA.get(re.sub(r"\s+", " ", m.group(1)).lower())
    mes = MESES.get(m.group(4).lower())
    try:
        num = int(m.group(2).replace(".", "").rstrip("."))
        iso = f"{int(m.group(5)):04d}-{mes:02d}-{int(m.group(3)):02d}"
        datetime.date.fromisoformat(iso)
    except (ValueError, TypeError):
        return None
    return (sigla, num, iso) if sigla else None


class Calendario:
    """Data de cada norma: exata (vista em alguma nota) ou estimada pela vizinhança numérica."""
    def __init__(self):
        self.exatas = {}      # (sigla, num) -> iso
        self.por_tipo = {}    # sigla -> [(num, ordinal)] ordenado

    def aprender(self, notas):
        for sigla, num, ano, iso in notas:
            if iso and (sigla, num) not in self.exatas:
                self.exatas[(sigla, num)] = iso
        tmp = {}
        for (sigla, num), iso in self.exatas.items():
            tmp.setdefault(sigla, []).append((num, ordinal(iso)))
        self.por_tipo = {s: sorted(v) for s, v in tmp.items()}

    def data(self, sigla, num, ano):
        """(iso, aproximada?)"""
        if (sigla, num) in self.exatas:
            return self.exatas[(sigla, num)], False
        v = self.por_tipo.get(sigla) if sigla in ("lei", "lc", "ec") else None
        ini, fim = ordinal(f"{ano:04d}-01-01"), ordinal(f"{ano:04d}-12-31")
        if v:
            lo = [x for x in v if x[0] < num]
            hi = [x for x in v if x[0] > num]
            if lo and hi:
                (n1, d1), (n2, d2) = lo[-1], hi[0]
                est = d1 + (d2 - d1) * (num - n1) / (n2 - n1)
            elif lo:
                est = lo[-1][1] + (num - lo[-1][0]) * 1.5      # ~1,5 dia por lei, depois da última conhecida
            else:
                est = hi[0][1] - (hi[0][0] - num) * 1.5
            return iso_de(min(max(est, ini), fim)), True
        return iso_de((ini + fim) / 2), True


def atualizar(texto_dir=TEXTO, arquivo=ARQ, ver=print, id_texto=None):
    """Reescreve ultimaAlteracao/ultimaNorma/ultimaAprox de cada lei do alteracoes.json. Devolve quantas mudaram."""
    dados = json.loads(arquivo.read_text(encoding="utf-8"))
    leis = dados.get("leis", {})
    if id_texto is None:     # (quando o robô chama, ele passa a própria função)
        sys.path.insert(0, str(RAIZ / "scripts"))
        import atualizar_informativos as robo
        id_texto = robo.id_texto
    notas_por_lei, todas = {}, []
    for chave, v in leis.items():
        arq = texto_dir / f"{id_texto(v.get('link', ''))}.json"
        try:
            ps = json.loads(arq.read_text(encoding="utf-8")).get("p", [])
        except (OSError, ValueError):
            continue
        n = notas_do_texto(ps)
        notas_por_lei[chave] = n
        todas += n
    cal = Calendario()
    cal.aprender(todas)
    # o título de cada lei gravada em leis/texto/ também é uma data exata (inclusive das leis de 2025 e 2026)
    for arq in texto_dir.glob("*.json"):
        if arq.name in ("indice.json", "citadas.json", "citadas-falhas.json"):
            continue
        try:
            c = cabecalho_do_texto(json.loads(arq.read_text(encoding="utf-8")).get("p", []))
        except (OSError, ValueError, AttributeError):
            continue
        if c:
            cal.exatas.setdefault((c[0], c[1]), c[2])
    cal.aprender([])
    mudou = 0
    for chave, notas in notas_por_lei.items():
        melhor = None
        for sigla, num, ano, iso in set(notas):
            d, aprox = cal.data(sigla, num, ano)
            if melhor is None or d > melhor[0]:
                melhor = (d, f"{NOMES[sigla]} nº {num:,}".replace(",", ".") + f"/{ano}", aprox)
        if not melhor:
            continue
        v = leis[chave]
        novo = {"ultimaAlteracao": melhor[0], "ultimaNorma": melhor[1], "ultimaAprox": melhor[2]}
        if any(v.get(k) != x for k, x in novo.items()):
            v.update(novo)
            mudou += 1
    arquivo.write_text(json.dumps(dados, ensure_ascii=False, indent=1), encoding="utf-8")
    ver(f"  Datas das alterações: {mudou} lei(s) atualizada(s); {len(cal.exatas)} normas com data exata.")
    return mudou


if __name__ == "__main__":
    atualizar()
