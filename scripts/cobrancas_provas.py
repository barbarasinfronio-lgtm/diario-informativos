"""
cobrancas_provas.py — liga as questões de provas de concurso às súmulas e
decisões do site ("Cobrado em …").

Uso:  python3 scripts/cobrancas_provas.py <pasta com os .txt das provas>
Gera: provas/cobrancas.json

Os .txt saem dos PDFs (pdftotext por coluna, ou OCR). O nome do arquivo diz a
banca, o ano e o órgão (ex.: VUNESP_2021_189_TJSP__OBJETIVAS....txt).
Uma questão liga a um card quando (1) cita a súmula/tema pelo número, ou
(2) reproduz boa parte do texto da tese/súmula (cobertura >= 0,6 em trechos
de 4+ palavras seguidas).
"""
import subprocess
import json,re,glob,os,collections,unicodedata,sys
ROOT=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
C=json.loads(subprocess.run(['node','-e',open(os.path.join(ROOT,'scripts','cobrancas_corpus.js')).read()],cwd=ROOT,capture_output=True,text=True,check=True).stdout)
def norm(s):
    s=unicodedata.normalize('NFD',(s or '').lower()); s=''.join(c for c in s if unicodedata.category(c)!='Mn')
    s=re.sub(r'-\n',' ',s); return re.sub(r'[^a-z0-9]+',' ',s).strip()
K=4
def sh(t):
    w=norm(t).split(); return {' '.join(w[i:i+K]) for i in range(len(w)-K+1)}
IDX=collections.defaultdict(list); SH={}
for i,c in enumerate(C):
    s=sh(c['texto'])
    if len(s)<4: continue
    SH[i]=s
    for x in s: IDX[x].append(i)
# shingles too common (appear in >40 items) carry no signal
COMMON={x for x,v in IDX.items() if len(v)>40}
TJ={'TJAC':'tjac','TJAL':'tjal','TJAM':'tjam','TJAP':'tjap','TJBA':'tjba','TJCE':'tjce','TJDFT':'tjdft','TJES':'tjes','TJGO':'tjgo','TJMA':'tjma','TJMG':'tjmg','TJMS':'tjms','TJMT':'tjmt','TJPA':'tjpa','TJPB':'tjpb','TJPE':'tjpe','TJPI':'tjpi','TJPR':'tjpr','TJRJ':'tjrj','TJRN':'tjrn','TJRO':'tjro','TJRR':'tjrr','TJRS':'tjrs','TJSC':'tjsc','TJSE':'tjse','TJSP':'tjsp','TJTO':'tjto'}
SUMKEY={(c['org'],c['num']) for c in C if c['src']=='sum'}
DECKEY=collections.defaultdict(list)
for i,c in enumerate(C):
    if c['src']=='dec' and c.get('num'): DECKEY[(c['org'],c.get('label','Tema'),c['num'].replace('.',''))].append(i)
def meta(fn):
    b=os.path.basename(fn)
    banca=b.split('_')[0]; ano=re.search(r'(20\d\d)',b); tj=re.search(r'(TJ[A-Z]{2,3}|ENAM)',b)
    return dict(banca=banca if banca!='ENAM' else 'FGV',ano=ano[1] if ano else '',orgao=(tj[1] if tj else ''),arq=b)
def questoes(txt):
    L=txt.split('\n')
    # 1) "QUESTÃO n" (CESPE/OCR: pode vir fora de ordem)
    qm=[(i,int(m[1])) for i,l in enumerate(L) for m in [re.match(r'^\W{0,3}Q\s?UEST\s?[ÃA]\s?O\s*(\d{1,3})\b',l,re.I)] if m]
    if len({n for _,n in qm})>=30:
        out={}
        for k,(i,n) in enumerate(qm):
            e=qm[k+1][0] if k+1<len(qm) else len(L)
            out.setdefault(n,'');out[n]+='\n'.join(L[i+1:e])
        return sorted(out.items())
    gm=[i for i,l in enumerate(L) if re.match(r'^!"#\$%&\'\(.{1,3}$',l.strip())]
    if len(gm)>=30:
        return [(k+1,'\n'.join(L[i+1:(gm[k+1] if k+1<len(gm) else len(L))])) for k,i in enumerate(gm)]
    marks=[]
    for i,l in enumerate(L):
        m=re.match(r'^\s*(\d{1,3})\s*[.)-]?\s*$',l) or re.match(r'^\s*(\d{1,3})\s*[.)–-]\s+\S',l)
        if m: marks.append((i,int(m[1])))
    best=[]
    for s0 in range(len(marks)):
        if marks[s0][1]!=1: continue
        ch=[marks[s0]]
        for j in range(s0+1,len(marks)):
            if marks[j][1]==ch[-1][1]+1: ch.append(marks[j])
        if len(ch)>len(best): best=ch
    out=[]
    for k,(i,n) in enumerate(best):
        e=best[k+1][0] if k+1<len(best) else len(L)
        out.append((n,'\n'.join(L[i:e])))
    return out
RX_SUM=re.compile(r's[uú]mula[s]?\s+(vinculante\s+)?(?:n[º°o.]*\s*)?(\d{1,3})(?![\d.])(.{0,60})',re.I|re.S)
RX_TEMA=re.compile(r'tema\s+(?:n[º°o.]*\s*)?(\d[\d.]{0,5})(?![\d])(.{0,80})',re.I|re.S)
def citacoes(q,mt):
    res=[]
    for m in RX_SUM.finditer(q):
        num=m[2]; ctx=(m[3] or '')+q[max(0,m.start()-60):m.start()]
        if m[1]: org='stf_vinculante'
        elif re.search(r'\bSTJ\b|Superior Tribunal de Justi',ctx): org='stj'
        elif re.search(r'\bSTF\b|Supremo',ctx): org='stf'
        elif re.search(r'\bTST\b',ctx): org='tst'
        else:
            t=re.search(r'\b(TJ[A-Z]{2,4})\b',ctx); org=TJ.get(t[1]) if t else None
        if org and (org,num) in SUMKEY: res.append(('sum',org+'|'+num))
    for m in RX_TEMA.finditer(q):
        num=m[1].replace('.',''); ctx=m[2]+q[max(0,m.start()-80):m.start()]
        org='STF' if re.search(r'repercuss|STF|Supremo',ctx) else 'STJ' if re.search(r'repetitiv|STJ|Superior',ctx) else None
        if org:
            for i in DECKEY.get((org,'Tema',num),[]): res.append(('dec',C[i]['key']))
    return res
import difflib
CW={}
def cw(i):
    if i not in CW: CW[i]=norm(C[i]['texto']).split()
    return CW[i]
def similares(q):
    s=sh(q)-COMMON; hits=collections.Counter()
    for x in s:
        for i in IDX.get(x,()): hits[i]+=1
    qw=norm(q).split(); out=[]
    for i,h in hits.items():
        if h<4: continue
        w=cw(i)
        sm=difflib.SequenceMatcher(None,w,qw,autojunk=False)
        cov=sum(m.size for m in sm.get_matching_blocks() if m.size>=4)/max(len(w),1)
        if cov>=0.5: out.append((i,h,round(cov,2)))
    return out
LIMIAR=0.6
PROVAS=[];R=collections.defaultdict(list);stats=collections.Counter()
for fn in sorted(glob.glob(sys.argv[1]+'/*.txt')):
    if re.search(r'gabarit|RESPOSTA',fn,re.I): continue
    mt=meta(fn); qs=questoes(open(fn,encoding='utf-8',errors='ignore').read())
    if len(qs)<30: print('ignorada (questões não separadas):',mt['arq'],len(qs)); continue
    pi=len(PROVAS)
    rot=('ENAM' if 'ENAM' in mt['arq'] else mt['orgao'])+' '+mt['ano']+(' (reaplicação)' if 'Reaplica' in mt['arq'] else ' (2º exame)' if '2º_Exame' in mt['arq'] else '')
    PROVAS.append(dict(rotulo=rot.strip(),banca=mt['banca'],ano=mt['ano'],orgao=mt['orgao'] or 'ENAM',cargo='Magistratura estadual',questoes=len(qs)))
    for n,q in qs:
        found={}
        for src,key in citacoes(q,mt): found[(src,key)]=1
        for i,h,cov in similares(q):
            if cov>=LIMIAR: found.setdefault((C[i]['src'],C[i]['key']),0)
        for (src,key),cit in found.items():
            R[src+'|'+key].append([pi,n]); stats['citacao' if cit else 'texto']+=1
        if found: stats['questoes_ligadas']+=1
        stats['questoes']+=1
def chave(k):
    src,key=k.split('|',1)
    return ('sum:'+key.replace('|',':')) if src=='sum' else ('dec:'+key)
def rotulo(c):
    if c['src']=='sum':
        o=c['org']
        if o=='stf_vinculante': return 'Súmula Vinculante '+c['num'],'Súmula Vinculante'
        sig=o.upper().replace('_UJ','')
        return 'Súmula '+c['num']+' do '+sig,'Súmula '+('do STF' if o=='stf' else 'do STJ' if o=='stj' else 'do TST' if o=='tst' else 'dos TJs')
    t=c.get('tipo')
    if t=='rg': return 'Tema '+c['num']+' da Repercussão Geral (STF)','Repercussão Geral (STF)'
    if t=='repetitivo':
        l=c.get('label') or 'Tema'
        return (l+' '+c['num']+' do STJ' if l!='Tema' else 'Tema '+c['num']+' dos Repetitivos (STJ)'),('Repetitivos/IAC/PUIL (STJ)')
    if t=='teses':
        m=re.match(r'(\d+)\D+(\d+)',c.get('num') or '')
        return ('Jurisprudência em Teses do STJ'+(' (ed. %s, tese %s)'%(m[1],m[2]) if m else '')),'Jurisprudência em Teses (STJ)'
    return 'Resumo de decisão do STF','Outras decisões'
CK={(c['src'],c['key']):c for c in C}
CARDS={}
for k in R:
    src,key=k.split('|',1); c=CK[(src,key)]; r,f=rotulo(c)
    CARDS[chave(k)]={'rotulo':r,'fonte':f,'texto':c['texto'][:400]}
out={'gerado':__import__('datetime').date.today().isoformat(),'provas':PROVAS,'cards':CARDS,'itens':{chave(k):sorted({tuple(x) for x in v}) for k,v in R.items()}}
os.makedirs(os.path.join(ROOT,'provas'),exist_ok=True)
json.dump(out,open(os.path.join(ROOT,'provas','cobrancas.json'),'w'),ensure_ascii=False,separators=(',',':'))
print(len(PROVAS),'provas',stats,'cards ligados:',len(R))
