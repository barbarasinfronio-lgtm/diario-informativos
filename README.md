# Estuda Mana — arquivos do site

Código (JS e CSS) das páginas de estudo do [Estuda Mana](https://www.estudamana.com.br),
um site no Blogger. O Blogger carrega o código **do GitHub Pages** deste repositório
(`https://barbarasinfronio-lgtm.github.io/diario-informativos/`): o tema tem
um pequeno script que busca `estudamana-header.js` com `fetch(..., {cache:'no-cache'})`
(se falhar, usa `<script src>`), e o cabeçalho carrega o resto do mesmo endereço.

> **Atenção:** tudo o que entra na branch `main` vai para o ar. O robô
> `publicar-pages.yml` (ver [Automação](#automação)) publica o `main` a cada
> envio; a mudança aparece em poucos minutos, sem cache para limpar.

## Como o repositório está organizado

```
site/            código das páginas (JS e CSS), uma pasta por tema:
  layout/          cabeçalho, cores e visual de card (estudamana-header, estudamana-tokens, cards-shared)
  conta/           login e nuvem: conta-google, conta-email, nuvem-shared, grupos-shared, meus-grupos-logic
  leis/            Diário de Leis e Resoluções: leis-*, normas-*
  decisoes/        Diário dos Informativos e Diário das Decisões: diario-*, rg-repetitivos-*, ranking-informativos-logic
  sumulas/         Diário das Súmulas: sumulas-*
  editais/         Editais: editais-*
  provas/          Estatísticas de cobrança em provas: estatisticas-provas-*
  estudos/         Meus Estudos: premios-*, revisoes
  cadernos/        Meus Cadernos (destaques e anotações): cadernos*
  cronograma/      Meu Cronograma (plano de estudos semestral/anual): cronograma-*
  paginas/         páginas avulsas (Fontes e aviso)
scripts/         robôs que atualizam os dados (Python/Node) — rodam no Mac ou no GitHub
*.command        atalhos de duplo clique para os robôs do Mac
.github/         robôs do GitHub Actions (publicar, gerar dados leves, dividir por ano)
leis/ stf/ stj/ tst/ informativos/ controleconst/ reclamacoes/ provas/ leve/ curadoria/
                 dados (JSON), uma pasta por assunto
firestore.rules  regras do banco da conta
```

**Os endereços do site não mudaram.** O robô `publicar-pages.yml` copia os arquivos de
`site/<tema>/` para a raiz do que vai ao ar, então o Blogger e os arquivos se chamam pelos
mesmos nomes de sempre (`.../diario-informativos/leis-logic.js`). Por isso **os nomes dos arquivos
em `site/` não podem se repetir**, e `<script src>` e `fetch` dentro do código continuam usando só o
nome do arquivo (sem a pasta). Já os robôs (`scripts/`) leem e gravam os arquivos pelo caminho do
repositório (`site/leis/leis-data.js`).

## Páginas e arquivos

Nesta seção, os nomes de arquivo aparecem sem a pasta; ache cada um dentro de `site/<tema>/`.

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
| Meus Estudos (antes Meu Progresso; endereço `/p/meus-premios.html`) | `premios-data.js` | `premios-logic.js` | `diario-styles-v2.css` + `premios-styles.css` |
| Meus Grupos                  | —                       | `meus-grupos-logic.js`          | `diario-styles-v2.css`       |
| Ranking de Informativos      | —                       | `ranking-informativos-logic.js` | `diario-styles-v2.css`       |
| Estatísticas de cobrança (provas) | `provas/cobrancas.json` | `estatisticas-provas-logic.js` | `estatisticas-provas.css` |
| Meu Cronograma (`/p/meu-cronograma.html`) | `leve/cronograma.json` (gerado por `scripts/gerar_cronograma.js`) | `cronograma-logic.js` | `cronograma-styles.css` |

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

- **`publicar-pages.yml`**: a cada push no `main` (e quando os outros robôs
  terminam, e de hora em hora), publica o repositório no GitHub Pages — é de lá
  que o site carrega código e dados.
- **`gerar-leves.yml`**: limpa decisões sem conteúdo e gera a pasta `leve/`
  (`scripts/gerar_leves.js`) quando os dados do Diário das Decisões mudam.
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

### Informativos (STF, STF PV, STJ, STJ Extra, TSE, CNJ, TST, CNMP) — no Mac, só quando você manda

STF, STJ, TSE e TST recusam os servidores do GitHub (403 ou sem resposta;
testado em 28-29/09/2026). Por isso a verificação dos Informativos roda no
Mac, **sem agendamento**: uma vez por semana, dê dois cliques em
**`Atualizar Informativos.command`** (raiz do repositório, no Finder). Ele
atualiza o repositório com o `main`, roda `scripts/atualizar_informativos.py`
e, se houver edição nova, grava em `diario-data.js` e envia para o `main` (o
que já dispara a publicação no GitHub Pages). As edições novas entram com
súmula "a confirmar".

As **leis** têm arquivo próprio, para rodar todo dia: **`Atualizar Leis.command`**
(mesma pasta). Ele confere no Planalto as leis do acervo, anota as alterações
(e a data da última alteração de cada lei) em `leis/alteracoes.json` e envia
para o `main`; o site mostra em Meus Estudos > Novidades legislativas ("Leis alteradas").
Cada rodada tem tempo máximo de 20 minutos; o que sobrar fica para a próxima,
começando pelas leis conferidas há mais tempo. O `Atualizar Informativos.command`
não confere mais as leis (só o `Atualizar Leis.command`).

**Leia-me (texto das leis)**: na mesma conferência, o robô guarda o texto de
cada lei do Planalto em `leis/texto/<id>.json` (o `<id>` é o caminho do link do
Planalto, sem `/ccivil_03/` e `.htm`, em minúsculas e com `-`), e a lista do que
existe em `leis/texto/indice.json`. No Diário de Leis, as leis que têm texto
ganham o botão **📜 Leia-me**, que abre o texto dentro do próprio card
(`leis-logic.js`). O arquivo só é regravado quando o texto muda. Leis que não
são do Planalto (LexML, Legisweb, estaduais) ainda não têm texto: a lista está em
`leis/FALTAM-NO-PLANALTO.md`.

Cada tribunal é conferido separadamente (o comentário no topo do script
explica de onde vem cada um). Se um falhar, os outros são gravados e
enviados e a janela diz qual falhou. Para rodar só alguns:
`python3 scripts/atualizar_informativos.py STJ TSE`.

O STJ é lido pelo feed oficial (InformativoFeed), com todas as edições numa
consulta só. STJ e TSE recusam (403) qualquer programa, mesmo do Brasil: para eles o
script abre a página pelo **Google Chrome do Mac**, em modo invisível e com
um perfil temporário (não mexe no Chrome que estiver aberto).

**STF PV** (Plenário Virtual em Evidência) e **STJ Extra** (edições
extraordinárias do Informativo do STJ, "33E") têm abas próprias no Diário
(`STFPV_DATA` e `STJX_DATA`). O PV é lido da página da série no portal do STF
(os PDFs têm nomes variados; número e ano vêm do nome do arquivo). As
extraordinárias são conferidas pela página de cada edição; na primeira
execução o robô completa o histórico que faltar. Para rodar só elas:
`python3 scripts/atualizar_informativos.py STF-PV STJ-EXTRA`.

**Jurisprudência em Teses (STJ)**: o mesmo comando lê o feed das edições e,
de cada edição, a página com as teses (`doc.jsp?livre='285' INPATH(TIT)`).
Cada tese vira um card no Diário das Decisões, com o texto completo, a matéria,
o julgado mais recente e a legislação citada — tudo em `stj/teses.json`, que a
página carrega junto com o TST. Edições novas entram na hora; o histórico
(~285 edições) entra aos poucos, 30 edições por execução. Para trazer todo o
histórico de uma vez (demora, pode passar de uma hora):
`python3 scripts/atualizar_informativos.py TESES --tudo` e depois o `.command`
para enviar.

**Leis alteradas depois de lidas**: o mesmo comando confere, no texto
compilado do Planalto, as leis mais cobradas (lista `LEIS_MONITORADAS` em
`scripts/atualizar_informativos.py`: CF, CP, CPP, CC, CPC, CLT, CTN, CDC, ECA,
LEP, 8.112, LIA, 14.133, 9.784, LINDB, Drogas, Maria da Penha, Hediondos,
LRF, 9.099, ACP, MS, LGPD, 8.213, LEF e Orcrim). Cada norma alteradora nova
("Redação dada pela…", "Incluído pela…", "Revogado pela…") é gravada em
`leis/alteracoes.json` com a data em que foi percebida. A página **Meu
Progresso** mostra um aviso quando uma lei marcada como lida no Diário de
Leis foi alterada depois da leitura ("Já revisei" esconde o aviso neste
navegador). Na primeira execução o robô só anota o que já existe.

Alguns endereços (o `scon.stj.jus.br` das Teses, em 09/2026) barram até o
Chrome invisível. Nesse caso o script usa o **Chrome de verdade** do Mac, por
AppleScript: abre uma janela, lê a página e fecha no fim. Precisa, uma vez só,
ativar no Chrome o menu **Visualizar > Opções do desenvolvedor > Permitir
JavaScript de eventos da Apple** e deixar o Terminal controlar o Chrome
(o macOS pergunta na primeira vez).

O script também completa a cadeia de certificados HTTPS quando o servidor
não manda o intermediário (caso do STF).

Para incluir outra fonte que precise de conexão no Brasil, acrescente o robô
em `scripts/rodar_no_mac.sh`. Log: `~/EstudaMana/atualizar-tst.log`.

## Backups

Cópias do HTML das páginas do Blogger ficam fora deste repositório (pasta
"Backups Blogger").

## Cobrança em provas

`provas/cobrancas.json` diz em quais provas de concurso cada súmula/decisão
já caiu. Ele é gerado por `scripts/cobrancas_provas.py <pasta com .txt>` a
partir do texto das provas (um .txt por prova, nome com banca, ano e órgão;
gabaritos são ignorados). O Diário das Súmulas e o Diário das Decisões mostram
"📝 Cobrada em …" nos cards, e a página de estatísticas usa o mesmo arquivo.

Pastas lidas dentro de `Provas/` (no Mac): `01 Objetivas`, `02 Discursivas`, `03 Sentenças`, `04 Oral`,
`ENAM` e `Provas anteriores da FGV - Magistratura/` (subpastas `Provas de 1ª fase`, `Provas de 2ª fase` e
`Provas de 2ª fase - Outras bancas`, e dentro delas uma pasta por concurso, como `TJMT - Aplicada em 16-11-24`
ou `TJSC - 2025`). Nessa última, a etapa vem da subpasta (1ª fase = objetiva) e do nome do arquivo
("sentença" = prova de sentença; o resto da 2ª fase = discursiva; espelhos de correção valem, gabaritos da 1ª fase não).

## "Com julgados" (Diário de Leis, teste)

Ao lado do botão "Leia-me" de uma lei aparece "⚖️ Com julgados": o texto da lei com, ao lado do artigo (ou do §), um número
por decisão do site que trata dele — no máximo 2 por artigo; o número leva ao Diário das Decisões com a busca naquela decisão.
`scripts/gerar_julgados_por_artigo.js` lê as decisões (repercussão geral, repetitivos, Jurisprudência em Teses, decisões extras do STF,
ADI/ADPF/ADC/ADO e julgados dos informativos), acha onde cada uma cita a lei e grava `leis/julgados/<id do texto>.json`
(+ `indice.json`, que diz quais leis têm o botão). Hoje só a Lei 13.105/2015 (CPC); para outra lei, acrescente uma entrada em
`LEIS_PILOTO` no script. As indicações são automáticas — confira a decisão.

## Informativos em cards (Diário das Decisões)

O grupo "Informativos" do Diário das Decisões mostra cada julgado dos
informativos do STJ (592 em diante) e do STF (1000 em diante) como um card:
tese, tema, processo e o resumo completo ao abrir. Gerado por
`scripts/informativos_cards.py todos_informativos_consolidados.json`, que tira
as repetições e grava `informativos/indice.json` (lista leve, baixada só ao
abrir o grupo ou buscar) e `informativos/c/NNN.json` (resumos, 250 por
arquivo, baixados ao abrir o card). Os informativos antigos do STF (.htm,
1 a 999) ainda não entram: os julgados vieram num texto único.

## Tema claro / escuro

`estudamana-header.js` põe um botão ☾/☀ ao lado de "A− A A+". A escolha
fica em `localStorage["estudamana-tema"]` e vira `data-theme` no `<html>`;
sem escolha, o site segue o sistema (`estudamana-tokens.css`).
