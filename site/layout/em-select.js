/* =====================================================================
   em-select.js — seletor com busca para listas longas (todo o site)
   =====================================================================
   Troca, sozinho, qualquer <select> com 8 ou mais opções por um botão que
   abre uma lista com campo de busca (ignora acentos e maiúsculas), seções
   (<optgroup>), "usados recentemente" e, em alguns seletores, chips de
   categoria. O <select> original continua na página (escondido): o código de
   cada página segue lendo e gravando select.value e ouvindo o evento "change"
   como antes. Se este arquivo não carregar, o <select> nativo continua valendo.

   Para deixar um select de fora:  <select data-em-nativo>
   Para mudar o mínimo de opções:  <select data-em-min="12">
   Carregado pelo estudamana-header.js (todas as páginas).
   ===================================================================== */
(function () {
  "use strict";
  if (window.EstudaManaSelect) return;

  var MIN_PADRAO = 8;          // a partir de quantas opções vira seletor com busca
  var MIN_RECENTES = 20;       // a partir de quantas opções mostra "usados recentemente"
  var MAX_RECENTES = 4;

  // Chips de categoria (por id do select): filtram pelo texto da opção.
  var CHIPS = {
    "tribunal-select": [
      ["Superiores", /^(STF|STJ|TST|TSE|STM|TCU)\b/],
      ["Justiça Federal", /^(TRF|TNU)/],
      ["Trabalho", /^(TRT|TST)/],
      ["Eleitoral", /^(TRE|TSE)/],
      ["Tribunais de Justiça", /^TJ/],
      ["Jornadas e enunciados", /^(CJF|FONAJE|ENFAM|FPPC)/]
    ]
  };

  var CSS =
    ".em-sel-nativo{position:absolute!important;width:1px!important;height:1px!important;opacity:0!important;pointer-events:none!important;overflow:hidden!important;}" +
    ".em-sel-btn{display:flex;align-items:center;justify-content:space-between;gap:.6rem;width:100%;box-sizing:border-box;min-height:2.4rem;padding:.45rem .7rem;font:inherit;text-align:left;" +
      "color:var(--ink,#1c2130);background:var(--surface-2,var(--surface,#fff));border:1px solid var(--surface-line,#cbd5e1);border-radius:8px;cursor:pointer;}" +
    ".em-sel-btn:hover{border-color:var(--accent,#1f3a5f);}" +
    ".em-sel-btn:focus-visible{outline:2px solid var(--accent,#1f3a5f);outline-offset:2px;}" +
    ".em-sel-btn[disabled]{opacity:.55;cursor:not-allowed;}" +
    ".em-sel-txt{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}" +
    ".em-sel-seta{flex:none;font-size:.8em;color:var(--ink-faint,#8b90a0);}" +
    ".em-sel-fundo{position:fixed;inset:0;z-index:99998;background:transparent;}" +
    ".em-sel-painel{position:fixed;z-index:99999;display:flex;flex-direction:column;box-sizing:border-box;max-height:min(70vh,34rem);" +
      "background:var(--surface,#fff);color:var(--ink,#1c2130);border:1px solid var(--surface-line,#cbd5e1);border-radius:12px;box-shadow:0 12px 40px rgba(0,0,0,.35);" +
      "font-family:var(--font-sans,system-ui,sans-serif);font-size:calc(.95rem * var(--fs-scale,1));}" +
    ".em-sel-topo{flex:none;display:flex;align-items:center;gap:.4rem;margin:.6rem .6rem .3rem;}" +
    ".em-sel-topo .em-sel-busca{flex:1;min-width:0;margin:0;}" +
    ".em-sel-fechar{display:none;flex:none;min-height:2.6rem;padding:0 .9rem;font:inherit;font-weight:600;color:inherit;background:var(--surface-2,var(--surface,#fff));border:1px solid var(--surface-line,#cbd5e1);border-radius:8px;cursor:pointer;}" +
    ".em-sel-busca{flex:none;margin:.6rem .6rem .3rem;padding:.55rem .7rem;font:inherit;color:inherit;background:var(--surface-2,var(--surface,#fff));border:1px solid var(--surface-line,#cbd5e1);border-radius:8px;}" +
    ".em-sel-busca:focus{outline:2px solid var(--accent,#1f3a5f);outline-offset:0;}" +
    ".em-sel-chips{flex:none;display:flex;flex-wrap:wrap;gap:.35rem;padding:.2rem .6rem .4rem;}" +
    ".em-sel-chip{font:inherit;font-size:.85em;padding:.25rem .65rem;border-radius:999px;border:1px solid var(--surface-line,#cbd5e1);background:var(--surface-2,var(--surface,#fff));color:inherit;cursor:pointer;}" +
    ".em-sel-chip.ativo{background:var(--accent,#1f3a5f);border-color:var(--accent,#1f3a5f);color:var(--surface,#fff);font-weight:600;}" +
    ".em-sel-lista{flex:1;overflow-y:auto;overscroll-behavior:contain;padding:0 .3rem .5rem;margin:0;list-style:none;}" +
    ".em-sel-grupo{position:sticky;top:0;z-index:1;margin:0;padding:.5rem .6rem .25rem;font-size:.75em;font-weight:700;text-transform:uppercase;letter-spacing:.05em;" +
      "color:var(--ink-faint,#8b90a0);background:var(--surface,#fff);}" +
    ".em-sel-item{display:flex;align-items:baseline;gap:.5rem;margin:0;padding:.5rem .6rem;border-radius:8px;cursor:pointer;line-height:1.35;}" +
    ".em-sel-item.ativo{background:var(--accent-soft,rgba(31,58,95,.12));}" +
    ".em-sel-item[aria-disabled=true]{opacity:.5;cursor:not-allowed;}" +
    ".em-sel-item .em-sel-marca{flex:none;width:1em;color:var(--accent,#1f3a5f);font-weight:700;}" +
    ".em-sel-item b{flex:none;font-weight:700;}" +
    ".em-sel-item span.em-sel-resto{min-width:0;color:var(--ink-soft,#5d6475);}" +
    ".em-sel-item.so-resto span.em-sel-resto{color:inherit;}" +
    ".em-sel-vazio{padding:1rem;color:var(--ink-faint,#8b90a0);text-align:center;}" +
    ".em-sel-contagem{flex:none;padding:.3rem .8rem .5rem;font-size:.75em;color:var(--ink-faint,#8b90a0);}" +
    "@media (max-width:640px){.em-sel-painel{left:0!important;right:0!important;top:0!important;bottom:0!important;width:auto!important;max-height:none!important;border-radius:0;height:100vh;height:100dvh;}.em-sel-fechar{display:block;}.em-sel-busca{font-size:16px;}" +
      ".em-sel-item{padding:.75rem .7rem;}}";

  function norm(t) { return String(t == null ? "" : t).normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase(); }
  function el(tag, cls, txt) { var e = document.createElement(tag); if (cls) e.className = cls; if (txt != null) e.textContent = txt; return e; }
  function chaveRec(sel) { return "em-sel-rec:" + (location.pathname || "") + ":" + (sel.id || sel.name || "sel"); }
  function lerRec(sel) { try { return JSON.parse(localStorage.getItem(chaveRec(sel)) || "[]") || []; } catch (e) { return []; } }
  function gravarRec(sel, v) {
    try {
      var l = lerRec(sel).filter(function (x) { return x !== v; });
      l.unshift(v);
      localStorage.setItem(chaveRec(sel), JSON.stringify(l.slice(0, MAX_RECENTES)));
    } catch (e) {}
  }

  function injetarCss() {
    if (document.getElementById("em-sel-css")) return;
    var s = document.createElement("style");
    s.id = "em-sel-css";
    s.textContent = CSS;
    document.head.appendChild(s);
  }

  // Lê as opções do select na hora de abrir (o código da página pode ter refeito a lista).
  function lerOpcoes(sel) {
    var itens = [];
    [].forEach.call(sel.children, function (n) {
      if (n.tagName === "OPTGROUP") {
        [].forEach.call(n.children, function (o) { itens.push({ v: o.value, t: o.textContent.trim(), grupo: n.label || "", dis: o.disabled || n.disabled }); });
      } else if (n.tagName === "OPTION") {
        itens.push({ v: n.value, t: n.textContent.trim(), grupo: "", dis: n.disabled });
      }
    });
    return itens;
  }

  function melhorar(sel) {
    if (sel.getAttribute("data-em-sel") || sel.hasAttribute("data-em-nativo") || sel.multiple) return;
    var min = +sel.getAttribute("data-em-min") || MIN_PADRAO;
    if (sel.options.length < min) return;
    sel.setAttribute("data-em-sel", "1");
    injetarCss();

    var btn = el("button", "em-sel-btn");
    btn.type = "button";
    btn.setAttribute("aria-haspopup", "listbox");
    var txt = el("span", "em-sel-txt"), seta = el("span", "em-sel-seta", "▾");
    btn.appendChild(txt); btn.appendChild(seta);
    sel.parentNode.insertBefore(btn, sel);
    sel.classList.add("em-sel-nativo");
    sel.tabIndex = -1;
    sel.setAttribute("aria-hidden", "true");

    function sincronizar() {
      var o = sel.options[sel.selectedIndex];
      var t = o ? o.textContent.trim() : "";
      if (txt.textContent !== t) txt.textContent = t;
      txt.title = t;
      if (btn.disabled !== sel.disabled) btn.disabled = sel.disabled;
    }
    sincronizar();
    sel.addEventListener("change", sincronizar);
    var tempo = setInterval(function () {
      if (!sel.isConnected) { clearInterval(tempo); if (btn.parentNode) btn.parentNode.removeChild(btn); return; }
      sincronizar();
    }, 400);

    var aberto = null;
    function abrir() {
      if (aberto || sel.disabled) return;
      var itens = lerOpcoes(sel), chipsDef = CHIPS[sel.id] || null, chipAtivo = -1;
      var fundo = el("div", "em-sel-fundo"), painel = el("div", "em-sel-painel");
      painel.setAttribute("role", "dialog");
      var busca = el("input", "em-sel-busca");
      busca.type = "search"; busca.placeholder = "Digite para buscar…"; busca.setAttribute("aria-label", "Buscar");
      busca.autocomplete = "off";
      var topo = el("div", "em-sel-topo");
      var fecharBtn = el("button", "em-sel-fechar", "Fechar");
      fecharBtn.type = "button";
      fecharBtn.addEventListener("click", function () { fechar(); btn.focus(); });
      topo.appendChild(busca); topo.appendChild(fecharBtn);
      painel.appendChild(topo);
      var chipsBox = null;
      if (chipsDef) {
        chipsBox = el("div", "em-sel-chips");
        painel.appendChild(chipsBox);
      }
      var lista = el("ul", "em-sel-lista");
      lista.setAttribute("role", "listbox");
      painel.appendChild(lista);
      var contagem = el("div", "em-sel-contagem");
      painel.appendChild(contagem);

      var visiveis = [], ativo = -1;

      function pintarChips() {
        if (!chipsBox) return;
        chipsBox.innerHTML = "";
        var todos = el("button", "em-sel-chip" + (chipAtivo < 0 ? " ativo" : ""), "Todos");
        todos.type = "button";
        todos.addEventListener("click", function () { chipAtivo = -1; pintarChips(); desenhar(); busca.focus(); });
        chipsBox.appendChild(todos);
        chipsDef.forEach(function (c, i) {
          var n = itens.filter(function (it) { return c[1].test(it.t); }).length;
          if (!n) return;
          var b = el("button", "em-sel-chip" + (chipAtivo === i ? " ativo" : ""), c[0] + " · " + n);
          b.type = "button";
          b.addEventListener("click", function () { chipAtivo = i; pintarChips(); desenhar(); busca.focus(); });
          chipsBox.appendChild(b);
        });
      }

      function linha(it, extraCls) {
        var li = el("li", "em-sel-item" + (extraCls || "") + (it.v === sel.value ? " atual" : ""));
        li.setAttribute("role", "option");
        if (it.dis) li.setAttribute("aria-disabled", "true");
        li.appendChild(el("span", "em-sel-marca", it.v === sel.value ? "✓" : ""));
        var m = /^(.{2,22}?)\s+[—–]\s+(.+)$/.exec(it.t);
        if (m) { li.appendChild(el("b", null, m[1])); li.appendChild(el("span", "em-sel-resto", m[2])); }
        else { li.classList.add("so-resto"); li.appendChild(el("span", "em-sel-resto", it.t)); }
        li._it = it;
        li.addEventListener("click", function () { if (!it.dis) escolher(it); });
        return li;
      }

      function desenhar() {
        var q = norm(busca.value).split(/\s+/).filter(Boolean);
        lista.innerHTML = "";
        visiveis = [];
        var filtrados = itens.filter(function (it) {
          if (chipAtivo >= 0 && it.v !== "" && !chipsDef[chipAtivo][1].test(it.t) && !/^todos|^todas/i.test(it.t)) return false;
          var alvo = norm(it.t + " " + it.grupo);
          return q.every(function (p) { return alvo.indexOf(p) >= 0; });
        });
        // usados recentemente (só em listas longas e sem busca)
        if (!q.length && chipAtivo < 0 && itens.length >= MIN_RECENTES) {
          var rec = lerRec(sel).map(function (v) { return itens.filter(function (it) { return it.v === v && v !== ""; })[0]; }).filter(Boolean);
          if (rec.length) {
            lista.appendChild(el("li", "em-sel-grupo", "Usados recentemente"));
            rec.forEach(function (it) { var li = linha(it); lista.appendChild(li); visiveis.push(li); });
          }
        }
        var grupoAtual = null;
        filtrados.forEach(function (it) {
          if (it.grupo !== grupoAtual) {
            grupoAtual = it.grupo;
            if (grupoAtual) lista.appendChild(el("li", "em-sel-grupo", grupoAtual));
          }
          var li = linha(it);
          lista.appendChild(li); visiveis.push(li);
        });
        if (!filtrados.length) lista.appendChild(el("li", "em-sel-vazio", "Nada encontrado. Tente outra palavra."));
        contagem.textContent = filtrados.length + " de " + itens.length;
        // destaca o item atual (ou o primeiro)
        var idx = -1;
        visiveis.forEach(function (li, i) { if (idx < 0 && li._it.v === sel.value && !q.length) idx = i; });
        marcar(idx >= 0 ? idx : (q.length ? 0 : -1), idx >= 0);
      }

      function marcar(i, rolar) {
        visiveis.forEach(function (li) { li.classList.remove("ativo"); });
        ativo = i;
        if (i >= 0 && visiveis[i]) {
          visiveis[i].classList.add("ativo");
          if (rolar !== false) visiveis[i].scrollIntoView({ block: "nearest" });
        }
      }

      function posicionar() {
        if (window.innerWidth <= 640) return;
        var r = btn.getBoundingClientRect();
        var w = Math.min(Math.max(r.width, 420), window.innerWidth - 16);
        var left = Math.max(8, Math.min(r.left, window.innerWidth - w - 8));
        painel.style.width = w + "px";
        painel.style.left = left + "px";
        var abaixo = window.innerHeight - r.bottom - 12, acima = r.top - 12;
        if (abaixo < 260 && acima > abaixo) { painel.style.bottom = (window.innerHeight - r.top + 4) + "px"; painel.style.top = "auto"; painel.style.maxHeight = Math.min(acima, 544) + "px"; }
        else { painel.style.top = (r.bottom + 4) + "px"; painel.style.bottom = "auto"; painel.style.maxHeight = Math.min(abaixo, 544) + "px"; }
      }

      function escolher(it) {
        if (it.v !== "") gravarRec(sel, it.v);
        fechar();
        if (sel.value !== it.v) {
          sel.value = it.v;
          sel.dispatchEvent(new Event("change", { bubbles: true }));
        }
        sincronizar();
        btn.focus();
      }

      function fechar() {
        if (!aberto) return;
        document.removeEventListener("keydown", tecla, true);
        window.removeEventListener("resize", posicionar);
        if (fundo.parentNode) fundo.parentNode.removeChild(fundo);
        if (painel.parentNode) painel.parentNode.removeChild(painel);
        if (window.innerWidth <= 640) document.body.style.overflow = aberto.overflow;
        aberto = null;
        btn.setAttribute("aria-expanded", "false");
      }

      function tecla(e) {
        if (e.key === "Escape") { e.preventDefault(); e.stopPropagation(); fechar(); btn.focus(); }
        else if (e.key === "ArrowDown") { e.preventDefault(); marcar(Math.min(visiveis.length - 1, ativo + 1)); }
        else if (e.key === "ArrowUp") { e.preventDefault(); marcar(Math.max(0, ativo - 1)); }
        else if (e.key === "Enter") { e.preventDefault(); if (visiveis[ativo] && !visiveis[ativo]._it.dis) escolher(visiveis[ativo]._it); }
      }

      aberto = { overflow: document.body.style.overflow };
      btn.setAttribute("aria-expanded", "true");
      fundo.addEventListener("mousedown", function (e) { e.preventDefault(); fechar(); });
      document.body.appendChild(fundo);
      document.body.appendChild(painel);
      if (window.innerWidth <= 640) document.body.style.overflow = "hidden";
      pintarChips();
      desenhar();
      posicionar();
      window.addEventListener("resize", posicionar);
      document.addEventListener("keydown", tecla, true);
      busca.addEventListener("input", function () { desenhar(); });
      painel.addEventListener("mousemove", function (e) {
        var li = e.target.closest && e.target.closest(".em-sel-item");
        if (li) { var i = visiveis.indexOf(li); if (i >= 0 && i !== ativo) marcar(i, false); }
      });
      // no computador, o cursor já cai na busca; no celular a lista aparece sem abrir o teclado
      if (window.innerWidth > 640) busca.focus();
    }

    btn.addEventListener("click", abrir);
  }

  function varrer() {
    [].forEach.call(document.querySelectorAll("select"), melhorar);
  }

  var agendado = false;
  function agendar() {
    if (agendado) return;
    agendado = true;
    setTimeout(function () { agendado = false; varrer(); }, 60);
  }

  function iniciar() {
    varrer();
    // páginas que refazem o HTML (Cronograma, Diário de Leis…): melhora os selects novos
    new MutationObserver(agendar).observe(document.body, { childList: true, subtree: true });
  }

  window.EstudaManaSelect = { melhorar: melhorar, varrer: varrer };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", iniciar); else iniciar();
})();
