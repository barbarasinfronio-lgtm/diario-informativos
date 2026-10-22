"""
pedidos_retentativa.py — regra de nova tentativa dos pedidos de julgado e de inteiro teor que o robô não achou.

Quem pede um julgado ou um inteiro teor recente costuma pedir antes de o tribunal publicar a íntegra (ou antes de a
base de dados do tribunal ser atualizada). Por isso, o que o robô não acha NÃO é descartado:
  - é procurado de novo UMA VEZ POR SEMANA (INTERVALO_DIAS), não a cada rodada;
  - até completar DOIS MESES (PRAZO_DIAS) contados da data do pedido; depois disso o robô desiste e o pedido fica
    registrado como "desistiu" no arquivo de falhas (sem apagar o histórico).
A primeira tentativa é sempre feita na hora. Falhas passageiras (site fora do ar, tempo esgotado) não contam como
tentativa: voltam na rodada seguinte.

Cada registro de falha guarda: "primeira" (data do pedido), "ultima" (data da última tentativa de verdade),
"tentativas" e, quando desiste, "desistiu" (data).
"""
from datetime import date, timedelta

PRAZO_DIAS = 60        # ~2 meses desde o pedido
INTERVALO_DIAS = 7     # uma tentativa por semana


def _dia(s, padrao=None):
    try:
        return date.fromisoformat(str(s)[:10])
    except (TypeError, ValueError):
        return padrao


def eh_passageira(motivo):
    """Falha por problema do site/da rede (e não por o julgado ainda não existir)."""
    m = str(motivo or "").lower()
    return any(k in m for k in ("passou de", "http 4", "http 5", "http 000", "bloque", "403", "timeout", "tempo", "conex", "sem o cache", "o cache do"))


def decidir(registro, criado, hoje):
    """registro: dict de falha anterior ou None; criado: 'aaaa-mm-dd' do pedido; hoje: date.
    Devolve 'tentar' | 'esperar' | 'desistir'."""
    registro = registro or {}
    if registro.get("desistiu"):
        return "desistir"
    primeira = _dia(registro.get("primeira")) or _dia(criado, hoje)
    ultima = _dia(registro.get("ultima"))
    if ultima is None:
        return "tentar"      # primeira tentativa de verdade
    if hoje - primeira > timedelta(days=PRAZO_DIAS):
        return "desistir"
    if hoje - ultima < timedelta(days=INTERVALO_DIAS):
        return "esperar"
    return "tentar"


def registrar_falha(registro, criado, hoje, motivo, conta_tentativa=True):
    """Novo registro de falha (a data da última tentativa só avança se a tentativa valeu)."""
    registro = dict(registro or {})
    registro["motivo"] = str(motivo)[:300]
    registro.setdefault("primeira", str(criado or hoje.isoformat())[:10])
    if conta_tentativa:
        registro["ultima"] = hoje.isoformat()
        registro["tentativas"] = int(registro.get("tentativas", 0)) + 1
    return registro


def registrar_desistencia(registro, hoje):
    registro = dict(registro or {})
    registro["desistiu"] = hoje.isoformat()
    registro["motivo"] = (registro.get("motivo", "") + " — desisti: não achei em 2 meses de tentativas semanais").strip(" —")
    return registro
