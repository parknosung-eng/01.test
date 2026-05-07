/* Custom cursor */
const cursor = document.getElementById('cursor');
const cursorDot = document.getElementById('cursorDot');
let cx = window.innerWidth / 2, cy = window.innerHeight / 2;
let tx = cx, ty = cy;

window.addEventListener('mousemove', (e) => {
  tx = e.clientX; ty = e.clientY;
  cursorDot.style.transform = `translate(${tx}px, ${ty}px) translate(-50%, -50%)`;
});

function tick() {
  cx += (tx - cx) * 0.18;
  cy += (ty - cy) * 0.18;
  cursor.style.transform = `translate(${cx}px, ${cy}px) translate(-50%, -50%)`;
  requestAnimationFrame(tick);
}
tick();

document.querySelectorAll('a, button, .card, .g-item, .pill').forEach(el => {
  el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
  el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
});

/* Nav scroll state */
const nav = document.getElementById('nav');
const onScroll = () => {
  if (window.scrollY > 60) nav.classList.add('scrolled');
  else nav.classList.remove('scrolled');
};
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* Hero parallax */
const heroImg = document.querySelector('.hero-img');
const hero = document.getElementById('hero');
hero.addEventListener('mousemove', (e) => {
  const rect = hero.getBoundingClientRect();
  const x = (e.clientX / rect.width - 0.5) * 16;
  const y = (e.clientY / rect.height - 0.5) * 16;
  heroImg.style.transform = `scale(1.06) translate(${-x}px, ${-y}px)`;
});
hero.addEventListener('mouseleave', () => {
  heroImg.style.transform = '';
});

/* Scroll-driven hero parallax (vertical) */
window.addEventListener('scroll', () => {
  const y = window.scrollY;
  if (y < window.innerHeight) {
    heroImg.style.translate = `0 ${y * 0.25}px`;
  }
}, { passive: true });

/* Mute toggle (visual only) */
const muteBtn = document.getElementById('muteBtn');
muteBtn.addEventListener('click', () => {
  muteBtn.classList.toggle('active');
});

/* 3D tilt on cards */
document.querySelectorAll('[data-tilt]').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const r = card.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    const rx = (py - 0.5) * -10;
    const ry = (px - 0.5) * 10;
    card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-6px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

/* Reveal on scroll */
const fadeTargets = document.querySelectorAll(
  '.section-head, .card, .about-text, .about-media, .g-item, .cta'
);
fadeTargets.forEach(el => el.classList.add('fade'));

const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('in');
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.15 });

fadeTargets.forEach(el => io.observe(el));

/* Smooth nav-link active state */
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', (e) => {
    const href = link.getAttribute('href');
    if (href && href.startsWith('#')) {
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  });
});
