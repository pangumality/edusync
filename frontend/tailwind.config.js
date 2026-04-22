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
          50: "#eef7ff",
          100: "#d9efff",
          200: "#b9e2ff",
          300: "#89d0ff",
          400: "#52b5ff",
          500: "#2490ff",
          600: "#1670f2",
          700: "#1358d2",
          800: "#1447a6",
          900: "#153c85",
          950: "#0c2047",
        },
        surface: {
          50: "#f4f7fb",
          100: "#eef3fa",
          200: "#dfe8f4",
        },
        text: {
          base: "#0f172a",
          muted: "#475569",
        },
        accent: "#f6b01e",
        danger: "#dc2626",
        success: "#16a34a",
        warning: "#f59e0b",
        "sidebar-bg": "#1447a6",
        "sidebar-bg-2": "#1670f2",
        "sidebar-border": "rgba(255,255,255,0.10)",
        "sidebar-hover": "rgba(255,255,255,0.10)",
      },
      fontFamily: {
        sans: ["Poppins", ...defaultTheme.fontFamily.sans],
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
