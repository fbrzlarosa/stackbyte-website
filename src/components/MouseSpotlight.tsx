"use client";

import { useEffect, useRef } from "react";

// Half the side of the spotlight box. The glow fades to transparent at this
// radius, so a small box is visually identical to the old full-viewport layer.
const RADIUS = 120;

export default function MouseSpotlight() {
  const ref = useRef<HTMLDivElement>(null);
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Skip entirely on touch devices and for reduced motion: no mouse to follow.
    const skip = window.matchMedia(
      "(pointer: coarse), (prefers-reduced-motion: reduce)",
    );
    if (skip.matches) return;

    // Move a small composited layer with transform instead of repainting a
    // full-viewport radial-gradient on every mouse move.
    const handleMouseMove = (e: MouseEvent) => {
      if (rafId.current !== null) return; // one pending rAF at most
      const { clientX, clientY } = e;
      rafId.current = requestAnimationFrame(() => {
        el.style.transform = `translate3d(${clientX - RADIUS}px, ${clientY - RADIUS}px, 0)`;
        el.style.opacity = "1";
        rafId.current = null;
      });
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (rafId.current !== null) {
        cancelAnimationFrame(rafId.current);
        rafId.current = null;
      }
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-30 hidden overflow-hidden md:pointer-fine:motion-safe:block">
      <div
        ref={ref}
        className="absolute top-0 left-0 opacity-0"
        style={{
          width: RADIUS * 2,
          height: RADIUS * 2,
          background: `radial-gradient(${RADIUS}px circle at center, rgba(var(--primary-rgb), 0.03), rgba(var(--primary-rgb), 0) ${RADIUS}px)`,
          willChange: "transform",
          contain: "layout style paint",
        }}
      />
    </div>
  );
}
