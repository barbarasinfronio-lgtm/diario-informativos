/*
 * revisoes.js — abas "Histórico" e "Revisões" da página "Meu Progresso".
 * Carregado por premios-logic.js só quando precisa (fetch sem cache).
 *
 * Histórico: tudo o que a pessoa marcou como lido nos Diários (Informativos,
 * Leis, Súmulas, Resoluções, Decisões, Constitucionalidade e Reclamações),
 * do mais recente para o mais antigo, mais as revisões feitas.
 *
 * Revisões: quando reler cada súmula, lei, decisão/tese e informativo já lidos.
 *   Revisão ESPAÇADA: 1 dia, 7 dias, 30 dias e 90 dias depois da leitura; depois,
 *   de tempos em tempos (ESTAGIOS_DIAS e a regra de cada item):
 *   - Súmulas, decisões e informativos: a cada 6 meses.
 *   - Leis principais (CF, CC, CPC, CP, CPP e ECA): a cada 6 meses.
 *   - Demais leis: pelo número de decisões do Diário das Decisões que as
 *     citam (normas-citadas.js) — veja FAIXAS abaixo.
 *   - Leis do acervo alteradas desde a última visita (leis/alteracoes.json,
 *     gerado pelo robô do Mac): aparecem como sugestão de revisão MESMO que a
 *     pessoa nunca tenha marcado a lei como lida. No primeiro acesso vale a
 *     data inicial (31/08/2026); depois, a data da visita anterior (guardada
 *     por estudamana-header.js em "estudamana-visitas").
 * A contagem começa na data da leitura (ou da última revisão). "Revisei hoje"
 * guarda a data neste navegador ("revisoes-feitas") e na conta
 * (progress-premios/<uid>, campo "revisoes").
 *
 * Uso (premios-logic.js):
 *   ProgressoRevisoes.preparar().then(...)            // baixa o que falta
 *   ProgressoRevisoes.render(el, { tab, maps, rev, salvarRev })
 *   ProgressoRevisoes.resumo({ maps, rev })            // cartão do Resumo
 */
(function () {
  "use strict";
  if (window.ProgressoRevisoes) return;

  var CDN = "https://barbarasinfronio-lgtm.github.io/diario-informativos/";
  var REV_KEY = "revisoes-feitas";
  var PAGINA_LEIS = "/p/diario-de-leis.html";

  // ---- regras ---------------------------------------------------------------
  var SUMULA_MESES = 6;
  var DECISAO_MESES = 6;
  // revisão espaçada: as 4 primeiras revisões (dias depois da leitura / da revisão anterior);
  // da 5ª em diante vale o intervalo longo de cada item (meses)
  var ESTAGIOS_DIAS = [1, 7, 30, 90];
  var PRINCIPAIS = {
    "CF/1988": "Constituição Federal",
    "Lei nº 10.406/2002": "Código Civil",
    "Lei nº 13.105/2015": "CPC",
    "Decreto-Lei nº 2.848/1940": "Código Penal",
    "Decreto-Lei nº 3.689/1941": "CPP",
    "Lei nº 8.069/1990": "ECA"
  };
  var PRINCIPAL_MESES = 6;
  // demais leis: quanto mais citada nas decisões, mais curto o intervalo
  var FAIXAS = [
    { min: 10, meses: 6,  nome: "citada em 10 ou mais decisões" },
    { min: 3,  meses: 12, nome: "citada em 3 a 9 decisões" },
    { min: 1,  meses: 18, nome: "citada em 1 ou 2 decisões" },
    { min: 0,  meses: 24, nome: "ainda não citada nas decisões" }
  ];

  // ---- utilidades -------------------------------------------------------------
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function slug(t) {
    return String(t || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  }
  function pad(n) { return String(n).padStart(2, "0"); }
  function hoje() {
    var d = new Date();
    return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate());
  }
  function isoOk(s) { return typeof s === "string" && /^\d{4}-\d{2}-\d{2}/.test(s); }
  function dia(s) { return isoOk(s) ? s.slice(0, 10) : null; }
  function diaNum(iso) { var p = iso.split("-"); return Math.round(Date.UTC(+p[0], +p[1] - 1, +p[2]) / 864e5); }
  function somaMeses(iso, n) {
    var p = iso.split("-"), d = new Date(Date.UTC(+p[0], +p[1] - 1 + n, +p[2]));
    return d.getUTCFullYear() + "-" + pad(d.getUTCMonth() + 1) + "-" + pad(d.getUTCDate());
  }
  function somaDias(iso, n) {
    var p = iso.split("-"), d = new Date(Date.UTC(+p[0], +p[1] - 1, +p[2] + n));
    return d.getUTCFullYear() + "-" + pad(d.getUTCMonth() + 1) + "-" + pad(d.getUTCDate());
  }
  var MESES = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];
  function fmt(iso) { return iso.slice(8, 10) + "/" + iso.slice(5, 7) + "/" + iso.slice(0, 4); }
  function plural(n, um, varios) { return n + " " + (n === 1 ? um : varios); }
  function lida(v) {
    if (v === true) return { em: null };
    if (typeof v === "string") return { em: dia(v) };           // Constitucionalidade/Reclamações: data ISO
    if (v && typeof v === "object" && v.lida) return { em: dia(v.lidaEm) };
    return null;
  }
  var lida_ = lida;   // (alias: "lida" também é nome de variável em alguns pontos)
  function g(nome) { return typeof window[nome] !== "undefined" ? window[nome] : undefined; }

  function lerRevLocal() {
    try { return JSON.parse(localStorage.getItem(REV_KEY) || "{}") || {}; } catch (e) { return {}; }
  }
  // junta revisões deste navegador e da conta (datas sem repetir)
  function juntarRev(remoto) {
    var out = lerRevLocal();
    Object.keys(remoto || {}).forEach(function (k) {
      var set = {};
      (out[k] || []).concat(remoto[k] || []).forEach(function (d) { if (isoOk(d)) set[d] = true; });
      out[k] = Object.keys(set).sort();
    });
    return out;
  }

  // ---- dados que esta página ainda não tem ------------------------------------
  function carregarJs(global, arquivo) {
    if (window[global]) return Promise.resolve();
    return fetch(CDN + arquivo, { cache: "no-cache" })
      .then(function (r) { if (!r.ok) throw new Error(arquivo); return r.text(); })
      .then(function (code) { (0, eval)(code + "\n//# sourceURL=" + CDN + arquivo); })
      .catch(function () {});
  }
  var tst = null;
  function carregarTst() {
    if (tst) return Promise.resolve();
    return fetch(CDN + "tst/decisoes.json", { cache: "no-cache" })
      .then(function (r) { return r.ok ? r.json() : []; })
      .then(function (d) { tst = Array.isArray(d) ? d : (d.itens || d.decisoes || []); })
      .catch(function () { tst = []; });
  }

  // ---- leis alteradas desde a última visita ---------------------------------------
  // leis/alteracoes.json: por lei (chave = slug do número), "ultimaAlteracao"
  // (data da norma que alterou por último, lida das notas do Planalto) e
  // "mudancas" (alterações novas, com a data em que o robô as percebeu).
  var DATA_INICIAL_ALTERACOES = "2026-08-31";   // cálculo inicial (1º acesso)
  var VISITAS_KEY = "estudamana-visitas";
  // Data a partir da qual as alterações contam: a da visita anterior, ou, se
  // não houver (1º acesso), a data inicial.
  // o = opções da página: com login, "visitaAnterior" vem da conta (string
  // AAAA-MM-DD, ou null se ainda não havia visita); sem login (undefined),
  // vale o que estiver neste navegador.
  function dataBaseAlteracoes(o) {
    if (o && o.visitaAnterior !== undefined) {
      return isoOk(o.visitaAnterior) ? { iso: dia(o.visitaAnterior), inicial: false } : { iso: DATA_INICIAL_ALTERACOES, inicial: true };
    }
    try {
      var v = JSON.parse(localStorage.getItem(VISITAS_KEY) || "{}") || {};
      if (isoOk(v.anterior)) return { iso: dia(v.anterior), inicial: false };
    } catch (e) {}
    return { iso: DATA_INICIAL_ALTERACOES, inicial: true };
  }
  var VISTAS_ALT_KEY = "revisoes-alteracoes-vistas";
  var alteracoes = null;
  function carregarAlteracoes() {
    if (alteracoes) return Promise.resolve();
    return fetch(CDN + "leis/alteracoes.json", { cache: "no-cache" })
      .then(function (r) { return r.ok ? r.json() : {}; })
      .then(function (j) { alteracoes = (j && j.leis) || {}; })
      .catch(function () { alteracoes = {}; });
  }
  function lerVistasAlt() {
    try { return JSON.parse(localStorage.getItem(VISTAS_ALT_KEY) || "{}") || {}; } catch (e) { return {}; }
  }
  // endereço da lei no Diário de Leis do blog (#lei=<matéria>:<número em slug>)
  function hrefLeiNoBlog(chave) {
    var leis = g("LEIS_DATA") || {}, achada = "";
    Object.keys(leis).some(function (mat) {
      return (leis[mat].leis || []).some(function (l) { if (slug(l.numero) === chave) { achada = mat + ":" + chave; return true; } });
    });
    return PAGINA_LEIS + (achada ? "#lei=" + encodeURIComponent(achada) : "");
  }
  function leisAlteradas(maps, o) {
    if (!alteracoes) return [];
    var hojeN = diaNum(hoje()), baseN = diaNum(dataBaseAlteracoes(o).iso), vistas = lerVistasAlt(), lidas = (maps && maps.lei) || {}, out = [];
    Object.keys(alteracoes).forEach(function (chave) {
      var l = alteracoes[chave], datas = [], normas = [];
      if (dia(l.ultimaAlteracao)) { datas.push(dia(l.ultimaAlteracao)); if (l.ultimaNorma) normas.push(l.ultimaNorma); }
      (l.mudancas || []).forEach(function (m) {
        if (dia(m.detectadoEm)) { datas.push(dia(m.detectadoEm)); (m.normas || []).forEach(function (n) { if (normas.indexOf(n) < 0) normas.push(n); }); }
      });
      // só alterações desde a data-base (inclusive), sem datas futuras
      var recentes = datas.filter(function (d) { var n = diaNum(d); return n >= baseN && n <= hojeN; }).sort();
      if (!recentes.length) return;
      var quando = recentes[recentes.length - 1];
      var aprox = !!(l.ultimaAprox && dia(l.ultimaAlteracao) === quando && !(l.mudancas || []).some(function (m) { return dia(m.detectadoEm) === quando; }));
      if (vistas[chave] && vistas[chave] >= quando) return;      // "Já vi": só volta se houver alteração mais nova
      var lida = null;
      Object.keys(lidas).forEach(function (k) {
        if (k.split(":").slice(1).join(":") !== chave) return;
        var e = lida_(lidas[k]);
        if (e && (!lida || (e.em && (!lida.em || e.em > lida.em)))) lida = e;
      });
      out.push({ chave: chave, nome: l.nome, numero: l.numero, link: l.link, quando: quando, aprox: aprox, normas: normas, lida: lida });
    });
    return out.sort(function (a, b) { return a.quando < b.quando ? 1 : a.quando > b.quando ? -1 : 0; });
  }

  var citacoes = null;   // id da lei (normas-citadas) -> nº de decisões que a citam
  // Prioridade pelo que mais cai em prova (leve/cobrancas.json, de provas/cobrancas.json):
  // nível 3 = muito cobrado, 2 = cobrado em várias provas, 1 = cobrado uma vez, 0 = sem cobrança conhecida.
  // Nível alto → revisa primeiro e com intervalo longo mais curto.
  var COBRANCA = null;
  var NIVEL = { 3: { meses: 3, nome: "muito cobrado" }, 2: { meses: 4, nome: "cobrado" }, 1: { meses: 99, nome: "cobrado 1 vez" }, 0: { meses: 99, nome: "" } };
  function carregarCobrancas() {
    return jsonOu("leve/cobrancas.json").then(function (j) { COBRANCA = j; }).catch(function () { COBRANCA = null; });
  }
  function nivelPorProvas(n) { return n >= 5 ? 3 : n >= 2 ? 2 : n >= 1 ? 1 : 0; }
  function prioridade(it, citas) {
    // devolve { nivel, motivo } para o item; a lei usa as decisões que a citam e ser lei principal
    var n = 0, nivel = 0, txt = "";
    if (it.tipo === "Súmula" || it.tipo === "Decisão") {
      n = (COBRANCA && COBRANCA.itens && COBRANCA.itens[it.id]) || 0;
      nivel = nivelPorProvas(n);
      txt = n ? "cobrado em " + plural(n, "prova", "provas") : "";
    } else if (it.tipo === "Informativo") {
      var e = COBRANCA && COBRANCA.inf && COBRANCA.inf[it.id.slice(4)];
      if (e) { nivel = e[0] >= 4 ? 3 : e[0] >= 2 ? 2 : 1; txt = plural(e[0], "julgado já cobrado", "julgados já cobrados") + " em provas"; }
    } else if (it.tipo === "Lei") {
      var principal = !!(it.motivo && /^lei principal/.test(it.motivo));
      nivel = principal ? 3 : citas >= 10 ? 2 : citas >= 3 ? 1 : 0;
      txt = principal ? "lei de base das provas" : citas >= 3 ? "citada em " + citas + " decisões" : "";
    }
    return { nivel: nivel, motivo: txt };
  }

  var decisoesPorId = null;
  var preparando = null;
  // leve/ (scripts/gerar_leves.js): títulos das decisões e contagem de citações
  // já prontos, em vez de baixar ~4 MB de decisões para calcular aqui
  function lerLeve(j) {
    var campos = j.campos || [], tab = j.tabelas || {};
    return (j.linhas || []).map(function (l) {
      var d = {};
      for (var i = 0; i < campos.length && i < l.length; i++) {
        var k = campos[i], v = l[i];
        if (tab[k]) { if (v) d[k] = tab[k][v - 1]; } else if (v !== 0 && v !== "" && v != null) d[k] = v;
      }
      return d;
    });
  }
  function jsonOu(arquivo) {
    return fetch(CDN + arquivo, { cache: "no-cache" }).then(function (r) { if (!r.ok) throw new Error(arquivo); return r.json(); });
  }
  function prepararCompleto() {   // jeito antigo, se a pasta leve/ não responder
    return Promise.all([carregarJs("RG_REPETITIVOS_DATA", "rg-repetitivos-data.js"), carregarTst()]).then(function () {
      var todas = (g("RG_REPETITIVOS_DATA") || []).concat(tst || []);
      decisoesPorId = {};
      citacoes = {};
      todas.forEach(function (d) {
        decisoesPorId[String(d.id)] = d;
        if (!window.NormasCitadas) return;
        NormasCitadas.encontrar([d.titulo, d.tese, d.questao, d.destaque].join(" "), { data: d.data })
          .forEach(function (n) { if (n.classe === "lei") citacoes[n.id] = (citacoes[n.id] || 0) + 1; });
      });
    });
  }
  function preparar() {
    if (!preparando) {
      preparando = Promise.all([
        carregarJs("NormasCitadas", "normas-citadas.js"),
        carregarJs("LEIS_DATA", "leis-data.js"),
        carregarJs("SUMULAS_DATA", "sumulas-data.js"),
        carregarAlteracoes(),
        carregarCobrancas()
      ]).then(function () {
        return jsonOu("leve/citacoes.json").then(function (r) {
          citacoes = r.citacoes || {};
        }).catch(prepararCompleto);
      });
    }
    return preparando;
  }
  // títulos das decisões: só para o Histórico, e só se a pessoa leu alguma
  var titulosP = null;
  function prepararTitulos() {
    if (decisoesPorId) return Promise.resolve();
    if (!titulosP) {
      titulosP = jsonOu("leve/decisoes.json").then(function (j) {
        decisoesPorId = {};
        lerLeve(j).forEach(function (d) { decisoesPorId[String(d.id)] = d; });
      }).catch(function () { titulosP = null; return prepararCompleto(); });
    }
    return titulosP;
  }
  function pronto() { return !!citacoes; }

  function citacoesDaLei(numero) {
    if (!window.NormasCitadas || !citacoes) return 0;
    var a = NormasCitadas.encontrar(numero).filter(function (n) { return n.classe === "lei"; });
    return a.length ? (citacoes[a[0].id] || 0) : 0;
  }

  // ---- revisões ---------------------------------------------------------------
  function regraDaLei(numero) {
    if (PRINCIPAIS[numero]) return { meses: PRINCIPAL_MESES, motivo: "lei principal: " + PRINCIPAIS[numero] };
    var c = citacoesDaLei(numero);
    for (var i = 0; i < FAIXAS.length; i++) {
      if (c >= FAIXAS[i].min) return { meses: FAIXAS[i].meses, motivo: c ? plural(c, "decisão cita", "decisões citam") + " esta lei" : FAIXAS[i].nome };
    }
  }

  function itensDeRevisao(maps, rev) {
    var out = [], hojeIso = hoje(), hojeN = diaNum(hojeIso);

    // Leis: a mesma lei pode estar em várias matérias — uma revisão só
    var leis = g("LEIS_DATA") || {}, porNumero = {};
    Object.keys(leis).forEach(function (mat) {
      (leis[mat].leis || []).forEach(function (l) {
        var chave = mat + ":" + slug(l.numero);
        var e = lida((maps.lei || {})[chave]);
        if (!e) return;
        var x = porNumero[l.numero] || (porNumero[l.numero] = { numero: l.numero, nome: l.nome, chave: chave, em: null });
        if (e.em && (!x.em || e.em > x.em)) x.em = e.em;
      });
    });
    Object.keys(porNumero).forEach(function (num) {
      var l = porNumero[num], r = regraDaLei(num);
      out.push({ id: "lei:" + slug(num), tipo: "Lei", titulo: l.nome, sub: num, lidaEm: l.em, meses: r.meses, motivo: r.motivo, citas: citacoesDaLei(num),
        href: PAGINA_LEIS + "#lei=" + encodeURIComponent(l.chave) });
    });

    // Súmulas
    var sums = g("SUMULAS_DATA") || {};
    Object.keys(sums).forEach(function (org) {
      var b = sums[org];
      if (!b || !b.sumulas) return;
      b.sumulas.forEach(function (s) {
        var e = lida((maps.sum || {})[org + ":" + s.numero]);
        if (!e) return;
        out.push({ id: "sum:" + org + ":" + s.numero, tipo: "Súmula", titulo: "Súmula " + s.numero + " — " + (b.label || org.toUpperCase()),
          sub: String(s.texto || "").slice(0, 140), lidaEm: e.em, meses: SUMULA_MESES, motivo: "súmula", href: "/p/diario-das-sumulas.html#cad=" + encodeURIComponent(org + "|" + s.numero) });
      });
    });

    // Decisões e teses lidas no Diário das Decisões (títulos de leve/decisoes.json)
    var dmap = maps.dec || {};
    Object.keys(dmap).forEach(function (k) {
      var e = lida(dmap[k]); if (!e) return;
      var d = decisoesPorId && decisoesPorId[k];
      var titulo = d ? (d.orgao || "") + " · " + (d.precedenteLabel || "Tema") + " " + (d.tema || "") + " — " + (d.titulo || "") : "Decisão " + k;
      out.push({ id: "dec:" + k, tipo: "Decisão", titulo: titulo.replace(/\s+/g, " ").trim(), sub: d ? (d.processo || "") : "", lidaEm: e.em,
        meses: DECISAO_MESES, motivo: "decisão ou tese", href: "/p/diario-das-decisoes.html#abrir=" + encodeURIComponent(k) + "&busca=" + encodeURIComponent((d && (d.processo || d.titulo)) || "") });
    });
    // Informativos lidos
    Object.keys(maps.inf || {}).forEach(function (k) {
      var e = lida(maps.inf[k]); if (!e) return;
      var p = k.split(":");
      out.push({ id: "inf:" + k, tipo: "Informativo", titulo: "Informativo " + String(p[0]).toUpperCase() + " nº " + p[2] + "/" + p[1], sub: "", lidaEm: e.em,
        meses: DECISAO_MESES, motivo: "informativo", href: "/p/diario-dos-informativos.html#cad=" + encodeURIComponent(p[0] + "|" + p[2]) });
    });

    out.forEach(function (it) {
      var pr = prioridade(it, it.citas || 0);
      it.nivel = pr.nivel; it.cobrado = pr.motivo;
      if (it.meses > NIVEL[pr.nivel].meses) { it.meses = NIVEL[pr.nivel].meses; it.motivo = NIVEL[pr.nivel].nome + (pr.motivo ? " (" + pr.motivo + ")" : ""); }
      var feitas = (rev[it.id] || []).filter(function (d) { return !it.lidaEm || d >= it.lidaEm; });
      it.ultimaRev = feitas.length ? feitas[feitas.length - 1] : null;
      it.nRev = feitas.length;                       // revisões já feitas desde a leitura
      var base = [it.lidaEm, it.ultimaRev].filter(Boolean).sort().pop() || null;
      it.base = base;
      if (!base) { it.estado = "semdata"; return; }
      // leitura antiga: pula as revisões curtas que já passaram (lida há 7+ dias começa na de 7; há 30+, na de 30;
      // há 90+, na de 90). A idade que vale é a da leitura até a 1ª revisão (ou até hoje, se ainda não houve nenhuma).
      var k0 = 0;
      if (it.lidaEm) {
        var idade = (feitas.length ? diaNum(feitas[0]) : hojeN) - diaNum(it.lidaEm);
        for (var q = ESTAGIOS_DIAS.length - 1; q >= 1; q--) { if (idade >= ESTAGIOS_DIAS[q]) { k0 = q; break; } }
      }
      var est = it.nRev + k0;                         // posição na sequência 1 · 7 · 30 · 90 · longo
      if (est < ESTAGIOS_DIAS.length) {
        it.intervalo = plural(ESTAGIOS_DIAS[est], "dia", "dias");
        it.vence = somaDias(base, ESTAGIOS_DIAS[est]);
        it.fase = "revisão " + (it.nRev + 1) + (k0 ? " (começa em " + ESTAGIOS_DIAS[k0] + " dias: leitura antiga)" : " de " + (ESTAGIOS_DIAS.length + 1));
      } else {
        it.intervalo = "a cada " + it.meses + " meses";
        it.vence = somaMeses(base, it.meses);
        it.fase = "revisão " + (it.nRev + 1);
      }
      it.dias = diaNum(it.vence) - hojeN;
      it.estado = it.dias <= 0 ? "agora" : it.dias <= 30 ? "breve" : "emdia";
    });
    return out;
  }

  function contar(itens) {
    var c = { agora: 0, breve: 0, emdia: 0, semdata: 0 };
    itens.forEach(function (i) { c[i.estado]++; });
    return c;
  }

  // ---- histórico ---------------------------------------------------------------
  var TIPOS = [
    { id: "inf", nome: "Informativos" }, { id: "lei", nome: "Leis" }, { id: "sum", nome: "Súmulas" },
    { id: "norma", nome: "Resoluções" }, { id: "dec", nome: "Decisões" },
    { id: "adi", nome: "Constitucionalidade" }, { id: "rcl", nome: "Reclamações" }, { id: "rev", nome: "Revisões" }
  ];
  function eventos(maps, rev) {
    var ev = [], semData = 0;
    function add(tipo, em, titulo, href) {
      if (!em) { semData++; return; }
      ev.push({ tipo: tipo, em: em, titulo: titulo, href: href || "" });
    }
    Object.keys(maps.inf || {}).forEach(function (k) {
      var e = lida(maps.inf[k]); if (!e) return;
      var p = k.split(":");
      add("inf", e.em, "Informativo " + String(p[0]).toUpperCase() + " nº " + p[2] + "/" + p[1]);
    });
    var leis = g("LEIS_DATA") || {}, nomeLei = {};
    Object.keys(leis).forEach(function (m) { (leis[m].leis || []).forEach(function (l) { nomeLei[m + ":" + slug(l.numero)] = l.nome + " — " + l.numero; }); });
    Object.keys(maps.lei || {}).forEach(function (k) {
      var e = lida(maps.lei[k]); if (!e) return;
      add("lei", e.em, nomeLei[k] || k, PAGINA_LEIS + "#lei=" + encodeURIComponent(k));
    });
    var sums = g("SUMULAS_DATA") || {};
    Object.keys(maps.sum || {}).forEach(function (k) {
      var e = lida(maps.sum[k]); if (!e) return;
      var p = k.split(":"), b = sums[p[0]];
      add("sum", e.em, "Súmula " + p[1] + " — " + ((b && b.label) || String(p[0]).toUpperCase()));
    });
    Object.keys(maps.norma || {}).forEach(function (k) {
      var e = lida(maps.norma[k]); if (!e) return;
      var i = k.indexOf(":");
      add("norma", e.em, String(k.slice(0, i)).toUpperCase() + " nº " + k.slice(i + 1));
    });
    Object.keys(maps.dec || {}).forEach(function (k) {
      var e = lida(maps.dec[k]); if (!e) return;
      var d = decisoesPorId && decisoesPorId[k];
      add("dec", e.em, d ? (d.orgao || "") + " · " + (d.precedenteLabel || "Tema") + " " + d.tema + " — " + d.titulo : "Decisão " + k);
    });
    [["adi", maps.adi], ["rcl", maps.rcl]].forEach(function (par) {
      Object.keys(par[1] || {}).forEach(function (k) {
        var e = lida(par[1][k]); if (!e) return;
        var p = k.split("_");   // STF_ADI_7641_20260925_15066 · STF_Rcl_100475
        add(par[0], e.em, p.length > 2 ? p[1] + " " + p[2] : k);
      });
    });
    var nomes = {};
    itensDeRevisao(maps, {}).forEach(function (i) { nomes[i.id] = i.titulo; });
    Object.keys(rev || {}).forEach(function (k) {
      (rev[k] || []).forEach(function (d) { add("rev", d, "Revisão: " + (nomes[k] || k)); });
    });
    ev.sort(function (a, b) { return a.em < b.em ? 1 : a.em > b.em ? -1 : 0; });
    return { lista: ev, semData: semData };
  }

  // ---- tela ---------------------------------------------------------------------
  var ui = { filtro: "todos", limiteHist: 80, verTodos: {}, confirmar: null };

  function linhaRev(it) {
    var quando = it.estado === "semdata" ? "leitura sem data"
      : it.dias < 0 ? "venceu há " + plural(-it.dias, "dia", "dias")
      : it.dias === 0 ? "vence hoje"
      : "vence em " + fmt(it.vence);
    var base = it.base ? (it.ultimaRev && it.ultimaRev === it.base ? "revisada em " : "lida em ") + fmt(it.base) + " · " : "";
    var selo = it.nivel ? '<span class="rv-cob rv-cob' + it.nivel + '" title="' + esc(it.cobrado) + '">' + (it.nivel === 3 ? "🔥 " : "📝 ") + esc(NIVEL[it.nivel].nome) + "</span> " : "";
    var plano = it.fase ? it.fase + " (" + it.intervalo + (/meses/.test(it.intervalo) ? ", " + it.motivo : "") + ")" : "";
    return '<li class="rv-item rv-' + it.estado + '">' +
      '<span class="rv-tipo">' + esc(it.tipo) + "</span>" +
      '<div class="rv-texto"><b>' + esc(it.titulo) + "</b>" +
        '<span class="rv-meta">' + selo + esc((it.cobrado ? it.cobrado + " · " : "") + base + plano + " · " + quando) + "</span></div>" +
      '<div class="rv-acoes">' + (it.href ? '<a class="rv-abrir" href="' + esc(it.href) + '" target="_blank" rel="noopener">Abrir</a>' : "") +
        '<button type="button" class="rv-feito" data-rev="' + esc(it.id) + '">✔ Revisei hoje</button></div>' +
    "</li>";
  }

  function linhaAlt(a) {
    var leitura = a.lida ? (a.lida.em ? "você leu em " + fmt(a.lida.em) : "você já leu") : "você ainda não leu";
    return '<li class="rv-item rv-agora">' +
      '<span class="rv-tipo">Lei alterada</span>' +
      '<div class="rv-texto"><b>' + esc(a.nome) + "</b>" +
        '<span class="rv-meta">' + esc(a.numero + " · alterada " + (a.aprox ? "por volta de " : "em ") + fmt(a.quando) + (a.aprox ? " (data estimada)" : "") +
          (a.normas.length ? " por " + a.normas.join(", ") : "") + " · " + leitura) + "</span></div>" +
      '<div class="rv-acoes">' + '<a class="rv-abrir" href="' + esc(hrefLeiNoBlog(a.chave)) + '" target="_blank" rel="noopener">Abrir no blog</a>' +
        '<button type="button" class="rv-feito" data-alt-visto="' + esc(a.chave) + '" data-alt-em="' + esc(a.quando) + '">✔ Já vi</button></div>' +
    "</li>";
  }

  function textoBaseAlt(o) {
    var b = dataBaseAlteracoes(o);
    return b.inicial ? "desde " + fmt(b.iso) : "desde a sua última visita (" + fmt(b.iso) + ")";
  }
  function blocoAlteradas(alts, o) {
    return '<details class="rv-bloco" open><summary><span>📢 Leis alteradas ' + textoBaseAlt(o) + '</span><span class="rv-n">' + alts.length + "</span></summary>" +
      (alts.length ? '<ul class="rv-lista">' + alts.map(linhaAlt).join("") + "</ul>" +
        '<p class="rv-nota">Aparecem mesmo que você nunca tenha marcado a lei como lida. “Já vi” esconde o aviso até uma nova alteração.</p>'
        : '<p class="rv-vazio">Nenhuma lei do acervo foi alterada ' + textoBaseAlt(o) + ".</p>") +
      "</details>";
  }

  function listaRev(titulo, itens, id, aberto, vazio) {
    var LIM = 40, todos = ui.verTodos[id], mostrar = todos ? itens : itens.slice(0, LIM);
    var lote = "";
    if (itens.length > 1 && (id === "agora" || id === "semdata")) {      // limpar o atraso de uma vez (com confirmação na própria tela)
      lote = ui.confirmar === id
        ? '<div class="rv-lote"><span>Marcar <b>' + itens.length + '</b> itens como revisados hoje?</span>' +
          '<button type="button" class="rv-feito" data-lote-sim="' + id + '">✔ Sim, marcar todos</button>' +
          '<button type="button" class="rv-mais" data-lote-nao="1">Cancelar</button></div>'
        : '<div class="rv-lote"><button type="button" class="rv-mais" data-lote="' + id + '">✔ Revisei todos deste bloco (' + itens.length + ")</button></div>";
    }
    return '<details class="rv-bloco"' + (aberto ? " open" : "") + '><summary><span>' + titulo + '</span><span class="rv-n">' + itens.length + "</span></summary>" + lote +
      (itens.length ? '<ul class="rv-lista">' + mostrar.map(linhaRev).join("") + "</ul>" +
        (itens.length > mostrar.length ? '<button type="button" class="rv-mais" data-todos="' + id + '">Mostrar todas (' + itens.length + ")</button>" : "")
        : '<p class="rv-vazio">' + vazio + "</p>") +
      "</details>";
  }

  function telaRevisoes(o) {
    var itens = itensDeRevisao(o.maps, o.rev), c = contar(itens), alts = leisAlteradas(o.maps, o);
    // o que mais cai em prova vem primeiro; dentro do mesmo nível, o mais atrasado
    var por = function (e) { return itens.filter(function (i) { return i.estado === e; }).sort(function (a, b) { return (b.nivel - a.nivel) || (a.dias - b.dias); }); };
    var regra = '<details class="rv-regra"><summary>Como as revisões são calculadas</summary><ul>' +
      "<li><b>Revisão espaçada:</b> a 1ª revisão é 1 dia depois da leitura, a 2ª 7 dias depois, a 3ª 30 dias e a 4ª 90 dias depois da revisão anterior. Da 5ª em diante o intervalo é longo e depende do item:</li>" +
      "<li><b>Prioridade pelo que mais cai em prova:</b> cada súmula, decisão ou tese é comparada com as provas de concurso já analisadas (as mesmas da página de estatísticas de cobrança). 🔥 <b>Muito cobrado</b> (5 ou mais provas, lei de base como CF/CC/CPC/CP/CPP/ECA, ou informativo com 4+ julgados cobrados) é revisado a cada 3 meses; 📝 <b>cobrado</b> (2 a 4 provas) a cada 4 meses. Dentro de cada bloco, esses itens aparecem primeiro.</li>" +
      "<li><b>Demais súmulas, decisões, teses e informativos:</b> a cada " + SUMULA_MESES + " meses.</li>" +
      "<li><b>Leis principais</b> (CF, Código Civil, CPC, Código Penal, CPP e ECA): a cada 3 meses (são 🔥 muito cobradas).</li>" +
      "<li><b>Demais leis</b>, pelo número de decisões do Diário das Decisões que as citam: " +
        FAIXAS.map(function (f) { return f.nome + " → a cada " + f.meses + " meses"; }).join("; ") + " (citada em 10 ou mais decisões conta como 📝 cobrada: no máximo 4 meses).</li>" +
      "<li><b>Leis alteradas:</b> qualquer lei do acervo alterada desde a sua última visita ao blog aparece como sugestão, mesmo que você nunca a tenha lido. No primeiro acesso vale a data inicial de " + fmt(DATA_INICIAL_ALTERACOES) + ". O Planalto quase sempre cita a norma que alterou só pelo ano; por isso o robô estima o dia (“data estimada”) pela ordem de numeração das leis.</li>" +
      "<li>A contagem começa na data em que você marcou a leitura (ou na última revisão). Ao clicar em “Revisei hoje”, o prazo da revisão seguinte começa a contar.</li>" +
      "</ul></details>";
    if (!itens.length) {
      return blocoAlteradas(alts, o) + regra + '<p class="rv-vazio">Ainda não há súmulas nem leis lidas. Quando você marcar a leitura nos Diários, as revisões aparecem aqui.</p>';
    }
    return '<div class="rv-resumo">' +
        '<span class="rv-pilula rv-agora"><b>' + alts.length + "</b> " + (alts.length === 1 ? "lei alterada" : "leis alteradas") + " desde " + fmt(dataBaseAlteracoes(o).iso) + "</span>" +
        '<span class="rv-pilula rv-agora"><b>' + c.agora + "</b> para revisar agora</span>" +
        '<span class="rv-pilula rv-breve"><b>' + c.breve + "</b> nos próximos 30 dias</span>" +
        '<span class="rv-pilula"><b>' + c.emdia + "</b> em dia</span></div>" +
      regra +
      blocoAlteradas(alts, o) +
      listaRev("Para revisar agora", por("agora"), "agora", true, "Nada para revisar agora. 🎉") +
      listaRev("Nos próximos 30 dias", por("breve"), "breve", c.agora === 0, "Nenhuma revisão nos próximos 30 dias.") +
      listaRev("Em dia — próximas revisões", por("emdia"), "emdia", false, "Nada em dia ainda.") +
      (c.semdata ? listaRev("Lidas antes de o site guardar a data", itens.filter(function (i) { return i.estado === "semdata"; }), "semdata", false, "") +
        '<p class="rv-nota">Essas leituras são antigas e não têm data. Clique em “Revisei hoje” quando revisar e o prazo passa a contar.</p>' : "");
  }

  function telaHistorico(o) {
    var h = eventos(o.maps, o.rev), n = {};
    h.lista.forEach(function (e) { n[e.tipo] = (n[e.tipo] || 0) + 1; });
    var lista = ui.filtro === "todos" ? h.lista : h.lista.filter(function (e) { return e.tipo === ui.filtro; });
    var chips = '<div class="pz-filters rv-chips" role="group" aria-label="Diário">' +
      [{ id: "todos", nome: "Todos" }].concat(TIPOS).filter(function (t) { return t.id === "todos" || n[t.id]; }).map(function (t) {
        var q = t.id === "todos" ? h.lista.length : n[t.id];
        return '<button type="button" class="pz-filter' + (ui.filtro === t.id ? " active" : "") + '" data-hfiltro="' + t.id + '">' + t.nome + " · " + q + "</button>";
      }).join("") + "</div>";
    if (!h.lista.length) {
      return '<p class="rv-vazio">Nenhuma leitura com data ainda. Marque a leitura nos Diários e ela aparece aqui.</p>';
    }
    var nomeTipo = {};
    TIPOS.forEach(function (t) { nomeTipo[t.id] = t.nome; });
    var html = "", mesAtual = "", mostrar = lista.slice(0, ui.limiteHist);
    mostrar.forEach(function (e) {
      var mes = e.em.slice(0, 7);
      if (mes !== mesAtual) {
        if (mesAtual) html += "</ul>";
        mesAtual = mes;
        html += '<h3 class="rv-mes">' + MESES[+mes.slice(5, 7) - 1] + " de " + mes.slice(0, 4) + '</h3><ul class="rv-hist">';
      }
      html += '<li><span class="rv-dia">' + e.em.slice(8, 10) + "/" + e.em.slice(5, 7) + '</span><span class="rv-tipo t-' + e.tipo + '">' + esc(nomeTipo[e.tipo]) + "</span>" +
        (e.href ? '<a href="' + esc(e.href) + '" target="_blank" rel="noopener">' + esc(e.titulo) + "</a>" : "<span>" + esc(e.titulo) + "</span>") + "</li>";
    });
    if (mesAtual) html += "</ul>";
    if (lista.length > mostrar.length) html += '<button type="button" class="rv-mais" data-hmais="1">Mostrar mais (' + (lista.length - mostrar.length) + " restantes)</button>";
    if (h.semData) html += '<p class="rv-nota">' + plural(h.semData, "leitura antiga não tem", "leituras antigas não têm") + " data e não aparece" + (h.semData === 1 ? "" : "m") + " aqui.</p>";
    return chips + html;
  }

  function render(el, o) {
    if (!el) return;
    if (!pronto()) {
      el.innerHTML = '<p class="rv-vazio">Carregando…</p>';
      preparar().then(function () { render(el, o); });
      return;
    }
    if (!decisoesPorId && Object.keys((o.maps && o.maps.dec) || {}).length) {
      el.innerHTML = '<p class="rv-vazio">Carregando…</p>';
      prepararTitulos().then(function () { render(el, o); });
      return;
    }
    o.rev = juntarRev(o.rev);
    el.innerHTML = o.tab === "historico" ? telaHistorico(o) : telaRevisoes(o);
    el.onclick = function (ev) {
      var b = ev.target.closest("[data-rev],[data-todos],[data-hfiltro],[data-hmais],[data-alt-visto],[data-lote],[data-lote-sim],[data-lote-nao]");
      if (!b) return;
      if (b.dataset.lote) {
        ui.confirmar = b.dataset.lote;
      } else if (b.dataset.loteNao) {
        ui.confirmar = null;
      } else if (b.dataset.loteSim) {
        var estado = b.dataset.loteSim, dd = hoje(), loc = lerRevLocal(), pacote = {};
        itensDeRevisao(o.maps, o.rev).filter(function (i) { return i.estado === estado; }).forEach(function (i) {
          loc[i.id] = (loc[i.id] || []).filter(function (x) { return x !== dd; }).concat([dd]).sort();
          pacote[i.id] = loc[i.id];
        });
        try { localStorage.setItem(REV_KEY, JSON.stringify(loc)); } catch (e) {}
        if (o.salvarRevLote) o.salvarRevLote(pacote);
        else if (o.salvarRev) Object.keys(pacote).forEach(function (id) { o.salvarRev(id, pacote[id]); });
        o.rev = juntarRev(o.rev);
        ui.confirmar = null;
      } else if (b.dataset.altVisto) {
        var vistas = lerVistasAlt();
        vistas[b.dataset.altVisto] = b.dataset.altEm;
        try { localStorage.setItem(VISTAS_ALT_KEY, JSON.stringify(vistas)); } catch (e) {}
      } else if (b.dataset.rev) {
        var id = b.dataset.rev, d = hoje(), local = lerRevLocal();
        local[id] = (local[id] || []).filter(function (x) { return x !== d; }).concat([d]).sort();
        try { localStorage.setItem(REV_KEY, JSON.stringify(local)); } catch (e) {}
        if (o.salvarRev) o.salvarRev(id, local[id]);
        o.rev = juntarRev(o.rev);
      } else if (b.dataset.todos) {
        ui.verTodos[b.dataset.todos] = true;
      } else if (b.dataset.hfiltro) {
        ui.filtro = b.dataset.hfiltro; ui.limiteHist = 80;
      } else if (b.dataset.hmais) {
        ui.limiteHist += 200;
      }
      render(el, o);
    };
  }

  // cartão curto para a aba "Resumo" ("" enquanto os dados não chegam)
  function resumo(o) {
    if (!pronto()) return "";
    var c = contar(itensDeRevisao(o.maps, juntarRev(o.rev))), na = leisAlteradas(o.maps, o).length;
    if (!c.agora && !c.breve && !na) return "";
    return '<button type="button" class="rv-cartao" data-tab="revisoes">🔁 <b>' + plural(c.agora, "revisão", "revisões") + "</b> para fazer agora" +
      (c.breve ? " · " + c.breve + " nos próximos 30 dias" : "") +
      (na ? " · 📢 " + plural(na, "lei alterada", "leis alteradas") + " " + textoBaseAlt(o) : "") + " <span>Ver revisões →</span></button>";
  }

  window.ProgressoRevisoes = { preparar: preparar, pronto: pronto, render: render, resumo: resumo,
    _teste: { itensDeRevisao: itensDeRevisao, leisAlteradas: leisAlteradas, definir: function (x) { if (x.citacoes) citacoes = x.citacoes; if (x.alteracoes) alteracoes = x.alteracoes; if (x.decisoes) decisoesPorId = x.decisoes; if (x.cobranca) COBRANCA = x.cobranca; } } };
})();
