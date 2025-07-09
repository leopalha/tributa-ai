import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    force: true,
  },
  build: {
    rollupOptions: {
      external: ['@rollup/rollup-linux-x64-gnu']
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    open: true,
    host: '0.0.0.0',
    strictPort: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          radix: ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu'],
          ui: ['@headlessui/react', 'framer-motion'],
          charts: ['recharts', '@tremor/react'],
          utils: ['lodash', 'date-fns', 'clsx', 'tailwind-merge']
        },
        onwarn(warning, warn) {
          // Ignora warnings de TypeScript temporariamente
          if (warning.code === 'PLUGIN_WARNING') return
          warn(warning)
        }
      }
    }
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'lucide-react',
      '@headlessui/react',
      '@tanstack/react-query'
    ]
  },
  define: {
    global: 'globalThis',
    'process.env': '{}',
    'process.version': '"v18.0.0"',
    'process.platform': '"browser"',
    'process.nextTick': '((fn) => setTimeout(fn, 0))',
    'setImmediate': '((fn) => setTimeout(fn, 0))',
    'clearImmediate': 'clearTimeout'
  },
  esbuild: {
    // Ignora erros TypeScript temporariamente para fazer a app rodar
    logOverride: { 
      'this-is-undefined-in-esm': 'silent',
      'top-level-await': 'silent'
    },
    // Permite continuar mesmo com erros TS
    target: 'es2020'
  }
}) 