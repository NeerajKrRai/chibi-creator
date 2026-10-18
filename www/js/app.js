// ── Routing + boot ──
let curScreen = 'sCreate';

function go(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('on'));
  document.getElementById(id).classList.add('on');
  curScreen = id;
  if (id === 'sGallery') renderGallery();
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
