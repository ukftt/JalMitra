/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // Deep water ink — primary chrome, nav, headers
        ink: {
          900: '#0B2545',
          800: '#11315C',
          700: '#1A4170',
          600: '#2C5282',
        },
        // Cool near-white surface — page backgrounds
        surface: {
          50: '#F7FAFC',
          100: '#EDF2F7',
          200: '#E2E8F0',
        },
        // Signal teal — primary actions, "clean water" state
        signal: {
          600: '#0E7C7B',
          500: '#129E9D',
          400: '#3BBAB9',
          100: '#E1F5F4',
        },
        // Hazard amber — in-progress / acknowledged
        hazard: {
          700: '#92400E',
          600: '#D97706',
          500: '#F59E0B',
          100: '#FEF3DC',
        },
        // Alert coral — open / unresolved issues (warmer than pure red)
        alert: {
          700: '#9A2D0F',
          600: '#C2410C',
          500: '#E25A22',
          100: '#FDECE3',
        },
        // Confirmed green — resolved
        confirmed: {
          700: '#166534',
          600: '#15803D',
          500: '#22A35A',
          100: '#E5F7EB',
        },
      },
      fontFamily: {
        // Tight-tracked display face — used like municipal signage lettering
        display: ['"Archivo Expanded"', '"Arial Narrow"', 'sans-serif'],
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"Courier New"', 'monospace'],
      },
      letterSpacing: {
        tightest: '-0.04em',
        wideish: '0.04em',
      },
      boxShadow: {
        gauge: '0 1px 2px rgba(11,37,69,0.06), 0 8px 24px rgba(11,37,69,0.10)',
        glass: '0 4px 30px rgba(11,37,69,0.12)',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};