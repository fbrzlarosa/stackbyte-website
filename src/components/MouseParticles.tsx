"use client";

import { gsap } from "gsap";
import { useEffect, useRef, useState } from "react";

interface Particle {
  id: number;
  x: number;
  y: number;
  text: string;
}

const codeSnippets = [
  "const",
  "let",
  "var",
  "function",
  "=>",
  "return",
  "if",
  "else",
  "import",
  "export",
  "from",
  "async",
  "await",
  "try",
  "catch",
  "{}",
  "[]",
  "()",
  ";",
  "&&",
  "||",
  "==",
  "!=",
  "+=",
  "++",
];

export default function MouseParticles() {
  const [particles, setParticles] = useState<Particle[]>([]);
  const lastTime = useRef(0);
  const particleId = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const particleRefs = useRef<Map<number, HTMLDivElement>>(new Map());
  const animatedParticles = useRef<Set<number>>(new Set());

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
        text: codeSnippets[Math.floor(Math.random() * codeSnippets.length)],
      };

      setParticles((prev) => [...prev, newParticle].slice(-6));
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  useEffect(() => {
    const currentIds = new Set(particles.map((p) => p.id));

    particles.forEach((particle) => {
      const element = particleRefs.current.get(particle.id);
      if (!element) return;

      if (!animatedParticles.current.has(particle.id)) {
        gsap.set(element, {
          x: particle.x,
          y: particle.y,
          xPercent: -50,
          yPercent: -50,
          opacity: 0,
          scale: 0.5,
        });

        gsap.to(element, {
          opacity: 0.8,
          scale: 1,
          duration: 0.6,
          ease: "power2.out",
        });

        animatedParticles.current.add(particle.id);
      }
    });

    animatedParticles.current.forEach((id) => {
      if (!currentIds.has(id)) {
        animatedParticles.current.delete(id);
      }
    });
  }, [particles]);

  useEffect(() => {
    if (particles.length > 0) {
      const timeout = setTimeout(() => {
        const firstParticle = particles[0];
        const element = particleRefs.current.get(firstParticle.id);
        if (element) {
          gsap.to(element, {
            opacity: 0,
            scale: 0.5,
            duration: 0.6,
            ease: "power2.out",
            onComplete: () => {
              animatedParticles.current.delete(firstParticle.id);
              setParticles((prev) => prev.slice(1));
            },
          });
        } else {
          animatedParticles.current.delete(firstParticle.id);
          setParticles((prev) => prev.slice(1));
        }
      }, 600);
      return () => clearTimeout(timeout);
    }
  }, [particles]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-40 hidden md:block overflow-hidden"
      style={{ contain: "layout style paint" }}
    >
      {particles.map((particle) => (
        <div
          key={particle.id}
          ref={(el) => {
            if (el) {
              particleRefs.current.set(particle.id, el);
            } else {
              particleRefs.current.delete(particle.id);
            }
          }}
          className="absolute text-primary/60 font-mono text-[10px] select-none whitespace-nowrap touch-none"
          style={{
            willChange: "transform, opacity",
          }}
        >
          {particle.text || ""}
        </div>
      ))}
    </div>
  );
}
