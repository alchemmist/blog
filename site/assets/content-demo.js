document.addEventListener("DOMContentLoaded", () => {
  if (typeof mediumZoom !== "undefined") {
    mediumZoom(".demo-article img", {
      background: "rgba(0, 0, 0, 0.7)",
      margin: 24,
      scrollOffset: 50,
    });
  }

  const contents = document.querySelector(".demo-sidebar details");
  const compact = window.matchMedia("(max-width: 760px)");
  const updateContents = () => {
    contents.open = !compact.matches;
  };
  updateContents();
  compact.addEventListener("change", updateContents);

  const links = [...document.querySelectorAll(".demo-sidebar nav a")];
  const headings = [...document.querySelectorAll(".demo-article > h2")];
  let scheduled = false;

  const updateCurrent = () => {
    const current = headings.filter((heading) => heading.getBoundingClientRect().top <= 100).at(-1);
    for (const link of links) {
      if (current && decodeURIComponent(link.hash.slice(1)) === current.id) {
        link.setAttribute("aria-current", "location");
      } else {
        link.removeAttribute("aria-current");
      }
    }
    scheduled = false;
  };

  window.addEventListener("scroll", () => {
    if (!scheduled) {
      scheduled = true;
      requestAnimationFrame(updateCurrent);
    }
  }, { passive: true });
  updateCurrent();

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    document.querySelectorAll(".demo-article video").forEach((video) => {
      video.autoplay = false;
      video.pause();
    });
  }
});
