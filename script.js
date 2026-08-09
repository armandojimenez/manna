/* ====================================================
   MANNA — Landing Page Scripts
   ==================================================== */

(function () {
  'use strict';

  var html = document.documentElement;

  // ── Language Selector ──
  var languageSelect = document.getElementById('languageSelect');
  if (languageSelect) {
    languageSelect.addEventListener('change', function () {
      var destination = languageSelect.value;
      if (destination && /^(?:\.\.\/)?(?:en|es|pt-BR|fr|de|it|pl|id)\/$/.test(destination)) {
        window.location.assign(destination);
      }
    });
  }

  // ── Theme Toggle ──
  var themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      var current = html.getAttribute('data-theme') || 'light';
      var next = current === 'light' ? 'dark' : 'light';
      html.setAttribute('data-theme', next);

      var meta = document.querySelector('meta[name="theme-color"]');
      if (meta) meta.setAttribute('content', next === 'dark' ? '#1A1816' : '#FAF8F5');

      try { localStorage.setItem('manna-theme', next); } catch (_) {}
    });
  }

  // ── Navbar Scroll Effect ──
  var navbar = document.getElementById('navbar');
  function updateNav() {
    if (navbar) navbar.classList.toggle('is-scrolled', window.scrollY > 32);
  }
  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav();

  // ── Scroll Reveal Animations ──
  var animEls = document.querySelectorAll('.anim-up');
  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    animEls.forEach(function (el) { observer.observe(el); });
  } else {
    animEls.forEach(function (el) { el.classList.add('is-visible'); });
  }

  // ── Hide Scroll Hint ──
  var scrollHint = document.querySelector('.hero-scroll');
  if (scrollHint) {
    function hideHint() {
      if (window.scrollY > 100) {
        scrollHint.style.opacity = '0';
        scrollHint.style.transition = 'opacity 0.4s ease';
        window.removeEventListener('scroll', hideHint);
      }
    }
    window.addEventListener('scroll', hideHint, { passive: true });
  }

})();
