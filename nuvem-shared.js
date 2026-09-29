/* =====================================================================
   nuvem-shared.js — liga a página à conta (Firebase) e aos grupos de estudo
   Para páginas cujo HTML no Blogger não traz os scripts do Firebase
   (Diário de Leis, Constitucionalidade, Reclamações): baixa o Firebase,
   a configuração e o grupos-shared.js, faz o login (anônimo, se ninguém
   estiver logado) e manda a contagem de leituras para cada grupo.
   Uso:
     EstudaManaNuvem.preparar().then(function (uid) { ... });
     EstudaManaNuvem.enviarGrupos("lidasLeis", 12);
   ===================================================================== */
(function () {
  if (window.EstudaManaNuvem) return;

  // Mesma configuração pública que as outras páginas trazem no HTML.
  var CONFIG = {
    apiKey: "AIzaSyAe0g7Ps4d_uXvh1IiFTtDICwZ91YOUto0",
    appId: "1:390710055357:web:8bd7223ea97c9e468042d4",
    authDomain: "diariodeinformativos.firebaseapp.com",
    messagingSenderId: "390710055357",
    projectId: "diariodeinformativos",
    storageBucket: "diariodeinformativos.firebasestorage.app"
  };
  var SDK = "https://www.gstatic.com/firebasejs/10.13.2/firebase-";
  var BASE = "https://cdn.jsdelivr.net/gh/barbarasinfronio-lgtm/diario-informativos@main/";

  function carregar(src) {
    return new Promise(function (ok, erro) {
      var s = document.createElement("script");
      s.src = src;
      s.onload = ok;
      s.onerror = erro;
      document.head.appendChild(s);
    });
  }

  var pronto = null, uidAtual = null;

  function preparar() {
    if (pronto) return pronto;
    pronto = Promise.resolve()
      .then(function () {
        if (!window.DIARIO_FIREBASE_CONFIG) window.DIARIO_FIREBASE_CONFIG = CONFIG;
        if (window.firebase && firebase.firestore && firebase.auth) return;
        return (window.firebase ? Promise.resolve() : carregar(SDK + "app-compat.js"))
          .then(function () {
            return Promise.all([
              firebase.auth ? null : carregar(SDK + "auth-compat.js"),
              firebase.firestore ? null : carregar(SDK + "firestore-compat.js")
            ]);
          });
      })
      .then(function () {
        if (!window.GruposShared) return carregar(BASE + "grupos-shared.js");
      })
      .then(function () {
        if (!firebase.apps.length) firebase.initializeApp(window.DIARIO_FIREBASE_CONFIG);
        return new Promise(function (ok) {
          var pediuAnonimo = false;
          firebase.auth().onAuthStateChanged(function (user) {
            if (user) { uidAtual = user.uid; ok(user.uid); return; }
            // só cria login anônimo se ninguém estiver logado (não troca a conta Google)
            if (!pediuAnonimo) { pediuAnonimo = true; firebase.auth().signInAnonymously().catch(function () {}); }
          });
        });
      })
      .catch(function () { pronto = null; return null; });
    return pronto;
  }

  // Grava o campo (ex.: "lidasLeis") no documento desta pessoa em cada grupo.
  function enviarGrupos(campo, valor) {
    return preparar().then(function (uid) {
      var GS = window.GruposShared;
      if (!uid || !GS) return;
      GS.readGroups().forEach(function (g) {
        var dados = { name: g.name, avatar: GS.readAvatarPref(), joinedAt: g.joinedAt };
        dados[campo] = valor;
        GS.updateMember(g.code, uid, dados).catch(function () {});
      });
    });
  }

  window.EstudaManaNuvem = { preparar: preparar, enviarGrupos: enviarGrupos };
})();
