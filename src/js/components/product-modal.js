import {
lockScroll,
unlockScroll,
} from "../utils/scroll-lock.js";

export function initProductModal(products) {
const modal = document.querySelector("#product-modal");

if (!modal) {
return;
}

const content = modal.querySelector(
".product-modal__content"
);

const closeButton = modal.querySelector(
".product-modal__close"
);

const overlay = modal.querySelector(
".product-modal__overlay"
);

function openModal(productId) {
const product = products.find(
(item) => item.id === Number(productId)
);


if (!product) {
  return;
}

content.innerHTML = `
  <div class="product-modal__image">
    <img
      src="${product.image}"
      alt="${product.alt}"
    />
  </div>

  <div class="product-modal__details">
    <p class="product-modal__category">
      ${product.category}
    </p>

    <h2
      class="product-modal__title"
      id="product-modal-title"
    >
      ${product.title}
    </h2>

    <div class="product-modal__price">
      €${product.price.toFixed(2)}
    </div>

    <p class="product-modal__description">
      ${product.description}
    </p>

    <div class="product-modal__actions">
      <button
        class="btn btn--primary"
        type="button"
        data-add-to-cart="${product.id}"
      >
        Add to cart
      </button>
    </div>
  </div>
`;

modal.classList.add("is-open");
modal.setAttribute("aria-hidden", "false");

lockScroll();

closeButton?.focus();

}

function closeModal() {
if (!modal.classList.contains("is-open")) {
return;
}

modal.classList.remove("is-open");
modal.setAttribute("aria-hidden", "true");

unlockScroll();

}

document.addEventListener("click", (event) => {
const viewButton = event.target.closest(
'[data-product-action="view"]'
);


if (viewButton) {
  const productCard = viewButton.closest(
    "[data-product-id]"
  );

  if (productCard) {
    openModal(productCard.dataset.productId);
  }

  return;
}

const addButton = event.target.closest(
  "[data-add-to-cart]"
);

if (addButton && modal.classList.contains("is-open")) {
  const productId = addButton.dataset.addToCart;

  closeModal();

  document.dispatchEvent(
    new CustomEvent("cart:add", {
      detail: {
        productId,
      },
    })
  );
}

});

closeButton?.addEventListener("click", closeModal);

overlay?.addEventListener("click", closeModal);

document.addEventListener("keydown", (event) => {
if (
event.key === "Escape" &&
modal.classList.contains("is-open")
) {
closeModal();
}
});
}
