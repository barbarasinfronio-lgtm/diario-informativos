#!/usr/bin/env python3
"""
leis_do_normasbrasil.py — põe uma lei estadual no grupo "Citadas nos editais" lendo a página dela no NormasBrasil
(para estados cuja Assembleia não dá para ler pelo robô). Uso:

    python3 scripts/leis_do_normasbrasil.py URL "Nome da lei" "Lei Estadual (AP) nº 400/1997"
"""
import html, json, re, sys, urllib.request
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(RAIZ / "scripts"))
import leis_citadas as lc  # noqa: E402
robo = lc.robo


def paragrafos(h):
    h = re.sub(r"(?is)<(script|style|head)\b.*?</\1>|<!--.*?-->", "", h)
    h = re.sub(r"(?i)<br\s*/?>|</(p|div|tr|li|h[1-6])>", "\n", h)
    t = html.unescape(re.sub(r"<[^>]+>", "", h)).replace("\xa0", " ")
    ini = t.find("SEU PORTAL DE NORMAS E LEGISLAÇÃO BRASILEIRA")
    fim = t.rfind("Página Inicial")
    t = t[ini + 44: fim] if ini >= 0 else t
    return [re.sub(r"\s+", " ", l).strip() for l in t.split("\n") if l.strip()]


def main():
    url, nome, numero = sys.argv[1:4]
    raw = urllib.request.urlopen(urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"}), timeout=90).read()
    try:
        pg = raw.decode("utf-8")
    except UnicodeDecodeError:
        pg = raw.decode("cp1252", "replace")
    if not robo.salvar_texto(url, pg, nome, robo.hoje(), extrator=paragrafos, numero=numero):
        sys.exit("não gravei o texto")
    arq = RAIZ / "leis" / "dos-editais.json"
    d = json.loads(arq.read_text(encoding="utf-8"))
    if not any(x["link"] == url for x in d["leis"]):
        d["leis"].append({"nome": nome, "numero": numero, "link": url})
        arq.write_text(json.dumps(d, ensure_ascii=False, indent=1), encoding="utf-8")
    robo.indice_dos_textos()
    print("gravado:", numero)


if __name__ == "__main__":
    main()
