const grayscaleToggle = document.getElementById("grayscale-toggle");
const blockYoutubeToggle = document.getElementById("block-youtube");

document.addEventListener("DOMContentLoaded", async () => {
  const { grayscaleEnabled, blockYoutubeEnabled } =
    await browser.storage.local.get([
      "grayscaleEnabled",
      "blockYoutubeEnabled",
    ]);
  grayscaleToggle.checked = grayscaleEnabled ?? false;
  blockYoutubeToggle.checked = blockYoutubeEnabled ?? false;

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
  await browser.storage.local.set({ grayscaleEnabled: enabled });
  const tabs = await browser.tabs.query({ url: "<all_urls>" });
  for (const tab of tabs) {
    if (tab.id) {
      browser.tabs.sendMessage(tab.id, {
        action: "toggleGrayscale",
        enable: enabled,
      });
    }
  }
});

blockYoutubeToggle.addEventListener("change", async () => {
  const enabled = blockYoutubeToggle.checked;
  await browser.storage.local.set({ blockYoutubeEnabled: enabled });
  const tabs = await browser.tabs.query({ url: "<all_urls>" });
  for (const tab of tabs) {
    if (tab.id) {
      browser.tabs.sendMessage(tab.id, {
        action: "toggleBlockYoutube",
        enable: enabled,
      });
    }
  }
});
