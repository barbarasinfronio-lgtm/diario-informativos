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
 * Ele também põe, no canto de baixo à direita de toda página de estudo, os
 * botões "A− A A+" de tamanho da letra (ver CONFIG.fontSize). Eles ficam por
 * cima de tudo, inclusive das janelas que abrem por cima da página (ex.: o
 * card aberto do Diário das Decisões); a escolha fica salva no navegador.
 *
 * Para as mudanças aparecerem sem esperar o cache do navegador, o tema
 * carrega este arquivo com fetch(..., { cache: "no-cache" }) em vez de
 * <script src>; o CSS (estudamana-tokens.css + estudamana-header.css) é
 * buscado do mesmo jeito por loadStyles(), lá embaixo.
 *
 * Ajustes opcionais, todos aqui embaixo, em CONFIG.
 */
(function () {
  "use strict";

  // Se o script estiver na página mais de uma vez (no tema e na página),
  // só a primeira cópia roda.
  if (window.__estudamanaHeader) return;
  window.__estudamanaHeader = true;

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
    ],

    // Botões "A− A A+" flutuantes, para a pessoa aumentar ou reduzir a
    // letra. Cada clique muda a escala (--fs-scale de estudamana-tokens.css)
    // em "step", entre "min" e "max" (1 = tamanho padrão). A escolha fica
    // salva no navegador. Use fontSize: null para esconder os botões.
    // Aparecem em toda página de estudo (as mesmas onde o menu aparece) e
    // em qualquer página com um elemento data-em-font.
    fontSize: { min: 0.85, max: 1.5, step: 0.1 }
  };

  // ---- tamanho da letra -----------------------------------------------------
  // Aplicado já aqui, antes de montar o menu, para a página não aparecer
  // primeiro no tamanho padrão e depois "pular" para o tamanho escolhido.
  var FONT_KEY = "estudamana-fonte";

  function clampScale(v) {
    var f = CONFIG.fontSize;
    v = Math.round(v * 100) / 100;
    return Math.min(f.max, Math.max(f.min, v));
  }

  function readScale() {
    try {
      var v = parseFloat(localStorage.getItem(FONT_KEY));
      return isFinite(v) ? clampScale(v) : 1;
    } catch (e) { return 1; }
  }

  function applyScale(v) {
    var root = document.documentElement;
    if (v === 1) root.style.removeProperty("--fs-scale");
    else root.style.setProperty("--fs-scale", String(v));
  }

  var fontScale = CONFIG.fontSize ? readScale() : 1;
  applyScale(fontScale);

  function setScale(v) {
    fontScale = clampScale(v);
    applyScale(fontScale);
    try {
      if (fontScale === 1) localStorage.removeItem(FONT_KEY);
      else localStorage.setItem(FONT_KEY, String(fontScale));
    } catch (e) {}
    updateFontButtons();
  }

  var fontBox = null;

  function updateFontButtons() {
    var f = CONFIG.fontSize;
    if (!fontBox) return;
    fontBox.querySelector("[data-font=down]").disabled = fontScale <= f.min;
    fontBox.querySelector("[data-font=up]").disabled = fontScale >= f.max;
    var reset = fontBox.querySelector("[data-font=reset]");
    reset.disabled = fontScale === 1;
    reset.title = "Tamanho padr\u00e3o da letra (agora: " + Math.round(fontScale * 100) + "%)";
  }

  function buildFontControls() {
    var f = CONFIG.fontSize;
    var box = document.createElement("div");
    box.className = "em-font";
    box.setAttribute("role", "group");
    box.setAttribute("aria-label", "Tamanho da letra");

    [
      { key: "down", text: "A\u2212", label: "Diminuir a letra", delta: -f.step },
      { key: "reset", text: "A", label: "Tamanho padr\u00e3o da letra", delta: 0 },
      { key: "up", text: "A+", label: "Aumentar a letra", delta: f.step }
    ].forEach(function (b) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "em-font__btn em-font__btn--" + b.key;
      btn.textContent = b.text;
      btn.title = b.label;
      btn.setAttribute("aria-label", b.label);
      btn.setAttribute("data-font", b.key);
      btn.addEventListener("click", function () {
        setScale(b.delta ? fontScale + b.delta : 1);
      });
      box.appendChild(btn);
    });
    return box;
  }

  // Uma janela <dialog> aberta com showModal() fica numa camada acima de
  // tudo e bloqueia o resto da página; nesse caso os botões entram nela
  // enquanto estiver aberta, e voltam para o <body> quando ela fecha.
  function placeFontControls() {
    var open = null;
    try { open = document.querySelector("dialog[open]:modal"); }
    catch (e) { open = null; } // navegador antigo, sem :modal
    var parent = open || document.body;
    if (fontBox.parentNode !== parent) parent.appendChild(fontBox);
  }

  function isStudyPage() {
    return !!(document.getElementById("estudamana-header") ||
      document.querySelector(".page > header.masthead, header.top, [data-em-font]"));
  }

  function startFontControls() {
    if (!CONFIG.fontSize || fontBox || !isStudyPage()) return;
    fontBox = buildFontControls();
    document.documentElement.classList.add("em-has-font");
    placeFontControls();
    updateFontButtons();
    try {
      new MutationObserver(placeFontControls).observe(document.body, {
        subtree: true, attributes: true, attributeFilter: ["open"]
      });
    } catch (e) {}
  }

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

  // ---- CSS do cabeçalho -----------------------------------------------
  // Endereço dos arquivos: a pasta deste script, quando ele foi carregado
  // por <script src>; senão (carregado por fetch), o jsDelivr.
  var CDN_BASE = "https://cdn.jsdelivr.net/gh/barbarasinfronio-lgtm/diario-informativos@main/";

  function assetBase() {
    var script = document.currentScript;
    if (!script) {
      var all = document.getElementsByTagName("script");
      for (var i = 0; i < all.length; i++) {
        if (/estudamana-header\.js/.test(all[i].src)) { script = all[i]; break; }
      }
    }
    return script && script.src
      ? script.src.replace(/estudamana-header\.js(\?.*)?$/, "")
      : CDN_BASE;
  }

  // Busca os CSS com "no-cache" (o navegador confere com o servidor se o
  // arquivo mudou; se não mudou, a resposta é mínima) e põe numa <style>.
  // O @import do tokens é trocado pelo conteúdo do próprio tokens, que
  // também vem sempre atualizado. Se o fetch falhar, volta ao <link>.
  function loadStyles() {
    if (document.querySelector("[data-em-header-css]")) return;
    var base = assetBase();
    var style = document.createElement("style");
    style.setAttribute("data-em-header-css", "");
    document.head.appendChild(style);

    function get(file) {
      return fetch(base + file, { cache: "no-cache" }).then(function (r) {
        if (!r.ok) throw new Error(file + " " + r.status);
        return r.text();
      });
    }

    Promise.all([get("estudamana-tokens.css"), get("estudamana-header.css")])
      .then(function (css) {
        style.textContent = css.map(function (t) {
          return t.replace(/@import\s+url\(["']?estudamana-tokens\.css["']?\)\s*;?/g, "");
        }).join("\n");
      })
      .catch(function () {
        var link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = base + "estudamana-header.css";
        link.setAttribute("data-em-header-css", "");
        style.parentNode.replaceChild(link, style);
      });
  }

  function signature(list) {
    return list.map(function (p) { return p.path + "|" + p.title; }).join("\n");
  }

  function start() {
    var shown = readCache() || CONFIG.fallback;
    mount(buildNav(shown));
    startFontControls();

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
