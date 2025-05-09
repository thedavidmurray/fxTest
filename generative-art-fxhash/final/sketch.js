// Import symbols if running in Node.js environment
// In browser, symbols will be available from the global scope
if (typeof require !== 'undefined') {
  const { symbols, symbolUtils } = require('./symbols.js');
}

// Canvas and context variables
let canvas;
let ctx;

// Animation variables
let animationId;
let lastTime = 0;
let deltaTime = 0;

// Configuration parameters - these will be randomized using fxrand()
const config = {
  // Base parameters
  density: 0,
  speed: 0,
  scale: 0,
  complexity: 0,
  
  // Color parameters
  colorMode: '',
  primaryColor: '',
  secondaryColor: '',
  backgroundColor: '',
  colorVariation: 0,
  
  // Pattern parameters
  patternType: '',
  glitchIntensity: 0,
  symbolSize: 0,
  symbolSpacing: 0,
  
  // Movement parameters
  movementType: '',
  movementSpeed: 0,
  movementAmplitude: 0,
  
  // Special features
  specialFeature: '',
  
  // Grid parameters
  gridCols: 0,
  gridRows: 0,
  
  // Time-based parameters
  timeScale: 0,
  
  // Initialize all configuration parameters based on fxrand()
  initialize: function() {
    // Base parameters
    this.density = fxrandRange(0.1, 1);
    this.speed = fxrandRange(0.5, 5);
    this.scale = fxrandRange(0.5, 2);
    this.complexity = fxrandRange(0.1, 1);
    
    // Color parameters
    this.colorMode = fxrandElement(['monochrome', 'complementary', 'analogous', 'triadic', 'custom']);
    this.primaryColor = this.generateRandomColor();
    this.secondaryColor = this.generateRandomColor();
    this.backgroundColor = this.generateRandomColor(0.1, 0.3); // Darker background
    this.colorVariation = fxrandRange(0.1, 0.5);
    
    // Pattern parameters
    this.patternType = fxrandElement(['matrix', 'grid', 'flow', 'particles', 'symbols']);
    this.glitchIntensity = fxrandRange(0.05, 0.3);
    this.symbolSize = fxrandRange(8, 24);
    this.symbolSpacing = fxrandRange(1, 3);
    
    // Movement parameters
    this.movementType = fxrandElement(['wave', 'pulse', 'jitter', 'flow', 'orbit']);
    this.movementSpeed = fxrandRange(0.5, 3);
    this.movementAmplitude = fxrandRange(5, 30);
    
    // Special features
    this.specialFeature = fxrandElement(['infinitySymbol', 'codeFragments', 'matrixEffect', 'particleSystem', 'none']);
    
    // Update features for FXHASH
    this.updateFxhashFeatures();
  },
  
  // Generate a random color in HSL format
  generateRandomColor: function(saturationMin = 0.5, saturationMax = 1, lightnessMin = 0.3, lightnessMax = 0.7) {
    const h = fxrand() * 360;
    const s = fxrandRange(saturationMin, saturationMax) * 100;
    const l = fxrandRange(lightnessMin, lightnessMax) * 100;
    return `hsl(${h}, ${s}%, ${l}%)`;
  },
  
  // Update FXHASH features based on configuration
  updateFxhashFeatures: function() {
    if (typeof window !== 'undefined' && window.$fxhashFeatures) {
      window.$fxhashFeatures = {
        "Pattern Type": this.patternType.charAt(0).toUpperCase() + this.patternType.slice(1),
        "Color Scheme": this.colorMode.charAt(0).toUpperCase() + this.colorMode.slice(1),
        "Density": this.density < 0.3 ? "Low" : this.density < 0.7 ? "Medium" : "High",
        "Movement Style": this.movementType.charAt(0).toUpperCase() + this.movementType.slice(1),
        "Complexity": this.complexity < 0.3 ? "Simple" : this.complexity < 0.7 ? "Moderate" : "Complex",
        "Special Feature": this.specialFeature === 'none' ? "None" : 
                          this.specialFeature.charAt(0).toUpperCase() + this.specialFeature.slice(1)
      };
    }
  }
};

// Particle system for dynamic elements
class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.originalX = x;
    this.originalY = y;
    this.vx = fxrandRange(-1, 1) * config.movementSpeed;
    this.vy = fxrandRange(-1, 1) * config.movementSpeed;
    this.size = fxrandRange(config.symbolSize * 0.5, config.symbolSize * 1.5);
    this.symbol = this.getRandomSymbol();
    this.color = this.getRandomColor();
    this.alpha = fxrandRange(0.3, 1);
    this.rotation = fxrand() * Math.PI * 2;
    this.rotationSpeed = fxrandRange(-0.05, 0.05);
    this.glitchTimer = 0;
    this.glitchInterval = fxrandRange(1, 5) * 1000; // Milliseconds
    this.isGlitching = false;
  }
  
  getRandomSymbol() {
    const categories = ['alphanumeric', 'punctuation', 'special', 'visualPatterns'];
    const category = fxrandElement(categories);
    return symbolUtils.getRandomSymbol(category, fxrand);
  }
  
  getRandomColor() {
    if (fxrand() < 0.7) {
      return config.primaryColor;
    } else {
      return config.secondaryColor;
    }
  }
  
  update(deltaTime) {
    // Update position based on movement type
    switch (config.movementType) {
      case 'wave':
        this.x = this.originalX + Math.sin(Date.now() * 0.001 * config.movementSpeed + this.originalY * 0.01) * config.movementAmplitude;
        this.y = this.originalY + Math.cos(Date.now() * 0.001 * config.movementSpeed + this.originalX * 0.01) * config.movementAmplitude;
        break;
      case 'pulse':
        const scale = 1 + Math.sin(Date.now() * 0.001 * config.movementSpeed) * 0.2;
        this.x = this.originalX * scale;
        this.y = this.originalY * scale;
        break;
      case 'jitter':
        if (fxrand() < 0.05) {
          this.vx = fxrandRange(-1, 1) * config.movementSpeed;
          this.vy = fxrandRange(-1, 1) * config.movementSpeed;
        }
        this.x += this.vx;
        this.y += this.vy;
        
        // Boundary check
        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
        break;
      case 'flow':
        const noiseX = simplex(this.x * 0.005, this.y * 0.005, Date.now() * 0.0001);
        const noiseY = simplex(this.x * 0.005 + 100, this.y * 0.005 + 100, Date.now() * 0.0001);
        this.vx += noiseX * 0.1 * config.movementSpeed;
        this.vy += noiseY * 0.1 * config.movementSpeed;
        this.vx *= 0.99;
        this.vy *= 0.99;
        this.x += this.vx;
        this.y += this.vy;
        
        // Boundary check with wrap-around
        if (this.x < 0) this.x = canvas.width;
        if (this.x > canvas.width) this.x = 0;
        if (this.y < 0) this.y = canvas.height;
        if (this.y > canvas.height) this.y = 0;
        break;
      case 'orbit':
        const time = Date.now() * 0.001 * config.movementSpeed;
        const distance = Math.sqrt(Math.pow(this.originalX - canvas.width/2, 2) + Math.pow(this.originalY - canvas.height/2, 2));
        const angle = Math.atan2(this.originalY - canvas.height/2, this.originalX - canvas.width/2) + time * (0.5 / (distance * 0.01));
        this.x = canvas.width/2 + Math.cos(angle) * distance;
        this.y = canvas.height/2 + Math.sin(angle) * distance;
        break;
    }
    
    // Update rotation
    this.rotation += this.rotationSpeed;
    
    // Handle glitching
    this.glitchTimer += deltaTime;
    if (this.glitchTimer > this.glitchInterval) {
      this.isGlitching = !this.isGlitching;
      if (!this.isGlitching) {
        this.symbol = this.getRandomSymbol();
        this.glitchInterval = fxrandRange(1, 5) * 1000;
      } else {
        this.glitchInterval = fxrandRange(100, 500);
      }
      this.glitchTimer = 0;
    }
    
    // Random symbol change based on glitch intensity
    if (fxrand() < config.glitchIntensity * deltaTime * 0.01) {
      this.symbol = this.getRandomSymbol();
      if (fxrand() < 0.3) {
        this.color = this.getRandomColor();
      }
    }
  }
  
  draw() {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    
    // Apply glitch effect
    if (this.isGlitching && fxrand() < 0.5) {
      ctx.translate(fxrandRange(-5, 5), fxrandRange(-5, 5));
      ctx.scale(fxrandRange(0.8, 1.2), fxrandRange(0.8, 1.2));
    }
    
    ctx.globalAlpha = this.alpha;
    ctx.fillStyle = this.color;
    ctx.font = `${this.size}px monospace`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(this.symbol, 0, 0);
    
    ctx.restore();
  }
}

// Array to store particles
let particles = [];

// Simplex noise implementation (simplified for this example)
// This provides smooth random values for flowing movement
function simplex(x, y, z) {
  // Simple pseudo-random function based on fxrand
  const dot = (x, y, z) => {
    return 2 * fxrand() - 1;
  };
  
  return dot(x, y, z);
}

// Initialize the canvas and start the animation
function init() {
  // Create canvas if it doesn't exist
  if (!canvas) {
    canvas = document.createElement('canvas');
    document.body.appendChild(canvas);
    ctx = canvas.getContext('2d');
  }
  
  // Initialize configuration
  config.initialize();
  
  // Set canvas size
  resizeCanvas();
  
  // Create particles
  createParticles();
  
  // Start animation loop
  if (animationId) {
    cancelAnimationFrame(animationId);
  }
  animate(0);
  
  // Add event listener for window resize
  window.addEventListener('resize', handleResize);
}

// Create particles based on configuration
function createParticles() {
  particles = [];
  
  // Calculate number of particles based on density and screen size
  const area = canvas.width * canvas.height;
  const particleCount = Math.floor(area * 0.0001 * config.density * config.scale);
  
  // Create grid-based or random distribution based on pattern type
  if (config.patternType === 'grid' || config.patternType === 'matrix') {
    // Calculate grid dimensions
    config.gridCols = Math.floor(Math.sqrt(particleCount * canvas.width / canvas.height));
    config.gridRows = Math.floor(particleCount / config.gridCols);
    
    // Create grid of particles
    const cellWidth = canvas.width / config.gridCols;
    const cellHeight = canvas.height / config.gridRows;
    
    for (let row = 0; row < config.gridRows; row++) {
      for (let col = 0; col < config.gridCols; col++) {
        const x = col * cellWidth + cellWidth / 2;
        const y = row * cellHeight + cellHeight / 2;
        
        // Add some randomness to grid positions for more organic feel
        const jitterX = fxrandRange(-cellWidth * 0.2, cellWidth * 0.2);
        const jitterY = fxrandRange(-cellHeight * 0.2, cellHeight * 0.2);
        
        particles.push(new Particle(x + jitterX, y + jitterY));
      }
    }
  } else {
    // Create randomly distributed particles
    for (let i = 0; i < particleCount; i++) {
      const x = fxrand() * canvas.width;
      const y = fxrand() * canvas.height;
      particles.push(new Particle(x, y));
    }
  }
}

// Handle window resize
function handleResize() {
  resizeCanvas();
  createParticles();
}

// Resize canvas to fill window
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

// Animation loop
function animate(timestamp) {
  // Calculate delta time for smooth animation
  if (!lastTime) lastTime = timestamp;
  deltaTime = timestamp - lastTime;
  lastTime = timestamp;
  
  // Clear canvas with background color
  ctx.fillStyle = config.backgroundColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Update and draw particles
  particles.forEach(particle => {
    particle.update(deltaTime);
    particle.draw();
  });
  
  // Draw special features
  drawSpecialFeatures();
  
  // Continue animation loop
  animationId = requestAnimationFrame(animate);
}

// Draw special features based on configuration
function drawSpecialFeatures() {
  switch (config.specialFeature) {
    case 'infinitySymbol':
      drawInfinitySymbol();
      break;
    case 'codeFragments':
      drawCodeFragments();
      break;
    case 'matrixEffect':
      drawMatrixEffect();
      break;
    case 'particleSystem':
      // Already handled by the particle system
      break;
  }
}

// Draw infinity symbol
function drawInfinitySymbol() {
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const size = Math.min(canvas.width, canvas.height) * 0.3;
  
  ctx.save();
  ctx.translate(centerX, centerY);
  ctx.rotate(Date.now() * 0.0005 * config.movementSpeed);
  
  ctx.strokeStyle = config.primaryColor;
  ctx.lineWidth = size * 0.05;
  ctx.globalAlpha = 0.5;
  
  ctx.beginPath();
  // Draw infinity symbol using parametric equation
  for (let t = 0; t <= Math.PI * 2; t += 0.01) {
    const x = size * Math.sin(t) / (1 + Math.cos(t) * Math.cos(t));
    const y = size * Math.sin(t) * Math.cos(t) / (1 + Math.cos(t) * Math.cos(t));
    
    if (t === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }
  ctx.stroke();
  
  ctx.restore();
}

// Draw code fragments
function drawCodeFragments() {
  const fragments = [
    "function()", "=>", "class", "const", "let", "var", "for", "while", "if", "else",
    "return", "this", "new", "import", "export", "default", "try", "catch"
  ];
  
  ctx.save();
  ctx.globalAlpha = 0.2;
  ctx.font = '16px monospace';
  ctx.fillStyle = config.secondaryColor;
  
  // Draw random code fragments
  for (let i = 0; i < 20; i++) {
    const x = fxrand() * canvas.width;
    const y = fxrand() * canvas.height;
    const fragment = fxrandElement(fragments);
    ctx.fillText(fragment, x, y);
  }
  
  ctx.restore();
}

// Draw matrix effect
function drawMatrixEffect() {
  // This is a simplified matrix effect
  const cols = Math.floor(canvas.width / config.symbolSize);
  const yPositions = [];
  
  if (!window.matrixYPositions) {
    // Initialize y positions for matrix columns
    window.matrixYPositions = Array(cols).fill(0).map(() => fxrand() * canvas.height);
  }
  
  ctx.save();
  ctx.fillStyle = config.primaryColor;
  ctx.font = `${config.symbolSize}px monospace`;
  
  for (let i = 0; i < cols; i++) {
    // Get a random symbol
    const symbol = symbolUtils.getRandomSymbol('alphanumeric', fxrand);
    
    // Calculate x position
    const x = i * config.symbolSize;
    
    // Update and draw y position
    window.matrixYPositions[i] += config.movementSpeed * 2;
    if (window.matrixYPositions[i] > canvas.height) {
      window.matrixYPositions[i] = 0;
    }
    
    // Draw symbol
    ctx.globalAlpha = 0.5;
    ctx.fillText(symbol, x, window.matrixYPositions[i]);
  }
  
  ctx.restore();
}

// Initialize when the document is loaded
if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', init);
}

// Export functions for testing or Node.js environment
if (typeof module !== 'undefined') {
  module.exports = {
    init,
    config,
    Particle
  };
}