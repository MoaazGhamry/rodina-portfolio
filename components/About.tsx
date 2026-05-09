"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useHeroPhotos } from "@/hooks/useHeroPhotos";
import { migrateHero } from "@/lib/migrateHero";

const fadeUp = (delay = 0) => ({
  hidden: { opacity: 0, y: 35 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.85, delay, ease: [0.22, 1, 0.36, 1] } },
});

const stats = [
  { value: "50+", label: "Projects Completed" },
  { value: "3+", label: "Years Editing" },
  { value: "∞", label: "Creative Passion" },
];

const skills = [
  "Video Editing", "Color Grading", "Beat Syncing",
  "Photography", "Reels & TikTok", "Lifestyle Content",
  "Cinematic Edits", "Adobe Premiere", "CapCut",
];

export default function About() {
  const { photos, loading } = useHeroPhotos();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [imgIndex, setImgIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    migrateHero();
  }, []);

  const nextImg = useCallback(() => {
    if (photos.length === 0) return;
    setImgIndex((prev) => (prev + 1) % photos.length);
  }, [photos.length]);

  const prevImg = useCallback(() => {
    if (photos.length === 0) return;
    setImgIndex((prev) => (prev - 1 + photos.length) % photos.length);
  }, [photos.length]);

  // Auto-swipe functionality
  useEffect(() => {
    if (photos.length <= 1 || isHovered) return;
    const timer = setInterval(nextImg, 5000); // Swap every 5s
    return () => clearInterval(timer);
  }, [photos.length, nextImg, isHovered]);

  return (
    <section id="about" ref={ref} className="py-24 md:py-32 bg-cream overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-16 items-center">

          {/* Left — Text */}
          <div>
            <motion.div
              variants={fadeUp(0)}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              className="mb-10"
            >
              <p className="text-xs tracking-[0.3em] uppercase text-rose-gold font-medium mb-3">
                About Me
              </p>
              <h2 className="font-serif-custom text-4xl md:text-5xl font-bold text-charcoal leading-tight mb-6">
                A Creative with a{" "}
                <span className="text-gradient-rose italic">Business Mind.</span>
              </h2>
              <div className="section-divider mb-8" />
            </motion.div>

            <motion.p
              variants={fadeUp(0.1)}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              className="text-charcoal-light/80 leading-[1.9] mb-8 text-[15px]"
            >
              I am a 20-year-old creative with a heart that beats for video editing and
              photography. Currently studying Business Administration at{" "}
              <span className="text-rose-gold font-medium">
                Future University in Egypt (FUE)
              </span>
              , I blend strategic business acumen with an intense, boundless passion for
              visual arts. Whether I&apos;m piecing together dynamic lifestyle reels, finding
              the perfect rhythm in a cinematic edit, or capturing the quiet beauty of a
              night out, I love turning raw moments into unforgettable stories.
            </motion.p>

            <motion.p
              variants={fadeUp(0.18)}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              className="text-charcoal font-serif-custom italic text-xl mb-10 border-l-2 border-rose-gold pl-5"
            >
              &ldquo;I don&apos;t just edit videos; I breathe life into them.&rdquo;
            </motion.p>

            {/* Skills */}
            <motion.div
              variants={fadeUp(0.25)}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              className="flex flex-wrap gap-2 mb-10"
            >
              {skills.map((s) => (
                <span
                  key={s}
                  className="text-xs tracking-wider uppercase px-4 py-2 rounded-full bg-blush-light text-rose-gold border border-blush/60 font-medium"
                >
                  {s}
                </span>
              ))}
            </motion.div>

            {/* Stats */}
            <motion.div
              variants={fadeUp(0.32)}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              className="grid grid-cols-3 gap-4"
            >
              {stats.map((s) => (
                <div key={s.label} className="text-center p-4 rounded-2xl bg-blush-light/60 border border-blush/30">
                  <p className="font-serif-custom text-3xl font-bold text-rose-gold mb-1">{s.value}</p>
                  <p className="text-[11px] tracking-wider uppercase text-muted">{s.label}</p>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right — Swipeable Gallery */}
          <motion.div
            variants={{ hidden: { opacity: 0, x: 50 }, visible: { opacity: 1, x: 0, transition: { duration: 1, delay: 0.15, ease: [0.22, 1, 0.36, 1] } } }}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            className="relative flex justify-center group"
          >
            {/* Decorative blobs */}
            <div className="absolute -top-8 -right-8 w-64 h-64 rounded-full bg-blush/30 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-8 -left-8 w-48 h-48 rounded-full bg-beige/60 blur-2xl pointer-events-none" />

            {/* Frame */}
            <div 
              className="relative w-72 h-96 sm:w-80 sm:h-[420px] select-none"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              {/* Rose-gold border offset */}
              <div className="absolute inset-0 rounded-[2.5rem] border-2 border-rose-gold/40 translate-x-4 translate-y-4" />
              
              {/* Photo card with Swipe Logic */}
              <div className="absolute inset-0 rounded-[2.5rem] overflow-hidden shadow-2xl shadow-rose-gold/10 bg-beige">
                {loading ? (
                  <div className="w-full h-full flex items-center justify-center">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                      className="w-8 h-8 border-2 border-rose-gold/20 border-t-rose-gold rounded-full"
                    />
                  </div>
                ) : (
                  <AnimatePresence mode="wait">
                    {photos.length > 0 && (
                      <motion.div
                        key={imgIndex}
                        initial={{ x: "100%", opacity: 0, scale: 0.95 }}
                        animate={{ x: 0, opacity: 1, scale: 1 }}
                        exit={{ x: "-100%", opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                        drag="x"
                        dragConstraints={{ left: 0, right: 0 }}
                        onDragEnd={(e, { offset, velocity }) => {
                          if (offset.x > 100) prevImg();
                          else if (offset.x < -100) nextImg();
                        }}
                        className="absolute inset-0 cursor-grab active:cursor-grabbing"
                      >
                        <Image
                          src={photos[imgIndex]?.src.includes("cloudinary.com") 
                            ? photos[imgIndex].src.replace("/upload/", "/upload/f_auto,q_auto,w_1000,c_limit/") 
                            : photos[imgIndex]?.src}
                          alt={`Rodina Portrait ${imgIndex + 1}`}
                          fill
                          className="object-cover pointer-events-none"
                          sizes="(max-width: 640px) 288px, 320px"
                          priority
                          unoptimized
                        />
                        {/* Overlay gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-rose-deep/20 via-transparent to-transparent pointer-events-none" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}

                {/* Swipe Indicators */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                  {photos.map((_, i) => (
                    <div
                      key={i}
                      className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${i === imgIndex ? "bg-cream w-4" : "bg-cream/40"}`}
                    />
                  ))}
                </div>
              </div>

              {/* Navigation Arrows */}
              <button
                onClick={prevImg}
                className="absolute left-[-20px] top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-cream/90 shadow-md flex items-center justify-center text-rose-gold hover:bg-rose-gold hover:text-cream transition-all z-20 opacity-0 group-hover:opacity-100"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={nextImg}
                className="absolute right-[-20px] top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-cream/90 shadow-md flex items-center justify-center text-rose-gold hover:bg-rose-gold hover:text-cream transition-all z-20 opacity-0 group-hover:opacity-100"
              >
                <ChevronRight size={20} />
              </button>

              {/* Floating badge */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                className="absolute -bottom-5 -left-10 glass-card rounded-2xl px-5 py-3 shadow-lg z-20"
              >
                <p className="text-[10px] tracking-widest uppercase text-muted mb-0.5 font-bold">Swipe Me</p>
                <p className="text-sm font-semibold text-charcoal">{photos[imgIndex]?.location || "Cairo, Egypt"} 🌸</p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
