'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { ReactNode } from 'react';

export default function ScrollBackground({ children }: { children: ReactNode }) {
  const { scrollYProgress } = useScroll();

  // Trasformiamo il background attraverso diverse tonalità
  const backgroundColor = useTransform(
    scrollYProgress,
    [0, 0.25, 0.5, 0.75, 1],
    [
      '#0D1117', // Dark blue-black (hero)
      '#0F1419', // Slightly lighter
      '#1A1B26', // Violet tint
      '#191724', // Purple tint
      '#0D1117', // Back to original
    ]
  );

  return (
    <motion.div style={{ backgroundColor }} className="min-h-screen">
      {children}
    </motion.div>
  );
}
