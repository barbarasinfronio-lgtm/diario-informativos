/*
 * em-acessibilidade.js — leitores de tela (NVDA, JAWS, VoiceOver, TalkBack) e teclado.
 * Carregado por estudamana-header.js em todas as páginas. Não muda o visual: corrige, por cima das páginas
 * já prontas, o que os leitores de tela precisam para o site ser usável sem enxergar a tela:
 *   - link "Pular para o conteúdo" e região principal (main) marcada;
 *   - janelas (cards de leitura, seletor com busca, tese/decisão): nome, foco que entra na janela,
 *     Tab que não escapa para a página de trás e foco que volta ao botão de onde a janela foi aberta;
 *   - botões só com símbolo (×) ganham nome ("Fechar");
 *   - botões de abas/filtros dizem se estão ativos (aria-pressed);
 *   - listas de abas viram "tablist"; bolinhas e selos "novo" são lidos;
 *   - contorno de foco visível para quem navega só com o teclado;
 *   - window.EstudaManaAcessibilidade.anunciar("texto") fala uma mensagem sem mover o foco.
 */
(function () {
  "use strict";
  if (window.EstudaManaAcessibilidade) return;
  var A = window.EstudaManaAcessibilidade = {};

  // ---- estilos ---------------------------------------------------------------------------------
  var st = document.createElement("style");
  st.setAttribute("data-em-a11y", "");
  st.textContent =
    ".em-a11y-pular{position:fixed;left:8px;top:-60px;z-index:2147483600;padding:.7rem 1rem;background:#fff;color:#111;font:600 16px/1.2 system-ui,sans-serif;border:2px solid #2f6fd6;border-radius:8px;text-decoration:none}" +
    ".em-a11y-pular:focus{top:8px}" +
    ".em-a11y-so-leitor{position:absolute!important;width:1px;height:1px;margin:-1px;padding:0;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap;border:0}" +
    "a:focus-visible,button:focus-visible,input:focus-visible,select:focus-visible,textarea:focus-visible,summary:focus-visible,[tabindex]:focus-visible{outline:2px solid var(--focus,var(--accent,#2f6fd6));outline-offset:2px}" +
    "[role=dialog]:focus{outline:none}";
  (document.head || document.documentElement).appendChild(st);

  // ---- anúncios (região "viva") ----------------------------------------------------------------
  var viva = null;
  function regiaoViva() {
    if (viva && document.body.contains(viva)) return viva;
    viva = document.createElement("div");
    viva.className = "em-a11y-so-leitor";
    viva.setAttribute("role", "status");
    viva.setAttribute("aria-live", "polite");
    viva.setAttribute("aria-atomic", "true");
    document.body.appendChild(viva);
    return viva;
  }
  A.anunciar = function (msg) {
    var r = regiaoViva();
    r.textContent = "";
    setTimeout(function () { r.textContent = String(msg || ""); }, 60);   // o leitor só fala se o texto mudar
  };

  // ---- pular para o conteúdo -------------------------------------------------------------------
  function acharConteudo() {
    var seletores = ["main", "[role=main]", "#estudamana-cronograma", ".page .masthead", ".page", "#Blog1", ".post-body", ".post-outer"];
    for (var i = 0; i < seletores.length; i++) {
      var el = document.querySelector(seletores[i]);
      if (el) return seletores[i] === ".page .masthead" ? el.parentNode : el;
    }
    return null;
  }
  function pular() {
    if (document.querySelector(".em-a11y-pular")) return;
    var alvo = acharConteudo();
    if (!alvo) return;
    if (!alvo.id) alvo.id = "em-conteudo";
    if (!alvo.hasAttribute("tabindex")) alvo.setAttribute("tabindex", "-1");
    if (alvo.tagName !== "MAIN" && !alvo.hasAttribute("role") && !document.querySelector("main,[role=main]")) alvo.setAttribute("role", "main");
    var a = document.createElement("a");
    a.className = "em-a11y-pular";
    a.href = "#" + alvo.id;
    a.textContent = "Pular para o conteúdo";
    a.addEventListener("click", function (e) { e.preventDefault(); alvo.focus(); alvo.scrollIntoView && alvo.scrollIntoView(); });
    document.body.insertBefore(a, document.body.firstChild);
  }

  // ---- janelas (diálogos) ----------------------------------------------------------------------
  var abertas = [];      // [{ el, volta }]
  var FOCAVEL = 'a[href],button:not([disabled]),input:not([disabled]):not([type=hidden]),select:not([disabled]),textarea:not([disabled]),summary,[tabindex]:not([tabindex="-1"])';
  function visivel(el) { return !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length); }
  function focaveis(raiz) { return [].filter.call(raiz.querySelectorAll(FOCAVEL), visivel); }
  var seq = 0;
  function nomear(d) {
    if (d.getAttribute("aria-label") || d.getAttribute("aria-labelledby")) return;
    var h = d.querySelector("h1,h2,h3,[class*=titulo],[class*=title]");
    if (h && h.textContent.trim()) {
      if (!h.id) h.id = "em-dlg-" + (++seq);
      d.setAttribute("aria-labelledby", h.id);
    } else d.setAttribute("aria-label", "Janela");
  }
  function dialogosVisiveis() {
    // só janelas de verdade (modais): a barrinha de destacar/anotar (.cad-barra, role=dialog sem aria-modal) aparece ao
    // selecionar texto e não pode receber foco, senão a seleção se desfaz e ela some
    var lista = [].slice.call(document.querySelectorAll('[role="dialog"][aria-modal="true"],.em-sel-painel'));
    var rg = document.querySelector("#overlay.open .modal");               // Repercussão Geral e Repetitivos
    if (rg) { if (!rg.getAttribute("role")) { rg.setAttribute("role", "dialog"); rg.setAttribute("aria-modal", "true"); } if (lista.indexOf(rg) < 0) lista.push(rg); }
    return lista.filter(visivel);
  }
  function janelas() {
    var vis = dialogosVisiveis();
    vis.forEach(function (d) {
      if (abertas.some(function (o) { return o.el === d; })) return;
      nomear(d);
      var volta = document.activeElement;
      abertas.push({ el: d, volta: volta && volta !== document.body && !d.contains(volta) ? volta : null });
      if (!d.contains(document.activeElement)) {
        if (!d.hasAttribute("tabindex")) d.setAttribute("tabindex", "-1");
        d.focus();
      }
    });
    abertas = abertas.filter(function (o) {
      if (document.body.contains(o.el) && vis.indexOf(o.el) >= 0) return true;
      if (o.volta && document.body.contains(o.volta) && visivel(o.volta)) { try { o.volta.focus(); } catch (e) {} }
      return false;
    });
  }
  document.addEventListener("keydown", function (e) {
    if (e.key !== "Tab" || !abertas.length) return;
    var topo = abertas[abertas.length - 1].el, f = focaveis(topo);
    if (!f.length) { e.preventDefault(); topo.focus(); return; }
    var primeiro = f[0], ultimo = f[f.length - 1], ativo = document.activeElement;
    if (!topo.contains(ativo)) { e.preventDefault(); primeiro.focus(); }
    else if (e.shiftKey && (ativo === primeiro || ativo === topo)) { e.preventDefault(); ultimo.focus(); }
    else if (!e.shiftKey && ativo === ultimo) { e.preventDefault(); primeiro.focus(); }
  }, true);

  // ---- nomes e estados ---------------------------------------------------------------------------
  var SO_SIMBOLO = { "×": 1, "✕": 1, "✖": 1, "x": 1, "X": 1 };
  var ESTADO = /(^|[-_ ])(tab|aba|opcao|chip|filtro|pill)([-_ ]|$)/;
  function ativo(el) { return /(^|\s)(active|ativa|ativo|is-active|selected)(\s|$)/.test(el.className || ""); }
  function ajustar() {
    [].forEach.call(document.querySelectorAll("button"), function (b) {
      if (!b.hasAttribute("aria-label") && !b.getAttribute("aria-labelledby") && SO_SIMBOLO[b.textContent.trim()]) b.setAttribute("aria-label", "Fechar");
      if (b.hasAttribute("aria-pressed") || b.hasAttribute("aria-selected") || b.getAttribute("role") === "tab") return;
      if (b.getAttribute("type") === "submit" || !ESTADO.test(b.className || "")) return;
      var irmaos = b.parentNode ? [].slice.call(b.parentNode.children) : [b];
      if (!irmaos.some(ativo)) return;                                  // só vale para grupos que marcam um ativo (abas, filtros)
      b.setAttribute("aria-pressed", ativo(b) ? "true" : "false");
    });
    [].forEach.call(document.querySelectorAll('[role="tab"]'), function (t) {
      var p = t.parentNode;
      if (p && !p.getAttribute("role")) p.setAttribute("role", "tablist");
    });
    [].forEach.call(document.querySelectorAll("[aria-label]:empty:not([role])"), function (s) {
      if (s.tagName === "SPAN") s.setAttribute("role", "img");      // bolinha de novidade etc.
    });
    [].forEach.call(document.querySelectorAll(".badge-novo,.star[title]"), function (s) {
      if (s.classList.contains("star") && !s.getAttribute("role")) { s.setAttribute("role", "img"); s.setAttribute("aria-label", s.getAttribute("title")); }
    });
  }

  // ---- ligação ----------------------------------------------------------------------------------
  var agendado = false;
  function passar() {
    agendado = false;
    try { janelas(); ajustar(); } catch (e) {}
  }
  function agendar() { if (!agendado) { agendado = true; (window.requestAnimationFrame || setTimeout)(passar); } }
  function iniciar() {
    pular();
    regiaoViva();
    passar();
    new MutationObserver(agendar).observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ["class", "style", "open"] });
  }
  A._passar = passar;
  if (document.body) iniciar(); else document.addEventListener("DOMContentLoaded", iniciar);
})();
