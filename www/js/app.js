// ── Routing + boot ──
let curScreen = 'sCreate';

function go(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('on'));
  document.getElementById(id).classList.add('on');
  document.querySelectorAll('.tab').forEach(t => t.classList.toggle('on', t.dataset.s === id));
  curScreen = id;
  if (id === 'sGallery') renderGallery();
  else if (id === 'sAnime') renderAnimeGrid(document.getElementById('animeSearch').value);
}

let _toastTimer = null;
function toast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('on');
  if (_toastTimer) clearTimeout(_toastTimer);
  _toastTimer = setTimeout(() => t.classList.remove('on'), 2400);
}

window.addEventListener('load', () => {
  initChibi();
  buildControls();
  updateGalCount();
});
