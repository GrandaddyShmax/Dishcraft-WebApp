/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './views/*.ejs',
    './views/partials/*.ejs',
    './views/main/*.ejs',
    './views/errors/*.ejs',
  ],
  theme: {
    extend: {
      colors: {
        mint: '#00ff90',
        coffee: '#A9907E',
        latte: '#F3DEBA',
        pistachio: '#ABC4AA',
        espresso: '#675D50',
      },
      dropShadow: {
        lg: '0 4px 4px rgba(171, 196, 170, 0.1)',
        xl: '0 5px 5px rgba(171, 196, 170, 0.3)',
      },
    },
  },
  plugins: [],
}