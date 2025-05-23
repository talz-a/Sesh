function ensureGrayScaleTagIsCreated() {
  let style = document.getElementById("grayscale-style");
  if (!style) {
    style = document.createElement("style");
    style.id = "grayscale-style";
    style.textContent = `
      html {
        transition: filter 0.3s ease !important;
      }
      html.grayscale {
        filter: grayscale(100%) !important;
      }
      html:not(.grayscale) {
        filter: none !important;
      }
    `;
    document.head.appendChild(style);
  }
}

browser.storage.local.get("grayscaleEnabled").then(({ grayscaleEnabled }) => {
  ensureGrayScaleTagIsCreated();
  document.documentElement.classList.toggle("grayscale", grayscaleEnabled);
});

browser.runtime.onMessage.addListener((msg) => {
  if (msg.action === "toggleGrayscale") {
    ensureGrayScaleTagIsCreated();
    document.documentElement.classList.toggle("grayscale", msg.enable);
  }
});
