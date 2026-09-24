// Editais de concurso — dados (conteúdo programático mapeado).
// Há dois tipos de item: tipo "carreira" (espécie de cargo — junta o conteúdo de todos os
// editais daquela carreira, campo "editais"; secao "exame" = exames nacionais como o ENAM e o ENAC;
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
   "trf5-xvi",
   "trf2-154-2025",
   "trf1-xviii-2025",
   "trf3-xxi-2024",
   "trf6-1-2025"
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
   "tjrs-2026",
   "tjsp-192",
   "tjma-1-2022",
   "tjdft-1-2022",
   "tjms-2023",
   "tjba-2026",
   "tjsc-11-2025",
   "tjse-2024",
   "tjpa-1-2025",
   "tjam-1-2024",
   "tjce-91-2025",
   "tjmt-1-2024",
   "tjpr-1-2025",
   "tjto-1-2025",
   "tjmg-1-2026",
   "tjrj-li"
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
   "mpmg-61",
   "mp-mt-promotor-2026",
   "mp-go-promotor-2025",
   "mp-ms-xxxi-promotor-2026",
   "mp-rj-xxxix-promotor-2026",
   "mpdft-33-2025",
   "mpba-1-2025",
   "mpes-1-2025",
   "mpma-1-2025",
   "mprs-51-2025",
   "mpsc-45-2025"
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
   "pf-delegado-2025",
   "pc-ap-delegado-2026",
   "pc-df-delegado-2026",
   "pc-pr-delegado-2026",
   "pc-ba-delegado-2026"
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
   "dpesp-ix",
   "dpe-sc-defensor-2026",
   "dpe-rj-xxix-defensor-2026"
  ]
 },
 {
  "id": "carreira-advogado-publico",
  "tipo": "carreira",
  "secao": "carreira",
  "sigla": "Carreira",
  "cargo": "união dos editais: PGE-CE + PGE-AL + PGE-AC + AGU (Advogado da União) + AGU (Procurador Federal) + PFN",
  "orgao": "Reúne o conteúdo de 6 editais",
  "titulo": "Advogado Público",
  "edital": "PGE-CE, PGE-AL, PGE-AC: Concursos para Procurador do Estado · AGU: Concursos para Advogado da União e para Procurador Federal · PFN: Concurso para Procurador da Fazenda Nacional",
  "grupos": [
   {
    "nome": "Disciplinas (união dos editais)",
    "disciplinas": [
     "Direito Previdenciário — 6 de 6 editais",
     "Direito Empresarial — 6 de 6 editais",
     "Direito Administrativo — 6 de 6 editais",
     "Direito Processual Penal — 6 de 6 editais",
     "Direito Ambiental — 6 de 6 editais",
     "Direito Processual Civil — 6 de 6 editais",
     "Direito Tributário — 6 de 6 editais",
     "Direito Penal — 6 de 6 editais",
     "Direito do Trabalho — 5 de 6 editais",
     "Direito Civil — 5 de 6 editais",
     "Direito Constitucional — 5 de 6 editais",
     "Direito do Consumidor — 3 de 6 editais",
     "Direitos Humanos — 3 de 6 editais",
     "Direito da Criança e do Adolescente — 1 de 6 editais",
     "Direito Eleitoral — 1 de 6 editais"
    ]
   }
  ],
  "leis": [
   [
    "administrativo",
    "Decreto nº 1.171/1994"
   ],
   [
    "administrativo",
    "Decreto nº 10.024/2019"
   ],
   [
    "administrativo",
    "Decreto nº 10.201/2020"
   ],
   [
    "administrativo",
    "Decreto nº 10.592/2020"
   ],
   [
    "administrativo",
    "Decreto nº 11.129/2022"
   ],
   [
    "administrativo",
    "Decreto nº 3.555/2000"
   ],
   [
    "administrativo",
    "Decreto nº 6.017/2007"
   ],
   [
    "administrativo",
    "Decreto nº 6.029/2007"
   ],
   [
    "administrativo",
    "Decreto nº 6.170/2007"
   ],
   [
    "administrativo",
    "Decreto nº 7.581/2011"
   ],
   [
    "administrativo",
    "Decreto nº 7.724/2012"
   ],
   [
    "administrativo",
    "Decreto nº 7.746/2012"
   ],
   [
    "administrativo",
    "Decreto nº 7.892/2013"
   ],
   [
    "administrativo",
    "Decreto nº 7.983/2013"
   ],
   [
    "administrativo",
    "Decreto nº 9.311/2018"
   ],
   [
    "administrativo",
    "Decreto nº 9.830/2019"
   ],
   [
    "administrativo",
    "Decreto-Lei nº 200/1967"
   ],
   [
    "administrativo",
    "Decreto-Lei nº 3.365/1941"
   ],
   [
    "administrativo",
    "Decreto-Lei nº 4.597/1942"
   ],
   [
    "administrativo",
    "Lei Complementar (DF) nº 840/2011"
   ],
   [
    "administrativo",
    "Lei Complementar (SC) nº 491/2010"
   ],
   [
    "administrativo",
    "Lei Complementar (SE) nº 33/1996"
   ],
   [
    "administrativo",
    "Lei Complementar nº 101/2000"
   ],
   [
    "administrativo",
    "Lei Complementar nº 73/1993"
   ],
   [
    "administrativo",
    "Lei Complementar nº 76/1993"
   ],
   [
    "administrativo",
    "Lei Estadual (BA) nº 6.677/1994"
   ],
   [
    "administrativo",
    "Lei Estadual (MA) nº 6.107/1994"
   ],
   [
    "administrativo",
    "Lei Estadual (MS) nº 1.102/1990"
   ],
   [
    "administrativo",
    "Lei Estadual (SC) nº 6.745/1985"
   ],
   [
    "administrativo",
    "Lei Estadual (SP) nº 10.177/1998"
   ],
   [
    "administrativo",
    "Lei nº 10.480/2002"
   ],
   [
    "administrativo",
    "Lei nº 10.520/2002"
   ],
   [
    "administrativo",
    "Lei nº 10.973/2004"
   ],
   [
    "administrativo",
    "Lei nº 11.079/2004"
   ],
   [
    "administrativo",
    "Lei nº 12.462/2011"
   ],
   [
    "administrativo",
    "Lei nº 12.527/2011"
   ],
   [
    "administrativo",
    "Lei nº 12.783/2013"
   ],
   [
    "administrativo",
    "Lei nº 12.813/2013"
   ],
   [
    "administrativo",
    "Lei nº 12.815/2013"
   ],
   [
    "administrativo",
    "Lei nº 12.846/2013"
   ],
   [
    "administrativo",
    "Lei nº 13.019/2014"
   ],
   [
    "administrativo",
    "Lei nº 13.178/2015"
   ],
   [
    "administrativo",
    "Lei nº 13.243/2016"
   ],
   [
    "administrativo",
    "Lei nº 13.303/2016"
   ],
   [
    "administrativo",
    "Lei nº 13.448/2017"
   ],
   [
    "administrativo",
    "Lei nº 13.460/2017"
   ],
   [
    "administrativo",
    "Lei nº 13.848/2019"
   ],
   [
    "administrativo",
    "Lei nº 14.133/2021"
   ],
   [
    "administrativo",
    "Lei nº 14.230/2021"
   ],
   [
    "administrativo",
    "Lei nº 14.967/2024"
   ],
   [
    "administrativo",
    "Lei nº 4.320/1964"
   ],
   [
    "administrativo",
    "Lei nº 4.878/1965"
   ],
   [
    "administrativo",
    "Lei nº 6.969/1981"
   ],
   [
    "administrativo",
    "Lei nº 8.080/1990"
   ],
   [
    "administrativo",
    "Lei nº 8.112/1990"
   ],
   [
    "administrativo",
    "Lei nº 8.429/1992"
   ],
   [
    "administrativo",
    "Lei nº 8.629/1993"
   ],
   [
    "administrativo",
    "Lei nº 8.666/1993"
   ],
   [
    "administrativo",
    "Lei nº 8.987/1995"
   ],
   [
    "administrativo",
    "Lei nº 9.028/1995"
   ],
   [
    "administrativo",
    "Lei nº 9.394/1996"
   ],
   [
    "administrativo",
    "Lei nº 9.469/1997"
   ],
   [
    "administrativo",
    "Lei nº 9.636/1998"
   ],
   [
    "administrativo",
    "Lei nº 9.637/1998"
   ],
   [
    "administrativo",
    "Lei nº 9.784/1999"
   ],
   [
    "administrativo",
    "Lei nº 9.790/1999"
   ],
   [
    "administrativo",
    "Lei nº 9.873/1999"
   ],
   [
    "administrativo",
    "Lei nº 9.986/2000"
   ],
   [
    "ambiental",
    "Decreto nº 10.936/2022"
   ],
   [
    "ambiental",
    "Decreto nº 6.514/2008"
   ],
   [
    "ambiental",
    "Decreto nº 7.217/2010"
   ],
   [
    "ambiental",
    "Decreto nº 99.274/1990"
   ],
   [
    "ambiental",
    "Lei Complementar nº 140/2011"
   ],
   [
    "ambiental",
    "Lei Estadual (SC) nº 14.675/2009"
   ],
   [
    "ambiental",
    "Lei Estadual (SC) nº 16.342/2014"
   ],
   [
    "ambiental",
    "Lei nº 10.257/2001"
   ],
   [
    "ambiental",
    "Lei nº 11.107/2005"
   ],
   [
    "ambiental",
    "Lei nº 11.124/2005"
   ],
   [
    "ambiental",
    "Lei nº 11.284/2006"
   ],
   [
    "ambiental",
    "Lei nº 11.445/2007"
   ],
   [
    "ambiental",
    "Lei nº 11.516/2007"
   ],
   [
    "ambiental",
    "Lei nº 11.952/2009"
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
    "Lei nº 12.334/2010"
   ],
   [
    "ambiental",
    "Lei nº 12.587/2012"
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
    "Lei nº 13.465/2017"
   ],
   [
    "ambiental",
    "Lei nº 14.026/2020"
   ],
   [
    "ambiental",
    "Lei nº 14.755/2023"
   ],
   [
    "ambiental",
    "Lei nº 14.785/2023"
   ],
   [
    "ambiental",
    "Lei nº 14.904/2024"
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
    "Lei nº 6.938/1981"
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
    "Lei nº 9.985/2000"
   ],
   [
    "ambiental",
    "Medida Provisória nº 1.308/2025"
   ],
   [
    "civil",
    "Decreto nº 10.604/2021"
   ],
   [
    "civil",
    "Decreto nº 20.910/1932"
   ],
   [
    "civil",
    "Decreto nº 9.921/2019"
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
    "Lei nº 10.406/2002"
   ],
   [
    "civil",
    "Lei nº 10.741/2003"
   ],
   [
    "civil",
    "Lei nº 12.376/2010"
   ],
   [
    "civil",
    "Lei nº 12.965/2014"
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
    "Lei nº 13.874/2019"
   ],
   [
    "civil",
    "Lei nº 14.010/2020"
   ],
   [
    "civil",
    "Lei nº 14.382/2022"
   ],
   [
    "civil",
    "Lei nº 14.905/2024"
   ],
   [
    "civil",
    "Lei nº 6.015/1973"
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
    "Lei nº 8.245/1991"
   ],
   [
    "civil",
    "Lei nº 8.935/1994"
   ],
   [
    "civil",
    "Lei nº 9.492/1997"
   ],
   [
    "civil",
    "Lei nº 9.610/1998"
   ],
   [
    "constitucional",
    "CF/1988"
   ],
   [
    "constitucional",
    "Emenda Constitucional nº 45/2004"
   ],
   [
    "constitucional",
    "Emenda Constitucional nº 80/2014"
   ],
   [
    "constitucional",
    "Lei nº 12.562/2011"
   ],
   [
    "constitucional",
    "Lei nº 9.868/1999"
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
    "Lei Complementar nº 123/2006"
   ],
   [
    "empresarial",
    "Lei Complementar nº 182/2021"
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
    "Lei nº 14.112/2020"
   ],
   [
    "empresarial",
    "Lei nº 14.193/2021"
   ],
   [
    "empresarial",
    "Lei nº 6.024/1974"
   ],
   [
    "empresarial",
    "Lei nº 6.404/1976"
   ],
   [
    "empresarial",
    "Lei nº 7.913/1989"
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
    "humanos",
    "Decreto nº 4.887/2003"
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
    "Lei nº 7.716/1989"
   ],
   [
    "penal",
    "Decreto-Lei nº 2.848/1940"
   ],
   [
    "penal",
    "Lei nº 1.521/1951"
   ],
   [
    "penal",
    "Lei nº 10.826/2003"
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
    "Lei nº 13.869/2019"
   ],
   [
    "penal",
    "Lei nº 13.964/2019"
   ],
   [
    "penal",
    "Lei nº 4.898/1965"
   ],
   [
    "penal",
    "Lei nº 7.210/1984"
   ],
   [
    "penal",
    "Lei nº 7.492/1986"
   ],
   [
    "penal",
    "Lei nº 7.716/1989"
   ],
   [
    "penal",
    "Lei nº 8.072/1990"
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
    "Lei nº 9.249/1995"
   ],
   [
    "penal",
    "Lei nº 9.263/1996"
   ],
   [
    "penal",
    "Lei nº 9.434/1997"
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
    "Lei nº 9.605/1998"
   ],
   [
    "penal",
    "Lei nº 9.613/1998"
   ],
   [
    "previdenciario",
    "Decreto nº 3.048/1999"
   ],
   [
    "previdenciario",
    "Decreto nº 8.424/2015"
   ],
   [
    "previdenciario",
    "Emenda Constitucional nº 103/2019"
   ],
   [
    "previdenciario",
    "Lei Complementar nº 108/2001"
   ],
   [
    "previdenciario",
    "Lei Complementar nº 109/2001"
   ],
   [
    "previdenciario",
    "Lei Complementar nº 142/2013"
   ],
   [
    "previdenciario",
    "Lei nº 10.779/2003"
   ],
   [
    "previdenciario",
    "Lei nº 12.435/2011"
   ],
   [
    "previdenciario",
    "Lei nº 12.618/2012"
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
    "Lei nº 8.742/1993"
   ],
   [
    "processual_civil",
    "Lei nº 10.259/2001"
   ],
   [
    "processual_civil",
    "Lei nº 11.418/2006"
   ],
   [
    "processual_civil",
    "Lei nº 11.419/2006"
   ],
   [
    "processual_civil",
    "Lei nº 11.672/2008"
   ],
   [
    "processual_civil",
    "Lei nº 12.016/2009"
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
    "processual_civil",
    "Lei nº 13.129/2015"
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
    "Lei nº 8.038/1990"
   ],
   [
    "processual_civil",
    "Lei nº 8.437/1992"
   ],
   [
    "processual_civil",
    "Lei nº 9.099/1995"
   ],
   [
    "processual_civil",
    "Lei nº 9.307/1996"
   ],
   [
    "processual_civil",
    "Lei nº 9.494/1997"
   ],
   [
    "processual_civil",
    "Lei nº 9.507/1997"
   ],
   [
    "processual_penal",
    "Decreto-Lei nº 3.689/1941"
   ],
   [
    "processual_penal",
    "Lei nº 11.101/2005"
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
    "Lei nº 4.737/1965"
   ],
   [
    "processual_penal",
    "Lei nº 5.249/1967"
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
    "trabalhista",
    "Decreto nº 9.507/2018"
   ],
   [
    "trabalhista",
    "Decreto-Lei nº 5.452/1943"
   ],
   [
    "trabalhista",
    "Lei nº 10.035/2000"
   ],
   [
    "tributario",
    "Decreto nº 70.235/1972"
   ],
   [
    "tributario",
    "Decreto-Lei nº 147/1967"
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
    "Lei Complementar nº 105/2001"
   ],
   [
    "tributario",
    "Lei Complementar nº 116/2003"
   ],
   [
    "tributario",
    "Lei Complementar nº 118/2005"
   ],
   [
    "tributario",
    "Lei Complementar nº 159/2017"
   ],
   [
    "tributario",
    "Lei Complementar nº 199/2023"
   ],
   [
    "tributario",
    "Lei Estadual (SC) nº 3.938/1966"
   ],
   [
    "tributario",
    "Lei nº 10.169/2000"
   ],
   [
    "tributario",
    "Lei nº 10.522/2002"
   ],
   [
    "tributario",
    "Lei nº 13.988/2020"
   ],
   [
    "tributario",
    "Lei nº 5.172/1966"
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
    "Lei nº 9.703/1998"
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
   "pfn-2022",
   "pge-al-procurador-2026",
   "pge-ac-procurador-2026",
   "agu-procurador-federal-2022"
  ]
 },
 {
  "id": "exame-enac",
  "tipo": "carreira",
  "secao": "exame",
  "sigla": "Exame",
  "cargo": "união dos editais: ENAC",
  "orgao": "Reúne o conteúdo de 1 edital",
  "titulo": "ENAC — Exame Nacional dos Cartórios",
  "edital": "ENAC: 4º Exame Nacional dos Cartórios",
  "grupos": [
   {
    "nome": "Disciplinas (união dos editais)",
    "disciplinas": [
     "Direito Notarial e Registral",
     "Direito Constitucional",
     "Direito Administrativo",
     "Direito Tributário",
     "Direito Processual Civil",
     "Direito Civil",
     "Direito Empresarial",
     "Direito Penal",
     "Direito Processual Penal",
     "Direito do Trabalho",
     "Direito Processual do Trabalho"
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
    "Lei nº 8.935/1994"
   ],
   [
    "civil",
    "Lei nº 14.382/2022"
   ],
   [
    "civil",
    "Lei nº 9.492/1997"
   ],
   [
    "civil",
    "Lei nº 14.711/2023"
   ],
   [
    "civil",
    "Lei nº 6.766/1979"
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
    "Lei nº 8.245/1991"
   ],
   [
    "civil",
    "Lei nº 8.009/1990"
   ],
   [
    "civil",
    "Lei nº 13.146/2015"
   ],
   [
    "civil",
    "Lei nº 13.874/2019"
   ],
   [
    "civil",
    "Decreto-Lei nº 911/1969"
   ],
   [
    "civil",
    "Lei nº 4.380/1964"
   ],
   [
    "civil",
    "Lei nº 10.931/2004"
   ],
   [
    "civil",
    "Lei nº 13.709/2018"
   ],
   [
    "civil",
    "Lei nº 14.063/2020"
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
    "Lei nº 12.376/2010"
   ],
   [
    "civil",
    "Lei nº 10.267/2001"
   ],
   [
    "civil",
    "Decreto nº 8.660/2016"
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
    "Lei nº 13.140/2015"
   ],
   [
    "constitucional",
    "CF/1988"
   ],
   [
    "administrativo",
    "Lei nº 13.460/2017"
   ],
   [
    "administrativo",
    "Lei nº 9.784/1999"
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
    "Lei nº 12.846/2013"
   ],
   [
    "administrativo",
    "Decreto-Lei nº 3.365/1941"
   ],
   [
    "ambiental",
    "Lei nº 13.465/2017"
   ],
   [
    "ambiental",
    "Lei nº 11.952/2009"
   ],
   [
    "ambiental",
    "Lei nº 11.977/2009"
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
    "tributario",
    "Lei nº 5.172/1966"
   ],
   [
    "tributario",
    "Lei Complementar nº 116/2003"
   ],
   [
    "tributario",
    "Lei nº 6.830/1980"
   ],
   [
    "tributario",
    "Lei nº 10.169/2000"
   ],
   [
    "tributario",
    "Lei nº 8.134/1990"
   ],
   [
    "tributario",
    "Lei nº 7.713/1988"
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
    "Lei nº 6.404/1976"
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
    "Lei nº 11.101/2005"
   ],
   [
    "penal",
    "Decreto-Lei nº 2.848/1940"
   ],
   [
    "penal",
    "Lei nº 9.613/1998"
   ],
   [
    "processual_penal",
    "Decreto-Lei nº 3.689/1941"
   ],
   [
    "processual_penal",
    "Lei nº 9.807/1999"
   ],
   [
    "processual_penal",
    "Lei nº 9.296/1996"
   ],
   [
    "humanos",
    "Lei nº 13.445/2017"
   ],
   [
    "trabalhista",
    "Decreto-Lei nº 5.452/1943"
   ]
  ],
  "extras": [
   "Provimento CNJ nº 149/2023 (Código Nacional de Normas — Foro Extrajudicial)",
   "Resolução CNJ nº 228/2016 (Apostila de Haia)",
   "Resolução CNJ nº 583/2024 (traslado de certidões do registro civil emitidas no exterior)",
   "Resolução CNJ nº 402/2021 (preparação para o casamento civil)",
   "Resolução CNJ nº 35/2007 (inventário, partilha, separação e divórcio por via administrativa)",
   "Resolução CNJ nº 571/2024",
   "Legislação agrária e SIGEF (imóveis rurais, georreferenciamento) — citados de forma geral no programa"
  ],
  "editais": [
   "enac-2026-2"
  ]
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
    "Lei Complementar nº 159/2017"
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
    "Lei Complementar nº 159/2017"
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
  "id": "enac-2026-2",
  "sigla": "ENAC",
  "cargo": "Exame Nacional dos Cartórios 2026.2",
  "orgao": "CNJ / FGV",
  "titulo": "4º Exame Nacional dos Cartórios",
  "edital": "Edital de abertura nº 2/2026 (CNJ)",
  "grupos": [
   {
    "nome": "Disciplinas da prova",
    "disciplinas": [
     "Direito Notarial e Registral",
     "Direito Constitucional",
     "Direito Administrativo",
     "Direito Tributário",
     "Direito Processual Civil",
     "Direito Civil",
     "Direito Empresarial",
     "Direito Penal",
     "Direito Processual Penal",
     "Direito do Trabalho",
     "Direito Processual do Trabalho"
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
    "Lei nº 8.935/1994"
   ],
   [
    "civil",
    "Lei nº 14.382/2022"
   ],
   [
    "civil",
    "Lei nº 9.492/1997"
   ],
   [
    "civil",
    "Lei nº 14.711/2023"
   ],
   [
    "civil",
    "Lei nº 6.766/1979"
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
    "Lei nº 8.245/1991"
   ],
   [
    "civil",
    "Lei nº 8.009/1990"
   ],
   [
    "civil",
    "Lei nº 13.146/2015"
   ],
   [
    "civil",
    "Lei nº 13.874/2019"
   ],
   [
    "civil",
    "Decreto-Lei nº 911/1969"
   ],
   [
    "civil",
    "Lei nº 4.380/1964"
   ],
   [
    "civil",
    "Lei nº 10.931/2004"
   ],
   [
    "civil",
    "Lei nº 13.709/2018"
   ],
   [
    "civil",
    "Lei nº 14.063/2020"
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
    "Lei nº 12.376/2010"
   ],
   [
    "civil",
    "Lei nº 10.267/2001"
   ],
   [
    "civil",
    "Decreto nº 8.660/2016"
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
    "Lei nº 13.140/2015"
   ],
   [
    "constitucional",
    "CF/1988"
   ],
   [
    "administrativo",
    "Lei nº 13.460/2017"
   ],
   [
    "administrativo",
    "Lei nº 9.784/1999"
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
    "Lei nº 12.846/2013"
   ],
   [
    "administrativo",
    "Decreto-Lei nº 3.365/1941"
   ],
   [
    "ambiental",
    "Lei nº 13.465/2017"
   ],
   [
    "ambiental",
    "Lei nº 11.952/2009"
   ],
   [
    "ambiental",
    "Lei nº 11.977/2009"
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
    "tributario",
    "Lei nº 5.172/1966"
   ],
   [
    "tributario",
    "Lei Complementar nº 116/2003"
   ],
   [
    "tributario",
    "Lei nº 6.830/1980"
   ],
   [
    "tributario",
    "Lei nº 10.169/2000"
   ],
   [
    "tributario",
    "Lei nº 8.134/1990"
   ],
   [
    "tributario",
    "Lei nº 7.713/1988"
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
    "Lei nº 6.404/1976"
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
    "Lei nº 11.101/2005"
   ],
   [
    "penal",
    "Decreto-Lei nº 2.848/1940"
   ],
   [
    "penal",
    "Lei nº 9.613/1998"
   ],
   [
    "processual_penal",
    "Decreto-Lei nº 3.689/1941"
   ],
   [
    "processual_penal",
    "Lei nº 9.807/1999"
   ],
   [
    "processual_penal",
    "Lei nº 9.296/1996"
   ],
   [
    "humanos",
    "Lei nº 13.445/2017"
   ],
   [
    "trabalhista",
    "Decreto-Lei nº 5.452/1943"
   ]
  ],
  "extras": [
   "Provimento CNJ nº 149/2023 (Código Nacional de Normas — Foro Extrajudicial)",
   "Resolução CNJ nº 228/2016 (Apostila de Haia)",
   "Resolução CNJ nº 583/2024 (traslado de certidões do registro civil emitidas no exterior)",
   "Resolução CNJ nº 402/2021 (preparação para o casamento civil)",
   "Resolução CNJ nº 35/2007 (inventário, partilha, separação e divórcio por via administrativa)",
   "Resolução CNJ nº 571/2024",
   "Legislação agrária e SIGEF (imóveis rurais, georreferenciamento) — citados de forma geral no programa"
  ],
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
 },
 {
  "id": "tjsp-192",
  "sigla": "TJSP",
  "cargo": "Juiz Substituto",
  "orgao": "Tribunal de Justiça do Estado de São Paulo",
  "titulo": "192º Concurso de Provas e Títulos para Ingresso na Magistratura",
  "edital": "Edital de Abertura (192º Concurso)",
  "grupos": [
   {
    "nome": "Anexo I — Disciplinas jurídicas",
    "disciplinas": [
     "Direito Civil",
     "Direito Processual Civil",
     "Direito do Consumidor",
     "Direito da Criança e do Adolescente",
     "Direito Penal",
     "Direito Processual Penal",
     "Direito Constitucional",
     "Direito Eleitoral",
     "Direito Empresarial",
     "Direito Tributário",
     "Direito Ambiental",
     "Direito Administrativo"
    ]
   },
   {
    "nome": "Anexo II — Noções Gerais de Direito e Formação Humanística",
    "disciplinas": [
     "Sociologia do Direito",
     "Psicologia Judiciária",
     "Ética e Estatuto Jurídico da Magistratura Nacional",
     "Filosofia do Direito",
     "Teoria Geral do Direito e da Política",
     "Direito Digital",
     "Pragmatismo, Análise Econômica do Direito e Economia Comportamental",
     "Direito da Antidiscriminação"
    ]
   },
   {
    "nome": "Anexo III — Direitos Humanos",
    "disciplinas": [
     "Direitos Humanos"
    ]
   }
  ],
  "leis": [
   [
    "administrativo",
    "Decreto nº 1.171/1994"
   ],
   [
    "administrativo",
    "Decreto nº 6.017/2007"
   ],
   [
    "administrativo",
    "Decreto-Lei nº 3.365/1941"
   ],
   [
    "administrativo",
    "Lei Complementar nº 101/2000"
   ],
   [
    "administrativo",
    "Lei Estadual (SP) nº 10.177/1998"
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
    "Lei nº 13.303/2016"
   ],
   [
    "administrativo",
    "Lei nº 13.460/2017"
   ],
   [
    "administrativo",
    "Lei nº 13.848/2019"
   ],
   [
    "administrativo",
    "Lei nº 14.133/2021"
   ],
   [
    "administrativo",
    "Lei nº 14.230/2021"
   ],
   [
    "administrativo",
    "Lei nº 4.878/1965"
   ],
   [
    "administrativo",
    "Lei nº 8.112/1990"
   ],
   [
    "administrativo",
    "Lei nº 8.429/1992"
   ],
   [
    "administrativo",
    "Lei nº 8.666/1993"
   ],
   [
    "administrativo",
    "Lei nº 8.987/1995"
   ],
   [
    "administrativo",
    "Lei nº 9.784/1999"
   ],
   [
    "administrativo",
    "Lei nº 9.873/1999"
   ],
   [
    "ambiental",
    "Decreto nº 10.936/2022"
   ],
   [
    "ambiental",
    "Decreto nº 7.217/2010"
   ],
   [
    "ambiental",
    "Decreto nº 9.310/2018"
   ],
   [
    "ambiental",
    "Decreto nº 99.274/1990"
   ],
   [
    "ambiental",
    "Lei Complementar nº 140/2011"
   ],
   [
    "ambiental",
    "Lei nº 11.105/2005"
   ],
   [
    "ambiental",
    "Lei nº 11.124/2005"
   ],
   [
    "ambiental",
    "Lei nº 11.445/2007"
   ],
   [
    "ambiental",
    "Lei nº 11.952/2009"
   ],
   [
    "ambiental",
    "Lei nº 11.977/2009"
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
    "Lei nº 12.334/2010"
   ],
   [
    "ambiental",
    "Lei nº 12.587/2012"
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
    "Lei nº 13.465/2017"
   ],
   [
    "ambiental",
    "Lei nº 14.026/2020"
   ],
   [
    "ambiental",
    "Lei nº 14.755/2023"
   ],
   [
    "ambiental",
    "Lei nº 14.785/2023"
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
    "Lei nº 6.938/1981"
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
    "Lei nº 9.985/2000"
   ],
   [
    "ambiental",
    "Medida Provisória nº 1.308/2025"
   ],
   [
    "civil",
    "Decreto-Lei nº 4.657/1942"
   ],
   [
    "civil",
    "Decreto-Lei nº 911/1969"
   ],
   [
    "civil",
    "Lei nº 10.267/2001"
   ],
   [
    "civil",
    "Lei nº 10.406/2002"
   ],
   [
    "civil",
    "Lei nº 12.376/2010"
   ],
   [
    "civil",
    "Lei nº 12.965/2014"
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
    "Lei nº 13.874/2019"
   ],
   [
    "civil",
    "Lei nº 14.195/2021"
   ],
   [
    "civil",
    "Lei nº 14.382/2022"
   ],
   [
    "civil",
    "Lei nº 14.711/2023"
   ],
   [
    "civil",
    "Lei nº 14.905/2024"
   ],
   [
    "civil",
    "Lei nº 5.478/1968"
   ],
   [
    "civil",
    "Lei nº 6.015/1973"
   ],
   [
    "civil",
    "Lei nº 6.766/1979"
   ],
   [
    "civil",
    "Lei nº 8.935/1994"
   ],
   [
    "civil",
    "Lei nº 9.278/1996"
   ],
   [
    "civil",
    "Lei nº 9.514/1997"
   ],
   [
    "constitucional",
    "Emenda Constitucional nº 45/2004"
   ],
   [
    "constitucional",
    "Emenda Constitucional nº 80/2014"
   ],
   [
    "consumidor",
    "Decreto nº 2.181/1997"
   ],
   [
    "consumidor",
    "Decreto nº 7.962/2013"
   ],
   [
    "consumidor",
    "Lei nº 8.078/1990"
   ],
   [
    "crianca",
    "Decreto nº 9.603/2018"
   ],
   [
    "crianca",
    "Lei nº 12.594/2012"
   ],
   [
    "crianca",
    "Lei nº 13.257/2016"
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
    "Lei nº 14.811/2024"
   ],
   [
    "crianca",
    "Lei nº 8.069/1990"
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
    "Lei nº 9.096/1995"
   ],
   [
    "eleitoral",
    "Lei nº 9.504/1997"
   ],
   [
    "empresarial",
    "Decreto nº 2.044/1908"
   ],
   [
    "empresarial",
    "Decreto nº 3.708/1919"
   ],
   [
    "empresarial",
    "Lei Complementar nº 123/2006"
   ],
   [
    "empresarial",
    "Lei Complementar nº 182/2021"
   ],
   [
    "empresarial",
    "Lei nº 11.101/2005"
   ],
   [
    "empresarial",
    "Lei nº 14.193/2021"
   ],
   [
    "empresarial",
    "Lei nº 4.886/1965"
   ],
   [
    "empresarial",
    "Lei nº 6.024/1974"
   ],
   [
    "empresarial",
    "Lei nº 6.404/1976"
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
    "Lei nº 9.609/1998"
   ],
   [
    "humanos",
    "Decreto nº 10.088/2019"
   ],
   [
    "humanos",
    "Decreto nº 50.215/1961"
   ],
   [
    "humanos",
    "Decreto nº 678/1992"
   ],
   [
    "humanos",
    "Decreto nº 7.037/2009"
   ],
   [
    "humanos",
    "Decreto nº 9.571/2018"
   ],
   [
    "humanos",
    "Lei nº 12.288/2010"
   ],
   [
    "humanos",
    "Lei nº 12.852/2013"
   ],
   [
    "humanos",
    "Lei nº 14.701/2023"
   ],
   [
    "humanos",
    "Lei nº 7.716/1989"
   ],
   [
    "humanos",
    "Lei nº 7.853/1989"
   ],
   [
    "humanos",
    "Lei nº 9.474/1997"
   ],
   [
    "humanos",
    "Resolução A/RES/61/295 (ONU, 2007)"
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
    "Decreto-Lei nº 3.688/1941"
   ],
   [
    "penal",
    "Lei nº 1.521/1951"
   ],
   [
    "penal",
    "Lei nº 10.826/2003"
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
    "Lei nº 13.869/2019"
   ],
   [
    "penal",
    "Lei nº 13.964/2019"
   ],
   [
    "penal",
    "Lei nº 14.532/2023"
   ],
   [
    "penal",
    "Lei nº 14.597/2023"
   ],
   [
    "penal",
    "Lei nº 7.210/1984"
   ],
   [
    "penal",
    "Lei nº 7.492/1986"
   ],
   [
    "penal",
    "Lei nº 7.716/1989"
   ],
   [
    "penal",
    "Lei nº 8.072/1990"
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
    "Lei nº 9.029/1995"
   ],
   [
    "penal",
    "Lei nº 9.434/1997"
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
    "Lei nº 9.605/1998"
   ],
   [
    "penal",
    "Lei nº 9.613/1998"
   ],
   [
    "processual_civil",
    "Lei nº 10.259/2001"
   ],
   [
    "processual_civil",
    "Lei nº 11.417/2006"
   ],
   [
    "processual_civil",
    "Lei nº 12.016/2009"
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
    "processual_civil",
    "Lei nº 13.655/2018"
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
    "Lei nº 8.437/1992"
   ],
   [
    "processual_civil",
    "Lei nº 9.099/1995"
   ],
   [
    "processual_civil",
    "Lei nº 9.494/1997"
   ],
   [
    "processual_civil",
    "Lei nº 9.507/1997"
   ],
   [
    "processual_penal",
    "Decreto-Lei nº 1.002/1969"
   ],
   [
    "processual_penal",
    "Decreto-Lei nº 201/1967"
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
    "Lei nº 12.313/2010"
   ],
   [
    "processual_penal",
    "Lei nº 12.850/2013"
   ],
   [
    "processual_penal",
    "Lei nº 13.431/2017"
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
    "tributario",
    "Decreto nº 6.022/2007"
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
    "Lei Complementar nº 199/2023"
   ],
   [
    "tributario",
    "Lei nº 10.169/2000"
   ],
   [
    "tributario",
    "Lei nº 5.172/1966"
   ]
  ],
  "tipo": "edital"
 },
 {
  "id": "tjma-1-2022",
  "sigla": "TJMA",
  "cargo": "Juiz Substituto",
  "orgao": "Tribunal de Justiça do Estado do Maranhão",
  "titulo": "Concurso Público para Juiz Substituto",
  "edital": "Edital nº 1 – TJMA, de 26 de abril de 2022",
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
    "administrativo",
    "Decreto nº 7.983/2013"
   ],
   [
    "administrativo",
    "Lei Complementar nº 101/2000"
   ],
   [
    "administrativo",
    "Lei Estadual (MA) nº 6.107/1994"
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
    "Lei nº 14.230/2021"
   ],
   [
    "administrativo",
    "Lei nº 4.320/1964"
   ],
   [
    "administrativo",
    "Lei nº 4.878/1965"
   ],
   [
    "administrativo",
    "Lei nº 8.112/1990"
   ],
   [
    "administrativo",
    "Lei nº 8.429/1992"
   ],
   [
    "administrativo",
    "Lei nº 8.666/1993"
   ],
   [
    "administrativo",
    "Lei nº 8.987/1995"
   ],
   [
    "administrativo",
    "Lei nº 9.469/1997"
   ],
   [
    "administrativo",
    "Lei nº 9.637/1998"
   ],
   [
    "administrativo",
    "Lei nº 9.784/1999"
   ],
   [
    "administrativo",
    "Lei nº 9.790/1999"
   ],
   [
    "ambiental",
    "Decreto nº 10.936/2022"
   ],
   [
    "ambiental",
    "Decreto nº 6.514/2008"
   ],
   [
    "ambiental",
    "Decreto nº 99.274/1990"
   ],
   [
    "ambiental",
    "Lei Complementar nº 140/2011"
   ],
   [
    "ambiental",
    "Lei nº 11.107/2005"
   ],
   [
    "ambiental",
    "Lei nº 11.124/2005"
   ],
   [
    "ambiental",
    "Lei nº 11.952/2009"
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
    "Lei nº 12.334/2010"
   ],
   [
    "ambiental",
    "Lei nº 12.587/2012"
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
    "Lei nº 14.755/2023"
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
    "Lei nº 6.938/1981"
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
    "Lei nº 9.985/2000"
   ],
   [
    "ambiental",
    "Medida Provisória nº 1.308/2025"
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
    "Lei nº 10.741/2003"
   ],
   [
    "civil",
    "Lei nº 10.931/2004"
   ],
   [
    "civil",
    "Lei nº 12.318/2010"
   ],
   [
    "civil",
    "Lei nº 12.376/2010"
   ],
   [
    "civil",
    "Lei nº 12.764/2012"
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
    "Lei nº 14.905/2024"
   ],
   [
    "civil",
    "Lei nº 4.591/1964"
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
    "Lei nº 8.935/1994"
   ],
   [
    "civil",
    "Lei nº 8.971/1994"
   ],
   [
    "civil",
    "Lei nº 9.278/1996"
   ],
   [
    "constitucional",
    "CF/1988"
   ],
   [
    "constitucional",
    "Emenda Constitucional nº 45/2004"
   ],
   [
    "constitucional",
    "Emenda Constitucional nº 80/2014"
   ],
   [
    "consumidor",
    "Decreto nº 2.181/1997"
   ],
   [
    "consumidor",
    "Lei nº 8.078/1990"
   ],
   [
    "consumidor",
    "Resolução Normativa ANEEL nº 1.000/2021"
   ],
   [
    "crianca",
    "Lei nº 12.594/2012"
   ],
   [
    "crianca",
    "Lei nº 8.069/1990"
   ],
   [
    "eleitoral",
    "Lei Complementar nº 64/1990"
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
    "Lei nº 9.096/1995"
   ],
   [
    "eleitoral",
    "Lei nº 9.504/1997"
   ],
   [
    "empresarial",
    "Decreto nº 2.044/1908"
   ],
   [
    "empresarial",
    "Decreto-Lei nº 167/1967"
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
    "Lei nº 12.529/2011"
   ],
   [
    "empresarial",
    "Lei nº 14.112/2020"
   ],
   [
    "empresarial",
    "Lei nº 14.193/2021"
   ],
   [
    "empresarial",
    "Lei nº 4.886/1965"
   ],
   [
    "empresarial",
    "Lei nº 6.404/1976"
   ],
   [
    "empresarial",
    "Lei nº 7.913/1989"
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
    "Lei nº 9.609/1998"
   ],
   [
    "humanos",
    "Decreto nº 678/1992"
   ],
   [
    "humanos",
    "Lei nº 7.716/1989"
   ],
   [
    "penal",
    "Decreto nº 5.015/2004"
   ],
   [
    "penal",
    "Decreto-Lei nº 201/1967"
   ],
   [
    "penal",
    "Decreto-Lei nº 3.688/1941"
   ],
   [
    "penal",
    "Lei nº 1.521/1951"
   ],
   [
    "penal",
    "Lei nº 10.826/2003"
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
    "Lei nº 12.984/2014"
   ],
   [
    "penal",
    "Lei nº 13.869/2019"
   ],
   [
    "penal",
    "Lei nº 4.898/1965"
   ],
   [
    "penal",
    "Lei nº 7.210/1984"
   ],
   [
    "penal",
    "Lei nº 7.492/1986"
   ],
   [
    "penal",
    "Lei nº 7.716/1989"
   ],
   [
    "penal",
    "Lei nº 8.072/1990"
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
    "Lei nº 9.455/1997"
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
    "Lei nº 9.613/1998"
   ],
   [
    "processual_civil",
    "Lei nº 10.259/2001"
   ],
   [
    "processual_civil",
    "Lei nº 11.417/2006"
   ],
   [
    "processual_civil",
    "Lei nº 12.016/2009"
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
    "processual_civil",
    "Lei nº 4.717/1965"
   ],
   [
    "processual_civil",
    "Lei nº 7.347/1985"
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
    "Lei nº 9.494/1997"
   ],
   [
    "processual_civil",
    "Lei nº 9.507/1997"
   ],
   [
    "processual_penal",
    "Decreto-Lei nº 1.002/1969"
   ],
   [
    "processual_penal",
    "Decreto-Lei nº 201/1967"
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
    "Lei nº 12.037/2009"
   ],
   [
    "processual_penal",
    "Lei nº 12.313/2010"
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
    "Lei nº 5.249/1967"
   ],
   [
    "processual_penal",
    "Lei nº 7.210/1984"
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
    "tributario",
    "Decreto nº 70.235/1972"
   ],
   [
    "tributario",
    "Lei Complementar nº 101/2000"
   ],
   [
    "tributario",
    "Lei Complementar nº 118/2005"
   ],
   [
    "tributario",
    "Lei Complementar nº 199/2023"
   ],
   [
    "tributario",
    "Lei nº 10.169/2000"
   ],
   [
    "tributario",
    "Lei nº 5.172/1966"
   ],
   [
    "tributario",
    "Lei nº 6.830/1980"
   ],
   [
    "tributario",
    "Lei nº 8.397/1992"
   ]
  ],
  "tipo": "edital"
 },
 {
  "id": "tjdft-1-2022",
  "sigla": "TJDFT",
  "cargo": "Juiz de Direito Substituto",
  "orgao": "Tribunal de Justiça do Distrito Federal e dos Territórios",
  "titulo": "XLIV Concurso Público para Juiz de Direito Substituto",
  "edital": "Edital nº 1 – TJDFT, de 24 de novembro de 2022",
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
    "administrativo",
    "Decreto nº 6.017/2007"
   ],
   [
    "administrativo",
    "Decreto nº 7.983/2013"
   ],
   [
    "penal",
    "Decreto nº 9.847/2019"
   ],
   [
    "administrativo",
    "Decreto-Lei nº 4.597/1942"
   ],
   [
    "administrativo",
    "Lei Complementar (DF) nº 769/2008"
   ],
   [
    "administrativo",
    "Lei Complementar (DF) nº 840/2011"
   ],
   [
    "administrativo",
    "Lei Complementar nº 75/1993"
   ],
   [
    "administrativo",
    "Lei nº 10.520/2002"
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
    "Lei nº 14.230/2021"
   ],
   [
    "administrativo",
    "Lei nº 4.320/1964"
   ],
   [
    "administrativo",
    "Lei nº 4.878/1965"
   ],
   [
    "administrativo",
    "Lei nº 8.112/1990"
   ],
   [
    "administrativo",
    "Lei nº 8.429/1992"
   ],
   [
    "administrativo",
    "Lei nº 8.625/1993"
   ],
   [
    "administrativo",
    "Lei nº 8.666/1993"
   ],
   [
    "administrativo",
    "Lei nº 8.987/1995"
   ],
   [
    "administrativo",
    "Lei nº 9.469/1997"
   ],
   [
    "administrativo",
    "Lei nº 9.637/1998"
   ],
   [
    "administrativo",
    "Lei nº 9.784/1999"
   ],
   [
    "administrativo",
    "Lei nº 9.790/1999"
   ],
   [
    "ambiental",
    "Lei nº 10.257/2001"
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
    "Lei nº 12.651/2012"
   ],
   [
    "ambiental",
    "Lei nº 13.465/2017"
   ],
   [
    "ambiental",
    "Lei nº 6.938/1981"
   ],
   [
    "civil",
    "Decreto nº 20.910/1932"
   ],
   [
    "civil",
    "Decreto nº 22.626/1933"
   ],
   [
    "civil",
    "Decreto-Lei nº 4.657/1942"
   ],
   [
    "civil",
    "Decreto-Lei nº 911/1969"
   ],
   [
    "civil",
    "Lei nº 1.060/1950"
   ],
   [
    "civil",
    "Lei nº 10.406/2002"
   ],
   [
    "civil",
    "Lei nº 10.741/2003"
   ],
   [
    "civil",
    "Lei nº 10.931/2004"
   ],
   [
    "civil",
    "Lei nº 11.076/2004"
   ],
   [
    "civil",
    "Lei nº 11.804/2008"
   ],
   [
    "civil",
    "Lei nº 12.318/2010"
   ],
   [
    "civil",
    "Lei nº 12.376/2010"
   ],
   [
    "civil",
    "Lei nº 12.764/2012"
   ],
   [
    "civil",
    "Lei nº 12.965/2014"
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
    "Lei nº 13.874/2019"
   ],
   [
    "civil",
    "Lei nº 14.010/2020"
   ],
   [
    "civil",
    "Lei nº 14.382/2022"
   ],
   [
    "civil",
    "Lei nº 14.905/2024"
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
    "Lei nº 6.015/1973"
   ],
   [
    "civil",
    "Lei nº 6.515/1977"
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
    "Lei nº 8.245/1991"
   ],
   [
    "civil",
    "Lei nº 8.560/1992"
   ],
   [
    "civil",
    "Lei nº 8.935/1994"
   ],
   [
    "civil",
    "Lei nº 8.971/1994"
   ],
   [
    "civil",
    "Lei nº 9.278/1996"
   ],
   [
    "civil",
    "Lei nº 9.492/1997"
   ],
   [
    "civil",
    "Lei nº 9.514/1997"
   ],
   [
    "civil",
    "Lei nº 9.610/1998"
   ],
   [
    "constitucional",
    "CF/1988"
   ],
   [
    "constitucional",
    "Emenda Constitucional nº 45/2004"
   ],
   [
    "constitucional",
    "Emenda Constitucional nº 80/2014"
   ],
   [
    "consumidor",
    "Decreto nº 2.181/1997"
   ],
   [
    "consumidor",
    "Lei nº 14.181/2021"
   ],
   [
    "consumidor",
    "Lei nº 14.538/2023"
   ],
   [
    "consumidor",
    "Lei nº 8.078/1990"
   ],
   [
    "consumidor",
    "Lei nº 9.656/1998"
   ],
   [
    "consumidor",
    "Resolução ANATEL nº 765/2023"
   ],
   [
    "consumidor",
    "Resolução Normativa ANEEL nº 1.000/2021"
   ],
   [
    "crianca",
    "Decreto nº 9.603/2018"
   ],
   [
    "crianca",
    "Lei nº 12.594/2012"
   ],
   [
    "crianca",
    "Lei nº 13.257/2016"
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
    "eleitoral",
    "Lei Complementar nº 135/2010"
   ],
   [
    "eleitoral",
    "Lei Complementar nº 64/1990"
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
    "Lei nº 9.096/1995"
   ],
   [
    "eleitoral",
    "Lei nº 9.504/1997"
   ],
   [
    "empresarial",
    "Decreto nº 2.044/1908"
   ],
   [
    "empresarial",
    "Decreto nº 3.708/1919"
   ],
   [
    "empresarial",
    "Decreto-Lei nº 167/1967"
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
    "Lei nº 12.529/2011"
   ],
   [
    "empresarial",
    "Lei nº 14.112/2020"
   ],
   [
    "empresarial",
    "Lei nº 14.193/2021"
   ],
   [
    "empresarial",
    "Lei nº 4.886/1965"
   ],
   [
    "empresarial",
    "Lei nº 6.404/1976"
   ],
   [
    "empresarial",
    "Lei nº 7.913/1989"
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
    "Lei nº 9.609/1998"
   ],
   [
    "humanos",
    "Decreto nº 678/1992"
   ],
   [
    "humanos",
    "Lei nº 12.288/2010"
   ],
   [
    "humanos",
    "Lei nº 7.716/1989"
   ],
   [
    "humanos",
    "Lei nº 7.853/1989"
   ],
   [
    "penal",
    "Decreto nº 1.973/1996"
   ],
   [
    "penal",
    "Decreto nº 5.015/2004"
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
    "Decreto-Lei nº 3.688/1941"
   ],
   [
    "penal",
    "Lei nº 1.521/1951"
   ],
   [
    "penal",
    "Lei nº 10.671/2003"
   ],
   [
    "penal",
    "Lei nº 10.826/2003"
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
    "Lei nº 12.984/2014"
   ],
   [
    "penal",
    "Lei nº 13.869/2019"
   ],
   [
    "penal",
    "Lei nº 13.964/2019"
   ],
   [
    "penal",
    "Lei nº 14.322/2022"
   ],
   [
    "penal",
    "Lei nº 2.889/1956"
   ],
   [
    "penal",
    "Lei nº 4.898/1965"
   ],
   [
    "penal",
    "Lei nº 6.001/1973"
   ],
   [
    "penal",
    "Lei nº 7.210/1984"
   ],
   [
    "penal",
    "Lei nº 7.492/1986"
   ],
   [
    "penal",
    "Lei nº 7.716/1989"
   ],
   [
    "penal",
    "Lei nº 7.802/1989"
   ],
   [
    "penal",
    "Lei nº 8.072/1990"
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
    "Lei nº 9.263/1996"
   ],
   [
    "penal",
    "Lei nº 9.434/1997"
   ],
   [
    "penal",
    "Lei nº 9.455/1997"
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
    "Lei nº 9.613/1998"
   ],
   [
    "previdenciario",
    "Lei nº 8.742/1993"
   ],
   [
    "processual_civil",
    "Lei nº 10.259/2001"
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
    "processual_civil",
    "Lei nº 12.153/2009"
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
    "Lei nº 4.717/1965"
   ],
   [
    "processual_civil",
    "Lei nº 7.347/1985"
   ],
   [
    "processual_civil",
    "Lei nº 8.038/1990"
   ],
   [
    "processual_civil",
    "Lei nº 8.437/1992"
   ],
   [
    "processual_civil",
    "Lei nº 9.099/1995"
   ],
   [
    "processual_civil",
    "Lei nº 9.494/1997"
   ],
   [
    "processual_civil",
    "Lei nº 9.507/1997"
   ],
   [
    "processual_penal",
    "Decreto-Lei nº 1.002/1969"
   ],
   [
    "processual_penal",
    "Decreto-Lei nº 201/1967"
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
    "Lei nº 11.697/2008"
   ],
   [
    "processual_penal",
    "Lei nº 11.719/2008"
   ],
   [
    "processual_penal",
    "Lei nº 12.037/2009"
   ],
   [
    "processual_penal",
    "Lei nº 12.313/2010"
   ],
   [
    "processual_penal",
    "Lei nº 12.830/2013"
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
    "Lei nº 4.737/1965"
   ],
   [
    "processual_penal",
    "Lei nº 5.249/1967"
   ],
   [
    "processual_penal",
    "Lei nº 7.210/1984"
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
    "tributario",
    "Decreto nº 70.235/1972"
   ],
   [
    "tributario",
    "Lei Complementar nº 101/2000"
   ],
   [
    "tributario",
    "Lei Complementar nº 159/2017"
   ],
   [
    "tributario",
    "Lei nº 10.169/2000"
   ],
   [
    "tributario",
    "Lei nº 5.172/1966"
   ],
   [
    "tributario",
    "Lei nº 6.830/1980"
   ]
  ],
  "tipo": "edital"
 },
 {
  "id": "trf2-154-2025",
  "sigla": "TRF2",
  "cargo": "Juiz Federal Substituto",
  "orgao": "Tribunal Regional Federal da 2ª Região",
  "titulo": "XIX Concurso para Juiz Federal Substituto da 2ª Região",
  "edital": "Edital TRF2 nº 154/2025",
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
    "administrativo",
    "Lei nº 11.079/2004"
   ],
   [
    "administrativo",
    "Lei nº 13.019/2014"
   ],
   [
    "administrativo",
    "Lei nº 13.848/2019"
   ],
   [
    "administrativo",
    "Lei nº 14.133/2021"
   ],
   [
    "administrativo",
    "Lei nº 14.230/2021"
   ],
   [
    "administrativo",
    "Lei nº 4.878/1965"
   ],
   [
    "administrativo",
    "Lei nº 8.112/1990"
   ],
   [
    "administrativo",
    "Lei nº 8.429/1992"
   ],
   [
    "administrativo",
    "Lei nº 8.987/1995"
   ],
   [
    "administrativo",
    "Lei nº 9.637/1998"
   ],
   [
    "administrativo",
    "Lei nº 9.784/1999"
   ],
   [
    "administrativo",
    "Lei nº 9.790/1999"
   ],
   [
    "ambiental",
    "Decreto nº 10.936/2022"
   ],
   [
    "ambiental",
    "Decreto nº 56.826/1965"
   ],
   [
    "ambiental",
    "Decreto nº 99.274/1990"
   ],
   [
    "ambiental",
    "Lei Complementar nº 140/2011"
   ],
   [
    "ambiental",
    "Lei nº 11.124/2005"
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
    "Lei nº 12.334/2010"
   ],
   [
    "ambiental",
    "Lei nº 12.587/2012"
   ],
   [
    "ambiental",
    "Lei nº 12.608/2012"
   ],
   [
    "ambiental",
    "Lei nº 14.755/2023"
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
    "Lei nº 6.938/1981"
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
    "Lei nº 9.985/2000"
   ],
   [
    "ambiental",
    "Medida Provisória nº 1.308/2025"
   ],
   [
    "civil",
    "Decreto nº 20.910/1932"
   ],
   [
    "civil",
    "Decreto nº 3.413/2000"
   ],
   [
    "civil",
    "Decreto-Lei nº 4.657/1942"
   ],
   [
    "civil",
    "Decreto-Lei nº 911/1969"
   ],
   [
    "civil",
    "Lei nº 12.376/2010"
   ],
   [
    "civil",
    "Lei nº 14.010/2020"
   ],
   [
    "civil",
    "Lei nº 14.382/2022"
   ],
   [
    "civil",
    "Lei nº 4.380/1964"
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
    "Lei nº 8.971/1994"
   ],
   [
    "civil",
    "Lei nº 9.278/1996"
   ],
   [
    "civil",
    "Lei nº 9.514/1997"
   ],
   [
    "constitucional",
    "Emenda Constitucional nº 80/2014"
   ],
   [
    "empresarial",
    "Decreto nº 2.044/1908"
   ],
   [
    "empresarial",
    "Lei nº 11.101/2005"
   ],
   [
    "empresarial",
    "Lei nº 14.112/2020"
   ],
   [
    "empresarial",
    "Lei nº 14.193/2021"
   ],
   [
    "empresarial",
    "Lei nº 4.886/1965"
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
    "humanos",
    "Decreto nº 10.932/2022"
   ],
   [
    "humanos",
    "Decreto nº 3.956/2001"
   ],
   [
    "humanos",
    "Decreto nº 592/1992"
   ],
   [
    "humanos",
    "Decreto nº 678/1992"
   ],
   [
    "humanos",
    "Decreto nº 7.037/2009"
   ],
   [
    "humanos",
    "Decreto nº 9.571/2018"
   ],
   [
    "penal",
    "Decreto nº 5.015/2004"
   ],
   [
    "penal",
    "Decreto nº 5.687/2006"
   ],
   [
    "penal",
    "Decreto-Lei nº 2.848/1940"
   ],
   [
    "penal",
    "Lei nº 1.521/1951"
   ],
   [
    "penal",
    "Lei nº 12.850/2013"
   ],
   [
    "penal",
    "Lei nº 14.322/2022"
   ],
   [
    "penal",
    "Lei nº 7.210/1984"
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
    "Lei nº 8.176/1991"
   ],
   [
    "penal",
    "Lei nº 9.605/1998"
   ],
   [
    "previdenciario",
    "Decreto nº 3.048/1999"
   ],
   [
    "previdenciario",
    "Lei nº 12.435/2011"
   ],
   [
    "previdenciario",
    "Lei nº 13.876/2019"
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
    "Lei nº 8.742/1993"
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
    "processual_civil",
    "Lei nº 9.099/1995"
   ],
   [
    "processual_civil",
    "Lei nº 9.494/1997"
   ],
   [
    "processual_penal",
    "Decreto-Lei nº 1.002/1969"
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
    "Lei nº 12.037/2009"
   ],
   [
    "processual_penal",
    "Lei nº 12.313/2010"
   ],
   [
    "processual_penal",
    "Lei nº 12.830/2013"
   ],
   [
    "processual_penal",
    "Lei nº 12.850/2013"
   ],
   [
    "processual_penal",
    "Lei nº 7.210/1984"
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
    "Lei nº 9.807/1999"
   ],
   [
    "tributario",
    "Decreto nº 70.235/1972"
   ],
   [
    "tributario",
    "Lei Complementar nº 101/2000"
   ],
   [
    "tributario",
    "Lei Complementar nº 118/2005"
   ],
   [
    "tributario",
    "Lei nº 10.169/2000"
   ],
   [
    "tributario",
    "Lei nº 5.172/1966"
   ],
   [
    "tributario",
    "Lei nº 6.830/1980"
   ],
   [
    "tributario",
    "Lei nº 8.134/1990"
   ],
   [
    "tributario",
    "Lei nº 8.397/1992"
   ]
  ],
  "tipo": "edital"
 },
 {
  "id": "tjms-2023",
  "sigla": "TJMS",
  "cargo": "Juiz Substituto",
  "orgao": "Tribunal de Justiça do Estado de Mato Grosso do Sul",
  "titulo": "33º Concurso Público para Juiz Substituto",
  "edital": "Edital nº 01/2023 de Abertura",
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
    "administrativo",
    "Decreto nº 6.017/2007"
   ],
   [
    "administrativo",
    "Decreto nº 7.746/2012"
   ],
   [
    "administrativo",
    "Decreto-Lei nº 3.365/1941"
   ],
   [
    "administrativo",
    "Decreto-Lei nº 4.597/1942"
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
    "Lei Complementar nº 75/1993"
   ],
   [
    "administrativo",
    "Lei Estadual (MS) nº 1.102/1990"
   ],
   [
    "administrativo",
    "Lei Estadual (MS) nº 2.207/2000"
   ],
   [
    "administrativo",
    "Lei nº 11.079/2004"
   ],
   [
    "administrativo",
    "Lei nº 12.462/2011"
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
    "Lei nº 13.019/2014"
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
    "Lei nº 4.878/1965"
   ],
   [
    "administrativo",
    "Lei nº 8.080/1990"
   ],
   [
    "administrativo",
    "Lei nº 8.112/1990"
   ],
   [
    "administrativo",
    "Lei nº 8.429/1992"
   ],
   [
    "administrativo",
    "Lei nº 8.625/1993"
   ],
   [
    "administrativo",
    "Lei nº 8.987/1995"
   ],
   [
    "administrativo",
    "Lei nº 9.394/1996"
   ],
   [
    "administrativo",
    "Lei nº 9.637/1998"
   ],
   [
    "administrativo",
    "Lei nº 9.784/1999"
   ],
   [
    "administrativo",
    "Lei nº 9.790/1999"
   ],
   [
    "ambiental",
    "Decreto nº 10.936/2022"
   ],
   [
    "ambiental",
    "Decreto nº 6.514/2008"
   ],
   [
    "ambiental",
    "Decreto nº 7.217/2010"
   ],
   [
    "ambiental",
    "Decreto nº 99.274/1990"
   ],
   [
    "ambiental",
    "Lei Complementar nº 140/2011"
   ],
   [
    "ambiental",
    "Lei Estadual (MS) nº 2.257/2001"
   ],
   [
    "ambiental",
    "Lei Estadual (MS) nº 2.406/2002"
   ],
   [
    "ambiental",
    "Lei Estadual (MS) nº 4.555/2014"
   ],
   [
    "ambiental",
    "Lei Estadual (MS) nº 5.235/2018"
   ],
   [
    "ambiental",
    "Lei nº 10.257/2001"
   ],
   [
    "ambiental",
    "Lei nº 11.124/2005"
   ],
   [
    "ambiental",
    "Lei nº 11.428/2006"
   ],
   [
    "ambiental",
    "Lei nº 11.445/2007"
   ],
   [
    "ambiental",
    "Lei nº 11.952/2009"
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
    "Lei nº 12.334/2010"
   ],
   [
    "ambiental",
    "Lei nº 12.587/2012"
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
    "Lei nº 14.026/2020"
   ],
   [
    "ambiental",
    "Lei nº 14.119/2021"
   ],
   [
    "ambiental",
    "Lei nº 14.755/2023"
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
    "Lei nº 6.938/1981"
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
    "Lei nº 9.985/2000"
   ],
   [
    "ambiental",
    "Medida Provisória nº 1.308/2025"
   ],
   [
    "civil",
    "Decreto nº 20.910/1932"
   ],
   [
    "civil",
    "Decreto nº 57.663/1966"
   ],
   [
    "civil",
    "Decreto-Lei nº 4.657/1942"
   ],
   [
    "civil",
    "Decreto-Lei nº 911/1969"
   ],
   [
    "civil",
    "Lei nº 1.060/1950"
   ],
   [
    "civil",
    "Lei nº 10.406/2002"
   ],
   [
    "civil",
    "Lei nº 10.741/2003"
   ],
   [
    "civil",
    "Lei nº 10.931/2004"
   ],
   [
    "civil",
    "Lei nº 11.076/2004"
   ],
   [
    "civil",
    "Lei nº 11.804/2008"
   ],
   [
    "civil",
    "Lei nº 12.376/2010"
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
    "Lei nº 13.874/2019"
   ],
   [
    "civil",
    "Lei nº 14.010/2020"
   ],
   [
    "civil",
    "Lei nº 14.382/2022"
   ],
   [
    "civil",
    "Lei nº 14.905/2024"
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
    "Lei nº 6.015/1973"
   ],
   [
    "civil",
    "Lei nº 6.515/1977"
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
    "civil",
    "Lei nº 8.560/1992"
   ],
   [
    "civil",
    "Lei nº 8.935/1994"
   ],
   [
    "civil",
    "Lei nº 8.971/1994"
   ],
   [
    "civil",
    "Lei nº 9.278/1996"
   ],
   [
    "civil",
    "Lei nº 9.492/1997"
   ],
   [
    "civil",
    "Lei nº 9.514/1997"
   ],
   [
    "civil",
    "Resolução CNJ nº 452/2022"
   ],
   [
    "constitucional",
    "Emenda Constitucional nº 45/2004"
   ],
   [
    "constitucional",
    "Emenda Constitucional nº 80/2014"
   ],
   [
    "consumidor",
    "Decreto nº 2.181/1997"
   ],
   [
    "consumidor",
    "Lei nº 8.078/1990"
   ],
   [
    "crianca",
    "Decreto nº 9.603/2018"
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
    "eleitoral",
    "Lei Complementar nº 64/1990"
   ],
   [
    "eleitoral",
    "Lei Complementar nº 86/1996"
   ],
   [
    "eleitoral",
    "Lei nº 6.091/1974"
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
    "Decreto nº 2.044/1908"
   ],
   [
    "empresarial",
    "Decreto-Lei nº 167/1967"
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
    "Lei nº 14.112/2020"
   ],
   [
    "empresarial",
    "Lei nº 14.193/2021"
   ],
   [
    "empresarial",
    "Lei nº 5.474/1968"
   ],
   [
    "empresarial",
    "Lei nº 6.024/1974"
   ],
   [
    "empresarial",
    "Lei nº 6.404/1976"
   ],
   [
    "empresarial",
    "Lei nº 6.840/1980"
   ],
   [
    "empresarial",
    "Lei nº 7.357/1985"
   ],
   [
    "empresarial",
    "Lei nº 7.913/1989"
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
    "humanos",
    "Decreto nº 592/1992"
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
    "Lei nº 10.098/2000"
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
    "penal",
    "Decreto-Lei nº 2.848/1940"
   ],
   [
    "penal",
    "Decreto-Lei nº 3.688/1941"
   ],
   [
    "penal",
    "Lei nº 1.521/1951"
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
    "Lei nº 14.322/2022"
   ],
   [
    "penal",
    "Lei nº 7.210/1984"
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
    "Lei nº 8.176/1991"
   ],
   [
    "penal",
    "Lei nº 8.429/1992"
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
    "Lei nº 9.613/1998"
   ],
   [
    "previdenciario",
    "Lei nº 12.435/2011"
   ],
   [
    "previdenciario",
    "Lei nº 8.742/1993"
   ],
   [
    "processual_civil",
    "Lei nº 10.259/2001"
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
    "processual_civil",
    "Lei nº 12.016/2009"
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
    "Lei nº 8.437/1992"
   ],
   [
    "processual_civil",
    "Lei nº 9.099/1995"
   ],
   [
    "processual_civil",
    "Lei nº 9.494/1997"
   ],
   [
    "processual_civil",
    "Lei nº 9.507/1997"
   ],
   [
    "processual_penal",
    "Decreto-Lei nº 1.002/1969"
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
    "Lei nº 12.313/2010"
   ],
   [
    "processual_penal",
    "Lei nº 12.850/2013"
   ],
   [
    "processual_penal",
    "Lei nº 13.431/2017"
   ],
   [
    "processual_penal",
    "Lei nº 5.249/1967"
   ],
   [
    "processual_penal",
    "Lei nº 7.210/1984"
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
    "tributario",
    "Decreto nº 70.235/1972"
   ],
   [
    "tributario",
    "Lei Complementar nº 101/2000"
   ],
   [
    "tributario",
    "Lei Complementar nº 118/2005"
   ],
   [
    "tributario",
    "Lei nº 10.169/2000"
   ],
   [
    "tributario",
    "Lei nº 5.172/1966"
   ],
   [
    "tributario",
    "Lei nº 6.830/1980"
   ],
   [
    "tributario",
    "Lei nº 8.397/1992"
   ]
  ],
  "tipo": "edital"
 },
 {
  "id": "tjba-2026",
  "sigla": "TJBA",
  "cargo": "Juiz Substituto",
  "orgao": "Tribunal de Justiça do Estado da Bahia",
  "titulo": "Concurso Público para Juiz Substituto",
  "edital": "Edital nº 01/2026 (retificado)",
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
    "administrativo",
    "Decreto nº 6.017/2007"
   ],
   [
    "administrativo",
    "Decreto nº 7.746/2012"
   ],
   [
    "administrativo",
    "Decreto-Lei nº 3.365/1941"
   ],
   [
    "administrativo",
    "Decreto-Lei nº 4.597/1942"
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
    "Lei Complementar nº 75/1993"
   ],
   [
    "administrativo",
    "Lei Estadual (BA) nº 11.357/2009"
   ],
   [
    "administrativo",
    "Lei Estadual (BA) nº 6.677/1994"
   ],
   [
    "administrativo",
    "Lei nº 11.079/2004"
   ],
   [
    "administrativo",
    "Lei nº 12.462/2011"
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
    "Lei nº 13.019/2014"
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
    "Lei nº 14.133/2021"
   ],
   [
    "administrativo",
    "Lei nº 14.230/2021"
   ],
   [
    "administrativo",
    "Lei nº 4.320/1964"
   ],
   [
    "administrativo",
    "Lei nº 4.878/1965"
   ],
   [
    "administrativo",
    "Lei nº 8.112/1990"
   ],
   [
    "administrativo",
    "Lei nº 8.429/1992"
   ],
   [
    "administrativo",
    "Lei nº 8.625/1993"
   ],
   [
    "administrativo",
    "Lei nº 8.987/1995"
   ],
   [
    "administrativo",
    "Lei nº 9.637/1998"
   ],
   [
    "administrativo",
    "Lei nº 9.784/1999"
   ],
   [
    "administrativo",
    "Lei nº 9.790/1999"
   ],
   [
    "ambiental",
    "Decreto nº 10.936/2022"
   ],
   [
    "ambiental",
    "Decreto nº 6.514/2008"
   ],
   [
    "ambiental",
    "Decreto nº 7.217/2010"
   ],
   [
    "ambiental",
    "Decreto nº 99.274/1990"
   ],
   [
    "ambiental",
    "Lei Complementar nº 140/2011"
   ],
   [
    "ambiental",
    "Lei nº 10.257/2001"
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
    "Lei nº 11.124/2005"
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
    "Lei nº 11.445/2007"
   ],
   [
    "ambiental",
    "Lei nº 11.952/2009"
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
    "Lei nº 12.334/2010"
   ],
   [
    "ambiental",
    "Lei nº 12.587/2012"
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
    "Lei nº 13.123/2015"
   ],
   [
    "ambiental",
    "Lei nº 14.026/2020"
   ],
   [
    "ambiental",
    "Lei nº 14.119/2021"
   ],
   [
    "ambiental",
    "Lei nº 14.755/2023"
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
    "Lei nº 6.938/1981"
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
    "Medida Provisória nº 1.308/2025"
   ],
   [
    "civil",
    "Decreto nº 20.910/1932"
   ],
   [
    "civil",
    "Decreto nº 22.626/1933"
   ],
   [
    "civil",
    "Decreto nº 57.663/1966"
   ],
   [
    "civil",
    "Decreto-Lei nº 4.657/1942"
   ],
   [
    "civil",
    "Decreto-Lei nº 911/1969"
   ],
   [
    "civil",
    "Lei nº 1.060/1950"
   ],
   [
    "civil",
    "Lei nº 10.406/2002"
   ],
   [
    "civil",
    "Lei nº 10.741/2003"
   ],
   [
    "civil",
    "Lei nº 10.931/2004"
   ],
   [
    "civil",
    "Lei nº 11.076/2004"
   ],
   [
    "civil",
    "Lei nº 11.804/2008"
   ],
   [
    "civil",
    "Lei nº 12.376/2010"
   ],
   [
    "civil",
    "Lei nº 12.764/2012"
   ],
   [
    "civil",
    "Lei nº 12.965/2014"
   ],
   [
    "civil",
    "Lei nº 13.058/2014"
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
    "Lei nº 13.874/2019"
   ],
   [
    "civil",
    "Lei nº 14.010/2020"
   ],
   [
    "civil",
    "Lei nº 14.382/2022"
   ],
   [
    "civil",
    "Lei nº 14.905/2024"
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
    "Lei nº 6.015/1973"
   ],
   [
    "civil",
    "Lei nº 6.515/1977"
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
    "Lei nº 8.245/1991"
   ],
   [
    "civil",
    "Lei nº 8.560/1992"
   ],
   [
    "civil",
    "Lei nº 8.935/1994"
   ],
   [
    "civil",
    "Lei nº 8.971/1994"
   ],
   [
    "civil",
    "Lei nº 9.278/1996"
   ],
   [
    "civil",
    "Lei nº 9.492/1997"
   ],
   [
    "civil",
    "Lei nº 9.514/1997"
   ],
   [
    "civil",
    "Resolução CNJ nº 452/2022"
   ],
   [
    "constitucional",
    "CF/1988"
   ],
   [
    "consumidor",
    "Decreto nº 2.181/1997"
   ],
   [
    "consumidor",
    "Decreto nº 7.962/2013"
   ],
   [
    "consumidor",
    "Decreto nº 9.936/2019"
   ],
   [
    "consumidor",
    "Lei Complementar nº 166/2019"
   ],
   [
    "consumidor",
    "Lei nº 12.414/2011"
   ],
   [
    "consumidor",
    "Lei nº 14.538/2023"
   ],
   [
    "consumidor",
    "Lei nº 8.078/1990"
   ],
   [
    "consumidor",
    "Lei nº 9.656/1998"
   ],
   [
    "consumidor",
    "Resolução ANATEL nº 765/2023"
   ],
   [
    "consumidor",
    "Resolução Normativa ANEEL nº 1.000/2021"
   ],
   [
    "crianca",
    "Decreto nº 9.603/2018"
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
    "Lei nº 13.257/2016"
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
    "Resolução CNJ nº 295/2019"
   ],
   [
    "eleitoral",
    "Lei Complementar nº 64/1990"
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
    "Lei nº 9.096/1995"
   ],
   [
    "eleitoral",
    "Lei nº 9.504/1997"
   ],
   [
    "empresarial",
    "Decreto nº 2.044/1908"
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
    "Lei nº 14.112/2020"
   ],
   [
    "empresarial",
    "Lei nº 14.193/2021"
   ],
   [
    "empresarial",
    "Lei nº 6.840/1980"
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
    "humanos",
    "Decreto nº 678/1992"
   ],
   [
    "humanos",
    "Decreto nº 7.037/2009"
   ],
   [
    "humanos",
    "Decreto nº 9.571/2018"
   ],
   [
    "humanos",
    "Lei nº 7.716/1989"
   ],
   [
    "penal",
    "Decreto-Lei nº 201/1967"
   ],
   [
    "penal",
    "Decreto-Lei nº 3.688/1941"
   ],
   [
    "penal",
    "Lei nº 1.521/1951"
   ],
   [
    "civil",
    "Lei nº 10.741/2003"
   ],
   [
    "penal",
    "Lei nº 10.826/2003"
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
    "Lei nº 13.869/2019"
   ],
   [
    "penal",
    "Lei nº 13.964/2019"
   ],
   [
    "penal",
    "Lei nº 14.597/2023"
   ],
   [
    "penal",
    "Lei nº 4.898/1965"
   ],
   [
    "penal",
    "Lei nº 6.001/1973"
   ],
   [
    "penal",
    "Lei nº 7.210/1984"
   ],
   [
    "penal",
    "Lei nº 7.492/1986"
   ],
   [
    "penal",
    "Lei nº 7.716/1989"
   ],
   [
    "penal",
    "Lei nº 8.072/1990"
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
    "Lei nº 9.029/1995"
   ],
   [
    "penal",
    "Lei nº 9.263/1996"
   ],
   [
    "penal",
    "Lei nº 9.434/1997"
   ],
   [
    "penal",
    "Lei nº 9.455/1997"
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
    "Lei nº 9.613/1998"
   ],
   [
    "previdenciario",
    "Lei nº 12.435/2011"
   ],
   [
    "previdenciario",
    "Lei nº 8.742/1993"
   ],
   [
    "processual_civil",
    "Lei nº 10.259/2001"
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
    "processual_civil",
    "Lei nº 12.016/2009"
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
    "processual_civil",
    "Lei nº 13.129/2015"
   ],
   [
    "processual_civil",
    "Lei nº 13.140/2015"
   ],
   [
    "processual_civil",
    "Lei nº 13.655/2018"
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
    "Lei nº 8.437/1992"
   ],
   [
    "processual_civil",
    "Lei nº 9.099/1995"
   ],
   [
    "processual_civil",
    "Lei nº 9.307/1996"
   ],
   [
    "processual_civil",
    "Lei nº 9.494/1997"
   ],
   [
    "processual_civil",
    "Lei nº 9.507/1997"
   ],
   [
    "processual_penal",
    "Decreto-Lei nº 1.002/1969"
   ],
   [
    "processual_penal",
    "Decreto-Lei nº 201/1967"
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
    "Lei nº 4.737/1965"
   ],
   [
    "processual_penal",
    "Lei nº 7.210/1984"
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
    "tributario",
    "Lei Complementar nº 101/2000"
   ],
   [
    "tributario",
    "Lei Complementar nº 118/2005"
   ],
   [
    "tributario",
    "Lei nº 10.169/2000"
   ],
   [
    "tributario",
    "Lei nº 5.172/1966"
   ],
   [
    "tributario",
    "Lei nº 6.830/1980"
   ],
   [
    "tributario",
    "Lei nº 8.397/1992"
   ]
  ],
  "tipo": "edital"
 },
 {
  "id": "csjt-magistratura-trabalho-2023",
  "sigla": "CSJT",
  "cargo": "Juiz do Trabalho Substituto",
  "orgao": "Conselho Superior da Justiça do Trabalho",
  "titulo": "II Concurso Público Nacional Unificado para a Magistratura do Trabalho",
  "edital": "Edital de Abertura nº 1/2023 (íntegra após a 7ª retificação, 17/1/2024)",
  "grupos": [
   {
    "nome": "Bloco I",
    "disciplinas": [
     "Direito Individual do Trabalho",
     "Direito Coletivo do Trabalho",
     "Direito Administrativo",
     "Direito Penal",
     "Noções Gerais de Direito e Formação Humanística"
    ]
   },
   {
    "nome": "Bloco II",
    "disciplinas": [
     "Direito Processual do Trabalho",
     "Direito Constitucional",
     "Direito Constitucional do Trabalho",
     "Direito Civil",
     "Direito da Criança, do Adolescente e do Jovem"
    ]
   },
   {
    "nome": "Bloco III",
    "disciplinas": [
     "Direito Processual Civil",
     "Direito Internacional e Comunitário",
     "Direito Previdenciário",
     "Direito Empresarial",
     "Direitos Humanos e Direitos Humanos Sociais"
    ]
   }
  ],
  "leis": [
   [
    "administrativo",
    "Decreto nº 1.171/1994"
   ],
   [
    "administrativo",
    "Lei Complementar nº 75/1993"
   ],
   [
    "administrativo",
    "Lei nº 13.460/2017"
   ],
   [
    "administrativo",
    "Lei nº 13.848/2019"
   ],
   [
    "administrativo",
    "Lei nº 14.133/2021"
   ],
   [
    "administrativo",
    "Lei nº 14.230/2021"
   ],
   [
    "administrativo",
    "Lei nº 4.878/1965"
   ],
   [
    "administrativo",
    "Lei nº 8.112/1990"
   ],
   [
    "administrativo",
    "Lei nº 8.429/1992"
   ],
   [
    "administrativo",
    "Lei nº 8.987/1995"
   ],
   [
    "administrativo",
    "Lei nº 9.784/1999"
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
    "Lei nº 12.376/2010"
   ],
   [
    "civil",
    "Lei nº 13.146/2015"
   ],
   [
    "crianca",
    "Lei nº 8.069/1990"
   ],
   [
    "empresarial",
    "Lei nº 11.101/2005"
   ],
   [
    "empresarial",
    "Lei nº 14.112/2020"
   ],
   [
    "empresarial",
    "Lei nº 14.193/2021"
   ],
   [
    "empresarial",
    "Lei nº 4.886/1965"
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
    "humanos",
    "Decreto nº 10.932/2022"
   ],
   [
    "humanos",
    "Decreto nº 3.956/2001"
   ],
   [
    "humanos",
    "Decreto nº 678/1992"
   ],
   [
    "humanos",
    "Decreto nº 7.037/2009"
   ],
   [
    "humanos",
    "Decreto nº 9.571/2018"
   ],
   [
    "humanos",
    "Lei nº 12.288/2010"
   ],
   [
    "humanos",
    "Lei nº 12.852/2013"
   ],
   [
    "humanos",
    "Lei nº 7.716/1989"
   ],
   [
    "humanos",
    "Resolução A/RES/61/295 (ONU, 2007)"
   ],
   [
    "penal",
    "Lei nº 1.521/1951"
   ],
   [
    "penal",
    "Lei nº 11.340/2006"
   ],
   [
    "penal",
    "Lei nº 12.984/2014"
   ],
   [
    "penal",
    "Lei nº 7.492/1986"
   ],
   [
    "penal",
    "Lei nº 7.716/1989"
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
    "Lei nº 9.029/1995"
   ],
   [
    "penal",
    "Lei nº 9.605/1998"
   ],
   [
    "previdenciario",
    "Decreto nº 3.048/1999"
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
    "processual_civil",
    "Lei nº 11.419/2006"
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
    "processual_civil",
    "Lei nº 9.494/1997"
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
    "trabalhista",
    "Lei nº 10.035/2000"
   ],
   [
    "trabalhista",
    "Lei nº 13.475/2017"
   ]
  ],
  "tipo": "edital"
 },
 {
  "id": "tjsc-11-2025",
  "sigla": "TJSC",
  "cargo": "Juiz Substituto",
  "orgao": "Tribunal de Justiça do Estado de Santa Catarina",
  "titulo": "Concurso Público para Juiz Substituto",
  "edital": "Edital N. 11/2025 (edital de abertura, 1ª retificação)",
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
    "administrativo",
    "Decreto nº 6.017/2007"
   ],
   [
    "administrativo",
    "Decreto nº 7.746/2012"
   ],
   [
    "administrativo",
    "Decreto-Lei nº 3.365/1941"
   ],
   [
    "administrativo",
    "Decreto-Lei nº 4.597/1942"
   ],
   [
    "administrativo",
    "Lei Complementar (SC) nº 491/2010"
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
    "Lei Complementar nº 75/1993"
   ],
   [
    "administrativo",
    "Lei Estadual (SC) nº 6.745/1985"
   ],
   [
    "administrativo",
    "Lei nº 11.079/2004"
   ],
   [
    "administrativo",
    "Lei nº 12.462/2011"
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
    "Lei nº 13.019/2014"
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
    "Lei nº 14.133/2021"
   ],
   [
    "administrativo",
    "Lei nº 14.230/2021"
   ],
   [
    "administrativo",
    "Lei nº 4.878/1965"
   ],
   [
    "administrativo",
    "Lei nº 8.112/1990"
   ],
   [
    "administrativo",
    "Lei nº 8.429/1992"
   ],
   [
    "administrativo",
    "Lei nº 8.625/1993"
   ],
   [
    "administrativo",
    "Lei nº 8.987/1995"
   ],
   [
    "administrativo",
    "Lei nº 9.637/1998"
   ],
   [
    "administrativo",
    "Lei nº 9.784/1999"
   ],
   [
    "administrativo",
    "Lei nº 9.790/1999"
   ],
   [
    "ambiental",
    "Decreto nº 10.936/2022"
   ],
   [
    "ambiental",
    "Decreto nº 6.514/2008"
   ],
   [
    "ambiental",
    "Decreto nº 7.217/2010"
   ],
   [
    "ambiental",
    "Decreto nº 99.274/1990"
   ],
   [
    "ambiental",
    "Lei Complementar nº 140/2011"
   ],
   [
    "ambiental",
    "Lei Estadual (SC) nº 14.675/2009"
   ],
   [
    "ambiental",
    "Lei Estadual (SC) nº 16.342/2014"
   ],
   [
    "ambiental",
    "Lei nº 10.257/2001"
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
    "Lei nº 11.124/2005"
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
    "Lei nº 11.445/2007"
   ],
   [
    "ambiental",
    "Lei nº 11.952/2009"
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
    "Lei nº 12.334/2010"
   ],
   [
    "ambiental",
    "Lei nº 12.587/2012"
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
    "Lei nº 13.123/2015"
   ],
   [
    "ambiental",
    "Lei nº 14.026/2020"
   ],
   [
    "ambiental",
    "Lei nº 14.119/2021"
   ],
   [
    "ambiental",
    "Lei nº 14.755/2023"
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
    "Lei nº 6.938/1981"
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
    "Medida Provisória nº 1.308/2025"
   ],
   [
    "civil",
    "Decreto nº 20.910/1932"
   ],
   [
    "civil",
    "Decreto nº 22.626/1933"
   ],
   [
    "civil",
    "Decreto nº 57.663/1966"
   ],
   [
    "civil",
    "Decreto-Lei nº 4.657/1942"
   ],
   [
    "civil",
    "Decreto-Lei nº 911/1969"
   ],
   [
    "civil",
    "Lei Estadual (SC) nº 17.492/2018"
   ],
   [
    "civil",
    "Lei nº 1.060/1950"
   ],
   [
    "civil",
    "Lei nº 10.406/2002"
   ],
   [
    "civil",
    "Lei nº 10.931/2004"
   ],
   [
    "civil",
    "Lei nº 11.076/2004"
   ],
   [
    "civil",
    "Lei nº 11.804/2008"
   ],
   [
    "civil",
    "Lei nº 12.376/2010"
   ],
   [
    "civil",
    "Lei nº 12.764/2012"
   ],
   [
    "civil",
    "Lei nº 12.965/2014"
   ],
   [
    "civil",
    "Lei nº 13.058/2014"
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
    "Lei nº 13.874/2019"
   ],
   [
    "civil",
    "Lei nº 14.010/2020"
   ],
   [
    "civil",
    "Lei nº 14.382/2022"
   ],
   [
    "civil",
    "Lei nº 14.905/2024"
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
    "Lei nº 6.015/1973"
   ],
   [
    "civil",
    "Lei nº 6.515/1977"
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
    "Lei nº 8.245/1991"
   ],
   [
    "civil",
    "Lei nº 8.560/1992"
   ],
   [
    "civil",
    "Lei nº 8.935/1994"
   ],
   [
    "civil",
    "Lei nº 8.971/1994"
   ],
   [
    "civil",
    "Lei nº 9.278/1996"
   ],
   [
    "civil",
    "Lei nº 9.492/1997"
   ],
   [
    "civil",
    "Lei nº 9.514/1997"
   ],
   [
    "civil",
    "Resolução CNJ nº 452/2022"
   ],
   [
    "constitucional",
    "CF/1988"
   ],
   [
    "consumidor",
    "Decreto nº 2.181/1997"
   ],
   [
    "consumidor",
    "Decreto nº 7.962/2013"
   ],
   [
    "consumidor",
    "Decreto nº 9.936/2019"
   ],
   [
    "consumidor",
    "Lei Complementar nº 166/2019"
   ],
   [
    "consumidor",
    "Lei nº 12.414/2011"
   ],
   [
    "consumidor",
    "Lei nº 14.538/2023"
   ],
   [
    "consumidor",
    "Lei nº 8.078/1990"
   ],
   [
    "consumidor",
    "Lei nº 9.656/1998"
   ],
   [
    "consumidor",
    "Resolução ANATEL nº 765/2023"
   ],
   [
    "consumidor",
    "Resolução Normativa ANEEL nº 1.000/2021"
   ],
   [
    "crianca",
    "Decreto nº 9.603/2018"
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
    "Lei nº 13.257/2016"
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
    "eleitoral",
    "Lei Complementar nº 64/1990"
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
    "Lei nº 9.096/1995"
   ],
   [
    "eleitoral",
    "Lei nº 9.504/1997"
   ],
   [
    "empresarial",
    "Decreto nº 2.044/1908"
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
    "Lei nº 14.112/2020"
   ],
   [
    "empresarial",
    "Lei nº 14.193/2021"
   ],
   [
    "empresarial",
    "Lei nº 6.840/1980"
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
    "humanos",
    "Decreto nº 678/1992"
   ],
   [
    "humanos",
    "Decreto nº 7.037/2009"
   ],
   [
    "humanos",
    "Decreto nº 9.571/2018"
   ],
   [
    "humanos",
    "Lei nº 7.716/1989"
   ],
   [
    "penal",
    "Decreto-Lei nº 201/1967"
   ],
   [
    "penal",
    "Decreto-Lei nº 3.688/1941"
   ],
   [
    "penal",
    "Lei nº 1.521/1951"
   ],
   [
    "civil",
    "Lei nº 10.741/2003"
   ],
   [
    "penal",
    "Lei nº 10.826/2003"
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
    "Lei nº 13.869/2019"
   ],
   [
    "penal",
    "Lei nº 13.964/2019"
   ],
   [
    "penal",
    "Lei nº 14.597/2023"
   ],
   [
    "penal",
    "Lei nº 4.898/1965"
   ],
   [
    "penal",
    "Lei nº 6.001/1973"
   ],
   [
    "penal",
    "Lei nº 7.210/1984"
   ],
   [
    "penal",
    "Lei nº 7.492/1986"
   ],
   [
    "penal",
    "Lei nº 7.716/1989"
   ],
   [
    "penal",
    "Lei nº 8.072/1990"
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
    "Lei nº 9.029/1995"
   ],
   [
    "penal",
    "Lei nº 9.263/1996"
   ],
   [
    "penal",
    "Lei nº 9.434/1997"
   ],
   [
    "penal",
    "Lei nº 9.455/1997"
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
    "Lei nº 9.613/1998"
   ],
   [
    "previdenciario",
    "Lei nº 12.435/2011"
   ],
   [
    "previdenciario",
    "Lei nº 8.742/1993"
   ],
   [
    "processual_civil",
    "Lei Complementar (SC) nº 339/2006"
   ],
   [
    "processual_civil",
    "Lei Complementar (SC) nº 367/2006"
   ],
   [
    "processual_civil",
    "Lei nº 10.259/2001"
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
    "processual_civil",
    "Lei nº 12.016/2009"
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
    "processual_civil",
    "Lei nº 13.129/2015"
   ],
   [
    "processual_civil",
    "Lei nº 13.140/2015"
   ],
   [
    "processual_civil",
    "Lei nº 13.655/2018"
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
    "Lei nº 8.437/1992"
   ],
   [
    "processual_civil",
    "Lei nº 9.099/1995"
   ],
   [
    "processual_civil",
    "Lei nº 9.307/1996"
   ],
   [
    "processual_civil",
    "Lei nº 9.494/1997"
   ],
   [
    "processual_civil",
    "Lei nº 9.507/1997"
   ],
   [
    "processual_penal",
    "Decreto-Lei nº 1.002/1969"
   ],
   [
    "processual_penal",
    "Decreto-Lei nº 201/1967"
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
    "Lei nº 4.737/1965"
   ],
   [
    "processual_penal",
    "Lei nº 7.210/1984"
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
    "tributario",
    "Lei Complementar (SC) nº 465/2009"
   ],
   [
    "tributario",
    "Lei Complementar nº 101/2000"
   ],
   [
    "tributario",
    "Lei Complementar nº 118/2005"
   ],
   [
    "tributario",
    "Lei Estadual (SC) nº 10.297/1996"
   ],
   [
    "tributario",
    "Lei Estadual (SC) nº 13.136/2004"
   ],
   [
    "tributario",
    "Lei Estadual (SC) nº 3.938/1966"
   ],
   [
    "tributario",
    "Lei nº 10.169/2000"
   ],
   [
    "tributario",
    "Lei nº 5.172/1966"
   ],
   [
    "tributario",
    "Lei nº 6.830/1980"
   ],
   [
    "tributario",
    "Lei nº 8.397/1992"
   ]
  ],
  "tipo": "edital"
 },
 {
  "id": "tjse-2024",
  "sigla": "TJSE",
  "cargo": "Juiz Substituto",
  "orgao": "Tribunal de Justiça do Estado de Sergipe",
  "titulo": "Concurso Público para Juiz Substituto",
  "edital": "Edital nº 01/2024 (retificado em 22/01/2025)",
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
    "administrativo",
    "Decreto nº 6.017/2007"
   ],
   [
    "administrativo",
    "Decreto nº 7.746/2012"
   ],
   [
    "administrativo",
    "Decreto-Lei nº 3.365/1941"
   ],
   [
    "administrativo",
    "Decreto-Lei nº 4.597/1942"
   ],
   [
    "administrativo",
    "Lei Complementar (SE) nº 33/1996"
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
    "Lei Complementar nº 75/1993"
   ],
   [
    "administrativo",
    "Lei nº 11.079/2004"
   ],
   [
    "administrativo",
    "Lei nº 12.462/2011"
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
    "Lei nº 13.019/2014"
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
    "Lei nº 14.133/2021"
   ],
   [
    "administrativo",
    "Lei nº 14.230/2021"
   ],
   [
    "administrativo",
    "Lei nº 4.320/1964"
   ],
   [
    "administrativo",
    "Lei nº 4.878/1965"
   ],
   [
    "administrativo",
    "Lei nº 8.112/1990"
   ],
   [
    "administrativo",
    "Lei nº 8.429/1992"
   ],
   [
    "administrativo",
    "Lei nº 8.625/1993"
   ],
   [
    "administrativo",
    "Lei nº 8.666/1993"
   ],
   [
    "administrativo",
    "Lei nº 8.987/1995"
   ],
   [
    "administrativo",
    "Lei nº 9.637/1998"
   ],
   [
    "administrativo",
    "Lei nº 9.784/1999"
   ],
   [
    "administrativo",
    "Lei nº 9.790/1999"
   ],
   [
    "ambiental",
    "Decreto nº 10.936/2022"
   ],
   [
    "ambiental",
    "Decreto nº 6.514/2008"
   ],
   [
    "ambiental",
    "Decreto nº 7.217/2010"
   ],
   [
    "ambiental",
    "Decreto nº 99.274/1990"
   ],
   [
    "ambiental",
    "Lei Complementar nº 140/2011"
   ],
   [
    "ambiental",
    "Lei nº 10.257/2001"
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
    "Lei nº 11.124/2005"
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
    "Lei nº 11.445/2007"
   ],
   [
    "ambiental",
    "Lei nº 11.952/2009"
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
    "Lei nº 12.334/2010"
   ],
   [
    "ambiental",
    "Lei nº 12.587/2012"
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
    "Lei nº 13.123/2015"
   ],
   [
    "ambiental",
    "Lei nº 14.026/2020"
   ],
   [
    "ambiental",
    "Lei nº 14.119/2021"
   ],
   [
    "ambiental",
    "Lei nº 14.755/2023"
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
    "Lei nº 6.938/1981"
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
    "Medida Provisória nº 1.308/2025"
   ],
   [
    "civil",
    "Decreto nº 20.910/1932"
   ],
   [
    "civil",
    "Decreto nº 22.626/1933"
   ],
   [
    "civil",
    "Decreto nº 57.663/1966"
   ],
   [
    "civil",
    "Decreto-Lei nº 4.657/1942"
   ],
   [
    "civil",
    "Decreto-Lei nº 911/1969"
   ],
   [
    "civil",
    "Lei nº 1.060/1950"
   ],
   [
    "civil",
    "Lei nº 10.406/2002"
   ],
   [
    "civil",
    "Lei nº 10.741/2003"
   ],
   [
    "civil",
    "Lei nº 10.931/2004"
   ],
   [
    "civil",
    "Lei nº 11.076/2004"
   ],
   [
    "civil",
    "Lei nº 11.804/2008"
   ],
   [
    "civil",
    "Lei nº 12.376/2010"
   ],
   [
    "civil",
    "Lei nº 12.764/2012"
   ],
   [
    "civil",
    "Lei nº 12.965/2014"
   ],
   [
    "civil",
    "Lei nº 13.058/2014"
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
    "Lei nº 13.874/2019"
   ],
   [
    "civil",
    "Lei nº 14.010/2020"
   ],
   [
    "civil",
    "Lei nº 14.382/2022"
   ],
   [
    "civil",
    "Lei nº 14.905/2024"
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
    "Lei nº 6.015/1973"
   ],
   [
    "civil",
    "Lei nº 6.515/1977"
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
    "Lei nº 8.245/1991"
   ],
   [
    "civil",
    "Lei nº 8.560/1992"
   ],
   [
    "civil",
    "Lei nº 8.935/1994"
   ],
   [
    "civil",
    "Lei nº 8.971/1994"
   ],
   [
    "civil",
    "Lei nº 9.278/1996"
   ],
   [
    "civil",
    "Lei nº 9.492/1997"
   ],
   [
    "civil",
    "Lei nº 9.514/1997"
   ],
   [
    "civil",
    "Resolução CNJ nº 452/2022"
   ],
   [
    "constitucional",
    "CF/1988"
   ],
   [
    "consumidor",
    "Decreto nº 2.181/1997"
   ],
   [
    "consumidor",
    "Decreto nº 7.962/2013"
   ],
   [
    "consumidor",
    "Decreto nº 9.936/2019"
   ],
   [
    "consumidor",
    "Lei Complementar nº 166/2019"
   ],
   [
    "consumidor",
    "Lei nº 12.414/2011"
   ],
   [
    "consumidor",
    "Lei nº 14.538/2023"
   ],
   [
    "consumidor",
    "Lei nº 8.078/1990"
   ],
   [
    "consumidor",
    "Lei nº 9.656/1998"
   ],
   [
    "consumidor",
    "Resolução ANATEL nº 765/2023"
   ],
   [
    "consumidor",
    "Resolução Normativa ANEEL nº 1.000/2021"
   ],
   [
    "crianca",
    "Decreto nº 9.603/2018"
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
    "Lei nº 13.257/2016"
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
    "Resolução CNJ nº 295/2019"
   ],
   [
    "eleitoral",
    "Lei Complementar nº 64/1990"
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
    "Lei nº 9.096/1995"
   ],
   [
    "eleitoral",
    "Lei nº 9.504/1997"
   ],
   [
    "empresarial",
    "Decreto nº 2.044/1908"
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
    "Lei nº 14.112/2020"
   ],
   [
    "empresarial",
    "Lei nº 14.193/2021"
   ],
   [
    "empresarial",
    "Lei nº 6.840/1980"
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
    "humanos",
    "Decreto nº 678/1992"
   ],
   [
    "humanos",
    "Decreto nº 7.037/2009"
   ],
   [
    "humanos",
    "Decreto nº 9.571/2018"
   ],
   [
    "humanos",
    "Lei nº 7.716/1989"
   ],
   [
    "penal",
    "Decreto-Lei nº 201/1967"
   ],
   [
    "penal",
    "Decreto-Lei nº 3.688/1941"
   ],
   [
    "penal",
    "Lei nº 1.521/1951"
   ],
   [
    "penal",
    "Lei nº 10.826/2003"
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
    "Lei nº 13.869/2019"
   ],
   [
    "penal",
    "Lei nº 13.964/2019"
   ],
   [
    "penal",
    "Lei nº 14.597/2023"
   ],
   [
    "penal",
    "Lei nº 4.898/1965"
   ],
   [
    "penal",
    "Lei nº 6.001/1973"
   ],
   [
    "penal",
    "Lei nº 7.210/1984"
   ],
   [
    "penal",
    "Lei nº 7.492/1986"
   ],
   [
    "penal",
    "Lei nº 7.716/1989"
   ],
   [
    "penal",
    "Lei nº 8.072/1990"
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
    "Lei nº 9.029/1995"
   ],
   [
    "penal",
    "Lei nº 9.263/1996"
   ],
   [
    "penal",
    "Lei nº 9.434/1997"
   ],
   [
    "penal",
    "Lei nº 9.455/1997"
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
    "Lei nº 9.613/1998"
   ],
   [
    "previdenciario",
    "Lei nº 12.435/2011"
   ],
   [
    "previdenciario",
    "Lei nº 8.742/1993"
   ],
   [
    "processual_civil",
    "Lei nº 10.259/2001"
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
    "processual_civil",
    "Lei nº 12.016/2009"
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
    "processual_civil",
    "Lei nº 13.129/2015"
   ],
   [
    "processual_civil",
    "Lei nº 13.140/2015"
   ],
   [
    "processual_civil",
    "Lei nº 13.655/2018"
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
    "Lei nº 8.437/1992"
   ],
   [
    "processual_civil",
    "Lei nº 9.099/1995"
   ],
   [
    "processual_civil",
    "Lei nº 9.307/1996"
   ],
   [
    "processual_civil",
    "Lei nº 9.494/1997"
   ],
   [
    "processual_civil",
    "Lei nº 9.507/1997"
   ],
   [
    "processual_penal",
    "Decreto-Lei nº 1.002/1969"
   ],
   [
    "processual_penal",
    "Decreto-Lei nº 201/1967"
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
    "Lei nº 4.737/1965"
   ],
   [
    "processual_penal",
    "Lei nº 7.210/1984"
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
    "tributario",
    "Lei Complementar nº 101/2000"
   ],
   [
    "tributario",
    "Lei Complementar nº 118/2005"
   ],
   [
    "tributario",
    "Lei nº 10.169/2000"
   ],
   [
    "tributario",
    "Lei nº 5.172/1966"
   ],
   [
    "tributario",
    "Lei nº 6.830/1980"
   ],
   [
    "tributario",
    "Lei nº 8.397/1992"
   ]
  ],
  "tipo": "edital"
 },
 {
  "id": "dpe-sc-defensor-2026",
  "sigla": "DPE-SC",
  "cargo": "Defensor Público Substituto",
  "orgao": "Defensoria Pública do Estado de Santa Catarina",
  "titulo": "Concurso Público para Defensor Público Substituto",
  "edital": "Edital de Abertura nº 01/2026",
  "grupos": [
   {
    "nome": "Bloco I",
    "disciplinas": [
     "Direito Constitucional",
     "Direito Administrativo",
     "Direito Tributário"
    ]
   },
   {
    "nome": "Bloco II",
    "disciplinas": [
     "Direito Civil",
     "Direito Processual Civil",
     "Direito do Consumidor"
    ]
   },
   {
    "nome": "Bloco III",
    "disciplinas": [
     "Direito Penal",
     "Direito Processual Penal",
     "Direito Empresarial",
     "Direito Ambiental",
     "Direito Previdenciário",
     "Direito Eleitoral",
     "Direito do Trabalho"
    ]
   }
  ],
  "leis": [
   [
    "administrativo",
    "Decreto-Lei nº 3.365/1941"
   ],
   [
    "administrativo",
    "Lei Complementar (SC) nº 491/2010"
   ],
   [
    "administrativo",
    "Lei Complementar nº 101/2000"
   ],
   [
    "administrativo",
    "Lei Complementar nº 80/1994"
   ],
   [
    "administrativo",
    "Lei Estadual (SC) nº 6.745/1985"
   ],
   [
    "administrativo",
    "Lei nº 11.079/2004"
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
    "Lei nº 13.460/2017"
   ],
   [
    "administrativo",
    "Lei nº 14.133/2021"
   ],
   [
    "administrativo",
    "Lei nº 14.230/2021"
   ],
   [
    "administrativo",
    "Lei nº 4.878/1965"
   ],
   [
    "administrativo",
    "Lei nº 8.080/1990"
   ],
   [
    "administrativo",
    "Lei nº 8.112/1990"
   ],
   [
    "administrativo",
    "Lei nº 8.429/1992"
   ],
   [
    "administrativo",
    "Lei nº 8.987/1995"
   ],
   [
    "administrativo",
    "Lei nº 9.394/1996"
   ],
   [
    "administrativo",
    "Lei nº 9.469/1997"
   ],
   [
    "administrativo",
    "Lei nº 9.636/1998"
   ],
   [
    "administrativo",
    "Lei nº 9.637/1998"
   ],
   [
    "administrativo",
    "Lei nº 9.784/1999"
   ],
   [
    "administrativo",
    "Lei nº 9.790/1999"
   ],
   [
    "ambiental",
    "Decreto nº 6.514/2008"
   ],
   [
    "ambiental",
    "Decreto nº 7.217/2010"
   ],
   [
    "ambiental",
    "Decreto nº 9.310/2018"
   ],
   [
    "ambiental",
    "Decreto nº 99.274/1990"
   ],
   [
    "ambiental",
    "Lei Complementar nº 140/2011"
   ],
   [
    "ambiental",
    "Lei nº 10.257/2001"
   ],
   [
    "ambiental",
    "Lei nº 11.107/2005"
   ],
   [
    "ambiental",
    "Lei nº 11.124/2005"
   ],
   [
    "ambiental",
    "Lei nº 11.284/2006"
   ],
   [
    "ambiental",
    "Lei nº 11.445/2007"
   ],
   [
    "ambiental",
    "Lei nº 11.977/2009"
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
    "Lei nº 12.587/2012"
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
    "Lei nº 13.089/2015"
   ],
   [
    "ambiental",
    "Lei nº 13.123/2015"
   ],
   [
    "ambiental",
    "Lei nº 13.465/2017"
   ],
   [
    "ambiental",
    "Lei nº 14.904/2024"
   ],
   [
    "ambiental",
    "Lei nº 6.938/1981"
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
    "Lei nº 9.985/2000"
   ],
   [
    "ambiental",
    "Medida Provisória nº 2.220/2001"
   ],
   [
    "civil",
    "Decreto-Lei nº 4.657/1942"
   ],
   [
    "civil",
    "Decreto-Lei nº 911/1969"
   ],
   [
    "civil",
    "Lei nº 1.060/1950"
   ],
   [
    "civil",
    "Lei nº 10.741/2003"
   ],
   [
    "civil",
    "Lei nº 11.804/2008"
   ],
   [
    "civil",
    "Lei nº 12.965/2014"
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
    "Lei nº 13.874/2019"
   ],
   [
    "civil",
    "Lei nº 14.010/2020"
   ],
   [
    "civil",
    "Lei nº 14.382/2022"
   ],
   [
    "civil",
    "Lei nº 5.478/1968"
   ],
   [
    "civil",
    "Lei nº 6.015/1973"
   ],
   [
    "civil",
    "Lei nº 6.515/1977"
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
    "Lei nº 8.009/1990"
   ],
   [
    "civil",
    "Lei nº 8.245/1991"
   ],
   [
    "civil",
    "Lei nº 8.560/1992"
   ],
   [
    "civil",
    "Lei nº 8.935/1994"
   ],
   [
    "civil",
    "Lei nº 9.514/1997"
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
    "constitucional",
    "Lei nº 12.562/2011"
   ],
   [
    "consumidor",
    "Decreto nº 11.150/2022"
   ],
   [
    "consumidor",
    "Decreto nº 2.181/1997"
   ],
   [
    "consumidor",
    "Decreto nº 5.903/2006"
   ],
   [
    "consumidor",
    "Decreto nº 7.962/2013"
   ],
   [
    "consumidor",
    "Decreto nº 9.936/2019"
   ],
   [
    "consumidor",
    "Lei Complementar nº 166/2019"
   ],
   [
    "consumidor",
    "Lei nº 12.414/2011"
   ],
   [
    "consumidor",
    "Lei nº 14.181/2021"
   ],
   [
    "consumidor",
    "Lei nº 14.538/2023"
   ],
   [
    "consumidor",
    "Lei nº 8.078/1990"
   ],
   [
    "consumidor",
    "Lei nº 9.656/1998"
   ],
   [
    "consumidor",
    "Resolução Normativa ANEEL nº 1.000/2021"
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
    "Lei nº 13.185/2015"
   ],
   [
    "crianca",
    "Lei nº 13.257/2016"
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
    "Lei nº 14.811/2024"
   ],
   [
    "crianca",
    "Lei nº 15.211/2025"
   ],
   [
    "crianca",
    "Lei nº 8.069/1990"
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
    "Lei nº 8.934/1994"
   ],
   [
    "humanos",
    "Decreto nº 678/1992"
   ],
   [
    "humanos",
    "Decreto nº 7.053/2009"
   ],
   [
    "humanos",
    "Lei nº 10.639/2003"
   ],
   [
    "humanos",
    "Lei nº 11.346/2006"
   ],
   [
    "humanos",
    "Lei nº 12.852/2013"
   ],
   [
    "humanos",
    "Lei nº 7.716/1989"
   ],
   [
    "humanos",
    "Lei nº 7.853/1989"
   ],
   [
    "penal",
    "Decreto nº 5.015/2004"
   ],
   [
    "penal",
    "Decreto nº 9.847/2019"
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
    "Decreto-Lei nº 3.688/1941"
   ],
   [
    "penal",
    "Lei nº 1.521/1951"
   ],
   [
    "penal",
    "Lei nº 10.826/2003"
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
    "Lei nº 13.869/2019"
   ],
   [
    "penal",
    "Lei nº 13.964/2019"
   ],
   [
    "penal",
    "Lei nº 14.322/2022"
   ],
   [
    "penal",
    "Lei nº 14.597/2023"
   ],
   [
    "penal",
    "Lei nº 2.889/1956"
   ],
   [
    "penal",
    "Lei nº 4.898/1965"
   ],
   [
    "penal",
    "Lei nº 7.210/1984"
   ],
   [
    "penal",
    "Lei nº 7.492/1986"
   ],
   [
    "penal",
    "Lei nº 7.716/1989"
   ],
   [
    "penal",
    "Lei nº 8.072/1990"
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
    "Lei nº 9.455/1997"
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
    "Lei nº 9.613/1998"
   ],
   [
    "previdenciario",
    "Lei nº 8.213/1991"
   ],
   [
    "previdenciario",
    "Lei nº 8.742/1993"
   ],
   [
    "processual_civil",
    "Lei Complementar (SC) nº 339/2006"
   ],
   [
    "processual_civil",
    "Lei Complementar (SC) nº 367/2006"
   ],
   [
    "processual_civil",
    "Lei nº 10.259/2001"
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
    "processual_civil",
    "Lei nº 12.153/2009"
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
    "Lei nº 4.717/1965"
   ],
   [
    "processual_civil",
    "Lei nº 7.347/1985"
   ],
   [
    "processual_civil",
    "Lei nº 8.038/1990"
   ],
   [
    "processual_civil",
    "Lei nº 8.437/1992"
   ],
   [
    "processual_civil",
    "Lei nº 9.008/1995"
   ],
   [
    "processual_civil",
    "Lei nº 9.099/1995"
   ],
   [
    "processual_civil",
    "Lei nº 9.307/1996"
   ],
   [
    "processual_civil",
    "Lei nº 9.494/1997"
   ],
   [
    "processual_civil",
    "Lei nº 9.507/1997"
   ],
   [
    "processual_penal",
    "Decreto-Lei nº 1.002/1969"
   ],
   [
    "processual_penal",
    "Decreto-Lei nº 201/1967"
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
    "Lei nº 12.830/2013"
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
    "processual_penal",
    "Lei nº 7.960/1989"
   ],
   [
    "processual_penal",
    "Lei nº 8.457/1992"
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
    "tributario",
    "Decreto nº 70.235/1972"
   ],
   [
    "tributario",
    "Emenda Constitucional nº 132/2023"
   ],
   [
    "tributario",
    "Lei Complementar (SC) nº 465/2009"
   ],
   [
    "tributario",
    "Lei Complementar nº 101/2000"
   ],
   [
    "tributario",
    "Lei Complementar nº 118/2005"
   ],
   [
    "tributario",
    "Lei Estadual (SC) nº 10.297/1996"
   ],
   [
    "tributario",
    "Lei Estadual (SC) nº 13.136/2004"
   ],
   [
    "tributario",
    "Lei Estadual (SC) nº 3.938/1966"
   ],
   [
    "tributario",
    "Lei nº 10.169/2000"
   ],
   [
    "tributario",
    "Lei nº 5.172/1966"
   ],
   [
    "tributario",
    "Lei nº 6.830/1980"
   ]
  ],
  "tipo": "edital"
 },
 {
  "id": "mp-mt-promotor-2026",
  "sigla": "MPMT",
  "cargo": "Promotor de Justiça Substituto",
  "orgao": "Ministério Público do Estado de Mato Grosso",
  "titulo": "Concurso Público para Promotor de Justiça Substituto",
  "edital": "Edital nº 01/2026",
  "grupos": [
   {
    "nome": "Bloco I",
    "disciplinas": [
     "Direito Constitucional",
     "Direito Administrativo",
     "Direito Tributário"
    ]
   },
   {
    "nome": "Bloco II",
    "disciplinas": [
     "Direito Civil",
     "Direito Processual Civil",
     "Direito do Consumidor"
    ]
   },
   {
    "nome": "Bloco III",
    "disciplinas": [
     "Direito Penal",
     "Direito Processual Penal",
     "Direito Empresarial",
     "Direito Ambiental",
     "Direito Previdenciário",
     "Direito Eleitoral",
     "Direito do Trabalho"
    ]
   }
  ],
  "leis": [
   [
    "administrativo",
    "Decreto-Lei nº 4.597/1942"
   ],
   [
    "administrativo",
    "Lei Complementar nº 101/2000"
   ],
   [
    "administrativo",
    "Lei Complementar nº 75/1993"
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
    "Lei nº 13.019/2014"
   ],
   [
    "administrativo",
    "Lei nº 13.460/2017"
   ],
   [
    "administrativo",
    "Lei nº 13.848/2019"
   ],
   [
    "administrativo",
    "Lei nº 14.133/2021"
   ],
   [
    "administrativo",
    "Lei nº 14.230/2021"
   ],
   [
    "administrativo",
    "Lei nº 4.320/1964"
   ],
   [
    "administrativo",
    "Lei nº 8.080/1990"
   ],
   [
    "administrativo",
    "Lei nº 8.429/1992"
   ],
   [
    "administrativo",
    "Lei nº 8.625/1993"
   ],
   [
    "administrativo",
    "Lei nº 8.987/1995"
   ],
   [
    "administrativo",
    "Lei nº 9.394/1996"
   ],
   [
    "administrativo",
    "Lei nº 9.784/1999"
   ],
   [
    "administrativo",
    "Lei nº 9.790/1999"
   ],
   [
    "ambiental",
    "Lei nº 10.257/2001"
   ],
   [
    "ambiental",
    "Lei nº 11.105/2005"
   ],
   [
    "ambiental",
    "Lei nº 11.445/2007"
   ],
   [
    "ambiental",
    "Lei nº 13.465/2017"
   ],
   [
    "ambiental",
    "Lei nº 14.026/2020"
   ],
   [
    "ambiental",
    "Lei nº 6.938/1981"
   ],
   [
    "civil",
    "Decreto-Lei nº 4.657/1942"
   ],
   [
    "civil",
    "Lei nº 10.267/2001"
   ],
   [
    "civil",
    "Lei nº 10.741/2003"
   ],
   [
    "civil",
    "Lei nº 12.318/2010"
   ],
   [
    "civil",
    "Lei nº 12.965/2014"
   ],
   [
    "civil",
    "Lei nº 13.058/2014"
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
    "Lei nº 13.874/2019"
   ],
   [
    "civil",
    "Lei nº 14.382/2022"
   ],
   [
    "civil",
    "Lei nº 14.711/2023"
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
    "Lei nº 6.766/1979"
   ],
   [
    "civil",
    "Lei nº 8.245/1991"
   ],
   [
    "civil",
    "Lei nº 8.560/1992"
   ],
   [
    "civil",
    "Lei nº 9.610/1998"
   ],
   [
    "constitucional",
    "CF/1988"
   ],
   [
    "consumidor",
    "Lei nº 14.181/2021"
   ],
   [
    "consumidor",
    "Lei nº 8.078/1990"
   ],
   [
    "crianca",
    "Decreto nº 9.603/2018"
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
    "Lei nº 13.257/2016"
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
    "eleitoral",
    "Lei Complementar nº 135/2010"
   ],
   [
    "eleitoral",
    "Lei Complementar nº 64/1990"
   ],
   [
    "eleitoral",
    "Lei nº 6.091/1974"
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
    "Lei nº 14.112/2020"
   ],
   [
    "empresarial",
    "Lei nº 9.609/1998"
   ],
   [
    "humanos",
    "Decreto nº 10.088/2019"
   ],
   [
    "humanos",
    "Decreto nº 10.932/2022"
   ],
   [
    "humanos",
    "Decreto nº 3.298/1999"
   ],
   [
    "humanos",
    "Decreto nº 3.956/2001"
   ],
   [
    "humanos",
    "Decreto nº 4.886/2003"
   ],
   [
    "humanos",
    "Decreto nº 6.040/2007"
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
    "Decreto nº 678/1992"
   ],
   [
    "humanos",
    "Decreto nº 7.037/2009"
   ],
   [
    "humanos",
    "Decreto nº 7.053/2009"
   ],
   [
    "humanos",
    "Decreto nº 8.136/2013"
   ],
   [
    "humanos",
    "Decreto nº 9.571/2018"
   ],
   [
    "humanos",
    "Lei nº 10.639/2003"
   ],
   [
    "humanos",
    "Lei nº 11.346/2006"
   ],
   [
    "humanos",
    "Lei nº 11.645/2008"
   ],
   [
    "humanos",
    "Lei nº 12.288/2010"
   ],
   [
    "humanos",
    "Lei nº 14.701/2023"
   ],
   [
    "humanos",
    "Lei nº 7.716/1989"
   ],
   [
    "humanos",
    "Lei nº 7.853/1989"
   ],
   [
    "humanos",
    "Resolução A/RES/61/295 (ONU, 2007)"
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
    "Lei nº 1.521/1951"
   ],
   [
    "penal",
    "Lei nº 10.826/2003"
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
    "Lei nº 12.737/2012"
   ],
   [
    "penal",
    "Lei nº 12.850/2013"
   ],
   [
    "penal",
    "Lei nº 12.984/2014"
   ],
   [
    "penal",
    "Lei nº 13.260/2016"
   ],
   [
    "penal",
    "Lei nº 13.869/2019"
   ],
   [
    "penal",
    "Lei nº 13.964/2019"
   ],
   [
    "penal",
    "Lei nº 14.322/2022"
   ],
   [
    "penal",
    "Lei nº 14.532/2023"
   ],
   [
    "penal",
    "Lei nº 14.597/2023"
   ],
   [
    "penal",
    "Lei nº 2.889/1956"
   ],
   [
    "penal",
    "Lei nº 4.898/1965"
   ],
   [
    "penal",
    "Lei nº 6.001/1973"
   ],
   [
    "penal",
    "Lei nº 7.210/1984"
   ],
   [
    "penal",
    "Lei nº 7.492/1986"
   ],
   [
    "penal",
    "Lei nº 7.716/1989"
   ],
   [
    "penal",
    "Lei nº 7.802/1989"
   ],
   [
    "penal",
    "Lei nº 8.072/1990"
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
    "Lei nº 9.029/1995"
   ],
   [
    "penal",
    "Lei nº 9.263/1996"
   ],
   [
    "penal",
    "Lei nº 9.434/1997"
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
    "Lei nº 9.605/1998"
   ],
   [
    "penal",
    "Lei nº 9.613/1998"
   ],
   [
    "previdenciario",
    "Lei nº 8.742/1993"
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
    "processual_civil",
    "Lei nº 13.655/2018"
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
    "Lei nº 9.099/1995"
   ],
   [
    "processual_civil",
    "Lei nº 9.494/1997"
   ],
   [
    "processual_civil",
    "Lei nº 9.507/1997"
   ],
   [
    "processual_penal",
    "Decreto-Lei nº 1.002/1969"
   ],
   [
    "processual_penal",
    "Decreto-Lei nº 201/1967"
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
    "Lei nº 1.579/1952"
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
    "Lei nº 11.719/2008"
   ],
   [
    "processual_penal",
    "Lei nº 12.313/2010"
   ],
   [
    "processual_penal",
    "Lei nº 12.830/2013"
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
    "Lei nº 5.249/1967"
   ],
   [
    "processual_penal",
    "Lei nº 7.210/1984"
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
    "tributario",
    "Lei Complementar nº 101/2000"
   ]
  ],
  "tipo": "edital"
 },
 {
  "id": "mp-go-promotor-2025",
  "sigla": "MPGO",
  "cargo": "Promotor de Justiça Substituto",
  "orgao": "Ministério Público do Estado de Goiás",
  "titulo": "Concurso Público para Promotor de Justiça Substituto",
  "edital": "Edital nº 01/2025",
  "grupos": [
   {
    "nome": "Bloco I",
    "disciplinas": [
     "Direito Constitucional",
     "Direito Administrativo",
     "Direito Tributário"
    ]
   },
   {
    "nome": "Bloco II",
    "disciplinas": [
     "Direito Civil",
     "Direito Processual Civil",
     "Direito do Consumidor"
    ]
   },
   {
    "nome": "Bloco III",
    "disciplinas": [
     "Direito Penal",
     "Direito Processual Penal",
     "Direito Empresarial",
     "Direito Ambiental",
     "Direito Previdenciário",
     "Direito Eleitoral",
     "Direito do Trabalho"
    ]
   }
  ],
  "leis": [
   [
    "administrativo",
    "Decreto-Lei nº 4.597/1942"
   ],
   [
    "administrativo",
    "Lei Complementar nº 101/2000"
   ],
   [
    "administrativo",
    "Lei Complementar nº 75/1993"
   ],
   [
    "administrativo",
    "Lei nº 12.462/2011"
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
    "Lei nº 13.019/2014"
   ],
   [
    "administrativo",
    "Lei nº 13.303/2016"
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
    "Lei nº 4.320/1964"
   ],
   [
    "administrativo",
    "Lei nº 4.878/1965"
   ],
   [
    "administrativo",
    "Lei nº 8.080/1990"
   ],
   [
    "administrativo",
    "Lei nº 8.112/1990"
   ],
   [
    "administrativo",
    "Lei nº 8.429/1992"
   ],
   [
    "administrativo",
    "Lei nº 8.625/1993"
   ],
   [
    "administrativo",
    "Lei nº 8.666/1993"
   ],
   [
    "administrativo",
    "Lei nº 8.987/1995"
   ],
   [
    "administrativo",
    "Lei nº 9.394/1996"
   ],
   [
    "administrativo",
    "Lei nº 9.784/1999"
   ],
   [
    "civil",
    "Decreto nº 20.910/1932"
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
    "Lei nº 10.406/2002"
   ],
   [
    "civil",
    "Lei nº 12.376/2010"
   ],
   [
    "civil",
    "Lei nº 14.905/2024"
   ],
   [
    "civil",
    "Lei nº 4.380/1964"
   ],
   [
    "civil",
    "Lei nº 5.478/1968"
   ],
   [
    "civil",
    "Lei nº 6.515/1977"
   ],
   [
    "civil",
    "Lei nº 8.009/1990"
   ],
   [
    "civil",
    "Lei nº 8.560/1992"
   ],
   [
    "civil",
    "Lei nº 8.971/1994"
   ],
   [
    "civil",
    "Lei nº 9.278/1996"
   ],
   [
    "constitucional",
    "Emenda Constitucional nº 80/2014"
   ],
   [
    "constitucional",
    "Lei nº 12.562/2011"
   ],
   [
    "consumidor",
    "Lei nº 8.078/1990"
   ],
   [
    "crianca",
    "Lei nº 12.594/2012"
   ],
   [
    "crianca",
    "Lei nº 8.069/1990"
   ],
   [
    "eleitoral",
    "Lei Complementar nº 86/1996"
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
    "Lei nº 9.096/1995"
   ],
   [
    "empresarial",
    "Lei nº 11.101/2005"
   ],
   [
    "humanos",
    "Decreto nº 10.932/2022"
   ],
   [
    "humanos",
    "Decreto nº 65.810/1969"
   ],
   [
    "humanos",
    "Lei nº 11.346/2006"
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
    "penal",
    "Decreto-Lei nº 2.848/1940"
   ],
   [
    "penal",
    "Decreto-Lei nº 201/1967"
   ],
   [
    "penal",
    "Decreto-Lei nº 3.688/1941"
   ],
   [
    "penal",
    "Lei nº 1.521/1951"
   ],
   [
    "penal",
    "Lei nº 14.322/2022"
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
    "previdenciario",
    "Lei nº 8.742/1993"
   ],
   [
    "processual_civil",
    "Lei nº 10.259/2001"
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
    "processual_civil",
    "Lei nº 12.153/2009"
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
    "Lei nº 4.717/1965"
   ],
   [
    "processual_civil",
    "Lei nº 7.347/1985"
   ],
   [
    "processual_civil",
    "Lei nº 8.437/1992"
   ],
   [
    "processual_civil",
    "Lei nº 9.099/1995"
   ],
   [
    "processual_civil",
    "Lei nº 9.494/1997"
   ],
   [
    "processual_civil",
    "Lei nº 9.507/1997"
   ],
   [
    "processual_penal",
    "Decreto-Lei nº 1.002/1969"
   ],
   [
    "processual_penal",
    "Decreto-Lei nº 201/1967"
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
    "Lei nº 11.101/2005"
   ],
   [
    "processual_penal",
    "Lei nº 12.830/2013"
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
    "tributario",
    "Lei Complementar nº 101/2000"
   ],
   [
    "tributario",
    "Lei Complementar nº 105/2001"
   ]
  ],
  "tipo": "edital"
 },
 {
  "id": "pge-al-procurador-2026",
  "sigla": "PGE-AL",
  "cargo": "Procurador do Estado — 1ª Classe",
  "orgao": "Procuradoria-Geral do Estado de Alagoas",
  "titulo": "Concurso Público para Procurador do Estado de Alagoas – 1ª Classe",
  "edital": "Edital nº 1 – PGE/AL, de 31 de março de 2026",
  "grupos": [
   {
    "nome": "Bloco I",
    "disciplinas": [
     "Direito Constitucional",
     "Direito Administrativo",
     "Direito Tributário"
    ]
   },
   {
    "nome": "Bloco II",
    "disciplinas": [
     "Direito Civil",
     "Direito Processual Civil",
     "Direito do Consumidor"
    ]
   },
   {
    "nome": "Bloco III",
    "disciplinas": [
     "Direito Penal",
     "Direito Processual Penal",
     "Direito Empresarial",
     "Direito Ambiental",
     "Direito Previdenciário",
     "Direito Eleitoral",
     "Direito do Trabalho"
    ]
   }
  ],
  "leis": [
   [
    "administrativo",
    "Decreto nº 6.017/2007"
   ],
   [
    "administrativo",
    "Lei Complementar nº 101/2000"
   ],
   [
    "administrativo",
    "Lei nº 11.079/2004"
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
    "Lei nº 13.019/2014"
   ],
   [
    "administrativo",
    "Lei nº 13.303/2016"
   ],
   [
    "administrativo",
    "Lei nº 13.460/2017"
   ],
   [
    "administrativo",
    "Lei nº 13.848/2019"
   ],
   [
    "administrativo",
    "Lei nº 14.133/2021"
   ],
   [
    "administrativo",
    "Lei nº 14.230/2021"
   ],
   [
    "administrativo",
    "Lei nº 4.320/1964"
   ],
   [
    "administrativo",
    "Lei nº 4.878/1965"
   ],
   [
    "administrativo",
    "Lei nº 8.112/1990"
   ],
   [
    "administrativo",
    "Lei nº 8.429/1992"
   ],
   [
    "administrativo",
    "Lei nº 8.987/1995"
   ],
   [
    "administrativo",
    "Lei nº 9.784/1999"
   ],
   [
    "administrativo",
    "Lei nº 9.790/1999"
   ],
   [
    "ambiental",
    "Decreto nº 10.936/2022"
   ],
   [
    "ambiental",
    "Decreto nº 6.514/2008"
   ],
   [
    "ambiental",
    "Decreto nº 7.217/2010"
   ],
   [
    "ambiental",
    "Decreto nº 99.274/1990"
   ],
   [
    "ambiental",
    "Lei Complementar nº 140/2011"
   ],
   [
    "ambiental",
    "Lei nº 10.257/2001"
   ],
   [
    "ambiental",
    "Lei nº 11.107/2005"
   ],
   [
    "ambiental",
    "Lei nº 11.124/2005"
   ],
   [
    "ambiental",
    "Lei nº 11.284/2006"
   ],
   [
    "ambiental",
    "Lei nº 11.445/2007"
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
    "Lei nº 12.334/2010"
   ],
   [
    "ambiental",
    "Lei nº 12.587/2012"
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
    "Lei nº 13.465/2017"
   ],
   [
    "ambiental",
    "Lei nº 14.026/2020"
   ],
   [
    "ambiental",
    "Lei nº 14.755/2023"
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
    "Lei nº 6.938/1981"
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
    "Lei nº 9.985/2000"
   ],
   [
    "ambiental",
    "Medida Provisória nº 1.308/2025"
   ],
   [
    "civil",
    "Decreto nº 20.910/1932"
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
    "Lei nº 12.376/2010"
   ],
   [
    "civil",
    "Lei nº 13.709/2018"
   ],
   [
    "civil",
    "Lei nº 14.382/2022"
   ],
   [
    "civil",
    "Lei nº 14.905/2024"
   ],
   [
    "civil",
    "Lei nº 6.015/1973"
   ],
   [
    "civil",
    "Lei nº 6.766/1979"
   ],
   [
    "civil",
    "Lei nº 8.245/1991"
   ],
   [
    "civil",
    "Lei nº 8.935/1994"
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
    "constitucional",
    "Lei nº 12.562/2011"
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
    "Lei nº 12.529/2011"
   ],
   [
    "empresarial",
    "Lei nº 14.112/2020"
   ],
   [
    "empresarial",
    "Lei nº 14.193/2021"
   ],
   [
    "empresarial",
    "Lei nº 6.404/1976"
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
    "penal",
    "Lei nº 8.137/1990"
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
    "previdenciario",
    "Decreto nº 3.048/1999"
   ],
   [
    "previdenciario",
    "Emenda Constitucional nº 103/2019"
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
    "processual_civil",
    "Lei nº 11.419/2006"
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
    "processual_civil",
    "Lei nº 4.717/1965"
   ],
   [
    "processual_civil",
    "Lei nº 7.347/1985"
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
    "processual_penal",
    "Lei nº 11.101/2005"
   ],
   [
    "processual_penal",
    "Lei nº 13.105/2015"
   ],
   [
    "tributario",
    "Decreto nº 70.235/1972"
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
    "Lei Complementar nº 116/2003"
   ],
   [
    "tributario",
    "Lei Complementar nº 118/2005"
   ],
   [
    "tributario",
    "Lei Complementar nº 199/2023"
   ],
   [
    "tributario",
    "Lei nº 10.169/2000"
   ],
   [
    "tributario",
    "Lei nº 5.172/1966"
   ],
   [
    "tributario",
    "Lei nº 6.830/1980"
   ],
   [
    "tributario",
    "Lei nº 8.397/1992"
   ]
  ],
  "tipo": "edital"
 },
 {
  "id": "pge-ac-procurador-2026",
  "sigla": "PGE-AC",
  "cargo": "Procurador do Estado — Classe I",
  "orgao": "Procuradoria-Geral do Estado do Acre",
  "titulo": "VIII Concurso Público para Procurador do Estado do Acre",
  "edital": "Edital de 26 de fevereiro de 2026",
  "grupos": [
   {
    "nome": "Bloco I",
    "disciplinas": [
     "Direito Constitucional",
     "Direito Administrativo",
     "Direito Tributário"
    ]
   },
   {
    "nome": "Bloco II",
    "disciplinas": [
     "Direito Civil",
     "Direito Processual Civil",
     "Direito do Consumidor"
    ]
   },
   {
    "nome": "Bloco III",
    "disciplinas": [
     "Direito Penal",
     "Direito Processual Penal",
     "Direito Empresarial",
     "Direito Ambiental",
     "Direito Previdenciário",
     "Direito Eleitoral",
     "Direito do Trabalho"
    ]
   }
  ],
  "leis": [
   [
    "administrativo",
    "Decreto nº 6.017/2007"
   ],
   [
    "administrativo",
    "Decreto nº 6.029/2007"
   ],
   [
    "administrativo",
    "Decreto nº 7.746/2012"
   ],
   [
    "administrativo",
    "Lei Complementar nº 101/2000"
   ],
   [
    "administrativo",
    "Lei nº 11.079/2004"
   ],
   [
    "administrativo",
    "Lei nº 12.527/2011"
   ],
   [
    "administrativo",
    "Lei nº 12.813/2013"
   ],
   [
    "administrativo",
    "Lei nº 12.846/2013"
   ],
   [
    "administrativo",
    "Lei nº 13.019/2014"
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
    "Lei nº 14.133/2021"
   ],
   [
    "administrativo",
    "Lei nº 14.230/2021"
   ],
   [
    "administrativo",
    "Lei nº 14.967/2024"
   ],
   [
    "administrativo",
    "Lei nº 4.320/1964"
   ],
   [
    "administrativo",
    "Lei nº 4.878/1965"
   ],
   [
    "administrativo",
    "Lei nº 8.112/1990"
   ],
   [
    "administrativo",
    "Lei nº 8.429/1992"
   ],
   [
    "administrativo",
    "Lei nº 8.666/1993"
   ],
   [
    "administrativo",
    "Lei nº 8.987/1995"
   ],
   [
    "administrativo",
    "Lei nº 9.469/1997"
   ],
   [
    "administrativo",
    "Lei nº 9.637/1998"
   ],
   [
    "administrativo",
    "Lei nº 9.784/1999"
   ],
   [
    "administrativo",
    "Lei nº 9.790/1999"
   ],
   [
    "ambiental",
    "Decreto nº 10.936/2022"
   ],
   [
    "ambiental",
    "Decreto nº 99.274/1990"
   ],
   [
    "ambiental",
    "Lei Complementar nº 140/2011"
   ],
   [
    "ambiental",
    "Lei nº 11.124/2005"
   ],
   [
    "ambiental",
    "Lei nº 11.284/2006"
   ],
   [
    "ambiental",
    "Lei nº 11.952/2009"
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
    "Lei nº 12.334/2010"
   ],
   [
    "ambiental",
    "Lei nº 12.587/2012"
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
    "Lei nº 13.465/2017"
   ],
   [
    "ambiental",
    "Lei nº 14.755/2023"
   ],
   [
    "ambiental",
    "Lei nº 14.785/2023"
   ],
   [
    "ambiental",
    "Lei nº 14.904/2024"
   ],
   [
    "ambiental",
    "Lei nº 6.938/1981"
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
    "Lei nº 9.985/2000"
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
    "penal",
    "Lei nº 8.137/1990"
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
    "previdenciario",
    "Lei nº 8.212/1991"
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
    "processual_civil",
    "Lei nº 4.717/1965"
   ],
   [
    "processual_civil",
    "Lei nº 7.347/1985"
   ],
   [
    "processual_civil",
    "Lei nº 8.437/1992"
   ],
   [
    "processual_civil",
    "Lei nº 9.099/1995"
   ],
   [
    "processual_civil",
    "Lei nº 9.494/1997"
   ],
   [
    "processual_civil",
    "Lei nº 9.507/1997"
   ],
   [
    "processual_penal",
    "Lei nº 11.101/2005"
   ],
   [
    "trabalhista",
    "Lei nº 10.035/2000"
   ],
   [
    "tributario",
    "Decreto-Lei nº 147/1967"
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
    "Lei Complementar nº 116/2003"
   ],
   [
    "tributario",
    "Lei nº 10.169/2000"
   ],
   [
    "tributario",
    "Lei nº 6.830/1980"
   ],
   [
    "tributario",
    "Lei nº 8.397/1992"
   ]
  ],
  "tipo": "edital"
 },
 {
  "id": "pc-ap-delegado-2026",
  "sigla": "PC-AP",
  "cargo": "Delegado de Polícia Civil",
  "orgao": "Polícia Civil do Estado do Amapá",
  "titulo": "Concurso Público para Delegado de Polícia Civil",
  "edital": "Concurso Público da Polícia Civil do Amapá — Edital nº 1/2026 (Cesgranrio)",
  "grupos": [
   {
    "nome": "Bloco I",
    "disciplinas": [
     "Direito Constitucional",
     "Direito Administrativo",
     "Direito Tributário"
    ]
   },
   {
    "nome": "Bloco II",
    "disciplinas": [
     "Direito Civil",
     "Direito Empresarial",
     "Direito Ambiental"
    ]
   },
   {
    "nome": "Bloco III",
    "disciplinas": [
     "Direito Penal",
     "Direito Processual Penal"
    ]
   }
  ],
  "leis": [
   [
    "administrativo",
    "Decreto nº 6.017/2007"
   ],
   [
    "administrativo",
    "Lei nº 12.527/2011"
   ],
   [
    "administrativo",
    "Lei nº 14.133/2021"
   ],
   [
    "administrativo",
    "Lei nº 14.230/2021"
   ],
   [
    "administrativo",
    "Lei nº 4.878/1965"
   ],
   [
    "administrativo",
    "Lei nº 8.112/1990"
   ],
   [
    "administrativo",
    "Lei nº 8.429/1992"
   ],
   [
    "administrativo",
    "Lei nº 8.987/1995"
   ],
   [
    "administrativo",
    "Lei nº 9.784/1999"
   ],
   [
    "ambiental",
    "Decreto nº 10.936/2022"
   ],
   [
    "ambiental",
    "Decreto nº 6.514/2008"
   ],
   [
    "ambiental",
    "Decreto nº 99.274/1990"
   ],
   [
    "ambiental",
    "Lei Complementar nº 140/2011"
   ],
   [
    "ambiental",
    "Lei nº 11.124/2005"
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
    "Lei nº 12.334/2010"
   ],
   [
    "ambiental",
    "Lei nº 12.587/2012"
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
    "Lei nº 14.755/2023"
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
    "Lei nº 6.938/1981"
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
    "Lei nº 9.985/2000"
   ],
   [
    "ambiental",
    "Medida Provisória nº 1.308/2025"
   ],
   [
    "civil",
    "Decreto-Lei nº 4.657/1942"
   ],
   [
    "civil",
    "Lei nº 12.376/2010"
   ],
   [
    "civil",
    "Lei nº 12.965/2014"
   ],
   [
    "civil",
    "Lei nº 13.709/2018"
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
    "humanos",
    "Lei nº 7.716/1989"
   ],
   [
    "penal",
    "Decreto-Lei nº 3.688/1941"
   ],
   [
    "penal",
    "Lei nº 1.521/1951"
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
    "Lei nº 12.694/2012"
   ],
   [
    "penal",
    "Lei nº 12.850/2013"
   ],
   [
    "penal",
    "Lei nº 13.869/2019"
   ],
   [
    "penal",
    "Lei nº 4.898/1965"
   ],
   [
    "penal",
    "Lei nº 7.492/1986"
   ],
   [
    "penal",
    "Lei nº 7.716/1989"
   ],
   [
    "penal",
    "Lei nº 8.072/1990"
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
    "processual_civil",
    "Lei nº 9.099/1995"
   ],
   [
    "processual_penal",
    "Lei nº 11.343/2006"
   ],
   [
    "processual_penal",
    "Lei nº 12.037/2009"
   ],
   [
    "processual_penal",
    "Lei nº 12.313/2010"
   ],
   [
    "processual_penal",
    "Lei nº 12.830/2013"
   ],
   [
    "processual_penal",
    "Lei nº 12.850/2013"
   ],
   [
    "processual_penal",
    "Lei nº 7.210/1984"
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
    "tributario",
    "Lei nº 5.172/1966"
   ]
  ],
  "tipo": "edital"
 },
 {
  "id": "mp-ms-xxxi-promotor-2026",
  "sigla": "MPMS",
  "cargo": "Promotor de Justiça Substituto",
  "orgao": "Ministério Público do Estado de Mato Grosso do Sul",
  "titulo": "XXXI Concurso Público para Promotor de Justiça Substituto",
  "edital": "Edital nº 1/2026/COC/MPMS",
  "grupos": [
   {
    "nome": "Grupo I",
    "disciplinas": [
     "Direito Constitucional",
     "Direitos Humanos"
    ]
   },
   {
    "nome": "Grupo II",
    "disciplinas": [
     "Direito Penal"
    ]
   },
   {
    "nome": "Grupo III",
    "disciplinas": [
     "Direito Processual Penal"
    ]
   },
   {
    "nome": "Grupo IV",
    "disciplinas": [
     "Direito Civil",
     "Direito Processual Civil"
    ]
   },
   {
    "nome": "Grupo V",
    "disciplinas": [
     "Tutela de Interesses Difusos, Coletivos e Individuais Homogêneos"
    ]
   },
   {
    "nome": "Grupo VI",
    "disciplinas": [
     "Direito Administrativo",
     "Direito Tributário",
     "Direito Financeiro",
     "Direito Eleitoral",
     "Direito Institucional do Ministério Público"
    ]
   }
  ],
  "leis": [
   [
    "administrativo",
    "Decreto nº 6.017/2007"
   ],
   [
    "administrativo",
    "Decreto-Lei nº 4.597/1942"
   ],
   [
    "administrativo",
    "Lei Complementar (DF) nº 840/2011"
   ],
   [
    "administrativo",
    "Lei Complementar (MS) nº 72/1994"
   ],
   [
    "administrativo",
    "Lei Complementar (SC) nº 491/2010"
   ],
   [
    "administrativo",
    "Lei Complementar (SE) nº 33/1996"
   ],
   [
    "administrativo",
    "Lei Complementar nº 101/2000"
   ],
   [
    "administrativo",
    "Lei Complementar nº 220/2025"
   ],
   [
    "administrativo",
    "Lei Complementar nº 75/1993"
   ],
   [
    "administrativo",
    "Lei Estadual (SP) nº 10.177/1998"
   ],
   [
    "administrativo",
    "Lei nº 11.079/2004"
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
    "Lei nº 13.019/2014"
   ],
   [
    "administrativo",
    "Lei nº 13.303/2016"
   ],
   [
    "administrativo",
    "Lei nº 13.460/2017"
   ],
   [
    "administrativo",
    "Lei nº 13.787/2018"
   ],
   [
    "administrativo",
    "Lei nº 13.848/2019"
   ],
   [
    "administrativo",
    "Lei nº 14.113/2020"
   ],
   [
    "administrativo",
    "Lei nº 14.133/2021"
   ],
   [
    "administrativo",
    "Lei nº 14.230/2021"
   ],
   [
    "administrativo",
    "Lei nº 14.510/2022"
   ],
   [
    "administrativo",
    "Lei nº 4.878/1965"
   ],
   [
    "administrativo",
    "Lei nº 8.080/1990"
   ],
   [
    "administrativo",
    "Lei nº 8.112/1990"
   ],
   [
    "administrativo",
    "Lei nº 8.142/1990"
   ],
   [
    "administrativo",
    "Lei nº 8.429/1992"
   ],
   [
    "administrativo",
    "Lei nº 8.625/1993"
   ],
   [
    "administrativo",
    "Lei nº 8.666/1993"
   ],
   [
    "administrativo",
    "Lei nº 8.958/1994"
   ],
   [
    "administrativo",
    "Lei nº 8.987/1995"
   ],
   [
    "administrativo",
    "Lei nº 9.394/1996"
   ],
   [
    "administrativo",
    "Lei nº 9.637/1998"
   ],
   [
    "administrativo",
    "Lei nº 9.784/1999"
   ],
   [
    "administrativo",
    "Lei nº 9.790/1999"
   ],
   [
    "ambiental",
    "Decreto nº 12.688/2025"
   ],
   [
    "ambiental",
    "Lei nº 10.257/2001"
   ],
   [
    "ambiental",
    "Lei nº 11.107/2005"
   ],
   [
    "ambiental",
    "Lei nº 12.651/2012"
   ],
   [
    "ambiental",
    "Lei nº 15.042/2024"
   ],
   [
    "ambiental",
    "Lei nº 15.190/2025"
   ],
   [
    "ambiental",
    "Lei nº 15.228/2025"
   ],
   [
    "ambiental",
    "Lei nº 6.803/1980"
   ],
   [
    "civil",
    "Decreto nº 10.604/2021"
   ],
   [
    "civil",
    "Decreto nº 20.910/1932"
   ],
   [
    "civil",
    "Decreto nº 9.921/2019"
   ],
   [
    "civil",
    "Decreto-Lei nº 4.657/1942"
   ],
   [
    "civil",
    "Lei Estadual (SC) nº 17.492/2018"
   ],
   [
    "civil",
    "Lei nº 10.741/2003"
   ],
   [
    "civil",
    "Lei nº 11.804/2008"
   ],
   [
    "civil",
    "Lei nº 12.318/2010"
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
    "Lei nº 14.382/2022"
   ],
   [
    "civil",
    "Lei nº 5.478/1968"
   ],
   [
    "civil",
    "Lei nº 6.015/1973"
   ],
   [
    "civil",
    "Lei nº 6.515/1977"
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
    "Lei nº 8.560/1992"
   ],
   [
    "civil",
    "Lei nº 8.842/1994"
   ],
   [
    "civil",
    "Lei nº 8.935/1994"
   ],
   [
    "civil",
    "Lei nº 8.971/1994"
   ],
   [
    "civil",
    "Lei nº 9.278/1996"
   ],
   [
    "constitucional",
    "Emenda Constitucional nº 80/2014"
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
    "Lei nº 15.211/2025"
   ],
   [
    "crianca",
    "Lei nº 8.069/1990"
   ],
   [
    "eleitoral",
    "Lei Complementar nº 64/1990"
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
    "humanos",
    "Decreto nº 3.298/1999"
   ],
   [
    "humanos",
    "Decreto nº 4.886/2003"
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
    "Decreto nº 678/1992"
   ],
   [
    "humanos",
    "Decreto nº 7.037/2009"
   ],
   [
    "humanos",
    "Decreto nº 7.053/2009"
   ],
   [
    "humanos",
    "Decreto nº 8.136/2013"
   ],
   [
    "humanos",
    "Decreto nº 9.571/2018"
   ],
   [
    "humanos",
    "Lei nº 10.639/2003"
   ],
   [
    "humanos",
    "Lei nº 11.346/2006"
   ],
   [
    "humanos",
    "Lei nº 12.288/2010"
   ],
   [
    "humanos",
    "Lei nº 12.847/2013"
   ],
   [
    "humanos",
    "Lei nº 7.716/1989"
   ],
   [
    "humanos",
    "Lei nº 7.853/1989"
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
    "Decreto-Lei nº 3.688/1941"
   ],
   [
    "penal",
    "Lei nº 1.521/1951"
   ],
   [
    "penal",
    "Lei nº 10.826/2003"
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
    "Lei nº 12.683/2012"
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
    "Lei nº 13.840/2019"
   ],
   [
    "penal",
    "Lei nº 13.869/2019"
   ],
   [
    "penal",
    "Lei nº 14.188/2021"
   ],
   [
    "penal",
    "Lei nº 14.245/2021"
   ],
   [
    "penal",
    "Lei nº 14.322/2022"
   ],
   [
    "penal",
    "Lei nº 15.358/2026"
   ],
   [
    "penal",
    "Lei nº 15.384/2026"
   ],
   [
    "penal",
    "Lei nº 4.898/1965"
   ],
   [
    "penal",
    "Lei nº 7.492/1986"
   ],
   [
    "penal",
    "Lei nº 7.716/1989"
   ],
   [
    "penal",
    "Lei nº 8.072/1990"
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
    "Lei nº 9.263/1996"
   ],
   [
    "penal",
    "Lei nº 9.434/1997"
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
    "Lei nº 9.605/1998"
   ],
   [
    "penal",
    "Lei nº 9.613/1998"
   ],
   [
    "previdenciario",
    "Lei nº 8.213/1991"
   ],
   [
    "previdenciario",
    "Lei nº 8.742/1993"
   ],
   [
    "processual_civil",
    "Lei nº 10.259/2001"
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
    "processual_civil",
    "Lei nº 12.153/2009"
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
    "Lei nº 13.655/2018"
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
    "Lei nº 8.437/1992"
   ],
   [
    "processual_civil",
    "Lei nº 9.099/1995"
   ],
   [
    "processual_civil",
    "Lei nº 9.494/1997"
   ],
   [
    "processual_civil",
    "Lei nº 9.507/1997"
   ],
   [
    "processual_penal",
    "Decreto-Lei nº 1.002/1969"
   ],
   [
    "processual_penal",
    "Decreto-Lei nº 201/1967"
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
    "Lei nº 12.037/2009"
   ],
   [
    "processual_penal",
    "Lei nº 12.313/2010"
   ],
   [
    "processual_penal",
    "Lei nº 12.830/2013"
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
    "tributario",
    "Decreto Estadual (MG) nº 44.747/2008"
   ],
   [
    "tributario",
    "Decreto nº 70.235/1972"
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
    "Lei Complementar nº 105/2001"
   ],
   [
    "tributario",
    "Lei Complementar nº 118/2005"
   ],
   [
    "tributario",
    "Lei Complementar nº 200/2023"
   ],
   [
    "tributario",
    "Lei Estadual (PR) nº 18.877/2016"
   ],
   [
    "administrativo",
    "Lei nº 4.320/1964"
   ],
   [
    "tributario",
    "Lei nº 5.172/1966"
   ],
   [
    "tributario",
    "Lei nº 6.830/1980"
   ]
  ],
  "tipo": "edital"
 },
 {
  "id": "dpe-rj-xxix-defensor-2026",
  "sigla": "DPE-RJ",
  "cargo": "Defensor Público do Estado do Rio de Janeiro",
  "orgao": "Defensoria Pública do Estado do Rio de Janeiro",
  "titulo": "XXIX Concurso para Ingresso na Carreira da Defensoria Pública do Estado do Rio de Janeiro",
  "edital": "Deliberação CS/DPGERJ nº 197/2026",
  "grupos": [
   {
    "nome": "Banca I",
    "disciplinas": [
     "Direito Civil",
     "Direito Processual Civil",
     "Direito Empresarial",
     "Direito do Consumidor",
     "Direito da Criança, do Adolescente e do Idoso"
    ]
   },
   {
    "nome": "Banca II",
    "disciplinas": [
     "Direito Penal",
     "Direito Processual Penal",
     "Direito de Execução Penal"
    ]
   },
   {
    "nome": "Banca III",
    "disciplinas": [
     "Direito Constitucional",
     "Direito Administrativo",
     "Princípios Institucionais da Defensoria Pública"
    ]
   }
  ],
  "leis": [
   [
    "administrativo",
    "Lei nº 12.846/2013"
   ],
   [
    "administrativo",
    "Lei nº 13.005/2014"
   ],
   [
    "administrativo",
    "Lei nº 13.979/2020"
   ],
   [
    "administrativo",
    "Lei nº 14.133/2021"
   ],
   [
    "administrativo",
    "Lei nº 14.230/2021"
   ],
   [
    "administrativo",
    "Lei nº 4.878/1965"
   ],
   [
    "administrativo",
    "Lei nº 8.080/1990"
   ],
   [
    "administrativo",
    "Lei nº 8.112/1990"
   ],
   [
    "administrativo",
    "Lei nº 8.429/1992"
   ],
   [
    "administrativo",
    "Lei nº 8.987/1995"
   ],
   [
    "administrativo",
    "Lei nº 9.784/1999"
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
    "ambiental",
    "Lei nº 14.026/2020"
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
    "Lei nº 11.804/2008"
   ],
   [
    "civil",
    "Lei nº 12.318/2010"
   ],
   [
    "civil",
    "Lei nº 12.376/2010"
   ],
   [
    "civil",
    "Lei nº 12.764/2012"
   ],
   [
    "civil",
    "Lei nº 12.965/2014"
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
    "Lei nº 13.874/2019"
   ],
   [
    "civil",
    "Lei nº 14.010/2020"
   ],
   [
    "civil",
    "Lei nº 8.245/1991"
   ],
   [
    "civil",
    "Lei nº 8.560/1992"
   ],
   [
    "civil",
    "Lei nº 8.971/1994"
   ],
   [
    "civil",
    "Lei nº 9.278/1996"
   ],
   [
    "constitucional",
    "Emenda Constitucional nº 80/2014"
   ],
   [
    "consumidor",
    "Decreto nº 2.181/1997"
   ],
   [
    "consumidor",
    "Decreto nº 7.962/2013"
   ],
   [
    "consumidor",
    "Lei nº 14.181/2021"
   ],
   [
    "crianca",
    "Decreto nº 9.603/2018"
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
    "Lei nº 14.811/2024"
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
    "Lei nº 8.069/1990"
   ],
   [
    "crianca",
    "Resolução CNJ nº 295/2019"
   ],
   [
    "empresarial",
    "Decreto nº 3.708/1919"
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
    "Lei nº 14.112/2020"
   ],
   [
    "empresarial",
    "Lei nº 14.193/2021"
   ],
   [
    "empresarial",
    "Lei nº 8.934/1994"
   ],
   [
    "humanos",
    "Decreto nº 10.088/2019"
   ],
   [
    "humanos",
    "Decreto nº 6.040/2007"
   ],
   [
    "humanos",
    "Decreto nº 678/1992"
   ],
   [
    "humanos",
    "Decreto nº 7.037/2009"
   ],
   [
    "humanos",
    "Decreto nº 9.571/2018"
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
    "Lei nº 7.853/1989"
   ],
   [
    "humanos",
    "Resolução A/RES/61/295 (ONU, 2007)"
   ],
   [
    "penal",
    "Decreto-Lei nº 3.688/1941"
   ],
   [
    "penal",
    "Lei nº 1.521/1951"
   ],
   [
    "penal",
    "Lei nº 10.826/2003"
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
    "Lei nº 12.984/2014"
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
    "Lei nº 13.964/2019"
   ],
   [
    "penal",
    "Lei nº 14.597/2023"
   ],
   [
    "penal",
    "Lei nº 15.358/2026"
   ],
   [
    "penal",
    "Lei nº 15.384/2026"
   ],
   [
    "penal",
    "Lei nº 4.898/1965"
   ],
   [
    "penal",
    "Lei nº 7.492/1986"
   ],
   [
    "penal",
    "Lei nº 7.716/1989"
   ],
   [
    "penal",
    "Lei nº 8.072/1990"
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
    "Lei nº 9.455/1997"
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
    "processual_civil",
    "Lei nº 10.259/2001"
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
    "processual_civil",
    "Lei nº 12.153/2009"
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
    "Lei nº 4.717/1965"
   ],
   [
    "processual_civil",
    "Lei nº 7.347/1985"
   ],
   [
    "processual_civil",
    "Lei nº 9.099/1995"
   ],
   [
    "processual_civil",
    "Lei nº 9.494/1997"
   ],
   [
    "processual_penal",
    "Decreto-Lei nº 1.002/1969"
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
    "Lei nº 12.037/2009"
   ],
   [
    "processual_penal",
    "Lei nº 12.313/2010"
   ],
   [
    "processual_penal",
    "Lei nº 12.830/2013"
   ],
   [
    "processual_penal",
    "Lei nº 12.850/2013"
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
   ]
  ],
  "tipo": "edital"
 },
 {
  "id": "mp-rj-xxxix-promotor-2026",
  "sigla": "MPRJ",
  "cargo": "Promotor de Justiça Substituto",
  "orgao": "Ministério Público do Estado do Rio de Janeiro",
  "titulo": "XXXIX Concurso para Ingresso na Classe Inicial da Carreira do Ministério Público do Estado do Rio de Janeiro",
  "edital": "Deliberação CSMP nº 86/2025",
  "grupos": [
   {
    "nome": "Banca 1",
    "disciplinas": [
     "Direito Penal",
     "Direito Processual Penal",
     "Legislação Penal Extravagante"
    ]
   },
   {
    "nome": "Banca 2",
    "disciplinas": [
     "Direito Civil",
     "Direito Processual Civil",
     "Direito Empresarial"
    ]
   },
   {
    "nome": "Banca 3",
    "disciplinas": [
     "Direito Constitucional",
     "Direito Administrativo",
     "Direito Eleitoral",
     "Direito Financeiro e Tributário"
    ]
   },
   {
    "nome": "Banca 4",
    "disciplinas": [
     "Direito da Infância e Juventude",
     "Tutela Coletiva",
     "Princípios Institucionais do Ministério Público"
    ]
   }
  ],
  "leis": [
   [
    "administrativo",
    "Decreto-Lei nº 4.597/1942"
   ],
   [
    "administrativo",
    "Lei Complementar (MS) nº 72/1994"
   ],
   [
    "administrativo",
    "Lei Complementar (SC) nº 491/2010"
   ],
   [
    "administrativo",
    "Lei Complementar (SE) nº 33/1996"
   ],
   [
    "administrativo",
    "Lei Complementar nº 101/2000"
   ],
   [
    "administrativo",
    "Lei Complementar nº 75/1993"
   ],
   [
    "administrativo",
    "Lei Estadual (SP) nº 10.177/1998"
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
    "Lei nº 13.019/2014"
   ],
   [
    "administrativo",
    "Lei nº 13.460/2017"
   ],
   [
    "administrativo",
    "Lei nº 13.848/2019"
   ],
   [
    "administrativo",
    "Lei nº 14.133/2021"
   ],
   [
    "administrativo",
    "Lei nº 14.230/2021"
   ],
   [
    "administrativo",
    "Lei nº 4.320/1964"
   ],
   [
    "administrativo",
    "Lei nº 8.080/1990"
   ],
   [
    "administrativo",
    "Lei nº 8.429/1992"
   ],
   [
    "administrativo",
    "Lei nº 8.625/1993"
   ],
   [
    "administrativo",
    "Lei nº 8.958/1994"
   ],
   [
    "administrativo",
    "Lei nº 8.987/1995"
   ],
   [
    "administrativo",
    "Lei nº 9.394/1996"
   ],
   [
    "administrativo",
    "Lei nº 9.784/1999"
   ],
   [
    "ambiental",
    "Lei nº 10.257/2001"
   ],
   [
    "ambiental",
    "Lei nº 11.105/2005"
   ],
   [
    "ambiental",
    "Lei nº 6.938/1981"
   ],
   [
    "civil",
    "Decreto nº 10.604/2021"
   ],
   [
    "civil",
    "Decreto nº 9.921/2019"
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
    "Lei nº 10.741/2003"
   ],
   [
    "civil",
    "Lei nº 11.804/2008"
   ],
   [
    "civil",
    "Lei nº 12.318/2010"
   ],
   [
    "civil",
    "Lei nº 12.376/2010"
   ],
   [
    "civil",
    "Lei nº 12.965/2014"
   ],
   [
    "civil",
    "Lei nº 13.058/2014"
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
    "Lei nº 13.874/2019"
   ],
   [
    "civil",
    "Lei nº 14.010/2020"
   ],
   [
    "civil",
    "Lei nº 14.382/2022"
   ],
   [
    "civil",
    "Lei nº 14.443/2022"
   ],
   [
    "civil",
    "Lei nº 14.905/2024"
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
    "Lei nº 6.015/1973"
   ],
   [
    "civil",
    "Lei nº 6.766/1979"
   ],
   [
    "civil",
    "Lei nº 8.245/1991"
   ],
   [
    "civil",
    "Lei nº 8.560/1992"
   ],
   [
    "civil",
    "Lei nº 8.842/1994"
   ],
   [
    "civil",
    "Lei nº 8.935/1994"
   ],
   [
    "civil",
    "Lei nº 8.971/1994"
   ],
   [
    "civil",
    "Lei nº 9.278/1996"
   ],
   [
    "civil",
    "Lei nº 9.610/1998"
   ],
   [
    "constitucional",
    "CF/1988"
   ],
   [
    "consumidor",
    "Lei nº 8.078/1990"
   ],
   [
    "crianca",
    "Decreto nº 9.603/2018"
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
    "Lei nº 13.257/2016"
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
    "Lei nº 15.211/2025"
   ],
   [
    "crianca",
    "Lei nº 8.069/1990"
   ],
   [
    "eleitoral",
    "Lei Complementar nº 64/1990"
   ],
   [
    "eleitoral",
    "Lei Complementar nº 86/1996"
   ],
   [
    "eleitoral",
    "Lei nº 6.091/1974"
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
    "Decreto nº 2.044/1908"
   ],
   [
    "empresarial",
    "Decreto nº 3.708/1919"
   ],
   [
    "empresarial",
    "Decreto-Lei nº 167/1967"
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
    "Lei nº 14.112/2020"
   ],
   [
    "empresarial",
    "Lei nº 14.193/2021"
   ],
   [
    "empresarial",
    "Lei nº 14.430/2022"
   ],
   [
    "empresarial",
    "Lei nº 4.886/1965"
   ],
   [
    "empresarial",
    "Lei nº 6.024/1974"
   ],
   [
    "empresarial",
    "Lei nº 8.934/1994"
   ],
   [
    "empresarial",
    "Lei nº 9.609/1998"
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
    "Decreto nº 7.037/2009"
   ],
   [
    "humanos",
    "Decreto nº 9.571/2018"
   ],
   [
    "humanos",
    "Lei nº 11.346/2006"
   ],
   [
    "humanos",
    "Lei nº 7.716/1989"
   ],
   [
    "humanos",
    "Lei nº 7.853/1989"
   ],
   [
    "penal",
    "Decreto nº 4.388/2002"
   ],
   [
    "penal",
    "Decreto nº 5.015/2004"
   ],
   [
    "penal",
    "Decreto nº 7.030/2009"
   ],
   [
    "penal",
    "Decreto-Lei nº 1.001/1969"
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
    "Decreto-Lei nº 3.688/1941"
   ],
   [
    "penal",
    "Lei nº 1.521/1951"
   ],
   [
    "penal",
    "Lei nº 10.826/2003"
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
    "Lei nº 12.737/2012"
   ],
   [
    "penal",
    "Lei nº 12.850/2013"
   ],
   [
    "penal",
    "Lei nº 12.984/2014"
   ],
   [
    "penal",
    "Lei nº 13.260/2016"
   ],
   [
    "penal",
    "Lei nº 13.675/2018"
   ],
   [
    "penal",
    "Lei nº 13.869/2019"
   ],
   [
    "penal",
    "Lei nº 13.964/2019"
   ],
   [
    "penal",
    "Lei nº 14.188/2021"
   ],
   [
    "penal",
    "Lei nº 14.245/2021"
   ],
   [
    "penal",
    "Lei nº 14.322/2022"
   ],
   [
    "penal",
    "Lei nº 14.597/2023"
   ],
   [
    "penal",
    "Lei nº 15.358/2026"
   ],
   [
    "penal",
    "Lei nº 15.384/2026"
   ],
   [
    "penal",
    "Lei nº 2.889/1956"
   ],
   [
    "penal",
    "Lei nº 4.898/1965"
   ],
   [
    "penal",
    "Lei nº 6.001/1973"
   ],
   [
    "penal",
    "Lei nº 7.210/1984"
   ],
   [
    "penal",
    "Lei nº 7.492/1986"
   ],
   [
    "penal",
    "Lei nº 7.716/1989"
   ],
   [
    "penal",
    "Lei nº 7.802/1989"
   ],
   [
    "penal",
    "Lei nº 8.072/1990"
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
    "Lei nº 9.029/1995"
   ],
   [
    "penal",
    "Lei nº 9.263/1996"
   ],
   [
    "penal",
    "Lei nº 9.434/1997"
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
    "Lei nº 9.605/1998"
   ],
   [
    "penal",
    "Lei nº 9.613/1998"
   ],
   [
    "previdenciario",
    "Lei nº 8.742/1993"
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
    "processual_civil",
    "Lei nº 4.717/1965"
   ],
   [
    "processual_civil",
    "Lei nº 7.347/1985"
   ],
   [
    "processual_civil",
    "Lei nº 8.437/1992"
   ],
   [
    "processual_civil",
    "Lei nº 9.099/1995"
   ],
   [
    "processual_civil",
    "Lei nº 9.494/1997"
   ],
   [
    "processual_civil",
    "Lei nº 9.507/1997"
   ],
   [
    "processual_penal",
    "Decreto-Lei nº 1.002/1969"
   ],
   [
    "processual_penal",
    "Decreto-Lei nº 201/1967"
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
    "Lei nº 1.579/1952"
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
    "Lei nº 11.719/2008"
   ],
   [
    "processual_penal",
    "Lei nº 12.313/2010"
   ],
   [
    "processual_penal",
    "Lei nº 12.830/2013"
   ],
   [
    "processual_penal",
    "Lei nº 12.850/2013"
   ],
   [
    "processual_penal",
    "Lei nº 13.431/2017"
   ],
   [
    "processual_penal",
    "Lei nº 5.249/1967"
   ],
   [
    "processual_penal",
    "Lei nº 7.210/1984"
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
    "tributario",
    "Decreto Estadual (MG) nº 44.747/2008"
   ],
   [
    "tributario",
    "Decreto nº 70.235/1972"
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
    "Lei Complementar nº 105/2001"
   ],
   [
    "tributario",
    "Lei Complementar nº 159/2017"
   ],
   [
    "tributario",
    "Lei Estadual (PR) nº 18.877/2016"
   ],
   [
    "tributario",
    "Lei Estadual (SC) nº 3.938/1966"
   ],
   [
    "tributario",
    "Lei nº 5.172/1966"
   ]
  ],
  "tipo": "edital"
 },
 {
  "id": "pc-df-delegado-2026",
  "sigla": "PCDF",
  "cargo": "Delegado de Polícia",
  "orgao": "Polícia Civil do Distrito Federal",
  "titulo": "Concurso Público para Delegado de Polícia da Polícia Civil do Distrito Federal",
  "edital": "Edital nº 1 – PCDF – Delegado, de 3 de fevereiro de 2026",
  "grupos": [
   {
    "nome": "Conhecimentos Específicos",
    "disciplinas": [
     "Direito Administrativo",
     "Direito Constitucional",
     "Direito Civil",
     "Direito Empresarial",
     "Direito Penal",
     "Direito Tributário",
     "Medicina Legal",
     "Direito Processual Penal",
     "Direito Ambiental"
    ]
   }
  ],
  "leis": [
   [
    "administrativo",
    "Decreto nº 9.830/2019"
   ],
   [
    "administrativo",
    "Lei Complementar (DF) nº 840/2011"
   ],
   [
    "administrativo",
    "Lei Complementar (SC) nº 491/2010"
   ],
   [
    "administrativo",
    "Lei Complementar (SE) nº 33/1996"
   ],
   [
    "administrativo",
    "Lei Estadual (BA) nº 6.677/1994"
   ],
   [
    "administrativo",
    "Lei Estadual (MA) nº 6.107/1994"
   ],
   [
    "administrativo",
    "Lei Estadual (MS) nº 1.102/1990"
   ],
   [
    "administrativo",
    "Lei Estadual (SC) nº 6.745/1985"
   ],
   [
    "administrativo",
    "Lei Estadual (SP) nº 10.177/1998"
   ],
   [
    "administrativo",
    "Lei nº 12.846/2013"
   ],
   [
    "administrativo",
    "Lei nº 13.460/2017"
   ],
   [
    "administrativo",
    "Lei nº 13.848/2019"
   ],
   [
    "administrativo",
    "Lei nº 14.133/2021"
   ],
   [
    "administrativo",
    "Lei nº 14.230/2021"
   ],
   [
    "administrativo",
    "Lei nº 15.047/2024"
   ],
   [
    "administrativo",
    "Lei nº 4.878/1965"
   ],
   [
    "administrativo",
    "Lei nº 8.112/1990"
   ],
   [
    "administrativo",
    "Lei nº 8.429/1992"
   ],
   [
    "administrativo",
    "Lei nº 8.987/1995"
   ],
   [
    "administrativo",
    "Lei nº 9.784/1999"
   ],
   [
    "administrativo",
    "Lei nº 9.790/1999"
   ],
   [
    "ambiental",
    "Decreto nº 6.514/2008"
   ],
   [
    "ambiental",
    "Decreto nº 99.274/1990"
   ],
   [
    "ambiental",
    "Lei Complementar nº 140/2011"
   ],
   [
    "ambiental",
    "Lei Estadual (SC) nº 14.675/2009"
   ],
   [
    "ambiental",
    "Lei Estadual (SC) nº 16.342/2014"
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
    "Lei nº 6.938/1981"
   ],
   [
    "ambiental",
    "Medida Provisória nº 1.308/2025"
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
    "Lei nº 12.376/2010"
   ],
   [
    "civil",
    "Lei nº 13.146/2015"
   ],
   [
    "civil",
    "Lei nº 13.874/2019"
   ],
   [
    "civil",
    "Lei nº 6.766/1979"
   ],
   [
    "constitucional",
    "Lei nº 14.735/2023"
   ],
   [
    "consumidor",
    "Lei nº 8.078/1990"
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
    "eleitoral",
    "Lei nº 4.737/1965"
   ],
   [
    "empresarial",
    "Lei nº 11.101/2005"
   ],
   [
    "empresarial",
    "Lei nº 14.112/2020"
   ],
   [
    "empresarial",
    "Lei nº 14.193/2021"
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
    "humanos",
    "Lei nº 7.716/1989"
   ],
   [
    "penal",
    "Decreto nº 4.388/2002"
   ],
   [
    "penal",
    "Decreto nº 7.030/2009"
   ],
   [
    "penal",
    "Decreto-Lei nº 1.001/1969"
   ],
   [
    "penal",
    "Decreto-Lei nº 2.848/1940"
   ],
   [
    "penal",
    "Decreto-Lei nº 3.688/1941"
   ],
   [
    "penal",
    "Decreto-Lei nº 3.914/1941"
   ],
   [
    "penal",
    "Decreto-Lei nº 6.259/1944"
   ],
   [
    "penal",
    "Lei nº 1.521/1951"
   ],
   [
    "penal",
    "Lei nº 10.826/2003"
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
    "Lei nº 12.984/2014"
   ],
   [
    "penal",
    "Lei nº 13.260/2016"
   ],
   [
    "penal",
    "Lei nº 13.675/2018"
   ],
   [
    "penal",
    "Lei nº 13.869/2019"
   ],
   [
    "penal",
    "Lei nº 13.964/2019"
   ],
   [
    "penal",
    "Lei nº 14.188/2021"
   ],
   [
    "penal",
    "Lei nº 14.322/2022"
   ],
   [
    "penal",
    "Lei nº 14.597/2023"
   ],
   [
    "penal",
    "Lei nº 15.358/2026"
   ],
   [
    "penal",
    "Lei nº 15.384/2026"
   ],
   [
    "penal",
    "Lei nº 2.889/1956"
   ],
   [
    "penal",
    "Lei nº 4.898/1965"
   ],
   [
    "penal",
    "Lei nº 5.553/1968"
   ],
   [
    "penal",
    "Lei nº 7.492/1986"
   ],
   [
    "penal",
    "Lei nº 7.716/1989"
   ],
   [
    "penal",
    "Lei nº 8.072/1990"
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
    "Lei nº 9.263/1996"
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
    "Lei nº 9.605/1998"
   ],
   [
    "penal",
    "Lei nº 9.613/1998"
   ],
   [
    "processual_civil",
    "Lei nº 9.099/1995"
   ],
   [
    "processual_penal",
    "Decreto-Lei nº 1.002/1969"
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
    "Lei nº 12.037/2009"
   ],
   [
    "processual_penal",
    "Lei nº 12.830/2013"
   ],
   [
    "processual_penal",
    "Lei nº 12.850/2013"
   ],
   [
    "processual_penal",
    "Lei nº 13.431/2017"
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
    "tributario",
    "Emenda Constitucional nº 132/2023"
   ],
   [
    "tributario",
    "Lei Complementar (SC) nº 465/2009"
   ],
   [
    "tributario",
    "Lei Complementar nº 105/2001"
   ],
   [
    "tributario",
    "Lei Complementar nº 116/2003"
   ],
   [
    "tributario",
    "Lei Estadual (PR) nº 18.877/2016"
   ],
   [
    "tributario",
    "Lei Estadual (SC) nº 13.136/2004"
   ],
   [
    "tributario",
    "Lei Estadual (SC) nº 3.938/1966"
   ],
   [
    "tributario",
    "Lei nº 10.169/2000"
   ],
   [
    "tributario",
    "Lei nº 5.172/1966"
   ]
  ],
  "tipo": "edital"
 },
 {
  "id": "pc-pr-delegado-2026",
  "sigla": "PCPR",
  "cargo": "Delegado de Polícia",
  "orgao": "Polícia Civil do Estado do Paraná",
  "titulo": "Concurso Público da Polícia Civil do Paraná",
  "edital": "Edital n.º 01/2026",
  "grupos": [
   {
    "nome": "Conhecimentos Específicos",
    "disciplinas": [
     "Direito Penal",
     "Direito Processual Penal",
     "Legislação Penal e Processual Penal Extravagante",
     "Direito Constitucional",
     "Direito Administrativo e Gestão Pública",
     "Direitos Humanos"
    ]
   }
  ],
  "leis": [
   [
    "administrativo",
    "Lei Complementar (DF) nº 840/2011"
   ],
   [
    "administrativo",
    "Lei Complementar (SE) nº 33/1996"
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
    "Lei nº 14.230/2021"
   ],
   [
    "administrativo",
    "Lei nº 15.047/2024"
   ],
   [
    "administrativo",
    "Lei nº 4.878/1965"
   ],
   [
    "administrativo",
    "Lei nº 8.112/1990"
   ],
   [
    "administrativo",
    "Lei nº 8.429/1992"
   ],
   [
    "administrativo",
    "Lei nº 8.987/1995"
   ],
   [
    "constitucional",
    "CF/1988"
   ],
   [
    "humanos",
    "Decreto nº 10.088/2019"
   ],
   [
    "humanos",
    "Decreto nº 3.298/1999"
   ],
   [
    "humanos",
    "Decreto nº 4.886/2003"
   ],
   [
    "humanos",
    "Decreto nº 6.040/2007"
   ],
   [
    "humanos",
    "Decreto nº 678/1992"
   ],
   [
    "humanos",
    "Decreto nº 7.037/2009"
   ],
   [
    "humanos",
    "Decreto nº 7.053/2009"
   ],
   [
    "humanos",
    "Decreto nº 9.571/2018"
   ],
   [
    "humanos",
    "Resolução A/RES/61/295 (ONU, 2007)"
   ],
   [
    "penal",
    "Decreto nº 5.015/2004"
   ],
   [
    "penal",
    "Decreto-Lei nº 1.001/1969"
   ],
   [
    "penal",
    "Decreto-Lei nº 2.848/1940"
   ],
   [
    "penal",
    "Decreto-Lei nº 3.688/1941"
   ],
   [
    "penal",
    "Decreto-Lei nº 3.914/1941"
   ],
   [
    "penal",
    "Decreto-Lei nº 6.259/1944"
   ],
   [
    "penal",
    "Lei nº 1.521/1951"
   ],
   [
    "penal",
    "Lei nº 12.694/2012"
   ],
   [
    "penal",
    "Lei nº 13.964/2019"
   ],
   [
    "penal",
    "Lei nº 14.188/2021"
   ],
   [
    "penal",
    "Lei nº 14.322/2022"
   ],
   [
    "penal",
    "Lei nº 15.358/2026"
   ],
   [
    "penal",
    "Lei nº 15.384/2026"
   ],
   [
    "penal",
    "Lei nº 4.898/1965"
   ],
   [
    "penal",
    "Lei nº 7.210/1984"
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
    "Lei nº 8.137/1990"
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
    "Lei nº 9.605/1998"
   ],
   [
    "penal",
    "Lei nº 9.613/1998"
   ],
   [
    "processual_penal",
    "Decreto-Lei nº 1.002/1969"
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
    "Lei nº 12.830/2013"
   ],
   [
    "processual_penal",
    "Lei nº 13.431/2017"
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
   ]
  ],
  "tipo": "edital"
 },
 {
  "id": "pc-ba-delegado-2026",
  "sigla": "PCBA",
  "cargo": "Delegado de Polícia Civil",
  "orgao": "Polícia Civil do Estado da Bahia",
  "titulo": "Concurso Público para Delegado, Escrivão e Investigador de Polícia Civil da Bahia",
  "edital": "Edital de Abertura de Inscrições – SAEB nº 02/2026",
  "grupos": [
   {
    "nome": "Conhecimentos Específicos",
    "disciplinas": [
     "Direito Administrativo",
     "Direito Civil e Empresarial",
     "Direito Constitucional",
     "Direito Penal",
     "Direito Processual Penal",
     "Direito Processual Civil",
     "Direito Tributário",
     "Direito Ambiental",
     "Legislação Penal e Processual Penal Extravagante",
     "Criminologia"
    ]
   }
  ],
  "leis": [
   [
    "administrativo",
    "Decreto nº 1.171/1994"
   ],
   [
    "administrativo",
    "Decreto nº 6.017/2007"
   ],
   [
    "administrativo",
    "Lei Complementar (DF) nº 840/2011"
   ],
   [
    "administrativo",
    "Lei Complementar (SC) nº 491/2010"
   ],
   [
    "administrativo",
    "Lei Complementar (SE) nº 33/1996"
   ],
   [
    "administrativo",
    "Lei Estadual (BA) nº 11.370/2009"
   ],
   [
    "administrativo",
    "Lei Estadual (BA) nº 6.677/1994"
   ],
   [
    "administrativo",
    "Lei Estadual (SP) nº 10.177/1998"
   ],
   [
    "administrativo",
    "Lei nº 11.079/2004"
   ],
   [
    "administrativo",
    "Lei nº 13.460/2017"
   ],
   [
    "administrativo",
    "Lei nº 13.848/2019"
   ],
   [
    "administrativo",
    "Lei nº 14.133/2021"
   ],
   [
    "administrativo",
    "Lei nº 14.230/2021"
   ],
   [
    "administrativo",
    "Lei nº 15.047/2024"
   ],
   [
    "administrativo",
    "Lei nº 4.878/1965"
   ],
   [
    "administrativo",
    "Lei nº 8.112/1990"
   ],
   [
    "administrativo",
    "Lei nº 8.429/1992"
   ],
   [
    "administrativo",
    "Lei nº 8.987/1995"
   ],
   [
    "administrativo",
    "Lei nº 9.784/1999"
   ],
   [
    "administrativo",
    "Lei nº 9.790/1999"
   ],
   [
    "ambiental",
    "Decreto nº 10.936/2022"
   ],
   [
    "ambiental",
    "Decreto nº 6.514/2008"
   ],
   [
    "ambiental",
    "Decreto nº 99.274/1990"
   ],
   [
    "ambiental",
    "Lei Estadual (SC) nº 14.675/2009"
   ],
   [
    "ambiental",
    "Lei Estadual (SC) nº 16.342/2014"
   ],
   [
    "ambiental",
    "Lei nº 11.105/2005"
   ],
   [
    "ambiental",
    "Lei nº 11.516/2007"
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
    "Lei nº 12.334/2010"
   ],
   [
    "ambiental",
    "Lei nº 12.587/2012"
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
    "Lei nº 14.755/2023"
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
    "Lei nº 6.938/1981"
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
    "Lei nº 9.985/2000"
   ],
   [
    "ambiental",
    "Medida Provisória nº 1.308/2025"
   ],
   [
    "civil",
    "Decreto nº 10.604/2021"
   ],
   [
    "civil",
    "Decreto nº 9.921/2019"
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
    "Lei nº 12.376/2010"
   ],
   [
    "civil",
    "Lei nº 13.146/2015"
   ],
   [
    "constitucional",
    "CF/1988"
   ],
   [
    "consumidor",
    "Lei nº 8.078/1990"
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
    "Lei nº 9.279/1996"
   ],
   [
    "empresarial",
    "Lei nº 9.609/1998"
   ],
   [
    "humanos",
    "Lei nº 7.716/1989"
   ],
   [
    "penal",
    "Decreto nº 5.015/2004"
   ],
   [
    "penal",
    "Decreto-Lei nº 201/1967"
   ],
   [
    "penal",
    "Decreto-Lei nº 3.688/1941"
   ],
   [
    "penal",
    "Decreto-Lei nº 6.259/1944"
   ],
   [
    "penal",
    "Lei nº 1.521/1951"
   ],
   [
    "penal",
    "Lei nº 10.826/2003"
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
    "Lei nº 13.869/2019"
   ],
   [
    "penal",
    "Lei nº 14.188/2021"
   ],
   [
    "penal",
    "Lei nº 14.597/2023"
   ],
   [
    "penal",
    "Lei nº 15.358/2026"
   ],
   [
    "penal",
    "Lei nº 2.889/1956"
   ],
   [
    "penal",
    "Lei nº 4.898/1965"
   ],
   [
    "penal",
    "Lei nº 7.210/1984"
   ],
   [
    "penal",
    "Lei nº 7.492/1986"
   ],
   [
    "penal",
    "Lei nº 7.716/1989"
   ],
   [
    "penal",
    "Lei nº 8.072/1990"
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
    "Lei nº 9.434/1997"
   ],
   [
    "penal",
    "Lei nº 9.455/1997"
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
    "Lei nº 9.613/1998"
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
    "Lei nº 4.717/1965"
   ],
   [
    "processual_civil",
    "Lei nº 7.347/1985"
   ],
   [
    "processual_civil",
    "Lei nº 9.099/1995"
   ],
   [
    "processual_civil",
    "Lei nº 9.494/1997"
   ],
   [
    "processual_penal",
    "Decreto-Lei nº 1.002/1969"
   ],
   [
    "processual_penal",
    "Decreto-Lei nº 201/1967"
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
    "Lei nº 12.037/2009"
   ],
   [
    "processual_penal",
    "Lei nº 12.830/2013"
   ],
   [
    "processual_penal",
    "Lei nº 12.850/2013"
   ],
   [
    "processual_penal",
    "Lei nº 13.431/2017"
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
    "tributario",
    "Lei Complementar (SC) nº 465/2009"
   ],
   [
    "tributario",
    "Lei Complementar nº 118/2005"
   ],
   [
    "tributario",
    "Lei Estadual (PR) nº 18.877/2016"
   ],
   [
    "tributario",
    "Lei Estadual (SC) nº 13.136/2004"
   ],
   [
    "tributario",
    "Lei Estadual (SC) nº 3.938/1966"
   ],
   [
    "tributario",
    "Lei nº 10.169/2000"
   ],
   [
    "tributario",
    "Lei nº 5.172/1966"
   ],
   [
    "tributario",
    "Lei nº 6.830/1980"
   ]
  ],
  "tipo": "edital"
 },
 {
  "id": "mpf-31-procurador-2025",
  "sigla": "MPF",
  "cargo": "Procurador da República",
  "orgao": "Ministério Público Federal",
  "titulo": "31º Concurso para Provimento de Cargos de Procurador da República",
  "edital": "Edital PGR/MPF nº 1/2025",
  "grupos": [
   {
    "nome": "Conhecimentos Específicos",
    "disciplinas": [
     "Direito Constitucional",
     "Direito Eleitoral",
     "Direito Administrativo",
     "Direito Ambiental",
     "Direito Internacional Público e Privado",
     "Direitos Humanos",
     "Direito Financeiro e Direito Tributário",
     "Direito Civil",
     "Direito Processual Civil",
     "Direito Econômico",
     "Direito Penal",
     "Direito Processual Penal"
    ]
   }
  ],
  "leis": [
   [
    "administrativo",
    "Decreto nº 6.017/2007"
   ],
   [
    "administrativo",
    "Decreto-Lei nº 4.597/1942"
   ],
   [
    "administrativo",
    "Lei Complementar (DF) nº 840/2011"
   ],
   [
    "administrativo",
    "Lei Complementar (MS) nº 72/1994"
   ],
   [
    "administrativo",
    "Lei Complementar (SE) nº 33/1996"
   ],
   [
    "administrativo",
    "Lei Complementar nº 101/2000"
   ],
   [
    "administrativo",
    "Lei Complementar nº 220/2025"
   ],
   [
    "administrativo",
    "Lei Complementar nº 75/1993"
   ],
   [
    "administrativo",
    "Lei nº 11.079/2004"
   ],
   [
    "administrativo",
    "Lei nº 12.846/2013"
   ],
   [
    "administrativo",
    "Lei nº 13.460/2017"
   ],
   [
    "administrativo",
    "Lei nº 13.848/2019"
   ],
   [
    "administrativo",
    "Lei nº 14.133/2021"
   ],
   [
    "administrativo",
    "Lei nº 14.230/2021"
   ],
   [
    "administrativo",
    "Lei nº 15.047/2024"
   ],
   [
    "administrativo",
    "Lei nº 4.878/1965"
   ],
   [
    "administrativo",
    "Lei nº 8.112/1990"
   ],
   [
    "administrativo",
    "Lei nº 8.429/1992"
   ],
   [
    "administrativo",
    "Lei nº 8.625/1993"
   ],
   [
    "administrativo",
    "Lei nº 8.987/1995"
   ],
   [
    "ambiental",
    "Decreto nº 10.936/2022"
   ],
   [
    "ambiental",
    "Decreto nº 6.514/2008"
   ],
   [
    "ambiental",
    "Decreto nº 99.274/1990"
   ],
   [
    "ambiental",
    "Lei Estadual (SC) nº 14.675/2009"
   ],
   [
    "ambiental",
    "Lei Estadual (SC) nº 16.342/2014"
   ],
   [
    "ambiental",
    "Lei nº 11.124/2005"
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
    "Lei nº 12.334/2010"
   ],
   [
    "ambiental",
    "Lei nº 12.587/2012"
   ],
   [
    "ambiental",
    "Lei nº 12.608/2012"
   ],
   [
    "ambiental",
    "Lei nº 14.119/2021"
   ],
   [
    "ambiental",
    "Lei nº 14.755/2023"
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
    "Lei nº 6.938/1981"
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
    "Lei nº 9.985/2000"
   ],
   [
    "ambiental",
    "Medida Provisória nº 1.308/2025"
   ],
   [
    "civil",
    "Decreto nº 3.413/2000"
   ],
   [
    "civil",
    "Decreto-Lei nº 4.657/1942"
   ],
   [
    "civil",
    "Decreto-Lei nº 911/1969"
   ],
   [
    "civil",
    "Lei nº 12.376/2010"
   ],
   [
    "civil",
    "Lei nº 12.965/2014"
   ],
   [
    "civil",
    "Lei nº 13.146/2015"
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
    "Lei nº 4.380/1964"
   ],
   [
    "civil",
    "Lei nº 8.971/1994"
   ],
   [
    "civil",
    "Lei nº 9.278/1996"
   ],
   [
    "civil",
    "Lei nº 9.514/1997"
   ],
   [
    "constitucional",
    "Emenda Constitucional nº 80/2014"
   ],
   [
    "constitucional",
    "Lei nº 1.079/1950"
   ],
   [
    "consumidor",
    "Lei nº 8.078/1990"
   ],
   [
    "eleitoral",
    "Lei Complementar nº 86/1996"
   ],
   [
    "eleitoral",
    "Lei nº 14.192/2021"
   ],
   [
    "eleitoral",
    "Lei nº 6.091/1974"
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
    "humanos",
    "Decreto nº 678/1992"
   ],
   [
    "humanos",
    "Decreto nº 7.037/2009"
   ],
   [
    "humanos",
    "Decreto nº 9.571/2018"
   ],
   [
    "humanos",
    "Lei nº 13.445/2017"
   ],
   [
    "penal",
    "Decreto nº 154/1991"
   ],
   [
    "penal",
    "Decreto nº 4.388/2002"
   ],
   [
    "penal",
    "Decreto-Lei nº 201/1967"
   ],
   [
    "penal",
    "Lei nº 1.521/1951"
   ],
   [
    "penal",
    "Lei nº 10.826/2003"
   ],
   [
    "penal",
    "Lei nº 11.340/2006"
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
    "Lei nº 14.188/2021"
   ],
   [
    "penal",
    "Lei nº 14.532/2023"
   ],
   [
    "penal",
    "Lei nº 15.358/2026"
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
    "Lei nº 8.176/1991"
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
    "previdenciario",
    "Lei nº 8.212/1991"
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
    "processual_civil",
    "Lei nº 4.717/1965"
   ],
   [
    "processual_civil",
    "Lei nº 7.347/1985"
   ],
   [
    "processual_civil",
    "Lei nº 9.099/1995"
   ],
   [
    "processual_civil",
    "Lei nº 9.507/1997"
   ],
   [
    "processual_penal",
    "Decreto-Lei nº 1.002/1969"
   ],
   [
    "processual_penal",
    "Decreto-Lei nº 201/1967"
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
    "Lei nº 11.340/2006"
   ],
   [
    "processual_penal",
    "Lei nº 11.671/2008"
   ],
   [
    "processual_penal",
    "Lei nº 12.313/2010"
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
    "Lei nº 13.256/2016"
   ],
   [
    "processual_penal",
    "Lei nº 7.210/1984"
   ],
   [
    "processual_penal",
    "Lei nº 8.457/1992"
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
    "Lei nº 9.807/1999"
   ],
   [
    "tributario",
    "Decreto Estadual (MG) nº 44.747/2008"
   ],
   [
    "tributario",
    "Decreto nº 70.235/1972"
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
    "Lei Complementar nº 118/2005"
   ],
   [
    "tributario",
    "Lei Complementar nº 159/2017"
   ],
   [
    "tributario",
    "Lei Estadual (PR) nº 18.877/2016"
   ],
   [
    "tributario",
    "Lei Estadual (SC) nº 3.938/1966"
   ],
   [
    "tributario",
    "Lei nº 10.169/2000"
   ],
   [
    "tributario",
    "Lei nº 11.941/2009"
   ],
   [
    "tributario",
    "Lei nº 5.172/1966"
   ],
   [
    "tributario",
    "Lei nº 6.830/1980"
   ],
   [
    "tributario",
    "Lei nº 8.397/1992"
   ]
  ],
  "tipo": "edital"
 },
 {
  "id": "agu-procurador-federal-2022",
  "sigla": "AGU",
  "cargo": "Procurador Federal",
  "orgao": "Advocacia-Geral da União (Procuradoria-Geral Federal)",
  "titulo": "Concurso Público para Procurador Federal",
  "edital": "Edital nº 1 – AGU/PGF, de 2022",
  "grupos": [
   {
    "nome": "Conhecimentos Específicos",
    "disciplinas": [
     "Direito Constitucional",
     "Direito Administrativo",
     "Direito Financeiro e Econômico",
     "Direito Tributário",
     "Direito da Seguridade Social",
     "Direito Ambiental",
     "Direito Civil",
     "Direito Processual Civil",
     "Direito Empresarial",
     "Direito Internacional Público",
     "Direito Penal",
     "Direito Processual Penal",
     "Direito do Trabalho",
     "Direito Processual do Trabalho",
     "Direito Agrário",
     "Legislação sobre Educação e Ciência, Tecnologia e Inovação"
    ]
   }
  ],
  "leis": [
   [
    "administrativo",
    "Decreto nº 1.171/1994"
   ],
   [
    "administrativo",
    "Decreto nº 10.201/2020"
   ],
   [
    "administrativo",
    "Decreto nº 10.592/2020"
   ],
   [
    "administrativo",
    "Decreto nº 6.017/2007"
   ],
   [
    "administrativo",
    "Decreto nº 6.029/2007"
   ],
   [
    "administrativo",
    "Decreto nº 9.311/2018"
   ],
   [
    "administrativo",
    "Decreto-Lei nº 3.365/1941"
   ],
   [
    "administrativo",
    "Decreto-Lei nº 4.597/1942"
   ],
   [
    "administrativo",
    "Lei Complementar (DF) nº 840/2011"
   ],
   [
    "administrativo",
    "Lei Complementar (SC) nº 491/2010"
   ],
   [
    "administrativo",
    "Lei Complementar (SE) nº 33/1996"
   ],
   [
    "administrativo",
    "Lei Complementar nº 101/2000"
   ],
   [
    "administrativo",
    "Lei Complementar nº 73/1993"
   ],
   [
    "administrativo",
    "Lei Complementar nº 76/1993"
   ],
   [
    "administrativo",
    "Lei Estadual (BA) nº 6.677/1994"
   ],
   [
    "administrativo",
    "Lei Estadual (MA) nº 6.107/1994"
   ],
   [
    "administrativo",
    "Lei Estadual (MS) nº 1.102/1990"
   ],
   [
    "administrativo",
    "Lei Estadual (SC) nº 6.745/1985"
   ],
   [
    "administrativo",
    "Lei Estadual (SP) nº 10.177/1998"
   ],
   [
    "administrativo",
    "Lei nº 10.480/2002"
   ],
   [
    "administrativo",
    "Lei nº 10.520/2002"
   ],
   [
    "administrativo",
    "Lei nº 10.973/2004"
   ],
   [
    "administrativo",
    "Lei nº 11.079/2004"
   ],
   [
    "administrativo",
    "Lei nº 12.462/2011"
   ],
   [
    "administrativo",
    "Lei nº 12.783/2013"
   ],
   [
    "administrativo",
    "Lei nº 12.813/2013"
   ],
   [
    "administrativo",
    "Lei nº 12.815/2013"
   ],
   [
    "administrativo",
    "Lei nº 12.846/2013"
   ],
   [
    "administrativo",
    "Lei nº 13.178/2015"
   ],
   [
    "administrativo",
    "Lei nº 13.243/2016"
   ],
   [
    "administrativo",
    "Lei nº 13.303/2016"
   ],
   [
    "administrativo",
    "Lei nº 13.448/2017"
   ],
   [
    "administrativo",
    "Lei nº 13.460/2017"
   ],
   [
    "administrativo",
    "Lei nº 13.848/2019"
   ],
   [
    "administrativo",
    "Lei nº 14.133/2021"
   ],
   [
    "administrativo",
    "Lei nº 14.230/2021"
   ],
   [
    "administrativo",
    "Lei nº 4.320/1964"
   ],
   [
    "administrativo",
    "Lei nº 4.878/1965"
   ],
   [
    "administrativo",
    "Lei nº 6.969/1981"
   ],
   [
    "administrativo",
    "Lei nº 8.112/1990"
   ],
   [
    "administrativo",
    "Lei nº 8.429/1992"
   ],
   [
    "administrativo",
    "Lei nº 8.629/1993"
   ],
   [
    "administrativo",
    "Lei nº 8.666/1993"
   ],
   [
    "administrativo",
    "Lei nº 9.028/1995"
   ],
   [
    "administrativo",
    "Lei nº 9.394/1996"
   ],
   [
    "administrativo",
    "Lei nº 9.469/1997"
   ],
   [
    "administrativo",
    "Lei nº 9.784/1999"
   ],
   [
    "administrativo",
    "Lei nº 9.790/1999"
   ],
   [
    "administrativo",
    "Lei nº 9.873/1999"
   ],
   [
    "administrativo",
    "Lei nº 9.986/2000"
   ],
   [
    "ambiental",
    "Decreto nº 10.936/2022"
   ],
   [
    "ambiental",
    "Decreto nº 6.514/2008"
   ],
   [
    "ambiental",
    "Decreto nº 99.274/1990"
   ],
   [
    "ambiental",
    "Lei Estadual (SC) nº 14.675/2009"
   ],
   [
    "ambiental",
    "Lei Estadual (SC) nº 16.342/2014"
   ],
   [
    "ambiental",
    "Lei nº 11.107/2005"
   ],
   [
    "ambiental",
    "Lei nº 11.516/2007"
   ],
   [
    "ambiental",
    "Lei nº 11.952/2009"
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
    "Lei nº 12.334/2010"
   ],
   [
    "ambiental",
    "Lei nº 12.587/2012"
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
    "Lei nº 14.755/2023"
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
    "Lei nº 6.938/1981"
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
    "Lei nº 9.985/2000"
   ],
   [
    "ambiental",
    "Medida Provisória nº 1.308/2025"
   ],
   [
    "civil",
    "Decreto nº 10.604/2021"
   ],
   [
    "civil",
    "Decreto nº 9.921/2019"
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
    "Lei nº 12.376/2010"
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
    "Lei nº 14.382/2022"
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
    "Lei nº 9.492/1997"
   ],
   [
    "constitucional",
    "Emenda Constitucional nº 45/2004"
   ],
   [
    "constitucional",
    "Lei nº 9.868/1999"
   ],
   [
    "consumidor",
    "Lei nº 8.078/1990"
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
    "Lei nº 14.112/2020"
   ],
   [
    "empresarial",
    "Lei nº 6.024/1974"
   ],
   [
    "empresarial",
    "Lei nº 7.913/1989"
   ],
   [
    "empresarial",
    "Lei nº 9.279/1996"
   ],
   [
    "humanos",
    "Decreto nº 4.887/2003"
   ],
   [
    "humanos",
    "Lei nº 7.716/1989"
   ],
   [
    "penal",
    "Lei nº 1.521/1951"
   ],
   [
    "penal",
    "Lei nº 12.850/2013"
   ],
   [
    "penal",
    "Lei nº 13.869/2019"
   ],
   [
    "penal",
    "Lei nº 13.964/2019"
   ],
   [
    "penal",
    "Lei nº 4.898/1965"
   ],
   [
    "penal",
    "Lei nº 7.492/1986"
   ],
   [
    "penal",
    "Lei nº 7.716/1989"
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
    "Lei nº 9.249/1995"
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
    "previdenciario",
    "Decreto nº 3.048/1999"
   ],
   [
    "previdenciario",
    "Decreto nº 8.424/2015"
   ],
   [
    "previdenciario",
    "Emenda Constitucional nº 103/2019"
   ],
   [
    "previdenciario",
    "Lei Complementar nº 108/2001"
   ],
   [
    "previdenciario",
    "Lei Complementar nº 109/2001"
   ],
   [
    "previdenciario",
    "Lei Complementar nº 142/2013"
   ],
   [
    "previdenciario",
    "Lei nº 10.779/2003"
   ],
   [
    "previdenciario",
    "Lei nº 12.435/2011"
   ],
   [
    "previdenciario",
    "Lei nº 12.618/2012"
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
    "Lei nº 8.742/1993"
   ],
   [
    "processual_civil",
    "Lei nº 10.259/2001"
   ],
   [
    "processual_civil",
    "Lei nº 11.418/2006"
   ],
   [
    "processual_civil",
    "Lei nº 11.672/2008"
   ],
   [
    "processual_civil",
    "Lei nº 12.153/2009"
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
    "Lei nº 9.099/1995"
   ],
   [
    "processual_civil",
    "Lei nº 9.307/1996"
   ],
   [
    "processual_civil",
    "Lei nº 9.494/1997"
   ],
   [
    "processual_civil",
    "Lei nº 9.507/1997"
   ],
   [
    "processual_penal",
    "Lei nº 12.850/2013"
   ],
   [
    "processual_penal",
    "Lei nº 5.249/1967"
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
    "trabalhista",
    "Decreto nº 9.507/2018"
   ],
   [
    "trabalhista",
    "Lei nº 10.035/2000"
   ],
   [
    "tributario",
    "Lei Complementar nº 101/2000"
   ],
   [
    "tributario",
    "Lei Complementar nº 118/2005"
   ],
   [
    "tributario",
    "Lei Estadual (SC) nº 3.938/1966"
   ],
   [
    "tributario",
    "Lei nº 10.169/2000"
   ],
   [
    "tributario",
    "Lei nº 10.522/2002"
   ],
   [
    "tributario",
    "Lei nº 13.988/2020"
   ],
   [
    "tributario",
    "Lei nº 5.172/1966"
   ],
   [
    "tributario",
    "Lei nº 6.830/1980"
   ],
   [
    "tributario",
    "Lei nº 8.397/1992"
   ]
  ],
  "tipo": "edital"
 },
 {
  "id": "tjpa-1-2025",
  "sigla": "TJPA",
  "cargo": "Juiz Substituto",
  "orgao": "Tribunal de Justiça do Estado do Pará",
  "titulo": "Concurso Público para Ingresso na Magistratura do Estado do Pará",
  "edital": "Edital nº 01/2025",
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
    "administrativo",
    "Decreto nº 7.746/2012"
   ],
   [
    "administrativo",
    "Decreto-Lei nº 3.365/1941"
   ],
   [
    "administrativo",
    "Lei Complementar (DF) nº 840/2011"
   ],
   [
    "administrativo",
    "Lei Complementar (MT) nº 04/1990"
   ],
   [
    "administrativo",
    "Lei Complementar (SC) nº 491/2010"
   ],
   [
    "administrativo",
    "Lei Complementar (SE) nº 33/1996"
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
    "Lei Estadual (BA) nº 6.677/1994"
   ],
   [
    "administrativo",
    "Lei Estadual (MA) nº 6.107/1994"
   ],
   [
    "administrativo",
    "Lei Estadual (MS) nº 1.102/1990"
   ],
   [
    "administrativo",
    "Lei Estadual (PA) nº 5.810/1994"
   ],
   [
    "administrativo",
    "Lei Estadual (SC) nº 6.745/1985"
   ],
   [
    "administrativo",
    "Lei Estadual (SP) nº 10.177/1998"
   ],
   [
    "administrativo",
    "Lei nº 11.079/2004"
   ],
   [
    "administrativo",
    "Lei nº 12.462/2011"
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
    "Lei nº 14.230/2021"
   ],
   [
    "administrativo",
    "Lei nº 15.047/2024"
   ],
   [
    "administrativo",
    "Lei nº 4.320/1964"
   ],
   [
    "administrativo",
    "Lei nº 4.504/1964"
   ],
   [
    "administrativo",
    "Lei nº 4.878/1965"
   ],
   [
    "administrativo",
    "Lei nº 8.112/1990"
   ],
   [
    "administrativo",
    "Lei nº 8.429/1992"
   ],
   [
    "administrativo",
    "Lei nº 8.629/1993"
   ],
   [
    "administrativo",
    "Lei nº 8.666/1993"
   ],
   [
    "administrativo",
    "Lei nº 8.987/1995"
   ],
   [
    "administrativo",
    "Lei nº 9.469/1997"
   ],
   [
    "administrativo",
    "Lei nº 9.637/1998"
   ],
   [
    "administrativo",
    "Lei nº 9.784/1999"
   ],
   [
    "administrativo",
    "Lei nº 9.790/1999"
   ],
   [
    "ambiental",
    "Decreto nº 1.318/1854"
   ],
   [
    "ambiental",
    "Decreto nº 10.936/2022"
   ],
   [
    "ambiental",
    "Decreto nº 6.514/2008"
   ],
   [
    "ambiental",
    "Decreto nº 7.217/2010"
   ],
   [
    "ambiental",
    "Decreto nº 9.310/2018"
   ],
   [
    "ambiental",
    "Decreto nº 99.274/1990"
   ],
   [
    "ambiental",
    "Decreto-Lei nº 227/1967"
   ],
   [
    "ambiental",
    "Decreto-Lei nº 25/1937"
   ],
   [
    "ambiental",
    "Lei Complementar nº 140/2011"
   ],
   [
    "ambiental",
    "Lei Estadual (PA) nº 4.835/1979"
   ],
   [
    "ambiental",
    "Lei Estadual (PA) nº 4.884/1979"
   ],
   [
    "ambiental",
    "Lei Estadual (PA) nº 5.295/1985"
   ],
   [
    "ambiental",
    "Lei Estadual (PA) nº 5.629/1990"
   ],
   [
    "ambiental",
    "Lei Estadual (PA) nº 5.849/1994"
   ],
   [
    "ambiental",
    "Lei Estadual (PA) nº 6.376/2001"
   ],
   [
    "ambiental",
    "Lei Estadual (PA) nº 6.710/2005"
   ],
   [
    "ambiental",
    "Lei Estadual (PA) nº 6.745/2005"
   ],
   [
    "ambiental",
    "Lei Estadual (PA) nº 7.031/2007"
   ],
   [
    "ambiental",
    "Lei Estadual (PA) nº 7.731/2013"
   ],
   [
    "ambiental",
    "Lei Estadual (PA) nº 8.001/1990"
   ],
   [
    "ambiental",
    "Lei Estadual (PA) nº 8.878/2019"
   ],
   [
    "ambiental",
    "Lei Estadual (PA) nº 82/1892"
   ],
   [
    "ambiental",
    "Lei Estadual (PA) nº 9.048/2020"
   ],
   [
    "ambiental",
    "Lei Estadual (PA) nº 9.593/2022"
   ],
   [
    "ambiental",
    "Lei Estadual (SC) nº 14.675/2009"
   ],
   [
    "ambiental",
    "Lei Estadual (SC) nº 16.342/2014"
   ],
   [
    "ambiental",
    "Lei nº 11.107/2005"
   ],
   [
    "ambiental",
    "Lei nº 11.124/2005"
   ],
   [
    "ambiental",
    "Lei nº 11.445/2007"
   ],
   [
    "ambiental",
    "Lei nº 11.952/2009"
   ],
   [
    "ambiental",
    "Lei nº 11.977/2009"
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
    "Lei nº 12.334/2010"
   ],
   [
    "ambiental",
    "Lei nº 12.587/2012"
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
    "Lei nº 13.465/2017"
   ],
   [
    "ambiental",
    "Lei nº 14.026/2020"
   ],
   [
    "ambiental",
    "Lei nº 14.755/2023"
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
    "Lei nº 6.938/1981"
   ],
   [
    "ambiental",
    "Lei nº 7.990/1989"
   ],
   [
    "ambiental",
    "Lei nº 8.901/1994"
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
    "Lei nº 9.985/2000"
   ],
   [
    "ambiental",
    "Medida Provisória nº 1.308/2025"
   ],
   [
    "civil",
    "Decreto-Lei nº 4.657/1942"
   ],
   [
    "civil",
    "Decreto-Lei nº 911/1969"
   ],
   [
    "civil",
    "Lei Estadual (SC) nº 17.492/2018"
   ],
   [
    "civil",
    "Lei nº 10.406/2002"
   ],
   [
    "civil",
    "Lei nº 10.931/2004"
   ],
   [
    "civil",
    "Lei nº 12.376/2010"
   ],
   [
    "civil",
    "Lei nº 12.764/2012"
   ],
   [
    "civil",
    "Lei nº 12.965/2014"
   ],
   [
    "civil",
    "Lei nº 13.058/2014"
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
    "Lei nº 13.874/2019"
   ],
   [
    "civil",
    "Lei nº 14.010/2020"
   ],
   [
    "civil",
    "Lei nº 14.382/2022"
   ],
   [
    "civil",
    "Lei nº 14.443/2022"
   ],
   [
    "civil",
    "Lei nº 14.905/2024"
   ],
   [
    "civil",
    "Lei nº 4.591/1964"
   ],
   [
    "civil",
    "Lei nº 6.015/1973"
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
    "Lei nº 8.245/1991"
   ],
   [
    "civil",
    "Lei nº 8.935/1994"
   ],
   [
    "civil",
    "Lei nº 8.971/1994"
   ],
   [
    "civil",
    "Lei nº 9.278/1996"
   ],
   [
    "civil",
    "Lei nº 9.492/1997"
   ],
   [
    "civil",
    "Lei nº 9.514/1997"
   ],
   [
    "civil",
    "Resolução CNJ nº 452/2022"
   ],
   [
    "constitucional",
    "CF/1988"
   ],
   [
    "constitucional",
    "Emenda Constitucional nº 45/2004"
   ],
   [
    "constitucional",
    "Emenda Constitucional nº 80/2014"
   ],
   [
    "constitucional",
    "Lei Estadual (PA) nº 5.008/1981"
   ],
   [
    "consumidor",
    "Decreto nº 2.181/1997"
   ],
   [
    "consumidor",
    "Decreto nº 7.962/2013"
   ],
   [
    "consumidor",
    "Decreto nº 9.936/2019"
   ],
   [
    "consumidor",
    "Lei Complementar nº 166/2019"
   ],
   [
    "consumidor",
    "Lei nº 12.414/2011"
   ],
   [
    "consumidor",
    "Lei nº 14.538/2023"
   ],
   [
    "consumidor",
    "Lei nº 8.078/1990"
   ],
   [
    "consumidor",
    "Lei nº 9.656/1998"
   ],
   [
    "consumidor",
    "Resolução ANATEL nº 765/2023"
   ],
   [
    "consumidor",
    "Resolução Normativa ANEEL nº 1.000/2021"
   ],
   [
    "crianca",
    "Decreto nº 9.603/2018"
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
    "Lei nº 13.257/2016"
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
    "Lei nº 14.811/2024"
   ],
   [
    "crianca",
    "Lei nº 8.069/1990"
   ],
   [
    "eleitoral",
    "Lei Complementar nº 64/1990"
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
    "Lei nº 9.096/1995"
   ],
   [
    "eleitoral",
    "Lei nº 9.504/1997"
   ],
   [
    "empresarial",
    "Decreto nº 2.044/1908"
   ],
   [
    "empresarial",
    "Decreto-Lei nº 167/1967"
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
    "Lei nº 12.529/2011"
   ],
   [
    "empresarial",
    "Lei nº 14.112/2020"
   ],
   [
    "empresarial",
    "Lei nº 14.193/2021"
   ],
   [
    "empresarial",
    "Lei nº 4.886/1965"
   ],
   [
    "empresarial",
    "Lei nº 6.404/1976"
   ],
   [
    "empresarial",
    "Lei nº 7.913/1989"
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
    "Lei nº 9.609/1998"
   ],
   [
    "humanos",
    "Decreto nº 10.088/2019"
   ],
   [
    "humanos",
    "Decreto nº 10.932/2022"
   ],
   [
    "humanos",
    "Decreto nº 3.956/2001"
   ],
   [
    "humanos",
    "Decreto nº 4.886/2003"
   ],
   [
    "humanos",
    "Decreto nº 6.040/2007"
   ],
   [
    "humanos",
    "Decreto nº 65.810/1969"
   ],
   [
    "humanos",
    "Decreto nº 678/1992"
   ],
   [
    "humanos",
    "Decreto nº 7.037/2009"
   ],
   [
    "humanos",
    "Decreto nº 8.136/2013"
   ],
   [
    "humanos",
    "Decreto nº 9.571/2018"
   ],
   [
    "humanos",
    "Lei Estadual (PA) nº 9.341/2021"
   ],
   [
    "humanos",
    "Lei nº 12.288/2010"
   ],
   [
    "humanos",
    "Lei nº 12.852/2013"
   ],
   [
    "humanos",
    "Lei nº 7.716/1989"
   ],
   [
    "humanos",
    "Resolução A/RES/61/295 (ONU, 2007)"
   ],
   [
    "penal",
    "Decreto nº 5.015/2004"
   ],
   [
    "penal",
    "Decreto-Lei nº 1.001/1969"
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
    "Decreto-Lei nº 3.688/1941"
   ],
   [
    "penal",
    "Decreto-Lei nº 3.914/1941"
   ],
   [
    "penal",
    "Decreto-Lei nº 6.259/1944"
   ],
   [
    "penal",
    "Lei nº 1.521/1951"
   ],
   [
    "penal",
    "Lei nº 10.826/2003"
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
    "Lei nº 12.850/2013"
   ],
   [
    "penal",
    "Lei nº 13.869/2019"
   ],
   [
    "penal",
    "Lei nº 13.964/2019"
   ],
   [
    "penal",
    "Lei nº 14.188/2021"
   ],
   [
    "penal",
    "Lei nº 14.322/2022"
   ],
   [
    "penal",
    "Lei nº 15.384/2026"
   ],
   [
    "penal",
    "Lei nº 7.210/1984"
   ],
   [
    "penal",
    "Lei nº 7.492/1986"
   ],
   [
    "penal",
    "Lei nº 7.716/1989"
   ],
   [
    "penal",
    "Lei nº 8.072/1990"
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
    "Lei nº 9.455/1997"
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
    "Lei nº 9.613/1998"
   ],
   [
    "processual_civil",
    "Emenda Constitucional nº 125/2022"
   ],
   [
    "processual_civil",
    "Lei Complementar (MG) nº 59/2001"
   ],
   [
    "processual_civil",
    "Lei Complementar (SC) nº 339/2006"
   ],
   [
    "processual_civil",
    "Lei nº 10.259/2001"
   ],
   [
    "processual_civil",
    "Lei nº 11.417/2006"
   ],
   [
    "processual_civil",
    "Lei nº 11.418/2006"
   ],
   [
    "processual_civil",
    "Lei nº 11.419/2006"
   ],
   [
    "processual_civil",
    "Lei nº 11.672/2008"
   ],
   [
    "processual_civil",
    "Lei nº 12.016/2009"
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
    "processual_civil",
    "Lei nº 13.140/2015"
   ],
   [
    "processual_civil",
    "Lei nº 13.655/2018"
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
    "Lei nº 8.437/1992"
   ],
   [
    "processual_civil",
    "Lei nº 9.008/1995"
   ],
   [
    "processual_civil",
    "Lei nº 9.099/1995"
   ],
   [
    "processual_civil",
    "Lei nº 9.307/1996"
   ],
   [
    "processual_civil",
    "Lei nº 9.494/1997"
   ],
   [
    "processual_civil",
    "Lei nº 9.507/1997"
   ],
   [
    "processual_penal",
    "Decreto-Lei nº 1.002/1969"
   ],
   [
    "processual_penal",
    "Decreto-Lei nº 201/1967"
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
    "Lei nº 4.737/1965"
   ],
   [
    "processual_penal",
    "Lei nº 7.210/1984"
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
    "tributario",
    "Decreto Estadual (MG) nº 44.747/2008"
   ],
   [
    "tributario",
    "Decreto nº 70.235/1972"
   ],
   [
    "tributario",
    "Lei Complementar (SC) nº 465/2009"
   ],
   [
    "tributario",
    "Lei Complementar nº 101/2000"
   ],
   [
    "tributario",
    "Lei Complementar nº 118/2005"
   ],
   [
    "tributario",
    "Lei Complementar nº 199/2023"
   ],
   [
    "tributario",
    "Lei Estadual (PR) nº 18.877/2016"
   ],
   [
    "tributario",
    "Lei Estadual (SC) nº 13.136/2004"
   ],
   [
    "tributario",
    "Lei Estadual (SC) nº 3.938/1966"
   ],
   [
    "tributario",
    "Lei nº 10.169/2000"
   ],
   [
    "tributario",
    "Lei nº 5.172/1966"
   ],
   [
    "tributario",
    "Lei nº 6.830/1980"
   ],
   [
    "tributario",
    "Lei nº 8.397/1992"
   ]
  ],
  "tipo": "edital"
 },
 {
  "id": "tjam-1-2024",
  "sigla": "TJAM",
  "cargo": "Juiz Substituto",
  "orgao": "Tribunal de Justiça do Estado do Amazonas",
  "titulo": "Concurso Público para Ingresso na Magistratura do Estado do Amazonas",
  "edital": "Edital nº 01/2024",
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
    "administrativo",
    "Decreto nº 6.017/2007"
   ],
   [
    "administrativo",
    "Decreto nº 7.746/2012"
   ],
   [
    "administrativo",
    "Decreto-Lei nº 3.365/1941"
   ],
   [
    "administrativo",
    "Decreto-Lei nº 4.597/1942"
   ],
   [
    "administrativo",
    "Lei Complementar (DF) nº 840/2011"
   ],
   [
    "administrativo",
    "Lei Complementar (MS) nº 72/1994"
   ],
   [
    "administrativo",
    "Lei Complementar (MT) nº 04/1990"
   ],
   [
    "administrativo",
    "Lei Complementar (SC) nº 491/2010"
   ],
   [
    "administrativo",
    "Lei Complementar (SE) nº 33/1996"
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
    "Lei Complementar nº 75/1993"
   ],
   [
    "administrativo",
    "Lei Estadual (BA) nº 6.677/1994"
   ],
   [
    "administrativo",
    "Lei Estadual (MA) nº 6.107/1994"
   ],
   [
    "administrativo",
    "Lei Estadual (MS) nº 1.102/1990"
   ],
   [
    "administrativo",
    "Lei Estadual (PA) nº 5.810/1994"
   ],
   [
    "administrativo",
    "Lei Estadual (SP) nº 10.177/1998"
   ],
   [
    "administrativo",
    "Lei nº 11.079/2004"
   ],
   [
    "administrativo",
    "Lei nº 12.462/2011"
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
    "Lei nº 13.019/2014"
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
    "Lei nº 14.133/2021"
   ],
   [
    "administrativo",
    "Lei nº 14.230/2021"
   ],
   [
    "administrativo",
    "Lei nº 15.047/2024"
   ],
   [
    "administrativo",
    "Lei nº 4.320/1964"
   ],
   [
    "administrativo",
    "Lei nº 4.878/1965"
   ],
   [
    "administrativo",
    "Lei nº 8.112/1990"
   ],
   [
    "administrativo",
    "Lei nº 8.429/1992"
   ],
   [
    "administrativo",
    "Lei nº 8.625/1993"
   ],
   [
    "administrativo",
    "Lei nº 8.666/1993"
   ],
   [
    "administrativo",
    "Lei nº 8.987/1995"
   ],
   [
    "administrativo",
    "Lei nº 9.637/1998"
   ],
   [
    "administrativo",
    "Lei nº 9.784/1999"
   ],
   [
    "administrativo",
    "Lei nº 9.790/1999"
   ],
   [
    "administrativo",
    "Lei nº 9.986/2000"
   ],
   [
    "ambiental",
    "Decreto nº 10.936/2022"
   ],
   [
    "ambiental",
    "Decreto nº 6.514/2008"
   ],
   [
    "ambiental",
    "Decreto nº 7.217/2010"
   ],
   [
    "ambiental",
    "Decreto nº 99.274/1990"
   ],
   [
    "ambiental",
    "Lei Complementar nº 140/2011"
   ],
   [
    "ambiental",
    "Lei Estadual (PA) nº 5.629/1990"
   ],
   [
    "ambiental",
    "Lei Estadual (PA) nº 6.745/2005"
   ],
   [
    "ambiental",
    "Lei Estadual (PA) nº 9.048/2020"
   ],
   [
    "ambiental",
    "Lei Estadual (SC) nº 14.675/2009"
   ],
   [
    "ambiental",
    "Lei Estadual (SC) nº 16.342/2014"
   ],
   [
    "ambiental",
    "Lei nº 10.257/2001"
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
    "Lei nº 11.124/2005"
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
    "Lei nº 11.445/2007"
   ],
   [
    "ambiental",
    "Lei nº 11.952/2009"
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
    "Lei nº 12.334/2010"
   ],
   [
    "ambiental",
    "Lei nº 12.587/2012"
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
    "Lei nº 13.123/2015"
   ],
   [
    "ambiental",
    "Lei nº 14.026/2020"
   ],
   [
    "ambiental",
    "Lei nº 14.119/2021"
   ],
   [
    "ambiental",
    "Lei nº 14.755/2023"
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
    "Lei nº 6.938/1981"
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
    "Medida Provisória nº 1.308/2025"
   ],
   [
    "civil",
    "Decreto nº 20.910/1932"
   ],
   [
    "civil",
    "Decreto nº 22.626/1933"
   ],
   [
    "civil",
    "Decreto nº 57.663/1966"
   ],
   [
    "civil",
    "Decreto-Lei nº 4.657/1942"
   ],
   [
    "civil",
    "Decreto-Lei nº 911/1969"
   ],
   [
    "civil",
    "Lei Estadual (SC) nº 17.492/2018"
   ],
   [
    "civil",
    "Lei nº 1.060/1950"
   ],
   [
    "civil",
    "Lei nº 10.406/2002"
   ],
   [
    "civil",
    "Lei nº 10.741/2003"
   ],
   [
    "civil",
    "Lei nº 10.931/2004"
   ],
   [
    "civil",
    "Lei nº 11.076/2004"
   ],
   [
    "civil",
    "Lei nº 11.804/2008"
   ],
   [
    "civil",
    "Lei nº 12.376/2010"
   ],
   [
    "civil",
    "Lei nº 12.764/2012"
   ],
   [
    "civil",
    "Lei nº 12.965/2014"
   ],
   [
    "civil",
    "Lei nº 13.058/2014"
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
    "Lei nº 13.874/2019"
   ],
   [
    "civil",
    "Lei nº 14.010/2020"
   ],
   [
    "civil",
    "Lei nº 14.382/2022"
   ],
   [
    "civil",
    "Lei nº 14.443/2022"
   ],
   [
    "civil",
    "Lei nº 14.905/2024"
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
    "Lei nº 6.015/1973"
   ],
   [
    "civil",
    "Lei nº 6.515/1977"
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
    "Lei nº 8.245/1991"
   ],
   [
    "civil",
    "Lei nº 8.560/1992"
   ],
   [
    "civil",
    "Lei nº 8.935/1994"
   ],
   [
    "civil",
    "Lei nº 8.971/1994"
   ],
   [
    "civil",
    "Lei nº 9.278/1996"
   ],
   [
    "civil",
    "Lei nº 9.492/1997"
   ],
   [
    "civil",
    "Lei nº 9.514/1997"
   ],
   [
    "civil",
    "Resolução CNJ nº 452/2022"
   ],
   [
    "constitucional",
    "CF/1988"
   ],
   [
    "consumidor",
    "Decreto nº 2.181/1997"
   ],
   [
    "consumidor",
    "Decreto nº 7.962/2013"
   ],
   [
    "consumidor",
    "Decreto nº 9.936/2019"
   ],
   [
    "consumidor",
    "Lei Complementar nº 166/2019"
   ],
   [
    "consumidor",
    "Lei nº 12.414/2011"
   ],
   [
    "consumidor",
    "Lei nº 14.538/2023"
   ],
   [
    "consumidor",
    "Lei nº 8.078/1990"
   ],
   [
    "consumidor",
    "Lei nº 9.656/1998"
   ],
   [
    "consumidor",
    "Resolução ANATEL nº 765/2023"
   ],
   [
    "consumidor",
    "Resolução Normativa ANEEL nº 1.000/2021"
   ],
   [
    "crianca",
    "Decreto nº 9.603/2018"
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
    "Lei nº 13.257/2016"
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
    "Resolução CNJ nº 295/2019"
   ],
   [
    "eleitoral",
    "Lei Complementar nº 64/1990"
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
    "Lei nº 9.096/1995"
   ],
   [
    "eleitoral",
    "Lei nº 9.504/1997"
   ],
   [
    "empresarial",
    "Decreto nº 2.044/1908"
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
    "Lei nº 14.112/2020"
   ],
   [
    "empresarial",
    "Lei nº 14.193/2021"
   ],
   [
    "empresarial",
    "Lei nº 6.840/1980"
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
    "humanos",
    "Decreto nº 678/1992"
   ],
   [
    "humanos",
    "Decreto nº 7.037/2009"
   ],
   [
    "humanos",
    "Decreto nº 9.571/2018"
   ],
   [
    "humanos",
    "Lei nº 7.716/1989"
   ],
   [
    "penal",
    "Decreto-Lei nº 201/1967"
   ],
   [
    "penal",
    "Decreto-Lei nº 3.688/1941"
   ],
   [
    "penal",
    "Decreto-Lei nº 6.259/1944"
   ],
   [
    "penal",
    "Lei nº 1.521/1951"
   ],
   [
    "penal",
    "Lei nº 10.826/2003"
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
    "Lei nº 13.869/2019"
   ],
   [
    "penal",
    "Lei nº 13.964/2019"
   ],
   [
    "penal",
    "Lei nº 14.188/2021"
   ],
   [
    "penal",
    "Lei nº 14.597/2023"
   ],
   [
    "penal",
    "Lei nº 15.358/2026"
   ],
   [
    "penal",
    "Lei nº 4.898/1965"
   ],
   [
    "penal",
    "Lei nº 6.001/1973"
   ],
   [
    "penal",
    "Lei nº 7.210/1984"
   ],
   [
    "penal",
    "Lei nº 7.492/1986"
   ],
   [
    "penal",
    "Lei nº 7.716/1989"
   ],
   [
    "penal",
    "Lei nº 8.072/1990"
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
    "Lei nº 9.020/1995"
   ],
   [
    "penal",
    "Lei nº 9.029/1995"
   ],
   [
    "penal",
    "Lei nº 9.263/1996"
   ],
   [
    "penal",
    "Lei nº 9.434/1997"
   ],
   [
    "penal",
    "Lei nº 9.455/1997"
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
    "Lei nº 9.613/1998"
   ],
   [
    "previdenciario",
    "Lei nº 12.435/2011"
   ],
   [
    "previdenciario",
    "Lei nº 8.742/1993"
   ],
   [
    "processual_civil",
    "Emenda Constitucional nº 125/2022"
   ],
   [
    "processual_civil",
    "Lei nº 10.259/2001"
   ],
   [
    "processual_civil",
    "Lei nº 11.417/2006"
   ],
   [
    "processual_civil",
    "Lei nº 11.418/2006"
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
    "Lei nº 12.153/2009"
   ],
   [
    "processual_civil",
    "Lei nº 13.105/2015"
   ],
   [
    "processual_civil",
    "Lei nº 13.129/2015"
   ],
   [
    "processual_civil",
    "Lei nº 13.140/2015"
   ],
   [
    "processual_civil",
    "Lei nº 13.655/2018"
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
    "Lei nº 8.437/1992"
   ],
   [
    "processual_civil",
    "Lei nº 9.099/1995"
   ],
   [
    "processual_civil",
    "Lei nº 9.307/1996"
   ],
   [
    "processual_civil",
    "Lei nº 9.494/1997"
   ],
   [
    "processual_civil",
    "Lei nº 9.507/1997"
   ],
   [
    "processual_penal",
    "Decreto-Lei nº 1.002/1969"
   ],
   [
    "processual_penal",
    "Decreto-Lei nº 201/1967"
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
    "Lei nº 4.737/1965"
   ],
   [
    "processual_penal",
    "Lei nº 7.210/1984"
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
    "tributario",
    "Lei Complementar nº 101/2000"
   ],
   [
    "tributario",
    "Lei Complementar nº 118/2005"
   ],
   [
    "tributario",
    "Lei Estadual (SC) nº 3.938/1966"
   ],
   [
    "tributario",
    "Lei nº 10.169/2000"
   ],
   [
    "tributario",
    "Lei nº 5.172/1966"
   ],
   [
    "tributario",
    "Lei nº 6.830/1980"
   ],
   [
    "tributario",
    "Lei nº 8.397/1992"
   ]
  ],
  "tipo": "edital"
 },
 {
  "id": "tjce-91-2025",
  "sigla": "TJCE",
  "cargo": "Juiz Substituto",
  "orgao": "Tribunal de Justiça do Estado do Ceará",
  "titulo": "Concurso Público para Ingresso na Carreira da Magistratura do Estado do Ceará",
  "edital": "Edital nº 91/2025",
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
    "administrativo",
    "Decreto nº 6.017/2007"
   ],
   [
    "administrativo",
    "Decreto nº 7.746/2012"
   ],
   [
    "administrativo",
    "Decreto-Lei nº 3.365/1941"
   ],
   [
    "administrativo",
    "Decreto-Lei nº 4.597/1942"
   ],
   [
    "administrativo",
    "Lei Complementar (DF) nº 769/2008"
   ],
   [
    "administrativo",
    "Lei Complementar (DF) nº 840/2011"
   ],
   [
    "administrativo",
    "Lei Complementar (MS) nº 72/1994"
   ],
   [
    "administrativo",
    "Lei Complementar (MT) nº 04/1990"
   ],
   [
    "administrativo",
    "Lei Complementar (SC) nº 491/2010"
   ],
   [
    "administrativo",
    "Lei Complementar (SE) nº 33/1996"
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
    "Lei Complementar nº 75/1993"
   ],
   [
    "administrativo",
    "Lei Estadual (BA) nº 6.677/1994"
   ],
   [
    "administrativo",
    "Lei Estadual (MA) nº 6.107/1994"
   ],
   [
    "administrativo",
    "Lei Estadual (MS) nº 1.102/1990"
   ],
   [
    "administrativo",
    "Lei Estadual (PA) nº 5.810/1994"
   ],
   [
    "administrativo",
    "Lei Estadual (SC) nº 6.745/1985"
   ],
   [
    "administrativo",
    "Lei Estadual (SP) nº 10.177/1998"
   ],
   [
    "administrativo",
    "Lei nº 11.079/2004"
   ],
   [
    "administrativo",
    "Lei nº 12.462/2011"
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
    "Lei nº 13.019/2014"
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
    "Lei nº 14.133/2021"
   ],
   [
    "administrativo",
    "Lei nº 14.230/2021"
   ],
   [
    "administrativo",
    "Lei nº 15.047/2024"
   ],
   [
    "administrativo",
    "Lei nº 4.878/1965"
   ],
   [
    "administrativo",
    "Lei nº 8.112/1990"
   ],
   [
    "administrativo",
    "Lei nº 8.429/1992"
   ],
   [
    "administrativo",
    "Lei nº 8.625/1993"
   ],
   [
    "administrativo",
    "Lei nº 8.987/1995"
   ],
   [
    "administrativo",
    "Lei nº 9.637/1998"
   ],
   [
    "administrativo",
    "Lei nº 9.784/1999"
   ],
   [
    "administrativo",
    "Lei nº 9.790/1999"
   ],
   [
    "administrativo",
    "Lei nº 9.986/2000"
   ],
   [
    "ambiental",
    "Decreto nº 10.936/2022"
   ],
   [
    "ambiental",
    "Decreto nº 6.514/2008"
   ],
   [
    "ambiental",
    "Decreto nº 7.217/2010"
   ],
   [
    "ambiental",
    "Decreto nº 99.274/1990"
   ],
   [
    "ambiental",
    "Lei Complementar nº 140/2011"
   ],
   [
    "ambiental",
    "Lei Estadual (PA) nº 5.629/1990"
   ],
   [
    "ambiental",
    "Lei Estadual (PA) nº 6.745/2005"
   ],
   [
    "ambiental",
    "Lei Estadual (PA) nº 9.048/2020"
   ],
   [
    "ambiental",
    "Lei Estadual (SC) nº 14.675/2009"
   ],
   [
    "ambiental",
    "Lei Estadual (SC) nº 16.342/2014"
   ],
   [
    "ambiental",
    "Lei nº 10.257/2001"
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
    "Lei nº 11.124/2005"
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
    "Lei nº 11.445/2007"
   ],
   [
    "ambiental",
    "Lei nº 11.952/2009"
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
    "Lei nº 12.334/2010"
   ],
   [
    "ambiental",
    "Lei nº 12.587/2012"
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
    "Lei nº 13.123/2015"
   ],
   [
    "ambiental",
    "Lei nº 14.026/2020"
   ],
   [
    "ambiental",
    "Lei nº 14.119/2021"
   ],
   [
    "ambiental",
    "Lei nº 14.755/2023"
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
    "Lei nº 6.938/1981"
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
    "Medida Provisória nº 1.308/2025"
   ],
   [
    "civil",
    "Decreto nº 20.910/1932"
   ],
   [
    "civil",
    "Decreto nº 22.626/1933"
   ],
   [
    "civil",
    "Decreto nº 57.663/1966"
   ],
   [
    "civil",
    "Decreto-Lei nº 4.657/1942"
   ],
   [
    "civil",
    "Decreto-Lei nº 911/1969"
   ],
   [
    "civil",
    "Lei Estadual (SC) nº 17.492/2018"
   ],
   [
    "civil",
    "Lei nº 1.060/1950"
   ],
   [
    "civil",
    "Lei nº 10.406/2002"
   ],
   [
    "civil",
    "Lei nº 10.741/2003"
   ],
   [
    "civil",
    "Lei nº 10.931/2004"
   ],
   [
    "civil",
    "Lei nº 11.076/2004"
   ],
   [
    "civil",
    "Lei nº 11.804/2008"
   ],
   [
    "civil",
    "Lei nº 12.376/2010"
   ],
   [
    "civil",
    "Lei nº 12.764/2012"
   ],
   [
    "civil",
    "Lei nº 12.965/2014"
   ],
   [
    "civil",
    "Lei nº 13.058/2014"
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
    "Lei nº 13.874/2019"
   ],
   [
    "civil",
    "Lei nº 14.010/2020"
   ],
   [
    "civil",
    "Lei nº 14.382/2022"
   ],
   [
    "civil",
    "Lei nº 14.443/2022"
   ],
   [
    "civil",
    "Lei nº 14.905/2024"
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
    "Lei nº 6.015/1973"
   ],
   [
    "civil",
    "Lei nº 6.515/1977"
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
    "Lei nº 8.245/1991"
   ],
   [
    "civil",
    "Lei nº 8.560/1992"
   ],
   [
    "civil",
    "Lei nº 8.935/1994"
   ],
   [
    "civil",
    "Lei nº 8.971/1994"
   ],
   [
    "civil",
    "Lei nº 9.278/1996"
   ],
   [
    "civil",
    "Lei nº 9.492/1997"
   ],
   [
    "civil",
    "Lei nº 9.514/1997"
   ],
   [
    "civil",
    "Resolução CNJ nº 452/2022"
   ],
   [
    "constitucional",
    "CF/1988"
   ],
   [
    "consumidor",
    "Decreto nº 2.181/1997"
   ],
   [
    "consumidor",
    "Decreto nº 7.962/2013"
   ],
   [
    "consumidor",
    "Decreto nº 9.936/2019"
   ],
   [
    "consumidor",
    "Lei Complementar nº 166/2019"
   ],
   [
    "consumidor",
    "Lei nº 12.414/2011"
   ],
   [
    "consumidor",
    "Lei nº 14.538/2023"
   ],
   [
    "consumidor",
    "Lei nº 8.078/1990"
   ],
   [
    "consumidor",
    "Lei nº 9.656/1998"
   ],
   [
    "consumidor",
    "Resolução ANATEL nº 765/2023"
   ],
   [
    "consumidor",
    "Resolução Normativa ANEEL nº 1.000/2021"
   ],
   [
    "crianca",
    "Decreto nº 9.603/2018"
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
    "Lei nº 13.257/2016"
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
    "eleitoral",
    "Lei Complementar nº 64/1990"
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
    "Lei nº 9.096/1995"
   ],
   [
    "eleitoral",
    "Lei nº 9.504/1997"
   ],
   [
    "empresarial",
    "Decreto nº 2.044/1908"
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
    "Lei nº 14.112/2020"
   ],
   [
    "empresarial",
    "Lei nº 14.193/2021"
   ],
   [
    "empresarial",
    "Lei nº 6.840/1980"
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
    "humanos",
    "Decreto nº 678/1992"
   ],
   [
    "humanos",
    "Decreto nº 7.037/2009"
   ],
   [
    "humanos",
    "Decreto nº 9.571/2018"
   ],
   [
    "humanos",
    "Lei nº 7.716/1989"
   ],
   [
    "penal",
    "Decreto-Lei nº 1.001/1969"
   ],
   [
    "penal",
    "Decreto-Lei nº 201/1967"
   ],
   [
    "penal",
    "Decreto-Lei nº 3.688/1941"
   ],
   [
    "penal",
    "Decreto-Lei nº 6.259/1944"
   ],
   [
    "penal",
    "Lei nº 1.521/1951"
   ],
   [
    "penal",
    "Lei nº 10.826/2003"
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
    "Lei nº 13.869/2019"
   ],
   [
    "penal",
    "Lei nº 13.964/2019"
   ],
   [
    "penal",
    "Lei nº 14.188/2021"
   ],
   [
    "penal",
    "Lei nº 14.597/2023"
   ],
   [
    "penal",
    "Lei nº 15.358/2026"
   ],
   [
    "penal",
    "Lei nº 4.898/1965"
   ],
   [
    "penal",
    "Lei nº 6.001/1973"
   ],
   [
    "penal",
    "Lei nº 7.210/1984"
   ],
   [
    "penal",
    "Lei nº 7.492/1986"
   ],
   [
    "penal",
    "Lei nº 7.716/1989"
   ],
   [
    "penal",
    "Lei nº 8.072/1990"
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
    "Lei nº 9.020/1995"
   ],
   [
    "penal",
    "Lei nº 9.029/1995"
   ],
   [
    "penal",
    "Lei nº 9.249/1995"
   ],
   [
    "penal",
    "Lei nº 9.263/1996"
   ],
   [
    "penal",
    "Lei nº 9.434/1997"
   ],
   [
    "penal",
    "Lei nº 9.455/1997"
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
    "Lei nº 9.613/1998"
   ],
   [
    "previdenciario",
    "Lei nº 12.435/2011"
   ],
   [
    "previdenciario",
    "Lei nº 8.742/1993"
   ],
   [
    "processual_civil",
    "Emenda Constitucional nº 125/2022"
   ],
   [
    "processual_civil",
    "Lei nº 10.259/2001"
   ],
   [
    "processual_civil",
    "Lei nº 11.417/2006"
   ],
   [
    "processual_civil",
    "Lei nº 11.418/2006"
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
    "Lei nº 12.153/2009"
   ],
   [
    "processual_civil",
    "Lei nº 13.105/2015"
   ],
   [
    "processual_civil",
    "Lei nº 13.129/2015"
   ],
   [
    "processual_civil",
    "Lei nº 13.140/2015"
   ],
   [
    "processual_civil",
    "Lei nº 13.655/2018"
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
    "Lei nº 8.437/1992"
   ],
   [
    "processual_civil",
    "Lei nº 9.099/1995"
   ],
   [
    "processual_civil",
    "Lei nº 9.307/1996"
   ],
   [
    "processual_civil",
    "Lei nº 9.494/1997"
   ],
   [
    "processual_civil",
    "Lei nº 9.507/1997"
   ],
   [
    "processual_penal",
    "Decreto-Lei nº 1.002/1969"
   ],
   [
    "processual_penal",
    "Decreto-Lei nº 201/1967"
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
    "Lei nº 4.737/1965"
   ],
   [
    "processual_penal",
    "Lei nº 7.210/1984"
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
    "tributario",
    "Lei Complementar nº 101/2000"
   ],
   [
    "tributario",
    "Lei Complementar nº 118/2005"
   ],
   [
    "tributario",
    "Lei Estadual (SC) nº 3.938/1966"
   ],
   [
    "tributario",
    "Lei nº 10.169/2000"
   ],
   [
    "tributario",
    "Lei nº 5.172/1966"
   ],
   [
    "tributario",
    "Lei nº 6.830/1980"
   ],
   [
    "tributario",
    "Lei nº 8.397/1992"
   ]
  ],
  "tipo": "edital"
 },
 {
  "id": "tjmt-1-2024",
  "sigla": "TJMT",
  "cargo": "Juiz Substituto",
  "orgao": "Tribunal de Justiça do Estado de Mato Grosso",
  "titulo": "Concurso Público para Ingresso na Carreira da Magistratura do Estado de Mato Grosso",
  "edital": "Edital nº 01/2024",
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
    "administrativo",
    "Decreto nº 6.017/2007"
   ],
   [
    "administrativo",
    "Decreto nº 7.746/2012"
   ],
   [
    "administrativo",
    "Decreto nº 9.311/2018"
   ],
   [
    "administrativo",
    "Decreto-Lei nº 3.365/1941"
   ],
   [
    "administrativo",
    "Decreto-Lei nº 4.597/1942"
   ],
   [
    "administrativo",
    "Lei Complementar (DF) nº 769/2008"
   ],
   [
    "administrativo",
    "Lei Complementar (DF) nº 840/2011"
   ],
   [
    "administrativo",
    "Lei Complementar (MS) nº 72/1994"
   ],
   [
    "administrativo",
    "Lei Complementar (MT) nº 04/1990"
   ],
   [
    "administrativo",
    "Lei Complementar (SC) nº 491/2010"
   ],
   [
    "administrativo",
    "Lei Complementar (SE) nº 33/1996"
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
    "Lei Complementar nº 75/1993"
   ],
   [
    "administrativo",
    "Lei Complementar nº 76/1993"
   ],
   [
    "administrativo",
    "Lei Estadual (BA) nº 6.677/1994"
   ],
   [
    "administrativo",
    "Lei Estadual (MA) nº 6.107/1994"
   ],
   [
    "administrativo",
    "Lei Estadual (MS) nº 1.102/1990"
   ],
   [
    "administrativo",
    "Lei Estadual (MS) nº 2.207/2000"
   ],
   [
    "administrativo",
    "Lei Estadual (PA) nº 5.810/1994"
   ],
   [
    "administrativo",
    "Lei Estadual (SP) nº 10.177/1998"
   ],
   [
    "administrativo",
    "Lei nº 11.079/2004"
   ],
   [
    "administrativo",
    "Lei nº 12.462/2011"
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
    "Lei nº 13.019/2014"
   ],
   [
    "administrativo",
    "Lei nº 13.288/2016"
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
    "Lei nº 14.133/2021"
   ],
   [
    "administrativo",
    "Lei nº 14.230/2021"
   ],
   [
    "administrativo",
    "Lei nº 15.047/2024"
   ],
   [
    "administrativo",
    "Lei nº 4.504/1964"
   ],
   [
    "administrativo",
    "Lei nº 4.878/1965"
   ],
   [
    "administrativo",
    "Lei nº 8.112/1990"
   ],
   [
    "administrativo",
    "Lei nº 8.429/1992"
   ],
   [
    "administrativo",
    "Lei nº 8.625/1993"
   ],
   [
    "administrativo",
    "Lei nº 8.629/1993"
   ],
   [
    "administrativo",
    "Lei nº 8.987/1995"
   ],
   [
    "administrativo",
    "Lei nº 9.637/1998"
   ],
   [
    "administrativo",
    "Lei nº 9.784/1999"
   ],
   [
    "administrativo",
    "Lei nº 9.790/1999"
   ],
   [
    "administrativo",
    "Lei nº 9.986/2000"
   ],
   [
    "ambiental",
    "Decreto nº 10.936/2022"
   ],
   [
    "ambiental",
    "Decreto nº 6.514/2008"
   ],
   [
    "ambiental",
    "Decreto nº 7.217/2010"
   ],
   [
    "ambiental",
    "Decreto nº 99.274/1990"
   ],
   [
    "ambiental",
    "Lei Complementar nº 140/2011"
   ],
   [
    "ambiental",
    "Lei Estadual (MS) nº 2.257/2001"
   ],
   [
    "ambiental",
    "Lei Estadual (MS) nº 2.406/2002"
   ],
   [
    "ambiental",
    "Lei Estadual (MS) nº 4.555/2014"
   ],
   [
    "ambiental",
    "Lei Estadual (MS) nº 5.235/2018"
   ],
   [
    "ambiental",
    "Lei Estadual (PA) nº 5.629/1990"
   ],
   [
    "ambiental",
    "Lei Estadual (PA) nº 6.745/2005"
   ],
   [
    "ambiental",
    "Lei Estadual (PA) nº 9.048/2020"
   ],
   [
    "ambiental",
    "Lei Estadual (SC) nº 14.675/2009"
   ],
   [
    "ambiental",
    "Lei Estadual (SC) nº 16.342/2014"
   ],
   [
    "ambiental",
    "Lei nº 10.257/2001"
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
    "Lei nº 11.124/2005"
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
    "Lei nº 11.445/2007"
   ],
   [
    "ambiental",
    "Lei nº 11.952/2009"
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
    "Lei nº 12.334/2010"
   ],
   [
    "ambiental",
    "Lei nº 12.587/2012"
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
    "Lei nº 13.123/2015"
   ],
   [
    "ambiental",
    "Lei nº 14.026/2020"
   ],
   [
    "ambiental",
    "Lei nº 14.119/2021"
   ],
   [
    "ambiental",
    "Lei nº 14.755/2023"
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
    "Lei nº 6.938/1981"
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
    "Medida Provisória nº 1.308/2025"
   ],
   [
    "civil",
    "Decreto nº 20.910/1932"
   ],
   [
    "civil",
    "Decreto nº 22.626/1933"
   ],
   [
    "civil",
    "Decreto nº 57.663/1966"
   ],
   [
    "civil",
    "Decreto-Lei nº 4.657/1942"
   ],
   [
    "civil",
    "Lei Estadual (SC) nº 17.492/2018"
   ],
   [
    "civil",
    "Lei nº 1.060/1950"
   ],
   [
    "civil",
    "Lei nº 10.406/2002"
   ],
   [
    "civil",
    "Lei nº 10.741/2003"
   ],
   [
    "civil",
    "Lei nº 10.931/2004"
   ],
   [
    "civil",
    "Lei nº 11.076/2004"
   ],
   [
    "civil",
    "Lei nº 11.804/2008"
   ],
   [
    "civil",
    "Lei nº 12.376/2010"
   ],
   [
    "civil",
    "Lei nº 12.764/2012"
   ],
   [
    "civil",
    "Lei nº 12.965/2014"
   ],
   [
    "civil",
    "Lei nº 13.058/2014"
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
    "Lei nº 13.874/2019"
   ],
   [
    "civil",
    "Lei nº 14.010/2020"
   ],
   [
    "civil",
    "Lei nº 14.382/2022"
   ],
   [
    "civil",
    "Lei nº 14.443/2022"
   ],
   [
    "civil",
    "Lei nº 14.905/2024"
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
    "Lei nº 6.015/1973"
   ],
   [
    "civil",
    "Lei nº 6.515/1977"
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
    "Lei nº 8.245/1991"
   ],
   [
    "civil",
    "Lei nº 8.560/1992"
   ],
   [
    "civil",
    "Lei nº 8.935/1994"
   ],
   [
    "civil",
    "Lei nº 8.971/1994"
   ],
   [
    "civil",
    "Lei nº 9.278/1996"
   ],
   [
    "civil",
    "Lei nº 9.492/1997"
   ],
   [
    "civil",
    "Lei nº 9.514/1997"
   ],
   [
    "civil",
    "Resolução CNJ nº 452/2022"
   ],
   [
    "constitucional",
    "CF/1988"
   ],
   [
    "consumidor",
    "Decreto nº 2.181/1997"
   ],
   [
    "consumidor",
    "Decreto nº 7.962/2013"
   ],
   [
    "consumidor",
    "Decreto nº 9.936/2019"
   ],
   [
    "consumidor",
    "Lei Complementar nº 166/2019"
   ],
   [
    "consumidor",
    "Lei nº 12.414/2011"
   ],
   [
    "consumidor",
    "Lei nº 14.538/2023"
   ],
   [
    "consumidor",
    "Lei nº 8.078/1990"
   ],
   [
    "consumidor",
    "Lei nº 9.656/1998"
   ],
   [
    "consumidor",
    "Resolução ANATEL nº 765/2023"
   ],
   [
    "consumidor",
    "Resolução Normativa ANEEL nº 1.000/2021"
   ],
   [
    "crianca",
    "Decreto nº 9.603/2018"
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
    "Lei nº 13.257/2016"
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
    "eleitoral",
    "Lei Complementar nº 64/1990"
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
    "Lei nº 9.096/1995"
   ],
   [
    "eleitoral",
    "Lei nº 9.504/1997"
   ],
   [
    "empresarial",
    "Decreto nº 2.044/1908"
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
    "Lei nº 14.112/2020"
   ],
   [
    "empresarial",
    "Lei nº 14.193/2021"
   ],
   [
    "empresarial",
    "Lei nº 6.840/1980"
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
    "humanos",
    "Decreto nº 678/1992"
   ],
   [
    "humanos",
    "Decreto nº 7.037/2009"
   ],
   [
    "humanos",
    "Decreto nº 9.571/2018"
   ],
   [
    "humanos",
    "Lei nº 7.716/1989"
   ],
   [
    "penal",
    "Decreto-Lei nº 201/1967"
   ],
   [
    "penal",
    "Decreto-Lei nº 3.688/1941"
   ],
   [
    "penal",
    "Decreto-Lei nº 6.259/1944"
   ],
   [
    "penal",
    "Lei nº 1.521/1951"
   ],
   [
    "penal",
    "Lei nº 10.826/2003"
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
    "Lei nº 13.869/2019"
   ],
   [
    "penal",
    "Lei nº 13.964/2019"
   ],
   [
    "penal",
    "Lei nº 14.188/2021"
   ],
   [
    "penal",
    "Lei nº 14.597/2023"
   ],
   [
    "penal",
    "Lei nº 15.358/2026"
   ],
   [
    "penal",
    "Lei nº 4.898/1965"
   ],
   [
    "penal",
    "Lei nº 6.001/1973"
   ],
   [
    "penal",
    "Lei nº 7.210/1984"
   ],
   [
    "penal",
    "Lei nº 7.492/1986"
   ],
   [
    "penal",
    "Lei nº 7.716/1989"
   ],
   [
    "penal",
    "Lei nº 8.072/1990"
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
    "Lei nº 9.020/1995"
   ],
   [
    "penal",
    "Lei nº 9.029/1995"
   ],
   [
    "penal",
    "Lei nº 9.263/1996"
   ],
   [
    "penal",
    "Lei nº 9.434/1997"
   ],
   [
    "penal",
    "Lei nº 9.455/1997"
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
    "Lei nº 9.613/1998"
   ],
   [
    "previdenciario",
    "Lei Complementar (MT) nº 670/2020"
   ],
   [
    "previdenciario",
    "Lei nº 12.435/2011"
   ],
   [
    "previdenciario",
    "Lei nº 8.742/1993"
   ],
   [
    "processual_civil",
    "Emenda Constitucional nº 125/2022"
   ],
   [
    "processual_civil",
    "Lei nº 10.259/2001"
   ],
   [
    "processual_civil",
    "Lei nº 11.417/2006"
   ],
   [
    "processual_civil",
    "Lei nº 11.418/2006"
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
    "Lei nº 12.153/2009"
   ],
   [
    "processual_civil",
    "Lei nº 13.105/2015"
   ],
   [
    "processual_civil",
    "Lei nº 13.129/2015"
   ],
   [
    "processual_civil",
    "Lei nº 13.140/2015"
   ],
   [
    "processual_civil",
    "Lei nº 13.655/2018"
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
    "Lei nº 8.437/1992"
   ],
   [
    "processual_civil",
    "Lei nº 9.099/1995"
   ],
   [
    "processual_civil",
    "Lei nº 9.307/1996"
   ],
   [
    "processual_civil",
    "Lei nº 9.494/1997"
   ],
   [
    "processual_civil",
    "Lei nº 9.507/1997"
   ],
   [
    "processual_penal",
    "Decreto-Lei nº 1.002/1969"
   ],
   [
    "processual_penal",
    "Decreto-Lei nº 201/1967"
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
    "Lei nº 4.737/1965"
   ],
   [
    "processual_penal",
    "Lei nº 7.210/1984"
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
    "tributario",
    "Lei Complementar nº 101/2000"
   ],
   [
    "tributario",
    "Lei Estadual (SC) nº 3.938/1966"
   ],
   [
    "tributario",
    "Lei nº 10.169/2000"
   ],
   [
    "tributario",
    "Lei nº 5.172/1966"
   ],
   [
    "tributario",
    "Lei nº 6.830/1980"
   ]
  ],
  "tipo": "edital"
 },
 {
  "id": "tjpr-1-2025",
  "sigla": "TJPR",
  "cargo": "Juiz Substituto",
  "orgao": "Tribunal de Justiça do Estado do Paraná",
  "titulo": "Concurso Público para Ingresso na Magistratura do Estado do Paraná",
  "edital": "Edital nº 001/2025",
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
    "administrativo",
    "Decreto nº 6.017/2007"
   ],
   [
    "administrativo",
    "Decreto nº 7.746/2012"
   ],
   [
    "administrativo",
    "Decreto-Lei nº 3.365/1941"
   ],
   [
    "administrativo",
    "Decreto-Lei nº 4.597/1942"
   ],
   [
    "administrativo",
    "Lei Complementar (DF) nº 840/2011"
   ],
   [
    "administrativo",
    "Lei Complementar (MS) nº 72/1994"
   ],
   [
    "administrativo",
    "Lei Complementar (MT) nº 04/1990"
   ],
   [
    "administrativo",
    "Lei Complementar (SC) nº 491/2010"
   ],
   [
    "administrativo",
    "Lei Complementar (SE) nº 33/1996"
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
    "Lei Complementar nº 75/1993"
   ],
   [
    "administrativo",
    "Lei Estadual (BA) nº 6.677/1994"
   ],
   [
    "administrativo",
    "Lei Estadual (MA) nº 6.107/1994"
   ],
   [
    "administrativo",
    "Lei Estadual (MS) nº 1.102/1990"
   ],
   [
    "administrativo",
    "Lei Estadual (PA) nº 5.810/1994"
   ],
   [
    "administrativo",
    "Lei Estadual (SP) nº 10.177/1998"
   ],
   [
    "administrativo",
    "Lei nº 11.079/2004"
   ],
   [
    "administrativo",
    "Lei nº 12.462/2011"
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
    "Lei nº 13.019/2014"
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
    "Lei nº 14.133/2021"
   ],
   [
    "administrativo",
    "Lei nº 14.230/2021"
   ],
   [
    "administrativo",
    "Lei nº 15.047/2024"
   ],
   [
    "administrativo",
    "Lei nº 4.878/1965"
   ],
   [
    "administrativo",
    "Lei nº 8.112/1990"
   ],
   [
    "administrativo",
    "Lei nº 8.429/1992"
   ],
   [
    "administrativo",
    "Lei nº 8.625/1993"
   ],
   [
    "administrativo",
    "Lei nº 8.987/1995"
   ],
   [
    "administrativo",
    "Lei nº 9.637/1998"
   ],
   [
    "administrativo",
    "Lei nº 9.784/1999"
   ],
   [
    "administrativo",
    "Lei nº 9.790/1999"
   ],
   [
    "administrativo",
    "Lei nº 9.986/2000"
   ],
   [
    "ambiental",
    "Decreto nº 10.936/2022"
   ],
   [
    "ambiental",
    "Decreto nº 6.514/2008"
   ],
   [
    "ambiental",
    "Decreto nº 7.217/2010"
   ],
   [
    "ambiental",
    "Decreto nº 99.274/1990"
   ],
   [
    "ambiental",
    "Lei Complementar nº 140/2011"
   ],
   [
    "ambiental",
    "Lei Estadual (PA) nº 5.629/1990"
   ],
   [
    "ambiental",
    "Lei Estadual (PA) nº 6.745/2005"
   ],
   [
    "ambiental",
    "Lei Estadual (PA) nº 9.048/2020"
   ],
   [
    "ambiental",
    "Lei Estadual (SC) nº 14.675/2009"
   ],
   [
    "ambiental",
    "Lei Estadual (SC) nº 16.342/2014"
   ],
   [
    "ambiental",
    "Lei nº 10.257/2001"
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
    "Lei nº 11.124/2005"
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
    "Lei nº 11.445/2007"
   ],
   [
    "ambiental",
    "Lei nº 11.952/2009"
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
    "Lei nº 12.334/2010"
   ],
   [
    "ambiental",
    "Lei nº 12.587/2012"
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
    "Lei nº 13.123/2015"
   ],
   [
    "ambiental",
    "Lei nº 14.026/2020"
   ],
   [
    "ambiental",
    "Lei nº 14.119/2021"
   ],
   [
    "ambiental",
    "Lei nº 14.755/2023"
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
    "Lei nº 6.938/1981"
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
    "Medida Provisória nº 1.308/2025"
   ],
   [
    "civil",
    "Decreto nº 20.910/1932"
   ],
   [
    "civil",
    "Decreto nº 57.663/1966"
   ],
   [
    "civil",
    "Decreto-Lei nº 4.657/1942"
   ],
   [
    "civil",
    "Decreto-Lei nº 911/1969"
   ],
   [
    "civil",
    "Lei nº 1.060/1950"
   ],
   [
    "civil",
    "Lei nº 10.406/2002"
   ],
   [
    "civil",
    "Lei nº 10.741/2003"
   ],
   [
    "civil",
    "Lei nº 10.931/2004"
   ],
   [
    "civil",
    "Lei nº 11.804/2008"
   ],
   [
    "civil",
    "Lei nº 12.376/2010"
   ],
   [
    "civil",
    "Lei nº 12.764/2012"
   ],
   [
    "civil",
    "Lei nº 12.965/2014"
   ],
   [
    "civil",
    "Lei nº 13.058/2014"
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
    "Lei nº 13.874/2019"
   ],
   [
    "civil",
    "Lei nº 14.010/2020"
   ],
   [
    "civil",
    "Lei nº 14.382/2022"
   ],
   [
    "civil",
    "Lei nº 14.443/2022"
   ],
   [
    "civil",
    "Lei nº 14.905/2024"
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
    "Lei nº 6.015/1973"
   ],
   [
    "civil",
    "Lei nº 6.515/1977"
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
    "civil",
    "Lei nº 8.560/1992"
   ],
   [
    "civil",
    "Lei nº 8.935/1994"
   ],
   [
    "civil",
    "Lei nº 8.971/1994"
   ],
   [
    "civil",
    "Lei nº 9.278/1996"
   ],
   [
    "civil",
    "Lei nº 9.514/1997"
   ],
   [
    "civil",
    "Resolução CNJ nº 452/2022"
   ],
   [
    "constitucional",
    "CF/1988"
   ],
   [
    "constitucional",
    "Lei Estadual (PR) nº 14.277/2003"
   ],
   [
    "consumidor",
    "Decreto nº 2.181/1997"
   ],
   [
    "consumidor",
    "Decreto nº 7.962/2013"
   ],
   [
    "consumidor",
    "Decreto nº 9.936/2019"
   ],
   [
    "consumidor",
    "Lei Complementar nº 166/2019"
   ],
   [
    "consumidor",
    "Lei nº 12.414/2011"
   ],
   [
    "consumidor",
    "Lei nº 14.538/2023"
   ],
   [
    "consumidor",
    "Lei nº 8.078/1990"
   ],
   [
    "consumidor",
    "Lei nº 9.656/1998"
   ],
   [
    "crianca",
    "Decreto nº 9.603/2018"
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
    "Lei nº 13.257/2016"
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
    "eleitoral",
    "Lei Complementar nº 64/1990"
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
    "Lei nº 9.096/1995"
   ],
   [
    "eleitoral",
    "Lei nº 9.504/1997"
   ],
   [
    "empresarial",
    "Decreto nº 2.044/1908"
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
    "Lei nº 14.112/2020"
   ],
   [
    "empresarial",
    "Lei nº 14.193/2021"
   ],
   [
    "empresarial",
    "Lei nº 6.840/1980"
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
    "humanos",
    "Decreto nº 678/1992"
   ],
   [
    "humanos",
    "Decreto nº 7.037/2009"
   ],
   [
    "humanos",
    "Decreto nº 9.571/2018"
   ],
   [
    "humanos",
    "Lei nº 7.716/1989"
   ],
   [
    "penal",
    "Decreto-Lei nº 201/1967"
   ],
   [
    "penal",
    "Decreto-Lei nº 3.688/1941"
   ],
   [
    "penal",
    "Decreto-Lei nº 6.259/1944"
   ],
   [
    "penal",
    "Lei nº 1.521/1951"
   ],
   [
    "penal",
    "Lei nº 10.826/2003"
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
    "Lei nº 13.869/2019"
   ],
   [
    "penal",
    "Lei nº 13.964/2019"
   ],
   [
    "penal",
    "Lei nº 14.188/2021"
   ],
   [
    "penal",
    "Lei nº 14.597/2023"
   ],
   [
    "penal",
    "Lei nº 15.358/2026"
   ],
   [
    "penal",
    "Lei nº 4.898/1965"
   ],
   [
    "penal",
    "Lei nº 6.001/1973"
   ],
   [
    "penal",
    "Lei nº 7.210/1984"
   ],
   [
    "penal",
    "Lei nº 7.492/1986"
   ],
   [
    "penal",
    "Lei nº 7.716/1989"
   ],
   [
    "penal",
    "Lei nº 7.802/1989"
   ],
   [
    "penal",
    "Lei nº 8.072/1990"
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
    "Lei nº 9.020/1995"
   ],
   [
    "penal",
    "Lei nº 9.029/1995"
   ],
   [
    "penal",
    "Lei nº 9.263/1996"
   ],
   [
    "penal",
    "Lei nº 9.434/1997"
   ],
   [
    "penal",
    "Lei nº 9.455/1997"
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
    "Lei nº 9.613/1998"
   ],
   [
    "previdenciario",
    "Decreto nº 3.048/1999"
   ],
   [
    "previdenciario",
    "Emenda Constitucional nº 103/2019"
   ],
   [
    "previdenciario",
    "Lei Complementar nº 108/2001"
   ],
   [
    "previdenciario",
    "Lei Complementar nº 109/2001"
   ],
   [
    "previdenciario",
    "Lei nº 12.435/2011"
   ],
   [
    "previdenciario",
    "Lei nº 12.618/2012"
   ],
   [
    "previdenciario",
    "Lei nº 13.876/2019"
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
    "Lei nº 8.742/1993"
   ],
   [
    "processual_civil",
    "Emenda Constitucional nº 125/2022"
   ],
   [
    "processual_civil",
    "Lei nº 10.259/2001"
   ],
   [
    "processual_civil",
    "Lei nº 11.417/2006"
   ],
   [
    "processual_civil",
    "Lei nº 11.418/2006"
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
    "Lei nº 12.153/2009"
   ],
   [
    "processual_civil",
    "Lei nº 13.105/2015"
   ],
   [
    "processual_civil",
    "Lei nº 13.129/2015"
   ],
   [
    "processual_civil",
    "Lei nº 13.140/2015"
   ],
   [
    "processual_civil",
    "Lei nº 13.655/2018"
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
    "Lei nº 8.437/1992"
   ],
   [
    "processual_civil",
    "Lei nº 9.099/1995"
   ],
   [
    "processual_civil",
    "Lei nº 9.307/1996"
   ],
   [
    "processual_civil",
    "Lei nº 9.494/1997"
   ],
   [
    "processual_civil",
    "Lei nº 9.507/1997"
   ],
   [
    "processual_penal",
    "Decreto-Lei nº 1.002/1969"
   ],
   [
    "processual_penal",
    "Decreto-Lei nº 201/1967"
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
    "Lei nº 4.737/1965"
   ],
   [
    "processual_penal",
    "Lei nº 7.210/1984"
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
    "tributario",
    "Decreto Estadual (MG) nº 44.747/2008"
   ],
   [
    "tributario",
    "Decreto nº 70.235/1972"
   ],
   [
    "tributario",
    "Lei Complementar (SC) nº 465/2009"
   ],
   [
    "tributario",
    "Lei Complementar nº 118/2005"
   ],
   [
    "tributario",
    "Lei Estadual (PR) nº 11.580/1996"
   ],
   [
    "tributario",
    "Lei Estadual (PR) nº 14.260/2003"
   ],
   [
    "tributario",
    "Lei Estadual (PR) nº 18.573/2015"
   ],
   [
    "tributario",
    "Lei Estadual (PR) nº 18.877/2016"
   ],
   [
    "tributario",
    "Lei Estadual (SC) nº 13.136/2004"
   ],
   [
    "tributario",
    "Lei Estadual (SC) nº 3.938/1966"
   ],
   [
    "tributario",
    "Lei nº 10.169/2000"
   ],
   [
    "tributario",
    "Lei nº 5.172/1966"
   ],
   [
    "tributario",
    "Lei nº 6.830/1980"
   ],
   [
    "tributario",
    "Lei nº 8.397/1992"
   ]
  ],
  "tipo": "edital"
 },
 {
  "id": "tjto-1-2025",
  "sigla": "TJTO",
  "cargo": "Juiz Substituto",
  "orgao": "Tribunal de Justiça do Estado do Tocantins",
  "titulo": "Concurso Público para Ingresso na Magistratura do Estado do Tocantins",
  "edital": "Edital nº 01/2025",
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
    "administrativo",
    "Decreto nº 6.017/2007"
   ],
   [
    "administrativo",
    "Decreto nº 7.746/2012"
   ],
   [
    "administrativo",
    "Decreto-Lei nº 3.365/1941"
   ],
   [
    "administrativo",
    "Decreto-Lei nº 4.597/1942"
   ],
   [
    "administrativo",
    "Lei Complementar (DF) nº 840/2011"
   ],
   [
    "administrativo",
    "Lei Complementar (MS) nº 72/1994"
   ],
   [
    "administrativo",
    "Lei Complementar (MT) nº 04/1990"
   ],
   [
    "administrativo",
    "Lei Complementar (SC) nº 491/2010"
   ],
   [
    "administrativo",
    "Lei Complementar (SE) nº 33/1996"
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
    "Lei Complementar nº 75/1993"
   ],
   [
    "administrativo",
    "Lei Estadual (BA) nº 6.677/1994"
   ],
   [
    "administrativo",
    "Lei Estadual (MA) nº 6.107/1994"
   ],
   [
    "administrativo",
    "Lei Estadual (MS) nº 1.102/1990"
   ],
   [
    "administrativo",
    "Lei Estadual (PA) nº 5.810/1994"
   ],
   [
    "administrativo",
    "Lei Estadual (SP) nº 10.177/1998"
   ],
   [
    "administrativo",
    "Lei nº 11.079/2004"
   ],
   [
    "administrativo",
    "Lei nº 12.462/2011"
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
    "Lei nº 13.019/2014"
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
    "Lei nº 14.133/2021"
   ],
   [
    "administrativo",
    "Lei nº 14.230/2021"
   ],
   [
    "administrativo",
    "Lei nº 15.047/2024"
   ],
   [
    "administrativo",
    "Lei nº 4.320/1964"
   ],
   [
    "administrativo",
    "Lei nº 4.878/1965"
   ],
   [
    "administrativo",
    "Lei nº 8.112/1990"
   ],
   [
    "administrativo",
    "Lei nº 8.429/1992"
   ],
   [
    "administrativo",
    "Lei nº 8.625/1993"
   ],
   [
    "administrativo",
    "Lei nº 8.666/1993"
   ],
   [
    "administrativo",
    "Lei nº 8.987/1995"
   ],
   [
    "administrativo",
    "Lei nº 9.637/1998"
   ],
   [
    "administrativo",
    "Lei nº 9.784/1999"
   ],
   [
    "administrativo",
    "Lei nº 9.790/1999"
   ],
   [
    "administrativo",
    "Lei nº 9.986/2000"
   ],
   [
    "ambiental",
    "Decreto nº 10.936/2022"
   ],
   [
    "ambiental",
    "Decreto nº 6.514/2008"
   ],
   [
    "ambiental",
    "Decreto nº 7.217/2010"
   ],
   [
    "ambiental",
    "Decreto nº 99.274/1990"
   ],
   [
    "ambiental",
    "Lei Complementar nº 140/2011"
   ],
   [
    "ambiental",
    "Lei Estadual (PA) nº 5.629/1990"
   ],
   [
    "ambiental",
    "Lei Estadual (PA) nº 6.745/2005"
   ],
   [
    "ambiental",
    "Lei Estadual (PA) nº 9.048/2020"
   ],
   [
    "ambiental",
    "Lei Estadual (SC) nº 14.675/2009"
   ],
   [
    "ambiental",
    "Lei Estadual (SC) nº 16.342/2014"
   ],
   [
    "ambiental",
    "Lei nº 10.257/2001"
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
    "Lei nº 11.124/2005"
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
    "Lei nº 11.445/2007"
   ],
   [
    "ambiental",
    "Lei nº 11.952/2009"
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
    "Lei nº 12.334/2010"
   ],
   [
    "ambiental",
    "Lei nº 12.587/2012"
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
    "Lei nº 13.123/2015"
   ],
   [
    "ambiental",
    "Lei nº 14.026/2020"
   ],
   [
    "ambiental",
    "Lei nº 14.119/2021"
   ],
   [
    "ambiental",
    "Lei nº 14.755/2023"
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
    "Lei nº 6.938/1981"
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
    "Medida Provisória nº 1.308/2025"
   ],
   [
    "civil",
    "Decreto nº 20.910/1932"
   ],
   [
    "civil",
    "Decreto nº 22.626/1933"
   ],
   [
    "civil",
    "Decreto nº 57.663/1966"
   ],
   [
    "civil",
    "Decreto-Lei nº 4.657/1942"
   ],
   [
    "civil",
    "Decreto-Lei nº 911/1969"
   ],
   [
    "civil",
    "Lei Estadual (SC) nº 17.492/2018"
   ],
   [
    "civil",
    "Lei nº 1.060/1950"
   ],
   [
    "civil",
    "Lei nº 10.406/2002"
   ],
   [
    "civil",
    "Lei nº 10.741/2003"
   ],
   [
    "civil",
    "Lei nº 10.931/2004"
   ],
   [
    "civil",
    "Lei nº 11.076/2004"
   ],
   [
    "civil",
    "Lei nº 11.804/2008"
   ],
   [
    "civil",
    "Lei nº 12.376/2010"
   ],
   [
    "civil",
    "Lei nº 12.764/2012"
   ],
   [
    "civil",
    "Lei nº 12.965/2014"
   ],
   [
    "civil",
    "Lei nº 13.058/2014"
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
    "Lei nº 13.874/2019"
   ],
   [
    "civil",
    "Lei nº 14.010/2020"
   ],
   [
    "civil",
    "Lei nº 14.382/2022"
   ],
   [
    "civil",
    "Lei nº 14.443/2022"
   ],
   [
    "civil",
    "Lei nº 14.905/2024"
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
    "Lei nº 6.015/1973"
   ],
   [
    "civil",
    "Lei nº 6.515/1977"
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
    "Lei nº 8.245/1991"
   ],
   [
    "civil",
    "Lei nº 8.560/1992"
   ],
   [
    "civil",
    "Lei nº 8.935/1994"
   ],
   [
    "civil",
    "Lei nº 8.971/1994"
   ],
   [
    "civil",
    "Lei nº 9.278/1996"
   ],
   [
    "civil",
    "Lei nº 9.492/1997"
   ],
   [
    "civil",
    "Lei nº 9.514/1997"
   ],
   [
    "civil",
    "Resolução CNJ nº 452/2022"
   ],
   [
    "constitucional",
    "CF/1988"
   ],
   [
    "consumidor",
    "Decreto nº 2.181/1997"
   ],
   [
    "consumidor",
    "Decreto nº 7.962/2013"
   ],
   [
    "consumidor",
    "Decreto nº 9.936/2019"
   ],
   [
    "consumidor",
    "Lei Complementar nº 166/2019"
   ],
   [
    "consumidor",
    "Lei nº 12.414/2011"
   ],
   [
    "consumidor",
    "Lei nº 14.538/2023"
   ],
   [
    "consumidor",
    "Lei nº 8.078/1990"
   ],
   [
    "consumidor",
    "Lei nº 9.656/1998"
   ],
   [
    "consumidor",
    "Resolução ANATEL nº 765/2023"
   ],
   [
    "consumidor",
    "Resolução Normativa ANEEL nº 1.000/2021"
   ],
   [
    "crianca",
    "Decreto nº 9.603/2018"
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
    "Lei nº 13.257/2016"
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
    "Resolução CNJ nº 295/2019"
   ],
   [
    "eleitoral",
    "Lei Complementar nº 64/1990"
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
    "Lei nº 9.096/1995"
   ],
   [
    "eleitoral",
    "Lei nº 9.504/1997"
   ],
   [
    "empresarial",
    "Decreto nº 2.044/1908"
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
    "Lei nº 14.112/2020"
   ],
   [
    "empresarial",
    "Lei nº 14.193/2021"
   ],
   [
    "empresarial",
    "Lei nº 6.840/1980"
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
    "humanos",
    "Decreto nº 678/1992"
   ],
   [
    "humanos",
    "Decreto nº 7.037/2009"
   ],
   [
    "humanos",
    "Decreto nº 9.571/2018"
   ],
   [
    "humanos",
    "Lei nº 7.716/1989"
   ],
   [
    "penal",
    "Decreto-Lei nº 201/1967"
   ],
   [
    "penal",
    "Decreto-Lei nº 3.688/1941"
   ],
   [
    "penal",
    "Decreto-Lei nº 6.259/1944"
   ],
   [
    "penal",
    "Lei nº 1.521/1951"
   ],
   [
    "penal",
    "Lei nº 10.826/2003"
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
    "Lei nº 13.869/2019"
   ],
   [
    "penal",
    "Lei nº 13.964/2019"
   ],
   [
    "penal",
    "Lei nº 14.188/2021"
   ],
   [
    "penal",
    "Lei nº 14.597/2023"
   ],
   [
    "penal",
    "Lei nº 15.358/2026"
   ],
   [
    "penal",
    "Lei nº 4.898/1965"
   ],
   [
    "penal",
    "Lei nº 6.001/1973"
   ],
   [
    "penal",
    "Lei nº 7.210/1984"
   ],
   [
    "penal",
    "Lei nº 7.492/1986"
   ],
   [
    "penal",
    "Lei nº 7.716/1989"
   ],
   [
    "penal",
    "Lei nº 8.072/1990"
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
    "Lei nº 9.020/1995"
   ],
   [
    "penal",
    "Lei nº 9.029/1995"
   ],
   [
    "penal",
    "Lei nº 9.263/1996"
   ],
   [
    "penal",
    "Lei nº 9.434/1997"
   ],
   [
    "penal",
    "Lei nº 9.455/1997"
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
    "Lei nº 9.613/1998"
   ],
   [
    "previdenciario",
    "Lei nº 12.435/2011"
   ],
   [
    "previdenciario",
    "Lei nº 8.742/1993"
   ],
   [
    "processual_civil",
    "Emenda Constitucional nº 125/2022"
   ],
   [
    "processual_civil",
    "Lei nº 10.259/2001"
   ],
   [
    "processual_civil",
    "Lei nº 11.417/2006"
   ],
   [
    "processual_civil",
    "Lei nº 11.418/2006"
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
    "Lei nº 12.153/2009"
   ],
   [
    "processual_civil",
    "Lei nº 13.105/2015"
   ],
   [
    "processual_civil",
    "Lei nº 13.129/2015"
   ],
   [
    "processual_civil",
    "Lei nº 13.140/2015"
   ],
   [
    "processual_civil",
    "Lei nº 13.655/2018"
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
    "Lei nº 8.437/1992"
   ],
   [
    "processual_civil",
    "Lei nº 9.099/1995"
   ],
   [
    "processual_civil",
    "Lei nº 9.307/1996"
   ],
   [
    "processual_civil",
    "Lei nº 9.494/1997"
   ],
   [
    "processual_civil",
    "Lei nº 9.507/1997"
   ],
   [
    "processual_penal",
    "Decreto-Lei nº 1.002/1969"
   ],
   [
    "processual_penal",
    "Decreto-Lei nº 201/1967"
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
    "Lei nº 4.737/1965"
   ],
   [
    "processual_penal",
    "Lei nº 7.210/1984"
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
    "tributario",
    "Lei Complementar nº 101/2000"
   ],
   [
    "tributario",
    "Lei Complementar nº 118/2005"
   ],
   [
    "tributario",
    "Lei Estadual (SC) nº 3.938/1966"
   ],
   [
    "tributario",
    "Lei nº 10.169/2000"
   ],
   [
    "tributario",
    "Lei nº 5.172/1966"
   ],
   [
    "tributario",
    "Lei nº 6.830/1980"
   ],
   [
    "tributario",
    "Lei nº 8.397/1992"
   ]
  ],
  "tipo": "edital"
 },
 {
  "id": "tjmg-1-2026",
  "sigla": "TJMG",
  "cargo": "Juiz de Direito Substituto",
  "orgao": "Tribunal de Justiça do Estado de Minas Gerais",
  "titulo": "Concurso Público para Ingresso na Magistratura do Estado de Minas Gerais",
  "edital": "Edital nº 1/2026",
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
    "administrativo",
    "Decreto nº 1.171/1994"
   ],
   [
    "administrativo",
    "Decreto nº 6.017/2007"
   ],
   [
    "administrativo",
    "Decreto-Lei nº 200/1967"
   ],
   [
    "administrativo",
    "Decreto-Lei nº 3.365/1941"
   ],
   [
    "administrativo",
    "Lei Complementar (DF) nº 840/2011"
   ],
   [
    "administrativo",
    "Lei Complementar (SC) nº 491/2010"
   ],
   [
    "administrativo",
    "Lei Complementar (SE) nº 33/1996"
   ],
   [
    "administrativo",
    "Lei Complementar nº 101/2000"
   ],
   [
    "administrativo",
    "Lei Estadual (PA) nº 5.810/1994"
   ],
   [
    "administrativo",
    "Lei Estadual (SP) nº 10.177/1998"
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
    "Lei nº 13.848/2019"
   ],
   [
    "administrativo",
    "Lei nº 14.133/2021"
   ],
   [
    "administrativo",
    "Lei nº 14.230/2021"
   ],
   [
    "administrativo",
    "Lei nº 4.878/1965"
   ],
   [
    "administrativo",
    "Lei nº 8.112/1990"
   ],
   [
    "administrativo",
    "Lei nº 8.429/1992"
   ],
   [
    "administrativo",
    "Lei nº 8.987/1995"
   ],
   [
    "administrativo",
    "Lei nº 9.469/1997"
   ],
   [
    "administrativo",
    "Lei nº 9.637/1998"
   ],
   [
    "administrativo",
    "Lei nº 9.784/1999"
   ],
   [
    "administrativo",
    "Lei nº 9.790/1999"
   ],
   [
    "administrativo",
    "Lei nº 9.986/2000"
   ],
   [
    "ambiental",
    "Decreto nº 10.936/2022"
   ],
   [
    "ambiental",
    "Decreto nº 9.310/2018"
   ],
   [
    "ambiental",
    "Decreto nº 99.274/1990"
   ],
   [
    "ambiental",
    "Lei Complementar nº 140/2011"
   ],
   [
    "ambiental",
    "Lei Estadual (PA) nº 8.878/2019"
   ],
   [
    "ambiental",
    "Lei Estadual (PA) nº 9.048/2020"
   ],
   [
    "ambiental",
    "Lei Estadual (SC) nº 14.675/2009"
   ],
   [
    "ambiental",
    "Lei Estadual (SC) nº 16.342/2014"
   ],
   [
    "ambiental",
    "Lei nº 11.952/2009"
   ],
   [
    "ambiental",
    "Lei nº 11.977/2009"
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
    "Lei nº 12.334/2010"
   ],
   [
    "ambiental",
    "Lei nº 12.587/2012"
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
    "Lei nº 13.465/2017"
   ],
   [
    "ambiental",
    "Lei nº 14.755/2023"
   ],
   [
    "ambiental",
    "Lei nº 14.904/2024"
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
    "Lei nº 6.938/1981"
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
    "Medida Provisória nº 1.308/2025"
   ],
   [
    "civil",
    "Decreto nº 3.413/2000"
   ],
   [
    "civil",
    "Decreto nº 9.176/2017"
   ],
   [
    "civil",
    "Decreto-Lei nº 4.657/1942"
   ],
   [
    "civil",
    "Decreto-Lei nº 911/1969"
   ],
   [
    "civil",
    "Lei Estadual (SC) nº 17.492/2018"
   ],
   [
    "civil",
    "Lei nº 10.406/2002"
   ],
   [
    "civil",
    "Lei nº 10.741/2003"
   ],
   [
    "civil",
    "Lei nº 12.376/2010"
   ],
   [
    "civil",
    "Lei nº 12.764/2012"
   ],
   [
    "civil",
    "Lei nº 12.965/2014"
   ],
   [
    "civil",
    "Lei nº 13.058/2014"
   ],
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
    "Lei nº 14.010/2020"
   ],
   [
    "civil",
    "Lei nº 14.382/2022"
   ],
   [
    "civil",
    "Lei nº 14.443/2022"
   ],
   [
    "civil",
    "Lei nº 14.905/2024"
   ],
   [
    "civil",
    "Lei nº 4.591/1964"
   ],
   [
    "civil",
    "Lei nº 6.015/1973"
   ],
   [
    "civil",
    "Lei nº 6.766/1979"
   ],
   [
    "civil",
    "Lei nº 8.245/1991"
   ],
   [
    "civil",
    "Lei nº 8.935/1994"
   ],
   [
    "civil",
    "Lei nº 8.971/1994"
   ],
   [
    "civil",
    "Lei nº 9.278/1996"
   ],
   [
    "civil",
    "Lei nº 9.514/1997"
   ],
   [
    "civil",
    "Lei nº 9.610/1998"
   ],
   [
    "civil",
    "Resolução CNJ nº 452/2022"
   ],
   [
    "constitucional",
    "Constituição Estadual (MG)"
   ],
   [
    "constitucional",
    "Emenda Constitucional nº 80/2014"
   ],
   [
    "consumidor",
    "Decreto nº 2.181/1997"
   ],
   [
    "consumidor",
    "Decreto nº 7.962/2013"
   ],
   [
    "consumidor",
    "Decreto nº 9.936/2019"
   ],
   [
    "consumidor",
    "Lei Complementar nº 166/2019"
   ],
   [
    "consumidor",
    "Lei nº 12.414/2011"
   ],
   [
    "consumidor",
    "Lei nº 8.078/1990"
   ],
   [
    "consumidor",
    "Lei nº 9.656/1998"
   ],
   [
    "consumidor",
    "Resolução ANATEL nº 765/2023"
   ],
   [
    "consumidor",
    "Resolução Normativa ANEEL nº 1.000/2021"
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
    "Lei nº 15.211/2025"
   ],
   [
    "crianca",
    "Lei nº 15.240/2025"
   ],
   [
    "crianca",
    "Lei nº 8.069/1990"
   ],
   [
    "eleitoral",
    "Lei Complementar nº 64/1990"
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
    "eleitoral",
    "Lei nº 9.096/1995"
   ],
   [
    "eleitoral",
    "Lei nº 9.504/1997"
   ],
   [
    "empresarial",
    "Decreto nº 2.044/1908"
   ],
   [
    "empresarial",
    "Decreto-Lei nº 167/1967"
   ],
   [
    "empresarial",
    "Lei Complementar nº 123/2006"
   ],
   [
    "empresarial",
    "Lei Complementar nº 182/2021"
   ],
   [
    "empresarial",
    "Lei nº 11.101/2005"
   ],
   [
    "empresarial",
    "Lei nº 14.112/2020"
   ],
   [
    "empresarial",
    "Lei nº 14.193/2021"
   ],
   [
    "empresarial",
    "Lei nº 14.430/2022"
   ],
   [
    "empresarial",
    "Lei nº 4.886/1965"
   ],
   [
    "empresarial",
    "Lei nº 6.404/1976"
   ],
   [
    "empresarial",
    "Lei nº 7.913/1989"
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
    "humanos",
    "Decreto nº 678/1992"
   ],
   [
    "humanos",
    "Decreto nº 7.037/2009"
   ],
   [
    "humanos",
    "Decreto nº 9.571/2018"
   ],
   [
    "humanos",
    "Lei nº 7.716/1989"
   ],
   [
    "penal",
    "Decreto-Lei nº 1.001/1969"
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
    "Decreto-Lei nº 3.688/1941"
   ],
   [
    "penal",
    "Decreto-Lei nº 3.914/1941"
   ],
   [
    "penal",
    "Decreto-Lei nº 6.259/1944"
   ],
   [
    "penal",
    "Lei nº 1.521/1951"
   ],
   [
    "penal",
    "Lei nº 10.671/2003"
   ],
   [
    "penal",
    "Lei nº 10.826/2003"
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
    "Lei nº 12.683/2012"
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
    "Lei nº 12.984/2014"
   ],
   [
    "penal",
    "Lei nº 13.869/2019"
   ],
   [
    "penal",
    "Lei nº 14.322/2022"
   ],
   [
    "penal",
    "Lei nº 15.358/2026"
   ],
   [
    "penal",
    "Lei nº 15.384/2026"
   ],
   [
    "penal",
    "Lei nº 4.898/1965"
   ],
   [
    "penal",
    "Lei nº 7.210/1984"
   ],
   [
    "penal",
    "Lei nº 7.716/1989"
   ],
   [
    "penal",
    "Lei nº 8.072/1990"
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
    "Lei nº 9.455/1997"
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
    "Lei nº 9.613/1998"
   ],
   [
    "processual_civil",
    "Lei Complementar (MG) nº 59/2001"
   ],
   [
    "processual_civil",
    "Lei Complementar (SC) nº 339/2006"
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
    "processual_civil",
    "Lei nº 4.717/1965"
   ],
   [
    "processual_civil",
    "Lei nº 8.437/1992"
   ],
   [
    "processual_civil",
    "Lei nº 9.099/1995"
   ],
   [
    "processual_civil",
    "Lei nº 9.494/1997"
   ],
   [
    "processual_civil",
    "Lei nº 9.507/1997"
   ],
   [
    "processual_penal",
    "Decreto-Lei nº 1.002/1969"
   ],
   [
    "processual_penal",
    "Decreto-Lei nº 201/1967"
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
    "Lei nº 12.313/2010"
   ],
   [
    "processual_penal",
    "Lei nº 12.830/2013"
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
    "Lei nº 13.256/2016"
   ],
   [
    "processual_penal",
    "Lei nº 13.431/2017"
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
    "tributario",
    "Decreto Estadual (MG) nº 44.747/2008"
   ],
   [
    "tributario",
    "Decreto nº 70.235/1972"
   ],
   [
    "tributario",
    "Emenda Constitucional nº 132/2023"
   ],
   [
    "tributario",
    "Lei Estadual (PR) nº 18.877/2016"
   ],
   [
    "tributario",
    "Lei nº 13.988/2020"
   ],
   [
    "tributario",
    "Lei nº 5.172/1966"
   ]
  ],
  "tipo": "edital"
 },
 {
  "id": "tjrj-li",
  "sigla": "TJRJ",
  "cargo": "Juiz de Direito Substituto",
  "orgao": "Tribunal de Justiça do Estado do Rio de Janeiro",
  "titulo": "LI Concurso para Ingresso na Magistratura de Carreira do Estado do Rio de Janeiro",
  "edital": "Resolução TJ/OE/RJ nº 41/2025",
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
    "administrativo",
    "Decreto nº 1.171/1994"
   ],
   [
    "administrativo",
    "Decreto nº 6.017/2007"
   ],
   [
    "administrativo",
    "Decreto-Lei nº 3.365/1941"
   ],
   [
    "administrativo",
    "Lei Complementar (DF) nº 840/2011"
   ],
   [
    "administrativo",
    "Lei Complementar (MT) nº 04/1990"
   ],
   [
    "administrativo",
    "Lei Complementar (SC) nº 491/2010"
   ],
   [
    "administrativo",
    "Lei Complementar (SE) nº 33/1996"
   ],
   [
    "administrativo",
    "Lei Complementar nº 101/2000"
   ],
   [
    "administrativo",
    "Lei Estadual (BA) nº 6.677/1994"
   ],
   [
    "administrativo",
    "Lei Estadual (MA) nº 6.107/1994"
   ],
   [
    "administrativo",
    "Lei Estadual (MS) nº 1.102/1990"
   ],
   [
    "administrativo",
    "Lei Estadual (PA) nº 5.810/1994"
   ],
   [
    "administrativo",
    "Lei Estadual (SP) nº 10.177/1998"
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
    "Lei nº 13.460/2017"
   ],
   [
    "administrativo",
    "Lei nº 13.848/2019"
   ],
   [
    "administrativo",
    "Lei nº 14.133/2021"
   ],
   [
    "administrativo",
    "Lei nº 14.230/2021"
   ],
   [
    "administrativo",
    "Lei nº 4.878/1965"
   ],
   [
    "administrativo",
    "Lei nº 8.112/1990"
   ],
   [
    "administrativo",
    "Lei nº 8.429/1992"
   ],
   [
    "administrativo",
    "Lei nº 8.666/1993"
   ],
   [
    "administrativo",
    "Lei nº 8.987/1995"
   ],
   [
    "administrativo",
    "Lei nº 9.784/1999"
   ],
   [
    "administrativo",
    "Lei nº 9.873/1999"
   ],
   [
    "administrativo",
    "Lei nº 9.986/2000"
   ],
   [
    "ambiental",
    "Decreto nº 10.936/2022"
   ],
   [
    "ambiental",
    "Decreto nº 99.274/1990"
   ],
   [
    "ambiental",
    "Lei Complementar nº 140/2011"
   ],
   [
    "ambiental",
    "Lei Estadual (SC) nº 14.675/2009"
   ],
   [
    "ambiental",
    "Lei Estadual (SC) nº 16.342/2014"
   ],
   [
    "ambiental",
    "Lei nº 11.124/2005"
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
    "Lei nº 12.334/2010"
   ],
   [
    "ambiental",
    "Lei nº 12.587/2012"
   ],
   [
    "ambiental",
    "Lei nº 12.608/2012"
   ],
   [
    "ambiental",
    "Lei nº 14.755/2023"
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
    "Lei nº 6.938/1981"
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
    "Lei nº 9.985/2000"
   ],
   [
    "ambiental",
    "Medida Provisória nº 1.308/2025"
   ],
   [
    "civil",
    "Decreto-Lei nº 4.657/1942"
   ],
   [
    "civil",
    "Decreto-Lei nº 911/1969"
   ],
   [
    "civil",
    "Lei nº 10.406/2002"
   ],
   [
    "civil",
    "Lei nº 12.318/2010"
   ],
   [
    "civil",
    "Lei nº 12.376/2010"
   ],
   [
    "civil",
    "Lei nº 14.382/2022"
   ],
   [
    "civil",
    "Lei nº 14.443/2022"
   ],
   [
    "civil",
    "Lei nº 14.905/2024"
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
    "Lei nº 8.935/1994"
   ],
   [
    "civil",
    "Lei nº 8.971/1994"
   ],
   [
    "civil",
    "Lei nº 9.278/1996"
   ],
   [
    "civil",
    "Lei nº 9.514/1997"
   ],
   [
    "constitucional",
    "Emenda Constitucional nº 45/2004"
   ],
   [
    "constitucional",
    "Emenda Constitucional nº 80/2014"
   ],
   [
    "consumidor",
    "Decreto nº 2.181/1997"
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
    "Lei nº 9.096/1995"
   ],
   [
    "eleitoral",
    "Lei nº 9.504/1997"
   ],
   [
    "empresarial",
    "Decreto nº 2.044/1908"
   ],
   [
    "empresarial",
    "Decreto nº 3.708/1919"
   ],
   [
    "empresarial",
    "Lei nº 11.101/2005"
   ],
   [
    "empresarial",
    "Lei nº 14.112/2020"
   ],
   [
    "empresarial",
    "Lei nº 14.193/2021"
   ],
   [
    "empresarial",
    "Lei nº 6.024/1974"
   ],
   [
    "empresarial",
    "Lei nº 6.404/1976"
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
    "humanos",
    "Decreto nº 678/1992"
   ],
   [
    "humanos",
    "Decreto nº 7.037/2009"
   ],
   [
    "humanos",
    "Decreto nº 9.571/2018"
   ],
   [
    "humanos",
    "Lei nº 7.716/1989"
   ],
   [
    "penal",
    "Decreto nº 5.015/2004"
   ],
   [
    "penal",
    "Decreto-Lei nº 1.001/1969"
   ],
   [
    "penal",
    "Decreto-Lei nº 2.848/1940"
   ],
   [
    "penal",
    "Decreto-Lei nº 3.688/1941"
   ],
   [
    "penal",
    "Decreto-Lei nº 3.914/1941"
   ],
   [
    "penal",
    "Decreto-Lei nº 6.259/1944"
   ],
   [
    "penal",
    "Lei nº 1.521/1951"
   ],
   [
    "penal",
    "Lei nº 10.826/2003"
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
    "Lei nº 12.850/2013"
   ],
   [
    "penal",
    "Lei nº 13.869/2019"
   ],
   [
    "penal",
    "Lei nº 14.188/2021"
   ],
   [
    "penal",
    "Lei nº 14.322/2022"
   ],
   [
    "penal",
    "Lei nº 15.384/2026"
   ],
   [
    "penal",
    "Lei nº 7.210/1984"
   ],
   [
    "penal",
    "Lei nº 7.492/1986"
   ],
   [
    "penal",
    "Lei nº 7.716/1989"
   ],
   [
    "penal",
    "Lei nº 8.072/1990"
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
    "Lei nº 9.455/1997"
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
    "Lei nº 9.613/1998"
   ],
   [
    "processual_civil",
    "Lei nº 10.259/2001"
   ],
   [
    "processual_civil",
    "Lei nº 11.417/2006"
   ],
   [
    "processual_civil",
    "Lei nº 12.016/2009"
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
    "processual_civil",
    "Lei nº 4.717/1965"
   ],
   [
    "processual_civil",
    "Lei nº 8.437/1992"
   ],
   [
    "processual_civil",
    "Lei nº 9.099/1995"
   ],
   [
    "processual_civil",
    "Lei nº 9.494/1997"
   ],
   [
    "processual_civil",
    "Lei nº 9.507/1997"
   ],
   [
    "processual_penal",
    "Decreto-Lei nº 1.002/1969"
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
    "Lei nº 12.313/2010"
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
    "Lei nº 13.256/2016"
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
    "tributario",
    "Lei Complementar nº 101/2000"
   ],
   [
    "tributario",
    "Lei Complementar nº 199/2023"
   ],
   [
    "tributario",
    "Lei Estadual (SC) nº 3.938/1966"
   ],
   [
    "tributario",
    "Lei nº 10.169/2000"
   ],
   [
    "tributario",
    "Lei nº 5.172/1966"
   ]
  ],
  "tipo": "edital"
 },
 {
  "id": "trf1-xviii-2025",
  "sigla": "TRF1",
  "cargo": "Juiz Federal Substituto",
  "orgao": "Tribunal Regional Federal da 1ª Região",
  "titulo": "XVIII Concurso Público para Provimento de Cargos de Juiz Federal Substituto da 1ª Região",
  "edital": "Edital de Abertura (retificado em 29/04/2025)",
  "grupos": [
   {
    "nome": "Bloco I",
    "disciplinas": [
     "Direito Constitucional",
     "Direito Administrativo",
     "Direito Penal",
     "Direito Processual Penal"
    ]
   },
   {
    "nome": "Bloco II",
    "disciplinas": [
     "Direito Civil",
     "Direito Processual Civil",
     "Direito Previdenciário",
     "Direito Financeiro e Tributário"
    ]
   },
   {
    "nome": "Bloco III",
    "disciplinas": [
     "Direito Ambiental",
     "Direito Internacional Público e Privado",
     "Direito Empresarial",
     "Direito Econômico e Proteção ao Consumidor",
     "Noções Gerais de Direito e Formação Humanística",
     "Direitos Humanos"
    ]
   }
  ],
  "leis": [
   [
    "administrativo",
    "Decreto nº 9.311/2018"
   ],
   [
    "administrativo",
    "Lei Complementar (DF) nº 840/2011"
   ],
   [
    "administrativo",
    "Lei Complementar (MT) nº 04/1990"
   ],
   [
    "administrativo",
    "Lei Complementar (SE) nº 33/1996"
   ],
   [
    "administrativo",
    "Lei Complementar nº 76/1993"
   ],
   [
    "administrativo",
    "Lei Estadual (BA) nº 6.677/1994"
   ],
   [
    "administrativo",
    "Lei Estadual (MA) nº 6.107/1994"
   ],
   [
    "administrativo",
    "Lei Estadual (MS) nº 1.102/1990"
   ],
   [
    "administrativo",
    "Lei Estadual (PA) nº 5.810/1994"
   ],
   [
    "administrativo",
    "Lei nº 11.079/2004"
   ],
   [
    "administrativo",
    "Lei nº 13.848/2019"
   ],
   [
    "administrativo",
    "Lei nº 14.133/2021"
   ],
   [
    "administrativo",
    "Lei nº 14.230/2021"
   ],
   [
    "administrativo",
    "Lei nº 4.878/1965"
   ],
   [
    "administrativo",
    "Lei nº 8.112/1990"
   ],
   [
    "administrativo",
    "Lei nº 8.429/1992"
   ],
   [
    "administrativo",
    "Lei nº 8.629/1993"
   ],
   [
    "administrativo",
    "Lei nº 8.987/1995"
   ],
   [
    "administrativo",
    "Lei nº 9.637/1998"
   ],
   [
    "administrativo",
    "Lei nº 9.986/2000"
   ],
   [
    "ambiental",
    "Decreto nº 10.936/2022"
   ],
   [
    "ambiental",
    "Decreto nº 99.274/1990"
   ],
   [
    "ambiental",
    "Lei Complementar nº 140/2011"
   ],
   [
    "ambiental",
    "Lei Estadual (PA) nº 9.048/2020"
   ],
   [
    "ambiental",
    "Lei Estadual (SC) nº 14.675/2009"
   ],
   [
    "ambiental",
    "Lei Estadual (SC) nº 16.342/2014"
   ],
   [
    "ambiental",
    "Lei nº 11.124/2005"
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
    "Lei nº 12.334/2010"
   ],
   [
    "ambiental",
    "Lei nº 12.587/2012"
   ],
   [
    "ambiental",
    "Lei nº 12.608/2012"
   ],
   [
    "ambiental",
    "Lei nº 14.755/2023"
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
    "Lei nº 6.938/1981"
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
    "Lei nº 9.985/2000"
   ],
   [
    "ambiental",
    "Medida Provisória nº 1.308/2025"
   ],
   [
    "civil",
    "Decreto nº 3.413/2000"
   ],
   [
    "civil",
    "Decreto nº 3.691/2000"
   ],
   [
    "civil",
    "Decreto nº 5.296/2004"
   ],
   [
    "civil",
    "Decreto-Lei nº 4.657/1942"
   ],
   [
    "civil",
    "Lei nº 10.048/2000"
   ],
   [
    "civil",
    "Lei nº 10.741/2003"
   ],
   [
    "civil",
    "Lei nº 11.126/2005"
   ],
   [
    "civil",
    "Lei nº 12.376/2010"
   ],
   [
    "civil",
    "Lei nº 12.965/2014"
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
    "Lei nº 14.010/2020"
   ],
   [
    "civil",
    "Lei nº 14.382/2022"
   ],
   [
    "civil",
    "Lei nº 6.015/1973"
   ],
   [
    "civil",
    "Lei nº 8.160/1991"
   ],
   [
    "civil",
    "Lei nº 8.899/1994"
   ],
   [
    "civil",
    "Lei nº 8.935/1994"
   ],
   [
    "civil",
    "Resolução CNJ nº 452/2022"
   ],
   [
    "constitucional",
    "Emenda Constitucional nº 80/2014"
   ],
   [
    "crianca",
    "Lei nº 8.069/1990"
   ],
   [
    "empresarial",
    "Decreto nº 2.044/1908"
   ],
   [
    "empresarial",
    "Lei nº 11.101/2005"
   ],
   [
    "empresarial",
    "Lei nº 14.112/2020"
   ],
   [
    "empresarial",
    "Lei nº 14.193/2021"
   ],
   [
    "empresarial",
    "Lei nº 4.886/1965"
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
    "humanos",
    "Decreto nº 3.298/1999"
   ],
   [
    "humanos",
    "Decreto nº 678/1992"
   ],
   [
    "humanos",
    "Decreto nº 7.037/2009"
   ],
   [
    "humanos",
    "Decreto nº 9.571/2018"
   ],
   [
    "humanos",
    "Lei nº 10.098/2000"
   ],
   [
    "humanos",
    "Lei nº 12.852/2013"
   ],
   [
    "humanos",
    "Lei nº 7.853/1989"
   ],
   [
    "penal",
    "Decreto nº 154/1991"
   ],
   [
    "penal",
    "Decreto nº 5.015/2004"
   ],
   [
    "penal",
    "Decreto nº 5.687/2006"
   ],
   [
    "penal",
    "Decreto-Lei nº 1.001/1969"
   ],
   [
    "penal",
    "Decreto-Lei nº 2.848/1940"
   ],
   [
    "penal",
    "Decreto-Lei nº 3.914/1941"
   ],
   [
    "penal",
    "Lei nº 1.521/1951"
   ],
   [
    "penal",
    "Lei nº 12.694/2012"
   ],
   [
    "penal",
    "Lei nº 14.322/2022"
   ],
   [
    "penal",
    "Lei nº 15.358/2026"
   ],
   [
    "penal",
    "Lei nº 15.384/2026"
   ],
   [
    "penal",
    "Lei nº 7.210/1984"
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
    "Lei nº 8.137/1990"
   ],
   [
    "penal",
    "Lei nº 8.176/1991"
   ],
   [
    "penal",
    "Lei nº 9.249/1995"
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
    "previdenciario",
    "Decreto nº 3.048/1999"
   ],
   [
    "previdenciario",
    "Lei nº 12.435/2011"
   ],
   [
    "previdenciario",
    "Lei nº 13.876/2019"
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
    "Lei nº 8.742/1993"
   ],
   [
    "processual_civil",
    "Emenda Constitucional nº 125/2022"
   ],
   [
    "processual_civil",
    "Lei Complementar (MG) nº 59/2001"
   ],
   [
    "processual_civil",
    "Lei Complementar (SC) nº 339/2006"
   ],
   [
    "processual_civil",
    "Lei nº 10.259/2001"
   ],
   [
    "processual_civil",
    "Lei nº 11.418/2006"
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
    "processual_civil",
    "Lei nº 4.717/1965"
   ],
   [
    "processual_civil",
    "Lei nº 7.347/1985"
   ],
   [
    "processual_civil",
    "Lei nº 9.099/1995"
   ],
   [
    "processual_civil",
    "Lei nº 9.494/1997"
   ],
   [
    "processual_civil",
    "Lei nº 9.507/1997"
   ],
   [
    "processual_penal",
    "Decreto-Lei nº 1.002/1969"
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
    "Lei nº 12.313/2010"
   ],
   [
    "processual_penal",
    "Lei nº 12.850/2013"
   ],
   [
    "processual_penal",
    "Lei nº 7.210/1984"
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
    "tributario",
    "Decreto Estadual (MG) nº 44.747/2008"
   ],
   [
    "tributario",
    "Decreto nº 70.235/1972"
   ],
   [
    "tributario",
    "Lei Complementar (SC) nº 465/2009"
   ],
   [
    "tributario",
    "Lei Complementar nº 118/2005"
   ],
   [
    "tributario",
    "Lei Estadual (PR) nº 18.877/2016"
   ],
   [
    "tributario",
    "Lei Estadual (SC) nº 13.136/2004"
   ],
   [
    "tributario",
    "Lei nº 10.169/2000"
   ],
   [
    "tributario",
    "Lei nº 5.172/1966"
   ],
   [
    "tributario",
    "Lei nº 6.830/1980"
   ],
   [
    "tributario",
    "Lei nº 8.134/1990"
   ],
   [
    "tributario",
    "Lei nº 8.397/1992"
   ]
  ],
  "tipo": "edital"
 },
 {
  "id": "trf3-xxi-2024",
  "sigla": "TRF3",
  "cargo": "Juiz Federal Substituto",
  "orgao": "Tribunal Regional Federal da 3ª Região",
  "titulo": "XXI Concurso para Provimento de Cargos de Juiz Federal Substituto da 3ª Região",
  "edital": "Edital de Abertura Consolidado",
  "grupos": [
   {
    "nome": "Bloco I",
    "disciplinas": [
     "Direito Constitucional",
     "Direito Administrativo",
     "Direito Penal",
     "Direito Processual Penal"
    ]
   },
   {
    "nome": "Bloco II",
    "disciplinas": [
     "Direito Civil",
     "Direito Processual Civil",
     "Direito Previdenciário",
     "Direito Financeiro e Tributário"
    ]
   },
   {
    "nome": "Bloco III",
    "disciplinas": [
     "Direito Ambiental",
     "Direito Internacional Público e Privado",
     "Direito Empresarial",
     "Direito Econômico e Proteção ao Consumidor",
     "Noções Gerais de Direito e Formação Humanística",
     "Direitos Humanos"
    ]
   }
  ],
  "leis": [
   [
    "administrativo",
    "Decreto nº 9.311/2018"
   ],
   [
    "administrativo",
    "Lei Complementar (DF) nº 840/2011"
   ],
   [
    "administrativo",
    "Lei Complementar (MT) nº 04/1990"
   ],
   [
    "administrativo",
    "Lei Complementar (SC) nº 491/2010"
   ],
   [
    "administrativo",
    "Lei Complementar (SE) nº 33/1996"
   ],
   [
    "administrativo",
    "Lei Complementar nº 101/2000"
   ],
   [
    "administrativo",
    "Lei Complementar nº 76/1993"
   ],
   [
    "administrativo",
    "Lei Estadual (BA) nº 6.677/1994"
   ],
   [
    "administrativo",
    "Lei Estadual (MA) nº 6.107/1994"
   ],
   [
    "administrativo",
    "Lei Estadual (MS) nº 1.102/1990"
   ],
   [
    "administrativo",
    "Lei Estadual (PA) nº 5.810/1994"
   ],
   [
    "administrativo",
    "Lei Estadual (SP) nº 10.177/1998"
   ],
   [
    "administrativo",
    "Lei nº 11.079/2004"
   ],
   [
    "administrativo",
    "Lei nº 12.846/2013"
   ],
   [
    "administrativo",
    "Lei nº 13.848/2019"
   ],
   [
    "administrativo",
    "Lei nº 14.133/2021"
   ],
   [
    "administrativo",
    "Lei nº 14.230/2021"
   ],
   [
    "administrativo",
    "Lei nº 4.320/1964"
   ],
   [
    "administrativo",
    "Lei nº 4.878/1965"
   ],
   [
    "administrativo",
    "Lei nº 8.112/1990"
   ],
   [
    "administrativo",
    "Lei nº 8.429/1992"
   ],
   [
    "administrativo",
    "Lei nº 8.629/1993"
   ],
   [
    "administrativo",
    "Lei nº 8.987/1995"
   ],
   [
    "administrativo",
    "Lei nº 9.637/1998"
   ],
   [
    "administrativo",
    "Lei nº 9.784/1999"
   ],
   [
    "administrativo",
    "Lei nº 9.986/2000"
   ],
   [
    "ambiental",
    "Decreto nº 10.936/2022"
   ],
   [
    "ambiental",
    "Decreto nº 56.826/1965"
   ],
   [
    "ambiental",
    "Decreto nº 7.217/2010"
   ],
   [
    "ambiental",
    "Decreto nº 99.274/1990"
   ],
   [
    "ambiental",
    "Decreto-Lei nº 25/1937"
   ],
   [
    "ambiental",
    "Lei Complementar nº 140/2011"
   ],
   [
    "ambiental",
    "Lei Estadual (PA) nº 5.629/1990"
   ],
   [
    "ambiental",
    "Lei Estadual (PA) nº 9.048/2020"
   ],
   [
    "ambiental",
    "Lei Estadual (SC) nº 14.675/2009"
   ],
   [
    "ambiental",
    "Lei Estadual (SC) nº 16.342/2014"
   ],
   [
    "ambiental",
    "Lei nº 11.105/2005"
   ],
   [
    "ambiental",
    "Lei nº 11.124/2005"
   ],
   [
    "ambiental",
    "Lei nº 11.445/2007"
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
    "Lei nº 12.334/2010"
   ],
   [
    "ambiental",
    "Lei nº 12.587/2012"
   ],
   [
    "ambiental",
    "Lei nº 12.608/2012"
   ],
   [
    "ambiental",
    "Lei nº 14.026/2020"
   ],
   [
    "ambiental",
    "Lei nº 14.755/2023"
   ],
   [
    "ambiental",
    "Lei nº 14.785/2023"
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
    "Lei nº 6.938/1981"
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
    "Lei nº 9.985/2000"
   ],
   [
    "ambiental",
    "Medida Provisória nº 1.308/2025"
   ],
   [
    "civil",
    "Decreto nº 20.910/1932"
   ],
   [
    "civil",
    "Decreto nº 3.413/2000"
   ],
   [
    "civil",
    "Decreto-Lei nº 4.657/1942"
   ],
   [
    "civil",
    "Decreto-Lei nº 911/1969"
   ],
   [
    "civil",
    "Lei nº 12.376/2010"
   ],
   [
    "civil",
    "Lei nº 14.010/2020"
   ],
   [
    "civil",
    "Lei nº 14.382/2022"
   ],
   [
    "civil",
    "Lei nº 4.380/1964"
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
    "Lei nº 8.971/1994"
   ],
   [
    "civil",
    "Lei nº 9.278/1996"
   ],
   [
    "civil",
    "Lei nº 9.514/1997"
   ],
   [
    "constitucional",
    "Emenda Constitucional nº 80/2014"
   ],
   [
    "empresarial",
    "Decreto-Lei nº 167/1967"
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
    "Lei nº 14.112/2020"
   ],
   [
    "empresarial",
    "Lei nº 14.193/2021"
   ],
   [
    "empresarial",
    "Lei nº 4.886/1965"
   ],
   [
    "empresarial",
    "Lei nº 6.024/1974"
   ],
   [
    "empresarial",
    "Lei nº 7.913/1989"
   ],
   [
    "empresarial",
    "Lei nº 9.279/1996"
   ],
   [
    "humanos",
    "Lei nº 7.716/1989"
   ],
   [
    "penal",
    "Decreto nº 11.491/2023"
   ],
   [
    "penal",
    "Decreto nº 154/1991"
   ],
   [
    "penal",
    "Decreto nº 4.388/2002"
   ],
   [
    "penal",
    "Decreto nº 5.015/2004"
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
    "Decreto-Lei nº 1.001/1969"
   ],
   [
    "penal",
    "Decreto-Lei nº 2.848/1940"
   ],
   [
    "penal",
    "Decreto-Lei nº 3.914/1941"
   ],
   [
    "penal",
    "Lei nº 1.521/1951"
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
    "Lei nº 13.260/2016"
   ],
   [
    "penal",
    "Lei nº 13.344/2016"
   ],
   [
    "penal",
    "Lei nº 13.675/2018"
   ],
   [
    "penal",
    "Lei nº 14.322/2022"
   ],
   [
    "penal",
    "Lei nº 15.384/2026"
   ],
   [
    "penal",
    "Lei nº 7.210/1984"
   ],
   [
    "penal",
    "Lei nº 7.492/1986"
   ],
   [
    "penal",
    "Lei nº 7.716/1989"
   ],
   [
    "penal",
    "Lei nº 7.802/1989"
   ],
   [
    "penal",
    "Lei nº 8.072/1990"
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
    "Lei nº 9.613/1998"
   ],
   [
    "previdenciario",
    "Decreto nº 3.048/1999"
   ],
   [
    "previdenciario",
    "Lei nº 12.435/2011"
   ],
   [
    "previdenciario",
    "Lei nº 13.876/2019"
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
    "Lei nº 8.742/1993"
   ],
   [
    "processual_civil",
    "Emenda Constitucional nº 125/2022"
   ],
   [
    "processual_civil",
    "Lei nº 10.259/2001"
   ],
   [
    "processual_civil",
    "Lei nº 11.418/2006"
   ],
   [
    "processual_civil",
    "Lei nº 12.153/2009"
   ],
   [
    "processual_civil",
    "Lei nº 9.099/1995"
   ],
   [
    "processual_civil",
    "Lei nº 9.494/1997"
   ],
   [
    "processual_penal",
    "Decreto-Lei nº 1.002/1969"
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
    "Lei nº 11.343/2006"
   ],
   [
    "processual_penal",
    "Lei nº 12.037/2009"
   ],
   [
    "processual_penal",
    "Lei nº 12.313/2010"
   ],
   [
    "processual_penal",
    "Lei nº 12.830/2013"
   ],
   [
    "processual_penal",
    "Lei nº 12.850/2013"
   ],
   [
    "processual_penal",
    "Lei nº 13.256/2016"
   ],
   [
    "processual_penal",
    "Lei nº 7.210/1984"
   ],
   [
    "processual_penal",
    "Lei nº 7.960/1989"
   ],
   [
    "processual_penal",
    "Lei nº 8.457/1992"
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
    "Lei nº 9.807/1999"
   ],
   [
    "tributario",
    "Decreto Estadual (MG) nº 44.747/2008"
   ],
   [
    "tributario",
    "Decreto nº 70.235/1972"
   ],
   [
    "tributario",
    "Emenda Constitucional nº 132/2023"
   ],
   [
    "tributario",
    "Lei Complementar (SC) nº 465/2009"
   ],
   [
    "tributario",
    "Lei Complementar nº 101/2000"
   ],
   [
    "tributario",
    "Lei Complementar nº 118/2005"
   ],
   [
    "tributario",
    "Lei Complementar nº 200/2023"
   ],
   [
    "tributario",
    "Lei Estadual (PR) nº 18.877/2016"
   ],
   [
    "tributario",
    "Lei Estadual (SC) nº 13.136/2004"
   ],
   [
    "tributario",
    "Lei Estadual (SC) nº 3.938/1966"
   ],
   [
    "tributario",
    "Lei nº 5.172/1966"
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
    "Lei nº 9.703/1998"
   ]
  ],
  "tipo": "edital"
 },
 {
  "id": "trf6-1-2025",
  "sigla": "TRF6",
  "cargo": "Juiz Federal Substituto",
  "orgao": "Tribunal Regional Federal da 6ª Região",
  "titulo": "I Concurso Público para Provimento de Cargos de Juiz Federal Substituto da 6ª Região",
  "edital": "Edital de Abertura nº 1, de 22 de agosto de 2025",
  "grupos": [
   {
    "nome": "Bloco I",
    "disciplinas": [
     "Direito Constitucional",
     "Direito Administrativo",
     "Direito Penal",
     "Direito Processual Penal"
    ]
   },
   {
    "nome": "Bloco II",
    "disciplinas": [
     "Direito Civil",
     "Direito Processual Civil",
     "Direito Previdenciário",
     "Direito Financeiro e Tributário"
    ]
   },
   {
    "nome": "Bloco III",
    "disciplinas": [
     "Direito Ambiental",
     "Direito Internacional Público e Privado",
     "Direito Empresarial",
     "Direito Econômico e Proteção ao Consumidor",
     "Noções Gerais de Direito e Formação Humanística",
     "Direitos Humanos"
    ]
   }
  ],
  "leis": [
   [
    "administrativo",
    "Decreto nº 9.311/2018"
   ],
   [
    "administrativo",
    "Lei Complementar (DF) nº 840/2011"
   ],
   [
    "administrativo",
    "Lei Complementar (MT) nº 04/1990"
   ],
   [
    "administrativo",
    "Lei Complementar (SE) nº 33/1996"
   ],
   [
    "administrativo",
    "Lei Complementar nº 76/1993"
   ],
   [
    "administrativo",
    "Lei Estadual (BA) nº 6.677/1994"
   ],
   [
    "administrativo",
    "Lei Estadual (MA) nº 6.107/1994"
   ],
   [
    "administrativo",
    "Lei Estadual (MS) nº 1.102/1990"
   ],
   [
    "administrativo",
    "Lei Estadual (PA) nº 5.810/1994"
   ],
   [
    "administrativo",
    "Lei nº 11.079/2004"
   ],
   [
    "administrativo",
    "Lei nº 13.848/2019"
   ],
   [
    "administrativo",
    "Lei nº 14.133/2021"
   ],
   [
    "administrativo",
    "Lei nº 14.230/2021"
   ],
   [
    "administrativo",
    "Lei nº 4.878/1965"
   ],
   [
    "administrativo",
    "Lei nº 8.112/1990"
   ],
   [
    "administrativo",
    "Lei nº 8.429/1992"
   ],
   [
    "administrativo",
    "Lei nº 8.629/1993"
   ],
   [
    "administrativo",
    "Lei nº 8.987/1995"
   ],
   [
    "administrativo",
    "Lei nº 9.637/1998"
   ],
   [
    "administrativo",
    "Lei nº 9.986/2000"
   ],
   [
    "ambiental",
    "Decreto nº 10.936/2022"
   ],
   [
    "ambiental",
    "Decreto nº 56.826/1965"
   ],
   [
    "ambiental",
    "Decreto nº 6.514/2008"
   ],
   [
    "ambiental",
    "Decreto nº 7.217/2010"
   ],
   [
    "ambiental",
    "Decreto nº 99.274/1990"
   ],
   [
    "ambiental",
    "Lei Complementar nº 140/2011"
   ],
   [
    "ambiental",
    "Lei Estadual (MS) nº 2.257/2001"
   ],
   [
    "ambiental",
    "Lei Estadual (MS) nº 2.406/2002"
   ],
   [
    "ambiental",
    "Lei Estadual (MS) nº 4.555/2014"
   ],
   [
    "ambiental",
    "Lei Estadual (MS) nº 5.235/2018"
   ],
   [
    "ambiental",
    "Lei Estadual (PA) nº 5.295/1985"
   ],
   [
    "ambiental",
    "Lei Estadual (PA) nº 5.629/1990"
   ],
   [
    "ambiental",
    "Lei Estadual (PA) nº 6.745/2005"
   ],
   [
    "ambiental",
    "Lei Estadual (PA) nº 7.731/2013"
   ],
   [
    "ambiental",
    "Lei Estadual (PA) nº 9.048/2020"
   ],
   [
    "ambiental",
    "Lei Estadual (PA) nº 9.593/2022"
   ],
   [
    "ambiental",
    "Lei Estadual (SC) nº 14.675/2009"
   ],
   [
    "ambiental",
    "Lei Estadual (SC) nº 16.342/2014"
   ],
   [
    "ambiental",
    "Lei nº 11.124/2005"
   ],
   [
    "ambiental",
    "Lei nº 11.445/2007"
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
    "Lei nº 12.334/2010"
   ],
   [
    "ambiental",
    "Lei nº 12.587/2012"
   ],
   [
    "ambiental",
    "Lei nº 12.608/2012"
   ],
   [
    "ambiental",
    "Lei nº 14.026/2020"
   ],
   [
    "ambiental",
    "Lei nº 14.119/2021"
   ],
   [
    "ambiental",
    "Lei nº 14.755/2023"
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
    "Lei nº 6.938/1981"
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
    "Lei nº 9.985/2000"
   ],
   [
    "ambiental",
    "Medida Provisória nº 1.308/2025"
   ],
   [
    "civil",
    "Decreto nº 20.910/1932"
   ],
   [
    "civil",
    "Decreto nº 3.413/2000"
   ],
   [
    "civil",
    "Decreto-Lei nº 4.657/1942"
   ],
   [
    "civil",
    "Decreto-Lei nº 911/1969"
   ],
   [
    "civil",
    "Lei nº 12.376/2010"
   ],
   [
    "civil",
    "Lei nº 14.010/2020"
   ],
   [
    "civil",
    "Lei nº 14.382/2022"
   ],
   [
    "civil",
    "Lei nº 4.380/1964"
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
    "Lei nº 9.514/1997"
   ],
   [
    "constitucional",
    "Emenda Constitucional nº 80/2014"
   ],
   [
    "consumidor",
    "Decreto nº 7.962/2013"
   ],
   [
    "empresarial",
    "Decreto nº 2.044/1908"
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
    "Lei nº 14.112/2020"
   ],
   [
    "empresarial",
    "Lei nº 14.193/2021"
   ],
   [
    "empresarial",
    "Lei nº 4.886/1965"
   ],
   [
    "empresarial",
    "Lei nº 6.024/1974"
   ],
   [
    "empresarial",
    "Lei nº 7.913/1989"
   ],
   [
    "empresarial",
    "Lei nº 9.279/1996"
   ],
   [
    "humanos",
    "Decreto nº 678/1992"
   ],
   [
    "humanos",
    "Decreto nº 7.037/2009"
   ],
   [
    "humanos",
    "Decreto nº 9.571/2018"
   ],
   [
    "penal",
    "Decreto nº 154/1991"
   ],
   [
    "penal",
    "Decreto nº 5.015/2004"
   ],
   [
    "penal",
    "Decreto nº 5.687/2006"
   ],
   [
    "penal",
    "Decreto-Lei nº 1.001/1969"
   ],
   [
    "penal",
    "Decreto-Lei nº 2.848/1940"
   ],
   [
    "penal",
    "Decreto-Lei nº 3.914/1941"
   ],
   [
    "penal",
    "Lei nº 1.521/1951"
   ],
   [
    "penal",
    "Lei nº 14.322/2022"
   ],
   [
    "penal",
    "Lei nº 15.384/2026"
   ],
   [
    "penal",
    "Lei nº 7.210/1984"
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
    "Lei nº 8.176/1991"
   ],
   [
    "penal",
    "Lei nº 9.605/1998"
   ],
   [
    "previdenciario",
    "Decreto nº 3.048/1999"
   ],
   [
    "previdenciario",
    "Lei nº 12.435/2011"
   ],
   [
    "previdenciario",
    "Lei nº 13.876/2019"
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
    "Lei nº 8.742/1993"
   ],
   [
    "processual_civil",
    "Emenda Constitucional nº 125/2022"
   ],
   [
    "processual_civil",
    "Lei nº 10.259/2001"
   ],
   [
    "processual_civil",
    "Lei nº 11.418/2006"
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
    "processual_civil",
    "Lei nº 9.099/1995"
   ],
   [
    "processual_civil",
    "Lei nº 9.494/1997"
   ],
   [
    "processual_penal",
    "Decreto-Lei nº 1.002/1969"
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
    "Lei nº 12.037/2009"
   ],
   [
    "processual_penal",
    "Lei nº 12.313/2010"
   ],
   [
    "processual_penal",
    "Lei nº 12.830/2013"
   ],
   [
    "processual_penal",
    "Lei nº 12.850/2013"
   ],
   [
    "processual_penal",
    "Lei nº 13.256/2016"
   ],
   [
    "processual_penal",
    "Lei nº 7.210/1984"
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
    "Lei nº 9.807/1999"
   ],
   [
    "tributario",
    "Decreto Estadual (MG) nº 44.747/2008"
   ],
   [
    "tributario",
    "Decreto nº 70.235/1972"
   ],
   [
    "tributario",
    "Emenda Constitucional nº 132/2023"
   ],
   [
    "tributario",
    "Lei Complementar (SC) nº 465/2009"
   ],
   [
    "tributario",
    "Lei Complementar nº 101/2000"
   ],
   [
    "tributario",
    "Lei Complementar nº 118/2005"
   ],
   [
    "tributario",
    "Lei Complementar nº 214/2025"
   ],
   [
    "tributario",
    "Lei Estadual (PR) nº 18.877/2016"
   ],
   [
    "tributario",
    "Lei Estadual (SC) nº 13.136/2004"
   ],
   [
    "tributario",
    "Lei nº 10.169/2000"
   ],
   [
    "tributario",
    "Lei nº 5.172/1966"
   ],
   [
    "tributario",
    "Lei nº 6.830/1980"
   ],
   [
    "tributario",
    "Lei nº 8.134/1990"
   ],
   [
    "tributario",
    "Lei nº 8.397/1992"
   ]
  ],
  "tipo": "edital"
 },
 {
  "id": "mpdft-33-2025",
  "sigla": "MPDFT",
  "cargo": "Promotor de Justiça Adjunto",
  "orgao": "Ministério Público do Distrito Federal e Territórios",
  "titulo": "33º Concurso Público para Ingresso na Carreira do MPDFT",
  "edital": "Edital nº 1, de 4 de setembro de 2025 (Resolução CSMPDFT nº 342/2025)",
  "grupos": [
   {
    "nome": "Grupo I",
    "disciplinas": [
     "Direito Penal",
     "Direito Processual Penal"
    ]
   },
   {
    "nome": "Grupo II",
    "disciplinas": [
     "Direito Civil e Empresarial",
     "Direito Processual Civil e Coletivo"
    ]
   },
   {
    "nome": "Grupo III",
    "disciplinas": [
     "Direito Constitucional",
     "Direito Administrativo, Ambiental, Urbanístico e da Saúde",
     "Direito da Criança e do Adolescente",
     "Regime Jurídico do Ministério Público"
    ]
   }
  ],
  "leis": [
   [
    "administrativo",
    "Decreto nº 10.592/2020"
   ],
   [
    "administrativo",
    "Decreto nº 7.174/2010"
   ],
   [
    "administrativo",
    "Decreto-Lei nº 200/1967"
   ],
   [
    "administrativo",
    "Decreto-Lei nº 3.365/1941"
   ],
   [
    "administrativo",
    "Decreto-Lei nº 58/1937"
   ],
   [
    "administrativo",
    "Lei Complementar (DF) nº 769/2008"
   ],
   [
    "administrativo",
    "Lei Complementar (DF) nº 840/2011"
   ],
   [
    "administrativo",
    "Lei Complementar (MS) nº 72/1994"
   ],
   [
    "administrativo",
    "Lei Complementar (MT) nº 04/1990"
   ],
   [
    "administrativo",
    "Lei Complementar (SC) nº 491/2010"
   ],
   [
    "administrativo",
    "Lei Complementar (SE) nº 33/1996"
   ],
   [
    "administrativo",
    "Lei Complementar nº 141/2012"
   ],
   [
    "administrativo",
    "Lei Complementar nº 220/2025"
   ],
   [
    "administrativo",
    "Lei Complementar nº 75/1993"
   ],
   [
    "administrativo",
    "Lei Estadual (BA) nº 6.677/1994"
   ],
   [
    "administrativo",
    "Lei Estadual (MA) nº 6.107/1994"
   ],
   [
    "administrativo",
    "Lei Estadual (MS) nº 1.102/1990"
   ],
   [
    "administrativo",
    "Lei Estadual (PA) nº 5.810/1994"
   ],
   [
    "administrativo",
    "Lei Estadual (SC) nº 12.929/2004"
   ],
   [
    "administrativo",
    "Lei Estadual (SP) nº 10.177/1998"
   ],
   [
    "administrativo",
    "Lei nº 11.079/2004"
   ],
   [
    "administrativo",
    "Lei nº 12.232/2010"
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
    "Lei nº 13.005/2014"
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
    "Lei nº 13.848/2019"
   ],
   [
    "administrativo",
    "Lei nº 14.113/2020"
   ],
   [
    "administrativo",
    "Lei nº 14.133/2021"
   ],
   [
    "administrativo",
    "Lei nº 14.230/2021"
   ],
   [
    "administrativo",
    "Lei nº 4.132/1962"
   ],
   [
    "administrativo",
    "Lei nº 4.878/1965"
   ],
   [
    "administrativo",
    "Lei nº 8.080/1990"
   ],
   [
    "administrativo",
    "Lei nº 8.112/1990"
   ],
   [
    "administrativo",
    "Lei nº 8.429/1992"
   ],
   [
    "administrativo",
    "Lei nº 8.625/1993"
   ],
   [
    "administrativo",
    "Lei nº 8.745/1993"
   ],
   [
    "administrativo",
    "Lei nº 8.987/1995"
   ],
   [
    "administrativo",
    "Lei nº 9.394/1996"
   ],
   [
    "administrativo",
    "Lei nº 9.637/1998"
   ],
   [
    "administrativo",
    "Lei nº 9.784/1999"
   ],
   [
    "administrativo",
    "Lei nº 9.790/1999"
   ],
   [
    "administrativo",
    "Lei nº 9.873/1999"
   ],
   [
    "administrativo",
    "Lei nº 9.962/2000"
   ],
   [
    "administrativo",
    "Lei nº 9.986/2000"
   ],
   [
    "ambiental",
    "Lei Complementar nº 140/2011"
   ],
   [
    "ambiental",
    "Lei nº 10.257/2001"
   ],
   [
    "ambiental",
    "Lei nº 11.107/2005"
   ],
   [
    "ambiental",
    "Lei nº 12.587/2012"
   ],
   [
    "ambiental",
    "Lei nº 12.651/2012"
   ],
   [
    "ambiental",
    "Lei nº 13.425/2017"
   ],
   [
    "ambiental",
    "Lei nº 13.465/2017"
   ],
   [
    "ambiental",
    "Lei nº 6.938/1981"
   ],
   [
    "ambiental",
    "Lei nº 9.985/2000"
   ],
   [
    "ambiental",
    "Medida Provisória nº 2.220/2001"
   ],
   [
    "civil",
    "Decreto nº 10.604/2021"
   ],
   [
    "civil",
    "Decreto nº 11.483/2023"
   ],
   [
    "civil",
    "Decreto nº 22.626/1933"
   ],
   [
    "civil",
    "Decreto nº 3.413/2000"
   ],
   [
    "civil",
    "Decreto nº 9.921/2019"
   ],
   [
    "civil",
    "Decreto-Lei nº 4.657/1942"
   ],
   [
    "civil",
    "Lei Estadual (RS) nº 14.254/2013"
   ],
   [
    "civil",
    "Lei nº 1.060/1950"
   ],
   [
    "civil",
    "Lei nº 10.406/2002"
   ],
   [
    "civil",
    "Lei nº 10.741/2003"
   ],
   [
    "civil",
    "Lei nº 11.804/2008"
   ],
   [
    "civil",
    "Lei nº 12.318/2010"
   ],
   [
    "civil",
    "Lei nº 12.376/2010"
   ],
   [
    "civil",
    "Lei nº 12.764/2012"
   ],
   [
    "civil",
    "Lei nº 12.965/2014"
   ],
   [
    "civil",
    "Lei nº 13.097/2015"
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
    "Lei nº 13.874/2019"
   ],
   [
    "civil",
    "Lei nº 14.010/2020"
   ],
   [
    "civil",
    "Lei nº 14.382/2022"
   ],
   [
    "civil",
    "Lei nº 14.443/2022"
   ],
   [
    "civil",
    "Lei nº 14.905/2024"
   ],
   [
    "civil",
    "Lei nº 4.380/1964"
   ],
   [
    "civil",
    "Lei nº 5.478/1968"
   ],
   [
    "civil",
    "Lei nº 6.015/1973"
   ],
   [
    "civil",
    "Lei nº 6.766/1979"
   ],
   [
    "civil",
    "Lei nº 6.858/1980"
   ],
   [
    "civil",
    "Lei nº 8.009/1990"
   ],
   [
    "civil",
    "Lei nº 8.560/1992"
   ],
   [
    "civil",
    "Lei nº 8.842/1994"
   ],
   [
    "civil",
    "Lei nº 8.935/1994"
   ],
   [
    "civil",
    "Lei nº 8.971/1994"
   ],
   [
    "civil",
    "Lei nº 9.278/1996"
   ],
   [
    "constitucional",
    "Lei Estadual (SC) nº 12.069/2001"
   ],
   [
    "constitucional",
    "Lei nº 9.868/1999"
   ],
   [
    "constitucional",
    "Lei nº 9.882/1999"
   ],
   [
    "consumidor",
    "Lei nº 8.078/1990"
   ],
   [
    "crianca",
    "Decreto nº 2.740/1998"
   ],
   [
    "crianca",
    "Decreto nº 3.087/1999"
   ],
   [
    "crianca",
    "Decreto nº 5.007/2004"
   ],
   [
    "crianca",
    "Decreto nº 9.603/2018"
   ],
   [
    "crianca",
    "Decreto nº 99.710/1990"
   ],
   [
    "crianca",
    "Lei Estadual (SC) nº 11.435/2000"
   ],
   [
    "crianca",
    "Lei Estadual (SC) nº 11.697/2001"
   ],
   [
    "crianca",
    "Lei nº 12.010/2009"
   ],
   [
    "crianca",
    "Lei nº 12.594/2012"
   ],
   [
    "crianca",
    "Lei nº 13.185/2015"
   ],
   [
    "crianca",
    "Lei nº 13.257/2016"
   ],
   [
    "crianca",
    "Lei nº 13.431/2017"
   ],
   [
    "crianca",
    "Lei nº 13.819/2019"
   ],
   [
    "crianca",
    "Lei nº 14.344/2022"
   ],
   [
    "crianca",
    "Lei nº 14.548/2023"
   ],
   [
    "crianca",
    "Lei nº 14.811/2024"
   ],
   [
    "crianca",
    "Lei nº 15.100/2025"
   ],
   [
    "crianca",
    "Lei nº 8.069/1990"
   ],
   [
    "crianca",
    "Lei nº 8.242/1991"
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
    "Lei nº 6.404/1976"
   ],
   [
    "humanos",
    "Lei nº 7.853/1989"
   ],
   [
    "penal",
    "Decreto nº 154/1991"
   ],
   [
    "penal",
    "Decreto nº 5.015/2004"
   ],
   [
    "penal",
    "Decreto nº 5.687/2006"
   ],
   [
    "penal",
    "Decreto-Lei nº 1.001/1969"
   ],
   [
    "penal",
    "Decreto-Lei nº 3.688/1941"
   ],
   [
    "penal",
    "Decreto-Lei nº 6.259/1944"
   ],
   [
    "penal",
    "Lei nº 1.521/1951"
   ],
   [
    "penal",
    "Lei nº 10.028/2000"
   ],
   [
    "penal",
    "Lei nº 14.188/2021"
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
    "Lei nº 8.713/1993"
   ],
   [
    "penal",
    "Lei nº 9.100/1995"
   ],
   [
    "penal",
    "Lei nº 9.430/1996"
   ],
   [
    "penal",
    "Lei nº 9.434/1997"
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
    "Lei nº 9.840/1999"
   ],
   [
    "processual_civil",
    "Emenda Constitucional nº 125/2022"
   ],
   [
    "processual_civil",
    "Lei nº 11.418/2006"
   ],
   [
    "processual_civil",
    "Lei nº 11.419/2006"
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
    "processual_civil",
    "Lei nº 13.655/2018"
   ],
   [
    "processual_civil",
    "Lei nº 14.341/2022"
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
    "Lei nº 8.038/1990"
   ],
   [
    "processual_civil",
    "Lei nº 9.008/1995"
   ],
   [
    "processual_civil",
    "Lei nº 9.099/1995"
   ],
   [
    "processual_civil",
    "Lei nº 9.494/1997"
   ],
   [
    "processual_civil",
    "Lei nº 9.507/1997"
   ],
   [
    "processual_penal",
    "Decreto-Lei nº 1.002/1969"
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
    "Lei nº 1.579/1952"
   ],
   [
    "processual_penal",
    "Lei nº 11.101/2005"
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
    "Lei nº 12.313/2010"
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
    "Lei nº 13.431/2017"
   ],
   [
    "processual_penal",
    "Lei nº 7.210/1984"
   ],
   [
    "processual_penal",
    "Lei nº 8.457/1992"
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
    "Lei nº 9.807/1999"
   ]
  ],
  "tipo": "edital"
 },
 {
  "id": "mpba-1-2025",
  "sigla": "MPBA",
  "cargo": "Promotor de Justiça Substituto",
  "orgao": "Ministério Público do Estado da Bahia",
  "titulo": "Concurso Público para Promotor de Justiça Substituto da Bahia",
  "edital": "Edital nº 1, de 15 de agosto de 2025",
  "grupos": [
   {
    "nome": "Grupo de Conteúdos I",
    "disciplinas": [
     "Direito Constitucional",
     "Direito Administrativo"
    ]
   },
   {
    "nome": "Grupo de Conteúdos II",
    "disciplinas": [
     "Direito Civil",
     "Direito Processual Civil"
    ]
   },
   {
    "nome": "Grupo de Conteúdos III",
    "disciplinas": [
     "Direito Penal",
     "Direito Processual Penal"
    ]
   },
   {
    "nome": "Grupo de Conteúdos IV",
    "disciplinas": [
     "Direitos Transindividuais",
     "Legislação Institucional",
     "Direito Eleitoral",
     "Direitos Humanos"
    ]
   }
  ],
  "leis": [
   [
    "administrativo",
    "Decreto nº 7.174/2010"
   ],
   [
    "administrativo",
    "Decreto nº 7.746/2012"
   ],
   [
    "administrativo",
    "Lei Complementar (DF) nº 840/2011"
   ],
   [
    "administrativo",
    "Lei Complementar (MS) nº 72/1994"
   ],
   [
    "administrativo",
    "Lei Complementar (MT) nº 04/1990"
   ],
   [
    "administrativo",
    "Lei Complementar (SE) nº 33/1996"
   ],
   [
    "administrativo",
    "Lei Complementar nº 101/2000"
   ],
   [
    "administrativo",
    "Lei Complementar nº 141/2012"
   ],
   [
    "administrativo",
    "Lei Complementar nº 75/1993"
   ],
   [
    "administrativo",
    "Lei Estadual (BA) nº 6.677/1994"
   ],
   [
    "administrativo",
    "Lei Estadual (MA) nº 6.107/1994"
   ],
   [
    "administrativo",
    "Lei Estadual (MS) nº 1.102/1990"
   ],
   [
    "administrativo",
    "Lei Estadual (PA) nº 5.810/1994"
   ],
   [
    "administrativo",
    "Lei Estadual (SC) nº 12.929/2004"
   ],
   [
    "administrativo",
    "Lei nº 11.079/2004"
   ],
   [
    "administrativo",
    "Lei nº 12.815/2013"
   ],
   [
    "administrativo",
    "Lei nº 12.846/2013"
   ],
   [
    "administrativo",
    "Lei nº 13.005/2014"
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
    "Lei nº 13.979/2020"
   ],
   [
    "administrativo",
    "Lei nº 14.113/2020"
   ],
   [
    "administrativo",
    "Lei nº 14.133/2021"
   ],
   [
    "administrativo",
    "Lei nº 14.230/2021"
   ],
   [
    "administrativo",
    "Lei nº 4.320/1964"
   ],
   [
    "administrativo",
    "Lei nº 4.878/1965"
   ],
   [
    "administrativo",
    "Lei nº 8.080/1990"
   ],
   [
    "administrativo",
    "Lei nº 8.112/1990"
   ],
   [
    "administrativo",
    "Lei nº 8.142/1990"
   ],
   [
    "administrativo",
    "Lei nº 8.429/1992"
   ],
   [
    "administrativo",
    "Lei nº 8.625/1993"
   ],
   [
    "administrativo",
    "Lei nº 8.745/1993"
   ],
   [
    "administrativo",
    "Lei nº 8.906/1994"
   ],
   [
    "administrativo",
    "Lei nº 8.987/1995"
   ],
   [
    "administrativo",
    "Lei nº 9.394/1996"
   ],
   [
    "administrativo",
    "Lei nº 9.637/1998"
   ],
   [
    "administrativo",
    "Lei nº 9.790/1999"
   ],
   [
    "ambiental",
    "Decreto-Lei nº 25/1937"
   ],
   [
    "ambiental",
    "Lei Complementar nº 140/2011"
   ],
   [
    "ambiental",
    "Lei nº 10.257/2001"
   ],
   [
    "ambiental",
    "Lei nº 11.105/2005"
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
    "Lei nº 11.445/2007"
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
    "Lei nº 12.587/2012"
   ],
   [
    "ambiental",
    "Lei nº 12.651/2012"
   ],
   [
    "ambiental",
    "Lei nº 6.938/1981"
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
    "Lei nº 9.985/2000"
   ],
   [
    "civil",
    "Decreto nº 10.604/2021"
   ],
   [
    "civil",
    "Decreto nº 11.483/2023"
   ],
   [
    "civil",
    "Decreto nº 57.663/1966"
   ],
   [
    "civil",
    "Decreto nº 9.921/2019"
   ],
   [
    "civil",
    "Decreto-Lei nº 4.657/1942"
   ],
   [
    "civil",
    "Decreto-Lei nº 911/1969"
   ],
   [
    "civil",
    "Lei Estadual (RS) nº 14.254/2013"
   ],
   [
    "civil",
    "Lei nº 1.060/1950"
   ],
   [
    "civil",
    "Lei nº 10.406/2002"
   ],
   [
    "civil",
    "Lei nº 10.741/2003"
   ],
   [
    "civil",
    "Lei nº 11.804/2008"
   ],
   [
    "civil",
    "Lei nº 12.318/2010"
   ],
   [
    "civil",
    "Lei nº 12.376/2010"
   ],
   [
    "civil",
    "Lei nº 12.764/2012"
   ],
   [
    "civil",
    "Lei nº 12.965/2014"
   ],
   [
    "civil",
    "Lei nº 13.097/2015"
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
    "Lei nº 14.195/2021"
   ],
   [
    "civil",
    "Lei nº 14.382/2022"
   ],
   [
    "civil",
    "Lei nº 14.443/2022"
   ],
   [
    "civil",
    "Lei nº 14.905/2024"
   ],
   [
    "civil",
    "Lei nº 4.380/1964"
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
    "Lei nº 6.015/1973"
   ],
   [
    "civil",
    "Lei nº 6.766/1979"
   ],
   [
    "civil",
    "Lei nº 8.245/1991"
   ],
   [
    "civil",
    "Lei nº 8.560/1992"
   ],
   [
    "civil",
    "Lei nº 8.842/1994"
   ],
   [
    "civil",
    "Lei nº 8.935/1994"
   ],
   [
    "civil",
    "Lei nº 8.971/1994"
   ],
   [
    "civil",
    "Lei nº 9.265/1996"
   ],
   [
    "civil",
    "Lei nº 9.278/1996"
   ],
   [
    "civil",
    "Lei nº 9.514/1997"
   ],
   [
    "constitucional",
    "Emenda Constitucional nº 80/2014"
   ],
   [
    "constitucional",
    "Lei Estadual (SC) nº 12.069/2001"
   ],
   [
    "constitucional",
    "Lei nº 13.300/2016"
   ],
   [
    "constitucional",
    "Lei nº 14.735/2023"
   ],
   [
    "constitucional",
    "Lei nº 9.882/1999"
   ],
   [
    "consumidor",
    "Decreto nº 2.181/1997"
   ],
   [
    "consumidor",
    "Lei nº 14.181/2021"
   ],
   [
    "consumidor",
    "Lei nº 8.078/1990"
   ],
   [
    "consumidor",
    "Lei nº 9.656/1998"
   ],
   [
    "crianca",
    "Decreto nº 9.603/2018"
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
    "Lei nº 13.010/2014"
   ],
   [
    "crianca",
    "Lei nº 13.185/2015"
   ],
   [
    "crianca",
    "Lei nº 13.257/2016"
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
    "Lei nº 14.811/2024"
   ],
   [
    "crianca",
    "Lei nº 15.100/2025"
   ],
   [
    "crianca",
    "Lei nº 8.069/1990"
   ],
   [
    "eleitoral",
    "Lei Complementar nº 64/1990"
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
    "Lei nº 12.529/2011"
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
    "Lei nº 9.609/1998"
   ],
   [
    "humanos",
    "Decreto (BA) nº 13/2013"
   ],
   [
    "humanos",
    "Decreto (BA) nº 15.682/2014"
   ],
   [
    "humanos",
    "Decreto (BA) nº 16.366/2015"
   ],
   [
    "humanos",
    "Decreto (BA) nº 16.963/2016"
   ],
   [
    "humanos",
    "Decreto (BA) nº 17.921/2017"
   ],
   [
    "humanos",
    "Decreto nº 10.502/2020"
   ],
   [
    "humanos",
    "Decreto nº 10.932/2022"
   ],
   [
    "humanos",
    "Decreto nº 11.777/2023"
   ],
   [
    "humanos",
    "Decreto nº 3.298/1999"
   ],
   [
    "humanos",
    "Decreto nº 3.551/2000"
   ],
   [
    "humanos",
    "Decreto nº 3.956/2001"
   ],
   [
    "humanos",
    "Decreto nº 4.316/2002"
   ],
   [
    "humanos",
    "Decreto nº 4.886/2003"
   ],
   [
    "humanos",
    "Decreto nº 591/1992"
   ],
   [
    "humanos",
    "Decreto nº 592/1992"
   ],
   [
    "humanos",
    "Decreto nº 6.040/2007"
   ],
   [
    "humanos",
    "Decreto nº 6.063/2007"
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
    "Decreto nº 678/1992"
   ],
   [
    "humanos",
    "Decreto nº 7.037/2009"
   ],
   [
    "humanos",
    "Decreto nº 7.053/2009"
   ],
   [
    "humanos",
    "Decreto nº 7.083/2010"
   ],
   [
    "humanos",
    "Decreto nº 7.272/2019"
   ],
   [
    "humanos",
    "Decreto nº 7.404/2010"
   ],
   [
    "humanos",
    "Decreto nº 8.136/2013"
   ],
   [
    "humanos",
    "Decreto nº 8.750/2016"
   ],
   [
    "humanos",
    "Decreto nº 9.296/2018"
   ],
   [
    "humanos",
    "Decreto nº 9.404/2018"
   ],
   [
    "humanos",
    "Decreto nº 9.571/2018"
   ],
   [
    "humanos",
    "Decreto nº 9.710/1990"
   ],
   [
    "humanos",
    "Lei Estadual (BA) nº 10.431/2006"
   ],
   [
    "humanos",
    "Lei Estadual (BA) nº 11.612/2009"
   ],
   [
    "humanos",
    "Lei Estadual (BA) nº 12.365/2011"
   ],
   [
    "humanos",
    "Lei Estadual (BA) nº 12.575/2012"
   ],
   [
    "humanos",
    "Lei Estadual (BA) nº 12.925/2012"
   ],
   [
    "humanos",
    "Lei Estadual (BA) nº 12.932/2014"
   ],
   [
    "humanos",
    "Lei Estadual (BA) nº 13.182/2014"
   ],
   [
    "humanos",
    "Lei Estadual (BA) nº 13.559/2016"
   ],
   [
    "humanos",
    "Lei Estadual (BA) nº 8.895/2003"
   ],
   [
    "humanos",
    "Lei Estadual (PA) nº 9.341/2021"
   ],
   [
    "humanos",
    "Lei nº 10.098/2000"
   ],
   [
    "humanos",
    "Lei nº 10.172/2001"
   ],
   [
    "humanos",
    "Lei nº 10.880/2004"
   ],
   [
    "humanos",
    "Lei nº 11.346/2006"
   ],
   [
    "humanos",
    "Lei nº 11.947/2009"
   ],
   [
    "humanos",
    "Lei nº 12.288/2010"
   ],
   [
    "humanos",
    "Lei nº 12.845/2013"
   ],
   [
    "humanos",
    "Lei nº 12.847/2013"
   ],
   [
    "humanos",
    "Lei nº 12.886/2013"
   ],
   [
    "humanos",
    "Lei nº 13.445/2017"
   ],
   [
    "humanos",
    "Lei nº 14.164/2021"
   ],
   [
    "humanos",
    "Lei nº 14.826/2024"
   ],
   [
    "humanos",
    "Lei nº 5.197/1967"
   ],
   [
    "humanos",
    "Lei nº 7.716/1989"
   ],
   [
    "humanos",
    "Lei nº 7.853/1989"
   ],
   [
    "humanos",
    "Lei nº 9.870/1999"
   ],
   [
    "humanos",
    "Resolução A/RES/61/295 (ONU, 2007)"
   ],
   [
    "penal",
    "Decreto nº 1.973/1996"
   ],
   [
    "penal",
    "Decreto nº 5.015/2004"
   ],
   [
    "penal",
    "Decreto-Lei nº 1.001/1969"
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
    "Decreto-Lei nº 3.688/1941"
   ],
   [
    "penal",
    "Decreto-Lei nº 3.914/1941"
   ],
   [
    "penal",
    "Decreto-Lei nº 6.259/1944"
   ],
   [
    "penal",
    "Lei nº 1.521/1951"
   ],
   [
    "penal",
    "Lei nº 10.028/2000"
   ],
   [
    "penal",
    "Lei nº 10.684/2003"
   ],
   [
    "penal",
    "Lei nº 10.826/2003"
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
    "Lei nº 12.850/2013"
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
    "Lei nº 13.964/2019"
   ],
   [
    "penal",
    "Lei nº 14.188/2021"
   ],
   [
    "penal",
    "Lei nº 14.322/2022"
   ],
   [
    "penal",
    "Lei nº 14.597/2023"
   ],
   [
    "penal",
    "Lei nº 15.384/2026"
   ],
   [
    "penal",
    "Lei nº 4.898/1965"
   ],
   [
    "penal",
    "Lei nº 7.210/1984"
   ],
   [
    "penal",
    "Lei nº 7.492/1986"
   ],
   [
    "penal",
    "Lei nº 7.716/1989"
   ],
   [
    "penal",
    "Lei nº 8.072/1990"
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
    "Lei nº 8.713/1993"
   ],
   [
    "penal",
    "Lei nº 8.884/1994"
   ],
   [
    "penal",
    "Lei nº 9.100/1995"
   ],
   [
    "penal",
    "Lei nº 9.249/1995"
   ],
   [
    "penal",
    "Lei nº 9.263/1996"
   ],
   [
    "penal",
    "Lei nº 9.430/1996"
   ],
   [
    "penal",
    "Lei nº 9.434/1997"
   ],
   [
    "penal",
    "Lei nº 9.455/1997"
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
    "Lei nº 9.613/1998"
   ],
   [
    "penal",
    "Lei nº 9.840/1999"
   ],
   [
    "penal",
    "Lei nº 9.975/2000"
   ],
   [
    "previdenciario",
    "Lei nº 8.742/1993"
   ],
   [
    "processual_civil",
    "Decreto nº 10.692/2021"
   ],
   [
    "processual_civil",
    "Decreto nº 11.599/2023"
   ],
   [
    "processual_civil",
    "Decreto nº 19.841/1945"
   ],
   [
    "processual_civil",
    "Emenda Constitucional nº 125/2022"
   ],
   [
    "processual_civil",
    "Lei Estadual (SC) nº 17.354/2017"
   ],
   [
    "processual_civil",
    "Lei nº 10.259/2001"
   ],
   [
    "processual_civil",
    "Lei nº 11.418/2006"
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
    "Lei nº 12.153/2009"
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
    "Lei nº 13.655/2018"
   ],
   [
    "processual_civil",
    "Lei nº 13.812/2019"
   ],
   [
    "processual_civil",
    "Lei nº 14.341/2022"
   ],
   [
    "processual_civil",
    "Lei nº 14.821/2024"
   ],
   [
    "processual_civil",
    "Lei nº 15.224/2025"
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
    "Lei nº 9.008/1995"
   ],
   [
    "processual_civil",
    "Lei nº 9.099/1995"
   ],
   [
    "processual_civil",
    "Lei nº 9.307/1996"
   ],
   [
    "processual_civil",
    "Lei nº 9.494/1997"
   ],
   [
    "processual_civil",
    "Lei nº 9.507/1997"
   ],
   [
    "processual_penal",
    "Decreto-Lei nº 1.002/1969"
   ],
   [
    "processual_penal",
    "Decreto-Lei nº 201/1967"
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
    "Lei Estadual (BA) nº 10.845/2007"
   ],
   [
    "processual_penal",
    "Lei nº 1.579/1952"
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
    "Lei nº 12.037/2009"
   ],
   [
    "processual_penal",
    "Lei nº 12.313/2010"
   ],
   [
    "processual_penal",
    "Lei nº 12.830/2013"
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
    "penal",
    "Lei nº 13.964/2019"
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
    "tributario",
    "Lei Complementar nº 105/2001"
   ]
  ],
  "tipo": "edital"
 },
 {
  "id": "mpes-1-2025",
  "sigla": "MPES",
  "cargo": "Promotor de Justiça Substituto",
  "orgao": "Ministério Público do Estado do Espírito Santo",
  "titulo": "Concurso Público para Promotor de Justiça Substituto do Espírito Santo",
  "edital": "Edital nº 01/2025",
  "grupos": [
   {
    "nome": "Bloco I",
    "disciplinas": [
     "Direito Constitucional",
     "Direitos Humanos",
     "Direito Administrativo",
     "Direito Eleitoral"
    ]
   },
   {
    "nome": "Bloco II",
    "disciplinas": [
     "Direito Civil e Empresarial",
     "Direito Processual Civil",
     "Direito da Infância e Juventude",
     "Tutela Coletiva"
    ]
   },
   {
    "nome": "Bloco III",
    "disciplinas": [
     "Direito Penal",
     "Direito Processual Penal",
     "Execução Penal"
    ]
   }
  ],
  "leis": [
   [
    "administrativo",
    "Decreto nº 7.174/2010"
   ],
   [
    "administrativo",
    "Decreto-Lei nº 4.597/1942"
   ],
   [
    "administrativo",
    "Lei Complementar (MS) nº 72/1994"
   ],
   [
    "administrativo",
    "Lei Complementar (SC) nº 491/2010"
   ],
   [
    "administrativo",
    "Lei Complementar (SE) nº 33/1996"
   ],
   [
    "administrativo",
    "Lei Complementar nº 101/2000"
   ],
   [
    "administrativo",
    "Lei Complementar nº 141/2012"
   ],
   [
    "administrativo",
    "Lei Complementar nº 75/1993"
   ],
   [
    "administrativo",
    "Lei Estadual (SP) nº 10.177/1998"
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
    "Lei nº 13.019/2014"
   ],
   [
    "administrativo",
    "Lei nº 13.243/2016"
   ],
   [
    "administrativo",
    "Lei nº 13.460/2017"
   ],
   [
    "administrativo",
    "Lei nº 13.848/2019"
   ],
   [
    "administrativo",
    "Lei nº 14.133/2021"
   ],
   [
    "administrativo",
    "Lei nº 14.230/2021"
   ],
   [
    "administrativo",
    "Lei nº 15.047/2024"
   ],
   [
    "administrativo",
    "Lei nº 4.320/1964"
   ],
   [
    "administrativo",
    "Lei nº 8.080/1990"
   ],
   [
    "administrativo",
    "Lei nº 8.429/1992"
   ],
   [
    "administrativo",
    "Lei nº 8.625/1993"
   ],
   [
    "administrativo",
    "Lei nº 8.958/1994"
   ],
   [
    "administrativo",
    "Lei nº 8.987/1995"
   ],
   [
    "administrativo",
    "Lei nº 9.394/1996"
   ],
   [
    "administrativo",
    "Lei nº 9.784/1999"
   ],
   [
    "administrativo",
    "Lei nº 9.986/2000"
   ],
   [
    "ambiental",
    "Lei nº 10.257/2001"
   ],
   [
    "ambiental",
    "Lei nº 11.105/2005"
   ],
   [
    "ambiental",
    "Lei nº 6.938/1981"
   ],
   [
    "civil",
    "Decreto nº 10.604/2021"
   ],
   [
    "civil",
    "Decreto nº 11.483/2023"
   ],
   [
    "civil",
    "Decreto nº 57.663/1966"
   ],
   [
    "civil",
    "Decreto nº 9.921/2019"
   ],
   [
    "civil",
    "Decreto-Lei nº 4.657/1942"
   ],
   [
    "civil",
    "Decreto-Lei nº 911/1969"
   ],
   [
    "civil",
    "Lei Estadual (RS) nº 14.254/2013"
   ],
   [
    "civil",
    "Lei nº 10.406/2002"
   ],
   [
    "civil",
    "Lei nº 10.741/2003"
   ],
   [
    "civil",
    "Lei nº 11.804/2008"
   ],
   [
    "civil",
    "Lei nº 12.318/2010"
   ],
   [
    "civil",
    "Lei nº 12.376/2010"
   ],
   [
    "civil",
    "Lei nº 12.965/2014"
   ],
   [
    "civil",
    "Lei nº 13.058/2014"
   ],
   [
    "civil",
    "Lei nº 13.097/2015"
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
    "Lei nº 13.874/2019"
   ],
   [
    "civil",
    "Lei nº 14.010/2020"
   ],
   [
    "civil",
    "Lei nº 14.382/2022"
   ],
   [
    "civil",
    "Lei nº 14.443/2022"
   ],
   [
    "civil",
    "Lei nº 14.905/2024"
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
    "Lei nº 6.015/1973"
   ],
   [
    "civil",
    "Lei nº 6.766/1979"
   ],
   [
    "civil",
    "Lei nº 8.245/1991"
   ],
   [
    "civil",
    "Lei nº 8.560/1992"
   ],
   [
    "civil",
    "Lei nº 8.842/1994"
   ],
   [
    "civil",
    "Lei nº 8.935/1994"
   ],
   [
    "civil",
    "Lei nº 8.971/1994"
   ],
   [
    "civil",
    "Lei nº 9.265/1996"
   ],
   [
    "civil",
    "Lei nº 9.278/1996"
   ],
   [
    "civil",
    "Lei nº 9.514/1997"
   ],
   [
    "civil",
    "Lei nº 9.610/1998"
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
    "consumidor",
    "Lei nº 8.078/1990"
   ],
   [
    "crianca",
    "Decreto nº 2.740/1998"
   ],
   [
    "crianca",
    "Decreto nº 3.087/1999"
   ],
   [
    "crianca",
    "Decreto nº 9.603/2018"
   ],
   [
    "crianca",
    "Lei Estadual (SC) nº 11.435/2000"
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
    "Lei nº 13.257/2016"
   ],
   [
    "crianca",
    "Lei nº 13.431/2017"
   ],
   [
    "crianca",
    "Lei nº 13.819/2019"
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
    "eleitoral",
    "Lei Complementar nº 64/1990"
   ],
   [
    "eleitoral",
    "Lei Complementar nº 86/1996"
   ],
   [
    "eleitoral",
    "Lei nº 6.091/1974"
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
    "Lei nº 9.609/1998"
   ],
   [
    "humanos",
    "Decreto (BA) nº 13/2013"
   ],
   [
    "humanos",
    "Decreto nº 10.088/2019"
   ],
   [
    "humanos",
    "Decreto nº 10.502/2020"
   ],
   [
    "humanos",
    "Decreto nº 10.932/2022"
   ],
   [
    "humanos",
    "Decreto nº 3.298/1999"
   ],
   [
    "humanos",
    "Decreto nº 3.956/2001"
   ],
   [
    "humanos",
    "Decreto nº 4.886/2003"
   ],
   [
    "humanos",
    "Decreto nº 6.040/2007"
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
    "Decreto nº 678/1992"
   ],
   [
    "humanos",
    "Decreto nº 7.037/2009"
   ],
   [
    "humanos",
    "Decreto nº 7.053/2009"
   ],
   [
    "humanos",
    "Decreto nº 7.272/2019"
   ],
   [
    "humanos",
    "Decreto nº 7.404/2010"
   ],
   [
    "humanos",
    "Decreto nº 8.136/2013"
   ],
   [
    "humanos",
    "Decreto nº 8.750/2016"
   ],
   [
    "humanos",
    "Decreto nº 9.404/2018"
   ],
   [
    "humanos",
    "Decreto nº 9.571/2018"
   ],
   [
    "humanos",
    "Lei Estadual (BA) nº 10.431/2006"
   ],
   [
    "humanos",
    "Lei Estadual (BA) nº 13.182/2014"
   ],
   [
    "humanos",
    "Lei Estadual (PA) nº 9.341/2021"
   ],
   [
    "humanos",
    "Lei nº 10.639/2003"
   ],
   [
    "humanos",
    "Lei nº 11.346/2006"
   ],
   [
    "humanos",
    "Lei nº 11.645/2008"
   ],
   [
    "humanos",
    "Lei nº 12.288/2010"
   ],
   [
    "humanos",
    "Lei nº 12.886/2013"
   ],
   [
    "humanos",
    "Lei nº 14.826/2024"
   ],
   [
    "humanos",
    "Lei nº 7.716/1989"
   ],
   [
    "humanos",
    "Lei nº 7.853/1989"
   ],
   [
    "humanos",
    "Resolução A/RES/61/295 (ONU, 2007)"
   ],
   [
    "penal",
    "Decreto nº 4.388/2002"
   ],
   [
    "penal",
    "Decreto-Lei nº 1.001/1969"
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
    "Decreto-Lei nº 3.914/1941"
   ],
   [
    "penal",
    "Lei nº 1.521/1951"
   ],
   [
    "penal",
    "Lei nº 10.028/2000"
   ],
   [
    "penal",
    "Lei nº 10.684/2003"
   ],
   [
    "penal",
    "Lei nº 10.826/2003"
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
    "Lei nº 12.737/2012"
   ],
   [
    "penal",
    "Lei nº 12.850/2013"
   ],
   [
    "penal",
    "Lei nº 12.984/2014"
   ],
   [
    "penal",
    "Lei nº 13.260/2016"
   ],
   [
    "penal",
    "Lei nº 13.675/2018"
   ],
   [
    "penal",
    "Lei nº 13.869/2019"
   ],
   [
    "penal",
    "Lei nº 13.964/2019"
   ],
   [
    "penal",
    "Lei nº 14.188/2021"
   ],
   [
    "penal",
    "Lei nº 14.245/2021"
   ],
   [
    "penal",
    "Lei nº 14.322/2022"
   ],
   [
    "penal",
    "Lei nº 14.597/2023"
   ],
   [
    "penal",
    "Lei nº 15.358/2026"
   ],
   [
    "penal",
    "Lei nº 15.384/2026"
   ],
   [
    "penal",
    "Lei nº 2.889/1956"
   ],
   [
    "penal",
    "Lei nº 4.898/1965"
   ],
   [
    "penal",
    "Lei nº 6.001/1973"
   ],
   [
    "penal",
    "Lei nº 7.210/1984"
   ],
   [
    "penal",
    "Lei nº 7.492/1986"
   ],
   [
    "penal",
    "Lei nº 7.716/1989"
   ],
   [
    "penal",
    "Lei nº 7.802/1989"
   ],
   [
    "penal",
    "Lei nº 8.072/1990"
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
    "Lei nº 9.029/1995"
   ],
   [
    "penal",
    "Lei nº 9.249/1995"
   ],
   [
    "penal",
    "Lei nº 9.263/1996"
   ],
   [
    "penal",
    "Lei nº 9.430/1996"
   ],
   [
    "penal",
    "Lei nº 9.434/1997"
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
    "Lei nº 9.605/1998"
   ],
   [
    "penal",
    "Lei nº 9.613/1998"
   ],
   [
    "previdenciario",
    "Lei nº 8.742/1993"
   ],
   [
    "processual_civil",
    "Decreto nº 10.692/2021"
   ],
   [
    "processual_civil",
    "Decreto nº 11.599/2023"
   ],
   [
    "processual_civil",
    "Decreto nº 6.307/2007"
   ],
   [
    "processual_civil",
    "Lei Estadual (SC) nº 12.854/2003"
   ],
   [
    "processual_civil",
    "Lei Estadual (SC) nº 13.517/2005"
   ],
   [
    "processual_civil",
    "Lei Estadual (SC) nº 17.354/2017"
   ],
   [
    "processual_civil",
    "Lei Estadual (SC) nº 17.715/2019"
   ],
   [
    "processual_civil",
    "Lei Estadual (SC) nº 17.819/2019"
   ],
   [
    "processual_civil",
    "Lei nº 10.259/2001"
   ],
   [
    "processual_civil",
    "Lei nº 11.418/2006"
   ],
   [
    "processual_civil",
    "Lei nº 11.419/2006"
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
    "processual_civil",
    "Lei nº 13.812/2019"
   ],
   [
    "processual_civil",
    "Lei nº 14.341/2022"
   ],
   [
    "processual_civil",
    "Lei nº 14.821/2024"
   ],
   [
    "processual_civil",
    "Lei nº 15.224/2025"
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
    "Lei nº 8.437/1992"
   ],
   [
    "processual_civil",
    "Lei nº 9.099/1995"
   ],
   [
    "processual_civil",
    "Lei nº 9.494/1997"
   ],
   [
    "processual_civil",
    "Lei nº 9.507/1997"
   ],
   [
    "processual_penal",
    "Decreto-Lei nº 1.002/1969"
   ],
   [
    "processual_penal",
    "Decreto-Lei nº 201/1967"
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
    "Lei nº 1.579/1952"
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
    "Lei nº 11.719/2008"
   ],
   [
    "processual_penal",
    "Lei nº 12.313/2010"
   ],
   [
    "processual_penal",
    "Lei nº 12.830/2013"
   ],
   [
    "processual_penal",
    "Lei nº 12.850/2013"
   ],
   [
    "processual_penal",
    "Lei nº 13.431/2017"
   ],
   [
    "processual_penal",
    "Lei nº 5.249/1967"
   ],
   [
    "processual_penal",
    "Lei nº 7.210/1984"
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
   ]
  ],
  "tipo": "edital"
 },
 {
  "id": "mpma-1-2025",
  "sigla": "MPMA",
  "cargo": "Promotor de Justiça Substituto",
  "orgao": "Ministério Público do Estado do Maranhão",
  "titulo": "Concurso Público para Promotor de Justiça Substituto do Maranhão",
  "edital": "Edital nº 01/2025",
  "grupos": [
   {
    "nome": "Grupo 1",
    "disciplinas": [
     "Direito Constitucional",
     "Direito Administrativo"
    ]
   },
   {
    "nome": "Grupo 2",
    "disciplinas": [
     "Direito Civil",
     "Direito Processual Civil",
     "Direito Tributário"
    ]
   },
   {
    "nome": "Grupo 3",
    "disciplinas": [
     "Direito Penal",
     "Direito Processual Penal"
    ]
   },
   {
    "nome": "Grupo 4",
    "disciplinas": [
     "Direito Eleitoral",
     "Direitos Transindividuais e Direitos Humanos",
     "Direito Ambiental",
     "Direito Sanitário",
     "Direito da Criança e do Adolescente",
     "Direito do Consumidor",
     "Direito do Idoso",
     "Direito das Pessoas com Deficiência",
     "Direito à Educação",
     "Direitos Humanos"
    ]
   }
  ],
  "leis": [
   [
    "administrativo",
    "Decreto nº 7.174/2010"
   ],
   [
    "administrativo",
    "Lei Complementar (DF) nº 840/2011"
   ],
   [
    "administrativo",
    "Lei Complementar (MS) nº 72/1994"
   ],
   [
    "administrativo",
    "Lei Complementar (MT) nº 04/1990"
   ],
   [
    "administrativo",
    "Lei Complementar (SC) nº 491/2010"
   ],
   [
    "administrativo",
    "Lei Complementar (SE) nº 33/1996"
   ],
   [
    "administrativo",
    "Lei Complementar nº 101/2000"
   ],
   [
    "administrativo",
    "Lei Complementar nº 141/2012"
   ],
   [
    "administrativo",
    "Lei Complementar nº 75/1993"
   ],
   [
    "administrativo",
    "Lei Complementar nº 80/1994"
   ],
   [
    "administrativo",
    "Lei Estadual (BA) nº 6.677/1994"
   ],
   [
    "administrativo",
    "Lei Estadual (MA) nº 6.107/1994"
   ],
   [
    "administrativo",
    "Lei Estadual (MS) nº 1.102/1990"
   ],
   [
    "administrativo",
    "Lei Estadual (PA) nº 5.810/1994"
   ],
   [
    "administrativo",
    "Lei Estadual (SC) nº 12.929/2004"
   ],
   [
    "administrativo",
    "Lei Estadual (SC) nº 6.745/1985"
   ],
   [
    "administrativo",
    "Lei Estadual (SP) nº 10.177/1998"
   ],
   [
    "administrativo",
    "Lei nº 10.480/2002"
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
    "Lei nº 13.979/2020"
   ],
   [
    "administrativo",
    "Lei nº 14.113/2020"
   ],
   [
    "administrativo",
    "Lei nº 14.133/2021"
   ],
   [
    "administrativo",
    "Lei nº 14.230/2021"
   ],
   [
    "administrativo",
    "Lei nº 15.047/2024"
   ],
   [
    "administrativo",
    "Lei nº 4.878/1965"
   ],
   [
    "administrativo",
    "Lei nº 8.112/1990"
   ],
   [
    "administrativo",
    "Lei nº 8.429/1992"
   ],
   [
    "administrativo",
    "Lei nº 8.625/1993"
   ],
   [
    "administrativo",
    "Lei nº 8.745/1993"
   ],
   [
    "administrativo",
    "Lei nº 8.987/1995"
   ],
   [
    "administrativo",
    "Lei nº 9.394/1996"
   ],
   [
    "administrativo",
    "Lei nº 9.637/1998"
   ],
   [
    "administrativo",
    "Lei nº 9.784/1999"
   ],
   [
    "administrativo",
    "Lei nº 9.790/1999"
   ],
   [
    "ambiental",
    "Decreto nº 10.936/2022"
   ],
   [
    "ambiental",
    "Decreto nº 7.217/2010"
   ],
   [
    "ambiental",
    "Decreto nº 99.274/1990"
   ],
   [
    "ambiental",
    "Lei Estadual (RS) nº 10.350/1994"
   ],
   [
    "ambiental",
    "Lei Estadual (RS) nº 15.434/2020"
   ],
   [
    "ambiental",
    "Lei Estadual (SC) nº 14.675/2009"
   ],
   [
    "ambiental",
    "Lei Estadual (SC) nº 16.342/2014"
   ],
   [
    "ambiental",
    "Lei nº 11.124/2005"
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
    "Lei nº 12.334/2010"
   ],
   [
    "ambiental",
    "Lei nº 12.587/2012"
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
    "Lei nº 14.755/2023"
   ],
   [
    "ambiental",
    "Lei nº 6.938/1981"
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
    "Lei nº 9.985/2000"
   ],
   [
    "civil",
    "Decreto nº 10.604/2021"
   ],
   [
    "civil",
    "Decreto nº 11.483/2023"
   ],
   [
    "civil",
    "Decreto nº 9.921/2019"
   ],
   [
    "civil",
    "Decreto-Lei nº 4.657/1942"
   ],
   [
    "civil",
    "Lei Estadual (RS) nº 14.254/2013"
   ],
   [
    "civil",
    "Lei nº 10.406/2002"
   ],
   [
    "civil",
    "Lei nº 12.376/2010"
   ],
   [
    "civil",
    "Lei nº 12.764/2012"
   ],
   [
    "civil",
    "Lei nº 13.097/2015"
   ],
   [
    "civil",
    "Lei nº 14.382/2022"
   ],
   [
    "civil",
    "Lei nº 14.443/2022"
   ],
   [
    "civil",
    "Lei nº 14.905/2024"
   ],
   [
    "civil",
    "Lei nº 6.015/1973"
   ],
   [
    "civil",
    "Lei nº 8.842/1994"
   ],
   [
    "civil",
    "Lei nº 8.935/1994"
   ],
   [
    "civil",
    "Lei nº 8.971/1994"
   ],
   [
    "civil",
    "Lei nº 9.265/1996"
   ],
   [
    "civil",
    "Lei nº 9.278/1996"
   ],
   [
    "constitucional",
    "Lei Estadual (SC) nº 12.069/2001"
   ],
   [
    "constitucional",
    "Lei nº 9.882/1999"
   ],
   [
    "consumidor",
    "Decreto nº 2.181/1997"
   ],
   [
    "consumidor",
    "Lei nº 14.790/2023"
   ],
   [
    "crianca",
    "Decreto nº 3.087/1999"
   ],
   [
    "crianca",
    "Decreto nº 5.007/2004"
   ],
   [
    "crianca",
    "Lei Estadual (SC) nº 11.435/2000"
   ],
   [
    "crianca",
    "Lei nº 12.594/2012"
   ],
   [
    "crianca",
    "Lei nº 13.257/2016"
   ],
   [
    "crianca",
    "Lei nº 14.344/2022"
   ],
   [
    "eleitoral",
    "Lei Complementar nº 86/1996"
   ],
   [
    "eleitoral",
    "Lei nº 14.192/2021"
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
    "Lei nº 9.096/1995"
   ],
   [
    "humanos",
    "Decreto nº 10.502/2020"
   ],
   [
    "humanos",
    "Decreto nº 11.777/2023"
   ],
   [
    "humanos",
    "Decreto nº 3.298/1999"
   ],
   [
    "humanos",
    "Decreto nº 3.551/2000"
   ],
   [
    "humanos",
    "Decreto nº 4.886/2003"
   ],
   [
    "humanos",
    "Decreto nº 591/1992"
   ],
   [
    "humanos",
    "Decreto nº 592/1992"
   ],
   [
    "humanos",
    "Decreto nº 6.040/2007"
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
    "Decreto nº 678/1992"
   ],
   [
    "humanos",
    "Decreto nº 7.037/2009"
   ],
   [
    "humanos",
    "Decreto nº 7.053/2009"
   ],
   [
    "humanos",
    "Decreto nº 7.272/2019"
   ],
   [
    "humanos",
    "Decreto nº 7.404/2010"
   ],
   [
    "humanos",
    "Decreto nº 8.136/2013"
   ],
   [
    "humanos",
    "Decreto nº 9.571/2018"
   ],
   [
    "humanos",
    "Lei Estadual (BA) nº 13.182/2014"
   ],
   [
    "humanos",
    "Lei Estadual (PA) nº 9.341/2021"
   ],
   [
    "humanos",
    "Lei nº 10.880/2004"
   ],
   [
    "humanos",
    "Lei nº 11.346/2006"
   ],
   [
    "humanos",
    "Lei nº 11.947/2009"
   ],
   [
    "humanos",
    "Lei nº 12.288/2010"
   ],
   [
    "humanos",
    "Lei nº 12.847/2013"
   ],
   [
    "humanos",
    "Lei nº 12.886/2013"
   ],
   [
    "penal",
    "Decreto-Lei nº 1.001/1969"
   ],
   [
    "penal",
    "Decreto-Lei nº 2.848/1940"
   ],
   [
    "penal",
    "Decreto-Lei nº 3.688/1941"
   ],
   [
    "penal",
    "Decreto-Lei nº 3.914/1941"
   ],
   [
    "penal",
    "Decreto-Lei nº 6.259/1944"
   ],
   [
    "penal",
    "Lei nº 1.521/1951"
   ],
   [
    "penal",
    "Lei nº 10.028/2000"
   ],
   [
    "penal",
    "Lei nº 11.340/2006"
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
    "Lei nº 14.188/2021"
   ],
   [
    "penal",
    "Lei nº 14.322/2022"
   ],
   [
    "penal",
    "Lei nº 15.358/2026"
   ],
   [
    "penal",
    "Lei nº 15.384/2026"
   ],
   [
    "penal",
    "Lei nº 7.210/1984"
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
    "Lei nº 8.137/1990"
   ],
   [
    "penal",
    "Lei nº 8.176/1991"
   ],
   [
    "penal",
    "Lei nº 9.020/1995"
   ],
   [
    "penal",
    "Lei nº 9.029/1995"
   ],
   [
    "penal",
    "Lei nº 9.263/1996"
   ],
   [
    "penal",
    "Lei nº 9.430/1996"
   ],
   [
    "penal",
    "Lei nº 9.434/1997"
   ],
   [
    "penal",
    "Lei nº 9.605/1998"
   ],
   [
    "processual_civil",
    "Decreto nº 10.692/2021"
   ],
   [
    "processual_civil",
    "Decreto nº 11.599/2023"
   ],
   [
    "processual_civil",
    "Emenda Constitucional nº 125/2022"
   ],
   [
    "processual_civil",
    "Lei nº 10.259/2001"
   ],
   [
    "processual_civil",
    "Lei nº 11.418/2006"
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
    "processual_civil",
    "Lei nº 13.812/2019"
   ],
   [
    "processual_civil",
    "Lei nº 14.341/2022"
   ],
   [
    "processual_civil",
    "Lei nº 14.821/2024"
   ],
   [
    "processual_civil",
    "Lei nº 15.224/2025"
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
    "Lei nº 8.437/1992"
   ],
   [
    "processual_civil",
    "Lei nº 9.099/1995"
   ],
   [
    "processual_civil",
    "Lei nº 9.494/1997"
   ],
   [
    "processual_civil",
    "Lei nº 9.507/1997"
   ],
   [
    "processual_penal",
    "Decreto-Lei nº 1.002/1969"
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
    "Lei nº 11.101/2005"
   ],
   [
    "processual_penal",
    "Lei nº 11.340/2006"
   ],
   [
    "processual_penal",
    "Lei nº 11.671/2008"
   ],
   [
    "processual_penal",
    "Lei nº 12.313/2010"
   ],
   [
    "processual_penal",
    "Lei nº 12.830/2013"
   ],
   [
    "processual_penal",
    "Lei nº 7.210/1984"
   ],
   [
    "processual_penal",
    "Lei nº 7.960/1989"
   ],
   [
    "processual_penal",
    "Lei nº 8.457/1992"
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
    "Lei nº 9.807/1999"
   ],
   [
    "tributario",
    "Decreto Estadual (MG) nº 44.747/2008"
   ],
   [
    "tributario",
    "Decreto nº 70.235/1972"
   ],
   [
    "tributario",
    "Decreto-Lei nº 147/1967"
   ],
   [
    "tributario",
    "Lei Complementar nº 118/2005"
   ],
   [
    "tributario",
    "Lei Estadual (PR) nº 18.877/2016"
   ],
   [
    "tributario",
    "Lei nº 6.830/1980"
   ],
   [
    "tributario",
    "Lei nº 9.703/1998"
   ]
  ],
  "tipo": "edital"
 },
 {
  "id": "mprs-51-2025",
  "sigla": "MPRS",
  "cargo": "Promotor de Justiça Substituto",
  "orgao": "Ministério Público do Estado do Rio Grande do Sul",
  "titulo": "51º Concurso para Ingresso na Carreira do Ministério Público do Rio Grande do Sul",
  "edital": "Edital nº 110/2025-SUBADM",
  "grupos": [
   {
    "nome": "Bloco I",
    "disciplinas": [
     "Direito Institucional do Ministério Público",
     "Direito Constitucional",
     "Direito Administrativo",
     "Direito Eleitoral"
    ]
   },
   {
    "nome": "Bloco II",
    "disciplinas": [
     "Direito Processual Civil",
     "Direito Civil",
     "Direito de Empresa",
     "Direito Registral e Notarial"
    ]
   },
   {
    "nome": "Bloco III",
    "disciplinas": [
     "Direito Penal",
     "Execução Penal",
     "Direito Processual Penal"
    ]
   },
   {
    "nome": "Bloco IV",
    "disciplinas": [
     "Direito da Criança e do Adolescente",
     "Direito da Pessoa Idosa",
     "Direito da Pessoa com Deficiência",
     "Direito do Consumidor",
     "Direito Ambiental",
     "Direito Urbanístico"
    ]
   }
  ],
  "leis": [
   [
    "administrativo",
    "Decreto nº 10.592/2020"
   ],
   [
    "administrativo",
    "Decreto nº 7.174/2010"
   ],
   [
    "administrativo",
    "Decreto nº 7.499/2011"
   ],
   [
    "administrativo",
    "Decreto-Lei nº 4.597/1942"
   ],
   [
    "administrativo",
    "Lei Complementar (DF) nº 840/2011"
   ],
   [
    "administrativo",
    "Lei Complementar (MS) nº 72/1994"
   ],
   [
    "administrativo",
    "Lei Complementar (MT) nº 04/1990"
   ],
   [
    "administrativo",
    "Lei Complementar (RS) nº 16.263/2024"
   ],
   [
    "administrativo",
    "Lei Complementar (SC) nº 491/2010"
   ],
   [
    "administrativo",
    "Lei Complementar (SE) nº 33/1996"
   ],
   [
    "administrativo",
    "Lei Complementar nº 141/2012"
   ],
   [
    "administrativo",
    "Lei Complementar nº 220/2025"
   ],
   [
    "administrativo",
    "Lei Complementar nº 75/1993"
   ],
   [
    "administrativo",
    "Lei Estadual (BA) nº 6.677/1994"
   ],
   [
    "administrativo",
    "Lei Estadual (MA) nº 6.107/1994"
   ],
   [
    "administrativo",
    "Lei Estadual (MS) nº 1.102/1990"
   ],
   [
    "administrativo",
    "Lei Estadual (PA) nº 5.810/1994"
   ],
   [
    "administrativo",
    "Lei Estadual (SC) nº 12.929/2004"
   ],
   [
    "administrativo",
    "Lei Estadual (SP) nº 10.177/1998"
   ],
   [
    "administrativo",
    "Lei nº 11.079/2004"
   ],
   [
    "administrativo",
    "Lei nº 14.129/2021"
   ],
   [
    "administrativo",
    "Lei nº 14.133/2021"
   ],
   [
    "administrativo",
    "Lei nº 14.230/2021"
   ],
   [
    "administrativo",
    "Lei nº 15.047/2024"
   ],
   [
    "administrativo",
    "Lei nº 4.132/1962"
   ],
   [
    "administrativo",
    "Lei nº 4.878/1965"
   ],
   [
    "administrativo",
    "Lei nº 8.112/1990"
   ],
   [
    "administrativo",
    "Lei nº 8.429/1992"
   ],
   [
    "administrativo",
    "Lei nº 8.625/1993"
   ],
   [
    "administrativo",
    "Lei nº 8.745/1993"
   ],
   [
    "administrativo",
    "Lei nº 8.987/1995"
   ],
   [
    "administrativo",
    "Lei nº 9.394/1996"
   ],
   [
    "administrativo",
    "Lei nº 9.637/1998"
   ],
   [
    "administrativo",
    "Lei nº 9.784/1999"
   ],
   [
    "administrativo",
    "Lei nº 9.790/1999"
   ],
   [
    "ambiental",
    "Decreto nº 10.936/2022"
   ],
   [
    "ambiental",
    "Decreto nº 6.514/2008"
   ],
   [
    "ambiental",
    "Decreto nº 7.217/2010"
   ],
   [
    "ambiental",
    "Decreto nº 9.310/2018"
   ],
   [
    "ambiental",
    "Decreto nº 99.274/1990"
   ],
   [
    "ambiental",
    "Decreto-Lei nº 25/1937"
   ],
   [
    "ambiental",
    "Lei Complementar nº 140/2011"
   ],
   [
    "ambiental",
    "Lei Estadual (PA) nº 5.629/1990"
   ],
   [
    "ambiental",
    "Lei Estadual (PA) nº 9.048/2020"
   ],
   [
    "ambiental",
    "Lei Estadual (RS) nº 10.350/1994"
   ],
   [
    "ambiental",
    "Lei Estadual (RS) nº 15.434/2020"
   ],
   [
    "ambiental",
    "Lei Estadual (SC) nº 14.675/2009"
   ],
   [
    "ambiental",
    "Lei Estadual (SC) nº 16.342/2014"
   ],
   [
    "ambiental",
    "Lei nº 10.257/2001"
   ],
   [
    "ambiental",
    "Lei nº 11.124/2005"
   ],
   [
    "ambiental",
    "Lei nº 11.445/2007"
   ],
   [
    "ambiental",
    "Lei nº 11.977/2009"
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
    "Lei nº 12.334/2010"
   ],
   [
    "ambiental",
    "Lei nº 12.587/2012"
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
    "Lei nº 13.089/2015"
   ],
   [
    "ambiental",
    "Lei nº 13.425/2017"
   ],
   [
    "ambiental",
    "Lei nº 13.465/2017"
   ],
   [
    "ambiental",
    "Lei nº 14.026/2020"
   ],
   [
    "ambiental",
    "Lei nº 14.755/2023"
   ],
   [
    "ambiental",
    "Lei nº 14.904/2024"
   ],
   [
    "ambiental",
    "Lei nº 6.938/1981"
   ],
   [
    "ambiental",
    "Lei nº 9.433/1997"
   ],
   [
    "ambiental",
    "Lei nº 9.478/1997"
   ],
   [
    "ambiental",
    "Lei nº 9.795/1999"
   ],
   [
    "ambiental",
    "Lei nº 9.985/2000"
   ],
   [
    "ambiental",
    "Medida Provisória nº 2.220/2001"
   ],
   [
    "civil",
    "Decreto nº 10.133/2019"
   ],
   [
    "civil",
    "Decreto nº 10.604/2021"
   ],
   [
    "civil",
    "Decreto nº 11.483/2023"
   ],
   [
    "civil",
    "Decreto nº 3.413/2000"
   ],
   [
    "civil",
    "Decreto nº 3.691/2000"
   ],
   [
    "civil",
    "Decreto nº 5.296/2004"
   ],
   [
    "civil",
    "Decreto nº 9.921/2019"
   ],
   [
    "civil",
    "Decreto-Lei nº 4.657/1942"
   ],
   [
    "civil",
    "Decreto-Lei nº 911/1969"
   ],
   [
    "civil",
    "Lei Estadual (RS) nº 14.254/2013"
   ],
   [
    "civil",
    "Lei nº 10.406/2002"
   ],
   [
    "civil",
    "Lei nº 10.741/2003"
   ],
   [
    "civil",
    "Lei nº 12.318/2010"
   ],
   [
    "civil",
    "Lei nº 12.376/2010"
   ],
   [
    "civil",
    "Lei nº 12.764/2012"
   ],
   [
    "civil",
    "Lei nº 13.097/2015"
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
    "Lei nº 13.786/2018"
   ],
   [
    "civil",
    "Lei nº 13.977/2020"
   ],
   [
    "civil",
    "Lei nº 14.382/2022"
   ],
   [
    "civil",
    "Lei nº 14.443/2022"
   ],
   [
    "civil",
    "Lei nº 14.905/2024"
   ],
   [
    "civil",
    "Lei nº 6.015/1973"
   ],
   [
    "civil",
    "Lei nº 6.766/1979"
   ],
   [
    "civil",
    "Lei nº 8.842/1994"
   ],
   [
    "civil",
    "Lei nº 8.899/1994"
   ],
   [
    "civil",
    "Lei nº 8.935/1994"
   ],
   [
    "civil",
    "Lei nº 8.971/1994"
   ],
   [
    "civil",
    "Lei nº 9.265/1996"
   ],
   [
    "civil",
    "Lei nº 9.278/1996"
   ],
   [
    "civil",
    "Lei nº 9.514/1997"
   ],
   [
    "constitucional",
    "Emenda Constitucional nº 80/2014"
   ],
   [
    "constitucional",
    "Lei Estadual (SC) nº 12.069/2001"
   ],
   [
    "constitucional",
    "Lei nº 9.882/1999"
   ],
   [
    "consumidor",
    "Decreto nº 11.034/2022"
   ],
   [
    "consumidor",
    "Decreto nº 11.150/2022"
   ],
   [
    "consumidor",
    "Decreto nº 2.181/1997"
   ],
   [
    "consumidor",
    "Lei nº 14.181/2021"
   ],
   [
    "consumidor",
    "Lei nº 14.538/2023"
   ],
   [
    "consumidor",
    "Lei nº 8.078/1990"
   ],
   [
    "consumidor",
    "Lei nº 9.656/1998"
   ],
   [
    "crianca",
    "Decreto nº 2.740/1998"
   ],
   [
    "crianca",
    "Decreto nº 3.087/1999"
   ],
   [
    "crianca",
    "Decreto nº 5.007/2004"
   ],
   [
    "crianca",
    "Decreto nº 9.603/2018"
   ],
   [
    "crianca",
    "Decreto nº 99.710/1990"
   ],
   [
    "crianca",
    "Lei (RS) nº 14.705/2015"
   ],
   [
    "crianca",
    "Lei (RS) nº 9.831/1993"
   ],
   [
    "crianca",
    "Lei Estadual (SC) nº 14.651/2009"
   ],
   [
    "crianca",
    "Lei nº 12.594/2012"
   ],
   [
    "crianca",
    "Lei nº 13.010/2014"
   ],
   [
    "crianca",
    "Lei nº 13.185/2015"
   ],
   [
    "crianca",
    "Lei nº 13.257/2016"
   ],
   [
    "crianca",
    "Lei nº 13.431/2017"
   ],
   [
    "crianca",
    "Lei nº 13.819/2019"
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
    "Lei nº 8.242/1991"
   ],
   [
    "crianca",
    "Resolução CNJ nº 295/2019"
   ],
   [
    "eleitoral",
    "Lei Complementar nº 86/1996"
   ],
   [
    "eleitoral",
    "Lei nº 9.096/1995"
   ],
   [
    "empresarial",
    "Decreto nº 2.044/1908"
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
    "Lei nº 14.112/2020"
   ],
   [
    "empresarial",
    "Lei nº 14.193/2021"
   ],
   [
    "empresarial",
    "Lei nº 4.886/1965"
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
    "humanos",
    "Decreto nº 3.298/1999"
   ],
   [
    "humanos",
    "Decreto nº 3.956/2001"
   ],
   [
    "humanos",
    "Decreto nº 6.949/2009"
   ],
   [
    "humanos",
    "Lei nº 10.098/2000"
   ],
   [
    "humanos",
    "Lei nº 7.853/1989"
   ],
   [
    "penal",
    "Decreto nº 5.015/2004"
   ],
   [
    "penal",
    "Decreto-Lei nº 1.001/1969"
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
    "Decreto-Lei nº 3.688/1941"
   ],
   [
    "penal",
    "Decreto-Lei nº 3.914/1941"
   ],
   [
    "penal",
    "Decreto-Lei nº 6.259/1944"
   ],
   [
    "penal",
    "Lei nº 1.521/1951"
   ],
   [
    "penal",
    "Lei nº 10.028/2000"
   ],
   [
    "penal",
    "Lei nº 10.826/2003"
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
    "Lei nº 12.850/2013"
   ],
   [
    "penal",
    "Lei nº 13.869/2019"
   ],
   [
    "penal",
    "Lei nº 14.188/2021"
   ],
   [
    "penal",
    "Lei nº 14.322/2022"
   ],
   [
    "penal",
    "Lei nº 15.384/2026"
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
    "Lei nº 8.137/1990"
   ],
   [
    "penal",
    "Lei nº 8.176/1991"
   ],
   [
    "penal",
    "Lei nº 9.430/1996"
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
    "Lei nº 9.613/1998"
   ],
   [
    "previdenciario",
    "Lei nº 8.213/1991"
   ],
   [
    "previdenciario",
    "Lei nº 8.742/1993"
   ],
   [
    "processual_civil",
    "Emenda Constitucional nº 125/2022"
   ],
   [
    "processual_civil",
    "Lei nº 11.418/2006"
   ],
   [
    "processual_civil",
    "Lei nº 12.016/2009"
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
    "processual_civil",
    "Lei nº 4.717/1965"
   ],
   [
    "processual_civil",
    "Lei nº 7.347/1985"
   ],
   [
    "processual_civil",
    "Lei nº 8.437/1992"
   ],
   [
    "processual_civil",
    "Lei nº 9.099/1995"
   ],
   [
    "processual_civil",
    "Lei nº 9.494/1997"
   ],
   [
    "processual_penal",
    "Decreto-Lei nº 1.002/1969"
   ],
   [
    "processual_penal",
    "Decreto-Lei nº 201/1967"
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
    "Lei nº 1.579/1952"
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
    "Lei nº 12.037/2009"
   ],
   [
    "processual_penal",
    "Lei nº 12.313/2010"
   ],
   [
    "processual_penal",
    "Lei nº 12.830/2013"
   ],
   [
    "processual_penal",
    "Lei nº 12.850/2013"
   ],
   [
    "processual_penal",
    "Lei nº 13.256/2016"
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
   ]
  ],
  "tipo": "edital"
 },
 {
  "id": "mpsc-45-2025",
  "sigla": "MPSC",
  "cargo": "Promotor de Justiça Substituto",
  "orgao": "Ministério Público do Estado de Santa Catarina",
  "titulo": "45º Concurso de Ingresso na Carreira do Ministério Público de Santa Catarina",
  "edital": "Resolução nº 02/2025-CSMP",
  "grupos": [
   {
    "nome": "Bloco I",
    "disciplinas": [
     "Criminologia e Política Criminal",
     "Direito Constitucional",
     "Direito Penal",
     "Direito Processual Penal",
     "Execução Penal"
    ]
   },
   {
    "nome": "Bloco II",
    "disciplinas": [
     "Direito Civil",
     "Direito Processual Civil",
     "Direitos Difusos e Coletivos",
     "Direito da Criança e do Adolescente"
    ]
   },
   {
    "nome": "Bloco III",
    "disciplinas": [
     "Direito Administrativo",
     "Direito Tributário e Financeiro",
     "Direito Falimentar",
     "Direito Eleitoral",
     "Legislação Institucional"
    ]
   }
  ],
  "leis": [
   [
    "administrativo",
    "Decreto nº 10.024/2019"
   ],
   [
    "administrativo",
    "Decreto nº 6.017/2007"
   ],
   [
    "administrativo",
    "Decreto nº 7.174/2010"
   ],
   [
    "administrativo",
    "Decreto nº 7.746/2012"
   ],
   [
    "administrativo",
    "Decreto-Lei nº 4.597/1942"
   ],
   [
    "administrativo",
    "Lei Complementar (DF) nº 840/2011"
   ],
   [
    "administrativo",
    "Lei Complementar (MT) nº 04/1990"
   ],
   [
    "administrativo",
    "Lei Complementar (SC) nº 491/2010"
   ],
   [
    "administrativo",
    "Lei Complementar (SE) nº 33/1996"
   ],
   [
    "administrativo",
    "Lei Complementar nº 101/2000"
   ],
   [
    "administrativo",
    "Lei Complementar nº 141/2012"
   ],
   [
    "administrativo",
    "Lei Estadual (BA) nº 6.677/1994"
   ],
   [
    "administrativo",
    "Lei Estadual (MA) nº 6.107/1994"
   ],
   [
    "administrativo",
    "Lei Estadual (MS) nº 1.102/1990"
   ],
   [
    "administrativo",
    "Lei Estadual (PA) nº 5.810/1994"
   ],
   [
    "administrativo",
    "Lei Estadual (SC) nº 12.929/2004"
   ],
   [
    "administrativo",
    "Lei Estadual (SP) nº 10.177/1998"
   ],
   [
    "administrativo",
    "Lei nº 10.520/2002"
   ],
   [
    "administrativo",
    "Lei nº 11.079/2004"
   ],
   [
    "administrativo",
    "Lei nº 12.232/2010"
   ],
   [
    "administrativo",
    "Lei nº 12.462/2011"
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
    "Lei nº 13.005/2014"
   ],
   [
    "administrativo",
    "Lei nº 13.019/2014"
   ],
   [
    "administrativo",
    "Lei nº 13.303/2016"
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
    "Lei nº 14.230/2021"
   ],
   [
    "administrativo",
    "Lei nº 4.504/1964"
   ],
   [
    "administrativo",
    "Lei nº 4.878/1965"
   ],
   [
    "administrativo",
    "Lei nº 8.080/1990"
   ],
   [
    "administrativo",
    "Lei nº 8.112/1990"
   ],
   [
    "administrativo",
    "Lei nº 8.142/1990"
   ],
   [
    "administrativo",
    "Lei nº 8.429/1992"
   ],
   [
    "administrativo",
    "Lei nº 8.666/1993"
   ],
   [
    "administrativo",
    "Lei nº 8.745/1993"
   ],
   [
    "administrativo",
    "Lei nº 8.987/1995"
   ],
   [
    "administrativo",
    "Lei nº 9.394/1996"
   ],
   [
    "administrativo",
    "Lei nº 9.637/1998"
   ],
   [
    "administrativo",
    "Lei nº 9.784/1999"
   ],
   [
    "administrativo",
    "Lei nº 9.790/1999"
   ],
   [
    "ambiental",
    "Decreto nº 10.936/2022"
   ],
   [
    "ambiental",
    "Decreto nº 6.514/2008"
   ],
   [
    "ambiental",
    "Decreto nº 9.310/2018"
   ],
   [
    "ambiental",
    "Decreto-Lei nº 25/1937"
   ],
   [
    "ambiental",
    "Lei Complementar nº 140/2011"
   ],
   [
    "ambiental",
    "Lei Estadual (SC) nº 14.675/2009"
   ],
   [
    "ambiental",
    "Lei nº 10.257/2001"
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
    "Lei nº 11.428/2006"
   ],
   [
    "ambiental",
    "Lei nº 11.445/2007"
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
    "Lei nº 12.587/2012"
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
    "Lei nº 13.465/2017"
   ],
   [
    "ambiental",
    "Lei nº 14.119/2021"
   ],
   [
    "ambiental",
    "Lei nº 14.785/2023"
   ],
   [
    "ambiental",
    "Lei nº 15.190/2025"
   ],
   [
    "ambiental",
    "Lei nº 6.938/1981"
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
    "Lei nº 9.985/2000"
   ],
   [
    "civil",
    "Decreto nº 20.910/1932"
   ],
   [
    "civil",
    "Decreto nº 5.296/2004"
   ],
   [
    "civil",
    "Decreto-Lei nº 4.657/1942"
   ],
   [
    "civil",
    "Lei Estadual (SC) nº 17.492/2018"
   ],
   [
    "civil",
    "Lei nº 1.060/1950"
   ],
   [
    "civil",
    "Lei nº 10.048/2000"
   ],
   [
    "civil",
    "Lei nº 10.406/2002"
   ],
   [
    "civil",
    "Lei nº 10.741/2003"
   ],
   [
    "civil",
    "Lei nº 12.318/2010"
   ],
   [
    "civil",
    "Lei nº 12.376/2010"
   ],
   [
    "civil",
    "Lei nº 12.965/2014"
   ],
   [
    "civil",
    "Lei nº 13.097/2015"
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
    "Lei nº 13.726/2018"
   ],
   [
    "civil",
    "Lei nº 14.382/2022"
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
    "Lei nº 6.015/1973"
   ],
   [
    "civil",
    "Lei nº 6.515/1977"
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
    "Lei nº 8.560/1992"
   ],
   [
    "civil",
    "Lei nº 8.842/1994"
   ],
   [
    "civil",
    "Lei nº 8.935/1994"
   ],
   [
    "civil",
    "Lei nº 8.971/1994"
   ],
   [
    "civil",
    "Lei nº 9.265/1996"
   ],
   [
    "civil",
    "Lei nº 9.278/1996"
   ],
   [
    "civil",
    "Lei nº 9.514/1997"
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
    "constitucional",
    "Lei Estadual (SC) nº 12.069/2001"
   ],
   [
    "constitucional",
    "Lei nº 1.079/1950"
   ],
   [
    "constitucional",
    "Lei nº 12.562/2011"
   ],
   [
    "constitucional",
    "Lei nº 9.868/1999"
   ],
   [
    "constitucional",
    "Lei nº 9.882/1999"
   ],
   [
    "consumidor",
    "Decreto nº 11.034/2022"
   ],
   [
    "consumidor",
    "Lei nº 8.078/1990"
   ],
   [
    "consumidor",
    "Lei nº 9.656/1998"
   ],
   [
    "crianca",
    "Decreto nº 2.740/1998"
   ],
   [
    "crianca",
    "Decreto nº 9.603/2018"
   ],
   [
    "crianca",
    "Lei (RS) nº 9.831/1993"
   ],
   [
    "crianca",
    "Lei Estadual (SC) nº 11.435/2000"
   ],
   [
    "crianca",
    "Lei Estadual (SC) nº 11.603/2000"
   ],
   [
    "crianca",
    "Lei Estadual (SC) nº 11.697/2001"
   ],
   [
    "crianca",
    "Lei Estadual (SC) nº 14.651/2009"
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
    "Lei nº 13.185/2015"
   ],
   [
    "crianca",
    "Lei nº 13.257/2016"
   ],
   [
    "crianca",
    "Lei nº 13.431/2017"
   ],
   [
    "crianca",
    "Lei nº 13.819/2019"
   ],
   [
    "crianca",
    "Lei nº 14.344/2022"
   ],
   [
    "crianca",
    "Lei nº 14.548/2023"
   ],
   [
    "crianca",
    "Lei nº 14.811/2024"
   ],
   [
    "crianca",
    "Lei nº 15.211/2025"
   ],
   [
    "crianca",
    "Lei nº 8.069/1990"
   ],
   [
    "crianca",
    "Lei nº 8.242/1991"
   ],
   [
    "eleitoral",
    "Lei Complementar nº 135/2010"
   ],
   [
    "eleitoral",
    "Lei Complementar nº 64/1990"
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
    "Lei nº 14.112/2020"
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
    "humanos",
    "Decreto nº 7.053/2009"
   ],
   [
    "humanos",
    "Lei nº 10.098/2000"
   ],
   [
    "humanos",
    "Lei nº 11.346/2006"
   ],
   [
    "humanos",
    "Lei nº 12.288/2010"
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
    "Lei nº 7.853/1989"
   ],
   [
    "penal",
    "Decreto nº 5.015/2004"
   ],
   [
    "penal",
    "Decreto-Lei nº 1.001/1969"
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
    "Decreto-Lei nº 3.688/1941"
   ],
   [
    "penal",
    "Decreto-Lei nº 3.914/1941"
   ],
   [
    "penal",
    "Decreto-Lei nº 6.259/1944"
   ],
   [
    "penal",
    "Lei nº 1.521/1951"
   ],
   [
    "penal",
    "Lei nº 10.028/2000"
   ],
   [
    "penal",
    "Lei nº 10.826/2003"
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
    "Lei nº 12.984/2014"
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
    "Lei nº 13.675/2018"
   ],
   [
    "penal",
    "Lei nº 13.840/2019"
   ],
   [
    "penal",
    "Lei nº 13.869/2019"
   ],
   [
    "penal",
    "Lei nº 13.964/2019"
   ],
   [
    "penal",
    "Lei nº 14.188/2021"
   ],
   [
    "penal",
    "Lei nº 14.322/2022"
   ],
   [
    "penal",
    "Lei nº 14.597/2023"
   ],
   [
    "penal",
    "Lei nº 15.358/2026"
   ],
   [
    "penal",
    "Lei nº 15.384/2026"
   ],
   [
    "penal",
    "Lei nº 4.898/1965"
   ],
   [
    "penal",
    "Lei nº 7.492/1986"
   ],
   [
    "penal",
    "Lei nº 7.716/1989"
   ],
   [
    "penal",
    "Lei nº 8.072/1990"
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
    "Lei nº 9.263/1996"
   ],
   [
    "penal",
    "Lei nº 9.430/1996"
   ],
   [
    "penal",
    "Lei nº 9.434/1997"
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
    "Lei nº 9.605/1998"
   ],
   [
    "penal",
    "Lei nº 9.613/1998"
   ],
   [
    "previdenciario",
    "Lei nº 8.742/1993"
   ],
   [
    "processual_civil",
    "Decreto nº 10.692/2021"
   ],
   [
    "processual_civil",
    "Decreto nº 11.599/2023"
   ],
   [
    "processual_civil",
    "Decreto nº 5.626/2005"
   ],
   [
    "processual_civil",
    "Decreto nº 6.307/2007"
   ],
   [
    "processual_civil",
    "Decreto nº 6.660/2008"
   ],
   [
    "processual_civil",
    "Decreto nº 7.830/2012"
   ],
   [
    "processual_civil",
    "Emenda Constitucional nº 125/2022"
   ],
   [
    "processual_civil",
    "Lei (SC) nº 11.402/2000"
   ],
   [
    "processual_civil",
    "Lei (SC) nº 11.436/2000"
   ],
   [
    "processual_civil",
    "Lei (SC) nº 15.182/2010"
   ],
   [
    "processual_civil",
    "Lei Complementar (SC) nº 339/2006"
   ],
   [
    "processual_civil",
    "Lei Complementar (SC) nº 367/2006"
   ],
   [
    "processual_civil",
    "Lei Estadual (SC) nº 11.069/1998"
   ],
   [
    "processual_civil",
    "Lei Estadual (SC) nº 12.854/2003"
   ],
   [
    "processual_civil",
    "Lei Estadual (SC) nº 13.517/2005"
   ],
   [
    "processual_civil",
    "Lei Estadual (SC) nº 13.553/2005"
   ],
   [
    "processual_civil",
    "Lei Estadual (SC) nº 13.558/2005"
   ],
   [
    "processual_civil",
    "Lei Estadual (SC) nº 14.652/2009"
   ],
   [
    "processual_civil",
    "Lei Estadual (SC) nº 14.661/2009"
   ],
   [
    "processual_civil",
    "Lei Estadual (SC) nº 14.954/2009"
   ],
   [
    "processual_civil",
    "Lei Estadual (SC) nº 16.601/2015"
   ],
   [
    "processual_civil",
    "Lei Estadual (SC) nº 16.869/2016"
   ],
   [
    "processual_civil",
    "Lei Estadual (SC) nº 17.066/2017"
   ],
   [
    "processual_civil",
    "Lei Estadual (SC) nº 17.292/2017"
   ],
   [
    "processual_civil",
    "Lei Estadual (SC) nº 17.354/2017"
   ],
   [
    "processual_civil",
    "Lei Estadual (SC) nº 17.715/2019"
   ],
   [
    "processual_civil",
    "Lei Estadual (SC) nº 17.819/2019"
   ],
   [
    "processual_civil",
    "Lei Estadual (SC) nº 18.018/2020"
   ],
   [
    "processual_civil",
    "Lei Estadual (SC) nº 18.322/2022"
   ],
   [
    "processual_civil",
    "Lei Estadual (SC) nº 9.748/1994"
   ],
   [
    "processual_civil",
    "Lei nº 10.259/2001"
   ],
   [
    "processual_civil",
    "Lei nº 10.436/2002"
   ],
   [
    "processual_civil",
    "Lei nº 10.708/2003"
   ],
   [
    "processual_civil",
    "Lei nº 11.417/2006"
   ],
   [
    "processual_civil",
    "Lei nº 11.418/2006"
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
    "Lei nº 12.153/2009"
   ],
   [
    "processual_civil",
    "Lei nº 12.732/2012"
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
    "Lei nº 13.812/2019"
   ],
   [
    "processual_civil",
    "Lei nº 14.238/2021"
   ],
   [
    "processual_civil",
    "Lei nº 14.341/2022"
   ],
   [
    "processual_civil",
    "Lei nº 14.821/2024"
   ],
   [
    "processual_civil",
    "Lei nº 15.224/2025"
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
    "Lei nº 7.661/1988"
   ],
   [
    "processual_civil",
    "Lei nº 8.437/1992"
   ],
   [
    "processual_civil",
    "Lei nº 9.008/1995"
   ],
   [
    "processual_civil",
    "Lei nº 9.099/1995"
   ],
   [
    "processual_civil",
    "Lei nº 9.494/1997"
   ],
   [
    "processual_civil",
    "Lei nº 9.507/1997"
   ],
   [
    "processual_penal",
    "Decreto-Lei nº 1.002/1969"
   ],
   [
    "processual_penal",
    "Decreto-Lei nº 201/1967"
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
    "Lei nº 10.446/2002"
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
    "Lei nº 12.313/2010"
   ],
   [
    "processual_penal",
    "Lei nº 12.830/2013"
   ],
   [
    "processual_penal",
    "Lei nº 12.850/2013"
   ],
   [
    "processual_penal",
    "Lei nº 13.431/2017"
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
    "tributario",
    "Lei Complementar (SC) nº 465/2009"
   ],
   [
    "tributario",
    "Lei Complementar nº 101/2000"
   ],
   [
    "tributario",
    "Lei Estadual (SC) nº 10.297/1996"
   ],
   [
    "tributario",
    "Lei Estadual (SC) nº 13.136/2004"
   ],
   [
    "tributario",
    "Lei Estadual (SC) nº 3.938/1966"
   ],
   [
    "tributario",
    "Lei nº 5.172/1966"
   ]
  ],
  "tipo": "edital"
 },
 {
  "id": "pge-es-1-2025",
  "sigla": "PGE-ES",
  "cargo": "Procurador do Estado de 1ª Categoria",
  "orgao": "Procuradoria-Geral do Estado do Espírito Santo",
  "titulo": "Concurso Público para Procurador do Estado do Espírito Santo — 1ª Categoria",
  "edital": "Edital nº 1 – PGE/ES – Procurador, de 28 de agosto de 2025",
  "grupos": [
   {
    "nome": "Bloco I",
    "disciplinas": [
     "Direito Constitucional",
     "Direito Administrativo",
     "Direito Tributário",
     "Direito Financeiro"
    ]
   },
   {
    "nome": "Bloco II",
    "disciplinas": [
     "Direito Civil",
     "Direito Processual Civil",
     "Direito Previdenciário"
    ]
   },
   {
    "nome": "Bloco III",
    "disciplinas": [
     "Direito do Trabalho",
     "Direito Processual do Trabalho",
     "Direito Ambiental"
    ]
   }
  ],
  "leis": [
   [
    "administrativo",
    "Decreto nº 1.171/1994"
   ],
   [
    "administrativo",
    "Decreto nº 6.017/2007"
   ],
   [
    "administrativo",
    "Decreto nº 6.170/2007"
   ],
   [
    "administrativo",
    "Decreto nº 7.174/2010"
   ],
   [
    "administrativo",
    "Decreto nº 7.724/2012"
   ],
   [
    "administrativo",
    "Decreto-Lei nº 3.365/1941"
   ],
   [
    "administrativo",
    "Lei Complementar (DF) nº 840/2011"
   ],
   [
    "administrativo",
    "Lei Complementar (MT) nº 04/1990"
   ],
   [
    "administrativo",
    "Lei Complementar (SC) nº 491/2010"
   ],
   [
    "administrativo",
    "Lei Complementar (SE) nº 33/1996"
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
    "Lei Complementar nº 73/1993"
   ],
   [
    "administrativo",
    "Lei Complementar nº 75/1993"
   ],
   [
    "administrativo",
    "Lei Complementar nº 80/1994"
   ],
   [
    "administrativo",
    "Lei Estadual (BA) nº 11.370/2009"
   ],
   [
    "administrativo",
    "Lei Estadual (BA) nº 6.677/1994"
   ],
   [
    "administrativo",
    "Lei Estadual (MA) nº 6.107/1994"
   ],
   [
    "administrativo",
    "Lei Estadual (MS) nº 1.102/1990"
   ],
   [
    "administrativo",
    "Lei Estadual (PA) nº 5.810/1994"
   ],
   [
    "administrativo",
    "Lei Estadual (SC) nº 12.929/2004"
   ],
   [
    "administrativo",
    "Lei Estadual (SP) nº 10.177/1998"
   ],
   [
    "administrativo",
    "Lei nº 11.079/2004"
   ],
   [
    "administrativo",
    "Lei nº 12.527/2011"
   ],
   [
    "administrativo",
    "Lei nº 12.813/2013"
   ],
   [
    "administrativo",
    "Lei nº 12.846/2013"
   ],
   [
    "administrativo",
    "Lei nº 13.019/2014"
   ],
   [
    "administrativo",
    "Lei nº 13.303/2016"
   ],
   [
    "administrativo",
    "Lei nº 13.460/2017"
   ],
   [
    "administrativo",
    "Lei nº 13.848/2019"
   ],
   [
    "administrativo",
    "Lei nº 13.954/2019"
   ],
   [
    "administrativo",
    "Lei nº 14.133/2021"
   ],
   [
    "administrativo",
    "Lei nº 14.230/2021"
   ],
   [
    "administrativo",
    "Lei nº 15.047/2024"
   ],
   [
    "administrativo",
    "Lei nº 4.132/1962"
   ],
   [
    "administrativo",
    "Lei nº 4.320/1964"
   ],
   [
    "administrativo",
    "Lei nº 4.878/1965"
   ],
   [
    "administrativo",
    "Lei nº 8.112/1990"
   ],
   [
    "administrativo",
    "Lei nº 8.429/1992"
   ],
   [
    "administrativo",
    "Lei nº 8.625/1993"
   ],
   [
    "administrativo",
    "Lei nº 8.666/1993"
   ],
   [
    "administrativo",
    "Lei nº 8.987/1995"
   ],
   [
    "administrativo",
    "Lei nº 9.469/1997"
   ],
   [
    "administrativo",
    "Lei nº 9.636/1998"
   ],
   [
    "administrativo",
    "Lei nº 9.637/1998"
   ],
   [
    "administrativo",
    "Lei nº 9.784/1999"
   ],
   [
    "administrativo",
    "Lei nº 9.790/1999"
   ],
   [
    "administrativo",
    "Lei nº 9.873/1999"
   ],
   [
    "administrativo",
    "Lei nº 9.962/2000"
   ],
   [
    "ambiental",
    "Decreto nº 10.936/2022"
   ],
   [
    "ambiental",
    "Decreto nº 6.514/2008"
   ],
   [
    "ambiental",
    "Decreto nº 7.217/2010"
   ],
   [
    "ambiental",
    "Decreto nº 99.274/1990"
   ],
   [
    "ambiental",
    "Lei Complementar nº 140/2011"
   ],
   [
    "ambiental",
    "Lei Estadual (PA) nº 5.629/1990"
   ],
   [
    "ambiental",
    "Lei Estadual (RS) nº 10.350/1994"
   ],
   [
    "ambiental",
    "Lei nº 10.257/2001"
   ],
   [
    "ambiental",
    "Lei nº 11.107/2005"
   ],
   [
    "ambiental",
    "Lei nº 11.124/2005"
   ],
   [
    "ambiental",
    "Lei nº 11.284/2006"
   ],
   [
    "ambiental",
    "Lei nº 11.445/2007"
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
    "Lei nº 12.334/2010"
   ],
   [
    "ambiental",
    "Lei nº 12.587/2012"
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
    "Lei nº 13.465/2017"
   ],
   [
    "ambiental",
    "Lei nº 14.026/2020"
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
    "Lei nº 6.938/1981"
   ],
   [
    "ambiental",
    "Lei nº 9.433/1997"
   ],
   [
    "ambiental",
    "Lei nº 9.478/1997"
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
    "Medida Provisória nº 1.308/2025"
   ],
   [
    "civil",
    "Decreto nº 20.910/1932"
   ],
   [
    "civil",
    "Decreto-Lei nº 4.657/1942"
   ],
   [
    "civil",
    "Decreto-Lei nº 911/1969"
   ],
   [
    "civil",
    "Lei Estadual (SC) nº 17.492/2018"
   ],
   [
    "civil",
    "Lei nº 10.267/2001"
   ],
   [
    "civil",
    "Lei nº 10.741/2003"
   ],
   [
    "civil",
    "Lei nº 12.376/2010"
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
    "Lei nº 14.711/2023"
   ],
   [
    "civil",
    "Lei nº 6.015/1973"
   ],
   [
    "civil",
    "Lei nº 6.766/1979"
   ],
   [
    "civil",
    "Lei nº 8.245/1991"
   ],
   [
    "civil",
    "Lei nº 8.935/1994"
   ],
   [
    "civil",
    "Lei nº 9.278/1996"
   ],
   [
    "civil",
    "Lei nº 9.610/1998"
   ],
   [
    "constitucional",
    "CF/1988"
   ],
   [
    "constitucional",
    "Constituição Estadual (MG)"
   ],
   [
    "constitucional",
    "Emenda Constitucional nº 45/2004"
   ],
   [
    "constitucional",
    "Emenda Constitucional nº 80/2014"
   ],
   [
    "constitucional",
    "Lei nº 12.562/2011"
   ],
   [
    "constitucional",
    "Lei nº 13.300/2016"
   ],
   [
    "constitucional",
    "Lei nº 9.882/1999"
   ],
   [
    "crianca",
    "Lei nº 8.069/1990"
   ],
   [
    "empresarial",
    "Lei Complementar nº 123/2006"
   ],
   [
    "empresarial",
    "Lei nº 12.529/2011"
   ],
   [
    "humanos",
    "Lei nº 12.288/2010"
   ],
   [
    "penal",
    "Lei nº 8.137/1990"
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
    "previdenciario",
    "Decreto nº 3.048/1999"
   ],
   [
    "previdenciario",
    "Emenda Constitucional nº 103/2019"
   ],
   [
    "previdenciario",
    "Lei Complementar (MT) nº 670/2020"
   ],
   [
    "previdenciario",
    "Lei Complementar nº 108/2001"
   ],
   [
    "previdenciario",
    "Lei Complementar nº 109/2001"
   ],
   [
    "previdenciario",
    "Lei nº 12.618/2012"
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
    "Lei nº 9.717/1998"
   ],
   [
    "processual_civil",
    "Lei nº 10.259/2001"
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
    "Lei nº 12.153/2009"
   ],
   [
    "processual_civil",
    "Lei nº 13.105/2015"
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
    "Lei nº 9.099/1995"
   ],
   [
    "processual_civil",
    "Lei nº 9.494/1997"
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
    "trabalhista",
    "Lei nº 10.035/2000"
   ],
   [
    "tributario",
    "Decreto Estadual (MG) nº 44.747/2008"
   ],
   [
    "tributario",
    "Decreto nº 70.235/1972"
   ],
   [
    "tributario",
    "Lei Complementar nº 101/2000"
   ],
   [
    "tributario",
    "Lei Complementar nº 116/2003"
   ],
   [
    "tributario",
    "Lei Complementar nº 118/2005"
   ],
   [
    "tributario",
    "Lei Estadual (PR) nº 18.877/2016"
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
    "Lei nº 6.830/1980"
   ],
   [
    "tributario",
    "Lei nº 8.397/1992"
   ]
  ],
  "tipo": "edital"
 },
 {
  "id": "pge-mg-1-2022",
  "sigla": "PGE-MG",
  "cargo": "Procurador do Estado Nível I, Grau \"A\"",
  "orgao": "Advocacia-Geral do Estado de Minas Gerais",
  "titulo": "Concurso Público para Procurador do Estado de Minas Gerais — Nível I",
  "edital": "Edital 01/2022 — AGE/MG",
  "grupos": [
   {
    "nome": "Bloco I",
    "disciplinas": [
     "Direito Constitucional",
     "Direito Administrativo",
     "Direito Tributário",
     "Direito Financeiro"
    ]
   },
   {
    "nome": "Bloco II",
    "disciplinas": [
     "Direito Civil",
     "Direito Processual Civil",
     "Direito Empresarial"
    ]
   },
   {
    "nome": "Bloco III",
    "disciplinas": [
     "Direito do Trabalho",
     "Direito Previdenciário",
     "Direito Ambiental",
     "Direito Penal",
     "Direito Processual Penal"
    ]
   }
  ],
  "leis": [
   [
    "administrativo",
    "Decreto nº 7.174/2010"
   ],
   [
    "administrativo",
    "Decreto nº 7.724/2012"
   ],
   [
    "administrativo",
    "Decreto nº 7.746/2012"
   ],
   [
    "administrativo",
    "Decreto-Lei nº 200/1967"
   ],
   [
    "administrativo",
    "Decreto-Lei nº 3.365/1941"
   ],
   [
    "administrativo",
    "Decreto-Lei nº 4.597/1942"
   ],
   [
    "administrativo",
    "Lei Complementar (SC) nº 491/2010"
   ],
   [
    "administrativo",
    "Lei Complementar (SE) nº 33/1996"
   ],
   [
    "administrativo",
    "Lei Complementar nº 101/2000"
   ],
   [
    "administrativo",
    "Lei Complementar nº 76/1993"
   ],
   [
    "administrativo",
    "Lei Estadual (BA) nº 11.357/2009"
   ],
   [
    "administrativo",
    "Lei Estadual (BA) nº 11.370/2009"
   ],
   [
    "administrativo",
    "Lei Estadual (SC) nº 12.929/2004"
   ],
   [
    "administrativo",
    "Lei Estadual (SP) nº 10.177/1998"
   ],
   [
    "administrativo",
    "Lei nº 11.079/2004"
   ],
   [
    "administrativo",
    "Lei nº 12.232/2010"
   ],
   [
    "administrativo",
    "Lei nº 12.462/2011"
   ],
   [
    "administrativo",
    "Lei nº 12.527/2011"
   ],
   [
    "administrativo",
    "Lei nº 13.460/2017"
   ],
   [
    "administrativo",
    "Lei nº 13.848/2019"
   ],
   [
    "administrativo",
    "Lei nº 14.133/2021"
   ],
   [
    "administrativo",
    "Lei nº 14.230/2021"
   ],
   [
    "administrativo",
    "Lei nº 15.047/2024"
   ],
   [
    "administrativo",
    "Lei nº 4.132/1962"
   ],
   [
    "administrativo",
    "Lei nº 8.112/1990"
   ],
   [
    "administrativo",
    "Lei nº 8.429/1992"
   ],
   [
    "administrativo",
    "Lei nº 8.906/1994"
   ],
   [
    "administrativo",
    "Lei nº 8.987/1995"
   ],
   [
    "administrativo",
    "Lei nº 9.637/1998"
   ],
   [
    "administrativo",
    "Lei nº 9.784/1999"
   ],
   [
    "administrativo",
    "Lei nº 9.790/1999"
   ],
   [
    "administrativo",
    "Lei nº 9.873/1999"
   ],
   [
    "administrativo",
    "Lei nº 9.962/2000"
   ],
   [
    "administrativo",
    "Lei nº 9.986/2000"
   ],
   [
    "ambiental",
    "Decreto nº 10.936/2022"
   ],
   [
    "ambiental",
    "Decreto nº 99.274/1990"
   ],
   [
    "ambiental",
    "Lei Estadual (RS) nº 10.350/1994"
   ],
   [
    "ambiental",
    "Lei Estadual (RS) nº 15.434/2020"
   ],
   [
    "ambiental",
    "Lei Estadual (SC) nº 14.675/2009"
   ],
   [
    "ambiental",
    "Lei Estadual (SC) nº 16.342/2014"
   ],
   [
    "ambiental",
    "Lei nº 10.257/2001"
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
    "Lei nº 12.334/2010"
   ],
   [
    "ambiental",
    "Lei nº 12.587/2012"
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
    "Lei nº 15.228/2025"
   ],
   [
    "ambiental",
    "Lei nº 6.938/1981"
   ],
   [
    "ambiental",
    "Lei nº 9.433/1997"
   ],
   [
    "ambiental",
    "Lei nº 9.478/1997"
   ],
   [
    "ambiental",
    "Lei nº 9.795/1999"
   ],
   [
    "ambiental",
    "Lei nº 9.985/2000"
   ],
   [
    "civil",
    "Decreto nº 20.910/1932"
   ],
   [
    "civil",
    "Decreto-Lei nº 4.657/1942"
   ],
   [
    "civil",
    "Decreto-Lei nº 911/1969"
   ],
   [
    "civil",
    "Lei nº 10.406/2002"
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
    "Lei nº 14.905/2024"
   ],
   [
    "civil",
    "Lei nº 4.380/1964"
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
    "civil",
    "Lei nº 9.492/1997"
   ],
   [
    "civil",
    "Resolução CNJ nº 452/2022"
   ],
   [
    "constitucional",
    "CF/1988"
   ],
   [
    "constitucional",
    "Constituição Estadual (MG)"
   ],
   [
    "constitucional",
    "Emenda Constitucional nº 80/2014"
   ],
   [
    "constitucional",
    "Lei nº 13.300/2016"
   ],
   [
    "constitucional",
    "Lei nº 14.735/2023"
   ],
   [
    "constitucional",
    "Lei nº 9.868/1999"
   ],
   [
    "constitucional",
    "Lei nº 9.882/1999"
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
    "empresarial",
    "Decreto nº 2.044/1908"
   ],
   [
    "empresarial",
    "Decreto-Lei nº 167/1967"
   ],
   [
    "empresarial",
    "Lei nº 11.101/2005"
   ],
   [
    "empresarial",
    "Lei nº 14.112/2020"
   ],
   [
    "empresarial",
    "Lei nº 14.193/2021"
   ],
   [
    "empresarial",
    "Lei nº 6.024/1974"
   ],
   [
    "empresarial",
    "Lei nº 6.404/1976"
   ],
   [
    "empresarial",
    "Lei nº 6.840/1980"
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
    "humanos",
    "Lei nº 7.853/1989"
   ],
   [
    "penal",
    "Decreto-Lei nº 1.001/1969"
   ],
   [
    "penal",
    "Decreto-Lei nº 2.848/1940"
   ],
   [
    "penal",
    "Decreto-Lei nº 3.914/1941"
   ],
   [
    "penal",
    "Lei nº 1.521/1951"
   ],
   [
    "penal",
    "Lei nº 13.869/2019"
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
    "Lei nº 9.020/1995"
   ],
   [
    "penal",
    "Lei nº 9.029/1995"
   ],
   [
    "penal",
    "Lei nº 9.430/1996"
   ],
   [
    "penal",
    "Lei nº 9.605/1998"
   ],
   [
    "previdenciario",
    "Decreto nº 3.048/1999"
   ],
   [
    "previdenciario",
    "Emenda Constitucional nº 3/1993"
   ],
   [
    "previdenciario",
    "Lei Complementar (MT) nº 670/2020"
   ],
   [
    "previdenciario",
    "Lei Complementar nº 108/2001"
   ],
   [
    "previdenciario",
    "Lei Complementar nº 109/2001"
   ],
   [
    "previdenciario",
    "Lei Complementar nº 142/2013"
   ],
   [
    "previdenciario",
    "Lei nº 10.887/2004"
   ],
   [
    "previdenciario",
    "Lei nº 12.618/2012"
   ],
   [
    "previdenciario",
    "Lei nº 13.876/2019"
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
    "Lei nº 9.717/1998"
   ],
   [
    "previdenciario",
    "Lei nº 9.796/1999"
   ],
   [
    "processual_civil",
    "Lei Complementar (MG) nº 59/2001"
   ],
   [
    "processual_civil",
    "Lei Complementar (SC) nº 339/2006"
   ],
   [
    "processual_civil",
    "Lei nº 10.259/2001"
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
    "Lei nº 12.153/2009"
   ],
   [
    "processual_civil",
    "Lei nº 13.105/2015"
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
    "Lei nº 8.038/1990"
   ],
   [
    "processual_civil",
    "Lei nº 8.437/1992"
   ],
   [
    "processual_civil",
    "Lei nº 9.099/1995"
   ],
   [
    "processual_civil",
    "Lei nº 9.494/1997"
   ],
   [
    "processual_civil",
    "Lei nº 9.507/1997"
   ],
   [
    "processual_penal",
    "Decreto-Lei nº 1.002/1969"
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
    "Lei nº 11.101/2005"
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
    "trabalhista",
    "Decreto nº 9.507/2018"
   ],
   [
    "trabalhista",
    "Lei nº 10.035/2000"
   ],
   [
    "tributario",
    "Decreto Estadual (MG) nº 44.747/2008"
   ],
   [
    "tributario",
    "Decreto nº 6.022/2007"
   ],
   [
    "tributario",
    "Decreto nº 70.235/1972"
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
    "Lei Complementar nº 116/2003"
   ],
   [
    "tributario",
    "Lei Complementar nº 118/2005"
   ],
   [
    "tributario",
    "Lei Complementar nº 159/2017"
   ],
   [
    "tributario",
    "Lei Complementar nº 199/2023"
   ],
   [
    "tributario",
    "Lei Complementar nº 200/2023"
   ],
   [
    "tributario",
    "Lei Estadual (MG) nº 6.763/1975"
   ],
   [
    "tributario",
    "Lei Estadual (PR) nº 11.580/1996"
   ],
   [
    "tributario",
    "Lei Estadual (PR) nº 18.877/2016"
   ],
   [
    "tributario",
    "Lei Estadual (SC) nº 13.136/2004"
   ],
   [
    "tributario",
    "Lei Estadual (SC) nº 3.938/1966"
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
    "Lei nº 6.830/1980"
   ]
  ],
  "tipo": "edital"
 },
 {
  "id": "pge-to-1-2025",
  "sigla": "PGE-TO",
  "cargo": "Procurador do Estado — Nível I",
  "orgao": "Procuradoria-Geral do Estado do Tocantins",
  "titulo": "IV Concurso Público para Procurador do Estado do Tocantins",
  "edital": "Edital nº 01/2025 de Abertura de Inscrições — PGE/TO",
  "grupos": [
   {
    "nome": "Bloco I",
    "disciplinas": [
     "Direito Constitucional",
     "Direito Administrativo",
     "Direito Tributário",
     "Direito Financeiro"
    ]
   },
   {
    "nome": "Bloco II",
    "disciplinas": [
     "Direito Civil",
     "Direito Empresarial",
     "Direito Agrário",
     "Direito Processual Civil",
     "Direito Ambiental"
    ]
   },
   {
    "nome": "Bloco III",
    "disciplinas": [
     "Direito Previdenciário",
     "Direito do Trabalho",
     "Direito Coletivo do Trabalho",
     "Direito Processual do Trabalho"
    ]
   }
  ],
  "leis": [
   [
    "administrativo",
    "Decreto nº 1.171/1994"
   ],
   [
    "administrativo",
    "Decreto nº 10.201/2020"
   ],
   [
    "administrativo",
    "Decreto nº 10.592/2020"
   ],
   [
    "administrativo",
    "Decreto nº 6.017/2007"
   ],
   [
    "administrativo",
    "Decreto nº 6.029/2007"
   ],
   [
    "administrativo",
    "Decreto nº 6.170/2007"
   ],
   [
    "administrativo",
    "Decreto nº 7.174/2010"
   ],
   [
    "administrativo",
    "Decreto nº 7.724/2012"
   ],
   [
    "administrativo",
    "Decreto-Lei nº 200/1967"
   ],
   [
    "administrativo",
    "Decreto-Lei nº 3.365/1941"
   ],
   [
    "administrativo",
    "Decreto-Lei nº 4.597/1942"
   ],
   [
    "administrativo",
    "Lei Complementar (DF) nº 840/2011"
   ],
   [
    "administrativo",
    "Lei Complementar (MT) nº 04/1990"
   ],
   [
    "administrativo",
    "Lei Complementar (RS) nº 16.263/2024"
   ],
   [
    "administrativo",
    "Lei Complementar (SC) nº 491/2010"
   ],
   [
    "administrativo",
    "Lei Complementar (SE) nº 33/1996"
   ],
   [
    "administrativo",
    "Lei Complementar nº 101/2000"
   ],
   [
    "administrativo",
    "Lei Complementar nº 76/1993"
   ],
   [
    "administrativo",
    "Lei Estadual (BA) nº 11.357/2009"
   ],
   [
    "administrativo",
    "Lei Estadual (BA) nº 11.370/2009"
   ],
   [
    "administrativo",
    "Lei Estadual (BA) nº 6.677/1994"
   ],
   [
    "administrativo",
    "Lei Estadual (MA) nº 6.107/1994"
   ],
   [
    "administrativo",
    "Lei Estadual (MS) nº 1.102/1990"
   ],
   [
    "administrativo",
    "Lei Estadual (PA) nº 5.810/1994"
   ],
   [
    "administrativo",
    "Lei Estadual (SC) nº 12.929/2004"
   ],
   [
    "administrativo",
    "Lei Estadual (SP) nº 10.177/1998"
   ],
   [
    "administrativo",
    "Lei Estadual (TO) nº 1.818/2007"
   ],
   [
    "administrativo",
    "Lei Estadual (TO) nº 2.578/2012"
   ],
   [
    "administrativo",
    "Lei nº 11.079/2004"
   ],
   [
    "administrativo",
    "Lei nº 12.232/2010"
   ],
   [
    "administrativo",
    "Lei nº 12.462/2011"
   ],
   [
    "administrativo",
    "Lei nº 12.527/2011"
   ],
   [
    "administrativo",
    "Lei nº 12.783/2013"
   ],
   [
    "administrativo",
    "Lei nº 12.813/2013"
   ],
   [
    "administrativo",
    "Lei nº 12.846/2013"
   ],
   [
    "administrativo",
    "Lei nº 13.019/2014"
   ],
   [
    "administrativo",
    "Lei nº 13.243/2016"
   ],
   [
    "administrativo",
    "Lei nº 13.303/2016"
   ],
   [
    "administrativo",
    "Lei nº 13.448/2017"
   ],
   [
    "administrativo",
    "Lei nº 13.460/2017"
   ],
   [
    "administrativo",
    "Lei nº 13.848/2019"
   ],
   [
    "administrativo",
    "Lei nº 14.133/2021"
   ],
   [
    "administrativo",
    "Lei nº 14.230/2021"
   ],
   [
    "administrativo",
    "Lei nº 14.967/2024"
   ],
   [
    "administrativo",
    "Lei nº 15.047/2024"
   ],
   [
    "administrativo",
    "Lei nº 4.320/1964"
   ],
   [
    "administrativo",
    "Lei nº 4.504/1964"
   ],
   [
    "administrativo",
    "Lei nº 4.878/1965"
   ],
   [
    "administrativo",
    "Lei nº 6.969/1981"
   ],
   [
    "administrativo",
    "Lei nº 8.112/1990"
   ],
   [
    "administrativo",
    "Lei nº 8.429/1992"
   ],
   [
    "administrativo",
    "Lei nº 8.666/1993"
   ],
   [
    "administrativo",
    "Lei nº 8.745/1993"
   ],
   [
    "administrativo",
    "Lei nº 8.987/1995"
   ],
   [
    "administrativo",
    "Lei nº 9.469/1997"
   ],
   [
    "administrativo",
    "Lei nº 9.636/1998"
   ],
   [
    "administrativo",
    "Lei nº 9.637/1998"
   ],
   [
    "administrativo",
    "Lei nº 9.784/1999"
   ],
   [
    "administrativo",
    "Lei nº 9.790/1999"
   ],
   [
    "administrativo",
    "Lei nº 9.873/1999"
   ],
   [
    "administrativo",
    "Lei nº 9.962/2000"
   ],
   [
    "administrativo",
    "Lei nº 9.986/2000"
   ],
   [
    "ambiental",
    "Decreto nº 10.936/2022"
   ],
   [
    "ambiental",
    "Decreto nº 6.514/2008"
   ],
   [
    "ambiental",
    "Decreto nº 7.217/2010"
   ],
   [
    "ambiental",
    "Decreto nº 99.274/1990"
   ],
   [
    "ambiental",
    "Lei Complementar nº 140/2011"
   ],
   [
    "ambiental",
    "Lei Estadual (PA) nº 4.884/1979"
   ],
   [
    "ambiental",
    "Lei Estadual (PA) nº 5.295/1985"
   ],
   [
    "ambiental",
    "Lei Estadual (PA) nº 6.376/2001"
   ],
   [
    "ambiental",
    "Lei Estadual (PA) nº 7.031/2007"
   ],
   [
    "ambiental",
    "Lei Estadual (PA) nº 8.878/2019"
   ],
   [
    "ambiental",
    "Lei Estadual (PA) nº 9.048/2020"
   ],
   [
    "ambiental",
    "Lei Estadual (RS) nº 10.350/1994"
   ],
   [
    "ambiental",
    "Lei Estadual (RS) nº 15.434/2020"
   ],
   [
    "ambiental",
    "Lei Estadual (SC) nº 14.675/2009"
   ],
   [
    "ambiental",
    "Lei Estadual (SC) nº 16.342/2014"
   ],
   [
    "ambiental",
    "Lei Estadual (TO) nº 1.307/2002"
   ],
   [
    "ambiental",
    "Lei Estadual (TO) nº 1.560/2005"
   ],
   [
    "ambiental",
    "Lei Estadual (TO) nº 1.917/2008"
   ],
   [
    "ambiental",
    "Lei Estadual (TO) nº 3.530/2019"
   ],
   [
    "ambiental",
    "Lei Estadual (TO) nº 3.614/2019"
   ],
   [
    "ambiental",
    "Lei Estadual (TO) nº 3.804/2021"
   ],
   [
    "ambiental",
    "Lei Estadual (TO) nº 771/1995"
   ],
   [
    "ambiental",
    "Lei nº 11.445/2007"
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
    "Lei nº 12.334/2010"
   ],
   [
    "ambiental",
    "Lei nº 12.587/2012"
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
    "Lei nº 13.465/2017"
   ],
   [
    "ambiental",
    "Lei nº 14.026/2020"
   ],
   [
    "ambiental",
    "Lei nº 14.755/2023"
   ],
   [
    "ambiental",
    "Lei nº 14.904/2024"
   ],
   [
    "ambiental",
    "Lei nº 15.190/2025"
   ],
   [
    "ambiental",
    "Lei nº 15.228/2025"
   ],
   [
    "ambiental",
    "Lei nº 6.938/1981"
   ],
   [
    "ambiental",
    "Lei nº 9.433/1997"
   ],
   [
    "ambiental",
    "Lei nº 9.478/1997"
   ],
   [
    "ambiental",
    "Lei nº 9.795/1999"
   ],
   [
    "ambiental",
    "Lei nº 9.985/2000"
   ],
   [
    "civil",
    "Decreto nº 20.910/1932"
   ],
   [
    "civil",
    "Decreto-Lei nº 4.657/1942"
   ],
   [
    "civil",
    "Decreto-Lei nº 911/1969"
   ],
   [
    "civil",
    "Lei nº 10.406/2002"
   ],
   [
    "civil",
    "Lei nº 10.931/2004"
   ],
   [
    "civil",
    "Lei nº 11.076/2004"
   ],
   [
    "civil",
    "Lei nº 12.376/2010"
   ],
   [
    "civil",
    "Lei nº 13.709/2018"
   ],
   [
    "civil",
    "Lei nº 13.726/2018"
   ],
   [
    "civil",
    "Lei nº 13.786/2018"
   ],
   [
    "civil",
    "Lei nº 13.874/2019"
   ],
   [
    "civil",
    "Lei nº 6.015/1973"
   ],
   [
    "civil",
    "Lei nº 6.766/1979"
   ],
   [
    "civil",
    "Lei nº 8.245/1991"
   ],
   [
    "civil",
    "Lei nº 8.935/1994"
   ],
   [
    "civil",
    "Lei nº 9.278/1996"
   ],
   [
    "civil",
    "Lei nº 9.514/1997"
   ],
   [
    "constitucional",
    "CF/1988"
   ],
   [
    "constitucional",
    "Constituição Estadual (MG)"
   ],
   [
    "constitucional",
    "Emenda Constitucional nº 45/2004"
   ],
   [
    "constitucional",
    "Emenda Constitucional nº 80/2014"
   ],
   [
    "constitucional",
    "Lei Estadual (PA) nº 5.008/1981"
   ],
   [
    "constitucional",
    "Lei Estadual (SC) nº 12.069/2001"
   ],
   [
    "constitucional",
    "Lei nº 13.300/2016"
   ],
   [
    "constitucional",
    "Lei nº 14.735/2023"
   ],
   [
    "constitucional",
    "Lei nº 9.882/1999"
   ],
   [
    "penal",
    "Lei nº 8.137/1990"
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
    "previdenciario",
    "Decreto nº 3.048/1999"
   ],
   [
    "previdenciario",
    "Emenda Constitucional nº 103/2019"
   ],
   [
    "previdenciario",
    "Lei Complementar (MT) nº 670/2020"
   ],
   [
    "previdenciario",
    "Lei Complementar nº 108/2001"
   ],
   [
    "previdenciario",
    "Lei Complementar nº 109/2001"
   ],
   [
    "previdenciario",
    "Lei Estadual (TO) nº 4.129/2023"
   ],
   [
    "previdenciario",
    "Lei nº 13.876/2019"
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
    "processual_civil",
    "Emenda Constitucional nº 125/2022"
   ],
   [
    "processual_civil",
    "Lei Complementar (MG) nº 59/2001"
   ],
   [
    "processual_civil",
    "Lei Complementar (SC) nº 339/2006"
   ],
   [
    "processual_civil",
    "Lei nº 10.259/2001"
   ],
   [
    "processual_civil",
    "Lei nº 11.419/2006"
   ],
   [
    "processual_civil",
    "Lei nº 11.672/2008"
   ],
   [
    "processual_civil",
    "Lei nº 12.016/2009"
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
    "processual_civil",
    "Lei nº 13.655/2018"
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
    "Lei nº 8.038/1990"
   ],
   [
    "processual_civil",
    "Lei nº 8.437/1992"
   ],
   [
    "processual_civil",
    "Lei nº 9.008/1995"
   ],
   [
    "processual_civil",
    "Lei nº 9.099/1995"
   ],
   [
    "processual_civil",
    "Lei nº 9.494/1997"
   ],
   [
    "processual_civil",
    "Lei nº 9.507/1997"
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
    "trabalhista",
    "Lei nº 10.035/2000"
   ],
   [
    "trabalhista",
    "Lei nº 13.467/2017"
   ],
   [
    "tributario",
    "Decreto Estadual (MG) nº 44.747/2008"
   ],
   [
    "tributario",
    "Decreto nº 70.235/1972"
   ],
   [
    "tributario",
    "Emenda Constitucional nº 108/2020"
   ],
   [
    "tributario",
    "Emenda Constitucional nº 109/2021"
   ],
   [
    "tributario",
    "Emenda Constitucional nº 113/2021"
   ],
   [
    "tributario",
    "Emenda Constitucional nº 126/2022"
   ],
   [
    "tributario",
    "Emenda Constitucional nº 127/2022"
   ],
   [
    "tributario",
    "Emenda Constitucional nº 132/2023"
   ],
   [
    "tributario",
    "Emenda Constitucional nº 68/2011"
   ],
   [
    "tributario",
    "Emenda Constitucional nº 86/2015"
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
    "Lei Complementar nº 118/2005"
   ],
   [
    "tributario",
    "Lei Complementar nº 159/2017"
   ],
   [
    "tributario",
    "Lei Complementar nº 200/2023"
   ],
   [
    "tributario",
    "Lei Estadual (PR) nº 18.877/2016"
   ],
   [
    "tributario",
    "Lei Estadual (SC) nº 3.938/1966"
   ],
   [
    "tributario",
    "Lei Estadual (TO) nº 1.287/2001"
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
    "Lei nº 6.830/1980"
   ],
   [
    "tributario",
    "Lei nº 8.397/1992"
   ]
  ],
  "tipo": "edital"
 }
];
