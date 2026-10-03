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

## Limites deste checkpoint

Este arquivo registra análise de inventário e extração de texto, não uma revisão jurídica humana de cada decisão. A página de teste não foi mesclada em `main`. A OCR das súmulas e a reconciliação entre fontes continuam abertas; portanto, ainda não existe porcentagem global confiável de decisões analisadas/restantes.
