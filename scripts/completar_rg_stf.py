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


ULTIMO_RECORTE = {"ok": False, "motivo": ""}
MAX_ACORDAO = 40000   # ementa + dispositivo + assinatura cabem em ~4 páginas (uns 12 mil caracteres)
_MES = r"(?:janeiro|fevereiro|mar[çc]o|abril|maio|junho|julho|agosto|setembro|outubro|novembro|dezembro|jan|fev|mar|abr|mai|jun|jul|ago|set|out|nov|dez)"
# "Brasília, 21 de agosto de 2020." · "Brasília, Sessão Virtual de 19 a 26 de junho de 2020." · "Brasília, 21.8.2020"
RX_BRASILIA = re.compile(
    r"Bras[íi]lia,?\s*(?:[^\n]{0,60}?\d{1,2}\s*(?:º|o|°)?\s+de\s+" + _MES + r"\.?\s+de\s+\d{4}|\d{1,2}[./]\d{1,2}[./]\d{2,4})\.?", re.I)
RX_CABECALHO_PAG = re.compile(r"^\s*(?:Ementa e Ac[óo]rd[ãa]o|Inteiro Teor do Ac[óo]rd[ãa]o.*|Supremo Tribunal Federal|[A-Za-z]{2,4}\s*\d[\d.]*\s*/\s*[A-Z]{2}|\d{1,3}|Documento assinado digitalmente.*)\s*$")
RX_PARTE = re.compile(r"^[ \t]*[A-ZÀ-Ý][A-ZÀ-Ý.()/ ]{1,30}\s*:\s*\S")


def _sem_cabecalho_de_pagina(t):
    return "\n".join(l for l in t.split("\n") if not RX_CABECALHO_PAG.match(l))


def _inicio_sem_rotulo(t):
    """Acórdãos sem a palavra EMENTA (ementa vem logo depois da lista de partes e antes de "A C Ó R D Ã O"):
    devolve a posição do começo da ementa, ou None."""
    m = re.search(r"(?m)^[ \t]*(?:A\s+C\s+[ÓO]\s+R\s+D\s+[ÃA]\s+O\b|Vistos, relatados e discutidos)", t)
    if not m or m.start() > 30000:
        return None
    linhas = t[:m.start()].split("\n")
    pos, acum = 0, []
    for l in linhas:
        acum.append(pos)
        pos += len(l) + 1
    k = len(linhas) - 1
    while k >= 0:
        l = linhas[k]
        if RX_PARTE.match(l):
            break
        k -= 1
    if k < 0:
        return None
    k += 1
    # continuação do nome da parte (linhas só em maiúsculas) e cabeçalhos de página
    while k < len(linhas):
        l, anterior = linhas[k], linhas[k - 1]
        continuacao = (len(anterior) >= 45 and l.strip() and l == l.upper() and len(l) <= 60 and not l.rstrip().endswith(".") and not RX_PARTE.match(l))
        if not (RX_CABECALHO_PAG.match(l) or continuacao):
            break
        k += 1
    return acum[k] if k < len(acum) else None


def recortar_acordao(t):
    """Fica só com o acórdão propriamente dito: da EMENTA até a assinatura do ministro
    (ementa, dispositivo e teses, "Vistos, relatados e discutidos…", data e nome do relator/redator).
    Relatório, votos, debates e anexos ficam de fora. Guarda em ULTIMO_RECORTE se deu certo e como.
    A ementa começa no rótulo EMENTA ou, nos acórdãos sem rótulo, logo depois da lista de partes.
    Sem começo achado devolve o texto todo se for curto (decisão de repercussão geral); com começo mas
    sem o fim (ou com um recorte maior que MAX_ACORDAO) tenta outros marcadores e, no pior caso, corta no limite."""
    ULTIMO_RECORTE.update(ok=False, motivo="")
    if re.match(r"\s*Decis[ãa]o sobre Repercuss[ãa]o Geral", t[:200]):   # não tem ementa nem assinatura: fica como veio
        ULTIMO_RECORTE.update(ok=True, motivo="decisão sobre repercussão geral (sem ementa)")
        return t
    ini = (re.search(r"(?im)^[ \t]*E\s?M\s?E\s?N\s?T\s?A[ \t]*(?::|$)", t)      # "EMENTA:", "Ementa:" ou "EMENTA" sozinha na linha
           or re.search(r"\bE\s?M\s?E\s?N\s?T\s?A\s*:", t))                      # "… EMENTA: …" no meio da linha (só maiúsculas)
    sem = _inicio_sem_rotulo(t)
    vistos = re.search(r"Vistos, relatados e discutidos", t)
    if ini and vistos and ini.start() > vistos.start() and sem is not None:
        ini = None          # o "EMENTA" achado está nos votos, depois do acórdão: vale o começo sem rótulo
    inicio = ini.start() if ini else sem
    if inicio is None:
        ULTIMO_RECORTE.update(ok=len(t) <= MAX_ACORDAO, motivo="sem EMENTA")
        return t if len(t) <= MAX_ACORDAO else t[:MAX_ACORDAO].rsplit("\n", 1)[0]
    rotulo = "EMENTA" if ini else "ementa sem rótulo"
    base = t[inicio:]
    candidatos = []
    # 1) "Brasília, data" + nome do ministro (+ "Relator" e "Documento assinado digitalmente")
    fim = RX_BRASILIA.search(base)
    if fim:
        resto = base[fim.end():]
        ass = re.match(r"(?:[^\n]*\n){1,9}?[^\n]*[Dd]ocumento assinado digitalmente[^\n]*", resto)
        if ass:
            extra = ass.end()
        else:   # sem "Documento assinado": só as linhas curtas do nome do ministro, até o relatório
            extra = 0
            for l in resto.split("\n")[:5]:
                if len(l) > 90 or re.match(r"\s*(?:Relat[óo]rio|R\s?E\s?L\s?A\s?T|Voto|V\s?O\s?T)", l):
                    break
                extra += len(l) + 1
        candidatos.append(("Brasília + assinatura", fim.end() + extra))
    # 2) primeiro "Documento assinado digitalmente" depois da ementa
    m = re.search(r"[^\n]*[Dd]ocumento assinado digitalmente[^\n]*", base)
    if m:
        candidatos.append(("documento assinado", m.end()))
    # 3) começo do relatório/voto
    m = re.search(r"(?m)^[ \t]*(?:R\s?E\s?L\s?A\s?T\s?[ÓO]\s?R\s?I\s?O|V\s?O\s?T\s?O)\b", base[200:])
    if m:
        candidatos.append(("antes do relatório/voto", 200 + m.start()))
    for nome, corte in candidatos:
        if corte <= MAX_ACORDAO:
            ULTIMO_RECORTE.update(ok=True, motivo=rotulo + " → " + nome)
            return _sem_cabecalho_de_pagina(base[:corte]).strip()
    ULTIMO_RECORTE.update(ok=False, motivo=rotulo + ": nenhum marcador de fim até " + str(MAX_ACORDAO) + " caracteres")
    return _sem_cabecalho_de_pagina(base[:MAX_ACORDAO].rsplit("\n", 1)[0]).strip()


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
    ap.add_argument("--recortar-salvos", action="store_true", help="sem internet: refaz o recorte (ementa → assinatura) dos textos já guardados em stf/rg/")
    ap.add_argument("--enviar", action="store_true", help="grava no git e envia ao site (stf/rg e curadoria/debug-stf)")
    a = ap.parse_args()
    PASTA.mkdir(parents=True, exist_ok=True)
    if a.recortar_salvos:
        mudou = 0
        for p_ in sorted(PASTA.glob("*.json")):
            try:
                j = json.loads(p_.read_text(encoding="utf-8"))
            except ValueError:
                continue
            velho = j.get("texto", "")
            novo = recortar_acordao(velho)
            if ULTIMO_RECORTE["ok"] and len(novo) < len(velho) * 0.97:
                j["texto"] = novo
                p_.write_text(json.dumps(j, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
                mudou += 1
                print(f"  Tema {p_.stem}: {len(velho)} → {len(novo)} caracteres ({ULTIMO_RECORTE['motivo']})")
        print(f"{mudou} texto(s) recortado(s).")
        return
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
                print(f"    do EMENTA até a assinatura: {len(texto)} caracteres ({ULTIMO_RECORTE['motivo']})")
                if not ULTIMO_RECORTE["ok"]:
                    c.DEBUG.mkdir(parents=True, exist_ok=True)
                    (c.DEBUG / f"recorte-{t['tema']}.txt").write_text(inteiro[:6000] + "\n\n[…]\n\n" + "\n".join(l for l in inteiro.splitlines() if re.search(r"(?i)bras[íi]lia|assinado|ementa|relat[óo]rio|voto", l))[:6000], encoding="utf-8")
                    print("    ⚠ recorte incerto: guardei curadoria/debug-stf/recorte-" + t["tema"] + ".txt para a Claude ver")
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
