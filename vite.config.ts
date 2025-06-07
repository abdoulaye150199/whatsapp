import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    https: false, // Disable HTTPS for local development
    port: 5175,
    host: 'localhost',
    open: true // Automatically open browser
  }
});
