/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Zen Maru Gothic"', '"Noto Sans JP"', 'sans-serif'],
        montserrat: ['"Montserrat"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
