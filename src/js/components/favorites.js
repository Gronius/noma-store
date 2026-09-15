import {
getFavoritesFromStorage,
saveFavoritesToStorage,
} from "../utils/storage.js";

export function initFavorites(products) {
const favoriteIds = getFavoritesFromStorage();

function getFavoriteButtons() {
  return document.querySelectorAll(
    "[data-favorite-product]"
  );
}

function isFavorite(productId) {
return favoriteIds.includes(Number(productId));
}

function saveFavorites() {
saveFavoritesToStorage(favoriteIds);
}

function updateButton(button) {
const productId = Number(
button.dataset.favoriteProduct
);


const active = isFavorite(productId);

button.classList.toggle(
  "is-active",
  active
);

button.setAttribute(
  "aria-pressed",
  String(active)
);

button.setAttribute(
  "aria-label",
  active
    ? "Remove from favorites"
    : "Add to favorites"
);


}


function updateAllButtons() {
  getFavoriteButtons().forEach(updateButton);
}

function addFavorite(productId) {
const id = Number(productId);


if (isFavorite(id)) {
  return;
}

favoriteIds.push(id);

saveFavorites();

}

function removeFavorite(productId) {
const id = Number(productId);

const index = favoriteIds.indexOf(id);

if (index === -1) {
  return;
}

favoriteIds.splice(index, 1);

saveFavorites();

}

function toggleFavorite(productId) {
if (isFavorite(productId)) {
removeFavorite(productId);
} else {
addFavorite(productId);
}

updateAllButtons();

}

document.addEventListener(
"click",
(event) => {
const button = event.target.closest(
"[data-favorite-product]"
);

  if (!button) {
    return;
  }

  toggleFavorite(
    button.dataset.favoriteProduct
  );
}


);

updateAllButtons();

return {
getFavorites: () => [...favoriteIds],


isFavorite,

addFavorite,

removeFavorite,

toggleFavorite,


};
}
