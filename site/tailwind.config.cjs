/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      screens: {
        xs: '360px'
      },
      colors: {
        jaguar: {
          yellow: '#F2C94C',
          brown: '#5A3928',
          spot: '#3B2A20'
        }
      }
    }
  },
  plugins: []
}
