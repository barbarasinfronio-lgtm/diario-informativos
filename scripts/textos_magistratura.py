#!/usr/bin/env python3
"""
textos_magistratura.py — grava o texto (Leia-me) de normas da magistratura que não estão no Planalto:
Código de Ética da Magistratura Nacional (Res. CNJ 60/2008), Regimento Interno do STF e do STJ.

Cada norma vira um texto em leis/texto/<id>.json (mesmo molde dos textos das leis) e uma linha no Diário de
Leis (site/leis/leis-data.js, logo depois da LOMAN). Roda no Mac, que sabe passar pelos sites que barram
programas (STF e STJ respondem 403 a quem não é navegador): o resto do trabalho é o de sempre do
atualizar_informativos.py (Firefox invisível, Chrome, PDFs pelo PDFKit).

Uso:  python3 scripts/textos_magistratura.py            # todas
      python3 scripts/textos_magistratura.py etica      # só uma (etica | ristf | ristj)
"""
import datetime
import html
import re
import sys
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(RAIZ / "scripts"))
import atualizar_informativos as robo  # noqa: E402

LEIS_DATA = RAIZ / "site" / "leis" / "leis-data.js"
ANCORA = 'numero: "Lei Complementar nº 35/1979", link: "https://www.planalto.gov.br/ccivil_03/leis/lcp/lcp35.htm" },\n'


def extrator_etica(pg):
    """Corpo do Código de Ética no portal do CNJ: do título até a data final."""
    t = re.sub(r"(?is)<(script|style|head|nav|footer)\b.*?</\1>|<!--.*?-->", " ", pg)
    t = re.sub(r"(?i)<br\s*/?>|</(p|div|li|h[1-6]|tr)>", "\n", t)
    t = html.unescape(re.sub(r"<[^>]+>", "", t)).replace("\xa0", " ")
    linhas = [re.sub(r"\s+", " ", x).strip() for x in t.split("\n")]
    linhas = [x for x in linhas if x]
    ini = next((i for i, x in enumerate(linhas) if x.upper().startswith("CÓDIGO DE ÉTICA DA MAGISTRATURA NACIONAL")), None)
    fim = next((i for i, x in enumerate(linhas) if re.match(r"^Brasília, \d", x)), None)
    if ini is None or fim is None:
        return []
    return linhas[ini:fim + 1]


def extrator_regimento(pg):
    """Regimento em HTML ou PDF já convertido em texto: junta as linhas quebradas em parágrafos."""
    t = pg if not re.search(r"(?i)<(p|div|br)\b", pg) else robo.paragrafos_da_lei(pg)
    if isinstance(t, list):
        return t
    linhas = [re.sub(r"\s+", " ", x).strip() for x in t.split("\n")]
    # começa no 1º artigo (o miolo do livro: capa, créditos e sumário ficam de fora)
    ini = next((i for i, x in enumerate(linhas) if re.match(r"^Art\.? ?1[º°o]\s+[A-ZÀ-Ú]", x)), None)
    if ini is not None:
        while ini > 0 and linhas[ini - 1] and not re.match(r"^Art", linhas[ini - 1]) and ini > 0 and \
                re.match(r"(?i)^(t[íi]tulo|cap[íi]tulo|livro|parte|regimento|se[çc][ãa]o|[A-ZÇÃÕÉÍ ]{4,})", linhas[ini - 1]):
            ini -= 1
        linhas = linhas[ini:]
    # números de página soltos
    linhas = [x for x in linhas if not re.fullmatch(r"\d{1,4}", x)]
    paras, atual = [], ""
    for x in linhas:
        if not x:
            continue
        novo = re.match(r"(?i)^(art\.?\s*\d|§|parágrafo único|[IVXL]+\s*[-–]|[a-z]\)|livro|título|capítulo|seção|subseção)", x)
        if novo and atual:
            paras.append(atual)
            atual = x
        else:
            atual = (atual + " " + x).strip() if atual else x
    if atual:
        paras.append(atual)
    return paras


def ate(extrator, rx):
    """Corta o texto no parágrafo que casa com rx (o fim do regimento; depois vêm anexos e índice remissivo)."""
    def f(pg):
        paras = extrator(pg)
        fim = next((i for i, x in enumerate(paras) if re.match(rx, x)), None)
        if fim is None:
            return paras
        paras = paras[:fim + 1]
        paras[-1] = re.split(r" EMENDAS? REGIMENTAIS?\b", paras[-1])[0]
        return paras
    return f


ALVOS = {
    "etica": dict(
        nome="Código de Ética da Magistratura Nacional", numero="Resolução CNJ nº 60/2008",
        url="https://www.cnj.jus.br/codigo-de-etica-da-magistratura/", extrator=extrator_etica, pdf=False),
    "ristf": dict(
        nome="Regimento Interno do Supremo Tribunal Federal (RISTF) — edição até a Emenda Regimental nº 58/2022", numero="Regimento Interno do STF",
        url="https://www.stf.jus.br/arquivo/cms/legislacaoRegimentoInterno/anexo/RISTF.pdf",
        extrator=ate(extrator_regimento, r"^Art\. 368\."), pdf=True,
        origem="https://www.stf.jus.br/"),
    "ristj": dict(
        nome="Regimento Interno do Superior Tribunal de Justiça (RISTJ) — edição até a Emenda Regimental nº 40/2021",
        numero="Regimento Interno do STJ",
        url="https://bdjur.stj.jus.br/handle/2011/3189", extrator=ate(extrator_regimento, r"^Art\. 344\."), pdf=False,
        # texto da edição mais nova que a Biblioteca Digital do STJ (DSpace) tem; o portal do STJ barra programas
        txt="https://bdjur.stj.jus.br/server/api/core/bitstreams/f013c6f5-a9ef-4552-b735-b85fec4f159b/content"),
}


def obter(alvo):
    if alvo.get("txt"):
        status, tipo, corpo = robo.buscar(alvo["txt"])
        print(f"  {alvo['txt']} → HTTP {status}")
        if status != 200:
            raise robo.Falha(f"{alvo['txt']} → HTTP {status}")
        return robo.texto_de(corpo, tipo)
    if not alvo["pdf"]:
        return robo.pagina(alvo["url"], valida=lambda x: len(x) > 800)
    status, tipo, corpo = robo.buscar(alvo["url"])
    print(f"  {alvo['url']} → HTTP {status}")
    if status == 403:   # o site só entrega a um navegador de verdade: baixa de dentro de uma página dele
        corpo = robo.baixar_via_firefox(alvo["url"], alvo["origem"], valida=lambda x: len(x) > 800)
        print(f"  pelo Firefox: {len(corpo or b'')} bytes")
        status, tipo = (200, "application/pdf") if corpo else (403, "")
    if status != 200 or not robo.eh_pdf(tipo, corpo):
        raise robo.Falha(f"{alvo['url']} → HTTP {status}, não veio um PDF (o site barra programas; "
                         "abra a página no navegador, ache o PDF do regimento e me passe o endereço)")
    return robo.texto_de_pdf(corpo)


def acrescentar_ao_diario(alvo):
    linha = '    { nome: %s, numero: %s, link: %s },\n' % tuple(
        __import__("json").dumps(alvo[k], ensure_ascii=False) for k in ("nome", "numero", "url"))
    texto = LEIS_DATA.read_text(encoding="utf-8")
    if alvo["url"] in texto:
        return False
    if ANCORA not in texto:
        print("  (não achei a LOMAN em leis-data.js; não acrescentei a linha)")
        return False
    LEIS_DATA.write_text(texto.replace(ANCORA, ANCORA + linha, 1), encoding="utf-8")
    return True


def main():
    quais = sys.argv[1:] or list(ALVOS)
    hoje = datetime.date.today().isoformat()
    gravou = False
    for k in quais:
        alvo = ALVOS[k]
        print(f"{alvo['nome']}")
        try:
            pg = obter(alvo)
        except robo.Falha as e:
            print(f"  FALHOU: {e}")
            continue
        if robo.salvar_texto(alvo["url"], pg, alvo["nome"], hoje, extrator=alvo["extrator"]):
            print("  texto gravado")
            gravou = True
        if acrescentar_ao_diario(alvo):
            print("  linha acrescentada ao Diário de Leis")
            gravou = True
    if gravou:
        print(f"{robo.indice_dos_textos()} textos no índice")


if __name__ == "__main__":
    main()
