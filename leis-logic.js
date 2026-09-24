/*
 * leis-logic.js — Diário de Leis (filtro por edital / carreira)
 *
 * Usa o HTML da página no Blogger com estes elementos:
 *   #select-edital, #select-estado (dentro de #wrapper-filtro-estado),
 *   #input-busca-lei, #grid-leis-federais, #grid-leis-estaduais,
 *   #titulo-leis-estaduais
 *
 * Regras:
 *   - Edital específico de um estado (ex.: TJSP, MPMG, PGE-GO): mostra todas as
 *     leis federais e, das estaduais, só as daquele estado.
 *   - Carreira estadual (ex.: Magistratura Estadual): mostra todas as federais e
 *     um menu para escolher de qual estado incluir as leis estaduais.
 *   - Concurso federal ou exame nacional (TRF, MPF, AGU, ENAM…): só as federais.
 *
 * Os dados vêm de leis-data.js (LEIS_DATA, a mesma base usada por Editais e
 * Prêmios) e a lista de editais/carreiras de editais-data.js (EDITAIS_DATA).
 * Uma lei é estadual quando o "numero" traz a sigla da UF entre parênteses,
 * ex.: "Lei Estadual (SC) nº 17.492/2018".
 *
 * Cada lei tem uma caixinha "Já li esta lei". A marcação é salva neste
 * navegador (localStorage "leis-lidas") e, se a pessoa estiver logada,
 * também na conta (Firestore "progress-leis/<uid>", campo "map") — é o
 * MESMO formato de antes ("<matéria>:<número-em-slug>": {lida, lidaEm}),
 * para continuar valendo para os prêmios de "Meus Prêmios".
 *
 * Funciona carregado tanto com <script src> quanto com <script type="module">:
 * se os dados ainda não estiverem na página, este arquivo os busca na mesma
 * pasta de onde ele próprio veio.
 */
(function () {
  "use strict";

  if (window.__leisLogic) return;
  window.__leisLogic = true;

  var STORAGE_EDITAL = "estudamana_edital_selecionado";
  var STORAGE_ESTADO = "estudamana_estado_selecionado";
  var LOCAL_KEY = "leis-lidas";
  var CDN_BASE = "https://cdn.jsdelivr.net/gh/barbarasinfronio-lgtm/diario-informativos@main/";

  var ESTADOS = [
    ["AC", "Acre"], ["AL", "Alagoas"], ["AP", "Amapá"], ["AM", "Amazonas"],
    ["BA", "Bahia"], ["CE", "Ceará"], ["DF", "Distrito Federal"],
    ["ES", "Espírito Santo"], ["GO", "Goiás"], ["MA", "Maranhão"],
    ["MT", "Mato Grosso"], ["MS", "Mato Grosso do Sul"], ["MG", "Minas Gerais"],
    ["PA", "Pará"], ["PB", "Paraíba"], ["PR", "Paraná"], ["PE", "Pernambuco"],
    ["PI", "Piauí"], ["RJ", "Rio de Janeiro"], ["RN", "Rio Grande do Norte"],
    ["RS", "Rio Grande do Sul"], ["RO", "Rondônia"], ["RR", "Roraima"],
    ["SC", "Santa Catarina"], ["SP", "São Paulo"], ["SE", "Sergipe"],
    ["TO", "Tocantins"]
  ];
  var UF_NOME = {};
  ESTADOS.forEach(function (e) { UF_NOME[e[0]] = e[1]; });

  // ---- carregamento dos dados ---------------------------------------------
  function scriptBase() {
    var all = document.getElementsByTagName("script");
    for (var i = 0; i < all.length; i++) {
      var src = all[i].src || "";
      if (/leis-logic\.js/.test(src)) return src.replace(/leis-logic\.js(\?.*)?$/, "");
    }
    return CDN_BASE;
  }

  function ensure(globalName, file) {
    return new Promise(function (resolve) {
      if (window[globalName]) { resolve(); return; }
      var s = document.createElement("script");
      s.src = scriptBase() + file;
      s.charset = "utf-8";
      s.onload = s.onerror = function () { resolve(); };
      document.head.appendChild(s);
    });
  }

  function domReady() {
    return new Promise(function (resolve) {
      if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", resolve);
      } else {
        resolve();
      }
    });
  }

  // ---- utilidades ----------------------------------------------------------
  function escapeHtml(t) {
    return String(t == null ? "" : t).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function semAcento(t) {
    return String(t || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  }

  // Mesmo formato de slug usado por premios-logic.js e pela versão anterior
  // deste arquivo — não pode mudar, senão as leis já marcadas como lidas
  // (e os prêmios já conquistados) deixam de bater com a chave nova.
  function slug(t) {
    return semAcento(t).replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  }

  function chaveDe(materiaKey, numero) { return materiaKey + ":" + slug(numero); }

  function todayIso() {
    var d = new Date();
    return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  }

  function lerStorage(k) {
    try { return localStorage.getItem(k) || ""; } catch (e) { return ""; }
  }

  function gravarStorage(k, v) {
    try { localStorage.setItem(k, v); } catch (e) {}
  }

  function lerLidos() {
    try { var raw = localStorage.getItem(LOCAL_KEY); return raw ? JSON.parse(raw) : {}; } catch (e) { return {}; }
  }

  function gravarLidos() {
    try { localStorage.setItem(LOCAL_KEY, JSON.stringify(lidos)); } catch (e) {}
  }

  var lidos = lerLidos();
  function isLida(chave) { var v = lidos[chave]; return !!(v && v.lida); }

  // ---- leis ----------------------------------------------------------------
  var UF_RE = /\(([A-Z]{2})\)/;

  function montarLeis() {
    var dados = window.LEIS_DATA || {};
    var lista = [];
    Object.keys(dados).forEach(function (mat) {
      var bloco = dados[mat];
      (bloco.leis || []).forEach(function (l) {
        var m = String(l.numero || "").match(UF_RE) || String(l.nome || "").match(UF_RE);
        var uf = m && UF_NOME[m[1]] ? m[1] : null;
        lista.push({
          materiaKey: mat,
          materia: bloco.label || mat,
          chave: chaveDe(mat, l.numero),
          nome: l.nome,
          numero: l.numero,
          link: l.link,
          uf: uf,
          busca: semAcento(l.nome + " " + l.numero + " " + (bloco.label || "")),
          digitos: String(l.numero || "").replace(/\D/g, "")
        });
      });
    });
    return lista;
  }

  // ---- editais e carreiras -------------------------------------------------
  // UF de um edital pela sigla: TJSP, MPMG, DPE-BA, PGE-GO, PC-AP, PCPR…
  function ufDaSigla(sigla) {
    var s = String(sigla || "").toUpperCase().replace(/[^A-Z]/g, "");
    if (s === "TJDFT" || s === "MPDFT" || s === "PCDF") return "DF";
    var m = s.match(/^(TJ|MP|DPE|PGE|PC)([A-Z]{2})$/);
    return m && UF_NOME[m[2]] ? m[2] : null;
  }

  // Cada opção: { id, nome, grupo, modo: "uf" | "escolher" | "federal", uf }
  function montarOpcoes() {
    var editais = window.EDITAIS_DATA || [];
    var carreiras = [], federais = [], porEdital = [];
    editais.forEach(function (e) {
      if (e.emBreve) return;
      if (e.tipo === "carreira") {
        var soFederal = e.secao === "exame" || /federal/.test(e.id);
        (soFederal ? federais : carreiras).push({
          id: e.id,
          nome: e.titulo,
          modo: soFederal ? "federal" : "escolher"
        });
        return;
      }
      var uf = ufDaSigla(e.sigla);
      porEdital.push({
        id: e.id,
        nome: e.sigla + " — " + e.titulo,
        modo: uf ? "uf" : "federal",
        uf: uf
      });
    });
    porEdital.sort(function (a, b) { return a.nome.localeCompare(b.nome, "pt-BR"); });
    return [
      { label: "Carreiras estaduais (você escolhe o estado)", itens: carreiras },
      { label: "Carreiras federais e exames nacionais", itens: federais },
      { label: "Por edital", itens: porEdital }
    ];
  }

  // ---- visual dos cards ----------------------------------------------------
  function card(lei) {
    var federal = !lei.uf;
    var badge = federal ? "FEDERAL" : "ESTADUAL (" + lei.uf + ")";
    var fundo = federal ? "#e7f1ff" : "#e6f4ea";
    var cor = federal ? "#0d6efd" : "#198754";
    var lida = isLida(lei.chave);
    return '<div class="lei-card" data-chave="' + escapeHtml(lei.chave) + '" style="background:#fff;border:1px solid #e2e8f0;border-radius:8px;padding:14px 16px;margin-bottom:10px;box-shadow:0 1px 3px rgba(0,0,0,.04);">' +
      '<div style="display:flex;justify-content:space-between;align-items:flex-start;gap:10px;">' +
      '<h3 style="margin:0;font-size:15px;font-weight:600;color:' + (lida ? "#94a3b8" : "#1e293b") + ';line-height:1.4;' + (lida ? "text-decoration:line-through;" : "") + '">' + escapeHtml(lei.nome) + "</h3>" +
      '<span style="font-size:11px;font-weight:700;background:' + fundo + ";color:" + cor + ';padding:3px 8px;border-radius:12px;white-space:nowrap;">' + badge + "</span>" +
      "</div>" +
      '<p style="margin:6px 0 10px;font-size:13px;color:#64748b;">' + escapeHtml(lei.numero) + "</p>" +
      '<div style="display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap;">' +
      (lei.link
        ? '<a href="' + escapeHtml(lei.link) + '" target="_blank" rel="noopener noreferrer" style="font-size:13px;font-weight:600;color:#0d6efd;text-decoration:none;">📖 Abrir lei na íntegra ↗</a>'
        : "<span></span>") +
      '<label style="display:flex;align-items:center;gap:6px;font-size:13px;color:#334155;cursor:pointer;user-select:none;">' +
      '<input type="checkbox" class="lei-check" data-chave="' + escapeHtml(lei.chave) + '"' + (lida ? " checked" : "") + ' style="width:17px;height:17px;cursor:pointer;">' +
      (lida ? "Lida ✓" : "Já li esta lei") +
      "</label></div></div>";
  }

  // Agrupa por matéria em blocos que abrem e fecham (a lista federal é longa).
  function porMateria(leis, abrir) {
    var ordem = [], grupos = {};
    leis.forEach(function (l) {
      if (!grupos[l.materia]) { grupos[l.materia] = []; ordem.push(l.materia); }
      grupos[l.materia].push(l);
    });
    return ordem.map(function (mat) {
      var lidasNaMateria = grupos[mat].filter(function (l) { return isLida(l.chave); }).length;
      return '<details style="margin-bottom:10px;"' + (abrir ? " open" : "") + ">" +
        '<summary style="cursor:pointer;font-weight:600;font-size:15px;color:#334155;padding:8px 0;">' +
        escapeHtml(mat) + ' <span style="color:#94a3b8;font-weight:400;">(' + lidasNaMateria + " de " + grupos[mat].length + " lidas)</span></summary>" +
        '<div style="padding-top:6px;">' + grupos[mat].map(card).join("") + "</div>" +
        "</details>";
    }).join("");
  }

  function aviso(texto) {
    return '<p style="color:#94a3b8;font-style:italic;">' + texto + "</p>";
  }

  function resumo(leis) {
    var lidasN = leis.filter(function (l) { return isLida(l.chave); }).length;
    if (!leis.length) return "";
    return '<p class="lei-resumo" style="margin:0 0 12px;font-size:13px;font-weight:600;color:#475569;">' +
      lidasN + " de " + leis.length + " lidas</p>";
  }

  // ---- sincronização (conta) ------------------------------------------------
  var viewerId = null, dbCap = null, dbReady = false, progressDoc = null, syncTimer = null, applyingRemote = false;

  function scheduleSync() {
    if (syncTimer) clearTimeout(syncTimer);
    syncTimer = setTimeout(doSync, 700);
  }

  function doSync() {
    gravarLidos();
    if (!dbReady || !progressDoc) return;
    progressDoc.set({ map: lidos, updatedAt: new Date().toISOString() }, { merge: true })
      .catch(function (err) {
        if (err && err.code === "permission-denied") { dbCap = null; progressDoc = null; }
      });
  }

  // Junta o que veio da nuvem com o que já está marcado aqui — nunca some
  // uma leitura já feita, seja neste aparelho ou em outro.
  function aplicarRemoto(map) {
    var mudou = false;
    Object.keys(map || {}).forEach(function (k) {
      var v = map[k];
      if (v && v.lida && !(lidos[k] && lidos[k].lida)) { lidos[k] = v; mudou = true; }
    });
    return mudou;
  }

  function bindUser(uid) {
    viewerId = uid;
    dbCap = firebase.firestore();
    progressDoc = dbCap.doc("progress-leis/" + uid);
    dbReady = true;
    progressDoc.onSnapshot(function (snap) {
      if (!snap.exists) return;
      var data = snap.data();
      if (!data || !data.map) return;
      applyingRemote = true;
      if (aplicarRemoto(data.map)) { gravarLidos(); if (window.__leisRender) window.__leisRender(); }
      applyingRemote = false;
    }, function () {});
  }

  // ---- página --------------------------------------------------------------
  function iniciar() {
    var selectEdital = document.getElementById("select-edital");
    var selectEstado = document.getElementById("select-estado");
    var inputBusca = document.getElementById("input-busca-lei");
    var wrapperEstado = document.getElementById("wrapper-filtro-estado");
    var gridFederais = document.getElementById("grid-leis-federais");
    var gridEstaduais = document.getElementById("grid-leis-estaduais");
    var tituloEstaduais = document.getElementById("titulo-leis-estaduais");
    if (!selectEdital || !gridFederais || !gridEstaduais) return;

    var leis = montarLeis();
    if (!leis.length) {
      gridFederais.innerHTML = aviso("Não foi possível carregar as leis. Recarregue a página.");
      gridEstaduais.innerHTML = "";
      return;
    }

    var grupos = montarOpcoes();
    var opcoes = {};
    var html = '<option value="">Selecione o edital ou a carreira…</option>';
    grupos.forEach(function (g) {
      if (!g.itens.length) return;
      html += '<optgroup label="' + escapeHtml(g.label) + '">';
      g.itens.forEach(function (o) {
        opcoes[o.id] = o;
        html += '<option value="' + escapeHtml(o.id) + '">' + escapeHtml(o.nome) + "</option>";
      });
      html += "</optgroup>";
    });
    selectEdital.innerHTML = html;

    // quantas leis estaduais há em cada estado (para mostrar no menu)
    var porUf = {};
    leis.forEach(function (l) { if (l.uf) porUf[l.uf] = (porUf[l.uf] || 0) + 1; });
    if (selectEstado) {
      selectEstado.innerHTML = '<option value="">Escolha o estado…</option>' +
        ESTADOS.map(function (e) {
          var n = porUf[e[0]] || 0;
          return '<option value="' + e[0] + '">' + e[0] + " — " + escapeHtml(e[1]) +
            (n ? " (" + n + ")" : " (nenhuma ainda)") + "</option>";
        }).join("") +
        '<option value="TODOS">Todos os estados</option>';
    }

    // escolha salva; senão, o edital principal da página "Editais"
    var salvo = lerStorage(STORAGE_EDITAL) || lerStorage("editais-principal");
    if (salvo && opcoes[salvo]) selectEdital.value = salvo;
    var estadoSalvo = lerStorage(STORAGE_ESTADO);
    if (selectEstado && estadoSalvo) selectEstado.value = estadoSalvo;

    function atendeBusca(lei, termo, digitos) {
      if (!termo) return true;
      if (digitos && lei.digitos.indexOf(digitos) !== -1) return true;
      return lei.busca.indexOf(termo) !== -1;
    }

    function render() {
      var opcao = opcoes[selectEdital.value] || null;
      var termo = semAcento(inputBusca ? inputBusca.value.trim() : "");
      var digitos = /\d/.test(termo) ? termo.replace(/\D/g, "") : "";
      var buscando = !!termo;

      if (wrapperEstado) wrapperEstado.style.display = opcao && opcao.modo === "escolher" ? "" : "none";

      // Federais: sempre todas (filtradas pela busca)
      var federais = leis.filter(function (l) { return !l.uf && atendeBusca(l, termo, digitos); });
      gridFederais.innerHTML = federais.length
        ? resumo(federais) + porMateria(federais, buscando)
        : aviso("Nenhuma lei federal encontrada.");

      // Estaduais: depende do edital/carreira
      var uf = null, titulo = "🏛️ Leis Estaduais";
      if (!opcao) {
        if (tituloEstaduais) tituloEstaduais.textContent = titulo;
        gridEstaduais.innerHTML = aviso("Escolha acima o edital ou a carreira para ver as leis estaduais.");
        return;
      }
      if (opcao.modo === "federal") {
        if (tituloEstaduais) tituloEstaduais.textContent = titulo;
        gridEstaduais.innerHTML = aviso("Este é um concurso federal ou exame nacional: só as leis federais se aplicam.");
        return;
      }
      if (opcao.modo === "uf") {
        uf = opcao.uf;
      } else {
        uf = selectEstado ? selectEstado.value : "";
        if (!uf) {
          if (tituloEstaduais) tituloEstaduais.textContent = titulo;
          gridEstaduais.innerHTML = aviso("Escolha no menu acima de qual estado você quer incluir as leis estaduais.");
          return;
        }
      }

      var estaduais = leis.filter(function (l) {
        return l.uf && (uf === "TODOS" || l.uf === uf) && atendeBusca(l, termo, digitos);
      });
      if (tituloEstaduais) {
        tituloEstaduais.textContent = uf === "TODOS"
          ? "🏛️ Leis Estaduais (todos os estados)"
          : "🏛️ Leis Estaduais — " + UF_NOME[uf] + " (" + uf + ")";
      }
      gridEstaduais.innerHTML = estaduais.length
        ? resumo(estaduais) + porMateria(estaduais, true)
        : aviso(buscando
            ? "Nenhuma lei estadual encontrada para essa busca."
            : "Ainda não há leis estaduais de " + escapeHtml(UF_NOME[uf] || uf) + " cadastradas.");
    }

    window.__leisRender = render;

    selectEdital.addEventListener("change", function () {
      gravarStorage(STORAGE_EDITAL, selectEdital.value);
      render();
    });
    if (selectEstado) {
      selectEstado.addEventListener("change", function () {
        gravarStorage(STORAGE_ESTADO, selectEstado.value);
        render();
      });
    }
    if (inputBusca) inputBusca.addEventListener("input", render);

    // Marcar/desmarcar "já li" — delegado nos dois grids (o conteúdo é
    // trocado inteiro a cada filtro, então um listener por checkbox não
    // adiantaria). Não chama render() de novo: só atualiza o próprio card
    // e os contadores, para não fechar os <details> abertos nem perder a
    // posição da rolagem.
    [gridFederais, gridEstaduais].forEach(function (grid) {
      grid.addEventListener("change", function (e) {
        var t = e.target;
        if (!t.classList || !t.classList.contains("lei-check")) return;
        var chave = t.getAttribute("data-chave");
        if (t.checked) lidos[chave] = { lida: true, lidaEm: todayIso() };
        else delete lidos[chave];
        gravarLidos();
        if (!applyingRemote) scheduleSync();

        var cardEl = t.closest(".lei-card");
        if (cardEl) {
          var h3 = cardEl.querySelector("h3");
          if (h3) {
            h3.style.color = t.checked ? "#94a3b8" : "#1e293b";
            h3.style.textDecoration = t.checked ? "line-through" : "none";
          }
          var label = t.closest("label");
          if (label) label.lastChild.textContent = t.checked ? "Lida ✓" : "Já li esta lei";
          var details = cardEl.closest("details");
          if (details) {
            var count = details.querySelector("summary span");
            if (count) {
              var total = details.querySelectorAll(".lei-check").length;
              var lidasNaMateria = details.querySelectorAll(".lei-check:checked").length;
              count.textContent = "(" + lidasNaMateria + " de " + total + " lidas)";
            }
          }
        }
        var grid2 = t.closest('[id^="grid-leis-"]');
        if (grid2) {
          var resumoEl = grid2.querySelector(".lei-resumo");
          if (resumoEl) {
            var totalG = grid2.querySelectorAll(".lei-check").length;
            var lidasG = grid2.querySelectorAll(".lei-check:checked").length;
            resumoEl.textContent = lidasG + " de " + totalG + " lidas";
          }
        }
      });
    });

    render();
  }

  Promise.all([
    ensure("LEIS_DATA", "leis-data.js"),
    ensure("EDITAIS_DATA", "editais-data.js"),
    domReady()
  ]).then(iniciar);

  // ---- conta Google -----------------------------------------------------
  // Esta página não tem mais o painel "Acessar de qualquer aparelho" no
  // HTML (layout novo), então criamos um: conta-google.js procura por
  // #account-panel e insere o botão sozinho ali dentro. Sem isso, ninguém
  // conseguia entrar com a conta Google nesta página. Aproveitamos o mesmo
  // login (anônimo ou com Google) para sincronizar as leis marcadas como
  // lidas com a conta (função bindUser, acima).
  function ensureAccountPanel() {
    var panel = document.getElementById("account-panel");
    if (panel) return panel;
    panel = document.createElement("div");
    panel.id = "account-panel";
    var anchor = document.getElementById("select-edital");
    var block = anchor && (anchor.closest("section, article") || anchor.parentElement);
    if (block && block.parentNode) block.parentNode.insertBefore(panel, block);
    else document.body.insertBefore(panel, document.body.firstChild);
    return panel;
  }

  function startContaGoogle() {
    if (!(window.firebase && window.DIARIO_FIREBASE_CONFIG)) { dbReady = true; return; }
    ensureAccountPanel();
    if (!firebase.apps.length) firebase.initializeApp(window.DIARIO_FIREBASE_CONFIG);
    firebase.auth().onAuthStateChanged(function (user) {
      if (!user) return;
      if (viewerId !== user.uid) bindUser(user.uid);
    });
    // Só cria o login anônimo se, depois de o Firebase restaurar a sessão,
    // não houver ninguém logado — assim não troca uma conta já vinculada
    // (Google) por outra.
    var offAnon = firebase.auth().onAuthStateChanged(function (u) {
      offAnon();
      if (!u) firebase.auth().signInAnonymously().catch(function () { dbReady = true; });
    });
    if (window.ContaGoogle || document.getElementById("conta-google-js")) return;
    var s = document.createElement("script");
    s.id = "conta-google-js";
    s.src = scriptBase() + "conta-google.js";
    document.head.appendChild(s);
  }

  domReady().then(startContaGoogle);
})();
