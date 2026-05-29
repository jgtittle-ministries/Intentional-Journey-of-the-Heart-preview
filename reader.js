// ============================================
// Markdown parser — handles the source's actual subset
// ============================================
(function () {
  'use strict';

  const escapeHtml = (s) => s.replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));

  // Inline formatting: code, bold, italic, links, images
  function inline(text) {
    let s = escapeHtml(text);
    // Inline code
    s = s.replace(/`([^`]+)`/g, (_, code) => '<code>' + code + '</code>');
    // Shared: resolve a relative path against the current chapter's docs/ dir.
    function resolvePath(u) {
      if (/^https?:|^data:|^\//.test(u)) return u;
      const ctx = window.__current_md_path || '';
      const parts = ctx.substring(0, ctx.lastIndexOf('/')).split('/');
      let t = u;
      if (t.startsWith('./')) t = t.slice(2);
      while (t.startsWith('../')) { parts.pop(); t = t.slice(3); }
      return (parts.length ? parts.join('/') + '/' : '') + t;
    }
    // Images ![alt](src) with an optional {: …} attr-list. Any .classes in
    // the attr-list are added to the figure (e.g. {: .inset-left} for a small
    // float-left figure); default with no attr-list is the full-width figure.
    s = s.replace(/!\[([^\]]*)\]\(([^)]+)\)(?:\{:\s*([^}]*?)\s*\})?/g, (_, alt, src, attrs) => {
      const safeAlt = alt.replace(/"/g, '&quot;');
      const resolved = resolvePath(src);
      let cls = 'md-figure';
      if (attrs) { const m = attrs.match(/\.[A-Za-z0-9_-]+/g); if (m) cls += ' ' + m.map(c => c.slice(1)).join(' '); }
      // `alt` is already HTML-escaped (inline() escapes the whole string up
      // front), so it is safe to drop straight into the figcaption — escaping
      // again here would double-encode apostrophes/ampersands in captions.
      return '<figure class="' + cls + '"><img src="' + resolved + '" alt="' + safeAlt + '" loading="lazy"/>' +
             (alt ? '<figcaption>' + alt + '</figcaption>' : '') +
             '</figure>';
    });
    // Links [text](url) with an optional {: …} attr-list (MkDocs attr_list,
    // used by the PDF-popup links). .md links open in the reader; PDFs and
    // other files get their relative path resolved and any classes/
    // data-pdf-label carried through so the popup handler can pick them up.
    s = s.replace(/\[([^\]]+)\]\(([^)]+)\)(?:\{:\s*([^}]*?)\s*\})?/g, (_, txt, url, attrs) => {
      const safeUrl = url.replace(/"/g, '%22');
      if (/\.md(#|$)/.test(safeUrl) && !/^https?:/.test(safeUrl)) {
        return '<a href="reader.html#' + encodeURIComponent(resolvePath(safeUrl)) + '">' + txt + '</a>';
      }
      let cls = [], label = '';
      if (attrs) {
        (attrs.match(/\.[A-Za-z0-9_-]+/g) || []).forEach(c => cls.push(c.slice(1)));
        // escapeHtml has already run, so the quotes are &quot; here.
        const m = attrs.match(/data-pdf-label\s*=\s*(?:"|&quot;)([\s\S]*?)(?:"|&quot;)/);
        if (m) label = m[1];
      }
      const resolved = resolvePath(safeUrl);
      let attrStr = '';
      if (cls.length) attrStr += ' class="' + cls.join(' ') + '"';
      if (label) attrStr += ' data-pdf-label="' + label.replace(/"/g, '&quot;') + '"';
      const ext = /^https?:/.test(safeUrl) ? ' target="_blank" rel="noopener"' : '';
      return '<a href="' + resolved + '"' + attrStr + ext + '>' + txt + '</a>';
    });
    // Bold **text** and __text__
    s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    s = s.replace(/__([^_]+)__/g, '<strong>$1</strong>');
    // Italic *text* and _text_ (single, not surrounded by other *)
    s = s.replace(/(?<![*\w])\*([^*\n]+?)\*(?!\*)/g, '<em>$1</em>');
    s = s.replace(/(?<![_\w])_([^_\n]+?)_(?!_)/g, '<em>$1</em>');
    return s;
  }

  function parseTable(lines, start) {
    // lines[start] is header row, lines[start+1] is separator
    if (start + 1 >= lines.length) return null;
    if (!/^\s*\|?[\s\-:|]+\|?\s*$/.test(lines[start + 1])) return null;
    const splitRow = (row) => row.replace(/^\s*\|/, '').replace(/\|\s*$/, '').split('|').map(c => c.trim());
    const header = splitRow(lines[start]);
    let i = start + 2;
    const rows = [];
    while (i < lines.length && lines[i].includes('|') && lines[i].trim() !== '') {
      rows.push(splitRow(lines[i]));
      i++;
    }
    let html = '<table><thead><tr>';
    header.forEach(h => html += '<th>' + inline(h) + '</th>');
    html += '</tr></thead><tbody>';
    rows.forEach(r => {
      html += '<tr>';
      r.forEach(c => html += '<td>' + inline(c) + '</td>');
      html += '</tr>';
    });
    html += '</tbody></table>';
    return { html, consumed: i - start };
  }

  function parseAdmonition(lines, start) {
    const m = lines[start].match(/^!!!\s+(\w+)(?:\s+"([^"]*)")?/);
    if (!m) return null;
    const kind = m[1].toLowerCase();
    const title = m[2] || kind.toUpperCase();
    let i = start + 1;
    const inner = [];
    while (i < lines.length) {
      const ln = lines[i];
      if (ln.trim() === '') { inner.push(''); i++; continue; }
      if (/^    /.test(ln) || /^\t/.test(ln)) {
        inner.push(ln.replace(/^(    |\t)/, ''));
        i++;
      } else {
        break;
      }
    }
    // trim trailing blanks
    while (inner.length && inner[inner.length-1] === '') inner.pop();
    const inside = parseBlocks(inner);
    const html = `<div class="admonition ${kind}"><div class="admonition-title">${escapeHtml(title)}</div>${inside}</div>`;
    return { html, consumed: i - start };
  }

  function parseList(lines, start, ordered) {
    const marker = ordered ? /^(\s*)\d+\.\s+(.*)$/ : /^(\s*)[-*+]\s+(.*)$/;
    const items = [];
    let i = start;
    let baseIndent = -1;
    while (i < lines.length) {
      const m = lines[i].match(marker);
      if (m) {
        const indent = m[1].length;
        if (baseIndent === -1) baseIndent = indent;
        if (indent !== baseIndent) break;
        const itemLines = [m[2]];
        i++;
        while (i < lines.length) {
          if (lines[i].trim() === '') {
            // could be paragraph continuation; peek ahead
            const next = lines[i + 1];
            if (next && /^\s{2,}/.test(next) && !next.match(marker)) {
              itemLines.push('');
              i++;
              continue;
            }
            break;
          }
          if (lines[i].match(marker) && (lines[i].match(/^(\s*)/)[1].length === baseIndent)) break;
          if (/^\s+/.test(lines[i])) {
            itemLines.push(lines[i].replace(new RegExp('^\\s{' + (baseIndent + 2) + '}'), ''));
            i++;
          } else if (/^\s*[-*+]\s/.test(lines[i]) || /^\s*\d+\.\s/.test(lines[i])) {
            itemLines.push(lines[i]);
            i++;
          } else {
            break;
          }
        }
        items.push(itemLines);
      } else if (lines[i].trim() === '' && i + 1 < lines.length && lines[i + 1].match(marker)) {
        i++;
      } else {
        break;
      }
    }
    if (!items.length) return null;
    const tag = ordered ? 'ol' : 'ul';
    let html = '<' + tag + '>';
    items.forEach(itemLines => {
      // If item has multiple paragraphs (blanks inside), parse as blocks; otherwise inline
      const hasBlock = itemLines.some(l => l === '') || itemLines.some(l => /^[-*+\d]/.test(l));
      if (hasBlock) {
        html += '<li>' + parseBlocks(itemLines) + '</li>';
      } else {
        html += '<li>' + inline(itemLines.join(' ')) + '</li>';
      }
    });
    html += '</' + tag + '>';
    return { html, consumed: i - start };
  }

  function parseBlocks(lines) {
    let out = '';
    let i = 0;
    while (i < lines.length) {
      const line = lines[i];
      const trimmed = line.trim();

      // Blank line
      if (trimmed === '') { i++; continue; }

      // HR
      if (/^(\s*)(-{3,}|\*{3,}|_{3,})\s*$/.test(line)) {
        out += '<hr/>';
        i++; continue;
      }

      // Heading
      const hm = line.match(/^(#{1,6})\s+(.+?)\s*#*\s*$/);
      if (hm) {
        const level = hm[1].length;
        out += '<h' + level + '>' + inline(hm[2]) + '</h' + level + '>';
        i++; continue;
      }

      // Code block
      if (/^```/.test(trimmed)) {
        const fence = trimmed.match(/^(`{3,})/)[1];
        i++;
        const code = [];
        while (i < lines.length && !lines[i].startsWith(fence)) {
          code.push(lines[i]);
          i++;
        }
        out += '<pre><code>' + escapeHtml(code.join('\n')) + '</code></pre>';
        i++; continue;
      }

      // Admonition !!! kind "title"
      if (/^!!!\s+\w+/.test(line)) {
        const r = parseAdmonition(lines, i);
        if (r) { out += r.html; i += r.consumed; continue; }
      }

      // Blockquote
      if (/^>\s?/.test(trimmed)) {
        const quoteLines = [];
        while (i < lines.length && (/^>/.test(lines[i].trim()) || lines[i].trim() === '')) {
          if (lines[i].trim() === '') {
            if (i + 1 < lines.length && /^>/.test(lines[i+1].trim())) {
              quoteLines.push('');
              i++;
              continue;
            }
            break;
          }
          quoteLines.push(lines[i].replace(/^\s*>\s?/, ''));
          i++;
        }
        out += '<blockquote>' + parseBlocks(quoteLines) + '</blockquote>';
        continue;
      }

      // Table
      if (line.includes('|') && i + 1 < lines.length && /^\s*\|?[\s\-:|]+\|?\s*$/.test(lines[i + 1])) {
        const r = parseTable(lines, i);
        if (r) { out += r.html; i += r.consumed; continue; }
      }

      // Lists
      if (/^\s*[-*+]\s/.test(line)) {
        const r = parseList(lines, i, false);
        if (r) { out += r.html; i += r.consumed; continue; }
      }
      if (/^\s*\d+\.\s/.test(line)) {
        const r = parseList(lines, i, true);
        if (r) { out += r.html; i += r.consumed; continue; }
      }

      // Paragraph
      const pLines = [];
      while (i < lines.length && lines[i].trim() !== '' &&
             !/^#{1,6}\s/.test(lines[i]) &&
             !/^>\s?/.test(lines[i].trim()) &&
             !/^!!!/.test(lines[i]) &&
             !/^```/.test(lines[i].trim()) &&
             !/^\s*[-*+]\s/.test(lines[i]) &&
             !/^\s*\d+\.\s/.test(lines[i]) &&
             !/^(\s*)(-{3,}|\*{3,}|_{3,})\s*$/.test(lines[i])) {
        pLines.push(lines[i]);
        i++;
      }
      if (pLines.length) {
        out += '<p>' + inline(pLines.join(' ').trim()) + '</p>';
      }
    }
    return out;
  }

  function stripFrontmatter(text) {
    if (!text.startsWith('---')) return text;
    const end = text.indexOf('\n---', 3);
    if (end === -1) return text;
    return text.slice(end + 4).replace(/^\s*\n/, '');
  }

  function renderMarkdown(text) {
    // Normalize CRLF/CR → LF first. IJH's docs/*.md are currently LF, but a
    // future docx→md import on Windows would use CRLF; several block regexes
    // end in `(.*)$`, which a trailing \r defeats (`.` won't eat \r, `$` won't
    // match before it) — that makes list markers fail to parse and the block
    // dispatch loop spin without advancing (an infinite "Loading…" hang).
    const norm = stripFrontmatter(text).replace(/\r\n?/g, '\n');
    return parseBlocks(norm.split('\n'));
  }

  window.renderMarkdown = renderMarkdown;
})();

// ============================================
// Reader page logic
// ============================================
(function () {
  'use strict';

  const params = new URLSearchParams(window.location.search);
  let path = params.get('path');

  // Also accept hash-form: reader.html#docs/...
  if (!path && window.location.hash) {
    path = decodeURIComponent(window.location.hash.replace(/^#/, ''));
  }

  // Default to Vol 6 index if no path
  if (!path) path = 'docs/volume-6-governance/index.md';

  window.__current_md_path = path;

  const info = window.PATH_TO_INFO[path];
  const body = document.getElementById('reader-body');
  const foot = document.getElementById('chapter-foot');
  const chList = document.getElementById('ch-list');
  const sidebarTitle = document.getElementById('sidebar-title');
  const railVol = document.getElementById('rail-vol');
  const railSource = document.getElementById('rail-source');
  const railProgress = document.getElementById('rail-progress');
  const progress = document.getElementById('progress');
  const topnavVols = document.getElementById('topnav-vols');

  if (!info) {
    body.innerHTML = '<div class="reader-error">Chapter not found in manifest: <code>' + path + '</code></div>';
    return;
  }

  // Update page title
  document.title = info.title + ' — IJH';

  // Mark current volume in top nav
  Array.from(topnavVols.children).forEach(a => {
    const href = a.getAttribute('href');
    if (href === info.volumeFile) a.classList.add('current');
  });

  // Sidebar: list this volume's chapters
  const volData = window.VOLUME_CHAPTERS[info.volume];
  sidebarTitle.textContent = volData.name;
  let listHTML = '';
  volData.chapters.forEach(ch => {
    const isCurrent = ch.path === path ? ' class="current"' : '';
    const href = 'reader.html#' + encodeURIComponent(ch.path);
    listHTML += '<li><a href="' + href + '"' + isCurrent + '>' + escapeHTML(ch.title) + '</a></li>';
  });
  chList.innerHTML = listHTML;

  // Right rail
  railVol.textContent = volData.name;
  railSource.textContent = path;

  // Fetch and render the markdown
  fetch(path)
    .then(r => {
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return r.text();
    })
    .then(text => {
      const renderedHTML = window.renderMarkdown(text);
      const chapterMeta = `<div class="chapter-meta">
        <span>${escapeHTML(volData.name)}</span>
        <span>·</span>
        <a href="${info.volumeFile}">Volume contents</a>
      </div>`;
      body.innerHTML = chapterMeta + renderedHTML;

      // Detect long chapters and apply visual treatment
      const h2s = body.querySelectorAll('h2');
      const h3s = body.querySelectorAll('h3');
      const isLong = h2s.length >= 4 || text.length > 30000;
      if (isLong) {
        body.classList.add('long-chapter');

        // Insert chapter banner with stats
        const wordCount = text.replace(/[\s\W_]+/g, ' ').trim().split(/\s+/).length;
        const readMin = Math.max(1, Math.round(wordCount / 220));
        const firstH1 = body.querySelector('h1');
        const banner = document.createElement('div');
        banner.className = 'chapter-banner';
        banner.innerHTML = `
          <div class="cb-item"><div class="cb-lbl">Sections</div><div class="cb-val accent">${h2s.length}</div></div>
          <div class="cb-item"><div class="cb-lbl">Subsections</div><div class="cb-val">${h3s.length}</div></div>
          <div class="cb-item"><div class="cb-lbl">Words</div><div class="cb-val">${wordCount.toLocaleString()}</div></div>
          <div class="cb-item"><div class="cb-lbl">Reading time</div><div class="cb-val">~${readMin} min</div></div>
        `;
        if (firstH1) firstH1.after(banner);
        else body.prepend(banner);
      }

      // Assign IDs to all headings for anchor linking
      const allHeadings = body.querySelectorAll('h2, h3');
      allHeadings.forEach((h, i) => {
        if (!h.id) {
          const slug = (h.textContent || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
          h.id = 'h-' + (slug || ('section-' + i));
        }
      });

      // Build chapter outline in right rail (replaces source-info block when long)
      const rail = document.querySelector('.right-rail');
      if (isLong && rail && allHeadings.length >= 4) {
        rail.innerHTML = `
          <div class="rail-block">
            <div class="rail-label">Reading</div>
            <div class="rail-value" id="rail-progress">0%</div>
          </div>
          <div class="rail-block">
            <div class="rail-label">In this chapter</div>
            <nav class="chapter-outline" id="chapter-outline"></nav>
          </div>
        `;
        const outline = document.getElementById('chapter-outline');
        allHeadings.forEach(h => {
          const link = document.createElement('a');
          link.href = '#' + h.id;
          link.textContent = h.textContent;
          if (h.tagName === 'H3') link.className = 'h3';
          link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.getElementById(h.id);
            if (target) {
              const top = target.getBoundingClientRect().top + window.scrollY - 70;
              window.scrollTo({ top, behavior: 'smooth' });
            }
          });
          outline.appendChild(link);
        });
        // Re-grab progress element after rail rewrite
        window.__railProgress = document.getElementById('rail-progress');

        // Intersection observer for active section tracking
        const linkMap = {};
        outline.querySelectorAll('a').forEach(a => {
          linkMap[a.getAttribute('href').slice(1)] = a;
        });
        let activeId = null;
        const setActive = (id) => {
          if (id === activeId) return;
          if (activeId && linkMap[activeId]) linkMap[activeId].classList.remove('active');
          if (id && linkMap[id]) linkMap[id].classList.add('active');
          activeId = id;
        };
        const updateActive = () => {
          const triggerY = window.innerHeight * 0.25 + window.scrollY;
          let candidate = null;
          allHeadings.forEach(h => {
            if (h.offsetTop <= triggerY) candidate = h.id;
          });
          if (candidate) setActive(candidate);
        };
        window.addEventListener('scroll', updateActive, { passive: true });
        updateActive();
      }

      // Footer prev/next
      const prevHTML = info.prev
        ? `<a href="reader.html?path=${encodeURIComponent(info.prev)}"><span class="ar-lbl">← Previous</span><span class="ar-name">${escapeHTML(window.PATH_TO_INFO[info.prev].title)}</span></a>`
        : `<a href="${info.volumeFile}"><span class="ar-lbl">← Back</span><span class="ar-name">${escapeHTML(volData.name)}</span></a>`;
      const nextHTML = info.next
        ? `<a class="next" href="reader.html?path=${encodeURIComponent(info.next)}"><span class="ar-lbl">Next →</span><span class="ar-name">${escapeHTML(window.PATH_TO_INFO[info.next].title)}</span></a>`
        : `<div></div>`;
      foot.innerHTML = prevHTML + nextHTML;

      // Scroll to top after render
      window.scrollTo(0, 0);
    })
    .catch(err => {
      body.innerHTML = '<div class="reader-error">' +
        'Failed to load <code>' + escapeHTML(path) + '</code><br/><br/>' +
        'Error: ' + escapeHTML(err.message) + '<br/><br/>' +
        '<em>Note: the reader requires the markdown files to be served over HTTP. ' +
        'If you opened this file directly via file:// the browser will block local fetches. ' +
        'Use the project preview, which serves files via HTTP.</em>' +
        '</div>';
    });

  function escapeHTML(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[c]));
  }

  // Reading progress bar
  function onScroll() {
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrolled = window.scrollY;
    const pct = docHeight > 0 ? scrolled / docHeight : 0;
    progress.style.width = (pct * 100) + '%';
    const rp = window.__railProgress || railProgress;
    if (rp) rp.textContent = Math.round(pct * 100) + '%';
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();

  // Reload when hash changes so sidebar/footer chapter links navigate cleanly
  window.addEventListener('hashchange', () => {
    window.location.reload();
  });

  // ── PDF popup modal ────────────────────────────────────────────────
  // Links rendered with class `pdf-popup` open the PDF in an overlay
  // iframe (the browser's native viewer). Close via ×, backdrop, or Esc.
  // Click handling is delegated, so it survives chapter re-renders.
  function pdfEnsureModal() {
    if (document.getElementById('pdf-popup-modal')) return;
    const modal = document.createElement('div');
    modal.id = 'pdf-popup-modal';
    modal.setAttribute('aria-hidden', 'true');
    modal.innerHTML =
      '<div class="pdf-popup-backdrop" title="Click to close"></div>' +
      '<div class="pdf-popup-window" role="dialog" aria-modal="true" aria-label="PDF document">' +
        '<div class="pdf-popup-bar">' +
          '<span class="pdf-popup-title"></span>' +
          '<span class="pdf-popup-hint">Click outside or press Esc to close</span>' +
          '<a class="pdf-popup-open" href="#" target="_blank" rel="noopener">Open in new tab ↗</a>' +
          '<button class="pdf-popup-close" aria-label="Close" type="button">×</button>' +
        '</div>' +
        '<iframe class="pdf-popup-frame" src="" title="PDF document"></iframe>' +
      '</div>';
    document.body.appendChild(modal);
    modal.querySelector('.pdf-popup-close').addEventListener('click', pdfCloseModal);
    modal.querySelector('.pdf-popup-backdrop').addEventListener('click', pdfCloseModal);
  }
  function pdfOpenModal(href, label) {
    pdfEnsureModal();
    const modal = document.getElementById('pdf-popup-modal');
    // Open at 100% zoom — browsers default to a too-small "fit width".
    const sep = href.includes('#') ? '&' : '#';
    modal.querySelector('.pdf-popup-frame').src = href + sep + 'zoom=100';
    modal.querySelector('.pdf-popup-open').href = href;
    modal.querySelector('.pdf-popup-title').textContent = label || '';
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }
  function pdfCloseModal() {
    const modal = document.getElementById('pdf-popup-modal');
    if (!modal) return;
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    modal.querySelector('.pdf-popup-frame').src = '';
    document.body.style.overflow = '';
  }
  document.addEventListener('click', (e) => {
    const link = e.target.closest && e.target.closest('a.pdf-popup');
    if (!link) return;
    e.preventDefault();
    pdfOpenModal(link.href, link.getAttribute('data-pdf-label') || '');
  });
  document.addEventListener('keydown', (e) => {
    const modal = document.getElementById('pdf-popup-modal');
    if (e.key === 'Escape' && modal && modal.classList.contains('is-open')) pdfCloseModal();
  });
})();
