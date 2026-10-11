#!/usr/bin/env python3
"""
leis_de_pdf_local.py — Leia-me de uma lei a partir de um PDF baixado à mão (pasta "Leis" do Drive).

    python3 scripts/leis_de_pdf_local.py ARQUIVO.pdf "Lei Estadual (TO) nº 1.287/2001" ["Nome da lei"] [--link URL]

Se a lei já está no Diário de Leis (ou em leis/dos-editais.json), o texto é guardado sob o link dela. Se não está,
vai para "Citadas nos editais" (precisa de --link).
"""
import argparse, json, re, sys
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(RAIZ / "scripts"))
import leis_citadas as lc  # noqa: E402
import leis_leiame_estaduais as le  # noqa: E402
robo = lc.robo


def ocr_mac(pdf):
    """PDF escaneado (sem texto): lê com o reconhecimento de texto da Apple (Vision) — só no Mac, precisa do Swift."""
    import fitz, subprocess, tempfile
    tmp = Path(tempfile.mkdtemp())
    exe = tmp / "ocr"
    subprocess.run(["swiftc", "-O", str(RAIZ / "scripts" / "ocr_mac.swift"), "-o", str(exe)], check=True, capture_output=True)
    paginas = []
    for i, p in enumerate(fitz.open(pdf)):
        png = tmp / f"p{i:03d}.png"
        p.get_pixmap(dpi=200).save(str(png))
        paginas.append(str(png))
    out = subprocess.run([str(exe)] + paginas, check=True, capture_output=True, text=True).stdout
    return out.replace("<<<PAGINA>>>", "")


def achar_link(numero):
    s = (RAIZ / "site" / "leis" / "leis-data.js").read_text(encoding="utf-8")
    for m in re.finditer(r'\{ nome: "((?:[^"\\]|\\.)*)", numero: "([^"]*)", link: "([^"]*)"', s):
        if m.group(2) == numero:
            return m.group(1), m.group(3)
    d = json.loads((RAIZ / "leis" / "dos-editais.json").read_text(encoding="utf-8"))
    for x in d["leis"]:
        if x["numero"] == numero:
            return x["nome"], x["link"]
    return None, None


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("pdf"); ap.add_argument("numero"); ap.add_argument("nome", nargs="?"); ap.add_argument("--link")
    a = ap.parse_args()
    import fitz
    texto = "\n".join(p.get_text() for p in fitz.open(a.pdf))
    if len(texto.strip()) < 200:
        print("  PDF escaneado: lendo com OCR do Mac…")
        texto = ocr_mac(a.pdf)
    nome0, link0 = achar_link(a.numero)
    link, nome = a.link or link0, a.nome or nome0
    if not link or not nome:
        sys.exit("lei fora do Diário: passe o nome e --link")
    if not robo.salvar_texto(link, texto, nome, robo.hoje(), extrator=le.paragrafos_pdf, numero=a.numero):
        sys.exit("não gravei")
    if not link0:
        arq = RAIZ / "leis" / "dos-editais.json"
        d = json.loads(arq.read_text(encoding="utf-8"))
        d["leis"].append({"nome": nome, "numero": a.numero, "link": link})
        arq.write_text(json.dumps(d, ensure_ascii=False, indent=1), encoding="utf-8")
    print("gravado:", a.numero)


if __name__ == "__main__":
    main()
