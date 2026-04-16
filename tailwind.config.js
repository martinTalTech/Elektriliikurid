/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Montserrat', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#f4f9ef',
          100: '#e4f2d5',
          300: '#a4d974',
          400: '#8bcc50',
          500: '#73bb3c',
          600: '#5b9b2e',
          700: '#477c23',
          800: '#365f1c',
          900: '#264316',
        },
        dark: {
          darkest: '#191923',
          dark:    '#1e1e2a',
          medium:  '#23232f',
          light:   '#2c2c38',
          lighter: '#333341',
        },
        surface: {
          DEFAULT: '#23232f',
          hover:   '#2c2c38',
          border:  '#333341',
        },
        muted: {
          DEFAULT: '#9898a8',
          light:   '#bdbdc7',
        }
      },
      boxShadow: {
        card: '0 2px 12px rgba(0,0,0,0.4)',
        'card-hover': '0 6px 24px rgba(0,0,0,0.6)',
      }
    },
  },
  plugins: [],
}
