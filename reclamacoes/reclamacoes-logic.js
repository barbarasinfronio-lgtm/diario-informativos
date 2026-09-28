(function () {
  const STORAGE_KEY = "em_lidos_reclamacoes";
  let lidos = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  let loteTamanho = 10;
  let loteAtual = 0;
  let filtroTribunal = "todos";
  let filtroAno = "todos";

  // ---- dados: um arquivo por ano ----------------------------------------
  // (A página do Blogger não carrega mais o arquivo grande: tudo vem daqui.)
  // O arquivo grande (reclamacoes-data.js) é dividido em reclamacoes/anos/
  // pelo scripts/dividir_por_ano.py: index.json (quantos itens por ano e por
  // tribunal) + um AAAA.json por ano. A página carrega o índice e depois só os
  // anos que precisa mostrar, com "no-cache" (o navegador só baixa de novo
  // o que mudou). Se a página ainda carregar o arquivo inteiro, usa ele.
  const BASE_ANOS = "https://cdn.jsdelivr.net/gh/barbarasinfronio-lgtm/diario-informativos@main/reclamacoes/anos/";
  const URL_STF = "https://portal.stf.jus.br/processos/detalhe.asp?processo=";
  const legado = window.RECLAMACOES_DATA;

  let indice = null;      // { total, anos: [{ ano, total, grupos: { STF: n, ... } }] }
  const carregados = {};  // "2026" -> itens daquele ano
  const pedidos = {};     // "2026" -> fetch em andamento

  function anoDaData(d) {
    const m = /^(\d{4})-\d{2}-\d{2}$/.exec(String(d || ""));
    return m ? m[1] : "sem-ano";
  }

  function montarIndiceLegado(lista) {
    const anos = {};
    lista.forEach((it) => {
      const ano = anoDaData(it.dataJulgamento);
      const a = anos[ano] || (anos[ano] = { ano: ano, total: 0, grupos: {} });
      a.total++;
      a.grupos[it.tribunal] = (a.grupos[it.tribunal] || 0) + 1;
      (carregados[ano] || (carregados[ano] = [])).push(it);
    });
    const chaves = Object.keys(anos).filter((k) => k !== "sem-ano").sort().reverse();
    if (anos["sem-ano"]) chaves.push("sem-ano");
    return { total: lista.length, anos: chaves.map((k) => anos[k]) };
  }

  function buscarJson(nome) {
    return fetch(BASE_ANOS + nome, { cache: "no-cache" }).then((r) => {
      if (!r.ok) throw new Error(nome + " " + r.status);
      return r.json();
    });
  }

  function carregarIndice() {
    if (Array.isArray(legado)) {
      indice = montarIndiceLegado(legado);
      return Promise.resolve();
    }
    return buscarJson("index.json").then((idx) => { indice = idx; });
  }

  function carregarAno(ano) {
    if (carregados[ano]) return Promise.resolve();
    if (!pedidos[ano]) {
      pedidos[ano] = buscarJson(ano + ".json")
        .then((lista) => { carregados[ano] = lista; })
        .catch((e) => { delete pedidos[ano]; throw e; });
    }
    return pedidos[ano];
  }

  function anosRelevantes() {
    return indice.anos.filter((a) => filtroAno === "todos" || a.ano === String(filtroAno));
  }


  // ---- busca (a mesma do Diário das Decisões) ---------------------------
  // Caixa criada aqui, logo acima da lista (sem mexer no HTML do Blogger).
  // Não diferencia maiúsculas nem acentos; cada palavra digitada precisa
  // aparecer no item. Os contadores de progresso não mudam com a busca.
  var termosBusca = [];
  var listRoot = null;
  var buscaInfo = null;

  function semAcentoBusca(t) {
    return String(t == null ? "" : t).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  }
  // Singular e plural contam igual: "execucao" acha "execuções", "fiscal"
  // acha "fiscais", "lei" acha "leis".
  var PLURAIS = [["coes", "cao"], ["cao", "coes"], ["oes", "ao"], ["ao", "oes"], ["ais", "al"], ["al", "ais"], ["eis", "el"], ["el", "eis"], ["s", ""]];
  function variantes(t) {
    var v = [t];
    PLURAIS.forEach(function (r) {
      if (t.length > 3 && t.slice(-r[0].length) === r[0]) v.push(t.slice(0, t.length - r[0].length) + r[1]);
    });
    return v;
  }
  function combinaBusca(texto) {
    if (!termosBusca.length) return true;
    var h = semAcentoBusca(texto);
    return termosBusca.every(function (t) {
      return variantes(t).some(function (x) { return h.indexOf(x) !== -1; });
    });
  }
  function mostrarResultadoBusca(n, rotulo) {
    if (!buscaInfo) return;
    buscaInfo.hidden = !termosBusca.length;
    buscaInfo.textContent = n === 1 ? "1 resultado" : n + " resultados";
  }
  function criarBusca(placeholder, aoMudar) {
    listRoot = document.getElementById("list-root");
    if (!listRoot || !listRoot.parentNode) return;
    var box = document.createElement("div");
    box.className = "busca-diario";
    box.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" aria-hidden="true"><circle cx="11" cy="11" r="7"></circle><path d="m21 21-4.3-4.3"></path></svg>' +
      '<input type="search" autocomplete="off">' +
      '<button type="button" class="busca-limpar" hidden>Limpar</button>';
    var input = box.querySelector("input");
    var limpar = box.querySelector(".busca-limpar");
    input.placeholder = placeholder;
    input.setAttribute("aria-label", placeholder);
    buscaInfo = document.createElement("p");
    buscaInfo.className = "busca-resultado";
    buscaInfo.hidden = true;
    function mudou() {
      limpar.hidden = !input.value;
      termosBusca = semAcentoBusca(input.value).split(/\s+/).filter(Boolean);
      aoMudar();
    }
    input.addEventListener("input", mudou);
    limpar.addEventListener("click", function () { input.value = ""; mudou(); input.focus(); });
    listRoot.parentNode.insertBefore(box, listRoot);
    listRoot.parentNode.insertBefore(buscaInfo, listRoot);
  }

  // Texto em que a busca procura.
  function textoBusca(item) {
    return [item.processo, item.relator, item.ramo, item.tipo, formatarData(item.dataJulgamento), item.dataJulgamento, limparTexto(item.resumo)].join(" ");
  }

  // comBusca = false: só os filtros do topo (base dos contadores de progresso).
  function combina(item, comBusca) {
    return (filtroTribunal === "todos" || item.tribunal === filtroTribunal) && (!comBusca || combinaBusca(textoBusca(item)));
  }

  // Total do filtro do topo, sem a busca (base dos contadores de progresso).
  function totalSemBusca() {
    return anosRelevantes().reduce((s, a) =>
      s + (filtroTribunal === "todos" ? a.total : (a.grupos[filtroTribunal] || 0)), 0);
  }

  function totalFiltrado() {
    // Com busca, o total só se sabe depois de carregar todos os anos.
    if (termosBusca.length) return filtradosCarregados(true).length;
    return totalSemBusca();
  }

  // Itens já carregados, na ordem da lista (para no primeiro ano que falta).
  function filtradosCarregados(comBusca) {
    const out = [];
    for (const a of anosRelevantes()) {
      if (!carregados[a.ano]) break;
      carregados[a.ano].forEach((it) => { if (combina(it, comBusca)) out.push(it); });
    }
    return out;
  }

  async function garantir(quantos) {
    for (const a of anosRelevantes()) {
      if (filtradosCarregados(true).length >= quantos) return;
      await carregarAno(a.ano);
    }
  }

  // Lidos dentro do filtro. Com todos os anos do filtro carregados, conta
  // pelos itens; senão (só acontece em "Todos os Anos"), pelo código do
  // processo, que começa pelo tribunal (ex.: "STF_Rcl_100475").
  function contarLidos() {
    const rel = anosRelevantes();
    if (rel.every((a) => carregados[a.ano])) {
      return filtradosCarregados(false).filter((d) => lidos[d.id]).length;
    }
    return Object.keys(lidos).filter((id) =>
      filtroTribunal === "todos" || id.split("_")[0] === filtroTribunal).length;
  }

  // ---- tratamento dos textos vindos do STF ------------------------------
  // Os textos vêm de planilhas/raspagem e trazem sujeira: "_x000D_" (quebra
  // de linha do Excel), quebras e espaços repetidos, e cortes no meio da
  // frase (o resumo é limitado a LIMITE_TEXTO letras). Tudo é tratado aqui,
  // na hora de mostrar, para valer também quando os dados forem trocados.
  const LIMITE_TEXTO = 320;

  function limparTexto(t) {
    const original = String(t == null ? "" : t);
    let s = original
      .replace(/_x([0-9A-Fa-f]{4})_/g, (m, hex) => String.fromCharCode(parseInt(hex, 16)))
      .replace(/">\.\./g, '"...')
      .replace(/[\s ]+/g, " ")
      .trim();
    if (/^sem descri[cç][aã]o$/i.test(s)) return "";
    // Cortado no limite: termina na última palavra inteira, com "…".
    if (original.length >= LIMITE_TEXTO - 5 && !/[.!?…"”)]$/.test(s)) {
      s = s.replace(/\s+\S*$/, "").replace(/[,;:\s]+$/, "");
      s += /[.!?]$/.test(s) ? " …" : "…";
    }
    return s;
  }

  // Todo texto entra na página escapado: um "<" ou "&" no resumo aparece
  // como texto, em vez de ser lido como código HTML.
  function escapeHtml(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, (c) => (
      { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]
    ));
  }

  // Só aceita links http(s); qualquer outra coisa vira um link vazio.
  function safeUrl(u) {
    const s = String(u || "");
    if (!/^https?:\/\//i.test(s)) return "#";
    try { return encodeURI(decodeURI(s)); } catch (e) { return encodeURI(s); }
  }

  // "2026-09-25" -> "25/09/2026". Sem data válida, devolve "".
  function formatarData(d) {
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(d || ""));
    return m ? `${m[3]}/${m[2]}/${m[1]}` : "";
  }

  function aviso(root, texto) {
    root.innerHTML = '<p class="group-note" style="text-align:center;padding:24px;">' + escapeHtml(texto) + "</p>";
  }

  function init() {
    criarBusca("Buscar por processo, relator ou palavra (ex.: Rcl 100475, terceirização)", function () { loteAtual = 0; render(); });
    bindEvents();
    render();
    carregarIndice()
      .then(() => { popularFiltroAno(); render(); })
      .catch(() => {
        const root = document.getElementById("list-root");
        if (root) aviso(root, "Não foi possível carregar as reclamações. Recarregue a página.");
      });
  }

  function popularFiltroAno() {
    const sel = document.getElementById("ano-select");
    if (!sel) return;
    indice.anos.filter((a) => a.ano !== "sem-ano").forEach((a) => {
      const opt = document.createElement("option");
      opt.value = a.ano;
      opt.textContent = a.ano;
      sel.appendChild(opt);
    });
  }

  function bindEvents() {
    const selTrib = document.getElementById("tribunal-select");
    const selAno = document.getElementById("ano-select");
    if (selTrib) {
      selTrib.addEventListener("change", (e) => {
        filtroTribunal = e.target.value;
        loteAtual = 0;
        render();
      });
    }
    if (selAno) {
      selAno.addEventListener("change", (e) => {
        filtroAno = e.target.value;
        loteAtual = 0;
        render();
      });
    }

    document.querySelectorAll("#lote-toggle .lote-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        document.querySelectorAll("#lote-toggle .lote-btn").forEach((b) => b.classList.remove("is-active"));
        btn.classList.add("is-active");
        loteTamanho = parseInt(btn.dataset.loteSize, 10);
        loteAtual = 0;
        render();
      });
    });

    const btnPrev = document.getElementById("lote-prev");
    const btnNext = document.getElementById("lote-next");
    if (btnPrev) {
      btnPrev.addEventListener("click", () => {
        if (loteAtual > 0) {
          loteAtual--;
          render();
        }
      });
    }
    if (btnNext) {
      btnNext.addEventListener("click", () => {
        loteAtual++;
        render();
      });
    }
  }

  function alternarLeitura(id) {
    if (lidos[id]) {
      delete lidos[id];
    } else {
      lidos[id] = new Date().toISOString();
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lidos));
    render();
  }

  let renderSeq = 0;

  async function render() {
    const root = document.getElementById("list-root");
    if (!root) return;
    const seq = ++renderSeq;

    if (!indice) {
      aviso(root, "Carregando reclamações…");
      return;
    }

    // Busca: carrega todos os anos do filtro antes (o índice não sabe o texto).
    if (termosBusca.length && !anosRelevantes().every((a) => carregados[a.ano])) {
      aviso(root, "Buscando em todos os anos…");
      try {
        await Promise.all(anosRelevantes().map((a) => carregarAno(a.ano)));
      } catch (e) {
        if (seq === renderSeq) aviso(root, "Não foi possível carregar todos os anos para a busca. Tente de novo.");
        return;
      }
      if (seq !== renderSeq) return;
    }

    const totalItens = totalFiltrado();
    mostrarResultadoBusca(totalItens, ["reclamação", "reclamações"]);
    const inicio = loteAtual * loteTamanho;
    const fim = Math.min(inicio + loteTamanho, totalItens);

    // Busca os anos que faltam para mostrar este lote.
    if (filtradosCarregados(true).length < fim) {
      aviso(root, "Carregando reclamações…");
      try {
        await garantir(fim);
      } catch (e) {
        if (seq === renderSeq) aviso(root, "Não foi possível carregar as reclamações. Recarregue a página.");
        return;
      }
      if (seq !== renderSeq) return; // outro filtro foi escolhido enquanto carregava
    }

    const lidosCount = contarLidos();

    // Atualiza contadores
    document.getElementById("stat-count").textContent = lidosCount;
    const totalBase = totalSemBusca();
    document.getElementById("stat-total").textContent = totalBase;
    const pct = totalBase > 0 ? Math.round((lidosCount / totalBase) * 100) : 0;
    document.getElementById("stat-pct").textContent = pct + "%";
    document.getElementById("progress-fill").style.width = pct + "%";

    // Paginação
    const pagina = filtradosCarregados(true).slice(inicio, fim);

    const lbl = document.getElementById("lote-label");
    if (lbl) {
      lbl.textContent = totalItens > 0 ? `${inicio + 1}–${fim} de ${totalItens}` : "0 de 0";
    }

    const btnPrev = document.getElementById("lote-prev");
    const btnNext = document.getElementById("lote-next");
    if (btnPrev) btnPrev.disabled = loteAtual === 0;
    if (btnNext) btnNext.disabled = fim >= totalItens;

    root.innerHTML = "";

    if (pagina.length === 0) {
      aviso(root, "Nenhuma reclamação encontrada para este filtro.");
      return;
    }

    pagina.forEach((item) => {
      const isLido = !!lidos[item.id];
      const div = document.createElement("div");
      div.className = "edition-row" + (isLido ? " is-read" : "");
      const url = item.url || URL_STF + item.processo;
      div.innerHTML = `
        <button type="button" class="check-btn" aria-label="Marcar como lido">
          <span class="star ${isLido ? "star-gold" : "star-empty"}">${isLido ? "📖" : "📘"}</span>
        </button>
        <div class="edition-content">
          <span class="edition-num">${escapeHtml(item.processo)}</span>
          <span class="edition-date">${escapeHtml(formatarData(item.dataJulgamento) || "data não informada")} — ${escapeHtml(item.relator || "STF")} · <strong>${escapeHtml(item.ramo || "Geral")}</strong></span>
          <span class="edition-topic" style="display:block;margin-top:4px;">${escapeHtml(limparTexto(item.resumo) || "Sem resumo disponível — abra o processo no STF.")}</span>
        </div>
        <a class="action-btn" href="${escapeHtml(safeUrl(url))}" target="_blank" rel="noopener">Abrir</a>
      `;
      div.querySelector(".check-btn").addEventListener("click", () => alternarLeitura(item.id));
      root.appendChild(div);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
