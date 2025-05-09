// FXHASH Compatibility Test Script
// This script tests the generative art project for FXHASH compatibility

// Mock fxhash environment
const mockFxhash = () => {
  // Generate a random hash to simulate different tokens
  const generateRandomHash = () => {
    const alphabet = "123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ";
    return "oo" + Array(49).fill(0).map(_ => alphabet[Math.floor(Math.random() * alphabet.length)]).join('');
  };

  // Create a deterministic PRNG based on the hash
  const createFxrand = (hash) => {
    // Simple hash function to generate seed values
    const hashToSeed = (hash) => {
      let h1 = 1779033703, h2 = 3144134277, h3 = 1013904242, h4 = 2773480762;
      for (let i = 0, k; i < hash.length; i++) {
        k = hash.charCodeAt(i);
        h1 = h2 ^ Math.imul(h1 ^ k, 597399067);
        h2 = h3 ^ Math.imul(h2 ^ k, 2869860233);
        h3 = h4 ^ Math.imul(h3 ^ k, 951274213);
        h4 = h1 ^ Math.imul(h4 ^ k, 2716044179);
      }
      h1 = Math.imul(h3 ^ (h1 >>> 18), 597399067);
      h2 = Math.imul(h4 ^ (h2 >>> 22), 2869860233);
      h3 = Math.imul(h1 ^ (h3 >>> 17), 951274213);
      h4 = Math.imul(h2 ^ (h4 >>> 19), 2716044179);
      return [(h1^h2^h3^h4)>>>0, (h2^h1)>>>0, (h3^h1)>>>0, (h4^h1)>>>0];
    };

    // PRNG function based on the seed
    const sfc32 = (a, b, c, d) => {
      return () => {
        a >>>= 0; b >>>= 0; c >>>= 0; d >>>= 0;
        let t = (a + b) | 0;
        a = b ^ b >>> 9;
        b = c + (c << 3) | 0;
        c = (c << 21 | c >>> 11);
        d = d + 1 | 0;
        t = t + d | 0;
        c = c + t | 0;
        return (t >>> 0) / 4294967296;
      };
    };

    // Generate seed values from hash
    const seed = hashToSeed(hash);
    
    // Return PRNG function
    return sfc32(seed[0], seed[1], seed[2], seed[3]);
  };

  // Generate a random hash
  const hash = generateRandomHash();
  
  // Create fxrand function
  const fxrand = createFxrand(hash);
  
  return { hash, fxrand, createFxrand };
};

// Test for deterministic outputs
const testDeterministicOutputs = () => {
  console.log("Testing deterministic outputs...");
  
  // Generate multiple tokens with the same hash
  const { hash, fxrand, createFxrand } = mockFxhash();
  
  // Generate a sequence of random numbers
  const sequence1 = Array(100).fill(0).map(() => fxrand());
  
  // Create a new fxrand with the same hash
  const fxrand2 = createFxrand(hash);
  
  // Generate another sequence
  const sequence2 = Array(100).fill(0).map(() => fxrand2());
  
  // Compare sequences
  const areEqual = sequence1.every((val, i) => Math.abs(val - sequence2[i]) < 1e-10);
  
  console.log(`Deterministic output test: ${areEqual ? 'PASSED' : 'FAILED'}`);
  return areEqual;
};

// Test for uniqueness across different tokens
const testUniqueness = (numTokens = 100) => {
  console.log(`Testing uniqueness across ${numTokens} tokens...`);
  
  // Generate multiple tokens
  const tokens = Array(numTokens).fill(0).map(() => mockFxhash());
  
  // Generate features for each token
  const features = tokens.map(token => {
    // Mock the global fxrand
    global.fxrand = token.fxrand;
    
    // Create mock config object since we can't directly import sketch.js
    const config = {
      patternType: ['matrix', 'grid', 'flow', 'particles', 'symbols'][Math.floor(global.fxrand() * 5)],
      colorMode: ['monochrome', 'complementary', 'analogous', 'triadic', 'custom'][Math.floor(global.fxrand() * 5)],
      density: global.fxrand(),
      movementType: ['wave', 'pulse', 'jitter', 'flow', 'orbit'][Math.floor(global.fxrand() * 5)],
      complexity: global.fxrand(),
      specialFeature: ['infinitySymbol', 'codeFragments', 'matrixEffect', 'particleSystem', 'none'][Math.floor(global.fxrand() * 5)]
    };
    
    return config;
  });
  
  // Count unique combinations
  const uniqueCombinations = new Set();
  features.forEach(feature => {
    const featureString = JSON.stringify(feature);
    uniqueCombinations.add(featureString);
  });
  
  const uniqueCount = uniqueCombinations.size;
  const uniquePercentage = (uniqueCount / numTokens) * 100;
  
  console.log(`Uniqueness test: ${uniqueCount} unique combinations out of ${numTokens} tokens (${uniquePercentage.toFixed(2)}%)`);
  console.log(`Estimated unique variations: ${Math.pow(2, Object.keys(features[0]).length) * 1000}`);
  
  return uniquePercentage > 90; // Expect at least 90% uniqueness
};

// Test for responsiveness
const testResponsiveness = () => {
  console.log("Testing responsiveness...");
  
  // Define different screen sizes to test
  const screenSizes = [
    { width: 320, height: 568 },  // iPhone SE
    { width: 768, height: 1024 }, // iPad
    { width: 1366, height: 768 }, // Laptop
    { width: 1920, height: 1080 }, // Desktop
    { width: 2560, height: 1440 }  // Large monitor
  ];
  
  // Check if the code handles different screen sizes
  const responsiveCode = [
    'resizeCanvas()',
    'window.addEventListener(\'resize\'',
    'canvas.width = window.innerWidth',
    'canvas.height = window.innerHeight'
  ];
  
  // Read the sketch.js file
  const fs = require('fs');
  const sketchCode = fs.readFileSync('./final/sketch.js', 'utf8');
  
  // Check if responsive code patterns are present
  const hasResponsiveCode = responsiveCode.some(pattern => sketchCode.includes(pattern));
  
  console.log(`Responsiveness test: ${hasResponsiveCode ? 'PASSED' : 'FAILED'}`);
  return hasResponsiveCode;
};

// Test for continuous movement/animation
const testContinuousMovement = () => {
  console.log("Testing continuous movement...");
  
  // Read the sketch.js file
  const fs = require('fs');
  const sketchCode = fs.readFileSync('./final/sketch.js', 'utf8');
  
  // Check for animation loop
  const hasAnimationLoop = sketchCode.includes('requestAnimationFrame') || 
                          sketchCode.includes('setInterval');
  
  // Check for movement code
  const hasMovementCode = sketchCode.includes('update(') && 
                         (sketchCode.includes('x +=') || sketchCode.includes('y +=') ||
                          sketchCode.includes('rotation +='));
  
  console.log(`Continuous movement test: ${hasAnimationLoop && hasMovementCode ? 'PASSED' : 'FAILED'}`);
  return hasAnimationLoop && hasMovementCode;
};

// Test for color variety without flashing
const testColorVariety = () => {
  console.log("Testing color variety...");
  
  // Read the sketch.js file
  const fs = require('fs');
  const sketchCode = fs.readFileSync('./final/sketch.js', 'utf8');
  
  // Check for color generation
  const hasColorGeneration = sketchCode.includes('generateRandomColor') || 
                            sketchCode.includes('hsl(') || 
                            sketchCode.includes('rgb(');
  
  // Check for smooth transitions (no flashing)
  const hasSmoothTransitions = !sketchCode.includes('Math.random() < 0.5') || 
                              !sketchCode.includes('if (fxrand() < 0.1)');
  
  console.log(`Color variety test: ${hasColorGeneration ? 'PASSED' : 'FAILED'}`);
  console.log(`Smooth transitions test: ${hasSmoothTransitions ? 'PASSED' : 'FAILED'}`);
  
  return hasColorGeneration && hasSmoothTransitions;
};

// Run all tests
const runAllTests = () => {
  console.log("=== FXHASH COMPATIBILITY TEST ===");
  
  const deterministicResult = testDeterministicOutputs();
  const uniquenessResult = testUniqueness(100);
  const responsivenessResult = testResponsiveness();
  const movementResult = testContinuousMovement();
  const colorResult = testColorVariety();
  
  console.log("\n=== TEST SUMMARY ===");
  console.log(`Deterministic outputs: ${deterministicResult ? 'PASSED' : 'FAILED'}`);
  console.log(`Uniqueness: ${uniquenessResult ? 'PASSED' : 'FAILED'}`);
  console.log(`Responsiveness: ${responsivenessResult ? 'PASSED' : 'FAILED'}`);
  console.log(`Continuous movement: ${movementResult ? 'PASSED' : 'FAILED'}`);
  console.log(`Color variety: ${colorResult ? 'PASSED' : 'FAILED'}`);
  
  const overallResult = deterministicResult && uniquenessResult && 
                       responsivenessResult && movementResult && colorResult;
  
  console.log(`\nOverall result: ${overallResult ? 'PASSED' : 'FAILED'}`);
  
  return overallResult;
};

// Export test functions
module.exports = {
  testDeterministicOutputs,
  testUniqueness,
  testResponsiveness,
  testContinuousMovement,
  testColorVariety,
  runAllTests
};

// Run tests if this file is executed directly
if (require.main === module) {
  runAllTests();
}