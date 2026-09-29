/*
 * normas-citadas.js — acha, num texto, as leis e resoluções citadas pelo
 * número (ex.: "Lei nº 11.340/2006", "Resolução CNJ nº 547/2024"), pela
 * sigla ou pelo nome (ex.: "art. 135, III, do CTN", "Lei Maria da Penha"),
 * junto com o artigo citado, e diz,
 * para cada uma, se ela está no Diário de Leis / Diário das Resoluções e se a
 * pessoa já marcou como lida.
 *
 * Uso (ex.: no card aberto do Diário das Decisões):
 *   var achadas = NormasCitadas.encontrar(texto, { data: "dd/mm/aaaa" }); // na hora, sem baixar nada
 *   NormasCitadas.carregar().then(function () {        // baixa leis-data.js e normas-data.js
 *     achadas.map(NormasCitadas.resolver);             // { rotulo, artigos, nome, noDiario, lida, href, externo }
 *   });
 *
 * As leituras vêm do armazenamento deste navegador, com as mesmas chaves dos
 * Diários: "leis-lidas" ("<matéria>:<número-em-slug>") e "normas-lidas"
 * ("<órgão>:<número>"). O link leva para a norma dentro do Diário
 * (#lei=... / #norma=...), onde a pessoa marca a leitura; norma que ainda
 * não está nos Diários leva ao texto oficial.
 */
(function () {
  "use strict";

  if (window.NormasCitadas) return;

  var CDN_BASE = "https://cdn.jsdelivr.net/gh/barbarasinfronio-lgtm/diario-informativos@main/";
  var PAGINA_LEIS = "/p/diario-de-leis.html";
  var PAGINA_NORMAS = "/p/diario-das-resolucoes.html";

  // ---- reconhecimento no texto ---------------------------------------------
  // Lei nº 11.340/2006 · Lei 8.069/90 · Lei Complementar 87/1996 · LC 123/2006
  // Decreto-Lei nº 3.689/1941 · Decreto 3.048/99
  var RE_LEI = /\b(Lei\s+Complementar|Lei|LC|Decreto[\s-]Lei|Decreto)\s*(?:Federal\s*)?(?:n[ºo°.]*\s*)?(\d{1,3}(?:\.\d{3})*)\s*\/\s*(\d{4}|\d{2})\b/gi;
  // Resolução CNJ nº 547/2024 · Recomendação do CNJ 123/2022 · Resolução nº 9/2019 do CNMP
  // (sem o órgão, "Resolução nº X" pode ser do Senado, de agência etc. — fica de fora)
  var RE_NORMA = /\b(Resolu[çc][ãa]o|Res\.|Recomenda[çc][ãa]o)\s+(?:(?:do|da)\s+)?(CNJ|CSJT|CNMP|CSMPT|CONAMA|CONANDA)?\s*(?:n[ºo°.]*\s*)?(\d{1,4}(?:\.\d{3})*)\s*\/\s*(\d{4}|\d{2})\b(?:\s*,?\s*(?:do|da)\s+(CNJ|CSJT|CNMP|CSMPT|CONAMA|CONANDA))?/gi;

  var NOME_TIPO_LEI = { lei: "Lei", lc: "Lei Complementar", dl: "Decreto-Lei", decreto: "Decreto" };

  // Leis citadas pela sigla ou pelo nome. Cada linha:
  //   [identificação exatamente como em leis-data.js, rótulo, siglas, nomes]
  //   (+ início da vigência, para códigos que substituíram outro de mesmo nome)
  // Siglas só valem em maiúsculas e como palavra inteira; nomes aceitam
  // maiúsculas/minúsculas. Para incluir uma lei, basta acrescentar uma linha.
  var POR_NOME = [
    ["CF/1988", "Constituição Federal (CF/1988)", "CF|CRFB|CR(?=\\/)|Constituição(?! (?:[Ee]stadual|[Dd]o Estado|[Dd]os Estados|[Mm]ineira|[Pp]aulista|[Ff]ederal|[Dd]a República|[Dd]e 19))",
      "Constituição Federal|Constituição da República(?: Federativa do Brasil)?|Constituição de 1988|Carta Magna|Carta da República"],
    ["Lei nº 5.172/1966", "CTN — Lei nº 5.172/1966", "CTN", "Código Tributário Nacional"],
    ["Decreto-Lei nº 5.452/1943", "CLT — Decreto-Lei nº 5.452/1943", "CLT", "Consolidação das Leis do Trabalho"],
    ["Lei nº 13.105/2015", "CPC — Lei nº 13.105/2015", "N?CPC", "(?:Novo )?Código de Processo Civil", "2016-03-18"],
    ["Lei nº 10.406/2002", "Código Civil — Lei nº 10.406/2002", "CC", "(?:Novo )?Código Civil", "2003-01-11"],
    ["Decreto-Lei nº 2.848/1940", "Código Penal — Decreto-Lei nº 2.848/1940", "CP", "Código Penal(?! Militar)"],
    ["Decreto-Lei nº 3.689/1941", "CPP — Decreto-Lei nº 3.689/1941", "CPP", "Código de Processo Penal(?! Militar)"],
    ["Decreto-Lei nº 1.001/1969", "Código Penal Militar — Decreto-Lei nº 1.001/1969", "CPM", "Código Penal Militar"],
    ["Decreto-Lei nº 1.002/1969", "CPPM — Decreto-Lei nº 1.002/1969", "CPPM", "Código de Processo Penal Militar"],
    ["Lei nº 8.078/1990", "CDC — Lei nº 8.078/1990", "CDC", "Código de Defesa do Consumidor"],
    ["Lei nº 8.069/1990", "ECA — Lei nº 8.069/1990", "ECA", "Estatuto da Criança e do Adolescente"],
    ["Decreto-Lei nº 4.657/1942", "LINDB — Decreto-Lei nº 4.657/1942", "LINDB|LICC", "Lei de Introdução (?:às Normas do Direito Brasileiro|ao Código Civil)"],
    ["Lei nº 9.503/1997", "CTB — Lei nº 9.503/1997", "CTB", "Código de Trânsito(?: Brasileiro)?"],
    ["Lei nº 4.737/1965", "Código Eleitoral — Lei nº 4.737/1965", null, "Código Eleitoral"],
    ["Lei nº 12.651/2012", "Código Florestal — Lei nº 12.651/2012", null, "(?:Novo )?Código Florestal"],
    ["Lei nº 7.210/1984", "LEP — Lei nº 7.210/1984", "LEP", "Lei de Execuç(?:ão|ões) Pena(?:l|is)"],
    ["Lei nº 8.429/1992", "Lei de Improbidade — Lei nº 8.429/1992", "LIA", "Lei de Improbidade(?: Administrativa)?"],
    ["Lei Complementar nº 101/2000", "LRF — Lei Complementar nº 101/2000", "LRF", "Lei de Responsabilidade Fiscal"],
    ["Lei nº 13.709/2018", "LGPD — Lei nº 13.709/2018", "LGPD", "Lei Geral de Proteção de Dados(?: Pessoais)?"],
    ["Lei nº 11.340/2006", "Lei Maria da Penha — Lei nº 11.340/2006", null, "Lei Maria da Penha"],
    ["Lei nº 11.343/2006", "Lei de Drogas — Lei nº 11.343/2006", null, "Lei (?:de Drogas|Antidrogas|Antitóxicos)"],
    ["Lei nº 10.741/2003", "Estatuto da Pessoa Idosa — Lei nº 10.741/2003", null, "Estatuto (?:do Idoso|da Pessoa Idosa)"],
    ["Lei nº 10.826/2003", "Estatuto do Desarmamento — Lei nº 10.826/2003", null, "Estatuto do Desarmamento"],
    ["Lei nº 10.257/2001", "Estatuto da Cidade — Lei nº 10.257/2001", null, "Estatuto da Cidade"],
    ["Lei nº 8.906/1994", "Estatuto da OAB — Lei nº 8.906/1994", null, "Estatuto da (?:Advocacia|OAB)"],
    ["Lei nº 13.146/2015", "Estatuto da Pessoa com Deficiência — Lei nº 13.146/2015", "LBI", "Estatuto da Pessoa com Deficiência|Lei Brasileira de Inclusão"],
    ["Lei nº 4.504/1964", "Estatuto da Terra — Lei nº 4.504/1964", null, "Estatuto da Terra"],
    ["Lei nº 6.001/1973", "Estatuto do Índio — Lei nº 6.001/1973", null, "Estatuto do Índio"],
    ["Lei nº 12.288/2010", "Estatuto da Igualdade Racial — Lei nº 12.288/2010", null, "Estatuto da Igualdade Racial"],
    ["Lei nº 12.852/2013", "Estatuto da Juventude — Lei nº 12.852/2013", null, "Estatuto da Juventude"],
    ["Lei Complementar nº 123/2006", "Estatuto da Microempresa — Lei Complementar nº 123/2006", null, "Estatuto (?:Nacional )?da Microempresa"],
    ["Lei nº 6.830/1980", "LEF — Lei nº 6.830/1980", "LEF", "Lei (?:de|das) Execuç(?:ão|ões) Fisca(?:l|is)"],
    ["Lei nº 11.101/2005", "Lei de Falências — Lei nº 11.101/2005", "LREF", "Lei de (?:Falências|Recuperação Judicial|Recuperação de Empresas)"],
    ["Lei nº 12.016/2009", "Lei do Mandado de Segurança — Lei nº 12.016/2009", null, "Lei do Mandado de Segurança"],
    ["Lei nº 7.347/1985", "LACP — Lei nº 7.347/1985", "LACP", "Lei da Ação Civil Pública"],
    ["Lei nº 8.072/1990", "Lei dos Crimes Hediondos — Lei nº 8.072/1990", null, "Lei (?:dos|de) Crimes Hediondos"],
    ["Lei nº 13.869/2019", "Lei de Abuso de Autoridade — Lei nº 13.869/2019", null, "(?:Nova )?Lei de Abuso de Autoridade"],
    ["Lei nº 12.846/2013", "Lei Anticorrupção — Lei nº 12.846/2013", null, "Lei Anticorrupção|Lei da Empresa Limpa"],
    ["Lei nº 12.527/2011", "LAI — Lei nº 12.527/2011", "LAI", "Lei de Acesso à Informação"],
    ["Lei nº 12.965/2014", "Marco Civil da Internet — Lei nº 12.965/2014", null, "Marco Civil da Internet"],
    ["Lei nº 8.245/1991", "Lei do Inquilinato — Lei nº 8.245/1991", null, "Lei (?:do Inquilinato|de Locações|das Locações)"],
    ["Lei nº 9.613/1998", "Lei de Lavagem de Dinheiro — Lei nº 9.613/1998", null, "Lei de Lavagem(?: de (?:Dinheiro|Capitais))?"],
    ["Lei nº 12.850/2013", "Lei das Organizações Criminosas — Lei nº 12.850/2013", null, "Lei (?:das|de) Organizações Criminosas"],
    ["Lei nº 9.307/1996", "Lei de Arbitragem — Lei nº 9.307/1996", null, "Lei de Arbitragem"],
    ["Lei nº 8.213/1991", "Lei de Benefícios — Lei nº 8.213/1991", null, "Lei de Benefícios(?: da Previdência Social)?|Plano de Benefícios da Previdência Social"],
    ["Lei nº 8.212/1991", "Lei de Custeio — Lei nº 8.212/1991", null, "Lei de Custeio(?: da (?:Seguridade|Previdência) Social)?|Lei Orgânica da Seguridade Social"],
    ["Lei nº 14.133/2021", "Nova Lei de Licitações — Lei nº 14.133/2021", "NLLC", "Nova Lei de Licitações(?: e Contratos(?: Administrativos)?)?"],
    ["Lei nº 9.099/1995", "Lei dos Juizados Especiais — Lei nº 9.099/1995", null, "Lei dos Juizados Especiais(?! Federais| da Fazenda)(?: Cíveis e Criminais)?"],
    ["Lei nº 8.112/1990", "Estatuto dos Servidores Federais — Lei nº 8.112/1990", null, "Estatuto dos Servidores Públicos (?:Civis )?(?:da União|Federais)|Regime Jurídico Único dos Servidores"],
    ["Lei nº 9.784/1999", "Lei do Processo Administrativo — Lei nº 9.784/1999", null, "Lei (?:do|de) Processo Administrativo(?: Federal)?"],
    ["Lei nº 13.964/2019", "Pacote Anticrime — Lei nº 13.964/2019", null, "Pacote Anticrime|Lei Anticrime"],
    ["Lei nº 9.605/1998", "Lei dos Crimes Ambientais — Lei nº 9.605/1998", null, "Lei (?:de|dos) Crimes Ambientais"],
    ["Lei nº 13.445/2017", "Lei de Migração — Lei nº 13.445/2017", null, "Lei de Migração"],
    ["Lei nº 8.625/1993", "Lei Orgânica Nacional do MP — Lei nº 8.625/1993", "LONMP", "Lei Orgânica Nacional do Ministério Público"],
    ["Lei Complementar nº 75/1993", "Lei Orgânica do MPU — Lei Complementar nº 75/1993", "LOMPU", "Lei Orgânica do Ministério Público da União|Estatuto do Ministério Público da União"],
    ["Lei nº 13.874/2019", "Lei de Liberdade Econômica — Lei nº 13.874/2019", null, "Lei de Liberdade Econômica|Declaração de Direitos de Liberdade Econômica"],
    ["Lei nº 14.785/2023", "Lei dos Agrotóxicos — Lei nº 14.785/2023", null, "Lei (?:de|dos) Agrotóxicos|Lei (?:de|dos) Pesticidas"],
    ["Lei nº 13.467/2017", "Reforma Trabalhista — Lei nº 13.467/2017", null, "Reforma Trabalhista"]
  ];

  // Código revogado ("CPC/73", "Código Civil de 1916") ou sigla seguida de
  // número (processo: "CC 123.456", "CP nº 7") não conta.
  var RE_DEPOIS_EXCLUI = /^\s*(?:(?:\/\s*|de\s+)(?:1916|16|1939|39|1967|67|1969|69|1973|73)\b|(?:n[ºo°.]*\s*)?\d)/i;

  // Artigo citado junto: "art. 135, III", "arts. 1º e 2º", "art. 5º, § 2º",
  // "artigo 93", e também "o inciso V do artigo 93" (vira "art. 93, V").
  var PARTE = "§§?\\s*\\d+[ºo°]?|[Ii]nc(?:iso)?s?\\.?\\s*[IVXLC]+\\b|[Pp]ar[áa]grafo\\s+[úu]nico|[Aa]l[íi]nea\\s*[\"“']?[a-z][\"”']?|caput";
  var ARTIGO = "(?:[Aa]rts?\\.?|[Aa]rtigos?)\\s*\\d+(?:\\.\\d{3})*[ºo°]?(?:-[A-Z])?" +
    "(?:(?:\\s*,\\s*|\\s+e\\s+|\\s+)(?:" + PARTE + "|[IVXLC]+\\b|\\d+(?:\\.\\d{3})*[ºo°]?(?:-[A-Z])?(?![\\w-])))*";
  var RE_ART_ANTES = new RegExp("(?:(?:o|a)\\s+)?(" + PARTE + ")?(?:\\s*,?\\s*d[oa]s?\\s+)?(" + ARTIGO + ")\\s*,?\\s*(?:d[oa]s?|n[oa]s?|pel[oa]s?|ao|à)\\s+(?:(?:atual|novo|antigo|vigente)\\s+)?$");
  var RE_ART_DEPOIS = new RegExp("^\\s*,?\\s*\\(?\\s*()(" + ARTIGO + ")");

  function artigoCitado(t, ini, fim) {
    var m = RE_ART_ANTES.exec(t.slice(Math.max(0, ini - 100), ini)) ||
            RE_ART_DEPOIS.exec(t.slice(fim, fim + 100));
    if (!m) return "";
    var art = m[2].replace(/\s+/g, " ").replace(/^artigos\s*/i, "arts. ").replace(/^artigo\s*/i, "art. ")
      .replace(/^(arts?)\.?\s*/i, function (x, a) { return a.toLowerCase() + ". "; })
      .replace(/([\dºo°]) (§)/g, "$1, $2").replace(/[\s,]+$/, "");
    var parte = (m[1] || "").replace(/\s+/g, " ").replace(/^inc(?:iso)?s?\.?\s*/i, "");
    return parte ? art + ", " + parte : art;
  }

  // "lei|lei|5172|1966" (mesmo id das leis citadas pelo número) ou
  // "num|CF/1988" quando a identificação não tem número/ano.
  function idDoNumero(numero) {
    var m = /^(Lei\s+Complementar|Lei|Decreto[\s-]Lei|Decreto)\s*n[ºo°.]*\s*(\d{1,3}(?:\.\d{3})*)\s*\/\s*(\d{4})$/i.exec(numero);
    return m ? "lei|" + tipoLei(m[1]) + "|" + m[2].replace(/\./g, "") + "|" + ano4(m[3]) : "num|" + numero;
  }

  var RE_POR_NOME = null;
  function regrasPorNome() {
    if (!RE_POR_NOME) {
      RE_POR_NOME = [];
      POR_NOME.forEach(function (l) {
        var info = { numero: l[0], rotulo: l[1], desde: l[4] || "" };
        if (l[2]) RE_POR_NOME.push({ re: new RegExp("(?<![\\wÀ-ÿ])(?:" + l[2] + ")(?:\\/(?:88|1988|2002|02|2015|15))?(?![\\wÀ-ÿ])", "g"), lei: info });
        if (l[3]) RE_POR_NOME.push({ re: new RegExp("(?<![\\wÀ-ÿ])(?:" + l[3] + ")(?![\\wÀ-ÿ])", "gi"), lei: info });
      });
    }
    return RE_POR_NOME;
  }

  function ano4(a) {
    var n = parseInt(a, 10);
    if (String(a).length === 4) return n;
    return n > 30 ? 1900 + n : 2000 + n;
  }

  function tipoLei(t) {
    var s = String(t).toLowerCase().replace(/\s+/g, " ");
    if (/^decreto[\s-]lei$/.test(s)) return "dl";
    if (s === "lc" || s === "lei complementar") return "lc";
    if (s === "decreto") return "decreto";
    return "lei";
  }

  function comPontos(num) {
    return String(num).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }

  // opcoes.data ("dd/mm/aaaa", data do julgado): "CPC" sem ano numa tese de
  // antes do CPC/2015 é o CPC/1973 (idem Código Civil de 1916) — fica de fora.
  function isoDe(data) {
    var m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(String(data || "").trim());
    return m ? m[3] + "-" + m[2] + "-" + m[1] : "";
  }

  function encontrar(texto, opcoes) {
    var t = String(texto || "");
    var dataJulgado = isoDe(opcoes && opcoes.data);
    var vistas = {}, lista = [], leis = [], m;

    function juntarLei(id, pos, artigo, dados) {
      var ja = vistas[id];
      if (!ja) {
        ja = vistas[id] = dados;
        ja.id = id; ja.classe = "lei"; ja.pos = pos; ja.artigos = [];
        leis.push(ja);
      }
      ja.pos = Math.min(ja.pos, pos);
      if (artigo && ja.artigos.indexOf(artigo) < 0) ja.artigos.push(artigo);
    }

    RE_LEI.lastIndex = 0;
    while ((m = RE_LEI.exec(t))) {
      var tipo = tipoLei(m[1]);
      var num = m[2].replace(/\./g, "");
      var ano = ano4(m[3]);
      juntarLei("lei|" + tipo + "|" + num + "|" + ano, m.index, artigoCitado(t, m.index, m.index + m[0].length),
        { tipo: tipo, numero: num, ano: ano, rotulo: NOME_TIPO_LEI[tipo] + " nº " + comPontos(num) + "/" + ano });
    }

    regrasPorNome().forEach(function (r) {
      r.re.lastIndex = 0;
      var x;
      while ((x = r.re.exec(t))) {
        var fim = x.index + x[0].length;
        var comAno = /\/\d|de 20\d\d/.test(x[0] + t.slice(fim, fim + 8));
        if (!/\/\d/.test(x[0]) && RE_DEPOIS_EXCLUI.test(t.slice(fim, fim + 12))) continue;
        if (r.lei.desde && !comAno && dataJulgado && dataJulgado < r.lei.desde) continue;
        var artigo = artigoCitado(t, x.index, fim);
        if (r.lei.desde && /\d-[A-Z]/.test(artigo)) continue; // "art. 543-C do CPC" = CPC/1973
        juntarLei(idDoNumero(r.lei.numero), x.index, artigo,
          { rotulo: r.lei.rotulo, numeroDiario: r.lei.numero });
      }
    });

    leis.sort(function (a, b) { return a.pos - b.pos; });
    // "art. 40" some quando também há "art. 40, § 2º"
    leis.forEach(function (l) {
      l.artigos = l.artigos.filter(function (a) {
        return !l.artigos.some(function (b) { return b !== a && b.indexOf(a + ",") === 0; });
      });
    });
    lista = lista.concat(leis);

    RE_NORMA.lastIndex = 0;
    while ((m = RE_NORMA.exec(t))) {
      var orgao = (m[2] || m[5] || "").toUpperCase();
      if (!orgao) continue;
      var rec = /^recomenda/i.test(m[1]);
      var n = m[3].replace(/\./g, "");
      var a = ano4(m[4]);
      var idn = "norma|" + orgao + "|" + (rec ? "rec" : "res") + "|" + n + "|" + a;
      if (vistas[idn]) continue;
      vistas[idn] = true;
      lista.push({ id: idn, classe: "norma", orgao: orgao, recomendacao: rec, numero: n, ano: a,
        rotulo: (rec ? "Recomendação " : "Resolução ") + orgao + " nº " + n + "/" + a });
    }
    return lista;
  }

  // ---- bases dos Diários ---------------------------------------------------
  // Com fetch "no-cache" (e não <script src>, que o navegador guarda por até
  // 7 dias): o navegador sempre confere se o arquivo mudou, então uma norma
  // nova nos Diários aparece aqui logo depois de publicada.
  function carregarScript(globalName, arquivo) {
    if (window[globalName]) return Promise.resolve();
    return fetch(CDN_BASE + arquivo, { cache: "no-cache" })
      .then(function (r) { if (!r.ok) throw new Error(arquivo + " " + r.status); return r.text(); })
      .then(function (code) { (0, eval)(code + "\n//# sourceURL=" + CDN_BASE + arquivo); })
      .catch(function () { /* sem a base, as normas aparecem como "fora dos Diários" */ });
  }

  var carregando = null;
  var idxLeis = null, idxNormas = null;

  function semAcento(t) {
    return String(t || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  }
  // Mesmo slug de leis-logic.js / premios-logic.js (não pode mudar).
  function slug(t) {
    return semAcento(t).replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  }

  function montarIndices() {
    idxLeis = {};
    var leis = window.LEIS_DATA || {};
    Object.keys(leis).forEach(function (mat) {
      (leis[mat].leis || []).forEach(function (l) {
        var numero = String(l.numero || "");
        if (/\([A-Z]{2}\)/.test(numero)) return; // lei estadual
        RE_LEI.lastIndex = 0;
        var m = RE_LEI.exec(numero);
        var id = m ? "lei|" + tipoLei(m[1]) + "|" + m[2].replace(/\./g, "") + "|" + ano4(m[3])
                   : "num|" + numero; // ex.: "CF/1988"
        (idxLeis[id] || (idxLeis[id] = [])).push({ chave: mat + ":" + slug(numero), nome: l.nome, numero: numero });
      });
    });

    idxNormas = {};
    var normas = window.NORMAS_DATA || {};
    Object.keys(normas).forEach(function (org) {
      (normas[org].normas || []).forEach(function (n) {
        var p = String(n.numero || "").split("/");
        if (p.length !== 2) return;
        var rec = /^recomenda/i.test(n.tipo || "");
        var id = "norma|" + org.toUpperCase() + "|" + (rec ? "rec" : "res") + "|" + p[0].replace(/\./g, "") + "|" + ano4(p[1]);
        idxNormas[id] = { org: org, tipo: n.tipo, numero: n.numero, ementa: n.ementa };
      });
    });
  }

  function carregar() {
    if (!carregando) {
      carregando = Promise.all([
        carregarScript("LEIS_DATA", "leis-data.js"),
        carregarScript("NORMAS_DATA", "normas-data.js")
      ]).then(montarIndices);
    }
    return carregando;
  }

  // ---- leituras --------------------------------------------------------------
  function lerMapa(chave) {
    try { return JSON.parse(localStorage.getItem(chave) || "{}") || {}; } catch (e) { return {}; }
  }

  function linkOficial(n) {
    if (n.classe === "norma" && n.orgao === "CNJ") {
      return "https://atos.cnj.jus.br/atos?atos=sim&numero=" + n.numero + "&ano=" + n.ano;
    }
    return "https://www.lexml.gov.br/busca/search?keyword=" + encodeURIComponent(n.rotulo);
  }

  // { rotulo, nome, noDiario, lida, href, externo }
  function resolver(n) {
    if (!idxLeis) montarIndices();
    if (n.classe === "lei") {
      var achadas = idxLeis[n.id];
      if (achadas && achadas.length) {
        var lidas = lerMapa("leis-lidas");
        var lida = achadas.some(function (a) { var v = lidas[a.chave]; return !!(v && v.lida); });
        return { rotulo: n.rotulo, artigos: n.artigos || [], nome: achadas[0].nome, noDiario: true, lida: lida, externo: false,
          href: PAGINA_LEIS + "#lei=" + encodeURIComponent(achadas[0].chave) };
      }
    } else {
      var norma = idxNormas[n.id];
      if (norma) {
        var v = lerMapa("normas-lidas")[norma.org + ":" + norma.numero];
        return { rotulo: n.rotulo, nome: norma.ementa, noDiario: true, lida: !!(v && v.lida), externo: false,
          href: PAGINA_NORMAS + "#norma=" + encodeURIComponent(norma.org + ":" + norma.tipo + ":" + norma.numero) };
      }
    }
    return { rotulo: n.rotulo, artigos: n.artigos || [], nome: "", noDiario: false, lida: false, externo: true, href: linkOficial(n) };
  }

  window.NormasCitadas = { encontrar: encontrar, carregar: carregar, resolver: resolver };
})();
