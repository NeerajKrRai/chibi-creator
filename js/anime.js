// ── Anime character search + render ──
// Characters are curated, kid-friendly, and bundled locally (see anime-data.js).
let _animeFiltered = [];
let _animeCur = null;

function allAnime() { return (typeof ANIME_CHARS !== 'undefined') ? ANIME_CHARS : []; }

function renderAnimeGrid(q) {
  const grid = document.getElementById('animeGrid');
  const query = (q || '').trim().toLowerCase();
  const list = allAnime();
  _animeFiltered = !query ? list.slice() :
    list.filter(c => c.name.toLowerCase().includes(query) || c.series.toLowerCase().includes(query));
  grid.innerHTML = '';
  if (!list.length) {
    grid.innerHTML = '<div class="an-msg">No characters bundled yet 😿</div>';
    return;
  }
  if (!_animeFiltered.length) {
    grid.innerHTML = `<div class="an-msg">No characters match "${esc(query)}" — try another name!</div>`;
    return;
  }
  _animeFiltered.forEach((c, i) => {
    const card = document.createElement('div');
    card.className = 'anime-card';
    card.innerHTML =
      `<div class="an-thumb"><img src="${c.img}" loading="lazy" alt="${esc(c.name)}"></div>` +
      `<div class="an-name">${esc(c.name)}</div>` +
      `<div class="an-series">${esc(c.series)}</div>` +
      `<button class="an-render" onclick="openAnime(${i})">✨ Render</button>`;
    grid.appendChild(card);
  });
}

function esc(s) { return String(s).replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m])); }

function openAnime(i) {
  _animeCur = _animeFiltered[i];
  if (!_animeCur) return;
  document.getElementById('avImg').src = _animeCur.img;
  document.getElementById('avName').textContent = _animeCur.name;
  document.getElementById('avSeries').textContent = _animeCur.series;
  document.getElementById('animeView').classList.add('on');
}

function closeAnime(e) {
  if (e && e.target !== document.getElementById('animeView')) return;
  document.getElementById('animeView').classList.remove('on');
  _animeCur = null;
}

function saveAnime() {
  if (!_animeCur) return;
  const img = document.getElementById('avImg');
  const done = () => {
    try {
      const c = document.createElement('canvas');
      c.width = img.naturalWidth || 300; c.height = img.naturalHeight || 400;
      c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
      const rec = { id: Date.now(), dataUrl: c.toDataURL('image/png'),
        date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) };
      addDrawing(rec).then(() => { toast('✨ Saved to your gallery!'); updateGalCount(); })
        .catch(() => toast('Hmm, could not save 😿'));
    } catch (e) { toast('Hmm, could not save 😿'); }
  };
  if (img.complete && img.naturalWidth) done();
  else img.onload = done;
}

function downloadAnime() {
  if (!_animeCur) return;
  const a = document.createElement('a');
  a.href = _animeCur.img;
  a.download = _animeCur.name.replace(/[^a-z0-9]+/gi, '_') + '.jpg';
  a.click();
  toast('📥 Picture saved!');
}
