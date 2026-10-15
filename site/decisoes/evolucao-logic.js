/*
 * evolucao-logic.js — página "Evolução jurisprudencial": mostra quando o STF, o STJ e o TST mudaram de posição.
 *
 * Três abas, todas com dados de evolucao/*.json (gerados por scripts/evolucao_montar.py e scripts/evolucao_sinais.py):
 *   1. Mudanças conferidas — linha do tempo (antes → depois) de cada mudança, com o trecho em que o tribunal a registrou;
 *   2. Sinais nos julgados — decisões em que o próprio tribunal diz que mudou de posição (trecho transcrito);
 *   3. Súmulas canceladas — súmulas e orientações canceladas, superadas, revogadas ou alteradas.
 *
 * Página do Blogger: só precisa de <div id="evolucao-main"></div>, do CSS evolucao-styles.css e deste script.
 */
(function () {
  "use strict";
  var root = document.getElementById("evolucao-main");
  if (!root) return;

  var BASE = window.EVOLUCAO_BASE || "https://barbarasinfronio-lgtm.github.io/diario-informativos/";
  var DECISOES = window.EVOLUCAO_DECISOES_URL || "https://www.estudamana.com.br/p/diario-das-decisoes.html";
  var LOTE = 20;

  var dados = { mudancas: null, sinais: null, canceladas: null };
  var estado = { aba: "mudancas", q: "", org: "todos", tipo: "todos", area: "", ordem: "recentes", limite: LOTE };

  function esc(t) {
    return String(t == null ? "" : t).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function semAcento(t) {
    return String(t == null ? "" : t).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  }
  function dataBr(iso) {
    var m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso || "");
    if (!m) return "";
    if (m[2] === "01" && m[3] === "01") return m[1];          // só o ano
    return m[3] + "/" + m[2] + "/" + m[1];
  }
  function tagOrgao(o) {
    var c = /^(STF|STJ|TST)$/.test(o) ? o.toLowerCase() : "";
    return '<span class="ev-tag ' + c + '">' + esc(o) + "</span>";
  }
  function linkCard(card, busca) {
    if (!card) return "";
    return '<a class="ev-abrir" target="_blank" rel="noopener" href="' + esc(DECISOES + "#abrir=" + encodeURIComponent(card) +
      "&busca=" + encodeURIComponent(busca || "")) + '">Abrir a decisão no Diário das Decisões ↗</a>';
  }

  function carregar(nome, arquivo) {
    if (dados[nome]) return Promise.resolve(dados[nome]);
    return fetch(BASE + "evolucao/" + arquivo, { cache: "no-cache" })
      .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
      .then(function (j) { dados[nome] = j; return j; });
  }

  // ---- esqueleto -------------------------------------------------------------------------------------------------
  root.innerHTML =
    '<header class="ev-top"><div class="ev-eyebrow">Jurisprudência</div><h1>Evolução jurisprudencial</h1>' +
    "<p>Quando o tribunal muda de posição, a prova que decidiu de um jeito em 2012 pode cobrar o contrário em 2020. Aqui estão as mudanças que o STF, o STJ e o TST registraram, lado a lado: o que valia antes, o que vale agora e o trecho em que o próprio tribunal conta a mudança.</p>" +
    '<div class="ev-stats" id="ev-stats"></div></header>' +
    '<details class="ev-metodo"><summary>Como esta página foi montada</summary><div class="ev-corpo">' +
    "<p><b>Mudanças conferidas:</b> cada uma foi lida e conferida contra o texto do tribunal (informativo, tema ou súmula); “antes” e “depois” saem do que o tribunal escreveu, e o trecho que comprova a mudança vem junto.</p>" +
    "<p><b>Sinais nos julgados:</b> o robô varreu os informativos, os acórdãos do STJ e do STF e os temas do site atrás de frases em que o tribunal afirma que mudou de posição (“superou o entendimento”, “passou a entender”, “revisão do Tema”…). O trecho é transcrito, sem paráfrase, e <b>não foi conferido um a um</b>: use como mapa para ler a decisão.</p>" +
    "<p><b>Súmulas canceladas:</b> tudo o que o site tem marcado como cancelado, superado, revogado ou alterado. Quando a súmula não diz o que passou a valer, procure a decisão que a cancelou.</p>" +
    "<p>Só entra o que está no acervo do site: a ausência de um tema aqui não significa que o tribunal nunca mudou de posição sobre ele.</p></div></details>" +
    '<div class="ev-abas" id="ev-abas"></div>' +
    '<div class="ev-barra"><div class="ev-barra-in">' +
    '<div class="ev-linha"><label class="ev-busca"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" aria-hidden="true"><circle cx="11" cy="11" r="7"></circle><path d="m21 21-4.3-4.3"></path></svg>' +
    '<input id="ev-q" type="search" autocomplete="off" placeholder="Buscar assunto, súmula, tema, processo…" aria-label="Buscar"></label>' +
    '<select class="ev-sel" id="ev-area" aria-label="Área"></select>' +
    '<select class="ev-sel" id="ev-ordem" aria-label="Ordem"><option value="recentes">Mais recentes primeiro</option><option value="antigas">Mais antigas primeiro</option></select></div>' +
    '<div class="ev-linha" id="ev-chips"></div></div></div>' +
    '<div class="ev-cont" id="ev-cont" aria-live="polite"></div><div class="ev-lista" id="ev-lista"></div><div id="ev-rodape"></div>';

  var elAbas = document.getElementById("ev-abas"), elChips = document.getElementById("ev-chips"), elLista = document.getElementById("ev-lista");
  var elCont = document.getElementById("ev-cont"), elRodape = document.getElementById("ev-rodape"), elQ = document.getElementById("ev-q");
  var elArea = document.getElementById("ev-area"), elOrdem = document.getElementById("ev-ordem"), elStats = document.getElementById("ev-stats");

  var TIPOS = { superacao: "Superação de precedente", revisao: "Revisão de tese", cancelamento: "Cancelamento de súmula/tema", mudanca: "Mudança de entendimento" };

  function itensAba() {
    var d = dados[estado.aba];
    return d ? d.itens : [];
  }
  function textoItem(x) {
    if (x._t) return x._t;
    var partes;
    if (estado.aba === "mudancas") partes = [x.assunto, x.area, x.orgao, x.evidencia && x.evidencia.fonte].concat(x.etapas.map(function (e) { return e.ref + " " + e.texto; }));
    else if (estado.aba === "sinais") partes = [x.titulo, x.ref, x.area, x.orgao, x.trecho];
    else partes = [x.tribunal, "súmula", x.numero, x.status, x.texto];
    return (x._t = semAcento(partes.join(" ")));
  }
  function dataItem(x) { return x.data || ""; }

  function filtrados() {
    var ts = semAcento(estado.q).split(/\s+/).filter(Boolean);
    var lista = itensAba().filter(function (x) {
      if (estado.aba !== "canceladas") {
        if (estado.org !== "todos" && x.orgao !== estado.org) return false;
        if (estado.area && x.area !== estado.area) return false;
      } else if (estado.org !== "todos") {
        if (estado.org === "outros" ? x.principal : x.tribunal.indexOf(estado.org) !== 0) return false;
      }
      if (estado.aba === "mudancas" && estado.tipo !== "todos" && x.tipo !== estado.tipo) return false;
      var h = textoItem(x);
      for (var i = 0; i < ts.length; i++) if (h.indexOf(ts[i]) === -1) return false;
      return true;
    });
    lista.sort(function (a, b) {
      var da = dataItem(a), db = dataItem(b);
      if (da === db) return 0;
      if (!da) return 1;
      if (!db) return -1;
      return estado.ordem === "recentes" ? (da < db ? 1 : -1) : (da < db ? -1 : 1);
    });
    return lista;
  }

  // ---- cartões ---------------------------------------------------------------------------------------------------
  function cardMudanca(x) {
    var n = x.etapas.length;
    var etapas = x.etapas.map(function (e, i) {
      var ultimo = i === n - 1;
      var quando = dataBr(e.data) || (i === 0 ? "Antes" : "");
      return '<li class="ev-etapa' + (ultimo ? " depois" : "") + '"><div class="ev-quando">' + esc(quando) + (ultimo && i > 0 ? " · hoje, no acervo" : "") + '</div>' +
        '<div class="ev-ref">' + esc(e.ref) + '</div><div class="ev-txt">' + esc(e.texto) + "</div>" + (ultimo ? linkCard(e.card, x.assunto) : "") + "</li>";
    }).join("");
    return '<article class="ev-card"><div class="ev-chips">' + tagOrgao(x.orgao) + '<span class="ev-tag tipo">' + esc(TIPOS[x.tipo] || x.tipo) + "</span>" +
      (x.area ? '<span class="ev-tag">' + esc(x.area) + "</span>" : "") + '</div><h2 class="ev-titulo">' + esc(x.assunto) + '</h2>' +
      '<ol class="ev-linha-tempo">' + etapas + "</ol>" +
      '<details class="ev-prova"><summary>Como o tribunal registrou a mudança</summary><blockquote>“' + esc(x.evidencia.texto) + "”<cite>" + esc(x.evidencia.fonte) + "</cite></blockquote></details></article>";
  }
  function cardSinal(x) {
    return '<article class="ev-card"><div class="ev-chips">' + tagOrgao(x.orgao) + '<span class="ev-tag">' + (x.fonte === "informativo" ? "Informativo" : x.fonte === "tema" ? "Tema" : "Acórdão") + "</span>" +
      (x.area ? '<span class="ev-tag">' + esc(x.area) + "</span>" : "") + "</div>" +
      '<h2 class="ev-titulo">' + esc(x.titulo || x.ref) + "</h2>" +
      '<blockquote class="ev-citacao">“' + esc(x.trecho) + "”</blockquote>" +
      '<div class="ev-meta"><span>' + esc(dataBr(x.data)) + "</span><span>" + esc(x.ref) + "</span>" +
      (x.outros ? "<span>+" + x.outros + (x.outros === 1 ? " outro julgado repete" : " outros julgados repetem") + " o sinal" + (x.ate ? " (até " + esc(dataBr(x.ate)) + ")" : "") + "</span>" : "") + "</div>" +
      linkCard(x.card, x.ref) + "</article>";
  }
  function cardCancelada(x) {
    return '<article class="ev-card"><div class="ev-chips"><span class="ev-tag">' + esc(x.tribunal) + '</span><span class="ev-status">' + esc(x.status) + "</span>" +
      (x.data ? '<span class="ev-tag">' + esc(dataBr(x.data)) + "</span>" : "") + '</div><h2 class="ev-titulo">Súmula ' + esc(x.numero) + "</h2>" +
      '<div class="ev-txt">' + esc(x.texto) + "</div></article>";
  }

  // ---- desenho ---------------------------------------------------------------------------------------------------
  function contar(lista, campo) {
    var c = {};
    lista.forEach(function (x) { c[x[campo]] = (c[x[campo]] || 0) + 1; });
    return c;
  }
  function desenharAbas() {
    var defs = [["mudancas", "Mudanças conferidas"], ["sinais", "Sinais nos julgados"], ["canceladas", "Súmulas canceladas"]];
    elAbas.innerHTML = defs.map(function (d) {
      var n = dados[d[0]] ? dados[d[0]].itens.length : "…";
      return '<button type="button" class="ev-aba' + (estado.aba === d[0] ? " ativa" : "") + '" data-aba="' + d[0] + '">' + d[1] + '<span class="ev-n">' + n + "</span></button>";
    }).join("");
    var m = dados.mudancas ? dados.mudancas.itens.length : 0, s = dados.sinais ? dados.sinais.itens.length : 0, c = dados.canceladas ? dados.canceladas.itens.length : 0;
    elStats.innerHTML = '<div class="ev-stat"><b>' + m + "</b><span>mudanças conferidas</span></div>" +
      '<div class="ev-stat"><b>' + s + "</b><span>sinais nos julgados</span></div>" +
      '<div class="ev-stat"><b>' + c + "</b><span>súmulas canceladas</span></div>";
  }
  function desenharFiltros() {
    var itens = itensAba(), chips = "";
    if (estado.aba === "canceladas") {
      var tr = {};
      itens.forEach(function (x) { var k = x.tribunal.split(" — ")[0]; tr[k] = (tr[k] || 0) + 1; });
      chips += chip("org", "todos", "Todos", itens.length);
      Object.keys(tr).sort(function (a, b) { return tr[b] - tr[a]; }).slice(0, 8).forEach(function (k) { chips += chip("org", k, k, tr[k]); });
      elArea.style.display = "none";
    } else {
      var co = contar(itens, "orgao");
      chips += chip("org", "todos", "Todos", itens.length);
      Object.keys(co).sort().forEach(function (o) { chips += chip("org", o, o, co[o]); });
      if (estado.aba === "mudancas") {
        var ct = contar(itens, "tipo");
        Object.keys(TIPOS).forEach(function (t) { if (ct[t]) chips += chip("tipo", t, TIPOS[t], ct[t], true); });
      }
      var areas = contar(itens, "area");
      elArea.style.display = "";
      elArea.innerHTML = '<option value="">Todas as áreas</option>' + Object.keys(areas).filter(Boolean).sort(function (a, b) { return a.localeCompare(b, "pt-BR"); })
        .map(function (a) { return '<option value="' + esc(a) + '"' + (estado.area === a ? " selected" : "") + ">" + esc(a) + " (" + areas[a] + ")</option>"; }).join("");
    }
    elChips.innerHTML = chips;
  }
  function chip(campo, valor, rotulo, n, separado) {
    var ativo = estado[campo === "org" ? "org" : "tipo"] === valor;
    return '<button type="button" class="ev-chip' + (ativo ? " ativo" : "") + '" data-campo="' + campo + '" data-valor="' + esc(valor) + '"' + (separado ? ' style="margin-left:2px"' : "") + ">" + esc(rotulo) + '<span class="ev-n">' + n + "</span></button>";
  }
  function desenhar() {
    desenharAbas();
    if (!dados[estado.aba]) { elLista.innerHTML = '<p class="ev-vazio">Carregando…</p>'; elCont.textContent = ""; elRodape.innerHTML = ""; return; }
    desenharFiltros();
    var lista = filtrados();
    elCont.textContent = lista.length + (lista.length === 1 ? " resultado" : " resultados");
    var aviso = estado.aba === "sinais" ? '<div class="ev-aviso">Trechos transcritos dos próprios julgados, <b>não conferidos um a um</b>. Use como mapa: abra a decisão para ler o contexto antes de confiar.</div>' : "";
    var f = estado.aba === "mudancas" ? cardMudanca : estado.aba === "sinais" ? cardSinal : cardCancelada;
    elLista.innerHTML = aviso + (lista.length ? lista.slice(0, estado.limite).map(f).join("") : '<p class="ev-vazio">Nada encontrado com esses filtros.</p>');
    elRodape.innerHTML = lista.length > estado.limite ? '<button type="button" class="ev-mais" id="ev-mais">Mostrar mais (' + (lista.length - estado.limite) + ")</button>" : "";
  }

  // ---- eventos ---------------------------------------------------------------------------------------------------
  root.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest("[data-aba]");
    if (a) {
      estado.aba = a.getAttribute("data-aba"); estado.org = "todos"; estado.tipo = "todos"; estado.area = ""; estado.limite = LOTE;
      var arq = { mudancas: "mudancas.json", sinais: "sinais.json", canceladas: "canceladas.json" }[estado.aba];
      desenhar();
      carregar(estado.aba, arq).then(desenhar).catch(function () { elLista.innerHTML = '<p class="ev-vazio">Não consegui carregar os dados agora. Recarregue a página.</p>'; });
      return;
    }
    var c = e.target.closest && e.target.closest("[data-campo]");
    if (c) {
      estado[c.getAttribute("data-campo") === "org" ? "org" : "tipo"] = c.getAttribute("data-valor"); estado.limite = LOTE; desenhar(); return;
    }
    if (e.target.id === "ev-mais") { estado.limite += LOTE; desenhar(); }
  });
  var t = null;
  elQ.addEventListener("input", function () { clearTimeout(t); var v = this.value; t = setTimeout(function () { estado.q = v; estado.limite = LOTE; desenhar(); }, 220); });
  elArea.addEventListener("change", function () { estado.area = this.value; estado.limite = LOTE; desenhar(); });
  elOrdem.addEventListener("change", function () { estado.ordem = this.value; desenhar(); });

  desenhar();
  // as três listas são pequenas (≈1 MB juntas): carrega a primeira já e as outras em seguida, para os números das abas
  carregar("mudancas", "mudancas.json").then(desenhar).catch(function () { elLista.innerHTML = '<p class="ev-vazio">Não consegui carregar os dados agora. Recarregue a página.</p>'; });
  setTimeout(function () {
    carregar("sinais", "sinais.json").then(desenharAbas).catch(function () {});
    carregar("canceladas", "canceladas.json").then(desenharAbas).catch(function () {});
  }, 600);
})();
