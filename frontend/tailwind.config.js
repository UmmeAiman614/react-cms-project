/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'deep-green': '#3E5F44',
        'muted-green': '#5E936C',
        'light-mint': '#93DA97',
        'pale-yellow': '#E8FFD7',
      },
    },
  },
  plugins: [],
}
