/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './config/*.json',
    './layout/*.liquid',
    './assets/*.liquid', 
    './sections/*.liquid', 
    './snippets/*.liquid',
    './templates/*.liquid', 
    './templates/*.json', 
    '/templates/customers/*.liquid',
    '/templates/customers/*.json'
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

