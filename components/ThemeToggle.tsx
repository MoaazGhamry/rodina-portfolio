"use client";

import { useTheme } from "./ThemeProvider";
import { Moon, Sun, Palette, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={toggleTheme}
      className="w-10 h-10 rounded-xl bg-blush/10 dark:bg-rose-gold/10 border border-blush/20 dark:border-rose-gold/20 flex items-center justify-center text-rose-gold transition-colors relative overflow-hidden"
      aria-label="Toggle theme"
    >
      <AnimatePresence mode="wait" initial={false}>
        {theme === "light" && (
          <motion.div
            key="sun"
            initial={{ y: 20, opacity: 0, rotate: -45 }}
            animate={{ y: 0, opacity: 1, rotate: 0 }}
            exit={{ y: -20, opacity: 0, rotate: 45 }}
            transition={{ duration: 0.3 }}
          >
            <Sun size={20} />
          </motion.div>
        )}
        {theme === "dark" && (
          <motion.div
            key="moon"
            initial={{ y: 20, opacity: 0, rotate: 45 }}
            animate={{ y: 0, opacity: 1, rotate: 0 }}
            exit={{ y: -20, opacity: 0, rotate: -45 }}
            transition={{ duration: 0.3 }}
          >
            <Moon size={20} />
          </motion.div>
        )}
        {theme === "rose" && (
          <motion.div
            key="rose"
            initial={{ y: 20, opacity: 0, scale: 0.8 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -20, opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
          >
            <Palette size={20} />
          </motion.div>
        )}
        {theme === "midnight" && (
          <motion.div
            key="midnight"
            initial={{ y: 20, opacity: 0, rotate: 180 }}
            animate={{ y: 0, opacity: 1, rotate: 0 }}
            exit={{ y: -20, opacity: 0, rotate: -180 }}
            transition={{ duration: 0.3 }}
          >
            <Sparkles size={20} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
