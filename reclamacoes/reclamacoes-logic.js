(function () {
  const STORAGE_KEY = "em_lidos_reclamacoes";
  let lidos = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  let loteTamanho = 10;
  let loteAtual = 0;
  let filtroTribunal = "todos";
  let filtroAno = "todos";

  const dados = window.RECLAMACOES_DATA || [];


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
      .replace(/[\s\u00a0]+/g, " ")
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

  function init() {
    popularFiltroAno();
    bindEvents();
    render();
  }

  function popularFiltroAno() {
    const sel = document.getElementById("ano-select");
    if (!sel) return;
    const anos = [...new Set(dados.map((d) => {
      const match = (d.dataJulgamento || '').match(/\b(19\d{2}|20\d{2})\b/);
      return match ? match[1] : null;
    }).filter(Boolean))].sort((a, b) => b - a);

    anos.forEach((ano) => {
      const opt = document.createElement("option");
      opt.value = ano;
      opt.textContent = ano;
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

  function getFiltrados() {
    return dados.filter((item) => {
      const matchTrib = filtroTribunal === "todos" || item.tribunal === filtroTribunal;
      const anoItem = (item.dataJulgamento || '').match(/\b(19\d{2}|20\d{2})\b/);
      const matchAno = filtroAno === "todos" || (anoItem && anoItem[1] === filtroAno);
      return matchTrib && matchAno;
    });
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

  function render() {
    const root = document.getElementById("list-root");
    if (!root) return;

    const filtrados = getFiltrados();
    const totalItens = filtrados.length;
    const lidosCount = filtrados.filter((d) => lidos[d.id]).length;

    // Atualiza contadores e barra de progresso
    document.getElementById("stat-count").textContent = lidosCount;
    document.getElementById("stat-total").textContent = totalItens;
    const pct = totalItens > 0 ? Math.round((lidosCount / totalItens) * 100) : 0;
    document.getElementById("stat-pct").textContent = pct + "%";
    document.getElementById("progress-fill").style.width = pct + "%";

    // Paginação
    const inicio = loteAtual * loteTamanho;
    const fim = Math.min(inicio + loteTamanho, totalItens);
    const pagina = filtrados.slice(inicio, fim);

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
      root.innerHTML = '<p class="group-note" style="text-align:center;padding:24px;">Nenhuma reclamação procedente encontrada para este filtro.</p>';
      return;
    }

    pagina.forEach((item) => {
      const isLido = !!lidos[item.id];
      const div = document.createElement("div");
      div.className = "edition-row" + (isLido ? " is-read" : "");
      div.innerHTML = `
        <button type="button" class="check-btn" aria-label="Marcar como lido">
          <span class="star ${isLido ? "star-gold" : "star-empty"}">${isLido ? "📖" : "📘"}</span>
        </button>
        <div class="edition-content">
          <span class="edition-num">${escapeHtml(item.processo)}</span>
          <span class="edition-date">${escapeHtml(formatarData(item.dataJulgamento) || "data não informada")} — ${escapeHtml(item.relator || "STF")} · <strong>${escapeHtml(item.ramo || "Geral")}</strong></span>
          <span class="edition-topic" style="display:block;margin-top:4px;">${escapeHtml(limparTexto(item.resumo) || "Sem resumo disponível — abra o processo no STF.")}</span>
        </div>
        <a class="action-btn" href="${escapeHtml(safeUrl(item.url))}" target="_blank" rel="noopener">Abrir</a>
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
