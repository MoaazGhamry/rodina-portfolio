"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, MapPin } from "lucide-react";
import Image from "next/image";
import { Lily } from "./FloralBackground";

interface MediaModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: "image" | "video";
  src: string;
  title?: string;
  description?: string;
  location?: string;
}

interface ArrowMood {
  name: string;
  arrows: {
    d: string;
    top?: string;
    bottom?: string;
    left?: string;
    right?: string;
    scale: number;
    rotate?: number;
  }[];
}

export function MediaModal({ isOpen, onClose, type, src, title, description, location }: MediaModalProps) {
  const [layoutMode, setLayoutMode] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // Touch / swipe-to-close state
  const touchStartY = useRef<number | null>(null);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    if (isOpen) {
      setLayoutMode(Math.floor(Math.random() * 3));
    }
  }, [isOpen]);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize, { passive: true });
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Prevent body scroll while modal is open (important for Safari)
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Swipe-to-close: swipe down > 80px closes the modal
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
    touchStartX.current = e.touches[0].clientX;
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (touchStartY.current === null || touchStartX.current === null) return;
    const deltaY = e.changedTouches[0].clientY - touchStartY.current;
    const deltaX = Math.abs(e.changedTouches[0].clientX - touchStartX.current);
    // Only trigger if mostly vertical swipe down
    if (deltaY > 80 && deltaX < 60) {
      onClose();
    }
    touchStartY.current = null;
    touchStartX.current = null;
  }, [onClose]);

  const arrowMoods: ArrowMood[] = [
    { 
      name: "Swirl", 
      arrows: [
        { d: "M-50,20 Q60,-10 90,40", top: "15%", right: "-10%", scale: 1.2 },
        { d: "M10,120 Q40,60 120,80", bottom: "10%", right: "-5%", scale: 1 }
      ]
    },
    { 
      name: "Focus", 
      arrows: [
        { d: "M100,20 L20,60", top: "10%", right: "10%", scale: 1.5, rotate: 15 },
        { d: "M0,0 L80,100", bottom: "15%", left: "5%", scale: 1.3, rotate: -10 }
      ]
    },
    { 
      name: "Scatter", 
      arrows: [
        { d: "M10,10 C40,40 60,0 90,30", top: "40%", right: "20%", scale: 0.8 },
        { d: "M90,90 Q50,50 10,90", top: "5%", left: "10%", scale: 1.1 },
      ]
    },
  ];

  const currentMood = arrowMoods[layoutMode % arrowMoods.length];

  // Build optimized Cloudinary URL with blur-up support
  const optimizedSrc = src.includes("cloudinary.com")
    ? src.replace("/upload/", "/upload/f_auto,q_auto:good,w_1600,c_limit/")
    : src;

  // Tiny blur placeholder for instant perceived load
  const blurPlaceholder = src.includes("cloudinary.com")
    ? src.replace("/upload/", "/upload/w_20,e_blur:200,q_10/")
    : undefined;

  // On mobile: use fade-only (no scale) for faster perceived open
  const modalVariants = isMobile
    ? {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
      }
    : {
        initial: { scale: 0.92, opacity: 0 },
        animate: { scale: 1, opacity: 1 },
        exit: { scale: 0.92, opacity: 0 },
      };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          // Restored backdrop-blur but kept it moderate for performance
          className="fixed inset-0 z-[100] bg-charcoal/80 backdrop-blur-md flex items-center justify-center p-4 md:p-10 cursor-pointer"
          onClick={onClose}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Animated Background Lilies & Motion */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* Moving Blurred Backdrop */}
            <motion.div 
              animate={{ 
                x: [-10, 10, -10],
                y: [-10, 10, -10],
                rotate: [0, 5, 0]
              }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute inset-[-10%] opacity-20 blur-3xl text-rose-gold/20 flex items-center justify-center"
            >
              <Lily size={800} />
            </motion.div>

            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: (i * 15) + "%", y: "110%" }}
                animate={{ 
                  opacity: [0, 0.2, 0.2, 0],
                  y: "-10%",
                  x: (i * 15 + (Math.random() * 20 - 10)) + "%",
                  rotate: [0, 90, -90, 180]
                }}
                transition={{ 
                  duration: 20 + Math.random() * 15,
                  repeat: Infinity,
                  delay: i * 2,
                  ease: "linear"
                }}
                className="absolute text-rose-gold/20"
              >
                <Lily size={60 + Math.random() * 100} />
              </motion.div>
            ))}
          </div>

          {/* Ambient Glow */}
          <div className="absolute inset-0 bg-gradient-radial from-rose-gold/5 to-transparent opacity-50" />
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 z-[110] w-11 h-11 rounded-full bg-white/15 hover:bg-rose-gold text-white flex items-center justify-center"
            aria-label="Close"
          >
            <X size={22} />
          </button>

          {/* Swipe hint — mobile only */}
          {isMobile && (
            <div className="absolute top-3 left-1/2 -translate-x-1/2 w-10 h-1 rounded-full bg-white/20" />
          )}

          <motion.div
            {...modalVariants}
            transition={{ duration: isMobile ? 0.18 : 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full h-full max-w-7xl flex flex-col lg:flex-row items-center justify-center gap-4 md:gap-10 cursor-default"
          >
            {/* Media Container */}
            <div className="relative flex-1 w-full h-full flex items-center justify-center min-h-0">
              {type === "image" ? (
                <div className="relative w-full h-full flex items-center justify-center p-2 md:p-4">
                  <div 
                    className="relative w-full h-full max-w-full max-h-full rounded-2xl md:rounded-[3rem] overflow-hidden shadow-2xl border border-white/10"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Image
                      src={optimizedSrc}
                      alt={title || "Portfolio Item"}
                      fill
                      className="object-contain"
                      sizes="(max-width: 768px) 100vw, 80vw"
                      priority
                      unoptimized
                      // Blur-up: shows a tiny blurred version instantly while HD loads
                      placeholder={blurPlaceholder ? "blur" : "empty"}
                      blurDataURL={blurPlaceholder}
                    />
                  </div>
                </div>
              ) : (
                <video
                  src={src.includes("cloudinary.com") ? src.replace("/upload/", "/upload/f_auto,q_auto:good/") : src}
                  controls
                  autoPlay
                  loop
                  playsInline
                  preload="auto"
                  {...{ "webkit-playsinline": "true" } as any}
                  className="max-w-full max-h-[70vh] md:max-h-full rounded-2xl md:rounded-[3rem] shadow-2xl border border-white/10"
                  onClick={(e) => e.stopPropagation()}
                />
              )}

              {/* Decorative arrows — desktop only to avoid overdrawing on mobile */}
              {!isMobile && currentMood.arrows.map((arrow, i) => (
                <div 
                  key={i}
                  className="hidden lg:block absolute pointer-events-none"
                  style={{ 
                    top: arrow.top, 
                    bottom: arrow.bottom, 
                    right: arrow.right, 
                    left: arrow.left,
                    transform: `scale(${arrow.scale}) rotate(${arrow.rotate || 0}deg)`
                  }}
                >
                  <motion.svg width="120" height="120" viewBox="0 0 100 100" fill="none"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 0.6 }}
                    transition={{ duration: 1.5, delay: 0.5 + (i * 0.2) }}>
                    <path d={arrow.d} stroke="#B8727D" strokeWidth="1.5" strokeLinecap="round" markerEnd={`url(#arrowhead-${layoutMode}-${i})`}/>
                    <defs>
                      <marker id={`arrowhead-${layoutMode}-${i}`} markerWidth="10" markerHeight="7" refX="0" refY="3.5" orient="auto">
                        <polygon points="0 0, 10 3.5, 0 7" fill="#B8727D" />
                      </marker>
                    </defs>
                  </motion.svg>
                </div>
              ))}
            </div>

            {/* Info Box */}
            {(title || description) && (
              <motion.div 
                initial={{ x: isMobile ? 0 : 20, y: isMobile ? 20 : 0, opacity: 0 }}
                animate={{ x: 0, y: 0, opacity: 1 }}
                transition={{ delay: 0.15, duration: 0.3 }}
                className="w-full lg:w-80 flex-shrink-0 relative"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="bg-rose-gold/90 rounded-3xl md:rounded-[2.5rem] p-5 md:p-8 shadow-2xl border border-white/20 text-left relative overflow-hidden">
                  {/* Subtle Sketch Pattern */}
                  <div className="absolute inset-0 opacity-10 pointer-events-none flex items-center justify-center">
                    <svg width="200" height="200" viewBox="0 0 100 100" fill="currentColor" className="text-white">
                      <path d="M50 10 C60 30 90 40 50 90 C10 40 40 30 50 10" />
                    </svg>
                  </div>

                  <div className="w-10 h-px bg-white/40 mb-3 md:mb-6" />
                  <h3 className="font-serif-custom text-xl md:text-3xl font-bold text-white mb-1 md:mb-2 italic leading-tight">
                    {title}
                  </h3>
                  {location && (
                    <div className="flex items-center gap-2 text-[10px] text-white/70 mb-4 uppercase tracking-widest font-bold">
                      <MapPin size={12} className="text-white" />
                      <span>{location}</span>
                    </div>
                  )}
                  <p className="text-white/90 text-sm md:text-base leading-relaxed font-medium">
                    {description}
                  </p>
                  <div className="mt-8 pt-6 border-t border-white/10 flex justify-between items-center">
                    <p className="text-[10px] tracking-[0.3em] uppercase text-white/50 font-bold">Project Details</p>
                    <div className="w-5 h-5 text-white/60">
                       <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" /></svg>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
