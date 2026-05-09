"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { Menu, X } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

const links = [
  { label: "About", href: "#about" },
  { label: "Work", href: "#videos" },
  { label: "Moments", href: "#moments" },
  { label: "Gallery", href: "#gallery" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(true);
  const [open, setOpen] = useState(false);
  const { scrollY } = useScroll();
  const lastScrollY = useRef(0);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const direction = latest - lastScrollY.current;
    if (latest > 100 && direction > 10) {
      setVisible(false);
    } else if (direction < -10) {
      setVisible(true);
    }
    setScrolled(latest > 40);
    lastScrollY.current = latest;
  });

  const scrollTo = (href: string) => {
    setOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <motion.nav
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={0.1}
        initial={{ y: -80, opacity: 0 }}
        animate={{ 
          y: visible ? 0 : -100, 
          opacity: visible ? 1 : 0 
        }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-500 ${
          scrolled || open
            ? "bg-white/70 dark:bg-charcoal/70 backdrop-blur-xl border-b border-rose-gold/20 shadow-lg"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-20">
          {/* Logo */}
          <a
            href="#"
            className="font-serif-custom text-2xl font-bold text-gradient-rose tracking-wide"
            onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }}
          >
            R.H.S
          </a>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8">
            <ul className="flex items-center gap-8">
              {links.map((l) => (
                <li key={l.href}>
                  <button
                    onClick={() => scrollTo(l.href)}
                    className="text-[10px] tracking-[0.2em] uppercase text-charcoal-light dark:text-white/70 hover:text-rose-gold dark:hover:text-rose-gold transition-colors duration-300 font-bold"
                  >
                    {l.label}
                  </button>
                </li>
              ))}
            </ul>
            <div className="flex items-center gap-4 border-l border-blush/30 dark:border-white/10 pl-8">
              <ThemeToggle />
              <button
                onClick={() => scrollTo("#contact")}
                className="text-[10px] tracking-[0.2em] uppercase px-6 py-3 rounded-full bg-rose-gold text-white hover:shadow-lg hover:shadow-rose-gold/30 transition-all duration-300 font-bold"
              >
                Hire Me
              </button>
            </div>
          </div>

          {/* Mobile Right */}
          <div className="flex md:hidden items-center gap-4">
            <ThemeToggle />
            <button
              className="text-charcoal dark:text-white p-2"
              onClick={() => setOpen(!open)}
              aria-label="Toggle menu"
            >
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="fixed top-20 inset-x-0 z-40 bg-white/95 dark:bg-charcoal/95 backdrop-blur-xl border-b border-rose-gold/20 shadow-2xl md:hidden overflow-hidden"
          >
            <ul className="flex flex-col px-8 py-10 gap-6">
              {links.map((l, i) => (
                <motion.li 
                  key={l.href}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <button
                    onClick={() => scrollTo(l.href)}
                    className="text-sm tracking-[0.2em] uppercase text-charcoal dark:text-white hover:text-rose-gold transition-colors w-full text-left font-bold"
                  >
                    {l.label}
                  </button>
                </motion.li>
              ))}
              <motion.li 
                className="pt-6 border-t border-rose-gold/10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <button
                  onClick={() => scrollTo("#contact")}
                  className="w-full text-center text-xs tracking-[0.2em] uppercase px-5 py-5 rounded-full bg-rose-gold text-white font-bold shadow-xl shadow-rose-gold/20"
                >
                  Hire Me
                </button>
              </motion.li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
