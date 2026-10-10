#!/usr/bin/env python3
"""
acordaos_stf.py — coleta os acórdãos do STF na pesquisa de jurisprudência
(jurisprudencia.stf.jus.br) para o Diário das Decisões.

O STF recusa os servidores do GitHub e responde 202 (desafio do firewall) a
qualquer programa; um navegador de verdade passa. Por isso o robô usa o
Firefox invisível de atualizar_informativos.py: abre a página de pesquisa e
chama a API dela de dentro da página. Roda no Mac.

Duas etapas (o filtro pode ser ajustado sem coletar tudo de novo):

  1. coletar  — baixa os acórdãos, um arquivo por mês, para um cache FORA do
                repositório (~/EstudaMana/cache-stf-acordaos/AAAA-MM.json.gz).
                Meses já coletados não são baixados de novo, exceto o mês
                corrente e o anterior (chegam acórdãos novos).
  2. montar   — lê o cache, tira o que não tem conteúdo de estudo (ver
                avaliar()) e grava o que o site usa:
                  stf/acordaos/indice.json  — lista leve (busca e cards)
                  stf/acordaos/c/NNN.json   — ementa, ata, tese etc., 250 por
                                              arquivo, baixados só ao abrir o card

Uso:
    python3 scripts/acordaos_stf.py coletar --de 2025 --ate 2025
    python3 scripts/acordaos_stf.py coletar --de 1988 --ate 2026
    python3 scripts/acordaos_stf.py montar            # sem internet
    python3 scripts/acordaos_stf.py montar --teste    # só mostra os números
"""
import argparse, calendar, collections, gzip, json, re, shutil, sys, time
from datetime import date
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(RAIZ / "scripts"))
import atualizar_informativos as robo  # noqa: E402  (Firefox invisível, Falha)

CACHE = Path.home() / "EstudaMana" / "cache-stf-acordaos"
PAGINA = "https://jurisprudencia.stf.jus.br/pages/search"
POR_VEZ = 200  # acórdãos por consulta (sem o inteiro teor, que é enorme)
CAMPOS = [
    "id", "titulo", "processo_classe_processual_unificada_sigla",
    "processo_classe_processual_unificada_classe_sigla", "processo_numero",
    "relator_processo_nome", "relator_acordao_nome", "orgao_julgador",
    "julgamento_data", "publicacao_data", "julgamento_is_sessao_virtual",
    "is_repercussao_geral", "is_repercussao_geral_merito", "is_questao_ordem",
    "ementa_texto", "acordao_ata", "documental_tese_tipo",
    "documental_tese_texto", "documental_tese_tema_texto",
    "documental_indexacao_texto", "documental_legislacao_citada_texto",
    "documental_assunto_texto", "inteiro_teor_url", "procedencia_geografica_uf_sigla",
]

_JS = """
const corpo = arguments[0], feito = arguments[arguments.length - 1];
fetch('/api/search/search', {method: 'POST', headers: {'content-type': 'application/json'},
                             body: JSON.stringify(corpo)})
  .then(r => r.text().then(t => feito({s: r.status, t: t})))
  .catch(e => feito({s: 0, t: String(e)}));
"""


def consultar(corpo, tentativas=8):
    """POST na API de pesquisa, de dentro da página (o 202 do firewall some em segundos)."""
    ultimo = None
    for i in range(tentativas):
        r = robo._mn_enviar("WebDriver:ExecuteAsyncScript", {"script": _JS, "args": [corpo]})
        v = r.get("value") if isinstance(r, dict) else None
        if v and v.get("s") == 200:
            return json.loads(v["t"])["result"]["hits"]
        ultimo = v
        if v and v.get("s") == 400:   # consulta errada: repetir não adianta
            raise robo.Falha(f"a pesquisa do STF recusou a consulta: {v.get('t', '')[:200]}")
        time.sleep(3 * (i + 1))
    raise robo.Falha(f"a pesquisa do STF não respondeu: {str(ultimo)[:200]}")


def corpo_do_mes(ano, mes, depois=None):
    ini = f"{ano}-{mes:02d}-01"
    fim = f"{ano}-{mes:02d}-{calendar.monthrange(ano, mes)[1]}"
    c = {
        "query": {"bool": {"filter": [{"term": {"base": "acordaos"}},
                                      {"range": {"julgamento_data": {"gte": ini, "lte": fim}}}]}},
        "size": POR_VEZ, "track_total_hits": True, "_source": CAMPOS,
        "sort": [{"julgamento_data": "asc"}, {"id": "asc"}],
    }
    if depois:
        c["search_after"] = depois
    return c


def coletar_mes(ano, mes):
    achados, depois, total = [], None, None
    while True:
        h = consultar(corpo_do_mes(ano, mes, depois))
        if total is None:
            total = h["total"]["value"]
        lote = h["hits"]
        if not lote:
            break
        achados += [x["_source"] for x in lote]
        depois = lote[-1]["sort"]
        if len(lote) < POR_VEZ:
            break
    if len(achados) != total:
        raise robo.Falha(f"{ano}-{mes:02d}: a pesquisa diz {total} acórdãos e vieram {len(achados)}")
    return achados


def coletar(de, ate):
    CACHE.mkdir(parents=True, exist_ok=True)
    hoje = date.today()
    recentes = {(hoje.year, hoje.month), ((hoje.year, hoje.month - 1) if hoje.month > 1 else (hoje.year - 1, 12))}
    robo.pagina_firefox(PAGINA)
    falhas = 0
    for ano in range(de, ate + 1):
        for mes in range(1, 13):
            if (ano, mes) > (hoje.year, hoje.month):
                break
            arq = CACHE / f"{ano}-{mes:02d}.json.gz"
            if arq.exists() and (ano, mes) not in recentes:
                continue
            try:
                itens = coletar_mes(ano, mes)
            except robo.Falha as e:
                falhas += 1
                print(f"ERRO {ano}-{mes:02d}: {e}")
                robo.pagina_firefox(PAGINA)   # recomeça limpo
                continue
            with gzip.open(arq, "wt", encoding="utf-8") as f:
                json.dump(itens, f, ensure_ascii=False, separators=(",", ":"))
            print(f"{ano}-{mes:02d}: {len(itens)} acórdãos", flush=True)
    return falhas


# ---------------------------------------------------------------- filtro ----
# O acervo tem ~370 mil acórdãos, e a maioria só trata de admissibilidade
# (agravo contra decisão que não admitiu recurso: "ofensa reflexa", Súmula 279,
# falta de prequestionamento...). O site guarda o que ensina algo.
DESDE = "1988-10-05"   # Constituição de 1988; o que veio antes é de outra ordem constitucional
# "Sem mérito" vale só para a DECISÃO do Tribunal (o trecho depois do último "Decisão:"), nunca para voto vencido ou
# ressalva ("…do Ministro X, que dela não conhecia"): isso derrubava julgamentos que o Tribunal conheceu e decidiu.
NAO_DECIDE = re.compile(r"^(?:.{0,160}?)(?:n[ãa]o conhec(?:eu|eram|ido|imento)|prejudicad|homolog|desist|negou seguimento|extin[gç]|perda de objeto|sem resolu)", re.I)
DECIDE = re.compile(r"julg(?:ou|aram) (?:\w+ ){0,3}(?:procedente|improcedente)|conced(?:eu|eram)|deneg(?:ou|aram)|deferi(?:u|ram)|deu(?:ram)? (?:parcial )?provimento|negou provimento|referend|fixou|declarou", re.I)


def sem_merito(ata):
    a = limpo(ata)
    i = a.rfind("Decisão:")
    dec = (a[i + 8:] if i >= 0 else a)[:260]
    return bool(NAO_DECIDE.search(dec)) and not DECIDE.search(dec)
PROCESSUAL = re.compile(
    r"ofensa (?:meramente |apenas )?(?:indireta|reflexa)|infraconstitucional"
    r"|S[úu]mulas? (?:n[ºo.]*\s*)?(?:279|280|281|282|283|284|356|287|288|735|7)\b"
    r"|reexame|revolvimento|prequestion|intempestiv|impugna[çc][ãa]o espec[ií]fica"
    r"|(?:pr[óo]prios|mesmos) fundamentos|pressupostos de admissibilidade|n[ãa]o infirm"
    r"|n[ãa]o trouxe (?:novos )?argumentos|reitera[çc][ãa]o de argumentos|reiter(?:a|ou) (?:os )?argumentos"
    r"|suced[âa]neo|supress[ãa]o de inst[âa]ncia|descabimento de (?:habeas|impetra)|acervo f[áa]tico|f[áa]tico-probat"
    r"|erro grosseiro|fungibilidade|demonstra[çc][ãa]o (?:fundamentada |formal )?da repercuss[ãa]o geral"
    r"|desconstitu\w+ (?:especificamente )?os fundamentos|n[ãa]o cabimento|n[ãa]o cabe[a-z]* (?:recurso|agravo|embargos|habeas)", re.I)
NEGADO = re.compile(r"neg(?:ou|aram) provimento|desprov|improced|denegou|n[ãa]o provido", re.I)
PRECEDENTE = re.compile(r"\bTema\s*(?:n[ºo.]*\s*)?\d|repercuss[ãa]o geral|\b(?:ADI|ADPF|ADC|ADO)\b|\bS[úu]mula Vinculante\b", re.I)
RECURSO = re.compile(r"-(AgR|ED|EI|EDv|embargos|segundo|Ref)")


def limpo(s):
    return re.sub(r"\s+", " ", s or "").strip()


def avaliar(d):
    """('incluir'|'excluir', motivo). Tem conteúdo de estudo o acórdão que firma
    entendimento (tese, repercussão geral, controle concentrado, julgamento
    original ou recurso com razões de mérito). Não tem: não conhecimento,
    prejudicado, homologação de desistência, embargos rejeitados, agravo que só
    repete a barreira de admissibilidade."""
    e, a = limpo(d.get("ementa_texto")), limpo(d.get("acordao_ata"))
    sig = d.get("processo_classe_processual_unificada_sigla") or ""
    cls = d.get("processo_classe_processual_unificada_classe_sigla") or ""
    tese = bool(limpo(d.get("documental_tese_texto")))
    if len(e) < 120:
        return "excluir", "ementa curta"
    if sig.endswith("-RG"):
        return "excluir", "repercussão geral (já há o card do Tema)"
    if sem_merito(d.get("acordao_ata")) and not tese:
        return "excluir", "ata sem mérito"
    if tese or d.get("is_repercussao_geral_merito"):
        return "incluir", "tese/repercussão geral"
    if cls in ("ADI", "ADC", "ADPF", "ADO") and sig in (cls, cls + "-ED", cls + "-MC", cls + "-MC-Ref"):
        return "incluir", "controle concentrado"
    if RECURSO.search(sig) and not sig.endswith("-MC-Ref"):
        if re.search(r"rejeit", a, re.I):
            return "excluir", "embargos rejeitados"
        n = len(PROCESSUAL.findall(e))
        if n >= 2 or (n == 1 and len(e) < 3500):
            return "excluir", "recurso só processual"
        if NEGADO.search(a) and not (len(e) >= 900 and PRECEDENTE.search(e)):
            return "excluir", "recurso negado sem precedente"   # agravo não provido que só repete a decisão agravada
        return "incluir", "recurso com mérito"
    return "incluir", "julgamento original"


# ----------------------------------------------------------------- saída ----
AREAS = [("Direito Tributário", r"tribut|icms|imposto|execu[çc][ãa]o fiscal|contribui[çc]"),
         ("Execução Penal", r"execu[çc][ãa]o penal|remi[çc][ãa]o|livramento condicional|progress[ãa]o de regime|falta grave"),
         ("Direito Processual Penal", r"processual penal|pris[ãa]o preventiva|habeas|j[úu]ri|den[úu]ncia|inqu[ée]rito"),
         ("Direito Penal", r"penal|crime|tr[áa]fico|dosimetria|furto|roubo|homic[íi]dio"),
         ("Direito Previdenciário", r"previdenci"),
         ("Direito do Trabalho", r"trabalh|justi[çc]a do trabalho|clt"),
         ("Direito Eleitoral", r"eleitor"),
         ("Direito do Consumidor", r"consumidor"),
         ("Direito Ambiental", r"ambiental"),
         ("Direito Administrativo", r"administrativ|servidor|improbidade|licita[çc]|concurso p[úu]blico"),
         ("Direito Empresarial", r"empresarial|fal[êe]ncia|recupera[çc][ãa]o judicial"),
         ("Direito Constitucional", r"constitucional|controle de constitucionalidade|federalismo|compet[êe]ncia legislativa|direitos fundamentais"),
         ("Direito Processual Civil", r"processual civil|cpc|agravo|recurso"),
         ("Direito Civil", r"civil|fam[íi]lia|contrat|responsabilidade")]
ORGAOS = {"Tribunal Pleno": "Plenário", "Primeira Turma": "1ª Turma", "Segunda Turma": "2ª Turma", "Terceira Turma": "3ª Turma"}


def cabecalho(e):
    """Primeira frase da ementa (assunto), sem o rótulo "Ementa:"."""
    e = limpo(re.sub(r"^\s*ementa\s*:?\s*", "", e or "", flags=re.I))
    h = re.split(r"\s(?=I\.\s+(?:CASO|Caso)\b)|\s(?=1\.\s)", e, 1)[0]
    h = h.rstrip(". ")
    if sum(c.isupper() for c in h) > 0.6 * max(1, sum(c.isalpha() for c in h)):   # EMENTA EM CAIXA ALTA
        h = re.sub(r"(^|[.:] )(\w)", lambda m: m.group(1) + m.group(2).upper(), h.lower())
        h = re.sub(r"\b(stf|stj|tst|tse|cpp|cp|cpc|cf|cf/88|clt|ctn|cdc|eca|icms|iss|ipi|inss|sus|adi|adpf|adc|ado|re|are|rcl|hc|ms)\b", lambda m: m[0].upper(), h)
    return h if len(h) <= 190 else h[:190].rsplit(" ", 1)[0] + "…"


def area_de(d, h):
    m = re.match(r"(Direito [^.:,]+?)(?:[.,:]| e outras| e )", h)
    if m and any(m[1].startswith(a[0]) for a in AREAS):
        return next(a[0] for a in AREAS if m[1].startswith(a[0]))
    alvo = (h + " " + limpo(d.get("documental_assunto_texto"))).lower()
    return next((a for a, rx in AREAS if re.search(rx, alvo)), "Direito Constitucional")


def resultado(ata):
    ata = limpo(ata)
    m = re.search(r"\b(?:por (?:unanimidade|maioria|votação)[^,]*, )?((?:n[ãa]o )?(?:deu|deram|negou|negaram|conheceu|conheceram|julgou|julgaram|concedeu|concederam|denegou|denegaram|acolheu|acolheram|referendou|referendaram|rejeitou|deferiu)[^.;]*)", ata, re.I)
    return (m[1] if m else "")[:90]


def para(s):
    return "\n".join(p for p in (limpo(x) for x in re.split(r"\n\s*\n|\r", (s or "").replace("\u00a0", " "))) if p)


def montar(teste=False, refazer=False):
    itens, motivos, total = [], collections.Counter(), 0
    for arq in sorted(CACHE.glob("*.json.gz")):
        for d in json.load(gzip.open(arq, "rt", encoding="utf-8")):
            total += 1
            if (d.get("julgamento_data") or "") < DESDE:
                continue
            ver, motivo = avaliar(d)
            motivos[(ver, motivo)] += 1
            if ver != "incluir":
                continue
            h = cabecalho(d["ementa_texto"])
            itens.append(dict(
                id=str(d["id"]).replace("sjur", ""), proc=d["titulo"],
                org=ORGAOS.get(d.get("orgao_julgador"), d.get("orgao_julgador") or ""),
                rel=(d.get("relator_acordao_nome") or d.get("relator_processo_nome") or "").title(),
                data=d["julgamento_data"].replace("-", ""), area=area_de(d, h), tit=h,
                res=resultado(d.get("acordao_ata")), ementa=para(re.sub(r"^\s*ementa\s*:?\s*", "", d["ementa_texto"], flags=re.I)),
                ata=para(d.get("acordao_ata")), tese=para(d.get("documental_tese_texto")),
                tt=limpo(d.get("documental_tese_tipo")), tema=limpo(d.get("documental_tese_tema_texto")),
                idx=re.sub(r"^vide ementa\.?$", "", limpo(d.get("documental_indexacao_texto")).lstrip("- "), flags=re.I), pub=(d.get("publicacao_data") or "").replace("-", ""),
                url=d.get("inteiro_teor_url") or ""))
    print(f"{total} acórdãos no cache; {len(itens)} com conteúdo de estudo (desde {DESDE}):")
    for (ver, motivo), n in motivos.most_common():
        print(f"  {n:7d}  {ver:8s} {motivo}")
    if teste:
        return
    if refazer:
        gravar(itens)
    else:
        acrescentar(itens)


def linha(i, ch):
    return [i["id"], i["proc"], i["org"], i["rel"], i["data"], i["area"], i["tit"], i["res"], ch]


def detalhe(i):
    return {"ementa": i["ementa"], "ata": i["ata"], "tese": i["tese"], "tt": i["tt"], "tema": i["tema"],
            "idx": i["idx"], "pub": i["pub"], "url": i["url"]}


CAMPOS = ["id", "processo", "orgao", "relator", "data", "area", "titulo", "resultado", "parte"]
FONTE = "STF — pesquisa de jurisprudência (acórdãos)"


def gravar(itens):
    """Reescreve TUDO (só com --refazer: reorganiza as partes e o git vê todos os arquivos alterados)."""
    itens.sort(key=lambda i: (i["data"], i["id"]), reverse=True)
    base = RAIZ / "stf" / "acordaos"
    shutil.rmtree(base, ignore_errors=True)
    (base / "c").mkdir(parents=True)
    N, indice = 250, []
    for k in range(0, len(itens), N):
        ch, det = k // N, {}
        for i in itens[k:k + N]:
            indice.append(linha(i, ch))
            det[i["id"]] = detalhe(i)
        with open(base / "c" / f"{ch:03d}.json", "w", encoding="utf-8") as f:
            json.dump(det, f, ensure_ascii=False, separators=(",", ":"))
    with open(base / "indice.json", "w", encoding="utf-8") as f:
        json.dump({"fonte": FONTE, "campos": CAMPOS, "itens": indice}, f, ensure_ascii=False, separators=(",", ":"))
    print("gravado em stf/acordaos/ —", len(itens), "acórdãos")


def acrescentar(novos):
    """Só o que é NOVO: partes novas depois da última e linhas no fim do índice. O que já existe não é reescrito
    (o git vê arquivos novos e o índice com linhas a mais, não 700 arquivos alterados)."""
    base = RAIZ / "stf" / "acordaos"
    man = base / "indice.json"
    if not man.exists():
        return gravar(list(novos))
    ind = json.load(open(man, encoding="utf-8"))
    ids = {r[0] for r in ind["itens"]}
    novos = sorted((i for i in novos if i["id"] not in ids), key=lambda i: (i["data"], i["id"]), reverse=True)
    if not novos:
        print("nada novo para gravar.")
        return
    prox, N = max(r[8] for r in ind["itens"]) + 1, 250
    for k in range(0, len(novos), N):
        ch, det = prox + k // N, {}
        for i in novos[k:k + N]:
            ind["itens"].append(linha(i, ch))
            det[i["id"]] = detalhe(i)
        with open(base / "c" / f"{ch:03d}.json", "w", encoding="utf-8") as f:
            json.dump(det, f, ensure_ascii=False, separators=(",", ":"))
    with open(man, "w", encoding="utf-8") as f:
        json.dump(ind, f, ensure_ascii=False, separators=(",", ":"))
    print(f"acrescentados {len(novos)} acórdãos novos (partes {prox}–{prox + (len(novos) - 1) // N}); o resto ficou como estava.")


def main():
    p = argparse.ArgumentParser()
    p.add_argument("passo", choices=["coletar", "montar"])
    p.add_argument("--de", type=int, default=date.today().year - 1)
    p.add_argument("--ate", type=int, default=date.today().year)
    p.add_argument("--teste", action="store_true")
    p.add_argument("--refazer", action="store_true", help="(montar) reescreve tudo em vez de só acrescentar o novo")
    a = p.parse_args()
    if a.passo == "coletar":
        sys.exit(1 if coletar(a.de, a.ate) else 0)
    montar(a.teste, a.refazer)


if __name__ == "__main__":
    main()
