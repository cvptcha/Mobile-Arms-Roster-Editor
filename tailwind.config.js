module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      boxShadow: {
    aberration: '0 0 0.5px red, 0 0 1px lime, 0 0 1.5px blue',
    },
      fontFamily: {
        straczynski: ['straczynski', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 1s ease-out',
        'glitch': 'glitch 0.4s infinite',
        'flicker': 'flicker 1.5s infinite',
        'bloom': 'bloom 6s ease-in-out infinite',
      },
      keyframes: {
        bloom: {
          '0%, 100%': { filter: 'brightness(1)' },
          '50%': { filter: 'brightness(1.05)' },
        },
        flicker: {
          '0%, 100%': { opacity: '0.12' },
          '50%': { opacity: '0.18' },
          '80%': { opacity: '0.05' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        glitch: {
          '0%, 100%': { transform: 'none' },
          '20%': { transform: 'translate(1px, 0)' },
          '40%': { transform: 'translate(-1px, 0)' },
          '60%': { transform: 'translate(2px, 1px)' },
          '80%': { transform: 'translate(-2px, -1px)' },
        },
      }
    },
  },
  plugins: [],
}
