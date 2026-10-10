#!/usr/bin/env python3
"""
leis_sob_pedido.py — atende os pedidos de "Pedir para adicionar" do Diário de Leis.

Quem busca uma lei que não está no acervo (ex.: "Lei 9.140") pode clicar em "Pedir para adicionar": o site grava o
pedido no Firestore (coleção pedidos-leis, um por busca). Este robô lê os pedidos, entende o tipo, o número e o ano
("Lei nº 9.140/1995", "LC 101/2000", "Decreto-Lei 2.848/1940"; só o número de uma lei federal também serve: o ano é
deduzido e conferido pelo cabeçalho), busca no Planalto, grava o texto em leis/texto/ e acrescenta a lei a
leis/pedidas.json, que o Diário de Leis mostra como "Leis pedidas por leitores".

Roda no Mac (o Planalto bloqueia os servidores do GitHub), pelo "Atender Pedidos de Leis.command":

    python3 scripts/leis_sob_pedido.py --plano          # só lista os pedidos pendentes
    python3 scripts/leis_sob_pedido.py --max 20         # atende até 20
    python3 scripts/leis_sob_pedido.py --teste "Lei 9.140"   # busca e mostra, não grava
"""
import argparse, json, re, sys, time, urllib.parse
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(RAIZ / "scripts"))
import leis_citadas as lc  # noqa: E402
robo = lc.robo

PEDIDAS = RAIZ / "leis" / "pedidas.json"
FALHAS = RAIZ / "curadoria" / "leis-pedidas-falhas.json"
FIRESTORE = "https://firestore.googleapis.com/v1/projects/diariodeinformativos/databases/(default)/documents/pedidos-leis"
API_KEY = "AIzaSyAe0g7Ps4d_uXvh1IiFTtDICwZ91YOUto0"      # chave pública do site (site/conta/nuvem-shared.js)
RE_PEDIDO = re.compile(r"(?i)\b(Lei\s+Complementar|LC|Decreto[\s-]Lei|Decreto|Lei)?\s*(?:Federal\s*)?(?:n[ºo°.]*\s*)?(\d{1,3}(?:\.\d{3})+|\d{1,6})(?:\s*(?:/|-)\s*(\d{4}|\d{2})\b|\s*,?\s+de\s+(\d{4})\b)?")
# (número da lei ordinária, ano) — para deduzir o ano quando a pessoa digita só o número
ANCORAS = [(1, 1946), (1060, 1950), (2500, 1955), (3500, 1958), (4320, 1964), (5172, 1966), (5869, 1973), (6515, 1977), (7210, 1984),
           (7347, 1985), (8078, 1990), (8666, 1993), (9099, 1995), (9503, 1997), (9784, 1999), (10406, 2002), (11101, 2005),
           (12016, 2009), (12965, 2014), (13105, 2015), (14133, 2021), (14905, 2024), (15211, 2025), (15400, 2026)]


def pedidos():
    out, token = [], ""
    while True:
        url = f"{FIRESTORE}?pageSize=300&key={API_KEY}" + (f"&pageToken={urllib.parse.quote(token)}" if token else "")
        status, _, corpo = robo.buscar(url)
        if status != 200:
            raise robo.Falha(f"não consegui ler os pedidos (HTTP {status}); as regras do Firestore já foram publicadas? (firestore.rules)")
        j = json.loads(corpo.decode("utf-8"))
        for d in j.get("documents", []):
            f = {k: (v.get("stringValue") or "") for k, v in d.get("fields", {}).items()}
            f["id"] = d["name"].rsplit("/", 1)[-1]
            out.append(f)
        token = j.get("nextPageToken", "")
        if not token:
            return out


def anos_provaveis(n):
    n = int(n)
    est = None
    for (a, ya), (b, yb) in zip(ANCORAS, ANCORAS[1:]):
        if a <= n <= b:
            est = ya + (yb - ya) * (n - a) / (b - a)
            break
    if est is None:
        return []
    e = round(est)
    return [e, e - 1, e + 1, e - 2, e + 2]


def entender(consulta):
    """(tipo, número, [anos]) ou None."""
    m = RE_PEDIDO.search(consulta or "")
    if not m:
        return None
    tipo = lc.tipo_de(m.group(1)) if m.group(1) else "lei"
    n = m.group(2).replace(".", "")
    g = m.group(3) or m.group(4)
    if g:
        ano = g if len(g) == 4 else ("19" if int(g) > 30 else "20") + g
        return tipo, n, [ano]
    if tipo == "lei":
        return tipo, n, [str(a) for a in anos_provaveis(n)]
    return tipo, n, []


def ja_no_acervo(tipo, n, ano):
    s = (RAIZ / "site" / "leis" / "leis-data.js").read_text(encoding="utf-8")
    alvo = f"{lc.NOMES[tipo]} nº {lc.com_ponto(n)}/{ano}"
    return alvo in s or lc.chave(tipo, n, ano) in lc.ja_no_diario()


def nome_da_lei(url, numero):
    try:
        j = json.loads((robo.TEXTO_DIR / f"{robo.id_texto(url)}.json").read_text(encoding="utf-8"))
        for p in j["p"][1:4]:
            if len(p) > 25 and not re.match(r"(?i)^(art|o presidente|a presidente|faço saber)", p):
                return re.sub(r"\s+", " ", p)[:160].rstrip(" .;")
    except (OSError, ValueError, KeyError):
        pass
    return numero


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--plano", action="store_true")
    ap.add_argument("--teste")
    ap.add_argument("--max", type=int, default=20)
    a = ap.parse_args()
    hoje = robo.hoje()
    dados = json.loads(PEDIDAS.read_text(encoding="utf-8")) if PEDIDAS.exists() else {"leis": [], "pedidos": {}}
    feitos = dados.setdefault("pedidos", {})
    pend = [{"id": "teste", "consulta": a.teste}] if a.teste else [p for p in pedidos() if p["id"] not in feitos]
    print(f"{len(pend)} pedido(s) pendente(s).")
    if a.plano:
        for p in pend:
            print(f"  {p['id']}: {p.get('consulta', '')}  →  {entender(p.get('consulta', '')) or 'não entendi'}")
        return
    falhas = json.loads(FALHAS.read_text(encoding="utf-8")) if FALHAS.exists() and not a.teste else {}
    ok = 0
    for p in pend[:a.max]:
        e = entender(p.get("consulta", ""))
        print(f"  … “{p.get('consulta', '')}”", flush=True)
        if not e or not e[2]:
            falhas[p["id"]] = {"consulta": p.get("consulta", ""), "motivo": "não entendi o número/ano (ou falta o ano)"}
            print("    não entendi (para decreto, lei complementar ou decreto-lei, informe o ano: 'LC 101/2000')")
            feitos[p["id"]] = "nao-entendi"
            continue
        tipo, n, anos = e
        achou = None
        for ano in anos:
            if ja_no_acervo(tipo, n, ano):
                print(f"    {lc.NOMES[tipo]} nº {lc.com_ponto(n)}/{ano} já está no acervo")
                feitos[p["id"]] = "ja-no-acervo"
                achou = "ja"
                break
            try:
                url, gravou = lc.buscar_lei(tipo, n, ano, hoje)
            except Exception as ex:   # noqa: BLE001 — conexão derrubada: tenta na próxima rodada
                print(f"    erro de conexão ({type(ex).__name__}); fica para a próxima rodada")
                time.sleep(5)
                achou = "erro"
                break
            if url:
                achou = (url, ano)
                break
        if achou in ("ja", "erro"):
            continue
        if not achou:
            falhas[p["id"]] = {"consulta": p.get("consulta", ""), "motivo": "não achei no Planalto"}
            feitos[p["id"]] = "nao-achei"
            print("    não achei no Planalto")
            continue
        url, ano = achou
        numero = f"{lc.NOMES[tipo]} nº {lc.com_ponto(n)}/{ano}"
        if a.teste:
            print(f"    achei: {numero} → {url}\n    nome: {nome_da_lei(url, numero)}")
            continue
        dados["leis"] = [x for x in dados["leis"] if x["link"] != url] + [{"nome": nome_da_lei(url, numero), "numero": numero, "link": url}]
        feitos[p["id"]] = "ok"
        falhas.pop(p["id"], None)
        ok += 1
        print(f"    adicionada: {numero}")
    if not a.teste:
        dados["leis"].sort(key=lambda x: x["numero"])
        PEDIDAS.write_text(json.dumps(dados, ensure_ascii=False, indent=1), encoding="utf-8")
        FALHAS.write_text(json.dumps(falhas, ensure_ascii=False, indent=1), encoding="utf-8")
        robo.indice_dos_textos()
        print(f"{ok} lei(s) adicionada(s); {len(falhas)} pedido(s) sem sucesso no total.")


if __name__ == "__main__":
    main()
