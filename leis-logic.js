
(function () {
  "use strict";

  // (dados carregados de leis-data.js, que roda antes deste arquivo)
  var LOCAL_KEY = "leis-lidas";
  var listRoot = document.getElementById("list-root");
  var syncNote = document.getElementById("sync-note");
  var tabsRoot = document.getElementById("org-tabs");
  var ledeText = document.getElementById("lede-text");
  var footerSource = document.getElementById("footer-source");

  // Base comum do "Estudo coletivo" (grupos, ranking, boneco/avatar) —
  // grupos-shared.js roda antes deste arquivo em toda página de diário.
  var GS = window.GruposShared;

  // Boneco personalizável — mesmo esquema do Diário dos Informativos
  // (grupos-shared.js), guardado sob uma chave própria para não
  // interferir na outra página.
  var AVATAR_KEY = "leis-avatar";
  var avatarPref = GS.readAvatarPref(AVATAR_KEY);

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

  // ---- Edital principal ---------------------------------------------------
  // O edital escolhido (página "Editais") filtra as leis mostradas aqui. O
  // código do edital fica em editais-shared.js (salvo no navegador e na conta).
  var FILTER_KEY = "leis-filtro"; // "edital" | "todas"
  var ES = null;                  // EditaisShared, quando carregado
  var filterMode = "edital";
  try { if (localStorage.getItem(FILTER_KEY) === "todas") filterMode = "todas"; } catch (e) {}
  var EDITAIS_URL = "https://www.estudamana.com.br/p/editais.html";
  var editPanelOpen = false;

  // Legislação estadual/municipal específica de um edital fica de fora por
  // padrão (a maioria das leis de um edital já é nacional/comum a todos) —
  // a pessoa liga isso explicitamente se quiser ver também a parte local.
  var LOCAL_KEY_PREF = "leis-incluir-local";
  var includeLocal = false;
  try { includeLocal = localStorage.getItem(LOCAL_KEY_PREF) === "sim"; } catch (e) {}

  function activeEdital() { return ES && ES.principal ? ES.principal() : null; }

  function lawKeyOpts() { return { includeLocal: includeLocal }; }

  // chaves das leis do edital, ou null quando não há filtro ativo
  function activeKeys() {
    var ed = activeEdital();
    return ed && filterMode === "edital" ? ES.lawKeys(ed, lawKeyOpts()) : null;
  }

  function orgRows(orgKey, keys) {
    var rows = stateByOrg[orgKey];
    if (!keys) return rows;
    return rows.filter(function (r) { return keys[rowKey(orgKey, r)]; });
  }

  function visibleOrgs(keys) {
    if (!keys) return ORG_ORDER;
    return ORG_ORDER.filter(function (k) { return orgRows(k, keys).length > 0; });
  }

  function editalTotals(ed) {
    var keys = ES.lawKeys(ed, lawKeyOpts()), total = 0, lidas = 0;
    ORG_ORDER.forEach(function (k) {
      stateByOrg[k].forEach(function (r) {
        if (keys[rowKey(k, r)]) { total++; if (r.lida) lidas++; }
      });
    });
    return { total: total, lidas: lidas };
  }

  function escapeHtml(t) {
    return String(t).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }

  function renderEditalBar() {
    if (!ES || !tabsRoot || !ES.data().length) return;
    var bar = document.getElementById("edital-bar");
    if (!bar) {
      bar = document.createElement("div");
      bar.id = "edital-bar";
      bar.className = "edital-bar";
      tabsRoot.parentNode.insertBefore(bar, tabsRoot);
    }
    var ed = activeEdital();
    function optionsFor(grupo) {
      return ES.data().filter(function (e) {
        if (e.emBreve) return false;
        var g = (e.tipo || "edital") === "carreira" ? (e.secao === "exame" ? "exame" : "carreira") : "edital";
        return g === grupo;
      }).map(function (e) {
        return '<option value="' + e.id + '"' + (ed && ed.id === e.id ? " selected" : "") + ">" +
          escapeHtml(grupo === "edital" ? e.sigla + " — " + e.titulo : e.titulo) + "</option>";
      }).join("");
    }
    var options = '<optgroup label="Por carreira (todos os editais do cargo)">' + optionsFor("carreira") + "</optgroup>" +
      '<optgroup label="Exames nacionais">' + optionsFor("exame") + "</optgroup>" +
      '<optgroup label="Por edital">' + optionsFor("edital") + "</optgroup>";
    var isCar = ed && ed.tipo === "carreira";
    var isExame = isCar && ed.secao === "exame";
    var kw = isExame ? "exame" : (isCar ? "carreira" : "edital");
    var kind = kw.charAt(0).toUpperCase() + kw.slice(1);
    var picker =
      '<div class="edital-picker" id="edital-picker"' + ((ed && !editPanelOpen) ? " hidden" : "") + ">" +
      '<label class="edital-picker-label" for="edital-select">' + (ed ? "Escolha o novo edital, carreira ou exame principal" : "Escolha o seu edital, carreira ou exame") + "</label>" +
      '<div class="edital-picker-row">' +
      '<select id="edital-select" class="edital-select">' + (ed ? "" : '<option value="">Selecione…</option>') + options + "</select>" +
      '<button type="button" class="edital-btn edital-btn-primary" id="edital-save">' + (ed ? "Salvar" : "Definir como principal") + "</button>" +
      (ed ? '<button type="button" class="edital-btn" id="edital-cancel">Cancelar</button>' : "") +
      "</div></div>";

    if (!ed) {
      bar.innerHTML =
        '<p class="edital-empty">🎯 Escolha o seu edital — ou a carreira inteira — e o Diário passa a mostrar só as leis dele. ' +
        '<a href="' + EDITAIS_URL + '">Ver os editais</a></p>' + picker;
      return;
    }
    var t = editalTotals(ed);
    var allCount = 0;
    ORG_ORDER.forEach(function (k) { allCount += stateByOrg[k].length; });
    var showLocalToggle = !isCar && ES.hasLocalNormas(ed);
    bar.innerHTML =
      '<div class="edital-head">' +
      '<div class="edital-title"><span class="edital-kicker">' + kind + ' principal</span>' +
      (isCar ? '<strong>' + escapeHtml(ed.titulo) + '</strong> <span>' + escapeHtml(ed.cargo) + "</span>"
             : '<strong>' + escapeHtml(ed.sigla) + '</strong> <span>' + escapeHtml(ed.titulo) + " · " + escapeHtml(ed.cargo) + "</span>") + "</div>" +
      '<button type="button" class="edital-btn" id="edital-change" aria-expanded="' + (editPanelOpen ? "true" : "false") + '">Alterar ' + kw + ' principal</button>' +
      "</div>" + picker +
      '<div class="edital-modes" role="group" aria-label="Quais leis mostrar">' +
      '<button type="button" class="edital-mode' + (filterMode === "edital" ? " active" : "") + '" data-mode="edital">' + (isExame ? "Leis do meu exame" : (isCar ? "Leis da minha carreira" : "Leis do meu edital")) + ' <span class="count">' + t.total + "</span></button>" +
      '<button type="button" class="edital-mode' + (filterMode === "todas" ? " active" : "") + '" data-mode="todas">Todas as leis <span class="count">' + allCount + "</span></button>" +
      "</div>" +
      (showLocalToggle
        ? '<label class="edital-local-toggle"><input type="checkbox" id="edital-local-check"' + (includeLocal ? " checked" : "") + '> Incluir legislação estadual/local específica desse edital</label>'
        : "") +
      '<p class="edital-progress">' + t.lidas + " de " + t.total + (isExame ? " leis do exame lidas" : (isCar ? " leis da carreira lidas" : " leis do edital lidas")) +
      (ed.extras && ed.extras.length ? ' · <a href="' + EDITAIS_URL + '">' + ed.extras.length + " normas do edital fora deste índice</a>" : "") + "</p>";
  }

  document.addEventListener("click", function (e) {
    var t = e.target.closest("#edital-change, #edital-cancel, #edital-save, .edital-mode, #edital-local-check");
    if (!t || !ES) return;
    if (t.id === "edital-change") { editPanelOpen = !editPanelOpen; renderEditalBar(); return; }
    if (t.id === "edital-cancel") { editPanelOpen = false; renderEditalBar(); return; }
    if (t.id === "edital-save") {
      var sel = document.getElementById("edital-select");
      if (sel && sel.value) { editPanelOpen = false; ES.setPrincipal(sel.value); }
      return;
    }
    if (t.id === "edital-local-check") {
      includeLocal = t.checked;
      try { localStorage.setItem(LOCAL_KEY_PREF, includeLocal ? "sim" : "não"); } catch (err) {}
      render();
      return;
    }
    if (t.classList.contains("edital-mode")) {
      filterMode = t.getAttribute("data-mode") === "todas" ? "todas" : "edital";
      try { localStorage.setItem(FILTER_KEY, filterMode); } catch (err) {}
      render();
    }
  });

  function renderTabs() {
    tabsRoot.innerHTML = "";
    var keys = activeKeys();
    var orgs = visibleOrgs(keys);
    if (orgs.indexOf(currentOrg) === -1) currentOrg = orgs[0] || ORG_ORDER[0];
    orgs.forEach(function (key) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "org-tab" + (key === currentOrg ? " active" : "");
      btn.setAttribute("role", "tab");
      btn.setAttribute("aria-selected", key === currentOrg ? "true" : "false");
      btn.innerHTML = LEIS_DATA[key].label + '<span class="count">' + orgRows(key, keys).length + "</span>";
      btn.addEventListener("click", function () {
        if (currentOrg === key) return;
        currentOrg = key;
        render();
      });
      tabsRoot.appendChild(btn);
    });
  }

  function render() {
    renderEditalBar();
    renderTabs();
    var edNow = activeEdital();
    ledeText.textContent = (edNow && filterMode === "edital")
      ? (edNow.tipo === "carreira"
          ? (edNow.secao === "exame" ? "Leis do conteúdo programático do exame " + edNow.titulo + ". Marque conforme for lendo." : "Leis do conteúdo programático de todos os editais da carreira " + edNow.titulo + " (" + edNow.cargo.replace("união dos editais: ", "") + "). Marque conforme for lendo.")
          : "Leis do conteúdo programático do edital " + edNow.sigla + " (" + edNow.titulo + "). Marque conforme for lendo.")
      : "Leis citadas no conteúdo programático dos editais mapeados (magistratura, Ministério Público e advocacia pública). Marque conforme for lendo.";
    footerSource.innerHTML = 'Índice montado a partir do conteúdo programático dos editais mapeados. Os links levam ao site oficial (Planalto ou portal do respectivo estado) — se algum link estiver quebrado ou desatualizado, avise para correção.';

    var state = orgRows(currentOrg, activeKeys());

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
        ? GS.avatarEmoji(avatarPref) + " " + lidas + " le" + (lidas === 1 ? "i" : "is")
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
    progressDoc.set({ map: map, avatar: avatarPref, updatedAt: new Date().toISOString() }, { merge: true })
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

  // ---- Estudo coletivo (multi-grupo) -----------------------------------
  // O MESMO código de grupo vale em todos os diários (Informativos, Leis,
  // Súmulas) — aqui só mantemos o campo "lidasLeis" deste diário
  // atualizado no documento do membro, em cada grupo que a pessoa
  // participa, e mostramos um resumo PESSOAL (nunca os nomes dos outros
  // membros): em quantos desses grupos a pessoa está em 1º/2º/3º lugar.
  // A lista completa, grupo a grupo, com todo mundo, fica só em "Meus
  // Grupos de Estudo" — e lá, cada pessoa só vê os grupos dela mesma.
  // Criar, entrar ou sair de um grupo também acontece só lá
  // (grupos-shared.js cuida do armazenamento local e da comunicação com
  // o Firebase).
  var HUB_URL = "https://www.estudamana.com.br/p/meus-grupos-de-estudo.html";
  var myPrizesEl = document.getElementById("my-prizes");
  var groupUnsubs = {};      // code -> função de cancelar a inscrição
  var groupSnapshots = {};   // code -> último snapshot de members
  var groupSyncTimer = null;

  function computeTotals() {
    var lidas = 0;
    ORG_ORDER.forEach(function (orgKey) {
      stateByOrg[orgKey].forEach(function (r) { if (r.lida) lidas++; });
    });
    return { lidas: lidas };
  }

  function renderMyPrizes() {
    if (!myPrizesEl || !GS) return;
    var codes = GS.readGroups().map(function (g) { return g.code; });
    var tally = GS.tallyMyPrizes(codes, groupSnapshots, "lidasLeis", viewerId);
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
        lidasLeis: totals.lidas,
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
    if (!applyingRemote) scheduleSync();
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
    ? window.ContaEmail.attach({ setNote: setNote, recoverHint: "Já vinculei — recuperar aqui" })
    : { renderAccountUI: function () {} };
  var renderAccountUI = contaEmail.renderAccountUI;

  // ---- Delegação de cliques (bonequinho) --------------------------------
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
    var t = e.target.closest("#avatar-toggle");
    if (!t) return;
    togglePanel(t, document.getElementById("avatar-panel"));
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

  // Edital principal: carrega editais-shared.js da mesma pasta deste script
  // (nenhuma mudança no HTML da página é necessária).
  (function loadEditais() {
    var me = document.currentScript;
    if (!me) {
      var all = document.getElementsByTagName("script");
      for (var i = 0; i < all.length; i++) {
        if (/leis-logic\.js/.test(all[i].src)) { me = all[i]; break; }
      }
    }
    if (!me || !me.src) return;
    var url = me.src.replace(/leis-logic\.js(\?.*)?$/, "editais-shared.js$1");
    var tag = document.createElement("script");
    tag.src = url;
    tag.onload = function () {
      if (!window.EditaisShared) return;
      window.EditaisShared.load(function (shared) {
        ES = shared;
        ES.onChange(function () { render(); });
        render();
        ES.bindCloud({ signIn: false });
      });
    };
    document.head.appendChild(tag);
  })();

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
  // document.currentScript some vezes já não está mais disponível quando este
  // bloco roda (script assíncrono, widget do Blogger etc.) — por isso varremos
  // as tags <script> da página em vez de depender só dele.
  var all0 = document.getElementsByTagName("script"), src = "";
  for (var i = 0; i < all0.length; i++) {
    if (/leis-logic\.js/.test(all0[i].src)) { src = all0[i].src; break; }
  }
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
