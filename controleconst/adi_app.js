(function () {
  const STORAGE_KEY = "em_lidos_constitucionalidades";
  let lidos = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  let loteTamanho = 10;
  let loteAtual = 0;
  let filtroClasse = "todas";
  let filtroAno = "todos";

  // ---- dados: um arquivo por ano ----------------------------------------
  // O arquivo grande (adi_dados.js) é dividido em controleconst/anos/ pelo
  // scripts/dividir_por_ano.py: index.json (quantos itens por ano e por
  // classe) + um AAAA.json por ano. A página carrega o índice e depois só os
  // anos que precisa mostrar, com "no-cache" (o navegador só baixa de novo
  // o que mudou). Se a página ainda carregar o arquivo inteiro, usa ele.
  const BASE_ANOS = "https://cdn.jsdelivr.net/gh/barbarasinfronio-lgtm/diario-informativos@main/controleconst/anos/";
  const URL_STF = "https://portal.stf.jus.br/processos/detalhe.asp?processo=";
  const legado = window.CONSTITUCIONALIDADES_DATA;

  let indice = null;      // { total, anos: [{ ano, total, grupos: { ADI: n, ... } }] }
  const carregados = {};  // "2026" -> itens daquele ano
  const pedidos = {};     // "2026" -> fetch em andamento

  function anoDaData(d) {
    const m = /^(\d{4})-\d{2}-\d{2}$/.exec(String(d || ""));
    return m ? m[1] : "sem-ano";
  }

  function montarIndiceLegado(lista) {
    const anos = {};
    lista.forEach((it) => {
      const ano = anoDaData(it.data);
      const a = anos[ano] || (anos[ano] = { ano: ano, total: 0, grupos: {} });
      a.total++;
      a.grupos[it.classe] = (a.grupos[it.classe] || 0) + 1;
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
    return filtroClasse === "todas" || item.classe === filtroClasse;
  }

  function totalFiltrado() {
    return anosRelevantes().reduce((s, a) =>
      s + (filtroClasse === "todas" ? a.total : (a.grupos[filtroClasse] || 0)), 0);
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
  // pelos itens; senão, pelo código do processo, que traz a classe e a data
  // (ex.: "STF_ADI_7641_20260925_15066").
  function contarLidos() {
    const rel = anosRelevantes();
    if (rel.every((a) => carregados[a.ano])) {
      return filtradosCarregados().filter((d) => lidos[d.id]).length;
    }
    return Object.keys(lidos).filter((id) => {
      const p = id.split("_");
      const ano = /^\d{8}$/.test(p[3] || "") ? p[3].slice(0, 4) : "sem-ano";
      return (filtroClasse === "todas" || p[1] === filtroClasse) &&
        (filtroAno === "todos" || ano === String(filtroAno));
    }).length;
  }

  // ---- tratamento dos textos vindos do STF ------------------------------
  // Os textos vêm de planilhas/raspagem e trazem sujeira: "_x000D_" (quebra
  // de linha do Excel), quebras e espaços repetidos, e cortes no meio da
  // frase (o resumo é limitado a LIMITE_TEXTO letras). Tudo é tratado aqui,
  // na hora de mostrar, para valer também quando os dados forem trocados.
  const LIMITE_TEXTO = 250;

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
        if (root) aviso(root, "Não foi possível carregar os julgados. Recarregue a página.");
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
    const selClasse = document.getElementById("classe-select");
    const selAno = document.getElementById("ano-select");
    if (selClasse) {
      selClasse.addEventListener("change", (e) => {
        filtroClasse = e.target.value;
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
      aviso(root, "Carregando julgados…");
      return;
    }

    const totalItens = totalFiltrado();
    const inicio = loteAtual * loteTamanho;
    const fim = Math.min(inicio + loteTamanho, totalItens);

    // Busca os anos que faltam para mostrar este lote.
    if (filtradosCarregados().length < fim) {
      aviso(root, "Carregando julgados…");
      try {
        await garantir(fim);
      } catch (e) {
        if (seq === renderSeq) aviso(root, "Não foi possível carregar os julgados. Recarregue a página.");
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
      aviso(root, "Nenhum julgado encontrado para este filtro.");
      return;
    }

    pagina.forEach((item) => {
      const isLido = !!lidos[item.id];
      const div = document.createElement("div");
      div.className = "edition-row" + (isLido ? " is-read" : "");
      // A data vem no campo "data" (AAAA-MM-DD); alguns itens vêm com "-".
      const data = formatarData(item.data || item.dataJulgamento) || (item.ano ? String(item.ano) : "data não informada");
      const texto = limparTexto(item.tema || item.tese || item.resumo) || "Sem resumo disponível — abra o processo no STF.";
      const url = item.url || URL_STF + item.processo;
      div.innerHTML = `
        <button type="button" class="check-btn" aria-label="Marcar como lido">
          <span class="star ${isLido ? "star-gold" : "star-empty"}">${isLido ? "📖" : "📘"}</span>
        </button>
        <div class="edition-content">
          <span class="edition-num">${escapeHtml(item.processo)}</span>
          <span class="edition-date">${escapeHtml(data)} — ${escapeHtml(item.relator || "STF")}</span>
          <span class="edition-topic" style="display:block;margin-top:4px;">${escapeHtml(texto)}</span>
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
