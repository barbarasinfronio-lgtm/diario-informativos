/*
 * estatisticas-provas-logic.js — página "Estatísticas de cobrança"
 *
 * Lê provas/cobrancas.json (gerado por scripts/cobrancas_provas.py a partir
 * das provas de concurso) e mostra: o que mais cai, por fonte, por banca e
 * por prova. A página do Blogger só precisa de:
 *
 *   <link rel="stylesheet" href="https://barbarasinfronio-lgtm.github.io/diario-informativos/estatisticas-provas.css">
 *   <div id="estatisticas-provas"></div>
 *   <script src="https://barbarasinfronio-lgtm.github.io/diario-informativos/estatisticas-provas-logic.js"></script>
 */
(function () {
  "use strict";
  var URL_JSON = "https://barbarasinfronio-lgtm.github.io/diario-informativos/provas/cobrancas.json";
  var root = document.getElementById("estatisticas-provas");
  if (!root) { root = document.createElement("div"); root.id = "estatisticas-provas"; document.body.appendChild(root); }
  root.innerHTML = '<p class="ep-carregando">Carregando estatísticas…</p>';

  var COB = null;
  var filtro = { banca: "", fonte: "", q: "" };
  var MOSTRAR = 30;

  function esc(t) { return String(t == null ? "" : t).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function semAcento(t) { return String(t || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, ""); }
  function pct(a, b) { return b ? Math.round(a * 100 / b) + "%" : "0%"; }

  // Itens (súmulas/decisões) com as provas em que caíram, já com o filtro de banca.
  function itensFiltrados() {
    var out = [];
    Object.keys(COB.itens).forEach(function (k) {
      var card = COB.cards[k]; if (!card) return;
      if (filtro.fonte && card.fonte !== filtro.fonte) return;
      var provas = {};
      COB.itens[k].forEach(function (x) {
        var p = COB.provas[x[0]];
        if (filtro.banca && p.banca !== filtro.banca) return;
        (provas[x[0]] = provas[x[0]] || []).push(x[1]);
      });
      var n = Object.keys(provas).length;
      if (!n) return;
      if (filtro.q && semAcento(card.rotulo + " " + card.texto).indexOf(semAcento(filtro.q)) === -1) return;
      out.push({ k: k, card: card, n: n, provas: provas });
    });
    out.sort(function (a, b) { return b.n - a.n || a.card.rotulo.localeCompare(b.card.rotulo, "pt-BR", { numeric: true }); });
    return out;
  }

  function barras(linhas) {
    var max = Math.max.apply(null, linhas.map(function (l) { return l[1]; }).concat([1]));
    return '<div class="ep-barras">' + linhas.map(function (l) {
      return '<div class="ep-barra"><span class="ep-barra-rot">' + esc(l[0]) + '</span>' +
        '<span class="ep-barra-trilho"><span class="ep-barra-cheia" style="width:' + (l[1] * 100 / max) + '%"></span></span>' +
        '<span class="ep-barra-num">' + esc(l[2] != null ? l[2] : l[1]) + '</span></div>';
    }).join("") + "</div>";
  }

  function desenhar() {
    var provas = COB.provas.filter(function (p) { return !filtro.banca || p.banca === filtro.banca; });
    var totalQ = provas.reduce(function (s, p) { return s + p.questoes; }, 0);
    var itens = itensFiltrados();

    // questões com alguma jurisprudência ligada
    var qLig = {};
    itens.forEach(function (it) { Object.keys(it.provas).forEach(function (pi) { it.provas[pi].forEach(function (q) { qLig[pi + ":" + q] = 1; }); }); });
    var nLig = Object.keys(qLig).length;

    // por fonte (quantas vezes cada tipo de fonte apareceu)
    var porFonte = {};
    itens.forEach(function (it) { porFonte[it.card.fonte] = (porFonte[it.card.fonte] || 0) + it.n; });
    var fontes = Object.keys(porFonte).sort(function (a, b) { return porFonte[b] - porFonte[a]; });

    // por banca (% das questões com jurisprudência ligada)
    var porBanca = {};
    COB.provas.forEach(function (p, pi) {
      var b = porBanca[p.banca] = porBanca[p.banca] || { q: 0, lig: 0, provas: 0 };
      b.q += p.questoes; b.provas++;
    });
    Object.keys(COB.itens).forEach(function (k) {
      if (filtro.fonte && COB.cards[k] && COB.cards[k].fonte !== filtro.fonte) return;
      COB.itens[k].forEach(function (x) { var key = x[0] + ":" + x[1]; if (!porBanca._v) porBanca._v = {}; porBanca._v[key] = 1; });
    });
    Object.keys(porBanca._v || {}).forEach(function (key) { var p = COB.provas[key.split(":")[0]]; porBanca[p.banca].lig++; });
    delete porBanca._v;
    var bancas = Object.keys(porBanca).sort();

    var todasFontes = {};
    Object.keys(COB.cards).forEach(function (k) { todasFontes[COB.cards[k].fonte] = 1; });

    root.innerHTML =
      '<div class="ep-filtros">' +
        '<label>Banca <select id="ep-banca"><option value="">Todas</option>' + bancas.map(function (b) { return '<option' + (b === filtro.banca ? " selected" : "") + ">" + esc(b) + "</option>"; }).join("") + "</select></label>" +
        '<label>Fonte <select id="ep-fonte"><option value="">Todas</option>' + Object.keys(todasFontes).sort().map(function (f) { return '<option' + (f === filtro.fonte ? " selected" : "") + ">" + esc(f) + "</option>"; }).join("") + "</select></label>" +
        '<input id="ep-busca" type="search" placeholder="Buscar súmula, tema ou assunto (ex.: falta grave)" value="' + esc(filtro.q) + '">' +
      "</div>" +
      '<div class="ep-numeros">' +
        '<div><b>' + provas.length + "</b><span>provas</span></div>" +
        '<div><b>' + totalQ.toLocaleString("pt-BR") + "</b><span>questões</span></div>" +
        '<div><b>' + pct(nLig, totalQ) + "</b><span>das questões cobram súmula ou tese que está no site</span></div>" +
        '<div><b>' + itens.length + "</b><span>súmulas e teses já cobradas</span></div>" +
      "</div>" +
      '<h2 class="ep-titulo">O que mais caiu</h2>' +
      (itens.length ? '<ol class="ep-ranking">' + itens.slice(0, MOSTRAR).map(function (it) {
        var lista = Object.keys(it.provas).map(function (pi) { var p = COB.provas[pi]; return p.rotulo + " (" + p.banca + ") q. " + it.provas[pi].join(", "); });
        return '<li><div class="ep-item-top"><b>' + esc(it.card.rotulo) + '</b><span class="ep-vezes">' + it.n + (it.n === 1 ? " prova" : " provas") + "</span></div>" +
          '<p class="ep-texto">' + esc(it.card.texto) + "</p>" +
          '<p class="ep-onde">' + esc(lista.join(" · ")) + "</p></li>";
      }).join("") + "</ol>" + (itens.length > MOSTRAR ? '<button id="ep-mais" class="ep-mais">Mostrar mais (' + (itens.length - MOSTRAR) + ")</button>" : "")
        : '<p class="ep-vazio">Nada encontrado com esses filtros.</p>') +
      '<h2 class="ep-titulo">De onde vêm as questões de jurisprudência</h2>' +
      barras(fontes.map(function (f) { return [f, porFonte[f]]; })) +
      '<h2 class="ep-titulo">Quanto cada banca cobra jurisprudência</h2>' +
      '<p class="ep-nota">Percentual das questões de cada banca que reproduzem ou citam uma súmula ou tese que está no site.</p>' +
      barras(bancas.map(function (b) { var x = porBanca[b]; return [b + " (" + x.provas + (x.provas === 1 ? " prova)" : " provas)"), x.lig / (x.q || 1), pct(x.lig, x.q)]; })) +
      '<h2 class="ep-titulo">Provas analisadas</h2>' +
      '<table class="ep-tabela"><thead><tr><th>Prova</th><th>Banca</th><th>Questões</th><th>Com jurisprudência</th></tr></thead><tbody>' +
      COB.provas.map(function (p, pi) {
        if (filtro.banca && p.banca !== filtro.banca) return "";
        var n = Object.keys(qLig).filter(function (k) { return k.split(":")[0] === String(pi); }).length;
        return "<tr><td>" + esc(p.rotulo) + "</td><td>" + esc(p.banca) + "</td><td>" + p.questoes + "</td><td>" + n + " (" + pct(n, p.questoes) + ")</td></tr>";
      }).join("") + "</tbody></table>" +
      '<p class="ep-nota">Como funciona: cada questão é comparada com as súmulas, teses de repercussão geral, repetitivos e a Jurisprudência em Teses do site. Conta como cobrança quando a questão cita o número (ex.: "Súmula 444 do STJ") ou reproduz boa parte do texto da tese. Questões de lei seca não entram. Atualizado em ' + esc(COB.gerado.split("-").reverse().join("/")) + ".</p>";

    document.getElementById("ep-banca").onchange = function () { filtro.banca = this.value; MOSTRAR = 30; desenhar(); };
    document.getElementById("ep-fonte").onchange = function () { filtro.fonte = this.value; MOSTRAR = 30; desenhar(); };
    var busca = document.getElementById("ep-busca"), t = null;
    busca.oninput = function () {
      clearTimeout(t); var v = this.value;
      t = setTimeout(function () { filtro.q = v; MOSTRAR = 30; desenhar(); var b = document.getElementById("ep-busca"); b.focus(); b.setSelectionRange(v.length, v.length); }, 300);
    };
    var mais = document.getElementById("ep-mais");
    if (mais) mais.onclick = function () { MOSTRAR += 30; desenhar(); };
  }

  fetch(URL_JSON, { cache: "no-cache" })
    .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
    .then(function (j) { COB = j; desenhar(); })
    .catch(function () { root.innerHTML = '<p class="ep-vazio">Não foi possível carregar as estatísticas agora. Tente recarregar a página.</p>'; });
})();
