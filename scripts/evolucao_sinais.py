#!/usr/bin/env python3
"""
evolucao_sinais.py — as duas listas "automáticas" da página Evolução jurisprudencial (as mudanças CONFERIDAS, com
antes/depois, vêm de evolucao_montar.py):

  evolucao/sinais.json    julgados em que o próprio tribunal afirma que mudou de posição (trecho transcrito, sem paráfrase),
                          um por assunto (o mais antigo do grupo), com quantos outros julgados repetem o sinal;
  evolucao/canceladas.json súmulas e orientações canceladas, superadas, revogadas ou alteradas (texto da súmula + data).

    python3 scripts/evolucao_sinais.py
"""
import glob, json, re, sys
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
CUR = RAIZ / "curadoria" / "evolucao"
sys.path.insert(0, str(RAIZ / "scripts"))
from evolucao_filtro import afirma_mudanca  # noqa: E402


def chave(c):
    """Agrupa julgados que falam da mesma mudança: mesmo Tema/Súmula/precedente citado, ou o mesmo título."""
    for t in c["trechos"][:4]:
        r = t.get("refs") or {}
        if r.get("temas"):
            return "tema:%s:%s" % (r["temas"][0][0], r["temas"][0][1] or c["orgao"])
        if r.get("sumulas"):
            return "sumula:%s:%s" % (r["sumulas"][0][0], r["sumulas"][0][1] or c["orgao"])
        if r.get("processos"):
            return "proc:%s%s" % (r["processos"][0][0], r["processos"][0][1])
    return "sem:" + re.sub(r"\W+", " ", (c.get("titulo") or "")[:50]).lower()


def trecho_central(c):
    ts = [t for t in c["trechos"] if t["sinal"] not in ("indice",)]
    # prefere o trecho que traz o verbo de mudança
    from evolucao_filtro import POS
    for t in ts:
        if POS.search(t["trecho"]):
            return t
    return ts[0]


def card_de(c):
    if c["fonte"] == "informativo":
        return "inf-" + c["id"]
    if c["fonte"] == "tema":
        return c["id"]
    if c["fonte"] == "acordao":
        return ("stj-acordao-" if c["orgao"] == "STJ" else "stf-acordao-") + c["id"]
    return ""


def montar_sinais():
    usados = set()
    for f in glob.glob(str(CUR / "decisoes" / "*.json")):
        for it in json.loads(Path(f).read_text(encoding="utf-8")):
            usados.add(it["k"])
            for e in it.get("etapas") or []:
                if e.get("k"):
                    usados.add(e["k"])
    grupos = {}
    for f in sorted(glob.glob(str(CUR / "candidatos-*.jsonl"))):
        for l in open(f, encoding="utf-8"):
            c = json.loads(l)
            if f"{c['fonte']}:{c['id']}" in usados or not afirma_mudanca(c):
                continue
            grupos.setdefault((c["orgao"], chave(c)), []).append(c)
    itens = []
    for (org, k), v in grupos.items():
        v.sort(key=lambda c: c.get("data") or "9")
        c = v[0]
        t = trecho_central(c)
        tx = t["trecho"]
        itens.append({
            "id": f"{c['fonte'][:3]}-{c['id']}", "orgao": org, "data": c.get("data") or "", "area": c.get("area") or "",
            "ref": c["processo"][:70].strip(), "titulo": re.sub(r"\s+", " ", (c.get("titulo") or ""))[:230],
            "trecho": tx[:620], "card": card_de(c), "fonte": c["fonte"], "outros": len(v) - 1,
            "ate": (v[-1].get("data") or "") if len(v) > 1 else "",
        })
    itens.sort(key=lambda x: x["data"], reverse=True)
    (RAIZ / "evolucao").mkdir(exist_ok=True)
    (RAIZ / "evolucao" / "sinais.json").write_text(json.dumps({"itens": itens}, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
    print(f"{len(itens)} sinal(is) de mudança em evolucao/sinais.json")


RX_MARCA = re.compile(r"^\s*\[([^\]]{3,60})\]\s*")
RX_DATA = re.compile(r"\((?:Cancelada|Revogada|Superada|Alterada)[^)]*?(\d{2})/(\d{2})/(\d{4})[^)]*\)", re.I)
PRINCIPAIS = ("stf", "stf_vinculante", "stj", "tst", "tse", "tnu", "tcu", "stm")


def montar_canceladas():
    arq = CUR / "sumulas.json"
    dados = json.loads(arq.read_text(encoding="utf-8"))
    itens = []
    for x in dados:
        m = RX_MARCA.match(x["texto"] or "")
        if not m:
            continue
        st = m.group(1).upper()
        if not re.search(r"CANCELAD|REVOGAD|SUPERAD|ALTERAD", st):
            continue
        txt = RX_MARCA.sub("", x["texto"])
        d = RX_DATA.search(txt)
        itens.append({"trib": x["trib"], "tribunal": x["label"], "numero": x["numero"], "status": st.replace("SÚMULA ", "").title(),
                      "data": f"{d[3]}-{d[2]}-{d[1]}" if d else "", "texto": re.sub(r"\s+", " ", RX_DATA.sub("", txt)).strip()[:700],
                      "principal": x["trib"] in PRINCIPAIS or x["trib"].startswith("tst")})
    itens.sort(key=lambda x: (not x["principal"], x["tribunal"], int(re.sub(r"\D", "", str(x["numero"])) or 0)))
    (RAIZ / "evolucao" / "canceladas.json").write_text(json.dumps({"itens": itens}, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
    print(f"{len(itens)} súmula(s)/orientação(ões) cancelada(s) em evolucao/canceladas.json")


if __name__ == "__main__":
    montar_sinais()
    montar_canceladas()
