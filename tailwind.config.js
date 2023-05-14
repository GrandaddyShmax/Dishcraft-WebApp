/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './views/*.ejs',
    './views/partials/*.ejs',
    './views/main/*.ejs',
    './views/admin/*.ejs',
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
        tasty: '#AD7A6F',
        cold: '#699EA1',
        sweet: '#9485AF',
      },
      dropShadow: {
        lg: '0 4px 4px rgba(171, 196, 170, 0.1)',
        xl: '0 5px 5px rgba(171, 196, 170, 0.3)',
      },
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(0deg) scale(1)'},
          '20%, 80%': { transform: 'rotate(0deg) scale(1.3)' },
          '40%': { transform: 'rotate(15deg) scale(1.3)'},
          '60%': { transform: 'rotate(-15deg) scale(1.3)'},
        },
      },
      animation: {
        wiggle: 'wiggle 1s',
      }
    },
  },
  plugins: [],
};