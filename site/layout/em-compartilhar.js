/*
 * em-compartilhar.js — "Compartilhar" e "Imprimir" dos cards (decisões, leis, cronograma…).
 *
 *   EstudaManaCompartilhar.barra({
 *     titulo: "Tema 93 da Repercussão Geral (STF)",   // título curto (assunto do e-mail, cabeçalho da impressão)
 *     texto:  "Tese: …",                              // resumo curto que acompanha o link
 *     url:    "/p/diario-das-decisoes.html#abrir=93", // link do card (relativo ou completo; abre o card direto)
 *     conteudo: function () { return <elemento do card> }   // o que será impresso
 *   })  →  <span class="em-comp"> com os botões "Compartilhar" e "Imprimir"
 *
 * Compartilhar: menu com WhatsApp, Telegram, e-mail, X, Facebook, LinkedIn, copiar link e, em aparelhos que têm
 * a folha de compartilhamento (celular), "Outros aplicativos…". Imprimir: monta uma folha limpa (fundo branco,
 * sem botões) com o conteúdo do card COMO ESTÁ NA TELA — inclusive os trechos destacados e as anotações da pessoa
 * (Meus Cadernos), que já estão no card — e abre a impressão do navegador (também serve para "Salvar como PDF").
 */
(function () {
  "use strict";
  if (window.EstudaManaCompartilhar) return;

  var SITE = "https://www.estudamana.com.br";

  var st = document.createElement("style");
  st.setAttribute("data-em-comp", "");
  st.textContent =
    ".em-comp{position:relative;display:inline-flex;gap:.4rem;flex-wrap:wrap;align-items:center}" +
    ".em-comp-btn{font:inherit;font-size:calc(.8rem * var(--fs-scale,1));font-weight:600;padding:.3rem .75rem;border-radius:999px;cursor:pointer;" +
    "color:var(--ink-soft,#475569);background:var(--surface,#fff);border:1px solid var(--surface-line,#cbd5e1)}" +
    ".em-comp-btn:hover{color:var(--ink,#111);background:var(--surface-2,#f1f5f9)}" +
    ".em-comp-menu{position:absolute;top:calc(100% + .35rem);left:0;z-index:2147483100;min-width:13rem;padding:.35rem;display:flex;flex-direction:column;" +
    "background:var(--surface,#fff);color:var(--ink,#111);border:1px solid var(--surface-line,#cbd5e1);border-radius:var(--radius,10px);box-shadow:0 8px 24px rgba(0,0,0,.25)}" +
    ".em-comp-menu[hidden]{display:none}" +
    ".em-comp-item{display:block;width:100%;text-align:left;font:inherit;font-size:calc(.9rem * var(--fs-scale,1));padding:.5rem .7rem;border:0;border-radius:6px;" +
    "background:transparent;color:inherit;cursor:pointer;text-decoration:none}" +
    ".em-comp-item:hover,.em-comp-item:focus-visible{background:var(--surface-2,#e2e8f0);outline:none}" +
    ".em-comp-ok{font-size:calc(.8rem * var(--fs-scale,1));color:var(--ink-soft,#475569)}";
  (document.head || document.documentElement).appendChild(st);

  function absoluta(u) {
    u = String(u || "");
    if (/^https?:/i.test(u)) return u;
    if (u.charAt(0) === "/") return SITE + u;
    return location.href.split("#")[0] + (u.charAt(0) === "#" ? u : "#" + u);
  }
  function enc(s) { return encodeURIComponent(s); }
  function curto(t, n) { t = String(t || "").replace(/\s+/g, " ").trim(); return t.length > n ? t.slice(0, n - 1).replace(/\s+\S*$/, "") + "…" : t; }

  // ---- Compartilhar -------------------------------------------------------------
  function opcoes(o) {
    var url = absoluta(o.url), titulo = o.titulo || document.title, texto = curto(o.texto, 280);
    var msg = titulo + (texto ? "\n" + texto : "") + "\n" + url;
    var lista = [
      { rotulo: "WhatsApp", href: "https://wa.me/?text=" + enc(msg) },
      { rotulo: "Telegram", href: "https://t.me/share/url?url=" + enc(url) + "&text=" + enc(titulo + (texto ? "\n" + texto : "")) },
      { rotulo: "E-mail", href: "mailto:?subject=" + enc(titulo) + "&body=" + enc(msg) },
      { rotulo: "X (Twitter)", href: "https://twitter.com/intent/tweet?text=" + enc(curto(titulo, 200)) + "&url=" + enc(url) },
      { rotulo: "Facebook", href: "https://www.facebook.com/sharer/sharer.php?u=" + enc(url) },
      { rotulo: "LinkedIn", href: "https://www.linkedin.com/sharing/share-offsite/?url=" + enc(url) }
    ];
    return { lista: lista, url: url, titulo: titulo, texto: texto, msg: msg };
  }

  function copiar(txt) {
    if (navigator.clipboard && navigator.clipboard.writeText) return navigator.clipboard.writeText(txt);
    return new Promise(function (ok, erro) {
      var ta = document.createElement("textarea");
      ta.value = txt; ta.style.cssText = "position:fixed;opacity:0";
      document.body.appendChild(ta); ta.select();
      try { document.execCommand("copy") ? ok() : erro(); } catch (e) { erro(e); }
      document.body.removeChild(ta);
    });
  }

  // ---- Imprimir ----------------------------------------------------------------
  var CSS_IMPRESSAO =
    "html,body{background:#fff!important;color:#000!important;margin:0}" +
    "body{padding:18mm 16mm;font-family:Georgia,'Times New Roman',serif;font-size:12pt;line-height:1.5}" +
    ".em-print-topo{border-bottom:1px solid #999;margin-bottom:10mm;padding-bottom:3mm;font:10pt/1.4 system-ui,sans-serif;color:#444}" +
    ".em-print-topo b{display:block;font-size:13pt;color:#000;margin-bottom:1mm}" +
    ".em-print-rodape{border-top:1px solid #999;margin-top:10mm;padding-top:3mm;font:9pt/1.4 system-ui,sans-serif;color:#555;word-break:break-all}" +
    ".em-print-corpo *{color:#000!important;background-image:none!important;box-shadow:none!important;text-shadow:none!important}" +
    ".em-print-corpo, .em-print-corpo > *{position:static!important;width:auto!important;height:auto!important;max-width:none!important;max-height:none!important;overflow:visible!important;" +
    "margin-left:0!important;margin-right:0!important;padding-left:0!important;padding-right:0!important;border:0!important;background:#fff!important;transform:none!important}" +
    ".em-print-corpo button,.em-print-corpo .close,.em-print-corpo [class*='-x'],.em-print-corpo .em-comp,.em-print-corpo .chip,.em-print-corpo .cad-anotar," +
    ".em-print-corpo .cad-dica,.em-print-corpo .teor-pedido,.em-print-corpo .normas-box [class*='btn'],.em-print-corpo input,.em-print-corpo select,.em-print-corpo textarea," +
    ".em-print-corpo [data-nao-imprimir]{display:none!important}" +
    ".em-print-corpo .cad-item-btn{display:block!important;border:0;background:none;text-align:left;font:inherit}" +
    ".em-print-corpo .cad-item-btn *{display:block}" +
    ".em-print-corpo .cad-trecho{font-style:italic}" +
    ".em-print-corpo .cad-nota{margin:.2em 0 0 1em;border-left:2px solid #999;padding-left:.6em}" +
    ".em-print-corpo mark.cad-mark{-webkit-print-color-adjust:exact;print-color-adjust:exact;color:#000!important}" +
    ".em-print-corpo mark.cad-amarelo{background:#fde68a!important}.em-print-corpo mark.cad-verde{background:#bbf7d0!important}.em-print-corpo mark.cad-rosa{background:#fbcfe8!important}" +
    ".em-print-corpo mark.cad-com-nota{border-bottom:2px solid #333}" +
    ".em-print-corpo .cad-item{list-style:none;border-left:4px solid #999;padding-left:.6em;margin:.4em 0;-webkit-print-color-adjust:exact;print-color-adjust:exact}" +
    ".em-print-corpo .cad-borda-amarelo{border-left-color:#f59e0b}.em-print-corpo .cad-borda-verde{border-left-color:#16a34a}.em-print-corpo .cad-borda-rosa{border-left-color:#db2777}" +
    ".em-print-corpo .risk-box,.em-print-corpo .fields{border:1px solid #bbb!important;border-radius:4px;padding:.4em .7em!important}" +
    ".em-print-corpo h1,.em-print-corpo h2,.em-print-corpo h3{page-break-after:avoid}" +
    ".em-print-corpo p{orphans:3;widows:3}" +
    "@page{margin:0}";

  function imprimir(o) {
    var alvo = o.conteudo && o.conteudo();
    if (!alvo) return;
    var iframe = document.createElement("iframe");
    iframe.setAttribute("aria-hidden", "true");
    iframe.style.cssText = "position:fixed;right:0;bottom:0;width:0;height:0;border:0;visibility:hidden";
    document.body.appendChild(iframe);
    var d = iframe.contentDocument || iframe.contentWindow.document;
    var clone = alvo.cloneNode(true);
    var folhas = [].map.call(document.querySelectorAll('link[rel="stylesheet"],style:not([data-em-comp]):not([data-em-a11y])'), function (n) { return n.outerHTML; }).join("");
    var corpoHtml = clone.outerHTML;
    var url = absoluta(o.url);
    d.open();
    d.write('<!doctype html><html lang="pt-BR" data-theme="light"><head><meta charset="utf-8"><title>' + String(o.titulo || "Estuda Mana").replace(/</g, "&lt;") + "</title>" +
      folhas + "<style>" + CSS_IMPRESSAO + "</style></head><body>" +
      '<div class="em-print-topo"><b>' + String(o.titulo || "").replace(/</g, "&lt;") + "</b>Estuda Mana · impresso em " + new Date().toLocaleDateString("pt-BR") + "</div>" +
      '<div class="em-print-corpo">' + corpoHtml + "</div>" +
      '<div class="em-print-rodape">Fonte e link: ' + url + "<br>Inclui os trechos destacados e as anotações que a pessoa fez em Meus Cadernos.</div></body></html>");
    d.close();
    var feito = false;
    function imprimirAgora() {
      if (feito) return;
      feito = true;
      try { iframe.contentWindow.focus(); iframe.contentWindow.print(); } catch (e) {}
      setTimeout(function () { if (iframe.parentNode) iframe.parentNode.removeChild(iframe); }, 60000);
    }
    iframe.onload = function () { setTimeout(imprimirAgora, 500); };       // espera as folhas de estilo chegarem
    setTimeout(imprimirAgora, 2500);
  }

  // ---- barra -------------------------------------------------------------------
  function barra(o) {
    var caixa = document.createElement("span");
    caixa.className = "em-comp";
    caixa.setAttribute("data-nao-imprimir", "");
    var bComp = document.createElement("button");
    bComp.type = "button"; bComp.className = "em-comp-btn";
    bComp.setAttribute("aria-haspopup", "menu"); bComp.setAttribute("aria-expanded", "false");
    bComp.textContent = "↗ Compartilhar";
    var bImp = document.createElement("button");
    bImp.type = "button"; bImp.className = "em-comp-btn";
    bImp.textContent = "🖨 Imprimir";
    bImp.title = "Imprime o card com os seus destaques e anotações (ou salve em PDF)";
    var aviso = document.createElement("span");
    aviso.className = "em-comp-ok"; aviso.setAttribute("role", "status");
    var menu = document.createElement("div");
    menu.className = "em-comp-menu"; menu.hidden = true; menu.setAttribute("role", "menu");

    function fechar() { menu.hidden = true; bComp.setAttribute("aria-expanded", "false"); document.removeEventListener("click", fora, true); document.removeEventListener("keydown", tecla, true); }
    function fora(e) { if (!caixa.contains(e.target)) fechar(); }
    function tecla(e) { if (e.key === "Escape") { fechar(); bComp.focus(); } }
    function montar() {
      var op = opcoes(o);
      menu.innerHTML = "";
      op.lista.forEach(function (x) {
        var a = document.createElement("a");
        a.className = "em-comp-item"; a.setAttribute("role", "menuitem");
        a.href = x.href; a.target = "_blank"; a.rel = "noopener noreferrer";
        a.textContent = x.rotulo;
        a.addEventListener("click", function () { setTimeout(fechar, 50); });
        menu.appendChild(a);
      });
      var bc = document.createElement("button");
      bc.type = "button"; bc.className = "em-comp-item"; bc.setAttribute("role", "menuitem"); bc.textContent = "Copiar link";
      bc.addEventListener("click", function () {
        copiar(op.url).then(function () { aviso.textContent = "Link copiado."; }).catch(function () { aviso.textContent = op.url; });
        fechar();
        setTimeout(function () { aviso.textContent = ""; }, 3500);
      });
      menu.appendChild(bc);
      if (navigator.share) {
        var bn = document.createElement("button");
        bn.type = "button"; bn.className = "em-comp-item"; bn.setAttribute("role", "menuitem"); bn.textContent = "Outros aplicativos…";
        bn.addEventListener("click", function () { fechar(); navigator.share({ title: op.titulo, text: op.texto, url: op.url }).catch(function () {}); });
        menu.appendChild(bn);
      }
    }
    bComp.addEventListener("click", function () {
      if (!menu.hidden) { fechar(); return; }
      montar();
      menu.hidden = false; bComp.setAttribute("aria-expanded", "true");
      document.addEventListener("click", fora, true);
      document.addEventListener("keydown", tecla, true);
      var primeiro = menu.querySelector(".em-comp-item"); if (primeiro) primeiro.focus();
    });
    bImp.addEventListener("click", function () { imprimir(o); });
    caixa.appendChild(bComp); caixa.appendChild(bImp); caixa.appendChild(aviso); caixa.appendChild(menu);
    return caixa;
  }

  window.EstudaManaCompartilhar = { barra: barra, imprimir: imprimir, opcoes: opcoes };
})();
