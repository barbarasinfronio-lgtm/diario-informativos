#!/usr/bin/env python3
"""
evolucao_minerar.py — acha, no histórico de decisões do site, as que ANUNCIAM uma mudança de posicionamento.

Não adivinha: só entra o que o próprio tribunal sinaliza no texto ("superou o entendimento", "revisão de tese",
"cancelamento da Súmula", "passou a entender", "não mais prevalece"…). Para cada trecho acha as referências
(Tema, Súmula, processo, Informativo) que dizem QUAL era a posição anterior.

Fontes: informativos (STF e STJ), acórdãos do STJ e do STF (ementas), temas de repercussão geral e repetitivos.
Saída: curadoria/evolucao/candidatos-*.jsonl (um candidato por linha) — insumo da curadoria (scripts/evolucao_montar.py).

    python3 scripts/evolucao_minerar.py --fonte informativos
    python3 scripts/evolucao_minerar.py --fonte acordaos-stj
    python3 scripts/evolucao_minerar.py --fonte acordaos-stf
    python3 scripts/evolucao_minerar.py --fonte temas
"""
import argparse, glob, json, re, sys
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
SAIDA = RAIZ / "curadoria" / "evolucao"

# ---- sinais de mudança (alta precisão: o tribunal diz que mudou) ------------------------------------------------
OBJ = r"(?:o |os |a |as |seu |seus |sua |suas |do |da |dos |das |de |d[oa]s? )?(?:pr[óo]prio )?(?:entendimento|entendimentos|jurisprud[êe]ncia|posicionamento|posi[çc][ãa]o|orienta[çc][ãa]o|precedentes?|tese|s[úu]mula|tema|julgados?|interpreta[çc][ãa]o|critério)"
SINAIS = {
    "superacao": re.compile(r"(?:supera(?:ç|c)[ãa]o|superou|superam|supera|superando|superad[oa]s?|superar|superaram|superaç[ãa]o)\s+" + OBJ, re.I),
    "revisao": re.compile(r"(?:revis[ãa]o|revisitar|revisita|revisitando|reexame|reconsidera[çc][ãa]o|reapreciar|reapre?cia[çc][ãa]o|revisar|reviu|revê|rev[êe]|rever|revisou|revisando)\s+(?:de |do |da |dos |das |o |a |os |as |seu |sua |tal )?(?:pr[óo]prio )?(?:entendimento|jurisprud[êe]ncia|posicionamento|posi[çc][ãa]o|orienta[çc][ãa]o|precedente|tese|s[úu]mula|tema|julgado)", re.I),
    "alteracao": re.compile(r"(?:alterou|altera|alterar|alterando|alterado|mudou|muda|mudan[çc]a de|modificou|modifica|reformulou|reformula|reformula[çc][ãa]o d|abandonou|abandona|abandonar|retificou|retifica|readequou|readequa|readequa[çc][ãa]o d|reposicionou|reposicionamento)\s+(?:de |do |da |dos |das |o |a |os |as |seu |sua |tal |outro )?(?:pr[óo]prio )?(?:entendimento|jurisprud[êe]ncia|posicionamento|posi[çc][ãa]o|orienta[çc][ãa]o|precedente|tese)", re.I),
    "mudanca": re.compile(r"(?:mudan[çc]a|altera[çc][ãa]o|modifica[çc][ãa]o|evolu[çc][ãa]o|virada|viragem|guinada|inflex[ãa]o|reviravolta|supera[çc][ãa]o)\s+(?:de |do |da |dos |das )?(?:no )?(?:entendimento|jurisprud[êe]ncia|jurisprudencial|posicionamento|posi[çc][ãa]o|orienta[çc][ãa]o|precedente|tese)", re.I),
    "novo": re.compile(r"\bnovo (?:entendimento|posicionamento|rumo|paradigma|marco jurisprudencial)\b|\bnova (?:orienta[çc][ãa]o|interpreta[çc][ãa]o jurisprudencial)\b|\bpassou a (?:entender|adotar|decidir|admitir|reconhecer|aceitar|considerar|exigir|afastar)\b|\bn[ãa]o mais (?:prevalece|se sustenta|subsiste|vigora|merece prosperar)\b|\bdeixa de prevalecer\b|\bdeixou de prevalecer\b|\bn[ãa]o prevalece mais\b|\b(?:entendimento|orienta[çc][ãa]o|posicionamento|jurisprud[êe]ncia|posi[çc][ãa]o) anterior\b(?!mente)|\bantes (?:entendia|firmava)\b", re.I),
    "cancelamento": re.compile(r"\b(?:cancel(?:amento|ou|a|ar|ad[oa]s?|e-se)|revog(?:a[çc][ãa]o|ou|a|ad[oa]s?|ar)|supera(?:ç[ãa]o|ou|d[oa]s?)) (?:d[aoe]s? |a |o |da |as |os )?(?:s[úu]mulas?|temas?|teses?|enunciados?|orienta[çc][õo]es jurisprudenciais?)\b|\b(?:s[úu]mula|tema)\s*(?:vinculante\s*)?(?:n[º°.o]*\s*)?\d{1,4}\b[^.]{0,50}\b(?:cancelad[ao]|revogad[ao]|superad[ao])\b", re.I),
    "overruling": re.compile(r"overruling|overrule|distinção (?:\(distinguishing\))|\bsignaling\b|prospective overruling", re.I),
}
# o ruído mais comum: "superação" no sentido de vencer algo, "alteração legislativa", modulação etc.
RUIDO = re.compile(r"supera[çc][ãa]o d[aeo] (?:prazo|crise|obst[áa]culo|d[ée]ficit|limite|vulnerabilidade|pobreza|desigualdade|dificuldade|barreira|pandemia|situa[çc][ãa]o|conflito|antinomia|quadro|d[ií]vida|cr[ií]tica)|alte(?:ra|ração) legislativ|lei nova|nova lei|nova redação dada|supera[çc][ãa]o da coisa julgada|supera[çc][ãa]o d[ao] personalidade|superação de eventuais", re.I)

REF_TEMA = re.compile(r"\bTemas?\s*(?:n[º°.o]*\s*)?(\d{1,4})\s*(?:/|\s+d[oa]\s+|\s+-\s+)?\s*(STJ|STF|RG|repercuss[ãa]o geral|recursos? repetitivos?)?", re.I)
REF_SUMULA = re.compile(r"\bS[úu]mulas?\s*(Vinculante\s*)?(?:n[º°.o]*\s*)?(\d{1,4})\s*(?:/|\s+d[oa]\s+|\s+-\s+)?\s*(STJ|STF|TST|TSE|TCU|TNU|CJF)?", re.I)
REF_PROC = re.compile(r"\b(REsp|RE|ADI|ADPF|ADC|ADO|HC|RHC|MS|RMS|Pet|EREsp|EAREsp|AREsp|ARE|CC|RvCr|SEC|Rcl|AgRg|AgInt|EDcl|EResp|IAC|RR|ERR|Inq|AP|AO|ACO|SL|STA)\s*(?:n[º°.o]*\s*)?(\d{1,3}(?:\.\d{3})+|\d{3,7})(?:[-/][A-Z]{2})?", re.I)
REF_INFO = re.compile(r"Informativo\s*(?:de\s*Jurisprud[êe]ncia\s*)?(?:n[º°.o]*\s*)?(\d{1,4})(?:\s*/\s*(STJ|STF))?", re.I)


# Sinal FORTE: o próprio tribunal é o sujeito da mudança ("esta Corte superou…", "a Primeira Seção passou a entender…")
# ou a mudança vem no cabeçalho ("Superação de entendimento", "Revisão de tese", "Cancelamento da Súmula").
SUJ = r"(?:esta corte|este tribunal|esse tribunal|essa corte|essa c[oô]rte|o stj|o stf|o supremo(?: tribunal federal)?|o superior tribunal(?: de justi[çc]a)?|o plen[áa]rio|a corte especial|a (?:primeira|segunda|terceira|quarta|quinta|sexta) (?:se[çc][ãa]o|turma)|a se[çc][ãa]o|a turma|o tribunal pleno|a corte suprema|o col[ée]gio|o colegiado|o pret[óo]rio|esta se[çc][ãa]o|esta turma|o tst|o tse|a sbdi-?1|a sdc)"
VERB = r"(?:superou|superaram|alterou|alteraram|modificou|modificaram|mudou|mudaram|reviu|revisou|revisaram|revisitou|abandonou|reformulou|evoluiu|retificou|cancelou|revogou|reconsiderou|redefiniu|readequou|reposicionou|passou a (?:entender|adotar|decidir|admitir|reconhecer|aceitar|exigir|considerar)|veio a (?:alterar|modificar|superar|rever)|reviram)"
OBJ2 = r"(?:seu |o |a |os |as |tal |esse |este |aquele )?(?:pr[óo]prio )?(?:entendimento|posicionamento|jurisprud[êe]ncia|orienta[çc][ãa]o|s[úu]mula|tema|tese|precedente|posi[çc][ãa]o|interpreta[çc][ãa]o|\w+ anterior)"
FORTE = [
    ("sujeito-verbo", re.compile(SUJ + r"[^.;]{0,90}?\b" + VERB + r"\b[^.;]{0,40}?" + OBJ2 + "|" + SUJ + r"[^.;]{0,60}?\b" + VERB + r"\b", re.I)),
    ("cabecalho", re.compile(r"\b(?:supera[çc][ãa]o (?:de|do|da) (?:entendimento|jurisprud[êe]ncia|precedente|tese|s[úu]mula|posicionamento)|mudan[çc]a (?:de|do) (?:entendimento|posicionamento|jurisprud[êe]ncia)|revis[ãa]o (?:de|da) tese|revis[ãa]o d[oe] tema|cancelamento d[aoe] (?:s[úu]mula|tema)|overruling|viragem jurisprudencial|virada jurisprudencial|evolu[çc][ãa]o jurisprudencial|altera[çc][ãa]o (?:de|do) entendimento|mutaç[ãa]o constitucional)\b", re.I)),
    ("tema-cancelado", re.compile(r"\b(?:cancel(?:ou|a|ado|ada|amento)|supera(?:r|ou|d[oa]|ção)|revog(?:ou|ad[oa]|a)|revis(?:ão|ou|ada|ado))\s+(?:d[oae] |a |o |do |da |as |os )?(?:tese |teses |temas? |s[úu]mula |s[úu]mulas )?(?:d[ao] )?(?:tema |s[úu]mula )?(?:n[º°.o]*\s*)?\d{1,4}\b", re.I)),
]
NEGA = re.compile(r"plen[áa]rio virtual funciona|apenas os ministros e os tribunais cadastrados|emenda regimental \d+|corte de origem|tribunal de origem|tribunal a quo|inst[âa]ncia ordin[áa]ria|inst[âa]ncia de origem|reexame|incidência da s[úu]mula 7|s[úu]mula 7\b|revis[ãa]o d[ae]s? (?:provas|fatos|matéria f[áa]tica|cl[áa]usulas|contrato)|simples reexame", re.I)


# Retrospectiva: a própria decisão conta a mudança ("em um primeiro momento entendia X… posteriormente passou a Y")
ANTES = r"(?:em um primeiro momento|em primeiro momento|inicialmente|originariamente|tradicionalmente|historicamente|antes entendia|at[ée] ent[ãa]o|outrora|por muito tempo|durante muito tempo|em princ[íi]pio, (?:a|o) (?:corte|tribunal|jurisprud)|a princ[íi]pio, (?:a|o) (?:corte|tribunal|jurisprud)|na vig[êe]ncia do entendimento|a jurisprud[êe]ncia (?:desta corte |do stj |do stf |deste tribunal )?(?:era|firmou-se|consolidou-se|orientava-se|inclinava-se)|o entendimento (?:antigo|anterior|original|primitivo)|a orienta[çc][ãa]o (?:antiga|anterior|original))"
DEPOIS = r"(?:posteriormente|em seguida|passou a|passou-se a|mudou|modificou-se|superou|evoluiu|evolu[íi]u|nova orienta[çc][ãa]o|novo entendimento|atualmente|hoje|a partir d[eoa]|recentemente|mais recentemente|em momento posterior|revisou|reviu|alterou|adotou-se|firmou-se (?:novo|a tese))"
RETRO = re.compile(r"(" + ANTES + r")[^|]{20,420}?\b(" + DEPOIS + r")\b", re.I)


def retrospectivas(texto):
    """Trechos em que a decisão relata o ANTES e o DEPOIS da jurisprudência."""
    out = []
    for m in RETRO.finditer(texto):
        ctx = texto[max(0, m.start() - 160): min(len(texto), m.end() + 280)]
        if NEGA.search(ctx[100:-100]):
            continue
        if not re.search(r"corte|tribunal|stj|stf|supremo|se[çc][ãa]o|turma|plen[áa]rio|jurisprud|entendimento", ctx, re.I):
            continue
        out.append({"sinal": "retrospectiva", "pos": m.start(), "trecho": re.sub(r"\s+", " ", ctx).strip(), "refs": referencias(ctx)})
        if len(out) >= 3:
            break
    return out


def fortes(texto):
    """Trechos em que o tribunal anuncia a mudança (sujeito+verbo ou cabeçalho) ou relata o antes/depois; descarta reexame de provas e o 'tribunal de origem'."""
    out = retrospectivas(texto)
    for nome, rx in FORTE:
        for m in rx.finditer(texto):
            a, b = max(0, m.start() - 220), min(len(texto), m.end() + 300)
            ctx = texto[a:b]
            if NEGA.search(texto[max(0, m.start() - 80): m.end() + 80]) or RUIDO.search(texto[m.start(): m.end() + 40]):
                continue
            out.append({"sinal": nome, "pos": m.start(), "trecho": re.sub(r"\s+", " ", ctx).strip(), "refs": referencias(ctx)})
            if len(out) >= 4:
                return out
    return out


def janelas(texto, rx):
    """Trechos (±260 caracteres) em torno de cada sinal, já sem ruído."""
    out = []
    for m in rx.finditer(texto):
        a, b = max(0, m.start() - 260), min(len(texto), m.end() + 260)
        trecho = texto[a:b]
        if RUIDO.search(trecho[200:330]):
            continue
        out.append((m.start(), trecho))
    return out


def referencias(trecho):
    r = {"temas": [], "sumulas": [], "processos": [], "informativos": []}
    for m in REF_TEMA.finditer(trecho):
        org = (m.group(2) or "").upper()
        org = "STF" if org in ("RG", "REPERCUSSÃO GERAL", "REPERCUSSAO GERAL") else ("STJ" if org.startswith("RECURSO") else org)
        r["temas"].append([m.group(1), org])
    for m in REF_SUMULA.finditer(trecho):
        r["sumulas"].append([m.group(2), (m.group(3) or "").upper(), bool(m.group(1))])
    for m in REF_PROC.finditer(trecho):
        r["processos"].append([m.group(1), m.group(2).replace(".", "")])
    for m in REF_INFO.finditer(trecho):
        r["informativos"].append([m.group(1), (m.group(2) or "").upper()])
    return {k: v for k, v in r.items() if v}


def candidato(fonte, orgao, _id, processo, data, titulo, texto, extra=None):
    """Devolve um candidato se o texto sinaliza mudança de posicionamento, senão None."""
    f = fortes(texto)
    if not f:
        return None
    achados = {}
    for nome, rx in SINAIS.items():
        js = janelas(texto, rx)
        if js:
            achados[nome] = js[:3]
    if not achados:
        return None
    # só "novo" (frases como "entendimento anterior") sozinho é fraco: exige outro sinal OU referência a decisão anterior
    trechos = [dict(t, sinal="forte:" + t["sinal"]) for t in f]
    for nome, js in achados.items():
        for pos, t in js:
            trechos.append({"sinal": nome, "pos": pos, "trecho": re.sub(r"\s+", " ", t).strip(), "refs": referencias(t)})
    c = {"fonte": fonte, "orgao": orgao, "id": _id, "processo": processo, "data": data, "titulo": titulo,
         "sinais": sorted(set(achados) | {t["sinal"] for t in f}), "trechos": trechos[:6]}
    if extra:
        c.update(extra)
    return c


def iso(d):
    d = str(d or "")
    m = re.match(r"(\d{2})/(\d{2})/(\d{4})", d)
    if m:
        return f"{m[3]}-{m[2]}-{m[1]}"
    m = re.match(r"(\d{4})(\d{2})(\d{2})$", d)
    if m:
        return f"{m[1]}-{m[2]}-{m[3]}"
    m = re.match(r"(\d{4})-(\d{2})-(\d{2})", d)
    return d[:10] if m else ""


def fonte_informativos():
    idx = json.loads((RAIZ / "informativos" / "indice.json").read_text(encoding="utf-8"))["itens"]
    res = {}
    for f in sorted(glob.glob(str(RAIZ / "informativos" / "c" / "*.json"))):
        res.update(json.loads(Path(f).read_text(encoding="utf-8")))
    for x in idx:
        if not (x[6] or "").strip() or (x[4] or "").startswith("Informativo STF"):   # edição inteira (sumário/normas), não é julgado
            continue
        txt = " ".join([x[4] or "", x[5] or "", res.get(x[0]) or ""])
        c = candidato("informativo", x[1], x[0], x[6] or "", iso(x[7]), x[4] or "", txt,
                      {"informativo": x[2], "area": x[3], "tese": x[5], "link_id": x[0]})
        if c:
            yield c


def fonte_acordaos(tribunal):
    base = RAIZ / tribunal / "acordaos"
    if tribunal == "stj":
        idx = {}
        for f in sorted(glob.glob(str(base / "indice-*.json"))):
            for x in json.loads(Path(f).read_text(encoding="utf-8"))["itens"]:
                idx[x[0]] = x
    else:
        j = json.loads((base / "indice.json").read_text(encoding="utf-8"))
        idx = {x[0]: x for x in (j["itens"] if isinstance(j, dict) else j)}
    for f in sorted(glob.glob(str(base / "c" / "*.json"))):
        for k, v in json.loads(Path(f).read_text(encoding="utf-8")).items():
            x = idx.get(k)
            if not x:
                continue
            ementa = v.get("ementa") if isinstance(v, dict) else str(v)
            if not ementa:
                continue
            if tribunal == "stj":
                proc, data, area = x[1], iso(x[4]), x[5]
            else:
                proc, data, area = str(x[1]), iso(x[2]) if len(x) > 2 else "", ""
            c = candidato("acordao", tribunal.upper(), k, proc, data, (ementa or "")[:160], ementa,
                          {"area": area, "tese": ementa[:700], "link_id": k})
            if c:
                yield c


def fonte_temas():
    s = (RAIZ / "site" / "decisoes" / "rg-repetitivos-data.js").read_text(encoding="utf-8")
    j = json.JSONDecoder().raw_decode(s[s.index("["):])[0]
    for x in j:
        txt = " ".join(str(x.get(k) or "") for k in ("titulo", "tese", "destaque", "historico", "questao", "suspensao"))
        c = candidato("tema", x["orgao"], str(x["id"]), x.get("processo", ""), iso(x.get("data")), x.get("titulo", ""), txt,
                      {"tema": x.get("tema"), "area": x.get("area"), "tese": x.get("tese"), "status": x.get("status")})
        if c:
            yield c


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--fonte", required=True, choices=["informativos", "acordaos-stj", "acordaos-stf", "temas"])
    a = ap.parse_args()
    SAIDA.mkdir(exist_ok=True)
    gen = {"informativos": fonte_informativos, "temas": fonte_temas,
           "acordaos-stj": lambda: fonte_acordaos("stj"), "acordaos-stf": lambda: fonte_acordaos("stf")}[a.fonte]()
    n = 0
    with open(SAIDA / f"candidatos-{a.fonte}.jsonl", "w", encoding="utf-8") as f:
        for c in gen:
            f.write(json.dumps(c, ensure_ascii=False) + "\n")
            n += 1
    print(f"{a.fonte}: {n} candidato(s) em curadoria/evolucao/candidatos-{a.fonte}.jsonl")


if __name__ == "__main__":
    main()
