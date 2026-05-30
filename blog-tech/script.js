const articles = [
  { id: 1, title: 'Cómo funciona el servidor HTTP de Node.js por dentro', excerpt: 'Exploramos el event loop, el parser HTTP y cómo Node.js maneja conexiones concurrentes sin bloqueo.', category: 'Backend', tag: 'js', date: '28 Mar 2026', img: 'https://picsum.photos/seed/nodejs/640/360' },
  { id: 2, title: 'CSS Container Queries: la guía definitiva', excerpt: 'Los container queries llegaron para quedarse. Aprende a usarlos para crear diseños verdaderamente modulares.', category: 'CSS', tag: 'css', date: '25 Mar 2026', img: 'https://picsum.photos/seed/css/640/360' },
  { id: 3, title: 'Python 3.13: novedades y mejoras', excerpt: 'Las nuevas características del lenguaje incluyen mejoras en el JIT, sintaxis más limpia y optimizaciones de rendimiento.', category: 'Python', tag: 'python', date: '22 Mar 2026', img: 'https://picsum.photos/seed/python/640/360' },
  { id: 4, title: 'Micro-frontends con Web Components', excerpt: 'Arquitectura de frontends modulares usando Web Components nativos sin frameworks pesados.', category: 'Frontend', tag: 'js', date: '19 Mar 2026', img: 'https://picsum.photos/seed/microfrontend/640/360' },
  { id: 5, title: 'Docker para desarrolladores web', excerpt: 'Guía práctica para contenerizar aplicaciones web con Docker multi-stage y optimización de imágenes.', category: 'DevOps', tag: 'devops', date: '16 Mar 2026', img: 'https://picsum.photos/seed/docker/640/360' },
  { id: 6, title: 'Inteligencia Artificial en el navegador', excerpt: 'TensorFlow.js y ONNX Runtime permiten ejecutar modelos de ML directamente en el cliente sin servidor.', category: 'AI', tag: 'ai', date: '13 Mar 2026', img: 'https://picsum.photos/seed/ai/640/360' },
  { id: 7, title: 'React Server Components explicados', excerpt: 'Entendiendo la arquitectura de RSC y cómo cambia la forma de construir aplicaciones React.', category: 'Frontend', tag: 'react', date: '10 Mar 2026', img: 'https://picsum.photos/seed/react/640/360' },
  { id: 8, title: 'Git avanzado: rebase interactivo', excerpt: 'Domina el rebase interactivo para mantener un historial limpio y colaborar de forma eficiente.', category: 'DevOps', tag: 'devops', date: '7 Mar 2026', img: 'https://picsum.photos/seed/git/640/360' }
];

const categories = [
  { name: 'Frontend', count: 2 }, { name: 'Backend', count: 1 }, { name: 'CSS', count: 1 },
  { name: 'Python', count: 1 }, { name: 'DevOps', count: 2 }, { name: 'AI', count: 1 }
];

const popularPosts = articles.slice(2, 6);

const tags = ['JavaScript', 'CSS', 'Python', 'React', 'Docker', 'Node.js', 'TypeScript', 'WebAssembly', 'GraphQL', 'Rust'];

let liked = new Set();

function renderArticles(list) {
  const grid = document.getElementById('articlesGrid');
  if (list.length === 0) {
    grid.innerHTML = '<div style="text-align:center;padding:3rem;color:#94a3b8">No se encontraron artículos</div>';
    return;
  }
  grid.innerHTML = list.map(a => `
    <div class="article-card reveal" onclick="openArticle(${a.id})">
      <img src="${a.img}" alt="${a.title}" loading="lazy">
      <div class="article-body">
        <div class="article-meta">
          <span class="article-tag ${a.tag}">${a.category}</span>
          <span>${a.date}</span>
        </div>
        <h3>${a.title}</h3>
        <p>${a.excerpt}</p>
        <div class="article-footer">
          <span class="date">${a.date} · 5 min lectura</span>
          <button class="like-btn ${liked.has(a.id) ? 'liked' : ''}" onclick="event.stopPropagation();toggleLike(${a.id})">
            <span class="heart">${liked.has(a.id) ? '❤️' : '🤍'}</span>
            <span class="count">${liked.has(a.id) ? 1 : 0}</span>
          </button>
        </div>
      </div>
    </div>
  `).join('');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); }
    });
  }, { threshold: .1 });
  document.querySelectorAll('.article-card.reveal').forEach(el => observer.observe(el));
}

function renderSidebar() {
  const catList = document.getElementById('categoryList');
  catList.innerHTML = categories.map(c =>
    `<div class="category-item" onclick="filterByCategory('${c.name}')"><span>${c.name}</span><span class="count">${c.count}</span></div>`
  ).join('');

  const popList = document.getElementById('popularList');
  popList.innerHTML = popularPosts.map(p =>
    `<div class="popular-item" onclick="openArticle(${p.id})">
      <img src="${p.img}" alt="${p.title}">
      <div><h4>${p.title}</h4><span>${p.date}</span></div>
    </div>`
  ).join('');

  const tagList = document.getElementById('tagList');
  tagList.innerHTML = tags.map(t => `<span class="tag-item" onclick="filterByTag('${t}')">${t}</span>`).join('');
}

function openArticle(id) {
  const a = articles.find(x => x.id === id);
  if (!a) return;
  const overlay = document.getElementById('articleOverlay');
  const content = document.getElementById('articleContent');
  document.body.style.overflow = 'hidden';

  content.innerHTML = `
    <img src="${a.img}" alt="${a.title}">
    <h2>${a.title}</h2>
    <div class="article-meta">
      <span class="article-tag ${a.tag}">${a.category}</span>
      <span>${a.date} · 5 min lectura</span>
    </div>
    <p>${a.excerpt}</p>
    <p>Este es contenido demo para propósitos de portafolio. En una implementación real, aquí iría el artículo completo con desarrollo del tema, ejemplos de código, imágenes adicionales y referencias.</p>
    <p>El artículo continuaría desarrollando los conceptos mencionados en la introducción, proporcionando ejemplos prácticos y casos de uso reales.</p>
    <div style="background:#f8fafc;border-radius:.8rem;padding:1.5rem;margin-top:1rem;border-left:4px solid #6366f1">
      <p style="margin:0;font-size:.9rem;color:#475569"><strong>📝 Demo visual:</strong> Este artículo es de muestra. El contenido completo se generaría en un blog real.</p>
    </div>
  `;

  overlay.classList.add('active');
}

function closeArticle() {
  document.getElementById('articleOverlay').classList.remove('active');
  document.body.style.overflow = '';
}

function toggleLike(id) {
  if (liked.has(id)) liked.delete(id);
  else liked.add(id);
  renderArticles(getFilteredList());
  showToast(liked.has(id) ? '❤️ Te gusta este artículo' : '🤍 Like removido');
}

function filterArticles(q) {
  const filtered = articles.filter(a =>
    a.title.toLowerCase().includes(q.toLowerCase()) ||
    a.excerpt.toLowerCase().includes(q.toLowerCase()) ||
    a.category.toLowerCase().includes(q.toLowerCase()) ||
    a.tag.toLowerCase().includes(q.toLowerCase())
  );
  renderArticles(filtered);
}

function filterByCategory(cat) {
  const filtered = articles.filter(a => a.category === cat);
  renderArticles(filtered);
  document.getElementById('searchInput').value = '';
  showToast(`📂 Mostrando: ${cat}`);
}

function filterByTag(tag) {
  const filtered = articles.filter(a => a.tag === tag.toLowerCase());
  renderArticles(filtered);
  document.getElementById('searchInput').value = '';
  showToast(`🏷️ Tag: ${tag}`);
}

function getFilteredList() {
  const q = document.getElementById('searchInput').value.toLowerCase();
  if (!q) return articles;
  return articles.filter(a =>
    a.title.toLowerCase().includes(q) || a.excerpt.toLowerCase().includes(q)
  );
}

function showSkeleton() {
  const grid = document.getElementById('articlesGrid');
  grid.innerHTML = Array(3).fill(0).map(() => `
    <div class="skeleton-card">
      <div class="skeleton skeleton-img"></div>
      <div class="skeleton-body">
        <div class="skeleton skeleton-line"></div>
        <div class="skeleton skeleton-line"></div>
        <div class="skeleton skeleton-line"></div>
        <div class="skeleton skeleton-line"></div>
      </div>
    </div>
  `).join('');
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
  showSkeleton();
  renderSidebar();

  setTimeout(() => {
    renderArticles(articles);
  }, 800);

  document.getElementById('articleOverlay').addEventListener('click', (e) => {
    if (e.target === e.currentTarget) closeArticle();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeArticle();
  });
});
