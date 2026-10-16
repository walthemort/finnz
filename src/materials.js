export const materials = [
  { id: 'lys', name: 'Lys', image: '/images/materials/enclosure-pine.webp', color: '#d7c4a0', description: 'Lyse trætoner og synlig struktur. Et naturligt udtryk, der spiller sammen med havens grønne farver.' },
  { id: 'sort', name: 'Sort', image: '/images/materials/enclosure-black.webp', color: '#282b27', description: 'Et mørkt, roligt udtryk, der fremhæver træets linjer og skaber kontrast til det grønne.' },
];
export function materialSelectorMarkup(arrow) {
  return `<section class="materials reveal" id="materialer" aria-labelledby="materials-title">
    <div class="materials-heading"><p class="eyebrow">FARVEINSPIRATION</p><h2 id="materials-title">Find dit <em>udtryk.</em></h2></div>
    <div class="material-layout">
      <figure class="material-preview"><div class="material-stage" data-color="lys">
        <img id="material-image" src="${materials[0].image}" alt="Afskærmning omkring affaldsbeholdere i lyst træ" width="1254" height="1254" loading="lazy">
        <img id="material-dark-image" src="${materials[1].image}" alt="Samme afskærmning i sort træ" width="1254" height="1254" loading="lazy">
        <div class="comparison-line" aria-hidden="true" hidden><span>↔</span></div>
        <input class="comparison-range" type="range" min="0" max="100" value="50" aria-label="Sammenlign lyst og sort træ" aria-valuetext="50 procent lyst træ, 50 procent sort træ" hidden>
      </div><figcaption id="material-caption">Lyst træ · visualiseret eksempel</figcaption></figure>
      <div class="material-controls">
        <fieldset class="wood-options"><legend>Lys eller sort?</legend><div class="wood-swatches">${materials.map(material => `<label class="wood-option"><input type="radio" name="wood" value="${material.id}"><span class="wood-swatch" style="--wood-color:${material.color}" aria-hidden="true"></span><span>${material.name}</span></label>`).join('')}</div></fieldset>
        <p class="material-description" aria-live="polite">Se afskærmningen i lyst træ eller sort.</p>
        <label class="compare-toggle"><input id="compare-colors" type="checkbox"> Sammenlign lys og sort</label><p class="compare-hint" hidden>Træk skillelinjen i billedet. Du kan også bruge piletasterne.</p>
        <div class="material-actions"><button class="text-link material-apply" type="button" aria-haspopup="dialog">Tal med os om dit valg ${arrow}</button><button class="material-reset" type="button">Jeg vælger senere</button></div>
        <p class="material-note">Vejledende AI-visualiseringer baseret på et projektfoto. Træsort og behandling aftaler vi sammen.</p>
      </div>
    </div>
  </section>`;
}
export function setupMaterialSelector(onChange, onContact) {
  const section = document.querySelector('#materialer');
  const stage = section.querySelector('.material-stage');
  const caption = section.querySelector('#material-caption');
  const description = section.querySelector('.material-description');
  const toggle = section.querySelector('#compare-colors');
  const range = section.querySelector('.comparison-range');
  const line = section.querySelector('.comparison-line');
  let selected = null;
  function compare() {
    stage.classList.toggle('is-comparing', toggle.checked);
    section.querySelector('#material-image').setAttribute('aria-hidden', String(!toggle.checked && selected?.id === 'sort'));
    section.querySelector('#material-dark-image').setAttribute('aria-hidden', String(!toggle.checked && selected?.id !== 'sort'));
    range.hidden = line.hidden = section.querySelector('.compare-hint').hidden = !toggle.checked;
    stage.style.setProperty('--split', `${range.value}%`);
    range.setAttribute('aria-valuetext', `${range.value} procent lyst træ, ${100 - Number(range.value)} procent sort træ`);
    caption.textContent = toggle.checked ? 'Lys / Sort · træk for at sammenligne' : selected ? `${selected.name} · visualiseret eksempel` : 'Lyst træ · visualiseret eksempel';
  }
  function select(name) {
    selected = materials.find(material => material.name === name) || null;
    section.querySelectorAll('[name=wood]').forEach(input => { input.checked = input.value === selected?.id; });
    stage.dataset.color = selected?.id || 'lys';
    toggle.checked = false; compare();
    description.textContent = selected?.description || 'Du behøver ikke vælge nu. Vi finder farven sammen.';
    onChange({ material: selected?.name || 'Afklares sammen', finish: 'Afklares sammen' });
  }
  section.querySelectorAll('[name=wood]').forEach(input => input.addEventListener('change', () => select(materials.find(material => material.id === input.value)?.name)));
  toggle.addEventListener('change', compare); range.addEventListener('input', compare);
  section.querySelector('.material-reset').addEventListener('click', () => select(null));
  section.querySelector('.material-apply').addEventListener('click', onContact);
  compare();
  onChange({ material: 'Afklares sammen', finish: 'Afklares sammen' });
  return { select, reset: () => select(null) };
}
