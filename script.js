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

async function initApp() {
  // Safety timeout — never block UI more than 3s
  const loadingTimeout = setTimeout(() => {
    const loading = document.getElementById('dbLoading');
    const auth    = document.getElementById('authContainer');
    if (loading && loading.style.display !== 'none') {
      loading.style.display = 'none';
      if (auth) auth.style.display = 'block';
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
  document.getElementById('authContainer').style.display = 'block';
}

window.addEventListener('DOMContentLoaded', () => {
  initApp();
  initCursor();
  initNav();
  initReveal();
  initCountUp();
  initParticles();
});

// ═══════════════════════════════════════════════
//  MOBILE MENU
// ═══════════════════════════════════════════════
function closeMobileMenu() {
  const menu = document.getElementById('mobileMenu');
  const btn  = document.getElementById('hamburger');
  if (menu) menu.classList.remove('open');
  if (btn)  btn.classList.remove('open');
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
//  CURSOR
// ═══════════════════════════════════════════════
function initCursor() {
  const cursor = document.getElementById('cursor');
  const trail  = document.getElementById('cursorTrail');
  if (!cursor || !trail) return;
  let mx = 0, my = 0;
  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cursor.style.left = mx+'px';
    cursor.style.top  = my+'px';
    setTimeout(() => {
      trail.style.left = mx+'px';
      trail.style.top  = my+'px';
    }, 80);
  });
  document.querySelectorAll('a,button,.cal-day,.time-slot,.methode-card,.gallery-item').forEach(el => {
    el.addEventListener('mouseenter', () => cursor.style.transform='translate(-50%,-50%) scale(2.4)');
    el.addEventListener('mouseleave', () => cursor.style.transform='translate(-50%,-50%) scale(1)');
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
//  PARTICLE CANVAS (golden dust)
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
      ctx.fillStyle = `rgba(201,168,76,${op})`;
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
//  PAYMENT
// ═══════════════════════════════════════════════
const PROGRAMS = {
  olympus:    {name:'Olympus Elite — 12 semaines', price:'297 €'},
  fondations: {name:'Fondations — 8 semaines',    price:'97 €'},
  dieta:      {name:'Dieta Apollinis',             price:'127 €'},
  titan:      {name:'Titan Protocol',              price:'197 €'}
};
function openPayment(prog) {
  const p = PROGRAMS[prog];
  document.getElementById('modalTitle').textContent = p.name;
  document.getElementById('modalPrice').textContent = p.price;
  document.getElementById('payBtn').textContent     = p.price;
  document.getElementById('paymentModal').classList.add('active');
}
function processPayment(e) {
  e.preventDefault();
  closeModal('paymentModal');
  document.getElementById('confirmModal').classList.add('active');
}
function closeModal(id) { document.getElementById(id).classList.remove('active'); }
function closeIfBg(e,id) { if(e.target===document.getElementById(id)) closeModal(id); }
function formatCard(el) { let v=el.value.replace(/\D/g,'').substring(0,16); el.value=v.replace(/(.{4})/g,'$1 ').trim(); }
function formatExpiry(el) { let v=el.value.replace(/\D/g,'').substring(0,4); if(v.length>=2) v=v.substring(0,2)+'/'+v.substring(2); el.value=v; }

// ═══════════════════════════════════════════════
//  AUTH
// ═══════════════════════════════════════════════
function switchTab(tab) {
  document.querySelectorAll('.auth-tab').forEach((t,i) =>
    t.classList.toggle('active',(tab==='login'&&i===0)||(tab==='register'&&i===1)));
  document.getElementById('loginForm').style.display    = tab==='login'?'flex':'none';
  document.getElementById('registerForm').style.display = tab==='register'?'flex':'none';
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
  document.getElementById('authContainer').style.display='block';
  selectedDate=null; selectedTime=null;
}

function onLogin(user) {
  document.getElementById('dbLoading').style.display='none';
  document.getElementById('authContainer').style.display='none';
  document.getElementById('bookingContainer').style.display='block';
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
