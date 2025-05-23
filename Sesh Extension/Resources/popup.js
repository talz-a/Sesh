const toggle = document.getElementById("toggle");

document.addEventListener("DOMContentLoaded", async () => {
  const { grayscaleEnabled } =
    await browser.storage.local.get("grayscaleEnabled");
  toggle.checked = grayscaleEnabled ?? false;
  browser.tabs.query({ active: true, currentWindow: true }).then(([tab]) => {
    browser.tabs.sendMessage(tab.id, {
      action: "toggleGrayscale",
      enable: toggle.checked,
    });
  });
});

toggle.addEventListener("change", () => {
  const enabled = toggle.checked;
  browser.storage.local.set({ grayscaleEnabled: enabled }, () => {
    browser.tabs.query({}, (tabs) => {
      for (const tab of tabs) {
        if (tab.id) {
          browser.tabs.sendMessage(tab.id, {
            action: "toggleGrayscale",
            enable: enabled,
          });
        }
      }
    });
  });
});

const blockYoutube = document.getElementById("block-youtube");

blockYoutube.addEventListener("change", () => {
  browser.tabs.query({}, (tabs) => {
    for (const tab of tabs) {
      if (tab.id) {
        browser.tabs.sendMessage(tab.id, {
          action: "blockYoutube",
          enable: blockYoutube.checked,
        });
      }
    }
  });
});
