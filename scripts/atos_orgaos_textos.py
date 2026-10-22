#!/usr/bin/env python3
"""
atos_orgaos_textos.py — texto inteiro dos atos do CSJT, CNMP e CSMPT (os que estão no Diário das Resoluções) para ler no
próprio site, com as remissões cruzadas do vade mecum. Mesma ideia de scripts/cnj_atos_textos.py.

Fontes (links que já estão em site/leis/normas-data.js):
  CSJT   https://hdl.handle.net/…  → página do Juslaboris (TST) → PDF do ato
  CSMPT  PDF em midia-ext.mpt.mp.br
  CNMP   página do ato em cnmp.mp.br (o servidor só responde ao Brasil: rode no Mac); usa o PDF anexo, se houver, ou o texto da página
Grava leis/texto/<org>-<id>.json (+ leis/texto/indice.json) e leis/atos-<org>.json ({"leis":[{nome,numero,link,textoId,situacao,data}]}).

    python3 scripts/atos_orgaos_textos.py                 # os três
    python3 scripts/atos_orgaos_textos.py --orgaos csjt   # só um
"""
import argparse, datetime, html, json, os, re, subprocess, sys, time, hashlib
from concurrent.futures import ThreadPoolExecutor

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
UA = "Mozilla/5.0 (compatible; EstudaMana/1.0; +https://www.estudamana.com.br)"
NOMES = {"csjt": "CSJT", "cnmp": "CNMP", "csmpt": "CSMPT"}
JS = """const fs=require('fs');global.window=global;
(0,eval)(fs.readFileSync('site/leis/normas-data.js','utf8').replace(/^(var|const|let) (\\w+) =/mg,'globalThis.$2 ='));
console.log(JSON.stringify(globalThis.NORMAS_DATA))"""


def baixar(url, binario=False, tent=3):
    for t in range(tent):
        r = subprocess.run(["curl", "-sL", "-m", "90", "-A", UA, "-w", "\n%{http_code}|%{url_effective}", url], capture_output=True, timeout=130)
        corpo, _, fim = r.stdout.rpartition(b"\n")
        cod, _, efetiva = fim.decode(errors="replace").partition("|")
        if cod.strip() == "200":
            return (corpo if binario else corpo.decode("utf-8", errors="replace")), efetiva
        time.sleep(4 * (t + 1))
    raise OSError(f"falha {url}")


def site_responde(url):
    """Teste rápido (20 s): o site responde a este computador agora? Evita horas de tentativas num site fora do ar."""
    try:
        r = subprocess.run(["curl", "-sL", "-m", "20", "-A", UA, "-o", "/dev/null", "-w", "%{http_code}", url], capture_output=True, timeout=40)
        return r.stdout.decode().strip() == "200"
    except Exception:  # noqa: BLE001
        return False


def juntar_linhas(linhas):
    """linhas de PDF → parágrafos: junta as quebras no meio da frase; mantém Art., §, incisos, alíneas, títulos"""
    novo = re.compile(r"^(Art\.|Artigo|§|Parágrafo|CAP[ÍI]TULO|SE[ÇC][ÃA]O|T[ÍI]TULO|LIVRO|CONSIDERANDO|RESOLVE|[IVXLC]+\s*[-–.)]|[a-z]\)|\d+[.)-]\s|[A-ZÀ-Ú][A-ZÀ-Ú\s,.-]{12,}$)")
    ps = []
    for l in linhas:
        l = re.sub(r"\s+", " ", l).strip()
        if not l or re.fullmatch(r"(?:p[áa]gina\s*)?\d{1,3}(?:\s*(?:de|/)\s*\d{1,3})?", l, re.I):
            continue
        if ps and not novo.match(l) and not re.search(r"[.:;!?]$", ps[-1]) :
            ps[-1] += (l if ps[-1].endswith("-") and False else " " + l)
        elif ps and not novo.match(l) and re.search(r"[.:;!?]$", ps[-1]) and l[:1].islower():
            ps[-1] += " " + l
        else:
            ps.append(l)
    return ps


def texto_pdf(dados):
    import fitz
    doc = fitz.open(stream=dados, filetype="pdf")
    linhas = []
    for pg in doc:
        linhas += pg.get_text().split("\n")
    return juntar_linhas(linhas)


def texto_html(s):
    s = re.sub(r"<script.*?</script>|<style.*?</style>|<nav.*?</nav>|<header.*?</header>|<footer.*?</footer>", "", s, flags=re.S | re.I)
    m = re.search(r'<div[^>]+class="[^"]*(?:item-page|itemFullText|article-body|entry-content)[^"]*"[^>]*>(.*)', s, re.S | re.I)
    if m:
        s = m.group(1)
    s = re.sub(r"<(?:p|br|div|li|tr|h\d)[^>]*>", "\n", s)
    t = html.unescape(re.sub(r"<[^>]+>", "", s)).replace("\xa0", " ")
    return juntar_linhas(t.split("\n"))


def obter(org, norma):
    link = norma["link"]
    if org == "csjt":
        pag, efetiva = baixar(link)
        hid = re.search(r"/handle/[\d.]+/(\d+)", efetiva)
        m = re.search(r'href="(/bitstream/handle/[\d.]+/' + (hid.group(1) if hid else r"\d+") + r'/[^"]+?\.pdf[^"]*)"', pag)
        if not m:
            raise OSError("sem PDF")
        base = re.match(r"https?://[^/]+", efetiva).group(0)
        return texto_pdf(baixar(base + html.unescape(m.group(1)), True)[0])
    if org == "csmpt":
        return texto_pdf(baixar(link, True)[0])
    pag, efetiva = baixar(link)
    pdf = re.search(r'href="([^"]+\.pdf[^"]*)"', pag, re.I)
    if pdf:
        u = html.unescape(pdf.group(1))
        if u.startswith("/"):
            u = re.match(r"https?://[^/]+", efetiva).group(0) + u
        try:
            ps = texto_pdf(baixar(u, True)[0])
            if sum(map(len, ps)) > 400:
                return ps
        except Exception:
            pass
    return texto_html(pag)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--orgaos", default="csjt,csmpt,cnmp")
    ap.add_argument("--refazer", action="store_true")
    ap.add_argument("--max", type=int, default=0)
    a = ap.parse_args()
    hoje = datetime.date.today().isoformat()
    dados = json.loads(subprocess.check_output(["node", "-e", JS], text=True, cwd=RAIZ))
    pasta = os.path.join(RAIZ, "leis", "texto")
    ix_f = os.path.join(pasta, "indice.json")
    ix = json.load(open(ix_f, encoding="utf-8"))
    for org in a.orgaos.split(","):
        normas = dados[org]["normas"]
        if a.max:
            normas = normas[:a.max]
        if normas and not any(os.path.exists(os.path.join(pasta, f"{org}-" + re.sub(r"[^a-z0-9]+", "-", f"{n['tipo']}-{n['numero']}".lower()).strip("-") + ".json")) for n in normas[:5]) \
                and not (site_responde(normas[0]["link"]) or site_responde(normas[0]["link"])):
            print(f"{org}: o site não responde agora ({normas[0]['link']}); pulei. Rode de novo mais tarde.", flush=True)
            continue
        seguidas = {"n": 0, "parou": False}

        def tid_de(n):
            return f"{org}-" + re.sub(r"[^a-z0-9]+", "-", f"{n['tipo']}-{n['numero']}".lower()).strip("-")

        def baixa(n):
            tid = tid_de(n)
            arq = os.path.join(pasta, tid + ".json")
            if os.path.exists(arq) and not a.refazer:
                return n, "ja"
            if seguidas["parou"]:
                return n, "pulado"
            try:
                ps = obter(org, n)
            except Exception as e:
                seguidas["n"] += 1
                if seguidas["n"] >= 6 and not seguidas["parou"]:  # 6 falhas seguidas: o site caiu no meio; desiste deste órgão
                    seguidas["parou"] = True
                    print(f"  {org}: 6 falhas seguidas; parei de tentar por agora (o que já baixou fica salvo).", flush=True)
                return n, "erro " + str(e)[:50]
            seguidas["n"] = 0
            if len(ps) < 2 or sum(map(len, ps)) < 300:
                return n, "curto"
            json.dump({"nome": f"{n['tipo']} {NOMES[org]} nº {n['numero']}", "url": n["link"], "em": hoje, "p": ps},
                      open(arq, "w", encoding="utf-8"), ensure_ascii=False, separators=(",", ":"))
            return n, "ok"
        res, tem = {"ok": 0, "ja": 0, "curto": 0, "erro": 0, "pulado": 0}, set()
        with ThreadPoolExecutor(3) as ex:
            for k, (n, st) in enumerate(ex.map(baixa, normas), 1):
                res[st.split()[0]] += 1
                if st in ("ok", "ja"):
                    tem.add(tid_de(n)); ix.setdefault(tid_de(n), hoje)
                if k % 50 == 0:
                    print(f"  {org} {k}/{len(normas)} {res}", flush=True)
        leis = []
        for n in normas:
            if tid_de(n) in tem:
                leis.append({"nome": n["ementa"][:300], "numero": f"{n['tipo']} {NOMES[org]} nº {n['numero']}", "link": n["link"],
                             "textoId": tid_de(n), "situacao": "", "data": ""})
        json.dump({"leis": leis}, open(os.path.join(RAIZ, "leis", f"atos-{org}.json"), "w", encoding="utf-8"), ensure_ascii=False, separators=(",", ":"))
        print(org, res, "→", len(leis), "atos", flush=True)
    json.dump(ix, open(ix_f, "w", encoding="utf-8"), ensure_ascii=False, indent=0, sort_keys=True)


if __name__ == "__main__":
    main()
