import {
  getProducts,
  saveProducts,
} from "../storage.js";

import {
  validateProductCreate,
  validateProductUpdate,
} from "../validators/product-validator.js";


export async function getAllProducts() {
  return await getProducts();
}


export async function getProductById(
  productId
) {
  const products =
    await getProducts();

  const id =
    Number(productId);

  return (
    products.find(
      (product) =>
        product.id === id
    ) || null
  );
}


export async function createProduct(
  productData
) {
  const validatedProduct =
    validateProductCreate(
      productData
    );

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
    ...validatedProduct,
  };

  products.push(product);

  await saveProducts(
    products
  );

  return product;
}


export async function updateProduct(
  productId,
  productData
) {
  const id =
    Number(productId);

  const products =
    await getProducts();

  const index =
    products.findIndex(
      (product) =>
        product.id === id
    );

  if (index === -1) {
    return null;
  }

  const validatedProduct =
    validateProductUpdate(
      productData
    );

  const updatedProduct = {
    ...products[index],
    ...validatedProduct,
    id: products[index].id,
  };

  products[index] =
    updatedProduct;

  await saveProducts(
    products
  );

  return updatedProduct;
}


export async function deleteProduct(
  productId
) {
  const id =
    Number(productId);

  const products =
    await getProducts();

  const product =
    products.find(
      (item) =>
        item.id === id
    );

  if (!product) {
    return null;
  }

  const filteredProducts =
    products.filter(
      (item) =>
        item.id !== id
    );

  await saveProducts(
    filteredProducts
  );

  return product;
}