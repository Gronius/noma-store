import "../styles/main.scss";

import {
  getProducts,
  getFeaturedProducts,
} from "./services/products.js";

import { initHeader } from "./components/header.js";
import { initProductModal } from "./components/product-modal.js";
import { createProductCard } from "./components/product-card.js";
import { initCart } from "./components/cart.js";
import { initFavorites } from "./components/favorites.js";


console.log("NOMA Store is running");


async function initStorefront() {
  try {
    const products =
      await getProducts();

    const featuredProducts =
      getFeaturedProducts(products);

    initHeader();

    const featuredProductsContainer =
      document.querySelector(
        "#featured-products"
      );

    if (featuredProductsContainer) {
      featuredProductsContainer.innerHTML =
        featuredProducts
          .map(createProductCard)
          .join("");
    }

    initProductModal(products);

    initCart(products);

    initFavorites(products);

  } catch (error) {
    console.error(
      "Failed to initialize NOMA Store:",
      error
    );
  }
}


initStorefront();