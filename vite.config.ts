import { defineConfig } from 'vite';
import path from 'path';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    // The React and Tailwind plugins are both required for Make, even if
    // Tailwind is not being actively used – do not remove them
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      // Alias @ to the src directory
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    // Enable code splitting
    rollupOptions: {
      output: {
        // Manual chunking strategy for optimal bundle splitting
        manualChunks: (id) => {
          // Vendor chunk for node_modules
          if (id.includes('node_modules')) {
            // Only split non-React libs to avoid "undefined (forwardRef/createContext)" errors.
            // React, react-dom, react-dnd, @radix-ui, react-router must stay in vendor together.
            if (id.includes('recharts')) {
              return 'recharts';
            }
            if (id.includes('date-fns')) {
              return 'date-utils';
            }
            return 'vendor';
          }

          // Pages in separate chunks
          if (id.includes('/pages/')) {
            const pageName = id.split('/pages/')[1]?.split('.')[0];
            return `page-${pageName}`;
          }

          // Dashboard components together
          if (id.includes('/components/dashboard/')) {
            return 'dashboard-components';
          }

          // Cart components together
          if (id.includes('/components/cart/')) {
            return 'cart-components';
          }
        },
      },
    },
    // Chunk size warnings
    chunkSizeWarningLimit: 600, // Warn if chunk > 600KB
    // Minification
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.logs in production
        drop_debugger: true,
      },
    },
    // Source maps for debugging (disable in production for smaller builds)
    sourcemap: false,
  },
  // Development server configuration
  server: {
    port: 3000,
    strictPort: false,
    open: true,
  },
  // Dependency pre-bundling optimization
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router',
      'lucide-react',
    ],
    exclude: [
      'recharts', // Lazy loaded, don't pre-bundle
    ],
  },
});
