"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect, useState } from "react";

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
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const [isHovered, setIsHovered] = useState(false);

  // State for stable random values
  const [particles, setParticles] = useState<Particle[]>([]);

  // Smooth mouse movement
  const springConfig = { damping: 15, stiffness: 150, mass: 0.5 };
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);

  // 3D Rotation based on mouse - reduced
  const rotateX = useTransform(springY, [-500, 500], [25, -25]);
  const rotateY = useTransform(springX, [-500, 500], [-25, 25]);

  // Parallax layers with different speeds for depth effect - increased
  const parallaxBackX = useTransform(springX, [-500, 500], [-120, 120]); // Furthest back - fastest
  const parallaxBackY = useTransform(springY, [-500, 500], [-120, 120]);

  const parallaxMidX = useTransform(springX, [-500, 500], [-80, 80]); // Middle layer
  const parallaxMidY = useTransform(springY, [-500, 500], [-80, 80]);

  const parallaxFrontX = useTransform(springX, [-500, 500], [-40, 40]); // Front layer - slowest
  const parallaxFrontY = useTransform(springY, [-500, 500], [-40, 40]);

  const parallaxLogoX = useTransform(springX, [-500, 500], [-25, 25]); // Logo - very slow
  const parallaxLogoY = useTransform(springY, [-500, 500], [-25, 25]);

  const parallaxParticlesX = useTransform(springX, [-500, 500], [-90, 90]); // Particles parallax
  const parallaxParticlesY = useTransform(springY, [-500, 500], [-90, 90]);

  useEffect(() => {
    // Generate particles only once on mount with insect-like movement paths
    const timer = setTimeout(() => {
      const newParticles = Array.from({ length: 12 }).map((_, i) => {
        // Create multiple waypoints for insect-like erratic movement
        const waypoints = 5;
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
          duration: Math.random() * 4 + 3, // Slower, more erratic
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
    const handleMouseMove = (e: MouseEvent) => {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      mouseX.set(e.clientX - centerX);
      mouseY.set(e.clientY - centerY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <motion.div
      // className="absolute left-[-10%] top-1/2 -translate-y-1/2 w-[600px] h-[600px] hidden lg:flex items-center justify-center perspective-distant z-10 pointer-events-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 3D Container */}
      <motion.div
        className="relative w-[400px] h-[400px] transform-style-3d cursor-none"
        style={{
          rotateX,
          rotateY,
        }}
      >
        {/* Core Glow - Parallax Background */}
        <motion.div
          className="absolute inset-0 bg-cyan-500/20 rounded-full blur-[80px]"
          style={{
            x: parallaxBackX,
            y: parallaxBackY,
            translateZ: -100,
          }}
          animate={{
            scale: [0.8, 1.2, 0.8],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Outer Hexagon Grid - Rotating with Parallax */}
        <motion.div
          className="absolute inset-0 border border-cyan-500/10 rounded-full"
          style={{
            translateZ: 50,
            rotateZ: 0,
            x: parallaxBackX,
            y: parallaxBackY,
          }}
          animate={{ rotateZ: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        >
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute top-1/2 left-1/2 w-full h-px bg-cyan-500/10 -translate-x-1/2 -translate-y-1/2"
              style={{
                transform: `translate(-50%, -50%) rotate(${i * 30}deg)`,
              }}
            />
          ))}
        </motion.div>

        {/* Dynamic Rings with Parallax */}
        <motion.div
          className="absolute inset-10 border-2 border-dashed border-cyan-500/20 rounded-full"
          style={{
            translateZ: 80,
            x: parallaxMidX,
            y: parallaxMidY,
          }}
          animate={{ rotateZ: -360, scale: isHovered ? 1.1 : 1 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />

        <motion.div
          className="absolute inset-20 border border-dotted border-purple-500/30 rounded-full"
          style={{
            translateZ: 100,
            x: parallaxMidX,
            y: parallaxMidY,
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
          whileHover={{ scale: 1.1 }}
        >
          {/* Glassmorphism Background Card for Logo */}
          <div className="relative w-48 h-48 flex items-center justify-center overflow-hidden group">
            {/* Internal Scan Light */}
            {/* <motion.div
              className="absolute inset-0 bg-linear-to-tr from-transparent via-white/10 to-transparent skew-x-12 translate-x-[-200%]"
              animate={{ translateX: ["-200%", "200%"] }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1,
              }}
            /> */}

            {/* The Logo Icon itself */}
            <svg
              viewBox="-4 0 400 300"
              className="w-32 h-32 drop-shadow-[0_0_20px_rgba(6,182,212,0.5)]"
            >
              {/* Path 1: Bottom Part */}
              <motion.path
                d="M374.7,140.2c12.1,6.7,12.1,17.4,0,24.2L214,252.2c-12.1,6.6-32.1,6.6-44.2,0L9.1,164.4c-12.1-6.9-12.1-17.5,0-24.2l30.8-16.8c-3.8,5-2.1,11,5.3,15.1l129.1,70.4c9.7,5.3,25.7,5.3,35.4,0l129.1-70.4c7.4-4.1,9.1-10.1,5.3-15.1L374.7,140.2z"
                fill="none"
                stroke="#06B6D4"
                strokeWidth="8"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 2, ease: "easeInOut" }}
              />
              <motion.path
                d="M374.7,140.2c12.1,6.7,12.1,17.4,0,24.2L214,252.2c-12.1,6.6-32.1,6.6-44.2,0L9.1,164.4c-12.1-6.9-12.1-17.5,0-24.2l30.8-16.8c-3.8,5-2.1,11,5.3,15.1l129.1,70.4c9.7,5.3,25.7,5.3,35.4,0l129.1-70.4c7.4-4.1,9.1-10.1,5.3-15.1L374.7,140.2z"
                fill="#06B6D4"
                opacity="1"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1, delay: 1 }}
              />

              {/* Path 2: Top Part */}
              <motion.path
                d="M209.6,3.9l129.1,70.4c9.7,5.4,9.7,14,0,19.4l-129.1,70.5c-9.7,5.3-25.7,5.3-35.4,0L45.2,93.8c-9.7-5.4-9.7-14,0-19.4L174.2,3.9C183.9-1.3,199.9-1.3,209.6,3.9L209.6,3.9z"
                fill="none"
                stroke="#06B6D4"
                strokeWidth="8"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 2, ease: "easeInOut", delay: 0.5 }}
              />
              <motion.path
                d="M209.6,3.9l129.1,70.4c9.7,5.4,9.7,14,0,19.4l-129.1,70.5c-9.7,5.3-25.7,5.3-35.4,0L45.2,93.8c-9.7-5.4-9.7-14,0-19.4L174.2,3.9C183.9-1.3,199.9-1.3,209.6,3.9L209.6,3.9z"
                fill="#06B6D4"
                opacity="1"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1, delay: 1.5 }}
              />
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
            className="absolute top-0 left-1/2 w-4 h-4 bg-cyan-500 rounded-full shadow-[0_0_20px_#06B6D4]"
            style={{
              transform: "translateX(-50%) translateY(-50%) translateZ(200px)",
            }}
          />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
