"use client";

import { useRef, useState, useCallback } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { X, ZoomIn } from "lucide-react";

const photos = [
  {
    id: 1,
    src: "/6044320691735170420_121.jpg",
    title: "Café Aesthetic",
    description: "Matcha dreams & mango vibes",
    span: "row-span-2",
  },
  {
    id: 2,
    src: "/6044320691735170421_121.jpg",
    title: "Golden Hour",
    description: "Lifestyle & couple portraits",
    span: "",
  },
  {
    id: 3,
    src: "/6044320691735170422_121.jpg",
    title: "Night Urban",
    description: "City lights & quiet streets",
    span: "",
  },
  {
    id: 4,
    src: "/6044320691735170423_121.jpg",
    title: "Portrait Stories",
    description: "The quiet beauty of everyday moments",
    span: "row-span-2",
  },
  {
    id: 5,
    src: "/6044320691735170424_121.jpg",
    title: "Aesthetic Details",
    description: "Close-up textures & ambient light",
    span: "",
  },
  {
    id: 6,
    src: "/6046572491548855708_121.jpg",
    title: "Studio Moods",
    description: "Monochrome & dramatic lighting",
    span: "row-span-2",
  },
  {
    id: 7,
    src: "/6046572491548855709_121.jpg",
    title: "Cityscape",
    description: "Downtown Cairo energy",
    span: "",
  },
  {
    id: 8,
    src: "/6046572491548855710_121.jpg",
    title: "Vintage Vibe",
    description: "Film-inspired grain & warmth",
    span: "",
  },
  {
    id: 9,
    src: "/6046572491548855713_121.jpg",
    title: "Soft Morning",
    description: "Natural light & gentle tones",
    span: "row-span-2",
  },
  {
    id: 10,
    src: "/6046572491548855714_121.jpg",
    title: "Shadow Play",
    description: "Geometric shapes & high contrast",
    span: "",
  },
  {
    id: 11,
    src: "/6046572491548855715_121.jpg",
    title: "Elegant Portraits",
    description: "Capturing the essence of personality",
    span: "",
  },
  {
    id: 12,
    src: "/6046572491548855716_121.jpg",
    title: "Night Out",
    description: "Vibrant colors in the dark",
    span: "row-span-2",
  },
  {
    id: 13,
    src: "/6046572491548855717_121.jpg",
    title: "Minimalist Life",
    description: "Simplicity in every frame",
    span: "",
  },
  {
    id: 14,
    src: "/6046572491548855718_121.jpg",
    title: "Urban Explorers",
    description: "Street photography at its finest",
    span: "",
  },
  {
    id: 15,
    src: "/6046572491548855719_121.jpg",
    title: "Candid Moments",
    description: "Unfiltered & authentic storytelling",
    span: "row-span-2",
  },
  {
    id: 16,
    src: "/6046572491548855720_121.jpg",
    title: "Golden Tones",
    description: "Warmth & nostalgia",
    span: "",
  },
  {
    id: 17,
    src: "/6046572491548855721_121.jpg",
    title: "Texture Study",
    description: "The beauty in the small things",
    span: "",
  },
  {
    id: 18,
    src: "/6046572491548855722_121.jpg",
    title: "Night Vision",
    description: "Neon glow & electric vibes",
    span: "row-span-2",
  },
  {
    id: 19,
    src: "/6046572491548855723_121.jpg",
    title: "Dreamy Edits",
    description: "Soft focus & ethereal beauty",
    span: "",
  },
];

function PhotoCard({
  photo,
  index,
  onOpen,
}: {
  photo: (typeof photos)[0];
  index: number;
  onOpen: (p: (typeof photos)[0]) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.93 }}
      animate={inView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.7, delay: index * 0.09, ease: [0.22, 1, 0.36, 1] }}
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

export default function PhotoGallery() {
  const [selected, setSelected] = useState<(typeof photos)[0] | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const close = useCallback(() => setSelected(null), []);

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
            {photos.map((p, i) => (
              <PhotoCard key={p.id} photo={p} index={i} onOpen={setSelected} />
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[100] bg-charcoal/90 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={close}
          >
            <motion.div
              initial={{ scale: 0.88, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.88, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="relative max-w-2xl w-full max-h-[90vh] rounded-2xl overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative w-full" style={{ aspectRatio: "3/4" }}>
                <Image
                  src={selected.src}
                  alt={selected.title}
                  fill
                  className="object-cover"
                  sizes="100vw"
                />
              </div>
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-charcoal/80 to-transparent p-6">
                <p className="text-cream font-serif-custom font-semibold text-xl">
                  {selected.title}
                </p>
                <p className="text-cream/70 text-sm mt-1">{selected.description}</p>
              </div>
              <button
                onClick={close}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-charcoal/50 backdrop-blur-sm flex items-center justify-center text-cream hover:bg-rose-gold transition-colors"
              >
                <X size={18} />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
