/*
 * conta-email.js — mantido só por compatibilidade: as páginas dos Diários no
 * Blogger ainda carregam este arquivo e chamam ContaEmail.attach().
 *
 * Entrar com e-mail e senha agora fica no mesmo quadro do Google
 * (conta-google.js), que também esconde o bloco antigo "vincular e-mail"
 * do HTML. Aqui só devolvemos um renderAccountUI que não faz nada.
 */
(function () {
  "use strict";
  window.ContaEmail = window.ContaEmail || {};
  window.ContaEmail.attach = function () {
    return { renderAccountUI: function () {} };
  };
})();
