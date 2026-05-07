import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: 'class',
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: "rgb(var(--bg-cream) / <alpha-value>)",
        blush: "rgb(var(--blush) / <alpha-value>)",
        "rose-gold": "rgb(var(--rose-gold) / <alpha-value>)",
        charcoal: "rgb(var(--text-charcoal) / <alpha-value>)",
        "charcoal-light": "rgb(var(--charcoal-light) / <alpha-value>)",
        muted: "rgb(var(--text-muted) / <alpha-value>)",
      },
      fontFamily: {
        serif: ["var(--font-playfair)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
          "33%": { transform: "translateY(-18px) rotate(2deg)" },
          "66%": { transform: "translateY(-8px) rotate(-1deg)" },
        },
        "float-slow": {
          "0%, 100%": { transform: "translateY(0px) scale(1)" },
          "50%": { transform: "translateY(-25px) scale(1.04)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% center" },
          "100%": { backgroundPosition: "200% center" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        float: "float 7s ease-in-out infinite",
        "float-slow": "float-slow 11s ease-in-out infinite",
        "float-xs": "float 5s ease-in-out infinite 1.5s",
        shimmer: "shimmer 3s linear infinite",
        "fade-up": "fadeUp 0.8s ease forwards",
      },
    },
  },
  plugins: [],
};

export default config;
