#!/usr/bin/env python3
"""
cobrancas_foruns.py — quais enunciados de fóruns (FONAJE, FPPC, ENFAM…) já caíram em prova.

Lê os textos das provas (pasta "Provas/_texto" do Mac; o caminho vem de provas/pasta-das-provas.txt) e, para cada
fórum, olha só as JANELAS em volta de onde a prova cita o fórum (a sigla ou o nome por extenso). Um enunciado conta
como "cobrado" quando, numa janela:
  (a) a prova o cita pelo número ("Enunciado nº 135 do Fórum Permanente…", "Enunciados nº 6 e 26 da I Jornada…"), ou
  (b) a prova reproduz o conteúdo dele (cobertura >= LIMITE de trechos de 4 palavras seguidas do enunciado).

Grava provas/enunciados-cobrados.json: {fórum: {número: [arquivos de prova]}}.

Uso:  python3 scripts/cobrancas_foruns.py [fonaje ...]
"""
import json, re, sys, unicodedata
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
LIMITE = 0.55      # cobertura mínima de trechos de 4 palavras (caso b)
JANELA = 1800      # caracteres antes e depois da citação do fórum
K = 4

_FONAJE_AMPLO = r"FONAJE|Fórum Nacional de Juizados|Juizados Especiais"
_FONAJE_ESPECIFICO = r"FONAJE|Fórum Nacional de Juizados|enunciados?[^.]{0,80}Juizados|Juizados[^.]{0,80}enunciados?"
FORUNS = {   # (onde olhar = o fórum ou o assunto, citação específica do fórum, tipo)
    "fonaje_civel": (_FONAJE_AMPLO, _FONAJE_ESPECIFICO, "fonaje"),
    "fonaje_criminal": (_FONAJE_AMPLO, _FONAJE_ESPECIFICO, "fonaje"),
    "fonaje_fazenda": (_FONAJE_AMPLO, _FONAJE_ESPECIFICO, "fonaje"),
    "fppc": (r"FPPC|Processualistas Civis|Fórum Permanente de Processualistas", r"FPPC|Processualistas", "fppc"),
    "enfam_cpc": (r"ENFAM|Enfam|Escola Nacional de Formação", r"ENFAM|Enfam", "enfam"),
}


def norm(s):
    s = unicodedata.normalize("NFD", (s or "").lower())
    s = "".join(c for c in s if unicodedata.category(c) != "Mn")
    return re.sub(r"[^a-z0-9]+", " ", s).strip()


def trechos(t):
    w = norm(t).split()
    return {" ".join(w[i:i + K]) for i in range(len(w) - K + 1)}


def pasta_textos():
    base = Path((RAIZ / "provas" / "pasta-das-provas.txt").read_text(encoding="utf-8").strip())
    return base / "_texto"


def janelas(rx):
    """[(arquivo, texto da janela)] — uma por citação do fórum, janelas vizinhas juntadas."""
    out = []
    for f in sorted(pasta_textos().rglob("*.txt")):
        t = f.read_text(encoding="utf-8", errors="replace")
        pos = [m.start() for m in re.finditer(rx, t)]
        if not pos:
            continue
        ini = fim = None
        for p in pos:
            a, b = max(0, p - JANELA), min(len(t), p + JANELA)
            if ini is not None and a <= fim:
                fim = b
            else:
                if ini is not None:
                    out.append((f.name, t[ini:fim]))
                ini, fim = a, b
        out.append((f.name, t[ini:fim]))
    return out


def cobrados(chave, enunciados):
    """enunciados: [(numero, texto)] → {numero: [arquivos]}"""
    rx, rx_esp, tipo = FORUNS[chave]
    achados = {}
    for arq, j in janelas(rx):
        nj, tj = norm(j), trechos(j)
        especifica = bool(re.search(rx_esp, j))
        for num, texto in enunciados:
            ts = trechos(texto)
            ok = False
            if len(ts) >= 4 and len(ts & tj) / len(ts) >= LIMITE:
                ok = True
            if not ok and especifica:                    # (c) as alternativas da prova reaproveitam as palavras do enunciado
                pal = {w for w in norm(texto).split() if len(w) >= 6}
                if len(pal) >= 6 and len(pal & set(nj.split())) / len(pal) >= 0.65:
                    ok = True
            if not ok and tipo in ("fppc", "enfam"):   # só nesses o número vale sozinho (a sigla já está na janela)
                if re.search(r"enunciados?\s+(?:n[ºo.]*\s*)?(?:[\d]+\s*(?:,|e)\s*)*0*%d\b" % num, nj):
                    ok = True
            if ok:
                achados.setdefault(str(num), [])
                if arq not in achados[str(num)]:
                    achados[str(num)].append(arq)
    return achados


def main():
    sys.path.insert(0, str(RAIZ / "scripts"))
    import enunciados_foruns as F
    quais = sys.argv[1:] or ["fonaje", "enfam", "fppc"]
    saida = RAIZ / "provas" / "enunciados-cobrados.json"
    res = json.loads(saida.read_text(encoding="utf-8")) if saida.exists() else {}
    for chave, rotulo, url, itens in F.blocos_todos():
        if chave.split("_")[0] not in quais:
            continue
        en = [(n, t) for n, t, nota, sit in itens if t]
        res[chave] = cobrados(chave, en)
        print(f"{rotulo}: {len(res[chave])} enunciado(s) já cobrado(s): {sorted(map(int, res[chave]))}")
    saida.write_text(json.dumps(res, ensure_ascii=False, indent=1), encoding="utf-8")


if __name__ == "__main__":
    main()
