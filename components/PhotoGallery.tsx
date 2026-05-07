"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { X, ZoomIn } from "lucide-react";
import { usePhotos, Photo } from "@/hooks/usePhotos";
import { migratePhotos } from "@/lib/migrate";

function PhotoCard({
  photo,
  index,
  onOpen,
}: {
  photo: Photo;
  index: number;
  onOpen: (p: Photo) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.93 }}
      animate={inView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.7, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
      className={`relative overflow-hidden rounded-2xl cursor-pointer group shadow-md ${photo.span}`}
      style={{ minHeight: 200 }}
      onClick={() => onOpen(photo)}
    >
      <Image
        src={photo.src}
        alt={photo.title}
        fill
        className="object-cover transition-transform duration-700 group-hover:scale-110"
        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
      />

      {/* Hover overlay */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-t from-rose-deep/80 via-rose-gold/30 to-transparent flex flex-col justify-end p-4"
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.35 }}
      >
        <div className="flex items-end justify-between">
          <div>
            <p className="text-cream font-serif-custom font-semibold text-base leading-tight">
              {photo.title}
            </p>
            <p className="text-cream/80 text-xs mt-0.5">{photo.description}</p>
          </div>
          <div className="w-8 h-8 rounded-full bg-cream/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
            <ZoomIn size={14} className="text-cream" />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

import { MediaModal } from "./MediaModal";

export default function PhotoGallery() {
  const { photos, loading } = usePhotos();
  const [selected, setSelected] = useState<Photo | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  useEffect(() => {
    // Run migration only once if Firestore is empty
    migratePhotos();
  }, []);

  return (
    <>
      <section id="gallery" className="py-24 md:py-32 bg-cream">
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
              Photography
            </p>
            <h2 className="font-serif-custom text-4xl md:text-5xl font-bold text-charcoal mb-4">
              Captured{" "}
              <span className="text-gradient-rose italic">Moments</span>
            </h2>
            <div className="section-divider mx-auto mb-5" />
            <p className="text-sm text-muted max-w-lg mx-auto leading-relaxed">
              Still frames that breathe — from café aesthetics to urban nights.
              Click any photo to expand.
            </p>
          </motion.div>

          {/* Masonry-style grid */}
          <div
            className="grid grid-cols-2 md:grid-cols-3 gap-4 auto-rows-[200px]"
          >
            {loading ? (
              <div className="col-span-full flex items-center justify-center py-20">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                  className="w-8 h-8 border-2 border-rose-gold/20 border-t-rose-gold rounded-full"
                />
              </div>
            ) : (
              photos.map((p, i) => (
                <PhotoCard key={p.id} photo={p} index={i} onOpen={setSelected} />
              ))
            )}
          </div>
        </div>
      </section>

      {/* Universal Media Modal */}
      <MediaModal
        isOpen={!!selected}
        onClose={() => setSelected(null)}
        type="image"
        src={selected?.src || ""}
        title={selected?.title}
        description={selected?.description}
      />
    </>
  );
}
