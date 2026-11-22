#!/bin/bash
# Atualizar Sumulas.command — dê DOIS CLIQUES (no Mac, na pasta do repositório).
# Confere o Diário das Súmulas com as páginas oficiais (scripts/atualizar_sumulas.py): STF (comuns e vinculantes), TCU,
# TJs, TRFs, TRTs, TREs e Tribunais de Contas. Mostra o que é novo ou cancelado na fonte.
# Grava sozinho só o que vem com texto completo (TCU e STF); o resto aparece no relatório para a Claude conferir e incluir.
# Sites que bloqueiam robôs (STJ, TSE, vários TREs...) ficam como "conferir pelo Chrome".
cd "$(dirname "$0")" || exit 1
fim() { echo; read -n 1 -s -r -p "Pressione qualquer tecla para fechar."; echo; exit "$1"; }
echo "=== Atualizar Súmulas — $(date '+%d/%m/%Y %H:%M') ==="
git checkout -q main 2>/dev/null
git fetch -q origin main && git pull -q --rebase --autostash origin main \
  || { git rebase --abort 2>/dev/null; echo "ERRO: não consegui juntar com o main. Cole esta janela para a Claude."; fim 1; }
python3 scripts/atualizar_sumulas.py --aplicar || echo "(súmulas: alguma fonte não respondeu; veja acima)"
git add site/sumulas/sumulas-data.js curadoria/sumulas-conferencia.json
if git diff --cached --quiet; then echo "Nada para enviar."; fim 0; fi
git commit -q -m "Súmulas: conferência com as fontes oficiais (do Mac)" || fim 1
for t in 1 2 3; do
  git push -q origin main && { echo "✅ Enviado para o site."; fim 0; }
  git fetch -q origin main && git pull -q --rebase --autostash origin main || { git rebase --abort 2>/dev/null; break; }
done
echo "ERRO: não consegui enviar. Cole esta janela para a Claude."; fim 1
