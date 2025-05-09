// Symbols extracted from toxiExample.txt
const symbols = {
  "alphanumeric": [
    "0", "1", "2", "3", "4", "5", "6", "7", "8", "9",
    "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", 
    "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z",
    "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", 
    "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"
  ],
  "punctuation": [
    "!", "\"", "#", "$", "%", "&", "'", "(", ")", "*", "+", ",", "-", ".", "/",
    ":", ";", "<", "=", ">", "?", "[", "]", "^", "_", "`", "{", "|", "}", "~"
  ],
  "special": [
    "∞"
  ],
  "visualPatterns": [
    "))," , ">>>", "]),", "(...", "===", "[[.", "]],", "`${", "!==", ")))"
  ],
  "codePatterns": [
    "function", "=>", "class", "const", "let", "var", "for", "while", "if", "else",
    "return", "this", "new", "import", "export", "default", "try", "catch"
  ],
  "colors": {
    "names": [
      "yellow", "pink", "blue", "grey", "purple", "gray", 
      "white", "black", "orange", "brown", "red", "green"
    ]
  },
  "commonSequences": [
    "   ", "    ", "     ", "\n  ", "\n   ", "\n    ", " = ", ", ", "t, ",
    ",\n ", ",\n  ", ",\n   ", " => ", "{\n  ", "{\n   ", " {\n  "
  ]
};

// Helper functions for using symbols in generative art
const symbolUtils = {
  // Get a random symbol from a specific category
  getRandomSymbol: function(category, fxrand) {
    const categoryArray = symbols[category];
    if (!categoryArray || categoryArray.length === 0) return '';
    const index = Math.floor(fxrand() * categoryArray.length);
    return categoryArray[index];
  },
  
  // Get a random color name
  getRandomColor: function(fxrand) {
    return this.getRandomSymbol('colors.names', fxrand);
  },
  
  // Generate a random pattern using symbols
  generatePattern: function(length, fxrand) {
    let pattern = '';
    for (let i = 0; i < length; i++) {
      const categoryNames = Object.keys(symbols);
      const category = categoryNames[Math.floor(fxrand() * categoryNames.length)];
      if (category === 'colors') continue; // Skip the colors object
      pattern += this.getRandomSymbol(category, fxrand);
    }
    return pattern;
  },
  
  // Generate a glitchy text pattern
  generateGlitchyText: function(length, fxrand) {
    let text = '';
    for (let i = 0; i < length; i++) {
      const r = fxrand();
      if (r < 0.4) {
        text += this.getRandomSymbol('alphanumeric', fxrand);
      } else if (r < 0.7) {
        text += this.getRandomSymbol('punctuation', fxrand);
      } else if (r < 0.9) {
        text += this.getRandomSymbol('visualPatterns', fxrand);
      } else {
        text += this.getRandomSymbol('special', fxrand);
      }
    }
    return text;
  }
};

// Export symbols for use in generative art
if (typeof module !== 'undefined') {
  module.exports = { symbols, symbolUtils };
}