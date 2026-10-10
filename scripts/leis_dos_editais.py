#!/usr/bin/env python3
"""
leis_dos_editais.py — traz para o Diário de Leis as leis, leis complementares, decretos e decretos-leis FEDERAIS que os
editais mapeados citam ("extras" em site/editais/editais-data.js) e que ainda não estão no Diário.

Para cada norma: confere se o número cabe no ano (descarta lei estadual com número grande), busca no Planalto, grava o
texto em leis/texto/ (o "Leia-me") e acrescenta a norma a leis/dos-editais.json, que o Diário de Leis mostra como
"Citadas nos editais". Roda no Mac (o Planalto bloqueia os servidores do GitHub):

    python3 scripts/leis_dos_editais.py --plano        # só lista o que falta
    python3 scripts/leis_dos_editais.py --max 60       # busca até 60 (continua de onde parou)
"""
import argparse, json, re, sys, time
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(RAIZ / "scripts"))
import leis_citadas as lc  # noqa: E402
import leis_sob_pedido as ps  # noqa: E402
robo = lc.robo

SAIDA = RAIZ / "leis" / "dos-editais.json"
RE_NORMA = re.compile(r"(?i)^(Lei Complementar|Lei|Decreto-Lei|Decreto|Emenda Constitucional)\s*(?:Federal\s*)?n[ºo°.]*\s*([\d.]+)\s*/\s*(\d{4})")


def citadas():
    ed = (RAIZ / "site" / "editais" / "editais-data.js").read_text(encoding="utf-8")
    out = {}
    for bloco in re.findall(r'"extras":\s*\[(.*?)\]\s*[,}\n]', ed, flags=re.S):
        for x in re.findall(r'"((?:[^"\\]|\\.)*)"', bloco):
            if re.search(r"Estadual|Distrital|Municipal|Org[âa]nica", x):
                continue
            m = RE_NORMA.match(x.strip())
            if not m or m.group(1).lower().startswith("emenda"):
                continue
            tipo = lc.tipo_de(m.group(1))
            n, ano = m.group(2).replace(".", ""), m.group(3)
            if lc.plausivel(tipo, n, ano):
                out[lc.chave(tipo, n, ano)] = (tipo, n, ano)
    return out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--plano", action="store_true")
    ap.add_argument("--max", type=int, default=60)
    a = ap.parse_args()
    dados = json.loads(SAIDA.read_text(encoding="utf-8")) if SAIDA.exists() else {"leis": [], "tentadas": {}}
    tent = dados.setdefault("tentadas", {})
    ja = lc.ja_no_diario()
    pend = [(k, v) for k, v in sorted(citadas().items()) if k not in ja and tent.get(k) not in ("ok", "nao-achei")]
    print(f"{len(pend)} norma(s) federal(is) citada(s) em edital e fora do Diário.")
    if a.plano:
        for k, _ in pend:
            print("  ", k)
        return
    hoje, ok = robo.hoje(), 0
    for k, (tipo, n, ano) in pend[:a.max]:
        print(f"  … {lc.NOMES[tipo]} nº {lc.com_ponto(n)}/{ano}", flush=True)
        try:
            url, _ = lc.buscar_lei(tipo, n, ano, hoje)
        except Exception as ex:   # noqa: BLE001 — conexão derrubada: tenta na próxima rodada
            print(f"    erro de conexão ({type(ex).__name__}); fica para a próxima rodada")
            time.sleep(5)
            continue
        if not url:
            tent[k] = "nao-achei"
            print("    não achei no Planalto")
            continue
        numero = f"{lc.NOMES[tipo]} nº {lc.com_ponto(n)}/{ano}"
        dados["leis"] = [x for x in dados["leis"] if x["link"] != url] + [{"nome": ps.nome_da_lei(url, numero), "numero": numero, "link": url}]
        tent[k] = "ok"
        ok += 1
        print(f"    adicionada: {numero}")
        SAIDA.write_text(json.dumps(dados, ensure_ascii=False, indent=1), encoding="utf-8")
    dados["leis"].sort(key=lambda x: x["numero"])
    SAIDA.write_text(json.dumps(dados, ensure_ascii=False, indent=1), encoding="utf-8")
    robo.indice_dos_textos()
    print(f"{ok} adicionada(s); sem sucesso até agora: {sum(1 for v in tent.values() if v == 'nao-achei')}.")


if __name__ == "__main__":
    main()
