export function createProductCard(product) {
  const badgeMarkup = product.badge
    ? `       <span class="product-card__badge">
        ${product.badge}       </span>
    `
    : "";

  return ` 
  <article class="product-card" data-product-id="${product.id}"> 
   <div class="product-card__image"> <a
       class="product-card__image-link"
       href="/product.html?id=${product.id}"
       aria-label="View ${product.title}"
     >
      <img
         src="${product.image}"
         alt="${product.alt}"
       /> </a>

       <button
  class="product-card__favorite"
  type="button"
  data-favorite-product="${product.id}"
  aria-label="Add to favorites"
  aria-pressed="false"
>
  ♡
</button>


    ${badgeMarkup}
  </div>

  <div class="product-card__content">
    <span class="product-card__category">
      ${product.category}
    </span>

    <h3 class="product-card__title">
      <a
        class="product-card__title-link"
        href="/product.html?id=${product.id}"
      >
        ${product.title}
      </a>
    </h3>

    <div class="product-card__bottom">
      <span class="product-card__price">
        €${product.price.toFixed(2)}
      </span>

      <button
        class="btn btn--ghost product-card__action"
        type="button"
        data-product-action="view"
      >
        View
      </button>
    </div>
  </div>
</article>


`;
}
