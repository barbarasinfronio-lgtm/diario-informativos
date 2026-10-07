// gerar_relacionados.js — "Leia também": para cada lei com texto no site, as decisões, súmulas e
// resoluções que se relacionam com ela. Grava leve/relacionados.json:
//   { itens: { "<chave>": [tipo, título, endereço] }, leis: { "<id do texto>": ["<chave>", …] } }
// Relação = (1) o texto do item cita a lei pelo número/nome (normas-citadas.js) ou (2) o assunto bate:
// palavras distintivas do nome da lei (ex.: "idoso", "consumidor") aparecem no texto do item,
// ponderadas pela raridade da palavra (TF-IDF simples). Citar a lei pesa mais que o assunto.
//
// Uso: node scripts/gerar_relacionados.js   (roda no GitHub junto com gerar_leves.js)
const fs = require("fs");
const path = require("path");
const RAIZ = path.join(__dirname, "..");
const ler = (f) => fs.readFileSync(path.join(RAIZ, f), "utf8");
global.window = global;
eval(ler("site/leis/normas-citadas.js"));
eval(ler("site/leis/leis-data.js"));
eval(ler("site/sumulas/sumulas-data.js"));
eval(ler("site/leis/normas-data.js"));
eval(ler("site/decisoes/rg-repetitivos-data.js"));

const norm = (t) => String(t || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
const slug = (t) => norm(t).replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
const PARADA = new Set(("lei leis codigo estatuto federal nacional normas sobre dispoe institui regime juridico sistema politica publica publico " +
  "geral gerais disposicoes decreto complementar constituicao republica federativa brasil brasileiro brasileira estado estados municipios " +
  "para como que seus suas dos das pelo pela pelos pelas entre ordem outras outros outro providencias").split(/\s+/));
function radical(p) {          // idoso/idosa/idosos → "idos"; consumidores → "consumidor"
  let s = p.replace(/s$/, "");
  s = s.replace(/[aeiou]$/, "");
  return s.length > 8 ? s.slice(0, 8) : s;
}
function radicais(texto) {
  const set = new Set();
  for (const p of norm(texto).split(/[^a-z0-9]+/)) if (p.length >= 4 && !PARADA.has(p) && !/^\d+$/.test(p)) set.add(radical(p));
  return set;
}

// ---- corpus ----------------------------------------------------------------------------------
const corpus = [];   // { chave, tipo, titulo, href, texto, rad:Set, cita:Set, data }
function add(c) {
  c.rad = radicais(c.texto);
  c.cita = new Set();
  try { for (const n of NormasCitadas.encontrar(c.texto, { data: c.data })) if (n.classe === "lei") c.cita.add(n.id); } catch (e) { /* ignora */ }
  corpus.push(c);
}
const fontes = {
  rg: RG_REPETITIVOS_DATA,
  teses: JSON.parse(ler("stj/teses.json")).itens || [],
  extras: JSON.parse(ler("stf/extras.json")).itens || [],
  tst: JSON.parse(ler("tst/decisoes.json")).itens || []
};
for (const lista of Object.values(fontes)) {
  for (const d of lista) {
    const texto = [d.titulo, d.tese, d.questao, d.destaque, d.area].join(" ");
    const rot = [d.orgao, d.precedenteLabel || "Tema", d.tema].filter(Boolean).join(" ");
    add({ chave: "dec:" + d.id, tipo: "Decisão", titulo: (rot + " — " + (d.titulo || "")).replace(/\s+/g, " ").trim().slice(0, 120),
      href: "/p/diario-das-decisoes.html#abrir=" + encodeURIComponent(d.id) + "&busca=" + encodeURIComponent(d.processo || d.titulo || ""), texto, data: d.data });
  }
}
for (const [org, b] of Object.entries(SUMULAS_DATA)) {
  if (!b || !b.sumulas) continue;
  for (const s of b.sumulas) {
    if (/\[S[ÚU]MULA CANCELADA\]/i.test(s.texto || "")) continue;      // cancelada: não indica
    add({ chave: "sum:" + org + ":" + s.numero, tipo: "Súmula",
      titulo: ("Súmula " + s.numero + " — " + (b.label || org.toUpperCase()) + ": " + String(s.texto || "")).replace(/\s+/g, " ").slice(0, 130),
      href: "/p/diario-das-sumulas.html#cad=" + encodeURIComponent(org + "|" + s.numero), texto: s.texto || "" });
  }
}
for (const [org, b] of Object.entries(NORMAS_DATA)) {
  for (const n of b.normas || []) {
    add({ chave: "norma:" + org + ":" + n.numero, tipo: "Resolução",
      titulo: ((n.tipo || "Resolução") + " " + org.toUpperCase() + " nº " + n.numero + " — " + (n.ementa || "")).replace(/\s+/g, " ").slice(0, 130),
      href: "/p/diario-das-resolucoes.html#norma=" + encodeURIComponent(org + ":" + n.numero), texto: n.ementa || "" });
  }
}
// raridade de cada radical
const df = new Map();
for (const c of corpus) for (const r of c.rad) df.set(r, (df.get(r) || 0) + 1);
const idf = (r) => Math.log(1 + corpus.length / (1 + (df.get(r) || 0)));
const porRad = new Map();      // radical → [índices]
corpus.forEach((c, i) => { for (const r of c.rad) { if (!porRad.has(r)) porRad.set(r, []); porRad.get(r).push(i); } });
const porCita = new Map();     // id da lei → [índices]
corpus.forEach((c, i) => { for (const id of c.cita) { if (!porCita.has(id)) porCita.set(id, []); porCita.get(id).push(i); } });

// ---- leis ------------------------------------------------------------------------------------
function idTexto(link) {      // igual a idTexto() de leis-logic.js
  const m = String(link || "").match(/^https?:\/\/www\.planalto\.gov\.br(\/[^?#]*)/i);
  if (m) return slug(m[1].replace(/^\/ccivil_03\//i, "").replace(/\.html?$/i, ""));
  return "";
}
const indice = JSON.parse(ler("leis/texto/indice.json"));
const leis = new Map();       // id do texto → { nome, normaId }
for (const mat of Object.values(LEIS_DATA)) {
  for (const l of mat.leis || []) {
    const tid = idTexto(l.link);
    if (!tid || !indice[tid] || leis.has(tid)) continue;
    let normaId = "";
    try { const a = NormasCitadas.encontrar(l.numero).filter((n) => n.classe === "lei")[0]; normaId = a ? a.id : ""; } catch (e) { /* ignora */ }
    leis.set(tid, { nome: l.nome, normaId });
  }
}
let citadas = {};
try { citadas = JSON.parse(ler("leis/texto/citadas.json")); } catch (e) { /* sem o arquivo */ }
for (const [k, tid] of Object.entries(citadas)) {
  const m = k.match(/^(lei|lc|dl|decreto)-(\d+)-(\d{4})$/);
  if (!m || leis.has(tid) || !indice[tid]) continue;
  let nome = "";
  try { nome = JSON.parse(ler("leis/texto/" + tid + ".json")).nome || ""; } catch (e) { /* ignora */ }
  leis.set(tid, { nome, normaId: "lei|" + m[1] + "|" + m[2] + "|" + m[3] });
}

const LIMITE = { Decisão: 10, "Súmula": 6, "Resolução": 5 };
const resultado = {};
const usados = new Set();
for (const [tid, l] of leis) {
  const q = [...radicais(l.nome)].filter((r) => idf(r) > 2.2);          // palavras distintivas do nome
  const pontos = new Map();
  if (l.normaId && porCita.has(l.normaId)) {
    for (const i of porCita.get(l.normaId)) pontos.set(i, (pontos.get(i) || 0) + 20);
  }
  if (q.length) {
    const cand = new Map();
    for (const r of q) for (const i of porRad.get(r) || []) cand.set(i, (cand.get(i) || new Set()).add(r));
    for (const [i, rs] of cand) {
      const cobre = rs.size / q.length;
      if (q.length > 1 && cobre < 0.6) continue;
      let s = 0;
      for (const r of rs) s += idf(r);
      pontos.set(i, (pontos.get(i) || 0) + s * cobre);
    }
  }
  const lista = [...pontos.entries()].filter(([i, s]) => s >= (corpus[i].cita.has(l.normaId) ? 3 : 5)).sort((a, b) => b[1] - a[1]);
  const escolhidos = [], cont = {};
  for (const [i] of lista) {
    const c = corpus[i];
    if ((cont[c.tipo] = (cont[c.tipo] || 0) + 1) > LIMITE[c.tipo]) continue;
    escolhidos.push(c.chave); usados.add(i);
  }
  if (escolhidos.length) resultado[tid] = escolhidos;
}
const itens = {};
for (const i of usados) itens[corpus[i].chave] = [corpus[i].tipo, corpus[i].titulo, corpus[i].href];
fs.writeFileSync(path.join(RAIZ, "leve/relacionados.json"), JSON.stringify({ itens, leis: resultado }));
console.log("leve/relacionados.json:", Object.keys(resultado).length, "leis,", Object.keys(itens).length, "itens,", Math.round(fs.statSync(path.join(RAIZ, "leve/relacionados.json")).size / 1024) + " KB");
module.exports = { resultado, itens };
