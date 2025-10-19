/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          900: '#0c4a6e',
        },
        islamic: {
          green: '#0d9488',
          gold: '#d97706',
          blue: '#1e40af',
        }
      },
      fontFamily: {
        arabic: ['SF Arabic', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-islamic': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'gradient-gold': 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
        'gradient-green': 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      }
    },
  },
  plugins: [],
}