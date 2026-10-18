// ── Draw / decorate on an anime character ──
// The character image is the base layer; doodles live on a separate layer so the
// eraser reveals the picture (not white). Save = the composited result.
const PAINT_COLORS = ['#2B2B2B', '#ffffff', '#C97B84', '#E8A0A8', '#52B788', '#5E81F4', '#A29BFE', '#FFD166', '#F4845F', '#FF6B6B', '#9B59B6'];
const PAINT_SIZES = [{ r: 4, d: 7 }, { r: 10, d: 13 }, { r: 20, d: 22 }];
const PAINT_STAMPS = ['🌸', '⭐', '💖', '🦋', '🌈', '✨', '👑', '🎀'];

let dPad, dctx, dLayer, dlctx, dBase, dW = 0, dH = 0;
let dColor = '#FF6B6B', dSize = 10, dTool = 'brush', dStamp = '🌸';
let dDrawing = false, dLastX = 0, dLastY = 0, dHistory = [];
const D_HIST_MAX = 20;

function openDraw(i) {
  const ch = _animeFiltered[i];
  if (!ch) return;
  _animeCur = ch;
  document.getElementById('drawTitle').textContent = '🎨 ' + ch.name;
  buildDrawTools();
  dBase = new Image();
  dBase.onload = () => { setupDrawPad(); document.getElementById('sDraw').classList.add('on'); };
  dBase.onerror = () => toast('Could not load that picture 😿');
  dBase.src = ch.img;
}

function setupDrawPad() {
  dPad = document.getElementById('drawPad');
  dctx = dPad.getContext('2d');
  const natW = dBase.naturalWidth || 300, natH = dBase.naturalHeight || 400;
  const TW = 540;
  dW = TW; dH = Math.round(TW * natH / natW);
  dPad.width = dW; dPad.height = dH;
  dLayer = document.createElement('canvas'); dLayer.width = dW; dLayer.height = dH;
  dlctx = dLayer.getContext('2d'); dlctx.lineJoin = 'round'; dlctx.lineCap = 'round';
  dHistory = [];
  recompose();
  if (!dPad._wired) {
    dPad.addEventListener('pointerdown', e => { dPad.setPointerCapture(e.pointerId); dStart(dPos(e)); });
    dPad.addEventListener('pointermove', e => { if (dDrawing) dMove(dPos(e)); });
    dPad.addEventListener('pointerup', dEnd);
    dPad.addEventListener('pointercancel', dEnd);
    dPad._wired = true;
  }
}

function recompose() { dctx.clearRect(0, 0, dW, dH); dctx.drawImage(dBase, 0, 0, dW, dH); dctx.drawImage(dLayer, 0, 0); }
function dPos(e) { const r = dPad.getBoundingClientRect(); return { x: (e.clientX - r.left) * (dW / r.width), y: (e.clientY - r.top) * (dH / r.height) }; }
function dPush() { try { dHistory.push(dLayer.toDataURL()); } catch (e) {} if (dHistory.length > D_HIST_MAX) dHistory.shift(); }

function dStart(p) {
  if (dTool === 'stamp') { dStampAt(p); return; }
  dPush(); dDrawing = true; dLastX = p.x; dLastY = p.y;
  dlctx.globalCompositeOperation = dTool === 'erase' ? 'destination-out' : 'source-over';
  dlctx.strokeStyle = dColor; dlctx.fillStyle = dColor;
  dlctx.lineWidth = dTool === 'erase' ? dSize * 2.2 : dSize;
  dlctx.beginPath(); dlctx.arc(p.x, p.y, Math.max(dlctx.lineWidth / 2, 0.6), 0, Math.PI * 2); dlctx.fill();
  recompose();
}
function dMove(p) {
  const mx = (dLastX + p.x) / 2, my = (dLastY + p.y) / 2;
  dlctx.beginPath(); dlctx.moveTo(dLastX, dLastY); dlctx.quadraticCurveTo(dLastX, dLastY, mx, my); dlctx.lineTo(p.x, p.y); dlctx.stroke();
  dLastX = p.x; dLastY = p.y; recompose();
}
function dEnd() { dDrawing = false; }
function dStampAt(p) {
  dPush();
  dlctx.globalCompositeOperation = 'source-over';
  dlctx.font = (26 + dSize * 2.4) + 'px serif'; dlctx.textAlign = 'center'; dlctx.textBaseline = 'middle';
  dlctx.fillText(dStamp, p.x, p.y); recompose();
}
function dUndo() {
  if (!dHistory.length) return;
  const u = dHistory.pop(); const im = new Image();
  im.onload = () => { dlctx.clearRect(0, 0, dW, dH); dlctx.drawImage(im, 0, 0, dW, dH); recompose(); };
  im.src = u;
}
function dClear() { dPush(); dlctx.clearRect(0, 0, dW, dH); recompose(); }

function dSetTool(t) {
  dTool = t;
  document.getElementById('dBrush').classList.toggle('on', t === 'brush');
  document.getElementById('dErase').classList.toggle('on', t === 'erase');
  if (t !== 'stamp') document.querySelectorAll('#dStamps .opt').forEach(s => s.classList.remove('on'));
}
function dSetColor(c, el) {
  dColor = c; if (dTool === 'erase') dSetTool('brush');
  document.querySelectorAll('#dColors .swatch').forEach(s => s.classList.remove('on')); if (el) el.classList.add('on');
}
function dSetSize(r, el) { dSize = r; document.querySelectorAll('#dSizes .size').forEach(s => s.classList.remove('on')); if (el) el.classList.add('on'); }
function dSetStamp(s, el) {
  dStamp = s; dTool = 'stamp';
  document.getElementById('dBrush').classList.remove('on'); document.getElementById('dErase').classList.remove('on');
  document.querySelectorAll('#dStamps .opt').forEach(x => x.classList.remove('on')); if (el) el.classList.add('on');
}

function buildDrawTools() {
  const cr = document.getElementById('dColors');
  if (cr.childElementCount) return; // build once
  PAINT_COLORS.forEach(c => {
    const b = document.createElement('button'); b.className = 'swatch' + (c === dColor ? ' on' : ''); b.style.background = c;
    if (c === '#ffffff') b.style.boxShadow = '0 0 0 1px rgba(0,0,0,.25),0 2px 6px rgba(0,0,0,.35)';
    b.onclick = () => dSetColor(c, b); cr.appendChild(b);
  });
  const sr = document.getElementById('dSizes');
  PAINT_SIZES.forEach(s => { const b = document.createElement('button'); b.className = 'size' + (s.r === dSize ? ' on' : ''); const d = document.createElement('span'); d.className = 'dot'; d.style.width = s.d + 'px'; d.style.height = s.d + 'px'; b.appendChild(d); b.onclick = () => dSetSize(s.r, b); sr.appendChild(b); });
  const st = document.getElementById('dStamps');
  PAINT_STAMPS.forEach(s => { const b = document.createElement('button'); b.className = 'opt'; b.textContent = s; b.onclick = () => dSetStamp(s, b); st.appendChild(b); });
  dSetTool('brush');
}

function closeDraw() { document.getElementById('sDraw').classList.remove('on'); }

function saveDraw() {
  const rec = { id: Date.now(), dataUrl: dPad.toDataURL('image/png'), date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) };
  addDrawing(rec).then(() => { toast('✨ Saved to your gallery!'); updateGalCount(); }).catch(() => toast('Hmm, could not save 😿'));
}
function downloadDraw() {
  const a = document.createElement('a');
  a.href = dPad.toDataURL('image/png');
  a.download = (_animeCur ? _animeCur.name.replace(/[^a-z0-9]+/gi, '_') : 'drawing') + '_decorated.png';
  a.click(); toast('📥 Picture saved!');
}
