# Como publicar o Diário de Auditoria no Blogger

O Diário de Auditoria e Contabilidade Pública usa o mesmo código do Diário das Resoluções
(`normas-logic.js`), com outros dados (`auditoria-data.js`) e outra configuração (`auditoria-logic.js`).

## Passo a passo (uma vez só)

1. No Blogger, abra a página **Diário das Resoluções** e use **Duplicar** (ou copie o HTML dela para uma
   página nova).
2. Na página nova, defina o endereço **`/p/diario-de-auditoria.html`** (é o que `auditoria-logic.js` espera
   nos links "abrir" dos Meus Cadernos) e o título **Diário de Auditoria**.
3. No HTML dela, troque os dois scripts:
   - `normas-data.js` → `auditoria-data.js`
   - `normas-logic.js` → `auditoria-logic.js`
   (o resto — `grupos-shared.js`, `conta-email.js` etc. — fica igual). Se o HTML carrega os arquivos com
   `fetch`, troque os nomes do mesmo jeito.
4. Publique. O menu do site mostra a página sozinho (ordem alfabética).
5. Publique também as regras do banco: `firestore.rules` ganhou a coleção `progress-auditoria`
   (Firebase > Firestore > Regras). Sem isso o progresso só fica salvo no navegador.

## O que muda no resto do site (já feito no repositório)

- Progresso no navegador: `auditoria-lidas`; avatar: `auditoria-avatar`.
- Progresso na conta: coleção `progress-auditoria` (`conta-google.js`, `fontes-pagina.js`,
  `scripts/juntar-contas-anonimas.mjs`).
- Estudo coletivo: campo `lidasAuditoria` (`grupos-shared.js`, `meus-grupos-logic.js`).
- Ainda **não** entra nos prêmios de Meus Estudos (`premios-logic.js`) nem na contagem do cronograma.

## Como acrescentar normas

Edite `auditoria-data.js`: cada órgão tem `normas: [{ tipo, numero, ementa, link }]`. Para um órgão novo,
acrescente o bloco e a chave em `AUDITORIA_ORG_ORDER`. Quando o `numero` não começa por dígito
(ex.: "Estrutura Conceitual (R1)"), a página mostra "NBC TSP Estrutura Conceitual (R1)", sem "nº".
