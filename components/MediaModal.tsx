"use client";

import { useState, useEffect } from "react";
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

export function MediaModal({ isOpen, onClose, type, src, title, description }: MediaModalProps) {
  const [layoutMode, setLayoutMode] = useState(0);

  // Pick a random layout on open
  useEffect(() => {
    if (isOpen) {
      setLayoutMode(Math.floor(Math.random() * 3));
    }
  }, [isOpen]);

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
        { d: "M50,10 L50,90", bottom: "5%", right: "40%", scale: 0.9, rotate: 45 }
      ]
    }
  ];

  const currentMood = arrowMoods[layoutMode];

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
          {/* Decorative Background "Garden" */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20 transition-all duration-1000">
             {/* Randomized Lilies */}
             <motion.div 
               animate={{ 
                 y: layoutMode === 0 ? [0, -20, 0] : [0, 20, 0],
                 rotate: layoutMode === 1 ? [0, 360] : 0 
               }} 
               transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
               className={`absolute w-48 h-48 ${layoutMode === 0 ? "top-10 left-10" : "bottom-10 right-1/4"}`}
             >
                <svg viewBox="0 0 100 100" fill="#B8727D"><path d="M50 10 C60 30 90 40 50 90 C10 40 40 30 50 10" /></svg>
             </motion.div>
             
             <motion.div 
               animate={{ scale: [1, 1.2, 1] }} 
               transition={{ duration: 8, repeat: Infinity }}
               className={`absolute w-64 h-64 ${layoutMode === 2 ? "top-1/4 right-10" : "bottom-20 left-20"}`}
             >
                <svg viewBox="0 0 100 100" fill="#B8727D"><path d="M50 10 C60 30 90 40 50 90 C10 40 40 30 50 10" /></svg>
             </motion.div>
          </div>

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

              {/* Randomized Arrow Mood System */}
              {currentMood.arrows.map((arrow, i) => (
                <div 
                  key={i}
                  className="hidden lg:block absolute pointer-events-none transition-all duration-1000"
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

            {/* Pink Info Box - ALWAYS PINK */}
            {(title || description) && (
              <motion.div 
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="w-full lg:w-80 flex-shrink-0 relative"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Random Shape Near Box */}
                <div className="absolute -top-10 -right-10 w-20 h-20 opacity-20 animate-spin-slow">
                   <svg viewBox="0 0 100 100" fill="white"><path d="M50 0 L60 40 L100 50 L60 60 L50 100 L40 60 L0 50 L40 40 Z" /></svg>
                </div>

                <div className="bg-rose-gold/90 backdrop-blur-xl rounded-[2.5rem] p-8 shadow-2xl border border-white/20 text-left relative overflow-hidden">
                  {/* Subtle Sketch Pattern */}
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
                    <div className="w-5 h-5 text-rose-gold">
                       <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" /></svg>
                    </div>
                  </div>
                </div>

                {/* Randomized Shapes Below Box */}
                <div className={`absolute ${layoutMode === 1 ? "-top-12 -left-12" : "-bottom-12 -left-10"} w-32 h-32 opacity-10 pointer-events-none text-white transition-all duration-1000`}>
                   <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="5 5">
                      <circle cx="50" cy="50" r={layoutMode === 0 ? 30 : 45} />
                      <path d="M0 50 L100 50 M50 0 L50 100" />
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
