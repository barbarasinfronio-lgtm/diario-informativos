#!/usr/bin/env python3
"""leis_pe_alepe.py — leis de Pernambuco (ALEPE Legis) citadas em editais: acha pelo número, confere e traz o texto atualizado."""
import html, json, re, subprocess, sys, time, urllib.parse
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(RAIZ / "scripts"))
import leis_citadas as lc  # noqa: E402
robo = lc.robo
BASE = "https://legis.alepe.pe.gov.br/"
CJ = Path.home() / "EstudaMana" / "cache-leis-estaduais" / "alepe-cookies.txt"


def curl(u, data=None):
    cmd = ["curl", "-sS", "-m", "60", "-L", "-A", "Mozilla/5.0", "-b", str(CJ), "-c", str(CJ)]
    if data:
        cmd += ["--data", data]
    return subprocess.run(cmd + [u], capture_output=True, text=True).stdout


def pesquisar(txt):
    CJ.parent.mkdir(parents=True, exist_ok=True)
    h = curl(BASE)
    c = {m.group(1): html.unescape(m.group(2)) for m in re.finditer(r'<input[^>]*name="(__VIEWSTATE|__VIEWSTATEGENERATOR|__EVENTVALIDATION)"[^>]*value="([^"]*)"', h)}
    c.update({"ctl00$conteudo$tbxTextoPesquisa": txt, "ctl00$conteudo$btnPesquisar": "Pesquisar", "__EVENTTARGET": "", "__EVENTARGUMENT": ""})
    return curl(BASE, urllib.parse.urlencode(c))


def achar(tipo, n, ano):
    """id da ALEPE da norma ou None. tipo: 'Lei Ordinária' | 'Lei Complementar'."""
    r = pesquisar(f"{n:,}".replace(",", "."))
    t = re.sub(r"(?is)<script.*?</script>|<style.*?</style>", "", r)
    t = html.unescape(re.sub(r"<[^>]+>", " ", t))
    t = re.sub(r"\s+", " ", t)
    t = re.sub(r"texto\.aspx\?id=(\d+)&tipo=TEXTOORIGINAL", r"@@ID\1@@", t)
    for m in re.finditer(r"(%s) n° ([\d.]+) Publicada no DOE (\d\d)/(\d\d)/(\d{4})(.{0,400}?)@@ID(\d+)@@" % tipo, t):
        if int(m.group(2).replace(".", "")) == n and abs(int(m.group(5)) - ano) <= 1:
            return int(m.group(7))
    return None


def paragrafos(h):
    h = re.sub(r"(?is)<(script|style|head)\b.*?</\1>|<!--.*?-->", " ", h)
    i = re.search(r"(?i)(LEI(?: COMPLEMENTAR)?\s*N[ºo°.]*\s*[\d.]+)", h)
    h = h[i.start():] if i else h
    h = re.sub(r"(?i)<br\s*/?>|</(p|div|tr|h[1-6]|li|table)>", "\n", h)
    t = html.unescape(re.sub(r"<[^>]+>", "", h)).replace("\xa0", " ")
    out = [re.sub(r"\s+", " ", l).strip() for l in t.split("\n")]
    out = [l for l in out if l]
    junta = []
    for l in out:   # a ALEPE quebra o texto em linhas curtas: junta até o próximo artigo, parágrafo, inciso ou alínea
        if junta and not re.match(r"(?i)^(Art\.|§|Parágrafo único|[IVXLC]+\s*[-–—]|[a-z]\)|CAP[ÍI]TULO|SE[ÇC][ÃA]O|T[ÍI]TULO|Palácio|Recife,|LEI\b)", l):
            junta[-1] += " " + l
        else:
            junta.append(l)
    out = junta
    fim = next((k for k, l in enumerate(out) if re.match(r"(?i)^(Palácio|Recife,|Este texto não substitui)", l)), None)
    return out[: fim + 1] if fim is not None else out


ALVO = [("Lei Ordinária", 14249, 2010), ("Lei Ordinária", 6123, 1968), ("Lei Ordinária", 11781, 2000), ("Lei Ordinária", 17116, 2020),
        ("Lei Complementar", 100, 2007), ("Lei Complementar", 28, 2000)]
SAIDA = RAIZ / "leis" / "dos-editais.json"


def main():
    dados = json.loads(SAIDA.read_text(encoding="utf-8")) if SAIDA.exists() else {"leis": [], "tentadas": {}}
    hoje, ok = robo.hoje(), 0
    for tp, n, a in ALVO:
        numero = f"{'Lei Complementar' if 'Compl' in tp else 'Lei'} Estadual (PE) nº {lc.com_ponto(n)}/{a}"
        if any(x["numero"] == numero for x in dados["leis"]):
            continue
        i = achar(tp, n, a)
        print(numero, "→", i, flush=True)
        time.sleep(1.5)
        if not i:
            dados["tentadas"][numero] = "nao-achei"
            continue
        url = f"{BASE}texto.aspx?id={i}&tipo=TEXTOATUALIZADO"
        pg = curl(url)
        ps = paragrafos(pg)
        cab = " ".join(ps[:2])
        if not re.search(r"N[ºo°.]*\s*%s\b" % lc.com_ponto(n).replace(".", r"\.?"), cab, re.I) or str(a) not in cab:
            print("  cabeçalho não confere:", cab[:100])
            dados["tentadas"][numero] = "cabecalho-nao-confere"
            continue
        nome = next((l for l in ps[1:6] if re.match(r"(?i)^(dispõe|altera|institui|aprova|cria|estabelece|regulamenta|autoriza|define|trata)", l)), numero)[:200].rstrip(" .;")
        if not robo.salvar_texto(url, pg, nome, hoje, extrator=paragrafos, numero=None):
            print("  texto não gravado")
        dados["leis"] = [x for x in dados["leis"] if x["link"] != url] + [{"nome": nome, "numero": numero, "link": url}]
        dados["tentadas"][numero] = "ok"
        ok += 1
    dados["leis"].sort(key=lambda x: x["numero"])
    SAIDA.write_text(json.dumps(dados, ensure_ascii=False, indent=1), encoding="utf-8")
    robo.indice_dos_textos()
    print(ok, "adicionada(s).")


if __name__ == "__main__":
    main()
