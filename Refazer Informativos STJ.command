#!/bin/bash
# Refazer Informativos STJ.command — dê DOIS CLIQUES (no Mac, na pasta do repositório).
# Refaz as edições do Informativo do STJ que saíram com julgados colados (tema, tese e inteiro teor de dois
# ou três julgados num card só, no Diário das Decisões): lê o PDF (ou a página) da edição de novo com o leitor
# corrigido, troca os cards colados pelos separados e envia ao site. Só roda no Mac (o STJ bloqueia o GitHub).
# Para refazer só algumas edições: arraste este arquivo para o Terminal seguido dos números (ex.: 905 901).
# Depois, rode o "Atualizar Informativos.command" para o cruzamento com as provas dos cards novos.
cd "$(dirname "$0")" || exit 1
fim() { echo; read -n 1 -s -r -p "Pressione qualquer tecla para fechar."; echo; exit "$1"; }
echo "=== Refazer Informativos STJ — $(date '+%d/%m/%Y %H:%M') ==="
git checkout -q main 2>/dev/null
git fetch -q origin main && git pull -q --rebase --autostash origin main \
  || { git rebase --abort 2>/dev/null; echo "ERRO: não consegui juntar com o main. Cole esta janela para a Claude."; fim 1; }
python3 scripts/informativos_refazer.py "$@"
git add informativos
if git diff --cached --quiet; then echo "Nada para enviar."; fim 0; fi
git commit -q -m "Informativos do STJ refeitos: julgados colados separados (do Mac)" || fim 1
for t in 1 2 3; do
  git push -q origin main && { echo "✅ Enviado para o site."; fim 0; }
  git fetch -q origin main && git pull -q --rebase --autostash origin main || { git rebase --abort 2>/dev/null; break; }
done
echo "ERRO: não consegui enviar. Cole esta janela para a Claude."; fim 1
