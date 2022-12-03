/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './src/**/*.php',
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