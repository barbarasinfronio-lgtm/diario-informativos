#!/bin/bash
# Atualizar Meu Mac.command — dê DOIS CLIQUES (no Mac, na pasta do repositório).
# Baixa para o seu Mac tudo o que a Claude e os robôs mudaram no site (é o "git pull").
# Use quando eu disser que criei um arquivo ou comando novo e ele ainda não aparecer na pasta.
cd "$(dirname "$0")" || exit 1
echo "=== Atualizar meu Mac — $(date '+%d/%m/%Y %H:%M') ==="
git checkout -q main 2>/dev/null
if git fetch -q origin main && git pull --rebase --autostash origin main; then
  echo
  echo "✅ Pronto: sua pasta está atualizada."
  # garante que os comandos novos abrem com dois cliques
  chmod +x ./*.command 2>/dev/null
else
  git rebase --abort 2>/dev/null
  echo
  echo "ERRO: não consegui atualizar. Copie esta janela e cole para a Claude."
fi
echo
read -n 1 -s -r -p "Pressione qualquer tecla para fechar."
echo
