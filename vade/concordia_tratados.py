#!/usr/bin/env python3
"""Levanta no Concórdia (Itamaraty) todos os atos internacionais do Brasil e guarda os que têm decreto de promulgação.
Saída: vade/tratados/concordia.json  (um registro por ato: id, título, tipo, vigência, decreto de promulgação, datas)
Uso: python3 vade/concordia_tratados.py     (~5 min; retoma de vade/tratados/concordia-fichas.cache.json)"""
import json, os, sys, time, urllib.request, concurrent.futures as cf
BASE = 'https://concordia.itamaraty.gov.br/ApiConcordia/Acordo/'
AQUI = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'tratados'); os.makedirs(AQUI, exist_ok=True)
CACHE = os.path.join(AQUI, 'concordia-fichas.cache.json')
UA = {'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 Safari/605.1.15', 'Content-Type': 'application/json'}
def req(url, corpo=None):
    for t in range(4):
        try:
            r = urllib.request.Request(url, data=json.dumps(corpo).encode() if corpo is not None else None, headers=UA)
            return json.load(urllib.request.urlopen(r, timeout=60))
        except Exception as e:
            time.sleep(1 + t * 2); err = e
    raise err
ids, pg, tp = [], 1, 1
while pg <= tp:
    r = req(BASE + 'pesquisa-avancada-acordos', {'TextoAcordo': '', 'TipoAcordo': '', 'Pagina': pg, 'TamanhoPagina': 500})
    tp = r['TotalPages']; ids += [(x['Id'], x['Titulo']) for x in r['Items']]; pg += 1
print(len(ids), 'atos listados', flush=True)
cache = json.load(open(CACHE)) if os.path.exists(CACHE) else {}
def ficha(i):
    f = req(BASE + f'ficha-acordo/{i[0]}')['acordo']
    keep = ['tipo', 'vigencia', 'internalizacao', 'decretoPromulgacao', 'dataDecretoPromulgacao', 'decExecNumero', 'decExecData',
            'decretoLegislativo', 'dataDecretoLegislativo', 'dataCelebracao', 'dataDOU', 'temTextoHtml', 'assuntos', 'dataDenuncia']
    return str(i[0]), {'id': i[0], 'titulo': i[1], **{k: f.get(k) for k in keep}}
falta = [i for i in ids if str(i[0]) not in cache]
with cf.ThreadPoolExecutor(8) as ex:
    for n, (k, v) in enumerate(ex.map(ficha, falta), 1):
        cache[k] = v
        if n % 1000 == 0: json.dump(cache, open(CACHE, 'w')); print(n, '/', len(falta), flush=True)
json.dump(cache, open(CACHE, 'w'))
out = [v for v in cache.values() if v.get('decretoPromulgacao') or v.get('decExecNumero')]
json.dump(out, open(os.path.join(AQUI, 'concordia.json'), 'w'), ensure_ascii=False, indent=0)
print(len(cache), 'fichas;', len(out), 'com decreto de promulgação/execução')
