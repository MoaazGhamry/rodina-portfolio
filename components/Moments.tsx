"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { Maximize2, Play, Volume2 } from "lucide-react";
import { useMoments, Moment } from "@/hooks/useMoments";
import { MediaModal } from "./MediaModal";

function MomentCard({ moment, index, onOpen, isGlobalPaused }: { moment: Moment; index: number; onOpen: (m: Moment) => void; isGlobalPaused: boolean }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const inView = useInView(containerRef, { amount: 0.6 });
  const [isHovered, setIsHovered] = useState(false);

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
      ref={containerRef}
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
      className="relative group cursor-pointer rounded-[2rem] overflow-hidden bg-beige shadow-xl aspect-[9/16]"
      onClick={() => onOpen(moment)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <video
        ref={videoRef}
        src={moment.src}
        muted
        playsInline
        loop
        preload="metadata"
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
      />

      {/* Decorative Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-charcoal/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Play/Sound Indicator */}
      <div className="absolute top-4 right-4 flex gap-2">
        <div className="w-8 h-8 rounded-full bg-cream/10 backdrop-blur-md flex items-center justify-center text-cream opacity-60 group-hover:opacity-100 transition-opacity">
          <Volume2 size={14} />
        </div>
      </div>

      {/* Center Maximize Icon */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 scale-90 group-hover:scale-100">
        <div className="w-14 h-14 rounded-full bg-rose-gold/20 backdrop-blur-lg border border-white/30 flex items-center justify-center text-white shadow-2xl">
          <Maximize2 size={24} />
        </div>
      </div>

      {/* Caption Area */}
      <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 md:translate-y-4 md:group-hover:translate-y-0 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all duration-500 bg-gradient-to-t from-charcoal/80 to-transparent md:from-transparent">
        <h4 className="font-serif-custom text-base md:text-xl font-bold text-white mb-0.5 md:mb-1">
          {moment.title}
        </h4>
        {moment.description && (
          <p className="text-[10px] text-cream/80 uppercase tracking-widest font-medium">
            {moment.description}
          </p>
        )}
      </div>

      {/* Botanical Corner (Subtle) */}
      <div className="absolute -bottom-4 -right-4 w-24 h-24 text-rose-gold/20 opacity-0 group-hover:opacity-40 transition-opacity rotate-12 pointer-events-none">
        <svg viewBox="0 0 100 100" fill="currentColor">
          <path d="M50 10 C60 30 90 40 50 90 C10 40 40 30 50 10" />
        </svg>
      </div>
    </motion.div>
  );
}

export default function Moments() {
  const { moments, loading } = useMoments();
  const [selected, setSelected] = useState<Moment | null>(null);

  return (
    <section id="moments" className="py-24 md:py-32 bg-cream overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="max-w-xl">
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-xs tracking-[0.4em] uppercase text-rose-gold font-bold mb-4"
            >
              Captured Memories
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-serif-custom text-5xl md:text-6xl font-bold text-charcoal leading-tight"
            >
              Raw & Real <span className="text-gradient-rose italic">Moments</span>
            </motion.h2>
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="hidden md:block text-right"
          >
            <div className="w-12 h-12 rounded-full border border-blush/30 flex items-center justify-center text-rose-gold animate-bounce-slow">
              <Play size={20} className="rotate-90" />
            </div>
          </motion.div>
        </div>

        {/* Masonry-style Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-8">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="aspect-[9/16] rounded-[2rem] bg-blush/10 animate-pulse" />
            ))
          ) : (
            moments.map((moment, i) => (
              <MomentCard
                key={moment.id}
                moment={moment}
                index={i}
                onOpen={setSelected}
                isGlobalPaused={!!selected}
              />
            ))
          )}
        </div>

        {/* Empty State */}
        {!loading && moments.length === 0 && (
          <div className="text-center py-20 border-2 border-dashed border-blush/20 rounded-[3rem]">
            <p className="text-muted italic">No moments captured yet. Stay tuned.</p>
          </div>
        )}
      </div>

      <MediaModal
        isOpen={!!selected}
        onClose={() => setSelected(null)}
        type="video"
        src={selected?.src || ""}
        title={selected?.title}
        description={selected?.description}
      />
    </section>
  );
}
