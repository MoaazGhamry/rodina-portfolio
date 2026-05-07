"use client";

import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

const orbs = [
  { size: 420, x: "70%", y: "10%", duration: 15 },
  { size: 280, x: "5%", y: "55%", duration: 12 },
  { size: 180, x: "80%", y: "65%", duration: 18 },
  { size: 120, x: "40%", y: "80%", duration: 10 },
  { size: 60,  x: "15%", y: "15%", duration: 9 },
];

const accents = [
  { type: "lily", size: 80, x: "10%", y: "20%", duration: 6, delay: 0, rotate: -15 },
  { type: "heart", size: 60, x: "85%", y: "15%", duration: 8, delay: 1, rotate: 12 },
  { type: "lily", size: 40, x: "20%", y: "75%", duration: 7, delay: 2, rotate: 20 },
  { type: "heart", size: 100, x: "5%", y: "85%", duration: 10, delay: 0, rotate: -5 },
  { type: "lily", size: 50, x: "75%", y: "80%", duration: 9, delay: 3, rotate: 10 },
  { type: "heart", size: 30, x: "40%", y: "10%", duration: 6, delay: 4, rotate: -30 },
  { type: "lily", size: 35, x: "90%", y: "50%", duration: 11, delay: 0.5, rotate: 45 },
  { type: "heart", size: 45, x: "60%", y: "90%", duration: 8.5, delay: 2.5, rotate: -10 },
  { type: "lily", size: 25, x: "30%", y: "40%", duration: 7.5, delay: 1.5, rotate: 0 },
  { type: "heart", size: 40, x: "15%", y: "55%", duration: 12, delay: 0, rotate: 15 },
];

const fadeUp = (delay = 0) => ({
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] } },
});

export default function Hero() {
  const scrollToWork = () => {
    document.querySelector("#videos")?.scrollIntoView({ behavior: "smooth" });
  };
  const scrollDown = () => {
    document.querySelector("#about")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-cream">
      {/* Floating orbs */}
      {orbs.map((orb, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full pointer-events-none"
          style={{
            width: orb.size,
            height: orb.size,
            left: orb.x,
            top: orb.y,
            background: `radial-gradient(circle at 40% 40%, rgb(var(--blush) / 0.75), transparent 85%)`,
            filter: "blur(40px)",
          }}
          animate={{
            y: [0, -100, 50, -40, 0],
            x: [0, 50, -70, 40, 0],
            scale: [1, 1.2, 0.85, 1.1, 1],
            rotate: [0, 30, -30, 15, 0],
          }}
          transition={{
            duration: orb.duration * 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Scattered Accents */}
      {accents.map((accent, i) => (
        <motion.div
          key={`accent-${i}`}
          animate={{ y: [0, -20, 0], rotate: [accent.rotate, accent.rotate + 10, accent.rotate] }}
          transition={{ duration: accent.duration, delay: accent.delay, repeat: Infinity, ease: "easeInOut" }}
          className="absolute pointer-events-none text-rose-gold/25"
          style={{ left: accent.x, top: accent.y }}
        >
          {accent.type === "lily" ? (
            <svg width={accent.size} height={accent.size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.8">
              <path d="M12 22V12" />
              <path d="M12 12C12 12 19 10 20 7C21 4 18 3 15 5C12 7 12 12 12 12Z" fill="currentColor" fillOpacity="0.1" />
              <path d="M12 12C12 12 5 10 4 7C3 4 6 3 9 5C12 7 12 12 12 12Z" fill="currentColor" fillOpacity="0.1" />
            </svg>
          ) : (
            <svg width={accent.size} height={accent.size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.8">
              <path d="M12 22V15" />
              <path d="M12 15C12 15 20 12 20 8C20 4 16 4 12 8C8 4 4 4 4 8C4 12 12 15 12 15Z" fill="currentColor" fillOpacity="0.1" />
            </svg>
          )}
        </motion.div>
      ))}

      {/* Subtle grid texture */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgb(var(--rose-gold)) 1px,transparent 1px),linear-gradient(90deg,rgb(var(--rose-gold)) 1px,transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        {/* Eyebrow tag */}
        <motion.div
          variants={fadeUp(0)}
          initial="hidden"
          animate="visible"
          className="inline-flex items-center gap-2 mb-6"
        >
          <span className="w-8 h-px bg-rose-gold" />
          <span className="text-xs tracking-[0.3em] uppercase text-rose-gold font-medium">
            Video Editor & Photographer
          </span>
          <span className="w-8 h-px bg-rose-gold" />
        </motion.div>

        {/* Main headline */}
        <motion.h1
          variants={fadeUp(0.15)}
          initial="hidden"
          animate="visible"
          className="font-serif-custom text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-[1.05] text-charcoal mb-6"
        >
          Visual Storytelling,{" "}
          <span className="text-gradient-rose italic">
            Crafted
          </span>
          <br />
          <span className="text-gradient-rose italic">with Passion.</span>
        </motion.h1>

        {/* Sub-headline */}
        <motion.p
          variants={fadeUp(0.3)}
          initial="hidden"
          animate="visible"
          className="text-base sm:text-lg text-charcoal-light/80 leading-relaxed mb-10 max-w-xl mx-auto"
        >
          Hi, I&apos;m{" "}
          <span className="font-semibold text-charcoal">Rodina Hany Shaheen</span>.
          Freelance Video Editor & Photographer — turning raw moments into
          unforgettable stories.
        </motion.p>

        {/* CTAs */}
        <motion.div
          variants={fadeUp(0.45)}
          initial="hidden"
          animate="visible"
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <motion.button
            whileHover={{ scale: 1.04, boxShadow: "0 12px 30px rgba(184,114,125,0.35)" }}
            whileTap={{ scale: 0.97 }}
            onClick={scrollToWork}
            className="px-9 py-4 rounded-full bg-rose-gold text-cream text-sm font-semibold tracking-widest uppercase transition-shadow"
          >
            View My Work
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" })}
            className="px-9 py-4 rounded-full border border-rose-gold/60 text-rose-gold text-sm font-semibold tracking-widest uppercase hover:border-rose-gold transition-all"
          >
            Let&apos;s Connect
          </motion.button>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        onClick={scrollDown}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-muted hover:text-rose-gold transition-colors"
      >
        <span className="text-[10px] tracking-[0.2em] uppercase">Scroll</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
        >
          <ChevronDown size={18} />
        </motion.div>
      </motion.button>
    </section>
  );
}
