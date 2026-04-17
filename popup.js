document.addEventListener('DOMContentLoaded', () => {
  const display = document.getElementById('response');

  // 1. Clear the badge
  chrome.action.setBadgeText({ text: "" });

  // 2. Ask the background script for the text
  chrome.runtime.sendMessage({ type: "GET_TEXT" }, (response) => {
    if (response && response.text) {
      display.innerHTML = `<p style="color: #ff1b1b;">מִיכָאֵל is consulting Llama...</p>`;
      askLlama(response.text);
    } else {
      display.innerText = "No signal received. Highlight text and try again!";
    }
  });
});

async function askLlama(textSnippet) {
  const display = document.getElementById('response');
  try {
    const response = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'llama3.1:latest', 
        prompt: `Translate to English and summarize in 3 bullets: ${textSnippet}`,
        stream: false
      })
    });
    const result = await response.json();
    display.innerText = result.response;
  } catch (err) {
    display.innerText = "Ollama connection failed.";
  }
}