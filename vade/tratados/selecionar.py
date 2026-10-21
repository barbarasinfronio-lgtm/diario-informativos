"""Seleção final de tratados: (1) sumário do vade internacional (prints), (2) lista do CNJ, (3) citados expressamente nas decisões do site."""
import json, re, unicodedata, sys
S = '/private/tmp/claude-501/-Users-barbarasinfronio-EstudaMana/9c85476a-a43b-4ca6-a17d-78609e03a36b/scratchpad/'
fich = {v['id']: v for v in json.load(open('concordia-fichas.cache.json')).values()}
cas = json.load(open('casamento-sumario.json'))
DESCARTAR = ('Pacto da Sociedade das Nações','Convenção 156 da OIT','Convenção Interamericana sobre a Proteção dos Direitos Humanos dos Idosos',
             'Convenção Internacional sobre a Proteção dos Direitos de Todos os Trabalhadores','Convenção de Viena sobre o Direito dos Tratados entre Estados e Organizações',
             'Protocolo ao Tratado de Proibição Completa')
OVER = {'Carta das Nações Unidas': 8062, 'Estatuto da Corte Internacional de Justiça': 8062, 'Convenção 29 da OIT': 7888, 'Protocolo de Genebra': 7824,
        'Protocolo de Manágua': 10308, 'Tratado de Proibição Completa dos Testes Nucleares': 10627, 'Convênio Constitutivo do Fundo Monetário': 8050}
sel = {}   # id concordia -> {origem:[...], ...}
nao_tratado, sem_decreto, descartados = [], [], []
for x in cas:
    if x['tipo'] != 'T': nao_tratado.append(x); continue
    if x['titulo'].startswith(DESCARTAR): descartados.append(x['titulo']); continue
    i = next((v for k, v in OVER.items() if x['titulo'].startswith(k)), None) or (x['achado'][0][1] if x['achado'] and x['achado'][0][0] >= 0.45 else None)
    if i is None: sem_decreto.append(x['titulo']); continue
    sel.setdefault(i, {'origem': []})['origem'].append('vade-internacional')
sel.setdefault(11614, {'origem': []})['origem'].append('lista-cnj')
# ---- decisões do site ----
norm = lambda s: re.sub(r'[^a-z0-9 ]+', ' ', unicodedata.normalize('NFKD', s).encode('ascii','ignore').decode().lower())
textos = [d['texto'] for d in json.load(open(S + 'decisoes.json'))]
di = json.load(open('/Users/barbarasinfronio/EstudaMana/wt-leis/curadoria/decisoes-informativos.json'))
textos += [(v.get('texto') or '') + ' ' + json.dumps(v.get('card') or '', ensure_ascii=False) for v in di.values()]
blob = norm(' \n '.join(textos)); print(len(textos), 'decisões lidas')
VIG = {'vigor-interno','vigor-intl','ratificado-br','especial','efeito-declaratorio'}
cit = {}
dec_re = re.compile(r'Decreto\s*(?:n[ºo°.]*\s*)?(\d{1,3}(?:\.\d{3})+|\d{3,5})\s*(?:/\s*|,\s*de\s+(?:\d{1,2}\s*(?:º|o)?\s*de\s+\w+\s+de\s+)?)(\d{4}|\d{2})\b', re.I)
dec_citados = set()
for t in textos:
    for m in dec_re.finditer(t):
        a = m.group(2); a = a if len(a) == 4 else ('19' if int(a) > 30 else '20') + a
        dec_citados.add(m.group(1).replace('.', '') + '/' + a)
for v in fich.values():
    if v['vigencia'] not in VIG or not v.get('decretoPromulgacao') or v['id'] in sel: continue
    k = re.sub(r'\D', '', str(v['decretoPromulgacao'])) + '/' + (v['dataDecretoPromulgacao'] or '')[:4]
    por = None
    if k in dec_citados: por = 'decreto ' + k
    else:
        nome = norm(re.sub(r'\(.*?\)|\bDec\.?.*$|\bDecis[ãa]o.*$', ' ', v['titulo'])).strip()
        if len(nome.split()) >= 4 and re.match(r'(convencao|pacto|protocolo|tratado|acordo|estatuto|declaracao)', nome) and (' ' + nome + ' ') in (' ' + blob + ' '):
            por = 'nome'
    if por: cit[v['id']] = por
print(len(sel), 'selecionados (sumário+CNJ);', len(cit), 'adicionais citados em decisões;', len(nao_tratado), 'não-tratados;', len(sem_decreto), 'sem decreto;', len(descartados), 'descartados')
for i, por in cit.items(): sel.setdefault(i, {'origem': []})['origem'].append('citado-em-decisao (' + por + ')')
out = {'selecionados': {str(i): {**o, 'titulo': fich[i]['titulo'], 'decreto': str(fich[i].get('decretoPromulgacao')) + '/' + (fich[i].get('dataDecretoPromulgacao') or '')[:4], 'vigencia': fich[i]['vigencia']} for i, o in sel.items()},
       'nao_tratados': [(x['secao'], x['titulo'], x['ano'], x['tipo']) for x in nao_tratado], 'sem_decreto': sem_decreto, 'descartados': descartados}
json.dump(out, open('selecao.json', 'w'), ensure_ascii=False, indent=1)
print('\nSEM DECRETO:', sem_decreto); print('DESCARTADOS:', descartados)
print('\nCITADOS EM DECISÕES (amostra):')
for i, por in list(cit.items())[:60]: print('  ', fich[i]['titulo'][:70], '|', por)
