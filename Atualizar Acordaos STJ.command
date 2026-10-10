#!/bin/bash
# Atualizar Acordaos STJ.command — dê DOIS CLIQUES (no Mac, na pasta do repositório).
# Acrescenta ao Diário das Decisões os acórdãos do STJ que você baixou à mão do portal de dados abertos
# ("Espelhos de acórdãos - Quarta Turma….json" e os .zip históricos). Lê a pasta e as subpastas, não apaga
# nada do que já está no site e não repete (pelo id). Pergunta a pasta uma vez só.
cd "$(dirname "$0")" || exit 1
fim() { echo; read -n 1 -s -r -p "Pressione qualquer tecla para fechar."; echo; exit "$1"; }
echo "=== Acórdãos do STJ — $(date '+%d/%m/%Y %H:%M') ==="
git checkout -q main 2>/dev/null
git fetch -q origin main && git pull -q --rebase --autostash origin main \
  || { git rebase --abort 2>/dev/null; echo "ERRO: não consegui juntar com o main. Cole esta janela para a Claude."; fim 1; }
if [ ! -s stj/pasta-acordaos.txt ]; then
  echo "Onde estão os arquivos 'Espelhos de acórdãos…' (JSON ou ZIP) do STJ?"
  echo "ARRASTE a pasta para esta janela e aperte Enter:"
  read -r pasta
  pasta=$(printf '%s' "$pasta" | sed -e 's/\\\(.\)/\1/g' -e 's/[[:space:]]*$//')
  [ -d "$pasta" ] || { echo "Não achei essa pasta."; fim 1; }
  printf '%s\n' "$pasta" > stj/pasta-acordaos.txt
fi
python3 scripts/acordaos_stj.py mesclar --pasta "$(cat stj/pasta-acordaos.txt)" || fim 1
git add stj/acordaos
if git diff --cached --quiet; then echo "Nada para enviar."; fim 0; fi
git commit -q -m "Acórdãos do STJ: arquivos baixados à mão (do Mac)" || fim 1
for t in 1 2 3; do
  git push -q origin main && { echo "✅ Enviado para o site."; fim 0; }
  git fetch -q origin main && git pull -q --rebase --autostash origin main || { git rebase --abort 2>/dev/null; break; }
done
echo "ERRO: não consegui enviar. Cole esta janela para a Claude."; fim 1
