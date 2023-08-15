/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{html,js}",
    "./src/**/*.{js,ts,jsx,tsx}",
    'node_modules/preline/dist/*.js',
    'node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}',
  ],

  theme: {
    extend: {},
  },
  
  plugins: [
    require('preline/plugin'),
    require('tailwind-scrollbar-hide'),
    require('flowbite/plugin'),
  ],
  
}

