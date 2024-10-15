/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./src/**/*.{html,js,jsx}', './public/index.html'],
    theme: {
        extend: {},
        backgroundImage:{
            '404': "url(/src/assets/img/404_1.png)",
        }
    },
    plugins: [require('@tailwindcss/forms')],
}