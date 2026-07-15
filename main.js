/* ── Cart State ── */

// ✏️ REPLACE with your real WhatsApp number (country code + number, no + or spaces)
// Example: Pakistan +92 300 1234567 → '923001234567'
const WHATSAPP_NUMBER = '919741939044';

let cart = [];

function renderCart() {
  const itemsEl = document.getElementById('cartItems');
  const countEl = document.querySelector('.nav__cart-count');

  const totalItems = cart.reduce((s, i) => s + i.qty, 0);
  countEl.textContent = totalItems;

  if (cart.length === 0) {
    itemsEl.innerHTML = '<p class="cart-empty">Your cart is empty 🌸</p>';
    return;
  }

  itemsEl.innerHTML = cart.map((item, idx) => `
    <div class="cart-item">
      <div class="cart-item__info">
        <div class="cart-item__name">${item.name}</div>
        <div class="cart-item__qty">Qty: ${item.qty}</div>
      </div>
      <button class="cart-item__remove" onclick="removeFromCart(${idx})" aria-label="Remove">&times;</button>
    </div>
  `).join('');
}

function addToCart(btn, name, price) {
  const existing = cart.find(i => i.name === name);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ name, price, qty: 1 });
  }
  renderCart();
  showToast(`🌸 ${name} added to cart`);

  // Button feedback — use valid CSS color, not missing var(--accent)
  const original = btn.textContent;
  btn.textContent = '✓ Added!';
  btn.style.background = '#6b8f6e';
  btn.disabled = true;
  setTimeout(() => {
    btn.textContent = original;
    btn.style.background = '';
    btn.disabled = false;
  }, 1500);
}

function removeFromCart(idx) {
  cart.splice(idx, 1);
  renderCart();
}

/* ── WhatsApp Checkout ── */
function checkoutWhatsApp() {
  if (cart.length === 0) {
    showToast('🛒 Your cart is empty!');
    return;
  }

  // Build the order message
  const lines = cart.map(item =>
    `• ${item.name} × ${item.qty}`
  );

  const message =
    `🌸 *New Order from CraftZen Website* 🌸\n\n` +
    `*Order Details:*\n` +
    lines.join('\n') +
    `\n\n🚚 *Note: Delivery charges will be applied based on location.*` +
    `\n\nPlease confirm availability and share pricing & payment details. Thank you! 💝`;

  const encoded = encodeURIComponent(message);
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`;

  window.open(url, '_blank');
}

/* ── Scroll to contact (safe version without inline quotes) ── */
function scrollToContact() {
  const el = document.getElementById('contact');
  if (el) el.scrollIntoView({ behavior: 'smooth' });
}

/* ── Cart Drawer ── */
function toggleCart() {
  const drawer  = document.getElementById('cartDrawer');
  const overlay = document.getElementById('cartOverlay');
  const isOpen  = drawer.classList.contains('open');
  drawer.classList.toggle('open', !isOpen);
  overlay.classList.toggle('open', !isOpen);
  document.body.style.overflow = isOpen ? '' : 'hidden';
}

document.querySelector('.nav__cart').addEventListener('click', (e) => {
  e.preventDefault();
  toggleCart();
});

/* ── Toast ── */
let toastTimer = null;
function showToast(msg) {
  const toast = document.getElementById('toast');
  // Clear any running timer so rapid adds don't stack
  if (toastTimer) clearTimeout(toastTimer);
  toast.textContent = msg;
  toast.classList.add('show');
  toastTimer = setTimeout(() => {
    toast.classList.remove('show');
    toastTimer = null;
  }, 2600);
}

/* ── Forms ── */function handleContact(e) {
  e.preventDefault();

  const name     = document.getElementById('name').value.trim();
  const rating   = document.getElementById('rating')?.value || '';
  const message  = document.getElementById('message').value.trim();

  const ratingLabels = { '5': '⭐⭐⭐⭐⭐ Excellent', '4': '⭐⭐⭐⭐ Very Good', '3': '⭐⭐⭐ Good', '2': '⭐⭐ Fair', '1': '⭐ Poor' };
  const ratingText = ratingLabels[rating] || rating;

  const text =
    `🌸 *New Feedback — CraftZen* 🌸\n\n` +
    `*Name:* ${name}\n` +
    (ratingText ? `*Rating:* ${ratingText}\n` : '') +
    `*Message:*\n${message}`;

  const encoded = encodeURIComponent(text);
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`;

  window.open(url, '_blank');
  showToast('💌 Opening WhatsApp...');
  e.target.reset();
}

/* ── Sticky Nav shadow ── */
window.addEventListener('scroll', () => {
  const nav = document.querySelector('.nav');
  if (!nav) return;
  nav.style.boxShadow = window.scrollY > 40
    ? '0 4px 20px rgba(196,86,128,.15)'
    : 'none';
});

/* ── Wishlist toggle ── */
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('product-card__wishlist')) {
    const btn = e.target;
    const isWished = btn.dataset.wished === 'true';
    btn.dataset.wished = !isWished;
    btn.textContent = isWished ? '♡' : '♥';
    btn.style.color = isWished ? '' : 'var(--pink-dk)';
    showToast(isWished ? 'Removed from wishlist' : '💝 Added to wishlist!');
  }
});

/* ── Scroll Reveal ── */
// Separate reveal from hover transform by using a wrapper class approach
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll(
  '.product-card, .cat-card, .testimonial, .process__step, .instagram__item'
).forEach(el => {
  el.classList.add('reveal-pending');
  revealObserver.observe(el);
});

/* ── Mobile Menu ── */
let menuOpen = false;
document.querySelector('.nav__burger').addEventListener('click', () => {
  const links = document.querySelector('.nav__links');
  menuOpen = !menuOpen;

  if (menuOpen) {
    links.style.cssText = `
      display: flex;
      position: absolute;
      top: 65px;
      left: 0;
      right: 0;
      background: rgba(255,240,245,.97);
      flex-direction: column;
      padding: 1.5rem 5%;
      gap: 1.2rem;
      border-bottom: 1px solid rgba(232,120,154,.25);
      z-index: 99;
      backdrop-filter: blur(12px);
    `;
  } else {
    links.removeAttribute('style');
  }
});

// Close mobile menu when a link is clicked
document.querySelectorAll('.nav__links a').forEach(link => {
  link.addEventListener('click', () => {
    if (menuOpen) {
      menuOpen = false;
      document.querySelector('.nav__links').removeAttribute('style');
    }
  });
});

// Close mobile menu on resize to desktop
window.addEventListener('resize', () => {
  if (window.innerWidth > 640 && menuOpen) {
    menuOpen = false;
    document.querySelector('.nav__links').removeAttribute('style');
  }
});
