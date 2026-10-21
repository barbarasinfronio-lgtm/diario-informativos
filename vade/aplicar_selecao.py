#!/usr/bin/env python3
"""Mantém em leis/tratados.json e leis/texto só os tratados de vade/tratados/selecao.json; apaga os textos baixados a mais
(só arquivos novos, que o git ainda não conhece — nada do acervo anterior é tocado)."""
import json, re, subprocess, sys
from pathlib import Path
RAIZ = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(RAIZ / 'scripts'))
import atualizar_informativos as robo  # noqa: E402
sel = json.load(open(RAIZ / 'vade/tratados/selecao.json'))['selecionados']
manter = {re.sub(r'\D', '', v['decreto'].split('/')[0]) + '/' + v['decreto'].split('/')[1] for v in sel.values() if v['decreto'] != 'None/'}
manter_ids = {int(i) for i in sel}
reg = json.load(open(RAIZ / 'leis/tratados.json'))
rastreados = set(subprocess.run(['git', 'ls-files', 'leis/texto'], cwd=RAIZ, capture_output=True, text=True).stdout.split('\n'))
apagados = mantidos = 0
for k in list(reg['tratados']):
    t = reg['tratados'][k]
    if k in manter or t['concordia'] in manter_ids: mantidos += 1; continue
    if t.get('link'):
        f = f'leis/texto/{robo.id_texto(t["link"])}.json'
        if f not in rastreados and (RAIZ / f).exists(): (RAIZ / f).unlink(); apagados += 1
    del reg['tratados'][k]
reg['falhas'] = {k: v for k, v in reg['falhas'].items() if k in manter}
json.dump(reg, open(RAIZ / 'leis/tratados.json', 'w'), ensure_ascii=False, indent=0)
print('mantidos', mantidos, '| textos apagados', apagados, '| falhas', len(reg['falhas']))
