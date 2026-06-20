// Language management
const LANG_KEY = 'farang_lang';

function setLang(lang) {
  document.body.classList.remove('lang-fr', 'lang-en');
  document.body.classList.add('lang-' + lang);
  localStorage.setItem(LANG_KEY, lang);
  document.querySelectorAll('.lang-btn, .nav-lang').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });
  // Liens d'articles bilingues : pointer vers la version FR ou EN
  document.querySelectorAll('[data-fr-href]').forEach(el => {
    el.setAttribute('href', lang === 'fr' ? el.dataset.frHref : el.dataset.enHref);
  });
}

function initLang() {
  // Pages d'article : langue figée par la page elle-même (vraies versions FR/EN
  // séparées). Le toggle est alors un lien vers l'autre version.
  const pageLang = document.body.dataset.pageLang;
  if (pageLang) { setLang(pageLang); return; }
  const saved = localStorage.getItem(LANG_KEY);
  const browser = navigator.language.startsWith('fr') ? 'fr' : 'en';
  setLang(saved || browser);
}

// Smooth scroll for TOC
function initTOC() {
  document.querySelectorAll('.toc-list a').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute('href'));
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}

// Reading progress bar
function initProgress() {
  const bar = document.getElementById('reading-progress');
  if (!bar) return;
  window.addEventListener('scroll', () => {
    const total = document.body.scrollHeight - window.innerHeight;
    const pct = total > 0 ? (window.scrollY / total) * 100 : 0;
    bar.style.width = pct + '%';
  });
}

// Init
document.addEventListener('DOMContentLoaded', () => {
  initLang();
  initTOC();
  initProgress();
});
