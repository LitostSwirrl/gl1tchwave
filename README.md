# GL1TCHWAVE_

![GL1TCHWAVE Banner](https://img.shields.io/badge/GL1TCHWAVE-Visual%20Synthesizer-00ff41?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJMMTMuMDkgOC4yNkwyMCA5TDEzLjA5IDE1Ljc0TDEyIDIyTDEwLjkxIDE1Ljc0TDQgOUwxMC45MSA4LjI2TDEyIDJaIiBmaWxsPSIjMDBGRjQxIi8+Cjwvc3ZnPgo=)

A **real-time visual synthesizer** inspired by [Hydra](https://github.com/hydra-synth/hydra), designed for artists of all skill levels. Create stunning generative art without any coding knowledge!

## 🚀 **[Try GL1TCHWAVE Live →](https://yourusername.github.io/gl1tchwave/simple.html)**

*Replace "yourusername" with your actual GitHub username*

---

## ✨ **Features**

🎨 **No Coding Required** - Visual presets and intuitive sliders  
🎵 **Audio Reactive** - Responds to microphone input and music  
📹 **Webcam Input** - Use your camera as a visual source  
🌈 **Real-time Control** - Live parameter adjustment with instant feedback  
📱 **Cross-Platform** - Works on desktop, mobile, and tablets  
🎭 **Multiple Presets** - Oscillators, noise fields, fractals, and more  
🔄 **Randomization** - Surprise yourself with random combinations  
📺 **Fullscreen Mode** - Immersive visual experience  
⚡ **WebGL Powered** - High-performance graphics rendering

---

## 🎮 **How to Use**

### **For Visual Artists (No Code):**

1. **🌐 Open the App** - Click the live link above
2. **▶️ Start Creating** - Click "START CREATING_" to begin
3. **🎨 Choose a Preset** - Click any visual preset button:
   - **OSCILLATOR** - Wave patterns and geometric designs
   - **NOISE FIELD** - Organic, flowing textures
   - **WEBCAM** - Live camera input effects
   - **AUDIO REACTIVE** - Music visualization
   - **KALEIDOSCOPE** - Symmetrical patterns
   - **FRACTAL** - Complex mathematical art

4. **🎛️ Adjust Controls** - Move sliders for real-time changes:
   - **FREQUENCY** - Pattern density (1-100)
   - **SPEED** - Animation timing (0-2)
   - **INTENSITY** - Brightness/contrast (0-2)
   - **SCALE** - Pattern size (0.1-5)

5. **🎲 Experiment** - Try these features:
   - Click **RANDOMIZE** for surprises
   - Hit **FULLSCREEN** for immersion
   - Click the **canvas** to pause/play
   - Enable **AUDIO REACTIVE** and play music!

### **For Developers:**

GL1TCHWAVE uses modern web technologies:
- **WebGL** via [Regl](https://github.com/regl-project/regl) for high-performance rendering
- **Web Audio API** for microphone input and FFT analysis
- **MediaDevices API** for webcam access
- **Vanilla JavaScript** (no frameworks) for maximum compatibility

---

## 🎵 **Audio Features**

- **🎤 Microphone Input** - Real-time audio analysis
- **🎶 Music Visualization** - Play Spotify/YouTube and watch the visuals dance
- **📊 FFT Analysis** - Frequency-based visual modulation
- **🔊 No Audio Setup** - Works with any sound playing on your device

---

## 📱 **Device Compatibility**

| Device | Browser | Support |
|--------|---------|---------|
| 💻 Desktop | Chrome, Firefox, Safari, Edge | ✅ Full |
| 📱 Mobile | Chrome, Safari | ✅ Full |
| 📟 Tablet | All modern browsers | ✅ Full |

**Requirements:**
- Modern browser with WebGL support
- Microphone access (for audio reactive features)
- Camera access (for webcam features)

---

## 🛠️ **Local Development**

Want to modify or extend GL1TCHWAVE?

### **Quick Start:**

```bash
# Clone the repository
git clone https://github.com/yourusername/gl1tchwave.git
cd gl1tchwave

# Start local server
python3 -m http.server 8000

# Open browser
open http://localhost:8000/simple.html
```

### **File Structure:**

```
gl1tchwave/
├── simple.html      # Main application
├── simple.js        # Core WebGL logic
├── style.css        # CRT/neon aesthetic
└── README.md        # This file
```

### **Adding New Presets:**

1. **Define preset parameters** in `simple.js`:
   ```javascript
   mypreset: { frequency: 25, speed: 0.15, intensity: 1.2, scale: 0.8 }
   ```

2. **Add preset button** in `simple.html`:
   ```html
   <button class="preset-btn" data-preset="mypreset">MY PRESET</button>
   ```

3. **Create custom shader** (optional) for unique visuals

---

## 🎨 **Visual Examples**

| Preset | Description | Perfect For |
|--------|-------------|-------------|
| 🌊 **Oscillator** | Clean geometric waves | Meditation, focus |
| 🌫️ **Noise Field** | Organic flowing textures | Relaxation, ambiance |
| 📷 **Webcam** | Live video effects | Performances, streams |
| 🎵 **Audio Reactive** | Music visualization | Parties, concerts |
| 🔺 **Kaleidoscope** | Symmetrical patterns | Psychedelic experiences |
| 🌀 **Fractal** | Mathematical complexity | Art installations |

---

## 🤝 **Contributing**

Love GL1TCHWAVE? Here's how you can help:

- 🐛 **Report bugs** via GitHub Issues
- 💡 **Suggest features** or new presets
- 🎨 **Share your creations** on social media with `#GL1TCHWAVE`
- ⭐ **Star the repository** to support the project
- 🔄 **Fork and improve** - Pull requests welcome!

---

## 📜 **License**

This project is open source and available under the [MIT License](LICENSE).

---

## 🙏 **Acknowledgments**

- **[Hydra](https://github.com/hydra-synth/hydra)** - Original inspiration by Olivia Jack
- **[Regl](https://github.com/regl-project/regl)** - Functional WebGL
- **[Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)** - Audio analysis capabilities

---

## 🚀 **Get Started Now**

**→ [Launch GL1TCHWAVE](https://yourusername.github.io/gl1tchwave/simple.html) ←**

*Create stunning visuals in seconds, no coding required!*

---

<div align="center">

**Made with 💚 for visual artists everywhere**

[![GitHub stars](https://img.shields.io/github/stars/yourusername/gl1tchwave?style=social)](https://github.com/yourusername/gl1tchwave/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/yourusername/gl1tchwave?style=social)](https://github.com/yourusername/gl1tchwave/network)

</div>
