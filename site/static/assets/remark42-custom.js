(() => {
  // Используем MutationObserver, чтобы дождаться появления iframe
  const MutationObserver =
    window.MutationObserver ||
    window.WebKitMutationObserver ||
    window.MozMutationObserver;

  const observer = new MutationObserver(() => {
    const iframe = document.querySelector("#remark42 iframe");
    if (iframe) {
      observer.disconnect();

      iframe.addEventListener("load", () => {
        // Ждём, пока head станет доступным
        const check = setInterval(() => {
          const doc = iframe.contentDocument || iframe.contentWindow.document;
          if (doc && doc.head) {
            clearInterval(check);

            const link = doc.createElement("link");
            link.rel = "stylesheet";
            link.href = "https://remark42.alchemmist.xyz/web/custom.css";
            doc.head.appendChild(link);

            console.log("✅ custom.css успешно добавлен в remark42 iframe");
          }
        }, 100);
      });
    }
  });

  const targetNode = document.getElementById("remark42");
  if (targetNode) {
    observer.observe(targetNode, { childList: true, subtree: true });
  } else {
    console.warn("⚠️ #remark42 не найден на странице");
  }
})();

