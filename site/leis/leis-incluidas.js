/*
 * leis-incluidas.js — leis e resoluções que a pessoa incluiu no próprio
 * Diário de Leis (as que aparecem como "Fora dos Diários" nos cards das
 * Decisões ou como "fora do Diário de Leis" nos Editais).
 *
 * Só para quem entrou com Google ou e-mail e senha: fica salvo na conta, no
 * campo "incluidas" do documento progress-leis/<uid> (o mesmo do Diário de
 * Leis, então não precisa de regra nova no Firestore), e numa cópia neste
 * navegador ("leis-incluidas"). A leitura de cada uma é marcada no Diário de
 * Leis como as outras leis (mapa "leis-lidas", chave "extra:<rótulo>").
 *
 * Cada lei incluída guarda o edital principal da pessoa naquele momento:
 * ela aparece junto desse edital; sem edital escolhido, entra em
 * "Leis importantes para jurisprudência".
 *
 * Uso:
 *   LeisIncluidas.chave("Lei nº 12.973/2014")    -> "extra:lei-no-12-973-2014"
 *   LeisIncluidas.logado(), .lista(), .tem(chave), .lida(chave)
 *   LeisIncluidas.incluir({ rotulo, nome, href }) -> Promise
 *   LeisIncluidas.remover(chave)                  -> Promise
 *   LeisIncluidas.titulo(editalId)                -> "Edital TJSP — …" | "Leis importantes para jurisprudência"
 *   LeisIncluidas.onChange(fn)
 */
(function () {
  "use strict";
  if (window.LeisIncluidas) return;

  var LOCAL = "leis-incluidas";
  var SEM_EDITAL = "Leis importantes para jurisprudência";
  var mapa = lerLocal();          // chave -> { rotulo, nome, href, edital, em, atualizado, removida? }
  var ouvintes = [];
  var usuario = null, docRef = null, editalConta = "";

  function lerJson(k, padrao) {
    try { var raw = localStorage.getItem(k); return raw ? JSON.parse(raw) : padrao; } catch (e) { return padrao; }
  }
  function lerLocal() { var m = lerJson(LOCAL, {}); return m && typeof m === "object" ? m : {}; }
  function gravarLocal() { try { localStorage.setItem(LOCAL, JSON.stringify(mapa)); } catch (e) {} }
  // só avisa quando algo visível mudou (a lista ou o login) — o documento da
  // conta também muda a cada leitura marcada, e isso não deve redesenhar nada
  var ultima = null;
  function avisar(forcar) {
    var agora = JSON.stringify([logado(), lista()]);
    if (!forcar && agora === ultima) return;
    ultima = agora;
    ouvintes.slice().forEach(function (fn) { try { fn(); } catch (e) {} });
  }

  function slug(t) {
    return String(t || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  }
  function chave(rotulo) { return "extra:" + slug(rotulo); }

  // junta a conta com este navegador: em cada lei vale a mudança mais recente
  // (inclusive a remoção, que fica marcada como "removida")
  function juntar(remoto) {
    var mudou = false;
    Object.keys(remoto || {}).forEach(function (k) {
      var r = remoto[k], l = mapa[k];
      if (r && (!l || (r.atualizado || "") > (l.atualizado || ""))) { mapa[k] = r; mudou = true; }
    });
    return mudou;
  }

  function logado() { return !!(usuario && !usuario.isAnonymous); }

  function editalPrincipal() {
    var id = "";
    try { id = localStorage.getItem("editais-principal") || ""; } catch (e) {}
    return id || editalConta || "";
  }

  function lista() {
    return Object.keys(mapa).filter(function (k) { return mapa[k] && !mapa[k].removida; })
      .map(function (k) { var o = mapa[k]; return { chave: k, rotulo: o.rotulo, nome: o.nome || "", href: o.href || "", edital: o.edital || "", em: o.em || "" }; })
      .sort(function (a, b) { return a.rotulo.localeCompare(b.rotulo, "pt-BR", { numeric: true }); });
  }

  function tem(k) { return !!(mapa[k] && !mapa[k].removida); }

  function lida(k) {
    var v = lerJson("leis-lidas", {})[k];
    return !!(v && v.lida);
  }

  function titulo(editalId) {
    if (!editalId) return SEM_EDITAL;
    var eds = window.EDITAIS_DATA || [];
    for (var i = 0; i < eds.length; i++) {
      var e = eds[i];
      if (e.id === editalId) return e.tipo === "carreira" ? e.titulo : (e.sigla + " — " + e.titulo);
    }
    return "Edital principal";
  }

  function gravarConta(k) {
    if (!docRef) return Promise.reject(new Error("sem conta"));
    var campo = {}; campo[k] = mapa[k];
    return docRef.set({ incluidas: campo, updatedAt: new Date().toISOString() }, { merge: true });
  }

  function incluir(norma) {
    if (!logado()) return Promise.reject(new Error("entrar"));
    var k = chave(norma.rotulo);
    var agora = new Date().toISOString();
    mapa[k] = { rotulo: norma.rotulo, nome: norma.nome || "", href: norma.href || "", edital: editalPrincipal(),
                em: agora.slice(0, 10), atualizado: agora };
    gravarLocal(); avisar();
    return gravarConta(k);
  }

  function remover(k) {
    if (!logado() || !mapa[k]) return Promise.resolve();
    mapa[k] = Object.assign({}, mapa[k], { removida: true, atualizado: new Date().toISOString() });
    gravarLocal(); avisar();
    return gravarConta(k);
  }

  // liga à conta quando o Firebase da página estiver pronto (cada página o
  // carrega do seu jeito, às vezes depois deste arquivo)
  var tentativas = 0;
  function ligar() {
    if (!(window.firebase && firebase.apps && firebase.apps.length && firebase.auth && firebase.firestore)) {
      if (tentativas++ < 60) setTimeout(ligar, 500);
      return;
    }
    var off = null;
    firebase.auth().onAuthStateChanged(function (user) {
      usuario = user || null;
      if (off) { off(); off = null; }
      docRef = null;
      if (logado()) {
        docRef = firebase.firestore().doc("progress-leis/" + user.uid);
        off = docRef.onSnapshot(function (snap) {
          var d = snap.exists ? (snap.data() || {}) : {};
          if (typeof d.edital === "string") editalConta = d.edital;
          if (juntar(d.incluidas)) gravarLocal();
          // o que só este navegador tinha (feito antes de a conta responder) sobe
          Object.keys(mapa).forEach(function (k) {
            var r = d.incluidas && d.incluidas[k];
            if (!r || (mapa[k].atualizado || "") > (r.atualizado || "")) gravarConta(k).catch(function () {});
          });
          avisar();
        }, function () {});
      }
      avisar();
    });
  }
  ligar();

  // a leitura é marcada em outra aba (Diário de Leis): ao voltar, atualiza
  window.addEventListener("storage", function (e) {
    if (e.key === LOCAL) { mapa = lerLocal(); avisar(); }
    else if (e.key === "leis-lidas") avisar(true);
  });

  window.LeisIncluidas = {
    chave: chave, logado: logado, lista: lista, tem: tem, lida: lida, titulo: titulo,
    incluir: incluir, remover: remover, SEM_EDITAL: SEM_EDITAL,
    onChange: function (fn) { ouvintes.push(fn); }
  };
})();
