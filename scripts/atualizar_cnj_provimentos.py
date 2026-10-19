#!/usr/bin/env python3
"""
atualizar_cnj_provimentos.py — traz TODOS os Provimentos da Corregedoria Nacional de
Justiça (CNJ) para o bloco "cnj" do Diário das Resoluções (site/leis/normas-data.js).

Fonte: o buscador oficial de atos do CNJ (https://atos.cnj.jus.br/atos), filtrado por
tipo Provimento (tipoAto=20); são ~250, em páginas de 10. Entram os vigentes e os não
vigentes: revogados, exauridos, expirados e suspensos ganham o aviso no começo da
ementa ("[REVOGADO] ..."), porque provas e editais antigos ainda os citam.

O resto do bloco "cnj" é curado à mão (Resoluções e Recomendações que importam para
prova); este robô só mexe nas linhas de Provimento: tira todas e as coloca de novo,
cada uma no seu ano, depois das normas do mesmo ano. Rodar de novo não muda nada se o
CNJ não publicou ato novo.

Uso:  python3 scripts/atualizar_cnj_provimentos.py
"""
import html
import json
import os
import re
import subprocess
import sys
import time

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
URL = "https://atos.cnj.jus.br/atos?atos=sim&tipoAto%5B0%5D=20&page={}"
UA = "Mozilla/5.0 (compatible; EstudaMana/1.0; +https://www.estudamana.com.br)"
MINIMO = 200
MARCA = {"Vigente": "", "Alterado": "", "Suspenso": "[SUSPENSO] ", "Revogado": "[REVOGADO] ",
         "Exaurido": "[EXAURIDO] ", "Expirado": "[EXPIRADO] ", "Sem efeito": "[SEM EFEITO] ",
         "Revogado parcialmente": ""}


def baixar(pagina):
    for tentativa in range(3):
        r = subprocess.run(["curl", "-sL", "-m", "90", "-A", UA, "-w", "\n%{http_code}", URL.format(pagina)],
                           capture_output=True, timeout=120)
        corpo, _, cod = r.stdout.rpartition(b"\n")
        if cod.decode().strip() == "200":
            return corpo.decode("utf-8", errors="replace")
        time.sleep(10 * (tentativa + 1))
    raise OSError(f"falha ao ler a página {pagina} do buscador do CNJ")


def provimentos():
    achados, p = [], 1
    while True:
        s = baixar(p)
        corpo = s[s.find("<tbody>"):s.find("</tbody>")]
        linhas = re.findall(r"<tr>(.*?)</tr>", corpo, re.S)
        if not linhas:
            break
        for l in linhas:
            tds = [html.unescape(re.sub(r"<[^>]+>", "", t)).strip() for t in re.findall(r"<td[^>]*>(.*?)</td>", l, re.S)]
            if len(tds) < 6 or tds[0] != "Provimento":
                continue
            achados.append({"num": tds[1].lstrip("0"), "ano": int(tds[2][-4:]), "sit": tds[4],
                            "ementa": re.sub(r"\s+", " ", tds[5])})
        print(f"  página {p}: {len(linhas)} atos", file=sys.stderr)
        p += 1
        time.sleep(0.5)
    return achados


def ano_da_linha(l):
    m = re.search(r'numero: "[^"]*?/(\d{4})"', l)
    return int(m.group(1)) if m else None


def main():
    achados = provimentos()
    if len(achados) < MINIMO:
        print(f"ERRO: só {len(achados)} Provimentos (esperado ≥ {MINIMO}); normas-data.js NÃO foi atualizado.", file=sys.stderr)
        sys.exit(1)
    caminho = os.path.join(RAIZ, "site/leis/normas-data.js")
    with open(caminho, encoding="utf-8") as f:
        texto = f.read()
    i = texto.index("\n  cnj: {")
    j = texto.index("\n  ]},", i)
    linhas = texto[i:j].split("\n")
    ini = next(k for k, l in enumerate(linhas) if l.startswith("    normas: ["))
    cab, corpo = linhas[:ini + 1], [l for l in linhas[ini + 1:] if 'tipo: "Provimento"' not in l]
    # a chave de leitura do Diário é <órgão>:<número>: o Provimento só ganha "Prov. " se repetir o número de outra norma
    usados = set(re.findall(r'numero: "([^"]+)"', "\n".join(corpo)))
    novas = {}
    for x in sorted(achados, key=lambda x: (x["ano"], int(re.sub(r"\D", "", x["num"]) or 0))):
        ementa = json.dumps(MARCA.get(x["sit"], "") + x["ementa"], ensure_ascii=False)
        numero = f'{x["num"]}/{x["ano"]}'
        if numero in usados:
            numero = "Prov. " + numero
        link = f'https://atos.cnj.jus.br/atos?atos=sim&numero={x["num"]}&ano={x["ano"]}'
        novas.setdefault(x["ano"], []).append(
            f'    {{ tipo: "Provimento", numero: "{numero}", ementa: {ementa}, link: "{link}" }},')
    for ano in sorted(novas, reverse=True):
        idx = [k for k, l in enumerate(corpo) if ano_da_linha(l) == ano] or \
              [k for k, l in enumerate(corpo) if ano_da_linha(l) is not None and ano_da_linha(l) < ano]
        pos = idx[-1] + 1 if idx else 0
        corpo[pos:pos] = novas[ano]
    novo = texto[:i] + "\n".join(cab + corpo) + texto[j:]
    if novo != texto:
        with open(caminho, "w", encoding="utf-8") as f:
            f.write(novo)
    print("CNJ: %d Provimentos da Corregedoria Nacional (%s)" % (
        len(achados), "atualizado" if novo != texto else "sem mudanças"))


if __name__ == "__main__":
    main()
