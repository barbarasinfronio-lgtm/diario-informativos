// adi_app.js - Lógica e Interatividade da Página de ADIs
(function () {
  const STORAGE_KEY = "estudamana_adis_lidas";

  function getLidas() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
    } catch (e) {
      return {};
    }
  }

  function toggleLida(id) {
    const lidas = getLidas();
    if (lidas[id]) {
      delete lidas[id];
    } else {
      lidas[id] = { data: new Date().toISOString() };
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lidas));
    render();
  }

  function getFiltros() {
    return {
      termo: (document.getElementById("adi-busca").value || "").toLowerCase().trim(),
      ano: document.getElementById("adi-filtro-ano").value,
      resultado: document.getElementById("adi-filtro-resultado").value,
      apenasPendentes: document.getElementById("adi-filtro-pendentes").checked
    };
  }

  function render() {
    const container = document.getElementById("adi-lista-conteudo");
    const contadorTotal = document.getElementById("adi-contador-total");
    const barraProgresso = document.getElementById("adi-barra-progresso");
    const lidas = getLidas();
    const filtros = getFiltros();

    const dados = typeof DADOS_ADIS !== "undefined" ? DADOS_ADIS : [];
    const totalAdis = dados.length;
    let lidasCount = 0;

    dados.forEach((adi) => {
      if (lidas[adi.numero]) lidasCount++;
    });

    const percent = totalAdis > 0 ? Math.round((lidasCount / totalAdis) * 100) : 0;
    if (contadorTotal) {
      contadorTotal.innerHTML = `<strong>${lidasCount}</strong> de ${totalAdis} estudadas (${percent}%)`;
    }
    if (barraProgresso) {
      barraProgresso.style.width = `${percent}%`;
    }

    // Filtragem
    const filtrados = dados.filter((item) => {
      const matchTermo =
        !filtros.termo ||
        item.numero.toString().includes(filtros.termo) ||
        item.tema.toLowerCase().includes(filtros.termo) ||
        (item.relator && item.relator.toLowerCase().includes(filtros.termo)) ||
        (item.dispositivo && item.dispositivo.toLowerCase().includes(filtros.termo));

      const matchAno = !filtros.ano || item.ano.toString() === filtros.ano;
      const matchRes = !filtros.resultado || item.resultado === filtros.resultado;
      const matchPendente = !filtros.apenasPendentes || !lidas[item.numero];

      return matchTermo && matchAno && matchRes && matchPendente;
    });

    // Agrupamento por Ano Decrescente
    const gruposPorAno = {};
    filtrados.forEach((item) => {
      if (!gruposPorAno[item.ano]) gruposPorAno[item.ano] = [];
      gruposPorAno[item.ano].push(item);
    });

    const anosOrdenados = Object.keys(gruposPorAno).sort((a, b) => b - a);

    if (anosOrdenados.length === 0) {
      container.innerHTML = `<div class="adi-vazio">Nenhuma ADI encontrada com os filtros selecionados.</div>`;
      return;
    }

    let html = "";
    anosOrdenados.forEach((ano) => {
      html += `<div class="adi-grupo-ano">
        <h3 class="adi-titulo-ano">${ano}</h3>
        <div class="adi-itens">`;

      gruposPorAno[ano].forEach((adi) => {
        const isLida = !!lidas[adi.numero];
        html += `
          <div class="adi-card ${isLida ? "adi-lida" : ""}" data-numero="${adi.numero}">
            <div class="adi-card-header">
              <span class="adi-check" onclick="window.adiToggleLida(${adi.numero})">
                ${isLida ? "☑" : "☐"}
              </span>
              <span class="adi-badge-numero">ADI ${adi.numero}</span>
              <span class="adi-tag adi-tag-${(adi.resultado || "").toLowerCase().replace(/\s+/g, "-")}">${adi.resultado || "Julgado"}</span>
              <span class="adi-data">${adi.dataJulgamento || ""}</span>
              <a href="${adi.linkSTF}" target="_blank" rel="noopener" class="adi-link-stf">🏛 STF</a>
            </div>
            <div class="adi-card-corpo">
              <div class="adi-tema">${adi.tema}</div>
              ${adi.dispositivo ? `<div class="adi-dispositivo"><strong>Tese/Dispositivo:</strong> ${adi.dispositivo}</div>` : ""}
              <div class="adi-relator"><strong>Relator:</strong> ${adi.relator || "STF"}</div>
            </div>
          </div>
        `;
      });

      html += `</div></div>`;
    });

    container.innerHTML = html;
  }

  function popularAnos() {
    const selectAno = document.getElementById("adi-filtro-ano");
    if (!selectAno || typeof DADOS_ADIS === "undefined") return;

    const anos = [...new Set(DADOS_ADIS.map((d) => d.ano))].sort((a, b) => b - a);
    selectAno.innerHTML = `<option value="">Todos os anos</option>`;
    anos.forEach((ano) => {
      selectAno.innerHTML += `<option value="${ano}">${ano}</option>`;
    });
  }

  window.adiToggleLida = toggleLida;

  document.addEventListener("DOMContentLoaded", () => {
    popularAnos();
    render();

    document.getElementById("adi-busca")?.addEventListener("input", render);
    document.getElementById("adi-filtro-ano")?.addEventListener("change", render);
    document.getElementById("adi-filtro-resultado")?.addEventListener("change", render);
    document.getElementById("adi-filtro-pendentes")?.addEventListener("change", render);
  });
})();
