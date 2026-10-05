#!/usr/bin/env node
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

// ---- classifica -------------------------------------------------------------------
const KINDS = ["essential", "keep", "application", "review", "noStudy"];
const NOME = { essential: "Essenciais", keep: "Prioritárias para estudar", application: "Aplicação sem explicação nova", review: "Revisão humana", noStudy: "Sem conteúdo específico" };
const porFonte = {};
const porAno = {};
const porNatureza = {};
for (const x of lista) {
  const r = score(x);
  const fonte = x._sourceLabel;
  const f = (porFonte[fonte] = porFonte[fonte] || { total: 0 });
  f.total++; f[r.kind] = (f[r.kind] || 0) + 1;
  if (r.nature) { const n = (porNatureza[fonte + " | " + r.kind + " | " + r.nature] = (porNatureza[fonte + " | " + r.kind + " | " + r.nature] || 0) + 1); }
  const d = String(x.dataJulgamento || x.data || "");
  const ano = /^\d{4}/.test(d) ? d.slice(0, 4) : (/^\d{2}\/\d{2}\/\d{4}$/.test(d) ? d.slice(-4) : "sem data");
  const a = (porAno[ano] = porAno[ano] || { total: 0 });
  a.total++; a[r.kind] = (a[r.kind] || 0) + 1;
}

// ---- relação Informativo (STJ) x acórdão do índice: classe + número do processo -------
const chave = (p) => {
  const t = String(p || "");
  const num = (t.match(/\d[\d.]*\d|\d/g) || []).map((s) => s.replace(/\./g, "")).sort((a, b) => b.length - a.length)[0];
  const cls = norm(t).match(/\b(resp|aresp|earesp|eresp|hc|rhc|rms|ms|pet|cc|rcl|edcl|agint|agrg|ar|sls|sec)\b/);
  return num && num.length >= 4 ? (cls ? cls[1] : "") + ":" + num : "";
};
const mapaAc = new Map();
for (const x of ac.itens) { const k = chave(x.processo); if (k) mapaAc.set(k, (mapaAc.get(k) || 0) + 1); }
let infStj = 0, infStjComChave = 0, infCasa = 0;
for (const x of inf.itens) {
  if (x.tribunal !== "STJ") continue;
  infStj++;
  const k = chave(x.processo);
  if (!k) continue;
  infStjComChave++;
  if (mapaAc.has(k) || mapaAc.has(":" + k.split(":")[1])) infCasa++;
}

// ---- grava ------------------------------------------------------------------------
const hoje = new Date().toISOString().slice(0, 10);
const pct = (n, t) => (t ? (100 * n / t).toFixed(1).replace(".", ",") + "%" : "—");
const tot = (o) => KINDS.reduce((s, k) => s + (o[k] || 0), 0);
let md = `# Triagem automática das fontes do site — ${hoje}\n\n`;
md += `Classificador: o mesmo da página de curadoria (\`reclamacoes/curadoria.html\`, commit 2504bc9 do PR #141), copiado em \`curadoria/score.js\`. Dados: a \`main\` do repositório nesta data. **Nada foi alterado nos dados.**\n\n`;
md += `> **Atenção.** É triagem automática, não revisão humana: "Sem conteúdo específico" e "Aplicação" são sinais do classificador, e "Revisão humana" é o que ele não consegue decidir. Não existe percentual global: as fontes se sobrepõem (um mesmo julgado pode estar como acórdão, em Informativo e como tese). Os números abaixo valem **por fonte**.\n\n`;
if (aviso.length) md += `Avisos de carga: ${aviso.join("; ")}.\n\n`;
md += `## Por fonte\n\n| Fonte | Registros | Essenciais | Prioritárias | Aplicação | Revisão humana | Sem conteúdo |\n|---|---:|---:|---:|---:|---:|---:|\n`;
const fontes = Object.keys(porFonte).sort((a, b) => porFonte[b].total - porFonte[a].total);
for (const f of fontes) {
  const o = porFonte[f];
  md += `| ${f} | ${o.total.toLocaleString("pt-BR")} | ${KINDS.slice(0, 5).map((k) => `${(o[k] || 0).toLocaleString("pt-BR")} (${pct(o[k] || 0, o.total)})`).join(" | ")} |\n`;
}
md += `\n(Soma dos registros das fontes: ${lista.length.toLocaleString("pt-BR")} — **contagem com sobreposição**, não é o total de decisões únicas.)\n\n`;
md += `## Natureza do que foi marcado como prioritário ou essencial\n\n| Fonte · classe · natureza | Registros |\n|---|---:|\n`;
for (const [k, v] of Object.entries(porNatureza).sort((a, b) => b[1] - a[1])) md += `| ${k.replace(/ \| /g, " · ")} | ${v.toLocaleString("pt-BR")} |\n`;
md += `\n## Por ano (todas as fontes juntas, com sobreposição)\n\n| Ano | Registros | Prioritárias+Essenciais | Revisão humana | Sem conteúdo |\n|---|---:|---:|---:|---:|\n`;
for (const a of Object.keys(porAno).sort().reverse()) {
  const o = porAno[a];
  md += `| ${a} | ${o.total.toLocaleString("pt-BR")} | ${((o.keep || 0) + (o.essential || 0)).toLocaleString("pt-BR")} (${pct((o.keep || 0) + (o.essential || 0), o.total)}) | ${(o.review || 0).toLocaleString("pt-BR")} | ${(o.noStudy || 0).toLocaleString("pt-BR")} |\n`;
}
md += `\n## Informativos do STJ x acórdãos do índice do site\n\n`;
md += `- Informativos do STJ no índice: ${infStj.toLocaleString("pt-BR")}; com número de processo utilizável: ${infStjComChave.toLocaleString("pt-BR")}.\n`;
md += `- Desses, com acórdão de mesma classe/número no índice de acórdãos: **${infCasa.toLocaleString("pt-BR")}** (${pct(infCasa, infStjComChave)}).\n`;
md += `- Correspondência por classe + número, sem conferir data nem colegiado; serve para dimensionar a sobreposição, não para fundir registros.\n`;
md += `- Corpos sem linha no índice: acórdãos ${ac.orfaos.toLocaleString("pt-BR")}; Informativos ${inf.orfaos.toLocaleString("pt-BR")} (preservados e contados acima como "sem metadados").\n`;
fs.writeFileSync(path.join(__dirname, `triagem-fontes-site-${hoje}.md`), md);
fs.writeFileSync(path.join(__dirname, `triagem-fontes-site-${hoje}.json`),
  JSON.stringify({ gerado: hoje, total_com_sobreposicao: lista.length, porFonte, porNatureza, porAno, informativosStj: { total: infStj, comChave: infStjComChave, comAcordao: infCasa }, orfaos: { acordaos: ac.orfaos, informativos: inf.orfaos }, avisos: aviso }, null, 1));
console.log(md);
