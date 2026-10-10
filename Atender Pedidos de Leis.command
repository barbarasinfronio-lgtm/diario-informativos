#!/bin/bash
# Atender Pedidos de Leis.command — dê DOIS CLIQUES (no Mac, na pasta do repositório).
# Quem busca uma lei que não está no Diário de Leis pode clicar em "Pedir para adicionar". Este comando lê esses
# pedidos, busca a lei no Planalto e a inclui no site ("Leis pedidas por leitores"). 20 por vez.
# Só roda no Mac (o Planalto bloqueia os servidores do GitHub).
cd "$(dirname "$0")" || exit 1
fim() { echo; read -n 1 -s -r -p "Pressione qualquer tecla para fechar."; echo; exit "$1"; }
ARQUIVOS=(leis/pedidas.json leis/texto leis/texto-debug curadoria/leis-pedidas-falhas.json)
echo "=== Pedidos de leis — $(date '+%d/%m/%Y %H:%M') ==="
git checkout -q main 2>/dev/null
git fetch -q origin main && git pull -q --rebase --autostash origin main \
  || { git rebase --abort 2>/dev/null; echo "ERRO: não consegui juntar com o main. Cole esta janela para a Claude."; fim 1; }
python3 scripts/leis_sob_pedido.py --max 20
for f in "${ARQUIVOS[@]}"; do [ -e "$f" ] && git add "$f"; done
if git diff --cached --quiet; then echo "Nada para enviar."; fim 0; fi
git commit -q -m "Leis pedidas por leitores (do Mac)" || fim 1
for t in 1 2 3; do
  git push -q origin main && { echo "✅ Enviado para o site."; fim 0; }
  git fetch -q origin main && git pull -q --rebase --autostash origin main || { git rebase --abort 2>/dev/null; break; }
done
echo "ERRO: não consegui enviar. Cole esta janela para a Claude."; fim 1
