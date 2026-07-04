/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        lapochka: {
          yellow: '#F5C842',
          orange: '#FF6B35',
          cream: '#FFFDF0',
          dark: '#1A1A1A',
        }
      },
      fontFamily: {
        sans: ['Nunito', 'Inter', 'sans-serif'],
      }
    }
  },
  plugins: []
}
