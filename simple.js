// GL1TCHWAVE - Simple version without ES6 imports
console.log('Simple GL1TCHWAVE loading...');

class SimpleGL1TCHWAVE {
    constructor() {
        this.canvas = null;
        this.regl = null;
        this.time = 0;
        this.animationId = null;
        this.width = 0;
        this.height = 0;
        this.isPlaying = true;
        
        // Live parameters
        this.params = {
            frequency: 20,
            speed: 0.1,
            intensity: 1.0,
            scale: 1.0
        };
        
        this.currentPreset = 'oscillator';
        
        this.init();
    }
    
    init() {
        console.log('Initializing Simple GL1TCHWAVE...');
        this.setupWelcomeScreen();
        this.setupCanvas();
        this.setupControls();
        this.createShaders();
        this.startRenderLoop();
    }
    
    setupWelcomeScreen() {
        console.log('Setting up welcome screen...');
        const overlay = document.getElementById('welcome-overlay');
        const startBtn = document.getElementById('start-btn');
        
        if (startBtn) {
            console.log('Start button found, adding listener...');
            startBtn.addEventListener('click', () => {
                console.log('START BUTTON CLICKED!');
                if (overlay) {
                    overlay.style.display = 'none';
                    console.log('Welcome overlay hidden');
                }
                
                // Small delay to ensure proper canvas sizing after overlay removal
                setTimeout(() => {
                    this.updateCanvasSize();
                    this.loadPreset('oscillator');
                }, 100);
            });
        } else {
            console.error('Start button not found!');
        }
    }
    
    setupCanvas() {
        this.canvas = document.getElementById('gl-canvas');
        if (!this.canvas) {
            console.error('Canvas not found!');
            return;
        }
        
        this.regl = createREGL({
            canvas: this.canvas,
            extensions: ['OES_texture_float']
        });
        
        this.updateCanvasSize();
        window.addEventListener('resize', () => this.updateCanvasSize());
        
        // Click to pause/play
        this.canvas.addEventListener('click', () => {
            this.isPlaying = !this.isPlaying;
            document.getElementById('status-bar').textContent = 
                this.isPlaying ? 'STATUS: PLAYING_' : 'STATUS: PAUSED_';
        });
    }
    
    updateCanvasSize() {
        const rect = this.canvas.getBoundingClientRect();
        this.width = Math.max(rect.width, 400);
        this.height = Math.max(rect.height, 300);
        
        // Set the display size (css pixels)
        this.canvas.style.width = rect.width + 'px';
        this.canvas.style.height = rect.height + 'px';
        
        // Set the actual canvas size (for WebGL)
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        
        console.log(`Canvas resized to: ${this.width}x${this.height}`);
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
            
            if (slider && value) {
                slider.addEventListener('input', (e) => {
                    const val = parseFloat(e.target.value);
                    this.params[param === 'freq' ? 'frequency' : param] = val;
                    value.textContent = val.toFixed(2);
                });
            }
        });
        
        // Action buttons
        const randomizeBtn = document.getElementById('randomize-btn');
        const fullscreenBtn = document.getElementById('fullscreen-btn');
        
        if (randomizeBtn) {
            randomizeBtn.addEventListener('click', () => this.randomizeParameters());
        }
        
        if (fullscreenBtn) {
            fullscreenBtn.addEventListener('click', () => this.toggleFullscreen());
        }
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
        
        // Update sliders
        const freqSlider = document.getElementById('freq-slider');
        const speedSlider = document.getElementById('speed-slider');
        const intensitySlider = document.getElementById('intensity-slider');
        const scaleSlider = document.getElementById('scale-slider');
        
        if (freqSlider) freqSlider.value = preset.frequency;
        if (speedSlider) speedSlider.value = preset.speed;
        if (intensitySlider) intensitySlider.value = preset.intensity;
        if (scaleSlider) scaleSlider.value = preset.scale;
        
        // Update displays
        const freqValue = document.getElementById('freq-value');
        const speedValue = document.getElementById('speed-value');
        const intensityValue = document.getElementById('intensity-value');
        const scaleValue = document.getElementById('scale-value');
        
        if (freqValue) freqValue.textContent = preset.frequency;
        if (speedValue) speedValue.textContent = preset.speed.toFixed(2);
        if (intensityValue) intensityValue.textContent = preset.intensity.toFixed(2);
        if (scaleValue) scaleValue.textContent = preset.scale.toFixed(1);
        
        // Update status
        const statusBar = document.getElementById('status-bar');
        if (statusBar) {
            statusBar.textContent = `STATUS: ${presetName.toUpperCase()}_`;
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
    
    createShaders() {
        if (!this.regl) return;
        
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
        
        console.log('Shaders created successfully');
    }
    
    startRenderLoop() {
        const render = () => {
            if (this.isPlaying) {
                this.time += 0.016;
            }
            
            if (this.regl && this.oscCommand) {
                this.regl.clear({
                    color: [0, 0, 0, 1],
                    depth: 1
                });
                
                this.oscCommand();
            }
            
            this.animationId = requestAnimationFrame(render);
        };
        
        render();
        console.log('Render loop started');
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        console.log('DOM loaded, creating Simple GL1TCHWAVE...');
        window.simpleGL1tchwave = new SimpleGL1TCHWAVE();
    });
} else {
    console.log('DOM ready, creating Simple GL1TCHWAVE...');
    window.simpleGL1tchwave = new SimpleGL1TCHWAVE();
}