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
| Diário das Resoluções        | `normas-data.js`        | `normas-logic.js`               | `diario-styles-v2.css`       |
| Diário das Decisões (RG e Repetitivos) | `rg-repetitivos-data.js` | `rg-repetitivos-logic.js` | `rg-repetitivos-styles.css` |
| Editais                      | `editais-data.js`       | `editais-logic.js`              | `editais-styles.css`         |
| Meus Prêmios                 | `premios-data.js`       | `premios-logic.js`              | `diario-styles-v2.css` + `premios-styles.css` |
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

Dois workflows do GitHub Actions (pasta `.github/workflows/`):

- **`limpar-cache-jsdelivr.yml`**: a cada push no `main` (ou pelo botão
  "Run workflow"), pede ao jsDelivr para buscar de novo todos os `.js`/`.css`
  da raiz. Sem isso, uma correção enviada ao `main` podia demorar horas para
  aparecer no site.
- **`atualizar_informativos.yml`**: roda toda segunda-feira de manhã (ou pelo
  botão "Run workflow") e chama `scripts/atualizar_informativos.mjs`, que
  confere se saiu um novo Informativo do STF (pelo número seguinte ao último
  registrado em `diario-data.js`) e usa a API do Gemini (`GEMINI_API_KEY`,
  segredo do repositório) para gerar um resumo preliminar. **Hoje ele só
  registra um comentário no topo de `diario-data.js`** avisando da nova
  edição — não chega a acrescentar a edição de verdade na lista (isso ainda
  precisa ser feito à mão, como sempre foi). Só cobre o STF por enquanto.

## Backups

Cópias do HTML das páginas do Blogger ficam fora deste repositório (pasta
"Backups Blogger").
