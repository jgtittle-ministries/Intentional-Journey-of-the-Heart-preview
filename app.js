// Shared UI: dark-mode toggle + client-side search overlay.
// Loaded on every page. The early no-flash theme snippet lives inline in <head>.
(function () {
  'use strict';

  // ── Dark mode ──────────────────────────────────────────────────────
  const root = document.documentElement;
  const toggle = document.getElementById('theme-toggle');
  function isDark() { return root.getAttribute('data-theme') === 'dark'; }
  function paintToggle() {
    if (!toggle) return;
    toggle.textContent = isDark() ? '☀' : '☾';
    toggle.setAttribute('aria-pressed', isDark() ? 'true' : 'false');
    toggle.title = isDark() ? 'Switch to light' : 'Switch to dark';
  }
  function setTheme(dark) {
    if (dark) root.setAttribute('data-theme', 'dark');
    else root.removeAttribute('data-theme');
    try { localStorage.setItem('ijh-theme', dark ? 'dark' : 'light'); } catch (e) {}
    paintToggle();
  }
  if (toggle) {
    paintToggle();
    toggle.addEventListener('click', () => setTheme(!isDark()));
  }

  // ── Search ─────────────────────────────────────────────────────────
  const openBtn = document.getElementById('search-open');
  let overlay, input, results, indexReady = false, indexLoading = false, sel = -1;

  function buildOverlay() {
    overlay = document.createElement('div');
    overlay.id = 'search-overlay';
    overlay.setAttribute('aria-hidden', 'true');
    overlay.innerHTML =
      '<div class="search-backdrop"></div>' +
      '<div class="search-panel" role="dialog" aria-modal="true" aria-label="Search">' +
        '<div class="search-bar">' +
          '<span class="search-ic">⌕</span>' +
          '<input type="text" id="search-input" placeholder="Search all six volumes…" ' +
            'autocomplete="off" autocapitalize="off" spellcheck="false" />' +
          '<button type="button" class="search-close" aria-label="Close">Esc</button>' +
        '</div>' +
        '<div class="search-results" id="search-results"></div>' +
      '</div>';
    document.body.appendChild(overlay);
    input = overlay.querySelector('#search-input');
    results = overlay.querySelector('#search-results');
    overlay.querySelector('.search-backdrop').addEventListener('click', closeSearch);
    overlay.querySelector('.search-close').addEventListener('click', closeSearch);
    let t;
    input.addEventListener('input', () => { clearTimeout(t); t = setTimeout(runSearch, 120); });
    input.addEventListener('keydown', onKey);
  }

  function loadIndex() {
    if (indexReady || indexLoading) return;
    indexLoading = true;
    const sc = document.createElement('script');
    sc.src = 'search-index.js';
    sc.onload = () => { indexReady = true; indexLoading = false; runSearch(); };
    sc.onerror = () => { indexLoading = false; if (results) results.innerHTML = '<p class="search-empty">Could not load the search index.</p>'; };
    document.head.appendChild(sc);
  }

  function openSearch() {
    if (!overlay) buildOverlay();
    overlay.classList.add('is-open');
    overlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    input.value = '';
    results.innerHTML = '<p class="search-empty">Type to search titles and chapter text…</p>';
    sel = -1;
    input.focus();
    loadIndex();
  }
  function closeSearch() {
    if (!overlay) return;
    overlay.classList.remove('is-open');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function esc(s) { return s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }
  function rxEsc(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }

  function highlight(text, tokens) {
    let out = esc(text);
    tokens.forEach(tok => {
      out = out.replace(new RegExp('(' + rxEsc(tok) + ')', 'gi'), '<mark>$1</mark>');
    });
    return out;
  }

  function snippet(body, tokens) {
    const low = body.toLowerCase();
    let at = -1;
    for (const tok of tokens) { const i = low.indexOf(tok); if (i !== -1 && (at === -1 || i < at)) at = i; }
    if (at === -1) at = 0;
    const start = Math.max(0, at - 60);
    let frag = body.slice(start, start + 200).trim();
    if (start > 0) frag = '… ' + frag;
    return highlight(frag, tokens);
  }

  function runSearch() {
    if (!indexReady) { if (input.value.trim()) results.innerHTML = '<p class="search-empty">Loading index…</p>'; return; }
    const q = input.value.trim().toLowerCase();
    if (!q) { results.innerHTML = '<p class="search-empty">Type to search titles and chapter text…</p>'; sel = -1; return; }
    const tokens = q.split(/\s+/).filter(Boolean);
    const idx = window.SEARCH_INDEX || [];
    const scored = [];
    for (const e of idx) {
      const tl = e.t.toLowerCase(), bl = e.b.toLowerCase();
      let score = 0, all = true;
      for (const tok of tokens) {
        const inT = tl.includes(tok), inB = bl.includes(tok);
        if (!inT && !inB) { all = false; break; }
        if (inT) score += 10;
        if (inB) score += (bl.split(tok).length - 1);
      }
      if (all) scored.push({ e, score });
    }
    scored.sort((a, b) => b.score - a.score);
    const top = scored.slice(0, 25);
    if (!top.length) { results.innerHTML = '<p class="search-empty">No matches for “' + esc(input.value.trim()) + '”.</p>'; sel = -1; return; }
    results.innerHTML = top.map((r, i) =>
      '<a class="search-hit" href="reader.html#' + encodeURIComponent(r.e.p) + '" data-i="' + i + '">' +
        '<span class="sh-vol">' + esc(r.e.v) + '</span>' +
        '<span class="sh-title">' + highlight(r.e.t, tokens) + '</span>' +
        '<span class="sh-snip">' + snippet(r.e.b, tokens) + '</span>' +
      '</a>'
    ).join('');
    sel = -1;
  }

  function onKey(e) {
    const hits = results ? [...results.querySelectorAll('.search-hit')] : [];
    if (e.key === 'ArrowDown') { e.preventDefault(); if (hits.length) { sel = (sel + 1) % hits.length; markSel(hits); } }
    else if (e.key === 'ArrowUp') { e.preventDefault(); if (hits.length) { sel = (sel - 1 + hits.length) % hits.length; markSel(hits); } }
    else if (e.key === 'Enter') { if (sel >= 0 && hits[sel]) { e.preventDefault(); window.location.href = hits[sel].getAttribute('href'); } }
    else if (e.key === 'Escape') { e.preventDefault(); closeSearch(); }
  }
  function markSel(hits) {
    hits.forEach(h => h.classList.remove('is-sel'));
    if (hits[sel]) { hits[sel].classList.add('is-sel'); hits[sel].scrollIntoView({ block: 'nearest' }); }
  }

  if (openBtn) openBtn.addEventListener('click', openSearch);
  // "/" anywhere (except while typing) opens search.
  document.addEventListener('keydown', (e) => {
    if (e.key === '/' && !/^(INPUT|TEXTAREA)$/.test(document.activeElement.tagName) && !document.activeElement.isContentEditable) {
      e.preventDefault(); openSearch();
    }
  });
})();
