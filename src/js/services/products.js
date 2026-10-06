import {
  getAllProducts,
  getProductById,
  createProduct as createProductRequest,
  updateProduct as updateProductRequest,
  deleteProduct as deleteProductRequest,
} from "../api/products-http.js";


export async function getProducts() {
  return await getAllProducts();
}


export async function getProduct(id) {
  return await getProductById(id);
}


export function getFeaturedProducts(products) {
  return products.filter(
    (product) => product.featured
  );
}


export async function createProduct(productData) {
  return await createProductRequest(
    productData
  );
}


export async function updateProduct(
  productId,
  productData
) {
  return await updateProductRequest(
    productId,
    productData
  );
}


export async function deleteProduct(productId) {
  return await deleteProductRequest(
    productId
  );
}