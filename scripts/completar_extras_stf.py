#!/usr/bin/env python3
"""
completar_extras_stf.py — busca no portal do STF o inteiro teor das "decisões de
referência (extras)" (leve/decisoes.json, fonte "extras"), que só têm um resumo de
notícia. Serve para a curadoria: sem o teor, o classificador confunde texto curto
com "sem conteúdo".

Não altera o site: grava curadoria/extras-textos.json  {processo: {"data", "texto"}}.
Roda no Mac (o portal bloqueia os servidores do GitHub):

    python3 scripts/completar_extras_stf.py --teste "ADI 1625"
    python3 scripts/completar_extras_stf.py --max 100
"""
import argparse, html, json, re, signal, sys, time, urllib.parse
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(RAIZ / "scripts"))
import completar_textos_stf as c  # noqa: E402
robo = c.robo
SAIDA = RAIZ / "curadoria" / "extras-textos.json"
FALHAS = RAIZ / "curadoria" / "extras-textos-falhas.json"


def extras():
    d = json.loads((RAIZ / "leve" / "decisoes.json").read_text(encoding="utf-8"))
    ci = {k: i for i, k in enumerate(d["campos"])}
    out = []
    for r in d["linhas"]:
        if str(r[ci["_f"]]) != "3":
            continue
        out.append({"processo": r[ci["processo"]] or "", "data": r[ci["data"]] or "", "titulo": r[ci["titulo"]] or ""})
    return out


def melhor_decisao(pg, data):
    """Entre os andamentos da aba Decisões, pega o arquivo "Decisão de Julgamento" (RTF):
    o do andamento com a mesma data; se não houver, o maior deles."""
    cands = []
    for item in re.split(r'(?=<div class="andamento-item")', pg):
        m = re.search(r'downloadTexto\.asp\?id=(\d+)(?:&amp;|&)ext=RTF', item)
        if not m:
            continue
        txt = html.unescape(re.sub(r"<[^>]+>", " ", item))
        cands.append((data and data in txt, m[1]))
    if not cands:
        raise robo.Falha("a aba Decisões não tem arquivo de decisão (RTF)")
    mesmos = [x for x in cands if x[0]]
    return (mesmos or cands)[:3]


def buscar(classe, num, inc, data):
    pg = robo.pagina(c.ABA.format(inc=inc, num=num, cls=classe))
    melhor = None
    for _, id_ in melhor_decisao(pg, data):
        status, _, corpo = robo.buscar(f"https://portal.stf.jus.br/processos/downloadTexto.asp?id={id_}&ext=RTF")
        if status != 200 or b"{\\rtf" not in corpo[:50]:
            continue
        t = c.rtf_para_texto(corpo)
        mj = re.search(r"Decis[ãa]o\s*:|EMENTA|Ementa", t)
        if mj and c.JUNK.search(t[:400]):
            t = t[mj.start():]
        if not melhor or len(t) > len(melhor):
            melhor = t
    if not melhor:
        raise robo.Falha("nenhum arquivo de decisão abriu")
    return melhor


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--teste")
    ap.add_argument("--max", type=int, default=100)
    ap.add_argument("--espera", type=float, default=1.5)
    a = ap.parse_args()
    feito = json.loads(SAIDA.read_text(encoding="utf-8")) if SAIDA.exists() else {}
    alvos = [x for x in extras() if x["processo"] not in feito]
    if a.teste:
        k = c.processo_principal(a.teste)
        alvos = [x for x in extras() if c.processo_principal(x["processo"]) == k]
    else:
        alvos = alvos[:a.max]
    print(f"{len(alvos)} extra(s) para buscar; {len(feito)} já feitas.")
    falhas, inc, ok = {}, {}, 0
    for x in alvos:
        classe, num = c.processo_principal(x["processo"])
        if not classe:
            continue
        print(f"  … {x['processo']} ({x['data']})", flush=True)
        try:
            if hasattr(signal, "SIGALRM"):
                signal.signal(signal.SIGALRM, lambda *_: (_ for _ in ()).throw(robo.Falha("passou de 2 minutos; pulei")))
                signal.alarm(120)
            if (classe, num) not in inc:
                inc[(classe, num)] = c.achar_incidente(classe, num)
                time.sleep(a.espera)
            t = buscar(classe, num, inc[(classe, num)], x["data"])
            time.sleep(a.espera)
            if hasattr(signal, "SIGALRM"): signal.alarm(0)
        except robo.Falha as e:
            if hasattr(signal, "SIGALRM"): signal.alarm(0)
            if "passou de" in str(e): robo._firefox_fechar()
            falhas[x["processo"]] = str(e)[:200]
            print(f"    sem sucesso: {e}")
            continue
        except KeyboardInterrupt:
            print("\ninterrompido; o que já foi buscado está guardado.")
            break
        ok += 1
        print(f"    {len(t)} caracteres")
        if a.teste:
            print("-" * 60 + "\n" + t[:3000] + "\n" + "-" * 60)
            continue
        feito[x["processo"]] = {"data": x["data"], "texto": t}
        SAIDA.write_text(json.dumps(feito, ensure_ascii=False, indent=0), encoding="utf-8")
    if not a.teste:
        FALHAS.write_text(json.dumps(falhas, ensure_ascii=False, indent=1), encoding="utf-8")
    print(f"{ok} completada(s), {len(falhas)} sem sucesso. Total gravado: {len(feito)}.")


if __name__ == "__main__":
    main()
