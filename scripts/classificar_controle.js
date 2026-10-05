#!/usr/bin/env node
// Curadoria do Controle de Constitucionalidade (decisão da Barbara em 05/10/2026):
//  • DESCARTAR (sai dos dados): certidão que só registra o resultado e não traz nada de estudo —
//    "embargos rejeitados", "agravo desprovido", "prejudicada", "improcedente"… — sem declarar
//    (in)constitucionalidade, modular efeitos, fixar tese, nem conceder/confirmar liminar.
//  • P  (prioritárias): o que o classificador de scripts/score-curadoria.js marca como essencial/prioritário.
//  • O  (outras): todo o resto — inclusive o que o classificador deixa para "revisão humana" e as
//    decisões que declaram a inconstitucionalidade. Cada um recebe o campo "cur" ("P" ou "O").
// Roda no GitHub a cada envio (dividir-dados-por-ano.yml), antes de dividir por ano.
"use strict";
const fs = require("fs");
const path = require("path");
const { score } = require("./score-curadoria.js");
const f = path.join(__dirname, "..", "controleconst", "adi_dados.js");
const s = fs.readFileSync(f, "utf8");
const ini = s.indexOf("[");
const fim = s.lastIndexOf("]") + 1;
const lista = JSON.parse(s.slice(ini, fim));
const SUBST = /declar\w*\s+(a\s+)?(parcial\w*\s+)?(in)?constitucionalidade|inconstitucionalidade|interpreta[cç][aã]o conforme|modul\w+|nulidade|sem redu[cç][aã]o de texto|fix\w+\s+(a\s+seguinte\s+)?tese|julgou\s+(parcialmente\s+)?procedente|defer\w+\s+(em parte\s+)?(o pedido de\s+|a\s+)?(medida\s+)?(cautelar|liminar)|suspen\w+\s+(a\s+)?efic[aá]cia|confirm\w+\s+(a\s+)?(medida\s+)?cautelar|referend\w+/i;
const LIMITE = 700;   // certidões longas costumam trazer mais coisas: ficam em "Outras"
const saida = [];
const n = { P: 0, O: 0, D: 0 };
for (const d of lista) {
  const k = score(d).kind;
  let cur;
  if (k === "essential" || k === "keep") cur = "P";
  else if (k === "noStudy" && !SUBST.test(d.tema || "") && String(d.tema || "").length <= LIMITE) cur = "D";
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
console.log(`Controle: ${lista.length} → ${saida.length} (prioritárias ${n.P}, outras ${n.O}, descartadas ${n.D})`);
