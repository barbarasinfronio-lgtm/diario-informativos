// Dados das Súmulas — Diário das Súmulas
//
// Estrutura: SUMULAS_DATA[tribunalKey] = { label, status, sumulas: [...] }
//   status "disponivel"  -> já tem conteúdo real, aparece normalmente
//   status "em_breve"    -> tribunal ainda não levantado, aparece desabilitado
//                            na lista com uma nota "em preparação"
//   cada súmula: { numero, texto, materia, link }
//     materia: null até a classificação por matéria ser feita (fase 2).
//     Quando `materia` for null, a súmula aparece em "Todas as matérias".
//
// FASE 1 (hoje): 64 Súmulas Vinculantes do STF, com texto verificado em
// fontes oficiais/jurídicas confiáveis (STF, Dizer o Direito, Buscador
// Dizer o Direito, vade mecuns online). A SV 30 nunca foi publicada pelo
// STF (número reservado, sem enunciado) e por isso não entra na lista.
//
// FASE 2 (próximas rodadas): Súmulas comuns do STF (736), STJ, TST, TSE,
// e os 27 Tribunais de Justiça estaduais — cada um exige levantamento
// próprio nas fontes oficiais, por isso entram como "em_breve" por
// enquanto e vão sendo preenchidos aos poucos.

var SUMULAS_LINK_SV = "https://portal.stf.jus.br/jurisprudencia/sumulas/sumulas_vinculantes.asp";

var SUMULAS_DATA = {
  stf_vinculante: {
    label: "STF — Súmulas Vinculantes",
    status: "disponivel",
    sumulas: [
      { numero: 1, texto: "Ofende a garantia constitucional do ato jurídico perfeito a decisão que, sem ponderar as circunstâncias do caso concreto, desconsidera a validez e a eficácia de acordo constante de termo de adesão instituído pela Lei Complementar nº 110/2001.", materia: null, link: SUMULAS_LINK_SV },
      { numero: 2, texto: "É inconstitucional a lei ou ato normativo estadual ou distrital que disponha sobre sistemas de consórcios e sorteios, inclusive bingos e loterias.", materia: null, link: SUMULAS_LINK_SV },
      { numero: 3, texto: "Nos processos perante o Tribunal de Contas da União asseguram-se o contraditório e a ampla defesa quando da decisão puder resultar anulação ou revogação de ato administrativo que beneficie o interessado, excetuada a apreciação da legalidade do ato de concessão inicial de aposentadoria, reforma e pensão.", materia: null, link: SUMULAS_LINK_SV },
      { numero: 4, texto: "Salvo nos casos previstos na Constituição, o salário mínimo não pode ser usado como indexador de base de cálculo de vantagem de servidor público ou de empregado, nem ser substituído por decisão judicial.", materia: null, link: SUMULAS_LINK_SV },
      { numero: 5, texto: "A falta de defesa técnica por advogado no processo administrativo disciplinar não ofende a Constituição.", materia: null, link: SUMULAS_LINK_SV },
      { numero: 6, texto: "Não viola a Constituição o estabelecimento de remuneração inferior ao salário mínimo para as praças prestadoras de serviço militar inicial.", materia: null, link: SUMULAS_LINK_SV },
      { numero: 7, texto: "A norma do §3º do artigo 192 da Constituição, revogada pela Emenda Constitucional nº 40/2003, que limitava a taxa de juros reais a 12% ao ano, tinha sua aplicação condicionada à edição de lei complementar.", materia: null, link: SUMULAS_LINK_SV },
      { numero: 8, texto: "São inconstitucionais o parágrafo único do artigo 5º do Decreto-Lei nº 1.569/1977 e os artigos 45 e 46 da Lei nº 8.212/1991, que tratam de prescrição e decadência de crédito tributário.", materia: null, link: SUMULAS_LINK_SV },
      { numero: 9, texto: "O disposto no artigo 127 da Lei nº 7.210/1984 (Lei de Execução Penal) foi recebido pela ordem constitucional vigente, e não se lhe aplica o limite temporal previsto no caput do artigo 58.", materia: null, link: SUMULAS_LINK_SV },
      { numero: 10, texto: "Viola a cláusula de reserva de plenário (CF, artigo 97) a decisão de órgão fracionário de Tribunal que, embora não declare expressamente a inconstitucionalidade de lei ou ato normativo do poder público, afasta sua incidência, no todo ou em parte.", materia: null, link: SUMULAS_LINK_SV },
      { numero: 11, texto: "Só é lícito o uso de algemas em casos de resistência e de fundado receio de fuga ou de perigo à integridade física própria ou alheia, por parte do preso ou de terceiros, justificada a excepcionalidade por escrito, sob pena de responsabilidade disciplinar, civil e penal do agente ou da autoridade e de nulidade da prisão ou do ato processual a que se refere, sem prejuízo da responsabilidade civil do Estado.", materia: null, link: SUMULAS_LINK_SV },
      { numero: 12, texto: "A cobrança de taxa de matrícula nas universidades públicas viola o disposto no art. 206, IV, da Constituição Federal.", materia: null, link: SUMULAS_LINK_SV },
      { numero: 13, texto: "A nomeação de cônjuge, companheiro ou parente em linha reta, colateral ou por afinidade, até o terceiro grau, inclusive, da autoridade nomeante ou de servidor da mesma pessoa jurídica investido em cargo de direção, chefia ou assessoramento, para o exercício de cargo em comissão ou de confiança ou, ainda, de função gratificada na administração pública direta e indireta em qualquer dos Poderes da União, dos Estados, do Distrito Federal e dos Municípios, compreendido o ajuste mediante designações recíprocas, viola a Constituição Federal.", materia: null, link: SUMULAS_LINK_SV },
      { numero: 14, texto: "É direito do defensor, no interesse do representado, ter acesso amplo aos elementos de prova que, já documentados em procedimento investigatório realizado por órgão com competência de polícia judiciária, digam respeito ao exercício do direito de defesa.", materia: null, link: SUMULAS_LINK_SV },
      { numero: 15, texto: "O cálculo de gratificações e outras vantagens do servidor público não incide sobre o abono utilizado para se atingir o salário mínimo.", materia: null, link: SUMULAS_LINK_SV },
      { numero: 16, texto: "Os artigos 7º, IV, e 39, § 3º (redação da EC 19/98), da Constituição, referem-se ao total da remuneração percebida pelo servidor público.", materia: null, link: SUMULAS_LINK_SV },
      { numero: 17, texto: "Durante o período previsto no parágrafo 1º do artigo 100 da Constituição, não incidem juros de mora sobre os precatórios que nele sejam pagos.", materia: null, link: SUMULAS_LINK_SV },
      { numero: 18, texto: "A dissolução da sociedade ou do vínculo conjugal, no curso do mandato, não afasta a inelegibilidade prevista no § 7º do artigo 14 da Constituição Federal.", materia: null, link: SUMULAS_LINK_SV },
      { numero: 19, texto: "A taxa cobrada exclusivamente em razão dos serviços públicos de coleta, remoção e tratamento ou destinação de lixo ou resíduos provenientes de imóveis, não viola o artigo 145, II, da Constituição Federal.", materia: null, link: SUMULAS_LINK_SV },
      { numero: 20, texto: "A Gratificação de Desempenho de Atividade Técnico-Administrativa - GDATA, instituída pela Lei nº 10.404/2002, deve ser deferida aos inativos nos valores correspondentes a 37,5 pontos no período de fevereiro a maio de 2002 e, nos termos do artigo 5º, parágrafo único, da Lei nº 10.404/2002, no período de junho de 2002 até a conclusão dos efeitos do último ciclo de avaliação a que se refere o artigo 1º da Medida Provisória nº 198/2004, a partir da qual passa a ser de 60 pontos.", materia: null, link: SUMULAS_LINK_SV },
      { numero: 21, texto: "É inconstitucional a exigência de depósito ou arrolamento prévios de dinheiro ou bens para admissibilidade de recurso administrativo.", materia: null, link: SUMULAS_LINK_SV },
      { numero: 22, texto: "A Justiça do Trabalho é competente para processar e julgar as ações de indenização por danos morais e patrimoniais decorrentes de acidente de trabalho propostas por empregado contra empregador, inclusive aquelas que ainda não possuíam sentença de mérito em primeiro grau quando da promulgação da Emenda Constitucional nº 45/04.", materia: null, link: SUMULAS_LINK_SV },
      { numero: 23, texto: "A Justiça do Trabalho é competente para processar e julgar ação possessória ajuizada em decorrência do exercício do direito de greve pelos trabalhadores da iniciativa privada.", materia: null, link: SUMULAS_LINK_SV },
      { numero: 24, texto: "Não se tipifica crime material contra a ordem tributária, previsto no art. 1º, incisos I a IV, da Lei nº 8.137/90, antes do lançamento definitivo do tributo.", materia: null, link: SUMULAS_LINK_SV },
      { numero: 25, texto: "É ilícita a prisão civil de depositário infiel, qualquer que seja a modalidade do depósito.", materia: null, link: SUMULAS_LINK_SV },
      { numero: 26, texto: "Para efeito de progressão de regime no cumprimento de pena por crime hediondo, ou equiparado, o juízo da execução observará a inconstitucionalidade do art. 2º da Lei n. 8.072/1990, sem prejuízo de avaliar se o condenado preenche, ou não, os requisitos objetivos e subjetivos do benefício, podendo determinar, para tal fim, de modo fundamentado, a realização de exame criminológico.", materia: null, link: SUMULAS_LINK_SV },
      { numero: 27, texto: "Compete à Justiça estadual julgar causas entre consumidor e concessionária de serviço público de telefonia, quando a ANATEL não seja litisconsorte passiva necessária, assistente, nem opoente.", materia: null, link: SUMULAS_LINK_SV },
      { numero: 28, texto: "É inconstitucional a exigência de depósito prévio como requisito de admissibilidade de ação judicial na qual se pretenda discutir a exigibilidade de crédito tributário.", materia: null, link: SUMULAS_LINK_SV },
      { numero: 29, texto: "É constitucional a adoção, no cálculo do valor de taxa, de um ou mais elementos da base de cálculo própria de determinado imposto, desde que não haja integral identidade entre uma base e outra.", materia: null, link: SUMULAS_LINK_SV },
      { numero: 31, texto: "É inconstitucional a incidência do Imposto sobre Serviços de Qualquer Natureza – ISS sobre operações de locação de bens móveis.", materia: null, link: SUMULAS_LINK_SV },
      { numero: 32, texto: "O ICMS não incide sobre alienação de salvados de sinistro pelas seguradoras.", materia: null, link: SUMULAS_LINK_SV },
      { numero: 33, texto: "Aplicam-se ao servidor público, no que couber, as regras do regime geral da previdência social sobre aposentadoria especial de que trata o artigo 40, § 4º, inciso III da Constituição Federal, até a edição de lei complementar específica.", materia: null, link: SUMULAS_LINK_SV },
      { numero: 34, texto: "A Gratificação de Desempenho de Atividade de Seguridade Social e do Trabalho – GDASST, instituída pela Lei 10.483/2002, deve ser estendida aos inativos no valor correspondente a 60 pontos, desde o advento da Medida Provisória 198/2004, convertida na Lei 10.971/2004, quando tais inativos façam jus à paridade constitucional (EC 20/1998, 41/2003 e 47/2005).", materia: null, link: SUMULAS_LINK_SV },
      { numero: 35, texto: "A homologação da transação penal prevista no artigo 76 da Lei 9.099/1995 não faz coisa julgada material e, descumpridas suas cláusulas, retoma-se a situação anterior, possibilitando-se ao Ministério Público a continuidade da persecução penal mediante oferecimento de denúncia ou requisição de inquérito policial.", materia: null, link: SUMULAS_LINK_SV },
      { numero: 36, texto: "Compete à Justiça Federal comum processar e julgar civil denunciado pelos crimes de falsificação e de uso de documento falso quando se tratar de falsificação da Caderneta de Inscrição e Registro (CIR) ou de Carteira de Habilitação de Amador (CHA), ainda que expedidas pela Marinha do Brasil.", materia: null, link: SUMULAS_LINK_SV },
      { numero: 37, texto: "Não cabe ao Poder Judiciário, que não tem função legislativa, aumentar vencimentos de servidores públicos sob o fundamento de isonomia.", materia: null, link: SUMULAS_LINK_SV },
      { numero: 38, texto: "É competente o Município para fixar o horário de funcionamento de estabelecimento comercial.", materia: null, link: SUMULAS_LINK_SV },
      { numero: 39, texto: "Compete privativamente à União legislar sobre vencimentos dos membros das polícias civil e militar e do corpo de bombeiros militar do Distrito Federal.", materia: null, link: SUMULAS_LINK_SV },
      { numero: 40, texto: "A contribuição confederativa de que trata o art. 8º, IV, da Constituição Federal, só é exigível dos filiados ao sindicato respectivo.", materia: null, link: SUMULAS_LINK_SV },
      { numero: 41, texto: "O serviço de iluminação pública não pode ser remunerado mediante taxa.", materia: null, link: SUMULAS_LINK_SV },
      { numero: 42, texto: "É inconstitucional a vinculação do reajuste de vencimentos de servidores estaduais ou municipais a índices federais de correção monetária.", materia: null, link: SUMULAS_LINK_SV },
      { numero: 43, texto: "É inconstitucional toda modalidade de provimento que propicie ao servidor investir-se, sem prévia aprovação em concurso público destinado ao seu provimento, em cargo que não integra a carreira na qual anteriormente investido.", materia: null, link: SUMULAS_LINK_SV },
      { numero: 44, texto: "Só por lei se pode sujeitar a exame psicotécnico a habilitação de candidato a cargo público.", materia: null, link: SUMULAS_LINK_SV },
      { numero: 45, texto: "A competência constitucional do Tribunal do Júri prevalece sobre o foro por prerrogativa de função estabelecido exclusivamente pela constituição estadual.", materia: null, link: SUMULAS_LINK_SV },
      { numero: 46, texto: "A definição dos crimes de responsabilidade e o estabelecimento das respectivas normas de processo e julgamento são da competência legislativa privativa da União.", materia: null, link: SUMULAS_LINK_SV },
      { numero: 47, texto: "Os honorários advocatícios incluídos na condenação ou destacados do montante principal devido ao credor consubstanciam verba de natureza alimentar cuja satisfação ocorrerá com a expedição de precatório ou requisição de pequeno valor, observada ordem especial restrita aos créditos dessa natureza.", materia: null, link: SUMULAS_LINK_SV },
      { numero: 48, texto: "Na entrada de mercadoria importada do exterior, é legítima a cobrança do ICMS por ocasião do desembaraço aduaneiro.", materia: null, link: SUMULAS_LINK_SV },
      { numero: 49, texto: "Ofende o princípio da livre concorrência lei municipal que impede a instalação de estabelecimentos comerciais do mesmo ramo em determinada área.", materia: null, link: SUMULAS_LINK_SV },
      { numero: 50, texto: "Norma legal que altera o prazo de recolhimento de obrigação tributária não se sujeita ao princípio da anterioridade.", materia: null, link: SUMULAS_LINK_SV },
      { numero: 51, texto: "O reajuste de 28,86%, concedido aos servidores militares pelas Leis 8622/1993 e 8627/1993, estende-se aos servidores civis do poder executivo, observadas as eventuais compensações decorrentes dos reajustes diferenciados concedidos pelos mesmos diplomas legais.", materia: null, link: SUMULAS_LINK_SV },
      { numero: 52, texto: "Ainda quando alugado a terceiros, permanece imune ao IPTU o imóvel pertencente a qualquer das entidades referidas pelo art. 150, VI, 'c', da Constituição Federal, desde que o valor dos aluguéis seja aplicado nas atividades para as quais tais entidades foram constituídas.", materia: null, link: SUMULAS_LINK_SV },
      { numero: 53, texto: "A competência da Justiça do Trabalho prevista no art. 114, VIII, da Constituição Federal alcança a execução de ofício das contribuições previdenciárias relativas ao objeto da condenação constante das sentenças que proferir e acordos por ela homologados.", materia: null, link: SUMULAS_LINK_SV },
      { numero: 54, texto: "A medida provisória não apreciada pelo Congresso Nacional podia, até a Emenda Constitucional 32/2001, ser reeditada dentro do seu prazo de eficácia de trinta dias, mantidos os efeitos de lei desde a primeira edição.", materia: null, link: SUMULAS_LINK_SV },
      { numero: 55, texto: "O direito ao auxílio-alimentação não se estende aos servidores inativos.", materia: null, link: SUMULAS_LINK_SV },
      { numero: 56, texto: "A falta de estabelecimento penal adequado não autoriza a manutenção do condenado em regime prisional mais gravoso, devendo-se observar, nesta hipótese, os parâmetros fixados no RE 641.320/RS.", materia: null, link: SUMULAS_LINK_SV },
      { numero: 57, texto: "É inconstitucional a revogação ou alteração, sem lei específica, de programa e/ou linha de financiamento por instituição financeira estatal, quando tal medida representar afronta ao princípio da isonomia.", materia: null, link: SUMULAS_LINK_SV },
      { numero: 58, texto: "Inexiste direito a crédito presumido de IPI relativamente à entrada de insumos isentos, sujeitos à alíquota zero ou não tributáveis.", materia: null, link: SUMULAS_LINK_SV },
      { numero: 59, texto: "É impositiva a fixação do regime aberto e a substituição da pena privativa de liberdade por restritiva de direitos quando reconhecida a figura do tráfico privilegiado.", materia: null, link: SUMULAS_LINK_SV },
      { numero: 60, texto: "O pedido e a análise administrativos de fármacos na rede pública de saúde, a judicialização do caso, bem ainda seus desdobramentos, devem observar os termos dos três acordos interfederativos firmados no âmbito do Sistema Único de Saúde.", materia: null, link: SUMULAS_LINK_SV },
      { numero: 61, texto: "A concessão judicial de medicamento registrado na ANVISA, mas não incorporado às listas de dispensação do Sistema Único de Saúde, deve observar as teses firmadas no julgamento do Tema 6 da Repercussão Geral.", materia: null, link: SUMULAS_LINK_SV },
      { numero: 62, texto: "É legítima a revogação da isenção estabelecida no art. 6º, II, da Lei Complementar 70/1991 pelo art. 56 da Lei 9.430/1996.", materia: null, link: SUMULAS_LINK_SV },
      { numero: 63, texto: "O tráfico privilegiado (art. 33, § 4º, da Lei 11.343/2006) não configura crime hediondo, afastando-se a aplicação dos parâmetros mais rigorosos de progressão de regime e de livramento condicional.", materia: null, link: SUMULAS_LINK_SV },
      { numero: 64, texto: "A demonstração da intenção de transportar a substância entorpecente para outro estado da Federação autoriza a aplicação da majorante prevista no art. 40, inciso V, da Lei nº 11.343/2006, ainda que não ocorra a efetiva transposição da divisa estadual.", materia: null, link: SUMULAS_LINK_SV }
    ]
  },

  // ---- Fase 2: em preparação -------------------------------------------
  stf: { label: "STF — Súmulas (comuns)", status: "em_breve", sumulas: [] },
  stj: { label: "STJ — Súmulas", status: "em_breve", sumulas: [] },
  tst: { label: "TST — Súmulas", status: "em_breve", sumulas: [] },
  tse: { label: "TSE — Súmulas", status: "em_breve", sumulas: [] },

  tjac: { label: "TJAC — Súmulas", status: "em_breve", sumulas: [] },
  tjal: { label: "TJAL — Súmulas", status: "em_breve", sumulas: [] },
  tjam: { label: "TJAM — Súmulas", status: "em_breve", sumulas: [] },
  tjap: { label: "TJAP — Súmulas", status: "em_breve", sumulas: [] },
  tjba: { label: "TJBA — Súmulas", status: "em_breve", sumulas: [] },
  tjce: { label: "TJCE — Súmulas", status: "em_breve", sumulas: [] },
  tjdft: { label: "TJDFT — Súmulas", status: "em_breve", sumulas: [] },
  tjes: { label: "TJES — Súmulas", status: "em_breve", sumulas: [] },
  tjgo: { label: "TJGO — Súmulas", status: "em_breve", sumulas: [] },
  tjma: { label: "TJMA — Súmulas", status: "em_breve", sumulas: [] },
  tjmg: { label: "TJMG — Súmulas", status: "em_breve", sumulas: [] },
  tjms: { label: "TJMS — Súmulas", status: "em_breve", sumulas: [] },
  tjmt: { label: "TJMT — Súmulas", status: "em_breve", sumulas: [] },
  tjpa: { label: "TJPA — Súmulas", status: "em_breve", sumulas: [] },
  tjpb: { label: "TJPB — Súmulas", status: "em_breve", sumulas: [] },
  tjpe: { label: "TJPE — Súmulas", status: "em_breve", sumulas: [] },
  tjpi: { label: "TJPI — Súmulas", status: "em_breve", sumulas: [] },
  tjpr: { label: "TJPR — Súmulas", status: "em_breve", sumulas: [] },
  tjrj: { label: "TJRJ — Súmulas", status: "em_breve", sumulas: [] },
  tjrn: { label: "TJRN — Súmulas", status: "em_breve", sumulas: [] },
  tjro: { label: "TJRO — Súmulas", status: "em_breve", sumulas: [] },
  tjrr: { label: "TJRR — Súmulas", status: "em_breve", sumulas: [] },
  tjrs: { label: "TJRS — Súmulas", status: "em_breve", sumulas: [] },
  tjsc: { label: "TJSC — Súmulas", status: "em_breve", sumulas: [] },
  tjse: { label: "TJSE — Súmulas", status: "em_breve", sumulas: [] },
  tjsp: { label: "TJSP — Súmulas", status: "em_breve", sumulas: [] },
  tjto: { label: "TJTO — Súmulas", status: "em_breve", sumulas: [] }
};

var SUMULAS_ORG_ORDER = [
  "stf_vinculante", "stf", "stj", "tst", "tse",
  "tjac", "tjal", "tjam", "tjap", "tjba", "tjce", "tjdft", "tjes", "tjgo",
  "tjma", "tjmg", "tjms", "tjmt", "tjpa", "tjpb", "tjpe", "tjpi", "tjpr",
  "tjrj", "tjrn", "tjro", "tjrr", "tjrs", "tjsc", "tjse", "tjsp", "tjto"
];
