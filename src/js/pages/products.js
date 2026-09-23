import "../../styles/main.scss";

import { getAllProducts } from "../api/products-http.js";

import { initHeader } from "../components/header.js";

import { initProductModal,} from "../components/product-modal.js";

import {createProductCard, } from "../components/product-card.js";

import { initCart } from "../components/cart.js";

import { initFavorites,} from "../components/favorites.js";

// const products = getAllProducts(initialProducts);
let products = [];
let currentProducts = products;

//------- CARDS+MORE start

const productsGrid = document.querySelector(
  "[data-products-grid]"
);

const filterButtons = document.querySelectorAll(
  "[data-category]"
);

const productsCount = document.querySelector(
  "[data-products-count]"
);

const loadMoreButton = document.querySelector(
  "[data-load-more]"
);

const PRODUCTS_PER_LOAD = 6;

let visibleProductsCount = PRODUCTS_PER_LOAD;

function renderProducts() {
  if (!productsGrid) {
    return;
  }

  const visibleProducts =
    currentProducts.slice(
      0,
      visibleProductsCount
    );

  productsGrid.innerHTML = visibleProducts
    .map(createProductCard)
    .join("");

  updateProductsMeta();
}

function updateProductsMeta() {
  if (productsCount) {
    const visibleCount = Math.min(
      visibleProductsCount,
      currentProducts.length
    );

    productsCount.textContent =
      `Показано ${visibleCount} з ${currentProducts.length}`;
  }

  if (loadMoreButton) {
    loadMoreButton.hidden =
      visibleProductsCount >= currentProducts.length;
  }
}
//------- CARDS+MORE end

function setActiveFilter(
  activeButton
) {
  filterButtons.forEach(
    (button) => {
      button.classList.remove(
        "is-active"
      );
    }
  );

  activeButton.classList.add(
    "is-active"
  );
}

function filterProducts(
  category
) {
  if (category === "all") {
    return products;
  }

  return products.filter(
    (product) =>
      product.category === category
  );
}

/* Header */
initHeader();

/* Category Filters */

filterButtons.forEach(
  (button) => {
    button.addEventListener(
      "click",
      () => {
        const category =
          button.dataset.category;

        currentProducts =
          filterProducts(category);

        visibleProductsCount =
          PRODUCTS_PER_LOAD;

        renderProducts();

        setActiveFilter(
          button
        );
      }
    );
  }
);

//-------- ADDED BUTTOM MORE
loadMoreButton?.addEventListener(
  "click",
  () => {
    visibleProductsCount +=
      PRODUCTS_PER_LOAD;

    renderProducts();
  }
);

/* Initial Products */

async function initializeProductsPage() {
  try {
    products = await getAllProducts();

    currentProducts = products;

    renderProducts();

    initProductModal(products);
    initCart(products);
    initFavorites(products);
  } catch (error) {
    console.error("Products load error:", error);

    if (productsGrid) {
      productsGrid.innerHTML = `
        <p class="products-grid__error">
          Unable to load products.
        </p>
      `;
    }
  }
}

initializeProductsPage();
