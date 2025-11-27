'use client';

import { motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';

export default function FloatingElements() {
  const [dimensions, setDimensions] = useState({ width: 1000, height: 1000 });

  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
    };
    updateDimensions();
    window.addEventListener('resize', updateDimensions, { passive: true });
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  const shapes = useMemo(() => {
    return Array.from({ length: 5 }, (_, i) => ({
      id: i,
      initialX: Math.random() * dimensions.width,
      initialY: Math.random() * dimensions.height,
      initialRotate: Math.random() * 360,
      keyframes: {
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
      },
      duration: 20 + i * 5,
    }));
  }, [dimensions.width, dimensions.height]);

  const dots = useMemo(() => {
    return Array.from({ length: 15 }, (_, i) => ({
      id: i,
      initialX: Math.random() * dimensions.width,
      initialY: Math.random() * dimensions.height,
      keyframes: {
        y: [
          Math.random() * dimensions.height,
          Math.random() * dimensions.height,
          Math.random() * dimensions.height,
        ],
      },
      duration: 10 + i * 2,
    }));
  }, [dimensions.width, dimensions.height]);

  return (
    <div 
      className="absolute inset-0 overflow-hidden pointer-events-none hidden md:block"
      style={{ contain: 'layout style paint' }}
    >
      {shapes.map((shape) => (
        <motion.div
          key={shape.id}
          className="absolute w-20 h-20 border border-primary/20 rounded-2xl backdrop-blur-sm"
          initial={{
            x: shape.initialX,
            y: shape.initialY,
            rotate: shape.initialRotate,
          }}
          animate={{
            x: shape.keyframes.x,
            y: shape.keyframes.y,
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: shape.duration,
            repeat: Infinity,
            ease: 'linear',
          }}
          style={{
            opacity: 0.1,
            willChange: 'transform',
          }}
        />
      ))}

      {dots.map((dot) => (
        <motion.div
          key={`dot-${dot.id}`}
          className="absolute w-2 h-2 bg-primary/30 rounded-full"
          initial={{
            x: dot.initialX,
            y: dot.initialY,
          }}
          animate={{
            y: dot.keyframes.y,
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: dot.duration,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{
            willChange: 'transform, opacity',
          }}
        />
      ))}
    </div>
  );
}
