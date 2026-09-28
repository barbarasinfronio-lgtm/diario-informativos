#!/usr/bin/env python3
"""
atualizar_csjt.py — traz as Resoluções e Recomendações do CSJT (Conselho
Superior da Justiça do Trabalho) para o Diário das Resoluções.

Fonte: JusLaboris, a biblioteca digital do TST (juslaboris.tst.jus.br), pela
busca estruturada (OpenSearch/Atom) — cerca de 10 consultas por execução.

  - lista todas as Resoluções e Recomendações com autor CSJT (título, link,
    ementa);
  - tira as que a biblioteca marca como "Revogado" ou "Anulado" (campo
    dc.description.status); as "Alterado" continuam (estão em vigor).

Gera o bloco "csjt" de normas-data.js (entre as marcas >>> csjt / <<< csjt)
e põe "csjt" na lista de órgãos. A chave de leitura é "csjt:<número>/<ano>",
no mesmo formato dos outros órgãos.

Como o TST (dono da JusLaboris) não responde aos servidores do GitHub, este
script roda no Mac, junto com o do TST (~/EstudaMana/atualizar-tst.sh).

Uso:  python3 scripts/atualizar_csjt.py
"""
import json
import os
import re
import sys
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
UA = "EstudaMana/1.0 (+https://www.estudamana.com.br; atualizacao semanal)"
BUSCA = "https://juslaboris.tst.jus.br/open-search/discover"
AUTOR = 'dc.contributor.author:"Conselho Superior da Justiça do Trabalho (Brasil) (CSJT)"'
TIPOS = {"Resolução": 350, "Recomendação": 15}  # mínimo esperado de cada tipo
FORA = ("Revogado", "Anulado")                  # status que saem da lista

NS = {"a": "http://www.w3.org/2005/Atom", "os": "http://a9.com/-/spec/opensearch/1.1/"}
MESES = "janeiro fevereiro março abril maio junho julho agosto setembro outubro novembro dezembro".split()


def buscar(consulta):
    """Todas as páginas da busca: [(título, link, ementa)]."""
    itens, inicio = [], 0
    while True:
        url = BUSCA + "?" + urllib.parse.urlencode(
            {"format": "atom", "rpp": 100, "start": inicio, "query": consulta})
        req = urllib.request.Request(url, headers={"User-Agent": UA})
        with urllib.request.urlopen(req, timeout=60) as r:
            raiz = ET.fromstring(r.read())
        pagina = raiz.findall("a:entry", NS)
        for e in pagina:
            link = e.find("a:link", NS)
            itens.append((
                (e.findtext("a:title", "", NS) or "").strip(),
                link.get("href") if link is not None else "",
                re.sub(r"\s+", " ", e.findtext("a:summary", "", NS) or "").strip(),
            ))
        total = int(raiz.findtext("os:totalResults", "0", NS) or 0)
        inicio += len(pagina)
        if not pagina or inicio >= total:
            return itens


# O resumo da busca vem com a citação bibliográfica colada no fim
# ("... CONSELHO SUPERIOR DA JUSTIÇA DO TRABALHO (Brasil). Resolução n. 1, ...
# Diário da Justiça ..."); corta a partir do primeiro nome em MAIÚSCULAS
# seguido de "(Brasil)." (vale também para atos conjuntos com a CGJT/TST).
CITACAO = re.compile(r"\s+[A-ZÁÉÍÓÚÂÊÔÃÕÇ][A-ZÁÉÍÓÚÂÊÔÃÕÇ\-,. ]{6,}\s\(Brasil\)\.")


def limpar_ementa(texto):
    m = CITACAO.search(texto)
    return (texto[:m.start()] if m else texto).strip()


def numero_ano(titulo):
    """'Resolução n. 452/CSJT, de 17 de julho de 2026' -> ('452', '2026')."""
    n = re.search(r"n[º°.]?\s*(\d+)", titulo)
    a = re.search(r"de\s+\d{1,2}º?\s+de\s+(?:" + "|".join(MESES) + r")\s+de\s+(\d{4})", titulo, re.I)
    if not a:
        a = re.search(r"(\d{4})\s*$", titulo)
    return (n.group(1) if n else None), (a.group(1) if a else None)


def main():
    normas, erros = [], []
    for tipo, minimo in TIPOS.items():
        base = f'{AUTOR} AND dc.type.ato:"{tipo}"'
        try:
            todos = buscar(base)
            fora = set()
            for status in FORA:
                fora |= {link for _, link, _ in buscar(f'{base} AND dc.description.status:"{status}"')}
        except Exception as e:  # noqa: BLE001
            erros.append(f"{tipo}: {e}")
            continue
        if len(todos) < minimo:
            erros.append(f"{tipo}: só {len(todos)} atos (esperado ≥ {minimo})")
            continue
        vigentes = 0
        for titulo, link, ementa in todos:
            if link in fora:
                continue
            num, ano = numero_ano(titulo)
            if not num or not ano:
                print(f"  (ignorado, sem número/ano no título: {titulo})", file=sys.stderr)
                continue
            normas.append({"tipo": tipo, "numero": f"{int(num)}/{ano}",
                           "ementa": limpar_ementa(ementa) or titulo, "link": link})
            vigentes += 1
        print(f"{tipo}: {len(todos)} no total, {vigentes} em vigor ({len(fora)} revogadas/anuladas)")

    if erros:
        for e in erros:
            print("ERRO " + e, file=sys.stderr)
        print("normas-data.js NÃO foi atualizado (fica a versão anterior).", file=sys.stderr)
        sys.exit(1)

    # Mesma ordem dos outros órgãos: do mais antigo para o mais novo.
    normas.sort(key=lambda n: (int(n["numero"].split("/")[1]), n["tipo"] != "Recomendação",
                               int(n["numero"].split("/")[0])))
    vistos, unicas = set(), []
    for n in normas:  # a chave de leitura é <órgão>:<número>; não pode repetir
        if n["numero"] in vistos:
            print(f"  (repetido, ignorado: {n['tipo']} {n['numero']})", file=sys.stderr)
            continue
        vistos.add(n["numero"])
        unicas.append(n)

    linhas = ["    { tipo: %s, numero: %s, ementa: %s, link: %s }," % tuple(
        json.dumps(n[k], ensure_ascii=False) for k in ("tipo", "numero", "ementa", "link")) for n in unicas]
    bloco = ("  // >>> csjt (gerado por scripts/atualizar_csjt.py a partir da JusLaboris — não editar à mão)\n"
             '  csjt: { label: "CSJT — Conselho Superior da Justiça do Trabalho", status: "disponivel", normas: [\n'
             + "\n".join(linhas) + "\n  ]},\n  // <<< csjt\n")

    caminho = os.path.join(RAIZ, "normas-data.js")
    with open(caminho, encoding="utf-8") as f:
        texto = f.read()
    marcado = re.compile(r"  // >>> csjt[^\n]*\n[\s\S]*?  // <<< csjt\n")
    if marcado.search(texto):
        novo = marcado.sub(lambda _m: bloco, texto)
    else:  # primeira vez: entra antes do fim de NORMAS_DATA
        fim = texto.index("\n};\n\nvar NORMAS_ORG_ORDER")
        novo = texto[:fim + 1] + "\n" + bloco + texto[fim + 1:]
    if '"csjt"' not in novo.split("var NORMAS_ORG_ORDER", 1)[1].split(";", 1)[0]:
        novo = novo.replace('var NORMAS_ORG_ORDER = ["cnj", ', 'var NORMAS_ORG_ORDER = ["cnj", "csjt", ', 1)
    if novo != texto:
        with open(caminho, "w", encoding="utf-8") as f:
            f.write(novo)
    print(f"normas-data.js: {len(unicas)} normas do CSJT")


if __name__ == "__main__":
    main()
