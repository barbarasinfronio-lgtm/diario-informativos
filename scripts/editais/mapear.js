// jsc mapear.js -- <repo> <entrada.json>   (entrada: {secoes:[{nome, materia, texto}]})
var window = this; var localStorage = { getItem: function () { return null; } };
var REPO = arguments[0], ENT = JSON.parse(readFile(arguments[1]));
load(REPO + '/site/leis/leis-data.js'); window.LEIS_DATA = LEIS_DATA;
load(REPO + '/site/leis/normas-citadas.js');
var idx = {};
Object.keys(LEIS_DATA).forEach(function (m) {
  LEIS_DATA[m].leis.forEach(function (l) {
    // lei estadual/distrital: "Lei Complementar (DF) nº 840/2011" -> só vale para editais dessa UF
    var uf = /\(([A-Z]{2})\)/.exec(l.numero);
    if (uf && uf[1] !== ENT.uf) return;
    var limpo = l.numero.replace(/\s*\([A-Z]{2}\)/, '').replace(/\s+(Estadual|Distrital)\b/i, '');
    var a = NormasCitadas.encontrar(limpo).filter(function (n) { return n.classe === 'lei'; });
    var id = a.length ? a[0].id : 'num|' + l.numero;
    (idx[id] = idx[id] || []).push({ m: m, numero: l.numero, nome: l.nome });
  });
});
var leis = [], vistos = {}, extras = [], vistosX = {}, tse = [];
// leis locais da UF do edital já no Diário: "Lei Complementar (DF) nº 840/2011"
var locais = {};
Object.keys(LEIS_DATA).forEach(function (m) {
  LEIS_DATA[m].leis.forEach(function (l) { if (ENT.uf && l.numero.indexOf('(' + ENT.uf + ')') > 0 && !locais[l.numero]) locais[l.numero] = m; });
});
function comPontos(n) { return String(+n).replace(/\B(?=(\d{3})+(?!\d))/g, '.'); }
ENT.secoes.forEach(function (s) {
  var t = s.texto.replace(/\s+/g, ' ');
  // "Lei nº 11.343, de 23 de agosto de 2006" -> "Lei nº 11.343/2006"
  t = t.replace(/\b(Lei Complementar|Lei|Decreto[- ][Ll]ei|Decreto)\s*(?:Federal\s*)?(?:n[ºo°.]*\s*)?(\d{1,3}(?:\.\d{3})*),?\s*de\s+\d{1,2}[ºo°]?\s+de\s+[a-zçãéêô]+\s+de\s+(\d)\.?(\d{3})\b/gi,
    function (_, tp, n, a, b) { return tp + ' nº ' + n + '/' + a + b; });
  // "Lei Distrital nº 4.567/2011", "Lei Complementar Estadual nº 58/2006", "Decreto Distrital nº ..."
  t = t.replace(/\b(Lei Complementar|Lei|Decreto)\s+(Distrital|Estadual)\s*(?:n[ºo°.]*\s*)?(\d{1,3}(?:\.?\d{3})*)\s*\/\s*(\d{4}|\d{2})\b/gi, function (_, tipo, esfera, num, ano) {
    ano = ano.length === 2 ? (+ano > 30 ? '19' : '20') + ano : ano;
    tipo = tipo.charAt(0).toUpperCase() + tipo.slice(1).toLowerCase().replace('complementar', 'Complementar');
    var n = comPontos(num.replace(/\./g, ''));
    var chave = tipo + ' (' + (ENT.uf || '??') + ') nº ' + n + '/' + ano;
    if (locais[chave]) { if (!vistos[chave]) { vistos[chave] = true; leis.push([locais[chave], chave]); } }
    else if (!vistosX[chave]) { vistosX[chave] = true; extras.push(tipo + ' ' + esfera.toLowerCase().replace(/^./, function (c) { return c.toUpperCase(); }) + ' nº ' + n + '/' + ano); }
    return ' ';
  });
  (ENT.nomesLocais || []).forEach(function (nm) {
    if (new RegExp(nm[0], 'i').test(t) && !vistosX[nm[1]]) { vistosX[nm[1]] = true; extras.push(nm[1]); }
  });
  NormasCitadas.encontrar(t).forEach(function (n) {
    if (n.classe === 'lei') {
      var c = idx[n.id];
      if (c) {
        if (vistos[n.id]) return; vistos[n.id] = true;
        // federal primeiro; depois a da UF do edital; dentro disso, a matéria da seção
        var fed = c.filter(function (x) { return !/\([A-Z]{2}\)/.test(x.numero); });
        var cand = fed.length ? fed : c;
        var pref = cand.filter(function (x) { return x.m === s.materia; })[0] || cand[0];
        leis.push([pref.m, pref.numero]);
      } else if (!vistosX[n.id]) { vistosX[n.id] = true; extras.push(n.rotulo.replace(/^[A-Z]{2,5} — /, '')); }
    } else if (!vistosX[n.id]) { vistosX[n.id] = true; extras.push(n.rotulo); }
  });
  var re = /Resolu[çc][ãa]o(?:\s+do)?\s+(?:TSE|Tribunal Superior Eleitoral)[^.;]{0,40}?n[ºo°.]*\s*[\d.]+\/\d{2,4}|Res\.?-TSE\s*n[ºo°.]*\s*[\d.]+\/\d{2,4}/gi, m;
  while ((m = re.exec(t))) tse.push(m[0]);
});
print(JSON.stringify({ leis: leis, extras: extras, tse: tse }));
