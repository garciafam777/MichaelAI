document.addEventListener('DOMContentLoaded', async () => {
  const display = document.getElementById('response');
  const data = await chrome.storage.local.get('selectedText');

  if (data.selectedText) {
    display.innerHTML = `<p style="color: #ff1b1b;">מִיכָאֵל is consulting Llama...</p>`;
    askLlama(data.selectedText);
  } else {
    display.innerText = "Highlight text and right-click to send to Michael.";
  }
});

async function askLlama(text) {
  const display = document.getElementById('response');

  try {
    const response = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'llama3.1', // Ensure you have this model pulled
        prompt: `System: You are מִיכָאֵלAI. Identify the language. If not English, translate to English. Summarize in 3 bullet points.
        User Text: ${text}`,
        stream: false
      })
    });

    const result = await response.json();
    display.innerText = result.response;
  } catch (err) {
    display.innerHTML = `<p style="color: yellow;">Error: Is Ollama running? Did you set OLLAMA_ORIGINS?</p>`;
  }
}