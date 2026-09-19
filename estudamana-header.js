/*
 * estudamana-header.js — CABEÇALHO ÚNICO DO ESTUDA MANA
 *
 * Monta o menu de navegação de todas as páginas. A lista de páginas vem
 * automaticamente do Blogger (feed de "Páginas" do próprio site): toda
 * página nova que você publicar aparece aqui sozinha, no fim do menu, sem
 * editar nada. Páginas em rascunho não aparecem.
 *
 * Como usar: uma única vez, no tema do Blogger (Tema > Editar HTML, antes
 * de </body>):
 *   <script src=".../estudamana-header.js"></script>
 * O cabeçalho aparece sozinho na página inicial e nas páginas de estudo (as que têm o
 * bloco ".page" com "header.masthead" dos Diários, o "header.top" do RG ou um
 * <div id="estudamana-header">) e se encaixa no topo do conteúdo. Nas
 * demais páginas do site (inicial, posts) ele não faz nada. O visual dele fica
 * em estudamana-header.css (que usa as cores/fontes de estudamana-tokens.css).
 *
 * Ajustes opcionais, todos aqui embaixo, em CONFIG.
 */
(function () {
  "use strict";

  var CONFIG = {
    // Ordem preferida (pelo final do endereço da página, sem "/p/" e sem
    // ".html"). Páginas que não estão nesta lista entram DEPOIS dessas,
    // da mais antiga para a mais nova — então páginas novas caem no fim.
    order: [
      "editais",
      "diario-dos-informativos",
      "diario-das-decisoes",
      "diario-de-leis",
      "diario-das-sumulas",
      "ranking-de-informativos",
      "meus-grupos",
      "meus-premios"
    ],

    // Páginas que NÃO devem aparecer no menu (mesmo formato de "order").
    hide: [],

    // Nomes mais curtos para o menu (opcional). Formato: "endereco": "Nome".
    // Sem entrada aqui, vale o título da página no Blogger.
    labels: {},

    // Texto/endereço do primeiro item (a página inicial). Use null para
    // não mostrar.
    home: null,

    // Página inicial: quem abre o endereço principal do site (sem nada
    // depois da barra) é levado direto a esta página. Use null para
    // voltar a mostrar a página inicial em branco do Blogger.
    // (Como a inicial agora leva ao Diário de Informativos, o item
    // "Início" saiu do menu; para trazê-lo de volta, troque "home: null"
    // por  home: { label: "Início", href: "/" }.)
    homePage: "/p/diario-dos-informativos.html",

    // Lista de segurança: só aparece se o Blogger não responder e ainda
    // não houver cópia guardada no navegador. Não precisa manter em dia.
    fallback: [
      { path: "/p/diario-dos-informativos.html", title: "Di\u00e1rio de Informativos" },
      { path: "/p/diario-de-leis.html", title: "Di\u00e1rio de Leis" },
      { path: "/p/diario-das-sumulas.html", title: "Di\u00e1rio das S\u00famulas" },
      { path: "/p/meus-grupos.html", title: "Meus Grupos" }
    ]
  };

  // ---- página inicial padrão ------------------------------------------------
  (function goHome() {
    try {
      if (!CONFIG.homePage) return;
      if (window.top !== window.self) return;                 // pré-visualização do Blogger
      var p = location.pathname;
      if (p !== "/" && p !== "/index.html") return;
      if (location.search && !/^\?m=[01]$/.test(location.search)) return; // busca, marcadores, arquivo…
      if (/[?&]view=/.test(location.search)) return;
      location.replace(CONFIG.homePage + location.search);
    } catch (e) {}
  })();

  var CACHE_KEY = "estudamana-menu-v1";

  function slugOf(path) {
    return String(path).replace(/^.*\//, "").replace(/\.html$/, "");
  }

  function normPath(path) {
    return String(path).replace(/[?#].*$/, "").replace(/\/+$/, "") || "/";
  }

  // ---- cache (só uma conveniência: mostra o menu na hora) -------------
  function readCache() {
    try {
      var raw = localStorage.getItem(CACHE_KEY);
      var list = raw ? JSON.parse(raw) : null;
      return Array.isArray(list) && list.length ? list : null;
    } catch (e) { return null; }
  }
  function writeCache(list) {
    try { localStorage.setItem(CACHE_KEY, JSON.stringify(list)); } catch (e) {}
  }

  // ---- feed do Blogger ------------------------------------------------
  function parseFeed(json) {
    var entries = (json && json.feed && json.feed.entry) || [];
    return entries.map(function (e) {
      var href = "";
      (e.link || []).forEach(function (l) {
        if (l.rel === "alternate") href = l.href;
      });
      var path = "";
      try { path = new URL(href).pathname; } catch (err) { path = ""; }
      return {
        path: path,
        title: (e.title && e.title.$t) || slugOf(path),
        published: (e.published && e.published.$t) || ""
      };
    }).filter(function (p) { return p.path; });
  }

  function fetchPages() {
    var url = location.origin + "/feeds/pages/default?alt=json&max-results=100";
    return fetch(url, { credentials: "omit" })
      .then(function (r) {
        if (!r.ok) throw new Error("feed " + r.status);
        return r.json();
      })
      .then(parseFeed);
  }

  // ---- ordenação e filtros -------------------------------------------
  function arrange(pages) {
    var hide = {};
    CONFIG.hide.forEach(function (s) { hide[s] = true; });
    var visible = pages.filter(function (p) { return !hide[slugOf(p.path)]; });

    var rank = {};
    CONFIG.order.forEach(function (s, i) { rank[s] = i; });

    var pinned = visible.filter(function (p) { return slugOf(p.path) in rank; })
      .sort(function (a, b) { return rank[slugOf(a.path)] - rank[slugOf(b.path)]; });
    var rest = visible.filter(function (p) { return !(slugOf(p.path) in rank); })
      .sort(function (a, b) { return String(a.published).localeCompare(String(b.published)); });
    return pinned.concat(rest);
  }

  // ---- montagem do cabeçalho -----------------------------------------
  function buildNav(pages) {
    var current = normPath(location.pathname);
    var nav = document.createElement("nav");
    nav.className = "em-header";
    nav.setAttribute("aria-label", "P\u00e1ginas do Estuda Mana");
    nav.setAttribute("data-em-header", "");

    var ul = document.createElement("ul");
    ul.className = "em-header__list";

    function addItem(label, href, isCurrent) {
      var li = document.createElement("li");
      var a = document.createElement("a");
      a.className = "em-header__link";
      a.textContent = label;
      a.href = href;
      if (isCurrent) {
        a.setAttribute("aria-current", "page");
        a.classList.add("is-current");
      }
      li.appendChild(a);
      ul.appendChild(li);
    }

    if (CONFIG.home) {
      addItem(CONFIG.home.label, CONFIG.home.href, current === normPath(CONFIG.home.href));
    }
    arrange(pages).forEach(function (p) {
      var label = CONFIG.labels[slugOf(p.path)] || p.title;
      addItem(label, p.path, current === normPath(p.path));
    });

    nav.appendChild(ul);
    return nav;
  }

  // Onde encaixar: 1) um <div id="estudamana-header"> se a página tiver;
  // 2) o começo do ".page" (Diários, Ranking, Meus Grupos);
  // 3) antes do "header.top" (RG e Repetitivos); 4) na página inicial.
  function mount(nav) {
    var old = document.querySelector("[data-em-header]");
    if (old) {
      nav.className = old.className; // mantém a posição (reading/wide)
      old.parentNode.replaceChild(nav, old);
      return;
    }

    var slot = document.getElementById("estudamana-header");
    // O tema do Blogger também tem um ".page" (a página inteira); o que nos
    // interessa é o ".page" dos Diários, que tem o "header.masthead" dentro.
    var mast = document.querySelector(".page > header.masthead");
    var page = mast ? mast.parentNode : null;
    var top = document.querySelector("header.top");
    if (slot) {
      slot.appendChild(nav);
    } else if (page) {
      nav.classList.add("em-header--reading");
      page.insertBefore(nav, page.firstChild);
    } else if (top && top.parentNode) {
      nav.classList.add("em-header--wide");
      top.parentNode.insertBefore(nav, top);
    } else if (normPath(location.pathname) === "/" && document.getElementById("Blog1")) {
      // Página inicial do Blogger (sem postagens): o menu vira a navegação
      // da home, dentro da área de conteúdo do tema.
      var blog = document.getElementById("Blog1");
      nav.classList.add("em-header--reading");
      blog.insertBefore(nav, blog.firstChild);
    }
    // Sem nenhum desses encaixes, a página não é uma das páginas de
    // estudo (ex.: página inicial ou posts do blog) e o menu não aparece.
    // É isso que permite colocar este script uma única vez no tema.
  }

  // ---- CSS do cabeçalho: carregado da mesma pasta deste script --------
  function loadStyles() {
    var script = document.currentScript;
    if (!script) {
      var all = document.getElementsByTagName("script");
      for (var i = 0; i < all.length; i++) {
        if (/estudamana-header\.js/.test(all[i].src)) { script = all[i]; break; }
      }
    }
    if (!script || !script.src) return;
    var href = script.src.replace(/estudamana-header\.js(\?.*)?$/, "estudamana-header.css$1");
    if (document.querySelector('link[href="' + href + '"]')) return;
    var link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = href;
    document.head.appendChild(link);
  }

  function signature(list) {
    return list.map(function (p) { return p.path + "|" + p.title; }).join("\n");
  }

  function start() {
    var shown = readCache() || CONFIG.fallback;
    mount(buildNav(shown));

    fetchPages().then(function (fresh) {
      if (!fresh.length) return;
      if (signature(fresh) !== signature(shown)) {
        mount(buildNav(fresh));
      }
      writeCache(fresh);
    }).catch(function () { /* mantém o que já está na tela */ });
  }

  loadStyles();
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
})();
