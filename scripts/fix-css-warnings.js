/**
 * Fix CSS warnings script
 * 
 * This script updates CSS files to fix common browser compatibility warnings
 * by ensuring vendor prefixes appear in the correct order.
 * 
 * Run with: node scripts/fix-css-warnings.js
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// CSS properties that need vendor prefixes
const propertiesToFix = [
  {
    property: 'text-size-adjust',
    prefixes: ['-webkit-text-size-adjust', '-moz-text-size-adjust', '-ms-text-size-adjust'],
  },
  {
    property: 'backdrop-filter',
    prefixes: ['-webkit-backdrop-filter'],
  },
  {
    property: 'user-select',
    prefixes: ['-webkit-user-select', '-moz-user-select', '-ms-user-select'],
  },
  {
    property: 'appearance',
    prefixes: ['-webkit-appearance', '-moz-appearance'],
  },
  {
    property: 'background-clip',
    prefixes: ['-webkit-background-clip'],
  },
  {
    property: 'mask-image',
    prefixes: ['-webkit-mask-image'],
  },
];

// Pattern to find CSS rules with properties
const cssRuleRegex = /([^{]*)\{([^}]*)\}/g;

// Function to fix CSS property order
function fixPropertyOrder(cssContent) {
  let modifiedCss = cssContent;
  
  propertiesToFix.forEach(({ property, prefixes }) => {
    // Find instances where the standard property comes before vendor prefixes
    const standardPropertyRegex = new RegExp(`(\\s*${property}\\s*:.+?;)(.*?)(\\s*-\\w+-${property}\\s*:.+?;)`, 'g');
    
    // Replace with prefixes first, then standard property
    modifiedCss = modifiedCss.replace(standardPropertyRegex, (match, standardProp, middle, vendorPrefix) => {
      return `${vendorPrefix}${middle}${standardProp}`;
    });
    
    // Add missing prefixes where standard property exists but prefixes don't
    const standardPropertyWithoutPrefixRegex = new RegExp(`([^-]${property}\\s*:.+?;)`, 'g');
    
    modifiedCss = modifiedCss.replace(standardPropertyWithoutPrefixRegex, (match, standardProp) => {
      const value = standardProp.match(/:(.+?);/)[1];
      let result = '';
      
      prefixes.forEach(prefix => {
        result += `${prefix}:${value};`;
      });
      
      return `${result}${standardProp}`;
    });
  });
  
  return modifiedCss;
}

// Function to process a CSS file
function processCssFile(filePath) {
  console.log(`Processing ${filePath}`);
  
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const fixedContent = fixPropertyOrder(content);
    
    if (content !== fixedContent) {
      fs.writeFileSync(filePath, fixedContent);
      console.log(`  Updated ${filePath}`);
    } else {
      console.log(`  No changes needed for ${filePath}`);
    }
  } catch (error) {
    console.error(`  Error processing ${filePath}:`, error);
  }
}

// Main execution
console.log('Starting CSS warning fixes...');

// Find all CSS files in the project
glob('src/**/*.css', (err, files) => {
  if (err) {
    console.error('Error finding CSS files:', err);
    return;
  }
  
  console.log(`Found ${files.length} CSS files to process`);
  
  files.forEach(processCssFile);
  
  console.log('CSS fixes complete!');
});

// Also look for CSS in JS files that might contain styled-components
glob('src/**/*.{jsx,tsx}', (err, files) => {
  if (err) {
    console.error('Error finding React files:', err);
    return;
  }
  
  console.log(`Found ${files.length} React files to check for CSS-in-JS`);
  // This is more complex and would need a more sophisticated parser
  // For now, we'll just log a message recommending manual checks
  console.log('For CSS-in-JS styles, please manually ensure vendor prefixes are in the correct order.');
}); 