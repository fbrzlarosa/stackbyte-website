"use client";

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { ArrowRight } from "lucide-react";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import Button from "./Button";
import StatusBadge from "./StatusBadge";

const AnimatedOrb = dynamic(() => import("./AnimatedOrb"), {
  loading: () => null,
});

export default function Hero() {
  const ref = useRef(null);
  const [isMobile, setIsMobile] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  // Optimized mouse movement with MotionValues instead of State
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 150, mass: 0.1 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseXNegative = useTransform(smoothMouseX, (val) => -val);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    const checkMobile = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        const mobile = window.innerWidth < 768;
        setIsMobile(mobile);
        if (mobile) {
          mouseX.set(0);
          mouseY.set(0);
        }
      }, 150);
    };

    requestAnimationFrame(() => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        mouseX.set(0);
        mouseY.set(0);
      }
    });

    window.addEventListener("resize", checkMobile, { passive: true });
    return () => {
      window.removeEventListener("resize", checkMobile);
      clearTimeout(timeoutId);
    };
  }, [mouseX, mouseY]);

  useEffect(() => {
    if (isMobile) return;

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const x = (clientX / window.innerWidth - 0.5) * 20;
      const y = (clientY / window.innerHeight - 0.5) * 20;
      mouseX.set(x);
      mouseY.set(y);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [isMobile, mouseX, mouseY]);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: isMobile ? 300 : 150,
    damping: isMobile ? 35 : 25,
    restDelta: 0.001,
    mass: 0.1,
  });

  const backgroundY = useTransform(
    scrollYProgress,
    [0, 1],
    [0, isMobile ? 0 : 250]
  );
  const textY = useTransform(scrollYProgress, [0, 1], [0, isMobile ? 0 : 200]);

  // 3D transforms for text - reduced on mobile for better performance
  const rotateX = useTransform(
    smoothProgress,
    [0, 1],
    [0, isMobile || prefersReducedMotion ? 0 : -20]
  );
  const rotateY = useTransform(
    smoothProgress,
    [0, 1],
    [0, isMobile || prefersReducedMotion ? 0 : 15]
  );
  const rotateZ = useTransform(
    smoothProgress,
    [0, 1],
    [0, isMobile || prefersReducedMotion ? 0 : 3]
  );
  const translateZ = useTransform(
    smoothProgress,
    [0, 1],
    [0, isMobile || prefersReducedMotion ? 0 : 80]
  );
  const textScale = useTransform(
    smoothProgress,
    [0, 0.5, 1],
    [1, isMobile ? 1.02 : 1.05, isMobile ? 1.1 : 1.2]
  );

  const paraRotateX = useTransform(
    smoothProgress,
    [0, 1],
    [0, isMobile || prefersReducedMotion ? 0 : -12]
  );
  const paraY = useTransform(
    smoothProgress,
    [0, 1],
    [0, isMobile || prefersReducedMotion ? -15 : -40]
  );
  const paraTranslateZ = useTransform(
    smoothProgress,
    [0, 1],
    [0, isMobile || prefersReducedMotion ? 0 : 40]
  );

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex items-center pt-24 sm:pt-28 md:pt-32 pb-16 sm:pb-20 md:pb-24 overflow-hidden"
    >
      {/* Mouse-tracking Background Gradients */}
      <motion.div
        style={{
          y: backgroundY,
          x: smoothMouseX,
          willChange: "transform",
        }}
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] md:w-[1000px] h-[300px] md:h-[500px] bg-primary/20 rounded-full blur-[80px] md:blur-[120px] -z-10"
      />
      <motion.div
        style={{
          y: backgroundY,
          x: smoothMouseXNegative,
          willChange: "transform",
        }}
        className="absolute bottom-0 right-0 w-[400px] md:w-[800px] h-[400px] md:h-[600px] bg-purple-500/10 rounded-full blur-[60px] md:blur-[100px] -z-10"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <motion.div
          style={{
            y: textY,
            willChange: "transform",
          }}
          className="max-w-4xl relative z-10 max-md:opacity-100! max-md:translate-y-0! max-md:transform-none!"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1,
              },
            },
          }}
        >
          <StatusBadge />

          <motion.h1
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
            style={{
              rotateX,
              rotateY,
              rotateZ,
              translateZ,
              scale: textScale,
              transformStyle: isMobile ? "flat" : "preserve-3d",
              perspective: isMobile ? "none" : "1500px",
              willChange: "transform",
            }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] mb-6 md:mb-8 max-md:opacity-100! max-md:translate-y-0! max-md:transform-none!"
          >
            <motion.span
              style={{
                display: "inline-block",
                transformStyle: isMobile ? "flat" : "preserve-3d",
                translateZ: useTransform(
                  smoothProgress,
                  [0, 1],
                  [0, isMobile || prefersReducedMotion ? 0 : 40]
                ),
                willChange: "transform",
              }}
            >
              Crafting efficient,
            </motion.span>
            <br />
            <motion.span
              style={{
                display: "inline-block",
                transformStyle: isMobile ? "flat" : "preserve-3d",
                translateZ: useTransform(
                  smoothProgress,
                  [0, 1],
                  [0, isMobile || prefersReducedMotion ? 0 : -50]
                ),
                rotateY: useTransform(
                  smoothProgress,
                  [0, 1],
                  [0, isMobile || prefersReducedMotion ? 0 : 10]
                ),
                willChange: "transform",
              }}
            >
              scalable solutions
            </motion.span>{" "}
            <br />
            <motion.span
              style={{
                display: "inline-block",
                transformStyle: isMobile ? "flat" : "preserve-3d",
                translateZ: useTransform(
                  smoothProgress,
                  [0, 1],
                  [0, isMobile || prefersReducedMotion ? 0 : 30]
                ),
                willChange: "transform",
              }}
            >
              in
            </motion.span>{" "}
            <span className="relative inline-block">
              <motion.span
                style={{
                  display: "inline-block",
                  transformStyle: isMobile ? "flat" : "preserve-3d",
                  translateZ: useTransform(
                    smoothProgress,
                    [0, 1],
                    [0, isMobile || prefersReducedMotion ? 0 : 30]
                  ),
                  willChange: "transform",
                }}
                className="text-transparent bg-clip-text bg-linear-to-r from-primary via-purple-400 to-primary bg-size-[200%_auto] animate-gradient"
              >
                software & web.
              </motion.span>
              <motion.span
                className="absolute -inset-1 bg-linear-to-r from-primary/20 to-purple-500/20 blur-xl -z-10"
                style={{
                  transform: isMobile ? "none" : "translateZ(-30px)",
                  scale: useTransform(
                    smoothProgress,
                    [0, 1],
                    [1, isMobile ? 1.1 : 1.2]
                  ),
                  willChange: "transform, opacity",
                }}
                animate={{
                  opacity: [0.5, 0.9, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </span>
          </motion.h1>

          <motion.p
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
            style={{
              rotateX: paraRotateX,
              y: paraY,
              translateZ: paraTranslateZ,
              transformStyle: isMobile ? "flat" : "preserve-3d",
              willChange: "transform",
            }}
            className="text-base sm:text-lg md:text-xl text-gray-400 max-w-2xl mb-8 md:mb-10 leading-relaxed max-md:opacity-100! max-md:translate-y-0! max-md:transform-none!"
          >
            I&apos;m Fabrizio La Rosa — full-stack engineer, code artisan,
            digital problem solver. Turning complex problems into elegant,
            user-centric digital experiences.
          </motion.p>

          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-12 md:mb-16 max-md:opacity-100! max-md:translate-y-0!"
          >
            <Button
              href="#contact"
              variant="gradient"
              size="lg"
              rightIcon={<ArrowRight className="w-5 h-5" />}
            >
              Start a Project
            </Button>
            <Button href="#process" variant="secondary" size="lg">
              How I Work
            </Button>
          </motion.div>

          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 border-t border-white/10 pt-6 md:pt-8"
          >
            {[
              { value: "15+", label: "Years Experience" },
              { value: "63+", label: "Projects Completed" },
              { value: "100%", label: "Client Satisfaction" },
            ].map((stat, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="text-3xl font-bold mb-1 bg-linear-to-r from-white to-gray-400 bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 w-full absolute top-0 right-0 h-full hidden lg:flex items-center justify-center pointer-events-none">
        <AnimatedOrb />
      </div>
    </section>
  );
}
