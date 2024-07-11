import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/pages/**/*.{ts,tsx}", "./src/components/**/*.{ts,tsx}"],
  theme: {
    screens: {
      mobile: "360px",
      desktop: "1366px",
    },
    colors: {
      inherit: "inherit",
      transparent: "transparent",
      current: "currentColor",
      neutral: {
        0: "hsl(var(--neutral-0), <alpha-value>)",
        25: "hsl(var(--neutral-25), <alpha-value>)",
        50: "hsl(var(--neutral-50), <alpha-value>)",
        100: "hsl(var(--neutral-100), <alpha-value>)",
        200: "hsl(var(--neutral-200), <alpha-value>)",
        300: "hsl(var(--neutral-300), <alpha-value>)",
        400: "hsl(var(--neutral-400), <alpha-value>)",
        500: "hsl(var(--neutral-500), <alpha-value>)",
        600: "hsl(var(--neutral-600), <alpha-value>)",
        700: "hsl(var(--neutral-700), <alpha-value>)",
        800: "hsl(var(--neutral-800), <alpha-value>)",
        900: "hsl(var(--neutral-900), <alpha-value>)",
        950: "hsl(var(--neutral-950), <alpha-value>)",
      },
    },
    extend: {
      fontFamily: {
        karla: ["var(--font-karla)", "sans-serif"],
        nunito: ["var(--font-nunito)", "sans-serif"],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        primary: {
          50: "hsl(var(--primary-50), <alpha-value>)",
          100: "hsl(var(--primary-100), <alpha-value>)",
          200: "hsl(var(--primary-200), <alpha-value>)",
          300: "hsl(var(--primary-300), <alpha-value>)",
          400: "hsl(var(--primary-400), <alpha-value>)",
          500: "hsl(var(--primary-500), <alpha-value>)",
          600: "hsl(var(--primary-600), <alpha-value>)",
        },
        secondary: {
          50: "hsl(var(--secondary-50), <alpha-value>)",
          100: "hsl(var(--secondary-100), <alpha-value>)",
          200: "hsl(var(--secondary-200), <alpha-value>)",
          300: "hsl(var(--secondary-300), <alpha-value>)",
          400: "hsl(var(--secondary-400), <alpha-value>)",
          500: "hsl(var(--secondary-500), <alpha-value>)",
          600: "hsl(var(--secondary-600), <alpha-value>)",
        },
        success: {
          50: "hsl(var(--success-50), <alpha-value>)",
          100: "hsl(var(--success-100), <alpha-value>)",
          200: "hsl(var(--success-200), <alpha-value>)",
          300: "hsl(var(--success-300), <alpha-value>)",
          400: "hsl(var(--success-400), <alpha-value>)",
          500: "hsl(var(--success-500), <alpha-value>)",
          600: "hsl(var(--success-600), <alpha-value>)",
        },
        warning: {
          50: "hsl(var(--warning-50), <alpha-value>)",
          100: "hsl(var(--warning-100), <alpha-value>)",
          200: "hsl(var(--warning-200), <alpha-value>)",
          300: "hsl(var(--warning-300), <alpha-value>)",
          400: "hsl(var(--warning-400), <alpha-value>)",
          500: "hsl(var(--warning-500), <alpha-value>)",
          600: "hsl(var(--warning-600), <alpha-value>)",
        },
        error: {
          50: "hsl(var(--error-50), <alpha-value>)",
          100: "hsl(var(--error-100), <alpha-value>)",
          200: "hsl(var(--error-200), <alpha-value>)",
          300: "hsl(var(--error-300), <alpha-value>)",
          400: "hsl(var(--error-400), <alpha-value>)",
          500: "hsl(var(--error-500), <alpha-value>)",
          600: "hsl(var(--error-600), <alpha-value>)",
        },
        tags: {
          red: "hsl(var(--tags-red), <alpha-value>)",
          orange: "hsl(var(--tags-orange), <alpha-value>)",
          yellow: "hsl(var(--error-yellow), <alpha-value>)",
          pink: "hsl(var(--tags-pink), <alpha-value>)",
          purple: "hsl(var(--tags-purple), <alpha-value>)",
          blue: "hsl(var(--tags-blue), <alpha-value>)",
          lightGreen: "hsl(var(--tags-light-green), <alpha-value>)",
          green: "hsl(var(--tags-green), <alpha-value>)",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      boxShadow: {
        xs: "inset 0px 4px 8px 0px rgba(0, 0, 0, 0.2)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;
