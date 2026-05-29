// PDF popup modal — intercepts clicks on links with class `pdf-popup`,
// opens the linked PDF in an overlay iframe (uses the browser's native
// PDF viewer). Click backdrop, hit ×, or press Escape to close.
(function () {
  function ensureModal() {
    if (document.getElementById('pdf-popup-modal')) return;

    const modal = document.createElement('div');
    modal.id = 'pdf-popup-modal';
    modal.setAttribute('aria-hidden', 'true');
    modal.innerHTML = `
      <div class="pdf-popup-backdrop" title="Click to close"></div>
      <div class="pdf-popup-window" role="dialog" aria-modal="true" aria-label="PDF document">
        <div class="pdf-popup-bar">
          <span class="pdf-popup-title"></span>
          <span class="pdf-popup-hint">Click outside or press Esc to close</span>
          <a class="pdf-popup-open" href="#" target="_blank" rel="noopener">Open in new tab ↗</a>
          <button class="pdf-popup-close" aria-label="Close" type="button">×</button>
        </div>
        <iframe class="pdf-popup-frame" src="" title="PDF document"></iframe>
      </div>
    `;
    document.body.appendChild(modal);

    const closeBtn = modal.querySelector('.pdf-popup-close');
    const backdrop = modal.querySelector('.pdf-popup-backdrop');
    closeBtn.addEventListener('click', closeModal);
    backdrop.addEventListener('click', closeModal);
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('is-open')) closeModal();
    });
  }

  function openModal(href, label) {
    ensureModal();
    const modal = document.getElementById('pdf-popup-modal');
    // Force the browser's PDF viewer to open at 100% zoom via Adobe Open Parameters.
    // Default Chrome/Edge behavior is 67% ("Page Fit Width"), too small to read math.
    const sep = href.includes('#') ? '&' : '#';
    const framedHref = href + sep + 'zoom=100';
    modal.querySelector('.pdf-popup-frame').src = framedHref;
    modal.querySelector('.pdf-popup-open').href = href;
    modal.querySelector('.pdf-popup-title').textContent = label || '';
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    const modal = document.getElementById('pdf-popup-modal');
    if (!modal) return;
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    modal.querySelector('.pdf-popup-frame').src = '';
    document.body.style.overflow = '';
  }

  function bind() {
    document.querySelectorAll('a.pdf-popup').forEach((link) => {
      if (link.dataset.pdfPopupBound) return;
      link.dataset.pdfPopupBound = '1';
      link.addEventListener('click', (e) => {
        e.preventDefault();
        // Use the link's previous-sibling text as a label fallback if no title.
        const label = link.getAttribute('data-pdf-label')
          || (link.previousSibling && link.previousSibling.textContent
              ? link.previousSibling.textContent.trim() : '');
        openModal(link.href, label);
      });
    });
  }

  // Material for MkDocs uses instant-loading navigation, which re-runs JS
  // on each page change via a custom event. Bind on both DOM-ready and on
  // each subsequent page swap.
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bind);
  } else {
    bind();
  }
  document.addEventListener('navigation', bind);
  if (typeof document$ !== 'undefined' && document$.subscribe) {
    document$.subscribe(bind);
  }
})();
