#!/usr/bin/env python3
"""Vade Mecum Estuda Mana — protótipo.
Uso: python3 vade/gerar_vade.py <id-do-texto> [fontes.json]
Lê leis/texto/<id>.json, procura em súmulas/enunciados/resoluções as citações da lei
(artigo, § e inciso), junta com vade/curadoria/<id>.json (vínculos manuais) e gera
vade/saida/<id>.html (pronto para imprimir/PDF) + vade/saida/<id>-vinculos.json.
Só números/identificadores, nunca o conteúdo do julgado."""
import json, re, sys, html, os, collections
R = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
tid = sys.argv[1]
CACHE = os.path.join(R, 'vade', 'cache')
fontes = json.load(open(sys.argv[2] if len(sys.argv) > 2 else f'{CACHE}/fontes.json'))
DECS = sys.argv[3] if len(sys.argv) > 3 else f'{CACHE}/decisoes.json'
lei = json.load(open(f'{R}/leis/texto/{tid}.json'))
CUR = f'{R}/vade/curadoria/{tid}.json'
cur = json.load(open(CUR)) if os.path.exists(CUR) else {"aliases": [], "vinculos": {}}
NUMLEI = cur['numero_regex']  # ex.: r'6\.015'
ALIAS = '|'.join([r'Lei(?:\s+Federal|\s+Ordin[áa]ria)?\s*(?:n[º°o.]*|nº)?\s*' + NUMLEI + r'(?:\s*/\s*(?:19|20)?\d\d)?'] + cur.get('aliases', []))
MENC = re.compile(ALIAS, re.I)

# ---------- 1. estrutura da lei ----------
ART = re.compile(r'^Art\.?\s*(\d+(?:\.\d{3})*)\s*[º°o]?(?:(?:\s*-\s*|(?<=\d))((?-i:[A-Z]))(?![A-Za-zÀ-ú]))?\s*[.\-–]?\s*', re.I)
PAR = re.compile(r'^(§\s*(\d+)\s*[º°o]?|Parágrafo único)', re.I)
def chave_art(n, s): return n.replace('.', '') + ('-' + s.upper() if s else '')
itens = []   # (tipo, texto, art, anc)
art = anc = None
for p in lei['p']:
    t = p.strip()
    m = ART.match(t)
    if m and re.match(r'^Art', t):
        art = chave_art(m.group(1), m.group(2)); anc = 'c'
        itens.append(('art', t, art, anc)); continue
    m = PAR.match(t)
    if m and art:
        anc = 'u' if m.group(1).lower().startswith('par') else '§' + m.group(2)
        itens.append(('par', t, art, anc)); continue
    if art and re.match(r'^([IVXLC]+|[a-z]|\d+)\s*[-–)\.]', t):
        itens.append(('inc', t, art, anc)); continue
    itens.append(('est', t, None, None))

# ---------- 2. citações ----------
ART_RE = re.compile(r'arts?\.?\s*(\d+(?:\.\d{3})*)\s*[º°o]?(?:(?:\s*-\s*|(?<=\d))((?-i:[A-Z]))(?![A-Za-zÀ-ú]))?', re.I)
PAR_RE = re.compile(r'(§§?\s*\d+\s*[º°o]?|par[áa]grafo\s+[úu]nico)', re.I)
def ancora(seg):
    m = PAR_RE.search(seg)
    if not m: return 'c'
    t = m.group(1).lower()
    return 'u' if t.startswith('par') else '§' + re.search(r'\d+', t).group(0)
def citacoes(txt):
    """lista de (art, ancora) citados no texto em relação à lei"""
    achados = set()
    for m in MENC.finditer(txt):
        ini = max(0, m.start() - 160)
        ante = txt[ini:m.start()]
        # corta no último ponto final/;  que não faça parte de "art." ou "§"
        ante = re.split(r'(?<!art)(?<!arts)(?<!§)[;]|\.\s+(?=[A-ZÁÉ])', ante)[-1]
        # artigos citados antes da menção ("art. 33, parágrafo único, da Lei ...")
        arts = list(ART_RE.finditer(ante))
        if arts:
            for i, a in enumerate(arts):
                fim = arts[i+1].start() if i+1 < len(arts) else len(ante)
                # artigos listados em sequência ("arts. 12, 13 e 14") – ignora, pega o 1º de cada "art."
                achados.add((chave_art(a.group(1), a.group(2)), ancora(ante[a.start():fim])))
            continue
        # depois da menção ("Lei 6.015/73, art. 9º")
        pos = txt[m.end():m.end() + 70]
        a = ART_RE.match(re.sub(r'^[\s,()]+', '', pos))
        if a: achados.add((chave_art(a.group(1), a.group(2)), ancora(pos)))
    return achados

SIGLA = {'stf_vinculante':'Súmula Vinculante {n} STF','stf':'Súmula {n} STF','stj':'Súmula {n} STJ','tst':'Súmula {n} TST',
 'cjf_civil':'Enunciado {n} (Jornada de Direito Civil/CJF)','cjf_processual_civil':'Enunciado {n} (Jornada de Dir. Processual Civil/CJF)',
 'cjf_litigios':'Enunciado {n} (Jornada de Prevenção e Solução Extrajudicial de Litígios/CJF)','fppc':'Enunciado {n} FPPC'}
def rot_sumula(k, v, n, s):
    j = s.get('jornada')
    if k in SIGLA and not (k=='cjf_litigios' and j): return SIGLA[k].format(n=n)
    if k == 'cjf_litigios' and j: return f'Enunciado {n} ({j})'
    base = v.get('label','').split(' — ')[0]
    return f'{"Enunciado" if "cjf" in k or "jornada" in k else "Súmula"} {n} {base}' + (f' ({j})' if j else '')

vinc = collections.defaultdict(lambda: collections.defaultdict(list))  # art -> anc -> [(cat, rot)]
meta = {}   # rot -> (tipo, grupo, número)
extra = collections.defaultdict(list)   # (art, anc, rot) -> artigos do próprio ato que tratam do dispositivo
ARTS = {x[2] for x in itens if x[0] == 'art'}
def add(art, anc, cat, rot, sub=None):
    if art not in ARTS or any(rot.startswith(x) for x in cur.get('excluir', [])): return
    if rot not in [r for _, r in vinc[art][anc]]: vinc[art][anc].append((cat, rot))
    if sub and sub not in extra[(art, anc, rot)]: extra[(art, anc, rot)].append(sub)

def reg_sumula(k, v, s, cat):
    rot = rot_sumula(k, v, s['numero'], s)
    j = s.get('jornada'); base = v.get('label', '').split(' — ')[0]
    if k == 'stf_vinculante': meta[rot] = ('Súm. Vinc.', 'do STF', s['numero'])
    elif 'ENFAM' in base.upper() or 'ENFAM' in k.upper(): meta[rot] = ('Enunciado', 'da ENFAM', s['numero'])
    elif cat == 'Súmulas': meta[rot] = ('Súm.', 'do ' + base.upper().split()[0], s['numero'])
    else:
        g = {'cjf_civil': 'das Jornadas de Direito Civil', 'cjf_processual_civil': 'das Jornadas de Direito Processual Civil', 'fppc': 'do FPPC'}.get(k)
        if not g: g = ('da ' + j if j and not j.startswith('Jornada') else 'da ' + (j or base)) + (' (CJF)' if 'CJF' not in (j or '') else '')
        meta[rot] = ('Enunciado', g, s['numero'])
    return rot
for k, v in fontes['sumulas'].items():
    for s in v.get('sumulas', []) or []:
        txt = s.get('texto') or ''
        if not MENC.search(txt): continue
        cat = 'Enunciados de Jornadas/FPPC' if ('cjf' in k or k == 'fppc') else 'Súmulas'
        rot = reg_sumula(k, v, s, cat)
        for a, an in citacoes(txt): add(a, an, cat, rot)
for org, v in fontes['normas'].items():
    for n in v.get('normas', []):
        txt = n.get('ementa') or ''
        if not MENC.search(txt): continue
        sig = org.upper().replace('CSMPT', 'CSMPT')
        rot = f"{n['tipo']} {n['numero']} ({sig})"
        meta[rot] = (n['tipo'], 'do ' + sig, n['numero'])
        for a, an in citacoes(txt): add(a, an, 'Atos normativos', rot)

# atos baixados (inteiro teor): cache-cnj-atos/texto/*.txt — varre linha a linha, anotando o art. do ato
import glob
for f in sorted(glob.glob(f'{R}/../cache-cnj-atos/texto/*.txt')):
    cab = open(f).readline()
    m = re.match(r'(\S+) (\S+) \((\d\d)/(\d\d)/(\d{4})\)', cab)
    if not m: continue
    rot = f'{m.group(1)} nº {m.group(2)}/{m.group(5)} (CNJ)'
    atual = None
    meta[rot] = (m.group(1), 'do CNJ', f'{m.group(2)}/{m.group(5)}')
    for ln in open(f).read().split('\n')[3:]:
        ma = re.match(r'\s*Art\.?\s*(\d+(?:\.\d{3})*)', ln)
        if ma: atual = ma.group(1).replace('.', '')
        if MENC.search(ln):
            for a, an in citacoes(ln): add(a, an, 'Atos normativos', rot, atual)

# decisões (STF/STJ: repercussão geral, repetitivos, teses) — opcional: argv[3] = decisoes.json
if True:
    for d in json.load(open(DECS)):
        if MENC.search(d['texto']):
            rot = d['rot'][:90]
            mjt = re.match(r'dec:stj-jt-(\d+)', d['id'])
            if mjt: rot = f'Jurisprudência em Teses do STJ, edição nº {mjt.group(1)}'
            for a, an in citacoes(d['texto']): add(a, an, 'Julgados', rot)

# remissões gerais da lei (sem artigo identificado): leve/relacionados.json -> pseudo-dispositivo "geral"
decs = {d['id']: d['rot'] for d in json.load(open(DECS))}
GERAL = ('__geral__', 'c')
try:
    for k in json.load(open(f'{R}/leve/relacionados.json'))['leis'].get(tid, []):
        if k.startswith('norma:'):
            o, n = k.split(':')[1:]
            for ov in fontes['normas'].values():
                for nn in ov.get('normas', []):
                    if nn['numero'] == n and k.split(':')[1].upper() in str(nn.get('link', '')).upper() + 'CNJ':
                        rot = f"{nn['tipo']} {nn['numero']} ({o.upper()})"; meta[rot] = (nn['tipo'], 'do ' + o.upper(), nn['numero'])
                        vinc[GERAL[0]][GERAL[1]].append(('Atos normativos', rot)); break
        elif k.startswith('sum:'):
            _, tr, n = k.split(':'); v = fontes['sumulas'].get(tr, {})
            for sm in v.get('sumulas', []) or []:
                if str(sm['numero']) == n:
                    cat = 'Enunciados de Jornadas/FPPC' if ('cjf' in tr or tr == 'fppc') else 'Súmulas'
                    vinc[GERAL[0]][GERAL[1]].append((cat, reg_sumula(tr, v, sm, cat))); break
        elif k in decs:
            r = decs[k]
            mjt = re.match(r'dec:stj-jt-(\d+)', k)
            if mjt: r = f'Jurisprudência em Teses do STJ, edição nº {mjt.group(1)}'
            if not any(r.startswith(x) for x in cur.get('excluir', [])): vinc[GERAL[0]][GERAL[1]].append(('Julgados', r[:90]))
except Exception as e: print('sem relacionados', e)

# julgados por artigo já catalogados no site (leis/julgados/<id>.json): temas, ações de controle, IAC/IRDR e acórdãos com Informativo
def fnum(n):
    n = re.sub(r'\D', '', n)
    return f'{int(n):,}'.replace(',', '.') if n else ''
def rot_julgado(r):
    r = re.sub(r'\s+', ' ', r).strip()
    m = re.match(r'^Tema (\d+) \((STF|STJ|TST)\)', r)
    if m: return r[:60]
    m = re.match(r'^(ADI|ADPF|ADC|ADO) (\d+)', r)
    if m: return f'{m.group(1)} nº {fnum(m.group(2))} do STF'
    m = re.match(r'^(IAC|IRDR|IRR|IAC/IRDR) (\d+) \((STJ|STF)\)', r)
    if m: return f'{m.group(1)} nº {m.group(2)} do {m.group(3)}'
    m = re.match(r'^((?:[A-Za-z]+ nos? )?[A-Za-z]+) ([\d.]+)(?:-([A-Z]{2}))? \(Info (STJ|STF) (\d+)\)', r)
    if m: return f'{m.group(1)} nº {fnum(m.group(2))}' + (f'/{m.group(3)}' if m.group(3) else '') + f' (Informativo nº {m.group(5)} do {m.group(4)})'
    return None
JUL = f'{R}/leis/julgados/{tid}.json'
if os.path.exists(JUL):
    J = json.load(open(JUL))
    for a, lst in J['art'].items():
        for idx, ancs in lst:
            r = rot_julgado(J['decisoes'][idx][0])
            if not r: continue
            for an in ancs:
                an = an if re.fullmatch(r'c|u|§\d', an) else 'c'
                add(a, an, 'Julgados', r)

# curadoria manual: {"1": {"§3": {"Atos normativos": ["Provimento nº 149/2023 ..."]}}}
for a, ancs in cur.get('vinculos', {}).items():
    for an, cats in ancs.items():
        for cat, lst in cats.items():
            for r in lst: add(a, an, cat, r)

# ---------- 3. saída ----------
os.makedirs(f'{R}/vade/saida', exist_ok=True)
NOTA = re.compile(r'\((?=[^)]*(?:\bdad[ao]s?\b|\bpela\b|\bpelo\b|Inclu[íi]d|Renumer|Revogad|Vetad|Vide\b|Express[ãa]o|Vig[êe]ncia|Prorrog|Acrescid|Alterad|Suprimid|Declarad|Regulament|Texto|Prazo))[^)]*\)', re.I)
def fmtart(n):
    b, _, suf = n.partition('-')
    x = int(b); r = (f'{x}º' if x < 10 else f'{x:,}'.replace(',', '.'))
    return r + ('-' + suf if suf else '')
def plural(t):
    pl = []
    for w in t.split():
        if w.endswith('ão'): w = w[:-2] + 'ões'
        elif w.endswith('a') and pl and pl[-1].endswith('ões'): w += 's'   # Resoluções Conjuntas
        elif not w.endswith('s'): w += 's'
        pl.append(w)
    return ' '.join(pl)
def lista(xs):
    xs = [str(x) for x in xs]
    return xs[0] if len(xs) == 1 else ', '.join(xs[:-1]) + ' e ' + xs[-1]
ATO = re.compile(r'^(Provimento|Resolução|Recomendação|Enunciado Administrativo|Resolução Conjunta|Recomendação Conjunta)s? n[º°o.]*\s*([\d./]+)\s*(.*)$')
def _nk(x):
    m = re.match(r'\d+', str(x)); return (int(m.group(0)) if m else 10**9, str(x))
def linhas(a, an):
    out = []
    d = vinc.get(a, {}).get(an, [])
    livres = [r for cat, r in d if cat == 'Linha']; d = [(c, r) for c, r in d if c != 'Linha']
    sums = collections.OrderedDict(); enun = collections.OrderedDict(); atos = collections.OrderedDict(); temas = collections.OrderedDict(); julg = []
    for cat, r in d:
        t, g, n = meta.get(r, (None, None, None))
        sub = extra.get((a, an, r))
        subtxt = f' (art{"s" if len(sub) > 1 else ""}. {lista(sub[:6])}{"…" if len(sub) > 6 else ""})' if sub else ''
        if t is None:
            m = ATO.match(r)
            mt = re.match(r'^Tema (\d+) \((STF|STJ|TST)\)', r)
            mj = re.match(r'^JT STJ (\d+)', r) or re.match(r'^Registros Públicos', r)
            if m: t, g, n = m.group(1), 'do CNJ', m.group(2)
            elif mt: t, g, n = 'Tema', 'do ' + mt.group(2), mt.group(1)
            else: julg.append(r); continue
        if t in ('Súm.', 'Súm. Vinc.'): sums.setdefault((t, g), []).append(n)
        elif t == 'Enunciado': enun.setdefault(g, []).append(n)
        elif t == 'Tema': temas.setdefault(g, []).append(n)
        else: atos.setdefault((t, g), []).append(n + subtxt)
    for d_ in (sums, enun, temas):
        for k_ in d_: d_[k_] = sorted(dict.fromkeys(d_[k_]), key=_nk)
    for (t, g), ns in sums.items():
        pl = len(ns) > 1
        out.append(('Súms. Vincs.' if pl else 'Súm. Vinc.') if t == 'Súm. Vinc.' else ('Súms.' if pl else 'Súm.')); out[-1] += f' nº{"s" if pl else ""} {lista(ns)} {g}.'
    for g, ns in enun.items():
        out.append(f'Enunciado{"s" if len(ns) > 1 else ""} nº{"s" if len(ns) > 1 else ""} {lista(ns)} {g}.')
    for (t, g), ns in atos.items():
        out.append(f'{plural(t) if len(ns) > 1 else t} nº{"s" if len(ns) > 1 else ""} {lista(ns)} {g}.')
    for g, ns in temas.items():
        out.append(f'Tema{"s" if len(ns) > 1 else ""} nº{"s" if len(ns) > 1 else ""} {lista(ns)} {g}.')
    jts = [m.group(1) for r in julg for m in [re.match(r'^Jurisprud[êe]ncia em Teses do STJ, edi[çc][ãa]o nº (\d+)$', r)] if m]
    julg = [r for r in julg if not re.match(r'^Jurisprud[êe]ncia em Teses do STJ, edi', r)]
    if jts:
        jts = sorted(dict.fromkeys(jts), key=int)
        out.append(('Jurisprudência em Teses do STJ, edições nºs ' if len(jts) > 1 else 'Jurisprudência em Teses do STJ, edição nº ') + lista(jts) + '.')
    if julg: out.append('; '.join(dict.fromkeys(julg)) + '.')
    out += livres
    return out
NAO_ESTE = r'(?!\s*,?\s*(?:d[aoe]s?\s+)?(?:Lei|Decreto|C[óo]digo|Constitui|CF\b|CPC|CC\b|CP\b|CLT|Provimento|Resolu|LC\b|Lei\s+Complementar|Estatuto|CTN|CDC))'
INT = re.compile(r'\barts?\.?\s*(\d+(?:\.\d{3})*)\s*[º°o]?(?:(?:\s*-\s*|(?<=\d))((?-i:[A-Z]))(?![A-Za-zÀ-ú]))?((?:\s*,\s*(?:parágrafo único|(?-i:[IVXL]+)\b|§\s*\d+\s*[º°o]?))*)', re.I)
def internas(a, an):
    txt = ' '.join(t for tp, t, aa, aan in itens if aa == a and aan == an)
    txt = NOTA.sub('', txt)
    achados = []
    for m in INT.finditer(txt):
        resto = txt[m.end():m.end() + 45]
        if re.match(r'\s*,?\s*(?:d[aoe]s?\s+)?(?:Lei|Decreto|C[óo]digo|Constitui|CF\b|CPC|Provimento|Resolu|LC\b|Estatuto|CTN|CDC|CLT)', resto): continue
        k = chave_art(m.group(1), m.group(2))
        if k == a or k not in ARTS: continue
        ref = fmtart(k) + re.sub(r'\s*,\s*', ', ', m.group(3).replace('parágrafo único', 'parágrafo único')).replace(' ,', ',')
        if ref not in [x[1] for x in achados]: achados.append((int(m.group(1).replace('.', '')), ref))
    achados = [r for _, r in sorted(achados, key=lambda x: x[0])]
    if not achados: return []
    pl = len(achados) > 1
    return [('Arts. ' if pl else 'Art. ') + lista(achados) + (',' if re.search(r'§|parágrafo único|[IVXL]$', achados[-1]) else '') + f' {cur.get("deste", "desta Lei")}.']

SIGLAS = [(r'C[óo]digo\s+Civil', 'CC'), (r'C[óo]digo\s+de\s+Processo\s+Civil', 'CPC'), (r'C[óo]digo\s+Penal', 'CP'), (r'C[óo]digo\s+de\s+Processo\s+Penal', 'CPP'),
          (r'Constitui[çc][ãa]o(?:\s+Federal)?|\bCF\b', 'CF'), (r'C[óo]digo\s+Tribut[áa]rio\s+Nacional|\bCTN\b', 'CTN'), (r'C[óo]digo\s+de\s+Defesa\s+do\s+Consumidor|\bCDC\b', 'CDC'),
          (r'C[óo]digo\s+Florestal', 'Código Florestal'), (r'Consolida[çc][ãa]o\s+das\s+Leis\s+do\s+Trabalho|\bCLT\b', 'CLT')]
LEIX = r'(Lei(?:\s+Complementar)?|Decreto-Lei|Decreto)\s+n?[º°o.]*\s*([\d.]+)(?:\s*/\s*(\d{2,4})|,\s*de\s+(?:\d+\s+de\s+\w+\s+de\s+)?(\d{4}))?'
#DIPL = re.compile(r'^\s*,?\s*(?:d[aoe]s?\s+)?(?:(?P<sig>' + '|'.join(f'(?P<s{i}>{r})' for i, (r, _) in enumerate(SIGLAS)) + r')|' + LEIX + ')', re.I)
LEI_RE = re.compile(LEIX, re.I)
CONHECIDAS = {'10.406': 'Código Civil', '13.105': 'Código de Processo Civil', '8.078': 'Código de Defesa do Consumidor', '5.172': 'CTN'}
def _lei_rot(tipo, num, a1, a2):
    if tipo.lower() == 'lei' and num in CONHECIDAS: return CONHECIDAS[num]
    ano = a1 or a2
    if ano and len(ano) == 2: ano = ('19' if int(ano) > 30 else '20') + ano
    t = {'lei': 'Lei', 'lei complementar': 'LC', 'decreto-lei': 'Decreto-Lei', 'decreto': 'Decreto'}[re.sub(r'\s+', ' ', tipo.lower())]
    return f'{t} nº {num}' + (f'/{ano}' if ano else '')
def outras(a, an):
    txt = ' '.join(t for tp, t, aa, aan in itens if aa == a and aan == an)
    txt = NOTA.sub('', txt)
    por = collections.OrderedDict(); gerais = []
    cobertos = []
    for m in INT.finditer(txt):
        resto = txt[m.end():m.end() + 80]
        d = None
        for i, (r, nome) in enumerate(SIGLAS):
            if re.match(r'\s*,?\s*(?:d[aoe]s?\s+)?(?:' + r + ')', resto, re.I): d = nome; fim = m.end(); break
        if not d:
            ml = re.match(r'\s*,?\s*(?:d[aoe]s?\s+)?' + LEIX, resto, re.I)
            if ml and not re.fullmatch(NUMLEI, ml.group(2)): d = _lei_rot(ml.group(1), ml.group(2), ml.group(3), ml.group(4))
            if ml: cobertos.append((m.end(), m.end() + ml.end()))
        if d:
            ref = fmtart(chave_art(m.group(1), m.group(2))) + re.sub(r'\s*,\s*', ', ', m.group(3))
            por.setdefault(d, [])
            if ref not in por[d]: por[d].append(ref)
    out = []
    for d, refs in por.items():
        pre = 'Arts. ' if len(refs) > 1 else 'Art. '
        liga = ' da ' if d.startswith(('Lei', 'LC')) and False else ' d' + ('a ' if d.startswith(('Lei', 'LC', 'CF', 'CLT', 'Constit')) else 'o ')
        out.append(f'{pre}{lista(refs)}{liga}{d}.')
    # leis citadas sem artigo
    for ml in LEI_RE.finditer(txt):
        if re.fullmatch(NUMLEI, ml.group(2)): continue
        if any(a0 <= ml.start() <= b0 for a0, b0 in cobertos): continue
        r = _lei_rot(ml.group(1), ml.group(2), ml.group(3), ml.group(4))
        if r not in gerais and all(r not in l for l in out): gerais.append(r)
    if gerais: out.append(lista(gerais) + '.')
    return out
def linhas_todas(a, an):
    return internas(a, an) + outras(a, an) + linhas(a, an)
def bloco(a, an):
    ls = internas(a, an) + outras(a, an) + linhas(a, an)
    return ''.join(f'<p class="rem"><span class="seta">▶</span> {html.escape(l)}</p>' for l in ls)
# a caixa vai depois do último item (inciso/§) do dispositivo-âncora
corpo = []
for i, (tp, t, a, an) in enumerate(itens):
    cls = {'art': 'art', 'par': 'par', 'inc': 'inc', 'est': 'est'}[tp]
    if tp == 'est' and len(t) < 120 and (t.isupper() or re.match(r'^(T[ÍI]TULO|CAP[ÍI]TULO|LIVRO|SE[ÇC][ÃA]O|PARTE)', t)): cls = 'tit'
    mr = re.match(r'^(Art\.?\s*\d+(?:\.\d{3})*\s*[º°o]?(?:-[A-Z])?\.?|§\s*\d+\s*[º°o]?|Parágrafo único\.?)(.*)$', t, re.S) if tp in ('art', 'par') else None
    corpo.append(f'<p class="{cls}"><span class="lbl">{html.escape(mr.group(1))}</span>{html.escape(mr.group(2))}</p>' if mr else f'<p class="{cls}">{html.escape(t)}</p>')
    prox = itens[i+1] if i+1 < len(itens) else None
    fim_ancora = a and (not prox or prox[3] != an or prox[2] != a or prox[0] in ('art', 'par'))
    if fim_ancora:
        corpo.append(bloco(a, an))
    if i == 1 and vinc.get(GERAL[0]):
        corpo.append(''.join(f'<p class="rem"><span class="seta">▶</span> {html.escape(l)}</p>' for l in ['Remissões gerais à lei:'] + linhas(*GERAL)))
# dados para o site: leis/vade/<id>.json  {"geral":[linhas], "art":{"85":{"c":[linhas],"§2":[linhas]}}}
site = {"nome": lei["nome"], "geral": linhas(*GERAL) if vinc.get(GERAL[0]) else [], "art": {}}
for tp, t, a, an in itens:
    if a and an and an not in site["art"].get(a, {}):
        ls = linhas_todas(a, an)
        if ls: site["art"].setdefault(a, {})[an] = ls
os.makedirs(f'{R}/leis/vade', exist_ok=True)
json.dump(site, open(f'{R}/leis/vade/{tid}.json', 'w'), ensure_ascii=False, separators=(',', ':'))
_ix = f'{R}/leis/vade/indice.json'
ix = json.load(open(_ix)) if os.path.exists(_ix) else {}
ix[tid] = {"nome": lei["nome"], "dispositivos": sum(len(v) for v in site["art"].values())}
json.dump(ix, open(_ix, 'w'), ensure_ascii=False, indent=1, sort_keys=True)
tot = sum(len(v) for d in vinc.values() for v in d.values())
nart = sum(1 for x in itens if x[0]=='art')
css = '''
:root{color-scheme:only light}
@page{size:130mm 190mm;margin:9mm 8mm 11mm 8mm}
html,body{background:#fff!important;color:#000!important}
body{font:8.4pt/1.17 "Helvetica Neue",Arial,sans-serif;margin:0 auto;padding:10px 12px;max-width:760px;-webkit-text-size-adjust:100%}
h1{font-size:13pt;text-align:center;color:#3b2260;margin:.4em 0 .8em;column-span:all}
p{margin:.12em 0;text-align:justify;hyphens:auto;-webkit-hyphens:auto}
.tit{font-weight:700;font-size:8pt;text-transform:uppercase;text-align:center;margin:.9em 0 .25em;color:#1f5aa6;break-after:avoid}
.art{margin-top:.45em}.inc{margin-left:.9em}.lbl{font-weight:700;color:#1f5aa6}
.rem{margin:.08em 0 .08em .2em;font-size:7.4pt;line-height:1.15;color:#222;text-align:left;break-inside:avoid}
.seta{color:#3b2260;font-size:.75em;margin-right:.25em}
@media print{body{max-width:none;padding:0;column-count:2;column-gap:7mm;column-rule:.3pt solid #bbb}}
@media (min-width:900px) and (hover:hover){body{column-count:2;column-gap:24px;max-width:1000px}}
'''
open(f'{R}/vade/saida/{tid}.html', 'w').write(
 f'<!doctype html><html lang="pt-BR"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="only light"><title>Vade Mecum Estuda Mana — {html.escape(lei["nome"])}</title><style>{css}</style>'
 f'<h1>{html.escape(lei["nome"])}</h1>' + '\n'.join(corpo))
json.dump({a: {an: l for an, l in d.items()} for a, d in vinc.items()}, open(f'{R}/vade/saida/{tid}-vinculos.json', 'w'), ensure_ascii=False, indent=1)
print(f'{nart} artigos, {len(vinc)} com remissões, {tot} remissões')
