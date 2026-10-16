export const materials = [
  { id: 'lys', name: 'Lys', image: '/images/materials/enclosure-pine.webp', color: '#d7c4a0', description: 'Lyse trætoner og synlig struktur. Et naturligt udtryk, der spiller sammen med havens grønne farver.' },
  { id: 'sort', name: 'Sort', image: '/images/materials/enclosure-black.webp', color: '#282b27', description: 'Et mørkt, roligt udtryk, der fremhæver træets linjer og skaber kontrast til det grønne.' },
];

export function materialSelectorMarkup(arrow) {
  return `<section class="materials reveal" id="materialer" aria-labelledby="materials-title">
    <div class="materials-heading"><p class="eyebrow">FARVEINSPIRATION</p><h2 id="materials-title">Find dit <em>udtryk.</em></h2></div>
    <div class="material-layout">
      <figure class="material-preview"><img id="material-image" src="${materials[0].image}" alt="Materialeinspiration: træafskærmning omkring affaldsbeholdere i lyst træ" width="1024" height="1024" loading="lazy"><figcaption id="material-caption">Lyst træ · visualiseret eksempel</figcaption></figure>
      <div class="material-controls">
        <fieldset class="wood-options"><legend>Lys eller sort?</legend><div class="wood-swatches">${materials.map(material => `<label class="wood-option"><input type="radio" name="wood" value="${material.id}"><span class="wood-swatch" style="--wood-color:${material.color}" aria-hidden="true"></span><span>${material.name}</span></label>`).join('')}</div></fieldset>
        <p class="material-description" aria-live="polite">Se afskærmningen i lyst træ eller sort.</p>
        <div class="material-actions"><button class="text-link material-apply" type="button" aria-haspopup="dialog">Tal med os om dit valg ${arrow}</button><button class="material-reset" type="button">Jeg vælger senere</button></div>
        <p class="material-note">Vejledende AI-visualiseringer baseret på et projektfoto. Træsort og behandling aftaler vi sammen.</p>
      </div>
    </div>
  </section>`;
}

export function setupMaterialSelector(onChange, onContact) {
  const section = document.querySelector('#materialer');
  const preview = section.querySelector('#material-image');
  const caption = section.querySelector('#material-caption');
  const description = section.querySelector('.material-description');
  let selected = null;
  function update() {
    onChange({ material: selected?.name || 'Afklares sammen', finish: 'Afklares sammen' });
  }
  section.querySelectorAll('[name="wood"]').forEach(input => {
    input.addEventListener('change', () => {
      selected = materials.find(material => material.id === input.value);
      preview.src = selected.image;
      preview.alt = `Farveinspiration: træafskærmning omkring affaldsbeholdere, ${selected.name === 'Lys' ? 'lyst træ' : 'sort træ'}`;
      caption.textContent = `${selected.name} · visualiseret eksempel`;
      description.textContent = selected.description;
      update();
    });
  });
  preview.addEventListener('error', () => {
    caption.textContent = 'Billedet kunne ikke indlæses. Dit materialeønske er stadig valgt.';
  });
  section.querySelector('.material-reset').addEventListener('click', () => {
    selected = null;
    section.querySelectorAll('[name="wood"]').forEach(input => { input.checked = false; });
    preview.src = materials[0].image;
    preview.alt = 'Materialeinspiration: træafskærmning omkring affaldsbeholdere i lyst træ';
    caption.textContent = 'Lyst træ · visualiseret eksempel';
    description.textContent = 'Du behøver ikke vælge nu. Vi finder materialet sammen.';
    update();
  });
  section.querySelector('.material-apply').addEventListener('click', () => onContact());
  update();
}
