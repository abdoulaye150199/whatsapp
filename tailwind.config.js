/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#00a884',
        secondary: '#202c33',
        background: '#111b21',
      }
    },
  },
  plugins: [],
}
