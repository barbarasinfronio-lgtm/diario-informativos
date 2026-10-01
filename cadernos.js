/* =====================================================================
   cadernos.js — destaques e anotações ("Meus Cadernos")
   Ao abrir um card do Diário das Decisões (e de Controle/Reclamações), a
   pessoa seleciona um trecho e aparece uma barrinha: destacar em amarelo,
   verde ou rosa, ou escrever uma anotação. Tudo fica na conta dela:
     cadernos/<uid>                 { cadernos: [{ id, nome }], atual }
     cadernos/<uid>/marcas/<id>     { fonte, item, titulo, origem, abrir,
                                      secao, inicio, fim, trecho, cor, nota,
                                      caderno, criadoEm, atualizadoEm }
   O trecho é guardado junto: a anotação continua no caderno mesmo se a
   decisão sair do site. Cada pessoa só lê e grava o próprio caderno
   (regras em firestore.rules). A página "Meus Cadernos" é cadernos-pagina.js.
   Uso (nas páginas):
     EstudaManaCadernos.ligar(modal, { fonte, item, titulo, origem, abrir, areas })
     EstudaManaCadernos.desligar()
   Cards da lista com data-cad-fonte / data-cad-id ganham o selo 📝.
   ===================================================================== */
(function () {
  if (window.EstudaManaCadernos) return;

  var BASE = "https://barbarasinfronio-lgtm.github.io/diario-informativos/";
  var PAGINA = "/p/meus-cadernos.html";
  var CORES = [
    { id: "amarelo", nome: "Amarelo" },
    { id: "verde", nome: "Verde" },
    { id: "rosa", nome: "Rosa" }
  ];
  var LIMITE_TRECHO = 4000, LIMITE_NOTA = 4000;

  // CSS próprio (vale no Diário das Decisões e na página Meus Cadernos)
  if (!document.querySelector('link[data-cadernos-css]')) {
    var css = document.createElement("link");
    css.rel = "stylesheet";
    css.href = BASE + "cadernos.css";
    css.setAttribute("data-cadernos-css", "1");
    document.head.appendChild(css);
  }

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function agora() { return new Date().toISOString(); }
  function novoId() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }

  // ---- conta + dados ------------------------------------------------------
  var uid = null, db = null, docRaiz = null;
  var marcas = {};            // id -> marca
  var meta = { cadernos: [], atual: null };
  var ouvintes = [];
  var carregado = false, contaConhecida = false;
  var offMarcas = null, offMeta = null;

  function avisar() {
    ouvintes.forEach(function (fn) { try { fn(); } catch (e) {} });
    atualizarSelos();
    if (ligado) { aplicarDestaques(); desenharLista(); }
  }

  function carregarNuvem() {
    if (window.EstudaManaNuvem) return Promise.resolve();
    return fetch(BASE + "nuvem-shared.js", { cache: "no-cache" })
      .then(function (r) { if (!r.ok) throw new Error(r.status); return r.text(); })
      .then(function (code) { (0, eval)(code + "\n//# sourceURL=" + BASE + "nuvem-shared.js"); });
  }

  function entrou(user) {
    if (offMarcas) { offMarcas(); offMarcas = null; }
    if (offMeta) { offMeta(); offMeta = null; }
    marcas = {}; meta = { cadernos: [], atual: null };
    uid = user && !user.isAnonymous ? user.uid : null;
    contaConhecida = true;
    carregado = !uid;
    if (!uid) { avisar(); return; }
    db = firebase.firestore();
    docRaiz = db.doc("cadernos/" + uid);
    offMeta = docRaiz.onSnapshot(function (s) {
      var d = s.exists ? s.data() : {};
      meta = { cadernos: Array.isArray(d.cadernos) ? d.cadernos : [], atual: d.atual || null };
      avisar();
    }, function () {});
    offMarcas = docRaiz.collection("marcas").onSnapshot(function (snap) {
      var novo = {};
      snap.forEach(function (doc) { var m = doc.data(); m.id = doc.id; novo[doc.id] = m; });
      marcas = novo;
      carregado = true;
      avisar();
    }, function () { carregado = true; avisar(); });
  }

  var iniciado = carregarNuvem()
    .then(function () { return window.EstudaManaNuvem.preparar(); })
    .then(function () {
      if (!window.firebase || !firebase.auth) { contaConhecida = true; carregado = true; return; }
      firebase.auth().onAuthStateChanged(entrou);
    })
    .catch(function () { carregado = true; contaConhecida = true; avisar(); });

  function salvarMeta() {
    if (!docRaiz) return Promise.reject(new Error("sem conta"));
    return docRaiz.set({ cadernos: meta.cadernos, atual: meta.atual || null, atualizadoEm: agora() });
  }
  function cadernoPadrao() {
    if (meta.atual && meta.cadernos.some(function (c) { return c.id === meta.atual; })) return Promise.resolve(meta.atual);
    if (meta.cadernos.length) { meta.atual = meta.cadernos[0].id; return salvarMeta().then(function () { return meta.atual; }); }
    var c = { id: novoId(), nome: "Geral", criadoEm: agora() };
    meta.cadernos = [c]; meta.atual = c.id;
    return salvarMeta().then(function () { return c.id; });
  }
  function criarCaderno(nome) {
    nome = String(nome || "").trim().slice(0, 60);
    if (!nome) return Promise.reject(new Error("nome vazio"));
    var c = { id: novoId(), nome: nome, criadoEm: agora() };
    meta.cadernos = meta.cadernos.concat([c]);
    meta.atual = c.id;
    return salvarMeta().then(function () { return c; });
  }
  function renomearCaderno(id, nome) {
    nome = String(nome || "").trim().slice(0, 60);
    if (!nome) return Promise.reject(new Error("nome vazio"));
    meta.cadernos = meta.cadernos.map(function (c) { return c.id === id ? Object.assign({}, c, { nome: nome }) : c; });
    return salvarMeta();
  }
  // Apaga o caderno; as marcações dele vão para outro caderno (não se perdem).
  function apagarCaderno(id, destino) {
    var resto = meta.cadernos.filter(function (c) { return c.id !== id; });
    var p = Promise.resolve();
    if (!destino && listaMarcas().some(function (m) { return m.caderno === id; })) {
      if (!resto.length) resto = [{ id: novoId(), nome: "Geral", criadoEm: agora() }];
      destino = resto[0].id;
    }
    meta.cadernos = resto;
    if (meta.atual === id) meta.atual = resto.length ? resto[0].id : null;
    p = salvarMeta();
    var mover = listaMarcas().filter(function (m) { return m.caderno === id; });
    if (!mover.length) return p;
    var lote = db.batch();
    mover.forEach(function (m) { lote.update(docRaiz.collection("marcas").doc(m.id), { caderno: destino, atualizadoEm: agora() }); });
    return p.then(function () { return lote.commit(); });
  }
  function escolherAtual(id) { meta.atual = id; return salvarMeta(); }

  function criarMarca(dados) {
    return cadernoPadrao().then(function (cad) {
      var m = Object.assign({
        cor: "amarelo", nota: "", caderno: cad, criadoEm: agora(), atualizadoEm: agora()
      }, dados);
      m.trecho = String(m.trecho || "").slice(0, LIMITE_TRECHO);
      m.nota = String(m.nota || "").slice(0, LIMITE_NOTA);
      var ref = docRaiz.collection("marcas").doc();
      return ref.set(m).then(function () { return ref.id; });
    });
  }
  function mudarMarca(id, campos) {
    campos = Object.assign({}, campos, { atualizadoEm: agora() });
    if (campos.nota != null) campos.nota = String(campos.nota).slice(0, LIMITE_NOTA);
    return docRaiz.collection("marcas").doc(id).update(campos);
  }
  function apagarMarca(id) { return docRaiz.collection("marcas").doc(id).delete(); }

  function listaMarcas() { return Object.keys(marcas).map(function (k) { return marcas[k]; }); }
  function marcasDe(fonte, item) {
    return listaMarcas().filter(function (m) { return m.fonte === fonte && String(m.item) === String(item); })
      .sort(function (a, b) { return (a.secao - b.secao) || (a.inicio - b.inicio); });
  }
  function nomeCaderno(id) {
    var c = meta.cadernos.filter(function (x) { return x.id === id; })[0];
    return c ? c.nome : "Sem caderno";
  }

  // ---- selo 📝 nos cards da lista -------------------------------------------
  function atualizarSelos(raiz) {
    var conta = {};
    listaMarcas().forEach(function (m) { var k = m.fonte + "|" + m.item; conta[k] = (conta[k] || 0) + 1; });
    (raiz || document).querySelectorAll("[data-cad-id]").forEach(function (card) {
      var n = conta[card.getAttribute("data-cad-fonte") + "|" + card.getAttribute("data-cad-id")] || 0;
      var selo = card.querySelector(".cad-selo");
      if (!n) { if (selo) selo.remove(); return; }
      if (!selo) {
        selo = document.createElement("span");
        selo.className = "cad-selo";
        var lugar = card.querySelector(".top-row") || card;
        lugar.appendChild(selo);
      }
      selo.textContent = "📝 " + n;
      selo.title = n === 1 ? "1 marcação sua neste card" : n + " marcações suas neste card";
    });
  }
  var obsTimer = null;
  new MutationObserver(function (lista) {
    for (var i = 0; i < lista.length; i++) {
      var add = lista[i].addedNodes;
      for (var j = 0; j < add.length; j++) {
        var n = add[j];
        if (n.nodeType === 1 && (n.hasAttribute("data-cad-id") || n.querySelector("[data-cad-id]"))) {
          clearTimeout(obsTimer);
          obsTimer = setTimeout(function () { atualizarSelos(); }, 60);
          return;
        }
      }
    }
  }).observe(document.body, { childList: true, subtree: true });

  // ---- card aberto: destaques ------------------------------------------------
  var ligado = null;   // { modal, info, areas, caixa }

  // posição (em caracteres) de um ponto do texto dentro da área
  function posicao(area, no, offset) {
    var r = document.createRange();
    r.setStart(area, 0);
    r.setEnd(no, offset);
    return r.toString().length;
  }

  function tirarDestaques(area) {
    area.querySelectorAll("mark.cad-mark").forEach(function (mk) {
      var pai = mk.parentNode;
      while (mk.firstChild) pai.insertBefore(mk.firstChild, mk);
      pai.removeChild(mk);
    });
    area.normalize();
  }

  // embrulha os caracteres [ini, fim) da área num <mark>
  function embrulhar(area, ini, fim, m) {
    var w = document.createTreeWalker(area, NodeFilter.SHOW_TEXT), no, pos = 0, alvos = [];
    while ((no = w.nextNode())) {
      var len = no.nodeValue.length, a = Math.max(ini, pos), b = Math.min(fim, pos + len);
      if (a < b) alvos.push({ no: no, a: a - pos, b: b - pos });
      pos += len;
      if (pos >= fim) break;
    }
    alvos.forEach(function (t) {
      var no = t.no;
      if (t.b < no.nodeValue.length) no.splitText(t.b);
      if (t.a > 0) no = no.splitText(t.a);
      var mk = document.createElement("mark");
      mk.className = "cad-mark cad-" + (m.cor || "amarelo") + (m.nota ? " cad-com-nota" : "");
      mk.setAttribute("data-marca", m.id);
      mk.title = m.nota ? "Anotação: " + m.nota : "Clique para mudar ou anotar";
      no.parentNode.insertBefore(mk, no);
      mk.appendChild(no);
    });
  }

  function aplicarDestaques() {
    if (!ligado) return;
    var areas = ligado.areas;
    areas.forEach(tirarDestaques);
    marcasDe(ligado.info.fonte, ligado.info.item).forEach(function (m) {
      var area = areas[m.secao], ini = m.inicio, fim = m.fim;
      if (!area || area.textContent.slice(ini, fim) !== m.trecho) {
        // o texto mudou um pouco: procura o trecho de novo
        area = null;
        for (var i = 0; i < areas.length && !area; i++) {
          var k = areas[i].textContent.indexOf(m.trecho);
          if (k >= 0 && m.trecho) { area = areas[i]; ini = k; fim = k + m.trecho.length; }
        }
      }
      if (area) embrulhar(area, ini, fim, m);
    });
  }

  // Quadro "Minhas marcações" no fim do card aberto
  function desenharLista() {
    if (!ligado) return;
    var caixa = ligado.caixa, lst = marcasDe(ligado.info.fonte, ligado.info.item);
    if (!uid) {
      caixa.innerHTML = '<div class="section-label">Meus Cadernos</div><p class="cad-dica">Entre na sua conta (Google ou e-mail e senha) para destacar trechos e fazer anotações — elas ficam salvas em <a href="' + PAGINA + '">Meus Cadernos</a>.</p>';
      return;
    }
    var html = '<div class="section-label">Minhas marcações</div>';
    if (!lst.length) html += '<p class="cad-dica">Selecione um trecho do texto acima para destacar ou anotar. Tudo fica salvo em <a href="' + PAGINA + '">Meus Cadernos</a>.</p>';
    else {
      html += '<ul class="cad-lista">' + lst.map(function (m) {
        return '<li class="cad-item cad-borda-' + esc(m.cor) + '"><button type="button" class="cad-item-btn" data-marca="' + esc(m.id) + '">' +
          '<span class="cad-trecho">“' + esc(m.trecho.length > 220 ? m.trecho.slice(0, 220) + "…" : m.trecho) + '”</span>' +
          (m.nota ? '<span class="cad-nota">' + esc(m.nota) + "</span>" : "") +
          '<span class="cad-onde">' + esc(nomeCaderno(m.caderno)) + "</span></button></li>";
      }).join("") + "</ul>" +
      '<p class="cad-dica"><a href="' + PAGINA + '">Abrir Meus Cadernos →</a></p>';
    }
    caixa.innerHTML = html;
  }

  // ---- barrinha (selecionar → destacar/anotar) e quadro de edição ------------
  var barra = document.createElement("div");
  barra.className = "cad-barra";
  barra.hidden = true;
  barra.setAttribute("role", "dialog");
  document.body.appendChild(barra);
  var selecaoAtual = null;   // { secao, inicio, fim, trecho }

  function esconderBarra() { barra.hidden = true; selecaoAtual = null; }

  function posicionar(ret) {
    barra.hidden = false;
    var w = barra.offsetWidth, h = barra.offsetHeight;
    var x = Math.min(Math.max(8, ret.left + ret.width / 2 - w / 2), window.innerWidth - w - 8);
    // no celular o menu do próprio aparelho aparece em cima da seleção: a barrinha vai embaixo
    var toque = window.matchMedia && window.matchMedia("(pointer: coarse)").matches;
    var y = toque ? ret.bottom + 12 : ret.top - h - 8;
    if (y < 8 || y + h > window.innerHeight - 8) y = toque ? ret.top - h - 8 : ret.bottom + 8;
    y = Math.min(Math.max(8, y), window.innerHeight - h - 8);
    barra.style.left = x + "px";
    barra.style.top = y + "px";
  }

  function opcoesCaderno(sel) {
    return meta.cadernos.map(function (c) {
      return '<option value="' + esc(c.id) + '"' + (c.id === sel ? " selected" : "") + ">" + esc(c.nome) + "</option>";
    }).join("") + '<option value="__novo">+ Novo caderno…</option>';
  }
  function trocarCaderno(select, aoEscolher) {
    select.addEventListener("change", function () {
      if (select.value !== "__novo") { aoEscolher(select.value); return; }
      var nome = window.prompt("Nome do novo caderno:");
      if (!nome || !nome.trim()) { select.value = meta.atual || ""; return; }
      criarCaderno(nome).then(function (c) { aoEscolher(c.id); });
    });
  }

  function mostrarBarraNova(ret) {
    if (!uid) {
      barra.innerHTML = '<p class="cad-barra-msg">Entre na sua conta para destacar e anotar.</p>';
      posicionar(ret);
      return;
    }
    barra.innerHTML =
      '<div class="cad-barra-linha">' +
        CORES.map(function (c) { return '<button type="button" class="cad-cor cad-' + c.id + '" data-cor="' + c.id + '" title="Destacar em ' + c.nome.toLowerCase() + '" aria-label="Destacar em ' + c.nome.toLowerCase() + '"></button>'; }).join("") +
        '<button type="button" class="cad-acao" data-acao="anotar">📝 Anotar</button>' +
      "</div>" +
      (meta.cadernos.length > 1 ? '<label class="cad-barra-cad">Caderno <select>' + opcoesCaderno(meta.atual) + "</select></label>" : "");
    var sel = barra.querySelector("select");
    if (sel) trocarCaderno(sel, function (id) { escolherAtual(id); });
    posicionar(ret);
  }

  function editor(m, ret) {
    // m: marca existente, ou { novo: true, ...seleção }
    barra.innerHTML =
      '<div class="cad-barra-linha">' +
        CORES.map(function (c) { return '<button type="button" class="cad-cor cad-' + c.id + (m.cor === c.id ? " is-on" : "") + '" data-cor-ed="' + c.id + '" aria-label="' + c.nome + '"></button>'; }).join("") +
        (m.novo ? "" : '<button type="button" class="cad-acao cad-perigo" data-acao="apagar">Apagar</button>') +
      "</div>" +
      '<textarea class="cad-texto" rows="3" maxlength="' + LIMITE_NOTA + '" placeholder="Sua anotação (opcional)">' + esc(m.nota || "") + "</textarea>" +
      '<label class="cad-barra-cad">Caderno <select>' + opcoesCaderno(m.caderno || meta.atual) + "</select></label>" +
      '<div class="cad-barra-linha cad-fim"><button type="button" class="cad-acao" data-acao="cancelar">Cancelar</button>' +
      '<button type="button" class="cad-acao cad-salvar" data-acao="salvar">Salvar</button></div>';
    var estado = { cor: m.cor || "amarelo", caderno: m.caderno || meta.atual };
    trocarCaderno(barra.querySelector("select"), function (id) { estado.caderno = id; });
    barra.querySelectorAll("[data-cor-ed]").forEach(function (b) {
      b.addEventListener("click", function () {
        estado.cor = b.getAttribute("data-cor-ed");
        barra.querySelectorAll("[data-cor-ed]").forEach(function (x) { x.classList.toggle("is-on", x === b); });
      });
    });
    barra.querySelector('[data-acao="salvar"]').addEventListener("click", function () {
      var nota = barra.querySelector("textarea").value.trim();
      var feito = m.novo
        ? (estado.caderno ? escolherAtual(estado.caderno) : Promise.resolve()).then(function () { return criarMarca(dadosNova(m, estado.cor, nota)); })
        : mudarMarca(m.id, { cor: estado.cor, nota: nota, caderno: estado.caderno || m.caderno });
      feito.then(esconderBarra, function () { window.alert("Não foi possível salvar agora. Tente de novo."); });
    });
    barra.querySelector('[data-acao="cancelar"]').addEventListener("click", esconderBarra);
    var ap = barra.querySelector('[data-acao="apagar"]');
    if (ap) ap.addEventListener("click", function () {
      if (!window.confirm("Apagar esta marcação" + (m.nota ? " e a anotação" : "") + "?")) return;
      apagarMarca(m.id).then(esconderBarra);
    });
    posicionar(ret);
    var ta = barra.querySelector("textarea");
    if (ta && (m.novo || m.nota)) ta.focus();
  }

  function dadosNova(s, cor, nota) {
    var info = ligado.info;
    return {
      fonte: info.fonte, item: String(info.item), titulo: String(info.titulo || "").slice(0, 400),
      origem: String(info.origem || "").slice(0, 300), abrir: String(info.abrir || "").slice(0, 600),
      secao: s.secao, inicio: s.inicio, fim: s.fim, trecho: s.trecho, cor: cor, nota: nota || ""
    };
  }

  barra.addEventListener("mousedown", function (e) {
    // não perde a seleção ao clicar nos botões (mas deixa digitar/escolher)
    if (!e.target.closest("textarea, select")) e.preventDefault();
  });
  barra.addEventListener("click", function (e) {
    var b = e.target.closest("[data-cor], [data-acao=anotar]");
    if (!b || !selecaoAtual) return;
    var s = selecaoAtual, ret = barra.getBoundingClientRect();
    if (b.hasAttribute("data-cor")) {
      criarMarca(dadosNova(s, b.getAttribute("data-cor"), ""))
        .catch(function () { window.alert("Não foi possível salvar agora. Tente de novo."); });
      var sel = window.getSelection(); if (sel) sel.removeAllRanges();
      esconderBarra();
    } else {
      editor({ novo: true, secao: s.secao, inicio: s.inicio, fim: s.fim, trecho: s.trecho, cor: "amarelo" },
        { left: ret.left, width: ret.width, top: ret.top + ret.height, bottom: ret.top + ret.height });
      selecaoAtual = s;
    }
  });

  function verSelecao() {
    if (!ligado) return;
    if (!barra.hidden && barra.querySelector("textarea")) return;   // editando
    var sel = window.getSelection();
    if (!sel || sel.isCollapsed || !sel.rangeCount) { esconderBarra(); return; }
    var r = sel.getRangeAt(0), areas = ligado.areas, secao = -1;
    for (var i = 0; i < areas.length; i++) {
      if (areas[i].contains(r.startContainer) && areas[i].contains(r.endContainer)) { secao = i; break; }
    }
    if (secao < 0) { esconderBarra(); return; }
    var area = areas[secao];
    var ini = posicao(area, r.startContainer, r.startOffset), fim = posicao(area, r.endContainer, r.endOffset);
    var txt = area.textContent;
    while (ini < fim && /\s/.test(txt.charAt(ini))) ini++;
    while (fim > ini && /\s/.test(txt.charAt(fim - 1))) fim--;
    if (fim - ini < 2) { esconderBarra(); return; }
    selecaoAtual = { secao: secao, inicio: ini, fim: fim, trecho: txt.slice(ini, fim) };
    mostrarBarraNova(r.getBoundingClientRect());
  }
  var selTimer = null;
  document.addEventListener("selectionchange", function () {
    if (!ligado) return;
    clearTimeout(selTimer);
    selTimer = setTimeout(verSelecao, 350);
  });
  document.addEventListener("mousedown", function (e) {
    if (!barra.hidden && !barra.contains(e.target) && !e.target.closest("mark.cad-mark, .cad-item-btn")) esconderBarra();
  });
  window.addEventListener("resize", esconderBarra);

  function abrirMarca(id, el) {
    var m = marcas[id];
    if (!m) return;
    var sel = window.getSelection(); if (sel) sel.removeAllRanges();
    editor(m, el.getBoundingClientRect());
  }

  // ---- API ---------------------------------------------------------------
  function ligar(modal, info) {
    desligar();
    var areas = (info.areas || []).filter(Boolean);
    var caixa = document.createElement("div");
    caixa.className = "cad-caixa";
    modal.appendChild(caixa);
    var noModal = function (e) {
      var mk = e.target.closest("mark.cad-mark, .cad-item-btn");
      if (!mk) return;
      var s = window.getSelection();
      if (mk.tagName === "MARK" && s && !s.isCollapsed) return;   // selecionando por cima
      abrirMarca(mk.getAttribute("data-marca"), mk);
    };
    var aoRolar = function () { if (!barra.querySelector("textarea")) esconderBarra(); };
    modal.addEventListener("click", noModal);
    modal.addEventListener("scroll", aoRolar);
    ligado = { modal: modal, info: info, areas: areas, caixa: caixa, noModal: noModal, aoRolar: aoRolar };
    aplicarDestaques();
    desenharLista();
  }
  function desligar() {
    if (!ligado) return;
    ligado.modal.removeEventListener("click", ligado.noModal);
    ligado.modal.removeEventListener("scroll", ligado.aoRolar);
    ligado = null;
    esconderBarra();
  }

  window.EstudaManaCadernos = {
    ligar: ligar,
    desligar: desligar,
    pronto: function () { return iniciado; },
    aoMudar: function (fn) { ouvintes.push(fn); },
    // usados pela página Meus Cadernos (cadernos-pagina.js)
    estado: function () { return { uid: uid, conhecida: contaConhecida, carregado: carregado, cadernos: meta.cadernos.slice(), atual: meta.atual, marcas: listaMarcas() }; },
    criarCaderno: criarCaderno,
    renomearCaderno: renomearCaderno,
    apagarCaderno: apagarCaderno,
    mudarMarca: mudarMarca,
    apagarMarca: apagarMarca,
    nomeCaderno: nomeCaderno,
    CORES: CORES
  };
})();
