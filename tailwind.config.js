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
          '0%, 100%': { transform: 'rotate(0deg) scale(1)' },
          '20%, 80%': { transform: 'rotate(0deg) scale(1.3)' },
          '40%': { transform: 'rotate(15deg) scale(1.3)' },
          '60%': { transform: 'rotate(-15deg) scale(1.3)' },
        },
        load1: {
          '0%, 60%': { transform: 'translate(0%,0%) scale(1.5.0.5)' },
          '5%': { transform: 'translate(0%,10%) scale(1.25,0.75)' },
          '8%': { transform: 'translate(0%,-240%) scale(0.75,1.25)' },
          '22%': { transform: 'translate(0%,-280%) scale(0.8,1.2)' },
          '30%': { transform: 'translate(0%,-300%) scale(0.9,1.1)' },
          '38%': { transform: 'translate(0%,-280%) scale(1,1)' },
          '52%': { transform: 'translate(0%,-240%) scale(1.1,0.9)' },
          '55%': { transform: 'translate(0%,35%) scale(1.3,0.7)' },
        },
        load2: {
          '20%, 80%': { transform: 'translate(0%,0%) scale(1.5.0.5)' },
          '25%': { transform: 'translate(0%,10%) scale(1.25,0.75)' },
          '28%': { transform: 'translate(0%,-240%) scale(0.75,1.25)' },
          '42%': { transform: 'translate(0%,-280%) scale(0.8,1.2)' },
          '50%': { transform: 'translate(0%,-300%) scale(0.9,1.1)' },
          '58%': { transform: 'translate(0%,-280%) scale(1,1)' },
          '72%': { transform: 'translate(0%,-240%) scale(1.1,0.9)' },
          '75%': { transform: 'translate(0%,35%) scale(1.3,0.7)' },
        },
        load3: {
          '40%, 100%': { transform: 'translate(0%,0%) scale(1.5.0.5)' },
          '45%': { transform: 'translate(0%,10%) scale(1.25,0.75)' },
          '48%': { transform: 'translate(0%,-240%) scale(0.75,1.25)' },
          '62%': { transform: 'translate(0%,-280%) scale(0.8,1.2)' },
          '70%': { transform: 'translate(0%,-300%) scale(0.9,1.1)' },
          '78%': { transform: 'translate(0%,-280%) scale(1,1)' },
          '92%': { transform: 'translate(0%,-240%) scale(1.1,0.9)' },
          '95%': { transform: 'translate(0%,35%) scale(1.3,0.7)' },
        },
      },
      animation: {
        wiggle: 'wiggle 1s',
        load1: 'load1 1s infinite',
        load2: 'load2 1s infinite',
        load3: 'load3 1s infinite',
      },
    },
  },
  plugins: [],
}
