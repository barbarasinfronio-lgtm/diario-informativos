"""
plenario_virtual_cards.py — acrescenta ao grupo "Informativos" do Diário das
Decisões os julgados do "Plenário Virtual em Evidência" (STF) que já têm
decisão e que o site ainda não tem.

Uso:  python3 scripts/plenario_virtual_cards.py todos_informativos_consolidados.json

Entram só: decisões de mérito/medida cautelar e embargos ACOLHIDOS
(esclarecimento, efeitos integrativos ou infringentes, modulação). Ficam de
fora: julgamentos sem decisão (vista, voto do relator), embargos rejeitados
ou não conhecidos, agravos não conhecidos e decisões que o site já tem no
grupo Informativos, no Controle Concentrado ou na Repercussão Geral (mesmo
processo, sessão com até 10 dias de diferença). Pode ser rodado de novo: troca
os cards "pv-" anteriores.
"""
import json,re,sys,subprocess,datetime,collections,hashlib,os,glob
src=sys.argv[1]
new=json.load(open(src,encoding='utf-8'))
cl=lambda s: re.sub(r'\s+',' ',re.sub('­\\s*','',s or '')).strip()
DEC=re.compile(r'(O Tribunal|A Turma|O Plenário),?\s+(por unanimidade|por maioria)',re.I)
def k(p):
    m=re.match(r'([A-Z][A-Za-z]+)\s*([\d.]+)',p or ''); return (m[1].upper(),m[2].replace('.','').rstrip('.')) if m else None
def todos(p):
    # "ADI 7764, ADI 7767 e ADI 7769 (julgamento conjunto)" -> as três chaves
    p=re.sub(r'\s*\(.*?\)','',p or '')
    return [x for x in (k(q.strip()) for q in re.split(r',\s*|\s+e\s+',p)) if x]
def dt(s):
    try: return datetime.datetime.strptime(s,'%d/%m/%Y')
    except Exception: return None
def perto(a,datas):
    a=dt(a); return bool(a) and any(dt(d) and abs((dt(d)-a).days)<=10 for d in datas)
# o que o site já tem
idx=json.load(open('informativos/indice.json',encoding='utf-8'))
itens=[x for x in idx['itens'] if not x[0].startswith('pv-')]
ja=collections.defaultdict(list)
for x in itens:
    if x[1]=='STF':
        for kk in todos(x[6]): ja[kk].append(x[7])
node=lambda js: json.loads(subprocess.run(['node','-e','global.window=global;'+js],capture_output=True,text=True,check=True).stdout)
for p,d in node('eval(require("fs").readFileSync("controleconst/adi_dados.js","utf8"));process.stdout.write(JSON.stringify(CONSTITUCIONALIDADES_DATA.map(d=>[d.processo,d.data])))'):
    for kk in (todos(p) if d else []): ja[kk].append(d[8:10]+'/'+d[5:7]+'/'+d[:4])
for p,d in node('eval(require("fs").readFileSync("rg-repetitivos-data.js","utf8"));process.stdout.write(JSON.stringify(RG_REPETITIVOS_DATA.filter(d=>d.orgao==="STF").map(d=>[d.processo,d.data])))'):
    for kk in todos(p): ja[kk].append(d)
out={}; st=collections.Counter()
for x in new:
    if x.get('tipo')!='Plenário Virtual em Evidência': continue
    t=cl(x.get('inteiro_teor')); proc=cl(x.get('processo')).rstrip('/').rstrip('.')
    if not DEC.search(t) or not proc: st['sem decisão']+=1; continue
    dec=re.split(r'”\s*(?:Lista|OBJETO)|\s(?:Lista \d|OBJETO:)',t)[0].strip('“” ')
    m=re.search(r'Sess[ãa]o Virtual de [\d.]+ a (\d{1,2})\.(\d{1,2})\.(\d{4})',dec)
    data=f'{int(m[1]):02d}/{int(m[2]):02d}/{m[3]}' if m else ''
    ini=dec[:260].lower()
    if 'embargos' in ini and 'acolheu' not in ini: st['embargos rejeitados/não conhecidos']+=1; continue
    if re.search(r'não conheceu do agravo|negou provimento ao agravo',ini): st['agravo sem efeito']+=1; continue
    if perto(data,ja.get(k(proc),[])): st['já no site']+=1; continue
    chave=proc+'|'+dec[:100]
    if chave in out: continue
    ed=re.search(r'(\d+)\D*?(20\d\d)',x.get('origem_arquivo') or '')
    out[chave]=dict(proc=proc,contr=cl(x.get('destaque')),dec=dec,data=data,ed=f"{int(ed[1])}/{ed[2]}" if ed else (x.get('numero_informativo') or ''),
                    emb='embargos' in ini or 'questão de ordem' in ini)
    st['entra']+=1
# julgamento conjunto (regra de scripts/limpar_decisoes.py): a mesma decisão em
# processos diferentes vira um card só, com os processos juntos no título
grupos={}
for i in out.values():
    g=grupos.setdefault(re.sub(r'\s+',' ',i['dec'].lower())[:400],[])
    g.append(i)
L=[]
for g in grupos.values():
    i=dict(g[0])
    if len(g)>1:
        procs=[]
        for j in g:
            if j['proc'] not in procs: procs.append(j['proc'])
        i['proc']=', '.join(procs)+' (julgamento conjunto)'
        st['juntadas']+=len(g)-1
    L.append(i)
# grava: os cards pv- vão num arquivo de partes próprio
n_parte=max([int(os.path.basename(f)[:3]) for f in glob.glob('informativos/c/[0-9][0-9][0-9].json') if not f.endswith('pv.json')]+[0])+1
det={}
for i in L:
    h='pv-'+hashlib.md5((i['proc']+i['dec']).encode()).hexdigest()[:10]
    titulo=i['proc']+' — '+(i['contr'][:230] if i['contr'] else 'Plenário Virtual')
    itens.append([h,'STF',i['ed'],'Direito Constitucional',titulo,i['dec'],i['proc'],i['data'],n_parte,'Plenário Virtual em Evidência nº '+i['ed']+(' · embargos/questão de ordem' if i['emb'] else '')])
    det[h]='Controvérsia: '+i['contr'] if i['contr'] else 'Controvérsia não informada no boletim.'
for f in glob.glob('informativos/c/*.json'):
    try:
        if json.load(open(f)) and all(str(kk).startswith('pv-') for kk in json.load(open(f))): os.remove(f)
    except Exception: pass
json.dump(det,open(f'informativos/c/{n_parte:03d}.json','w'),ensure_ascii=False,separators=(',',':'))
idx['itens']=itens; idx['campos']=idx['campos'][:9]+['fonte']
nl=open('informativos/indice.json',encoding='utf-8').read().endswith('\n')
open('informativos/indice.json','w',encoding='utf-8').write(json.dumps(idx,ensure_ascii=False,separators=(',',':'))+('\n' if nl else ''))
print(dict(st), 'cards pv:',len(L),'parte',n_parte)
