/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'spice-orange': '#FF6B35',
        'spice-red': '#D62828',
        'spice-yellow': '#F4A261',
        'curry-gold': '#E9C46A',
      },
      fontFamily: {
        'display': ['Georgia', 'serif'],
      },
    },
  },
  plugins: [],
}
