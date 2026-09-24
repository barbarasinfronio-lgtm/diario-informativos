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
    return String(t || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

  function lerStorage(k) {
    try { return localStorage.getItem(k) || ""; } catch (e) { return ""; }
  }

  function gravarStorage(k, v) {
    try { localStorage.setItem(k, v); } catch (e) {}
  }

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
          materia: bloco.label || mat,
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
    return '<div style="background:#fff;border:1px solid #e2e8f0;border-radius:8px;padding:14px 16px;margin-bottom:10px;box-shadow:0 1px 3px rgba(0,0,0,.04);">' +
      '<div style="display:flex;justify-content:space-between;align-items:flex-start;gap:10px;">' +
      '<h3 style="margin:0;font-size:15px;font-weight:600;color:#1e293b;line-height:1.4;">' + escapeHtml(lei.nome) + "</h3>" +
      '<span style="font-size:11px;font-weight:700;background:' + fundo + ";color:" + cor + ';padding:3px 8px;border-radius:12px;white-space:nowrap;">' + badge + "</span>" +
      "</div>" +
      '<p style="margin:6px 0 10px;font-size:13px;color:#64748b;">' + escapeHtml(lei.numero) + "</p>" +
      (lei.link
        ? '<a href="' + escapeHtml(lei.link) + '" target="_blank" rel="noopener noreferrer" style="font-size:13px;font-weight:600;color:#0d6efd;text-decoration:none;">📖 Abrir lei na íntegra ↗</a>'
        : "") +
      "</div>";
  }

  // Agrupa por matéria em blocos que abrem e fecham (a lista federal é longa).
  function porMateria(leis, abrir) {
    var ordem = [], grupos = {};
    leis.forEach(function (l) {
      if (!grupos[l.materia]) { grupos[l.materia] = []; ordem.push(l.materia); }
      grupos[l.materia].push(l);
    });
    return ordem.map(function (mat) {
      return '<details style="margin-bottom:10px;"' + (abrir ? " open" : "") + ">" +
        '<summary style="cursor:pointer;font-weight:600;font-size:15px;color:#334155;padding:8px 0;">' +
        escapeHtml(mat) + ' <span style="color:#94a3b8;font-weight:400;">(' + grupos[mat].length + ")</span></summary>" +
        '<div style="padding-top:6px;">' + grupos[mat].map(card).join("") + "</div>" +
        "</details>";
    }).join("");
  }

  function aviso(texto) {
    return '<p style="color:#94a3b8;font-style:italic;">' + texto + "</p>";
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
        ? porMateria(federais, buscando)
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
        ? porMateria(estaduais, true)
        : aviso(buscando
            ? "Nenhuma lei estadual encontrada para essa busca."
            : "Ainda não há leis estaduais de " + escapeHtml(UF_NOME[uf] || uf) + " cadastradas.");
    }

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

    render();
  }

  Promise.all([
    ensure("LEIS_DATA", "leis-data.js"),
    ensure("EDITAIS_DATA", "editais-data.js"),
    domReady()
  ]).then(iniciar);
})();
