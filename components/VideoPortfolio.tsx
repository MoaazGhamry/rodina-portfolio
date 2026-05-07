"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Play, Pause } from "lucide-react";

const videos = [
  {
    id: 1,
    src: "https://res.cloudinary.com/dhoqtr0se/video/upload/v1778162700/IMG_7676_g8yvh2.mov",
    title: "Cinematic Night Vibes",
    description: "Theme Park after dark — atmospheric edits capturing the magic of illuminated wonderlands.",
    tag: "Dynamic Cuts & Color Grading",
    accent: "#B8727D",
  },
  {
    id: 2,
    src: "https://res.cloudinary.com/dhoqtr0se/video/upload/v1778162483/IMG_7677_xlbdt2.mov",
    title: "Navy Elegance",
    description: "Fashion-forward outfit showcase — beat-synced transitions that make every frame count.",
    tag: "Beat-Synced Fashion Reels",
    accent: "#6B8CAE",
  },
  {
    id: 3,
    src: "https://res.cloudinary.com/dhoqtr0se/video/upload/v1778162448/IMG_7721_aspgne.mov",
    title: "Winter Streetwear",
    description: "Lifestyle & streetwear vibes — cool tones, crisp edits, and serious winter energy.",
    tag: "Lifestyle & Aesthetic Edits",
    accent: "#8C7B6E",
  },
  {
    id: 4,
    src: "https://res.cloudinary.com/dhoqtr0se/video/upload/v1778162493/IMG_7723_vpfzyf.mov",
    title: "Aesthetic Showcase",
    description: "Product and accessory highlight reels — close-up glory with cinematic finesse.",
    tag: "Product Cinematography",
    accent: "#C9848F",
  },
];

function VideoCard({ v, index }: { v: typeof videos[0]; index: number }) {
  const [playing, setPlaying] = useState(false);
  const [hovered, setHovered] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  const toggle = () => {
    const el = videoRef.current;
    if (!el) return;
    if (playing) { el.pause(); setPlaying(false); }
    else { el.play(); setPlaying(true); }
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
      className="group flex flex-col"
    >
      {/* Video container — 9:16 portrait */}
      <div
        className="relative overflow-hidden rounded-2xl bg-beige shadow-lg cursor-pointer"
        style={{ aspectRatio: "9/16" }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={toggle}
      >
        <motion.video
          ref={videoRef}
          src={v.src}
          muted
          playsInline
          loop
          preload="metadata"
          className="w-full h-full object-cover"
          animate={{ scale: hovered ? 1.04 : 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 via-transparent to-transparent opacity-80" />

        {/* Play / Pause icon */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          animate={{ opacity: hovered || !playing ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            animate={{ scale: hovered ? 1 : 0.85 }}
            transition={{ duration: 0.3 }}
            className="w-14 h-14 rounded-full bg-cream/90 flex items-center justify-center shadow-lg"
          >
            {playing ? (
              <Pause size={20} className="text-rose-gold" />
            ) : (
              <Play size={20} className="text-rose-gold ml-0.5" fill="#B8727D" />
            )}
          </motion.div>
        </motion.div>

        {/* Tag chip */}
        <div className="absolute top-3 left-3">
          <span
            className="text-[10px] font-semibold tracking-widest uppercase px-3 py-1 rounded-full text-cream"
            style={{ background: v.accent }}
          >
            {v.tag}
          </span>
        </div>
      </div>

      {/* Caption */}
      <div className="mt-4 px-1">
        <h3 className="font-serif-custom text-lg font-semibold text-charcoal mb-1">
          {v.title}
        </h3>
        <p className="text-xs text-muted leading-relaxed">{v.description}</p>
      </div>
    </motion.div>
  );
}

export default function VideoPortfolio() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="videos" className="py-24 md:py-32 bg-blush-light/40">
      <div className="max-w-6xl mx-auto px-6">
        {/* Heading */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-16"
        >
          <p className="text-xs tracking-[0.3em] uppercase text-rose-gold font-medium mb-3">
            Video Editing
          </p>
          <h2 className="font-serif-custom text-4xl md:text-5xl font-bold text-charcoal mb-4">
            Stories I&apos;ve{" "}
            <span className="text-gradient-rose italic">Crafted</span>
          </h2>
          <div className="section-divider mx-auto mb-5" />
          <p className="text-sm text-muted max-w-lg mx-auto leading-relaxed">
            From cinematic color grades to beat-synced reels — each edit is a
            carefully composed visual story. Tap to play.
          </p>
        </motion.div>

        {/* 2×2 Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {videos.map((v, i) => (
            <VideoCard key={v.id} v={v} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
