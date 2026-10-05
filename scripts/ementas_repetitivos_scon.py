#!/usr/bin/env python3
"""
ementas_repetitivos_scon.py — acha, nos arquivos JSON do SCON do STJ ("Espelhos de
acórdãos - … .json"), o acórdão principal de cada Tema repetitivo e guarda a ementa.

Uso (no Mac, ou onde estiverem os JSON):
    python3 scripts/ementas_repetitivos_scon.py "<pasta com os JSON do SCON>"

Lê todos os .json da pasta (inclusive subpastas; ignora node_modules). O campo
"tema" do SCON diz "Tema Repetitivo 1284"; o acórdão principal é o do próprio
recurso repetitivo (classe REsp/RMS/CC…, não agravo nem embargos), o mais antigo
que traga a tese. Grava stj/repetitivos-scon.json e roda scripts/ligar_repetitivos.py,
que junta isso ao stj/repetitivos/NN.json lido pelo Diário das Decisões.
"""
import json, os, re, subprocess, sys
RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if len(sys.argv) < 2:
    sys.exit(__doc__)
pasta = os.path.expanduser(sys.argv[1])
SECUNDARIO = re.compile(r"^(AgInt|AgRg|EDcl|EAREsp|EREsp|AR|Rcl|Pet|QO|PUIL|ProAfR|ED)\b|\bno\b", re.I)
melhores = {}
vistos = lidos = 0
for raiz, dirs, arqs in os.walk(pasta):
    dirs[:] = [d for d in dirs if d != "node_modules"]
    for a in arqs:
        if not a.lower().endswith(".json"):
            continue
        try:
            dados = json.load(open(os.path.join(raiz, a), encoding="utf-8"))
        except Exception:
            continue
        if not isinstance(dados, list):
            continue
        lidos += 1
        for x in dados:
            if not isinstance(x, dict) or not x.get("tema") or not x.get("ementa"):
                continue
            temas = re.findall(r"Tema Repetitivo\s+(\d+)", str(x["tema"]))
            if not temas or SECUNDARIO.search(str(x.get("siglaClasse") or "")):
                continue
            if str(x.get("tipoDeDecisao") or "").upper() != "ACÓRDÃO":
                continue
            vistos += 1
            for t in temas:
                chave = (bool(x.get("teseJuridica")), -int(x.get("dataDecisao") or 0))   # com tese; mais antigo
                if t not in melhores or chave > melhores[t][0]:
                    melhores[t] = (chave, x)
saida = {}
for t, (_, x) in melhores.items():
    saida[t] = {"ementa": re.sub(r"[ \t]+", " ", re.sub(r"\s*\n\s*", " ", x["ementa"])).strip(),
                "acordao": f"{x['siglaClasse']} {x['numeroProcesso']}",
                "dataAcordao": x.get("dataDecisao"),
                "decisao": re.sub(r"\s*\n\s*", " ", x.get("decisao") or "").strip(),
                "orgao": (x.get("nomeOrgaoJulgador") or "").title()}
    if x.get("teseJuridica"):
        saida[t]["tese"] = re.sub(r"\s*\n\s*", " ", x["teseJuridica"]).strip().strip('"')
json.dump(saida, open(os.path.join(RAIZ, "stj", "repetitivos-scon.json"), "w", encoding="utf-8"),
          ensure_ascii=False, separators=(",", ":"), sort_keys=True)
print(f"{lidos} arquivos lidos; {vistos} acórdãos de recurso repetitivo; {len(saida)} temas com ementa.")
subprocess.run([sys.executable, os.path.join(RAIZ, "scripts", "ligar_repetitivos.py")], check=True)
