const { colors } = require('tailwindcss/defaultTheme')

module.exports = {
  theme: {
    extend: {
      colors: {
        blue: {
          ...colors.blue,
          sky: '#0af',
        },
      },
      height: {
        content: 'calc(100vh - 200px);'
      },
      minHeight: {
        '0': '0',
        '1/4': '25%',
        '1/2': '50%',
        '3/4': '75%',
        'full': '100%',
        '555': '555px'
      },
      maxHeight: {
        '0': '0',
        '1/4': '25%',
        '1/2': '50%',
        '3/4': '75%',
        full: '100%',
      },
      transitionProperty: {
        height: 'height',
        maxHeight: 'max-height',
        spacing: 'margin, padding',
      },
      screens: {
        'print': { 'raw': 'print' },
      }
    },
  },
}
