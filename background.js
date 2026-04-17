let currentText = ""; // Global variable in the background script

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "summarizeWithMichael",
    title: "Send to מִיכָאֵלAI",
    contexts: ["selection"]
  });
});

chrome.contextMenus.onClicked.addListener((info) => {
  if (info.menuItemId === "summarizeWithMichael") {
    currentText = info.selectionText; // Store text in memory
    chrome.action.setBadgeText({ text: "ON" });
    chrome.action.setBadgeBackgroundColor({ color: "#ff1b1b" });
  }
});

// Listen for the popup asking "Hey, do you have any text?"
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "GET_TEXT") {
    sendResponse({ text: currentText });
  }
});