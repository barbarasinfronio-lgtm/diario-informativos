#!/usr/bin/env python3
"""
normas_sob_pedido.py — atende os pedidos de "Pedir esta norma" do Diário das Resoluções.

Quem busca uma resolução, recomendação ou provimento que não está na lista curada pode pedir: o site grava o pedido no
Firestore (coleção pedidos-normas, um por órgão+busca). Este robô lê os pedidos, procura no acervo completo de atos do
órgão (leis/cnj-atos.json, atos-csjt.json, atos-cnmp.json, atos-csmpt.json) e acrescenta a norma a normas/pedidas.json,
que o Diário das Resoluções passa a mostrar. Pedidos que não acha vão para curadoria/normas-pedidas-falhas.json.

Roda no Mac (precisa ler o Firestore), pelo "Atender Pedidos de Normas.command":

    python3 scripts/normas_sob_pedido.py --plano            # lista os pedidos pendentes
    python3 scripts/normas_sob_pedido.py                    # atende todos
    python3 scripts/normas_sob_pedido.py --teste cnj "Resolução 325"   # procura e mostra, não grava
"""
import argparse, json, re, sys, unicodedata, urllib.parse, urllib.request
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
PEDIDAS = RAIZ / "normas" / "pedidas.json"
FALHAS = RAIZ / "curadoria" / "normas-pedidas-falhas.json"
FIRESTORE = "https://firestore.googleapis.com/v1/projects/diariodeinformativos/databases/(default)/documents/pedidos-normas"
API_KEY = "AIzaSyAe0g7Ps4d_uXvh1IiFTtDICwZ91YOUto0"      # chave pública do site (site/conta/nuvem-shared.js)
ACERVOS = {"cnj": "leis/cnj-atos.json", "csjt": "leis/atos-csjt.json", "cnmp": "leis/atos-cnmp.json", "csmpt": "leis/atos-csmpt.json"}
TIPOS = ["Resolução", "Recomendação", "Provimento", "Portaria", "Instrução Normativa", "Enunciado Administrativo", "Orientação", "Ato"]


def sem_acento(t):
    return "".join(c for c in unicodedata.normalize("NFD", t or "") if unicodedata.category(c) != "Mn").lower()


def ler_pedidos():
    out, token = [], ""
    while True:
        url = f"{FIRESTORE}?pageSize=300&key={API_KEY}" + (f"&pageToken={urllib.parse.quote(token)}" if token else "")
        try:
            j = json.loads(urllib.request.urlopen(url, timeout=30).read().decode("utf-8"))
        except Exception as e:
            sys.exit(f"não consegui ler os pedidos ({e}); as regras do Firestore já foram publicadas? (firestore.rules)")
        for d in j.get("documents", []):
            f = {k: (v.get("stringValue") or "") for k, v in d.get("fields", {}).items()}
            f["id"] = d["name"].rsplit("/", 1)[-1]
            out.append(f)
        token = j.get("nextPageToken", "")
        if not token:
            return out


def acervo(org):
    f = ACERVOS.get(org)
    if not f or not (RAIZ / f).exists():
        return []
    d = json.loads((RAIZ / f).read_text(encoding="utf-8"))
    return d["leis"] if isinstance(d, dict) else d


def partir(numero_completo):
    """'Resolução CNJ nº 325/2020' -> ('Resolução', '325', '2020')."""
    m = re.match(r"(.+?)\s+(?:\w+\s+)?n[ºo°.]*\s*(\d[\d.]*)\s*(?:/\s*(\d{4}))?", numero_completo)
    if not m:
        return None
    return m.group(1).strip(), m.group(2).replace(".", ""), m.group(3) or ""


def procurar(org, consulta, maximo=5):
    ac = acervo(org)
    q = sem_acento(consulta)
    tipo = next((t for t in TIPOS if sem_acento(t) in q or (t == "Resolução" and re.search(r"\bres\b", q)) or (t == "Recomendação" and re.search(r"\brec\b", q))), "")
    m = re.search(r"(\d{1,3}(?:\.\d{3})+|\d+)\s*(?:/|-|,?\s+de\s+)?\s*(\d{4}|\d{2})?\b", re.sub(r"\b(?:cnj|csjt|cnmp|csmpt)\b", "", q))
    achados = []
    if m:
        num, ano = m.group(1).replace(".", ""), m.group(2) or ""
        if len(ano) == 2:
            ano = ("19" if int(ano) > 30 else "20") + ano
        for a in ac:
            p = partir(a["numero"])
            if not p or p[1] != num or (ano and p[2] != ano):
                continue
            if tipo and sem_acento(p[0]) != sem_acento(tipo):
                continue
            achados.append(a)
        if not achados and tipo:                         # tipo digitado errado: aceita qualquer tipo com esse número
            achados = [a for a in ac if (partir(a["numero"]) or ("", "", ""))[1:] and partir(a["numero"])[1] == num and (not ano or partir(a["numero"])[2] == ano)]
    else:                                                # sem número: procura pelas palavras na ementa
        termos = [t for t in re.findall(r"[a-z0-9]{4,}", q) if t not in ("resolucao", "recomendacao", "provimento")]
        if termos:
            achados = [a for a in ac if all(t in sem_acento(a["nome"]) for t in termos)]
    return achados[:maximo]


def entrada(a):
    tipo, num, ano = partir(a["numero"]) or (a["numero"], "", "")
    return {"tipo": tipo, "numero": f"{num}/{ano}" if ano else num, "ementa": re.sub(r"\s*\(redação dada pela[^)]*\)\s*$", "", a["nome"]).strip(), "link": a["link"]}


def carregar(p, padrao):
    return json.loads(p.read_text(encoding="utf-8")) if p.exists() else padrao


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--plano", action="store_true")
    ap.add_argument("--teste", nargs=2, metavar=("ORGAO", "BUSCA"))
    a = ap.parse_args()
    if a.teste:
        for x in procurar(*a.teste):
            print(entrada(x))
        return
    pend = ler_pedidos()
    pedidas = carregar(PEDIDAS, {})
    falhas = carregar(FALHAS, [])
    feito = {(o, n["tipo"], n["numero"]) for o, L in pedidas.items() for n in L}
    novos = sem = 0
    for p in pend:
        org, consulta = p.get("orgao", ""), p.get("consulta", "")
        if a.plano:
            print(f"- {org}: {consulta}")
            continue
        achados = procurar(org, consulta)
        if not achados:
            sem += 1
            if not any(f.get("id") == p["id"] for f in falhas):
                falhas.append({"id": p["id"], "orgao": org, "consulta": consulta, "motivo": "não está no acervo de atos do órgão" if org in ACERVOS else "órgão sem acervo de atos"})
            continue
        for x in achados:
            e = entrada(x)
            if (org, e["tipo"], e["numero"]) in feito:
                continue
            pedidas.setdefault(org, []).append(e)
            feito.add((org, e["tipo"], e["numero"]))
            novos += 1
    if a.plano:
        return
    PEDIDAS.parent.mkdir(exist_ok=True)
    FALHAS.parent.mkdir(exist_ok=True)
    PEDIDAS.write_text(json.dumps(pedidas, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    FALHAS.write_text(json.dumps(falhas, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    print(f"{len(pend)} pedido(s): {novos} norma(s) acrescentada(s), {sem} sem resultado no acervo.")


if __name__ == "__main__":
    main()
