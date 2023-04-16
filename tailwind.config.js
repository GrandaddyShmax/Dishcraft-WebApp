/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './views/*.ejs',
    './views/partials/*.ejs'
  ],
  theme: {
    extend: {
      colors: {
        mint: '#00ff90',
      },
      dropShadow: {
        lg: '0 4px 4px rgba(0, 255, 144, 0.1)',
        xl: '0 5px 5px rgba(0, 255, 144, 0.3)',
      },
    },
  },
  plugins: [],
}