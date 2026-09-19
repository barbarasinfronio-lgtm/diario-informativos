(function () {
  "use strict";

  // Página de ranking completo do grupo do Diário dos Informativos.
  // Lê o mesmo grupo (código salvo em localStorage por diario-logic.js)
  // e mostra a lista inteira, ordenada por número de informativos lidos —
  // o pódio (top 3) já aparece no topo do Diário; aqui é a lista cheia.

  var GROUP_KEY = "informativos-grupo";
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
  var MEDALS = ["\u{1F947}", "\u{1F948}", "\u{1F949}"]; // 🥇 🥈 🥉

  function avatarEmoji(pref) {
    var base = GENDER_BASE[pref.gender] || GENDER_BASE.f;
    var tone = TONE_MOD[pref.tone] || "";
    return base + tone + JUDGE_SUFFIX;
  }

  function readGroupPref() {
    try {
      var raw = localStorage.getItem(GROUP_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) { return null; }
  }

  var groupPref = readGroupPref();

  var titleEl = document.getElementById("ranking-title");
  var listEl = document.getElementById("rank-list");
  var emptyEl = document.getElementById("rank-empty");
  var codeEl = document.getElementById("rank-code");

  function showEmpty(html) {
    if (listEl) listEl.hidden = true;
    if (codeEl) codeEl.hidden = true;
    if (emptyEl) {
      emptyEl.innerHTML = html;
      emptyEl.hidden = false;
    }
  }

  if (!groupPref) {
    showEmpty(
      'Você ainda não está em nenhum grupo. Abra o ' +
      '<a href="https://www.estudamana.com.br/p/diario-dos-informativos.html">Diário dos Informativos</a>' +
      ' nesse mesmo navegador, crie ou entre num grupo em "Estudo coletivo", e volte aqui — o ranking aparece sozinho.'
    );
    return;
  }

  if (codeEl) {
    codeEl.textContent = "Código do grupo: " + groupPref.code;
    codeEl.hidden = false;
  }

  function renderRanking(snap) {
    var members = snap.docs.map(function (d) {
      var data = d.data() || {};
      return {
        name: data.name,
        lidas: data.lidas || 0,
        avatar: data.avatar
      };
    }).filter(function (m) { return m && m.name; });

    if (!members.length) {
      showEmpty("Ninguém no grupo leu um informativo ainda — seja o primeiro!");
      return;
    }

    members.sort(function (a, b) {
      if (b.lidas !== a.lidas) return b.lidas - a.lidas;
      return (a.name || "").localeCompare(b.name || "");
    });

    if (emptyEl) emptyEl.hidden = true;
    if (listEl) listEl.hidden = false;
    if (codeEl) codeEl.hidden = false;
    if (!listEl) return;

    listEl.innerHTML = "";
    members.forEach(function (m, i) {
      var li = document.createElement("li");
      li.className = "rank-item" + (i < 3 ? " rank-top3" : "");

      var pos = document.createElement("span");
      pos.className = "rank-pos";
      pos.textContent = i < 3 ? MEDALS[i] : String(i + 1);

      var avatar = document.createElement("span");
      avatar.className = "rank-avatar";
      var pref = m.avatar && GENDER_BASE[m.avatar.gender] && TONE_MOD[m.avatar.tone] ? m.avatar : AVATAR_DEFAULT;
      avatar.textContent = avatarEmoji(pref);

      var name = document.createElement("span");
      name.className = "rank-name";
      name.textContent = m.name;

      var emojisEl = document.createElement("span");
      emojisEl.className = "rank-emojis";
      var emoji = avatarEmoji(pref);
      var CAP = 60;
      emojisEl.textContent = emoji.repeat(Math.min(m.lidas, CAP)) + (m.lidas > CAP ? " +" + (m.lidas - CAP) : "");

      var count = document.createElement("span");
      count.className = "rank-count";
      count.textContent = m.lidas + (m.lidas === 1 ? " lido" : " lidos");

      li.appendChild(pos);
      li.appendChild(avatar);
      li.appendChild(name);
      li.appendChild(emojisEl);
      li.appendChild(count);
      listEl.appendChild(li);
    });
  }

  function subscribe() {
    var db = firebase.firestore();
    db.collection("groups/" + groupPref.code + "/members").onSnapshot(
      renderRanking,
      function () {
        showEmpty("Não foi possível carregar o ranking agora. Recarregue a página em instantes.");
      }
    );
  }

  if (window.firebase && window.DIARIO_FIREBASE_CONFIG) {
    if (!firebase.apps.length) firebase.initializeApp(window.DIARIO_FIREBASE_CONFIG);
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) subscribe();
    });
    firebase.auth().signInAnonymously().catch(function () {
      showEmpty("Não foi possível conectar agora. Recarregue a página em instantes.");
    });
  } else {
    showEmpty("Não foi possível conectar agora. Recarregue a página em instantes.");
  }
})();
