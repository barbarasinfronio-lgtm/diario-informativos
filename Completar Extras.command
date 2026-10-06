#!/bin/bash
# Completar Extras.command — dê DOIS CLIQUES (no Mac, na pasta do repositório).
# Busca no portal do STF o inteiro teor das "decisões de referência (extras)", que só têm
# resumo de notícia (para a curadoria não descartar por falta de texto). 100 por vez.
# Faz 100 por vez; rode de novo para continuar. Só roda no Mac (o portal do STF
# bloqueia os servidores do GitHub).
cd "$(dirname "$0")" || exit 1
fim() { echo; read -n 1 -s -r -p "Pressione qualquer tecla para fechar."; echo; exit "$1"; }
ARQUIVOS=(curadoria/extras-textos.json curadoria/extras-textos-falhas.json curadoria/debug-stf)
echo "=== Completar textos do STF — $(date '+%d/%m/%Y %H:%M') ==="
git checkout -q main 2>/dev/null
git fetch -q origin main && git pull -q --rebase --autostash origin main \
  || { git rebase --abort 2>/dev/null; echo "ERRO: não consegui juntar com o main. Cole esta janela para a Claude."; fim 1; }
python3 scripts/completar_extras_stf.py --max 100
for f in "${ARQUIVOS[@]}"; do [ -e "$f" ] && git add "$f"; done
if git diff --cached --quiet; then echo "Nada para enviar."; fim 0; fi
git commit -q -m "Inteiro teor das decisões de referência extras (do Mac)" || fim 1
for t in 1 2 3; do
  git push -q origin main && { echo "✅ Enviado para o site."; fim 0; }
  git fetch -q origin main && git pull -q --rebase --autostash origin main || { git rebase --abort 2>/dev/null; break; }
done
echo "ERRO: não consegui enviar. Cole esta janela para a Claude."; fim 1
