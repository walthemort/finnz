import '@fontsource/manrope/latin-400.css';
import '@fontsource/manrope/latin-500.css';
import '@fontsource/manrope/latin-600.css';
import '@fontsource/cormorant-garamond/latin-400-italic.css';
import './style.css';

const arrow = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 19 19 5M5 5h14v14" stroke="currentColor" stroke-width="1.4"/></svg>';
const brand = '<img class="brand-logo" src="/brand/logo-black.webp" alt="Finnz" width="925" height="331">';
const projects = [
  { title: 'Detaljen gør forskellen', kind: 'Møbler & materialer', image: '/images/detail.webp', alt: 'Stemningsvisualisering af en samling i et egetræsbord' },
  { title: 'Træ, der samler et rum', kind: 'Rum & indretning', image: '/images/interior.webp', alt: 'Stemningsvisualisering af et egetræsmøbel i et lyst rum' },
];
const contactEmail = import.meta.env.VITE_CONTACT_EMAIL || '';
const contactPhone = import.meta.env.VITE_CONTACT_PHONE || '+45 41 35 20 25';

document.querySelector('#app').innerHTML = `
  <header class="header" id="top">
    <a class="brand" href="#top" aria-label="Finnz Træ & Design, til toppen">${brand}</a>
    <nav aria-label="Hovednavigation"><a href="#projekter">Projekter & idéer</a><a class="text-link" href="#kontakt">Lad os tale sammen ${arrow}</a></nav>
  </header>
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
      <div class="hero-image-wrap">
        <img class="hero-image" src="/images/interior.webp" alt="Stemningsvisualisering af et lyst rum med et egetræsmøbel og naturligt lys" width="1536" height="1024" fetchpriority="high">
      </div>
      <figcaption>Stemningsvisualisering</figcaption>
    </figure>
    <section class="projects reveal" id="projekter" aria-labelledby="projects-title">
      <div class="projects-heading"><div><p class="eyebrow">INSPIRATION I TRÆ</p><h2 id="projects-title">Form. Funktion. <em>Følelse.</em></h2></div><span class="project-count">01 — ${String(projects.length + 1).padStart(2, '0')}</span></div>
      <div class="project-grid">
        ${projects.map((project, index) => `<button class="project-card" data-project="${index}" aria-haspopup="dialog" aria-label="Se ${project.title.toLowerCase()}"><span class="project-image"><img src="${project.image}" alt="${project.alt}" width="1024" height="1024" loading="lazy"><span class="project-open">${arrow}</span></span><span class="project-meta"><span class="eyebrow">${project.kind}</span><span class="project-number">0${index + 1}</span></span><span class="project-title">${project.title}</span></button>`).join('')}
        <a class="project-invite" href="#kontakt"><img src="/brand/mark-outlined.webp" alt="" width="449" height="632" loading="lazy"><span>Det næste<br>kunne være <em>dit.</em></span><span class="invite-link">Lad os høre din idé ${arrow}</span></a>
      </div>
      <p class="project-note">Billederne er stemningsvisualiseringer, ikke udførte Finnz-projekter.</p>
    </section>
    <section class="contact reveal" id="kontakt" aria-labelledby="contact-title">
      <div>
        <p class="eyebrow">LAD OS SKABE NOGET SAMMEN</p>
        <h2 id="contact-title">En idé <em>i træ?</em></h2>
        <p class="contact-description">Giv os et kald. Så tager vi den derfra.</p>
      </div>
      <div class="contact-details">
        <a class="phone-link" id="contact-phone">${arrow}</a>
        <span class="email-placeholder">E-mail kommer snart</span>
      </div>
    </section>
  </main>
  <footer class="footer">
    <a class="brand" href="#top" aria-label="Finnz Træ & Design, til toppen">${brand}</a>
    <span>© ${new Date().getFullYear()} Finnz Træ & Design</span>
    <a class="back-top" href="#top">Til toppen ↑</a>
  </footer>
  <dialog class="project-dialog" id="project-dialog" aria-labelledby="project-title">
    <button class="dialog-close" aria-label="Luk projektvisning">×</button>
    <img class="dialog-image" alt="" width="1200" height="900">
    <div class="dialog-content"><p class="eyebrow" id="project-kind"></p><h2 id="project-title"></h2><p class="project-note">Stemningsvisualisering — inspiration til din egen løsning.</p><div class="dialog-bottom"><a class="text-link" href="#kontakt">Tal om noget lignende ${arrow}</a><div class="gallery-controls"><button class="gallery-prev" aria-label="Forrige billede">←</button><span class="gallery-count" aria-live="polite"></span><button class="gallery-next" aria-label="Næste billede">→</button></div></div></div>
  </dialog>
  <div class="brand-cursor" aria-hidden="true"><img src="/brand/mark-outlined.webp" alt="" width="449" height="632"></div>
`;

const phone = document.querySelector('#contact-phone');
phone.href = `tel:${contactPhone.replace(/[^+\d]/g, '')}`;
phone.prepend(document.createTextNode(contactPhone));

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

// Native dialog keeps focus and Escape handling accessible to keyboard users.
const gallery = document.querySelector('#project-dialog');
let projectIndex = 0;
function showProject(index) {
  projectIndex = (index + projects.length) % projects.length;
  const project = projects[projectIndex];
  const image = gallery.querySelector('.dialog-image');
  image.src = project.image;
  image.alt = project.alt;
  gallery.querySelector('#project-title').textContent = project.title;
  gallery.querySelector('#project-kind').textContent = project.kind;
  gallery.querySelector('.gallery-count').textContent = `${projectIndex + 1} / ${projects.length}`;
}
document.querySelectorAll('[data-project]').forEach(button => {
  button.addEventListener('click', () => {
    showProject(Number(button.dataset.project));
    gallery.showModal();
    gallery.append(cursor);
    document.body.classList.add('dialog-open');
  });
});
gallery.querySelector('.dialog-close').addEventListener('click', () => gallery.close());
gallery.querySelector('.gallery-prev').addEventListener('click', () => showProject(projectIndex - 1));
gallery.querySelector('.gallery-next').addEventListener('click', () => showProject(projectIndex + 1));
gallery.querySelector('a').addEventListener('click', () => gallery.close());
gallery.addEventListener('close', () => {
  document.body.classList.remove('dialog-open');
  document.body.append(cursor);
});
gallery.addEventListener('click', event => {
  if (event.target !== gallery) return;
  const rect = gallery.getBoundingClientRect();
  if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) gallery.close();
});
gallery.addEventListener('keydown', event => {
  if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
    event.preventDefault();
    showProject(projectIndex + (event.key === 'ArrowRight' ? 1 : -1));
  }
});

// The uploaded F follows a mouse directly: no lag, no interference with touch or keyboard.
const cursor = document.querySelector('.brand-cursor');
const cursorMedia = matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)');
const cursorImage = cursor.querySelector('img');
const hideCursor = () => document.documentElement.classList.remove('has-brand-cursor');
window.addEventListener('pointermove', event => {
  if (!cursorMedia.matches || event.pointerType !== 'mouse' || !cursorImage.complete || !cursorImage.naturalWidth) return hideCursor();
  cursor.style.transform = `translate3d(${event.clientX - 3}px, ${event.clientY - 3}px, 0)`;
  cursor.classList.toggle('is-link', Boolean(event.target.closest('a, button')));
  document.documentElement.classList.add('has-brand-cursor');
}, { passive: true });
document.documentElement.addEventListener('pointerleave', hideCursor);
window.addEventListener('blur', hideCursor);
cursorMedia.addEventListener('change', hideCursor);
document.addEventListener('keydown', event => { if (event.key === 'Tab') hideCursor(); });
