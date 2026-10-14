#!/usr/bin/env python3
"""
pedidos_carreira.py — lista os pedidos de "Solicitar carreira" do Diário de Editais.

Quem busca um concurso ou carreira que ainda não temos (ex.: "Analista Judiciário TRT 8") pode clicar em
"Solicitar carreira": o site grava o pedido no Firestore (coleção pedidos-carreiras, um por texto). Este script
mostra os pedidos que ainda não foram atendidos; para atender, a equipe monta o edital (scripts/editais/LEIA-ME.md),
reúne as provas (Atualizar Provas) e importa as leis (leis_dos_editais.py / leis_estaduais_massa.py) e então marca
o pedido como atendido em curadoria/carreiras-pedidas.json.

    python3 scripts/pedidos_carreira.py                 # lista os pendentes
    python3 scripts/pedidos_carreira.py --todos         # lista também os atendidos
    python3 scripts/pedidos_carreira.py --atendido "analista-judiciario-trt-8"   # marca como atendido
"""
import argparse, json, sys, urllib.parse
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(RAIZ / "scripts"))
import atualizar_informativos as robo  # noqa: E402

ATENDIDOS = RAIZ / "curadoria" / "carreiras-pedidas.json"
FIRESTORE = "https://firestore.googleapis.com/v1/projects/diariodeinformativos/databases/(default)/documents/pedidos-carreiras"
API_KEY = "AIzaSyAe0g7Ps4d_uXvh1IiFTtDICwZ91YOUto0"      # chave pública do site (site/conta/nuvem-shared.js)


def pedidos():
    out, token = [], ""
    while True:
        url = f"{FIRESTORE}?pageSize=300&key={API_KEY}" + (f"&pageToken={urllib.parse.quote(token)}" if token else "")
        status, _, corpo = robo.buscar(url)
        if status != 200:
            raise robo.Falha(f"não consegui ler os pedidos (HTTP {status}); as regras do Firestore (firestore.rules) já foram publicadas?")
        j = json.loads(corpo.decode("utf-8"))
        for d in j.get("documents", []):
            f = {k: (v.get("stringValue") or "") for k, v in d.get("fields", {}).items()}
            f["id"] = d["name"].rsplit("/", 1)[-1]
            out.append(f)
        token = j.get("nextPageToken", "")
        if not token:
            return sorted(out, key=lambda x: x.get("em", ""))


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--todos", action="store_true")
    ap.add_argument("--atendido")
    a = ap.parse_args()
    feitos = json.loads(ATENDIDOS.read_text(encoding="utf-8")) if ATENDIDOS.exists() else {}
    if a.atendido:
        feitos[a.atendido] = robo.hoje()
        ATENDIDOS.parent.mkdir(exist_ok=True)
        ATENDIDOS.write_text(json.dumps(feitos, ensure_ascii=False, indent=1), encoding="utf-8")
        print("marcado como atendido:", a.atendido)
        return
    lista = pedidos()
    pend = [p for p in lista if p["id"] not in feitos]
    print(f"{len(lista)} pedido(s) no total; {len(pend)} pendente(s).")
    for p in (lista if a.todos else pend):
        print(f"  {'✔' if p['id'] in feitos else '•'} {p.get('consulta','')}   [{p['id']}]  {p.get('em','')[:10]}")


if __name__ == "__main__":
    main()
