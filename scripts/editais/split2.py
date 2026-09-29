import re,json,sys
# uso: split2.py texto.txt saida.json "marcador inicial" "marcador final|" MAP_JSON
# Títulos no formato "\nMATÉRIA:" ; grupos "GRUPO I/II/..." ; MAP: {"TÍTULO": "materia"}
t=open(sys.argv[1]).read()
ini=t.index(sys.argv[3]); fim=t.find(sys.argv[4],ini+10) if sys.argv[4] else -1
body=t[ini: fim if fim>0 else len(t)]
MAP=json.loads(sys.argv[5])
marks=[]
for m in re.finditer(r'\n\s*(GRUPO [IVX]+|BLOCO [IVX]+)\b', body): marks.append((m.start(),'G',m.group(1)))
for m in re.finditer(r'\n\s*([A-ZÁÉÍÓÚÂÊÔÃÕÇ][A-ZÁÉÍÓÚÂÊÔÃÕÇ ,\-–()]{5,}?)\s*:', body): marks.append((m.start(),'S',m.group(1).strip()))
marks.sort()
grupo=None; sec=[]; grupos=[]
for i,(p,k,v) in enumerate(marks):
    if k=='G':
        grupo=v.title().replace('Iii','III').replace('Ii','II').replace('Iv','IV'); grupos.append({'nome':grupo,'disciplinas':[]}); continue
    end=next((q for q,_,_ in marks[i+1:]), len(body))
    mat=MAP.get(v)
    if mat is None: print('SEM MAPA:',v); mat='constitucional'
    sec.append({'nome':v,'materia':mat,'texto':body[p:end]})
    if not grupos: grupos.append({'nome':'Conhecimentos','disciplinas':[]})
    nome=v.title().replace(' Do ',' do ').replace(' Da ',' da ').replace(' De ',' de ').replace(' E ',' e ').replace(' Dos ',' dos ').replace(' Das ',' das ').replace(' Sobre ',' sobre ').replace(' O ',' o ').replace(' A ',' a ').replace(' Às ',' às ').replace(' À ',' à ').replace(' Em ',' em ').replace(' Na ',' na ').replace(' No ',' no ')
    grupos[-1]['disciplinas'].append(nome)
json.dump({'secoes':sec,'grupos':grupos},open(sys.argv[2],'w'),ensure_ascii=False)
for g in grupos: print(g['nome'],':',g['disciplinas'])
