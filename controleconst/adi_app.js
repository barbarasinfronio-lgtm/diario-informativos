(function () {
  const STORAGE_KEY = "em_lidos_constitucionalidades";
  let lidos = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  let loteTamanho = 10;
  let loteAtual = 0;
  let filtroClasse = "todas";
  let filtroAno = "todos";

  const dados = window.CONSTITUCIONALIDADES_DATA || [];

  function init() {
    popularFiltroAno();
    bindEvents();
    render();
  }

  function popularFiltroAno() {
    const sel = document.getElementById("ano-select");
    if (!sel) return;
    const anos = [...new Set(dados.map((d) => d.ano).filter(Boolean))].sort((a, b) => b - a);
    anos.forEach((ano) => {
      const opt = document.createElement("option");
      opt.value = ano;
      opt.textContent = ano;
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

  function getFiltrados() {
    return dados.filter((item) => {
      const matchClasse = filtroClasse === "todas" || item.classe === filtroClasse;
      const matchAno = filtroAno === "todos" || String(item.ano) === String(filtroAno);
      return matchClasse && matchAno;
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

    // Atualiza contadores
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
      root.innerHTML = '<p class="group-note" style="text-align:center;padding:24px;">Nenhum julgado encontrado para este filtro.</p>';
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
          <span class="edition-num">${item.processo}</span>
          <span class="edition-date">${item.dataJulgamento || item.ano} — ${item.relator || "STF"}</span>
          <span class="edition-topic" style="display:block;margin-top:4px;">${item.tema || item.tese || item.resumo || ""}</span>
        </div>
        <a class="action-btn" href="${item.url}" target="_blank" rel="noopener">Abrir</a>
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
