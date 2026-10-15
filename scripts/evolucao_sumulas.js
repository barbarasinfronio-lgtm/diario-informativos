// Exporta as súmulas do site (site/sumulas/sumulas-data.js) para curadoria/evolucao/sumulas.json,
// para o scripts/evolucao_montar.py achar o texto de cada súmula citada. Uso: node scripts/evolucao_sumulas.js
const fs = require("fs"), vm = require("vm"), path = require("path");
const raiz = path.join(__dirname, "..");
const s = fs.readFileSync(path.join(raiz, "site/sumulas/sumulas-data.js"), "utf8");
const ctx = { window: {} };
vm.createContext(ctx);
vm.runInContext(s + "\nthis.D = SUMULAS_DATA;", ctx);
const out = [];
for (const k of Object.keys(ctx.D)) for (const x of (ctx.D[k].sumulas || [])) out.push({ trib: k, numero: x.numero, texto: x.texto, link: x.link || "" });
fs.mkdirSync(path.join(raiz, "curadoria/evolucao"), { recursive: true });
fs.writeFileSync(path.join(raiz, "curadoria/evolucao/sumulas.json"), JSON.stringify(out));
console.log(out.length + " súmulas exportadas");
