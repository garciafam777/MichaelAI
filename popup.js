async function askLlama(textSnippet) {
    const display = document.getElementById('response');
    try {
        const response = await fetch('http://localhost:11434/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: 'llama3.1:latest', // <--- Matches your 'ollama list'
                prompt: `You are מִיכָאֵלAI. 
                1. Identify the language. 
                2. Translate to English if needed. 
                3. Summarize in 3 bullet points.
                Text: ${textSnippet}`,
                stream: false
            })
        });

        if (!response.ok) {
            throw new Error(`Ollama error: ${response.status}`);
        }

        const result = await response.json();
        
        // Success! Displaying the result in the R&Y style
        display.innerHTML = `
            <div style="border-left: 3px solid #ff1b1b; padding-left: 10px; white-space: pre-wrap;">
                ${result.response}
            </div>
            <p style="font-size: 0.7em; color: #444; margin-top: 15px; text-align: right;">מִיכָאֵל v1.2</p>
        `;
    } catch (err) {
        display.innerHTML = `
            <p style="color: yellow;">⚠️ Signal Lost</p>
            <p style="font-size: 0.8em;">1. Is Ollama running?<br>2. Check OLLAMA_ORIGINS env variable.</p>
        `;
        console.error("MichaelAI Error:", err);
    }
}