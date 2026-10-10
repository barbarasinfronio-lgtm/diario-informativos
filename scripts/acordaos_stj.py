"""
acordaos_stj.py — monta o grupo "Acórdãos STJ" do Diário das Decisões a
partir dos espelhos de acórdãos dos dados abertos do STJ
(dadosabertos.web.stj.jus.br: 10 conjuntos — Corte Especial, 3 seções e
6 turmas —, cada um com um ZIP histórico e um JSON por mês).

Duas etapas (o filtro pode ser ajustado sem baixar tudo de novo):

  1. coletar — baixa os arquivos novos para um cache FORA do repositório
               (~/EstudaMana/cache-stj-acordaos/<conjunto>/…, ~1 GB) e
               descompacta os ZIPs. Arquivo já baixado não é baixado de novo.
  2. montar  — lê o cache, tira o que não tem conteúdo de estudo e grava:
                 stj/acordaos/indice.json — lista leve (busca e cards)
                 stj/acordaos/c/NNN.json   — ementa e detalhes, 250 por
                                              arquivo, carregados só ao abrir o card

Uso:  python3 scripts/acordaos_stj.py coletar
      python3 scripts/acordaos_stj.py montar [--teste]
"""
import argparse, collections, glob, gzip, json, os, re, shutil, subprocess, sys, zipfile
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
CACHE = Path.home() / "EstudaMana" / "cache-stj-acordaos"
API = "https://dadosabertos.web.stj.jus.br/api/3/action/package_show?id=espelhos-de-acordaos-"
CONJUNTOS = ["corte-especial", "primeira-secao", "segunda-secao", "terceira-secao", "primeira-turma",
             "segunda-turma", "terceira-turma", "quarta-turma", "quinta-turma", "sexta-turma"]


def curl(url, destino, tentativas=4):
    for _ in range(tentativas):
        r = subprocess.run(["curl", "-sS", "-L", "--retry", "3", "-m", "900", "-A", "Mozilla/5.0", "-o", str(destino) + ".part", url],
                           capture_output=True, text=True)
        if r.returncode == 0:
            os.replace(str(destino) + ".part", destino)
            return True
        print("  (falhou, tentando de novo:", r.stderr.strip()[:120], ")")
    return False


def coletar():
    falhas = 0
    for n in CONJUNTOS:
        pasta = CACHE / n
        pasta.mkdir(parents=True, exist_ok=True)
        meta = pasta / "_pacote.json"
        if not curl(API + n, meta):
            falhas += 1
            continue
        for r in json.load(open(meta))["result"]["resources"]:
            if r["format"] not in ("JSON", "ZIP"):
                continue
            arq = pasta / r["name"]
            if arq.exists() and arq.stat().st_size == int(r.get("size") or arq.stat().st_size):
                continue
            print(f"{n}/{r['name']} ({int(r.get('size') or 0) // 10**6} MB)", flush=True)
            if not curl(r["url"], arq):
                falhas += 1
                continue
            if arq.suffix == ".zip":
                with zipfile.ZipFile(arq) as z:
                    z.extractall(pasta / ("zip-" + arq.stem))
    return falhas


# ---------------------------------------------------------------- filtro ----
# Os espelhos têm ~todos os acórdãos que o STJ publica; a maioria dos recursos
# (AgInt, AgRg, EDcl) só trata de admissibilidade. O site guarda o que ensina algo.
SEM_MERITO = re.compile(r"n[ãa]o conhecer|n[ãa]o conhec|prejudicad|homologar|homologa[çc]|extinguir|extin[çc]|negar seguimento|desist", re.I)
PROCESSUAL = re.compile(
    r"S[úu]mulas? (?:n[ºo.]*\s*)?(?:5|7|83|126|211|282|283|284|356|518|568|735)\b(?:/STJ|/STF)?"
    r"|reexame|revolvimento|prequestion|intempestiv|impugna[çc][ãa]o espec[ií]fica|(?:pr[óo]prios|mesmos) fundamentos"
    r"|n[ãa]o infirm|reitera[çc][ãa]o de argumentos|reiter(?:a|ou) (?:os )?argumentos|defici[êe]ncia (?:na )?fundamenta"
    r"|dissenso (?:pretoriano )?n[ãa]o demonstrado|diverg[êe]ncia (?:jurisprudencial )?n[ãa]o (?:foi )?(?:comprovada|demonstrada)"
    r"|erro grosseiro|fungibilidade|n[ãa]o cabimento|n[ãa]o cabe[a-z]* (?:recurso|agravo|embargos|habeas)"
    r"|aus[êe]ncia de (?:novos )?argumentos|multa do art\. 1\.021|sucedâneo|suced[âa]neo recursal|supress[ãa]o de inst[âa]ncia|ofensa (?:reflexa|constitucional)", re.I)
NEGADO = re.compile(r"neg(?:ar|ar-lhe) provimento|desprov|improced|denegar|rejeitar|n[ãa]o provido", re.I)
PRECEDENTE = re.compile(r"\bTema\s*(?:n[ºo.]*\s*)?\d|repetitiv|recurso representativo|\bIAC\b|assun[çc][ãa]o de compet[êe]ncia|\bIRDR\b|\bS[úu]mula\s*(?:n[ºo.]*\s*)?\d+|Corte Especial|\bSe[çc][ãa]o\b|art\. 1\.036", re.I)
RECURSO = re.compile(r"^(?:AgInt|AgRg|EDcl|EDv|AgR|AR\b)|^Ag[A-Z]|embargos", re.I)
PRINCIPAIS_CERTAS = re.compile(r"^(?:REsp|RMS|HC|RHC|MS|Rcl|EREsp|EAREsp|EAg|CC|SEC|IAC|IRDR|PUIL|CR|AR|AgInt no REsp|Pet|ProAfR|QO|RO|Inq|APn|SLS|SS)$")


def limpo(s):
    return re.sub(r"\s+", " ", (s or "").replace("_x000D_", " ")).strip()


def avaliar(d):
    """('incluir'|'excluir', motivo) — mesma lógica do STF (ver acordaos_stf.py)."""
    e, a = limpo(d.get("ementa")), limpo(d.get("decisao"))
    sig = d.get("siglaClasse") or ""
    tese = bool(limpo(d.get("teseJuridica"))) or bool(limpo(d.get("tema")))
    if len(e) < 120:
        return "excluir", "ementa curta"
    if SEM_MERITO.search(a) and not tese:
        return "excluir", "decisão sem mérito"
    if tese:
        return "incluir", "tese/repetitivo"
    if RECURSO.search(sig) and sig not in ("AR", "EREsp", "EAREsp", "EAg", "EDv"):
        if re.search(r"rejeitar|rejeit", a, re.I):
            return "excluir", "embargos rejeitados"
        n = len(PROCESSUAL.findall(e))
        if n >= 2 or (n == 1 and len(e) < 3500):
            return "excluir", "recurso só processual"
        if NEGADO.search(a) and not (len(e) >= 900 and PRECEDENTE.search(e)):
            return "excluir", "recurso negado sem precedente"
        return "incluir", "recurso com mérito"
    return "incluir", "julgamento original"


# ----------------------------------------------------------------- saída ----
KW = [('Direito Tributário', r'tribut|icms|imposto|execução fiscal|contribuiç'), ('Execução Penal', r'execução penal|remição|livramento condicional|progressão de regime|falta grave'),
      ('Direito Processual Penal', r'processual penal|prisão preventiva|habeas|júri|denúncia'), ('Direito Penal', r'penal|crime|tráfico|dosimetria|furto|roubo'),
      ('Direito Previdenciário', r'previdenci'), ('Direito do Consumidor', r'consumidor'), ('Direito Ambiental', r'ambiental'), ('Direito Administrativo', r'administrativ|servidor|improbidade|licitaç'),
      ('Direito Empresarial', r'empresarial|falência|recuperação judicial'), ('Direito Civil', r'civil|família|contrat'), ('Direito Processual Civil', r'.')]
ORG = {'CORTE ESPECIAL': 'Corte Especial', 'PRIMEIRA SEÇÃO': '1ª Seção', 'SEGUNDA SEÇÃO': '2ª Seção', 'TERCEIRA SEÇÃO': '3ª Seção', 'PRIMEIRA TURMA': '1ª Turma',
       'SEGUNDA TURMA': '2ª Turma', 'TERCEIRA TURMA': '3ª Turma', 'QUARTA TURMA': '4ª Turma', 'QUINTA TURMA': '5ª Turma', 'SEXTA TURMA': '6ª Turma'}


def para(s):
    s = (s or "").replace("_x000D_", "\r")
    ps = [re.sub(r"\s+", " ", p).strip() for p in re.split(r"\r", s)]
    return "\n".join(p for p in ps if p)


def cab(e):
    return re.split(r"\s(?=1\.\s)|\s(?=I\.\s+CASO)", e, 1)[0].split("\n")[0]


def titulo(h):
    t = re.sub(r"(^|\. )(\w)", lambda m: m[1] + m[2].upper(), h.rstrip(". ").lower())
    t = re.sub(r"\b(stj|stf|cpp|cp|cpc|cf|lep|ctn|cdc|eca|icms|iss|ipi|inss|sus|resp|aresp|hc|rhc)\b", lambda m: m[0].upper(), t)
    return t if len(t) <= 190 else t[:190].rsplit(" ", 1)[0] + "…"


def resultado(dec):
    dec = re.sub(r"\s+", " ", dec or "")
    m = re.search(r"(por (?:unanimidade|maioria)[^.]*?)(?:, nos termos|\. )", dec, re.I)
    return (m[1] if m else "")[:90]


def montar(teste=False, desde="2010"):
    itens, motivos, vistos, total = [], collections.Counter(), set(), 0
    for arq in sorted(CACHE.glob("*/*.json")) + sorted(CACHE.glob("*/zip-*/*.json")):
        if arq.name.startswith("_"):
            continue
        try:
            lista = json.load(open(arq, encoding="utf-8"))
        except ValueError:   # o portal publica meses "sem lançamentos" com JSON quebrado
            print(f"  (ignorado, JSON inválido: {arq.parent.name}/{arq.name})")
            continue
        for d in lista:
            if not d.get("id"):
                continue
            if d["id"] in vistos:
                continue
            vistos.add(d["id"])
            total += 1
            dd = str(d.get("dataDecisao") or "")
            if not re.match(r"\d{8}$", dd) or dd < desde:
                continue
            ver, motivo = avaliar(d)
            motivos[(ver, motivo)] += 1
            if ver != "incluir":
                continue
            e = para(d.get("ementa"))
            h = cab(e)
            itens.append(dict(id=str(d["id"]), proc=d["siglaClasse"] + " " + str(d["numeroProcesso"]),
                org=ORG.get(d["nomeOrgaoJulgador"], d["nomeOrgaoJulgador"].title()), rel=(d.get("ministroRelator") or "").title(),
                data=dd, area=next(v for v, rx in KW if re.search(rx, h.lower())), tit=titulo(h), res=resultado(d.get("decisao")),
                reg=d.get("numeroRegistro") or "", ementa=e, dec=para(d.get("decisao")), inf=para(d.get("informacoesComplementares")),
                notas=para(d.get("notas")), pub=re.sub(r"\s+", " ", d.get("dataPublicacao") or "")))
    print(f"{total} acórdãos no cache; {len(itens)} com conteúdo de estudo (desde {desde}):")
    for (ver, motivo), n in motivos.most_common():
        print(f"  {n:7d}  {ver:8s} {motivo}")
    print("  por década:", sorted(collections.Counter(i["data"][:3] + "0" for i in itens).items()))
    if teste:
        return itens
    itens.sort(key=lambda i: (i["data"], i["id"]), reverse=True)
    base = RAIZ / "stj" / "acordaos"
    shutil.rmtree(base, ignore_errors=True)
    (base / "c").mkdir(parents=True)
    N, indice = 250, []
    for k in range(0, len(itens), N):
        ch, det = k // N, {}
        for i in itens[k:k + N]:
            indice.append([i["id"], i["proc"], i["org"], i["rel"], i["data"], i["area"], i["tit"], i["res"], i["reg"], ch])
            det[i["id"]] = {"ementa": i["ementa"], "dec": i["dec"], "inf": i["inf"], "notas": i["notas"], "pub": i["pub"]}
        with open(base / "c" / f"{ch:03d}.json", "w", encoding="utf-8") as f:
            json.dump(det, f, ensure_ascii=False, separators=(",", ":"))
    with open(base / "indice.json", "w", encoding="utf-8") as f:
        json.dump({"fonte": "STJ — dados abertos, espelhos de acórdãos",
                   "campos": ["id", "processo", "orgao", "relator", "data", "area", "titulo", "resultado", "registro", "parte"],
                   "itens": indice}, f, ensure_ascii=False, separators=(",", ":"))
    print("gravado em stj/acordaos/")


def main():
    p = argparse.ArgumentParser()
    p.add_argument("passo", choices=["coletar", "montar"])
    p.add_argument("--teste", action="store_true")
    p.add_argument("--desde", default="2010", help="data mínima do julgamento, AAAA ou AAAAMMDD")
    a = p.parse_args()
    if a.passo == "coletar":
        sys.exit(1 if coletar() else 0)
    montar(a.teste, a.desde)


if __name__ == "__main__":
    main()
