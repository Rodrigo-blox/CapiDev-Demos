const products = [
  { id: 1, name: 'Hamburguesa Clásica', price: 12.90, category: 'Comidas', img: 'https://picsum.photos/seed/burger/200/200' },
  { id: 2, name: 'Papas Fritas Grandes', price: 5.50, category: 'Comidas', img: 'https://picsum.photos/seed/fries/200/200' },
  { id: 3, name: 'Pizza Personal', price: 14.90, category: 'Comidas', img: 'https://picsum.photos/seed/pizza/200/200' },
  { id: 4, name: 'Ensalada César', price: 11.50, category: 'Comidas', img: 'https://picsum.photos/seed/salad/200/200' },
  { id: 5, name: 'Tacos al Pastor', price: 13.50, category: 'Comidas', img: 'https://picsum.photos/seed/tacos/200/200' },
  { id: 6, name: 'Coca-Cola 500ml', price: 3.50, category: 'Bebidas', img: 'https://picsum.photos/seed/coke/200/200' },
  { id: 7, name: 'Jugo Natural', price: 4.90, category: 'Bebidas', img: 'https://picsum.photos/seed/juice/200/200' },
  { id: 8, name: 'Agua Mineral', price: 2.50, category: 'Bebidas', img: 'https://picsum.photos/seed/water/200/200' },
  { id: 9, name: 'Cerveza Artesanal', price: 6.90, category: 'Bebidas', img: 'https://picsum.photos/seed/beer/200/200' },
  { id: 10, name: 'Limonada Natural', price: 4.50, category: 'Bebidas', img: 'https://picsum.photos/seed/lemonade/200/200' },
  { id: 11, name: 'Pastel de Chocolate', price: 7.90, category: 'Postres', img: 'https://picsum.photos/seed/cake/200/200' },
  { id: 12, name: 'Helado Sundae', price: 6.50, category: 'Postres', img: 'https://picsum.photos/seed/icecream/200/200' },
  { id: 13, name: 'Flan Casero', price: 5.90, category: 'Postres', img: 'https://picsum.photos/seed/flan/200/200' },
  { id: 14, name: 'Brownie con Helado', price: 8.50, category: 'Postres', img: 'https://picsum.photos/seed/brownie/200/200' }
];

const categories = ['Todas', 'Comidas', 'Bebidas', 'Postres'];
let cart = [];
let activeCategory = 'Todas';

function renderProducts(cat) {
  const grid = document.getElementById('productsGrid');
  const filtered = cat === 'Todas' ? products : products.filter(p => p.category === cat);
  grid.innerHTML = filtered.map(p => `
    <div class="product-card">
      <img src="${p.img}" alt="${p.name}" loading="lazy">
      <div class="product-info">
        <h4>${p.name}</h4>
        <div class="price">$${p.price.toFixed(2)}</div>
        <span class="category-label">${p.category}</span>
        <button class="btn-add" onclick="addToCart(${p.id})">+ Agregar</button>
      </div>
    </div>
  `).join('');
}

function renderCategories() {
  const tabs = document.getElementById('categoryTabs');
  tabs.innerHTML = categories.map(c =>
    `<button class="category-tab ${c === activeCategory ? 'active' : ''}" onclick="setCategory('${c}')">${c}</button>`
  ).join('');
}

function setCategory(cat) {
  activeCategory = cat;
  renderCategories();
  renderProducts(cat);
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
  updateBadge();
  showToast(`🍽️ ${p.name} agregado`);
}

function removeFromCart(id) {
  cart = cart.filter(x => x.id !== id);
  renderCart();
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

function renderCart() {
  const container = document.getElementById('cartItems');
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const count = cart.reduce((s, i) => s + i.qty, 0);

  if (cart.length === 0) {
    container.innerHTML = `
      <div class="cart-empty">
        <span>🛒</span>
        <p>Selecciona productos para agregar al pedido</p>
      </div>`;
  } else {
    container.innerHTML = cart.map(i => `
      <div class="cart-item">
        <img src="${i.img}" alt="${i.name}">
        <div class="cart-item-info">
          <h4>${i.name}</h4>
          <span class="item-price">$${i.price.toFixed(2)}</span>
        </div>
        <div class="cart-item-qty">
          <button onclick="updateQty(${i.id},-1)">−</button>
          <span>${i.qty}</span>
          <button onclick="updateQty(${i.id},1)">+</button>
        </div>
        <span class="cart-item-subtotal">$${(i.price * i.qty).toFixed(2)}</span>
      </div>
    `).join('');
  }

  document.getElementById('totalAmount').textContent = `$${total.toFixed(2)}`;
  document.getElementById('btnCharge').disabled = cart.length === 0;
}

function updateBadge() {
  const count = cart.reduce((s, i) => s + i.qty, 0);
  const badge = document.getElementById('cartItemCount');
  badge.textContent = count;
  badge.style.animation = 'none';
  void badge.offsetWidth;
  badge.style.animation = 'badgePulse .5s ease-in-out';
}

function showReceipt() {
  if (cart.length === 0) return;
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const items = document.getElementById('receiptItems');
  items.innerHTML = cart.map(i => `
    <div class="receipt-item">
      <span class="receipt-item-name">${i.qty}x ${i.name}</span>
      <span class="receipt-item-price">$${(i.price * i.qty).toFixed(2)}</span>
    </div>
  `).join('');
  document.getElementById('receiptTotal').innerHTML = `
    <span>Total</span>
    <span>$${total.toFixed(2)}</span>
  `;
  document.getElementById('receiptModal').classList.add('active');
}

function closeReceipt() {
  document.getElementById('receiptModal').classList.remove('active');
  cart = [];
  renderCart();
  updateBadge();
  showToast('🧾 Pedido finalizado — demo visual');
}

function initDragScroll() {
  const scrollContainer = document.getElementById('productsScroll');
  let isDown = false;
  let startX, scrollLeft;

  scrollContainer.addEventListener('mousedown', (e) => {
    isDown = true;
    scrollContainer.classList.add('active');
    startX = e.pageX - scrollContainer.offsetLeft;
    scrollLeft = scrollContainer.scrollLeft;
  });

  scrollContainer.addEventListener('mouseleave', () => {
    isDown = false;
    scrollContainer.classList.remove('active');
  });

  scrollContainer.addEventListener('mouseup', () => {
    isDown = false;
    scrollContainer.classList.remove('active');
  });

  scrollContainer.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - scrollContainer.offsetLeft;
    const walk = (x - startX) * 1.5;
    scrollContainer.scrollLeft = scrollLeft - walk;
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

document.addEventListener('DOMContentLoaded', () => {
  const now = new Date();
  document.getElementById('navDate').textContent = now.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });

  renderCategories();
  renderProducts('Todas');
  renderCart();
  initDragScroll();
  updateBadge();
});
