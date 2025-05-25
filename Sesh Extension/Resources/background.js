browser.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  if (request.action === "toggeBlockX") {
    if (request.enable) {
      await browser.declarativeNetRequest.updateDynamicRules({
        removeRuleIds: [1001],
        addRules: [
          {
            id: 1001,
            priority: 1,
            action: {
              type: "redirect",
              redirect: {
                url: "https://www.facebook.com",
              },
            },
            condition: {
              urlFilter: "||x.com/",
              resourceTypes: ["main_frame"],
            },
          },
        ],
      });
    } else {
      await browser.declarativeNetRequest.updateDynamicRules({
        removeRuleIds: [1001],
      });
    }
  }
});
