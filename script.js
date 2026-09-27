/* =========================================================================
   CADENCE — personal life organizer
   Single-file-style app (index.html + app.js), localStorage persistence.
   ========================================================================= */

/* ----------------------------- ICONS (inline svg) ----------------------------- */
const ICONS = {
  dashboard:`<svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="7" height="9" rx="1.5"/><rect x="14" y="3" width="7" height="5" rx="1.5"/><rect x="14" y="12" width="7" height="9" rx="1.5"/><rect x="3" y="16" width="7" height="5" rx="1.5"/></svg>`,
  routines:`<svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 12a8 8 0 0 1 14.5-4.6M20 12a8 8 0 0 1-14.5 4.6"/><path d="M18.5 3v4.4H14M5.5 21v-4.4H10"/></svg>`,
  todo:`<svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M9 11l2 2 4-4"/><rect x="3" y="3" width="18" height="18" rx="3"/></svg>`,
  shopping:`<svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M6 2l2.5 5M18 2l-2.5 5M3 7h18l-1.8 11.4a2 2 0 0 1-2 1.6H6.8a2 2 0 0 1-2-1.6L3 7z"/><circle cx="9" cy="22" r="1"/><circle cx="16" cy="22" r="1"/></svg>`,
  schedule:`<svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="4.5" width="18" height="16" rx="2.5"/><path d="M3 9.5h18M8 2.5v4M16 2.5v4"/></svg>`,
  income:`<svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 2v20M17 6.5c0-1.9-2.2-3.5-5-3.5s-5 1.6-5 3.5S9.2 10 12 10s5 1.6 5 3.5-2.2 3.5-5 3.5-5-1.6-5-3.5"/></svg>`,
  paycheck:`<svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="2" y="5" width="20" height="14" rx="2.5"/><path d="M2 10h20M6 15h4"/></svg>`,
  plus:`<svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M12 5v14M5 12h14"/></svg>`,
  check:`<svg viewBox="0 0 24 24" fill="none" stroke-width="3"><path d="M4 12l5 5L20 6"/></svg>`,
  edit:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>`,
  trash:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0-1 14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2L4 6h16z"/></svg>`,
  bell:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/></svg>`,
  close:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>`,
  chevL:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 18l-6-6 6-6"/></svg>`,
  chevR:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg>`,
  briefcase:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" width="18" height="18"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>`,
};

/* ----------------------------- CONSTANTS ----------------------------- */
const STORAGE_KEY = 'cadence_app_data_v1';
const DOW = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const ROUTINE_CATS = {
  Work:{color:'var(--sky)', bg:'rgba(123,167,188,0.14)'},
  Personal:{color:'var(--plum)', bg:'rgba(165,130,179,0.14)'},
  Weekend:{color:'var(--coral)', bg:'rgba(217,119,87,0.14)'},
  'Day Off':{color:'var(--sage)', bg:'rgba(143,168,118,0.14)'},
  Custom:{color:'var(--gold)', bg:'rgba(217,164,65,0.14)'},
};
const SHOP_CATS = ['Groceries','Household','Personal','Family'];

/* ----------------------------- STATE ----------------------------- */
let state = null;

function defaultState(){
  return {
    routines:[],
    todos:[],
    shoppingLists:[],
    scheduleEvents:[],
    income:{
      payType:'hourly', rate:0, hoursPerWeek:40, salaryAnnual:0,
      payFrequency:'biweekly', lastPayDate:'', taxRatePct:20
    },
    paychecks:[],
    ui:{ activePage:'dashboard', todoFilter:'all', calMonth:(new Date()).getMonth(), calYear:(new Date()).getFullYear(), selectedDate:todayISO() }
  };
}

function todayISO(){
  const d = new Date();
  return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
}

function loadState(){
  try{
    const raw = localStorage.getItem(STORAGE_KEY);
    if(!raw) return seedState();
    const parsed = JSON.parse(raw);
    // Merge nested settings too, so older saved data keeps newly added defaults.
    const defaults = defaultState();
    return {
      ...defaults,
      ...parsed,
      routines: Array.isArray(parsed.routines) ? parsed.routines : defaults.routines,
      todos: Array.isArray(parsed.todos) ? parsed.todos : defaults.todos,
      shoppingLists: Array.isArray(parsed.shoppingLists) ? parsed.shoppingLists : defaults.shoppingLists,
      scheduleEvents: Array.isArray(parsed.scheduleEvents) ? parsed.scheduleEvents : defaults.scheduleEvents,
      paychecks: Array.isArray(parsed.paychecks) ? parsed.paychecks : defaults.paychecks,
      income: {...defaults.income, ...(parsed.income || {})},
      ui: {...defaults.ui, ...(parsed.ui || {})},
    };
  }catch(e){
    console.error('Cadence: failed to load state, resetting', e);
    return seedState();
  }
}

function saveState(){
  try{
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }catch(e){
    console.error('Cadence: failed to save state', e);
    showToast('Storage error', "Couldn't save changes. Your browser storage may be full.");
  }
}

function uid(){ return Date.now().toString(36)+Math.random().toString(36).slice(2,8); }

function seedState(){
  const s = defaultState();
  s.routines = [
    {id:uid(), name:'Weekday Morning', category:'Work', color:'Work', tasks:[
      {id:uid(), text:'Drink water + stretch', time:'6:30 AM', done:false},
      {id:uid(), text:'Check calendar for the day', time:'7:00 AM', done:false},
      {id:uid(), text:'Commute / log in', time:'8:30 AM', done:false},
    ]},
    {id:uid(), name:'Weekend Reset', category:'Weekend', color:'Weekend', tasks:[
      {id:uid(), text:'Laundry', time:'10:00 AM', done:false},
      {id:uid(), text:'Meal prep for the week', time:'1:00 PM', done:false},
    ]},
  ];
  s.todos = [
    {id:uid(), text:'Finish client invoice', notes:'', dueDate:todayISO(), dueTime:'17:00', priority:'high', category:'Work', reminder:true, done:false, createdAt:Date.now(), order:0},
    {id:uid(), text:'Call about dentist appointment', notes:'', dueDate:todayISO(), dueTime:'', priority:'medium', category:'Personal', reminder:false, done:false, createdAt:Date.now(), order:1},
  ];
  s.shoppingLists = [
    {id:uid(), name:'Weekly Groceries', category:'Groceries', items:[
      {id:uid(), text:'Eggs', qty:'1 dozen', done:false, assignedTo:''},
      {id:uid(), text:'Coffee', qty:'', done:false, assignedTo:''},
    ]},
    {id:uid(), name:'Household Supplies', category:'Household', items:[
      {id:uid(), text:'Paper towels', qty:'', done:false, assignedTo:''},
    ]},
  ];
  s.scheduleEvents = [
    {id:uid(), title:'Work Shift', startDate:todayISO(), startTime:'09:00', endTime:'17:00', recurrence:'weekly', daysOfWeek:[1,2,3,4,5], notes:''},
  ];
  s.income = {payType:'hourly', rate:24, hoursPerWeek:40, salaryAnnual:0, payFrequency:'biweekly', lastPayDate:todayISO(), taxRatePct:20};
  return s;
}

/* ----------------------------- INIT ----------------------------- */
document.addEventListener('DOMContentLoaded', () => {
  state = loadState();
  renderShell();
  navigate(state.ui.activePage || 'dashboard');
  startReminderEngine();
  document.addEventListener('keydown', (e)=>{
    if(e.key === 'Escape') closeModal();
  });
});

/* ----------------------------- SHELL / NAV ----------------------------- */
function renderShell(){
  const app = document.getElementById('app');
  app.innerHTML = `
    <aside class="sidebar">
      <div class="brand">
        <div class="brand-mark">C</div>
        <div>
          <div class="brand-text">Cadence</div>
          <div class="brand-sub">Life, organized</div>
        </div>
      </div>
      <div class="nav-group" id="navGroup">
        <div class="nav-label">Overview</div>
        ${navItem('dashboard','Dashboard','dashboard')}
        <div class="nav-label">Plan</div>
        ${navItem('routines','Routines','routines')}
        ${navItem('todos','Daily To-Do','todo')}
        ${navItem('shopping','Shopping Lists','shopping')}
        ${navItem('schedule','Work Schedule','schedule')}
        <div class="nav-label">Money</div>
        ${navItem('income','Income Setup','income')}
        ${navItem('paychecks','Paycheck Tracker','paycheck')}
      </div>
      <div class="payday-pill" id="paydayPill"></div>
    </aside>
    <main class="main">
      <div class="page" id="page-dashboard"></div>
      <div class="page" id="page-routines"></div>
      <div class="page" id="page-todos"></div>
      <div class="page" id="page-shopping"></div>
      <div class="page" id="page-schedule"></div>
      <div class="page" id="page-income"></div>
      <div class="page" id="page-paychecks"></div>
    </main>
  `;
}

function navItem(key,label,iconKey){
  return `<button class="nav-item" data-nav="${key}" onclick="navigate('${key}')">
    ${ICONS[iconKey]}<span>${label}</span>
  </button>`;
}

function navigate(page){
  state.ui.activePage = page;
  saveState();
  document.querySelectorAll('.nav-item').forEach(el=>{
    el.classList.toggle('active', el.dataset.nav === page);
  });
  document.querySelectorAll('.page').forEach(el=> el.classList.remove('active'));
  const el = document.getElementById('page-'+page);
  if(el) el.classList.add('active');
  renderPage(page);
  renderPaydayPill();
}

function renderPage(page){
  switch(page){
    case 'dashboard': renderDashboard(); break;
    case 'routines': renderRoutines(); break;
    case 'todos': renderTodos(); break;
    case 'shopping': renderShopping(); break;
    case 'schedule': renderSchedule(); break;
    case 'income': renderIncome(); break;
    case 'paychecks': renderPaychecks(); break;
  }
}

function rerenderActive(){ renderPage(state.ui.activePage); renderPaydayPill(); }

/* ----------------------------- PAY ENGINE ----------------------------- */
function frequencyDays(freq){
  return {weekly:7, biweekly:14, semimonthly:15.2, monthly:30.4}[freq] || 14;
}

function parseISO(dateStr){
  if(!dateStr) return null;
  const [y,m,d] = dateStr.split('-').map(Number);
  return new Date(y, m-1, d);
}

function addDays(date, n){
  const d = new Date(date);
  d.setDate(d.getDate()+n);
  return d;
}

function computeNextPayDate(){
  const inc = state.income;
  if(!inc.lastPayDate) return null;
  const last = parseISO(inc.lastPayDate);
  const today = new Date(); today.setHours(0,0,0,0);
  let next = new Date(last);

  if(inc.payFrequency === 'monthly'){
    const payday = last.getDate();
    let year = last.getFullYear();
    let month = last.getMonth();
    do{
      month++;
      if(month > 11){ month = 0; year++; }
      const day = Math.min(payday, new Date(year, month+1, 0).getDate());
      next = new Date(year, month, day);
    }while(next <= today);
    return next;
  }
  if(inc.payFrequency === 'semimonthly'){
    // pay on the same day-of-month and 15 days later, repeating
    next = new Date(last);
    while(next <= today){ next = addDays(next, 15); }
    return next;
  }
  const stepDays = inc.payFrequency === 'weekly' ? 7 : 14;
  next = new Date(last);
  while(next <= today){ next = addDays(next, stepDays); }
  return next;
}

function daysUntil(date){
  if(!date) return null;
  const today = new Date(); today.setHours(0,0,0,0);
  const target = new Date(date); target.setHours(0,0,0,0);
  return Math.round((target - today) / 86400000);
}

function estimateGrossPerPeriod(){
  const inc = state.income;
  const rate = Number(inc.rate)||0;
  const hrsWk = Number(inc.hoursPerWeek)||0;
  switch(inc.payType){
    case 'hourly': {
      const weeklyGross = rate * hrsWk;
      if(inc.payFrequency==='weekly') return weeklyGross;
      if(inc.payFrequency==='biweekly') return weeklyGross*2;
      if(inc.payFrequency==='semimonthly') return (weeklyGross*52)/24;
      if(inc.payFrequency==='monthly') return (weeklyGross*52)/12;
      return weeklyGross;
    }
    case 'daily': {
      const daysPerWeek = 5;
      const weeklyGross = rate * daysPerWeek;
      if(inc.payFrequency==='weekly') return weeklyGross;
      if(inc.payFrequency==='biweekly') return weeklyGross*2;
      if(inc.payFrequency==='semimonthly') return (weeklyGross*52)/24;
      if(inc.payFrequency==='monthly') return (weeklyGross*52)/12;
      return weeklyGross;
    }
    case 'weekly': {
      if(inc.payFrequency==='weekly') return rate;
      if(inc.payFrequency==='biweekly') return rate*2;
      if(inc.payFrequency==='semimonthly') return (rate*52)/24;
      if(inc.payFrequency==='monthly') return (rate*52)/12;
      return rate;
    }
    case 'biweekly': {
      if(inc.payFrequency==='biweekly') return rate;
      if(inc.payFrequency==='weekly') return rate/2;
      if(inc.payFrequency==='semimonthly') return (rate*26)/24;
      if(inc.payFrequency==='monthly') return (rate*26)/12;
      return rate;
    }
    case 'monthly': {
      const annual = rate*12;
      if(inc.payFrequency==='monthly') return rate;
      if(inc.payFrequency==='semimonthly') return annual/24;
      if(inc.payFrequency==='biweekly') return annual/26;
      if(inc.payFrequency==='weekly') return annual/52;
      return rate;
    }
    default: return 0;
  }
}

function estimateNetPerPeriod(){
  const gross = estimateGrossPerPeriod();
  const taxRate = Number(state.income.taxRatePct)||0;
  return gross * (1 - taxRate/100);
}

function fmtMoney(n){
  if(isNaN(n)) n = 0;
  return '$'+n.toLocaleString('en-US',{minimumFractionDigits:2, maximumFractionDigits:2});
}

function renderPaydayPill(){
  const pill = document.getElementById('paydayPill');
  if(!pill) return;
  const next = computeNextPayDate();
  if(!next || !state.income.lastPayDate){
    pill.innerHTML = `<div class="payday-pill-label">Next Payday</div>
      <div class="payday-pill-sub" style="margin-top:6px;">Set up your income to see a countdown.</div>`;
    return;
  }
  const days = daysUntil(next);
  const net = estimateNetPerPeriod();
  let label = days === 0 ? "It's today!" : days === 1 ? '1 day' : days+' days';
  pill.innerHTML = `
    <div class="payday-pill-label">Next Payday</div>
    <div class="payday-pill-value">${label}</div>
    <div class="payday-pill-sub">${MONTHS[next.getMonth()].slice(0,3)} ${next.getDate()} · est. ${fmtMoney(net)} net</div>
  `;
}

/* ----------------------------- MODAL SYSTEM ----------------------------- */
function openModal(innerHtml){
  const overlay = document.getElementById('modalOverlay');
  overlay.innerHTML = `<div class="modal" role="dialog" aria-modal="true">${innerHtml}</div>`;
  overlay.classList.add('open');
  overlay.onclick = (e)=>{ if(e.target === overlay) closeModal(); };
  const firstInput = overlay.querySelector('input,textarea,select');
  if(firstInput) setTimeout(()=>firstInput.focus(), 60);
}
function closeModal(){
  const overlay = document.getElementById('modalOverlay');
  overlay.classList.remove('open');
  overlay.innerHTML = '';
}
function modalHeader(title){
  return `<div class="modal-head"><h3>${title}</h3>
    <button class="modal-close" onclick="closeModal()">${ICONS.close}</button></div>`;
}

/* ----------------------------- TOAST / NOTIFICATIONS ----------------------------- */
function showToast(title, body){
  const stack = document.getElementById('toastStack');
  const el = document.createElement('div');
  el.className = 'toast';
  el.innerHTML = `<div class="toast-title">${escapeHtml(title)}</div><div class="toast-body">${escapeHtml(body||'')}</div>`;
  stack.appendChild(el);
  setTimeout(()=>{
    el.classList.add('leaving');
    setTimeout(()=> el.remove(), 260);
  }, 4200);
}

function requestNotificationPermission(){
  if(typeof Notification !== 'undefined' && Notification && Notification.permission === 'default'){
    Notification.requestPermission();
  }
}

function pushBrowserNotification(title, body){
  if(typeof Notification !== 'undefined' && Notification && Notification.permission === 'granted'){
    try{ new Notification(title, {body}); }catch(e){/* ignore */}
  }
  showToast(title, body);
}

// Tracks which reminders have already fired this session so we don't spam.
const firedReminders = new Set();

function startReminderEngine(){
  requestNotificationPermission();
  checkReminders();
  setInterval(checkReminders, 60*1000);
}

function checkReminders(){
  const now = new Date();
  const todayStr = todayISO();

  // Due-today / due-soon todos with reminder flag
  state.todos.forEach(t=>{
    if(t.done || !t.reminder || !t.dueDate) return;
    const key = 'todo-'+t.id+'-'+todayStr;
    if(t.dueDate === todayStr && !firedReminders.has(key)){
      if(t.dueTime){
        const [hh,mm] = t.dueTime.split(':').map(Number);
        const due = new Date(); due.setHours(hh,mm,0,0);
        const diffMin = (due-now)/60000;
        if(diffMin <= 60 && diffMin > -5){
          firedReminders.add(key);
          pushBrowserNotification('Due soon: '+t.text, t.dueTime ? 'Due at '+formatTime(t.dueTime) : 'Due today');
        }
      } else {
        firedReminders.add(key);
        pushBrowserNotification('Due today: '+t.text, t.category || '');
      }
    }
  });

  // Payday countdown milestones
  const next = computeNextPayDate();
  if(next){
    const days = daysUntil(next);
    const key = 'pay-'+days+'-'+todayStr;
    if([3,1,0].includes(days) && !firedReminders.has(key)){
      firedReminders.add(key);
      const msg = days === 0 ? "Payday is today!" : `Payday is in ${days} day${days===1?'':'s'}.`;
      pushBrowserNotification('Cadence', msg);
    }
  }

  // Schedule events happening today
  getEventsForDate(todayStr).forEach(ev=>{
    const key = 'evt-'+ev.id+'-'+todayStr;
    if(!firedReminders.has(key)){
      firedReminders.add(key);
    }
  });
}

function formatTime(t){
  if(!t) return '';
  const [h,m] = t.split(':').map(Number);
  const ampm = h>=12 ? 'PM':'AM';
  const h12 = h%12===0?12:h%12;
  return `${h12}:${String(m).padStart(2,'0')} ${ampm}`;
}

function escapeHtml(str){
  if(str===undefined || str===null) return '';
  return String(str).replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

/* ----------------------------- DRAG & DROP (generic reorder) ----------------------------- */
function makeDraggable(container, itemSelector, onReorder){
  let dragEl = null;
  container.querySelectorAll(itemSelector).forEach(el=>{
    el.setAttribute('draggable','true');
    el.addEventListener('dragstart', (e)=>{
      dragEl = el;
      el.classList.add('dragging');
      e.dataTransfer.effectAllowed = 'move';
    });
    el.addEventListener('dragend', ()=>{
      el.classList.remove('dragging');
      container.querySelectorAll(itemSelector).forEach(x=>x.classList.remove('drag-over'));
      const ids = Array.from(container.querySelectorAll(itemSelector)).map(x=>x.dataset.id);
      onReorder(ids);
    });
    el.addEventListener('dragover', (e)=>{
      e.preventDefault();
      if(el === dragEl) return;
      el.classList.add('drag-over');
      const rect = el.getBoundingClientRect();
      const after = (e.clientY - rect.top) > rect.height/2;
      if(after){
        el.parentNode.insertBefore(dragEl, el.nextSibling);
      } else {
        el.parentNode.insertBefore(dragEl, el);
      }
    });
    el.addEventListener('dragleave', ()=> el.classList.remove('drag-over'));
  });
}

/* ----------------------------- DASHBOARD ----------------------------- */
function renderDashboard(){
  const el = document.getElementById('page-dashboard');
  const todayTodos = state.todos.filter(t=> t.dueDate === todayISO() && !t.done);
  const overdueTodos = state.todos.filter(t=> t.dueDate && t.dueDate < todayISO() && !t.done);
  const completedToday = state.todos.filter(t=> t.dueDate === todayISO() && t.done).length;
  const totalToday = state.todos.filter(t=> t.dueDate === todayISO()).length;
  const shoppingRemaining = state.shoppingLists.reduce((sum,l)=> sum + l.items.filter(i=>!i.done).length, 0);
  const next = computeNextPayDate();
  const days = next ? daysUntil(next) : null;
  const todaysEvents = getEventsForDate(todayISO());

  el.innerHTML = `
    <div class="page-header">
      <div>
        <div class="page-title">Good ${greeting()}</div>
        <div class="page-subtitle">${MONTHS[new Date().getMonth()]} ${new Date().getDate()}, ${new Date().getFullYear()} — here's where things stand.</div>
      </div>
      <button class="btn btn-primary" onclick="openTodoModal()">${ICONS.plus} Quick Add To-Do</button>
    </div>

    <div class="grid grid-4 section-block">
      <div class="card stat-card stat-accent-gold">
        <div class="stat-label">Today's Tasks</div>
        <div class="stat-value">${completedToday}/${totalToday}</div>
        <div class="stat-sub">${totalToday - completedToday} remaining</div>
      </div>
      <div class="card stat-card stat-accent-coral">
        <div class="stat-label">Shopping Items</div>
        <div class="stat-value">${shoppingRemaining}</div>
        <div class="stat-sub">left to pick up</div>
      </div>
      <div class="card stat-card stat-accent-sky">
        <div class="stat-label">Today's Schedule</div>
        <div class="stat-value">${todaysEvents.length}</div>
        <div class="stat-sub">${todaysEvents.length ? todaysEvents[0].title : 'nothing on the books'}</div>
      </div>
      <div class="card stat-card stat-accent-sage">
        <div class="stat-label">Next Payday</div>
        <div class="stat-value">${days === null ? '—' : (days===0?'Today':days+'d')}</div>
        <div class="stat-sub">${next ? MONTHS[next.getMonth()].slice(0,3)+' '+next.getDate() : 'set up income'}</div>
      </div>
    </div>

    ${overdueTodos.length ? `
    <div class="section-block">
      <div class="section-heading"><h3 style="color:var(--danger)">Overdue</h3></div>
      <div class="list-container">${overdueTodos.map(t=>todoRowHtml(t)).join('')}</div>
    </div>` : ''}

    <div class="section-block">
      <div class="section-heading">
        <h3>Today's To-Do</h3>
        <button class="see-all" onclick="navigate('todos')">See all →</button>
      </div>
      ${todayTodos.length ? `<div class="list-container">${todayTodos.slice(0,5).map(t=>todoRowHtml(t)).join('')}</div>`
        : emptyState('✓','Nothing due today','Enjoy the breathing room, or add something for tomorrow.')}
    </div>

    <div class="grid grid-2">
      <div class="section-block">
        <div class="section-heading">
          <h3>Active Routines</h3>
          <button class="see-all" onclick="navigate('routines')">See all →</button>
        </div>
        ${state.routines.length ? state.routines.slice(0,2).map(r=>routineCardHtml(r)).join('') : emptyState('↻','No routines yet','Build one for work, weekends, or days off.')}
      </div>
      <div class="section-block">
        <div class="section-heading">
          <h3>Shopping Lists</h3>
          <button class="see-all" onclick="navigate('shopping')">See all →</button>
        </div>
        ${state.shoppingLists.length ? `<div class="shopping-grid">${state.shoppingLists.slice(0,2).map(l=>shopCardHtml(l)).join('')}</div>` : emptyState('🛒','No lists yet','Start a grocery or household list.')}
      </div>
    </div>
  `;
  bindTodoRowEvents(el);
  bindShopCardEvents(el);
}

function greeting(){
  const h = new Date().getHours();
  if(h < 12) return 'morning';
  if(h < 17) return 'afternoon';
  return 'evening';
}

function emptyState(icon,title,sub){
  return `<div class="empty-state"><div class="empty-icon">${icon}</div><strong>${title}</strong><p>${sub}</p></div>`;
}

/* ----------------------------- TODOS ----------------------------- */
function renderTodos(){
  const el = document.getElementById('page-todos');
  const filter = state.ui.todoFilter || 'all';
  let list = [...state.todos];
  const today = todayISO();
  if(filter === 'today') list = list.filter(t=>t.dueDate === today);
  else if(filter === 'upcoming') list = list.filter(t=>t.dueDate && t.dueDate > today && !t.done);
  else if(filter === 'overdue') list = list.filter(t=>t.dueDate && t.dueDate < today && !t.done);
  else if(filter === 'done') list = list.filter(t=>t.done);
  else if(filter !== 'all') list = list.filter(t=>t.category === filter);

  list.sort((a,b)=> (a.order??0)-(b.order??0));

  const cats = ['Work','Personal','Errands','Health','Family','Other'];

  el.innerHTML = `
    <div class="page-header">
      <div>
        <div class="page-title">Daily To-Do</div>
        <div class="page-subtitle">${state.todos.filter(t=>!t.done).length} open tasks</div>
      </div>
      <button class="btn btn-primary" onclick="openTodoModal()">${ICONS.plus} Add Task</button>
    </div>
    <div class="filter-bar">
      ${chip('all','All',filter)}
      ${chip('today','Today',filter)}
      ${chip('upcoming','Upcoming',filter)}
      ${chip('overdue','Overdue',filter)}
      ${chip('done','Completed',filter)}
      ${cats.map(c=>chip(c,c,filter)).join('')}
    </div>
    <div class="list-container" id="todoList">
      ${list.length ? list.map(t=>todoRowHtml(t)).join('') : emptyState('✓','Nothing here','Try a different filter, or add a new task.')}
    </div>
  `;
  bindTodoRowEvents(el);
  const container = document.getElementById('todoList');
  if(container && filter==='all'){
    makeDraggable(container, '.todo-row', (ids)=>{
      ids.forEach((id,idx)=>{
        const t = state.todos.find(x=>x.id===id);
        if(t) t.order = idx;
      });
      saveState();
    });
  }
}

function chip(value,label,active){
  return `<button class="chip ${active===value?'active':''}" onclick="setTodoFilter('${value}')">${label}</button>`;
}
function setTodoFilter(v){ state.ui.todoFilter = v; saveState(); renderTodos(); }

function todoRowHtml(t){
  const overdue = t.dueDate && t.dueDate < todayISO() && !t.done;
  return `<div class="todo-row ${t.done?'completed':''}" data-id="${t.id}">
    <span class="drag-handle">⠿</span>
    <button class="checkbox ${t.done?'checked':''}" onclick="toggleTodo('${t.id}')">${ICONS.check}</button>
    <div class="todo-body">
      <div class="todo-text">${escapeHtml(t.text)}</div>
      <div class="todo-meta">
        ${t.priority ? `<span class="meta-tag"><span class="priority-dot priority-${t.priority}"></span>${cap(t.priority)}</span>` : ''}
        ${t.dueDate ? `<span class="meta-tag" style="${overdue?'color:var(--danger)':''}">${fmtDate(t.dueDate)}${t.dueTime?' · '+formatTime(t.dueTime):''}</span>` : ''}
        ${t.category ? `<span class="meta-tag">${escapeHtml(t.category)}</span>` : ''}
        ${t.reminder ? `<span class="meta-tag">${ICONS.bell.replace('viewBox','width="11" height="11" viewBox')}</span>` : ''}
      </div>
    </div>
    <div class="row-actions">
      <button class="icon-btn" onclick="openTodoModal('${t.id}')">${ICONS.edit}</button>
      <button class="icon-btn danger" onclick="deleteTodo('${t.id}')">${ICONS.trash}</button>
    </div>
  </div>`;
}

function bindTodoRowEvents(scopeEl){ /* delegation via inline onclick, nothing extra needed */ }

function cap(s){ return s.charAt(0).toUpperCase()+s.slice(1); }
function fmtDate(iso){
  if(!iso) return '';
  const d = parseISO(iso);
  const today = todayISO();
  if(iso === today) return 'Today';
  const tmrw = new Date(); tmrw.setDate(tmrw.getDate()+1);
  if(iso === isoOf(tmrw)) return 'Tomorrow';
  return MONTHS[d.getMonth()].slice(0,3)+' '+d.getDate();
}

function toggleTodo(id){
  const t = state.todos.find(x=>x.id===id);
  if(!t) return;
  t.done = !t.done;
  saveState();
  rerenderActive();
}

function deleteTodo(id){
  state.todos = state.todos.filter(x=>x.id!==id);
  saveState();
  rerenderActive();
  showToast('Task deleted','');
}

function openTodoModal(id){
  const editing = id ? state.todos.find(t=>t.id===id) : null;
  openModal(`
    ${modalHeader(editing?'Edit Task':'New Task')}
    <div class="form-row"><label>What needs doing?</label>
      <input class="form-input" id="f-text" value="${escapeHtml(editing?.text||'')}" placeholder="e.g. Pick up dry cleaning">
    </div>
    <div class="form-grid2">
      <div class="form-row"><label>Due date</label>
        <input type="date" class="form-input" id="f-date" value="${editing?.dueDate||todayISO()}">
      </div>
      <div class="form-row"><label>Due time <span class="hint">(optional)</span></label>
        <input type="time" class="form-input" id="f-time" value="${editing?.dueTime||''}">
      </div>
    </div>
    <div class="form-grid2">
      <div class="form-row"><label>Priority</label>
        <select class="form-input" id="f-priority">
          ${['low','medium','high'].map(p=>`<option value="${p}" ${editing?.priority===p?'selected':''}>${cap(p)}</option>`).join('')}
        </select>
      </div>
      <div class="form-row"><label>Category</label>
        <select class="form-input" id="f-category">
          ${['Work','Personal','Errands','Health','Family','Other'].map(c=>`<option value="${c}" ${editing?.category===c?'selected':''}>${c}</option>`).join('')}
        </select>
      </div>
    </div>
    <div class="form-row"><label>Notes <span class="hint">(optional)</span></label>
      <textarea class="form-input" id="f-notes" rows="2">${escapeHtml(editing?.notes||'')}</textarea>
    </div>
    <div class="checkbox-row">
      <input type="checkbox" id="f-reminder" ${editing?.reminder?'checked':''}>
      <label for="f-reminder">Remind me when this is due</label>
    </div>
    <div class="modal-actions">
      <button class="btn btn-ghost" onclick="closeModal()">Cancel</button>
      <button class="btn btn-primary" onclick="saveTodo(${editing?`'${editing.id}'`:'null'})">Save Task</button>
    </div>
  `);
}

function saveTodo(id){
  const text = document.getElementById('f-text').value.trim();
  if(!text){ showToast('Add some text first',''); return; }
  const data = {
    text,
    dueDate: document.getElementById('f-date').value,
    dueTime: document.getElementById('f-time').value,
    priority: document.getElementById('f-priority').value,
    category: document.getElementById('f-category').value,
    notes: document.getElementById('f-notes').value,
    reminder: document.getElementById('f-reminder').checked,
  };
  if(id){
    Object.assign(state.todos.find(t=>t.id===id), data);
  } else {
    state.todos.push(Object.assign({id:uid(), done:false, createdAt:Date.now(), order:state.todos.length}, data));
  }
  saveState();
  closeModal();
  rerenderActive();
  showToast(id?'Task updated':'Task added', text);
}

/* ----------------------------- ROUTINES ----------------------------- */
function renderRoutines(){
  const el = document.getElementById('page-routines');
  el.innerHTML = `
    <div class="page-header">
      <div>
        <div class="page-title">Routines</div>
        <div class="page-subtitle">Repeatable checklists for work, weekends, days off — whatever your life needs.</div>
      </div>
      <button class="btn btn-primary" onclick="openRoutineModal()">${ICONS.plus} New Routine</button>
    </div>
    ${state.routines.length ? `<div class="grid grid-3" id="routineGrid">${state.routines.map(r=>routineCardHtml(r,true)).join('')}</div>`
      : emptyState('↻','No routines yet','Create a routine like "Weekday Morning" or "Sunday Reset" and add its steps.')}
  `;
}

function routineCardHtml(r, full){
  const cat = ROUTINE_CATS[r.category] || ROUTINE_CATS.Custom;
  const doneCount = r.tasks.filter(t=>t.done).length;
  const pct = r.tasks.length ? Math.round(100*doneCount/r.tasks.length) : 0;
  const tasksToShow = full ? r.tasks : r.tasks.slice(0,3);
  return `<div class="card routine-card" data-id="${r.id}">
    <div class="routine-card-head">
      <span class="routine-cat" style="color:${cat.color};background:${cat.bg}">${escapeHtml(r.category)}</span>
      ${full ? `<div class="row-actions" style="opacity:1;">
        <button class="icon-btn" onclick="openRoutineModal('${r.id}')">${ICONS.edit}</button>
        <button class="icon-btn danger" onclick="deleteRoutine('${r.id}')">${ICONS.trash}</button>
      </div>` : ''}
    </div>
    <div class="routine-title">${escapeHtml(r.name)}</div>
    <div class="routine-tasks" data-routine="${r.id}">
      ${tasksToShow.map(t=>`
        <div class="routine-task ${t.done?'done':''}" data-id="${t.id}">
          <button class="checkbox" style="width:17px;height:17px;" onclick="toggleRoutineTask('${r.id}','${t.id}')">
            <span style="display:${t.done?'block':'none'};width:8px;height:8px;border-radius:2px;background:${cat.color};"></span>
          </button>
          <span class="routine-task-time">${t.time||''}</span>
          <span style="flex:1;">${escapeHtml(t.text)}</span>
          ${full?`<button class="icon-btn danger" style="width:22px;height:22px;" onclick="deleteRoutineTask('${r.id}','${t.id}')">${ICONS.trash}</button>`:''}
        </div>`).join('')}
      ${!full && r.tasks.length>3 ? `<div class="text-muted" style="font-size:11.5px;padding-left:8px;">+${r.tasks.length-3} more</div>` : ''}
    </div>
    ${full ? `<div class="mini-input-row">
      <input class="mini-input" placeholder="Add a step..." id="new-task-${r.id}" onkeydown="if(event.key==='Enter')addRoutineTask('${r.id}')">
      <button class="btn btn-ghost btn-sm" onclick="addRoutineTask('${r.id}')">Add</button>
    </div>` : ''}
    <div class="routine-progress-bar"><div class="routine-progress-fill" style="width:${pct}%;background:${cat.color}"></div></div>
  </div>`;
}

function toggleRoutineTask(rid,tid){
  const r = state.routines.find(x=>x.id===rid);
  const t = r?.tasks.find(x=>x.id===tid);
  if(!t) return;
  t.done = !t.done;
  saveState();
  rerenderActive();
}

function addRoutineTask(rid){
  const input = document.getElementById('new-task-'+rid);
  const text = input.value.trim();
  if(!text) return;
  const r = state.routines.find(x=>x.id===rid);
  r.tasks.push({id:uid(), text, time:'', done:false});
  saveState();
  rerenderActive();
}

function deleteRoutineTask(rid,tid){
  const r = state.routines.find(x=>x.id===rid);
  r.tasks = r.tasks.filter(t=>t.id!==tid);
  saveState();
  rerenderActive();
}

function deleteRoutine(id){
  if(!confirm('Delete this routine? This cannot be undone.')) return;
  state.routines = state.routines.filter(r=>r.id!==id);
  saveState();
  rerenderActive();
  showToast('Routine deleted','');
}

function openRoutineModal(id){
  const editing = id ? state.routines.find(r=>r.id===id) : null;
  openModal(`
    ${modalHeader(editing?'Edit Routine':'New Routine')}
    <div class="form-row"><label>Routine name</label>
      <input class="form-input" id="f-name" value="${escapeHtml(editing?.name||'')}" placeholder="e.g. Weekday Morning">
    </div>
    <div class="form-row"><label>Category</label>
      <select class="form-input" id="f-cat">
        ${Object.keys(ROUTINE_CATS).map(c=>`<option value="${c}" ${editing?.category===c?'selected':''}>${c}</option>`).join('')}
      </select>
    </div>
    <div class="modal-actions">
      <button class="btn btn-ghost" onclick="closeModal()">Cancel</button>
      <button class="btn btn-primary" onclick="saveRoutine(${editing?`'${editing.id}'`:'null'})">Save Routine</button>
    </div>
  `);
}

function saveRoutine(id){
  const name = document.getElementById('f-name').value.trim();
  if(!name){ showToast('Give it a name first',''); return; }
  const category = document.getElementById('f-cat').value;
  if(id){
    const r = state.routines.find(x=>x.id===id);
    r.name = name; r.category = category;
  } else {
    state.routines.push({id:uid(), name, category, tasks:[]});
  }
  saveState();
  closeModal();
  rerenderActive();
  showToast(id?'Routine updated':'Routine created', name);
}

/* ----------------------------- SHOPPING ----------------------------- */
function renderShopping(){
  const el = document.getElementById('page-shopping');
  el.innerHTML = `
    <div class="page-header">
      <div>
        <div class="page-title">Shopping Lists</div>
        <div class="page-subtitle">Groceries, household needs, personal items, family requests — all in one place.</div>
      </div>
      <button class="btn btn-primary" onclick="openShopListModal()">${ICONS.plus} New List</button>
    </div>
    ${state.shoppingLists.length ? `<div class="shopping-grid">${state.shoppingLists.map(l=>shopCardHtml(l,true)).join('')}</div>`
      : emptyState('🛒','No lists yet','Start with Groceries, Household, or a family member&#39;s wishlist.')}
  `;
  bindShopCardEvents(el);
}

function shopCardHtml(list, full){
  const remaining = list.items.filter(i=>!i.done).length;
  return `<div class="shop-card" data-id="${list.id}">
    <div class="shop-card-head">
      <div>
        <div class="shop-card-title">${escapeHtml(list.name)}</div>
        <div class="text-muted" style="font-size:11px;font-family:var(--font-mono);margin-top:2px;">${list.category} · ${remaining} left</div>
      </div>
      ${full ? `<div class="row-actions" style="opacity:1;">
        <button class="icon-btn" onclick="openShopListModal('${list.id}')">${ICONS.edit}</button>
        <button class="icon-btn danger" onclick="deleteShopList('${list.id}')">${ICONS.trash}</button>
      </div>` : ''}
    </div>
    <div class="shop-items" data-list="${list.id}">
      ${list.items.map(i=>`
        <div class="shop-item ${i.done?'done':''}" data-id="${i.id}">
          <button class="checkbox" style="width:18px;height:18px;" onclick="toggleShopItem('${list.id}','${i.id}')">${i.done?'<span style="width:8px;height:8px;background:var(--sage);border-radius:2px;"></span>':''}</button>
          <span class="shop-item-text">${escapeHtml(i.text)}</span>
          ${i.assignedTo ? `<span class="shop-item-owner">${escapeHtml(i.assignedTo)}</span>`:''}
          ${i.qty ? `<span class="shop-item-qty">${escapeHtml(i.qty)}</span>` : ''}
          ${full?`<button class="icon-btn danger" style="width:24px;height:24px;" onclick="deleteShopItem('${list.id}','${i.id}')">${ICONS.trash}</button>`:''}
        </div>`).join('')}
      ${!list.items.length ? `<div class="text-muted" style="font-size:12.5px;padding:6px;">List is empty</div>`:''}
    </div>
    ${full ? `<div class="mini-input-row">
      <input class="mini-input" placeholder="Add item..." id="new-item-${list.id}" onkeydown="if(event.key==='Enter')addShopItem('${list.id}')">
      <button class="btn btn-ghost btn-sm" onclick="addShopItem('${list.id}')">Add</button>
    </div>` : ''}
  </div>`;
}

function bindShopCardEvents(scopeEl){
  scopeEl.querySelectorAll('.shop-items').forEach(container=>{
    const listId = container.dataset.list;
    makeDraggable(container, '.shop-item', (ids)=>{
      const list = state.shoppingLists.find(l=>l.id===listId);
      if(!list) return;
      const reordered = ids.map(id=>list.items.find(i=>i.id===id)).filter(Boolean);
      list.items = reordered;
      saveState();
    });
  });
}

function toggleShopItem(listId,itemId){
  const list = state.shoppingLists.find(l=>l.id===listId);
  const item = list?.items.find(i=>i.id===itemId);
  if(!item) return;
  item.done = !item.done;
  saveState();
  rerenderActive();
}
function deleteShopItem(listId,itemId){
  const list = state.shoppingLists.find(l=>l.id===listId);
  list.items = list.items.filter(i=>i.id!==itemId);
  saveState();
  rerenderActive();
}
function addShopItem(listId){
  const input = document.getElementById('new-item-'+listId);
  const text = input.value.trim();
  if(!text) return;
  const list = state.shoppingLists.find(l=>l.id===listId);
  list.items.push({id:uid(), text, qty:'', done:false, assignedTo:''});
  saveState();
  rerenderActive();
}
function deleteShopList(id){
  if(!confirm('Delete this list?')) return;
  state.shoppingLists = state.shoppingLists.filter(l=>l.id!==id);
  saveState();
  rerenderActive();
  showToast('List deleted','');
}

function openShopListModal(id){
  const editing = id ? state.shoppingLists.find(l=>l.id===id) : null;
  openModal(`
    ${modalHeader(editing?'Edit List':'New Shopping List')}
    <div class="form-row"><label>List name</label>
      <input class="form-input" id="f-name" value="${escapeHtml(editing?.name||'')}" placeholder="e.g. Weekly Groceries">
    </div>
    <div class="form-row"><label>Category</label>
      <select class="form-input" id="f-cat">
        ${SHOP_CATS.map(c=>`<option value="${c}" ${editing?.category===c?'selected':''}>${c}</option>`).join('')}
      </select>
    </div>
    <div class="modal-actions">
      <button class="btn btn-ghost" onclick="closeModal()">Cancel</button>
      <button class="btn btn-primary" onclick="saveShopList(${editing?`'${editing.id}'`:'null'})">Save List</button>
    </div>
  `);
}
function saveShopList(id){
  const name = document.getElementById('f-name').value.trim();
  if(!name){ showToast('Name the list first',''); return; }
  const category = document.getElementById('f-cat').value;
  if(id){
    const l = state.shoppingLists.find(x=>x.id===id);
    l.name = name; l.category = category;
  } else {
    state.shoppingLists.push({id:uid(), name, category, items:[]});
  }
  saveState();
  closeModal();
  rerenderActive();
  showToast(id?'List updated':'List created', name);
}

/* ----------------------------- SCHEDULE ----------------------------- */
function eventOccursOnDate(ev, dateISO){
  const target = parseISO(dateISO);
  const start = parseISO(ev.startDate);
  if(!start) return false;
  if(target < stripTime(start)) return false;
  switch(ev.recurrence){
    case 'none':
      return ev.startDate === dateISO;
    case 'weekly': {
      const days = ev.daysOfWeek && ev.daysOfWeek.length ? ev.daysOfWeek : [start.getDay()];
      return days.includes(target.getDay());
    }
    case 'monthly':
      return target.getDate() === start.getDate();
    case 'annually':
      return target.getDate() === start.getDate() && target.getMonth() === start.getMonth();
    default:
      return false;
  }
}
function stripTime(d){ const x = new Date(d); x.setHours(0,0,0,0); return x; }

function getEventsForDate(dateISO){
  return state.scheduleEvents.filter(ev=> eventOccursOnDate(ev, dateISO));
}

function renderSchedule(){
  const el = document.getElementById('page-schedule');
  const y = state.ui.calYear, m = state.ui.calMonth;
  el.innerHTML = `
    <div class="page-header">
      <div>
        <div class="page-title">Work Schedule</div>
        <div class="page-subtitle">Shifts and recurring commitments — weekly, monthly, or annual.</div>
      </div>
      <button class="btn btn-primary" onclick="openScheduleModal()">${ICONS.plus} Add Event</button>
    </div>
    <div class="cal-wrap">
      <div class="card">
        <div class="cal-header">
          <div class="cal-title">${MONTHS[m]} ${y}</div>
          <div class="cal-nav">
            <button class="icon-btn" onclick="calShift(-1)">${ICONS.chevL}</button>
            <button class="btn btn-ghost btn-sm" onclick="calToday()">Today</button>
            <button class="icon-btn" onclick="calShift(1)">${ICONS.chevR}</button>
          </div>
        </div>
        <div class="cal-grid" id="calGrid">${renderCalGrid(y,m)}</div>
      </div>
      <div class="agenda-panel" id="agendaPanel">${renderAgenda(state.ui.selectedDate)}</div>
    </div>
    <div class="section-block" style="margin-top:28px;">
      <div class="section-heading"><h3>All Recurring Events</h3></div>
      <div class="schedule-list">
        ${state.scheduleEvents.length ? state.scheduleEvents.map(ev=>scheduleRowHtml(ev)).join('') : ''}
      </div>
      ${!state.scheduleEvents.length ? emptyState('📅','No events yet','Add your work shifts or recurring commitments.') : ''}
    </div>
  `;
}

function renderCalGrid(y,m){
  const firstDay = new Date(y,m,1);
  const startOffset = firstDay.getDay();
  const daysInMonth = new Date(y,m+1,0).getDate();
  const daysInPrevMonth = new Date(y,m,0).getDate();
  let html = DOW.map(d=>`<div class="cal-dow">${d}</div>`).join('');
  const totalCells = Math.ceil((startOffset+daysInMonth)/7)*7;
  for(let i=0;i<totalCells;i++){
    const dayNum = i - startOffset + 1;
    let cellDate, otherMonth=false;
    if(dayNum < 1){ cellDate = new Date(y, m-1, daysInPrevMonth+dayNum); otherMonth=true; }
    else if(dayNum > daysInMonth){ cellDate = new Date(y, m+1, dayNum-daysInMonth); otherMonth=true; }
    else cellDate = new Date(y,m,dayNum);
    const iso = isoOf(cellDate);
    const isToday = iso === todayISO();
    const isSelected = iso === state.ui.selectedDate;
    const evs = getEventsForDate(iso);
    const todos = state.todos.filter(t=>t.dueDate===iso && !t.done);
    let dots = '';
    if(evs.length) dots += `<span class="cal-dot" style="background:var(--sky)"></span>`;
    if(todos.length) dots += `<span class="cal-dot" style="background:var(--gold)"></span>`;
    html += `<div class="cal-cell ${otherMonth?'other-month':''} ${isToday?'today':''} ${isSelected?'selected':''}" onclick="selectCalDate('${iso}')">
      <span class="cal-daynum">${cellDate.getDate()}</span>
      <div class="cal-dots">${dots}</div>
    </div>`;
  }
  return html;
}

function isoOf(d){ return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0'); }

function calShift(delta){
  let m = state.ui.calMonth + delta;
  let y = state.ui.calYear;
  if(m<0){m=11;y--;} if(m>11){m=0;y++;}
  state.ui.calMonth=m; state.ui.calYear=y;
  saveState();
  renderSchedule();
}
function calToday(){
  const d = new Date();
  state.ui.calMonth = d.getMonth(); state.ui.calYear = d.getFullYear();
  state.ui.selectedDate = todayISO();
  saveState();
  renderSchedule();
}
function selectCalDate(iso){
  state.ui.selectedDate = iso;
  saveState();
  document.getElementById('calGrid').innerHTML = renderCalGrid(state.ui.calYear, state.ui.calMonth);
  document.getElementById('agendaPanel').innerHTML = renderAgenda(iso);
}

function renderAgenda(iso){
  const d = parseISO(iso);
  const evs = getEventsForDate(iso);
  const todos = state.todos.filter(t=>t.dueDate===iso);
  let html = `<div class="agenda-date">${DOW[d.getDay()]}, ${MONTHS[d.getMonth()]} ${d.getDate()}</div>`;
  if(!evs.length && !todos.length) html += `<div class="text-muted" style="font-size:13px;">Nothing scheduled.</div>`;
  evs.forEach(ev=>{
    html += `<div class="agenda-event">
      <div class="agenda-event-title">${escapeHtml(ev.title)}</div>
      <div class="agenda-event-time">${ev.startTime?formatTime(ev.startTime):''}${ev.endTime?' – '+formatTime(ev.endTime):''}</div>
      ${ev.recurrence!=='none'?`<div class="agenda-event-recur">Repeats ${ev.recurrence}</div>`:''}
    </div>`;
  });
  todos.forEach(t=>{
    html += `<div class="agenda-event" style="border-left-color:var(--sage);">
      <div class="agenda-event-title">${t.done?'✓ ':''}${escapeHtml(t.text)}</div>
      <div class="agenda-event-time">${t.dueTime?formatTime(t.dueTime):'To-do'}</div>
    </div>`;
  });
  return html;
}

function scheduleRowHtml(ev){
  const recurLabel = ev.recurrence==='none' ? fmtDate(ev.startDate) : 'Repeats '+ev.recurrence + (ev.recurrence==='weekly'&&ev.daysOfWeek?.length ? ' on '+ev.daysOfWeek.map(d=>DOW[d]).join(', ') : '');
  return `<div class="schedule-row" data-id="${ev.id}">
    <div class="schedule-icon">${ICONS.briefcase}</div>
    <div style="flex:1;">
      <div style="font-weight:600;font-size:14px;">${escapeHtml(ev.title)}</div>
      <div class="text-muted" style="font-size:12px;margin-top:2px;">${ev.startTime?formatTime(ev.startTime):''}${ev.endTime?' – '+formatTime(ev.endTime):''} · ${recurLabel}</div>
    </div>
    <div class="row-actions" style="opacity:1;">
      <button class="icon-btn" onclick="openScheduleModal('${ev.id}')">${ICONS.edit}</button>
      <button class="icon-btn danger" onclick="deleteScheduleEvent('${ev.id}')">${ICONS.trash}</button>
    </div>
  </div>`;
}

function deleteScheduleEvent(id){
  state.scheduleEvents = state.scheduleEvents.filter(e=>e.id!==id);
  saveState();
  rerenderActive();
  showToast('Event removed','');
}

function openScheduleModal(id){
  const editing = id ? state.scheduleEvents.find(e=>e.id===id) : null;
  const selectedDays = editing?.daysOfWeek || [];
  openModal(`
    ${modalHeader(editing?'Edit Event':'New Schedule Event')}
    <div class="form-row"><label>Title</label>
      <input class="form-input" id="f-title" value="${escapeHtml(editing?.title||'')}" placeholder="e.g. Work Shift, Team Meeting">
    </div>
    <div class="form-grid2">
      <div class="form-row"><label>Start date</label>
        <input type="date" class="form-input" id="f-date" value="${editing?.startDate||todayISO()}">
      </div>
      <div class="form-row"><label>Recurrence</label>
        <select class="form-input" id="f-recur" onchange="toggleDayPicker()">
          <option value="none" ${editing?.recurrence==='none'?'selected':''}>Does not repeat</option>
          <option value="weekly" ${editing?.recurrence==='weekly'?'selected':''}>Weekly</option>
          <option value="monthly" ${editing?.recurrence==='monthly'?'selected':''}>Monthly</option>
          <option value="annually" ${editing?.recurrence==='annually'?'selected':''}>Annually</option>
        </select>
      </div>
    </div>
    <div class="form-grid2">
      <div class="form-row"><label>Start time</label>
        <input type="time" class="form-input" id="f-start" value="${editing?.startTime||''}">
      </div>
      <div class="form-row"><label>End time</label>
        <input type="time" class="form-input" id="f-end" value="${editing?.endTime||''}">
      </div>
    </div>
    <div class="form-row" id="dayPickerRow" style="display:${editing?.recurrence==='weekly'?'flex':'none'};">
      <label>Repeats on</label>
      <div class="day-picker" id="dayPicker">
        ${DOW.map((d,i)=>`<button type="button" class="day-pick ${selectedDays.includes(i)?'active':''}" data-day="${i}" onclick="this.classList.toggle('active')">${d}</button>`).join('')}
      </div>
    </div>
    <div class="form-row"><label>Notes <span class="hint">(optional)</span></label>
      <textarea class="form-input" id="f-notes" rows="2">${escapeHtml(editing?.notes||'')}</textarea>
    </div>
    <div class="modal-actions">
      <button class="btn btn-ghost" onclick="closeModal()">Cancel</button>
      <button class="btn btn-primary" onclick="saveScheduleEvent(${editing?`'${editing.id}'`:'null'})">Save Event</button>
    </div>
  `);
}
function toggleDayPicker(){
  const recur = document.getElementById('f-recur').value;
  document.getElementById('dayPickerRow').style.display = recur==='weekly' ? 'flex' : 'none';
}
function saveScheduleEvent(id){
  const title = document.getElementById('f-title').value.trim();
  if(!title){ showToast('Give the event a title',''); return; }
  const recurrence = document.getElementById('f-recur').value;
  const daysOfWeek = Array.from(document.querySelectorAll('#dayPicker .day-pick.active')).map(b=>Number(b.dataset.day));
  const data = {
    title,
    startDate: document.getElementById('f-date').value,
    startTime: document.getElementById('f-start').value,
    endTime: document.getElementById('f-end').value,
    recurrence,
    daysOfWeek,
    notes: document.getElementById('f-notes').value,
  };
  if(id){
    Object.assign(state.scheduleEvents.find(e=>e.id===id), data);
  } else {
    state.scheduleEvents.push(Object.assign({id:uid()}, data));
  }
  saveState();
  closeModal();
  rerenderActive();
  showToast(id?'Event updated':'Event added', title);
}

/* ----------------------------- INCOME SETUP ----------------------------- */
function renderIncome(){
  const el = document.getElementById('page-income');
  const inc = state.income;
  el.innerHTML = `
    <div class="page-header">
      <div>
        <div class="page-title">Income Setup</div>
        <div class="page-subtitle">Tell Cadence how you're paid so it can estimate paychecks and count down to payday.</div>
      </div>
    </div>
    <div class="grid grid-2">
      <div class="income-form-card">
        <div class="form-row"><label>How are you paid?</label>
          <select class="form-input" id="f-paytype" onchange="onPayTypeChange()">
            <option value="hourly" ${inc.payType==='hourly'?'selected':''}>By the hour</option>
            <option value="daily" ${inc.payType==='daily'?'selected':''}>By the day</option>
            <option value="weekly" ${inc.payType==='weekly'?'selected':''}>Weekly rate</option>
            <option value="biweekly" ${inc.payType==='biweekly'?'selected':''}>Bi-weekly rate</option>
            <option value="monthly" ${inc.payType==='monthly'?'selected':''}>Monthly rate</option>
          </select>
        </div>
        <div class="form-row">
          <label id="rateLabel">Rate</label>
          <input type="number" step="0.01" class="form-input" id="f-rate" value="${inc.rate||''}" placeholder="0.00">
        </div>
        <div class="form-row" id="hoursRow" style="display:${(inc.payType==='hourly')?'flex':'none'};flex-direction:column;">
          <label>Hours per week</label>
          <input type="number" class="form-input" id="f-hours" value="${inc.hoursPerWeek||40}">
        </div>
        <div class="form-row"><label>How often do you actually get paid?</label>
          <select class="form-input" id="f-payfreq">
            <option value="weekly" ${inc.payFrequency==='weekly'?'selected':''}>Weekly</option>
            <option value="biweekly" ${inc.payFrequency==='biweekly'?'selected':''}>Bi-weekly (every 2 weeks)</option>
            <option value="semimonthly" ${inc.payFrequency==='semimonthly'?'selected':''}>Semi-monthly (twice a month)</option>
            <option value="monthly" ${inc.payFrequency==='monthly'?'selected':''}>Monthly</option>
          </select>
        </div>
        <div class="form-row"><label>Most recent payday</label>
          <input type="date" class="form-input" id="f-lastpay" value="${inc.lastPayDate||''}">
          <span class="hint">Used to calculate your next payday countdown.</span>
        </div>
        <div class="form-row"><label>Estimated tax / deduction rate <span class="hint">(rough %, for net estimate)</span></label>
          <input type="number" class="form-input" id="f-tax" value="${inc.taxRatePct}" min="0" max="80">
        </div>
        <button class="btn btn-primary" onclick="saveIncome()" style="width:100%;justify-content:center;margin-top:6px;">Save Income Details</button>
      </div>
      <div>
        <div class="paycheck-hero" style="margin-bottom:16px;">
          ${incomeSummaryHtml()}
        </div>
        <div class="card">
          <div class="section-heading" style="margin-bottom:10px;"><h3 style="font-size:14px;">What this means</h3></div>
          <p class="text-muted" style="font-size:13px;line-height:1.6;margin:0;">
            Cadence estimates your gross and net pay per period from these numbers, then counts down to your next payday
            based on your last payday and pay frequency. Log actual paychecks in the Paycheck Tracker for a real history.
          </p>
        </div>
      </div>
    </div>
  `;
}

function onPayTypeChange(){
  const type = document.getElementById('f-paytype').value;
  const labels = {hourly:'Hourly rate ($/hr)', daily:'Daily rate ($/day)', weekly:'Weekly pay ($)', biweekly:'Bi-weekly pay ($)', monthly:'Monthly pay ($)'};
  document.getElementById('rateLabel').textContent = labels[type];
  document.getElementById('hoursRow').style.display = type==='hourly' ? 'flex' : 'none';
}

function incomeSummaryHtml(){
  const gross = estimateGrossPerPeriod();
  const net = estimateNetPerPeriod();
  const next = computeNextPayDate();
  const days = next ? daysUntil(next) : null;
  return `
    <div class="days-num">${days===null?'—':(days===0?'Today':days)}</div>
    <div class="days-label">${days===null?'Set your last payday to start the countdown':(days===0?"You get paid today":'days until your next paycheck')}</div>
    <div class="est-amount">Est. ${fmtMoney(gross)} gross · ${fmtMoney(net)} net</div>
  `;
}

function saveIncome(){
  state.income = {
    payType: document.getElementById('f-paytype').value,
    rate: Number(document.getElementById('f-rate').value)||0,
    hoursPerWeek: Number(document.getElementById('f-hours').value)||0,
    payFrequency: document.getElementById('f-payfreq').value,
    lastPayDate: document.getElementById('f-lastpay').value,
    taxRatePct: Number(document.getElementById('f-tax').value)||0,
    salaryAnnual: state.income.salaryAnnual||0,
  };
  saveState();
  renderIncome();
  renderPaydayPill();
  showToast('Income details saved','Your payday countdown is up to date.');
}

/* ----------------------------- PAYCHECK TRACKER ----------------------------- */
function renderPaychecks(){
  const el = document.getElementById('page-paychecks');
  const next = computeNextPayDate();
  const days = next ? daysUntil(next) : null;
  const net = estimateNetPerPeriod();
  const checks = [...state.paychecks].sort((a,b)=> b.date.localeCompare(a.date));
  const ytdTotal = checks.filter(c=>c.date.startsWith(String(new Date().getFullYear()))).reduce((s,c)=>s+Number(c.netAmount||0),0);

  el.innerHTML = `
    <div class="page-header">
      <div>
        <div class="page-title">Paycheck Tracker</div>
        <div class="page-subtitle">Keep a running record of pay periods and paychecks received.</div>
      </div>
      <button class="btn btn-primary" onclick="openPaycheckModal()">${ICONS.plus} Log Paycheck</button>
    </div>

    <div class="paycheck-hero">
      ${incomeSummaryHtml()}
    </div>

    <div class="grid grid-3 section-block">
      <div class="card stat-card stat-accent-sage">
        <div class="stat-label">Logged This Year</div>
        <div class="stat-value">${fmtMoney(ytdTotal)}</div>
        <div class="stat-sub">${checks.filter(c=>c.date.startsWith(String(new Date().getFullYear()))).length} paychecks</div>
      </div>
      <div class="card stat-card stat-accent-gold">
        <div class="stat-label">Pay Frequency</div>
        <div class="stat-value" style="font-size:20px;">${cap(state.income.payFrequency||'—')}</div>
        <div class="stat-sub">${cap(state.income.payType)} basis</div>
      </div>
      <div class="card stat-card stat-accent-sky">
        <div class="stat-label">Total Logged</div>
        <div class="stat-value">${checks.length}</div>
        <div class="stat-sub">paychecks on record</div>
      </div>
    </div>

    <div class="section-heading"><h3>Paycheck History</h3></div>
    ${checks.length ? `
    <div class="card" style="padding:0;overflow-x:auto;">
      <table class="pay-table">
        <thead><tr><th>Date</th><th>Period</th><th>Gross</th><th>Net</th><th>Hours</th><th></th></tr></thead>
        <tbody>
          ${checks.map(c=>`<tr>
            <td>${fmtDate(c.date)}</td>
            <td class="text-muted">${c.periodStart&&c.periodEnd ? fmtDate(c.periodStart)+' – '+fmtDate(c.periodEnd) : '—'}</td>
            <td class="pay-amount">${fmtMoney(Number(c.grossAmount||0))}</td>
            <td class="pay-amount">${fmtMoney(Number(c.netAmount||0))}</td>
            <td class="text-muted">${c.hoursWorked||'—'}</td>
            <td>
              <div class="row-actions" style="opacity:1;justify-content:flex-end;">
                <button class="icon-btn" onclick="openPaycheckModal('${c.id}')">${ICONS.edit}</button>
                <button class="icon-btn danger" onclick="deletePaycheck('${c.id}')">${ICONS.trash}</button>
              </div>
            </td>
          </tr>`).join('')}
        </tbody>
      </table>
    </div>` : emptyState('$','No paychecks logged yet','Log your first one to start building a history.')}
  `;
}

function deletePaycheck(id){
  state.paychecks = state.paychecks.filter(c=>c.id!==id);
  saveState();
  rerenderActive();
  showToast('Paycheck removed','');
}

function openPaycheckModal(id){
  const editing = id ? state.paychecks.find(c=>c.id===id) : null;
  openModal(`
    ${modalHeader(editing?'Edit Paycheck':'Log Paycheck')}
    <div class="form-grid2">
      <div class="form-row"><label>Pay date</label>
        <input type="date" class="form-input" id="f-date" value="${editing?.date||todayISO()}">
      </div>
      <div class="form-row"><label>Hours worked <span class="hint">(optional)</span></label>
        <input type="number" class="form-input" id="f-hours" value="${editing?.hoursWorked||''}">
      </div>
    </div>
    <div class="form-grid2">
      <div class="form-row"><label>Period start <span class="hint">(optional)</span></label>
        <input type="date" class="form-input" id="f-pstart" value="${editing?.periodStart||''}">
      </div>
      <div class="form-row"><label>Period end <span class="hint">(optional)</span></label>
        <input type="date" class="form-input" id="f-pend" value="${editing?.periodEnd||''}">
      </div>
    </div>
    <div class="form-grid2">
      <div class="form-row"><label>Gross amount</label>
        <input type="number" step="0.01" class="form-input" id="f-gross" value="${editing?.grossAmount||''}" placeholder="0.00">
      </div>
      <div class="form-row"><label>Net amount (take-home)</label>
        <input type="number" step="0.01" class="form-input" id="f-net" value="${editing?.netAmount||''}" placeholder="0.00">
      </div>
    </div>
    <div class="form-row"><label>Notes <span class="hint">(optional)</span></label>
      <textarea class="form-input" id="f-notes" rows="2">${escapeHtml(editing?.notes||'')}</textarea>
    </div>
    <div class="modal-actions">
      <button class="btn btn-ghost" onclick="closeModal()">Cancel</button>
      <button class="btn btn-primary" onclick="savePaycheck(${editing?`'${editing.id}'`:'null'})">Save Paycheck</button>
    </div>
  `);
}

function savePaycheck(id){
  const date = document.getElementById('f-date').value;
  if(!date){ showToast('Pick a pay date',''); return; }
  const data = {
    date,
    hoursWorked: document.getElementById('f-hours').value,
    periodStart: document.getElementById('f-pstart').value,
    periodEnd: document.getElementById('f-pend').value,
    grossAmount: Number(document.getElementById('f-gross').value)||0,
    netAmount: Number(document.getElementById('f-net').value)||0,
    notes: document.getElementById('f-notes').value,
  };
  if(id){
    Object.assign(state.paychecks.find(c=>c.id===id), data);
  } else {
    state.paychecks.push(Object.assign({id:uid()}, data));
  }
  // Update lastPayDate if this is the most recent
  if(!state.income.lastPayDate || date >= state.income.lastPayDate){
    state.income.lastPayDate = date;
  }
  saveState();
  closeModal();
  rerenderActive();
  showToast(id?'Paycheck updated':'Paycheck logged', fmtMoney(data.netAmount));
}

