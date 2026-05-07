"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

const links = [
  { label: "About", href: "#about" },
  { label: "Work", href: "#videos" },
  { label: "Gallery", href: "#gallery" },
  { label: "Contact", href: "#contact" },
];

import { ThemeToggle } from "./ThemeToggle";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const scrollTo = (href: string) => {
    setOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-cream/80 backdrop-blur-md border-b border-blush/30 shadow-sm"
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
                    className="text-[10px] tracking-[0.2em] uppercase text-charcoal-light hover:text-rose-gold transition-colors duration-300 font-bold"
                  >
                    {l.label}
                  </button>
                </li>
              ))}
            </ul>
            <div className="flex items-center gap-4 border-l border-blush/30 pl-8">
              <ThemeToggle />
              <button
                onClick={() => scrollTo("#contact")}
                className="text-[10px] tracking-[0.2em] uppercase px-6 py-3 rounded-full bg-rose-gold text-cream hover:shadow-lg hover:shadow-rose-gold/20 transition-all duration-300 font-bold"
              >
                Hire Me
              </button>
            </div>
          </div>

          {/* Mobile Right */}
          <div className="flex md:hidden items-center gap-4">
            <ThemeToggle />
            <button
              className="text-charcoal p-2"
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
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed top-20 inset-x-0 z-40 bg-cream/95 backdrop-blur-lg border-b border-blush/40 shadow-lg md:hidden"
          >
            <ul className="flex flex-col px-8 py-8 gap-6">
              {links.map((l) => (
                <li key={l.href}>
                  <button
                    onClick={() => scrollTo(l.href)}
                    className="text-xs tracking-[0.2em] uppercase text-charcoal hover:text-rose-gold transition-colors w-full text-left font-bold"
                  >
                    {l.label}
                  </button>
                </li>
              ))}
              <li className="pt-4 border-t border-blush/20">
                <button
                  onClick={() => scrollTo("#contact")}
                  className="w-full text-center text-xs tracking-[0.2em] uppercase px-5 py-4 rounded-full bg-rose-gold text-white font-bold shadow-lg shadow-rose-gold/20"
                >
                  Hire Me
                </button>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
