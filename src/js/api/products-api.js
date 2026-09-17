import {
  getAllProducts as getAllProductsStorage,
  getProductById as getProductByIdStorage,
  createProduct as createProductStorage,
  updateProduct as updateProductStorage,
  deleteProduct as deleteProductStorage,
} from "../modules/products.js";


export function getAllProducts(initialProducts) {
  return getAllProductsStorage(initialProducts);
}


export function getProductById(
  productId,
  initialProducts
) {
  return getProductByIdStorage(
    productId,
    initialProducts
  );
}


export function createProduct(productData) {
  return createProductStorage(productData);
}


export function updateProduct(
  productId,
  productData
) {
  return updateProductStorage(
    productId,
    productData
  );
}


export function deleteProduct(productId) {
  return deleteProductStorage(productId);
}