"""
informativos_cards.py — transforma o JSON consolidado dos informativos
(todos_informativos_consolidados.json) nos cards do grupo "Informativos"
do Diário das Decisões.

Uso:  python3 scripts/informativos_cards.py todos_informativos_consolidados.json[.gz]
Gera: informativos/indice.json  — lista leve (cards e busca)
      informativos/c/NNN.json    — resumo completo, 250 por arquivo

Entram: informativos do STJ (sem repetição: o mesmo julgado aparece no PDF
avulso, no "Inf0…" e nos arquivos grandes) e do STF em PDF (1000 em diante).
Ficam de fora: STF antigo em .htm (julgados não separados — 2ª etapa),
Jurisprudência em Teses (já está no site) e o que não é informativo.
"""
import json,gzip,collections,re,unicodedata
import sys,os,shutil
src=sys.argv[1]
d=json.load(gzip.open(src,'rt',encoding='utf-8') if src.endswith('.gz') else open(src,encoding='utf-8'))
def norm(s):
    s=unicodedata.normalize('NFD',(s or '').lower()); s=''.join(c for c in s if unicodedata.category(c)!='Mn'); return re.sub(r'[^a-z0-9]+',' ',s).strip()
def limpa(t):
    t=re.sub('­\\s*','',t or '')
    t=re.sub(r'(\w)- (\w)',r'\1\2',t)  # hifenização de quebra de linha
    t=re.sub(r'processo\.stj\.jus\.br/\S+ \d+/\d+','',t)
    t=re.sub(r'(Edição|EDIÇÃO) \d+/\d+ \| ?\W* ?\d+ INFORMATIVO STF SUMÁRIO','',t)
    t=re.sub(r'\s+',' ',t).strip()
    return t
MESES={m:i+1 for i,m in enumerate('janeiro fevereiro março abril maio junho julho agosto setembro outubro novembro dezembro'.split())}
def data_julg(p):
    m=re.search(r'julgad[oa] em (\d{1,2})/(\d{1,2})/(\d{4})',p or '')
    return f'{int(m[1]):02d}/{int(m[2]):02d}/{m[3]}' if m else None
# ---------- STJ ----------
stj={}
fam=lambda o: 'big' if re.search(r'infos stj|stj info',o) else 'get' if o.startswith('GetPDFINFJ') else 'inf' if re.match(r'Inf0\d',o) else None
for x in d:
    o=x['origem_arquivo'] or ''; f=fam(o)
    if not f or x['tipo']!='Informativo STJ' or not x['destaque'] or not x['processo']: continue
    proc=limpa(x['processo']); dest=limpa(x['destaque'])
    k=norm(re.split(r',',proc)[0])+'|'+norm(dest)[:80]
    num=None if f=='big' else str(int(x['numero_informativo'])) if str(x['numero_informativo']).isdigit() else None
    it=stj.get(k)
    if it is None:
        stj[k]=dict(orgao='STJ',info=num,processo=proc,ramo=limpa(x['ramo_direito']).title() if x['ramo_direito'] else None,tema=limpa(x['tema']),destaque=dest,teor=limpa(x['inteiro_teor']),data=data_julg(proc),datainf=x['data_informativo'])
    else:
        if num and not it['info']: it['info']=num; it['datainf']=x['data_informativo']
        if len(limpa(x['inteiro_teor']))>len(it['teor']): it['teor']=limpa(x['inteiro_teor'])
S=list(stj.values())
print('STJ julgados unicos',len(S),'sem numero de informativo',sum(1 for i in S if not i['info']),'informativos',len({i['info'] for i in S}))
# ---------- STF (PDF 1000+) ----------
RXP=r'((?:ADI|ADC|ADO|ADPF|RE|ARE|HC|RHC|MS|MI|Rcl|AP|Inq|Pet|ACO|AO|SL|STP|SS|RMS|Ext|EP|AI|IF|AR)\s?[\d.]+(?:\s[A-Za-z-]+){0,3}(?:/[A-Z]{2})?,\s*relator[a]?\s*(?:o\s*)?Min(?:istro|istra|\.)?\s*[^,]+,\s*[^.]*?(?:julgamento|julgado)[^.]*?(?:\d{1,2}\.\d{1,2}\.\d{4}|virtual finalizado em \d{1,2}\.\d{1,2}\.\d{4}))'
ABREV=r'(?:arts?|n|nº|inc|incs|al|p|pp|fl|fls|min|rel|ed|cf|lei|dec|etc|s|ss|v|cap|par|i|ii|iii|iv|v|vi|vii|viii|ix|x|xi|xii|a|b|c|d|e|f)'
def primeira_frase(t):
    for m in re.finditer(r'\.\s+(?=[A-ZÁÉÍÓÚÂÊÔÃÕÇ“"])',t):
        if m.start()<60: continue
        ant=re.search(r'([\wº/]+)$',t[:m.start()])
        if ant and re.fullmatch(ABREV,ant[1].lower()): continue
        if re.search(r'\d$',t[:m.start()]) and re.match(r'\.\s+\d',t[m.start():]): continue
        return t[:m.start()+1]
    return t[:600]
stf=[]
for x in d:
    o=x['origem_arquivo'] or ''
    if not re.match(r'Informativo_stf_\d',o) or not x['inteiro_teor']: continue
    t=limpa(x['inteiro_teor'])
    if re.search(r'codi@stf|livrariasupremo',t) and len(t)<600: continue
    m=None
    for m in re.finditer(RXP,t): pass
    proc=limpa(m[1]) if m else None
    tese=limpa(x['destaque']) if x['destaque'] else None
    if not tese:
        tese=primeira_frase(t)
    dm=re.search(r'(\d{1,2})\.(\d{1,2})\.(\d{4})',proc or '')
    stf.append(dict(orgao='STF',info=str(int(x['numero_informativo'])),processo=proc,ramo=None,tema=None,destaque=tese,teor=t,data=f'{int(dm[1]):02d}/{int(dm[2]):02d}/{dm[3]}' if dm else None,datainf=x['data_informativo']))
# dedupe STF
seen=set();F=[]
for i in stf:
    k=norm(i['destaque'])[:120]
    if k in seen: continue
    seen.add(k);F.append(i)
print('STF pdf julgados',len(F),'com processo',sum(1 for i in F if i['processo']),'informativos',len({i['info'] for i in F}))

KW=[('Direito Tributário',r'tribut|icms|imposto|contribuiç'),('Direito Processual Penal',r'processual penal|habeas|prisão|denúncia|inquérito'),('Direito Penal',r'penal|crime|pena\b'),
 ('Direito Previdenciário',r'previdenci|aposentadoria'),('Direito do Consumidor',r'consumidor'),('Direito Ambiental',r'ambient'),('Direito Eleitoral',r'eleitora'),
 ('Direito do Trabalho',r'trabalhist|trabalhador|justiça do trabalho'),('Direito Administrativo',r'servidor|administra|licita|concurso público|improbidade'),('Direito Civil',r'civil|contrato|família')]
PREP=re.compile(r'\b(De|Do|Da|Dos|Das|E|Em)\b')
def area(i):
    if i['ramo']:
        r=i['ramo'].split(',')[0].strip().title()
        return PREP.sub(lambda m:m[1].lower(),r)
    if re.match(r'(ADI|ADC|ADO|ADPF)\b',i['processo'] or ''): return 'Direito Constitucional'
    t=(i['destaque']+' '+(i['processo'] or '')).lower()
    return next((v for v,rx in KW if re.search(rx,t)),'Direito Constitucional')
def chave(i):
    m=re.match(r'(\d{2})/(\d{2})/(\d{4})',i['data'] or '')
    return m[3]+m[2]+m[1] if m else '0'
ITENS=[]
for org,L in (('STJ',S),('STF',F)):
    for i in L:
        if not i['destaque'] or not i['teor']: continue
        proc=(i['processo'] or '').strip()
        tit=i.get('tema') or (re.split(r',',proc)[0] if proc else 'Informativo '+org+' '+(i['info'] or ''))
        ITENS.append(dict(org=org,info=i['info'] or '',area=area(i),tit=tit[:260],tese=i['destaque'],proc=proc,data=i['data'] or '',teor=i['teor']))
ITENS.sort(key=chave,reverse=True)
import hashlib
vistos=set()
for i in ITENS:
    h=hashlib.md5((i['org']+i['info']+i['proc']+i['tese']).encode()).hexdigest()[:10]
    while h in vistos: h=hashlib.md5(h.encode()).hexdigest()[:10]
    vistos.add(h); i['id']=h
base='informativos'; shutil.rmtree(base,ignore_errors=True); os.makedirs(base+'/c')
N=250; indice=[]
for k in range(0,len(ITENS),N):
    ch=k//N; det={}
    for i in ITENS[k:k+N]:
        indice.append([i['id'],i['org'],i['info'],i['area'],i['tit'],i['tese'],i['proc'],i['data'],ch]); det[i['id']]=i['teor']
    json.dump(det,open(f'{base}/c/{ch:03d}.json','w'),ensure_ascii=False,separators=(',',':'))
json.dump({'fonte':'Informativos do STJ e do STF (consolidados)','campos':['id','orgao','informativo','area','titulo','tese','processo','data','parte'],'itens':indice},open(base+'/indice.json','w'),ensure_ascii=False,separators=(',',':'))
print(len(ITENS),'cards;',collections.Counter(i['org'] for i in ITENS),collections.Counter(i['area'] for i in ITENS).most_common(12))
