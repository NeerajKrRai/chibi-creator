# 🧒 Neeksha's Chibi Creator

Make kawaii chibi characters — mix skin, hair, eyes, outfit, accessories — and
keep every cutie in your own gallery. Part of **[Neeksha's Apps](https://apps.neeksha.com)**.

**Live:** https://apps.neeksha.com/chibi-creator/

## What it does
- Build a chibi from parts: background, skin, hair style + colour, eyes, mouth,
  cheeks, outfit, accessory — with a live canvas preview
- **🎲 Surprise me!** randomises everything
- **✨ Save** chibis to a gallery; reopen, download (PNG) or delete them
- Works fully **offline** (PWA), installs to the home screen, 🏠 Apps link home

## How it's built
Zero backend, no network, no tracking. The chibi is drawn on a `<canvas>` from
state (so export is a trivial `toDataURL`), re-rendered on every change. Chibis
are stored **on the device** in IndexedDB. Classic scripts, one global scope:
`data → store → chibi → controls → gallery → app → pwa`. Self-hosted fonts,
network-first service worker.

## Deploy
Site is the `gh-pages` branch (contents of `www/` + `.nojekyll`); refresh with
`git commit-tree HEAD:www` and force-push. **No CNAME here** — the domain lives
on the hub repo (`NeerajKrRai.github.io`).

*Made with love — ♪( ´∀｀)人(´∀｀ )♪ ～♥*
