const CART_STORAGE_KEY = "noma-cart";

export function getStorage(key) {
try {
const data = localStorage.getItem(key);

return data ? JSON.parse(data) : null;

} catch (error) {
console.error("Storage read error:", error);

return null;

}
}

export function setStorage(key, data) {
try {
localStorage.setItem(
key,
JSON.stringify(data)
);
} catch (error) {
console.error("Storage write error:", error);
}
}

export function getCartFromStorage() {
return getStorage(CART_STORAGE_KEY) ?? [];
}

export function saveCartToStorage(cart) {
setStorage(CART_STORAGE_KEY, cart);
}

// favorites
const FAVORITES_STORAGE_KEY = "noma-favorites";

export function getFavoritesFromStorage() {
  return getStorage(FAVORITES_STORAGE_KEY) ?? [];
}

export function saveFavoritesToStorage(favorites) {
  setStorage(FAVORITES_STORAGE_KEY, favorites);
}

// localStorage.setItem("noma-favorites", JSON.stringify([1, 4]));
