# Estuda Mana — arquivos do site

Código (JS e CSS) das páginas de estudo do [Estuda Mana](https://www.estudamana.com.br),
um site no Blogger. As páginas do Blogger carregam estes arquivos direto deste
repositório pelo jsDelivr:

```html
<script src="https://cdn.jsdelivr.net/gh/barbarasinfronio-lgtm/diario-informativos@main/estudamana-header.js"></script>
```

> **Atenção:** como as páginas apontam para `@main`, tudo o que entra na branch
> `main` vai para o ar. O jsDelivr guarda uma cópia de cada arquivo por várias
> horas, mas o robô `limpar-cache-jsdelivr.yml` (ver [Automação](#automação))
> já manda ele buscar a versão nova a cada push no `main`, então a demora hoje
> é de segundos, não de horas.

## Páginas e arquivos

Cada página usa um par **`*-data.js`** (os dados) + **`*-logic.js`** (o comportamento).
O arquivo de dados precisa ser carregado **antes** do de lógica.

| Página                       | Dados                   | Lógica                          | Estilo                       |
|------------------------------|-------------------------|---------------------------------|------------------------------|
| Diário dos Informativos      | `diario-data.js`        | `diario-logic.js`               | `diario-styles-v2.css`       |
| Diário de Leis               | `leis-data.js` + `editais-data.js` | `leis-logic.js`       | (embutido pela página)       |
| Diário das Súmulas           | `sumulas-data.js`       | `sumulas-logic.js`              | `diario-styles-v2.css`       |
| Diário das Resoluções (CNJ, CSJT, CNMP, CSMPT, CONAMA, CONANDA) | `normas-data.js` | `normas-logic.js` | `diario-styles-v2.css` |
| Diário das Decisões — "Precedentes Qualificados" (STF, STJ, TST) | `rg-repetitivos-data.js` + `tst/decisoes.json` | `rg-repetitivos-logic.js` | `rg-repetitivos-styles.css` |
| Editais                      | `editais-data.js`       | `editais-logic.js`              | `editais-styles.css`         |
| Meu Progresso (endereço `/p/meus-premios.html`) | `premios-data.js` | `premios-logic.js` | `diario-styles-v2.css` + `premios-styles.css` |
| Meus Grupos                  | —                       | `meus-grupos-logic.js`          | `diario-styles-v2.css`       |
| Ranking de Informativos      | —                       | `ranking-informativos-logic.js` | `diario-styles-v2.css`       |

O **Diário de Leis** não segue mais o modelo "HTML pronto + script preenche":
a página no Blogger só tem o esqueleto (`#select-edital`, `#select-estado`,
`#input-busca-lei`, `#grid-leis-federais`, `#grid-leis-estaduais`) e o
`leis-logic.js` monta tudo o resto sozinho, inclusive o `<div id="account-panel">`
do login (a página não tem mais isso pronto no HTML). Ele filtra as leis por
edital/carreira escolhido em `editais-data.js` (todas as federais + só as
estaduais do estado certo) e cada lei tem uma caixinha "Já li esta lei", que
grava em `localStorage.leis-lidas` e sincroniza com a conta, na mesma chave
que `premios-logic.js` já usa para calcular os prêmios de Leis.

O **Diário das Decisões** (`rg-repetitivos-logic.js`) também criou seu
próprio `#account-panel` pelo mesmo motivo: a página não tinha nenhum jeito
de entrar com a conta Google antes.

### Arquivos compartilhados

- **`estudamana-tokens.css`**: cores, fontes, tamanhos e larguras de todo o site
  (tema claro e escuro). Para mudar o visual do site inteiro, mexa aqui.
  Os outros CSS o carregam pela primeira linha (`@import`).
- **`estudamana-header.js` / `.css`**: menu de navegação no topo, montado a partir
  das Páginas publicadas no Blogger. Vai uma única vez no tema do Blogger.
- **`cards-shared.css`**: visual de card das linhas dos Diários.
- **`grupos-shared.js`**: estudo coletivo (grupos).
- **`editais-shared.js`**: edital principal escolhido pela pessoa.
- **`conta-google.js` / `conta-email.js`**: login opcional (Google ou e-mail) para
  guardar o progresso em qualquer aparelho (Firebase). O que a conta Google
  sincroniza/junta entre aparelhos está na lista `MAP_DOCS` de
  `conta-google.js`: hoje cobre Informativos, Leis, Súmulas, Resoluções e
  Decisões/Repetitivos, além dos prêmios/conquistas. Ao acrescentar um
  diário novo com progresso próprio, lembrar de incluir o par
  `{ path: "progress-X/", local: "X-lidos" }` ali — senão o progresso desse
  diário não é migrado quando alguém troca de conta Google entre aparelhos.

Cada arquivo traz no topo um comentário explicando o funcionamento e as opções.

## Automação

Workflows do GitHub Actions (pasta `.github/workflows/`):

- **`limpar-cache-jsdelivr.yml`**: a cada push no `main`, pede ao jsDelivr
  para buscar de novo **só os arquivos alterados** (.js/.css/.json), 1 e 3
  minutos depois do envio (limpar tudo a cada envio fazia o jsDelivr recusar
  por excesso). Pelo botão "Run workflow", limpa todos.
- **`dividir-dados-por-ano.yml`**: a cada envio de `controleconst/adi_dados.js`
  ou `reclamacoes/reclamacoes-data.js`, gera as pastas `anos/` (um arquivo
  por ano) com `scripts/dividir_por_ano.py`.
### Robôs que rodam no Mac (conexão no Brasil)

O TST (e a JusLaboris, que é do TST) não responde aos servidores do GitHub.
Por isso estes robôs rodam no Mac, toda segunda às 9h
(`~/Library/LaunchAgents/br.com.estudamana.atualizar-tst.plist` →
`~/EstudaMana/atualizar-tst.sh` → `scripts/rodar_no_mac.sh`):

- **`scripts/atualizar_tst.py`**: Súmulas do TST (bloco `tst` de
  `sumulas-data.js`) e OJs, Precedentes Normativos e temas de IRR
  (`tst/decisoes.json`, Diário das Decisões).
- **`scripts/atualizar_csjt.py`**: Resoluções e Recomendações do CSJT em vigor
  (bloco `csjt` de `normas-data.js`).
- **`scripts/atualizar_csmpt.py`**: Resoluções do CSMPT/MPT (bloco `csmpt` de
  `normas-data.js`).

### Informativos (STF, STJ, TSE, CNJ, TST, CNMP) — no Mac, só quando você manda

STF, STJ, TSE e TST recusam os servidores do GitHub (403 ou sem resposta;
testado em 28-29/09/2026). Por isso a verificação dos Informativos roda no
Mac, **sem agendamento**: uma vez por semana, dê dois cliques em
**`Atualizar Informativos.command`** (raiz do repositório, no Finder). Ele
atualiza o repositório com o `main`, roda `scripts/atualizar_informativos.py`
e, se houver edição nova, grava em `diario-data.js` e envia para o `main` (o
que já dispara a limpeza do cache do jsDelivr). As edições novas entram com
súmula "a confirmar".

Cada tribunal é conferido separadamente (o comentário no topo do script
explica de onde vem cada um). Se um falhar, os outros são gravados e
enviados e a janela diz qual falhou. Para rodar só alguns:
`python3 scripts/atualizar_informativos.py STJ TSE`.

O STJ é lido pelo feed oficial (InformativoFeed), com todas as edições numa
consulta só. STJ e TSE recusam (403) qualquer programa, mesmo do Brasil: para eles o
script abre a página pelo **Google Chrome do Mac**, em modo invisível e com
um perfil temporário (não mexe no Chrome que estiver aberto).

**Jurisprudência em Teses (STJ)**: o mesmo comando lê o feed das edições e,
de cada edição, a página com as teses (`doc.jsp?livre='285' INPATH(TIT)`).
Cada tese vira um card no Diário das Decisões, com o texto completo, a matéria,
o julgado mais recente e a legislação citada — tudo em `stj/teses.json`, que a
página carrega junto com o TST. Edições novas entram na hora; o histórico
(~285 edições) entra aos poucos, 30 edições por execução. Para trazer todo o
histórico de uma vez (demora, pode passar de uma hora):
`python3 scripts/atualizar_informativos.py TESES --tudo` e depois o `.command`
para enviar.

O script também completa a cadeia de certificados HTTPS quando o servidor
não manda o intermediário (caso do STF).

Para incluir outra fonte que precise de conexão no Brasil, acrescente o robô
em `scripts/rodar_no_mac.sh`. Log: `~/EstudaMana/atualizar-tst.log`.

## Backups

Cópias do HTML das páginas do Blogger ficam fora deste repositório (pasta
"Backups Blogger").
