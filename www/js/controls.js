// ── Control panel: one row per part ──
function _btn(cls, html, active, onPick) {
  const b = document.createElement('button');
  b.className = cls + (active ? ' on' : '');
  if (html !== null) b.innerHTML = html;
  b.onclick = () => {
    b.parentElement.querySelectorAll('.on').forEach(x => x.classList.remove('on'));
    b.classList.add('on');
    onPick();
  };
  return b;
}

function _fill(id, builder) {
  const row = document.getElementById(id);
  if (!row) return;
  row.innerHTML = '';
  builder(row);
}

function buildControls() {
  _fill('bgRow', row => BACKGROUNDS.forEach(bg => {
    const b = _btn('swatch', null, state.bg.k === bg.k, () => pick('bg', bg));
    b.style.background = `linear-gradient(135deg, ${bg.a}, ${bg.b})`;
    row.appendChild(b);
  }));
  _fill('skinRow', row => SKINS.forEach(c => {
    const b = _btn('swatch', null, state.skin === c, () => pick('skin', c));
    b.style.background = c; row.appendChild(b);
  }));
  _fill('hairStyleRow', row => HAIR_STYLES.forEach(h => {
    row.appendChild(_btn('opt', h.e, state.hair === h.k, () => pick('hair', h.k)));
  }));
  _fill('hairColorRow', row => HAIR_COLORS.forEach(c => {
    const b = _btn('swatch', null, state.hairColor === c, () => pick('hairColor', c));
    b.style.background = c; if (c === '#f6f0e6') b.style.boxShadow = '0 0 0 1px rgba(0,0,0,.2), 0 2px 6px rgba(0,0,0,.3)';
    row.appendChild(b);
  }));
  _fill('eyeRow', row => EYES.forEach(e => row.appendChild(_btn('opt', e.e, state.eyes === e.k, () => pick('eyes', e.k)))));
  _fill('mouthRow', row => MOUTHS.forEach(m => row.appendChild(_btn('opt', m.e, state.mouth === m.k, () => pick('mouth', m.k)))));
  _fill('outfitRow', row => OUTFITS.forEach(c => {
    const b = _btn('swatch', null, state.outfit === c, () => pick('outfit', c));
    b.style.background = c; if (c === '#F5EFE6') b.style.boxShadow = '0 0 0 1px rgba(0,0,0,.2), 0 2px 6px rgba(0,0,0,.3)';
    row.appendChild(b);
  }));
  _fill('accRow', row => ACCESSORIES.forEach(a => {
    row.appendChild(_btn('opt', a === '' ? '🚫' : a, state.accessory === a, () => pick('accessory', a)));
  }));
  // blush toggle
  const bt = document.getElementById('blushToggle');
  if (bt) { bt.classList.toggle('on', state.blush); bt.onclick = () => { state.blush = !state.blush; bt.classList.toggle('on', state.blush); render(); }; }
}

// rebuild everything to match state (after Surprise me!)
function syncControls() { buildControls(); }
