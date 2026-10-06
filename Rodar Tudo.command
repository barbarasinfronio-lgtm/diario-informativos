#!/bin/bash
# Rodar Tudo.command — dê DOIS CLIQUES (no Mac, na pasta do repositório) e deixe rodando.
# Roda, um depois do outro e em rodadas, os comandos que completam o site:
#   Completar Teses STF · Completar Extras · Completar Textos · Completar Leis Citadas
# e, no fim, uma vez cada: Atualizar Leis · Atualizar Informativos.
# Fica rodando até acabar o tempo (padrão 2 horas) ou até não haver mais nada a completar.
# Cada comando envia o que fez ao site por conta própria. O que aparece na tela também vai para
# o arquivo ~/Desktop/rodar-tudo.log (para você me mandar se algo der errado).
# Para parar: Ctrl+C (o que já foi feito está guardado). Só roda no Mac.
#
# Outro tempo:  bash "Rodar Tudo.command" 3     (3 horas)
cd "$(dirname "$0")" || exit 1
HORAS="${1:-2}"
LIMITE=$(( $(date +%s) + HORAS * 3600 ))
LOG="$HOME/Desktop/rodar-tudo.log"
caffeinate -dimsu -w $$ &     # o Mac não dorme enquanto este comando roda
exec > >(tee -a "$LOG") 2>&1
echo "=========== Rodar Tudo — $(date '+%d/%m/%Y %H:%M') — até ${HORAS}h ==========="
trap 'echo; echo "Interrompido. O que já foi feito está guardado e enviado."; exit 130' INT

sobrou_tempo() { [ "$(date +%s)" -lt "$LIMITE" ]; }

# roda um dos comandos sem pausar no fim ("Pressione qualquer tecla") e diz se ele teve trabalho
rodar() {
  local nome="$1"
  echo; echo "──────── $nome — $(date '+%H:%M') ────────"
  local saida
  saida=$(mktemp)
  bash "./$nome.command" < /dev/null 2>&1 | tee "$saida"
  if grep -qE "Nada para enviar|(^|[^0-9])0 (tema\(s\)|extra\(s\)) para buscar|(^|[^0-9])0 decisões cortadas" "$saida"; then
    TEVE=0
  else
    TEVE=1
  fi
  if grep -q "ERRO" "$saida"; then
    echo ">>> $nome terminou com ERRO (veja acima). Segue para o próximo."
  fi
  rm -f "$saida"
}

rodada=0
while sobrou_tempo; do
  rodada=$((rodada + 1))
  echo; echo "=========== RODADA $rodada — $(date '+%H:%M') ==========="
  trabalho=0
  for passo in "Completar Teses STF" "Completar Extras" "Completar Textos" "Completar Leis Citadas"; do
    sobrou_tempo || break
    rodar "$passo"
    [ "$TEVE" -eq 1 ] && trabalho=1
  done
  if [ "$trabalho" -eq 0 ]; then
    echo; echo "Nada mais a completar nesses comandos."
    break
  fi
done

for passo in "Atualizar Leis" "Atualizar Informativos"; do
  echo; echo "──────── $passo (uma vez) — $(date '+%H:%M') ────────"
  bash "./$passo.command" < /dev/null 2>&1 | tail -25
done

echo; echo "=========== FIM — $(date '+%d/%m/%Y %H:%M') ==========="
echo "Log completo em $LOG"
read -n 1 -s -r -p "Pressione qualquer tecla para fechar." || true
echo
