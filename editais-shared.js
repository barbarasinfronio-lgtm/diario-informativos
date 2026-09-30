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
 *   S.bindCloud()                                // liga a sincronização com a conta (se a pessoa entrou)
 */
(function () {
  "use strict";
  if (window.EditaisShared && window.EditaisShared.__ready) return;

  var LOCAL_KEY = "editais-principal";
  var LOCAL_SEC_KEY = "editais-secundarios";   // JSON: até 2 ids, na ordem (2º e 3º edital)
  var MAX_SEC = 2;
  var listeners = [];
  var current = null;      // id do edital principal ("" = nenhum)
  var secondary = null;    // ids dos editais secundários (até 2), na ordem
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
    // Carregado por fetch (sem <script src>, como fazem as páginas do
    // Blogger): não há de onde tirar a pasta, então usa o jsDelivr.
    if (!s || !s.src) return "https://cdn.jsdelivr.net/gh/barbarasinfronio-lgtm/diario-informativos@main/";
    return s.src.replace(/editais-shared\.js(\?.*)?$/, "");
  })();
  var QUERY = (function () {
    var s = document.currentScript;
    var m = s && s.src ? s.src.match(/\?.*$/) : null;
    return m ? m[0] : "";
  })();

  // (guarda o resultado: a mesma lei aparece em dezenas de editais e o
  // progresso refaz essa conta a cada desenho da página)
  var slugCache = {};
  function slug(text) {
    var k = text || "";
    var c = slugCache[k];
    if (c !== undefined) return c;
    return (slugCache[k] = k.toLowerCase()
      .normalize("NFD").replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""));
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

  function readLocalSec() {
    try {
      var v = JSON.parse(localStorage.getItem(LOCAL_SEC_KEY) || "[]");
      return Array.isArray(v) ? v.filter(function (x) { return typeof x === "string" && x; }) : [];
    } catch (e) { return []; }
  }
  function writeLocalSec(ids) {
    try {
      if (ids.length) localStorage.setItem(LOCAL_SEC_KEY, JSON.stringify(ids)); else localStorage.removeItem(LOCAL_SEC_KEY);
    } catch (e) { /* sem armazenamento: só na memória */ }
  }
  // Deixa a lista válida: só ids que existem, sem repetir, sem o principal, no máximo 2.
  function cleanSec(ids) {
    var out = [];
    (ids || []).forEach(function (id) {
      if (id && id !== current && out.indexOf(id) === -1 && findById(id) && !(findById(id).emBreve)) out.push(id);
    });
    return out.slice(0, MAX_SEC);
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
      // o novo principal não pode ficar também na lista de secundários
      var antes = (secondary || []).join(",");
      secondary = cleanSec(secondary);
      if (secondary.join(",") !== antes) writeLocalSec(secondary);
      notify();
      if (!fromRemote) pushCloud();
    },

    // ---- combinação: principal + até 2 secundários (1º, 2º e 3º edital) ----
    secundariosIds: function () { return (secondary || []).slice(); },
    secundarios: function () { return (secondary || []).map(findById).filter(Boolean); },
    // [principal, 2º, 3º] (só os que existem)
    combinacao: function () {
      var out = [];
      if (current && findById(current)) out.push(findById(current));
      (secondary || []).forEach(function (id) { var e = findById(id); if (e) out.push(e); });
      return out;
    },
    maxSecundarios: MAX_SEC,
    emCombinacao: function (id) {
      if (id === current) return 1;
      var i = (secondary || []).indexOf(id);
      return i === -1 ? 0 : i + 2;
    },
    // troca a lista de secundários (a ordem importa)
    setSecundarios: function (ids, fromRemote) {
      var novo = cleanSec(ids);
      if (novo.join(",") === (secondary || []).join(",")) return;
      secondary = novo;
      writeLocalSec(novo);
      notify();
      if (!fromRemote) pushCloud();
    },
    adicionarSecundario: function (id) {
      if (!current || !id || id === current || (secondary || []).indexOf(id) !== -1) return false;
      if ((secondary || []).length >= MAX_SEC) return false;
      api.setSecundarios((secondary || []).concat([id]));
      return true;
    },
    removerDaCombinacao: function (id) {
      if (id === current) {
        // sai o principal: o 2º sobe a principal e o 3º vira 2º
        var resto = (secondary || []).slice();
        current = resto.shift() || "";
        writeLocal(current);
        secondary = cleanSec(resto);
        writeLocalSec(secondary);
        notify();
        pushCloud();
        return;
      }
      api.setSecundarios((secondary || []).filter(function (x) { return x !== id; }));
    },
    // sobe um edital uma posição na combinação (o 2º vira principal, etc.)
    subirNaCombinacao: function (id) {
      var ordem = [current].concat(secondary || []).filter(Boolean);
      var i = ordem.indexOf(id);
      if (i < 1) return;
      var t = ordem[i - 1]; ordem[i - 1] = ordem[i]; ordem[i] = t;
      var antigo = current;
      secondary = ordem.slice(1);
      writeLocalSec(secondary);
      if (ordem[0] !== antigo) {
        current = ordem[0];
        writeLocal(current);
      }
      notify();
      pushCloud();
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

    // liga a sincronização com a conta de quem entrou (Google ou e-mail e
    // senha); sem entrar, a escolha de edital fica só neste navegador.
    bindCloud: function () {
      if (cloudBound) return;
      if (!window.firebase || !window.DIARIO_FIREBASE_CONFIG) return;
      cloudBound = true;
      try {
        if (!firebase.apps.length) firebase.initializeApp(window.DIARIO_FIREBASE_CONFIG);
        var auth = firebase.auth();
        // só quem entrou com Google ou e-mail e senha sincroniza com a conta
        auth.onAuthStateChanged(function (user) {
          if (!user || user.isAnonymous) return;
          if (uid === user.uid) return;
          uid = user.uid;
          attach();
        });
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
          if (Array.isArray(d.editaisSec)) api.setSecundarios(d.editaisSec, true);
          else if ((secondary || []).length) pushCloud(); // conta sem secundários ainda: sobe os deste aparelho
          listenersRemote.forEach(function (fn) { try { fn(d); } catch (e) {} });
        } else {
          // conta sem escolha ainda: se este aparelho já escolheu, sobe
          if (current) pushCloud();
          if (d) listenersRemote.forEach(function (fn) { try { fn(d); } catch (e) {} });
        }
      }, function () { /* sem permissão/offline: segue local */ });
    } catch (e) {}
  }

  var listenersRemote = [];
  api.onRemoteDoc = function (fn) { listenersRemote.push(fn); };

  function pushCloud() {
    if (!docRef) return;
    docRef.set({ edital: current || "", editaisSec: (secondary || []).slice(), editalEm: new Date().toISOString() }, { merge: true })
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
      if (secondary === null) secondary = cleanSec(readLocalSec());
      cb(api);
    }
    if (window.EDITAIS_DATA) { done(); return; }
    if (!BASE) { done(); return; }
    // fetch "no-cache" (o navegador confere se o arquivo mudou) em vez de
    // <script src>, que fica guardado até 7 dias; se falhar, usa <script>.
    var url = BASE + "editais-data.js" + QUERY;
    fetch(url, { cache: "no-cache" })
      .then(function (r) { if (!r.ok) throw new Error(r.status); return r.text(); })
      .then(function (code) { (0, eval)(code); done(); })
      .catch(function () {
        var s = document.createElement("script");
        s.src = url;
        s.onload = done;
        s.onerror = done;
        document.head.appendChild(s);
      });
  };

  window.EditaisShared = api;
})();
