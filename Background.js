// This listens for when the extension is first installed
chrome.runtime.onInstalled.addListener(() => {
  console.log("MichaelAI by R&Y Productions is active.");
});

// Example: Listen for a keyboard shortcut or a specific command
chrome.commands.onCommand.addListener((command) => {
  console.log(`Command received: ${command}`);
});
