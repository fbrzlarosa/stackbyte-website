'use client';

import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import { ReactNode, useRef } from 'react';

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
}

export default function ScrollReveal({ children, className = "" }: ScrollRevealProps) {
  const ref = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    damping: 25,
    stiffness: 150,
    mass: 0.1,
    restDelta: 0.001,
  });

  const opacity = useTransform(smoothProgress, [0, 0.15], [0, 1]);
  const scale = useTransform(smoothProgress, [0, 0.15], [0.95, 1]);
  const y = useTransform(smoothProgress, [0, 0.15], [50, 0]);
  const parallaxY = useTransform(smoothProgress, [0, 1], [0, -40]);

  return (
    <motion.div
      ref={ref}
      style={{
        opacity,
        scale,
        y,
        willChange: 'transform, opacity',
      }}
      className={`relative ${className}`}
    >
      <motion.div 
        style={{ 
          y: parallaxY,
          willChange: 'transform',
        }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}
