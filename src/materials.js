export const materials = [
  { id: 'lys', name: 'Lys', image: '/images/materials/enclosure-pine.webp', color: '#d7c4a0', description: 'Lyse trætoner og synlig struktur. Et naturligt udtryk, der spiller sammen med havens grønne farver.' },
  { id: 'sort', name: 'Sort', image: '/images/materials/enclosure-black.webp', color: '#282b27', description: 'Et mørkt, roligt udtryk, der fremhæver træets linjer og skaber kontrast til det grønne.' },
];
export function materialSelectorMarkup(arrow) {
  return `<section class="materials reveal" id="materialer" aria-labelledby="materials-title">
    <div class="materials-heading"><p class="eyebrow">FARVEINSPIRATION</p><h2 id="materials-title">Find dit <em>udtryk.</em></h2></div>
    <div class="material-layout">
      <figure class="material-preview" style="--split:100%"><div class="material-stage" style="--split:100%">
        <img id="material-image" src="${materials[0].image}" alt="Afskærmning omkring affaldsbeholdere i lyst træ" width="1254" height="1254" loading="lazy">
        <img id="material-dark-image" src="${materials[1].image}" alt="Samme afskærmning i sort træ" width="1254" height="1254" loading="lazy" aria-hidden="true">
        <div class="comparison-line" aria-hidden="true"><span>↔</span></div>
        <input class="comparison-range" type="range" min="0" max="100" value="100" aria-label="Træk for at sammenligne lyst og sort træ" aria-describedby="comparison-help" aria-valuetext="100 procent lyst træ, 0 procent sort træ. Valgt: Lys."><div class="comparison-drag-surface" aria-hidden="true"></div>
      </div><span class="comparison-note" aria-hidden="true"><span>træk for at<br>sammenligne</span><svg class="annotation-arrow-desktop" viewBox="0 0 100 80" fill="none"><path d="M83 5C103 33 74 73 8 63M8 63 23 58M8 63 20 73" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg><svg class="annotation-arrow-mobile" viewBox="0 0 100 200" preserveAspectRatio="none" fill="none"><path d="M58 8C103 28 78 133 99 194M99 194 87 181M99 194 99 177" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/></svg></span><figcaption id="material-caption">Lys · visualiseret eksempel</figcaption></figure>
      <div class="material-controls">
        <fieldset class="wood-options"><legend>Lys eller sort?</legend><div class="wood-swatches">${materials.map(material => `<label class="wood-option"><input type="radio" name="wood" value="${material.id}"><span class="wood-swatch" style="--wood-color:${material.color}" aria-hidden="true"></span><span>${material.name}</span></label>`).join('')}</div></fieldset>
        <p class="material-description" aria-live="polite">${materials[0].description}</p>
        <p id="comparison-help" class="compare-hint">Træk i billedet, eller vælg en farve. Den farve, der fylder mest, bliver dit valg.</p>
        <div class="material-actions"><button class="text-link material-apply" type="button" aria-haspopup="dialog"><span>Tal med os om dit valg – eller hvis du ønsker en anden farve</span> ${arrow}</button></div>
        <p class="material-note">Vejledende AI-visualiseringer baseret på et projektfoto. Træsort og behandling aftaler vi sammen.</p>
      </div>
    </div>
  </section>`;
}
export function setupMaterialSelector(onChange, onContact) {
  const section = document.querySelector('#materialer');
  const preview = section.querySelector('.material-preview');
  const stage = section.querySelector('.material-stage');
  const caption = section.querySelector('#material-caption');
  const description = section.querySelector('.material-description');
  const range = section.querySelector('.comparison-range');
  const dragSurface = section.querySelector('.comparison-drag-surface');
  let selected = materials[0];
  function render({ notify = true } = {}) {
    const position = Number(range.value);
    preview.style.setProperty('--split', `${position}%`); stage.style.setProperty('--split', `${position}%`);
    preview.classList.toggle('is-dark-leading', position < 50 || (position === 50 && selected?.id === 'sort'));
    preview.classList.toggle('is-between', position > 0 && position < 100);
    section.querySelector('#material-image').setAttribute('aria-hidden', String(position === 0));
    section.querySelector('#material-dark-image').setAttribute('aria-hidden', String(position === 100));
    section.querySelectorAll('[name=wood]').forEach(input => { input.checked = input.value === selected?.id; });
    range.setAttribute('aria-valuetext', `${position} procent lyst træ, ${100 - position} procent sort træ. Valgt: ${selected?.name || 'afklares sammen'}.`);
    caption.textContent = `${selected?.name || 'Lyst træ'} · visualiseret eksempel`;
    description.textContent = selected?.description || 'Du behøver ikke vælge nu. Vi finder farven sammen.';
    if (notify) onChange({ material: selected?.name || 'Afklares sammen', finish: 'Afklares sammen' });
  }
  function select(name) {
    selected = materials.find(material => material.name === name) || null;
    stage.classList.add('is-settling');
    range.value = selected?.id === 'sort' ? '0' : '100'; render();
  }
  range.addEventListener('input', () => {
    stage.classList.remove('is-settling');
    const position = Number(range.value);
    const next = position > 50 ? materials[0] : position < 50 ? materials[1] : selected || materials[0];
    const changed = selected !== next; selected = next; render({ notify: changed });
  });
  let gesture = null;
  function setFromPointer(x) {
    const box = stage.getBoundingClientRect();
    range.value = String(Math.round(Math.max(0, Math.min(1, (x - box.left) / box.width)) * 100));
    range.dispatchEvent(new Event('input', { bubbles: true }));
  }
  const endDrag = () => { gesture = null; preview.classList.remove('is-dragging'); };
  dragSurface.addEventListener('pointerdown', event => {
    if (!event.isPrimary || event.button !== 0) return;
    // Native range track clicks happen on touch-down, before scrolling can be identified.
    // Handle pointers here so a vertical page scroll never changes a customer's color.
    event.preventDefault(); range.focus({ preventScroll: true });
    gesture = { id: event.pointerId, x: event.clientX, y: event.clientY, position: range.value, selected, dragging: false };
    dragSurface.setPointerCapture(event.pointerId);
    preview.classList.add('is-dragging');
  });
  dragSurface.addEventListener('pointermove', event => {
    if (!gesture || event.pointerId !== gesture.id) return;
    const dx = event.clientX - gesture.x, dy = event.clientY - gesture.y;
    if (!gesture.dragging && Math.abs(dx) > 4 && Math.abs(dx) > Math.abs(dy) * 1.2) gesture.dragging = true;
    if (gesture.dragging) setFromPointer(event.clientX);
  });
  dragSurface.addEventListener('pointerup', event => {
    if (!gesture || event.pointerId !== gesture.id) return;
    if (gesture.dragging || (Math.abs(event.clientX - gesture.x) < 5 && Math.abs(event.clientY - gesture.y) < 5)) setFromPointer(event.clientX);
    endDrag();
  });
  dragSurface.addEventListener('pointercancel', () => {
    if (gesture?.dragging) { range.value = gesture.position; selected = gesture.selected; stage.classList.remove('is-settling'); render(); }
    endDrag();
  });
  dragSurface.addEventListener('lostpointercapture', endDrag); range.addEventListener('blur', endDrag);
  section.querySelectorAll('[name=wood]').forEach(input => {
    const pick = () => {
      const material = materials.find(material => material.id === input.value);
      const endpoint = material.id === 'sort' ? '0' : '100';
      if (selected !== material || range.value !== endpoint) select(material.name);
    };
    input.addEventListener('change', pick); input.addEventListener('click', pick);
  });
  section.querySelector('.material-apply').addEventListener('click', onContact);
  render();
  return { select, reset: () => select(null) };
}
