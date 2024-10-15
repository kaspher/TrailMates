/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./src/**/*.{html,js,jsx}', './public/index.html'],
    theme: {
        extend: {
            backgroundImage: {
                '404-sky': "url('/src/assets/img/404_sky.svg')",
                '404-forest': "url('/src/assets/img/404_forest.svg')",
                '404-background': "url('/src/assets/img/404_1.png')"
            }
        },
    },
    plugins: [require('@tailwindcss/forms')],
}
