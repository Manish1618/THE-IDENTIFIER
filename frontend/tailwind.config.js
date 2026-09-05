export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        'neon-cyan': '#00ffc8',
        'neon-emerald': '#10b981',
        'neon-purple': '#a855f7',
        'neon-pink': '#ec4899',
        'cyber-dark': '#0a0e27',
        'cyber-darker': '#050810',
      },
      boxShadow: {
        'neon-sm': '0 0 5px currentColor',
        'neon-md': '0 0 10px currentColor, 0 0 20px currentColor',
        'neon-lg': '0 0 10px currentColor, 0 0 20px currentColor, 0 0 40px currentColor',
      },
      animation: {
        'pulse-neon': 'pulse-neon 2s ease-in-out infinite',
        'scan-vertical': 'scan-vertical 4s linear infinite',
        'glitch': 'glitch 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) both infinite',
        'data-stream': 'data-stream 8s linear infinite',
      },
      keyframes: {
        'pulse-neon': {
          '0%, 100%': { opacity: '1', filter: 'drop-shadow(0 0 10px currentColor) drop-shadow(0 0 20px currentColor)' },
          '50%': { opacity: '0.7', filter: 'drop-shadow(0 0 5px currentColor)' },
        },
        'scan-vertical': {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        'glitch': {
          '0%, 100%': { transform: 'translate(0)' },
          '20%': { transform: 'translate(-2px, 2px)' },
          '40%': { transform: 'translate(-2px, -2px)' },
          '60%': { transform: 'translate(2px, 2px)' },
          '80%': { transform: 'translate(2px, -2px)' },
        },
        'data-stream': {
          '0%': { transform: 'translateY(-100%)', opacity: '0' },
          '10%': { opacity: '1' },
          '90%': { opacity: '1' },
          '100%': { transform: 'translateY(100vh)', opacity: '0' },
        },
      },
    },
  },
  plugins: [],
}
