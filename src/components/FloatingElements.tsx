"use client";

import { gsap } from "gsap";
import { useEffect, useMemo, useRef, useState } from "react";

export default function FloatingElements() {
  const [dimensions, setDimensions] = useState({ width: 1000, height: 1000 });
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const shapeRefs = useRef<(HTMLDivElement | null)[]>([]);
  const dotRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    setMounted(true);
    let rafId: number | null = null;
    
    const updateDimensions = () => {
      if (rafId) cancelAnimationFrame(rafId);
      
      rafId = requestAnimationFrame(() => {
        setDimensions({ width: window.innerWidth, height: window.innerHeight });
        rafId = null;
      });
    };
    
    updateDimensions();
    window.addEventListener("resize", updateDimensions, { passive: true });
    
    return () => {
      window.removeEventListener("resize", updateDimensions);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  const shapes = useMemo(() => {
    if (!mounted) return [];

    const seed = (n: number) => {
      const x = Math.sin(n) * 10000;
      return x - Math.floor(x);
    };

    return Array.from({ length: 4 }, (_, i) => {
      const baseSeed = i * 100;
      const numKeyframes = 6;
      return {
        id: i,
        initialX: seed(baseSeed) * dimensions.width,
        initialY: seed(baseSeed + 1) * dimensions.height,
        initialRotate: seed(baseSeed + 2) * 360,
        keyframes: {
          x: Array.from(
            { length: numKeyframes },
            (_, j) => seed(baseSeed + 3 + j) * dimensions.width
          ),
          y: Array.from(
            { length: numKeyframes },
            (_, j) => seed(baseSeed + 10 + j) * dimensions.height
          ),
        },
        durationX: 25 + i * 7 + seed(baseSeed + 20) * 10,
        durationY: 30 + i * 8 + seed(baseSeed + 21) * 10,
        durationRotate: 20 + i * 5,
      };
    });
  }, [dimensions.width, dimensions.height, mounted]);

  const dots = useMemo(() => {
    if (!mounted) return [];

    const seed = (n: number) => {
      const x = Math.sin(n) * 10000;
      return x - Math.floor(x);
    };

    return Array.from({ length: 5 }, (_, i) => {
      const baseSeed = i * 200;
      const numKeyframes = 5;
      return {
        id: i,
        initialX: seed(baseSeed) * dimensions.width,
        initialY: seed(baseSeed + 1) * dimensions.height,
        keyframes: {
          x: Array.from(
            { length: numKeyframes },
            (_, j) => seed(baseSeed + 2 + j) * dimensions.width
          ),
          y: Array.from(
            { length: numKeyframes },
            (_, j) => seed(baseSeed + 10 + j) * dimensions.height
          ),
        },
        durationX: 12 + i * 3 + seed(baseSeed + 20) * 5,
        durationY: 15 + i * 4 + seed(baseSeed + 21) * 5,
      };
    });
  }, [dimensions.width, dimensions.height, mounted]);

  useEffect(() => {
    if (
      !mounted ||
      shapes.length === 0 ||
      dots.length === 0 ||
      !containerRef.current
    )
      return;

    const ctx = gsap.context(() => {
      shapes.forEach((shape, i) => {
        const shapeEl = shapeRefs.current[i];
        if (!shapeEl) return;

        gsap.set(shapeEl, {
          x: shape.initialX,
          y: shape.initialY,
          rotation: shape.initialRotate,
          opacity: 0.1,
        });

        gsap.to(shapeEl, {
          keyframes: shape.keyframes.x.map((x) => ({ x })),
          duration: shape.durationX,
          repeat: -1,
          ease: "sine.inOut",
        });

        gsap.to(shapeEl, {
          keyframes: shape.keyframes.y.map((y) => ({ y })),
          duration: shape.durationY,
          repeat: -1,
          ease: "sine.inOut",
        });

        gsap.to(shapeEl, {
          rotation: 360,
          duration: shape.durationRotate,
          repeat: -1,
          ease: "none",
        });
      });

      dots.forEach((dot, i) => {
        const dotEl = dotRefs.current[i];
        if (!dotEl) return;

        gsap.set(dotEl, {
          x: dot.initialX,
          y: dot.initialY,
        });

        gsap.to(dotEl, {
          keyframes: dot.keyframes.x.map((x) => ({ x })),
          duration: dot.durationX,
          repeat: -1,
          ease: "sine.inOut",
        });

        gsap.to(dotEl, {
          keyframes: dot.keyframes.y.map((y, idx) => ({
            y,
            opacity: idx % 2 === 0 ? 0.3 : 0.6,
          })),
          duration: dot.durationY,
          repeat: -1,
          ease: "power1.inOut",
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, [shapes, dots, mounted]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden pointer-events-none hidden md:block"
      style={{ contain: "layout style paint" }}
    >
      {shapes.map((shape, i) => (
        <div
          key={shape.id}
          ref={(el) => {
            shapeRefs.current[i] = el;
          }}
          className="absolute w-20 h-20 border border-primary/20 rounded-2xl backdrop-blur-sm"
          style={{
            opacity: 0.1,
            willChange: "transform",
          }}
        />
      ))}

      {dots.map((dot, i) => (
        <div
          key={`dot-${dot.id}`}
          ref={(el) => {
            dotRefs.current[i] = el;
          }}
          className="absolute w-2 h-2 bg-primary/30 rounded-full"
          style={{
            willChange: "transform, opacity",
          }}
        />
      ))}
    </div>
  );
}
