/** @type {import('tailwindcss').Config} */
import defaultTheme from "tailwindcss/defaultTheme";

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f5f3ff",
          100: "#ede9fe",
          200: "#ddd6fe",
          300: "#c4b5fd",
          400: "#a78bfa",
          500: "#8b5cf6",
          600: "#7c3aed",
          700: "#6d28d9",
          800: "#5b21b6",
          900: "#4c1d95",
          950: "#2e1065",
        },
        surface: {
          50: "#f8fafc",
          100: "#f1f5f9",
          200: "#e2e8f0",
        },
        text: {
          base: "#0f172a",
          muted: "#475569",
        },
        accent: "#06b6d4",
        danger: "#dc2626",
        success: "#16a34a",
        warning: "#f59e0b",
        "sidebar-bg": "#0b1220",
        "sidebar-border": "#151b2e",
        "sidebar-hover": "#111a32",
      },
      fontFamily: {
        sans: ["Plus Jakarta Sans", ...defaultTheme.fontFamily.sans],
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
