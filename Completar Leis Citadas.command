#!/bin/bash
# Completar Leis Citadas.command — dê DOIS CLIQUES (no Mac, na pasta do repositório).
# Busca no Planalto o texto das leis citadas nas decisões que ainda não estão no Diário de Leis,
# para a pessoa poder ler e anotar a lei que incluir no próprio Diário. 150 por vez.
# Rode de novo para continuar. Só roda no Mac (o Planalto pode bloquear os
# servidores do GitHub).
cd "$(dirname "$0")" || exit 1
fim() { echo; read -n 1 -s -r -p "Pressione qualquer tecla para fechar."; echo; exit "$1"; }
ARQUIVOS=(leis/texto leis/texto-debug)
echo "=== Completar leis citadas — $(date '+%d/%m/%Y %H:%M') ==="
git checkout -q main 2>/dev/null
git fetch -q origin main && git pull -q --rebase --autostash origin main \
  || { git rebase --abort 2>/dev/null; echo "ERRO: não consegui juntar com o main. Cole esta janela para a Claude."; fim 1; }
python3 scripts/leis_citadas.py --max 150
for f in "${ARQUIVOS[@]}"; do [ -e "$f" ] && git add "$f"; done
if git diff --cached --quiet; then echo "Nada para enviar."; fim 0; fi
git commit -q -m "Texto das leis citadas nas decisões (do Mac)" || fim 1
for t in 1 2 3; do
  git push -q origin main && { echo "✅ Enviado para o site."; fim 0; }
  git fetch -q origin main && git pull -q --rebase --autostash origin main || { git rebase --abort 2>/dev/null; break; }
done
echo "ERRO: não consegui enviar. Cole esta janela para a Claude."; fim 1
