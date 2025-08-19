// Google Analytics
window.dataLayer = window.dataLayer || [];
function gtag() {
  dataLayer.push(arguments);
}
gtag("js", new Date());
gtag("config", "G-11CS0ECH9L");

// Burger menu initial style
const currentAngle = parseInt(localStorage.getItem("burgerAngle")) || 0;
document.write(`
  <style>
    header .burger img {
      transform: rotate(${currentAngle}deg);
    }
  </style>
`);

// DOMContentLoaded event handler
document.addEventListener("DOMContentLoaded", function () {
  // Image width from alt attribute
  document.querySelectorAll("img[alt^='|']").forEach(function (img) {
    const width = img.alt.match(/^\|(\d+)/)?.[1];
    if (width) {
      img.style.width = `${width / 20}` + "rem";
      img.alt = "";
    }
  });

  // Burger menu functionality
  const header = document.querySelector("header");
  if (header) {
    const burger = header.querySelector(".burger");
    const overlay = header.querySelector(".overlay");
    const img = burger.querySelector("img");

    let currentAngle = parseInt(localStorage.getItem("burgerAngle")) || 0;
    let menuOpen = false;

    img.style.transform = `rotate(${currentAngle}deg)`;
    if (menuOpen) {
      header.classList.add("is-open");
    }

    function toggleMenu() {
      let delta = menuOpen ? -150 : 180;
      currentAngle += delta;

      img.style.transition = "transform 0.5s ease-in-out";
      img.style.transform = `rotate(${currentAngle}deg)`;

      menuOpen = !menuOpen;
      header.classList.toggle("is-open");

      localStorage.setItem("burgerAngle", currentAngle);
    }

    burger.addEventListener("click", toggleMenu);
    overlay.addEventListener("click", toggleMenu);
  }

  // Logo rotation and Moss secret
  const headerLogo = document.querySelector(".header-logo");
  if (headerLogo) {
    let logoAngle = 0;
    let clickTimes = [];

    headerLogo.addEventListener("click", () => {
      logoAngle += 390;
      headerLogo.style.transition = "transform 0.5s ease-in-out";
      headerLogo.style.transform = `rotate(${logoAngle}deg)`;

      const now = Date.now();
      clickTimes.push(now);

      if (
        clickTimes[clickTimes.length - 1] - clickTimes[clickTimes.length - 2] >=
        2000
      ) {
        clickTimes = [];
      }

      if (clickTimes.length >= 12) {
        clickTimes = [];
        showMossLoader();
      }
    });

    function showMossLoader() {
      const loader = document.getElementById("moss-loader");
      if (!loader) return;

      loader.style.display = "block";

      const interval = setInterval(() => {
        const span = document.createElement("span");
        span.textContent = "moss";
        span.style.position = "absolute";
        span.style.left = Math.random() * 100 + "%";
        span.style.top = Math.random() * 100 + "%";
        span.style.color = "#fff";
        span.style.userSelect = "none";
        span.style.fontSize = 10 + Math.random() * 20 + "px";
        loader.appendChild(span);
      }, 10);

      setTimeout(() => {
        clearInterval(interval);
        window.location.href = "/moss/logo-symbolism";
      }, 3000);
    }
  }

  // Mermaid initialization
  if (typeof mermaid !== "undefined") {
    mermaid.initialize({ startOnLoad: true });
  }

  // Medium zoom initialization
  if (typeof mediumZoom !== "undefined") {
    let marginValue = window.innerWidth < 868 ? 25 : 50;

    const zoom = mediumZoom("img", {
      background: "rgba(0, 0, 0, 0.7)",
      margin: marginValue,
      scrollOffset: 50,
      animationDuration: 300,
    });

    const noZoomImages = document.querySelectorAll("img.no-zoom");
    noZoomImages.forEach((img) => zoom.detach(img));

    window.addEventListener("resize", () => {
      let newMargin = window.innerWidth < 868 ? 25 : 50;
      zoom.update({ margin: newMargin });
    });
  }

  // Pagefind initialization for non-search pages
  if (
    window.location.pathname !== "/search" &&
    typeof PagefindUI !== "undefined"
  ) {
    new PagefindUI({
      languages: ["ru", "en"],
      element: "#search-hidden",
      showImages: false,
    });

    const searchModal = document.getElementById("search-modal");
    const closeButton = document.querySelector(".search-close-button");

    function openSearch() {
      if (searchModal) {
        searchModal.style.display = "flex";
        document.body.classList.add("modal-open");
        setTimeout(() => {
          const searchInput = document.querySelector(
            ".pagefind-ui__search-input",
          );
          if (searchInput) searchInput.focus();
        }, 100);
      }
    }

    function closeSearch() {
      if (searchModal) {
        searchModal.style.display = "none";
        document.body.classList.remove("modal-open");
      }
    }

    document.addEventListener("keydown", (e) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === "k" || e.key === "л")) {
        e.preventDefault();
        openSearch();
      }
      if (e.key === "Escape") closeSearch();
    });

    if (closeButton) {
      closeButton.addEventListener("click", closeSearch);
    }

    if (searchModal) {
      searchModal.addEventListener("click", (e) => {
        if (e.target === searchModal) closeSearch();
      });
    }
  }
});
