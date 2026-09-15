import "../styles/main.scss";

import { products as initialProducts } from "../data/products.js";

import {
  getAllProducts,
} from "./modules/products.js";

import { initHeader } from "./components/header.js";
import { initProductModal } from "./components/product-modal.js";
import { createProductCard } from "./components/product-card.js";
import { initCart } from "./components/cart.js";
import { initFavorites } from "./components/favorites.js";

console.log("NOMA Store is running");

const products =
  getAllProducts(initialProducts);//added

initHeader();

const featuredProductsContainer =
document.querySelector("#featured-products");

if (featuredProductsContainer) {
const featuredProducts = products.filter(
(product) => product.featured
);



featuredProductsContainer.innerHTML = featuredProducts
.map(createProductCard)
  .join("");
}

initProductModal(products);
initCart(products);
initFavorites(products);