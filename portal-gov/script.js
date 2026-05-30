const tableData = [
  { id: 1, concepto: 'Mantenimiento de escuelas', categoria: 'Educación', monto: 245000, fecha: '2026-03-15', estado: 'Completado' },
  { id: 2, concepto: 'Campaña de vacunación', categoria: 'Salud', monto: 189000, fecha: '2026-03-10', estado: 'Completado' },
  { id: 3, concepto: 'Repavimentación Av. Central', categoria: 'Infraestructura', monto: 520000, fecha: '2026-02-28', estado: 'Proceso' },
  { id: 4, concepto: 'Feria del libro municipal', categoria: 'Cultura', monto: 45000, fecha: '2026-03-20', estado: 'Pendiente' },
  { id: 5, concepto: 'Patrullaje vecinal', categoria: 'Seguridad', monto: 178000, fecha: '2026-03-01', estado: 'Completado' },
  { id: 6, concepto: 'Becas estudiantiles', categoria: 'Educación', monto: 312000, fecha: '2026-03-05', estado: 'Proceso' },
  { id: 7, concepto: 'Centro de salud móvil', categoria: 'Salud', monto: 267000, fecha: '2026-02-20', estado: 'Completado' },
  { id: 8, concepto: 'Parque lineal sur', categoria: 'Infraestructura', monto: 890000, fecha: '2026-03-18', estado: 'Pendiente' },
  { id: 9, concepto: 'Talleres de arte juvenil', categoria: 'Cultura', monto: 32000, fecha: '2026-03-12', estado: 'Completado' },
  { id: 10, concepto: 'Alumbrado público', categoria: 'Seguridad', monto: 415000, fecha: '2026-02-25', estado: 'Proceso' },
  { id: 11, concepto: 'Biblioteca digital', categoria: 'Educación', monto: 98000, fecha: '2026-03-22', estado: 'Pendiente' },
  { id: 12, concepto: 'Ambulancias nuevas', categoria: 'Salud', monto: 650000, fecha: '2026-03-08', estado: 'Completado' },
  { id: 13, concepto: 'Ciclovía recreativa', categoria: 'Infraestructura', monto: 230000, fecha: '2026-03-14', estado: 'Proceso' },
  { id: 14, concepto: 'Concurso de fotografía', categoria: 'Cultura', monto: 18000, fecha: '2026-03-25', estado: 'Pendiente' },
  { id: 15, concepto: 'Cámaras vigilancia', categoria: 'Seguridad', monto: 345000, fecha: '2026-02-18', estado: 'Completado' },
  { id: 16, concepto: 'Capacitación docente', categoria: 'Educación', monto: 76000, fecha: '2026-03-28', estado: 'Pendiente' },
  { id: 17, concepto: 'Jornada oftalmológica', categoria: 'Salud', monto: 124000, fecha: '2026-03-02', estado: 'Completado' },
  { id: 18, concepto: 'Puente peatonal', categoria: 'Infraestructura', monto: 780000, fecha: '2026-03-30', estado: 'Pendiente' },
  { id: 19, concepto: 'Orquesta sinfónica juvenil', categoria: 'Cultura', monto: 56000, fecha: '2026-03-07', estado: 'Proceso' },
  { id: 20, concepto: 'Botón de pánico app', categoria: 'Seguridad', monto: 92000, fecha: '2026-03-19', estado: 'Completado' },
  { id: 21, concepto: 'Laboratorios escolares', categoria: 'Educación', monto: 195000, fecha: '2026-03-16', estado: 'Proceso' },
  { id: 22, concepto: 'Campaña dental infantil', categoria: 'Salud', monto: 83000, fecha: '2026-03-21', estado: 'Pendiente' },
  { id: 23, concepto: 'Mercado municipal', categoria: 'Infraestructura', monto: 1200000, fecha: '2026-02-10', estado: 'Completado' },
  { id: 24, concepto: 'Noche de museos', categoria: 'Cultura', monto: 28000, fecha: '2026-03-26', estado: 'Pendiente' }
];

let currentPage = 1;
const perPage = 10;
let filteredData = [...tableData];
let sortDir = {};

function renderTable() {
  const start = (currentPage - 1) * perPage;
  const page = filteredData.slice(start, start + perPage);
  const tbody = document.getElementById('tableBody');
  tbody.innerHTML = page.map(r => `
    <tr>
      <td>${r.id}</td>
      <td>${r.concepto}</td>
      <td>${r.categoria}</td>
      <td>$${r.monto.toLocaleString()}</td>
      <td>${r.fecha}</td>
      <td><span class="status-badge ${r.estado.toLowerCase()}">${r.estado}</span></td>
    </tr>
  `).join('');
  document.getElementById('tableInfo').textContent =
    `Mostrando ${start + 1}-${Math.min(start + perPage, filteredData.length)} de ${filteredData.length}`;
  renderPagination();
}

function renderPagination() {
  const total = Math.ceil(filteredData.length / perPage);
  const container = document.getElementById('pagination');
  let html = `<button onclick="goPage(${currentPage - 1})" ${currentPage <= 1 ? 'disabled' : ''}>←</button>`;
  for (let i = 1; i <= total; i++) {
    html += `<button class="${i === currentPage ? 'active' : ''}" onclick="goPage(${i})">${i}</button>`;
  }
  html += `<button onclick="goPage(${currentPage + 1})" ${currentPage >= total ? 'disabled' : ''}>→</button>`;
  container.innerHTML = html;
}

function goPage(n) {
  if (n < 1 || n > Math.ceil(filteredData.length / perPage)) return;
  currentPage = n;
  renderTable();
  document.querySelector('.table-wrapper').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function filterTable() {
  const q = document.getElementById('searchInput').value.toLowerCase();
  const cat = document.getElementById('categoryFilter').value;
  filteredData = tableData.filter(r => {
    const matchText = r.concepto.toLowerCase().includes(q);
    const matchCat = cat === 'all' || r.categoria === cat;
    return matchText && matchCat;
  });
  currentPage = 1;
  renderTable();
}

function sortTable(col) {
  const key = ['id', 'concepto', 'categoria', 'monto', 'fecha', 'estado'][col];
  sortDir[key] = !(sortDir[key]);
  const dir = sortDir[key] ? 1 : -1;
  filteredData.sort((a, b) => {
    const va = a[key], vb = b[key];
    if (typeof va === 'string') return va.localeCompare(vb) * dir;
    return (va - vb) * dir;
  });
  renderTable();
}

function navigate(section) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
  document.getElementById('sec-' + section).classList.add('active');
  document.querySelector(`.nav-links a[data-section="${section}"]`).classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });

  if (section === 'inicio') animateHeroCounters();
  if (section === 'tramites') observeTramites();
}

function animateHeroCounters() {
  document.querySelectorAll('.hero-stat .num').forEach(el => {
    const target = parseInt(el.dataset.target);
    animateCounter(el, target, 2000);
  });
}

function animateCounter(el, target, duration) {
  const start = performance.now();
  const step = (ts) => {
    const p = Math.min((ts - start) / duration, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.floor(eased * target).toLocaleString();
    if (p < 1) requestAnimationFrame(step);
    else el.textContent = target.toLocaleString();
  };
  requestAnimationFrame(step);
}

function observeTramites() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); }
    });
  }, { threshold: .15 });
  document.querySelectorAll('.tramite-card.reveal').forEach(el => observer.observe(el));
}

function submitContact(e) {
  e.preventDefault();
  document.getElementById('contactForm').reset();
  showToast('✅ Mensaje enviado correctamente — demo visual');
}

function showToast(msg) {
  const container = document.getElementById('toastContainer');
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = msg;
  container.appendChild(toast);
  setTimeout(() => { toast.classList.add('out'); setTimeout(() => toast.remove(), 400); }, 2500);
}

document.addEventListener('DOMContentLoaded', () => {
  renderTable();
  animateHeroCounters();
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); } });
  }, { threshold: .15 });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
});
