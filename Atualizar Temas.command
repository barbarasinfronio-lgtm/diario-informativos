#!/bin/bash
# Atualizar Temas.command — dê DOIS CLIQUES (no Mac, na pasta do repositório). Pode rodar todo dia.
#
# Traz para o Diário das Decisões os Temas novos de repercussão geral (STF, só os que já têm mérito
# julgado) e de recursos repetitivos (STJ, afetados e julgados) que ainda não estão no site
# (scripts/temas_novos.py) e envia para o main. O envio publica o site sozinho.
#
# Só mexe em site/decisoes/rg-repetitivos-data.js. Se o Mac estiver numa branch que não seja a main e não
# puder trocar, ele para (não envia nada) em vez de mandar para o lugar errado.

cd "$(dirname "$0")" || exit 1
fim() { echo; read -n 1 -s -r -p "Pressione qualquer tecla para fechar."; echo; exit "$1"; }

echo "=== Atualizar Temas — $(date '+%d/%m/%Y %H:%M') ==="
echo
ARQUIVOS=(site/decisoes/rg-repetitivos-data.js)
if [ "$(git branch --show-current)" != "main" ]; then
  git checkout -q main 2>/dev/null || { echo "ERRO: este Mac está em outra branch e não consegui voltar para a main (há arquivos modificados). Cole esta janela para a Claude."; fim 1; }
fi
if [ -n "$(git status --porcelain -- "${ARQUIVOS[@]}")" ]; then
  echo "Havia temas deste Mac ainda não enviados; vão junto agora."
  for f in "${ARQUIVOS[@]}"; do git add "$f"; done
  git commit -q -m "Temas: atualização pendente (do Mac)" || { echo "ERRO: não consegui guardar a atualização pendente."; fim 1; }
fi
git fetch -q origin main && git pull -q --rebase --autostash origin main \
  || { git rebase --abort 2>/dev/null; echo "ERRO: não consegui juntar este Mac com o main (conflito). Cole esta janela para a Claude."; fim 1; }

python3 scripts/temas_novos.py --gravar
resultado=$?

for f in "${ARQUIVOS[@]}"; do git add "$f"; done
if ! git diff --cached --quiet -- "${ARQUIVOS[@]}"; then
  git commit -q -m "Temas novos de repercussão geral e repetitivos (do Mac)" || { echo "ERRO: não consegui guardar os temas."; fim 1; }
fi
if [ -z "$(git log origin/main..main --oneline)" ]; then echo; echo "Nada para enviar."; fim "$resultado"; fi
enviado=0
for tentativa in 1 2 3; do
  if git push -q origin main; then enviado=1; break; fi
  echo "Envio recusado (o main mudou); juntando e tentando de novo ($tentativa/3)..."
  git fetch -q origin main && git pull -q --rebase --autostash origin main || { git rebase --abort 2>/dev/null; break; }
done
if [ "$enviado" = 1 ]; then echo; echo "✅ Enviado para o site."; else echo; echo "ERRO: não consegui enviar para o GitHub (a mudança ficou salva neste Mac)."; resultado=1; fi
fim "$resultado"
