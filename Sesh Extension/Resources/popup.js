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

toggle.addEventListener("change", async () => {
  await browser.storage.local.set({ grayscaleEnabled: toggle.checked });
  browser.tabs.query({ active: true, currentWindow: true }).then(([tab]) => {
    browser.tabs.sendMessage(tab.id, {
      action: "toggleGrayscale",
      enable: toggle.checked,
    });
  });
});
