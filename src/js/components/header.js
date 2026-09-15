import {
  lockScroll,
  unlockScroll,
} from "../utils/scroll-lock.js";

export function initHeader() {
const menuButton = document.querySelector(".site-header__menu");
const mobileMenu = document.querySelector(".mobile-menu");

if (!menuButton || !mobileMenu) {
return;
}

const closeButton = mobileMenu.querySelector(".mobile-menu__close");
const overlay = mobileMenu.querySelector(".mobile-menu__overlay");
const menuLinks = mobileMenu.querySelectorAll(".mobile-menu__link");

function openMenu() {
mobileMenu.classList.add("is-open");


menuButton.setAttribute("aria-expanded", "true");
mobileMenu.setAttribute("aria-hidden", "false");

// document.body.style.overflow = "hidden";
// document.documentElement.classList.add("is-scroll-locked");
// document.body.classList.add("is-scroll-locked");

lockScroll();

closeButton?.focus();

}

function closeMenu() {
mobileMenu.classList.remove("is-open");


menuButton.setAttribute("aria-expanded", "false");
mobileMenu.setAttribute("aria-hidden", "true");

// document.body.style.overflow = "";

// document.documentElement.classList.remove("is-scroll-locked");
// document.body.classList.remove("is-scroll-locked");

unlockScroll();

menuButton.focus();

}

menuButton.addEventListener("click", openMenu);

closeButton?.addEventListener("click", closeMenu);

overlay?.addEventListener("click", closeMenu);

menuLinks.forEach((link) => {
link.addEventListener("click", closeMenu);
});

document.addEventListener("keydown", (event) => {
if (
event.key === "Escape" &&
mobileMenu.classList.contains("is-open")
) {
closeMenu();
}
});
}
