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
import argparse, html, json, os, re, sys, time, urllib.parse, urllib.request
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
        "PB": "sapl.al.pb.leg.br", "PI": "sapl.al.pi.leg.br", "RO": "sapl.al.ro.leg.br", "TO": "sapl.al.to.leg.br"}
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
    return r.stdout if binario else r.stdout.decode("utf-8", "replace")


def pdf_ou_ocr(dados):
    import fitz
    t = "\n".join(p.get_text() for p in fitz.open(stream=dados, filetype="pdf"))
    if len(t.strip()) < 300:
        import tempfile, leis_de_pdf_local as lp
        tmp = Path(tempfile.mkdtemp()) / "a.pdf"
        tmp.write_bytes(dados)
        t = lp.ocr_mac(str(tmp))
    return t


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
            if not x.get("texto_integral"):
                return None
            t = pdf_ou_ocr(http(x["texto_integral"].replace("http://", "https://"), binario=True, timeout=120))
            return link, x["__str__"] + "\n" + t, x.get("ementa") or "", le.paragrafos_pdf
    return None


def achar_sc(tipo, n, ano):
    sufixo = {"lei": "lei", "lc": "lei_complementar"}.get(tipo)
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
    import leis_pe_alepe as pe
    if tipo not in ("lei", "lc"):
        return None
    i = pe.achar("Lei Complementar" if tipo == "lc" else "Lei Ordinária", int(n), int(ano))
    if not i:
        return None
    link = f"{pe.BASE}texto.aspx?id={i}&tipo=TEXTOATUALIZADO"
    pg = pe.curl(link)
    return link, pg, "", pe.paragrafos


FONTE = {**{uf: ("sapl", None) for uf in SAPL}, "PE": ("pe", None), "RS": ("rs", None), "SC": ("sc", None), "GO": ("go", None), "MG": ("mg", None), "PR": ("pr", None)}


def buscar(uf, tipo, n, ano):
    f = FONTE.get(uf, (None,))[0]
    if f == "sapl":
        return achar_sapl(uf, tipo, n, ano)
    if f == "sc":
        return achar_sc(tipo, n, ano)
    if f == "go":
        return achar_go(tipo, n, ano)
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
