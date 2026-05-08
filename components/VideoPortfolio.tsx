"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { Maximize2 } from "lucide-react";
import { useVideos, Video } from "@/hooks/useVideos";
import { migrateVideos } from "@/lib/migrateVideos";

import { MediaModal } from "./MediaModal";

function VideoCard({ v, index, onOpen, isGlobalPaused }: { v: Video; index: number; onOpen: (v: Video) => void; isGlobalPaused: boolean }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.5 }); // Play when 50% in view

  useEffect(() => {
    if (videoRef.current) {
      if (inView && !isGlobalPaused) {
        videoRef.current.play().catch(() => {});
      } else {
        videoRef.current.pause();
      }
    }
  }, [inView, isGlobalPaused]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="group flex flex-col cursor-pointer"
      onClick={() => onOpen(v)}
    >
      {/* Video container — 9:16 portrait */}
      <div
        className="relative overflow-hidden rounded-2xl bg-beige shadow-lg transform-gpu"
        style={{ aspectRatio: "9/16" }}
      >
        <video
          ref={videoRef}
          src={v.src}
          muted
          playsInline
          loop
          preload="metadata"
          className="w-full h-full object-cover"
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 via-transparent to-transparent opacity-80" />

        {/* Maximize icon on hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="w-12 h-12 rounded-full bg-cream/20 backdrop-blur-md flex items-center justify-center text-cream">
             <Maximize2 size={24} />
          </div>
        </div>

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
        {v.location && (
          <div className="flex items-center gap-1.5 text-[10px] text-rose-gold mb-1.5 uppercase tracking-[0.15em] font-bold">
            <span className="w-4 h-px bg-rose-gold/30" />
            <span>{v.location}</span>
          </div>
        )}
        <p className="text-xs text-muted leading-relaxed">{v.description}</p>
      </div>
    </motion.div>
  );
}

export default function VideoPortfolio() {
  const { videos, loading } = useVideos();
  const [selected, setSelected] = useState<Video | null>(null);
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
          <h2 className="font-serif-custom text-3xl md:text-5xl font-bold text-charcoal mb-4">
            Stories I&apos;ve <span className="text-gradient-rose italic">Crafted</span>
          </h2>
          <div className="section-divider mx-auto mb-5" />
          <p className="text-sm text-muted max-lg mx-auto leading-relaxed">
            From cinematic color grades to beat-synced reels — each edit is a
            carefully composed visual story.
          </p>
        </motion.div>

        {/* Horizontal Video Container */}
        <div className="relative group/container">
          <div 
            className="flex gap-6 overflow-x-auto pb-12 pt-4 scrollbar-hide snap-x snap-mandatory"
            style={{ 
              scrollbarWidth: 'none', 
              msOverflowStyle: 'none',
              WebkitOverflowScrolling: 'touch'
            }}
          >
            {loading ? (
              <div className="w-full flex items-center justify-center py-20">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                  className="w-8 h-8 border-2 border-rose-gold/20 border-t-rose-gold rounded-full"
                />
              </div>
            ) : (
              videos.map((v, i) => (
                <div key={v.id} className="flex-none w-[240px] sm:w-[320px] snap-center">
                  <VideoCard v={v} index={i} onOpen={setSelected} isGlobalPaused={!!selected} />
                </div>
              ))
            )}
          </div>
          
          {/* Scroll Hint (Desktop only) */}
          <div className="hidden md:block absolute -right-4 top-1/2 -translate-y-1/2 translate-x-full opacity-0 group-hover/container:opacity-100 transition-opacity">
            <p className="text-[10px] tracking-[0.3em] uppercase text-rose-gold font-bold rotate-90">Swipe</p>
          </div>
        </div>

        {/* Universal Media Modal */}
        <MediaModal
          isOpen={!!selected}
          onClose={() => setSelected(null)}
          type="video"
          src={selected?.src || ""}
          title={selected?.title}
          description={selected?.description}
          location={selected?.location}
        />
      </div>
    </section>
  );
}
