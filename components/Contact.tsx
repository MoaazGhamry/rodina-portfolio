"use client";

import { useRef, useState, FormEvent } from "react";
import { motion, useInView } from "framer-motion";
import { Instagram, Mail, Send, CheckCircle, MessageCircle } from "lucide-react";

/* TikTok icon as inline SVG */
const TikTokIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.73a4.85 4.85 0 0 1-1.01-.04z" />
  </svg>
);

const socialLinks = [
  {
    icon: <Instagram size={20} />,
    label: "Instagram",
    href: "https://www.instagram.com/rsh_vis?igsh=MWFmaHE4aXFvMWt0",
    color: "#C9848F",
  },
  {
    icon: <TikTokIcon />,
    label: "TikTok",
    href: "https://vt.tiktok.com/ZS9pEv2mU/",
    color: "#2A2A2A",
  },
  {
    icon: <MessageCircle size={20} />,
    label: "WhatsApp",
    href: "https://wa.me/201096639115",
    color: "#25D366",
  },
  {
    icon: <Mail size={20} />,
    label: "Email Me",
    href: "mailto:rodinarshviuals@gmail.com",
    color: "#B8727D",
  },
];

export default function Contact() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    setSent(true);
  };

  const fadeUp = (delay = 0) => ({
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] } },
  });

  return (
    <section id="contact" className="py-24 md:py-32 bg-blush-light/40 dark:bg-charcoal/50 relative overflow-hidden transition-colors duration-500">
      {/* Background orb */}
      <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-blush/25 dark:bg-rose-gold/5 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full bg-beige/40 dark:bg-rose-gold/10 blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6" ref={ref}>
        {/* Heading */}
        <motion.div
          variants={fadeUp(0)}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="text-center mb-16"
        >
          <p className="text-xs tracking-[0.3em] uppercase text-rose-gold font-medium mb-3">
            Get in Touch
          </p>
          <h2 className="font-serif-custom text-4xl md:text-5xl font-bold text-charcoal dark:text-white mb-4 transition-colors">
            Let&apos;s Create Something{" "}
            <span className="text-gradient-rose italic drop-shadow-[0_0_15px_rgba(184,114,125,0.3)]">Beautiful Together.</span>
          </h2>
          <div className="section-divider mx-auto" />
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* Left — Info & Socials */}
          <motion.div
            variants={fadeUp(0.1)}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
          >
            <p className="text-charcoal-light/80 dark:text-cream/70 leading-relaxed mb-8 text-[15px] transition-colors">
              Whether you need a cinematic reel, a lifestyle edit, or photography
              for your brand — I&apos;d love to collaborate. Reach out and let&apos;s
              bring your vision to life.
            </p>

            <div className="space-y-4 mb-10">
              {socialLinks.map((s) => (
                <motion.a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ x: 6, scale: 1.01 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center gap-4 p-4 rounded-2xl glass-card bg-white/50 dark:bg-white/10 border border-blush/20 dark:border-white/10 hover:shadow-xl transition-all group"
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-cream flex-shrink-0 transition-all group-hover:scale-110 shadow-lg"
                    style={{ 
                      background: s.color,
                      boxShadow: `0 4px 15px ${s.color}40`
                    }}
                  >
                    {s.icon}
                  </div>
                  <span className="text-sm font-bold text-charcoal dark:text-white tracking-wide transition-colors">
                    {s.label}
                  </span>
                  <span className="ml-auto text-muted dark:text-white/40 text-[10px] tracking-[0.2em] uppercase transition-colors">
                    Follow →
                  </span>
                </motion.a>
              ))}
            </div>

            {/* Quote */}
            <blockquote className="border-l-2 border-blush-dark pl-5 italic text-charcoal/60 font-serif-custom text-base">
              &ldquo;Every frame is a feeling. Every cut is a choice.&rdquo;
            </blockquote>
          </motion.div>

          {/* Right — Form */}
          <motion.div
            variants={fadeUp(0.18)}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
          >
            {sent ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center text-center py-16 glass-card bg-white/50 dark:bg-charcoal/80 border border-blush/20 dark:border-white/10 rounded-3xl"
              >
                <CheckCircle size={48} className="text-rose-gold mb-4" />
                <h3 className="font-serif-custom text-2xl font-bold text-charcoal dark:text-cream mb-2">
                  Message Sent! 🌸
                </h3>
                <p className="text-muted dark:text-cream/50 text-sm">
                  Thank you! I&apos;ll get back to you shortly.
                </p>
              </motion.div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="glass-card bg-white/60 dark:bg-charcoal/80 border border-blush/20 dark:border-white/10 rounded-3xl p-8 space-y-5 shadow-lg transition-colors duration-500"
              >
                {[
                  { id: "name", label: "Your Name", type: "text", placeholder: "Jane Smith" },
                  { id: "email", label: "Email Address", type: "email", placeholder: "hello@example.com" },
                ].map((f) => (
                  <div key={f.id}>
                    <label
                      htmlFor={f.id}
                      className="block text-xs tracking-widest uppercase text-muted dark:text-cream/60 mb-2 font-medium transition-colors"
                    >
                      {f.label}
                    </label>
                    <input
                      id={f.id}
                      name={f.id}
                      type={f.type}
                      required
                      placeholder={f.placeholder}
                      className="w-full px-4 py-3 rounded-xl border border-blush/40 dark:border-white/10 bg-white/80 dark:bg-charcoal/90 text-charcoal dark:text-cream text-sm placeholder:text-muted/80 dark:placeholder:text-cream/50 focus:outline-none focus:border-rose-gold focus:ring-2 focus:ring-rose-gold/20 transition-all"
                    />
                  </div>
                ))}

                <div>
                  <label
                    htmlFor="project"
                    className="block text-xs tracking-widest uppercase text-muted dark:text-cream/60 mb-2 font-medium transition-colors"
                  >
                    Project Details
                  </label>
                  <textarea
                    id="project"
                    name="project"
                    required
                    rows={4}
                    placeholder="Tell me about your vision — what kind of edit or shoot are you looking for?"
                    className="w-full px-4 py-3 rounded-xl border border-blush/40 dark:border-white/10 bg-white/80 dark:bg-charcoal/90 text-charcoal dark:text-cream text-sm placeholder:text-muted/80 dark:placeholder:text-cream/50 focus:outline-none focus:border-rose-gold focus:ring-2 focus:ring-rose-gold/20 transition-all resize-none"
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.02, boxShadow: "0 12px 30px rgba(184,114,125,0.3)" }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 rounded-xl bg-rose-gold text-cream text-sm font-semibold tracking-widest uppercase flex items-center justify-center gap-2 transition-all disabled:opacity-70"
                >
                  {loading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
                      className="w-4 h-4 border-2 border-cream/40 border-t-cream rounded-full"
                    />
                  ) : (
                    <>
                      Send Message <Send size={15} />
                    </>
                  )}
                </motion.button>
              </form>
            )}
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-20 border-t border-blush/30 pt-8 text-center">
        <p className="text-muted text-xs tracking-widest uppercase">
          © {new Date().getFullYear()} Rodina Hany Shaheen · Crafted with passion{" "}
          <span
            className="cursor-pointer select-none"
            onClick={() => {
              const count = (window as any).secretClickCount || 0;
              (window as any).secretClickCount = count + 1;
              if (count + 1 >= 5) {
                window.location.href = "/login";
              }
            }}
          >
            🌸
          </span>
        </p>
      </div>
    </section>
  );
}
