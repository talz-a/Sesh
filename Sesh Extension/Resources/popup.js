const grayscaleToggle = document.getElementById("grayscaleToggle");
const blockYoutubeToggle = document.getElementById("blockYoutubeToggle");

document.addEventListener("DOMContentLoaded", async () => {
  const { isGrayscaleEnabled, isBlockYoutubeEnabled } =
    await browser.storage.local.get([
      "isGrayscaleEnabled",
      "isBlockYoutubeEnabled",
    ]);
  grayscaleToggle.checked = isGrayscaleEnabled ?? false;
  blockYoutubeToggle.checked = isBlockYoutubeEnabled ?? false;

  const [tab] = await browser.tabs.query({ active: true, currentWindow: true });
  if (tab?.id) {
    browser.tabs.sendMessage(tab.id, {
      action: "toggleGrayscale",
      enable: grayscaleToggle.checked,
    });
    browser.tabs.sendMessage(tab.id, {
      action: "toggleBlockYoutube",
      enable: blockYoutubeToggle.checked,
    });
  }
});

grayscaleToggle.addEventListener("change", async () => {
  const enabled = grayscaleToggle.checked;
  await browser.storage.local.set({ isGrayscaleEnabled: enabled });
  const tabs = await browser.tabs.query({ url: "<all_urls>" });
  tabs.forEach((tab) => {
    if (tab.id) {
      browser.tabs.sendMessage(tab.id, {
        action: "toggleGrayscale",
        enable: enabled,
      });
    }
  });
});

blockYoutubeToggle.addEventListener("change", async () => {
  const enabled = blockYoutubeToggle.checked;
  await browser.storage.local.set({ isBlockYoutubeEnabled: enabled });
  const youtubeTabs = await browser.tabs.query({ url: "*://*.youtube.com/*" });
  youtubeTabs.forEach((tab) => {
    if (tab.id) {
      browser.tabs.sendMessage(tab.id, {
        action: "toggleBlockYoutube",
        enable: enabled,
      });
    }
  });
});
