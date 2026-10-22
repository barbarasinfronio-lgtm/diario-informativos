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
  // Acórdãos do STF (pesquisa de jurisprudência do STF → scripts/acordaos_stf.py):
  // só os com conteúdo de estudo, desde 1988. Mesmo molde do STJ: lista leve em
  // stf/acordaos/indice.json e a ementa em stf/acordaos/c/NNN.json ao abrir o card.
  var ACORDAOS_STF_BASE = 'https://barbarasinfronio-lgtm.github.io/diario-informativos/stf/acordaos/';
  // Acórdãos do TST dos órgãos que firmam entendimento (Pleno, SDC e SDIs; scripts/acordaos_tst.py).
  var ACORDAOS_TST_BASE = 'https://barbarasinfronio-lgtm.github.io/diario-informativos/tst/acordaos/';
  var GRUPOS = {
    OMISSOES: { rotulo: 'Omissões', titulo: 'Omissões inconstitucionais reconhecidas pelo STF' },
    RESUMOS:  { rotulo: 'Resumos',  titulo: 'Resumos de decisões do STF (fatos, fundamentos, tese e placar)' },
    COVID:    { rotulo: 'COVID-19', titulo: 'Decisões do STF sobre a pandemia de COVID-19' },
    INFORMATIVOS: { rotulo: 'Informativos', titulo: 'Julgados dos informativos do STJ e do STF — tese e resumo' },
    ACORDAOS: { rotulo: 'Acórdãos STJ', titulo: 'Acórdãos de mérito do STJ (turmas, seções e Corte Especial) — ementa e decisão' },
    ACORDAOS_TST: { rotulo: 'Acórdãos TST', titulo: 'Acórdãos do TST (Pleno, SDC, SDI-1 e SDI-2) com conteúdo de estudo — ementa e dispositivo' },
    ACORDAOS_STF: { rotulo: 'Acórdãos STF', titulo: 'Acórdãos do STF (Plenário e Turmas) com conteúdo de estudo — ementa, tese e resultado' }
  };
  // Sem busca, a lista mostra só as mais recentes (10 de cada vez), para a
  // página não ficar pesada; com busca, mostra tudo o que combinar.
  var LOTE_INICIAL = 10;
  // Em quais provas de concurso cada decisão já foi cobrada
  // (scripts/cobrancas_provas.py → provas/cobrancas.json).
  var COBRANCAS_JSON = 'https://barbarasinfronio-lgtm.github.io/diario-informativos/provas/cobrancas.json';
  var COB = null;
  function cobrancasDe(d){
    var lst = [];
    if (COB) [d.id].concat(d.idsJuntados || []).forEach(function(x){ lst = lst.concat(COB.itens['dec:' + x] || []); });   // inclui os cards que este absorveu
    if (!lst.length) return [];
    var porProva = {};
    lst.forEach(function(x){ (porProva[x[0]] = porProva[x[0]] || []).push(x[1]); });
    // questão 0 = prova discursiva/oral que não foi separada em questões
    return Object.keys(porProva).map(function(pi){
      var p = COB.provas[pi];
      return { rotulo: p.rotulo + ' (' + p.banca + ')', ano: p.ano, questoes: porProva[pi].filter(function(n){ return n > 0; }) };
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
  // A mesma tese registrada em outro lugar (ex.: Edição 228 do Jurisprudência em Teses
  // e Tema 209 dos Repetitivos): um card só, com os dois números.
  function tambemTags(d){
    return (d.tambem || []).map(function(r){
      return '<span class="tag-tema" title="A mesma tese também está registrada como ' + escapeHtml(r) + '">' + escapeHtml(r) + '</span>';
    }).join('');
  }
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
  // Julgados de informativos importados antes de o robô guardar os parágrafos chegam num bloco só. Aqui o texto é
  // repartido em parágrafos (em fim de frase, a cada ~600 caracteres, ou antes de "Ademais", "Por fim", "Assim"…)
  // para ler melhor. Texto que já traz parágrafos (linha em branco) não é mexido.
  // Relator(a) e relator(a) para o acórdão, lidos do texto do processo dos julgados de informativos
  // ("REsp 1.894.973-PR, Rel. Ministro Raul Araújo, Rel. para acórdão Ministra Maria Isabel Gallotti, …",
  // "RE 888815/RS, rel. orig. Min. Roberto Barroso, red. p/ o acórdão Min. Alexandre de Moraes, …").
  function nomesDoProcesso(proc){
    var rel = [], red = [];
    function junta(lista, nome){
      nome = (nome || '').replace(/\s+/g, ' ').replace(/[\s.]+$/, '').trim();
      if (nome.length > 3 && nome.length < 70 && !/[\d.]/.test(nome) && nome.split(' ').length <= 6 && lista.indexOf(nome) < 0) lista.push(nome);
    }
    var T = '(?:(?:Min[a-z]*|Des[a-z]*|Juiz[a-z]*)\\.*\\s*)*';                                  // título é opcional ("rel. Marco Aurélio"); aceita erros de digitação da fonte
    var NOME = '((?:(?!\\s(?:julgamento|julgado|sess[ãa]o|DJ\\w*)\\b)[^,;(\\d])+)';             // até vírgula, parêntese, número ou "julgamento"
    var rxRed = new RegExp('(?:rel\\.?\\s*(?:p\\/|para)\\s*(?:o\\s*)?ac(?:[óo]rd[ãa]o|\\.)|red\\.\\s*p\\/\\s*(?:o\\s*)?ac(?:[óo]rd[ãa]o|\\.))\\s*' + T + NOME, 'gi');
    var rxRel = new RegExp('(?:relator(?:ia|a)?|rel\\.)(?!\\s*(?:p\\/|para))(?:\\s*(?:orig|origin|subst|venc?)[a-zá]*\\.?)?,?\\s*' + T + NOME, 'gi'), m;
    while ((m = rxRed.exec(proc || ''))) junta(red, m[1]);
    while ((m = rxRel.exec(proc || ''))) junta(rel, m[1]);
    if (!rel.length) { m = /^[^,]+,\s*Ministr[oa]\s+([^,;(]+),/.exec(proc || ''); if (m) junta(rel, m[1]); }
    if (!rel.length) { m = /(?:^|,)\s*(?:Min[a-z]*\.?\s+)?([A-ZÁÉÍÓÚÂÊÔÃÕÇ][^,;(\d.]+?),\s*(?:rel|red)\.\s*p\//.exec(proc || ''); if (m) junta(rel, m[1]); }   // "…, Ellen Gracie, rel. p/ acórdão Min. …"
    return { relator: rel.join(', '), redator: red.join(', ') };
  }
  var ABREV_PAR = /^(arts?|n|nº|nos|inc|incs|al|p|pp|fl|fls|min|rel|ed|cf|dec|etc|s|ss|v|cap|par|dr|dra|sr|sra|rec|resp|resps|ag|hc|rhc|re|are|adi|adpf|adc)$/i;
  var COMECO_PAR = /^(Ademais|Por fim|Assim|Ainda|No caso|Nesse contexto|Nesse sentido|Dessa forma|Em suma|Com efeito|Portanto|Logo|Contudo|Todavia|No entanto|Isso posto|Diante disso|Ressalte-se|Cumpre)\b/;
  function paragrafar(t){
    if (!t || typeof t !== 'string' || t.indexOf('\n') >= 0 || t.length < 900) return t;
    var frases = [], ini = 0, rx = /([.!?”"])\s+(?=[A-ZÁÉÍÓÚÂÊÔÃÕÇ“"])/g, m;
    while ((m = rx.exec(t))) {
      var antes = t.slice(ini, m.index + 1), ult = /([\wºª/]+)\.?$/.exec(t.slice(0, m.index + (m[1] === '.' ? 0 : 1)));
      if (m[1] === '.' && ult && (ABREV_PAR.test(ult[1]) || /^\d+$/.test(ult[1]) && /^\d/.test(t.slice(rx.lastIndex)))) continue;
      frases.push(antes); ini = rx.lastIndex;
    }
    frases.push(t.slice(ini));
    var paras = [], atual = '';
    frases.forEach(function(f){
      if (atual && (atual.length >= 600 || (atual.length >= 250 && COMECO_PAR.test(f)))) { paras.push(atual); atual = ''; }
      atual += (atual ? ' ' : '') + f;
    });
    if (atual) { if (paras.length && atual.length < 200) paras[paras.length - 1] += ' ' + atual; else paras.push(atual); }
    return paras.join('\n\n');
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
  // leitura marcada em outra aba (Cronograma, Revisões): atualiza os cards aqui
  window.addEventListener('storage', function(e){
    if(e.key !== LOCAL_KEY) return;
    lidos = readLocal();
    if(typeof render === 'function') render();
  });

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
    // busca só vale com pelo menos 2 caracteres (ex.: IR, ITCMD, IPTU); com 1, mostra a lista normal
    if (v.replace(/\s+/g, '').length < 2) v = '';
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

  function semAcento(t){ return String(t == null ? '' : t).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/(\d)\.(?=\d)/g, '$1'); }
  // "REsp 1880254/MT" e "AREsp 2840133-RN": a UF depois do número do processo não impede de achar o card (o índice guarda
  // "REsp 1880254", sem a UF). "547/2024" (número/ano) não é afetado: a UF tem de ser de letras.
  function termosBusca(){ return semAcento(state.q).replace(/(\d{4,})\s*[\/-]\s*([a-z]{2})(?![a-z0-9])/g, '$1').split(/\s+/).filter(Boolean); }
  // Siglas curtas (2 ou 3 letras: IR, STF, ECA) só valem como palavra inteira —
  // senão "ir" acharia "direito", "irregular"… Números e termos maiores: trecho.
  function contem(h, t){
    if (/^[a-z]{2,3}$/.test(t)) return new RegExp("(^|[^a-z0-9])" + t + "([^a-z0-9]|$)").test(h);
    return h.indexOf(t) !== -1;
  }
  function textoBusca(d){
    if (d._busca == null) d._busca = semAcento([d.titulo,d.tese,d.questao,d.destaque,d.processo,d.relator,d.tema,d.area,
      d.precedenteLabel,(d.tambem || []).join(' '),d.orgao,d.tipoNome,d.historico,d.info,d.suspensao,d._resumo,
      cobrancasDe(d).map(function(c){ return 'cobrado prova ' + c.rotulo; }).join(' ')].join(' '));
    return d._busca;
  }
  // Temas "em julgamento" (afetados, ainda sem tese) ficam só no botão
  // "Em julgamento" — não se misturam com o que já foi julgado.
  function emJulgamento(d){ return d.status === 'afetado'; }
  // Alguns temas em julgamento vêm com o título cortado (", nos contratos…",
  // sobra de "Definir se, nos contratos…"): mostra a partir da 1ª palavra.
  function tituloDe(d){
    var t = String(d.titulo || '');
    if (!/^[\s,;.:]/.test(t)) return t;
    t = t.replace(/^[\s,;.:]+/, '');
    return t.charAt(0).toUpperCase() + t.slice(1);
  }
  function matches(d){
    if (state.org === 'AFETADOS') { if (!emJulgamento(d)) return false; }
    else if (emJulgamento(d)) return false;
    else if (GRUPOS[state.org]) { if (d.grupo !== state.org) return false; }
    else if(state.org !== 'all' && (d.orgao !== state.org || (SOB_DEMANDA[d.grupo] && !(d.grupo === 'INFORMATIVOS' && termosBusca().length)))) return false;   // ao buscar, "STF"/"STJ" também acham os julgados de Informativos
    if(state.risk !== 'all' && d.risco !== state.risk) return false;
    if(state.area && d.area !== state.area) return false;
    var ts = termosBusca();
    // "informativo 553" (ou "info 553", "inf. 553"): é o NÚMERO da edição, não a palavra solta + qualquer "553" do texto
    var ni = numeroInformativo();
    if (ni) {
      if (String(d.info == null ? '' : d.info).replace(/^0+/, '') !== ni.num) return false;
      ts = ni.resto;
    }
    if(ts.length){
      var hay = textoBusca(d);
      for (var i = 0; i < ts.length; i++) if (!contem(hay, ts[i])) return false;
    }
    return true;
  }
  // Se a busca pede uma edição de informativo, devolve { num, resto } (resto = os outros termos da busca)
  var RX_INFORMATIVO = /(?:^|\s)(?:informativo|info|inf)\.?\s*(stj|stf|tst|tse)?\s*(?:n[º°o.]*\s*)?(\d{1,4})(?!\d)/;
  var infoCache = { q: null, v: null };
  function numeroInformativo(){
    if (infoCache.q === state.q) return infoCache.v;
    var q = semAcento(state.q), m = RX_INFORMATIVO.exec(q), v = null;
    if (m) v = { num: m[2].replace(/^0+/, ''), resto: (q.replace(m[0], ' ') + (m[1] ? ' ' + m[1] : '')).split(/\s+/).filter(Boolean) };
    infoCache = { q: state.q, v: v };
    return v;
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
    if (!seg.querySelector('[data-org="AFETADOS"]')) {
      var a = document.createElement('button');
      a.dataset.org = 'AFETADOS'; a.textContent = 'Em julgamento';
      a.title = 'Temas afetados (repercussão geral, repetitivos, IRR) que ainda não foram julgados';
      seg.insertBefore(a, antesDe || null);
    }
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

  // ---- Organizar por (em-ordem.js lembra a escolha neste navegador) ----
  var OPCOES_ORDEM = [
    { id: 'padrao', rotulo: 'Padrão (mais recentes; por risco dentro de cada tipo)' },
    { id: 'recentes', rotulo: 'Mais recentes primeiro' },
    { id: 'antigas', rotulo: 'Mais antigas primeiro' },
    { id: 'risco', rotulo: 'Maior risco de cobrança primeiro' },
    { id: 'cobradas', rotulo: 'Mais cobradas em prova' },
    { id: 'alfa', rotulo: 'Ordem alfabética (pelo título)' },
    { id: 'tema', rotulo: 'Por número do tema / edição' },
    { id: 'nao-lidas', rotulo: 'Não lidas primeiro' }
  ];
  var ordemAtual = 'padrao', ctrlOrdem = null;
  function ordenarDecisoes(list){
    var C = window.EstudaManaOrdem && window.EstudaManaOrdem.cmp;
    if (!C || ordemAtual === 'padrao') return list;
    var recente = function(a, b){ var x = chaveData(a.data), y = chaveData(b.data); return x < y ? 1 : x > y ? -1 : 0; };
    var l = list.slice(), nCob = null;
    switch (ordemAtual) {
      case 'recentes': return l.sort(recente);
      case 'antigas': return l.sort(function(a, b){ return -recente(a, b); });
      case 'risco': return l.sort(function(a, b){ return riskOrder(a.risco) - riskOrder(b.risco) || recente(a, b); });
      case 'cobradas':
        nCob = {};
        l.forEach(function(d){ nCob[d.id] = cobrancasDe(d).length; });
        return l.sort(function(a, b){ return nCob[b.id] - nCob[a.id] || riskOrder(a.risco) - riskOrder(b.risco) || recente(a, b); });
      case 'alfa': return l.sort(function(a, b){ return C.texto(tituloDe(a), tituloDe(b)); });
      case 'tema': return l.sort(function(a, b){ return C.numero(b.tema, a.tema) || recente(a, b); });
      case 'nao-lidas': return l.sort(function(a, b){ return (isRead(lidos[a.id]) ? 1 : 0) - (isRead(lidos[b.id]) ? 1 : 0) || riskOrder(a.risco) - riskOrder(b.risco) || recente(a, b); });
      default: return list;
    }
  }
  function ligarOrdem(){
    if (ctrlOrdem || !window.EstudaManaOrdem || !areaChips) return;
    ctrlOrdem = window.EstudaManaOrdem.ligar({
      depois: areaChips, chave: 'decisoes', opcoes: OPCOES_ORDEM, padrao: 'padrao',
      aoMudar: function(id){ ordemAtual = id; limite = LOTE_INICIAL; render(); }
    });
    ordemAtual = ctrlOrdem.valor();
    render();
  }

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
    ACORDAOS_TST: {
      base: ACORDAOS_TST_BASE, nome: 'os acórdãos do TST', carregando: 'Carregando a ementa…',
      item: function(x){
        return { id: 'tst-acordao-' + x[0], grupo: 'ACORDAOS_TST', orgao: 'TST', tipo: 'acordao', tipoNome: 'Acórdão · ' + x[2],
          area: x[5], titulo: x[6], tese: x[6], destaque: x[7] ? x[7].charAt(0).toUpperCase() + x[7].slice(1) : '',
          processo: x[1], relator: x[3], data: dataBr(x[4]), risco: 'Média',
          motivo: 'acórdão julgado em ' + x[4].slice(0, 4) + ' — mostra como o TST vem decidindo no caso concreto',
          _chave: x[0], _parte: x[8] };
      },
      completar: function(d, x){
        d.tese = x.ementa;
        d.destaque = x.dispo ? x.dispo.charAt(0).toUpperCase() + x.dispo.slice(1) : d.destaque;
        d.historico = x.pub ? 'Publicação: ' + dataBr(x.pub) : '';
        if (x.url) d.link = x.url;
      }
    },
    ACORDAOS_STF: {
      base: ACORDAOS_STF_BASE, nome: 'os acórdãos do STF', carregando: 'Carregando a ementa…',
      item: function(x){
        return { id: 'stf-acordao-' + x[0], grupo: 'ACORDAOS_STF', orgao: 'STF', tipo: 'acordao', tipoNome: 'Acórdão · ' + x[2],
          area: x[5], titulo: x[6], tese: x[6], destaque: x[7] ? x[7].charAt(0).toUpperCase() + x[7].slice(1) : '',
          processo: x[1], relator: x[3], data: dataBr(x[4]), risco: 'Média',
          motivo: 'acórdão julgado em ' + x[4].slice(0, 4) + ' — mostra como o STF vem decidindo no caso concreto',
          _chave: x[0], _parte: x[8] };
      },
      completar: function(d, x){
        d.tese = x.ementa;
        d.destaque = x.ata || d.destaque;
        if (x.tese) d.destaque = (x.tt ? x.tt + ': ' : 'Tese: ') + x.tese + (d.destaque ? '\n\n' + d.destaque : '');
        d.historico = [x.tema ? 'Tema: ' + x.tema : '', x.idx ? 'Indexação: ' + x.idx : '', x.pub ? 'Publicação: ' + dataBr(x.pub) : ''].filter(Boolean).join('\n');
        if (x.url) d.link = x.url;
      }
    },
    // Julgados dos informativos do STJ e do STF (scripts/informativos_cards.py).
    INFORMATIVOS: {
      base: BASE_CDN + 'informativos/', nome: 'os informativos', carregando: 'Carregando o resumo do julgado…', riscoAlto: true,
      item: function(x){
        var org = x[1];
        return { id: 'inf-' + x[0], grupo: 'INFORMATIVOS', orgao: org, tipo: 'informativo',
          tipoNome: 'Informativo ' + org + (x[2] ? ' nº ' + x[2] : ''),
          area: x[3], titulo: x[4], tese: paragrafar(x[5]), processo: x[6], relator: nomesDoProcesso(x[6]).relator, redator: nomesDoProcesso(x[6]).redator, data: x[7], info: x[2], risco: 'Alta',
          motivo: 'julgado divulgado em informativo — é a fonte que as bancas mais usam para cobrar jurisprudência recente',
          link: org === 'STJ' ? 'https://processo.stj.jus.br/jurisprudencia/externo/informativo/?acao=pesquisarumaedicao&livre=' + ('0000' + x[2]).slice(-4) + '.cod.'
            : 'https://portal.stf.jus.br/textos/verTexto.asp?servico=informativoSTF&pagina=Informativo' + x[2],
          _chave: x[0], _parte: x[8] };
      },
      completar: function(d, x){ d.destaque = paragrafar(x); }
    }
  };
  var sobDemanda = {};  // grupo -> { p, prontos, partes }
  function estadoSD(g){ return sobDemanda[g] || (sobDemanda[g] = { p: null, prontos: false, partes: {} }); }
  function carregarSobDemanda(g){
    var st = estadoSD(g), cfg = SOB_DEMANDA[g];
    if (st.p) return st.p;
    st.p = fetch(cfg.base + 'indice.json', { cache: 'no-cache' })
      .then(function(r){ if (!r.ok) throw new Error(r.status); return r.json(); })
      // índice grande em fatias (stj/acordaos): o indice.json lista os arquivos indice-000.json…, baixados juntos
      .then(function(j){
        if (!j.arquivos) return j;
        return Promise.all(j.arquivos.map(function(a){
          return fetch(cfg.base + a, { cache: 'no-cache' }).then(function(r){ if (!r.ok) throw new Error(r.status); return r.json(); });
        })).then(function(partes){
          j.itens = [].concat.apply([], partes.map(function(p){ return p.itens || []; }));
          return j;
        });
      })
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

  // Card que absorveu outros (mesma tese nas Teses do STJ e como Tema): vale como lido se qualquer um dos códigos foi lido
  function aplicarAliases(){
    DATA.forEach(function(d){
      if(!d.idsJuntados || isRead(lidos[d.id])) return;
      for(var i = 0; i < d.idsJuntados.length; i++){
        var v = lidos[d.idsJuntados[i]];
        if(isRead(v)){ lidos[d.id] = v; break; }
      }
    });
  }
  function render(){
    aplicarAliases();
    atualizarPedidoJulgado(false);
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
    list = ordenarDecisoes(list);

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
    var extrasProntos = !buscaTotal;
    function desenharTudo(){
      var todos = list.map(function(d){ return { d: d, k: chaveData(d.data) }; })
        .concat(extras.map(function(x){ return { x: x.it, c: x.c, k: chaveData(x.c.dataDe(x.it)) }; }));
      if (buscaTotal) todos.sort(function(a,b){ return a.k < b.k ? 1 : a.k > b.k ? -1 : 0; });
      var mostrar = Math.min(todos.length, ts.length ? Math.max(limite, 50) : limite);
      document.getElementById('countLine').textContent = ts.length
        ? todos.length + (todos.length === 1 ? ' decisão encontrada' : ' decisões encontradas') + (extras.length ? ' (' + extras.length + ' em Controle/Reclamações)' : '')
        : 'Mostrando ' + mostrar + ' de ' + list.length + ' decisões' + (state.org === 'all' && (ordemAtual === 'padrao' || ordemAtual === 'recentes') ? ' (as mais recentes)' : '') + ' — pesquise para ver todas';
      document.getElementById('empty').hidden = todos.length > 0;
      if (ts.length && state.org !== 'AFETADOS') {
        var afet = DATA.filter(function(d){
          if (!emJulgamento(d)) return false;
          var h = textoBusca(d);
          return ts.every(function(t){ return contem(h, t); });
        }).length;
        if (afet) document.getElementById('countLine').textContent += ' · ' + afet + (afet === 1 ? ' tema em julgamento' : ' temas em julgamento') + ' (botão "Em julgamento")';
      }
      if (ts.length && fontesIncompletas().length) document.getElementById('countLine').textContent += ' — carregando os textos completos para a busca…';
      var aguardando = aguardandoSobDemanda(ts);
      if (aguardando.length) {
        document.getElementById('countLine').textContent += ' — carregando ' + aguardando.map(function(g){ return SOB_DEMANDA[g].nome; }).join(' e ') + '…';
        if (SOB_DEMANDA[state.org]) document.getElementById('empty').hidden = true;
      }
      // mostra a caixa já quando a busca está sem resultado, mesmo que o acervo ainda esteja carregando (o robô avisa se o julgado já está no site)
      atualizarPedidoJulgado(ts.length > 0 && todos.length === 0, aguardando.length > 0 || fontesIncompletas().length > 0 || !extrasProntos);
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
        extrasProntos = true;
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
          (d.tema ? '<span class="tag-tema">' + escapeHtml(precedenteBadge(d)) + '</span>' : '') + tambemTags(d) +
          (d.status==='cancelado_superado' ? '<span class="tag-cancel">Cancelado/Superado</span>' : '') +
          (d.status==='afetado' ? '<span class="tag-afetado">Em julgamento</span>' : '') +
          (d.suspensao ? '<span class="tag-afetado" title="' + escapeHtml(d.suspensao) + '">Suspensão nacional</span>' : '') +
        '</div>' +
        '<div class="area-line">' + escapeHtml(d.area) + precedenteAreaLine(d) + '</div>' +
        '<h3>' + escapeHtml(tituloDe(d)) + '</h3>' +
        '<div class="destaque">' + escapeHtml(d._resumo != null ? d._resumo : d.tipo === 'informativo' ? d.tese : (d.destaque||d.tese||d.questao||'')) + '</div>' +
        (cobrancasDe(d).length ? '<div class="cobrado">' + escapeHtml(cobrancaResumo(cobrancasDe(d))) + '</div>' : '') +
        '<div class="meta"><span>' + escapeHtml(d.processo||'') + '</span>' + (d.data ? '<span>' + d.data + '</span>' : '') + '</div>';

      card.dataset.id = d.id;
      card.setAttribute('data-cad-fonte', 'decisoes');   // selo 📝 de Meus Cadernos
      card.setAttribute('data-cad-id', d.id);
      var checkbox = card.querySelector('.read-checkbox');
      checkbox.addEventListener('click', function(e){ e.stopPropagation(); });
      checkbox.addEventListener('change', function(){ marcarLido(d, checkbox.checked); });

      card.addEventListener('click', function(){ openModal(d); });
      grid.appendChild(card);
    })();
  }

  // Marca/desmarca a leitura — usado pela caixinha do card e pelo botão
  // "Marcar como lido" do card aberto. Grava no aparelho, na conta
  // (progress-decisoes) e no total "lidasDecisoes" dos grupos (pontuação).
  function marcarLido(d, lida){
    if(lida) lidos[d.id] = { lida:true, lidaEm: todayIso() }; else { delete lidos[d.id]; (d.idsJuntados || []).forEach(function(x){ delete lidos[x]; }); }
    writeLocal(lidos);
    scheduleSync();
    document.querySelectorAll('#grid .card').forEach(function(card){
      if(card.dataset.id !== String(d.id)) return;
      card.classList.toggle('is-read', lida);
      var cb = card.querySelector('.read-checkbox');
      if(cb) cb.checked = lida;
    });
    renderStats();
  }
  function textoBotaoLido(d){ return isRead(lidos[d.id]) ? '✓ Lido — desmarcar' : 'Marcar como lido'; }

  var overlay = document.getElementById('overlay');
  var modal = document.getElementById('modal');
  // Temas repetitivos do STJ: a ementa do acórdão e o julgado do Informativo ficam em
  // stj/repetitivos/NN.json (scripts/ligar_repetitivos.py), baixados só ao abrir o card.
  var detalheRep = {};
  function carregarDetalheRep(d){
    var b = ('0' + Math.floor(Number(d.tema) / 100)).slice(-2);
    if (!detalheRep[b]) detalheRep[b] = fetch(BASE_CDN + 'stj/repetitivos/' + b + '.json', { cache: 'no-cache' })
      .then(function(r){ return r.ok ? r.json() : {}; }).catch(function(){ return {}; });
    detalheRep[b].then(function(j){
      var e = j[String(d.tema)];
      if (!e || modalAtual !== d) return;
      var h = '';
      if (e.ementa) h += '<div class="section-label">Ementa do acórdão' + (e.acordao ? ' — ' + escapeHtml(e.acordao) : '') + '</div><div class="destaque-text cad-tardio">' + escapeHtml(e.ementa) + '</div>';
      if (e.infoTeor) h += '<div class="section-label">Informativo STJ nº ' + escapeHtml(e.info) + ' — inteiro teor</div><div class="destaque-text cad-tardio">' + escapeHtml(e.infoTeor) + '</div>';
      var campos = modal.querySelector('.fields');
      if (campos && h) { campos.insertAdjacentHTML('afterend', h); areasTardias(d); }
      if (e.info && campos) {
        Array.prototype.forEach.call(campos.querySelectorAll('div'), function(x){
          var bt = x.querySelector('b');
          if (bt && bt.textContent === 'Informativo') x.innerHTML = '<b>Informativo</b>' + escapeHtml(e.info);
        });
      }
    });
  }
  // Temas de repercussão geral do STF: o inteiro teor do acórdão fica em stf/rg/<tema>.json
  // (scripts/completar_rg_stf.py, "Completar Teses STF.command"), baixado só ao abrir o card.
  // Texto de PDF → parágrafos: junta as linhas quebradas pela largura da página, separa por
  // itens numerados, títulos em CAIXA ALTA / "II - ..." e fim de parágrafo (linha curta que termina em ponto).
  function teorEmParagrafos(texto){
    var texto0 = String(texto || '');
    var ementa = texto0.search(/E\s?M\s?E\s?N\s?T\s?A\s*:/);       // começa na ementa: antes só há capa e partes
    if (ementa > 0 && ementa < 20000) texto0 = texto0.slice(ementa);
    var linhas = texto0.split('\n').map(function(s){ return s.replace(/\s+/g, ' ').trim(); });
    // qualificação das partes e cabeçalhos que se repetem (RECTE.(S), ADV.(A/S), AM. CURIAE…) não interessam ao estudo
    var RX_PARTE = /^(?:RELATORA?|REDATORA?(?: DO)?|RECTE|RECDO|ADV|PROC|AM\. CURIAE|IMPTE|IMPDO|AGTE|AGDO|EMBTE|EMBDO|INTDO|INTE|PACTE|COATOR|REQTE|REQDO|LIT|ASSDO|ASSTE)\b[^a-z]*$/;
    var RX_CAPA = /^(?:ACÓRDÃO|(?:RECURSO EXTRAORDINÁRIO|AGRAVO|AÇÃO DIRETA[A-ZÁÉÍÓÚÂÊÔÃÕÇ ]*|ARGUIÇÃO[A-ZÁÉÍÓÚÂÊÔÃÕÇ ]*|MANDADO[A-ZÁÉÍÓÚÂÊÔÃÕÇ ]*|HABEAS CORPUS|RECLAMAÇÃO)(?: [A-ZÁÉÍÓÚÂÊÔÃÕÇ.() ]*)? \d[\d.]*(?: [A-ZÁÉÍÓÚÂÊÔÃÕÇ ]+)?)$/;
    var filtradas = [], emParte = false;
    linhas.forEach(function(s){
      if (!s) { emParte = false; filtradas.push(s); return; }
      if (RX_PARTE.test(s) || /^(?:RELATORA?|REDATORA?)\s*:/.test(s)) { emParte = true; return; }
      if (RX_CAPA.test(s)) return;
      if (emParte) {
        var letras = s.replace(/[^A-Za-zÁÉÍÓÚÂÊÔÃÕÇáéíóúâêôãõç]/g, '');
        if (/^[-:(")]/.test(s) || (letras.length >= 3 && letras === letras.toUpperCase() && s.length < 90)) return;   // continuação do nome da parte
        emParte = false;
      }
      filtradas.push(s);
    });
    linhas = filtradas;
    var largos = linhas.filter(function(s){ return s.length > 40; }).map(function(s){ return s.length; }).sort(function(a, b){ return a - b; });
    var tipica = largos.length ? largos[Math.floor(largos.length * 0.9)] : 70;
    var blocos = [], atual = '', atualTitulo = false;
    function fecha(){ if (atual) blocos.push({ t: atual, h: atualTitulo }); atual = ''; atualTitulo = false; }
    var ehTitulo = function(s){
      if (/^EMENTA\s*:/.test(s)) return true;
      if (s.length > 140 || /^[-:]/.test(s)) return false;
      if (/^[A-ZÁÉÍÓÚÂÊÔÃÕÇ.()\/ ]{2,25}\s*:/.test(s)) return false;   // "RECTE.(S) : NOME": qualificação das partes
      var letras = s.replace(/[^A-Za-zÁÉÍÓÚÂÊÔÃÕÇáéíóúâêôãõç]/g, '');
      return letras.length >= 4 && letras === letras.toUpperCase();
    };
    var ehItem = function(s){ return /^(?:\d{1,3}(?:\.\d+)*\.|\(?[a-z]\)|\([ivx]+\)|[ivx]+\))\s+\S/.test(s) || /^[A-ZÁÉÍÓÚÂÊÔÃÕÇ.()\/ ]{2,25}\s*:\s*\S/.test(s); };
    for (var i = 0; i < linhas.length; i++) {
      var s = linhas[i];
      if (!s || /^\d{1,4}$/.test(s) || /^[A-Z]{1,6}\s*\d+(?:\.\d+)*\s*\/\s*[A-Z]{2}$/.test(s) || /^(?:Ementa e Acórdão|Supremo Tribunal Federal)(?: Supremo Tribunal Federal)?$/.test(s)) { if (!s) fecha(); continue; }   // vazia, nº de página ou cabeçalho "RE 928943 / SP"
      if (ehTitulo(s)) {
        if (atual && atualTitulo) atual += ' ' + s; else { fecha(); atual = s; atualTitulo = true; }
        continue;
      }
      if (atualTitulo) fecha();
      if (ehItem(s)) fecha();
      if (atual) {
        atual += /[-‐]$/.test(atual) ? '' : ' ';
        atual += s;
      } else atual = s;
      var fim = /[.:;?!”"')]$/.test(s) && s.length < tipica * 0.72;
      if (fim) fecha();
    }
    fecha();
    return blocos.map(function(b){
      return b.h ? '<p class="rg-h" style="margin:1.1em 0 .3em"><b>' + escapeHtml(b.t) + '</b></p>'
                 : '<p style="margin:0 0 .65em">' + escapeHtml(b.t) + '</p>';
    }).join('');
  }
  function inserirTeor(d, e){
    if (!e || !e.texto || modalAtual !== d || modal.querySelector('.teor-rg')) return;
    var campos = modal.querySelector('.fields');
    if (!campos) return;
    var pedido = modal.querySelector('.teor-pedido');
    if (pedido) pedido.remove();
    var h = '<details class="teor-rg" open><summary class="section-label" style="cursor:pointer">' + escapeHtml(e.rotulo || 'Inteiro teor do acórdão') + (e.processo ? ' — ' + escapeHtml(e.processo) : '') +
            ' (' + Math.round(e.texto.length / 1000).toLocaleString('pt-BR') + ' mil caracteres)</summary>' +
            (e.rotulo && e.texto.indexOf('\n\nEMENTA:') > 0   // STJ: o cabeçalho (órgão julgador, relator, datas) vem antes da ementa
              ? '<p class="normas-aviso" style="margin:.4rem 0 .6rem">' + e.texto.slice(0, e.texto.indexOf('\n\nEMENTA:')).split('\n').slice(1).map(escapeHtml).join(' · ') + '</p>' : '') +
            '<div class="destaque-text">' + teorEmParagrafos(e.texto) + '</div></details>';
    campos.insertAdjacentHTML('afterend', h);
    // o card já foi aberto: o inteiro teor entra na lista de textos que podem ser destacados e anotados (Meus Cadernos)
    var area = modal.querySelector('.teor-rg .destaque-text');
    if (area) carregarCadernos().then(function(){
      if (modalAtual === d && window.EstudaManaCadernos && EstudaManaCadernos.adicionarArea) EstudaManaCadernos.adicionarArea(area);
    }).catch(function(){});
  }
  function carregarTeorRG(d){
    fetch(BASE_CDN + 'stf/rg/' + encodeURIComponent(String(d.tema)) + '.json', { cache: 'no-cache' })
      .then(function(r){ return r.ok ? r.json() : null; }).catch(function(){ return null; })
      .then(function(e){ if (e && e.texto) inserirTeor(d, e); else if (podePedirTeor(d)) prepararTeorPedido(d); });   // sem o acórdão no site: botão de pedir
  }

  // ---- "Buscar inteiro teor": julgados do STF sem o acórdão ----------------
  // O inteiro teor pronto fica em teor/<id do card>.json (teor/indice.json lista quais existem;
  // scripts/teor_sob_pedido.py). Sem ele, o card mostra o botão: o clique grava um pedido no
  // Firestore (pedidos-teor/<id>, só para quem entrou) e o robô do Mac busca no portal do STF.
  var indiceTeor = null;
  function carregarIndiceTeor(){
    if (!indiceTeor) indiceTeor = fetch(BASE_CDN + 'teor/indice.json', { cache: 'no-cache' })
      .then(function(r){ return r.ok ? r.json() : { p: {} }; }).catch(function(){ return { p: {} }; })
      .then(function(j){ return j.p || {}; });
    return indiceTeor;
  }
  // "RE 1037396": o inteiro teor é do processo, então vale para todos os cards dele (ex.: o mesmo
  // julgado como Tema de repercussão geral e como julgado de informativo)
  // STJ: "AgInt no REsp 2.111.222-SP, Rel. …" → { classe: "AgInt no REsp", num: "2111222" } (a chave é a classe com os "no/na" + o número:
  // cada acórdão do mesmo processo — o REsp, o AgInt, os embargos — é um texto diferente)
  function processoSTJ(processo){
    var m = /^((?:[A-Za-z]{2,10}\s+(?:no|na|nos|nas)\s+)*[A-Za-z]{2,10})\s+([\d.]{3,})/.exec(String(processo || '').trim());
    return m ? { classe: m[1].replace(/\s+/g, ' '), num: m[2].replace(/\./g, '') } : null;
  }
  function chaveProcesso(processo, orgao){
    if (orgao === 'STJ') { var q = processoSTJ(processo); return q ? 'STJ ' + q.classe.toUpperCase() + ' ' + q.num : ''; }
    var t = String(processo || ''), m = t.match(/\(\s*(ADI|ADC|ADPF|ADO|Rcl)\s*-\s*(\d+)\s*\)/i);
    if (m) return (m[1].toLowerCase() === 'rcl' ? 'RCL' : m[1].toUpperCase()) + ' ' + m[2];
    m = t.match(/\b(ADI|ADC|ADPF|ADO|ADIn|Rcl|RE|ARE|AI|HC|RHC|MS|RMS|AP|Inq|ACO|Pet|MI|AO|SL|STA|AImp)\b\.?\s*([\d.]+)/);
    return m ? (m[1] === 'ADIn' ? 'ADI' : m[1].toUpperCase()) + ' ' + m[2].replace(/\./g, '') : '';
  }
  var RX_PROCESSO_STF = /\b(?:ADI|ADC|ADPF|ADO|Rcl|RE|ARE|AI|HC|RHC|MS|RMS|AP|Inq|ACO|Pet|MI|AO|SL|STA|AImp|ADIn)\b\.?\s*\d/;
  function podePedirTeor(d){
    if (d.orgao === 'STJ') return !!(d.id && d.tipo !== 'acordao' && processoSTJ(d.processo));     // acórdão (ementa e decisão) dos dados abertos do STJ
    return d.orgao === 'STF' && d.id && RX_PROCESSO_STF.test(d.processo || '');
  }
  // Julgado de processo em segredo de justiça não tem número nem acórdão público: no lugar do botão de buscar, o card avisa.
  function emSegredo(d){
    return (d.orgao === 'STJ' || d.orgao === 'STF') && d.tipo !== 'acordao' && /segredo\s+de\s+justi[çc]a/i.test(d.processo || '');
  }
  function mostrarSegredo(d){
    if (modalAtual !== d || modal.querySelector('.teor-rg, .teor-pedido')) return;
    var campos = modal.querySelector('.fields');
    if (!campos) return;
    campos.insertAdjacentHTML('afterend',
      '<div class="teor-pedido"><div class="section-label">' + (d.orgao === 'STJ' ? 'Acórdão (ementa e decisão)' : 'Inteiro teor do acórdão') + '</div>' +
      '<button type="button" class="chip teor-segredo" disabled>🔒 Processo em segredo de justiça</button></div>');
  }
  function usuarioLogado(){
    try { var u = window.firebase && firebase.auth && firebase.apps && firebase.apps.length && firebase.auth().currentUser; return !!(u && !u.isAnonymous); }
    catch (e) { return false; }
  }
  function docPedido(d){
    return firebase.firestore().doc('pedidos-teor/' + String(d.id).replace(/[^A-Za-z0-9_-]/g, '').slice(0, 40));
  }
  // ---- "Pedir este julgado": busca com número de processo e sem resultado -------------------
  // O clique grava um pedido no Firestore (pedidos-julgados/<busca>, só para quem entrou) e o robô do Mac
  // (scripts/julgados_sob_pedido.py) descobre o tribunal pela classe, procura o acórdão e o inclui no acervo dele (STJ ou STF).
  var RX_NUM_PROCESSO = /(?:\d{1,3}(?:\.\d{3})+|\d{4,9})/;
  function chavePedidoJulgado(t){
    return semAcento(String(t || '')).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60);
  }
  function atualizarPedidoJulgado(mostrar, carregando){
    var box = document.getElementById('pedidoJulgado');
    var campo = document.getElementById('q');
    var consulta = String((campo && campo.value) || state.q || '').trim().replace(/\s+/g, ' ');
    if (!mostrar || !consulta || !RX_NUM_PROCESSO.test(consulta) || !chavePedidoJulgado(consulta)) { if (box) box.hidden = true; return; }
    if (!box) {
      box = document.createElement('div');
      box.id = 'pedidoJulgado';
      box.style.cssText = 'margin:16px 0;padding:14px 16px;border:1px dashed var(--surface-line,#94a3b8);border-radius:12px;';
      var vazio = document.getElementById('empty');
      if (vazio && vazio.parentNode) vazio.parentNode.insertBefore(box, vazio.nextSibling);
      else { var g = document.getElementById('grid'); g.parentNode.insertBefore(box, g); }
    }
    if (box.getAttribute('data-consulta') !== consulta) {
      box.setAttribute('data-consulta', consulta);
      box.innerHTML =
        '<p class="pedido-julgado-msg" style="margin:0 0 10px">Não achou <b>“' + escapeHtml(consulta) + '”</b> no site? Peça para adicionarmos: ' +
        'um robô descobre o tribunal pela classe do processo (REsp → STJ, RE e ADI → STF…), procura o acórdão e ele entra aqui, no grupo do tribunal, ' +
        'na próxima atualização do site (por enquanto o robô busca no STJ e no STF; pedidos do TST, TSE e STM ficam registrados).</p>' +
        '<button type="button" class="chip pedido-julgado-btn">➕ Pedir este julgado</button>' +
        '<span class="pedido-julgado-nota" style="margin-left:10px;font-size:.85em;opacity:.8" hidden>A busca ainda está conferindo o acervo: se o julgado aparecer, não precisa pedir.</span>';
      var btn = box.querySelector('.pedido-julgado-btn'), msg = box.querySelector('.pedido-julgado-msg');
      btn.addEventListener('click', function(){
        if (!usuarioLogado() || !(window.firebase && firebase.firestore)) {
          msg.textContent = 'Para pedir um julgado, entre com o Google ou com e-mail e senha (botão “Entrar para salvar seu progresso”, no topo da página).';
          return;
        }
        btn.disabled = true;
        firebase.firestore().doc('pedidos-julgados/' + chavePedidoJulgado(consulta)).set({ consulta: consulta.slice(0, 120), em: new Date().toISOString() })
          .then(function(){ btn.textContent = '✅ Pedido enviado'; msg.textContent = 'Pedido enviado! O julgado entra no site na próxima atualização (em geral em até um dia).'; })
          .catch(function(e){
            if (e && e.code === 'permission-denied') { btn.textContent = '✅ Já foi pedido'; msg.textContent = 'Este julgado já tinha sido pedido. Ele entra no site quando o robô o buscar.'; }
            else { btn.disabled = false; msg.textContent = 'Não consegui enviar o pedido agora. Tente de novo.'; }
          });
      });
    }
    var nota = box.querySelector('.pedido-julgado-nota');
    if (nota) nota.hidden = !carregando;
    box.hidden = false;
  }
  function mostrarPedidoTeor(d){
    if (modalAtual !== d || modal.querySelector('.teor-rg, .teor-pedido')) return;
    var campos = modal.querySelector('.fields');
    if (!campos) return;
    var stj = d.orgao === 'STJ', portal = stj ? 'nos dados abertos do STJ' : 'no portal do STF';
    campos.insertAdjacentHTML('afterend',
      '<div class="teor-pedido"><div class="section-label">' + (stj ? 'Acórdão (ementa e decisão)' : 'Inteiro teor do acórdão') + '</div>' +
      '<p class="normas-aviso teor-msg">' + (stj ? 'Este julgado ainda está sem o acórdão (ementa e decisão) no site.' : 'Este julgado ainda está sem o inteiro teor no site.') + '</p>' +
      '<button type="button" class="chip teor-buscar">' + (stj ? '🔎 Buscar o acórdão' : '🔎 Buscar inteiro teor') + '</button></div>');
    var box = modal.querySelector('.teor-pedido'), btn = box.querySelector('.teor-buscar'), msg = box.querySelector('.teor-msg');
    function enviado(t){ btn.disabled = true; btn.textContent = '✅ Pedido enviado'; msg.textContent = t; }
    if (window.firebase && firebase.apps && firebase.apps.length && firebase.firestore) {
      docPedido(d).get().then(function(s){
        if (s.exists && modalAtual === d) enviado('O pedido já foi feito. O robô busca ' + portal + ' e o texto entra aqui na próxima atualização do site.');
      }).catch(function(){});
    }
    btn.addEventListener('click', function(){
      if (!usuarioLogado()) {
        msg.textContent = 'Para pedir o inteiro teor, entre com o Google ou com e-mail e senha (botão “Entrar para salvar seu progresso”, no topo da página).';
        return;
      }
      btn.disabled = true;
      docPedido(d).set({
        id: String(d.id).replace(/[^A-Za-z0-9_-]/g, '').slice(0, 40),
        processo: String(d.processo || '').slice(0, 200),
        data: String(d.data || '').slice(0, 20),
        titulo: String(tituloDe(d) || '').slice(0, 300),
        em: new Date().toISOString()
      }).then(function(){
        enviado('Pedido enviado! O robô busca o acórdão ' + portal + ' e o texto entra aqui na próxima atualização do site (em geral em até um dia).');
      }).catch(function(e){
        if (e && e.code === 'permission-denied') enviado('Este julgado já tinha sido pedido (ou o pedido não pôde ser gravado). O texto entra aqui quando o robô buscar.');
        else { btn.disabled = false; msg.textContent = 'Não consegui enviar o pedido agora. Tente de novo.'; }
      });
    });
  }
  function prepararTeorPedido(d){
    carregarIndiceTeor().then(function(m){
      if (modalAtual !== d) return;
      var arq = m[chaveProcesso(d.processo, d.orgao)];
      if (arq) {
        fetch(BASE_CDN + arq, { cache: 'no-cache' })
          .then(function(r){ return r.ok ? r.json() : null; }).catch(function(){ return null; })
          .then(function(e){ inserirTeor(d, e); });
      } else mostrarPedidoTeor(d);
    });
  }
  // "Destaque" que só repete a tese (igual ou só o começo dela, com ou sem "…") não precisa aparecer duas vezes
  function destaqueRepetido(d){
    var n = function(t){ return String(t || '').replace(/\s+/g, ' ').replace(/[….\s]+$/, '').trim().toLowerCase(); };
    var a = n(d.destaque), b = n(d.tese);
    if (!a || !b) return false;
    return a === b || b.indexOf(a) === 0;
  }
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
        '<button type="button" class="chip lido-modal' + (isRead(lidos[d.id]) ? ' active' : '') + '">' + textoBotaoLido(d) + '</button>' +
        (d.tema ? '<span class="tag-tema">' + escapeHtml(precedenteBadge(d)) + '</span>' : '') + tambemTags(d) +
        (d.status==='cancelado_superado' ? '<span class="tag-cancel">Cancelado/Superado</span>' : '') +
        (d.status==='afetado' ? '<span class="tag-afetado">Em julgamento</span>' : '') +
        (d.suspensao ? '<span class="tag-afetado">Suspensão nacional</span>' : '') +
      '</div>' +
      '<div class="area-line" style="margin-top:8px">' + escapeHtml(d.area) + precedenteAreaLine(d) + '</div>' +
      '<h2>' + escapeHtml(tituloDe(d)) + '</h2>' +
      (d.questao && !d.tese
        ? '<div class="section-label">Questão em julgamento (ainda sem tese)</div><div class="tese-text">' + escapeHtml(d.questao) + '</div>'
        : '<div class="section-label">' + (d.tipo==='oj' || d.tipo==='pn' ? 'Texto' : d.tipo==='teses' ? 'Tese' : d.tipo==='omissao' || d.tipo==='acordao' ? 'Ementa' : d.tipo==='covid' ? 'Decisão' : d.tipo==='resumo' ? 'Tese' : d.tipo==='informativo' ? 'Tese do julgado' : 'Tese fixada') + '</div><div class="tese-text">' + escapeHtml(d.tese||'—') + '</div>') +
      (d.destaque && !destaqueRepetido(d) ? '<div class="section-label">' + (d.tipo==='resumo' ? 'Resultado' : d.tipo==='covid' ? 'Relatório' : d.tipo==='acordao' ? 'Decisão' : d.tipo==='informativo' ? 'Resumo do julgado' : 'Destaque') + '</div><div class="destaque-text">' + escapeHtml(d.destaque) + '</div>' : '') +
      '<div class="fields">' +
        '<div><b>' + (d.tipo==='teses' ? 'Julgado mais recente' : 'Processo') + '</b>' + escapeHtml(d.processo||'—') + '</div>' +
        '<div><b>Relator(a)</b>' + escapeHtml(d.relator||'—') + '</div>' +
        (d.redator ? '<div><b>Relator(a) para o acórdão</b>' + escapeHtml(d.redator) + '</div>' : '') +
        '<div><b>' + (d.status==='afetado' ? 'Afetação' : (d.tipo==='oj' || d.tipo==='pn' || d.tipo==='teses') ? 'Publicação' : 'Julgamento') + '</b>' + escapeHtml(d.data||'—') + '</div>' +
        (d.tipo==='teses' || d.grupo ? '' : '<div><b>Informativo</b>' + escapeHtml(d.info||'—') + '</div>') +
        (d.suspensao ? '<div><b>Suspensão nacional</b>' + escapeHtml(d.suspensao.replace(/^Suspensão nacional /, '')) + '</div>' : '') +
      '</div>' +
      (d.historico ? '<div class="section-label">' + (d.tipo==='teses' ? 'Legislação e observações' : d.grupo ? 'Detalhes' : 'Histórico') + '</div><div class="historico-text">' + escapeHtml(d.historico) + '</div>' : '') +
      (cobrancasDe(d).length ? '<div class="section-label">Cobrado em provas</div><ul class="cobrado-lista">' + cobrancasDe(d).map(function(c){ return '<li>' + escapeHtml(c.rotulo) + (c.questoes.length ? ' — questão ' + c.questoes.join(', ') : '') + '</li>'; }).join('') + '</ul>' : '') +
      (d.link ? '<a class="fonte-link" href="' + escapeHtml(d.link) + '" target="_blank" rel="noopener">Fonte oficial ↗</a>' : '') +
      '<div class="normas-box" hidden></div>' +
      '<div class="risk-box risk-' + escapeHtml(d.risco) + '"><b>Por que risco ' + escapeHtml(rotuloRisco(d.risco)) + '?</b>' + escapeHtml(d.motivo||'') + '</div>';
    modal.querySelector('.close').addEventListener('click', closeModal);
    modal.querySelector('.lido-modal').addEventListener('click', function(){
      marcarLido(d, !isRead(lidos[d.id]));
      this.textContent = textoBotaoLido(d);
      this.classList.toggle('active', isRead(lidos[d.id]));
    });
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    modalAtual = d;
    normasAtuais = null;
    mostrarNormas(d);
    ligarCadernos(d);
    if (d.orgao === 'STJ' && d.tipo === 'repetitivo' && d.tema) carregarDetalheRep(d);
    if (d.orgao === 'STF' && d.tipo === 'rg' && d.tema) carregarTeorRG(d);
    else if (podePedirTeor(d)) prepararTeorPedido(d);
    else if (emSegredo(d)) mostrarSegredo(d);
  }
  function closeModal(){
    if (window.EstudaManaCadernos) EstudaManaCadernos.desligar();
    overlay.classList.remove('open');
    document.body.style.overflow = '';
    modalAtual = null;
    normasAtuais = null;
  }

  // ---- Meus Cadernos: destacar e anotar trechos do card aberto -------------
  // (cadernos.js; as marcações ficam na conta, em cadernos/<uid>, e aparecem
  // na página Meus Cadernos)
  var CADERNOS_JS = 'https://barbarasinfronio-lgtm.github.io/diario-informativos/cadernos.js';
  var cadernosJs = null;
  function carregarCadernos(){
    if (window.EstudaManaCadernos) return Promise.resolve();
    if (!cadernosJs) {
      cadernosJs = fetch(CADERNOS_JS, { cache: 'no-cache' })
        .then(function(r){ if (!r.ok) throw new Error(r.status); return r.text(); })
        .then(function(code){ (0, eval)(code + '\n//# sourceURL=' + CADERNOS_JS); })
        .catch(function(e){ cadernosJs = null; throw e; });
    }
    return cadernosJs;
  }
  carregarCadernos().catch(function(){});
  function linkDecisao(d){
    return '/p/diario-das-decisoes.html#abrir=' + encodeURIComponent(d.id) + '&busca=' + encodeURIComponent(d.processo || d.titulo || '');
  }
  function ligarCadernos(d){
    carregarCadernos().then(function(){
      if (modalAtual !== d) return;
      EstudaManaCadernos.ligar(modal, {
        fonte: 'decisoes', item: d.id, titulo: tituloDe(d),
        origem: [d.orgao, (d.tipoNome || precedenteAreaLine(d).replace(/^ · /, '')), d.tema ? precedenteBadge(d) : '', (d.tambem || []).join(' · '), d.processo].filter(Boolean).join(' · '),
        abrir: linkDecisao(d),
        areas: [].slice.call(modal.querySelectorAll('h2, .tese-text, .destaque-text:not(.cad-tardio), .historico-text'))
      });
      areasTardias(d);   // blocos que já tinham chegado antes de o marcador ligar
    }).catch(function(){});
  }
  // Ementa do acórdão e Informativo dos repetitivos do STJ chegam depois de o card abrir: entram no marcador (Meus
  // Cadernos) sempre depois dos textos de base e na ordem da tela, para as marcações não mudarem de lugar.
  function areasTardias(d){
    carregarCadernos().then(function(){
      if (modalAtual !== d || !window.EstudaManaCadernos || !EstudaManaCadernos.adicionarArea) return;
      [].slice.call(modal.querySelectorAll('.cad-tardio')).forEach(function(el){ EstudaManaCadernos.adicionarArea(el); });
    }).catch(function(){});
  }
  // Link vindo de Meus Cadernos: #abrir=<id>&busca=<processo> — busca e abre o card
  function abrirDoLink(){
    var h = location.hash.replace(/^#/, ''), p = {};
    h.split('&').forEach(function(kv){ var i = kv.indexOf('='); if (i > 0) p[kv.slice(0, i)] = decodeURIComponent(kv.slice(i + 1)); });
    if (!p.abrir && !p.busca) return;
    try { history.replaceState(null, '', location.pathname + location.search); } catch(e){}
    if (p.busca) { qInput.value = p.busca; state.q = p.busca.trim().toLowerCase(); limite = LOTE_INICIAL; render(); }
    if (!p.abrir) return;
    var tentativas = 0;
    (function procurar(){
      var d = DATA.filter(function(x){ return String(x.id) === p.abrir; })[0];
      if (d) { openModal(d); return; }
      if (++tentativas < 40) setTimeout(procurar, 500);
    })();
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

  // Acórdãos e julgados de informativos só são baixados sob demanda; até lá
  // o painel usa o total que vem em leve/decisoes.json ("sobDemanda"), para
  // os números não mudarem enquanto a página carrega.
  var totaisSobDemanda = {};
  function renderStats(){
    var afetados = DATA.filter(emJulgamento).length;
    var stf = DATA.filter(d=>d.orgao==='STF' && !d.grupo && !emJulgamento(d)).length;
    var extras = DATA.filter(d=>d.grupo && d.orgao==='STF' && !SOB_DEMANDA[d.grupo]).length;
    var stj = DATA.filter(d=>d.orgao==='STJ' && d.tipo!=='teses' && !d.grupo && !emJulgamento(d)).length;
    var teses = DATA.filter(d=>d.tipo==='teses').length;
    var tst = DATA.filter(d=>d.orgao==='TST' && !emJulgamento(d)).length;
    var alta = DATA.filter(d=>d.risco==='Alta' && !emJulgamento(d)).length;
    var canc = DATA.filter(d=>d.status==='cancelado_superado').length;
    var total = DATA.length - afetados, porGrupo = {};
    Object.keys(SOB_DEMANDA).forEach(function(g){
      var n = DATA.filter(function(d){ return d.grupo === g; }).length;
      if (!estadoSD(g).prontos && totaisSobDemanda[g]) {
        n = totaisSobDemanda[g];
        total += n;
        if (SOB_DEMANDA[g].riscoAlto) alta += n;
      }
      porGrupo[g] = n;
    });
    var acordaos = porGrupo.ACORDAOS, acordaosStf = porGrupo.ACORDAOS_STF, acordaosTst = porGrupo.ACORDAOS_TST, informativos = porGrupo.INFORMATIVOS;
    var lidasCount = totalLidos();
    var el = document.getElementById('stats');
    el.innerHTML =
      '<div class="stat"><b>' + total + '</b><span>Julgados no total</span></div>' +
      '<div class="stat" style="color:var(--low-fg)"><b>' + lidasCount + '</b><span>Lidas</span></div>' +
      '<div class="stat"><b>' + stf + '</b><span>STF · Rep. Geral</span></div>' +
      '<div class="stat"><b>' + stj + '</b><span>STJ · Repetitivos</span></div>' +
      (teses ? '<div class="stat"><b>' + teses + '</b><span>STJ · Jurisprudência em Teses</span></div>' : '') +
      (tst ? '<div class="stat"><b>' + tst + '</b><span>TST · OJs, PNs e IRR</span></div>' : '') +
      (extras ? '<div class="stat"><b>' + extras + '</b><span>STF · Omissões, resumos e COVID-19</span></div>' : '') +
      (informativos ? '<div class="stat"><b>' + informativos + '</b><span>Julgados de informativos</span></div>' : '') +
      (acordaos ? '<div class="stat"><b>' + acordaos + '</b><span>STJ · Acórdãos de turmas</span></div>' : '') +
      (acordaosStf ? '<div class="stat"><b>' + acordaosStf + '</b><span>STF · Acórdãos</span></div>' : '') +
      (acordaosTst ? '<div class="stat"><b>' + acordaosTst + '</b><span>TST · Acórdãos</span></div>' : '') +
      '<div class="stat" style="color:var(--high-fg)"><b>' + alta + '</b><span>Risco alto</span></div>' +
      (canc ? '<div class="stat" style="color:var(--high-fg)"><b>' + canc + '</b><span>Canceladas/superadas</span></div>' : '') +
      (afetados ? '<div class="stat"><b>' + afetados + '</b><span>Em julgamento (fora do total)</span></div>' : '');
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
        totaisSobDemanda = j.sobDemanda || {};
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
  if (window.EstudaManaOrdem) ligarOrdem();
  else {
    var sOrdem = document.createElement('script');
    sOrdem.src = 'https://barbarasinfronio-lgtm.github.io/diario-informativos/em-ordem.js';
    sOrdem.onload = ligarOrdem;
    document.head.appendChild(sOrdem);
  }
  abrirDoLink();
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
