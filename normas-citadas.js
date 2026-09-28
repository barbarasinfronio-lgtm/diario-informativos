/*
 * normas-citadas.js — acha, num texto, as leis e resoluções citadas pelo
 * número (ex.: "Lei nº 11.340/2006", "Resolução CNJ nº 547/2024") e diz,
 * para cada uma, se ela está no Diário de Leis / Diário das Resoluções e se a
 * pessoa já marcou como lida.
 *
 * Uso (ex.: no card aberto do Diário das Decisões):
 *   var achadas = NormasCitadas.encontrar(texto);      // na hora, sem baixar nada
 *   NormasCitadas.carregar().then(function () {        // baixa leis-data.js e normas-data.js
 *     achadas.map(NormasCitadas.resolver);             // { rotulo, nome, noDiario, lida, href, externo }
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
  var RE_NORMA = /\b(Resolu[çc][ãa]o|Res\.|Recomenda[çc][ãa]o)\s+(?:(?:do|da)\s+)?(CNJ|CNMP|CONAMA|CONANDA)?\s*(?:n[ºo°.]*\s*)?(\d{1,4}(?:\.\d{3})*)\s*\/\s*(\d{4}|\d{2})\b(?:\s*,?\s*(?:do|da)\s+(CNJ|CNMP|CONAMA|CONANDA))?/gi;

  var NOME_TIPO_LEI = { lei: "Lei", lc: "Lei Complementar", dl: "Decreto-Lei", decreto: "Decreto" };

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

  function encontrar(texto) {
    var t = String(texto || "");
    var vistas = {}, lista = [], m;

    RE_LEI.lastIndex = 0;
    while ((m = RE_LEI.exec(t))) {
      var tipo = tipoLei(m[1]);
      var num = m[2].replace(/\./g, "");
      var ano = ano4(m[3]);
      var id = "lei|" + tipo + "|" + num + "|" + ano;
      if (vistas[id]) continue;
      vistas[id] = true;
      lista.push({ id: id, classe: "lei", tipo: tipo, numero: num, ano: ano,
        rotulo: NOME_TIPO_LEI[tipo] + " nº " + comPontos(num) + "/" + ano });
    }

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
        if (!m) return;
        var id = "lei|" + tipoLei(m[1]) + "|" + m[2].replace(/\./g, "") + "|" + ano4(m[3]);
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
        return { rotulo: n.rotulo, nome: achadas[0].nome, noDiario: true, lida: lida, externo: false,
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
    return { rotulo: n.rotulo, nome: "", noDiario: false, lida: false, externo: true, href: linkOficial(n) };
  }

  window.NormasCitadas = { encontrar: encontrar, carregar: carregar, resolver: resolver };
})();
