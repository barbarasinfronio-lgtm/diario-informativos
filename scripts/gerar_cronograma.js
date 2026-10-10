// gerar_cronograma.js — dados leves para a página "Meu Cronograma" (leve/cronograma.json):
//   leis:     { "<matéria>:<número em slug>": [minutos de leitura, vezes citada nas decisões, nome da lei, id do texto] }
//   sumulas:  { "<tribunal>": [[número, vezes cobrada em prova, começo do texto], …] }  (sem as canceladas)
//   decisoes: [[id, vezes cobrada em prova, título], …]                               (só as já cobradas)
//   informativos: [[id, processo, vezes cobrado, "STF 972"], …]   (julgados de informativos já cobrados ou com cara de prova)
// Minutos de leitura = palavras do texto da lei (leis/texto/<id>.json) ÷ 100 por minuto (leitura atenta,
// com grifos); lei sem texto no site conta 20 min.
//
// Uso: node scripts/gerar_cronograma.js   (roda no GitHub junto com gerar_leves.js)
const fs = require("fs");
const path = require("path");
const RAIZ = path.join(__dirname, "..");
const ler = (f) => fs.readFileSync(path.join(RAIZ, f), "utf8");
global.window = global;
eval(ler("site/leis/normas-citadas.js"));
eval(ler("site/leis/leis-data.js"));
eval(ler("site/sumulas/sumulas-data.js"));

const norm = (t) => String(t || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
const slug = (t) => norm(t).replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
function idTexto(link) {      // igual a idTexto() de leis-logic.js
  const l = String(link || "");
  let m = l.match(/^https?:\/\/www\.planalto\.gov\.br(\/[^?#]*)/i);
  if (m) return slug(m[1].replace(/^\/ccivil_03\//i, "").replace(/\.html?$/i, ""));
  m = l.match(/^https?:\/\/(?:www\.)?([^\/?#]+)([^?#]*)(?:\?([^#]*))?/i);
  if (!m) return "";
  let s = slug(m[1] + m[2] + (m[3] ? "?" + m[3] : ""));
  if (s.length > 90) {
    let h = 0x811c9dc5;
    for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 0x01000193) >>> 0;
    s = s.slice(0, 80) + "-" + ("00000000" + h.toString(16)).slice(-8);
  }
  return s;
}

const cob = JSON.parse(ler("leve/cobrancas.json"));
let cit = {};
try { cit = JSON.parse(ler("leve/citacoes.json")).citacoes || {}; } catch (e) { /* sem o arquivo */ }
const indice = JSON.parse(ler("leis/texto/indice.json"));

// ---- leis -------------------------------------------------------------------------------------
const leis = {};
for (const [mat, bloco] of Object.entries(LEIS_DATA)) {
  for (const l of bloco.leis || []) {
    const chave = mat + ":" + slug(l.numero);
    if (leis[chave]) continue;
    const tid = idTexto(l.link);
    let min = 20;
    if (tid && indice[tid]) {
      try {
        const j = JSON.parse(ler("leis/texto/" + tid + ".json"));
        const palavras = (j.p || []).reduce((n, p) => n + String(p).split(/\s+/).length, 0);
        min = Math.max(5, Math.round(palavras / 100));
      } catch (e) { /* fica 20 */ }
    }
    let n = 0;
    try { const a = NormasCitadas.encontrar(l.numero).filter((x) => x.classe === "lei")[0]; if (a) n = cit[a.id] || 0; } catch (e) { /* ignora */ }
    leis[chave] = [min, n, String(l.nome || l.numero).replace(/\s+/g, " ").slice(0, 90), tid && indice[tid] ? tid : ""];   // 4º: id do texto (leis/texto/<id>.json) para o card de leitura
  }
}

// ---- súmulas ----------------------------------------------------------------------------------
const sumulas = {};
for (const [org, b] of Object.entries(SUMULAS_DATA)) {
  const lista = [];
  for (const s of b.sumulas || []) {
    if (/\[S[ÚU]MULA CANCELADA\]/i.test(s.texto || "")) continue;
    lista.push([s.numero, cob.itens["sum:" + org + ":" + s.numero] || 0, String(s.texto || "").replace(/\s+/g, " ").slice(0, 90)]);
  }
  if (lista.length) sumulas[org] = lista;
}

// ---- decisões já cobradas em prova ---------------------------------------------------------------
const decisoes = [];
for (const [k, n] of Object.entries(cob.itens)) {
  if (!k.startsWith("dec:")) continue;
  const rot = String((cob.rotulos || {})[k] || k).replace(/\s+/g, " ").slice(0, 100);
  decisoes.push([k.slice(4), n, rot]);
}
decisoes.sort((a, b) => b[1] - a[1]);

// ---- julgados de informativos que valem o estudo (já cobrados ou com "cara de prova") ----------------
// vem de leve/destaques-informativos.json (scripts/gerar_destaques_informativos.js): [id, processo, cobrado, "STF 972"]
const informativos = [];
try {
  const dest = JSON.parse(ler("leve/destaques-informativos.json"));
  for (const [ed, lista] of Object.entries(dest)) {
    for (const d of lista) informativos.push([d[0], d[1], d[2], ed.replace(":", " ")]);
  }
  informativos.sort((a, b) => b[2] - a[2]);
} catch (e) { /* sem o arquivo: o cronograma segue sem eles */ }

const saida = { leis, sumulas, decisoes, informativos };
fs.writeFileSync(path.join(RAIZ, "leve/cronograma.json"), JSON.stringify(saida));
const kb = Math.round(fs.statSync(path.join(RAIZ, "leve/cronograma.json")).size / 1024);
console.log(`leve/cronograma.json: ${Object.keys(leis).length} leis, ${Object.values(sumulas).reduce((n, a) => n + a.length, 0)} súmulas, ${decisoes.length} decisões, ${informativos.length} julgados de informativos, ${kb} KB`);
