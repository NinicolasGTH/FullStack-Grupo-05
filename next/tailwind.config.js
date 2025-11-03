/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        cp: {
          bg: '#070713',
          panel: '#0e0e1f',
          magenta: '#ff2bd1',
          cyan: '#10f0ff',
          yellow: '#ffe600',
        },
      },
      dropShadow: {
        neon: ['0 0 6px #ff2bd1', '0 0 12px #10f0ff'],
      },
      boxShadow: {
        neon: '0 0 10px rgba(16,240,255,0.25), 0 0 24px rgba(255,43,209,0.18)'
      },
      fontFamily: {
        display: ['Orbitron', 'Rajdhani', 'system-ui', 'sans-serif'],
        sans: ['Rajdhani', 'system-ui', 'sans-serif'],
      },
      animation: {
        gridshift: 'gridshift 20s linear infinite',
        scan: 'scan 8s linear infinite',
        glitch: 'glitch 1.25s infinite',
      },
      keyframes: {
        gridshift: {
          '0%': { backgroundPosition: '0 0, 0 0' },
          '100%': { backgroundPosition: '200px 0, 0 200px' },
        },
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
        glitch: {
          '0%': { clipPath: 'inset(0 0 0 0)' },
          '10%': { clipPath: 'inset(10% 0 15% 0)' },
          '20%': { clipPath: 'inset(0 0 20% 0)' },
          '30%': { clipPath: 'inset(15% 0 5% 0)' },
          '40%': { clipPath: 'inset(5% 0 12% 0)' },
          '50%': { clipPath: 'inset(0 0 0 0)' },
          '60%': { clipPath: 'inset(12% 0 18% 0)' },
          '70%': { clipPath: 'inset(0 0 22% 0)' },
          '80%': { clipPath: 'inset(18% 0 8% 0)' },
          '90%': { clipPath: 'inset(7% 0 14% 0)' },
          '100%': { clipPath: 'inset(0 0 0 0)' },
        },
      },
    },
  },
  plugins: [],
};
