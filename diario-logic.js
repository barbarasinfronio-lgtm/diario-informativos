
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

  // Base comum do "Estudo coletivo" (grupos, ranking, boneco/avatar) —
  // grupos-shared.js roda antes deste arquivo em toda página de diário.
  var GS = window.GruposShared;

  // Boneco personalizável: gênero + tom de pele. Cada diário guarda sua
  // própria preferência (chave própria), mas o desenho do boneco em si
  // (emoji, validação, leitura/gravação) é compartilhado — ver
  // grupos-shared.js.
  var AVATAR_KEY = "informativos-avatar";
  var avatarPref = GS.readAvatarPref(AVATAR_KEY);

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
        ? GS.avatarEmoji(avatarPref) + " " + lidas + " juiz" + (lidas === 1 ? "" : "es") + " (" + estrelasOuro + " dourado" + (estrelasOuro === 1 ? "" : "s") + ")"
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

  // ---- Estudo coletivo (multi-grupo) -----------------------------------
  // Cada grupo é um documento compartilhado (groups/<code>) com um
  // sub-documento por participante (groups/<code>/members/<viewerId>).
  // O MESMO código de grupo vale em todos os diários (Informativos, Leis,
  // Súmulas) — aqui só mantemos o campo "lidas" deste diário atualizado
  // no documento do membro, em cada grupo que a pessoa participa, e
  // mostramos um resumo PESSOAL (nunca os nomes dos outros membros): em
  // quantos desses grupos a pessoa está em 1º/2º/3º lugar. A lista
  // completa, grupo a grupo, com todo mundo, fica só em "Meus Grupos de
  // Estudo" — e lá, cada pessoa só vê os grupos dela mesma. Criar, entrar
  // ou sair de um grupo também acontece só lá (grupos-shared.js cuida do
  // armazenamento local e da comunicação com o Firebase).
  var HUB_URL = "https://www.estudamana.com.br/p/meus-grupos-de-estudo.html";
  var myPrizesEl = document.getElementById("my-prizes");
  var groupUnsubs = {};      // code -> função de cancelar a inscrição
  var groupSnapshots = {};   // code -> último snapshot de members
  var groupSyncTimer = null;

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

  function renderMyPrizes() {
    if (!myPrizesEl || !GS) return;
    var codes = GS.readGroups().map(function (g) { return g.code; });
    var tally = GS.tallyMyPrizes(codes, groupSnapshots, "lidas", viewerId);
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
        lidas: totals.lidas,
        estrelasOuro: totals.estrelasOuro,
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
    if (!applyingRemote) {
      scheduleSync();
      scheduleGroupSync();
    }
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
    var t = e.target.closest("#avatar-toggle");
    if (!t) return;
    togglePanel(t, document.getElementById("avatar-panel"));
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
      if (data.avatar && GS.GENDER_BASE[data.avatar.gender] && GS.TONE_MOD[data.avatar.tone]) {
        avatarPref = { gender: data.avatar.gender, tone: data.avatar.tone };
        GS.writeAvatarPref(avatarPref, AVATAR_KEY);
        syncAvatarControls();
      }
      render();
      applyingRemote = false;
    }, function () {
      // assinatura perdida; local + gravações "melhor esforço" continuam
    });
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
  // document.currentScript some vezes já não está mais disponível quando este
  // bloco roda (script assíncrono, widget do Blogger etc.) — por isso varremos
  // as tags <script> da página em vez de depender só dele.
  var all0 = document.getElementsByTagName("script"), src = "";
  for (var i = 0; i < all0.length; i++) {
    if (/diario-logic\.js/.test(all0[i].src)) { src = all0[i].src; break; }
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
