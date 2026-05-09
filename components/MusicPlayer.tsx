"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, VolumeX, Music } from "lucide-react";

export default function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(() => {
        console.log("Autoplay blocked or audio failed");
      });
    }
    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    // Attempt subtle autoplay on first user interaction if not already playing
    const handleFirstInteraction = () => {
      if (!isPlaying && audioRef.current) {
        // Many browsers allow play() after any user interaction
        // but we won't force it to be loud/annoying.
        // We'll keep it paused by default but ready.
      }
      window.removeEventListener("click", handleFirstInteraction);
    };
    window.addEventListener("click", handleFirstInteraction);
    return () => window.removeEventListener("click", handleFirstInteraction);
  }, [isPlaying]);

  return (
    <div className="fixed bottom-6 left-6 z-[60] flex items-center gap-3">
      <audio
        ref={audioRef}
        src="https://cdn.pixabay.com/audio/2022/02/22/audio_d0c6d35688.mp3"
        loop
        preload="auto"
        crossOrigin="anonymous"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onError={(e) => {
          console.error("Audio failed to load", e);
          // Try a fallback link if the primary fails
          if (audioRef.current && !audioRef.current.src.includes("soundhelix")) {
            audioRef.current.src = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";
            audioRef.current.load();
          }
        }}
      />
      
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={togglePlay}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className="w-14 h-14 rounded-full glass-card flex items-center justify-center text-rose-gold shadow-[0_8px_32px_rgba(184,114,125,0.2)] border border-rose-gold/20 relative group overflow-hidden"
      >
        <AnimatePresence mode="wait">
          {isPlaying ? (
            <motion.div
              key="playing"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="z-10"
            >
              <Volume2 size={24} />
            </motion.div>
          ) : (
            <motion.div
              key="paused"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="z-10"
            >
              <VolumeX size={24} className="opacity-40" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dynamic Background Pulse when playing */}
        {isPlaying && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.15 }}
            className="absolute inset-0 bg-rose-gold"
          />
        )}

        {/* Animated Rhythmic Bars - More Premium Style */}
        {isPlaying && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-end gap-[3px] h-3">
            {[...Array(4)].map((_, i) => (
              <motion.div
                key={i}
                animate={{ 
                  height: ["20%", "100%", "20%"],
                  opacity: [0.3, 1, 0.3]
                }}
                transition={{ 
                  duration: 0.5 + i * 0.15, 
                  repeat: Infinity, 
                  ease: "easeInOut",
                  delay: i * 0.1
                }}
                className="w-[3px] bg-rose-gold rounded-full"
              />
            ))}
          </div>
        )}
      </motion.button>

      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className="glass-card px-4 py-2 rounded-xl border border-rose-gold/10 pointer-events-none"
          >
            <p className="text-[10px] tracking-widest uppercase font-bold text-rose-gold flex items-center gap-2">
              <Music size={12} />
              {isPlaying ? "Calm Vibes Active" : "Enable Calm Music"}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
