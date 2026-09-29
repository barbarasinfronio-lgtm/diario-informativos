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

  // ---- organização da página --------------------------------------------
  // Cada área (Magistratura, Ministério Público…) abre e fecha; dentro dela,
  // os grupos (Estadual, Federal…) listam um edital por linha. "uniao" = id
  // do item tipo "carreira" que junta todos os editais do grupo/área.
  // "teste" = regra sobre a sigla do edital (ou função que recebe o edital).
  // Edital que não se encaixa em nenhum grupo aparece em "Outros".
  var AREAS = [
    { titulo: "Magistratura", grupos: [
      { titulo: "Estadual", uniao: "carreira-magistratura-estadual", nome: "Magistratura Estadual", teste: /^TJ/ },
      { titulo: "Federal", uniao: "carreira-magistratura-federal", nome: "Magistratura Federal", teste: /^TRF/ },
      { titulo: "do Trabalho", teste: /^(CSJT|TRT)/ }
    ] },
    { titulo: "Ministério Público", grupos: [
      { titulo: "Estadual e do DF", uniao: "carreira-promotor", nome: "Promotor de Justiça", teste: /^MP(?!F$|T$|M$)/ },
      { titulo: "Federal (MPF)", teste: /^MPF$/ },
      { titulo: "do Trabalho (MPT)", teste: /^MPT$/ }
    ] },
    { titulo: "Advocacia Pública", uniao: "carreira-advogado-publico", grupos: [
      { titulo: "Advogado da União (AGU)", teste: function (e) { return e.sigla === "AGU" && !/Procurador Federal/i.test(e.titulo); } },
      { titulo: "Procurador da Fazenda Nacional (PFN)", teste: /^PFN$/ },
      { titulo: "Procurador Federal", teste: function (e) { return /Procurador Federal/i.test(e.titulo); } },
      { titulo: "Procurador do Estado", uniao: "carreira-procurador-estado", nome: "Procurador do Estado", teste: /^PGE/ },
      { titulo: "Procurador do DF", teste: /^PG-?DF/ }
    ] },
    { titulo: "Delegado de Polícia", uniao: "carreira-delegado", grupos: [
      { titulo: "Polícia Civil", teste: /^PC/ },
      { titulo: "Polícia Federal", teste: /^PF$/ }
    ] },
    { titulo: "Defensoria Pública", uniao: "carreira-defensor", grupos: [
      { titulo: "Estadual", teste: /^DPE/ },
      { titulo: "Federal (DPU)", teste: /^DPU$/ }
    ] },
    { titulo: "Exames nacionais", grupos: [
      { titulo: "Magistratura (ENAM)", uniao: "exame-enam", teste: /^ENAM$/ },
      { titulo: "Cartórios (ENAC)", uniao: "exame-enac", teste: /^ENAC$/ },
      { titulo: "Advocacia Pública (ENAP)", uniao: "exame-enap", teste: /^ENAP$/ }
    ] }
  ];

  var abertas = {};   // área aberta pela pessoa (sobrevive a cada nova renderização)
  var maisAbertos = {}; // "Conteúdo programático" aberto, por id do edital
  var termos = [];    // palavras da busca

  function semAcento(t) {
    return String(t || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  }
  function atende(ed, t) {
    return t.test ? t.test(ed.sigla || "") : t(ed);
  }
  function combina(ed) {
    if (!termos.length) return true;
    var alvo = semAcento([ed.sigla, ed.titulo, ed.cargo, ed.orgao, ed.edital].join(" "));
    return termos.every(function (w) { return alvo.indexOf(w) !== -1; });
  }

  function montarAreas(list) {
    var porId = {}, usados = {};
    list.forEach(function (e) { porId[e.id] = e; });
    var areas = AREAS.map(function (a) {
      var grupos = a.grupos.map(function (g) {
        var eds = list.filter(function (e) { return e.tipo !== "carreira" && !usados[e.id] && atende(e, g.teste); });
        eds.forEach(function (e) { usados[e.id] = true; });
        eds.sort(function (x, y) { return String(x.sigla).localeCompare(String(y.sigla), "pt"); });
        return { titulo: g.titulo, nome: g.nome || g.titulo, uniao: g.uniao && porId[g.uniao], editais: eds };
      });
      return { titulo: a.titulo, uniao: a.uniao && porId[a.uniao], grupos: grupos };
    });
    var resto = list.filter(function (e) { return e.tipo !== "carreira" && !usados[e.id]; });
    if (resto.length) areas.push({ titulo: "Outros", grupos: [{ titulo: "", editais: resto }] });
    return areas;
  }

  function linha(ed, opts) {
    var cur = ES.principal();
    var main = !!(cur && cur.id === ed.id);
    var isUniao = ed.tipo === "carreira";
    if (ed.emBreve) {
      return '<div class="ed-row is-soon"><div class="ed-row-main"><span class="ed-sigla is-uniao">EM BREVE</span>' +
        '<div class="ed-row-text"><b>' + esc(ed.titulo) + '</b><span class="ed-row-meta">O conteúdo entra aqui assim que o edital for publicado e mapeado.</span></div></div></div>';
    }
    var p = progress(ed);
    var pct = p.total ? Math.round((p.lidas / p.total) * 100) : 0;
    var titulo = isUniao ? (opts.rotuloUniao || "Todos os editais") : ed.titulo;
    var meta = (isUniao ? "Junta " + (ed.editais || []).length + " edita" + ((ed.editais || []).length === 1 ? "l" : "is") + " · " : "") +
      p.lidas + " de " + p.total + " leis lidas";
    var acao = main ? '<span class="ed-tag-main">Principal</span>'
      : (opts.escolher ? '<button type="button" class="edital-btn edital-btn-primary" data-choose="' + ed.id + '">Escolher</button>' : "");
    return '<div class="ed-row' + (main ? " is-main" : "") + (isUniao ? " is-uniao" : "") + '" id="ed-' + ed.id + '">' +
      '<div class="ed-row-main">' +
        '<span class="ed-sigla' + (isUniao ? " is-uniao" : "") + '">' + esc(isUniao ? "TODOS" : ed.sigla) + "</span>" +
        '<div class="ed-row-text"><b>' + esc(titulo) + "</b>" +
          '<div class="ed-row-sub"><span class="ed-row-meta">' + esc(meta) + "</span>" +
            '<span class="ed-bar" aria-hidden="true"><i style="width:' + pct + '%"></i></span>' +
            '<details class="ed-more" data-ed="' + ed.id + '"' + (maisAbertos[ed.id] ? " open" : "") + "><summary>" +
              (isUniao ? "Disciplinas e leis" : "Ver conteúdo") + "</summary>" +
              '<div class="ed-more-body">' + (maisAbertos[ed.id] ? conteudo(ed) : "") + "</div></details>" +
          "</div></div>" +
        acao +
      "</div></div>";
  }

  // o conteúdo (disciplinas e leis) só é montado quando a pessoa abre
  function conteudo(ed) {
    var mats = lawsByMateria(ed);
    var groups = (ed.grupos || []).map(function (g) {
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
        ed.extras.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ul></div>"
      : "";
    var fonte = ed.tipo === "carreira" ? "" : '<p class="ed-note">' + esc(ed.cargo) + " · " + esc(ed.orgao) + "<br>" + esc(ed.edital) + "</p>";
    return fonte + groups + laws + extras;
  }

  function render() {
    if (!ES) return;
    var list = ES.data();
    var cur = ES.principal();
    var escolher = !cur || changing;
    var top;
    if (cur) {
      var curCar = cur.tipo === "carreira";
      var curKw = curCar ? (cur.secao === "exame" ? "exame" : "carreira") : "edital";
      top = '<div class="ed-current"><p><span class="edital-kicker">' + (curKw.charAt(0).toUpperCase() + curKw.slice(1)) + " principal</span>" +
        (curCar ? "<strong>" + esc(cur.titulo) + "</strong>"
                : "<strong>" + esc(cur.sigla) + "</strong> — " + esc(cur.titulo)) + "</p>" +
        '<div class="ed-current-actions"><a class="ed-link" href="' + LEIS_URL + '">Abrir o Diário de Leis</a>' +
        '<button type="button" class="edital-btn" id="ed-change" aria-expanded="' + (changing ? "true" : "false") + '">' +
        (changing ? "Cancelar" : "Trocar") + "</button></div></div>";
    } else {
      top = '<div class="ed-none">🎯 Escolha o edital do seu concurso (ou todos os editais de uma carreira): o Diário de Leis passa a mostrar só as leis dele, e a escolha fica salva no seu progresso.</div>';
    }
    if (changing) top += '<p class="ed-hint">Abra uma carreira e clique em “Escolher” no edital desejado.</p>';

    var buscando = termos.length > 0, achados = 0;
    var html = montarAreas(list).map(function (a, ai) {
      var total = 0, temPrincipal = false;
      var corpo = "";
      if (a.uniao && !buscando) corpo += linha(a.uniao, { escolher: escolher, rotuloUniao: "Todos os editais de " + a.titulo });
      a.uniao && cur && a.uniao.id === cur.id && (temPrincipal = true);
      a.grupos.forEach(function (g) {
        var eds = g.editais.filter(combina);
        total += eds.length;
        eds.forEach(function (e) { if (cur && e.id === cur.id) temPrincipal = true; });
        if (g.uniao && cur && g.uniao.id === cur.id) temPrincipal = true;
        if (buscando && !eds.length) return;
        var linhas = "";
        // com um edital só, a linha "Todos os editais" repetiria o mesmo conteúdo
        if (g.uniao && !buscando && (g.uniao.emBreve || g.editais.length > 1 || (cur && cur.id === g.uniao.id))) {
          linhas += linha(g.uniao, { escolher: escolher, rotuloUniao: g.uniao.emBreve ? g.uniao.titulo : "Todos os editais de " + g.nome });
        }
        linhas += eds.map(function (e) { return linha(e, { escolher: escolher }); }).join("");
        if (!linhas) linhas = '<p class="ed-vazio">Nenhum edital mapeado ainda.</p>';
        corpo += (g.titulo ? '<h3 class="ed-grupo">' + esc(g.titulo) + (eds.length ? ' <span>' + eds.length + "</span>" : "") + "</h3>" : "") + linhas;
      });
      achados += total;
      if (buscando && !total) return "";
      var aberta = buscando || (ai in abertas ? abertas[ai] : temPrincipal);
      return '<details class="ed-area" data-area="' + ai + '"' + (aberta ? " open" : "") + ">" +
        '<summary><span class="ed-area-titulo">' + esc(a.titulo) + "</span>" +
          '<span class="ed-area-n">' + total + " edita" + (total === 1 ? "l" : "is") + "</span>" +
          (temPrincipal ? '<span class="ed-tag-main">Principal</span>' : "") + "</summary>" +
        '<div class="ed-area-body">' + corpo + "</div></details>";
    }).join("");

    if (buscando && !achados) html = '<p class="ed-vazio">Nenhum edital encontrado para essa busca.</p>';
    areasRoot.innerHTML = html;
    topRoot.innerHTML = top;
    infoBusca.hidden = !buscando;
    infoBusca.textContent = achados + (achados === 1 ? " edital encontrado" : " editais encontrados");
  }

  // esqueleto: principal · busca · áreas · rodapé
  root.innerHTML = '<div class="ed-top"></div>' +
    '<div class="busca-diario ed-busca"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" aria-hidden="true"><circle cx="11" cy="11" r="7"></circle><path d="m21 21-4.3-4.3"></path></svg>' +
      '<input type="search" autocomplete="off" placeholder="Buscar edital (ex.: TJSP, Bahia, Procurador)" aria-label="Buscar edital">' +
      '<button type="button" class="busca-limpar" hidden>Limpar</button></div>' +
    '<p class="busca-resultado" hidden></p>' +
    '<div class="ed-areas"><p>Carregando os editais…</p></div>' +
    '<p class="ed-foot">Conteúdo programático mapeado a partir dos editais oficiais. As leis contadas são as que já estão no Diário de Leis; leis estaduais e resoluções aparecem à parte.</p>';
  var topRoot = root.querySelector(".ed-top");
  var areasRoot = root.querySelector(".ed-areas");
  var infoBusca = root.querySelector(".busca-resultado");
  var inputBusca = root.querySelector(".ed-busca input");
  var limparBusca = root.querySelector(".ed-busca .busca-limpar");

  function mudouBusca() {
    limparBusca.hidden = !inputBusca.value;
    termos = semAcento(inputBusca.value).split(/\s+/).filter(Boolean);
    render();
  }
  inputBusca.addEventListener("input", mudouBusca);
  limparBusca.addEventListener("click", function () { inputBusca.value = ""; mudouBusca(); inputBusca.focus(); });

  document.addEventListener("click", function (e) {
    if (!ES) return;
    var b = e.target.closest("#ed-change, [data-choose]");
    if (!b) return;
    if (b.id === "ed-change") { changing = !changing; render(); return; }
    changing = false;
    ES.setPrincipal(b.getAttribute("data-choose"));
  });

  // "toggle" não sobe na árvore: escuta na fase de captura
  root.addEventListener("toggle", function (e) {
    var d = e.target;
    if (d.classList.contains("ed-area")) {
      if (!termos.length) abertas[d.getAttribute("data-area")] = d.open;
    } else if (d.classList.contains("ed-more")) {
      maisAbertos[d.getAttribute("data-ed")] = d.open;
      if (!d.open) return;
      var body = d.querySelector(".ed-more-body");
      var ed = ES && ES.data().filter(function (x) { return x.id === d.getAttribute("data-ed"); })[0];
      if (body && ed && !body.innerHTML) body.innerHTML = conteudo(ed);
    }
  }, true);

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
  // document.currentScript some vezes já não está mais disponível quando este
  // bloco roda (script assíncrono, widget do Blogger etc.) — por isso varremos
  // as tags <script> da página em vez de depender só dele.
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
    s.src = src.replace(/[^/]+\.js(\?.*)?$/, "conta-google.js$1");
    document.head.appendChild(s);
  }
  if (document.readyState === "complete") go(); else window.addEventListener("load", go);
})();
