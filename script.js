
// VELORA FASHION - JAVASCRIPT

// 1. MOBILE NAVIGATION
const menuToggle = document.getElementById("menuToggle");
const nav = document.getElementById("nav");

if (menuToggle && nav) {
  menuToggle.addEventListener("click", () => {
    nav.classList.toggle("show");

    const isOpen = nav.classList.contains("show");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  nav.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      nav.classList.remove("show");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });
}

// 2. PRODUCT FILTERS AND SEARCH
const filterButtons = document.querySelectorAll(".filter-btn");
const productCards = document.querySelectorAll(".product-card");
const productSearch = document.getElementById("productSearch");
const noProducts = document.getElementById("noProducts");

let selectedCategory = "all";

function filterProducts() {
  const searchTerm = productSearch.value.toLowerCase().trim();
  let visibleCount = 0;

  productCards.forEach(card => {
    const category = card.dataset.category;
    const name = card.dataset.name.toLowerCase();

    const categoryMatches =
      selectedCategory === "all" || category === selectedCategory;

    const searchMatches = name.includes(searchTerm);

    const shouldShow = categoryMatches && searchMatches;

    card.style.display = shouldShow ? "" : "none";

    if (shouldShow) visibleCount++;
  });

  noProducts.hidden = visibleCount !== 0;
}

filterButtons.forEach(button => {
  button.addEventListener("click", () => {
    selectedCategory = button.dataset.filter;

    filterButtons.forEach(btn => btn.classList.remove("active"));
    button.classList.add("active");

    filterProducts();
  });
});

if (productSearch) {
  productSearch.addEventListener("input", filterProducts);
}

// 3. COLLECTION SHORTCUTS
document.querySelectorAll("[data-collection]").forEach(collection => {
  collection.addEventListener("click", () => {
    selectedCategory = collection.dataset.collection;

    filterButtons.forEach(button => {
      button.classList.toggle(
        "active",
        button.dataset.filter === selectedCategory
      );
    });

    filterProducts();
  });
});

// 4. CREATE SHOPPING CART PANEL
const cartButton = document.querySelector(".cart-button");
const cartCount = document.getElementById("cartCount");

const cartOverlay = document.createElement("div");
cartOverlay.className = "cart-overlay";
cartOverlay.innerHTML = `
  <div class="cart-panel" role="dialog" aria-modal="true"
       aria-labelledby="cartHeading">
    <div class="cart-header">
      <h2 id="cartHeading">Your Shopping Bag</h2>
      <button class="cart-close" aria-label="Close cart">&times;</button>
    </div>

    <div class="cart-items"></div>

    <div class="cart-footer">
      <div class="cart-total">
        <span>Total</span>
        <strong class="cart-total-price">$0.00</strong>
      </div>

      <button class="checkout-btn">Continue to Checkout</button>
      <p class="cart-demo-note">
        Demonstration store. No real purchase or payment will be processed.
      </p>
    </div>
  </div>
`;

document.body.appendChild(cartOverlay);

const cartItemsContainer = cartOverlay.querySelector(".cart-items");
const cartClose = cartOverlay.querySelector(".cart-close");
const cartTotalPrice = cartOverlay.querySelector(".cart-total-price");
const checkoutButton = cartOverlay.querySelector(".checkout-btn");

// Cart data is stored during this page session only.
const cart = [];

function openCart() {
  cartOverlay.classList.add("open");
  document.body.classList.add("cart-open");
}

function closeCart() {
  cartOverlay.classList.remove("open");
  document.body.classList.remove("cart-open");
}

if (cartButton) {
  cartButton.addEventListener("click", event => {
    event.preventDefault();
    openCart();
  });
}

cartClose.addEventListener("click", closeCart);

cartOverlay.addEventListener("click", event => {
  if (event.target === cartOverlay) {
    closeCart();
  }
});

// 5. ADD PRODUCTS TO CART
document.querySelectorAll(".add-btn").forEach(button => {
  button.addEventListener("click", () => {
    const name = button.dataset.name;
    const price = Number(button.dataset.price);

    const existingProduct = cart.find(item => item.name === name);

    if (existingProduct) {
      existingProduct.quantity++;
    } else {
      cart.push({
        name,
        price,
        quantity: 1
      });
    }

    renderCart();

    button.textContent = "Added ✓";

    setTimeout(() => {
      button.textContent = "Add to Bag +";
    }, 1000);
  });
});

// 6. DISPLAY CART AND QUANTITY CONTROLS
function renderCart() {
  cartItemsContainer.innerHTML = "";

  let totalQuantity = 0;
  let totalPrice = 0;

  if (cart.length === 0) {
    cartItemsContainer.innerHTML =
      '<p class="cart-empty">Your shopping bag is empty.</p>';
  }

  cart.forEach((item, index) => {
    totalQuantity += item.quantity;
    totalPrice += item.price * item.quantity;

    const cartItem = document.createElement("div");
    cartItem.className = "cart-item";

    const details = document.createElement("div");
    details.className = "cart-item-details";

    const name = document.createElement("h3");
    name.textContent = item.name;

    const price = document.createElement("p");
    price.textContent = "$" + item.price.toFixed(2) + " each";

    details.append(name, price);

    const controls = document.createElement("div");
    controls.className = "quantity-controls";

    const decrease = document.createElement("button");
    decrease.textContent = "−";
    decrease.setAttribute("aria-label", "Decrease quantity");

    const quantity = document.createElement("span");
    quantity.textContent = item.quantity;

    const increase = document.createElement("button");
    increase.textContent = "+";
    increase.setAttribute("aria-label", "Increase quantity");

    decrease.addEventListener("click", () => {
      item.quantity--;

      if (item.quantity <= 0) {
        cart.splice(index, 1);
      }

      renderCart();
    });

    increase.addEventListener("click", () => {
      item.quantity++;
      renderCart();
    });

    controls.append(decrease, quantity, increase);
    cartItem.append(details, controls);
    cartItemsContainer.appendChild(cartItem);
  });

  cartCount.textContent = totalQuantity;
  cartTotalPrice.textContent = "$" + totalPrice.toFixed(2);
}

// 7. DEMO CHECKOUT
checkoutButton.addEventListener("click", () => {
  if (cart.length === 0) {
    alert("Your shopping bag is empty. Add a product first.");
    return;
  }

  alert(
    "Thank you for shopping at VELORA!\n\n" +
    "This is a portfolio demonstration. " +
    "No real order or payment has been made."
  );
});

// 8. NEWSLETTER DEMONSTRATION
const newsletterForm = document.getElementById("newsletterForm");
const newsletterMessage = document.getElementById("newsletterMessage");

if (newsletterForm && newsletterMessage) {
  newsletterForm.addEventListener("submit", event => {
    event.preventDefault();

    newsletterMessage.textContent =
      "Thank you for your interest in VELORA! This is a demo subscription.";

    newsletterForm.reset();
  });
}

// Initial cart display
renderCart();

// VELORA SCROLL REVEAL ANIMATION

const revealElements = document.querySelectorAll(
  '.product-card, .section-heading, .collection-card'
);

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('reveal', 'active');
      revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.15
});

revealElements.forEach((element) => {
  element.classList.add('reveal');
  revealObserver.observe(element);
});