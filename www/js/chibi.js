// ── Chibi render engine ── (drawn on canvas; re-rendered from state each change)
let cv, ctx;
const LW = 300, LH = 360;               // logical drawing space
const CX = 150;                         // centre x

const state = {
  bg: BACKGROUNDS[0], skin: SKINS[0],
  hair: 'bob', hairColor: HAIR_COLORS[1],
  eyes: 'sparkle', mouth: 'smile', blush: true,
  outfit: OUTFITS[0], accessory: '🎀',
};

function initChibi() {
  cv = document.getElementById('chibi');
  ctx = cv.getContext('2d');
  cv.width = LW * 2; cv.height = LH * 2;     // crisp 2x internal res
  render();
}

function render() {
  ctx.setTransform(2, 0, 0, 2, 0, 0);
  ctx.clearRect(0, 0, LW, LH);
  drawBackground();
  drawHairBack();
  drawBody();
  drawHead();
  drawHairFront();
  drawFace();
  drawAccessory();
}

// ── layers ──
function drawBackground() {
  const g = ctx.createLinearGradient(0, 0, 0, LH);
  g.addColorStop(0, state.bg.a); g.addColorStop(1, state.bg.b);
  ctx.fillStyle = g; ctx.fillRect(0, 0, LW, LH);
  // soft dots
  ctx.fillStyle = 'rgba(255,255,255,.35)';
  [[40, 60, 6], [250, 90, 8], [270, 300, 5], [30, 300, 7], [150, 40, 4]].forEach(([x, y, r]) => {
    ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill();
  });
}

function hairBlob(cx, cy, r) { ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fill(); }

function drawHairBack() {
  ctx.fillStyle = state.hairColor;
  const s = state.hair;
  // side/long panels behind the head
  if (s === 'long') {
    ctx.beginPath();
    ctx.moveTo(60, 150); ctx.quadraticCurveTo(40, 300, 78, 332);
    ctx.lineTo(222, 332); ctx.quadraticCurveTo(260, 300, 240, 150); ctx.closePath(); ctx.fill();
  } else if (s === 'twintail') {
    hairBlob(74, 190, 26); hairBlob(226, 190, 26);   // ties by the head
    hairBlob(56, 256, 32); hairBlob(244, 256, 32);   // upper tails
    hairBlob(60, 312, 23); hairBlob(240, 312, 23);   // lower tails
  } else if (s === 'ponytail') {
    ctx.beginPath(); ctx.moveTo(236, 150); ctx.quadraticCurveTo(292, 220, 250, 300);
    ctx.quadraticCurveTo(236, 250, 214, 170); ctx.closePath(); ctx.fill();
  } else if (s === 'bob') {
    ctx.beginPath(); ctx.moveTo(62, 140); ctx.quadraticCurveTo(58, 215, 86, 232);
    ctx.lineTo(214, 232); ctx.quadraticCurveTo(242, 215, 238, 140); ctx.closePath(); ctx.fill();
  }
  // crown behind the top of the head (shows as a rim)
  hairBlob(CX, 132, 96);
  if (s === 'bun') hairBlob(CX, 44, 28);
}

function drawBody() {
  // neck
  ctx.fillStyle = state.skin;
  ctx.fillRect(CX - 15, 222, 30, 32);
  // shirt
  ctx.fillStyle = state.outfit;
  ctx.beginPath();
  ctx.moveTo(110, 262); ctx.quadraticCurveTo(150, 244, 190, 262);
  ctx.lineTo(220, 360); ctx.lineTo(80, 360); ctx.closePath(); ctx.fill();
  // collar
  ctx.fillStyle = 'rgba(255,255,255,.35)';
  ctx.beginPath(); ctx.moveTo(132, 252); ctx.lineTo(150, 272); ctx.lineTo(168, 252); ctx.closePath(); ctx.fill();
}

function drawHead() {
  ctx.fillStyle = state.skin;
  ctx.beginPath(); ctx.arc(CX, 150, 88, 0, Math.PI * 2); ctx.fill();
  // ears
  ctx.beginPath(); ctx.arc(66, 158, 13, 0, 7); ctx.arc(234, 158, 13, 0, 7); ctx.fill();
}

function drawHairFront() {
  ctx.fillStyle = state.hairColor;
  const s = state.hair;
  // bangs across the forehead (sits above the eyes at y~150)
  ctx.beginPath();
  ctx.moveTo(64, 134);
  if (s === 'short') {
    ctx.quadraticCurveTo(150, 60, 236, 134);
    ctx.quadraticCurveTo(205, 120, 185, 132);
    ctx.quadraticCurveTo(150, 108, 115, 132);
    ctx.quadraticCurveTo(95, 120, 64, 134);
  } else {
    // swept bangs
    ctx.quadraticCurveTo(150, 58, 236, 134);
    ctx.quadraticCurveTo(190, 138, 150, 126);
    ctx.quadraticCurveTo(110, 138, 64, 134);
  }
  ctx.closePath(); ctx.fill();
  // a little shine
  ctx.strokeStyle = 'rgba(255,255,255,.5)'; ctx.lineWidth = 3; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(120, 96); ctx.quadraticCurveTo(150, 84, 182, 94); ctx.stroke();
}

function drawFace() {
  const eyeY = 158, lx = 118, rx = 182;
  // blush
  if (state.blush) {
    ctx.fillStyle = 'rgba(255,133,150,.45)';
    ctx.beginPath(); ctx.ellipse(104, 182, 16, 10, 0, 0, 7); ctx.ellipse(196, 182, 16, 10, 0, 0, 7); ctx.fill();
  }
  ctx.fillStyle = '#2b2320'; ctx.strokeStyle = '#2b2320';
  ctx.lineWidth = 5; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  const e = state.eyes;
  if (e === 'round' || e === 'sparkle') {
    const r = e === 'sparkle' ? 17 : 13;
    [lx, rx].forEach(x => {
      ctx.beginPath(); ctx.ellipse(x, eyeY, r * 0.8, r, 0, 0, 7); ctx.fill();
      ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(x - 4, eyeY - 5, r * 0.3, 0, 7); ctx.fill();
      if (e === 'sparkle') { ctx.beginPath(); ctx.arc(x + 4, eyeY + 4, r * 0.18, 0, 7); ctx.fill(); }
      ctx.fillStyle = '#2b2320';
    });
  } else if (e === 'happy') {
    [lx, rx].forEach(x => { ctx.beginPath(); ctx.arc(x, eyeY + 4, 12, Math.PI * 1.15, Math.PI * 1.85); ctx.stroke(); });
  } else if (e === 'wink') {
    ctx.beginPath(); ctx.ellipse(lx, eyeY, 11, 14, 0, 0, 7); ctx.fill();
    ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(lx - 4, eyeY - 5, 4, 0, 7); ctx.fill(); ctx.fillStyle = '#2b2320';
    ctx.beginPath(); ctx.arc(rx, eyeY + 4, 12, Math.PI * 1.15, Math.PI * 1.85); ctx.stroke();
  }
  // mouth
  ctx.fillStyle = '#b5424f'; ctx.strokeStyle = '#b5424f'; ctx.lineWidth = 4;
  const my = 196;
  const m = state.mouth;
  if (m === 'smile') { ctx.beginPath(); ctx.arc(CX, my - 4, 11, Math.PI * 0.15, Math.PI * 0.85); ctx.stroke(); }
  else if (m === 'cat') { ctx.beginPath(); ctx.arc(CX - 6, my, 7, 0, Math.PI); ctx.arc(CX + 6, my, 7, 0, Math.PI); ctx.stroke(); }
  else if (m === 'open') { ctx.beginPath(); ctx.ellipse(CX, my, 9, 11, 0, 0, 7); ctx.fill(); }
  else { ctx.beginPath(); ctx.arc(CX, my, 3, 0, 7); ctx.fill(); }
}

function drawAccessory() {
  if (!state.accessory) return;
  ctx.font = '48px serif';
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(state.accessory, 212, 74);
}

// ── controls ──
function pick(key, val) { state[key] = val; render(); }

function randomize() {
  const r = a => a[Math.floor(Math.random() * a.length)];
  state.bg = r(BACKGROUNDS); state.skin = r(SKINS);
  state.hair = r(HAIR_STYLES).k; state.hairColor = r(HAIR_COLORS);
  state.eyes = r(EYES).k; state.mouth = r(MOUTHS).k; state.blush = Math.random() > 0.35;
  state.outfit = r(OUTFITS); state.accessory = r(ACCESSORIES);
  syncControls(); render();
}

function saveChibi() {
  const rec = {
    id: Date.now(),
    dataUrl: cv.toDataURL('image/png'),
    date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
  };
  addDrawing(rec).then(() => { toast('✨ Saved to your gallery!'); updateGalCount(); })
    .catch(() => toast('Hmm, could not save 😿'));
}
