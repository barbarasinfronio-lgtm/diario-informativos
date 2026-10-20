#!/bin/bash
# Atender Pedidos de Julgados.command — dê DOIS CLIQUES (no Mac, na pasta do repositório).
# Quem busca um julgado que não está no Diário das Decisões (ex.: "EDcl no AgInt no REsp 1880254/MT") pode clicar em
# "Pedir este julgado". Este comando lê esses pedidos, descobre o tribunal pela classe (REsp → STJ, RE e ADI → STF…),
# procura o acórdão nos dados que os "Atualizar Acórdãos" já baixaram e o inclui no acervo do tribunal. 20 por vez.
# STJ e STF por enquanto; TST, TSE e STM ficam registrados em curadoria/julgados-pedidos.json.
# Se o acórdão for mais novo que a última coleta, o pedido fica pendente: rode o "Atualizar Acórdãos" e este de novo.
cd "$(dirname "$0")" || exit 1
fim() { echo; read -n 1 -s -r -p "Pressione qualquer tecla para fechar."; echo; exit "$1"; }
ARQUIVOS=(stj/acordaos stf/acordaos curadoria/julgados-pedidos.json)
echo "=== Pedidos de julgados — $(date '+%d/%m/%Y %H:%M') ==="
git checkout -q main 2>/dev/null
git fetch -q origin main && git pull -q --rebase --autostash origin main \
  || { git rebase --abort 2>/dev/null; echo "ERRO: não consegui juntar com o main. Cole esta janela para a Claude."; fim 1; }
python3 scripts/julgados_sob_pedido.py --max 20
for f in "${ARQUIVOS[@]}"; do [ -e "$f" ] && git add "$f"; done
if git diff --cached --quiet; then echo "Nada para enviar."; fim 0; fi
git commit -q -m "Julgados pedidos por leitores (do Mac)" || fim 1
for t in 1 2 3; do
  git push -q origin main && { echo "✅ Enviado para o site."; fim 0; }
  git fetch -q origin main && git pull -q --rebase --autostash origin main || { git rebase --abort 2>/dev/null; break; }
done
echo "ERRO: não consegui enviar. Cole esta janela para a Claude."; fim 1
