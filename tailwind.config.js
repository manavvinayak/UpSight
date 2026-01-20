/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f8f8f8',
          100: '#f0f0f0',
          200: '#e4e4e4',
          300: '#d1d1d1',
          400: '#b4b4b4',
          500: '#9a9a9a',
          600: '#6b6b6b',
          700: '#4a4a4a',
          800: '#2d2d2d',
          900: '#1a1a1a',
        }
      }
    },
  },
  plugins: [],
}
