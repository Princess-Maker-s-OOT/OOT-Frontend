const { fontFamily } = require("tailwindcss/defaultTheme")

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx,js,jsx,mdx}",
    "./components/**/*.{ts,tsx,js,jsx,mdx}",
    "./lib/**/*.{ts,tsx,js,jsx,mdx}",
    "./hooks/**/*.{ts,tsx,js,jsx,mdx}",
    "./schemas/**/*.{ts,tsx,js,jsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "oklch(var(--border-color) / <alpha-value>)",
        input: "oklch(var(--input-color) / <alpha-value>)",
        ring: "oklch(var(--ring-color) / <alpha-value>)",
        background: "oklch(var(--background-color) / <alpha-value>)",
        foreground: "oklch(var(--foreground-color) / <alpha-value>)",
        primary: {
          DEFAULT: "oklch(var(--primary-color) / <alpha-value>)",
          foreground: "oklch(var(--primary-foreground-color) / <alpha-value>)",
        },
        secondary: {
          DEFAULT: "oklch(var(--secondary-color) / <alpha-value>)",
          foreground: "oklch(var(--secondary-foreground-color) / <alpha-value>)",
        },
        destructive: {
          DEFAULT: "oklch(var(--destructive-color) / <alpha-value>)",
          foreground: "oklch(var(--destructive-foreground-color) / <alpha-value>)",
        },
        muted: {
          DEFAULT: "oklch(var(--muted-color) / <alpha-value>)",
          foreground: "oklch(var(--muted-foreground-color) / <alpha-value>)",
        },
        accent: {
          DEFAULT: "oklch(var(--accent-color) / <alpha-value>)",
          foreground: "oklch(var(--accent-foreground-color) / <alpha-value>)",
        },
        popover: {
          DEFAULT: "oklch(var(--popover-color) / <alpha-value>)",
          foreground: "oklch(var(--popover-foreground-color) / <alpha-value>)",
        },
        card: {
          DEFAULT: "oklch(var(--card-color) / <alpha-value>)",
          foreground: "oklch(var(--card-foreground-color) / <alpha-value>)",
        },
        "oot-sky": {
          50: "#f8fafc",
          100: "#eef8ff",
          200: "#dff4ff",
          300: "#cbefff",
          400: "#9fe6ff",
          accent: "#9ad7f5",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", ...fontFamily.sans],
        mono: ["var(--font-mono)", ...fontFamily.mono],
        cute: ['"Poor Story"', "cursive"],
        pen: ['"Nanum Pen Script"', "cursive"],
        dodum: ['"Gowun Dodum"', "sans-serif"],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
