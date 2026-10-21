#!/usr/bin/env python3
"""Baixa o texto dos decretos que promulgam tratados (lista: vade/tratados/concordia.json) e cadastra em leis/tratados.json.
1) Planalto, pelo mesmo leitor do robô de leis (scripts/leis_citadas.py), com endereços ordenados por ano;
2) se o Planalto não tiver, o texto integral em HTML do próprio Concórdia (Itamaraty).
Uso: python3 vade/baixar_tratados.py [--max N] [--so-vigentes] [--tema nome|registro|...]   (retoma de onde parou)"""
import argparse, concurrent.futures as cf, html, json, re, sys, time, urllib.request
from pathlib import Path
RAIZ = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(RAIZ / 'scripts'))
import leis_citadas as lc  # noqa: E402
robo = lc.robo
CONC = json.load(open(RAIZ / 'vade/tratados/concordia.json'))
REG = RAIZ / 'leis/tratados.json'
reg = json.load(open(REG)) if REG.exists() else {'tratados': {}, 'falhas': {}}
VIGENTES = {'vigor-interno', 'vigor-intl', 'ratificado-br', 'especial', 'efeito-declaratorio'}

def ordenar(urls, a):
    """põe primeiro os endereços da pasta provável do ano"""
    pref = []
    for i, j in [(2004, 2006), (2007, 2010), (2011, 2014), (2015, 2018), (2019, 2022), (2023, 2026)]:
        if i <= a <= j: pref = [f'_ato{i}-{j}/{a}/decreto/']
    if 2000 <= a <= 2003: pref = [f'decreto/{a}/']
    if 1990 <= a <= 1994: pref = ['decreto/1990-1994/', 'decreto/']
    if 1995 <= a <= 1999: pref = ['decreto/']
    if 1980 <= a <= 1989: pref = ['decreto/1980-1989/', 'decreto/1980-1988/', 'decreto/']
    return sorted(urls, key=lambda u: 0 if any(p in u for p in pref) else 1)
lc.__dict__['_enderecos_orig'] = lc.enderecos
def enderecos(tipo, n, ano):
    base = lc._enderecos_orig(tipo, n, ano)
    extra = []
    for u in base:      # decretos com número curto aparecem com zeros à esquerda (d0350.htm, D1355.htm…)
        m = re.search(r'/([dD])(\d+)(\.htm)$', u)
        if m and len(m.group(2)) < 4: extra += [u[:m.start(2)] + m.group(2).zfill(4) + m.group(3)]
    pastas = ['decreto/1990-1994/', 'decreto/1995-1999/', 'decreto/1980-1989/', 'decreto/1930-1949/', 'decreto/']
    for pa in pastas:
        for pre in ('d', 'D'):
            extra += [f'https://www.planalto.gov.br/ccivil_03/{pa}{pre}{int(n):04d}.htm', f'https://www.planalto.gov.br/ccivil_03/{pa}{pre}{int(n)}.htm']
    return ordenar(list(dict.fromkeys(extra + base)), int(ano))[:30]
lc.enderecos = enderecos

def concordia_html(i):
    r = urllib.request.Request(f'https://concordia.itamaraty.gov.br/ApiConcordia/Acordo/integra-acordo-html/{i}', headers={'User-Agent': 'Mozilla/5.0'})
    h = urllib.request.urlopen(r, timeout=60).read().decode('utf8', 'replace')
    h = re.sub(r'(?is)<(script|style)\b.*?</\1>', '', h)
    h = re.sub(r'(?i)<br\s*/?>|</(p|div|tr|li|h[1-6])>', '\n', h)
    t = html.unescape(re.sub(r'<[^>]+>', '', h)).replace('\xa0', ' ')
    return [re.sub(r'\s+', ' ', l).strip() for l in t.split('\n') if len(l.strip()) > 1]

def um(d):
    n = re.sub(r'\D', '', str(d['decretoPromulgacao'] or d['decExecNumero']))
    ano = (d['dataDecretoPromulgacao'] or d['decExecData'] or '')[:4]
    if not n or not ano: return None
    chave = f'{n}/{ano}'
    if chave in reg['tratados']: return None
    numero = f'Decreto nº {lc.com_ponto(n)}/{ano}'
    if lc.ja_no_acervo if False else False: pass
    url = None
    for u in lc._enderecos_orig('decreto', n, ano):      # texto que já existe no acervo: não busca nem regrava
        if (RAIZ / 'leis/texto' / f'{robo.id_texto(u)}.json').exists(): url = u; break
    try:
        if url: raise StopIteration
        url, _ = lc.buscar_lei('decreto', n, ano, robo.hoje()) if int(ano) >= 1930 else (None, False)
    except StopIteration:
        pass
    except Exception as e:  # noqa: BLE001
        pass
    fonte = 'planalto'
    if not url and d.get('temTextoHtml'):
        try:
            p = concordia_html(d['id'])
            if len(p) > 5:
                url = f'https://concordia.itamaraty.gov.br/acordos/{d["id"]}'
                (RAIZ / 'leis/texto').mkdir(exist_ok=True, parents=True)
                tid = 'tratado-concordia-' + str(d['id'])
                json.dump({'nome': d['titulo'], 'url': url, 'em': robo.hoje(), 'p': p}, open(RAIZ / f'leis/texto/{tid}.json', 'w'), ensure_ascii=False)
                fonte = 'concordia'
        except Exception:  # noqa: BLE001
            pass
    return chave, ({'numero': numero, 'nome': d['titulo'], 'link': url, 'fonte': fonte, 'concordia': d['id'], 'vigencia': d['vigencia'],
                    'tipo': d['tipo'], 'celebracao': d['dataCelebracao']} if url else None), d

def main():
    ap = argparse.ArgumentParser(); ap.add_argument('--max', type=int, default=10**9); ap.add_argument('--so-vigentes', action='store_true')
    ap.add_argument('--threads', type=int, default=3); ap.add_argument('--selecao', help='selecao.json: só os ids do Concórdia selecionados')
    a = ap.parse_args()
    lista = [d for d in CONC if (not a.so_vigentes or d['vigencia'] in VIGENTES)]
    if a.selecao:
        ids = set(int(i) for i in json.load(open(a.selecao))['selecionados'])
        lista = [d for d in lista if d['id'] in ids]
    feitos = 0
    with cf.ThreadPoolExecutor(a.threads) as ex:
        for r in ex.map(um, lista[:a.max]):
            if not r: continue
            chave, ent, d = r
            if ent: reg['tratados'][chave] = ent
            else: reg['falhas'][chave] = {'titulo': d['titulo'], 'concordia': d['id']}
            feitos += 1
            if feitos % 25 == 0:
                json.dump(reg, open(REG, 'w'), ensure_ascii=False, indent=0); print(feitos, len(reg['tratados']), 'ok', len(reg['falhas']), 'falhas', flush=True)
    json.dump(reg, open(REG, 'w'), ensure_ascii=False, indent=0)
    print('fim:', len(reg['tratados']), 'ok;', len(reg['falhas']), 'falhas')
main()
