/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        space: {
          dark: '#030712',
          navy: '#0a0f2e',
          blue: '#0d1b4b',
          accent: '#1e3a8a',
        },
        astro: {
          cyan: '#00d4ff',
          green: '#00ff88',
          amber: '#ffb300',
          red: '#ff4444',
          purple: '#8b5cf6',
        }
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Courier New', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 8s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        glow: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        }
      },
      backgroundImage: {
        'starfield': 'radial-gradient(ellipse at 20% 50%, #1a1a4e 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, #0d1b4b 0%, transparent 50%), linear-gradient(to bottom, #030712 0%, #0a0f2e 100%)',
      }
    },
  },
  plugins: [],
}

