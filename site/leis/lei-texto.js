/* =====================================================================
   lei-texto.js — texto de uma lei em parágrafos, e "fatias" por artigo
   Usado pelo card de leitura do Meu Cronograma (cronograma-logic.js).
   A limpeza do texto (redações antigas, "1 o" → "1º", títulos de seção) é a
   mesma de leis-logic.js (Diário de Leis): se mudar lá, mude aqui.
   window.EstudaManaLeiTexto = { carregar(id), paragrafos(json), html(p), fatiar(ps, de, ate) }
   ===================================================================== */
(function () {
  "use strict";
  var TEXTO_BASE = "https://barbarasinfronio-lgtm.github.io/diario-informativos/leis/texto/";
  var cache = {};
  function escapeHtml(t) {
    return String(t == null ? "" : t).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function carregar(id) {
    if (!cache[id]) cache[id] = fetch(TEXTO_BASE + encodeURIComponent(id) + ".json")
      .then(function (r) { if (!r.ok) throw new Error("http " + r.status); return r.json(); })
      .then(function (j) { return { ps: paragrafosDaLei(j.p || []), em: j.em || "" }; });
    return cache[id];
  }

  var RX_DIVISAO = /^(PARTE|LIVRO|T[ÍI]TULO|CAP[ÍI]TULO|SE[ÇC][ÃA]O|SUBSE[ÇC][ÃA]O)\s+((?:[IVXLCDM]+|[ÚU]NIC[OA]|\d+)(?:-[A-Z])?)\s*(?:[-–—:]\s*)?(.*)$/i;
  function divisaoDaLei(t) {
    var m = RX_DIVISAO.exec(t);
    if (!m || t.length >= 160) return null;
    var nome = m[3].trim();
    if (nome && (!/^[A-ZÀ-Ý]/.test(nome) || /\.$/.test(nome))) return null;
    return { numero: m[1] + " " + m[2], nome: nome };
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

  // Duas regras de português na exibição: (1) depois de ":" o que vem em seguida (a pena, o desdobramento) vai
  // para outro parágrafo; (2) título de Seção/Capítulo/Título que ficou grudado no fim do artigo anterior
  // ("... dias-multa. Seção II Das Sanções Administrativas") vira parágrafo próprio, centralizado.
  function separarPartes(ps) {
    var out = [];
    ps.forEach(function (t) {
      t = t.replace(/([.;:)!?”"])\s+((?:PARTE|LIVRO|T[ÍI]TULO|CAP[ÍI]TULO|SE[ÇC][ÃA]O|SUBSE[ÇC][ÃA]O)\s+(?:[IVXLCDM]+|[ÚU]NIC[OA])\b)/gi, "$1\n$2");
      t.split("\n").forEach(function (parte) {
        if (divisaoDaLei(parte)) { out.push(parte); return; }
        // ":" seguido de maiúscula, "Pena" ou marcador (§, inciso, alínea); não separa horas ("10:30") nem dentro de parênteses
        var pedacos = parte.replace(/([^\d\s(][^()]*?):\s+(?=(?:Pena\b|[A-ZÀ-Ý§]|[IVXLCDM]+\s*[-–—]|[a-z]\)))/g, function (m, antes) {
          return antes + ":\n";
        }).split("\n");
        pedacos.forEach(function (x) { x = x.trim(); if (x) out.push(x); });
      });
    });
    return out;
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
      t = t.replace(/^(Art\.?\s*\d{1,3}(?:-[A-Z]+)?|§\s*\d{1,3})\s+[o°]\s+(?=\S)/, "$1º ");
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
    return tirarRedacoesAntigas(separarPartes(out));
  }

  // HTML de um parágrafo (cores herdadas do tema; classes em cronograma-styles.css)
  function html(t) {
    var div = divisaoDaLei(t);
    if (div) return '<p class="cr-lei-div">' + escapeHtml(div.numero) + (div.nome ? "<br>" + escapeHtml(div.nome) : "") + "</p>";
    var art = t.match(/^Art\.?\s*\d+[º°ª]?(?:-[A-Z]+)?\.?/);
    if (art) return '<p class="cr-lei-art"><strong>' + escapeHtml(art[0]) + "</strong>" + escapeHtml(t.slice(art[0].length)) + "</p>";
    return "<p>" + escapeHtml(t) + "</p>";
  }

  // Número do artigo que abre o parágrafo ("1º", "5-A") ou ""
  function numArt(t) {
    var m = String(t).match(/^Art\.?\s*(\d[\d.]*[º°ª]?(?:-[A-Z]+)?)/);
    return m ? m[1].replace(/\.$/, "") : "";
  }

  // Fatia [de, ate) (frações 0..1 das palavras da lei) cortando sempre no começo de um artigo:
  // o corte de cada fração cai no artigo mais próximo, então o fim de um dia é o começo do seguinte
  // (sem lacuna e sem repetição). Devolve { ps, de, ate, primeiro, ultimo, inteira }.
  function fatiar(ps, de, ate) {
    var acum = [], total = 0, i;
    for (i = 0; i < ps.length; i++) { acum.push(total); total += String(ps[i]).split(/\s+/).length; }
    var pontos = [];
    for (i = 0; i < ps.length; i++) if (numArt(ps[i])) pontos.push(i);
    if (pontos.length < 2) { pontos = []; for (i = 0; i < ps.length; i++) pontos.push(i); }   // lei sem artigos: corta em parágrafos
    function corte(f) {
      if (f <= 0.0001) return 0;
      if (f >= 0.9999) return ps.length;
      var alvo = f * total, melhor = pontos[0], d = Infinity;
      pontos.forEach(function (p) { var x = Math.abs(acum[p] - alvo); if (x <= d) { d = x; melhor = p; } });
      return melhor;
    }
    var a = corte(de), b = corte(ate);
    if (b <= a) {                                   // artigo gigante: mostra ao menos o artigo
      b = ps.length;
      for (i = 0; i < pontos.length; i++) if (pontos[i] > a) { b = pontos[i]; break; }
    }
    var fatia = ps.slice(a, b), arts = fatia.map(numArt).filter(Boolean);
    return { ps: fatia, de: a, ate: b, primeiro: arts[0] || "", ultimo: arts[arts.length - 1] || "", inteira: a === 0 && b >= ps.length };
  }

  window.EstudaManaLeiTexto = { carregar: carregar, paragrafos: paragrafosDaLei, html: html, fatiar: fatiar, escapeHtml: escapeHtml };
})();
