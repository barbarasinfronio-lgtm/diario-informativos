#!/bin/bash
# Atualizar Leis.command — dê DOIS CLIQUES neste arquivo no Mac (no Finder, na
# pasta do repositório). Pode rodar todo dia.
#
# Ele: 1) pega a versão mais nova do main; 2) confere no site do Planalto as
# leis do acervo (as mais cobradas e todas as que têm texto no Planalto) e
# anota quais foram alteradas e quando (scripts/atualizar_informativos.py,
# etapa LEIS) e guarda o texto de cada uma em leis/texto/ (botão "Leia-me" do
# Diário de Leis); 3) grava em leis/alteracoes.json e leis/texto e envia para o main. O envio
# dispara sozinho a publicação no GitHub Pages, então o site mostra a
# novidade em minutos (aba Novidades legislativas, em Meus Estudos: "Leis alteradas").
#
# Só mexe em leis/alteracoes.json e leis/texto — não toca nos Informativos nem nas Teses
# (para isso, use o "Atualizar Informativos.command").
#
# Cada rodada tem tempo máximo (20 minutos); a primeira vez, com os textos
# todos por baixar, pode precisar de duas ou três rodadas. Se o acervo não couber, o que
# sobrar fica para a próxima vez, começando pelas leis conferidas há mais tempo.
#
# Não tem agendamento: só roda quando você abre este arquivo.

cd "$(dirname "$0")" || exit 1
fim() { echo; read -n 1 -s -r -p "Pressione qualquer tecla para fechar."; echo; exit "$1"; }

echo "=== Atualizar Leis — $(date '+%d/%m/%Y %H:%M') ==="
echo
ARQUIVOS=(leis/alteracoes.json leis/texto leis/texto-debug)
# Mudanças que o robô deixou neste Mac sem enviar: guarda num commit, para irem junto.
git checkout -q main 2>/dev/null
if [ -n "$(git status --porcelain -- "${ARQUIVOS[@]}")" ]; then
  echo "Havia atualizações de leis neste Mac ainda não enviadas; vão junto agora."
  for f in "${ARQUIVOS[@]}"; do [ -e "$f" ] && git add "$f"; done
  git commit -q -m "Leis: atualização pendente (do Mac)" \
    || { echo "ERRO: não consegui guardar as atualizações pendentes."; fim 1; }
fi
git fetch -q origin main && git pull -q --rebase --autostash origin main \
  || { git rebase --abort 2>/dev/null
       echo "ERRO: não consegui juntar este Mac com o main (conflito). Cole esta janela para a Claude."; fim 1; }

python3 scripts/atualizar_informativos.py LEIS
resultado=$?

for f in "${ARQUIVOS[@]}"; do [ -e "$f" ] && git add "$f"; done
if ! git diff --cached --quiet -- "${ARQUIVOS[@]}"; then
  git commit -q -m "Leis: conferência de alterações (do Mac)" \
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
