/*
 * conta-email.js — mantido por compatibilidade: as páginas dos Diários no
 * Blogger ainda carregam este arquivo e chamam ContaEmail.attach().
 *
 * Entrar com e-mail e senha agora fica no mesmo quadro do Google
 * (conta-google.js), que também esconde o bloco antigo "vincular e-mail"
 * do HTML. Aqui só abrimos/fechamos o painel "#account-panel" pelo botão
 * "#account-toggle" e devolvemos um renderAccountUI que não faz nada.
 */
(function () {
  "use strict";
  window.ContaEmail = window.ContaEmail || {};
  var ligado = false;

  window.ContaEmail.attach = function () {
    if (!ligado) {
      ligado = true;
      document.addEventListener("click", function (e) {
        var t = e.target.closest("#account-toggle");
        if (!t) return;
        var panel = document.getElementById("account-panel");
        if (!panel) return;
        var open = panel.hidden;
        panel.hidden = !open;
        t.setAttribute("aria-expanded", open ? "true" : "false");
      });
    }
    return { renderAccountUI: function () {} };
  };
})();
