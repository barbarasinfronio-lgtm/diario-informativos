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


COLETORES = {"tjce": tjce, "tjpe": tjpe, "tjsc": tjsc}

if __name__ == "__main__":
    for chave in sys.argv[1:] or COLETORES:
        lista = COLETORES[chave]()
        print(chave, len(lista), lista[0], lista[-1])
