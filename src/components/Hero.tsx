"use client";

import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import AnimatedOrb from "./AnimatedOrb";
import StatusBadge from "./StatusBadge";

export default function Hero() {
  const ref = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  // 3D transforms for text - start straight (0) and animate during scroll
  const rotateX = useTransform(smoothProgress, [0, 1], [0, -20]);
  const rotateY = useTransform(smoothProgress, [0, 1], [0, 15]);
  const rotateZ = useTransform(smoothProgress, [0, 1], [0, 3]);
  const translateZ = useTransform(smoothProgress, [0, 1], [0, 80]);
  const textScale = useTransform(smoothProgress, [0, 0.5, 1], [1, 1.05, 1.2]);

  const paraRotateX = useTransform(smoothProgress, [0, 1], [0, -12]);
  const paraY = useTransform(smoothProgress, [0, 1], [0, -40]);
  const paraTranslateZ = useTransform(smoothProgress, [0, 1], [0, 40]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const x = (clientX / window.innerWidth - 0.5) * 20;
      const y = (clientY / window.innerHeight - 0.5) * 20;
      setMousePosition({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex items-center pt-20"
    >
      {/* Mouse-tracking Background Gradients */}
      <motion.div
        style={{
          y: backgroundY,
          x: mousePosition.x,
        }}
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-primary/20 rounded-full blur-[120px] -z-10"
      />
      <motion.div
        style={{
          y: backgroundY,
          x: -mousePosition.x,
        }}
        className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-purple-500/10 rounded-full blur-[100px] -z-10"
      />

      <div className="max-w-7xl mx-auto px-6 w-full">
        <motion.div
          style={{ y: textY }}
          className="max-w-4xl relative z-10"
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
              transformStyle: "preserve-3d",
              perspective: "1500px",
            }}
            className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.1] mb-8"
          >
            <motion.span
              style={{
                display: "inline-block",
                transformStyle: "preserve-3d",
                translateZ: useTransform(smoothProgress, [0, 1], [0, 40]),
              }}
            >
              Crafting efficient,
            </motion.span>
            <br />
            <span className="relative inline-block">
              <motion.span
                style={{
                  display: "inline-block",
                  transformStyle: "preserve-3d",
                  translateZ: useTransform(smoothProgress, [0, 1], [0, -50]),
                  rotateY: useTransform(smoothProgress, [0, 1], [0, 10]),
                }}
                className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-400 to-primary bg-[length:200%_auto] animate-gradient"
              >
                scalable solutions
              </motion.span>
              <motion.span
                className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-purple-500/20 blur-xl -z-10"
                style={{
                  transform: "translateZ(-30px)",
                  scale: useTransform(smoothProgress, [0, 1], [1, 1.2]),
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
            </span>{" "}
            <br />
            <motion.span
              style={{
                display: "inline-block",
                transformStyle: "preserve-3d",
                translateZ: useTransform(smoothProgress, [0, 1], [0, 30]),
              }}
            >
              in software & web.
            </motion.span>
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
              transformStyle: "preserve-3d",
            }}
            className="text-xl text-gray-400 max-w-2xl mb-10 leading-relaxed"
          >
            I&apos;m Fabrizio &quot;Rubber&quot; La Rosa — full-stack engineer,
            code artisan, digital problem solver. Turning complex problems into
            elegant, user-centric digital experiences.
          </motion.p>

          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="#contact"
                className="inline-flex items-center justify-center gap-2 bg-white text-black px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-all relative overflow-hidden group"
              >
                <span className="relative z-10">Start a Project</span>
                <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
                <motion.span
                  className="absolute inset-0 bg-gradient-to-r from-primary to-purple-500 opacity-0 group-hover:opacity-20"
                  initial={false}
                />
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="#process"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-bold text-lg border border-white/20 hover:bg-white/5 transition-all backdrop-blur-sm"
              >
                How I Work
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
            className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-white/10 pt-8"
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
                <div className="text-3xl font-bold text-white mb-1 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-500">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
      <div className="max-w-5xl mx-auto px-6 w-full absolute top-0 right-0 h-full">
        <AnimatedOrb />
      </div>
    </section>
  );
}
