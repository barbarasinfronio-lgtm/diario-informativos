#!/usr/bin/env python3
"""
jornadas_cjf.py — enunciados das Jornadas do CJF (Conselho da Justiça Federal) para o Diário das Súmulas.

Fonte: a base de pesquisa de enunciados do CJF (https://www.cjf.jus.br/enunciados/), aberta, sem captcha.
São ~28 Jornadas (Direito Civil I–X, Comercial, Processual Civil, Prevenção e Solução Extrajudicial de Litígios,
Saúde, Administrativo, Tributário, Seguridade Social, Penal, Notarial e Registral, Desportivo, Equidade Racial…).

Duas etapas:
  1. coletar — lista os enunciados de cada Jornada (1 consulta por Jornada) e abre a página de cada enunciado para
               pegar comissão, referência legislativa, palavras de resgate e justificativa. É um site público de um
               órgão federal: o robô é EDUCADO (uma página por vez, pausa entre elas e para se o servidor recusar).
               Guarda tudo em ~/EstudaMana/cache-cjf-enunciados/ (fora do repositório); o que já veio não é baixado
               de novo, então pode interromper (Ctrl+C) e retomar.
  2. montar  — lê o cache e grava:
                 site/sumulas/jornadas-data.js  (os blocos das Jornadas, para o Diário das Súmulas)
                 jornadas/justificativas/NN.json (justificativas, baixadas só quando a pessoa abre o enunciado)

Uso:
    python3 scripts/jornadas_cjf.py coletar [--so-listas] [--jornada "Civil"]
    python3 scripts/jornadas_cjf.py montar
"""
import argparse, html, json, random, re, sys, time, urllib.error, urllib.parse, urllib.request, http.client
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
CACHE = Path.home() / "EstudaMana" / "cache-cjf-enunciados"
BASE = "https://www.cjf.jus.br/enunciados"
PAUSA = 1.2          # segundos entre páginas


class Bloqueio(Exception):
    pass


_ultimo = [0.0]


def _pedir(url, dados=None, tentativas=5):
    espera = 20
    for _ in range(tentativas):
        folga = PAUSA + random.random() * 0.6 - (time.time() - _ultimo[0])
        if folga > 0:
            time.sleep(folga)
        try:
            corpo = urllib.parse.urlencode(dados).encode() if dados is not None else None
            req = urllib.request.Request(url, corpo, {"User-Agent": "Mozilla/5.0 (Estuda Mana; estudo)"})
            with urllib.request.urlopen(req, timeout=60) as r:
                t = r.read().decode("utf-8", "replace")
            _ultimo[0] = time.time()
            return t
        except urllib.error.HTTPError as e:
            _ultimo[0] = time.time()
            if e.code == 404:
                return None
            print(f"  (servidor respondeu {e.code}; esperando {espera}s)", flush=True)
        except (OSError, http.client.HTTPException) as e:
            _ultimo[0] = time.time()
            print(f"  (falha de rede: {str(e)[:80]}; esperando {espera}s)", flush=True)
        time.sleep(espera)
        espera *= 2
    raise Bloqueio("o CJF recusou as consultas seguidas; parei. Rode de novo mais tarde (o que já veio fica guardado).")


def limpo(s):
    return re.sub(r"[ \t ]+", " ", re.sub(r"\s*\n\s*", "\n", html.unescape(re.sub(r"<[^>]+>", "\n", s or "")))).strip()


def jornadas():
    t = _pedir(BASE + "/")
    sel = re.search(r'(?s)<select[^>]*name="jornada\.id"[^>]*>(.*?)</select>', t)
    return [(int(v), re.sub(r"\s+", " ", html.unescape(n)).strip()) for v, n in re.findall(r'<option value="(\d+)"[^>]*>([^<]+)', sel.group(1))
            if "Apresenta" not in html.unescape(n)]


def listar(jid):
    """[(id, número, texto)] dos enunciados de uma Jornada (uma consulta)."""
    t = _pedir(BASE + "/pesquisa/resultado", {"buscaLivre": "", "jornada.id": str(jid), "tipoComissao.id": "",
                                                "referenciasLegislativas[0].norma.id": ""})
    out = []
    for m in re.finditer(r'(?s)<li><a href="/enunciados/enunciado/(\d+)">(.*?)</a>\s*<p class="pesquisa-enunciado-descricao">(.*?)</p>', t or ""):
        n = re.search(r"Enunciado\s+(\S+)", limpo(m.group(2)))
        out.append((int(m.group(1)), n.group(1) if n else "", limpo(m.group(3))))
    return out


def detalhe(eid):
    t = _pedir(f"{BASE}/enunciado/{eid}")
    if not t:
        return None
    corpo = re.search(r'(?s)(Enunciado \d+.*?)Conselho da Justi', t)
    txt = limpo(corpo.group(1) if corpo else t)
    def campo(rotulo, ate):
        m = re.search(rotulo + r"\n(.*?)\n(?:" + ate + r")", txt, re.S)
        return re.sub(r"\s*\n\s*", " ", m.group(1)).strip() if m else ""
    rot = r"Jornada|Coordenador-Geral|Comissão de Trabalho|Coordenador da Comissão de Trabalho|Número|Enunciado|Justificativa|Referência Legislativa|Palavras de Resgate"
    d = {"jornada": campo("Jornada", rot), "comissao": campo("Comissão de Trabalho", rot),
         "numero": campo("Número", rot), "enunciado": campo("Enunciado", rot)}
    m = re.search(r"\nPalavras de Resgate\n(.*)$", txt, re.S)
    d["palavras"] = re.sub(r"\s*\n\s*", " ", m.group(1)).strip() if m else ""
    m = re.search(r"Referência Legislativa\n(.*?)(?:\nPalavras de Resgate|$)", txt, re.S)
    d["referencia"] = re.sub(r"\s*\n\s*", " ", m.group(1)).strip() if m else ""
    # a justificativa mantém os parágrafos; o resto é de uma linha só
    m = re.search(r"\nJustificativa\n(.*?)(?:\nReferência Legislativa|\nPalavras de Resgate|$)", txt, re.S)
    d["justificativa"] = re.sub(r"[ \t]*\n[ \t]*", " ", m.group(1)).strip() if m else ""
    return d


def coletar(so_listas=False, filtro=None):
    (CACHE / "listas").mkdir(parents=True, exist_ok=True)
    (CACHE / "detalhes").mkdir(parents=True, exist_ok=True)
    todas = jornadas()
    print(len(todas), "Jornadas na base do CJF")
    for jid, nome in todas:
        if filtro and filtro.lower() not in nome.lower():
            continue
        arq = CACHE / "listas" / f"{jid}.json"
        itens = listar(jid)
        arq.write_text(json.dumps({"id": jid, "nome": nome, "itens": itens}, ensure_ascii=False), encoding="utf-8")
        print(f"{nome}: {len(itens)} enunciados", flush=True)
    if so_listas:
        return
    ids = []
    for f in sorted((CACHE / "listas").glob("*.json")):
        j = json.loads(f.read_text(encoding="utf-8"))
        if filtro and filtro.lower() not in j["nome"].lower():
            continue
        ids += [(i[0], j["nome"]) for i in j["itens"]]
    faltam = [(i, n) for i, n in ids if not (CACHE / "detalhes" / f"{i}.json").exists()]
    print(f"{len(ids)} enunciados; {len(faltam)} páginas a abrir (≈ {len(faltam) * (PAUSA + 0.3) / 60:.0f} min)", flush=True)
    for k, (eid, nome) in enumerate(faltam, 1):
        d = detalhe(eid)
        (CACHE / "detalhes" / f"{eid}.json").write_text(json.dumps(d or {}, ensure_ascii=False), encoding="utf-8")
        if k % 50 == 0 or k == len(faltam):
            print(f"  {k}/{len(faltam)} ({nome})", flush=True)


# ------------------------------------------------------------------ montar ----
# Um "tribunal" do Diário das Súmulas por ÁREA (as edições de uma mesma área seguem a numeração do CJF).
AREAS = [
    ("cjf_civil", "CJF — Jornadas de Direito Civil", r"Direito Civil"),
    ("cjf_comercial", "CJF — Jornadas de Direito Comercial", r"Direito Comercial"),
    ("cjf_processual_civil", "CJF — Jornadas de Direito Processual Civil", r"Processual Civil"),
    ("cjf_litigios", "CJF — Jornadas de Prevenção e Solução Extrajudicial de Litígios", r"Prevenção e Solução Extrajudicial"),
    ("cjf_saude", "CJF — Jornada de Direito da Saúde", r"Direito da Saúde"),
    ("cjf_administrativo", "CJF — Jornada de Direito Administrativo", r"Direito Administrativo"),
    ("cjf_seguridade", "CJF — Jornada de Direito da Seguridade Social", r"Seguridade Social"),
    ("cjf_tributario", "CJF — Jornada de Direito Tributário", r"Direito Tributário"),
    ("cjf_penal", "CJF — Jornada de Direito e Processo Penal", r"Processo Penal"),
    ("cjf_notarial", "CJF — Jornada de Direito Notarial e Registral", r"Notarial e Registral"),
    ("cjf_desportivo", "CJF — Jornada de Direito Desportivo", r"Desportivo"),
    ("cjf_patrimonio", "CJF — Jornada de Direito do Patrimônio Cultural e Natural", r"Patrimônio Cultural"),
    ("cjf_ambiental", "CJF — Jornada de Prevenção e Gerenciamento de Crises Ambientais", r"Crises Ambientais"),
    ("cjf_racial", "CJF — Jornada da Justiça Federal pela Equidade Racial", r"Equidade Racial"),
]
ROMANOS = {"I": 1, "II": 2, "III": 3, "IV": 4, "V": 5, "VI": 6, "VII": 7, "VIII": 8, "IX": 9, "X": 10}


def ordem_jornada(nome):
    m = re.match(r"([IVX]+)\s", nome)
    return ROMANOS.get(m.group(1), 0) if m else 0


def lista_de_dados():
    """Une listas + detalhes do cache: uma linha por enunciado."""
    out = []
    for f in sorted((CACHE / "listas").glob("*.json")):
        j = json.loads(f.read_text(encoding="utf-8"))
        for eid, num, texto in j["itens"]:
            det = {}
            arq = CACHE / "detalhes" / f"{eid}.json"
            if arq.exists():
                det = json.loads(arq.read_text(encoding="utf-8")) or {}
            out.append(dict(id=eid, jornada=j["nome"], numero=det.get("numero") or num, texto=det.get("enunciado") or texto,
                            comissao=det.get("comissao", ""), referencia=det.get("referencia", ""), palavras=det.get("palavras", ""),
                            justificativa=det.get("justificativa", "")))
    return out


def js(x):
    return json.dumps(x, ensure_ascii=False)


def formata_ref(raw):
    """"Norma: Código Civil 2002 - Lei n. 10.406/2002 ART: 206 INC:V PAR:3; ART: 5;" → "Código Civil 2002 (Lei n. 10.406/2002): art. 206, § 3º, inc. V; art. 5º"."""
    partes = []
    for seg in re.split(r"Norma:\s*", raw or ""):
        seg = seg.strip()
        if not seg:
            continue
        nome = re.split(r"\s+ART:", seg, 1)[0].strip().rstrip(";").strip()
        nome = re.sub(r"\s+-\s+(Lei|Decreto|Resolução|Emenda|Portaria|Medida|Constituição)", r" (\1", nome, 1)
        if "(" in nome and not nome.endswith(")"):
            nome += ")"
        arts = []
        for m in re.finditer(r"ART:\s*([\w.\-]+)((?:\s+(?:PAR|INC|ALI|LET|CAP|TIT|SEC):\s*[\w.\-]+)*)", seg):
            t = "art. " + m.group(1)
            for k, v in re.findall(r"(PAR|INC|ALI|LET|CAP|TIT|SEC):\s*([\w.\-]+)", m.group(2)):
                t += ", " + {"PAR": "§ ", "INC": "inc. ", "ALI": "al. ", "LET": "alínea ", "CAP": "cap. ", "TIT": "tít. ", "SEC": "seç. "}[k] + v
            arts.append(t)
        partes.append(nome + (": " + "; ".join(arts) if arts else ""))
    return " | ".join(partes)


def bloco_js(chave, rotulo, itens):
    def numero(i):
        m = re.match(r"\d+", str(i["numero"]))
        return int(m[0]) if m else 0
    itens = sorted(itens, key=lambda i: (ordem_jornada(i["jornada"]), numero(i), i["id"]))
    linhas = []
    for i in itens:
        ref = formata_ref(i["referencia"])
        campos = ["numero: %s" % js(int(numero(i)) if numero(i) else i["numero"]), "texto: %s" % js(i["texto"]),
                  "materia: %s" % (js(re.sub(r"\s*\(inativo\)", "", i["comissao"])) if i["comissao"] else "null"),
                  "link: %s" % js("https://www.cjf.jus.br/enunciados/enunciado/%d" % i["id"]),
                  "jornada: %s" % js(re.sub(r"\s+Jornada.*$", " Jornada", i["jornada"]) if False else i["jornada"]),
                  "jid: %d" % i["id"]]
        if ref:
            campos.append("ref: %s" % js(ref))
        linhas.append("      { " + ", ".join(campos) + " }")
    return ("  %s: {\n    label: %s,\n    status: \"disponivel\",\n    sumulas: [\n%s\n    ]\n  },\n"
            % (chave, js(rotulo), ",\n".join(linhas)))


def montar():
    dados = lista_de_dados()
    if not dados:
        sys.exit("Sem cache: rode antes  python3 scripts/jornadas_cjf.py coletar")
    vistos, unicos = set(), []
    for d in dados:
        k = (d["jornada"], d["numero"], d["texto"])
        if k not in vistos:
            vistos.add(k)
            unicos.append(d)
    if len(unicos) < len(dados):
        print(f"{len(dados) - len(unicos)} enunciado(s) repetido(s) no CJF (mesmo número, Jornada e texto): ficou um só")
    dados = unicos
    por = {}
    for d in dados:
        for chave, rotulo, rx in AREAS:
            if re.search(rx, d["jornada"]):
                por.setdefault(chave, []).append(d)
                break
        else:
            print("Jornada sem área:", d["jornada"])
    blocos = "".join(bloco_js(c, r, por[c]) for c, r, _ in AREAS if por.get(c))
    chaves = [c for c, _, _ in AREAS if por.get(c)]
    arq = RAIZ / "site" / "sumulas" / "sumulas-data.js"
    t = arq.read_text(encoding="utf-8")
    ini, fim = "  // <jornadas-cjf> (gerado por scripts/jornadas_cjf.py; não edite à mão)\n", "  // </jornadas-cjf>\n"
    regiao = ini + blocos + fim
    if ini in t:
        t = re.sub(re.escape(ini) + r"[\s\S]*?" + re.escape(fim), lambda m: regiao, t)
    else:                      # primeira vez: logo antes de fechar SUMULAS_DATA
        m = re.search(r"\n\};\s*\n\s*var SUMULAS_ORG_ORDER", t)
        if not m:
            sys.exit("não achei o fim de SUMULAS_DATA")
        t = t[:m.start() + 1] + regiao + t[m.start() + 1:]
    # ordem dos tribunais
    ordem_ini, ordem_fim = '  // <jornadas-cjf-ordem>\n', '  // </jornadas-cjf-ordem>\n'
    ordem = ordem_ini + "  " + ", ".join(js(c) for c in chaves) + ",\n" + ordem_fim
    if ordem_ini in t:
        t = re.sub(re.escape(ordem_ini) + r"[\s\S]*?" + re.escape(ordem_fim), lambda m: ordem, t)
    else:
        t = t.replace('var SUMULAS_ORG_ORDER = [\n', 'var SUMULAS_ORG_ORDER = [\n' + ordem, 1)
    t = re.sub(r"\}(\s*\n)(  // <jornadas-cjf> )", r"},\1\2", t)   # o bloco anterior precisa terminar com vírgula
    arq.write_text(t, encoding="utf-8")
    # justificativas, em arquivos de 100 ids (baixados só quando a pessoa abre o enunciado)
    pasta = RAIZ / "jornadas" / "justificativas"
    import shutil
    shutil.rmtree(pasta, ignore_errors=True)
    pasta.mkdir(parents=True)
    grupos = {}
    for d in dados:
        if d["justificativa"]:
            grupos.setdefault(d["id"] // 100, {})[str(d["id"])] = d["justificativa"]
    for k, g in grupos.items():
        (pasta / f"{k:02d}.json").write_text(json.dumps(g, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
    print(f"{len(dados)} enunciados em {len(chaves)} blocos:", {c: len(por[c]) for c in chaves}, "| justificativas:", sum(len(g) for g in grupos.values()))


def main():
    p = argparse.ArgumentParser()
    p.add_argument("passo", choices=["coletar", "montar"])
    p.add_argument("--so-listas", action="store_true", help="(coletar) só as listas, sem abrir cada enunciado")
    p.add_argument("--jornada", help="(coletar) só as Jornadas cujo nome contém este texto")
    a = p.parse_args()
    if a.passo == "coletar":
        try:
            coletar(a.so_listas, a.jornada)
        except Bloqueio as e:
            print("PARADO:", e)
            sys.exit(1)
        return
    montar()


if __name__ == "__main__":
    main()
