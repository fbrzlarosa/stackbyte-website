"use client";

import { useBackground } from "@/context/BackgroundContext";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";

// Define a type for particle properties
interface Particle {
  id: number;
  initialZ: number;
  pathX: number[];
  pathY: number[];
  duration: number;
  scaleVariations: number[];
}

export default function AnimatedOrb() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const [isHovered, setIsHovered] = useState(false);
  const { cycleTheme, currentTheme } = useBackground();
  const [isPressed, setIsPressed] = useState(false);

  // State for stable random values
  const [particles, setParticles] = useState<Particle[]>([]);

  const springConfig = { damping: 25, stiffness: 250, mass: 0.2 };
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);

  // 3D Rotation based on mouse
  const rotateX = useTransform(springY, [-1000, 1000], [25, -25]);
  const rotateY = useTransform(springX, [-1000, 1000], [-25, 25]);

  const parallaxMidX = useTransform(springX, [-1000, 1000], [-80, 80]); // Middle layer
  const parallaxMidY = useTransform(springY, [-1000, 1000], [-80, 80]);

  const parallaxFrontX = useTransform(springX, [-1000, 1000], [-40, 40]); // Front layer - slowest
  const parallaxFrontY = useTransform(springY, [-1000, 1000], [-40, 40]);

  const parallaxLogoX = useTransform(springX, [-1000, 1000], [-25, 25]); // Logo - very slow
  const parallaxLogoY = useTransform(springY, [-1000, 1000], [-25, 25]);

  const parallaxParticlesX = useTransform(springX, [-1000, 1000], [-90, 90]); // Particles parallax
  const parallaxParticlesY = useTransform(springY, [-1000, 1000], [-90, 90]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const newParticles = Array.from({ length: 8 }).map((_, i) => {
        const waypoints = 4;
        const pathX: number[] = [];
        const pathY: number[] = [];

        for (let j = 0; j < waypoints; j++) {
          pathX.push(Math.random() * 300 - 150);
          pathY.push(Math.random() * 300 - 150);
        }
        // Close the loop
        pathX.push(pathX[0]);
        pathY.push(pathY[0]);

        return {
          id: i,
          initialZ: Math.random() * 200,
          pathX,
          pathY,
          duration: Math.random() * 3 + 4,
          scaleVariations: Array.from(
            { length: waypoints + 1 },
            () => Math.random() * 0.5 + 0.5
          ),
        };
      });
      setParticles(newParticles);
    }, 0);
    return () => clearTimeout(timer);
  }, []); // Only run once on mount

  useEffect(() => {
    let rafId: number;
    let lastUpdate = 0;
    const throttleMs = 16; // Smoother 60fps

    const handleMouseMove = (e: MouseEvent) => {
      const now = performance.now();
      if (now - lastUpdate < throttleMs) return;
      lastUpdate = now;

      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        if (containerRef.current) {
          const rect = containerRef.current.getBoundingClientRect();
          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;
          mouseX.set(e.clientX - centerX);
          mouseY.set(e.clientY - centerY);
        }
      });
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [mouseX, mouseY]);

  const handlePressStart = () => {
    setIsPressed(true);
  };

  const handlePressEnd = () => {
    // Ensure it stays down for at least a short duration to be visible
    setTimeout(() => {
      setIsPressed(false);
    }, 150);
  };

  return (
    <motion.div
      ref={containerRef}
      
      className="pointer-events-auto"
      style={{ willChange: 'transform' }}
    >
      {/* 3D Container */}
      <motion.div
        className="relative w-[400px] h-[400px] transform-style-3d"
        style={{
          rotateX,
          rotateY,
          willChange: 'transform',
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Core Glow - Parallax Background */}
        <motion.div
          className="absolute inset-0 bg-primary/5 rounded-full blur-[80px]"
          style={{
            x: parallaxLogoX, // Move with logo to keep glow centered
            y: parallaxLogoY,
            translateZ: -100,
            backgroundColor: currentTheme.primary + "10", // 10 is roughly 5-6% opacity in hex
          }}
          animate={{
            scale: [0.8, 1.2, 0.8],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Dynamic Rings with Parallax */}
        <motion.div
          className="absolute inset-10 border-2 border-dashed border-primary/20 rounded-full opacity-50"
          style={{
            translateZ: 80,
            x: parallaxMidX,
            y: parallaxMidY,
            borderColor: currentTheme.primary + "33", // 20% opacity
          }}
          animate={{ rotateZ: -360, scale: isHovered ? 1.1 : 1 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />

        <motion.div
          className="absolute inset-20 border border-dotted border-secondary/30 rounded-full"
          style={{
            translateZ: 100,
            x: parallaxMidX,
            y: parallaxMidY,
            borderColor: currentTheme.secondary + "4D", // 30% opacity
          }}
          animate={{ rotateZ: 360, scale: isHovered ? 0.9 : 1 }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        />

        {/* Floating Particles Cloud - Insect-like Movement - Behind Logo */}
        {particles.map((p, i) => (
          <motion.div
            key={`p-${p.id}`}
            className="absolute top-1/2 left-1/2 transform-style-3d"
            style={{
              translateZ: p.initialZ - 200, // Negative Z to be behind logo
              x: parallaxParticlesX,
              y: parallaxParticlesY,
            }}
          >
            <motion.div
              className="w-2 h-2 bg-white rounded-full mix-blend-overlay"
              animate={{
                x: p.pathX,
                y: p.pathY,
                scale: p.scaleVariations,
                opacity: [0.3, 1, 0.8, 1, 0.5, 1, 0.3],
              }}
              transition={{
                x: {
                  duration: p.duration,
                  repeat: Infinity,
                  ease: [0.4, 0, 0.6, 1], // Custom easing for erratic movement
                  times: p.pathX.map((_, idx) => idx / (p.pathX.length - 1)),
                },
                y: {
                  duration: p.duration * 0.95, // Slightly different duration for organic feel
                  repeat: Infinity,
                  ease: [0.4, 0, 0.6, 1],
                  times: p.pathY.map((_, idx) => idx / (p.pathY.length - 1)),
                },
                scale: {
                  duration: p.duration * 0.8,
                  repeat: Infinity,
                  ease: "easeInOut",
                  times: p.scaleVariations.map(
                    (_, idx) => idx / (p.scaleVariations.length - 1)
                  ),
                },
                opacity: {
                  duration: p.duration * 1.2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  times: p.scaleVariations.map(
                    (_, idx) => idx / (p.scaleVariations.length - 1)
                  ),
                },
                delay: i * 0.3,
              }}
            />
          </motion.div>
        ))}

        {/* Main Logo Container - 3D Floating with Parallax */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center transform-style-3d"
          style={{
            translateZ: 150,
            x: parallaxLogoX,
            y: parallaxLogoY,
          }}
        >
          <div 
            className="relative w-48 h-48 flex items-center justify-center overflow-hidden group"
            style={{
              transform: "translateZ(0)",
              backfaceVisibility: "hidden",
              WebkitFontSmoothing: "antialiased",
            }}
          >
            <svg
              viewBox="-4 0 400 300"
              className="w-40 h-40 cursor-pointer pointer-events-auto"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => {
                setIsHovered(false);
                setIsPressed(false);
              }}
              onMouseDown={handlePressStart}
              onMouseUp={handlePressEnd}
              onClick={cycleTheme}
              style={{
                shapeRendering: "geometricPrecision",
                imageRendering: "auto",
                transform: "translateZ(0)",
                backfaceVisibility: "hidden",
                WebkitFontSmoothing: "antialiased",
                filter: isHovered 
                  ? `drop-shadow(0 0 2px ${currentTheme.primary}80) drop-shadow(0 0 5px ${currentTheme.primary}99)` 
                  : `drop-shadow(0 0 20px ${currentTheme.primary}33)`,
                transition: "filter 0.3s ease",
              }}
              preserveAspectRatio="xMidYMid meet"
            >
              <motion.path
                d="M374.7,140.2c12.1,6.7,12.1,17.4,0,24.2L214,252.2c-12.1,6.6-32.1,6.6-44.2,0L9.1,164.4c-12.1-6.9-12.1-17.5,0-24.2l30.8-16.8c-3.8,5-2.1,11,5.3,15.1l129.1,70.4c9.7,5.3,25.7,5.3,35.4,0l129.1-70.4c7.4-4.1,9.1-10.1,5.3-15.1L374.7,140.2z"
                fill="none"
                stroke={currentTheme.primary}
                strokeWidth="8"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity={0.2}
                style={{ shapeRendering: "geometricPrecision" }}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.2 }}
                transition={{ duration: 2, ease: "easeInOut" }}
              />
              <motion.path
                d="M374.7,140.2c12.1,6.7,12.1,17.4,0,24.2L214,252.2c-12.1,6.6-32.1,6.6-44.2,0L9.1,164.4c-12.1-6.9-12.1-17.5,0-24.2l30.8-16.8c-3.8,5-2.1,11,5.3,15.1l129.1,70.4c9.7,5.3,25.7,5.3,35.4,0l129.1-70.4c7.4-4.1,9.1-10.1,5.3-15.1L374.7,140.2z"
                fill={currentTheme.primary}
                opacity="1"
                style={{ shapeRendering: "geometricPrecision" }}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1, delay: 1 }}
              />

              {/* Path 2: Top Part */}
              <motion.g
                animate={{ 
                  y: isPressed ? 30 : 0,
                }}
                transition={{
                  duration: 0.2,
                  ease: "easeInOut",
                }}
              >
                <motion.path
                  d="M209.6,3.9l129.1,70.4c9.7,5.4,9.7,14,0,19.4l-129.1,70.5c-9.7,5.3-25.7,5.3-35.4,0L45.2,93.8c-9.7-5.4-9.7-14,0-19.4L174.2,3.9C183.9-1.3,199.9-1.3,209.6,3.9L209.6,3.9z"
                  fill="none"
                  stroke={currentTheme.primary}
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity={0.2}
                  style={{ shapeRendering: "geometricPrecision" }}
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 0.2 }}
                  transition={{ duration: 2, ease: "easeInOut", delay: 0.5 }}
                />
                <motion.path
                  d="M209.6,3.9l129.1,70.4c9.7,5.4,9.7,14,0,19.4l-129.1,70.5c-9.7,5.3-25.7,5.3-35.4,0L45.2,93.8c-9.7-5.4-9.7-14,0-19.4L174.2,3.9C183.9-1.3,199.9-1.3,209.6,3.9L209.6,3.9z"
                  fill={currentTheme.primary}
                  opacity="1"
                  style={{ shapeRendering: "geometricPrecision" }}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 1, delay: 1.5 }}
                />
              </motion.g>
            </svg>
          </div>
        </motion.div>

        {/* Orbiting Elements - Interaction with Parallax */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            x: parallaxFrontX,
            y: parallaxFrontY,
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          <div
            className="absolute top-0 left-1/2 w-4 h-4 rounded-full"
            style={{
              backgroundColor: currentTheme.primary,
              boxShadow: `0 0 20px ${currentTheme.primary}`,
              transform: "translateX(-50%) translateY(-50%) translateZ(200px)",
            }}
          />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
