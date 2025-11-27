"use client";

import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { Code2, MessageSquare, PenTool, Rocket } from "lucide-react";
import { useRef } from "react";
import CodeRain from "./CodeRain";
import FullScreenSection from "./FullScreenSection";

const steps = [
  {
    icon: MessageSquare,
    title: "Contact",
    description:
      "We discuss your idea, requirements, and goals to understand the vision.",
  },
  {
    icon: PenTool,
    title: "Plan",
    description:
      "I create a detailed roadmap and technical architecture for your project.",
  },
  {
    icon: Code2,
    title: "Develop",
    description:
      "Writing clean, efficient code with regular updates and feedback loops.",
  },
  {
    icon: Rocket,
    title: "Deploy",
    description:
      "Launching your product to the world with proper testing and optimization.",
  },
];

export default function Process() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const titleRotateX = useTransform(smoothProgress, [0, 1], [18, -18]);
  const titleRotateY = useTransform(smoothProgress, [0, 1], [-12, 12]);
  const titleY = useTransform(smoothProgress, [0, 1], [60, -60]);
  const titleTranslateZ = useTransform(smoothProgress, [0, 1], [-60, 60]);
  const titleScale = useTransform(
    smoothProgress,
    [0, 0.5, 1],
    [0.92, 1.03, 0.92]
  );

  const paraRotateX = useTransform(smoothProgress, [0, 1], [10, -10]);
  const paraY = useTransform(smoothProgress, [0, 1], [30, -30]);
  const paraTranslateZ = useTransform(smoothProgress, [0, 1], [-30, 30]);

  return (
    <FullScreenSection
      ignoreOpacity={true}
      ref={sectionRef}
      id="process"
      className="py-32 bg-[#0D1117] overflow-hidden relative z-20"
    >
      <CodeRain />
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-20 text-center"
        >
          <motion.h2
            style={{
              rotateX: titleRotateX,
              rotateY: titleRotateY,
              y: titleY,
              translateZ: titleTranslateZ,
              scale: titleScale,
              transformStyle: "preserve-3d",
              perspective: "1200px",
            }}
            className="text-3xl md:text-5xl font-bold mb-6"
          >
            <motion.span
              style={{
                display: "inline-block",
                transformStyle: "preserve-3d",
                translateZ: useTransform(smoothProgress, [0, 1], [0, 40]),
              }}
            >
              Your vision. My code.
            </motion.span>
            <br />
            <motion.span
              style={{
                display: "inline-block",
                transformStyle: "preserve-3d",
                translateZ: useTransform(smoothProgress, [0, 1], [40, -40]),
                rotateY: useTransform(smoothProgress, [0, 1], [-8, 8]),
              }}
              className="text-gray-500"
            >
              Perfect execution.
            </motion.span>
          </motion.h2>
          <motion.p
            style={{
              rotateX: paraRotateX,
              y: paraY,
              translateZ: paraTranslateZ,
              transformStyle: "preserve-3d",
            }}
            className="text-xl text-gray-400 max-w-2xl mx-auto"
          >
            A streamlined process designed to take your project from concept to
            reality efficiently.
          </motion.p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {/* Connecting Line (Desktop) */}
          <div className="hidden lg:block absolute top-12 left-0 w-full h-0.5 bg-white/10 -z-10">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: "100%" }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              className="h-full bg-primary/30"
            />
          </div>

          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50, rotateY: 30 }}
              whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
              viewport={{ once: true }}
              transition={{
                delay: index * 0.2,
                duration: 0.8,
                type: "spring",
                bounce: 0.4,
              }}
              className="group p-8 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors backdrop-blur-sm perspective-1000"
            >
              <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform duration-300">
                <step.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">{step.title}</h3>
              <p className="text-gray-400 leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </FullScreenSection>
  );
}
