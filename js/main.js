// =========================================================
// Rebekah Mugenyi — Portfolio
// Shared behaviour: mobile nav, auto-scrolling marquees,
// project tag filtering.
// =========================================================

document.addEventListener('DOMContentLoaded', () => {
  initNavToggle();
  initMarquees();
  initProjectFilters();
});

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
