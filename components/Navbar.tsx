"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

const links = [
  { label: "About", href: "#about" },
  { label: "Work", href: "#videos" },
  { label: "Gallery", href: "#gallery" },
  { label: "Contact", href: "#contact" },
];

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
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-16">
          {/* Logo */}
          <a
            href="#"
            className="font-serif-custom text-2xl font-bold text-gradient-rose tracking-wide"
            onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }}
          >
            R.H.S
          </a>

          {/* Desktop links */}
          <ul className="hidden md:flex items-center gap-8">
            {links.map((l) => (
              <li key={l.href}>
                <button
                  onClick={() => scrollTo(l.href)}
                  className="text-sm tracking-widest uppercase text-charcoal-light hover:text-rose-gold transition-colors duration-300 font-medium"
                >
                  {l.label}
                </button>
              </li>
            ))}
          </ul>

          {/* Desktop Toggle & Action */}
          <div className="hidden md:flex items-center gap-6">
            <ThemeToggle />
            <button
              onClick={() => scrollTo("#contact")}
              className="text-sm tracking-widest uppercase px-5 py-2 rounded-full border border-rose-gold text-rose-gold hover:bg-rose-gold hover:text-cream transition-all duration-300 font-medium"
            >
              Hire Me
            </button>
          </div>

          {/* Mobile hamburger & Toggle */}
          <div className="flex items-center gap-2 md:hidden">
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
            className="fixed top-16 inset-x-0 z-40 bg-cream/95 backdrop-blur-lg border-b border-blush/40 shadow-lg md:hidden"
          >
            <ul className="flex flex-col px-8 py-6 gap-5">
              {links.map((l) => (
                <li key={l.href}>
                  <button
                    onClick={() => scrollTo(l.href)}
                    className="text-base tracking-widest uppercase text-charcoal hover:text-rose-gold transition-colors w-full text-left font-medium"
                  >
                    {l.label}
                  </button>
                </li>
              ))}
              <li>
                <button
                  onClick={() => scrollTo("#contact")}
                  className="mt-2 w-full text-center text-sm tracking-widest uppercase px-5 py-3 rounded-full bg-rose-gold text-cream font-medium"
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
