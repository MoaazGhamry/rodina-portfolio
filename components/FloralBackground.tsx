"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export const Lily = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 22V15" />
    <path d="M12 15C12 15 20 12 20 8C20 4 16 4 12 8C8 4 4 4 4 8C4 12 12 15 12 15Z" fill="currentColor" fillOpacity="0.2" />
    <path d="M12 8V2" />
    <path d="M9 20C9 20 9 17 12 16C15 17 15 20 15 20" />
  </svg>
);

export const Rose = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 22V12" />
    <path d="M12 12C12 12 19 10 20 7C21 4 18 3 15 5C12 7 12 12 12 12Z" fill="currentColor" fillOpacity="0.2" />
    <path d="M12 12C12 12 5 10 4 7C3 4 6 3 9 5C12 7 12 12 12 12Z" fill="currentColor" fillOpacity="0.2" />
    <circle cx="12" cy="7" r="3" fill="currentColor" fillOpacity="0.1" />
    <path d="M7 18C7 18 7 15 12 14C17 15 17 18 17 18" />
  </svg>
);

export const Tulip = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 20V10" />
    <path d="M12 10C12 10 16 6 16 4C16 2 14 2 12 2C10 2 8 2 8 4C8 6 12 10 12 10Z" fill="currentColor" fillOpacity="0.2" />
    <path d="M12 10C12 10 18 8 19 6C20 4 18 3 16 4" />
    <path d="M12 10C12 10 6 8 5 6C4 4 6 3 8 4" />
    <path d="M8 22C8 22 8 18 12 16C16 18 16 22 16 22" />
  </svg>
);

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
  const icons = { 
    rose: <Rose size={size} />, 
    tulip: <Tulip size={size} />, 
    lily: <Lily size={size} /> 
  };

  return (
    <motion.div
      className="fixed bottom-0 pointer-events-none text-rose-gold/10 dark:text-rose-gold/30"
      style={{ 
        left,
        willChange: "transform",
      }}
      initial={{ opacity: 0, y: 200, rotate: 0 }}
      animate={{ 
        opacity: [0, 1, 1, 0],
        y: type === "lily" ? [0, -600, -1200] : [0, -500, -1000], 
        x: type === "lily" ? [0, 150, -100, 300] : [0, -100, 150, -200],
        rotate: type === "lily" ? [0, 45, -45, 90] : [0, 180, -180, 360],
        scale: [0.8, 1.1, 0.9, 1],
      }}
      transition={{ 
        duration: type === "lily" ? duration * 1.2 : duration * 1.5,
        delay, 
        repeat: Infinity, 
        ease: "easeInOut"
      }}
    >
      {icons[type]}
    </motion.div>
  );
};

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

const mobileFlowers: { type: "rose" | "lily" | "tulip"; x: string; delay: number; duration: number; size: number }[] = [
  { type: "lily",  x: "10%", delay: 0,  duration: 30, size: 35 },
  { type: "rose",  x: "40%", delay: 5,  duration: 40, size: 30 },
  { type: "lily",  x: "80%", delay: 10, duration: 35, size: 40 },
];

export default function FloralBackground() {
  const [isDesktop, setIsDesktop] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
    const mediaQuery = window.matchMedia("(min-width: 768px)");
    setIsDesktop(mediaQuery.matches);
    const handleResize = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mediaQuery.addEventListener("change", handleResize);

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(motionQuery.matches);

    return () => mediaQuery.removeEventListener("change", handleResize);
  }, []);

  if (!isLoaded || reducedMotion) return null;

  const activeFlowers = isDesktop ? desktopFlowers : mobileFlowers;

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      {/* Dark Mode Pink Orbs */}
      <div className="absolute inset-0 opacity-0 dark:opacity-100 transition-opacity duration-1000">
        <motion.div
          animate={{
            x: [0, 30, -30, 0],
            y: [0, 50, -20, 0],
            scale: [1, 1.2, 0.9, 1],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[10%] left-[10%] w-[60vw] h-[60vw] md:w-[40vw] md:h-[40vw] bg-rose-gold/20 blur-[100px] md:blur-[120px] rounded-full"
        />
        <motion.div
          animate={{
            x: [0, -50, 40, 0],
            y: [0, -30, 60, 0],
            scale: [1, 0.8, 1.1, 1],
          }}
          transition={{ duration: 30, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-[10%] right-[10%] w-[50vw] h-[50vw] md:w-[35vw] md:h-[35vw] bg-rose-gold/15 blur-[80px] md:blur-[100px] rounded-full"
        />
      </div>

      {activeFlowers.map((f, i) => (
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
