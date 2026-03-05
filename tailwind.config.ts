import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: "#080b14",
          secondary: "#0d1117",
          card: "#111827",
          "card-hover": "#1a2235",
          glass: "rgba(17, 24, 39, 0.8)",
        },
        accent: {
          primary: "#6366f1",
          secondary: "#a855f7",
          gold: "#f59e0b",
          emerald: "#10b981",
          rose: "#f43f5e",
        },
        text: {
          primary: "#f1f5f9",
          secondary: "#94a3b8",
          muted: "#475569",
        },
        border: {
          subtle: "rgba(99, 102, 241, 0.15)",
          card: "rgba(255, 255, 255, 0.06)",
        },
      },
      backgroundImage: {
        "gradient-primary": "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
        "gradient-gold": "linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)",
        "gradient-emerald": "linear-gradient(135deg, #10b981 0%, #06b6d4 100%)",
        "gradient-rose": "linear-gradient(135deg, #f43f5e 0%, #ec4899 100%)",
        "gradient-bg": "linear-gradient(135deg, #080b14 0%, #0d1117 50%, #080b14 100%)",
        "skeleton-glow": "linear-gradient(90deg, rgba(255, 255, 255, 0.04) 25%, rgba(255, 255, 255, 0.08) 50%, rgba(255, 255, 255, 0.04) 75%)",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        heading: ["Outfit", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 40px rgba(99, 102, 241, 0.15)",
        card: "0 4px 24px rgba(0, 0, 0, 0.4)",
        purple: "0 8px 32px rgba(168, 85, 247, 0.2)",
      },
      gridTemplateColumns: {
        "auto-fit": "repeat(auto-fit, minmax(240px, 1fr))",
        "auto-fill-160": "repeat(auto-fill, minmax(160px, 1fr))",
        "auto-fill-100": "repeat(auto-fill, minmax(100px, 1fr))",
      },
      animation: {
        "fade-in-up": "fadeInUp 0.6s ease forwards",
        "fade-in": "fadeIn 0.4s ease forwards",
        "bounce-in": "bounceIn 0.5s ease forwards",
        shimmer: "shimmer 1.8s ease-in-out infinite",
        "pulse-glow": "pulse-glow 2s infinite",
        "float-orb1": "floatOrb1 20s ease-in-out infinite",
        "float-orb2": "floatOrb2 25s ease-in-out infinite",
        "dot-bounce": "dotBounce 1.2s ease-in-out infinite",
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
        shimmer: {
          "0%": { backgroundPosition: "200% 0" },
          "100%": { backgroundPosition: "-200% 0" },
        },
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 20px rgba(99, 102, 241, 0.2)" },
          "50%": { boxShadow: "0 0 40px rgba(99, 102, 241, 0.4)" },
        },
        floatOrb1: {
          "0%, 100%": { transform: "translate(0, 0) scale(1)" },
          "33%": { transform: "translate(30px, 30px) scale(1.05)" },
          "66%": { transform: "translate(-20px, 20px) scale(0.98)" },
        },
        floatOrb2: {
          "0%, 100%": { transform: "translate(0, 0) scale(1)" },
          "33%": { transform: "translate(-30px, -20px) scale(1.03)" },
          "66%": { transform: "translate(20px, -30px) scale(0.97)" },
        },
        dotBounce: {
          "0%, 80%, 100%": { transform: "scale(0.6)", opacity: "0.4" },
          "40%": { transform: "scale(1)", opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
