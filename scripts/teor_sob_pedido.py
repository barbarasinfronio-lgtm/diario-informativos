#!/usr/bin/env python3
"""
teor_sob_pedido.py — atende os pedidos de "Buscar inteiro teor" feitos no site (Diário das Decisões).

Quem está lendo um julgado do STF sem o inteiro teor clica em "Buscar inteiro teor"; o site grava o pedido
no Firestore (coleção pedidos-teor, um documento por card). Este robô lê os pedidos, busca o acórdão no
portal do STF e grava teor/<classe>-<número>.json {"processo","data","texto","completo","em"}. O teor é do
PROCESSO, não do card: se a mesma decisão aparece em dois cards (ex.: RE 1037396 como Tema e como julgado
de informativo), o texto aparece nos dois. teor/indice.json {"p": {"RE 1037396": "teor/re-1037396.json"}}
liga cada processo ao arquivo (inclui os acórdãos de stf/rg/); o site abre o card e mostra o texto. Roda no Mac (o portal do STF
bloqueia os servidores do GitHub), pelo "Atender Pedidos de Inteiro Teor.command":

    python3 scripts/teor_sob_pedido.py --plano                       # só mostra os pedidos pendentes
    python3 scripts/teor_sob_pedido.py --max 30                      # atende até 30 pedidos
    python3 scripts/teor_sob_pedido.py --teste "Rcl 38782" --data 03/11/2020   # busca e mostra, não grava

Pedidos que falharam ficam em curadoria/teor-pedidos-falhas.json e são tentados de novo na próxima rodada.
"""
import argparse, json, re, signal, sys, time, urllib.parse
from datetime import datetime, timezone
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(RAIZ / "scripts"))
import completar_textos_stf as c        # noqa: E402
import completar_extras_stf as ex       # noqa: E402
import completar_rg_stf as rg           # noqa: E402
import decisoes_dos_informativos as di  # noqa: E402  (principal(): classe e número de um card de informativo)
robo = c.robo

PASTA = RAIZ / "teor"
INDICE = PASTA / "indice.json"
FALHAS = RAIZ / "curadoria" / "teor-pedidos-falhas.json"
FIRESTORE = "https://firestore.googleapis.com/v1/projects/diariodeinformativos/databases/(default)/documents/pedidos-teor"
API_KEY = "AIzaSyAe0g7Ps4d_uXvh1IiFTtDICwZ91YOUto0"      # a mesma chave pública que o site usa (site/conta/nuvem-shared.js)


def pedidos():
    """Pedidos gravados no Firestore: [{"id","processo","data","titulo","em"}]."""
    out, token = [], ""
    while True:
        url = f"{FIRESTORE}?pageSize=300&key={API_KEY}" + (f"&pageToken={urllib.parse.quote(token)}" if token else "")
        status, _, corpo = robo.buscar(url)
        if status != 200:
            raise robo.Falha(f"não consegui ler os pedidos (HTTP {status}); as regras do Firestore já foram publicadas? (firestore.rules)")
        j = json.loads(corpo.decode("utf-8"))
        for d in j.get("documents", []):
            f = {k: (v.get("stringValue") or v.get("timestampValue") or "") for k, v in d.get("fields", {}).items()}
            f["id"] = f.get("id") or d["name"].rsplit("/", 1)[-1]
            out.append(f)
        token = j.get("nextPageToken", "")
        if not token:
            return out


def chave_de(processo):
    """"RE 1037396" — o mesmo texto vale para todos os cards do mesmo processo."""
    cl, num = di.principal(processo or "")
    return f"{cl.upper()} {num}" if cl else ""


def arquivo_de(chave):
    return "teor/" + re.sub(r"[^a-z0-9]+", "-", chave.lower()).strip("-") + ".json"


def reconstruir_indice():
    """teor/indice.json = processo → arquivo, juntando os pedidos atendidos (teor/) e os acórdãos dos
    Temas de repercussão geral (stf/rg/). Se o processo está nos dois, vale o de teor/ (acórdão inteiro)."""
    mapa = {}
    for pasta, prefixo in ((RAIZ / "stf" / "rg", "stf/rg/"), (PASTA, "teor/")):
        for f in sorted(pasta.glob("*.json")):
            if f.name == "indice.json":
                continue
            try:
                j = json.loads(f.read_text(encoding="utf-8"))
            except ValueError:
                continue
            k = chave_de(j.get("processo", ""))
            if k and j.get("texto"):
                mapa[k] = prefixo + f.name
    PASTA.mkdir(exist_ok=True)
    INDICE.write_text(json.dumps({"p": mapa}, ensure_ascii=False, separators=(",", ":"), sort_keys=True), encoding="utf-8")
    return mapa


def ler_indice():
    return json.loads(INDICE.read_text(encoding="utf-8")) if INDICE.exists() else {"p": {}}


def gravar(chave, data, texto, completo):
    PASTA.mkdir(exist_ok=True)
    (RAIZ / arquivo_de(chave)).write_text(json.dumps(
        {"processo": chave, "data": data, "texto": texto, "completo": completo,
         "em": datetime.now(timezone.utc).strftime("%Y-%m-%d")}, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")


def buscar_teor(classe, num, inc, data):
    """(texto, completo): o acórdão inteiro, se achar; senão a decisão de julgamento (ata)."""
    ata = ""
    try:
        ata = ex.buscar(classe, num, inc, data)
    except robo.Falha as e:
        print(f"    (decisão de julgamento: {str(e)[:90]})")
    inteiro = ""
    try:
        inteiro = rg.acordao_inteiro_teor(classe, num, inc, "", primeiro=False, data_tema=data)
    except robo.Falha as e:
        print(f"    (acórdão: {str(e)[:90]})")
    if len(inteiro) > max(len(ata), 400):
        return inteiro[:rg.LIMITE], True
    if ata:
        return ata, False
    raise robo.Falha("não achei nem o acórdão nem a decisão de julgamento no portal")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--plano", action="store_true")
    ap.add_argument("--so-indice", action="store_true", help="só refaz teor/indice.json (sem internet)")
    ap.add_argument("--teste")
    ap.add_argument("--data", default="")
    ap.add_argument("--max", type=int, default=30)
    ap.add_argument("--espera", type=float, default=1.5)
    a = ap.parse_args()
    if a.teste:
        classe, num = c.processo_principal(a.teste)
        inc = c.achar_incidente(classe, num)
        texto, completo = buscar_teor(classe, num, inc, a.data)
        print(f"{len(texto)} caracteres; {'acórdão inteiro' if completo else 'só a decisão de julgamento'}\n" + "-" * 60 + "\n" + texto[:3000])
        return
    if a.so_indice:
        print(f"índice refeito: {len(reconstruir_indice())} processo(s) com inteiro teor.")
        return
    feitos = set(reconstruir_indice())
    todos = pedidos()
    pend, vistos = [], set()
    for p in todos:          # um processo pedido por vários cards (ou já com teor) conta uma vez só
        k = chave_de(p.get("processo", ""))
        if k in feitos or (k and k in vistos):
            continue
        vistos.add(k)
        pend.append(p)
    print(f"{len(todos)} pedido(s) no site; {len(pend)} processo(s) pendente(s).")
    if a.plano:
        for p in pend:
            print(f"  {chave_de(p.get('processo', '')) or '?'}  ({p.get('data', '')})  {p.get('titulo', '')[:60]}")
        return
    falhas = json.loads(FALHAS.read_text(encoding="utf-8")) if FALHAS.exists() else {}
    incid, ok = {}, 0
    for p in pend[:a.max]:
        cl, num = di.principal(p.get("processo", ""))
        if not cl:
            falhas[p["id"]] = {"processo": p.get("processo", "")[:100], "motivo": "não entendi o número do processo"}
            print(f"  ? {p['id']}: não entendi o processo {p.get('processo', '')[:60]!r}")
            continue
        cl = cl.upper()
        print(f"  … {cl} {num} ({p.get('data', '')})", flush=True)
        try:
            if hasattr(signal, "SIGALRM"):
                signal.signal(signal.SIGALRM, lambda *_: (_ for _ in ()).throw(robo.Falha("passou de 3 minutos; pulei")))
                signal.alarm(180)
            if (cl, num) not in incid:
                incid[(cl, num)] = c.achar_incidente(cl, num)
                time.sleep(a.espera)
            texto, completo = buscar_teor(cl, num, incid[(cl, num)], p.get("data", ""))
            time.sleep(a.espera)
            if hasattr(signal, "SIGALRM"): signal.alarm(0)
        except robo.Falha as e:
            if hasattr(signal, "SIGALRM"): signal.alarm(0)
            if "passou de" in str(e): robo._firefox_fechar()
            falhas[p["id"]] = {"processo": f"{cl} {num}", "motivo": str(e)[:200]}
            print(f"    sem sucesso: {e}")
            continue
        except KeyboardInterrupt:
            print("\ninterrompido; o que já foi buscado está guardado.")
            break
        gravar(f"{cl} {num}", p.get("data", ""), texto, completo)
        falhas.pop(p["id"], None)
        ok += 1
        print(f"    {len(texto)} caracteres ({'acórdão inteiro' if completo else 'só a decisão de julgamento'})")
    FALHAS.write_text(json.dumps(falhas, ensure_ascii=False, indent=1), encoding="utf-8")
    reconstruir_indice()
    print(f"{ok} pedido(s) atendido(s); {len(falhas)} sem sucesso no total.")


if __name__ == "__main__":
    main()
