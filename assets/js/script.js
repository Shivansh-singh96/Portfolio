'use strict';

/* =============================================
   UTILITY
   ============================================= */
const elemToggleFunc = (elem) => elem.classList.toggle('active');

/* =============================================
   HEADER STICKY & GO TO TOP
   ============================================= */
const header   = document.querySelector('[data-header]');
const goTopBtn = document.querySelector('[data-go-top]');

window.addEventListener('scroll', () => {
  if (window.scrollY >= 10) {
    header.classList.add('active');
    goTopBtn.classList.add('active');
  } else {
    header.classList.remove('active');
    goTopBtn.classList.remove('active');
  }
  updateActiveNav();
});

/* =============================================
   NAVBAR TOGGLE
   ============================================= */
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

/* =============================================
   ACTIVE NAV LINK ON SCROLL
   ============================================= */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.navbar-link');

function updateActiveNav() {
  const scrollY = window.scrollY + 120;
  sections.forEach(section => {
    const top    = section.offsetTop;
    const height = section.offsetHeight;
    const id     = section.getAttribute('id');
    const link   = document.querySelector('.navbar-link[href="#' + id + '"]');
    if (link) {
      if (scrollY >= top && scrollY < top + height) {
        navLinks.forEach(l => l.classList.remove('active-link'));
        link.classList.add('active-link');
      }
    }
  });
}

/* =============================================
   SKILLS TOGGLE
   ============================================= */
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

/* =============================================
   DARK / LIGHT THEME TOGGLE
   ============================================= */
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

/* =============================================
   TYPEWRITER EFFECT
   ============================================= */
const typeTarget = document.querySelector('[data-typewriter]');
if (typeTarget) {
  const words    = JSON.parse(typeTarget.getAttribute('data-typewriter'));
  let wi         = 0, ci = 0, deleting = false;
  const SPEED_T  = 90, SPEED_D = 50, PAUSE = 1800;
  function type() {
    const word    = words[wi];
    const current = deleting ? word.slice(0, ci--) : word.slice(0, ci++);
    typeTarget.textContent = current;
    if (!deleting && ci > word.length) { deleting = true; setTimeout(type, PAUSE); return; }
    if (deleting && ci < 0)            { deleting = false; wi = (wi + 1) % words.length; ci = 0; }
    setTimeout(type, deleting ? SPEED_D : SPEED_T);
  }
  type();
}

/* =============================================
   SCROLL-REVEAL
   ============================================= */
const revealEls      = document.querySelectorAll('[data-reveal]');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

revealEls.forEach((el, i) => {
  const delay = el.dataset.revealDelay || (i % 6) * 80;
  el.style.transitionDelay = delay + 'ms';
  revealObserver.observe(el);
});

/* =============================================
   ANIMATED COUNTER
   ============================================= */
const counters        = document.querySelectorAll('[data-counter]');
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el     = entry.target;
    const target = +el.getAttribute('data-counter');
    const suffix = el.getAttribute('data-suffix') || '';
    const dur    = 1400;
    const step   = target / (dur / 16);
    let current  = 0;
    const tick   = () => {
      current = Math.min(current + step, target);
      el.textContent = Math.floor(current) + suffix;
      if (current < target) requestAnimationFrame(tick);
    };
    tick();
    counterObserver.unobserve(el);
  });
}, { threshold: 0.5 });
counters.forEach(c => counterObserver.observe(c));

/* =============================================
   SKILL BAR ANIMATION
   ============================================= */
const skillBars   = document.querySelectorAll('[data-skill-bar]');
const barObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.style.width = entry.target.getAttribute('data-skill-bar') + '%';
    barObserver.unobserve(entry.target);
  });
}, { threshold: 0.3 });
skillBars.forEach(b => barObserver.observe(b));

/* =============================================
   CURSOR GLOW
   ============================================= */
const cursorGlow = document.querySelector('.cursor-glow');
if (cursorGlow && window.matchMedia('(hover:hover)').matches) {
  document.addEventListener('mousemove', e => {
    cursorGlow.style.transform = 'translate(' + (e.clientX - 150) + 'px,' + (e.clientY - 150) + 'px)';
  });
}

/* =============================================
   RIPPLE ON BUTTONS
   ============================================= */
document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('click', function(e) {
    const ripple = document.createElement('span');
    ripple.className = 'btn-ripple';
    const rect   = this.getBoundingClientRect();
    ripple.style.left = (e.clientX - rect.left) + 'px';
    ripple.style.top  = (e.clientY - rect.top)  + 'px';
    this.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  });
});

/* =============================================
   PARTICLES (hero background)
   ============================================= */
const canvas = document.getElementById('hero-particles');
if (canvas) {
  const ctx = canvas.getContext('2d');
  let particles = [];
  function resizeCanvas() { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; }
  resizeCanvas();
  window.addEventListener('resize', () => { resizeCanvas(); particles = []; init(); });

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.r = Math.random() * 1.8 + 0.4;
      this.dx = (Math.random() - 0.5) * 0.35;
      this.dy = (Math.random() - 0.5) * 0.35;
      this.a = Math.random() * 0.5 + 0.2;
    }
    update() {
      this.x += this.dx; this.y += this.dy;
      if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) this.reset();
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = 'hsla(24,74%,58%,' + this.a + ')';
      ctx.fill();
    }
  }

  function init() {
    const count = Math.floor((canvas.width * canvas.height) / 8000);
    for (let i = 0; i < count; i++) particles.push(new Particle());
  }

  function connectParticles() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const d = Math.hypot(particles[i].x - particles[j].x, particles[i].y - particles[j].y);
        if (d < 100) {
          ctx.beginPath();
          ctx.strokeStyle = 'hsla(24,74%,58%,' + (0.12 * (1 - d / 100)) + ')';
          ctx.lineWidth = 0.5;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    connectParticles();
    requestAnimationFrame(animate);
  }
  init(); animate();
}
