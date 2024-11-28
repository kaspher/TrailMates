/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", 
    "./components/**/*.{js,jsx,ts,tsx}"
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: '#386641',
        secondary: '#294A2F',
        light: '#F2FAF4',
        dark: '#111111',
      },
      fontFamily: {
        light: 'Poppins_300Light',
        regular: 'Poppins_400Regular',
        bold: 'Poppins_700Bold',
      },
    },
  },
  plugins: [],
};