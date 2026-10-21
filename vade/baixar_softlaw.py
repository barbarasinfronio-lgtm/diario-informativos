#!/usr/bin/env python3
"""Baixa PDFs (CNJ, ONU, OEA…), extrai o texto e grava em leis/texto sob o nome que o site calcula do link.
Entradas: vade/tratados/softlaw.json  [{"nome","numero","link","fonte"(url do PDF, se diferente do link),"grupo"}]
Saída: leis/texto/<id>.json  e  vade/tratados/softlaw-resultado.json"""
import json, re, sys, urllib.request
from pathlib import Path
RAIZ = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(RAIZ / 'scripts'))
import atualizar_informativos as robo  # noqa: E402
import fitz  # noqa: E402
UA = {'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 Safari/605.1.15'}
def paragrafos(doc):
    out = []
    for p in doc:
        t = p.get_text().replace('\xad', '').replace('­', '')
        t = re.sub(r'-\n(?=[a-zà-ú])', '', t)        # hifenização de fim de linha
        bloco = []
        for ln in t.split('\n'):
            ln = ln.strip()
            if not ln: continue
            if bloco and (re.match(r'^(Art\.?\s*\d|Artigo\s+\d|§|CAP[ÍI]TULO|SE[ÇC][ÃA]O|T[ÍI]TULO|PARTE|ANEXO|\d+[\.\)]\s|[a-z]\)\s|[IVX]+\s*[-–.])', ln) or re.search(r'[.:;]$', bloco[-1])):
                out.append(' '.join(bloco)); bloco = []
            bloco.append(ln)
        if bloco: out.append(' '.join(bloco))
    return [re.sub(r'\s+', ' ', x).strip() for x in out if len(x.strip()) > 1]
def main():
    itens = json.load(open(RAIZ / sys.argv[1] if len(sys.argv) > 1 else RAIZ / 'vade/tratados/softlaw.json'))
    res = {}
    for it in itens:
        fontes = it.get('fontes') or [it.get('fonte') or it['link']]
        chave = it.get('chave') or it['numero']
        ok = False
        for alvo in fontes:
          try:
            b = urllib.request.urlopen(urllib.request.Request(alvo, headers=UA), timeout=90).read()
            if b[:4] == b'%PDF':
                doc = fitz.open(stream=b, filetype='pdf'); p = paragrafos(doc); n = sum(len(x) for x in p)
            else:       # página HTML: usa o texto da página
                import html as _h
                h = b.decode('utf8', 'replace'); h = re.sub(r'(?is)<(script|style|nav|header|footer|head)\b.*?</\1>|<!--.*?-->', '', h)
                h = re.sub(r'(?i)<br\s*/?>|</(p|div|tr|li|h[1-6]|dd|dt)>', '\n', h)
                p = [re.sub(r'\s+', ' ', x).strip() for x in _h.unescape(re.sub(r'<[^>]+>', '', h)).replace('\xa0', ' ').split('\n') if len(x.strip()) > 1]
                n = sum(len(x) for x in p); doc = [0]
            if n < 1500: res[chave] = f'sem texto ({len(doc)} págs, escaneado?)'; continue
            if it.get('deve') and not re.search(it['deve'], ' '.join(p), re.I): res[chave] = 'texto não confere (' + alvo[:50] + ')'; continue
            f = RAIZ / 'leis/texto' / f'{robo.id_texto(it["link"])}.json'
            json.dump({'nome': it['nome'], 'url': it['link'], 'em': robo.hoje(), 'p': p}, open(f, 'w'), ensure_ascii=False)
            res[chave] = f'ok ({len(doc)} págs, {n} caracteres) <- {alvo[:70]}'; ok = True; break
          except Exception as e:  # noqa: BLE001
            res[chave] = f'erro: {type(e).__name__} {alvo[:50]}'
        print('✓' if ok else '✗', it['nome'][:60], res[chave])
    json.dump(res, open(RAIZ / (sys.argv[1].replace('.json', '-resultado.json') if len(sys.argv) > 1 else 'vade/tratados/softlaw-resultado.json'), 'w'), ensure_ascii=False, indent=1)
main()
