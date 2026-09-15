import {
getCartFromStorage,
saveCartToStorage,
} from "../utils/storage.js";

import {
  lockScroll,
  unlockScroll,
} from "../utils/scroll-lock.js";

export function initCart(products) {
const cart = getCartFromStorage();

const cartElement = document.querySelector("#cart");

if (!cartElement) {
return;
}

const cartItemsContainer =
cartElement.querySelector("[data-cart-items]");

const cartTotalElement =
document.querySelector("[data-cart-total]");

const cartCountElements =
document.querySelectorAll("[data-cart-count]");

const closeButton =
cartElement.querySelector(".cart__close");

const overlay =
cartElement.querySelector(".cart__overlay");

const checkoutButton =
  cartElement.querySelector(".cart__checkout");

function formatPrice(price) {
return `€${price.toFixed(2)}`;
}

function getCartItemCount() {
return cart.reduce(
(total, item) => total + item.quantity,
0
);
}

function getCartTotal() {
return cart.reduce(
(total, item) => total + item.price * item.quantity,
0
);
}

function updateCartCount() {
const count = getCartItemCount();


cartCountElements.forEach((element) => {
  element.textContent = count;
});


}

function renderCart() {
if (!cartItemsContainer) {
return;
}


if (cart.length === 0) {
  cartItemsContainer.innerHTML = `
    <p class="cart__empty">
      Your cart is empty.
    </p>
  `;

  if (cartTotalElement) {
    cartTotalElement.textContent = "€0.00";
  }

  updateCartCount();

  return;
}

cartItemsContainer.innerHTML = cart
  .map(
    (item) => `
      <article class="cart-item" data-cart-item="${item.id}">
        <div class="cart-item__image">
          <img
            src="${item.image}"
            alt="${item.alt}"
          />
        </div>

        <div class="cart-item__content">
          <span class="cart-item__category">
            ${item.category}
          </span>

          <h3 class="cart-item__title">
            ${item.title}
          </h3>

          <span class="cart-item__price">
            ${formatPrice(item.price)}
          </span>

          <div class="cart-item__bottom">
            <div class="cart-item__quantity">
              <button
                type="button"
                data-cart-action="decrease"
                aria-label="Decrease quantity"
              >
                −
              </button>

              <span>
                ${item.quantity}
              </span>

              <button
                type="button"
                data-cart-action="increase"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>

            <button
              class="cart-item__remove"
              type="button"
              data-cart-action="remove"
            >
              Remove
            </button>
          </div>
        </div>
      </article>
    `
  )
  .join("");

if (cartTotalElement) {
  cartTotalElement.textContent =
    formatPrice(getCartTotal());
}

updateCartCount();


}

function saveCart() {
saveCartToStorage(cart);
}

function addToCart(productId) {
const product = products.find(
(item) => item.id === Number(productId)
);


if (!product) {
  return;
}

const existingItem = cart.find(
  (item) => item.id === product.id
);

if (existingItem) {
  existingItem.quantity += 1;
} else {
  cart.push({
    ...product,
    quantity: 1,
  });
}

saveCart();
renderCart();


}

function removeFromCart(productId) {
const itemIndex = cart.findIndex(
(item) => item.id === Number(productId)
);


if (itemIndex !== -1) {
  cart.splice(itemIndex, 1);
}

saveCart();
renderCart();


}

function updateQuantity(productId, change) {
const item = cart.find(
(item) => item.id === Number(productId)
);


if (!item) {
  return;
}

item.quantity += change;

if (item.quantity <= 0) {
  removeFromCart(productId);
  return;
}

saveCart();
renderCart();


}

function openCart() {
cartElement.classList.add("is-open");


cartElement.setAttribute("aria-hidden", "false");

// document.documentElement.classList.add(
//   "is-scroll-locked"
// );

// document.body.classList.add(
//   "is-scroll-locked"
// );

lockScroll();

}

function closeCart() {
cartElement.classList.remove("is-open");


cartElement.setAttribute("aria-hidden", "true");

// document.documentElement.classList.remove(
//   "is-scroll-locked"
// );

// document.body.classList.remove(
//   "is-scroll-locked"
// );

unlockScroll();

}

/* Add product */

// document.addEventListener("click", (event) => {
// const addButton = event.target.closest(
// "[data-add-to-cart]"
// );


// if (!addButton) {
//   return;
// }

// addToCart(addButton.dataset.addToCart);

// openCart();


// });

/* Add product from Product Modal */

document.addEventListener("cart:add", (event) => {
  const { productId } = event.detail;

  addToCart(productId);

  openCart();
});



/* Cart actions */

cartItemsContainer?.addEventListener(
"click",
(event) => {
const actionButton = event.target.closest(
"[data-cart-action]"
);


  if (!actionButton) {
    return;
  }

  const cartItem = actionButton.closest(
    "[data-cart-item]"
  );

  if (!cartItem) {
    return;
  }

  const productId =
    cartItem.dataset.cartItem;

  const action =
    actionButton.dataset.cartAction;

  if (action === "increase") {
    updateQuantity(productId, 1);
  }

  if (action === "decrease") {
    updateQuantity(productId, -1);
  }

  if (action === "remove") {
    removeFromCart(productId);
  }
}


);

/* Open cart */

cartCountElements.forEach((element) => {
const button = element.closest("button");


button?.addEventListener("click", openCart);


});

/* Checkout */

checkoutButton?.addEventListener("click", () => {
  if (cart.length === 0) {
    return;
  }

  window.location.href = "/checkout.html";
});

/* Close */

closeButton?.addEventListener(
"click",
closeCart
);

overlay?.addEventListener(
"click",
closeCart
);

document.addEventListener("keydown", (event) => {
if (
event.key === "Escape" &&
cartElement.classList.contains("is-open")
) {
closeCart();
}
});

/* Initial render */

renderCart();
}

