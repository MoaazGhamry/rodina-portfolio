import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: "var(--background)",
        "blush-light": "var(--blush-light)",
        blush: "var(--blush)",
        "blush-dark": "#DBA4B0",
        rose: "#C9848F",
        "rose-gold": "#B8727D",
        "rose-deep": "#8C4A54",
        beige: "#F0E0D3",
        charcoal: "var(--foreground)",
        "charcoal-light": "var(--foreground)",
        muted: "#94A3B8",
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
        "bounce-slow": {
          "0%, 100%": { transform: "translateY(0)", animationTimingFunction: "cubic-bezier(0.8,0,1,1)" },
          "50%": { transform: "translateY(-20px)", animationTimingFunction: "cubic-bezier(0,0,0.2,1)" },
        },
        "spin-slow": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
      },
      animation: {
        float: "float 7s ease-in-out infinite",
        "float-slow": "float-slow 11s ease-in-out infinite",
        "float-xs": "float 5s ease-in-out infinite 1.5s",
        shimmer: "shimmer 3s linear infinite",
        "fade-up": "fadeUp 0.8s ease forwards",
        "bounce-slow": "bounce-slow 3s ease-in-out infinite",
        "spin-slow": "spin-slow 8s linear infinite",
      },
    },
  },
  safelist: [
    "col-span-1", "col-span-2",
    "row-span-1", "row-span-2",
    "md:col-span-1", "md:col-span-2",
    "md:row-span-1", "md:row-span-2",
  ],
  plugins: [],
};

export default config;
