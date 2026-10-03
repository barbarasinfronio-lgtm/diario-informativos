# Checkpoint da curadoria — 3 de outubro de 2026

## Escopo e regras confirmadas

- Branch de trabalho: `curadoria-reclamacoes-2026-10-02`. `main` não foi alterada nem recebeu merge.
- Preservar cada decisão e etapa processual. Não deduplicar por nome de arquivo, número de processo, data ou classe isoladamente. Usar identificador interno e comparar texto, classe, órgão julgador e data; conservar variantes conflitantes.
- STF e STJ ficam em conjuntos separados. A classificação do tribunal deve vir do conteúdo e dos metadados internos, não do nome da pasta ou arquivo.
- Decisões publicadas em Informativo são prioritárias para estudo. Também priorizar fixação de tese, explicação de regra, exceção, distinção, efeito temporal, evolução jurisprudencial e resolução de divergência. Aplicação simples de tese fica em categoria própria; nenhum conteúdo é apagado.
- A triagem automática não equivale a validação humana. A porcentagem global só deve ser calculada depois de resolver identidades repetidas entre fontes.

## Código de curadoria já salvo no branch

Os commits anteriores `8f0ccef` e `2fe6a59` ajustaram a curadoria de teste com as confirmações da usuária. A classificação usa uma janela de fundamentos em embargos declaratórios, evita tratar fórmula genérica de EDcl como tese nova e inclui sinais de distinção, aplicação concreta e divergência. Os dez exemplos STJ confirmados pela usuária ficaram na categoria de estudo no classificador. A página organiza os resultados em abas sem excluir registros.

Não houve edição de código neste turno. O último estado conhecido do branch antes deste checkpoint estava limpo e sincronizado com `origin/curadoria-reclamacoes-2026-10-02`.

## Camadas processadas

### JSON SCON do STJ

- 850 arquivos JSON encontrados; 815 têm o esquema SCON esperado.
- 271.920 linhas brutas. A deduplicação anterior por identidade interna e variante de conteúdo produziu 150.622 variantes em 150.619 IDs; 3 IDs têm variantes conflitantes.
- Triagem automática anterior: 37.421 sem conteúdo específico identificado; 61.749 revisão humana; 14.786 prioritárias; 36.521 aplicação de tese; 145 essenciais.
- Cerca de 41% ficaram sinalizadas para revisão humana. Isso não significa que as demais tenham sido validadas por uma pessoa.
- Dois arquivos de 29/02/2024 não abriram como JSON.
- Uma recontagem independente por um conjunto mais amplo de campos produziu 150.641, diferença de 19 variantes. **Resolver a regra canônica dessa diferença antes de usar qualquer denominador global.**
- 9.852 valores de `numeroRegistro` foram reutilizados por identidades internas distintas na extração anterior; esse campo sozinho não é chave de decisão.

### Textos STJ de janeiro de 2021

- 3.750 arquivos `.txt` são duas árvores espelhadas; correspondem a 1.875 `SeqDocumento` e 1.875 textos distintos.
- 1.507 IDs têm metadados correspondentes; 29 linhas de metadados não têm texto.
- 368 textos de 20, 21, 22 e 25/01 não têm metadados locais.
- Há dois pares de textos integrais idênticos associados a processos diferentes. Preservar os quatro registros.
- Metadados não informam a Turma; não inferir órgão julgador pelo ministro.

### PDFs do STJ

- 1.213 arquivos abertos e texto integral extraído: 46.691 páginas e aproximadamente 87,6 milhões de caracteres.
- Há acórdãos, Informativos, boletins, súmulas, Jurisprudência em Teses e materiais de precedentes. A classificação automática por conteúdo ainda precisa ser consolidada por unidade documental e ligada aos registros estruturados.
- Uma detecção textual preliminar encontrou referências internas a 831 números de Informativo, de 1 a 897, com repetições e lacunas. É contagem de PDFs/fontes, não de decisões únicas; não concluir que todas as lacunas sejam edições publicadas ausentes.

### STF HTML e PDFs

- 999 páginas HTML identificam internamente os Informativos 1–999 sem lacunas.
- 236 PDFs STF examinados pelo conteúdo; 234 hashes binários distintos. Há cópias exatas das edições 1.100 e 1.200.
- O conteúdo identifica 227 edições numeradas distintas de Informativo entre a edição especial 1.000 e a 1.227. A edição 1.226 não aparece nesta pasta; verificar publicação antes de chamá-la de download faltante.
- Há também decisões STF em PDF (incluindo RE 1.366.243, RE 566.471, PSV 125/SV 63 e ADPF 622). O arquivo chamado `adpf 662.pdf` identifica internamente ADPF 622.
- `STFSúmula 320.pdf` não tem texto extraível e segue pendente de leitura.

### Outros PDFs e coleções de precedentes

- 872 PDFs fora das árvores `Juris/STF` e `Juris/STJ`; 869 abriram, totalizando 4.164 páginas e cerca de 4,94 milhões de caracteres. Três arquivos de 125 KB, 336 KB e 31 MB são preenchidos por bytes zero e não são PDFs legíveis.
- A pasta `Juris/RR` contém 105 boletins cujo conteúdo diz **STF — “Repercussão Geral em pauta”**. Não classificar como STJ. O número/ano interno aponta 97 edições entre 2017 e 2019; há candidatos a lacunas nas edições 20/2017 e 28/2018. O PDF `Edio20.pdf` identifica internamente edição 19/2017, então validar antes de declarar a edição 20 ausente.
- `Juris/PVemEvidencia` contém 45 pautas do Plenário Virtual do STF, sobretudo 2026. São itens em julgamento/agendados, não decisões já julgadas; manter em grupo próprio.
- A pasta de súmulas tem 715 PDFs e mistura materiais STF, STJ e outros tribunais. Só 20 têm texto extraível; 695 são imagem sem camada textual. Uma tentativa local de OCR falhou (`Vision nilError`) em todas as páginas. Não atribuir tribunal nem número definitivo apenas pelo nome do arquivo; pendente localizar outro meio de OCR.
- Foram encontrados 5 grupos de PDFs binariamente idênticos nesta camada, entre eles cópias de edições da série “Repercussão Geral em pauta”. Conservar caminhos de origem e contar cópias exatas uma vez por conteúdo, sem colapsar decisões diferentes.

### JSON consolidado de Informativos e pautas

- `Juris/todos_informativos_consolidados.json`: 1.713 itens declarados, 1.655 com tribunal STF e 58 com STJ. O conteúdo mostra desalinhamentos: 60 “Registro Avulso” vieram de um edital de concurso; 22 itens têm sinal de conflito entre o rótulo de tribunal e o texto; validar antes de contar.
- 1.086 itens são “Plenário Virtual em Evidência” e devem ficar separados de decisões julgadas; 567 aparecem como “Repercussão Geral / Repetitivos”.
- Os arquivos consolidados de `RR` (105) e `PVemEvidencia` (45) identificam internamente STF. Referências a precedentes de outro tribunal não mudam o tribunal da decisão/pauta que está sendo descrita.

### CSV

- 42 arquivos; 30 conteúdos binários distintos, com 6 grupos de cópias exatas.
- Tabelas grandes do STF contêm metadados/eventos de decisão, com identificador `idFatoDecisao`, órgão, data, classe e andamento, mas não o inteiro teor. Quatro extratos distintos cobrem blocos de datas diferentes; as linhas e os IDs ainda precisam ser reconciliados entre arquivos antes de contar decisões.
- Tabelas de temas/processos do STJ e do STF também funcionam como índices de precedentes, não como decisões completas.

### Dados do site já inventariados em etapa anterior

- Base STF: 20.394 reclamações e 6.861 processos de controle concentrado.
- Índice de Informativos: 5.735 itens indexados e 5.791 corpos de texto, com 56 corpos sem linha no índice.
- Índice de acórdãos STJ: 15.152 itens e 19.824 corpos, com 4.672 corpos sem linha correspondente.
- Esses números têm sobreposição com os dados brutos e não devem ser somados como se fossem decisões únicas.

## Pendências em ordem de retomada

1. Resolver a diferença de 19 variantes STJ com uma regra reproduzível de identidade/conteúdo; calcular cobertura SCON por Turma/Seção e mês com identidade única.
2. Relacionar Informativos STF e STJ às decisões correspondentes por processo + data + órgão/classe e conteúdo, preservando decisões distintas no mesmo processo.
3. Reconciliar os quatro grandes extratos CSV do STF por `idFatoDecisao`; separar decisão, andamento e metadado de processo.
4. Terminar a leitura do conteúdo dos arquivos de planilha (72 XLSX, 23 ODS), DOCX e MHTML. A leitura ampla de XLSX foi interrompida por arquivos grandes; há inventário anterior de 63 conteúdos XLSX distintos e 9 cópias exatas.
5. Encontrar um OCR utilizável para os PDFs de súmulas e revisar os arquivos sem texto/corrompidos.
6. Consolidar a triagem automática de todas as fontes, sem chamar triagem de revisão humana, e calcular percentuais por fonte e no total de identidades reconciliadas.
7. Montar a cobertura baixada por STF/STJ, classe/órgão julgador e período. Marcar lacunas como candidatas até confirmar que o respectivo documento foi publicado.

## Guia de retomada para outra IA

### Objetivo do trabalho

Continuar a curadoria experimental das decisões para estudo, sem alterar a lógica publicada em `main`. O usuário quer manter todos os registros e acrescentar organização em abas/categorias. A prioridade é identificar conteúdo que ensina algo juridicamente reutilizável; não é simplesmente premiar decisões procedentes nem excluir aplicações.

### Onde retomar

- Repositório local: `/Users/barbarasinfronio/Documents/Codex/2026-10-02/referenced-chatgpt-conversation-this-is-an/repo-test-branch`.
- Branch e upstream: `curadoria-reclamacoes-2026-10-02` / `origin/curadoria-reclamacoes-2026-10-02`.
- Checkpoint commitado e enviado: `7aac362 Save curation processing checkpoint`.
- Corpus bruto (somente leitura): `/Users/barbarasinfronio/Library/CloudStorage/GoogleDrive-barbara.sinfronio@gmail.com/Outros computadores/DELL/IA/Dados brutos/`.
- Mudanças de código já discutidas estão em `reclamacoes/curadoria.html` e `reclamacoes/curadoria-test-stj-2026-standalone.html`. Ler a função `score(x)` e os arrays de sinais antes de recalcular classificações; não voltar a uma versão antiga do classificador.
- O clone usa sparse checkout. Para consultar índices versionados sem materializar milhares de arquivos, `git show HEAD:informativos/indice.json` e `git show HEAD:stj/acordaos/indice.json` funcionam. `git ls-tree -r --name-only HEAD` mostra os caminhos versionados.

### Identidade e proteção contra falsa deduplicação

1. **STJ SCON JSON:** chave principal `id`; examinar variantes de corpo para os 3 IDs conflitantes. A chave precisa reproduzir a contagem anterior de 150.622 variantes antes de publicar totais. Não usar `numeroRegistro` sozinho: há reutilização.
2. **STJ TXT:** `SeqDocumento` identifica o arquivo-fonte, mas decisões com o mesmo texto podem ter processos diferentes. Guardar processo/classe/data/órgão e não colapsar os dois pares de texto idêntico.
3. **STF CSV de eventos:** `idFatoDecisao` é chave interna dos extratos de decisão. As quatro listas grandes têm conjuntos de IDs disjuntos entre si. Usar processo, data, classe e órgão para relacionar outras tabelas; uma linha pode ser andamento/evento, não decisão de mérito.
4. **Informativos:** usar tribunal + número interno da edição + item/processo + texto. Uma edição contém vários julgados; não contar a edição como uma única decisão nem transformar citação de precedente de outro tribunal em troca do tribunal de origem.
5. **PDF:** hash binário identifica cópia exata; para decisões diferentes, comparar número interno, classe, data, colegiado e conteúdo. Nome do PDF nunca é identidade suficiente.
6. **STF/STJ:** o diretório `Juris/RR` é STF segundo o próprio texto; `Súmulas` é coleção de vários tribunais; validar cada item por conteúdo sempre que possível.

### Índices do site já confirmados pelo conteúdo

- `informativos/indice.json`: 5.735 itens, 4.483 STJ e 1.252 STF. Os campos são `id, orgao, informativo, area, titulo, tese, processo, data, parte`. Faltam número de edição em 16 itens, processo em 260, data em 299 e parte em 250. `orgao` contém o tribunal. Como o usuário disse que tudo que saiu em Informativo é importante, todos os itens dessa coleção devem ser `essential`, inclusive quando falta processo/data.
- `stj/acordaos/indice.json`: 15.152 linhas e campos `id, processo, orgao, relator, data, area, titulo, resultado, registro, parte`. 300 sem resultado e 35 sem parte. `orgao` é o colegiado; não confundir com `titulo` (posição 7 do vetor).
- Os corpos e índices não têm correspondência 1:1: há 19.824 corpos de acórdãos para 15.152 linhas (4.672 sem linha) e 5.791 corpos de Informativos para 5.735 linhas (56 sem linha). Corpos órfãos ficam preservados e em revisão, não descartados.
- Na base de Informativos, a separação de tribunal interna funciona (`orgao` = STF/STJ). O classificador existente reconhece fonte/tipo de Informativo como essencial. Para decisões individuais fora dessa coleção, só atribuir o selo de Informativo se houver relação textual/estruturada validada.

### Estado das quatro exportações CSV de eventos STF

Quatro CSVs com `idFatoDecisao`, classe, órgão, data e andamento foram lidos; os conjuntos de IDs são disjuntos:

| Exportação (prefixo interno do arquivo) | Linhas/IDs distintos | Período da data da decisão |
| --- | ---: | --- |
| `ad1a4f3d…` | 227.272 | 2010–2014 |
| `022240be…` | 227.272 | 2020–2024 |
| `42c326bb…` | 118.132 | 2025 |
| `aa669523…` | 87.462 | 2026 |

Esses 660.138 registros não são 660.138 decisões únicas confirmadas: são linhas de exportação de fatos decisórios e ainda precisam ser separadas por tipo/etapa. A ausência de 2015–2019 é uma lacuna **nesses quatro extratos específicos**, não prova de que o acervo do STF esteja faltando nesses anos.

### Saída esperada quando a tarefa for concluída

- Um denominador global reconciliado de decisões únicas, com tribunais preservados.
- Percentual em triagem automática, percentual de prioridades e percentual pendente de revisão humana, informados separadamente; nunca chamar triagem automática de análise humana.
- Inventário de fontes já baixadas e lacunas candidatas por tribunal, classe/órgão e mês/ano. Confirmar publicação antes de apresentar uma lacuna como documento que falta baixar.
- Avançar sem pedir nova confirmação para escolhas já definidas. Continuar avisos curtos `[TRABALHANDO]`; a automação de atualização a cada 15 minutos já existe.
- Até a reconciliação da identidade e a leitura das fontes sem texto, não anunciar conclusão nem porcentagem global.

## Limites deste checkpoint

Este arquivo registra análise de inventário e extração de texto, não uma revisão jurídica humana de cada decisão. A página de teste não foi mesclada em `main`. A OCR das súmulas e a reconciliação entre fontes continuam abertas; portanto, ainda não existe porcentagem global confiável de decisões analisadas/restantes.
