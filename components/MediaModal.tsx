"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Maximize2 } from "lucide-react";
import Image from "next/image";

interface MediaModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: "image" | "video";
  src: string;
  title?: string;
  description?: string;
}

export function MediaModal({ isOpen, onClose, type, src, title, description }: MediaModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-charcoal/95 backdrop-blur-md flex items-center justify-center p-4 md:p-10"
          onClick={onClose}
        >
          {/* Close button - Top right */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 hover:bg-rose-gold text-white flex items-center justify-center transition-all z-[110]"
          >
            <X size={24} />
          </button>

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full h-full max-w-7xl flex flex-col lg:flex-row items-center justify-center gap-10"
          >
            {/* Media Container */}
            <div className="relative flex-1 w-full h-full flex items-center justify-center min-h-0">
              {/* Left Side: Large Sketched Lily */}
              <div className="hidden xl:block absolute -left-40 top-1/2 -translate-y-1/2 w-80 h-80 opacity-10 pointer-events-none grayscale brightness-150">
                <motion.svg
                  viewBox="0 0 100 100"
                  fill="currentColor"
                  className="text-white w-full h-full"
                  animate={{ y: [0, -15, 0], rotate: [0, 5, 0] }}
                  transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                >
                  <path d="M50 10 C60 30 90 40 50 90 C10 40 40 30 50 10 M50 30 C55 45 70 50 50 75 C30 50 45 45 50 30" />
                  <path d="M50 50 L70 30 M50 50 L30 30" stroke="currentColor" strokeWidth="0.5" />
                </motion.svg>
              </div>

              {type === "image" ? (
                <div className="relative w-full h-full">
                  <Image
                    src={src}
                    alt={title || "Portfolio Item"}
                    fill
                    className="object-contain"
                    sizes="100vw"
                    priority
                  />
                </div>
              ) : (
                <video
                  src={src}
                  controls
                  autoPlay
                  loop
                  playsInline
                  className="max-w-full max-h-full rounded-2xl shadow-2xl border border-white/10"
                  onClick={(e) => e.stopPropagation()}
                />
              )}

              {/* Curvy Arrow 1 (Desktop Only) */}
              <div className="hidden lg:block absolute -right-20 top-1/4 -translate-y-1/2 pointer-events-none">
                <motion.svg
                  width="120"
                  height="120"
                  viewBox="0 0 100 100"
                  fill="none"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 0.6 }}
                  transition={{ duration: 1.2, delay: 0.6, ease: "easeInOut" }}
                >
                  <path
                    d="M10,20 Q60,-10 90,40"
                    stroke="#B8727D"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    markerEnd="url(#arrowhead)"
                  />
                </motion.svg>
              </div>

              {/* Curvy Arrow 2 (Desktop Only) */}
              <div className="hidden lg:block absolute -right-16 bottom-1/4 translate-y-1/2 pointer-events-none">
                <motion.svg
                  width="100"
                  height="100"
                  viewBox="0 0 100 100"
                  fill="none"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 0.4 }}
                  transition={{ duration: 1, delay: 0.8, ease: "easeInOut" }}
                >
                  <path
                    d="M10,80 Q40,100 80,60"
                    stroke="#B8727D"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    markerEnd="url(#arrowhead2)"
                  />
                  <defs>
                    <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="0" refY="3.5" orient="auto">
                      <polygon points="0 0, 10 3.5, 0 7" fill="#B8727D" />
                    </marker>
                    <marker id="arrowhead2" markerWidth="10" markerHeight="7" refX="0" refY="3.5" orient="auto">
                      <polygon points="0 0, 10 3.5, 0 7" fill="#B8727D" />
                    </marker>
                  </defs>
                </motion.svg>
              </div>
            </div>

            {/* Pink Info Box */}
            {(title || description) && (
              <motion.div 
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="w-full lg:w-80 flex-shrink-0 relative"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Top Right Heart Doodle */}
                <div className="absolute -top-16 -right-10 w-20 h-20 opacity-20 pointer-events-none">
                   <motion.svg 
                    viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-rose-gold w-full h-full"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 3, repeat: Infinity }}
                   >
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                   </motion.svg>
                </div>

                {/* Extra Lilies Background */}
                <div className="absolute -top-12 -left-20 w-32 h-32 opacity-10 pointer-events-none rotate-45">
                   <svg viewBox="0 0 24 24" fill="currentColor" className="text-cream w-full h-full">
                      <path d="M12 2L14.5 9H21L15.5 13L18 20L12 15L6 20L8.5 13L3 9H9.5L12 2Z" />
                   </svg>
                </div>

                {/* Floating Lily Decoration */}
                <div className="absolute -top-6 -right-6 w-16 h-16 opacity-40 rotate-12 pointer-events-none">
                   <svg viewBox="0 0 24 24" fill="none" className="text-cream w-full h-full">
                      <path d="M12 2L14.5 9H21L15.5 13L18 20L12 15L6 20L8.5 13L3 9H9.5L12 2Z" fill="currentColor" />
                   </svg>
                </div>

                <div className="bg-rose-gold/90 backdrop-blur-xl rounded-[2rem] p-8 shadow-2xl border border-white/20 text-left relative overflow-hidden">
                  {/* Subtle Pattern */}
                  <div className="absolute inset-0 opacity-10 pointer-events-none flex items-center justify-center">
                    <svg width="200" height="200" viewBox="0 0 100 100" fill="currentColor" className="text-white">
                      <path d="M50 10 C60 30 90 40 50 90 C10 40 40 30 50 10" />
                    </svg>
                  </div>

                  <div className="w-10 h-1px bg-cream/40 mb-6" />
                  <h3 className="font-serif-custom text-2xl md:text-3xl font-bold text-cream mb-4 italic leading-tight">
                    {title}
                  </h3>
                  <p className="text-cream/90 text-sm md:text-base leading-relaxed font-medium">
                    {description}
                  </p>
                  <div className="mt-8 pt-6 border-t border-white/10 flex justify-between items-center">
                    <p className="text-[10px] tracking-[0.3em] uppercase text-cream/50 font-bold">Project Details</p>
                    <div className="w-5 h-5 text-cream/30">
                       <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/></svg>
                    </div>
                  </div>
                </div>

                {/* Bottom Right Doodle Dash */}
                <div className="absolute -bottom-16 -right-12 w-32 h-32 opacity-10 pointer-events-none text-rose-gold">
                   <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4">
                      <circle cx="50" cy="50" r="40" />
                      <path d="M20 50 L80 50 M50 20 L50 80" />
                   </svg>
                </div>

                {/* Bottom Lily */}
                <div className="absolute -bottom-10 -right-10 w-24 h-24 opacity-20 -rotate-12 pointer-events-none">
                   <svg viewBox="0 0 24 24" fill="none" className="text-cream w-full h-full">
                      <path d="M12 2L14.5 9H21L15.5 13L18 20L12 15L6 20L8.5 13L3 9H9.5L12 2Z" fill="currentColor" />
                   </svg>
                </div>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
