import { defineConfig } from 'vite'

export default defineConfig({
  base: './',
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: './index.html',
        login: './login.html',
        register: './register.html'
      }
    }
  },
  server: {
    port: 5173,
    open: true
  }
})