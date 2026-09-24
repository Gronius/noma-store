import "../../styles/main.scss";

import {
  getAllProducts,
} from "../api/products-http.js";

import { createOrder } from "../api/orders-api.js";

import {
  getCartFromStorage,
  saveCartToStorage,
} from "../utils/storage.js";

import { initHeader } from "../components/header.js";
import { initCart } from "../components/cart.js";

const checkoutPage = document.querySelector(
  "[data-checkout]"
);

const checkoutForm = document.querySelector(
  "#checkout-form"
);

const checkoutItems = document.querySelector(
  "[data-checkout-items]"
);

const checkoutTotal = document.querySelector(
  "[data-checkout-total]"
);

const checkoutMessage = document.querySelector(
  "[data-checkout-message]"
);

const checkoutSuccess = document.querySelector(
  "[data-checkout-success]"
);

const orderIdElement = document.querySelector(
  "[data-order-id]"
);

let products = [];
let cart = [];

function formatPrice(price) {
  return `€${price.toFixed(2)}`;
}

function getCartTotal() {
  return cart.reduce(
    (total, item) =>
      total + item.price * item.quantity,
    0
  );
}

function getCartItemCount() {
  return cart.reduce(
    (total, item) =>
      total + item.quantity,
    0
  );
}

function renderOrderSummary() {
  if (!checkoutItems) {
    return;
  }

  if (cart.length === 0) {
    checkoutItems.innerHTML = `
      <p class="checkout-summary__empty">
        Your cart is empty.
      </p>
    `;

    if (checkoutTotal) {
      checkoutTotal.textContent = "€0.00";
    }

    return;
  }

  checkoutItems.innerHTML = cart
    .map(
      (item) => `
        <article class="checkout-summary__item">
          <div class="checkout-summary__image">
            <img
              src="${item.image}"
              alt="${item.alt}"
            />
          </div>

          <div class="checkout-summary__content">
            <h3 class="checkout-summary__item-title">
              ${item.title}
            </h3>

            <span class="checkout-summary__quantity">
              Qty: ${item.quantity}
            </span>

            <strong class="checkout-summary__item-price">
              ${formatPrice(
                item.price * item.quantity
              )}
            </strong>
          </div>
        </article>
      `
    )
    .join("");

  if (checkoutTotal) {
    checkoutTotal.textContent =
      formatPrice(getCartTotal());
  }
}

function showFieldError(fieldName, message) {
  const field =
    checkoutForm?.querySelector(
      `[name="${fieldName}"]`
    );

  const error =
    checkoutForm?.querySelector(
      `[data-error-for="${fieldName}"]`
    );

  if (!field || !error) {
    return;
  }

  const fieldWrapper =
    field.closest(".form-field");

  fieldWrapper?.classList.add(
    "form-field--error"
  );

  error.textContent = message;
  error.hidden = false;
}

function clearFieldError(fieldName) {
  const field =
    checkoutForm?.querySelector(
      `[name="${fieldName}"]`
    );

  const error =
    checkoutForm?.querySelector(
      `[data-error-for="${fieldName}"]`
    );

  if (!field || !error) {
    return;
  }

  const fieldWrapper =
    field.closest(".form-field");

  fieldWrapper?.classList.remove(
    "form-field--error"
  );

  error.textContent = "";
  error.hidden = true;
}

function clearErrors() {
  const fields = [
    "name",
    "email",
    "phone",
    "address",
    "city",
    "postalCode",
    "paymentMethod",
  ];

  fields.forEach(clearFieldError);

  if (checkoutMessage) {
    checkoutMessage.hidden = true;
    checkoutMessage.textContent = "";
  }
}

function validateForm(formData) {
  clearErrors();

  let isValid = true;

  const name =
    formData.get("name")?.trim();

  const email =
    formData.get("email")?.trim();

  const phone =
    formData.get("phone")?.trim();

  const address =
    formData.get("address")?.trim();

  const city =
    formData.get("city")?.trim();

  const postalCode =
    formData.get("postalCode")?.trim();

  const paymentMethod =
    formData.get("paymentMethod");

  if (!name) {
    showFieldError(
      "name",
      "Please enter your name."
    );

    isValid = false;
  }

  if (
    !email ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
      email
    )
  ) {
    showFieldError(
      "email",
      "Please enter a valid email address."
    );

    isValid = false;
  }

  if (!phone || phone.length < 7) {
    showFieldError(
      "phone",
      "Please enter a valid phone number."
    );

    isValid = false;
  }

  if (!address) {
    showFieldError(
      "address",
      "Please enter your address."
    );

    isValid = false;
  }

  if (!city) {
    showFieldError(
      "city",
      "Please enter your city."
    );

    isValid = false;
  }

  if (!postalCode) {
    showFieldError(
      "postalCode",
      "Please enter your postal code."
    );

    isValid = false;
  }

  if (!paymentMethod) {
    showFieldError(
      "paymentMethod",
      "Please choose a payment method."
    );

    isValid = false;
  }

  return isValid;
}

function showSuccess(order) {
  checkoutPage?.setAttribute(
    "hidden",
    ""
  );

  checkoutSuccess?.removeAttribute(
    "hidden"
  );

  if (orderIdElement) {
    orderIdElement.textContent = order.id;
  }
}

function handleSubmit(event) {
  event.preventDefault();

  if (cart.length === 0) {
    if (checkoutMessage) {
      checkoutMessage.textContent =
        "Your cart is empty.";

      checkoutMessage.hidden = false;
    }

    return;
  }

  const formData =
    new FormData(checkoutForm);

  const isValid =
    validateForm(formData);

  if (!isValid) {
    return;
  }

  const order = createOrder({
    customer: {
      name: formData
        .get("name")
        .trim(),

      email: formData
        .get("email")
        .trim(),

      phone: formData
        .get("phone")
        .trim(),

      address: formData
        .get("address")
        .trim(),

      city: formData
        .get("city")
        .trim(),

      postalCode: formData
        .get("postalCode")
        .trim(),

      paymentMethod:
        formData.get(
          "paymentMethod"
        ),
    },

    items: cart.map(
      (item) => ({
        productId: item.id,
        title: item.title,
        price: item.price,
        quantity: item.quantity,
      })
    ),

    subtotal: getCartTotal(),
    shipping: 0,
    total: getCartTotal(),
  });

  saveCartToStorage([]);

  checkoutForm.reset();

  showSuccess(order);
}

/* ------------------------------
   Initialization
------------------------------ */

async function initializeCheckoutPage() {
  initHeader();

  try {
    /*
     * Products теперь приходят через HTTP.
     */
    products =
      await getAllProducts();

    /*
     * Cart остаётся client-side
     * и читается из localStorage.
     */
    const storedCart =
      getCartFromStorage();

    /*
     * Объединяем HTTP products
     * с локальными cart items.
     */
    cart = storedCart
      .map((item) => {
        const product =
          products.find(
            (product) =>
              product.id === item.id
          );

        if (!product) {
          return null;
        }

        return {
          ...product,
          quantity: item.quantity,
        };
      })
      .filter(Boolean);

    /*
     * Убираем из localStorage товары,
     * которых больше нет в API.
     */
    saveCartToStorage(cart);

    /*
     * Cart получает актуальный список
     * products из HTTP.
     */
    initCart(products);

    renderOrderSummary();

    checkoutForm?.addEventListener(
      "submit",
      handleSubmit
    );

    if (
      checkoutPage &&
      getCartItemCount() === 0
    ) {
      const submitButton =
        checkoutForm?.querySelector(
          '[type="submit"]'
        );

      if (submitButton) {
        submitButton.disabled = true;
      }
    }
  } catch (error) {
    console.error(
      "Checkout products load error:",
      error
    );

    if (checkoutMessage) {
      checkoutMessage.textContent =
        "Unable to load products. Please try again later.";

      checkoutMessage.hidden = false;
    }
  }
}

initializeCheckoutPage();
