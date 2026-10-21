#!/usr/bin/env python3
"""
cnj_atos_textos.py — traz para o Diário de Leis o TEXTO INTEIRO dos atos do CNJ (Resoluções, Provimentos, Recomendações,
Enunciados Administrativos, atos conjuntos...), para ler no próprio site, com as remissões cruzadas do vade mecum.

Fonte: buscador oficial https://atos.cnj.jus.br/atos (lista por tipo) e a página de cada ato (texto compilado).
Grava:
  leis/texto/cnj-<id do ato>.json     {"nome","url","em","p":[parágrafos]}  (+ leis/texto/indice.json)
  leis/cnj-atos.json                  {"leis":[{nome,numero,link,textoId,situacao,data}]}  → matéria "Atos do CNJ" no Diário de Leis

    python3 scripts/cnj_atos_textos.py                       # todos os tipos, só o que falta
    python3 scripts/cnj_atos_textos.py --tipos 7,20          # só Resolução e Provimento
    python3 scripts/cnj_atos_textos.py --refazer             # baixa o texto de novo
"""
import argparse, datetime, html, json, os, re, subprocess, sys, time
from concurrent.futures import ThreadPoolExecutor

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
UA = "Mozilla/5.0 (compatible; EstudaMana/1.0; +https://www.estudamana.com.br)"
TIPOS = {7: "Resolução", 20: "Provimento", 13: "Recomendação", 19: "Resolução Conjunta", 26: "Recomendação Conjunta",
         10: "Enunciado Administrativo", 25: "Instrução Normativa Conjunta", 8: "Instrução Normativa", 17: "Orientação"}
MARCA = {"Revogado": "[REVOGADO] ", "Suspenso": "[SUSPENSO] ", "Exaurido": "[EXAURIDO] ", "Expirado": "[EXPIRADO] ", "Sem efeito": "[SEM EFEITO] "}


def baixar(url):
    for t in range(4):
        r = subprocess.run(["curl", "-sL", "-m", "90", "-A", UA, "-w", "\n%{http_code}", url], capture_output=True, timeout=120)
        corpo, _, cod = r.stdout.rpartition(b"\n")
        if cod.decode().strip() == "200":
            return corpo.decode("utf-8", errors="replace")
        time.sleep(5 * (t + 1))
    raise OSError("falha em " + url)


def listar(tipo):
    out, p = [], 1
    while True:
        s = baixar(f"https://atos.cnj.jus.br/atos?atos=sim&tipoAto%5B0%5D={tipo}&page={p}")
        corpo = s[s.find("<tbody>"):s.find("</tbody>")]
        linhas = re.findall(r"<tr>(.*?)</tr>", corpo, re.S)
        if not linhas:
            break
        for l in linhas:
            href = re.search(r'href="atos/detalhar/(\d+)', l)
            tds = [html.unescape(re.sub(r"<[^>]+>", "", t)).strip() for t in re.findall(r"<td[^>]*>(.*?)</td>", l, re.S)]
            if len(tds) < 6 or not href:
                continue
            out.append({"id": href.group(1), "tipo": tds[0], "numero": tds[1].lstrip("0") or tds[1], "data": tds[2], "origem": tds[3],
                        "situacao": tds[4], "ementa": re.sub(r"\s+", " ", tds[5])})
        p += 1
        time.sleep(0.4)
    return out


def corpo_do_ato(s):
    s = re.sub(r"<script.*?</script>|<style.*?</style>", "", s, flags=re.S)
    s = re.sub(r"<(?:p|br|div|li|tr|h\d)[^>]*>", "\n", s)
    t = html.unescape(re.sub(r"<[^>]+>", "", s))
    t = re.sub(r"\xa0", " ", t)
    i = t.find("Texto Compilado")
    if i < 0:
        i = t.find("\nTexto\n")
    t = t[i:].split("\n", 1)[1] if i >= 0 and "\n" in t[i:] else t
    ps = [re.sub(r"\s+", " ", x).strip() for x in t.split("\n")]
    ps = [x for x in ps if x and x not in ("Texto Original", "Texto Compilado")]
    return ps


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--tipos", default=",".join(map(str, TIPOS)))
    ap.add_argument("--refazer", action="store_true")
    ap.add_argument("--max", type=int, default=0)
    a = ap.parse_args()
    hoje = datetime.date.today().isoformat()
    atos = []
    for t in [int(x) for x in a.tipos.split(",")]:
        l = listar(t)
        print(f"{TIPOS.get(t, t)}: {len(l)} atos", flush=True)
        atos += l
    pasta = os.path.join(RAIZ, "leis", "texto")
    ix_f = os.path.join(pasta, "indice.json")
    ix = json.load(open(ix_f, encoding="utf-8"))

    def baixa(x):
        arq = os.path.join(pasta, f"cnj-{x['id']}.json")
        if os.path.exists(arq) and not a.refazer:
            return x, "ja"
        try:
            ps = corpo_do_ato(baixar(f"https://atos.cnj.jus.br/atos/detalhar/{x['id']}"))
        except OSError as e:
            return x, "erro " + str(e)[:60]
        if len(ps) < 2 or sum(map(len, ps)) < 120:
            return x, "curto"
        ano = x["data"][-4:]
        nome = f"{x['tipo']} CNJ nº {x['numero']}/{ano}"
        json.dump({"nome": nome, "url": f"https://atos.cnj.jus.br/atos/detalhar/{x['id']}", "em": hoje, "p": ps},
                  open(arq, "w", encoding="utf-8"), ensure_ascii=False, separators=(",", ":"))
        return x, "ok"
    fila = atos[:a.max] if a.max else atos
    res = {"ok": 0, "ja": 0, "curto": 0, "erro": 0}
    com_texto = set()
    with ThreadPoolExecutor(4) as ex:
        for k, (x, st) in enumerate(ex.map(baixa, fila), 1):
            res[st.split()[0]] += 1
            if st in ("ok", "ja"):
                com_texto.add(x["id"]); ix[f"cnj-{x['id']}"] = hoje if st == "ok" else ix.get(f"cnj-{x['id']}", hoje)
            if k % 100 == 0:
                print(f"  {k}/{len(fila)} {res}", flush=True)
    json.dump(ix, open(ix_f, "w", encoding="utf-8"), ensure_ascii=False, indent=0, sort_keys=True)
    leis = []
    for x in sorted(atos, key=lambda x: (x["tipo"], x["data"][-4:], int(re.sub(r"\D", "", x["numero"]) or 0))):
        if x["id"] not in com_texto:
            continue
        ano = x["data"][-4:]
        leis.append({"nome": MARCA.get(x["situacao"], "") + x["ementa"][:300], "numero": f"{x['tipo']} CNJ nº {x['numero']}/{ano}",
                     "link": f"https://atos.cnj.jus.br/atos/detalhar/{x['id']}", "textoId": f"cnj-{x['id']}", "situacao": x["situacao"], "data": x["data"]})
    json.dump({"leis": leis}, open(os.path.join(RAIZ, "leis", "cnj-atos.json"), "w", encoding="utf-8"), ensure_ascii=False, separators=(",", ":"))
    print(res, "→", len(leis), "atos no Diário")


if __name__ == "__main__":
    main()
