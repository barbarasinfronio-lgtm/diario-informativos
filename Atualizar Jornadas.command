#!/bin/bash
# Atualizar Jornadas.command — dê DOIS CLIQUES (no Mac, na pasta do repositório).
# Traz para o Diário das Súmulas os enunciados das Jornadas do CJF (Direito Civil, Comercial, Processual Civil,
# Prevenção e Solução Extrajudicial de Litígios, Saúde, Administrativo, Tributário…), da base de enunciados do CJF
# (https://www.cjf.jus.br/enunciados/). A primeira vez abre ~1.800 páginas, devagar (uma por vez, ~45 min). Pode
# fechar a janela e rodar de novo: continua de onde parou. Nas vezes seguintes só pega o que for novo (por exemplo,
# a X Jornada de Direito Civil, quando o CJF publicar).
cd "$(dirname "$0")" || exit 1
fim() { echo; read -n 1 -s -r -p "Pressione qualquer tecla para fechar."; echo; exit "$1"; }
echo "=== Atualizar Jornadas — $(date '+%d/%m/%Y %H:%M') ==="
git checkout -q main 2>/dev/null
git fetch -q origin main && git pull -q --rebase --autostash origin main \
  || { git rebase --abort 2>/dev/null; echo "ERRO: não consegui juntar com o main. Cole esta janela para a Claude."; fim 1; }
python3 scripts/jornadas_cjf.py coletar || echo "(a coleta parou antes do fim; vou gravar o que já veio)"
python3 scripts/jornadas_cjf.py montar || fim 1
git add site/sumulas/sumulas-data.js jornadas
if git diff --cached --quiet; then echo "Nada para enviar."; fim 0; fi
git commit -q -m "Jornadas do CJF: enunciados no Diário das Súmulas (do Mac)" || fim 1
for t in 1 2 3; do
  git push -q origin main && { echo "✅ Enviado para o site."; fim 0; }
  git fetch -q origin main && git pull -q --rebase --autostash origin main || { git rebase --abort 2>/dev/null; break; }
done
echo "ERRO: não consegui enviar. Cole esta janela para a Claude."; fim 1
