let lockCount = 0;

export function lockScroll() {
  lockCount += 1;

  if (lockCount === 1) {
    document.documentElement.classList.add("is-scroll-locked");
    document.body.classList.add("is-scroll-locked");
  }
}

export function unlockScroll() {
  if (lockCount === 0) {
    return;
  }

  lockCount -= 1;

  if (lockCount === 0) {
    document.documentElement.classList.remove("is-scroll-locked");
    document.body.classList.remove("is-scroll-locked");
  }
}

export function resetScrollLock() {
  lockCount = 0;

  document.documentElement.classList.remove("is-scroll-locked");
  document.body.classList.remove("is-scroll-locked");
}