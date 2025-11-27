'use client';

import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import { ReactNode } from 'react';

export default function ScrollBackground({ children }: { children: ReactNode }) {
  const { scrollYProgress } = useScroll();
  
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const opacity = useTransform(
    smoothProgress,
    [0, 0.25, 0.5, 0.75, 1],
    [0, 0.1, 0.15, 0.1, 0]
  );

  return (
    <div className="min-h-screen relative" style={{ contain: 'layout style paint' }}>
      <motion.div
        className="fixed inset-0 -z-10"
        style={{
          backgroundColor: '#0D1117',
          opacity,
          willChange: 'opacity',
        }}
      />
      <motion.div
        className="fixed inset-0 -z-10"
        style={{
          background: 'linear-gradient(180deg, #0F1419 0%, #1A1B26 50%, #191724 100%)',
          opacity: useTransform(smoothProgress, [0, 1], [0, 0.3]),
          willChange: 'opacity',
        }}
      />
      {children}
    </div>
  );
}
