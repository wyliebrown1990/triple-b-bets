/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: '#FDF6E3',
        sage: '#87A878',
        'sage-dark': '#6B8E5E',
        gold: '#D4A853',
        'gold-dark': '#B8923F',
        brown: '#8B7355',
      },
      fontFamily: {
        display: ['Georgia', 'serif'],
        body: ['system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
