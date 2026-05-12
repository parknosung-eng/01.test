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

/* === Google Sign-In (GIS) === */
const GOOGLE_CLIENT_ID =
  document.querySelector('meta[name="google-signin-client_id"]')?.content
  || 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com';

const STORAGE_KEY = 'blaze.user';

const signInBtn = document.getElementById('signInBtn');
const signOutBtn = document.getElementById('signOutBtn');
const authUser = document.getElementById('authUser');
const authAvatar = document.getElementById('authAvatar');
const authName = document.getElementById('authName');

function decodeJwt(token) {
  const [, payload] = token.split('.');
  const json = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
  return JSON.parse(decodeURIComponent(escape(json)));
}

function renderUser(user) {
  if (!user) {
    authUser.hidden = true;
    signInBtn.hidden = false;
    return;
  }
  authAvatar.src = user.picture || '';
  authAvatar.alt = user.name || '';
  authName.textContent = user.name || user.email || 'Signed in';
  authUser.hidden = false;
  signInBtn.hidden = true;
}

function handleCredentialResponse(response) {
  try {
    const claims = decodeJwt(response.credential);
    const user = {
      name: claims.name,
      email: claims.email,
      picture: claims.picture,
      sub: claims.sub,
    };
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    renderUser(user);
  } catch (err) {
    console.error('Google sign-in failed:', err);
  }
}

function initGoogleAuth() {
  if (!window.google?.accounts?.id) return false;
  if (GOOGLE_CLIENT_ID.startsWith('YOUR_GOOGLE_CLIENT_ID')) {
    signInBtn.addEventListener('click', () => {
      alert('Google Client ID가 설정되지 않았습니다.\nindex.html의 meta[name="google-signin-client_id"] content 값을 발급받은 Client ID로 교체하세요.');
    });
    return true;
  }
  window.google.accounts.id.initialize({
    client_id: GOOGLE_CLIENT_ID,
    callback: handleCredentialResponse,
    auto_select: false,
    cancel_on_tap_outside: true,
  });
  signInBtn.addEventListener('click', () => {
    window.google.accounts.id.prompt();
  });
  return true;
}

function waitForGoogle() {
  if (initGoogleAuth()) return;
  const id = setInterval(() => {
    if (initGoogleAuth()) clearInterval(id);
  }, 200);
  setTimeout(() => clearInterval(id), 8000);
}

signOutBtn.addEventListener('click', () => {
  sessionStorage.removeItem(STORAGE_KEY);
  if (window.google?.accounts?.id) {
    window.google.accounts.id.disableAutoSelect();
  }
  renderUser(null);
});

try {
  const cached = sessionStorage.getItem(STORAGE_KEY);
  if (cached) renderUser(JSON.parse(cached));
} catch {}

waitForGoogle();
