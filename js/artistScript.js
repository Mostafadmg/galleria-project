// === DOM ELEMENTS ===
const artistImageContainer = document.querySelector(".artist__image-container");
const artistSource = artistImageContainer.querySelector("source");
const artistImage = document.querySelector(".artist__image");

const artistTitle = document.querySelector(".artist__title");
const artistName = document.querySelector(".artist__name");
const artistPortrait = document.querySelector(".artist__portrait");

const contentYear = document.querySelector(".content-box__year");
const description = document.querySelector(".content-box__description");
const source = document.querySelector(".content-box__source");

const navigationTitle = document.querySelector(".navigation__title");
const navigationArtist = document.querySelector(".navigation__artist");

const nextBtn = document.querySelector(".navigation__button--next");
const prevBtn = document.querySelector(".navigation__button--prev");
const progressBar = document.querySelector(".navigation__progress-bar");

const slideshowSection = document.querySelector(".slideshow");

let artistData = null;
let currentIndex = 0;
let firstLoad = true;

/* ================================================================================================= */
// Fetch JSON Data
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
// Initialize Page
const initPage = async () => {
  await fetchArtistData();

  if (!artistData) {
    console.error("No artist data found!");
    return;
  }

  // Extract artwork from URL
  const params = new URLSearchParams(window.location.search);
  const artworkName = params.get("artwork");

  currentIndex = artistData.findIndex(
    (art) => art.name.toLowerCase().replaceAll(" ", "-") === artworkName
  );

  if (currentIndex === -1) currentIndex = 0;

  updateDisplay();
  updateNavButtons(); // ✅ ensure buttons reflect initial position
};

/* ================================================================================================= */
// Update Display
const updateDisplay = () => {
  const art = artistData[currentIndex];
  if (!art) return;

  // 🔹 Skip fade on first load
  if (firstLoad) {
    applyArtData(art);
    slideshowSection.classList.add("show");
    firstLoad = false;
    updateNavButtons();
    return;
  }

  // 🔸 Use fade after initial load
  slideshowSection.classList.remove("show");

  setTimeout(() => {
    applyArtData(art);
    slideshowSection.classList.add("show");
    updateNavButtons(); // update buttons after content changes
  }, 300);
};

/* ================================================================================================= */
// Apply artwork info to DOM
const applyArtData = (art) => {
  // Responsive images
  artistSource.srcset = art.images.hero.large;
  artistImage.src = art.images.hero.small;
  artistImage.alt = art.name;

  // Info and meta
  artistTitle.textContent = art.name;
  artistName.textContent = art.artist.name;
  artistPortrait.src = art.artist.image;
  artistPortrait.alt = art.artist.name;

  description.textContent = art.description;
  contentYear.textContent = art.year;

  // Source link
  source.href = art.source;
  source.textContent = "Go to source";

  // Navigation info
  navigationTitle.textContent = art.name;
  navigationArtist.textContent = art.artist.name;

  updateProgressBar();
};

/* ================================================================================================= */
// Update progress bar
const updateProgressBar = () => {
  const total = artistData.length;
  const progressPercent = ((currentIndex + 1) / total) * 100;
  progressBar.style.width = `${progressPercent}%`;
};

/* ================================================================================================= */
// Update next/prev button states
const updateNavButtons = () => {
  // Disable prev on first item
  if (currentIndex === 0) {
    prevBtn.classList.add("navigation__button--disabled");
  } else {
    prevBtn.classList.remove("navigation__button--disabled");
  }

  // Disable next on last item
  if (currentIndex === artistData.length - 1) {
    nextBtn.classList.add("navigation__button--disabled");
  } else {
    nextBtn.classList.remove("navigation__button--disabled");
  }
};

/* ================================================================================================= */
// Navigation Events
nextBtn.addEventListener("click", () => {
  if (!artistData || currentIndex >= artistData.length - 1) return;
  currentIndex++;
  updateDisplay();
});

prevBtn.addEventListener("click", () => {
  if (!artistData || currentIndex <= 0) return;
  currentIndex--;
  updateDisplay();
});

/* ================================================================================================= */
// Modal (View Image)
const modal = document.querySelector(".modal");
const modalImage = document.querySelector(".modal__image");
const modalSource = document.querySelector(".modal__picture source");
const viewBtn = document.querySelector(".artist__view-button");
const closeBtn = document.querySelector(".modal__close");

viewBtn.addEventListener("click", () => {
  const art = artistData[currentIndex];
  modal.classList.remove("hidden");

  modalSource.srcset = art.images.hero.large;
  modalImage.src = art.images.hero.small;
  modalImage.alt = art.name;
});

closeBtn.addEventListener("click", () => {
  modal.classList.add("hidden");
});

modal.addEventListener("click", (e) => {
  if (e.target === modal) modal.classList.add("hidden");
});

/* ================================================================================================= */
document.addEventListener("DOMContentLoaded", initPage);
