var MutationObserver =
  window.MutationObserver ||
  window.WebKitMutationObserver ||
  window.MozMutationObserver;

var observer = new MutationObserver(function (mutations) {
  if (document.querySelector("#remark42 iframe")) {
    var iframe = document.querySelector("#remark42 iframe");

    iframe.addEventListener("load", function () {
      var style = document.createElement("style");
      style.id = "custom-remark-styles";
      style.textContent = `
@font-face {
  font-family: "CourierCyr";
  src: url("https://cdn.jsdelivr.net/gh/alchemmist/personal-site@main/site/static/assets/fonts/couriercyrps.woff2")
    format("truetype");
  font-weight: normal;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: "CourierCyr";
  src: url("https://cdn.jsdelivr.net/gh/alchemmist/personal-site@main/site/static/assets/fonts/couriercyrps_bold.woff2")
    format("truetype");
  font-weight: bold;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: "CourierCyr";
  src: url("https://cdn.jsdelivr.net/gh/alchemmist/personal-site@main/site/static/assets/fonts/couriercyrps_inclined.woff2")
    format("truetype");
  font-weight: normal;
  font-style: italic;
  font-display: swap;
}

@font-face {
  font-family: "CourierCyr";
  src: url("https://cdn.jsdelivr.net/gh/alchemmist/personal-site@main/site/static/assets/fonts/couriercyrps_boldinclined.woff2")
    format("truetype");
  font-weight: bold;
  font-style: italic;
  font-display: swap;
}

body {
  font-family: nerdfontssymbols nerd font, "CourierCyr", serif !important;
}
      `;
      iframe.contentDocument.head.appendChild(style);
      observer.disconnect();
    });
  }
});

var targetNode = document.getElementById("remark42");
if (targetNode) observer.observe(targetNode, { childList: true });
