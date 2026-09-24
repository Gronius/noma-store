import "../../styles/main.scss";

import {
  getAllProducts,
} from "../api/products-http.js";

import {
  getFavoritesFromStorage,
} from "../utils/storage.js";

import { initHeader } from "../components/header.js";

import {
  initProductModal,
} from "../components/product-modal.js";

import { initCart } from "../components/cart.js";

import {
  initFavorites,
} from "../components/favorites.js";

import {
  createProductCard,
} from "../components/product-card.js";

const favoritesGrid =
  document.querySelector(
    "[data-favorites-grid]"
  );

const favoritesEmpty =
  document.querySelector(
    "[data-favorites-empty]"
  );

function getFavoriteProducts(products) {
  const favoriteIds =
    getFavoritesFromStorage();

  return products.filter(
    (product) =>
      favoriteIds.includes(product.id)
  );
}

function renderFavorites(products) {
  if (!favoritesGrid) {
    return;
  }

  const favoriteProducts =
    getFavoriteProducts(products);

  if (favoriteProducts.length === 0) {
    favoritesGrid.innerHTML = "";

    favoritesEmpty?.removeAttribute(
      "hidden"
    );

    return;
  }

  favoritesEmpty?.setAttribute(
    "hidden",
    ""
  );

  favoritesGrid.innerHTML =
    favoriteProducts
      .map(createProductCard)
      .join("");
}

/* ------------------------------
   Header
------------------------------ */

initHeader();

/* ------------------------------
   Favorites Page
------------------------------ */

async function initializeFavoritesPage() {
  try {
    const products =
      await getAllProducts();

    renderFavorites(products);

    initFavorites(products);
    initProductModal(products);
    initCart(products);
  } catch (error) {
    console.error(
      "Favorites page load error:",
      error
    );

    if (favoritesGrid) {
      favoritesGrid.innerHTML = `
        <p class="favorites-page__error">
          Unable to load products.
        </p>
      `;
    }
  }
}

initializeFavoritesPage();/* Initial render */

renderFavorites();
