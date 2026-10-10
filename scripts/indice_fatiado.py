"""
indice_fatiado.py — índices grandes em fatias (stj/acordaos/indice.json).

O GitHub recusa arquivo com mais de 100 MB e avisa acima de 50 MB; o índice dos acórdãos do STJ passou de 60 MB e
vai crescer (3ª a 6ª Turma). Por isso o indice.json vira um "manifesto" pequeno
    {"fonte": …, "campos": […], "arquivos": ["indice-000.json", …], "total": N}
e cada fatia (indice-000.json …) traz {"itens": [ … até 20.000 …]}. Quem lê usa ler(); quem grava, gravar().
Um indice.json antigo (tudo num arquivo só, com "itens") continua sendo lido normalmente.
"""
import glob, json, os

FATIA = 20000


def ler(caminho):
    """O índice completo ({"campos", "itens", …}), fatiado ou não."""
    obj = json.load(open(caminho, encoding="utf-8"))
    if "arquivos" in obj:
        pasta, itens = os.path.dirname(caminho), []
        for a in obj["arquivos"]:
            itens += json.load(open(os.path.join(pasta, a), encoding="utf-8"))["itens"]
        obj["itens"] = itens
    return obj


def gravar(caminho, obj, fatia=FATIA):
    """Grava obj["itens"] em fatias e o manifesto em caminho; apaga fatias que sobraram."""
    pasta, itens = os.path.dirname(caminho), obj["itens"]
    n = max(1, -(-len(itens) // fatia))
    arquivos = [f"indice-{k:03d}.json" for k in range(n)]
    for k, a in enumerate(arquivos):
        with open(os.path.join(pasta, a), "w", encoding="utf-8") as f:
            json.dump({"itens": itens[k * fatia:(k + 1) * fatia]}, f, ensure_ascii=False, separators=(",", ":"))
    manifesto = {k: v for k, v in obj.items() if k not in ("itens", "arquivos", "total")}
    manifesto["arquivos"], manifesto["total"] = arquivos, len(itens)
    with open(caminho, "w", encoding="utf-8") as f:
        json.dump(manifesto, f, ensure_ascii=False, separators=(",", ":"))
    for velho in glob.glob(os.path.join(pasta, "indice-*.json")):
        if os.path.basename(velho) not in arquivos:
            os.remove(velho)
