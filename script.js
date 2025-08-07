// script.js
import { products } from "./products.js";

// DOM Elements (common in all pages)
const cartCountElem = document.getElementById("cartCount");
const cartSidebar = document.getElementById("cartSidebar");
const cartItemsElem = document.getElementById("cartItems");
const cartTotalElem = document.getElementById("cartTotal");
const cartBtn = document.getElementById("cartBtn");
const closeCartBtn = document.getElementById("closeCartBtn");
const checkoutBtn = document.getElementById("checkoutBtn");
const emptyCartBtn = document.getElementById("emptyCartBtn");
const darkModeToggle = document.getElementById("darkModeToggle");

let cart = [];

// Helper functions
function saveCart() {
  localStorage.setItem("shopAdvancedCart", JSON.stringify(cart));
}
function loadCart() {
  const saved = localStorage.getItem("shopAdvancedCart");
  cart = saved ? JSON.parse(saved) : [];
}
function formatPrice(price) {
  return "₹" + price.toLocaleString("en-IN");
}
function updateCartUI() {
  cartCountElem.textContent = cart.reduce((a, i) => a + i.qty, 0);
  cartItemsElem.innerHTML = "";

  if (cart.length === 0) {
    cartItemsElem.innerHTML = "<li>Your cart is empty.</li>";
    cartTotalElem.textContent = "0";
    emptyCartBtn.disabled = true;
    checkoutBtn.disabled = true;
    return;
  }
  emptyCartBtn.disabled = false;
  checkoutBtn.disabled = false;

  let total = 0;
  cart.forEach((item) => {
    total += item.price * item.qty;

    const li = document.createElement("li");
    li.setAttribute("data-id", item.id);
    li.innerHTML = `
      <span>${item.name}</span>
      <div class="cart-item-controls" aria-label="Quantity controls for ${
        item.name
      }">
        <button class="quantity-btn" aria-label="Decrease quantity" data-action="decrease" data-id="${
          item.id
        }">−</button>
        <span aria-live="polite" aria-atomic="true">${item.qty}</span>
        <button class="quantity-btn" aria-label="Increase quantity" data-action="increase" data-id="${
          item.id
        }">+</button>
        <button class="remove-btn" aria-label="Remove ${
          item.name
        } from cart" data-action="remove" data-id="${item.id}">&times;</button>
      </div>
      <span>${formatPrice(item.price * item.qty)}</span>
    `;
    cartItemsElem.appendChild(li);
  });

  cartTotalElem.textContent = total;
  saveCart();
}

function addToCart(id) {
  const product = products.find((p) => p.id === id);
  if (!product) return;
  const existing = cart.find((i) => i.id === id);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }
  updateCartUI();
}
function handleCartAction(id, action) {
  const index = cart.findIndex((i) => i.id === id);
  if (index === -1) return;

  if (action === "increase") {
    cart[index].qty++;
  } else if (action === "decrease") {
    cart[index].qty--;
    if (cart[index].qty <= 0) cart.splice(index, 1);
  } else if (action === "remove") {
    cart.splice(index, 1);
  }
  updateCartUI();
}

function openCart() {
  cartSidebar.setAttribute("aria-hidden", "false");
  cartSidebar.style.right = "0";
  cartSidebar.focus();
}
function closeCart() {
  cartSidebar.setAttribute("aria-hidden", "true");
  cartSidebar.style.right = "-400px";
  cartBtn.focus();
}

// Dark mode setup and toggle
function setupDarkMode() {
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const saved = localStorage.getItem("shopAdvancedDarkMode");
  let darkOn = false;

  if (saved === "dark" || (!saved && prefersDark)) {
    document.body.classList.add("dark");
    darkOn = true;
  }
  darkModeToggle.textContent = darkOn ? "☀️" : "🌙";

  darkModeToggle.addEventListener("click", () => {
    darkOn = !darkOn;
    if (darkOn) {
      document.body.classList.add("dark");
      localStorage.setItem("shopAdvancedDarkMode", "dark");
      darkModeToggle.textContent = "☀️";
    } else {
      document.body.classList.remove("dark");
      localStorage.setItem("shopAdvancedDarkMode", "light");
      darkModeToggle.textContent = "🌙";
    }
  });
}

// Setup event handlers common to all pages
function setupEvents() {
  // Receive addToCart dispatched events (used on homepage featured products)
  window.addEventListener("addToCart", (e) => {
    addToCart(e.detail);
  });

  // Add to cart buttons (delegated)
  document.body.addEventListener("click", (e) => {
    if (e.target.classList.contains("add-cart-btn")) {
      const id = parseInt(e.target.dataset.id);
      addToCart(id);
    }
  });

  // Cart item controls
  cartItemsElem.addEventListener("click", (e) => {
    if (e.target.tagName === "BUTTON") {
      const id = parseInt(e.target.dataset.id);
      const action = e.target.dataset.action;
      if (id && action) handleCartAction(id, action);
    }
  });

  // Cart open/close
  cartBtn.addEventListener("click", (e) => {
    e.preventDefault();
    openCart();
  });
  closeCartBtn.addEventListener("click", closeCart);

  // Keyboard accessible close cart (ESC)
  cartSidebar.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeCart();
  });

  // Checkout
  checkoutBtn.addEventListener("click", () => {
    if (cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }
    alert(
      `Thank you for your purchase!\nTotal Amount: ${formatPrice(
        cart.reduce((a, i) => a + i.price * i.qty, 0)
      )}`
    );
    cart = [];
    updateCartUI();
    closeCart();
  });

  // Empty cart
  emptyCartBtn.addEventListener("click", () => {
    if (cart.length === 0) return;
    if (confirm("Are you sure you want to empty the cart?")) {
      cart = [];
      updateCartUI();
      closeCart();
    }
  });
}

// Initialization
function init() {
  loadCart();
  updateCartUI();
  setupDarkMode();
  setupEvents();
}
init();
