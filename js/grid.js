function resizeGridItems() {
  const gallery = document.querySelector(".gallery");
  if (!gallery) return;

  const rowHeightStr = getComputedStyle(gallery).getPropertyValue("grid-auto-rows");
  const rowGapStr =
    getComputedStyle(gallery).getPropertyValue("gap") ||
    getComputedStyle(gallery).getPropertyValue("grid-row-gap");
  const rowHeight = parseFloat(rowHeightStr) || 8;
  const rowGap = parseFloat(rowGapStr) || 24;

  const items = gallery.querySelectorAll(".card");
  items.forEach((item) => {
    item.style.gridRowEnd = null;
    const itemHeight = item.getBoundingClientRect().height;
    const rowSpan = Math.ceil((itemHeight + rowGap) / (rowHeight + rowGap));
    item.style.gridRowEnd = "span " + rowSpan;
  });
}

/* need all content loaded before measuring height and gap for grid calculation so "load" is necessary, meaning function should only run after loading. */
window.addEventListener("load", resizeGridItems);

// Use requestAnimationFrame for smoother resize handling
let resizeTimeout;
window.addEventListener("resize", () => {
  if (resizeTimeout) {
    cancelAnimationFrame(resizeTimeout);
  }
  resizeTimeout = requestAnimationFrame(() => {
    resizeGridItems();
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const imgs = document.querySelectorAll(".card__img");
  imgs.forEach((img) => {
    if (img.complete) return;
    img.addEventListener("load", () => resizeGridItems());
  });
});

window.resizeGridItems = resizeGridItems;
