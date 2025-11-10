let artistImage = document.querySelector(".artist__image");
let artistTitle = document.querySelector(".artist__title");
let artistName = document.querySelector(".artist__name");
let artistPortrait = document.querySelector(".artist__portrait");
let navigationTtitle = document.querySelector(".navigation__title");
let navigationArtist = document.querySelectorAll(".navigation__artist");
let description = document.querySelector(".content-box__description");
let source = document.querySelector(".content-box__source");
const nextBtn = document.querySelector(".navigation__btn--next");
const prevBtn = document.querySelector(".navigation__btn--prev");
let currentIndex = 0;

const cards = document.querySelectorAll(".card");

cards.forEach((card) => {
  card.addEventListener("click", () => {
    const img = card.querySelector(".card__img");
    const artWorkId = img.getAttribute("data-id");
    window.location.href = `starter-code/artist-page.html?artwork=${artWorkId}`;
  });
});
