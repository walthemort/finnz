export function setupImageLoading() {
  const watched = new WeakMap();
  const frames = '.hero-image-wrap, .project-image, .project-cover, .project-secondary, .material-stage, .contact-timber';
  function watch(img) {
    const source = img.getAttribute('src');
    const frame = img.closest(frames);
    if (!source || !frame || watched.get(img) === source) return;
    watched.set(img, source); frame.classList.add('image-frame');
    img.classList.add('is-image-pending'); img.classList.remove('is-image-failed');
    const finish = () => {
      if (watched.get(img) !== source) return;
      img.classList.remove('is-image-pending');
      const failed = !img.naturalWidth;
      img.classList.toggle('is-image-failed', failed);
      frame.classList.toggle('is-image-loading', Boolean(frame.querySelector('.is-image-pending')));
      frame.classList.toggle('has-image-error', Boolean(frame.querySelector('.is-image-failed')));
      if (failed && !frame.querySelector('.image-error')) {
        const message = document.createElement('span'); message.className = 'image-error'; message.textContent = 'Billedet kunne ikke indlæses.'; frame.append(message);
      } else if (!frame.querySelector('.is-image-failed')) frame.querySelector('.image-error')?.remove();
    };
    frame.classList.add('is-image-loading');
    if (img.complete) finish();
    else { img.addEventListener('load', finish, { once: true }); img.addEventListener('error', finish, { once: true }); }
  }
  document.querySelectorAll('img').forEach(watch);
  new MutationObserver(records => {
    for (const record of records) {
      if (record.type === 'attributes') watch(record.target);
      for (const node of record.addedNodes) if (node.nodeType === 1) { if (node.matches('img')) watch(node); node.querySelectorAll('img').forEach(watch); }
    }
  }).observe(document.querySelector('#app'), { subtree: true, childList: true, attributes: true, attributeFilter: ['src'] });
}
export function setupPageNavigation() {
  const shell = document.querySelector('.header-shell');
  let compact = false;
  const updateHeader = () => {
    if (scrollY > 120) compact = true;
    else if (scrollY < 40) compact = false;
    shell.classList.toggle('is-compact', compact);
  };
  window.addEventListener('scroll', updateHeader, { passive: true }); updateHeader();
  const rail = document.querySelector('.project-grid');
  const cards = [...rail.children];
  const dots = document.querySelector('.project-rail-dots');
  cards.forEach((card, index) => {
    const dot = document.createElement('button'); dot.type = 'button';
    dot.setAttribute('aria-label', index === cards.length - 1 ? 'Vis invitation til dit projekt' : `Vis projekt ${index + 1}`);
    dot.addEventListener('click', () => rail.scrollTo({ left: card.offsetLeft - cards[0].offsetLeft, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' }));
    dots.append(dot);
  });
  function updateRail() {
    const left = rail.getBoundingClientRect().left;
    const current = cards.reduce((best, card, index) => Math.abs(card.getBoundingClientRect().left - left) < Math.abs(cards[best].getBoundingClientRect().left - left) ? index : best, 0);
    [...dots.children].forEach((dot, index) => { dot.setAttribute('aria-current', index === current ? 'true' : 'false'); });
    document.querySelector('.project-rail-counter').textContent = `${String(current + 1).padStart(2, '0')} / ${String(cards.length).padStart(2, '0')}`;
  }
  rail.addEventListener('scroll', updateRail, { passive: true }); updateRail();
}
export function setupGallerySwipe(cover, onSwipe) {
  let start = null;
  cover.querySelector('img').draggable = false;
  cover.addEventListener('pointerdown', event => {
    if (event.pointerType === 'mouse' || !event.isPrimary || event.target.closest('button')) return;
    start = { id: event.pointerId, x: event.clientX, y: event.clientY, time: performance.now() };
    cover.setPointerCapture(event.pointerId);
  });
  cover.addEventListener('pointerup', event => {
    if (!start || start.id !== event.pointerId) return;
    const dx = event.clientX - start.x, dy = event.clientY - start.y;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.3 && performance.now() - start.time < 900) onSwipe(dx < 0 ? 1 : -1);
    start = null;
  });
  cover.addEventListener('pointercancel', () => { start = null; });
  cover.addEventListener('lostpointercapture', () => { start = null; });
}
