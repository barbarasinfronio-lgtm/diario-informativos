#!/bin/bash
# Atualizar Informativos.command — dê DOIS CLIQUES neste arquivo no Mac (no
# Finder, na pasta do repositório) uma vez por semana.
#
# Ele: 1) pega a versão mais nova do main; 2) confere nos sites oficiais se
# saíram Informativos novos de STF, STJ, TSE, CNJ, TST e CNMP e teses novas
# da Jurisprudência em Teses do STJ (scripts/atualizar_informativos.py); as
# leis alteradas ficam no "Atualizar Leis.command" (pode rodar todo dia);
# 3) grava o que achou em diario-data.js e stj/teses.json e envia para o main. O envio dispara sozinho a limpeza do
# cache do jsDelivr, então o site mostra a novidade em minutos.
#
# Se um tribunal falhar, os outros são gravados e enviados assim mesmo; a
# janela avisa qual falhou.
#
# Não tem agendamento: só roda quando você abre este arquivo.
# Tem que ser no Mac (conexão no Brasil): STF, STJ, TSE e TST bloqueiam os
# servidores do GitHub.

cd "$(dirname "$0")" || exit 1
fim() { echo; read -n 1 -s -r -p "Pressione qualquer tecla para fechar."; echo; exit "$1"; }

echo "=== Atualizar Informativos — $(date '+%d/%m/%Y %H:%M') ==="
echo
ARQUIVOS=(diario-data.js stj/teses.json leis/alteracoes.json leis/texto leis/texto-debug)
# Mudanças que o robô deixou neste Mac sem enviar (por exemplo, a importação
# das Teses rodada pelo Terminal): guarda num commit, para irem junto.
git checkout -q main 2>/dev/null
if [ -n "$(git status --porcelain -- "${ARQUIVOS[@]}")" ]; then
  echo "Havia atualizações neste Mac ainda não enviadas; vão junto agora."
  for f in "${ARQUIVOS[@]}"; do [ -e "$f" ] && git add "$f"; done
  git commit -q -m "Informativos/Teses: atualização pendente (do Mac)" \
    || { echo "ERRO: não consegui guardar as atualizações pendentes."; fim 1; }
fi
git fetch -q origin main && git pull -q --rebase --autostash origin main \
  || { git rebase --abort 2>/dev/null
       echo "ERRO: não consegui juntar este Mac com o main (conflito). Cole esta janela para a Claude."; fim 1; }

# As leis (Planalto) têm arquivo próprio, para rodar todo dia: "Atualizar Leis.command".
python3 scripts/atualizar_informativos.py STF STF-PV STJ STJ-EXTRA STJ-BOLETIM TSE CNJ TST CNMP TESES
resultado=$?

for f in "${ARQUIVOS[@]}"; do [ -e "$f" ] && git add "$f"; done
if ! git diff --cached --quiet -- "${ARQUIVOS[@]}"; then
  git commit -q -m "Informativos: novas edições (do Mac)" \
    || { echo; echo "ERRO: não consegui guardar as novidades."; fim 1; }
fi
if [ -z "$(git log origin/main..main --oneline)" ]; then
  echo; echo "Nada para enviar."
  fim "$resultado"
fi
# A rodada demora; nesse tempo o main pode ter recebido outras mudanças. Se o
# envio for recusado, junta de novo com o main e tenta outra vez.
enviado=0
for tentativa in 1 2 3; do
  if git push -q origin main; then enviado=1; break; fi
  echo "Envio recusado (o main mudou); juntando e tentando de novo ($tentativa/3)..."
  git fetch -q origin main && git pull -q --rebase --autostash origin main \
    || { git rebase --abort 2>/dev/null; break; }
done
if [ "$enviado" = 1 ]; then
  echo; echo "✅ Enviado para o site."
else
  echo; echo "ERRO: não consegui enviar para o GitHub (a mudança ficou salva neste Mac)."
  resultado=1
fi
fim "$resultado"
