#!/usr/bin/env node

/**
 * This script automatically fixes all Radix UI component imports to use our safe wrappers
 * instead of the original components, to prevent infinite loop issues.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// List of all Radix UI components we want to replace with safe versions
const radixComponentsToFix = [
  {
    pattern: /from\s+["']@radix-ui\/react-popover["']/g,
    replacement: `from "@/components/ui/safe-radix-components"`,
    components: {
      'PopoverPrimitive.Root': 'SafePopover',
      'Popover.Root': 'SafePopover',
      'Popover': 'SafePopover',
      'PopoverPrimitive.Trigger': 'SafePopoverTrigger',
      'Popover.Trigger': 'SafePopoverTrigger',
      'PopoverTrigger': 'SafePopoverTrigger',
      'PopoverPrimitive.Anchor': 'SafePopoverAnchor',
      'Popover.Anchor': 'SafePopoverAnchor',
      'PopoverAnchor': 'SafePopoverAnchor',
    }
  },
  {
    pattern: /from\s+["']@radix-ui\/react-dialog["']/g,
    replacement: `from "@/components/ui/safe-radix-components"`,
    components: {
      'DialogPrimitive.Root': 'SafeDialog',
      'Dialog.Root': 'SafeDialog',
      'Dialog': 'SafeDialog',
      'DialogPrimitive.Trigger': 'SafeDialogTrigger',
      'Dialog.Trigger': 'SafeDialogTrigger',
      'DialogTrigger': 'SafeDialogTrigger',
    }
  },
  {
    pattern: /from\s+["']@radix-ui\/react-select["']/g,
    replacement: `from "@/components/ui/safe-radix-components"`,
    components: {
      'SelectPrimitive.Root': 'SafeSelect',
      'Select.Root': 'SafeSelect',
      'Select': 'SafeSelect',
      'SelectPrimitive.Trigger': 'SafeSelectTrigger',
      'Select.Trigger': 'SafeSelectTrigger',
      'SelectTrigger': 'SafeSelectTrigger',
    }
  },
  {
    pattern: /from\s+["']@radix-ui\/react-dropdown-menu["']/g,
    replacement: `from "@/components/ui/safe-radix-components"`,
    components: {
      'DropdownMenuPrimitive.Root': 'SafeDropdownMenu',
      'DropdownMenu.Root': 'SafeDropdownMenu',
      'DropdownMenu': 'SafeDropdownMenu',
      'DropdownMenuPrimitive.Trigger': 'SafeDropdownMenuTrigger',
      'DropdownMenu.Trigger': 'SafeDropdownMenuTrigger',
      'DropdownMenuTrigger': 'SafeDropdownMenuTrigger',
    }
  },
];

// Find all TypeScript and TSX files in the source directory
function findTsFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory() && !filePath.includes('node_modules') && !filePath.includes('.next')) {
      fileList = findTsFiles(filePath, fileList);
    } else if (
      (filePath.endsWith('.ts') || filePath.endsWith('.tsx')) && 
      !filePath.includes('safe-radix-components.tsx') &&
      !filePath.includes('safe-ref-wrapper.tsx') &&
      !filePath.includes('radix-fix.ts')
    ) {
      fileList.push(filePath);
    }
  });

  return fileList;
}

// Fix a file by replacing Radix UI imports with safe versions
function fixFile(filePath) {
  let fileContent = fs.readFileSync(filePath, 'utf8');
  let originalContent = fileContent;
  let hasRadixImports = false;

  // First check if the file has any Radix UI imports
  for (const { pattern } of radixComponentsToFix) {
    if (pattern.test(fileContent)) {
      hasRadixImports = true;
      break;
    }
  }

  if (!hasRadixImports) {
    return false;
  }

  console.log(`Fixing ${filePath}...`);

  // Replace imports
  for (const { pattern, replacement, components } of radixComponentsToFix) {
    // Reset the lastIndex property to start searching from the beginning
    pattern.lastIndex = 0;
    
    if (pattern.test(fileContent)) {
      // Replace import statements
      fileContent = fileContent.replace(pattern, replacement);

      // Replace component usages
      for (const [original, safe] of Object.entries(components)) {
        // Use word boundaries to avoid partial matches
        const componentPattern = new RegExp(`\\b${original}\\b`, 'g');
        fileContent = fileContent.replace(componentPattern, safe);
      }
    }
  }

  // If the content has changed, write it back to the file
  if (fileContent !== originalContent) {
    fs.writeFileSync(filePath, fileContent, 'utf8');
    return true;
  }

  return false;
}

// Main execution
console.log('Finding all TypeScript files...');
const sourceDir = path.resolve(__dirname, '../src');
const files = findTsFiles(sourceDir);

console.log(`Found ${files.length} TypeScript files.`);
console.log('Fixing Radix UI imports...');

let fixedFiles = 0;
files.forEach(file => {
  if (fixFile(file)) {
    fixedFiles++;
  }
});

console.log(`Fixed ${fixedFiles} files with Radix UI imports.`);

// Now restart the dev server if needed
if (fixedFiles > 0) {
  console.log('Changes made. You should restart your development server.');
}

console.log('Done!'); 