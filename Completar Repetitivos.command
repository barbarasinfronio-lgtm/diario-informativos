#!/bin/bash
# Completar Repetitivos.command — dê DOIS CLIQUES (no Mac, na pasta do repositório).
# Lê os arquivos JSON do SCON do STJ ("Espelhos de acórdãos…") e acrescenta ao card
# de cada Tema repetitivo antigo a ementa do acórdão. Pergunta a pasta uma vez só.
cd "$(dirname "$0")" || exit 1
fim() { echo; read -n 1 -s -r -p "Pressione qualquer tecla para fechar."; echo; exit "$1"; }
echo "=== Completar repetitivos do STJ — $(date '+%d/%m/%Y %H:%M') ==="
git checkout -q main 2>/dev/null
git fetch -q origin main && git pull -q --rebase --autostash origin main \
  || { git rebase --abort 2>/dev/null; echo "ERRO: não consegui juntar com o main. Cole esta janela para a Claude."; fim 1; }
if [ ! -s stj/pasta-scon.txt ]; then
  echo "Onde estão os arquivos JSON do SCON do STJ (\"Espelhos de acórdãos…\")?"
  echo "ARRASTE a pasta para esta janela e aperte Enter:"
  read -r pasta
  pasta=$(printf '%s' "$pasta" | sed -e 's/\\\(.\)/\1/g' -e 's/[[:space:]]*$//')
  [ -d "$pasta" ] || { echo "Não achei essa pasta."; fim 1; }
  printf '%s\n' "$pasta" > stj/pasta-scon.txt
fi
python3 scripts/ementas_repetitivos_scon.py "$(cat stj/pasta-scon.txt)" || fim 1
git add stj/repetitivos stj/repetitivos-scon.json
if git diff --cached --quiet; then echo "Nada para enviar."; fim 0; fi
git commit -q -m "Ementas dos Temas repetitivos do STJ (SCON, do Mac)" || fim 1
for t in 1 2 3; do
  git push -q origin main && { echo "✅ Enviado para o site."; fim 0; }
  git fetch -q origin main && git pull -q --rebase --autostash origin main || { git rebase --abort 2>/dev/null; break; }
done
echo "ERRO: não consegui enviar. Cole esta janela para a Claude."; fim 1
