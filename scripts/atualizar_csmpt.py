#!/usr/bin/env python3
"""
atualizar_csmpt.py — traz as Resoluções do CSMPT (Conselho Superior do
Ministério Público do Trabalho) para o Diário das Resoluções.

Fonte: a tabela de resoluções do site do MPT
(https://mpt.mp.br/pgt/conselho-superior/resolucoes-1) — uma única consulta:
número, ementa, data de publicação e o PDF de cada resolução.

ATENÇÃO: a página do MPT não indica quais resoluções foram revogadas, então
todas entram (o Diário avisa isso na descrição do órgão).

Gera o bloco "csmpt" de normas-data.js (entre as marcas >>> csmpt / <<< csmpt)
e põe "csmpt" na lista de órgãos, logo depois do CNMP. Chave de leitura:
"csmpt:<número>/<ano>". Roda no Mac, junto com os robôs do TST e do CSJT
(scripts/rodar_no_mac.sh).

Uso:  python3 scripts/atualizar_csmpt.py
"""
import html
import json
import os
import re
import sys
import urllib.parse
import urllib.request
from html.parser import HTMLParser

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
UA = "EstudaMana/1.0 (+https://www.estudamana.com.br; atualizacao semanal)"
URL = "https://mpt.mp.br/pgt/conselho-superior/resolucoes-1"
MINIMO = 150
LABEL = "CSMPT — Conselho Superior do Ministério Público do Trabalho"


class Tabela(HTMLParser):
    """Linhas de todas as <table>: [(texto da célula, 1º link da célula)]."""

    def __init__(self):
        super().__init__()
        self.linhas, self.linha, self.celula = [], None, None

    def handle_starttag(self, tag, attrs):
        if tag == "tr":
            self.linha = []
        elif tag in ("td", "th") and self.linha is not None:
            self.celula = {"texto": [], "link": None}
        elif tag == "a" and self.celula is not None and not self.celula["link"]:
            self.celula["link"] = dict(attrs).get("href")
        elif tag in ("br", "p", "div") and self.celula is not None:
            self.celula["texto"].append(" ")

    def handle_endtag(self, tag):
        if tag in ("td", "th") and self.celula is not None and self.linha is not None:
            texto = re.sub(r"\s+", " ", html.unescape("".join(self.celula["texto"]))).strip()
            self.linha.append((texto, self.celula["link"]))
            self.celula = None
        elif tag == "tr" and self.linha is not None:
            if self.linha:
                self.linhas.append(self.linha)
            self.linha = None

    def handle_data(self, data):
        if self.celula is not None:
            self.celula["texto"].append(data)


def ano4(a):
    n = int(a)
    if len(a) == 4:
        return n
    return 1900 + n if n > 30 else 2000 + n


def main():
    req = urllib.request.Request(URL, headers={"User-Agent": UA})
    try:
        with urllib.request.urlopen(req, timeout=60) as r:
            pagina = r.read().decode("utf-8", errors="replace")
    except Exception as e:  # noqa: BLE001
        print(f"ERRO ao baixar {URL}: {e}", file=sys.stderr)
        sys.exit(1)

    p = Tabela()
    p.feed(pagina)
    normas, vistos = [], set()
    for linha in p.linhas:
        if len(linha) < 2:
            continue
        titulo, link = linha[0]
        m = re.search(r"(?:n[º°o.]?\s*)?(\d{1,4})\s*/\s*(\d{4}|\d{2})\b", titulo, re.I)
        if not m or not re.search(r"resolu", titulo, re.I):
            continue
        numero = f"{int(m.group(1))}/{ano4(m.group(2))}"
        if numero in vistos:  # a chave de leitura é <órgão>:<número>
            print(f"  (repetido, ignorado: {titulo})", file=sys.stderr)
            continue
        vistos.add(numero)
        ementa = linha[1][0].strip() or titulo
        if link:
            link = urllib.parse.urljoin(URL, link)
        normas.append({"tipo": "Resolução", "numero": numero, "ementa": ementa, "link": link or URL})

    if len(normas) < MINIMO:
        print(f"ERRO: só {len(normas)} resoluções (esperado ≥ {MINIMO}); normas-data.js NÃO foi atualizado.",
              file=sys.stderr)
        sys.exit(1)

    normas.sort(key=lambda n: (int(n["numero"].split("/")[1]), int(n["numero"].split("/")[0])))
    linhas = ["    { tipo: %s, numero: %s, ementa: %s, link: %s }," % tuple(
        json.dumps(n[k], ensure_ascii=False) for k in ("tipo", "numero", "ementa", "link")) for n in normas]
    bloco = ("  // >>> csmpt (gerado por scripts/atualizar_csmpt.py a partir do site do MPT — não editar à mão)\n"
             f'  csmpt: {{ label: {json.dumps(LABEL, ensure_ascii=False)}, status: "disponivel", '
             '\n    descricao: "Todas as Resoluções do Conselho Superior do MPT publicadas no site do MPT, atualizadas toda semana.",'
             '\n    aviso: "Atenção: o site do MPT não indica quais foram revogadas, então todas aparecem aqui.",\n    normas: [\n'
             + "\n".join(linhas) + "\n  ]},\n  // <<< csmpt\n")

    caminho = os.path.join(RAIZ, "site/leis/normas-data.js")
    with open(caminho, encoding="utf-8") as f:
        texto = f.read()
    marcado = re.compile(r"  // >>> csmpt[^\n]*\n[\s\S]*?  // <<< csmpt\n")
    if marcado.search(texto):
        novo = marcado.sub(lambda _m: bloco, texto)
    else:  # primeira vez: entra antes do fim de NORMAS_DATA
        fim = texto.index("\n};\n\nvar NORMAS_ORG_ORDER")
        novo = texto[:fim + 1] + "\n" + bloco + texto[fim + 1:]
    ordem = novo.split("var NORMAS_ORG_ORDER", 1)[1].split(";", 1)[0]
    if '"csmpt"' not in ordem:
        novo = novo.replace('"cnmp", ', '"cnmp", "csmpt", ', 1) if '"cnmp", ' in ordem else novo
    if novo != texto:
        with open(caminho, "w", encoding="utf-8") as f:
            f.write(novo)
    print(f"CSMPT: {len(normas)} resoluções")


if __name__ == "__main__":
    main()
