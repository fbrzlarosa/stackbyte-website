'use client';

import { motion, useScroll, useTransform, useSpring, MotionValue } from 'framer-motion';
import { useRef, ReactNode } from 'react';

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
}

export default function ScrollReveal({ children, className = "" }: ScrollRevealProps) {
  const ref = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  // Smooth spring physics for scroll mapping
  const smoothProgress = useSpring(scrollYProgress, {
    damping: 30,
    stiffness: 100,
    mass: 0.5
  });

  // Entrance Effects
  const opacity = useTransform(smoothProgress, [0, 0.15], [0, 1]);
  const scale = useTransform(smoothProgress, [0, 0.15], [0.95, 1]);
  const y = useTransform(smoothProgress, [0, 0.15], [50, 0]);

  // Parallax Effect (continues throughout scroll)
  // Elements move slightly faster/slower than scroll for depth
  const parallaxY = useTransform(smoothProgress, [0, 1], [0, -40]);

  return (
    <motion.div
      ref={ref}
      style={{
        opacity,
        scale,
        y,
      }}
      className={`relative ${className}`}
    >
      <motion.div style={{ y: parallaxY }}>
        {children}
      </motion.div>
    </motion.div>
  );
}
