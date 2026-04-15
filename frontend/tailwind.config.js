/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b'
        },
        surface: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0'
        },
        text: {
          base: '#0f172a',
          muted: '#475569'
        },
        accent: '#10b981',
        danger: '#ef4444',
        success: '#22c55e',
        warning: '#eab308',
        'sidebar-bg': '#06281c',
        'sidebar-border': '#0b3d2a',
        'sidebar-hover': '#083522',
      },
      boxShadow: {
        soft: '0 6px 16px rgba(0,0,0,0.06)',
      },
      borderRadius: {
        xl: '0.9rem',
      }
    },
  },
  plugins: [],
}
