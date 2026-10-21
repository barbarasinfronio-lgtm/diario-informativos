#!/usr/bin/env python3
"""
leis_novas.py — avisa quando uma lei federal de CARÁTER GERAL é publicada.

Lê a lista de leis ordinárias e complementares do ano na API aberta do Senado
(legis.senado.leg.br/dadosabertos; o Planalto bloqueia robôs na página de listagem e a API não bloqueia, então
isto roda também no GitHub Actions), separa as de caráter geral das de efeito concreto (denominações, títulos de
"Capital Nacional", datas comemorativas, créditos orçamentários, criação de cargos, pensões etc.) e grava as gerais em
leis/novas.json. O site mostra essa lista em Meus Estudos > Novidades legislativas, com o botão "Pedir para
incluir", que cria um pedido (Firestore pedidos-leis) atendido por scripts/leis_sob_pedido.py.

A API do Senado costuma atrasar alguns dias em relação ao Planalto. No Mac, "--sondar" confere no próprio Planalto os
números seguintes ao último conhecido (as páginas individuais abrem; só a listagem é bloqueada).

    python3 scripts/leis_novas.py              # atualiza leis/novas.json
    python3 scripts/leis_novas.py --sondar     # + procura no Planalto leis mais novas que a lista do Senado
    python3 scripts/leis_novas.py --teste      # mostra o que entraria, sem gravar
"""
import argparse, html as html_, json, re, sys, time, urllib.request
from datetime import datetime, timedelta, timezone
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
SAIDA = RAIZ / "leis" / "novas.json"
API = "https://legis.senado.leg.br/dadosabertos/legislacao/lista?tipo={tipo}&ano={ano}"
DIAS = 120                      # quanto tempo uma lei nova fica na lista
UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 Safari/605.1.15"

# Ementas de efeito concreto: não são "lei de caráter geral" e não entram no alerta.
ESPECIFICA = re.compile(r"""(?ix)^\s*(
    denomina | d[áa]\s+(o\s+)?nome | confere\s+(a\s+\S+\s+)?o\s+t[íi]tulo | inscreve | altera\s+a\s+denomina[çc][ãa]o
  | institui\s+(o|a)\s+(dia|semana|m[êe]s|campanha|jornada)\b | institui\s+o\s+dia | declara\b
  | abre\s+(ao\s+or[çc]amento|cr[ée]dito) | estima\s+a\s+receita | fixa\s+os\s+subs[íi]dios
  | autoriza\s+(a\s+)?(doa[çc][ãa]o|cess[ãa]o|aliena[çc][ãa]o|a\s+uni[ãa]o\s+a\s+doar)
  | concede\s+(pens[ãa]o|anistia|aposentadoria|medalha) | reconhece\s+como\b | homenageia
  | cria\s+(\d+\s+)?(cargos?|fun[çc][õo]es|varas?|a\s+universidade|o\s+instituto|a\s+comarca|o\s+munic[íi]pio)
  | transforma\s+(os\s+|as\s+|a\s+|o\s+)?(centros?|cargos?|escolas?|universidade|instituto|fun[çc][õo]es)
  | extingue\s+(a|o)\s+(floresta|reserva|[áa]rea|parque|esta[çc][ãa]o)
  | altera\s+os\s+limites | desafeta | cria\s+a\s+(floresta|reserva|[áa]rea)\s
  | inclui\s+.*\s+no\s+(livro|plano\s+nacional\s+de\s+viação)
)""")


def ementa_especifica(ementa):
    e = (ementa or "").strip()
    if ESPECIFICA.search(e):
        return True
    # "Dispõe sobre a denominação…", "Altera a Lei X para denominar…"
    return bool(re.search(r"(?i)\b(denomina[çc][ãa]o|denominar|d[áa] o nome|t[íi]tulo de capital nacional)\b", e[:200]))


def dd(s):                                                  # "29/09/2026" -> "2026-09-29"
    m = re.match(r"(\d\d)/(\d\d)/(\d{4})", s or "")
    return f"{m.group(3)}-{m.group(2)}-{m.group(1)}" if m else ""


def hoje():
    return (datetime.now(timezone.utc) - timedelta(hours=3)).strftime("%Y-%m-%d")


def planalto(tipo, n, ano):
    if tipo == "LC":
        return f"https://www.planalto.gov.br/ccivil_03/leis/lcp/lcp{n}.htm"
    return f"https://www.planalto.gov.br/ccivil_03/_ato2023-2026/{ano}/lei/l{n}.htm" if ano >= 2023 else \
        f"https://www.planalto.gov.br/ccivil_03/leis/l{n}.htm"


def api(tipo, ano):
    req = urllib.request.Request(API.format(tipo=tipo, ano=ano), headers={"Accept": "application/json", "User-Agent": UA})
    for t in (1, 2, 3):
        try:
            with urllib.request.urlopen(req, timeout=90) as r:
                j = json.loads(r.read().decode("utf-8"))
            docs = (j.get("ListaDocumento", {}).get("documentos") or {}).get("documento") or []
            return docs if isinstance(docs, list) else [docs]
        except Exception as e:  # noqa: BLE001
            print(f"  API do Senado ({tipo} {ano}) tentativa {t}: {type(e).__name__}", file=sys.stderr)
            time.sleep(3 * t)
    return None


def sondar(achados, tipo, ano, ate=25):
    """Procura no Planalto leis mais novas que a última da lista do Senado (só no Mac)."""
    import ssl
    nums = [x["n"] for x in achados if x["tipo"] == tipo and x["ano"] == ano]
    if not nums:
        return []
    novos, falhas = [], 0
    ctx = ssl.create_default_context()
    for n in range(max(nums) + 1, max(nums) + 1 + ate):
        url = planalto(tipo, n, ano)
        try:
            with urllib.request.urlopen(urllib.request.Request(url, headers={"User-Agent": UA}), timeout=40, context=ctx) as r:
                bruto = r.read()
            try:
                html = bruto.decode("utf-8")
            except UnicodeDecodeError:
                html = bruto.decode("cp1252", "replace")
        except Exception:  # noqa: BLE001
            falhas += 1
            if falhas >= 3:
                break
            continue
        falhas = 0
        t = re.sub(r"(?s)<(script|style).*?</\1>", "", html)
        t = re.sub(r"(?s)<!--.*?-->", "", t)
        t = html_.unescape(re.sub(r"<[^>]+>", " ", t))
        t = re.sub(r"\s+", " ", t.replace("\xa0", " ")).strip()
        cab = re.search(r"(?i)(LEI(?: COMPLEMENTAR)? N[ºO°.]*\s*[\d.]+,? DE (\d{1,2})[ºO°]? DE (\w+) DE (\d{4}))\.?\s*(.{20,600}?)(?:\s+O PRESIDENTE|\s+Faço saber|\s+O CONGRESSO)", t)
        if not cab or int(cab.group(4)) != ano:
            continue
        mes = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"]
        try:
            data = f"{ano}-{mes.index(cab.group(3).lower()) + 1:02d}-{int(cab.group(2)):02d}"
        except ValueError:
            data = ""
        ementa = re.sub(r"\s+", " ", cab.group(5)).strip()
        rotulo = re.compile(r"(?i)^(Mensagem de veto|Vig[êe]ncia|Regulamento|Produ[çc][ãa]o de efeitos|Texto compilado|Revoga[çc][ãa]o|Convers[ãa]o da[^.]*\.|Vide[^.]*\.)\s*")
        while rotulo.search(ementa):
            ementa = rotulo.sub("", ementa)
        novos.append({"tipo": tipo, "n": n, "ano": ano, "data": data, "ementa": ementa})
        print(f"  sondagem: {tipo} {n}/{ano} achada no Planalto")
    return novos


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--sondar", action="store_true")
    ap.add_argument("--teste", action="store_true")
    a = ap.parse_args()
    ano = int(hoje()[:4])
    achados = []
    for tipo, tp in (("LEI", "LEI"), ("LC", "LCP")):
        for y in sorted({ano, ano - 1} if hoje()[5:7] <= "02" else {ano}):
            docs = api(tp, y)
            if docs is None:
                print(f"ERRO: não consegui ler a lista do Senado ({tp} {y}); nada foi alterado.")
                return 1
            for d in docs:
                try:
                    achados.append({"tipo": tipo, "n": int(d["numero"]), "ano": int(d.get("anoassinatura") or y), "data": dd(d.get("dataassinatura")),
                                    "ementa": (d.get("ementa") or "").strip(), "senado": d.get("id")})
                except (KeyError, ValueError):
                    continue
    if a.sondar:
        for tipo in ("LEI", "LC"):
            achados += sondar(achados, tipo, ano)
    # já no acervo?
    import_ids = set()
    try:
        sys.path.insert(0, str(RAIZ / "scripts"))
        import atualizar_informativos as robo
        idx = json.load(open(RAIZ / "leis/texto/indice.json", encoding="utf-8"))
        import_ids = set(idx)
        ped = json.load(open(RAIZ / "leis/pedidas.json", encoding="utf-8")).get("leis", [])
        import_ids |= {robo.id_texto(l["link"]) for l in ped if l.get("link")}
        id_texto = robo.id_texto
    except Exception:  # noqa: BLE001
        id_texto = lambda u: ""  # noqa: E731
    limite = (datetime.strptime(hoje(), "%Y-%m-%d") - timedelta(days=DIAS)).strftime("%Y-%m-%d")
    antigas = {}
    if SAIDA.exists():
        antigas = {l["chave"]: l for l in json.load(open(SAIDA, encoding="utf-8")).get("leis", [])}
    leis, ignoradas, vistas = [], 0, set()
    for x in sorted(achados, key=lambda x: (x["data"], x["n"]), reverse=True):
        chave = f"{x['tipo'].lower()}-{x['n']}-{x['ano']}"
        if chave in vistas or not x["data"] or x["data"] < limite:
            continue
        vistas.add(chave)
        if x["tipo"] == "LEI" and ementa_especifica(x["ementa"]):
            ignoradas += 1
            continue
        link = planalto(x["tipo"], x["n"], x["ano"])
        numero = f"{'Lei Complementar' if x['tipo'] == 'LC' else 'Lei'} nº {x['n']:,}".replace(",", ".") + f"/{x['ano']}"
        nova = {"chave": chave, "tipo": x["tipo"], "numero": numero, "pedido": numero.replace("nº ", ""), "data": x["data"],
                "ementa": x["ementa"], "link": link, "noAcervo": id_texto(link) in import_ids,
                "visto": (antigas.get(chave) or {}).get("visto") or hoje()}
        leis.append(nova)
    # o que a sondagem achou no Planalto e a lista do Senado ainda não tem (ela atrasa) não pode sumir na rodada seguinte
    for chave, l in antigas.items():
        if chave not in vistas and l.get("data", "") >= limite:
            leis.append(l)
    leis.sort(key=lambda l: (l["data"], l["chave"]), reverse=True)
    saida = {"atualizado": hoje(), "fonte": "API de dados abertos do Senado Federal (+ Planalto, quando sondado)", "ignoradas": ignoradas, "leis": leis}
    print(f"{len(leis)} lei(s) de caráter geral nos últimos {DIAS} dias ({ignoradas} de efeito concreto ignoradas); "
          f"{sum(1 for l in leis if not l['noAcervo'])} ainda fora do acervo.")
    for l in leis[:12]:
        print(f"  {l['data']}  {l['numero']:<32} {'[no acervo]' if l['noAcervo'] else '':<12} {l['ementa'][:80]}")
    if a.teste:
        return 0
    if SAIDA.exists() and json.load(open(SAIDA, encoding="utf-8")).get("leis") == leis:
        print("Sem novidades; arquivo mantido.")
        return 0
    SAIDA.write_text(json.dumps(saida, ensure_ascii=False, indent=1), encoding="utf-8")
    return 0


if __name__ == "__main__":
    sys.exit(main())
