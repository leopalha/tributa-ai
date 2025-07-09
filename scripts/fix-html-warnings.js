/**
 * Fix HTML warnings script
 * 
 * This script scans React component files and fixes common HTML issues:
 * 1. Adding type attributes to buttons
 * 2. Ensuring form fields have id or name attributes
 * 3. Properly associating labels with form fields
 * 
 * Run with: node scripts/fix-html-warnings.js
 */

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

// Configure directories to scan
const DIRS_TO_SCAN = [
  path.join(__dirname, '../src/components'),
  path.join(__dirname, '../src/app')
];

// Regular expressions for finding issues
const BUTTON_WITHOUT_TYPE_REGEX = /<button(?![^>]*type=)[^>]*>/g;
const FORM_FIELD_WITHOUT_ID_OR_NAME_REGEX = /<(input|select|textarea)(?![^>]*(id|name)=)[^>]*>/g;
const LABEL_WITHOUT_FOR_REGEX = /<label(?![^>]*for=)[^>]*>/g;

// Replacements
const addTypeToButton = (match) => match.replace('<button', '<button type="button"');
const addIdToFormField = (match, tagName) => {
  const randomId = `${tagName}_${Math.random().toString(36).substring(2, 10)}`;
  return match.replace(`<${tagName}`, `<${tagName} id="${randomId}"`);
};

// Function to scan files in a directory
function scanDirectory(dir) {
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stats = fs.statSync(filePath);
    
    if (stats.isDirectory()) {
      scanDirectory(filePath); // Recursively scan subdirectories
    } else if (/\.(jsx|tsx)$/.test(file)) {
      scanFile(filePath);
    }
  }
}

// Function to scan and fix a single file
function scanFile(filePath) {
  console.log(`Scanning ${filePath}`);
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  
  // Fix buttons without type
  const buttonMatches = content.match(BUTTON_WITHOUT_TYPE_REGEX) || [];
  if (buttonMatches.length > 0) {
    console.log(`  Found ${buttonMatches.length} buttons without type attribute`);
    content = content.replace(BUTTON_WITHOUT_TYPE_REGEX, addTypeToButton);
    modified = true;
  }
  
  // Fix form fields without id or name
  const formFieldMatches = content.match(FORM_FIELD_WITHOUT_ID_OR_NAME_REGEX) || [];
  if (formFieldMatches.length > 0) {
    console.log(`  Found ${formFieldMatches.length} form fields without id or name attribute`);
    formFieldMatches.forEach(match => {
      const tagName = match.match(/<(input|select|textarea)/)[1];
      content = content.replace(match, addIdToFormField(match, tagName));
    });
    modified = true;
  }
  
  // Fix labels without for attribute
  // Note: This requires a more sophisticated approach to associate with the right input
  // This is a placeholder that would need manual review
  const labelMatches = content.match(LABEL_WITHOUT_FOR_REGEX) || [];
  if (labelMatches.length > 0) {
    console.log(`  Found ${labelMatches.length} labels without for attribute (manual review needed)`);
  }
  
  // Save changes if modified
  if (modified) {
    fs.writeFileSync(filePath, content);
    console.log(`  Updated ${filePath}`);
  }
}

// Main execution
console.log('Starting HTML warning fixes...');
DIRS_TO_SCAN.forEach(dir => {
  console.log(`Scanning directory: ${dir}`);
  scanDirectory(dir);
});
console.log('Scan complete.'); 