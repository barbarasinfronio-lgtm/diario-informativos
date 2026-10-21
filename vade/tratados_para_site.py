#!/usr/bin/env python3
"""Gera leis/tratados-no-diario.json: os tratados baixados (leis/tratados.json) agrupados por assunto (Concórdia),
no formato que o Diário de Leis lê (leis-logic.js → carregarPedidas). Só entram tratados que têm texto em leis/texto.
Também renomeia textos de origem Concórdia para o nome que o site calcula a partir do link (robo.id_texto)."""
import json, re, sys, unicodedata
from pathlib import Path
RAIZ = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(RAIZ / 'scripts'))
import atualizar_informativos as robo  # noqa: E402
reg = json.load(open(RAIZ / 'leis/tratados.json'))['tratados']
conc = {c['id']: c for c in json.load(open(RAIZ / 'vade/tratados/concordia.json'))}
slug = lambda s: re.sub(r'[^a-z0-9]+', '_', unicodedata.normalize('NFKD', s).encode('ascii', 'ignore').decode().lower()).strip('_')
vistos = set(); grupos = {}; sem_texto = 0; ja_no_site = 0
LEIS_DATA = (RAIZ / 'site/leis/leis-data.js').read_text(encoding='utf-8')
for chave, t in sorted(reg.items(), key=lambda kv: (kv[1]['celebracao'] or '', kv[0]), reverse=True):
    if t['concordia'] in vistos: continue
    if f'numero: "{t["numero"]}"' in LEIS_DATA: ja_no_site += 1; continue      # já está no Diário
    vistos.add(t['concordia'])
    antigo = RAIZ / f'leis/texto/tratado-concordia-{t["concordia"]}.json'
    novo = RAIZ / f'leis/texto/{robo.id_texto(t["link"])}.json'
    if antigo.exists() and not novo.exists(): antigo.rename(novo)
    if not novo.exists(): sem_texto += 1; continue
    assuntos = (conc.get(t['concordia'], {}).get('assuntos') or ['Outros'])
    a = assuntos[0] if isinstance(assuntos[0], str) else 'Outros'
    g = grupos.setdefault('tratados_' + slug(a), {'label': 'Tratados e convenções — ' + a, 'leis': []})
    g['leis'].append({'nome': t['nome'], 'numero': t['numero'], 'link': t['link']})
extra = RAIZ / 'vade/tratados/leis-brasileiras-sumario.json'
if extra.exists():
    grupos['tratados_legislacao_brasileira'] = {'label': 'Direito internacional — legislação brasileira correlata', 'leis': json.load(open(extra))}
# normas internacionais sem decreto (soft law do CNJ e declarações do sumário): só as que têm texto gravado
for arq, chave, rotulo in (('softlaw.json', 'normas_internacionais_cnj', 'Normas internacionais — instrumentos do CNJ'),
                           ('softlaw-declaracoes.json', 'declaracoes_internacionais', 'Declarações e normas internacionais'),
                           ('softlaw-declaracoes2.json', 'declaracoes_internacionais', None), ('softlaw-declaracoes3.json', 'declaracoes_internacionais', None),
                           ('softlaw-declaracoes4.json', 'declaracoes_internacionais', None), ('softlaw-declaracoes5.json', 'declaracoes_internacionais', None),
                           ('softlaw-declaracoes6.json', 'tratados_complementares', 'Tratados e convenções — outros (texto da Câmara dos Deputados)')):
    f = RAIZ / 'vade/tratados' / arq
    if not f.exists(): continue
    g = grupos.setdefault(chave, {'label': rotulo or 'Declarações e normas internacionais', 'leis': []})
    for it in json.load(open(f)):
        if (RAIZ / f'leis/texto/{robo.id_texto(it["link"])}.json').exists() and not any(x['link'] == it['link'] for x in g['leis']) and it['link'] not in LEIS_DATA:
            g['leis'].append({'nome': it['nome'], 'numero': it['numero'], 'link': it['link']})
json.dump({'grupos': grupos}, open(RAIZ / 'leis/tratados-no-diario.json', 'w'), ensure_ascii=False, indent=0)
print({k: len(v['leis']) for k, v in grupos.items()}, '| sem texto:', sem_texto, '| já estavam no Diário:', ja_no_site)
