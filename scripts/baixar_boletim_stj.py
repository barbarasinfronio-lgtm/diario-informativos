#!/usr/bin/env python3
"""Baixa a página do Boletim de Precedentes do STJ e guarda em
stj/boletim-precedentes-raw.html, para o Claude montar a lista (edições,
datas, links) e incluí-la nos Informativos do STJ.

Rodar no Mac (o STJ recusa os servidores do GitHub), na pasta do repositório:
    python3 scripts/baixar_boletim_stj.py
Usa o mesmo caminho do robô dos Informativos (inclusive o Chrome do Mac, se
o STJ recusar o acesso direto).
"""
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import atualizar_informativos as robo  # noqa: E402

URL = "https://processo.stj.jus.br/processo/precedentes"
DESTINO = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
                       "stj", "boletim-precedentes-raw.html")

try:
    html = robo.pagina(URL)
except Exception as e:  # noqa: BLE001
    sys.exit(f"ERRO: não consegui abrir {URL}: {e}")
if isinstance(html, bytes):
    html = html.decode("utf-8", "replace")
with open(DESTINO, "w", encoding="utf-8") as f:
    f.write(html)
print(f"ok: {len(html)} caracteres -> stj/boletim-precedentes-raw.html")
