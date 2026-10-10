#!/bin/bash
# Atender Pedidos de Inteiro Teor.command — dê DOIS CLIQUES (no Mac, na pasta do repositório).
# Quem lê um julgado do STF sem inteiro teor clica em "Buscar inteiro teor" no site. Este comando lê esses
# pedidos, busca o acórdão no portal do STF e envia o texto ao site. 30 por vez; rode de novo para continuar.
# Só roda no Mac (o portal do STF bloqueia os servidores do GitHub).
cd "$(dirname "$0")" || exit 1
fim() { echo; read -n 1 -s -r -p "Pressione qualquer tecla para fechar."; echo; exit "$1"; }
ARQUIVOS=(teor curadoria/teor-pedidos-falhas.json curadoria/debug-stf)
echo "=== Pedidos de inteiro teor — $(date '+%d/%m/%Y %H:%M') ==="
git checkout -q main 2>/dev/null
git fetch -q origin main && git pull -q --rebase --autostash origin main \
  || { git rebase --abort 2>/dev/null; echo "ERRO: não consegui juntar com o main. Cole esta janela para a Claude."; fim 1; }
python3 scripts/teor_sob_pedido.py --max 30
for f in "${ARQUIVOS[@]}"; do [ -e "$f" ] && git add "$f"; done
if git diff --cached --quiet; then echo "Nada para enviar."; fim 0; fi
git commit -q -m "Inteiro teor de julgados pedidos no site (do Mac)" || fim 1
for t in 1 2 3; do
  git push -q origin main && { echo "✅ Enviado para o site."; fim 0; }
  git fetch -q origin main && git pull -q --rebase --autostash origin main || { git rebase --abort 2>/dev/null; break; }
done
echo "ERRO: não consegui enviar. Cole esta janela para a Claude."; fim 1
