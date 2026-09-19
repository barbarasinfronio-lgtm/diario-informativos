/*
 * editais-logic.js — página "Editais": lista os editais mapeados, deixa a
 * pessoa escolher o edital principal (salvo no navegador e na conta) e mostra
 * o conteúdo programático e as leis de cada um. As leis alimentam o filtro
 * "Leis do meu edital" do Diário de Leis.
 */
(function () {
  "use strict";
  var root = document.getElementById("editais-main");
  if (!root) return;

  var ES = null;
  var changing = false;        // "Alterar edital principal" aberto
  var readMap = {};            // chaves lidas: "materia:slug" -> true (Diário de Leis)
  var LEIS_URL = "https://www.estudamana.com.br/p/diario-de-leis.html";

  function esc(t) {
    return String(t).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; });
  }

  function loadReadLocal() {
    var map = {};
    try {
      var raw = localStorage.getItem("leis-lidas");
      var parsed = raw ? JSON.parse(raw) : {};
      Object.keys(parsed).forEach(function (k) { if (parsed[k] && parsed[k].lida) map[k] = true; });
    } catch (e) {}
    return map;
  }

  function progress(ed) {
    var keys = ES.lawKeys(ed), total = 0, lidas = 0;
    Object.keys(keys).forEach(function (k) { total++; if (readMap[k]) lidas++; });
    return { total: total, lidas: lidas };
  }

  function labelOf(matKey) {
    return (window.LEIS_DATA && LEIS_DATA[matKey] && LEIS_DATA[matKey].label) || matKey;
  }

  function lawsByMateria(ed) {
    var order = window.LEIS_ORG_ORDER || [];
    var by = {};
    ed.leis.forEach(function (p) { (by[p[0]] = by[p[0]] || []).push(p[1]); });
    return Object.keys(by).sort(function (a, b) { return order.indexOf(a) - order.indexOf(b); })
      .map(function (k) { return { key: k, label: labelOf(k), numeros: by[k] }; });
  }

  function nameOf(matKey, numero) {
    var d = window.LEIS_DATA && LEIS_DATA[matKey];
    if (!d) return numero;
    for (var i = 0; i < d.leis.length; i++) if (d.leis[i].numero === numero) return d.leis[i].nome + " — " + numero;
    return numero;
  }

  function soonCard(ed) {
    return '<article class="ed-card is-soon" id="ed-' + ed.id + '">' +
      '<div class="ed-card-top"><span class="ed-sigla">EXAME</span><span class="ed-tag-soon">Aguardando edital</span></div>' +
      "<h2>" + esc(ed.titulo) + "</h2>" +
      '<p class="ed-meta">' + esc(ed.orgao) + "<br>O conteúdo programático entra aqui assim que o edital for mapeado.</p></article>";
  }

  function card(ed, main, chooseMode) {
    if (ed.emBreve) return soonCard(ed);
    var p = progress(ed);
    var pct = p.total ? Math.round((p.lidas / p.total) * 100) : 0;
    var mats = lawsByMateria(ed);
    var groups = ed.grupos.map(function (g) {
      return '<div class="ed-group"><h3>' + esc(g.nome) + "</h3><ul>" +
        g.disciplinas.map(function (d) { return "<li>" + esc(d) + "</li>"; }).join("") + "</ul></div>";
    }).join("");
    var laws = mats.map(function (m) {
      return '<div class="ed-laws"><h3>' + esc(m.label) + " (" + m.numeros.length + ")</h3><ul>" +
        m.numeros.map(function (n) {
          return '<li class="' + (readMap[m.key + ":" + ES.slug(n)] ? "is-read" : "") + '">' + esc(nameOf(m.key, n)) + "</li>";
        }).join("") + "</ul></div>";
    }).join("");
    var extras = ed.extras && ed.extras.length
      ? '<div class="ed-extras"><h3>Normas citadas no edital, ainda fora do Diário de Leis (' + ed.extras.length + ")</h3><ul>" +
        ed.extras.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ul>" +
        '<p class="ed-note">Leis estaduais e resoluções do CNJ/CNMP: entram no Diário conforme forem incluídas.</p></div>'
      : "";
    var isCar = ed.tipo === "carreira";
    var kw = isCar ? (ed.secao === "exame" ? "exame" : "carreira") : "edital";
    var action = "";
    if (main) action = '<span class="ed-tag-main">' + kw.charAt(0).toUpperCase() + kw.slice(1) + " principal</span>";
    var button = "";
    if (!main && chooseMode) {
      button = '<button type="button" class="edital-btn edital-btn-primary" data-choose="' + ed.id + '">Definir como ' + kw + ' principal</button>';
    }
    return '<article class="ed-card' + (main ? " is-main" : "") + (isCar ? " is-carreira" : "") + '" id="ed-' + ed.id + '">' +
      '<div class="ed-card-top"><span class="ed-sigla">' + esc(isCar ? kw.toUpperCase() : ed.sigla) + "</span>" + action + "</div>" +
      "<h2>" + esc(ed.titulo) + "</h2>" +
      '<p class="ed-meta">' + (isCar ? esc(ed.orgao) + "<br>" + esc(ed.cargo.replace("união dos editais: ", "Editais: "))
                                   : esc(ed.cargo) + " · " + esc(ed.orgao) + "<br>" + esc(ed.edital)) + "</p>" +
      '<div class="ed-stats"><span><b>' + ed.leis.length + "</b> leis no Diário</span><span><b>" + mats.length + "</b> matérias</span>" +
      "<span><b>" + p.lidas + "/" + p.total + "</b> lidas</span></div>" +
      '<div class="ed-bar" aria-hidden="true"><i style="width:' + pct + '%"></i></div>' +
      '<div class="ed-actions">' + button + '<a class="ed-link" href="' + LEIS_URL + '">Abrir o Diário de Leis</a></div>' +
      "<details><summary>" + (isCar ? "Disciplinas e leis da carreira" : "Conteúdo programático e leis") + "</summary>" + groups + laws + extras + "</details>" +
      "</article>";
  }

  function render() {
    if (!ES) return;
    var list = ES.data();
    var cur = ES.principal();
    var chooseMode = !cur || changing;
    var top;
    if (cur) {
      var curCar = cur.tipo === "carreira";
      var curKw = curCar ? (cur.secao === "exame" ? "exame" : "carreira") : "edital";
      top = '<div class="ed-current"><p><span class="edital-kicker">' + (curKw.charAt(0).toUpperCase() + curKw.slice(1)) + " principal</span>" +
        (curCar ? "<strong>" + esc(cur.titulo) + "</strong> — " + esc(cur.cargo)
                : "<strong>" + esc(cur.sigla) + "</strong> — " + esc(cur.titulo) + " · " + esc(cur.cargo)) + "</p>" +
        '<button type="button" class="edital-btn" id="ed-change" aria-expanded="' + (changing ? "true" : "false") + '">' +
        (changing ? "Cancelar" : "Alterar " + curKw + " principal") + "</button></div>";
    } else {
      top = '<div class="ed-none">🎯 Você ainda não escolheu um edital ou carreira. Escolha o do seu concurso (ou a carreira inteira): o Diário de Leis passa a mostrar só as leis dele, e a escolha fica salva no seu progresso.</div>';
    }
    // o principal vem primeiro dentro da sua seção
    function groupOf(e) {
      return (e.tipo || "edital") === "carreira" ? (e.secao === "exame" ? "exame" : "carreira") : "edital";
    }
    function section(tipo, titulo, sub) {
      var items = list.filter(function (e) { return groupOf(e) === tipo; });
      items.sort(function (a, b) {
        return (b.id === (cur && cur.id) ? 1 : 0) - (a.id === (cur && cur.id) ? 1 : 0);
      });
      return '<section class="ed-section"><h2 class="ed-section-title">' + titulo + '</h2><p class="ed-section-sub">' + sub + "</p>" +
        '<div class="ed-grid">' + items.map(function (e) {
          return card(e, !!(cur && cur.id === e.id), chooseMode);
        }).join("") + "</div></section>";
    }
    root.innerHTML = top +
      section("carreira", "Por carreira", "Junta o conteúdo de todos os editais do mesmo tipo de cargo.") +
      section("exame", "Exames nacionais", "Cada exame nacional tem o seu próprio conteúdo, separado das carreiras.") +
      section("edital", "Por edital", "O conteúdo programático de um concurso específico.") +
      '<p class="ed-foot">O conteúdo programático foi mapeado a partir dos editais oficiais. O número de leis é o que já existe no Diário de Leis; normas estaduais e resoluções aparecem à parte, como “fora do Diário”.</p>';
  }

  document.addEventListener("click", function (e) {
    if (!ES) return;
    var b = e.target.closest("#ed-change, [data-choose]");
    if (!b) return;
    if (b.id === "ed-change") { changing = !changing; render(); return; }
    changing = false;
    ES.setPrincipal(b.getAttribute("data-choose"));
  });

  root.innerHTML = "<p>Carregando os editais…</p>";
  readMap = loadReadLocal();

  window.EditaisShared && window.EditaisShared.load(function (shared) {
    ES = shared;
    ES.onChange(function () { render(); });
    // progresso das leis na conta (vale em vários aparelhos)
    ES.onRemoteDoc(function (d) {
      if (!d || !d.map) return;
      var m = {};
      Object.keys(d.map).forEach(function (k) { if (d.map[k] && d.map[k].lida) m[k] = true; });
      readMap = m;
      render();
    });
    render();
    ES.bindCloud({ signIn: true });
  });
})();

/* Login com Google (conta-google.js, mesma pasta deste script) */
(function () {
  var all0 = document.getElementsByTagName("script"), src = "";
  for (var i = 0; i < all0.length; i++) {
    if (/editais-logic\.js/.test(all0[i].src)) { src = all0[i].src; break; }
  }
  if (!src) return;
  function go() {
    if (window.ContaGoogle || document.getElementById("conta-google-js")) return;
    if (!(window.firebase && window.DIARIO_FIREBASE_CONFIG)) return;
    var s = document.createElement("script");
    s.id = "conta-google-js";
    s.src = src.replace(/editais-logic\.js/, "conta-google.js");
    document.head.appendChild(s);
  }
  if (document.readyState === "complete") go(); else window.addEventListener("load", go);
})();
