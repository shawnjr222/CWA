/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
         screens: {
           'mobile': {'max': '768px'},
           'desktop-split-2': {'min': '574px', 'max': '1023px'},
           'tablet': {'min': '1024px', 'max': '1366px'},
           'desktop-all': {'min': '1367px'},
           'desktop-portrait': {'min': '1367px', 'orientation': 'portrait'},
         },
      fontFamily: {
        'sans': ['Cutive Mono', 'monospace'],
        'mono': ['Cutive Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}