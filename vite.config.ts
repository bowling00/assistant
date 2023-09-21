import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    esbuildOptions: {
      // Node.js global to browser globalThis
      define: {
        global: 'globalThis',
      },
    },
  },
  define: {
    'import.meta.env.VITE_BASE_URL': JSON.stringify(process.env.VITE_BASE_URL),
    'import.meta.env.VITE_PROXY_URL': JSON.stringify(process.env.VITE_PROXY_URL),
    'import.meta.env.VITE_AZURE_KEY': JSON.stringify(process.env.VITE_AZURE_KEY),
    'import.meta.env.VITE_REGION': JSON.stringify(process.env.VITE_REGION),
  },
});
