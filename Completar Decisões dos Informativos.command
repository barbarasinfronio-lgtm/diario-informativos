#!/bin/bash
# Completar Decisões dos Informativos.command — dê DOIS CLIQUES (no Mac, na pasta do repositório).
# Traz para o Diário das Decisões as decisões do STF que aparecem nos Informativos (ADI, ADC, ADPF, ADO e
# Reclamações) mas ainda não estão em "Constitucionalidade" nem em "Reclamações": busca o inteiro teor no
# portal do STF. Faz 100 por vez; rode de novo para continuar. Só roda no Mac (o portal do STF bloqueia
# os servidores do GitHub). A curadoria roda sozinha no GitHub depois do envio.
cd "$(dirname "$0")" || exit 1
fim() { echo; read -n 1 -s -r -p "Pressione qualquer tecla para fechar."; echo; exit "$1"; }
ARQUIVOS=(curadoria/decisoes-informativos.json curadoria/decisoes-informativos-falhas.json curadoria/debug-stf controleconst/adi_dados.js reclamacoes/reclamacoes-data.js)
echo "=== Decisões dos Informativos — $(date '+%d/%m/%Y %H:%M') ==="
git checkout -q main 2>/dev/null
git fetch -q origin main && git pull -q --rebase --autostash origin main \
  || { git rebase --abort 2>/dev/null; echo "ERRO: não consegui juntar com o main. Cole esta janela para a Claude."; fim 1; }
python3 scripts/decisoes_dos_informativos.py --max 100
for f in "${ARQUIVOS[@]}"; do [ -e "$f" ] && git add "$f"; done
if git diff --cached --quiet; then echo "Nada para enviar."; fim 0; fi
git commit -q -m "Decisões dos Informativos no Diário das Decisões (do Mac)" || fim 1
for t in 1 2 3; do
  git push -q origin main && { echo "✅ Enviado para o site."; fim 0; }
  git fetch -q origin main && git pull -q --rebase --autostash origin main || { git rebase --abort 2>/dev/null; break; }
done
echo "ERRO: não consegui enviar. Cole esta janela para a Claude."; fim 1
