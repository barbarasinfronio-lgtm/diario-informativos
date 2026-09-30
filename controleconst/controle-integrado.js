/* Controle de constitucionalidade dentro do Diário das Decisões.
 *
 * Carregado por rg-repetitivos-logic.js quando a pessoa escolhe o botão
 * "Controle" (ADI, ADPF, ADC, ADO). Usa os mesmos dados de
 * controleconst/anos/ e guarda a leitura no mesmo lugar do antigo Diário de
 * Constitucionalidade (em_lidos_constitucionalidades → progress-adi/<uid> →
 * "lidasAdi" nos grupos), então nada do que já estava marcado se perde e
 * Prêmios e Meus Grupos continuam contando.
 *
 *   ControleIntegrado.montar({ antes: <elemento>, busca: () => texto })
 *   -> { mostrar(), esconder(), buscaMudou() }
 */
(function () {
  "use strict";
  var BASE_ANOS = "https://cdn.jsdelivr.net/gh/barbarasinfronio-lgtm/diario-informativos@main/controleconst/anos/";
  var URL_STF = "https://portal.stf.jus.br/processos/detalhe.asp?processo=";
  var STORAGE_KEY = "em_lidos_constitucionalidades";
  var CLASSES = ["ADI", "ADPF", "ADC", "ADO"];
  var NOME_CLASSE = { ADI: "Ação Direta de Inconstitucionalidade", ADPF: "Arguição de Descumprimento de Preceito Fundamental", ADC: "Ação Declaratória de Constitucionalidade", ADO: "Ação Direta de Inconstitucionalidade por Omissão" };

  function lerLidos() { try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}") || {}; } catch (e) { return {}; } }
  var lidos = lerLidos();
  function gravarLidos() { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(lidos)); } catch (e) {} }

  var indice = null, carregados = {}, pedidos = {};
  var filtroClasse = "todas", filtroAno = "todos", loteTam = 10, loteAtual = 0, seq = 0;
  var root, chipsEl, anoSel, listEl, infoEl, pagerEl, prevBtn, nextBtn, labelEl, getBusca, visivel = false;

  // ---- utilidades ---------------------------------------------------------
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function semAcento(t) { return String(t == null ? "" : t).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, ""); }
  var PLURAIS = [["coes", "cao"], ["cao", "coes"], ["oes", "ao"], ["ao", "oes"], ["ais", "al"], ["al", "ais"], ["eis", "el"], ["el", "eis"], ["s", ""]];
  function variantes(t) {
    var v = [t];
    PLURAIS.forEach(function (r) { if (t.length > 3 && t.slice(-r[0].length) === r[0]) v.push(t.slice(0, t.length - r[0].length) + r[1]); });
    return v;
  }
  function termos() { return semAcento(getBusca ? getBusca() : "").split(/\s+/).filter(Boolean); }
  function combinaBusca(item, ts) {
    if (!ts.length) return true;
    var h = semAcento([item.processo, item.classe, formatarData(item.data), item.data, item.ano, item.relator, limparTexto(item.tema || item.tese || item.resumo)].join(" "));
    return ts.every(function (t) { return variantes(t).some(function (x) { return h.indexOf(x) !== -1; }); });
  }
  function formatarData(d) { var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(d || "")); return m ? m[3] + "/" + m[2] + "/" + m[1] : ""; }
  function safeUrl(u) { var s = String(u || ""); if (!/^https?:\/\//i.test(s)) return "#"; try { return encodeURI(decodeURI(s)); } catch (e) { return encodeURI(s); } }
  var LIMITE_TEXTO = 250;
  function limparTexto(t) {
    var original = String(t == null ? "" : t);
    var s = original.replace(/_x([0-9A-Fa-f]{4})_/g, function (m, hex) { return String.fromCharCode(parseInt(hex, 16)); })
      .replace(/">\.\./g, '"...').replace(/[\s ]+/g, " ").trim();
    if (/^sem descri[cç][aã]o$/i.test(s)) return "";
    if (original.length >= LIMITE_TEXTO - 5 && !/[.!?…"”)]$/.test(s)) {
      s = s.replace(/\s+\S*$/, "").replace(/[,;:\s]+$/, "");
      s += /[.!?]$/.test(s) ? " …" : "…";
    }
    return s;
  }

  // ---- dados --------------------------------------------------------------
  function buscarJson(nome) {
    return fetch(BASE_ANOS + nome, { cache: "no-cache" }).then(function (r) { if (!r.ok) throw new Error(nome + " " + r.status); return r.json(); });
  }
  function carregarIndice() { return indice ? Promise.resolve() : buscarJson("index.json").then(function (i) { indice = i; }); }
  function carregarAno(ano) {
    if (carregados[ano]) return Promise.resolve();
    if (!pedidos[ano]) pedidos[ano] = buscarJson(ano + ".json").then(function (l) { carregados[ano] = l; }).catch(function (e) { delete pedidos[ano]; throw e; });
    return pedidos[ano];
  }
  function anosRel() { return indice.anos.filter(function (a) { return filtroAno === "todos" || a.ano === String(filtroAno); }); }
  function combina(it) { return filtroClasse === "todas" || it.classe === filtroClasse; }
  function totalBase() {
    return anosRel().reduce(function (s, a) { return s + (filtroClasse === "todas" ? a.total : (a.grupos[filtroClasse] || 0)); }, 0);
  }
  function carregadosFiltrados(ts) {
    var out = [];
    for (var i = 0, rel = anosRel(); i < rel.length; i++) {
      if (!carregados[rel[i].ano]) break;
      carregados[rel[i].ano].forEach(function (it) { if (combina(it) && combinaBusca(it, ts)) out.push(it); });
    }
    return out;
  }
  function contarLidos() {
    var rel = anosRel();
    if (rel.every(function (a) { return carregados[a.ano]; })) {
      var n = 0;
      rel.forEach(function (a) { carregados[a.ano].forEach(function (it) { if (combina(it) && lidos[it.id]) n++; }); });
      return n;
    }
    return Object.keys(lidos).filter(function (id) {
      var p = id.split("_");
      var ano = /^\d{8}$/.test(p[3] || "") ? p[3].slice(0, 4) : "sem-ano";
      return (filtroClasse === "todas" || p[1] === filtroClasse) && (filtroAno === "todos" || ano === String(filtroAno));
    }).length;
  }

  // ---- conta / grupos (mesmo esquema do antigo diário) -----------------------
  var nuvemP = null, salvarNuvem = function () {}, grupoTimer = null;
  function nuvem() {
    if (window.EstudaManaNuvem) return Promise.resolve(window.EstudaManaNuvem);
    if (!nuvemP) nuvemP = new Promise(function (ok, erro) {
      var s = document.createElement("script");
      s.src = "https://cdn.jsdelivr.net/gh/barbarasinfronio-lgtm/diario-informativos@main/nuvem-shared.js";
      s.onload = function () { ok(window.EstudaManaNuvem); };
      s.onerror = erro;
      document.head.appendChild(s);
    });
    return nuvemP;
  }
  function enviarGrupos() {
    clearTimeout(grupoTimer);
    var tem = false;
    try { var g = JSON.parse(localStorage.getItem("informativos-grupo") || "null"); tem = !!(g && (g.length || g.code)); } catch (e) {}
    if (!tem) return;
    grupoTimer = setTimeout(function () {
      var total = Object.keys(lidos).length;
      nuvem().then(function (N) { N.enviarGrupos("lidasAdi", total); }).catch(function () {});
    }, 800);
  }
  function ligarConta() {
    nuvem().then(function (N) {
      salvarNuvem = N.sincronizarLidos({
        caminho: "progress-adi/",
        ler: function () { return lidos; },
        gravar: function (novo) { lidos = novo; gravarLidos(); },
        aoMudar: function () { if (visivel) render(); enviarGrupos(); }
      });
    }).catch(function () {});
  }
  function alternar(id) {
    if (lidos[id]) delete lidos[id]; else lidos[id] = new Date().toISOString();
    gravarLidos(); render(); salvarNuvem(); enviarGrupos();
  }

  // ---- tela ---------------------------------------------------------------
  function montarChips() {
    if (!indice) { chipsEl.innerHTML = ""; return; }
    var tot = { todas: 0 };
    indice.anos.forEach(function (a) {
      if (filtroAno !== "todos" && a.ano !== String(filtroAno)) return;
      tot.todas += a.total;
      Object.keys(a.grupos).forEach(function (k) { tot[k] = (tot[k] || 0) + a.grupos[k]; });
    });
    chipsEl.innerHTML = "";
    [["todas", "Todas"]].concat(CLASSES.map(function (c) { return [c, c]; })).forEach(function (par) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "chip" + (filtroClasse === par[0] ? " active" : "");
      b.title = NOME_CLASSE[par[0]] || "Todas as ações";
      b.innerHTML = esc(par[1]) + ' <span class="n">' + (tot[par[0]] || 0) + "</span>";
      b.addEventListener("click", function () { filtroClasse = par[0]; loteAtual = 0; montarChips(); render(); });
      chipsEl.appendChild(b);
    });
  }

  function aviso(t) { listEl.innerHTML = '<p class="count-line" style="justify-content:center;padding:24px">' + esc(t) + "</p>"; }

  function render() {
    if (!visivel) return;
    var meu = ++seq;
    if (!indice) { aviso("Carregando julgados…"); return; }
    var ts = termos();
    var rel = anosRel();
    var pronto = !ts.length || rel.every(function (a) { return carregados[a.ano]; });
    var etapa = pronto ? Promise.resolve() : (aviso("Buscando em todos os anos…"), Promise.all(rel.map(function (a) { return carregarAno(a.ano); })));
    etapa.then(function () {
      if (meu !== seq) return;
      var total = ts.length ? carregadosFiltrados(ts).length : totalBase();
      var ini = loteAtual * loteTam, fim = Math.min(ini + loteTam, total);
      var precisa = carregadosFiltrados(ts).length < fim;
      var falta = Promise.resolve();
      if (precisa) {
        aviso("Carregando julgados…");
        falta = (function passo(i) {
          if (i >= rel.length || carregadosFiltrados(ts).length >= fim) return Promise.resolve();
          return carregarAno(rel[i].ano).then(function () { return passo(i + 1); });
        })(0);
      }
      return falta.then(function () {
        if (meu !== seq) return;
        desenhar(ts, total, ini, fim);
      });
    }).catch(function () { if (meu === seq) aviso("Não foi possível carregar os julgados. Recarregue a página."); });
  }

  function desenhar(ts, total, ini, fim) {
    var lidosN = contarLidos(), base = totalBase();
    infoEl.textContent = (ts.length ? total + (total === 1 ? " resultado" : " resultados") + " · " : "") + lidosN + " de " + base + " lidos (" + (base ? Math.round(lidosN / base * 100) : 0) + "%)";
    labelEl.textContent = total > 0 ? (ini + 1) + "–" + fim + " de " + total : "0 de 0";
    prevBtn.disabled = loteAtual === 0;
    nextBtn.disabled = fim >= total;
    var pagina = carregadosFiltrados(ts).slice(ini, fim);
    listEl.innerHTML = "";
    if (!pagina.length) { aviso("Nenhum julgado encontrado para este filtro."); return; }
    pagina.forEach(function (it) {
      var lido = !!lidos[it.id];
      var data = formatarData(it.data) || (it.ano ? String(it.ano) : "data não informada");
      var texto = limparTexto(it.tema || it.tese || it.resumo) || "Sem resumo disponível — abra o processo no STF.";
      var url = it.url || URL_STF + it.processo;
      var card = document.createElement("div");
      card.className = "card" + (lido ? " is-read" : "");
      card.innerHTML =
        '<div class="top-row"><label class="read-check" title="Marcar como lido"><input type="checkbox" class="read-checkbox"' + (lido ? " checked" : "") + "></label>" +
        '<span class="tag-org STF">STF</span><span class="tag-tema">' + esc(it.classe) + "</span></div>" +
        '<div class="area-line">' + esc(NOME_CLASSE[it.classe] || it.classe) + "</div>" +
        "<h3>" + esc(it.processo) + "</h3>" +
        '<div class="destaque">' + esc(texto) + "</div>" +
        '<div class="meta"><span>' + esc(data) + " — " + esc(it.relator || "STF") + '</span><a class="fonte-link" href="' + esc(safeUrl(url)) + '" target="_blank" rel="noopener">Abrir no STF ↗</a></div>';
      card.querySelector(".read-checkbox").addEventListener("change", function () { alternar(it.id); });
      listEl.appendChild(card);
    });
  }

  function criarUI(antes) {
    root = document.createElement("div");
    root.id = "controle-root";
    root.hidden = true;
    root.innerHTML =
      '<div class="chips" id="controle-chips" style="margin-bottom:10px"></div>' +
      '<div class="row" style="display:flex;gap:10px;flex-wrap:wrap;align-items:center;margin-bottom:8px">' +
        '<select id="controle-ano" aria-label="Ano do julgamento"><option value="todos">Todos os anos</option></select>' +
        '<span class="seg" id="controle-lote"><button type="button" data-n="10" class="active">10 em 10</button><button type="button" data-n="20">20 em 20</button></span>' +
      "</div>" +
      '<div class="count-line"><span id="controle-info"></span></div>' +
      '<div class="grid" id="controle-lista"></div>' +
      '<div style="display:flex;gap:12px;align-items:center;justify-content:center;margin:16px 0">' +
        '<button type="button" class="chip" id="controle-prev">‹ Anterior</button><span id="controle-label" class="count-line" style="margin:0"></span>' +
        '<button type="button" class="chip" id="controle-next">Próximo ›</button></div>';
    antes.parentNode.insertBefore(root, antes);
    chipsEl = root.querySelector("#controle-chips");
    anoSel = root.querySelector("#controle-ano");
    listEl = root.querySelector("#controle-lista");
    infoEl = root.querySelector("#controle-info");
    labelEl = root.querySelector("#controle-label");
    prevBtn = root.querySelector("#controle-prev");
    nextBtn = root.querySelector("#controle-next");
    anoSel.addEventListener("change", function () { filtroAno = anoSel.value; loteAtual = 0; montarChips(); render(); });
    root.querySelector("#controle-lote").addEventListener("click", function (e) {
      var b = e.target.closest("button[data-n]"); if (!b) return;
      loteTam = parseInt(b.dataset.n, 10) || 10; loteAtual = 0;
      Array.prototype.forEach.call(this.children, function (x) { x.classList.toggle("active", x === b); });
      render();
    });
    prevBtn.addEventListener("click", function () { if (loteAtual > 0) { loteAtual--; render(); root.scrollIntoView({ block: "start" }); } });
    nextBtn.addEventListener("click", function () { loteAtual++; render(); root.scrollIntoView({ block: "start" }); });
  }

  window.ControleIntegrado = {
    montar: function (opts) {
      getBusca = opts.busca;
      criarUI(opts.antes);
      ligarConta();
      enviarGrupos();
      var ctl = {
        mostrar: function () {
          visivel = true; root.hidden = false; render();
          carregarIndice().then(function () {
            if (anoSel.options.length === 1) indice.anos.filter(function (a) { return a.ano !== "sem-ano"; }).forEach(function (a) {
              var o = document.createElement("option"); o.value = a.ano; o.textContent = a.ano; anoSel.appendChild(o);
            });
            montarChips(); render();
          }).catch(function () { aviso("Não foi possível carregar os julgados. Recarregue a página."); });
        },
        esconder: function () { visivel = false; root.hidden = true; },
        buscaMudou: function () { loteAtual = 0; render(); },
        total: function () { return indice ? indice.total : null; }
      };
      return ctl;
    }
  };
})();
