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
        'retro-orange': '#FF6B35',
        'retro-red': '#D62828',
        'retro-yellow': '#F4A261',
        'retro-gold': '#E9C46A',
        'vintage-cream': '#FFF8E7',
        'vintage-brown': '#8B4513',
        'vintage-burgundy': '#800020',
      },
      fontFamily: {
        'display': ['Georgia', 'serif'],
        'headline': ['Abril Fatface', 'serif'],
        'script': ['Pacifico', 'cursive'],
        'body': ['Outfit', 'sans-serif'],
        'number': ['Righteous', 'cursive'],
      },
    },
  },
  plugins: [],
}
