(function(){
  var DATA = RG_REPETITIVOS_DATA;
  var state = { q:'', org:'all', risk:'all', area:null };

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
      var card = document.createElement('div');
      card.className = 'card';
      card.innerHTML =
        '<div class="top-row">' +
          '<span class="tag-org ' + d.orgao + '">' + d.orgao + '</span>' +
          '<span class="badge risk-' + d.risco + '">Risco ' + d.risco + '</span>' +
          (d.tema ? '<span class="tag-tema">Tema ' + escapeHtml(d.tema) + '</span>' : '') +
          (d.status==='cancelado_superado' ? '<span class="tag-cancel">Cancelado/Superado</span>' : '') +
        '</div>' +
        '<div class="area-line">' + escapeHtml(d.area) + (d.tipo==='rg' ? ' · Repercussão Geral' : ' · Recurso Repetitivo') + '</div>' +
        '<h3>' + escapeHtml(d.titulo) + '</h3>' +
        '<div class="destaque">' + escapeHtml(d.destaque||d.tese||'') + '</div>' +
        '<div class="meta"><span>' + escapeHtml(d.processo||'') + '</span>' + (d.data ? '<span>' + d.data + '</span>' : '') + '</div>';
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
        '<span class="tag-org ' + d.orgao + '">' + d.orgao + '</span>' +
        '<span class="badge risk-' + d.risco + '">Risco ' + d.risco + '</span>' +
        (d.tema ? '<span class="tag-tema">Tema ' + escapeHtml(d.tema) + '</span>' : '') +
        (d.status==='cancelado_superado' ? '<span class="tag-cancel">Cancelado/Superado</span>' : '') +
      '</div>' +
      '<div class="area-line" style="margin-top:8px">' + escapeHtml(d.area) + (d.tipo==='rg' ? ' · Repercussão Geral' : ' · Recurso Repetitivo') + '</div>' +
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
      '<div class="risk-box risk-' + d.risco + '"><b>Por que risco ' + d.risco + '?</b>' + escapeHtml(d.motivo||'') + '</div>';
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
    var el = document.getElementById('stats');
    el.innerHTML =
      '<div class="stat"><b>' + DATA.length + '</b><span>Teses no total</span></div>' +
      '<div class="stat"><b>' + stf + '</b><span>STF · Rep. Geral</span></div>' +
      '<div class="stat"><b>' + stj + '</b><span>STJ · Repetitivos</span></div>' +
      '<div class="stat" style="color:var(--high-fg)"><b>' + alta + '</b><span>Risco alta</span></div>' +
      (canc ? '<div class="stat" style="color:var(--high-fg)"><b>' + canc + '</b><span>Canceladas/superadas</span></div>' : '');
  }

  renderStats();
  render();
})();
