#!/usr/bin/env python3
"""
atualizar_sumulas.py — confere o Diário das Súmulas (site/sumulas/sumulas-data.js) com as fontes oficiais.

Por padrão só RELATA (não mexe no acervo):  súmula nova · súmula cancelada/revogada na fonte e não marcada no
acervo · número que sumiu da fonte. Com --aplicar, grava só o que a fonte entrega com texto completo:
  - TCU e STF: acrescenta as súmulas novas no fim do bloco e marca "[SÚMULA CANCELADA]/[SÚMULA REVOGADA]".
  - Demais tribunais: só relatório (a Claude confere e inclui).

Fontes (cada tribunal é independente; se uma não responde, ela é PULADA e o resto continua):
  FASE 1  stf, stf_vinculante (portal.stf.jus.br) · tcu (API pública) · stj e tse (o site bloqueia robôs: "precisa do
          Chrome") · TJSP, TJRJ, TJMG, TJRS, TJPR, TJSC (maior número da página oficial).
  FASE 2  TNU, STM, TRFs, TREs, TRTs, Tribunais de Contas e enunciados: maior número da página oficial.

Gera curadoria/sumulas-conferencia.json (resumo da última conferência).
Uso:  python3 scripts/atualizar_sumulas.py            # relatório
      python3 scripts/atualizar_sumulas.py --aplicar  # grava TCU/STF novos
      python3 scripts/atualizar_sumulas.py tcu stf    # só estes
"""
import html
import json
import os
import re
import subprocess
import sys
import urllib.parse

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_JS = os.path.join(RAIZ, "site/sumulas/sumulas-data.js")
SAIDA = os.path.join(RAIZ, "curadoria/sumulas-conferencia.json")
UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36"
MARCAS = ("[SÚMULA CANCELADA]", "[SÚMULA REVOGADA]", "[SÚMULA SUPERADA]", "[SÚMULA ALTERADA]", "[SÚMULA ANULADA]")


class Falha(Exception):
    """a fonte não respondeu ou veio fora do formato esperado"""


class PrecisaChrome(Falha):
    """o site bloqueia robôs (403/WAF)"""


# ---- acesso ------------------------------------------------------------------
def baixar(url, timeout=40):
    try:
        r = subprocess.run(["curl", "-sL", "-m", str(timeout), "-A", UA, "-w", "\n%{http_code}", url],
                           capture_output=True, timeout=timeout + 15)
    except Exception as e:  # noqa: BLE001
        raise Falha("sem resposta (%s)" % type(e).__name__)
    if r.returncode in (35, 51, 58, 60):
        raise Falha("certificado do site não reconhecido neste computador")
    corpo, _, codigo = r.stdout.rpartition(b"\n")
    codigo = codigo.decode().strip()
    if codigo in ("403", "401", "429"):
        raise PrecisaChrome("HTTP %s (bloqueia robôs)" % codigo)
    if codigo != "200":
        raise Falha("HTTP %s" % (codigo or "sem resposta"))
    return corpo


def texto_html(b):
    s = b.decode("utf-8", "replace")
    s = re.sub(r"(?is)<(script|style).*?</\1>", " ", s)
    s = re.sub(r"<[^>]+>", " ", s)
    return re.sub(r"\s+", " ", html.unescape(s)).strip()


def limpar(t):
    return re.sub(r"\s+", " ", html.unescape(re.sub(r"<[^>]+>", " ", t or ""))).strip()


# ---- acervo ------------------------------------------------------------------
def ler_acervo():
    js = ("const fs=require('fs'),vm=require('vm');const c={window:{}};vm.createContext(c);"
          "vm.runInContext(fs.readFileSync(%s,'utf8')+'\\nthis.D=SUMULAS_DATA',c);"
          "const o={};for(const k of Object.keys(c.D)){o[k]={label:c.D[k].label||k,sumulas:(c.D[k].sumulas||[])"
          ".map(x=>({numero:x.numero,texto:x.texto||'',link:x.link||''}))}}"
          "console.log(JSON.stringify(o))" % json.dumps(DATA_JS))
    r = subprocess.run(["node", "-e", js], capture_output=True, timeout=60)
    if r.returncode:
        raise Falha("não consegui ler sumulas-data.js: " + r.stderr.decode()[:200])
    return json.loads(r.stdout)


# ---- coletores: devolvem {numero: {"texto": str|None, "situacao": "vigente"|"cancelada"|None}} -----------------
def coletar_tcu():
    out, ini = {}, 0
    while True:
        url = ("https://pesquisa.apps.tcu.gov.br/rest/publico/base/sumula/documentosResumidos?termo=*"
               "&ordenacao=NUMEROINT%20asc,KEY%20asc&quantidade=200&inicio=" + str(ini) + "&sinonimos=true")
        try:
            d = json.loads(baixar(url))
        except ValueError:
            raise Falha("resposta fora do formato")
        docs = d.get("documentos") or []
        for x in docs:
            if str(x.get("TIPO", "")).upper().startswith("S") and str(x.get("NUMERO", "")).isdigit():
                t = limpar(x.get("ENUNCIADO") or x.get("CABECALHO"))
                t = re.sub(r"^S[ÚU]MULA TCU \d+:\s*", "", t)
                out[int(x["NUMERO"])] = {"texto": t, "situacao": "vigente" if str(x.get("VIGENTE")).lower() == "true" else "cancelada"}
        ini += len(docs)
        if not docs or ini >= int(d.get("quantidadeEncontrada") or 0):
            break
    if len(out) < 250:
        raise Falha("TCU devolveu só %d súmulas (incompleto)" % len(out))
    return out


def _stf(base, minimo):
    pag = baixar("https://portal.stf.jus.br/jurisprudencia/sumariosumulas.asp?base=%d" % base).decode("utf-8", "replace")
    itens = re.findall(r'sumula=(\d+)">\s*S[úu]mula(?: Vinculante)?(?:\s|&nbsp;)+(\d+)', pag)
    out = {int(n): {"texto": None, "situacao": None, "_id": i} for i, n in itens}
    if len(out) < minimo:
        raise Falha("STF devolveu só %d itens (incompleto)" % len(out))
    return out


def coletar_stf():
    return _stf(30, 600)


def coletar_stf_vinculante():
    return _stf(26, 50)


def texto_stf(base, idn):
    t = texto_html(baixar("https://portal.stf.jus.br/jurisprudencia/sumariosumulas.asp?base=%d&sumula=%s" % (base, idn)))
    m = re.search(r"S[úu]mula(?: Vinculante)? \d+\s+(.+?)\s+(?:Precedentes Representativos|Legisla[çc][ãa]o|Observa)", t)
    if not m:
        raise Falha("não achei o texto da súmula %s" % idn)
    return m.group(1).strip()


def _so_chrome(nome):
    def f():
        raise PrecisaChrome(nome if " " in nome else "%s bloqueia robôs; conferir pelo Chrome" % nome)
    return f


def _maximo_na_pagina(url, padrao=r"S[úu]mula(?:\s+n[º°.]?)?\s*(\d{1,4})\b", minimo=1):
    """Fontes sem API: pega o maior número citado como 'Súmula N' na página oficial."""
    t = texto_html(baixar(url, 30))
    nums = sorted({int(n) for n in re.findall(padrao, t, re.I)})
    # o "maior número" só vale se vier de uma lista (1..N quase completo): ignora citações soltas (ex.: "Súmula 580 do STJ")
    topo = 0
    for n in nums:
        if len([x for x in nums if x <= n]) >= 0.85 * n:
            topo = n
    if len(nums) < minimo or topo < minimo:
        raise PrecisaChrome("a página não traz a lista (carrega por JavaScript); conferir pelo Chrome")
    return {n: {"texto": None, "situacao": None} for n in nums if n <= topo}


def _parcial(acervo_sumulas, fonte):
    return len(fonte) < 0.6 * len(acervo_sumulas)


def pagina(url, minimo=5, padrao=None):
    def f():
        return _maximo_na_pagina(url, padrao, minimo) if padrao else _maximo_na_pagina(url, minimo=minimo)
    return f


COLETORES = {
    "stf_vinculante": coletar_stf_vinculante,
    "stf": coletar_stf,
    "tcu": coletar_tcu,
    "stj": _so_chrome("STJ"),
    "tse": _so_chrome("TSE"),
    "tjsp": pagina("https://www.tjsp.jus.br/SecaoDireitoPublico/SecaoDireitoPublico/sumulas"),
    "tjrj": pagina("https://portaltj.tjrj.jus.br/documents/d/portal-conhecimento/sumulas-2026"),
    "tjmg": pagina("https://www.tjmg.jus.br/portal-tjmg/jurisprudencia/consulta-de-jurisprudencia/lista-de-sumulas.htm"),
    "tjrs": pagina("https://www.tjrs.jus.br/novo/jurisprudencia-e-legislacao/jurisprudencia/sumulas/"),
    "tjpr": pagina("https://www.tjpr.jus.br/jurisprudencia-sumulas"),
    "tjsc": pagina("https://www.tjsc.jus.br/web/jurisprudencia/sumulas-do-tjsc"),
}


# ---- comparação ----------------------------------------------------------------
# números que a fonte lista mas que não são súmula publicada (conferido na fonte)
IGNORAR = {"stf_vinculante": {30},  # SV 30: "pendente de publicação" no portal do STF
           "trf2": {57}}  # súmula 57 do TRF2 é só aviso de aprovação (fora do acervo de propósito)

# FASE 2: demais tribunais — usa o link de cada bloco do acervo (página oficial). Têm outro robô ou outra regra:
FORA = ("tst", "cjf_", "fonaje", "enfam", "fppc", "trf", "tnu", "stm")  # trf*/tnu/stm: ver FASE2_URLS


def completar_coletores(acervo):
    for k, b in acervo.items():
        if k in COLETORES or k.startswith(FORA[:5]):
            continue
        link = next((s["link"] for s in b["sumulas"] if s["link"].startswith("http")), "")
        if link and not link.lower().split("?")[0].endswith(".pdf"):
            COLETORES[k] = pagina(link, minimo=3)
        else:
            COLETORES[k] = _so_chrome("a fonte é PDF ou arquivo; sem conferência automática")


def comparar(acervo_sumulas, fonte, chave=""):
    """→ novas, canceladas_nao_marcadas, sumiram (em listas de números)"""
    tem = {s["numero"]: s["texto"] for s in acervo_sumulas if isinstance(s["numero"], int)}
    novas = sorted(n for n in fonte if n not in tem and n not in IGNORAR.get(chave, ()))
    canc = sorted(n for n, v in fonte.items() if v.get("situacao") == "cancelada" and n in tem
                  and not tem[n].lstrip().startswith(MARCAS))
    sumiram = sorted(n for n in tem if n not in fonte)
    return novas, canc, sumiram


def linha_js(numero, texto, linkvar):
    return "      { numero: %d, texto: %s, materia: null, link: %s },\n" % (numero, json.dumps(texto, ensure_ascii=False), linkvar)


def aplicar(chave, novas, canc, fonte, acervo, base_stf=None):
    """grava no sumulas-data.js (só TCU/STF): linhas novas no fim do bloco e marca nas canceladas"""
    src = open(DATA_JS, encoding="utf-8").read()
    ini = re.search(r"\n  %s: \{\n" % re.escape(chave), src)
    if not ini:
        raise Falha("bloco %s não achado em sumulas-data.js" % chave)
    fim = src.index("\n    ]\n  }", ini.end())
    bloco = src[ini.start():fim]
    link = next((s["link"] for s in acervo[chave]["sumulas"] if s["link"]), "")
    m = re.search(r"link: (SUMULAS_LINK_\w+)", bloco)
    linkvar = m.group(1) if m else json.dumps(link)
    for n in canc:
        bloco = re.sub(r'(\{ numero: %d, texto: ")' % n, r'\1[SÚMULA CANCELADA] ', bloco, count=1)
    novo = ""
    for n in novas:
        t = fonte[n]["texto"]
        if t is None and base_stf:
            t = texto_stf(base_stf, fonte[n]["_id"])
        if not t:
            continue
        if fonte[n].get("situacao") == "cancelada":
            t = "[SÚMULA CANCELADA] " + t
        novo += linha_js(n, t, linkvar)
    if novo:
        bloco = bloco.rstrip(",\n") + ",\n" + novo.rstrip("\n").rstrip(",")
    src = src[:ini.start()] + bloco + src[fim:]
    open(DATA_JS, "w", encoding="utf-8").write(src)


def main(argv):
    aplicar_ = "--aplicar" in argv
    escolhidos = [a for a in argv if not a.startswith("--")]
    acervo = ler_acervo()
    completar_coletores(acervo)
    chaves =[k for k in COLETORES if (not escolhidos or k in escolhidos)]
    resultado, seguidas = {}, 0
    print("=== Conferência das súmulas — %d fonte(s)%s ===" % (len(chaves), " (APLICANDO)" if aplicar_ else " (só relatório)"))
    for k in chaves:
        if k not in acervo:
            resultado[k] = {"estado": "sem bloco no acervo"}
            print("  ?  %-15s sem bloco no acervo" % k)
            continue
        if seguidas >= 6:
            resultado[k] = {"estado": "pulado", "motivo": "6 falhas seguidas; rede fora do ar?"}
            print("  -  %-15s pulado (6 falhas seguidas)" % k)
            continue
        try:
            fonte = COLETORES[k]()
            seguidas = 0
        except PrecisaChrome as e:
            resultado[k] = {"estado": "precisa do Chrome", "motivo": str(e)}
            print("  C  %-15s %s" % (k, e))
            continue
        except Falha as e:
            seguidas += 1
            resultado[k] = {"estado": "falhou", "motivo": str(e)}
            print("  X  %-15s %s" % (k, e))
            continue
        if k not in ("tcu", "stf", "stf_vinculante") and _parcial(acervo[k]["sumulas"], fonte):
            resultado[k] = {"estado": "precisa do Chrome", "motivo": "a página mostra só parte da lista"}
            print("  C  %-15s a página mostra só parte da lista (%d de %d); conferir pelo Chrome" % (k, len(fonte), len(acervo[k]["sumulas"])))
            continue
        novas, canc, sumiram = comparar(acervo[k]["sumulas"], fonte, k)
        r = {"estado": "ok", "no_acervo": len(acervo[k]["sumulas"]), "na_fonte": len(fonte), "novas": novas,
             "canceladas_nao_marcadas": canc, "sumiram_da_fonte": sumiram}
        resultado[k] = r
        sinal = "✓" if not (novas or canc) else "!"
        print("  %s  %-15s acervo %4d · fonte %4d  novas %s  canceladas a marcar %s" % (
            sinal, k, r["no_acervo"], r["na_fonte"], novas[:12] or "-", canc[:12] or "-"))
        if aplicar_ and k in ("tcu", "stf", "stf_vinculante") and (novas or canc):
            try:
                aplicar(k, novas, canc, fonte, acervo, 30 if k == "stf" else 26 if k == "stf_vinculante" else None)
                r["aplicado"] = True
                print("       → gravado em sumulas-data.js")
            except Falha as e:
                r["aplicado"] = False
                print("       → não gravei: %s" % e)
    os.makedirs(os.path.dirname(SAIDA), exist_ok=True)
    json.dump(resultado, open(SAIDA, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    pend = [k for k, r in resultado.items() if r.get("novas") or r.get("canceladas_nao_marcadas")]
    chrome = [k for k, r in resultado.items() if r["estado"] == "precisa do Chrome"]
    print("\nCom novidade: %s" % (", ".join(pend) or "nenhuma"))
    if chrome:
        print("Só conferem pelo Chrome (fale com a Claude): %s" % ", ".join(chrome))
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
