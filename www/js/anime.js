// ── Anime character search ── (each result opens on a draw/decorate canvas)
// Characters are curated, kid-friendly, and bundled locally (see anime-list.js).
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
  if (!list.length) { grid.innerHTML = '<div class="an-msg">No characters bundled yet 😿</div>'; return; }
  if (!_animeFiltered.length) { grid.innerHTML = `<div class="an-msg">No characters match "${esc(query)}" — try another name!</div>`; return; }
  _animeFiltered.forEach((c, i) => {
    const card = document.createElement('div');
    card.className = 'anime-card';
    card.innerHTML =
      `<div class="an-thumb"><img src="${c.img}" loading="lazy" alt="${esc(c.name)}"></div>` +
      `<div class="an-name">${esc(c.name)}</div>` +
      `<div class="an-series">${esc(c.series)}</div>` +
      `<button class="an-render" onclick="openDraw(${i})">🎨 Decorate</button>`;
    grid.appendChild(card);
  });
}

function esc(s) { return String(s).replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m])); }
