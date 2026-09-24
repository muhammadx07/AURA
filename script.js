// Данные каталога часов
const products = [
  {
    id: 1,
    name: "AURA Emerald Tourbillon",
    brand: "AURA Manufacture",
    category: "mechanic",
    price: 1250000,
    rating: 5.0,
    image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=800",
    description: "Эксклюзивный турбийон с изумрудным циферблатом и корпусом из белого золота 18K."
  },
  {
    id: 2,
    name: "Chronograph Gold Edition",
    brand: "Geneva Precision",
    category: "gold",
    price: 890000,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1547996160-012745942866?auto=format&fit=crop&q=80&w=800",
    description: "Классический хронограф с элементами розового золота и ремешком из кожи аллигатора."
  },
  {
    id: 3,
    name: "Submariner Deep Emerald",
    brand: "Ocean Master",
    category: "chronograph",
    price: 640000,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&q=80&w=800",
    description: "Профессиональные водонепроницаемые часы (до 300м) с керамическим безелем."
  },
  {
    id: 4,
    name: "Royal Oak Skeleton",
    brand: "AURA Manufacture",
    category: "mechanic",
    price: 2100000,
    rating: 5.0,
    image: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&q=80&w=800",
    description: "Скелетонизированный механизм с автоподзаводом и антибликовым сапфировым стеклом."
  },
  {
    id: 5,
    name: "Heritage Perpetual Calendar",
    brand: "Geneva Precision",
    category: "gold",
    price: 1450000,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&q=80&w=800",
    description: "Вечный календарь с индикатором фаз Луны в изысканном золотом корпусе."
  },
  {
    id: 6,
    name: "Speedmaster Emerald Steel",
    brand: "Ocean Master",
    category: "chronograph",
    price: 520000,
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?auto=format&fit=crop&q=80&w=800",
    description: "Спортивный хронограф из хирургической стали с акцентным изумрудным безелем."
  }
];

// Состояние приложения
let cart = [];
let wishlist = [];
let currentCategory = 'all';
let searchQuery = '';
let currentSort = 'default';

// DOM Элементы
const productGrid = document.getElementById('productGrid');
const cartSidebar = document.getElementById('cartSidebar');
const cartOverlay = document.getElementById('cartOverlay');
const cartItemsContainer = document.getElementById('cartItems');
const cartTotalElement = document.getElementById('cartTotal');
const cartCountBadge = document.getElementById('cartCount');
const wishlistCountBadge = document.getElementById('wishlistCount');

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
  renderProducts();
  setupEventListeners();
});

// Отображение каталога
function renderProducts() {
  let filtered = products.filter(product => {
    const matchesCategory = currentCategory === 'all' || product.category === currentCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          product.brand.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Сортировка
  if (currentSort === 'low-high') {
    filtered.sort((a, b) => a.price - b.price);
  } else if (currentSort === 'high-low') {
    filtered.sort((a, b) => b.price - a.price);
  } else if (currentSort === 'rating') {
    filtered.sort((a, b) => b.rating - a.rating);
  }

  productGrid.innerHTML = '';

  if (filtered.length === 0) {
    productGrid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 3rem;">
      По вашему запросу ничего не найдено
    </div>`;
    return;
  }

  filtered.forEach(product => {
    const isWishlisted = wishlist.includes(product.id);
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
      <div class="product-img">
        <img src="${product.image}" alt="${product.name}">
        <div class="wishlist-icon ${isWishlisted ? 'active' : ''}" onclick="toggleWishlist(${product.id})">
          <i class="fa-${isWishlisted ? 'solid' : 'regular'} fa-heart"></i>
        </div>
      </div>
      <div class="product-info">
        <span class="product-brand">${product.brand}</span>
        <h3 class="product-title">${product.name}</h3>
        <div class="product-rating">
          <i class="fa-solid fa-star"></i> ${product.rating}
        </div>
        <div class="product-bottom">
          <div class="product-price">${product.price.toLocaleString()} ₽</div>
          <div>
            <button class="btn btn-outline" onclick="openQuickView(${product.id})"><i class="fa-regular fa-eye"></i></button>
            <button class="btn btn-primary" onclick="addToCart(${product.id})"><i class="fa-solid fa-cart-plus"></i></button>
          </div>
        </div>
      </div>
    `;
    productGrid.appendChild(card);
  });
}

// Настройка слушателей событий
function setupEventListeners() {
  // Фильтры
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      currentCategory = e.target.dataset.category;
      renderProducts();
    });
  });

  // Поиск
  document.getElementById('searchInput').addEventListener('input', (e) => {
    searchQuery = e.target.value;
    renderProducts();
  });

  // Сортировка
  document.getElementById('sortSelect').addEventListener('change', (e) => {
    currentSort = e.target.value;
    renderProducts();
  });

  // Корзина (открытие/закрытие)
  document.getElementById('cartBtn').addEventListener('click', toggleCart);
  document.getElementById('closeCart').addEventListener('click', toggleCart);
  cartOverlay.addEventListener('click', toggleCart);

  // Модальные окна
  document.querySelectorAll('.modal-close').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.modal').forEach(m => m.classList.remove('active'));
    });
  });

  // Оформление заказа
  document.getElementById('checkoutBtn').addEventListener('click', () => {
    if (cart.length === 0) {
      showToast('Корзина пуста');
      return;
    }
    toggleCart();
    document.getElementById('orderModal').classList.add('active');
  });

  document.getElementById('orderForm').addEventListener('submit', (e) => {
    e.preventDefault();
    document.getElementById('orderModal').classList.remove('active');
    cart = [];
    updateCartUI();
    showToast('Спасибо за заказ! Наш менеджер свяжется с вами.');
  });
}

// Переключение Корзины
function toggleCart() {
  cartSidebar.classList.toggle('active');
  cartOverlay.classList.toggle('active');
}

// Добавление в корзину
function addToCart(id) {
  const item = cart.find(i => i.id === id);
  if (item) {
    item.qty++;
  } else {
    cart.push({ id, qty: 1 });
  }
  updateCartUI();
  showToast('Товар добавлен в корзину');
}

// Изменение количества товара в корзине
function updateQty(id, delta) {
  const item = cart.find(i => i.id === id);
  if (item) {
    item.qty += delta;
    if (item.qty <= 0) {
      cart = cart.filter(i => i.id !== id);
    }
  }
  updateCartUI();
}

// Обновление UI корзины
function updateCartUI() {
  cartItemsContainer.innerHTML = '';
  let total = 0;
  let count = 0;

  cart.forEach(cartItem => {
    const product = products.find(p => p.id === cartItem.id);
    total += product.price * cartItem.qty;
    count += cartItem.qty;

    const el = document.createElement('div');
    el.className = 'cart-item';
    el.innerHTML = `
      <img src="${product.image}" alt="${product.name}">
      <div class="cart-item-details">
        <div class="cart-item-title">${product.name}</div>
        <div class="cart-item-price">${product.price.toLocaleString()} ₽</div>
        <div class="cart-item-qty">
          <button class="qty-btn" onclick="updateQty(${product.id}, -1)">-</button>
          <span>${cartItem.qty}</span>
          <button class="qty-btn" onclick="updateQty(${product.id}, 1)">+</button>
        </div>
      </div>
    `;
    cartItemsContainer.appendChild(el);
  });

  cartTotalElement.textContent = `${total.toLocaleString()} ₽`;
  cartCountBadge.textContent = count;
}

// Избранное
function toggleWishlist(id) {
  const index = wishlist.indexOf(id);
  if (index > -1) {
    wishlist.splice(index, 1);
    showToast('Удалено из избранного');
  } else {
    wishlist.push(id);
    showToast('Добавлено в избранное');
  }
  wishlistCountBadge.textContent = wishlist.length;
  renderProducts();
}

// Быстрый просмотр
function openQuickView(id) {
  const product = products.find(p => p.id === id);
  const modalBody = document.getElementById('modalBody');
  
  modalBody.innerHTML = `
    <div class="quick-view-grid">
      <img src="${product.image}" alt="${product.name}">
      <div>
        <span class="product-brand">${product.brand}</span>
        <h2>${product.name}</h2>
        <div class="product-rating" style="margin: 0.5rem 0;">
          <i class="fa-solid fa-star"></i> ${product.rating}
        </div>
        <p style="color: var(--text-muted); margin: 1rem 0;">${product.description}</p>
        <h3 style="font-size: 1.8rem; margin-bottom: 1.5rem;">${product.price.toLocaleString()} ₽</h3>
        <button class="btn btn-primary btn-block" onclick="addToCart(${product.id})">Добавить в корзину</button>
      </div>
    </div>
  `;
  
  document.getElementById('productModal').classList.add('active');
}

// Всплывающие уведомления (Toast)
function showToast(message) {
  const container = document.getElementById('toastContainer');
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  
  container.appendChild(toast);
  
  setTimeout(() => {
    toast.remove();
  }, 3000);
}