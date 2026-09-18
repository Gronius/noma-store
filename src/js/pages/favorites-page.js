import "../../styles/main.scss";

import {
  products as initialProducts,
} from "../../data/products.js";

import {
  getAllProducts,
} from "../api/products-api.js";

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


function getFavoriteProducts() {
  const products =
    getAllProducts(initialProducts);

  const favoriteIds =
    getFavoritesFromStorage();

  return products.filter(
    (product) =>
      favoriteIds.includes(product.id)
  );
}


function renderFavorites() {
  if (!favoritesGrid) {
    return;
  }

  const favoriteProducts =
    getFavoriteProducts();


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


/* Current products */

const products =
  getAllProducts(initialProducts);


/* Shared systems */

initHeader();

initFavorites(products);

initProductModal(products);

initCart(products);


/* Initial render */

renderFavorites();
