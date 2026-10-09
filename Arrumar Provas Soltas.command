#!/bin/bash
# Arrumar Provas Soltas.command — dê DOIS CLIQUES (no Mac, na pasta do repositório).
# Pega os PDFs soltos na sua pasta "Provas" (os baixados com nomes como "gabarito (8).pdf"), descobre órgão,
# concurso, ano, banca e etapa lendo o texto, e mostra o PLANO. Só move depois que você confirmar.
# Depois rode o "Atualizar Provas.command" para ligar as provas novas às súmulas e decisões.
cd "$(dirname "$0")" || exit 1
fim() { echo; read -n 1 -s -r -p "Pressione qualquer tecla para fechar."; echo; exit "$1"; }
git checkout -q main 2>/dev/null
git fetch -q origin main && git pull -q --rebase --autostash origin main 2>/dev/null
if [ ! -s provas/pasta-das-provas.txt ]; then
  echo "Onde está a sua pasta \"Provas\"? ARRASTE a pasta para esta janela e aperte Enter:"
  read -r pasta
  pasta=$(printf '%s' "$pasta" | sed -e 's/\\\(.\)/\1/g' -e 's/[[:space:]]*$//')
  [ -d "$pasta" ] || { echo "Não achei essa pasta."; fim 1; }
  printf '%s\n' "$pasta" > provas/pasta-das-provas.txt
fi
PASTA="$(cat provas/pasta-das-provas.txt)"
python3 -c "import fitz" 2>/dev/null || pip3 install --user -q pymupdf
python3 -W ignore scripts/cobrancas_triagem.py "$PASTA" || fim 1
echo
read -r -p "Mover os arquivos como no plano acima? (s/N) " r
if [ "$r" = "s" ] || [ "$r" = "S" ]; then
  python3 -W ignore scripts/cobrancas_triagem.py "$PASTA" --aplicar | tail -1
  echo "Pronto. Agora rode o \"Atualizar Provas.command\"."
else
  echo "Nada foi movido."
fi
fim 0
