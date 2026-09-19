
(function () {
  "use strict";

  // (dados carregados de sumulas-data.js, que roda antes deste arquivo)
  var LOCAL_KEY = "sumulas-lidas";
  var listRoot = document.getElementById("list-root");
  var syncNote = document.getElementById("sync-note");
  var ledeText = document.getElementById("lede-text");
  var footerSource = document.getElementById("footer-source");

  var tribunalSelect = document.getElementById("tribunal-select");
  var materiaSelect = document.getElementById("materia-select");
  var loteToggle = document.getElementById("lote-toggle");
  var pagerPrev = document.getElementById("lote-prev");
  var pagerNext = document.getElementById("lote-next");
  var pagerLabel = document.getElementById("lote-label");

  // Boneco personalizável — mesmo esquema dos outros Diários.
  var AVATAR_KEY = "sumulas-avatar";
  var AVATAR_DEFAULT = { gender: "f", tone: "3" };
  var GENDER_BASE = { f: "\u{1F469}", m: "\u{1F468}", x: "\u{1F9D1}" };
  var TONE_MOD = {
    "1": "\u{1F3FB}", "2": "\u{1F3FC}", "3": "\u{1F3FD}", "4": "\u{1F3FE}", "5": "\u{1F3FF}"
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
    } catch (e) { return Object.assign({}, AVATAR_DEFAULT); }
  }
  function writeAvatarPref(pref) {
    try { localStorage.setItem(AVATAR_KEY, JSON.stringify(pref)); } catch (e) {}
  }
  var avatarPref = readAvatarPref();

  var ORG_ORDER = SUMULAS_ORG_ORDER;

  // Estado por tribunal: cada súmula ganha lida/lidaEm, igual aos outros
  // Diários. Tribunais "em_breve" ficam com a lista vazia mesmo.
  var stateByOrg = {};
  ORG_ORDER.forEach(function (key) {
    stateByOrg[key] = SUMULAS_DATA[key].sumulas.map(function (d) {
      return { numero: d.numero, texto: d.texto, materia: d.materia, link: d.link, lida: false, lidaEm: null };
    });
  });

  // Só tribunais com conteúdo real entram no <select>; os demais aparecem
  // desabilitados com "(em preparação)" para deixar claro que virão.
  var currentOrg = ORG_ORDER.filter(function (k) { return SUMULAS_DATA[k].status === "disponivel"; })[0] || ORG_ORDER[0];
  var currentMateria = "todas";
  var loteSize = 10;
  var loteAtual = 0; // índice (0-based) do lote sendo exibido

  function todayIso() {
    var now = new Date();
    var m = String(now.getMonth() + 1).padStart(2, "0");
    var d = String(now.getDate()).padStart(2, "0");
    return now.getFullYear() + "-" + m + "-" + d;
  }

  function rowKey(orgKey, row) { return orgKey + ":" + row.numero; }

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

  // ---- Seletor de tribunal ----------------------------------------------
  function renderTribunalSelect() {
    if (!tribunalSelect) return;
    tribunalSelect.innerHTML = "";
    ORG_ORDER.forEach(function (key) {
      var info = SUMULAS_DATA[key];
      var opt = document.createElement("option");
      opt.value = key;
      var count = stateByOrg[key].length;
      opt.textContent = info.status === "disponivel"
        ? info.label + " (" + count + ")"
        : info.label + " — em preparação";
      if (info.status !== "disponivel") opt.disabled = true;
      if (key === currentOrg) opt.selected = true;
      tribunalSelect.appendChild(opt);
    });
  }

  // ---- Seletor de matéria -------------------------------------------------
  // Enquanto a classificação por matéria não estiver pronta (materia ===
  // null em todo mundo), só existe a opção "Todas as matérias".
  function materiasDisponiveis() {
    var set = {};
    stateByOrg[currentOrg].forEach(function (r) { if (r.materia) set[r.materia] = true; });
    return Object.keys(set).sort();
  }

  function renderMateriaSelect() {
    if (!materiaSelect) return;
    var materias = materiasDisponiveis();
    materiaSelect.innerHTML = "";
    var optAll = document.createElement("option");
    optAll.value = "todas";
    optAll.textContent = "Todas as matérias";
    materiaSelect.appendChild(optAll);
    materias.forEach(function (m) {
      var opt = document.createElement("option");
      opt.value = m;
      opt.textContent = m;
      materiaSelect.appendChild(opt);
    });
    materiaSelect.disabled = materias.length === 0;
    materiaSelect.value = "todas";
    currentMateria = "todas";
  }

  function filteredState() {
    return stateByOrg[currentOrg].filter(function (r) {
      return currentMateria === "todas" || r.materia === currentMateria;
    });
  }

  // ---- Lotes de leitura (10 em 10 / 20 em 20) ----------------------------
  function totalLotes() {
    var n = filteredState().length;
    return Math.max(1, Math.ceil(n / loteSize));
  }

  function clampLote() {
    var max = totalLotes() - 1;
    if (loteAtual > max) loteAtual = max;
    if (loteAtual < 0) loteAtual = 0;
  }

  function renderPager(list) {
    clampLote();
    var total = totalLotes();
    var start = loteAtual * loteSize;
    var end = Math.min(start + loteSize, list.length);
    if (pagerLabel) {
      pagerLabel.textContent = list.length
        ? "Lote " + (loteAtual + 1) + " de " + total + " — mostrando " + (start + 1) + "–" + end + " de " + list.length
        : "Nenhuma súmula nesse filtro ainda";
    }
    if (pagerPrev) pagerPrev.disabled = loteAtual <= 0;
    if (pagerNext) pagerNext.disabled = loteAtual >= total - 1;
  }

  function render() {
    renderTribunalSelect();
    renderMateriaSelect();

    var info = SUMULAS_DATA[currentOrg];
    ledeText.textContent = info.status === "disponivel"
      ? "Escolha o tribunal, a matéria (quando disponível) e o tamanho do lote — vá lendo sem se sobrecarregar."
      : "Esse tribunal ainda está em preparação — as súmulas dele entram em breve.";
    footerSource.innerHTML = info.status === "disponivel"
      ? 'Texto oficial das súmulas — confira sempre a fonte no botão "Abrir" de cada linha. Se notar algum texto desatualizado ou incorreto, avise para correção.'
      : "";

    var full = filteredState();
    var start = loteAtual * loteSize;
    var pageItems = full.slice(start, start + loteSize);

    listRoot.innerHTML = "";

    if (info.status !== "disponivel") {
      var msg = document.createElement("p");
      msg.className = "avatar-note";
      msg.style.marginTop = "1rem";
      msg.textContent = "As súmulas do " + info.label.split(" —")[0] + " ainda não foram levantadas. Elas entram em uma próxima atualização.";
      listRoot.appendChild(msg);
      renderPager(full);
      updateStats(full);
      return;
    }

    var ul = document.createElement("ul");
    ul.className = "list";

    pageItems.forEach(function (row) {
      var li = document.createElement("li");
      li.className = "row sumula-row" + (row.lida ? " is-read" : "");

      var checkWrap = document.createElement("div");
      checkWrap.className = "check-wrap";
      var input = document.createElement("input");
      input.type = "checkbox";
      input.className = "check-box";
      input.checked = row.lida;
      input.setAttribute("aria-label", "Marcar súmula nº " + row.numero + " como lida");
      input.addEventListener("change", function () { toggle(row, input.checked); });
      checkWrap.appendChild(input);

      var edition = document.createElement("div");
      edition.className = "edition sumula-edition";
      var num = document.createElement("span");
      num.className = "num";
      num.textContent = (currentOrg === "stf_vinculante" ? "Súmula Vinculante nº " : "Súmula nº ") + row.numero;
      var texto = document.createElement("p");
      texto.className = "sumula-texto";
      texto.textContent = row.texto;
      edition.appendChild(num);
      edition.appendChild(texto);

      var star = document.createElement("span");
      if (row.lida) {
        star.textContent = "📘";
        star.className = "star star-gold";
        star.title = "Lida";
      } else {
        star.textContent = "📙";
        star.className = "star star-empty";
        star.title = "Ainda não lida";
      }

      var link = document.createElement("a");
      link.className = "open-link";
      link.href = row.link;
      link.target = "_blank";
      link.rel = "noopener";
      link.title = "Abrir no site oficial";
      link.textContent = "Abrir";

      li.appendChild(checkWrap);
      li.appendChild(edition);
      li.appendChild(star);
      li.appendChild(link);
      ul.appendChild(li);
    });

    listRoot.appendChild(ul);
    renderPager(full);
    updateStats(full);
  }

  function updateStats(full) {
    var total = full.length;
    var lidas = full.filter(function (r) { return r.lida; }).length;
    document.getElementById("stat-count").textContent = lidas;
    document.getElementById("stat-total").textContent = total;
    document.getElementById("stat-pct").textContent = total ? Math.round((lidas / total) * 100) + "%" : "0%";
    document.getElementById("progress-fill").style.width = (total ? (lidas / total) * 100 : 0) + "%";
    var starLine = document.getElementById("stat-stars");
    if (starLine) {
      var totalLidasGeral = 0;
      ORG_ORDER.forEach(function (k) { stateByOrg[k].forEach(function (r) { if (r.lida) totalLidasGeral++; }); });
      starLine.textContent = totalLidasGeral
        ? avatarEmoji(avatarPref) + " " + totalLidasGeral + " súmula" + (totalLidasGeral === 1 ? "" : "s") + " no total"
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
    if (!dbReady || !progressDoc) { setNote("Salvo neste navegador."); return; }
    setNote("Salvando…");
    progressDoc.set({ map: map, avatar: avatarPref, updatedAt: new Date().toISOString() })
      .then(function () {
        setNote("Salvo — só para você.");
        setTimeout(function () { setNote(""); }, 1600);
      })
      .catch(function (err) {
        if (err && err.code === "permission-denied") {
          dbCap = null; progressDoc = null;
          setNote("Sem sincronização aqui — salvo neste navegador.");
          return;
        }
        setNote("Não foi possível salvar agora — salvo neste navegador.");
      });
  }

  function toggle(row, value) {
    row.lida = value;
    row.lidaEm = value ? todayIso() : null;
    render();
    if (!applyingRemote) { scheduleSync(); scheduleGroupSync(); }
  }

  // ---- Estudo coletivo (multi-grupo) -----------------------------------
  // O MESMO código de grupo vale em todos os diários (Informativos, Leis,
  // Súmulas) — aqui só mantemos o campo "lidasSumulas" deste diário
  // atualizado no documento do membro, em cada grupo que a pessoa
  // participa, e mostramos um resumo PESSOAL (nunca os nomes dos outros
  // membros): em quantos desses grupos a pessoa está em 1º/2º/3º lugar.
  // A lista completa, grupo a grupo, com todo mundo, fica só em "Meus
  // Grupos de Estudo" — e lá, cada pessoa só vê os grupos dela mesma.
  // Criar, entrar ou sair de um grupo também acontece só lá
  // (grupos-shared.js cuida do armazenamento local e da comunicação com
  // o Firebase).
  var GS = window.GruposShared;
  var HUB_URL = "https://www.estudamana.com.br/p/meus-grupos-de-estudo.html";
  var myPrizesEl = document.getElementById("my-prizes");
  var groupUnsubs = {};      // code -> função de cancelar a inscrição
  var groupSnapshots = {};   // code -> último snapshot de members
  var groupSyncTimer = null;

  function computeTotals() {
    var lidas = 0;
    ORG_ORDER.forEach(function (k) { stateByOrg[k].forEach(function (r) { if (r.lida) lidas++; }); });
    return { lidas: lidas };
  }

  function renderMyPrizes() {
    if (!myPrizesEl || !GS) return;
    var codes = GS.readGroups().map(function (g) { return g.code; });
    var tally = GS.tallyMyPrizes(codes, groupSnapshots, "lidasSumulas", viewerId);
    GS.renderMyPrizes(myPrizesEl, tally, { hubHref: HUB_URL });
  }

  function scheduleGroupSync() {
    if (groupSyncTimer) clearTimeout(groupSyncTimer);
    groupSyncTimer = setTimeout(pushProgressToGroups, 700);
  }

  function pushProgressToGroups() {
    if (!GS || !viewerId) return;
    var totals = computeTotals();
    GS.readGroups().forEach(function (g) {
      GS.updateMember(g.code, viewerId, {
        name: g.name,
        lidasSumulas: totals.lidas,
        avatar: avatarPref,
        joinedAt: g.joinedAt
      }).catch(function () { /* melhor esforço — segue salvo localmente */ });
    });
  }

  function subscribeAllGroups() {
    if (!GS) return;
    GS.readGroups().forEach(function (g) {
      if (groupUnsubs[g.code]) return; // já inscrito
      groupUnsubs[g.code] = GS.subscribeMembers(g.code, function (snap) {
        groupSnapshots[g.code] = snap;
        renderMyPrizes();
      });
    });
  }

  renderMyPrizes();


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
    if (!applyingRemote) { scheduleSync(); scheduleGroupSync(); }
  }

  if (avatarToggleGenderSelect) avatarToggleGenderSelect.addEventListener("change", onAvatarPrefChange);
  if (avatarToneSelect) avatarToneSelect.addEventListener("change", onAvatarPrefChange);
  syncAvatarControls();

  // ---- Vincular e-mail (opcional) — mesma lógica dos outros Diários -----
  var accountToggleBtn = document.getElementById("account-toggle");
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
      return "Esse e-mail já está vinculado a outro progresso salvo. Use \"Já ativei — entrar neste aparelho\" para entrar com ele em vez de vinculá-lo de novo.";
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

  // ---- Controles de tribunal / matéria / tamanho do lote -----------------
  if (tribunalSelect) {
    tribunalSelect.addEventListener("change", function () {
      currentOrg = tribunalSelect.value;
      loteAtual = 0;
      render();
    });
  }
  if (materiaSelect) {
    materiaSelect.addEventListener("change", function () {
      currentMateria = materiaSelect.value;
      loteAtual = 0;
      render();
    });
  }
  if (loteToggle) {
    loteToggle.addEventListener("click", function (e) {
      var btn = e.target.closest("[data-lote-size]");
      if (!btn) return;
      loteSize = parseInt(btn.getAttribute("data-lote-size"), 10) || 10;
      loteAtual = 0;
      Array.prototype.forEach.call(loteToggle.querySelectorAll("[data-lote-size]"), function (b) {
        b.classList.toggle("is-active", b === btn);
      });
      render();
    });
  }
  if (pagerPrev) pagerPrev.addEventListener("click", function () { loteAtual--; render(); });
  if (pagerNext) pagerNext.addEventListener("click", function () { loteAtual++; render(); });

  // ---- Delegação de cliques (bonequinho / grupo / e-mail) ----------------
  function togglePanel(btn, panel) {
    if (!btn || !panel) return;
    var open = panel.hidden;
    panel.hidden = !open;
    btn.setAttribute("aria-expanded", open ? "true" : "false");
  }

  document.addEventListener("click", function (e) {
    var t = e.target.closest(
      "#avatar-toggle, #account-toggle, #account-link-btn, #account-signin-btn"
    );
    if (!t) return;
    switch (t.id) {
      case "avatar-toggle": togglePanel(t, document.getElementById("avatar-panel")); break;
      case "account-toggle": togglePanel(t, document.getElementById("account-panel")); break;
      case "account-link-btn": linkEmailAccount(); break;
      case "account-signin-btn": signInWithEmail(); break;
    }
  });

  // 1) pintura instantânea com o que já está salvo neste navegador
  applyMap(readLocal());
  render();

  // 2) login anônimo no Firebase (própria coleção "progress-sumulas")
  var progressUnsub = null;

  function bindUser(uid) {
    viewerId = uid;
    dbCap = firebase.firestore();
    progressDoc = dbCap.doc("progress-sumulas/" + viewerId);
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
    subscribeAllGroups();
    pushProgressToGroups();
  }

  if (window.firebase && window.DIARIO_FIREBASE_CONFIG) {
    if (!firebase.apps.length) firebase.initializeApp(window.DIARIO_FIREBASE_CONFIG);
    firebase.auth().onAuthStateChanged(function (user) {
      if (!user) return;
      if (viewerId !== user.uid) bindUser(user.uid);
      renderAccountUI(user);
    });
    // Só cria o login anônimo se, depois de o Firebase restaurar a sessão, não houver
    // ninguém logado — assim não troca uma conta vinculada (e-mail ou Google) por outra.
    var offAnon = firebase.auth().onAuthStateChanged(function (u) {
      offAnon();
      if (!u) firebase.auth().signInAnonymously().catch(function () { dbReady = true; });
    });
  } else {
    dbReady = true;
  }
})();

/* Login com Google (conta-google.js, mesma pasta deste script) */
(function () {
  var all0 = document.getElementsByTagName("script"), src = "";
  for (var i = 0; i < all0.length; i++) {
    if (/sumulas-logic\.js/.test(all0[i].src)) { src = all0[i].src; break; }
  }
  if (!src) return;
  function go() {
    if (window.ContaGoogle || document.getElementById("conta-google-js")) return;
    if (!(window.firebase && window.DIARIO_FIREBASE_CONFIG)) return;
    var s = document.createElement("script");
    s.id = "conta-google-js";
    s.src = src.replace(/sumulas-logic\.js/, "conta-google.js");
    document.head.appendChild(s);
  }
  if (document.readyState === "complete") go(); else window.addEventListener("load", go);
})();
