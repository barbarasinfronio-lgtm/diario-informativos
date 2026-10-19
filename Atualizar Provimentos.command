#!/bin/bash
# Atualizar Provimentos.command — dê DOIS CLIQUES (no Mac, na pasta do repositório).
# Traz para o Diário das Resoluções os Provimentos da Corregedoria Nacional de Justiça (CNJ: ~250, do buscador
# atos.cnj.jus.br) e os da Corregedoria Nacional do Ministério Público (CNMP: começaram em 2025, vêm da lista
# "Atos e Normas" do cnmp.mp.br junto com as demais normas do CNMP). Rodar de novo só pega o que for novo.
# O robô do CNMP lê ~620 páginas na primeira vez (devagar, uma por vez; fica em ~/EstudaMana/cache-cnmp) e
# depois só relê as mais novas.
cd "$(dirname "$0")" || exit 1
fim() { echo; read -n 1 -s -r -p "Pressione qualquer tecla para fechar."; echo; exit "$1"; }
echo "=== Atualizar Provimentos — $(date '+%d/%m/%Y %H:%M') ==="
git checkout -q main 2>/dev/null
git fetch -q origin main && git pull -q --rebase --autostash origin main \
  || { git rebase --abort 2>/dev/null; echo "ERRO: não consegui juntar com o main. Cole esta janela para a Claude."; fim 1; }
python3 scripts/atualizar_cnj_provimentos.py || echo "(CNJ: não consegui atualizar; segue com o CNMP)"
python3 scripts/atualizar_cnmp.py || echo "(CNMP: não consegui atualizar)"
git add site/leis/normas-data.js
if git diff --cached --quiet; then echo "Nada para enviar."; fim 0; fi
git commit -q -m "Provimentos das Corregedorias Nacionais (CNJ e CNMP) no Diário das Resoluções (do Mac)" || fim 1
for t in 1 2 3; do
  git push -q origin main && { echo "✅ Enviado para o site."; fim 0; }
  git fetch -q origin main && git pull -q --rebase --autostash origin main || { git rebase --abort 2>/dev/null; break; }
done
echo "ERRO: não consegui enviar. Cole esta janela para a Claude."; fim 1
