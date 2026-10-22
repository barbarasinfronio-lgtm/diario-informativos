#!/usr/bin/env python3
"""
temas_novos.py — traz para o Diário das Decisões os Temas novos de repercussão geral (STF) e de recursos repetitivos
(STJ) que ainda não estão em site/decisoes/rg-repetitivos-data.js.

  STF  portal.stf.jus.br/jurisprudenciaRepercussao/tema.asp?num=N   (uma página por Tema)
       Entra o Tema que já tem MÉRITO julgado/publicado e repercussão geral reconhecida (é o critério do acervo: o STF
       tem centenas de Temas só com "repercussão geral reconhecida" ou "em julgamento", que não entram).
       A tese fixada não vem nessa página; o card mostra a questão e o link do processo (a tese entra quando o
       acórdão for baixado, pelo "Completar Teses STF.command").
  STJ  processo.stj.jus.br/repetitivos/temas_repetitivos/pesquisa.jsp  (consulta por faixa de Temas)
       Entra todo Tema novo, afetado ou julgado (o acervo já tem os afetados); Temas antigos que mudaram de situação
       são só apontados no relatório.

    python3 scripts/temas_novos.py             # só mostra o que entraria
    python3 scripts/temas_novos.py --gravar    # grava em rg-repetitivos-data.js
    python3 scripts/temas_novos.py --teste-stj 1470 1474   # confere o leitor do STJ com Temas que já existem

Roda no Mac ou no GitHub (os dois portais respondem a leitura simples); em caso de falha de rede o que sobrou fica
para a próxima.
"""
import argparse, html, json, re, subprocess, sys, time
from datetime import datetime, timedelta, timezone
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
DADOS = RAIZ / "site" / "decisoes" / "rg-repetitivos-data.js"
UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 Safari/605.1.15"


def hoje():
    return (datetime.now(timezone.utc) - timedelta(hours=3)).strftime("%d/%m/%Y")


def curl(url, post=None):
    """curl em vez de urllib: os dois portais cortam a resposta em pedaços ("IncompleteRead") com o urllib."""
    cmd = ["curl", "-sS", "-m", "60", "-A", UA]
    if post:
        cmd += ["-d", post]
    for t in range(4):
        r = subprocess.run(cmd + [url], capture_output=True)
        if r.returncode == 0 and len(r.stdout) > 3000:
            return r.stdout
        time.sleep(2 + 3 * t)
    return b""


def texto(b):
    try:
        s = b.decode("utf-8")
    except UnicodeDecodeError:
        s = b.decode("latin-1")
    s = re.sub(r"(?is)<(script|style)\b.*?</\1>", "", s)
    t = html.unescape(re.sub(r"<[^>]+>", "\n", s)).replace("\xa0", " ").replace("\r", "")
    t = re.sub(r"[ \t]*\n\s*", "\n", t)
    if "Ã" in t[:5000]:          # página em UTF-8 lida como latin-1
        try:
            t = t.encode("latin-1").decode("utf-8")
        except Exception:  # noqa: BLE001
            pass
    return t


def area(s):
    s = (s or "").strip().lower()
    return " ".join(p if p in ("do", "da", "de", "e") else p.capitalize() for p in s.split())


def carregar():
    s = DADOS.read_text(encoding="utf-8")
    return s, json.loads(s[s.index("["): s.rindex("]") + 1])


# ---------------- STF ----------------
def stf_tema(n):
    t = texto(curl(f"https://portal.stf.jus.br/jurisprudenciaRepercussao/tema.asp?num={n}"))
    i = t.find("Tema:"); j = t.find("Mapa do Site")
    t = t[i:j] if i >= 0 else t
    m = re.search(r"Tema:\n(\d+)\nT[íi]tulo:\n(.*?)\nDescri[çc][ãa]o:\s*(.*?)\nVer assuntos:\n(.*?)\nInforma[çc][õo]es gerais", t, re.S)
    if not m or m.group(1) == "0000":
        return None
    g = lambda r: (re.search(r, t) or [None, None])[1]  # noqa: E731
    return {"tema": m.group(1), "titulo": re.sub(r"\s+", " ", m.group(2)).strip().rstrip("."), "questao": re.sub(r"\s+", " ", m.group(3)).strip(),
            "assuntos": [x for x in m.group(4).split("\n") if x.strip()], "processo": g(r"Leading Case:\n([^\n]*)"),
            "ministro": g(r"Ministro:\n([^\n]*)"), "rg": g(r"Repercuss[ãa]o geral:\n([^\n]*)") or "", "situacao": g(r"\nSitua[çc][ãa]o:\n([^\n]*)") or ""}


def stf_incidente(n):
    b = curl(f"https://portal.stf.jus.br/jurisprudenciaRepercussao/tema.asp?num={n}").decode("latin-1", "ignore")
    m = re.search(r"/processos/detalhe\.asp\?incidente=(\d+)", b)
    return m.group(1) if m else None


def stf_entra(x):
    return bool(re.search(r"M[ée]rito julgado|m[ée]rito publicado|Tr[âa]nsito em Julgado", x["situacao"], re.I)) and not x["rg"].lower().startswith("n")


def stf(dados):
    tem = {int(d["tema"]) for d in dados if d.get("orgao") == "STF" and d.get("tipo") == "rg" and str(d.get("tema", "")).isdigit()}
    topo = max(tem)
    novos, vazios, n = [], 0, topo - 60
    while True:
        n += 1
        if n in tem:
            continue
        x = stf_tema(n)
        if not x:
            vazios += 1
            if n > topo and vazios >= 4:
                break
            continue
        vazios = 0
        if n > topo or stf_entra(x):
            print(f"  STF Tema {n}: {x['situacao'][:60]} -> {'ENTRA' if stf_entra(x) else 'não entra (sem mérito)'}")
        if stf_entra(x):
            x["incidente"] = stf_incidente(n)
            novos.append(x)
    return novos


def registro_stf(x, id_):
    pub = re.search(r"(\d\d/\d\d/\d{4})", x["situacao"])
    data = pub.group(1) if pub else hoje()
    ass = [a for a in x["assuntos"] if re.match(r"\d+-", a)]
    ramo = area(re.sub(r"^\d+-", "", ass[0])) if ass else "Direito Constitucional"
    ramo = {"Direito Administrativo E Outras Matérias De Direito Público": "Direito Administrativo"}.get(ramo, ramo)
    ramo = re.sub(r" [Ee] [Oo]utras.*", "", ramo).replace("Direito Processual Civil E Do Trabalho", "Direito Processual Civil")
    reafirm = "reafirma" in x["rg"].lower()
    min_ = re.sub(r"^(MIN\.|MINISTRO|MINISTRA)\s*", "", x["ministro"] or "", flags=re.I).title()
    rec = {"id": id_, "tema": x["tema"], "area": ramo, "orgao": "STF", "tipo": "rg", "titulo": x["titulo"], "tese": x["titulo"], "destaque": x["titulo"],
           "processo": x["processo"] or "", "relator": "Presidência do STF" if re.search(r"presidente", x["ministro"] or "", re.I) else (min_ or "—"),
           "data": data, "info": "", "status": "vigente", "risco": "Alta",
           "motivo": "julgado em 2026 (tese muito recente)" + ("; reafirmação de jurisprudência" if reafirm else "") + "; tema novo importado do portal do STF"}
    if x.get("incidente"):
        rec["link"] = f"https://portal.stf.jus.br/processos/detalhe.asp?incidente={x['incidente']}"
    rec["historico"] = "Assunto: " + " | ".join(ass[:3]) if ass else ""
    rec["questao"] = x["questao"]
    return rec


# ---------------- STJ ----------------
def stj_pagina(ini, fim):
    corpo = (f"novaConsulta=true&quantidadeResultadosPorPagina=50&tipo_pesquisa=T&cod_tema_inicial={ini}&cod_tema_final={fim}"
             "&ordenacaoCriterio=ASC&ordenacaoDecrescente=false")
    return texto(curl("https://processo.stj.jus.br/repetitivos/temas_repetitivos/pesquisa.jsp", post=corpo))


def stj_blocos(t):
    out = []
    for b in re.split(r"\nDocumento \d+\n", t)[1:]:
        m = re.search(r"Tema Repetitivo\n(\d+)", b)
        if not m:
            continue
        g = lambda r, s=b: (re.search(r, s, re.S) or [None, None])[1]  # noqa: E731
        proc = re.search(r"\n((?:REsp|RMS|CC|RHC|HC|AREsp|Pet|PUIL|ProAfR)\s[\d.]+)/([A-Z]{2})\n", b)
        ass = re.findall(r"\d+\.\s*\((\d+)\)\s*([^\n;.]+)", b.split("Selecionar")[0])
        rel = g(r"\nRelator\n([^\n]+)")
        dat = re.search(r"\nAfeta[çc][ãa]o\n(\d\d/\d\d/\d{4})", b)
        jul = re.search(r"\nJulgado em\n(\d\d/\d\d/\d{4})", b)
        out.append({"tema": m.group(1), "situacao": (g(r"\nSitua[çc][ãa]o\n([^\n]+)") or "").strip(), "orgao": g(r"\n[ÓO]rg[ãa]o julgador\n([^\n]+)"),
                    "ramo": g(r"\nRamo do direito\n([^\n]+)"), "questao": re.sub(r"\s+", " ", g(r"\nQuest[ãa]o submetida a julgamento\n(.*?)\n(?:Anota|Tese|Informa|Controv)") or "").strip(),
                    "tese": re.sub(r"\s+", " ", g(r"\nTese Firmada\n(.*?)\n(?:Anota|Informa|Controv|Ac[óo]rd[ãa]o)") or "").strip(),
                    "processo": proc and proc.group(1).strip(), "relator": rel and rel.title().replace(" De ", " de ").replace(" Da ", " da ").replace(" Do ", " do "),
                    "data": (jul or dat).group(1) if (jul or dat) else "", "assuntos": [f"{a}- {d.strip()}" for a, d in ass]})
    return out


def stj_stat(s):
    s = s.lower()
    if "afetad" in s or "em julgamento" in s or "proposta de afeta" in s:
        return "afetado"
    if "cancel" in s or "supera" in s or "revisad" in s:
        return "cancelado_superado"
    return "vigente"


def registro_stj(x, id_, modelo_link):
    st = stj_stat(x["situacao"])
    n = x["tema"]
    q = re.sub(r"^Definir (se )?", "", x["questao"]).strip()
    titulo = (q[:1].upper() + q[1:]).rstrip(".") if q else f"Tema repetitivo {n}"
    tese = x["tese"] or ("Questão submetida a julgamento: " + x["questao"])
    rec = {"id": id_, "tema": n, "area": area(x["ramo"]) or "Direito Civil", "orgao": "STJ", "tipo": "repetitivo", "titulo": titulo, "questao": x["questao"], "tese": tese,
           "processo": x["processo"] or "", "relator": x["relator"] or "—", "data": x["data"], "info": None, "status": st,
           "risco": "Alta",
           "motivo": ("tema afetado e ainda pendente de julgamento — costuma ser cobrado assim que é julgado" if st == "afetado" else "tema novo julgado; tese muito recente"),
           "destaque": tese, "link": re.sub(r"cod_tema_inicial=\d+&cod_tema_final=\d+", f"cod_tema_inicial={n}&cod_tema_final={n}", modelo_link),
           "historico": "Assunto: " + ", ".join(x["assuntos"][:3])}
    return rec


def stj(dados, minimo=None):
    tem = {d["tema"]: d for d in dados if d.get("orgao") == "STJ" and d.get("tipo") == "repetitivo"}
    topo = max(int(k) for k in tem if str(k).isdigit())
    recentes = [k for k in tem if str(k).isdigit() and int(k) > topo - 40]
    blocos = stj_blocos(stj_pagina(topo - 39, topo + 60))
    novos, mudou = [], []
    for b in blocos:
        if b["tema"] in tem:
            antigo = tem[b["tema"]]
            if stj_stat(b["situacao"]) != antigo.get("status") and antigo.get("status") != "cancelado_superado":
                mudou.append((b["tema"], antigo.get("status"), b["situacao"]))
        else:
            novos.append(b)
    return novos, mudou, blocos, tem


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--gravar", action="store_true")
    ap.add_argument("--teste-stj", nargs=2, type=int)
    a = ap.parse_args()
    s, dados = carregar()
    if a.teste_stj:
        for b in stj_blocos(stj_pagina(*a.teste_stj)):
            ex = next((d for d in dados if d.get("orgao") == "STJ" and d["tema"] == b["tema"]), None)
            print(b["tema"], b["situacao"], "|", b["processo"], "|", b["relator"], "|", b["data"], "|", b["ramo"])
            if ex:
                print("   existente:", ex.get("status"), "|", ex.get("processo"), "|", ex.get("relator"), "|", ex.get("data"), "|", ex.get("area"),
                      "| questão igual:", (ex.get("questao") or "").strip() == b["questao"])
        return 0
    prox = max(d["id"] for d in dados) + 1
    novos = []
    print("STF: conferindo os Temas ao redor do último do acervo…")
    for x in stf(dados):
        novos.append(registro_stf(x, prox)); prox += 1
    print("STJ: conferindo os Temas repetitivos…")
    nj, mudou, blocos, tem = stj(dados)
    modelo = next((d["link"] for d in dados if d.get("orgao") == "STJ" and d.get("link")), "")
    for b in nj:
        print(f"  STJ Tema {b['tema']}: {b['situacao']} -> ENTRA ({b['questao'][:70]})")
        novos.append(registro_stj(b, prox, modelo)); prox += 1
    for t, ant, atual in mudou:
        print(f"  STJ Tema {t}: situação mudou de {ant} para {atual} (atualize à mão)")
    print(f"{len(novos)} Tema(s) novo(s).")
    if not a.gravar or not novos:
        return 0
    fim = s.rindex("]")
    bloco = json.dumps(novos, ensure_ascii=False, indent=1)[1:-2]        # sem "[" e "\n]": as entradas já vêm com 1 espaço de recuo
    s = s[:fim].rstrip() + ",\n" + bloco.lstrip("\n") + "\n" + s[fim:]
    DADOS.write_text(s, encoding="utf-8")
    json.loads(s[s.index("["): s.rindex("]") + 1])                        # conferência: continua JSON válido
    print("Gravado em", DADOS.relative_to(RAIZ))
    return 0


if __name__ == "__main__":
    sys.exit(main())
