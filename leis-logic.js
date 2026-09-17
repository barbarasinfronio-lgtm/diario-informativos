
(function () {
  "use strict";

  // (dados carregados de leis-data.js, que roda antes deste arquivo)
  var LOCAL_KEY = "leis-lidas";
  var listRoot = document.getElementById("list-root");
  var syncNote = document.getElementById("sync-note");
  var tabsRoot = document.getElementById("org-tabs");
  var ledeText = document.getElementById("lede-text");
  var footerSource = document.getElementById("footer-source");

  // Boneco personalizável — mesmo esquema do Diário dos Informativos,
  // guardado sob uma chave própria para não interferir na outra página.
  var AVATAR_KEY = "leis-avatar";
  var AVATAR_DEFAULT = { gender: "f", tone: "3" };
  var GENDER_BASE = { f: "\u{1F469}", m: "\u{1F468}", x: "\u{1F9D1}" };
  var TONE_MOD = {
    "1": "\u{1F3FB}",
    "2": "\u{1F3FC}",
    "3": "\u{1F3FD}",
    "4": "\u{1F3FE}",
    "5": "\u{1F3FF}"
  };
  var JUDGE_SUFFIX = "‍⚖️";

  function avatarEmoji(pref) {
    var base = GENDER_BASE[pref.gender] || GENDER_BASE.f;
    var tone = TONE_MOD[pref.tone] || "";
    return base + tone + JUDGE_SUFFIX;
  }

  function readAvatarPref() {
    try {
      var raw = localStorage.getItem(AVATAR_KEY);
      if (!raw) return Object.assign({}, AVATAR_DEFAULT);
      var parsed = JSON.parse(raw);
      return {
        gender: GENDER_BASE[parsed.gender] ? parsed.gender : AVATAR_DEFAULT.gender,
        tone: TONE_MOD[parsed.tone] ? parsed.tone : AVATAR_DEFAULT.tone
      };
    } catch (e) {
      return Object.assign({}, AVATAR_DEFAULT);
    }
  }

  function writeAvatarPref(pref) {
    try { localStorage.setItem(AVATAR_KEY, JSON.stringify(pref)); } catch (e) {}
  }

  var avatarPref = readAvatarPref();

  var ORG_ORDER = LEIS_ORG_ORDER;
  var currentOrg = ORG_ORDER[0];

  var stateByOrg = {};
  ORG_ORDER.forEach(function (key) {
    stateByOrg[key] = LEIS_DATA[key].leis.map(function (d) {
      return { nome: d.nome, numero: d.numero, link: d.link, lida: false, lidaEm: null };
    });
  });

  function slug(text) {
    return (text || "").toLowerCase()
      .normalize("NFD").replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  }

  function rowKey(orgKey, row) { return orgKey + ":" + slug(row.numero); }

  function todayIso() {
    var now = new Date();
    var m = String(now.getMonth() + 1).padStart(2, "0");
    var d = String(now.getDate()).padStart(2, "0");
    return now.getFullYear() + "-" + m + "-" + d;
  }

  function readLocal() {
    try {
      var raw = localStorage.getItem(LOCAL_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch (e) { return {}; }
  }

  function writeLocal(map) {
    try { localStorage.setItem(LOCAL_KEY, JSON.stringify(map)); } catch (e) {}
  }

  function applyMap(map) {
    ORG_ORDER.forEach(function (orgKey) {
      stateByOrg[orgKey].forEach(function (row) {
        var k = rowKey(orgKey, row);
        if (Object.prototype.hasOwnProperty.call(map, k)) {
          var v = map[k];
          row.lida = !!(v && v.lida);
          row.lidaEm = (v && v.lidaEm) || null;
        }
      });
    });
  }

  function stateToMap() {
    var map = {};
    ORG_ORDER.forEach(function (orgKey) {
      stateByOrg[orgKey].forEach(function (row) {
        map[rowKey(orgKey, row)] = { lida: row.lida, lidaEm: row.lidaEm };
      });
    });
    return map;
  }

  function renderTabs() {
    tabsRoot.innerHTML = "";
    ORG_ORDER.forEach(function (key) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "org-tab" + (key === currentOrg ? " active" : "");
      btn.setAttribute("role", "tab");
      btn.setAttribute("aria-selected", key === currentOrg ? "true" : "false");
      btn.innerHTML = LEIS_DATA[key].label + '<span class="count">' + stateByOrg[key].length + "</span>";
      btn.addEventListener("click", function () {
        if (currentOrg === key) return;
        currentOrg = key;
        render();
      });
      tabsRoot.appendChild(btn);
    });
  }

  function render() {
    renderTabs();
    ledeText.textContent = "Leis citadas no conteúdo programático dos editais de magistratura (TJMG, TJSC, TJPR, TJSP, TJRS). Marque conforme for lendo.";
    footerSource.innerHTML = 'Índice montado a partir do conteúdo programático dos editais mapeados. Os links levam ao site oficial (Planalto ou portal do respectivo estado) — se algum link estiver quebrado ou desatualizado, avise para correção.';

    var state = stateByOrg[currentOrg];

    listRoot.innerHTML = "";
    var section = document.createElement("section");
    section.className = "year-group";
    var ul = document.createElement("ul");
    ul.className = "list";

    state.forEach(function (row) {
      var li = document.createElement("li");
      li.className = "row" + (row.lida ? " is-read" : "");

      var checkWrap = document.createElement("div");
      checkWrap.className = "check-wrap";
      var input = document.createElement("input");
      input.type = "checkbox";
      input.className = "check-box";
      input.checked = row.lida;
      input.setAttribute("aria-label", "Marcar " + row.nome + " como lida");
      input.addEventListener("change", function () { toggle(currentOrg, row, input.checked); });
      checkWrap.appendChild(input);

      var edition = document.createElement("div");
      edition.className = "edition";
      var num = document.createElement("span");
      num.className = "num";
      num.textContent = row.nome;
      var date = document.createElement("span");
      date.className = "date";
      date.textContent = row.numero;
      edition.appendChild(num);
      edition.appendChild(date);

      var star = document.createElement("span");
      if (row.lida) {
        star.textContent = "📗";
        star.className = "star star-gold";
        star.title = "Lida";
      } else {
        star.textContent = "📕";
        star.className = "star star-empty";
        star.title = "Ainda não lida";
      }

      var link = document.createElement("a");
      link.className = "open-link";
      link.href = row.link;
      link.target = "_blank";
      link.rel = "noopener";
      link.setAttribute("aria-label", "Abrir " + row.nome + " no site oficial");
      link.title = "Abrir no site oficial";
      link.textContent = "Abrir";

      li.appendChild(checkWrap);
      li.appendChild(edition);
      li.appendChild(star);
      li.appendChild(link);
      ul.appendChild(li);
    });

    section.appendChild(ul);
    listRoot.appendChild(section);

    var total = state.length;
    var lidas = state.filter(function (r) { return r.lida; }).length;
    document.getElementById("stat-count").textContent = lidas;
    document.getElementById("stat-total").textContent = total;
    document.getElementById("stat-pct").textContent = total ? Math.round((lidas / total) * 100) + "%" : "0%";
    document.getElementById("progress-fill").style.width = (total ? (lidas / total) * 100 : 0) + "%";
    var starLine = document.getElementById("stat-stars");
    if (starLine) {
      starLine.textContent = lidas
        ? avatarEmoji(avatarPref) + " " + lidas + " le" + (lidas === 1 ? "i" : "is")
        : "";
    }
  }

  var viewerId = null;
  var dbCap = null;
  var dbReady = false;
  var progressDoc = null;
  var publishTimer = null;
  var applyingRemote = false;

  function setNote(text) { syncNote.textContent = text || " "; }

  function scheduleSync() {
    if (publishTimer) clearTimeout(publishTimer);
    publishTimer = setTimeout(doSync, 700);
  }

  function doSync() {
    var map = stateToMap();
    writeLocal(map);
    if (!dbReady || !progressDoc) {
      setNote("Salvo neste navegador.");
      return;
    }
    setNote("Salvando…");
    progressDoc.set({ map: map, avatar: avatarPref, updatedAt: new Date().toISOString() })
      .then(function () {
        setNote("Salvo — só para você.");
        setTimeout(function () { setNote(""); }, 1600);
      })
      .catch(function (err) {
        if (err && err.code === "permission-denied") {
          dbCap = null;
          progressDoc = null;
          setNote("Sem sincronização aqui — salvo neste navegador.");
          return;
        }
        setNote("Não foi possível salvar agora — salvo neste navegador.");
      });
  }

  function toggle(orgKey, row, value) {
    row.lida = value;
    row.lidaEm = value ? todayIso() : null;
    render();
    if (!applyingRemote) {
      scheduleSync();
      scheduleGroupSync();
    }
  }

  // ---- Estudo coletivo -------------------------------------------------
  // Grupo próprio desta página (coleção "groups"), independente do
  // grupo do Diário dos Informativos — mesmo padrão, código separado.
  var GROUP_KEY = "informativos-grupo"; // mesma chave do Diário dos Informativos — grupo compartilhado entre as duas páginas (mesmo domínio)
  function readGroupPref() {
    try {
      var raw = localStorage.getItem(GROUP_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) { return null; }
  }
  function writeGroupPref(pref) {
    try {
      if (pref) localStorage.setItem(GROUP_KEY, JSON.stringify(pref));
      else localStorage.removeItem(GROUP_KEY);
    } catch (e) {}
  }
  var groupPref = readGroupPref();
  var groupMembersUnsub = null;
  var groupSyncTimer = null;
  var groupCreatorId = null;

  (function ensureJoinedAt() {
    if (groupPref && !groupPref.joinedAt) {
      groupPref.joinedAt = new Date().toISOString();
      writeGroupPref(groupPref);
    }
  })();

  function computeTotals() {
    var lidas = 0;
    ORG_ORDER.forEach(function (orgKey) {
      stateByOrg[orgKey].forEach(function (r) { if (r.lida) lidas++; });
    });
    return { lidas: lidas };
  }

  function genGroupCode() {
    var chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    var out = "";
    for (var i = 0; i < 6; i++) out += chars[Math.floor(Math.random() * chars.length)];
    return out;
  }

  var groupToggleBtn = document.getElementById("group-toggle");
  var groupPanel = document.getElementById("group-panel");
  var groupJoinBlock = document.getElementById("group-join-block");
  var groupActiveBlock = document.getElementById("group-active-block");
  var groupNameInput = document.getElementById("group-name-input");
  var groupCodeInput = document.getElementById("group-code-input");
  var groupCreateBtn = document.getElementById("group-create-btn");
  var groupJoinBtn = document.getElementById("group-join-btn");
  var groupErrorEl = document.getElementById("group-error");
  var groupCodeDisplay = document.getElementById("group-code-display");
  var groupCopyBtn = document.getElementById("group-copy-btn");
  var groupLeaveBtn = document.getElementById("group-leave-btn");
  var groupLeaderboard = document.getElementById("group-leaderboard");

  function showGroupError(msg) {
    if (!groupErrorEl) return;
    groupErrorEl.textContent = msg;
    groupErrorEl.className = "group-note is-error";
    groupErrorEl.hidden = !msg;
  }

  function renderGroupUI() {
    var active = !!groupPref;
    if (groupJoinBlock) groupJoinBlock.hidden = active;
    if (groupActiveBlock) groupActiveBlock.hidden = !active;
    if (active && groupCodeDisplay) groupCodeDisplay.textContent = groupPref.code;
  }

  function memberDocRef(code) {
    return dbCap ? dbCap.doc("groups/" + code + "/members/" + viewerId) : null;
  }

  function scheduleGroupSync() {
    if (!groupPref) return;
    if (groupSyncTimer) clearTimeout(groupSyncTimer);
    groupSyncTimer = setTimeout(updateMyMemberDoc, 700);
  }

  function updateMyMemberDoc() {
    if (!dbCap || !groupPref) return;
    var totals = computeTotals();
    var ref = memberDocRef(groupPref.code);
    if (!ref) return;
    // merge: true — este membro pode já ter um documento com os campos do
    // Diário dos Informativos (lidas/estrelasOuro); só atualizamos os
    // campos próprios do Diário das Leis, sem apagar os do outro.
    ref.set({
      name: groupPref.name,
      lidasLeis: totals.lidas,
      avatar: avatarPref,
      joinedAt: groupPref.joinedAt,
      updatedAt: new Date().toISOString()
    }, { merge: true }).catch(function () { /* best-effort */ });
  }

  function fetchGroupCreator(code) {
    if (!dbCap) return;
    dbCap.doc("groups/" + code).get().then(function (snap) {
      if (snap.exists) {
        var data = snap.data();
        groupCreatorId = (data && data.createdBy) || null;
        if (groupMembersUnsub) renderCachedLeaderboard();
      }
    }).catch(function () {});
  }

  var lastGroupSnap = null;
  function renderCachedLeaderboard() {
    if (lastGroupSnap) renderLeaderboard(lastGroupSnap);
  }

  function renderLeaderboard(snap) {
    if (!groupLeaderboard) return;
    lastGroupSnap = snap;
    var members = snap.docs.map(function (d) {
      var data = d.data() || {};
      return {
        id: d.id,
        name: data.name,
        lidas: data.lidasLeis,
        avatar: data.avatar,
        joinedAt: data.joinedAt || ""
      };
    }).filter(function (m) { return m && m.name; });
    members.sort(function (a, b) {
      var aCreator = a.id === groupCreatorId, bCreator = b.id === groupCreatorId;
      if (aCreator !== bCreator) return aCreator ? -1 : 1;
      if (a.joinedAt !== b.joinedAt) return a.joinedAt < b.joinedAt ? -1 : 1;
      return (a.name || "").localeCompare(b.name || "");
    });
    var maxLidas = 0;
    members.forEach(function (m) { if ((m.lidas || 0) > maxLidas) maxLidas = m.lidas || 0; });
    groupLeaderboard.innerHTML = "";
    members.forEach(function (m) {
      var li = document.createElement("li");
      li.className = "group-member" + (maxLidas > 0 && m.lidas === maxLidas ? " is-leader" : "");

      var nameEl = document.createElement("span");
      nameEl.className = "member-name";
      nameEl.textContent = m.name;

      var emojisEl = document.createElement("span");
      emojisEl.className = "member-emojis";
      var emoji = avatarEmoji(m.avatar && GENDER_BASE[m.avatar.gender] && TONE_MOD[m.avatar.tone] ? m.avatar : AVATAR_DEFAULT);
      var count = m.lidas || 0;
      var CAP = 40;
      emojisEl.textContent = emoji.repeat(Math.min(count, CAP)) + (count > CAP ? " +" + (count - CAP) : "");

      var countEl = document.createElement("span");
      countEl.className = "member-count";
      countEl.textContent = count + (count === 1 ? " lida" : " lidas");

      li.appendChild(nameEl);
      li.appendChild(emojisEl);
      li.appendChild(countEl);
      groupLeaderboard.appendChild(li);
    });
  }

  function subscribeGroup(code) {
    if (groupMembersUnsub) { groupMembersUnsub(); groupMembersUnsub = null; }
    if (!dbCap) return;
    groupMembersUnsub = dbCap.collection("groups/" + code + "/members").onSnapshot(
      renderLeaderboard,
      function () {}
    );
    fetchGroupCreator(code);
  }

  function createGroup() {
    showGroupError("");
    var name = groupNameInput ? groupNameInput.value.trim() : "";
    if (!name) { showGroupError("Informe seu nome para criar o grupo."); return; }
    if (!dbCap || !viewerId) { showGroupError("Ainda carregando — aguarde um instante e tente de novo."); return; }
    var code = genGroupCode();
    dbCap.doc("groups/" + code).set({ createdAt: new Date().toISOString(), createdBy: viewerId })
      .then(function () {
        groupCreatorId = viewerId;
        groupPref = { code: code, name: name, joinedAt: new Date().toISOString() };
        writeGroupPref(groupPref);
        renderGroupUI();
        subscribeGroup(code);
        updateMyMemberDoc();
      })
      .catch(function () { showGroupError("Não foi possível criar o grupo agora. Tente de novo."); });
  }

  function joinGroup() {
    showGroupError("");
    var name = groupNameInput ? groupNameInput.value.trim() : "";
    var code = groupCodeInput ? groupCodeInput.value.trim().toUpperCase() : "";
    if (!name) { showGroupError("Informe seu nome para entrar no grupo."); return; }
    if (!code) { showGroupError("Informe o código do grupo."); return; }
    if (!dbCap || !viewerId) { showGroupError("Ainda carregando — aguarde um instante e tente de novo."); return; }
    dbCap.doc("groups/" + code).get().then(function (snap) {
      if (!snap.exists) { showGroupError("Código não encontrado — confira com quem te convidou."); return; }
      var data = snap.data();
      groupCreatorId = (data && data.createdBy) || null;
      groupPref = { code: code, name: name, joinedAt: new Date().toISOString() };
      writeGroupPref(groupPref);
      renderGroupUI();
      subscribeGroup(code);
      updateMyMemberDoc();
    }).catch(function () { showGroupError("Não foi possível entrar agora. Tente de novo."); });
  }

  function leaveGroup() {
    if (groupMembersUnsub) { groupMembersUnsub(); groupMembersUnsub = null; }
    if (dbCap && groupPref) {
      var ref = memberDocRef(groupPref.code);
      if (ref) ref.delete().catch(function () {});
    }
    groupPref = null;
    writeGroupPref(null);
    groupCreatorId = null;
    lastGroupSnap = null;
    if (groupLeaderboard) groupLeaderboard.innerHTML = "";
    renderGroupUI();
  }

  function copyInviteLink() {
    if (!groupPref) return;
    var url = location.origin + location.pathname + "?grupo=" + groupPref.code;
    var done = function () { setNote("Link copiado — envie para seu amigo."); setTimeout(function () { setNote(""); }, 2000); };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url).then(done).catch(function () { window.prompt("Copie o link do convite:", url); });
    } else {
      window.prompt("Copie o link do convite:", url);
    }
  }

  // Os botões de baixo (e os de personalizar boneco / vincular e-mail, mais
  // adiante) usam delegação de clique — ver "Delegação de cliques" perto do
  // fim do arquivo — em vez de addEventListener direto, para não depender
  // da ordem em que o Blogger termina de inserir cada bloco no DOM.

  (function prefillInviteCode() {
    try {
      var params = new URLSearchParams(location.search);
      var invited = params.get("grupo");
      if (invited && groupCodeInput && !groupPref) {
        groupCodeInput.value = invited.toUpperCase();
        if (groupPanel) groupPanel.hidden = false;
        if (groupToggleBtn) groupToggleBtn.setAttribute("aria-expanded", "true");
      }
    } catch (e) {}
  })();

  renderGroupUI();

  // Painel de personalização do boneco
  var avatarToggleBtn = document.getElementById("avatar-toggle");
  var avatarToggleGenderSelect = document.getElementById("avatar-gender");
  var avatarToneSelect = document.getElementById("avatar-tone");
  var avatarPreview = document.getElementById("avatar-toggle-preview");
  var avatarPanel = document.getElementById("avatar-panel");

  function syncAvatarControls() {
    if (avatarToggleGenderSelect) avatarToggleGenderSelect.value = avatarPref.gender;
    if (avatarToneSelect) avatarToneSelect.value = avatarPref.tone;
    if (avatarPreview) avatarPreview.textContent = avatarEmoji(avatarPref);
  }

  function onAvatarPrefChange() {
    avatarPref = {
      gender: avatarToggleGenderSelect ? avatarToggleGenderSelect.value : avatarPref.gender,
      tone: avatarToneSelect ? avatarToneSelect.value : avatarPref.tone
    };
    writeAvatarPref(avatarPref);
    syncAvatarControls();
    render();
    if (!applyingRemote) scheduleSync();
  }

  if (avatarToggleGenderSelect) avatarToggleGenderSelect.addEventListener("change", onAvatarPrefChange);
  if (avatarToneSelect) avatarToneSelect.addEventListener("change", onAvatarPrefChange);

  syncAvatarControls();

  // ---- Vincular e-mail (opcional) — mesma lógica do Diário dos Informativos
  var accountToggleBtn = document.getElementById("account-toggle");
  var accountPanel = document.getElementById("account-panel");
  var accountLinkBlock = document.getElementById("account-link-block");
  var accountLinkedBlock = document.getElementById("account-linked-block");
  var accountEmailInput = document.getElementById("account-email-input");
  var accountPasswordInput = document.getElementById("account-password-input");
  var accountLinkBtn = document.getElementById("account-link-btn");
  var accountSigninBtn = document.getElementById("account-signin-btn");
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
      return "Esse e-mail já está vinculado a outro progresso salvo. Use \"Já vinculei — recuperar aqui\" para entrar com ele em vez de vinculá-lo de novo.";
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

  // ---- Delegação de cliques --------------------------------------------
  // Um único listener no "document", em vez de um addEventListener por
  // botão — evita depender da ordem/tempo em que o Blogger termina de
  // inserir cada bloco de HTML no DOM.
  function togglePanel(btn, panel) {
    if (!btn || !panel) return;
    var open = panel.hidden;
    panel.hidden = !open;
    btn.setAttribute("aria-expanded", open ? "true" : "false");
  }

  document.addEventListener("click", function (e) {
    var t = e.target.closest(
      "#avatar-toggle, #group-toggle, #account-toggle, " +
      "#group-create-btn, #group-join-btn, #group-copy-btn, #group-leave-btn, " +
      "#account-link-btn, #account-signin-btn"
    );
    if (!t) return;
    switch (t.id) {
      case "avatar-toggle": togglePanel(t, document.getElementById("avatar-panel")); break;
      case "group-toggle": togglePanel(t, document.getElementById("group-panel")); break;
      case "account-toggle": togglePanel(t, document.getElementById("account-panel")); break;
      case "group-create-btn": createGroup(); break;
      case "group-join-btn": joinGroup(); break;
      case "group-copy-btn": copyInviteLink(); break;
      case "group-leave-btn": leaveGroup(); break;
      case "account-link-btn": linkEmailAccount(); break;
      case "account-signin-btn": signInWithEmail(); break;
    }
  });

  // 1) pintura instantânea com o que já está salvo neste navegador
  applyMap(readLocal());
  render();

  // 2) login anônimo no Firebase (própria coleção "progress-leis",
  // independente do progresso do Diário dos Informativos)
  var progressUnsub = null;

  function bindUser(uid) {
    viewerId = uid;
    dbCap = firebase.firestore();
    progressDoc = dbCap.doc("progress-leis/" + viewerId);
    dbReady = true;
    if (progressUnsub) { progressUnsub(); progressUnsub = null; }
    progressUnsub = progressDoc.onSnapshot(function (snap) {
      if (!snap.exists) return;
      var data = snap.data();
      if (!data) return;
      applyingRemote = true;
      if (data.map) { applyMap(data.map); writeLocal(data.map); }
      if (data.avatar && GENDER_BASE[data.avatar.gender] && TONE_MOD[data.avatar.tone]) {
        avatarPref = { gender: data.avatar.gender, tone: data.avatar.tone };
        writeAvatarPref(avatarPref);
        syncAvatarControls();
      }
      render();
      applyingRemote = false;
    }, function () {});
    if (groupPref) {
      subscribeGroup(groupPref.code);
      updateMyMemberDoc();
    }
  }

  if (window.firebase && window.DIARIO_FIREBASE_CONFIG) {
    if (!firebase.apps.length) firebase.initializeApp(window.DIARIO_FIREBASE_CONFIG);
    firebase.auth().onAuthStateChanged(function (user) {
      if (!user) return;
      if (viewerId !== user.uid) bindUser(user.uid);
      renderAccountUI(user);
    });
    firebase.auth().signInAnonymously().catch(function () { dbReady = true; });
  } else {
    dbReady = true;
  }
})();
