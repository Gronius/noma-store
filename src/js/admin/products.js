import "../../styles/main.scss";

import {
  products as initialProducts,
} from "../../data/products.js";

import {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../modules/products.js";


const productsTable = document.querySelector(
    "[data-products-table]"
  );

const addProductButton = document.querySelector(
    "[data-add-product]"
  );

const formWrapper = document.querySelector(
    "[data-product-form-wrapper]"
  );

const productForm = document.querySelector(
    "#admin-product-form"
  );

const formTitle = document.querySelector(
    "[data-product-form-title]"
  );

const formSubmit = document.querySelector(
    "[data-product-submit]"
  );

const cancelButtons = document.querySelectorAll(
    "[data-cancel-product]"
  );

const imageInput = productForm?.querySelector(
  "[data-product-image-url]"
);

const altInput = productForm?.querySelector(
  "[data-product-alt]"
);

const imagePreview = productForm?.querySelector(
  "[data-product-image-preview]"
);

const imagePreviewImg = productForm?.querySelector(
  "[data-product-image-preview-img]"
);


let editingProductId = null;


/* ------------------------------
   Helpers
------------------------------ */

function formatPrice(price) {
  return `€${Number(price).toFixed(2)}`;
}


function getProducts() {
  return getAllProducts(
    initialProducts
  );
}


/* ------------------------------
   Render Products
------------------------------ */

function renderProducts() {
  if (!productsTable) {
    return;
  }

  const products = getProducts();

  productsTable.innerHTML =
    products
      .map(
        (product) => `
          <tr
            data-product-id="${product.id}"
          >

            <td>
              <div class="admin-product">

                <div class="admin-product__image">

                  ${
                    product.image
                      ? `
                        <img
                          src="${product.image}"
                          alt="${product.alt}"
                        />
                      `
                      : ""
                  }

                </div>

                <div
                  class="admin-product__info"
                >

                  <strong
                    class="admin-product__title"
                  >
                    ${product.title}
                  </strong>

                  <span
                    class="admin-product__id"
                  >
                    ID: ${product.id}
                  </span>

                </div>

              </div>
            </td>

            <td>

              <span
                class="admin-product__category"
              >
                ${product.category}
              </span>

            </td>

            <td>

              <strong>
                ${formatPrice(product.price)}
              </strong>

            </td>

            <td>

              <span
                class="
                  admin-product__featured
                  ${
                    product.featured
                      ? "is-active"
                      : ""
                  }
                "
              >
                ${
                  product.featured
                    ? "Yes"
                    : "No"
                }
              </span>

            </td>

            <td>

              <div
                class="admin-product__actions"
              >

                <button
                  class="btn btn--ghost"
                  type="button"
                  data-product-action="edit"
                  data-product-id="${product.id}"
                >
                  Edit
                </button>

                <button
                  class="
                    btn
                    btn--ghost
                    admin-product__delete
                  "
                  type="button"
                  data-product-action="delete"
                  data-product-id="${product.id}"
                >
                  Delete
                </button>

              </div>

            </td>

          </tr>
        `
      )
      .join("");
}


/* ------------------------------
   Form State
------------------------------ */

function setAddMode() {
  editingProductId = null;

  if (formTitle) {
    formTitle.textContent =
      "Add Product";
  }

  if (formSubmit) {
    formSubmit.textContent =
      "Save Product";
  }

  productForm?.setAttribute(
    "data-product-form-mode",
    "add"
  );
   hideImagePreview();
}


function setEditMode(product) {
  editingProductId = product.id;

  if (formTitle) {
    formTitle.textContent =
      "Edit Product";
  }

  if (formSubmit) {
    formSubmit.textContent =
      "Update Product";
  }

  productForm?.setAttribute(
    "data-product-form-mode",
    "edit"
  );


  const titleInput =
    productForm?.querySelector(
      '[name="title"]'
    );

  const categoryInput =
    productForm?.querySelector(
      '[name="category"]'
    );

  const priceInput =
    productForm?.querySelector(
      '[name="price"]'
    );

  const imageInput =
    productForm?.querySelector(
      '[name="image"]'
    );

  const altInput =
    productForm?.querySelector(
      '[name="alt"]'
    );

  const descriptionInput =
    productForm?.querySelector(
      '[name="description"]'
    );

  const badgeInput =
    productForm?.querySelector(
      '[name="badge"]'
    );

  const featuredInput =
    productForm?.querySelector(
      '[name="featured"]'
    );


  if (titleInput) {
    titleInput.value =
      product.title;
  }

  if (categoryInput) {
    categoryInput.value =
      product.category;
  }

  if (priceInput) {
    priceInput.value =
      product.price;
  }

 if (imageInput) {
  imageInput.value =
    product.image || "";

  updateImagePreview(imageInput.value);
}

  if (altInput) {
    altInput.value =
      product.alt || "";
  }

  if (descriptionInput) {
    descriptionInput.value =
      product.description || "";
  }

  if (badgeInput) {
    badgeInput.value =
      product.badge || "";
  }

  if (featuredInput) {
    featuredInput.checked =
      Boolean(product.featured);
  }
}


/* ------------------------------
   Show / Hide Form
------------------------------ */

function showProductForm() {
  formWrapper?.removeAttribute(
    "hidden"
  );

  formWrapper?.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });

  productForm?.querySelector(
    '[name="title"]'
  )?.focus();
}


function hideProductForm() {
  formWrapper?.setAttribute(
    "hidden",
    ""
  );

  productForm?.reset();

  clearErrors();

  setAddMode();
}


/* ------------------------------
   Validation
------------------------------ */

function showFieldError(
  fieldName,
  message
) {
  const field =
    productForm?.querySelector(
      `[name="${fieldName}"]`
    );

  const error =
    productForm?.querySelector(
      `[data-error-for="${fieldName}"]`
    );

  if (!field || !error) {
    return;
  }

  field
    .closest(".form-field")
    ?.classList.add(
      "form-field--error"
    );

  error.textContent = message;
  error.hidden = false;
}


function clearFieldError(fieldName) {
  const field =
    productForm?.querySelector(
      `[name="${fieldName}"]`
    );

  const error =
    productForm?.querySelector(
      `[data-error-for="${fieldName}"]`
    );

  if (!field || !error) {
    return;
  }

  field
    .closest(".form-field")
    ?.classList.remove(
      "form-field--error"
    );

  error.textContent = "";
  error.hidden = true;
}


function clearErrors() {
  [
    "title",
    "category",
    "price",
    "image",
    "alt",
    "description",
  ].forEach(clearFieldError);
}


function validateProductForm(
  formData
) {
  clearErrors();

  let isValid = true;

  const title =
    formData.get("title")?.trim();

  const category =
    formData.get("category");

  const price =
    Number(formData.get("price"));

  const image =
    formData.get("image")?.trim();

  const alt =
    formData.get("alt")?.trim();

  const description =
    formData
      .get("description")
      ?.trim();


  if (!title) {
    showFieldError(
      "title",
      "Please enter a product title."
    );

    isValid = false;
  }


  if (!category) {
    showFieldError(
      "category",
      "Please choose a category."
    );

    isValid = false;
  }


  if (
    !Number.isFinite(price) ||
    price < 0
  ) {
    showFieldError(
      "price",
      "Please enter a valid price."
    );

    isValid = false;
  }


  if (
  image &&
  !(
    /^https?:\/\/.+/.test(image) ||
    image.startsWith("/")
  )
) 
  {
    showFieldError(
      "image",
      "Please enter a valid image URL."
    );

    isValid = false;
  }


  if (!alt) {
    showFieldError(
      "alt",
      "Please enter image alt text."
    );

    isValid = false;
  }


  if (!description) {
    showFieldError(
      "description",
      "Please enter a product description."
    );

    isValid = false;
  }


  return isValid;
}


/* ------------------------------
   Create / Update
------------------------------ */

function getProductData(
  formData
) {
  return {
    title:
      formData.get("title").trim(),

    category:
      formData.get("category"),

    price:
      Number(
        formData.get("price")
      ),

    image:
      formData.get("image").trim(),

    alt:
      formData.get("alt").trim(),

    description:
      formData
        .get("description")
        .trim(),

    badge:
      formData.get("badge") || null,

    featured:
      formData.get("featured") === "on",
  };
}


function handleSubmit(event) {
  event.preventDefault();

  if (!productForm) {
    return;
  }

  const formData =
    new FormData(productForm);


  if (
    !validateProductForm(
      formData
    )
  ) {
    return;
  }


  const productData =
    getProductData(formData);


  if (
    editingProductId === null
  ) {
    createProduct(
      productData
    );
  } else {
    updateProduct(
      editingProductId,
      productData
    );
  }


  hideProductForm();

  renderProducts();
}

/* ------------------------------
  Preview Image
------------------------------ */
function hideImagePreview() {
  if (!imagePreview || !imagePreviewImg) return;

  imagePreview.hidden = true;
  imagePreviewImg.removeAttribute("src");
  imagePreviewImg.alt = "";
}

function updateImagePreview(url) {
  if (!imagePreview || !imagePreviewImg) return;

  const imageUrl = url.trim();

  if (!imageUrl) {
    hideImagePreview();
    return;
  }

  const previewImage = new Image();

  previewImage.onload = () => {
    imagePreviewImg.src = imageUrl;
    imagePreviewImg.alt =
      altInput?.value.trim() || "Product image preview";

    imagePreview.hidden = false;
  };

  previewImage.onerror = () => {
    hideImagePreview();
  };

  previewImage.src = imageUrl;
}

imageInput?.addEventListener("input", () => {
  updateImagePreview(imageInput.value);
});

altInput?.addEventListener("input", () => {
  if (
    imagePreview &&
    imagePreviewImg &&
    !imagePreview.hidden
  ) {
    imagePreviewImg.alt =
      altInput.value.trim() || "Product image preview";
  }
});

/* ------------------------------
   Edit
------------------------------ */

function handleEdit(productId) {
  const product = getProducts().find(
      (item) =>
        item.id === Number(productId)
    );

  if (!product) {
    return;
  }

  setEditMode(product);

  showProductForm();

  //  deleteProduct(product.id);

  // renderProducts();
}

function handleDelete(productId) {
  const product =
    getProducts().find(
      (item) =>
        item.id === Number(productId)
    );

  if (!product) {
    return;
  }

  const confirmed = window.confirm(
    `Are you sure you want to delete "${product.title}"?`
  );

  if (!confirmed) {
    return;
  }

  deleteProduct(product.id);

  renderProducts();
}
/* ------------------------------
   Events
------------------------------ */

addProductButton?.addEventListener(
  "click",
  () => {
    setAddMode();

    showProductForm();
  }
);


cancelButtons.forEach(
  (button) => {
    button.addEventListener(
      "click",
      hideProductForm
    );
  }
);


productForm?.addEventListener(
  "submit",
  handleSubmit
);


productsTable?.addEventListener(
  "click",
  (event) => {
    const actionButton =
      event.target.closest(
        "[data-product-action]"
      );

    if (!actionButton) {
      return;
    }

     event.stopPropagation();

    const productId = actionButton.dataset.productId;

    const action =  actionButton.dataset.productAction;


    if (action === "edit") {
      handleEdit(productId);
    }

    if (action === "delete") {
      handleDelete(productId);
    }
  }
);


/* ------------------------------
   Initial Render
------------------------------ */

setAddMode();

renderProducts();
