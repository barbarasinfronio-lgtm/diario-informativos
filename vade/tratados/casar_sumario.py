import json, re, unicodedata
exec(open('sumario-vade-internacional.py').read())
C = json.load(open('concordia.json'))
norm = lambda s: re.sub(r'[^a-z0-9 ]+', ' ', unicodedata.normalize('NFKD', s).encode('ascii','ignore').decode().lower())
STOP = set('de da do das dos e o a os as sobre em para ao aos na no nas nos com ou por entre que um uma seu sua se republica federativa brasil governo'.split())
tok = lambda s: {t for t in norm(s).split() if t not in STOP and len(t) > 1}
for c in C: c['_t'] = tok(c['titulo']); c['_ano'] = int((c.get('dataCelebracao') or '0000')[:4] or 0)
VIG = {'vigor-interno','vigor-intl','ratificado-br','especial','efeito-declaratorio'}
out = []
for sec_, tit, ano, tp in S:
    if tp != 'T': out.append({'secao':sec_,'titulo':tit,'ano':ano,'tipo':tp,'achado':None}); continue
    t = tok(tit); best = []
    m = re.match(r'Convenção (\d+) da OIT', tit)
    for c in C:
        if m:
            ok = re.search(r'Conven[çc][ãa]o\s*(?:n[ºo°.]*\s*)?'+m.group(1)+r'\b', c['titulo']) and 'OIT' in c['titulo'].upper()+' OIT'
            sc = 1.0 if ok else 0
        else:
            inter = len(t & c['_t']); sc = inter / max(1, len(t | c['_t']))
            sc += 0.15 if abs(c['_ano'] - ano) <= 1 else 0
            pre = lambda x: re.match(r'(?i)\s*(emendas?|protocolo|acordo|ajuste|memorando)', x)
            if pre(c['titulo']) and not pre(tit): sc -= 0.35
            if pre(tit) and not pre(c['titulo']): sc -= 0.2
            if re.match(r'(?i)\s*emendas?', c['titulo']): sc -= 0.2
        if sc > 0: best.append((sc + (0.05 if c['vigencia'] in VIG else 0), c))
    best.sort(key=lambda x: -x[0])
    out.append({'secao':sec_,'titulo':tit,'ano':ano,'tipo':tp,'achado':[(round(s,2), c['id'], c['titulo'][:90], c['vigencia'], str(c['decretoPromulgacao']) + '/' + (c['dataDecretoPromulgacao'] or '')[:4]) for s, c in best[:3]]})
json.dump(out, open('casamento-sumario.json','w'), ensure_ascii=False, indent=1)
alto = [o for o in out if o['achado'] and o['achado'][0][0] >= 0.6]
medio = [o for o in out if o['achado'] and 0.35 <= o['achado'][0][0] < 0.6]
baixo = [o for o in out if o['tipo']=='T' and (not o['achado'] or o['achado'][0][0] < 0.35)]
print(len(out), 'itens;', len(alto), 'alta confiança;', len(medio), 'média;', len(baixo), 'sem par')
print('\n== MÉDIA / SEM PAR'); 
for o in medio + baixo: print('-', o['titulo'][:80], o['ano'], '=>', (o['achado'][0][2][:70], o['achado'][0][0], o['achado'][0][3], o['achado'][0][4]) if o['achado'] else None)
