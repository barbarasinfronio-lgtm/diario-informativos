(function () {
  "use strict";

  // "Meus Grupos de Estudo" — página central para criar, entrar e sair de
  // grupos (uma pessoa pode estar em vários ao mesmo tempo), e para ver o
  // desempenho individualizado em cada um, por diário. Cada diário
  // (Informativos, Leis, Súmulas) grava seu próprio campo no documento do
  // membro; aqui só lemos esses campos — quem soma é sempre o próprio
  // diário, na hora em que a pessoa marca uma leitura.
  var GS = window.GruposShared;

  // Garante o app do Firebase inicializado ANTES de qualquer leitura (a
  // primeira renderAllCards(), mais abaixo, já tenta assinar os membros dos
  // grupos salvos localmente). Sem isso, essa primeira tentativa lança
  // "No Firebase App" de forma síncrona e interrompe o resto deste arquivo
  // — inclusive o GS.onViewerReady() que inicializaria tudo certinho depois.
  if (GS) GS.ensureFirebaseApp();

  var METRICS = [
    { key: "total", label: "Pontuação geral (todos os diários + bônus de pontualidade)", unit: "pts" },
    { key: "lidas", label: "Diário dos Informativos" },
    { key: "lidasLeis", label: "Diário das Leis" },
    { key: "lidasSumulas", label: "Diário das Súmulas" },
    { key: "lidasDecisoes", label: "Diário das Decisões" },
    { key: "lidasNormas", label: "Diário das Resoluções" }
  ];

  var listRoot = document.getElementById("groups-list");
  var emptyEl = document.getElementById("groups-empty");
  var createNameInput = document.getElementById("create-group-name");
  var createYouInput = document.getElementById("create-you-name");
  var createBtn = document.getElementById("create-group-btn");
  var joinCodeInput = document.getElementById("join-group-code");
  var joinYouInput = document.getElementById("join-you-name");
  var joinBtn = document.getElementById("join-group-btn");
  var formError = document.getElementById("groups-form-error");
  var noteEl = document.getElementById("groups-note");

  function setNote(text) {
    if (noteEl) noteEl.textContent = text || " ";
  }

  function showError(msg) {
    if (!formError) return;
    formError.textContent = msg;
    formError.hidden = !msg;
  }

  var viewerId = null;
  var unsubs = {};     // code -> unsubscribe
  var snapshots = {};  // code -> último snapshot de members

  function currentGroups() {
    return GS.readGroups();
  }

  function renderEmptyState() {
    var groups = currentGroups();
    if (emptyEl) emptyEl.hidden = groups.length > 0;
    if (listRoot) listRoot.hidden = groups.length === 0;
  }

  function renderGroupCard(g) {
    var snap = snapshots[g.code];
    var card = document.getElementById("group-card-" + g.code);
    if (!card) {
      card = document.createElement("div");
      card.className = "group-card";
      card.id = "group-card-" + g.code;
      listRoot.appendChild(card);
    }

    var meta = (snap && snap.__meta) || {};
    var title = meta.name || g.name || ("Grupo " + g.code);

    var html = '';
    html += '<div class="group-card-head">';
    html += '  <h2 class="group-card-title">' + escapeHtml(title) + '</h2>';
    html += '  <span class="group-card-code">Código: ' + escapeHtml(g.code) + '</span>';
    html += '</div>';
    html += '<div class="group-card-actions">';
    html += '  <button type="button" class="group-btn" data-action="copy" data-code="' + g.code + '">Copiar link de convite</button>';
    html += '  <button type="button" class="group-btn group-btn-ghost" data-action="leave" data-code="' + g.code + '">Sair do grupo</button>';
    html += '</div>';

    if (!snap) {
      html += '<p class="group-note">Carregando…</p>';
    } else {
      var members = snap.docs.map(function (d) {
        var data = d.data() || {};
        return { id: d.id, name: data.name, avatar: data.avatar, joinedAt: data.joinedAt || "", raw: data };
      }).filter(function (m) { return m && m.name; });

      METRICS.forEach(function (metric) {
        var ranked = members.slice().sort(function (a, b) {
          var av = GS.memberValue(a.raw, metric.key), bv = GS.memberValue(b.raw, metric.key);
          if (bv !== av) return bv - av;
          if (a.joinedAt !== b.joinedAt) return a.joinedAt < b.joinedAt ? -1 : 1;
          return (a.name || "").localeCompare(b.name || "");
        });
        var anyValue = ranked.some(function (m) { return GS.memberValue(m.raw, metric.key) > 0; });

        html += '<div class="group-metric-block">';
        html += '  <p class="group-metric-label">' + escapeHtml(metric.label) + '</p>';
        if (!ranked.length) {
          html += '  <p class="rank-empty">Ninguém no grupo ainda.</p>';
        } else if (!anyValue) {
          html += '  <p class="rank-empty">Ninguém do grupo leu por aqui ainda.</p>';
        } else {
          html += '  <ol class="rank-list">';
          ranked.forEach(function (m, i) {
            var value = GS.memberValue(m.raw, metric.key);
            var isMe = m.id === viewerId;
            var pref = GS.validAvatar(m.avatar);
            html += '<li class="rank-item' + (i < 3 ? ' rank-top3' : '') + (isMe ? ' group-me' : '') + '">';
            html += '  <span class="rank-pos">' + (i < 3 ? GS.MEDALS[i] : String(i + 1)) + '</span>';
            html += '  <span class="rank-avatar">' + GS.avatarEmoji(pref) + '</span>';
            html += '  <span class="rank-name">' + escapeHtml(m.name) + (isMe ? ' (você)' : '') + '</span>';
            html += '  <span class="rank-count">' + value + (metric.unit ? ' ' + metric.unit : (value === 1 ? ' lido' : ' lidos')) + '</span>';
            html += '</li>';
          });
          html += '  </ol>';
        }
        html += '</div>';
      });
    }

    card.innerHTML = html;
  }

  function escapeHtml(s) {
    return (s || "").replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function subscribeCard(g) {
    if (unsubs[g.code]) return;
    unsubs[g.code] = GS.subscribeMembers(g.code, function (snap) {
      snapshots[g.code] = snap;
      renderGroupCard(g);
    }, function () {
      // assinatura perdida; deixa o card como estava
    });
    // também busca o nome oficial do grupo (groups/<code>.name), caso
    // tenha sido criado com um nome diferente do que está salvo localmente
    GS.fetchGroupMeta(g.code).then(function (meta) {
      if (meta && meta.name && snapshots[g.code]) {
        snapshots[g.code].__meta = meta;
        renderGroupCard(g);
      }
    }).catch(function () {});
  }

  function renderAllCards() {
    var groups = currentGroups();
    renderEmptyState();
    // remove cards de grupos que não existem mais na lista
    Array.prototype.slice.call(listRoot ? listRoot.children : []).forEach(function (child) {
      var code = child.id.replace("group-card-", "");
      if (!groups.some(function (g) { return g.code === code; })) {
        if (unsubs[code]) { unsubs[code](); delete unsubs[code]; }
        delete snapshots[code];
        child.remove();
      }
    });
    groups.forEach(function (g) {
      renderGroupCard(g);
      subscribeCard(g);
    });
  }

  function createGroup() {
    showError("");
    var groupName = createNameInput ? createNameInput.value.trim() : "";
    var yourName = createYouInput ? createYouInput.value.trim() : "";
    if (!groupName) { showError("Dê um nome para o grupo (ex: “Turma TJCE 2026”)."); return; }
    if (!yourName) { showError("Informe seu nome nesse grupo."); return; }
    if (!viewerId) { showError("Ainda carregando — aguarde um instante e tente de novo."); return; }
    var code = GS.genGroupCode();
    GS.createGroupDoc(code, groupName, viewerId).then(function () {
      var pref = { code: code, name: yourName, joinedAt: new Date().toISOString() };
      GS.addGroup(pref);
      GS.updateMember(code, viewerId, { name: yourName, avatar: GS.readAvatarPref(), joinedAt: pref.joinedAt }).catch(function () {});
      if (createNameInput) createNameInput.value = "";
      if (createYouInput) createYouInput.value = "";
      setNote("Grupo criado — convide alguém com o código " + code + ".");
      setTimeout(function () { setNote(""); }, 3000);
      renderAllCards();
    }).catch(function () { showError("Não foi possível criar o grupo agora. Tente de novo."); });
  }

  function joinGroup() {
    showError("");
    var code = joinCodeInput ? joinCodeInput.value.trim().toUpperCase() : "";
    var yourName = joinYouInput ? joinYouInput.value.trim() : "";
    if (!code) { showError("Informe o código do grupo."); return; }
    if (!yourName) { showError("Informe seu nome nesse grupo."); return; }
    if (!viewerId) { showError("Ainda carregando — aguarde um instante e tente de novo."); return; }
    if (GS.findGroup(code)) { showError("Você já está nesse grupo."); return; }
    GS.fetchGroupMeta(code).then(function (meta) {
      if (!meta) { showError("Código não encontrado — confira com quem te convidou."); return; }
      var pref = { code: code, name: yourName, joinedAt: new Date().toISOString() };
      GS.addGroup(pref);
      GS.updateMember(code, viewerId, { name: yourName, avatar: GS.readAvatarPref(), joinedAt: pref.joinedAt }).catch(function () {});
      if (joinCodeInput) joinCodeInput.value = "";
      if (joinYouInput) joinYouInput.value = "";
      setNote("Você entrou no grupo!");
      setTimeout(function () { setNote(""); }, 2400);
      renderAllCards();
    }).catch(function () { showError("Não foi possível entrar agora. Tente de novo."); });
  }

  function leaveGroup(code) {
    if (unsubs[code]) { unsubs[code](); delete unsubs[code]; }
    delete snapshots[code];
    if (viewerId) GS.deleteMember(code, viewerId).catch(function () {});
    GS.removeGroup(code);
    renderAllCards();
  }

  function copyInvite(code) {
    var url = location.origin + location.pathname + "?grupo=" + code;
    var done = function () { setNote("Link copiado — envie para quem você quer convidar."); setTimeout(function () { setNote(""); }, 2400); };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url).then(done).catch(function () { window.prompt("Copie o link do convite:", url); });
    } else {
      window.prompt("Copie o link do convite:", url);
    }
  }

  document.addEventListener("click", function (e) {
    var createT = e.target.closest("#create-group-btn");
    if (createT) { createGroup(); return; }
    var joinT = e.target.closest("#join-group-btn");
    if (joinT) { joinGroup(); return; }
    var actionT = e.target.closest("[data-action]");
    if (actionT) {
      var code = actionT.getAttribute("data-code");
      if (actionT.getAttribute("data-action") === "leave") leaveGroup(code);
      if (actionT.getAttribute("data-action") === "copy") copyInvite(code);
    }
  });

  // Pré-preenche o código de convite (?grupo=CODE) vindo de um link
  // compartilhado por outra pessoa do grupo.
  (function prefillInviteCode() {
    try {
      var params = new URLSearchParams(location.search);
      var invited = params.get("grupo");
      if (invited && joinCodeInput) joinCodeInput.value = invited.toUpperCase();
    } catch (e) {}
  })();

  renderAllCards();

  if (GS) {
    GS.onViewerReady(function (uid) {
      viewerId = uid;
      renderAllCards();
    });
  } else {
    showError("Não foi possível carregar. Recarregue a página em instantes.");
  }
})();
