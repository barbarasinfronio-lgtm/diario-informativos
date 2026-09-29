// juntar-contas-anonimas.mjs — junta o progresso das contas anônimas antigas
// na conta de verdade (Google ou e-mail e senha) de quem tem o MESMO nome nos
// grupos de estudo.
//
// Uso (precisa da chave de "conta de serviço" do Firebase — Configurações do
// projeto > Contas de serviço > Gerar nova chave privada):
//   npm install firebase-admin
//   node juntar-contas-anonimas.mjs /caminho/da/chave.json            # só mostra o plano
//   node juntar-contas-anonimas.mjs /caminho/da/chave.json --aplicar  # grava
//
// Regras:
//  - O nome de cada pessoa vem do documento dela nos grupos
//    (groups/<código>/members/<uid>.name). Nomes são comparados sem
//    diferença de maiúsculas/minúsculas e de espaços nas pontas.
//  - Para cada nome com EXATAMENTE UMA conta de verdade, todas as contas
//    anônimas com esse nome são juntadas nela. Nomes com nenhuma ou com
//    mais de uma conta de verdade só aparecem no relatório (nada muda).
//  - Juntar = união das leituras (vale "lida" se estiver lida em qualquer
//    uma, com a data mais antiga), dos prêmios, das revisões e dos grupos.
//    A conta de verdade só GANHA coisas; nada dela é apagado.
//  - Nos grupos: a conta de verdade entra no lugar da anônima (se ainda não
//    estava), com as contagens recalculadas, e o documento da anônima sai
//    do grupo (é isso que tira os nomes repetidos do ranking).
//  - As contas anônimas e o progresso delas NÃO são apagados. Antes de
//    gravar, tudo o que vai mudar é copiado para backup-<data>.json.
import { readFileSync, writeFileSync } from "node:fs";
import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";

const [keyPath, ...flags] = process.argv.slice(2);
if (!keyPath) { console.error("Informe o caminho da chave da conta de serviço."); process.exit(1); }
const APLICAR = flags.includes("--aplicar");

initializeApp({ credential: cert(JSON.parse(readFileSync(keyPath, "utf8"))) });
const db = getFirestore();

const MAPS = { "progress/": "lidas", "progress-leis/": "lidasLeis", "progress-sumulas/": "lidasSumulas",
               "progress-normas/": "lidasNormas", "progress-decisoes/": "lidasDecisoes" };
const SO_LOCAIS = ["lidasAdi", "lidasRcl", "estrelasOuro"]; // não ficam na nuvem: vale o maior

const lida = (v) => v === true || !!(v && v.lida);
const norm = (s) => String(s || "").trim().replace(/\s+/g, " ").toLowerCase();

function mergeMaps(a = {}, b = {}) {
  const out = {};
  for (const k of new Set([...Object.keys(a), ...Object.keys(b)])) {
    const x = a[k], y = b[k];
    if (!lida(x) && !lida(y)) { out[k] = x !== undefined ? x : y; continue; }
    const datas = [x, y].filter((v) => lida(v) && v && v.lidaEm).map((v) => v.lidaEm).sort();
    const base = lida(x) && typeof x === "object" ? x : (lida(y) && typeof y === "object" ? y : {});
    out[k] = { ...base, lida: true, lidaEm: datas[0] || base.lidaEm || null };
  }
  return out;
}
function mergeDates(a = {}, b = {}) {
  const out = { ...a };
  for (const [k, v] of Object.entries(b)) if (!out[k] || (v && v < out[k])) out[k] = v;
  return out;
}
const union = (a = [], b = []) => [...new Set([...a, ...b])];
function mergeGroups(a = [], b = []) {
  const seen = new Set(), out = [];
  for (const g of [...a, ...b]) if (g && g.code && !seen.has(g.code)) { seen.add(g.code); out.push(g); }
  return out;
}
function mergeRevisoes(a = {}, b = {}) {
  const out = { ...a };
  for (const [k, v] of Object.entries(b)) out[k] = Array.isArray(v) ? union(out[k] || [], v).sort() : (out[k] || v);
  return out;
}
const contar = (map) => Object.values(map || {}).filter(lida).length;

async function lerConta(uid) {
  const conta = { docs: {} };
  for (const p of [...Object.keys(MAPS), "progress-premios/"]) {
    const s = await db.doc(p + uid).get();
    conta.docs[p] = s.exists ? s.data() : null;
  }
  return conta;
}

// ---- 1) quem é quem --------------------------------------------------------
const usuarios = new Map(); // uid -> { anon, email, providers }
let pageToken;
do {
  const r = await getAuth().listUsers(1000, pageToken);
  for (const u of r.users) {
    const providers = u.providerData.map((p) => p.providerId);
    usuarios.set(u.uid, { anon: providers.length === 0, email: u.email || "", providers });
  }
  pageToken = r.pageToken;
} while (pageToken);

const membros = await db.collectionGroup("members").get();
const porUid = new Map(); // uid -> { nomes:Set, grupos: [{code, ref, data}] }
for (const d of membros.docs) {
  const code = d.ref.parent.parent.id;
  const e = porUid.get(d.id) || { nomes: new Set(), grupos: [] };
  if (d.data().name) e.nomes.add(norm(d.data().name));
  e.grupos.push({ code, ref: d.ref, data: d.data() });
  porUid.set(d.id, e);
}

const porNome = new Map(); // nome -> Set(uid)
for (const [uid, e] of porUid) for (const n of e.nomes) {
  if (!porNome.has(n)) porNome.set(n, new Set());
  porNome.get(n).add(uid);
}

// ---- 2) plano ---------------------------------------------------------------
const planos = [], avisos = [];
for (const [nome, uids] of [...porNome].sort()) {
  const lista = [...uids];
  const reais = lista.filter((u) => usuarios.has(u) && !usuarios.get(u).anon);
  const anons = lista.filter((u) => !usuarios.has(u) || usuarios.get(u).anon);
  if (!anons.length) continue;
  if (reais.length === 1) planos.push({ nome, alvo: reais[0], anons });
  else if (reais.length === 0 && anons.length > 1) avisos.push(`"${nome}": ${anons.length} contas anônimas e nenhuma com Google/e-mail — nada muda`);
  else if (reais.length > 1) avisos.push(`"${nome}": ${reais.length} contas com Google/e-mail (${reais.map((u) => usuarios.get(u).email || u).join(", ")}) — nada muda, decidir à mão`);
}
// uma anônima com dois nomes diferentes não pode ir para duas contas
const destino = new Map();
for (const p of planos) for (const a of p.anons) {
  if (destino.has(a) && destino.get(a) !== p.alvo) avisos.push(`anônima ${a} tem nomes de duas pessoas — ignorada`);
  destino.set(a, destino.has(a) && destino.get(a) !== p.alvo ? null : p.alvo);
}

console.log(`Contas: ${usuarios.size} (${[...usuarios.values()].filter((u) => u.anon).length} anônimas). Membros de grupos: ${membros.size}.\n`);
for (const p of planos) {
  const anons = p.anons.filter((a) => destino.get(a) === p.alvo);
  if (!anons.length) continue;
  const alvo = usuarios.get(p.alvo);
  console.log(`• "${p.nome}" → ${alvo.email || p.alvo} (${alvo.providers.join(", ")}) recebe ${anons.length} conta(s) anônima(s)`);
}
if (avisos.length) console.log("\nAvisos:\n  " + avisos.join("\n  "));

// ---- 3) aplicar -------------------------------------------------------------
const backup = { quando: new Date().toISOString(), docs: {} };
const guardar = (path, data) => { if (!(path in backup.docs)) backup.docs[path] = data ?? null; };

for (const p of planos) {
  const anons = p.anons.filter((a) => destino.get(a) === p.alvo);
  if (!anons.length) continue;
  const alvo = await lerConta(p.alvo);
  const novo = JSON.parse(JSON.stringify(alvo.docs));
  let antes = {}, depois = {};
  for (const path of Object.keys(MAPS)) antes[path] = contar(alvo.docs[path] && alvo.docs[path].map);
  const locais = {};
  for (const a of anons) {
    const c = await lerConta(a);
    for (const path of Object.keys(MAPS)) {
      const d = c.docs[path]; if (!d) continue;
      const n = novo[path] || (novo[path] = {});
      n.map = mergeMaps(n.map, d.map);
      if (!n.avatar && d.avatar) n.avatar = d.avatar;
      if (path === "progress-leis/") {
        if (!n.edital && d.edital) n.edital = d.edital;
        const g = mergeGroups(n.grupos, d.grupos); if (g.length) n.grupos = g;
      }
    }
    const pa = c.docs["progress-premios/"];
    if (pa) {
      const n = novo["progress-premios/"] || (novo["progress-premios/"] = {});
      n.conquistados = mergeDates(n.conquistados, pa.conquistados);
      n.vistos = union(n.vistos, pa.vistos);
      if (pa.revisoes) n.revisoes = mergeRevisoes(n.revisoes, pa.revisoes);
    }
    for (const g of porUid.get(a).grupos) for (const f of SO_LOCAIS) locais[f] = Math.max(locais[f] || 0, +g.data[f] || 0);
  }
  for (const path of Object.keys(MAPS)) depois[path] = contar(novo[path] && novo[path].map);
  console.log(`\n  ${p.nome}: leituras ` + Object.keys(MAPS).map((k) => `${MAPS[k]} ${antes[k]}→${depois[k]}`).join(", "));

  // grupos: a conta de verdade entra no lugar das anônimas
  const contagens = {};
  for (const [path, campo] of Object.entries(MAPS)) contagens[campo] = depois[path];
  const gruposAlvo = new Map((porUid.get(p.alvo)?.grupos || []).map((g) => [g.code, g]));
  const acoesGrupo = [];
  for (const a of anons) for (const g of porUid.get(a).grupos) {
    acoesGrupo.push({ apagar: g.ref, data: g.data });
    if (!gruposAlvo.has(g.code)) {
      const ref = db.doc(`groups/${g.code}/members/${p.alvo}`);
      gruposAlvo.set(g.code, { code: g.code, ref, data: { name: g.data.name, avatar: g.data.avatar || null, joinedAt: g.data.joinedAt || null } });
    }
  }
  console.log(`  grupos: ${[...gruposAlvo.keys()].join(", ")} | saem ${acoesGrupo.length} documento(s) de anônimas`);

  if (!APLICAR) continue;
  const batch = db.batch();
  const agora = new Date().toISOString();
  for (const path of Object.keys(novo)) {
    if (!novo[path]) continue;
    guardar(path + p.alvo, alvo.docs[path]);
    batch.set(db.doc(path + p.alvo), { ...novo[path], updatedAt: agora });
  }
  for (const g of gruposAlvo.values()) {
    const atual = g.data || {};
    guardar(g.ref.path, porUid.get(p.alvo)?.grupos.find((x) => x.code === g.code)?.data || null);
    const campos = { ...contagens, updatedAt: agora };
    for (const f of SO_LOCAIS) campos[f] = Math.max(+atual[f] || 0, locais[f] || 0);
    batch.set(g.ref, { ...atual, ...campos }, { merge: true });
  }
  for (const x of acoesGrupo) { guardar(x.apagar.path, x.data); batch.delete(x.apagar); }
  if (APLICAR) {
    writeFileSync(`backup-${backup.quando.replace(/[:.]/g, "-")}.json`, JSON.stringify(backup, null, 1));
    await batch.commit();
    console.log("  ✓ gravado");
  }
}
if (!APLICAR) console.log("\n(Só o plano — nada foi gravado. Para gravar, rode de novo com --aplicar.)");
else console.log(`\nBackup em backup-${backup.quando.replace(/[:.]/g, "-")}.json`);
