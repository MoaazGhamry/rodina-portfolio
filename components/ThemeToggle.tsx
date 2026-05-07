"use client";

import { useTheme } from "./ThemeProvider";
import { Moon, Sun } from "lucide-react";
import { motion } from "framer-motion";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={toggleTheme}
      className="p-3 rounded-2xl bg-white dark:bg-charcoal border border-blush/20 text-rose-gold shadow-sm hover:shadow-md transition-all flex items-center justify-center"
      aria-label="Toggle theme"
    >
      {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
    </motion.button>
  );
}
