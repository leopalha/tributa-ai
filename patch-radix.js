/**
 * This script patches the Radix UI react-compose-refs module to prevent infinite loops
 */
const fs = require('fs');
const path = require('path');

// Paths to the original and patched files
const originalFilePath = path.join(__dirname, 'node_modules/@radix-ui/react-compose-refs/dist/index.mjs');
const patchFilePath = path.join(__dirname, 'node_modules/@radix-ui/react-compose-refs/dist/index.mjs-patch.js');

console.log('Original file path:', originalFilePath);
console.log('Patch file path:', patchFilePath);

// Check if files exist
console.log('Original file exists:', fs.existsSync(originalFilePath));
console.log('Patch file exists:', fs.existsSync(patchFilePath));

// Backup the original file if it exists and hasn't been backed up
const backupFilePath = originalFilePath + '.backup';
if (fs.existsSync(originalFilePath) && !fs.existsSync(backupFilePath)) {
  console.log('Creating backup of original Radix UI compose-refs module...');
  fs.copyFileSync(originalFilePath, backupFilePath);
  console.log('Backup created at:', backupFilePath);
}

// Apply the patch by replacing the content of index.mjs with our patched version
if (fs.existsSync(patchFilePath)) {
  console.log('Applying patch to Radix UI compose-refs module...');
  const patchContent = fs.readFileSync(patchFilePath, 'utf8');
  fs.writeFileSync(originalFilePath, patchContent, 'utf8');
  console.log('Patch applied successfully!');
} else {
  console.error('Patch file not found at:', patchFilePath);
  process.exit(1);
}

console.log('Patching Radix UI completed!'); 