"use client";

import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import FullScreenSection from "./FullScreenSection";

interface Particle {
  id: number;
  initialX: number;
  initialY: number;
  pathX: number[];
  pathY: number[];
  duration: number;
  scaleVariations: number[];
}

interface SmallParticle {
  id: number;
  initialX: number;
  initialY: number;
  animateY: number[];
  animateX: number[];
  duration: number;
  delay: number;
}

export default function ReadyToStart() {
  const sectionRef = useRef<HTMLElement>(null);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [smallParticles, setSmallParticles] = useState<SmallParticle[]>([]);
  const [isMobile, setIsMobile] = useState(false);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const newParticles = Array.from({ length: 15 }).map((_, i) => {
      const waypoints = 6;
      const pathX: number[] = [];
      const pathY: number[] = [];

      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      const radius = Math.min(window.innerWidth, window.innerHeight) * 0.4;

      for (let j = 0; j < waypoints; j++) {
        const angle = (j / waypoints) * Math.PI * 2 + Math.random() * 0.5;
        const distance = radius * (0.7 + Math.random() * 0.3);
        pathX.push(centerX + Math.cos(angle) * distance - centerX);
        pathY.push(centerY + Math.sin(angle) * distance - centerY);
      }
      pathX.push(pathX[0]);
      pathY.push(pathY[0]);

      return {
        id: i,
        initialX: centerX + (Math.random() - 0.5) * radius * 0.5,
        initialY: centerY + (Math.random() - 0.5) * radius * 0.5,
        pathX,
        pathY,
        duration: Math.random() * 8 + 6,
        scaleVariations: Array.from(
          { length: waypoints + 1 },
          () => Math.random() * 0.8 + 0.4
        ),
      };
    });
    setTimeout(() => {
      setParticles(newParticles);
    }, 0);

    const newSmallParticles = Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      initialX: Math.random() * window.innerWidth,
      initialY: Math.random() * window.innerHeight,
      animateY: [
        Math.random() * window.innerHeight,
        Math.random() * window.innerHeight,
        Math.random() * window.innerHeight,
      ],
      animateX: [
        Math.random() * window.innerWidth,
        Math.random() * window.innerWidth,
        Math.random() * window.innerWidth,
      ],
      duration: 15 + Math.random() * 10,
      delay: Math.random() * 5,
    }));

    setTimeout(() => {
      setSmallParticles(newSmallParticles);
    }, 0);
  }, []);

  const rotateX = useTransform(
    smoothProgress,
    [0, 1],
    isMobile ? [0, 0] : [20, -20]
  );
  const rotateY = useTransform(
    smoothProgress,
    [0, 1],
    isMobile ? [0, 0] : [-15, 15]
  );
  const scale = useTransform(
    smoothProgress,
    [0, 0.5, 1],
    isMobile ? [1, 1, 1] : [0.9, 1.1, 0.9]
  );
  const translateZ = useTransform(
    smoothProgress,
    [0, 1],
    isMobile ? [0, 0] : [-80, 80]
  );
  const y = useTransform(smoothProgress, [0, 1], isMobile ? [0, 0] : [40, -40]);

  const word1RotateX = useTransform(
    smoothProgress,
    [0, 1],
    isMobile ? [0, 0] : [25, -25]
  );
  const word1RotateY = useTransform(
    smoothProgress,
    [0, 1],
    isMobile ? [0, 0] : [-10, 10]
  );
  const word1TranslateZ = useTransform(
    smoothProgress,
    [0, 1],
    isMobile ? [0, 0] : [0, 100]
  );
  const word1Y = useTransform(
    smoothProgress,
    [0, 1],
    isMobile ? [0, 0] : [30, -30]
  );

  const word2RotateX = useTransform(
    smoothProgress,
    [0, 1],
    isMobile ? [0, 0] : [-15, 15]
  );
  const word2RotateY = useTransform(
    smoothProgress,
    [0, 1],
    isMobile ? [0, 0] : [-20, 20]
  );
  const word2TranslateZ = useTransform(
    smoothProgress,
    [0, 1],
    isMobile ? [0, 0] : [100, -100]
  );
  const word2Y = useTransform(
    smoothProgress,
    [0, 1],
    isMobile ? [0, 0] : [-20, 20]
  );

  const word3RotateX = useTransform(
    smoothProgress,
    [0, 1],
    isMobile ? [0, 0] : [-25, 25]
  );
  const word3RotateY = useTransform(
    smoothProgress,
    [0, 1],
    isMobile ? [0, 0] : [10, -10]
  );
  const word3TranslateZ = useTransform(
    smoothProgress,
    [0, 1],
    isMobile ? [0, 0] : [-100, 100]
  );
  const word3Y = useTransform(
    smoothProgress,
    [0, 1],
    isMobile ? [0, 0] : [20, -20]
  );

  const subtitleRotateX = useTransform(
    smoothProgress,
    [0, 1],
    isMobile ? [0, 0] : [8, -8]
  );
  const subtitleTranslateZ = useTransform(
    smoothProgress,
    [0, 1],
    isMobile ? [0, 0] : [-30, 30]
  );
  const subtitleY = useTransform(
    smoothProgress,
    [0, 1],
    isMobile ? [0, 0] : [15, -15]
  );

  return (
    <FullScreenSection
      ignoreOpacity={true}
      ref={sectionRef}
      id="ready"
      className="py-12 sm:py-32 md:py-40 overflow-hidden relative z-20 sm:pb-0"
    >
      {/* Animated Background Effects */}
      {/* <motion.div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(6, 182, 212, 0.05) 0%, transparent 50%)",
        }}
        animate={{
          background: [
            "radial-gradient(circle at 20% 30%, rgba(6, 182, 212, 0.1) 0%, transparent 50%)",
            "radial-gradient(circle at 80% 70%, rgba(168, 85, 247, 0.1) 0%, transparent 50%)",
            "radial-gradient(circle at 50% 50%, rgba(6, 182, 212, 0.1) 0%, transparent 50%)",
            "radial-gradient(circle at 20% 30%, rgba(6, 182, 212, 0.1) 0%, transparent 50%)",
          ],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      /> */}

      {/* Floating Orbs */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[150px]"
        animate={{
          x: [0, 100, 0],
          y: [0, -40, 0],
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-secondary/20 rounded-full blur-[120px]"
        animate={{
          x: [0, -80, 0],
          y: [0, 50, 0],
          scale: [1, 1.25, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      />

      {/* Floating Particles - Similar to Hero */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {particles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute top-1/2 left-1/2"
            style={{
              x: p.initialX - window.innerWidth / 2,
              y: p.initialY - window.innerHeight / 2,
            }}
          >
            <motion.div
              className="w-3 h-3 bg-primary/40 rounded-full mix-blend-screen blur-[1px]"
              animate={{
                x: p.pathX,
                y: p.pathY,
                scale: p.scaleVariations,
                opacity: [0.2, 0.8, 0.6, 0.9, 0.4, 0.8, 0.2],
              }}
              transition={{
                x: {
                  duration: p.duration,
                  repeat: Infinity,
                  ease: [0.4, 0, 0.6, 1],
                  times: p.pathX.map((_, idx) => idx / (p.pathX.length - 1)),
                },
                y: {
                  duration: p.duration * 0.95,
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
                delay: p.id * 0.2,
              }}
            />
          </motion.div>
        ))}

        {/* Additional smaller particles */}
        {smallParticles.map((p) => (
          <motion.div
            key={`small-${p.id}`}
            className="absolute w-1 h-1 bg-primary/30 rounded-full"
            initial={{
              x: p.initialX,
              y: p.initialY,
              opacity: 0,
            }}
            animate={{
              y: p.animateY,
              x: p.animateX,
              opacity: [0, 0.6, 0.3, 0.7, 0],
              scale: [0.5, 1.2, 0.8, 1, 0.5],
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              ease: "easeInOut",
              delay: p.delay,
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col items-center justify-center min-h-[50vh] sm:min-h-[80vh]">
          <motion.div
            style={{
              rotateX,
              rotateY,
              scale,
              translateZ,
              y,
              transformStyle: "preserve-3d",
              perspective: "2000px",
            }}
            className="text-center transform-none md:transform"
          >
            {/* Main Giant Text */}
            <div className="mb-8 md:mb-12">
              <motion.h2
                style={{
                  rotateX: word1RotateX,
                  rotateY: word1RotateY,
                  translateZ: word1TranslateZ,
                  y: word1Y,
                  transformStyle: "preserve-3d",
                }}
                className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl xl:text-[14rem] 2xl:text-[18rem] font-black leading-none mb-4 md:mb-6 transform-none md:transform relative"
                initial={{ opacity: 0, y: 100 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                animate={
                  !isMobile
                    ? {
                        rotateX: [0, 5, -5, 0],
                        rotateY: [0, -4, 4, 0],
                        translateZ: [0, 25, -25, 0],
                      }
                    : {}
                }
                transition={{
                  opacity: { duration: 1, ease: "easeOut" },
                  y: { duration: 1, ease: "easeOut" },
                  rotateX: { duration: 8, repeat: Infinity, ease: "easeInOut" },
                  rotateY: { duration: 8, repeat: Infinity, ease: "easeInOut" },
                  translateZ: {
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut",
                  },
                }}
              >
                <span className="relative z-10 gradient-animated-text">
                  CODE.
                </span>
                <motion.span
                  className="absolute inset-0 gradient-animated-text blur-xl opacity-60"
                  animate={{
                    opacity: [0.4, 0.7, 0.4],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  CODE.
                </motion.span>
              </motion.h2>

              <motion.h2
                style={{
                  rotateX: word2RotateX,
                  rotateY: word2RotateY,
                  translateZ: word2TranslateZ,
                  y: word2Y,
                  transformStyle: "preserve-3d",
                }}
                className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl xl:text-[14rem] 2xl:text-[18rem] font-black leading-none mb-4 md:mb-6 transform-none md:transform relative"
                initial={{ opacity: 0, y: 100 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                animate={
                  !isMobile
                    ? {
                        rotateX: [0, -5, 5, 0],
                        rotateY: [0, 4, -4, 0],
                        translateZ: [0, -25, 25, 0],
                      }
                    : {}
                }
                transition={{
                  opacity: { duration: 1, delay: 0.2, ease: "easeOut" },
                  y: { duration: 1, delay: 0.2, ease: "easeOut" },
                  rotateX: {
                    duration: 10,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1,
                  },
                  rotateY: {
                    duration: 10,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1,
                  },
                  translateZ: {
                    duration: 10,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1,
                  },
                }}
              >
                <span className="relative z-10 text-white">CREATE.</span>
                <motion.span
                  className="absolute inset-0 text-white blur-xl opacity-50"
                  animate={{
                    opacity: [0.3, 0.6, 0.3],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.5,
                  }}
                >
                  CREATE.
                </motion.span>
              </motion.h2>

              <motion.h2
                style={{
                  rotateX: word3RotateX,
                  rotateY: word3RotateY,
                  translateZ: word3TranslateZ,
                  y: word3Y,
                  transformStyle: "preserve-3d",
                }}
                className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl xl:text-[14rem] 2xl:text-[18rem] font-black leading-none transform-none md:transform relative"
                initial={{ opacity: 0, y: 100 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                animate={
                  !isMobile
                    ? {
                        rotateX: [0, 4, -4, 0],
                        rotateY: [0, -5, 5, 0],
                        translateZ: [0, 20, -20, 0],
                      }
                    : {}
                }
                transition={{
                  opacity: { duration: 1, delay: 0.4, ease: "easeOut" },
                  y: { duration: 1, delay: 0.4, ease: "easeOut" },
                  rotateX: {
                    duration: 12,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 2,
                  },
                  rotateY: {
                    duration: 12,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 2,
                  },
                  translateZ: {
                    duration: 12,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 2,
                  },
                }}
              >
                <span className="relative z-10 gradient-animated-text">
                  CONQUER.
                </span>
                <motion.span
                  className="absolute inset-0 gradient-animated-text blur-xl opacity-60"
                  animate={{
                    opacity: [0.4, 0.7, 0.4],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1,
                  }}
                >
                  CONQUER.
                </motion.span>
              </motion.h2>
            </div>

            {/* Subtitle */}
            <motion.p
              style={{
                rotateX: subtitleRotateX,
                translateZ: subtitleTranslateZ,
                y: subtitleY,
                transformStyle: "preserve-3d",
              }}
              className="text-lg sm:text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto transform-none md:transform"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              Three words. Infinite possibilities. Every line of code is a step
              toward something extraordinary.
            </motion.p>
          </motion.div>
        </div>
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.02)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)] pointer-events-none" />
    </FullScreenSection>
  );
}
