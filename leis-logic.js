// leis-logic.js - Lógica de Filtros e Exibição de Leis do Estuda Mana
import { LEIS_DATA, EDITAIS_DISPONIVEIS, ESTADOS_BRASIL } from './leis-data.js';

const STORAGE_EDITAL = 'estudamana_edital_selecionado';
const STORAGE_ESTADO = 'estudamana_estado_selecionado';

const selectEdital = document.getElementById('select-edital');
const selectEstado = document.getElementById('select-estado');
const inputBusca = document.getElementById('input-busca-lei');
const wrapperEstado = document.getElementById('wrapper-filtro-estado');
const gridFederais = document.getElementById('grid-leis-federais');
const gridEstaduais = document.getElementById('grid-leis-estaduais');
const tituloEstaduais = document.getElementById('titulo-leis-estaduais');

function renderCard(lei) {
  const badgeTexto = lei.tipo === 'federal' ? 'FEDERAL' : `ESTADUAL (${lei.estado})`;
  const badgeCorFundo = lei.tipo === 'federal' ? '#e7f1ff' : '#e6f4ea';
  const badgeCorTexto = lei.tipo === 'federal' ? '#0d6efd' : '#198754';

  return `
    <div style="background:#ffffff; border:1px solid #e2e8f0; border-radius:8px; padding:16px; margin-bottom:14px; box-shadow:0 1px 3px rgba(0,0,0,0.04);">
      <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:10px;">
        <h3 style="margin:0; font-size:16px; font-weight:600; color:#1e293b;">${lei.titulo}</h3>
        <span style="font-size:11px; font-weight:700; background:${badgeCorFundo}; color:${badgeCorTexto}; padding:3px 8px; border-radius:12px; white-space:nowrap;">
          ${badgeTexto}
        </span>
      </div>
      <p style="margin:8px 0 12px 0; font-size:13px; color:#64748b; line-height:1.5;">${lei.ementa}</p>
      <div>
        <a href="${lei.link}" target="_blank" rel="noopener noreferrer" style="font-size:13px; font-weight:600; color:#0d6efd; text-decoration:none; display:inline-flex; align-items:center; gap:4px;">
          📖 Abrir Lei na Íntegra ↗
        </a>
      </div>
    </div>
  `;
}

function filtrarERenderizar() {
  const editalId = selectEdital.value;
  const editalObj = EDITAIS_DISPONIVEIS.find(e => e.id === editalId);
  const estadoFiltro = selectEstado.value;
  
  // Limpa caracteres não numéricos para permitir busca por "10.261" ou "10261"
  const termo = inputBusca.value.trim().toLowerCase();
  const termoNumerico = termo.replace(/[^0-9]/g, '');

  const atendeBusca = (lei) => {
    if (!termo) return true;
    const num = (lei.numeroNorma || '').toLowerCase();
    const tit = lei.titulo.toLowerCase();
    const eme = lei.ementa.toLowerCase();

    // Se o usuário digitou número, confere pelo número limpo
    if (termoNumerico && num.includes(termoNumerico)) return true;
    // Se digitou palavras, confere no título e ementa
    return tit.includes(termo) || eme.includes(termo);
  };

  // 1. FILTRO DAS LEIS FEDERAIS (sempre visíveis, respondem à barra de busca)
  const federais = LEIS_DATA.filter(l => l.tipo === 'federal' && atendeBusca(l));
  gridFederais.innerHTML = federais.length 
    ? federais.map(renderCard).join('')
    : '<p style="color:#94a3b8; font-style:italic;">Nenhuma lei federal encontrada.</p>';

  // 2. FILTRO DAS LEIS ESTADUAIS
  const estaduais = LEIS_DATA.filter(l => {
    if (l.tipo !== 'estadual') return false;
    if (!atendeBusca(l)) return false;

    // Se escolheu edital genérico (federal)
    if (editalObj && editalObj.esfera === 'federal') {
      if (estadoFiltro === 'TODOS') return true;
      return l.estado === estadoFiltro;
    }

    // Se escolheu edital específico (ex: TJSP)
    return l.editais && l.editais.includes(editalId);
  });

  // Atualiza título da seção estadual
  if (editalObj && editalObj.esfera === 'federal') {
    tituloEstaduais.textContent = estadoFiltro === 'TODOS' 
      ? '🏛️ Leis Estaduais (Todos os Estados)' 
      : `🏛️ Leis Estaduais (${estadoFiltro})`;
  } else {
    tituloEstaduais.textContent = `🏛️ Leis Estaduais do Edital: ${editalObj ? editalObj.nome : editalId}`;
  }

  gridEstaduais.innerHTML = estaduais.length 
    ? estaduais.map(renderCard).join('')
    : '<p style="color:#94a3b8; font-style:italic;">Nenhuma lei estadual encontrada para o filtro selecionado.</p>';
}

function atualizarControles() {
  const editalId = selectEdital.value;
  const editalObj = EDITAIS_DISPONIVEIS.find(e => e.id === editalId);

  if (editalObj && editalObj.esfera === 'federal') {
    // Exibe o dropdown de escolher UF
    wrapperEstado.style.display = 'block';
  } else {
    // Esconde o dropdown de UF se já é um edital de tribunal estadual fixo
    wrapperEstado.style.display = 'none';
  }
  filtrarERenderizar();
}

function init() {
  // Preenche Editais
  selectEdital.innerHTML = '';
  EDITAIS_DISPONIVEIS.forEach(e => {
    const opt = document.createElement('option');
    opt.value = e.id;
    opt.textContent = e.nome;
    selectEdital.appendChild(opt);
  });

  // Preenche Estados
  selectEstado.innerHTML = '<option value="TODOS">Todos os Estados (UF)</option>';
  ESTADOS_BRASIL.forEach(uf => {
    const opt = document.createElement('option');
    opt.value = uf.sigla;
    opt.textContent = `${uf.sigla} - ${uf.nome}`;
    selectEstado.appendChild(opt);
  });

  // Recupera escolhas salvas
  const editalSalvo = localStorage.getItem(STORAGE_EDITAL) || 'TJSP';
  const estadoSalvo = localStorage.getItem(STORAGE_ESTADO) || 'TODOS';

  selectEdital.value = editalSalvo;
  selectEstado.value = estadoSalvo;

  // Eventos
  selectEdital.addEventListener('change', () => {
    localStorage.setItem(STORAGE_EDITAL, selectEdital.value);
    atualizarControles();
  });

  selectEstado.addEventListener('change', () => {
    localStorage.setItem(STORAGE_ESTADO, selectEstado.value);
    filtrarERenderizar();
  });

  inputBusca.addEventListener('input', filtrarERenderizar);

  atualizarControles();
}

document.addEventListener('DOMContentLoaded', init);
