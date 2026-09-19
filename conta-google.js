/*
 * conta-google.js — login com Google para guardar o progresso em qualquer aparelho
 *
 * Como funciona:
 *  - Quem já usa o site tem uma conta anônima do Firebase. "Entrar com Google"
 *    VINCULA o Google a essa mesma conta (o código do usuário não muda), então
 *    nada do que já foi marcado se perde.
 *  - Se o Google escolhido já tem progresso salvo (de outro aparelho), o progresso
 *    deste aparelho é JUNTADO ao dele — nunca se perde uma leitura nem um prêmio:
 *    vale "lida" se estiver lida em qualquer um dos dois, com a data mais antiga.
 *  - "Sair deste aparelho" desconecta e limpa os dados locais daqui (o progresso
 *    continua salvo na conta), para que outra pessoa possa usar o aparelho.
 *
 * O botão aparece sozinho: dentro do painel "Acessar de qualquer aparelho" dos
 * Diários (#account-panel) ou numa barrinha no topo de Meus Prêmios / Editais.
 *
 * Requisitos no Firebase (uma vez): Authentication > Sign-in method > Google
 * ativado; e, em Authentication > Settings > Authorized domains, incluir
 * estudamana.com.br e www.estudamana.com.br.
 */
(function () {
  "use strict";
  if (window.ContaGoogle) return;

  // ---- o que é juntado / limpo -------------------------------------------
  var MAP_DOCS = [
    { path: "progress/", local: "informativos-lidos" },
    { path: "progress-leis/", local: "leis-lidas" },
    { path: "progress-sumulas/", local: "sumulas-lidas" }
  ];
  var LOCAL_CLEAR = [
    "informativos-lidos", "leis-lidas", "sumulas-lidas",
    "informativos-avatar", "leis-avatar", "sumulas-avatar",
    "informativos-grupo", "premios-vistos", "premios-conquistados",
    "editais-principal", "leis-filtro", "estudamana-menu-v1"
  ];

  function lsGet(key) { try { return localStorage.getItem(key); } catch (e) { return null; } }
  function lsSet(key, val) { try { localStorage.setItem(key, val); } catch (e) {} }
  function lsJson(key, fallback) {
    try { var raw = lsGet(key); return raw ? JSON.parse(raw) : fallback; } catch (e) { return fallback; }
  }

  // ---- junção de progresso (nunca perde nada) ---------------------------
  function mergeMaps(a, b) {
    var out = {}, k;
    a = a || {}; b = b || {};
    var keys = {};
    for (k in a) keys[k] = 1;
    for (k in b) keys[k] = 1;
    Object.keys(keys).forEach(function (key) {
      var x = a[key] || {}, y = b[key] || {};
      var lida = !!(x.lida || y.lida);
      var dates = [];
      if (x.lida && x.lidaEm) dates.push(x.lidaEm);
      if (y.lida && y.lidaEm) dates.push(y.lidaEm);
      dates.sort();
      out[key] = { lida: lida, lidaEm: lida ? (dates[0] || null) : null };
    });
    return out;
  }

  function mergeDates(a, b) { // { id: "YYYY-MM-DD" } — vale a data mais antiga
    var out = {}, k;
    a = a || {}; b = b || {};
    for (k in a) out[k] = a[k];
    for (k in b) if (!out[k] || (b[k] && b[k] < out[k])) out[k] = b[k];
    return out;
  }

  function mergeGroups(a, b) { // [{code,name,joinedAt}] — união por código
    var seen = {}, out = [];
    (a || []).concat(b || []).forEach(function (g) {
      if (g && g.code && !seen[g.code]) { seen[g.code] = 1; out.push(g); }
    });
    return out;
  }

  function unionList(a, b) {
    var seen = {}, out = [];
    (a || []).concat(b || []).forEach(function (x) { if (!seen[x]) { seen[x] = 1; out.push(x); } });
    return out;
  }

  // lê todos os documentos da conta (progresso + prêmios) — tudo o que vamos juntar
  function readAccount(db, uid) {
    var out = { maps: {}, avatars: {}, conquistados: {}, vistos: [], edital: "", grupos: [] };
    var jobs = MAP_DOCS.map(function (m) {
      return db.doc(m.path + uid).get().then(function (snap) {
        if (!snap.exists) return;
        var d = snap.data() || {};
        if (d.map) out.maps[m.path] = d.map;
        if (d.avatar) out.avatars[m.path] = d.avatar;
        if (m.path === "progress-leis/") {
          if (typeof d.edital === "string") out.edital = d.edital;
          if (Array.isArray(d.grupos)) out.grupos = d.grupos;
        }
      }).catch(function () {});
    });
    jobs.push(db.doc("progress-premios/" + uid).get().then(function (snap) {
      if (!snap.exists) return;
      var d = snap.data() || {};
      if (d.conquistados) out.conquistados = d.conquistados;
      if (Array.isArray(d.vistos)) out.vistos = d.vistos;
    }).catch(function () {}));
    return Promise.all(jobs).then(function () { return out; });
  }

  // o que este aparelho tem guardado localmente (pode ter coisa ainda não enviada)
  function readLocal() {
    var out = { maps: {}, conquistados: lsJson("premios-conquistados", {}), vistos: lsJson("premios-vistos", []),
                edital: lsGet("editais-principal") || "", grupos: lsJson("informativos-grupo", []) };
    MAP_DOCS.forEach(function (m) { out.maps[m.path] = lsJson(m.local, {}); });
    if (!Array.isArray(out.grupos)) out.grupos = out.grupos && out.grupos.code ? [out.grupos] : [];
    return out;
  }

  function combine(a, b) {
    var out = { maps: {}, avatars: {}, conquistados: mergeDates(a.conquistados, b.conquistados),
                vistos: unionList(a.vistos, b.vistos), edital: a.edital || b.edital || "",
                grupos: mergeGroups(a.grupos, b.grupos) };
    MAP_DOCS.forEach(function (m) { out.maps[m.path] = mergeMaps(a.maps[m.path], b.maps[m.path]); });
    return out;
  }

  // grava a junção na conta (só em documentos do próprio usuário) e no aparelho
  function writeAccount(db, uid, data) {
    var now = new Date().toISOString();
    var jobs = MAP_DOCS.map(function (m) {
      var payload = { map: data.maps[m.path] || {}, updatedAt: now };
      if (m.path === "progress-leis/") {
        if (data.edital) payload.edital = data.edital;
        if (data.grupos && data.grupos.length) payload.grupos = data.grupos;
      }
      return db.doc(m.path + uid).set(payload, { merge: true });
    });
    jobs.push(db.doc("progress-premios/" + uid).set(
      { conquistados: data.conquistados || {}, vistos: data.vistos || [], updatedAt: now }, { merge: true }));
    return Promise.all(jobs);
  }

  function writeLocal(data) {
    MAP_DOCS.forEach(function (m) { lsSet(m.local, JSON.stringify(data.maps[m.path] || {})); });
    lsSet("premios-conquistados", JSON.stringify(data.conquistados || {}));
    lsSet("premios-vistos", JSON.stringify(data.vistos || []));
    if (data.edital) lsSet("editais-principal", data.edital);
    if (data.grupos && data.grupos.length) lsSet("informativos-grupo", JSON.stringify(data.grupos));
  }

  // ---- interface ----------------------------------------------------------
  var STYLE = [
    ".cg-box{margin:0 0 .9rem;padding:.8rem .95rem;border:1px solid var(--surface-line,#e2dcca);border-radius:12px;background:var(--surface,#fff);color:var(--ink,#1c2130);font-family:var(--font-sans,system-ui,sans-serif);font-size:.9rem;line-height:1.4}",
    ".cg-box p{margin:0 0 .55rem}",
    ".cg-title{font-weight:700}",
    ".cg-row{display:flex;flex-wrap:wrap;gap:.5rem;align-items:center}",
    ".cg-btn{font:inherit;font-size:.85rem;padding:.5rem .95rem;border-radius:999px;border:1px solid var(--surface-line,#e2dcca);background:var(--surface,#fff);color:var(--ink,#1c2130);cursor:pointer;display:inline-flex;gap:.45rem;align-items:center}",
    ".cg-btn:hover{background:var(--surface-2,#efeadd)}",
    ".cg-btn-google{font-weight:600;border-color:var(--accent,#1f3a5f)}",
    ".cg-btn:disabled{opacity:.6;cursor:wait}",
    ".cg-msg{margin:.5rem 0 0;font-size:.8rem;color:var(--ink-soft,#4a5064)}",
    ".cg-msg.is-error{color:var(--high-fg,#8a1f1f)}",
    ".cg-ok{color:var(--done,#2c6b3f);font-weight:600}",
    ".cg-bar{max-width:var(--page-width-reading,760px);margin:0 auto 1rem}"
  ].join("");

  var boxEl = null, msgEl = null, busy = false;

  function injectStyle() {
    if (document.getElementById("cg-style")) return;
    var st = document.createElement("style");
    st.id = "cg-style";
    st.textContent = STYLE;
    document.head.appendChild(st);
  }

  function findHost() {
    var panel = document.getElementById("account-panel");
    if (panel) return { el: panel, mode: "panel" };
    var main = document.getElementById("premios-main") || document.getElementById("editais-main");
    if (main && main.parentNode) return { el: main, mode: "bar" };
    return null;
  }

  function hasGoogle(user) {
    return !!(user && user.providerData && user.providerData.some(function (p) { return p.providerId === "google.com"; }));
  }

  function setMsg(text, isError) {
    if (!msgEl) return;
    msgEl.textContent = text || "";
    msgEl.className = "cg-msg" + (isError ? " is-error" : "");
    msgEl.hidden = !text;
  }

  function friendlyError(err) {
    var c = err && err.code;
    if (c === "auth/popup-closed-by-user" || c === "auth/cancelled-popup-request") return "";
    if (c === "auth/popup-blocked") return "O navegador bloqueou a janela do Google. Permita pop-ups para este site e tente de novo.";
    if (c === "auth/unauthorized-domain") return "Este endereço ainda não foi autorizado no Firebase (Authentication > Settings > Authorized domains).";
    if (c === "auth/operation-not-allowed") return "O login com Google ainda não foi ativado no Firebase (Authentication > Sign-in method).";
    if (c === "auth/network-request-failed") return "Sem conexão agora. Tente de novo em instantes.";
    return "Não foi possível entrar com o Google agora. Tente de novo em instantes.";
  }

  function render(user) {
    var host = findHost();
    if (!host) return;
    injectStyle();
    if (!boxEl) {
      boxEl = document.createElement("div");
      boxEl.id = "cg-box";
      boxEl.className = "cg-box" + (host.mode === "bar" ? " cg-bar" : "");
      if (host.mode === "panel") host.el.insertBefore(boxEl, host.el.firstChild);
      else host.el.parentNode.insertBefore(boxEl, host.el);
    }
    var linked = hasGoogle(user);
    if (linked) {
      boxEl.innerHTML =
        '<p class="cg-title">Conta Google conectada <span class="cg-ok">✓</span></p>' +
        "<p>" + esc(user.email || "") + " — seu progresso e seus prêmios ficam salvos e acompanham você em qualquer aparelho.</p>" +
        '<div class="cg-row"><button type="button" class="cg-btn" id="cg-out">Sair deste aparelho</button></div>' +
        '<p class="cg-msg" id="cg-msg" hidden></p>';
    } else {
      boxEl.innerHTML =
        '<p class="cg-title">Guarde tudo com a sua conta Google</p>' +
        "<p>Suas leituras, prêmios e edital escolhido ficam salvos na sua conta e voltam em qualquer celular ou computador. O que você já marcou aqui é mantido.</p>" +
        '<div class="cg-row"><button type="button" class="cg-btn cg-btn-google" id="cg-google">' +
        '<span aria-hidden="true">G</span> Entrar com Google</button></div>' +
        '<p class="cg-msg" id="cg-msg" hidden></p>';
    }
    msgEl = boxEl.querySelector("#cg-msg");
  }

  function esc(t) {
    return String(t).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; });
  }

  // ---- fluxo de login -----------------------------------------------------
  function afterLink() {
    // mesmo usuário: só garante que a lista de grupos/edital deste aparelho vá para a conta
    var auth = firebase.auth(), db = firebase.firestore(), uid = auth.currentUser.uid;
    var loc = readLocal();
    return db.doc("progress-leis/" + uid).set(
      { grupos: loc.grupos, edital: loc.edital || "", updatedAt: new Date().toISOString() }, { merge: true })
      .catch(function () {});
  }

  function switchToExisting(credential, oldUser) {
    var auth = firebase.auth(), db = firebase.firestore();
    var oldUid = oldUser.uid;
    var localSnap = readLocal();
    setMsg("Essa conta Google já tem progresso salvo. Juntando com o deste aparelho…");
    return readAccount(db, oldUid).then(function (oldAcc) {
      var carry = combine(oldAcc, localSnap); // tudo deste aparelho (conta anônima + local)
      // sai dos grupos com o código antigo; o novo código entra sozinho na próxima abertura
      var leaves = (carry.grupos || []).map(function (g) {
        return db.doc("groups/" + g.code + "/members/" + oldUid).delete().catch(function () {});
      });
      return Promise.all(leaves).then(function () {
        return auth.signInWithCredential(credential);
      }).then(function (res) {
        var newUid = res.user.uid;
        return readAccount(db, newUid).then(function (newAcc) {
          var merged = combine(newAcc, carry);
          return writeAccount(db, newUid, merged).then(function () { writeLocal(merged); });
        });
      });
    });
  }

  function signIn() {
    if (busy) return;
    busy = true;
    var btn = document.getElementById("cg-google");
    if (btn) btn.disabled = true;
    setMsg("");
    var auth = firebase.auth();
    var provider = new firebase.auth.GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });
    var cur = auth.currentUser;
    var work;
    if (cur && !hasGoogle(cur)) {
      work = cur.linkWithPopup(provider).then(function () { return afterLink().then(function () { return "linked"; }); })
        .catch(function (err) {
          var c = err && err.code;
          if ((c === "auth/credential-already-in-use" || c === "auth/email-already-in-use") && err.credential) {
            return switchToExisting(err.credential, cur).then(function () { return "switched"; });
          }
          throw err;
        });
    } else {
      work = auth.signInWithPopup(provider).then(function (res) {
        var acc = readLocal();
        var db = firebase.firestore();
        return readAccount(db, res.user.uid).then(function (remote) {
          var merged = combine(remote, acc);
          return writeAccount(db, res.user.uid, merged).then(function () { writeLocal(merged); return "switched"; });
        });
      });
    }
    work.then(function (how) {
      busy = false;
      if (how === "switched") { setMsg("Pronto! Progresso juntado. Recarregando…"); setTimeout(function () { location.reload(); }, 700); }
      else { render(firebase.auth().currentUser); setMsg("Conta Google conectada. Tudo o que você já tinha foi mantido."); }
    }).catch(function (err) {
      busy = false;
      var b2 = document.getElementById("cg-google");
      if (b2) b2.disabled = false;
      var m = friendlyError(err);
      setMsg(m, !!m);
      if (window.console && err) console.warn("[conta-google]", err.code || err);
    });
  }

  function signOut() {
    if (busy) return;
    busy = true;
    firebase.auth().signOut().then(function () {
      LOCAL_CLEAR.forEach(function (k) { try { localStorage.removeItem(k); } catch (e) {} });
      location.reload();
    }).catch(function () { busy = false; setMsg("Não foi possível sair agora.", true); });
  }

  document.addEventListener("click", function (e) {
    var t = e.target.closest("#cg-google, #cg-out");
    if (!t) return;
    if (t.id === "cg-google") signIn(); else signOut();
  });

  // ---- sincroniza a lista de grupos/edital de quem já está logado -----------
  function syncExtras(user) {
    if (!user || user.isAnonymous) return;
    try {
      var db = firebase.firestore();
      var ref = db.doc("progress-leis/" + user.uid);
      ref.get().then(function (snap) {
        var d = snap.exists ? (snap.data() || {}) : {};
        var loc = readLocal();
        var groups = mergeGroups(d.grupos, loc.grupos);
        if (groups.length) lsSet("informativos-grupo", JSON.stringify(groups));
        if (groups.length !== (d.grupos || []).length) ref.set({ grupos: groups }, { merge: true }).catch(function () {});
      }).catch(function () {});
    } catch (e) {}
  }

  // ---- início ---------------------------------------------------------------
  function start() {
    if (!(window.firebase && window.DIARIO_FIREBASE_CONFIG)) return;
    try {
      if (!firebase.apps.length) firebase.initializeApp(window.DIARIO_FIREBASE_CONFIG);
      firebase.auth().onAuthStateChanged(function (user) {
        if (!user) return;
        render(user);
        syncExtras(user);
      });
    } catch (e) {}
  }

  window.ContaGoogle = { merge: { maps: mergeMaps, dates: mergeDates, groups: mergeGroups }, combine: combine };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
