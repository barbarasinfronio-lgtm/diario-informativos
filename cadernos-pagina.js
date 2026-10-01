/* =====================================================================
   cadernos-pagina.js — página "Meus Cadernos" (/p/meus-cadernos.html)
   Mostra os destaques e anotações da pessoa (feitos nos cards abertos do
   Diário das Decisões — ver cadernos.js), separados por caderno e
   agrupados por decisão. Dá para buscar, filtrar por cor, editar a
   anotação, trocar de caderno, apagar, criar/renomear/apagar cadernos e
   imprimir (ou salvar em PDF pelo "Imprimir" do navegador).
   No HTML da página do Blogger basta: <div id="meus-cadernos"></div>
   ===================================================================== */
(function () {
  var BASE = "https://barbarasinfronio-lgtm.github.io/diario-informativos/";
  var raiz = document.getElementById("meus-cadernos");
  if (!raiz || raiz.getAttribute("data-pronto")) return;
  raiz.setAttribute("data-pronto", "1");
  raiz.classList.add("cad-pg");

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function semAcento(t) { return String(t || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, ""); }
  function dataBr(iso) { var m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso || ""); return m ? m[3] + "/" + m[2] + "/" + m[1] : ""; }

  var C = null;
  var filtro = { caderno: "todos", cor: "todas", q: "" };
  var editando = null;   // id da marca com a anotação aberta para edição

  function carregarCadernos() {
    if (window.EstudaManaCadernos) return Promise.resolve();
    return fetch(BASE + "cadernos.js", { cache: "no-cache" })
      .then(function (r) { if (!r.ok) throw new Error(r.status); return r.text(); })
      .then(function (code) { (0, eval)(code + "\n//# sourceURL=" + BASE + "cadernos.js"); });
  }

  raiz.innerHTML = '<p class="cad-dica">Carregando seus cadernos…</p>';
  carregarCadernos().then(function () {
    C = window.EstudaManaCadernos;
    C.aoMudar(desenhar);
    return C.pronto();
  }).then(desenhar).catch(function () {
    raiz.innerHTML = '<p class="cad-aviso">Não foi possível carregar agora. Recarregue a página.</p>';
  });

  var loginMostrado = false;
  function desenhar() {
    if (!C) return;
    var st = C.estado();
    if (!st.conhecida) { raiz.innerHTML = '<p class="cad-dica">Carregando seus cadernos…</p>'; return; }
    if (!st.uid) {
      raiz.innerHTML = '<p class="cad-aviso">Entre na sua conta (Google ou e-mail e senha) para ver seus cadernos. ' +
        'Os destaques e anotações são feitos nos cards abertos do <a href="/p/diario-das-decisoes.html">Diário das Decisões</a>: ' +
        'selecione um trecho e escolha a cor ou "Anotar".</p>';
      if (!loginMostrado && window.EstudaManaNuvem) { loginMostrado = true; window.EstudaManaNuvem.mostrarLogin(raiz); }
      return;
    }
    if (!st.carregado) { raiz.innerHTML = '<p class="cad-dica">Carregando seus cadernos…</p>'; return; }
    // não redesenha por cima de uma anotação sendo digitada
    if (editando && raiz.querySelector('textarea[data-editando="' + editando + '"]') && document.activeElement && document.activeElement.tagName === "TEXTAREA") return;
    var foco = document.activeElement && document.activeElement.id === "cad-busca";

    var porCaderno = {};
    st.marcas.forEach(function (m) { porCaderno[m.caderno] = (porCaderno[m.caderno] || 0) + 1; });
    if (filtro.caderno !== "todos" && !st.cadernos.some(function (c) { return c.id === filtro.caderno; })) filtro.caderno = "todos";

    var html = '<div class="cad-abas" role="tablist">' +
      '<button type="button" class="cad-aba' + (filtro.caderno === "todos" ? " is-on" : "") + '" data-cad="todos">Todos<span class="n">' + st.marcas.length + "</span></button>" +
      st.cadernos.map(function (c) {
        return '<button type="button" class="cad-aba' + (filtro.caderno === c.id ? " is-on" : "") + '" data-cad="' + esc(c.id) + '">' + esc(c.nome) + '<span class="n">' + (porCaderno[c.id] || 0) + "</span></button>";
      }).join("") +
      '<button type="button" class="cad-aba" data-novo="1">+ Novo caderno</button></div>';
    if (filtro.caderno !== "todos") {
      html += '<div class="cad-acoes-caderno"><button type="button" class="cad-acao" data-ren="1">Renomear caderno</button>' +
        '<button type="button" class="cad-acao cad-perigo" data-apg="1" style="margin-left:0">Apagar caderno</button></div>';
    }
    html += '<div class="cad-ferramentas">' +
      '<input type="search" id="cad-busca" placeholder="Buscar nas marcações e anotações" value="' + esc(filtro.q) + '">' +
      '<span class="cad-filtro-cor" title="Filtrar por cor">' +
        '<button type="button" class="cad-cor cad-todas' + (filtro.cor === "todas" ? " is-on" : "") + '" data-fcor="todas" aria-label="Todas as cores"></button>' +
        C.CORES.map(function (c) { return '<button type="button" class="cad-cor cad-' + c.id + (filtro.cor === c.id ? " is-on" : "") + '" data-fcor="' + c.id + '" aria-label="Só ' + c.nome.toLowerCase() + '"></button>'; }).join("") +
      "</span>" +
      '<button type="button" class="cad-acao" data-imprimir="1">🖨 Imprimir / PDF</button></div>';

    var ts = semAcento(filtro.q).split(/\s+/).filter(function (t) { return t.length >= 2; });
    var lista = st.marcas.filter(function (m) {
      if (filtro.caderno !== "todos" && m.caderno !== filtro.caderno) return false;
      if (filtro.cor !== "todas" && m.cor !== filtro.cor) return false;
      if (ts.length) {
        var h = semAcento([m.trecho, m.nota, m.titulo, m.origem].join(" "));
        for (var i = 0; i < ts.length; i++) if (h.indexOf(ts[i]) === -1) return false;
      }
      return true;
    });

    // agrupa por decisão; decisões com marcação mais recente primeiro
    var grupos = {}, ordem = [];
    lista.forEach(function (m) {
      var k = m.fonte + "|" + m.item;
      if (!grupos[k]) { grupos[k] = { titulo: m.titulo, origem: m.origem, abrir: m.abrir, marcas: [], recente: "" }; ordem.push(k); }
      var g = grupos[k];
      g.marcas.push(m);
      if ((m.atualizadoEm || "") > g.recente) g.recente = m.atualizadoEm || "";
    });
    ordem.sort(function (a, b) { return grupos[a].recente < grupos[b].recente ? 1 : -1; });

    if (!st.marcas.length) {
      html += '<p class="cad-vazio">Seu caderno ainda está vazio. Abra um card no <a href="/p/diario-das-decisoes.html">Diário das Decisões</a>, selecione um trecho e escolha uma cor ou "Anotar".</p>';
    } else if (!ordem.length) {
      html += '<p class="cad-vazio">Nenhuma marcação com esse filtro.</p>';
    } else {
      html += ordem.map(function (k) {
        var g = grupos[k];
        g.marcas.sort(function (a, b) { return (a.secao - b.secao) || (a.inicio - b.inicio); });
        return '<section class="cad-grupo">' +
          (g.origem ? '<p class="cad-grupo-orig">' + esc(g.origem) + "</p>" : "") +
          "<h2>" + (g.abrir ? '<a href="' + esc(g.abrir) + '">' + esc(g.titulo || "Decisão") + " ↗</a>" : esc(g.titulo || "Decisão")) + "</h2>" +
          g.marcas.map(marcaHtml(st)).join("") + "</section>";
      }).join("");
    }
    raiz.innerHTML = html;
    if (foco) { var b = document.getElementById("cad-busca"); b.focus(); b.setSelectionRange(b.value.length, b.value.length); }
  }

  function marcaHtml(st) {
    return function (m) {
      var opc = st.cadernos.map(function (c) {
        return '<option value="' + esc(c.id) + '"' + (c.id === m.caderno ? " selected" : "") + ">" + esc(c.nome) + "</option>";
      }).join("");
      var ed = editando === m.id;
      return '<div class="cad-marca cad-borda-' + esc(m.cor) + '" data-marca="' + esc(m.id) + '">' +
        "<blockquote>“" + esc(m.trecho) + "”</blockquote>" +
        (ed ? '<textarea class="cad-texto" rows="3" data-editando="' + esc(m.id) + '" placeholder="Sua anotação">' + esc(m.nota) + "</textarea>"
            : (m.nota ? '<span class="cad-nota">' + esc(m.nota) + "</span>" : "")) +
        '<div class="cad-marca-rodape">' +
          (ed ? '<button type="button" class="cad-acao cad-salvar" data-salvar="1">Salvar</button><button type="button" class="cad-acao" data-cancelar="1">Cancelar</button>'
              : '<button type="button" class="cad-acao" data-editar="1">' + (m.nota ? "Editar anotação" : "📝 Anotar") + "</button>") +
          C.CORES.map(function (c) { return '<button type="button" class="cad-cor cad-' + c.id + (m.cor === c.id ? " is-on" : "") + '" data-cor="' + c.id + '" style="width:18px;height:18px" aria-label="' + c.nome + '"></button>'; }).join("") +
          '<select data-mover="1" aria-label="Caderno">' + opc + "</select>" +
          "<span>" + esc(dataBr(m.criadoEm)) + "</span>" +
          '<button type="button" class="cad-acao cad-perigo" data-apagar="1">Apagar</button>' +
        "</div></div>";
    };
  }

  // ---- ações ----
  function erro() { window.alert("Não foi possível salvar agora. Tente de novo."); }
  raiz.addEventListener("click", function (e) {
    var t = e.target.closest("button");
    if (!t || !C) return;
    var st = C.estado();
    if (t.hasAttribute("data-cad")) { filtro.caderno = t.getAttribute("data-cad"); desenhar(); return; }
    if (t.hasAttribute("data-novo")) {
      var nome = window.prompt("Nome do novo caderno:");
      if (nome && nome.trim()) C.criarCaderno(nome).then(function (c) { filtro.caderno = c.id; desenhar(); }, erro);
      return;
    }
    if (t.hasAttribute("data-ren")) {
      var atual = C.nomeCaderno(filtro.caderno);
      var novo = window.prompt("Novo nome do caderno:", atual);
      if (novo && novo.trim() && novo !== atual) C.renomearCaderno(filtro.caderno, novo).catch(erro);
      return;
    }
    if (t.hasAttribute("data-apg")) {
      var n = st.marcas.filter(function (m) { return m.caderno === filtro.caderno; }).length;
      var outros = st.cadernos.filter(function (c) { return c.id !== filtro.caderno; });
      var msg = 'Apagar o caderno "' + C.nomeCaderno(filtro.caderno) + '"?' +
        (n ? "\n\nAs " + n + " marcações dele não serão apagadas: vão para o caderno \"" + (outros.length ? outros[0].nome : "Geral") + "\"." : "");
      if (window.confirm(msg)) { var id = filtro.caderno; filtro.caderno = "todos"; C.apagarCaderno(id).catch(erro); }
      return;
    }
    if (t.hasAttribute("data-fcor")) { filtro.cor = t.getAttribute("data-fcor"); desenhar(); return; }
    if (t.hasAttribute("data-imprimir")) { window.print(); return; }

    var box = t.closest("[data-marca]");
    if (!box) return;
    var mid = box.getAttribute("data-marca");
    if (t.hasAttribute("data-editar")) { editando = mid; desenhar(); var ta = box.ownerDocument.querySelector('textarea[data-editando="' + mid + '"]'); if (ta) ta.focus(); return; }
    if (t.hasAttribute("data-cancelar")) { editando = null; desenhar(); return; }
    if (t.hasAttribute("data-salvar")) {
      var txt = raiz.querySelector('textarea[data-editando="' + mid + '"]');
      editando = null;
      C.mudarMarca(mid, { nota: txt ? txt.value.trim() : "" }).then(desenhar, erro);
      return;
    }
    if (t.hasAttribute("data-cor")) { C.mudarMarca(mid, { cor: t.getAttribute("data-cor") }).catch(erro); return; }
    if (t.hasAttribute("data-apagar")) {
      if (window.confirm("Apagar esta marcação?")) C.apagarMarca(mid).catch(erro);
    }
  });
  raiz.addEventListener("change", function (e) {
    var s = e.target.closest("select[data-mover]");
    if (!s) return;
    C.mudarMarca(s.closest("[data-marca]").getAttribute("data-marca"), { caderno: s.value }).catch(erro);
  });
  var buscaTimer = null;
  raiz.addEventListener("input", function (e) {
    if (e.target.id !== "cad-busca") return;
    filtro.q = e.target.value;
    clearTimeout(buscaTimer);
    buscaTimer = setTimeout(desenhar, 200);
  });
})();
