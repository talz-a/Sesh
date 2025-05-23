function ensureGrayScaleTagIsCreated() {
  let style = document.getElementById("grayscale-style");
  if (!style) {
    style = document.createElement("style");
    style.id = "grayscale-style";
    style.textContent = `
      html {
        transition: filter 0.3s ease;
        filter: none !important;
      }`;
    document.head.appendChild(style);
  }
}

browser.storage.local.get("grayscaleEnabled").then(({ grayscaleEnabled }) => {
  ensureGrayScaleTagIsCreated();
  const style = document.getElementById("grayscale-style");
  style.textContent = `
    html {
      transition: filter 0.3s ease;
      filter: ${grayscaleEnabled ? "grayscale(100%)" : "none"} !important;
    }
  `;
});

browser.runtime.onMessage.addListener((msg) => {
  if (msg.action === "toggleGrayscale") {
    ensureGrayScaleTagIsCreated();
    const style = document.getElementById("grayscale-style");
    style.textContent = `
      html {
        transition: filter 0.3s ease;
        filter: ${msg.enable ? "grayscale(100%)" : "none"} !important;
      }
    `;
  }
});
