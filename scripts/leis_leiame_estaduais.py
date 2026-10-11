#!/usr/bin/env python3
"""
leis_leiame_estaduais.py — "Leia-me" (texto da lei) das leis estaduais do Diário de Leis, lido do portal da Assembleia.

Cada fonte tem um leitor (ALESC/SC, ALRS/RS…). Só grava se o cabeçalho da página confere com o número da lei
(senão o link abriria outra norma). O endereço guardado é o do Diário de Leis (leis-data.js), para o site achar o texto.

    python3 scripts/leis_leiame_estaduais.py --fonte alesc --plano
    python3 scripts/leis_leiame_estaduais.py --fonte alesc
"""
import argparse, html, re, sys, time
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(RAIZ / "scripts"))
import leis_citadas as lc  # noqa: E402
robo = lc.robo

CORRECOES = {}
FONTES = {"alesc": r"leis\.alesc\.sc\.gov\.br",
          "df": r"sinj\.df\.gov\.br", "goias": r"legisla\.casacivil\.go\.gov\.br", "pdf-das-paginas": r"(sapl\.al\.pi\.leg\.br/norma|al\.mt\.gov\.br/norma-juridica|al\.rn\.leg\.br)",
          "pa-pdf": r"(tjpa\.jus\.br/CMSPortal/VisualizarArquivo|pm\.pa\.gov\.br/images/PM1/ATUALIZADA)"}   # uma entrada por Assembleia, com o leitor correspondente em LEITORES


def entradas(padrao):
    s = (RAIZ / "site" / "leis" / "leis-data.js").read_text(encoding="utf-8")
    out = []
    for m in re.finditer(r'\{ nome: "((?:[^"\\]|\\.)*)", numero: "([^"]*)", link: "([^"]*)"', s):
        if re.search(padrao, m.group(3)):
            out.append((m.group(1), m.group(2), m.group(3)))
    return out


def paragrafos_alesc(h):
    h = re.sub(r"(?is)<(script|style|head)\b.*?</\1>|<!--.*?-->", " ", h)
    h = re.sub(r"(?i)<br\s*/?>|</(p|div|tr|h[1-6]|li|table)>", "\n", h)
    t = html.unescape(re.sub(r"<[^>]+>", "", h)).replace("\xa0", " ")
    t = re.sub(r"[ \t]+", " ", t)
    # quebra antes de artigos, parágrafos e incisos que vieram na mesma linha
    t = re.sub(r"\s+(Art\.\s*\d+[ºo°]?[\s.-])", r"\n\1", t)
    t = re.sub(r"\s+(§\s*\d+[ºo°]?\s)", r"\n\1", t)
    t = re.sub(r"\s+(Parágrafo único\.)", r"\n\1", t)
    out = [re.sub(r"\s+", " ", l).strip() for l in t.split("\n")]
    out = [l for l in out if l and not l.startswith(("*", "body {", "font-"))]
    # descarta CSS que veio dentro do corpo
    out = [l for l in out if "{" not in l and "margin:" not in l]
    return out


def paragrafos_pdf(texto):
    """Texto de um PDF já extraído: junta as linhas quebradas até o próximo artigo, parágrafo, inciso ou alínea."""
    linhas = [re.sub(r"\s+", " ", l).strip() for l in texto.replace("\xa0", " ").split("\n")]
    linhas = [l for l in linhas if l and not re.fullmatch(r"\d{1,3}", l)]
    out = []
    for l in linhas:
        if out and not re.match(r"(?i)^(Art\.|Artigo\s+\d|§|Parágrafo único|[IVXLC]+\s*[-–—]|[a-z]\)|CAP[ÍI]TULO|SE[ÇC][ÃA]O|T[ÍI]TULO|LEI\b|Belém,|Palácio)", l):
            out[-1] += " " + l
        else:
            out.append(l)
    return out


LEITORES = {"df": paragrafos_pdf, "goias": paragrafos_alesc, "alesc": paragrafos_alesc, "pa-pdf": paragrafos_pdf, "pdf-das-paginas": paragrafos_pdf}


def pdf_texto(url):
    """Baixa o PDF do link; se o link abre uma página (SAPL do PI, ALMT), pega o PDF que ela oferece."""
    import fitz, urllib.parse, urllib.request
    def baixa(u):
        return urllib.request.urlopen(urllib.request.Request(u, headers={"User-Agent": "Mozilla/5.0"}), timeout=90).read()
    dados = baixa(url)
    if not dados.startswith(b"%PDF"):
        h = dados.decode("utf-8", "replace")
        m = re.search(r'href="([^"]*(?:/media/sapl/[^"]*\.pdf|storage\.al\.mt\.gov\.br/api/v1/download/[^"]*))"', h)
        if not m:
            raise ValueError("a página não oferece PDF")
        dados = baixa(urllib.parse.urljoin(url, html.unescape(m.group(1))))
    return "\n".join(p.get_text() for p in fitz.open(stream=dados, filetype="pdf"))


def go_api(numero, nome):
    """Legisla Goiás: o link do Diário pode trazer o id errado; acha a norma pelo número/ano e devolve (id, html)."""
    import json, urllib.request
    m = re.search(r"([\d.]+)/(\d{4})", numero)
    n, ano = m.group(1).replace(".", ""), m.group(2)
    def api(u):
        return json.loads(urllib.request.urlopen(urllib.request.Request(u, headers={"User-Agent": "Mozilla/5.0"}), timeout=60).read())
    base = "https://legisla.casacivil.go.gov.br/api/v2/pesquisa/legislacoes"
    achadas = api(f"{base}?numero={n}&ano={ano}")["resultados"]
    tipo = ("Decreto" if "Decreto" in numero else "Complementar" if "Complementar" in numero else "Ordin")
    ok = [r for r in achadas if tipo in r["tipo_legislacao"]["nome"]] or achadas
    if not ok:
        raise ValueError("não achei na API")
    return ok[0]["id"], api(f"{base}/{ok[0]['id']}")["conteudo"]


def df_sinj(url):
    """SINJ-DF: a página da norma traz o nome do arquivo do texto atualizado; o texto fica em /sinj/Norma/<id>/<arquivo>."""
    import ssl, urllib.request
    ctx = ssl._create_unverified_context()
    def baixa(u):
        return urllib.request.urlopen(urllib.request.Request(u, headers={"User-Agent": "Mozilla/5.0"}), timeout=90, context=ctx).read().decode("utf-8", "replace")
    idn = re.search(r"id_norma=(\d+)", url).group(1)
    arq = re.search(r'"ar_atualizado":\{"id_file":"[^"]*","filename":"([^"]+\.html?)"', baixa(url))
    if not arq:
        raise ValueError("sem texto atualizado em HTML")
    h = baixa(f"https://www.sinj.df.gov.br/sinj/Norma/{idn}/{arq.group(1)}")
    h = re.sub(r"(?is)<(script|style|head)\b.*?</\1>", "", h)
    return html.unescape(re.sub(r"<[^>]+>", "\n", h)).replace("\xa0", " ")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--fonte", required=True, choices=sorted(FONTES))
    ap.add_argument("--plano", action="store_true")
    ap.add_argument("--max", type=int, default=100)
    a = ap.parse_args()
    lst = entradas(FONTES[a.fonte])
    feitas = [x for x in lst if (robo.TEXTO_DIR / f"{robo.id_texto(x[2])}.json").exists()]
    print(f"{len(lst)} lei(s) de {a.fonte} no Diário; {len(feitas)} já têm Leia-me.")
    if a.plano:
        return
    hoje, ok = robo.hoje(), 0
    for nome, numero, url in lst[:a.max]:
        if (robo.TEXTO_DIR / f"{robo.id_texto(url)}.json").exists():
            continue
        print(f"  … {numero}", flush=True)
        try:
            if a.fonte == "goias":
                _id, pg = go_api(numero, nome)
                if f"/{_id}/" not in url:
                    print(f"    (o link do Diário trazia o id errado; certo: {_id})")
                    novo = re.sub(r"/pesquisa_legislacao/\d+/", f"/pesquisa_legislacao/{_id}/", url)
                    CORRECOES[url] = novo
                    url = novo
            elif a.fonte == "df":
                pg = df_sinj(url)
            elif a.fonte.endswith("-pdf") or a.fonte == "pdf-das-paginas":
                pg = pdf_texto(url)
            else:
                pg = robo.pagina(url, valida=lambda x: len(x) > 800)
        except Exception as e:
            print(f"    não abriu: {e}")
            continue
        if robo.salvar_texto(url, pg, nome, hoje, extrator=LEITORES[a.fonte], numero=numero):
            ok += 1
            print("    gravado")
        time.sleep(1)
    if CORRECOES:   # corrige os links errados no Diário de Leis
        arq = RAIZ / "site" / "leis" / "leis-data.js"
        t = arq.read_text(encoding="utf-8")
        for velho, novo in CORRECOES.items():
            t = t.replace(velho, novo)
        arq.write_text(t, encoding="utf-8")
    robo.indice_dos_textos()
    print(f"{ok} gravada(s).")


if __name__ == "__main__":
    main()
