#!/usr/bin/env python3
"""
leis_sob_pedido.py — atende os pedidos de "Pedir para adicionar" do Diário de Leis.

Quem busca uma lei que não está no acervo (ex.: "Lei 9.140") pode clicar em "Pedir para adicionar": o site grava o
pedido no Firestore (coleção pedidos-leis, um por busca). Este robô lê os pedidos, entende o tipo, o número e o ano
("Lei nº 9.140/1995", "LC 101/2000", "Decreto-Lei 2.848/1940"; só o número de uma lei federal também serve: o ano é
deduzido e conferido pelo cabeçalho; o NOME popular também serve — "Lei Mariana Ferrer", "Lei Maria da Penha" —,
achado pelos apelidos das listas de legislação do Senado; se o nome vale para mais de uma lei, pede o número), busca no Planalto, grava o texto em leis/texto/ e acrescenta a lei a
leis/pedidas.json, que o Diário de Leis mostra como "Leis pedidas por leitores".

Roda no Mac (o Planalto bloqueia os servidores do GitHub), pelo "Atender Pedidos de Leis.command":

    python3 scripts/leis_sob_pedido.py --plano          # só lista os pedidos pendentes
    python3 scripts/leis_sob_pedido.py --max 20         # atende até 20
    python3 scripts/leis_sob_pedido.py --teste "Lei 9.140"   # busca e mostra, não grava
"""
import argparse, json, re, sys, time, urllib.parse
from datetime import date
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(RAIZ / "scripts"))
import leis_citadas as lc  # noqa: E402
import pedidos_retentativa as pr  # noqa: E402
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
            f["criado"] = str(d.get("createTime") or "")[:10]      # data do pedido (regra dos 6 meses)
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


# siglas e apelidos que a pessoa digita no lugar do número (o site também as acha, ver SIGLAS_LEIS em leis-logic.js)
SIGLAS = {"cadh": "Decreto 678/1992", "pacto de sao jose": "Decreto 678/1992", "pacto de san jose": "Decreto 678/1992",
          "pidcp": "Decreto 592/1992", "pidesc": "Decreto 591/1992", "cdpd": "Decreto 6.949/2009", "lgpd": "Lei 13.709/2018",
          "lac": "Lei 12.846/2013", "lei anticorrupcao": "Lei 12.846/2013", "lef": "Lei 6.830/1980", "ldb": "Lei 9.394/1996",
          "lld": "Lei 9.613/1998", "laa": "Lei 13.869/2019", "eca": "Lei 8.069/1990", "cpc": "Lei 13.105/2015",
          "cdc": "Lei 8.078/1990", "lia": "Lei 8.429/1992", "lai": "Lei 12.527/2011", "mci": "Lei 12.965/2014"}


def sem_acento(t):
    import unicodedata
    return "".join(c for c in unicodedata.normalize("NFD", t or "") if unicodedata.category(c) != "Mn").lower().strip(" .")


# ---- busca pelo NOME (apelido) da lei: "Lei Mariana Ferrer", "Lei Maria da Penha", "Lei Carolina Dieckmann" -------------
# Fonte: dados abertos do Senado (legis.senado.leg.br), lista de legislação por tipo e ano, que traz o apelido e a ementa
# (a ementa termina com o apelido entre parênteses). As listas ficam em ~/EstudaMana/cache-senado-leis (fora do repositório);
# anos antigos são lidos uma vez só, o ano corrente e o anterior são relidos a cada 7 dias.
SENADO = "https://legis.senado.leg.br/dadosabertos/legislacao/lista?tipo={tipo}&ano={ano}"
CACHE_SENADO = RAIZ.parent / "cache-senado-leis"
TIPOS_SENADO = {"LEI": ("lei", 1946), "LCP": ("lc", 1970), "DEL": ("dl", 1937), "DEC": ("decreto", 1946)}
PALAVRAS_VAZIAS = {"lei", "leis", "da", "de", "do", "das", "dos", "e", "o", "a", "n", "no", "numero", "federal", "complementar", "decreto"}


def _lista_senado(tipo, ano, hoje_ano):

    arq = CACHE_SENADO / f"{tipo}-{ano}.json"
    recente = ano >= hoje_ano - 1
    if arq.exists() and not (recente and time.time() - arq.stat().st_mtime > 7 * 86400):
        return json.loads(arq.read_text(encoding="utf-8"))
    import subprocess
    j = None
    for _ in range(3):   # a conexão às vezes cai no meio da lista: tenta de novo
        r = subprocess.run(["curl", "-sL", "-m", "90", "-A", "EstudaMana/1.0", "-H", "Accept: application/json", SENADO.format(tipo=tipo, ano=ano)],
                           capture_output=True)
        try:
            j = json.loads(r.stdout.decode("utf-8"))
            break
        except ValueError:
            time.sleep(2)
    if j is None:
        raise OSError("o Senado não respondeu")
    docs = (j.get("ListaDocumento") or {}).get("documentos") or {}
    docs = docs.get("documento") or []
    lista = [{"numero": d.get("numero"), "normaNome": d.get("normaNome"), "apelido": d.get("apelido") or "", "ementa": d.get("ementa") or ""}
             for d in (docs if isinstance(docs, list) else [docs])]
    try:
        CACHE_SENADO.mkdir(parents=True, exist_ok=True)
        arq.write_text(json.dumps(lista, ensure_ascii=False), encoding="utf-8")
    except OSError:
        pass   # sem cache: só fica mais lento na próxima vez
    return lista


def _apelidos(d):
    """nomes populares da norma: o campo 'apelido' do Senado e o que vem entre parênteses no fim da ementa"""
    nomes = []
    for parte in d["apelido"].split(" , ")[1:]:
        nomes.append(re.sub(r"\s*\(\d{4}\)\s*$", "", parte).strip())
    m = re.search(r"\(([^()]*)\)\s*\.?\s*$", d["ementa"].strip())
    if m:
        nomes.append(m.group(1))
    return [n for n in nomes if n]


def por_nome(consulta):
    """(tipo, número, [ano]) de uma lei pelo apelido, ou None. Só aceita se todas as palavras do nome batem num apelido."""
    palavras = [w for w in re.findall(r"[a-z0-9]+", sem_acento(consulta)) if w not in PALAVRAS_VAZIAS]
    if not palavras:
        return None
    quer_decreto = "decreto" in sem_acento(consulta)
    quer_lc = "complementar" in sem_acento(consulta)
    hoje_ano = int(robo.hoje()[:4]) if isinstance(robo.hoje(), str) else robo.hoje().year
    tipos = [t for t in TIPOS_SENADO if t != "DEC" or quer_decreto]
    if quer_lc:
        tipos = ["LCP"]
    achados = []
    if not any(CACHE_SENADO.glob("*.json")) if CACHE_SENADO.exists() else True:
        print("    (1ª busca por nome: lendo as listas do Senado, ano a ano; demora alguns minutos e fica guardado)", flush=True)
    try:
        for ano in range(hoje_ano, 1936, -1):
            for t in tipos:
                if ano < TIPOS_SENADO[t][1]:
                    continue
                for d in _lista_senado(t, ano, hoje_ano):
                    for ap in _apelidos(d):
                        ws = set(re.findall(r"[a-z0-9]+", sem_acento(ap)))
                        if all(w in ws for w in palavras):
                            n = re.sub(r"\D", "", d["numero"] or "")
                            if n and (TIPOS_SENADO[t][0], n, str(ano)) not in [a[:3] for a in achados]:
                                achados.append((TIPOS_SENADO[t][0], n, str(ano), ap))
    except Exception as ex:   # noqa: BLE001 — sem conexão com o Senado: fica para a próxima rodada
        print(f"    (não consegui consultar o Senado pelo nome: {type(ex).__name__})")
        return None
    if len(achados) != 1:
        if achados:
            print("    nome ambíguo: " + "; ".join(f"{lc.NOMES[a[0]]} nº {lc.com_ponto(a[1])}/{a[2]} ({a[3]})" for a in achados[:4]) + " — informe o número")
        return None
    t, n, ano, ap = achados[0]
    print(f"    entendi pelo nome: {lc.NOMES[t]} nº {lc.com_ponto(n)}/{ano} ({ap})")
    return t, n, [ano]


def entender(consulta):
    """(tipo, número, [anos]) ou None."""
    consulta = SIGLAS.get(sem_acento(consulta), consulta)
    m = RE_PEDIDO.search(consulta or "")
    if not m:
        return por_nome(consulta)
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
    pend = [{"id": "teste", "consulta": a.teste}] if a.teste else [p for p in pedidos() if feitos.get(p["id"]) in (None,) or (feitos.get(p["id"]) in ("nao-entendi", "nao-achei") and pr.dentro_do_prazo(p.get("criado"), date.today()))]   # regra: o que não achou é procurado de novo a cada rodada, até 6 meses do pedido
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
