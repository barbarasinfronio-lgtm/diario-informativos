// Diário das Resoluções — dados (CNJ, CNMP, CONAMA, CONANDA).
// Base curada a partir do conteúdo programático dos editais mapeados, mais
// um conjunto mínimo de normas estruturais de cada órgão, verificadas nos
// sites oficiais. Não é um catálogo exaustivo de tudo o que está vigente —
// cresce conforme novos editais citarem normas específicas.

var NORMAS_DATA = {

  cnj: { label: "CNJ — Conselho Nacional de Justiça", status: "disponivel", normas: [
    { tipo: "Resolução", numero: "75/2009", ementa: "Regulamenta os concursos públicos para ingresso na carreira da magistratura", link: "https://atos.cnj.jus.br/atos?atos=sim&numero=75&ano=2009" },
    { tipo: "Resolução", numero: "125/2010", ementa: "Política Judiciária Nacional de tratamento adequado dos conflitos (mediação e conciliação)", link: "https://atos.cnj.jus.br/atos?atos=sim&numero=125&ano=2010" },
    { tipo: "Resolução", numero: "165/2012", ementa: "Diretrizes para adoção — cadastro nacional e habilitação", link: "https://atos.cnj.jus.br/atos?atos=sim&numero=165&ano=2012" },
    { tipo: "Resolução", numero: "213/2015", ementa: "Audiência de custódia — apresentação de pessoa presa à autoridade judicial", link: "https://atos.cnj.jus.br/atos?atos=sim&numero=213&ano=2015" },
    { tipo: "Resolução", numero: "228/2016", ementa: "Apostila da Convenção da Haia — apostilamento de documentos públicos", link: "https://atos.cnj.jus.br/atos?atos=sim&numero=228&ano=2016" },
    { tipo: "Resolução", numero: "287/2019", ementa: "Procedimentos aplicáveis a pessoas indígenas acusadas ou condenadas", link: "https://atos.cnj.jus.br/atos?atos=sim&numero=287&ano=2019" },
    { tipo: "Resolução", numero: "289/2019", ementa: "Política Institucional de valorização da magistratura (saúde e qualidade de vida)", link: "https://atos.cnj.jus.br/atos?atos=sim&numero=289&ano=2019" },
    { tipo: "Resolução", numero: "295/2019", ementa: "Autorização de viagem de crianças/adolescentes ao exterior — normas e procedimentos", link: "https://atos.cnj.jus.br/atos?atos=sim&numero=295&ano=2019" },
    { tipo: "Resolução", numero: "345/2020", ementa: "Institui o Juízo 100% Digital", link: "https://atos.cnj.jus.br/atos?atos=sim&numero=345&ano=2020" },
    { tipo: "Resolução", numero: "348/2020", ementa: "Procedimentos relativos a pessoas LGBTI acusadas, rés, condenadas ou privadas de liberdade", link: "https://atos.cnj.jus.br/atos?atos=sim&numero=348&ano=2020" },
    { tipo: "Resolução", numero: "369/2021", ementa: "Diretrizes de proteção a crianças e adolescentes em situação de violência doméstica", link: "https://atos.cnj.jus.br/atos?atos=sim&numero=369&ano=2021" },
    { tipo: "Resolução", numero: "372/2021", ementa: "Prevenção e combate ao assédio moral e sexual no Poder Judiciário", link: "https://atos.cnj.jus.br/atos?atos=sim&numero=372&ano=2021" },
    { tipo: "Resolução", numero: "385/2021", ementa: "Governança e gestão da inovação no Poder Judiciário", link: "https://atos.cnj.jus.br/atos?atos=sim&numero=385&ano=2021" },
    { tipo: "Resolução", numero: "398/2021", ementa: "Política de comunicação do Poder Judiciário", link: "https://atos.cnj.jus.br/atos?atos=sim&numero=398&ano=2021" },
    { tipo: "Resolução", numero: "402/2021", ementa: "Preparação para o casamento civil — orientação de nubentes", link: "https://atos.cnj.jus.br/atos?atos=sim&numero=402&ano=2021" },
    { tipo: "Resolução", numero: "414/2021", ementa: "Sistema Eletrônico de Execução Unificado (SEEU) — procedimento de execução penal", link: "https://atos.cnj.jus.br/atos?atos=sim&numero=414&ano=2021" },
    { tipo: "Resolução", numero: "425/2021", ementa: "Política de atenção à saúde mental de magistrados e servidores", link: "https://atos.cnj.jus.br/atos?atos=sim&numero=425&ano=2021" },
    { tipo: "Resolução", numero: "427/2021", ementa: "Diretrizes sobre perspectiva de gênero e interseccionalidade na atuação judicial", link: "https://atos.cnj.jus.br/atos?atos=sim&numero=427&ano=2021" },
    { tipo: "Resolução", numero: "452/2022", ementa: "Usucapião extrajudicial — procedimento perante o registro de imóveis", link: "https://atos.cnj.jus.br/atos?atos=sim&numero=452&ano=2022" },
    { tipo: "Resolução", numero: "484/2022", ementa: "Combate ao trabalho escravo e ao tráfico de pessoas", link: "https://atos.cnj.jus.br/atos?atos=sim&numero=484&ano=2022" },
    { tipo: "Resolução", numero: "485/2023", ementa: "Diretrizes de inteligência artificial no Poder Judiciário", link: "https://atos.cnj.jus.br/atos?atos=sim&numero=485&ano=2023" },
    { tipo: "Resolução", numero: "571/2024", ementa: "Atualiza normas sobre a Semana Nacional de Conciliação", link: "https://atos.cnj.jus.br/atos?atos=sim&numero=571&ano=2024" },
    { tipo: "Resolução", numero: "583/2024", ementa: "Traslado de certidões de registro civil emitidas no exterior", link: "https://atos.cnj.jus.br/atos?atos=sim&numero=583&ano=2024" },
    { tipo: "Resolução", numero: "598/2024", ementa: "Atualização de procedimentos administrativos do CNJ", link: "https://atos.cnj.jus.br/atos?atos=sim&numero=598&ano=2024" },
    { tipo: "Recomendação", numero: "98/2021", ementa: "Recomenda diretrizes sobre acolhimento de crianças e adolescentes", link: "https://atos.cnj.jus.br/atos?atos=sim&numero=98&ano=2021" },
    { tipo: "Resolução", numero: "185/2013", ementa: "Institui o sistema Processo Judicial Eletrônico (PJe) como sistema de processamento de informações e prática de atos processuais", link: "https://atos.cnj.jus.br/atos?atos=sim&numero=185&ano=2013" },
    { tipo: "Resolução", numero: "113/2010", ementa: "Dispõe sobre o procedimento relativo à execução de pena privativa de liberdade e medida de segurança", link: "https://atos.cnj.jus.br/atos?atos=sim&numero=113&ano=2010" },
  ]},

  cnmp: { label: "CNMP — Conselho Nacional do Ministério Público", status: "disponivel", normas: [
    { tipo: "Resolução", numero: "23/2007", ementa: "Regulamenta o art. 9º da Lei Complementar nº 75/1993 e o art. 80 da Lei nº 8.625/1993 — inquérito civil", link: "https://www.cnmp.mp.br/portal/atos-e-normas" },
    { tipo: "Resolução", numero: "118/2014", ementa: "Política Nacional de Incentivo à Autocomposição no âmbito do Ministério Público", link: "https://www.cnmp.mp.br/portal/atos-e-normas" },
    { tipo: "Resolução", numero: "154/2016", ementa: "Regulamenta o exercício da atividade correicional no Ministério Público", link: "https://www.cnmp.mp.br/portal/atos-e-normas" },
    { tipo: "Resolução", numero: "164/2017", ementa: "Dispõe sobre o Termo de Ajustamento de Conduta", link: "https://www.cnmp.mp.br/portal/atos-e-normas" },
    { tipo: "Resolução", numero: "174/2017", ementa: "Regulamenta os procedimentos administrativos disciplinares no âmbito do MP", link: "https://www.cnmp.mp.br/portal/atos-e-normas" },
    { tipo: "Resolução", numero: "179/2017", ementa: "Disciplina o rito de instauração e tramitação do procedimento de investigação criminal", link: "https://www.cnmp.mp.br/portal/atos-e-normas" },
    { tipo: "Resolução", numero: "198/2019", ementa: "Institui a Política Nacional de Atenção Prioritária à Primeira Infância no MP", link: "https://www.cnmp.mp.br/portal/atos-e-normas" },
    { tipo: "Resolução", numero: "228/2021", ementa: "Regulamenta a atuação do Ministério Público na tutela coletiva do patrimônio público", link: "https://www.cnmp.mp.br/portal/atos-e-normas" },
    { tipo: "Resolução", numero: "230/2021", ementa: "Dispõe sobre a atuação do MP na defesa dos direitos das pessoas idosas", link: "https://www.cnmp.mp.br/portal/atos-e-normas" },
    { tipo: "Resolução", numero: "20/2007", ementa: "Regulamenta o controle externo da atividade policial pelo Ministério Público", link: "https://www.cnmp.mp.br/portal/images/Resolu%C3%A7ao_n%C2%BA_20_alterada_pelas_Resolu%C3%A7%C3%B5es-65-98_113_e_121.pdf" },
    { tipo: "Resolução", numero: "36/2009", ementa: "Regulamenta a atuação de membros do MP nas interceptações telefônicas (validada pelo STF na ADI 4.263)", link: "https://www.cnmp.mp.br/portal/images/stories/Normas/Resolucoes/resolucao_n_36_alterada_pela_res_51-2010.pdf" },
    { tipo: "Resolução", numero: "135/2016", ementa: "Institui o Cadastro Nacional de Casos de Violência Doméstica e Familiar contra a Mulher", link: "https://www.cnmp.mp.br/portal/atos-e-normas" },
    { tipo: "Resolução", numero: "181/2017", ementa: "Dispõe sobre instauração e tramitação do procedimento investigatório criminal a cargo do Ministério Público", link: "https://www.cnmp.mp.br/portal/atos-e-normas" },
    { tipo: "Resolução", numero: "243/2021", ementa: "Política Institucional de Proteção Integral às Vítimas de Infrações Penais e Atos Infracionais", link: "https://www.cnmp.mp.br/portal/atos-e-normas" },
    { tipo: "Resolução", numero: "271/2023", ementa: "Diretrizes gerais para os cursos de ingresso, formação inicial e vitaliciamento de membros do MP", link: "https://www.cnmp.mp.br/portal/atos-e-normas" },
  ]},

  conama: { label: "CONAMA — Conselho Nacional do Meio Ambiente", status: "disponivel", normas: [
    { tipo: "Resolução", numero: "1/1986", ementa: "Define e disciplina o Estudo de Impacto Ambiental (EIA) e o Relatório de Impacto Ambiental (RIMA)", link: "https://www.ibama.gov.br/sophia/cnia/legislacao/MMA/RE0001-230186.PDF" },
    { tipo: "Resolução", numero: "1/1990", ementa: "Dispõe sobre critérios de padrões de emissão de ruído decorrentes de atividades industriais, comerciais, sociais ou recreativas", link: "https://www.ibama.gov.br/sophia/cnia/legislacao/MMA/RE0001-080390.PDF" },
    { tipo: "Resolução", numero: "237/1997", ementa: "Dispõe sobre licenciamento ambiental — competência, procedimento e revisão de atos", link: "https://www.ibama.gov.br/sophia/cnia/legislacao/MMA/RE0237-191297.PDF" },
    { tipo: "Resolução", numero: "302/2002", ementa: "Parâmetros, definições e limites de Áreas de Preservação Permanente de reservatórios artificiais", link: "https://www.legisweb.com.br/legislacao/?id=98314" },
    { tipo: "Resolução", numero: "303/2002", ementa: "Parâmetros, definições e limites de Áreas de Preservação Permanente", link: "https://www.legisweb.com.br/legislacao/?id=98313" },
    { tipo: "Resolução", numero: "357/2005", ementa: "Classificação dos corpos de água e diretrizes ambientais para o enquadramento, condições e padrões de lançamento de efluentes", link: "https://www.legisweb.com.br/legislacao/?id=102255" },
    { tipo: "Resolução", numero: "396/2008", ementa: "Classificação e diretrizes ambientais para o enquadramento das águas subterrâneas", link: "https://www.legisweb.com.br/legislacao/?id=108784" },
    { tipo: "Resolução", numero: "420/2009", ementa: "Critérios e valores orientadores de qualidade do solo e diretrizes para áreas contaminadas", link: "https://www.legisweb.com.br/legislacao/?id=111046" },
  ]},

  conanda: { label: "CONANDA — Conselho Nacional dos Direitos da Criança e do Adolescente", status: "disponivel", normas: [
    { tipo: "Resolução", numero: "113/2006", ementa: "Parâmetros para a institucionalização e fortalecimento do Sistema de Garantia dos Direitos da Criança e do Adolescente", link: "https://www.gov.br/mdh/pt-br/acesso-a-informacao/participacao-social/conselho-nacional-dos-direitos-da-crianca-e-do-adolescente-conanda/resolucoes/resolucoes-1" },
    { tipo: "Resolução", numero: "117/2006", ementa: "Complementa a Resolução nº 113/2006 sobre o Sistema de Garantia de Direitos", link: "https://www.gov.br/mdh/pt-br/acesso-a-informacao/participacao-social/conselho-nacional-dos-direitos-da-crianca-e-do-adolescente-conanda/resolucoes/resolucoes-1" },
    { tipo: "Resolução", numero: "169/2014", ementa: "Parâmetros para a formação continuada de conselheiros tutelares", link: "https://www.gov.br/mdh/pt-br/acesso-a-informacao/participacao-social/conselho-nacional-dos-direitos-da-crianca-e-do-adolescente-conanda/resolucoes/resolucoes-1" },
    { tipo: "Resolução", numero: "231/2022", ementa: "Altera a Resolução nº 170/2014 — processo de escolha em data unificada dos membros do Conselho Tutelar", link: "https://www.gov.br/mdh/pt-br/acesso-a-informacao/participacao-social/conselho-nacional-dos-direitos-da-crianca-e-do-adolescente-conanda/resolucoes/resolucoes-1" },
    { tipo: "Resolução", numero: "75/2001", ementa: "Parâmetros para criação e funcionamento dos Conselhos Tutelares", link: "https://www.gov.br/mdh/pt-br/acesso-a-informacao/participacao-social/conselho-nacional-dos-direitos-da-crianca-e-do-adolescente-conanda/resolucoes/resolucoes-1" },
    { tipo: "Resolução", numero: "119/2006", ementa: "Institui o Sistema Nacional de Atendimento Socioeducativo (SINASE)", link: "https://www.gov.br/mdh/pt-br/acesso-a-informacao/participacao-social/conselho-nacional-dos-direitos-da-crianca-e-do-adolescente-conanda/resolucoes/resolucoes-1" },
    { tipo: "Resolução", numero: "170/2014", ementa: "Dispõe sobre o processo de escolha unificado dos membros do Conselho Tutelar em todo o território nacional", link: "https://www.gov.br/mdh/pt-br/acesso-a-informacao/participacao-social/conselho-nacional-dos-direitos-da-crianca-e-do-adolescente-conanda/resolucoes/resolucoes-1" },
    { tipo: "Resolução", numero: "233/2022", ementa: "Diretrizes e parâmetros de atendimento socioeducativo a adolescentes privadas de liberdade no SINASE", link: "https://www.gov.br/mdh/pt-br/acesso-a-informacao/participacao-social/conselho-nacional-dos-direitos-da-crianca-e-do-adolescente-conanda/resolucoes/resolucoes-1" },
  ]},

};

var NORMAS_ORG_ORDER = ["cnj", "cnmp", "conama", "conanda"];
