const EASING = 'cubic-bezier(.22,.7,.2,1)';
const reducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
const bounds = element => element.getBoundingClientRect();
const geometry = rect => ({ left: `${rect.left}px`, top: `${rect.top}px`, width: `${rect.width}px`, height: `${rect.height}px` });
const clip = rect => `inset(${Math.max(0, rect.top)}px ${Math.max(0, innerWidth - rect.right)}px ${Math.max(0, innerHeight - rect.bottom)}px ${Math.max(0, rect.left)}px)`;

// Animate one cropped photograph and the paper around it; object-fit preserves its proportions.
export function createProjectMotion({ dialog, getCard }) {
  let active = null;
  function makeImage(source, rect, objectPosition = '50% 50%') {
    const image = document.createElement('img');
    image.className = 'project-transition-image';
    image.alt = '';
    image.setAttribute('aria-hidden', 'true');
    image.src = source;
    Object.assign(image.style, geometry(rect), { objectPosition });
    dialog.append(image);
    return image;
  }
  function clean(run) {
    if (active !== run) return;
    active = null;
    run.animations.forEach(animation => animation.cancel());
    run.images.forEach(image => image.remove());
    dialog.style.removeProperty('clip-path');
    dialog.classList.remove('is-project-transitioning');
  }
  function finish(run) {
    if (active !== run) return;
    const closing = run.direction === 'close';
    clean(run);
    if (closing && dialog.open) {
      dialog.close();
      const card = getCard();
      card?.focus({ preventScroll: true });
      card?.scrollIntoView({ behavior: 'instant', block: 'nearest', inline: 'center' });
    }
  }
  function watch(run) {
    const version = ++run.version;
    Promise.allSettled(run.animations.map(animation => animation.finished)).then(() => {
      if (active === run && version === run.version) finish(run);
    });
  }
  function animate(run, element, keyframes, options = {}) {
    run.animations.push(element.animate(keyframes, { duration: 620, easing: EASING, fill: 'both', ...options }));
  }
  function canAnimate() {
    return !reducedMotion() && typeof dialog.animate === 'function';
  }
  function close({ immediate = false } = {}) {
    if (!dialog.open) return;
    if (immediate || !canAnimate()) {
      if (active) clean(active);
      dialog.close();
      return;
    }
    if (active?.direction === 'close') return;
    // Escape or a close click during opening reverses the motion from its current position.
    if (active?.direction === 'open') {
      active.direction = 'close';
      active.animations.forEach(animation => animation.reverse());
      watch(active);
      return;
    }
    const card = getCard();
    const cardImage = card?.querySelector('.project-image img');
    if (!cardImage) return dialog.close();
    // Reveal the return card in the mobile rail, while the modal still covers the page.
    card.scrollIntoView({ behavior: 'instant', block: 'nearest', inline: 'center' });
    const target = bounds(card.querySelector('.project-image'));
    const candidates = [...dialog.querySelectorAll('.dialog-image, .project-secondary img')];
    const visibleArea = image => {
      const r = bounds(image);
      return Math.max(0, Math.min(r.right, innerWidth) - Math.max(r.left, 0)) * Math.max(0, Math.min(r.bottom, innerHeight) - Math.max(r.top, 0));
    };
    const visible = candidates.sort((a, b) => visibleArea(b) - visibleArea(a))[0];
    const hasVisiblePhoto = visible && visibleArea(visible) > 0;
    const from = hasVisiblePhoto ? bounds(visible) : { left: 0, top: 0, width: innerWidth, height: innerHeight };
    const source = hasVisiblePhoto ? visible.currentSrc || visible.src : cardImage.currentSrc || cardImage.src;
    const picture = makeImage(source, from, hasVisiblePhoto ? getComputedStyle(visible).objectPosition : '50% 50%');
    const run = { direction: 'close', animations: [], images: [picture], version: 0 };
    active = run;
    dialog.classList.add('is-project-transitioning');
    animate(run, dialog, [{ clipPath: 'inset(0px)' }, { clipPath: clip(target) }]);
    animate(run, picture, [geometry(from), { ...geometry(target), objectPosition: getComputedStyle(cardImage).objectPosition }]);
    if (!hasVisiblePhoto) animate(run, picture, [{ opacity: 0 }, { opacity: 1 }], { duration: 170 });
    // If a visitor changed the photo, blend back to the matching thumbnail as it closes.
    if (source !== (cardImage.currentSrc || cardImage.src)) {
      const returning = makeImage(cardImage.currentSrc || cardImage.src, from);
      run.images.push(returning);
      animate(run, returning, [geometry(from), geometry(target)]);
      animate(run, returning, [{ opacity: 0 }, { opacity: 1 }], { delay: 250, duration: 370 });
    }
    for (const content of dialog.querySelectorAll(':scope > .project-header, :scope > .project-page')) {
      animate(run, content, [{ opacity: 1 }, { opacity: 0 }], { duration: 200 });
    }
    watch(run);
  }
  function open(card, reveal) {
    if (dialog.open) return;
    const source = card.querySelector('.project-image');
    const sourceImage = source.querySelector('img');
    const from = bounds(source);
    const shouldAnimate = canAnimate() && from.width > 0 && from.height > 0;
    if (shouldAnimate) {
      dialog.classList.add('is-project-transitioning');
      dialog.style.clipPath = clip(from);
    }
    reveal();
    if (!shouldAnimate) return;
    const target = bounds(dialog.querySelector('.dialog-image'));
    const picture = makeImage(sourceImage.currentSrc || sourceImage.src, from, getComputedStyle(sourceImage).objectPosition);
    const run = { direction: 'open', animations: [], images: [picture], version: 0 };
    active = run;
    animate(run, dialog, [{ clipPath: clip(from) }, { clipPath: 'inset(0px)' }]);
    animate(run, picture, [geometry(from), { ...geometry(target), objectPosition: '50% 50%' }]);
    animate(run, dialog.querySelector('.project-header'), [{ opacity: 0, transform: 'translateY(-8px)' }, { opacity: 1, transform: 'none' }], { delay: 340, duration: 280 });
    animate(run, dialog.querySelector('.project-page'), [{ opacity: 0, transform: 'translateY(12px)' }, { opacity: 1, transform: 'none' }], { delay: 380, duration: 280 });
    watch(run);
  }
  // Native close, material navigation or a runtime motion-preference change must not leak layers.
  dialog.addEventListener('close', () => { if (active) clean(active); });
  matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', () => {
    if (active && reducedMotion()) finish(active);
  });
  return { open, close };
}
