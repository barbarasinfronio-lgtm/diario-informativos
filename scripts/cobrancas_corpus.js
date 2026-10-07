// Exporta (stdout) as súmulas e decisões do site para scripts/cobrancas_provas.py.
const fs = require("fs"); global.window = global;
eval(fs.readFileSync("site/sumulas/sumulas-data.js", "utf8")); eval(fs.readFileSync("site/decisoes/rg-repetitivos-data.js", "utf8"));
const C = [];
for (const k in SUMULAS_DATA) for (const s of (SUMULAS_DATA[k].sumulas || [])) C.push({ src: "sum", key: k + "|" + s.numero, org: k, num: String(s.numero), texto: s.texto });
for (const d of RG_REPETITIVOS_DATA) C.push({ src: "dec", key: String(d.id), org: d.orgao, tipo: d.tipo, label: d.precedenteLabel || "Tema", num: String(d.tema), texto: d.tese || "" });
for (const d of JSON.parse(fs.readFileSync("stj/teses.json", "utf8")).itens) C.push({ src: "dec", key: d.id, org: "STJ", tipo: "teses", num: d.tema, texto: d.tese });
for (const d of JSON.parse(fs.readFileSync("stf/extras.json", "utf8")).itens) if (d.grupo === "RESUMOS") C.push({ src: "dec", key: d.id, org: "STF", tipo: d.tipo, texto: d.tese });
for (const x of JSON.parse(fs.readFileSync("informativos/indice.json", "utf8")).itens) C.push({ src: "dec", key: "inf-" + x[0], org: x[1], tipo: "informativo", info: String(x[2] || ""), texto: x[5] });
process.stdout.write(JSON.stringify(C));
