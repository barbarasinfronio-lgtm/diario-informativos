/*
 * conta-google.js — entrar (Google ou e-mail e senha) para guardar o progresso
 *
 * Como funciona:
 *  - Não existe mais login anônimo: só quem entra com Google ou com e-mail e
 *    senha tem o progresso salvo na nuvem e participa dos grupos. Sem entrar,
 *    o que a pessoa marca fica só no navegador.
 *  - Ao entrar, tudo o que está neste navegador é JUNTADO à conta — nunca se
 *    perde uma leitura nem um prêmio: vale "lida" se estiver lida em qualquer
 *    lugar, com a data mais antiga.
 *  - Quem ainda tem a conta anônima antiga neste aparelho: "Entrar com Google"
 *    ou "Criar conta" transformam essa conta anônima na conta de verdade (o
 *    código do usuário não muda). Se o Google/e-mail já tinha conta, o que
 *    estava na anônima é juntado nela, e a anônima sai dos grupos.
 *  - "Sair deste aparelho" desconecta e limpa os dados locais daqui (o
 *    progresso continua salvo na conta).
 *
 * O quadro aparece sozinho: dentro do painel #account-panel (Diários, Meus
 * Grupos) ou numa barrinha no topo de Meus Prêmios / Editais.
 *
 * Requisitos no Firebase: Authentication > Sign-in method > Google e
 * E-mail/senha ativados; em Authentication > Settings > Authorized domains,
 * estudamana.com.br e www.estudamana.com.br.
 */
(function () {
  "use strict";
  // Uma cópia antiga deste arquivo (guardada pelo navegador ou carregada
  // pelo HTML do Blogger) não tem "iniciar": nesse caso esta versão assume.
  // Os ids daqui (cg2-*) são outros para os cliques da cópia antiga não
  // dispararem junto, e o quadro antigo (#cg-box) é escondido.
  if (window.ContaGoogle && window.ContaGoogle.iniciar) return;

  // ---- o que é juntado / limpo -------------------------------------------
  var MAP_DOCS = [
    { path: "progress/", local: "informativos-lidos" },
    { path: "progress-leis/", local: "leis-lidas" },
    { path: "progress-sumulas/", local: "sumulas-lidas" },
    { path: "progress-normas/", local: "normas-lidas" },
    { path: "progress-decisoes/", local: "decisoes-lidas" },
    // estas duas guardam { id: "data ISO" } no navegador (iso: true)
    { path: "progress-adi/", local: "em_lidos_constitucionalidades", iso: true },
    { path: "progress-rcl/", local: "em_lidos_reclamacoes", iso: true }
  ];
  var LOCAL_CLEAR = [
    "informativos-lidos", "leis-lidas", "sumulas-lidas", "normas-lidas", "decisoes-lidas",
    "em_lidos_constitucionalidades", "em_lidos_reclamacoes",
    "informativos-avatar", "leis-avatar", "sumulas-avatar", "normas-avatar",
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

  // compara duas listas de grupos pelo conjunto de códigos (ignora ordem) —
  // usado para saber se a lista mudou de fato, e não só de tamanho (por
  // exemplo, trocar um grupo por outro mantém o total igual).
  function sameGroupCodes(a, b) {
    var ac = (a || []).map(function (g) { return g.code; }).sort();
    var bc = (b || []).map(function (g) { return g.code; }).sort();
    if (ac.length !== bc.length) return false;
    for (var i = 0; i < ac.length; i++) if (ac[i] !== bc[i]) return false;
    return true;
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

  // { id: "data ISO" } (navegador) <-> { id: { lida, lidaEm } } (conta)
  function isoParaMap(o) {
    var out = {};
    Object.keys(o || {}).forEach(function (id) { if (o[id]) out[id] = { lida: true, lidaEm: typeof o[id] === "string" ? o[id] : null }; });
    return out;
  }
  function mapParaIso(map) {
    var out = {};
    Object.keys(map || {}).forEach(function (id) {
      var v = map[id];
      if (v && v.lida !== false) out[id] = (v && v.lidaEm) || new Date().toISOString();
    });
    return out;
  }

  // o que este aparelho tem guardado localmente (pode ter coisa ainda não enviada)
  function readLocal() {
    var out = { maps: {}, conquistados: lsJson("premios-conquistados", {}), vistos: lsJson("premios-vistos", []),
                edital: lsGet("editais-principal") || "", grupos: lsJson("informativos-grupo", []) };
    MAP_DOCS.forEach(function (m) { out.maps[m.path] = m.iso ? isoParaMap(lsJson(m.local, {})) : lsJson(m.local, {}); });
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
    MAP_DOCS.forEach(function (m) {
      var map = data.maps[m.path] || {};
      lsSet(m.local, JSON.stringify(m.iso ? mapParaIso(map) : map));
    });
    lsSet("premios-conquistados", JSON.stringify(data.conquistados || {}));
    lsSet("premios-vistos", JSON.stringify(data.vistos || []));
    if (data.edital) lsSet("editais-principal", data.edital);
    if (data.grupos && data.grupos.length) lsSet("informativos-grupo", JSON.stringify(data.grupos));
  }

  // ---- interface ----------------------------------------------------------
  var STYLE = [
    ".cg-box{margin:0 0 .9rem;padding:.8rem .95rem;border:1px solid var(--surface-line,#e2dcca);border-radius:12px;background:var(--surface,#fff);color:var(--ink,#1c2130);font-family:var(--font-sans,system-ui,sans-serif);font-size:.9rem;line-height:1.4;text-align:left}",
    ".cg-box p{margin:0 0 .55rem}",
    ".cg-title{font-weight:700}",
    ".cg-row{display:flex;flex-wrap:wrap;gap:.5rem;align-items:center}",
    ".cg-btn{font:inherit;font-size:.85rem;padding:.5rem .95rem;border-radius:999px;border:1px solid var(--surface-line,#e2dcca);background:var(--surface,#fff);color:var(--ink,#1c2130);cursor:pointer;display:inline-flex;gap:.45rem;align-items:center}",
    ".cg-btn:hover{background:var(--surface-2,#efeadd)}",
    ".cg-btn-google,.cg-btn-main{font-weight:600;border-color:var(--accent,#1f3a5f)}",
    ".cg-btn:disabled{opacity:.6;cursor:wait}",
    ".cg-or{margin:.7rem 0 .45rem;font-size:.8rem;color:var(--ink-soft,#4a5064)}",
    ".cg-fields{display:flex;flex-wrap:wrap;gap:.5rem;margin-bottom:.5rem}",
    ".cg-fields input{font:inherit;font-size:.85rem;padding:.45rem .7rem;border:1px solid var(--surface-line,#e2dcca);border-radius:8px;background:var(--surface,#fff);color:var(--ink,#1c2130);flex:1 1 11rem;min-width:0}",
    ".cg-link{font:inherit;font-size:.8rem;background:none;border:0;padding:0;color:var(--accent,#1f3a5f);text-decoration:underline;cursor:pointer}",
    ".cg-msg{margin:.5rem 0 0;font-size:.8rem;color:var(--ink-soft,#4a5064)}",
    ".cg-msg.is-error{color:var(--high-fg,#8a1f1f)}",
    ".cg-ok{color:var(--done,#2c6b3f);font-weight:600}",
    ".cg-bar{max-width:var(--page-width-reading,760px);margin:0 auto 1rem}",
    // o antigo bloco "vincular e-mail" do HTML dos Diários foi trocado por este quadro
    "#account-status-text,#account-link-block,#account-linked-block,#cg-box{display:none!important}"
  ].join("");

  var boxEl = null, msgEl = null, busy = false;

  function injectStyle() {
    if (document.getElementById("cg2-style")) return;
    var st = document.createElement("style");
    st.id = "cg2-style";
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

  // Só conta como "entrou" quem usa Google ou e-mail e senha. Contas anônimas
  // antigas (de antes desta mudança) valem como "não entrou": o progresso fica
  // só neste navegador até a pessoa entrar — e aí é juntado à conta dela.
  function logado(user) { return !!(user && !user.isAnonymous); }

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
    if (c === "auth/operation-not-allowed") return "Esse tipo de login ainda não foi ativado no Firebase (Authentication > Sign-in method).";
    if (c === "auth/network-request-failed") return "Sem conexão agora. Tente de novo em instantes.";
    if (c === "auth/email-already-in-use" || c === "auth/credential-already-in-use") return "Esse e-mail já tem conta. Use \"Entrar\".";
    if (c === "auth/weak-password") return "Senha muito curta — use pelo menos 6 caracteres.";
    if (c === "auth/invalid-email") return "E-mail inválido.";
    if (c === "auth/wrong-password" || c === "auth/invalid-credential" || c === "auth/invalid-login-credentials") return "E-mail ou senha incorretos.";
    if (c === "auth/user-not-found") return "Não existe conta com esse e-mail. Use \"Criar conta\".";
    if (c === "auth/too-many-requests") return "Muitas tentativas seguidas. Espere alguns minutos e tente de novo.";
    return "Não foi possível entrar agora. Tente de novo em instantes.";
  }

  function render(user) {
    var host = findHost();
    if (!host) return;
    injectStyle();
    if (!boxEl) {
      boxEl = document.createElement("div");
      boxEl.id = "cg2-box";
      boxEl.className = "cg-box" + (host.mode === "bar" ? " cg-bar" : "");
      if (host.mode === "panel") host.el.insertBefore(boxEl, host.el.firstChild);
      else host.el.parentNode.insertBefore(boxEl, host.el);
    }
    var toggle = document.getElementById("account-toggle");
    if (logado(user)) {
      var como = hasGoogle(user) ? "conta Google" : "e-mail e senha";
      boxEl.innerHTML =
        '<p class="cg-title">Você entrou com ' + como + ' <span class="cg-ok">✓</span></p>' +
        "<p>" + esc(user.email || "") + " — seu progresso, seus prêmios e seus grupos ficam salvos na conta e acompanham você em qualquer aparelho.</p>" +
        '<div class="cg-row"><button type="button" class="cg-btn" id="cg2-out">Sair deste aparelho</button></div>' +
        '<p class="cg-msg" id="cg2-msg" hidden></p>';
      if (toggle) toggle.innerHTML = '<span aria-hidden="true">👤</span> Minha conta';
    } else {
      boxEl.innerHTML =
        '<p class="cg-title">Entre para salvar seu progresso</p>' +
        "<p>Sem entrar, o que você marca fica só neste navegador e não conta nos grupos de estudo. Entre com o Google ou com e-mail e senha: o que já está marcado aqui vai junto para a sua conta.</p>" +
        '<div class="cg-row"><button type="button" class="cg-btn cg-btn-google" id="cg2-google">' +
        '<span aria-hidden="true">G</span> Entrar com Google</button></div>' +
        '<p class="cg-or">ou com e-mail e senha:</p>' +
        '<div class="cg-fields"><input type="email" id="cg2-email" placeholder="seu@email.com" autocomplete="email" aria-label="E-mail">' +
        '<input type="password" id="cg2-senha" placeholder="Senha (mín. 6 caracteres)" autocomplete="current-password" aria-label="Senha"></div>' +
        '<div class="cg-row"><button type="button" class="cg-btn cg-btn-main" id="cg2-entrar">Entrar</button>' +
        '<button type="button" class="cg-btn" id="cg2-criar">Criar conta</button>' +
        '<button type="button" class="cg-link" id="cg2-esqueci">Esqueci a senha</button></div>' +
        '<p class="cg-msg" id="cg2-msg" hidden></p>';
      if (toggle) toggle.innerHTML = '<span aria-hidden="true">💾</span> Entrar para salvar seu progresso';
    }
    msgEl = boxEl.querySelector("#cg2-msg");
  }

  function esc(t) {
    return String(t).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; });
  }

  // ---- fluxo de login -----------------------------------------------------
  function afterLink() {
    // mesmo usuário (a conta anônima antiga virou conta de verdade): junta o
    // que está neste aparelho com o que já estava salvo nela
    var db = firebase.firestore(), uid = firebase.auth().currentUser.uid;
    return readAccount(db, uid).then(function (acc) {
      var merged = combine(acc, readLocal());
      return writeAccount(db, uid, merged).then(function () { writeLocal(merged); });
    });
  }

  // Entra numa conta (Google/e-mail) e junta nela tudo deste aparelho: o que
  // está no navegador e, se havia uma conta anônima antiga aqui, o que estava
  // salvo nela. A conta anônima sai dos grupos (a conta nova entra no lugar,
  // com o mesmo nome) — assim a pessoa não aparece repetida no ranking.
  function entrarEJuntar(entrar) {
    var auth = firebase.auth(), db = firebase.firestore();
    var old = auth.currentUser && auth.currentUser.isAnonymous ? auth.currentUser : null;
    var carryP = old
      ? readAccount(db, old.uid).then(function (acc) { return combine(acc, readLocal()); })
      : Promise.resolve(readLocal());
    return carryP.then(function (carry) {
      // enquanto ainda é a conta anônima (só ela pode apagar o próprio documento)
      var saidas = old ? (carry.grupos || []).map(function (g) {
        return db.doc("groups/" + g.code + "/members/" + old.uid).delete().catch(function () {});
      }) : [];
      return Promise.all(saidas).then(entrar).then(function (res) {
        var newUid = res.user.uid;
        return readAccount(db, newUid).then(function (acc) {
          var merged = combine(acc, carry);
          return writeAccount(db, newUid, merged).then(function () { writeLocal(merged); });
        });
      });
    });
  }

  function comecar(btnId) {
    if (busy) return false;
    busy = true;
    var b = document.getElementById(btnId);
    if (b) b.disabled = true;
    setMsg("");
    return true;
  }

  function terminar(p, okMsg) {
    p.then(function () {
      setMsg(okMsg || "Pronto! Progresso salvo na sua conta. Recarregando…");
      setTimeout(function () { location.reload(); }, 700);
    }).catch(function (err) {
      busy = false;
      if (boxEl) Array.prototype.forEach.call(boxEl.querySelectorAll("button"), function (b) { b.disabled = false; });
      var m = friendlyError(err);
      setMsg(m, !!m);
      if (window.console && err) console.warn("[conta]", err.code || err);
    });
  }

  function signInGoogle() {
    if (!comecar("cg2-google")) return;
    var auth = firebase.auth();
    var provider = new firebase.auth.GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });
    var cur = auth.currentUser;
    var work;
    if (cur && cur.isAnonymous) {
      // conta anônima antiga deste aparelho: vira conta Google (mesmo código, nada se perde)
      work = cur.linkWithPopup(provider).then(afterLink).catch(function (err) {
        var c = err && err.code;
        if ((c === "auth/credential-already-in-use" || c === "auth/email-already-in-use") && err.credential) {
          setMsg("Essa conta Google já tem progresso salvo. Juntando com o deste aparelho…");
          return entrarEJuntar(function () { return auth.signInWithCredential(err.credential); });
        }
        throw err;
      });
    } else {
      work = entrarEJuntar(function () { return auth.signInWithPopup(provider); });
    }
    terminar(work);
  }

  function lerCampos() {
    var e = document.getElementById("cg2-email"), s = document.getElementById("cg2-senha");
    return { email: e ? e.value.trim() : "", senha: s ? s.value : "" };
  }

  function signInEmail(criar) {
    var f = lerCampos();
    if (!f.email || !f.senha) { setMsg("Informe e-mail e senha.", true); return; }
    if (!comecar(criar ? "cg2-criar" : "cg2-entrar")) return;
    var auth = firebase.auth();
    var cur = auth.currentUser;
    var work;
    if (criar && cur && cur.isAnonymous) {
      var cred = firebase.auth.EmailAuthProvider.credential(f.email, f.senha);
      work = cur.linkWithCredential(cred).then(afterLink);
    } else if (criar) {
      work = entrarEJuntar(function () { return auth.createUserWithEmailAndPassword(f.email, f.senha); });
    } else {
      work = entrarEJuntar(function () { return auth.signInWithEmailAndPassword(f.email, f.senha); });
    }
    terminar(work);
  }

  function esqueci() {
    var f = lerCampos();
    if (!f.email) { setMsg("Escreva seu e-mail no campo acima e clique de novo em \"Esqueci a senha\".", true); return; }
    firebase.auth().sendPasswordResetEmail(f.email).then(function () {
      setMsg("Se existir conta com esse e-mail, enviamos um link para criar uma senha nova. Confira a caixa de entrada e o spam.");
    }).catch(function (err) { setMsg(friendlyError(err), true); });
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
    var t = e.target.closest("#cg2-google, #cg2-out, #cg2-entrar, #cg2-criar, #cg2-esqueci");
    if (!t) return;
    if (t.id === "cg2-google") signInGoogle();
    else if (t.id === "cg2-out") signOut();
    else if (t.id === "cg2-entrar") signInEmail(false);
    else if (t.id === "cg2-criar") signInEmail(true);
    else esqueci();
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Enter" && e.target && (e.target.id === "cg2-email" || e.target.id === "cg2-senha")) signInEmail(false);
  });

  // ---- sincroniza a lista de grupos/edital de quem já está logado -----------
  function syncExtras(user) {
    if (!logado(user)) return;
    try {
      var db = firebase.firestore();
      var ref = db.doc("progress-leis/" + user.uid);
      ref.get().then(function (snap) {
        var d = snap.exists ? (snap.data() || {}) : {};
        var loc = readLocal();
        var groups = mergeGroups(d.grupos, loc.grupos);
        if (groups.length) lsSet("informativos-grupo", JSON.stringify(groups));
        if (!sameGroupCodes(groups, d.grupos)) ref.set({ grupos: groups }, { merge: true }).catch(function () {});
      }).catch(function () {});
    } catch (e) {}
  }

  // ---- início ---------------------------------------------------------------
  var iniciado = false;
  function start() {
    if (iniciado || !(window.firebase && window.DIARIO_FIREBASE_CONFIG)) return;
    iniciado = true;
    try {
      if (!firebase.apps.length) firebase.initializeApp(window.DIARIO_FIREBASE_CONFIG);
      firebase.auth().onAuthStateChanged(function (user) {
        render(user);
        syncExtras(user);
      });
    } catch (e) {}
  }

  window.ContaGoogle = { merge: { maps: mergeMaps, dates: mergeDates, groups: mergeGroups }, combine: combine, logado: logado,
    // páginas que só carregam o Firebase depois (nuvem-shared.js) chamam de novo
    iniciar: function () { if (iniciado) { try { render(firebase.auth().currentUser); } catch (e) {} } else start(); } };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
