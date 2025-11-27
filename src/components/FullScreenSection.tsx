"use client";

import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { forwardRef, useImperativeHandle, useRef } from "react";

interface FullScreenSectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  ignoreOpacity?: boolean;
}

const FullScreenSection = forwardRef<HTMLElement, FullScreenSectionProps>(
  ({ children, className = "", id, ignoreOpacity = false }, forwardedRef) => {
    const internalRef = useRef<HTMLElement>(null);

    useImperativeHandle(
      forwardedRef,
      () => internalRef.current as HTMLElement,
      []
    );

    const { scrollYProgress } = useScroll({
      target: internalRef,
      offset: ["start end", "end start"],
    });

    // 3D Tilt Effect based on scroll position relative to viewport center
    const tiltX = useTransform(scrollYProgress, [0, 0.5, 1], [5, 0, -5]);
    const opacity = useTransform(
      scrollYProgress,
      [0, 0.2, 0.8, 1],
      [0, 1, 1, 0]
    );
    const scale = useTransform(
      scrollYProgress,
      [0, 0.2, 0.8, 1],
      [0.9, 1, 1, 0.9]
    );

    // Spring smoothing
    const springConfig = { stiffness: 200, damping: 30, mass: 1 };
    const smoothTilt = useSpring(tiltX, springConfig);
    const smoothScale = useSpring(scale, springConfig);
    const smoothOpacity = useSpring(opacity, springConfig);

    return (
      <motion.section
        ref={internalRef}
        id={id}
        style={{
          opacity: ignoreOpacity ? 1 : smoothOpacity,
          // scale: smoothScale,
          rotateX: smoothTilt,
          perspective: "1000px",
        }}
        className={`min-h-screen flex items-center justify-center relative ${className}`}
      >
        {children}
      </motion.section>
    );
  }
);

FullScreenSection.displayName = "FullScreenSection";

export default FullScreenSection;
