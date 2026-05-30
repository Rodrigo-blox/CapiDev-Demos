const themeKey = 'dashboard-theme';
let currentTheme = localStorage.getItem(themeKey) || 'light';

const users = [
  { name: 'Ana Martínez', role: 'Admin', email: 'ana@demo.com', status: 'Activo', img: 'https://ui-avatars.com/api/?name=Ana+Martinez&background=6366f1&color=fff' },
  { name: 'Carlos López', role: 'Editor', email: 'carlos@demo.com', status: 'Activo', img: 'https://ui-avatars.com/api/?name=Carlos+Lopez&background=22c55e&color=fff' },
  { name: 'María García', role: 'Usuario', email: 'maria@demo.com', status: 'Inactivo', img: 'https://ui-avatars.com/api/?name=Maria+Garcia&background=f59e0b&color=fff' },
  { name: 'Roberto Sánchez', role: 'Admin', email: 'roberto@demo.com', status: 'Activo', img: 'https://ui-avatars.com/api/?name=Roberto+Sanchez&background=ef4444&color=fff' },
  { name: 'Laura Jiménez', role: 'Editor', email: 'laura@demo.com', status: 'Activo', img: 'https://ui-avatars.com/api/?name=Laura+Jimenez&background=8b5cf6&color=fff' },
  { name: 'Pedro Ramírez', role: 'Usuario', email: 'pedro@demo.com', status: 'Inactivo', img: 'https://ui-avatars.com/api/?name=Pedro+Ramirez&background=06b6d4&color=fff' },
  { name: 'Sofía Torres', role: 'Usuario', email: 'sofia@demo.com', status: 'Activo', img: 'https://ui-avatars.com/api/?name=Sofia+Torres&background=f97316&color=fff' }
];

function init() {
  setTheme(currentTheme);
  renderUsers();
  renderBarChart();
  renderDonutChart();
  animateProgressOnView();
  startCounters();

  document.querySelectorAll('.reveal').forEach(el => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); }
      });
    }, { threshold: .1 });
    observer.observe(el);
  });
}

function setTheme(theme) {
  currentTheme = theme;
  document.getElementById('appBody').className = theme;
  const toggle = document.querySelector('.sidebar-footer .toggle');
  toggle.classList.toggle('active', theme === 'dark');
  localStorage.setItem(themeKey, theme);
}

function toggleTheme() {
  setTheme(currentTheme === 'light' ? 'dark' : 'light');
}

function navigate(view) {
  document.querySelectorAll('.sidebar-nav a').forEach(a => a.classList.remove('active'));
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.querySelector(`.sidebar-nav a[data-view="${view}"]`).classList.add('active');
  document.getElementById('view-' + view).classList.add('active');

  if (view === 'inicio') {
    startCounters();
    animateProgressOnView();
  }

  if (view === 'analytics') {
    setTimeout(animateProgressBars, 200);
  }
}

function startCounters() {
  document.querySelectorAll('.counter').forEach(el => {
    const target = parseFloat(el.dataset.target);
    const duration = 2000;
    const start = performance.now();
    const step = (ts) => {
      const p = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      if (Number.isInteger(target)) {
        el.textContent = Math.floor(eased * target).toLocaleString();
      } else {
        el.textContent = (eased * target).toFixed(1);
      }
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = target.toLocaleString();
    };
    requestAnimationFrame(step);
  });
}

function renderBarChart() {
  const data = [
    { label: 'Ene', value: 65 }, { label: 'Feb', value: 72 }, { label: 'Mar', value: 80 },
    { label: 'Abr', value: 68 }, { label: 'May', value: 85 }, { label: 'Jun', value: 92 },
    { label: 'Jul', value: 78 }
  ];
  const max = Math.max(...data.map(d => d.value));
  const chart = document.getElementById('barChart');
  chart.innerHTML = data.map((d, i) => `
    <div class="bar-item">
      <div class="bar-fill" style="height:${(d.value / max) * 100}%;transition-delay:${i * 0.08}s"></div>
      <span>${d.label}</span>
    </div>
  `).join('');
}

function renderDonutChart() {
  const segments = [
    { label: 'Ventas', pct: 45, color: '#6366f1' },
    { label: 'Suscripciones', pct: 25, color: '#22c55e' },
    { label: 'Publicidad', pct: 18, color: '#f59e0b' },
    { label: 'Otros', pct: 12, color: '#ef4444' }
  ];

  const donut = document.getElementById('donutChart');
  const legend = document.getElementById('donutLegend');

  let conic = segments.map((s, i) => {
    const start = segments.slice(0, i).reduce((a, b) => a + b.pct, 0);
    return `${s.color} ${start}% ${start + s.pct}%`;
  }).join(', ');

  donut.style.background = `conic-gradient(${conic})`;

  legend.innerHTML = segments.map(s =>
    `<span style="color:${s.color}">${s.label} — ${s.pct}%</span>`
  ).join('');
}

function animateProgressOnView() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.querySelectorAll('.progress-fill').forEach(el => {
          el.style.width = el.dataset.width + '%';
        });
        observer.unobserve(e.target);
      }
    });
  }, { threshold: .3 });

  document.querySelectorAll('.analytics-card').forEach(el => observer.observe(el));
}

function animateProgressBars() {
  document.querySelectorAll('.progress-fill').forEach(el => {
    el.style.width = el.dataset.width + '%';
  });
}

function renderUsers() {
  const tbody = document.getElementById('usersBody');
  tbody.innerHTML = users.map(u => `
    <tr>
      <td><div class="user-cell"><img src="${u.img}" alt="${u.name}">${u.name}</div></td>
      <td>${u.role}</td>
      <td>${u.email}</td>
      <td><span class="status-dot ${u.status.toLowerCase()}">${u.status}</span></td>
    </tr>
  `).join('');
}

function filterUsers(q) {
  const rows = document.querySelectorAll('#usersBody tr');
  rows.forEach(row => {
    row.style.display = row.textContent.toLowerCase().includes(q.toLowerCase()) ? '' : 'none';
  });
}

function showToast(msg) {
  const container = document.getElementById('toastContainer');
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = msg;
  container.appendChild(toast);
  setTimeout(() => { toast.classList.add('out'); setTimeout(() => toast.remove(), 400); }, 2500);
}

document.addEventListener('DOMContentLoaded', init);
