"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useState } from "react";

export default function CustomCursor() {
  const [isHovering, setIsHovering] = useState(false);
  const [hoveredElementType, setHoveredElementType] = useState<
    "default" | "link" | "text" | "image"
  >("default");

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  // Spring config for smooth but snappy movement
  const springConfig = { damping: 40, stiffness: 600, mass: 0.2 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      // Determine element type for contextual animations
      if (
        target.tagName === "A" ||
        target.tagName === "BUTTON" ||
        target.closest("a") ||
        target.closest("button") ||
        target.closest('[role="button"]')
      ) {
        setIsHovering(true);
        setHoveredElementType("link");
      } else if (
        target.tagName === "P" ||
        target.tagName === "H1" ||
        target.tagName === "H2" ||
        target.tagName === "H3" ||
        target.tagName === "SPAN"
      ) {
        setIsHovering(true);
        setHoveredElementType("text");
      } else if (target.tagName === "IMG" || target.tagName === "SVG") {
        setIsHovering(true);
        setHoveredElementType("image");
      } else {
        setIsHovering(false);
        setHoveredElementType("default");
      }
    };

    window.addEventListener("mousemove", moveCursor);
    window.addEventListener("mouseover", handleMouseOver);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, [cursorX, cursorY]);

  // Dynamic Bracket Animation Variants
  // const bracketVariants = { ... } // unused, using inline variants

  return (
    <motion.div
      className="fixed top-0 left-0 pointer-events-none z-9999 hidden md:block mix-blend-difference"
      style={{
        x: cursorXSpring,
        y: cursorYSpring,
        translateX: "-50%",
        translateY: "-50%",
      }}
    >
      {/* 
        Design: "Intelligent Code Bracket Cursor"
        Adapts contextually to what you're hovering over.
      */}
      <div className="relative flex items-center justify-center">
        {/* Left Bracket < */}
        <motion.div
          className="font-mono font-bold text-xl select-none"
          initial="default"
          animate={isHovering ? hoveredElementType : "default"}
          variants={{
            default: { x: -2, color: "var(--primary)" },
            link: { x: -16, color: "var(--primary)" },
            text: { x: -6, color: "var(--primary)", opacity: 0.5 },
            image: { x: -24, color: "var(--primary)" },
          }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
        >
          &lt;
        </motion.div>

        {/* Central Element - Contextual */}
        <div className="relative flex items-center justify-center h-5">
          {/* I-Beam (Default/Text) */}
          <motion.div
            className="w-[2px] rounded-full absolute"
            style={{ backgroundColor: "var(--primary)" }}
            animate={{
              height:
                hoveredElementType === "text"
                  ? 24
                  : hoveredElementType === "default"
                  ? 20
                  : 0,
              opacity:
                hoveredElementType === "default" ||
                hoveredElementType === "text"
                  ? 1
                  : 0,
            }}
          />

          {/* Action Dot (Link) */}
          <motion.div
            className="rounded-full absolute"
            style={{ backgroundColor: "var(--primary)" }}
            animate={{
              width: hoveredElementType === "link" ? 8 : 0,
              height: hoveredElementType === "link" ? 8 : 0,
              opacity: hoveredElementType === "link" ? 1 : 0,
            }}
          />

          {/* Scan Frame (Image) */}
          <motion.div
            className="border border-primary absolute rounded-sm"
            style={{ borderColor: "var(--primary)" }}
            animate={{
              width: hoveredElementType === "image" ? 24 : 0,
              height: hoveredElementType === "image" ? 24 : 0,
              opacity: hoveredElementType === "image" ? 1 : 0,
              rotate: hoveredElementType === "image" ? 90 : 0,
            }}
          />
        </div>

        {/* Right Bracket > */}
        <motion.div
          className="font-mono font-bold text-xl select-none"
          initial="default"
          animate={isHovering ? hoveredElementType : "default"}
          variants={{
            default: { x: 2, color: "var(--primary)" },
            link: { x: 16, color: "var(--primary)" },
            text: { x: 6, color: "var(--primary)", opacity: 0.5 },
            image: { x: 24, color: "var(--primary)" },
          }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
        >
          &gt;
        </motion.div>

        {/* Contextual Label (e.g. "OPEN", "READ") */}
        <motion.div
          className="absolute top-6 left-1/2 -translate-x-1/2 text-[10px] font-mono font-bold tracking-widest uppercase whitespace-nowrap"
          initial={{ opacity: 0, y: -5 }}
          animate={{
            opacity: isHovering && hoveredElementType !== "text" ? 1 : 0,
            y: isHovering ? 0 : -5,
            color: "var(--primary)",
          }}
        >
          {hoveredElementType === "link" && "OPEN"}
          {hoveredElementType === "image" && "VIEW"}
        </motion.div>
      </div>
    </motion.div>
  );
}
