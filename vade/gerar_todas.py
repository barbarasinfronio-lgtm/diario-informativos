#!/usr/bin/env python3
"""Vade mecum para todas as leis federais do Diário de Leis (Lei, Lei Complementar, Decreto-Lei, Decreto).

  python3 vade/gerar_todas.py            # cria vade/curadoria/<id>.json (automático) para quem não tem e roda o gerador em paralelo
  python3 vade/gerar_todas.py --so-curadoria

A curadoria manual (arquivo existente sem "auto": true) nunca é sobrescrita. Leis estaduais ficam de fora por enquanto:
as súmulas/atos que citam "Lei Estadual nº X" não dizem de que Estado, então exigem cruzar com o tribunal local.
"""
import json, os, re, subprocess, sys, glob
from concurrent.futures import ThreadPoolExecutor
R = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
sys.path.insert(0, f'{R}/scripts')
import atualizar_informativos as robo

JS = """const fs=require('fs');global.window=global;
(0,eval)(fs.readFileSync('site/leis/leis-data.js','utf8').replace(/^(var|const|let) (\\w+) =/mg,'globalThis.$2 ='));
const d=globalThis.LEIS_DATA||{};let o=[];for(const k in d){for(const l of (d[k].leis||[])) o.push([l.nome,l.numero,l.link||'',l.textoId||''])}
console.log(JSON.stringify(o))"""
RX = re.compile(r'^(Lei Complementar|Lei|Decreto-Lei|Decreto)\s+n[º°o]?\s*([\d.]+)(?:\s*/\s*(\d{4}))?', re.I)

def regex_num(n):
    return re.escape(n).replace('\\.', '\\.')

def curadoria(tipo, num, ano, nome):
    n = regex_num(num)
    t = tipo.lower()
    sufixo = r'(?:\s*/\s*(?:19|20)?\d\d|\s*,\s*de\s+(?:\d{1,2}\S*\s+de\s+\w+\s+de\s+)?\d{4})?'
    if t == 'lei':
        return {"numero_regex": n, "aliases": [], "deste": "desta Lei"}
    if t == 'lei complementar':
        return {"numero_regex": n, "sem_base": True, "aliases": [r'Lei\s+Complementar\s*(?:n[º°o.]*)?\s*' + n + sufixo, r'\bLC\s*(?:n[º°o.]*)?\s*' + n + sufixo], "deste": "desta Lei Complementar"}
    if t == 'decreto-lei':
        return {"numero_regex": n, "sem_base": True, "aliases": [r'Decreto-Lei\s*(?:n[º°o.]*)?\s*' + n + sufixo], "deste": "deste Decreto-Lei"}
    # Decreto: o número recomeça todo ano — só vale citação com o ano
    a2 = ano[-2:]
    return {"numero_regex": n, "sem_base": True,
            "aliases": [r'Decreto\s*(?:n[º°o.]*)?\s*' + n + r'(?:\s*/\s*(?:' + ano + '|' + a2 + r')|\s*,\s*de\s+(?:\d{1,2}\S*\s+de\s+\w+\s+de\s+)?' + ano + ')'], "deste": "deste Decreto"}

RX_UF = re.compile(r'^(Lei Complementar|Lei Estadual|Lei Ordin[áa]ria|Lei|Decreto Estadual|Decreto Distrital|Decreto)\s*(?:Estadual|Distrital)?\s*\(([A-Z]{2})\)\s*n[º°o]?\s*([\d.]+)(?:\s*/\s*(\d{4}))?', re.I)

def curadoria_uf(tipo, uf, num, ano):
    n = regex_num(num); a2 = ano[-2:]
    anoRx = r'(?:\s*/\s*(?:' + ano + '|' + a2 + r')|\s*,\s*de\s+(?:\d{1,2}\S*\s+de\s+\w+\s+de\s+)?' + ano + ')'
    t = tipo.lower()
    if t == 'lei complementar': pref, deste = r'(?:Lei\s+Complementar(?:\s+Estadual|\s+Distrital)?|LC)', 'desta Lei Complementar'
    elif t.startswith('decreto'): pref, deste = r'Decreto(?:\s+Estadual|\s+Distrital)?', 'deste Decreto'
    else: pref, deste = r'Lei(?:\s+Estadual|\s+Ordin[áa]ria|\s+Distrital)?', 'desta Lei'
    return {"numero_regex": n, "sem_base": True, "uf": uf, "aliases": [pref + r'\s*(?:n[º°o.]*)?\s*' + n + anoRx], "deste": deste}

def main():
    L = json.loads(subprocess.check_output(['node', '-e', JS], text=True, cwd=R))
    for f in ('dos-editais', 'pedidas'):
        try:
            for x in json.load(open(f'{R}/leis/{f}.json')).get('leis', []): L.append([x.get('nome', ''), x.get('numero', ''), x.get('link', ''), x.get('textoId', '')])
        except OSError: pass
    feitos = {}
    for nome, numero, link, tid in L:
        me = RX_UF.match(numero or '')
        if me and 'planalto.gov.br' not in (link or ''):       # lei/decreto estadual: só cruza com as fontes do tribunal do mesmo Estado
            i = tid or (robo.id_texto(link) if link else '')
            if not i or not os.path.exists(f'{R}/leis/texto/{i}.json'): continue
            tipo, uf, num, ano = me.group(1), me.group(2), me.group(3), me.group(4) or ''
            if not ano: continue
            f = f'{R}/vade/curadoria/{i}.json'
            if os.path.exists(f) and not json.load(open(f)).get('auto'): continue
            c = curadoria_uf(tipo, uf, num, ano); c.update({"vinculos": {}, "excluir": [], "auto": True})
            json.dump(c, open(f, 'w'), ensure_ascii=False, indent=1)
            feitos[i] = nome
            continue
        m = RX.match(numero or '')
        if not m or 'estadual' in (numero or '').lower() or 'planalto.gov.br' not in (link or ''): continue   # só federais (Planalto)
        i = tid or (robo.id_texto(link) if link else '')
        if not i or not os.path.exists(f'{R}/leis/texto/{i}.json'): continue
        tipo, num, ano = m.group(1), m.group(2), m.group(3) or ''
        if tipo.lower() == 'decreto' and not ano: continue
        f = f'{R}/vade/curadoria/{i}.json'
        if os.path.exists(f) and not json.load(open(f)).get('auto'): continue
        c = curadoria(tipo, num, ano, nome); c.update({"vinculos": {}, "excluir": [], "auto": True})
        json.dump(c, open(f, 'w'), ensure_ascii=False, indent=1)
        feitos[i] = nome
    # atos do CNJ lidos no site (leis/cnj-atos.json): citados como "Resolução 225/2016" (o ano é obrigatório: o número recomeça todo ano)
    try:
        for x in json.load(open(f'{R}/leis/cnj-atos.json')).get('leis', []):
            m = re.match(r'^(.+?) CNJ nº ([\d.]+)/(\d{4})$', x['numero'])
            if not m: continue
            tipo, num, ano = m.groups(); i = x['textoId']
            if not os.path.exists(f'{R}/leis/texto/{i}.json'): continue
            f = f'{R}/vade/curadoria/{i}.json'
            if os.path.exists(f) and not json.load(open(f)).get('auto'): continue
            n = regex_num(num); a2 = ano[-2:]
            tp = r'\s+'.join(re.escape(w) for w in tipo.split())
            feminino = tipo.split()[0] != 'Provimento' and tipo.split()[0] != 'Enunciado'
            c = {"numero_regex": n, "sem_base": True, "cnj": True,
                 "aliases": [tp + r'(?:\s+(?:do\s+)?CNJ)?\s*(?:n[º°o.]*)?\s*' + n + r'(?:\s*/\s*(?:' + ano + '|' + a2 + r')|\s*,\s*de\s+(?:\d{1,2}\S*\s+de\s+\w+\s+de\s+)?' + ano + ')'],
                 "deste": ("desta " if feminino else "deste ") + tipo.split()[0] if tipo.split()[0] != 'Enunciado' else "deste Enunciado"}
            c.update({"vinculos": {}, "excluir": [], "auto": True})
            json.dump(c, open(f, 'w'), ensure_ascii=False, indent=1)
            feitos[i] = x['nome']
    except OSError: pass
    print(len(feitos), 'leis com curadoria automática')
    if '--so-curadoria' in sys.argv: return
    ids = sorted(os.path.basename(f)[:-5] for f in glob.glob(f'{R}/vade/curadoria/*.json'))
    env = dict(os.environ, VADE_SO_SITE='1')
    def roda(i):
        r = subprocess.run([sys.executable, f'{R}/vade/gerar_vade.py', i], capture_output=True, text=True, env=env)
        return i, (r.stdout.strip().splitlines() or [''])[-1], r.returncode, r.stderr[-200:]
    with ThreadPoolExecutor(4) as ex:
        res = list(ex.map(roda, ids))
    erros = [r for r in res if r[2]]
    for i, _, _, e in erros[:20]: print('ERRO', i, e.strip().splitlines()[-1:] )
    ix = {}
    for f in glob.glob(f'{R}/leis/vade/*.json'):
        i = os.path.basename(f)[:-5]
        if i == 'indice': continue
        d = json.load(open(f)); ix[i] = {"nome": d.get('nome', ''), "dispositivos": sum(len(v) for v in d['art'].values())}
    json.dump(ix, open(f'{R}/leis/vade/indice.json', 'w'), ensure_ascii=False, indent=1, sort_keys=True)
    print(len(ids), 'leis processadas;', len(ix), 'com remissões;', len(erros), 'erros')

main()
