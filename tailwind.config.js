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
          DEFAULT: '#000000',
          100: '#0A0A0A',
          200: '#111111',
          300: '#171717',
          400: '#1F1F1F',
        },
        geist: {
          foreground: '#EDEDED',
          muted: '#888888',
          subtle: '#666666',
          border: '#242424',
          'border-light': '#333333',
          card: '#0A0A0A',
          'card-hover': '#121212',
          blue: '#0070F3',
          cyan: '#00DFD8',
          purple: '#7928CA',
          pink: '#FF0080',
          amber: '#F5A623',
          emerald: '#00E599',
          red: '#FF0000',
        },
        vercel: {
          black: '#000000',
          gray1: '#111111',
          gray2: '#222222',
          gray3: '#333333',
          gray4: '#444444',
          gray5: '#666666',
          gray6: '#888888',
          gray7: '#A1A1A1',
          gray8: '#EDEDED',
          white: '#FFFFFF',
          blue: '#0070F3',
          cyan: '#00DFD8',
          gradient1: '#7928CA',
          gradient2: '#FF0080',
        }
      },
      fontFamily: {
        sans: ['Geist', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['Geist Mono', 'JetBrains Mono', 'Fira Code', 'monospace'],
      },
      boxShadow: {
        'vercel-sm': '0 0 0 1px rgba(255, 255, 255, 0.12)',
        'vercel-md': '0 0 0 1px rgba(255, 255, 255, 0.16), 0 8px 30px rgba(0, 0, 0, 0.6)',
        'vercel-lg': '0 0 0 1px rgba(255, 255, 255, 0.2), 0 20px 40px rgba(0, 0, 0, 0.8)',
        'vercel-glow': '0 0 20px rgba(255, 255, 255, 0.15)',
        'vercel-blue': '0 0 25px rgba(0, 112, 243, 0.35)',
        'vercel-cyan': '0 0 25px rgba(0, 223, 216, 0.35)',
        'vercel-purple': '0 0 30px rgba(121, 40, 202, 0.4)',
      },
      letterSpacing: {
        tighter: '-0.04em',
        tight: '-0.02em',
      }
    },
  },
  plugins: [],
}
