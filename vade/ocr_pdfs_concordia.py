#!/usr/bin/env python3
"""Tratados antigos que só existem em PDF escaneado no Concórdia.
  python3 vade/ocr_pdfs_concordia.py baixar     -> baixa o PDF em português de cada ato para $DIR (sandbox ok)
  python3 vade/ocr_pdfs_concordia.py ocr        -> reconhece o texto com o Vision do Mac (precisa rodar FORA do sandbox)
  python3 vade/ocr_pdfs_concordia.py gravar     -> grava em leis/texto e atualiza leis/tratados.json
IDs: vade/tratados/ocr-ids.json  {id_concordia: {"tipo": "tratado|nao-promulgado"}}"""
import json, os, re, subprocess, sys, tempfile, urllib.request
from pathlib import Path
RAIZ = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(RAIZ / 'scripts'))
import atualizar_informativos as robo  # noqa: E402
import fitz  # noqa: E402
DIR = Path(os.environ.get('OCR_DIR', RAIZ / 'vade/tratados/ocr')); DIR.mkdir(parents=True, exist_ok=True)
UA = {'User-Agent': 'Mozilla/5.0'}
IDS = json.load(open(RAIZ / 'vade/tratados/ocr-ids.json'))
def get(url):
    import time
    for t in range(5):
        try: return urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=120).read()
        except Exception as e:  # noqa: BLE001
            err = e; time.sleep(2 + 3 * t)
    raise err
def baixar():
    for i in IDS:
        if (DIR / f'{i}.pdf').exists(): continue
        try:
            a = json.loads(get(f'https://concordia.itamaraty.gov.br/ApiConcordia/Acordo/ficha-acordo/{i}'))['acordo']
            pt = [x for x in a.get('idiomasAutenticos', []) if x.get('idioma') == 'PT' and x.get('pdf')]
            if not pt: print('sem PDF PT', i, a['titulo'][:50]); continue
            (DIR / f'{i}.pdf').write_bytes(get(f'https://concordia.itamaraty.gov.br/ApiConcordia/Documento/download/{pt[0]["pdf"]["id"]}'))
            (DIR / f'{i}.json').write_text(json.dumps({k: a.get(k) for k in ('titulo', 'decretoPromulgacao', 'dataDecretoPromulgacao', 'dataCelebracao', 'vigencia', 'assuntos')}, ensure_ascii=False))
            print('baixado', i, a['titulo'][:60])
        except Exception as e:  # noqa: BLE001
            print('falhou', i, type(e).__name__)
def ocr():
    exe = Path(tempfile.mkdtemp()) / 'ocr'
    subprocess.run(['swiftc', '-O', str(RAIZ / 'scripts/ocr_mac.swift'), '-o', str(exe)], check=True, capture_output=True)
    for pdf in sorted(DIR.glob('*.pdf')):
        out = DIR / (pdf.stem + '.txt')
        if out.exists() and out.stat().st_size > 500: continue
        tmp = Path(tempfile.mkdtemp()); pngs = []
        for n, p in enumerate(fitz.open(pdf)):
            png = tmp / f'p{n:03d}.png'; p.get_pixmap(dpi=200).save(str(png)); pngs.append(str(png))
        t = subprocess.run([str(exe)] + pngs, check=True, capture_output=True, text=True).stdout.replace('<<<PAGINA>>>', '\n')
        out.write_text(t); print('ocr', pdf.stem, len(t))
def gravar():
    reg = json.load(open(RAIZ / 'leis/tratados.json'))
    for txt in sorted(DIR.glob('*.txt')):
        i = txt.stem; meta = json.load(open(DIR / f'{i}.json'))
        linhas = [re.sub(r'\s+', ' ', x).strip() for x in txt.read_text().split('\n')]
        p, bloco = [], []
        for ln in linhas:
            if not ln: continue
            if bloco and (re.match(r'^(Art\.?|Artigo|ARTIGO|§|CAP[ÍI]TULO|PARTE|ANEXO|Considerando)\b', ln) or re.search(r'[.:;]$', bloco[-1])): p.append(' '.join(bloco)); bloco = []
            bloco.append(ln)
        if bloco: p.append(' '.join(bloco))
        if sum(map(len, p)) < 1500: print('texto curto', i); continue
        dec = re.sub(r'\D', '', str(meta.get('decretoPromulgacao') or '')); ano = (meta.get('dataDecretoPromulgacao') or '')[:4]
        promulgado = bool(dec and ano)
        link = f'https://concordia.itamaraty.gov.br/acordos/{i}'
        nome = meta['titulo'] + ('' if promulgado else ' (não promulgado pelo Brasil)')
        json.dump({'nome': nome, 'url': link, 'em': robo.hoje(), 'p': p}, open(RAIZ / f'leis/texto/{robo.id_texto(link)}.json', 'w'), ensure_ascii=False)
        numero = f'Decreto nº {dec[:-3]}.{dec[-3:]}/{ano}' if promulgado and len(dec) > 3 else (f'Decreto nº {dec}/{ano}' if promulgado else 'Tratado não promulgado')
        reg['tratados'][f'{dec}/{ano}' if promulgado else f'concordia-{i}'] = {'numero': numero, 'nome': nome, 'link': link, 'fonte': 'concordia-ocr', 'concordia': int(i),
            'vigencia': meta.get('vigencia'), 'tipo': '', 'celebracao': meta.get('dataCelebracao')}
        print('gravado', i, nome[:60])
    json.dump(reg, open(RAIZ / 'leis/tratados.json', 'w'), ensure_ascii=False, indent=0)
{'baixar': baixar, 'ocr': ocr, 'gravar': gravar}[sys.argv[1]]()
