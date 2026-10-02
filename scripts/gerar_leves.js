// gerar_leves.js — versões leves dos dados do Diário das Decisões, para as
// páginas abrirem rápido (o texto completo só é baixado quando precisa).
//
// Lê os arquivos de sempre (que continuam sendo atualizados do mesmo jeito):
//   rg-repetitivos-data.js · stj/teses.json · stf/extras.json · tst/decisoes.json
// e grava, na pasta leve/:
//   - decisoes.json : um item por decisão só com o que a LISTA precisa (órgão,
//     matéria, risco, título, data…) e o começo do texto do card ("_resumo");
//     "_f" diz de qual arquivo completo ele veio (rg, teses, extras, tst).
//   - citacoes.json : quantas decisões citam cada lei (usado nas Revisões do
//     Meu Progresso), calculado com o mesmo normas-citadas.js das páginas.
//
// Uso: node scripts/gerar_leves.js   (roda sozinho no GitHub — ver
// .github/workflows/gerar-leves.yml)
const fs = require("fs");
const path = require("path");
const RAIZ = path.join(__dirname, "..");
const ler = (f) => fs.readFileSync(path.join(RAIZ, f), "utf8");

global.window = global;
eval(ler("rg-repetitivos-data.js"));
eval(ler("normas-citadas.js"));

const fontes = {
  rg: RG_REPETITIVOS_DATA,
  teses: JSON.parse(ler("stj/teses.json")).itens || [],
  extras: JSON.parse(ler("stf/extras.json")).itens || [],
  tst: JSON.parse(ler("tst/decisoes.json")).itens || []
};

// campos que a lista, os filtros, a contagem e os selos do card usam
const CAMPOS = ["id", "orgao", "tipo", "tipoNome", "grupo", "area", "tema", "data", "status", "risco",
  "titulo", "processo", "relator", "precedenteLabel", "info", "suspensao", "tambem", "_resumo", "_f"];
// campos com poucos valores diferentes: gravados como número de uma tabela
const TABELADOS = new Set(["orgao", "tipo", "tipoNome", "grupo", "area", "status", "risco", "precedenteLabel", "relator", "_f"]);
const TAM_RESUMO = 150; // o card mostra só o começo do texto

function resumo(d) {
  const t = String((d.tipo === "informativo" ? d.tese : (d.destaque || d.tese || d.questao)) || "").replace(/\s+/g, " ").trim();
  return t.length > TAM_RESUMO ? t.slice(0, TAM_RESUMO).replace(/\s+\S*$/, "") + "…" : t;
}

// formato compacto: { campos: [...], tabelas: {campo: [valores]}, linhas: [[...], ...] }
// (a página remonta os objetos — ver lerLeve() em rg-repetitivos-logic.js e revisoes.js)
const tabelas = {}, indices = {};
for (const k of TABELADOS) { tabelas[k] = []; indices[k] = new Map(); }
function valor(k, v) {
  if (v === undefined || v === null || v === "" || (Array.isArray(v) && !v.length)) return 0;
  if (!TABELADOS.has(k)) return v;
  if (!indices[k].has(v)) { tabelas[k].push(v); indices[k].set(v, tabelas[k].length); }
  return indices[k].get(v);   // 1, 2, 3… (0 = vazio)
}

const linhas = [], vistos = new Set();
for (const [f, lista] of Object.entries(fontes)) {
  for (const d of lista) {
    const id = String(d.id);
    if (vistos.has(f + ":" + id)) continue;
    vistos.add(f + ":" + id);
    const x = Object.assign({}, d, { _resumo: resumo(d), _f: f });
    const linha = CAMPOS.map((k) => valor(k, x[k]));
    while (linha.length && linha[linha.length - 1] === 0) linha.pop();
    linhas.push(linha);
  }
}
const itens = linhas;

// citações de leis (mesmo cálculo que revisoes.js fazia no navegador: decisões
// de Repercussão Geral/Repetitivos e do TST)
const citacoes = {};
for (const d of fontes.rg.concat(fontes.tst)) {
  NormasCitadas.encontrar([d.titulo, d.tese, d.questao, d.destaque].join(" "), { data: d.data })
    .forEach((n) => { if (n.classe === "lei") citacoes[n.id] = (citacoes[n.id] || 0) + 1; });
}

const contagem = {};
for (const [f, lista] of Object.entries(fontes)) contagem[f] = lista.length;
// listas baixadas só sob demanda (acórdãos, julgados de informativos): o total
// vai junto, para o painel de números não mudar enquanto a página carrega
const sobDemanda = {};
for (const [g, f] of [["ACORDAOS", "stj/acordaos/indice.json"], ["INFORMATIVOS", "informativos/indice.json"]]) {
  try { sobDemanda[g] = (JSON.parse(ler(f)).itens || []).length; } catch (e) { /* sem o arquivo: a página conta ao baixar */ }
}

fs.mkdirSync(path.join(RAIZ, "leve"), { recursive: true });
fs.writeFileSync(path.join(RAIZ, "leve/decisoes.json"), JSON.stringify({ fontes: contagem, sobDemanda, campos: CAMPOS, tabelas, linhas }));
fs.writeFileSync(path.join(RAIZ, "leve/citacoes.json"), JSON.stringify({ citacoes }));

const kb = (f) => Math.round(fs.statSync(path.join(RAIZ, f)).size / 1024) + " KB";
console.log("leve/decisoes.json:", itens.length, "itens,", kb("leve/decisoes.json"), contagem, sobDemanda);
console.log("leve/citacoes.json:", Object.keys(citacoes).length, "leis,", kb("leve/citacoes.json"));
