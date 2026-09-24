(function(){
  var DATA = RG_REPETITIVOS_DATA;
  var state = { q:'', org:'all', risk:'all', area:null };

  // Nem todo precedente qualificado do STJ é "Tema": também há IAC
  // (Incidente de Assunção de Competência) e PUIL (Pedido de Uniformização
  // de Interpretação de Lei), que não podem ser rotulados como "Tema" nem
  // como "Recurso Repetitivo" sem incorrer em erro técnico.
  var PRECEDENTE_NOME = { IAC: 'Incidente de Assunção de Competência', PUIL: 'Pedido de Uniformização de Interpretação de Lei' };
  function precedenteBadge(d){ return (d.precedenteLabel || 'Tema') + ' ' + d.tema; }
  function precedenteAreaLine(d){
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

  var areas = [...new Set(DATA.map(d=>d.area))].sort((a,b)=>{
    var ca = DATA.filter(d=>d.area===a).length, cb = DATA.filter(d=>d.area===b).length;
    return cb-ca;
  });

  var areaChips = document.getElementById('areaChips');
  areas.forEach(function(a){
    var n = DATA.filter(d=>d.area===a).length;
    var el = document.createElement('button');
    el.className = 'chip';
    el.innerHTML = a + ' <span class="n">' + n + '</span>';
    el.addEventListener('click', function(){
      state.area = (state.area === a) ? null : a;
      render();
    });
    el.dataset.area = a;
    areaChips.appendChild(el);
  });

  document.getElementById('orgSeg').addEventListener('click', function(e){
    var btn = e.target.closest('button'); if(!btn) return;
    state.org = btn.dataset.org;
    [...this.children].forEach(b=>b.classList.toggle('active', b===btn));
    render();
  });

  document.querySelectorAll('.risk-btn').forEach(function(btn){
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
    return (s||'').replace(/[&<>"']/g, function(c){
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];
    });
  }

  function matches(d){
    if(state.org !== 'all' && d.orgao !== state.org) return false;
    if(state.risk !== 'all' && d.risco !== state.risk) return false;
    if(state.area && d.area !== state.area) return false;
    if(state.q){
      var hay = [d.titulo,d.tese,d.destaque,d.processo,d.relator,d.tema,d.area].join(' ').toLowerCase();
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
          '<span class="badge risk-' + escapeHtml(d.risco) + '">Risco ' + escapeHtml(d.risco) + '</span>' +
          (d.tema ? '<span class="tag-tema">' + escapeHtml(precedenteBadge(d)) + '</span>' : '') +
          (d.status==='cancelado_superado' ? '<span class="tag-cancel">Cancelado/Superado</span>' : '') +
        '</div>' +
        '<div class="area-line">' + escapeHtml(d.area) + precedenteAreaLine(d) + '</div>' +
        '<h3>' + escapeHtml(d.titulo) + '</h3>' +
        '<div class="destaque">' + escapeHtml(d.destaque||d.tese||'') + '</div>' +
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
        '<span class="badge risk-' + escapeHtml(d.risco) + '">Risco ' + escapeHtml(d.risco) + '</span>' +
        (d.tema ? '<span class="tag-tema">' + escapeHtml(precedenteBadge(d)) + '</span>' : '') +
        (d.status==='cancelado_superado' ? '<span class="tag-cancel">Cancelado/Superado</span>' : '') +
      '</div>' +
      '<div class="area-line" style="margin-top:8px">' + escapeHtml(d.area) + precedenteAreaLine(d) + '</div>' +
      '<h2>' + escapeHtml(d.titulo) + '</h2>' +
      '<div class="section-label">Tese fixada</div>' +
      '<div class="tese-text">' + escapeHtml(d.tese||'—') + '</div>' +
      (d.destaque && d.destaque!==d.tese ? '<div class="section-label">Destaque</div><div class="destaque-text">' + escapeHtml(d.destaque) + '</div>' : '') +
      '<div class="fields">' +
        '<div><b>Processo</b>' + escapeHtml(d.processo||'—') + '</div>' +
        '<div><b>Relator(a)</b>' + escapeHtml(d.relator||'—') + '</div>' +
        '<div><b>Julgamento</b>' + escapeHtml(d.data||'—') + '</div>' +
        '<div><b>Informativo</b>' + escapeHtml(d.info||'—') + '</div>' +
      '</div>' +
      '<div class="risk-box risk-' + escapeHtml(d.risco) + '"><b>Por que risco ' + escapeHtml(d.risco) + '?</b>' + escapeHtml(d.motivo||'') + '</div>';
    modal.querySelector('.close').addEventListener('click', closeModal);
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeModal(){
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }
  overlay.addEventListener('click', function(e){ if(e.target===overlay) closeModal(); });
  document.addEventListener('keydown', function(e){ if(e.key==='Escape') closeModal(); });

  function renderStats(){
    var stf = DATA.filter(d=>d.orgao==='STF').length;
    var stj = DATA.filter(d=>d.orgao==='STJ').length;
    var alta = DATA.filter(d=>d.risco==='Alta').length;
    var canc = DATA.filter(d=>d.status==='cancelado_superado').length;
    var lidasCount = totalLidos();
    var el = document.getElementById('stats');
    el.innerHTML =
      '<div class="stat"><b>' + DATA.length + '</b><span>Teses no total</span></div>' +
      '<div class="stat" style="color:var(--low-fg)"><b>' + lidasCount + '</b><span>Lidas</span></div>' +
      '<div class="stat"><b>' + stf + '</b><span>STF · Rep. Geral</span></div>' +
      '<div class="stat"><b>' + stj + '</b><span>STJ · Repetitivos</span></div>' +
      '<div class="stat" style="color:var(--high-fg)"><b>' + alta + '</b><span>Risco alta</span></div>' +
      (canc ? '<div class="stat" style="color:var(--high-fg)"><b>' + canc + '</b><span>Canceladas/superadas</span></div>' : '');
  }

  // Se a pessoa fechar a aba dentro da janela de espera do debounce (700ms),
  // grava agora em vez de perder a última marcação (ao menos localmente —
  // o envio ao Firestore, se der tempo, também é disparado).
  window.addEventListener('beforeunload', function(){
    if(syncTimer){ clearTimeout(syncTimer); pushProgress(); }
  });

  renderStats();
  render();

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

  // ---- conta Google ---------------------------------------------------
  // Esta página não tem o painel "Acessar de qualquer aparelho" no HTML
  // (conta-google.js procura por #account-panel) — criamos um antes das
  // estatísticas, e carregamos conta-google.js da mesma pasta deste
  // script (o login anônimo já é cuidado pelo GS.onViewerReady acima).
  if (window.firebase && window.DIARIO_FIREBASE_CONFIG) {
    if (!document.getElementById('account-panel')) {
      var panel = document.createElement('div');
      panel.id = 'account-panel';
      var statsEl = document.getElementById('stats');
      if (statsEl && statsEl.parentNode) statsEl.parentNode.insertBefore(panel, statsEl);
      else document.body.insertBefore(panel, document.body.firstChild);
    }
    if (!window.ContaGoogle && !document.getElementById('conta-google-js')) {
      var all0 = document.getElementsByTagName('script'), src = '';
      for (var i = 0; i < all0.length; i++) {
        if (/rg-repetitivos-logic\.js/.test(all0[i].src)) { src = all0[i].src; break; }
      }
      if (src) {
        var s = document.createElement('script');
        s.id = 'conta-google-js';
        s.src = src.replace(/[^/]+\.js(\?.*)?$/, 'conta-google.js$1');
        document.head.appendChild(s);
      }
    }
  }
})();
