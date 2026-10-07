#!/bin/bash
# Atualizar Provas.command — dê DOIS CLIQUES (no Mac, na pasta do repositório).
# Lê as provas novas da sua pasta "Provas" (objetivas, discursivas, sentenças, orais, ENAM e FGV),
# tira o texto dos PDFs, liga as questões às súmulas e decisões do site ("Cobrado em…") e envia ao site.
# Só refaz o que mudou, então pode rodar sempre que colocar provas novas na pasta.
# Pergunta a pasta uma vez só (fica em provas/pasta-das-provas.txt, a mesma do Atualizar Informativos).
cd "$(dirname "$0")" || exit 1
fim() { echo; read -n 1 -s -r -p "Pressione qualquer tecla para fechar."; echo; exit "$1"; }
echo "=== Atualizar provas — $(date '+%d/%m/%Y %H:%M') ==="
git checkout -q main 2>/dev/null
git fetch -q origin main && git pull -q --rebase --autostash origin main \
  || { git rebase --abort 2>/dev/null; echo "ERRO: não consegui juntar com o main. Cole esta janela para a Claude."; fim 1; }
if [ ! -s provas/pasta-das-provas.txt ]; then
  echo "Onde está a sua pasta \"Provas\" (a que tem 01 Objetivas, 02 Discursivas…)?"
  echo "ARRASTE a pasta para esta janela e aperte Enter:"
  read -r pasta
  pasta=$(printf '%s' "$pasta" | sed -e 's/\\\(.\)/\1/g' -e 's/[[:space:]]*$//')
  [ -d "$pasta" ] || { echo "Não achei essa pasta."; fim 1; }
  printf '%s\n' "$pasta" > provas/pasta-das-provas.txt
fi
PASTA="$(cat provas/pasta-das-provas.txt)"
[ -d "$PASTA" ] || { echo "A pasta $PASTA não existe mais. Apague provas/pasta-das-provas.txt e rode de novo."; fim 1; }
python3 -c "import fitz" 2>/dev/null || pip3 install --user -q pymupdf
echo "--- 1/3 texto dos PDFs"
python3 scripts/cobrancas_extrair_texto.py "$PASTA" || fim 1
echo "--- 2/3 ligando as provas às súmulas e decisões"
python3 scripts/cobrancas_todas_etapas.py "$PASTA" || fim 1
echo "--- 3/3 ligando os julgados dos informativos"
python3 scripts/cobrancas_informativos.py "$PASTA" || echo "(informativos: pulei esta etapa)"
git add provas/cobrancas.json provas/informativos-cruzados.json 2>/dev/null
if git diff --cached --quiet; then echo "Nada para enviar."; fim 0; fi
git commit -q -m "Provas: novas provas ligadas às súmulas e decisões (do Mac)" || fim 1
for t in 1 2 3; do
  git push -q origin main && { echo "✅ Enviado para o site."; fim 0; }
  git fetch -q origin main && git pull -q --rebase --autostash -X theirs origin main || { git rebase --abort 2>/dev/null; break; }
done
echo "ERRO: não consegui enviar. Cole esta janela para a Claude."; fim 1
