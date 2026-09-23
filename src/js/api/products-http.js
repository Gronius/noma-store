import { request } from "./api-client.js";

export async function getAllProducts() {
  return request("/products");
}

export async function getProductById(productId) {
  return request(`/products/${productId}`);
}

export async function createProduct(productData) {
  return request("/products", {
    method: "POST",
    body: JSON.stringify(productData),
  });
}

export async function updateProduct(
  productId,
  productData
) {
  return request(`/products/${productId}`, {
    method: "PATCH",
    body: JSON.stringify(productData),
  });
}

export async function deleteProduct(productId) {
  return request(`/products/${productId}`, {
    method: "DELETE",
  });
}