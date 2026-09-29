#!/bin/bash
# Atualizar Informativos.command — dê DOIS CLIQUES neste arquivo no Mac (no
# Finder, na pasta do repositório) uma vez por semana.
#
# Ele: 1) pega a versão mais nova do main; 2) confere nos sites oficiais se
# saíram Informativos novos de STF, STJ, TSE, CNJ, TST e CNMP
# (scripts/atualizar_informativos.py); 3) grava o que achou em
# diario-data.js e envia para o main. O envio dispara sozinho a limpeza do
# cache do jsDelivr, então o site mostra a novidade em minutos.
#
# Se um tribunal falhar, os outros são gravados e enviados assim mesmo; a
# janela avisa qual falhou.
#
# Não tem agendamento: só roda quando você abre este arquivo.
# Tem que ser no Mac (conexão no Brasil): STF, STJ, TSE e TST bloqueiam os
# servidores do GitHub.

cd "$(dirname "$0")" || exit 1
fim() { echo; read -n 1 -s -r -p "Pressione qualquer tecla para fechar."; echo; exit "$1"; }

echo "=== Atualizar Informativos — $(date '+%d/%m/%Y %H:%M') ==="
echo
if [ -n "$(git status --porcelain -- diario-data.js)" ]; then
  echo "ERRO: diario-data.js tem mudanças não enviadas neste Mac. Resolva antes."
  fim 1
fi
git fetch -q origin main && git checkout -q main && git pull -q --ff-only origin main \
  || { echo "ERRO: não consegui atualizar o repositório com o main."; fim 1; }

python3 scripts/atualizar_informativos.py
resultado=$?

if git diff --quiet -- diario-data.js; then
  echo; echo "Nada para enviar."
  fim "$resultado"
fi
git add diario-data.js
if git commit -q -m "Informativos: novas edições (do Mac)" && git push -q origin main; then
  echo; echo "✅ Enviado para o site."
else
  echo; echo "ERRO: não consegui enviar para o GitHub (a mudança ficou salva neste Mac)."
  resultado=1
fi
fim "$resultado"
