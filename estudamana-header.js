/*
* estudamana-header.js — CABEÇALHO ÚNICO DO ESTUDA MANA
*
* Monta o menu de navegação de todas as páginas. A lista de páginas vem
* automaticamente do Blogger (feed de "Páginas" do próprio site): toda
* página nova que você publicar aparece aqui sozinha, no fim do menu, sem
* editar nada. Páginas em rascunho não aparecem.
*
* Como usar: uma única vez, no tema do Blogger (Tema > Editar HTML, antes
* de </body>):
*   <script src=".../estudamana-header.js"></script>
* O cabeçalho aparece sozinho na página inicial e nas páginas de estudo (as que têm o
* bloco ".page" com "header.masthead" dos Diários, o "header.top" do RG ou um
* <div id="estudamana-header">) e se encaixa no topo do conteúdo. Nas
* demais páginas do site (inicial, posts) ele não faz nada. O visual dele fica
* em estudamana-header.css (que usa as cores/fontes de estudamana-tokens.css).
*
* Ele também põe, no canto de baixo à direita de toda página de estudo, os
* botões "A− A A+" de tamanho da letra (ver CONFIG.fontSize). Eles ficam por
* cima de tudo, inclusive das janelas que abrem por cima da página (ex.: o
* card aberto do Diário das Decisões); a escolha fica salva no navegador.
*
* Para as mudanças aparecerem sem esperar o cache do navegador, o tema
* carrega este arquivo com fetch(..., { cache: "no-cache" }) em vez de
* <script src>; o CSS (estudamana-tokens.css + estudamana-header.css) é
* buscado do mesmo jeito por loadStyles(), lá embaixo.
*
* Ajustes opcionais, todos aqui embaixo, em CONFIG.
*/
(function () {
"use strict";

// Se o script estiver na página mais de uma vez (no tema e na página),
// só a primeira cópia roda.
if (window.__estudamanaHeader) return;
window.__estudamanaHeader = true;

// ---- última visita ---------------------------------------------------------
// Guarda neste navegador quando a pessoa visitou o blog pela última vez, para
// as "Leis alteradas" (Meu Progresso > Revisões) mostrarem o que mudou desde
// então. Uma "visita" nova começa depois de 30 minutos sem abrir nenhuma página
// (abrir outra aba ou página logo em seguida não conta como visita nova).
//   localStorage "estudamana-visitas" = { atual: <data e hora ISO>, anterior: <AAAA-MM-DD ou null> }
(function registrarVisita() {
try {
var KEY = "estudamana-visitas", agora = new Date(), v = {};
try { v = JSON.parse(localStorage.getItem(KEY) || "{}") || {}; } catch (e) { v = {}; }
var atual = v.atual ? new Date(v.atual) : null;
var anterior = v.anterior || null;
if (atual && !isNaN(atual)) {
if (agora - atual > 30 * 60 * 1000) {
var p2 = function (n) { return String(n).padStart(2, "0"); };
anterior = atual.getFullYear() + "-" + p2(atual.getMonth() + 1) + "-" + p2(atual.getDate());
}
}
localStorage.setItem(KEY, JSON.stringify({ atual: agora.toISOString(), anterior: anterior }));
} catch (e) {}
})();

var CONFIG = {
// (Sem uso desde que o menu passou para a ordem alfabética — ver
// "arrange" mais abaixo. Fica aqui só como registro da ordem antiga.)
order: [
"editais",
"diario-dos-informativos",
"diario-das-decisoes",
"diario-de-leis",
"diario-das-sumulas",
"ranking-de-informativos",
"meus-grupos",
"meus-premios"
],

// Páginas que NÃO devem aparecer no menu (mesmo formato de "order").
hide: [],

// Nomes mais curtos para o menu (opcional). Formato: "endereco": "Nome".
// Sem entrada aqui, vale o título da página no Blogger.
labels: {},

// Texto/endereço do primeiro item (a página inicial). Use null para
// não mostrar.
home: { label: "In\u00edcio", href: "/" },

// Página inicial (endereço principal do site, sem nada depois da barra):
// mostra, inteira, a postagem de apresentação cujo número está em
// homePost (o número que aparece no endereço de edição da postagem no
// Blogger), com o menu em cima. Se ela não puder ser carregada (ex.:
// ainda é rascunho), a pessoa é levada para homePage. Com homePost: null,
// a inicial sempre leva direto para homePage.
homePost: "2209247404048971902",
homePage: "/p/diario-dos-informativos.html",

// Lista de segurança: só aparece se o Blogger não responder e ainda
// não houver cópia guardada no navegador. Não precisa manter em dia.
fallback: [
{ path: "/p/diario-dos-informativos.html", title: "Di\u00e1rio de Informativos" },
{ path: "/p/diario-de-leis.html", title: "Di\u00e1rio de Leis" },
{ path: "/p/diario-das-sumulas.html", title: "Di\u00e1rio das S\u00famulas" },
{ path: "/p/meus-grupos.html", title: "Meus Grupos" }
],

// Botões "A− A A+" flutuantes, para a pessoa aumentar ou reduzir a
// letra. Cada clique muda a escala (--fs-scale de estudamana-tokens.css)
// em "step", entre "min" e "max" (1 = tamanho padrão). A escolha fica
// salva no navegador. Use fontSize: null para esconder os botões.
// Aparecem em toda página de estudo (as mesmas onde o menu aparece) e
// em qualquer página com um elemento data-em-font.
fontSize: { min: 0.85, max: 1.5, step: 0.1 },

// "Me pague um café": um cartão no fim de toda página de estudo leva para
// a página de apoio do blog ("pagina"). Essa página, no Blogger, tem só
// <div id="estudamana-cafe"></div> — o texto e o botão são montados aqui.
// "botoes": um botão por link de pagamento (hoje, o link do Mercado Pago
// em que a pessoa escolhe o valor). Só aceita endereço https://; botão com
// link vazio não aparece. "plataforma" é o nome mostrado na página.
// Use cafe: null para tirar o cartão e a página.
cafe: {
pagina: "/p/me-pague-um-cafe.html",
plataforma: "Mercado Pago",
botoes: [
{ rotulo: "☕ Me pague um café", link: "https://link.mercadopago.com.br/estudamana" }
]
}
};

// ---- tamanho da letra -----------------------------------------------------
// Aplicado já aqui, antes de montar o menu, para a página não aparecer
// primeiro no tamanho padrão e depois "pular" para o tamanho escolhido.
var FONT_KEY = "estudamana-fonte";

function clampScale(v) {
var f = CONFIG.fontSize;
v = Math.round(v * 100) / 100;
return Math.min(f.max, Math.max(f.min, v));
}

function readScale() {
try {
var v = parseFloat(localStorage.getItem(FONT_KEY));
return isFinite(v) ? clampScale(v) : 1;
} catch (e) { return 1; }
}

function applyScale(v) {
var root = document.documentElement;
if (v === 1) root.style.removeProperty("--fs-scale");
else root.style.setProperty("--fs-scale", String(v));
}

var fontScale = CONFIG.fontSize ? readScale() : 1;
applyScale(fontScale);

function setScale(v) {
fontScale = clampScale(v);
applyScale(fontScale);
try {
if (fontScale === 1) localStorage.removeItem(FONT_KEY);
else localStorage.setItem(FONT_KEY, String(fontScale));
} catch (e) {}
updateFontButtons();
}

// ---- tema claro / escuro --------------------------------------------------
// Sem escolha salva, o site segue o sistema (estudamana-tokens.css usa
// prefers-color-scheme). O botão ☾/☀ ao lado de "A− A A+" grava a escolha
// em localStorage "estudamana-tema" e põe data-theme no <html>, que os
// tokens já respeitam. Aplicado aqui, antes do menu, para não piscar.
var THEME_KEY = "estudamana-tema";
function readTheme() {
try { var t = localStorage.getItem(THEME_KEY); return t === "dark" || t === "light" ? t : null; }
catch (e) { return null; }
}
function applyTheme(t) {
if (t) document.documentElement.setAttribute("data-theme", t);
else document.documentElement.removeAttribute("data-theme");
}
function currentTheme() {
var t = document.documentElement.getAttribute("data-theme");
if (t === "dark" || t === "light") return t;
try { return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"; }
catch (e) { return "light"; }
}
applyTheme(readTheme());
function updateThemeButton() {
var btn = fontBox && fontBox.querySelector("[data-theme-btn]");
if (!btn) return;
var dark = currentTheme() === "dark";
btn.textContent = dark ? "\u2600" : "\u263E";
btn.title = dark ? "Usar tema claro" : "Usar tema escuro";
btn.setAttribute("aria-label", btn.title);
}
function toggleTheme() {
var next = currentTheme() === "dark" ? "light" : "dark";
applyTheme(next);
try { localStorage.setItem(THEME_KEY, next); } catch (e) {}
updateThemeButton();
}

var fontBox = null;

function updateFontButtons() {
var f = CONFIG.fontSize;
if (!fontBox) return;
fontBox.querySelector("[data-font=down]").disabled = fontScale <= f.min;
fontBox.querySelector("[data-font=up]").disabled = fontScale >= f.max;
var reset = fontBox.querySelector("[data-font=reset]");
reset.disabled = fontScale === 1;
reset.title = "Tamanho padr\u00e3o da letra (agora: " + Math.round(fontScale * 100) + "%)";
}

function buildFontControls() {
var f = CONFIG.fontSize;
var box = document.createElement("div");
box.className = "em-font";
box.setAttribute("role", "group");
box.setAttribute("aria-label", "Tamanho da letra");

[
{ key: "down", text: "A\u2212", label: "Diminuir a letra", delta: -f.step },
{ key: "reset", text: "A", label: "Tamanho padr\u00e3o da letra", delta: 0 },
{ key: "up", text: "A+", label: "Aumentar a letra", delta: f.step }
].forEach(function (b) {
var btn = document.createElement("button");
btn.type = "button";
btn.className = "em-font__btn em-font__btn--" + b.key;
btn.textContent = b.text;
btn.title = b.label;
btn.setAttribute("aria-label", b.label);
btn.setAttribute("data-font", b.key);
btn.addEventListener("click", function () {
setScale(b.delta ? fontScale + b.delta : 1);
});
box.appendChild(btn);
});
var tb = document.createElement("button");
tb.type = "button";
tb.className = "em-font__btn em-font__btn--tema";
tb.setAttribute("data-theme-btn", "");
tb.addEventListener("click", toggleTheme);
box.appendChild(tb);
return box;
}

// Uma janela <dialog> aberta com showModal() fica numa camada acima de
// tudo e bloqueia o resto da página; nesse caso os botões entram nela
// enquanto estiver aberta, e voltam para o <body> quando ela fecha.
function placeFontControls() {
var open = null;
try { open = document.querySelector("dialog[open]:modal"); }
catch (e) { open = null; } // navegador antigo, sem :modal
var parent = open || document.body;
if (fontBox.parentNode !== parent) parent.appendChild(fontBox);
}

function isStudyPage() {
return !!(document.getElementById("estudamana-header") ||
document.querySelector(".page > header.masthead, header.top, [data-em-font]"));
}

function startFontControls() {
if (!CONFIG.fontSize || fontBox || !isStudyPage()) return;
fontBox = buildFontControls();
document.documentElement.classList.add("em-has-font");
placeFontControls();
updateFontButtons();
updateThemeButton();
try {
new MutationObserver(placeFontControls).observe(document.body, {
subtree: true, attributes: true, attributeFilter: ["open"]
});
} catch (e) {}
}

// ---- página inicial ---------------------------------------------------------
// É a inicial "de verdade" (e não busca, marcador, arquivo, pré-visualização)?
function ehInicial() {
try {
if (window.top !== window.self) return false;           // pré-visualização do Blogger
var p = location.pathname;
if (p !== "/" && p !== "/index.html") return false;
if (location.search && !/^\?m=[01]$/.test(location.search)) return false; // busca, marcadores, arquivo…
return !/[?&](q|view|updated-max|max-results|by-date)=/.test(location.search);
} catch (e) { return false; }
}

function irParaHomePage() {
if (CONFIG.homePage) location.replace(CONFIG.homePage + location.search);
}

var NA_INICIAL = ehInicial();

// Título repetido: o tema do Blogger mostra o título da página (o mesmo do
// menu) em cima do conteúdo, e as páginas de estudo já têm o próprio título
// (<h1>) dentro do conteúdo. Nessas páginas, o do Blogger fica escondido; o
// título continua valendo para o menu e para a aba do navegador.
(function esconderTituloRepetido() {
var TXT = function (el) { return (el.textContent || "").replace(/\s+/g, " ").trim().toLowerCase(); };
function aplicar() {
try {
var blogger = document.querySelector(".post-outer .post-title.entry-title");
var corpo = document.querySelector(".post-body");
if (!corpo) return;
var titulos = corpo.querySelectorAll("h1, h2");
if (!titulos.length) return;
// O título do próprio conteúdo é o primeiro <h1> (ou, sem <h1>, o <h2> que
// repete o título do Blogger). Marcado para ficar legível no modo escuro.
var meu = corpo.querySelector("h1");
var alvo = blogger ? TXT(blogger) : "";
if (!meu && alvo) {
for (var i = 0; i < titulos.length; i++) if (TXT(titulos[i]) === alvo) { meu = titulos[i]; break; }
}
if (!meu) return;
meu.classList.add("em-titulo-pagina");
// Some o título do Blogger e qualquer outro título do conteúdo com o
// mesmo texto (ex.: "Diário de Leis" aparecendo duas vezes).
var texto = TXT(meu);
if (blogger) blogger.style.setProperty("display", "none", "important");
Array.prototype.forEach.call(corpo.querySelectorAll("h1, h2, h3"), function (h) {
if (h !== meu && TXT(h) === texto) h.style.setProperty("display", "none", "important");
});
} catch (e) {}
}
// Roda já (o conteúdo pode já estar na página) e de novo quando ele termina
// de carregar — antes só rodava uma vez, cedo demais em algumas páginas.
var st = document.createElement("style");
st.textContent = ".post-outer .post-title.entry-title { display: none !important; }";
try { if (document.querySelector(".post-body h1")) document.head.appendChild(st); } catch (e) {}
aplicar();
if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", aplicar);
window.addEventListener("load", aplicar);
})();
// Na inicial, a lista de postagens do Blogger (que só mostraria um resumo
// da apresentação), o título "Postagens" e a paginação ficam escondidos
// desde já, para não piscarem antes da apresentação aparecer.
var estiloInicial = null;
if (NA_INICIAL && CONFIG.homePost) {
estiloInicial = document.createElement("style");
estiloInicial.textContent =
"#Blog1 .blog-posts, #Blog1 .blog-pager, .main-heading, #FeaturedPost1 { display: none !important; }";
document.head.appendChild(estiloInicial);
}

// Busca a postagem de apresentação inteira pelo feed do Blogger e a põe no
// lugar da lista de postagens (que só mostraria um resumo dela).
function mostrarApresentacao() {
var url = location.origin + "/feeds/posts/default/" + CONFIG.homePost + "?alt=json";
return fetch(url, { credentials: "omit" })
.then(function (r) {
if (!r.ok) throw new Error("apresentação " + r.status);
return r.json();
})
.then(function (json) {
var html = json && json.entry && json.entry.content && json.entry.content.$t;
if (!html) throw new Error("apresentação vazia");
var blog = document.getElementById("Blog1");
if (!blog) throw new Error("sem #Blog1");
var box = document.createElement("div");
box.className = "em-apresentacao";
// o lugar do menu na postagem não é preciso aqui: o menu já fica em cima
box.innerHTML = html.replace(/<div id="estudamana-header"><\/div>/g, "");
var nav = blog.querySelector("[data-em-header]");
blog.insertBefore(box, nav ? nav.nextSibling : blog.firstChild);
});
}

(function goHome() {
try {
if (!NA_INICIAL || !CONFIG.homePage) return;
if (CONFIG.homePost) return; // a apresentação é mostrada em start()
irParaHomePage();
} catch (e) {}
})();

var CACHE_KEY = "estudamana-menu-v1";

function slugOf(path) {
return String(path).replace(/^.*\//, "").replace(/\.html$/, "");
}

function normPath(path) {
return String(path).replace(/[?#].*$/, "").replace(/\/+$/, "") || "/";
}

// ---- cache (só uma conveniência: mostra o menu na hora) -------------
function readCache() {
try {
var raw = localStorage.getItem(CACHE_KEY);
var list = raw ? JSON.parse(raw) : null;
return Array.isArray(list) && list.length ? list : null;
} catch (e) { return null; }
}
function writeCache(list) {
try { localStorage.setItem(CACHE_KEY, JSON.stringify(list)); } catch (e) {}
}

// ---- feed do Blogger ------------------------------------------------
function parseFeed(json) {
var entries = (json && json.feed && json.feed.entry) || [];
return entries.map(function (e) {
var href = "";
(e.link || []).forEach(function (l) {
if (l.rel === "alternate") href = l.href;
});
var path = "";
try { path = new URL(href).pathname; } catch (err) { path = ""; }
return {
path: path,
title: (e.title && e.title.$t) || slugOf(path),
published: (e.published && e.published.$t) || ""
};
}).filter(function (p) { return p.path; });
}

function fetchPages() {
var url = location.origin + "/feeds/pages/default?alt=json&max-results=100";
return fetch(url, { credentials: "omit" })
.then(function (r) {
if (!r.ok) throw new Error("feed " + r.status);
return r.json();
})
.then(parseFeed);
}

// ---- ordenação e filtros -------------------------------------------
function arrange(pages) {
var hide = {};
CONFIG.hide.forEach(function (s) { hide[s] = true; });
var visible = pages.filter(function (p) { return !hide[slugOf(p.path)]; });

// Ordem alfabética pelo nome que aparece no menu (sem diferenciar
// acentos nem maiúsculas). "Início" fica sempre na frente (ver "home").
// A lista "order" acima não é mais usada para ordenar.
var collator = new Intl.Collator("pt-BR", { sensitivity: "base" });
function labelOf(p) { return CONFIG.labels[slugOf(p.path)] || p.title || ""; }
// "Me pague um café" fica sempre por último (pelo endereço de CONFIG.cafe
// ou pelo título, caso o Blogger tenha dado outro endereço à página).
function ehCafe(p) {
return !!((CONFIG.cafe && slugOf(p.path) === slugOf(CONFIG.cafe.pagina)) || /pague um caf/i.test(p.title || ""));
}
return visible.sort(function (a, b) {
return (ehCafe(a) - ehCafe(b)) || collator.compare(labelOf(a), labelOf(b));
});
}

// ---- montagem do cabeçalho -----------------------------------------
function buildNav(pages) {
var current = normPath(location.pathname);
var nav = document.createElement("nav");
nav.className = "em-header";
nav.setAttribute("aria-label", "P\u00e1ginas do Estuda Mana");
nav.setAttribute("data-em-header", "");

var ul = document.createElement("ul");
ul.className = "em-header__list";

function addItem(label, href, isCurrent) {
var li = document.createElement("li");
var a = document.createElement("a");
a.className = "em-header__link";
a.textContent = label;
a.href = href;
if (isCurrent) {
a.setAttribute("aria-current", "page");
a.classList.add("is-current");
}
li.appendChild(a);
ul.appendChild(li);
}

if (CONFIG.home) {
addItem(CONFIG.home.label, CONFIG.home.href, current === normPath(CONFIG.home.href));
}
arrange(pages).forEach(function (p) {
var label = CONFIG.labels[slugOf(p.path)] || p.title;
addItem(label, p.path, current === normPath(p.path));
});

nav.appendChild(ul);
return nav;
}

// Onde encaixar: 1) um <div id="estudamana-header"> se a página tiver;
// 2) o começo do ".page" (Diários, Ranking, Meus Grupos);
// 3) antes do "header.top" (RG e Repetitivos); 4) na página inicial.
function mount(nav) {
var old = document.querySelector("[data-em-header]");
if (old) {
nav.className = old.className; // mantém a posição (reading/wide)
old.parentNode.replaceChild(nav, old);
return;
}

var slot = document.getElementById("estudamana-header");
// O tema do Blogger também tem um ".page" (a página inteira); o que nos
// interessa é o ".page" dos Diários, que tem o "header.masthead" dentro.
var mast = document.querySelector(".page > header.masthead");
var page = mast ? mast.parentNode : null;
var top = document.querySelector("header.top");
if (slot) {
slot.appendChild(nav);
} else if (page) {
nav.classList.add("em-header--reading");
page.insertBefore(nav, page.firstChild);
} else if (top && top.parentNode) {
nav.classList.add("em-header--wide");
top.parentNode.insertBefore(nav, top);
} else if (normPath(location.pathname) === "/" && document.getElementById("Blog1")) {
// Página inicial do Blogger (sem postagens): o menu vira a navegação
// da home, dentro da área de conteúdo do tema.
var blog = document.getElementById("Blog1");
nav.classList.add("em-header--reading");
blog.insertBefore(nav, blog.firstChild);
}
// Sem nenhum desses encaixes, a página não é uma das páginas de
// estudo (ex.: página inicial ou posts do blog) e o menu não aparece.
// É isso que permite colocar este script uma única vez no tema.
}

// ---- CSS do cabeçalho -----------------------------------------------
// Endereço dos arquivos: a pasta deste script, quando ele foi carregado
// por <script src>; senão (carregado por fetch), o jsDelivr.
var CDN_BASE = "https://cdn.jsdelivr.net/gh/barbarasinfronio-lgtm/diario-informativos@main/";

function assetBase() {
var script = document.currentScript;
if (!script) {
var all = document.getElementsByTagName("script");
for (var i = 0; i < all.length; i++) {
if (/estudamana-header\.js/.test(all[i].src)) { script = all[i]; break; }
}
}
return script && script.src
? script.src.replace(/estudamana-header\.js(\?.*)?$/, "")
: CDN_BASE;
}

// Busca os CSS com "no-cache" (o navegador confere com o servidor se o
// arquivo mudou; se não mudou, a resposta é mínima) e põe numa <style>.
// O @import do tokens é trocado pelo conteúdo do próprio tokens, que
// também vem sempre atualizado. Se o fetch falhar, volta ao <link>.
function loadStyles() {
if (document.querySelector("[data-em-header-css]")) return;
var base = assetBase();
var style = document.createElement("style");
style.setAttribute("data-em-header-css", "");
document.head.appendChild(style);

function get(file) {
return fetch(base + file, { cache: "no-cache" }).then(function (r) {
if (!r.ok) throw new Error(file + " " + r.status);
return r.text();
});
}

Promise.all([get("estudamana-tokens.css"), get("estudamana-header.css")])
.then(function (css) {
style.textContent = css.map(function (t) {
return t.replace(/@import\s+url\(["']?estudamana-tokens\.css["']?\)\s*;?/g, "");
}).join("\n");
})
.catch(function () {
var link = document.createElement("link");
link.rel = "stylesheet";
link.href = base + "estudamana-header.css";
link.setAttribute("data-em-header-css", "");
style.parentNode.replaceChild(link, style);
});
}

function signature(list) {
return list.map(function (p) { return p.path + "|" + p.title; }).join("\n");
}

// ---- "Me pague um café" ------------------------------------------------------
// Cartão no fim das páginas de estudo + conteúdo da página de apoio. O link
// de doação fica só aqui no código (no GitHub), nunca em imagem ou texto
// copiável de chave Pix — ninguém consegue trocá-lo por outro.
function cafeEsc(t) {
return String(t).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; });
}
function linkSeguro(u) {
return /^https:\/\/[^\s"<>]+$/.test(u || "") ? u : "";
}
function cafePagina(alvo) {
var cfg = CONFIG.cafe;
var botoes = (cfg.botoes || []).filter(function (b) { return linkSeguro(b.link); });
var hosts = [];
botoes.forEach(function (b) {
var h = b.link.replace(/^https:\/\/([^\/]+).*$/, "$1");
if (hosts.indexOf(h) === -1) hosts.push(h);
});
var host = hosts.join(" ou ");
alvo.className = "em-cafe-page";
alvo.innerHTML =
'<p class="em-cafe-lede">\u2615 Todas as ferramentas do Estuda Mana \u2014 os Di\u00e1rios, os editais mapeados, os grupos de estudo, os pr\u00eamios \u2014 s\u00e3o <strong>gratuitas</strong> e continuam gratuitas para todo mundo.</p>' +
'<p>Manter tudo funcionando d\u00e1 trabalho: atualizar os informativos toda semana, conferir as leis alteradas, mapear editais novos e pagar os servi\u00e7os que guardam o seu progresso. Se o site ajuda nos seus estudos e voc\u00ea quiser contribuir, qualquer valor \u00e9 muito bem-vindo \u2014 e totalmente opcional.</p>' +
(botoes.length
? '<p class="em-cafe-acao">' + botoes.map(function (b) {
return '<a class="em-cafe-btn" href="' + cafeEsc(b.link) + '" target="_blank" rel="noopener noreferrer">' + cafeEsc(b.rotulo) + "</a>";
}).join(" ") + '</p><p class="em-cafe-nota">Você escolhe o valor e paga numa página segura' + (cfg.plataforma ? " do " + cafeEsc(cfg.plataforma) : "") + ', por Pix ou cartão.</p>' 
: '<p class="em-cafe-acao em-cafe-embreve">O botão de apoio estará aqui em breve.</p>') +
'<div class="em-cafe-seguranca"><p><strong>\uD83D\uDD12 Para sua seguran\u00e7a</strong></p><ul>' +
'<li>O \u00fanico jeito oficial de apoiar \u00e9 o bot\u00e3o acima' + (host ? ', que abre <strong>' + cafeEsc(host) + '</strong>' + (cfg.plataforma ? " (" + cafeEsc(cfg.plataforma) + ")" : "") : "") + '. Confira o endere\u00e7o antes de pagar.</li>' +
'<li>O Estuda Mana <strong>nunca</strong> pede doa\u00e7\u00e3o por WhatsApp, e-mail, direct ou coment\u00e1rio, nem divulga chave Pix ou QR Code em imagem. Se receber um pedido assim, \u00e9 golpe.</li>' +
'<li>Doar n\u00e3o d\u00e1 acesso a nada a mais: o site \u00e9 igual para todos.</li>' +
'</ul></div>' +
'<p class="em-cafe-obrigado">Obrigada por estudar com a gente! \uD83D\uDC9B</p>';
}
function cafeRodape() {
var cfg = CONFIG.cafe;
if (!cfg || !isStudyPage() || document.querySelector(".em-cafe-card")) return;
if (normPath(location.pathname) === normPath(cfg.pagina)) return;
var onde = document.querySelector(".post-body") || document.querySelector("main") || document.body;
var card = document.createElement("aside");
card.className = "em-cafe-card";
card.innerHTML = '<span class="em-cafe-icone" aria-hidden="true">\u2615</span>' +
'<p><strong>Gostou do Estuda Mana?</strong> Todas as ferramentas s\u00e3o gratuitas. Se quiser ajudar a manter o site no ar, ' +
'<a href="' + cafeEsc(cfg.pagina) + '">me pague um caf\u00e9</a>.</p>';
onde.appendChild(card);
}
function startCafe() {
if (!CONFIG.cafe) return;
var alvo = document.getElementById("estudamana-cafe");
if (alvo) cafePagina(alvo);
cafeRodape();
}

function start() {
var shown = readCache() || CONFIG.fallback;
mount(buildNav(shown));
startFontControls();
startCafe();

if (NA_INICIAL && CONFIG.homePost) {
mostrarApresentacao().catch(function () {
if (estiloInicial) estiloInicial.remove();
irParaHomePage();
});
}

fetchPages().then(function (fresh) {
if (!fresh.length) return;
if (signature(fresh) !== signature(shown)) {
mount(buildNav(fresh));
}
writeCache(fresh);
}).catch(function () { /* mantém o que já está na tela */ });
}

loadStyles();
if (document.readyState === "loading") {
document.addEventListener("DOMContentLoaded", start);
} else {
start();
}
})();
