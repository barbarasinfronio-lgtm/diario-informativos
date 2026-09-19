/*
 * premios-data.js — CATÁLOGO DE PRÊMIOS DO ESTUDA MANA
 *
 * Tudo o que você pode querer editar nos prêmios está aqui: nomes, emojis,
 * metas (os números) e patentes. O cálculo fica em premios-logic.js.
 *
 * Como ler as escadas ("ladders"): cada linha é [meta, emoji, título].
 *   [50, "🦖", "Destruidor de Informativos"]
 * significa "ao chegar em 50, ganha o prêmio 🦖 Destruidor de Informativos".
 * Para criar um prêmio novo numa escada, é só acrescentar uma linha.
 * A raridade (bronze → diamante) é definida pela posição na escada:
 * as primeiras linhas são mais fáceis, as últimas mais raras.
 */
window.PREMIOS_CONFIG = {

  // Pontos que cada raridade vale, e como ela aparece na tela.
  tiers: {
    bronze:   { label: "Bronze",   pontos: 10,  medalha: "🥉" },
    prata:    { label: "Prata",    pontos: 25,  medalha: "🥈" },
    ouro:     { label: "Ouro",     pontos: 50,  medalha: "🥇" },
    platina:  { label: "Platina",  pontos: 100, medalha: "💠" },
    diamante: { label: "Diamante", pontos: 250, medalha: "💎" }
  },

  // Pontos ganhos a cada leitura (antes de qualquer prêmio).
  pontosPorLeitura: { inf: 1, lei: 2, sum: 1 },
  // Bônus para informativo lido logo depois de publicado.
  pontosBonusPontualidade: { ouro: 3, prata: 2, bronze: 1 },

  // Patentes (carreira). A pessoa sobe de patente conforme os pontos.
  // Cada patente tem a forma masculina, feminina e neutra do título.
  patentes: [
    { min: 0,     icon: "🎒", m: "Calouro",             f: "Caloura",             x: "Calouro(a)" },
    { min: 100,   icon: "📚", m: "Estudante",           f: "Estudante",           x: "Estudante" },
    { min: 300,   icon: "📎", m: "Estagiário",          f: "Estagiária",          x: "Estagiário(a)" },
    { min: 700,   icon: "💼", m: "Analista",            f: "Analista",            x: "Analista" },
    { min: 1500,  icon: "🗂️", m: "Assessor",            f: "Assessora",           x: "Assessor(a)" },
    { min: 3000,  icon: "⚖️", m: "Juiz Substituto",     f: "Juíza Substituta",    x: "Juiz(a) Substituto(a)" },
    { min: 6000,  icon: "🧑‍⚖️", m: "Juiz de Direito",     f: "Juíza de Direito",    x: "Juiz(a) de Direito" },
    { min: 10000, icon: "🏛️", m: "Desembargador",       f: "Desembargadora",      x: "Desembargador(a)" },
    { min: 16000, icon: "📜", m: "Ministro do STJ",     f: "Ministra do STJ",     x: "Ministro(a) do STJ" },
    { min: 25000, icon: "👑", m: "Ministro do STF",     f: "Ministra do STF",     x: "Ministro(a) do STF" }
  ],

  // Emoji de cada tribunal (informativos) e de cada matéria (leis).
  emojiOrg: { stf: "🏛️", stj: "📘", tse: "🗳️", cnj: "🧾", tst: "👷", cnmp: "🛡️" },
  emojiMateria: {
    civil: "🏠", processual_civil: "📑", consumidor: "🛒", crianca: "🧒",
    penal: "🔒", processual_penal: "🕵️", constitucional: "📜", eleitoral: "🗳️",
    empresarial: "🏢", tributario: "💰", ambiental: "🌳", administrativo: "🏛️",
    previdenciario: "👴", humanos: "🕊️"
  },

  // Nomes por faixa de cobertura (% lido de um tribunal / matéria).
  // Usados assim: "{nome} do STF", "{nome} de Direito Civil" etc.
  faixasCobertura: [
    { pct: 10,  nome: "Explorador" },
    { pct: 25,  nome: "Aprendiz" },
    { pct: 50,  nome: "Veterano" },
    { pct: 75,  nome: "Mestre" },
    { pct: 100, nome: "Lenda" }
  ],

  /* ------------------------------------------------------------------
     ESCADAS. Cada uma vira uma sequência de prêmios.
     ------------------------------------------------------------------ */
  escadas: {

    // ---- Pontualidade dos informativos (individual) ----
    pontualOuro: [   // lido NO DIA da publicação
      [1,   "🏆", "Troféu de Estreia"],
      [5,   "⏰", "Pontual"],
      [10,  "⌚", "Relógio Suíço"],
      [25,  "🎯", "Na Mosca"],
      [50,  "🚀", "Velocista da Jurisprudência"],
      [100, "⚡", "Raio Jurisprudencial"],
      [250, "👑", "Rei da Pontualidade"]
    ],
    pontualPrata: [  // lido no DIA SEGUINTE
      [1,  "🥈", "Troféu de Prata"],
      [10, "🦉", "Coruja Atenta"],
      [25, "🌙", "Leitor Noturno"],
      [50, "🧭", "Navegador da Manhã Seguinte"]
    ],
    pontualBronze: [ // lido 2 DIAS depois
      [1,  "🥉", "Troféu de Bronze"],
      [10, "🐢", "Passo Firme"],
      [25, "🕰️", "Sem Pressa, Sem Falta"],
      [50, "🧗", "Escalador de Ementas"]
    ],
    naSemana: [      // lido em até 6 dias
      [10,  "🎖️", "Em Dia com a Semana"],
      [25,  "📅", "Semana Cumprida"],
      [50,  "🗓️", "Agenda Impecável"],
      [100, "🧠", "Rotina de Ferro"]
    ],

    // ---- Semanas perfeitas (todos os informativos novos da semana) ----
    semanaOuro: [    // todos lidos no dia em que saíram
      [1,  "🏆", "Semana Dourada"],
      [3,  "🌟", "Trio Dourado"],
      [5,  "🖐️", "Mão Cheia de Ouro"],
      [10, "🔟", "Dezena Dourada"],
      [25, "🪙", "Ouro Puro"],
      [52, "🏅", "Ano Dourado"]
    ],
    semanaPrata: [   // todos lidos em até 1 dia
      [1,  "🥈", "Semana de Prata"],
      [5,  "✨", "Brilho Prateado"],
      [10, "🌕", "Lua Cheia de Prata"],
      [25, "🪞", "Espelho de Prata"]
    ],
    semanaBronze: [  // todos lidos em até 2 dias
      [1,  "🥉", "Semana de Bronze"],
      [5,  "🔔", "Sino de Bronze"],
      [10, "🛡️", "Escudo de Bronze"],
      [25, "🗿", "Estátua de Bronze"]
    ],
    semanaEmDia: [   // todos lidos dentro da mesma semana
      [1,  "🎖️", "Semana em Dia"],
      [5,  "📌", "Cinco Semanas em Dia"],
      [10, "📈", "Consistência"],
      [25, "🧱", "Muralha de Constância"],
      [52, "🎓", "Ano Letivo Completo"]
    ],
    pontualPorOrg: [ // ouro por tribunal — o nome recebe o tribunal
      [1,  "🎯", "Primeiro Ouro"],
      [10, "🌠", "Dez Ouros"],
      [25, "🏆", "Colecionador de Ouro"]
    ],

    // ---- Volume ----
    infSemana: [     // informativos lidos numa mesma semana
      [5,   "🔥", "Aquecendo os Motores"],
      [10,  "🍽️", "Devorador de Ementas"],
      [20,  "🚜", "Rolo Compressor"],
      [30,  "🌪️", "Furacão Jurisprudencial"],
      [50,  "🦖", "Destruidor de Informativos"],
      [100, "☄️", "Aniquilador de Informativos"]
    ],
    leisSemana: [
      [5,  "📖", "Leitor de Códigos"],
      [10, "📚", "Biblioteca Ambulante"],
      [20, "🏛️", "Rato de Planalto"],
      [40, "📜", "Devorador de Leis"]
    ],
    sumulasSemana: [
      [5,  "📌", "Caçador de Súmulas"],
      [10, "📎", "Colecionador de Verbetes"],
      [20, "🔖", "Marcador Compulsivo"],
      [50, "📚", "Enciclopédia de Súmulas"]
    ],
    dia: [           // leituras (qualquer Diário) num mesmo dia
      [5,  "💪", "Dia de Treino"],
      [10, "🏃", "Maratona de Estudo"],
      [20, "🏋️", "Dia Hercúleo"],
      [40, "🌋", "Erupção de Estudo"],
      [80, "🚀", "Fora da Órbita"]
    ],
    totalInf: [
      [1,    "📖", "Primeira Leitura"],
      [10,   "🌱", "Broto de Jurista"],
      [25,   "🌿", "Leitor em Crescimento"],
      [50,   "📗", "Cinquentão"],
      [100,  "💯", "Centurião"],
      [250,  "🏹", "Arqueiro da Jurisprudência"],
      [500,  "🗡️", "Gladiador dos Informativos"],
      [1000, "🐉", "Dragão dos Informativos"],
      [2500, "🏔️", "Montanha de Ementas"],
      [5000, "🌌", "Lenda Viva"]
    ],
    totalLeis: [
      [1,   "📕", "Primeira Lei"],
      [10,  "📘", "Dez Leis"],
      [25,  "📗", "Legislador Aprendiz"],
      [50,  "📙", "Metade do Caminho"],
      [100, "📚", "Biblioteca do Planalto"]
    ],
    totalSumulas: [
      [1,   "📌", "Primeira Súmula"],
      [10,  "📍", "Dez Súmulas"],
      [25,  "🧷", "Vinte e Cinco Verbetes"],
      [50,  "📎", "Cinquenta Verbetes"],
      [100, "🔖", "Centena de Súmulas"],
      [250, "🗂️", "Arquivo Vivo"],
      [500, "🏛️", "Guardião das Súmulas"]
    ],
    totalGeral: [    // todas as leituras somadas
      [100,   "🎒", "Cem Leituras"],
      [500,   "🎓", "Quinhentas Leituras"],
      [1000,  "🏆", "Mil Leituras"],
      [5000,  "👑", "Cinco Mil Leituras"],
      [10000, "🌟", "Dez Mil Leituras"]
    ],
    cacaSumulas: [   // informativos que trazem súmula
      [1,  "🔎", "Farejador de Súmulas"],
      [5,  "🐕", "Cão de Caça Jurídico"],
      [10, "🦅", "Olho de Águia"],
      [25, "🎯", "Franco-Atirador de Súmulas"],
      [50, "🕵️", "Detetive de Verbetes"]
    ],

    // ---- Sequências ----
    diasSeguidos: [
      [2,   "🔥", "Chama Acesa"],
      [3,   "🕯️", "Três Dias Seguidos"],
      [5,   "🌡️", "Semana Útil"],
      [7,   "📆", "Semana Inteira"],
      [10,  "🔟", "Dez Dias de Fogo"],
      [14,  "🗓️", "Quinzena Firme"],
      [21,  "🧬", "Hábito Formado"],
      [30,  "🌕", "Um Mês Sem Falhar"],
      [45,  "🪨", "Rocha de Constância"],
      [60,  "🏔️", "Dois Meses de Ferro"],
      [100, "💯", "Cem Dias de Toga"],
      [180, "🌗", "Meio Ano de Estudo"],
      [365, "🌞", "Um Ano Sem Parar"]
    ],
    semanasSeguidas: [
      [2,  "🔁", "Duas Semanas Seguidas"],
      [4,  "🧱", "Um Mês em Semanas"],
      [8,  "🛠️", "Oito Semanas de Obra"],
      [12, "🏗️", "Trimestre Constante"],
      [26, "⛰️", "Semestre Inabalável"],
      [52, "🏛️", "Ano em Semanas"]
    ],
    diasDistintos: [ // total de dias diferentes com leitura
      [7,   "🌱", "Sete Dias de Estudo"],
      [30,  "🌿", "Trinta Dias de Estudo"],
      [100, "🌳", "Cem Dias de Estudo"],
      [365, "🌲", "Um Ano de Dias"]
    ],
    recomeco: [      // voltou depois de N dias sem ler
      [14,  "🔄", "Voltou à Ativa"],
      [30,  "🦸", "A Volta dos que Não Foram"],
      [60,  "🐦‍🔥", "Fênix dos Estudos"],
      [120, "🧟", "Ressuscitado"]
    ],

    // ---- Combinações ----
    triadeDia: [     // informativo + lei + súmula no mesmo dia
      [1,  "🔱", "Tríade"],
      [5,  "🔺", "Triângulo de Ouro"],
      [10, "🍀", "Trevo Jurídico"],
      [30, "🌈", "Arco-Íris dos Diários"]
    ],
    triadeSemana: [
      [1,  "🧩", "Trio da Semana"],
      [4,  "🎼", "Sinfonia dos Diários"],
      [12, "🎭", "Três Faces da Toga"],
      [26, "🎪", "Circo Completo"]
    ],
    semanaCompleta: [ // leu em todos os 7 dias da mesma semana
      [1,  "7️⃣", "Sete Dias de Toga"],
      [4,  "🌈", "Mês de Semanas Cheias"],
      [12, "☀️", "Trimestre Radiante"]
    ],
    fimDeSemana: [   // leu no sábado E no domingo
      [1,  "🛋️", "Sem Folga (Fim de Semana)"],
      [4,  "🏕️", "Acampamento de Estudo"],
      [12, "🧗", "Guerreiro de Fim de Semana"],
      [26, "🦸", "Herói dos Sábados e Domingos"]
    ],
    mesPerfeito: [   // leu em todos os dias de um mês
      [1,  "🗓️", "Mês Perfeito"],
      [3,  "🌟", "Trimestre Perfeito"],
      [12, "👑", "Ano Perfeito"]
    ],
    mesesDoAno: [    // meses diferentes lidos no mesmo ano
      [3,  "🍂", "Trimestre de Estudo"],
      [6,  "🌓", "Semestre de Estudo"],
      [12, "🎆", "Doze Meses de Estudo"]
    ],
    multiTribunal: [ // tribunais diferentes (informativos) já lidos
      [2, "🚦", "Dois Tribunais"],
      [3, "🗺️", "Três Tribunais"],
      [4, "🧭", "Quatro Tribunais"],
      [5, "🌍", "Cinco Tribunais"],
      [6, "🌎", "Volta ao Mundo Jurídico"]
    ],
    multiTribunalDia: [ // tribunais diferentes no mesmo dia
      [2, "✌️", "Dois Tribunais em Um Dia"],
      [3, "🎰", "Trinca de Tribunais"],
      [4, "🃏", "Quadra de Tribunais"],
      [6, "🎡", "Roda Completa"]
    ],
    arqueologo: [    // informativos de 10+ anos atrás
      [10,  "🏺", "Arqueólogo Jurídico"],
      [50,  "🦴", "Paleontólogo de Ementas"],
      [100, "🗿", "Guardião do Passado"],
      [250, "🏛️", "Historiador dos Tribunais"]
    ],
    seculoPassado: [ // informativos dos anos 1990
      [1,  "⏳", "Máquina do Tempo"],
      [10, "📼", "Fitas VHS da Jurisprudência"],
      [50, "🕹️", "Retrogamer Jurídico"]
    ]
  },

  // Dias da semana: leu pelo menos uma vez naquele dia.
  // chave = número do dia (0 = domingo ... 6 = sábado)
  diasDaSemana: {
    1: ["🌱", "Segundou",        "Leia numa segunda-feira."],
    2: ["🌤️", "Terça de Estudo", "Leia numa terça-feira."],
    3: ["🐪", "Quarta-Feira",    "Leia numa quarta-feira: metade da semana vencida."],
    4: ["🧃", "Quintou",         "Leia numa quinta-feira."],
    5: ["🎉", "Sextou com Súmula", "Leia numa sexta-feira."],
    6: ["🏖️", "Sábado Estudioso", "Leia num sábado."],
    0: ["🌅", "Domingo de Toga", "Leia num domingo."]
  },

  // Prêmios secretos por data. Aparecem como "???" até serem conquistados.
  // Formato: "MM-DD" (mês-dia): [emoji, título, descrição].
  datasEspeciais: {
    "01-01": ["🎆", "Ano Novo, Toga Nova",       "Leia no dia 1º de janeiro."],
    "06-21": ["🧑‍⚖️", "Dia do Magistrado",         "Leia no Dia do Magistrado (21 de junho)."],
    "08-11": ["⚖️", "Dia do Advogado",           "Leia no Dia do Advogado (11 de agosto)."],
    "10-05": ["📜", "Aniversário da Constituição", "Leia em 5 de outubro, dia da promulgação da CF/88."],
    "12-25": ["🎄", "Natal Jurídico",            "Leia no dia de Natal."],
    "12-31": ["🥂", "Réveillon de Toga",         "Leia no último dia do ano."]
  },

  secretosExtras: {
    sexta13:  ["🖤", "Sexta-Feira 13",    "Leia numa sexta-feira 13. Só os corajosos."],
    bissexto: ["🐸", "Dia Bissexto",      "Leia em 29 de fevereiro. Acontece de quatro em quatro anos."]
  }
};
