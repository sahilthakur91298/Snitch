/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'luxury-gold': '#d4a017',
        'dark-bg': '#0e0c08',
        'card-bg': '#141109',
        'border-dark': '#2a2414',
      }
    },
  },
  plugins: [],
}
