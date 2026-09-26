// controleconst/adi_app.js
(function () {
  const STORAGE_KEY = "estudamana_adis_lidas";

  function getLidas() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
    } catch (e) {
      return {};
    }
  }

  function toggleLida(num) {
    const lidas = getLidas();
    if (lidas[num]) {
      delete lidas[num];
    } else {
      lidas[num] = { data: new Date().toISOString() };
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lidas));
    render();
  }

  function getFiltros() {
    return {
      termo: (document.getElementById("busca-adi")?.value || "").toLowerCase().trim(),
      ano: document.getElementById("filtro-ano-adi")?.value || "",
      resultado: document.getElementById("filtro-resultado-adi")?.value || "",
      apenasPendentes: !!document.getElementById("filtro-pendentes-adi")?.checked
    };
  }

  function render() {
    const container = document.getElementById("adi-lista-anos");
    const labelContador = document.getElementById("adi-contador-texto");
    const barraProgresso = document.getElementById("adi-barra-progresso");
    const lidas = getLidas();
    const filtros = getFiltros();

    const dados = typeof DADOS_ADIS !== "undefined" ? DADOS_ADIS : [];
    const totalAdis = dados.length;
    let totalLidas = 0;

    dados.forEach((d) => {
      if (lidas[d.numero]) totalLidas++;
    });

    const percent = totalAdis > 0 ? Math.round((totalLidas / totalAdis) * 100) : 0;
    if (labelContador) {
      labelContador.innerHTML = `<strong>${totalLidas}</strong> de ${totalAdis} lidas ${percent}%`;
    }
    if (barraProgresso) {
      barraProgresso.style.width = `${percent}%`;
    }

    // Filtragem
    const filtradas = dados.filter((item) => {
      const matchBusca =
        !filtros.termo ||
        item.numero.toString().includes(filtros.termo) ||
        item.tema.toLowerCase().includes(filtros.termo) ||
        (item.relator && item.relator.toLowerCase().includes(filtros.termo));

      const matchAno = !filtros.ano || item.ano.toString() === filtros.ano;
      const matchRes = !filtros.resultado || item.resultado === filtros.resultado;
      const matchPendente = !filtros.apenasPendentes || !lidas[item.numero];

      return matchBusca && matchAno && matchRes && matchPendente;
    });

    // Agrupamento por ano
    const grupos = {};
    filtradas.forEach((item) => {
      if (!grupos[item.ano]) grupos[item.ano] = [];
      grupos[item.ano].push(item);
    });

    const anos = Object.keys(grupos).sort((a, b) => b - a);

    if (anos.length === 0) {
      container.innerHTML = `<div class="adi-vazio">Nenhuma ADI encontrada com os filtros selecionados.</div>`;
      return;
    }

    let html = "";
    anos.forEach((ano) => {
      html += `
        <div class="ano-bloco" id="bloco-${ano}">
          <div class="ano-titulo" onclick="window.adiToggleAno('${ano}')">
            <span class="ano-toggle-icon" id="toggle-${ano}">[-]</span> ${ano}
            <span class="ano-contador-badge">(${grupos[ano].length})</span>
          </div>
          <div class="ano-conteudo" id="conteudo-${ano}">`;

      grupos[ano].forEach((adi) => {
        const isLida = !!lidas[adi.numero];
        const resClass = (adi.resultado || "").toLowerCase().replace(/\s+/g, "-");
        html += `
          <div class="adi-linha ${isLida ? "linha-lida" : ""}" data-numero="${adi.numero}">
            <span class="adi-check" onclick="window.adiToggleLida(${adi.numero})">${isLida ? "☑" : "☐"}</span>
            <span class="adi-numero">ADI Nº ${adi.numero}</span>
            <span class="adi-data">${adi.data}</span>
            <span class="adi-tag adi-tag-${resClass}">${adi.resultado}</span>
            <span class="adi-tema-texto">${adi.tema}</span>
            <a href="${adi.url}" target="_blank" rel="noopener" class="adi-link-abrir">🗞 [Abrir]</a>
          </div>
        `;
      });

      html += `</div></div>`;
    });

    container.innerHTML = html;
  }

  function popularAnos() {
    const sel = document.getElementById("filtro-ano-adi");
    if (!sel || typeof DADOS_ADIS === "undefined") return;
    const anosUnicos = [...new Set(DADOS_ADIS.map((d) => d.ano))].sort((a, b) => b - a);
    sel.innerHTML = `<option value="">Todos os anos</option>`;
    anosUnicos.forEach((ano) => {
      sel.innerHTML += `<option value="${ano}">${ano}</option>`;
    });
  }

  window.adiToggleLida = toggleLida;
  window.adiToggleAno = function (ano) {
    const box = document.getElementById(`conteudo-${ano}`);
    const icone = document.getElementById(`toggle-${ano}`);
    if (box) {
      const oculta = box.style.display === "none";
      box.style.display = oculta ? "flex" : "none";
      if (icone) icone.innerText = oculta ? "[-]" : "[+]";
    }
  };

  document.addEventListener("DOMContentLoaded", () => {
    popularAnos();
    render();

    document.getElementById("busca-adi")?.addEventListener("input", render);
    document.getElementById("filtro-ano-adi")?.addEventListener("change", render);
    document.getElementById("filtro-resultado-adi")?.addEventListener("change", render);
    document.getElementById("filtro-pendentes-adi")?.addEventListener("change", render);
  });
})();
