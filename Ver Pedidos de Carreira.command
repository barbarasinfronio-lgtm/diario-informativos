#!/bin/bash
# Ver Pedidos de Carreira.command — dê DOIS CLIQUES (no Mac, na pasta do repositório).
# Mostra os pedidos de "Solicitar carreira" feitos no Diário de Editais que ainda não foram atendidos.
# Para atender: cole esta janela para a Claude, que monta o edital, junta as provas e importa as leis.
cd "$(dirname "$0")" || exit 1
echo "=== Pedidos de carreira — $(date '+%d/%m/%Y %H:%M') ==="
python3 scripts/pedidos_carreira.py
echo; read -n 1 -s -r -p "Pressione qualquer tecla para fechar."; echo
