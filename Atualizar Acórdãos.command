#!/bin/bash
# Atualizar Acórdãos.command — dê DOIS CLIQUES (no Mac, na pasta do repositório).
# Traz os acórdãos novos do STF (pesquisa de jurisprudência), do STJ (dados
# abertos) e do TST (só os acórdãos com efeito vinculante: IRR, IAC, IRDR, IUJ e arguições de inconstitucionalidade) para o Diário das Decisões e envia ao
# site. Só mexe nos meses recentes; o histórico fica no cache em
# ~/EstudaMana/cache-*-acordaos. Rode de vez em quando (a cada 1-2 semanas).
cd "$(dirname "$0")" || exit 1
fim() { echo; read -n 1 -s -r -p "Pressione qualquer tecla para fechar."; echo; exit "$1"; }
ARQUIVOS=(stf/acordaos stj/acordaos tst/acordaos)
ANO=$(date +%Y); ANT=$((ANO - 1))
echo "=== Atualizar acórdãos — $(date '+%d/%m/%Y %H:%M') ==="
git checkout -q main 2>/dev/null
git fetch -q origin main && git pull -q --rebase --autostash origin main \
  || { git rebase --abort 2>/dev/null; echo "ERRO: não consegui juntar com o main. Cole esta janela para a Claude."; fim 1; }
falhou=""
for passo in "stf:coletar --de $ANT --ate $ANO" "stj:coletar" "tst:coletar --de $ANT --ate $ANO"; do
  t="${passo%%:*}"; args="${passo#*:}"
  echo "--- $t"
  python3 "scripts/acordaos_$t.py" $args || falhou="$falhou $t"
done
for t in stf stj tst; do
  case "$falhou" in *"$t"*) echo "($t falhou na coleta; fica como estava)"; continue;; esac
  [ -d "$HOME/EstudaMana/cache-$t-acordaos" ] && python3 "scripts/acordaos_$t.py" montar
done
for f in "${ARQUIVOS[@]}"; do [ -e "$f" ] && git add "$f"; done
if git diff --cached --quiet; then echo "Nada para enviar."; fim 0; fi
git commit -q -m "Acórdãos novos do STF, STJ e TST (do Mac)" || fim 1
for t in 1 2 3; do
  git push -q origin main && { echo "✅ Enviado para o site."; fim 0; }
  git fetch -q origin main && git pull -q --rebase --autostash origin main || { git rebase --abort 2>/dev/null; break; }
done
echo "ERRO: não consegui enviar. Cole esta janela para a Claude."; fim 1
