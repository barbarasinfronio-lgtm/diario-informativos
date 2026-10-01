
(function () {
  "use strict";

  // (dados carregados de sumulas-data.js, que roda antes deste arquivo)
  var LOCAL_KEY = "sumulas-lidas";
  var listRoot = document.getElementById("list-root");

  // ---- busca (a mesma do Diário das Decisões) ---------------------------
  // Caixa criada aqui, logo acima da lista (sem mexer no HTML do Blogger).
  // Não diferencia maiúsculas nem acentos; cada palavra digitada precisa
  // aparecer no item. Os contadores de progresso não mudam com a busca.
  var termosBusca = [];
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
  function combinaBusca(texto) {
    if (!termosBusca.length) return true;
    var h = semAcentoBusca(texto);
    return termosBusca.every(function (t) {
      return variantes(t).some(function (x) { return h.indexOf(x) !== -1; });
    });
  }
  function mostrarResultadoBusca(n, rotulo) {
    if (!buscaInfo) return;
    buscaInfo.hidden = !termosBusca.length;
    buscaInfo.textContent = n === 1 ? "1 resultado" : n + " resultados";
  }
  function criarBusca(placeholder, aoMudar) {
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
      termosBusca = semAcentoBusca(input.value).split(/\s+/).filter(Boolean);
      aoMudar();
    }
    input.addEventListener("input", mudou);
    limpar.addEventListener("click", function () { input.value = ""; mudou(); input.focus(); });
    listRoot.parentNode.insertBefore(box, listRoot);
    listRoot.parentNode.insertBefore(buscaInfo, listRoot);
  }
  var syncNote = document.getElementById("sync-note");
  var ledeText = document.getElementById("lede-text");
  var footerSource = document.getElementById("footer-source");

  var tribunalSelect = document.getElementById("tribunal-select");
  var materiaSelect = document.getElementById("materia-select");
  var loteToggle = document.getElementById("lote-toggle");
  var pagerPrev = document.getElementById("lote-prev");
  var pagerNext = document.getElementById("lote-next");
  var pagerLabel = document.getElementById("lote-label");

  // Base comum do "Estudo coletivo" (grupos, ranking, boneco/avatar) —
  // grupos-shared.js roda antes deste arquivo em toda página de diário.
  var GS = window.GruposShared;

  // Boneco personalizável — mesmo esquema dos outros Diários
  // (grupos-shared.js), guardado sob uma chave própria.
  var AVATAR_KEY = "sumulas-avatar";
  var avatarPref = GS.readAvatarPref(AVATAR_KEY);

  var ORG_ORDER = SUMULAS_ORG_ORDER;

  // ---- Classificação por matéria -----------------------------------------
  // Os dados vêm com materia = null; aqui a matéria é inferida do texto por
  // palavras-chave (a matéria com mais acertos vence; empate segue a ordem da
  // lista). Se o dado já trouxer uma matéria, ela é respeitada. Súmulas sem
  // nenhuma pista ficam em "Outras".
  var MATERIAS = [
    ["Direito Eleitoral", ["eleitor", "eleicao", "eleicoes", "candidat", "partido", "inelegib", "mandato eletivo", "propaganda eleitoral", "justica eleitoral", "coligacao", "diplomacao"]],
    ["Direito do Trabalho", ["empregad", "trabalhista", "justica do trabalho", "fgts", "clt", "horas extras", "hora extra", "reclamante", "reclamada", "adicional de insalubridade", "adicional de periculosidade", "aviso previo", "salario", "sindicat", "rescisao", "vinculo empregaticio", "jornada de trabalho", "ferias", "13o", "dissidio", "gratificacao natalina"]],
    ["Direito Tributário", ["tribut", "imposto", "icms", "iss ", "issqn", "ipi", "iptu", "ipva", "itbi", "itcmd", "irpf", "irpj", "imposto de renda", "pis", "cofins", "csll", "contribuicao social", "contribuicao de melhoria", "taxa de", "execucao fiscal", "credito fiscal", "divida ativa", "fisco", "fazenda publica", "lancamento", "decadencia", "cda", "certidao de divida", "contribuinte", "sonegac", "isencao", "aliquota", "base de calculo", "compensacao", "repeticao do indebito", "ctn"]],
    ["Direito Previdenciário", ["previdenci", "inss", "aposentadoria", "auxilio", "aposentadoria por", "beneficio", "auxilio-doenca", "auxilio doenca", "auxilio-acidente", "pensao por morte", "segurado", "loas", "rgps", "salario-maternidade", "tempo de contribuicao", "tempo de servico rural", "regime proprio de previdencia", "beneficio de prestacao continuada"]],
    ["Direito do Consumidor", ["consumidor", "cdc", "codigo de defesa", "plano de saude", "operadora de saude", "seguro-saude", "fornecedor", "relacao de consumo", "instituicao financeira", "cartao de credito", "banco de dados", "cadastro de inadimplentes", "spc", "serasa", "negativacao", "telefonia", "energia eletrica", "transporte aereo", "bagagem", "cobranca indevida", "contrato bancario", "tarifa bancaria", "juros remuneratorios", "capitalizacao de juros"]],
    ["Direito Penal", ["crime", "penal", "pena", "reu", "condenad", "delito", "furto", "roubo", "homicidio", "trafico", "estelionato", "receptacao", "pena privativa", "regime prisional", "regime inicial", "regime fechado", "regime semiaberto", "livramento condicional", "prescricao da pretensao punitiva", "prescricao retroativa", "circunstancia agravante", "atenuante", "reincid", "dosimetria", "medida de seguranca", "sursis", "conduta tipica", "tipicidade", "lei de drogas", "lei maria da penha", "violencia domestica", "contravencao", "falta grave", "execucao penal", "progressao de regime", "concurso de crimes", "continuidade delitiva", "crime hediondo"]],
    ["Processo Penal", ["processo penal", "inquerito", "denuncia", "acao penal", "prisao", "habeas corpus", "juri", "tribunal do juri", "pronuncia", "queixa-crime", "audiencia de custodia", "interrogatorio", "nulidade", "revisao criminal", "prisao preventiva", "liberdade provisoria", "fianca", "juiz das garantias", "ministerio publico", "acordo de nao persecucao", "suspensao condicional do processo", "transacao penal", "juizado especial criminal", "corrupcao de menores", "vara de execucoes penais"]],
    ["Direito Processual Civil", ["processo civil", "cpc", "reconvencao", "monitoria", "honorarios advocaticios", "honorarios de sucumbencia", "sucumbencia", "recurso especial", "recurso extraordinario", "agravo", "apelacao", "embargos de declaracao", "embargos", "cumprimento de sentenca", "coisa julgada", "litispendencia", "competencia", "foro", "citacao", "intimacao", "prazo processual", "tutela provisoria", "tutela de urgencia", "liminar", "legitimidade", "legitimidade ativa", "legitimidade passiva", "interesse de agir", "mandado de seguranca", "acao rescisoria", "penhora", "arresto", "execucao", "titulo executivo", "custas", "gratuidade de justica", "assistencia judiciaria", "reexame necessario", "ação civil publica", "acao civil publica", "acao popular", "mandado de injuncao", "conflito de competencia", "juizado especial", "prequestionamento", "reclamacao", "dano moral", "prova pericial", "revelia", "litisconsorcio", "denunciacao da lide", "ilegitimidade", "impugnacao"]],
    ["Direito Administrativo", ["servidor publico", "servidores publicos", "administracao publica", "licitacao", "concurso publico", "improbidade", "ato administrativo", "poder de policia", "desapropriacao", "autarquia", "empresa publica", "sociedade de economia mista", "concessionaria", "agente publico", "cargo publico", "estatutario", "vencimentos", "remuneracao de servidor", "contrato administrativo", "responsabilidade civil do estado", "responsabilidade objetiva do estado", "policial militar", "militar", "bombeiro", "professor", "tribunal de contas", "tcu", "servico publico", "regime juridico unico", "pensao de servidor", "estabilidade", "reajuste de servidor", "gratificacao", "adicional", "municipio", "estado-membro", "servidores"]],
    ["Direito Constitucional", ["inconstitucion", "constituicao", "constitucional", "inconstitucionalidade", "repercussao geral", "adi ", "adpf", "controle de constitucionalidade", "direitos fundamentais", "clausula de reserva de plenario", "poder constituinte", "emenda constitucional", "supremo tribunal federal", "iniciativa de lei", "reserva legal", "separacao de poderes", "principio da", "federacao", "competencia legislativa", "lei complementar", "medida provisoria", "sumula vinculante"]],
    ["Direito Civil", ["civil", "vizinh", "janela", "contrato", "locacao", "aluguel", "inquilino", "locador", "locatario", "fianca locaticia", "compra e venda", "imovel", "usucapiao", "posse", "propriedade", "condominio", "seguro", "seguradora", "dpvat", "acidente de transito", "indenizacao", "responsabilidade civil", "prescricao", "alimentos", "familia", "casamento", "divorcio", "uniao estavel", "guarda", "paternidade", "investigacao de paternidade", "heranca", "inventario", "sucessao", "testamento", "alienacao fiduciaria", "hipoteca", "penhor", "registro publico", "cartorio", "empreitada", "mandato", "doacao", "cheque", "nota promissoria", "duplicata", "titulo de credito", "falencia", "recuperacao judicial", "sociedade", "sociedade empresaria", "empresario", "direito autoral", "marca", "patente", "arrendamento", "bem de familia", "adocao", "menor", "crianca", "adolescente", "eca", "interdicao", "curatela", "usufruto", "clausula penal", "juros", "correcao monetaria", "mora", "compromisso de compra", "incorporacao", "loteamento"]],
  ];

  function classificarMateria(row) {
    var h = " " + semAcentoBusca(row.texto).replace(/[^a-z0-9]+/g, " ") + " ";
    var melhor = "Outras", pontos = 0;
    MATERIAS.forEach(function (m) {
      var n = 0;
      m[1].forEach(function (k) { if (h.indexOf(" " + k) !== -1) n++; });
      if (n > pontos) { pontos = n; melhor = m[0]; }
    });
    return melhor;
  }

  // Estado por tribunal: cada súmula ganha lida/lidaEm, igual aos outros
  // Diários. Tribunais "em_breve" ficam com a lista vazia mesmo.
  var stateByOrg = {};
  ORG_ORDER.forEach(function (key) {
    stateByOrg[key] = SUMULAS_DATA[key].sumulas.map(function (d) {
      return { numero: d.numero, texto: d.texto, materia: d.materia || classificarMateria(d), link: d.link, org: key, lida: false, lidaEm: null };
    });
  });

  // Só tribunais com conteúdo real entram no <select>; os demais aparecem
  // desabilitados com "(em preparação)" para deixar claro que virão.
  var TODOS = "__todos__"; // busca em todos os tribunais, separados por tribunal
  var currentOrg = ORG_ORDER.filter(function (k) { return SUMULAS_DATA[k].status === "disponivel"; })[0] || ORG_ORDER[0];
  var currentMateria = "todas";
  var loteSize = 10;
  var loteAtual = 0; // índice (0-based) do lote sendo exibido

  function todayIso() {
    var now = new Date();
    var m = String(now.getMonth() + 1).padStart(2, "0");
    var d = String(now.getDate()).padStart(2, "0");
    return now.getFullYear() + "-" + m + "-" + d;
  }

  function rowKey(orgKey, row) { return orgKey + ":" + row.numero; }

  // Em quais provas de concurso cada súmula já foi cobrada
  // (scripts/cobrancas_provas.py → provas/cobrancas.json).
  var COBRANCAS_JSON = "https://barbarasinfronio-lgtm.github.io/diario-informativos/provas/cobrancas.json";
  var COB = null;
  function cobrancasDe(row) {
    var lst = COB && COB.itens["sum:" + row.org + ":" + row.numero];
    if (!lst) return [];
    var porProva = {};
    lst.forEach(function (x) { (porProva[x[0]] = porProva[x[0]] || []).push(x[1]); });
    return Object.keys(porProva).map(function (pi) {
      var p = COB.provas[pi];
      return { rotulo: p.rotulo + " (" + p.banca + ")", ano: p.ano, questoes: porProva[pi] };
    }).sort(function (a, b) { return b.ano.localeCompare(a.ano); });
  }
  function carregarCobrancas() {
    fetch(COBRANCAS_JSON, { cache: "no-cache" })
      .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
      .then(function (j) { COB = j; render(); })
      .catch(function () { /* sem as cobranças, a página segue igual */ });
  }

  function readLocal() {
    try {
      var raw = localStorage.getItem(LOCAL_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch (e) { return {}; }
  }
  function writeLocal(map) {
    try { localStorage.setItem(LOCAL_KEY, JSON.stringify(map)); } catch (e) {}
  }

  function applyMap(map) {
    ORG_ORDER.forEach(function (orgKey) {
      stateByOrg[orgKey].forEach(function (row) {
        var k = rowKey(orgKey, row);
        if (Object.prototype.hasOwnProperty.call(map, k)) {
          var v = map[k];
          row.lida = !!(v && v.lida);
          row.lidaEm = (v && v.lidaEm) || null;
        }
      });
    });
  }

  function stateToMap() {
    var map = {};
    ORG_ORDER.forEach(function (orgKey) {
      stateByOrg[orgKey].forEach(function (row) {
        map[rowKey(orgKey, row)] = { lida: row.lida, lidaEm: row.lidaEm };
      });
    });
    return map;
  }

  // ---- Seletor de tribunal ----------------------------------------------
  function renderTribunalSelect() {
    if (!tribunalSelect) return;
    tribunalSelect.innerHTML = "";
    var optTodos = document.createElement("option");
    optTodos.value = TODOS;
    optTodos.textContent = "Todos os tribunais — busca geral";
    if (currentOrg === TODOS) optTodos.selected = true;
    tribunalSelect.appendChild(optTodos);
    ORG_ORDER.forEach(function (key) {
      var info = SUMULAS_DATA[key];
      var opt = document.createElement("option");
      opt.value = key;
      var count = stateByOrg[key].length;
      opt.textContent = info.status === "disponivel"
        ? info.label + " (" + count + ")"
        : info.label + " — em preparação";
      if (info.status !== "disponivel") opt.disabled = true;
      if (key === currentOrg) opt.selected = true;
      tribunalSelect.appendChild(opt);
    });
  }

  // ---- Seletor de matéria -------------------------------------------------
  // Enquanto a classificação por matéria não estiver pronta (materia ===
  // null em todo mundo), só existe a opção "Todas as matérias".
  function rowsAtuais() {
    if (currentOrg !== TODOS) return stateByOrg[currentOrg];
    var all = [];
    ORG_ORDER.forEach(function (k) {
      if (SUMULAS_DATA[k].status === "disponivel") all = all.concat(stateByOrg[k]);
    });
    return all;
  }

  function materiasDisponiveis() {
    var set = {};
    rowsAtuais().forEach(function (r) { if (r.materia) set[r.materia] = true; });
    return Object.keys(set).sort();
  }

  function renderMateriaSelect() {
    if (!materiaSelect) return;
    var materias = materiasDisponiveis();
    materiaSelect.innerHTML = "";
    var optAll = document.createElement("option");
    optAll.value = "todas";
    optAll.textContent = "Todas as matérias";
    materiaSelect.appendChild(optAll);
    materias.forEach(function (m) {
      var opt = document.createElement("option");
      opt.value = m;
      opt.textContent = m;
      materiaSelect.appendChild(opt);
    });
    materiaSelect.disabled = materias.length === 0;
    materiaSelect.value = "todas";
    currentMateria = "todas";
  }

  // Sem a busca: é a base dos contadores de progresso.
  function filteredBase() {
    return rowsAtuais().filter(function (r) {
      return currentMateria === "todas" || r.materia === currentMateria;
    });
  }

  function filteredState() {
    return filteredBase().filter(function (r) {
      return combinaBusca("súmula nº " + r.numero + " " + r.texto + " " + (r.materia || ""));
    });
  }

  // ---- Lotes de leitura (10 em 10 / 20 em 20) ----------------------------
  function totalLotes() {
    var n = filteredState().length;
    return Math.max(1, Math.ceil(n / loteSize));
  }

  function clampLote() {
    var max = totalLotes() - 1;
    if (loteAtual > max) loteAtual = max;
    if (loteAtual < 0) loteAtual = 0;
  }

  function renderPager(list) {
    clampLote();
    var total = totalLotes();
    var start = loteAtual * loteSize;
    var end = Math.min(start + loteSize, list.length);
    if (pagerLabel) {
      pagerLabel.textContent = list.length
        ? "Lote " + (loteAtual + 1) + " de " + total + " — mostrando " + (start + 1) + "–" + end + " de " + list.length
        : "Nenhuma súmula nesse filtro ainda";
    }
    if (pagerPrev) pagerPrev.disabled = loteAtual <= 0;
    if (pagerNext) pagerNext.disabled = loteAtual >= total - 1;
  }

  function render() {
    renderTribunalSelect();
    renderMateriaSelect();

    var info = currentOrg === TODOS ? { status: "disponivel", label: "Todos os tribunais" } : SUMULAS_DATA[currentOrg];
    ledeText.textContent = info.status === "disponivel"
      ? "Escolha o tribunal, a matéria (quando disponível) e o tamanho do lote — vá lendo sem se sobrecarregar."
      : "Esse tribunal ainda está em preparação — as súmulas dele entram em breve.";
    footerSource.innerHTML = info.status === "disponivel"
      ? 'Texto oficial das súmulas — confira sempre a fonte no botão "Abrir" de cada linha. Se notar algum texto desatualizado ou incorreto, avise para correção.'
      : "";

    var full = filteredState();
    var start = loteAtual * loteSize;
    var pageItems = full.slice(start, start + loteSize);

    listRoot.innerHTML = "";

    if (info.status !== "disponivel") {
      var msg = document.createElement("p");
      msg.className = "avatar-note";
      msg.style.marginTop = "1rem";
      msg.textContent = "As súmulas do " + info.label.split(" —")[0] + " ainda não foram levantadas. Elas entram em uma próxima atualização.";
      listRoot.appendChild(msg);
      renderPager(full);
      updateStats(full);
      return;
    }

    var ul = document.createElement("ul");
    ul.className = "list";

    var ultimoOrg = null;
    pageItems.forEach(function (row) {
      if (currentOrg === TODOS && row.org !== ultimoOrg) {
        ultimoOrg = row.org;
        var h = document.createElement("li");
        h.className = "sumula-grupo-titulo";
        h.textContent = SUMULAS_DATA[row.org].label.replace(/\s*\(\d+\)$/, "");
        ul.appendChild(h);
      }
      var li = document.createElement("li");
      li.className = "row sumula-row" + (row.lida ? " is-read" : "");

      var checkWrap = document.createElement("div");
      checkWrap.className = "check-wrap";
      var input = document.createElement("input");
      input.type = "checkbox";
      input.className = "check-box";
      input.checked = row.lida;
      input.setAttribute("aria-label", "Marcar súmula nº " + row.numero + " como lida");
      input.addEventListener("change", function () { toggle(row, input.checked); });
      checkWrap.appendChild(input);

      var edition = document.createElement("div");
      edition.className = "edition sumula-edition";
      var num = document.createElement("span");
      num.className = "num";
      num.textContent = (row.org === "stf_vinculante" ? "Súmula Vinculante nº " : row.org === "tjto" ? "Enunciado nº " : "Súmula nº ") + row.numero;
      var texto = document.createElement("p");
      texto.className = "sumula-texto";
      texto.textContent = row.texto;
      edition.appendChild(num);
      edition.appendChild(texto);
      var cobs = cobrancasDe(row);
      if (cobs.length) {
        var cob = document.createElement("p");
        cob.className = "sumula-cobrada";
        cob.textContent = "📝 Cobrada em " + cobs.length + (cobs.length === 1 ? " prova: " : " provas: ") +
          cobs.map(function (c) { return c.rotulo + " (q. " + c.questoes.join(", ") + ")"; }).join(" · ");
        edition.appendChild(cob);
      }

      var star = document.createElement("span");
      if (row.lida) {
        star.textContent = "📘";
        star.className = "star star-gold";
        star.title = "Lida";
      } else {
        star.textContent = "📙";
        star.className = "star star-empty";
        star.title = "Ainda não lida";
      }

      var link = document.createElement("a");
      link.className = "open-link";
      link.href = row.link;
      link.target = "_blank";
      link.rel = "noopener";
      link.title = "Abrir no site oficial";
      link.textContent = "Abrir";

      li.appendChild(checkWrap);
      li.appendChild(edition);
      li.appendChild(star);
      li.appendChild(link);
      ul.appendChild(li);
    });

    listRoot.appendChild(ul);
    renderPager(full);
    mostrarResultadoBusca(full.length, ["súmula", "súmulas"]);
    updateStats(filteredBase());
  }

  function updateStats(full) {
    var total = full.length;
    var lidas = full.filter(function (r) { return r.lida; }).length;
    document.getElementById("stat-count").textContent = lidas;
    document.getElementById("stat-total").textContent = total;
    document.getElementById("stat-pct").textContent = total ? Math.round((lidas / total) * 100) + "%" : "0%";
    document.getElementById("progress-fill").style.width = (total ? (lidas / total) * 100 : 0) + "%";
    var starLine = document.getElementById("stat-stars");
    if (starLine) {
      var totalLidasGeral = 0;
      ORG_ORDER.forEach(function (k) { stateByOrg[k].forEach(function (r) { if (r.lida) totalLidasGeral++; }); });
      starLine.textContent = totalLidasGeral
        ? GS.bonecoCarreira(avatarPref) + " " + totalLidasGeral + " súmula" + (totalLidasGeral === 1 ? "" : "s") + " no total"
        : "";
    }
  }

  var viewerId = null;
  var dbCap = null;
  var dbReady = false;
  var progressDoc = null;
  var publishTimer = null;
  var applyingRemote = false;

  function setNote(text) { syncNote.textContent = text || " "; }

  function scheduleSync() {
    if (publishTimer) clearTimeout(publishTimer);
    publishTimer = setTimeout(doSync, 700);
  }

  function doSync() {
    var map = stateToMap();
    writeLocal(map);
    if (!dbReady || !progressDoc) { setNote("Salvo neste navegador."); return; }
    setNote("Salvando…");
    progressDoc.set({ map: map, avatar: avatarPref, updatedAt: new Date().toISOString() })
      .then(function () {
        setNote("Salvo — só para você.");
        setTimeout(function () { setNote(""); }, 1600);
      })
      .catch(function (err) {
        if (err && err.code === "permission-denied") {
          dbCap = null; progressDoc = null;
          setNote("Sem sincronização aqui — salvo neste navegador.");
          return;
        }
        setNote("Não foi possível salvar agora — salvo neste navegador.");
      });
  }

  function toggle(row, value) {
    row.lida = value;
    row.lidaEm = value ? todayIso() : null;
    render();
    if (!applyingRemote) { scheduleSync(); scheduleGroupSync(); }
  }

  // ---- Estudo coletivo (multi-grupo) -----------------------------------
  // O MESMO código de grupo vale em todos os diários (Informativos, Leis,
  // Súmulas) — aqui só mantemos o campo "lidasSumulas" deste diário
  // atualizado no documento do membro, em cada grupo que a pessoa
  // participa, e mostramos um resumo PESSOAL (nunca os nomes dos outros
  // membros): em quantos desses grupos a pessoa está em 1º/2º/3º lugar.
  // A lista completa, grupo a grupo, com todo mundo, fica só em "Meus
  // Grupos de Estudo" — e lá, cada pessoa só vê os grupos dela mesma.
  // Criar, entrar ou sair de um grupo também acontece só lá
  // (grupos-shared.js cuida do armazenamento local e da comunicação com
  // o Firebase).
  var HUB_URL = "https://www.estudamana.com.br/p/meus-grupos.html";
  var myPrizesEl = document.getElementById("my-prizes");
  var groupUnsubs = {};      // code -> função de cancelar a inscrição
  var groupSnapshots = {};   // code -> último snapshot de members
  var groupSyncTimer = null;

  function computeTotals() {
    var lidas = 0;
    ORG_ORDER.forEach(function (k) { stateByOrg[k].forEach(function (r) { if (r.lida) lidas++; }); });
    return { lidas: lidas };
  }

  function renderMyPrizes() {
    if (!myPrizesEl || !GS) return;
    var codes = GS.readGroups().map(function (g) { return g.code; });
    var tally = GS.tallyMyPrizes(codes, groupSnapshots, "lidasSumulas", viewerId);
    GS.renderMyPrizes(myPrizesEl, tally, { hubHref: HUB_URL });
  }

  function scheduleGroupSync() {
    if (groupSyncTimer) clearTimeout(groupSyncTimer);
    groupSyncTimer = setTimeout(pushProgressToGroups, 700);
  }

  function pushProgressToGroups() {
    if (!GS || !viewerId) return;
    var totals = computeTotals();
    GS.readGroups().forEach(function (g) {
      GS.updateMember(g.code, viewerId, {
        name: g.name,
        lidasSumulas: totals.lidas,
        avatar: avatarPref,
        joinedAt: g.joinedAt
      }).catch(function () { /* melhor esforço — segue salvo localmente */ });
    });
  }

  function subscribeAllGroups() {
    if (!GS) return;
    GS.readGroups().forEach(function (g) {
      if (groupUnsubs[g.code]) return; // já inscrito
      groupUnsubs[g.code] = GS.subscribeMembers(g.code, function (snap) {
        groupSnapshots[g.code] = snap;
        renderMyPrizes();
      }, null, avatarPref);
    });
  }

  // Se a pessoa fechar a aba dentro da janela de espera do debounce (700ms),
  // grava agora em vez de perder a última marcação (ao menos localmente —
  // o envio ao Firestore, se der tempo, também é disparado).
  window.addEventListener("beforeunload", function () {
    if (publishTimer) { clearTimeout(publishTimer); doSync(); }
    if (groupSyncTimer) { clearTimeout(groupSyncTimer); pushProgressToGroups(); }
  });

  renderMyPrizes();


  // Painel de personalização do boneco
  var avatarToggleBtn = document.getElementById("avatar-toggle");
  var avatarToggleGenderSelect = document.getElementById("avatar-gender");
  var avatarToneSelect = document.getElementById("avatar-tone");
  var avatarPreview = document.getElementById("avatar-toggle-preview");
  var avatarPanel = document.getElementById("avatar-panel");

  function syncAvatarControls() {
    if (avatarToggleGenderSelect) avatarToggleGenderSelect.value = avatarPref.gender;
    if (avatarToneSelect) avatarToneSelect.value = avatarPref.tone;
    if (avatarPreview) avatarPreview.textContent = GS.bonecoCarreira(avatarPref);
  }

  function onAvatarPrefChange() {
    avatarPref = {
      gender: avatarToggleGenderSelect ? avatarToggleGenderSelect.value : avatarPref.gender,
      tone: avatarToneSelect ? avatarToneSelect.value : avatarPref.tone
    };
    GS.writeAvatarPref(avatarPref, AVATAR_KEY);
    syncAvatarControls();
    render();
    if (!applyingRemote) { scheduleSync(); scheduleGroupSync(); }
  }

  if (avatarToggleGenderSelect) avatarToggleGenderSelect.addEventListener("change", onAvatarPrefChange);
  if (avatarToneSelect) avatarToneSelect.addEventListener("change", onAvatarPrefChange);
  syncAvatarControls();

  // ---- Vincular e-mail (opcional) -------------------------------------
  // Lógica compartilhada — ver conta-email.js (precisa estar incluído na
  // página ANTES deste script). Se faltar (ex.: template ainda não
  // atualizado), o painel de e-mail só fica inativo — o resto da página
  // continua funcionando normalmente.
  var contaEmail = window.ContaEmail
    ? window.ContaEmail.attach({ setNote: setNote, recoverHint: "Já ativei — entrar neste aparelho" })
    : { renderAccountUI: function () {} };
  var renderAccountUI = contaEmail.renderAccountUI;

  // ---- Controles de tribunal / matéria / tamanho do lote -----------------
  if (tribunalSelect) {
    tribunalSelect.addEventListener("change", function () {
      currentOrg = tribunalSelect.value;
      loteAtual = 0;
      render();
    });
  }
  if (materiaSelect) {
    materiaSelect.addEventListener("change", function () {
      currentMateria = materiaSelect.value;
      loteAtual = 0;
      render();
    });
  }
  if (loteToggle) {
    loteToggle.addEventListener("click", function (e) {
      var btn = e.target.closest("[data-lote-size]");
      if (!btn) return;
      loteSize = parseInt(btn.getAttribute("data-lote-size"), 10) || 10;
      loteAtual = 0;
      Array.prototype.forEach.call(loteToggle.querySelectorAll("[data-lote-size]"), function (b) {
        b.classList.toggle("is-active", b === btn);
      });
      render();
    });
  }
  if (pagerPrev) pagerPrev.addEventListener("click", function () { loteAtual--; render(); });
  if (pagerNext) pagerNext.addEventListener("click", function () { loteAtual++; render(); });

  // ---- Delegação de cliques (bonequinho) ---------------------------------
  function togglePanel(btn, panel) {
    if (!btn || !panel) return;
    var open = panel.hidden;
    panel.hidden = !open;
    btn.setAttribute("aria-expanded", open ? "true" : "false");
  }

  document.addEventListener("click", function (e) {
    var t = e.target.closest("#avatar-toggle");
    if (!t) return;
    togglePanel(t, document.getElementById("avatar-panel"));
  });

  // 1) pintura instantânea com o que já está salvo neste navegador
  applyMap(readLocal());
  criarBusca("Buscar súmula por número ou palavra (ex.: 331, horas extras)", function () { loteAtual = 0; render(); });
  render();
  carregarCobrancas();

  // 2) progresso na conta de quem entrou (própria coleção "progress-sumulas")
  var progressUnsub = null;

  function bindUser(uid) {
    viewerId = uid;
    dbCap = firebase.firestore();
    progressDoc = dbCap.doc("progress-sumulas/" + viewerId);
    dbReady = true;
    if (progressUnsub) { progressUnsub(); progressUnsub = null; }
    progressUnsub = progressDoc.onSnapshot(function (snap) {
      if (!snap.exists) return;
      var data = snap.data();
      if (!data) return;
      applyingRemote = true;
      if (data.map) { applyMap(data.map); writeLocal(data.map); }
      if (data.avatar && GS.GENDER_BASE[data.avatar.gender] && GS.TONE_MOD[data.avatar.tone]) {
        avatarPref = { gender: data.avatar.gender, tone: data.avatar.tone };
        GS.writeAvatarPref(avatarPref, AVATAR_KEY);
        syncAvatarControls();
      }
      render();
      applyingRemote = false;
      scheduleGroupSync(); // o total da conta (não só deste aparelho) vai para os grupos
    }, function () {});
    subscribeAllGroups();
    pushProgressToGroups();
  }

  if (window.firebase && window.DIARIO_FIREBASE_CONFIG) {
    if (!firebase.apps.length) firebase.initializeApp(window.DIARIO_FIREBASE_CONFIG);
    // Só salva na nuvem quem entrou com Google ou e-mail e senha (sem login
    // anônimo). Sem entrar, tudo fica salvo neste navegador.
    firebase.auth().onAuthStateChanged(function (user) {
      if (!user || user.isAnonymous) return;
      if (viewerId !== user.uid) bindUser(user.uid);
      renderAccountUI(user);
    });
  } else {
    dbReady = true;
  }
})();

/* Login com Google (conta-google.js, mesma pasta deste script) */
(function () {
  // document.currentScript some vezes já não está mais disponível quando este
  // bloco roda (script assíncrono, widget do Blogger etc.) — por isso varremos
  // as tags <script> da página em vez de depender só dele.
  var all0 = document.getElementsByTagName("script"), src = "";
  for (var i = 0; i < all0.length; i++) {
    if (/sumulas-logic\.js/.test(all0[i].src)) { src = all0[i].src; break; }
  }
  // páginas que baixam os scripts com fetch + eval (sem <script src>): usa o CDN
  if (!src) src = "https://barbarasinfronio-lgtm.github.io/diario-informativos/sumulas-logic.js";
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
  function go() {
    if (!(window.firebase && window.DIARIO_FIREBASE_CONFIG)) return;
    carregarContaGoogle(src.replace(/[^/]+\.js(\?.*)?$/, "conta-google.js"));
  }
  if (document.readyState === "complete") go(); else window.addEventListener("load", go);
})();
