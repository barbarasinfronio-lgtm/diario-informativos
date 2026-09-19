// Editais de concurso — dados (conteúdo programático mapeado).
// Há dois tipos de item: tipo "carreira" (espécie de cargo — junta o conteúdo de todos os
// editais daquela carreira, campo "editais"; secao "exame" = exames nacionais como o ENAM;
// emBreve:true = ainda sem edital mapeado) e tipo "edital" (um edital específico).
// Cada edital tem: identificação, disciplinas por bloco/grupo e a lista de leis do
// Diário de Leis que o programa cobre. Cada lei é [matéria, número] — a mesma chave
// usada pelo Diário de Leis (matéria + número da norma).
// "extras" = normas citadas no programa que AINDA NÃO estão no Diário de Leis
// (leis estaduais, resoluções do CNJ/CNMP etc.) — aparecem só como lista informativa.
// Para acrescentar um edital novo, copie um dos blocos abaixo.

var EDITAIS_DATA = [
 {
  "id": "carreira-magistratura-federal",
  "tipo": "carreira",
  "secao": "carreira",
  "sigla": "Carreira",
  "cargo": "união dos editais: TRF5",
  "orgao": "Reúne o conteúdo de 1 edital",
  "titulo": "Magistratura Federal",
  "edital": "TRF5: XVI Concurso para Juiz Federal Substituto",
  "grupos": [
   {
    "nome": "Disciplinas (união dos editais)",
    "disciplinas": [
     "Direito Constitucional",
     "Direito Previdenciário",
     "Direito Penal",
     "Direito Processual Penal",
     "Direito Econômico e de Proteção ao Consumidor",
     "Direito Civil",
     "Direito Processual Civil",
     "Direito Empresarial",
     "Direito Financeiro e Tributário",
     "Direito Administrativo",
     "Direito Ambiental",
     "Direito Internacional Público e Privado",
     "Noções Gerais de Direito e Formação Humanística",
     "Direitos Humanos"
    ]
   }
  ],
  "leis": [
   [
    "civil",
    "Lei nº 14.063/2020"
   ],
   [
    "civil",
    "Decreto-Lei nº 4.657/1942"
   ],
   [
    "civil",
    "Lei nº 6.015/1973"
   ],
   [
    "civil",
    "Lei nº 13.146/2015"
   ],
   [
    "civil",
    "Lei nº 13.709/2018"
   ],
   [
    "civil",
    "Lei nº 9.278/1996"
   ],
   [
    "civil",
    "Lei nº 8.009/1990"
   ],
   [
    "civil",
    "Lei nº 10.406/2002"
   ],
   [
    "processual_civil",
    "Lei nº 13.105/2015"
   ],
   [
    "processual_civil",
    "Lei nº 12.016/2009"
   ],
   [
    "processual_civil",
    "Lei nº 4.717/1965"
   ],
   [
    "processual_civil",
    "Lei nº 7.347/1985"
   ],
   [
    "processual_civil",
    "Lei nº 9.307/1996"
   ],
   [
    "processual_civil",
    "Lei nº 13.140/2015"
   ],
   [
    "processual_civil",
    "Lei nº 9.099/1995"
   ],
   [
    "processual_civil",
    "Lei nº 10.259/2001"
   ],
   [
    "consumidor",
    "Lei nº 8.078/1990"
   ],
   [
    "penal",
    "Decreto-Lei nº 2.848/1940"
   ],
   [
    "penal",
    "Lei nº 7.210/1984"
   ],
   [
    "penal",
    "Lei nº 8.429/1992"
   ],
   [
    "penal",
    "Lei nº 9.605/1998"
   ],
   [
    "penal",
    "Lei nº 8.072/1990"
   ],
   [
    "penal",
    "Lei nº 9.613/1998"
   ],
   [
    "penal",
    "Lei nº 9.455/1997"
   ],
   [
    "penal",
    "Lei nº 13.869/2019"
   ],
   [
    "penal",
    "Lei nº 13.260/2016"
   ],
   [
    "processual_penal",
    "Lei nº 13.105/2015"
   ],
   [
    "processual_penal",
    "Lei nº 7.210/1984"
   ],
   [
    "processual_penal",
    "Lei nº 11.101/2005"
   ],
   [
    "processual_penal",
    "Lei nº 9.099/1995"
   ],
   [
    "processual_penal",
    "Decreto-Lei nº 3.689/1941"
   ],
   [
    "constitucional",
    "CF/1988"
   ],
   [
    "empresarial",
    "Lei nº 11.101/2005"
   ],
   [
    "empresarial",
    "Lei nº 6.404/1976"
   ],
   [
    "empresarial",
    "Lei nº 12.529/2011"
   ],
   [
    "empresarial",
    "Lei nº 9.279/1996"
   ],
   [
    "tributario",
    "Lei nº 5.172/1966"
   ],
   [
    "ambiental",
    "Lei nº 12.305/2010"
   ],
   [
    "ambiental",
    "Lei nº 9.985/2000"
   ],
   [
    "ambiental",
    "Lei nº 9.433/1997"
   ],
   [
    "ambiental",
    "Lei nº 11.445/2007"
   ],
   [
    "administrativo",
    "Lei nº 8.429/1992"
   ],
   [
    "administrativo",
    "Lei nº 14.133/2021"
   ],
   [
    "administrativo",
    "Decreto-Lei nº 3.365/1941"
   ],
   [
    "administrativo",
    "Lei nº 11.079/2004"
   ],
   [
    "previdenciario",
    "Lei nº 8.213/1991"
   ],
   [
    "previdenciario",
    "Lei nº 8.212/1991"
   ],
   [
    "humanos",
    "Lei nº 9.474/1997"
   ],
   [
    "humanos",
    "Decreto nº 678/1992"
   ],
   [
    "humanos",
    "Decreto nº 6.949/2009"
   ]
  ],
  "extras": [],
  "editais": [
   "trf5-xvi"
  ]
 },
 {
  "id": "carreira-magistratura-estadual",
  "tipo": "carreira",
  "secao": "carreira",
  "sigla": "Carreira",
  "cargo": "união dos editais: TJGO + TJPE + TJRS",
  "orgao": "Reúne o conteúdo de 3 editais",
  "titulo": "Magistratura Estadual",
  "edital": "TJGO: 59º Concurso de Juiz Substituto · TJPE: Concurso de Juiz Substituto · TJRS: Concurso para Juiz de Direito Substituto",
  "grupos": [
   {
    "nome": "Disciplinas (união dos editais)",
    "disciplinas": [
     "Direito Civil — 3 de 3 editais",
     "Direito Processual Civil — 3 de 3 editais",
     "Direito do Consumidor — 3 de 3 editais",
     "Direito da Criança e do Adolescente — 3 de 3 editais",
     "Direito Penal — 3 de 3 editais",
     "Direito Processual Penal — 3 de 3 editais",
     "Direito Constitucional — 3 de 3 editais",
     "Direito Eleitoral — 3 de 3 editais",
     "Direito Empresarial — 3 de 3 editais",
     "Direito Tributário e Financeiro — 1 de 3 editais",
     "Direito Ambiental — 3 de 3 editais",
     "Direito Administrativo — 3 de 3 editais",
     "Noções Gerais de Direito e Formação Humanística — 3 de 3 editais",
     "Direitos Humanos — 3 de 3 editais",
     "Direito Financeiro e Tributário — 1 de 3 editais",
     "Direito Tributário — 1 de 3 editais"
    ]
   }
  ],
  "leis": [
   [
    "civil",
    "Lei nº 6.015/1973"
   ],
   [
    "civil",
    "Decreto-Lei nº 911/1969"
   ],
   [
    "civil",
    "Lei nº 9.514/1997"
   ],
   [
    "civil",
    "Lei nº 4.591/1964"
   ],
   [
    "civil",
    "Lei nº 10.931/2004"
   ],
   [
    "civil",
    "Lei nº 10.741/2003"
   ],
   [
    "civil",
    "Lei nº 8.245/1991"
   ],
   [
    "civil",
    "Lei nº 13.146/2015"
   ],
   [
    "civil",
    "Lei nº 14.382/2022"
   ],
   [
    "civil",
    "Lei nº 13.874/2019"
   ],
   [
    "civil",
    "Lei nº 14.010/2020"
   ],
   [
    "civil",
    "Lei nº 13.709/2018"
   ],
   [
    "civil",
    "Lei nº 8.009/1990"
   ],
   [
    "civil",
    "Decreto nº 20.910/1932"
   ],
   [
    "civil",
    "Lei nº 1.060/1950"
   ],
   [
    "civil",
    "Lei nº 6.515/1977"
   ],
   [
    "civil",
    "Lei nº 9.278/1996"
   ],
   [
    "civil",
    "Lei nº 5.478/1968"
   ],
   [
    "civil",
    "Lei nº 11.804/2008"
   ],
   [
    "civil",
    "Lei nº 8.560/1992"
   ],
   [
    "civil",
    "Decreto nº 57.663/1966"
   ],
   [
    "civil",
    "Lei nº 9.492/1997"
   ],
   [
    "civil",
    "Lei nº 11.076/2004"
   ],
   [
    "civil",
    "Lei nº 10.406/2002"
   ],
   [
    "civil",
    "Decreto-Lei nº 4.657/1942"
   ],
   [
    "civil",
    "Decreto nº 22.626/1933"
   ],
   [
    "civil",
    "Lei nº 13.058/2014"
   ],
   [
    "civil",
    "Lei nº 8.935/1994"
   ],
   [
    "civil",
    "Lei nº 12.965/2014"
   ],
   [
    "civil",
    "Lei nº 6.766/1979"
   ],
   [
    "civil",
    "Lei nº 14.905/2024"
   ],
   [
    "civil",
    "Lei nº 9.610/1998"
   ],
   [
    "civil",
    "Decreto nº 9.176/2017"
   ],
   [
    "civil",
    "Decreto nº 3.413/2000"
   ],
   [
    "processual_civil",
    "Lei nº 12.016/2009"
   ],
   [
    "processual_civil",
    "Lei nº 4.717/1965"
   ],
   [
    "processual_civil",
    "Lei nº 7.347/1985"
   ],
   [
    "processual_civil",
    "Lei nº 9.507/1997"
   ],
   [
    "processual_civil",
    "Lei nº 9.099/1995"
   ],
   [
    "processual_civil",
    "Lei nº 10.259/2001"
   ],
   [
    "processual_civil",
    "Lei nº 12.153/2009"
   ],
   [
    "processual_civil",
    "Lei nº 11.419/2006"
   ],
   [
    "processual_civil",
    "Lei nº 8.437/1992"
   ],
   [
    "processual_civil",
    "Lei nº 9.494/1997"
   ],
   [
    "processual_civil",
    "Lei nº 11.417/2006"
   ],
   [
    "processual_civil",
    "Lei nº 13.140/2015"
   ],
   [
    "processual_civil",
    "Lei nº 13.105/2015"
   ],
   [
    "processual_civil",
    "Lei nº 9.307/1996"
   ],
   [
    "processual_civil",
    "Lei nº 13.129/2015"
   ],
   [
    "consumidor",
    "Lei nº 8.078/1990"
   ],
   [
    "consumidor",
    "Lei nº 14.538/2023"
   ],
   [
    "consumidor",
    "Decreto nº 7.962/2013"
   ],
   [
    "consumidor",
    "Lei nº 12.414/2011"
   ],
   [
    "consumidor",
    "Decreto nº 9.936/2019"
   ],
   [
    "consumidor",
    "Lei nº 9.656/1998"
   ],
   [
    "crianca",
    "Lei nº 10.216/2001"
   ],
   [
    "crianca",
    "Lei nº 12.594/2012"
   ],
   [
    "crianca",
    "Lei nº 13.431/2017"
   ],
   [
    "crianca",
    "Lei nº 14.344/2022"
   ],
   [
    "crianca",
    "Lei nº 8.069/1990"
   ],
   [
    "crianca",
    "Decreto nº 9.603/2018"
   ],
   [
    "crianca",
    "Lei nº 13.257/2016"
   ],
   [
    "crianca",
    "Lei nº 15.211/2025"
   ],
   [
    "crianca",
    "Lei nº 15.240/2025"
   ],
   [
    "penal",
    "Lei nº 8.429/1992"
   ],
   [
    "penal",
    "Lei nº 11.340/2006"
   ],
   [
    "penal",
    "Lei nº 7.210/1984"
   ],
   [
    "penal",
    "Lei nº 9.613/1998"
   ],
   [
    "penal",
    "Lei nº 12.850/2013"
   ],
   [
    "penal",
    "Lei nº 11.343/2006"
   ],
   [
    "penal",
    "Decreto-Lei nº 201/1967"
   ],
   [
    "penal",
    "Decreto-Lei nº 2.848/1940"
   ],
   [
    "penal",
    "Lei nº 9.605/1998"
   ],
   [
    "penal",
    "Lei nº 10.826/2003"
   ],
   [
    "penal",
    "Lei nº 9.455/1997"
   ],
   [
    "penal",
    "Lei nº 13.869/2019"
   ],
   [
    "penal",
    "Lei nº 9.503/1997"
   ],
   [
    "penal",
    "Decreto-Lei nº 3.688/1941"
   ],
   [
    "penal",
    "Lei nº 9.263/1996"
   ],
   [
    "penal",
    "Lei nº 8.072/1990"
   ],
   [
    "penal",
    "Lei nº 9.029/1995"
   ],
   [
    "penal",
    "Lei nº 7.716/1989"
   ],
   [
    "penal",
    "Lei nº 9.459/1997"
   ],
   [
    "penal",
    "Lei nº 9.434/1997"
   ],
   [
    "penal",
    "Lei nº 6.001/1973"
   ],
   [
    "penal",
    "Lei nº 8.137/1990"
   ],
   [
    "penal",
    "Lei nº 8.176/1991"
   ],
   [
    "penal",
    "Lei nº 14.597/2023"
   ],
   [
    "penal",
    "Lei nº 13.964/2019"
   ],
   [
    "penal",
    "Lei nº 12.694/2012"
   ],
   [
    "penal",
    "Lei nº 1.521/1951"
   ],
   [
    "penal",
    "Lei nº 12.683/2012"
   ],
   [
    "penal",
    "Lei nº 12.984/2014"
   ],
   [
    "penal",
    "Lei nº 10.671/2003"
   ],
   [
    "processual_penal",
    "Lei nº 9.099/1995"
   ],
   [
    "processual_penal",
    "Lei nº 11.340/2006"
   ],
   [
    "processual_penal",
    "Lei nº 13.431/2017"
   ],
   [
    "processual_penal",
    "Lei nº 7.210/1984"
   ],
   [
    "processual_penal",
    "Lei nº 9.296/1996"
   ],
   [
    "processual_penal",
    "Lei nº 9.807/1999"
   ],
   [
    "processual_penal",
    "Lei nº 12.850/2013"
   ],
   [
    "processual_penal",
    "Lei nº 11.343/2006"
   ],
   [
    "processual_penal",
    "Decreto-Lei nº 201/1967"
   ],
   [
    "processual_penal",
    "Lei nº 11.101/2005"
   ],
   [
    "processual_penal",
    "Lei nº 13.105/2015"
   ],
   [
    "processual_penal",
    "Decreto-Lei nº 3.689/1941"
   ],
   [
    "processual_penal",
    "Lei nº 4.737/1965"
   ],
   [
    "processual_penal",
    "Lei nº 7.960/1989"
   ],
   [
    "processual_penal",
    "Decreto-Lei nº 3.240/1941"
   ],
   [
    "constitucional",
    "Emenda Constitucional nº 45/2004"
   ],
   [
    "constitucional",
    "CF/1988"
   ],
   [
    "eleitoral",
    "Lei Complementar nº 64/1990"
   ],
   [
    "eleitoral",
    "Lei nº 9.096/1995"
   ],
   [
    "eleitoral",
    "Lei nº 9.504/1997"
   ],
   [
    "eleitoral",
    "Lei Complementar nº 86/1996"
   ],
   [
    "eleitoral",
    "Lei nº 4.737/1965"
   ],
   [
    "eleitoral",
    "Lei nº 6.091/1974"
   ],
   [
    "eleitoral",
    "Lei nº 6.996/1982"
   ],
   [
    "empresarial",
    "Lei nº 7.913/1989"
   ],
   [
    "empresarial",
    "Lei nº 11.101/2005"
   ],
   [
    "empresarial",
    "Lei Complementar nº 123/2006"
   ],
   [
    "empresarial",
    "Decreto nº 2.044/1908"
   ],
   [
    "empresarial",
    "Lei nº 7.357/1985"
   ],
   [
    "empresarial",
    "Lei nº 5.474/1968"
   ],
   [
    "empresarial",
    "Decreto-Lei nº 167/1967"
   ],
   [
    "empresarial",
    "Lei nº 6.404/1976"
   ],
   [
    "empresarial",
    "Lei nº 6.024/1974"
   ],
   [
    "empresarial",
    "Lei nº 9.279/1996"
   ],
   [
    "empresarial",
    "Lei nº 9.609/1998"
   ],
   [
    "empresarial",
    "Lei nº 8.934/1994"
   ],
   [
    "empresarial",
    "Lei nº 12.529/2011"
   ],
   [
    "empresarial",
    "Lei nº 4.886/1965"
   ],
   [
    "empresarial",
    "Lei nº 14.193/2021"
   ],
   [
    "empresarial",
    "Lei Complementar nº 182/2021"
   ],
   [
    "tributario",
    "Lei nº 6.830/1980"
   ],
   [
    "tributario",
    "Lei Complementar nº 101/2000"
   ],
   [
    "tributario",
    "Lei nº 5.172/1966"
   ],
   [
    "tributario",
    "Lei nº 6.537/1973"
   ],
   [
    "tributario",
    "Emenda Constitucional nº 132/2023"
   ],
   [
    "ambiental",
    "Lei nº 11.445/2007"
   ],
   [
    "ambiental",
    "Lei nº 14.026/2020"
   ],
   [
    "ambiental",
    "Decreto nº 7.217/2010"
   ],
   [
    "ambiental",
    "Lei nº 13.123/2015"
   ],
   [
    "ambiental",
    "Lei nº 10.257/2001"
   ],
   [
    "ambiental",
    "Lei nº 12.651/2012"
   ],
   [
    "ambiental",
    "Lei nº 12.305/2010"
   ],
   [
    "ambiental",
    "Lei nº 9.985/2000"
   ],
   [
    "ambiental",
    "Lei nº 9.433/1997"
   ],
   [
    "ambiental",
    "Lei nº 12.187/2009"
   ],
   [
    "ambiental",
    "Lei nº 11.107/2005"
   ],
   [
    "ambiental",
    "Lei nº 11.105/2005"
   ],
   [
    "ambiental",
    "Lei nº 9.795/1999"
   ],
   [
    "ambiental",
    "Lei nº 9.966/2000"
   ],
   [
    "ambiental",
    "Lei nº 11.284/2006"
   ],
   [
    "ambiental",
    "Lei nº 11.428/2006"
   ],
   [
    "ambiental",
    "Lei Complementar nº 140/2011"
   ],
   [
    "ambiental",
    "Lei nº 14.119/2021"
   ],
   [
    "ambiental",
    "Lei nº 15.190/2025"
   ],
   [
    "ambiental",
    "Lei nº 15.300/2025"
   ],
   [
    "ambiental",
    "Lei nº 13.465/2017"
   ],
   [
    "ambiental",
    "Lei nº 12.608/2012"
   ],
   [
    "ambiental",
    "Lei nº 14.904/2024"
   ],
   [
    "administrativo",
    "Decreto-Lei nº 4.597/1942"
   ],
   [
    "administrativo",
    "Decreto-Lei nº 3.365/1941"
   ],
   [
    "administrativo",
    "Lei nº 8.429/1992"
   ],
   [
    "administrativo",
    "Lei nº 14.230/2021"
   ],
   [
    "administrativo",
    "Lei nº 8.080/1990"
   ],
   [
    "administrativo",
    "Lei nº 9.394/1996"
   ],
   [
    "administrativo",
    "Lei nº 4.320/1964"
   ],
   [
    "administrativo",
    "Lei Complementar nº 101/2000"
   ],
   [
    "administrativo",
    "Lei Complementar nº 35/1979"
   ],
   [
    "administrativo",
    "Lei nº 12.527/2011"
   ],
   [
    "administrativo",
    "Lei nº 12.846/2013"
   ],
   [
    "administrativo",
    "Lei nº 14.133/2021"
   ],
   [
    "administrativo",
    "Lei nº 8.987/1995"
   ],
   [
    "administrativo",
    "Lei nº 11.079/2004"
   ],
   [
    "administrativo",
    "Lei nº 13.303/2016"
   ],
   [
    "administrativo",
    "Decreto-Lei nº 200/1967"
   ],
   [
    "previdenciario",
    "Lei nº 8.742/1993"
   ],
   [
    "previdenciario",
    "Lei nº 12.435/2011"
   ],
   [
    "humanos",
    "Lei nº 12.288/2010"
   ],
   [
    "humanos",
    "Lei nº 7.853/1989"
   ],
   [
    "humanos",
    "Lei nº 10.098/2000"
   ],
   [
    "humanos",
    "Decreto nº 6.949/2009"
   ],
   [
    "humanos",
    "Decreto nº 678/1992"
   ],
   [
    "humanos",
    "Decreto nº 592/1992"
   ],
   [
    "humanos",
    "Lei nº 7.716/1989"
   ]
  ],
  "extras": [
   "Lei nº 16.105/2015",
   "Lei nº 6.840/1980",
   "Lei nº 20.694/2019",
   "Lei nº 16.497/2009",
   "Decreto nº 9.130/2017",
   "Lei nº 20.756/2020",
   "Lei Complementar nº 161/2020",
   "Lei nº 21.868/2022",
   "Lei nº 14.376/2002",
   "Resolução CNJ nº 425/2021",
   "Resolução CNJ nº 348/2020",
   "Resolução CNJ nº 369/2021",
   "Resolução CNJ nº 165/2012",
   "Resolução CNJ nº 414/2021",
   "Resolução CNJ nº 289/2019",
   "Resolução nº 170/2021",
   "Resolução CNJ nº 345/2020",
   "Resolução CNJ nº 372/2021",
   "Resolução CNJ nº 385/2021",
   "Resolução CNJ nº 398/2021",
   "Lei nº 14.249/2010",
   "Lei nº 6.123/1968",
   "Lei nº 11.781/2000",
   "Lei nº 17.116/2020",
   "Lei Complementar nº 100/2007",
   "Lei Complementar nº 28/2000",
   "Resolução CNJ nº 452/2022",
   "Resolução CNJ nº 295/2019",
   "Resolução nº 170/2014",
   "Resolução CNJ nº 213/2015",
   "Resolução CNJ nº 427/2021",
   "Resolução CNJ nº 484/2022",
   "Lei nº 7.356/1980",
   "Resolução nº 510/2023",
   "Resolução CNJ nº 598/2024"
  ],
  "editais": [
   "tjgo-59",
   "tjpe-2026",
   "tjrs-2026"
  ]
 },
 {
  "id": "carreira-promotor",
  "tipo": "carreira",
  "secao": "carreira",
  "sigla": "Carreira",
  "cargo": "união dos editais: MPSP + MPMG",
  "orgao": "Reúne o conteúdo de 2 editais",
  "titulo": "Promotor de Justiça",
  "edital": "MPSP: 97º Concurso de Ingresso na Carreira · MPMG: LXI Concurso para Ingresso na Carreira",
  "grupos": [
   {
    "nome": "Disciplinas (união dos editais)",
    "disciplinas": [
     "Direito Penal — 1 de 2 editais",
     "Direito Processual Penal — 2 de 2 editais",
     "Direito Civil — 2 de 2 editais",
     "Direito Processual Civil — 2 de 2 editais",
     "Direito Constitucional — 2 de 2 editais",
     "Direito da Infância e da Juventude — 1 de 2 editais",
     "Direito Comercial e Empresarial — 1 de 2 editais",
     "Tutela de Interesses Difusos e Coletivos — 1 de 2 editais",
     "Direitos Humanos — 1 de 2 editais",
     "Direito Administrativo — 2 de 2 editais",
     "Direito Eleitoral — 2 de 2 editais",
     "Direito Tributário e Financeiro — 1 de 2 editais",
     "Direito Penal e Criminologia — 1 de 2 editais",
     "Direito Material Coletivo (direitos difusos e coletivos, direitos humanos, infância e juventude, consumidor, ambiental e outros) — 1 de 2 editais"
    ]
   }
  ],
  "leis": [
   [
    "civil",
    "Lei nº 13.709/2018"
   ],
   [
    "civil",
    "Lei nº 12.965/2014"
   ],
   [
    "civil",
    "Lei nº 10.406/2002"
   ],
   [
    "civil",
    "Decreto-Lei nº 4.657/1942"
   ],
   [
    "civil",
    "Lei nº 10.741/2003"
   ],
   [
    "civil",
    "Lei nº 6.015/1973"
   ],
   [
    "civil",
    "Lei nº 13.146/2015"
   ],
   [
    "civil",
    "Lei nº 6.766/1979"
   ],
   [
    "civil",
    "Lei nº 9.278/1996"
   ],
   [
    "civil",
    "Lei nº 8.009/1990"
   ],
   [
    "civil",
    "Lei nº 14.195/2021"
   ],
   [
    "civil",
    "Lei nº 4.380/1964"
   ],
   [
    "civil",
    "Lei nº 9.514/1997"
   ],
   [
    "civil",
    "Lei nº 8.245/1991"
   ],
   [
    "civil",
    "Lei nº 4.591/1964"
   ],
   [
    "civil",
    "Lei nº 5.478/1968"
   ],
   [
    "civil",
    "Lei nº 8.560/1992"
   ],
   [
    "civil",
    "Lei nº 11.804/2008"
   ],
   [
    "civil",
    "Lei nº 13.853/2019"
   ],
   [
    "civil",
    "Lei nº 13.874/2019"
   ],
   [
    "civil",
    "Lei nº 14.010/2020"
   ],
   [
    "civil",
    "Lei nº 1.060/1950"
   ],
   [
    "civil",
    "Lei nº 13.786/2018"
   ],
   [
    "processual_civil",
    "Lei nº 12.016/2009"
   ],
   [
    "processual_civil",
    "Lei nº 4.717/1965"
   ],
   [
    "processual_civil",
    "Lei nº 7.347/1985"
   ],
   [
    "processual_civil",
    "Lei nº 9.507/1997"
   ],
   [
    "processual_civil",
    "Lei nº 9.307/1996"
   ],
   [
    "processual_civil",
    "Lei nº 13.140/2015"
   ],
   [
    "processual_civil",
    "Lei nº 9.099/1995"
   ],
   [
    "processual_civil",
    "Lei nº 13.105/2015"
   ],
   [
    "processual_civil",
    "Lei nº 13.655/2018"
   ],
   [
    "processual_civil",
    "Lei nº 8.038/1990"
   ],
   [
    "processual_civil",
    "Lei nº 11.417/2006"
   ],
   [
    "processual_civil",
    "Lei nº 11.419/2006"
   ],
   [
    "consumidor",
    "Lei nº 8.078/1990"
   ],
   [
    "consumidor",
    "Lei nº 14.181/2021"
   ],
   [
    "consumidor",
    "Lei nº 9.656/1998"
   ],
   [
    "crianca",
    "Decreto nº 99.710/1990"
   ],
   [
    "crianca",
    "Lei nº 8.069/1990"
   ],
   [
    "crianca",
    "Lei nº 13.431/2017"
   ],
   [
    "crianca",
    "Lei nº 14.344/2022"
   ],
   [
    "crianca",
    "Lei nº 10.216/2001"
   ],
   [
    "crianca",
    "Lei nº 13.257/2016"
   ],
   [
    "crianca",
    "Lei nº 13.185/2015"
   ],
   [
    "penal",
    "Lei nº 7.716/1989"
   ],
   [
    "penal",
    "Decreto-Lei nº 2.848/1940"
   ],
   [
    "penal",
    "Lei nº 7.210/1984"
   ],
   [
    "penal",
    "Lei nº 8.429/1992"
   ],
   [
    "penal",
    "Lei nº 10.826/2003"
   ],
   [
    "penal",
    "Lei nº 8.072/1990"
   ],
   [
    "penal",
    "Lei nº 12.850/2013"
   ],
   [
    "penal",
    "Lei nº 9.613/1998"
   ],
   [
    "penal",
    "Lei nº 9.455/1997"
   ],
   [
    "penal",
    "Lei nº 13.869/2019"
   ],
   [
    "penal",
    "Lei nº 9.503/1997"
   ],
   [
    "penal",
    "Decreto-Lei nº 3.688/1941"
   ],
   [
    "penal",
    "Lei nº 13.260/2016"
   ],
   [
    "penal",
    "Lei nº 8.137/1990"
   ],
   [
    "penal",
    "Decreto-Lei nº 201/1967"
   ],
   [
    "penal",
    "Lei nº 7.492/1986"
   ],
   [
    "penal",
    "Lei nº 8.176/1991"
   ],
   [
    "penal",
    "Lei nº 9.605/1998"
   ],
   [
    "penal",
    "Lei nº 11.340/2006"
   ],
   [
    "penal",
    "Lei nº 11.343/2006"
   ],
   [
    "penal",
    "Lei nº 12.694/2012"
   ],
   [
    "penal",
    "Lei nº 13.344/2016"
   ],
   [
    "penal",
    "Lei nº 14.532/2023"
   ],
   [
    "penal",
    "Lei nº 9.434/1997"
   ],
   [
    "penal",
    "Lei nº 13.964/2019"
   ],
   [
    "processual_penal",
    "Lei nº 7.210/1984"
   ],
   [
    "processual_penal",
    "Lei nº 11.101/2005"
   ],
   [
    "processual_penal",
    "Lei nº 9.099/1995"
   ],
   [
    "processual_penal",
    "Lei nº 12.850/2013"
   ],
   [
    "processual_penal",
    "Lei nº 9.296/1996"
   ],
   [
    "processual_penal",
    "Decreto-Lei nº 3.689/1941"
   ],
   [
    "processual_penal",
    "Decreto-Lei nº 3.240/1941"
   ],
   [
    "processual_penal",
    "Decreto-Lei nº 3.931/1941"
   ],
   [
    "processual_penal",
    "Decreto-Lei nº 1.002/1969"
   ],
   [
    "processual_penal",
    "Lei nº 1.579/1952"
   ],
   [
    "processual_penal",
    "Lei nº 4.737/1965"
   ],
   [
    "processual_penal",
    "Lei nº 5.249/1967"
   ],
   [
    "processual_penal",
    "Decreto-Lei nº 201/1967"
   ],
   [
    "processual_penal",
    "Lei nº 7.960/1989"
   ],
   [
    "processual_penal",
    "Lei nº 8.658/1993"
   ],
   [
    "processual_penal",
    "Lei nº 9.807/1999"
   ],
   [
    "processual_penal",
    "Lei nº 11.340/2006"
   ],
   [
    "processual_penal",
    "Lei nº 11.343/2006"
   ],
   [
    "processual_penal",
    "Lei nº 11.671/2008"
   ],
   [
    "processual_penal",
    "Lei nº 12.037/2009"
   ],
   [
    "processual_penal",
    "Lei nº 13.105/2015"
   ],
   [
    "processual_penal",
    "Lei nº 13.431/2017"
   ],
   [
    "constitucional",
    "CF/1988"
   ],
   [
    "constitucional",
    "Lei nº 13.300/2016"
   ],
   [
    "eleitoral",
    "Lei Complementar nº 64/1990"
   ],
   [
    "eleitoral",
    "Lei nº 9.096/1995"
   ],
   [
    "eleitoral",
    "Lei nº 4.737/1965"
   ],
   [
    "eleitoral",
    "Lei nº 9.504/1997"
   ],
   [
    "empresarial",
    "Lei nº 11.101/2005"
   ],
   [
    "empresarial",
    "Lei nº 6.404/1976"
   ],
   [
    "empresarial",
    "Lei nº 9.279/1996"
   ],
   [
    "empresarial",
    "Lei Complementar nº 123/2006"
   ],
   [
    "empresarial",
    "Lei nº 8.934/1994"
   ],
   [
    "empresarial",
    "Lei nº 7.913/1989"
   ],
   [
    "empresarial",
    "Lei nº 12.529/2011"
   ],
   [
    "tributario",
    "Lei nº 6.830/1980"
   ],
   [
    "tributario",
    "Lei nº 8.397/1992"
   ],
   [
    "tributario",
    "Lei Complementar nº 101/2000"
   ],
   [
    "tributario",
    "Lei Complementar nº 105/2001"
   ],
   [
    "tributario",
    "Lei nº 5.172/1966"
   ],
   [
    "ambiental",
    "Lei nº 10.257/2001"
   ],
   [
    "ambiental",
    "Lei nº 9.985/2000"
   ],
   [
    "ambiental",
    "Lei nº 11.445/2007"
   ],
   [
    "ambiental",
    "Lei nº 11.107/2005"
   ],
   [
    "ambiental",
    "Lei nº 11.105/2005"
   ],
   [
    "ambiental",
    "Lei nº 12.334/2010"
   ],
   [
    "ambiental",
    "Lei nº 14.755/2023"
   ],
   [
    "ambiental",
    "Medida Provisória nº 2.220/2001"
   ],
   [
    "ambiental",
    "Lei nº 13.465/2017"
   ],
   [
    "ambiental",
    "Decreto nº 9.310/2018"
   ],
   [
    "ambiental",
    "Lei nº 12.587/2012"
   ],
   [
    "ambiental",
    "Lei nº 11.124/2005"
   ],
   [
    "ambiental",
    "Lei nº 11.977/2009"
   ],
   [
    "ambiental",
    "Lei nº 13.425/2017"
   ],
   [
    "ambiental",
    "Lei nº 12.651/2012"
   ],
   [
    "ambiental",
    "Lei nº 12.305/2010"
   ],
   [
    "ambiental",
    "Lei nº 9.433/1997"
   ],
   [
    "administrativo",
    "Lei nº 4.320/1964"
   ],
   [
    "administrativo",
    "Decreto nº 11.129/2022"
   ],
   [
    "administrativo",
    "Lei Complementar nº 101/2000"
   ],
   [
    "administrativo",
    "Lei nº 8.429/1992"
   ],
   [
    "administrativo",
    "Lei nº 14.133/2021"
   ],
   [
    "administrativo",
    "Lei nº 12.846/2013"
   ],
   [
    "administrativo",
    "Lei nº 12.527/2011"
   ],
   [
    "administrativo",
    "Lei nº 11.079/2004"
   ],
   [
    "administrativo",
    "Lei nº 13.019/2014"
   ],
   [
    "administrativo",
    "Lei nº 8.987/1995"
   ],
   [
    "administrativo",
    "Lei nº 10.520/2002"
   ],
   [
    "administrativo",
    "Decreto nº 7.892/2013"
   ],
   [
    "administrativo",
    "Lei nº 14.129/2021"
   ],
   [
    "administrativo",
    "Lei nº 8.625/1993"
   ],
   [
    "administrativo",
    "Lei Complementar nº 75/1993"
   ],
   [
    "administrativo",
    "Lei nº 8.906/1994"
   ],
   [
    "administrativo",
    "Lei nº 14.230/2021"
   ],
   [
    "administrativo",
    "Lei nº 13.979/2020"
   ],
   [
    "administrativo",
    "Lei nº 9.394/1996"
   ],
   [
    "administrativo",
    "Lei nº 13.301/2016"
   ],
   [
    "administrativo",
    "Decreto nº 8.420/2015"
   ],
   [
    "administrativo",
    "Decreto-Lei nº 3.365/1941"
   ],
   [
    "previdenciario",
    "Lei nº 8.742/1993"
   ],
   [
    "previdenciario",
    "Lei nº 8.213/1991"
   ],
   [
    "previdenciario",
    "Lei nº 8.212/1991"
   ],
   [
    "humanos",
    "Decreto nº 678/1992"
   ],
   [
    "humanos",
    "Decreto nº 9.571/2018"
   ],
   [
    "humanos",
    "Decreto nº 6.949/2009"
   ],
   [
    "humanos",
    "Decreto nº 65.810/1969"
   ],
   [
    "humanos",
    "Lei nº 7.716/1989"
   ],
   [
    "humanos",
    "Decreto nº 4.886/2003"
   ],
   [
    "humanos",
    "Lei nº 12.288/2010"
   ],
   [
    "humanos",
    "Decreto nº 8.136/2013"
   ],
   [
    "humanos",
    "Decreto nº 3.956/2001"
   ],
   [
    "humanos",
    "Decreto nº 3.298/1999"
   ],
   [
    "humanos",
    "Decreto nº 7.037/2009"
   ],
   [
    "humanos",
    "Lei nº 11.346/2006"
   ],
   [
    "humanos",
    "Lei nº 10.639/2003"
   ],
   [
    "humanos",
    "Lei nº 11.645/2008"
   ],
   [
    "humanos",
    "Lei nº 7.853/1989"
   ]
  ],
  "extras": [
   "Decreto nº 7.646/2011",
   "Decreto nº 11.793/2023",
   "Resolução CNMP nº 118/2014",
   "Resolução CNMP nº 198/2019",
   "Resolução CNJ nº 485/2023",
   "Resolução CNMP nº 230/2021",
   "Resolução nº 109/2009",
   "Resolução CNMP nº 228/2021",
   "Resolução CNMP nº 154/2016",
   "Resolução CNJ nº 348/2020",
   "Lei nº 14.167/2002",
   "Lei nº 13.994/2001",
   "Lei nº 13.209/1999",
   "Lei Complementar nº 34/1994",
   "Lei nº 5.256/1967",
   "Lei nº 13.097/2015",
   "Lei nº 14.341/2022",
   "Lei nº 24.844/2024",
   "Lei nº 23.291/2019",
   "Lei nº 23.795/2021",
   "Lei nº 14.852/2024",
   "Lei nº 13.392/1999",
   "Decreto nº 83.936/1979",
   "Resolução nº 780/2014",
   "Resolução CNMP nº 179/2017",
   "Resolução CNMP nº 23/2007",
   "Resolução CNMP nº 174/2017",
   "Resolução CNMP nº 164/2017"
  ],
  "editais": [
   "mpsp-97",
   "mpmg-61"
  ]
 },
 {
  "id": "exame-enam",
  "tipo": "carreira",
  "secao": "exame",
  "sigla": "Exame",
  "cargo": "união dos editais: ENAM",
  "orgao": "Reúne o conteúdo de 1 edital",
  "titulo": "ENAM — Exame Nacional da Magistratura",
  "edital": "ENAM: 6º Exame Nacional da Magistratura",
  "grupos": [
   {
    "nome": "Disciplinas (união dos editais)",
    "disciplinas": [
     "Direito Constitucional",
     "Direito Administrativo",
     "Noções Gerais de Direito e Formação Humanística",
     "Direitos Humanos",
     "Direito Processual Civil",
     "Direito Civil",
     "Direito Empresarial",
     "Direito Penal"
    ]
   }
  ],
  "leis": [
   [
    "civil",
    "Lei nº 13.709/2018"
   ],
   [
    "civil",
    "Lei nº 13.874/2019"
   ],
   [
    "civil",
    "Lei nº 14.711/2023"
   ],
   [
    "civil",
    "Lei nº 14.195/2021"
   ],
   [
    "civil",
    "Lei nº 10.406/2002"
   ],
   [
    "civil",
    "Decreto-Lei nº 4.657/1942"
   ],
   [
    "civil",
    "Lei nº 10.741/2003"
   ],
   [
    "civil",
    "Lei nº 13.146/2015"
   ],
   [
    "civil",
    "Lei nº 12.965/2014"
   ],
   [
    "civil",
    "Lei nº 6.766/1979"
   ],
   [
    "civil",
    "Lei nº 1.060/1950"
   ],
   [
    "civil",
    "Lei nº 9.278/1996"
   ],
   [
    "civil",
    "Lei nº 8.009/1990"
   ],
   [
    "civil",
    "Lei nº 8.245/1991"
   ],
   [
    "processual_civil",
    "Lei nº 13.655/2018"
   ],
   [
    "processual_civil",
    "Lei nº 12.016/2009"
   ],
   [
    "processual_civil",
    "Lei nº 4.717/1965"
   ],
   [
    "processual_civil",
    "Lei nº 7.347/1985"
   ],
   [
    "processual_civil",
    "Lei nº 9.507/1997"
   ],
   [
    "processual_civil",
    "Lei nº 9.307/1996"
   ],
   [
    "processual_civil",
    "Lei nº 13.140/2015"
   ],
   [
    "processual_civil",
    "Lei nº 9.099/1995"
   ],
   [
    "processual_civil",
    "Lei nº 10.259/2001"
   ],
   [
    "processual_civil",
    "Lei nº 12.153/2009"
   ],
   [
    "processual_civil",
    "Lei nº 13.105/2015"
   ],
   [
    "penal",
    "Decreto-Lei nº 2.848/1940"
   ],
   [
    "penal",
    "Lei nº 8.429/1992"
   ],
   [
    "penal",
    "Lei nº 9.613/1998"
   ],
   [
    "processual_penal",
    "Lei nº 11.101/2005"
   ],
   [
    "processual_penal",
    "Lei nº 9.099/1995"
   ],
   [
    "processual_penal",
    "Lei nº 9.296/1996"
   ],
   [
    "processual_penal",
    "Decreto-Lei nº 3.689/1941"
   ],
   [
    "constitucional",
    "CF/1988"
   ],
   [
    "empresarial",
    "Lei Complementar nº 123/2006"
   ],
   [
    "empresarial",
    "Lei nº 6.404/1976"
   ],
   [
    "empresarial",
    "Lei nº 11.101/2005"
   ],
   [
    "empresarial",
    "Lei nº 9.279/1996"
   ],
   [
    "administrativo",
    "Decreto-Lei nº 3.365/1941"
   ],
   [
    "administrativo",
    "Lei nº 13.460/2017"
   ],
   [
    "administrativo",
    "Lei nº 13.303/2016"
   ],
   [
    "administrativo",
    "Lei nº 13.848/2019"
   ],
   [
    "administrativo",
    "Lei nº 14.230/2021"
   ],
   [
    "administrativo",
    "Lei nº 8.429/1992"
   ],
   [
    "administrativo",
    "Lei nº 14.133/2021"
   ],
   [
    "administrativo",
    "Lei nº 8.987/1995"
   ],
   [
    "humanos",
    "Decreto nº 678/1992"
   ],
   [
    "humanos",
    "Decreto nº 6.949/2009"
   ],
   [
    "humanos",
    "Decreto nº 592/1992"
   ]
  ],
  "extras": [],
  "editais": [
   "enam-2026-2"
  ]
 },
 {
  "id": "carreira-delegado",
  "tipo": "carreira",
  "secao": "carreira",
  "sigla": "Carreira",
  "cargo": "união dos editais: PF",
  "orgao": "Reúne o conteúdo de 1 edital",
  "titulo": "Delegado",
  "edital": "PF: Concurso Policial — Delegado de Polícia Federal",
  "grupos": [
   {
    "nome": "Disciplinas (união dos editais)",
    "disciplinas": [
     "Direito Administrativo",
     "Direito Constitucional",
     "Direitos Humanos",
     "Direito Civil",
     "Direito Processual Civil",
     "Direito Empresarial",
     "Direito Internacional Público e Cooperação Internacional",
     "Direito Penal",
     "Direito Processual Penal",
     "Direito Previdenciário",
     "Direito Financeiro e Tributário",
     "Direito Ambiental"
    ]
   }
  ],
  "leis": [
   [
    "civil",
    "Lei nº 13.146/2015"
   ],
   [
    "civil",
    "Lei nº 10.741/2003"
   ],
   [
    "civil",
    "Decreto-Lei nº 4.657/1942"
   ],
   [
    "civil",
    "Lei nº 10.406/2002"
   ],
   [
    "processual_civil",
    "Lei nº 9.099/1995"
   ],
   [
    "processual_civil",
    "Lei nº 13.105/2015"
   ],
   [
    "processual_civil",
    "Lei nº 12.016/2009"
   ],
   [
    "processual_civil",
    "Lei nº 4.717/1965"
   ],
   [
    "processual_civil",
    "Lei nº 7.347/1985"
   ],
   [
    "processual_civil",
    "Lei nº 9.507/1997"
   ],
   [
    "processual_civil",
    "Lei nº 9.307/1996"
   ],
   [
    "processual_civil",
    "Lei nº 13.140/2015"
   ],
   [
    "consumidor",
    "Lei nº 8.078/1990"
   ],
   [
    "crianca",
    "Lei nº 8.069/1990"
   ],
   [
    "crianca",
    "Lei nº 13.257/2016"
   ],
   [
    "penal",
    "Lei nº 8.429/1992"
   ],
   [
    "penal",
    "Decreto nº 5.015/2004"
   ],
   [
    "penal",
    "Decreto nº 5.017/2004"
   ],
   [
    "penal",
    "Decreto nº 154/1991"
   ],
   [
    "penal",
    "Decreto nº 5.016/2004"
   ],
   [
    "penal",
    "Decreto nº 5.687/2006"
   ],
   [
    "penal",
    "Lei nº 11.343/2006"
   ],
   [
    "penal",
    "Lei nº 12.850/2013"
   ],
   [
    "penal",
    "Lei nº 7.492/1986"
   ],
   [
    "penal",
    "Lei nº 8.137/1990"
   ],
   [
    "penal",
    "Lei nº 9.613/1998"
   ],
   [
    "penal",
    "Lei nº 8.176/1991"
   ],
   [
    "penal",
    "Lei nº 8.072/1990"
   ],
   [
    "penal",
    "Lei nº 7.716/1989"
   ],
   [
    "penal",
    "Lei nº 9.455/1997"
   ],
   [
    "penal",
    "Lei nº 9.605/1998"
   ],
   [
    "penal",
    "Decreto-Lei nº 201/1967"
   ],
   [
    "penal",
    "Lei nº 13.869/2019"
   ],
   [
    "penal",
    "Lei nº 10.826/2003"
   ],
   [
    "penal",
    "Lei nº 6.001/1973"
   ],
   [
    "penal",
    "Decreto nº 11.491/2023"
   ],
   [
    "penal",
    "Lei nº 7.210/1984"
   ],
   [
    "penal",
    "Lei nº 12.737/2012"
   ],
   [
    "penal",
    "Decreto-Lei nº 2.848/1940"
   ],
   [
    "processual_penal",
    "Lei nº 11.343/2006"
   ],
   [
    "processual_penal",
    "Lei nº 12.850/2013"
   ],
   [
    "processual_penal",
    "Decreto-Lei nº 201/1967"
   ],
   [
    "processual_penal",
    "Lei nº 11.101/2005"
   ],
   [
    "processual_penal",
    "Lei nº 9.296/1996"
   ],
   [
    "processual_penal",
    "Lei nº 12.037/2009"
   ],
   [
    "processual_penal",
    "Lei nº 4.737/1965"
   ],
   [
    "processual_penal",
    "Lei nº 7.210/1984"
   ],
   [
    "processual_penal",
    "Lei nº 9.099/1995"
   ],
   [
    "processual_penal",
    "Lei nº 10.446/2002"
   ],
   [
    "processual_penal",
    "Lei nº 12.830/2013"
   ],
   [
    "processual_penal",
    "Lei nº 13.105/2015"
   ],
   [
    "processual_penal",
    "Decreto-Lei nº 3.689/1941"
   ],
   [
    "constitucional",
    "Lei nº 1.079/1950"
   ],
   [
    "constitucional",
    "CF/1988"
   ],
   [
    "empresarial",
    "Lei nº 11.101/2005"
   ],
   [
    "empresarial",
    "Lei nº 6.404/1976"
   ],
   [
    "empresarial",
    "Lei nº 9.279/1996"
   ],
   [
    "tributario",
    "Lei Complementar nº 101/2000"
   ],
   [
    "tributario",
    "Lei nº 5.172/1966"
   ],
   [
    "ambiental",
    "Lei nº 9.985/2000"
   ],
   [
    "ambiental",
    "Lei nº 11.445/2007"
   ],
   [
    "administrativo",
    "Lei nº 9.784/1999"
   ],
   [
    "administrativo",
    "Lei nº 14.133/2021"
   ],
   [
    "administrativo",
    "Lei nº 8.429/1992"
   ],
   [
    "administrativo",
    "Lei nº 8.112/1990"
   ],
   [
    "administrativo",
    "Lei nº 4.878/1965"
   ],
   [
    "administrativo",
    "Lei Complementar nº 101/2000"
   ],
   [
    "administrativo",
    "Lei nº 9.266/1996"
   ],
   [
    "administrativo",
    "Lei nº 14.967/2024"
   ],
   [
    "administrativo",
    "Decreto-Lei nº 3.365/1941"
   ],
   [
    "administrativo",
    "Lei nº 8.987/1995"
   ],
   [
    "previdenciario",
    "Lei nº 8.212/1991"
   ],
   [
    "previdenciario",
    "Lei nº 8.213/1991"
   ],
   [
    "previdenciario",
    "Decreto nº 3.048/1999"
   ],
   [
    "humanos",
    "Decreto nº 7.037/2009"
   ],
   [
    "humanos",
    "Lei nº 13.060/2014"
   ],
   [
    "humanos",
    "Decreto nº 12.341/2024"
   ],
   [
    "humanos",
    "Lei nº 13.445/2017"
   ],
   [
    "humanos",
    "Lei nº 7.716/1989"
   ],
   [
    "humanos",
    "Lei nº 9.474/1997"
   ]
  ],
  "extras": [
   "Decreto nº 5.480/2005",
   "Decreto nº 11.102/2022",
   "Lei nº 15.047/2024",
   "Decreto nº 59.310/1966",
   "Lei nº 11.358/2006",
   "Decreto nº 3.468/2000",
   "Decreto nº 5.941/2006",
   "Decreto nº 6.340/2008",
   "Decreto nº 8.833/2016",
   "Decreto nº 12.337/2024",
   "Lei nº 5.553/1968",
   "Lei nº 5.250/1967"
  ],
  "editais": [
   "pf-delegado-2025"
  ]
 },
 {
  "id": "carreira-defensor",
  "tipo": "carreira",
  "secao": "carreira",
  "sigla": "Carreira",
  "cargo": "união dos editais: DPU + DPE-BA + DPE-SP",
  "orgao": "Reúne o conteúdo de 3 editais",
  "titulo": "Defensor Público",
  "edital": "DPU: Concurso para Defensor Público Federal · DPE-BA: IX Concurso para Defensor Público · DPE-SP: IX Concurso para Defensor Público",
  "grupos": [
   {
    "nome": "Disciplinas (união dos editais)",
    "disciplinas": [
     "Direito Civil — 3 de 3 editais",
     "Direito Empresarial — 2 de 3 editais",
     "Direito do Consumidor — 2 de 3 editais",
     "Direito Ambiental — 1 de 3 editais",
     "Direito Processual Civil — 3 de 3 editais",
     "Direito Tributário — 2 de 3 editais",
     "Direito Penal e Criminologia — 1 de 3 editais",
     "Direito Processual Penal — 2 de 3 editais",
     "Direito Penal Militar — 1 de 3 editais",
     "Direito Processual Penal Militar — 1 de 3 editais",
     "Princípios Institucionais da Defensoria Pública — 1 de 3 editais",
     "Direito Constitucional — 3 de 3 editais",
     "Direito Internacional — 1 de 3 editais",
     "Direitos Humanos — 3 de 3 editais",
     "Filosofia do Direito — 1 de 3 editais",
     "Noções de Sociologia Jurídica — 1 de 3 editais",
     "Direito Eleitoral — 1 de 3 editais",
     "Direito Administrativo — 3 de 3 editais",
     "Direito do Trabalho — 1 de 3 editais",
     "Direito Processual do Trabalho — 1 de 3 editais",
     "Direito Previdenciário e da Assistência Social — 1 de 3 editais",
     "Direito Penal — 2 de 3 editais",
     "Direito Processual Penal e Execução Penal — 1 de 3 editais",
     "Direito da Seguridade Social — 1 de 3 editais",
     "Direito da Criança e do Adolescente — 2 de 3 editais",
     "Direito Ambiental e Urbanístico — 1 de 3 editais",
     "Direito Antidiscriminatório (ênfase na população negra e povos tradicionais) — 1 de 3 editais",
     "Direitos Difusos e Coletivos — 1 de 3 editais",
     "Princípios e Atribuições Institucionais da Defensoria Pública do Estado — 1 de 3 editais",
     "Filosofia do Direito e Sociologia Jurídica — 1 de 3 editais"
    ]
   }
  ],
  "leis": [
   [
    "civil",
    "Lei nº 1.060/1950"
   ],
   [
    "civil",
    "Decreto-Lei nº 4.657/1942"
   ],
   [
    "civil",
    "Lei nº 10.741/2003"
   ],
   [
    "civil",
    "Lei nº 9.278/1996"
   ],
   [
    "civil",
    "Lei nº 10.406/2002"
   ],
   [
    "civil",
    "Lei nº 13.709/2018"
   ],
   [
    "civil",
    "Lei nº 13.146/2015"
   ],
   [
    "civil",
    "Lei nº 6.766/1979"
   ],
   [
    "civil",
    "Lei nº 601/1850"
   ],
   [
    "civil",
    "Lei nº 6.015/1973"
   ],
   [
    "civil",
    "Lei nº 8.245/1991"
   ],
   [
    "civil",
    "Lei nº 8.009/1990"
   ],
   [
    "civil",
    "Lei nº 5.478/1968"
   ],
   [
    "civil",
    "Lei nº 11.804/2008"
   ],
   [
    "civil",
    "Lei nº 13.874/2019"
   ],
   [
    "civil",
    "Lei nº 14.010/2020"
   ],
   [
    "civil",
    "Lei nº 12.965/2014"
   ],
   [
    "processual_civil",
    "Lei nº 13.105/2015"
   ],
   [
    "processual_civil",
    "Lei nº 12.016/2009"
   ],
   [
    "processual_civil",
    "Lei nº 4.717/1965"
   ],
   [
    "processual_civil",
    "Lei nº 7.347/1985"
   ],
   [
    "processual_civil",
    "Lei nº 9.507/1997"
   ],
   [
    "processual_civil",
    "Lei nº 13.140/2015"
   ],
   [
    "processual_civil",
    "Lei nº 9.099/1995"
   ],
   [
    "processual_civil",
    "Lei nº 11.417/2006"
   ],
   [
    "processual_civil",
    "Lei nº 9.008/1995"
   ],
   [
    "processual_civil",
    "Lei nº 9.307/1996"
   ],
   [
    "processual_civil",
    "Lei nº 12.153/2009"
   ],
   [
    "consumidor",
    "Lei nº 8.078/1990"
   ],
   [
    "consumidor",
    "Decreto nº 2.181/1997"
   ],
   [
    "consumidor",
    "Lei nº 9.656/1998"
   ],
   [
    "consumidor",
    "Lei nº 10.820/2003"
   ],
   [
    "consumidor",
    "Decreto nº 5.903/2006"
   ],
   [
    "consumidor",
    "Lei nº 12.414/2011"
   ],
   [
    "consumidor",
    "Lei Complementar nº 166/2019"
   ],
   [
    "consumidor",
    "Decreto nº 9.936/2019"
   ],
   [
    "consumidor",
    "Decreto nº 11.150/2022"
   ],
   [
    "consumidor",
    "Lei nº 14.790/2023"
   ],
   [
    "crianca",
    "Lei nº 8.069/1990"
   ],
   [
    "crianca",
    "Lei nº 10.216/2001"
   ],
   [
    "crianca",
    "Lei nº 15.211/2025"
   ],
   [
    "crianca",
    "Lei nº 13.257/2016"
   ],
   [
    "crianca",
    "Lei nº 13.185/2015"
   ],
   [
    "crianca",
    "Lei nº 12.594/2012"
   ],
   [
    "crianca",
    "Lei nº 13.431/2017"
   ],
   [
    "crianca",
    "Lei nº 14.344/2022"
   ],
   [
    "crianca",
    "Decreto nº 99.710/1990"
   ],
   [
    "penal",
    "Lei nº 9.605/1998"
   ],
   [
    "penal",
    "Lei nº 8.429/1992"
   ],
   [
    "penal",
    "Lei nº 8.072/1990"
   ],
   [
    "penal",
    "Lei nº 12.850/2013"
   ],
   [
    "penal",
    "Lei nº 9.613/1998"
   ],
   [
    "penal",
    "Lei nº 9.455/1997"
   ],
   [
    "penal",
    "Lei nº 13.869/2019"
   ],
   [
    "penal",
    "Decreto-Lei nº 2.848/1940"
   ],
   [
    "penal",
    "Lei nº 9.503/1997"
   ],
   [
    "penal",
    "Lei nº 10.826/2003"
   ],
   [
    "penal",
    "Decreto nº 9.847/2019"
   ],
   [
    "penal",
    "Lei nº 11.343/2006"
   ],
   [
    "penal",
    "Lei nº 1.521/1951"
   ],
   [
    "penal",
    "Lei nº 7.716/1989"
   ],
   [
    "penal",
    "Lei nº 4.898/1965"
   ],
   [
    "penal",
    "Lei nº 11.340/2006"
   ],
   [
    "penal",
    "Decreto-Lei nº 3.688/1941"
   ],
   [
    "penal",
    "Lei nº 7.210/1984"
   ],
   [
    "penal",
    "Lei nº 14.532/2023"
   ],
   [
    "penal",
    "Lei nº 13.260/2016"
   ],
   [
    "penal",
    "Lei nº 6.001/1973"
   ],
   [
    "penal",
    "Lei nº 13.964/2019"
   ],
   [
    "processual_penal",
    "Lei nº 13.105/2015"
   ],
   [
    "processual_penal",
    "Lei nº 8.457/1992"
   ],
   [
    "processual_penal",
    "Lei nº 11.101/2005"
   ],
   [
    "processual_penal",
    "Lei nº 9.099/1995"
   ],
   [
    "processual_penal",
    "Lei nº 12.850/2013"
   ],
   [
    "processual_penal",
    "Lei nº 9.296/1996"
   ],
   [
    "processual_penal",
    "Decreto-Lei nº 3.689/1941"
   ],
   [
    "processual_penal",
    "Lei nº 11.343/2006"
   ],
   [
    "processual_penal",
    "Lei nº 11.340/2006"
   ],
   [
    "processual_penal",
    "Lei nº 7.210/1984"
   ],
   [
    "processual_penal",
    "Lei nº 12.313/2010"
   ],
   [
    "processual_penal",
    "Lei nº 13.431/2017"
   ],
   [
    "constitucional",
    "CF/1988"
   ],
   [
    "constitucional",
    "Emenda Constitucional nº 80/2014"
   ],
   [
    "eleitoral",
    "Lei Complementar nº 64/1990"
   ],
   [
    "eleitoral",
    "Lei nº 4.737/1965"
   ],
   [
    "eleitoral",
    "Lei nº 9.504/1997"
   ],
   [
    "empresarial",
    "Lei nº 11.101/2005"
   ],
   [
    "empresarial",
    "Lei nº 6.404/1976"
   ],
   [
    "tributario",
    "Lei nº 5.172/1966"
   ],
   [
    "tributario",
    "Lei Complementar nº 101/2000"
   ],
   [
    "ambiental",
    "Lei nº 6.938/1981"
   ],
   [
    "ambiental",
    "Decreto nº 99.274/1990"
   ],
   [
    "ambiental",
    "Lei nº 9.433/1997"
   ],
   [
    "ambiental",
    "Lei nº 12.651/2012"
   ],
   [
    "ambiental",
    "Lei nº 11.284/2006"
   ],
   [
    "ambiental",
    "Lei nº 9.985/2000"
   ],
   [
    "ambiental",
    "Lei nº 10.257/2001"
   ],
   [
    "ambiental",
    "Lei nº 13.089/2015"
   ],
   [
    "ambiental",
    "Decreto nº 6.514/2008"
   ],
   [
    "ambiental",
    "Lei nº 11.445/2007"
   ],
   [
    "ambiental",
    "Lei nº 9.795/1999"
   ],
   [
    "ambiental",
    "Lei nº 12.187/2009"
   ],
   [
    "ambiental",
    "Lei nº 12.305/2010"
   ],
   [
    "ambiental",
    "Lei nº 13.465/2017"
   ],
   [
    "ambiental",
    "Lei nº 12.587/2012"
   ],
   [
    "ambiental",
    "Decreto nº 7.217/2010"
   ],
   [
    "ambiental",
    "Lei nº 11.107/2005"
   ],
   [
    "administrativo",
    "Lei Complementar nº 80/1994"
   ],
   [
    "administrativo",
    "Lei nº 8.429/1992"
   ],
   [
    "administrativo",
    "Decreto-Lei nº 3.365/1941"
   ],
   [
    "administrativo",
    "Lei nº 9.784/1999"
   ],
   [
    "administrativo",
    "Lei nº 12.462/2011"
   ],
   [
    "administrativo",
    "Lei nº 12.846/2013"
   ],
   [
    "administrativo",
    "Lei nº 8.666/1993"
   ],
   [
    "administrativo",
    "Lei nº 8.080/1990"
   ],
   [
    "administrativo",
    "Lei nº 8.142/1990"
   ],
   [
    "administrativo",
    "Lei nº 9.394/1996"
   ],
   [
    "administrativo",
    "Lei nº 13.005/2014"
   ],
   [
    "administrativo",
    "Lei nº 14.133/2021"
   ],
   [
    "administrativo",
    "Lei nº 12.527/2011"
   ],
   [
    "administrativo",
    "Lei nº 8.987/1995"
   ],
   [
    "administrativo",
    "Lei nº 11.079/2004"
   ],
   [
    "administrativo",
    "Lei Complementar nº 101/2000"
   ],
   [
    "previdenciario",
    "Lei nº 8.213/1991"
   ],
   [
    "previdenciario",
    "Lei nº 8.212/1991"
   ],
   [
    "previdenciario",
    "Lei nº 8.742/1993"
   ],
   [
    "previdenciario",
    "Lei nº 12.435/2011"
   ],
   [
    "humanos",
    "Lei nº 9.474/1997"
   ],
   [
    "humanos",
    "Lei nº 12.288/2010"
   ],
   [
    "humanos",
    "Decreto nº 6.949/2009"
   ],
   [
    "humanos",
    "Decreto nº 592/1992"
   ],
   [
    "humanos",
    "Lei nº 7.716/1989"
   ],
   [
    "humanos",
    "Lei nº 12.852/2013"
   ],
   [
    "humanos",
    "Lei nº 12.711/2012"
   ],
   [
    "humanos",
    "Lei nº 12.990/2014"
   ],
   [
    "humanos",
    "Decreto nº 10.932/2022"
   ],
   [
    "humanos",
    "Decreto nº 7.053/2009"
   ],
   [
    "humanos",
    "Lei nº 13.445/2017"
   ],
   [
    "humanos",
    "Lei nº 11.645/2008"
   ],
   [
    "humanos",
    "Decreto nº 6.040/2007"
   ],
   [
    "humanos",
    "Decreto nº 4.887/2003"
   ],
   [
    "humanos",
    "Decreto nº 678/1992"
   ],
   [
    "humanos",
    "Lei nº 10.639/2003"
   ],
   [
    "humanos",
    "Lei nº 12.847/2013"
   ],
   [
    "trabalhista",
    "Decreto-Lei nº 5.452/1943"
   ]
  ],
  "extras": [
   "Lei nº 13.172/2015",
   "Lei nº 14.046/2020",
   "Lei nº 14.431/2022",
   "Lei nº 14.690/2023",
   "Lei Complementar nº 19/1994",
   "Lei Complementar nº 26/2006",
   "Lei nº 11.372/2009",
   "Lei nº 14.519/2023",
   "Resolução nº 4/2011",
   "Resolução nº 113/2010",
   "Resolução nº 14/1994",
   "Resolução CNJ nº 348/2020",
   "Resolução CNJ nº 125/2010",
   "Resolução CNJ nº 345/2020",
   "Resolução nº 01/2014",
   "Resolução nº 348/2020",
   "Lei Complementar nº 207/1979",
   "Lei Complementar nº 893/2001",
   "Lei nº 14.187/2010",
   "Lei nº 10.948/2001",
   "Lei nº 11.199/2002",
   "Lei nº 10.705/2000",
   "Lei nº 10.365/1999",
   "Decreto nº 55.334/2010",
   "Decreto nº 55.370/2010",
   "Resolução nº 414/2021",
   "Resolução nº 213/2015",
   "Resolução nº 425/2021",
   "Resolução CNJ nº 287/2019",
   "Resolução nº 412/2021",
   "Resolução CNJ nº 345/2021"
  ],
  "editais": [
   "dpu-2017",
   "dpeba-2026",
   "dpesp-ix"
  ]
 },
 {
  "id": "carreira-advogado-publico",
  "tipo": "carreira",
  "secao": "carreira",
  "sigla": "Carreira",
  "cargo": "união dos editais: PGE-CE + AGU + PFN",
  "orgao": "Reúne o conteúdo de 3 editais",
  "titulo": "Advogado Público",
  "edital": "PGE-CE: Concurso para Procurador do Estado · AGU: Concurso para Advogado da União · PFN: Concurso para Procurador da Fazenda Nacional",
  "grupos": [
   {
    "nome": "Disciplinas (união dos editais)",
    "disciplinas": [
     "Direito Constitucional — 3 de 3 editais",
     "Direito Administrativo — 3 de 3 editais",
     "Direito Tributário — 3 de 3 editais",
     "Direito Penal — 1 de 3 editais",
     "Direito Ambiental — 2 de 3 editais",
     "Direito Civil — 3 de 3 editais",
     "Direito Processual Civil — 3 de 3 editais",
     "Direito do Trabalho e Processual do Trabalho — 3 de 3 editais",
     "Direito Empresarial — 3 de 3 editais",
     "Direito Previdenciário — 1 de 3 editais",
     "Legislação da AGU, Gestão de Conflitos e Governança — 1 de 3 editais",
     "Direito Financeiro e Econômico — 2 de 3 editais",
     "Direito Internacional Público e Privado — 1 de 3 editais",
     "Direito Penal e Processual Penal — 2 de 3 editais",
     "Direito da Seguridade Social — 2 de 3 editais",
     "Direito Eleitoral — 1 de 3 editais",
     "Direito Internacional Público — 1 de 3 editais"
    ]
   }
  ],
  "leis": [
   [
    "civil",
    "Lei nº 6.766/1979"
   ],
   [
    "civil",
    "Lei nº 6.015/1973"
   ],
   [
    "civil",
    "Lei nº 10.741/2003"
   ],
   [
    "civil",
    "Lei nº 8.245/1991"
   ],
   [
    "civil",
    "Lei nº 13.146/2015"
   ],
   [
    "civil",
    "Lei nº 10.406/2002"
   ],
   [
    "civil",
    "Decreto-Lei nº 4.657/1942"
   ],
   [
    "civil",
    "Lei nº 1.060/1950"
   ],
   [
    "civil",
    "Lei nº 13.874/2019"
   ],
   [
    "civil",
    "Lei nº 9.492/1997"
   ],
   [
    "civil",
    "Lei nº 13.709/2018"
   ],
   [
    "civil",
    "Lei nº 12.965/2014"
   ],
   [
    "civil",
    "Lei nº 8.009/1990"
   ],
   [
    "civil",
    "Lei nº 9.610/1998"
   ],
   [
    "processual_civil",
    "Lei nº 8.038/1990"
   ],
   [
    "processual_civil",
    "Lei nº 9.099/1995"
   ],
   [
    "processual_civil",
    "Lei nº 10.259/2001"
   ],
   [
    "processual_civil",
    "Lei nº 13.105/2015"
   ],
   [
    "processual_civil",
    "Lei nº 12.153/2009"
   ],
   [
    "processual_civil",
    "Lei nº 9.307/1996"
   ],
   [
    "processual_civil",
    "Lei nº 13.140/2015"
   ],
   [
    "processual_civil",
    "Lei nº 12.016/2009"
   ],
   [
    "processual_civil",
    "Lei nº 4.717/1965"
   ],
   [
    "processual_civil",
    "Lei nº 7.347/1985"
   ],
   [
    "processual_civil",
    "Lei nº 9.507/1997"
   ],
   [
    "processual_civil",
    "Lei nº 13.129/2015"
   ],
   [
    "processual_civil",
    "Lei nº 8.437/1992"
   ],
   [
    "processual_civil",
    "Lei nº 9.494/1997"
   ],
   [
    "processual_civil",
    "Lei nº 11.419/2006"
   ],
   [
    "consumidor",
    "Lei nº 8.078/1990"
   ],
   [
    "crianca",
    "Lei nº 8.069/1990"
   ],
   [
    "penal",
    "Lei nº 8.429/1992"
   ],
   [
    "penal",
    "Lei nº 8.137/1990"
   ],
   [
    "penal",
    "Lei nº 8.072/1990"
   ],
   [
    "penal",
    "Lei nº 7.716/1989"
   ],
   [
    "penal",
    "Lei nº 9.455/1997"
   ],
   [
    "penal",
    "Lei nº 12.694/2012"
   ],
   [
    "penal",
    "Lei nº 12.850/2013"
   ],
   [
    "penal",
    "Lei nº 9.605/1998"
   ],
   [
    "penal",
    "Lei nº 9.503/1997"
   ],
   [
    "penal",
    "Lei nº 11.343/2006"
   ],
   [
    "penal",
    "Lei nº 4.898/1965"
   ],
   [
    "penal",
    "Lei nº 10.826/2003"
   ],
   [
    "penal",
    "Lei nº 9.613/1998"
   ],
   [
    "penal",
    "Lei nº 11.340/2006"
   ],
   [
    "penal",
    "Lei nº 7.210/1984"
   ],
   [
    "penal",
    "Lei nº 13.869/2019"
   ],
   [
    "penal",
    "Decreto-Lei nº 2.848/1940"
   ],
   [
    "penal",
    "Lei nº 9.434/1997"
   ],
   [
    "penal",
    "Lei nº 9.263/1996"
   ],
   [
    "penal",
    "Lei nº 1.521/1951"
   ],
   [
    "penal",
    "Lei nº 8.176/1991"
   ],
   [
    "penal",
    "Lei nº 7.492/1986"
   ],
   [
    "processual_penal",
    "Lei nº 9.296/1996"
   ],
   [
    "processual_penal",
    "Lei nº 7.960/1989"
   ],
   [
    "processual_penal",
    "Lei nº 13.105/2015"
   ],
   [
    "processual_penal",
    "Lei nº 11.101/2005"
   ],
   [
    "processual_penal",
    "Lei nº 4.737/1965"
   ],
   [
    "processual_penal",
    "Decreto-Lei nº 3.689/1941"
   ],
   [
    "constitucional",
    "CF/1988"
   ],
   [
    "constitucional",
    "Lei nº 12.562/2011"
   ],
   [
    "constitucional",
    "Emenda Constitucional nº 45/2004"
   ],
   [
    "eleitoral",
    "Lei nº 9.504/1997"
   ],
   [
    "eleitoral",
    "Lei nº 4.737/1965"
   ],
   [
    "eleitoral",
    "Lei Complementar nº 64/1990"
   ],
   [
    "eleitoral",
    "Lei nº 9.096/1995"
   ],
   [
    "empresarial",
    "Lei Complementar nº 123/2006"
   ],
   [
    "empresarial",
    "Lei nº 8.934/1994"
   ],
   [
    "empresarial",
    "Lei nº 9.279/1996"
   ],
   [
    "empresarial",
    "Lei nº 6.404/1976"
   ],
   [
    "empresarial",
    "Lei nº 11.101/2005"
   ],
   [
    "empresarial",
    "Lei nº 12.529/2011"
   ],
   [
    "empresarial",
    "Lei Complementar nº 182/2021"
   ],
   [
    "tributario",
    "Lei nº 6.830/1980"
   ],
   [
    "tributario",
    "Lei Complementar nº 116/2003"
   ],
   [
    "tributario",
    "Lei Complementar nº 159/2016"
   ],
   [
    "tributario",
    "Lei Complementar nº 101/2000"
   ],
   [
    "tributario",
    "Lei nº 5.172/1966"
   ],
   [
    "tributario",
    "Lei Complementar nº 118/2005"
   ],
   [
    "tributario",
    "Lei nº 9.703/1998"
   ],
   [
    "tributario",
    "Lei nº 10.522/2002"
   ],
   [
    "tributario",
    "Decreto-Lei nº 147/1967"
   ],
   [
    "tributario",
    "Lei Complementar nº 105/2001"
   ],
   [
    "ambiental",
    "Lei nº 11.107/2005"
   ],
   [
    "ambiental",
    "Lei Complementar nº 140/2011"
   ],
   [
    "ambiental",
    "Lei nº 6.938/1981"
   ],
   [
    "ambiental",
    "Decreto nº 99.274/1990"
   ],
   [
    "ambiental",
    "Lei nº 9.433/1997"
   ],
   [
    "ambiental",
    "Lei nº 12.305/2010"
   ],
   [
    "ambiental",
    "Lei nº 11.445/2007"
   ],
   [
    "ambiental",
    "Lei nº 12.651/2012"
   ],
   [
    "ambiental",
    "Lei nº 11.284/2006"
   ],
   [
    "ambiental",
    "Lei nº 9.985/2000"
   ],
   [
    "ambiental",
    "Lei nº 10.257/2001"
   ],
   [
    "ambiental",
    "Decreto nº 6.514/2008"
   ],
   [
    "ambiental",
    "Lei nº 12.187/2009"
   ],
   [
    "ambiental",
    "Decreto nº 10.936/2022"
   ],
   [
    "administrativo",
    "Lei nº 9.784/1999"
   ],
   [
    "administrativo",
    "Lei nº 8.987/1995"
   ],
   [
    "administrativo",
    "Lei nº 11.079/2004"
   ],
   [
    "administrativo",
    "Lei nº 13.019/2014"
   ],
   [
    "administrativo",
    "Lei nº 13.460/2017"
   ],
   [
    "administrativo",
    "Lei nº 14.133/2021"
   ],
   [
    "administrativo",
    "Lei nº 8.666/1993"
   ],
   [
    "administrativo",
    "Lei nº 10.520/2002"
   ],
   [
    "administrativo",
    "Decreto nº 7.892/2013"
   ],
   [
    "administrativo",
    "Lei nº 12.462/2011"
   ],
   [
    "administrativo",
    "Decreto nº 6.017/2007"
   ],
   [
    "administrativo",
    "Lei nº 8.429/1992"
   ],
   [
    "administrativo",
    "Lei nº 4.320/1964"
   ],
   [
    "administrativo",
    "Lei Complementar nº 101/2000"
   ],
   [
    "administrativo",
    "Decreto-Lei nº 3.365/1941"
   ],
   [
    "administrativo",
    "Lei nº 13.848/2019"
   ],
   [
    "administrativo",
    "Lei nº 13.303/2016"
   ],
   [
    "administrativo",
    "Lei nº 9.790/1999"
   ],
   [
    "administrativo",
    "Lei nº 9.637/1998"
   ],
   [
    "administrativo",
    "Decreto nº 3.555/2000"
   ],
   [
    "administrativo",
    "Decreto nº 10.024/2019"
   ],
   [
    "administrativo",
    "Decreto nº 7.581/2011"
   ],
   [
    "administrativo",
    "Decreto nº 7.983/2013"
   ],
   [
    "administrativo",
    "Decreto nº 6.170/2007"
   ],
   [
    "administrativo",
    "Lei nº 9.873/1999"
   ],
   [
    "administrativo",
    "Lei nº 9.636/1998"
   ],
   [
    "administrativo",
    "Lei nº 8.112/1990"
   ],
   [
    "administrativo",
    "Lei Complementar nº 73/1993"
   ],
   [
    "administrativo",
    "Lei nº 9.028/1995"
   ],
   [
    "administrativo",
    "Lei nº 9.469/1997"
   ],
   [
    "administrativo",
    "Decreto nº 9.830/2019"
   ],
   [
    "administrativo",
    "Decreto nº 10.201/2020"
   ],
   [
    "administrativo",
    "Lei nº 12.813/2013"
   ],
   [
    "administrativo",
    "Lei nº 8.080/1990"
   ],
   [
    "administrativo",
    "Lei nº 12.527/2011"
   ],
   [
    "administrativo",
    "Decreto-Lei nº 200/1967"
   ],
   [
    "administrativo",
    "Lei nº 12.846/2013"
   ],
   [
    "administrativo",
    "Decreto nº 7.746/2012"
   ],
   [
    "administrativo",
    "Decreto nº 1.171/1994"
   ],
   [
    "administrativo",
    "Decreto nº 6.029/2007"
   ],
   [
    "administrativo",
    "Decreto nº 11.129/2022"
   ],
   [
    "administrativo",
    "Decreto nº 7.724/2012"
   ],
   [
    "previdenciario",
    "Emenda Constitucional nº 103/2019"
   ],
   [
    "previdenciario",
    "Lei nº 8.213/1991"
   ],
   [
    "previdenciario",
    "Lei nº 8.212/1991"
   ],
   [
    "humanos",
    "Decreto nº 678/1992"
   ],
   [
    "humanos",
    "Decreto nº 9.571/2018"
   ],
   [
    "trabalhista",
    "Decreto-Lei nº 5.452/1943"
   ],
   [
    "trabalhista",
    "Lei nº 10.035/2000"
   ]
  ],
  "extras": [
   "Lei nº 9.826/1974",
   "Lei Complementar nº 58/2006",
   "Lei nº 12.670/1996",
   "Lei nº 12.023/1992",
   "Lei nº 15.812/2015",
   "Lei nº 16.259/2017",
   "Lei nº 15.614/2014",
   "Lei nº 13.568/2004",
   "Decreto nº 33.657/2020",
   "Lei Complementar nº 37/2003",
   "Lei nº 12.488/1995",
   "Lei Complementar nº 12/1999",
   "Lei Complementar nº 13/1999",
   "Lei Complementar nº 14/1999",
   "Lei Complementar nº 17/1999",
   "Lei Complementar nº 21/2000",
   "Lei Complementar nº 24/2000",
   "Lei Complementar nº 40/2004",
   "Lei Complementar nº 41/2004",
   "Lei Complementar nº 91/2010",
   "Lei Complementar nº 92/2011",
   "Lei Complementar nº 210/2019",
   "Lei Complementar nº 218/2020",
   "Lei nº 13.578/2005",
   "Lei nº 13.327/2016",
   "Lei nº 13.988/2018",
   "Decreto nº 93.872/1986",
   "Decreto nº 10.690/2021",
   "Emenda Constitucional nº 106/2020",
   "Lei nº 10.150/2000",
   "Lei Complementar nº 156/2016",
   "Lei Complementar nº 178/2021",
   "Decreto-Lei nº 73/1966",
   "Lei nº 14.430/2022",
   "Decreto nº 8.945/2016",
   "Lei nº 9.249/1995",
   "Lei nº 8.884/1994",
   "Lei nº 10.701/2003",
   "Lei nº 10.467/2002",
   "Decreto nº 2.799/1998",
   "Lei nº 13.467/2017",
   "Lei nº 14.437/2022",
   "Decreto nº 8.842/2016",
   "Resolução nº 303/2019"
  ],
  "editais": [
   "pgece-2021",
   "agu-adv-2022",
   "pfn-2022"
  ]
 },
 {
  "id": "exame-enac",
  "tipo": "carreira",
  "secao": "exame",
  "emBreve": true,
  "sigla": "Exame",
  "cargo": "aguardando o edital",
  "orgao": "Exame Nacional dos Cartórios (CNJ)",
  "titulo": "ENAC — Exame Nacional dos Cartórios",
  "edital": "Edital ainda não mapeado",
  "grupos": [],
  "leis": [],
  "extras": [],
  "editais": []
 },
 {
  "id": "exame-enap",
  "tipo": "carreira",
  "secao": "exame",
  "emBreve": true,
  "sigla": "Exame",
  "cargo": "aguardando o edital",
  "orgao": "Exame Nacional da Advocacia Pública (AGU)",
  "titulo": "Exame Nacional da Advocacia Pública",
  "edital": "Edital ainda não mapeado",
  "grupos": [],
  "leis": [],
  "extras": [],
  "editais": []
 },
 {
  "id": "tjgo-59",
  "sigla": "TJGO",
  "cargo": "Juiz Substituto",
  "orgao": "Tribunal de Justiça do Estado de Goiás",
  "titulo": "59º Concurso de Juiz Substituto",
  "edital": "Edital nº 01/2025 (consolidado em 13/01/2026)",
  "grupos": [
   {
    "nome": "Bloco I",
    "disciplinas": [
     "Direito Civil",
     "Direito Processual Civil",
     "Direito do Consumidor",
     "Direito da Criança e do Adolescente"
    ]
   },
   {
    "nome": "Bloco II",
    "disciplinas": [
     "Direito Penal",
     "Direito Processual Penal",
     "Direito Constitucional",
     "Direito Eleitoral"
    ]
   },
   {
    "nome": "Bloco III",
    "disciplinas": [
     "Direito Empresarial",
     "Direito Tributário e Financeiro",
     "Direito Ambiental",
     "Direito Administrativo",
     "Noções Gerais de Direito e Formação Humanística",
     "Direitos Humanos"
    ]
   }
  ],
  "leis": [
   [
    "civil",
    "Lei nº 6.015/1973"
   ],
   [
    "civil",
    "Decreto-Lei nº 911/1969"
   ],
   [
    "civil",
    "Lei nº 9.514/1997"
   ],
   [
    "civil",
    "Lei nº 4.591/1964"
   ],
   [
    "civil",
    "Lei nº 10.931/2004"
   ],
   [
    "civil",
    "Lei nº 10.741/2003"
   ],
   [
    "civil",
    "Lei nº 8.245/1991"
   ],
   [
    "civil",
    "Lei nº 13.146/2015"
   ],
   [
    "civil",
    "Lei nº 14.382/2022"
   ],
   [
    "civil",
    "Lei nº 13.874/2019"
   ],
   [
    "civil",
    "Lei nº 14.010/2020"
   ],
   [
    "civil",
    "Lei nº 13.709/2018"
   ],
   [
    "civil",
    "Lei nº 8.009/1990"
   ],
   [
    "civil",
    "Decreto nº 20.910/1932"
   ],
   [
    "civil",
    "Lei nº 1.060/1950"
   ],
   [
    "civil",
    "Lei nº 6.515/1977"
   ],
   [
    "civil",
    "Lei nº 9.278/1996"
   ],
   [
    "civil",
    "Lei nº 5.478/1968"
   ],
   [
    "civil",
    "Lei nº 11.804/2008"
   ],
   [
    "civil",
    "Lei nº 8.560/1992"
   ],
   [
    "civil",
    "Decreto nº 57.663/1966"
   ],
   [
    "civil",
    "Lei nº 9.492/1997"
   ],
   [
    "civil",
    "Lei nº 11.076/2004"
   ],
   [
    "civil",
    "Lei nº 10.406/2002"
   ],
   [
    "civil",
    "Decreto-Lei nº 4.657/1942"
   ],
   [
    "processual_civil",
    "Lei nº 12.016/2009"
   ],
   [
    "processual_civil",
    "Lei nº 4.717/1965"
   ],
   [
    "processual_civil",
    "Lei nº 7.347/1985"
   ],
   [
    "processual_civil",
    "Lei nº 9.507/1997"
   ],
   [
    "processual_civil",
    "Lei nº 9.099/1995"
   ],
   [
    "processual_civil",
    "Lei nº 10.259/2001"
   ],
   [
    "processual_civil",
    "Lei nº 12.153/2009"
   ],
   [
    "processual_civil",
    "Lei nº 11.419/2006"
   ],
   [
    "processual_civil",
    "Lei nº 8.437/1992"
   ],
   [
    "processual_civil",
    "Lei nº 9.494/1997"
   ],
   [
    "processual_civil",
    "Lei nº 11.417/2006"
   ],
   [
    "processual_civil",
    "Lei nº 13.140/2015"
   ],
   [
    "processual_civil",
    "Lei nº 13.105/2015"
   ],
   [
    "processual_civil",
    "Lei nº 9.307/1996"
   ],
   [
    "consumidor",
    "Lei nº 8.078/1990"
   ],
   [
    "crianca",
    "Lei nº 10.216/2001"
   ],
   [
    "crianca",
    "Lei nº 12.594/2012"
   ],
   [
    "crianca",
    "Lei nº 13.431/2017"
   ],
   [
    "crianca",
    "Lei nº 14.344/2022"
   ],
   [
    "crianca",
    "Lei nº 8.069/1990"
   ],
   [
    "penal",
    "Lei nº 8.429/1992"
   ],
   [
    "penal",
    "Lei nº 11.340/2006"
   ],
   [
    "penal",
    "Lei nº 7.210/1984"
   ],
   [
    "penal",
    "Lei nº 9.613/1998"
   ],
   [
    "penal",
    "Lei nº 12.850/2013"
   ],
   [
    "penal",
    "Lei nº 11.343/2006"
   ],
   [
    "penal",
    "Decreto-Lei nº 201/1967"
   ],
   [
    "penal",
    "Decreto-Lei nº 2.848/1940"
   ],
   [
    "penal",
    "Lei nº 9.605/1998"
   ],
   [
    "penal",
    "Lei nº 10.826/2003"
   ],
   [
    "penal",
    "Lei nº 9.455/1997"
   ],
   [
    "penal",
    "Lei nº 13.869/2019"
   ],
   [
    "penal",
    "Lei nº 9.503/1997"
   ],
   [
    "penal",
    "Decreto-Lei nº 3.688/1941"
   ],
   [
    "processual_penal",
    "Lei nº 9.099/1995"
   ],
   [
    "processual_penal",
    "Lei nº 11.340/2006"
   ],
   [
    "processual_penal",
    "Lei nº 13.431/2017"
   ],
   [
    "processual_penal",
    "Lei nº 7.210/1984"
   ],
   [
    "processual_penal",
    "Lei nº 9.296/1996"
   ],
   [
    "processual_penal",
    "Lei nº 9.807/1999"
   ],
   [
    "processual_penal",
    "Lei nº 12.850/2013"
   ],
   [
    "processual_penal",
    "Lei nº 11.343/2006"
   ],
   [
    "processual_penal",
    "Decreto-Lei nº 201/1967"
   ],
   [
    "processual_penal",
    "Lei nº 11.101/2005"
   ],
   [
    "processual_penal",
    "Lei nº 13.105/2015"
   ],
   [
    "processual_penal",
    "Decreto-Lei nº 3.689/1941"
   ],
   [
    "constitucional",
    "Emenda Constitucional nº 45/2004"
   ],
   [
    "constitucional",
    "CF/1988"
   ],
   [
    "eleitoral",
    "Lei Complementar nº 64/1990"
   ],
   [
    "eleitoral",
    "Lei nº 9.096/1995"
   ],
   [
    "eleitoral",
    "Lei nº 9.504/1997"
   ],
   [
    "eleitoral",
    "Lei Complementar nº 86/1996"
   ],
   [
    "eleitoral",
    "Lei nº 4.737/1965"
   ],
   [
    "empresarial",
    "Lei nº 7.913/1989"
   ],
   [
    "empresarial",
    "Lei nº 11.101/2005"
   ],
   [
    "empresarial",
    "Lei Complementar nº 123/2006"
   ],
   [
    "empresarial",
    "Decreto nº 2.044/1908"
   ],
   [
    "empresarial",
    "Lei nº 7.357/1985"
   ],
   [
    "empresarial",
    "Lei nº 5.474/1968"
   ],
   [
    "empresarial",
    "Decreto-Lei nº 167/1967"
   ],
   [
    "empresarial",
    "Lei nº 6.404/1976"
   ],
   [
    "empresarial",
    "Lei nº 6.024/1974"
   ],
   [
    "empresarial",
    "Lei nº 9.279/1996"
   ],
   [
    "tributario",
    "Lei nº 6.830/1980"
   ],
   [
    "tributario",
    "Lei Complementar nº 101/2000"
   ],
   [
    "tributario",
    "Lei nº 5.172/1966"
   ],
   [
    "ambiental",
    "Lei nº 11.445/2007"
   ],
   [
    "ambiental",
    "Lei nº 14.026/2020"
   ],
   [
    "ambiental",
    "Decreto nº 7.217/2010"
   ],
   [
    "ambiental",
    "Lei nº 13.123/2015"
   ],
   [
    "ambiental",
    "Lei nº 10.257/2001"
   ],
   [
    "ambiental",
    "Lei nº 12.651/2012"
   ],
   [
    "ambiental",
    "Lei nº 12.305/2010"
   ],
   [
    "ambiental",
    "Lei nº 9.985/2000"
   ],
   [
    "ambiental",
    "Lei nº 9.433/1997"
   ],
   [
    "ambiental",
    "Lei nº 12.187/2009"
   ],
   [
    "ambiental",
    "Lei nº 11.107/2005"
   ],
   [
    "administrativo",
    "Decreto-Lei nº 4.597/1942"
   ],
   [
    "administrativo",
    "Decreto-Lei nº 3.365/1941"
   ],
   [
    "administrativo",
    "Lei nº 8.429/1992"
   ],
   [
    "administrativo",
    "Lei nº 14.230/2021"
   ],
   [
    "administrativo",
    "Lei nº 8.080/1990"
   ],
   [
    "administrativo",
    "Lei nº 9.394/1996"
   ],
   [
    "administrativo",
    "Lei nº 4.320/1964"
   ],
   [
    "administrativo",
    "Lei Complementar nº 101/2000"
   ],
   [
    "administrativo",
    "Lei Complementar nº 35/1979"
   ],
   [
    "administrativo",
    "Lei nº 12.527/2011"
   ],
   [
    "administrativo",
    "Lei nº 12.846/2013"
   ],
   [
    "administrativo",
    "Lei nº 14.133/2021"
   ],
   [
    "administrativo",
    "Lei nº 8.987/1995"
   ],
   [
    "administrativo",
    "Lei nº 11.079/2004"
   ],
   [
    "previdenciario",
    "Lei nº 8.742/1993"
   ],
   [
    "previdenciario",
    "Lei nº 12.435/2011"
   ],
   [
    "humanos",
    "Lei nº 12.288/2010"
   ],
   [
    "humanos",
    "Lei nº 7.853/1989"
   ],
   [
    "humanos",
    "Lei nº 10.098/2000"
   ],
   [
    "humanos",
    "Decreto nº 6.949/2009"
   ],
   [
    "humanos",
    "Decreto nº 678/1992"
   ],
   [
    "humanos",
    "Decreto nº 592/1992"
   ]
  ],
  "extras": [
   "Lei nº 16.105/2015",
   "Lei nº 6.840/1980",
   "Lei nº 20.694/2019",
   "Lei nº 16.497/2009",
   "Decreto nº 9.130/2017",
   "Lei nº 20.756/2020",
   "Lei Complementar nº 161/2020",
   "Lei nº 21.868/2022",
   "Lei nº 14.376/2002",
   "Resolução CNJ nº 425/2021",
   "Resolução CNJ nº 348/2020",
   "Resolução CNJ nº 369/2021",
   "Resolução CNJ nº 165/2012",
   "Resolução CNJ nº 414/2021",
   "Resolução CNJ nº 289/2019",
   "Resolução nº 170/2021",
   "Resolução CNJ nº 345/2020",
   "Resolução CNJ nº 372/2021",
   "Resolução CNJ nº 385/2021",
   "Resolução CNJ nº 398/2021"
  ],
  "tipo": "edital"
 },
 {
  "id": "mpsp-97",
  "sigla": "MPSP",
  "cargo": "Promotor de Justiça Substituto",
  "orgao": "Ministério Público do Estado de São Paulo",
  "titulo": "97º Concurso de Ingresso na Carreira",
  "edital": "Aviso nº 051/2026 – PGJ-Concurso (16/01/2026)",
  "grupos": [
   {
    "nome": "Matérias do concurso",
    "disciplinas": [
     "Direito Penal",
     "Direito Processual Penal",
     "Direito Civil",
     "Direito Processual Civil",
     "Direito Constitucional",
     "Direito da Infância e da Juventude",
     "Direito Comercial e Empresarial",
     "Tutela de Interesses Difusos e Coletivos",
     "Direitos Humanos",
     "Direito Administrativo",
     "Direito Eleitoral"
    ]
   }
  ],
  "leis": [
   [
    "civil",
    "Lei nº 13.709/2018"
   ],
   [
    "civil",
    "Lei nº 12.965/2014"
   ],
   [
    "civil",
    "Lei nº 10.406/2002"
   ],
   [
    "civil",
    "Decreto-Lei nº 4.657/1942"
   ],
   [
    "civil",
    "Lei nº 10.741/2003"
   ],
   [
    "civil",
    "Lei nº 6.015/1973"
   ],
   [
    "civil",
    "Lei nº 13.146/2015"
   ],
   [
    "civil",
    "Lei nº 6.766/1979"
   ],
   [
    "civil",
    "Lei nº 9.278/1996"
   ],
   [
    "civil",
    "Lei nº 8.009/1990"
   ],
   [
    "processual_civil",
    "Lei nº 12.016/2009"
   ],
   [
    "processual_civil",
    "Lei nº 4.717/1965"
   ],
   [
    "processual_civil",
    "Lei nº 7.347/1985"
   ],
   [
    "processual_civil",
    "Lei nº 9.507/1997"
   ],
   [
    "processual_civil",
    "Lei nº 9.307/1996"
   ],
   [
    "processual_civil",
    "Lei nº 13.140/2015"
   ],
   [
    "processual_civil",
    "Lei nº 9.099/1995"
   ],
   [
    "processual_civil",
    "Lei nº 13.105/2015"
   ],
   [
    "consumidor",
    "Lei nº 8.078/1990"
   ],
   [
    "crianca",
    "Decreto nº 99.710/1990"
   ],
   [
    "crianca",
    "Lei nº 8.069/1990"
   ],
   [
    "penal",
    "Lei nº 7.716/1989"
   ],
   [
    "penal",
    "Decreto-Lei nº 2.848/1940"
   ],
   [
    "penal",
    "Lei nº 7.210/1984"
   ],
   [
    "penal",
    "Lei nº 8.429/1992"
   ],
   [
    "penal",
    "Lei nº 10.826/2003"
   ],
   [
    "penal",
    "Lei nº 8.072/1990"
   ],
   [
    "penal",
    "Lei nº 12.850/2013"
   ],
   [
    "penal",
    "Lei nº 9.613/1998"
   ],
   [
    "penal",
    "Lei nº 9.455/1997"
   ],
   [
    "penal",
    "Lei nº 13.869/2019"
   ],
   [
    "penal",
    "Lei nº 9.503/1997"
   ],
   [
    "penal",
    "Decreto-Lei nº 3.688/1941"
   ],
   [
    "penal",
    "Lei nº 13.260/2016"
   ],
   [
    "processual_penal",
    "Lei nº 7.210/1984"
   ],
   [
    "processual_penal",
    "Lei nº 11.101/2005"
   ],
   [
    "processual_penal",
    "Lei nº 9.099/1995"
   ],
   [
    "processual_penal",
    "Lei nº 12.850/2013"
   ],
   [
    "processual_penal",
    "Lei nº 9.296/1996"
   ],
   [
    "processual_penal",
    "Decreto-Lei nº 3.689/1941"
   ],
   [
    "constitucional",
    "CF/1988"
   ],
   [
    "eleitoral",
    "Lei Complementar nº 64/1990"
   ],
   [
    "eleitoral",
    "Lei nº 9.096/1995"
   ],
   [
    "eleitoral",
    "Lei nº 4.737/1965"
   ],
   [
    "eleitoral",
    "Lei nº 9.504/1997"
   ],
   [
    "empresarial",
    "Lei nº 11.101/2005"
   ],
   [
    "empresarial",
    "Lei nº 6.404/1976"
   ],
   [
    "empresarial",
    "Lei nº 9.279/1996"
   ],
   [
    "empresarial",
    "Lei Complementar nº 123/2006"
   ],
   [
    "ambiental",
    "Lei nº 10.257/2001"
   ],
   [
    "ambiental",
    "Lei nº 9.985/2000"
   ],
   [
    "ambiental",
    "Lei nº 11.445/2007"
   ],
   [
    "ambiental",
    "Lei nº 11.107/2005"
   ],
   [
    "administrativo",
    "Lei nº 4.320/1964"
   ],
   [
    "administrativo",
    "Decreto nº 11.129/2022"
   ],
   [
    "administrativo",
    "Lei Complementar nº 101/2000"
   ],
   [
    "administrativo",
    "Lei nº 8.429/1992"
   ],
   [
    "administrativo",
    "Lei nº 14.133/2021"
   ],
   [
    "administrativo",
    "Lei nº 12.846/2013"
   ],
   [
    "administrativo",
    "Lei nº 12.527/2011"
   ],
   [
    "administrativo",
    "Lei nº 11.079/2004"
   ],
   [
    "humanos",
    "Decreto nº 678/1992"
   ],
   [
    "humanos",
    "Decreto nº 9.571/2018"
   ],
   [
    "humanos",
    "Decreto nº 6.949/2009"
   ],
   [
    "humanos",
    "Decreto nº 65.810/1969"
   ],
   [
    "humanos",
    "Lei nº 7.716/1989"
   ],
   [
    "humanos",
    "Decreto nº 4.886/2003"
   ],
   [
    "humanos",
    "Lei nº 12.288/2010"
   ],
   [
    "humanos",
    "Decreto nº 8.136/2013"
   ],
   [
    "humanos",
    "Decreto nº 3.956/2001"
   ],
   [
    "humanos",
    "Decreto nº 3.298/1999"
   ],
   [
    "humanos",
    "Decreto nº 7.037/2009"
   ]
  ],
  "extras": [
   "Decreto nº 7.646/2011",
   "Decreto nº 11.793/2023",
   "Resolução CNMP nº 118/2014",
   "Resolução CNMP nº 198/2019",
   "Resolução CNJ nº 485/2023",
   "Resolução CNMP nº 230/2021",
   "Resolução nº 109/2009",
   "Resolução CNMP nº 228/2021",
   "Resolução CNMP nº 154/2016",
   "Resolução CNJ nº 348/2020"
  ],
  "tipo": "edital"
 },
 {
  "id": "pgece-2021",
  "sigla": "PGE-CE",
  "cargo": "Procurador do Estado (Classe D)",
  "orgao": "Procuradoria-Geral do Estado do Ceará",
  "titulo": "Concurso para Procurador do Estado",
  "edital": "Edital nº 1 – PGE/CE (05/10/2021)",
  "grupos": [
   {
    "nome": "Objetos de avaliação",
    "disciplinas": [
     "Direito Constitucional",
     "Direito Administrativo",
     "Direito Tributário",
     "Direito Penal",
     "Direito Ambiental",
     "Direito Civil",
     "Direito Processual Civil",
     "Direito do Trabalho e Processual do Trabalho",
     "Direito Empresarial",
     "Direito Previdenciário"
    ]
   }
  ],
  "leis": [
   [
    "civil",
    "Lei nº 6.766/1979"
   ],
   [
    "civil",
    "Lei nº 6.015/1973"
   ],
   [
    "civil",
    "Lei nº 10.741/2003"
   ],
   [
    "civil",
    "Lei nº 8.245/1991"
   ],
   [
    "civil",
    "Lei nº 13.146/2015"
   ],
   [
    "civil",
    "Lei nº 10.406/2002"
   ],
   [
    "civil",
    "Decreto-Lei nº 4.657/1942"
   ],
   [
    "civil",
    "Lei nº 1.060/1950"
   ],
   [
    "processual_civil",
    "Lei nº 8.038/1990"
   ],
   [
    "processual_civil",
    "Lei nº 9.099/1995"
   ],
   [
    "processual_civil",
    "Lei nº 10.259/2001"
   ],
   [
    "processual_civil",
    "Lei nº 13.105/2015"
   ],
   [
    "processual_civil",
    "Lei nº 12.153/2009"
   ],
   [
    "processual_civil",
    "Lei nº 9.307/1996"
   ],
   [
    "processual_civil",
    "Lei nº 13.140/2015"
   ],
   [
    "processual_civil",
    "Lei nº 12.016/2009"
   ],
   [
    "processual_civil",
    "Lei nº 4.717/1965"
   ],
   [
    "processual_civil",
    "Lei nº 7.347/1985"
   ],
   [
    "processual_civil",
    "Lei nº 9.507/1997"
   ],
   [
    "consumidor",
    "Lei nº 8.078/1990"
   ],
   [
    "crianca",
    "Lei nº 8.069/1990"
   ],
   [
    "penal",
    "Lei nº 8.429/1992"
   ],
   [
    "penal",
    "Lei nº 8.137/1990"
   ],
   [
    "penal",
    "Lei nº 8.072/1990"
   ],
   [
    "penal",
    "Lei nº 7.716/1989"
   ],
   [
    "penal",
    "Lei nº 9.455/1997"
   ],
   [
    "penal",
    "Lei nº 12.694/2012"
   ],
   [
    "penal",
    "Lei nº 12.850/2013"
   ],
   [
    "penal",
    "Lei nº 9.605/1998"
   ],
   [
    "penal",
    "Lei nº 9.503/1997"
   ],
   [
    "penal",
    "Lei nº 11.343/2006"
   ],
   [
    "penal",
    "Lei nº 4.898/1965"
   ],
   [
    "penal",
    "Lei nº 10.826/2003"
   ],
   [
    "penal",
    "Lei nº 9.613/1998"
   ],
   [
    "penal",
    "Lei nº 11.340/2006"
   ],
   [
    "penal",
    "Lei nº 7.210/1984"
   ],
   [
    "penal",
    "Lei nº 13.869/2019"
   ],
   [
    "penal",
    "Decreto-Lei nº 2.848/1940"
   ],
   [
    "processual_penal",
    "Lei nº 9.296/1996"
   ],
   [
    "processual_penal",
    "Lei nº 7.960/1989"
   ],
   [
    "constitucional",
    "CF/1988"
   ],
   [
    "empresarial",
    "Lei Complementar nº 123/2006"
   ],
   [
    "empresarial",
    "Lei nº 8.934/1994"
   ],
   [
    "empresarial",
    "Lei nº 9.279/1996"
   ],
   [
    "empresarial",
    "Lei nº 6.404/1976"
   ],
   [
    "empresarial",
    "Lei nº 11.101/2005"
   ],
   [
    "empresarial",
    "Lei nº 12.529/2011"
   ],
   [
    "tributario",
    "Lei nº 6.830/1980"
   ],
   [
    "tributario",
    "Lei Complementar nº 116/2003"
   ],
   [
    "tributario",
    "Lei Complementar nº 159/2016"
   ],
   [
    "tributario",
    "Lei Complementar nº 101/2000"
   ],
   [
    "tributario",
    "Lei nº 5.172/1966"
   ],
   [
    "ambiental",
    "Lei nº 11.107/2005"
   ],
   [
    "ambiental",
    "Lei Complementar nº 140/2011"
   ],
   [
    "ambiental",
    "Lei nº 6.938/1981"
   ],
   [
    "ambiental",
    "Decreto nº 99.274/1990"
   ],
   [
    "ambiental",
    "Lei nº 9.433/1997"
   ],
   [
    "ambiental",
    "Lei nº 12.305/2010"
   ],
   [
    "ambiental",
    "Lei nº 11.445/2007"
   ],
   [
    "ambiental",
    "Lei nº 12.651/2012"
   ],
   [
    "ambiental",
    "Lei nº 11.284/2006"
   ],
   [
    "ambiental",
    "Lei nº 9.985/2000"
   ],
   [
    "ambiental",
    "Lei nº 10.257/2001"
   ],
   [
    "ambiental",
    "Decreto nº 6.514/2008"
   ],
   [
    "administrativo",
    "Lei nº 9.784/1999"
   ],
   [
    "administrativo",
    "Lei nº 8.987/1995"
   ],
   [
    "administrativo",
    "Lei nº 11.079/2004"
   ],
   [
    "administrativo",
    "Lei nº 13.019/2014"
   ],
   [
    "administrativo",
    "Lei nº 13.460/2017"
   ],
   [
    "administrativo",
    "Lei nº 14.133/2021"
   ],
   [
    "administrativo",
    "Lei nº 8.666/1993"
   ],
   [
    "administrativo",
    "Lei nº 10.520/2002"
   ],
   [
    "administrativo",
    "Decreto nº 7.892/2013"
   ],
   [
    "administrativo",
    "Lei nº 12.462/2011"
   ],
   [
    "administrativo",
    "Decreto nº 6.017/2007"
   ],
   [
    "administrativo",
    "Lei nº 8.429/1992"
   ],
   [
    "administrativo",
    "Lei nº 4.320/1964"
   ],
   [
    "administrativo",
    "Lei Complementar nº 101/2000"
   ],
   [
    "administrativo",
    "Decreto-Lei nº 3.365/1941"
   ],
   [
    "previdenciario",
    "Emenda Constitucional nº 103/2019"
   ],
   [
    "previdenciario",
    "Lei nº 8.213/1991"
   ],
   [
    "previdenciario",
    "Lei nº 8.212/1991"
   ],
   [
    "humanos",
    "Decreto nº 678/1992"
   ],
   [
    "trabalhista",
    "Decreto-Lei nº 5.452/1943"
   ]
  ],
  "extras": [
   "Lei nº 9.826/1974",
   "Lei Complementar nº 58/2006",
   "Lei nº 12.670/1996",
   "Lei nº 12.023/1992",
   "Lei nº 15.812/2015",
   "Lei nº 16.259/2017",
   "Lei nº 15.614/2014",
   "Lei nº 13.568/2004",
   "Decreto nº 33.657/2020",
   "Lei Complementar nº 37/2003",
   "Lei nº 12.488/1995",
   "Lei Complementar nº 12/1999",
   "Lei Complementar nº 13/1999",
   "Lei Complementar nº 14/1999",
   "Lei Complementar nº 17/1999",
   "Lei Complementar nº 21/2000",
   "Lei Complementar nº 24/2000",
   "Lei Complementar nº 40/2004",
   "Lei Complementar nº 41/2004",
   "Lei Complementar nº 91/2010",
   "Lei Complementar nº 92/2011",
   "Lei Complementar nº 210/2019",
   "Lei Complementar nº 218/2020",
   "Lei nº 13.578/2005"
  ],
  "tipo": "edital"
 },
 {
  "id": "agu-adv-2022",
  "sigla": "AGU",
  "cargo": "Advogado da União",
  "orgao": "Advocacia-Geral da União",
  "titulo": "Concurso para Advogado da União",
  "edital": "Edital nº 1 – AGU (26/12/2022)",
  "grupos": [
   {
    "nome": "Grupo I",
    "disciplinas": [
     "Direito Constitucional",
     "Direito Administrativo",
     "Direito Tributário",
     "Legislação da AGU, Gestão de Conflitos e Governança",
     "Direito Financeiro e Econômico",
     "Direito Ambiental"
    ]
   },
   {
    "nome": "Grupo II",
    "disciplinas": [
     "Direito Civil",
     "Direito Processual Civil",
     "Direito Empresarial",
     "Direito Internacional Público e Privado"
    ]
   },
   {
    "nome": "Grupo III",
    "disciplinas": [
     "Direito Penal e Processual Penal",
     "Direito do Trabalho e Processual do Trabalho",
     "Direito da Seguridade Social",
     "Direito Eleitoral"
    ]
   }
  ],
  "leis": [
   [
    "civil",
    "Lei nº 13.874/2019"
   ],
   [
    "civil",
    "Decreto-Lei nº 4.657/1942"
   ],
   [
    "civil",
    "Lei nº 9.492/1997"
   ],
   [
    "civil",
    "Lei nº 6.015/1973"
   ],
   [
    "civil",
    "Lei nº 13.709/2018"
   ],
   [
    "civil",
    "Lei nº 12.965/2014"
   ],
   [
    "civil",
    "Lei nº 8.009/1990"
   ],
   [
    "civil",
    "Lei nº 10.406/2002"
   ],
   [
    "processual_civil",
    "Lei nº 13.140/2015"
   ],
   [
    "processual_civil",
    "Lei nº 13.105/2015"
   ],
   [
    "processual_civil",
    "Lei nº 9.307/1996"
   ],
   [
    "processual_civil",
    "Lei nº 13.129/2015"
   ],
   [
    "processual_civil",
    "Lei nº 8.437/1992"
   ],
   [
    "processual_civil",
    "Lei nº 9.494/1997"
   ],
   [
    "processual_civil",
    "Lei nº 11.419/2006"
   ],
   [
    "processual_civil",
    "Lei nº 12.016/2009"
   ],
   [
    "processual_civil",
    "Lei nº 4.717/1965"
   ],
   [
    "processual_civil",
    "Lei nº 7.347/1985"
   ],
   [
    "processual_civil",
    "Lei nº 9.507/1997"
   ],
   [
    "penal",
    "Lei nº 9.434/1997"
   ],
   [
    "penal",
    "Lei nº 9.263/1996"
   ],
   [
    "penal",
    "Decreto-Lei nº 2.848/1940"
   ],
   [
    "penal",
    "Lei nº 8.429/1992"
   ],
   [
    "penal",
    "Lei nº 9.613/1998"
   ],
   [
    "penal",
    "Lei nº 13.869/2019"
   ],
   [
    "processual_penal",
    "Lei nº 13.105/2015"
   ],
   [
    "processual_penal",
    "Lei nº 9.296/1996"
   ],
   [
    "processual_penal",
    "Lei nº 11.101/2005"
   ],
   [
    "processual_penal",
    "Lei nº 4.737/1965"
   ],
   [
    "processual_penal",
    "Decreto-Lei nº 3.689/1941"
   ],
   [
    "constitucional",
    "Lei nº 12.562/2011"
   ],
   [
    "constitucional",
    "Emenda Constitucional nº 45/2004"
   ],
   [
    "constitucional",
    "CF/1988"
   ],
   [
    "eleitoral",
    "Lei nº 9.504/1997"
   ],
   [
    "eleitoral",
    "Lei nº 4.737/1965"
   ],
   [
    "eleitoral",
    "Lei Complementar nº 64/1990"
   ],
   [
    "eleitoral",
    "Lei nº 9.096/1995"
   ],
   [
    "empresarial",
    "Lei nº 12.529/2011"
   ],
   [
    "empresarial",
    "Lei nº 6.404/1976"
   ],
   [
    "empresarial",
    "Lei nº 11.101/2005"
   ],
   [
    "empresarial",
    "Lei nº 8.934/1994"
   ],
   [
    "tributario",
    "Lei Complementar nº 118/2005"
   ],
   [
    "tributario",
    "Lei nº 9.703/1998"
   ],
   [
    "tributario",
    "Lei nº 10.522/2002"
   ],
   [
    "tributario",
    "Lei nº 5.172/1966"
   ],
   [
    "tributario",
    "Lei Complementar nº 101/2000"
   ],
   [
    "ambiental",
    "Lei nº 6.938/1981"
   ],
   [
    "ambiental",
    "Lei nº 12.305/2010"
   ],
   [
    "ambiental",
    "Lei nº 12.187/2009"
   ],
   [
    "ambiental",
    "Decreto nº 10.936/2022"
   ],
   [
    "ambiental",
    "Lei nº 9.985/2000"
   ],
   [
    "ambiental",
    "Lei nº 11.445/2007"
   ],
   [
    "ambiental",
    "Lei nº 11.107/2005"
   ],
   [
    "administrativo",
    "Lei nº 13.848/2019"
   ],
   [
    "administrativo",
    "Lei nº 13.303/2016"
   ],
   [
    "administrativo",
    "Lei nº 13.019/2014"
   ],
   [
    "administrativo",
    "Lei nº 9.790/1999"
   ],
   [
    "administrativo",
    "Lei nº 9.637/1998"
   ],
   [
    "administrativo",
    "Lei nº 8.666/1993"
   ],
   [
    "administrativo",
    "Lei nº 10.520/2002"
   ],
   [
    "administrativo",
    "Lei nº 14.133/2021"
   ],
   [
    "administrativo",
    "Lei nº 12.462/2011"
   ],
   [
    "administrativo",
    "Decreto nº 3.555/2000"
   ],
   [
    "administrativo",
    "Decreto nº 10.024/2019"
   ],
   [
    "administrativo",
    "Decreto nº 7.581/2011"
   ],
   [
    "administrativo",
    "Decreto nº 7.983/2013"
   ],
   [
    "administrativo",
    "Decreto nº 6.170/2007"
   ],
   [
    "administrativo",
    "Lei nº 9.873/1999"
   ],
   [
    "administrativo",
    "Lei nº 9.636/1998"
   ],
   [
    "administrativo",
    "Lei nº 8.112/1990"
   ],
   [
    "administrativo",
    "Lei nº 9.784/1999"
   ],
   [
    "administrativo",
    "Lei nº 4.320/1964"
   ],
   [
    "administrativo",
    "Lei Complementar nº 73/1993"
   ],
   [
    "administrativo",
    "Lei nº 9.028/1995"
   ],
   [
    "administrativo",
    "Lei nº 9.469/1997"
   ],
   [
    "administrativo",
    "Decreto nº 9.830/2019"
   ],
   [
    "administrativo",
    "Decreto nº 10.201/2020"
   ],
   [
    "administrativo",
    "Lei nº 12.813/2013"
   ],
   [
    "administrativo",
    "Lei nº 8.080/1990"
   ],
   [
    "administrativo",
    "Lei Complementar nº 101/2000"
   ],
   [
    "administrativo",
    "Lei nº 8.429/1992"
   ],
   [
    "administrativo",
    "Lei nº 12.527/2011"
   ],
   [
    "administrativo",
    "Decreto-Lei nº 3.365/1941"
   ],
   [
    "administrativo",
    "Lei nº 8.987/1995"
   ],
   [
    "administrativo",
    "Lei nº 11.079/2004"
   ],
   [
    "previdenciario",
    "Lei nº 8.213/1991"
   ],
   [
    "previdenciario",
    "Lei nº 8.212/1991"
   ],
   [
    "humanos",
    "Decreto nº 9.571/2018"
   ],
   [
    "trabalhista",
    "Lei nº 10.035/2000"
   ],
   [
    "trabalhista",
    "Decreto-Lei nº 5.452/1943"
   ]
  ],
  "extras": [
   "Lei nº 13.327/2016"
  ],
  "tipo": "edital"
 },
 {
  "id": "pfn-2022",
  "sigla": "PFN",
  "cargo": "Procurador da Fazenda Nacional",
  "orgao": "Advocacia-Geral da União (PGFN)",
  "titulo": "Concurso para Procurador da Fazenda Nacional",
  "edital": "Edital nº 1 – PFN (26/12/2022)",
  "grupos": [
   {
    "nome": "Grupo I",
    "disciplinas": [
     "Direito Tributário",
     "Direito Financeiro e Econômico",
     "Direito da Seguridade Social"
    ]
   },
   {
    "nome": "Grupo II",
    "disciplinas": [
     "Direito Processual Civil",
     "Direito Civil",
     "Direito Empresarial",
     "Direito Penal e Processual Penal",
     "Direito do Trabalho e Processual do Trabalho"
    ]
   },
   {
    "nome": "Grupo III",
    "disciplinas": [
     "Direito Constitucional",
     "Direito Administrativo",
     "Direito Internacional Público"
    ]
   }
  ],
  "leis": [
   [
    "civil",
    "Lei nº 13.874/2019"
   ],
   [
    "civil",
    "Lei nº 9.492/1997"
   ],
   [
    "civil",
    "Lei nº 6.015/1973"
   ],
   [
    "civil",
    "Lei nº 8.245/1991"
   ],
   [
    "civil",
    "Lei nº 9.610/1998"
   ],
   [
    "civil",
    "Lei nº 13.146/2015"
   ],
   [
    "civil",
    "Lei nº 13.709/2018"
   ],
   [
    "civil",
    "Lei nº 10.741/2003"
   ],
   [
    "civil",
    "Decreto-Lei nº 4.657/1942"
   ],
   [
    "civil",
    "Lei nº 10.406/2002"
   ],
   [
    "civil",
    "Lei nº 8.009/1990"
   ],
   [
    "processual_civil",
    "Lei nº 13.140/2015"
   ],
   [
    "processual_civil",
    "Lei nº 9.307/1996"
   ],
   [
    "processual_civil",
    "Lei nº 8.437/1992"
   ],
   [
    "processual_civil",
    "Lei nº 9.494/1997"
   ],
   [
    "processual_civil",
    "Lei nº 11.419/2006"
   ],
   [
    "processual_civil",
    "Lei nº 13.129/2015"
   ],
   [
    "processual_civil",
    "Lei nº 13.105/2015"
   ],
   [
    "processual_civil",
    "Lei nº 12.016/2009"
   ],
   [
    "processual_civil",
    "Lei nº 4.717/1965"
   ],
   [
    "processual_civil",
    "Lei nº 7.347/1985"
   ],
   [
    "processual_civil",
    "Lei nº 9.507/1997"
   ],
   [
    "consumidor",
    "Lei nº 8.078/1990"
   ],
   [
    "penal",
    "Lei nº 13.869/2019"
   ],
   [
    "penal",
    "Lei nº 1.521/1951"
   ],
   [
    "penal",
    "Lei nº 8.137/1990"
   ],
   [
    "penal",
    "Lei nº 8.176/1991"
   ],
   [
    "penal",
    "Lei nº 8.429/1992"
   ],
   [
    "penal",
    "Lei nº 9.613/1998"
   ],
   [
    "penal",
    "Lei nº 7.492/1986"
   ],
   [
    "penal",
    "Decreto-Lei nº 2.848/1940"
   ],
   [
    "processual_penal",
    "Lei nº 11.101/2005"
   ],
   [
    "processual_penal",
    "Lei nº 13.105/2015"
   ],
   [
    "processual_penal",
    "Decreto-Lei nº 3.689/1941"
   ],
   [
    "constitucional",
    "CF/1988"
   ],
   [
    "empresarial",
    "Lei Complementar nº 123/2006"
   ],
   [
    "empresarial",
    "Lei nº 11.101/2005"
   ],
   [
    "empresarial",
    "Lei nº 6.404/1976"
   ],
   [
    "empresarial",
    "Lei Complementar nº 182/2021"
   ],
   [
    "empresarial",
    "Lei nº 12.529/2011"
   ],
   [
    "empresarial",
    "Lei nº 9.279/1996"
   ],
   [
    "empresarial",
    "Lei nº 8.934/1994"
   ],
   [
    "tributario",
    "Lei nº 6.830/1980"
   ],
   [
    "tributario",
    "Lei Complementar nº 101/2000"
   ],
   [
    "tributario",
    "Lei Complementar nº 159/2016"
   ],
   [
    "tributario",
    "Decreto-Lei nº 147/1967"
   ],
   [
    "tributario",
    "Lei nº 9.703/1998"
   ],
   [
    "tributario",
    "Lei nº 10.522/2002"
   ],
   [
    "tributario",
    "Lei Complementar nº 105/2001"
   ],
   [
    "tributario",
    "Lei nº 5.172/1966"
   ],
   [
    "ambiental",
    "Lei nº 11.107/2005"
   ],
   [
    "administrativo",
    "Lei Complementar nº 101/2000"
   ],
   [
    "administrativo",
    "Lei nº 4.320/1964"
   ],
   [
    "administrativo",
    "Decreto-Lei nº 200/1967"
   ],
   [
    "administrativo",
    "Lei nº 13.848/2019"
   ],
   [
    "administrativo",
    "Lei nº 9.469/1997"
   ],
   [
    "administrativo",
    "Lei nº 13.303/2016"
   ],
   [
    "administrativo",
    "Lei nº 14.133/2021"
   ],
   [
    "administrativo",
    "Lei nº 12.846/2013"
   ],
   [
    "administrativo",
    "Lei nº 8.429/1992"
   ],
   [
    "administrativo",
    "Lei nº 10.520/2002"
   ],
   [
    "administrativo",
    "Decreto nº 6.170/2007"
   ],
   [
    "administrativo",
    "Decreto nº 7.746/2012"
   ],
   [
    "administrativo",
    "Lei nº 8.987/1995"
   ],
   [
    "administrativo",
    "Lei nº 8.112/1990"
   ],
   [
    "administrativo",
    "Lei nº 9.784/1999"
   ],
   [
    "administrativo",
    "Lei Complementar nº 73/1993"
   ],
   [
    "administrativo",
    "Decreto nº 1.171/1994"
   ],
   [
    "administrativo",
    "Decreto nº 6.029/2007"
   ],
   [
    "administrativo",
    "Decreto nº 11.129/2022"
   ],
   [
    "administrativo",
    "Lei nº 12.527/2011"
   ],
   [
    "administrativo",
    "Decreto nº 7.724/2012"
   ],
   [
    "previdenciario",
    "Lei nº 8.213/1991"
   ],
   [
    "previdenciario",
    "Lei nº 8.212/1991"
   ],
   [
    "trabalhista",
    "Lei nº 10.035/2000"
   ],
   [
    "trabalhista",
    "Decreto-Lei nº 5.452/1943"
   ]
  ],
  "extras": [
   "Lei nº 13.988/2018",
   "Decreto nº 93.872/1986",
   "Decreto nº 10.690/2021",
   "Emenda Constitucional nº 106/2020",
   "Lei nº 10.150/2000",
   "Lei Complementar nº 156/2016",
   "Lei Complementar nº 178/2021",
   "Decreto-Lei nº 73/1966",
   "Lei nº 14.430/2022",
   "Decreto nº 8.945/2016",
   "Lei nº 9.249/1995",
   "Lei nº 8.884/1994",
   "Lei nº 10.701/2003",
   "Lei nº 10.467/2002",
   "Decreto nº 2.799/1998",
   "Lei nº 13.467/2017",
   "Lei nº 14.437/2022",
   "Decreto nº 8.842/2016",
   "Resolução nº 303/2019"
  ],
  "tipo": "edital"
 },
 {
  "id": "mpmg-61",
  "sigla": "MPMG",
  "cargo": "Promotor de Justiça Substituto",
  "orgao": "Ministério Público do Estado de Minas Gerais",
  "titulo": "LXI Concurso para Ingresso na Carreira",
  "edital": "Edital do LXI Concurso (retificado em 13/08/2024) + Resolução CAPJ nº 5/2024",
  "grupos": [
   {
    "nome": "Grupo Temático I",
    "disciplinas": [
     "Direito Constitucional",
     "Direito Administrativo",
     "Direito Eleitoral",
     "Direito Tributário e Financeiro"
    ]
   },
   {
    "nome": "Grupo Temático II",
    "disciplinas": [
     "Direito Penal e Criminologia",
     "Direito Processual Penal"
    ]
   },
   {
    "nome": "Grupo Temático III",
    "disciplinas": [
     "Direito Civil",
     "Direito Processual Civil"
    ]
   },
   {
    "nome": "Grupo Temático IV",
    "disciplinas": [
     "Direito Material Coletivo (direitos difusos e coletivos, direitos humanos, infância e juventude, consumidor, ambiental e outros)"
    ]
   }
  ],
  "leis": [
   [
    "civil",
    "Lei nº 14.195/2021"
   ],
   [
    "civil",
    "Lei nº 13.709/2018"
   ],
   [
    "civil",
    "Lei nº 6.015/1973"
   ],
   [
    "civil",
    "Lei nº 4.380/1964"
   ],
   [
    "civil",
    "Lei nº 9.514/1997"
   ],
   [
    "civil",
    "Lei nº 8.245/1991"
   ],
   [
    "civil",
    "Lei nº 4.591/1964"
   ],
   [
    "civil",
    "Lei nº 5.478/1968"
   ],
   [
    "civil",
    "Lei nº 8.560/1992"
   ],
   [
    "civil",
    "Lei nº 11.804/2008"
   ],
   [
    "civil",
    "Lei nº 10.741/2003"
   ],
   [
    "civil",
    "Lei nº 13.146/2015"
   ],
   [
    "civil",
    "Lei nº 12.965/2014"
   ],
   [
    "civil",
    "Lei nº 13.853/2019"
   ],
   [
    "civil",
    "Lei nº 13.874/2019"
   ],
   [
    "civil",
    "Lei nº 14.010/2020"
   ],
   [
    "civil",
    "Lei nº 1.060/1950"
   ],
   [
    "civil",
    "Lei nº 13.786/2018"
   ],
   [
    "civil",
    "Lei nº 6.766/1979"
   ],
   [
    "civil",
    "Lei nº 10.406/2002"
   ],
   [
    "civil",
    "Decreto-Lei nº 4.657/1942"
   ],
   [
    "civil",
    "Lei nº 9.278/1996"
   ],
   [
    "civil",
    "Lei nº 8.009/1990"
   ],
   [
    "processual_civil",
    "Lei nº 13.655/2018"
   ],
   [
    "processual_civil",
    "Lei nº 8.038/1990"
   ],
   [
    "processual_civil",
    "Lei nº 9.099/1995"
   ],
   [
    "processual_civil",
    "Lei nº 11.417/2006"
   ],
   [
    "processual_civil",
    "Lei nº 13.105/2015"
   ],
   [
    "processual_civil",
    "Lei nº 9.507/1997"
   ],
   [
    "processual_civil",
    "Lei nº 11.419/2006"
   ],
   [
    "processual_civil",
    "Lei nº 9.307/1996"
   ],
   [
    "processual_civil",
    "Lei nº 13.140/2015"
   ],
   [
    "processual_civil",
    "Lei nº 4.717/1965"
   ],
   [
    "processual_civil",
    "Lei nº 7.347/1985"
   ],
   [
    "processual_civil",
    "Lei nº 12.016/2009"
   ],
   [
    "consumidor",
    "Lei nº 8.078/1990"
   ],
   [
    "consumidor",
    "Lei nº 14.181/2021"
   ],
   [
    "consumidor",
    "Lei nº 9.656/1998"
   ],
   [
    "crianca",
    "Lei nº 13.431/2017"
   ],
   [
    "crianca",
    "Lei nº 14.344/2022"
   ],
   [
    "crianca",
    "Lei nº 10.216/2001"
   ],
   [
    "crianca",
    "Lei nº 8.069/1990"
   ],
   [
    "crianca",
    "Lei nº 13.257/2016"
   ],
   [
    "crianca",
    "Lei nº 13.185/2015"
   ],
   [
    "penal",
    "Lei nº 8.137/1990"
   ],
   [
    "penal",
    "Decreto-Lei nº 2.848/1940"
   ],
   [
    "penal",
    "Decreto-Lei nº 201/1967"
   ],
   [
    "penal",
    "Lei nº 7.492/1986"
   ],
   [
    "penal",
    "Lei nº 8.072/1990"
   ],
   [
    "penal",
    "Lei nº 8.176/1991"
   ],
   [
    "penal",
    "Lei nº 9.503/1997"
   ],
   [
    "penal",
    "Lei nº 9.455/1997"
   ],
   [
    "penal",
    "Lei nº 9.605/1998"
   ],
   [
    "penal",
    "Lei nº 9.613/1998"
   ],
   [
    "penal",
    "Lei nº 11.340/2006"
   ],
   [
    "penal",
    "Lei nº 11.343/2006"
   ],
   [
    "penal",
    "Lei nº 12.694/2012"
   ],
   [
    "penal",
    "Lei nº 12.850/2013"
   ],
   [
    "penal",
    "Lei nº 13.260/2016"
   ],
   [
    "penal",
    "Lei nº 13.344/2016"
   ],
   [
    "penal",
    "Lei nº 13.869/2019"
   ],
   [
    "penal",
    "Lei nº 14.532/2023"
   ],
   [
    "penal",
    "Lei nº 9.434/1997"
   ],
   [
    "penal",
    "Lei nº 8.429/1992"
   ],
   [
    "penal",
    "Lei nº 13.964/2019"
   ],
   [
    "penal",
    "Lei nº 7.210/1984"
   ],
   [
    "processual_penal",
    "Decreto-Lei nº 3.240/1941"
   ],
   [
    "processual_penal",
    "Decreto-Lei nº 3.689/1941"
   ],
   [
    "processual_penal",
    "Decreto-Lei nº 3.931/1941"
   ],
   [
    "processual_penal",
    "Decreto-Lei nº 1.002/1969"
   ],
   [
    "processual_penal",
    "Lei nº 1.579/1952"
   ],
   [
    "processual_penal",
    "Lei nº 4.737/1965"
   ],
   [
    "processual_penal",
    "Lei nº 5.249/1967"
   ],
   [
    "processual_penal",
    "Decreto-Lei nº 201/1967"
   ],
   [
    "processual_penal",
    "Lei nº 7.960/1989"
   ],
   [
    "processual_penal",
    "Lei nº 8.658/1993"
   ],
   [
    "processual_penal",
    "Lei nº 9.099/1995"
   ],
   [
    "processual_penal",
    "Lei nº 9.296/1996"
   ],
   [
    "processual_penal",
    "Lei nº 9.807/1999"
   ],
   [
    "processual_penal",
    "Lei nº 11.101/2005"
   ],
   [
    "processual_penal",
    "Lei nº 11.340/2006"
   ],
   [
    "processual_penal",
    "Lei nº 11.343/2006"
   ],
   [
    "processual_penal",
    "Lei nº 11.671/2008"
   ],
   [
    "processual_penal",
    "Lei nº 12.037/2009"
   ],
   [
    "processual_penal",
    "Lei nº 12.850/2013"
   ],
   [
    "processual_penal",
    "Lei nº 13.105/2015"
   ],
   [
    "processual_penal",
    "Lei nº 13.431/2017"
   ],
   [
    "processual_penal",
    "Lei nº 7.210/1984"
   ],
   [
    "constitucional",
    "Lei nº 13.300/2016"
   ],
   [
    "constitucional",
    "CF/1988"
   ],
   [
    "eleitoral",
    "Lei Complementar nº 64/1990"
   ],
   [
    "eleitoral",
    "Lei nº 4.737/1965"
   ],
   [
    "eleitoral",
    "Lei nº 9.096/1995"
   ],
   [
    "eleitoral",
    "Lei nº 9.504/1997"
   ],
   [
    "empresarial",
    "Lei nº 11.101/2005"
   ],
   [
    "empresarial",
    "Lei nº 8.934/1994"
   ],
   [
    "empresarial",
    "Lei nº 7.913/1989"
   ],
   [
    "empresarial",
    "Lei nº 12.529/2011"
   ],
   [
    "empresarial",
    "Lei Complementar nº 123/2006"
   ],
   [
    "tributario",
    "Lei nº 6.830/1980"
   ],
   [
    "tributario",
    "Lei nº 8.397/1992"
   ],
   [
    "tributario",
    "Lei Complementar nº 101/2000"
   ],
   [
    "tributario",
    "Lei Complementar nº 105/2001"
   ],
   [
    "tributario",
    "Lei nº 5.172/1966"
   ],
   [
    "ambiental",
    "Lei nº 11.105/2005"
   ],
   [
    "ambiental",
    "Lei nº 10.257/2001"
   ],
   [
    "ambiental",
    "Lei nº 12.334/2010"
   ],
   [
    "ambiental",
    "Lei nº 14.755/2023"
   ],
   [
    "ambiental",
    "Medida Provisória nº 2.220/2001"
   ],
   [
    "ambiental",
    "Lei nº 13.465/2017"
   ],
   [
    "ambiental",
    "Decreto nº 9.310/2018"
   ],
   [
    "ambiental",
    "Lei nº 12.587/2012"
   ],
   [
    "ambiental",
    "Lei nº 11.124/2005"
   ],
   [
    "ambiental",
    "Lei nº 11.977/2009"
   ],
   [
    "ambiental",
    "Lei nº 13.425/2017"
   ],
   [
    "ambiental",
    "Lei nº 12.651/2012"
   ],
   [
    "ambiental",
    "Lei nº 12.305/2010"
   ],
   [
    "ambiental",
    "Lei nº 9.985/2000"
   ],
   [
    "ambiental",
    "Lei nº 9.433/1997"
   ],
   [
    "ambiental",
    "Lei nº 11.445/2007"
   ],
   [
    "ambiental",
    "Lei nº 11.107/2005"
   ],
   [
    "administrativo",
    "Lei nº 13.019/2014"
   ],
   [
    "administrativo",
    "Lei nº 14.133/2021"
   ],
   [
    "administrativo",
    "Lei nº 8.987/1995"
   ],
   [
    "administrativo",
    "Lei nº 10.520/2002"
   ],
   [
    "administrativo",
    "Decreto nº 7.892/2013"
   ],
   [
    "administrativo",
    "Lei nº 14.129/2021"
   ],
   [
    "administrativo",
    "Lei nº 4.320/1964"
   ],
   [
    "administrativo",
    "Lei Complementar nº 101/2000"
   ],
   [
    "administrativo",
    "Lei nº 8.625/1993"
   ],
   [
    "administrativo",
    "Lei Complementar nº 75/1993"
   ],
   [
    "administrativo",
    "Lei nº 8.906/1994"
   ],
   [
    "administrativo",
    "Lei nº 14.230/2021"
   ],
   [
    "administrativo",
    "Lei nº 8.429/1992"
   ],
   [
    "administrativo",
    "Lei nº 12.846/2013"
   ],
   [
    "administrativo",
    "Lei nº 13.979/2020"
   ],
   [
    "administrativo",
    "Lei nº 9.394/1996"
   ],
   [
    "administrativo",
    "Lei nº 13.301/2016"
   ],
   [
    "administrativo",
    "Decreto nº 8.420/2015"
   ],
   [
    "administrativo",
    "Lei nº 12.527/2011"
   ],
   [
    "administrativo",
    "Decreto nº 11.129/2022"
   ],
   [
    "administrativo",
    "Decreto-Lei nº 3.365/1941"
   ],
   [
    "administrativo",
    "Lei nº 11.079/2004"
   ],
   [
    "previdenciario",
    "Lei nº 8.742/1993"
   ],
   [
    "previdenciario",
    "Lei nº 8.213/1991"
   ],
   [
    "previdenciario",
    "Lei nº 8.212/1991"
   ],
   [
    "humanos",
    "Lei nº 11.346/2006"
   ],
   [
    "humanos",
    "Lei nº 10.639/2003"
   ],
   [
    "humanos",
    "Lei nº 11.645/2008"
   ],
   [
    "humanos",
    "Lei nº 7.853/1989"
   ],
   [
    "humanos",
    "Lei nº 12.288/2010"
   ],
   [
    "humanos",
    "Decreto nº 678/1992"
   ],
   [
    "humanos",
    "Decreto nº 6.949/2009"
   ]
  ],
  "extras": [
   "Lei nº 14.167/2002",
   "Lei nº 13.994/2001",
   "Lei nº 13.209/1999",
   "Lei Complementar nº 34/1994",
   "Lei nº 5.256/1967",
   "Lei nº 13.097/2015",
   "Lei nº 14.341/2022",
   "Lei nº 24.844/2024",
   "Lei nº 23.291/2019",
   "Lei nº 23.795/2021",
   "Lei nº 14.852/2024",
   "Lei nº 13.392/1999",
   "Decreto nº 83.936/1979",
   "Resolução nº 780/2014",
   "Resolução CNMP nº 179/2017",
   "Resolução CNMP nº 23/2007",
   "Resolução CNMP nº 174/2017",
   "Resolução CNMP nº 164/2017"
  ],
  "tipo": "edital"
 },
 {
  "id": "trf5-xvi",
  "sigla": "TRF5",
  "cargo": "Juiz Federal Substituto",
  "orgao": "Tribunal Regional Federal da 5ª Região",
  "titulo": "XVI Concurso para Juiz Federal Substituto",
  "edital": "Edital nº 01/2026 (retificado em 17/09/2026)",
  "grupos": [
   {
    "nome": "Bloco Um",
    "disciplinas": [
     "Direito Constitucional",
     "Direito Previdenciário",
     "Direito Penal",
     "Direito Processual Penal",
     "Direito Econômico e de Proteção ao Consumidor"
    ]
   },
   {
    "nome": "Bloco Dois",
    "disciplinas": [
     "Direito Civil",
     "Direito Processual Civil",
     "Direito Empresarial",
     "Direito Financeiro e Tributário"
    ]
   },
   {
    "nome": "Bloco Três",
    "disciplinas": [
     "Direito Administrativo",
     "Direito Ambiental",
     "Direito Internacional Público e Privado",
     "Noções Gerais de Direito e Formação Humanística",
     "Direitos Humanos"
    ]
   }
  ],
  "leis": [
   [
    "civil",
    "Lei nº 14.063/2020"
   ],
   [
    "civil",
    "Decreto-Lei nº 4.657/1942"
   ],
   [
    "civil",
    "Lei nº 6.015/1973"
   ],
   [
    "civil",
    "Lei nº 13.146/2015"
   ],
   [
    "civil",
    "Lei nº 13.709/2018"
   ],
   [
    "civil",
    "Lei nº 9.278/1996"
   ],
   [
    "civil",
    "Lei nº 8.009/1990"
   ],
   [
    "civil",
    "Lei nº 10.406/2002"
   ],
   [
    "processual_civil",
    "Lei nº 13.105/2015"
   ],
   [
    "processual_civil",
    "Lei nº 12.016/2009"
   ],
   [
    "processual_civil",
    "Lei nº 4.717/1965"
   ],
   [
    "processual_civil",
    "Lei nº 7.347/1985"
   ],
   [
    "processual_civil",
    "Lei nº 9.307/1996"
   ],
   [
    "processual_civil",
    "Lei nº 13.140/2015"
   ],
   [
    "processual_civil",
    "Lei nº 9.099/1995"
   ],
   [
    "processual_civil",
    "Lei nº 10.259/2001"
   ],
   [
    "consumidor",
    "Lei nº 8.078/1990"
   ],
   [
    "penal",
    "Decreto-Lei nº 2.848/1940"
   ],
   [
    "penal",
    "Lei nº 7.210/1984"
   ],
   [
    "penal",
    "Lei nº 8.429/1992"
   ],
   [
    "penal",
    "Lei nº 9.605/1998"
   ],
   [
    "penal",
    "Lei nº 8.072/1990"
   ],
   [
    "penal",
    "Lei nº 9.613/1998"
   ],
   [
    "penal",
    "Lei nº 9.455/1997"
   ],
   [
    "penal",
    "Lei nº 13.869/2019"
   ],
   [
    "penal",
    "Lei nº 13.260/2016"
   ],
   [
    "processual_penal",
    "Lei nº 13.105/2015"
   ],
   [
    "processual_penal",
    "Lei nº 7.210/1984"
   ],
   [
    "processual_penal",
    "Lei nº 11.101/2005"
   ],
   [
    "processual_penal",
    "Lei nº 9.099/1995"
   ],
   [
    "processual_penal",
    "Decreto-Lei nº 3.689/1941"
   ],
   [
    "constitucional",
    "CF/1988"
   ],
   [
    "empresarial",
    "Lei nº 11.101/2005"
   ],
   [
    "empresarial",
    "Lei nº 6.404/1976"
   ],
   [
    "empresarial",
    "Lei nº 12.529/2011"
   ],
   [
    "empresarial",
    "Lei nº 9.279/1996"
   ],
   [
    "tributario",
    "Lei nº 5.172/1966"
   ],
   [
    "ambiental",
    "Lei nº 12.305/2010"
   ],
   [
    "ambiental",
    "Lei nº 9.985/2000"
   ],
   [
    "ambiental",
    "Lei nº 9.433/1997"
   ],
   [
    "ambiental",
    "Lei nº 11.445/2007"
   ],
   [
    "administrativo",
    "Lei nº 8.429/1992"
   ],
   [
    "administrativo",
    "Lei nº 14.133/2021"
   ],
   [
    "administrativo",
    "Decreto-Lei nº 3.365/1941"
   ],
   [
    "administrativo",
    "Lei nº 11.079/2004"
   ],
   [
    "previdenciario",
    "Lei nº 8.213/1991"
   ],
   [
    "previdenciario",
    "Lei nº 8.212/1991"
   ],
   [
    "humanos",
    "Lei nº 9.474/1997"
   ],
   [
    "humanos",
    "Decreto nº 678/1992"
   ],
   [
    "humanos",
    "Decreto nº 6.949/2009"
   ]
  ],
  "extras": [],
  "tipo": "edital"
 },
 {
  "id": "enam-2026-2",
  "sigla": "ENAM",
  "cargo": "Exame Nacional da Magistratura 2026.2",
  "orgao": "ENFAM",
  "titulo": "6º Exame Nacional da Magistratura",
  "edital": "Edital de abertura nº 02/2026",
  "grupos": [
   {
    "nome": "Disciplinas da prova",
    "disciplinas": [
     "Direito Constitucional",
     "Direito Administrativo",
     "Noções Gerais de Direito e Formação Humanística",
     "Direitos Humanos",
     "Direito Processual Civil",
     "Direito Civil",
     "Direito Empresarial",
     "Direito Penal"
    ]
   }
  ],
  "leis": [
   [
    "civil",
    "Lei nº 13.709/2018"
   ],
   [
    "civil",
    "Lei nº 13.874/2019"
   ],
   [
    "civil",
    "Lei nº 14.711/2023"
   ],
   [
    "civil",
    "Lei nº 14.195/2021"
   ],
   [
    "civil",
    "Lei nº 10.406/2002"
   ],
   [
    "civil",
    "Decreto-Lei nº 4.657/1942"
   ],
   [
    "civil",
    "Lei nº 10.741/2003"
   ],
   [
    "civil",
    "Lei nº 13.146/2015"
   ],
   [
    "civil",
    "Lei nº 12.965/2014"
   ],
   [
    "civil",
    "Lei nº 6.766/1979"
   ],
   [
    "civil",
    "Lei nº 1.060/1950"
   ],
   [
    "civil",
    "Lei nº 9.278/1996"
   ],
   [
    "civil",
    "Lei nº 8.009/1990"
   ],
   [
    "civil",
    "Lei nº 8.245/1991"
   ],
   [
    "processual_civil",
    "Lei nº 13.655/2018"
   ],
   [
    "processual_civil",
    "Lei nº 12.016/2009"
   ],
   [
    "processual_civil",
    "Lei nº 4.717/1965"
   ],
   [
    "processual_civil",
    "Lei nº 7.347/1985"
   ],
   [
    "processual_civil",
    "Lei nº 9.507/1997"
   ],
   [
    "processual_civil",
    "Lei nº 9.307/1996"
   ],
   [
    "processual_civil",
    "Lei nº 13.140/2015"
   ],
   [
    "processual_civil",
    "Lei nº 9.099/1995"
   ],
   [
    "processual_civil",
    "Lei nº 10.259/2001"
   ],
   [
    "processual_civil",
    "Lei nº 12.153/2009"
   ],
   [
    "processual_civil",
    "Lei nº 13.105/2015"
   ],
   [
    "penal",
    "Decreto-Lei nº 2.848/1940"
   ],
   [
    "penal",
    "Lei nº 8.429/1992"
   ],
   [
    "penal",
    "Lei nº 9.613/1998"
   ],
   [
    "processual_penal",
    "Lei nº 11.101/2005"
   ],
   [
    "processual_penal",
    "Lei nº 9.099/1995"
   ],
   [
    "processual_penal",
    "Lei nº 9.296/1996"
   ],
   [
    "processual_penal",
    "Decreto-Lei nº 3.689/1941"
   ],
   [
    "constitucional",
    "CF/1988"
   ],
   [
    "empresarial",
    "Lei Complementar nº 123/2006"
   ],
   [
    "empresarial",
    "Lei nº 6.404/1976"
   ],
   [
    "empresarial",
    "Lei nº 11.101/2005"
   ],
   [
    "empresarial",
    "Lei nº 9.279/1996"
   ],
   [
    "administrativo",
    "Decreto-Lei nº 3.365/1941"
   ],
   [
    "administrativo",
    "Lei nº 13.460/2017"
   ],
   [
    "administrativo",
    "Lei nº 13.303/2016"
   ],
   [
    "administrativo",
    "Lei nº 13.848/2019"
   ],
   [
    "administrativo",
    "Lei nº 14.230/2021"
   ],
   [
    "administrativo",
    "Lei nº 8.429/1992"
   ],
   [
    "administrativo",
    "Lei nº 14.133/2021"
   ],
   [
    "administrativo",
    "Lei nº 8.987/1995"
   ],
   [
    "humanos",
    "Decreto nº 678/1992"
   ],
   [
    "humanos",
    "Decreto nº 6.949/2009"
   ],
   [
    "humanos",
    "Decreto nº 592/1992"
   ]
  ],
  "extras": [],
  "tipo": "edital"
 },
 {
  "id": "tjrs-2026",
  "sigla": "TJRS",
  "cargo": "Juiz de Direito Substituto",
  "orgao": "Tribunal de Justiça do Estado do Rio Grande do Sul",
  "titulo": "Concurso para Juiz de Direito Substituto",
  "edital": "Edital nº 0031/2026-DMAG (retificado pelo nº 0032/2026)",
  "grupos": [
   {
    "nome": "Bloco Um",
    "disciplinas": [
     "Direito Civil",
     "Direito Processual Civil",
     "Direito do Consumidor",
     "Direito da Criança e do Adolescente"
    ]
   },
   {
    "nome": "Bloco Dois",
    "disciplinas": [
     "Direito Penal",
     "Direito Processual Penal",
     "Direito Constitucional",
     "Direito Eleitoral"
    ]
   },
   {
    "nome": "Bloco Três",
    "disciplinas": [
     "Direito Empresarial",
     "Direito Tributário",
     "Direito Ambiental",
     "Direito Administrativo",
     "Noções Gerais de Direito e Formação Humanística",
     "Direitos Humanos"
    ]
   }
  ],
  "leis": [
   [
    "civil",
    "Lei nº 14.905/2024"
   ],
   [
    "civil",
    "Lei nº 13.874/2019"
   ],
   [
    "civil",
    "Lei nº 13.058/2014"
   ],
   [
    "civil",
    "Lei nº 6.015/1973"
   ],
   [
    "civil",
    "Lei nº 8.935/1994"
   ],
   [
    "civil",
    "Decreto-Lei nº 911/1969"
   ],
   [
    "civil",
    "Lei nº 9.514/1997"
   ],
   [
    "civil",
    "Lei nº 4.591/1964"
   ],
   [
    "civil",
    "Lei nº 10.931/2004"
   ],
   [
    "civil",
    "Lei nº 9.610/1998"
   ],
   [
    "civil",
    "Lei nº 10.741/2003"
   ],
   [
    "civil",
    "Lei nº 8.245/1991"
   ],
   [
    "civil",
    "Lei nº 13.146/2015"
   ],
   [
    "civil",
    "Lei nº 14.382/2022"
   ],
   [
    "civil",
    "Lei nº 14.010/2020"
   ],
   [
    "civil",
    "Lei nº 13.709/2018"
   ],
   [
    "civil",
    "Lei nº 12.965/2014"
   ],
   [
    "civil",
    "Lei nº 6.766/1979"
   ],
   [
    "civil",
    "Decreto nº 9.176/2017"
   ],
   [
    "civil",
    "Decreto nº 3.413/2000"
   ],
   [
    "civil",
    "Lei nº 10.406/2002"
   ],
   [
    "civil",
    "Decreto-Lei nº 4.657/1942"
   ],
   [
    "civil",
    "Lei nº 9.278/1996"
   ],
   [
    "civil",
    "Lei nº 8.009/1990"
   ],
   [
    "processual_civil",
    "Lei nº 9.099/1995"
   ],
   [
    "processual_civil",
    "Lei nº 13.105/2015"
   ],
   [
    "processual_civil",
    "Lei nº 12.016/2009"
   ],
   [
    "processual_civil",
    "Lei nº 4.717/1965"
   ],
   [
    "processual_civil",
    "Lei nº 7.347/1985"
   ],
   [
    "processual_civil",
    "Lei nº 9.507/1997"
   ],
   [
    "processual_civil",
    "Lei nº 13.140/2015"
   ],
   [
    "consumidor",
    "Decreto nº 7.962/2013"
   ],
   [
    "consumidor",
    "Lei nº 12.414/2011"
   ],
   [
    "consumidor",
    "Decreto nº 9.936/2019"
   ],
   [
    "consumidor",
    "Lei nº 9.656/1998"
   ],
   [
    "consumidor",
    "Lei nº 8.078/1990"
   ],
   [
    "crianca",
    "Lei nº 8.069/1990"
   ],
   [
    "crianca",
    "Lei nº 14.344/2022"
   ],
   [
    "crianca",
    "Lei nº 15.211/2025"
   ],
   [
    "crianca",
    "Lei nº 15.240/2025"
   ],
   [
    "crianca",
    "Lei nº 13.431/2017"
   ],
   [
    "penal",
    "Lei nº 7.210/1984"
   ],
   [
    "penal",
    "Lei nº 8.072/1990"
   ],
   [
    "penal",
    "Lei nº 12.694/2012"
   ],
   [
    "penal",
    "Lei nº 12.850/2013"
   ],
   [
    "penal",
    "Decreto-Lei nº 3.688/1941"
   ],
   [
    "penal",
    "Lei nº 13.869/2019"
   ],
   [
    "penal",
    "Lei nº 10.826/2003"
   ],
   [
    "penal",
    "Lei nº 11.343/2006"
   ],
   [
    "penal",
    "Lei nº 1.521/1951"
   ],
   [
    "penal",
    "Lei nº 9.613/1998"
   ],
   [
    "penal",
    "Lei nº 12.683/2012"
   ],
   [
    "penal",
    "Lei nº 9.605/1998"
   ],
   [
    "penal",
    "Lei nº 11.340/2006"
   ],
   [
    "penal",
    "Lei nº 8.176/1991"
   ],
   [
    "penal",
    "Lei nº 8.137/1990"
   ],
   [
    "penal",
    "Lei nº 12.984/2014"
   ],
   [
    "penal",
    "Lei nº 7.716/1989"
   ],
   [
    "penal",
    "Decreto-Lei nº 201/1967"
   ],
   [
    "penal",
    "Lei nº 10.671/2003"
   ],
   [
    "penal",
    "Lei nº 9.455/1997"
   ],
   [
    "penal",
    "Lei nº 9.503/1997"
   ],
   [
    "penal",
    "Lei nº 8.429/1992"
   ],
   [
    "penal",
    "Decreto-Lei nº 2.848/1940"
   ],
   [
    "processual_penal",
    "Lei nº 7.210/1984"
   ],
   [
    "processual_penal",
    "Lei nº 12.850/2013"
   ],
   [
    "processual_penal",
    "Lei nº 9.099/1995"
   ],
   [
    "processual_penal",
    "Lei nº 13.431/2017"
   ],
   [
    "processual_penal",
    "Lei nº 11.343/2006"
   ],
   [
    "processual_penal",
    "Lei nº 4.737/1965"
   ],
   [
    "processual_penal",
    "Lei nº 11.101/2005"
   ],
   [
    "processual_penal",
    "Lei nº 11.340/2006"
   ],
   [
    "processual_penal",
    "Decreto-Lei nº 201/1967"
   ],
   [
    "processual_penal",
    "Lei nº 13.105/2015"
   ],
   [
    "processual_penal",
    "Lei nº 9.296/1996"
   ],
   [
    "processual_penal",
    "Lei nº 7.960/1989"
   ],
   [
    "processual_penal",
    "Lei nº 9.807/1999"
   ],
   [
    "processual_penal",
    "Decreto-Lei nº 3.689/1941"
   ],
   [
    "constitucional",
    "CF/1988"
   ],
   [
    "eleitoral",
    "Lei nº 4.737/1965"
   ],
   [
    "eleitoral",
    "Lei nº 9.504/1997"
   ],
   [
    "eleitoral",
    "Lei nº 6.091/1974"
   ],
   [
    "eleitoral",
    "Lei nº 6.996/1982"
   ],
   [
    "eleitoral",
    "Lei Complementar nº 64/1990"
   ],
   [
    "eleitoral",
    "Lei nº 9.096/1995"
   ],
   [
    "empresarial",
    "Lei nº 11.101/2005"
   ],
   [
    "empresarial",
    "Lei nº 8.934/1994"
   ],
   [
    "empresarial",
    "Lei nº 6.404/1976"
   ],
   [
    "empresarial",
    "Lei nº 9.279/1996"
   ],
   [
    "empresarial",
    "Lei nº 9.609/1998"
   ],
   [
    "empresarial",
    "Lei nº 12.529/2011"
   ],
   [
    "empresarial",
    "Lei nº 4.886/1965"
   ],
   [
    "empresarial",
    "Lei nº 14.193/2021"
   ],
   [
    "empresarial",
    "Lei Complementar nº 182/2021"
   ],
   [
    "empresarial",
    "Lei Complementar nº 123/2006"
   ],
   [
    "tributario",
    "Lei nº 6.537/1973"
   ],
   [
    "tributario",
    "Emenda Constitucional nº 132/2023"
   ],
   [
    "tributario",
    "Lei Complementar nº 101/2000"
   ],
   [
    "tributario",
    "Lei nº 5.172/1966"
   ],
   [
    "ambiental",
    "Lei nº 15.190/2025"
   ],
   [
    "ambiental",
    "Lei nº 15.300/2025"
   ],
   [
    "ambiental",
    "Lei nº 13.465/2017"
   ],
   [
    "ambiental",
    "Lei nº 12.608/2012"
   ],
   [
    "ambiental",
    "Lei nº 12.651/2012"
   ],
   [
    "ambiental",
    "Lei nº 14.904/2024"
   ],
   [
    "ambiental",
    "Lei nº 10.257/2001"
   ],
   [
    "ambiental",
    "Lei nº 12.305/2010"
   ],
   [
    "ambiental",
    "Lei nº 9.985/2000"
   ],
   [
    "ambiental",
    "Lei nº 9.433/1997"
   ],
   [
    "ambiental",
    "Lei nº 12.187/2009"
   ],
   [
    "ambiental",
    "Lei nº 11.445/2007"
   ],
   [
    "ambiental",
    "Lei nº 11.107/2005"
   ],
   [
    "administrativo",
    "Decreto-Lei nº 200/1967"
   ],
   [
    "administrativo",
    "Lei nº 14.133/2021"
   ],
   [
    "administrativo",
    "Decreto-Lei nº 3.365/1941"
   ],
   [
    "administrativo",
    "Lei nº 8.429/1992"
   ],
   [
    "administrativo",
    "Lei nº 14.230/2021"
   ],
   [
    "administrativo",
    "Lei Complementar nº 101/2000"
   ],
   [
    "administrativo",
    "Lei nº 12.527/2011"
   ],
   [
    "administrativo",
    "Lei nº 11.079/2004"
   ],
   [
    "humanos",
    "Lei nº 7.716/1989"
   ],
   [
    "humanos",
    "Lei nº 12.288/2010"
   ]
  ],
  "extras": [
   "Lei nº 7.356/1980",
   "Resolução nº 510/2023",
   "Resolução CNJ nº 598/2024"
  ],
  "tipo": "edital"
 },
 {
  "id": "tjpe-2026",
  "sigla": "TJPE",
  "cargo": "Juiz Substituto",
  "orgao": "Tribunal de Justiça do Estado de Pernambuco",
  "titulo": "Concurso de Juiz Substituto",
  "edital": "Edital nº 01/2026 (retificado em 31/07/2026)",
  "grupos": [
   {
    "nome": "Bloco I",
    "disciplinas": [
     "Direito Civil",
     "Direito Processual Civil",
     "Direito do Consumidor",
     "Direito da Criança e do Adolescente"
    ]
   },
   {
    "nome": "Bloco II",
    "disciplinas": [
     "Direito Penal",
     "Direito Processual Penal",
     "Direito Constitucional",
     "Direito Eleitoral"
    ]
   },
   {
    "nome": "Bloco III",
    "disciplinas": [
     "Direito Empresarial",
     "Direito Financeiro e Tributário",
     "Direito Ambiental",
     "Direito Administrativo",
     "Noções Gerais de Direito e Formação Humanística",
     "Direitos Humanos"
    ]
   }
  ],
  "leis": [
   [
    "civil",
    "Decreto nº 22.626/1933"
   ],
   [
    "civil",
    "Lei nº 13.874/2019"
   ],
   [
    "civil",
    "Lei nº 13.058/2014"
   ],
   [
    "civil",
    "Lei nº 6.015/1973"
   ],
   [
    "civil",
    "Lei nº 8.935/1994"
   ],
   [
    "civil",
    "Decreto-Lei nº 911/1969"
   ],
   [
    "civil",
    "Lei nº 9.514/1997"
   ],
   [
    "civil",
    "Lei nº 4.591/1964"
   ],
   [
    "civil",
    "Lei nº 10.931/2004"
   ],
   [
    "civil",
    "Lei nº 10.741/2003"
   ],
   [
    "civil",
    "Lei nº 8.245/1991"
   ],
   [
    "civil",
    "Lei nº 13.146/2015"
   ],
   [
    "civil",
    "Lei nº 14.382/2022"
   ],
   [
    "civil",
    "Lei nº 14.010/2020"
   ],
   [
    "civil",
    "Lei nº 13.709/2018"
   ],
   [
    "civil",
    "Lei nº 12.965/2014"
   ],
   [
    "civil",
    "Lei nº 6.766/1979"
   ],
   [
    "civil",
    "Lei nº 8.009/1990"
   ],
   [
    "civil",
    "Decreto nº 20.910/1932"
   ],
   [
    "civil",
    "Lei nº 1.060/1950"
   ],
   [
    "civil",
    "Lei nº 6.515/1977"
   ],
   [
    "civil",
    "Lei nº 9.278/1996"
   ],
   [
    "civil",
    "Lei nº 5.478/1968"
   ],
   [
    "civil",
    "Lei nº 11.804/2008"
   ],
   [
    "civil",
    "Lei nº 8.560/1992"
   ],
   [
    "civil",
    "Decreto nº 57.663/1966"
   ],
   [
    "civil",
    "Lei nº 9.492/1997"
   ],
   [
    "civil",
    "Lei nº 11.076/2004"
   ],
   [
    "civil",
    "Lei nº 10.406/2002"
   ],
   [
    "civil",
    "Decreto-Lei nº 4.657/1942"
   ],
   [
    "processual_civil",
    "Lei nº 13.105/2015"
   ],
   [
    "processual_civil",
    "Lei nº 12.016/2009"
   ],
   [
    "processual_civil",
    "Lei nº 4.717/1965"
   ],
   [
    "processual_civil",
    "Lei nº 7.347/1985"
   ],
   [
    "processual_civil",
    "Lei nº 9.507/1997"
   ],
   [
    "processual_civil",
    "Lei nº 9.099/1995"
   ],
   [
    "processual_civil",
    "Lei nº 10.259/2001"
   ],
   [
    "processual_civil",
    "Lei nº 12.153/2009"
   ],
   [
    "processual_civil",
    "Lei nº 11.419/2006"
   ],
   [
    "processual_civil",
    "Lei nº 8.437/1992"
   ],
   [
    "processual_civil",
    "Lei nº 9.494/1997"
   ],
   [
    "processual_civil",
    "Lei nº 11.417/2006"
   ],
   [
    "processual_civil",
    "Lei nº 13.140/2015"
   ],
   [
    "processual_civil",
    "Lei nº 9.307/1996"
   ],
   [
    "processual_civil",
    "Lei nº 13.129/2015"
   ],
   [
    "consumidor",
    "Lei nº 8.078/1990"
   ],
   [
    "consumidor",
    "Lei nº 14.538/2023"
   ],
   [
    "consumidor",
    "Decreto nº 7.962/2013"
   ],
   [
    "consumidor",
    "Lei nº 12.414/2011"
   ],
   [
    "consumidor",
    "Decreto nº 9.936/2019"
   ],
   [
    "consumidor",
    "Lei nº 9.656/1998"
   ],
   [
    "crianca",
    "Lei nº 8.069/1990"
   ],
   [
    "crianca",
    "Lei nº 12.594/2012"
   ],
   [
    "crianca",
    "Lei nº 10.216/2001"
   ],
   [
    "crianca",
    "Lei nº 13.431/2017"
   ],
   [
    "crianca",
    "Decreto nº 9.603/2018"
   ],
   [
    "crianca",
    "Lei nº 14.344/2022"
   ],
   [
    "crianca",
    "Lei nº 13.257/2016"
   ],
   [
    "penal",
    "Lei nº 11.340/2006"
   ],
   [
    "penal",
    "Lei nº 8.429/1992"
   ],
   [
    "penal",
    "Lei nº 11.343/2006"
   ],
   [
    "penal",
    "Lei nº 9.263/1996"
   ],
   [
    "penal",
    "Lei nº 10.826/2003"
   ],
   [
    "penal",
    "Lei nº 8.072/1990"
   ],
   [
    "penal",
    "Lei nº 9.455/1997"
   ],
   [
    "penal",
    "Lei nº 9.029/1995"
   ],
   [
    "penal",
    "Lei nº 7.716/1989"
   ],
   [
    "penal",
    "Lei nº 9.459/1997"
   ],
   [
    "penal",
    "Lei nº 9.503/1997"
   ],
   [
    "penal",
    "Lei nº 9.605/1998"
   ],
   [
    "penal",
    "Lei nº 9.434/1997"
   ],
   [
    "penal",
    "Lei nº 6.001/1973"
   ],
   [
    "penal",
    "Lei nº 8.137/1990"
   ],
   [
    "penal",
    "Lei nº 8.176/1991"
   ],
   [
    "penal",
    "Lei nº 9.613/1998"
   ],
   [
    "penal",
    "Lei nº 12.850/2013"
   ],
   [
    "penal",
    "Decreto-Lei nº 201/1967"
   ],
   [
    "penal",
    "Lei nº 14.597/2023"
   ],
   [
    "penal",
    "Lei nº 13.869/2019"
   ],
   [
    "penal",
    "Decreto-Lei nº 3.688/1941"
   ],
   [
    "penal",
    "Lei nº 13.964/2019"
   ],
   [
    "penal",
    "Lei nº 7.210/1984"
   ],
   [
    "penal",
    "Decreto-Lei nº 2.848/1940"
   ],
   [
    "processual_penal",
    "Lei nº 11.340/2006"
   ],
   [
    "processual_penal",
    "Lei nº 13.105/2015"
   ],
   [
    "processual_penal",
    "Lei nº 9.099/1995"
   ],
   [
    "processual_penal",
    "Lei nº 13.431/2017"
   ],
   [
    "processual_penal",
    "Lei nº 11.343/2006"
   ],
   [
    "processual_penal",
    "Lei nº 4.737/1965"
   ],
   [
    "processual_penal",
    "Lei nº 9.296/1996"
   ],
   [
    "processual_penal",
    "Lei nº 12.850/2013"
   ],
   [
    "processual_penal",
    "Decreto-Lei nº 201/1967"
   ],
   [
    "processual_penal",
    "Lei nº 11.101/2005"
   ],
   [
    "processual_penal",
    "Lei nº 7.210/1984"
   ],
   [
    "processual_penal",
    "Lei nº 9.807/1999"
   ],
   [
    "processual_penal",
    "Lei nº 7.960/1989"
   ],
   [
    "processual_penal",
    "Decreto-Lei nº 3.240/1941"
   ],
   [
    "processual_penal",
    "Decreto-Lei nº 3.689/1941"
   ],
   [
    "constitucional",
    "CF/1988"
   ],
   [
    "eleitoral",
    "Lei nº 4.737/1965"
   ],
   [
    "eleitoral",
    "Lei Complementar nº 64/1990"
   ],
   [
    "eleitoral",
    "Lei nº 9.096/1995"
   ],
   [
    "eleitoral",
    "Lei nº 9.504/1997"
   ],
   [
    "eleitoral",
    "Lei Complementar nº 86/1996"
   ],
   [
    "empresarial",
    "Lei nº 9.609/1998"
   ],
   [
    "empresarial",
    "Lei nº 11.101/2005"
   ],
   [
    "empresarial",
    "Lei nº 9.279/1996"
   ],
   [
    "empresarial",
    "Lei Complementar nº 123/2006"
   ],
   [
    "empresarial",
    "Lei nº 6.404/1976"
   ],
   [
    "tributario",
    "Lei nº 6.830/1980"
   ],
   [
    "tributario",
    "Lei Complementar nº 101/2000"
   ],
   [
    "tributario",
    "Lei nº 5.172/1966"
   ],
   [
    "ambiental",
    "Lei nº 11.105/2005"
   ],
   [
    "ambiental",
    "Lei nº 11.107/2005"
   ],
   [
    "ambiental",
    "Lei nº 9.433/1997"
   ],
   [
    "ambiental",
    "Lei nº 9.795/1999"
   ],
   [
    "ambiental",
    "Lei nº 9.966/2000"
   ],
   [
    "ambiental",
    "Lei nº 9.985/2000"
   ],
   [
    "ambiental",
    "Lei nº 11.284/2006"
   ],
   [
    "ambiental",
    "Lei nº 11.428/2006"
   ],
   [
    "ambiental",
    "Lei nº 12.187/2009"
   ],
   [
    "ambiental",
    "Lei nº 12.305/2010"
   ],
   [
    "ambiental",
    "Lei Complementar nº 140/2011"
   ],
   [
    "ambiental",
    "Lei nº 12.651/2012"
   ],
   [
    "ambiental",
    "Lei nº 13.123/2015"
   ],
   [
    "ambiental",
    "Lei nº 14.119/2021"
   ],
   [
    "ambiental",
    "Lei nº 10.257/2001"
   ],
   [
    "ambiental",
    "Lei nº 11.445/2007"
   ],
   [
    "administrativo",
    "Decreto-Lei nº 4.597/1942"
   ],
   [
    "administrativo",
    "Decreto-Lei nº 3.365/1941"
   ],
   [
    "administrativo",
    "Lei nº 8.429/1992"
   ],
   [
    "administrativo",
    "Lei nº 14.133/2021"
   ],
   [
    "administrativo",
    "Lei nº 4.320/1964"
   ],
   [
    "administrativo",
    "Lei nº 13.303/2016"
   ],
   [
    "administrativo",
    "Lei Complementar nº 35/1979"
   ],
   [
    "administrativo",
    "Lei Complementar nº 101/2000"
   ],
   [
    "administrativo",
    "Lei nº 12.527/2011"
   ],
   [
    "administrativo",
    "Lei nº 12.846/2013"
   ],
   [
    "administrativo",
    "Lei nº 8.987/1995"
   ],
   [
    "administrativo",
    "Lei nº 11.079/2004"
   ],
   [
    "previdenciario",
    "Lei nº 8.742/1993"
   ],
   [
    "humanos",
    "Lei nº 7.716/1989"
   ],
   [
    "humanos",
    "Decreto nº 6.949/2009"
   ]
  ],
  "extras": [
   "Lei nº 14.249/2010",
   "Lei nº 6.123/1968",
   "Lei nº 11.781/2000",
   "Lei nº 17.116/2020",
   "Lei Complementar nº 100/2007",
   "Lei Complementar nº 28/2000",
   "Resolução CNJ nº 452/2022",
   "Resolução CNJ nº 295/2019",
   "Resolução CNJ nº 165/2012",
   "Resolução nº 170/2014",
   "Resolução CNJ nº 213/2015",
   "Resolução CNJ nº 427/2021",
   "Resolução CNJ nº 484/2022"
  ],
  "tipo": "edital"
 },
 {
  "id": "dpu-2017",
  "sigla": "DPU",
  "cargo": "Defensor Público Federal de 2ª Categoria",
  "orgao": "Defensoria Pública da União",
  "titulo": "Concurso para Defensor Público Federal",
  "edital": "Edital nº 1 (12/06/2017)",
  "grupos": [
   {
    "nome": "Disciplinas",
    "disciplinas": [
     "Direito Civil",
     "Direito Empresarial",
     "Direito do Consumidor",
     "Direito Ambiental",
     "Direito Processual Civil",
     "Direito Tributário",
     "Direito Penal e Criminologia",
     "Direito Processual Penal",
     "Direito Penal Militar",
     "Direito Processual Penal Militar",
     "Princípios Institucionais da Defensoria Pública",
     "Direito Constitucional",
     "Direito Internacional",
     "Direitos Humanos",
     "Filosofia do Direito",
     "Noções de Sociologia Jurídica",
     "Direito Eleitoral",
     "Direito Administrativo",
     "Direito do Trabalho",
     "Direito Processual do Trabalho",
     "Direito Previdenciário e da Assistência Social"
    ]
   }
  ],
  "leis": [
   [
    "civil",
    "Lei nº 1.060/1950"
   ],
   [
    "civil",
    "Decreto-Lei nº 4.657/1942"
   ],
   [
    "civil",
    "Lei nº 10.741/2003"
   ],
   [
    "civil",
    "Lei nº 9.278/1996"
   ],
   [
    "civil",
    "Lei nº 10.406/2002"
   ],
   [
    "processual_civil",
    "Lei nº 13.105/2015"
   ],
   [
    "processual_civil",
    "Lei nº 12.016/2009"
   ],
   [
    "processual_civil",
    "Lei nº 4.717/1965"
   ],
   [
    "processual_civil",
    "Lei nº 7.347/1985"
   ],
   [
    "processual_civil",
    "Lei nº 9.507/1997"
   ],
   [
    "processual_civil",
    "Lei nº 13.140/2015"
   ],
   [
    "processual_civil",
    "Lei nº 9.099/1995"
   ],
   [
    "consumidor",
    "Lei nº 8.078/1990"
   ],
   [
    "crianca",
    "Lei nº 8.069/1990"
   ],
   [
    "penal",
    "Lei nº 9.605/1998"
   ],
   [
    "penal",
    "Lei nº 8.429/1992"
   ],
   [
    "penal",
    "Lei nº 8.072/1990"
   ],
   [
    "penal",
    "Lei nº 12.850/2013"
   ],
   [
    "penal",
    "Lei nº 9.613/1998"
   ],
   [
    "penal",
    "Lei nº 9.455/1997"
   ],
   [
    "penal",
    "Lei nº 13.869/2019"
   ],
   [
    "penal",
    "Decreto-Lei nº 2.848/1940"
   ],
   [
    "processual_penal",
    "Lei nº 13.105/2015"
   ],
   [
    "processual_penal",
    "Lei nº 8.457/1992"
   ],
   [
    "processual_penal",
    "Lei nº 11.101/2005"
   ],
   [
    "processual_penal",
    "Lei nº 9.099/1995"
   ],
   [
    "processual_penal",
    "Lei nº 12.850/2013"
   ],
   [
    "processual_penal",
    "Lei nº 9.296/1996"
   ],
   [
    "processual_penal",
    "Decreto-Lei nº 3.689/1941"
   ],
   [
    "constitucional",
    "CF/1988"
   ],
   [
    "eleitoral",
    "Lei Complementar nº 64/1990"
   ],
   [
    "eleitoral",
    "Lei nº 4.737/1965"
   ],
   [
    "eleitoral",
    "Lei nº 9.504/1997"
   ],
   [
    "empresarial",
    "Lei nº 11.101/2005"
   ],
   [
    "tributario",
    "Lei nº 5.172/1966"
   ],
   [
    "ambiental",
    "Lei nº 6.938/1981"
   ],
   [
    "ambiental",
    "Decreto nº 99.274/1990"
   ],
   [
    "ambiental",
    "Lei nº 9.433/1997"
   ],
   [
    "ambiental",
    "Lei nº 12.651/2012"
   ],
   [
    "ambiental",
    "Lei nº 11.284/2006"
   ],
   [
    "ambiental",
    "Lei nº 9.985/2000"
   ],
   [
    "ambiental",
    "Lei nº 10.257/2001"
   ],
   [
    "ambiental",
    "Lei nº 13.089/2015"
   ],
   [
    "ambiental",
    "Decreto nº 6.514/2008"
   ],
   [
    "ambiental",
    "Lei nº 11.445/2007"
   ],
   [
    "administrativo",
    "Lei Complementar nº 80/1994"
   ],
   [
    "administrativo",
    "Lei nº 8.429/1992"
   ],
   [
    "administrativo",
    "Decreto-Lei nº 3.365/1941"
   ],
   [
    "previdenciario",
    "Lei nº 8.213/1991"
   ],
   [
    "previdenciario",
    "Lei nº 8.212/1991"
   ],
   [
    "humanos",
    "Lei nº 9.474/1997"
   ],
   [
    "humanos",
    "Lei nº 12.288/2010"
   ],
   [
    "humanos",
    "Decreto nº 6.949/2009"
   ],
   [
    "humanos",
    "Decreto nº 592/1992"
   ],
   [
    "trabalhista",
    "Decreto-Lei nº 5.452/1943"
   ]
  ],
  "extras": [],
  "tipo": "edital"
 },
 {
  "id": "pf-delegado-2025",
  "sigla": "PF",
  "cargo": "Delegado de Polícia Federal",
  "orgao": "Polícia Federal",
  "titulo": "Concurso Policial — Delegado de Polícia Federal",
  "edital": "Edital nº 1 – PF Policial (20/05/2025)",
  "grupos": [
   {
    "nome": "Conhecimentos específicos — Delegado",
    "disciplinas": [
     "Direito Administrativo",
     "Direito Constitucional",
     "Direitos Humanos",
     "Direito Civil",
     "Direito Processual Civil",
     "Direito Empresarial",
     "Direito Internacional Público e Cooperação Internacional",
     "Direito Penal",
     "Direito Processual Penal",
     "Direito Previdenciário",
     "Direito Financeiro e Tributário",
     "Direito Ambiental"
    ]
   }
  ],
  "leis": [
   [
    "civil",
    "Lei nº 13.146/2015"
   ],
   [
    "civil",
    "Lei nº 10.741/2003"
   ],
   [
    "civil",
    "Decreto-Lei nº 4.657/1942"
   ],
   [
    "civil",
    "Lei nº 10.406/2002"
   ],
   [
    "processual_civil",
    "Lei nº 9.099/1995"
   ],
   [
    "processual_civil",
    "Lei nº 13.105/2015"
   ],
   [
    "processual_civil",
    "Lei nº 12.016/2009"
   ],
   [
    "processual_civil",
    "Lei nº 4.717/1965"
   ],
   [
    "processual_civil",
    "Lei nº 7.347/1985"
   ],
   [
    "processual_civil",
    "Lei nº 9.507/1997"
   ],
   [
    "processual_civil",
    "Lei nº 9.307/1996"
   ],
   [
    "processual_civil",
    "Lei nº 13.140/2015"
   ],
   [
    "consumidor",
    "Lei nº 8.078/1990"
   ],
   [
    "crianca",
    "Lei nº 8.069/1990"
   ],
   [
    "crianca",
    "Lei nº 13.257/2016"
   ],
   [
    "penal",
    "Lei nº 8.429/1992"
   ],
   [
    "penal",
    "Decreto nº 5.015/2004"
   ],
   [
    "penal",
    "Decreto nº 5.017/2004"
   ],
   [
    "penal",
    "Decreto nº 154/1991"
   ],
   [
    "penal",
    "Decreto nº 5.016/2004"
   ],
   [
    "penal",
    "Decreto nº 5.687/2006"
   ],
   [
    "penal",
    "Lei nº 11.343/2006"
   ],
   [
    "penal",
    "Lei nº 12.850/2013"
   ],
   [
    "penal",
    "Lei nº 7.492/1986"
   ],
   [
    "penal",
    "Lei nº 8.137/1990"
   ],
   [
    "penal",
    "Lei nº 9.613/1998"
   ],
   [
    "penal",
    "Lei nº 8.176/1991"
   ],
   [
    "penal",
    "Lei nº 8.072/1990"
   ],
   [
    "penal",
    "Lei nº 7.716/1989"
   ],
   [
    "penal",
    "Lei nº 9.455/1997"
   ],
   [
    "penal",
    "Lei nº 9.605/1998"
   ],
   [
    "penal",
    "Decreto-Lei nº 201/1967"
   ],
   [
    "penal",
    "Lei nº 13.869/2019"
   ],
   [
    "penal",
    "Lei nº 10.826/2003"
   ],
   [
    "penal",
    "Lei nº 6.001/1973"
   ],
   [
    "penal",
    "Decreto nº 11.491/2023"
   ],
   [
    "penal",
    "Lei nº 7.210/1984"
   ],
   [
    "penal",
    "Lei nº 12.737/2012"
   ],
   [
    "penal",
    "Decreto-Lei nº 2.848/1940"
   ],
   [
    "processual_penal",
    "Lei nº 11.343/2006"
   ],
   [
    "processual_penal",
    "Lei nº 12.850/2013"
   ],
   [
    "processual_penal",
    "Decreto-Lei nº 201/1967"
   ],
   [
    "processual_penal",
    "Lei nº 11.101/2005"
   ],
   [
    "processual_penal",
    "Lei nº 9.296/1996"
   ],
   [
    "processual_penal",
    "Lei nº 12.037/2009"
   ],
   [
    "processual_penal",
    "Lei nº 4.737/1965"
   ],
   [
    "processual_penal",
    "Lei nº 7.210/1984"
   ],
   [
    "processual_penal",
    "Lei nº 9.099/1995"
   ],
   [
    "processual_penal",
    "Lei nº 10.446/2002"
   ],
   [
    "processual_penal",
    "Lei nº 12.830/2013"
   ],
   [
    "processual_penal",
    "Lei nº 13.105/2015"
   ],
   [
    "processual_penal",
    "Decreto-Lei nº 3.689/1941"
   ],
   [
    "constitucional",
    "Lei nº 1.079/1950"
   ],
   [
    "constitucional",
    "CF/1988"
   ],
   [
    "empresarial",
    "Lei nº 11.101/2005"
   ],
   [
    "empresarial",
    "Lei nº 6.404/1976"
   ],
   [
    "empresarial",
    "Lei nº 9.279/1996"
   ],
   [
    "tributario",
    "Lei Complementar nº 101/2000"
   ],
   [
    "tributario",
    "Lei nº 5.172/1966"
   ],
   [
    "ambiental",
    "Lei nº 9.985/2000"
   ],
   [
    "ambiental",
    "Lei nº 11.445/2007"
   ],
   [
    "administrativo",
    "Lei nº 9.784/1999"
   ],
   [
    "administrativo",
    "Lei nº 14.133/2021"
   ],
   [
    "administrativo",
    "Lei nº 8.429/1992"
   ],
   [
    "administrativo",
    "Lei nº 8.112/1990"
   ],
   [
    "administrativo",
    "Lei nº 4.878/1965"
   ],
   [
    "administrativo",
    "Lei Complementar nº 101/2000"
   ],
   [
    "administrativo",
    "Lei nº 9.266/1996"
   ],
   [
    "administrativo",
    "Lei nº 14.967/2024"
   ],
   [
    "administrativo",
    "Decreto-Lei nº 3.365/1941"
   ],
   [
    "administrativo",
    "Lei nº 8.987/1995"
   ],
   [
    "previdenciario",
    "Lei nº 8.212/1991"
   ],
   [
    "previdenciario",
    "Lei nº 8.213/1991"
   ],
   [
    "previdenciario",
    "Decreto nº 3.048/1999"
   ],
   [
    "humanos",
    "Decreto nº 7.037/2009"
   ],
   [
    "humanos",
    "Lei nº 13.060/2014"
   ],
   [
    "humanos",
    "Decreto nº 12.341/2024"
   ],
   [
    "humanos",
    "Lei nº 13.445/2017"
   ],
   [
    "humanos",
    "Lei nº 7.716/1989"
   ],
   [
    "humanos",
    "Lei nº 9.474/1997"
   ]
  ],
  "extras": [
   "Decreto nº 5.480/2005",
   "Decreto nº 11.102/2022",
   "Lei nº 15.047/2024",
   "Decreto nº 59.310/1966",
   "Lei nº 11.358/2006",
   "Decreto nº 3.468/2000",
   "Decreto nº 5.941/2006",
   "Decreto nº 6.340/2008",
   "Decreto nº 8.833/2016",
   "Decreto nº 12.337/2024",
   "Lei nº 5.553/1968",
   "Lei nº 5.250/1967"
  ],
  "tipo": "edital"
 },
 {
  "id": "dpeba-2026",
  "sigla": "DPE-BA",
  "cargo": "Defensor(a) Público(a) — classe inicial",
  "orgao": "Defensoria Pública do Estado da Bahia",
  "titulo": "IX Concurso para Defensor Público",
  "edital": "Edital nº 01/2026 (23/02/2026)",
  "grupos": [
   {
    "nome": "Conteúdo programático",
    "disciplinas": [
     "Direitos Humanos",
     "Direito Constitucional",
     "Direito Administrativo",
     "Direito Penal",
     "Direito Processual Penal e Execução Penal",
     "Direito Civil",
     "Direito do Consumidor",
     "Direito Processual Civil",
     "Direito da Seguridade Social",
     "Direito da Criança e do Adolescente",
     "Direito Ambiental e Urbanístico",
     "Direito Antidiscriminatório (ênfase na população negra e povos tradicionais)",
     "Direitos Humanos (ênfase em pessoas em situação de vulnerabilidade)"
    ]
   }
  ],
  "leis": [
   [
    "civil",
    "Lei nº 13.709/2018"
   ],
   [
    "civil",
    "Lei nº 13.146/2015"
   ],
   [
    "civil",
    "Lei nº 10.741/2003"
   ],
   [
    "civil",
    "Lei nº 6.766/1979"
   ],
   [
    "civil",
    "Lei nº 601/1850"
   ],
   [
    "civil",
    "Lei nº 6.015/1973"
   ],
   [
    "civil",
    "Lei nº 8.245/1991"
   ],
   [
    "civil",
    "Lei nº 8.009/1990"
   ],
   [
    "civil",
    "Lei nº 5.478/1968"
   ],
   [
    "civil",
    "Lei nº 11.804/2008"
   ],
   [
    "civil",
    "Lei nº 13.874/2019"
   ],
   [
    "civil",
    "Lei nº 14.010/2020"
   ],
   [
    "civil",
    "Lei nº 10.406/2002"
   ],
   [
    "civil",
    "Decreto-Lei nº 4.657/1942"
   ],
   [
    "civil",
    "Lei nº 12.965/2014"
   ],
   [
    "civil",
    "Lei nº 1.060/1950"
   ],
   [
    "civil",
    "Lei nº 9.278/1996"
   ],
   [
    "processual_civil",
    "Lei nº 13.140/2015"
   ],
   [
    "processual_civil",
    "Lei nº 11.417/2006"
   ],
   [
    "processual_civil",
    "Lei nº 9.008/1995"
   ],
   [
    "processual_civil",
    "Lei nº 13.105/2015"
   ],
   [
    "processual_civil",
    "Lei nº 9.507/1997"
   ],
   [
    "processual_civil",
    "Lei nº 12.016/2009"
   ],
   [
    "processual_civil",
    "Lei nº 4.717/1965"
   ],
   [
    "processual_civil",
    "Lei nº 7.347/1985"
   ],
   [
    "processual_civil",
    "Lei nº 9.307/1996"
   ],
   [
    "processual_civil",
    "Lei nº 9.099/1995"
   ],
   [
    "processual_civil",
    "Lei nº 12.153/2009"
   ],
   [
    "consumidor",
    "Lei nº 8.078/1990"
   ],
   [
    "consumidor",
    "Decreto nº 2.181/1997"
   ],
   [
    "consumidor",
    "Lei nº 9.656/1998"
   ],
   [
    "consumidor",
    "Lei nº 10.820/2003"
   ],
   [
    "consumidor",
    "Decreto nº 5.903/2006"
   ],
   [
    "consumidor",
    "Lei nº 12.414/2011"
   ],
   [
    "consumidor",
    "Lei Complementar nº 166/2019"
   ],
   [
    "consumidor",
    "Decreto nº 9.936/2019"
   ],
   [
    "consumidor",
    "Decreto nº 11.150/2022"
   ],
   [
    "consumidor",
    "Lei nº 14.790/2023"
   ],
   [
    "crianca",
    "Lei nº 10.216/2001"
   ],
   [
    "crianca",
    "Lei nº 8.069/1990"
   ],
   [
    "crianca",
    "Lei nº 15.211/2025"
   ],
   [
    "crianca",
    "Lei nº 13.257/2016"
   ],
   [
    "crianca",
    "Lei nº 13.185/2015"
   ],
   [
    "crianca",
    "Lei nº 12.594/2012"
   ],
   [
    "crianca",
    "Lei nº 13.431/2017"
   ],
   [
    "crianca",
    "Lei nº 14.344/2022"
   ],
   [
    "crianca",
    "Decreto nº 99.710/1990"
   ],
   [
    "penal",
    "Lei nº 8.429/1992"
   ],
   [
    "penal",
    "Lei nº 12.850/2013"
   ],
   [
    "penal",
    "Lei nº 9.503/1997"
   ],
   [
    "penal",
    "Lei nº 9.605/1998"
   ],
   [
    "penal",
    "Lei nº 10.826/2003"
   ],
   [
    "penal",
    "Decreto nº 9.847/2019"
   ],
   [
    "penal",
    "Lei nº 8.072/1990"
   ],
   [
    "penal",
    "Lei nº 9.455/1997"
   ],
   [
    "penal",
    "Lei nº 11.343/2006"
   ],
   [
    "penal",
    "Lei nº 1.521/1951"
   ],
   [
    "penal",
    "Lei nº 9.613/1998"
   ],
   [
    "penal",
    "Lei nº 7.716/1989"
   ],
   [
    "penal",
    "Lei nº 4.898/1965"
   ],
   [
    "penal",
    "Lei nº 11.340/2006"
   ],
   [
    "penal",
    "Decreto-Lei nº 3.688/1941"
   ],
   [
    "penal",
    "Lei nº 7.210/1984"
   ],
   [
    "penal",
    "Lei nº 14.532/2023"
   ],
   [
    "penal",
    "Decreto-Lei nº 2.848/1940"
   ],
   [
    "penal",
    "Lei nº 13.869/2019"
   ],
   [
    "penal",
    "Lei nº 13.260/2016"
   ],
   [
    "processual_penal",
    "Lei nº 12.850/2013"
   ],
   [
    "processual_penal",
    "Lei nº 11.343/2006"
   ],
   [
    "processual_penal",
    "Lei nº 11.340/2006"
   ],
   [
    "processual_penal",
    "Lei nº 7.210/1984"
   ],
   [
    "processual_penal",
    "Lei nº 12.313/2010"
   ],
   [
    "processual_penal",
    "Lei nº 11.101/2005"
   ],
   [
    "processual_penal",
    "Lei nº 13.105/2015"
   ],
   [
    "processual_penal",
    "Lei nº 13.431/2017"
   ],
   [
    "processual_penal",
    "Lei nº 9.099/1995"
   ],
   [
    "processual_penal",
    "Lei nº 9.296/1996"
   ],
   [
    "processual_penal",
    "Decreto-Lei nº 3.689/1941"
   ],
   [
    "constitucional",
    "Emenda Constitucional nº 80/2014"
   ],
   [
    "constitucional",
    "CF/1988"
   ],
   [
    "empresarial",
    "Lei nº 6.404/1976"
   ],
   [
    "ambiental",
    "Lei nº 10.257/2001"
   ],
   [
    "ambiental",
    "Lei nº 6.938/1981"
   ],
   [
    "ambiental",
    "Decreto nº 99.274/1990"
   ],
   [
    "ambiental",
    "Lei nº 9.433/1997"
   ],
   [
    "ambiental",
    "Lei nº 12.651/2012"
   ],
   [
    "ambiental",
    "Lei nº 11.284/2006"
   ],
   [
    "ambiental",
    "Lei nº 9.985/2000"
   ],
   [
    "ambiental",
    "Decreto nº 6.514/2008"
   ],
   [
    "ambiental",
    "Lei nº 9.795/1999"
   ],
   [
    "ambiental",
    "Lei nº 12.187/2009"
   ],
   [
    "ambiental",
    "Lei nº 12.305/2010"
   ],
   [
    "ambiental",
    "Lei nº 13.465/2017"
   ],
   [
    "ambiental",
    "Lei nº 12.587/2012"
   ],
   [
    "ambiental",
    "Lei nº 11.445/2007"
   ],
   [
    "ambiental",
    "Decreto nº 7.217/2010"
   ],
   [
    "ambiental",
    "Lei nº 11.107/2005"
   ],
   [
    "administrativo",
    "Lei nº 9.784/1999"
   ],
   [
    "administrativo",
    "Lei nº 12.462/2011"
   ],
   [
    "administrativo",
    "Lei nº 8.429/1992"
   ],
   [
    "administrativo",
    "Lei nº 12.846/2013"
   ],
   [
    "administrativo",
    "Lei nº 8.666/1993"
   ],
   [
    "administrativo",
    "Lei nº 8.080/1990"
   ],
   [
    "administrativo",
    "Lei nº 8.142/1990"
   ],
   [
    "administrativo",
    "Lei nº 9.394/1996"
   ],
   [
    "administrativo",
    "Lei nº 13.005/2014"
   ],
   [
    "administrativo",
    "Lei Complementar nº 80/1994"
   ],
   [
    "administrativo",
    "Lei nº 14.133/2021"
   ],
   [
    "administrativo",
    "Lei nº 12.527/2011"
   ],
   [
    "administrativo",
    "Decreto-Lei nº 3.365/1941"
   ],
   [
    "administrativo",
    "Lei nº 8.987/1995"
   ],
   [
    "administrativo",
    "Lei nº 11.079/2004"
   ],
   [
    "previdenciario",
    "Lei nº 8.742/1993"
   ],
   [
    "previdenciario",
    "Lei nº 12.435/2011"
   ],
   [
    "previdenciario",
    "Lei nº 8.213/1991"
   ],
   [
    "previdenciario",
    "Lei nº 8.212/1991"
   ],
   [
    "humanos",
    "Lei nº 7.716/1989"
   ],
   [
    "humanos",
    "Lei nº 12.852/2013"
   ],
   [
    "humanos",
    "Lei nº 12.288/2010"
   ],
   [
    "humanos",
    "Lei nº 12.711/2012"
   ],
   [
    "humanos",
    "Lei nº 12.990/2014"
   ],
   [
    "humanos",
    "Decreto nº 10.932/2022"
   ],
   [
    "humanos",
    "Decreto nº 7.053/2009"
   ],
   [
    "humanos",
    "Lei nº 9.474/1997"
   ],
   [
    "humanos",
    "Lei nº 13.445/2017"
   ],
   [
    "humanos",
    "Lei nº 11.645/2008"
   ],
   [
    "humanos",
    "Decreto nº 6.040/2007"
   ],
   [
    "humanos",
    "Decreto nº 4.887/2003"
   ],
   [
    "humanos",
    "Decreto nº 678/1992"
   ],
   [
    "humanos",
    "Decreto nº 6.949/2009"
   ],
   [
    "humanos",
    "Decreto nº 592/1992"
   ]
  ],
  "extras": [
   "Lei nº 13.172/2015",
   "Lei nº 14.046/2020",
   "Lei nº 14.431/2022",
   "Lei nº 14.690/2023",
   "Lei Complementar nº 19/1994",
   "Lei Complementar nº 26/2006",
   "Lei nº 11.372/2009",
   "Lei nº 14.519/2023",
   "Resolução nº 4/2011",
   "Resolução nº 113/2010",
   "Resolução nº 14/1994",
   "Resolução CNJ nº 348/2020",
   "Resolução CNJ nº 125/2010",
   "Resolução CNJ nº 345/2020",
   "Resolução nº 01/2014",
   "Resolução nº 348/2020"
  ],
  "tipo": "edital"
 },
 {
  "id": "dpesp-ix",
  "sigla": "DPE-SP",
  "cargo": "Defensor(a) Público(a) do Estado de São Paulo",
  "orgao": "Defensoria Pública do Estado de São Paulo",
  "titulo": "IX Concurso para Defensor Público",
  "edital": "Edital de Abertura (13/12/2022) + retificação de 14/12/2022",
  "grupos": [
   {
    "nome": "Anexo II",
    "disciplinas": [
     "Direito Constitucional",
     "Direito Administrativo",
     "Direito Tributário",
     "Direito Penal",
     "Direito Processual Penal",
     "Direito Civil",
     "Direito Empresarial",
     "Direito Processual Civil",
     "Direitos Difusos e Coletivos",
     "Direito da Criança e do Adolescente",
     "Direitos Humanos",
     "Princípios e Atribuições Institucionais da Defensoria Pública do Estado",
     "Filosofia do Direito e Sociologia Jurídica"
    ]
   }
  ],
  "leis": [
   [
    "civil",
    "Lei nº 13.709/2018"
   ],
   [
    "civil",
    "Lei nº 13.146/2015"
   ],
   [
    "civil",
    "Lei nº 10.741/2003"
   ],
   [
    "civil",
    "Lei nº 601/1850"
   ],
   [
    "civil",
    "Lei nº 6.015/1973"
   ],
   [
    "civil",
    "Lei nº 8.245/1991"
   ],
   [
    "civil",
    "Lei nº 8.009/1990"
   ],
   [
    "civil",
    "Lei nº 5.478/1968"
   ],
   [
    "civil",
    "Lei nº 11.804/2008"
   ],
   [
    "civil",
    "Lei nº 6.766/1979"
   ],
   [
    "civil",
    "Lei nº 13.874/2019"
   ],
   [
    "civil",
    "Lei nº 10.406/2002"
   ],
   [
    "civil",
    "Decreto-Lei nº 4.657/1942"
   ],
   [
    "civil",
    "Lei nº 1.060/1950"
   ],
   [
    "civil",
    "Lei nº 9.278/1996"
   ],
   [
    "processual_civil",
    "Lei nº 13.105/2015"
   ],
   [
    "processual_civil",
    "Lei nº 13.140/2015"
   ],
   [
    "processual_civil",
    "Lei nº 12.016/2009"
   ],
   [
    "processual_civil",
    "Lei nº 4.717/1965"
   ],
   [
    "processual_civil",
    "Lei nº 7.347/1985"
   ],
   [
    "processual_civil",
    "Lei nº 9.507/1997"
   ],
   [
    "processual_civil",
    "Lei nº 9.307/1996"
   ],
   [
    "processual_civil",
    "Lei nº 9.099/1995"
   ],
   [
    "processual_civil",
    "Lei nº 12.153/2009"
   ],
   [
    "consumidor",
    "Lei nº 8.078/1990"
   ],
   [
    "crianca",
    "Lei nº 10.216/2001"
   ],
   [
    "crianca",
    "Lei nº 8.069/1990"
   ],
   [
    "crianca",
    "Lei nº 13.257/2016"
   ],
   [
    "crianca",
    "Lei nº 12.594/2012"
   ],
   [
    "crianca",
    "Lei nº 13.431/2017"
   ],
   [
    "crianca",
    "Lei nº 14.344/2022"
   ],
   [
    "crianca",
    "Lei nº 13.185/2015"
   ],
   [
    "crianca",
    "Decreto nº 99.710/1990"
   ],
   [
    "penal",
    "Lei nº 12.850/2013"
   ],
   [
    "penal",
    "Lei nº 9.503/1997"
   ],
   [
    "penal",
    "Lei nº 9.605/1998"
   ],
   [
    "penal",
    "Lei nº 10.826/2003"
   ],
   [
    "penal",
    "Decreto nº 9.847/2019"
   ],
   [
    "penal",
    "Lei nº 8.072/1990"
   ],
   [
    "penal",
    "Lei nº 11.343/2006"
   ],
   [
    "penal",
    "Lei nº 1.521/1951"
   ],
   [
    "penal",
    "Lei nº 9.613/1998"
   ],
   [
    "penal",
    "Lei nº 7.716/1989"
   ],
   [
    "penal",
    "Lei nº 6.001/1973"
   ],
   [
    "penal",
    "Lei nº 13.869/2019"
   ],
   [
    "penal",
    "Lei nº 11.340/2006"
   ],
   [
    "penal",
    "Decreto-Lei nº 3.688/1941"
   ],
   [
    "penal",
    "Lei nº 9.455/1997"
   ],
   [
    "penal",
    "Lei nº 7.210/1984"
   ],
   [
    "penal",
    "Lei nº 13.964/2019"
   ],
   [
    "penal",
    "Lei nº 8.429/1992"
   ],
   [
    "penal",
    "Decreto-Lei nº 2.848/1940"
   ],
   [
    "processual_penal",
    "Lei nº 12.850/2013"
   ],
   [
    "processual_penal",
    "Lei nº 11.101/2005"
   ],
   [
    "processual_penal",
    "Lei nº 11.343/2006"
   ],
   [
    "processual_penal",
    "Lei nº 11.340/2006"
   ],
   [
    "processual_penal",
    "Lei nº 7.210/1984"
   ],
   [
    "processual_penal",
    "Lei nº 13.105/2015"
   ],
   [
    "processual_penal",
    "Lei nº 13.431/2017"
   ],
   [
    "processual_penal",
    "Decreto-Lei nº 3.689/1941"
   ],
   [
    "processual_penal",
    "Lei nº 9.099/1995"
   ],
   [
    "processual_penal",
    "Lei nº 9.296/1996"
   ],
   [
    "constitucional",
    "CF/1988"
   ],
   [
    "empresarial",
    "Lei nº 11.101/2005"
   ],
   [
    "tributario",
    "Lei Complementar nº 101/2000"
   ],
   [
    "tributario",
    "Lei nº 5.172/1966"
   ],
   [
    "ambiental",
    "Lei nº 10.257/2001"
   ],
   [
    "ambiental",
    "Lei nº 13.465/2017"
   ],
   [
    "ambiental",
    "Lei nº 12.651/2012"
   ],
   [
    "ambiental",
    "Lei nº 12.305/2010"
   ],
   [
    "ambiental",
    "Lei nº 9.985/2000"
   ],
   [
    "ambiental",
    "Lei nº 9.433/1997"
   ],
   [
    "ambiental",
    "Lei nº 12.187/2009"
   ],
   [
    "ambiental",
    "Lei nº 11.445/2007"
   ],
   [
    "ambiental",
    "Lei nº 11.107/2005"
   ],
   [
    "administrativo",
    "Lei nº 12.527/2011"
   ],
   [
    "administrativo",
    "Lei nº 8.666/1993"
   ],
   [
    "administrativo",
    "Lei nº 9.394/1996"
   ],
   [
    "administrativo",
    "Lei nº 13.005/2014"
   ],
   [
    "administrativo",
    "Lei Complementar nº 101/2000"
   ],
   [
    "administrativo",
    "Lei nº 8.429/1992"
   ],
   [
    "administrativo",
    "Lei nº 14.133/2021"
   ],
   [
    "administrativo",
    "Decreto-Lei nº 3.365/1941"
   ],
   [
    "administrativo",
    "Lei nº 11.079/2004"
   ],
   [
    "previdenciario",
    "Lei nº 8.742/1993"
   ],
   [
    "previdenciario",
    "Lei nº 12.435/2011"
   ],
   [
    "humanos",
    "Lei nº 10.639/2003"
   ],
   [
    "humanos",
    "Lei nº 7.716/1989"
   ],
   [
    "humanos",
    "Lei nº 12.847/2013"
   ],
   [
    "humanos",
    "Lei nº 12.852/2013"
   ],
   [
    "humanos",
    "Lei nº 9.474/1997"
   ],
   [
    "humanos",
    "Lei nº 12.288/2010"
   ],
   [
    "humanos",
    "Decreto nº 6.949/2009"
   ],
   [
    "humanos",
    "Decreto nº 592/1992"
   ]
  ],
  "extras": [
   "Lei Complementar nº 207/1979",
   "Lei Complementar nº 893/2001",
   "Lei nº 14.187/2010",
   "Lei nº 10.948/2001",
   "Lei nº 11.199/2002",
   "Lei nº 10.705/2000",
   "Lei nº 10.365/1999",
   "Decreto nº 55.334/2010",
   "Decreto nº 55.370/2010",
   "Resolução nº 414/2021",
   "Resolução nº 213/2015",
   "Resolução nº 425/2021",
   "Resolução CNJ nº 287/2019",
   "Resolução nº 4/2011",
   "Resolução nº 412/2021",
   "Resolução CNJ nº 125/2010",
   "Resolução CNJ nº 345/2021",
   "Resolução nº 348/2020"
  ],
  "tipo": "edital"
 }
];
