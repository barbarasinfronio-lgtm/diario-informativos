/*
 * revisoes.js — abas "Histórico" e "Revisões" da página "Meu Progresso".
 * Carregado por premios-logic.js só quando precisa (fetch sem cache).
 *
 * Histórico: tudo o que a pessoa marcou como lido nos Diários (Informativos,
 * Leis, Súmulas, Resoluções, Decisões, Constitucionalidade e Reclamações),
 * do mais recente para o mais antigo, mais as revisões feitas.
 *
 * Revisões: quando reler cada súmula e cada lei já lida.
 *   - Súmulas: a cada 6 meses.
 *   - Leis principais (CF, CC, CPC, CP, CPP e ECA): a cada 6 meses.
 *   - Demais leis: pelo número de decisões do Diário das Decisões que as
 *     citam (normas-citadas.js) — veja FAIXAS abaixo.
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

  var CDN = "https://cdn.jsdelivr.net/gh/barbarasinfronio-lgtm/diario-informativos@main/";
  var REV_KEY = "revisoes-feitas";
  var PAGINA_LEIS = "/p/diario-de-leis.html";

  // ---- regras ---------------------------------------------------------------
  var SUMULA_MESES = 6;
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
  var MESES = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];
  function fmt(iso) { return iso.slice(8, 10) + "/" + iso.slice(5, 7) + "/" + iso.slice(0, 4); }
  function plural(n, um, varios) { return n + " " + (n === 1 ? um : varios); }
  function lida(v) {
    if (v === true) return { em: null };
    if (typeof v === "string") return { em: dia(v) };           // Constitucionalidade/Reclamações: data ISO
    if (v && typeof v === "object" && v.lida) return { em: dia(v.lidaEm) };
    return null;
  }
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

  var citacoes = null;   // id da lei (normas-citadas) -> nº de decisões que a citam
  var decisoesPorId = null;
  var preparando = null;
  function preparar() {
    if (!preparando) {
      preparando = Promise.all([
        carregarJs("NormasCitadas", "normas-citadas.js"),
        carregarJs("LEIS_DATA", "leis-data.js"),
        carregarJs("SUMULAS_DATA", "sumulas-data.js"),
        carregarJs("RG_REPETITIVOS_DATA", "rg-repetitivos-data.js"),
        carregarTst()
      ]).then(function () {
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
    return preparando;
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
      out.push({ id: "lei:" + slug(num), tipo: "Lei", titulo: l.nome, sub: num, lidaEm: l.em, meses: r.meses, motivo: r.motivo,
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
          sub: String(s.texto || "").slice(0, 140), lidaEm: e.em, meses: SUMULA_MESES, motivo: "súmula", href: s.link || "/p/diario-das-sumulas.html" });
      });
    });

    out.forEach(function (it) {
      var feitas = rev[it.id] || [];
      it.ultimaRev = feitas.length ? feitas[feitas.length - 1] : null;
      var base = [it.lidaEm, it.ultimaRev].filter(Boolean).sort().pop() || null;
      it.base = base;
      if (!base) { it.estado = "semdata"; return; }
      it.vence = somaMeses(base, it.meses);
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
  var ui = { filtro: "todos", limiteHist: 80, verTodos: {} };

  function linhaRev(it) {
    var quando = it.estado === "semdata" ? "leitura sem data"
      : it.dias < 0 ? "venceu há " + plural(-it.dias, "dia", "dias")
      : it.dias === 0 ? "vence hoje"
      : "vence em " + fmt(it.vence);
    var base = it.base ? (it.ultimaRev && it.ultimaRev === it.base ? "revisada em " : "lida em ") + fmt(it.base) + " · " : "";
    return '<li class="rv-item rv-' + it.estado + '">' +
      '<span class="rv-tipo">' + esc(it.tipo) + "</span>" +
      '<div class="rv-texto"><b>' + esc(it.titulo) + "</b>" +
        '<span class="rv-meta">' + esc(base + "a cada " + it.meses + " meses (" + it.motivo + ") · " + quando) + "</span></div>" +
      '<div class="rv-acoes">' + (it.href ? '<a class="rv-abrir" href="' + esc(it.href) + '" target="_blank" rel="noopener">Abrir</a>' : "") +
        '<button type="button" class="rv-feito" data-rev="' + esc(it.id) + '">✔ Revisei hoje</button></div>' +
    "</li>";
  }

  function listaRev(titulo, itens, id, aberto, vazio) {
    var LIM = 40, todos = ui.verTodos[id], mostrar = todos ? itens : itens.slice(0, LIM);
    return '<details class="rv-bloco"' + (aberto ? " open" : "") + '><summary><span>' + titulo + '</span><span class="rv-n">' + itens.length + "</span></summary>" +
      (itens.length ? '<ul class="rv-lista">' + mostrar.map(linhaRev).join("") + "</ul>" +
        (itens.length > mostrar.length ? '<button type="button" class="rv-mais" data-todos="' + id + '">Mostrar todas (' + itens.length + ")</button>" : "")
        : '<p class="rv-vazio">' + vazio + "</p>") +
      "</details>";
  }

  function telaRevisoes(o) {
    var itens = itensDeRevisao(o.maps, o.rev), c = contar(itens);
    var por = function (e) { return itens.filter(function (i) { return i.estado === e; }).sort(function (a, b) { return a.dias - b.dias; }); };
    var regra = '<details class="rv-regra"><summary>Como as revisões são calculadas</summary><ul>' +
      "<li><b>Súmulas:</b> a cada " + SUMULA_MESES + " meses.</li>" +
      "<li><b>Leis principais</b> (CF, Código Civil, CPC, Código Penal, CPP e ECA): a cada " + PRINCIPAL_MESES + " meses.</li>" +
      "<li><b>Demais leis</b>, pelo número de decisões do Diário das Decisões que as citam: " +
        FAIXAS.map(function (f) { return f.nome + " → a cada " + f.meses + " meses"; }).join("; ") + ".</li>" +
      "<li>A contagem começa na data em que você marcou a leitura (ou na última revisão). Ao clicar em “Revisei hoje”, o prazo recomeça.</li>" +
      "</ul></details>";
    if (!itens.length) {
      return regra + '<p class="rv-vazio">Ainda não há súmulas nem leis lidas. Quando você marcar a leitura nos Diários, as revisões aparecem aqui.</p>';
    }
    return '<div class="rv-resumo">' +
        '<span class="rv-pilula rv-agora"><b>' + c.agora + "</b> para revisar agora</span>" +
        '<span class="rv-pilula rv-breve"><b>' + c.breve + "</b> nos próximos 30 dias</span>" +
        '<span class="rv-pilula"><b>' + c.emdia + "</b> em dia</span></div>" +
      regra +
      listaRev("Para revisar agora", por("agora"), "agora", true, "Nada para revisar agora. 🎉") +
      listaRev("Nos próximos 30 dias", por("breve"), "breve", c.agora === 0, "Nenhuma revisão nos próximos 30 dias.") +
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
    o.rev = juntarRev(o.rev);
    el.innerHTML = o.tab === "historico" ? telaHistorico(o) : telaRevisoes(o);
    el.onclick = function (ev) {
      var b = ev.target.closest("[data-rev],[data-todos],[data-hfiltro],[data-hmais]");
      if (!b) return;
      if (b.dataset.rev) {
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
    var c = contar(itensDeRevisao(o.maps, juntarRev(o.rev)));
    if (!c.agora && !c.breve) return "";
    return '<button type="button" class="rv-cartao" data-tab="revisoes">🔁 <b>' + plural(c.agora, "revisão", "revisões") + "</b> para fazer agora" +
      (c.breve ? " · " + c.breve + " nos próximos 30 dias" : "") + " <span>Ver revisões →</span></button>";
  }

  window.ProgressoRevisoes = { preparar: preparar, pronto: pronto, render: render, resumo: resumo };
})();
