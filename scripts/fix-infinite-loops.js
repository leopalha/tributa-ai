/**
 * Fix Infinite Loop Issues
 * 
 * This script helps identify and convert components that could cause
 * "Maximum update depth exceeded" errors. It targets Radix UI components
 * that need to be replaced with the safe versions.
 * 
 * Run with: node scripts/fix-infinite-loops.js
 */

const fs = require('fs');
const path = require('path');
const { glob } = require('glob');

// Patterns to look for
const RADIX_PATTERNS = [
  {
    match: /import\s+\{\s*(?:[^{}]*(?:Popover|Dialog|Drawer|Select|DropdownMenu)[^{}]*)\s*\}\s+from\s+['"]@radix-ui\/react-[^'"]+['"]/g,
    explanation: 'Radix UI component import'
  },
  {
    match: /import\s+\{\s*(?:[^{}]*Button[^{}]*)\s*\}\s+from\s+['"]@\/components\/ui\/button['"]/g,
    explanation: 'Button component import'
  },
  {
    match: /<(Popover|PopoverTrigger|Dialog|DialogTrigger|Drawer|DrawerTrigger|Select|SelectTrigger|DropdownMenu|DropdownMenuTrigger|Button)[^>]*>/g,
    explanation: 'Radix UI component usage'
  }
];

// Additional patterns for common issues
const ADDITIONAL_PATTERNS = [
  {
    match: /<button(?![^>]*type=)[^>]*>/g,
    explanation: 'Button without type attribute',
    fix: (match) => match.replace(/<button/, '<button type="button"')
  },
  {
    match: /<ErrorBoundary[^>]*>[\s\S]*?<\/ErrorBoundary>/g,
    explanation: 'Error boundary component that may cause infinite loops'
  },
  {
    match: /export\s+default\s+function\s+Error\s*\(/g,
    explanation: 'Next.js error page that may cause infinite loops'
  }
];

// Safe alternative imports
const SAFE_IMPORTS = {
  'from "@radix-ui/react-popover"': 'from "@/components/ui/safe-radix-components"',
  'from "@radix-ui/react-dialog"': 'from "@/components/ui/safe-radix-components"',
  'from "@radix-ui/react-select"': 'from "@/components/ui/safe-radix-components"',
  'from "@radix-ui/react-dropdown-menu"': 'from "@/components/ui/safe-radix-components"',
  'from "@/components/ui/button"': 'from "@/components/ui/safe-button"'
};

// Component name replacements
const COMPONENT_REPLACEMENTS = {
  'Popover': 'SafePopover',
  'PopoverTrigger': 'SafePopoverTrigger',
  'Dialog': 'SafeDialog',
  'DialogTrigger': 'SafeDialogTrigger',
  'Drawer': 'SafeDrawer',
  'DrawerTrigger': 'SafeDrawerTrigger',
  'Select': 'SafeSelect',
  'SelectTrigger': 'SafeSelectTrigger',
  'DropdownMenu': 'SafeDropdownMenu',
  'DropdownMenuTrigger': 'SafeDropdownMenuTrigger',
  'Button': 'SafeButton'
};

/**
 * Scan a file for potential issues
 */
function scanFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    let matches = [];
    let hasMatches = false;
    
    // Check for Radix issues
    RADIX_PATTERNS.forEach(pattern => {
      const found = content.match(pattern.match);
      if (found && found.length > 0) {
        hasMatches = true;
        matches.push({
          type: pattern.explanation,
          count: found.length,
          examples: found.slice(0, 3)
        });
      }
    });
    
    // Check for additional common issues
    ADDITIONAL_PATTERNS.forEach(pattern => {
      const found = content.match(pattern.match);
      if (found && found.length > 0) {
        hasMatches = true;
        matches.push({
          type: pattern.explanation,
          count: found.length,
          examples: found.slice(0, 3)
        });
      }
    });
    
    if (hasMatches) {
      console.log(`\n[Potential issue] ${filePath}`);
      matches.forEach(match => {
        console.log(`  - ${match.type}: ${match.count} occurrence(s)`);
        match.examples.forEach(example => {
          console.log(`    * ${example.substring(0, 80)}${example.length > 80 ? '...' : ''}`);
        });
      });
      
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`Error scanning ${filePath}:`, error.message);
    return false;
  }
}

/**
 * Fix the issues in a file
 */
function fixFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // Replace import statements
    for (const [origImport, safeImport] of Object.entries(SAFE_IMPORTS)) {
      const regex = new RegExp(`from\\s+(?:"|')([^"']*${origImport.replace(/"/g, '')})(?:"|')`, 'g');
      if (regex.test(content)) {
        content = content.replace(regex, `from "${safeImport.replace(/from |"|'/g, '')}"`);
        modified = true;
      }
    }
    
    // Replace component usage
    for (const [origComponent, safeComponent] of Object.entries(COMPONENT_REPLACEMENTS)) {
      const regex = new RegExp(`<(\\s*)${origComponent}(\\s+|>|\\/>)`, 'g');
      if (regex.test(content)) {
        content = content.replace(regex, `<$1${safeComponent}$2`);
        modified = true;
      }
      
      // Also replace closing tags
      const closingRegex = new RegExp(`<\/(\\s*)${origComponent}(\\s*)>`, 'g');
      if (closingRegex.test(content)) {
        content = content.replace(closingRegex, `</$1${safeComponent}$2>`);
      }
    }
    
    // Fix buttons without type attribute
    const buttonNoTypeRegex = /<button(?![^>]*type=)[^>]*>/g;
    if (buttonNoTypeRegex.test(content)) {
      content = content.replace(buttonNoTypeRegex, match => match.replace(/<button/, '<button type="button"'));
      modified = true;
    }
    
    // Fix Next.js error pages specifically
    if (filePath.includes('error.tsx') || filePath.includes('error.jsx')) {
      // Check if it's a Next.js error page
      if (content.includes('export default function Error') || 
          content.includes('function Error') || 
          content.includes('const Error')) {
        
        // Replace any SafeButton components with regular buttons
        content = content.replace(/<SafeButton([^>]*)>([\s\S]*?)<\/SafeButton>/g, (match, props, children) => {
          const typeAttr = props.includes('type=') ? '' : ' type="button"';
          return `<button${props}${typeAttr}>${children}</button>`;
        });
        
        // Replace any Link components with native a tags
        content = content.replace(/<Link\s+href="([^"]+)"[^>]*>([\s\S]*?)<\/Link>/g, 
          (match, href, content) => `<a href="${href}">${content}</a>`);
        
        modified = true;
      }
    }
    
    if (modified) {
      fs.writeFileSync(filePath, content);
      console.log(`✅ Fixed issues in ${filePath}`);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`Error fixing ${filePath}:`, error.message);
    return false;
  }
}

/**
 * Fix error boundary components to use direct DOM elements
 */
function fixErrorBoundaries(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // If it's an error boundary component, we need special handling
    if (content.includes('ErrorBoundary') || filePath.includes('error-boundary')) {
      console.log(`⚠️ Error boundary detected in ${filePath}. Manual review recommended.`);
      return false;
    }
    
    return false;
  } catch (error) {
    console.error(`Error fixing error boundary in ${filePath}:`, error.message);
    return false;
  }
}

// Main execution
console.log('Starting scan for potential infinite loop issues...');

// Find all React component files - using async/await with the new glob API
async function main() {
  try {
    const files = await glob('src/**/*.{tsx,jsx}');
    
    console.log(`Found ${files.length} component files to scan`);
    
    let affectedFiles = 0;
    let fixedFiles = 0;
    let errorBoundaryFiles = 0;
    
    files.forEach(file => {
      const hasIssues = scanFile(file);
      if (hasIssues) {
        affectedFiles++;
        
        // Handle error boundaries specially
        if (file.includes('error.tsx') || file.includes('error.jsx') || 
            file.includes('error-boundary') || file.includes('ErrorBoundary')) {
          fixErrorBoundaries(file);
          errorBoundaryFiles++;
        }
        
        // Ask if the user wants to fix this file
        if (process.argv.includes('--fix-all') || process.argv.includes('--fix')) {
          const fixed = fixFile(file);
          if (fixed) fixedFiles++;
        }
      }
    });
    
    console.log(`\n📊 Summary:`);
    console.log(`• Scanned ${files.length} files`);
    console.log(`• Found ${affectedFiles} files with potential issues`);
    console.log(`• Identified ${errorBoundaryFiles} error boundary components that may need manual review`);
    
    if (process.argv.includes('--fix-all') || process.argv.includes('--fix')) {
      console.log(`• Fixed ${fixedFiles} files\n`);
    } else {
      console.log(`\nTo automatically fix these issues, run:`);
      console.log(`  npm run fix:infinite-loops -- --fix`);
      console.log(`  or add the script to your package.json:`);
      console.log(`  "fix:infinite-loops": "node scripts/fix-infinite-loops.js --fix"\n`);
    }
    
    if (affectedFiles > 0 && !process.argv.includes('--fix-all') && !process.argv.includes('--fix')) {
      console.log(`⚠️ Recommendation: Use safe components in error boundaries and places where Radix UI component rendering might be problematic.`);
      console.log(`   Consider reviewing error boundary components manually as they require special handling.`);
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

main(); 