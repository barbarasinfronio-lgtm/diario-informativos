#!/bin/bash
# rodar_no_mac.sh — robôs que precisam rodar de uma conexão no Brasil.
#
# O TST (e a JusLaboris, que é do TST) não responde aos servidores do GitHub,
# então estes robôs rodam no Mac da Barbara, toda segunda às 9h:
#   ~/Library/LaunchAgents/br.com.estudamana.atualizar-tst.plist
#     -> ~/EstudaMana/atualizar-tst.sh (sincroniza o repositório com o main)
#       -> este arquivo
#
# Para incluir uma fonte nova, basta acrescentar o robô e os arquivos que ele
# gera nas listas abaixo — o Mac pega a versão nova do main a cada execução.

ROBOS=(
  scripts/atualizar_tst.py    # TST: súmulas, OJs, PNs, recursos repetitivos
  scripts/atualizar_csjt.py   # CSJT: resoluções e recomendações
  scripts/atualizar_csmpt.py  # CSMPT (MPT): resoluções
)
ARQUIVOS=(site/sumulas/sumulas-data.js tst site/leis/normas-data.js)

resultado=0
for robo in "${ROBOS[@]}"; do
  echo "--- $robo"
  python3 "$robo" || resultado=1
done

git add "${ARQUIVOS[@]}"
if git diff --cached --quiet; then
  echo "Nada mudou."
else
  git commit -q -m "Atualiza TST/CSJT/CSMPT (automático, do Mac)" \
    && git push -q origin main \
    && echo "Publicado: $(git diff --name-only HEAD~1 HEAD | tr '\n' ' ')" \
    || { echo "ERRO: não consegui publicar no GitHub"; resultado=1; }
fi

[ "$resultado" = 0 ] || echo "ATENÇÃO: algum robô falhou (ver acima); essa parte ficou como estava."
exit "$resultado"
