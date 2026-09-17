// =========================================================
// Rebekah Mugenyi — Portfolio
// Shared behaviour: mobile nav, auto-scrolling marquees,
// project tag filtering.
// =========================================================

document.addEventListener('DOMContentLoaded', () => {
  initNavToggle();
  initMarquees();
  initProjectFilters();
  initThemeToggle();
  initSidequestPeel();
  initTunnelReveal();
});

// ---- Rabbit hole: fade/slide each stop in as it scrolls into view ----
function initTunnelReveal() {
  const stops = document.querySelectorAll('.tunnel-stop');
  if (!stops.length) return;

  if (!('IntersectionObserver' in window)) {
    stops.forEach((el) => el.classList.add('in-view'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  stops.forEach((el) => observer.observe(el));
}

// ---- Sidequests poster: peel corner reveals the construction panel ----
function initSidequestPeel() {
  const poster = document.getElementById('comicPoster');
  const corner = document.getElementById('peelCorner');
  if (!poster || !corner) return;

  const STORAGE_KEY = 'sidequestsPeeled';

  // Already peeled on a previous visit — show the revealed state
  // immediately, no poster, no animation.
  if (localStorage.getItem(STORAGE_KEY) === 'true') {
    poster.classList.add('peeled-hidden');
    return;
  }

  corner.addEventListener('click', () => {
    if (poster.classList.contains('peeling')) return;

    poster.classList.add('peeling');
    localStorage.setItem(STORAGE_KEY, 'true');

    const onEnd = (e) => {
      if (e.propertyName !== 'transform') return;
      poster.classList.add('peeled-hidden');
      poster.removeEventListener('transitionend', onEnd);
    };
    poster.addEventListener('transitionend', onEnd);
  });
}

// ---- Dark / light mode toggle ----
// The initial theme (from localStorage, falling back to the OS
// preference) is already applied to <html data-theme="..."> by an
// inline script in <head>, before first paint, to avoid a flash.
// This just wires up the button to flip it afterwards.
function initThemeToggle() {
  const btn = document.querySelector('.theme-toggle');
  if (!btn) return;

  const setLabel = (theme) => {
    btn.textContent = theme === 'dark' ? '☀' : '☾';
    btn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
  };

  setLabel(document.documentElement.getAttribute('data-theme') || 'light');

  btn.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme') || 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    setLabel(next);
  });
}

// ---- Mobile nav toggle ----
function initNavToggle() {
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.site-nav');
  if (!toggle || !nav) return;

  toggle.addEventListener('click', () => {
    nav.classList.toggle('open');
  });
}

// ---- Marquee rows: duplicate the track content so the
// CSS animation (-50% translateX) loops seamlessly, and
// pause on hover / tap (also handled by CSS, this covers
// touch devices where :hover doesn't fire on tap-hold). ----
function initMarquees() {
  document.querySelectorAll('.marquee-track').forEach((track) => {
    // Duplicate children once so a -50% translateX is a perfect loop.
    const originalChildren = Array.from(track.children);
    originalChildren.forEach((child) => {
      track.appendChild(child.cloneNode(true));
    });

    const viewport = track.closest('.marquee-viewport');
    if (!viewport) return;

    viewport.addEventListener('touchstart', () => track.classList.add('paused'), { passive: true });
    viewport.addEventListener('touchend', () => track.classList.remove('paused'), { passive: true });
  });
}

// ---- Project grid filtering by tag ----
function initProjectFilters() {
  const filterButtons = document.querySelectorAll('.tag-filter');
  const cards = document.querySelectorAll('.project-card');
  if (!filterButtons.length || !cards.length) return;

  filterButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const tag = btn.dataset.tag;

      cards.forEach((card) => {
        if (tag === 'all') {
          card.hidden = false;
          return;
        }
        const tags = (card.dataset.tags || '').split(',');
        card.hidden = !tags.includes(tag);
      });
    });
  });
}
