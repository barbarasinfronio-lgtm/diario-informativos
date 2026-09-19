/*
 * grupos-shared.js — base comum do "Estudo coletivo", usada por todas as
 * páginas (Diário dos Informativos, Diário das Leis, Diário das Súmulas e
 * a página "Meus Grupos de Estudo"). Uma pessoa pode estar em vários
 * grupos ao mesmo tempo; cada grupo é compartilhado entre todos os
 * diários (o código do grupo é o mesmo em todo lugar, e cada diário só
 * grava seu próprio campo de progresso no documento do membro).
 *
 * Requer, na página que o carrega, os <script> do Firebase (app-compat,
 * auth-compat, firestore-compat) e window.DIARIO_FIREBASE_CONFIG
 * definidos ANTES deste arquivo.
 */
(function () {
  "use strict";
  window.GruposShared = window.GruposShared || {};
  var S = window.GruposShared;

  S.GROUP_KEY = "informativos-grupo";
  S.MEDALS = ["\u{1F947}", "\u{1F948}", "\u{1F949}"]; // 🥇 🥈 🥉

  S.AVATAR_KEY = "informativos-avatar";
  S.AVATAR_DEFAULT = { gender: "f", tone: "3" };
  S.GENDER_BASE = { f: "\u{1F469}", m: "\u{1F468}", x: "\u{1F9D1}" };
  S.TONE_MOD = {
    "1": "\u{1F3FB}",
    "2": "\u{1F3FC}",
    "3": "\u{1F3FD}",
    "4": "\u{1F3FE}",
    "5": "\u{1F3FF}"
  };
  var JUDGE_SUFFIX = "‍⚖️";

  S.avatarEmoji = function (pref) {
    var base = S.GENDER_BASE[pref.gender] || S.GENDER_BASE.f;
    var tone = S.TONE_MOD[pref.tone] || "";
    return base + tone + JUDGE_SUFFIX;
  };

  S.validAvatar = function (avatar) {
    return avatar && S.GENDER_BASE[avatar.gender] && S.TONE_MOD[avatar.tone] ? avatar : S.AVATAR_DEFAULT;
  };

  // Leitura do boneco escolhido pela pessoa (gravado por cada diário, em
  // "Personalizar boneco" — aqui é só leitura, para exibir corretamente
  // nas telas de grupo).
  S.readAvatarPref = function () {
    try {
      var raw = localStorage.getItem(S.AVATAR_KEY);
      if (!raw) return Object.assign({}, S.AVATAR_DEFAULT);
      return S.validAvatar(JSON.parse(raw));
    } catch (e) { return Object.assign({}, S.AVATAR_DEFAULT); }
  };

  // ---- Grupos dos quais a pessoa participa (lista, não mais um só) ------
  // Formato salvo: [{ code, name, joinedAt }, ...] — "name" é como essa
  // pessoa se identifica NESSE grupo (pode variar de grupo para grupo).
  S.readGroups = function () {
    try {
      var raw = localStorage.getItem(S.GROUP_KEY);
      if (!raw) return [];
      var parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
      // Formato antigo (um único grupo, salvo antes de existirem vários) —
      // migra para lista na primeira leitura, sem a pessoa perceber.
      if (parsed && parsed.code) {
        var migrated = [parsed];
        S.writeGroups(migrated);
        return migrated;
      }
      return [];
    } catch (e) { return []; }
  };

  S.writeGroups = function (list) {
    try { localStorage.setItem(S.GROUP_KEY, JSON.stringify(list || [])); } catch (e) {}
  };

  S.findGroup = function (code) {
    var list = S.readGroups();
    for (var i = 0; i < list.length; i++) if (list[i].code === code) return list[i];
    return null;
  };

  S.addGroup = function (pref) {
    var list = S.readGroups().filter(function (g) { return g.code !== pref.code; });
    list.push(pref);
    S.writeGroups(list);
    return list;
  };

  S.removeGroup = function (code) {
    var list = S.readGroups().filter(function (g) { return g.code !== code; });
    S.writeGroups(list);
    return list;
  };

  S.genGroupCode = function () {
    var chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    var out = "";
    for (var i = 0; i < 6; i++) out += chars[Math.floor(Math.random() * chars.length)];
    return out;
  };

  // ---- Firebase ----------------------------------------------------------
  S.ensureFirebaseApp = function () {
    if (window.firebase && window.DIARIO_FIREBASE_CONFIG && !firebase.apps.length) {
      firebase.initializeApp(window.DIARIO_FIREBASE_CONFIG);
    }
  };

  // onReady(viewerId, user) é chamado sempre que o login anônimo confirma
  // (ou troca de conta, no caso de "já vinculei — entrar neste aparelho").
  S.onViewerReady = function (onReady) {
    if (!window.firebase || !window.DIARIO_FIREBASE_CONFIG) return;
    S.ensureFirebaseApp();
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) onReady(user.uid, user);
    });
    firebase.auth().signInAnonymously().catch(function () {});
  };

  S.memberRef = function (code, viewerId) {
    return firebase.firestore().doc("groups/" + code + "/members/" + viewerId);
  };

  // Grava/atualiza só os campos passados — nunca apaga os campos que
  // outros diários já tenham gravado no mesmo documento do membro.
  S.updateMember = function (code, viewerId, fields) {
    var payload = Object.assign({ updatedAt: new Date().toISOString() }, fields);
    return S.memberRef(code, viewerId).set(payload, { merge: true });
  };

  S.subscribeMembers = function (code, onData, onError) {
    return firebase.firestore().collection("groups/" + code + "/members")
      .onSnapshot(onData, onError || function () {});
  };

  S.fetchGroupMeta = function (code) {
    return firebase.firestore().doc("groups/" + code).get().then(function (snap) {
      return snap.exists ? snap.data() : null;
    });
  };

  S.createGroupDoc = function (code, groupName, viewerId) {
    return firebase.firestore().doc("groups/" + code).set({
      name: groupName || "",
      createdAt: new Date().toISOString(),
      createdBy: viewerId
    });
  };

  S.deleteMember = function (code, viewerId) {
    return S.memberRef(code, viewerId).delete();
  };

  // ---- Ranking -------------------------------------------------------
  // metricField: nome do campo no documento do membro usado para ordenar
  // (ex.: "lidas" no Diário dos Informativos, "lidasLeis" no das Leis).
  S.rankedMembers = function (snap, metricField) {
    var members = snap.docs.map(function (d) {
      var data = d.data() || {};
      return {
        id: d.id,
        name: data.name,
        avatar: data.avatar,
        joinedAt: data.joinedAt || "",
        value: data[metricField] || 0,
        raw: data
      };
    }).filter(function (m) { return m && m.name; });
    members.sort(function (a, b) {
      if (b.value !== a.value) return b.value - a.value;
      if (a.joinedAt !== b.joinedAt) return a.joinedAt < b.joinedAt ? -1 : 1;
      return (a.name || "").localeCompare(b.name || "");
    });
    return members;
  };

  // ---- Meus prêmios: resumo pessoal (sem nomes de terceiros) -------------
  // Conta, entre os grupos que a pessoa participa, em quantos ela está em
  // 1º/2º/3º lugar nesse diário — é só isso que aparece na página do
  // diário; a lista completa, grupo a grupo, fica em "Meus Grupos de
  // Estudo" (só os grupos de quem está vendo, nunca os de outra pessoa).
  S.tallyMyPrizes = function (groupCodes, snapshots, metricField, viewerId) {
    var gold = 0, silver = 0, bronze = 0, counted = 0;
    groupCodes.forEach(function (code) {
      var snap = snapshots[code];
      if (!snap) return;
      counted++;
      var ranked = S.rankedMembers(snap, metricField);
      var pos = -1;
      for (var i = 0; i < ranked.length; i++) if (ranked[i].id === viewerId) { pos = i; break; }
      if (pos === 0) gold++;
      else if (pos === 1) silver++;
      else if (pos === 2) bronze++;
    });
    return { gold: gold, silver: silver, bronze: bronze, groupsTotal: groupCodes.length, groupsLoaded: counted };
  };

  S.renderMyPrizes = function (container, tally, opts) {
    if (!container) return;
    opts = opts || {};
    if (!tally.groupsTotal) { container.hidden = true; container.innerHTML = ""; return; }

    var html = '<div class="my-prizes-row">';
    html += '<span class="prize gold"><span class="prize-medal">\u{1F947}</span><b>' + tally.gold + '</b></span>';
    html += '<span class="prize silver"><span class="prize-medal">\u{1F948}</span><b>' + tally.silver + '</b></span>';
    html += '<span class="prize bronze"><span class="prize-medal">\u{1F949}</span><b>' + tally.bronze + '</b></span>';
    html += '</div>';
    var groupWord = tally.groupsTotal === 1 ? "grupo" : "grupos";
    if (opts.hubHref) {
      html += '<a class="my-prizes-link" href="' + opts.hubHref + '">' + tally.groupsTotal + ' ' + groupWord + ' · ver ranking completo →</a>';
    }
    container.innerHTML = html;
    container.hidden = false;
  };

  // ---- Mini-pódios: um bloco compacto (top 3) por grupo -------------------
  // Usado só na página "Meus Grupos de Estudo" (não nos diários).
  // groupsData: [{ code, name, members: [...) já ordenados por rankedMembers }]
  S.renderMiniPodiums = function (container, groupsData, opts) {
    if (!container) return;
    opts = opts || {};
    container.innerHTML = "";
    if (!groupsData.length) { container.hidden = true; return; }

    groupsData.forEach(function (g) {
      var block = document.createElement("div");
      block.className = "mini-podium";

      var head = document.createElement("div");
      head.className = "mini-podium-head";
      var title = document.createElement("span");
      title.className = "mini-podium-name";
      title.textContent = g.name || ("Grupo " + g.code);
      head.appendChild(title);
      if (opts.hubHref) {
        var link = document.createElement("a");
        link.className = "mini-podium-link";
        link.href = opts.hubHref;
        link.textContent = "meus grupos →";
        head.appendChild(link);
      }
      block.appendChild(head);

      var row = document.createElement("div");
      row.className = "mini-podium-row";
      if (!g.members.length) {
        var none = document.createElement("p");
        none.className = "mini-podium-empty";
        none.textContent = "Ninguém leu ainda — seja o primeiro!";
        row.appendChild(none);
      } else {
        g.members.slice(0, 3).forEach(function (m, i) {
          var slot = document.createElement("div");
          slot.className = "mini-slot";

          var medal = document.createElement("span");
          medal.className = "mini-medal";
          medal.textContent = S.MEDALS[i];

          var avatar = document.createElement("span");
          avatar.className = "mini-avatar";
          avatar.textContent = S.avatarEmoji(S.validAvatar(m.avatar));

          var name = document.createElement("span");
          name.className = "mini-name";
          name.textContent = m.name;

          var count = document.createElement("span");
          count.className = "mini-count";
          count.textContent = m.value;

          slot.appendChild(medal);
          slot.appendChild(avatar);
          slot.appendChild(name);
          slot.appendChild(count);
          row.appendChild(slot);
        });
      }
      block.appendChild(row);
      container.appendChild(block);
    });
    container.hidden = false;
  };
})();
