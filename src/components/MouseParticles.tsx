'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  text: string;
}

const codeSnippets = [
  "const", "let", "var", "function", "=>", "return", "if", "else", 
  "import", "export", "from", "async", "await", "try", "catch",
  "{}", "[]", "()", ";", "&&", "||", "==", "!=", "+=", "++"
];

export default function MouseParticles() {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    let particleId = 0;

    const handleMouseMove = (e: MouseEvent) => {
      if (Math.random() > 0.2) return; // Throttling

      const newParticle = {
        id: particleId++,
        x: e.clientX,
        y: e.clientY,
        text: codeSnippets[Math.floor(Math.random() * codeSnippets.length)]
      };

      setParticles((prev) => [...prev, newParticle].slice(-8)); 
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  useEffect(() => {
    if (particles.length > 0) {
      const timeout = setTimeout(() => {
        setParticles((prev) => prev.slice(1));
      }, 600); 
      return () => clearTimeout(timeout);
    }
  }, [particles]);

  return (
    <div className="fixed inset-0 pointer-events-none z-40 hidden md:block overflow-hidden">
      <AnimatePresence>
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute text-primary/60 font-mono text-[10px] select-none whitespace-nowrap"
            style={{
                left: particle.x,
                top: particle.y,
                translateX: "-50%", // Center horizontally relative to cursor point
                translateY: "-50%"  // Center vertically relative to cursor point
            }}
            initial={{
              opacity: 0,
              scale: 0.5,
            }}
            animate={{
              opacity: 0.8,
              scale: 1,
              y: 15 // Slight fall
            }}
            exit={{ 
              opacity: 0,
              y: 30, // Continue falling
              scale: 0.5
            }}
            transition={{
              duration: 0.6,
              ease: 'easeOut',
            }}
          >
            {particle.text}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
