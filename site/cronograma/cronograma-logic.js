/* =====================================================================
   cronograma-logic.js — página "Meu Cronograma" (/p/meu-cronograma.html)

   Monta um plano de estudos (semestral ou anual) com o conteúdo do site, de acordo com
   a carreira/edital escolhido (o mesmo "edital principal" da página Editais), as horas
   de estudo por dia e o tempo reservado para cursos de fora do site.

   No HTML da página do Blogger basta:
     <div id="estudamana-cronograma"></div>
     <script src="https://barbarasinfronio-lgtm.github.io/diario-informativos/cronograma-logic.js"></script>

   Como o plano é montado (montarPlano, mais abaixo — não depende da página, dá para testar no Node):
   - cada dia de estudo tem o tempo total (2, 4, 6 ou 8 h) dividido em: curso externo (% escolhido),
     revisão (20%), lei seca (45%), súmulas e decisões (25%) e questões (10%) do que sobra;
   - lei seca: as leis do edital, uma matéria por dia, alternando duas matérias por semana; dentro de
     cada matéria, as mais citadas nas decisões primeiro; leis grandes são divididas em trechos;
   - súmulas e decisões: as de órgãos que valem para o edital, as mais cobradas em provas primeiro;
   - revisão espaçada: o que foi estudado 1, 7, 30 e 90 dias antes volta como "Revisar";
   - o último dia de estudo da semana é de revisão da semana + questões;
   - quando uma fila acaba, o tempo dela passa para a outra.
   Cada item abre a página do site com aquele conteúdo (lei, súmula ou decisão) em outra aba.
   O que a pessoa marca como lido ou revisado vale também nos Diários e nas Revisões, e vice-versa (ver "progresso"
   mais abaixo); as escolhas do cronograma ficam na conta (progress-premios/<uid>, campo "cronograma") e, sem login,
   neste navegador.
   Dados: leve/cronograma.json (gerado por scripts/gerar_cronograma.js).
   ===================================================================== */
(function () {
  "use strict";

  var BASE = "https://barbarasinfronio-lgtm.github.io/diario-informativos/";
  var CFG_KEY = "cronograma-config";

  var PAGINA_LEIS = "/p/diario-de-leis.html";
  var PAGINA_SUMULAS = "/p/diario-das-sumulas.html";
  var PAGINA_DECISOES = "/p/diario-das-decisoes.html";

  var MIN_SUMULA = 1.5, MIN_DECISAO = 4;
  var PARTE_MIN = 25;            // lei grande: trechos de cerca de 25 min
  var NOMES_ORG = {
    stf_vinculante: "STF (súmulas vinculantes)", stf: "STF", stj: "STJ", tst: "TST", tse: "TSE",
    tjdft_uj: "TJDFT (Uniformização)"
  };

  // ---- utilidades ---------------------------------------------------------------------------
  function slug(t) {
    return String(t || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  }
  function esc(t) {
    return String(t == null ? "" : t).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; });
  }
  function p2(n) { return String(n).padStart(2, "0"); }
  function iso(d) { return d.getFullYear() + "-" + p2(d.getMonth() + 1) + "-" + p2(d.getDate()); }
  function daIso(s) { var p = String(s).split("-"); return new Date(+p[0], +p[1] - 1, +p[2]); }
  function somaDias(d, n) { var x = new Date(d.getFullYear(), d.getMonth(), d.getDate() + n); return x; }
  function fmtMin(m) {
    m = Math.round(m);
    return m >= 60 ? Math.floor(m / 60) + " h" + (m % 60 ? " " + p2(m % 60) + " min" : "") : m + " min";
  }
  var DIAS_ABREV = ["dom", "seg", "ter", "qua", "qui", "sex", "sáb"];
  var DIAS_NOME = ["domingo", "segunda", "terça", "quarta", "quinta", "sexta", "sábado"];
  var MESES = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];
  function fmtDia(d) { return DIAS_ABREV[d.getDay()] + ", " + p2(d.getDate()) + "/" + p2(d.getMonth() + 1); }
  function fmtCurto(d) { return p2(d.getDate()) + "/" + p2(d.getMonth() + 1); }

  // ---- motor do plano (puro) ------------------------------------------------------------------
  // cfg: { horas, horizonte: "semestral"|"anual", inicio: "AAAA-MM-DD", dias: [0..6], pctCurso, diaRevisao }
  // ctx: { leis: [{chave, mat, nome, min, cit}], sumulas: [{org, num, cob, sub}], decisoes: [{id, cob, titulo}] }
  function montarPlano(cfg, ctx) {
    var inicio = daIso(cfg.inicio);
    var totalDias = cfg.horizonte === "anual" ? 365 : 183;
    var dias = cfg.dias && cfg.dias.length ? cfg.dias.slice() : [1, 2, 3, 4, 5, 6];
    var ultimoDiaSemana = dias.indexOf(cfg.diaRevisao) >= 0 ? cfg.diaRevisao
      : dias.slice().sort(function (a, b) { return ((a + 6) % 7) - ((b + 6) % 7); }).pop();   // semana começa na segunda
    var M = cfg.horas * 60;
    var curso = Math.round(M * (cfg.pctCurso || 0) / 100);
    var R = M - curso;

    // filas de lei seca por matéria (na ordem em que a matéria aparece no edital)
    var ordemMat = [], porMat = {};
    var pular = ctx.pular || function () { return false; };      // já lido antes do início do plano
    ctx.leis.forEach(function (l) {
      if (pular("lei", l.chave)) return;
      if (!porMat[l.mat]) { porMat[l.mat] = []; ordemMat.push(l.mat); }
      porMat[l.mat].push({ l: l, restante: l.min, total: l.min, parte: 0 });
    });
    // matérias que vêm primeiro (ex.: Trabalhista na carreira trabalhista); as outras seguem a ordem do edital
    var prim = ctx.materiasPrimeiro || [];
    ordemMat = prim.filter(function (m) { return porMat[m]; }).concat(ordemMat.filter(function (m) { return prim.indexOf(m) < 0; }));
    ordemMat.forEach(function (m) {
      porMat[m].sort(function (a, b) { return b.l.cit - a.l.cit; });   // sort estável: sem citações, mantém a ordem do edital
    });
    var jur = [];
    ctx.sumulas.forEach(function (s) { if (!pular("sum", s.org + ":" + s.num)) jur.push({ tipo: "sumula", cob: s.cob, s: s, min: MIN_SUMULA }); });
    ctx.decisoes.forEach(function (d) { if (!pular("dec", String(d.id))) jur.push({ tipo: "decisao", cob: d.cob, d: d, min: MIN_DECISAO }); });
    jur.sort(function (a, b) { return b.cob - a.cob; });
    var jurPos = 0;

    var plano = { dias: [], porData: {}, resumo: {} };
    var estudadoPorData = {};          // data -> itens de conteúdo novo (para a revisão espaçada)
    var semanaN = 0, diaNaSemana = 0, itensDaSemana = [], semanaVista = -1;
    var segundaBase = new Date(inicio.getFullYear(), inicio.getMonth(), inicio.getDate() - ((inicio.getDay() + 6) % 7));
    var leiMinPlanejado = 0, leiMinTotal = 0;
    ordemMat.forEach(function (m) { porMat[m].forEach(function (x) { leiMinTotal += x.total; }); });

    function matAtual() {
      var n = ordemMat.length;
      for (var t = 0; t < n; t++) {
        var m = ordemMat[(2 * Math.max(semanaN, 0) + (diaNaSemana % 2) + t) % n];
        if (porMat[m].length) return m;
      }
      return null;
    }
    function leiRestante() { return ordemMat.some(function (m) { return porMat[m].length; }); }
    function jurRestante() { return jurPos < jur.length; }

    function tirarLei(orcamento) {
      var out = [], usado = 0, guard = 0;
      while (orcamento - usado >= 5 && leiRestante() && guard++ < 50) {
        var m = matAtual();
        if (!m) break;
        var it = porMat[m][0];
        var cabe = orcamento - usado;
        var tomar = Math.min(it.restante, cabe);
        if (tomar < it.restante && tomar < 10) break;                 // sobra pouco: deixa para o próximo dia
        var de = it.total - it.restante, ate = de + tomar;
        it.restante -= tomar; it.parte++;
        var inteira = tomar >= it.total;
        out.push({
          k: "lei:" + it.l.chave + ":" + it.parte, tipo: "lei", titulo: it.l.nome, mat: m, min: tomar,
          st: "lei", sk: it.l.chave, rid: "lei:" + it.l.chave.split(":").slice(1).join(":"), ultima: it.restante <= 0.01,
          trecho: inteira ? "" : "trecho " + Math.round(de / it.total * 100) + "% a " + Math.round(ate / it.total * 100) + "%",
          href: PAGINA_LEIS + "#lei=" + encodeURIComponent(it.l.chave), cobr: it.l.cit
        });
        usado += tomar;
        leiMinPlanejado += tomar;
        if (it.restante <= 0.01) porMat[m].shift();
        if (!inteira) break;
        // lei inteira lida: continua com a próxima da mesma matéria se ainda couber
      }
      return { itens: out, usado: usado };
    }
    function tirarJur(orcamento) {
      var out = [], usado = 0;
      while (jurPos < jur.length && orcamento - usado >= 1) {
        var j = jur[jurPos];
        if (j.min > orcamento - usado + 0.5) break;
        jurPos++;
        usado += j.min;
        if (j.tipo === "sumula") {
          out.push({
            k: "sumula:" + j.s.org + ":" + j.s.num, tipo: "sumula", min: j.min, cobr: j.cob,
            st: "sum", sk: j.s.org + ":" + j.s.num, rid: "sum:" + j.s.org + ":" + j.s.num, ultima: true,
            titulo: "Súmula " + j.s.num + " do " + (NOMES_ORG[j.s.org] || j.s.org.toUpperCase()), sub: j.s.sub,
            href: PAGINA_SUMULAS + "#cad=" + encodeURIComponent(j.s.org + "|" + j.s.num)
          });
        } else {
          var nomeD = j.d.titulo.replace(/\s+—\s+.*$/, "");
          out.push({
            k: "decisao:" + j.d.id, tipo: "decisao", min: j.min, cobr: j.cob,
            st: "dec", sk: String(j.d.id), rid: "dec:" + j.d.id, ultima: true,
            titulo: nomeD, sub: j.d.informativo ? j.d.titulo.replace(/^.*?—\s*/, "") + (j.cob >= 1 ? " · cobrado em prova" : " · cara de prova") : "",
            href: PAGINA_DECISOES + "#abrir=" + encodeURIComponent(j.d.id) + "&busca=" + encodeURIComponent(nomeD)
          });
        }
      }
      return { itens: out, usado: usado };
    }
    function minRevisao(it) { return it.tipo === "sumula" ? 1 : it.tipo === "decisao" ? 2 : Math.min(10, Math.max(3, Math.ceil(it.min * 0.25))); }
    function revisaoEspacada(data, orcamento) {
      var out = [], usado = 0;
      [1, 7, 30, 90].forEach(function (atras) {
        var lista = estudadoPorData[iso(somaDias(data, -atras))] || [];
        lista.forEach(function (it) {
          var m = minRevisao(it);
          if (usado + m > orcamento) return;
          usado += m;
          out.push({ k: "rev:" + iso(data) + ":" + it.k, tipo: it.tipo, titulo: it.titulo, sub: it.trecho || it.sub || "", min: m, href: it.href, revisao: atras, rid: it.rid, dataPlano: iso(data) });
        });
      });
      return { itens: out, usado: usado };
    }

    for (var i = 0; i < totalDias; i++) {
      var data = somaDias(inicio, i), dow = data.getDay();
      var sem = Math.floor(Math.round((data - segundaBase) / 86400000) / 7);
      if (sem !== semanaVista) { semanaVista = sem; semanaN = sem; diaNaSemana = 0; itensDaSemana = []; }
      if (dias.indexOf(dow) < 0) continue;
      var dia = { data: iso(data), dow: dow, semana: semanaN, blocos: [], revisaoSemanal: dow === ultimoDiaSemana };
      if (curso) dia.blocos.push({ id: "curso", titulo: "Aulas e cursos de fora do site", min: curso, itens: [], nota: "Reserve este tempo para o seu curso preparatório, aulas ou leituras complementares." });

      if (dia.revisaoSemanal) {
        var minRev = Math.round(R * 0.6), minQ = R - minRev;
        var usado = 0, itensRev = [];
        itensDaSemana.forEach(function (it) {
          var m = minRevisao(it);
          if (usado + m > minRev) return;
          usado += m;
          itensRev.push({ k: "revsem:" + iso(data) + ":" + it.k, tipo: it.tipo, titulo: it.titulo, sub: it.trecho || it.sub || "", min: m, href: it.href, revisao: 0, rid: it.rid, dataPlano: iso(data) });
        });
        dia.blocos.push({ id: "revisao", titulo: "Revisão da semana", min: minRev, itens: itensRev, nota: itensRev.length ? "" : "Revise o que estudou nesta semana." });
        dia.blocos.push({ id: "questoes", titulo: "Questões e provas anteriores", min: minQ, itens: [], nota: "Resolva questões das matérias da semana. As páginas de Súmulas e Decisões mostram em quais provas cada item já foi cobrado." });
      } else {
        var minRev2 = Math.round(R * 0.2), minLei = Math.round(R * 0.45), minJur = Math.round(R * 0.25), minQ2 = R - minRev2 - minLei - minJur;
        // o tempo de uma fila vazia passa para a outra
        if (!leiRestante()) { minJur += minLei; minLei = 0; }
        if (!jurRestante()) { minLei += minJur; minJur = 0; }
        if (!leiRestante() && !jurRestante()) { minRev2 += minLei + minJur; minLei = 0; minJur = 0; }
        var lei = tirarLei(minLei), jr = tirarJur(minJur + Math.max(0, minLei - lei.usado));
        var sobraLei = minLei - lei.usado, sobraJur = (minJur + Math.max(0, minLei - lei.usado)) - jr.usado;
        if (sobraJur > 3 && leiRestante()) { var extra = tirarLei(sobraJur); lei.itens = lei.itens.concat(extra.itens); lei.usado += extra.usado; }
        var rev = revisaoEspacada(data, minRev2);
        if (rev.itens.length) dia.blocos.push({ id: "revisao", titulo: "Revisão espaçada", min: minRev2, itens: rev.itens });
        else dia.blocos.push({ id: "revisao", titulo: "Revisão", min: minRev2, itens: [], nota: "Nos primeiros dias ainda não há o que revisar. Depois, aqui voltam os itens de 1, 7, 30 e 90 dias atrás." });
        if (lei.itens.length || minLei) dia.blocos.push({ id: "lei", titulo: "Lei seca", min: minLei, itens: lei.itens, nota: lei.itens.length ? "" : "Sem leis restantes para este edital." });
        if (jr.itens.length || minJur) dia.blocos.push({ id: "jur", titulo: "Súmulas e decisões", min: minJur + Math.max(0, minLei - lei.usado), itens: jr.itens, nota: jr.itens.length ? "" : "Sem súmulas ou decisões restantes." });
        dia.blocos.push({ id: "questoes", titulo: "Questões", min: minQ2, itens: [], nota: "Resolva questões sobre o que estudou hoje." });
        var novos = lei.itens.concat(jr.itens);
        estudadoPorData[iso(data)] = novos;
        itensDaSemana = itensDaSemana.concat(novos);
        dia.focoMat = lei.itens.map(function (x) { return x.mat; });
      }
      diaNaSemana++;
      plano.dias.push(dia);
      plano.porData[dia.data] = dia;
    }
    plano.resumo = {
      diasEstudo: plano.dias.length,
      leiMinPlanejado: Math.round(leiMinPlanejado), leiMinTotal: Math.round(leiMinTotal),
      sumulasPlanejadas: jurPos, jurTotal: jur.length,
      sobraLei: ordemMat.reduce(function (n, m) { return n + porMat[m].length; }, 0)
    };
    return plano;
  }

  // ---- dados do edital -> entradas do motor ------------------------------------------------------
  function entradasDoEdital(edital, dados) {
    var leis = [], vistos = {};
    (edital.leis || []).forEach(function (p) {
      var chave = p[0] + ":" + slug(p[1]);
      var d = dados.leis[chave];
      if (!d || vistos[chave]) return;
      vistos[chave] = true;
      leis.push({ chave: chave, mat: p[0], nome: d[2] || p[1], min: d[0], cit: d[1] });
    });
    var mats = {};
    (edital.leis || []).forEach(function (p) { mats[p[0]] = true; });
    var orgs = ["stf_vinculante", "stf", "stj"];
    if (mats.trabalhista || /trabalh/i.test((edital.titulo || "") + " " + (edital.cargo || ""))) orgs.push("tst");
    if (mats.eleitoral) orgs.push("tse");
    var sg = String(edital.sigla || "").toLowerCase();
    if (/^tj[a-z]{2,4}$/.test(sg) && dados.sumulas[sg]) { orgs.push(sg); if (dados.sumulas[sg + "_uj"]) orgs.push(sg + "_uj"); }
    // peso extra para o que é o "coração" do edital: súmulas vinculantes, do tribunal do edital e do TST na carreira trabalhista
    var bonus = { stf_vinculante: 2, tst: 6, tse: 3 };
    if (/^tj/.test(sg)) { bonus[sg] = 4; bonus[sg + "_uj"] = 4; }
    var sumulas = [];
    orgs.forEach(function (org) {
      (dados.sumulas[org] || []).forEach(function (s) { sumulas.push({ org: org, num: s[0], cob: s[1] + (bonus[org] || 0), sub: s[2] }); });
    });
    // súmulas sem nenhuma cobrança entram só depois das cobradas (e das decisões cobradas): cob 0 fica no fim
    var decisoes = dados.decisoes.map(function (d) { return { id: d[0], cob: d[1], titulo: d[2] }; });
    // julgados de informativos: os já cobrados contam como decisão cobrada; os "com cara de prova" entram logo
    // depois das cobradas (peso 0,5) — nunca o informativo inteiro
    (dados.informativos || []).forEach(function (d) {
      decisoes.push({ id: d[0], cob: d[2] || 0.5, titulo: d[1] + " — Informativo " + d[3], informativo: true });
    });
    return { leis: leis, sumulas: sumulas, decisoes: decisoes, orgs: orgs, materiasPrimeiro: orgs.indexOf("tst") >= 0 ? ["trabalhista"] : [] };
  }

  // ---- progresso: conversa com os Diários e as Revisões -----------------------------------------
  // O que a pessoa marca aqui vale lá, e o contrário: lei, súmula e decisão marcadas como lidas gravam nos mesmos
  // lugares dos Diários (localStorage "leis-lidas", "sumulas-lidas", "decisoes-lidas" e, com login, progress-leis/,
  // progress-sumulas/ e progress-decisoes/ — campo "map"); revisões gravam em "revisoes-feitas" e na conta
  // (progress-premios/<uid>, campo "revisoes"), como o botão "Revisei hoje". O cronograma em si (as escolhas e os
  // trechos de lei lidos) fica em progress-premios/<uid>, campo "cronograma".
  var LOCAL = { lei: "leis-lidas", sum: "sumulas-lidas", dec: "decisoes-lidas" };
  var CAMINHO = { lei: "progress-leis/", sum: "progress-sumulas/", dec: "progress-decisoes/" };
  var REV_KEY = "revisoes-feitas";
  var PARTES_KEY = "cronograma-partes";

  function lerJson(chave, padrao) {
    try { var v = JSON.parse(localStorage.getItem(chave) || "null"); return v == null ? padrao : v; } catch (e) { return padrao; }
  }
  function gravarJson(chave, v) { try { localStorage.setItem(chave, JSON.stringify(v)); } catch (e) {} }
  function lida(v) { return v === true || !!(v && typeof v === "object" && v.lida); }
  function dataDe(v) { return v && typeof v === "object" && /^\d{4}-\d{2}-\d{2}/.test(v.lidaEm || "") ? v.lidaEm.slice(0, 10) : null; }
  function sufixoLei(chave) { return String(chave).split(":").slice(1).join(":"); }

  function criarProgresso() {
    var P = { uid: null, db: null, maps: { lei: {}, sum: {}, dec: {} }, rev: {}, partes: lerJson(PARTES_KEY, {}), cronogramaNuvem: null, leiPorSufixo: {} };

    function juntarMapas(local, nuvem) {
      var out = Object.assign({}, local);
      Object.keys(nuvem || {}).forEach(function (k) {
        var a = out[k], b = nuvem[k];
        if (!lida(a) && lida(b)) out[k] = b;
        else if (lida(a) && lida(b) && dataDe(b) && (!dataDe(a) || dataDe(b) < dataDe(a))) out[k] = b;
      });
      return out;
    }
    function indexar() {
      P.leiPorSufixo = {};
      Object.keys(P.maps.lei).forEach(function (k) {
        if (lida(P.maps.lei[k])) { var sf = sufixoLei(k); if (!P.leiPorSufixo[sf] || (dataDe(P.maps.lei[k]) || "") < (dataDe(P.leiPorSufixo[sf]) || "9")) P.leiPorSufixo[sf] = P.maps.lei[k]; }
      });
    }
    P.lerLocal = function () {
      ["lei", "sum", "dec"].forEach(function (st) { P.maps[st] = juntarMapas(lerJson(LOCAL[st], {}), P.maps[st]); });
      P.rev = juntarRev(lerJson(REV_KEY, {}), P.rev);
      indexar();
    };
    function juntarRev(a, b) {
      var out = {};
      [a, b].forEach(function (m) {
        Object.keys(m || {}).forEach(function (k) {
          var set = {};
          (out[k] || []).concat(m[k] || []).forEach(function (d) { if (/^\d{4}-\d{2}-\d{2}$/.test(d)) set[d] = true; });
          out[k] = Object.keys(set).sort();
        });
      });
      return out;
    }
    // login (se houver) e leitura do que está na conta
    P.entrar = function () {
      return (window.EstudaManaNuvem ? Promise.resolve() : carregarScript(BASE + "nuvem-shared.js")).then(function () {
        return window.EstudaManaNuvem.preparar();
      }).then(function (uid) {
        P.uid = uid;
        if (!uid) return;
        P.db = firebase.firestore();
      }).catch(function () { P.uid = null; });
    };
    P.carregarNuvem = function () {
      if (!P.uid) return Promise.resolve();
      var leituras = Object.keys(CAMINHO).map(function (st) {
        return P.db.doc(CAMINHO[st] + P.uid).get().then(function (snap) {
          var m = snap.exists && snap.data() && snap.data().map;
          if (m) P.maps[st] = juntarMapas(P.maps[st], m);
        }).catch(function () {});
      });
      leituras.push(P.db.doc("progress-premios/" + P.uid).get().then(function (snap) {
        var d = snap.exists ? (snap.data() || {}) : {};
        if (d.revisoes) P.rev = juntarRev(P.rev, d.revisoes);
        P.cronogramaNuvem = d.cronograma || null;
      }).catch(function () {}));
      return Promise.all(leituras).then(function () {
        // o que veio da conta também fica neste navegador (como fazem os Diários)
        ["lei", "sum", "dec"].forEach(function (st) { gravarJson(LOCAL[st], juntarMapas(lerJson(LOCAL[st], {}), P.maps[st])); });
        gravarJson(REV_KEY, juntarRev(lerJson(REV_KEY, {}), P.rev));
        indexar();
      });
    };
    P.entrada = function (st, chave) { return st === "lei" ? (P.leiPorSufixo[sufixoLei(chave)] || null) : (lida(P.maps[st][chave]) ? P.maps[st][chave] : null); };
    // marca ou desmarca a leitura num Diário (mesmos formato e lugares dos Diários)
    P.marcar = function (st, chave, valor) {
      var hoje = iso(new Date()), local = lerJson(LOCAL[st], {});
      var chaves = [chave];
      if (st === "lei") Object.keys(Object.assign({}, local, P.maps.lei)).forEach(function (k) { if (sufixoLei(k) === sufixoLei(chave) && chaves.indexOf(k) < 0) chaves.push(k); });
      var delta = {};
      chaves.forEach(function (k) {
        if (valor) { if (!lida(local[k])) local[k] = { lida: true, lidaEm: hoje }; P.maps[st][k] = local[k]; delta[k] = local[k]; }
        else { delete local[k]; delete P.maps[st][k]; delta[k] = window.firebase && firebase.firestore ? firebase.firestore.FieldValue.delete() : null; }
      });
      gravarJson(LOCAL[st], local);
      indexar();
      if (P.db && P.uid) P.db.doc(CAMINHO[st] + P.uid).set({ map: delta, updatedAt: new Date().toISOString() }, { merge: true }).catch(function () {});
    };
    P.revisaoFeita = function (rid, depoisDe) { return (P.rev[rid] || []).some(function (d) { return d >= depoisDe; }); };
    P.marcarRevisao = function (rid, valor) {
      var hoje = iso(new Date()), local = lerJson(REV_KEY, {});
      var lista = (local[rid] || []).filter(function (d) { return d !== hoje; });
      if (valor) lista.push(hoje);
      lista.sort();
      local[rid] = lista; P.rev[rid] = lista;
      gravarJson(REV_KEY, local);
      if (P.db && P.uid) { var o = {}; o[rid] = lista; P.db.doc("progress-premios/" + P.uid).set({ revisoes: o, updatedAt: new Date().toISOString() }, { merge: true }).catch(function () {}); }
    };
    P.salvarCronograma = function (cfg) {
      gravarJson(PARTES_KEY, P.partes);
      if (P.db && P.uid) P.db.doc("progress-premios/" + P.uid).set({ cronograma: { cfg: cfg, partes: P.partes }, updatedAt: new Date().toISOString() }, { merge: true }).catch(function () {});
    };
    return P;
  }

  function carregarScript(url) {
    return fetch(url, { cache: "no-cache" }).then(function (r) { if (!r.ok) throw new Error(url); return r.text(); })
      .then(function (c) { (0, eval)(c + "\n//# sourceURL=" + url); });
  }

  // ---- interface ----------------------------------------------------------------------------------
  function configPadrao() {
    return { horas: 4, horizonte: "semestral", inicio: iso(new Date()), dias: [1, 2, 3, 4, 5, 6], pctCurso: 40, diaRevisao: 6, aba: "hoje" };
  }

  function iniciar(raiz) {
    if (raiz.getAttribute("data-pronto")) return;
    raiz.setAttribute("data-pronto", "1");
    raiz.classList.add("cr-raiz");
    raiz.innerHTML = '<p class="cr-vazio">Carregando o cronograma…</p>';

    var link = document.createElement("link");
    link.rel = "stylesheet"; link.href = BASE + "cronograma-styles.css";
    document.head.appendChild(link);

    var cfg = Object.assign(configPadrao(), lerJson(CFG_KEY, {}));
    var P = criarProgresso();
    P.lerLocal();
    var dados = null, S = null, plano = null, entradas = null, registro = {};

    var pEditais = window.EditaisShared && window.EditaisShared.__ready ? Promise.resolve() : carregarScript(BASE + "editais-shared.js");
    Promise.all([
      pEditais,
      fetch(BASE + "leve/cronograma.json", { cache: "no-cache" }).then(function (r) { if (!r.ok) throw new Error("cronograma.json"); return r.json(); })
    ]).then(function (r) {
      dados = r[1];
      return new Promise(function (ok) { window.EditaisShared.load(function (s) { S = s; ok(); }); });
    }).then(function () {
      S.onChange(function () { recalcular(); desenhar(); });
      recalcular(); desenhar();
      // login e dados da conta (o cronograma já aparece com o que está neste navegador)
      return P.entrar().then(function () {
        if (!P.uid) { avisoLogin(); return; }
        return P.carregarNuvem().then(function () {
          var n = P.cronogramaNuvem;
          if (n && n.cfg) { cfg = Object.assign(configPadrao(), n.cfg); gravarJson(CFG_KEY, cfg); }
          if (n && n.partes) { P.partes = Object.assign({}, P.partes, n.partes); gravarJson(PARTES_KEY, P.partes); }
          else P.salvarCronograma(cfg);                       // primeira vez na conta: guarda o que estava neste navegador
          recalcular(); desenhar();
        });
      });
    }).catch(function () {
      raiz.innerHTML = '<p class="cr-vazio">Não consegui carregar o cronograma agora. Tente de novo em alguns minutos.</p>';
    });
    function avisoLogin() {
      try { if (window.EstudaManaNuvem && window.EstudaManaNuvem.mostrarLogin) window.EstudaManaNuvem.mostrarLogin(raiz); } catch (e) {}
    }
    // voltando de outra aba (onde a pessoa marcou algo num Diário), puxa de novo
    document.addEventListener("visibilitychange", function () {
      if (document.visibilityState !== "visible" || !S) return;
      P.lerLocal();
      (P.uid ? P.carregarNuvem() : Promise.resolve()).then(function () { desenhar(); });
    });

    function salvarCfg() { gravarJson(CFG_KEY, cfg); P.salvarCronograma(cfg); }

    function recalcular() {
      var ed = S && S.principal();
      if (!ed) { plano = null; entradas = null; return; }
      entradas = entradasDoEdital(ed, dados);
      // o que já estava lido (nos Diários) antes do início do plano não entra de novo
      entradas.pular = function (st, chave) {
        var e = P.entrada(st, chave);
        if (!e) return false;
        var d = dataDe(e);
        return !d || d < cfg.inicio;
      };
      plano = montarPlano(cfg, entradas);
    }

    // ---- estado de cada item ----
    function estaFeito(it) {
      if (it.rid && it.dataPlano) return P.revisaoFeita(it.rid, it.dataPlano);          // revisão: feita neste dia ou depois
      if (it.st && P.entrada(it.st, it.sk)) return true;                                   // já lido no Diário
      return !!P.partes[it.k];
    }
    function marcarItem(it, valor) {
      var hoje = iso(new Date());
      if (it.rid && it.dataPlano) { P.marcarRevisao(it.rid, valor); return; }
      if (it.st === "lei") {
        if (valor) P.partes[it.k] = hoje; else delete P.partes[it.k];
        if (it.ultima) P.marcar("lei", it.sk, valor);
        P.salvarCronograma(cfg);
        return;
      }
      if (it.st) P.marcar(it.st, it.sk, valor);
    }

    // ---- peças da tela ----
    function opcoesEditais() {
      var lista = S.data().filter(function (e) { return !e.emBreve && (e.leis || []).length; });
      var carreiras = lista.filter(function (e) { return e.tipo === "carreira"; });
      var editais = lista.filter(function (e) { return e.tipo !== "carreira"; });
      var atual = S.principalId();
      function op(e) { return '<option value="' + esc(e.id) + '"' + (e.id === atual ? " selected" : "") + ">" + esc(e.tipo === "carreira" ? e.titulo : (e.sigla + " — " + e.titulo + (e.cargo ? " (" + e.cargo + ")" : ""))) + "</option>"; }
      return '<option value="">Escolha a carreira ou o edital…</option>' +
        '<optgroup label="Carreiras e exames (reúnem vários editais)">' + carreiras.map(op).join("") + "</optgroup>" +
        '<optgroup label="Editais específicos">' + editais.map(op).join("") + "</optgroup>";
    }
    function botoes(nome, valores, atual, rotulo) {
      return valores.map(function (v) {
        return '<button type="button" class="cr-opcao' + (String(v) === String(atual) ? " ativa" : "") + '" data-cfg="' + nome + '" data-valor="' + esc(v) + '">' + esc(rotulo ? rotulo(v) : v) + "</button>";
      }).join("");
    }
    function painelConfig() {
      var dow = [1, 2, 3, 4, 5, 6, 0];
      return '<section class="cr-config" aria-label="Configurar o cronograma">' +
        '<label class="cr-campo cr-campo-largo"><span>Carreira ou edital</span><select data-edital>' + opcoesEditais() + "</select></label>" +
        '<div class="cr-campo"><span>Horas de estudo por dia</span><div class="cr-opcoes">' + botoes("horas", [2, 4, 6, 8], cfg.horas, function (v) { return v + " h"; }) + "</div></div>" +
        '<div class="cr-campo"><span>Duração do plano</span><div class="cr-opcoes">' + botoes("horizonte", ["semestral", "anual"], cfg.horizonte, function (v) { return v === "anual" ? "Anual (12 meses)" : "Semestral (6 meses)"; }) + "</div></div>" +
        '<label class="cr-campo"><span>Tempo para cursos de fora do site</span><select data-cfg-select="pctCurso">' +
          [0, 20, 30, 40, 50, 60].map(function (v) { return '<option value="' + v + '"' + (v === +cfg.pctCurso ? " selected" : "") + ">" + v + "% do dia" + (v === 40 ? " (sugerido)" : "") + "</option>"; }).join("") + "</select></label>" +
        '<label class="cr-campo"><span>Começar em</span><input type="date" data-cfg-input="inicio" value="' + esc(cfg.inicio) + '"></label>' +
        '<div class="cr-campo cr-campo-largo"><span>Dias de estudo na semana</span><div class="cr-opcoes">' +
          dow.map(function (d) { return '<button type="button" class="cr-opcao' + (cfg.dias.indexOf(d) >= 0 ? " ativa" : "") + '" data-dia="' + d + '">' + DIAS_ABREV[d] + "</button>"; }).join("") + "</div>" +
          '<small>O último dia marcado de cada semana é o dia de revisão da semana.</small></div>' +
        "</section>";
    }
    function resumoPlano() {
      var r = plano.resumo, h = cfg.horas;
      var pct = r.leiMinTotal ? Math.min(100, Math.round(r.leiMinPlanejado / r.leiMinTotal * 100)) : 100;
      var disp = 0;
      plano.dias.forEach(function (d) { d.blocos.forEach(function (b) { if (b.id === "lei") disp += b.min; }); });
      var txt = '<p><b>Lei seca:</b> o plano cobre <b>' + pct + "%</b> das leis do edital que você ainda não leu (" + fmtMin(r.leiMinPlanejado) + " de " + fmtMin(r.leiMinTotal) + " de leitura).";
      if (pct < 100 && disp > 0) {
        var preciso = Math.ceil(h * (r.leiMinTotal / Math.max(1, r.leiMinPlanejado)) * 2) / 2;
        txt += " Para cobrir tudo neste prazo seriam necessárias cerca de <b>" + (preciso > 12 ? "mais de 12" : String(preciso).replace(".", ",")) + " h por dia</b> (ou um plano mais longo).";
      }
      txt += "</p>";
      txt += '<p><b>Súmulas e decisões:</b> ' + r.sumulasPlanejadas + " de " + r.jurTotal + " itens ainda não lidos, os mais cobrados em prova primeiro (" + entradas.orgs.map(function (o) { return NOMES_ORG[o] || o.toUpperCase(); }).join(", ") + ", decisões já cobradas e julgados de informativos com cara de prova).</p>";
      txt += '<p class="cr-conta">' + (P.uid ? "✔ Seu cronograma e o que você marca aqui ficam salvos na sua conta e valem também nos Diários e nas Revisões." : "Entre com a sua conta para salvar o cronograma e sincronizar com os Diários e as Revisões. Sem entrar, tudo fica só neste navegador.") + "</p>";
      return '<section class="cr-resumo"><h2>Resumo do plano</h2>' + txt + "</section>";
    }
    function itemHtml(it) {
      registro[it.k] = it;
      var feito = estaFeito(it);
      var etiqueta = it.revisao ? '<span class="cr-tag">revisar · ' + it.revisao + " d</span>" : (it.revisao === 0 ? '<span class="cr-tag">revisar</span>' : "");
      return '<li class="cr-item' + (feito ? " feito" : "") + '"><label><input type="checkbox" data-feito="' + esc(it.k) + '"' + (feito ? " checked" : "") + ">" +
        '<span class="cr-item-corpo"><a href="' + esc(it.href) + '" target="_blank" rel="noopener">' + esc(it.titulo) + "</a> " + etiqueta +
        (it.trecho ? '<span class="cr-sub"> — ' + esc(it.trecho) + "</span>" : "") +
        (it.sub ? '<span class="cr-sub">' + esc(it.sub.slice(0, 90)) + (it.sub.length >= 90 ? "…" : "") + "</span>" : "") +
        '</span><span class="cr-min">' + fmtMin(it.min) + "</span></label></li>";
    }
    function blocoHtml(b) {
      var lista = b.itens.length ? '<ul class="cr-lista">' + b.itens.map(itemHtml).join("") + "</ul>" : "";
      return '<div class="cr-bloco cr-bloco-' + b.id + '"><div class="cr-bloco-topo"><b>' + esc(b.titulo) + '</b><span class="cr-min">' + fmtMin(b.min) + "</span></div>" +
        (b.nota ? '<p class="cr-nota">' + esc(b.nota) + "</p>" : "") + lista + "</div>";
    }
    function progressoDia(dia) {
      var n = 0, f = 0;
      dia.blocos.forEach(function (b) { b.itens.forEach(function (it) { n++; if (estaFeito(it)) f++; }); });
      return { n: n, f: f };
    }
    function uniq(a) { return a.filter(function (x, i) { return a.indexOf(x) === i; }); }
    var NOMES_MAT = { civil: "Direito Civil", processual_civil: "Processo Civil", consumidor: "Direito do Consumidor", crianca: "Criança e Adolescente", penal: "Direito Penal",
      processual_penal: "Processo Penal", constitucional: "Direito Constitucional", eleitoral: "Direito Eleitoral", empresarial: "Direito Empresarial", tributario: "Direito Tributário",
      ambiental: "Direito Ambiental", administrativo: "Direito Administrativo", previdenciario: "Direito Previdenciário", humanos: "Direitos Humanos", trabalhista: "Direito do Trabalho" };
    function nomeMat(m) { return NOMES_MAT[m] || m; }
    function diaHtml(dia, aberto) {
      var d = daIso(dia.data), pr = progressoDia(dia);
      var foco = dia.revisaoSemanal ? "revisão da semana" : (dia.focoMat && dia.focoMat.length ? uniq(dia.focoMat).map(nomeMat).join(" e ") : "");
      return '<details class="cr-dia"' + (aberto ? " open" : "") + "><summary><b>" + esc(fmtDia(d)) + "</b>" + (foco ? ' <span class="cr-foco">· ' + esc(foco) + "</span>" : "") +
        '<span class="cr-prog">' + (pr.n ? pr.f + "/" + pr.n : "") + "</span></summary>" + dia.blocos.map(blocoHtml).join("") + "</details>";
    }

    function abaHoje() {
      var hojeIso = iso(new Date()), dia = plano.porData[hojeIso], html = "";
      if (!dia) {
        var proximo = plano.dias.filter(function (d) { return d.data >= hojeIso; })[0];
        html += '<p class="cr-vazio">' + (daIso(cfg.inicio) > new Date() ? "O plano começa em " + esc(fmtCurto(daIso(cfg.inicio))) + "." : "Hoje não é dia de estudo no seu plano (ou o plano já terminou).") + "</p>";
        if (proximo) html += "<h3>Próximo dia de estudo</h3>" + diaHtml(proximo, true);
        return html;
      }
      // atrasados: conteúdo novo dos últimos 7 dias que ficou sem marcar
      var atrasados = [], desde = iso(somaDias(new Date(), -7));
      plano.dias.forEach(function (d) {
        if (d.data >= hojeIso || d.data < desde) return;
        d.blocos.forEach(function (b) { if (b.id === "lei" || b.id === "jur") b.itens.forEach(function (it) { if (!estaFeito(it)) atrasados.push(it); }); });
      });
      html += "<h3>Hoje, " + esc(fmtDia(new Date())) + "</h3>" + diaHtml(dia, true);
      if (atrasados.length) html += '<details class="cr-dia cr-atrasados"><summary><b>Ficou para trás (últimos 7 dias): ' + atrasados.length + ' item(ns)</b></summary><ul class="cr-lista">' + atrasados.slice(0, 40).map(itemHtml).join("") + "</ul></details>";
      return html;
    }
    function inicioSemana(d) { return new Date(d.getFullYear(), d.getMonth(), d.getDate() - ((d.getDay() + 6) % 7)); }
    function abaSemana() {
      var seg = inicioSemana(new Date()), html = "", n = 0;
      for (var i = 0; i < 7; i++) {
        var d = plano.porData[iso(somaDias(seg, i))];
        if (d) { n++; html += diaHtml(d, iso(somaDias(seg, i)) === iso(new Date())); }
      }
      return n ? "<h3>Semana de " + esc(fmtCurto(seg)) + " a " + esc(fmtCurto(somaDias(seg, 6))) + "</h3>" + html : '<p class="cr-vazio">Esta semana não tem dias de estudo no plano.</p>';
    }
    function abaPlano() {
      var porMes = {}, ordem = [];
      plano.dias.forEach(function (d) {
        var dt = daIso(d.data), mk = dt.getFullYear() + "-" + p2(dt.getMonth() + 1);
        if (!porMes[mk]) { porMes[mk] = {}; ordem.push(mk); }
        (porMes[mk][d.semana] = porMes[mk][d.semana] || []).push(d);
      });
      return ordem.map(function (mk, idx) {
        var ano = mk.slice(0, 4), mes = +mk.slice(5) - 1;
        var semanas = Object.keys(porMes[mk]).map(function (sk) {
          var ds = porMes[mk][sk];
          var mats = uniq([].concat.apply([], ds.map(function (d) { return d.focoMat || []; }))).map(nomeMat);
          var n = 0, f = 0; ds.forEach(function (d) { var p = progressoDia(d); n += p.n; f += p.f; });
          return '<details class="cr-semana"><summary><b>Semana de ' + esc(fmtCurto(daIso(ds[0].data))) + "</b>" + (mats.length ? ' <span class="cr-foco">· ' + esc(mats.join(", ")) + "</span>" : "") +
            '<span class="cr-prog">' + (n ? f + "/" + n : "") + "</span></summary>" + ds.map(function (d) { return diaHtml(d, false); }).join("") + "</details>";
        }).join("");
        return '<details class="cr-mes"' + (idx === 0 ? " open" : "") + "><summary><b>" + MESES[mes] + " de " + ano + "</b></summary>" + semanas + "</details>";
      }).join("");
    }
    function abas() {
      var lista = [["hoje", "Hoje"], ["semana", "Esta semana"], ["plano", "Plano completo"]];
      return '<nav class="cr-abas">' + lista.map(function (a) {
        return '<button type="button" class="cr-aba' + (cfg.aba === a[0] ? " ativa" : "") + '" data-aba="' + a[0] + '">' + a[1] + "</button>";
      }).join("") + "</nav>";
    }

    function desenhar() {
      if (!S) return;
      // refazer a tela fecharia o que a pessoa abriu: guarda e reabre (pelo texto do título)
      var abertas = {};
      [].forEach.call(raiz.querySelectorAll("details"), function (d) { abertas[d.querySelector("summary").firstChild.textContent + "|" + (d.querySelector("summary b") || {}).textContent] = d.open; });
      var rolagem = window.pageYOffset;
      registro = {};
      var html = painelConfig();
      if (!S.principal()) {
        html += '<p class="cr-vazio">Escolha a sua carreira ou edital para montar o cronograma. A escolha vale também para as páginas Editais e Diário de Leis.</p>';
      } else if (plano) {
        html += resumoPlano() + abas() + '<div class="cr-corpo">' + (cfg.aba === "plano" ? abaPlano() : cfg.aba === "semana" ? abaSemana() : abaHoje()) + "</div>" +
          '<p class="cr-rodape">O plano é uma sugestão: ele muda sozinho se você mudar as horas, os dias ou o edital. Os tempos de leitura são estimativas (cerca de 100 palavras por minuto, com atenção e grifos). Leis, súmulas e decisões que você já tinha lido antes da data de início não entram no plano.</p>';
      }
      var painel = document.getElementById("account-panel");
      raiz.innerHTML = html;
      if (painel && !painel.parentNode) raiz.parentNode.insertBefore(painel, raiz);
      [].forEach.call(raiz.querySelectorAll("details"), function (d) {
        var chave = d.querySelector("summary").firstChild.textContent + "|" + (d.querySelector("summary b") || {}).textContent;
        if (Object.prototype.hasOwnProperty.call(abertas, chave)) d.open = abertas[chave];
      });
      if (rolagem && Math.abs(window.pageYOffset - rolagem) > 40) window.scrollTo(0, rolagem);
    }

    raiz.addEventListener("click", function (e) {
      var b = e.target.closest("[data-cfg]");
      if (b) {
        var nome = b.getAttribute("data-cfg"), v = b.getAttribute("data-valor");
        cfg[nome] = nome === "horas" ? +v : v;
        salvarCfg(); recalcular(); desenhar(); return;
      }
      var d = e.target.closest("[data-dia]");
      if (d) {
        var n = +d.getAttribute("data-dia"), i = cfg.dias.indexOf(n);
        if (i >= 0) { if (cfg.dias.length > 1) cfg.dias.splice(i, 1); } else cfg.dias.push(n);
        salvarCfg(); recalcular(); desenhar(); return;
      }
      var a = e.target.closest("[data-aba]");
      if (a) { cfg.aba = a.getAttribute("data-aba"); salvarCfg(); desenhar(); }
    });
    raiz.addEventListener("change", function (e) {
      var t = e.target;
      if (t.matches("[data-edital]")) { S.setPrincipal(t.value); return; }
      if (t.matches("[data-cfg-select]")) { cfg[t.getAttribute("data-cfg-select")] = +t.value; salvarCfg(); recalcular(); desenhar(); return; }
      if (t.matches("[data-cfg-input]")) { if (t.value) { cfg[t.getAttribute("data-cfg-input")] = t.value; salvarCfg(); recalcular(); desenhar(); } return; }
      if (t.matches("[data-feito]")) {
        var it = registro[t.getAttribute("data-feito")];
        if (!it) return;
        marcarItem(it, t.checked);
        desenhar();
      }
    });
  }

  window.EstudaManaCronograma = { montarPlano: montarPlano, entradasDoEdital: entradasDoEdital, iniciar: iniciar };
  if (typeof document !== "undefined") {
    var tentar = function () { var r = document.getElementById("estudamana-cronograma"); if (r) iniciar(r); };
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", tentar); else tentar();
  }
})();
