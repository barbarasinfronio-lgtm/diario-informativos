# Estuda Mana — arquivos do site

Código (JS e CSS) das páginas de estudo do [Estuda Mana](https://www.estudamana.com.br),
um site no Blogger. As páginas do Blogger carregam estes arquivos direto deste
repositório pelo jsDelivr:

```html
<script src="https://cdn.jsdelivr.net/gh/barbarasinfronio-lgtm/diario-informativos@main/estudamana-header.js"></script>
```

> **Atenção:** como as páginas apontam para `@main`, tudo o que entra na branch
> `main` vai para o ar (o jsDelivr pode levar algumas horas para atualizar o cache).

## Páginas e arquivos

Cada página usa um par **`*-data.js`** (os dados) + **`*-logic.js`** (o comportamento).
O arquivo de dados precisa ser carregado **antes** do de lógica.

| Página                       | Dados                   | Lógica                          | Estilo                       |
|------------------------------|-------------------------|---------------------------------|------------------------------|
| Diário dos Informativos      | `diario-data.js`        | `diario-logic.js`               | `diario-styles-v2.css`       |
| Diário de Leis               | `leis-data.js`          | `leis-logic.js`                 | `diario-styles-v2.css`       |
| Diário das Súmulas           | `sumulas-data.js`       | `sumulas-logic.js`              | `diario-styles-v2.css`       |
| Diário das Resoluções        | `normas-data.js`        | `normas-logic.js`               | `diario-styles-v2.css`       |
| Diário das Decisões (RG e Repetitivos) | `rg-repetitivos-data.js` | `rg-repetitivos-logic.js` | `rg-repetitivos-styles.css` |
| Editais                      | `editais-data.js`       | `editais-logic.js`              | `editais-styles.css`         |
| Meus Prêmios                 | `premios-data.js`       | `premios-logic.js`              | `diario-styles-v2.css` + `premios-styles.css` |
| Meus Grupos                  | —                       | `meus-grupos-logic.js`          | `diario-styles-v2.css`       |
| Ranking de Informativos      | —                       | `ranking-informativos-logic.js` | `diario-styles-v2.css`       |

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
  guardar o progresso em qualquer aparelho (Firebase).

Cada arquivo traz no topo um comentário explicando o funcionamento e as opções.

## Backups

Cópias do HTML das páginas do Blogger ficam fora deste repositório (pasta
"Backups Blogger").
