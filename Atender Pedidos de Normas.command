#!/bin/bash
# Atender Pedidos de Normas.command — dê DOIS CLIQUES (no Mac, na pasta do repositório).
# Quem busca uma resolução, recomendação ou provimento que não está no Diário das Resoluções pode clicar em
# "Pedir esta norma". Este comando lê esses pedidos, procura a norma no acervo de atos do órgão e a inclui no site.
cd "$(dirname "$0")" || exit 1
fim() { echo; read -n 1 -s -r -p "Pressione qualquer tecla para fechar."; echo; exit "$1"; }
ARQUIVOS=(normas/pedidas.json curadoria/normas-pedidas-falhas.json)
echo "=== Pedidos de normas — $(date '+%d/%m/%Y %H:%M') ==="
git checkout -q main 2>/dev/null
git fetch -q origin main && git pull -q --rebase --autostash origin main \
  || { git rebase --abort 2>/dev/null; echo "ERRO: não consegui juntar com o main. Cole esta janela para a Claude."; fim 1; }
python3 scripts/normas_sob_pedido.py
for f in "${ARQUIVOS[@]}"; do [ -e "$f" ] && git add "$f"; done
if git diff --cached --quiet; then echo "Nada para enviar."; fim 0; fi
git commit -q -m "Normas pedidas por leitores (do Mac)" || fim 1
for t in 1 2 3; do
  git push -q origin main && { echo "✅ Enviado para o site."; fim 0; }
  git fetch -q origin main && git pull -q --rebase --autostash origin main || { git rebase --abort 2>/dev/null; break; }
done
echo "ERRO: não consegui enviar. Cole esta janela para a Claude."; fim 1
