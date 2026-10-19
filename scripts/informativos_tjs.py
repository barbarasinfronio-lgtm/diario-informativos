#!/usr/bin/env python3
"""
informativos_tjs.py — coletores dos Informativos de Jurisprudência dos Tribunais de Justiça estaduais
(além de TJDFT e TJMG, que têm coletor próprio em atualizar_informativos.py).

Cada coletor devolve TODAS as edições que o site do tribunal lista, como
  {"edicao": int, "ano": int, "data": "aaaa-mm-dd", "link": url}
(mais nova primeiro). Quem decide o que é novo e grava em diario-data.js é atualizar_informativos.py.

Para incluir um tribunal: escreva o coletor, registre em COLETORES, crie a variável <SIGLA>_DATA em
diario-data.js (ver atualizar_informativos.py) e a aba em diario-logic.js (grupo "Tribunais de Justiça").

Uso (só para conferir):  python3 scripts/informativos_tjs.py [tjce tjpe tjsc]
"""
import calendar
import html
import re
import subprocess
import sys
import urllib.parse

UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36"
MESES = {m: i + 1 for i, m in enumerate(
    "janeiro fevereiro março abril maio junho julho agosto setembro outubro novembro dezembro".split())}


def baixar(url, latin1=False):
    for _ in range(3):
        r = subprocess.run(["curl", "-sL", "-m", "60", "-A", UA, "-w", "\n%{http_code}", url], capture_output=True, timeout=90)
        corpo, _, cod = r.stdout.rpartition(b"\n")
        if cod.decode().strip() == "200":
            return corpo.decode("latin-1" if latin1 else "utf-8", errors="replace")
    raise OSError("falha ao ler " + url)


def limpar(t):
    return re.sub(r"\s+", " ", html.unescape(re.sub(r"<[^>]+>", " ", t))).strip()


def fim_do_mes(ano, mes):
    return "%04d-%02d-%02d" % (ano, mes, calendar.monthrange(ano, mes)[1])


# ----------------------------------------------------------------------------- TJCE
CE = "https://www.tjce.jus.br/?p=6142"


def tjce():
    """Informativo de Jurisprudência nº N – MM.AAAA (mensal desde ago/2024). A data é o último dia do mês a que o
    informativo se refere. As edições especiais semestrais (série histórica) não entram."""
    achadas = {}
    for href, bruto in re.findall(r'<a[^>]+href="([^"]+\.pdf)"[^>]*>(.*?)</a>', baixar(CE), re.S | re.I):
        t = limpar(bruto)
        m = re.match(r"Informativo de Jurisprud\S+ n\S*\s*(\d+)\s*[–-]\s*(\d{2})\.(\d{4})", t)
        if m:
            n, mes, ano = int(m.group(1)), int(m.group(2)), int(m.group(3))
            achadas.setdefault(n, {"edicao": n, "ano": ano, "data": fim_do_mes(ano, mes),
                                   "link": urllib.parse.urljoin(CE, html.unescape(href))})
    if len(achadas) < 15:
        raise RuntimeError(f"só {len(achadas)} Informativos do TJCE (esperado ≥ 15) — a página mudou?")
    return sorted(achadas.values(), key=lambda r: -r["edicao"])


# ----------------------------------------------------------------------------- TJPE
PE = "https://portal.tjpe.jus.br/web/jurisprudencia/informativo-de-jurisprudencia"


def tjpe():
    """Informativo de Jurisprudência (mensal; arquivo "Ed.2026-09.pdf"). Não há número de edição, então a "edição"
    é o número do mês (9 = setembro) e o ano vem do nome do arquivo. A data é o último dia do mês."""
    pagina = baixar(PE)
    pastas = {}
    for href, bruto in re.findall(r'<a[^>]+href="([^"]+)"[^>]*>(.*?)</a>', pagina, re.S):
        t = limpar(bruto)
        if "document_library" in href and "folderId" in href and re.match(r"20\d\d|2019", t):
            pastas[t] = html.unescape(href)
    if not pastas:
        raise RuntimeError("não achei as pastas por ano do Informativo do TJPE — a página mudou?")
    achadas = {}
    for _, url in pastas.items():
        for href, bruto in re.findall(r'<a[^>]+href="([^"]+)"[^>]*>(.*?)</a>', baixar(url), re.S):
            t = limpar(bruto)
            m = re.search(r"Ed\.?\s*(\d{4})-(\d{2})\.pdf$", t, re.I)
            if m and "fileEntryId" in href:
                ano, mes = int(m.group(1)), int(m.group(2))
                link = html.unescape(href).split("?")[0]
                achadas.setdefault((ano, mes), {"edicao": mes, "ano": ano, "data": fim_do_mes(ano, mes), "link": link})
    if len(achadas) < 12:
        raise RuntimeError(f"só {len(achadas)} Informativos do TJPE (esperado ≥ 12) — a página mudou?")
    return sorted(achadas.values(), key=lambda r: (-r["ano"], -r["edicao"]))


# ----------------------------------------------------------------------------- TJSC
SC_BUSCA = "http://busca.tjsc.jus.br/jurisprudencia/infojurisprudencia.jsp"
SC_PAGINA = "https://www.tjsc.jus.br/web/jurisprudencia/informativos-da-jurisprudencia"


def tjsc():
    """Informativo da Jurisprudência Catarinense: a lista de edições está no seletor "Nº do Informativo" da consulta
    (ex.: "167 de 09 de Outubro de 2026"). O site não tem um endereço por edição: o link é a página dos informativos."""
    achadas = {}
    for n, dia, mes, ano in re.findall(r"<option value='\d+ de[^>]*>\s*Informativo n\S*\s*(\d+) de (\d{1,2}) de (\w+) de (\d{4})",
                                       baixar(SC_BUSCA, latin1=True)):
        mnum = MESES.get(mes.lower().replace("ç", "ç"))
        if mnum:
            achadas[int(n)] = {"edicao": int(n), "ano": int(ano), "data": "%04d-%02d-%02d" % (int(ano), mnum, int(dia)), "link": SC_PAGINA}
    if len(achadas) < 100:
        raise RuntimeError(f"só {len(achadas)} Informativos do TJSC (esperado ≥ 100) — a página mudou?")
    return sorted(achadas.values(), key=lambda r: -r["edicao"])


# ----------------------------------------------------------------------------- TJAM
AM = "https://www.tjam.jus.br"
AM_ANOS = {2019: "boletins-2019", 2020: "boletins-2020", 2021: "boletins-nugep-2021", 2022: "boletins-nugep-2022",
           2023: "boletins-2023", 2024: "boletins-2024", 2025: "boletins-2025", 2026: "boletins-2026"}


def tjam():
    """Boletim Informativo do NUGEPAC/TJAM (quinzenal): precedentes qualificados (IRDR, IAC, repetitivos, repercussão
    geral) e ações coletivas. A data é o fim do período da edição (ou o dia inicial, quando o título só traz um)."""
    achadas = {}
    for ano, slug in AM_ANOS.items():
        try:
            pagina = baixar(f"{AM}/index.php/informativos/boletins-nugepac/{slug}")
        except OSError:
            continue
        for href, bruto in re.findall(r'<a[^>]+href="([^"]+\.pdf)"[^>]*>(.*?)</a>', pagina, re.S | re.I):
            t = limpar(bruto)
            m = re.search(r"Edi\S+\s*n\S*\s*0*(\d+)\s*/\s*(\d{4})\s*[–-]\s*De\s+(.*)", t)
            if not m:
                continue
            n, a, resto = int(m.group(1)), int(m.group(2)), m.group(3)
            datas = re.findall(r"(\d{2})/(\d{2})/(\d{4})", resto)
            if datas:
                d, mm, aa = datas[-1]
                data = "%s-%s-%s" % (aa, mm, d)
            else:  # "01 a 19 de Dezembro" (2019)
                k = re.search(r"(\d{1,2})\s+a\s+(\d{1,2})\s+de\s+(\w+)", resto) or re.search(r"(\d{1,2})()\s+de\s+(\w+)", resto)
                if not k or k.group(3).lower() not in MESES:
                    continue
                data = "%04d-%02d-%02d" % (a, MESES[k.group(3).lower()], int(k.group(2) or k.group(1)))
            achadas.setdefault((a, n), {"edicao": n, "ano": a, "data": data, "link": urllib.parse.urljoin(AM, html.unescape(href))})
    if len(achadas) < 60:
        raise RuntimeError(f"só {len(achadas)} Boletins do NUGEPAC/TJAM (esperado ≥ 60) — a página mudou?")
    return sorted(achadas.values(), key=lambda r: (r["data"], r["edicao"]), reverse=True)


# ----------------------------------------------------------------------------- TJES
ES = "https://www.tjes.jus.br/institucional/vice-presidencia/nugepnac/boletins-informativos/"


def tjes():
    """Boletim NUGEP do TJES (mensal; "Boletim 08/2026"): precedentes e jurisprudência. O número é o do mês, então a
    data é o último dia do mês correspondente."""
    achadas = {}
    anos = {}
    for href, bruto in re.findall(r'<a[^>]+href="([^"]+)"[^>]*>(.*?)</a>', baixar(ES), re.S):
        if re.search(r"BOLETINS INFORMATIVOS DO TJ/ES\s*[–-]\s*ANO", limpar(bruto), re.I):
            anos[href] = 1
    for url in anos:
        for href, bruto in re.findall(r'<a[^>]+href="([^"]+\.pdf)"[^>]*>(.*?)</a>', baixar(url), re.S | re.I):
            m = re.match(r"Boletim\s+0*(\d+)\s*/\s*(\d{4})", limpar(bruto))
            if m and 1 <= int(m.group(1)) <= 12:
                n, a = int(m.group(1)), int(m.group(2))
                achadas.setdefault((a, n), {"edicao": n, "ano": a, "data": fim_do_mes(a, n), "link": html.unescape(href)})
    if len(achadas) < 30:
        raise RuntimeError(f"só {len(achadas)} Boletins do TJES (esperado ≥ 30) — a página mudou?")
    return sorted(achadas.values(), key=lambda r: (r["ano"], r["edicao"]), reverse=True)


# ----------------------------------------------------------------------------- TJPR
PR = "https://www.tjpr.jus.br"


def tjpr():
    """Boletins de precedentes do TJPR (1ª Vice-Presidência/NUGEPNAC): semanais desde nov/2025, bimestrais de 2017 a
    2025 e mensais do NURER de 2014 a 2016. Os semanais de 2025 ganham +100 no número para não colidir com os
    bimestrais do mesmo ano (101 = 1º boletim semanal de 2025)."""
    achadas = {}
    pagina = baixar(PR + "/nugep-boletins-informativos")
    for linha in re.findall(r"<tr[^>]*>(.*?)</tr>", pagina, re.S):
        a = re.search(r'<a[^>]+href="(/documents/[^"]+)"', linha)
        if not a:
            continue
        t = limpar(linha)
        w = re.match(r"boletim n\.\s*0*(\d+)\s*[-/]\s*(\d{4})\s+(\d{1,2})\s+de\s+(\w+)\s+de\s+(\d{4})", t, re.I)
        if w and w.group(4).lower() in MESES:
            n, ano_ed = int(w.group(1)), int(w.group(2))
            data = "%04d-%02d-%02d" % (int(w.group(5)), MESES[w.group(4).lower()], int(w.group(3)))
            if ano_ed <= 2025:
                n += 100
            achadas.setdefault((ano_ed, n), {"edicao": n, "ano": ano_ed, "data": data, "link": urllib.parse.urljoin(PR, html.unescape(a.group(1)))})
    for href, bruto in re.findall(r'<a[^>]+href="(/documents/[^"]+)"[^>]*>(.*?)</a>', pagina, re.S):
        b = re.match(r"boletim n\.\s*0*(\d+)\s*[-–]\s*([a-zçã]+)(?:/([a-zçã]+))?\s+(\d{4})", limpar(bruto), re.I)
        if b and (b.group(3) or b.group(2)).lower() in MESES:
            a = int(b.group(4))
            achadas.setdefault((a, int(b.group(1))), {"edicao": int(b.group(1)), "ano": a, "data": fim_do_mes(a, MESES[(b.group(3) or b.group(2)).lower()]),
                                                      "link": urllib.parse.urljoin(PR, html.unescape(href))})
    if len(achadas) < 40:
        raise RuntimeError(f"só {len(achadas)} Boletins do TJPR (esperado ≥ 40) — a página mudou?")
    return sorted(achadas.values(), key=lambda r: (r["data"], r["edicao"]), reverse=True)


# ----------------------------------------------------------------------------- TJRJ
RJ = "https://portaltj.tjrj.jus.br/web/portal-conhecimento/juridico/ementarios-de-jurisprudencia-ed-especial"


def tjrj():
    """Ementário de Jurisprudência Temático (mensal desde mar/2023): seleção de ementas do TJRJ sobre um tema do mês,
    com link para o inteiro teor. Sem número: a "edição" é o número do mês e o tema vai no campo "tema"."""
    achadas = {}
    for tema, mes, ano, href in re.findall(
            r"<p class=\"titulo-cartilha\">(.*?)</p>\s*<p><p>\s*([A-Za-zçÇ]+)\s+(\d{4})\s*</p></p>\s*<a href='([^']+)'", baixar(RJ), re.S):
        if mes.lower() in MESES:
            a, m = int(ano), MESES[mes.lower()]
            achadas.setdefault((a, m), {"edicao": m, "ano": a, "data": fim_do_mes(a, m), "link": html.unescape(href),
                                        "tema": limpar(tema).replace('"', "'")})
    if len(achadas) < 20:
        raise RuntimeError(f"só {len(achadas)} Ementários do TJRJ (esperado ≥ 20) — a página mudou?")
    return sorted(achadas.values(), key=lambda r: (r["ano"], r["edicao"]), reverse=True)


COLETORES = {"tjam": tjam, "tjce": tjce, "tjes": tjes, "tjpe": tjpe, "tjpr": tjpr, "tjrj": tjrj, "tjsc": tjsc}

if __name__ == "__main__":
    for chave in sys.argv[1:] or COLETORES:
        lista = COLETORES[chave]()
        print(chave, len(lista), lista[0], lista[-1])
