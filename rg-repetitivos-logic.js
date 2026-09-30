(function(){
  // STF/STJ vêm de rg-repetitivos-data.js; as OJs, Precedentes Normativos e
  // temas de IRR do TST vêm de tst/decisoes.json (gerado toda semana por
  // scripts/atualizar_tst.py) e entram na lista assim que chegam.
  var DATA = RG_REPETITIVOS_DATA.slice();
  var TST_JSON = 'https://cdn.jsdelivr.net/gh/barbarasinfronio-lgtm/diario-informativos@main/tst/decisoes.json';
  // Jurisprudência em Teses do STJ: uma tese por card, com o texto completo
  // (gerado pelo robô do Mac, scripts/atualizar_informativos.py → stj/teses.json).
  var TESES_JSON = 'https://cdn.jsdelivr.net/gh/barbarasinfronio-lgtm/diario-informativos@main/stj/teses.json';
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
  qInput.addEventListener('input', function(){ state.q = this.value.trim().toLowerCase(); render(); });

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

  function matches(d){
    if(state.org !== 'all' && d.orgao !== state.org) return false;
    if(state.risk !== 'all' && d.risco !== state.risk) return false;
    if(state.area && d.area !== state.area) return false;
    if(state.q){
      var hay = [d.titulo,d.tese,d.questao,d.destaque,d.processo,d.relator,d.tema,d.area,d.precedenteLabel,d.orgao].join(' ').toLowerCase();
      if(hay.indexOf(state.q) === -1) return false;
    }
    return true;
  }

  function riskOrder(r){ return r==='Alta'?0:r==='Média'?1:2; }

  function render(){
    areaChips.querySelectorAll('.chip').forEach(function(c){
      c.classList.toggle('active', c.dataset.area === state.area);
    });
    var anyFilter = state.q || state.org!=='all' || state.risk!=='all' || state.area;
    document.getElementById('clearBtn').hidden = !anyFilter;

    var list = DATA.filter(matches).sort(function(a,b){
      var r = riskOrder(a.risco)-riskOrder(b.risco);
      if(r!==0) return r;
      return (b.data||'').split('/').reverse().join('') > (a.data||'').split('/').reverse().join('') ? 1 : -1;
    });

    document.getElementById('countLine').textContent = list.length + ' de ' + DATA.length + ' teses';
    var grid = document.getElementById('grid');
    grid.innerHTML = '';
    document.getElementById('empty').hidden = list.length>0;

    list.forEach(function(d){
      var isReadNow = isRead(lidos[d.id]);
      var card = document.createElement('div');
      card.className = 'card' + (isReadNow ? ' is-read' : '');
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
        '</div>' +
        '<div class="area-line">' + escapeHtml(d.area) + precedenteAreaLine(d) + '</div>' +
        '<h3>' + escapeHtml(d.titulo) + '</h3>' +
        '<div class="destaque">' + escapeHtml(d.destaque||d.tese||d.questao||'') + '</div>' +
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
    });
  }

  var overlay = document.getElementById('overlay');
  var modal = document.getElementById('modal');
  function openModal(d){
    modal.innerHTML =
      '<button class="close" aria-label="Fechar">✕</button>' +
      '<div class="top-row">' +
        '<span class="tag-org ' + escapeHtml(d.orgao) + '">' + escapeHtml(d.orgao) + '</span>' +
        '<span class="badge risk-' + escapeHtml(d.risco) + '">Risco ' + escapeHtml(rotuloRisco(d.risco)) + '</span>' +
        (d.tema ? '<span class="tag-tema">' + escapeHtml(precedenteBadge(d)) + '</span>' : '') +
        (d.status==='cancelado_superado' ? '<span class="tag-cancel">Cancelado/Superado</span>' : '') +
        (d.status==='afetado' ? '<span class="tag-afetado">Em julgamento</span>' : '') +
      '</div>' +
      '<div class="area-line" style="margin-top:8px">' + escapeHtml(d.area) + precedenteAreaLine(d) + '</div>' +
      '<h2>' + escapeHtml(d.titulo) + '</h2>' +
      (d.questao && !d.tese
        ? '<div class="section-label">Questão em julgamento (ainda sem tese)</div><div class="tese-text">' + escapeHtml(d.questao) + '</div>'
        : '<div class="section-label">' + (d.tipo==='oj' || d.tipo==='pn' ? 'Texto' : d.tipo==='teses' ? 'Tese' : 'Tese fixada') + '</div><div class="tese-text">' + escapeHtml(d.tese||'—') + '</div>') +
      (d.destaque && d.destaque!==d.tese ? '<div class="section-label">Destaque</div><div class="destaque-text">' + escapeHtml(d.destaque) + '</div>' : '') +
      '<div class="fields">' +
        '<div><b>' + (d.tipo==='teses' ? 'Julgado mais recente' : 'Processo') + '</b>' + escapeHtml(d.processo||'—') + '</div>' +
        '<div><b>Relator(a)</b>' + escapeHtml(d.relator||'—') + '</div>' +
        '<div><b>' + (d.status==='afetado' ? 'Afetação' : (d.tipo==='oj' || d.tipo==='pn' || d.tipo==='teses') ? 'Publicação' : 'Julgamento') + '</b>' + escapeHtml(d.data||'—') + '</div>' +
        (d.tipo==='teses' ? '' : '<div><b>Informativo</b>' + escapeHtml(d.info||'—') + '</div>') +
      '</div>' +
      (d.historico ? '<div class="section-label">' + (d.tipo==='teses' ? 'Legislação e observações' : 'Histórico') + '</div><div class="historico-text">' + escapeHtml(d.historico) + '</div>' : '') +
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
  var NORMAS_JS = 'https://cdn.jsdelivr.net/gh/barbarasinfronio-lgtm/diario-informativos@main/normas-citadas.js';
  var normasJs = null;
  var modalAtual = null;
  var normasAtuais = null;

  // leis-incluidas.js: botão "Incluir no meu Diário" nas normas fora dos Diários
  var INCLUIDAS_JS = 'https://cdn.jsdelivr.net/gh/barbarasinfronio-lgtm/diario-informativos@main/leis-incluidas.js';
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
    var stf = DATA.filter(d=>d.orgao==='STF').length;
    var stj = DATA.filter(d=>d.orgao==='STJ' && d.tipo!=='teses').length;
    var teses = DATA.filter(d=>d.tipo==='teses').length;
    var tst = DATA.filter(d=>d.orgao==='TST').length;
    var alta = DATA.filter(d=>d.risco==='Alta').length;
    var canc = DATA.filter(d=>d.status==='cancelado_superado').length;
    var lidasCount = totalLidos();
    var el = document.getElementById('stats');
    el.innerHTML =
      '<div class="stat"><b>' + DATA.length + '</b><span>Teses no total</span></div>' +
      '<div class="stat" style="color:var(--low-fg)"><b>' + lidasCount + '</b><span>Lidas</span></div>' +
      '<div class="stat"><b>' + stf + '</b><span>STF · Rep. Geral</span></div>' +
      '<div class="stat"><b>' + stj + '</b><span>STJ · Repetitivos</span></div>' +
      (teses ? '<div class="stat"><b>' + teses + '</b><span>STJ · Jurisprudência em Teses</span></div>' : '') +
      (tst ? '<div class="stat"><b>' + tst + '</b><span>TST · OJs, PNs e IRR</span></div>' : '') +
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

  function carregarTST(){
    fetch(TST_JSON, { cache: 'no-cache' })
      .then(function(r){ if (!r.ok) throw new Error(r.status); return r.json(); })
      .then(function(j){
        var itens = (j && j.itens) || [];
        if (!itens.length) return;
        DATA = DATA.concat(itens);
        garantirBotaoTST();
        montarChips();
        renderStats();
        render();
      })
      .catch(function(){ /* sem o TST, a página segue só com STF e STJ */ });
  }
  function carregarTeses(){
    fetch(TESES_JSON, { cache: 'no-cache' })
      .then(function(r){ if (!r.ok) throw new Error(r.status); return r.json(); })
      .then(function(j){
        var itens = (j && j.itens) || [];
        if (!itens.length) return;
        DATA = DATA.concat(itens);
        montarChips();
        renderStats();
        render();
      })
      .catch(function(){ /* sem as Teses, a página segue com o resto */ });
  }

  montarChips();
  renderStats();
  render();
  carregarTST();
  carregarTeses();

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
    if (!src) src = 'https://cdn.jsdelivr.net/gh/barbarasinfronio-lgtm/diario-informativos@main/rg-repetitivos-logic.js';
    carregarContaGoogle(src.replace(/[^/]+\.js(\?.*)?$/, 'conta-google.js'));
  }
})();
