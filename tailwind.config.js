/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: '#090A0F',
          surface: '#11121C',
          elevated: '#181926',
          overlay: '#1F2033',
        },
        kairo: {
          50: '#F5F3FF',
          100: '#EDE9FE',
          200: '#DDD6FE',
          300: '#C4B5FD',
          400: '#A78BFA',
          500: '#8B5CF6',
          600: '#7C3AED',
          700: '#6D28D9',
          800: '#5B21B6',
          900: '#4C1D95',
          accent: '#7C6EF8',
          glow: '#9D8FFF',
          neon: '#6366F1',
        },
        status: {
          online: '#10B981',
          offline: '#6B7280',
          idle: '#3B82F6',
          executing: '#8B5CF6',
          waiting: '#F59E0B',
          paused: '#EC4899',
          danger: '#EF4444',
          success: '#10B981',
        }
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      boxShadow: {
        'glow-sm': '0 0 15px rgba(124, 110, 248, 0.25)',
        'glow-md': '0 0 25px rgba(124, 110, 248, 0.4)',
        'glow-lg': '0 0 40px rgba(124, 110, 248, 0.6)',
        'glow-success': '0 0 20px rgba(16, 185, 129, 0.35)',
        'glow-warning': '0 0 20px rgba(245, 158, 11, 0.35)',
        'glow-danger': '0 0 20px rgba(239, 68, 68, 0.35)',
        'inner-glow': 'inset 0 1px 1px 0 rgba(255, 255, 255, 0.1)',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 4s ease-in-out infinite',
        'ripple': 'ripple 2s linear infinite',
        'spin-slow': 'spin 12s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        ripple: {
          '0%': { transform: 'scale(0.8)', opacity: '0.8' },
          '100%': { transform: 'scale(2.2)', opacity: '0' },
        }
      }
    },
  },
  plugins: [],
}
