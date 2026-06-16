// ═══════════════════════════════════════════════
//  CONFIGURATION
// ═══════════════════════════════════════════════
const SUPABASE_URL    = 'https://elzpqfcnfneasabcqnte.supabase.co';
const SUPABASE_ANON   = 'sb_publishable_V82l5FaB0D7fLq3BRQhCIQ_F7XhTMNd';
const EMAILJS_SERVICE  = 'service_qj6fbsw';
const EMAILJS_TEMPLATE = 'template_7mb8rpr';
const EMAILJS_KEY      = 'H1Q5-s2VlLuV-Lze8';
const COACH_EMAIL      = 'charlesmachadopro@gmail.com';

// ═══════════════════════════════════════════════
//  INIT
// ═══════════════════════════════════════════════
let sb = null;
let currentUser = null;

function showPanel(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.style.display = 'block';
}

function initBookingReveal() {
  const wrapper = document.querySelector('.booking-wrapper');
  if (!wrapper) return;

  const hide = () => {
    wrapper.style.opacity   = '0';
    wrapper.style.transform = 'scale(0.9) translateY(60px)';
    wrapper.style.filter    = 'blur(16px)';
    wrapper.style.transition = 'none';
  };

  const show = () => {
    wrapper.style.transition = 'opacity 0.9s cubic-bezier(0.34,1.56,0.64,1), transform 0.9s cubic-bezier(0.34,1.56,0.64,1), filter 0.55s ease';
    wrapper.style.opacity    = '1';
    wrapper.style.transform  = 'scale(1) translateY(0)';
    wrapper.style.filter     = 'blur(0px)';
  };

  hide();

  const obs = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      obs.disconnect();
      requestAnimationFrame(() => requestAnimationFrame(show));
    }
  }, { threshold: 0.18 });

  obs.observe(wrapper);
}

async function initApp() {
  // Safety timeout — never block UI more than 3s
  const loadingTimeout = setTimeout(() => {
    const loading = document.getElementById('dbLoading');
    const auth    = document.getElementById('authContainer');
    if (loading && loading.style.display !== 'none') {
      loading.style.display = 'none';
      if (auth) showPanel('authContainer');
    }
  }, 3000);

  if (typeof supabase !== 'undefined' && SUPABASE_URL.includes('supabase.co')) {
    try {
      sb = supabase.createClient(SUPABASE_URL, SUPABASE_ANON);
      console.log('✅ Supabase connected');
    } catch(e) { console.warn('Supabase init error:', e); }
  }

  const saved = sessionStorage.getItem('cm_user');
  if (saved) {
    try { currentUser = JSON.parse(saved); clearTimeout(loadingTimeout); onLogin(currentUser); return; } catch {}
  }
  clearTimeout(loadingTimeout);
  document.getElementById('dbLoading').style.display = 'none';
  showPanel('authContainer');
}

window.addEventListener('DOMContentLoaded', () => {
  initApp();
  initNav();
  initReveal();
  initCountUp();
  initParticles();
  initCarousel();
  initBeforeAfter();
  initSwipeSlider();
  initBookingReveal();
  initFormationCards();
  initCursorGlow();
  initScrollProgress();
  initTilt3D();
  initMagnetic();
  initParallax();
  initRipple();
});

// ═══════════════════════════════════════════════
//  COMPARATEUR AVANT / APRÈS (swipe)
// ═══════════════════════════════════════════════
function initBeforeAfter() {
  document.querySelectorAll('[data-ba]').forEach(slider => {
    const before  = slider.querySelector('.ba-before');
    const divider = slider.querySelector('.ba-divider');
    if (!before || !divider) return;

    let dragging = false;

    const setPercent = (pos) => {
      pos = Math.max(0, Math.min(100, pos));
      before.style.clipPath = `inset(0 ${100 - pos}% 0 0)`;
      divider.style.left = pos + '%';
    };
    const setFromX = (clientX) => {
      const rect = slider.getBoundingClientRect();
      setPercent(((clientX - rect.left) / rect.width) * 100);
    };

    slider.addEventListener('pointerdown', (e) => {
      dragging = true;
      slider.classList.add('ba-active');
      slider.classList.remove('ba-sweep'); // l'utilisateur prend la main
      slider.setPointerCapture(e.pointerId);
      setFromX(e.clientX);
    });
    slider.addEventListener('pointermove', (e) => { if (dragging) setFromX(e.clientX); });
    const stop = () => { dragging = false; slider.classList.remove('ba-active'); };
    slider.addEventListener('pointerup', stop);
    slider.addEventListener('pointercancel', stop);

    // position initiale au milieu
    setPercent(50);

    // Démo automatique au scroll (une seule fois)
    const io = new IntersectionObserver((entries) => {
      if (!entries[0].isIntersecting) return;
      io.disconnect();
      if (dragging) return;
      slider.classList.add('ba-sweep');
      const seq = [82, 18, 50];
      let i = 0;
      const run = () => {
        if (dragging) { slider.classList.remove('ba-sweep'); return; }
        setPercent(seq[i]);
        i++;
        if (i < seq.length) setTimeout(run, 850);
        else setTimeout(() => slider.classList.remove('ba-sweep'), 900);
      };
      setTimeout(run, 350);
    }, { threshold: 0.4 });
    io.observe(slider);
  });
}

// ═══════════════════════════════════════════════
//  CAROUSEL HYROX
// ═══════════════════════════════════════════════
function initCarousel() {
  const frame = document.getElementById('hyroxCarousel');
  if (!frame) return;

  const slides = Array.from(frame.querySelectorAll('.carousel-slide'));
  const dotsContainer = document.getElementById('hyroxDots');
  const prevBtn = frame.querySelector('.carousel-prev');
  const nextBtn = frame.querySelector('.carousel-next');

  let current = 0;
  let timer = null;

  // Ordre aléatoire des photos à chaque chargement (Fisher-Yates).
  // On réinsère les slides AVANT les contrôles pour préserver l'empilement.
  for (let i = slides.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [slides[i], slides[j]] = [slides[j], slides[i]];
  }
  slides.forEach(slide => {
    slide.classList.remove('active');
    frame.insertBefore(slide, prevBtn);
  });
  slides[0].classList.add('active');

  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', 'Photo ' + (i + 1));
    dot.addEventListener('click', () => { goTo(i); resetTimer(); });
    dotsContainer.appendChild(dot);
  });

  function goTo(n) {
    slides[current].classList.remove('active');
    dotsContainer.children[current].classList.remove('active');
    current = (n + slides.length) % slides.length;
    slides[current].classList.add('active');
    dotsContainer.children[current].classList.add('active');
  }

  function resetTimer() {
    clearInterval(timer);
    timer = setInterval(() => goTo(current + 1), 4000);
  }

  prevBtn.addEventListener('click', () => { goTo(current - 1); resetTimer(); });
  nextBtn.addEventListener('click', () => { goTo(current + 1); resetTimer(); });

  frame.addEventListener('mouseenter', () => clearInterval(timer));
  frame.addEventListener('mouseleave', () => resetTimer());

  resetTimer();
}

// ═══════════════════════════════════════════════
//  FORMATION CARDS — ENTRÉE DEPUIS LE BAS
// ═══════════════════════════════════════════════
function initFormationCards() {
  const cards = document.querySelectorAll('.formations-grid .formation-card');
  if (!cards.length) return;

  cards.forEach(card => { card.style.opacity = '0'; });

  const obs = new IntersectionObserver(entries => {
    if (!entries[0].isIntersecting) return;
    obs.disconnect();
    cards.forEach((card, i) => {
      card.style.animationDelay = `${i * 130}ms`;
      card.classList.add('card-entering');
      card.addEventListener('animationend', () => {
        card.style.opacity = '';
        card.style.animationDelay = '';
        card.classList.remove('card-entering');
      }, { once: true });
    });
  }, { threshold: 0.1 });

  obs.observe(document.querySelector('.formations-grid'));
}

// ═══════════════════════════════════════════════
//  CURSOR GLOW (formations section uniquement)
// ═══════════════════════════════════════════════
function initCursorGlow() {
  const glow       = document.getElementById('cursorGlow');
  const formations = document.getElementById('programmes');
  if (!glow || !formations || window.matchMedia('(pointer:coarse)').matches) return;

  let tx = -999, ty = -999, x = -999, y = -999, active = false;

  formations.addEventListener('mouseenter', () => {
    active = true;
    glow.style.opacity = '1';
  });
  formations.addEventListener('mouseleave', () => {
    active = false;
    glow.style.opacity = '0';
  });

  document.addEventListener('mousemove', e => {
    if (!active) return;
    tx = e.clientX;
    ty = e.clientY;
  });

  glow.style.opacity = '0';
  glow.style.transition = 'opacity 0.5s ease';

  (function animate() {
    x += (tx - x) * 0.07;
    y += (ty - y) * 0.07;
    glow.style.left = x + 'px';
    glow.style.top  = y + 'px';
    requestAnimationFrame(animate);
  })();
}

// ═══════════════════════════════════════════════
//  SCROLL PROGRESS BAR
// ═══════════════════════════════════════════════
function initScrollProgress() {
  const bar  = document.getElementById('scrollProgress');
  const band = document.getElementById('subnavBand');
  if (!bar) return;
  window.addEventListener('scroll', () => {
    const sy  = window.scrollY;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = (sy / max * 100) + '%';
    if (band) band.classList.toggle('hidden', sy > 40);
  }, { passive: true });
}

// ═══════════════════════════════════════════════
//  3D TILT SUR CARDS
// ═══════════════════════════════════════════════
function initTilt3D() {
  const cards = document.querySelectorAll('.methode-card, .formation-card, .hero-stat-card');
  if (window.matchMedia('(pointer:coarse)').matches) return;
  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const r   = card.getBoundingClientRect();
      const dx  = (e.clientX - r.left - r.width  / 2) / (r.width  / 2);
      const dy  = (e.clientY - r.top  - r.height / 2) / (r.height / 2);
      const max = card.classList.contains('hero-stat-card') ? 8 : 5;
      card.style.transform = `perspective(900px) rotateY(${dx*max}deg) rotateX(${-dy*max}deg) translateZ(10px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transition = 'transform 0.6s cubic-bezier(0.34,1.56,0.64,1)';
      card.style.transform  = '';
      setTimeout(() => { card.style.transition = ''; }, 620);
    });
    card.addEventListener('mouseenter', () => {
      card.style.transition = 'transform 0.1s ease';
    });
  });
}

// ═══════════════════════════════════════════════
//  MAGNETIC BUTTONS
// ═══════════════════════════════════════════════
function initMagnetic() {
  if (window.matchMedia('(pointer:coarse)').matches) return;
  const btns = document.querySelectorAll('.btn-primary, .nav-cta, .formation-btn');
  btns.forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const r  = btn.getBoundingClientRect();
      const dx = (e.clientX - r.left - r.width  / 2) * 0.28;
      const dy = (e.clientY - r.top  - r.height / 2) * 0.28;
      btn.style.transform = `translate(${dx}px, ${dy}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transition = 'transform 0.5s cubic-bezier(0.34,1.56,0.64,1)';
      btn.style.transform  = '';
      setTimeout(() => { btn.style.transition = ''; }, 520);
    });
    btn.addEventListener('mouseenter', () => {
      btn.style.transition = 'transform 0.1s ease, background 0.35s, color 0.35s, box-shadow 0.35s';
    });
  });
}

// ═══════════════════════════════════════════════
//  PARALLAX SCROLL
// ═══════════════════════════════════════════════
function initParallax() {
  if (window.matchMedia('(pointer:coarse)').matches) return;
  const layers = [
    { sel: '.hero-photo',    speed: 0.015 },
    { sel: '.formations-bg', speed: 0.10 },
  ];
  const els = layers.map(l => ({ el: document.querySelector(l.sel), speed: l.speed }))
                     .filter(l => l.el);

  window.addEventListener('scroll', () => {
    const sy = window.scrollY;
    els.forEach(({ el, speed }) => {
      el.style.transform = `translateY(${sy * speed}px)`;
    });
  }, { passive: true });
}

// ═══════════════════════════════════════════════
//  RIPPLE SUR BOUTONS
// ═══════════════════════════════════════════════
function initRipple() {
  document.querySelectorAll('.btn-primary, .btn-form-submit, .formation-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      const r    = btn.getBoundingClientRect();
      const size = Math.max(r.width, r.height) * 1.4;
      const wave = document.createElement('span');
      wave.className = 'ripple-wave';
      wave.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX-r.left-size/2}px;top:${e.clientY-r.top-size/2}px`;
      btn.appendChild(wave);
      setTimeout(() => wave.remove(), 560);
    });
  });
}

// ═══════════════════════════════════════════════
//  SWIPE SLIDER iOS
// ═══════════════════════════════════════════════
function initSwipeSlider() {
  const slider = document.getElementById('swipeToProfile');
  if (!slider) return;

  const thumb  = document.getElementById('swipeThumb');
  const fill   = slider.querySelector('.swipe-fill');
  const label  = slider.querySelector('.swipe-label');
  const href   = slider.dataset.href;

  let dragging = false;
  let startX   = 0;
  let travel   = 0;
  let maxTravel = 0;

  function getClientX(e) {
    return e.touches ? e.touches[0].clientX : e.clientX;
  }

  function onStart(e) {
    maxTravel = slider.offsetWidth - thumb.offsetWidth - 8;
    dragging  = true;
    startX    = getClientX(e);
    travel    = 0;
    thumb.style.transition = 'none';
    fill.style.transition   = 'none';
    e.preventDefault();
  }

  function onMove(e) {
    if (!dragging) return;
    travel = Math.max(0, Math.min(getClientX(e) - startX, maxTravel));
    const ratio = travel / maxTravel;
    thumb.style.transform = `translateY(-50%) translateX(${travel}px)`;
    fill.style.transform  = `scaleX(${ratio})`;
    label.style.opacity   = 1 - ratio * 1.4;
    e.preventDefault();
  }

  function onEnd() {
    if (!dragging) return;
    dragging = false;
    const spring = 'transform 0.55s cubic-bezier(0.34, 1.56, 0.64, 1)';

    if (travel >= maxTravel * 0.72) {
      thumb.style.transition = spring;
      fill.style.transition  = 'transform 0.3s ease';
      thumb.style.transform  = `translateY(-50%) translateX(${maxTravel}px)`;
      fill.style.transform   = 'scaleX(1)';
      label.style.opacity    = '0';
      setTimeout(() => { window.location.href = href; }, 420);
    } else {
      thumb.style.transition = spring;
      fill.style.transition  = 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
      label.style.transition = 'opacity 0.3s';
      thumb.style.transform  = 'translateY(-50%)';
      fill.style.transform   = 'scaleX(0)';
      label.style.opacity    = '1';
      travel = 0;
    }
  }

  thumb.addEventListener('mousedown',  onStart);
  thumb.addEventListener('touchstart', onStart, { passive: false });
  document.addEventListener('mousemove',  onMove);
  document.addEventListener('touchmove',  onMove, { passive: false });
  document.addEventListener('mouseup',   onEnd);
  document.addEventListener('touchend',  onEnd);
}

// ═══════════════════════════════════════════════
//  MOBILE MENU
// ═══════════════════════════════════════════════
function closeMobileMenu() {
  const menu = document.getElementById('mobileMenu');
  const btn  = document.getElementById('hamburger');
  if (menu) menu.classList.remove('open');
  if (btn)  btn.classList.remove('open');
}

// Aller à l'espace connexion (scroll + onglet "Connexion")
function goToLogin() {
  const r = document.getElementById('reservation');
  if (r) r.scrollIntoView({ behavior: 'smooth', block: 'start' });
  if (typeof switchTab === 'function') { try { switchTab('login'); } catch (e) {} }
}

function initNav() {
  const nav  = document.getElementById('mainNav');
  const btn  = document.getElementById('hamburger');
  const menu = document.getElementById('mobileMenu');

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  });

  if (btn && menu) {
    btn.addEventListener('click', () => {
      btn.classList.toggle('open');
      menu.classList.toggle('open');
    });
  }

  // Close menu on outside click
  document.addEventListener('click', (e) => {
    if (menu && menu.classList.contains('open')) {
      if (!nav.contains(e.target)) closeMobileMenu();
    }
  });
}

// ═══════════════════════════════════════════════
//  REVEAL (IntersectionObserver)
// ═══════════════════════════════════════════════
function initReveal() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(x => {
      if (x.isIntersecting) x.target.classList.add('visible');
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.reveal').forEach(r => observer.observe(r));
}

// ═══════════════════════════════════════════════
//  COUNT UP ANIMATION
// ═══════════════════════════════════════════════
function initCountUp() {
  const elements = document.querySelectorAll('.count-up');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el     = entry.target;
        const target = parseInt(el.dataset.target);
        const duration = 1400;
        const step   = 16;
        const steps  = duration / step;
        const increment = target / steps;
        let current = 0;
        const timer = setInterval(() => {
          current += increment;
          if (current >= target) {
            el.textContent = target;
            clearInterval(timer);
          } else {
            el.textContent = Math.floor(current);
          }
        }, step);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  elements.forEach(el => observer.observe(el));
}

// ═══════════════════════════════════════════════
//  PARTICLE CANVAS (monochrome dust)
// ═══════════════════════════════════════════════
function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const NUM = window.innerWidth < 768 ? 30 : 60;
  particles = Array.from({length: NUM}, () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    r: Math.random() * 1.5 + 0.3,
    dx: (Math.random() - 0.5) * 0.25,
    dy: -Math.random() * 0.4 - 0.1,
    opacity: Math.random() * 0.5 + 0.1,
    flicker: Math.random() * Math.PI * 2,
  }));

  function draw() {
    ctx.clearRect(0, 0, W, H);
    const now = Date.now() / 1000;
    particles.forEach(p => {
      p.x  += p.dx;
      p.y  += p.dy;
      p.flicker += 0.03;
      if (p.y < -4)      p.y = H + 4;
      if (p.x < -4)      p.x = W + 4;
      if (p.x > W + 4)   p.x = -4;
      const op = p.opacity * (0.6 + 0.4 * Math.sin(p.flicker));
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(20,20,20,${op})`;
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }
  draw();
}

// ═══════════════════════════════════════════════
//  DEMO FALLBACK (localStorage)
// ═══════════════════════════════════════════════
function demoGetUsers()    { try{return JSON.parse(localStorage.getItem('cm_users')||'{}')}catch{return{}} }
function demoSaveUsers(u)  { localStorage.setItem('cm_users',JSON.stringify(u)) }
function demoGetBookings() { try{return JSON.parse(localStorage.getItem('cm_bookings')||'[]')}catch{return[]} }
function demoSaveBookings(b){ localStorage.setItem('cm_bookings',JSON.stringify(b)) }

// ═══════════════════════════════════════════════
//  PAYMENT (Phase I — 59€)
// ═══════════════════════════════════════════════
function openPayment(prog) {
  document.getElementById('paymentModal').classList.add('active');
}
function processPayment(e) {
  e.preventDefault();
  closeModal('paymentModal');
  document.getElementById('confirmModal').classList.add('active');
}
function closeModal(id) { document.getElementById(id).classList.remove('active'); }
function closeIfBg(e,id) { if(e.target===document.getElementById(id)) closeModal(id); }

// ═══════════════════════════════════════════════
//  CANDIDATURE (Accompagnement Personnalisé 197€)
// ═══════════════════════════════════════════════
function openCandidature() {
  document.getElementById('candidatureModal').classList.add('active');
}

async function submitCandidature(e) {
  e.preventDefault();
  const err = document.getElementById('candError');
  const suc = document.getElementById('candSuccess');
  const btn = document.getElementById('candBtn');
  err.style.display = 'none';
  suc.style.display  = 'none';

  const prenom   = document.getElementById('candPrenom').value.trim();
  const nom      = document.getElementById('candNom').value.trim();
  const email    = document.getElementById('candEmail').value.trim();
  const tel      = document.getElementById('candTel').value.trim();
  const age      = document.getElementById('candAge').value;
  const taille   = document.getElementById('candTaille').value;
  const poids    = document.getElementById('candPoids').value;
  const seances  = document.getElementById('candSeances').value;
  const objectif = document.getElementById('candObjectif').value;
  const materiel = document.getElementById('candMateriel').value;
  const bless    = document.getElementById('candBlessures').value.trim();
  const pourquoi = document.getElementById('candPourquoi').value.trim();
  const resultat = document.getElementById('candResultat').value.trim();

  if (!prenom || !nom || !email || !tel || !objectif || !pourquoi || !resultat) {
    err.textContent = 'Veuillez remplir tous les champs obligatoires (*).';
    err.style.display = 'block';
    return;
  }

  btn.textContent = 'Envoi en cours…';
  btn.disabled = true;

  const body = [
    `Nom : ${prenom} ${nom}`,
    `Email : ${email}`,
    `Téléphone : ${tel}`,
    `Âge : ${age || 'Non renseigné'}`,
    `Taille : ${taille ? taille + ' cm' : 'Non renseigné'}`,
    `Poids : ${poids ? poids + ' kg' : 'Non renseigné'}`,
    `Séances / semaine : ${seances || 'Non renseigné'}`,
    `Objectif : ${objectif}`,
    `Matériel : ${materiel || 'Non renseigné'}`,
    `Douleurs / blessures : ${bless || 'Aucune'}`,
    `Pourquoi accompagné : ${pourquoi}`,
    `Résultat souhaité : ${resultat}`,
  ].join('\n');

  if (typeof emailjs !== 'undefined' && !EMAILJS_SERVICE.includes('YOUR')) {
    try {
      emailjs.init(EMAILJS_KEY);
      await emailjs.send(EMAILJS_SERVICE, EMAILJS_TEMPLATE, {
        coach_email: COACH_EMAIL,
        client_name: `${prenom} ${nom}`,
        client_email: email,
        client_phone: tel,
        date: 'CANDIDATURE ACCOMPAGNEMENT 197€',
        time: '',
        goal: objectif,
        msg: body
      });
    } catch(ex) {
      console.warn('EmailJS:', ex);
    }
  } else {
    console.log('📩 [Demo] Candidature:', body);
  }

  btn.textContent = 'Envoyer ma candidature';
  btn.disabled = false;
  document.getElementById('candidatureForm').reset();
  suc.style.display = 'flex';
}

// ═══════════════════════════════════════════════
//  AUTH
// ═══════════════════════════════════════════════
function switchTab(tab) {
  document.querySelectorAll('.auth-tab').forEach((t,i) =>
    t.classList.toggle('active',(tab==='login'&&i===0)||(tab==='register'&&i===1)));
  const lf = document.getElementById('loginForm');
  const rf = document.getElementById('registerForm');
  lf.style.visibility    = tab === 'login'    ? '' : 'hidden';
  lf.style.pointerEvents = tab === 'login'    ? '' : 'none';
  rf.style.visibility    = tab === 'register' ? '' : 'hidden';
  rf.style.pointerEvents = tab === 'register' ? '' : 'none';
}

async function register() {
  const name  = document.getElementById('regName').value.trim();
  const email = document.getElementById('regEmail').value.trim().toLowerCase();
  const phone = document.getElementById('regPhone').value.trim();
  const pwd   = document.getElementById('regPwd').value;
  const err   = document.getElementById('regError');
  err.style.display='none';
  if(!name||!email||!pwd){err.textContent='Veuillez remplir tous les champs requis.';err.style.display='block';return;}
  if(pwd.length<6){err.textContent='Le mot de passe doit contenir au moins 6 caractères.';err.style.display='block';return;}
  if(sb){
    const {data:existing} = await sb.from('users').select('id').eq('email',email).maybeSingle();
    if(existing){err.textContent='Un compte existe déjà avec cet email.';err.style.display='block';return;}
    const {data,error} = await sb.from('users').insert({name,email,phone,pwd}).select().single();
    if(error){err.textContent='Erreur : '+error.message;err.style.display='block';return;}
    currentUser={id:data.id,name,email,phone};
  } else {
    const users=demoGetUsers();
    if(users[email]){err.textContent='Un compte existe déjà avec cet email.';err.style.display='block';return;}
    const id='demo_'+Date.now();
    users[email]={id,name,email,phone,pwd};
    demoSaveUsers(users);
    currentUser={id,name,email,phone};
  }
  sessionStorage.setItem('cm_user',JSON.stringify(currentUser));
  onLogin(currentUser);
}

async function login() {
  const email = document.getElementById('loginEmail').value.trim().toLowerCase();
  const pwd   = document.getElementById('loginPwd').value;
  const err   = document.getElementById('loginError');
  err.style.display='none';
  if(sb){
    const {data,error} = await sb.from('users').select('*').eq('email',email).eq('pwd',pwd).maybeSingle();
    if(error||!data){err.textContent='Email ou mot de passe incorrect.';err.style.display='block';return;}
    currentUser={id:data.id,name:data.name,email:data.email,phone:data.phone};
  } else {
    const users=demoGetUsers();
    const u=users[email];
    if(!u||u.pwd!==pwd){err.textContent='Email ou mot de passe incorrect.';err.style.display='block';return;}
    currentUser={id:u.id,name:u.name,email:u.email,phone:u.phone};
  }
  sessionStorage.setItem('cm_user',JSON.stringify(currentUser));
  onLogin(currentUser);
}

function logout() {
  sessionStorage.removeItem('cm_user');
  currentUser=null;
  document.getElementById('bookingContainer').style.display='none';
  showPanel('authContainer');
  selectedDate=null; selectedTime=null;
}

function onLogin(user) {
  document.getElementById('dbLoading').style.display='none';
  document.getElementById('authContainer').style.display='none';
  showPanel('bookingContainer');
  document.getElementById('userWelcome').textContent='Bonjour, '+user.name;
  renderCalendar();
  switchBookingTab('new');
}

// ═══════════════════════════════════════════════
//  BOOKING TABS
// ═══════════════════════════════════════════════
function switchBookingTab(tab) {
  document.querySelectorAll('.booking-tab').forEach((t,i) =>
    t.classList.toggle('active',(tab==='new'&&i===0)||(tab==='mine'&&i===1)));
  document.getElementById('newBookingPanel').style.display = tab==='new'?'block':'none';
  document.getElementById('myBookingsPanel').style.display = tab==='mine'?'block':'none';
  if(tab==='mine') renderMyBookings();
}

// ═══════════════════════════════════════════════
//  CALENDAR
// ═══════════════════════════════════════════════
let currentYear  = new Date().getFullYear();
let currentMonth = new Date().getMonth();
let selectedDate = null;
let selectedTime = null;

const TIMES = ['08:00','09:00','10:00','11:00','14:00','15:00','16:00','17:00','18:00'];
const MONTHS = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'];
const MONTHS_SHORT = ['Jan','Fév','Mar','Avr','Mai','Jun','Jul','Aoû','Sep','Oct','Nov','Déc'];

function changeMonth(dir) {
  currentMonth+=dir;
  if(currentMonth>11){currentMonth=0;currentYear++;}
  if(currentMonth<0){currentMonth=11;currentYear--;}
  renderCalendar();
}

async function renderCalendar() {
  document.getElementById('calMonthLabel').textContent = MONTHS[currentMonth]+' '+currentYear;
  const monthStr = `${currentYear}-${String(currentMonth+1).padStart(2,'0')}`;
  let allBookings = [];
  if(sb){
    const {data} = await sb.from('bookings').select('date,time').like('date',monthStr+'%');
    allBookings = data || [];
  } else {
    allBookings = demoGetBookings().filter(b=>b.date.startsWith(monthStr));
  }
  const dayCount = {};
  allBookings.forEach(b=>{ dayCount[b.date]=(dayCount[b.date]||0)+1; });
  const firstDay  = new Date(currentYear,currentMonth,1).getDay();
  const daysCount = new Date(currentYear,currentMonth+1,0).getDate();
  const offset    = (firstDay+6)%7;
  const today     = new Date(); today.setHours(0,0,0,0);
  const container = document.getElementById('calendarDays');
  if(!container) return;
  container.innerHTML='';
  for(let i=0;i<offset;i++){const el=document.createElement('div');el.className='cal-day empty';container.appendChild(el);}
  for(let d=1;d<=daysCount;d++){
    const el=document.createElement('div'); el.className='cal-day';
    el.textContent=d;
    const dateStr=`${currentYear}-${String(currentMonth+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    const dateObj=new Date(currentYear,currentMonth,d);
    const isWeekend=dateObj.getDay()===0||dateObj.getDay()===6;
    if(dateObj<today||isWeekend){ el.classList.add('past'); }
    else {
      const cnt=dayCount[dateStr]||0;
      const dot=document.createElement('span'); dot.className='dot'; el.appendChild(dot);
      if(cnt>=TIMES.length){ el.classList.add('full'); }
      else if(cnt>0){ el.classList.add('partial'); }
      if(dateObj.getTime()===today.getTime()) el.classList.add('today');
      if(selectedDate===dateStr) el.classList.add('selected');
      if(!el.classList.contains('full')) el.addEventListener('click',()=>selectDate(dateStr,el));
    }
    container.appendChild(el);
  }
}

async function selectDate(dateStr,el) {
  document.querySelectorAll('.cal-day.selected').forEach(e=>e.classList.remove('selected'));
  el.classList.add('selected');
  selectedDate=dateStr; selectedTime=null;
  const [y,m,d]=dateStr.split('-');
  document.getElementById('selectedDateLabel').textContent=`${parseInt(d)} ${MONTHS[parseInt(m)-1]} ${y}`;
  document.getElementById('bookingForm').style.display='none';
  document.getElementById('bookingConfirm').style.display='none';
  document.getElementById('slotsLoading').style.display='block';
  document.getElementById('timeSlots').innerHTML='';
  let bookedTimes=new Set();
  if(sb){
    const {data}=await sb.from('bookings').select('time').eq('date',dateStr);
    (data||[]).forEach(b=>bookedTimes.add(b.time));
  } else {
    demoGetBookings().filter(b=>b.date===dateStr).forEach(b=>bookedTimes.add(b.time));
  }
  document.getElementById('slotsLoading').style.display='none';
  renderTimeSlots(bookedTimes);
}

function renderTimeSlots(bookedTimes) {
  const container=document.getElementById('timeSlots');
  container.innerHTML='';
  TIMES.forEach(t=>{
    const el=document.createElement('div');
    el.className='time-slot'+(bookedTimes.has(t)?' booked':'');
    el.textContent=t;
    if(!bookedTimes.has(t)){
      el.addEventListener('click',()=>{
        document.querySelectorAll('.time-slot.selected').forEach(e=>e.classList.remove('selected'));
        el.classList.add('selected');
        selectedTime=t;
        document.getElementById('bookingForm').style.display='flex';
        document.getElementById('bookingForm').style.flexDirection='column';
      });
    }
    container.appendChild(el);
  });
}

// ═══════════════════════════════════════════════
//  CONFIRM BOOKING
// ═══════════════════════════════════════════════
async function confirmBooking() {
  if(!currentUser){alert('Vous devez être connecté.');return;}
  const goal=document.getElementById('bookGoal').value;
  const msg =document.getElementById('bookMsg').value.trim();
  if(!selectedDate||!selectedTime){alert('Choisissez une date et un créneau.');return;}
  if(!goal){alert('Choisissez un objectif.');return;}
  const btn=document.getElementById('confirmBtn');
  btn.textContent='Confirmation…'; btn.disabled=true;
  const booking={
    user_id:currentUser.id, user_email:currentUser.email,
    user_name:currentUser.name, user_phone:currentUser.phone||'',
    date:selectedDate, time:selectedTime, goal, msg
  };
  if(sb){
    const {data:existing}=await sb.from('bookings').select('id').eq('date',selectedDate).eq('time',selectedTime).maybeSingle();
    if(existing){
      btn.textContent='Confirmer le rendez-vous'; btn.disabled=false;
      alert('Ce créneau vient d\'être pris. Veuillez en choisir un autre.');
      selectDate(selectedDate,document.querySelector('.cal-day.selected'));
      return;
    }
    const {error}=await sb.from('bookings').insert(booking);
    if(error){btn.textContent='Confirmer le rendez-vous';btn.disabled=false;alert('Erreur: '+error.message);return;}
  } else {
    const existing=demoGetBookings().find(b=>b.date===selectedDate&&b.time===selectedTime);
    if(existing){btn.textContent='Confirmer';btn.disabled=false;alert('Créneau déjà pris.');return;}
    const bk=demoGetBookings(); bk.push({...booking,id:'demo_'+Date.now()}); demoSaveBookings(bk);
  }
  sendCoachEmail(booking);
  btn.textContent='Confirmer le rendez-vous'; btn.disabled=false;
  document.getElementById('bookingForm').style.display='none';
  document.getElementById('bookingConfirm').style.display='block';
  const [y,m,d]=selectedDate.split('-');
  document.getElementById('bookingConfirmText').textContent=`${parseInt(d)} ${MONTHS[parseInt(m)-1]} ${y} à ${selectedTime} — ${goal}`;
  renderCalendar();
  selectedDate=null; selectedTime=null;
}

// ═══════════════════════════════════════════════
//  EMAIL
// ═══════════════════════════════════════════════
function sendCoachEmail(booking) {
  if(typeof emailjs==='undefined'||EMAILJS_SERVICE.includes('YOUR')){
    console.log('📧 [Demo] Nouveau RDV:', booking); return;
  }
  emailjs.init(EMAILJS_KEY);
  emailjs.send(EMAILJS_SERVICE,EMAILJS_TEMPLATE,{
    coach_email:COACH_EMAIL, client_name:booking.user_name,
    client_email:booking.user_email, client_phone:booking.user_phone,
    date:booking.date, time:booking.time, goal:booking.goal,
    msg: booking.msg || 'Aucun message'
  }).then(()=>console.log('✅ Coach notifié')).catch(e=>console.warn('EmailJS:',e));
}

// ═══════════════════════════════════════════════
//  MY BOOKINGS
// ═══════════════════════════════════════════════
async function renderMyBookings() {
  if(!currentUser) return;
  const container=document.getElementById('myBookingsList');
  container.innerHTML='<div class="my-bookings-empty">Chargement…</div>';
  let bookings=[];
  if(sb){
    const {data}=await sb.from('bookings').select('*').eq('user_email',currentUser.email).order('date').order('time');
    bookings=data||[];
  } else {
    bookings=demoGetBookings().filter(b=>b.user_email===currentUser.email).sort((a,b)=>a.date.localeCompare(b.date));
  }
  const today=new Date().toISOString().split('T')[0];
  if(!bookings.length){container.innerHTML='<div class="my-bookings-empty">Vous n\'avez pas encore de rendez-vous.<br/>Réservez votre première séance !</div>';return;}
  container.innerHTML=bookings.map(b=>{
    const [y,m,d]=b.date.split('-');
    const isPast=b.date<today;
    return `<div class="my-booking-card">
      <div class="my-booking-date">${parseInt(d)} ${MONTHS_SHORT[parseInt(m)-1]} ${y}<br/><strong>${b.time}</strong></div>
      <div class="my-booking-info"><h5>${b.goal}</h5>${b.msg?`<p>${b.msg}</p>`:''}</div>
      <div class="my-booking-status ${isPast?'past':'upcoming'}">${isPast?'Passé':'Confirmé ✓'}</div>
    </div>`;
  }).join('');
}
