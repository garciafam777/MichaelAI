document.addEventListener('DOMContentLoaded', () => {
  const display = document.getElementById('response-text');

  // Request the text from the background
  chrome.runtime.sendMessage({ type: "GET_TEXT" }, (response) => {
    if (response && response.text) {
      display.innerText = "Michael is listening and preparing to speak...";
      processLlamaResponse(response.text); // Fire Llama, then TTS, then Animation
    } else {
      display.innerText = "No signal received. Try again!";
    }
  });
});

async function processLlamaResponse(snippet) {
    // 1. Run Llama (Ollama local fetch as you previously coded)
    const result = await fetchOllama(snippet); // Placeholder for your Llama fetch logic
    
    // 2. Generate Audio (TTS - local fetch as discussed in Option 2)
    const audioUrl = await generateAudio(result.response); // Placeholder for XTTS local fetch
    
    // 3. Fire the Reactive Animation
    if (audioUrl) {
        startTalkingSequence(audioUrl, result.response);
    }
}

// THE "MEAT AND GRITTY" OF THE AUDIO AURA
function startTalkingSequence(audioSourceUrl, textSummary) {
    const avatarVideo = document.getElementById('talking-avatar');
    const aura = document.getElementById('divine-aura');
    const displayText = document.getElementById('response-text');

    // Display Michael and the summary
    avatarVideo.style.display = 'block';
    displayText.innerHTML = `<p style="border-left: 2px solid #ff1b1b; padding-left: 10px;">${textSummary.replace(/\n/g, '<br>')}</p>`;

    // --- SETUP AUDIO ANALYSIS (THE "PULSE" BRAIN) ---
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const audioElement = new Audio(audioSourceUrl);
    const sourceNode = audioContext.createMediaElementSource(audioElement);
    const analyserNode = audioContext.createAnalyser();

    // Configuration
    analyserNode.fftSize = 256; // High frequency analysis
    const bufferLength = analyserNode.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    // Connect the chain (Source -> Analyser -> Speakers)
    sourceNode.connect(analyserNode);
    analyserNode.connect(audioContext.destination);

    // Play the audio
    audioElement.play();

    // --- THE REACTIVE ANIMATION LOOP (Runs ~60fps) ---
    function animateAura() {
        requestAnimationFrame(animateAura);

        // Analyze current sound snapshot
        analyserNode.getByteFrequencyData(dataArray);

        // Calculate average loudness (amplitude)
        let sum = 0;
        for (let i = 0; i < bufferLength; i++) {
            sum += dataArray[i];
        }
        const averageLoudness = sum / bufferLength; // Value from 0 to 255

        // --- MAP LOUDNESS TO AURA STYLING ---
        // We set boundaries (Llama 3.1 speaks loudly at ~150 loudness, softly at ~50)
        
        // 1. Scale/Expansion (From 80px when silent up to 220px when shouting)
        const newSize = 80 + (averageLoudness * 0.55); // Multiplier makes it dramatic

        // 2. Opacity/Intensity (Dims to 0.2, brightens to 0.9)
        const newOpacity = 0.2 + (averageLoudness / 300); // 300 map factor

        // 3. Shadow/Bloom (Glow expands with loudness)
        const glowRadius = averageLoudness / 8; // Bloom depth

        // --- APPLY THE CHANGES INSTANTLY (Ground Truth) ---
        aura.style.width = `${newSize}px`;
        aura.style.height = `${newSize}px`;
        aura.style.opacity = newOpacity.toString();
        aura.style.boxShadow = `0 0 ${glowRadius}px #ffd700, 0 0 ${glowRadius * 1.5}px #ff8c00`; // Multi-color bloom
    }

    // Start the animation loop
    animateAura();

    // Clean up when finished talking
    audioElement.onended = () => {
        avatarVideo.pause(); // Reset lip sync
        avatarVideo.style.display = 'none'; // Optional: hide Michael when silent
        aura.style.opacity = '0.2'; // Reset aura to default dim state
        displayText.innerHTML = `<p style="color: #444;">מִיכָאֵל stands ready.</p>`;
    };
}