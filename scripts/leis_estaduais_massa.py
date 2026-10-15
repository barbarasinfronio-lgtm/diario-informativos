#!/usr/bin/env python3
"""
leis_estaduais_massa.py — Leia-me das leis ESTADUAIS/DISTRITAIS citadas nos editais ("extras" de
site/editais/editais-data.js) que ainda não estão no Diário de Leis nem em leis/dos-editais.json.

A UF vem da sigla do edital (PGE-SC -> SC; PGDF/DPDF/TCDF -> DF). Para cada norma tenta, na ordem, a fonte
oficial da UF (SAPL da Assembleia, ALESC, Legisla Goiás…), confere que o número bate com o texto e grava em
leis/texto/ + leis/dos-editais.json (aparece em "Citadas nos editais" do Diário de Leis).

    python3 scripts/leis_estaduais_massa.py --plano            # lista o que falta, por UF
    python3 scripts/leis_estaduais_massa.py --uf SC,RO         # busca só essas UFs
    python3 scripts/leis_estaduais_massa.py                    # todas as UFs que têm fonte

Nunca inventa: se a fonte não tem a norma (ou o número não confere), fica em leis/estaduais-falhas.json.
"""
import argparse, html, json, os, re, subprocess, sys, time, urllib.parse, urllib.request
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(RAIZ / "scripts"))
import leis_citadas as lc  # noqa: E402
import leis_leiame_estaduais as le  # noqa: E402
robo = lc.robo

SAIDA = RAIZ / "leis" / "dos-editais.json"
FALHAS = RAIZ / "leis" / "estaduais-falhas.json"
UA = {"User-Agent": "Mozilla/5.0"}
SAPL = {"AC": "sapl.al.ac.leg.br", "AL": "sapl.al.al.leg.br", "AM": "sapl.al.am.leg.br", "MT": "sapl.al.mt.leg.br",
        "PB": "sapl.al.pb.leg.br", "RR": "sapl.al.rr.leg.br", "PI": "sapl.al.pi.leg.br", "RO": "sapl.al.ro.leg.br", "TO": "sapl.al.to.leg.br"}
RE_NUM = re.compile(r"(\d[\d.]*)\s*/\s*(\d{2,4})")


def norm(s):
    m = RE_NUM.search(s)
    if not m:
        return None
    t = "lc" if "Complementar" in s else "dl" if "Decreto-Lei" in s else "dec" if s.startswith("Decreto") else "lei"
    uf = re.search(r"\(([A-Z]{2})\)", s)
    ano = m.group(2) if len(m.group(2)) == 4 else "19" + m.group(2)
    return t, m.group(1).replace(".", "").lstrip("0"), ano, uf.group(1) if uf else None


def pendentes():
    s = (RAIZ / "site" / "editais" / "editais-data.js").read_text(encoding="utf-8")
    i = s.find("var EDITAIS_DATA = ") + len("var EDITAIS_DATA = ")
    editais = json.JSONDecoder().raw_decode(s[i:])[0]
    L = (RAIZ / "site" / "leis" / "leis-data.js").read_text(encoding="utf-8")
    ents = [(m.group(2), m.group(3)) for m in re.finditer(r'\{ nome: "((?:[^"\\]|\\.)*)", numero: "([^"]*)", link: "([^"]*)"', L)]
    ents += [(x["numero"], x["link"]) for x in json.loads(SAIDA.read_text(encoding="utf-8"))["leis"]]
    tem = {}
    for num, link in ents:
        k = norm(num)
        if k:
            tem[k] = tem.get(k, False) or (robo.TEXTO_DIR / f"{robo.id_texto(link)}.json").exists()
    pend = {}
    for e in editais:
        sg = e["sigla"]
        uf = "DF" if sg in ("PGDF", "DPDF", "TCDF") else sg[-2:]
        for x in e.get("extras", []):
            if not re.search("Estadual|Distrital", x):
                continue
            k = norm(x)
            if not k:
                continue
            k = (k[0], k[1], k[2], uf)
            if not tem.get(k):
                pend.setdefault(k, []).append(sg)
    return pend


def http(u, binario=False, timeout=60):
    """Baixa com o curl (segue os redirecionamentos 308 que o urllib não segue)."""
    import subprocess
    r = subprocess.run(["curl", "-sL", "-m", str(timeout), "-A", UA["User-Agent"], "--fail", u], capture_output=True)
    if r.returncode:
        raise OSError(f"curl {r.returncode} em {u[:70]}")
    if binario:
        return r.stdout
    if r.stdout[:2] in (b"\xff\xfe", b"\xfe\xff"):   # HTML em UTF-16 (ALES)
        return r.stdout.decode("utf-16", "replace")
    try:
        return r.stdout.decode("utf-8")
    except UnicodeDecodeError:   # páginas antigas (ex.: ALESE) vêm em Windows-1252
        return r.stdout.decode("cp1252", "replace")


def pdf_ou_ocr(dados):
    import fitz
    t = "\n".join(p.get_text() for p in fitz.open(stream=dados, filetype="pdf"))
    if len(t.strip()) < 300:
        import tempfile, leis_de_pdf_local as lp
        tmp = Path(tempfile.mkdtemp()) / "a.pdf"
        tmp.write_bytes(dados)
        t = lp.ocr_mac(str(tmp))
    return t


def doc_texto(dados, url):
    """.doc/.docx/.odt/.rtf: converte com o textutil do Mac."""
    import subprocess, tempfile
    ext = re.search(r"\.(docx?|odt|rtf)$", url, re.I)
    if not ext:
        return ""
    arq = Path(tempfile.mkdtemp()) / ("a." + ext.group(1).lower())
    arq.write_bytes(dados)
    r = subprocess.run(["textutil", "-convert", "txt", "-stdout", str(arq)], capture_output=True, text=True)
    return r.stdout if r.returncode == 0 else ""


TIPO_SAPL = {"lei": ("lei ordin", "lei estadual"), "lc": ("lei complementar",), "dec": ("decreto",), "dl": ("decreto-lei", "decreto lei")}


def achar_sapl(uf, tipo, n, ano):
    host = SAPL[uf]
    for numero in (n, n.zfill(4)):
        r = json.loads(http(f"https://{host}/api/norma/normajuridica/?numero={numero}&ano={ano}"))["results"]
        ok = [x for x in r if any(t in x["__str__"].lower() for t in TIPO_SAPL[tipo]) and (tipo != "lei" or "complementar" not in x["__str__"].lower())
              and (tipo != "dec" or "legislativo" not in x["__str__"].lower())]
        if ok:
            x = ok[0]
            link = f"https://{host}/norma/{x['id']}"
            cab = x["__str__"] + "\n"
            tx = (x.get("texto_integral") or "").replace("http://", "https://")
            if tx:
                dados = http(tx, binario=True, timeout=120)
                if dados.startswith(b"%PDF"):
                    return link, cab + pdf_ou_ocr(dados), x.get("ementa") or "", le.paragrafos_pdf
                t = doc_texto(dados, tx)
                if t:
                    return link, cab + t, x.get("ementa") or "", le.paragrafos_pdf
            try:   # sem arquivo: o SAPL monta o texto compilado em /ta
                h = http(link + "/ta")
                ps = robo.paragrafos_do_site(h)
                if len(ps) >= 4:
                    return link, h, x.get("ementa") or "", robo.paragrafos_do_site
            except OSError:
                pass
    return None


def achar_sc(tipo, n, ano):
    sufixo = {"lei": "lei", "lc": "lei_complementar"}.get(tipo)
    if tipo == "dec":   # decretos do Executivo: busca da ALESC por número e ano
        r = http(f"https://leis.alesc.sc.gov.br/executivo?numero={n}&ano={ano}")
        for i in dict.fromkeys(re.findall(r"ato-normativo/executivo/(\d+)", r)):
            link = f"https://leis.alesc.sc.gov.br/ato-normativo/executivo/{i}"
            h = http(link)
            ps = robo.paragrafos_do_site(h)
            if len(ps) >= 4 and robo.texto_confere(rotulo("SC", "dec", n, ano), ps, link):
                return link, h, "", robo.paragrafos_do_site
        return None
    if not sufixo:
        return None
    link = f"https://leis.alesc.sc.gov.br/html/{ano}/{n}_{ano}_{sufixo}.html"
    h = http(link)
    if "Pesquisa da Legislação Estadual" in h[:3000] or "Next" in h[:3000]:
        return None
    t = "\n".join(le.paragrafos_alesc(h))
    m = re.search(r"(?is)<title>(.*?)</title>", h)
    return link, t, "", le.paragrafos_pdf


def achar_go(tipo, n, ano):
    nome = {"lei": "Lei Estadual", "lc": "Lei Complementar Estadual", "dec": "Decreto Estadual"}[tipo]
    _id, pg = le.go_api(f"{nome} (GO) nº {n}/{ano}", nome)
    return f"https://legisla.casacivil.go.gov.br/pesquisa_legislacao/{_id}/", "\n".join(le.paragrafos_alesc(pg)), "", le.paragrafos_pdf


def achar_mg(tipo, n, ano):
    t = {"lei": "LEI", "lc": "LCP", "dec": "DEC", "dl": "DEL"}[tipo]
    link = f"https://www.almg.gov.br/legislacao-mineira/texto/{t}/{n}/{ano}/"
    h = http(link)
    if "Erro 404" in h[:3000]:
        return None
    return link, h, "", robo.paragrafos_do_site


def achar_pr(tipo, n, ano):
    cods = {"lei": (1,), "lc": (2, 3, 4, 5, 6), "dec": (7, 8, 9, 10, 11, 12)}.get(tipo, ())
    for cod in cods:
        link = ("https://www.legislacao.pr.gov.br/legislacao/exibirAto.do?action=localizarAto"
                f"&codTipoAto={cod}&nroAto={n}&tipoVisualizacao=compilado")
        h = http(link)
        ps = robo.paragrafos_do_site(h)
        num = rotulo("PR", tipo, n, ano)
        if len(ps) >= 4 and robo.texto_confere(num, ps, link):
            return link, h, "", robo.paragrafos_do_site
    return None


def tentar_pdfs(uf, tipo, n, ano, urls):
    """Primeira URL de PDF que abre e cujo texto confere com o número da norma."""
    num = rotulo(uf, tipo, n, ano)
    for u in urls:
        try:
            dados = http(u, binario=True, timeout=90)
        except OSError:
            continue
        if not dados.startswith(b"%PDF"):
            continue
        try:
            t = pdf_ou_ocr(dados)
        except Exception:   # noqa: BLE001 — PDF quebrado
            continue
        ps = le.paragrafos_pdf(t)
        if len(ps) >= 4 and robo.texto_confere(num, ps, u):
            return u, t, "", le.paragrafos_pdf
    return None


def achar_rs(tipo, n, ano):
    N = lc.com_ponto(n)
    q = urllib.parse.quote
    comp, rep = "https://www.al.rs.gov.br/filerepository/replegiscomp/", "https://www.al.rs.gov.br/filerepository/repLegis/arquivos/"
    nome = {"lei": "Lei", "lc": "Lei Complementar", "dec": "Decreto"}.get(tipo)
    if not nome:
        return None
    urls = [comp + q(f"{nome} nº {N}.pdf"), rep + q(f"{nome.upper()} {N}.pdf"), rep + q(f"{N}.pdf"), rep + q(f"{nome.upper()} {n}.pdf")]
    return tentar_pdfs("RS", tipo, n, ano, urls)


def achar_pe(tipo, n, ano):
    """Alepe Legis: endereço direto por tipo/número/ano (tiponorma 1 = lei, 2 = lei complementar)."""
    import leis_pe_alepe as pe
    if tipo == "dec":   # Decretos do Executivo: a lista do ano traz o id de cada um
        lst = http(f"https://legis.alepe.pe.gov.br/lista.aspx?tiponorma=6&ano={ano}", timeout=180)
        for i, nome in re.findall(r"<a href='texto\.aspx\?id=(\d+)[^>]*>(Decreto[^<]*)</a>", lst):
            if nome.strip().endswith(" " + lc.com_ponto(n)) or nome.strip().endswith(lc.com_ponto(n)):
                for tp in ("TEXTOATUALIZADO", "TEXTOORIGINAL"):
                    link = f"https://legis.alepe.pe.gov.br/texto.aspx?id={i}&tipo={tp}"
                    pg = http(link)
                    ps = robo.paragrafos_do_site(pg)
                    if len(ps) >= 4 and robo.texto_confere(rotulo("PE", tipo, n, ano), ps, link):
                        return link, pg, "", robo.paragrafos_do_site
        return None
    tn = {"lei": 1, "lc": 2}.get(tipo)
    if not tn:
        return None
    link = f"https://legis.alepe.pe.gov.br/texto.aspx?tiponorma={tn}&numero={n}&complemento=0&ano={ano}&tipo=&url="
    pg = http(link)
    ps = pe.paragrafos(pg)
    if len(ps) >= 4 and robo.texto_confere(rotulo("PE", tipo, n, ano), ps, link):
        return link, pg, "", pe.paragrafos
    return None


def achar_se(tipo, n, ano):
    for pref in {"lei": ("l",), "lc": ("c",), "dec": ("d",)}.get(tipo, ()):
        link = f"https://aleselegis.al.se.leg.br/Arquivo/Documents/legislacao/html/{pref}{n}{ano}.html"
        try:
            h = http(link)
        except OSError:
            continue
        ps = robo.paragrafos_do_site(h)
        if len(ps) >= 4 and robo.texto_confere(rotulo("SE", tipo, n, ano), ps, link):
            return link, h, "", robo.paragrafos_do_site
    return None


def achar_mt(tipo, n, ano):
    seg = {"lei": "lei.ordinaria", "lc": "lei.complementar", "dec": "decreto"}.get(tipo)
    if not seg:
        return None
    h = http("https://www.al.mt.gov.br/norma-juridica?almt_form_norma_juridica_ato_busca_avancada%5Bnumero%5D="
             f"{n}&almt_form_norma_juridica_ato_busca_avancada%5Bano%5D={ano}")
    ach = sorted(set(re.findall(r'href="(/norma-juridica/urn:lex:br;mato\.grosso:estadual:%s:[^";]*;%s)"' % (re.escape(seg), n), h)))
    for path in ach:
        link = "https://www.al.mt.gov.br" + path
        urls = [link + "/gerar-pdf-redacao?tipoTexto=compilado", link + "/gerar-pdf-redacao"]
        r = tentar_pdfs("MT", tipo, n, ano, urls)
        if r:
            return link, r[1], "", r[3]
    return None


def ext_alesp(h):
    ps = le.paragrafos_alesc(h)
    for i, l in enumerate(ps[:15]):
        if re.match(r"(?i)^(lei|decreto)\b", l):
            return ps[i:]
    return ps


def achar_sp(tipo, n, ano):
    tp = {"lei": "Lei", "lc": "Lei Complementar", "dec": "Decreto", "dl": "Decreto-Lei"}[tipo]
    r = json.loads(http(f"https://baleg-api-prd.al.sp.gov.br/normas?page=0&size=20&numero={n}&ano={ano}&sort=desc"))["content"]
    for x in r:
        if x["tipo"].strip().lower() != tp.lower() or str(x["nuNorma"]).lstrip("0") != n:
            continue
        for u in (x.get("urlTextoAtualizado"), x.get("urlIntegraListaPesquisa")):
            if not u:
                continue
            try:
                h = http(u.replace("http://", "https://"))
            except OSError:
                continue
            if len(ext_alesp(h)) >= 4:
                return u, h, x.get("dsEmenta") or "", ext_alesp
    return None


def ext_df(t):
    linhas = [l.strip() for l in t.split("\n")]
    linhas = [l for l in linhas if l and not re.match(r"(?i)^(Legisla[çc][ãa]o correlata|Texto (Compilado|Original|Atualizado))\b", l)]
    for i, l in enumerate(linhas[:30]):
        if re.match(r"^(LEI|DECRETO)( COMPLEMENTAR| LEGISLATIVO)?\s*N", l):
            linhas = linhas[i:]
            break
    return le.paragrafos_pdf("\n".join(linhas))


def achar_df(tipo, n, ano):
    import ssl
    ch = {"lei": "46000000", "lc": "47000000", "dec": "27000000"}.get(tipo)
    if not ch:
        return None
    r = subprocess.run(["curl", "-sk", "-m", "60", "-A", UA["User-Agent"], "-X", "POST",
                        f"https://www.sinj.df.gov.br/sinj/ashx/Datatable/ResultadoDePesquisaNormaDatatable.ashx?tipo_pesquisa=norma&ch_tipo_norma={ch}&nr_norma={n}&ano_assinatura={ano}",
                        "--data", "bbusca=sinj_norma&sEcho=1&iDisplayStart=0&iDisplayLength=10"], capture_output=True)
    dados = json.loads(r.stdout.decode("utf-8", "replace"))["aaData"]
    for x in dados:
        s = x["_source"]
        if str(s["nr_norma"]).lstrip("0") != n or not str(s.get("dt_assinatura", "")).endswith(str(ano)):
            continue
        for campo in ("ar_atualizado", "ar_texto", "ar_original"):
            arq = (s.get(campo) or {}).get("filename")
            if not arq or not re.search(r"\.html?$", arq):
                continue
            link = f"https://www.sinj.df.gov.br/sinj/DetalhesDeNorma.aspx?id_norma={s['ch_norma']}"
            h = subprocess.run(["curl", "-sk", "-m", "60", "-A", UA["User-Agent"], f"https://www.sinj.df.gov.br/sinj/Norma/{s['ch_norma']}/{arq}"], capture_output=True).stdout
            try:
                h = h.decode("utf-8")
            except UnicodeDecodeError:
                h = h.decode("cp1252", "replace")
            t = re.sub(r"(?is)<(script|style|head)\b.*?</\1>", "", h)
            t = html.unescape(re.sub(r"<[^>]+>", "\n", t)).replace("\xa0", " ")
            return link, t, s.get("ds_ementa") or "", ext_df
    return None


FONTE = {**{uf: ("sapl", None) for uf in SAPL}, "BA": ("ba", None), "ES": ("es", None), "RR": ("rr", None), "MA": ("ma", None), "PA": ("pa", None), "MS": ("ms", None), "RN": ("rn", None), "DF": ("df", None), "SP": ("sp", None), "MT": ("mt", None), "SE": ("se", None), "PE": ("pe", None), "RS": ("rs", None), "SC": ("sc", None), "GO": ("go", None), "MG": ("mg", None), "PR": ("pr", None)}


def buscar(uf, tipo, n, ano):
    f = FONTE.get(uf, (None,))[0]
    if f == "sapl":
        return achar_sapl(uf, tipo, n, ano)
    if f == "sc":
        return achar_sc(tipo, n, ano)
    if f == "go":
        return achar_go(tipo, n, ano)
    if f == "rn":
        return achar_rn(tipo, n, ano)
    if f == "rr":
        try:
            r = achar_sapl("RR", tipo, n, ano)
        except Exception:   # noqa: BLE001 — o SAPL de Roraima às vezes bloqueia: cai nos PDFs
            r = None
        return r or achar_rr(tipo, n, ano)
    if f == "ma":
        return achar_ma(tipo, n, ano)
    if f == "pa":
        return achar_pa(tipo, n, ano)
    if f == "ms":
        return achar_ms(tipo, n, ano)
    if f == "es":
        return achar_es(tipo, n, ano)
    if f == "ba":
        return achar_ba(tipo, n, ano)
    if f == "df":
        return achar_df(tipo, n, ano)
    if f == "sp":
        return achar_sp(tipo, n, ano)
    if f == "mt":
        return achar_mt(tipo, n, ano)
    if f == "se":
        return achar_se(tipo, n, ano)
    if f == "pe":
        return achar_pe(tipo, n, ano)
    if f == "rs":
        return achar_rs(tipo, n, ano)
    if f == "mg":
        return achar_mg(tipo, n, ano)
    if f == "pr":
        return achar_pr(tipo, n, ano)
    return None


def rotulo(uf, tipo, n, ano):
    base = {"lei": "Lei Estadual", "lc": "Lei Complementar Estadual", "dec": "Decreto Estadual", "dl": "Decreto-Lei Estadual"}[tipo]
    if uf == "DF":
        base = base.replace("Estadual", "Distrital")
    return f"{base} ({uf}) nº {lc.com_ponto(n)}/{ano}"


_RN = {}


def achar_rn(tipo, n, ano):
    sec = {"lc": "leis-complementares", "lei": "leis-ordinarias"}.get(tipo)
    if not sec:
        return None
    if sec not in _RN:
        itens = []
        pg = 1
        while pg <= 40:
            try:
                h = http(f"https://www.al.rn.leg.br/legislacao/{sec}" + (f"?page={pg}" if pg > 1 else ""))
            except OSError:
                break
            achados = re.findall(r"<a href='(https://www\.al\.rn\.leg\.br/storage/legislacao/[^']+)'[^>]*>.*?</i>\s*([^<]+)<", h, re.S)
            if not achados:
                break
            itens += achados
            if f"page={pg + 1}" not in h:
                break
            pg += 1
        _RN[sec] = itens
    for u, titulo in _RN[sec]:
        m = re.search(r"n[ºo°]\s*([\d.]+)\s*(?:de|/)\s*[\d.]*?(\d{4})?\s*$", titulo.strip())
        mm = re.search(r"n[ºo°]\s*([\d.]+)", titulo)
        ya = re.search(r"(\d{4})\s*$", titulo.strip())
        if mm and mm.group(1).replace(".", "").lstrip("0") == n and ya and ya.group(1) == str(ano):
            r = tentar_pdfs("RN", tipo, n, ano, [u])
            if r:
                return r
    return None


_MS = {}


def achar_ms(tipo, n, ano):
    vista = {"lc": "Lei%20Complementar", "lei": "Lei%20Estadual", "dec": "Decreto"}.get(tipo)
    if not vista:
        return None
    base = "https://aacpdappls.net.ms.gov.br/appls/legislacao/secoge/govato.nsf"
    chave = (vista, str(ano))
    if chave not in _MS:
        if vista == "Lei%20Complementar":   # visão sem categorias: tudo de uma vez
            h = http(f"{base}/{vista}?OpenView&Start=1&Count=20000&ExpandView", timeout=180)
        else:   # visão por ano: expande só a categoria do ano
            capa = http(f"{base}/{vista}?OpenView", timeout=120)
            anos = re.findall(r"(?<!\d)((?:19|20)\d\d)\s+\d+(?=\s|<)", re.sub(r"<[^>]+>", " ", capa))
            if str(ano) not in anos:
                _MS[chave] = []
                return None
            h = http(f"{base}/{vista}?OpenView&Start=1&Count=1000&Expand={anos.index(str(ano)) + 1}", timeout=180)
        _MS[chave] = re.findall(r'<a href="([^"]*OpenDocument)"[^>]*>([^<]*)</a>', h)
    for href, titulo in _MS[chave]:
        mm = re.search(r"(?i)\bn\S{0,2}\s*([\d.]+)\s*,", titulo)
        ya = re.search(r"(\d{4})\.?\s*$", titulo.strip())
        if mm and mm.group(1).replace(".", "").lstrip("0") == n and ya and ya.group(1) == str(ano):
            r = tentar_htmls("MS", tipo, n, ano, ["https://aacpdappls.net.ms.gov.br" + html.unescape(href)])
            if r:
                return r
    return None


def achar_pa(tipo, n, ano):
    pref = {"lei": "lei ordin", "lc": "lei complementar", "dec": "decreto n", "dl": "decreto lei"}.get(tipo)
    if not pref:
        return None
    r = json.loads(http(f"https://lex.pge.pa.gov.br/api/atos/busca?conteudo=&descritores=&numero={n}&ano={ano}&pagina=1&limite=20&texto_compilado=false&ordem=data_ato_d"))["resultados"]
    for x in r:
        tit = (x.get("titulo") or "").strip()
        if not tit.lower().startswith(pref) or str(x.get("numero_formatado", "")).replace(".", "").lstrip("0") != n:
            continue
        a = json.loads(http(f"https://lex.pge.pa.gov.br/api/atos/{x['id']}", timeout=120))
        ps = robo.paragrafos_da_lei(str(a.get("conteudo") or ""))
        ps.insert(0, re.sub(r"(?i)(n[ºo°.]\s*)0+(\d)", r"\1\2", re.sub(r"\s+", " ", tit)))
        ps = [re.sub(r"(?i)(n[ºo°.]\s*)0+(\d)", r"\1\2", q, count=1) if i < 3 else q for i, q in enumerate(ps)]
        if len(ps) >= 5:
            return f"https://lex.pge.pa.gov.br/?ato={x['id']}#/texto-integral/{x['id']}", ps, x.get("ementa") or "", (lambda z: z)
    return None


def achar_ma(tipo, n, ano):
    tp = {"lei": "lei ordin", "lc": "lei complementar", "dec": "decreto"}.get(tipo)
    if not tp:
        return None
    base = "https://alemalegis.al.ma.leg.br/api/v1/public/legal-norm"
    r = json.loads(http(f"{base}/filter?page=0&size=20&sort=id,asc&number={n}&year={ano}"))["content"]
    for x in r:
        if not x["legalNormType"]["description"].lower().startswith(tp) or str(x["number"]).lstrip("0") != n:
            continue
        det = json.loads(http(f"{base}/{x['id']}"))
        ft = det.get("fullText") or {}
        if not ft.get("id"):
            continue
        url = json.loads(http(f"{base}/presigned-url/{ft['id']}?expirationInMinutes=60"))["url"]
        dados = http(url, binario=True, timeout=120)
        if not dados.startswith(b"%PDF"):
            continue
        t = pdf_ou_ocr(dados)
        ps = le.paragrafos_pdf(t)
        link = f"https://alemalegis.al.ma.leg.br/sapl/protocol/legal-norm/detail/{x['id']}"
        if len(ps) >= 4 and robo.texto_confere(rotulo("MA", tipo, n, ano), ps, link):
            return link, t, x.get("ement") or "", le.paragrafos_pdf
    return None


def achar_rr(tipo, n, ano):
    """Assembleia de Roraima: PDFs digitalizados em /wp-content/uploads/2019/02/ (o site da busca bloqueia o robô)."""
    nomes = {"lc": ["Lei-complementar-no.-{N}", "Lei-complementar-No.-{N}", "Lei-Complementar-no.-{N}", "Lei-Complementar-No.-{N}"],
             "lei": ["Lei-ordinaria-no.-{N}", "Lei-ordinaria-No.-{N}", "Lei-Ordinaria-no.-{N}", "Lei-no.-{N}", "Lei-No.-{N}"]}.get(tipo)
    if not nomes:
        return None
    for N in (n.zfill(3), n):
        for modelo in nomes:
            u = f"https://al.rr.leg.br/wp-content/uploads/2019/02/{modelo.format(N=N)}.pdf"
            try:
                dados = http(u, binario=True, timeout=120)
            except OSError:
                continue
            if not dados.startswith(b"%PDF"):
                continue
            t = pdf_ou_ocr(dados)
            cab = re.sub(r"\s+", " ", t[:1500])
            if not (re.search(r"N\S{0,3}\s*0*%s\b" % re.escape(n), cab, re.I) and str(ano) in cab):
                continue
            t = rotulo("RR", tipo, n, ano).split(" (")[0].upper().replace("ESTADUAL", "").strip() + f" Nº {n}, DE {ano}.\n" + t
            return u, t, "", le.paragrafos_pdf
    return None


def tentar_htmls(uf, tipo, n, ano, urls):
    """Primeira URL de página HTML cujo texto confere com o número da norma."""
    num = rotulo(uf, tipo, n, ano)
    for u in urls:
        try:
            h = http(u)
        except OSError:
            continue
        ps = robo.paragrafos_do_site(h)
        if len(ps) >= 4 and robo.texto_confere(num, ps, u):
            return u, h, "", robo.paragrafos_do_site
    return None


def achar_es(tipo, n, ano):
    pref = {"lei": "LEI", "lc": "LEC", "dec": "DEC"}.get(tipo)
    if not pref:
        return None
    return tentar_htmls("ES", tipo, n, ano, [f"https://www3.al.es.gov.br/Arquivo/Documents/legislacao/html/{pref}{n}{ano}.html"])


def achar_ba(tipo, n, ano):
    pref = {"lei": "lei-no-", "lc": "lei-complementar-no-", "dec": "decreto-no-"}.get(tipo)
    if not pref:
        return None
    r = http("https://www.legislabahia.ba.gov.br/documentos?num=" + n)
    for slug in dict.fromkeys(re.findall(r'href="/documentos/(' + re.escape(pref) + n + r'-de-[a-z0-9-]*?-' + str(ano) + r')"', r)):
        link = "https://www.legislabahia.ba.gov.br/documentos/" + slug
        h = http(link)
        ps = robo.paragrafos_do_site(h)
        if len(ps) >= 4 and robo.texto_confere(rotulo("BA", tipo, n, ano), ps, link):
            return link, h, "", robo.paragrafos_do_site
    return None


def importar_cge_sc(page, tipo, n, ano):
    """Página de download da CGE-SC (WordPress Download Manager): acha o arquivo por trás, grava e registra a norma."""
    h = http(page)
    dl = re.search(r'data-downloadurl="([^"]+)"', h)
    if not dl:
        return False
    u = dl.group(1).replace("&#038;", "&").replace("&amp;", "&")
    dados = http(u, binario=True, timeout=120)
    num = rotulo("SC", tipo, n, ano)
    if dados.startswith(b"%PDF"):
        t, ext = pdf_ou_ocr(dados), le.paragrafos_pdf
    else:
        t, ext = dados.decode("utf-8", "replace") if not dados[:2] == b"PK" else (doc_texto(dados, u + ".docx") or ""), robo.paragrafos_do_site
        if ext is robo.paragrafos_do_site and "<" not in t:
            ext = le.paragrafos_pdf
    k = re.search(r"(?is)(Regulamenta[^.]{10,250}|Disp[õo]e sobre[^.]{10,250}|Institui[^.]{10,250}|Estabelece[^.]{10,250})", t)
    nome = re.sub(r"\s+", " ", k.group(1)).strip()[:160] if k else num
    if not robo.salvar_texto(page, t, nome, robo.hoje(), extrator=ext, numero=num):
        return False
    d = json.loads(SAIDA.read_text(encoding="utf-8"))
    d["leis"] = [x for x in d["leis"] if x["link"] != page] + [{"nome": nome, "numero": num, "link": page}]
    SAIDA.write_text(json.dumps(d, ensure_ascii=False, indent=1), encoding="utf-8")
    robo.indice_dos_textos()
    return True


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--plano", action="store_true")
    ap.add_argument("--uf", default="")
    ap.add_argument("--max", type=int, default=400)
    a = ap.parse_args()
    pend = pendentes()
    falhas = json.loads(FALHAS.read_text(encoding="utf-8")) if FALHAS.exists() else {}
    ufs = [u for u in a.uf.split(",") if u] or sorted(FONTE)
    alvos = [(k, v) for k, v in sorted(pend.items(), key=lambda kv: (kv[0][3], kv[0][0], kv[0][2], kv[0][1])) if k[3] in ufs and "-".join(k) not in falhas]
    por = {}
    for k, _ in pend.items():
        por[k[3]] = por.get(k[3], 0) + 1
    print("pendentes por UF:", dict(sorted(por.items())))
    print(f"{len(alvos)} a buscar agora (UFs com fonte: {', '.join(sorted(FONTE))}).")
    if a.plano:
        return
    dados = json.loads(SAIDA.read_text(encoding="utf-8"))
    hoje, ok = robo.hoje(), 0
    for (tipo, n, ano, uf), eds in alvos[:a.max]:
        num = rotulo(uf, tipo, n, ano)
        print(f"  … {num}  ({eds[0]})", flush=True)
        try:
            r = buscar(uf, tipo, n, ano)
        except Exception as ex:   # noqa: BLE001 — conexão: tenta na próxima rodada
            print(f"    erro ({type(ex).__name__}: {str(ex)[:60]}); fica para a próxima")
            time.sleep(2)
            continue
        if not r:
            falhas["-".join((tipo, n, ano, uf))] = hoje
            print("    não achei na fonte oficial")
            continue
        link, texto, ementa, extrator = r
        nome = (ementa.strip().capitalize()[:140] if ementa else num)
        gravou = robo.salvar_texto(link, texto, nome, hoje, extrator=extrator, numero=num)
        if not gravou and not (robo.TEXTO_DIR / f"{robo.id_texto(link)}.json").exists():
            falhas["-".join((tipo, n, ano, uf))] = hoje
            continue
        dados["leis"] = [x for x in dados["leis"] if x["link"] != link] + [{"nome": nome, "numero": num, "link": link}]
        SAIDA.write_text(json.dumps(dados, ensure_ascii=False, indent=1), encoding="utf-8")
        ok += 1
        print("    ok")
    FALHAS.write_text(json.dumps(falhas, ensure_ascii=False, indent=0), encoding="utf-8")
    robo.indice_dos_textos()
    print(f"{ok} lei(s) nova(s).")


if __name__ == "__main__":
    main()
