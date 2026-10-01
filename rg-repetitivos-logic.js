(function(){
  // STF/STJ vêm de rg-repetitivos-data.js; as OJs, Precedentes Normativos e
  // temas de IRR do TST vêm de tst/decisoes.json (gerado toda semana por
  // scripts/atualizar_tst.py) e entram na lista assim que chegam.
  // Para abrir rápido, a lista vem de leve/decisoes.json (só o que a lista
  // precisa — gerado por scripts/gerar_leves.js). O texto completo de cada
  // arquivo (rg-repetitivos-data.js, teses, extras, TST) só é baixado quando
  // a pessoa busca algo ou abre um card (completarFonte, mais abaixo). Se a
  // página ainda carregar rg-repetitivos-data.js pelo HTML, ele já vale.
  var DATA = (window.RG_REPETITIVOS_DATA || []).slice();
  var completo = { rg: !!window.RG_REPETITIVOS_DATA };
  var LEVE_JSON = 'https://barbarasinfronio-lgtm.github.io/diario-informativos/leve/decisoes.json';
  var RG_JS = 'https://barbarasinfronio-lgtm.github.io/diario-informativos/rg-repetitivos-data.js';
  var TST_JSON = 'https://barbarasinfronio-lgtm.github.io/diario-informativos/tst/decisoes.json';
  // Jurisprudência em Teses do STJ: uma tese por card, com o texto completo
  // (gerado pelo robô do Mac, scripts/atualizar_informativos.py → stj/teses.json).
  var TESES_JSON = 'https://barbarasinfronio-lgtm.github.io/diario-informativos/stj/teses.json';
  // Omissões inconstitucionais, resumos de decisões e o painel COVID-19 do
  // STF (dados abertos do STF → stf/extras.json). Cada um tem seu botão.
  var EXTRAS_JSON = 'https://barbarasinfronio-lgtm.github.io/diario-informativos/stf/extras.json';
  // Acórdãos do STJ (dados abertos do STJ → scripts/acordaos_stj.py). São
  // dezenas de milhares: a lista leve (stj/acordaos/indice.json) só é baixada
  // quando a pessoa abre o grupo ou busca algo; a ementa de cada um vem de
  // stj/acordaos/c/NNN.json só quando o card é aberto.
  var ACORDAOS_BASE = 'https://barbarasinfronio-lgtm.github.io/diario-informativos/stj/acordaos/';
  var GRUPOS = {
    OMISSOES: { rotulo: 'Omissões', titulo: 'Omissões inconstitucionais reconhecidas pelo STF' },
    RESUMOS:  { rotulo: 'Resumos',  titulo: 'Resumos de decisões do STF (fatos, fundamentos, tese e placar)' },
    COVID:    { rotulo: 'COVID-19', titulo: 'Decisões do STF sobre a pandemia de COVID-19' },
    INFORMATIVOS: { rotulo: 'Informativos', titulo: 'Julgados dos informativos do STJ e do STF — tese e resumo' },
    ACORDAOS: { rotulo: 'Acórdãos STJ', titulo: 'Acórdãos de mérito do STJ (turmas, seções e Corte Especial) — ementa e decisão' }
  };
  // Sem busca, a lista mostra só as mais recentes (10 de cada vez), para a
  // página não ficar pesada; com busca, mostra tudo o que combinar.
  var LOTE_INICIAL = 10;
  // Em quais provas de concurso cada decisão já foi cobrada
  // (scripts/cobrancas_provas.py → provas/cobrancas.json).
  var COBRANCAS_JSON = 'https://barbarasinfronio-lgtm.github.io/diario-informativos/provas/cobrancas.json';
  var COB = null;
  function cobrancasDe(d){
    var lst = COB && COB.itens['dec:' + d.id];
    if (!lst) return [];
    var porProva = {};
    lst.forEach(function(x){ (porProva[x[0]] = porProva[x[0]] || []).push(x[1]); });
    return Object.keys(porProva).map(function(pi){
      var p = COB.provas[pi];
      return { rotulo: p.rotulo + ' (' + p.banca + ')', ano: p.ano, questoes: porProva[pi] };
    }).sort(function(a, b){ return b.ano.localeCompare(a.ano); });
  }
  function cobrancaResumo(cs){
    var nomes = cs.slice(0, 3).map(function(c){ return c.rotulo; }).join(' · ');
    return '📝 Cobrado em ' + cs.length + (cs.length === 1 ? ' prova: ' : ' provas: ') + nomes + (cs.length > 3 ? ' e mais ' + (cs.length - 3) : '');
  }
  function carregarCobrancas(){
    fetch(COBRANCAS_JSON, { cache: 'no-cache' })
      .then(function(r){ if (!r.ok) throw new Error(r.status); return r.json(); })
      .then(function(j){ COB = j; DATA.forEach(function(d){ d._busca = null; }); render(); })
      .catch(function(){ /* sem as cobranças, a página segue igual */ });
  }
  var limite = LOTE_INICIAL;
  var state = { q:'', org:'all', risk:'all', area:null };

  // O rótulo acima do título ("Dossiê de jurisprudência · Magistratura") está
  // no HTML da página do Blogger; como o Diário deixou de ser só da
  // magistratura, tira o " · Magistratura" daqui (vale mesmo sem editar o HTML).
  (function(){
    var w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT), n;
    while ((n = w.nextNode())) {
      if (/Dossiê de jurisprudência\s*·\s*Magistratura/i.test(n.nodeValue)) {
        n.nodeValue = n.nodeValue.replace(/\s*·\s*Magistratura/i, '');
        break;
      }
    }
  })();

  // Nem todo precedente qualificado do STJ é "Tema": também há IAC
  // (Incidente de Assunção de Competência) e PUIL (Pedido de Uniformização
  // de Interpretação de Lei), que não podem ser rotulados como "Tema" nem
  // como "Recurso Repetitivo" sem incorrer em erro técnico.
  var PRECEDENTE_NOME = { IAC: 'Incidente de Assunção de Competência', PUIL: 'Pedido de Uniformização de Interpretação de Lei' };
  function precedenteBadge(d){ return (d.precedenteLabel || 'Tema') + ' ' + d.tema; }
  function precedenteAreaLine(d){
    if (d.tipoNome) return ' · ' + d.tipoNome;
    if (d.tipo === 'rg') return ' · Repercussão Geral';
    var lbl = d.precedenteLabel;
    return ' · ' + (lbl && PRECEDENTE_NOME[lbl] ? PRECEDENTE_NOME[lbl] : 'Recurso Repetitivo');
  }

  // Progresso no mesmo formato dos outros diários: { "<id>": { lida:true, lidaEm:"AAAA-MM-DD" } }
  // (a página "Meus Prêmios" lê esta chave: "decisoes-lidas").
  var LOCAL_KEY = 'decisoes-lidas';
  var OLD_KEY = 'rg-repetitivos-lidos';   // versão anterior (só true/false por id)
  function todayIso(){
    var d = new Date(), p = function(n){ return String(n).padStart(2,'0'); };
    return d.getFullYear() + '-' + p(d.getMonth()+1) + '-' + p(d.getDate());
  }
  function isRead(v){ return !!(v && (v === true || v.lida)); }
  function readLocal(){
    var map = {};
    try { var raw = localStorage.getItem(LOCAL_KEY); if(raw) map = JSON.parse(raw) || {}; } catch(e){}
    try {
      var old = localStorage.getItem(OLD_KEY);
      if(old){
        var o = JSON.parse(old) || {};
        Object.keys(o).forEach(function(k){ if(o[k] && !isRead(map[k])) map[k] = { lida:true, lidaEm:null }; });
        localStorage.setItem(LOCAL_KEY, JSON.stringify(map));
        localStorage.removeItem(OLD_KEY);
      }
    } catch(e){}
    return map;
  }
  function writeLocal(map){
    try { localStorage.setItem(LOCAL_KEY, JSON.stringify(map)); } catch(e){}
  }
  var lidos = readLocal();

  // ---- Sincronização: conta (Firestore) + grupos de estudo ---------------
  // O progresso vai para "progress-decisoes/{uid}" e o total lido vira o
  // campo "lidasDecisoes" no documento do membro de cada grupo (entra na
  // pontuação geral, junto com Informativos, Leis e Súmulas).
  var GS = window.GruposShared;
  var viewerId = null, progressDoc = null, syncTimer = null, applyingRemote = false;

  function totalLidos(){ return Object.keys(lidos).filter(function(k){ return isRead(lidos[k]); }).length; }

  function pushToGroups(){
    if(!GS || !viewerId) return;
    GS.readGroups().forEach(function(g){
      GS.updateMember(g.code, viewerId, {
        name: g.name, lidasDecisoes: totalLidos(),
        avatar: GS.readAvatarPref(), joinedAt: g.joinedAt
      }).catch(function(){});
    });
  }
  function pushProgress(){
    writeLocal(lidos);
    if(progressDoc){
      progressDoc.set({ map: lidos, updatedAt: new Date().toISOString() }).catch(function(){ progressDoc = null; });
    }
    pushToGroups();
  }
  function scheduleSync(){
    if(applyingRemote) return;
    if(syncTimer) clearTimeout(syncTimer);
    syncTimer = setTimeout(pushProgress, 700);
  }

  var areaChips = document.getElementById('areaChips');
  // Chips de matéria (refeitos quando os dados do TST chegam).
  function montarChips(){
    var cont = {};
    DATA.forEach(function(d){ cont[d.area] = (cont[d.area] || 0) + 1; });
    var areas = Object.keys(cont).sort(function(a,b){ return cont[b]-cont[a]; });
    areaChips.innerHTML = '';
    areas.forEach(function(a){
      var el = document.createElement('button');
      el.className = 'chip';
      el.innerHTML = escapeHtml(a) + ' <span class="n">' + cont[a] + '</span>';
      el.addEventListener('click', function(){
        state.area = (state.area === a) ? null : a;
        render();
      });
      el.dataset.area = a;
      areaChips.appendChild(el);
    });
  }

  // Nos dados o nível fica "Alta" / "Média" / "Baixa" (usado nos filtros e
  // nas cores); na tela concorda com "risco": alto, médio, baixo.
  var ROTULO_RISCO = { 'Alta': 'alto', 'Média': 'médio', 'Baixa': 'baixo' };
  function rotuloRisco(r){ return ROTULO_RISCO[r] || String(r||'').toLowerCase(); }

  document.getElementById('orgSeg').addEventListener('click', function(e){
    var btn = e.target.closest('button'); if(!btn) return;
    state.org = btn.dataset.org;
    limite = LOTE_INICIAL;
    [...this.children].forEach(b=>b.classList.toggle('active', b===btn));
    render();
  });

  document.querySelectorAll('.risk-btn').forEach(function(btn){
    if (ROTULO_RISCO[btn.dataset.r]) {
      var ultimo = btn.lastChild;
      if (ultimo && ultimo.nodeType === 3) {
        var t = ROTULO_RISCO[btn.dataset.r];
        ultimo.nodeValue = t.charAt(0).toUpperCase() + t.slice(1);
      }
    }
    btn.addEventListener('click', function(){
      state.risk = btn.dataset.r;
      document.querySelectorAll('.risk-btn').forEach(b=>b.classList.toggle('active', b===btn));
      render();
    });
  });

  var qInput = document.getElementById('q');
  var qTimer = null;
  qInput.addEventListener('input', function(){
    var v = this.value.trim().toLowerCase();
    clearTimeout(qTimer);
    qTimer = setTimeout(function(){ state.q = v; limite = LOTE_INICIAL; render(); }, 250);
  });

  // Botão "Minimizar": recolhe o painel de filtros (fixo no topo ao rolar)
  // para só a linha da busca + STF/STJ, liberando espaço para ler. Criado
  // aqui para não precisar mexer no HTML da página no Blogger. A escolha
  // fica salva no navegador.
  var TOOLBAR_KEY = 'decisoes-filtros-minimizados';
  var toolbar = document.querySelector('.toolbar');
  var firstRow = toolbar && toolbar.querySelector('.toolbar-inner > .row');
  if(firstRow){
    var toggleBtn = document.createElement('button');
    toggleBtn.type = 'button';
    toggleBtn.className = 'toolbar-toggle';
    firstRow.appendChild(toggleBtn);

    var setCollapsed = function(collapsed){
      toolbar.classList.toggle('is-collapsed', collapsed);
      toggleBtn.setAttribute('aria-expanded', String(!collapsed));
      // Minimizado com filtro de risco/matéria ativo: o botão avisa quantos,
      // já que esses filtros ficam escondidos.
      var hidden = (state.risk !== 'all' ? 1 : 0) + (state.area ? 1 : 0);
      toggleBtn.textContent = collapsed
        ? '▾ Filtros' + (hidden ? ' (' + hidden + ')' : '')
        : '▴ Minimizar';
      toggleBtn.title = collapsed ? 'Mostrar todos os filtros' : 'Recolher os filtros';
      try { localStorage.setItem(TOOLBAR_KEY, collapsed ? '1' : '0'); } catch(e){}
    };

    var startCollapsed = false;
    try { startCollapsed = localStorage.getItem(TOOLBAR_KEY) === '1'; } catch(e){}
    setCollapsed(startCollapsed);
    toggleBtn.addEventListener('click', function(){
      setCollapsed(!toolbar.classList.contains('is-collapsed'));
    });
  }

  document.getElementById('clearBtn').addEventListener('click', function(){
    state = { q:'', org:'all', risk:'all', area:null };
    limite = LOTE_INICIAL;
    qInput.value = '';
    document.querySelectorAll('.seg button').forEach(b=>b.classList.toggle('active', b.dataset.org==='all'));
    document.querySelectorAll('.risk-btn').forEach(b=>b.classList.toggle('active', b.dataset.r==='all'));
    render();
  });

  function escapeHtml(s){
    return String(s||'').replace(/[&<>"']/g, function(c){
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];
    });
  }

  function semAcento(t){ return String(t == null ? '' : t).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ''); }
  function termosBusca(){ return semAcento(state.q).split(/\s+/).filter(Boolean); }
  function textoBusca(d){
    if (d._busca == null) d._busca = semAcento([d.titulo,d.tese,d.questao,d.destaque,d.processo,d.relator,d.tema,d.area,
      d.precedenteLabel,d.orgao,d.tipoNome,d.historico,d.info,d.suspensao,d._resumo,
      cobrancasDe(d).map(function(c){ return 'cobrado prova ' + c.rotulo; }).join(' ')].join(' '));
    return d._busca;
  }
  function matches(d){
    if (GRUPOS[state.org]) { if (d.grupo !== state.org) return false; }
    else if(state.org !== 'all' && d.orgao !== state.org) return false;
    if(state.risk !== 'all' && d.risco !== state.risk) return false;
    if(state.area && d.area !== state.area) return false;
    var ts = termosBusca();
    if(ts.length){
      var hay = textoBusca(d);
      for (var i = 0; i < ts.length; i++) if (hay.indexOf(ts[i]) === -1) return false;
    }
    return true;
  }
  // "dd/mm/aaaa" ou "aaaa-mm-dd" → "aaaammdd" (para ordenar por data)
  function chaveData(v){
    var t = String(v || ''), m = /^(\d{2})\/(\d{2})\/(\d{4})/.exec(t);
    if (m) return m[3] + m[2] + m[1];
    m = /^(\d{4})-(\d{2})-(\d{2})/.exec(t);
    return m ? m[1] + m[2] + m[3] : '';
  }

  // ---- Controle de constitucionalidade (ADI, ADPF, ADC, ADO) ---------------
  // Antes era o Diário de Constitucionalidade; agora é um botão aqui. São
  // ~19 mil julgados, então ficam num módulo à parte (carregado só ao abrir
  // o botão) e paginados, em vez de entrar na lista comum.
  var CONTROLE_JS = 'https://barbarasinfronio-lgtm.github.io/diario-informativos/controleconst/controle-integrado.js';
  // Reclamações seguem o mesmo esquema (mesmo módulo, outros dados).
  var LISTAS_GRANDES = {
    CONTROLE:    { tipo: 'controle',    rotulo: 'Controle (ADI, ADPF…)', titulo: 'Controle de constitucionalidade: ADI, ADPF, ADC e ADO do STF' },
    RECLAMACOES: { tipo: 'reclamacoes', rotulo: 'Reclamações',            titulo: 'Reclamações julgadas pelo STF' }
  };
  var controles = {}, controlesP = {}, moduloP = null;
  function garantirBotoesListasGrandes(){
    var seg = document.getElementById('orgSeg');
    if (!seg) return;
    Object.keys(LISTAS_GRANDES).forEach(function(k){
      if (seg.querySelector('[data-org="' + k + '"]')) return;
      var b = document.createElement('button');
      b.dataset.org = k;
      b.textContent = LISTAS_GRANDES[k].rotulo;
      b.title = LISTAS_GRANDES[k].titulo;
      seg.appendChild(b);
    });
  }
  function garantirBotoesGrupos(){
    var seg = document.getElementById('orgSeg');
    if (!seg) return;
    var antesDe = seg.querySelector('[data-org="CONTROLE"]');
    Object.keys(GRUPOS).forEach(function(k){
      if (seg.querySelector('[data-org="' + k + '"]')) return;
      var b = document.createElement('button');
      b.dataset.org = k; b.textContent = GRUPOS[k].rotulo; b.title = GRUPOS[k].titulo;
      seg.insertBefore(b, antesDe || null);
    });
  }
  function carregarModulo(){
    if (window.ControleIntegrado) return Promise.resolve();
    if (!moduloP) {
      moduloP = fetch(CONTROLE_JS, { cache: 'no-cache' })
        .then(function(r){ if (!r.ok) throw new Error(r.status); return r.text(); })
        .then(function(code){ (0, eval)(code + '\n//# sourceURL=' + CONTROLE_JS); })
        .catch(function(e){ moduloP = null; throw e; });
    }
    return moduloP;
  }
  function carregarControle(org){
    if (controles[org]) return Promise.resolve(controles[org]);
    if (!controlesP[org]) {
      controlesP[org] = carregarModulo().then(function(){
        controles[org] = window.ControleIntegrado.montar({
          tipo: LISTAS_GRANDES[org].tipo,
          antes: document.getElementById('grid'),
          busca: function(){ return state.q; }
        });
        return controles[org];
      }).catch(function(e){ delete controlesP[org]; throw e; });
    }
    return controlesP[org];
  }
  // Some/volta o que só vale para a lista comum (cards, matérias, risco).
  function modoControle(ligado){
    ['grid','empty','areaChips','countLine'].forEach(function(id){
      var el = document.getElementById(id);
      if (el) el.style.display = ligado ? 'none' : '';
    });
    var rb = document.querySelector('.risk-btn');
    if (rb && rb.parentNode) rb.parentNode.style.display = ligado ? 'none' : '';
  }

  function riskOrder(r){ return r==='Alta'?0:r==='Média'?1:2; }

  var controleAtivo = null;   // qual lista grande está na tela (ou null)
  var controleMostrada = null;
  function dataBr(d){ return d.slice(6,8) + '/' + d.slice(4,6) + '/' + d.slice(0,4); }
  // Listas grandes que só são baixadas sob demanda (ao abrir o grupo ou
  // buscar): um índice leve e, ao abrir o card, o texto completo vindo de um
  // arquivo com 250 itens (pasta c/).
  var BASE_CDN = 'https://barbarasinfronio-lgtm.github.io/diario-informativos/';
  var SOB_DEMANDA = {
    ACORDAOS: {
      base: ACORDAOS_BASE, nome: 'os acórdãos do STJ', carregando: 'Carregando a ementa…',
      item: function(x){
        return { id: 'stj-acordao-' + x[0], grupo: 'ACORDAOS', orgao: 'STJ', tipo: 'acordao', tipoNome: 'Acórdão · ' + x[2],
          area: x[5], titulo: x[6], tese: x[6], destaque: x[7] ? x[7].charAt(0).toUpperCase() + x[7].slice(1) : '',
          processo: x[1], relator: x[3], data: dataBr(x[4]), risco: 'Média',
          motivo: 'acórdão julgado em ' + x[4].slice(0, 4) + ' — mostra como o STJ vem aplicando a jurisprudência no caso concreto',
          link: 'https://processo.stj.jus.br/processo/pesquisa/?tipoPesquisa=tipoPesquisaNumeroRegistro&termo=' + x[8],
          _chave: x[0], _parte: x[9] };
      },
      completar: function(d, x){
        d.tese = x.ementa;
        d.destaque = x.dec || d.destaque;
        d.historico = [x.pub ? 'Publicação: ' + x.pub : '', x.inf ? 'Informações complementares: ' + x.inf : '', x.notas ? 'Notas: ' + x.notas : ''].filter(Boolean).join('\n');
      }
    },
    // Julgados dos informativos do STJ e do STF (scripts/informativos_cards.py).
    INFORMATIVOS: {
      base: BASE_CDN + 'informativos/', nome: 'os informativos', carregando: 'Carregando o resumo do julgado…',
      item: function(x){
        var org = x[1];
        return { id: 'inf-' + x[0], grupo: 'INFORMATIVOS', orgao: org, tipo: 'informativo',
          tipoNome: x[9] || ('Informativo ' + org + (x[2] ? ' nº ' + x[2] : '')),
          _pv: /^pv-/.test(x[0]),
          area: x[3], titulo: x[4], tese: x[5], processo: x[6], data: x[7], info: x[2], risco: 'Alta',
          motivo: 'julgado divulgado em informativo — é a fonte que as bancas mais usam para cobrar jurisprudência recente',
          link: org === 'STJ' ? 'https://processo.stj.jus.br/jurisprudencia/externo/informativo/?acao=pesquisarumaedicao&livre=' + ('0000' + x[2]).slice(-4) + '.cod.'
            : 'https://portal.stf.jus.br/textos/verTexto.asp?servico=informativoSTF&pagina=Informativo' + x[2],
          _chave: x[0], _parte: x[8] };
      },
      completar: function(d, x){ d.destaque = x; }
    }
  };
  var sobDemanda = {};  // grupo -> { p, prontos, partes }
  function estadoSD(g){ return sobDemanda[g] || (sobDemanda[g] = { p: null, prontos: false, partes: {} }); }
  function carregarSobDemanda(g){
    var st = estadoSD(g), cfg = SOB_DEMANDA[g];
    if (st.p) return st.p;
    st.p = fetch(cfg.base + 'indice.json', { cache: 'no-cache' })
      .then(function(r){ if (!r.ok) throw new Error(r.status); return r.json(); })
      .then(function(j){
        DATA = DATA.concat((j.itens || []).map(cfg.item));
        st.prontos = true;
        montarChips(); renderStats(); render();
      })
      .catch(function(e){ st.p = null; if (window.console) console.warn('[decisoes] ' + g, e); });
    return st.p;
  }
  function completarSobDemanda(d){
    if (d._completo || d._parte == null) return Promise.resolve(d);
    var cfg = SOB_DEMANDA[d.grupo], st = estadoSD(d.grupo);
    var n = ('00' + d._parte).slice(-3);
    if (!st.partes[n]) st.partes[n] = fetch(cfg.base + 'c/' + n + '.json', { cache: 'no-cache' })
      .then(function(r){ if (!r.ok) throw new Error(r.status); return r.json(); })
      .catch(function(e){ delete st.partes[n]; throw e; });
    return st.partes[n].then(function(parte){
      var x = parte[d._chave];
      if (x) { cfg.completar(d, x); d._completo = true; d._busca = null; }
      return d;
    });
  }
  function aguardandoSobDemanda(ts){
    return Object.keys(SOB_DEMANDA).filter(function(g){
      var st = estadoSD(g); return !st.prontos && st.p && (state.org === g || ts.length);
    });
  }

  function render(){
    Object.keys(SOB_DEMANDA).forEach(function(g){ if (!estadoSD(g).prontos && (state.org === g || termosBusca().length)) carregarSobDemanda(g); });
    // busca precisa do texto completo (tese, destaque…), não só da lista leve
    if (termosBusca().length) fontesIncompletas().forEach(function(f){ completarFonte(f).catch(function(){}); });
    if (LISTAS_GRANDES[state.org]) {
      var org = state.org;
      if (controleAtivo && controleAtivo !== org && controles[controleAtivo]) controles[controleAtivo].esconder();
      controleAtivo = org;
      modoControle(true);
      document.getElementById('clearBtn').hidden = false;
      carregarControle(org).then(function(c){
        if (state.org !== org) return;
        if (controleMostrada !== org) { controleMostrada = org; c.mostrar(); } else c.buscaMudou();
      }).catch(function(e){ if (window.console) console.warn('[decisoes] lista grande', e); });
      return;
    }
    if (controleAtivo) {
      if (controles[controleAtivo]) controles[controleAtivo].esconder();
      controleAtivo = null;
      controleMostrada = null;
      modoControle(false);
    }
    areaChips.querySelectorAll('.chip').forEach(function(c){
      c.classList.toggle('active', c.dataset.area === state.area);
    });
    var anyFilter = state.q || state.org!=='all' || state.risk!=='all' || state.area;
    document.getElementById('clearBtn').hidden = !anyFilter;

    var ts = termosBusca();
    var list = DATA.filter(matches);
    if (state.org === 'all') {
      // "Todos": mais recentes primeiro
      list.sort(function(a,b){ var x = chaveData(a.data), y = chaveData(b.data); return x < y ? 1 : x > y ? -1 : 0; });
    } else {
      list.sort(function(a,b){
        var r = riskOrder(a.risco)-riskOrder(b.risco);
        if(r!==0) return r;
        return (b.data||'').split('/').reverse().join('') > (a.data||'').split('/').reverse().join('') ? 1 : -1;
      });
    }

    var grid = document.getElementById('grid');
    grid.innerHTML = '';
    var maisBtn = document.getElementById('maisDecisoes');
    if (!maisBtn) {
      maisBtn = document.createElement('button');
      maisBtn.id = 'maisDecisoes'; maisBtn.type = 'button'; maisBtn.className = 'chip';
      maisBtn.style.cssText = 'display:block;margin:16px auto';
      maisBtn.addEventListener('click', function(){ limite += ts2().length ? 50 : 10; render(); });
      grid.parentNode.insertBefore(maisBtn, grid.nextSibling);
    }
    // Busca em "Todos" (sem filtro de risco/matéria): procura também em
    // Controle e Reclamações (carregados só quando há busca).
    var buscaTotal = ts.length && state.org === 'all' && state.risk === 'all' && !state.area;
    var meu = ++seqBusca;
    var extras = [];
    function desenharTudo(){
      var todos = list.map(function(d){ return { d: d, k: chaveData(d.data) }; })
        .concat(extras.map(function(x){ return { x: x.it, c: x.c, k: chaveData(x.c.dataDe(x.it)) }; }));
      if (buscaTotal) todos.sort(function(a,b){ return a.k < b.k ? 1 : a.k > b.k ? -1 : 0; });
      var mostrar = Math.min(todos.length, ts.length ? Math.max(limite, 50) : limite);
      document.getElementById('countLine').textContent = ts.length
        ? todos.length + (todos.length === 1 ? ' decisão encontrada' : ' decisões encontradas') + (extras.length ? ' (' + extras.length + ' em Controle/Reclamações)' : '')
        : 'Mostrando ' + mostrar + ' de ' + list.length + ' decisões' + (state.org === 'all' ? ' (as mais recentes)' : '') + ' — pesquise para ver todas';
      document.getElementById('empty').hidden = todos.length > 0;
      if (ts.length && fontesIncompletas().length) document.getElementById('countLine').textContent += ' — carregando os textos completos para a busca…';
      var aguardando = aguardandoSobDemanda(ts);
      if (aguardando.length) {
        document.getElementById('countLine').textContent += (todos.length ? ' — ' : '') + 'carregando ' + aguardando.map(function(g){ return SOB_DEMANDA[g].nome; }).join(' e ') + '…';
        if (SOB_DEMANDA[state.org]) document.getElementById('empty').hidden = true;
      }
      grid.innerHTML = '';
      todos.slice(0, mostrar).forEach(function(t){
        if (t.d) desenharCard(t.d); else grid.appendChild(t.c.cartao(t.x));
      });
      maisBtn.hidden = mostrar >= todos.length;
      maisBtn.textContent = 'Mostrar mais (' + (todos.length - mostrar) + ' restantes)';
    }
    function ts2(){ return termosBusca(); }
    desenharTudo();
    if (buscaTotal) {
      document.getElementById('countLine').textContent += ' · buscando também em Controle e Reclamações…';
      Promise.all(Object.keys(LISTAS_GRANDES).map(function(org){
        return carregarControle(org).then(function(c){
          return c.buscarTudo(state.q).then(function(itens){ return itens.map(function(it){ return { it: it, c: c }; }); });
        }).catch(function(){ return []; });
      })).then(function(partes){
        if (meu !== seqBusca) return;
        extras = [].concat.apply([], partes);
        desenharTudo();
      });
    }
  }
  var seqBusca = 0;

  function desenharCard(d){
    var grid = document.getElementById('grid');
    (function(){
      var isReadNow = isRead(lidos[d.id]);
      var card = document.createElement('div');
      card.className = 'card' + (isReadNow ? ' is-read' : '') + (d.tipo === 'informativo' ? ' card-informativo' : '');
      card.innerHTML =
        '<div class="top-row">' +
          '<label class="read-check" title="Marcar como lido">' +
            '<input type="checkbox" class="read-checkbox"' + (isReadNow ? ' checked' : '') + '>' +
          '</label>' +
          '<span class="tag-org ' + escapeHtml(d.orgao) + '">' + escapeHtml(d.orgao) + '</span>' +
          '<span class="badge risk-' + escapeHtml(d.risco) + '">Risco ' + escapeHtml(rotuloRisco(d.risco)) + '</span>' +
          (d.tema ? '<span class="tag-tema">' + escapeHtml(precedenteBadge(d)) + '</span>' : '') +
          (d.status==='cancelado_superado' ? '<span class="tag-cancel">Cancelado/Superado</span>' : '') +
          (d.status==='afetado' ? '<span class="tag-afetado">Em julgamento</span>' : '') +
          (d.suspensao ? '<span class="tag-afetado" title="' + escapeHtml(d.suspensao) + '">Suspensão nacional</span>' : '') +
        '</div>' +
        '<div class="area-line">' + escapeHtml(d.area) + precedenteAreaLine(d) + '</div>' +
        '<h3>' + escapeHtml(d.titulo) + '</h3>' +
        '<div class="destaque">' + escapeHtml(d._resumo != null ? d._resumo : d.tipo === 'informativo' ? d.tese : (d.destaque||d.tese||d.questao||'')) + '</div>' +
        (cobrancasDe(d).length ? '<div class="cobrado">' + escapeHtml(cobrancaResumo(cobrancasDe(d))) + '</div>' : '') +
        '<div class="meta"><span>' + escapeHtml(d.processo||'') + '</span>' + (d.data ? '<span>' + d.data + '</span>' : '') + '</div>';

      var checkbox = card.querySelector('.read-checkbox');
      checkbox.addEventListener('click', function(e){ e.stopPropagation(); });
      checkbox.addEventListener('change', function(){
        if(checkbox.checked) lidos[d.id] = { lida:true, lidaEm: todayIso() }; else delete lidos[d.id];
        writeLocal(lidos);
        scheduleSync();
        card.classList.toggle('is-read', checkbox.checked);
        renderStats();
      });

      card.addEventListener('click', function(){ openModal(d); });
      grid.appendChild(card);
    })();
  }

  var overlay = document.getElementById('overlay');
  var modal = document.getElementById('modal');
  function openModal(d){
    if (d._f && !completo[d._f]) {
      modal.innerHTML = '<button class="close" aria-label="Fechar">✕</button><p style="padding:24px 4px">Carregando o texto completo…</p>';
      modal.querySelector('.close').addEventListener('click', closeModal);
      overlay.classList.add('open');
      completarFonte(d._f).then(function(){ if (overlay.classList.contains('open')) openModal(d); })
        .catch(function(){ modal.innerHTML = '<button class="close" aria-label="Fechar">✕</button><p style="padding:24px 4px">Não foi possível carregar o texto agora. Tente de novo.</p>'; modal.querySelector('.close').addEventListener('click', closeModal); });
      return;
    }
    if (d._parte != null && !d._completo) {
      modal.innerHTML = '<button class="close" aria-label="Fechar">✕</button><p style="padding:24px 4px">' + escapeHtml(SOB_DEMANDA[d.grupo].carregando) + '</p>';
      modal.querySelector('.close').addEventListener('click', closeModal);
      overlay.classList.add('open');
      completarSobDemanda(d).then(function(){ if (overlay.classList.contains('open')) openModal(d); })
        .catch(function(){ modal.innerHTML = '<button class="close" aria-label="Fechar">✕</button><p style="padding:24px 4px">Não foi possível carregar a ementa agora. Tente de novo.</p>'; modal.querySelector('.close').addEventListener('click', closeModal); });
      return;
    }
    modal.classList.toggle('modal-informativo', d.tipo === 'informativo');
    modal.innerHTML =
      '<button class="close" aria-label="Fechar">✕</button>' +
      '<div class="top-row">' +
        '<span class="tag-org ' + escapeHtml(d.orgao) + '">' + escapeHtml(d.orgao) + '</span>' +
        '<span class="badge risk-' + escapeHtml(d.risco) + '">Risco ' + escapeHtml(rotuloRisco(d.risco)) + '</span>' +
        (d.tema ? '<span class="tag-tema">' + escapeHtml(precedenteBadge(d)) + '</span>' : '') +
        (d.status==='cancelado_superado' ? '<span class="tag-cancel">Cancelado/Superado</span>' : '') +
        (d.status==='afetado' ? '<span class="tag-afetado">Em julgamento</span>' : '') +
        (d.suspensao ? '<span class="tag-afetado">Suspensão nacional</span>' : '') +
      '</div>' +
      '<div class="area-line" style="margin-top:8px">' + escapeHtml(d.area) + precedenteAreaLine(d) + '</div>' +
      '<h2>' + escapeHtml(d.titulo) + '</h2>' +
      (d.questao && !d.tese
        ? '<div class="section-label">Questão em julgamento (ainda sem tese)</div><div class="tese-text">' + escapeHtml(d.questao) + '</div>'
        : '<div class="section-label">' + (d.tipo==='oj' || d.tipo==='pn' ? 'Texto' : d.tipo==='teses' ? 'Tese' : d.tipo==='omissao' || d.tipo==='acordao' ? 'Ementa' : d.tipo==='covid' ? 'Decisão' : d.tipo==='resumo' ? 'Tese' : d.tipo==='informativo' ? (d._pv ? 'Decisão do Plenário' : 'Tese do julgado') : 'Tese fixada') + '</div><div class="tese-text">' + escapeHtml(d.tese||'—') + '</div>') +
      (d.destaque && d.destaque!==d.tese ? '<div class="section-label">' + (d.tipo==='resumo' ? 'Resultado' : d.tipo==='covid' ? 'Relatório' : d.tipo==='acordao' ? 'Decisão' : d.tipo==='informativo' ? (d._pv ? 'Controvérsia' : 'Resumo do julgado') : 'Destaque') + '</div><div class="destaque-text">' + escapeHtml(d.destaque) + '</div>' : '') +
      '<div class="fields">' +
        '<div><b>' + (d.tipo==='teses' ? 'Julgado mais recente' : 'Processo') + '</b>' + escapeHtml(d.processo||'—') + '</div>' +
        '<div><b>Relator(a)</b>' + escapeHtml(d.relator||'—') + '</div>' +
        '<div><b>' + (d.status==='afetado' ? 'Afetação' : (d.tipo==='oj' || d.tipo==='pn' || d.tipo==='teses') ? 'Publicação' : 'Julgamento') + '</b>' + escapeHtml(d.data||'—') + '</div>' +
        (d.tipo==='teses' || d.grupo ? '' : '<div><b>Informativo</b>' + escapeHtml(d.info||'—') + '</div>') +
        (d.suspensao ? '<div><b>Suspensão nacional</b>' + escapeHtml(d.suspensao.replace(/^Suspensão nacional /, '')) + '</div>' : '') +
      '</div>' +
      (d.historico ? '<div class="section-label">' + (d.tipo==='teses' ? 'Legislação e observações' : d.grupo ? 'Detalhes' : 'Histórico') + '</div><div class="historico-text">' + escapeHtml(d.historico) + '</div>' : '') +
      (cobrancasDe(d).length ? '<div class="section-label">Cobrado em provas</div><ul class="cobrado-lista">' + cobrancasDe(d).map(function(c){ return '<li>' + escapeHtml(c.rotulo) + ' — questão ' + c.questoes.join(', ') + '</li>'; }).join('') + '</ul>' : '') +
      (d.link ? '<a class="fonte-link" href="' + escapeHtml(d.link) + '" target="_blank" rel="noopener">Fonte oficial ↗</a>' : '') +
      '<div class="normas-box" hidden></div>' +
      '<div class="risk-box risk-' + escapeHtml(d.risco) + '"><b>Por que risco ' + escapeHtml(rotuloRisco(d.risco)) + '?</b>' + escapeHtml(d.motivo||'') + '</div>';
    modal.querySelector('.close').addEventListener('click', closeModal);
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    modalAtual = d;
    normasAtuais = null;
    mostrarNormas(d);
  }
  function closeModal(){
    overlay.classList.remove('open');
    document.body.style.overflow = '';
    modalAtual = null;
    normasAtuais = null;
  }

  // ---- normas do julgado --------------------------------------------------
  // Leis e resoluções citadas pelo número na tese/destaque (ex.: "Lei nº
  // 11.340/2006", "Resolução CNJ nº 547/2024"). Cada uma mostra se já foi
  // lida e uma setinha que abre a norma no Diário de Leis / Diário das
  // Resoluções, onde a pessoa marca a leitura. A lógica de achar e conferir
  // fica em normas-citadas.js, carregado só quando um card é aberto.
  var NORMAS_JS = 'https://barbarasinfronio-lgtm.github.io/diario-informativos/normas-citadas.js';
  var normasJs = null;
  var modalAtual = null;
  var normasAtuais = null;

  // leis-incluidas.js: botão "Incluir no meu Diário" nas normas fora dos Diários
  var INCLUIDAS_JS = 'https://barbarasinfronio-lgtm.github.io/diario-informativos/leis-incluidas.js';
  var incluidasJs = null;
  function carregarIncluidas(){
    if (window.LeisIncluidas) return Promise.resolve();
    if (!incluidasJs) {
      incluidasJs = fetch(INCLUIDAS_JS, { cache: 'no-cache' })
        .then(function(r){ if (!r.ok) throw new Error(r.status); return r.text(); })
        .then(function(code){
          (0, eval)(code + '\n//# sourceURL=' + INCLUIDAS_JS);
          LeisIncluidas.onChange(function(){ if (normasAtuais) preencherNormas(); });
        })
        .catch(function(e){ incluidasJs = null; throw e; });
    }
    return incluidasJs;
  }
  carregarIncluidas().catch(function(){});

  function carregarNormasCitadas(){
    if (window.NormasCitadas) return Promise.resolve();
    if (!normasJs) {
      // fetch "no-cache" em vez de <script src>, que o navegador guarda por dias
      normasJs = fetch(NORMAS_JS, { cache: 'no-cache' })
        .then(function(r){ if (!r.ok) throw new Error(r.status); return r.text(); })
        .then(function(code){ (0, eval)(code + '\n//# sourceURL=' + NORMAS_JS); })
        .catch(function(e){ normasJs = null; throw e; });
    }
    return normasJs;
  }

  function mostrarNormas(d){
    carregarNormasCitadas().then(function(){
      if (modalAtual !== d) return;
      var achadas = NormasCitadas.encontrar([d.titulo, d.tese, d.questao, d.destaque].join(' '), { data: d.data });
      if (!achadas.length) return;
      var box = modal.querySelector('.normas-box');
      box.hidden = false;
      box.innerHTML = '<div class="section-label">Normas do julgado</div><p class="normas-aviso">Carregando…</p>';
      return NormasCitadas.carregar().then(function(){
        if (modalAtual !== d) return;
        normasAtuais = achadas;
        preencherNormas();
      });
    }).catch(function(){});
  }

  function resumirTexto(t, max){
    t = String(t || '');
    return t.length > max ? t.slice(0, max).replace(/\s+\S*$/, '') + '…' : t;
  }

  function preencherNormas(){
    var box = modal.querySelector('.normas-box');
    if (!box || !normasAtuais) return;
    var itens = normasAtuais.map(NormasCitadas.resolver);
    var LI = window.LeisIncluidas;
    box.innerHTML = '<div class="section-label">Normas do julgado</div>' +
      '<ul class="normas-list">' + itens.map(function(n){
        // fora dos Diários: a pessoa pode incluir no próprio Diário de Leis
        var incluir = '';
        if (!n.noDiario && LI) {
          var ch = LI.chave(n.rotulo);
          if (LI.tem(ch)) {
            n.lida = LI.lida(ch);
            n.incluida = true;
            incluir = '<button type="button" class="norma-incluir is-incluida" data-remover="' + escapeHtml(ch) + '" title="Tirar do meu Diário de Leis">📌 No meu Diário</button>';
          } else {
            incluir = '<button type="button" class="norma-incluir" data-incluir="' + escapeHtml(n.rotulo) + '" data-nome="' + escapeHtml(n.nome || '') + '" data-href="' + escapeHtml(n.href) + '" title="Incluir esta norma no meu Diário de Leis">➕ Incluir no meu Diário</button>';
          }
        }
        var status = n.lida ? '✅ Lida' : (n.noDiario ? 'Ainda não lida' : (n.incluida ? 'Ainda não lida' : 'Fora dos Diários'));
        var titulo = n.noDiario
          ? 'Abrir no ' + (/^Resolu|^Recomenda/.test(n.rotulo) ? 'Diário das Resoluções' : 'Diário de Leis') + ' para marcar a leitura'
          : 'Ainda não está nos Diários — abrir o texto oficial';
        return '<li class="norma-item' + (n.lida ? ' is-lida' : '') + (n.noDiario ? '' : ' is-fora') + '">' +
          '<div class="norma-info"><span class="norma-rotulo">' + escapeHtml(n.rotulo) + '</span>' +
            (n.artigos && n.artigos.length ? '<span class="norma-artigos">' + escapeHtml(n.artigos.join(' · ')) + '</span>' : '') +
            (n.nome ? '<span class="norma-nome">' + escapeHtml(resumirTexto(n.nome, 110)) + '</span>' : '') + '</div>' +
          '<span class="norma-status">' + status + '</span>' + incluir +
          '<a class="norma-link" href="' + escapeHtml(n.href) + '" target="_blank" rel="noopener" title="' + escapeHtml(titulo) + '" aria-label="' + escapeHtml(n.rotulo + ': ' + titulo) + '">' + (n.noDiario ? '➡️' : '↗') + '</a>' +
        '</li>';
      }).join('') + '</ul>' + '<p class="normas-aviso normas-incluir-msg" hidden></p>';
  }

  // "Incluir no meu Diário" / "No meu Diário" (tirar): só para quem entrou
  document.addEventListener('click', function(e){
    var b = e.target.closest('.norma-incluir');
    if (!b || !window.LeisIncluidas) return;
    var msg = modal.querySelector('.normas-incluir-msg');
    function aviso(t){ if (msg) { msg.textContent = t; msg.hidden = !t; } }
    if (!LeisIncluidas.logado()) {
      aviso('Para incluir leis no seu Diário, entre com o Google ou com e-mail e senha (botão “Entrar para salvar seu progresso”, no topo da página).');
      return;
    }
    b.disabled = true;
    var p = b.hasAttribute('data-remover')
      ? LeisIncluidas.remover(b.getAttribute('data-remover'))
      : LeisIncluidas.incluir({ rotulo: b.getAttribute('data-incluir'), nome: b.getAttribute('data-nome'), href: b.getAttribute('data-href') });
    p.then(function(){
      aviso(b.hasAttribute('data-remover') ? '' : 'Incluída no seu Diário de Leis — marque a leitura por lá.');
    }).catch(function(){ b.disabled = false; aviso('Não foi possível salvar agora. Tente de novo em instantes.'); });
  });

  // A pessoa marca a leitura em outra aba; ao voltar, o card atualiza.
  function atualizarNormas(){ if (normasAtuais && !document.hidden) preencherNormas(); }
  window.addEventListener('focus', atualizarNormas);
  document.addEventListener('visibilitychange', atualizarNormas);
  overlay.addEventListener('click', function(e){ if(e.target===overlay) closeModal(); });
  document.addEventListener('keydown', function(e){ if(e.key==='Escape') closeModal(); });

  function renderStats(){
    var stf = DATA.filter(d=>d.orgao==='STF' && !d.grupo).length;
    var extras = DATA.filter(d=>d.grupo && d.orgao==='STF').length;
    var acordaos = DATA.filter(d=>d.grupo==='ACORDAOS').length;
    var informativos = DATA.filter(d=>d.grupo==='INFORMATIVOS').length;
    var stj = DATA.filter(d=>d.orgao==='STJ' && d.tipo!=='teses' && !d.grupo).length;
    var teses = DATA.filter(d=>d.tipo==='teses').length;
    var tst = DATA.filter(d=>d.orgao==='TST').length;
    var alta = DATA.filter(d=>d.risco==='Alta').length;
    var canc = DATA.filter(d=>d.status==='cancelado_superado').length;
    var lidasCount = totalLidos();
    var el = document.getElementById('stats');
    el.innerHTML =
      '<div class="stat"><b>' + DATA.length + '</b><span>Julgados no total</span></div>' +
      '<div class="stat" style="color:var(--low-fg)"><b>' + lidasCount + '</b><span>Lidas</span></div>' +
      '<div class="stat"><b>' + stf + '</b><span>STF · Rep. Geral</span></div>' +
      '<div class="stat"><b>' + stj + '</b><span>STJ · Repetitivos</span></div>' +
      (teses ? '<div class="stat"><b>' + teses + '</b><span>STJ · Jurisprudência em Teses</span></div>' : '') +
      (tst ? '<div class="stat"><b>' + tst + '</b><span>TST · OJs, PNs e IRR</span></div>' : '') +
      (extras ? '<div class="stat"><b>' + extras + '</b><span>STF · Omissões, resumos e COVID-19</span></div>' : '') +
      (informativos ? '<div class="stat"><b>' + informativos + '</b><span>Julgados de informativos</span></div>' : '') +
      (acordaos ? '<div class="stat"><b>' + acordaos + '</b><span>STJ · Acórdãos de turmas</span></div>' : '') +
      '<div class="stat" style="color:var(--high-fg)"><b>' + alta + '</b><span>Risco alto</span></div>' +
      (canc ? '<div class="stat" style="color:var(--high-fg)"><b>' + canc + '</b><span>Canceladas/superadas</span></div>' : '');
  }

  // Se a pessoa fechar a aba dentro da janela de espera do debounce (700ms),
  // grava agora em vez de perder a última marcação (ao menos localmente —
  // o envio ao Firestore, se der tempo, também é disparado).
  window.addEventListener('beforeunload', function(){
    if(syncTimer){ clearTimeout(syncTimer); pushProgress(); }
  });

  // Botão "TST" no filtro de tribunal (o HTML da página só tem STF e STJ).
  function garantirBotaoTST(){
    var seg = document.getElementById('orgSeg');
    if (!seg || seg.querySelector('[data-org="TST"]')) return;
    var b = document.createElement('button');
    b.dataset.org = 'TST';
    b.textContent = 'TST';
    seg.appendChild(b);
  }

  // ---- lista leve + texto completo sob demanda -------------------------------
  var FONTES_JSON = { teses: TESES_JSON, extras: EXTRAS_JSON, tst: TST_JSON };
  var carregandoFonte = {};
  function fontesIncompletas(){
    return ['rg', 'teses', 'extras', 'tst'].filter(function(f){ return !completo[f]; });
  }
  // leve/decisoes.json vem em colunas: { campos, tabelas, linhas } (campos com
  // poucos valores diferentes vêm como número da tabela; 0 = vazio)
  function lerLeve(j){
    var campos = j.campos || [], tab = j.tabelas || {};
    return (j.linhas || []).map(function(l){
      var d = {};
      for (var i = 0; i < campos.length && i < l.length; i++) {
        var k = campos[i], v = l[i];
        if (tab[k]) { if (v) d[k] = tab[k][v - 1]; }
        else if (v !== 0 && v !== '' && v != null) d[k] = v;
      }
      return d;
    });
  }
  function carregarLeve(){
    fetch(LEVE_JSON, { cache: 'no-cache' })
      .then(function(r){ if (!r.ok) throw new Error(r.status); return r.json(); })
      .then(function(j){
        DATA = DATA.concat(lerLeve(j).filter(function(d){ return !completo[d._f]; }));
        garantirBotaoTST();
        garantirBotoesGrupos();
        montarChips(); renderStats(); render();
      })
      .catch(function(){
        // sem a lista leve: baixa os arquivos completos, como antes
        fontesIncompletas().forEach(function(f){ completarFonte(f).catch(function(){}); });
      });
  }
  // baixa o arquivo completo de uma fonte e completa os itens da lista leve
  // (ou acrescenta os itens, se a lista leve não veio)
  function completarFonte(f){
    if (completo[f]) return Promise.resolve();
    if (carregandoFonte[f]) return carregandoFonte[f];
    var p = f === 'rg'
      ? fetch(RG_JS, { cache: 'no-cache' })
          .then(function(r){ if (!r.ok) throw new Error(r.status); return r.text(); })
          .then(function(code){ (0, eval)(code + '\n//# sourceURL=' + RG_JS); return window.RG_REPETITIVOS_DATA || []; })
      : fetch(FONTES_JSON[f], { cache: 'no-cache' })
          .then(function(r){ if (!r.ok) throw new Error(r.status); return r.json(); })
          .then(function(j){ return (j && j.itens) || []; });
    carregandoFonte[f] = p.then(function(lista){
      var porId = {}, novos = [];
      DATA.forEach(function(d){ if (d._f === f) porId[String(d.id)] = d; });
      lista.forEach(function(x){
        var d = porId[String(x.id)];
        if (!d) { novos.push(x); return; }
        for (var k in x) d[k] = x[k];
        delete d._resumo;
        d._busca = null;
      });
      if (novos.length) DATA = DATA.concat(novos);
      completo[f] = true;
      if (f === 'tst') garantirBotaoTST();
      if (f === 'extras') garantirBotoesGrupos();
      montarChips(); renderStats(); render();
    }).catch(function(e){ delete carregandoFonte[f]; throw e; });
    return carregandoFonte[f];
  }

  montarChips();
  renderStats();
  render();
  garantirBotoesListasGrandes();
  garantirBotoesGrupos();
  carregarLeve();
  carregarCobrancas();

  if(GS && window.firebase && window.DIARIO_FIREBASE_CONFIG){
    GS.onViewerReady(function(uid){
      if(viewerId === uid) return;
      viewerId = uid;
      progressDoc = firebase.firestore().doc('progress-decisoes/' + uid);
      progressDoc.onSnapshot(function(snap){
        if(!snap.exists){ pushProgress(); return; }
        var data = snap.data() || {};
        if(data.map){
          // une a nuvem com o que foi marcado neste aparelho (desmarcar só vale aqui, na hora)
          applyingRemote = true;
          Object.keys(data.map).forEach(function(k){ if(isRead(data.map[k]) && !isRead(lidos[k])) lidos[k] = data.map[k]; });
          writeLocal(lidos);
          renderStats(); render();
          applyingRemote = false;
        }
        pushToGroups();
      }, function(){ progressDoc = null; });
      pushToGroups();
    });
  }

  // fetch sem cache + eval: uma cópia antiga de conta-google.js guardada
  // pelo navegador (ou já carregada pelo HTML) não pode tomar o lugar do
  // quadro de login atual — a versão nova assume mesmo se a antiga já rodou.
  function carregarContaGoogle(url) {
    if ((window.ContaGoogle && window.ContaGoogle.iniciar) || window.EstudaManaContaCarregando) return;
    window.EstudaManaContaCarregando = true;
    fetch(url, { cache: "no-cache" })
      .then(function (r) { if (!r.ok) throw new Error("conta-google.js"); return r.text(); })
      .then(function (code) { (0, eval)(code); })
      .catch(function () { window.EstudaManaContaCarregando = false; });
  }

  // ---- conta Google ---------------------------------------------------
  // Esta página não tem o painel "Acessar de qualquer aparelho" no HTML
  // (conta-google.js procura por #account-panel) — criamos um antes das
  // estatísticas, e carregamos conta-google.js da mesma pasta deste
  // script (só quem entra com Google ou e-mail e senha salva na nuvem).
  if (window.firebase && window.DIARIO_FIREBASE_CONFIG) {
    if (!document.getElementById('account-panel')) {
      var panel = document.createElement('div');
      panel.id = 'account-panel';
      var statsEl = document.getElementById('stats');
      if (statsEl && statsEl.parentNode) statsEl.parentNode.insertBefore(panel, statsEl);
      else document.body.insertBefore(panel, document.body.firstChild);
    }
    var all0 = document.getElementsByTagName('script'), src = '';
    for (var i = 0; i < all0.length; i++) {
      if (/rg-repetitivos-logic\.js/.test(all0[i].src)) { src = all0[i].src; break; }
    }
    // páginas que baixam os scripts com fetch + eval (sem <script src>): usa o CDN
    if (!src) src = 'https://barbarasinfronio-lgtm.github.io/diario-informativos/rg-repetitivos-logic.js';
    carregarContaGoogle(src.replace(/[^/]+\.js(\?.*)?$/, 'conta-google.js'));
  }
})();
