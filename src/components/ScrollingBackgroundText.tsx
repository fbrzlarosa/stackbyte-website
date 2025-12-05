"use client";

import { gsap } from "gsap";
import { useEffect, useRef, useState } from "react";

interface ScrollingBackgroundTextProps {
  progress: number;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export default function ScrollingBackgroundText({
  progress,
  children,
  className,
  style,
}: ScrollingBackgroundTextProps) {
  const elementRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const [windowWidth, setWindowWidth] = useState(0);

  useEffect(() => {
    let rafId: number | null = null;

    const handleResize = () => {
      if (rafId) cancelAnimationFrame(rafId);

      rafId = requestAnimationFrame(() => {
        if (elementRef.current) {
          const scrollWidth = elementRef.current.scrollWidth;
          setWidth(scrollWidth);
        }
        setWindowWidth(window.innerWidth);
        rafId = null;
      });
    };

    requestAnimationFrame(() => {
      handleResize();
    });

    window.addEventListener("resize", handleResize, { passive: true });
    return () => {
      window.removeEventListener("resize", handleResize);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  useEffect(() => {
    if (!elementRef.current || width === 0 || windowWidth === 0) return;

    const x = windowWidth + progress * (-width - windowWidth);
    gsap.set(elementRef.current, { x });
  }, [progress, width, windowWidth]);

  return (
    <div ref={elementRef} className={className} style={style}>
      {children}
    </div>
  );
}
