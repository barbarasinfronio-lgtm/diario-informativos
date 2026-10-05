#!/usr/bin/env node
// Curadoria das Reclamações (decisão da Barbara em 05/10/2026, depois de ler 24 exemplos):
//  • DESCARTAR (sai dos dados): certidão só de resultado ("julgou improcedente a reclamação"…) e
//    reclamação que apenas manda reapreciar/sobrestar à luz de uma tese já firmada (Tema 1.118, 246…).
//  • P (prioritárias): o que scripts/score-curadoria.js marca como essencial/prioritário.
//  • O (outras): o resto (aplicações com algo a mais, ex.: ratifica liminar, extingue ações, fixa condições).
// Roda no GitHub a cada envio (dividir-dados-por-ano.yml), antes de dividir por ano.
"use strict";
const fs = require("fs");
const path = require("path");
const { score } = require("./score-curadoria.js");
const f = path.join(__dirname, "..", "reclamacoes", "reclamacoes-data.js");
const s = fs.readFileSync(f, "utf8");
const ini = s.indexOf("[");
const fim = s.lastIndexOf("]") + 1;
const lista = JSON.parse(s.slice(ini, fim));
const SIMPLES = /sobrestamento|profira outra decis[ãa]o|reaprecie|reapreci|analise o caso [àa] luz|nova decis[ãa]o/i;
const SUBST = /extingu|ratific|fix\w+\s+(a\s+seguinte\s+)?tese|declar\w+\s+(a\s+)?(in)?constitucionalidade|modul/i;
const FORCAR_D = ["Rcl 19662"];   // indicado pela Barbara
const saida = [];
const n = { P: 0, O: 0, D: 0 };
for (const d of lista) {
  const k = score(d).kind;
  const t = String(d.resumo || "");
  const principal = String(d.processo || "").split(" e ")[0].trim();
  let cur;
  if (k === "essential" || k === "keep") cur = "P";
  else if (k === "noStudy") cur = "D";
  else if (k === "application" && !SUBST.test(t) && t.length <= 800 && (SIMPLES.test(t) || /julgou improcedente/i.test(t))) cur = "D";
  else if (FORCAR_D.includes(principal)) cur = "D";
  else cur = "O";
  n[cur]++;
  if (cur === "D") continue;
  d.cur = cur;
  saida.push(d);
}
const indent = s.slice(ini, ini + 3).startsWith("[\n ") ? 1 : null;
const corpo = indent ? JSON.stringify(saida, null, indent) : JSON.stringify(saida);
const novo = s.slice(0, ini) + corpo + s.slice(fim);
if (novo !== s) fs.writeFileSync(f, novo);
console.log(`Reclamações: ${lista.length} → ${saida.length} (prioritárias ${n.P}, outras ${n.O}, descartadas ${n.D})`);
