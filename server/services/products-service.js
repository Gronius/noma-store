import {
  getProducts,
  saveProducts,
} from "../storage.js";

export async function getAllProducts() {
  return getProducts();
}

export async function getProductById(
  productId
) {
  const products =
    await getProducts();

  return products.find(
    (product) =>
      product.id === productId
  ) ?? null;
}

export async function createProduct(
  productData
) {
  const products =
    await getProducts();

  const nextId =
    products.length > 0
      ? Math.max(
          ...products.map(
            (product) =>
              Number(product.id)
          )
        ) + 1
      : 1;

  const product = {
    id: nextId,
    ...productData,
  };

  products.push(product);

  await saveProducts(products);

  return product;
}

export async function updateProduct(
  productId,
  productData
) {
  const products =
    await getProducts();

  const productIndex =
    products.findIndex(
      (product) =>
        product.id === productId
    );

  if (productIndex === -1) {
    return null;
  }

  const updatedProduct = {
    ...products[productIndex],
    ...productData,
    id: products[productIndex].id,
  };

  products[productIndex] =
    updatedProduct;

  await saveProducts(products);

  return updatedProduct;
}

export async function deleteProduct(
  productId
) {
  const products =
    await getProducts();

  const productIndex =
    products.findIndex(
      (product) =>
        product.id === productId
    );

  if (productIndex === -1) {
    return null;
  }

  const deletedProduct =
    products.splice(
      productIndex,
      1
    )[0];

  await saveProducts(products);

  return deletedProduct;
}