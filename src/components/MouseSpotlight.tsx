'use client';

import { useEffect, useRef } from 'react';

export default function MouseSpotlight() {
  const ref = useRef<HTMLDivElement>(null);
  const rafId = useRef<number | null>(null);
  const mousePosition = useRef({ x: 0, y: 0 });

  useEffect(() => {
    let lastUpdate = 0;
    const throttleMs = 32;

    const updateBackground = () => {
      const now = performance.now();
      if (now - lastUpdate < throttleMs) {
        rafId.current = requestAnimationFrame(updateBackground);
        return;
      }
      lastUpdate = now;

      if (ref.current) {
        ref.current.style.background = `radial-gradient(600px circle at ${mousePosition.current.x}px ${mousePosition.current.y}px, rgba(6, 182, 212, 0.08), transparent 40%)`;
      }
      rafId.current = requestAnimationFrame(updateBackground);
    };

    const handleMouseMove = (e: MouseEvent) => {
      mousePosition.current = { x: e.clientX, y: e.clientY };
      if (rafId.current === null) {
        rafId.current = requestAnimationFrame(updateBackground);
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    rafId.current = requestAnimationFrame(updateBackground);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (rafId.current !== null) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, []);

  return (
    <div
      ref={ref}
      className="pointer-events-none fixed inset-0 z-30 hidden md:block"
      style={{
        willChange: 'background',
        contain: 'layout style paint',
      }}
    />
  );
}
