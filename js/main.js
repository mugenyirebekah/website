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
  initStickerTaps();
  initStickerDownloadAll();
  initManifesto();
  initSecretFolder();
});


/* ---- MANIFESTO STEP 1: paste this function into js/main.js (outside the DOMContentLoaded block) ---- */



function initSecretFolder() {
  var f = document.getElementById('secretFolder');
  if (!f) return;
  f.addEventListener('click', function (e) {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1) return; // let new-tab clicks behave normally
    e.preventDefault();
    if (f.classList.contains('open')) return;
    f.classList.add('open');
    var calm = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setTimeout(function () { window.location.href = f.getAttribute('href'); }, calm ? 0 : 900);
  });
  window.addEventListener('pageshow', function () { f.classList.remove('open'); }); // reset if she hits Back
}


function initManifesto() {
  /* Priority tabs */
  var tabs = [].slice.call(document.querySelectorAll('.mf-tab'));
  if (tabs.length) {
    var pick = function (t, focus) {
      tabs.forEach(function (x) {
        var on = x === t;
        x.setAttribute('aria-selected', on ? 'true' : 'false');
        x.tabIndex = on ? 0 : -1;
        document.getElementById(x.getAttribute('aria-controls')).hidden = !on;
      });
      if (focus) t.focus();
    };
    tabs.forEach(function (t, i) {
      t.addEventListener('click', function () { pick(t); });
      t.addEventListener('keydown', function (e) {
        var n = null;
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') n = tabs[(i + 1) % tabs.length];
        if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') n = tabs[(i + tabs.length - 1) % tabs.length];
        if (e.key === 'Home') n = tabs[0];
        if (e.key === 'End') n = tabs[tabs.length - 1];
        if (n) { e.preventDefault(); pick(n, true); }
      });
    });
  }

  /* Event-readiness checklist */
  var list = document.getElementById('mfChecklist');
  if (list) {
    var boxes = [].slice.call(list.querySelectorAll('input'));
    var bar = document.getElementById('mfBar');
    var out = document.getElementById('mfStatus');
    var update = function () {
      var done = boxes.filter(function (b) { return b.checked; }).length;
      bar.value = done;
      out.textContent = done === boxes.length ? 'All clear: ready to go!' : done + ' of ' + boxes.length + ' checks done';
    };
    boxes.forEach(function (b) { b.addEventListener('change', update); });
    var reset = document.getElementById('mfReset');
    if (reset) reset.addEventListener('click', function () {
      boxes.forEach(function (b) { b.checked = false; });
      update();
    });
  }

  /* How the priorities connect */
  var nodes = [].slice.call(document.querySelectorAll('.mf-node'));
  var note = document.getElementById('mfNote');
  if (nodes.length && note) {
    nodes.forEach(function (n) {
      n.addEventListener('click', function () {
        var links = (n.getAttribute('data-links') || '').split(',');
        nodes.forEach(function (m) {
          m.setAttribute('aria-pressed', m === n ? 'true' : 'false');
          m.classList.toggle('linked', links.indexOf(m.getAttribute('data-id')) > -1);
        });
        note.textContent = n.getAttribute('data-note');
      });
    });
  }
}

/* ---- STEP 2: add this line inside your existing DOMContentLoaded block, with the other init calls ---- */
/* initManifesto(); */

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

// ---- Stickerville: tap-to-show explainer on touch devices ----
function initStickerTaps() {
  const stickers = document.querySelectorAll('.sticker');
  if (!stickers.length) return;

  document.addEventListener('click', (e) => {
    const sticker = e.target.closest('.sticker');
    stickers.forEach((s) => {
      if (s !== sticker) s.classList.remove('show-explainer');
    });
    if (sticker && !e.target.closest('.sticker-download')) {
      sticker.classList.toggle('show-explainer');
    }
  });
}

// ---- Stickerville: zip every sticker client-side and download it ----
function initStickerDownloadAll() {
  const btn = document.getElementById('downloadAllBtn');
  if (!btn) return;

  btn.addEventListener('click', async () => {
    if (typeof JSZip === 'undefined') return;
    const links = document.querySelectorAll('[data-sticker-file]');
    const zip = new JSZip();
    btn.disabled = true;
    const originalText = btn.textContent;
    btn.textContent = 'Zipping...';

    await Promise.all(Array.from(links).map(async (link) => {
      const url = link.getAttribute('href');
      const filename = url.split('/').pop();
      try {
        const resp = await fetch(url);
        const blob = await resp.blob();
        zip.file(filename, blob);
      } catch (err) {
        console.error('Could not add', url, err);
      }
    }));

    const content = await zip.generateAsync({ type: 'blob' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(content);
    a.download = 'stickerville-stickers.zip';
    a.click();
    URL.revokeObjectURL(a.href);

    btn.disabled = false;
    btn.textContent = originalText;
  });
}

// Paste this whole file at the very END of js/main.js

function initManifestoExtras() {
  var calm = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Declassified headline: starts covered, lifts off, tap to cover/uncover */
  var h = document.querySelector('.mf-redact');
  if (h) {
    if (!calm) { h.classList.add('redacted'); setTimeout(function () { h.classList.remove('redacted'); }, 800); }
    h.addEventListener('click', function () { h.classList.toggle('redacted'); });
  }

  /* Clearance tracker */
  var tabs = [].slice.call(document.querySelectorAll('.mf-tab'));
  var txt = document.getElementById('mfClearTxt');
  if (tabs.length && txt) {
    var bar = document.getElementById('mfClearBar'), brief = document.getElementById('mfBriefed');
    var seen = { 'tab-1': true };
    var show = function () {
      var n = Object.keys(seen).length;
      bar.value = n;
      txt.textContent = 'Clearance level: ' + n + ' of 5 priorities read';
      brief.classList.toggle('show', n === 5);
    };
    tabs.forEach(function (t) {
      var mark = function () { seen[t.id] = true; show(); };
      t.addEventListener('click', mark);
      t.addEventListener('focus', mark);
    });
  }

  /* APPROVED stamp on the checklist */
  var list = document.getElementById('mfChecklist'), ap = document.getElementById('mfApproved');
  if (list && ap) {
    var boxes = [].slice.call(list.querySelectorAll('input'));
    var check = function () { ap.classList.toggle('show', boxes.every(function (b) { return b.checked; })); };
    boxes.forEach(function (b) { b.addEventListener('change', check); });
    var reset = document.getElementById('mfReset');
    if (reset) reset.addEventListener('click', function () { setTimeout(check, 0); });
  }

  /* "What if the tech person is away?" */
  var away = document.getElementById('mfAway');
  if (away) {
    var docs = document.getElementById('mfDocs'), msg = document.getElementById('mfAwayMsg');
    var cards = [].slice.call(away.querySelectorAll('.mf-member'));
    var render = function () {
      var gone = 0;
      cards.forEach(function (c) {
        var out = c.getAttribute('aria-pressed') === 'true';
        var st = c.querySelector('.mf-task-state');
        c.classList.remove('gone', 'stalled', 'covered');
        if (!out) { st.textContent = 'On track'; return; }
        gone++;
        c.classList.add('gone', docs.checked ? 'covered' : 'stalled');
        st.textContent = docs.checked ? 'Covered: the task is documented' : 'Stalled: only they knew how';
      });
      msg.textContent = gone === 0 ? 'Everyone is here. Tap a member to send them away.'
        : docs.checked ? 'Someone is away, but the documented tasks keep moving.'
        : 'Someone is away and their task is stuck.';
    };
    cards.forEach(function (c) {
      c.addEventListener('click', function () {
        c.setAttribute('aria-pressed', c.getAttribute('aria-pressed') === 'true' ? 'false' : 'true');
        render();
      });
    });
    docs.addEventListener('change', render);
  }
}

function initSuggest() {
  var box = document.getElementById('mfSuggest');
  var btn = document.getElementById('mfSuggestBtn');
  if (!box || !btn) return;
  box.classList.add('js-on');
  var set = function (open) {
    box.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
  };
  btn.addEventListener('click', function () { set(!box.classList.contains('open')); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && box.classList.contains('open')) { set(false); btn.focus(); }
  });
  document.addEventListener('click', function (e) {
    if (!box.contains(e.target)) set(false);
  });
}

document.addEventListener('DOMContentLoaded', function () {
  initManifestoExtras();
  initSuggest();
});