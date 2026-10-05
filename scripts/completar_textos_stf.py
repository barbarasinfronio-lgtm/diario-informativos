#!/usr/bin/env python3
"""
completar_textos_stf.py — busca no portal do STF o texto COMPLETO das decisões
que ficaram cortadas em 1.000 caracteres (Controle de Constitucionalidade e
Reclamações) e grava o texto inteiro no site.

Roda no Mac (o portal do STF bloqueia os servidores do GitHub), pelo
"Completar Textos.command" ou assim:

    python3 scripts/completar_textos_stf.py --teste "ADI 4357"      # só mostra, não grava
    python3 scripts/completar_textos_stf.py --max 100               # 100 decisões por vez
    python3 scripts/completar_textos_stf.py --tudo

Como funciona, para cada decisão cortada:
  1. abre a página do processo e acha o "incidente" (número interno do STF);
  2. abre a aba "Decisões" do processo (abaDecisoes.asp);
  3. acha, no texto da aba, o trecho que COMEÇA igual ao texto cortado e pega
     o bloco inteiro; só aceita se for maior e começar igual.
O que já foi buscado fica em curadoria/textos-completos-cache.json (não busca de
novo; quem falhou é tentado de novo na próxima vez). Se a página mudar de formato,
o HTML lido é guardado em curadoria/debug-stf/ para eu ajustar.
"""
import argparse, html, json, os, re, signal, sys, time, unicodedata, urllib.parse
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(RAIZ / "scripts"))
import atualizar_informativos as robo  # noqa: E402  (pagina(), Falha: Firefox/Chrome se o site recusar)

FONTES = [("controleconst/adi_dados.js", "tema"), ("reclamacoes/reclamacoes-data.js", "resumo")]
CORTE = 1000
CACHE = RAIZ / "curadoria" / "textos-completos-cache.json"
DEBUG = RAIZ / "curadoria" / "debug-stf"
DETALHE = "https://portal.stf.jus.br/processos/detalhe.asp?processo="
ABA = "https://portal.stf.jus.br/processos/abaDecisoes.asp?incidente={inc}&numeroProcesso={num}&classeProcesso={cls}&numeroTema="


def ler_js(f):
    s = (RAIZ / f).read_text(encoding="utf-8")
    ini = s.index("[")
    fim = s.index("];", ini) + 1 if "];" in s else s.rindex("]") + 1
    indent = 1 if s[ini:ini + 3].startswith("[\n ") else None
    return s[:ini], json.loads(s[ini:fim]), s[fim:], indent


def gravar_js(f, prefixo, lista, sufixo, indent):
    corpo = (json.dumps(lista, ensure_ascii=False, indent=indent) if indent
             else json.dumps(lista, ensure_ascii=False, separators=(",", ":")))
    (RAIZ / f).write_text(prefixo + corpo + sufixo, encoding="utf-8")


def norm(s):
    s = unicodedata.normalize("NFD", (s or "").lower())
    return re.sub(r"[^a-z0-9]+", " ", "".join(c for c in s if unicodedata.category(c) != "Mn")).strip()


def blocos(pagina_html):
    """Texto da página em blocos (cada <div>/<p>/<tr>… vira uma linha)."""
    t = re.sub(r"(?is)<(script|style)\b.*?</\1>", " ", pagina_html)
    t = re.sub(r"(?i)</?(p|div|li|ul|ol|h\d|tr|td|table|section|br|span class=\"[^\"]*(?:text|descricao)[^\"]*\")\b[^>]*>", "\n", t)
    t = html.unescape(re.sub(r"<[^>]+>", " ", t))
    return [re.sub(r"\s+", " ", b).strip() for b in t.split("\n") if b.strip()]


def processo_principal(p):
    p = re.split(r" e | \(|, ", p or "")[0].strip()
    m = re.match(r"([A-Za-z]+)\s*([\d.]+)", p)
    return (m[1].upper(), m[2].replace(".", "")) if m else (None, None)


RX_INC = re.compile(r"incidente(?:=|%3D|\"\s*:\s*\"?|\s*:\s*)(\d{4,})", re.I)


def achar_incidente(classe, num):
    """Número interno ("incidente") do processo. Tenta: a página do processo; a mesma
    pelo Firefox (se for montada por JavaScript); a lista de processos por classe/número."""
    DEBUG.mkdir(parents=True, exist_ok=True)
    tentativas = [
        ("detalhe", lambda: robo.pagina(DETALHE + urllib.parse.quote(f"{classe} {num}"))),
        ("detalhe-firefox", lambda: robo.pagina_firefox(DETALHE + urllib.parse.quote(f"{classe} {num}"))),
        ("lista", lambda: robo.pagina(f"https://portal.stf.jus.br/processos/listarProcessos.asp?classe={classe}&numeroProcesso={num}")),
        ("lista-firefox", lambda: robo.pagina_firefox(f"https://portal.stf.jus.br/processos/listarProcessos.asp?classe={classe}&numeroProcesso={num}")),
    ]
    for nome, f in tentativas:
        try:
            t = f()
        except robo.Falha as e:
            print(f"    ({nome}: {str(e)[:100]})")
            continue
        m = RX_INC.search(t)
        if m:
            return m[1]
        (DEBUG / f"{classe}-{num}-{nome}.html").write_text(t[:300000], encoding="utf-8")
        print(f"    ({nome}: {len(t)} caracteres, sem incidente)")
    raise robo.Falha("não achei o 'incidente' do processo (páginas guardadas em curadoria/debug-stf/)")


def rtf_para_texto(corpo):
    """RTF (bytes) → texto simples. Trata \\'xx (cp1252), \\uN (unicode), \\par e grupos de formatação."""
    t = corpo.decode("latin-1")
    # quebras de linha "cruas" do arquivo não existem no RTF (só \\par): sem isso, as palavras saem partidas
    t = re.sub(r"(\\[a-zA-Z]+-?\d*)[\r\n]+", r"\1 ", t)
    t = re.sub(r"[\r\n]+", "", t)
    # grupos que não são texto (tabelas de fontes/cores, estilos, cabeçalhos)
    for nome in ("fonttbl", "colortbl", "stylesheet", "info", "header", "footer", "pict", "listtable", "listoverridetable", "generator"):
        i = 0
        while True:
            i = t.find("{\\" + nome, i)
            if i < 0:
                i = t.find("{\\*\\" + nome, 0) if False else -1
                break
            nivel, j = 0, i
            while j < len(t):
                if t[j] == "{" and t[j - 1] != "\\": nivel += 1
                elif t[j] == "}" and t[j - 1] != "\\":
                    nivel -= 1
                    if nivel == 0: break
                j += 1
            t = t[:i] + t[j + 1:]
    t = re.sub(r"\{\\\*[^{}]*\}", "", t)

    def uni(m):
        n = int(m[1]); n = n + 65536 if n < 0 else n
        return chr(n)
    t = re.sub(r"\\u(-?\d+) ?(?:\\'[0-9a-fA-F]{2}|[^\\{}])", lambda m: uni(m), t)
    t = re.sub(r"\\'([0-9a-fA-F]{2})", lambda m: bytes([int(m[1], 16)]).decode("cp1252", "replace"), t)
    t = re.sub(r"\\(par|line|sect|page)\b ?", "\n", t)
    t = re.sub(r"\\tab\b ?", " ", t)
    t = re.sub(r"\\[a-zA-Z]+-?\d* ?", "", t)
    t = t.replace("\\{", "{").replace("\\}", "}").replace("\\\\", "\\")
    t = re.sub(r"[{}]", "", t)
    return re.sub(r"[ \t]+", " ", t).strip()


def texto_completo(truncado, classe, num, inc):
    pg = robo.pagina(ABA.format(inc=inc, num=num, cls=classe))
    prefixo = norm(truncado)[:160]
    def guardar(sufixo, conteudo):
        DEBUG.mkdir(parents=True, exist_ok=True)
        (DEBUG / f"{classe}-{num}-{sufixo}").write_text(conteudo[:400000], encoding="utf-8")
    # a aba mostra só os primeiros 1.000 caracteres; o texto inteiro está no arquivo
    # "Decisão de Julgamento" (RTF) do mesmo andamento
    for item in re.split(r'(?=<div class="andamento-item")', pg):
        if prefixo not in norm(re.sub(r"<[^>]+>", " ", html.unescape(item))):
            continue
        m = re.search(r'downloadTexto\.asp\?id=(\d+)(?:&amp;|&)ext=RTF', item)
        if not m:
            continue
        status, tipo, corpo = robo.buscar(f"https://portal.stf.jus.br/processos/downloadTexto.asp?id={m[1]}&ext=RTF")
        if status != 200 or b"{\\rtf" not in corpo[:50]:
            raise robo.Falha(f"o arquivo da decisão não abriu (HTTP {status})")
        texto = rtf_para_texto(corpo)
        k = norm(texto).find(prefixo[:80])
        if k < 0:
            guardar(f"{m[1]}.txt", texto)
            raise robo.Falha("o arquivo da decisão não começa igual ao texto que temos (guardado em curadoria/debug-stf/)")
        palavras = re.findall(r"\S+", truncado)[:6]
        mi = re.search(r"\s+".join(re.escape(w) for w in palavras), texto, re.I)
        cand = (texto[mi.start():] if mi else texto).strip()
        if len(norm(cand)) <= len(norm(truncado)):
            guardar(f"{m[1]}.txt", texto)
            raise robo.Falha("o arquivo da decisão não é maior que o texto que já temos")
        return cand
    guardar("abaDecisoes.html", pg)
    raise robo.Falha("não achei o andamento (ou o link 'Decisão de Julgamento') na aba Decisões (página guardada em curadoria/debug-stf/)")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--teste", help='ex.: "ADI 4357" — só mostra, não grava')
    ap.add_argument("--max", type=int, default=100)
    ap.add_argument("--tudo", action="store_true")
    ap.add_argument("--espera", type=float, default=1.5)
    a = ap.parse_args()
    cache = json.loads(CACHE.read_text(encoding="utf-8")) if CACHE.exists() else {}
    dados = {f: ler_js(f) for f, _ in FONTES}
    alvos = []
    for f, campo in FONTES:
        for d in dados[f][1]:
            t = d.get(campo) or ""
            if len(t) == CORTE or t.endswith("…"):   # cortado em exatamente 1.000 (o resto é texto completo)
                alvos.append((f, campo, d))
    print(f"{len(alvos)} decisões cortadas; {sum(1 for _, _, d in alvos if d['id'] in cache)} já buscadas antes.")
    if a.teste:
        c, n = processo_principal(a.teste)
        alvos = [x for x in alvos if processo_principal(x[2]["processo"]) == (c, n)]
        print(f"modo teste: {len(alvos)} decisão(ões) de {c} {n}")
    else:
        alvos = [x for x in alvos if x[2]["id"] not in cache]
        if not a.tudo:
            alvos = alvos[:a.max]
    incidentes = {}
    feitos = falhas = 0
    motivos = {}
    for f, campo, d in alvos:
        classe, num = processo_principal(d["processo"])
        if not classe:
            continue
        try:
            if hasattr(signal, "SIGALRM"):   # uma página pendurada não pode travar a rodada
                signal.signal(signal.SIGALRM, lambda *_: (_ for _ in ()).throw(robo.Falha("passou de 3 minutos; pulei")))
                signal.alarm(180)
            if (classe, num) not in incidentes:
                incidentes[(classe, num)] = achar_incidente(classe, num)
                time.sleep(a.espera)
            novo = texto_completo(d[campo], classe, num, incidentes[(classe, num)])
            time.sleep(a.espera)
        except robo.Falha as e:
            if hasattr(signal, "SIGALRM"): signal.alarm(0)
            falhas += 1
            print(f"  {d['processo']} ({d.get('data') or d.get('dataJulgamento')}): {e}")
            if not a.teste:
                motivos[d["id"]] = {"processo": d["processo"], "motivo": str(e)[:200]}
            continue
        except KeyboardInterrupt:
            print("\ninterrompido; o que já foi buscado está guardado.")
            break
        if hasattr(signal, "SIGALRM"): signal.alarm(0)
        feitos += 1
        print(f"  {d['processo']} ({d.get('data') or d.get('dataJulgamento')}): {len(d[campo])} → {len(novo)} caracteres")
        if a.teste:
            print("-" * 60 + "\n" + novo + "\n" + "-" * 60)
            continue
        cache[d["id"]] = {"campo": campo, "texto": novo}
        d[campo] = novo
        CACHE.parent.mkdir(exist_ok=True)
        CACHE.write_text(json.dumps(cache, ensure_ascii=False, indent=0), encoding="utf-8")
    # reaplica o que está no cache (inclusive de rodadas anteriores) nos dados
    if not a.teste:
        for f, campo in FONTES:
            p, lista, s, i = dados[f]
            for d in lista:
                c = cache.get(d["id"])
                if c and c["campo"] == campo:
                    d[campo] = c["texto"]
            gravar_js(f, p, lista, s, i)
        (RAIZ / "curadoria" / "textos-completos-falhas.json").write_text(json.dumps(motivos, ensure_ascii=False, indent=1), encoding="utf-8")
        print("Dados atualizados; agora rode: python3 scripts/dividir_por_ano.py")
    print(f"{feitos} completada(s), {falhas} sem sucesso.")


if __name__ == "__main__":
    main()
