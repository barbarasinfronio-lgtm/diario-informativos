"""
julgados_pedidos_ids.py — os acórdãos que leitores pediram ("Pedir este julgado") e que já estão no site.

scripts/julgados_sob_pedido.py grava em curadoria/julgados-pedidos.json, em "incluidos", os ids dos acórdãos que incluiu
por pedido, por tribunal: {"STJ": ["1467069"], "STF": ["123456"]}. Os robôs dos acervos (acordaos_stj.py, acordaos_stf.py)
consultam esta lista em avaliar(): um julgado pedido nunca é reprovado pelo filtro de conteúdo, senão a próxima
poda (`acordaos_stj.py podar`) ou `montar --refazer` o tiraria do site de novo.
"""
import json
from pathlib import Path

ARQUIVO = Path(__file__).resolve().parent.parent / "curadoria" / "julgados-pedidos.json"


def ids(tribunal):
    """Conjunto de ids (texto) já incluídos por pedido para esse tribunal ("STJ", "STF"…)."""
    try:
        dados = json.loads(ARQUIVO.read_text(encoding="utf-8"))
    except (OSError, ValueError):
        return set()
    return {str(i) for i in (dados.get("incluidos") or {}).get(tribunal, [])}
