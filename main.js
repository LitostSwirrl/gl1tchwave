// GL1TCHWAVE - Visual Synthesizer for Non-Coders
import { EditorView, basicSetup } from "https://cdn.skypack.dev/@codemirror/view";
import { javascript } from "https://cdn.skypack.dev/@codemirror/lang-javascript";
import { oneDark } from "https://cdn.skypack.dev/@codemirror/theme-one-dark";

class GL1TCHWAVE {
    constructor() {
        this.canvas = null;
        this.regl = null;
        this.editor = null;
        this.time = 0;
        this.animationId = null;
        this.width = 0;
        this.height = 0;
        this.isPlaying = true;
        
        // Live parameters controlled by sliders
        this.params = {
            frequency: 20,
            speed: 0.1,
            intensity: 1.0,
            scale: 1.0
        };
        
        // Current preset
        this.currentPreset = 'oscillator';
        
        // Audio context
        this.audioContext = null;
        this.analyser = null;
        this.fftData = null;
        this.audioInitialized = false;
        
        // Source buffers
        this.sources = {
            s0: { name: 's0', initialized: false, video: null, texture: null },
            s1: { name: 's1', initialized: false, video: null, texture: null },
            s2: { name: 's2', initialized: false, video: null, texture: null },
            s3: { name: 's3', initialized: false, video: null, texture: null }
        };
        
        this.init();
    }
    
    init() {
        this.setupCanvas();
        this.setupControls();
        this.setupEditor();
        this.setupAudio();
        this.createShaders();
        this.startRenderLoop();
        this.loadPreset('oscillator');
        
        console.log('GL1TCHWAVE initialized for visual artists_');
    }
    
    setupCanvas() {
        this.canvas = document.getElementById('gl-canvas');
        this.regl = createREGL({
            canvas: this.canvas,
            extensions: ['OES_texture_float']
        });
        
        this.updateCanvasSize();
        window.addEventListener('resize', () => this.updateCanvasSize());
        
        // Add click to toggle play/pause
        this.canvas.addEventListener('click', () => {
            this.isPlaying = !this.isPlaying;
            document.getElementById('status-bar').textContent = 
                this.isPlaying ? 'STATUS: PLAYING_' : 'STATUS: PAUSED_';
        });
    }
    
    updateCanvasSize() {
        const rect = this.canvas.getBoundingClientRect();
        this.width = rect.width;
        this.height = rect.height;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
    }
    
    setupControls() {
        // Preset buttons
        document.querySelectorAll('.preset-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const preset = e.target.dataset.preset;
                this.loadPreset(preset);
                
                // Update active state
                document.querySelectorAll('.preset-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
            });
        });
        
        // Parameter sliders
        const sliders = ['freq', 'speed', 'intensity', 'scale'];
        sliders.forEach(param => {
            const slider = document.getElementById(`${param}-slider`);
            const value = document.getElementById(`${param}-value`);
            
            slider.addEventListener('input', (e) => {
                const val = parseFloat(e.target.value);
                this.params[param === 'freq' ? 'frequency' : param] = val;
                value.textContent = val.toFixed(2);
            });
        });
        
        // Action buttons
        document.getElementById('randomize-btn').addEventListener('click', () => {
            this.randomizeParameters();
        });
        
        document.getElementById('fullscreen-btn').addEventListener('click', () => {
            this.toggleFullscreen();
        });
        
        document.getElementById('toggle-code-btn').addEventListener('click', () => {
            this.toggleCodeEditor();
        });
        
        // Remove old buttons if they exist
        const runBtn = document.getElementById('run-btn');
        const shareBtn = document.getElementById('share-btn');
        if (runBtn) runBtn.style.display = 'none';
        if (shareBtn) shareBtn.style.display = 'none';
    }
    
    setupWelcomeScreen() {
        const overlay = document.getElementById('welcome-overlay');
        const startBtn = document.getElementById('start-btn');
        const helpBtn = document.getElementById('help-btn');
        const aboutBtn = document.getElementById('about-btn');
        
        if (startBtn) {
            startBtn.addEventListener('click', () => {
                console.log('Start button clicked!');
                if (overlay) {
                    overlay.style.display = 'none';
                }
                this.loadPreset('oscillator');
                const oscillatorBtn = document.querySelector('[data-preset="oscillator"]');
                if (oscillatorBtn) {
                    oscillatorBtn.classList.add('active');
                }
            });
        }
        
        if (helpBtn) {
            helpBtn.addEventListener('click', () => {
                if (overlay) {
                    overlay.style.display = 'flex';
                }
            });
        }
        
        if (aboutBtn) {
            aboutBtn.addEventListener('click', () => {
                this.showAbout();
            });
        }
        
        // Also allow clicking anywhere on the overlay background to close it
        if (overlay) {
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) {
                    overlay.style.display = 'none';
                    this.loadPreset('oscillator');
                    const oscillatorBtn = document.querySelector('[data-preset="oscillator"]');
                    if (oscillatorBtn) {
                        oscillatorBtn.classList.add('active');
                    }
                }
            });
        }
    }
    
    showAbout() {
        const aboutHTML = `
            <div class="overlay">
                <div class="welcome-content">
                    <h2>ABOUT GL1TCHWAVE_</h2>
                    <p>A visual synthesizer inspired by Hydra, designed for artists of all skill levels.</p>
                    
                    <div style="text-align: left; margin: 20px 0;">
                        <h4>FEATURES:</h4>
                        <p>• Real-time visual generation<br>
                           • Audio reactive capabilities<br>
                           • Webcam input support<br>
                           • No coding required<br>
                           • Fullscreen immersive mode</p>
                           
                        <h4 style="margin-top: 20px;">CONTROLS:</h4>
                        <p>• <strong>Frequency:</strong> Controls pattern density<br>
                           • <strong>Speed:</strong> Animation timing<br>
                           • <strong>Intensity:</strong> Color brightness<br>
                           • <strong>Scale:</strong> Pattern size</p>
                    </div>
                    
                    <button onclick="this.parentElement.parentElement.remove()" class="start-button">CLOSE_</button>
                </div>
            </div>
        `;
        
        const aboutOverlay = document.createElement('div');
        aboutOverlay.innerHTML = aboutHTML;
        document.body.appendChild(aboutOverlay.firstElementChild);
    }
    
    setupEditor() {
        const editorElement = document.getElementById('code-editor');
        
        this.editor = new EditorView({
            extensions: [
                basicSetup,
                javascript(),
                oneDark,
                EditorView.theme({
                    '&': {
                        fontSize: '12px',
                        fontFamily: '"Source Code Pro", monospace'
                    },
                    '.cm-editor': {
                        backgroundColor: 'transparent',
                        color: '#00ff41'
                    },
                    '.cm-focused': { outline: 'none' },
                    '.cm-content': {
                        backgroundColor: 'transparent',
                        color: '#00ff41',
                        caretColor: '#00ff41'
                    }
                }),
                EditorView.lineWrapping
            ],
            parent: editorElement
        });
    }
    
    async setupAudio() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.analyser = this.audioContext.createAnalyser();
            this.analyser.fftSize = 256;
            this.fftData = new Uint8Array(this.analyser.frequencyBinCount);
            
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const source = this.audioContext.createMediaStreamSource(stream);
            source.connect(this.analyser);
            
            this.audioInitialized = true;
        } catch (error) {
            this.fftData = new Uint8Array(128).fill(0);
        }
    }
    
    createShaders() {
        // Oscillator shader
        this.oscCommand = this.regl({
            frag: `
                precision mediump float;
                uniform float time;
                uniform vec2 resolution;
                uniform float frequency;
                uniform float speed;
                uniform float intensity;
                uniform float scale;
                
                void main() {
                    vec2 uv = gl_FragCoord.xy / resolution;
                    vec2 center = uv - 0.5;
                    
                    float wave = sin(uv.x * frequency * scale + time * speed * 10.0) * 0.5 + 0.5;
                    float wave2 = cos(uv.y * frequency * scale * 0.7 + time * speed * 8.0) * 0.5 + 0.5;
                    
                    vec3 color = vec3(
                        wave * intensity,
                        wave2 * intensity * 0.8,
                        (wave + wave2) * 0.5 * intensity
                    );
                    
                    gl_FragColor = vec4(color, 1.0);
                }
            `,
            vert: `
                attribute vec2 position;
                void main() {
                    gl_Position = vec4(position, 0, 1);
                }
            `,
            attributes: {
                position: [[-1, -1], [1, -1], [1, 1], [-1, -1], [1, 1], [-1, 1]]
            },
            uniforms: {
                time: () => this.time,
                resolution: () => [this.width, this.height],
                frequency: () => this.params.frequency,
                speed: () => this.params.speed,
                intensity: () => this.params.intensity,
                scale: () => this.params.scale
            },
            count: 6
        });
        
        // Noise shader
        this.noiseCommand = this.regl({
            frag: `
                precision mediump float;
                uniform float time;
                uniform vec2 resolution;
                uniform float frequency;
                uniform float speed;
                uniform float intensity;
                uniform float scale;
                
                float random(vec2 st) {
                    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
                }
                
                float noise(vec2 st) {
                    vec2 i = floor(st);
                    vec2 f = fract(st);
                    float a = random(i);
                    float b = random(i + vec2(1.0, 0.0));
                    float c = random(i + vec2(0.0, 1.0));
                    float d = random(i + vec2(1.0, 1.0));
                    vec2 u = f * f * (3.0 - 2.0 * f);
                    return mix(a, b, u.x) + (c - a)* u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
                }
                
                void main() {
                    vec2 uv = gl_FragCoord.xy / resolution;
                    float n = noise(uv * frequency * scale + time * speed);
                    vec3 color = vec3(n * intensity);
                    gl_FragColor = vec4(color, 1.0);
                }
            `,
            vert: `
                attribute vec2 position;
                void main() { gl_Position = vec4(position, 0, 1); }
            `,
            attributes: {
                position: [[-1, -1], [1, -1], [1, 1], [-1, -1], [1, 1], [-1, 1]]
            },
            uniforms: {
                time: () => this.time,
                resolution: () => [this.width, this.height],
                frequency: () => this.params.frequency,
                speed: () => this.params.speed,
                intensity: () => this.params.intensity,
                scale: () => this.params.scale
            },
            count: 6
        });
        
        // Audio reactive shader
        this.audioCommand = this.regl({
            frag: `
                precision mediump float;
                uniform float time;
                uniform vec2 resolution;
                uniform float frequency;
                uniform float speed;
                uniform float intensity;
                uniform float scale;
                uniform float audioLevel;
                
                void main() {
                    vec2 uv = gl_FragCoord.xy / resolution;
                    vec2 center = uv - 0.5;
                    float dist = length(center);
                    
                    float wave = sin(dist * frequency * scale + time * speed * 5.0 + audioLevel * 20.0) * 0.5 + 0.5;
                    vec3 color = vec3(
                        wave * intensity * (1.0 + audioLevel),
                        wave * intensity * 0.7,
                        wave * intensity * (0.5 + audioLevel * 0.5)
                    );
                    
                    gl_FragColor = vec4(color, 1.0);
                }
            `,
            vert: `
                attribute vec2 position;
                void main() { gl_Position = vec4(position, 0, 1); }
            `,
            attributes: {
                position: [[-1, -1], [1, -1], [1, 1], [-1, -1], [1, 1], [-1, 1]]
            },
            uniforms: {
                time: () => this.time,
                resolution: () => [this.width, this.height],
                frequency: () => this.params.frequency,
                speed: () => this.params.speed,
                intensity: () => this.params.intensity,
                scale: () => this.params.scale,
                audioLevel: () => this.getAudioLevel()
            },
            count: 6
        });
    }
    
    getAudioLevel() {
        if (this.audioInitialized && this.analyser && this.fftData) {
            this.analyser.getByteFrequencyData(this.fftData);
            let sum = 0;
            for (let i = 0; i < 32; i++) {
                sum += this.fftData[i];
            }
            return (sum / 32) / 255.0;
        }
        return Math.sin(this.time * 2) * 0.5 + 0.5; // Fallback animation
    }
    
    loadPreset(presetName) {
        console.log(`Loading preset: ${presetName}`);
        this.currentPreset = presetName;
        
        const presets = {
            oscillator: { frequency: 20, speed: 0.1, intensity: 1.0, scale: 1.0 },
            noise: { frequency: 10, speed: 0.05, intensity: 0.8, scale: 2.0 },
            webcam: { frequency: 5, speed: 0.02, intensity: 1.2, scale: 1.5 },
            audio: { frequency: 15, speed: 0.2, intensity: 1.5, scale: 1.2 },
            kaleidoscope: { frequency: 30, speed: 0.3, intensity: 1.3, scale: 0.8 },
            fractal: { frequency: 40, speed: 0.08, intensity: 1.1, scale: 3.0 }
        };
        
        const preset = presets[presetName] || presets.oscillator;
        this.params = { ...preset };
        
        // Update sliders if they exist
        const freqSlider = document.getElementById('freq-slider');
        const speedSlider = document.getElementById('speed-slider');
        const intensitySlider = document.getElementById('intensity-slider');
        const scaleSlider = document.getElementById('scale-slider');
        
        if (freqSlider) freqSlider.value = preset.frequency;
        if (speedSlider) speedSlider.value = preset.speed;
        if (intensitySlider) intensitySlider.value = preset.intensity;
        if (scaleSlider) scaleSlider.value = preset.scale;
        
        // Update value displays if they exist
        const freqValue = document.getElementById('freq-value');
        const speedValue = document.getElementById('speed-value');
        const intensityValue = document.getElementById('intensity-value');
        const scaleValue = document.getElementById('scale-value');
        
        if (freqValue) freqValue.textContent = preset.frequency;
        if (speedValue) speedValue.textContent = preset.speed.toFixed(2);
        if (intensityValue) intensityValue.textContent = preset.intensity.toFixed(2);
        if (scaleValue) scaleValue.textContent = preset.scale.toFixed(1);
        
        // Initialize webcam if needed
        if (presetName === 'webcam' && !this.sources.s0.initialized) {
            this.initWebcam();
        }
        
        // Update status
        const statusBar = document.getElementById('status-bar');
        if (statusBar) {
            statusBar.textContent = `STATUS: ${presetName.toUpperCase()}_`;
        }
        
        console.log(`Preset loaded: ${presetName}`, preset);
    }
    
    async initWebcam() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            const video = document.createElement('video');
            video.srcObject = stream;
            video.autoplay = true;
            video.muted = true;
            video.playsInline = true;
            
            await new Promise((resolve) => {
                video.onloadedmetadata = resolve;
            });
            
            this.sources.s0.video = video;
            this.sources.s0.initialized = true;
            
        } catch (error) {
            console.warn('Webcam initialization failed:', error);
        }
    }
    
    randomizeParameters() {
        this.params.frequency = Math.random() * 50 + 5;
        this.params.speed = Math.random() * 0.5 + 0.01;
        this.params.intensity = Math.random() * 2 + 0.5;
        this.params.scale = Math.random() * 4 + 0.5;
        
        // Update sliders
        document.getElementById('freq-slider').value = this.params.frequency;
        document.getElementById('speed-slider').value = this.params.speed;
        document.getElementById('intensity-slider').value = this.params.intensity;
        document.getElementById('scale-slider').value = this.params.scale;
        
        // Update displays
        document.getElementById('freq-value').textContent = this.params.frequency.toFixed(1);
        document.getElementById('speed-value').textContent = this.params.speed.toFixed(2);
        document.getElementById('intensity-value').textContent = this.params.intensity.toFixed(2);
        document.getElementById('scale-value').textContent = this.params.scale.toFixed(1);
        
        document.getElementById('status-bar').textContent = 'STATUS: RANDOMIZED_';
    }
    
    toggleFullscreen() {
        if (!document.fullscreenElement) {
            this.canvas.requestFullscreen();
            document.getElementById('fullscreen-btn').textContent = 'EXIT FULLSCREEN';
        } else {
            document.exitFullscreen();
            document.getElementById('fullscreen-btn').textContent = 'FULLSCREEN';
        }
    }
    
    toggleCodeEditor() {
        const container = document.getElementById('code-editor-container');
        const btn = document.getElementById('toggle-code-btn');
        
        if (container.classList.contains('hidden')) {
            container.classList.remove('hidden');
            btn.textContent = 'HIDE CODE';
            
            // Update editor with current preset code
            const code = this.generateCodeFromPreset();
            this.editor.dispatch({
                changes: {
                    from: 0,
                    to: this.editor.state.doc.length,
                    insert: code
                }
            });
        } else {
            container.classList.add('hidden');
            btn.textContent = 'SHOW CODE';
        }
    }
    
    generateCodeFromPreset() {
        const presetCodes = {
            oscillator: `// Oscillator Visual
osc(${this.params.frequency}, ${this.params.speed}, ${this.params.intensity}).out()`,
            noise: `// Noise Field
noise(${this.params.frequency}, ${this.params.speed}).out()`,
            webcam: `// Webcam Input
s0.initCam()
src(s0).scale(${this.params.scale}).out()`,
            audio: `// Audio Reactive
osc(() => a.fft[0] * ${this.params.frequency}, ${this.params.speed}, ${this.params.intensity}).out()`,
            kaleidoscope: `// Kaleidoscope Effect
osc(${this.params.frequency}, ${this.params.speed}, ${this.params.intensity})
  .kaleid(4)
  .out()`,
            fractal: `// Fractal Pattern
noise(${this.params.frequency}, ${this.params.speed})
  .scale(${this.params.scale})
  .modulate(osc(10, 0.1))
  .out()`
        };
        
        return presetCodes[this.currentPreset] || presetCodes.oscillator;
    }
    
    startRenderLoop() {
        const render = () => {
            if (this.isPlaying) {
                this.time += 0.016;
            }
            
            this.regl.clear({
                color: [0, 0, 0, 1],
                depth: 1
            });
            
            // Render based on current preset
            switch (this.currentPreset) {
                case 'oscillator':
                case 'kaleidoscope':
                case 'fractal':
                    this.oscCommand();
                    break;
                case 'noise':
                    this.noiseCommand();
                    break;
                case 'audio':
                    this.audioCommand();
                    break;
                case 'webcam':
                    // TODO: Implement webcam rendering
                    this.oscCommand();
                    break;
                default:
                    this.oscCommand();
            }
            
            this.animationId = requestAnimationFrame(render);
        };
        
        render();
    }
}

// Initialize when ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        console.log('DOM loaded, initializing GL1TCHWAVE...');
        window.gl1tchwave = new GL1TCHWAVE();
    });
} else {
    console.log('DOM already loaded, initializing GL1TCHWAVE...');
    window.gl1tchwave = new GL1TCHWAVE();
}

// Add a backup initialization in case the import fails
window.addEventListener('load', () => {
    console.log('Window loaded');
    
    // Add direct event listener as backup
    const startBtn = document.getElementById('start-btn');
    const overlay = document.getElementById('welcome-overlay');
    
    if (startBtn && !startBtn.hasAttribute('data-listener-added')) {
        console.log('Adding backup start button listener');
        startBtn.setAttribute('data-listener-added', 'true');
        startBtn.addEventListener('click', () => {
            console.log('Backup start button clicked!');
            if (overlay) {
                overlay.style.display = 'none';
                console.log('Overlay hidden');
            }
            
            // Start basic oscillator
            if (window.gl1tchwave) {
                window.gl1tchwave.loadPreset('oscillator');
            }
        });
    }
});