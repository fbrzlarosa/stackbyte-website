"use client";

import { motion, MotionValue, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";

interface ScrollingBackgroundTextProps {
  progress: MotionValue<number>;
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
    const handleResize = () => {
      if (elementRef.current) {
        // Measure the full scroll width of the text
        setWidth(elementRef.current.scrollWidth);
      }
      setWindowWidth(window.innerWidth);
    };

    // Initial measurement
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Animation logic:
  // Start: windowWidth (starts just off-screen to the right)
  // End: -width (scrolls completely off-screen to the left)
  // This ensures the entire text traverses the viewport from start to finish.
  const x = useTransform(progress, [0, 1], [windowWidth, -width]);

  return (
    <motion.div
      ref={elementRef}
      className={className}
      style={{
        ...style,
        x,
      }}
    >
      {children}
    </motion.div>
  );
}

