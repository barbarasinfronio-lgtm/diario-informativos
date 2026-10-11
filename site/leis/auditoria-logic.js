/* =====================================================================
   auditoria-logic.js — Diário de Auditoria e Contabilidade Pública
   (/p/diario-de-auditoria.html)

   É o mesmo código do Diário das Resoluções (normas-logic.js), apontado para
   os dados de auditoria-data.js (NBASP, NBC TSP/TA, MCASP, MDF, MTO, normas do
   TCU). Aqui só se escolhe a configuração: onde o progresso fica guardado
   (auditoria-lidas no navegador, progress-auditoria na conta, lidasAuditoria
   nos grupos) e o endereço da página.

   Na página do Blogger (cópia da página do Diário das Resoluções), troque:
     normas-data.js   por  auditoria-data.js
     normas-logic.js  por  auditoria-logic.js
   e o título do cabeçalho por "Diário de Auditoria". Ver auditoria-pagina.md.
   ===================================================================== */
(function () {
  "use strict";
  if (window.__auditoriaIniciado) return;
  window.__auditoriaIniciado = true;

  window.NORMAS_CONFIG = {
    data: window.AUDITORIA_DATA,
    order: window.AUDITORIA_ORG_ORDER,
    localKey: "auditoria-lidas",
    avatarKey: "auditoria-avatar",
    progressCol: "progress-auditoria",
    groupField: "lidasAuditoria",
    pagePath: "/p/diario-de-auditoria.html"
  };

  // Título do cabeçalho (a página do Blogger foi copiada do Diário das Resoluções)
  try {
    var h = document.querySelector("header.masthead h1");
    if (h && /resolu/i.test(h.textContent)) h.textContent = "Diário de Auditoria";
    if (/resolu/i.test(document.title)) document.title = document.title.replace(/Di[áa]rio das Resolu[çc][õo]es/i, "Diário de Auditoria");
  } catch (e) {}

  // Carrega o normas-logic.js do mesmo lugar deste arquivo (ou do GitHub Pages)
  var src = "";
  var all = document.getElementsByTagName("script");
  for (var i = 0; i < all.length; i++) {
    if (/auditoria-logic\.js/.test(all[i].src)) { src = all[i].src; break; }
  }
  var base = src ? src.replace(/[^/]+\.js(\?.*)?$/, "") : "https://barbarasinfronio-lgtm.github.io/diario-informativos/";
  var url = base + "normas-logic.js";
  fetch(url, { cache: "no-cache" })
    .then(function (r) { if (!r.ok) throw new Error("normas-logic.js"); return r.text(); })
    .then(function (code) { (0, eval)(code + "\n//# sourceURL=" + url); })
    .catch(function () {
      var s = document.createElement("script");
      s.src = url;
      document.head.appendChild(s);
    });
})();
