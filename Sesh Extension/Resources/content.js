(async () => {
  function ensureGrayScaleTagIsCreated() {
    let style = document.getElementById("grayscaleStyle");
    if (!style) {
      style = document.createElement("style");
      style.id = "grayscaleStyle";
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

  function redirectIfYouTube(isEnabled) {
    if (!isEnabled) return;
    const host = window.location.hostname;
    if (host === "youtube.com" || host.endsWith(".youtube.com")) {
      window.location.href = "https://www.facebook.com";
    }
  }

  const {
    isGrayscaleEnabled = false,
    isBlockYoutubeEnabled: storedBlock = false,
  } = await browser.storage.local.get([
    "isGrayscaleEnabled",
    "isBlockYoutubeEnabled",
  ]);
  let isBlockYoutubeEnabled = storedBlock;

  ensureGrayScaleTagIsCreated();
  document.documentElement.classList.toggle("grayscale", isGrayscaleEnabled);
  redirectIfYouTube(isBlockYoutubeEnabled);

  browser.runtime.onMessage.addListener((msg) => {
    if (msg.action === "toggleGrayscale") {
      ensureGrayScaleTagIsCreated();
      document.documentElement.classList.toggle("grayscale", msg.enable);
    }
    if (msg.action === "toggleBlockYoutube") {
      isBlockYoutubeEnabled = msg.enable;
      redirectIfYouTube(isBlockYoutubeEnabled);
    }
  });
})();
