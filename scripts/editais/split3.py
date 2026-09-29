import re,json,sys,unicodedata
# uso: split3.py texto.txt saida.json "marcador inicial" "marcador final" [UF] [--inline]
# Acha títulos de matéria (linha em MAIÚSCULAS, ou "TÍTULO:" com --inline) e escolhe a matéria do Diário de Leis.
args=[a for a in sys.argv[1:] if not a.startswith('--')]; inline='--inline' in sys.argv
t=re.sub(r'[\ue000-\uf8ff\u2022\u25aa\u25cf]','',open(args[0]).read()); ini=t.index(args[2])-1; fim=t.find(args[3],ini+len(args[2])) if args[3] else -1
body=t[ini: fim if fim>0 else len(t)]; uf=args[4] if len(args)>4 else None
def sa(s): return unicodedata.normalize('NFD',s).encode('ascii','ignore').decode().upper()
REGRAS=[('PROCESSUAL CIVIL','processual_civil'),('PROCESSO CIVIL','processual_civil'),('PROCESSUAL PENAL','processual_penal'),('PROCESSO PENAL','processual_penal'),
 ('PROCESSUAL DO TRABALHO','trabalhista'),('TRABALHO','trabalhista'),('CONSUMIDOR','consumidor'),('CRIANCA','crianca'),('INFANCIA','crianca'),('PREVIDENCI','previdenciario'),('SEGURIDADE','previdenciario'),
 ('PENAL','penal'),('CRIMINOLOGIA','penal'),('CIVIL','civil'),('NOTARIA','civil'),('REGISTRA','civil'),('CONSTITUCIONAL','constitucional'),('ELEITORAL','eleitoral'),('EMPRESARIAL','empresarial'),('COMERCIAL','empresarial'),
 ('TRIBUT','tributario'),('FINANCEIRO','tributario'),('ECONOMICO','empresarial'),('AMBIENTAL','ambiental'),('URBANISTICO','administrativo'),('AGRARIO','ambiental'),('ADMINISTRATIVO','administrativo'),
 ('HUMANOS','humanos'),('INTERNACIONAL','humanos'),('ANTIDISCRIMINA','humanos')]
def mat(h):
    s=sa(h)
    for k,v in REGRAS:
        if k in s: return v
    return 'constitucional'
TIT=r'(?:DIREITO|DIREITOS|NOÇÕES|SOCIOLOGIA|PSICOLOGIA|FILOSOFIA|ÉTICA|TEORIA|ESTATUTO|FORMAÇÃO|LEGISLAÇÃO|CONHECIMENTOS|PROTEÇÃO|PRAGMATISMO|CRIMINOLOGIA|MEDICINA|HISTÓRIA|REGISTROS|PRINCÍPIOS)[A-ZÁÉÍÓÚÂÊÔÃÕÇ ,E\-–()/]{2,110}?'
pat = re.compile(r'\n[ \t]*('+TIT+r')[ \t]*:' if inline else r'\n[ \t]*('+TIT+r')[ \t]*(?=\n)')
marks=[(m.start(),'G',m.group(1)) for m in re.finditer(r'\n[ \t]*((?:BLOCO|GRUPO)\s+(?:[IVX]+|UM|DOIS|TRÊS|TRES|\d)\b)', body)]
marks+=[(m.start(),'S',re.sub(r'\s+',' ',m.group(1)).strip(' -–')) for m in pat.finditer(body) if m.group(1).upper()==m.group(1)]
marks.sort()
def titulo(v):
    w=v.lower().split(); peq={'de','da','do','das','dos','e','a','o','à','às','ao','aos','em','na','no','sobre','com','para'}
    return ' '.join(x if (i and x in peq) else x[:1].upper()+x[1:] for i,x in enumerate(w))
grupos=[];sec=[];vistos=set()
for i,(p,k,v) in enumerate(marks):
    if k=='G':
        grupos.append({'nome':titulo(v).replace('Iii','III').replace('Ii','II').replace('Iv','IV'),'disciplinas':[]}); continue
    end=next((q for q,_,_ in marks[i+1:]), len(body))
    sec.append({'nome':v,'materia':mat(v),'texto':body[p:end]})
    if not grupos: grupos.append({'nome':'Disciplinas','disciplinas':[]})
    nm=titulo(v)
    if nm not in vistos: vistos.add(nm); grupos[-1]['disciplinas'].append(nm)
grupos=[g for g in grupos if g['disciplinas']]
json.dump({'secoes':sec,'grupos':grupos,'uf':uf},open(args[1],'w'),ensure_ascii=False)
for s in sec: print('  %-60s %-18s %6d'%(s['nome'][:60],s['materia'],len(s['texto'])))
for g in grupos: print(g['nome'],':',g['disciplinas'])
