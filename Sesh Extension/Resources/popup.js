const grayscaleToggle = document.getElementById("grayscaleToggle");
const blockYoutubeToggle = document.getElementById("blockYoutubeToggle");
const blockXToggle = document.getElementById("blockXToggle");

document.addEventListener("DOMContentLoaded", async () => {
  const { isGrayscaleEnabled, isBlockYoutubeEnabled, isBlockXEnabled } =
    await browser.storage.local.get([
      "isGrayscaleEnabled",
      "isBlockYoutubeEnabled",
      "isBlockXEnabled",
    ]);
  grayscaleToggle.checked = isGrayscaleEnabled ?? false;
  blockYoutubeToggle.checked = isBlockYoutubeEnabled ?? false;
  blockXToggle.checked = isBlockXEnabled ?? false;

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

blockXToggle.addEventListener("change", async () => {
  const enabled = blockXToggle.checked;
  await browser.storage.local.set({ isBlockXEnabled: enabled });
  browser.runtime.sendMessage({ action: "toggeBlockX", enable: enabled });
  if (enabled) {
    const tabs = await browser.tabs.query({});
    tabs.forEach((tab) => {
      if (tab.id && tab.url && tab.url.includes("x.com")) {
        browser.tabs.update(tab.id, { url: "https://www.facebook.com" });
      }
    });
  }
});
