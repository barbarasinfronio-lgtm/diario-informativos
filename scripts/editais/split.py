import re,json,sys
# uso: split.py texto.txt saida.json inicio_marcador "TITULO=materia" ...
t=open(sys.argv[1]).read()
ini=[m.start() for m in re.finditer(re.escape(sys.argv[3]), t)]
body=t[ini[int(sys.argv[4])]:]
heads=[a.split('=') for a in sys.argv[5:]]
pos=[];last=0
for h,m in heads:
    mm=re.compile(r'\n\s*'+re.escape(h)+r'\s*\n').search(body,last)
    if not mm: print('NAO ACHEI',h); continue
    pos.append((mm.start(),h,m)); last=mm.end()
sec=[]
for i,(p,h,m) in enumerate(pos):
    end=pos[i+1][0] if i+1<len(pos) else len(body)
    sec.append({'nome':h,'materia':m,'texto':body[p:end]}); print(h, end-p)
json.dump({'secoes':sec},open(sys.argv[2],'w'),ensure_ascii=False)
