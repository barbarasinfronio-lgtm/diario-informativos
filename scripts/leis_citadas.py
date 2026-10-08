#!/usr/bin/env python3
"""
leis_citadas.py — texto das leis federais CITADAS nas decisões do site que ainda não estão no
Diário de Leis, para que a pessoa que incluir uma delas no próprio Diário (leis-incluidas.js) tenha
o "Leia-me" e possa anotar.

1. Varre informativos, Controle, Reclamações, STJ e temas do site atrás de "Lei nº 12.973/2014",
   "Lei Complementar 87/1996", "Decreto-Lei 3.689/1941", "Decreto 3.048/99"…
2. Fica com as mais citadas (--minimo, --max) que não estão no leis-data.js nem já foram buscadas.
3. Tenta os endereços possíveis no Planalto (cada ano/tipo tem um padrão), confere se a página é mesmo
   da norma (o número tem de aparecer no começo) e grava em leis/texto/<id>.json.
4. leis/texto/citadas.json: {"lei-12973-2014": "<id>"} — o site usa para achar o texto da lei incluída.

Roda no Mac (o Planalto bloqueia os servidores do GitHub), pelo "Atualizar Leis.command" ou assim:
    python3 scripts/leis_citadas.py --teste "Lei 12.973/2014"
    python3 scripts/leis_citadas.py --max 150 --minimo 2
"""
import argparse, collections, glob, json, re, sys
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(RAIZ / "scripts"))
import atualizar_informativos as robo  # noqa: E402

CITADAS = robo.TEXTO_DIR / "citadas.json"
FALHAS = robo.TEXTO_DIR / "citadas-falhas.json"
RE_LEI = re.compile(r"\b(Lei\s+Complementar|Lei|LC|Decreto[\s-]Lei|Decreto)\s*(?:Federal\s*)?(?:n[ºo°.]*\s*)?(\d{1,3}(?:\.\d{3})*)\s*/\s*(\d{4}|\d{2})\b", re.I)
VERSAO = 3   # sobe quando os endereços/leitor melhoram: as falhas anteriores são tentadas de novo
NOMES = {"lei": "Lei", "lc": "Lei Complementar", "dl": "Decreto-Lei", "decreto": "Decreto"}


def tipo_de(x):
    x = x.lower()
    if "complementar" in x or x == "lc":
        return "lc"
    if re.match(r"decreto[\s-]lei", x):
        return "dl"
    return "decreto" if x.startswith("decreto") else "lei"


def chave(tipo, n, ano):
    return f"{tipo}-{int(n)}-{ano}"


def textos_do_site():
    """Cada item do site vira um texto (uma lei conta uma vez por item)."""
    ld = lambda f: json.loads(Path(f).read_text(encoding="utf-8"))
    for x in ld(RAIZ / "informativos" / "indice.json")["itens"]:
        yield f"{x[4]} {x[5]}"
    for f in glob.glob(str(RAIZ / "controleconst" / "anos" / "*.json")) + glob.glob(str(RAIZ / "reclamacoes" / "anos" / "*.json")):
        o = ld(f)
        for x in (o if isinstance(o, list) else next((v for v in o.values() if isinstance(v, list)), [])):
            if isinstance(x, dict):
                yield " ".join(v for v in x.values() if isinstance(v, str))
    try:
        for x in ld(RAIZ / "stj" / "acordaos" / "indice.json")["itens"]:
            yield " ".join(str(v) for v in x if isinstance(v, str))
    except (OSError, ValueError, KeyError):
        pass
    s = (RAIZ / "site/decisoes/rg-repetitivos-data.js").read_text(encoding="utf-8")
    for x in json.loads(s[s.index("["):s.rindex("]") + 1]):
        yield " ".join(str(x.get(k, "")) for k in ("titulo", "tese", "destaque", "questao"))


def contar():
    c = collections.Counter()
    for t in textos_do_site():
        vistos = set()
        for m in RE_LEI.finditer(t):
            a = m.group(3) if len(m.group(3)) == 4 else ("19" if int(m.group(3)) > 30 else "20") + m.group(3)
            n = m.group(2).replace(".", "")
            if not (1 <= int(n) <= 99999) or not (1900 <= int(a) <= 2100):
                continue
            vistos.add(chave(tipo_de(m.group(1)), n, a))
        c.update(vistos)
    return c


def ja_no_diario():
    s = (RAIZ / "site/leis/leis-data.js").read_text(encoding="utf-8")
    out = set()
    for m in re.finditer(r'numero:\s*"([^"]*)"', s):
        mm = re.match(r"(?i)\s*(Lei Complementar|Lei|LC|Decreto[\s-]Lei|Decreto)\b.*?(\d[\d.]*)\s*/\s*(\d{4})", m.group(1))
        if mm:
            out.add(chave(tipo_de(mm.group(1)), mm.group(2).replace(".", ""), mm.group(3)))
    return out


# número aproximado da primeira lei federal de cada ano (para descartar citações de leis estaduais ou com erro de digitação)
_ANCORAS = {1960: 3700, 1965: 4700, 1970: 5500, 1975: 6200, 1980: 6800, 1985: 7500, 1990: 8000, 1995: 8900,
            2000: 9900, 2005: 11000, 2010: 12200, 2015: 13200, 2020: 14000, 2025: 15200, 2030: 16400}


def _inicio_do_ano(a):
    a0 = max(1960, min(a, 2030))
    i = a0 - a0 % 5
    j = min(i + 5, 2030)
    if i == j:
        return _ANCORAS[i]
    return _ANCORAS[i] + (_ANCORAS[j] - _ANCORAS[i]) * (a0 - i) / 5


def plausivel(tipo, n, ano):
    """Lei federal: o número tem de caber no ano (com folga). Lei complementar e decretos não passam por isso."""
    n, a = int(n), int(ano)
    if tipo != "lei" or a < 1960:
        return True
    return _inicio_do_ano(a) - 500 <= n <= _inicio_do_ano(a + 1) + 500


def paragrafos_com_riscado(t):
    """Leis REVOGADAS vêm inteiras dentro de <strike> no Planalto: aqui o texto riscado fica (é o texto histórico)."""
    return robo.paragrafos_da_lei(re.sub(r"(?i)</?(?:strike|s|del)\b[^>]*>", "", t))


def ano_confere(tipo, ano, paras):
    """Mesmo número, outro ano? (ex.: o Decreto 2.100 de 1937 no lugar do de 1996). Lei complementar vale pelo número."""
    return tipo == "lc" or re.search(rf"\b{ano}\b", " ".join(paras[:14])) is not None


def com_ponto(n):
    n = int(n)
    return f"{n // 1000}.{n % 1000:03d}" if n >= 1000 else str(n)


def enderecos(tipo, n, ano):
    """Endereços possíveis no Planalto (a estrutura muda por tipo, ano e governo)."""
    base = "https://www.planalto.gov.br/ccivil_03/"
    n, a = int(n), int(ano)
    d = com_ponto(n)
    nomes = lambda pre: [f"{pre}{n}.htm", f"{pre.upper()}{n}.htm", f"{pre}{d}.htm"] + \
        [f"{pre}{n}{suf}.htm" for suf in ("compilado", "compilada", "consol", "cons", "Compilado")]
    out = []
    if tipo == "lei":
        spans = [(2004, 2006), (2007, 2010), (2011, 2014), (2015, 2018), (2019, 2022), (2023, 2026)]
        for i, j in spans:
            if i <= a <= j:
                out += [f"_ato{i}-{j}/{a}/lei/{f}" for f in nomes("l")]
        if a == 2003:
            out += [f"leis/2003/{f}" for f in nomes("l")]
        if a == 2002:
            out += [f"leis/2002/{f}" for f in nomes("l")]
        if a == 2001:
            out += [f"leis/leis_2001/{f}" for f in nomes("l")]
        out += [f"leis/{f}" for f in nomes("l")]
        out += [f"leis/{a}/{f}" for f in nomes("l")]
    elif tipo == "lc":
        out += [f"leis/lcp/{f}" for f in nomes("lcp")]
    elif tipo == "dl":
        out += [f"decreto-lei/del{n:04d}.htm", f"decreto-lei/Del{n:04d}.htm", f"decreto-lei/del{n}.htm",
                f"decreto-lei/del{n:04d}compilado.htm", f"decreto-lei/del{n:04d}compilada.htm", f"decreto-lei/del{n}compilado.htm",
                f"decreto-lei/1937-1946/del{n:04d}.htm", f"decreto-lei/1937-1946/Del{n:04d}.htm",
                f"decreto-lei/1965-1988/del{n:04d}.htm", f"decreto-lei/1965-1988/Del{n:04d}.htm"]
    else:
        for i, j in [(2004, 2006), (2007, 2010), (2011, 2014), (2015, 2018), (2019, 2022), (2023, 2026)]:
            if i <= a <= j:
                out += [f"_ato{i}-{j}/{a}/decreto/{f}" for f in nomes("d")]
        out += [f"decreto/{f}" for f in nomes("d")]
        for pasta in ("1930-1949", "1950-1969", "1970-1979", "1980-1989", "1990-1994", "2003", "2002", "2001", "1996", "1930-1949"):
            out += [f"decreto/{pasta}/{f}" for f in nomes("d")[:2]]
    return [base + x for x in dict.fromkeys(out)]


def buscar_lei(tipo, n, ano, hoje):
    numero = f"{NOMES[tipo]} nº {com_ponto(n)}/{ano}"
    for url in enderecos(tipo, n, ano):
        try:
            pg = robo.pagina(url, valida=lambda x: len(x) > 800)
        except robo.Falha:
            continue
        riscado = "<strike" in pg.lower() or "<s>" in pg.lower()
        paras = paragrafos_com_riscado(pg) if riscado else robo.paragrafos_da_lei(pg)
        if not ano_confere(tipo, ano, paras):
            print(f"    (o texto é de outro ano: \"{paras[0][:50] if paras else ''}\")")
            continue
        antes = len(robo.ERRADOS)
        if robo.salvar_texto(url, pg, numero, hoje, numero=numero):
            return url, True
        if len(robo.ERRADOS) == antes and riscado:      # lei revogada: o texto inteiro está riscado
            if robo.salvar_texto(url, pg, numero, hoje, extrator=paragrafos_com_riscado, numero=numero):
                return url, True
        if (robo.TEXTO_DIR / f"{robo.id_texto(url)}.json").exists() and len(robo.ERRADOS) == antes:
            return url, True        # já estava gravada e não mudou
        if len(robo.ERRADOS) == antes:      # ainda "incompleto": guarda o começo da página para eu ajustar o leitor
            try:
                dbg = robo.DEBUG_DIR / f"citada-{robo.id_texto(url)}.html"
                if not dbg.exists() and len(list(robo.DEBUG_DIR.glob("citada-*.html"))) < 12:
                    robo.DEBUG_DIR.mkdir(parents=True, exist_ok=True)
                    dbg.write_text(f"<!-- {url}: {len(paras)} parágrafos, {sum(map(len, paras))} caracteres -->\n" + pg[:6000], encoding="utf-8")
            except Exception:   # noqa: BLE001
                pass
    return None, False


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--teste")
    ap.add_argument("--max", type=int, default=150)
    ap.add_argument("--minimo", type=int, default=1)
    a = ap.parse_args()
    hoje = robo.hoje()
    citadas = json.loads(CITADAS.read_text(encoding="utf-8")) if CITADAS.exists() else {}
    falhas = json.loads(FALHAS.read_text(encoding="utf-8")) if FALHAS.exists() else {}
    if a.teste:
        m = RE_LEI.search(a.teste)
        alvos = [(chave(tipo_de(m.group(1)), m.group(2).replace(".", ""), m.group(3) if len(m.group(3)) == 4 else "20" + m.group(3)), 0)]
    else:
        cont = contar()
        diario = ja_no_diario()
        alvos = [(k, v) for k, v in cont.most_common() if v >= a.minimo and k not in diario and k not in citadas and plausivel(*k.split("-"))
                and not (isinstance(falhas.get(k), dict) and falhas[k].get("v") == VERSAO)]
        print(f"{len(cont)} leis citadas no site; {len(alvos)} com {a.minimo}+ citações ainda sem texto.")
        alvos = alvos[:a.max]
    ok = 0
    for k, v in alvos:
        tipo, n, ano = k.split("-")
        print(f"  … {NOMES[tipo]} nº {com_ponto(n)}/{ano} ({v} citações)", flush=True)
        try:
            url, gravou = buscar_lei(tipo, n, ano, hoje)
        except KeyboardInterrupt:
            print("\\ninterrompido; o que já foi buscado está guardado.")
            break
        if url:
            citadas[k] = robo.id_texto(url)
            ok += 1
        else:
            falhas[k] = {"v": VERSAO, "em": hoje}
            print("    não achei a norma no Planalto")
        CITADAS.write_text(json.dumps(citadas, ensure_ascii=False, indent=0), encoding="utf-8")
        FALHAS.write_text(json.dumps(falhas, ensure_ascii=False, indent=0), encoding="utf-8")
    robo.indice_dos_textos()
    print(f"{ok} lei(s) com texto; {len(citadas)} no total em leis/texto/citadas.json.")


if __name__ == "__main__":
    main()
