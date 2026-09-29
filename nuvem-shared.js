/* =====================================================================
   nuvem-shared.js — liga a página à conta (Firebase) e aos grupos de estudo
   Para páginas cujo HTML no Blogger não traz os scripts do Firebase
   (Diário de Leis, Constitucionalidade, Reclamações): baixa o Firebase,
   a configuração e o grupos-shared.js e, se a pessoa entrou (Google ou
   e-mail e senha), manda a contagem de leituras para cada grupo.
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

  var base = null, pronto = null, uidAtual = null;

  // Firebase + configuração + grupos-shared.js, prontos para uso (sem login)
  function carregarFirebase() {
    if (base) return base;
    base = Promise.resolve()
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
        return true;
      })
      .catch(function () { base = null; return false; });
    return base;
  }

  // Resolve com o uid de quem entrou (Google ou e-mail e senha), ou null.
  // Não há login anônimo.
  function preparar() {
    if (pronto) return pronto;
    pronto = carregarFirebase().then(function (ok) {
      if (!ok) { pronto = null; return null; }
      return new Promise(function (resolve) {
        var off = firebase.auth().onAuthStateChanged(function (user) {
          off();
          if (user && !user.isAnonymous) { uidAtual = user.uid; resolve(user.uid); } else resolve(null);
        });
      });
    });
    return pronto;
  }

  // Quadro "Entre para salvar seu progresso" (conta-google.js) antes do
  // elemento indicado, para páginas que não trazem o painel no HTML.
  function mostrarLogin(antesDe) {
    return carregarFirebase().then(function (ok) {
      if (!ok) return;
      if (!document.getElementById("account-panel")) {
        var panel = document.createElement("div");
        panel.id = "account-panel";
        if (antesDe && antesDe.parentNode) antesDe.parentNode.insertBefore(panel, antesDe);
        else document.body.insertBefore(panel, document.body.firstChild);
      }
      if (window.ContaGoogle && window.ContaGoogle.iniciar) { window.ContaGoogle.iniciar(); return; }
      if (document.getElementById("conta-google-js")) return;
      var s = document.createElement("script");
      s.id = "conta-google-js";
      s.src = BASE + "conta-google.js";
      document.head.appendChild(s);
    });
  }

  // Leituras de uma página que guarda { id: "data ISO" } no navegador
  // (Constitucionalidade, Reclamações) passam a ficar também na conta, em
  // <caminho><uid> = { map: { id: { lida: true, lidaEm } } } — o mesmo
  // formato dos outros Diários. Junta nuvem + navegador (nunca perde leitura).
  //   opts: { caminho, ler() -> lidos, gravar(lidos), aoMudar() }
  // Devolve salvar(): chame depois de cada marcação.
  function sincronizarLidos(opts) {
    var ref = null;
    function paraNuvem(lidos) {
      var map = {};
      Object.keys(lidos || {}).forEach(function (id) {
        var v = lidos[id];
        if (v) map[id] = { lida: true, lidaEm: typeof v === "string" ? v : null };
      });
      return map;
    }
    function salvar() {
      if (!ref) return;
      ref.set({ map: paraNuvem(opts.ler()), updatedAt: new Date().toISOString() }).catch(function () {});
    }
    preparar().then(function (uid) {
      if (!uid) return;
      ref = firebase.firestore().doc(opts.caminho + uid);
      ref.onSnapshot(function (snap) {
        var remoto = snap.exists && snap.data() && snap.data().map ? snap.data().map : {};
        var lidos = opts.ler(), mudou = false, falta = false;
        Object.keys(remoto).forEach(function (id) {
          var v = remoto[id];
          if (v && v.lida !== false && !lidos[id]) { lidos[id] = (v && v.lidaEm) || new Date().toISOString(); mudou = true; }
        });
        Object.keys(lidos).forEach(function (id) { if (lidos[id] && !remoto[id]) falta = true; });
        if (mudou) { opts.gravar(lidos); if (opts.aoMudar) opts.aoMudar(); }
        if (falta) salvar(); // o que só estava neste navegador sobe para a conta
      }, function () { ref = null; });
    });
    return salvar;
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

  window.EstudaManaNuvem = { preparar: preparar, enviarGrupos: enviarGrupos, mostrarLogin: mostrarLogin, sincronizarLidos: sincronizarLidos };
})();
