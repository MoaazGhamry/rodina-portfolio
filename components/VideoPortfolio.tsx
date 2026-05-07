"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { useVideos, Video } from "@/hooks/useVideos";
import { migrateVideos } from "@/lib/migrateVideos";

function VideoCard({ v, index }: { v: Video; index: number }) {
  const [hovered, setHovered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

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
        className="relative overflow-hidden rounded-2xl bg-beige shadow-lg"
        style={{ aspectRatio: "9/16" }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <motion.video
          src={v.src}
          autoPlay
          muted
          playsInline
          loop
          preload="auto"
          className="w-full h-full object-cover"
          animate={{ scale: hovered ? 1.04 : 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 via-transparent to-transparent opacity-80" />

        {/* Tag chip */}
        <div className="absolute top-3 left-3">
          <span
            className="text-[10px] font-semibold tracking-widest uppercase px-3 py-1 rounded-full text-cream"
            style={{ background: v.accent || "#B8727D" }}
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
  const { videos, loading } = useVideos();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  useEffect(() => {
    migrateVideos();
  }, []);

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
            carefully composed visual story.
          </p>
        </motion.div>

        {/* Video Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {loading ? (
            <div className="col-span-full flex items-center justify-center py-20">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                className="w-8 h-8 border-2 border-rose-gold/20 border-t-rose-gold rounded-full"
              />
            </div>
          ) : (
            videos.map((v, i) => (
              <VideoCard key={v.id} v={v} index={i} />
            ))
          )}
        </div>
      </div>
    </section>
  );
}
