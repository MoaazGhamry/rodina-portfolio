"use client";

import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

const orbs = [
  { size: 420, x: "70%", y: "10%", delay: 0, duration: 11, color: "rgba(242,196,206,0.35)" },
  { size: 280, x: "5%", y: "55%", delay: 1.5, duration: 9, color: "rgba(219,164,176,0.25)" },
  { size: 180, x: "80%", y: "65%", delay: 0.8, duration: 13, color: "rgba(184,114,125,0.18)" },
  { size: 120, x: "40%", y: "80%", delay: 2, duration: 8, color: "rgba(242,196,206,0.2)" },
  { size: 60,  x: "15%", y: "15%", delay: 1, duration: 7, color: "rgba(219,164,176,0.3)" },
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
            background: `radial-gradient(circle at 40% 40%, ${orb.color}, transparent 70%)`,
            filter: "blur(2px)",
          }}
          animate={{
            y: [0, -22, -8, 0],
            x: [0, 8, -5, 0],
            scale: [1, 1.04, 0.97, 1],
          }}
          transition={{
            duration: orb.duration,
            delay: orb.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Subtle grid texture */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(#B8727D 1px,transparent 1px),linear-gradient(90deg,#B8727D 1px,transparent 1px)",
          backgroundSize: "60px 60px",
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
