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
          50: "#e7fbff",
          100: "#c8f6ff",
          200: "#9aebf5",
          300: "#63dde9",
          400: "#33cfe0",
          500: "#14b3c6",
          600: "#0a93a7",
          700: "#087487",
          800: "#065a6b",
          900: "#054856",
          950: "#032d36",
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
        accent: "#33cfe0",
        danger: "#dc2626",
        success: "#16a34a",
        warning: "#f59e0b",
        "sidebar-bg": "#0a93a7",
        "sidebar-bg-mid": "#14b3c6",
        "sidebar-bg-2": "#33cfe0",
        "sidebar-border": "rgba(255,255,255,0.14)",
        "sidebar-hover": "rgba(255,255,255,0.12)",
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
