import '@fontsource/manrope/latin-400.css';
import '@fontsource/manrope/latin-500.css';
import '@fontsource/manrope/latin-600.css';
import '@fontsource/cormorant-garamond/latin-400-italic.css';
import '@fontsource/caveat/latin-400.css';
import './style.css';
import { projects } from './projects.js';
import { createProjectMotion } from './project-motion.js';
import { materialSelectorMarkup, setupMaterialSelector } from './materials.js';
import { contactFormMarkup, setupContactForm } from './contact-form.js';
import { setupImageLoading, setupPageNavigation } from './ui-enhancements.js';

const arrow = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 19 19 5M5 5h14v14" stroke="currentColor" stroke-width="1.4"/></svg>';
const brand = '<img class="brand-logo" src="/brand/logo-dark.webp" alt="Finnz" width="925" height="331">';
const contactEmail = import.meta.env.VITE_CONTACT_EMAIL || 'zfzi@hotmail.com';
const projectSlotCount = 8;
const contactPhone = import.meta.env.VITE_CONTACT_PHONE || '+45 41 35 20 25';

document.querySelector('#app').innerHTML = `
  <div id="top" aria-hidden="true"></div>
  <div class="header-shell"><header class="header">
    <a class="brand" href="#top" aria-label="Finnz Træ & Design, til toppen">${brand}</a>
    <nav aria-label="Hovednavigation"><a href="#projekter">Projekter</a><a href="#materialer">Materialer</a><button class="text-link" type="button" data-open-contact aria-haspopup="dialog" aria-controls="contact-dialog">Lad os tale sammen ${arrow}</button></nav>
  </header></div>
  <main id="indhold">
    <section class="hero" aria-labelledby="hero-title">
      <p class="eyebrow intro-reveal"><span class="status-dot"></span> FINNZ TRÆ & DESIGN</p>
      <h1 id="hero-title">
        <span class="title-line"><span>Træ med karakter.</span></span>
        <span class="title-line"><span>Design med <em>omtanke.</em></span></span>
      </h1>
      <p class="hero-description intro-reveal">Personlige løsninger i træ. Skabt til dit rum.</p>
    </section>
    <figure class="hero-image-section">
      <div class="hero-image-wrap"><div class="hero-parallax">
        <img class="hero-image" src="/images/editorial/garden-hero.webp" alt="Stemningsvisualisering af sort træbeklædning og lys træafskærmning i grønne omgivelser" width="1536" height="1024" fetchpriority="high">
      </div></div>
      <figcaption>AI-genereret stemningsvisualisering</figcaption>
    </figure>
    <section class="projects reveal" id="projekter" aria-labelledby="projects-title">
      <div class="projects-heading"><div><p class="eyebrow">UDVALGTE PROJEKTER</p><h2 id="projects-title">Form. Funktion. <em>Følelse.</em></h2></div><span class="project-count">01 — ${String(projectSlotCount).padStart(2, '0')}</span></div>
      <div class="project-grid">
        ${Array.from({ length: projectSlotCount }, (_, index) => {
          const project = projects[index];
          const number = String(index + 1).padStart(2, '0');
          return project ? `<button class="project-card" data-project="${index}" aria-haspopup="dialog" aria-label="Åbn projekt: ${project.title}"><span class="project-image"><img src="${project.image}" alt="${project.alt}" width="1086" height="1448" loading="lazy"></span><span class="project-number">${number}</span><span class="project-card-copy"><span class="eyebrow">${project.kind}</span><span class="project-title">${project.title}</span><span class="project-read">Læs om projektet ${arrow}</span></span></button>` : `<div class="project-slot" aria-label="Projektplads ${number}, flere projekter på vej"><span class="project-number">${number}</span><img src="/brand/mark-dark.webp" alt="" width="389" height="567" loading="lazy"><span class="project-slot-label">På vej</span></div>`;
        }).join('')}
      </div>
      <div class="project-rail-status"><span>Tryk for at udfolde · swipe for flere</span><div class="project-rail-dots" role="group" aria-label="Vælg projektkort"></div><span class="project-rail-counter"></span></div>
      <p class="project-note">${projects.length} udførte Finnz-projekter — flere følger. Fotografierne er redigeret med AI.</p>
    </section>
    ${materialSelectorMarkup(arrow)}
    <section class="contact reveal" id="kontakt" aria-labelledby="contact-title">
      <div>
        <p class="eyebrow">LAD OS SKABE NOGET SAMMEN</p>
        <h2 id="contact-title">En idé <em>i træ?</em></h2>
        <p class="contact-description">Giv os et kald, eller skriv et par ord om din idé.</p>
      </div>
      <div class="contact-details">
        <a class="phone-link" id="contact-phone" data-contact-phone>${arrow}</a>
        <span class="email-placeholder">E-mail kommer snart</span>
        <button class="contact-write" type="button" data-open-contact aria-haspopup="dialog">Skriv til os i dag ${arrow}</button>
      </div>
    </section>
  </main>
  <footer class="footer">
    <a class="brand" href="#top" aria-label="Finnz Træ & Design, til toppen">${brand}</a>
    <span>© ${new Date().getFullYear()} Finnz Træ & Design</span>
    <a class="back-top" href="#top">Til toppen ↑</a>
  </footer>
  <dialog class="project-dialog" id="project-dialog" aria-labelledby="project-title">
    <header class="project-header">
      <button class="brand project-home" type="button" aria-label="Luk projekt og gå tilbage til forsiden">${brand}</button><span class="eyebrow project-position"></span>
      <button class="dialog-close" aria-label="Luk projektvisning"><span>Luk projekt</span><span aria-hidden="true">×</span></button>
    </header>
    <div class="project-page">
      <section class="project-lead"><p class="eyebrow" id="project-kind"></p><h2 id="project-title"></h2><p id="project-lead-text"></p></section>
      <div class="project-gallery">
        <div class="project-primary"><div class="project-cover"><img class="dialog-image" alt="" width="1086" height="1448" draggable="false"></div><p class="image-caption"></p></div>
        <div class="project-photo-grid" role="group" aria-label="Supplerende projektbilleder"></div>
      </div>
      <section class="project-story"><div><p class="eyebrow">IDÉ & UDTRYK</p><h3 id="project-story-title"></h3></div><div><p id="project-description"></p><dl class="project-facts"></dl></div></section>
      <p class="project-disclaimer">Fotografier af et udført Finnz-projekt, redigeret med AI.</p>
      <section class="project-contact"><div><p class="eyebrow">LAD OS FINDE DIT UDTRYK</p><h3>Ønsker du noget <em>lignende?</em></h3><p>Vi tager udgangspunkt i din idé og dit rum.</p></div><button class="project-contact-button" type="button" aria-haspopup="dialog" aria-controls="contact-dialog">Fortæl os om din idé ${arrow}</button></section>
      <button class="next-project"><span><span class="eyebrow">NÆSTE PROJEKT</span><span class="next-project-title"></span></span>${arrow}</button>
    </div>
  </dialog>
  <dialog class="contact-dialog" id="contact-dialog" aria-labelledby="form-title">
    <header class="project-header contact-header"><span class="brand">${brand}</span><span class="eyebrow project-position">KONTAKT</span><button class="dialog-close" aria-label="Luk kontaktformular"><span>Luk kontakt</span><span aria-hidden="true">×</span></button></header>
    <div class="contact-dialog-content">
      <div class="contact-dialog-intro"><p class="eyebrow">SKRIV TIL OS I DAG</p><h2 id="form-title">Fortæl om<br>din <em>idé.</em></h2><p>En løs tanke eller en konkret idé.<br>Et par ord er et godt sted at starte.</p><div class="contact-dialog-call"><span class="eyebrow">HELLERE EN SAMTALE?</span><a data-contact-phone>${arrow}</a></div></div>
        ${contactFormMarkup(arrow)}
    </div>
  </dialog>
  <div class="brand-cursor" aria-hidden="true"><img src="/brand/mark-outlined.webp" alt="" width="449" height="632"></div>
`;

document.querySelectorAll('[data-contact-phone]').forEach(phone => {
  phone.href = `tel:${contactPhone.replace(/[^+\d]/g, '')}`;
  phone.prepend(document.createTextNode(contactPhone));
});

if (contactEmail) {
  const email = document.createElement('a');
  email.className = 'email-link';
  email.href = `mailto:${contactEmail}`;
  email.textContent = contactEmail;
  document.querySelector('.email-placeholder').replaceWith(email);
}

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// A full-screen project page with native modal focus handling.
const gallery = document.querySelector('#project-dialog');
const projectMotion = createProjectMotion({
  dialog: gallery,
  getCard: () => document.querySelector(`[data-project="${projectIndex}"]`),
});
let projectIndex = 0;
const contactDialog = document.querySelector('#contact-dialog');
let returnToMaterials = false;
function syncDialogs() {
  const topDialog = contactDialog.open ? contactDialog : gallery.open ? gallery : null;
  document.body.classList.toggle('dialog-open', Boolean(topDialog));
  (topDialog || document.body).append(cursor);
}
function openContact({ project = null } = {}) {
  if (contactDialog.open) return;
  const message = document.querySelector('[name="message"]');
  if (project && !message.value.trim()) {
    message.value = `Jeg er inspireret af “${project.title}” og vil gerne høre om en lignende løsning.\n\nMin idé: `;
    message.dispatchEvent(new Event('input', { bubbles: true }));
  }
  contactDialog.showModal();
  contactDialog.scrollTop = 0;
  syncDialogs();
  // In the stacked mobile layout, open at the form rather than the introductory phone block.
  if (matchMedia('(max-width: 900px)').matches) {
    const form = contactDialog.querySelector('#contact-form');
    const header = contactDialog.querySelector('.contact-header');
    contactDialog.scrollTop = Math.max(0, form.getBoundingClientRect().top - contactDialog.getBoundingClientRect().top - header.offsetHeight - 24);
  }
  const name = document.querySelector('[name="name"]');
  const email = document.querySelector('[name="email"]');
  (name.value.trim() ? email.value.trim() ? message : email : name).focus({ preventScroll: true });
}
document.querySelectorAll('[data-open-contact]').forEach(button => {
  button.setAttribute('aria-controls', 'contact-dialog');
  button.addEventListener('click', event => {
    event.preventDefault();
    openContact();
  });
});
contactDialog.querySelector('.dialog-close').addEventListener('click', () => contactDialog.close());
contactDialog.querySelector('.material-edit').addEventListener('click', () => {
  returnToMaterials = true;
  contactDialog.close();
});
contactDialog.addEventListener('close', () => {
  syncDialogs();
  if (!returnToMaterials) return;
  returnToMaterials = false;
  if (gallery.open) projectMotion.close({ immediate: true });
  requestAnimationFrame(() => {
    document.querySelector('#materialer').scrollIntoView({ behavior: reducedMotion() ? 'instant' : 'smooth', block: 'start' });
    const option = document.querySelector('[name="wood"]:checked') || document.querySelector('[name="wood"]');
    option.focus({ preventScroll: true });
  });
});
const reducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
function showProject(index) {
  projectIndex = (index + projects.length) % projects.length;
  const project = projects[projectIndex];
  gallery.querySelector('#project-title').textContent = project.title;
  gallery.querySelector('#project-kind').textContent = project.kind;
  gallery.querySelector('.project-position').textContent = `PROJEKT ${String(projectIndex + 1).padStart(2, '0')} / ${String(projects.length).padStart(2, '0')}`;
  gallery.querySelector('#project-lead-text').textContent = project.lead;
  gallery.querySelector('#project-story-title').textContent = project.storyTitle;
  gallery.querySelector('#project-description').textContent = project.description;
  const facts = gallery.querySelector('.project-facts');
  facts.replaceChildren(...project.details.map(([label, value]) => {
    const row = document.createElement('div');
    const dt = document.createElement('dt'); dt.textContent = label;
    const dd = document.createElement('dd'); dd.textContent = value;
    row.append(dt, dd); return row;
  }));
  const primary = project.images.find(photo => photo.src === project.image) || project.images[0];
  const image = gallery.querySelector('.dialog-image');
  image.src = primary.src; image.alt = primary.alt;
  gallery.querySelector('.image-caption').textContent = primary.caption;
  gallery.querySelector('.project-photo-grid').replaceChildren(...project.images.filter(photo => photo !== primary).map(photo => {
    const figure = document.createElement('figure'); figure.className = 'project-secondary';
    const image = document.createElement('img');
    image.src = photo.src; image.alt = photo.alt; image.width = 1086; image.height = 1448; image.draggable = false;
    const caption = document.createElement('figcaption'); caption.className = 'secondary-caption'; caption.textContent = photo.caption;
    figure.append(image, caption); return figure;
  }));
  gallery.querySelector('.next-project-title').textContent = projects[(projectIndex + 1) % projects.length].title;
  projectNavigation.activate(projectIndex, { immediate: true });
  gallery.scrollTop = 0;
}
document.querySelectorAll('[data-project]').forEach(button => {
  button.addEventListener('click', () => {
    const touchLayout = matchMedia('(hover: none), (pointer: coarse)').matches;
    if (touchLayout && !button.classList.contains('is-active')) {
      projectNavigation.activate(Number(button.dataset.project), { scroll: true });
      return;
    }
    showProject(Number(button.dataset.project));
    projectMotion.open(button, () => {
      gallery.showModal();
      syncDialogs();
      gallery.scrollTop = 0;
    });
  });
});
gallery.querySelector('.dialog-close').addEventListener('click', () => projectMotion.close());
gallery.querySelector('.project-home').addEventListener('click', () => projectMotion.close());
gallery.addEventListener('cancel', event => {
  event.preventDefault();
  projectMotion.close();
});
gallery.querySelector('.next-project').addEventListener('click', () => {
  showProject(projectIndex + 1);
  gallery.querySelector('.dialog-close').focus({ preventScroll: true });
});
gallery.querySelector('.project-contact-button').addEventListener('click', () => {
  openContact({ project: projects[projectIndex] });
});
gallery.addEventListener('close', syncDialogs);
// The uploaded F follows a mouse directly: no lag, no interference with touch or keyboard.
const cursor = document.querySelector('.brand-cursor');
const cursorMedia = matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)');
const cursorImage = cursor.querySelector('img');
const hideCursor = () => document.documentElement.classList.remove('has-brand-cursor');
window.addEventListener('pointermove', event => {
  if (!cursorMedia.matches || event.pointerType !== 'mouse' || !cursorImage.complete || !cursorImage.naturalWidth) return hideCursor();
  cursor.style.transform = `translate3d(${event.clientX - 3}px, ${event.clientY - 3}px, 0)`;
  const isTextInput = Boolean(event.target.closest('input, textarea, select, .comparison-drag-surface'));
  if (isTextInput) return hideCursor();
  cursor.classList.toggle('is-link', Boolean(event.target.closest('a, button, summary')));
  document.documentElement.classList.add('has-brand-cursor');
}, { passive: true });
document.documentElement.addEventListener('pointerleave', hideCursor);
window.addEventListener('blur', hideCursor);
cursorMedia.addEventListener('change', hideCursor);
document.addEventListener('keydown', event => { if (event.key === 'Tab') hideCursor(); });

let materialController;
const contactForm = document.querySelector('#contact-form');
const enquiry = setupContactForm({ onResetColor: () => materialController?.reset() });
materialController = setupMaterialSelector(({ material, finish }) => {
  contactForm.elements.namedItem('material').value = material;
  contactForm.elements.namedItem('finish').value = finish;
  document.querySelector('#material-summary').textContent = material === 'Afklares sammen' ? 'Vi finder farven sammen.' : `Farve: ${material}`;
  enquiry.invalidate();
}, () => openContact());
if (enquiry.restoredColor) materialController.select(enquiry.restoredColor);
setupImageLoading();
const projectNavigation = setupPageNavigation();

// A visible branded intro on every page load, including cached reloads.
function startIntro() {
  const intro = document.querySelector('.site-intro');
  if (!intro) return;
  const minimum = reducedMotion() ? 350 : 1100;
  let done = false;
  const finish = () => {
    if (done) return;
    done = true;
    document.documentElement.classList.remove('is-intro');
    intro.classList.add('is-ready');
    window.removeEventListener('pointerdown', finish);
    window.removeEventListener('keydown', finish);
    setTimeout(() => intro.remove(), reducedMotion() ? 0 : 550);
  };
  window.addEventListener('pointerdown', finish, { once: true });
  window.addEventListener('keydown', finish, { once: true });
  const images = [document.querySelector('.hero-image'), intro.querySelector('img')];
  const ready = Promise.allSettled([document.fonts.ready, ...images.map(image => image.decode())]);
  const deadline = new Promise(resolve => setTimeout(resolve, 2200));
  const visibleIntro = new Promise(resolve => setTimeout(resolve, minimum));
  Promise.all([Promise.race([ready, deadline]), visibleIntro]).then(finish);
}
startIntro();
