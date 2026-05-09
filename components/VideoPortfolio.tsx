"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { Maximize2 } from "lucide-react";
import { useVideos, Video } from "@/hooks/useVideos";
import { migrateVideos } from "@/lib/migrateVideos";
import { Lily } from "./FloralBackground";

import { MediaModal } from "./MediaModal";

function VideoCard({ v, index, onOpen, isGlobalPaused }: { v: Video; index: number; onOpen: (v: Video) => void; isGlobalPaused: boolean }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.5 });

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (inView && !isGlobalPaused) {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Autoplay blocked by Safari — video stays paused, that's fine
        });
      }
    } else {
      video.pause();
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
      style={{ willChange: "transform" }}
    >
      {/* Video container — 9:16 portrait */}
      <div
        className="relative overflow-hidden rounded-2xl bg-beige shadow-lg"
        style={{ aspectRatio: "9/16" }}
      >
        <video
          ref={videoRef}
          src={v.src.includes("cloudinary.com") ? v.src.replace("/upload/", "/upload/f_auto,q_auto:eco,w_480,c_scale/") : v.src}
          poster={v.src.includes("cloudinary.com") ? v.src.replace("/upload/", "/upload/f_auto,q_auto:eco,w_400,c_scale/").replace(/\.[^/.]+$/, ".jpg") : undefined}
          muted
          playsInline
          {...{ "webkit-playsinline": "true" } as any}
          loop
          preload={index < 2 ? "metadata" : "none"}
          className="w-full h-full object-cover"
          style={{ willChange: "transform" }}
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 via-transparent to-transparent opacity-80" />

        {/* Maximize icon on hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
             <Maximize2 size={24} />
          </div>
        </div>

        {/* Tag chip */}
        <div className="absolute top-3 left-3">
          <span
            className="text-[10px] font-semibold tracking-widest uppercase px-3 py-1 rounded-full text-white"
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
    <section id="videos" className="py-24 md:py-32 bg-blush-light/40 relative overflow-hidden">
      {/* Decorative Lilies Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: (i * 30) + "%", y: "100%" }}
            animate={{ 
              opacity: [0, 0.1, 0.1, 0],
              y: "-20%",
              x: (i * 30 + (Math.random() * 10 - 5)) + "%",
              rotate: [0, 45, -45, 90]
            }}
            transition={{ 
              duration: 25 + i * 5,
              repeat: Infinity,
              delay: i * 4,
              ease: "linear"
            }}
            className="absolute text-rose-gold/10 mix-blend-overlay"
          >
            <Lily size={150 + i * 80} />
          </motion.div>
        ))}
      </div>

      <div className="max-w-6xl mx-auto px-6 relative z-10">
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
              // Safari: momentum scrolling
              WebkitOverflowScrolling: 'touch',
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
