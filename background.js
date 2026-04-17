// Create the right-click menu item
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "sendToMichael",
    title: "Send to מִיכָאֵלAI",
    contexts: ["selection"]
  });
});

// Handle the click event
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "sendToMichael") {
    const selectedText = info.selectionText;
    console.log("מִיכָאֵל received:", selectedText);
    
    // For now, let's just save it to the browser's storage
    chrome.storage.local.set({ lastSnippet: selectedText }, () => {
      console.log("Snippet saved!");
    });
  }
});
