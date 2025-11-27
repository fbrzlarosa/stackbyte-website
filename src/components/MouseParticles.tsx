'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

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
  const lastTime = useRef(0);
  const particleId = useRef(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const now = performance.now();
      if (now - lastTime.current < 100) return;
      lastTime.current = now;

      if (Math.random() > 0.3) return;

      const newParticle = {
        id: particleId.current++,
        x: e.clientX,
        y: e.clientY,
        text: codeSnippets[Math.floor(Math.random() * codeSnippets.length)]
      };

      setParticles((prev) => [...prev, newParticle].slice(-6)); 
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

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
    <div 
      className="fixed inset-0 pointer-events-none z-40 hidden md:block overflow-hidden"
      style={{ contain: 'layout style paint' }}
    >
      <AnimatePresence>
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute text-primary/60 font-mono text-[10px] select-none whitespace-nowrap"
            style={{
              left: particle.x,
              top: particle.y,
              x: "-50%",
              y: "-50%",
              willChange: 'transform, opacity',
            }}
            initial={{
              opacity: 0,
              scale: 0.5,
            }}
            animate={{
              opacity: 0.8,
              scale: 1,
              y: "-50%",
            }}
            exit={{ 
              opacity: 0,
              y: "-50%",
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
