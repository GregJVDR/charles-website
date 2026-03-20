// Custom cursor
const cursor = document.getElementById('cursor');
const trail = document.getElementById('cursorTrail');
let mx = 0, my = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  cursor.style.left = mx + 'px';
  cursor.style.top = my + 'px';
  setTimeout(() => {
    trail.style.left = mx + 'px';
    trail.style.top = my + 'px';
  }, 80);
});

document.querySelectorAll('a, button').forEach(el => {
  el.addEventListener('mouseenter', () => cursor.style.transform = 'translate(-50%,-50%) scale(2.5)');
  el.addEventListener('mouseleave', () => cursor.style.transform = 'translate(-50%,-50%) scale(1)');
});

// Nav scroll
const nav = document.getElementById('mainNav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
});

// Scroll reveal
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(r => observer.observe(r));

// Parallax on ambient busts
const bustLeft  = document.querySelector('.ambient-bust-left');
const bustRight = document.querySelector('.ambient-bust-right');
window.addEventListener('scroll', () => {
  const y = window.scrollY;
  if (bustLeft)  bustLeft.style.transform  = `translateY(${y * 0.06}px)`;
  if (bustRight) bustRight.style.transform = `translateY(${-y * 0.04}px)`;
});
