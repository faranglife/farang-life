// Language management
const LANG_KEY = 'farang_lang';

function setLang(lang) {
  document.body.classList.remove('lang-fr', 'lang-en');
  document.body.classList.add('lang-' + lang);
  localStorage.setItem(LANG_KEY, lang);
  document.querySelectorAll('.lang-btn, .nav-lang').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });
}

function initLang() {
  const saved = localStorage.getItem(LANG_KEY);
  const browser = navigator.language.startsWith('fr') ? 'fr' : 'en';
  setLang(saved || browser);
}

// Newsletter form
function initNewsletter() {
  document.querySelectorAll('.newsletter-form').forEach(form => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const input = form.querySelector('.newsletter-input');
      const btn = form.querySelector('.newsletter-submit');
      const email = input.value.trim();
      if (!email || !email.includes('@')) return;
      btn.textContent = '...';
      btn.disabled = true;
      await new Promise(r => setTimeout(r, 900));
      btn.textContent = '✓';
      input.value = '';
      input.placeholder = document.body.classList.contains('lang-fr')
        ? 'Bienvenue ! On se retrouve dans votre boîte.'
        : 'Welcome! Check your inbox.';
      setTimeout(() => {
        btn.textContent = document.body.classList.contains('lang-fr') ? 'Rejoindre →' : 'Join →';
        btn.disabled = false;
      }, 3000);
    });
  });
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
  initNewsletter();
  initTOC();
  initProgress();
});
