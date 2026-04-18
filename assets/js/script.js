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
   STACKED CARD SCROLL ANIMATION
   Paste this entire block at the bottom of script.js
   ================================================ */
(function () {
  const STICKY_TOP  = 70;   // must match CSS  top: 70px
  const SCALE_STEP  = 0.04; // each buried card shrinks by this
  const Y_STEP      = 8;    // px upward nudge per buried card
  const DIM_STEP    = 0.11; // brightness reduction per buried card
  const MIN_SCALE   = 0.80;
  const MIN_BRIGHT  = 0.50;

  function updateStacks() {
    document.querySelectorAll('.stack-scene').forEach(scene => {
      const cards = Array.from(scene.querySelectorAll('.s-card'));
      if (!cards.length) return;

      cards.forEach((card, i) => {
        const rect = card.getBoundingClientRect();

        if (rect.top > STICKY_TOP + 2) {
          card.style.transform = '';
          card.style.filter    = '';
          return;
        }

        // Count how deeply this card is buried under later cards
        let buried = 0;
        for (let j = i + 1; j < cards.length; j++) {
          const nr = cards[j].getBoundingClientRect();
          if (nr.top <= STICKY_TOP + 2) {
            buried++;
          } else {
            // Partially arrived — interpolate
            const overlap = STICKY_TOP - nr.top;
            const h = cards[j].offsetHeight || 400;
            buried += Math.max(0, Math.min(1, overlap / h));
            break;
          }
        }

        const scale  = Math.max(MIN_SCALE,  1 - buried * SCALE_STEP).toFixed(4);
        const bright = Math.max(MIN_BRIGHT, 1 - buried * DIM_STEP).toFixed(4);
        const yPush  = -(buried * Y_STEP).toFixed(2);

        card.style.transform = `scale(${scale}) translateY(${yPush}px)`;
        card.style.filter    = buried > 0.05 ? `brightness(${bright})` : '';
      });
    });
  }

  // Give each scene enough scroll height so every card gets its moment
  function setSceneHeights() {
    document.querySelectorAll('.stack-scene').forEach(scene => {
      const cards = Array.from(scene.querySelectorAll('.s-card'));
      if (!cards.length) return;
      const cardH   = cards[0].offsetHeight || 420;
      const scrollH = cardH * 0.75; // scroll distance per card
      scene.style.height = (cards.length * scrollH + cardH + STICKY_TOP + 80) + 'px';
    });
  }

  setSceneHeights();
  updateStacks();
  window.addEventListener('scroll', updateStacks, { passive: true });
  window.addEventListener('resize', () => { setSceneHeights(); updateStacks(); });
})();