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
      python3 scripts/acordaos_stj.py mesclar --pasta "<pasta com os espelhos baixados à mão>"   (acrescenta, sem apagar nada)
      python3 scripts/acordaos_stj.py montar [--teste]
"""
import argparse, collections, glob, gzip, json, os, re, shutil, subprocess, sys, zipfile
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import indice_fatiado  # noqa: E402  (stj/acordaos/indice.json em fatias: ver scripts/indice_fatiado.py)

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
            nome = (r.get("name") or "").strip() or r["url"].rsplit("/", 1)[-1]   # o portal às vezes publica recurso sem nome
            arq = pasta / nome
            if arq.exists() and arq.stat().st_size == int(r.get("size") or arq.stat().st_size):
                continue
            print(f"{n}/{nome} ({int(r.get('size') or 0) // 10**6} MB)", flush=True)
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


# O que NÃO decide nada: o recurso morre na admissibilidade. Vale para QUALQUER classe (REsp também),
# lido no cabeçalho da ementa (os primeiros 400 caracteres, onde o STJ lista os fundamentos).
INADMISSIBILIDADE = re.compile(
    r"n[ãa]o conhec|n[ãa]o-conhec|intempestiv|extempor[âa]ne|inadmiss|\bdeserto|dese[r]?[çc][ãa]o|pressupostos? (?:recursais|de admissibilidade)"
    r"|prequestion|S[úu]mulas? (?:n[ºo.]*\s*)?(?:5|7|83|126|211|282|283|284|356|518|568|735)\b"
    r"|reexame (?:f[áa]tico|de provas|f[áa]tico-probat)|revolvimento|impugna[çc][ãa]o espec[ií]fica|defici[êe]ncia (?:na )?fundamenta"
    r"|dissenso (?:pretoriano )?n[ãa]o|diverg[êe]ncia (?:jurisprudencial )?n[ãa]o|[óo]bice|falta de interesse recursal|perda (?:do )?objeto|prejudicad"
    r"|ilegitimidade recursal|aus[êe]ncia de (?:novos )?argumentos|reitera[çc][ãa]o de argumentos|pr[óo]prios fundamentos|erro grosseiro|fungibilidade", re.I)


def avaliar(d):
    """('incluir'|'excluir', motivo) — mesma lógica do STF (ver acordaos_stf.py), mais rígida: sem conteúdo decisório
    (não conhecido, intempestivo, deserto, Súmula 7/83/211/282/284 como fundamento etc.) não entra."""
    e, a = limpo(d.get("ementa")), limpo(d.get("decisao"))
    sig = d.get("siglaClasse") or ""
    tese = bool(limpo(d.get("teseJuridica"))) or bool(limpo(d.get("tema")))
    if len(e) < 120:
        return "excluir", "ementa curta"
    if sig.startswith("ProAfR"):
        return "excluir", "proposta de afetação (ainda sem tese)"
    if SEM_MERITO.search(a) and not tese:
        return "excluir", "decisão sem mérito"
    if tese:
        return "incluir", "tese/repetitivo"
    if INADMISSIBILIDADE.search(e[:400]):
        return "excluir", "resolvido por inadmissibilidade"
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


def gravar(itens):
    """Reescreve TUDO (use só com --refazer: reorganiza partes e fatias, e o git vê todos os arquivos alterados)."""
    itens.sort(key=lambda i: (i["data"], i["id"]), reverse=True)
    base = RAIZ / "stj" / "acordaos"
    shutil.rmtree(base, ignore_errors=True)
    (base / "c").mkdir(parents=True)
    N, indice = 250, []
    for k in range(0, len(itens), N):
        ch, det = k // N, {}
        for i in itens[k:k + N]:
            indice.append(linha_do_indice(i, ch))
            det[i["id"]] = detalhe_de(i)
        with open(base / "c" / f"{ch:03d}.json", "w", encoding="utf-8") as f:
            json.dump(det, f, ensure_ascii=False, separators=(",", ":"))
    indice_fatiado.gravar(str(base / "indice.json"), {"fonte": FONTE, "campos": CAMPOS, "itens": indice})
    print(f"gravado em stj/acordaos/ ({len(itens)} acórdãos)")


FONTE = "STJ — dados abertos, espelhos de acórdãos"
CAMPOS = ["id", "processo", "orgao", "relator", "data", "area", "titulo", "resultado", "registro", "parte"]


def linha_do_indice(i, parte):
    return [i["id"], i["proc"], i["org"], i["rel"], i["data"], i["area"], i["tit"], i["res"], i["reg"], parte]


def detalhe_de(i):
    return {"ementa": i["ementa"], "dec": i["dec"], "inf": i["inf"], "notas": i["notas"], "pub": i["pub"]}


def acrescentar(novos):
    """Acrescenta acórdãos NOVOS sem mexer no que já existe: partes novas (c/NNN.json depois da última) e linhas no fim
    do índice. É o que as atualizações de rotina usam: o git só vê arquivos novos e a última fatia do índice."""
    base = RAIZ / "stj" / "acordaos"
    man = base / "indice.json"
    if not man.exists():
        return gravar(list(novos))
    ind = indice_fatiado.ler(str(man))["itens"]
    ids = {r[0] for r in ind}
    novos = sorted((i for i in novos if i["id"] not in ids), key=lambda i: (i["data"], i["id"]), reverse=True)
    if not novos:
        print("nada novo para gravar.")
        return
    prox = max(r[9] for r in ind) + 1
    linhas, N = [], 250
    for k in range(0, len(novos), N):
        ch, det = prox + k // N, {}
        for i in novos[k:k + N]:
            linhas.append(linha_do_indice(i, ch))
            det[i["id"]] = detalhe_de(i)
        with open(base / "c" / f"{ch:03d}.json", "w", encoding="utf-8") as f:
            json.dump(det, f, ensure_ascii=False, separators=(",", ":"))
    indice_fatiado.acrescentar(str(man), linhas)
    print(f"acrescentados {len(novos)} acórdãos novos (partes {prox}–{prox + (len(novos) - 1) // N}); o resto ficou como estava.")


def podar(teste=False, desde="2010"):
    """Tira do que já está em stj/acordaos o que o filtro ATUAL reprova, sem reorganizar nada: as fatias e as partes
    ficam como estão, só perdem as linhas/acórdãos removidos (o git guarda só a diferença). O que não está no cache
    (ex.: arquivos baixados à mão) nunca é removido."""
    base = RAIZ / "stj" / "acordaos"
    reprovados, motivos = set(), collections.Counter()
    for arq in sorted(CACHE.glob("*/*.json")) + sorted(CACHE.glob("*/zip-*/*.json")):
        if arq.name.startswith("_"):
            continue
        try:
            lista = json.load(open(arq, encoding="utf-8"))
        except ValueError:
            continue
        for d in lista:
            if d.get("id") and avaliar(d)[0] == "excluir":
                reprovados.add(str(d["id"]))
    man = json.load(open(base / "indice.json", encoding="utf-8"))
    removidos, antes = 0, man.get("total", 0)
    for a in man["arquivos"]:
        caminho = base / a
        itens = json.load(open(caminho, encoding="utf-8"))["itens"]
        ficam = [r for r in itens if r[0] not in reprovados]
        removidos += len(itens) - len(ficam)
        if len(ficam) != len(itens) and not teste:
            with open(caminho, "w", encoding="utf-8") as f:
                json.dump({"itens": ficam}, f, ensure_ascii=False, separators=(",", ":"))
    apagados = 0
    for caminho in sorted((base / "c").glob("*.json")):
        det = json.load(open(caminho, encoding="utf-8"))
        ficam = {k: v for k, v in det.items() if k not in reprovados}
        if len(ficam) == len(det) or teste:
            continue
        apagados += len(det) - len(ficam)
        if ficam:
            with open(caminho, "w", encoding="utf-8") as f:
                json.dump(ficam, f, ensure_ascii=False, separators=(",", ":"))
        else:
            caminho.unlink()
    if not teste:
        man["total"] = antes - removidos
        with open(base / "indice.json", "w", encoding="utf-8") as f:
            json.dump(man, f, ensure_ascii=False, separators=(",", ":"))
    print(f"{'(teste) ' if teste else ''}removidos {removidos} acórdãos do índice (antes {antes}, depois {antes - removidos}); {apagados} dos arquivos de ementa.")


def montar(teste=False, desde="2010", refazer=False):
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
    if refazer:
        gravar(itens)
    else:
        acrescentar(itens)


def listas_da_pasta(pasta):
    """Cada JSON de espelhos (lista de acórdãos) da pasta e subpastas; ZIPs são abertos na memória."""
    for raiz, dirs, arqs in os.walk(os.path.expanduser(pasta)):
        dirs[:] = [d for d in dirs if d != "node_modules"]
        for a in sorted(arqs):
            caminho = os.path.join(raiz, a)
            try:
                if a.lower().endswith(".json") and not a.startswith("_"):
                    yield a, json.load(open(caminho, encoding="utf-8"))
                elif a.lower().endswith(".zip"):
                    with zipfile.ZipFile(caminho) as z:
                        for nome in sorted(z.namelist()):
                            if nome.lower().endswith(".json") and not os.path.basename(nome).startswith("_"):
                                try:
                                    yield f"{a}/{nome}", json.loads(z.read(nome).decode("utf-8"))
                                except ValueError:
                                    print(f"  (ignorado, JSON inválido: {a}/{nome})")
            except (ValueError, OSError, zipfile.BadZipFile) as e:
                print(f"  (ignorado, não abriu: {a}: {str(e)[:60]})")


def mesclar(pastas, desde="2010"):
    """Acrescenta ao que já está em stj/acordaos os acórdãos das pastas (arquivos baixados à mão do portal de
    dados abertos do STJ), sem apagar nada e sem repetir (pelo id). Mesmo filtro do "montar"."""
    base = RAIZ / "stj" / "acordaos"
    itens = []   # só os NOVOS: o que já existe não é lido nem reescrito
    try:
        ind = indice_fatiado.ler(str(base / "indice.json"))["itens"]
    except (OSError, ValueError, KeyError):
        ind = []
    ids = {str(r[0]) for r in ind}
    antes, motivos, lidos = 0, collections.Counter(), 0
    for pasta in pastas:
        for nome, lista in listas_da_pasta(pasta):
            if not isinstance(lista, list):
                continue
            lidos += 1
            novos = 0
            for d in lista:
                if not isinstance(d, dict) or not d.get("id") or str(d["id"]) in ids:
                    continue
                dd = str(d.get("dataDecisao") or "")
                if not re.match(r"\d{8}$", dd) or dd < desde:
                    continue
                ver, motivo = avaliar(d)
                motivos[(ver, motivo)] += 1
                if ver != "incluir":
                    continue
                e = para(d.get("ementa"))
                h = cab(e)
                ids.add(str(d["id"]))
                novos += 1
                itens.append(dict(id=str(d["id"]), proc=d["siglaClasse"] + " " + str(d["numeroProcesso"]),
                    org=ORG.get(d["nomeOrgaoJulgador"], d["nomeOrgaoJulgador"].title()), rel=(d.get("ministroRelator") or "").title(),
                    data=dd, area=next(v for v, rx in KW if re.search(rx, h.lower())), tit=titulo(h), res=resultado(d.get("decisao")),
                    reg=d.get("numeroRegistro") or "", ementa=e, dec=para(d.get("decisao")), inf=para(d.get("informacoesComplementares")),
                    notas=para(d.get("notas")), pub=re.sub(r"\s+", " ", d.get("dataPublicacao") or "")))
            if novos:
                print(f"  {nome}: {novos} acórdão(s) novo(s)")
    print(f"{lidos} arquivo(s) lidos; {len(itens) - antes} acórdão(s) novo(s) (já havia {antes}):")
    for (ver, motivo), n in motivos.most_common():
        print(f"  {n:7d}  {ver:8s} {motivo}")
    if len(itens) > antes:
        acrescentar(itens)
    else:
        print("nada novo para gravar.")


def main():
    p = argparse.ArgumentParser()
    p.add_argument("passo", choices=["coletar", "montar", "mesclar", "podar"])
    p.add_argument("--pasta", action="append", default=[], help="(mesclar) pasta com os espelhos baixados à mão (JSON/ZIP); pode repetir")
    p.add_argument("--teste", action="store_true")
    p.add_argument("--refazer", action="store_true", help="(montar) reescreve tudo do zero em vez de só acrescentar o novo")
    p.add_argument("--desde", default="2010", help="data mínima do julgamento, AAAA ou AAAAMMDD")
    a = p.parse_args()
    if a.passo == "coletar":
        sys.exit(1 if coletar() else 0)
    if a.passo == "mesclar":
        if not a.pasta:
            sys.exit("informe --pasta <pasta com os JSON/ZIP dos espelhos>")
        mesclar(a.pasta, a.desde)
        return
    if a.passo == "podar":
        podar(a.teste, a.desde)
        return
    montar(a.teste, a.desde, a.refazer)


if __name__ == "__main__":
    main()
