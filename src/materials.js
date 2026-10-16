export const materials = [
  { id: 'eg', name: 'Eg', image: '/images/table-room.webp', color: '#b99667', description: 'Varmt, naturligt og med tydelig struktur. Et roligt udgangspunkt med masser af karakter.' },
  { id: 'valnoed', name: 'Valnød', image: '/images/material-walnut.webp', color: '#68492f', description: 'Dybe, brune nuancer og et varmt udtryk. Til dig, der gerne vil give træet lidt mere tyngde i rummet.' },
  { id: 'ask', name: 'Ask', image: '/images/material-ash.webp', color: '#d7c5a2', description: 'Lyse nuancer og levende årer. Et let udtryk, der giver plads til lys og luft.' },
];
export const finishes = ['Afklares sammen', 'Mat olieret', 'Lakeret'];

export function materialSelectorMarkup(arrow) {
  return `<section class="materials reveal" id="materialer" aria-labelledby="materials-title">
    <div class="materials-heading"><p class="eyebrow">MATERIALEINSPIRATION</p><h2 id="materials-title">Find dit <em>udtryk.</em></h2></div>
    <div class="material-layout">
      <figure class="material-preview"><img id="material-image" src="/images/table-room.webp" alt="Materialeinspiration: et bord i lys eg" width="1536" height="1024" loading="lazy"><figcaption id="material-caption">Eksempel i eg</figcaption></figure>
      <div class="material-controls">
        <fieldset class="wood-options"><legend>Hvilken træsort taler til dig?</legend><div class="wood-swatches">${materials.map(material => `<label class="wood-option"><input type="radio" name="wood" value="${material.id}"><span class="wood-swatch" style="--wood-color:${material.color}" aria-hidden="true"></span><span>${material.name}</span></label>`).join('')}</div></fieldset>
        <p class="material-description" aria-live="polite">Prøv en træsort, og se, hvordan udtrykket ændrer sig.</p>
        <label class="finish-label" for="material-finish">Overfladeønske<select id="material-finish">${finishes.map(finish => `<option>${finish}</option>`).join('')}</select></label>
        <div class="material-actions"><button class="text-link material-apply" type="button" aria-haspopup="dialog">Tal med os om dit valg ${arrow}</button><button class="material-reset" type="button">Jeg vælger senere</button></div>
        <p class="material-note">Vejledende visualiseringer. Træsort, farve og overflade aftales individuelt.</p>
      </div>
    </div>
  </section>`;
}

export function setupMaterialSelector(onChange, onContact) {
  const section = document.querySelector('#materialer');
  const preview = section.querySelector('#material-image');
  const caption = section.querySelector('#material-caption');
  const description = section.querySelector('.material-description');
  const finish = section.querySelector('#material-finish');
  let selected = null;
  function update() {
    onChange({ material: selected?.name || 'Afklares sammen', finish: finish.value });
  }
  section.querySelectorAll('[name="wood"]').forEach(input => {
    input.addEventListener('change', () => {
      selected = materials.find(material => material.id === input.value);
      preview.src = selected.image;
      preview.alt = `Materialeinspiration: et bord i ${selected.name.toLowerCase()}`;
      caption.textContent = `${selected.name} · materialeinspiration`;
      description.textContent = selected.description;
      update();
    });
  });
  preview.addEventListener('error', () => {
    caption.textContent = 'Billedet kunne ikke indlæses. Dit materialeønske er stadig valgt.';
  });
  finish.addEventListener('change', update);
  section.querySelector('.material-reset').addEventListener('click', () => {
    selected = null;
    section.querySelectorAll('[name="wood"]').forEach(input => { input.checked = false; });
    finish.value = finishes[0];
    preview.src = materials[0].image;
    preview.alt = 'Materialeinspiration: et bord i lys eg';
    caption.textContent = 'Eksempel i eg';
    description.textContent = 'Du behøver ikke vælge nu. Vi finder materialet sammen.';
    update();
  });
  section.querySelector('.material-apply').addEventListener('click', () => onContact());
  update();
}
