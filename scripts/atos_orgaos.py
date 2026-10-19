#!/usr/bin/env python3
"""
atos_orgaos.py — traz para o Diário das Resoluções (site/leis/normas-data.js) os atos PRÓPRIOS dos órgãos
que os editais mandam estudar (pareceres referenciais, súmulas administrativas, deliberações e atos
normativos de conselhos superiores, defensorias-gerais etc.). Um bloco por órgão, entre as marcas
">>> <chave>" / "<<< <chave>", e a chave entra em NORMAS_ORG_ORDER.

Cada órgão é um "coletor" abaixo (função que devolve a lista de normas). Para incluir um órgão novo:
escreva o coletor, registre em ORGAOS e rode.  Os órgãos e atos vêm da leitura dos editais (ver README).

Uso:  python3 scripts/atos_orgaos.py              # todos
      python3 scripts/atos_orgaos.py dpesp pgepa  # só esses
"""
import html
import json
import os
import re
import subprocess
import sys
import urllib.parse

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
UA = "Mozilla/5.0 (compatible; EstudaMana/1.0; +https://www.estudamana.com.br)"
ARQ = os.path.join(RAIZ, "site/leis/normas-data.js")


UA_NAVEGADOR = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36"


def baixar(url, ua=UA):
    for _ in range(3):
        r = subprocess.run(["curl", "-sL", "-m", "60", "-A", ua, "-w", "\n%{http_code}", url], capture_output=True, timeout=90)
        corpo, _, cod = r.stdout.rpartition(b"\n")
        if cod.decode().strip() == "200":
            return corpo.decode("utf-8", errors="replace")
    raise OSError("falha ao ler " + url)


def limpar(t):
    return re.sub(r"\s+", " ", html.unescape(re.sub(r"<[^>]+>", " ", t))).strip()


# ----------------------------------------------------------------------------- PGE-PA
PA = "https://www.pge.pa.gov.br"


def coletar_pgepa():
    s = baixar(PA + "/publicacoes/pareceres-referenciais")
    normas = []
    for tr in re.findall(r"<tr[^>]*>(.*?)</tr>", s, re.S):
        c = re.search(r'<td class="numeroano">(.*?)</td>', tr, re.S)
        if not c:
            continue
        e = re.search(r'<td class="ementa">(.*?)</td>', tr, re.S)
        l = re.search(r'href="([^"]+\.pdf)"', tr)
        numcel, ementa = limpar(c.group(1)), limpar(e.group(1)) if e else ""
        n = re.search(r"(\d+)\s*/\s*(\d{4})", numcel)
        if not n or not l:
            continue
        nota = numcel[n.end():].strip(" -–")
        corpo = re.sub(r"^Ementa:\s*", "", ementa or nota, flags=re.I)
        if nota.upper().startswith("EMENTA:"):
            corpo = re.sub(r"^Ementa:\s*", "", nota, flags=re.I)
        elif ementa and nota and not nota.startswith("("):
            corpo = nota + " " + corpo
        marca = "[SUPERADO] " if re.search(r"SUPERAD", numcel, re.I) else ""
        normas.append({"tipo": "Parecer Referencial", "numero": f"{int(n.group(1))}/{n.group(2)}",
                       "ementa": (marca + corpo).strip(), "link": urllib.parse.urljoin(PA, html.unescape(l.group(1)))})
    if len(normas) < 40:
        raise RuntimeError(f"só {len(normas)} Pareceres Referenciais (esperado ≥ 40)")
    normas.sort(key=lambda n: (-int(n["numero"].split("/")[1]), int(n["numero"].split("/")[0])))
    extra = []
    pub = baixar(PA + "/publicacoes")
    o = re.search(r'href="(/sites/default/files/publicacoes/orientacoes-juridicas[^"]*\.pdf)"', pub)
    if o:
        extra.append({"tipo": "Orientações Jurídicas", "numero": "Compilação",
                      "ementa": "Orientações Jurídicas da Procuradoria-Geral do Estado do Pará (compilação publicada pela PGE-PA).",
                      "link": urllib.parse.urljoin(PA, o.group(1))})
    e = re.findall(r'href="((?:https://www\.pge\.pa\.gov\.br)?/sites/default/files/[^"]+\.pdf)"', baixar(PA + "/publicacoes/ementario-geral-pareceres"))
    if e:
        extra.append({"tipo": "Ementário", "numero": "Geral de Pareceres",
                      "ementa": "Ementário Geral de Pareceres da PGE-PA (PDF atualizado mensalmente pelo órgão).",
                      "link": urllib.parse.urljoin(PA, e[0])})
    return extra + normas


# ----------------------------------------------------------------------------- DPE-SP
SP = "https://www.defensoria.sp.def.br/transparencia/portal-da-transparencia/legislacoes"
SPP = "_br_def_sp_defensoria_legislacoes_web_DpespLegislacoesPortlet_"
# o edital do concurso de Defensor Público de SP (Fundação Cebraspe/FCC, 2022, IX concurso) manda estudar:
SP_CITADOS = (
    [("ato_normativo", n, a, "Ato Normativo DPG") for n, a in ((146, 2018), (183, 2020), (216, 2022))] +
    [("deliberacao", n, a, "Deliberação CSDP") for n, a in (
        (63, 2008), (89, 2008), (120, 2009), (134, 2009), (187, 2010), (219, 2011), (249, 2012),
        (270, 2013), (291, 2014), (296, 2014), (297, 2014), (373, 2020), (400, 2022))])


def coletar_dpesp():
    normas, faltou = [], []
    for tipo, n, ano, rotulo in SP_CITADOS:
        s = baixar(f"{SP}?{SPP}tipo={tipo}&{SPP}numero={n}&{SPP}ano={ano}")
        achou = None
        for m in re.finditer(r'<a href="([^"]*legislacao/\d+)"[^>]*article-legislacao[^>]*>(.*?)</a>', s, re.S):
            t = re.search(r'<h5 class="title-legislacao"><b>(.*?)</b>', m.group(2), re.S)
            e = re.search(r'<div class="text-muted">(.*?)</div>', m.group(2), re.S)
            titulo = limpar(t.group(1)) if t else ""
            if re.search(rf"\bn\S{{0,3}}\s*0*{n}\b", titulo) and str(ano)[:3] in titulo:
                achou = (m.group(1), titulo, limpar(e.group(1)) if e else titulo)
                break
        if not achou:
            faltou.append(f"{rotulo} {n}/{ano}")
            continue
        normas.append({"tipo": rotulo, "numero": f"{n}/{ano}", "ementa": achou[2],
                       "link": urllib.parse.urljoin("https://www.defensoria.sp.def.br", achou[0])})
    if faltou:
        print("  DPE-SP: não achei no portal:", ", ".join(faltou), file=sys.stderr)
    if len(normas) < len(SP_CITADOS) - 3:
        raise RuntimeError(f"só {len(normas)} de {len(SP_CITADOS)} atos da DPE-SP")
    normas.sort(key=lambda x: (x["tipo"] != "Ato Normativo DPG", int(x["numero"].split("/")[1]), int(x["numero"].split("/")[0])))
    return normas


# ----------------------------------------------------------------------------- DPE-AP
AP = "https://dpeap.ap.def.br/"


def coletar_dpeap():
    s = baixar(AP + "?edp=bWVudQ==&pgu=NjA=")  # Conselho Superior > Resoluções (tabela com ~170 linhas)
    normas, sem_numero = [], []
    for tr in re.findall(r"<tr[^>]*>(.*?)</tr>", s, re.S):
        tds = re.findall(r"<td[^>]*>(.*?)</td>", tr, re.S)
        l = re.search(r"href=['\"]([^'\"]+\.pdf)['\"]", tr)
        if len(tds) < 2 or not l:
            continue
        texto = limpar(tds[1])
        n = re.search(r"n[º°o.]*\s*0*(\d+)\s*[./]\s*(\d{4})", texto, re.I) or \
            re.search(r"n[º°o.]*\s*0*(\d+)\s*,\s*de\s+\d+\s+de\s+\w+\s+de\s+(\d{4})", texto, re.I)
        if not n:
            sem_numero.append(texto[:60])
            continue
        ementa = re.sub(r"^.*?(?:CSDPEAP|\d{4})\s*[-–]\s*", "", texto, count=1) if re.search(r"(?:CSDPEAP|\d{4})\s*[-–]", texto[:80]) else texto
        normas.append({"tipo": "Resolução", "numero": f"{int(n.group(1))}/{n.group(2)}", "ementa": ementa,
                       "link": urllib.parse.urljoin(AP, l.group(1))})
    if sem_numero:
        print(f"  DPE-AP: {len(sem_numero)} linhas sem número foram ignoradas: {sem_numero[:3]}", file=sys.stderr)
    if len(normas) < 120:
        raise RuntimeError(f"só {len(normas)} Resoluções do CSDP-AP (esperado ≥ 120)")
    vistos, unicas = set(), []
    for n in normas:  # a mesma resolução pode aparecer mais de uma vez (versões)
        if n["numero"] in vistos:
            continue
        vistos.add(n["numero"])
        unicas.append(n)
    unicas.sort(key=lambda n: (-int(n["numero"].split("/")[1]), -int(n["numero"].split("/")[0])))
    return unicas


# ----------------------------------------------------------------------------- DPE-ES
ES = "https://www.defensoria.es.def.br/conselho-superior/resolucoes/"


def coletar_dpees():
    s = baixar(ES)
    s = s[s.find("<body"):]
    normas, vistos = [], set()
    for href, bruto in re.findall(r'<a[^>]+href="([^"]+)"[^>]*>(.*?)</a>', s, re.S):
        texto = limpar(bruto)
        n = re.match(r"(?:Resolu\S{2,4}o\s+CSDPES\s*(?:n\S{0,3}\s*)?)?0*(\d{1,3})\s*[/.]\s*(\d{4})\s*[–-]?\s*(.*)", texto, re.I)
        if not n or not re.search(r"CSDPES|^\d", texto, re.I) or "original" in texto.lower()[:12]:
            continue
        numero = f"{int(n.group(1))}/{n.group(2)}"
        if numero in vistos:
            continue
        vistos.add(numero)
        normas.append({"tipo": "Resolução", "numero": numero, "ementa": n.group(3).strip(" –-") or texto,
                       "link": urllib.parse.urljoin(ES, html.unescape(href))})
    if len(normas) < 80:
        raise RuntimeError(f"só {len(normas)} Resoluções do CSDPES (esperado ≥ 80)")
    normas.sort(key=lambda n: (-int(n["numero"].split("/")[1]), -int(n["numero"].split("/")[0])))
    # Atos Normativos da Corregedoria-Geral (CGDP): o edital cita o nº 018/2018 e o nº 019/2018
    cg = "https://www.defensoria.es.def.br/corregedoria/corregedoria-atos-normativos/"
    atos, vistos = [], set()
    for href, bruto in re.findall(r'<a[^>]+href="([^"]+)"[^>]*>(.*?)</a>', baixar(cg), re.S):
        texto = limpar(bruto)
        n = re.match(r"ATO NORMATIVO CGDP\s*(?:N\S{0,3}\s*)?0*(\d+)\s*[./]\s*(\d{4})\s*[–-]\s*(.*)", texto, re.I)
        if not n:
            continue
        numero = f"{int(n.group(1))}/{n.group(2)}"
        ementa = re.sub(r"\s*[–-]\s*(CONSOLIDADO|ERRATA)$", "", n.group(3)).strip()
        if numero in vistos or ementa.upper().endswith("REVOGADA"):
            continue
        vistos.add(numero)
        atos.append({"tipo": "Ato Normativo CGDP", "numero": numero, "ementa": ementa, "link": urllib.parse.urljoin(cg, html.unescape(href))})
    bruto = baixar(cg)  # o nº 019/2018 vem como texto solto, seguido dos links "versão INTEGRAL" e "versão DIO"
    m = re.search(r"ATO NORMATIVO CGDP\s*n\S{0,3}\s*0*19/2018\s*[–-]\s*([^<(]*?)\s*(?:<[^>]*>\s*)*\(.*?href=\"([^\"]+)\"", bruto, re.S | re.I)
    if m and "19/2018" not in vistos:
        atos.append({"tipo": "Ato Normativo CGDP", "numero": "19/2018", "ementa": limpar(m.group(1)).rstrip("."), "link": urllib.parse.urljoin(cg, html.unescape(m.group(2)))})
    atos.sort(key=lambda n: (-int(n["numero"].split("/")[1]), -int(n["numero"].split("/")[0])))
    return normas + atos


# ----------------------------------------------------------------------------- DPE-PB
PB = "https://defensoria.pb.def.br/wp-json/wp/v2/"


def coletar_dpepb():
    normas, vistos = [], set()
    for tipo, rotulo in (("resolucoes", "Resolução"), ("deliberacao", "Deliberação"), ("regimentos", "Regimento Interno")):
        pagina = 1
        while True:
            try:
                dados = json.loads(baixar(f"{PB}{tipo}?per_page=100&page={pagina}&_fields=title,link"))
            except (OSError, ValueError):
                break
            if not dados:
                break
            for d in dados:
                t = limpar(d["title"]["rendered"])
                if rotulo == "Regimento Interno":
                    numero = "CSDP" if "republic" not in t.lower() else "CSDP (republicado)"
                    ementa = t
                else:
                    n = re.search(r"n\S{0,3}\s*0*(\d+)\s*[./]\s*(\d{4})", t, re.I) or re.search(r"n\S{0,3}\s*0*(\d+)\s+de\s+\d+\s+de\s+\w+\s+de\s+(\d{4})", t, re.I)
                    if not n:
                        continue
                    numero = f"{int(n.group(1))}/{n.group(2)}"
                    ementa = re.sub(r"^.*?(?:\d{4}|CSDPB)\s*[–-]\s*", "", t, count=1) if re.search(r"(?:\d{4}|CSDPB)\s*[–-]", t[:70]) else t
                    ementa = ementa.strip().capitalize() if ementa.isupper() else ementa.strip()
                chave = (rotulo, numero)
                if chave in vistos:
                    continue
                vistos.add(chave)
                normas.append({"tipo": rotulo, "numero": numero, "ementa": ementa, "link": d["link"]})
            if len(dados) < 100:
                break
            pagina += 1
    if sum(1 for n in normas if n["tipo"] == "Resolução") < 100:
        raise RuntimeError(f"só {len(normas)} atos do CSDP-PB (esperado ≥ 100 resoluções)")
    def ordem(n):
        m = re.match(r"(\d+)/(\d{4})", n["numero"])
        return (n["tipo"] != "Resolução", -(int(m.group(2)) if m else 0), -(int(m.group(1)) if m else 0))
    normas.sort(key=ordem)
    return normas


# ----------------------------------------------------------------------------- PGE-GO
GO = "https://goias.gov.br/procuradoria/"


def _texto_main(url):
    s = baixar(url)
    b = s[s.find("<main"):]
    b = b[:b.find("</main>")] if "</main>" in b else b
    b = re.sub(r"<script.*?</script>|<style.*?</style>", "", b, flags=re.S)
    t = html.unescape(re.sub(r"<[^>]+>", "\n", b)).replace("\xa0", " ")
    return [l.strip() for l in t.split("\n") if l.strip()]


def coletar_pgego():
    normas = []
    linhas = _texto_main(GO + "sumulas-administrativas/")
    i = linhas.index("Assunto") + 1
    atual = None
    for l in linhas[i:]:
        if re.fullmatch(r"\d{1,3}", l):
            atual = int(l)
            normas.append({"tipo": "Súmula Administrativa", "numero": str(atual), "ementa": "", "link": GO + "sumulas-administrativas/"})
        elif atual is not None and not l.startswith("Governo na palma"):
            if re.match(r"(Serviços|Outros Sites)$", l):
                break
            normas[-1]["ementa"] = (normas[-1]["ementa"] + " " + l).strip()
    sumulas = [n for n in normas if n["ementa"]]
    if len(sumulas) < 15:
        raise RuntimeError(f"só {len(sumulas)} Súmulas Administrativas da PGE-GO (esperado ≥ 15)")
    sumulas.sort(key=lambda n: -int(n["numero"]))
    abrev = {"Procuradoria Judicial": "Judicial", "Procuradoria Tributária": "Tributária", "Consultoria Jurídica": "Consultoria",
             "Procuradoria de Defesa do Patrimônio Público e do Meio Ambiente": "Patrimônio e Meio Ambiente", "Procuradoria Trabalhista": "Trabalhista"}
    verbetes, cat, atual = [], None, None
    ls = _texto_main(GO + "verbetes/")
    for k, l in enumerate(ls):
        if l == "Verbetes" and k + 1 < len(ls) and ls[k + 1] == "Assunto" and k > 0:
            cat = next((v for c, v in abrev.items() if ls[k - 1].startswith(c)), ls[k - 1].rstrip(":"))
            atual = None
            continue
        if cat and re.fullmatch(r"\d{1,3}", l):
            atual = int(l)
            verbetes.append({"tipo": "Verbete de Orientação Jurídica", "numero": f"{cat} {atual}", "ementa": "", "link": GO + "verbetes/"})
        elif cat and atual is not None and l not in ("Assunto", "Verbetes") and not re.match(r"(Governo na palma|Serviços|Outros Sites)", l):
            if verbetes and verbetes[-1]["numero"] == f"{cat} {atual}":
                verbetes[-1]["ementa"] = (verbetes[-1]["ementa"] + " " + l).strip()
    verbetes = [v for v in verbetes if v["ementa"]]
    for v in verbetes:
        if len(v["ementa"]) > 700:
            v["ementa"] = v["ementa"][:700].rsplit(" ", 1)[0] + " [...]"
    return sumulas + verbetes


# ----------------------------------------------------------------------------- PGE-MT
MT = "https://www.pge.mt.gov.br/"


def coletar_pgemt():
    s = baixar(MT + "orientacoes-juridico-normativas-e-pareceres-referenciais", UA_NAVEGADOR)  # o site recusa o UA "robô"
    normas, vistos = [], set()
    for it in re.findall(r"<(?:p|li)[^>]*>((?:(?!</p>|</li>).)*?OJN\s*\d+/CPPGE/\d{4}.*?)</(?:p|li)>", s, re.S):
        a = re.search(r'<a[^>]+href="([^"]+)"[^>]*>\s*OJN\s*0*(\d+)/CPPGE/(\d{4}):?\s*</a>(.*)', it, re.S)
        if not a:
            continue
        numero = f"{int(a.group(2))}/{a.group(3)}"
        if numero in vistos:
            continue
        vistos.add(numero)
        resto = a.group(4).split("[")[0]
        ementa = limpar(resto).lstrip(": ").strip()
        normas.append({"tipo": "Orientação Jurídico-Normativa", "numero": numero, "ementa": ementa or "Orientação Jurídico-Normativa da PGE-MT",
                       "link": urllib.parse.urljoin(MT, html.unescape(a.group(1)))})
    if len(normas) < 50:
        raise RuntimeError(f"só {len(normas)} Orientações Jurídico-Normativas da PGE-MT (esperado ≥ 50)")
    normas.sort(key=lambda n: (-int(n["numero"].split("/")[1]), -int(n["numero"].split("/")[0])))
    return normas


ORGAOS = {
    "dpesp": dict(
        label="DPE-SP — Defensoria Pública do Estado de São Paulo", coletor=coletar_dpesp,
        descricao="Atos da Defensoria Pública de SP que o edital do IX Concurso de Defensor Público manda estudar em Princípios e Atribuições Institucionais: Atos Normativos do Defensor Público-Geral (146/2018, 183/2020 e 216/2022) e as Deliberações do Conselho Superior listadas no edital, conforme o Portal DPESP (defensoria.sp.def.br). Vá marcando conforme for lendo.",
        aviso="A lista segue o edital de 2022; o Conselho Superior já alterou várias dessas Deliberações depois (confira a vigência no link)."),
    "dpeap": dict(
        label="DPE-AP — Defensoria Pública do Estado do Amapá", coletor=coletar_dpeap,
        descricao="Resoluções do Conselho Superior da Defensoria Pública do Amapá (CSDPEAP), que o edital do concurso de Defensor Público manda estudar em Legislação Institucional, conforme o portal da Defensoria (dpeap.ap.def.br). Vá marcando conforme for lendo.",
        aviso="A lista traz todas as Resoluções do portal, inclusive as que foram alteradas ou revogadas depois; confira a vigência no PDF."),
    "dpees": dict(
        label="DPE-ES — Defensoria Pública do Estado do Espírito Santo", coletor=coletar_dpees,
        descricao="Resoluções do Conselho Superior da Defensoria Pública do Espírito Santo (CSDPES) e Atos Normativos da Corregedoria-Geral (CGDP), que o edital do concurso de Defensor Público manda estudar em Princípios e Atribuições Institucionais, conforme o portal da Defensoria (defensoria.es.def.br). Vá marcando conforme for lendo.",
        aviso="O link leva à versão mais atual que o portal publica (a versão original fica ao lado, no portal). Confira alterações posteriores."),
    "dpepb": dict(
        label="DPE-PB — Defensoria Pública do Estado da Paraíba", coletor=coletar_dpepb,
        descricao="Resoluções e Deliberações do Conselho Superior da Defensoria Pública da Paraíba (CSDPB) e o Regimento Interno do CSDP, que o edital do concurso de Defensor Público manda estudar (\"Resoluções e Enunciados do Conselho Superior\"), conforme o portal da Defensoria (defensoria.pb.def.br). Vá marcando conforme for lendo.",
        aviso="O portal não publica uma lista de Enunciados do Conselho Superior (só Resoluções e Deliberações), por isso eles não entraram. Os links levam à página de cada ato no portal."),
    "pgego": dict(
        label="PGE-GO — Procuradoria-Geral do Estado de Goiás", coletor=coletar_pgego,
        descricao="Súmulas Administrativas da PGE-GO (aprovadas pelo Conselho de Procuradores) e Verbetes de Orientação Jurídica, que o edital do concurso de Procurador do Estado de Goiás manda estudar (\"Súmulas administrativas e verbetes de orientações jurídicas da PGE-GO\"), conforme o portal da Procuradoria (goias.gov.br/procuradoria). Vá marcando conforme for lendo.",
        aviso="Os Verbetes aparecem agrupados por área (Judicial, Tributária, Consultoria, Patrimônio e Meio Ambiente, Trabalhista); o número se repete em cada área. O portal publica o texto só na página da lista, por isso o link é o da página."),
    "pgemt": dict(
        label="PGE-MT — Procuradoria-Geral do Estado de Mato Grosso", coletor=coletar_pgemt,
        descricao="Orientações Jurídico-Normativas (OJN) da PGE-MT, que regulamentam os Pareceres Referenciais e Normativos da Procuradoria e que o edital do concurso de Procurador do Estado de Mato Grosso manda estudar, conforme o portal da PGE-MT (pge.mt.gov.br). Vá marcando conforme for lendo.",
        aviso="O link leva à OJN; o Parecer Referencial correspondente e a minuta editável estão ao lado, no portal."),
    "pgepa": dict(
        label="PGE-PA — Procuradoria-Geral do Estado do Pará", coletor=coletar_pgepa,
        descricao="Atos da PGE-PA que o edital do concurso de Procurador do Estado do Pará (Cebraspe, 2023) manda estudar: Pareceres Referenciais (2019 em diante), Orientações Jurídicas e o Ementário Geral de Pareceres, conforme o site da Procuradoria (pge.pa.gov.br/publicacoes). Vá marcando conforme for lendo.",
        aviso="Os Pareceres Referenciais marcados [SUPERADO] foram substituídos por outro mais novo; leia o que o substituiu."),
}


PREFIXO = {"Deliberação": "Delib. ", "Ato Normativo CGDP": "CGDP ", "Ato Normativo DPG": "DPG ", "Regimento Interno": "RI "}


def desambiguar(normas):
    """A chave de leitura do Diário é <órgão>:<número>: quando dois atos de tipos diferentes têm o mesmo número,
    o que não é Resolução ganha um prefixo (ex.: 'Delib. 2/2021')."""
    conta = {}
    for n in normas:
        conta[n["numero"]] = conta.get(n["numero"], 0) + 1
    for n in normas:
        if conta[n["numero"]] > 1 and n["tipo"] in PREFIXO:
            n["numero"] = PREFIXO[n["tipo"]] + n["numero"]
    return normas


def bloco(chave, cfg, normas):
    normas = desambiguar(normas)
    linhas = ["    { tipo: %s, numero: %s, ementa: %s, link: %s }," % tuple(
        json.dumps(n[k], ensure_ascii=False) for k in ("tipo", "numero", "ementa", "link")) for n in normas]
    return (f"  // >>> {chave} (gerado por scripts/atos_orgaos.py — não editar à mão)\n"
            f"  {chave}: {{ label: {json.dumps(cfg['label'], ensure_ascii=False)}, status: \"disponivel\",\n"
            f"    descricao: {json.dumps(cfg['descricao'], ensure_ascii=False)},\n"
            f"    aviso: {json.dumps(cfg['aviso'], ensure_ascii=False)},\n    normas: [\n"
            + "\n".join(linhas) + f"\n  ]}},\n  // <<< {chave}\n")


def gravar(chave, cfg, normas):
    with open(ARQ, encoding="utf-8") as f:
        texto = f.read()
    novo_bloco = bloco(chave, cfg, normas)
    marcado = re.compile(rf"  // >>> {chave}[^\n]*\n[\s\S]*?  // <<< {chave}\n")
    if marcado.search(texto):
        novo = marcado.sub(lambda _m: novo_bloco, texto)
    else:  # primeira vez: entra antes do fecho do NORMAS_DATA
        fim = "\n};\n\nvar NORMAS_ORG_ORDER"
        if fim not in texto:
            raise RuntimeError("não achei o fecho de NORMAS_DATA em normas-data.js")
        novo = texto.replace(fim, "\n" + novo_bloco.rstrip("\n") + fim, 1)
    ordem = re.compile(r"var NORMAS_ORG_ORDER = \[([^\]]*)\];")
    m = ordem.search(novo)
    if f'"{chave}"' not in m.group(1):
        novo = ordem.sub(lambda _m: 'var NORMAS_ORG_ORDER = [%s, "%s"];' % (m.group(1), chave), novo, count=1)
    if novo != texto:
        with open(ARQ, "w", encoding="utf-8") as f:
            f.write(novo)
    return novo != texto


def main():
    escolhidos = sys.argv[1:] or list(ORGAOS)
    erro = False
    for chave in escolhidos:
        cfg = ORGAOS[chave]
        try:
            normas = cfg["coletor"]()
            mudou = gravar(chave, cfg, normas)
            print(f"{chave}: {len(normas)} atos ({'atualizado' if mudou else 'sem mudanças'})")
        except Exception as e:  # noqa: BLE001
            print(f"ERRO em {chave}: {e}", file=sys.stderr)
            erro = True
    sys.exit(1 if erro else 0)


if __name__ == "__main__":
    main()
