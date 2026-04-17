// 1. Setup on Install
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "summarizeWithMichael",
    title: "Send to מִיכָאֵלAI",
    contexts: ["selection"]
  });
});

// 2. The Listener (MUST BE OUTSIDE THE ABOVE FUNCTION)
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "summarizeWithMichael") {
    // Save the text to storage
    chrome.storage.local.set({ selectedText: info.selectionText }, () => {
      console.log("Text saved for Michael.");
      // Visual confirmation: Add a badge to the icon
      chrome.action.setBadgeText({ text: "ON" });
      chrome.action.setBadgeBackgroundColor({ color: "#ff1b1b" });
    });
  }
});