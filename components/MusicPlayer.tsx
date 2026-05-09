"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, VolumeX, Music } from "lucide-react";

export default function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [customSrc, setCustomSrc] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const togglePlay = useCallback(() => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch((err) => {
        console.error("Autoplay blocked or audio failed", err);
      });
    }
  }, [isPlaying]);

  useEffect(() => {
    const handleGlobalToggle = () => togglePlay();
    window.addEventListener('toggle-music', handleGlobalToggle);
    return () => window.removeEventListener('toggle-music', handleGlobalToggle);
  }, [togglePlay]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setCustomSrc(url);
      setIsPlaying(false); // Reset to allow play with new src
      setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.play();
        }
      }, 100);
    }
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
    <div className="fixed bottom-6 left-6 z-[60] flex items-center gap-3 music-player-container transition-opacity duration-300">
      <audio
        ref={audioRef}
        src={customSrc || "https://cdn.pixabay.com/audio/2024/02/09/audio_651a4a2928.mp3"}
        loop
        preload="auto"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onError={(e) => {
          console.error("Audio failed to load", e);
        }}
      />
      
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={togglePlay}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className="w-14 h-14 rounded-full glass-card flex items-center justify-center text-rose-gold shadow-[0_8px_32px_rgba(184,114,125,0.2)] border border-rose-gold/20 relative group overflow-hidden"
      >
        <AnimatePresence mode="wait">
          {isPlaying ? (
            <motion.div
              key="playing"
              initial={{ scale: 0.8 }}
              animate={{ scale: [0.8, 1.2, 0.8] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Music size={26} />
            </motion.div>
          ) : (
            <motion.div
              key="paused"
              initial={{ opacity: 0.5 }}
              animate={{ opacity: 1 }}
            >
              <VolumeX size={26} className="opacity-40" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className="glass-card px-4 py-2 rounded-xl border border-rose-gold/10 flex flex-col gap-2"
          >
            <p className="text-[10px] tracking-widest uppercase font-bold text-rose-gold flex items-center gap-2">
              <Music size={12} />
              {isPlaying ? "Calm Vibes Active" : "Enable Calm Music"}
            </p>
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="text-[9px] text-white/40 hover:text-rose-gold transition-colors text-left uppercase tracking-tighter"
            >
              + Upload Custom Song
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileUpload} 
              accept="audio/*" 
              className="hidden" 
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
