#!/usr/bin/env python3
"""
enunciados_foruns.py — enunciados de fóruns e escolas (FONAJE, FONAJEF, FONACRIM, ENFAM, FPPC, Jornadas de Saúde
do CNJ) para o Diário das Súmulas. Cada fonte vira um "tribunal" (bloco) novo, como as Jornadas do CJF
(scripts/jornadas_cjf.py).

Só entra o que já caiu em prova: depois de montar com TODOS os enunciados, rode o cruzamento com as provas
(scripts/cobrancas_provas.py) e depois  python3 scripts/enunciados_foruns.py podar  — fica só o que aparece em
pelo menos uma questão do acervo de provas.

Fontes (cada uma tem seu leitor em LEITORES):
  fonaje_civel / fonaje_criminal / fonaje_fazenda — https://fonaje.amb.com.br/enunciados/ (e -criminais, -da-fazenda-publica)

Uso:
    python3 scripts/enunciados_foruns.py coletar            # baixa as páginas (Firefox invisível se o site recusar)
    python3 scripts/enunciados_foruns.py montar [--todos]   # grava os blocos em site/sumulas/sumulas-data.js
    python3 scripts/enunciados_foruns.py podar              # tira o que não aparece em prova (usa provas/cobrancas.json)
"""
import argparse, html, json, re, sys
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(RAIZ / "scripts"))
CACHE = Path.home() / "EstudaMana" / "cache-enunciados"
INI, FIM = "  // <enunciados-foruns> (gerado por scripts/enunciados_foruns.py; não edite à mão)\n", "  // </enunciados-foruns>\n"


def limpo(s):
    return re.sub(r"[ \t ]+", " ", re.sub(r"\s*\n\s*", "\n", html.unescape(s or ""))).strip()


# ----------------------------------------------------------------------------- FONAJE
FONAJE = [
    ("fonaje_civel", "FONAJE — Enunciados Cíveis (Juizados Especiais)", "https://fonaje.amb.com.br/enunciados/"),
    ("fonaje_criminal", "FONAJE — Enunciados Criminais (Juizados Especiais)", "https://fonaje.amb.com.br/enunciados-criminais/"),
    ("fonaje_fazenda", "FONAJE — Enunciados da Fazenda Pública (Juizados Especiais)", "https://fonaje.amb.com.br/enunciados-da-fazenda-publica/"),
]


def texto_da_pagina(h):
    """Corpo da página do FONAJE em texto, com um enunciado por linha."""
    m = re.search(r'(?s)<div class="entry-content[^"]*">(.*?)<footer|<article[^>]*>(.*?)</article>', h)
    corpo = (m.group(1) or m.group(2)) if m else h
    corpo = re.sub(r"(?s)<(script|style)[^>]*>.*?</\1>", "", corpo)
    corpo = re.sub(r"(?i)<br\s*/?>|</p>|</li>|</div>|</h\d>", "\n", corpo)
    return limpo(re.sub(r"<[^>]+>", " ", corpo))


def ler_fonaje(txt):
    """[(numero, texto, nota, situacao)] — situacao: 'vigente', 'cancelado', 'substituído', 'revogado'."""
    itens = []
    partes = re.split(r"ENUNCIADO\s+0*(\d+)\s*(?:\([^)]*\))?\s*[–\-]\s*", txt, flags=re.I)
    for k in range(1, len(partes) - 1, 2):
        num, corpo = int(partes[k]), re.sub(r"\s+", " ", partes[k + 1]).strip()
        if not corpo:
            continue
        situacao = "vigente"
        if re.match(r"(?i)(cancelad[oa]|substitu[ií]d[oa]|revogad[oa]|suprimid[oa]|sem efeito|enunciado renumerado)", corpo):
            sit = re.match(r"(?i)(cancelad|substitu|revogad|suprimid|sem efeito|enunciado renumerado)", corpo)[1].lower()
            situacao = {"cancelad": "cancelado", "substitu": "substituído", "revogad": "revogado"}.get(sit, "cancelado")
            itens.append((num, "", corpo, situacao))      # sem texto próprio: não entra, só registra
            continue
        nota = ""
        # "Revogado (57º Encontro …)" / "Cancelado (…)" colado depois do texto (vem antes da nota de aprovação)
        m = re.search(r"\s+(Revogado|Cancelado|Substitu[ií]do)(?:\s+pelo Enunciado\s+\d+)?\s*(?:\(([^)]*)\))?\s*\.?\s*$", corpo)
        if m and len(corpo[:m.start()]) > 20:
            situacao = {"revogado": "revogado", "cancelado": "cancelado"}.get(m.group(1).lower(), "substituído")
            nota = m.group(1) + (" (" + m.group(2) + ")" if m.group(2) else "")
            corpo = corpo[:m.start()].strip()
        # nota de aprovação entre parênteses no fim: (nova redação – XXXVII – Florianópolis/SC) / (XXIX Encontro – Bonito/MS)
        m = re.search(r"\(([^()]*(?:Encontro|Florian|redação|aprovado|[A-Z]{2,}/[A-Z]{2})[^()]*)\)\s*\.?\s*$", corpo)
        if m:
            nota = (m.group(1).strip() + ("; " + nota if nota else ""))
            corpo = corpo[:m.start()].strip()
        itens.append((num, corpo, nota, situacao))
    return itens


# ----------------------------------------------------------------------------- ENFAM
# 62 enunciados do Seminário "O Poder Judiciário e o Novo Código de Processo Civil" (ENFAM, ago/2015). O PDF oficial é
# https://www.enfam.jus.br/wp-content/uploads/2015/09/ENUNCIADOS-VERSÃO-DEFINITIVA-.pdf; o texto vem da cartilha do TJMG
# (Enunciados sobre o CPC/2015, 2016), que o reproduz.
ENFAM_LINK = "https://www.enfam.jus.br/wp-content/uploads/2015/09/ENUNCIADOS-VERS%C3%83O-DEFINITIVA-.pdf"
CARTILHA_URL = "https://bd-login.tjmg.jus.br/jspui/bitstream/tjmg/7820/1/Cartilha%20-%20sa%c3%adda.pdf"


def ler_enfam(txt):
    """[(numero, texto, nota, situacao)] da seção ENFAM da cartilha do TJMG."""
    i = txt.find("ENUNCIADOS-VERS")                       # linha "Fonte: …/ENUNCIADOS-VERSÃO-DEFINITIVA-.pdf" (corpo, não o sumário)
    f = txt.find("Enunciados do Fórum Permanente", i)
    sec = txt[i:f] if i >= 0 and f > i else ""
    sec = re.sub(r"^[^\n]*\n", "", sec)
    sec = re.sub("\u00ad\\s*", "", sec)                       # hífen suave de fim de linha (junta a palavra partida)
    sec = re.sub(r"-\s*\n", "", sec)                       # hifenização de fim de linha
    sec = re.sub(r"\n\s*\d{1,2}\s*\n", "\n", sec)           # número de página sozinho na linha
    sec = re.sub(r"\s+", " ", sec)
    itens, ult = [], 0
    for m in re.finditer(r"(?:(?<=\s)|^)(\d{1,2})\)\s+", sec):
        pass
    partes = re.split(r"(?:(?<=\s)|^)(\d{1,2})\)\s+", sec)
    for k in range(1, len(partes) - 1, 2):
        n = int(partes[k])
        if n == ult + 1:
            itens.append([n, partes[k + 1].strip()])
            ult = n
        elif itens:
            itens[-1][1] += " " + partes[k] + ") " + partes[k + 1].strip()
    return [(n, t.strip(), "", "vigente") for n, t in itens if t.strip()]


# ------------------------------------------------------------------------------ FPPC
# O rol de enunciados do FPPC (787 em 2026) só está publicado em PDF/Academia.edu, que não se deixa raspar por robô
# (o navegador do app lê). Entram só os que já caíram em prova; para somar outro, acrescente aqui.
# Fonte: "Rol de enunciados e repertório de boas práticas do FPPC" (2026) — https://www.fppc.com.br/
FPPC_LINK = "https://www.fppc.com.br/"
FPPC = [
    (10, "Em caso de desmembramento do litisconsórcio multitudinário, a interrupção da prescrição retroagirá à data de propositura da demanda original.",
     "arts. 113, §§ 1º e 2º, e 240, § 1º — Litisconsórcio, Intervenção de Terceiros e Resposta do Réu; redação revista no III FPPC-Rio", "vigente"),
    (117, "Em caso de desmembramento do litisconsórcio multitudinário ativo, os efeitos mencionados no art. 240 são considerados produzidos desde o protocolo originário da petição inicial.",
     "arts. 113 e 312 — Litisconsórcio e Intervenção de Terceiros", "vigente"),
    (135, "A indisponibilidade do direito material não impede, por si só, a celebração de negócio jurídico processual.",
     "art. 190 — Negócios Processuais", "vigente"),
    (446, "Cabe ação monitória mesmo quando o autor for portador de título executivo extrajudicial.",
     "arts. 785 e 700 — Execução", "vigente"),
]


def ler_fppc(txt):
    """Rol do FPPC (PDF oficial): '[(numero, texto, nota, situação)]'. Cancelados saem; a nota é 'arts. … — Grupo; redação…'."""
    i = txt.find("Enunciados aprovados em Salvador")
    b = txt[i:]
    marcas, esp = [], 1
    for m in re.finditer(r"(?m)^\s*(\d{1,3})\.\s*$", b):
        if int(m.group(1)) == esp:
            marcas.append(m)
            esp += 1
    out = []
    for k, m in enumerate(marcas):
        fim = marcas[k + 1].start() if k + 1 < len(marcas) else len(b)
        s = re.sub(r"\s+", " ", b[m.end():fim]).strip()
        g = re.search(r"\(Grupo:([^)]*)\)", s)
        if not g or s.startswith("Cancelado"):
            continue
        corpo = s[:g.start()].strip()
        corpo = re.sub(r"(?<=[A-Za-zÀ-ú])\d{1,3}(?=[.,;:\s)]|$)", "", corpo)   # remove o número de nota de rodapé colado
        a = re.match(r"\(([^)]*(?:\([^)]*\))?[^)]*)\)\.?\s*(.*)$", corpo)
        refs, texto = (a.group(1), a.group(2)) if a else ("", corpo)
        nota = (refs + " — " if refs else "") + g.group(1).strip().rstrip(";")
        out.append((int(m.group(1)), texto.strip(), nota, "vigente"))
    return out


# ------------------------------------------------------------------------- coletar / montar
def pagina(url):
    import atualizar_informativos as robo   # urllib e, se o site recusar (403), Firefox invisível
    return robo.pagina(url, valida=lambda x: "ENUNCIADO" in x.upper())


def baixar_cartilha():
    import subprocess
    pdf = CACHE / "cartilha-tjmg.pdf"
    if not pdf.exists():
        subprocess.run(["curl", "-sS", "-L", "-m", "180", "-A", "Mozilla/5.0", "-o", str(pdf), CARTILHA_URL], check=True)
    import fitz   # PyMuPDF
    txt = "".join(p.get_text() for p in fitz.open(pdf))
    (CACHE / "cartilha-tjmg.txt").write_text(txt, encoding="utf-8")
    return txt


def coletar():
    CACHE.mkdir(parents=True, exist_ok=True)
    print("ENFAM (cartilha do TJMG):", len(ler_enfam(baixar_cartilha())), "enunciados")
    for chave, rotulo, url in FONAJE:
        h = pagina(url)
        (CACHE / f"{chave}.html").write_text(h, encoding="utf-8")
        its = ler_fonaje(texto_da_pagina(h))
        print(f"{rotulo}: {sum(1 for i in its if i[1])} enunciados com texto ({len(its)} no total)")


def js(x):
    return json.dumps(x, ensure_ascii=False)


def bloco(chave, rotulo, link, itens):
    linhas = []
    for num, texto, nota, situacao in sorted(itens, key=lambda i: i[0]):
        if not texto:
            continue
        t = ("[ENUNCIADO " + situacao.upper() + "] " if situacao != "vigente" else "") + texto
        campos = ["numero: %d" % num, "texto: %s" % js(t), "materia: null", "link: %s" % js(link)]
        if nota:
            campos.append("jornada: %s" % js(nota))
        linhas.append("      { " + ", ".join(campos) + " }")
    return "  %s: {\n    label: %s,\n    status: \"disponivel\",\n    sumulas: [\n%s\n    ]\n  },\n" % (chave, js(rotulo), ",\n".join(linhas)), len(linhas)


def blocos_todos():
    """[(chave, rotulo, link, [(num, texto, nota, situacao)])] de tudo o que está no cache."""
    out = []
    for chave, rotulo, url in FONAJE:
        arq = CACHE / f"{chave}.html"
        if arq.exists():
            out.append((chave, rotulo, url, ler_fonaje(texto_da_pagina(arq.read_text(encoding="utf-8")))))
    cart = CACHE / "cartilha-tjmg.txt"
    if cart.exists():
        out.append(("enfam_cpc", "ENFAM — Enunciados sobre o CPC/2015 (Seminário 2015)", ENFAM_LINK, ler_enfam(cart.read_text(encoding="utf-8"))))
    rol = CACHE / "fppc-rol.pdf"
    fppc = FPPC
    if rol.exists():
        import fitz
        fppc = ler_fppc("\n".join(p.get_text() for p in fitz.open(rol))) or FPPC
    out.append(("fppc", "FPPC — Fórum Permanente de Processualistas Civis (CPC/2015)", FPPC_LINK, fppc))
    return out


def gravar_sumulas(blocos_js, chaves):
    arq = RAIZ / "site" / "sumulas" / "sumulas-data.js"
    t = arq.read_text(encoding="utf-8")
    regiao = INI + blocos_js + FIM
    if INI in t:
        t = re.sub(re.escape(INI) + r"[\s\S]*?" + re.escape(FIM), lambda m: regiao, t)
    else:
        m = re.search(r"\n\};\s*\n\s*var SUMULAS_ORG_ORDER", t)
        if not m:
            sys.exit("não achei o fim de SUMULAS_DATA")
        t = t[:m.start() + 1] + regiao + t[m.start() + 1:]
    t = re.sub(r"\}(\s*\n)(  // <enunciados-foruns> )", r"},\1\2", t)
    oi, of = "  // <enunciados-foruns-ordem>\n", "  // </enunciados-foruns-ordem>\n"
    ordem = oi + "  " + ", ".join(js(c) for c in chaves) + ",\n" + of
    if oi in t:
        t = re.sub(re.escape(oi) + r"[\s\S]*?" + re.escape(of), lambda m: ordem, t)
    else:
        t = t.replace("var SUMULAS_ORG_ORDER = [\n", "var SUMULAS_ORG_ORDER = [\n" + ordem, 1)
    arq.write_text(t, encoding="utf-8")


def montar(so_cobrados=True):
    todos = blocos_todos()
    if not todos:
        sys.exit("Sem cache: rode antes  python3 scripts/enunciados_foruns.py coletar")
    cobr = set()
    if so_cobrados:   # provas/enunciados-cobrados.json (scripts/cobrancas_foruns.py): {bloco: {número: [provas]}}
        c = json.loads((RAIZ / "provas" / "enunciados-cobrados.json").read_text(encoding="utf-8"))
        cobr = {(k, n) for k, d in c.items() for n in d}
    texto, chaves, res = "", [], {}
    for chave, rotulo, link, itens in todos:
        if so_cobrados:
            itens = [i for i in itens if (chave, str(i[0])) in cobr]
        b, n = bloco(chave, rotulo, link, itens)
        if n:
            texto += b
            chaves.append(chave)
            res[chave] = n
    gravar_sumulas(texto, chaves)
    print("blocos:", res, "(só os já cobrados em prova)" if so_cobrados else "(todos)")


def main():
    p = argparse.ArgumentParser()
    p.add_argument("passo", choices=["coletar", "montar", "podar"])
    p.add_argument("--todos", action="store_true", help="(montar) todos os enunciados, sem o filtro de prova")
    a = p.parse_args()
    if a.passo == "coletar":
        coletar()
    elif a.passo == "montar":
        montar(so_cobrados=not a.todos)
    else:
        montar(so_cobrados=True)


if __name__ == "__main__":
    main()
