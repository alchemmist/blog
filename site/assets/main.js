let currentAngle = parseInt(localStorage.getItem("burgerAngle")) || 0;

const style = document.createElement("style");
style.textContent = `
  header .burger img {
    transform: rotate(${currentAngle}deg);
  }
`;
document.head.appendChild(style);

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
      locale: "en",
      element: "#search-hidden",
      showImages: false,
      autoFocus: true,
      translations: {
        placeholder: "Search",
        clear_search: "Clear",
        load_more: "Load more results",
        search_label: "Search this site",
        filters_label: "Filters",
        zero_results: "No results for [SEARCH_TERM]",
        many_results: "[COUNT] results for [SEARCH_TERM]",
        one_result: "[COUNT] result for [SEARCH_TERM]",
        alt_search:
          "No results for [SEARCH_TERM]. Showing results for [DIFFERENT_TERM] instead",
        search_suggestion:
          "No results for [SEARCH_TERM]. Try one of the following searches:",
        searching: "Searching for [SEARCH_TERM]...",
      },
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

document.addEventListener("keydown", (e) => {
  // Игнорируем, если фокус в input или textarea
  if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;

  // Игнорируем, если открыт поиск Pagefind (body содержит класс modal-open)
  if (document.body.classList.contains("modal-open")) return;

  const step = 100; // шаг для j/k

  function smoothScroll(y) {
    window.scrollTo({
      top: y,
      behavior: "smooth",
    });
  }

  switch (e.key) {
    case "j":
      smoothScroll(window.scrollY + step);
      e.preventDefault();
      break;
    case "k":
      smoothScroll(window.scrollY - step);
      e.preventDefault();
      break;
  }
});

document.addEventListener("DOMContentLoaded", function () {
  const githubIcon = document.querySelector(".subscribe-banner.github span");
  const catPopup = document.getElementById("cat-popup");

  githubIcon.addEventListener("click", function (e) {
    e.preventDefault();
    catPopup.style.display = "block"; // сначала делаем блок видимым
    setTimeout(() => catPopup.classList.add("show"), 10); // плавное выдвижение
  });

  catPopup.addEventListener("click", function () {
    window.location.href = "https://cats.alchemmist.xyz?utm_souce=easter-egg"; // твой URL
  });

  // Закрытие при клике вне кота
  document.addEventListener("click", function (e) {
    if (!catPopup.contains(e.target) && !githubIcon.contains(e.target)) {
      catPopup.classList.remove("show");
      setTimeout(() => (catPopup.style.display = "none"), 500); // скрываем после анимации
    }
  });
});

const shortcuts = [
  { key: "h", description: "Go to home page", url: "/" },
  { key: "?", description: "Open help" },
  { key: "p", description: "Go to poetry (only Russian)", url: "/ru/poetry" },
  { key: "c", description: "Go to CVs", url: "/cv" },
  { key: "a", description: "Go to articles", url: "/articles" },
  { key: "e", description: "Go to essays", url: "/essays" },
  { key: "u", description: "Go to blog updates", url: "/updates" },
  { key: "t", description: "Go to teach section", url: "/ru/teach" },
  { key: "b", description: "Go to book shelf", url: "/books" },
  { key: "j", description: "Scroll down" },
  { key: "k", description: "Scroll up" },
  { key: "Ctrl+k", description: "Search" },
];

// только для переходов по URL
const shortcutsMap = Object.fromEntries(
  shortcuts.filter((s) => s.url).map((s) => [s.key, s.url]),
);

const overlay = document.getElementById("shortcut-overlay");
const modal = document.getElementById("shortcut-modal");
const shortcutList = document.getElementById("shortcut-list");
const closeBtn = modal.querySelector(".close-btn");

function openModal() {
  shortcutList.innerHTML = "";
  shortcuts.forEach((s) => {
    const li = document.createElement("li");
    li.innerHTML = `<code>${s.key}</code> → ${s.description}`;
    shortcutList.appendChild(li);
  });

  overlay.style.display = "block";
  modal.style.display = "block";
}

function closeModal() {
  overlay.style.display = "none";
  modal.style.display = "none";
}

closeBtn.addEventListener("click", closeModal);
overlay.addEventListener("click", closeModal);

document.addEventListener("keydown", function (event) {
  const tag = event.target.tagName.toLowerCase();
  if (tag === "input" || tag === "textarea") return;

  if (event.key === "?") {
    openModal();
    return;
  }

  if (event.key === "Escape") {
    closeModal();
    return;
  }

  if (shortcutsMap[event.key]) {
    const url = new URL(shortcutsMap[event.key], window.location.origin);
    window.location.href = url;
  }
});

let links = [];

const updateLinks = () => {
  links = Array.from(document.querySelectorAll(".pagefind-ui__result-link"));
};

const observer = new MutationObserver(updateLinks);
const results = document.querySelector(".pagefind-ui__results");
if (results) observer.observe(results, { childList: true, subtree: true });

updateLinks();

document.addEventListener("keydown", (e) => {
  const modal = document.querySelector(".search-modal-content");
  if (!modal || modal.style.display === "none") return;

  const links = Array.from(
    document.querySelectorAll(".pagefind-ui__result-link"),
  );
  if (links.length === 0) return;

  const activeIndex = links.findIndex(
    (link) => link === document.activeElement,
  );

  // Alt + j → вниз
  if (e.altKey && e.key.toLowerCase() === "j") {
    e.preventDefault();
    const next = (activeIndex + 1) % links.length;
    links[next].focus();
  }

  // Alt + k → вверх
  if (e.altKey && e.key.toLowerCase() === "k") {
    e.preventDefault();
    const prev = (activeIndex - 1 + links.length) % links.length;
    links[prev].focus();
  }
});
