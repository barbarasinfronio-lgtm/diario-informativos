#!/usr/bin/env python3
"""
completar_rg_stf.py — busca no portal do STF o INTEIRO TEOR do acórdão de cada Tema de
repercussão geral (rg-repetitivos-data.js, orgao STF, tipo rg) e grava em stf/rg/<tema>.json
{"processo","data","texto"}; o Diário das Decisões mostra ao abrir o card.

Roda no Mac (o portal do STF bloqueia os servidores do GitHub), pelo "Completar Teses STF.command":

    python3 scripts/completar_rg_stf.py --tema 914      # só o tema 914 (grava)
    python3 scripts/completar_rg_stf.py --max 100       # 100 temas por vez (o 914 vai primeiro)
O que já foi buscado não é buscado de novo; quem falhou é tentado na próxima vez.
"""
import argparse, json, re, signal, sys, time
from html import unescape as html_unescape
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(RAIZ / "scripts"))
import completar_textos_stf as c   # noqa: E402
import completar_extras_stf as ex  # noqa: E402
robo = c.robo
PASTA = RAIZ / "stf" / "rg"
FALHAS = RAIZ / "curadoria" / "rg-textos-falhas.json"
LIMITE = 1500000


def temas():
    s = (RAIZ / "rg-repetitivos-data.js").read_text(encoding="utf-8")
    L = json.loads(s[s.index("["):s.rindex("]") + 1])
    out = []
    for d in L:
        if d.get("orgao") == "STF" and d.get("tipo") == "rg" and d.get("tema") and d.get("processo"):
            out.append({"tema": str(d["tema"]), "processo": d["processo"], "data": d.get("data") or ""})
    return out


RX_RODAPE = re.compile(r"(?m)^(?:Documento assinado digitalmente conforme MP.*|http://www\.stf\.jus\.br/portal/autenticacao/autenticarDocumento\.asp.*|Inteiro Teor do Acórdão - Página \d+ de \d+\s*|Supremo Tribunal Federal Supremo Tribunal Federal\s*)$\n?")


def tirar_linhas_duplicadas(t):
    """O texto de PDFs do STF sai com cada linha duas vezes (camada de texto dupla); as numeradas
    saem como "3. 3. Definição…" seguida de "Definição…". Fica só uma cópia de cada."""
    out = []
    ls = t.split("\n")
    i = 0
    while i < len(ls):
        a = ls[i]
        b = ls[i + 1] if i + 1 < len(ls) else None
        if b is not None and a.strip() and a == b:
            i += 1       # descarta a primeira cópia, a seguinte entra no próximo passo
            continue
        if b is not None and len(b) > 15 and a.endswith(b) and 0 < len(a) - len(b) <= 30:
            m_ = re.match(r"^(\S+)\s+\1\s*$", a[:len(a) - len(b)].strip())   # "3. 3. " + texto
            ls[i + 1] = (m_.group(1) + " " + b) if m_ else b      # mantém a numeração, uma vez só
            i += 1
            continue
        out.append(a)
        i += 1
    return "\n".join(out)


def limpar_pdf(t):
    """Tira do texto do PDF as linhas repetidas em toda página (assinatura digital, link de
    autenticação, "Página N de M") e as linhas em branco em excesso."""
    t = RX_RODAPE.sub("", t)
    t = tirar_linhas_duplicadas(t)
    return re.sub(r"\n{3,}", "\n\n", t).strip()


def recortar_acordao(t):
    """Fica só com o acórdão propriamente dito: da EMENTA até a assinatura do ministro
    (ementa, dispositivo e teses, "Vistos, relatados e discutidos…", data e nome do relator/redator).
    Relatório, votos, debates e anexos ficam de fora. Sem os dois marcadores, devolve o texto todo."""
    ini = re.search(r"(?im)^[ \t]*E\s?M\s?E\s?N\s?T\s?A[ \t]*(?::|$)", t)   # "EMENTA:", "Ementa:" ou "EMENTA" sozinha na linha
    if not ini:
        return t
    fim = re.search(r"Bras[íi]lia,?\s+\d{1,2}\s*(?:º|o)?\s+de\s+[a-zç]+\s+de\s+\d{4}\.?", t[ini.start():], re.I)
    if not fim:
        return t
    resto = t[ini.start() + fim.end():]
    # nome do ministro, "Relator/Redator para o acórdão" e "Documento assinado digitalmente"
    ass = re.match(r"(?:\s*\n[^\n]{0,80}){1,5}?\s*\n[^\n]*[Dd]ocumento assinado digitalmente", resto)
    corte = ini.start() + fim.end() + (ass.end() if ass else min(len(resto), 200))
    return t[ini.start():corte].strip()


def _dnum(x):
    m = re.match(r"(\d{2})/(\d{2})/(\d{4})", x or "")
    return (m.group(3) + m.group(2) + m.group(1)) if m else ""


def escolher_acordao(pg_tema, data_tema):
    """Na página do tema (verAndamentoProcesso), entre os "Inteiro teor do acórdão", o publicado
    logo depois do julgamento do tema (o de mérito); se não houver, o mais próximo antes."""
    alvo = _dnum(data_tema)
    if not alvo:
        return None
    linhas = []
    for tr in re.findall(r"(?is)<tr\b.*?</tr>", pg_tema):
        tds = [re.sub(r"\s+", " ", re.sub(r"<[^>]+>", " ", x)).strip() for x in re.findall(r"(?is)<td\b[^>]*>(.*?)</td>", tr)]
        lk = re.search(r'(?is)href="([^"]*downloadPeca[^"]*)"[^>]*>\s*Inteiro teor do ac', tr)
        if lk and tds and _dnum(tds[0]):
            linhas.append((_dnum(tds[0]), html_unescape(lk.group(1))))
    depois = sorted(x for x in linhas if x[0] >= alvo)
    antes = sorted((x for x in linhas if x[0] < alvo), reverse=True)
    return (depois or antes or [None])[0]


def acordao_inteiro_teor(classe, num, inc, tema, primeiro, data_tema=""):
    """Tenta achar o ACÓRDÃO (ementa, relatório e votos) do tema, que não está na aba Decisões
    (ali só vem a ata/decisão de julgamento). Na página do tema escolhe o "Inteiro teor do acórdão"
    publicado logo depois do julgamento; se não achar, tenta os links "Acórdão"/"Inteiro teor" das
    outras páginas do processo. Na primeira vez guarda as páginas em curadoria/debug-stf/."""
    q = f"incidente={inc}&numeroProcesso={num}&classeProcesso={classe}"
    paginas = {
        "tema": f"https://portal.stf.jus.br/jurisprudenciaRepercussao/verAndamentoProcesso.asp?incidente={inc}&numeroTema={tema}",
        "pecas": f"https://portal.stf.jus.br/processos/abaPecas.asp?{q}",
        "andamentos": f"https://portal.stf.jus.br/processos/abaAndamentos.asp?{q}",
    }
    achados, rotulos, preferido = [], {}, None
    for nome, url in paginas.items():
        if preferido and not primeiro:
            break
        try:
            pg = robo.pagina(url)
        except robo.Falha as e:
            print(f"    (acórdão: {nome}: {str(e)[:80]})")
            continue
        if primeiro:
            c.DEBUG.mkdir(parents=True, exist_ok=True)
            (c.DEBUG / f"rg{tema}-{nome}.html").write_text(pg[:300000], encoding="utf-8")
        if nome == "tema":
            esc = escolher_acordao(pg, data_tema)
            if esc:
                preferido = esc[1]
                print(f"    acórdão escolhido: publicado em {esc[0][6:]}/{esc[0][4:6]}/{esc[0][:4]} (julgamento do tema em {data_tema})")
        for m in re.finditer(r'(?is)<a\b[^>]*href="([^"]*(?:downloadPeca|downloadTexto|paginador)[^"]*)"[^>]*>(.*?)</a>', pg):
            rotulo = re.sub(r"\s+", " ", re.sub(r"<[^>]+>", " ", m.group(2))).strip()
            contexto = re.sub(r"\s+", " ", re.sub(r"<[^>]+>", " ", pg[max(0, m.start() - 300):m.start()]))
            if re.search(r"(?i)ac[óo]rd[ãa]o|inteiro teor", rotulo + " " + contexto[-200:]):
                href = html_unescape(m.group(1)).replace("&amp;", "&")
                achados.append(href)
                rotulos[href] = (rotulo or contexto[-80:]).strip()[:80]
    ordem = [preferido] if preferido else list(dict.fromkeys(achados))
    melhor = ""
    for href in ordem:
        url = href if href.startswith("http") else "https://portal.stf.jus.br" + (href if href.startswith("/") else "/processos/" + href)
        try:
            status, tipo, corpo = robo.buscar(url)
        except robo.Falha:
            continue
        if status != 200:
            continue
        try:
            if b"{\\rtf" in corpo[:50]:
                t = c.rtf_para_texto(corpo)
            elif corpo[:4] == b"%PDF":
                t = robo.texto_de_pdf(corpo)
            else:
                continue
        except Exception as e:   # noqa: BLE001
            print(f"    (acórdão: não consegui ler {url[-60:]}: {str(e)[:60]})")
            continue
        t = limpar_pdf(t)
        print(f"    candidato: {rotulos.get(href, '?')!r} → {len(t)} caracteres")
        if len(t) > len(melhor):
            melhor = t
    return melhor


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--tema")
    ap.add_argument("--max", type=int, default=100)
    ap.add_argument("--espera", type=float, default=1.5)
    ap.add_argument("--refazer-ata", action="store_true", help="busca de novo os temas que só têm a ata (sem o acórdão)")
    ap.add_argument("--enviar", action="store_true", help="grava no git e envia ao site (stf/rg e curadoria/debug-stf)")
    a = ap.parse_args()
    PASTA.mkdir(parents=True, exist_ok=True)
    todos = temas()
    if a.tema:
        alvos = [t for t in todos if t["tema"] == a.tema.replace(".", "")]
    else:
        feitos = set()
        for p_ in PASTA.glob("*.json"):
            try:
                j = json.loads(p_.read_text(encoding="utf-8"))
            except ValueError:
                continue
            if j.get("completo", False) or not a.refazer_ata:
                feitos.add(p_.stem)
        alvos = [t for t in todos if t["tema"] not in feitos]
        alvos.sort(key=lambda t: (t["tema"] != "914", -int(re.sub(r"\D", "", t["tema"]) or 0)))   # 914 primeiro; depois os mais novos
        alvos = alvos[:a.max]
    print(f"{len(alvos)} tema(s) para buscar; {len(list(PASTA.glob('*.json')))} já feitos.")
    falhas, inc, ok = {}, {}, 0
    for t in alvos:
        classe, num = c.processo_principal(t["processo"])
        if not classe:
            continue
        print(f"  … Tema {t['tema']} — {t['processo']} ({t['data']})", flush=True)
        try:
            if hasattr(signal, "SIGALRM"):
                signal.signal(signal.SIGALRM, lambda *_: (_ for _ in ()).throw(robo.Falha("passou de 2 minutos; pulei")))
                signal.alarm(150)
            if (classe, num) not in inc:
                inc[(classe, num)] = c.achar_incidente(classe, num)
                time.sleep(a.espera)
            texto = ex.buscar(classe, num, inc[(classe, num)], t["data"])
            try:
                inteiro = acordao_inteiro_teor(classe, num, inc[(classe, num)], t["tema"], primeiro=(ok == 0 and not falhas), data_tema=t["data"])
            except robo.Falha:
                inteiro = ""
            if len(inteiro) > len(texto):
                print(f"    acórdão inteiro: {len(inteiro)} caracteres (a ata tinha {len(texto)})")
                texto = recortar_acordao(inteiro)
                print(f"    do EMENTA até a assinatura: {len(texto)} caracteres")
                completo = True
            else:
                print("    (só a ata/decisão de julgamento; o acórdão não foi achado)")
                completo = False
            time.sleep(a.espera)
            if hasattr(signal, "SIGALRM"): signal.alarm(0)
        except robo.Falha as e:
            if hasattr(signal, "SIGALRM"): signal.alarm(0)
            if "passou de" in str(e): robo._firefox_fechar()
            falhas[t["tema"]] = {"processo": t["processo"], "motivo": str(e)[:200]}
            print(f"    sem sucesso: {e}")
            continue
        except KeyboardInterrupt:
            print("\ninterrompido; o que já foi buscado está guardado.")
            break
        ok += 1
        print(f"    {len(texto)} caracteres")
        (PASTA / f"{t['tema']}.json").write_text(json.dumps(
            {"processo": t["processo"], "data": t["data"], "completo": completo, "texto": texto[:LIMITE]}, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
    FALHAS.write_text(json.dumps(falhas, ensure_ascii=False, indent=1), encoding="utf-8")
    print(f"{ok} completado(s), {len(falhas)} sem sucesso.")
    if a.enviar:
        import subprocess
        sh = lambda *x: subprocess.run(["git", *x], cwd=RAIZ).returncode
        sh("add", "stf/rg", "curadoria/rg-textos-falhas.json", "curadoria/debug-stf")
        if sh("diff", "--cached", "--quiet") != 0:
            sh("commit", "-q", "-m", "Inteiro teor de temas de repercussão geral (do Mac)")
            for _ in range(3):
                if sh("push", "-q", "origin", "HEAD:main") == 0:
                    print("✅ Enviado para o site."); break
                sh("pull", "-q", "--rebase", "--autostash", "origin", "main")


if __name__ == "__main__":
    main()
