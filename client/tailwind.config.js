/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors:{
        'custom1': '#b3cde0',
        'custom2': '#6497b1',
        'custom3': '#005b96',
        'custom4': '#03396c',
        'custom5': '#011f4b',
      }
    },
  },
  plugins: [],
}

// #011f4b	(1,31,75)
// #03396c	(3,57,108)
// #005b96	(0,91,150)
// #6497b1	(100,151,177)
// #b3cde0	(179,205,224)
