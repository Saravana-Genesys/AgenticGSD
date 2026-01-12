/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Genesys Brand Colors
        'genesys-orange': '#FF4F1F',
        'genesys-orange-light': '#FF6B3D',
        'genesys-orange-dark': '#E54418',
        'genesys-coral': '#FF7D5C',
        
        // Dark Theme
        'dark-bg': '#0D0D0D',
        'dark-secondary': '#1A1A1A',
        'dark-accent': '#252525',
        'dark-border': '#333333',
        
        // Agent Colors
        'agent-ram': '#FF4F1F',     // Genesys Orange for L1
        'agent-sam': '#FF7D5C',     // Coral for L2
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'wave': 'wave 1.5s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite',
      },
      keyframes: {
        wave: {
          '0%, 100%': { transform: 'scaleY(0.5)' },
          '50%': { transform: 'scaleY(1)' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(255, 79, 31, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(255, 79, 31, 0.6)' },
        },
      },
    },
  },
  plugins: [],
}
