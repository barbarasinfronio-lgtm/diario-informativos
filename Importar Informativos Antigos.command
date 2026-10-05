#!/bin/bash
# Importar Informativos Antigos.command — dê DOIS CLIQUES (no Mac, na pasta do repositório).
# Transforma os Informativos do STF convertidos para .md (informativo_NNN.md, nºs 1 a ~999) em cards do
# Diário das Decisões e envia ao site. Pergunta a pasta uma vez só.
cd "$(dirname "$0")" || exit 1
fim() { echo; read -n 1 -s -r -p "Pressione qualquer tecla para fechar."; echo; exit "$1"; }
echo "=== Importar Informativos antigos — $(date '+%d/%m/%Y %H:%M') ==="
git checkout -q main 2>/dev/null
git fetch -q origin main && git pull -q --rebase --autostash origin main \
  || { git rebase --abort 2>/dev/null; echo "ERRO: não consegui juntar com o main. Cole esta janela para a Claude."; fim 1; }
if [ ! -s informativos/pasta-md.txt ]; then
  echo "Onde estão os arquivos informativo_NNN.md?"
  echo "ARRASTE a pasta para esta janela e aperte Enter:"
  read -r pasta
  pasta=$(printf '%s' "$pasta" | sed -e 's/\\\(.\)/\1/g' -e 's/[[:space:]]*$//')
  [ -d "$pasta" ] || { echo "Não achei essa pasta."; fim 1; }
  printf '%s\n' "$pasta" > informativos/pasta-md.txt
fi
python3 scripts/informativos_md_para_cards.py "$(cat informativos/pasta-md.txt)" --gravar || fim 1
git add informativos
if git diff --cached --quiet; then echo "Nada para enviar."; fim 0; fi
git commit -q -m "Informativos antigos do STF (1 a 999) como cards (do Mac)" || fim 1
for t in 1 2 3; do
  git push -q origin main && { echo "✅ Enviado para o site."; fim 0; }
  git fetch -q origin main && git pull -q --rebase --autostash origin main || { git rebase --abort 2>/dev/null; break; }
done
echo "ERRO: não consegui enviar. Cole esta janela para a Claude."; fim 1
