/*
 * premios-logic.js — motor e tela da página "Meus Prêmios".
 *
 * Lê as leituras que os três Diários (Informativos, Leis, Súmulas) já
 * guardam no navegador, calcula todos os prêmios do catálogo
 * (premios-data.js) e desenha a página. Não grava nada nos Diários.
 *
 * Requer, antes deste arquivo: diario-data.js, leis-data.js,
 * sumulas-data.js e premios-data.js.
 */
(function () {
  "use strict";

  var CFG = window.PREMIOS_CONFIG;
  var KEYS = { inf: "informativos-lidos", lei: "leis-lidas", sum: "sumulas-lidas" };
  var SEEN_KEY = "premios-vistos";
  var AVATAR_KEY = "informativos-avatar";
  var ORGS = ["stf", "stj", "tse", "cnj", "tst", "cnmp"];
  var TIER_ORDER = ["bronze", "prata", "ouro", "platina", "diamante"];
  var WD_NAMES = ["dom", "seg", "ter", "qua", "qui", "sex", "sáb"];
  var FAIXA_ICONS = ["🔍", "🎓", "🧠", "🏅", "👑"];

  var CATS = [
    { id: "pontualidade", icon: "⏱️", label: "Pontualidade" },
    { id: "semanas",      icon: "🏆", label: "Semanas Perfeitas" },
    { id: "volume",       icon: "📈", label: "Volume" },
    { id: "sequencia",    icon: "🔥", label: "Sequências" },
    { id: "tribunais",    icon: "🏛️", label: "Tribunais" },
    { id: "leis",         icon: "📜", label: "Leis" },
    { id: "sumulas",      icon: "📌", label: "Súmulas" },
    { id: "combos",       icon: "🧩", label: "Combinações" },
    { id: "especiais",    icon: "🎁", label: "Especiais" }
  ];

  /* ==================================================================
     Datas
     ================================================================== */
  function pad(n) { return String(n).padStart(2, "0"); }
  function isoOk(s) { return typeof s === "string" && /^\d{4}-\d{2}-\d{2}$/.test(s); }
  function dayNum(iso) {
    var p = iso.split("-");
    return Math.round(Date.UTC(+p[0], +p[1] - 1, +p[2]) / 864e5);
  }
  function isoOf(n) {
    var d = new Date(n * 864e5);
    return d.getUTCFullYear() + "-" + pad(d.getUTCMonth() + 1) + "-" + pad(d.getUTCDate());
  }
  function weekIdx(n) { return Math.floor((n + 3) / 7); }        // semana começa na segunda
  function weekdayOf(n) { return (((n + 4) % 7) + 7) % 7; }        // 0 = domingo
  function daysInMonth(y, m) { return new Date(Date.UTC(y, m, 0)).getUTCDate(); }
  function todayIso() {
    var d = new Date();
    return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate());
  }

  function lagTier(lag) {
    if (lag === 0) return "ouro";
    if (lag === 1) return "prata";
    if (lag === 2) return "bronze";
    if (lag <= 6) return "fita";
    return null;
  }

  function readEntry(v) {
    if (v === true) return { lida: true, lidaEm: null };
    if (v && typeof v === "object" && v.lida) {
      return { lida: true, lidaEm: isoOk(v.lidaEm) ? v.lidaEm : null };
    }
    return null;
  }

  function g(name) { return typeof window[name] !== "undefined" ? window[name] : undefined; }

  function slug(text) {
    return (text || "").toLowerCase()
      .normalize("NFD").replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  }

  /* ==================================================================
     1) Contexto: transforma as leituras em números
     ================================================================== */
  function buildContext(maps, today) {
    var todayDn = dayNum(today);
    var currentYear = +today.slice(0, 4);
    var ctx = {
      today: today, todayDn: todayDn,
      read: { inf: 0, lei: 0, sum: 0 },
      total: { inf: 0, lei: 0, sum: 0 },
      points: 0,
      lag: { ouro: 0, prata: 0, bronze: 0, fita: 0 },
      onTimeByOrg: {}, infByOrg: {}, leisByMateria: {}, sumByOrg: {},
      cacaSumulas: 0, arqueologo: 0, seculoPassado: 0
    };
    var events = [];
    var pubs = [];

    // ---- Informativos ----
    ORGS.forEach(function (org) {
      var rows = g(org.toUpperCase() + "_DATA") || [];
      var info = { total: rows.length, read: 0, years: {} };
      ctx.infByOrg[org] = info;
      ctx.onTimeByOrg[org] = 0;
      rows.forEach(function (row) {
        var entry = readEntry((maps.inf || {})[org + ":" + row.ano + ":" + row.edicao]);
        var pub = isoOk(row.data) ? row.data : null;
        var year = row.ano || (pub ? +pub.slice(0, 4) : null);
        var pubDn = pub ? dayNum(pub) : null;
        ctx.total.inf++;
        if (year) {
          var y = info.years[year] || (info.years[year] = { total: 0, read: 0 });
          y.total++;
          if (entry) y.read++;
        }
        var readDn = entry && entry.lidaEm ? dayNum(entry.lidaEm) : null;
        if (pub) pubs.push({ org: org, edicao: row.edicao, ano: row.ano, pub: pub, pubDn: pubDn, read: !!entry, readDn: readDn });
        if (!entry) return;
        info.read++;
        ctx.read.inf++;
        ctx.points += CFG.pontosPorLeitura.inf;
        if (row.sumula === true) ctx.cacaSumulas++;
        if (year && year < 2000) ctx.seculoPassado++;
        if (year && year <= currentYear - 10) ctx.arqueologo++;
        var lag = null;
        if (readDn !== null && pubDn !== null) {
          lag = Math.max(0, readDn - pubDn);
          var t = lagTier(lag);
          if (t) {
            ctx.lag[t]++;
            if (t === "ouro") ctx.onTimeByOrg[org]++;
            if (CFG.pontosBonusPontualidade[t]) ctx.points += CFG.pontosBonusPontualidade[t];
          }
        }
        if (readDn !== null) events.push({ d: "inf", org: org, dn: readDn, lag: lag });
      });
    });

    // ---- Leis ----
    var leisData = g("LEIS_DATA") || {};
    (g("LEIS_ORG_ORDER") || Object.keys(leisData)).forEach(function (key) {
      var block = leisData[key];
      if (!block) return;
      var m = { label: block.label, total: block.leis.length, read: 0 };
      ctx.leisByMateria[key] = m;
      block.leis.forEach(function (row) {
        var entry = readEntry((maps.lei || {})[key + ":" + slug(row.numero)]);
        ctx.total.lei++;
        if (!entry) return;
        m.read++;
        ctx.read.lei++;
        ctx.points += CFG.pontosPorLeitura.lei;
        if (entry.lidaEm) events.push({ d: "lei", org: key, dn: dayNum(entry.lidaEm) });
      });
    });

    // ---- Súmulas ----
    var sumData = g("SUMULAS_DATA") || {};
    (g("SUMULAS_ORG_ORDER") || Object.keys(sumData)).forEach(function (key) {
      var block = sumData[key];
      if (!block || block.status !== "disponivel" || !block.sumulas || !block.sumulas.length) return;
      var s = { label: block.label, total: block.sumulas.length, read: 0 };
      ctx.sumByOrg[key] = s;
      block.sumulas.forEach(function (row) {
        var entry = readEntry((maps.sum || {})[key + ":" + row.numero]);
        ctx.total.sum++;
        if (!entry) return;
        s.read++;
        ctx.read.sum++;
        ctx.points += CFG.pontosPorLeitura.sum;
        if (entry.lidaEm) events.push({ d: "sum", org: key, dn: dayNum(entry.lidaEm) });
      });
    });

    ctx.totalRead = ctx.read.inf + ctx.read.lei + ctx.read.sum;

    // ---- Semanas de publicação (informativos de todos os tribunais) ----
    var pubWeeks = {};
    pubs.forEach(function (p) {
      var w = pubWeeks[weekIdx(p.pubDn)] || (pubWeeks[weekIdx(p.pubDn)] = { fail: false, maxLag: 0 });
      if (p.read && p.readDn !== null) w.maxLag = Math.max(w.maxLag, Math.max(0, p.readDn - p.pubDn));
      else w.fail = true;
    });
    ctx.weeks = { ouro: 0, prata: 0, bronze: 0, emDia: 0 };
    Object.keys(pubWeeks).forEach(function (k) {
      var w = pubWeeks[k];
      if (w.fail) return;
      if (w.maxLag === 0) ctx.weeks.ouro++;
      if (w.maxLag <= 1) ctx.weeks.prata++;
      if (w.maxLag <= 2) ctx.weeks.bronze++;
      if (w.maxLag <= 6) ctx.weeks.emDia++;
    });

    // ---- Desafio da semana: informativos dos últimos 7 dias ----
    ctx.recent = pubs.filter(function (p) { return p.pubDn <= todayDn && p.pubDn >= todayDn - 6; })
      .sort(function (a, b) { return b.pubDn - a.pubDn; })
      .map(function (p) {
        var lag = p.read && p.readDn !== null ? Math.max(0, p.readDn - p.pubDn) : null;
        return {
          org: p.org, edicao: p.edicao, ano: p.ano, pub: p.pub, pubDn: p.pubDn,
          read: p.read, medal: lag !== null ? lagTier(lag) : null,
          medalHoje: lagTier(todayDn - p.pubDn)
        };
      });

    // ---- Agregações por dia / semana ----
    var perDay = {}, perWeek = {}, mdSet = {}, wdCount = {};
    var sexta13 = false, bissexto = false;
    events.forEach(function (e) {
      var d = perDay[e.dn] || (perDay[e.dn] = { inf: 0, lei: 0, sum: 0, total: 0, orgs: {} });
      d[e.d]++; d.total++;
      if (e.d === "inf") d.orgs[e.org] = true;
      var wk = weekIdx(e.dn);
      var w = perWeek[wk] || (perWeek[wk] = { inf: 0, lei: 0, sum: 0, total: 0, wds: {} });
      w[e.d]++; w.total++;
      var wd = weekdayOf(e.dn);
      w.wds[wd] = true;
      wdCount[wd] = (wdCount[wd] || 0) + 1;
      var iso = isoOf(e.dn);
      mdSet[iso.slice(5)] = true;
      if (wd === 5 && iso.slice(8) === "13") sexta13 = true;
      if (iso.slice(5) === "02-29") bissexto = true;
    });
    ctx.wdCount = wdCount;
    ctx.mdSet = mdSet;
    ctx.sexta13 = sexta13;
    ctx.bissexto = bissexto;

    var days = Object.keys(perDay).map(Number).sort(function (a, b) { return a - b; });
    ctx.distinctDays = days.length;

    ctx.maxDay = 0; ctx.triDays = 0; ctx.maxOrgsDay = 0;
    days.forEach(function (dn) {
      var d = perDay[dn];
      ctx.maxDay = Math.max(ctx.maxDay, d.total);
      if (d.inf && d.lei && d.sum) ctx.triDays++;
      ctx.maxOrgsDay = Math.max(ctx.maxOrgsDay, Object.keys(d.orgs).length);
    });

    var weeks = Object.keys(perWeek).map(Number).sort(function (a, b) { return a - b; });
    ctx.maxWeek = { inf: 0, lei: 0, sum: 0 };
    ctx.triWeeks = 0; ctx.fullWeeks = 0; ctx.weekends = 0;
    weeks.forEach(function (k) {
      var w = perWeek[k];
      ctx.maxWeek.inf = Math.max(ctx.maxWeek.inf, w.inf);
      ctx.maxWeek.lei = Math.max(ctx.maxWeek.lei, w.lei);
      ctx.maxWeek.sum = Math.max(ctx.maxWeek.sum, w.sum);
      if (w.inf && w.lei && w.sum) ctx.triWeeks++;
      if (Object.keys(w.wds).length === 7) ctx.fullWeeks++;
      if (w.wds[6] && w.wds[0]) ctx.weekends++;
    });

    // sequências
    function runs(sorted) {
      var best = 0, run = 0;
      sorted.forEach(function (n, i) {
        run = i > 0 && n === sorted[i - 1] + 1 ? run + 1 : 1;
        best = Math.max(best, run);
      });
      return best;
    }
    function currentRun(sorted, now) {
      if (!sorted.length) return 0;
      var last = sorted[sorted.length - 1];
      if (now - last > 1) return 0;
      var run = 1;
      for (var i = sorted.length - 1; i > 0 && sorted[i] - 1 === sorted[i - 1]; i--) run++;
      return run;
    }
    ctx.streakDays = runs(days);
    ctx.streakNow = currentRun(days, todayDn);
    ctx.streakWeeks = runs(weeks);
    ctx.maxGap = 0;
    for (var i = 1; i < days.length; i++) ctx.maxGap = Math.max(ctx.maxGap, days[i] - days[i - 1] - 1);

    // meses completos e meses distintos por ano
    var monthDays = {}, yearMonths = {};
    days.forEach(function (dn) {
      var iso = isoOf(dn);
      var y = +iso.slice(0, 4), m = +iso.slice(5, 7);
      var k = y + "-" + m;
      monthDays[k] = (monthDays[k] || 0) + 1;
      (yearMonths[y] = yearMonths[y] || {})[m] = true;
    });
    ctx.fullMonths = 0;
    Object.keys(monthDays).forEach(function (k) {
      var p = k.split("-");
      if (monthDays[k] === daysInMonth(+p[0], +p[1])) ctx.fullMonths++;
    });
    ctx.maxMonthsInYear = 0;
    Object.keys(yearMonths).forEach(function (y) {
      ctx.maxMonthsInYear = Math.max(ctx.maxMonthsInYear, Object.keys(yearMonths[y]).length);
    });

    ctx.orgsRead = ORGS.filter(function (o) { return ctx.infByOrg[o].read > 0; }).length;
    return ctx;
  }

  /* ==================================================================
     2) Prêmios: gera a lista a partir do catálogo
     ================================================================== */
  function tierAt(i, n) {
    if (n === 1) return "ouro";
    var r = i / (n - 1);
    return r < 0.2 ? "bronze" : r < 0.45 ? "prata" : r < 0.7 ? "ouro" : r < 0.9 ? "platina" : "diamante";
  }

  function buildAwards(ctx) {
    var E = CFG.escadas;
    var A = [];

    function ladder(cat, idp, rungs, value, descFn, opts) {
      opts = opts || {};
      var list = rungs.filter(function (r) { return !opts.max || r[0] <= opts.max; });
      list.forEach(function (r, i) {
        A.push({
          id: idp + "-" + r[0], cat: cat, icon: r[1],
          title: opts.titleFn ? opts.titleFn(r) : r[2],
          desc: descFn(r[0]), tier: tierAt(i, list.length), target: r[0], value: value
        });
      });
    }
    function single(cat, id, icon, title, desc, tier, value, target, secret) {
      A.push({ id: id, cat: cat, icon: icon, title: title, desc: desc, tier: tier, target: target || 1, value: value, secret: !!secret });
    }
    function plural(n, one, many) { return n + " " + (n === 1 ? one : many); }

    // ---- Pontualidade ----
    ladder("pontualidade", "ouro", E.pontualOuro, ctx.lag.ouro, function (n) {
      return "Leia " + plural(n, "informativo", "informativos") + " no mesmo dia em que foi publicado (🥇).";
    });
    ladder("pontualidade", "prata", E.pontualPrata, ctx.lag.prata, function (n) {
      return "Leia " + plural(n, "informativo", "informativos") + " no dia seguinte ao da publicação (🥈).";
    });
    ladder("pontualidade", "bronze", E.pontualBronze, ctx.lag.bronze, function (n) {
      return "Leia " + plural(n, "informativo", "informativos") + " dois dias depois da publicação (🥉).";
    });
    ladder("pontualidade", "fita", E.naSemana, ctx.lag.fita + ctx.lag.bronze + ctx.lag.prata + ctx.lag.ouro, function (n) {
      return "Leia " + plural(n, "informativo", "informativos") + " em até 6 dias depois de publicado (🎖️ ou melhor).";
    });
    ORGS.forEach(function (org) {
      var label = org.toUpperCase();
      ladder("pontualidade", "ouro-" + org, E.pontualPorOrg, ctx.onTimeByOrg[org], function (n) {
        return "Leia " + plural(n, "informativo do " + label, "informativos do " + label) + " no dia da publicação.";
      }, { titleFn: function (r) { return r[2] + " · " + label; } });
    });

    // ---- Semanas perfeitas ----
    ladder("semanas", "sem-ouro", E.semanaOuro, ctx.weeks.ouro, function (n) {
      return "Leia TODOS os informativos novos de " + plural(n, "semana", "semanas") + ", cada um no dia em que foi publicado.";
    });
    ladder("semanas", "sem-prata", E.semanaPrata, ctx.weeks.prata, function (n) {
      return "Feche " + plural(n, "semana", "semanas") + " com todos os informativos lidos em até 1 dia da publicação.";
    });
    ladder("semanas", "sem-bronze", E.semanaBronze, ctx.weeks.bronze, function (n) {
      return "Feche " + plural(n, "semana", "semanas") + " com todos os informativos lidos em até 2 dias da publicação.";
    });
    ladder("semanas", "sem-dia", E.semanaEmDia, ctx.weeks.emDia, function (n) {
      return "Feche " + plural(n, "semana", "semanas") + " com todos os informativos lidos em até 6 dias da publicação.";
    });

    // ---- Volume ----
    ladder("volume", "inf-sem", E.infSemana, ctx.maxWeek.inf, function (n) {
      return "Leia " + n + " informativos numa mesma semana (segunda a domingo).";
    });
    ladder("volume", "lei-sem", E.leisSemana, ctx.maxWeek.lei, function (n) {
      return "Leia " + n + " leis numa mesma semana.";
    });
    ladder("volume", "sum-sem", E.sumulasSemana, ctx.maxWeek.sum, function (n) {
      return "Leia " + n + " súmulas numa mesma semana.";
    });
    ladder("volume", "dia", E.dia, ctx.maxDay, function (n) {
      return "Marque " + n + " leituras num único dia (informativos, leis e súmulas somados).";
    });
    ladder("volume", "tot-inf", E.totalInf, ctx.read.inf, function (n) {
      return "Leia " + plural(n, "informativo", "informativos") + " no total.";
    }, { max: ctx.total.inf });
    ladder("volume", "tot-lei", E.totalLeis, ctx.read.lei, function (n) {
      return "Leia " + plural(n, "lei", "leis") + " no total.";
    }, { max: ctx.total.lei });
    ladder("volume", "tot-sum", E.totalSumulas, ctx.read.sum, function (n) {
      return "Leia " + plural(n, "súmula", "súmulas") + " no total.";
    }, { max: ctx.total.sum });
    ladder("volume", "tot-geral", E.totalGeral, ctx.totalRead, function (n) {
      return "Some " + n.toLocaleString("pt-BR") + " leituras entre os três Diários.";
    });

    // ---- Sequências ----
    ladder("sequencia", "dias-seg", E.diasSeguidos, ctx.streakDays, function (n) {
      return "Leia algo em " + n + " dias seguidos (recorde da sua história).";
    });
    ladder("sequencia", "sem-seg", E.semanasSeguidas, ctx.streakWeeks, function (n) {
      return "Leia algo em " + n + " semanas seguidas.";
    });
    ladder("sequencia", "dias-dist", E.diasDistintos, ctx.distinctDays, function (n) {
      return "Estude em " + n + " dias diferentes (não precisam ser seguidos).";
    });
    ladder("sequencia", "recomeco", E.recomeco, ctx.maxGap, function (n) {
      return "Fique " + n + " dias sem ler e volte a estudar. Recomeçar também é conquista.";
    });

    // ---- Tribunais ----
    ORGS.forEach(function (org) {
      var info = ctx.infByOrg[org];
      if (!info.total) return;
      var label = org.toUpperCase();
      CFG.faixasCobertura.forEach(function (f, i) {
        var target = Math.max(1, Math.ceil(info.total * f.pct / 100));
        single("tribunais", "cob-" + org + "-" + f.pct, FAIXA_ICONS[i] || CFG.emojiOrg[org],
          f.nome + " do " + label,
          "Leia " + (f.pct === 100 ? "todos os " : f.pct + "% dos ") + info.total.toLocaleString("pt-BR") + " informativos do " + label + " (" + target.toLocaleString("pt-BR") + ").",
          tierAt(i, CFG.faixasCobertura.length), info.read, target);
      });
      var years = Object.keys(info.years).map(Number).sort(function (a, b) { return b - a; })
        .filter(function (y) { return y >= +ctx.today.slice(0, 4) - 7; });
      years.forEach(function (y) {
        var yr = info.years[y];
        var tier = yr.total <= 10 ? "bronze" : yr.total <= 30 ? "prata" : yr.total <= 60 ? "ouro" : "platina";
        single("tribunais", "ano-" + org + "-" + y, CFG.emojiOrg[org] || "🏛️",
          label + " " + y + " Completo",
          "Leia todos os " + yr.total + " informativos do " + label + " de " + y + ".",
          tier, yr.read, yr.total);
      });
    });
    ladder("tribunais", "multi", E.multiTribunal, ctx.orgsRead, function (n) {
      return "Leia pelo menos um informativo de " + n + " tribunais diferentes.";
    });
    ladder("tribunais", "multi-dia", E.multiTribunalDia, ctx.maxOrgsDay, function (n) {
      return "Leia informativos de " + n + " tribunais diferentes no mesmo dia.";
    });
    ladder("tribunais", "arq", E.arqueologo, ctx.arqueologo, function (n) {
      return "Leia " + n + " informativos publicados há 10 anos ou mais.";
    });
    ladder("tribunais", "90s", E.seculoPassado, ctx.seculoPassado, function (n) {
      return "Leia " + plural(n, "informativo", "informativos") + " dos anos 1990 (ou anteriores).";
    });

    // ---- Leis ----
    var matNames = ["Estudioso", "Mestre"];
    Object.keys(ctx.leisByMateria).forEach(function (key) {
      var m = ctx.leisByMateria[key];
      if (!m.total) return;
      var icon = CFG.emojiMateria[key] || "📚";
      single("leis", "mat-" + key + "-50", icon, "Estudioso · " + m.label,
        "Leia metade das leis de " + m.label + " (" + Math.ceil(m.total / 2) + " de " + m.total + ").",
        "prata", m.read, Math.ceil(m.total / 2));
      single("leis", "mat-" + key + "-100", icon, "Mestre · " + m.label,
        "Leia todas as " + m.total + " leis de " + m.label + ".", "ouro", m.read, m.total);
    });
    CFG.faixasCobertura.forEach(function (f, i) {
      var target = Math.max(1, Math.ceil(ctx.total.lei * f.pct / 100));
      if (!ctx.total.lei) return;
      single("leis", "leis-cob-" + f.pct, FAIXA_ICONS[i], f.nome + " das Leis",
        "Leia " + (f.pct === 100 ? "todas as " : f.pct + "% das ") + ctx.total.lei + " leis do Diário das Leis (" + target + ").",
        tierAt(i, CFG.faixasCobertura.length), ctx.read.lei, target);
    });

    // ---- Súmulas ----
    Object.keys(ctx.sumByOrg).forEach(function (key) {
      var s = ctx.sumByOrg[key];
      CFG.faixasCobertura.forEach(function (f, i) {
        var target = Math.max(1, Math.ceil(s.total * f.pct / 100));
        single("sumulas", "sum-" + key + "-" + f.pct, FAIXA_ICONS[i], f.nome + " · " + s.label,
          "Leia " + (f.pct === 100 ? "todas as " : f.pct + "% das ") + s.total + " súmulas de " + s.label + " (" + target + ").",
          tierAt(i, CFG.faixasCobertura.length), s.read, target);
      });
    });
    ladder("sumulas", "caca", E.cacaSumulas, ctx.cacaSumulas, function (n) {
      return "Leia " + plural(n, "informativo", "informativos") + " que trazem súmula (marcados com o selo de súmula no Diário).";
    });

    // ---- Combinações ----
    ladder("combos", "tri-dia", E.triadeDia, ctx.triDays, function (n) {
      return "Leia informativo, lei e súmula no mesmo dia, " + (n === 1 ? "1 vez" : n + " vezes") + ".";
    });
    ladder("combos", "tri-sem", E.triadeSemana, ctx.triWeeks, function (n) {
      return "Leia algo dos três Diários na mesma semana, " + (n === 1 ? "1 vez" : n + " semanas") + ".";
    });
    ladder("combos", "sem-cheia", E.semanaCompleta, ctx.fullWeeks, function (n) {
      return "Estude nos 7 dias de uma mesma semana (segunda a domingo), " + (n === 1 ? "1 vez" : n + " vezes") + ".";
    });
    ladder("combos", "fds", E.fimDeSemana, ctx.weekends, function (n) {
      return "Estude no sábado E no domingo do mesmo fim de semana, " + (n === 1 ? "1 vez" : n + " vezes") + ".";
    });
    ladder("combos", "mes-perf", E.mesPerfeito, ctx.fullMonths, function (n) {
      return "Estude todos os dias de um mês inteiro, " + (n === 1 ? "1 vez" : n + " meses") + ".";
    });
    ladder("combos", "meses-ano", E.mesesDoAno, ctx.maxMonthsInYear, function (n) {
      return "Estude em " + n + " meses diferentes do mesmo ano.";
    });

    // ---- Especiais ----
    [1, 2, 3, 4, 5, 6, 0].forEach(function (wd) {
      var d = CFG.diasDaSemana[wd];
      single("especiais", "dsem-" + wd, d[0], d[1], d[2], "bronze", ctx.wdCount[wd] || 0, 1);
    });
    var wdAll = 0;
    for (var wd = 0; wd < 7; wd++) if (ctx.wdCount[wd]) wdAll++;
    single("especiais", "dias-todos", "🌈", "Todos os Dias da Semana",
      "Já tenha estudado em cada um dos 7 dias da semana (segunda, terça... domingo).", "prata", wdAll, 7);

    Object.keys(CFG.datasEspeciais).forEach(function (md) {
      var d = CFG.datasEspeciais[md];
      single("especiais", "data-" + md, d[0], d[1], d[2], "ouro", ctx.mdSet[md] ? 1 : 0, 1, true);
    });
    var ex = CFG.secretosExtras;
    single("especiais", "sexta13", ex.sexta13[0], ex.sexta13[1], ex.sexta13[2], "platina", ctx.sexta13 ? 1 : 0, 1, true);
    single("especiais", "bissexto", ex.bissexto[0], ex.bissexto[1], ex.bissexto[2], "platina", ctx.bissexto ? 1 : 0, 1, true);

    A.forEach(function (a) {
      a.value = Math.min(a.value, a.target);
      a.done = a.value >= a.target;
      a.pct = a.target ? a.value / a.target : 0;
      a.pontos = CFG.tiers[a.tier].pontos;
    });
    return A;
  }

  function computeAll(maps, today) {
    var ctx = buildContext(maps, today);
    var awards = buildAwards(ctx);
    var awardPoints = 0;
    awards.forEach(function (a) { if (a.done) awardPoints += a.pontos; });
    ctx.readPoints = ctx.points;
    ctx.awardPoints = awardPoints;
    ctx.score = ctx.points + awardPoints;
    return { ctx: ctx, awards: awards };
  }

  window.PremiosEngine = { computeAll: computeAll, buildContext: buildContext, buildAwards: buildAwards, dayNum: dayNum, isoOf: isoOf };

  /* ==================================================================
     3) Tela
     ================================================================== */
  var root = document.getElementById("premios-main");
  if (!root) return;   // (em testes, só o motor é usado)

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function load(key) {
    try { var raw = localStorage.getItem(key); return raw ? JSON.parse(raw) : {}; } catch (e) { return {}; }
  }
  function avatarPref() {
    var p = load(AVATAR_KEY);
    var base = { f: "\u{1F469}", m: "\u{1F468}", x: "\u{1F9D1}" };
    var tones = { "1": "\u{1F3FB}", "2": "\u{1F3FC}", "3": "\u{1F3FD}", "4": "\u{1F3FE}", "5": "\u{1F3FF}" };
    var gender = base[p.gender] ? p.gender : "f";
    var tone = tones[p.tone] ? p.tone : "3";
    return { gender: gender, emoji: base[gender] + tones[tone] + "‍⚖️" };
  }
  function patenteOf(score, gender) {
    var list = CFG.patentes, idx = 0;
    list.forEach(function (p, i) { if (score >= p.min) idx = i; });
    var cur = list[idx], next = list[idx + 1] || null;
    return { cur: cur, next: next, name: cur[gender] || cur.x, nextName: next ? (next[gender] || next.x) : null };
  }
  function fmtDay(dn) {
    var iso = isoOf(dn);
    return WD_NAMES[weekdayOf(dn)] + " " + iso.slice(8) + "/" + iso.slice(5, 7);
  }
  var MEDAL_ICON = { ouro: "🥇", prata: "🥈", bronze: "🥉", fita: "🎖️" };

  var state = { tab: "resumo", filter: "todos", data: null, novos: {}, firstVisit: false, remote: null, sync: "loading" };

  // Para cada Diário: se a conta na nuvem tem as leituras, usa a nuvem;
  // senão, usa o que estiver guardado neste navegador.
  function refresh() {
    var remote = state.remote && state.remote.maps ? state.remote.maps : {};
    var maps = {
      inf: remote.inf || load(KEYS.inf),
      lei: remote.lei || load(KEYS.lei),
      sum: remote.sum || load(KEYS.sum)
    };
    state.data = computeAll(maps, todayIso());
    guardarConquistas();
  }

  /* ---- Prêmios permanentes ----------------------------------------------
     Um prêmio conquistado nunca se perde: guardamos {id: "AAAA-MM-DD"} neste
     navegador (premios-conquistados) e na conta (progress-premios/<uid>,
     campo "conquistados"). Se depois a leitura for desmarcada e o prêmio
     deixar de ser calculado, ele continua aparecendo como conquistado. */
  var CONQ_KEY = "premios-conquistados";
  function readConq() {
    var out = load(CONQ_KEY);
    var rc = state.remote && state.remote.conq;
    if (rc) Object.keys(rc).forEach(function (id) {
      if (!out[id] || String(rc[id]) < String(out[id])) out[id] = rc[id];
    });
    return out;
  }
  function guardarConquistas() {
    var conq = readConq(), added = {}, hasNew = false, today = todayIso();
    var data = state.data;
    data.awards.forEach(function (a) {
      if (a.done && !conq[a.id]) { conq[a.id] = today; added[a.id] = today; hasNew = true; }
      else if (!a.done && conq[a.id]) {
        a.done = true; a.kept = true; a.value = a.target; a.pct = 1;
      }
    });
    var pts = 0;
    data.awards.forEach(function (a) { if (a.done) pts += a.pontos; });
    data.ctx.awardPoints = pts;
    data.ctx.score = data.ctx.readPoints + pts;
    try { localStorage.setItem(CONQ_KEY, JSON.stringify(conq)); } catch (e) {}
    state.conq = conq;
    // sobe para a conta o que a conta ainda não tem
    var rc = (state.remote && state.remote.conq) || {}, toPush = {}, any = false;
    Object.keys(conq).forEach(function (id) { if (!rc[id]) { toPush[id] = conq[id]; any = true; } });
    if (any) pushConq(toPush);
  }
  function pushConq(obj) {
    var r = state.remote;
    if (!r || !r.user) return;
    try {
      firebase.firestore().doc(PATHS.premios + r.user.uid)
        .set({ conquistados: obj, updatedAt: new Date().toISOString() }, { merge: true })
        .then(function () {
          r.conq = r.conq || {};
          Object.keys(obj).forEach(function (id) { r.conq[id] = obj[id]; });
        }).catch(function () {});
    } catch (e) {}
  }

  /* ---- Nuvem (Firestore): lê o progresso da mesma conta dos Diários ---- */
  var PATHS = { inf: "progress/", lei: "progress-leis/", sum: "progress-sumulas/", premios: "progress-premios/" };

  function loadRemote() {
    return new Promise(function (resolve) {
      if (!(window.firebase && window.DIARIO_FIREBASE_CONFIG)) { resolve(null); return; }
      var finished = false, started = false, askedAnon = false;
      function fin(v) { if (!finished) { finished = true; resolve(v); } }
      setTimeout(function () { fin(null); }, 7000);
      try {
        if (!firebase.apps.length) firebase.initializeApp(window.DIARIO_FIREBASE_CONFIG);
        var auth = firebase.auth();
        auth.onAuthStateChanged(function (user) {
          if (!user) {
            // Só cria login anônimo se não houver ninguém logado (não troca
            // uma conta já vinculada por outra).
            if (!askedAnon) { askedAnon = true; auth.signInAnonymously().catch(function () { fin(null); }); }
            return;
          }
          if (started) return;
          started = true;
          var db = firebase.firestore();
          var out = { user: user, maps: {}, errors: {}, seen: null };
          Promise.all(Object.keys(PATHS).map(function (k) {
            return db.doc(PATHS[k] + user.uid).get().then(function (snap) {
              if (!snap.exists) return;
              var d = snap.data() || {};
              if (k === "premios") { if (Array.isArray(d.vistos)) out.seen = d.vistos; if (d.conquistados && typeof d.conquistados === "object") out.conq = d.conquistados; }
              else if (d.map) out.maps[k] = d.map;
            }).catch(function (err) { out.errors[k] = (err && err.code) || "erro"; });
          })).then(function () { fin(out); });
        });
      } catch (e) { fin(null); }
    });
  }

  function pushSeen(ids) {
    var r = state.remote;
    if (!r || !r.user) return;
    try {
      firebase.firestore().doc(PATHS.premios + r.user.uid)
        .set({ vistos: ids, updatedAt: new Date().toISOString() }, { merge: true }).catch(function () {});
    } catch (e) {}
  }

  // "Novos": prêmios conquistados desde a última visita a esta página
  // (união do que este navegador e a sua conta já viram).
  function trackNovos() {
    var localSeen = null;
    try { var raw = localStorage.getItem(SEEN_KEY); localSeen = raw ? JSON.parse(raw) : null; } catch (e) {}
    var remoteSeen = state.remote ? state.remote.seen : null;
    var doneIds = state.data.awards.filter(function (a) { return a.done; }).map(function (a) { return a.id; });
    state.novos = {};
    state.firstVisit = !localSeen && !remoteSeen;
    if (!state.firstVisit) {
      var set = {};
      (localSeen || []).concat(remoteSeen || []).forEach(function (id) { set[id] = true; });
      doneIds.forEach(function (id) { if (!set[id]) state.novos[id] = true; });
    }
    try { localStorage.setItem(SEEN_KEY, JSON.stringify(doneIds)); } catch (e) {}
    pushSeen(doneIds);
  }

  function cardHtml(a) {
    var locked = a.secret && !a.done;
    var pct = Math.round(a.pct * 100);
    var tier = CFG.tiers[a.tier];
    var isNew = state.novos[a.id];
    return '<article class="pz-card tier-' + a.tier + (a.done ? " is-done" : " is-locked") + (isNew ? " is-new" : "") + '">' +
      '<div class="pz-card-icon" aria-hidden="true">' + (locked ? "❓" : a.icon) + "</div>" +
      '<div class="pz-card-body">' +
        "<h3>" + (locked ? "Prêmio secreto" : esc(a.title)) + (isNew ? ' <span class="pz-new">NOVO</span>' : "") + "</h3>" +
        "<p>" + (locked ? "Só aparece quando for conquistado. Dica: fique de olho no calendário." : esc(a.desc)) + "</p>" +
        (locked ? "" :
          '<div class="pz-bar" role="progressbar" aria-valuemin="0" aria-valuemax="' + a.target + '" aria-valuenow="' + a.value + '"><i style="width:' + pct + '%"></i></div>' +
          '<span class="pz-count">' + (a.done ? (a.kept ? "Conquistado \u00b7 guardado" : "Conquistado") : a.value.toLocaleString("pt-BR") + " / " + a.target.toLocaleString("pt-BR")) + "</span>") +
      "</div>" +
      '<span class="pz-tier" title="' + tier.label + " · " + a.pontos + ' pontos">' + tier.medalha + " " + a.pontos + "</span>" +
    "</article>";
  }

  function catStats(catId) {
    var list = state.data.awards.filter(function (a) { return a.cat === catId; });
    return { total: list.length, done: list.filter(function (a) { return a.done; }).length };
  }

  function renderHero() {
    var d = state.data, ctx = d.ctx, av = avatarPref();
    var pat = patenteOf(ctx.score, av.gender);
    var span = pat.next ? pat.next.min - pat.cur.min : 1;
    var into = pat.next ? ctx.score - pat.cur.min : 1;
    var pct = pat.next ? Math.min(100, Math.round(into / span * 100)) : 100;
    var doneCount = d.awards.filter(function (a) { return a.done; }).length;
    var streakLine = (ctx.streakNow ? "🔥 " : "") + ctx.streakNow + " dia" + (ctx.streakNow === 1 ? "" : "s");
    return '<section class="pz-hero">' +
      '<div class="pz-avatar" aria-hidden="true">' + av.emoji + "</div>" +
      '<div class="pz-hero-main">' +
        '<p class="pz-kicker">Sua patente</p>' +
        '<h2>' + pat.cur.icon + " " + esc(pat.name) + "</h2>" +
        '<div class="pz-bar pz-bar-lg"><i style="width:' + pct + '%"></i></div>' +
        '<p class="pz-sub">' + ctx.score.toLocaleString("pt-BR") + " pontos" +
          (pat.next ? " · faltam " + (pat.next.min - ctx.score).toLocaleString("pt-BR") + " para " + pat.next.icon + " " + esc(pat.nextName) : " · patente máxima!") + "</p>" +
      "</div>" +
      '<ul class="pz-stats">' +
        "<li><b>" + doneCount + "</b><span>de " + d.awards.length + " prêmios</span></li>" +
        "<li><b>" + ctx.totalRead.toLocaleString("pt-BR") + "</b><span>leituras</span></li>" +
        "<li><b>" + ctx.streakDays + "</b><span>recorde de dias seguidos</span></li>" +
        "<li><b>" + esc(streakLine) + "</b><span>sequência atual</span></li>" +
      "</ul></section>";
  }

  function renderShelf() {
    var l = state.data.ctx.lag;
    function m(icon, n, label) {
      return '<li><span class="pz-medal" aria-hidden="true">' + icon + "</span><b>" + n.toLocaleString("pt-BR") + "</b><span>" + label + "</span></li>";
    }
    return '<section class="pz-shelf" aria-label="Medalhas de pontualidade"><h2>Medalhas de pontualidade</h2>' +
      '<ul class="pz-medals">' +
        m("🥇", l.ouro, "no dia da publicação") +
        m("🥈", l.prata, "no dia seguinte") +
        m("🥉", l.bronze, "dois dias depois") +
        m("🎖️", l.fita, "em até 6 dias") +
      "</ul></section>";
  }

  function renderWeek() {
    var rec = state.data.ctx.recent;
    var rows;
    if (!rec.length) {
      rows = '<li class="pz-empty">Nenhum informativo novo nos últimos 7 dias. Aproveite para adiantar a leitura de algum antigo.</li>';
    } else {
      rows = rec.map(function (r) {
        var label = r.org.toUpperCase() + " nº " + r.edicao + (r.ano ? "/" + r.ano : "");
        var status;
        if (r.read) status = '<span class="pz-ok">' + (r.medal ? MEDAL_ICON[r.medal] + " lido" : "✅ lido") + "</span>";
        else if (r.medalHoje) status = '<span class="pz-todo">Ler hoje vale ' + MEDAL_ICON[r.medalHoje] + "</span>";
        else status = '<span class="pz-late">já passou dos 6 dias</span>';
        return "<li><span class=\"pz-wk-label\">" + esc(label) + '</span><span class="pz-wk-date">publicado ' + fmtDay(r.pubDn) + "</span>" + status + "</li>";
      }).join("");
    }
    return '<section class="pz-week"><h2>Desafio da semana</h2>' +
      '<p class="pz-hint">Leia os informativos novos no dia em que saem: 🥇 no dia, 🥈 no dia seguinte, 🥉 dois dias depois, 🎖️ até 6 dias.</p>' +
      "<ul>" + rows + "</ul>" +
      '<a class="pz-link" href="/p/diario-dos-informativos.html">Abrir o Diário de Informativos →</a></section>';
  }

  function renderNext() {
    var pool = state.data.awards.filter(function (a) { return !a.done && !a.secret && a.value > 0; })
      .sort(function (a, b) { return b.pct - a.pct; }).slice(0, 4);
    if (!pool.length) {
      pool = state.data.awards.filter(function (a) { return !a.done && !a.secret; }).slice(0, 4);
    }
    return '<section class="pz-next"><h2>Quase lá</h2><div class="pz-grid">' + pool.map(cardHtml).join("") + "</div></section>";
  }

  function renderBest() {
    var done = state.data.awards.filter(function (a) { return a.done; }).sort(function (a, b) {
      return TIER_ORDER.indexOf(b.tier) - TIER_ORDER.indexOf(a.tier) || b.target - a.target;
    }).slice(0, 6);
    if (!done.length) {
      return '<section class="pz-best"><h2>Suas melhores conquistas</h2><p class="pz-empty">Marque sua primeira leitura em um dos Diários e o primeiro prêmio aparece aqui.</p></section>';
    }
    return '<section class="pz-best"><h2>Suas melhores conquistas</h2><div class="pz-grid">' + done.map(cardHtml).join("") + "</div></section>";
  }

  function renderCatTiles() {
    return '<section class="pz-cats"><h2>Categorias</h2><div class="pz-cat-grid">' + CATS.map(function (c) {
      var s = catStats(c.id);
      var pct = s.total ? Math.round(s.done / s.total * 100) : 0;
      return '<button type="button" class="pz-cat-tile" data-tab="' + c.id + '"><span class="pz-cat-icon" aria-hidden="true">' + c.icon + "</span>" +
        "<b>" + c.label + "</b><span>" + s.done + " / " + s.total + "</span>" +
        '<div class="pz-bar"><i style="width:' + pct + '%"></i></div></button>';
    }).join("") + "</div></section>";
  }

  function renderBanner() {
    var n = Object.keys(state.novos).length;
    var done = state.data.awards.filter(function (a) { return a.done; }).length;
    if (state.firstVisit && done) {
      return '<div class="pz-banner">🎉 Você já começa com <b>' + done + "</b> prêmio" + (done > 1 ? "s" : "") + " conquistado" + (done > 1 ? "s" : "") + "!</div>";
    }
    if (n) {
      return '<div class="pz-banner">🎉 Você conquistou <b>' + n + "</b> prêmio" + (n > 1 ? "s" : "") + " novo" + (n > 1 ? "s" : "") + " desde a última visita!</div>";
    }
    return "";
  }

  function renderTabs() {
    var tabs = [{ id: "resumo", label: "Resumo", icon: "✨" }].concat(CATS.map(function (c) {
      return { id: c.id, label: c.label, icon: c.icon };
    })).concat([{ id: "todas", label: "Todas", icon: "🗂️" }]);
    return '<nav class="pz-tabs" aria-label="Categorias de prêmios">' + tabs.map(function (t) {
      return '<button type="button" class="pz-tab' + (state.tab === t.id ? " active" : "") + '" data-tab="' + t.id + '" aria-pressed="' + (state.tab === t.id) + '">' +
        t.icon + " " + t.label + "</button>";
    }).join("") + "</nav>";
  }

  function renderFilters() {
    var f = [["todos", "Todos"], ["conquistados", "Conquistados"], ["andamento", "Em andamento"], ["aconquistar", "A conquistar"]];
    return '<div class="pz-filters" role="group" aria-label="Filtro">' + f.map(function (x) {
      return '<button type="button" class="pz-filter' + (state.filter === x[0] ? " active" : "") + '" data-filter="' + x[0] + '" aria-pressed="' + (state.filter === x[0]) + '">' + x[1] + "</button>";
    }).join("") + "</div>";
  }

  function passes(a) {
    if (state.filter === "conquistados") return a.done;
    if (state.filter === "andamento") return !a.done && a.value > 0;
    if (state.filter === "aconquistar") return !a.done && a.value === 0;
    return true;
  }

  function renderList() {
    var cats = state.tab === "todas" ? CATS : CATS.filter(function (c) { return c.id === state.tab; });
    var html = renderFilters();
    var any = false;
    cats.forEach(function (c) {
      var list = state.data.awards.filter(function (a) { return a.cat === c.id && passes(a); });
      if (!list.length) return;
      any = true;
      var s = catStats(c.id);
      html += '<section class="pz-section"><h2>' + c.icon + " " + c.label + '<span class="pz-section-count">' + s.done + " / " + s.total + "</span></h2>" +
        '<div class="pz-grid">' + list.map(cardHtml).join("") + "</div></section>";
    });
    if (!any) html += '<p class="pz-empty">Nenhum prêmio neste filtro por enquanto.</p>';
    return html;
  }

  function syncNote() {
    var r = state.remote;
    if (state.sync === "loading") return "☁️ Sincronizando com a sua conta…";
    if (!r) {
      return "Mostrando as leituras guardadas neste navegador. Para ver as leituras de outros aparelhos, abra um dos Diários e vincule seu e-mail.";
    }
    var msg = "☁️ Prêmios calculados com as leituras da sua conta.";
    if (r.user && r.user.isAnonymous) {
      msg += " Atenção: sua conta ainda não tem e-mail vinculado, então outros aparelhos não enxergam este progresso. Vincule o e-mail em um dos Diários.";
    }
    var falhas = [];
    if (r.errors.inf) falhas.push("Informativos");
    if (r.errors.lei) falhas.push("Leis");
    if (r.errors.sum) falhas.push("Súmulas");
    if (falhas.length) {
      msg += " Não foi possível ler da nuvem: " + falhas.join(", ") + " (usando o que está neste navegador).";
    } else if (!r.maps.sum && (state.data.ctx.read.sum > 0)) {
      msg += " Súmulas: usando as leituras deste navegador.";
    }
    return msg;
  }

  function render() {
    var html = renderBanner() + renderTabs();
    if (state.tab === "resumo") {
      html += renderHero() + renderShelf() + renderWeek() + renderNext() + renderBest() + renderCatTiles();
    } else {
      html += renderList();
    }
    html += '<p class="pz-foot">' + syncNote() + "</p>";
    root.innerHTML = html;
  }

  root.addEventListener("click", function (e) {
    var t = e.target.closest("[data-tab],[data-filter]");
    if (!t) return;
    if (t.dataset.tab) { state.tab = t.dataset.tab; state.filter = "todos"; render(); window.scrollTo({ top: 0 }); }
    else if (t.dataset.filter) { state.filter = t.dataset.filter; render(); }
  });

  // 1) pinta na hora com o que este navegador já tem;
  // 2) quando a nuvem responde, recalcula e mostra os prêmios novos.
  refresh();
  render();
  loadRemote().then(function (remote) {
    state.remote = remote;
    state.sync = "done";
    refresh();
    trackNovos();
    render();
  });
})();

/* Login com Google (conta-google.js, mesma pasta deste script) */
(function () {
  var all0 = document.getElementsByTagName("script"), src = "";
  for (var i = 0; i < all0.length; i++) {
    if (/premios-logic\.js/.test(all0[i].src)) { src = all0[i].src; break; }
  }
  if (!src) return;
  function go() {
    if (window.ContaGoogle || document.getElementById("conta-google-js")) return;
    if (!(window.firebase && window.DIARIO_FIREBASE_CONFIG)) return;
    var s = document.createElement("script");
    s.id = "conta-google-js";
    s.src = src.replace(/premios-logic\.js/, "conta-google.js");
    document.head.appendChild(s);
  }
  if (document.readyState === "complete") go(); else window.addEventListener("load", go);
})();
