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
            </div>

            {/* Pink Info Box */}
            {(title || description) && (
              <motion.div 
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="w-full lg:w-80 flex-shrink-0"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="bg-rose-gold/90 backdrop-blur-xl rounded-[2rem] p-8 shadow-2xl border border-white/20 text-left">
                  <div className="w-10 h-1px bg-cream/40 mb-6" />
                  <h3 className="font-serif-custom text-2xl md:text-3xl font-bold text-cream mb-4 italic leading-tight">
                    {title}
                  </h3>
                  <p className="text-cream/90 text-sm md:text-base leading-relaxed font-medium">
                    {description}
                  </p>
                  <div className="mt-8 pt-6 border-t border-white/10">
                    <p className="text-[10px] tracking-[0.3em] uppercase text-cream/50 font-bold">Project Details</p>
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
