(() => {
  let blockYoutubeEnabled = false;

  browser.storage.local
    .get("blockYoutubeEnabled")
    .then(({ blockYoutubeEnabled: storedBlock }) => {
      blockYoutubeEnabled = storedBlock ?? false;
      redirectIfYouTube();
    });

  function redirectIfYouTube() {
    if (!blockYoutubeEnabled) return;
    const host = window.location.hostname;
    if (host === "youtube.com" || host.endsWith(".youtube.com")) {
      window.location.href = "https://www.facebook.com";
    }
  }

  function interceptHistoryMethods() {
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;
    history.pushState = (...args) => {
      originalPushState.apply(history, args);
      redirectIfYouTube();
    };
    history.replaceState = (...args) => {
      originalReplaceState.apply(history, args);
      redirectIfYouTube();
    };
    window.addEventListener("popstate", redirectIfYouTube);
  }

  interceptHistoryMethods();
  redirectIfYouTube();

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
    if (msg.action === "toggleBlockYoutube") {
      blockYoutubeEnabled = msg.enable;
      redirectIfYouTube();
    }
  });
})();
