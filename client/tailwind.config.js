/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        neon: {
          pink: '#ff00ff',
          cyan: '#00fff7',
          yellow: '#ffea00',
        }
      }
    },
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: ['cyberpunk']
  }
}
