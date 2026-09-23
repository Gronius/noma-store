import "../../styles/main.scss";

import {
  getAllProducts,
  getProductById,
} from "../api/products-http.js";

import { initHeader } from "../components/header.js";
import { initCart } from "../components/cart.js";

const productPage =
  document.querySelector(
    "[data-product-page]"
  );

function getProductIdFromUrl() {
  const params = new URLSearchParams(
    window.location.search
  );

  return Number(params.get("id"));
}

function renderProduct(product) {
  if (!productPage) {
    return;
  }

  if (!product) {
    productPage.innerHTML = `
      <div class="product-page__not-found">
        <h1>
          Product not found
        </h1>

        <p>
          The product you are looking for
          does not exist.
        </p>

        <a
          class="btn btn--primary"
          href="/products.html"
        >
          Back to products
        </a>
      </div>
    `;

    return;
  }

  productPage.innerHTML = `
    <div class="product-page__grid">

      <div class="product-page__media">
        <img
          src="${product.image}"
          alt="${product.alt}"
        />
      </div>

      <div class="product-page__details">

        <p class="product-page__category">
          ${product.category}
        </p>

        <h1 class="product-page__title">
          ${product.title}
        </h1>

        <div class="product-page__price">
          €${Number(product.price).toFixed(2)}
        </div>

        <p class="product-page__description">
          ${product.description}
        </p>

        <div class="product-page__actions">
          <button
            class="btn btn--primary"
            type="button"
            data-add-to-cart="${product.id}"
          >
            Add to cart
          </button>
        </div>

      </div>
    </div>
  `;
}

/* ------------------------------
   Header
------------------------------ */

initHeader();

/* ------------------------------
   Product
------------------------------ */

async function initializeProductPage() {
  const productId =
    getProductIdFromUrl();

  try {
    const [products, product] =
      await Promise.all([
        getAllProducts(),
        getProductById(productId),
      ]);

    renderProduct(product);

    initCart(products);
  } catch (error) {
    console.error(
      "Product page load error:",
      error
    );

    if (
      error.message ===
      "API request failed: 404 Not Found"
    ) {
      renderProduct(null);
      return;
    }

    if (productPage) {
      productPage.innerHTML = `
        <div class="product-page__not-found">
          <h1>
            Unable to load product
          </h1>

          <p>
            Please try again later.
          </p>
        </div>
      `;
    }
  }
}

initializeProductPage();
