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
      },
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
