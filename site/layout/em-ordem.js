/*
 * em-ordem.js — "Organizar por": a pessoa escolhe como quer ver a lista (mais recentes, mais cobradas em prova,
 * ordem alfabética, não lidas primeiro…). Um só componente para todos os diários; cada página diz quais opções
 * fazem sentido para o seu conteúdo e como comparar duas linhas.
 *
 *   EstudaManaOrdem.ligar({
 *     depois: <elemento perto do qual o campo entra (o filtro anterior)>,
 *     chave: "sumulas",                     // a escolha fica lembrada neste navegador (localStorage "estudamana-ordem:sumulas")
 *     opcoes: [{ id: "num-desc", rotulo: "Mais recentes primeiro" }, …],
 *     padrao: "num-desc",
 *     aoMudar: function (id) { … }          // a página reordena e redesenha
 *   })  →  { valor(), definir(id), campo }
 *
 *   EstudaManaOrdem.cmp.texto(a, b)         // alfabética em português (sem ligar para acento/maiúscula; "2" antes de "10")
 *   EstudaManaOrdem.cmp.numero(a, b)        // números (não números vão para o fim)
 */
(function () {
  "use strict";
  if (window.EstudaManaOrdem) return;
  var LS = "estudamana-ordem:";

  function ler(chave) { try { return localStorage.getItem(LS + chave); } catch (e) { return null; } }
  function gravar(chave, v) { try { localStorage.setItem(LS + chave, v); } catch (e) {} }

  var st = document.createElement("style");
  st.setAttribute("data-em-ordem", "");
  st.textContent =
    ".em-ordem-campo{display:inline-flex;flex-direction:column;gap:.25rem;font-size:calc(.78rem * var(--fs-scale,1));color:var(--ink-soft,#5a6270);font-family:inherit}" +
    ".em-ordem-campo select{font:inherit;font-size:calc(.9rem * var(--fs-scale,1));min-width:13rem;max-width:100%;padding:.45rem .6rem;color:var(--ink,#1c2130);" +
    "background:var(--surface,#fff);border:1px solid var(--surface-line,#cbd5e1);border-radius:var(--radius,8px);cursor:pointer}" +
    ".em-ordem-campo select:focus-visible{outline:2px solid var(--focus,var(--accent,#2f6fd6));outline-offset:2px}";
  (document.head || document.documentElement).appendChild(st);

  var cmp = {
    texto: function (a, b) { return String(a == null ? "" : a).localeCompare(String(b == null ? "" : b), "pt-BR", { sensitivity: "base", numeric: true }); },
    numero: function (a, b) {
      var x = parseFloat(a), y = parseFloat(b), nx = isNaN(x), ny = isNaN(y);
      if (nx && ny) return 0;
      if (nx) return 1;
      if (ny) return -1;
      return x - y;
    }
  };

  function ligar(o) {
    var salvo = ler(o.chave);
    var atual = o.opcoes.some(function (x) { return x.id === salvo; }) ? salvo : (o.padrao || o.opcoes[0].id);
    var campo = document.createElement("label");
    campo.className = "avatar-field em-ordem-campo";
    campo.appendChild(document.createTextNode("Organizar por"));
    var sel = document.createElement("select");
    sel.setAttribute("data-em-ordem-select", o.chave);
    o.opcoes.forEach(function (x) {
      var op = document.createElement("option");
      op.value = x.id;
      op.textContent = x.rotulo;
      sel.appendChild(op);
    });
    sel.value = atual;
    sel.addEventListener("change", function () {
      atual = sel.value;
      gravar(o.chave, atual);
      if (o.aoMudar) o.aoMudar(atual);
    });
    campo.appendChild(sel);
    var ancora = o.depois && (o.depois.closest ? o.depois.closest("label,.avatar-field") || o.depois : o.depois);
    if (ancora && ancora.parentNode) ancora.parentNode.insertBefore(campo, ancora.nextSibling);
    return {
      campo: campo,
      valor: function () { return atual; },
      definir: function (id) { if (o.opcoes.some(function (x) { return x.id === id; })) { atual = id; sel.value = id; gravar(o.chave, id); } }
    };
  }

  window.EstudaManaOrdem = { ligar: ligar, cmp: cmp };
})();
