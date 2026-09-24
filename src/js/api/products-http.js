import { request } from "./api-client.js";

function normalizeProductImagePath(image) {
  if (typeof image !== "string") {
    return image;
  }

  const value = image.trim();

  if (!value) {
    return value;
  }

  // External image URL
  if (/^https?:\/\//.test(value)) {
    return value;
  }

  // Already absolute project path
  if (value.startsWith("/")) {
    return value;
  }

  // Local public path without leading slash
  if (value.startsWith("images/")) {
    return `/${value}`;
  }

  return value;
}

function normalizeProduct(product) {
  if (!product) {
    return product;
  }

  return {
    ...product,
    image: normalizeProductImagePath(
      product.image
    ),
  };
}

function normalizeProducts(products) {
  return products.map(normalizeProduct);
}

export async function getAllProducts() {
  const products = await request("/products");

  return normalizeProducts(products);
}

export async function getProductById(productId) {
  const product = await request(
    `/products/${productId}`
  );

  return normalizeProduct(product);
}

export async function createProduct(
  productData
) {
  const normalizedData = {
    ...productData,
    image: normalizeProductImagePath(
      productData.image
    ),
  };

  const product = await request(
    "/products",
    {
      method: "POST",
      body: JSON.stringify(
        normalizedData
      ),
    }
  );

  return normalizeProduct(product);
}

export async function updateProduct(
  productId,
  productData
) {
  const normalizedData = {
    ...productData,
    image: normalizeProductImagePath(
      productData.image
    ),
  };

  const product = await request(
    `/products/${productId}`,
    {
      method: "PATCH",
      body: JSON.stringify(
        normalizedData
      ),
    }
  );

  return normalizeProduct(product);
}

export async function deleteProduct(
  productId
) {
  const result = await request(
    `/products/${productId}`,
    {
      method: "DELETE",
    }
  );

  if (result?.product) {
    return {
      ...result,
      product:
        normalizeProduct(
          result.product
        ),
    };
  }

  return result;
}