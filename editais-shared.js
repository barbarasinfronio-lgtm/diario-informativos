/*
 * editais-shared.js — edital principal da pessoa (compartilhado entre as páginas)
 *
 * Guarda QUAL edital a pessoa escolheu como principal e avisa quem estiver
 * ouvindo (a página "Editais" e o Diário de Leis). Onde fica salvo:
 *   - neste navegador: localStorage "editais-principal";
 *   - na conta (Firebase): campo "edital" do documento "progress-leis/<uid>",
 *     o MESMO documento do Diário de Leis — por isso não exige regra nova
 *     no Firestore e vale em todos os aparelhos.
 *
 * Uso:
 *   EditaisShared.load(function (S) { ... });   // carrega editais-data.js se preciso
 *   S.principalId(), S.principal(), S.setPrincipal(id), S.onChange(fn)
 *   S.lawKeys(edital) -> { "materia:slug(numero)": true }
 *   S.bindCloud({ signIn: true|false })          // liga a sincronização com a conta
 */
(function () {
  "use strict";
  if (window.EditaisShared && window.EditaisShared.__ready) return;

  var LOCAL_KEY = "editais-principal";
  var listeners = [];
  var current = null;      // id do edital principal ("" = nenhum)
  var cloudBound = false;
  var uid = null;
  var docRef = null;
  var unsub = null;

  // pasta deste script (para achar editais-data.js e o CSS)
  var BASE = (function () {
    var s = document.currentScript;
    if (!s) {
      var all = document.getElementsByTagName("script");
      for (var i = 0; i < all.length; i++) {
        if (/editais-shared\.js/.test(all[i].src)) { s = all[i]; break; }
      }
    }
    if (!s || !s.src) return "";
    return s.src.replace(/editais-shared\.js(\?.*)?$/, "");
  })();
  var QUERY = (function () {
    var s = document.currentScript;
    var m = s && s.src ? s.src.match(/\?.*$/) : null;
    return m ? m[0] : "";
  })();

  function slug(text) {
    return (text || "").toLowerCase()
      .normalize("NFD").replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  }

  // Normas estaduais/municipais trazem a sigla da unidade entre parênteses
  // no próprio "numero" (ex.: "Lei Estadual (AC) nº 1.022/1992") — dá para
  // detectar "é legislação local" sem precisar de um campo novo nos dados.
  var LOCAL_TAG_RE = /\([A-Z]{2}\)/;
  function isLocalNorma(numero) {
    return LOCAL_TAG_RE.test(numero || "");
  }

  // Um edital "tem" legislação local quando pelo menos uma de suas leis é
  // estadual/municipal — só então vale mostrar o botão de incluir/excluir.
  function hasLocalNormas(edital) {
    return ((edital && edital.leis) || []).some(function (p) { return isLocalNorma(p[1]); });
  }

  function readLocal() {
    try { return localStorage.getItem(LOCAL_KEY) || ""; } catch (e) { return ""; }
  }
  function writeLocal(id) {
    try {
      if (id) localStorage.setItem(LOCAL_KEY, id); else localStorage.removeItem(LOCAL_KEY);
    } catch (e) { /* sem armazenamento: só na memória */ }
  }

  function data() { return window.EDITAIS_DATA || []; }

  function findById(id) {
    var list = data();
    for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i];
    return null;
  }

  function notify() {
    listeners.slice().forEach(function (fn) { try { fn(current); } catch (e) {} });
  }

  var api = {
    __ready: true,
    data: data,
    byId: findById,
    slug: slug,
    principalId: function () { return current || ""; },
    principal: function () { return current ? findById(current) : null; },
    onChange: function (fn) { listeners.push(fn); },

    setPrincipal: function (id, fromRemote) {
      id = id && findById(id) ? id : "";
      if (id === (current || "")) return;
      current = id;
      writeLocal(id);
      notify();
      if (!fromRemote) pushCloud(id);
    },

    // conjunto de chaves "materia:slug(numero)" das leis do edital.
    // opts.includeLocal (padrão false) — quando falso, deixa de fora as
    // normas estaduais/municipais específicas daquele edital (a pessoa liga
    // isso explicitamente na tela, via botão "incluir legislação local").
    lawKeys: function (edital, opts) {
      opts = opts || {};
      var out = {};
      ((edital && edital.leis) || []).forEach(function (p) {
        if (!opts.includeLocal && isLocalNorma(p[1])) return;
        out[p[0] + ":" + slug(p[1])] = true;
      });
      return out;
    },
    isLocalNorma: isLocalNorma,
    hasLocalNormas: hasLocalNormas,

    // liga a sincronização com a conta. Na página "Editais" (signIn:true)
    // cria o login anônimo se ainda não houver; no Diário de Leis quem
    // faz o login é o próprio diário.
    bindCloud: function (opts) {
      opts = opts || {};
      if (cloudBound) return;
      if (!window.firebase || !window.DIARIO_FIREBASE_CONFIG) return;
      cloudBound = true;
      try {
        if (!firebase.apps.length) firebase.initializeApp(window.DIARIO_FIREBASE_CONFIG);
        var auth = firebase.auth();
        auth.onAuthStateChanged(function (user) {
          if (!user) return;
          if (uid === user.uid) return;
          uid = user.uid;
          attach();
        });
        if (opts.signIn) {
          // só cria login anônimo se, após o Firebase restaurar a sessão, não houver ninguém
          var off = auth.onAuthStateChanged(function (user) {
            off();
            if (!user) auth.signInAnonymously().catch(function () {});
          });
        }
      } catch (e) { cloudBound = false; }
    },

    // ainda não vinculado à conta? (para a interface avisar)
    cloudReady: function () { return !!docRef; }
  };

  function attach() {
    try {
      docRef = firebase.firestore().doc("progress-leis/" + uid);
      if (unsub) { unsub(); unsub = null; }
      unsub = docRef.onSnapshot(function (snap) {
        var d = snap && snap.exists ? snap.data() : null;
        if (d && typeof d.edital === "string") {
          // a conta manda: o que foi escolhido em outro aparelho vale aqui
          if (d.edital !== (current || "")) api.setPrincipal(d.edital, true);
          listenersRemote.forEach(function (fn) { try { fn(d); } catch (e) {} });
        } else {
          // conta sem escolha ainda: se este aparelho já escolheu, sobe
          if (current) pushCloud(current);
          if (d) listenersRemote.forEach(function (fn) { try { fn(d); } catch (e) {} });
        }
      }, function () { /* sem permissão/offline: segue local */ });
    } catch (e) {}
  }

  var listenersRemote = [];
  api.onRemoteDoc = function (fn) { listenersRemote.push(fn); };

  function pushCloud(id) {
    if (!docRef) return;
    docRef.set({ edital: id || "", editalEm: new Date().toISOString() }, { merge: true })
      .catch(function (err) {
        // melhor esforço — segue salvo neste navegador; loga para ajudar a
        // diferenciar "offline" de um problema real nas regras do Firestore
        if (window.console && err) console.warn("[editais-shared] pushCloud", err.code || err);
      });
  }

  // ---- carregamento dos dados e do CSS ---------------------------------
  function loadCss() {
    if (!BASE) return;
    var href = BASE + "editais-styles.css" + QUERY;
    if (document.querySelector('link[href="' + href + '"]')) return;
    var l = document.createElement("link");
    l.rel = "stylesheet"; l.href = href;
    document.head.appendChild(l);
  }

  api.load = function (cb) {
    loadCss();
    function done() {
      if (current === null) current = readLocal();
      if (current && !findById(current)) current = "";
      cb(api);
    }
    if (window.EDITAIS_DATA) { done(); return; }
    if (!BASE) { done(); return; }
    var s = document.createElement("script");
    s.src = BASE + "editais-data.js" + QUERY;
    s.onload = done;
    s.onerror = done;
    document.head.appendChild(s);
  };

  window.EditaisShared = api;
})();
