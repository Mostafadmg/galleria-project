// === DOM Elements ===
// === DOM ELEMENTS ===
const artistImageContainer = document.querySelector(".artist__image-container");
const artistSource = artistImageContainer.querySelector("source");
const artistImage = document.querySelector(".artist__image");

const artistTitle = document.querySelector(".artist__title");
const artistName = document.querySelector(".artist__name");
const artistPortrait = document.querySelector(".artist__portrait");

const contentYear = document.querySelector(".content-box__year"); // year paragraph
const description = document.querySelector(".content-box__description");
const source = document.querySelector(".content-box__source");

const navigationTitle = document.querySelector(".navigation__title");
const navigationArtist = document.querySelector(".navigation__artist");

const nextBtn = document.querySelector(".navigation__button--next");
const prevBtn = document.querySelector(".navigation__button--prev");
const progressBar = document.querySelector(".navigation__progress-bar");

let artistData = null;
let currentIndex = 0;

/* ================================================================================================= */
// Global variable to store the data

const fetchArtistData = async () => {
  try {
    const response = await fetch("../data/data.json");
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const data = await response.json();
    artistData = data;
    return data;
  } catch (error) {
    console.error("Error fetching artist data:", error);
    return null;
  }
};

/* ================================================================================================= */
const initPage = async () => {
  // 1️⃣ Wait for the JSON data
  await fetchArtistData();

  // 2️⃣ If data didn’t load, stop
  if (!artistData) {
    console.error("No artist data found!");
    return;
  }

  // 3️⃣ Get the artwork name from the URL

  const params = new URLSearchParams(window.location.search);
  const artworkName = params.get("artwork");

  // 4️⃣ Find that artwork in the data
  currentIndex = artistData.findIndex(
    (art) => art.name.toLowerCase().replaceAll(" ", "-") === artworkName
  );

  // 5️⃣ If not found, default to first artwork

  if (currentIndex === -1) currentIndex = 0;

  updateDisplay();
};

/* ================================================================================================= */

const slideshowSection = document.querySelector(".slideshow");

const updateDisplay = () => {
  const art = artistData[currentIndex];
  if (!art) return;

  // 1️⃣ Start fade out
  slideshowSection.classList.remove("show");

  // 2️⃣ Wait until fade-out completes (about 400ms)
  setTimeout(() => {
    /* ======= Update all content ======= */
    artistSource.srcset = art.images.hero.large;
    artistImage.src = art.images.hero.small;
    artistImage.alt = art.name;

    artistTitle.textContent = art.name;
    artistName.textContent = art.artist.name;
    artistPortrait.src = art.artist.image;
    artistPortrait.alt = art.artist.name;

    description.textContent = art.description;
    contentYear.textContent = art.year;

    source.href = art.source;
    source.textContent = "Go to source";

    navigationTitle.textContent = art.name;
    navigationArtist.textContent = art.artist.name;

    updateProgressBar();

    // 3️⃣ Fade back in
    slideshowSection.classList.add("show");
  }, 300); // Match with CSS transition time (0.5s)
};

/* ================================================================================================= */
document.addEventListener("DOMContentLoaded", initPage);

/* ================================================================================================= */

nextBtn.addEventListener("click", () => {
  if (!artistData) return; // safety check

  // Move forward
  currentIndex++;

  // If we pass the end, wrap to first item
  if (currentIndex >= artistData.length) {
    currentIndex = 0;
  }

  updateDisplay(); // refresh the display
});
prevBtn.addEventListener("click", () => {
  if (!artistData) return; // safety check

  // Move backward
  currentIndex--;

  // If we go before the first item, wrap to last
  if (currentIndex < 0) {
    currentIndex = artistData.length - 1;
  }

  updateDisplay(); // refresh the display
});

/*================================================================================================= */

const updateProgressBar = () => {
  const total = artistData.length;
  const progressPercent = ((currentIndex + 1) / total) * 100;
  progressBar.style.width = `${progressPercent}%`;
};

/* ================================================================================================= */
// === Modal (View Image) ===
const modal = document.querySelector(".modal");
const modalImage = document.querySelector(".modal__image");
const modalSource = document.querySelector(".modal__picture source");
const viewBtn = document.querySelector(".artist__view-button");
const closeBtn = document.querySelector(".modal__close");

viewBtn.addEventListener("click", () => {
  const art = artistData[currentIndex];
  modal.classList.remove("hidden");

  // update responsive sources dynamically
  modalSource.srcset = art.images.hero.large;
  modalImage.src = art.images.hero.small;
  modalImage.alt = art.name;
});

closeBtn.addEventListener("click", () => {
  modal.classList.add("hidden");
});

modal.addEventListener("click", (e) => {
  // clicking background closes modal
  if (e.target === modal) modal.classList.add("hidden");
});
