document.addEventListener("DOMContentLoaded", () => {
  const hiddens = document.querySelectorAll(".hidden");

  function updatePos(x, y) {
    hiddens.forEach((p) => {
      p.style.setProperty("--posX", `${x - 200}px`);
      p.style.setProperty("--posY", `${y - 200}px`);
    });
  }

  // Для ПК
  document.addEventListener("mousemove", (e) => {
    updatePos(e.clientX, e.clientY);
  });

  // Для мобильных устройств
  document.addEventListener(
    "touchmove",
    (e) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        updatePos(touch.clientX, touch.clientY);
      }
    },
    { passive: true },
  );
});
