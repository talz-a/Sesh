browser.runtime.onMessage.addListener(async (request) => {
  if (request.action === "toggleBlockX") {
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
                url: "https://talal-a.dev",
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
  if (request.action == "toggleBlockAI") {
    if (request.enabled) {
      await browser.declarativeNetRequest.updateDynamicRules({
        removeRuleIds: [1002, 1003],
        addRules: [
          {
            id: 1002,
            priority: 1,
            action: {
              type: "redirect",
              redirect: {
                url: "https://talal-a.dev",
              },
            },
            condition: {
              urlFilter: "||chatgpt.com/",
              resourceTypes: ["main_frame"],
            },
          },
          {
            id: 1003,
            priority: 1,
            action: {
              type: "redirect",
              redirect: {
                url: "https://talal-a.dev",
              },
            },
            condition: {
              urlFilter: "||grok.com/",
              resourceTypes: ["main_frame"],
            },
          },
        ],
      });
    } else {
      await browser.declarativeNetRequest.updateDynamicRules({
        removeRuleIds: [1002, 1003],
      });
    }
  }
});
