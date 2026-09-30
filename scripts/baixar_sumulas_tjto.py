#!/usr/bin/env python3
"""Baixa a página das súmulas do TJTO e guarda em tjto/ (texto bruto), para
que o Claude transforme em entradas do sumulas-data.js.

Uso:  python3 scripts/baixar_sumulas_tjto.py URL [URL2 ...]
(URL = página do site do TJTO com a lista de súmulas; pode passar várias,
inclusive páginas 2, 3... se a lista for paginada.)
"""
import re, sys, urllib.request, pathlib

if len(sys.argv) < 2:
    sys.exit(__doc__)
out = pathlib.Path(__file__).resolve().parent.parent / "tjto"
out.mkdir(exist_ok=True)
for i, url in enumerate(sys.argv[1:], 1):
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    html = urllib.request.urlopen(req, timeout=60).read().decode("utf-8", "replace")
    (out / f"pagina{i}.html").write_text(html, encoding="utf-8")
    texto = re.sub(r"<(script|style)[\s\S]*?</\1>", " ", html)
    texto = re.sub(r"<br\s*/?>|</p>|</li>|</tr>|</div>", "\n", texto)
    texto = re.sub(r"<[^>]+>", " ", texto)
    texto = re.sub(r"[ \t]+", " ", texto)
    texto = re.sub(r"\n\s*\n+", "\n", texto)
    (out / f"pagina{i}.txt").write_text(texto, encoding="utf-8")
    print(f"ok: {url} -> tjto/pagina{i}.txt ({len(texto)} caracteres)")
