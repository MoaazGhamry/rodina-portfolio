"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const Flower = ({ 
  type, 
  left,
  delay = 0, 
  duration = 20, 
  size = 40 
}: { 
  type: "rose" | "lily" | "tulip"; 
  left: string;
  delay?: number; 
  duration?: number;
  size?: number;
}) => {
  const Tulip = () => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20V10" />
      <path d="M12 10C12 10 16 6 16 4C16 2 14 2 12 2C10 2 8 2 8 4C8 6 12 10 12 10Z" fill="currentColor" fillOpacity="0.2" />
      <path d="M12 10C12 10 18 8 19 6C20 4 18 3 16 4" />
      <path d="M12 10C12 10 6 8 5 6C4 4 6 3 8 4" />
      <path d="M8 22C8 22 8 18 12 16C16 18 16 22 16 22" />
    </svg>
  );

  const Rose = () => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22V12" />
      <path d="M12 12C12 12 19 10 20 7C21 4 18 3 15 5C12 7 12 12 12 12Z" fill="currentColor" fillOpacity="0.2" />
      <path d="M12 12C12 12 5 10 4 7C3 4 6 3 9 5C12 7 12 12 12 12Z" fill="currentColor" fillOpacity="0.2" />
      <circle cx="12" cy="7" r="3" fill="currentColor" fillOpacity="0.1" />
      <path d="M7 18C7 18 7 15 12 14C17 15 17 18 17 18" />
    </svg>
  );

  const Lily = () => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22V15" />
      <path d="M12 15C12 15 20 12 20 8C20 4 16 4 12 8C8 4 4 4 4 8C4 12 12 15 12 15Z" fill="currentColor" fillOpacity="0.2" />
      <path d="M12 8V2" />
      <path d="M9 20C9 20 9 17 12 16C15 17 15 20 15 20" />
    </svg>
  );

  const icons = { rose: <Rose />, tulip: <Tulip />, lily: <Lily /> };

  return (
    <motion.div
      className="fixed bottom-0 pointer-events-none text-rose-gold/10"
      style={{ 
        left,
        willChange: "transform",
      }}
      initial={{ opacity: 0, y: 200, rotate: 0 }}
      animate={{ 
        opacity: [0, 1, 1, 0],
        y: type === "lily" ? [0, -1200] : [0, -1000], 
        x: type === "lily" ? [0, 300] : [0, -200],
        rotate: type === "lily" ? [0, 15, -15, 45] : [0, 90, -90, 360],
      }}
      transition={{ 
        duration: type === "lily" ? duration * 0.8 : duration,
        delay, 
        repeat: Infinity, 
        ease: "linear"
      }}
    >
      {icons[type]}
    </motion.div>
  );
};

// Reduced set — 8 flowers for desktop only (mobile renders none)
const desktopFlowers: { type: "rose" | "lily" | "tulip"; x: string; delay: number; duration: number; size: number }[] = [
  { type: "rose",  x: "5%",  delay: 0,  duration: 35, size: 40 },
  { type: "lily",  x: "18%", delay: 7,  duration: 45, size: 50 },
  { type: "tulip", x: "32%", delay: 3,  duration: 30, size: 35 },
  { type: "rose",  x: "48%", delay: 12, duration: 40, size: 45 },
  { type: "lily",  x: "62%", delay: 5,  duration: 42, size: 55 },
  { type: "tulip", x: "75%", delay: 9,  duration: 28, size: 38 },
  { type: "rose",  x: "85%", delay: 15, duration: 38, size: 42 },
  { type: "lily",  x: "95%", delay: 2,  duration: 50, size: 48 },
];

export default function FloralBackground() {
  const [isDesktop, setIsDesktop] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    // Check screen size
    const mediaQuery = window.matchMedia("(min-width: 768px)");
    setIsDesktop(mediaQuery.matches);
    const handleResize = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mediaQuery.addEventListener("change", handleResize);

    // Respect prefers-reduced-motion
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(motionQuery.matches);

    return () => mediaQuery.removeEventListener("change", handleResize);
  }, []);

  // Don't render on mobile or for users who prefer reduced motion
  if (!isDesktop || reducedMotion) return null;

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      {desktopFlowers.map((f, i) => (
        <Flower
          key={i}
          type={f.type}
          left={f.x}
          delay={f.delay}
          duration={f.duration}
          size={f.size}
        />
      ))}
    </div>
  );
}
