#!/usr/bin/env python3
"""
acordaos_tst.py — acórdãos do TST COM EFEITO VINCULANTE para o Diário das
Decisões: os precedentes qualificados do art. 927 do CPC e os incidentes que
firmam entendimento para os demais órgãos.

  Classes coletadas (CLASSES): IRR / Incidente de Julgamento de Recurso de
  Revista e de Embargos Repetitivos, IAC (assunção de competência), IRDR,
  IUJ (uniformização de jurisprudência) e Arguição de Inconstitucionalidade.
  Qualquer órgão, qualquer ano. Turmas, SDIs e SDC comuns ficam de fora: seus
  acórdãos não obrigam outros órgãos. (Súmulas, OJs e PNs do TST já estão em
  tst/decisoes.json.)

Fonte: a API da pesquisa de jurisprudência do TST (jurisprudencia.tst.jus.br,
sem captcha). Cada acórdão vem com o inteiro teor em HTML (~100 KB), então o
robô é educado: uma consulta por vez, pausa entre elas e, se o servidor
recusar (403/429/5xx), espera cada vez mais e PARA a rodada (uma rajada de
consultas já levou um 403 em 10/10/2026). Roda no Mac. São ~150 acórdãos:
poucas consultas.

    python3 scripts/acordaos_tst.py coletar     # baixa (cache fora do repositório: ~/EstudaMana/cache-tst-acordaos/)
    python3 scripts/acordaos_tst.py montar      # sem internet; grava tst/acordaos/
"""
import argparse, collections, gzip, http.client, json, random, re, shutil, sys, time, urllib.error, urllib.request
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
CACHE = Path.home() / "EstudaMana" / "cache-tst-acordaos"
BASE = "https://jurisprudencia-backend.tst.jus.br/rest"
PAUSA = 2.5          # segundos entre consultas
POR_VEZ = 5          # acórdãos por consulta (os incidentes vêm com inteiro teor longo: respostas de vários MB)
CLASSES = ["IRR", "IncJulgRREmbRep", "IAC", "IRDR", "IUJ", "ArgInc", "ArgIncCiv", "IIN", "IINC", "IC", "DINROAR"]
GUARDAR = ["id", "numero", "numFormatado", "codFase", "orgaoJudicante", "dtaJulgamento", "dtaPublicacao", "nomRelatorSemTratamento",
           "ementa", "dispositivo", "anoProcInt", "numProcInt", "numInterno", "txtTemaProc"]


class Bloqueio(Exception):
    pass


_ultimo = [0.0]


def _requisitar(url, corpo=None, tentativas=5):
    """GET/POST educado. Levanta Bloqueio se o servidor recusar sempre."""
    espera = 30
    for _ in range(tentativas):
        folga = PAUSA + random.random() - (time.time() - _ultimo[0])
        if folga > 0:
            time.sleep(folga)
        try:
            req = urllib.request.Request(url, corpo, {"Content-Type": "application/json", "User-Agent": "Mozilla/5.0"})
            with urllib.request.urlopen(req, timeout=240) as r:
                dados = json.loads(r.read().decode("utf-8"))
            _ultimo[0] = time.time()
            return dados
        except urllib.error.HTTPError as e:
            _ultimo[0] = time.time()
            if e.code in (400, 404):
                raise RuntimeError(f"consulta recusada ({e.code}): {e.read()[:200]!r}")
            print(f"  (servidor respondeu {e.code}; esperando {espera}s)", flush=True)
        except (OSError, ValueError, http.client.HTTPException) as e:   # timeout de leitura, queda de conexão, resposta cortada
            _ultimo[0] = time.time()
            print(f"  (falha de rede: {str(e)[:80]}; esperando {espera}s)", flush=True)
        time.sleep(espera)
        espera *= 2
    raise Bloqueio("o TST recusou as consultas seguidas; parei. Rode de novo mais tarde.")


def coletar():
    CACHE.mkdir(parents=True, exist_ok=True)
    todas = {c["codFase"]: c for c in _requisitar(BASE + "/classes-processuais")}
    achados, vistos = [], set()
    for cod in CLASSES:
        if cod not in todas:
            continue
        pag, total, n = 0, None, 0
        while True:
            corpo = json.dumps({"ou": "", "e": "", "termoExato": "", "naoContem": "", "ementa": "", "dispositivo": "",
                                "orgaosJudicantes": [], "ministros": [], "convocados": [], "classesProcessuais": [todas[cod]],
                                "indicadores": [], "assuntos": [], "tipos": ["ACORDAO"], "orgao": "", "publicacaoInicial": "",
                                "publicacaoFinal": "", "julgamentoInicial": "", "julgamentoFinal": "", "ordenacao": "data"}).encode()
            j = _requisitar(f"{BASE}/pesquisa-textual/{pag * POR_VEZ + 1}/{POR_VEZ}?a={random.random()}", corpo)
            total = j["totalRegistros"] if total is None else total
            lote = [x["registro"] for x in j["registros"]]
            for r in lote:
                if r["id"] not in vistos:
                    vistos.add(r["id"])
                    achados.append({k: r.get(k) for k in GUARDAR})
            n += len(lote)
            pag += 1
            if not lote or n >= total:
                break
        print(f"{cod}: {n} acórdãos", flush=True)
    with gzip.open(CACHE / "vinculantes.json.gz", "wt", encoding="utf-8") as f:
        json.dump(achados, f, ensure_ascii=False, separators=(",", ":"))
    print(f"{len(achados)} acórdãos com efeito vinculante guardados")


# ---------------------------------------------------------------- filtro ----
# "não conhecer / prejudicado" só vale no COMEÇO do dispositivo (o texto todo traz a tese e cita essas palavras à toa)
SEM_MERITO = re.compile(r"^(?:.{0,90}?)(?:n[ãa]o conhecer|julgar prejudicad[oa] o (?:incidente|recurso)|julgar extint|homologar)", re.I)
# a proposta de afetação só leva o tema ao rito repetitivo: ainda não há tese, então não vincula ninguém
AFETACAO = re.compile(r"propos?ta de afeta[çc][ãa]o|afeta[çc][ãa]o do recurso de revista", re.I)


def limpo(s):
    return re.sub(r"\s+", " ", s or "").strip()


def disp(s):
    """Dispositivo sem a data/assinatura do fim ("Brasília, 6 de outubro de 2026. FULANO...")."""
    return limpo(re.split(r"\s*Bras[íi]lia,\s*\d", s or "", 1)[0]).lstrip(", ")


def avaliar(d):
    """('incluir'|'excluir', motivo). Só entram os incidentes que firmam entendimento vinculante;
    fora as propostas de afetação (ainda sem tese) e os incidentes não conhecidos ou prejudicados."""
    if len(limpo(d.get("ementa"))) < 120:
        return "excluir", "ementa curta"
    if AFETACAO.search(limpo(d.get("ementa"))[:140]):
        return "excluir", "proposta de afetação (ainda sem tese)"
    if SEM_MERITO.search(disp(d.get("dispositivo"))[:220]):
        return "excluir", "incidente não conhecido / sem mérito"
    return "incluir", "efeito vinculante"


ORGAO_CURTO = {"Tribunal Pleno": "Pleno", "Órgão Especial": "Órgão Especial", "Seção Especializada em Dissídios Coletivos": "SDC",
               "Seção Especializada em Dissídios Individuais": "SDI Plena", "Subseção I Especializada em Dissídios Individuais": "SDI-1",
               "Subseção II Especializada em Dissídios Individuais": "SDI-2"}


# ----------------------------------------------------------------- saída ----
def cabecalho(e):
    h = limpo(e)
    h = re.split(r"\s(?=1\.\s)|\s(?=I\s*[-–.]\s+[A-ZÇÃ])", h, 1)[0].rstrip(". ")
    if sum(c.isupper() for c in h) > 0.6 * max(1, sum(c.isalpha() for c in h)):
        h = re.sub(r"(^|[.:] )(\w)", lambda m: m.group(1) + m.group(2).upper(), h.lower())
        h = re.sub(r"\b(tst|stf|stj|clt|cpc|cf|cf/88|sdi|sdc|oj|rr|airr|inss|fgts|adc|adi|adpf|pis|cipa|dsr|pdv|ctps)\b", lambda m: m[0].upper(), h)
    return h if len(h) <= 190 else h[:190].rsplit(" ", 1)[0] + "…"


def area_de(h, sig):
    t = h.lower()
    if sig in ("DC", "DCG", "ROT", "RODC", "AACC", "ES") or re.search(r"coletiv|sindic|greve|conven[çc][ãa]o coletiva|acordo coletivo|dissídio coletivo|dissidio coletivo", t):
        return "Direito Coletivo do Trabalho"
    if re.search(r"processual|nulidade|preclus|compet[êe]ncia|execu[çc][ãa]o|rescis[óo]ria|embargos|recurso|prescri[çc][ãa]o|honor[áa]rios advocat|cita[çc][ãa]o|penhora|gratuidade", t):
        return "Direito Processual do Trabalho"
    return "Direito do Trabalho"


def resultado(a):
    m = re.search(r"((?:por (?:unanimidade|maioria)[^,]*, )?(?:conhecer|dar|negar|prover|acolher|julgar|conceder|denegar)[^.;]*)", a, re.I)
    return (m[1] if m else "")[:90]


def data_br(iso):
    return f"{iso[8:10]}/{iso[5:7]}/{iso[:4]}" if iso else ""


def montar(teste=False):
    itens, motivos, total = [], collections.Counter(), 0
    arq = CACHE / "vinculantes.json.gz"
    if not arq.exists():
        sys.exit("Sem cache: rode antes  python3 scripts/acordaos_tst.py coletar")
    if True:
        for d in json.load(gzip.open(arq, "rt", encoding="utf-8")):
            total += 1
            dj = (d.get("dtaJulgamento") or "")[:10]
            if not dj:
                continue
            sigla = (d.get("orgaoJudicante") or {}).get("descricao") or ""
            ver, motivo = avaliar(d)
            motivos[(ver, motivo)] += 1
            if ver != "incluir":
                continue
            h = cabecalho(d["ementa"])
            a = disp(d.get("dispositivo"))
            pub = (d.get("dtaPublicacao") or "")[:10]
            url = ("https://consultadocumento.tst.jus.br/consultaDocumento/acordao.do?anoProcInt=%s&numProcInt=%s&dtaPublicacaoStr=%s%%2007:00:00&nia=%s"
                   % (d.get("anoProcInt"), d.get("numProcInt"), data_br(pub), d.get("numInterno"))) if pub else ""
            itens.append(dict(id=d["id"], proc=f"{d['codFase']} {d['numFormatado'].split(' - ', 1)[-1]}" if d.get("numFormatado") else d["codFase"],
                org=ORGAO_CURTO.get(sigla, sigla), rel=(d.get("nomRelatorSemTratamento") or "").title(), data=dj.replace("-", ""),
                area=area_de(h, d["codFase"]), tit=h, res=resultado(a), ementa=limpo(d["ementa"]), dispo=a, pub=pub.replace("-", ""),
                tema=limpo(d.get("txtTemaProc")), url=url))
    print(f"{total} acórdãos no cache; {len(itens)} com efeito vinculante:")
    for (ver, motivo), n in motivos.most_common():
        print(f"  {n:7d}  {ver:8s} {motivo}")
    print("  por órgão:", collections.Counter(i["org"] for i in itens).most_common(), " por ano:", sorted(collections.Counter(i["data"][:4] for i in itens).items()))
    if teste:
        return itens
    itens.sort(key=lambda i: (i["data"], i["id"]), reverse=True)
    base = RAIZ / "tst" / "acordaos"
    shutil.rmtree(base, ignore_errors=True)
    (base / "c").mkdir(parents=True)
    N, indice = 250, []
    for k in range(0, len(itens), N):
        ch, det = k // N, {}
        for i in itens[k:k + N]:
            indice.append([i["id"], i["proc"], i["org"], i["rel"], i["data"], i["area"], i["tit"], i["res"], ch])
            det[i["id"]] = {"ementa": i["ementa"], "dispo": i["dispo"], "pub": i["pub"], "url": i["url"]}
        with open(base / "c" / f"{ch:03d}.json", "w", encoding="utf-8") as f:
            json.dump(det, f, ensure_ascii=False, separators=(",", ":"))
    with open(base / "indice.json", "w", encoding="utf-8") as f:
        json.dump({"fonte": "TST — pesquisa de jurisprudência (acórdãos com efeito vinculante: IRR, IAC, IRDR, IUJ, arguição de inconstitucionalidade)",
                   "campos": ["id", "processo", "orgao", "relator", "data", "area", "titulo", "resultado", "parte"],
                   "itens": indice}, f, ensure_ascii=False, separators=(",", ":"))
    print("gravado em tst/acordaos/")


def main():
    p = argparse.ArgumentParser()
    p.add_argument("passo", choices=["coletar", "montar"])
    p.add_argument("--de"), p.add_argument("--ate"), p.add_argument("--orgaos")   # aceitos e ignorados (compatibilidade com os atalhos antigos)
    p.add_argument("--teste", action="store_true")
    a = p.parse_args()
    if a.passo == "coletar":
        try:
            coletar()
        except Bloqueio as e:
            print("PARADO:", e)
            sys.exit(1)
        return
    montar(a.teste)


if __name__ == "__main__":
    main()
