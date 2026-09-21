/*
 * conta-email.js — "Vincular e-mail" (opcional), base comum aos Diários
 * (Informativos, Leis, Súmulas).
 *
 * A conta anônima do Firebase só existe no armazenamento deste navegador:
 * se ele for limpo, ou a pessoa usar outro computador, um UID novo é
 * criado e o progresso antigo fica inacessível. Vincular um e-mail + senha
 * à conta anônima (linkWithCredential) resolve isso sem exigir cadastro de
 * ninguém que não queira: quem nunca clicar aqui continua exatamente como
 * antes, só com o nome/anônimo.
 *
 * Cada diário chama ContaEmail.attach({ setNote, recoverHint }) depois de
 * definir seus próprios elementos #account-* no HTML; devolve
 * { renderAccountUI } para o diário atualizar a UI quando o Firebase
 * confirmar quem está logado.
 */
(function () {
  "use strict";
  window.ContaEmail = window.ContaEmail || {};

  window.ContaEmail.attach = function (opts) {
    opts = opts || {};
    var setNote = opts.setNote || function () {};
    // Texto do botão que leva a "já tenho conta" nesta página — varia a
    // frase conforme o rótulo real do botão em cada diário.
    var recoverHint = opts.recoverHint || "Já vinculei — recuperar aqui";

    var accountPanel = document.getElementById("account-panel");
    var accountLinkBlock = document.getElementById("account-link-block");
    var accountLinkedBlock = document.getElementById("account-linked-block");
    var accountEmailInput = document.getElementById("account-email-input");
    var accountPasswordInput = document.getElementById("account-password-input");
    var accountErrorEl = document.getElementById("account-error");
    var accountLinkedEmailEl = document.getElementById("account-linked-email");

    function showAccountError(msg) {
      if (!accountErrorEl) return;
      accountErrorEl.textContent = msg;
      accountErrorEl.className = "group-note is-error";
      accountErrorEl.hidden = !msg;
    }

    function accountErrorMessage(err) {
      var code = err && err.code;
      if (code === "auth/email-already-in-use" || code === "auth/credential-already-in-use") {
        return "Esse e-mail já está vinculado a outro progresso salvo. Use \"" + recoverHint + "\" para entrar com ele em vez de vinculá-lo de novo.";
      }
      if (code === "auth/weak-password") return "Senha muito curta — use pelo menos 6 caracteres.";
      if (code === "auth/invalid-email") return "E-mail inválido.";
      if (code === "auth/wrong-password") return "Senha incorreta para esse e-mail.";
      if (code === "auth/user-not-found") return "Não encontramos esse e-mail vinculado.";
      if (code === "auth/requires-recent-login") return "Por segurança, é preciso recarregar a página e tentar de novo.";
      return "Não foi possível concluir agora. Tente de novo em um instante.";
    }

    function renderAccountUI(user) {
      var linked = !!(user && user.email);
      if (accountLinkBlock) accountLinkBlock.hidden = linked;
      if (accountLinkedBlock) accountLinkedBlock.hidden = !linked;
      if (linked && accountLinkedEmailEl) accountLinkedEmailEl.textContent = user.email;
    }

    function linkEmailAccount() {
      showAccountError("");
      var email = accountEmailInput ? accountEmailInput.value.trim() : "";
      var password = accountPasswordInput ? accountPasswordInput.value : "";
      if (!email || !password) { showAccountError("Informe e-mail e senha."); return; }
      if (!window.firebase || !firebase.auth().currentUser) { showAccountError("Ainda carregando — aguarde um instante e tente de novo."); return; }
      var cred = firebase.auth.EmailAuthProvider.credential(email, password);
      firebase.auth().currentUser.linkWithCredential(cred)
        .then(function (result) {
          renderAccountUI(result.user);
          setNote("E-mail vinculado — seu progresso está protegido.");
          setTimeout(function () { setNote(""); }, 2600);
        })
        .catch(function (err) { showAccountError(accountErrorMessage(err)); });
    }

    function signInWithEmail() {
      showAccountError("");
      var email = accountEmailInput ? accountEmailInput.value.trim() : "";
      var password = accountPasswordInput ? accountPasswordInput.value : "";
      if (!email || !password) { showAccountError("Informe e-mail e senha."); return; }
      if (!window.firebase) { showAccountError("Ainda carregando — aguarde um instante e tente de novo."); return; }
      firebase.auth().signInWithEmailAndPassword(email, password)
        .then(function (result) {
          renderAccountUI(result.user);
          setNote("Progresso recuperado.");
          setTimeout(function () { setNote(""); }, 2600);
        })
        .catch(function (err) { showAccountError(accountErrorMessage(err)); });
    }

    function togglePanel(btn, panel) {
      if (!btn || !panel) return;
      var open = panel.hidden;
      panel.hidden = !open;
      btn.setAttribute("aria-expanded", open ? "true" : "false");
    }

    document.addEventListener("click", function (e) {
      var t = e.target.closest("#account-toggle, #account-link-btn, #account-signin-btn");
      if (!t) return;
      switch (t.id) {
        case "account-toggle": togglePanel(t, accountPanel); break;
        case "account-link-btn": linkEmailAccount(); break;
        case "account-signin-btn": signInWithEmail(); break;
      }
    });

    return { renderAccountUI: renderAccountUI };
  };
})();
