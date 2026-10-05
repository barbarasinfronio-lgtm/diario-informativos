#!/usr/bin/env python3
"""
dividir_por_ano.py — divide os arquivos de dados grandes em um arquivo por ano.

Os arquivos que você sobe continuam os mesmos (ex.: reclamacoes/reclamacoes-data.js).
Este script lê cada um e gera, numa pasta "anos/" ao lado dele:
  - index.json : lista de anos com quantos itens cada um tem (arquivo pequeno);
  - 2026.json, 2025.json, ... : os itens de cada ano, mais recentes primeiro;
  - sem-ano.json : itens sem data.
A página carrega primeiro o index.json e depois só os anos que precisa mostrar.

Para enxugar, o link do STF é tirado de cada item quando é o link padrão
(https://portal.stf.jus.br/processos/detalhe.asp?processo=<processo>): a página
monta esse link de novo a partir do número do processo.

Uso:  python3 scripts/dividir_por_ano.py
(Roda sozinho no GitHub a cada envio desses arquivos — ver
.github/workflows/dividir-dados-por-ano.yml.)
"""
import json
import os
import re
import sys

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# fonte: arquivo que você sobe; campo_data: onde está a data (AAAA-MM-DD);
# campo_grupo: filtro principal da página (classe da ação / tribunal).
CONJUNTOS = [
    {"fonte": "controleconst/adi_dados.js", "campo_data": "data", "campo_grupo": "classe",
     # P = prioritárias, O = outras (scripts/classificar_controle.js)
     "campo_cur": "cur"},
    {"fonte": "reclamacoes/reclamacoes-data.js", "campo_data": "dataJulgamento", "campo_grupo": "tribunal",
     # contagem extra por resultado (Procedente...), usada pelos filtros do Diário das Decisões
     "campo_extra": "tipo", "campo_cur": "cur"},
]

URL_STF = "https://portal.stf.jus.br/processos/detalhe.asp?processo="


def ler_dados(caminho):
    """Lê 'window.ALGO = [...];' e devolve a lista."""
    with open(caminho, encoding="utf-8") as f:
        texto = f.read()
    inicio = texto.index("[")
    fim = texto.rindex("]") + 1
    return json.loads(texto[inicio:fim])


def ano_do_item(item, campo_data):
    m = re.match(r"^(\d{4})-\d{2}-\d{2}$", str(item.get(campo_data) or ""))
    return m.group(1) if m else None


def escrever_json(caminho, dados):
    with open(caminho, "w", encoding="utf-8") as f:
        json.dump(dados, f, ensure_ascii=False, separators=(",", ":"))
        f.write("\n")


def dividir(conj):
    fonte = os.path.join(RAIZ, conj["fonte"])
    itens = ler_dados(fonte)
    pasta = os.path.join(os.path.dirname(fonte), "anos")
    os.makedirs(pasta, exist_ok=True)

    por_ano = {}
    for item in itens:
        item = dict(item)
        if item.get("url") == URL_STF + str(item.get("processo", "")):
            del item["url"]
        por_ano.setdefault(ano_do_item(item, conj["campo_data"]) or "sem-ano", []).append(item)

    anos = []
    for chave in sorted((k for k in por_ano if k != "sem-ano"), reverse=True) + (
        ["sem-ano"] if "sem-ano" in por_ano else []
    ):
        lista = por_ano[chave]
        # Mais recentes primeiro (estável: empates mantêm a ordem do arquivo).
        lista.sort(key=lambda it: str(it.get(conj["campo_data"]) or ""), reverse=True)
        grupos = {}
        for it in lista:
            g = str(it.get(conj["campo_grupo"]) or "")
            grupos[g] = grupos.get(g, 0) + 1
        escrever_json(os.path.join(pasta, chave + ".json"), lista)
        entrada = {"ano": chave, "total": len(lista), "grupos": grupos}
        if conj.get("campo_extra"):
            extra = {}
            for it in lista:
                g = str(it.get(conj["campo_extra"]) or "")
                extra[g] = extra.get(g, 0) + 1
            entrada["porTipo"] = extra
        if conj.get("campo_cur"):
            cur = {}
            for it in lista:
                g = str(it.get(conj["campo_cur"]) or "O")
                cur[g] = cur.get(g, 0) + 1
            entrada["porCur"] = cur
        anos.append(entrada)

    # Apaga arquivos de anos que sumiram dos dados.
    validos = {a["ano"] + ".json" for a in anos} | {"index.json"}
    for nome in os.listdir(pasta):
        if nome.endswith(".json") and nome not in validos:
            os.remove(os.path.join(pasta, nome))

    escrever_json(os.path.join(pasta, "index.json"), {
        "fonte": conj["fonte"],
        "total": len(itens),
        "campoGrupo": conj["campo_grupo"],
        "anos": anos,
    })
    print(f"{conj['fonte']}: {len(itens)} itens em {len(anos)} arquivos -> {os.path.relpath(pasta, RAIZ)}/")


def main():
    for conj in CONJUNTOS:
        if os.path.exists(os.path.join(RAIZ, conj["fonte"])):
            dividir(conj)
        else:
            print(f"(não encontrado: {conj['fonte']})", file=sys.stderr)


if __name__ == "__main__":
    main()
