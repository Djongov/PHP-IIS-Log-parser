/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './src/**/*.{php,js}',
        './components/**/*.php',
        './functions/**/*.php'
    ],
    theme: {
        extend: {
            colors: {
                clifford: '#da373d',
            }
        }
    },
    plugins: [],
    darkMode: 'class',
}