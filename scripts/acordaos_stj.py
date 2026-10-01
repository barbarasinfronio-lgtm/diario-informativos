"""
acordaos_stj.py — monta o grupo "Acórdãos STJ" do Diário das Decisões a
partir dos espelhos de acórdãos dos dados abertos do STJ.

Uso:  python3 scripts/acordaos_stj.py itens.json.gz
      (itens.json.gz = lista de acórdãos já filtrados por classe de mérito)
Gera: stj/acordaos/indice.json  — lista leve (busca e cards)
      stj/acordaos/c/NNN.json    — ementa e detalhes, 250 por arquivo,
                                    carregados só quando o card é aberto
"""
import gzip,json,re,sys,os,collections,shutil
src=sys.argv[1]
d=json.load(gzip.open(src,'rt',encoding='utf-8')) if src.endswith('.gz') else json.load(open(src))
KW=[('Direito Tributário',r'tribut|icms|imposto|execução fiscal|contribuiç'),('Execução Penal',r'execução penal|remição|livramento condicional|progressão de regime|falta grave'),
 ('Direito Processual Penal',r'processual penal|prisão preventiva|habeas|júri|denúncia'),('Direito Penal',r'penal|crime|tráfico|dosimetria|furto|roubo'),
 ('Direito Previdenciário',r'previdenci'),('Direito do Consumidor',r'consumidor'),('Direito Ambiental',r'ambiental'),('Direito Administrativo',r'administrativ|servidor|improbidade|licitaç'),
 ('Direito Empresarial',r'empresarial|falência|recuperação judicial'),('Direito Civil',r'civil|família|contrat'),('Direito Processual Civil',r'.')]
def para(s):
    s=(s or '').replace('_x000D_','\r')
    ps=[re.sub(r'\s+',' ',p).strip() for p in re.split(r'\r',s)]
    return '\n'.join(p for p in ps if p)
def cab(e):
    h=re.split(r'\s(?=1\.\s)|\s(?=I\.\s+CASO)',e,1)[0].split('\n')[0]
    return h
def titulo(h):
    t=re.sub(r'(^|\. )(\w)',lambda m:m[1]+m[2].upper(),h.rstrip('. ').lower())
    t=re.sub(r'\b(stj|stf|cpp|cp|cpc|cf|lep|ctn|cdc|eca|icms|iss|ipi|inss|sus)\b',lambda m:m[0].upper(),t)
    return t if len(t)<=220 else t[:220].rsplit(' ',1)[0]+'…'
def resultado(dec):
    dec=re.sub(r'\s+',' ',dec or '')
    m=re.search(r'(por (?:unanimidade|maioria)[^.]*?)(?:, nos termos|\. )',dec,re.I)
    r=m[1] if m else ''
    return r[:160]
ORG={'CORTE ESPECIAL':'Corte Especial','PRIMEIRA SEÇÃO':'1ª Seção','SEGUNDA SEÇÃO':'2ª Seção','TERCEIRA SEÇÃO':'3ª Seção','PRIMEIRA TURMA':'1ª Turma','SEGUNDA TURMA':'2ª Turma','TERCEIRA TURMA':'3ª Turma','QUARTA TURMA':'4ª Turma','QUINTA TURMA':'5ª Turma','SEXTA TURMA':'6ª Turma'}
itens=[]
for x in d:
    e=para(x.get('ementa'))
    if len(e)<80: continue
    dd=str(x.get('dataDecisao') or '')
    if not re.match(r'\d{8}$',dd) or dd<'2015': continue
    h=cab(e)
    itens.append(dict(id=str(x['id']),proc=x['siglaClasse']+' '+str(x['numeroProcesso']),org=ORG.get(x['nomeOrgaoJulgador'],x['nomeOrgaoJulgador'].title()),
        rel=(x.get('ministroRelator') or '').title(),data=dd,area=next(v for v,rx in KW if re.search(rx,h.lower())),tit=titulo(h),res=resultado(x.get('decisao')),
        reg=x.get('numeroRegistro') or '',ementa=e,dec=para(x.get('decisao')),inf=para(x.get('informacoesComplementares')),notas=para(x.get('notas')),
        pub=re.sub(r'\s+',' ',x.get('dataPublicacao') or '')))
itens.sort(key=lambda i:i['data'],reverse=True)
base='stj/acordaos'; shutil.rmtree(base,ignore_errors=True); os.makedirs(base+'/c')
N=250; indice=[]
for k in range(0,len(itens),N):
    ch=k//N; det={}
    for i in itens[k:k+N]:
        indice.append([i['id'],i['proc'],i['org'],i['rel'],i['data'],i['area'],i['tit'],i['res'],i['reg'],ch])
        det[i['id']]={'ementa':i['ementa'],'dec':i['dec'],'inf':i['inf'],'notas':i['notas'],'pub':i['pub']}
    json.dump(det,open(f'{base}/c/{ch:03d}.json','w'),ensure_ascii=False,separators=(',',':'))
json.dump({'fonte':'STJ — dados abertos, espelhos de acórdãos','campos':['id','processo','orgao','relator','data','area','titulo','resultado','registro','parte'],'itens':indice},
          open(base+'/indice.json','w'),ensure_ascii=False,separators=(',',':'))
print(len(itens),'acórdãos;',collections.Counter(i['org'] for i in itens).most_common(),collections.Counter(i['data'][:4] for i in itens))
