import '@fontsource/manrope/latin-400.css';
import '@fontsource/manrope/latin-500.css';
import '@fontsource/manrope/latin-600.css';
import '@fontsource/manrope/latin-700.css';
import '@fontsource/manrope/latin-800.css';
import '@fontsource/cormorant-garamond/latin-400-italic.css';
import './style.css';

const arrow = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 19 19 5M5 5h14v14" stroke="currentColor" stroke-width="1.4"/></svg>';
const brand = `<img class="brand-logo" src="/brand/logo-black.svg" alt="Finnz" width="924.8" height="329.72">`;
const contactEmail = import.meta.env.VITE_CONTACT_EMAIL || '';
const contactPhone = import.meta.env.VITE_CONTACT_PHONE || '+45 41 35 20 25';

document.querySelector('#app').innerHTML = `
<header class="header" id="top">
  <a class="brand" href="#top" aria-label="Finnz Træ & Design, til toppen">${brand}</a>
  <nav class="desktop-nav" aria-label="Hovednavigation">
    <a href="#muligheder">Det vi skaber</a><a href="#tilgang">Vores tilgang</a>
  </nav>
  <a class="header-contact" href="#kontakt">Lad os tale sammen ${arrow}</a>
  <button class="menu-toggle" aria-label="Åbn menu" aria-expanded="false" aria-controls="mobile-nav"><span></span><span></span></button>
  <nav class="mobile-nav" id="mobile-nav" aria-label="Mobilnavigation" hidden><a href="#muligheder">Det vi skaber</a><a href="#tilgang">Vores tilgang</a><a href="#kontakt">Lad os tale sammen ${arrow}</a></nav>
</header>
<main id="indhold">
  <section class="hero section-pad" aria-labelledby="hero-title">
    <div class="hero-top"><p class="eyebrow intro-reveal"><span class="status-dot"></span> HÅNDVÆRK. MATERIALER. OMTANKE.</p><span class="small-note intro-reveal">FINNZ TRÆ & DESIGN</span></div>
    <h1 id="hero-title"><span class="title-line"><span>Træ med karakter.</span></span><span class="title-line"><span>Design med <em>omtanke.</em></span></span></h1>
    <div class="hero-bottom intro-reveal"><a class="text-link" href="#muligheder">Gå på opdagelse <span class="circle-arrow">↓</span></a><p>Gennemtænkte løsninger i træ.<br>Skabt til dit rum. Og til at blive en del af det.</p></div>
  </section>
  <section class="hero-image-section" aria-label="Stemning og materialer">
    <div class="hero-image-wrap"><img class="hero-image" src="/images/interior.webp" alt="Stemningsvisualisering af et roligt rum med snedkerdetaljer i eg, en loungestol og naturligt lys" width="1536" height="1024" fetchpriority="high"><div class="photo-shade"></div><span class="image-label"><span class="status-dot"></span> NATURLIGT. PERSONLIGT. FINNZ.</span><div class="image-copy"><p>Godt håndværk kan ses.<br><em>Og mærkes.</em></p><a class="image-cta" href="#tilgang" aria-label="Læs om vores tilgang">${arrow}</a></div><span class="image-credit">STEMNINGSVISUALISERING</span></div>
  </section>
  <section class="intro section-pad" id="tilgang">
    <div class="section-label reveal"><span>01 / VORES TILGANG</span><span class="tiny-cross">+</span></div>
    <div class="intro-content"><h2 class="reveal">Vi tror på det enkle.<br>Og på de detaljer, der<br><em>gør hele forskellen.</em></h2><div class="intro-description reveal"><p>Træ har sit eget sprog. Åretegninger, nuancer og en varme, der giver et rum liv. Hos Finnz Træ & Design lader vi materialet være en del af fortællingen.</p><p>Vi tager udgangspunkt i din idé og det sted, løsningen skal leve. Med blik for både funktion og form skaber vi plads til det personlige.</p><a class="text-link" href="#kontakt">Har du en idé? Lad os høre den ${arrow}</a></div></div>
  </section>
  <section class="possibilities section-pad" id="muligheder">
    <div class="section-label reveal"><span>02 / DET VI SKABER</span><span class="tiny-cross">+</span></div>
    <div class="section-heading reveal"><h2>Fra en tanke.<br><em>Til noget, du kan mærke.</em></h2><p>Små detaljer eller store idéer.<br>Vi finder formen sammen.</p></div>
    <div class="work-grid">
      <button class="work-card reveal" data-project="furniture" aria-haspopup="dialog"><span class="card-image"><img src="/images/detail.webp" alt="Stemningsvisualisering af præcise samlinger og naturlige åretegninger i eg" width="1024" height="1024" loading="lazy"><span class="card-tag">MØBLER & DETALJER</span><span class="card-open">${arrow}</span></span><span class="card-footer"><span><span class="card-number">01</span><span class="card-title">Plads til personlighed</span></span><span class="card-kind">SE MULIGHEDERNE</span></span></button>
      <button class="work-card reveal" data-project="interior" aria-haspopup="dialog"><span class="card-image interior-card"><img src="/images/interior.webp" alt="Stemningsvisualisering af et indbygget egetræsmøbel i en lys, nordisk indretning" width="1536" height="1024" loading="lazy"><span class="card-tag">INDRETNING & LØSNINGER</span><span class="card-open">${arrow}</span></span><span class="card-footer"><span><span class="card-number">02</span><span class="card-title">En del af dit rum</span></span><span class="card-kind">SE MULIGHEDERNE</span></span></button>
    </div><p class="visual-note">Billederne viser stemning og muligheder — de er ikke udførte Finnz-projekter.</p>
  </section>
  <section class="philosophy section-pad">
    <div class="section-label reveal"><span>DET, VI TAGER MED I ARBEJDET</span><span class="tiny-cross">+</span></div>
    <div class="philosophy-top"><h2 class="reveal">Naturlige materialer.<br>Ærlige detaljer.<br><em>Ro i udtrykket.</em></h2><div class="big-mark reveal" aria-hidden="true"><img src="/brand/mark-light.svg" alt="" width="725" height="628" loading="lazy"></div></div>
    <div class="values"><div class="value reveal"><span class="value-no">01</span><h3>Materialet først</h3><p>Vi giver plads til træets naturlige karakter. Til strukturen, varmen og alt det, der gør hvert stykke særligt.</p></div><div class="value reveal"><span class="value-no">02</span><h3>Skabt i dialog</h3><p>Det begynder med en samtale. Vi lytter til dine ønsker og finder frem til en løsning, der passer til dig.</p></div><div class="value reveal"><span class="value-no">03</span><h3>Gennemtænkt fra start</h3><p>Form og funktion følges ad. Fra den første streg til den detalje, du lægger mærke til hver dag.</p></div></div>
  </section>
  <section class="process section-pad"><div class="section-label reveal"><span>03 / FRA IDÉ TIL VIRKELIGHED</span><span class="tiny-cross">+</span></div><div class="process-grid"><h2 class="reveal">Gode løsninger<br>begynder med<br><em>en god samtale.</em></h2><div class="steps"><div class="step reveal"><span>01</span><div><h3>Vi lytter</h3><p>Fortæl os om din idé, dine ønsker og dit rum. En skitse, et billede eller bare en tanke er et godt sted at starte.</p></div></div><div class="step reveal"><span>02</span><div><h3>Vi finder retningen</h3><p>Sammen taler vi om materialer, udtryk og muligheder, så løsningen får den rigtige form.</p></div></div><div class="step reveal"><span>03</span><div><h3>Vi skaber</h3><p>Når detaljerne er på plads, bliver idéen til virkelighed — med omtanke for helheden og håndværket.</p></div></div></div></div></section>
  <section class="contact section-pad" id="kontakt"><div class="section-label reveal"><span>04 / LAD OS SKABE NOGET SAMMEN</span><span class="status-dot"></span></div><div class="contact-heading reveal"><h2>Hvad drømmer<br><em>du om?</em></h2><button class="contact-arrow" data-open-contact aria-label="Fortæl os om din idé">${arrow}</button></div><div class="contact-bottom reveal"><p>En løs tanke eller en helt konkret idé.<br>Vi glæder os til at høre om den.</p><button class="text-link" data-open-contact>Fortæl os om dit projekt ${arrow}</button></div>${contactEmail || contactPhone ? '<div class="contact-details"></div>' : ''}</section>
</main>
<footer class="footer section-pad"><a class="brand" href="#top" aria-label="Finnz Træ & Design, til toppen">${brand}</a><p>Håndværk med karakter.</p><div><span>© ${new Date().getFullYear()} FINNZ TRÆ & DESIGN</span><a href="#top">Til toppen ↑</a></div></footer>
<dialog id="project-dialog" class="project-dialog" aria-labelledby="project-title"><button class="dialog-close" aria-label="Luk">×</button><div class="project-dialog-image"><img id="project-image" alt="" width="1024" height="800"></div><div class="project-dialog-content"><p class="eyebrow" id="project-eyebrow"></p><h2 id="project-title"></h2><p id="project-description"></p><ul id="project-options"></ul><p class="dialog-note">Illustration til inspiration. Materialer og muligheder aftales til det enkelte projekt.</p><button class="button primary" id="project-contact">Tal med os om din idé ${arrow}</button></div></dialog>
<dialog id="contact-dialog" class="contact-dialog" aria-labelledby="contact-title"><button class="dialog-close" aria-label="Luk">×</button><p class="eyebrow">LAD OS BEGYNDE MED DIN IDÉ</p><h2 id="contact-title">Fortæl os <em>lidt mere.</em></h2><p class="form-intro">Du behøver ikke have alle detaljerne på plads endnu.</p><form id="contact-form"><div class="form-row"><label>Dit navn<input name="name" autocomplete="name" required placeholder="Navn"></label><label>Din e-mail<input type="email" name="email" autocomplete="email" required placeholder="dig@eksempel.dk"></label></div><label>Hvad har du i tankerne?<select name="type"><option>Et møbel eller en detalje</option><option>En løsning til mit rum</option><option>Noget helt tredje</option></select></label><label>Din idé<textarea name="message" rows="4" required placeholder="Fortæl lidt om dit projekt, dine ønsker og eventuelt mål …"></textarea></label><p class="form-note">${contactEmail ? 'Din mailapp åbner med din forespørgsel. Du gennemser og sender selv e-mailen.' : 'Du kan forberede og kopiere din forespørgsel her. Den bliver ikke sendt fra hjemmesiden.'}</p><button class="button primary" type="submit">${contactEmail ? 'Klargør e-mail' : 'Forbered forespørgsel'} ${arrow}</button><div class="form-result" role="status" hidden><p></p><textarea aria-label="Din færdige forespørgsel" rows="7" readonly></textarea><button type="button" class="text-link" id="copy-request">Kopiér forespørgsel ${arrow}</button></div></form></dialog>
`;

if (contactEmail || contactPhone) {
  const details = document.querySelector('.contact-details');
  if (contactEmail) {const a = document.createElement('a'); a.href = `mailto:${contactEmail}`; a.textContent = contactEmail; details.append(a);}
  if (contactPhone) {const a = document.createElement('a'); a.href = `tel:${contactPhone.replace(/[^+\d]/g, '')}`; a.textContent = contactPhone; details.append(a);}
  if (!contactEmail) {const note = document.createElement('span'); note.className = 'placeholder-email'; note.textContent = 'E-mail kommer snart'; details.append(note);}
}

const menu = document.querySelector('.menu-toggle');
const mobileNav = document.querySelector('.mobile-nav');
function closeMenu() { menu.setAttribute('aria-expanded', 'false'); mobileNav.hidden = true; }
menu.addEventListener('click', () => {const open = menu.getAttribute('aria-expanded') !== 'true'; menu.setAttribute('aria-expanded', String(open)); mobileNav.hidden = !open;});
mobileNav.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
document.addEventListener('keydown', e => {if(e.key === 'Escape') closeMenu();});

const observer = new IntersectionObserver(entries => entries.forEach(entry => {if(entry.isIntersecting) {entry.target.classList.add('visible'); observer.unobserve(entry.target);}}), {threshold: 0.12});
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

function openDialog(dialog) {dialog.showModal(); document.body.classList.add('dialog-open');}
function closeDialog(dialog) {dialog.close();}
document.querySelectorAll('dialog').forEach(dialog => {
  dialog.querySelector('.dialog-close').addEventListener('click', () => closeDialog(dialog));
  dialog.addEventListener('click', e => {if(e.target === dialog) {const r = dialog.getBoundingClientRect(); if(e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) closeDialog(dialog);}});
  dialog.addEventListener('close', () => {if(!document.querySelector('dialog[open]')) document.body.classList.remove('dialog-open');});
});
const contactDialog = document.querySelector('#contact-dialog');
document.querySelectorAll('[data-open-contact]').forEach(el => el.addEventListener('click', () => openDialog(contactDialog)));
const projects = {
 furniture: {title:'Plads til personlighed', eyebrow:'MØBLER & DETALJER', image:'/images/detail.webp', alt:'Visualisering af snedkerdetaljer i eg', description:'Et møbel kan være meget mere end sin funktion. Det kan samle et rum, give plads til hverdagen og fortælle noget om dem, der bor der.', options:['Borde og mindre møbler','Hylder og opbevaring','Personlige detaljer i træ']},
 interior: {title:'En del af dit rum', eyebrow:'INDRETNING & LØSNINGER', image:'/images/interior.webp', alt:'Visualisering af en rolig indretning med egetræsmøbler', description:'Nogle idéer skal passe præcis til et sted. Vi ser på rummets muligheder og taler om løsninger, hvor funktion, materialer og udtryk hænger sammen.', options:['Løsninger tilpasset rummets mål','Sammenhæng i materialer og udtryk','Indretning med dit hverdagsliv i centrum']}
};
const projectDialog = document.querySelector('#project-dialog');
document.querySelectorAll('[data-project]').forEach(el => el.addEventListener('click', () => {
 const p = projects[el.dataset.project];
 document.querySelector('#project-title').textContent = p.title;
 document.querySelector('#project-eyebrow').textContent = p.eyebrow;
 const img = document.querySelector('#project-image'); img.src = p.image; img.alt = p.alt;
 document.querySelector('#project-description').textContent = p.description;
 document.querySelector('#project-options').replaceChildren(...p.options.map(text => {const li = document.createElement('li'); li.textContent = text; return li;}));
 openDialog(projectDialog);
}));
document.querySelector('#project-contact').addEventListener('click', () => {closeDialog(projectDialog); openDialog(contactDialog);});
let requestText = '';
document.querySelector('#contact-form').addEventListener('submit', e => {
 e.preventDefault(); const data = new FormData(e.target);
 requestText = `Hej Finnz Træ & Design,\n\n${data.get('message')}\n\nProjekt: ${data.get('type')}\n\nVenlig hilsen\n${data.get('name')}\n${data.get('email')}`;
 const result = document.querySelector('.form-result'); result.hidden = false;
 document.querySelector('#copy-request').innerHTML = `Kopiér forespørgsel ${arrow}`;
 result.querySelector('textarea').value = requestText;
 result.querySelector('p').textContent = contactEmail ? 'Din forespørgsel er klar i din mailapp. Husk at sende den derfra. Du kan også kopiere teksten her.' : 'Din forespørgsel er klar til at kopiere. Den er ikke sendt. Kontaktoplysninger tilføjes, inden siden lanceres.';
 if(contactEmail) window.location.href = `mailto:${contactEmail}?subject=${encodeURIComponent('Forespørgsel — ' + data.get('type'))}&body=${encodeURIComponent(requestText)}`;
 result.scrollIntoView({behavior:'smooth',block:'nearest'});
});
document.querySelector('#copy-request').addEventListener('click', async e => {
 const button = e.currentTarget;
 try {await navigator.clipboard.writeText(requestText); button.textContent = 'Forespørgsel kopieret ✓';}
 catch {const area = document.querySelector('.form-result textarea'); area.focus(); area.select(); document.querySelector('.form-result p').textContent = 'Markér teksten og kopiér den med Ctrl+C eller Cmd+C.';}
});
