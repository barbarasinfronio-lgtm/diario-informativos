#!/usr/bin/env python3
"""
informativos_refazer.py — refaz edições do Informativo do STJ que saíram com julgados colados
(tema, tese e inteiro teor de dois ou três julgados num card só).

Roda no Mac (o STJ barra o GitHub), pelo "Refazer Informativos STJ.command". Para cada edição:
  1) pega o PDF (informativos/pdf/GetPDFINFJ0905.pdf, se você o colocou lá; senão baixa) ou, se o PDF não
     abrir, a página da edição;
  2) separa os julgados com o leitor corrigido (scripts/informativos_extrair.py, que agora abre um julgado novo
     a cada PROCESSO, mesmo quando o anterior não tem "INFORMAÇÕES ADICIONAIS");
  3) apaga os julgados antigos da edição e grava os novos (--substituir): o que não mudou mantém o mesmo id,
     e com ele as marcações de lido; os cards que estavam colados são trocados pelos separados.

Uso:  python3 scripts/informativos_refazer.py             # as edições que parecem coladas (tese com mais de 900 caracteres)
      python3 scripts/informativos_refazer.py 905 901     # só estas
      python3 scripts/informativos_refazer.py --listar    # só mostra quais seriam
"""
import json
import sys
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(RAIZ / "scripts"))
import informativos_extrair as ie  # noqa: E402


def edicoes_suspeitas():
    d = json.loads((RAIZ / "informativos" / "indice.json").read_text(encoding="utf-8"))
    return sorted({int(x[2]) for x in d["itens"] if x[1] == "STJ" and str(x[2]).isdigit() and len(x[5]) > 900}, reverse=True)


def main():
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    edicoes = [int(a) for a in args if a.isdigit()] or edicoes_suspeitas()
    print(f"Edições do STJ a refazer ({len(edicoes)}): {', '.join(map(str, edicoes)) or 'nenhuma'}")
    if "--listar" in sys.argv or not edicoes:
        return 0
    import atualizar_informativos as ai
    feitas, falhas = 0, []
    for n in edicoes:
        try:
            corpo = ai._pdf_do_informativo("STJ", n, None)
            if corpo:
                blocos = ie.blocos_de_pdf(corpo, ai.texto_de_pdf)
            else:
                t = ai.pagina("https://processo.stj.jus.br/jurisprudencia/externo/informativo/"
                              f"?acao=pesquisarumaedicao&livre={n:04d}.cod.")
                blocos = ie.blocos_de_html(t)
            itens = ie.extrair("STJ", n, blocos)
            if not itens:
                print(f"  STJ nº {n}: nenhum julgado reconhecido; a edição antiga foi mantida")
                falhas.append(n)
                continue
            ie.acrescentar(itens, substituir=True)
            print(f"  STJ nº {n}: {len(itens)} julgado(s) gravado(s)")
            feitas += 1
        except Exception as e:  # noqa: BLE001 — uma edição ruim não derruba as outras
            print(f"  STJ nº {n}: não consegui ({e})")
            falhas.append(n)
    print(f"\n{feitas} edição(ões) refeita(s)." + (f" Falharam: {', '.join(map(str, falhas))}." if falhas else ""))
    return 1 if falhas and not feitas else 0


if __name__ == "__main__":
    sys.exit(main())
