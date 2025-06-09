import { defineConfig } from 'vite'

export default defineConfig({
  base: './',
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: './index.html',
        login: './login.html'
      }
    }
  },
  // Configuration du serveur de développement
  server: {
    hmr: false
  }
})