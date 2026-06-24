/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        violet: { DEFAULT: '#7C3AED', light: '#A855F7' },
        gold: '#FBBF24',
        emerald: '#10B981',
        rose: '#F43F5E',
        sky: '#0EA5E9',
        deep: '#0F0A1E',
      },
      fontFamily: {
        sans: ['Nunito', 'system-ui', 'sans-serif'],
        logo: ['"Fredoka One"', 'Nunito', 'cursive'],
      },
      borderRadius: { card: '18px' },
    },
  },
  plugins: [],
}
