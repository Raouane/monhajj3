/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        gold: '#FFD700',
        'gold-hover': '#FDB931',
        'dark-gray': '#1A1A1A',
      },
      backgroundImage: {
        'gradient-gold': 'linear-gradient(to right, #FFD700, #FDB931)',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} 