const PRODUCTS_STORAGE_KEY = "noma-products";

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


function getProductsFromStorage() {
  try {
    const data = localStorage.getItem(
      PRODUCTS_STORAGE_KEY
    );

  const products = JSON.parse(data);

    return products.map((product) => ({
      ...product,
      image: normalizeProductImagePath(
        product.image
      ),
    }));
  } catch (error) {
    console.error(
      "Products read error:",
      error
    );

     return null;
   }
}


function saveProductsToStorage(products) {
  try {
    const normalizedProducts =
      products.map((product) => ({
        ...product,
        image: normalizeProductImagePath(
          product.image
        ),
      }));

    localStorage.setItem(
      PRODUCTS_STORAGE_KEY,
      JSON.stringify(normalizedProducts)
    );
  } catch (error) {
    console.error(
      "Products write error:",
      error
    );
  }
}


export function initializeProducts(
  initialProducts
) {
  const storedProducts =
    getProductsFromStorage();


  if (storedProducts !== null) {
    return [...storedProducts];
  }

  const products = [
    ...initialProducts
  ];

  // saveProductsToStorage(products);

  return products;
}


export function getAllProducts(
  initialProducts
) {
  return initializeProducts(
    initialProducts
  );
}


export function getProductById(
  productId,
  initialProducts
) {
  const products =
    getAllProducts(initialProducts);

  return products.find(
    (product) =>
      product.id === Number(productId)
  );
}


export function createProduct(
  productData
) {
  const products =
    getProductsFromStorage() || [];

  const nextId =
    products.length > 0
      ? Math.max(
          ...products.map(
            (product) => product.id
          )
        ) + 1
      : 1;

  const product = {
    id: nextId,
    ...productData,
  };

  products.push(product);

  saveProductsToStorage(products);

  return { ...product };
}


export function updateProduct(
  productId,
  productData
) {
  const products =
    getProductsFromStorage() || [];

  const index =
    products.findIndex(
      (product) =>
        product.id === Number(productId)
    );

  if (index === -1) {
    return null;
  }

  const updatedProduct = {
    ...products[index],
    ...productData,
    id: products[index].id,
  };

  products[index] =
    updatedProduct;

  saveProductsToStorage(products);

  return { ...updatedProduct };
}


export function deleteProduct(
  productId
) {
  const products =
    getProductsFromStorage() || [];

  const filteredProducts =
    products.filter(
      (product) =>
        product.id !== Number(productId)
    );

  saveProductsToStorage(
    filteredProducts
  );

  return [
    ...filteredProducts
  ];
}
