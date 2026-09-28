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

  function combina(item) {
    return filtroTribunal === "todos" || item.tribunal === filtroTribunal;
  }

  function totalFiltrado() {
    return anosRelevantes().reduce((s, a) =>
      s + (filtroTribunal === "todos" ? a.total : (a.grupos[filtroTribunal] || 0)), 0);
  }

  // Itens já carregados, na ordem da lista (para no primeiro ano que falta).
  function filtradosCarregados() {
    const out = [];
    for (const a of anosRelevantes()) {
      if (!carregados[a.ano]) break;
      carregados[a.ano].forEach((it) => { if (combina(it)) out.push(it); });
    }
    return out;
  }

  async function garantir(quantos) {
    for (const a of anosRelevantes()) {
      if (filtradosCarregados().length >= quantos) return;
      await carregarAno(a.ano);
    }
  }

  // Lidos dentro do filtro. Com todos os anos do filtro carregados, conta
  // pelos itens; senão (só acontece em "Todos os Anos"), pelo código do
  // processo, que começa pelo tribunal (ex.: "STF_Rcl_100475").
  function contarLidos() {
    const rel = anosRelevantes();
    if (rel.every((a) => carregados[a.ano])) {
      return filtradosCarregados().filter((d) => lidos[d.id]).length;
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

    const totalItens = totalFiltrado();
    const inicio = loteAtual * loteTamanho;
    const fim = Math.min(inicio + loteTamanho, totalItens);

    // Busca os anos que faltam para mostrar este lote.
    if (filtradosCarregados().length < fim) {
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
    document.getElementById("stat-total").textContent = totalItens;
    const pct = totalItens > 0 ? Math.round((lidosCount / totalItens) * 100) : 0;
    document.getElementById("stat-pct").textContent = pct + "%";
    document.getElementById("progress-fill").style.width = pct + "%";

    // Paginação
    const pagina = filtradosCarregados().slice(inicio, fim);

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
