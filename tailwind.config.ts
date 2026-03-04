import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: {
          primary: "#080b14",
          secondary: "#0d1117",
          card: "#111827",
        },
        accent: {
          primary: "#6366f1",
          secondary: "#a855f7",
          gold: "#f59e0b",
        },
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        heading: ["Outfit", "sans-serif"],
      },
      animation: {
        "fade-in-up": "fadeInUp 0.6s ease forwards",
        "fade-in": "fadeIn 0.4s ease forwards",
        "bounce-in": "bounceIn 0.5s ease forwards",
      },
      keyframes: {
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        bounceIn: {
          "0%": { opacity: "0", transform: "scale(0.8)" },
          "50%": { transform: "scale(1.05)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
