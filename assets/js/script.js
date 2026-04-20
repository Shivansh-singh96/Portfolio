'use strict';

const elemToggleFunc = (elem) => elem.classList.toggle('active');

/* HEADER + GO TO TOP */
const header   = document.querySelector('[data-header]');
const goTopBtn = document.querySelector('[data-go-top]');
window.addEventListener('scroll', () => {
  const active = window.scrollY >= 10;
  header.classList.toggle('active', active);
  goTopBtn.classList.toggle('active', active);
  updateActiveNav();
});

/* NAVBAR TOGGLE */
const navToggleBtn = document.querySelector('[data-nav-toggle-btn]');
const navbar       = document.querySelector('[data-navbar]');
navToggleBtn.addEventListener('click', () => {
  elemToggleFunc(navToggleBtn);
  elemToggleFunc(navbar);
  elemToggleFunc(document.body);
});
document.querySelectorAll('.navbar-link').forEach(link => {
  link.addEventListener('click', () => {
    navbar.classList.remove('active');
    navToggleBtn.classList.remove('active');
    document.body.classList.remove('active');
  });
});

/* ACTIVE NAV ON SCROLL */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.navbar-link');
function updateActiveNav() {
  const scrollY = window.scrollY + 120;
  sections.forEach(section => {
    const id   = section.getAttribute('id');
    const link = document.querySelector('.navbar-link[href="#' + id + '"]');
    if (link && scrollY >= section.offsetTop && scrollY < section.offsetTop + section.offsetHeight) {
      navLinks.forEach(l => l.classList.remove('active-link'));
      link.classList.add('active-link');
    }
  });
}

/* SKILLS TOGGLE */
const toggleBtnBox = document.querySelector('[data-toggle-box]');
const toggleBtns   = document.querySelectorAll('[data-toggle-btn]');
const skillsBox    = document.querySelector('[data-skills-box]');
toggleBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    elemToggleFunc(toggleBtnBox);
    toggleBtns.forEach(b => elemToggleFunc(b));
    elemToggleFunc(skillsBox);
  });
});

/* THEME TOGGLE */
const themeToggleBtn = document.querySelector('[data-theme-btn]');
themeToggleBtn.addEventListener('click', () => {
  elemToggleFunc(themeToggleBtn);
  if (themeToggleBtn.classList.contains('active')) {
    document.body.classList.remove('dark_theme');
    document.body.classList.add('light_theme');
    localStorage.setItem('theme', 'light_theme');
  } else {
    document.body.classList.add('dark_theme');
    document.body.classList.remove('light_theme');
    localStorage.setItem('theme', 'dark_theme');
  }
});
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'light_theme') {
  themeToggleBtn.classList.add('active');
  document.body.classList.add('light_theme');
  document.body.classList.remove('dark_theme');
} else {
  themeToggleBtn.classList.remove('active');
  document.body.classList.add('dark_theme');
  document.body.classList.remove('light_theme');
  localStorage.setItem('theme', 'dark_theme');
}

/* TYPEWRITER */
const typeTarget = document.querySelector('[data-typewriter]');
if (typeTarget) {
  const words = JSON.parse(typeTarget.getAttribute('data-typewriter'));
  let wi = 0, ci = 0, deleting = false;
  function type() {
    const word = words[wi];
    typeTarget.textContent = deleting ? word.slice(0, ci--) : word.slice(0, ci++);
    if (!deleting && ci > word.length) { deleting = true; setTimeout(type, 1800); return; }
    if (deleting && ci < 0) { deleting = false; wi = (wi + 1) % words.length; ci = 0; }
    setTimeout(type, deleting ? 50 : 90);
  }
  type();
}

/* =============================================
   SCROLL-REVEAL  ← THIS IS THE KEY FIX
   Reveals elements immediately on page load if
   already in viewport, and on scroll otherwise.
   Falls back to showing all instantly if no IO.
   ============================================= */
const allReveal = document.querySelectorAll('[data-reveal]');

function revealElement(el) {
  const delay = parseInt(el.dataset.revealDelay || 0, 10);
  setTimeout(() => el.classList.add('revealed'), delay);
}

if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        revealElement(entry.target);
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.06, rootMargin: '0px 0px -30px 0px' });

  allReveal.forEach(el => io.observe(el));

  // Hard fallback: reveal anything still hidden after 2.5s
  setTimeout(() => {
    allReveal.forEach(el => { if (!el.classList.contains('revealed')) el.classList.add('revealed'); });
  }, 2500);
} else {
  // Browser doesn't support IO — show everything right away
  allReveal.forEach(el => el.classList.add('revealed'));
}

/* ANIMATED COUNTERS */
const cntIO = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = +el.getAttribute('data-counter');
    const suffix = el.getAttribute('data-suffix') || '';
    const step = target / (1400 / 16);
    let cur = 0;
    const tick = () => {
      cur = Math.min(cur + step, target);
      el.textContent = Math.floor(cur) + suffix;
      if (cur < target) requestAnimationFrame(tick);
    };
    tick();
    cntIO.unobserve(el);
  });
}, { threshold: 0.5 });
document.querySelectorAll('[data-counter]').forEach(c => cntIO.observe(c));

/* SKILL BARS */
const barIO = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.style.width = entry.target.getAttribute('data-skill-bar') + '%';
    barIO.unobserve(entry.target);
  });
}, { threshold: 0.3 });
document.querySelectorAll('[data-skill-bar]').forEach(b => barIO.observe(b));

/* CURSOR GLOW */
const cursorGlow = document.querySelector('.cursor-glow');
if (cursorGlow && window.matchMedia('(hover:hover)').matches) {
  document.addEventListener('mousemove', e => {
    cursorGlow.style.transform = 'translate(' + (e.clientX - 150) + 'px,' + (e.clientY - 150) + 'px)';
  });
}

/* BUTTON RIPPLE */
document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('click', function(e) {
    const r = document.createElement('span');
    r.className = 'btn-ripple';
    const rect = this.getBoundingClientRect();
    r.style.left = (e.clientX - rect.left) + 'px';
    r.style.top  = (e.clientY - rect.top) + 'px';
    this.appendChild(r);
    setTimeout(() => r.remove(), 600);
  });
});

/* HERO PARTICLES */
const canvas = document.getElementById('hero-particles');
if (canvas) {
  const ctx = canvas.getContext('2d');
  let P = [];
  function resize() { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; }
  resize();
  window.addEventListener('resize', () => { resize(); P = []; init(); });
  class Dot {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * canvas.width; this.y = Math.random() * canvas.height;
      this.r = Math.random() * 1.8 + 0.4;
      this.dx = (Math.random() - 0.5) * 0.35; this.dy = (Math.random() - 0.5) * 0.35;
      this.a = Math.random() * 0.5 + 0.2;
    }
    update() {
      this.x += this.dx; this.y += this.dy;
      if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) this.reset();
    }
    draw() {
      ctx.beginPath(); ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = 'hsla(24,74%,58%,' + this.a + ')'; ctx.fill();
    }
  }
  function init() { P = []; for (let i = 0; i < Math.floor(canvas.width * canvas.height / 8000); i++) P.push(new Dot()); }
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    P.forEach(p => { p.update(); p.draw(); });
    for (let i = 0; i < P.length; i++) for (let j = i + 1; j < P.length; j++) {
      const d = Math.hypot(P[i].x - P[j].x, P[i].y - P[j].y);
      if (d < 100) { ctx.beginPath(); ctx.strokeStyle = 'hsla(24,74%,58%,' + (0.12 * (1 - d / 100)) + ')'; ctx.lineWidth = 0.5; ctx.moveTo(P[i].x, P[i].y); ctx.lineTo(P[j].x, P[j].y); ctx.stroke(); }
    }
    requestAnimationFrame(draw);
  }
  init(); draw();
}

/* ================================================
   STACKED CARD SCROLL — LEFT TEXT / RIGHT DECK
   RAF + lerp for silky smooth animation
   ================================================ */
(function () {
  const SCROLL_PER = 440;   // px per card dismissal
  const ROTATE_DEG = 11;    // degrees per depth level
  const LERP_EASE  = 0.10;  // lower = smoother/more lag, higher = snappier

  var sections = [];   // { el, cards, target, current }

  function smoothstep(t) { return t * t * (3 - 2 * t); }
  function lerp(a, b, t) { return a + (b - a) * t; }

  function init() {
    sections = [];
    document.querySelectorAll('.stack-split-section').forEach(function (section) {
      var cards = Array.from(section.querySelectorAll('.s-card'));
      if (!cards.length) return;
      section.style.height =
        (window.innerHeight - 70 + cards.length * SCROLL_PER) + 'px';
      sections.push({ el: section, cards: cards, target: 0, current: 0 });
    });
  }

  function applyPositions(cards, progress) {
    var n = cards.length;
    cards.forEach(function (card, i) {
      var p = progress - i; // <0 waiting, 0-1 flying out, >1 gone

      if (p >= 1) {
        card.style.cssText =
          'transform-origin:bottom left;' +
          'transform:translateY(-120%) rotate(-55deg);' +
          'opacity:0;visibility:hidden;' +
          'z-index:' + (n + i) + ';pointer-events:none;';

      } else if (p > 0) {
        var t  = smoothstep(p);
        var ty = -120 * t;
        var r  = -55  * t;
        card.style.cssText =
          'transform-origin:bottom left;' +
          'transform:translateY(' + ty + '%) rotate(' + r + 'deg);' +
          'opacity:' + (1 - t) + ';visibility:visible;' +
          'z-index:' + (n * 2) + ';pointer-events:none;';

      } else {
        var depth   = Math.max(0, -p);
        var capped  = Math.min(depth, 3);
        var rot     = -(capped * ROTATE_DEG);
        card.style.cssText =
          'transform-origin:bottom center;' +
          'transform:rotate(' + rot + 'deg);' +
          'opacity:1;visibility:visible;' +
          'z-index:' + Math.round(n - depth + 10) + ';' +
          'pointer-events:' + (depth < 0.5 ? 'auto' : 'none') + ';';
      }
    });
  }

  var rafId = null;

  function tick() {
    var needsUpdate = false;
    sections.forEach(function (s) {
      var scrolledIn = Math.max(0, -s.el.getBoundingClientRect().top);
      s.target = scrolledIn / SCROLL_PER;

      // Lerp current toward target each frame
      var next = lerp(s.current, s.target, LERP_EASE);
      if (Math.abs(next - s.current) > 0.0005) {
        s.current = next;
        needsUpdate = true;
      } else {
        s.current = s.target; // snap when close enough
      }
      applyPositions(s.cards, s.current);
    });

    rafId = requestAnimationFrame(tick);
  }

  function start() {
    if (!rafId) rafId = requestAnimationFrame(tick);
  }

  if (document.readyState === 'complete') { init(); start(); }
  else { window.addEventListener('load', function () { init(); start(); }); }

  window.addEventListener('resize', function () {
    init();   // recalculate heights
  });
}());