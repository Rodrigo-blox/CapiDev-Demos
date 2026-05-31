const products = [
  { id: 1, name: 'Kit Bambú', price: 89, desc: 'Cepillos, cepillo dental y pajitas de bambú orgánico.', img: 'https://loremflickr.com/400/300/bamboo?lock=1', eco: true },
  { id: 2, name: 'Bolsa Reutilizable', price: 35, desc: 'Bolsa plegable de algodón orgánico. 40L de capacidad.', img: 'https://loremflickr.com/400/300/tote,bag?lock=2', eco: true },
  { id: 3, name: 'Jabón Artesanal', price: 25, desc: 'Jabón natural de oliva y lavanda. Sin químicos.', img: 'https://loremflickr.com/400/300/soap,handmade?lock=3', eco: true },
  { id: 4, name: 'Botella Reutilizable', price: 69, desc: 'Botella térmica de acero inoxidable. 750ml.', img: 'https://loremflickr.com/400/300/water,bottle?lock=4', eco: true },
  { id: 5, name: 'Compostador Hogar', price: 249, desc: 'Compostador de cocina con carbón activado.', img: 'https://loremflickr.com/400/300/compost?lock=5', eco: true },
  { id: 6, name: 'Pack Ahorro Eco', price: 139, desc: 'Set de 4 productos ecológicos esenciales.', img: 'https://loremflickr.com/400/300/eco,products?lock=6', eco: true },
  { id: 7, name: 'Shampoo Sólido', price: 42, desc: 'Shampoo sólido de romero y menta.', img: 'https://loremflickr.com/400/300/shampoo,bar?lock=7', eco: true },
  { id: 8, name: 'Velas de Cera Natural', price: 55, desc: 'Velas artesanales de cera de soya.', img: 'https://loremflickr.com/400/300/candle,soy?lock=8', eco: true }
];

let cart = [];

function renderProducts() {
  const grid = document.getElementById('productsGrid');
  grid.innerHTML = products.map(p => `
    <div class="product-card" style="animation-delay:${products.indexOf(p) * 0.06}s">
      <img src="${p.img}" alt="${p.name}" loading="lazy">
      <div class="product-body">
        ${p.eco ? '<span class="badge-eco">🌱 Eco</span>' : ''}
        <h3>${p.name}</h3>
        <div class="price">Bs ${p.price.toFixed(2)}</div>
        <div class="desc">${p.desc}</div>
        <div class="product-actions">
          <button class="btn-add" onclick="addToCart(${p.id})">Agregar</button>
        </div>
      </div>
    </div>
  `).join('');
}

function renderCart() {
  const content = document.getElementById('cartContent');
  const badge = document.getElementById('cartBadge');
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const count = cart.reduce((s, i) => s + i.qty, 0);
  badge.textContent = count;

  if (cart.length === 0) {
    content.innerHTML = `
      <div class="cart-empty">
        <span class="cart-empty-icon">🛒</span>
        <p>Tu carrito está vacío</p>
        <button class="btn-primary" onclick="navigate('productos')">Ver productos</button>
      </div>`;
    return;
  }

  content.innerHTML = `
    <div class="cart-list">
      ${cart.map(item => `
        <div class="cart-item">
          <img src="${item.img}" alt="${item.name}">
          <div class="cart-item-info">
            <h4>${item.name}</h4>
            <p>Bs ${item.price.toFixed(2)} c/u</p>
          </div>
          <div class="cart-item-qty">
            <button class="qty-btn" onclick="updateQty(${item.id},-1)">−</button>
            <span>${item.qty}</span>
            <button class="qty-btn" onclick="updateQty(${item.id},1)">+</button>
          </div>
          <span class="cart-item-subtotal">Bs ${(item.price * item.qty).toFixed(2)}</span>
          <button class="btn-remove" onclick="removeFromCart(${item.id})">✕</button>
        </div>
      `).join('')}
    </div>
    <div class="cart-total-bar">
      <span class="total-label">Total</span>
      <span class="total-value">Bs ${total.toFixed(2)}</span>
    </div>
    <button class="btn-primary" onclick="checkout()" style="width:100%;justify-content:center;margin-top:1rem">
      Comprar ahora
    </button>
  `;
}

function addToCart(id) {
  const p = products.find(x => x.id === id);
  const existing = cart.find(x => x.id === id);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ ...p, qty: 1 });
  }
  renderCart();
  showToast(`🛒 ${p.name} agregado al carrito`);
  updateBadge();
}

function updateQty(id, delta) {
  const item = cart.find(x => x.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) cart = cart.filter(x => x.id !== id);
  renderCart();
  updateBadge();
}

function removeFromCart(id) {
  cart = cart.filter(x => x.id !== id);
  renderCart();
  updateBadge();
  showToast('🗑️ Producto eliminado del carrito');
}

function updateBadge() {
  const badge = document.getElementById('cartBadge');
  const count = cart.reduce((s, i) => s + i.qty, 0);
  badge.textContent = count;
}

function checkout() {
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const count = cart.reduce((s, i) => s + i.qty, 0);
  document.getElementById('modalTotal').textContent = `Bs ${total.toFixed(2)}`;
  document.getElementById('modalCount').textContent = count;
  document.getElementById('modalConfirm').classList.add('active');
  launchConfetti();
}

function closeModal() {
  document.getElementById('modalConfirm').classList.remove('active');
  cart = [];
  renderCart();
  updateBadge();
  navigate('inicio');
}

function launchConfetti() {
  const colors = ['#16a34a', '#22c55e', '#fbbf24', '#f97316', '#ef4444', '#8b5cf6'];
  for (let i = 0; i < 50; i++) {
    const piece = document.createElement('div');
    piece.className = 'confetti-piece';
    piece.style.left = Math.random() * 100 + '%';
    piece.style.background = colors[Math.floor(Math.random() * colors.length)];
    piece.style.borderRadius = Math.random() > .5 ? '50%' : '2px';
    piece.style.animationDuration = (2 + Math.random() * 2) + 's';
    piece.style.animationDelay = Math.random() * .5 + 's';
    document.body.appendChild(piece);
    setTimeout(() => piece.remove(), 4000);
  }
}

function navigate(view) {
  document.querySelectorAll('.page').forEach(p => p.classList.add('hidden'));
  document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
  document.getElementById('view-' + view).classList.remove('hidden');
  document.querySelector(`.nav-links a[data-view="${view}"]`).classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
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
  renderProducts();
  renderCart();
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); } });
  }, { threshold: .15 });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
});
