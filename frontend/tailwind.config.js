/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx}", "./public/index.html"],
  theme: {
    extend: {
      backgroundImage: {
        "404-sky": "url('/src/assets/img/404/404_sky.svg')",
        "404-forest": "url('/src/assets/img/404/404_forest.svg')",
        "404-background": "url('/src/assets/img/404/404_1.png')",
      },
      colors: {
        primary: "#386641",
        secondary: "#111111",
        background: "#f2faf4",
        "hover-background": "#214d29",
        "hover-text": "#fff",
        "custom-green": "#356740"
      },
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
      },
      keyframes: {
        'fade-in-down': {
          '0%': {
            opacity: '0',
            transform: 'translateY(-20px)'
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)'
          },
        }
      },
      animation: {
        'fade-in-down': 'fade-in-down 1s ease-out'
      }
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
