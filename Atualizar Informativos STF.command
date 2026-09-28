#!/bin/bash
# Atualizar Informativos STF.command — dê DOIS CLIQUES neste arquivo no Mac
# (no Finder, na pasta do repositório) uma vez por semana.
#
# Ele: 1) pega a versão mais nova do main; 2) confere no site do STF se saíram
# Informativos novos (scripts/atualizar_informativos_stf.py); 3) se saíram,
# grava em diario-data.js e envia para o main. O envio dispara sozinho a
# limpeza do cache do jsDelivr, então o site mostra a novidade em minutos.
#
# Não tem agendamento: só roda quando você abre este arquivo.
# Tem que ser no Mac (conexão no Brasil): o STF bloqueia os servidores do GitHub.

cd "$(dirname "$0")" || exit 1
fim() { echo; read -n 1 -s -r -p "Pressione qualquer tecla para fechar."; echo; exit "$1"; }

echo "=== Atualizar Informativos do STF — $(date '+%d/%m/%Y %H:%M') ==="
echo
if [ -n "$(git status --porcelain -- diario-data.js)" ]; then
  echo "ERRO: diario-data.js tem mudanças não enviadas neste Mac. Resolva antes."
  fim 1
fi
git fetch -q origin main && git checkout -q main && git pull -q --ff-only origin main \
  || { echo "ERRO: não consegui atualizar o repositório com o main."; fim 1; }

python3 scripts/atualizar_informativos_stf.py || fim 1

if git diff --quiet -- diario-data.js; then
  echo; echo "Nada para enviar."
  fim 0
fi
git add diario-data.js
git commit -q -m "Informativos: novas edições do STF (do Mac)" \
  && git push -q origin main \
  && { echo; echo "✅ Enviado para o site."; fim 0; }
echo; echo "ERRO: não consegui enviar para o GitHub (a mudança ficou salva neste Mac)."
fim 1
