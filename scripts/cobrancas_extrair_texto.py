"""
cobrancas_extrair_texto.py — tira o texto dos PDFs da pasta Provas (no Mac)
para scripts/cobrancas_todas_etapas.py. Guarda em <Provas>/_texto/ (mesma
estrutura de pastas), e só refaz o que mudou.

Uso:  python3 scripts/cobrancas_extrair_texto.py "<pasta Provas>"
Precisa de PyMuPDF (pip install pymupdf). PDF só com imagem (escaneado) passa
por OCR (Vision do macOS) com <Provas>/_scripts/ocr (compilado de ocr.swift:
swiftc -O ocr.swift -o ocr); sem ele, é só listado no fim.
"""
import os, subprocess, sys, fitz
RAIZ = sys.argv[1]
SAIDA = os.path.join(RAIZ, "_texto")
TIPOS = ("01 Objetivas", "02 Discursivas", "03 Sentenças", "04 Oral", "ENAM")
vazios, feitos = [], 0
for tipo in TIPOS:
    for pasta, _, arqs in os.walk(os.path.join(RAIZ, tipo)):
        for a in arqs:
            if not a.lower().endswith(".pdf"):
                continue
            orig = os.path.join(pasta, a)
            dest = os.path.join(SAIDA, os.path.relpath(orig, RAIZ))[:-4] + ".txt"
            if os.path.exists(dest) and os.path.getmtime(dest) >= os.path.getmtime(orig):
                continue
            try:
                txt = "".join(p.get_text() for p in fitz.open(orig))
            except Exception as e:
                print("erro:", orig, e); continue
            os.makedirs(os.path.dirname(dest), exist_ok=True)
            open(dest, "w", encoding="utf-8").write(txt)
            feitos += 1
            if len(txt.strip()) < 200:
                ocr = os.path.join(RAIZ, "_scripts", "ocr")
                if os.path.exists(ocr):
                    subprocess.run([ocr, orig, dest], capture_output=True)
                    if os.path.getsize(dest) >= 200:
                        print("OCR:", os.path.relpath(orig, RAIZ)); continue
                vazios.append(os.path.relpath(orig, RAIZ))
print(feitos, "PDFs convertidos;", len(vazios), "sem texto (precisam de OCR)")
for v in vazios[:80]:
    print("  sem texto:", v)
