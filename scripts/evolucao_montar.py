#!/usr/bin/env python3
"""
evolucao_montar.py — monta evolucao/mudancas.json (os dados da página "Evolução jurisprudencial") a partir de:

  curadoria/evolucao/candidatos-*.jsonl   o que o robô achou (scripts/evolucao_minerar.py)
  curadoria/evolucao/decisoes/*.json      o que foi CONFERIDO e escrito à mão: para cada mudança, o assunto, a posição
                                          antiga, a nova e qual candidato a comprova (o texto do tribunal)

Cada item da curadoria:
  {"k": "informativo:2d3a0febef",          candidato que traz a mudança (fonte:id)
   "assunto": "…", "tipo": "superacao|revisao|cancelamento|mudanca", "area": "…" (opcional),
   "antes":  {"ref": "Súmula 394/STF", "data": "1999-08-25"?, "texto": "…" | "$sumula:stf:394" | "$tema:STJ:479"},
   "depois": {"ref": "…", "data": "…", "texto": "…" | "$tese"},
   "ev": 0}                                  índice do trecho do candidato citado como prova (padrão 0)

Nada é inventado: o texto de "antes" e "depois" vem do site (súmula, tema, ementa) ou é uma transcrição/resumo fiel do
trecho que o próprio tribunal escreveu, que vai junto como "evidência".

    python3 scripts/evolucao_montar.py          # grava evolucao/mudancas.json
"""
import glob, hashlib, json, re, subprocess, sys
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
CUR = RAIZ / "curadoria" / "evolucao"
TIPOS = {"superacao": "Superação de precedente", "revisao": "Revisão de tese", "cancelamento": "Cancelamento de súmula/tema",
         "mudanca": "Mudança de entendimento"}


def carregar_candidatos():
    c = {}
    for f in sorted(glob.glob(str(CUR / "candidatos-*.jsonl"))):
        for l in open(f, encoding="utf-8"):
            x = json.loads(l)
            c[f"{x['fonte']}:{x['id']}"] = x
    return c


def candidato_do_indice(k):
    """Informativo que não foi achado pelo robô mas é citado na curadoria (qualquer julgado do índice dos informativos)."""
    global _IDX
    if "_IDX" not in globals() or _IDX is None:
        _IDX = {x[0]: x for x in json.loads((RAIZ / "informativos" / "indice.json").read_text(encoding="utf-8"))["itens"]}
    x = _IDX.get(k.split(":", 1)[1])
    if not x:
        return None
    d = x[7] or ""
    m = re.match(r"(\d{2})/(\d{2})/(\d{4})", d)
    return {"fonte": "informativo", "orgao": x[1], "id": x[0], "processo": x[6] or "", "data": f"{m[3]}-{m[2]}-{m[1]}" if m else "",
            "titulo": x[4], "informativo": x[2], "area": x[3], "tese": x[5], "trechos": [{"sinal": "indice", "trecho": x[5] or "", "refs": {}}]}


_IDX = None


def carregar_sumulas():
    arq = CUR / "sumulas.json"
    if not arq.exists():
        subprocess.run(["node", str(RAIZ / "scripts" / "evolucao_sumulas.js")], check=True)
    return {(x["trib"], str(x["numero"])): x for x in json.loads(arq.read_text(encoding="utf-8"))}


def carregar_temas():
    s = (RAIZ / "site" / "decisoes" / "rg-repetitivos-data.js").read_text(encoding="utf-8")
    j = json.JSONDecoder().raw_decode(s[s.index("["):])[0]
    return {(x["orgao"], str(x["tema"])): x for x in j}


def limpa(t):
    t = re.sub(r"^\s*\[[^\]]{3,60}\]\s*", "", t or "")
    return re.sub(r"\s+", " ", t.replace("_x000D_", " ")).strip()


def resolve(txt, cand, sumulas, temas):
    if not isinstance(txt, str):
        return ""
    if "$tese" in txt:   # "$tese" sozinho ou dentro de um texto maior
        return limpa(txt.replace("$tese", "Tese: “" + limpa(cand.get("tese")) + "”") if txt != "$tese" else cand.get("tese"))
    m = re.match(r"\$sumula:([a-z_0-9]+):(\d+)$", txt)
    if m:
        x = sumulas.get((m[1], m[2]))
        if not x:
            raise KeyError(f"súmula {m[1]} {m[2]} não existe")
        return limpa(x["texto"])
    m = re.match(r"\$tema:(STF|STJ):(\d+)$", txt)
    if m:
        x = temas.get((m[1], m[2]))
        if not x:
            raise KeyError(f"tema {m[1]} {m[2]} não existe")
        return limpa(x.get("tese"))
    return limpa(txt)


def montar():
    cands, sumulas, temas = carregar_candidatos(), carregar_sumulas(), carregar_temas()
    itens, vistos = [], set()
    for f in sorted(glob.glob(str(CUR / "decisoes" / "*.json"))):
        for it in json.loads(Path(f).read_text(encoding="utf-8")):
            cand = cands.get(it["k"]) or (candidato_do_indice(it["k"]) if it["k"].startswith("informativo:") else None)
            if not cand:
                print("candidato não achado:", it["k"], file=sys.stderr)
                continue
            if it["k"] + it.get("assunto", "") in vistos:
                continue
            vistos.add(it["k"] + it.get("assunto", ""))
            etapas_in = it.get("etapas") or [dict(it["antes"], k=None), dict(it["depois"], k=it["k"])]
            et = []
            try:
                for e in etapas_in:
                    ck = (cands.get(e["k"]) or (candidato_do_indice(e["k"]) if e["k"].startswith("informativo:") else None)) if e.get("k") else None
                    if e.get("k") and not ck:
                        raise KeyError("candidato " + e["k"])
                    base = ck or cand
                    card = ""
                    if ck:
                        card = ("inf-" + ck["id"]) if ck["fonte"] == "informativo" else (ck["id"] if ck["fonte"] == "tema" else "")
                    et.append({"ref": e.get("ref") or (rotulo_decisao(ck) if ck else ""), "data": e.get("data") or (ck or {}).get("data") or "",
                               "texto": resolve(e.get("texto", "$tese"), base, sumulas, temas), "card": card,
                               "orgao": e.get("orgao") or (ck["orgao"] if ck else "")})
            except KeyError as ex:
                print("ERRO", it["k"], ex, file=sys.stderr)
                continue
            tr = cand["trechos"][min(it.get("ev", 0), len(cand["trechos"]) - 1)]
            data = max([e["data"] for e in et if e["data"]] or [cand.get("data") or ""])
            itens.append({
                "id": hashlib.sha1((it["k"] + it.get("assunto", "")).encode()).hexdigest()[:10],
                "orgao": it.get("orgao") or cand["orgao"], "area": it.get("area") or cand.get("area") or "",
                "assunto": it["assunto"], "tipo": it["tipo"], "data": data, "etapas": et,
                "evidencia": {"texto": tr["trecho"], "fonte": rotulo_decisao(cand)},
            })
    itens.sort(key=lambda x: x["data"], reverse=True)
    saida = RAIZ / "evolucao"
    saida.mkdir(exist_ok=True)
    (saida / "mudancas.json").write_text(json.dumps({"tipos": TIPOS, "itens": itens}, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
    print(f"{len(itens)} mudança(s) em evolucao/mudancas.json")


def rotulo_decisao(c):
    if c["fonte"] == "informativo":
        return f"Informativo {c['orgao']} nº {c.get('informativo','')} — {c['processo'][:60]}".strip()
    if c["fonte"] == "tema":
        return f"Tema {c.get('tema')}/{c['orgao']}"
    return f"{c['orgao']} — {c['processo'][:60]}"


if __name__ == "__main__":
    montar()
