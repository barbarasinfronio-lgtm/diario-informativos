# Sumário do "Vade Mecum Internacional – 20ª ed. 2026" (prints enviados em 19/10/2026), só os títulos, na ordem do livro.
# (seção, título, ano, tipo)  tipo: T tratado | L lei/decreto brasileiro | D declaração/soft law | R regimento/outro
S = []
def sec(nome, *itens):
    for i in itens: S.append((nome,) + i)
sec('Organizações internacionais',
 ('Pacto da Sociedade das Nações',1919,'T'),('Carta das Nações Unidas',1945,'T'),('Estatuto da Corte Internacional de Justiça',1945,'T'),
 ('Carta da Organização dos Estados Americanos',1948,'T'),('Protocolo de Manágua',1993,'T'),('Tratado de Cooperação Amazônica',1978,'T'),
 ('Princípios de Yogyakarta',2006,'D'),('Agenda 2030',2015,'D'))
sec('Desarmamento e segurança coletiva',
 ('Protocolo de Genebra',1925,'T'),('Tratado de Renúncia à Guerra Pacto de Paris Briand-Kellog',1928,'T'),
 ('Tratado Interamericano de Assistência Recíproca Pacto do Rio',1947,'T'),
 ('Tratado de Proscrição das Experiências com Armas Nucleares na Atmosfera, no Espaço Cósmico e sob a Água',1963,'T'),
 ('Tratado para a Proscrição de Armas Nucleares na América Latina e no Caribe Tlatelolco',1967,'T'),
 ('Tratado sobre a Não Proliferação de Armas Nucleares',1968,'T'),
 ('Convenção para Prevenir e Punir os Atos de Terrorismo Configurados em Delitos contra as Pessoas e a Extorsão Conexa',1971,'T'),
 ('Tratado de Proibição Completa dos Testes Nucleares',1996,'T'),('Protocolo ao Tratado de Proibição Completa dos Testes Nucleares',1996,'T'),
 ('Convenção Internacional sobre a Supressão de Atentados Terroristas com Bombas',1998,'T'),
 ('Convenção das Nações Unidas contra o Crime Organizado Transnacional',2000,'T'),
 ('Protocolo Adicional à Convenção contra o Crime Organizado Transnacional Relativo ao Combate ao Tráfico de Migrantes por Via Terrestre, Marítima e Aérea',2000,'T'),
 ('Protocolo Adicional à Convenção contra o Crime Organizado Transnacional Relativo à Prevenção, Repressão e Punição do Tráfico de Pessoas, em Especial Mulheres e Crianças',2000,'T'),
 ('Convenção sobre o Crime Cibernético',2001,'T'),('Convenção Interamericana contra o Terrorismo',2002,'T'),('Tratado sobre o Comércio de Armas',2013,'T'))
sec('Relações diplomáticas e consulares',('Convenção de Viena sobre Relações Diplomáticas',1961,'T'),('Convenção de Viena sobre Relações Consulares',1963,'T'))
sec('Asilo',('Convenção sobre Asilo Territorial',1954,'T'),('Convenção sobre Asilo Diplomático',1954,'T'))
sec('Direito dos tratados',('Convenção de Havana sobre Tratados',1928,'T'),('Convenção de Viena sobre o Direito dos Tratados',1969,'T'),
 ('Convenção de Viena sobre Sucessão de Estados em Matéria de Tratados',1978,'T'),
 ('Convenção de Viena sobre o Direito dos Tratados entre Estados e Organizações Internacionais ou entre Organizações Internacionais',1986,'T'))
sec('Espaços marítimos',('Convenção das Nações Unidas sobre o Direito do Mar Montego Bay',1982,'T'),
 ('Lei 8.617 mar territorial, zona contígua, zona econômica exclusiva e plataforma continental',1993,'L'),
 ('Acordo Relativo à Implementação da Parte XI da Convenção das Nações Unidas sobre o Direito do Mar',1994,'T'))
sec('Espaço aéreo e cósmico',('Convenção Relativa a Infrações e a Certos Outros Atos Praticados a Bordo de Aeronave',1963,'T'),
 ('Tratado sobre Princípios Reguladores das Atividades dos Estados na Exploração e Uso do Espaço Cósmico, inclusive a Lua e Demais Corpos Celestes',1967,'T'),
 ('Convenção sobre Responsabilidade Internacional por Danos Causados por Objetos Espaciais',1972,'T'),
 ('Convenção para a Unificação de Certas Regras Relativas ao Transporte Aéreo Internacional',1999,'T'))
sec('Zonas polares',('Tratado da Antártida',1959,'T'),('Protocolo ao Tratado da Antártida sobre Proteção ao Meio Ambiente',1991,'T'),
 ('Convenção sobre a Conservação dos Recursos Vivos Marinhos Antárticos',1980,'T'))
sec('Direito internacional econômico e sanitário',('Convênio Constitutivo do Fundo Monetário Internacional',1944,'T'),
 ('Constituição da Organização Mundial de Saúde',1946,'T'),('Regulamento Sanitário Internacional',2005,'T'))
sec('Declarações de direitos humanos aprovadas pelo Brasil',('Declaração Universal dos Direitos Humanos',1948,'D'),('Declaração sobre o Direito ao Desenvolvimento',1986,'D'),
 ('Declaração e Programa de Ação de Viena',1993,'D'),('Declaração de Pequim Quarta Conferência Mundial sobre as Mulheres Ação para Igualdade, Desenvolvimento e Paz',1995,'D'),
 ('Declaração Americana dos Direitos e Deveres do Homem',1948,'D'),('Declaração Americana sobre os Direitos dos Povos Indígenas',2016,'D'))
sec('Tratados de direitos humanos – sistema global',('Convenção para a Prevenção e a Repressão do Crime de Genocídio',1948,'T'),
 ('Convenção Relativa ao Estatuto dos Refugiados',1951,'T'),('Protocolo sobre o Estatuto dos Refugiados',1966,'T'),
 ('Lei 9.474 mecanismos para a implementação do Estatuto dos Refugiados',1997,'L'),
 ('Convenção Internacional sobre a Eliminação de Todas as Formas de Discriminação Racial',1965,'T'),
 ('Pacto Internacional sobre Direitos Civis e Políticos',1966,'T'),('Protocolo Facultativo ao Pacto Internacional sobre Direitos Civis e Políticos',1966,'T'),
 ('Segundo Protocolo Facultativo ao Pacto Internacional sobre Direitos Civis e Políticos com Vistas à Abolição da Pena de Morte',1989,'T'),
 ('Pacto Internacional dos Direitos Econômicos, Sociais e Culturais',1966,'T'),
 ('Convenção sobre a Eliminação de Todas as Formas de Discriminação contra a Mulher',1979,'T'),
 ('Protocolo Facultativo à Convenção sobre a Eliminação de Todas as Formas de Discriminação contra a Mulher',1999,'T'),
 ('Convenção contra a Tortura e Outros Tratamentos ou Penas Cruéis, Desumanos ou Degradantes',1984,'T'),
 ('Protocolo Facultativo à Convenção contra a Tortura e Outros Tratamentos ou Penas Cruéis, Desumanos ou Degradantes',2002,'T'),
 ('Convenção sobre os Direitos da Criança',1989,'T'),
 ('Convenção Internacional sobre a Proteção dos Direitos de Todos os Trabalhadores Migrantes e dos Membros das suas Famílias',1990,'T'),
 ('Protocolo Facultativo à Convenção sobre os Direitos da Criança Referente à Venda de Criança, à Prostituição Infantil e à Pornografia Infantil',2000,'T'),
 ('Protocolo Facultativo à Convenção sobre os Direitos da Criança Relativo ao Envolvimento de Crianças em Conflitos Armados',2000,'T'),
 ('Convenção das Nações Unidas contra a Corrupção Mérida',2003,'T'),
 ('Convenção Internacional para a Proteção de Todas as Pessoas contra o Desaparecimento Forçado',2006,'T'),
 ('Convenção sobre os Direitos das Pessoas com Deficiência e seu Protocolo Facultativo',2007,'T'),
 ('Tratado de Marraqueche para Facilitar o Acesso a Obras Publicadas às Pessoas Cegas, com Deficiência Visual ou com Outras Dificuldades para Ter Acesso ao Texto Impresso',2013,'T'))
sec('Tratados de direitos humanos – sistema interamericano',('Convenção Americana sobre Direitos Humanos Pacto de San José',1969,'T'),
 ('Estatuto da Corte Interamericana de Direitos Humanos',1979,'R'),
 ('Protocolo Adicional à Convenção Americana sobre Direitos Humanos em Matéria de Direitos Econômicos, Sociais e Culturais Protocolo de San Salvador',1988,'T'),
 ('Protocolo à Convenção Americana sobre Direitos Humanos Referente à Abolição da Pena de Morte',1990,'T'),
 ('Convenção Interamericana para Prevenir e Punir a Tortura',1985,'T'),
 ('Convenção Interamericana para Prevenir, Punir e Erradicar a Violência contra a Mulher Belém do Pará',1994,'T'),
 ('Convenção Interamericana sobre Tráfico Internacional de Menores',1994,'T'),('Convenção Interamericana contra a Corrupção',1996,'T'),
 ('Convenção Interamericana para a Eliminação de Todas as Formas de Discriminação contra as Pessoas Portadoras de Deficiência',1999,'T'),
 ('Convenção Interamericana contra o Racismo, a Discriminação Racial e Formas Correlatas de Intolerância',2013,'T'),
 ('Convenção Interamericana sobre a Proteção dos Direitos Humanos dos Idosos',2015,'T'))
sec('Comércio internacional',('Acordo Constitutivo da Organização Mundial de Comércio',1994,'T'),
 ('Convenção das Nações Unidas sobre Contratos de Compra e Venda Internacional de Mercadorias',1980,'T'))
sec('Meio ambiente',('Declaração de Estocolmo sobre o Meio Ambiente Humano',1972,'D'),('Declaração do Rio de Janeiro sobre Meio Ambiente e Desenvolvimento',1992,'D'),
 ('Convenção sobre Diversidade Biológica',1992,'T'),('Convenção Quadro das Nações Unidas sobre Mudança do Clima',1992,'T'),
 ('Protocolo de Quioto à Convenção Quadro das Nações Unidas sobre Mudança do Clima',1997,'T'),
 ('Protocolo de Cartagena sobre Biossegurança da Convenção sobre Diversidade Biológica',2000,'T'),
 ('Protocolo de Nagoia sobre Acesso a Recursos Genéticos e Repartição Justa e Equitativa dos Benefícios Derivados de sua Utilização',2010,'T'))
sec('Direito internacional penal',('Estatuto de Roma do Tribunal Penal Internacional',1998,'T'),
 ('Convenção Interamericana sobre Assistência Mútua em Matéria Penal',1992,'T'),
 ('Protocolo Facultativo à Convenção Interamericana sobre Assistência Mútua em Matéria Penal',1993,'T'),
 ('Convenção Interamericana sobre o Cumprimento de Sentenças Penais no Exterior',1993,'T'))
sec('Nacionalidade e cidadania',('Convenção para a Redução dos Casos de Apatridia',1961,'T'),('Declaração Constitutiva da Comunidade dos Países de Língua Portuguesa',1996,'D'),
 ('Estatutos da Comunidade dos Países de Língua Portuguesa',2007,'T'),('Tratado de Amizade, Cooperação e Consulta entre Brasil e Portugal',2000,'T'),
 ('Lei 11.961 residência provisória para o estrangeiro em situação irregular',2009,'L'),('Decreto 6.893 regulamenta a Lei 11.961',2009,'L'),
 ('Lei 13.445 Lei de Migração',2017,'L'),('Decreto 9.199 regulamenta a Lei 13.445',2017,'L'))
sec('Mercosul e Unasul',('Tratado de Assunção Mercado Comum do Sul',1991,'T'),
 ('Protocolo de Cooperação e Assistência Jurisdicional em Matéria Civil, Comercial, Trabalhista e Administrativa Protocolo de Las Leñas',1992,'T'),
 ('Protocolo Adicional ao Tratado de Assunção sobre a Estrutura Institucional do Mercosul Protocolo de Ouro Preto',1994,'T'),
 ('Protocolo de Assunção sobre Compromisso com a Promoção e Proteção dos Direitos Humanos do Mercosul',2005,'T'),
 ('Protocolo de Buenos Aires sobre Jurisdição Internacional em Matéria Contratual',1994,'T'),('Protocolo de Defesa da Concorrência no Mercosul',1996,'T'),
 ('Protocolo de Montevidéu sobre o Comércio de Serviços do Mercosul',1997,'T'),('Acordo de Extradição entre os Estados Partes do Mercosul',1998,'T'),
 ('Acordo sobre Arbitragem Comercial Internacional do Mercosul',1998,'T'),
 ('Acordo de Admissão de Títulos e Graus Universitários para o Exercício de Atividades Acadêmicas nos Estados Partes do Mercosul',1999,'T'),
 ('Acordo Quadro sobre Meio Ambiente do Mercosul',2001,'T'),('Protocolo de Olivos para a Solução de Controvérsias no Mercosul',2002,'T'),
 ('Acordo de Cooperação e Assistência Jurisdicional em Matéria Civil, Comercial, Trabalhista e Administrativa entre os Estados Partes do Mercosul e a República da Bolívia e a República do Chile',2002,'T'),
 ('Protocolo Constitutivo do Parlamento do Mercosul',2005,'T'),('Protocolo de Adesão do Estado Plurinacional da Bolívia ao Mercosul',2015,'T'),
 ('Tratado Constitutivo da União de Nações Sul-Americanas',2008,'T'))
trab=[(29,1930),(98,1949),(103,1952),(105,1957),(111,1958),(132,1970),(135,1971),(138,1973),(151,1978),(155,1981),(156,1981),(168,1988),(169,1989),(171,1990),(182,1999),(189,2011)]
sec('Direito internacional do trabalho',('Constituição da Organização Internacional do Trabalho e seu Anexo',1946,'T'),*[(f'Convenção {n} da OIT',a,'T') for n,a in trab],
 ('Recomendação 190 da OIT',1999,'D'),('Recomendação 201 da OIT',2011,'D'))
sec('Direito internacional privado – global',('Decreto-Lei 4.657 Lei de Introdução às Normas do Direito Brasileiro',1942,'L'),
 ('Lei 12.376 altera a ementa do Decreto-Lei 4.657',2010,'L'),('Lei 12.874 altera o art. 18 do Decreto-Lei 4.657',2013,'L'),
 ('Estatuto Orgânico do Instituto Internacional para a Unificação do Direito Privado UNIDROIT',1940,'T'),
 ('Estatuto da Conferência da Haia de Direito Internacional Privado',1951,'T'),('Convenção sobre a Prestação de Alimentos no Estrangeiro',1956,'T'),
 ('Convenção sobre o Reconhecimento e a Execução de Sentenças Arbitrais Estrangeiras',1958,'T'),
 ('Convenção Relativa à Citação, Intimação e Notificação no Estrangeiro de Documentos Judiciais e Extrajudiciais em Matéria Civil e Comercial',1965,'T'),
 ('Convenção sobre a Obtenção de Provas no Estrangeiro em Matéria Civil ou Comercial',1970,'T'),
 ('Convenção sobre os Aspectos Civis do Sequestro Internacional de Crianças',1980,'T'),
 ('Decreto 5.491 regulamenta a atuação de organismos estrangeiros e nacionais de adoção internacional',2005,'L'))
sec('Direito internacional privado – interamericano',('Convenção de Direito Internacional Privado Código Bustamante',1928,'T'),
 ('Lei 13.105 Código de Processo Civil',2015,'L'),('Lei 9.307 arbitragem',1996,'L'),('Regimento Interno do Supremo Tribunal Federal',1980,'R'),
 ('Convenção Interamericana sobre Cartas Rogatórias',1975,'T'),('Protocolo Adicional à Convenção Interamericana sobre Cartas Rogatórias',1979,'T'),
 ('Convenção Interamericana sobre Arbitragem Comercial Internacional',1975,'T'),('Convenção Interamericana sobre Normas Gerais de Direito Internacional Privado',1979,'T'),
 ('Convenção Interamericana sobre Prova e Informação acerca do Direito Estrangeiro',1979,'T'),('Convenção Interamericana sobre Obrigação Alimentar',1989,'T'))
