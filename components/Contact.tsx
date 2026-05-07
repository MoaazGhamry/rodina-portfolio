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
    href: "https://www.instagram.com/roooodin_aaaaa?igsh=NzVzbzFtMG5oMWtx",
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
    href: "mailto:rodinashaheen2005@gmail.com",
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
    <section id="contact" className="py-24 md:py-32 bg-blush-light/40 relative overflow-hidden">
      {/* Background orb */}
      <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-blush/25 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full bg-beige/40 blur-3xl pointer-events-none" />

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
          <h2 className="font-serif-custom text-4xl md:text-5xl font-bold text-charcoal mb-4">
            Let&apos;s Create Something{" "}
            <span className="text-gradient-rose italic">Beautiful Together.</span>
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
            <p className="text-charcoal-light/80 leading-relaxed mb-8 text-[15px]">
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
                  whileHover={{ x: 6 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center gap-4 p-4 rounded-2xl glass-card hover:shadow-md transition-shadow group"
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-cream flex-shrink-0 transition-transform group-hover:scale-110"
                    style={{ background: s.color }}
                  >
                    {s.icon}
                  </div>
                  <span className="text-sm font-medium text-charcoal tracking-wide">
                    {s.label}
                  </span>
                  <span className="ml-auto text-muted text-xs tracking-widest uppercase">
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
                className="flex flex-col items-center justify-center text-center py-16 glass-card rounded-3xl"
              >
                <CheckCircle size={48} className="text-rose-gold mb-4" />
                <h3 className="font-serif-custom text-2xl font-bold text-charcoal mb-2">
                  Message Sent! 🌸
                </h3>
                <p className="text-muted text-sm">
                  Thank you! I&apos;ll get back to you shortly.
                </p>
              </motion.div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="glass-card rounded-3xl p-8 space-y-5 shadow-lg"
              >
                {[
                  { id: "name", label: "Your Name", type: "text", placeholder: "Jane Smith" },
                  { id: "email", label: "Email Address", type: "email", placeholder: "hello@example.com" },
                ].map((f) => (
                  <div key={f.id}>
                    <label
                      htmlFor={f.id}
                      className="block text-xs tracking-widest uppercase text-muted mb-2 font-medium"
                    >
                      {f.label}
                    </label>
                    <input
                      id={f.id}
                      name={f.id}
                      type={f.type}
                      required
                      placeholder={f.placeholder}
                      className="w-full px-4 py-3 rounded-xl border border-blush/50 bg-cream/80 text-charcoal text-sm placeholder-muted/60 focus:outline-none focus:border-rose-gold focus:ring-2 focus:ring-rose-gold/20 transition-all"
                    />
                  </div>
                ))}

                <div>
                  <label
                    htmlFor="project"
                    className="block text-xs tracking-widest uppercase text-muted mb-2 font-medium"
                  >
                    Project Details
                  </label>
                  <textarea
                    id="project"
                    name="project"
                    required
                    rows={4}
                    placeholder="Tell me about your vision — what kind of edit or shoot are you looking for?"
                    className="w-full px-4 py-3 rounded-xl border border-blush/50 bg-cream/80 text-charcoal text-sm placeholder-muted/60 focus:outline-none focus:border-rose-gold focus:ring-2 focus:ring-rose-gold/20 transition-all resize-none"
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
          © {new Date().getFullYear()} Rodina Hany Shaheen · Crafted with passion 🌸
        </p>
      </div>
    </section>
  );
}
