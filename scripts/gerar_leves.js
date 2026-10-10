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
//   - cobrancas.json : em quantas provas de concurso cada súmula/decisão já foi
//     cobrada e, por edição de informativo, quantos julgados já caíram (de
//     provas/cobrancas.json). As Revisões usam isso para priorizar o que mais cai.
//
// Uso: node scripts/gerar_leves.js   (roda sozinho no GitHub — ver
// .github/workflows/gerar-leves.yml)
const fs = require("fs");
const path = require("path");
const RAIZ = path.join(__dirname, "..");
const ler = (f) => fs.readFileSync(path.join(RAIZ, f), "utf8");

global.window = global;
eval(ler("site/decisoes/rg-repetitivos-data.js"));
eval(ler("site/leis/normas-citadas.js"));

const fontes = {
  rg: RG_REPETITIVOS_DATA,
  teses: JSON.parse(ler("stj/teses.json")).itens || [],
  extras: JSON.parse(ler("stf/extras.json")).itens || [],
  tst: JSON.parse(ler("tst/decisoes.json")).itens || []
};

// campos que a lista, os filtros, a contagem e os selos do card usam
const CAMPOS = ["id", "orgao", "tipo", "tipoNome", "grupo", "area", "tema", "data", "status", "risco",
  "titulo", "processo", "relator", "precedenteLabel", "info", "suspensao", "tambem", "idsJuntados", "_resumo", "_f"];
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
for (const [g, f] of [["ACORDAOS", "stj/acordaos/indice.json"], ["ACORDAOS_STF", "stf/acordaos/indice.json"], ["INFORMATIVOS", "informativos/indice.json"]]) {
  try { const j = JSON.parse(ler(f)); sobDemanda[g] = j.arquivos ? j.total : (j.itens || []).length; } catch (e) { /* sem o arquivo: a página conta ao baixar */ }
}

// cobrança em provas (provas/cobrancas.json): nº de provas por item e, por edição de informativo, nº de julgados cobrados
const cobrancas = { itens: {}, inf: {}, rotulos: {} };
try {
  const cob = JSON.parse(ler("provas/cobrancas.json"));
  // nome das decisões que já não estão na lista (ex.: removidas como repetidas) mas continuam lidas/revisadas
  for (const [k, v] of Object.entries(cob.cards || {})) if (k.startsWith("dec:") && !k.startsWith("dec:inf-") && v.rotulo) cobrancas.rotulos[k] = v.rotulo + (v.fonte ? " — " + v.fonte : "");
  const nProvas = {};
  for (const [k, v] of Object.entries(cob.itens || {})) nProvas[k] = new Set(v.map((x) => x[0])).size;
  for (const [k, n] of Object.entries(nProvas)) if (!k.startsWith("dec:inf-")) cobrancas.itens[k] = n;
  const idx = JSON.parse(ler("informativos/indice.json")).itens || [];
  for (const x of idx) {
    const n = nProvas["dec:inf-" + x[0]];
    if (!n) continue;
    const ano = String(x[7] || "").slice(-4);
    const chave = String(x[1]).toLowerCase() + ":" + ano + ":" + x[2];
    const e = cobrancas.inf[chave] || (cobrancas.inf[chave] = [0, 0]);
    e[0] += 1; e[1] += n;       // julgados cobrados · total de cobranças
  }
} catch (e) { /* sem o arquivo: as Revisões seguem só pelo tempo */ }

fs.mkdirSync(path.join(RAIZ, "leve"), { recursive: true });
fs.writeFileSync(path.join(RAIZ, "leve/cobrancas.json"), JSON.stringify(cobrancas));
fs.writeFileSync(path.join(RAIZ, "leve/decisoes.json"), JSON.stringify({ fontes: contagem, sobDemanda, campos: CAMPOS, tabelas, linhas }));
fs.writeFileSync(path.join(RAIZ, "leve/citacoes.json"), JSON.stringify({ citacoes }));

const kb = (f) => Math.round(fs.statSync(path.join(RAIZ, f)).size / 1024) + " KB";
console.log("leve/decisoes.json:", itens.length, "itens,", kb("leve/decisoes.json"), contagem, sobDemanda);
console.log("leve/citacoes.json:", Object.keys(citacoes).length, "leis,", kb("leve/citacoes.json"));
