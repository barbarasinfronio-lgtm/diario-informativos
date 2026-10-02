#!/usr/bin/env python3
"""
limpar_decisoes.py — tira do Diário das Decisões as decisões repetidas e as
que não têm conteúdo (só andamento do processo: "retirado de pauta", pedido de
vista, admissão de amicus curiae, adoção do rito do art. 12…).

Roda sozinho nos robôs (gerar-leves.yml e dividir-dados-por-ano.yml) antes de
gerar os arquivos das páginas, então vale também para os dados que chegarem
depois. Pode rodar quantas vezes quiser: o que já está limpo fica igual, e o
formato de cada arquivo é mantido (para as mudanças ficarem pequenas no git).

Uso:  python3 scripts/limpar_decisoes.py            (limpa e grava)
      python3 scripts/limpar_decisoes.py --relatorio (só mostra o que faria)

Regras (por arquivo):
  controleconst/adi_dados.js (Controle concentrado)
    - sai: decisão interlocutória/de sobrestamento/"adotado rito do art. 12"
      que não trate de liminar, cautelar ou suspensão da norma; e registros que
      só falam de pauta, vista ou adiamento, sem decidir nada;
    - repetida: mesmo processo, data e texto → fica uma;
    - julgamento conjunto: mesma data e mesmo texto em processos diferentes →
      fica um card, com os processos juntos no título.
  reclamacoes/reclamacoes-data.js
    - sai: texto vazio ou que só diz "prejudicado o pedido liminar",
      "arquivem-se/comunique-se/publique-se", lançamento duplicado do sistema;
    - código repetido para decisões diferentes da mesma reclamação → a
      segunda ganha código próprio (as duas ficam);
    - mesma data, relator e texto em reclamações diferentes → um card só.
  rg-repetitivos-data.js (Repercussão Geral e Repetitivos)
    - sai: tema cancelado "em duplicidade com o Tema…";
    - mesmo tribunal, tipo e número de tema ("1.229" = "1229") com a mesma tese
      → fica o mais completo.
  stj/teses.json (Jurisprudência em Teses)
    - sai: "Item retirado.";
    - a mesma tese em duas edições → fica a da edição mais recente.
  stf/extras.json (Omissões, Resumos, COVID-19)
    - mesmo grupo e mesmo texto em processos diferentes → um card, processos juntos.
  tst/decisoes.json
    - sai: item sem texto.
  stj/acordaos/indice.json · informativos/indice.json
    - repetidos (mesmo processo, data e ementa / mesmo órgão, edição e tese) → fica um;
    - acórdãos que só "não conhecem" do recurso/pedido saem, a não ser que
      algo tenha sido analisado de ofício (ex.: habeas corpus concedido de ofício).
  Controle: também saem as decisões "não conhecido" sem nada de ofício.
  Controle: saem as decisões monocráticas (só do relator ou do presidente:
    liminar ad referendum ainda não referendada, "nego seguimento", "julgo
    prejudicada", embargos decididos pelo relator…). Não vinculam e não ajudam
    na preparação; ficam só as do Plenário/Turma, que vinculam.
  Todas as listas de teses/informativos: se a essência da tese é a mesma (texto
    quase idêntico, mesmos números e mesmos nomes próprios) fica só a mais recente.
  Controle: saem as decisões que o Informativo do STF já traz (mesma ação, data
    até 20 dias de diferença): o Informativo tem a tese e o estado de origem.
"""
import datetime
import json
import os
import re
import sys
import unicodedata

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
RELATORIO = "--relatorio" in sys.argv
resumo = []


def caminho(f):
    return os.path.join(RAIZ, f)


def norm(t):
    t = unicodedata.normalize("NFKC", str(t or "")).lower()
    t = t.replace("_x000d_", " ")
    return re.sub(r"\s+", " ", t).strip()


# ---- leitura/gravação mantendo o formato -------------------------------------
def ler_js(f):
    """'<prefixo>[ ... ]<sufixo>' → (prefixo, lista, sufixo, indent)."""
    s = open(caminho(f), encoding="utf-8").read()
    ini = s.index("[")
    fim = s.index("];", ini) + 1 if "];" in s else s.rindex("]") + 1
    lista = json.loads(s[ini:fim])
    indent = 1 if s[ini:ini + 3].startswith("[\n ") else None
    return s[:ini], lista, s[fim:], indent


def gravar_js(f, prefixo, lista, sufixo, indent):
    corpo = json.dumps(lista, ensure_ascii=False, indent=indent) if indent else \
        json.dumps(lista, ensure_ascii=False, separators=(",", ":"))
    novo = prefixo + corpo + sufixo
    if novo != open(caminho(f), encoding="utf-8").read() and not RELATORIO:
        open(caminho(f), "w", encoding="utf-8").write(novo)


def ler_json(f):
    s = open(caminho(f), encoding="utf-8").read()
    return json.loads(s), s.endswith("\n")


def gravar_json(f, obj, nl):
    novo = json.dumps(obj, ensure_ascii=False, separators=(",", ":")) + ("\n" if nl else "")
    if novo != open(caminho(f), encoding="utf-8").read() and not RELATORIO:
        open(caminho(f), "w", encoding="utf-8").write(novo)


def conferir_formato(f):
    """Antes de mexer: ler e gravar de novo tem de dar o arquivo idêntico."""
    if f.endswith(".js"):
        p, l, s, i = ler_js(f)
        corpo = json.dumps(l, ensure_ascii=False, indent=i) if i else json.dumps(l, ensure_ascii=False, separators=(",", ":"))
        ok = p + corpo + s == open(caminho(f), encoding="utf-8").read()
    else:
        o, nl = ler_json(f)
        ok = json.dumps(o, ensure_ascii=False, separators=(",", ":")) + ("\n" if nl else "") == open(caminho(f), encoding="utf-8").read()
    if not ok:
        print("  ! formato diferente do esperado em", f, "— o arquivo será regravado no formato padrão")


def juntar_processos(itens, campo="processo", sufixo="julgamento conjunto"):
    """Um card para vários processos com a mesma decisão."""
    nomes = []
    for d in itens:
        for p in str(d.get(campo) or "").split(" · ")[0].split(", "):
            p = re.sub(r"\s*\(.*\)$", "", p)
            p = re.sub(r" e mais \d+$", "", p).replace(" e ", ", ").strip()
            for q in p.split(", "):
                if q and q not in nomes:
                    nomes.append(q)
    if len(nomes) <= 1:
        return itens[0].get(campo)
    if len(nomes) > 5:   # título curto: os 5 primeiros e quantos mais
        lista = ", ".join(nomes[:5]) + " e mais " + str(len(nomes) - 5)
    else:
        lista = ", ".join(nomes[:-1]) + " e " + nomes[-1]
    return lista + " (" + sufixo + ")"


# ---- teses parecidas: fica só a mais recente --------------------------------
def _sem_notas(t):
    """Tira as notas entre parênteses ("Tese julgada sob o rito do art. 543-C…",
    "Súmula 460/STJ"…), que mudam de edição para edição."""
    t = unicodedata.normalize("NFKC", str(t or ""))
    return re.sub(r"\((?:[^()]*?(?:tese julgada|tema|rito|s[uú]mula|informativo|vide|repetitivo|stj|stf)[^()]*)\)", " ", t, flags=re.I)


def _assinatura(t):
    base = _sem_notas(t)
    palavras = set(re.sub(r"\s+", " ", re.sub(r"[^\w\s]", " ", base.lower())).split())
    nums = {w for w in palavras if w.isdigit()}
    # nomes próprios (Ceará, Pará, União…): duas teses sobre estados diferentes não são a mesma
    proprios = set(re.findall(r"(?<=[a-zà-ú,;] )[A-ZÀ-Ú][a-zà-ú]{2,}", base))
    return palavras, nums, proprios, len(palavras)


def _parecidas(a, b, lim=0.88):
    (wa, na, pa, la), (wb, nb, pb, lb) = a, b
    if la < 8 or lb < 8 or na != nb or pa != pb:
        return False
    if min(la, lb) / max(la, lb) < 0.8:
        return False
    return len(wa & wb) / len(wa | wb) >= lim


def _dia(d):
    m = re.match(r"(\d{2})/(\d{2})/(\d{4})", str(d or ""))
    return datetime.date(int(m[3]), int(m[2]), int(m[1])).toordinal() if m else 0


def agrupar_parecidas(itens, texto, grupo=lambda x: None):
    """Lista de grupos (listas de posições) de itens com a mesma essência."""
    sigs = [_assinatura(texto(x)) for x in itens]
    idx = {}
    for i, sg in enumerate(sigs):
        for w in sorted(sg[0], key=lambda z: -len(z))[:6]:
            idx.setdefault((grupo(itens[i]), w), []).append(i)
    pai = list(range(len(itens)))

    def raiz(i):
        while pai[i] != i:
            pai[i] = pai[pai[i]]
            i = pai[i]
        return i
    for i, sg in enumerate(sigs):
        cand = set()
        for w in sorted(sg[0], key=lambda z: -len(z))[:6]:
            cand.update(idx.get((grupo(itens[i]), w), []))
        for j in cand:
            if j < i and raiz(i) != raiz(j) and _parecidas(sg, sigs[j]):
                pai[raiz(i)] = raiz(j)
    grupos = {}
    for i in range(len(itens)):
        grupos.setdefault(raiz(i), []).append(i)
    return [g for g in grupos.values() if len(g) > 1]


def tirar_parecidas(itens, texto, data, grupo=lambda x: None):
    """itens: lista de objetos; texto(x), data(x) 'dd/mm/aaaa', grupo(x) separa
    o que nunca se mistura (ex.: STF x STJ). Devolve (lista sem as mais antigas
    de cada grupo de teses parecidas, quantas saíram)."""
    sai = set()
    for g in agrupar_parecidas(itens, texto, grupo):
        # a mais recente fica (empate: a que aparece primeiro)
        fica = max(g, key=lambda i: (_dia(data(itens[i])), -i))
        sai.update(i for i in g if i != fica)
    return [x for i, x in enumerate(itens) if i not in sai], len(sai)


def _rotulo_precedente(d):
    """"STJ Tema 209", "STF Tema 1396", "STJ Edição 228 · tese 4"."""
    return " ".join(x for x in (d.get("orgao"), d.get("precedenteLabel") or "Tema", str(d.get("tema") or "")) if x)


def juntar_teses_e_temas():
    """A mesma tese aparece na Jurisprudência em Teses do STJ e como Tema
    (Repetitivo/Repercussão Geral). Fica um card só, com o conteúdo mais recente,
    e o número do outro vai em "tambem" (o card mostra os dois números)."""
    f_rg, f_te = "rg-repetitivos-data.js", "stj/teses.json"
    p, rg, suf, ind = ler_js(f_rg)
    obj, nl = ler_json(f_te)
    teses = obj["itens"]
    todos = [("rg", d) for d in rg] + [("te", d) for d in teses]
    cruzadas = 0
    sai = set()
    for g in agrupar_parecidas(todos, lambda x: x[1].get("tese")):
        if len({todos[i][0] for i in g}) < 2:
            continue   # tudo da mesma lista: já tratado antes
        # fica a mais recente; empate: o Tema (tem processo e relator)
        fica = max(g, key=lambda i: (_dia(todos[i][1].get("data")), todos[i][0] == "rg", -i))
        sobreviv = todos[fica][1]
        rotulos = list(sobreviv.get("tambem") or [])
        for i in g:
            if i == fica:
                continue
            d = todos[i][1]
            for r in [_rotulo_precedente(d)] + list(d.get("tambem") or []):
                if r not in rotulos and r != _rotulo_precedente(sobreviv):
                    rotulos.append(r)
            sai.add(i)
            cruzadas += 1
        sobreviv["tambem"] = rotulos
    rg = [d for i, (t, d) in enumerate(todos) if t == "rg" and i not in sai]
    teses = [d for i, (t, d) in enumerate(todos) if t == "te" and i not in sai]
    obj["itens"] = teses
    if "total" in obj:
        obj["total"] = len(teses)
    resumo.append(f"Teses x Temas: {cruzadas} cards juntados (ficam {len(rg)} Temas e {len(teses)} teses)")
    gravar_js(f_rg, p, rg, suf, ind)
    gravar_json(f_te, obj, nl)


# ---- Controle concentrado -----------------------------------------------------
PROC_TIPO = {"Decisão Interlocutória", "Decisão Sobrestamento"}
PROC_AND = re.compile(r"^(Adotado rito do Art\. 12|Convertido em dilig|Determinada a devolu|SOBRESTADO|Sobrestado|DECISAO INTERLOCUTORIA)", re.I)
SUBST = re.compile(r"(defiro|deferi|concedo|concedi|determino|referend)[^.;]{0,80}(cautelar|liminar|suspens)|suspend[eoi][^.;]{0,40}(efic|vig|aplica|efeit|norma|lei|art)|ad referendum|indeferia a medida|deferia a medida|extens[aã]o da decis[aã]o cautelar|liminarmente|peti[çc][ãa]o inicial|tutela", re.I)
PAUTA = re.compile(r"retirad[ao] de pauta|pedido de (destaque|vista)|julgamento (foi )?adiado|indicado adiamento|renova[çc][ãa]o do julgamento", re.I)
DECIDE = re.compile(r"julgou|julgo|negou|nego |deu provimento|dou provimento|conheceu|referendou|declar|homolog|extin|implemento|deferiu|indeferiu", re.I)
AND_PAUTA = re.compile(r"^(Recebidos|DECIS[ÃA]O DO RELATOR|JULGAMENTO NO PLENO|QUEST[ÃA]O DE ORDEM)$", re.I)


# "Não conhecido": o tribunal não decidiu nada. Fica só se, no mesmo julgamento,
# analisou algo de ofício, fixou tese, modulou efeitos, acolheu embargos de outra
# parte ou esclareceu a interpretação conforme (ex.: ADI 7949, ADI 1183).
NAO_CONHECIDO = re.compile(r"n[ãa]o conhecid|nao conhecid|inadmitidos os embargos", re.I)
DE_OFICIO = re.compile(r"de of[ií]cio", re.I)
DE_OFICIO_DECIDIDO = re.compile(r"(,|e|mas|contudo|por[ée]m)\s*,?\s*de of[ií]cio,|(conced\w*|reconhec\w*|declar\w*|determin\w*|anul\w*|corrig\w*)[^.;]{0,60}de of[ií]cio|de of[ií]cio,? (para |a fim de )?(conced|reconhec|declar|determin|anul|corrig|fix)", re.I)
VINCULANTE = re.compile(r"(fix\w*|assent\w*|firm\w*) (a seguinte |a |esta )?tese|tese de julgamento|modula\w*|acolh\w* (em parte )?(os )?embargos|interpreta[çc][ãa]o conforme (conferida|dada)|ressalvad\w* (em qualquer caso )?a validade", re.I)


# Decisão colegiada (Plenário/Turma) = vinculante. Tudo que não tiver sinal de
# colegiado é do relator ou do presidente. "Ad referendum" e "submeto ao
# referendo do Plenário" são do relator: só valem depois que o Plenário referenda.
COLEGIADO = re.compile(r"\bo tribunal(?! (de|regional|superior|federal|estadual|eleitoral|do)\b)|plen[áa]rio|por (maioria|unanimidade)|\b(a|primeira|segunda|1ª|2ª) turma|colegiad|referendou|referendad[ao]|sess[ãa]o virtual|\bpleno\b", re.I)
SO_RELATOR = re.compile(r"ad referendum|submet\w+[^.]{0,80}(referendo|plen[áa]rio)|referendo[^.]{0,40}plen[áa]rio", re.I)


def monocratica(d):
    t = " ".join(str(d.get(c) or "") for c in ("tema", "andamento", "resultado"))
    return not COLEGIADO.search(SO_RELATOR.sub(" ", t))


def sem_conteudo_controle(d):
    if monocratica(d):
        return True
    t = norm(d.get("tema"))
    if NAO_CONHECIDO.search(d.get("andamento") or ""):
        return not (DE_OFICIO_DECIDIDO.search(t) or VINCULANTE.search(t))
    proc = d.get("tipoDecisao") in PROC_TIPO or PROC_AND.search(d.get("andamento") or "")
    if proc and not SUBST.search(t):
        return True
    return bool(AND_PAUTA.search(d.get("andamento") or "") and PAUTA.search(t) and not DECIDE.search(t)
                and not SUBST.search(t) and len(t) < 700)


ACAO = re.compile(r"\b(ADI|ADPF|ADC|ADO)\s*n?[º°o.]?\s*(\d[\d.]*)", re.I)


def acoes(t):
    return [a.upper() + re.sub(r"\D", "", n) for a, n in ACAO.findall(str(t or ""))]


def dia(v):
    m = re.match(r"(\d{2})/(\d{2})/(\d{4})", str(v or "")) or re.match(r"(\d{4})-(\d{2})-(\d{2})", str(v or ""))
    if not m:
        return None
    a, b, c = (int(x) for x in m.groups())
    if a > 31:
        a, c = c, a
    return datetime.date(c, b, a).toordinal()


def ja_no_informativo():
    """Função que diz se a decisão do Controle já está num Informativo do STF."""
    obj, _ = ler_json("informativos/indice.json")
    campos = obj["campos"]
    ip, idt = campos.index("processo"), campos.index("data")
    por = {}
    for x in obj["itens"]:
        d, a = dia(x[idt]), acoes(x[ip])
        for k in a:
            por.setdefault(k, []).append((d, a))

    def repetida(d):
        a, dd = acoes(d.get("processo")), dia(d.get("data"))
        if not a or dd is None:
            return False
        return any(o[0] is not None and abs(o[0] - dd) <= 20 and all(k in o[1] for k in a) for o in por.get(a[0], []))
    return repetida


def limpar_controle():
    f = "controleconst/adi_dados.js"
    conferir_formato(f)
    p, lista, s, i = ler_js(f)
    antes = len(lista)
    lista = [d for d in lista if not sem_conteudo_controle(d)]
    vazias = antes - len(lista)
    repetida = ja_no_informativo()
    n1 = len(lista)
    lista = [d for d in lista if not repetida(d)]
    resumo.append(f"Controle: já no Informativo do STF {n1 - len(lista)}")
    vistos, saida, rep = {}, [], 0
    for d in lista:   # mesmo processo, data e texto
        k = (d.get("processo"), d.get("data"), norm(d.get("tema")))
        if k in vistos:
            rep += 1
            continue
        vistos[k] = True
        saida.append(d)
    grupos, ordem = {}, []
    for d in saida:   # julgamento conjunto
        t = norm(d.get("tema"))
        k = (d.get("data"), t) if len(t) > 80 else ("unico", d.get("id"))
        if k not in grupos:
            grupos[k] = []
            ordem.append(k)
        grupos[k].append(d)
    final, juntadas = [], 0
    for k in ordem:
        g = grupos[k]
        d = g[0]
        if len(g) > 1:
            juntadas += len(g) - 1
            d["processo"] = juntar_processos(g)
        final.append(d)
    resumo.append(f"Controle: {antes} → {len(final)} (sem conteúdo ou monocráticas {vazias}, repetidas {rep}, juntadas {juntadas})")
    gravar_js(f, p, final, s, i)


# ---- Reclamações ----------------------------------------------------------------
LIXO_RCL = re.compile(r"lan[çc]amento duplo|referente ao lan[çc]amento", re.I)
FORMULA = re.compile(r"(em )?\d{1,2}[./]\d{1,2}[./]\d{2,4}:?|\(\.\.\.\)|\[\.\.\.\]|\.\.\.|[\"“”']|publique-se|comunique-se|arquivem-se( estes| os)?( autos)?|arquive-se|intime-se|intimem-se|cumpra-se|bras[ií]lia[^.]*|_x000d_|\bem\b\s*$", re.I)
SO_LIMINAR = re.compile(r"^(julgo )?(julgo )?prejudicad[oa] (o |a )?(pedido|medida) (de )?liminar( requerid[oa])?$|^cassad[ao] a medida liminar$|^prejudicado pedido de liminar$", re.I)


def sem_conteudo_rcl(d):
    t = norm(d.get("resumo"))
    if not t or LIXO_RCL.search(t):
        return True
    resto = re.sub(r"[\s.,;:]+", " ", FORMULA.sub(" ", t)).strip()
    return not resto or SO_LIMINAR.search(resto) is not None or len(resto) < 8


def limpar_reclamacoes():
    f = "reclamacoes/reclamacoes-data.js"
    conferir_formato(f)
    p, lista, s, i = ler_js(f)
    antes = len(lista)
    lista = [d for d in lista if not sem_conteudo_rcl(d)]
    vazias = antes - len(lista)
    ids, renomeadas = {}, 0
    for d in lista:   # código repetido: decisões diferentes da mesma reclamação
        if d["id"] in ids:
            novo = d["id"] + "_" + re.sub(r"\D", "", d.get("dataJulgamento") or "")
            n = 2
            while novo in ids:
                novo = d["id"] + "_" + re.sub(r"\D", "", d.get("dataJulgamento") or "") + "_" + str(n)
                n += 1
            d["id"] = novo
            renomeadas += 1
        ids[d["id"]] = True
    vistos, saida, rep = {}, [], 0
    for d in lista:
        k = (d.get("processo"), d.get("dataJulgamento"), norm(d.get("resumo")))
        if k in vistos:
            rep += 1
            continue
        vistos[k] = True
        saida.append(d)
    grupos, ordem = {}, []
    for d in saida:
        t = norm(d.get("resumo"))
        k = (d.get("dataJulgamento"), d.get("relator"), t) if len(t) > 80 else ("unico", d.get("id"))
        if k not in grupos:
            grupos[k] = []
            ordem.append(k)
        grupos[k].append(d)
    final, juntadas = [], 0
    for k in ordem:
        g = grupos[k]
        d = g[0]
        if len(g) > 1:
            juntadas += len(g) - 1
            d["processo"] = juntar_processos(g, sufixo="mesma decisão")
        final.append(d)
    resumo.append(f"Reclamações: {antes} → {len(final)} (sem conteúdo {vazias}, repetidas {rep}, juntadas {juntadas}, códigos corrigidos {renomeadas})")
    gravar_js(f, p, final, s, i)


# ---- Repercussão Geral e Repetitivos ------------------------------------------
def limpar_rg():
    f = "rg-repetitivos-data.js"
    conferir_formato(f)
    p, lista, s, i = ler_js(f)
    antes = len(lista)
    lista = [d for d in lista if not re.match(r"em duplicidade com o tema", norm(d.get("tese")))]
    canceladas = antes - len(lista)

    def peso(d):
        return (len([v for v in d.values() if v not in (None, "", "—")]), len(str(d.get("tese") or "")) + len(str(d.get("destaque") or "")))
    melhor, ordem = {}, []
    for d in lista:
        tema = re.sub(r"\D", "", str(d.get("tema") or ""))
        t = norm(d.get("tese"))
        k = (d.get("orgao"), d.get("tipo"), tema, t) if tema and t else ("unico", d.get("id"))
        if k not in melhor:
            melhor[k] = d
            ordem.append(k)
        elif peso(d) > peso(melhor[k]):
            melhor[k] = d
    final = [melhor[k] for k in ordem]
    n0 = len(final)
    final, parecidas = tirar_parecidas(final, lambda d: d.get("tese"), lambda d: d.get("data"), lambda d: d.get("orgao"))
    resumo.append(f"Repercussão Geral/Repetitivos: {antes} → {len(final)} (canceladas por duplicidade {canceladas}, repetidas {len(lista) - n0}, tese parecida {parecidas})")
    gravar_js(f, p, final, s, i)


# ---- Jurisprudência em Teses -----------------------------------------------------
def edicao(d):
    m = re.match(r"stj-jt-(\d+)-", str(d.get("id")))
    return int(m.group(1)) if m else 0


def limpar_teses():
    f = "stj/teses.json"
    conferir_formato(f)
    obj, nl = ler_json(f)
    lista = obj["itens"]
    antes = len(lista)
    lista = [d for d in lista if norm(d.get("tese")) not in ("", "item retirado.", "item retirado")]
    retiradas = antes - len(lista)
    mais_nova = {}
    for d in lista:
        t = norm(d.get("tese"))
        if len(t) > 40 and (t not in mais_nova or edicao(d) > edicao(mais_nova[t])):
            mais_nova[t] = d
    final = [d for d in lista if len(norm(d.get("tese"))) <= 40 or mais_nova[norm(d.get("tese"))] is d]
    n0 = len(final)
    final, parecidas = tirar_parecidas(final, lambda d: d.get("tese"), lambda d: d.get("data"))
    obj["itens"] = final
    if "total" in obj:
        obj["total"] = len(final)
    resumo.append(f"Teses do STJ: {antes} → {len(final)} (itens retirados {retiradas}, repetidas em outra edição {len(lista) - n0}, tese parecida {parecidas})")
    gravar_json(f, obj, nl)


# ---- Extras do STF ---------------------------------------------------------------
def limpar_extras():
    f = "stf/extras.json"
    conferir_formato(f)
    obj, nl = ler_json(f)
    lista = obj["itens"]
    antes = len(lista)
    grupos, ordem = {}, []
    for d in lista:
        t = norm(d.get("tese"))
        k = (d.get("grupo"), t) if len(t) > 60 else ("unico", d.get("id"))
        if k not in grupos:
            grupos[k] = []
            ordem.append(k)
        grupos[k].append(d)
    final = []
    for k in ordem:
        g = grupos[k]
        d = g[0]
        if len(g) > 1:
            d["processo"] = juntar_processos(g)
        final.append(d)
    n0 = len(final)
    final, parecidas = tirar_parecidas(final, lambda d: d.get("tese"), lambda d: d.get("data"), lambda d: d.get("grupo"))
    obj["itens"] = final
    resumo.append(f"Extras do STF: {antes} → {len(final)} (juntadas {antes - n0}, tese parecida {parecidas})")
    gravar_json(f, obj, nl)


# ---- TST ---------------------------------------------------------------------------
def limpar_tst():
    f = "tst/decisoes.json"
    conferir_formato(f)
    obj, nl = ler_json(f)
    lista = obj["itens"]
    antes = len(lista)
    final = [d for d in lista if norm(d.get("tese")) or norm(d.get("questao")) or norm(d.get("destaque"))]
    n0 = len(final)
    final, parecidas = tirar_parecidas(final, lambda d: d.get("tese"), lambda d: d.get("data"))
    obj["itens"] = final
    if "total" in obj:
        obj["total"] = len(final)
    resumo.append(f"TST: {antes} → {len(final)} (sem texto {antes - n0}, tese parecida {parecidas})")
    gravar_json(f, obj, nl)


# ---- índices em colunas (Acórdãos do STJ, Informativos) ---------------------------
def limpar_indice(f, chave, nome, parecidas_em=None):
    conferir_formato(f)
    obj, nl = ler_json(f)
    campos = obj["campos"]
    pos = [campos.index(c) for c in chave]
    antes = len(obj["itens"])
    vistos, final = set(), []
    for x in obj["itens"]:
        k = tuple(norm(x[i]) for i in pos)
        if k in vistos:
            continue
        vistos.add(k)
        final.append(x)
    n0 = len(final)
    extra = ""
    if parecidas_em:   # nome da coluna com a tese: tese parecida → fica a mais recente
        it, idt, io = (campos.index(c) for c in (parecidas_em, "data", "orgao"))
        final, n = tirar_parecidas(final, lambda x: x[it], lambda x: x[idt], lambda x: x[io])
        extra = f", tese parecida {n}"
    obj["itens"] = final
    if "total" in obj:
        obj["total"] = len(final)
    resumo.append(f"{nome}: {antes} → {len(final)} (repetidos {antes - n0}{extra})")
    gravar_json(f, obj, nl)


SO_NAO_CONHECER = re.compile(r"n[ãa]o conhec", re.I)
OUTRA_PARTE = re.compile(r"conhec\w* (parcialmente|em parte)|conhecer d[oa]s? (recurso|agravo|pedido|embargos|conflito)[^,;]*? e (lhe )?(dar|negar|julgar|conceder|acolher|rejeitar)|negar|dar |dar-|provimento|anul|cass|acolh|rejeit|homolog|julgar extinto|declar|conced", re.I)


def limpar_acordaos():
    """Acórdãos do STJ que só não conhecem do recurso (sem nada analisado de ofício)."""
    f = "stj/acordaos/indice.json"
    conferir_formato(f)
    obj, nl = ler_json(f)
    campos = obj["campos"]
    ir, ic, ip = campos.index("resultado"), campos.index("id"), campos.index("parte")
    partes = {}

    def dispositivo(x):
        """Trecho do acórdão com o que foi decidido ("por unanimidade, ... nos termos do voto")."""
        n = "%03d" % int(x[ip])
        if n not in partes:
            try:
                partes[n] = json.load(open(caminho("stj/acordaos/c/" + n + ".json"), encoding="utf-8"))
            except (OSError, ValueError):
                partes[n] = {}
        dec = re.sub(r"\s+", " ", str((partes[n].get(str(x[ic])) or {}).get("dec") or ""))
        m = re.search(r"(por unanimidade|por maioria).*?(nos termos do voto|$)", dec, re.I)
        return (m.group(0) if m else dec) or str(x[ir] or "")
    antes = len(obj["itens"])
    final = []
    for x in obj["itens"]:
        d = dispositivo(x)
        if SO_NAO_CONHECER.search(d) and not OUTRA_PARTE.search(d) and not DE_OFICIO.search(d):
            continue
        final.append(x)
    obj["itens"] = final
    if "total" in obj:
        obj["total"] = len(final)
    resumo.append(f"Acórdãos do STJ (só não conhecem): {antes} → {len(final)} (saíram {antes - len(final)})")
    gravar_json(f, obj, nl)


def main():
    alvos = [a for a in sys.argv[1:] if not a.startswith("--")] or ["todos"]
    tudo = "todos" in alvos
    if tudo or "controle" in alvos:
        limpar_controle()
    if tudo or "reclamacoes" in alvos:
        limpar_reclamacoes()
    if tudo or "decisoes" in alvos:
        limpar_rg()
        limpar_teses()
        juntar_teses_e_temas()
        limpar_extras()
        limpar_tst()
        limpar_indice("stj/acordaos/indice.json", ["processo", "data", "titulo", "resultado"], "Acórdãos do STJ")
        limpar_acordaos()
        limpar_indice("informativos/indice.json", ["orgao", "informativo", "tese"], "Informativos", parecidas_em="tese")
    print(("(só relatório) " if RELATORIO else "") + "\n".join(resumo))


if __name__ == "__main__":
    main()
