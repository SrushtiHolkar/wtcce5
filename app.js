const catalogElement = document.querySelector('#catalog-data');
const catalog = JSON.parse(catalogElement.textContent);
const app = document.querySelector('#app');
const cartCount = document.querySelector('.bag-count');
const dialog = document.querySelector('.search-dialog');
const searchInput = document.querySelector('#search-input');
const toast = document.querySelector('.toast');
let cart = JSON.parse(localStorage.getItem('velvetique-cart') || '[]');
let currentFilter = 'All';
let toastTimer;

const money = (amount) => `$${amount.toFixed(2)}`;
const safeText = (value) => String(value).replace(/[&<>"']/g, (character) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[character]));

function productCard(product) {
  return `<article class="product-card">
    <div class="product-photo"><img src="${product.image}" alt="${safeText(product.name)}" loading="lazy"><span class="product-label">${safeText(product.label)}</span><button class="favorite" type="button" data-action="favorite" aria-label="Save ${safeText(product.name)} to favorites" aria-pressed="false">♡</button></div>
    <h3 class="product-name">${safeText(product.name)}</h3><p class="product-description">${safeText(product.description)}</p>
    <strong class="product-price">${money(product.price)}</strong><div class="rating" aria-label="Rated ${product.rating} out of 5">★★★★★ <span>(${product.reviews})</span></div>
    <button class="button add-button" type="button" data-action="add" data-product="${product.id}">Add to bag</button>
  </article>`;
}

function renderHome() {
  const categories = catalog.categories.map((category) => `<a class="category-card" href="#/shop?category=${encodeURIComponent(category.name)}"><div class="category-image"><img src="${category.image}" alt="${safeText(category.name)} products" loading="lazy"></div><strong>${safeText(category.name)}</strong></a>`).join('');
  const bestSellers = catalog.products.filter((product) => product.featured).slice(0, 4).map(productCard).join('');
  return `<section class="hero"><div class="hero-content"><span class="eyebrow">A softer kind of skincare</span><h1>Radiant skin.<br>Real confidence.</h1><p>Clean beauty that nourishes, enhances, and empowers you.</p><a class="button" href="#/shop">Shop the ritual</a></div><span class="hero-note">A little more you, every day</span></section>
    <section class="values-strip" aria-label="Our promises"><div class="value-item"><span class="value-icon">❋</span><div><strong>Clean ingredients</strong><small>Safe & toxin-free</small></div></div><div class="value-item"><span class="value-icon">♧</span><div><strong>Clinically proven</strong><small>Dermatologist tested</small></div></div><div class="value-item"><span class="value-icon">♡</span><div><strong>Cruelty free</strong><small>Never tested on animals</small></div></div><div class="value-item"><span class="value-icon">◎</span><div><strong>Sustainable beauty</strong><small>Good for you & the planet</small></div></div></section>
    <section class="section"><div class="section-heading"><h2>Shop by category</h2><p>Find your new everyday favorite.</p></div><div class="category-grid">${categories}</div></section>
    <section class="campaign"><div class="campaign-copy"><span class="eyebrow">A little something for your skin</span><h2>Up to 30% off best sellers</h2><p>Glow more, spend less.<br>Your skin called. It has plans.</p><a class="button" href="#/shop?sale=true">Shop the edit</a></div><div class="campaign-image" role="img" aria-label="Botanical skincare and nourishing cream"></div></section>
    <section class="section products-section"><div class="section-title-row"><div class="section-heading"><h2>Best sellers</h2><p>The formulas you come back to.</p></div><a class="text-link" href="#/shop">View all</a></div><div class="product-grid">${bestSellers}</div></section>`;
}

function pageBanner(title, copy) {
  return `<section class="page-banner"><span class="eyebrow">Velvetique Beauty</span><h1>${title}</h1><p>${copy}</p></section>`;
}

function renderShop() {
  const params = new URLSearchParams(location.hash.split('?')[1] || '');
  const requestedCategory = params.get('category');
  const categories = ['All', ...catalog.categories.map((category) => category.name)];
  const chosen = categories.includes(requestedCategory) ? requestedCategory : currentFilter;
  const products = catalog.products.filter((product) => chosen === 'All' || product.category === chosen);
  const chips = categories.map((category) => `<button class="filter-chip ${category === chosen ? 'active' : ''}" type="button" data-filter="${safeText(category)}">${safeText(category)}</button>`).join('');
  return `${pageBanner('Find your feel-good ritual', 'Thoughtfully made essentials, from your first cleanse to your final glow.')}
    <section class="section products-section"><div class="filter-list" aria-label="Filter by category">${chips}</div><div class="shop-toolbar"><span>${products.length} thoughtful essentials</span><label>Sort by <select id="sort-products" aria-label="Sort products"><option value="featured">Featured</option><option value="price-low">Price: low to high</option><option value="price-high">Price: high to low</option></select></label></div><div class="product-grid" id="shop-products">${products.map(productCard).join('')}</div></section>`;
}

function renderCollections() {
  const cards = catalog.collections.map((item) => `<article class="collection-card"><img src="${item.image}" alt="${safeText(item.title)} collection" loading="lazy"><div><span class="eyebrow">${safeText(item.kicker)}</span><h2>${safeText(item.title)}</h2><p>${safeText(item.copy)}</p><a class="text-link" href="#/shop?category=${encodeURIComponent(item.category)}">Explore collection</a></div></article>`).join('');
  return `${pageBanner('Collections, with intention', 'A considered edit for every ritual, every season, and every version of you.')}<section class="section"><div class="collection-grid">${cards}</div></section>`;
}

function renderAbout() {
  return `${pageBanner('Beauty, a little more thoughtful', 'Good skin should feel like you. Just a little more cared for.')}
    <section class="section story-layout"><img src="https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&w=1000&q=85" alt="A calm, sunlit skincare ritual" loading="lazy"><div class="story-copy"><span class="eyebrow">Our point of view</span><h2>Care for your skin.<br>Care about what goes on it.</h2><p>Velvetique began with a simple belief: the products you reach for every day should feel good in every sense. We pair proven ingredients with textures and rituals that make space for a softer start.</p><p>Our formulas are cruelty-free, thoughtfully sourced, and made to meet real skin where it is. No impossible promises. Just a little more care, consistently.</p><a class="button button-outline" href="#/shop">Meet your new routine</a></div></section>`;
}

function renderJournal() {
  const articles = catalog.articles.map((article) => `<article class="journal-card"><img src="${article.image}" alt="${safeText(article.title)}" loading="lazy"><div><span class="eyebrow">${safeText(article.category)} · ${safeText(article.readTime)}</span><h2>${safeText(article.title)}</h2><p>${safeText(article.copy)}</p><a class="text-link" href="#/journal/${article.slug}">Read the story</a></div></article>`).join('');
  return `${pageBanner('The Velvetique journal', 'Small rituals, ingredient notes, and skin wisdom for real life.')}<section class="section"><div class="journal-grid">${articles}</div></section>`;
}

function renderContact() {
  return `${pageBanner('We’re here for you', 'A real person, a thoughtful answer. Usually within one business day.')}<section class="section contact-layout"><div class="contact-copy"><span class="eyebrow">Get in touch</span><h2>Let’s talk skin, orders, or anything in between.</h2><p>Send us a note and our care team will get back to you soon.</p><p><strong>Email</strong><br>hello@velvetiquebeauty.com</p><p><strong>Hours</strong><br>Monday–Friday, 9am–5pm ET</p></div><form id="contact-form" novalidate><div class="form-grid"><div class="field"><label for="contact-name">Your name</label><input id="contact-name" name="name" autocomplete="name" required minlength="2"><span class="field-error"></span></div><div class="field"><label for="contact-email">Email address</label><input id="contact-email" name="email" type="email" autocomplete="email" required><span class="field-error"></span></div><div class="field full"><label for="contact-subject">What can we help with?</label><select id="contact-subject" name="subject" required><option value="">Choose a topic</option><option>My order</option><option>Product advice</option><option>Something else</option></select><span class="field-error"></span></div><div class="field full"><label for="contact-message">Your message</label><textarea id="contact-message" name="message" required minlength="10"></textarea><span class="field-error"></span></div></div><button class="button" type="submit">Send your note</button><p class="form-feedback" aria-live="polite"></p></form></section>`;
}

function renderCart() {
  if (!cart.length) return `${pageBanner('Your bag is taking a breather', 'Your next feel-good ritual is just around the corner.')}<section class="section empty-state"><h2>Nothing in your bag just yet.</h2><a class="button" href="#/shop">Explore the shop</a></section>`;
  const lines = cart.map((line) => {
    const product = catalog.products.find((item) => item.id === line.id);
    if (!product) return '';
    return `<article class="cart-row"><img src="${product.image}" alt="${safeText(product.name)}"><div><h3>${safeText(product.name)}</h3><p>${money(product.price)}</p><div class="quantity-control"><button type="button" data-action="quantity" data-id="${product.id}" data-delta="-1" aria-label="Remove one ${safeText(product.name)}">−</button><span>${line.quantity}</span><button type="button" data-action="quantity" data-id="${product.id}" data-delta="1" aria-label="Add one ${safeText(product.name)}">+</button><button class="remove-link" type="button" data-action="remove" data-id="${product.id}">Remove</button></div></div><strong>${money(product.price * line.quantity)}</strong></article>`;
  }).join('');
  const subtotal = cart.reduce((total, line) => total + catalog.products.find((product) => product.id === line.id).price * line.quantity, 0);
  return `${pageBanner('Your bag', 'A good choice, if we may say so.')}<section class="section cart-layout"><div>${lines}</div><aside class="cart-summary"><h2>Order summary</h2><div class="summary-row"><span>Subtotal</span><span>${money(subtotal)}</span></div><div class="summary-row"><span>Shipping</span><span>Calculated at checkout</span></div><div class="summary-row total"><span>Total</span><span>${money(subtotal)}</span></div><button class="button" type="button" data-action="checkout">Continue to checkout</button></aside></section>`;
}

function renderAccount() {
  return `${pageBanner('Welcome to your little corner', 'Your account space is ready for its next chapter.')}<section class="section empty-state"><h2>We’re making account care a little more thoughtful.</h2><p>For now, our team can help with orders at <a class="text-link" href="#/contact">hello@velvetiquebeauty.com</a>.</p><a class="button" href="#/shop">Browse the shop</a></section>`;
}

const routes = {home:renderHome,shop:renderShop,collections:renderCollections,about:renderAbout,journal:renderJournal,contact:renderContact,cart:renderCart,account:renderAccount};

function updateCartBadge() {
  cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
}

function persistCart() {
  localStorage.setItem('velvetique-cart', JSON.stringify(cart));
  updateCartBadge();
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('visible'), 2300);
}

function navigate() {
  const route = location.hash.replace(/^#\/?/, '').split('?')[0].split('/')[0] || 'home';
  const renderer = routes[route] || routes.home;
  document.querySelectorAll('.main-nav a[data-route]').forEach((link) => link.classList.toggle('active', link.dataset.route === route));
  document.querySelector('.main-nav').classList.remove('is-open');
  document.querySelector('.menu-toggle').setAttribute('aria-expanded', 'false');
  app.innerHTML = renderer();
  updateCartBadge();
  window.scrollTo({top:0,behavior:'smooth'});
  if (route === 'shop') currentFilter = new URLSearchParams(location.hash.split('?')[1] || '').get('category') || currentFilter;
}

function updateShopProducts() {
  const params = new URLSearchParams(location.hash.split('?')[1] || '');
  const category = params.get('category') || currentFilter;
  let products = catalog.products.filter((product) => category === 'All' || product.category === category);
  const sort = document.querySelector('#sort-products')?.value;
  if (sort === 'price-low') products = products.toSorted((a,b) => a.price - b.price);
  if (sort === 'price-high') products = products.toSorted((a,b) => b.price - a.price);
  document.querySelector('#shop-products').innerHTML = products.map(productCard).join('');
  document.querySelector('.shop-toolbar > span').textContent = `${products.length} thoughtful essentials`;
}

function validateField(field) {
  const error = field.parentElement.querySelector('.field-error');
  let message = '';
  if (field.required && !field.value.trim()) message = 'Please fill out this field.';
  else if (field.type === 'email' && field.value && !field.validity.valid) message = 'Enter a valid email address.';
  else if (field.minLength > 0 && field.value.trim().length < field.minLength) message = `Please enter at least ${field.minLength} characters.`;
  field.setAttribute('aria-invalid', String(Boolean(message)));
  if (error) error.textContent = message;
  return !message;
}

function updateSearchResults() {
  const query = searchInput.value.trim().toLowerCase();
  const results = document.querySelector('.search-results');
  if (!query) { results.innerHTML = '<p class="product-description">Try a product or category name.</p>'; return; }
  const matches = catalog.products.filter((product) => `${product.name} ${product.category} ${product.description}`.toLowerCase().includes(query)).slice(0, 5);
  results.innerHTML = matches.length ? matches.map((product) => `<a class="search-result" href="#/shop"><img src="${product.image}" alt="" loading="lazy"><span>${safeText(product.name)}</span><span>${money(product.price)}</span></a>`).join('') : '<p class="product-description">No matches yet. Try another search.</p>';
}

document.addEventListener('click', (event) => {
  const action = event.target.closest('[data-action]');
  if (action) {
    if (action.dataset.action === 'add') {
      const line = cart.find((item) => item.id === action.dataset.product);
      if (line) line.quantity += 1; else cart.push({id:action.dataset.product,quantity:1});
      persistCart(); showToast('Added to your bag. A good choice.');
    }
    if (action.dataset.action === 'favorite') {
      const active = action.getAttribute('aria-pressed') !== 'true';
      action.setAttribute('aria-pressed', String(active)); action.classList.toggle('is-favorite', active); action.textContent = active ? '♥' : '♡';
      showToast(active ? 'Saved to your favorites.' : 'Removed from your favorites.');
    }
    if (action.dataset.action === 'search') { dialog.showModal(); searchInput.focus(); updateSearchResults(); }
    if (action.dataset.action === 'quantity') {
      const line = cart.find((item) => item.id === action.dataset.id); line.quantity += Number(action.dataset.delta);
      if (line.quantity < 1) cart = cart.filter((item) => item !== line);
      persistCart(); navigate();
    }
    if (action.dataset.action === 'remove') { cart = cart.filter((item) => item.id !== action.dataset.id); persistCart(); navigate(); }
    if (action.dataset.action === 'checkout') showToast('Checkout is coming soon. Your bag is saved.');
  }
  const filter = event.target.closest('[data-filter]');
  if (filter) {
    currentFilter = filter.dataset.filter;
    document.querySelectorAll('.filter-chip').forEach((chip) => chip.classList.toggle('active', chip === filter));
    updateShopProducts();
  }
});

document.addEventListener('change', (event) => {
  if (event.target.id === 'sort-products') updateShopProducts();
});

document.addEventListener('input', (event) => {
  if (event.target === searchInput) updateSearchResults();
  if (event.target.matches('#contact-form input, #contact-form textarea, #contact-form select')) validateField(event.target);
});

document.addEventListener('submit', (event) => {
  if (event.target.matches('.newsletter-form')) {
    event.preventDefault();
    const email = event.target.elements.email;
    const message = event.target.querySelector('.form-message');
    if (!email.value.trim() || !email.validity.valid) { message.textContent = 'Please enter a valid email address.'; email.setAttribute('aria-invalid','true'); email.focus(); return; }
    message.textContent = 'You’re on the list. Your 15% code is GLOW15.'; email.value = ''; email.removeAttribute('aria-invalid');
  }
  if (event.target.id === 'contact-form') {
    event.preventDefault();
    const fields = [...event.target.querySelectorAll('input, textarea, select')];
    const valid = fields.map(validateField).every(Boolean);
    if (!valid) { event.target.querySelector('[aria-invalid="true"]')?.focus(); return; }
    event.target.querySelector('.form-feedback').textContent = 'Thanks for your note. Our care team will be in touch soon.';
    event.target.reset(); fields.forEach((field) => { field.removeAttribute('aria-invalid'); field.parentElement.querySelector('.field-error').textContent = ''; });
  }
});

document.querySelector('.menu-toggle').addEventListener('click', (event) => {
  const menu = document.querySelector('.main-nav');
  const open = menu.classList.toggle('is-open');
  event.currentTarget.setAttribute('aria-expanded', String(open));
});

searchInput.addEventListener('keydown', (event) => { if (event.key === 'Escape') dialog.close(); });
dialog.addEventListener('close', () => { searchInput.value = ''; document.querySelector('.search-results').innerHTML = ''; });
window.addEventListener('hashchange', navigate);
updateCartBadge();
navigate();