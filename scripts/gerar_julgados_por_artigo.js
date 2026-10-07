// gerar_julgados_por_artigo.js — "Com julgados": para cada artigo de uma lei, até 2 decisões do site que tratam dele
// (leis/julgados/<id do texto>.json + leis/julgados/indice.json).
//
// Piloto com a Lei 13.105/2015 (CPC). Para acrescentar outra lei, ponha mais uma entrada em LEIS_PILOTO
// (id do texto em leis/texto/, expressão que reconhece a lei no texto das decisões e, se a lei tiver uma versão
// antiga com outro número de artigos, a data em que a nova passou a valer).
//
// Como acha as decisões: lê o texto de cada decisão (repercussão geral, repetitivos, Jurisprudência em Teses, decisões
// de referência do STF, ADI/ADPF/ADC/ADO e julgados dos informativos), procura onde a lei é citada ("art. 85, § 14, do
// CPC") e anota o artigo e o pedaço (caput, § n, parágrafo único). Fica com as 2 melhores por artigo: primeiro as que
// já caíram em prova, depois as de efeito mais amplo (controle de constitucionalidade, repercussão geral, repetitivos).
//
// Uso: node scripts/gerar_julgados_por_artigo.js   (roda no GitHub junto com gerar_leves.js)
const fs = require("fs");
const path = require("path");
const RAIZ = path.join(__dirname, "..");
const ler = (f) => fs.readFileSync(path.join(RAIZ, f), "utf8");
global.window = global;
eval(ler("site/decisoes/rg-repetitivos-data.js"));

const LEIS_PILOTO = [
  {
    tid: "ato2015-2018-2015-lei-l13105", nome: "Código de Processo Civil (Lei nº 13.105/2015)",
    explicita: /13\.105|CPC\s*\/\s*(?:20)?15|novo\s+CPC|CPC\s+de\s+2015|C[óo]digo\s+de\s+Processo\s+Civil\s+de\s+2015/i,
    alias: "(?:Lei(?:\\s+(?:Federal|Ordin[áa]ria))?\\s+n?[º°o.]*\\s*13\\.105(?:\\s*\\/\\s*(?:20)?15)?|Novo\\s+CPC|CPC(?:\\s*\\/\\s*(?:20)?15)?|C[óo]digo\\s+de\\s+Processo\\s+Civil(?:\\s+de\\s+2015)?)",
    valeDesde: "2016-03-18",      // antes disso, "CPC" sem ano é o de 1973
    // citados só para descrever o rito dos recursos repetitivos / repercussão geral (não é "o julgado trata do artigo")
    ritoRepetitivo: ["1036", "1037", "1038", "1039", "1040", "1041", "1035", "1.036", "1.037", "1.038", "1.039", "1.040", "1.041", "1.035"]
  }
];

// ---- decisões ------------------------------------------------------------------------------------
const cobr = (() => { try { return JSON.parse(ler("provas/cobrancas.json")).itens || {}; } catch (e) { return {}; } })();
const nProvas = (k) => { const v = cobr[k]; return Array.isArray(v) ? new Set(v.map((x) => x[0])).size : 0; };
const curto = (t, n) => { t = String(t || "").replace(/\s+/g, " ").trim(); return t.length > n ? t.slice(0, n).replace(/\s+\S*$/, "") + "…" : t; };
function dataIso(s) {
  s = String(s || "");
  let m = s.match(/(\d{4})-(\d{2})-(\d{2})/);
  if (m) return m[1] + "-" + m[2] + "-" + m[3];
  m = s.match(/(\d{2})\/(\d{2})\/(\d{4})/);
  return m ? m[3] + "-" + m[2] + "-" + m[1] : "";
}
const docs = [];
const hrefAbrir = (id, busca) => "/p/diario-das-decisoes.html#abrir=" + encodeURIComponent(id) + "&busca=" + encodeURIComponent(busca || "");
for (const d of RG_REPETITIVOS_DATA) {
  const proc = String(d.processo || "").replace(/,\s*rel\..*$/i, "").trim();
  const rotulo = (d.precedenteLabel ? d.precedenteLabel + " " : "Tema ") + (d.tema || "") + " (" + (d.orgao || "") + ")" + (proc ? " — " + proc : "");
  docs.push({
    chave: "dec:" + d.id, kind: "rg", repetitivo: /repetitiv|repercuss|IAC|IRDR/i.test((d.tipoNome || "") + " " + (d.precedenteLabel || "") + " " + (d.tipo || "")),
    rotulo: d.tema ? curto(rotulo, 80) : curto((proc ? proc + " — " : "") + (d.titulo || ""), 80), titulo: d.titulo, tese: d.tese || d.destaque || d.questao || "",
    texto: [d.titulo, d.tese, d.questao, d.destaque, d.resumo].filter(Boolean).join(" . "), data: dataIso(d.data),
    href: hrefAbrir(d.id, d.processo || d.titulo)
  });
}
for (const d of JSON.parse(ler("stj/teses.json")).itens || []) {
  docs.push({
    chave: "dec:" + d.id, kind: "teses", rotulo: curto(String(d.titulo || "").replace(/^Jurisprud[êe]ncia em Teses do STJ\s*/i, "JT STJ "), 50), titulo: d.titulo, tese: d.tese || d.destaque || "",
    texto: [d.titulo, d.tese, d.destaque].filter(Boolean).join(" . "), data: dataIso(d.data), href: hrefAbrir(d.id, d.titulo)
  });
}
for (const d of JSON.parse(ler("stf/extras.json")).itens || []) {
  docs.push({
    chave: "dec:" + d.id, kind: "extras", rotulo: curto((d.processo ? d.processo + " — " : "") + (d.titulo || ""), 80), titulo: d.titulo, tese: d.tese || "",
    texto: [d.titulo, d.tese].filter(Boolean).join(" . "), data: dataIso(d.data), href: hrefAbrir(d.id, d.processo || d.titulo)
  });
}
for (const f of fs.readdirSync(path.join(RAIZ, "controleconst/anos"))) {
  if (!/^\d{4}\.json$/.test(f)) continue;
  for (const d of JSON.parse(ler("controleconst/anos/" + f))) {
    docs.push({
      chave: "adi:" + d.id, kind: "adi", procedente: /procedente/i.test(d.resultado || "") && !/improcedente/i.test(d.resultado || ""),
      rotulo: curto(d.processo || d.id, 60), titulo: d.processo, tese: d.tese || d.tema || d.resumo || "",
      texto: [d.tema, d.tese, d.resumo].filter(Boolean).join(" . "), data: dataIso(d.data),
      href: "/p/diario-das-decisoes.html#busca=" + encodeURIComponent(d.processo || "")
    });
  }
}
for (const x of JSON.parse(ler("informativos/indice.json")).itens || []) {   // [id, orgao, informativo, area, titulo, tese, processo, data, parte]
  docs.push({
    chave: "dec:inf-" + x[0], kind: "inf", rotulo: curto(String(x[6] || x[4] || "").replace(/,\s*rel\..*$/i, "").replace(/\s*\([A-Za-z]+-\d+\)\s*$/, "") + " (Info " + x[1] + " " + x[2] + ")", 80), titulo: x[4], tese: x[5] || "",
    texto: [x[4], x[5]].filter(Boolean).join(" . "), data: dataIso(x[7]), href: hrefAbrir("inf-" + x[0], (x[6] || x[4] || "").replace(/,\s*rel\..*$/i, ""))      // no Diário das Decisões o card de informativo é "inf-<id>"
  });
}

// ---- onde cada decisão cita a lei ----------------------------------------------------------------------
// devolve { "85": Set("c","§14"), … }
function artigosCitados(texto, lei, doc) {
  const out = {};
  const re = new RegExp(lei.alias, "gi");
  let m, prevFim = 0;
  while ((m = re.exec(texto))) {
    if (!lei.explicita.test(m[0])) {      // "CPC" sem ano: só vale se a decisão é do CPC de 2015
      if (lei.explicita.test(texto.slice(Math.max(0, m.index - 40), m.index + m[0].length + 12))) { /* ano logo ao lado */ }
      else if (!doc.data || doc.data < lei.valeDesde) continue;
      else if (/CPC\s*\/\s*(?:19)?73|1973|Lei\s*(?:n[º°o.]*\s*)?5\.869/i.test(texto)) continue;       // fala do CPC antigo
    }
    const posAlias = texto.slice(m.index + m[0].length, m.index + m[0].length + 160);
    const forma2 = /^\s*[,:]?\s*(?=arts?\.)/i.exec(posAlias);      // "CPC, art. 139, IV" (lei antes do artigo)
    const pre = forma2 ? m[0] + " " + posAlias.slice(forma2[0].length).split(/\b(?:Lei\b|Decreto|CF\b|CLT\b|CP\b|CPP\b|CC\b|CDC\b|CTN\b|Constitui)/)[0] : texto.slice(Math.max(prevFim, m.index - 180), m.index);
    prevFim = m.index + m[0].length;
    const i = Math.max(pre.lastIndexOf("art."), pre.lastIndexOf("arts."), pre.lastIndexOf("Art."), pre.lastIndexOf("Arts."), pre.lastIndexOf("artigo"), pre.lastIndexOf("artigos"));
    if (i < 0) continue;
    let seg = pre.slice(i).replace(/^(?:arts?\.|artigos?)\s*/i, "").replace(/\b(?:do|da|dos|das|no|na)\s*$/i, "").split(/[;]/)[0].split(/\.\s+(?=[A-ZÁÉÍÓÚÂÊÔÃÕÇ])/)[0];   // frase nova = fim da citação
    // quando há outra lei no meio ("art. 5º da CF e art. 85 do CPC"), só vale depois dela
    const cortes = seg.split(/\b(?:da|do)\s+(?:Constitui[çc][ãa]o|Lei\b|Decreto|C[óo]digo|CF\b|CLT\b|CP\b|CPP\b|CC\b|CDC\b|CTN\b)[^,;]*?(?:,\s*|\s+e\s+|\s+)(?=arts?\.)/i);
    seg = cortes[cortes.length - 1];
    if (cortes.length === 1 && /\b(?:da|do)\s+(?:Constitui[çc][ãa]o|Lei\b|Decreto|C[óo]digo\s+(?!de\s+Processo\s+Civil)|Regimento)/i.test(seg)) continue;     // "art. 30 da Lei 8.038 … CPC": o artigo é de outra lei
    const tok = /§§?s?\s*(\d+[ºo°]?(?:-[A-Z])?(?:\s*(?:,|e|a)\s*\d+[ºo°]?(?:-[A-Z])?)*)|(par[áa]grafo\s+[úu]nico)|(caput)|(inc(?:iso)?s?\.?\s+[IVXLC]+(?:\s*(?:,|e|a)\s*[IVXLC]+)*)|(al[íi]neas?\s+["“']?[a-z]["”']?)|(\d{1,4}(?:\.\d{3})?)\s*([ºo°])?(?:-([A-Z]))?(?!\s*\/\s*\d)/gi;
    let t, atual = null;
    const lista = [];
    while ((t = tok.exec(seg))) {
      if (t[1]) {
        if (atual) t[1].split(/\s*(?:,|e|a)\s*/).forEach((p) => { const n = (p.match(/\d+(?:-[A-Z])?/) || [])[0]; if (n) atual.mods.add("§" + n); });
      } else if (t[2]) { if (atual) atual.mods.add("u"); }
      else if (t[3]) { if (atual) atual.mods.add("c"); }
      else if (t[4] || t[5]) { /* inciso / alínea: fica no caput ou no § anterior */ }
      else if (t[6]) {
        const n = parseInt(t[6].replace(".", ""), 10);
        const antes = seg.slice(Math.max(0, t.index - 6), t.index);
        if ((n >= 1900 && n <= 2100 && !t[7]) || /n[º°o.]\s*$/i.test(antes) || /\/\s*$/.test(antes) || /\(\s*$/.test(antes)) continue;     // "(1)" é nota de rodapé
        if (n < 1 || n > 2200) continue;
        atual = { art: String(n) + (t[8] ? "-" + t[8].toUpperCase() : ""), mods: new Set() };
        lista.push(atual);
      }
    }
    // "arts. 926 a 928" → 926, 927, 928
    const rg = /(\d{1,4}(?:\.\d{3})?)\s+a\s+(\d{1,4}(?:\.\d{3})?)(?!\s*\/)/.exec(seg);
    if (rg) {
      const a = parseInt(rg[1].replace(".", ""), 10), b = parseInt(rg[2].replace(".", ""), 10);
      if (b > a && b - a <= 6) for (let k = a + 1; k < b; k++) lista.push({ art: String(k), mods: new Set() });
    }
    for (const x of lista.slice(0, 12)) {
      if (doc.repetitivo && lei.ritoRepetitivo.includes(x.art)) continue;
      const mods = x.mods.size ? [...x.mods] : ["c"];
      const s = out[x.art] || (out[x.art] = new Set());
      mods.forEach((p) => s.add(p));
    }
  }
  return out;
}

const PESO = { adi: 6, rg: 4, extras: 3, teses: 3, inf: 2 };
function pontos(doc, art, mods, nArt) {
  let p = PESO[doc.kind] || 1;
  if (doc.kind === "rg" && doc.repetitivo) p += 2;
  if (doc.kind === "adi" && doc.procedente) p += 1;
  p += 3 * Math.min(3, nProvas(doc.chave));
  if (new RegExp("\\b" + art.replace(".", "\\.?") + "\\b").test(String(doc.titulo || "") + " " + String(doc.tese || "").slice(0, 220))) p += 4;   // o artigo está na tese/título: o julgado trata dele
  if (nArt === 1) p += 1;
  if (mods.some((m) => m !== "c")) p += 0.5;      // aponta o §
  return p + (doc.data ? (parseInt(doc.data.slice(0, 4), 10) - 2000) / 100 : 0);
}

fs.mkdirSync(path.join(RAIZ, "leis/julgados"), { recursive: true });
const indice = {};
for (const lei of LEIS_PILOTO) {
  const porArt = {};         // art -> [{doc, mods, pontos}]
  for (const doc of docs) {
    const arts = artigosCitados(doc.texto, lei, doc);
    const n = Object.keys(arts).length;
    for (const [art, mods] of Object.entries(arts)) {
      (porArt[art] = porArt[art] || []).push({ doc, mods: [...mods], p: pontos(doc, art, [...mods], n) });
    }
  }
  const lista = [], idx = new Map(), art = {};
  for (const [a, cands] of Object.entries(porArt)) {
    cands.sort((x, y) => y.p - x.p);
    const escolhidos = [];
    for (const c of cands) {
      if (escolhidos.length >= 2) break;
      if (escolhidos.some((e) => e.doc.chave === c.doc.chave)) continue;
      escolhidos.push(c);
    }
    art[a] = escolhidos.map((c) => {
      if (!idx.has(c.doc.chave)) { idx.set(c.doc.chave, lista.length); lista.push([c.doc.rotulo, c.doc.href, curto(c.doc.tese || c.doc.titulo, 130)]); }
      return [idx.get(c.doc.chave), c.mods];
    });
  }
  const saida = { lei: lei.nome, decisoes: lista, art };
  fs.writeFileSync(path.join(RAIZ, "leis/julgados", lei.tid + ".json"), JSON.stringify(saida));
  indice[lei.tid] = { nome: lei.nome, artigos: Object.keys(art).length, decisoes: lista.length };
  console.log(`${lei.nome}: ${Object.keys(art).length} artigos com julgados, ${lista.length} decisões diferentes (de ${docs.length} analisadas)`);
}
fs.writeFileSync(path.join(RAIZ, "leis/julgados/indice.json"), JSON.stringify(indice));
