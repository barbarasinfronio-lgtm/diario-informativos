
(function () {
  "use strict";

  // (dados carregados de normas-data.js, que roda antes deste arquivo)
  var LOCAL_KEY = "normas-lidas";
  var listRoot = document.getElementById("list-root");
  var syncNote = document.getElementById("sync-note");
  var ledeText = document.getElementById("lede-text");
  var footerSource = document.getElementById("footer-source");

  var orgaoSelect = document.getElementById("orgao-select");

  // Base comum do "Estudo coletivo" (grupos, ranking, boneco/avatar) —
  // grupos-shared.js roda antes deste arquivo em toda página de diário.
  var GS = window.GruposShared;

  // Boneco personalizável — mesmo esquema dos outros Diários
  // (grupos-shared.js), guardado sob uma chave própria.
  var AVATAR_KEY = "normas-avatar";
  var avatarPref = GS.readAvatarPref(AVATAR_KEY);

  var ORG_ORDER = NORMAS_ORG_ORDER;

  // Estado por órgão: cada norma ganha lida/lidaEm, igual aos outros Diários.
  var stateByOrg = {};
  ORG_ORDER.forEach(function (key) {
    stateByOrg[key] = NORMAS_DATA[key].normas.map(function (d) {
      return { tipo: d.tipo, numero: d.numero, ementa: d.ementa, link: d.link, lida: false, lidaEm: null };
    });
  });

  var currentOrg = ORG_ORDER.filter(function (k) { return NORMAS_DATA[k].status === "disponivel"; })[0] || ORG_ORDER[0];

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

  // ---- Seletor de órgão ---------------------------------------------------
  function renderOrgaoSelect() {
    if (!orgaoSelect) return;
    orgaoSelect.innerHTML = "";
    ORG_ORDER.forEach(function (key) {
      var info = NORMAS_DATA[key];
      var opt = document.createElement("option");
      opt.value = key;
      var count = stateByOrg[key].length;
      opt.textContent = info.status === "disponivel"
        ? info.label + " (" + count + ")"
        : info.label + " — em preparação";
      if (info.status !== "disponivel") opt.disabled = true;
      if (key === currentOrg) opt.selected = true;
      orgaoSelect.appendChild(opt);
    });
  }

  function render() {
    renderOrgaoSelect();

    var info = NORMAS_DATA[currentOrg];
    ledeText.textContent = info.status === "disponivel"
      ? "Escolha o órgão no menu acima e vá marcando conforme for lendo. Lista curada a partir dos editais mapeados, mais um conjunto mínimo de normas estruturais de cada órgão — não é um catálogo exaustivo de tudo o que está vigente."
      : "Esse órgão ainda está em preparação — as normas dele entram em breve.";
    footerSource.innerHTML = info.status === "disponivel"
      ? 'Texto oficial de cada norma — confira sempre a fonte no botão "Abrir" de cada linha. Se notar algo desatualizado, revogado ou incorreto, avise para correção.'
      : "";

    var list = stateByOrg[currentOrg];

    listRoot.innerHTML = "";

    if (info.status !== "disponivel") {
      renderStats(list);
      return;
    }

    var ul = document.createElement("ul");
    ul.className = "list";

    list.forEach(function (row) {
      var li = document.createElement("li");
      li.className = "row sumula-row" + (row.lida ? " is-read" : "");

      var checkWrap = document.createElement("div");
      checkWrap.className = "check-wrap";
      var input = document.createElement("input");
      input.type = "checkbox";
      input.className = "check-box";
      input.checked = row.lida;
      input.setAttribute("aria-label", "Marcar " + row.tipo + " nº " + row.numero + " como lida");
      input.addEventListener("change", function () { toggle(row, input.checked); });
      checkWrap.appendChild(input);

      var edition = document.createElement("div");
      edition.className = "edition sumula-edition";
      var num = document.createElement("span");
      num.className = "num";
      num.textContent = row.tipo + " nº " + row.numero;
      var texto = document.createElement("p");
      texto.className = "sumula-texto";
      texto.textContent = row.ementa;
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
    renderStats(list);
  }

  function renderStats(list) {
    var total = list.length;
    var lidas = list.filter(function (r) { return r.lida; }).length;
    document.getElementById("stat-count").textContent = lidas;
    document.getElementById("stat-total").textContent = total;
    document.getElementById("stat-pct").textContent = total ? Math.round((lidas / total) * 100) + "%" : "0%";
    document.getElementById("progress-fill").style.width = (total ? (lidas / total) * 100 : 0) + "%";
    var starLine = document.getElementById("stat-stars");
    if (starLine) {
      var totalLidasGeral = 0;
      ORG_ORDER.forEach(function (k) { stateByOrg[k].forEach(function (r) { if (r.lida) totalLidasGeral++; }); });
      starLine.textContent = totalLidasGeral
        ? GS.avatarEmoji(avatarPref) + " " + totalLidasGeral + " norma" + (totalLidasGeral === 1 ? "" : "s") + " no total"
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
  // O MESMO código de grupo vale em todos os diários — aqui só mantemos o
  // campo "lidasNormas" deste diário atualizado no documento do membro, em
  // cada grupo que a pessoa participa, e mostramos um resumo PESSOAL (nunca
  // os nomes dos outros membros). A lista completa, grupo a grupo, fica só
  // em "Meus Grupos de Estudo".
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
    var tally = GS.tallyMyPrizes(codes, groupSnapshots, "lidasNormas", viewerId);
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
        lidasNormas: totals.lidas,
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
      }, null, avatarPref);
    });
  }

  // Se a pessoa fechar a aba dentro da janela de espera do debounce (700ms),
  // grava agora em vez de perder a última marcação (ao menos localmente —
  // o envio ao Firestore, se der tempo, também é disparado).
  window.addEventListener("beforeunload", function () {
    if (publishTimer) { clearTimeout(publishTimer); doSync(); }
    if (groupSyncTimer) { clearTimeout(groupSyncTimer); pushProgressToGroups(); }
  });

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
    if (avatarPreview) avatarPreview.textContent = GS.avatarEmoji(avatarPref);
  }

  function onAvatarPrefChange() {
    avatarPref = {
      gender: avatarToggleGenderSelect ? avatarToggleGenderSelect.value : avatarPref.gender,
      tone: avatarToneSelect ? avatarToneSelect.value : avatarPref.tone
    };
    GS.writeAvatarPref(avatarPref, AVATAR_KEY);
    syncAvatarControls();
    render();
    if (!applyingRemote) { scheduleSync(); scheduleGroupSync(); }
  }

  if (avatarToggleGenderSelect) avatarToggleGenderSelect.addEventListener("change", onAvatarPrefChange);
  if (avatarToneSelect) avatarToneSelect.addEventListener("change", onAvatarPrefChange);
  syncAvatarControls();

  // ---- Vincular e-mail (opcional) -------------------------------------
  // Lógica compartilhada — ver conta-email.js (precisa estar incluído na
  // página ANTES deste script). Se faltar (ex.: template ainda não
  // atualizado), o painel de e-mail só fica inativo — o resto da página
  // continua funcionando normalmente.
  var contaEmail = window.ContaEmail
    ? window.ContaEmail.attach({ setNote: setNote, recoverHint: "Já ativei — entrar neste aparelho" })
    : { renderAccountUI: function () {} };
  var renderAccountUI = contaEmail.renderAccountUI;

  // ---- Controle do seletor de órgão ---------------------------------------
  if (orgaoSelect) {
    orgaoSelect.addEventListener("change", function () {
      currentOrg = orgaoSelect.value;
      render();
    });
  }

  // ---- Delegação de cliques (bonequinho) ---------------------------------
  function togglePanel(btn, panel) {
    if (!btn || !panel) return;
    var open = panel.hidden;
    panel.hidden = !open;
    btn.setAttribute("aria-expanded", open ? "true" : "false");
  }

  document.addEventListener("click", function (e) {
    var t = e.target.closest("#avatar-toggle");
    if (!t) return;
    togglePanel(t, document.getElementById("avatar-panel"));
  });

  // 1) pintura instantânea com o que já está salvo neste navegador
  applyMap(readLocal());
  render();

  // 2) login anônimo no Firebase (própria coleção "progress-normas")
  var progressUnsub = null;

  function bindUser(uid) {
    viewerId = uid;
    dbCap = firebase.firestore();
    progressDoc = dbCap.doc("progress-normas/" + viewerId);
    dbReady = true;
    if (progressUnsub) { progressUnsub(); progressUnsub = null; }
    progressUnsub = progressDoc.onSnapshot(function (snap) {
      if (!snap.exists) return;
      var data = snap.data();
      if (!data) return;
      applyingRemote = true;
      if (data.map) { applyMap(data.map); writeLocal(data.map); }
      if (data.avatar && GS.GENDER_BASE[data.avatar.gender] && GS.TONE_MOD[data.avatar.tone]) {
        avatarPref = { gender: data.avatar.gender, tone: data.avatar.tone };
        GS.writeAvatarPref(avatarPref, AVATAR_KEY);
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
  var src = document.currentScript && document.currentScript.src;
  if (!src) return;
  function go() {
    if (window.ContaGoogle || document.getElementById("conta-google-js")) return;
    if (!(window.firebase && window.DIARIO_FIREBASE_CONFIG)) return;
    var s = document.createElement("script");
    s.id = "conta-google-js";
    s.src = src.replace(/[^/]+\.js(\?.*)?$/, "conta-google.js$1");
    document.head.appendChild(s);
  }
  if (document.readyState === "complete") go(); else window.addEventListener("load", go);
})();
