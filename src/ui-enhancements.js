export function setupImageLoading() {
  const watched = new WeakMap();
  const frames = '.hero-image-wrap, .project-image, .project-cover, .project-secondary, .material-stage';
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
  const hero = document.querySelector('.hero-image-wrap');
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const touch = matchMedia('(hover: none), (pointer: coarse)');
  let compact = false, heroVisible = false, frame = 0, scrollTimer;
  function updatePage() {
    frame = 0;
    if (scrollY > 120) compact = true;
    else if (scrollY < 40) compact = false;
    shell.classList.toggle('is-compact', compact);
    if (motion.matches) hero.style.removeProperty('--hero-offset');
    else if (heroVisible) {
      const box = hero.getBoundingClientRect();
      const offset = Math.max(-90, Math.min(90, (innerHeight / 2 - box.top - box.height / 2) * .18));
      hero.style.setProperty('--hero-offset', `${offset.toFixed(2)}px`);
    }
  }
  const schedule = () => { if (!frame) frame = requestAnimationFrame(updatePage); };
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule); motion.addEventListener('change', schedule);
  new IntersectionObserver(entries => { heroVisible = entries[0].isIntersecting; schedule(); }).observe(hero);
  updatePage();
  const rail = document.querySelector('.project-grid');
  const cards = [...rail.children];
  const dots = document.querySelector('.project-rail-dots');
  function activate(index, { scroll = false, immediate = false } = {}) {
    clearTimeout(scrollTimer);
    if (immediate) rail.classList.add('is-setting-card');
    cards.forEach((card, item) => card.classList.toggle('is-active', item === index && card.matches('[data-project]')));
    if (immediate) { void rail.offsetWidth; rail.classList.remove('is-setting-card'); }
    if (scroll && cards[index]) {
      scrollTimer = setTimeout(() => {
        if (!document.querySelector('#project-dialog').open) cards[index].scrollIntoView({ behavior: motion.matches ? 'instant' : 'smooth', block: 'nearest', inline: 'start' });
      }, motion.matches || immediate ? 0 : 620);
    }
  }
  cards.forEach((card, index) => {
    card.addEventListener('pointerenter', event => {
      if (event.pointerType === 'mouse' && !document.querySelector('#project-dialog').open) activate(index);
    });
    card.addEventListener('focusin', () => { if (card.matches(':focus-visible')) activate(index, { scroll: true }); });
    const dot = document.createElement('button'); dot.type = 'button';
    dot.setAttribute('aria-label', card.matches('[data-project]') ? `Vis projekt ${index + 1}` : `Vis projektplads ${index + 1}, på vej`);
    dot.addEventListener('click', () => activate(index, { scroll: true })); dots.append(dot);
  });
  rail.addEventListener('pointerleave', event => {
    if (event.pointerType === 'mouse' && !document.querySelector('#project-dialog').open && !rail.querySelector(':focus-visible')) activate(-1);
  });
  function updateRail() {
    const left = rail.getBoundingClientRect().left;
    const current = cards.reduce((best, card, index) => Math.abs(card.getBoundingClientRect().left - left) < Math.abs(cards[best].getBoundingClientRect().left - left) ? index : best, 0);
    [...dots.children].forEach((dot, index) => dot.setAttribute('aria-current', String(index === current)));
    document.querySelector('.project-rail-counter').textContent = `${String(current + 1).padStart(2, '0')} / ${String(cards.length).padStart(2, '0')}`;
  }
  rail.addEventListener('scroll', updateRail, { passive: true }); updateRail();
  if (touch.matches) activate(0, { immediate: true });
  return { activate };
}
