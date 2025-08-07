// products.js
export const products = [
  {
    id: 1,
    name: "Wireless Headphones",
    price: 2400,
    category: "Electronics",
    img: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: 2,
    name: "Sport Watch",
    price: 1999,
    category: "Wearables",
    img: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: 3,
    name: "Leather Wallet",
    price: 899,
    category: "Accessories",
    img: "https://images.unsplash.com/photo-1495482521147-b01eca30f7bf?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: 4,
    name: "Sneakers",
    price: 3499,
    category: "Footwear",
    img: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: 5,
    name: "Backpack",
    price: 2199,
    category: "Bags",
    img: "https://images.unsplash.com/photo-1463107971871-fbac9ddb920f?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: 6,
    name: "Smartphone",
    price: 15999,
    category: "Electronics",
    img: "https://images.unsplash.com/photo-1510552776732-43bbf7e28e5e?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: 7,
    name: "Sunglasses",
    price: 1299,
    category: "Accessories",
    img: "https://images.unsplash.com/photo-1508610048659-14f6b178c214?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: 8,
    name: "Fitness Band",
    price: 2999,
    category: "Wearables",
    img: "https://images.unsplash.com/photo-1517363898876-6e2f6e9383dc?auto=format&fit=crop&w=400&q=80",
  },
];

/**
 * Render product list with optional filters and sorting:
 * @param {Array} productsArr Product data array
 * @param {HTMLElement} container Parent container to render into
 * @param {object} options Optional {searchTerm, categoryVal, sortVal}
 */
export function renderProductList(productsArr, container, options = {}) {
  const { searchTerm = "", categoryVal = "all", sortVal = "default" } = options;

  // Filter products
  let filtered = productsArr.filter((p) => {
    const matchesName = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = categoryVal === "all" || p.category === categoryVal;
    return matchesName && matchesCat;
  });

  // Sort products
  switch (sortVal) {
    case "price-asc":
      filtered.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      filtered.sort((a, b) => b.price - a.price);
      break;
    case "name-asc":
      filtered.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case "name-desc":
      filtered.sort((a, b) => b.name.localeCompare(a.name));
      break;
  }

  // Clear container
  container.innerHTML = "";

  if (filtered.length === 0) {
    container.innerHTML = `<p class="no-results">No products found.</p>`;
    return;
  }

  filtered.forEach((product) => {
    const card = document.createElement("div");
    card.className = "product-card";
    card.tabIndex = 0;
    card.innerHTML = `
      <img src="${product.img}" alt="${product.name}" loading="lazy" />
      <div class="product-info">
        <div class="product-title">${product.name}</div>
        <div class="product-category">${product.category}</div>
        <div class="product-price">₹${product.price.toLocaleString(
          "en-IN"
        )}</div>
        <button class="add-cart-btn" aria-label="Add ${
          product.name
        } to cart" data-id="${product.id}">Add to Cart</button>
      </div>
    `;
    container.appendChild(card);
  });
}
