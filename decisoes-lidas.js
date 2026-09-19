/* =====================================================================
   Estuda Mana — Diário das Decisões: marcar como lido, pontos e riscado
   (decisoes-lidas.js)

   Carregar DEPOIS de rg-repetitivos-logic.js. Não altera esse arquivo:
   acrescenta o checkbox, o ponto e o riscado aos cards que ele desenha,
   e refaz isso sempre que a lista é redesenhada (filtros, busca).

   Estado: localStorage, chave "decisoes-lidas", no mesmo formato da página
   de Leis:  { "STJ:Tema 1372": { lida: true, lidaEm: "2026-09-19T..." } }

   Gancho para sincronizar depois (Firebase/grupos): a cada marcação é
   disparado o evento  window "estuda:lida"  com
   detail = { diario: "decisoes", key, lida, map }.
   ===================================================================== */
(function () {
  'use strict';

  var KEY = 'decisoes-lidas';
  var map = readLocal();

  function readLocal() {
    try {
      var raw = localStorage.getItem(KEY);
      var obj = raw ? JSON.parse(raw) : {};
      return obj && typeof obj === 'object' ? obj : {};
    } catch (e) { return {}; }
  }
  function writeLocal() {
    try { localStorage.setItem(KEY, JSON.stringify(map)); } catch (e) { /* modo privado: segue sem salvar */ }
  }

  function text(el, sel) {
    var n = el.querySelector(sel);
    return n ? n.textContent.trim() : '';
  }
  function keyOf(card) {
    return text(card, '.tag-org') + ':' + text(card, '.tag-tema');
  }
  function isRead(key) { return !!(map[key] && map[key].lida); }

  function applyState(card, key) {
    var read = isRead(key);
    card.classList.toggle('read', read);
    var box = card.querySelector('.em-check');
    if (box) box.checked = read;
    var pts = card.querySelector('.em-pts');
    if (pts) pts.textContent = read ? '+1 ponto' : '1 ponto';
  }

  function enhance(card) {
    if (card.getAttribute('data-em') === '1') return;
    var top = card.querySelector('.top-row');
    var key = keyOf(card);
    if (!top || key === ':') return;
    card.setAttribute('data-em', '1');
    card.setAttribute('data-em-key', key);

    var box = document.createElement('input');
    box.type = 'checkbox';
    box.className = 'em-check';
    box.setAttribute('aria-label', 'Marcar ' + (text(card, '.tag-tema') || 'a tese') + ' como lida');
    /* o card inteiro abre o detalhe (modal); marcar não pode abri-lo */
    box.addEventListener('click', function (e) { e.stopPropagation(); });
    top.insertBefore(box, top.firstChild);

    var pts = document.createElement('span');
    pts.className = 'em-pts';
    top.appendChild(pts);

    applyState(card, key);
  }

  function enhanceAll(grid) {
    var cards = grid.querySelectorAll('.card');
    for (var i = 0; i < cards.length; i++) enhance(cards[i]);
    updateProgress();
  }

  /* ---------- barra de pontos ---------- */
  var progress;
  function buildProgress() {
    var toolbar = document.querySelector('.toolbar');
    if (!toolbar || !toolbar.parentNode) return;
    progress = document.createElement('div');
    progress.className = 'em-progress';
    progress.innerHTML =
      '<div class="em-prog-text"><span><b class="em-total">0</b>pontos</span><span class="em-of"></span></div>' +
      '<div class="em-bar"><i></i></div>';
    toolbar.parentNode.insertBefore(progress, toolbar);
  }
  function totalTeses() {
    var b = document.querySelector('#stats .stat b');
    var n = b ? parseInt(b.textContent, 10) : NaN;
    return isNaN(n) ? document.querySelectorAll('#grid .card').length : n;
  }
  function updateProgress() {
    if (!progress) return;
    var read = 0;
    for (var k in map) { if (map[k] && map[k].lida) read++; }
    var total = totalTeses() || 1;
    progress.querySelector('.em-total').textContent = read;
    progress.querySelector('.em-of').textContent = read + ' de ' + total + ' teses lidas';
    progress.querySelector('.em-bar i').style.width = Math.min(100, (read / total) * 100) + '%';
  }

  /* ---------- eventos ---------- */
  function onChange(ev) {
    var box = ev.target;
    if (!box || !box.classList || !box.classList.contains('em-check')) return;
    var card = box.closest('.card');
    if (!card) return;
    var key = card.getAttribute('data-em-key') || keyOf(card);
    if (box.checked) map[key] = { lida: true, lidaEm: new Date().toISOString() };
    else delete map[key];
    writeLocal();
    applyState(card, key);
    updateProgress();
    try {
      window.dispatchEvent(new CustomEvent('estuda:lida', {
        detail: { diario: 'decisoes', key: key, lida: box.checked, map: map }
      }));
    } catch (e) { /* navegador antigo: sem evento */ }
  }

  function start() {
    var grid = document.getElementById('grid');
    if (!grid) return;
    buildProgress();
    grid.addEventListener('change', onChange);
    enhanceAll(grid);

    /* refaz o acréscimo quando a página redesenha a lista (filtros, busca);
       observa só os filhos diretos do grid, então nossas mudanças dentro dos cards não disparam de novo */
    new MutationObserver(function () { enhanceAll(grid); })
      .observe(grid, { childList: true });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
