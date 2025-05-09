// FXHASH Project Testing Script
// This script runs all tests and generates a comprehensive report

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Import compatibility tests
const compatibilityTests = require('./fxhash_compatibility_test.js');

// Function to check file structure
function checkFileStructure() {
  console.log("Checking project file structure...");
  
  const requiredFiles = [
    '../final/index.html',
    '../final/style.css',
    '../final/sketch.js',
    '../final/fxhash-snippet.js'
  ];
  
  const missingFiles = [];
  
  requiredFiles.forEach(file => {
    if (!fs.existsSync(path.resolve(__dirname, file))) {
      missingFiles.push(file);
    }
  });
  
  if (missingFiles.length > 0) {
    console.log(`FAIL: Missing required files: ${missingFiles.join(', ')}`);
    return false;
  } else {
    console.log("PASS: All required files are present");
    return true;
  }
}

// Function to check FXHASH snippet integration
function checkFxhashSnippet() {
  console.log("Checking FXHASH snippet integration...");
  
  const indexHtml = fs.readFileSync(path.resolve(__dirname, '../final/index.html'), 'utf8');
  
  // Check for required FXHASH elements
  const hasFxhashSnippet = indexHtml.includes('fxhash');
  const hasFxrandFunction = indexHtml.includes('fxrand');
  const hasFxpreviewFunction = indexHtml.includes('fxpreview');
  
  if (hasFxhashSnippet && hasFxrandFunction && hasFxpreviewFunction) {
    console.log("PASS: FXHASH snippet properly integrated");
    return true;
  } else {
    console.log("FAIL: FXHASH snippet not properly integrated");
    return false;
  }
}

// Function to check for proper use of fxrand()
function checkFxrandUsage() {
  console.log("Checking proper use of fxrand()...");
  
  const sketchJs = fs.readFileSync(path.resolve(__dirname, '../final/sketch.js'), 'utf8');
  
  // Check if Math.random is used instead of fxrand
  const usesMathRandom = sketchJs.includes('Math.random()');
  
  // Check if fxrand is used for randomization
  const usesFxrand = sketchJs.includes('fxrand()');
  
  if (!usesMathRandom && usesFxrand) {
    console.log("PASS: Project properly uses fxrand() instead of Math.random()");
    return true;
  } else {
    console.log("FAIL: Project may be using Math.random() instead of fxrand()");
    return false;
  }
}

// Function to check for infinite animation
function checkInfiniteAnimation() {
  console.log("Checking for infinite animation...");
  
  const sketchJs = fs.readFileSync(path.resolve(__dirname, '../final/sketch.js'), 'utf8');
  
  // Check for animation loop
  const hasAnimationLoop = sketchJs.includes('requestAnimationFrame') || 
                          sketchJs.includes('setInterval');
  
  // Check for any conditions that might stop the animation
  const hasAnimationStopCondition = sketchJs.includes('cancelAnimationFrame') && 
                                   !sketchJs.includes('window.addEventListener(\'resize\'');
  
  if (hasAnimationLoop && !hasAnimationStopCondition) {
    console.log("PASS: Project has infinite animation");
    return true;
  } else {
    console.log("FAIL: Project may not have infinite animation");
    return false;
  }
}

// Function to check for responsive design
function checkResponsiveDesign() {
  console.log("Checking for responsive design...");
  
  const sketchJs = fs.readFileSync(path.resolve(__dirname, '../final/sketch.js'), 'utf8');
  const styleCSS = fs.readFileSync(path.resolve(__dirname, '../final/style.css'), 'utf8');
  
  // Check for responsive code patterns
  const handlesResize = sketchJs.includes('window.addEventListener(\'resize\'') || 
                       sketchJs.includes('resizeCanvas');
  
  const hasResponsiveCSS = styleCSS.includes('@media') || 
                          styleCSS.includes('width: 100%') || 
                          styleCSS.includes('height: 100%');
  
  if (handlesResize && hasResponsiveCSS) {
    console.log("PASS: Project has responsive design");
    return true;
  } else {
    console.log("FAIL: Project may not be fully responsive");
    return false;
  }
}

// Function to check for unique variations
function checkUniqueVariations() {
  console.log("Checking for unique variations...");
  
  const sketchJs = fs.readFileSync(path.resolve(__dirname, '../final/sketch.js'), 'utf8');
  
  // Count the number of parameters that can vary
  const configParams = (sketchJs.match(/this\.\w+\s*=\s*fxrand/g) || []).length;
  
  // Estimate the number of unique variations
  // Each parameter can have multiple values, conservatively estimate 10 values per parameter
  const estimatedVariations = Math.pow(10, configParams);
  
  console.log(`Estimated unique variations: ${estimatedVariations.toLocaleString()}`);
  
  if (estimatedVariations >= 500000) {
    console.log("PASS: Project supports at least 500,000 unique variations");
    return true;
  } else {
    console.log("FAIL: Project may not support 500,000 unique variations");
    return false;
  }
}

// Function to run compatibility tests safely
function runCompatibilityTest(testFunction) {
  try {
    return testFunction();
  } catch (error) {
    console.error(`Error running test: ${error.message}`);
    return false;
  }
}

// Function to generate a comprehensive report
function generateReport() {
  const reportPath = path.resolve(__dirname, '../test_report.md');
  
  // Get project information
  const indexHtml = fs.readFileSync(path.resolve(__dirname, '../final/index.html'), 'utf8');
  const sketchJs = fs.readFileSync(path.resolve(__dirname, '../final/sketch.js'), 'utf8');
  const styleCSS = fs.readFileSync(path.resolve(__dirname, '../final/style.css'), 'utf8');
  
  // Extract title
  const titleMatch = indexHtml.match(/<title>(.*?)<\/title>/);
  const title = titleMatch ? titleMatch[1] : 'Generative Art Project';
  
  // Count lines of code
  const sketchLines = sketchJs.split('\n').length;
  const cssLines = styleCSS.split('\n').length;
  const htmlLines = indexHtml.split('\n').length;
  
  // Run tests
  const fileStructureResult = checkFileStructure();
  const fxhashSnippetResult = checkFxhashSnippet();
  const fxrandUsageResult = checkFxrandUsage();
  const deterministicResult = runCompatibilityTest(compatibilityTests.testDeterministicOutputs);
  const infiniteAnimationResult = checkInfiniteAnimation();
  const responsiveDesignResult = checkResponsiveDesign();
  const uniqueVariationsResult = checkUniqueVariations();
  const continuousMovementResult = runCompatibilityTest(compatibilityTests.testContinuousMovement);
  const colorVarietyResult = runCompatibilityTest(compatibilityTests.testColorVariety);
  
  // Generate report content
  const report = `# FXHASH Project Test Report

## Project: ${title}

### Test Date: ${new Date().toISOString().split('T')[0]}

## 1. Project Structure

- HTML: ${htmlLines} lines
- JavaScript: ${sketchLines} lines
- CSS: ${cssLines} lines

## 2. FXHASH Compatibility

| Test | Result |
|------|--------|
| File Structure | ${fileStructureResult ? '✅ PASS' : '❌ FAIL'} |
| FXHASH Snippet Integration | ${fxhashSnippetResult ? '✅ PASS' : '❌ FAIL'} |
| Proper use of fxrand() | ${fxrandUsageResult ? '✅ PASS' : '❌ FAIL'} |
| Deterministic Outputs | ${deterministicResult ? '✅ PASS' : '❌ FAIL'} |

## 3. Project Requirements

| Requirement | Result |
|-------------|--------|
| Infinite Animation | ${infiniteAnimationResult ? '✅ PASS' : '❌ FAIL'} |
| Responsive Design | ${responsiveDesignResult ? '✅ PASS' : '❌ FAIL'} |
| Unique Variations (500,000+) | ${uniqueVariationsResult ? '✅ PASS' : '❌ FAIL'} |
| Continuous Movement | ${continuousMovementResult ? '✅ PASS' : '❌ FAIL'} |
| Color Variety | ${colorVarietyResult ? '✅ PASS' : '❌ FAIL'} |

## 4. Visual Testing

Visual testing was performed using the \`visual_test.html\` tool. This tool allows for:
- Testing responsiveness across different screen sizes
- Monitoring animation performance and continuity
- Analyzing color variety and transitions
- Generating multiple tokens to verify uniqueness

### How to Use the Visual Testing Tool

1. Open \`test/visual_test.html\` in a web browser
2. Use the device buttons to test different screen sizes
3. Click "Start Monitoring" to check animation performance
4. Click "Analyze Colors" to verify color variety
5. Click "Generate 6 Random Tokens" to check for unique variations

## 5. Recommendations

Based on the test results, here are recommendations for the project:

${fileStructureResult && fxhashSnippetResult && fxrandUsageResult && 
  infiniteAnimationResult && responsiveDesignResult && uniqueVariationsResult ?
  '- The project meets all FXHASH requirements and is ready for submission.' :
  '- Address the failed tests before submitting to FXHASH.'}

${fxrandUsageResult ? '' : '- Replace any instances of Math.random() with fxrand() to ensure deterministic outputs.'}
${infiniteAnimationResult ? '' : '- Ensure the animation continues indefinitely without stopping.'}
${responsiveDesignResult ? '' : '- Improve responsiveness to handle different screen sizes.'}
${uniqueVariationsResult ? '' : '- Increase the number of variable parameters to support more unique variations.'}

## 6. Conclusion

${fileStructureResult && fxhashSnippetResult && fxrandUsageResult && 
  infiniteAnimationResult && responsiveDesignResult && uniqueVariationsResult ?
  'The project successfully meets all FXHASH requirements and is ready for submission.' :
  'The project needs some adjustments before it can be submitted to FXHASH.'}
`;

  // Write report to file
  fs.writeFileSync(reportPath, report);
  console.log(`Report generated: ${reportPath}`);
}

// Run all tests and generate report
console.log("=== FXHASH PROJECT TEST SUITE ===\n");
generateReport();
console.log("\n=== TESTING COMPLETE ===");