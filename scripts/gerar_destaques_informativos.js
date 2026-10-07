// gerar_destaques_informativos.js — os julgados de cada edição de informativo que mais valem a revisão
// (leve/destaques-informativos.json). As Revisões (Meus Estudos) usam este arquivo para indicar
// só as decisões que importam em vez de mandar revisar o informativo inteiro.
//
//   { "STF:972": [["<id do julgado>", "ADI 6.196", <vezes cobrado em prova>, "começo da tese"], …], … }
//
// Quem entra (até 3 por edição, na ordem):
//   1) julgados já cobrados em prova (provas/cobrancas.json, "dec:inf-<id>");
//   2) julgados com "cara de prova": parecidos com os já cobrados. A nota soma (a) as palavras do
//      julgado que mais aparecem nos cobrados (classificador simples, ~75% de acerto em teste cruzado
//      de cobrado × não cobrado) e (b) o quanto a área do direito costuma cair (ex.: processo penal).
//      Só entram os 15% melhores de todos os informativos; o resto não é indicado.
//
// Uso: node scripts/gerar_destaques_informativos.js   (roda no GitHub junto com gerar_leves.js)
const fs = require("fs");
const path = require("path");
const RAIZ = path.join(__dirname, "..");
const ler = (f) => fs.readFileSync(path.join(RAIZ, f), "utf8");

const idx = JSON.parse(ler("informativos/indice.json")).itens || [];   // [id, orgao, informativo, area, titulo, tese, processo, data, parte]
const cobr = JSON.parse(ler("provas/cobrancas.json")).itens || {};
const nProvas = (id) => {
  const v = cobr["dec:inf-" + id];
  return Array.isArray(v) ? new Set(v.map((x) => x[0])).size : 0;      // provas diferentes (como em gerar_leves.js)
};

const norm = (t) => String(t || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
const PARADA = new Set(("para como que dos das pelo pela entre sobre quando onde mesmo tribunal turma plenario relator recurso decisao processo caso acordao " +
  "julgamento ministro voto supremo superior justica federal especial extraordinario habeas corpus vista pedido").split(" "));
const tokens = (x) => new Set((norm(x[4] + " " + String(x[5] || "").slice(0, 350)).match(/[a-z]{5,}/g) || []).filter((w) => !PARADA.has(w)));

const docs = idx.map(tokens);
const cobrado = idx.map((x) => nProvas(x[0]));
const N = idx.length;
let npos = 0;
const dfa = new Map(), dfp = new Map();
idx.forEach((x, i) => {
  const pos = cobrado[i] > 0;
  if (pos) npos++;
  for (const w of docs[i]) {
    dfa.set(w, (dfa.get(w) || 0) + 1);
    if (pos) dfp.set(w, (dfp.get(w) || 0) + 1);
  }
});
const peso = (w) => Math.log(((dfp.get(w) || 0) + 0.5) / (npos + 1)) - Math.log(((dfa.get(w) || 0) + 0.5) / (N + 1));
const areaTot = new Map(), areaPos = new Map();
idx.forEach((x, i) => { areaTot.set(x[3], (areaTot.get(x[3]) || 0) + 1); if (cobrado[i] > 0) areaPos.set(x[3], (areaPos.get(x[3]) || 0) + 1); });
const base = npos / N;
const areaLog = (a) => Math.log((((areaPos.get(a) || 0) + 1) / ((areaTot.get(a) || 0) + 20)) / base);

const nota = idx.map((x, i) => {
  const ws = [...docs[i]].filter((w) => (dfa.get(w) || 0) >= 5).map(peso).sort((a, b) => b - a).slice(0, 6);
  const t = norm(x[5]);
  const extra = (/\btema\b|repercuss|repetitiv|\btese\b/.test(t) ? 1 : 0) + (/plenario|corte especial|secao/.test(t) ? 0.5 : 0);
  return ws.reduce((a, b) => a + b, 0) + 3 * areaLog(x[3]) + extra;
});
const naoCobradas = nota.filter((_, i) => cobrado[i] === 0).sort((a, b) => a - b);
const corte = naoCobradas[Math.floor(naoCobradas.length * 0.85)];

const porEd = new Map();
idx.forEach((x, i) => {
  const k = x[1] + ":" + x[2];
  if (!porEd.has(k)) porEd.set(k, []);
  porEd.get(k).push(i);
});
const saida = {};
for (const [k, lista] of porEd) {
  const cobrados = lista.filter((i) => cobrado[i] > 0).sort((a, b) => cobrado[b] - cobrado[a]);
  const outros = lista.filter((i) => cobrado[i] === 0 && nota[i] >= corte).sort((a, b) => nota[b] - nota[a]);
  const escolhidos = cobrados.concat(outros).slice(0, 3);
  if (!escolhidos.length) continue;
  saida[k] = escolhidos.map((i) => {
    const x = idx[i];
    return [x[0], String(x[6] || x[4] || "").replace(/,\s*rel\..*$/i, "").slice(0, 60), cobrado[i], String(x[5] || "").replace(/\s+/g, " ").slice(0, 90)];
  });
}
fs.writeFileSync(path.join(RAIZ, "leve/destaques-informativos.json"), JSON.stringify(saida));
const kb = Math.round(fs.statSync(path.join(RAIZ, "leve/destaques-informativos.json")).size / 1024);
console.log(`leve/destaques-informativos.json: ${Object.keys(saida).length} de ${porEd.size} edições com destaque, ${kb} KB (cobrados: ${npos}, corte de nota: ${corte.toFixed(2)})`);
