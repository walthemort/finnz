import '@fontsource/manrope/latin-400.css';
import '@fontsource/manrope/latin-500.css';
import '@fontsource/manrope/latin-600.css';
import '@fontsource/cormorant-garamond/latin-400-italic.css';
import './style.css';

const arrow = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 19 19 5M5 5h14v14" stroke="currentColor" stroke-width="1.4"/></svg>';
const brand = '<img class="brand-logo" src="/brand/logo-black.svg" alt="Finnz" width="924.8" height="329.72">';
const contactEmail = import.meta.env.VITE_CONTACT_EMAIL || '';
const contactPhone = import.meta.env.VITE_CONTACT_PHONE || '+45 41 35 20 25';

document.querySelector('#app').innerHTML = `
  <header class="header" id="top">
    <a class="brand" href="#top" aria-label="Finnz Træ & Design, til toppen">${brand}</a>
    <a class="text-link" href="#kontakt">Lad os tale sammen ${arrow}</a>
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
