
(function () {
  "use strict";

  // sumula: true = menciona súmula/verbete · false = não menciona · null = a confirmar
  // (dados carregados de diario-data.js, que roda antes deste arquivo)
  var LOCAL_KEY = "informativos-lidos";
  var listRoot = document.getElementById("list-root");
  var syncNote = document.getElementById("sync-note");
  var tabsRoot = document.getElementById("org-tabs");
  var ledeText = document.getElementById("lede-text");
  var footerSource = document.getElementById("footer-source");

  // Boneco personalizável: gênero + tom de pele (os únicos eixos que o
  // conjunto padrão de emoji varia). Padrão: mulher, tom "parda".
  var AVATAR_KEY = "informativos-avatar";
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

  function stfLink(row) {
    // Edições com página HTML publicada no site oficial (até a 999); a partir
    // da 1000 (inclusive as mais recentes) abrem o PDF oficial.
    return row.edicao < 1000
      ? "https://www.stf.jus.br/arquivo/informativo/documento/informativo" + row.edicao + ".htm"
      : "https://www.stf.jus.br/arquivo/cms/informativoSTF/anexo/Informativo_PDF/Informativo_stf_" + row.edicao + ".pdf";
  }

  var ORGS = {
    stf: {
      label: "STF", key: "stf", data: STF_DATA,
      lede: "Uma edição por semana, marcada conforme você lê. Cobre o histórico completo desde 1995.",
      linkFn: stfLink,
      footer: 'Fonte oficial: <a href="https://www.stf.jus.br/arquivo/informativo/documento/informativo1.htm" target="_blank" rel="noopener">stf.jus.br</a> — cobre as edições 1 a 1227 (1995 a 2026). O botão "Abrir" de cada linha leva à página oficial do STF: HTML para as edições 1 a 1224, PDF para as mais recentes.'
    },
    stj: {
      label: "STJ", key: "stj", data: STJ_DATA,
      lede: "Informativo de Jurisprudência do STJ, edição quinzenal. Cobre o histórico completo desde 1998.",
      linkFn: function (row) { return row.link; },
      footer: 'Fonte oficial: <a href="https://scon.stj.jus.br/jurisprudencia/externo/informativo/" target="_blank" rel="noopener">scon.stj.jus.br</a> — cobre as edições 1 a 900 (1998 a 2026). Súmulas conferidas apenas nas edições mais recentes; as demais aparecem como "a confirmar".'
    },
    tse: {
      label: "TSE", key: "tse", data: TSE_DATA,
      lede: "Infojur TSE, edição quinzenal. Cobre o histórico completo desde 1999.",
      linkFn: function (row) { return row.link; },
      footer: 'Fonte oficial: <a href="https://www.tse.jus.br/jurisprudencia/informativo-tse" target="_blank" rel="noopener">tse.jus.br</a> — cobre as edições de 1999 a 2026. A numeração reinicia a cada ano; datas exatas só estão disponíveis nas edições mais recentes (as demais mostram apenas o ano). Súmulas não verificadas — o site não traz ementas no índice.'
    },
    cnj: {
      label: "CNJ", key: "cnj", data: CNJ_DATA,
      lede: "Informativo de Jurisprudência do CNJ, edição periódica. Série atual iniciada em outubro de 2020.",
      linkFn: function (row) { return row.link; },
      footer: 'Fonte oficial: <a href="https://atos.cnj.jus.br/jurisprudencia" target="_blank" rel="noopener">atos.cnj.jus.br</a> — cobre as edições de 2020 a 2026 (série atual; uma série anterior, 2012-2014, foi descontinuada e não está incluída). A numeração reinicia a cada ano.'
    },
    tst: {
      label: "TST", key: "tst", data: TST_DATA,
      lede: "Informativo TST, edição periódica desde 2012. Cobre o histórico completo da série principal.",
      linkFn: function (row) { return row.link; },
      footer: 'Fonte oficial: <a href="https://juslaboris.tst.jus.br" target="_blank" rel="noopener">juslaboris.tst.jus.br</a> (repositório JusLaboris do TST) — cobre as edições 1 a 314 (2012 a 2026), série principal "Informativo TST" (não inclui o "Informativo TST Execução", uma série separada). O botão "Abrir" leva à página do item no repositório oficial. Súmulas não verificadas — o índice não traz as ementas.'
    },
    cnmp: {
      label: "CNMP", key: "cnmp", data: CNMP_DATA,
      lede: "Boletim da Sessão do CNMP (sucessor do antigo Informativo de Jurisprudência). Cobre desde 2017.",
      linkFn: function (row) { return row.link; },
      footer: 'Fonte oficial: <a href="https://www.cnmp.mp.br/portal/institucional/comissoes/comissao-de-acompanhamento-legislativo-e-jurisprudencia/jurisprudenciacalj/boletim-da-sessao" target="_blank" rel="noopener">cnmp.mp.br</a> — o CNMP descontinuou o "Informativo de Jurisprudência" (até 2019) e passou a publicar o "Boletim da Sessão", aqui tratado como equivalente; cobre de 2017 a 2026. Numeração contínua até 2022 (edições 1 a 89), reiniciada a cada ano a partir de 2023. Sessões canceladas (sem boletim) não entram na lista. Súmulas não verificadas — o índice não traz as ementas.'
    }
  };
  var ORG_ORDER = ["stf", "stj", "tse", "cnj", "tst", "cnmp"];
  var currentOrg = "stf";

  var stateByOrg = {};
  ORG_ORDER.forEach(function (key) {
    stateByOrg[key] = ORGS[key].data.map(function (d) {
      return { edicao: d.edicao, ano: d.ano, data: d.data, sumula: d.sumula, link: d.link, lida: false, lidaEm: null };
    });
  });

  var MONTHS = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
  function fmtDate(iso) {
    if (!iso) return "data não divulgada";
    var parts = iso.split("-");
    var d = parseInt(parts[2], 10);
    var m = MONTHS[parseInt(parts[1], 10) - 1];
    return d + " " + m + " " + parts[0];
  }

  function rowKey(orgKey, row) { return orgKey + ":" + row.ano + ":" + row.edicao; }

  // ISO-8601 week number (year, week) for a Date, computed in UTC.
  function isoWeekParts(date) {
    var d = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
    var day = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - day);
    var yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    var week = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
    return { year: d.getUTCFullYear(), week: week };
  }

  function parseIsoDate(iso) {
    if (!iso) return null;
    var parts = iso.split("-");
    if (parts.length !== 3) return null;
    var dt = new Date(Date.UTC(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10)));
    return isNaN(dt.getTime()) ? null : dt;
  }

  // A gold star requires both dates known and falling in the same ISO week.
  function isSameWeek(isoA, isoB) {
    var a = parseIsoDate(isoA);
    var b = parseIsoDate(isoB);
    if (!a || !b) return false;
    var wa = isoWeekParts(a);
    var wb = isoWeekParts(b);
    return wa.year === wb.year && wa.week === wb.week;
  }

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
          if (v && typeof v === "object") {
            row.lida = !!v.lida;
            row.lidaEm = v.lidaEm || null;
          } else {
            // legacy boolean format
            row.lida = !!v;
            row.lidaEm = null;
          }
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
      btn.innerHTML = ORGS[key].label + '<span class="count">' + stateByOrg[key].length + "</span>";
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
    ledeText.textContent = ORGS[currentOrg].lede;
    footerSource.innerHTML = ORGS[currentOrg].footer;

    var state = stateByOrg[currentOrg];
    var linkFn = ORGS[currentOrg].linkFn;

    var years = [];
    state.forEach(function (row) {
      if (years.indexOf(row.ano) === -1) years.push(row.ano);
    });

    listRoot.innerHTML = "";
    years.forEach(function (year) {
      var section = document.createElement("section");
      section.className = "year-group";

      var label = document.createElement("div");
      label.className = "year-label";
      label.textContent = year;
      section.appendChild(label);

      var ul = document.createElement("ul");
      ul.className = "list";

      state.filter(function (r) { return r.ano === year; }).forEach(function (row) {
        var li = document.createElement("li");
        li.className = "row" + (row.lida ? " is-read" : "");

        var checkWrap = document.createElement("div");
        checkWrap.className = "check-wrap";
        var input = document.createElement("input");
        input.type = "checkbox";
        input.className = "check-box";
        input.checked = row.lida;
        input.setAttribute("aria-label", "Marcar Informativo nº " + row.edicao + " como lido");
        input.addEventListener("change", function () { toggle(currentOrg, row.edicao, row.ano, input.checked); });
        checkWrap.appendChild(input);

        var edition = document.createElement("div");
        edition.className = "edition";
        var num = document.createElement("span");
        num.className = "num";
        num.textContent = "Nº " + row.edicao + "/" + row.ano;
        var date = document.createElement("span");
        date.className = "date";
        date.textContent = fmtDate(row.data);
        edition.appendChild(num);
        edition.appendChild(date);

        var badge = document.createElement("span");
        if (row.sumula === true) {
          badge.className = "badge sumula-sim";
          badge.textContent = "súmula";
        } else if (row.sumula === null) {
          badge.className = "badge sumula-confirmar";
          badge.textContent = "a confirmar";
        } else {
          badge.className = "badge sumula-none";
          badge.textContent = "—";
        }

        var star = document.createElement("span");
        if (row.lida) {
          var gold = isSameWeek(row.data, row.lidaEm);
          star.textContent = "📰";
          star.className = "star" + (gold ? " star-gold" : " star-normal");
          star.title = gold
            ? "Lido na semana de publicação"
            : "Lido";
        } else {
          star.textContent = "🗞️";
          star.className = "star star-empty";
          star.title = "Ainda não lido";
        }

        var link = document.createElement("a");
        link.className = "open-link";
        link.href = linkFn(row);
        link.target = "_blank";
        link.rel = "noopener";
        link.setAttribute("aria-label", "Abrir o Informativo nº " + row.edicao + " no site do " + ORGS[currentOrg].label);
        link.title = "Abrir no site do " + ORGS[currentOrg].label;
        link.textContent = "Abrir";

        li.appendChild(checkWrap);
        li.appendChild(edition);
        li.appendChild(badge);
        li.appendChild(star);
        li.appendChild(link);
        ul.appendChild(li);
      });

      section.appendChild(ul);
      listRoot.appendChild(section);
    });

    var total = state.length;
    var lidas = state.filter(function (r) { return r.lida; }).length;
    var estrelasOuro = state.filter(function (r) { return r.lida && isSameWeek(r.data, r.lidaEm); }).length;
    document.getElementById("stat-count").textContent = lidas;
    document.getElementById("stat-total").textContent = total;
    document.getElementById("stat-pct").textContent = total ? Math.round((lidas / total) * 100) + "%" : "0%";
    document.getElementById("progress-fill").style.width = (total ? (lidas / total) * 100 : 0) + "%";
    var starLine = document.getElementById("stat-stars");
    if (starLine) {
      starLine.textContent = lidas
        ? avatarEmoji(avatarPref) + " " + lidas + " juiz" + (lidas === 1 ? "" : "es") + " (" + estrelasOuro + " dourado" + (estrelasOuro === 1 ? "" : "s") + ")"
        : "";
    }
  }

  // Identidade do visitante: vem do login anônimo do Firebase (nenhum
  // cadastro visível — a pessoa só digita um nome). Fica null até o
  // Firebase confirmar o login, lá no fim deste arquivo.
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

  function toggle(orgKey, edicao, ano, value) {
    var row = stateByOrg[orgKey].find(function (r) { return r.edicao === edicao && r.ano === ano; });
    if (!row) return;
    row.lida = value;
    row.lidaEm = value ? todayIso() : null;
    render();
    if (!applyingRemote) {
      scheduleSync();
      scheduleGroupSync();
    }
  }

  // ---- Estudo coletivo -----------------------------------------------
  // A "group" is a shared db document (groups/<code>) plus one member
  // sub-document per participant (groups/<code>/members/<viewerId>) that
  // stores only that person's display name, current counts and avatar —
  // never their individual reading list. Everyone subscribed to the same
  // code sees every member's counts update live.
  var GROUP_KEY = "informativos-grupo";
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

  // Legacy groupPref values (saved before per-member ordering existed)
  // may lack joinedAt — backfill it once so the join order stays stable
  // across future writes instead of drifting on every update.
  (function ensureJoinedAt() {
    if (groupPref && !groupPref.joinedAt) {
      groupPref.joinedAt = new Date().toISOString();
      writeGroupPref(groupPref);
    }
  })();

  function computeTotals() {
    var lidas = 0, estrelasOuro = 0;
    ORG_ORDER.forEach(function (orgKey) {
      stateByOrg[orgKey].forEach(function (r) {
        if (r.lida) {
          lidas++;
          if (isSameWeek(r.data, r.lidaEm)) estrelasOuro++;
        }
      });
    });
    return { lidas: lidas, estrelasOuro: estrelasOuro };
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
    // merge: true — este membro pode já ter um documento com o campo
    // lidasLeis (Diário das Leis, mesmo grupo); não apagamos esse campo.
    ref.set({
      name: groupPref.name,
      lidas: totals.lidas,
      estrelasOuro: totals.estrelasOuro,
      avatar: avatarPref,
      joinedAt: groupPref.joinedAt,
      updatedAt: new Date().toISOString()
    }, { merge: true }).catch(function () { /* best-effort */ });
  }

  // Reads who created the group so the leaderboard can always list that
  // person first, with everyone else below in the order they joined.
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
        lidas: data.lidas,
        estrelasOuro: data.estrelasOuro,
        avatar: data.avatar,
        joinedAt: data.joinedAt || ""
      };
    }).filter(function (m) { return m && m.name; });
    // O criador do grupo sempre aparece primeiro; os demais, abaixo, na
    // ordem em que entraram (quem "vence" continua destacado com o brilho
    // dourado, mas a posição na lista não muda por causa disso).
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
      countEl.textContent = count + (count === 1 ? " lido" : " lidos");

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
      function () { /* subscription lost; leaderboard just stops updating */ }
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

  // Os botões abaixo (e os de personalizar boneco / vincular e-mail, mais
  // adiante) NÃO recebem addEventListener direto: em algumas renderizações
  // do Blogger, o bloco de HTML de um botão pode terminar de ser inserido
  // no DOM depois deste script já ter tentado se conectar a ele — nesse
  // caso getElementById() já teria retornado o elemento certo, mas o
  // clique simplesmente não fazia nada. A delegação de clique no final
  // deste arquivo (ver "Delegação de cliques") resolve isso de forma
  // definitiva, então as linhas de addEventListener direto foram removidas
  // daqui.

  // Pre-fill the code field from an invite link (?grupo=CODE), and open
  // the panel so a new visitor sees it right away.
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
    if (!applyingRemote) {
      scheduleSync();
      scheduleGroupSync();
    }
  }

  if (avatarToggleGenderSelect) avatarToggleGenderSelect.addEventListener("change", onAvatarPrefChange);
  if (avatarToneSelect) avatarToneSelect.addEventListener("change", onAvatarPrefChange);

  syncAvatarControls();

  // ---- Vincular e-mail (opcional) -------------------------------------
  // A conta anônima do Firebase só existe no armazenamento deste
  // navegador: se ele for limpo, ou a pessoa usar outro computador, um
  // UID novo é criado e o progresso antigo fica inacessível. Vincular um
  // e-mail + senha à conta anônima (linkWithCredential) resolve isso sem
  // exigir cadastro de ninguém que não queira: quem nunca clicar aqui
  // continua exatamente como antes, só com o nome/anônimo.
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
  // botão. Isso evita depender da ordem/tempo exato em que o Blogger
  // termina de inserir cada bloco de HTML no DOM: o listener é preso ao
  // documento (que sempre existe) e só procura o botão na hora do clique,
  // não na hora em que o script carrega.
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

  // 1) instant paint from whatever this browser has locally
  applyMap(readLocal());
  render();

  // 2) login anônimo no Firebase (nenhum cadastro visível para a pessoa,
  // a menos que ela mesma escolha vincular um e-mail acima), depois
  // reconcilia com o progresso salvo dela e liga a escuta em tempo real.
  // O documento de cada visitante vive em progress/<uid> — ninguém mais lê
  // ou escreve nele, e o Firestore garante isso pelas regras de segurança
  // do projeto. bindUser() é chamada de novo sempre que o UID muda (por
  // exemplo, quando a pessoa usa "Já vinculei — recuperar aqui" e o
  // Firebase troca da conta anônima para a conta vinculada antiga).
  var progressUnsub = null;

  function bindUser(uid) {
    viewerId = uid;
    dbCap = firebase.firestore();
    progressDoc = dbCap.doc("progress/" + viewerId);
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
    }, function () {
      // assinatura perdida; local + gravações "melhor esforço" continuam
    });
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
