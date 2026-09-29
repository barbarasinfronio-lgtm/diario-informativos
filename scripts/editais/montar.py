"""montar.py — acrescenta editais mapeados ao editais-data.js.

uso: python3 montar.py <pasta-das-saidas> <itens.json>
itens.json: [{"nome": "tjac", "id": ..., "sigla": ..., "cargo": ..., "orgao": ..., "titulo": ..., "edital": ...,
              "carreira": "carreira-magistratura-estadual" (opcional), "corrigir": {"errado": "certo"} (opcional)}]
Lê <pasta>/<nome>-saida.json (mapear.js) e <nome>-entrada.json (grupos). Corrige erros de digitação dos
editais (CORRIGIR + "corrigir" do item). "grupos" no item substitui os grupos achados: se a forma certa está no Diário de Leis, vai para "leis".
"""
import json, re, sys, os

REPO = os.path.join(os.path.dirname(__file__), '..', '..')
CORRIGIR = {  # erros de digitação vistos em editais oficiais
  'Lei nº 6.015/1978': 'Lei nº 6.015/1973', 'Lei nº 911/1969': 'Decreto-Lei nº 911/1969',
  'Lei nº 3.365/1941': 'Decreto-Lei nº 3.365/1941', 'Lei nº 13.303/2006': 'Lei nº 13.303/2016',
  'Lei nº 16.105/2015': 'Lei nº 13.105/2015', 'Lei nº 9.985/2005': None,
  'Lei nº 11.343/2016': 'Lei nº 11.343/2006', 'Lei nº 11.340/2016': 'Lei nº 11.340/2006',
  'Lei nº 9.565/1998': 'Lei nº 9.656/1998', 'Lei nº 15.343/2006': 'Lei nº 11.343/2006',
  'Lei nº 16.869/2019': 'Lei nº 13.869/2019', 'Lei nº 9.513/1997': 'Lei nº 9.503/1997',
  'Lei nº 3.688/1941': 'Decreto-Lei nº 3.688/1941', 'Lei nº 11.340/2003': 'Lei nº 11.340/2006',
  'Lei nº 13.964/2023': 'Lei nº 13.964/2019', 'Lei nº 9.099/2015': 'Lei nº 9.099/1995',
  'Lei nº 1.060/1959': 'Lei nº 1.060/1950',
}
HUMANISTICA = {'Sociologia do Direito', 'Psicologia Judiciária', 'Ética e Estatuto Jurídico da Magistratura Nacional',
               'Filosofia do Direito', 'Teoria Geral do Direito e da Política'}
BLOCOS_CNJ = [  # Resolução CNJ nº 75/2009
  ('Bloco I', ['civil', 'processual civil', 'consumidor', 'criança']),
  ('Bloco II', ['penal', 'processual penal', 'constitucional', 'eleitoral']),
  ('Bloco III', ['empresarial', 'tributário', 'ambiental', 'administrativo', 'noções gerais']),
]

def indice_leis():
    s = open(os.path.join(REPO, 'leis-data.js'), encoding='utf-8').read()
    idx = {}
    mat = None
    for linha in s.split('\n'):
        m = re.match(r'\s*([a-z_]+): \{ label:', linha)
        if m: mat = m.group(1)
        n = re.search(r'numero: "([^"]+)"', linha)
        if n and mat: idx.setdefault(n.group(1), mat)
    return idx

def blocos(grupos):
    if len(grupos) != 1: return grupos
    ds = grupos[0]['disciplinas']
    def bloco(d):
        low = d.lower()
        for nome, chaves in BLOCOS_CNJ:
            for c in chaves:
                if c in low and not ('processual' in low and 'processual' not in c): return nome
        return None
    if not all(bloco(d) for d in ds): return grupos
    return [{'nome': n, 'disciplinas': [d for d in ds if bloco(d) == n]} for n, _ in BLOCOS_CNJ if any(bloco(d) == n for d in ds)]

def dump(e):
    out = []
    for k, v in e.items():
        if k == 'leis':
            out.append('  "leis": [\n' + ',\n'.join('    ' + json.dumps(p, ensure_ascii=False) for p in v) + '\n  ]')
        elif k == 'grupos':
            out.append('  "grupos": [\n' + ',\n'.join('    { "nome": %s, "disciplinas": %s }' % (json.dumps(g['nome'], ensure_ascii=False), json.dumps(g['disciplinas'], ensure_ascii=False)) for g in v) + '\n  ]')
        else:
            out.append('  ' + json.dumps(k) + ': ' + json.dumps(v, ensure_ascii=False))
    return ' {\n' + ',\n'.join(out) + '\n }'

def main(pasta, itens_path):
    idx = indice_leis()
    itens = json.load(open(itens_path, encoding='utf-8'))
    p = os.path.join(REPO, 'editais-data.js')
    s = open(p, encoding='utf-8').read()
    novos = []
    for it in itens:
        sai = json.load(open(os.path.join(pasta, it['nome'] + '-saida.json'), encoding='utf-8'))
        ent_p = os.path.join(pasta, it['nome'] + '-entrada.json')
        grupos = it.get('grupos') or sai.get('grupos') or json.load(open(ent_p, encoding='utf-8')).get('grupos') or []
        for g in grupos:
            if any('Formação Humanística' in d for d in g['disciplinas']):
                g['disciplinas'] = [d for d in g['disciplinas'] if d not in HUMANISTICA]
        grupos = blocos([g for g in grupos if g['disciplinas']])
        leis = list(sai['leis']); tem = {l[1] for l in leis}; extras = []
        fix = dict(CORRIGIR); fix.update(it.get('corrigir', {}))
        for x in sai['extras']:
            if x in fix:
                c = fix[x]
                if c is None: continue
                if c in idx:
                    if c not in tem: leis.append([idx[c], c]); tem.add(c)
                    continue
                x = c
            if x not in extras: extras.append(x)
        e = {k: it[k] for k in ('id', 'sigla', 'cargo', 'orgao', 'titulo', 'edital')}
        e.update({'grupos': grupos, 'leis': leis})
        if extras: e['extras'] = extras
        e['tipo'] = 'edital'
        if re.search(r'"id": "%s"' % re.escape(e['id']), s): raise SystemExit('já existe: ' + e['id'])
        novos.append((e, it.get('carreira')))
        print('%-8s %3d leis  %2d fora  %s' % (e['sigla'], len(leis), len(extras), [g['nome'] for g in grupos]))
    i = s.index('var EDITAIS_DATA = [\n'); j = s.index('\n];', i)
    s = s[:j] + ',\n' + ',\n'.join(dump(e) for e, _ in novos) + s[j:]
    for e, car in novos:
        if not car: continue
        m = re.search(r'("id": "' + car + r'".*?"editais": )(\[.*?\])', s, re.S)
        lst = json.loads(m.group(2)); lst.append(e['id'])
        s = s[:m.start(2)] + json.dumps(lst, ensure_ascii=False) + s[m.end(2):]
    open(p, 'w', encoding='utf-8').write(s)

if __name__ == '__main__':
    main(sys.argv[1], sys.argv[2])
