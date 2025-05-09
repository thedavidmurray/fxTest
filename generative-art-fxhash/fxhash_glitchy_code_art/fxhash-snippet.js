// FXHASH Integration Code
// This file contains the necessary code for FXHASH platform compatibility

// Truncated hash for display purposes
let fxhashTrunc = "oo" + (Math.random() * 100000000 | 0).toString(16);

// Variables injected by FXHASH
let fxhash = fxhashTrunc;
let fxrand = Math.random;

// The fxrand() function is a PRNG function that generates deterministic pseudo-random values
// based on the transaction hash. When using fxhash, it will be replaced by a deterministic
// version derived from the hash of the transaction.
// It is essential to use this function for all randomness in the project.

// Utility functions for working with fxrand
const fxrandRange = (min, max) => {
  return min + fxrand() * (max - min);
};

const fxrandInt = (min, max) => {
  return Math.floor(fxrandRange(min, max + 1));
};

const fxrandElement = (array) => {
  return array[Math.floor(fxrand() * array.length)];
};

// Define features for the artwork
// These will be displayed on the FXHASH platform
const defineFeatures = () => {
  // Features should be based on the initial fxrand() values
  // to ensure they remain consistent for each token
  
  // Example features - these will be replaced with actual features
  // based on our generative algorithm
  window.$fxhashFeatures = {
    "Pattern Type": fxrandElement(["Glitchy", "Flowing", "Structured", "Chaotic", "Minimal"]),
    "Color Scheme": fxrandElement(["Monochromatic", "Complementary", "Analogous", "Triadic", "Custom"]),
    "Density": fxrandElement(["Low", "Medium", "High", "Extreme"]),
    "Movement Style": fxrandElement(["Pulsating", "Flowing", "Jittery", "Smooth", "Erratic"]),
    "Complexity": fxrandElement(["Simple", "Moderate", "Complex", "Intricate"]),
    "Special Feature": fxrandElement(["None", "Infinity Symbol", "Code Fragments", "Matrix Effect", "Particle System"])
  };
};

// Function to be called when the window loads
window.addEventListener("DOMContentLoaded", () => {
  // Define features for the token
  defineFeatures();
  
  // Log features for debugging
  console.log("FXHASH FEATURES:", window.$fxhashFeatures);
  
  // Notify FXHASH that the project is ready
  // This is important for the preview generation
  if (window.fxpreview) {
    window.fxpreview();
  }
});

// Export functions for use in sketch.js
if (typeof module !== 'undefined') {
  module.exports = {
    fxrand,
    fxrandRange,
    fxrandInt,
    fxrandElement
  };
}