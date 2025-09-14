/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}"
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        background: {
          primary: '#0B0C10',
          surface: '#121319',
          'surface-secondary': '#161821',
        },
        text: {
          primary: '#E8EAF0',
          secondary: '#B4B8C5',
        },
        accent: {
          primary: '#8A5CF6',
          secondary: '#22C55E',
          alert: '#EF4444',
        },
        border: '#232634',
      },
      borderRadius: {
        '2xl': '1rem',
      },
      fontFamily: {
        'system': ['System'],
      },
    },
  },
  plugins: [],
}