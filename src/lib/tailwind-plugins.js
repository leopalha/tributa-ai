/**
 * Optimized tailwind plugin loading
 */

// Import plugins directly to avoid dynamic requires
// Using try-catch for better error handling
let animatePlugin, typographyPlugin, formsPlugin, aspectRatioPlugin;

try {
  animatePlugin = require('tailwindcss-animate');
} catch (e) {
  console.warn('Warning: tailwindcss-animate plugin not found');
  animatePlugin = () => {};
}

try {
  typographyPlugin = require('@tailwindcss/typography');
} catch (e) {
  console.warn('Warning: @tailwindcss/typography plugin not found');
  typographyPlugin = () => {};
}

try {
  formsPlugin = require('@tailwindcss/forms');
} catch (e) {
  console.warn('Warning: @tailwindcss/forms plugin not found');
  formsPlugin = () => {};
}

try {
  aspectRatioPlugin = require('@tailwindcss/aspect-ratio');
} catch (e) {
  console.warn('Warning: @tailwindcss/aspect-ratio plugin not found');
  aspectRatioPlugin = () => {};
}

// Export plugins in a consistent way
const plugins = [
  animatePlugin,
  typographyPlugin,
  formsPlugin,
  aspectRatioPlugin,
].filter(plugin => typeof plugin === 'function');

const plugin = require('tailwindcss/plugin');

module.exports = {
  plugins: [
    // Plugin para sombras internas
    plugin(function ({ addUtilities, theme, e }) {
      const utilities = {
        '.inner-shadow': {
          boxShadow: `inset 0 2px 4px 0 ${theme('colors.gray.500', 'rgba(0,0,0,0.06)')}`,
        },
        // Adicionar mais variantes se necessário
      };
      addUtilities(utilities, ['responsive', 'hover']);
    }),
    
    // Plugin para animações customizadas (exemplo)
    plugin(function ({ addUtilities, theme, e }) {
      const utilities = {
        '.animate-fade-in-up': {
          animation: 'fadeInUp 0.5s ease-out forwards',
        },
      };
      addUtilities(utilities, ['motion-safe']);
    }),
    
    // Plugin para degradês de texto
    plugin(function ({ addUtilities, theme, e }) {
      const utilities = {
        '.text-gradient-blue': {
          backgroundImage: `linear-gradient(to right, ${theme('colors.blue.500')}, ${theme('colors.indigo.500')})`,
          '-webkit-background-clip': 'text',
          backgroundClip: 'text',
          color: 'transparent',
        },
      };
      addUtilities(utilities, ['responsive']);
    }),

    // Outros plugins aqui...
  ],
}; 