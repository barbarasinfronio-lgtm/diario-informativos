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

FONTES = {"alesc": r"leis\.alesc\.sc\.gov\.br",
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
        if out and not re.match(r"(?i)^(Art\.|§|Parágrafo único|[IVXLC]+\s*[-–—]|[a-z]\)|CAP[ÍI]TULO|SE[ÇC][ÃA]O|T[ÍI]TULO|LEI\b|Belém,|Palácio)", l):
            out[-1] += " " + l
        else:
            out.append(l)
    return out


LEITORES = {"alesc": paragrafos_alesc, "pa-pdf": paragrafos_pdf}


def pdf_texto(url):
    import fitz, urllib.request
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    dados = urllib.request.urlopen(req, timeout=60).read()
    return "\n".join(p.get_text() for p in fitz.open(stream=dados, filetype="pdf"))


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
            if a.fonte.endswith("-pdf"):
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
    robo.indice_dos_textos()
    print(f"{ok} gravada(s).")


if __name__ == "__main__":
    main()
