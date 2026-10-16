export const materials = [
  { id: 'fyr', name: 'Fyr', image: '/images/materials/enclosure-pine.webp', color: '#d7c4a0', description: 'Et lyst og naturligt udtryk med synlige knaster. Vi aftaler træets kvalitet og behandling til din løsning.' },
  { id: 'laerk', name: 'Lærk', image: '/images/materials/enclosure-larch.webp', color: '#bb9366', description: 'Varme, gyldne nuancer og tydelig struktur. Et eksempel på, hvordan afskærmningen kan få mere glød.' },
  { id: 'thermotrae', name: 'Thermotræ', image: '/images/materials/enclosure-thermo.webp', color: '#79563d', description: 'Et dybere, brunt udtryk fra varmebehandlet træ. Den konkrete træsort og vedligeholdelse finder vi sammen.' },
];
export const finishes = ['Afklares sammen', 'Ubehandlet', 'Olieret', 'Træbeskyttelse'];

export function materialSelectorMarkup(arrow) {
  return `<section class="materials reveal" id="materialer" aria-labelledby="materials-title">
    <div class="materials-heading"><p class="eyebrow">MATERIALEINSPIRATION</p><h2 id="materials-title">Find dit <em>udtryk.</em></h2></div>
    <div class="material-layout">
      <figure class="material-preview"><img id="material-image" src="${materials[0].image}" alt="Materialeinspiration: træafskærmning omkring affaldsbeholdere i lyst træ" width="1024" height="1024" loading="lazy"><figcaption id="material-caption">Lyst træ · visualiseret eksempel</figcaption></figure>
      <div class="material-controls">
        <fieldset class="wood-options"><legend>Hvilken træsort taler til dig?</legend><div class="wood-swatches">${materials.map(material => `<label class="wood-option"><input type="radio" name="wood" value="${material.id}"><span class="wood-swatch" style="--wood-color:${material.color}" aria-hidden="true"></span><span>${material.name}</span></label>`).join('')}</div></fieldset>
        <p class="material-description" aria-live="polite">Prøv forskellige træudtryk til en afskærmning i haven.</p>
        <label class="finish-label" for="material-finish">Overfladeønske<select id="material-finish">${finishes.map(finish => `<option>${finish}</option>`).join('')}</select></label>
        <div class="material-actions"><button class="text-link material-apply" type="button" aria-haspopup="dialog">Tal med os om dit valg ${arrow}</button><button class="material-reset" type="button">Jeg vælger senere</button></div>
        <p class="material-note">AI-visualiseringer baseret på et projektfoto. Træsort, farve og behandling er vejledende og aftales til din udendørs løsning. Overfladeønsket ændrer ikke billedet.</p>
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
      preview.alt = `Materialeinspiration: træafskærmning omkring affaldsbeholdere, visualiseret i ${selected.name.toLowerCase()}`;
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
    preview.alt = 'Materialeinspiration: træafskærmning omkring affaldsbeholdere i lyst træ';
    caption.textContent = 'Lyst træ · visualiseret eksempel';
    description.textContent = 'Du behøver ikke vælge nu. Vi finder materialet sammen.';
    update();
  });
  section.querySelector('.material-apply').addEventListener('click', () => onContact());
  update();
}
