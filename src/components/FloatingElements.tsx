'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function FloatingElements() {
  const [dimensions, setDimensions] = useState({ width: 1000, height: 1000 });

  useEffect(() => {
    setDimensions({ width: window.innerWidth, height: window.innerHeight });
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Floating geometric shapes */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-20 h-20 border border-primary/20 rounded-2xl backdrop-blur-sm"
          initial={{
            x: Math.random() * dimensions.width,
            y: Math.random() * dimensions.height,
            rotate: Math.random() * 360,
          }}
          animate={{
            x: [
              Math.random() * dimensions.width,
              Math.random() * dimensions.width,
              Math.random() * dimensions.width,
            ],
            y: [
              Math.random() * dimensions.height,
              Math.random() * dimensions.height,
              Math.random() * dimensions.height,
            ],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20 + i * 5,
            repeat: Infinity,
            ease: 'linear',
          }}
          style={{
            opacity: 0.1,
          }}
        />
      ))}

      {/* Floating dots */}
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={`dot-${i}`}
          className="absolute w-2 h-2 bg-primary/30 rounded-full"
          initial={{
            x: Math.random() * dimensions.width,
            y: Math.random() * dimensions.height,
          }}
          animate={{
            y: [
              Math.random() * dimensions.height,
              Math.random() * dimensions.height,
              Math.random() * dimensions.height,
            ],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 10 + i * 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}
