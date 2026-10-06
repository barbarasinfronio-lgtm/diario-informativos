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
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(RAIZ / "scripts"))
import completar_textos_stf as c   # noqa: E402
import completar_extras_stf as ex  # noqa: E402
robo = c.robo
PASTA = RAIZ / "stf" / "rg"
FALHAS = RAIZ / "curadoria" / "rg-textos-falhas.json"
LIMITE = 400000


def temas():
    s = (RAIZ / "rg-repetitivos-data.js").read_text(encoding="utf-8")
    L = json.loads(s[s.index("["):s.rindex("]") + 1])
    out = []
    for d in L:
        if d.get("orgao") == "STF" and d.get("tipo") == "rg" and d.get("tema") and d.get("processo"):
            out.append({"tema": str(d["tema"]), "processo": d["processo"], "data": d.get("data") or ""})
    return out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--tema")
    ap.add_argument("--max", type=int, default=100)
    ap.add_argument("--espera", type=float, default=1.5)
    a = ap.parse_args()
    PASTA.mkdir(parents=True, exist_ok=True)
    todos = temas()
    if a.tema:
        alvos = [t for t in todos if t["tema"] == a.tema.replace(".", "")]
    else:
        feitos = {p.stem for p in PASTA.glob("*.json")}
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
            {"processo": t["processo"], "data": t["data"], "texto": texto[:LIMITE]}, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
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
