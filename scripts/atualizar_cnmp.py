#!/usr/bin/env python3
"""
atualizar_cnmp.py — traz as Resoluções, Recomendações, Resoluções Conjuntas,
Emendas Regimentais e o Regimento Interno do CNMP (Conselho Nacional do
Ministério Público) para o Diário das Resoluções.

Fonte: a lista oficial "Atos e Normas" do CNMP
(https://www.cnmp.mp.br/portal/atos-e-normas-busca), ~12 mil atos em páginas de
20 (portarias, termos de cooperação etc. também estão nela; o filtro por
categoria do site não funciona por URL, então o robô lê a lista toda e fica só
com o que é norma de estudo). Cada item traz título ("RESOLUÇÃO Nº 23, DE 17 DE
SETEMBRO DE 2007"), descrição e a página do ato.

O robô é EDUCADO: uma página por vez, pausa entre elas, e PARA se o servidor
recusar (403/429). As páginas já lidas ficam em ~/EstudaMana/cache-cnmp/ (fora
do repositório): pode interromper (Ctrl+C) e retomar sem baixar de novo. As
páginas mais novas (as primeiras da lista) são sempre baixadas outra vez.

ATENÇÃO: a lista não indica quais normas foram revogadas, então todas entram
(o Diário avisa isso na descrição do órgão).

Gera o bloco "cnmp" de normas-data.js (entre as marcas >>> cnmp / <<< cnmp).

Uso:  python3 scripts/atualizar_cnmp.py            # lê tudo (ou retoma) e grava
      python3 scripts/atualizar_cnmp.py --so-cache # só monta a partir do cache
"""
import html
import json
import os
import re
import subprocess
import sys
import time
import urllib.error
import urllib.parse
import urllib.request

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CACHE = os.path.join(os.path.expanduser("~"), "EstudaMana", "cache-cnmp")
UA = "Mozilla/5.0 (compatible; EstudaMana/1.0; +https://www.estudamana.com.br)"  # o site do CNMP não responde a UA sem "Mozilla"
BASE = "https://www.cnmp.mp.br"
LISTA = BASE + "/portal/atos-e-normas-busca?start=%d"
PASSO = 20
PAUSA = 1.5
RELER_AS_PRIMEIRAS = 5  # páginas mais novas: sempre baixadas de novo
MINIMO = 150
LABEL = "CNMP — Conselho Nacional do Ministério Público"

TIPOS = [  # (regex do começo do título, tipo mostrado)
    (r"RESOLU[ÇC][ÃA]O CONJUNTA", "Resolução Conjunta"),
    (r"RESOLU[ÇC][ÃA]O", "Resolução"),
    (r"RECOMENDA[ÇC][ÃA]O", "Recomendação"),
    (r"EMENDA REGIMENTAL", "Emenda Regimental"),
    (r"REGIMENTO INTERNO", "Regimento Interno"),
]
MESES = {m: i + 1 for i, m in enumerate(
    "janeiro fevereiro março abril maio junho julho agosto setembro outubro novembro dezembro".split())}


class Bloqueio(Exception):
    pass


def baixar(url):
    # curl em vez de urllib: o Python não completa o handshake TLS com o site do CNMP (curl completa)
    r = subprocess.run(["curl", "-sL", "-m", "60", "-A", UA, "-w", "\n%{http_code}", url],
                       capture_output=True, timeout=90)
    corpo, _, cod = r.stdout.rpartition(b"\n")
    cod = cod.decode().strip()
    if cod in ("403", "429", "503"):
        raise Bloqueio(f"HTTP {cod} em {url}")
    if cod != "200":
        raise OSError(f"HTTP {cod or r.returncode} em {url}")
    return corpo.decode("utf-8", errors="replace")


def pagina(inicio, forcar):
    os.makedirs(CACHE, exist_ok=True)
    arq = os.path.join(CACHE, "%06d.html" % inicio)
    if os.path.exists(arq) and not forcar:
        with open(arq, encoding="utf-8") as f:
            return f.read(), False
    txt = None
    for tentativa in range(3):
        try:
            txt = baixar(LISTA % inicio)
            break
        except Bloqueio:
            raise
        except Exception as e:  # noqa: BLE001
            print(f"  (falha {tentativa + 1}/3 em start={inicio}: {e})", file=sys.stderr)
            time.sleep(10 * (tentativa + 1))
    if txt is None:
        raise Bloqueio(f"3 falhas seguidas em start={inicio}")
    with open(arq, "w", encoding="utf-8") as f:
        f.write(txt)
    return txt, True


ITEM = re.compile(
    r'<h3 class="result-title[^"]*">\s*<a href="([^"]+)">\s*([^<]+?)\s*</a>\s*</h3>'
    r'(?:\s*<div class="descricao">\s*<h4>[^<]*</h4>\s*<p class="result-text">\s*([\s\S]*?)\s*</p>)?')


def itens(txt):
    for m in ITEM.finditer(txt):
        yield (urllib.parse.urljoin(BASE, html.unescape(m.group(1))),
               re.sub(r"\s+", " ", html.unescape(m.group(2))).strip(),
               re.sub(r"\s+", " ", html.unescape(re.sub(r"<[^>]+>", " ", m.group(3) or ""))).strip())


def classificar(titulo):
    """('Resolução', '23/2007') ou None se não for norma de estudo."""
    t = titulo.upper()
    tipo = next((nome for rx, nome in TIPOS if re.match(rx, t)), None)
    if not tipo:
        return None
    ano = re.search(r"\b(?:DE|/)\s*(?:\d{1,2}\s+DE\s+[A-ZÇÃ]+\s+DE\s+)?(\d{4})\b", t) or re.search(r"(\d{4})", t)
    if tipo == "Regimento Interno":
        return tipo, "RICNMP" + (f"/{ano.group(1)}" if ano else "")
    n = re.search(r"N[º°O.]*\s*(\d{1,4})", t)
    if not n or not ano:
        return None
    return tipo, f"{int(n.group(1))}/{ano.group(1)}"


def main():
    so_cache = "--so-cache" in sys.argv
    normas, vistos, p, total_paginas, baixadas = [], {}, 0, None, 0
    try:
        while True:
            inicio = p * PASSO
            if so_cache and not os.path.exists(os.path.join(CACHE, "%06d.html" % inicio)):
                break
            txt, veio_da_rede = pagina(inicio, forcar=(not so_cache and p < RELER_AS_PRIMEIRAS))
            if total_paginas is None:
                ult = re.findall(r"start=(\d+)", txt)
                total_paginas = (max(int(x) for x in ult) // PASSO + 1) if ult else 1
                print(f"Lista do CNMP: ~{total_paginas} páginas", file=sys.stderr)
            achados = list(itens(txt))
            if not achados:
                break
            for link, titulo, ementa in achados:
                c = classificar(titulo)
                if not c:
                    continue
                tipo, numero = c
                if (tipo, numero) in vistos:
                    continue
                vistos[(tipo, numero)] = True
                normas.append({"tipo": tipo, "numero": numero, "ementa": ementa or titulo, "link": link,
                               "titulo": titulo})
            p += 1
            if veio_da_rede:
                baixadas += 1
                time.sleep(PAUSA)
                if baixadas % 25 == 0:
                    print(f"  ... página {p}/{total_paginas}, {len(normas)} normas", file=sys.stderr)
            if total_paginas and p >= total_paginas:
                break
    except Bloqueio as e:
        print(f"PAREI: {e}. Rode de novo mais tarde; o que já foi lido está em {CACHE}.", file=sys.stderr)
        sys.exit(2)
    except KeyboardInterrupt:
        print("Interrompido; rode de novo para retomar.", file=sys.stderr)
        sys.exit(130)

    if len(normas) < MINIMO:
        print(f"ERRO: só {len(normas)} normas (esperado ≥ {MINIMO}); normas-data.js NÃO foi atualizado.",
              file=sys.stderr)
        sys.exit(1)

    # a chave de leitura é <órgão>:<número>; Resolução e Recomendação podem repetir o número no mesmo ano
    contagem = {}
    for n in normas:
        contagem[n["numero"]] = contagem.get(n["numero"], 0) + 1
    for n in normas:
        if contagem[n["numero"]] > 1 and n["tipo"] != "Resolução":
            n["numero"] = {"Recomendação": "Rec. ", "Resolução Conjunta": "Conj. ", "Emenda Regimental": "Em. "}.get(
                n["tipo"], "") + n["numero"]

    def ordem(n):
        m = re.search(r"(\d+)/(\d{4})", n["numero"])
        return (int(m.group(2)), int(m.group(1))) if m else (9999, 0)
    normas.sort(key=ordem)

    linhas = ["    { tipo: %s, numero: %s, ementa: %s, link: %s }," % tuple(
        json.dumps(n[k], ensure_ascii=False) for k in ("tipo", "numero", "ementa", "link")) for n in normas]
    bloco = ("  // >>> cnmp (gerado por scripts/atualizar_cnmp.py a partir de cnmp.mp.br/portal/atos-e-normas — não editar à mão)\n"
             f'  cnmp: {{ label: {json.dumps(LABEL, ensure_ascii=False)}, status: "disponivel", '
             '\n    descricao: "Resoluções, Recomendações, Resoluções Conjuntas, Emendas Regimentais e Regimento Interno do CNMP, conforme a lista oficial Atos e Normas (cnmp.mp.br). Vá marcando conforme for lendo.",'
             '\n    aviso: "Atenção: a lista do CNMP não indica quais normas foram revogadas, então todas aparecem aqui. Confira a vigência no link antes de estudar.",\n    normas: [\n'
             + "\n".join(linhas) + "\n  ]},\n  // <<< cnmp\n")

    caminho = os.path.join(RAIZ, "site/leis/normas-data.js")
    with open(caminho, encoding="utf-8") as f:
        texto = f.read()
    marcado = re.compile(r"  // >>> cnmp[^\n]*\n[\s\S]*?  // <<< cnmp\n")
    if marcado.search(texto):
        novo = marcado.sub(lambda _m: bloco, texto)
    else:  # primeira vez: troca o bloco curado antigo pelo gerado
        antigo = re.compile(r"  cnmp: \{ label:[\s\S]*?\n  \]\},\n")
        if not antigo.search(texto):
            print("ERRO: não achei o bloco cnmp antigo em normas-data.js", file=sys.stderr)
            sys.exit(1)
        novo = antigo.sub(lambda _m: bloco, texto, count=1)
    if novo != texto:
        with open(caminho, "w", encoding="utf-8") as f:
            f.write(novo)
    por_tipo = {}
    for n in normas:
        por_tipo[n["tipo"]] = por_tipo.get(n["tipo"], 0) + 1
    print("CNMP:", len(normas), "normas", por_tipo)


if __name__ == "__main__":
    main()
