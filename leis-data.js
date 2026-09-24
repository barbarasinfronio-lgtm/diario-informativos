// leis-data.js - Base de Dados de Leis e Editais do Estuda Mana

export const EDITAIS_DISPONIVEIS = [
  // Editais Genéricos / Federais
  { id: "MAG_FED", nome: "Magistratura Federal (Geral / TRFs)", esfera: "federal" },
  { id: "MPF",     nome: "Ministério Público Federal (MPF)",    esfera: "federal" },
  { id: "DPU",     nome: "Defensoria Pública da União (DPU)",   esfera: "federal" },

  // Editais Estaduais Específicos
  { id: "TJSP",    nome: "TJ-SP (Tribunal de Justiça de SP)",   esfera: "estadual", estadoPadrao: "SP" },
  { id: "MPSP",    nome: "MP-SP (Ministério Público de SP)",    esfera: "estadual", estadoPadrao: "SP" },
  { id: "TJRJ",    nome: "TJ-RJ (Tribunal de Justiça do RJ)",   esfera: "estadual", estadoPadrao: "RJ" },
  { id: "TJMG",    nome: "TJ-MG (Tribunal de Justiça de MG)",   esfera: "estadual", estadoPadrao: "MG" }
];

export const ESTADOS_BRASIL = [
  { sigla: "AC", nome: "Acre" }, { sigla: "AL", nome: "Alagoas" }, { sigla: "AP", nome: "Amapá" },
  { sigla: "AM", nome: "Amazonas" }, { sigla: "BA", nome: "Bahia" }, { sigla: "CE", nome: "Ceará" },
  { sigla: "DF", nome: "Distrito Federal" }, { sigla: "ES", nome: "Espírito Santo" }, { sigla: "GO", nome: "Goiás" },
  { sigla: "MA", nome: "Maranhão" }, { sigla: "MT", nome: "Mato Grosso" }, { sigla: "MS", nome: "Mato Grosso do Sul" },
  { sigla: "MG", nome: "Minas Gerais" }, { sigla: "PA", nome: "Pará" }, { sigla: "PB", nome: "Paraíba" },
  { sigla: "PR", nome: "Paraná" }, { sigla: "PE", nome: "Pernambuco" }, { sigla: "PI", nome: "Piauí" },
  { sigla: "RJ", nome: "Rio de Janeiro" }, { sigla: "RN", nome: "Rio Grande do Norte" }, { sigla: "RS", nome: "Rio Grande do Sul" },
  { sigla: "RO", nome: "Rondônia" }, { sigla: "RR", nome: "Roraima" }, { sigla: "SC", nome: "Santa Catarina" },
  { sigla: "SP", nome: "São Paulo" }, { sigla: "SE", nome: "Sergipe" }, { sigla: "TO", nome: "Tocantins" }
];

export const LEIS_DATA = [
  // ==================== LEIS FEDERAIS ====================
  {
    id: "cf88",
    tipo: "federal",
    numeroNorma: "1988",
    titulo: "Constituição Federal de 1988",
    ementa: "Constituição da República Federativa do Brasil de 1988.",
    link: "https://www.planalto.gov.br/ccivil_03/constituicao/constituicao.htm"
  },
  {
    id: "cc2002",
    tipo: "federal",
    numeroNorma: "10406",
    titulo: "Código Civil (Lei nº 10.406/2002)",
    ementa: "Institui o Código Civil.",
    link: "https://www.planalto.gov.br/ccivil_03/leis/2002/l10406compilada.htm"
  },
  {
    id: "cpc2015",
    tipo: "federal",
    numeroNorma: "13105",
    titulo: "Código de Processo Civil (Lei nº 13.105/2015)",
    ementa: "Código de Processo Civil.",
    link: "https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2015/lei/l13105.htm"
  },
  {
    id: "cp1940",
    tipo: "federal",
    numeroNorma: "2848",
    titulo: "Código Penal (Decreto-Lei nº 2.848/1940)",
    ementa: "Código Penal.",
    link: "https://www.planalto.gov.br/ccivil_03/decreto-lei/del2848compilado.htm"
  },
  {
    id: "cpp1941",
    tipo: "federal",
    numeroNorma: "3689",
    titulo: "Código de Processo Penal (Decreto-Lei nº 3.689/1941)",
    ementa: "Código de Processo Penal.",
    link: "https://www.planalto.gov.br/ccivil_03/decreto-lei/del3689.htm"
  },
  {
    id: "lei-8112",
    tipo: "federal",
    numeroNorma: "8112",
    titulo: "Estatuto dos Servidores Públicos da União (Lei nº 8.112/1990)",
    ementa: "Regime jurídico dos servidores públicos civis da União, autarquias e fundações.",
    link: "https://www.planalto.gov.br/ccivil_03/leis/l8112cons.htm"
  },
  {
    id: "lei-5010",
    tipo: "federal",
    numeroNorma: "5010",
    titulo: "Organização da Justiça Federal (Lei nº 5.010/1966)",
    ementa: "Organiza a Justiça Federal de Primeira Instância.",
    link: "https://www.planalto.gov.br/ccivil_03/leis/l5010.htm"
  },

  // ==================== LEIS ESTADUAIS ====================
  // SÃO PAULO (SP)
  {
    id: "sp-lei-10261",
    tipo: "estadual",
    estado: "SP",
    numeroNorma: "10261",
    editais: ["TJSP", "MPSP"],
    titulo: "Estatuto dos Funcionários Civis de SP (Lei Estadual nº 10.261/1968)",
    ementa: "Dispõe sobre o Estatuto dos Funcionários Públicos Civis do Estado de São Paulo.",
    link: "https://www.al.sp.gov.br/norma/10261/1968"
  },
  {
    id: "sp-regimento-tjsp",
    tipo: "estadual",
    estado: "SP",
    numeroNorma: "regimento",
    editais: ["TJSP"],
    titulo: "Regimento Interno do TJ-SP",
    ementa: "Regimento Interno do Tribunal de Justiça do Estado de São Paulo.",
    link: "https://www.tjsp.jus.br/Download/Institucional/RegimentoInterno.pdf"
  },
  {
    id: "sp-lei-11608",
    tipo: "estadual",
    estado: "SP",
    numeroNorma: "11608",
    editais: ["TJSP"],
    titulo: "Lei de Custas do TJSP (Lei Estadual nº 11.608/2003)",
    ementa: "Dispõe sobre a Taxa Judiciária incidente sobre serviços forenses em SP.",
    link: "https://www.al.sp.gov.br/norma/11608/2003"
  },

  // RIO DE JANEIRO (RJ)
  {
    id: "rj-lodj",
    tipo: "estadual",
    estado: "RJ",
    numeroNorma: "6956",
    editais: ["TJRJ"],
    titulo: "Lei de Organização Judiciária do RJ (Lei Estadual nº 6.956/2015)",
    ementa: "Dispõe sobre a Organização e Divisão Judiciárias do Estado do Rio de Janeiro.",
    link: "http://www.tjrj.jus.br"
  },

  // MINAS GERAIS (MG)
  {
    id: "mg-lc-59",
    tipo: "estadual",
    estado: "MG",
    numeroNorma: "59",
    editais: ["TJMG"],
    titulo: "Organização e Divisão Judiciárias de MG (Lei Complementar Estadual nº 59/2001)",
    ementa: "Contém a organização e a divisão judiciárias do Estado de Minas Gerais.",
    link: "https://www.almg.gov.br/legislacao-mineira/texto/LCP/59/2001/"
  }
];
