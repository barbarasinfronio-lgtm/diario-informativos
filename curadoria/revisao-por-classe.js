// Triagem automática das fontes que já estão no site (não toca nos dados).
// Usa o mesmo classificador da página de curadoria (curadoria/score.js) e monta
// os registros do mesmo jeito que ela (reclamacoes/curadoria.html):
//   Reclamações e controle concentrado (anos/*.json), "referências" (leve/decisoes.json),
//   acórdãos do STJ (índice + stj/acordaos/c/*.json) e Informativos (índice + informativos/c/*.json).
// Saída: curadoria/triagem-fontes-site-AAAA-MM-DD.json e .md
//
// Uso: node curadoria/triagem-fontes-site.js
"use strict";
const fs = require("fs");
const path = require("path");
const RAIZ = path.join(__dirname, "..");
const { score, norm } = require("./score.js");

const ler = (f) => JSON.parse(fs.readFileSync(path.join(RAIZ, f), "utf8"));
const existe = (f) => fs.existsSync(path.join(RAIZ, f));

// ---- carregamento (igual ao da página) -------------------------------------------
function grupoAnos(pasta, label, tribunal) {
  const idx = ler(pasta + "index.json");
  const out = [];
  for (const a of idx.anos || []) {
    const f = pasta + a.ano + ".json";
    if (!existe(f)) continue;
    ler(f).forEach((x) => { x._sourceLabel = label; x.tribunal = tribunal; out.push(x); });
  }
  return out;
}

function decodeLeve(d) {
  const fontes = Object.keys(d.fontes || {});
  return (d.linhas || []).map((row, i) => {
    const x = {};
    d.campos.forEach((k, j) => {
      let v = row[j];
      const tab = d.tabelas && d.tabelas[k];
      if (tab && Number.isInteger(v)) v = v > 0 ? (tab[v - 1] ?? "") : "";
      x[k] = v;
    });
    x._source = "referencias";
    x._sourceType = typeof x._f === "string" ? x._f : (fontes[Number(x._f) - 1] || "");
    x._sourceLabel = "Teses e decisões de referência" + (x._sourceType ? " · " + x._sourceType : "");
    x.id = x.id ?? i;
    x.tribunal = String(x.orgao || "Tribunal não identificado").toUpperCase();
    x.ramo = x.area;
    x.tipo = x.tipoNome || x.tipo;
    x.assunto = x.titulo;
    x.resumo = x._resumo || x.titulo || "";
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(String(x.data || ""))) {
      const [dd, mm, yyyy] = x.data.split("/");
      x.dataJulgamento = `${yyyy}-${mm}-${dd}`;
    } else x.dataJulgamento = x.data;
    return x;
  });
}

function colecaoEmBlocos(base, idx, n, label, kind) {
  const corpos = new Map();
  let faltam = 0;
  for (let i = 0; i < n; i++) {
    const f = `${base}c/${String(i).padStart(3, "0")}.json`;
    if (!existe(f)) { faltam++; continue; }
    Object.entries(ler(f)).forEach(([id, corpo]) => corpos.set(String(id), corpo));
  }
  const indexados = (idx.itens || []).map((row) => {
    const m = Object.fromEntries(idx.campos.map((k, j) => [k, row[j]]));
    const id = String(m.id ?? "");
    const corpo = corpos.get(id);
    const x = { ...m, id, tribunal: kind === "acordao" ? "STJ" : String(m.orgao || "Tribunal não identificado").toUpperCase(), _sourceLabel: label };
    const d = String(m.data || "");
    if (kind === "acordao") {
      x.dataJulgamento = /^\d{8}$/.test(d) ? `${d.slice(0, 4)}-${d.slice(4, 6)}-${d.slice(6, 8)}` : d;
      x.ementa = (corpo && corpo.ementa) || m.titulo || "";
      x.decisao = (corpo && corpo.dec) || "";
      x.resumo = m.titulo || "";
    } else {
      x.dataJulgamento = /^\d{2}\/\d{2}\/\d{4}$/.test(d) ? `${d.slice(6, 10)}-${d.slice(3, 5)}-${d.slice(0, 2)}` : d;
      x.teor = typeof corpo === "string" ? corpo : "";
      x.teseJuridica = m.tese || "";
      x.resumo = [m.titulo, m.tese].filter(Boolean).join("\n");
      x.processo = m.processo || m.id;
    }
    x.area = m.area; x.ramo = m.area;
    x.tipo = kind === "acordao" ? "Acórdão STJ" : "Informativo";
    x.assunto = m.titulo;
    return x;
  });
  const ids = new Set((idx.itens || []).map((r) => String(r[0])));
  const orfaos = [...corpos.entries()].filter(([id]) => !ids.has(id)).map(([id, corpo]) => ({
    id, tribunal: kind === "acordao" ? "STJ" : "Tribunal não identificado",
    _sourceLabel: label + " · sem metadados do índice",
    tipo: kind === "acordao" ? "Acórdão STJ sem índice" : "Informativo sem índice",
    ementa: kind === "acordao" ? (corpo && corpo.ementa) || "" : "",
    decisao: kind === "acordao" ? (corpo && corpo.dec) || "" : "",
    teor: kind === "informativo" && typeof corpo === "string" ? corpo : "",
    resumo: kind === "acordao" ? (corpo && corpo.ementa) || "Registro sem resumo no índice" : (typeof corpo === "string" ? corpo.slice(0, 600) : "Registro sem metadados no índice"),
  }));
  return { itens: indexados.concat(orfaos), faltam, orfaos: orfaos.length };
}

// ---- carrega tudo -----------------------------------------------------------------
const lista = [];
const aviso = [];
const rec = grupoAnos("reclamacoes/anos/", "STF · reclamações", "STF");
const ctrl = grupoAnos("controleconst/anos/", "STF · controle concentrado", "STF");
const ref = decodeLeve(ler("leve/decisoes.json"));
const ac = colecaoEmBlocos("stj/acordaos/", ler("stj/acordaos/indice.json"), 80, "STJ · acórdãos", "acordao");
const inf = colecaoEmBlocos("informativos/", ler("informativos/indice.json"), 24, "Informativos · STF/STJ", "informativo");
if (ac.faltam) aviso.push(`${ac.faltam} blocos de acórdãos ausentes`);
if (inf.faltam) aviso.push(`${inf.faltam} blocos de informativos ausentes`);
lista.push(...rec, ...ctrl, ...ref, ...ac.itens, ...inf.itens);


const hoje = new Date().toISOString().slice(0, 10);
function seed(n){ let s = n; return () => (s = (s * 1664525 + 1013904223) % 4294967296) / 4294967296; }
const rnd = seed(20261005);
const corpo = (x) => String([x.ementa, x.resumo, x._resumo, x.teseJuridica, x.tema, x.decisao, x.andamento, x.teor, x.titulo].filter((v) => typeof v === "string" && v.trim()).join(" ")).replace(/\s+/g, " ").trim();
const ROT = {
  essential: ["ESSENCIAL", "o classificador considera conteúdo fundamental de estudo (tese, precedente, evolução da jurisprudência)"],
  keep: ["PRIORITÁRIA", "o classificador considera que vale estudar (explica uma regra, exceção ou tese)"],
  application: ["APLICAÇÃO", "só aplica uma tese já firmada, sem explicação nova"],
  review: ["REVISÃO HUMANA", "o classificador não conseguiu decidir sozinho — esta é a sua chance de decidir"],
  noStudy: ["DESCARTAR", "o classificador considera que NÃO há conteúdo específico de estudo"],
};
const FONTES = ["STF · controle concentrado", "STF · reclamações", "STJ · acórdãos", "Teses e decisões de referência · extras"];
const POR = 6;
let md = `# Revisão dos julgados — marque se concorda com o classificador (${hoje})\n\n`;
md += `Cada exemplo abaixo traz, logo no começo, o **VEREDITO do classificador automático**: ESSENCIAL, PRIORITÁRIA, APLICAÇÃO, REVISÃO HUMANA ou **DESCARTAR** (sem conteúdo de estudo). O que eu preciso de você, em cada exemplo, é só dizer **concordo** ou **discordo** (e, se discordar, para qual classe iria). Nada foi apagado; isso serve para eu ajustar a regra antes de remover qualquer coisa.\n\n`;
md += `Como ler: se você acha que um exemplo marcado DESCARTAR **tem** conteúdo de estudo, o classificador está descartando demais (anote o número do processo). Se um marcado PRIORITÁRIA/ESSENCIAL não serve para estudar, está priorizando demais.\n\n---\n\n`;
let n = 0;
for (const f of FONTES) {
  const arr = lista.filter((x) => x._sourceLabel === f);
  const por = {};
  for (const x of arr) (por[score(x).kind] = por[score(x).kind] || []).push(x);
  md += `# ${f}\n\nTotal: ${arr.length.toLocaleString("pt-BR")} registros. ` + Object.keys(ROT).map((k) => `${ROT[k][0]}: ${(por[k] || []).length.toLocaleString("pt-BR")}`).join(" · ") + "\n\n";
  for (const k of ["noStudy", "review", "application", "keep", "essential"]) {
    const g = por[k] || [];
    if (!g.length) continue;
    md += `## ${f} — exemplos que o classificador marcou como **${ROT[k][0]}**\n_${ROT[k][1]}_\n\n`;
    const idx = new Set();
    while (idx.size < Math.min(POR, g.length)) idx.add(Math.floor(rnd() * g.length));
    for (const i of idx) {
      const x = g[i];
      n++;
      md += `### Exemplo ${n} — ${x.processo || x.id} · ${x.dataJulgamento || x.data || "s/d"}\n**VEREDITO DO CLASSIFICADOR: ${ROT[k][0]}**\n\n${corpo(x)}\n\n**Sua opinião:** ( ) concordo   ( ) discordo → deveria ser: __________\n\n---\n\n`;
    }
  }
}
fs.writeFileSync(path.join(__dirname, `revisao-por-classe-${hoje}.md`), md);
console.log(n, "exemplos");
