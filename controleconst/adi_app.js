(function () {
  const STORAGE_KEY = "em_lidos_constitucionalidades";
  let lidos = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  let loteTamanho = 10;
  let loteAtual = 0;
  let filtroClasse = "todas";
  let filtroAno = "todos";

  // ---- dados: um arquivo por ano ----------------------------------------
  // (A página do Blogger não carrega mais o arquivo grande: tudo vem daqui.)
  // O arquivo grande (adi_dados.js) é dividido em controleconst/anos/ pelo
  // scripts/dividir_por_ano.py: index.json (quantos itens por ano e por
  // classe) + um AAAA.json por ano. A página carrega o índice e depois só os
  // anos que precisa mostrar, com "no-cache" (o navegador só baixa de novo
  // o que mudou). Se a página ainda carregar o arquivo inteiro, usa ele.
  const BASE_ANOS = "https://barbarasinfronio-lgtm.github.io/diario-informativos/controleconst/anos/";
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
  // Siglas curtas (2 ou 3 letras: IR, STF, ECA) só valem no começo de uma palavra —
  // senão "ir" acharia "direito", "firmar"… Números e termos maiores: trecho.
  function contem(h, t) {
    if (/^[a-z]{2,3}$/.test(t)) return new RegExp("(^|[^a-z0-9])" + t).test(h);
    return h.indexOf(t) !== -1;
  }
  function combinaBusca(texto) {
    if (!termosBusca.length) return true;
    var h = semAcentoBusca(texto);
    return termosBusca.every(function (t) {
      return variantes(t).some(function (x) { return contem(h, x); });
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
      // busca só vale com pelo menos 2 caracteres (ex.: IR, ITCMD, IPTU); com 1, mostra a lista normal
      var digitado = semAcentoBusca(input.value).trim();
      termosBusca = digitado.replace(/\s+/g, "").length < 2 ? [] : digitado.split(/\s+/).filter(Boolean);
      aoMudar();
    }
    input.addEventListener("input", mudou);
    limpar.addEventListener("click", function () { input.value = ""; mudou(); input.focus(); });
    listRoot.parentNode.insertBefore(box, listRoot);
    listRoot.parentNode.insertBefore(buscaInfo, listRoot);
  }

  // Texto em que a busca procura.
  function textoBusca(item) {
    return [item.processo, item.classe, formatarData(item.data), item.data, item.ano, item.relator, limparTexto(item.tema || item.tese || item.resumo)].join(" ");
  }

  // comBusca = false: só os filtros do topo (base dos contadores de progresso).
  function combina(item, comBusca) {
    return (filtroClasse === "todas" || item.classe === filtroClasse) && (!comBusca || combinaBusca(textoBusca(item)));
  }

  // Total do filtro do topo, sem a busca (base dos contadores de progresso).
  function totalSemBusca() {
    return anosRelevantes().reduce((s, a) =>
      s + (filtroClasse === "todas" ? a.total : (a.grupos[filtroClasse] || 0)), 0);
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
  // pelos itens; senão, pelo código do processo, que traz a classe e a data
  // (ex.: "STF_ADI_7641_20260925_15066").
  function contarLidos() {
    const rel = anosRelevantes();
    if (rel.every((a) => carregados[a.ano])) {
      return filtradosCarregados(false).filter((d) => lidos[d.id]).length;
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
    criarBusca("Buscar por processo ou palavra (ex.: ADI 7641, piso salarial)", function () { loteAtual = 0; render(); });
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
    salvarNuvem();
    enviarGrupos();
  }

  // A conta (nuvem-shared.js): as leituras ficam salvas em progress-adi/<uid> para
  // quem entrou com Google ou e-mail e senha, e o total lido vira o campo
  // "lidasAdi" em cada grupo de estudo (Meus Grupos).
  let nuvemP = null;
  function nuvem() {
    if (window.EstudaManaNuvem) return Promise.resolve(window.EstudaManaNuvem);
    if (!nuvemP) {
      nuvemP = new Promise(function (ok, erro) {
        const s = document.createElement("script");
        s.src = "https://barbarasinfronio-lgtm.github.io/diario-informativos/nuvem-shared.js";
        s.onload = function () { ok(window.EstudaManaNuvem); };
        s.onerror = erro;
        document.head.appendChild(s);
      });
    }
    return nuvemP;
  }

  let salvarNuvem = function () {};
  function ligarConta() {
    nuvem().then(function (N) {
      N.mostrarLogin(document.getElementById("list-root"));
      salvarNuvem = N.sincronizarLidos({
        caminho: "progress-adi/",
        ler: function () { return lidos; },
        gravar: function (novo) { lidos = novo; localStorage.setItem(STORAGE_KEY, JSON.stringify(lidos)); },
        aoMudar: function () { render(); enviarGrupos(); }
      });
    }).catch(function () { /* sem internet: segue neste navegador */ });
  }

  let grupoTimer = null;
  function enviarGrupos() {
    clearTimeout(grupoTimer);
    let temGrupo = false;
    try { const g = JSON.parse(localStorage.getItem("informativos-grupo") || "null"); temGrupo = !!(g && (g.length || g.code)); } catch (e) {}
    if (!temGrupo) return; // sem grupo, nada a enviar
    grupoTimer = setTimeout(function () {
      const total = Object.keys(lidos).length;
      nuvem().then(function (N) { N.enviarGrupos("lidasAdi", total); }).catch(function () {});
    }, 800);
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
    mostrarResultadoBusca(totalItens, ["julgado", "julgados"]);
    const inicio = loteAtual * loteTamanho;
    const fim = Math.min(inicio + loteTamanho, totalItens);

    // Busca os anos que faltam para mostrar este lote.
    if (filtradosCarregados(true).length < fim) {
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
  ligarConta();
  enviarGrupos();
})();
