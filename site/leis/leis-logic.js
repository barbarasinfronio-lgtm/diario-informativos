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
  var CDN_BASE = "https://barbarasinfronio-lgtm.github.io/diario-informativos/";

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
          busca: semAcento(l.nome + " " + l.numero + " " + (bloco.label || "") + " " + (SIGLAS_LEIS[l.numero] || "")),
          digitos: String(l.numero || "").replace(/\D/g, "")
        });
      });
    });
    return lista;
  }

  // Siglas e apelidos de leis: a busca acha "CPC" no Código de Processo Civil (que não traz a sigla no nome),
  // "CP", "CPP", "CC", "CDC", "LIA" etc. Chave = número da lei como está no leis-data.js.
  var SIGLAS_LEIS = {
    "CF/1988": "CF CRFB Constituição Federal CF/88",
    "Lei nº 13.105/2015": "CPC NCPC novo CPC CPC/2015 CPC/15",
    "Decreto-Lei nº 3.689/1941": "CPP",
    "Decreto-Lei nº 2.848/1940": "CP",
    "Lei nº 10.406/2002": "CC CC/2002",
    "Lei nº 8.078/1990": "CDC",
    "Decreto-Lei nº 5.452/1943": "CLT",
    "Lei nº 5.172/1966": "CTN",
    "Lei nº 8.069/1990": "ECA",
    "Decreto-Lei nº 4.657/1942": "LINDB LICC",
    "Lei nº 8.429/1992": "LIA improbidade",
    "Lei nº 9.099/1995": "JEC LJE juizados especiais",
    "Lei nº 12.016/2009": "MS lei do mandado de segurança",
    "Lei nº 11.340/2006": "LMP violência doméstica",
    "Lei nº 8.666/1993": "LLC lei de licitações antiga",
    "Lei nº 14.133/2021": "NLL nova lei de licitações",
    "Lei nº 7.210/1984": "LEP",
    "Lei nº 8.072/1990": "LCH",
    "Lei nº 11.343/2006": "drogas",
    "Lei nº 9.784/1999": "LPA",
    "Lei nº 8.112/1990": "RJU estatuto dos servidores federais",
    "Lei nº 8.213/1991": "LBPS",
    "Lei nº 6.015/1973": "LRP",
    "Lei nº 11.101/2005": "LREF LFRE",
    "Lei nº 6.404/1976": "LSA",
    "Lei nº 13.146/2015": "LBI EPD",
    "Lei nº 9.503/1997": "CTB",
    "Lei nº 12.965/2014": "MCI",
    "Lei nº 9.868/1999": "ADI ADC",
    "Lei nº 9.882/1999": "ADPF",
    "Lei nº 12.527/2011": "LAI",
    "Lei nº 7.347/1985": "LACP",
    "Lei nº 8.906/1994": "EOAB",
    "Lei nº 8.625/1993": "LONMP",
    "Lei nº 8.742/1993": "LOAS",
    "Lei nº 8.080/1990": "SUS"
  };

  // ---- editais e carreiras -------------------------------------------------
  // UF de um edital pela sigla: TJSP, MPMG, DPE-BA, PGE-GO, PC-AP, PCPR…
  function ufDaSigla(sigla) {
    var s = String(sigla || "").toUpperCase().replace(/[^A-Z]/g, "");
    if (s === "TJDFT" || s === "MPDFT" || s === "PCDF" || s === "PGDF") return "DF";
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

  // ---- texto das leis ("Leia-me") -----------------------------------------
  // O robô (scripts/atualizar_informativos.py, etapa LEIS) grava o texto das
  // leis do Planalto em leis/texto/<id>.json e a lista do que existe em
  // leis/texto/indice.json. O <id> é o caminho do link do Planalto, sem
  // "/ccivil_03/" nem ".htm", em minúsculas e com "-" no lugar do resto.
  var TEXTO_BASE = CDN_BASE + "leis/texto/";
  var indiceTextos = null;   // {id: data}; null enquanto não chegou
  var textosCache = {};

  function idTexto(link) {
    var l = String(link || "");
    var m = l.match(/^https?:\/\/www\.planalto\.gov\.br(\/[^?#]*)/i);
    if (m) return slug(m[1].replace(/^\/ccivil_03\//i, "").replace(/\.html?$/i, ""));
    // outros sites (leis estaduais): igual ao id_texto() do robô
    m = l.match(/^https?:\/\/(?:www\.)?([^\/?#]+)([^?#]*)(?:\?([^#]*))?/i);
    if (!m) return "";
    var s = slug(m[1] + m[2] + (m[3] ? "?" + m[3] : ""));
    if (s.length > 90) {
      var h = 0x811c9dc5;
      for (var i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 0x01000193) >>> 0;
      s = s.slice(0, 80) + "-" + ("00000000" + h.toString(16)).slice(-8);
    }
    return s;
  }

  function temTexto(id) { return !!(id && indiceTextos && indiceTextos[id]); }

  // Leis que não estão no Diário mas são citadas nas decisões: o robô (scripts/leis_citadas.py) grava o
  // texto delas e a lista "tipo-número-ano" → id em leis/texto/citadas.json. Serve às leis que a pessoa incluiu.
  var citadas = null, citadasPedido = null;
  function chaveCitada(rotulo) {
    var m = String(rotulo || "").match(/^\s*(Lei Complementar|Lei|LC|Decreto[\s-]Lei|Decreto)\s*(?:Federal\s*)?(?:n[ºo°.]*\s*)?(\d{1,3}(?:\.\d{3})*)\s*\/\s*(\d{4}|\d{2})\b/i);
    if (!m) return "";
    var t = /complementar|^lc$/i.test(m[1]) ? "lc" : /decreto[\s-]lei/i.test(m[1]) ? "dl" : /decreto/i.test(m[1]) ? "decreto" : "lei";
    var a = m[3].length === 4 ? m[3] : (Number(m[3]) > 30 ? "19" : "20") + m[3];
    return t + "-" + m[2].replace(/\./g, "") + "-" + a;
  }
  function carregarCitadas() {
    if (!citadasPedido) citadasPedido = fetch(TEXTO_BASE + "citadas.json", { cache: "no-cache" })
      .then(function (r) { return r.ok ? r.json() : {}; }).catch(function () { return {}; })
      .then(function (j) { citadas = j || {}; return citadas; });
    return citadasPedido;
  }

  function carregarIndiceTextos() {
    return fetch(TEXTO_BASE + "indice.json", { cache: "no-cache" })
      .then(function (r) { return r.ok ? r.json() : {}; })
      .catch(function () { return {}; })
      .then(function (j) {
        indiceTextos = j || {};
        // mostra o botão nos cards que já estão na tela (sem refazer a lista)
        Array.prototype.forEach.call(document.querySelectorAll(".lei-leia"), function (b) {
          if (temTexto(b.getAttribute("data-texto-id"))) b.style.display = "";
        });
      });
  }

  // "Com julgados" (scripts/gerar_julgados_por_artigo.js): leis cujo texto traz, ao lado de cada artigo, até 2
  // decisões do site que tratam dele. leis/julgados/indice.json diz quais leis têm; <id>.json traz os dados.
  var julgadosIdx = null, julgadosCache = {};
  function carregarIndiceJulgados() {
    return fetch(CDN_BASE + "leis/julgados/indice.json", { cache: "no-cache" })
      .then(function (r) { return r.ok ? r.json() : {}; })
      .catch(function () { return {}; })
      .then(function (j) {
        julgadosIdx = j || {};
        Array.prototype.forEach.call(document.querySelectorAll(".lei-leia-julg"), function (b) {
          if (julgadosIdx[b.getAttribute("data-texto-id")]) b.style.display = "";
        });
      });
  }
  function carregarJulgados(id) {
    if (!julgadosCache[id]) julgadosCache[id] = fetch(CDN_BASE + "leis/julgados/" + encodeURIComponent(id) + ".json", { cache: "no-cache" })
      .then(function (r) { if (!r.ok) throw new Error("http " + r.status); return r.json(); });
    return julgadosCache[id];
  }
  // Texto da lei com os números dos julgados: no "Art. N" (caput) e nos § que a decisão cita. Cada número leva ao
  // Diário das Decisões com a busca na decisão. Devolve o HTML dos parágrafos.
  function corpoComJulgados(ps, jul) {
    var artAtual = null, paragrafosDoArt = {}, i, saida = [];
    // 1ª passada: quais § cada artigo tem (para o julgado que cita um § que não existe cair no caput)
    var artDe = [];
    ps.forEach(function (t, k) {
      var m = t.match(/^Art\.?\s*(\d[\d.]*)[º°ª]?(-[A-Z]+)?/);
      if (m) { artAtual = m[1].replace(/\./g, "") + (m[2] || ""); paragrafosDoArt[artAtual] = {}; }
      artDe[k] = artAtual;
      var q = t.match(/^§\s*(\d+)[º°ª]?(-[A-Z]+)?/);
      if (q && artAtual) paragrafosDoArt[artAtual]["§" + q[1] + (q[2] || "")] = true;
      else if (/^Par[áa]grafo único/i.test(t) && artAtual) paragrafosDoArt[artAtual].u = true;
    });
    function chips(art, chave) {
      var lista = jul.art[art] || [], out = "";
      lista.forEach(function (e, n) {
        var mods = e[1], tem = paragrafosDoArt[art] || {};
        var vaiAqui;
        if (chave === "c") vaiAqui = mods.indexOf("c") >= 0 || !mods.some(function (m) { return tem[m]; });
        else vaiAqui = mods.indexOf(chave) >= 0;
        if (!vaiAqui) return;
        var d = jul.decisoes[e[0]];
        out += '<a href="' + escapeHtml(d[1]) + '" target="_blank" rel="noopener" class="lei-julg" title="' + escapeHtml(d[0] + (d[2] ? " — " + d[2] : "")) + '" ' +
          'style="display:inline-block;min-width:1.45em;text-align:center;margin-left:.3em;padding:0 .3em;border-radius:999px;background:var(--accent-soft,#e7f1ff);color:var(--accent,#0d6efd);border:1px solid var(--accent,#0d6efd);' +
          'font-size:calc(11px * var(--fs-scale,1));font-weight:700;line-height:1.5;text-decoration:none;vertical-align:baseline;user-select:none;">' + (n + 1) + "</a>";
      });
      return out;
    }
    return ps.map(function (t, k) {
      var art = artDe[k], h = paragrafoHtml(t);
      if (!art) return h;
      var m = t.match(/^Art\.?\s*\d[\d.]*[º°ª]?(?:-[A-Z]+)?\.?/);
      if (m) {
        var c = chips(art, "c");
        return c ? '<p style="margin:10px 0 4px;"><strong>' + escapeHtml(m[0]) + "</strong>" + c + escapeHtml(t.slice(m[0].length)) + "</p>" : h;
      }
      var q = t.match(/^(§\s*(\d+)[º°ª]?(-[A-Z]+)?\.?|Par[áa]grafo único\.?)/i);
      if (q) {
        var c2 = chips(art, q[2] ? "§" + q[2] + (q[3] || "") : "u");
        if (c2) return '<p style="margin:4px 0;">' + escapeHtml(q[0]) + c2 + escapeHtml(t.slice(q[0].length)) + "</p>";
      }
      return h;
    }).join("");
  }

  function carregarTexto(id) {
    if (textosCache[id]) return Promise.resolve(textosCache[id]);
    return fetch(TEXTO_BASE + encodeURIComponent(id) + ".json")
      .then(function (r) { if (!r.ok) throw new Error("http " + r.status); return r.json(); })
      .then(function (j) { textosCache[id] = j; return j; });
  }

  // "Art. 5º", "§ 1º", "I -", títulos em maiúsculas… só para dar um respiro visual.
  function paragrafoHtml(t) {
    var e = escapeHtml(t);
    if (/^(PARTE|LIVRO|T[ÍI]TULO|CAP[ÍI]TULO|SE[ÇC][ÃA]O|SUBSE[ÇC][ÃA]O|DISPOSI[ÇC])/i.test(t) && t.length < 140 && t === t.toUpperCase()) {
      return '<p style="margin:16px 0 6px;font-weight:700;text-align:center;color:#1e293b;">' + e + "</p>";
    }
    var art = t.match(/^Art\.?\s*\d+[º°ª]?(?:-[A-Z]+)?\.?/);
    if (art) {
      return '<p style="margin:10px 0 4px;"><strong>' + escapeHtml(art[0]) + "</strong>" + escapeHtml(t.slice(art[0].length)) + "</p>";
    }
    return '<p style="margin:4px 0;">' + e + "</p>";
  }

  // O Planalto deixa, no texto compilado, a redação antiga (revogada) ao lado da nova. Quando dois parágrafos
  // quase iguais, com o mesmo rótulo (Art. n, § n, inciso, alínea), vêm juntos, o primeiro é a redação antiga: sai.
  function tirarRedacoesAntigas(ps) {
    var ROTULO = /^(Art\.\s*\d+[º°]?(?:-[A-Z]+)?|§\s*\d+[º°]?(?:-[A-Z]+)?|Parágrafo único|[IVXLCDM]+\s*[-–—]|[a-z]\)|\d+\s*[.)-])/;
    var palavras = function (t) {
      var set = {}, n = 0;
      String(t).toLowerCase().replace(/\([^)]*\)/g, " ").split(/[^a-zà-ú0-9]+/).forEach(function (w) { if (w.length > 2 && !set[w]) { set[w] = 1; n++; } });
      return { set: set, n: n };
    };
    var semelhante = function (a, b) {
      var A = palavras(a), B = palavras(b), comum = 0;
      Object.keys(A.set).forEach(function (w) { if (B.set[w]) comum++; });
      var menor = Math.min(A.n, B.n);
      return menor >= 3 && comum / (A.n + B.n - comum) >= 0.5 || (menor >= 5 && comum / menor >= 0.75);
    };
    var fora = {};
    for (var i = 0; i < ps.length - 1; i++) {
      var r = ROTULO.exec(ps[i]);
      if (!r) continue;
      var rot = r[0].replace(/\s+/g, "").replace(/[-–—]$/, "-");
      for (var j = i + 1; j <= i + 2 && j < ps.length; j++) {
        var r2 = ROTULO.exec(ps[j]);
        if (r2 && r2[0].replace(/\s+/g, "").replace(/[-–—]$/, "-") === rot && semelhante(ps[i], ps[j])) { fora[i] = true; break; }
      }
    }
    return ps.filter(function (_, k) { return !fora[k]; });
  }

  // Texto do Planalto vem quebrado em linhas do tamanho da tela de origem: junta as linhas de um mesmo parágrafo
  // (artigo, §, inciso, alínea e título em maiúsculas começam parágrafo novo) e tira o cabeçalho/índice do começo.
  function paragrafosDaLei(src) {
    var ps = [];
    for (var i = 0; i < src.length; i++) {
      var t = String(src[i]).trim();
      if (/^Art\.?$/.test(t) && i + 1 < src.length) t = "Art. " + String(src[++i]).trim();
      if (t) ps.push(t);
    }
    // o Planalto marca o ordinal com "o" sobrescrito, que vira "1o"/"8o" no texto: devolve o "º" (e "No 10.741" → "Nº 10.741")
    ps = ps.map(function (t) {
      return t.replace(/\b(\d{1,3})[o°](?![A-Za-zÀ-ú])/g, "$1º").replace(/\b([Nn])[o°](?=\s*\d)/g, "$1º");
    });
    var ini = -1;
    for (var q = 0; q < ps.length && q < 200; q++) {
      if (/^(PRE[ÂA]MBULO|Art\.?\s*\d|LEI (COMPLEMENTAR )?N[ºo°]|DECRETO(-LEI)? N[ºo°])/i.test(ps[q]) && !/^Vide/i.test(ps[q])) { ini = q; break; }
    }
    if (ini > 0) ps = ps.slice(ini);
    var NOVO = /^(Art\.|§|Parágrafo único|[IVXLCDM]+\s*[-–—]|[a-z]\)|\d+\s*[.)-]\s|(PARTE|LIVRO|T[ÍI]TULO|CAP[ÍI]TULO|SE[ÇC][ÃA]O|SUBSE[ÇC][ÃA]O|DISPOSI[ÇC])\b|[A-ZÀ-Ý0-9 ,.\-ªº]{6,}$)/;
    var out = [];
    ps.forEach(function (t) {
      if (!out.length || NOVO.test(t)) out.push(t);
      else out[out.length - 1] += " " + t;
    });
    return tirarRedacoesAntigas(out);
  }

  // "Leia também": decisões, súmulas e resoluções que citam a lei ou tratam do mesmo assunto
  // (leve/relacionados.json, gerado por scripts/gerar_relacionados.js)
  var relacionadosP = null;
  function carregarRelacionados() {
    if (!relacionadosP) relacionadosP = fetch(CDN_BASE + "leve/relacionados.json", { cache: "no-cache" })
      .then(function (r) { return r.ok ? r.json() : null; }).catch(function () { return null; });
    return relacionadosP;
  }
  function htmlRelacionados(rel, tid) {
    var chaves = rel && rel.leis && rel.leis[tid];
    if (!chaves || !chaves.length) return "";
    var grupos = { "Súmula": [], "Decisão": [], "Resolução": [] };
    chaves.forEach(function (k) { var it = rel.itens[k]; if (it && grupos[it[0]]) grupos[it[0]].push(it); });
    var nomes = { "Súmula": "Súmulas", "Decisão": "Decisões e teses", "Resolução": "Resoluções" };
    var corpo = ["Súmula", "Decisão", "Resolução"].filter(function (g) { return grupos[g].length; }).map(function (g) {
      return '<div style="margin:6px 0 2px;font-size:calc(12px * var(--fs-scale,1));font-weight:700;text-transform:uppercase;letter-spacing:.04em;color:var(--ink-faint,#64748b);">' + nomes[g] + "</div>" +
        '<ul style="margin:0;padding-left:18px;font-size:calc(13px * var(--fs-scale,1));line-height:1.5;">' + grupos[g].map(function (it) {
          return '<li style="margin:2px 0;"><a href="' + escapeHtml(it[2]) + '" target="_blank" rel="noopener" style="color:var(--accent,#0d6efd);text-decoration:none;">' + escapeHtml(it[1]) + "</a></li>";
        }).join("") + "</ul>";
    }).join("");
    return '<details class="lei-leitor-rel" style="margin:0 0 12px;padding:8px 12px;border:1px solid var(--surface-line,#e2e8f0);border-radius:8px;background:var(--accent-soft,#f8fafc);">' +
      '<summary style="cursor:pointer;font-size:calc(14px * var(--fs-scale,1));font-weight:700;color:var(--ink,#1e293b);">📚 Leia também <span style="font-weight:400;color:var(--ink-faint,#64748b);">(' + chaves.length + " itens sobre o mesmo assunto)</span></summary>" + corpo + "</details>";
  }

  var leitorFechar = null;
  // "Leia-me": abre a lei num card sobre a página (como nas Revisões), com texto justificado,
  // destaque/anotação (Meus Cadernos) e o "Já li esta lei".
  function abrirTexto(botao, comJulgados) {
    var cardEl = botao.closest(".lei-card");
    if (!cardEl) return;
    if (leitorFechar) leitorFechar();
    var chave = cardEl.getAttribute("data-chave"), tid = botao.getAttribute("data-texto-id");
    var titulo = cardEl.getAttribute("data-cad-titulo") || "", origem = cardEl.getAttribute("data-cad-origem") || "";
    var linkInteira = cardEl.querySelector('a[href^="http"]');
    var lida = function () { var c = document.querySelector('.lei-check[data-chave="' + chave.replace(/"/g, '\\"') + '"]'); return !!(c && c.checked); };
    var fundo = document.createElement("div");
    fundo.style.cssText = "position:fixed;inset:0;z-index:9999;background:rgba(0,0,0,.55);display:flex;align-items:center;justify-content:center;padding:12px;";
    var caixa = document.createElement("div");
    caixa.setAttribute("role", "dialog");
    caixa.setAttribute("aria-modal", "true");
    caixa.style.cssText = "position:relative;width:min(820px,100%);max-height:92vh;overflow-y:auto;background:var(--surface,#fff);color:var(--ink,#334155);border:1px solid var(--surface-line,#e2e8f0);border-radius:12px;padding:18px 22px;box-shadow:0 12px 40px rgba(0,0,0,.35);";
    caixa.innerHTML =
      '<button type="button" class="lei-leitor-x" aria-label="Fechar" style="position:absolute;top:8px;right:14px;border:0;background:none;font-size:calc(26px * var(--fs-scale,1));line-height:1;cursor:pointer;color:var(--ink-faint,#64748b);">×</button>' +
      '<h2 class="lei-leitor-titulo" style="margin:0 28px 2px 0;font-size:calc(18px * var(--fs-scale,1));color:var(--ink,#1e293b);line-height:1.35;">' + escapeHtml(titulo) + (comJulgados ? " — com julgados" : "") + "</h2>" +
      '<p style="margin:0 0 10px;font-size:calc(13px * var(--fs-scale,1));color:var(--ink-faint,#64748b);">' + escapeHtml(origem) + "</p>" +
      '<div style="display:flex;align-items:center;gap:14px;flex-wrap:wrap;margin-bottom:12px;padding-bottom:10px;border-bottom:1px solid var(--surface-line,#e2e8f0);">' +
      '<button type="button" class="lei-leitor-lida" style="font-size:calc(13px * var(--fs-scale,1));font-weight:600;border:1px solid var(--surface-line,#cbd5e1);background:var(--accent-soft,#f8fafc);color:var(--ink,#334155);border-radius:8px;padding:6px 12px;cursor:pointer;"></button>' +
      (linkInteira ? '<a href="' + escapeHtml(linkInteira.getAttribute("href")) + '" target="_blank" rel="noopener noreferrer" style="font-size:calc(13px * var(--fs-scale,1));font-weight:600;color:var(--accent,#0d6efd);text-decoration:none;">📖 Abrir lei na íntegra ↗</a>' : "") +
      '<span style="font-size:calc(12px * var(--fs-scale,1));color:var(--ink-faint,#94a3b8);">Selecione um trecho para destacar ou anotar.</span></div>' +
      '<div class="lei-leitor-texto" style="font-size:calc(15px * var(--fs-scale,1));line-height:1.65;text-align:justify;hyphens:auto;-webkit-hyphens:auto;"><p style="margin:0;color:#64748b;">Carregando o texto…</p></div>';
    fundo.appendChild(caixa);
    var btnLida = caixa.querySelector(".lei-leitor-lida");
    var pintarLida = function () { btnLida.textContent = lida() ? "✔ Lida — desmarcar" : "Marcar como lida"; };
    pintarLida();
    var fechar = function () {
      document.removeEventListener("keydown", tecla);
      if (window.EstudaManaCadernos) EstudaManaCadernos.desligar();
      if (fundo.parentNode) fundo.parentNode.removeChild(fundo);
      document.body.style.overflow = "";
      leitorFechar = null;
    };
    var tecla = function (e) { if (e.key === "Escape") fechar(); };
    leitorFechar = fechar;
    fundo.addEventListener("click", function (e) {
      if (e.target === fundo || e.target.closest(".lei-leitor-x")) fechar();
    });
    btnLida.addEventListener("click", function () {
      var c = document.querySelector('.lei-check[data-chave="' + chave.replace(/"/g, '\\"') + '"]');
      if (!c) return;
      c.checked = !c.checked;
      c.dispatchEvent(new Event("change", { bubbles: true }));
      pintarLida();
    });
    var estilo = document.createElement("style");
    estilo.textContent = ".lei-leitor-texto p, .lei-leitor-texto strong { color: inherit !important; } .lei-leitor-texto p[style*='text-align:center'] { color: var(--ink, #1e293b) !important; }";
    caixa.appendChild(estilo);
    document.addEventListener("keydown", tecla);
    document.body.appendChild(fundo);
    document.body.style.overflow = "hidden";
    carregarTexto(tid).then(function (j) {
      if (leitorFechar !== fechar) return;
      var psLei = paragrafosDaLei(j.p || []);
      var corpo = psLei.map(paragrafoHtml).join("");
      var area = caixa.querySelector(".lei-leitor-texto");
      if (comJulgados) {
        carregarJulgados(tid).then(function (jul) {
          if (leitorFechar !== fechar) return;
          area.innerHTML = '<p style="margin:0 0 10px;padding:8px 10px;border-radius:8px;background:var(--accent-soft,#f1f5f9);font-size:calc(12.5px * var(--fs-scale,1));line-height:1.45;">' +
            "⚖️ <b>Com julgados:</b> os números ao lado dos artigos levam a decisões do site que tratam deles (no máximo 2 por artigo). Passe o mouse para ver o resumo; clique para abrir no Diário das Decisões. " +
            "É uma versão de teste, só com algumas leis, e as indicações são automáticas: confira sempre a decisão.</p>" + corpoComJulgados(psLei, jul) +
            '<p style="margin:14px 0 0;font-size:calc(11px * var(--fs-scale,1));color:var(--ink-faint,#94a3b8);">Texto copiado do Planalto em ' + escapeHtml(j.em || "") +
            ". Pode estar desatualizado: confira na fonte oficial (“Abrir lei na íntegra”).</p>";
        }).catch(function () {
          area.innerHTML = '<p style="margin:0 0 8px;color:#b91c1c;">Não consegui carregar os julgados agora. Mostrando só o texto da lei.</p>' + corpo;
        });
        return;
      }
      carregarRelacionados().then(function (rel) {
        if (leitorFechar !== fechar) return;
        var h = htmlRelacionados(rel, tid);
        if (h) area.insertAdjacentHTML("beforebegin", h);
      });
      area.innerHTML = corpo +
        '<p style="margin:14px 0 0;font-size:calc(11px * var(--fs-scale,1));color:var(--ink-faint,#94a3b8);">Texto copiado do Planalto em ' + escapeHtml(j.em || "") +
        ". Pode estar desatualizado: confira na fonte oficial (“Abrir lei na íntegra”).</p>";
      if (window.EstudaManaCadernos) {
        EstudaManaCadernos.ligar(caixa, {
          fonte: "leis", item: chave, titulo: titulo, origem: origem,
          abrir: cardEl.getAttribute("data-cad-abrir") || "",
          areas: [caixa.querySelector(".lei-leitor-titulo"), area]
        });
      }
    }).catch(function () {
      var area = caixa.querySelector(".lei-leitor-texto");
      if (area) area.innerHTML = '<p style="margin:0;color:#b91c1c;">Não consegui carregar o texto agora. Use “Abrir lei na íntegra”.</p>';
    });
  }

  // ---- visual dos cards ----------------------------------------------------
  function card(lei) {
    var federal = !lei.uf;
    var badge = lei.badge || (federal ? "FEDERAL" : "ESTADUAL (" + lei.uf + ")");
    var fundo = lei.badge ? "#fff4e5" : federal ? "#e7f1ff" : "#e6f4ea";
    var cor = lei.badge ? "#b45309" : federal ? "#0d6efd" : "#198754";
    var lida = isLida(lei.chave);
    var cad = ' data-cad-lista="leis" data-cad-item="' + escapeHtml(lei.chave) + '" data-cad-titulo="' + escapeHtml(lei.nome) + '"' +
      ' data-cad-origem="' + escapeHtml(lei.numero + " · " + badge) + '" data-cad-abrir="/p/diario-de-leis.html#lei=' + escapeHtml(encodeURIComponent(lei.chave)) + '"';
    return '<div class="lei-card" data-chave="' + escapeHtml(lei.chave) + '"' + cad + ' style="background:#fff;border:1px solid #e2e8f0;border-radius:8px;padding:14px 16px;margin-bottom:10px;box-shadow:0 1px 3px rgba(0,0,0,.04);">' +
      '<div style="display:flex;justify-content:space-between;align-items:flex-start;gap:10px;">' +
      '<h3 style="margin:0;font-size:calc(15px * var(--fs-scale,1));font-weight:600;color:' + (lida ? "#94a3b8" : "#1e293b") + ';line-height:1.4;' + (lida ? "text-decoration:line-through;" : "") + '">' + escapeHtml(lei.nome) + "</h3>" +
      '<span style="font-size:calc(11px * var(--fs-scale,1));font-weight:700;background:' + fundo + ";color:" + cor + ';padding:3px 8px;border-radius:12px;white-space:nowrap;">' + badge + "</span>" +
      "</div>" +
      '<p style="margin:6px 0 10px;font-size:calc(13px * var(--fs-scale,1));color:#64748b;">' + escapeHtml(lei.numero) + "</p>" +
      '<div style="display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap;">' +
      (lei.link
        ? '<span style="display:flex;align-items:center;gap:14px;flex-wrap:wrap;">' +
          '<a href="' + escapeHtml(lei.link) + '" target="_blank" rel="noopener noreferrer" style="font-size:calc(13px * var(--fs-scale,1));font-weight:600;color:#0d6efd;text-decoration:none;">📖 Abrir lei na íntegra ↗</a>' +
          ((lei.textoId || idTexto(lei.link))
            ? '<button type="button" class="lei-leia" data-texto-id="' + escapeHtml((lei.textoId || idTexto(lei.link))) + '" style="font-size:calc(13px * var(--fs-scale,1));font-weight:600;background:none;border:0;color:#0d6efd;cursor:pointer;padding:0;' + (temTexto((lei.textoId || idTexto(lei.link))) ? "" : "display:none;") + '">📜 Leia-me</button>' +
            '<button type="button" class="lei-leia-julg" data-texto-id="' + escapeHtml((lei.textoId || idTexto(lei.link))) + '" style="font-size:calc(13px * var(--fs-scale,1));font-weight:600;background:none;border:0;color:#0d6efd;cursor:pointer;padding:0;' + ((julgadosIdx && julgadosIdx[(lei.textoId || idTexto(lei.link))]) ? "" : "display:none;") + '">⚖️ Com julgados</button>'
            : "") + "</span>"
        : "<span></span>") +
      (lei.removivel
        ? '<button type="button" class="lei-remover" data-chave="' + escapeHtml(lei.chave) + '" style="font-size:calc(12px * var(--fs-scale,1));background:none;border:0;color:#94a3b8;text-decoration:underline;cursor:pointer;padding:0;">Tirar do meu Diário</button>'
        : "") +
      '<label style="display:flex;align-items:center;gap:6px;font-size:calc(13px * var(--fs-scale,1));color:#334155;cursor:pointer;user-select:none;">' +
      '<input type="checkbox" class="lei-check" data-chave="' + escapeHtml(lei.chave) + '"' + (lida ? " checked" : "") + ' style="width:17px;height:17px;cursor:pointer;">' +
      (lida ? "Lida ✓" : "Já li esta lei") +
      '</label></div><div class="lei-texto" style="display:none;margin-top:12px;padding-top:12px;border-top:1px solid #e2e8f0;"></div></div>';
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
        '<summary style="cursor:pointer;font-weight:600;font-size:calc(15px * var(--fs-scale,1));color:var(--em-leis-ink,#334155);padding:8px 0;">' +
        escapeHtml(mat) + ' <span style="color:var(--em-leis-faint,#94a3b8);font-weight:400;">(' + lidasNaMateria + " de " + grupos[mat].length + " lidas)</span></summary>" +
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
    return '<p class="lei-resumo" style="margin:0 0 12px;font-size:calc(13px * var(--fs-scale,1));font-weight:600;color:var(--em-leis-soft,#475569);">' +
      lidasN + " de " + leis.length + " lidas</p>";
  }

  // ---- sincronização (conta) ------------------------------------------------
  var viewerId = null, dbCap = null, dbReady = false, progressDoc = null, syncTimer = null, applyingRemote = false;

  function scheduleSync() {
    if (syncTimer) clearTimeout(syncTimer);
    syncTimer = setTimeout(doSync, 700);
  }

  // Total de leis lidas vira o campo "lidasLeis" em cada grupo de estudo
  // (ranking de "Meus Grupos").
  function pushGrupos() {
    var GS = window.GruposShared;
    if (!GS || !viewerId) return;
    var n = Object.keys(lidos).filter(isLida).length;
    GS.readGroups().forEach(function (g) {
      GS.updateMember(g.code, viewerId, {
        name: g.name, lidasLeis: n, avatar: GS.readAvatarPref(), joinedAt: g.joinedAt
      }).catch(function () {});
    });
  }

  function doSync() {
    gravarLidos();
    pushGrupos();
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
      pushGrupos();
    }, function () {});
    pushGrupos();
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
    // Combinação de editais (página "Editais": principal + até 2 secundários):
    // uma opção junta os estados de todos eles.
    var idsCombo = [];
    (function () {
      var sec = [];
      try { sec = JSON.parse(lerStorage("editais-secundarios") || "[]"); } catch (e) {}
      [lerStorage("editais-principal")].concat(Array.isArray(sec) ? sec : []).forEach(function (id) {
        if (id && opcoes[id] && idsCombo.indexOf(id) === -1) idsCombo.push(id);
      });
    })();
    var COMBO_ID = "__meus__";
    if (idsCombo.length > 1) {
      var siglas = idsCombo.map(function (id) { return String(opcoes[id].nome).split(" — ")[0]; });
      opcoes[COMBO_ID] = { id: COMBO_ID, nome: "Meus editais", modo: "multi", ids: idsCombo };
      html = html.replace('</option>', '</option><option value="' + COMBO_ID + '">⭐ Meus editais: ' + escapeHtml(siglas.join(" + ")) + "</option>");
    }
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
    var salvo = lerStorage(STORAGE_EDITAL) || (idsCombo.length > 1 ? COMBO_ID : lerStorage("editais-principal"));
    if (!(salvo && opcoes[salvo])) salvo = lerStorage("editais-principal");
    if (salvo && opcoes[salvo]) selectEdital.value = salvo;
    var estadoSalvo = lerStorage(STORAGE_ESTADO);
    if (selectEstado && estadoSalvo) selectEstado.value = estadoSalvo;

    function atendeBusca(lei, termo, digitos) {
      if (!termo) return true;
      if (digitos && lei.digitos.indexOf(digitos) !== -1) return true;
      // siglas curtas (IR, ECA, CTN) só como palavra inteira; o resto, como trecho
      if (/^[a-z]{2,3}$/.test(termo)) return new RegExp("(^|[^a-z0-9])" + termo + "([^a-z0-9]|$)").test(lei.busca);
      return lei.busca.indexOf(termo) !== -1;
    }

    // ---- leis que a pessoa incluiu (leis-incluidas.js) --------------------
    // Normas "fora dos Diários" que ela incluiu a partir das Decisões ou dos
    // Editais: ficam num bloco próprio, acima das federais, agrupadas pelo
    // edital principal que ela tinha na hora (ou "Leis importantes para
    // jurisprudência", se não tinha nenhum).
    var blocoFed = gridFederais.parentNode;
    var blocoInc = document.createElement("div");
    blocoInc.id = "bloco-leis-incluidas";
    blocoInc.style.cssText = blocoFed.style.cssText;
    var h3Fed = blocoFed.querySelector("h3");
    var h3Inc = h3Fed ? h3Fed.cloneNode(false) : document.createElement("h3");
    h3Inc.textContent = "📌 Leis que você incluiu";
    var gridIncluidas = document.createElement("div");
    gridIncluidas.id = "grid-leis-incluidas";
    blocoInc.appendChild(h3Inc);
    blocoInc.appendChild(gridIncluidas);
    blocoInc.hidden = true;
    if (blocoFed.parentNode) blocoFed.parentNode.insertBefore(blocoInc, blocoFed);

    function renderIncluidas(termo, digitos) {
      var LI = window.LeisIncluidas;
      var itens = LI ? LI.lista() : [];
      if (itens.length && citadas === null) carregarCitadas().then(function () { renderIncluidas(termo, digitos); });
      var cards = itens.map(function (it) {
        return {
          chave: it.chave, nome: it.rotulo, numero: it.nome || "Incluída por você",
          textoId: citadas && citadas[chaveCitada(it.rotulo)] || "",
          link: it.href, uf: null, badge: "INCLUÍDA", removivel: true,
          materia: LI.titulo(it.edital), edital: it.edital,
          busca: semAcento(it.rotulo + " " + (it.nome || "")), digitos: String(it.rotulo).replace(/\D/g, "")
        };
      }).filter(function (l) { return atendeBusca(l, termo, digitos); });
      blocoInc.hidden = !cards.length;
      if (!cards.length) { gridIncluidas.innerHTML = ""; return; }
      // o edital principal atual primeiro, depois "Leis importantes…", depois os outros
      var principal = lerStorage("editais-principal") || "";
      function peso(l) { return l.edital && l.edital === principal ? 0 : !l.edital ? 1 : 2; }
      cards.sort(function (a, b) { return peso(a) - peso(b) || a.materia.localeCompare(b.materia, "pt-BR"); });
      gridIncluidas.innerHTML = resumo(cards) + porMateria(cards, true);
    }
    if (window.LeisIncluidas) LeisIncluidas.onChange(function () { render(); });

    gridIncluidas.addEventListener("click", function (e) {
      var b = e.target.closest(".lei-remover");
      if (!b || !window.LeisIncluidas) return;
      b.disabled = true;
      LeisIncluidas.remover(b.getAttribute("data-chave")).catch(function () { b.disabled = false; });
    });

    function render() {
      var opcao = opcoes[selectEdital.value] || null;
      var termo = semAcento(inputBusca ? inputBusca.value.trim() : "");
      // busca só vale com pelo menos 2 caracteres (ex.: IR, ITCMD, IPTU); com 1, mostra a lista normal
      if (termo.replace(/\s+/g, "").length < 2) termo = "";
      var digitos = /\d/.test(termo) ? termo.replace(/\D/g, "") : "";
      var buscando = !!termo;

      var comboEscolhe = !!(opcao && opcao.modo === "multi" && opcao.ids.some(function (id) { return opcoes[id] && opcoes[id].modo === "escolher"; }));
      if (wrapperEstado) wrapperEstado.style.display = opcao && (opcao.modo === "escolher" || comboEscolhe) ? "" : "none";

      // Federais: sempre todas (filtradas pela busca)
      renderIncluidas(termo, digitos);
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
      var ufsCombo = null;
      if (opcao.modo === "multi") {
        // junta os estados de todos os editais da combinação
        ufsCombo = [];
        opcao.ids.forEach(function (id) {
          var o = opcoes[id];
          var u = o.modo === "uf" ? o.uf : (o.modo === "escolher" && selectEstado ? selectEstado.value : "");
          if (u && u !== "TODOS" && ufsCombo.indexOf(u) === -1) ufsCombo.push(u);
        });
        if (!ufsCombo.length) {
          if (tituloEstaduais) tituloEstaduais.textContent = titulo;
          gridEstaduais.innerHTML = aviso("Nenhum dos seus editais é estadual" + (comboEscolhe ? " — escolha o estado no menu acima" : "") + ": só as leis federais se aplicam.");
          return;
        }
        uf = ufsCombo.join(", ");
      } else if (opcao.modo === "uf") {
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
        var doEstado = ufsCombo ? ufsCombo.indexOf(l.uf) !== -1 : (uf === "TODOS" || l.uf === uf);
        return l.uf && doEstado && atendeBusca(l, termo, digitos);
      });
      if (tituloEstaduais) {
        tituloEstaduais.textContent = ufsCombo
          ? "🏛️ Leis Estaduais — " + ufsCombo.map(function (u) { return UF_NOME[u] + " (" + u + ")"; }).join(" + ")
          : uf === "TODOS"
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

    // "Leia-me": abre/fecha o texto da lei dentro do próprio card.
    document.addEventListener("click", function (e) {
      var b = e.target.closest && e.target.closest(".lei-leia");
      if (b) abrirTexto(b);
      var bj = e.target.closest && e.target.closest(".lei-leia-julg");
      if (bj) abrirTexto(bj, true);
    });
    carregarIndiceTextos();
    carregarIndiceJulgados();

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
    [gridIncluidas, gridFederais, gridEstaduais].forEach(function (grid) {
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

    // Link vindo de outra página (ex.: card do Diário das Decisões):
    // /p/diario-de-leis.html#lei=<matéria>:<número-em-slug> abre direto a
    // lei pedida — busca pelo número dela, rola até o card e o destaca por
    // alguns segundos, para a pessoa marcar a leitura.
    function abrirLeiDoLink() {
      var m = /[#&]lei=([^&]+)/.exec(location.hash);
      if (!m) return;
      var chave;
      try { chave = decodeURIComponent(m[1]); } catch (e) { return; }
      var lei = leis.filter(function (l) { return l.chave === chave; })[0];
      if (!lei) return;
      // Lei com "nº": filtra a lista por ela. Sem "nº" (ex.: "CF/1988", que
      // também acharia as leis de 1988), só rola até ela e a destaca.
      if (inputBusca) { inputBusca.value = /n[ºo°]/.test(lei.numero) ? lei.numero : ""; render(); }
      var cards = document.querySelectorAll(".lei-card");
      for (var i = 0; i < cards.length; i++) {
        if (cards[i].getAttribute("data-chave") === chave) { destacar(cards[i]); return; }
      }
    }

    function destacar(el) {
      var details = el.closest("details");
      if (details) details.open = true;
      el.scrollIntoView({ block: "center", behavior: "smooth" });
      el.style.transition = "box-shadow .3s";
      el.style.boxShadow = "0 0 0 3px #f59e0b";
      setTimeout(function () { el.style.boxShadow = "0 1px 3px rgba(0,0,0,.04)"; }, 4000);
    }

    abrirLeiDoLink();
    window.addEventListener("hashchange", abrirLeiDoLink);
  }

  Promise.all([
    ensure("LEIS_DATA", "leis-data.js"),
    ensure("EDITAIS_DATA", "editais-data.js"),
    ensure("LeisIncluidas", "leis-incluidas.js"),
    domReady()
  ]).then(iniciar);

  // ---- conta Google -----------------------------------------------------
  // Esta página não tem mais o painel "Acessar de qualquer aparelho" no
  // HTML (layout novo), então criamos um: conta-google.js procura por
  // #account-panel e insere o botão sozinho ali dentro. Sem isso, ninguém
  // conseguia entrar com a conta Google nesta página. Aproveitamos o mesmo
  // login (Google ou e-mail e senha) para sincronizar as leis marcadas como
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
    if (!(window.firebase && window.DIARIO_FIREBASE_CONFIG && window.GruposShared)) {
      // A página no Blogger não traz o Firebase: baixa tudo (nuvem-shared.js)
      // e tenta de novo. Sem internet, segue só com o que está neste navegador.
      if (window.EstudaManaNuvem || startContaGoogle.tentou) { dbReady = true; return; }
      startContaGoogle.tentou = true;
      var n = document.createElement("script");
      n.src = scriptBase() + "nuvem-shared.js";
      n.onload = function () { window.EstudaManaNuvem.preparar().then(function () { if (window.GruposShared && window.firebase) startContaGoogle(); else dbReady = true; }); };
      n.onerror = function () { dbReady = true; };
      document.head.appendChild(n);
      return;
    }
    ensureAccountPanel();
    if (!firebase.apps.length) firebase.initializeApp(window.DIARIO_FIREBASE_CONFIG);
    // Só salva na nuvem quem entrou com Google ou e-mail e senha (sem login
    // anônimo). Sem entrar, tudo fica salvo neste navegador.
    firebase.auth().onAuthStateChanged(function (user) {
      if (!user || user.isAnonymous) return;
      if (viewerId !== user.uid) bindUser(user.uid);
    });
    carregarContaGoogle(scriptBase() + "conta-google.js");
  }

  // fetch sem cache + eval: uma cópia antiga de conta-google.js guardada
  // pelo navegador (ou já carregada pelo HTML) não pode tomar o lugar do
  // quadro de login atual — a versão nova assume mesmo se a antiga já rodou.
  function carregarContaGoogle(url) {
    if ((window.ContaGoogle && window.ContaGoogle.iniciar) || window.EstudaManaContaCarregando) return;
    window.EstudaManaContaCarregando = true;
    fetch(url, { cache: "no-cache" })
      .then(function (r) { if (!r.ok) throw new Error("conta-google.js"); return r.text(); })
      .then(function (code) { (0, eval)(code); })
      .catch(function () { window.EstudaManaContaCarregando = false; });
  }

  domReady().then(startContaGoogle);
})();

// Meus Cadernos: destacar e anotar (cadernos.js). Os itens da lista trazem
// data-cad-lista / data-cad-item / data-cad-titulo / data-cad-origem /
// data-cad-abrir; o texto destacável tem a classe "cad-area".
(function () {
  if (window.EstudaManaCadernos) return;
  var url = "https://barbarasinfronio-lgtm.github.io/diario-informativos/cadernos.js";
  fetch(url, { cache: "no-cache" })
    .then(function (r) { if (!r.ok) throw new Error(r.status); return r.text(); })
    .then(function (code) { if (!window.EstudaManaCadernos) (0, eval)(code + "\n//# sourceURL=" + url); })
    .catch(function () {});
})();
