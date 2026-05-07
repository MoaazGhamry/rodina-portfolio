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
            className="relative w-full h-full max-w-6xl flex flex-col items-center justify-center pointer-events-none"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full h-full flex items-center justify-center pointer-events-auto">
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
                  className="max-w-full max-h-full rounded-lg shadow-2xl"
                />
              )}
            </div>

            {/* Info Overlay */}
            {(title || description) && (
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-2xl p-8 text-center pointer-events-none">
                <div className="bg-charcoal/40 backdrop-blur-md rounded-2xl p-6 border border-white/10">
                  <h3 className="font-serif-custom text-2xl font-bold text-cream mb-2 italic">
                    {title}
                  </h3>
                  <p className="text-cream/70 text-sm leading-relaxed">
                    {description}
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
