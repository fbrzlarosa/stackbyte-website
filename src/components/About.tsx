"use client";

import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform
} from "framer-motion";
import { Briefcase, GraduationCap, Trophy } from "lucide-react";
import { MouseEvent, useEffect, useRef, useState } from "react";


const experiences = [
  {
    year: "Present",
    title: "Fullstack Software Developer",
    company: "Freelance",
    description:
      "Orchestrating digital symphonies for agencies and startups worldwide.",
    icon: Briefcase,
  },
  {
    year: "Previous",
    title: "Software Engineer",
    company: "Domotz",
    description: "Building scalable network monitoring solutions.",
    icon: Briefcase,
  },
  {
    year: "Previous",
    title: "Android & Web Developer",
    company: "Meedori Agency",
    description: "Crafting mobile and web experiences.",
    icon: Briefcase,
  },
  {
    year: "Early Days",
    title: "Growing Startups",
    company: "TIM WCAP",
    description: "Accelerating innovation in the tech ecosystem.",
    icon: Trophy,
  },
  {
    year: "Education",
    title: "University Studies",
    company: "Catania, Sicily",
    description: "Laying the foundation for a career in technology.",
    icon: GraduationCap,
  },
];

function ExperienceCard({
  exp,
  index,
}: {
  exp: (typeof experiences)[0];
  index: number;
}) {
  const [isMobile, setIsMobile] = useState(false);
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const rotateXRaw = useTransform(mouseY, [0, 1], [8, -8]);
  const rotateYRaw = useTransform(mouseX, [0, 1], [-8, 8]);

  const mouseXPixels = useTransform(mouseX, [0, 1], [0, 100]);
  const mouseYPixels = useTransform(mouseY, [0, 1], [0, 100]);

  const spotlightBackground = useMotionTemplate`
    radial-gradient(
      650px circle at ${mouseXPixels}% ${mouseYPixels}%,
      rgba(var(--primary-rgb), 0.15),
      transparent 80%
    )
  `;

  const glowBackground = useMotionTemplate`
    radial-gradient(
      400px circle at ${mouseXPixels}% ${mouseYPixels}%,
      rgba(var(--primary-rgb), 0.2),
      transparent 70%
    )
  `;

  function handleMouseMove({
    currentTarget,
    clientX,
    clientY,
  }: MouseEvent<HTMLDivElement>) {
    if (isMobile) return;
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    const x = (clientX - left) / width;
    const y = (clientY - top) / height;
    mouseX.set(x);
    mouseY.set(y);
  }

  function handleMouseLeave() {
    if (isMobile) return;
    mouseX.set(0.5);
    mouseY.set(0.5);
  }

  return (

      <motion.div
        className="relative flex gap-6 sm:gap-10 group"
        initial={{ opacity: 0, x: 50, rotateY: 20 }}
        whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{
          duration: isMobile ? 0.4 : 0.7,
          delay: isMobile ? index * 0.05 : index * 0.15,
          type: isMobile ? "tween" : "spring",
          stiffness: isMobile ? undefined : 50,
          damping: isMobile ? undefined : 20,
        }}
      >
        {/* Timeline Dot with Glow */}
        <div className="hidden sm:flex flex-col items-center relative">
          <motion.div
            className="w-4 h-4 rounded-full border-2 border-white/20 bg-[#0D1117] group-hover:border-primary transition-all duration-500 z-10 relative"
            whileInView={{
              scale: [0, 1.2, 1],
              borderColor: ["rgba(255,255,255,0.2)", "var(--primary)"],
            }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.15 + 0.2, duration: 0.5 }}
          >
            <motion.div
              className="absolute inset-0 rounded-full bg-primary/50 blur-md opacity-0 group-hover:opacity-100"
              transition={{ duration: 0.3 }}
            />
          </motion.div>
        </div>

        <motion.div
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{
            rotateX: isMobile ? 0 : rotateXRaw,
            rotateY: isMobile ? 0 : rotateYRaw,
            transformStyle: isMobile ? "flat" : "preserve-3d",
            perspective: isMobile ? "none" : "1000px",
          }}
          className="flex-1 relative rounded-2xl border border-white/10 bg-white/5 overflow-hidden group/card transition-shadow duration-300 transform-none md:transform"
          whileHover={isMobile ? {} : { scale: 1.02 }}
        >
          {/* Spotlight Effect */}
          {!isMobile && (
            <motion.div
              className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 group-hover/card:opacity-100 rounded-2xl"
              style={{
                background: spotlightBackground,
              }}
            />
          )}

          {/* 3D Glow Effect */}
          {!isMobile && (
            <motion.div
              className="pointer-events-none absolute -inset-1 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 rounded-2xl"
              style={{
                background: glowBackground,
                transform: "translateZ(-10px)",
              }}
            />
          )}

          <div
            className="relative p-6 z-10"
            style={{ transform: isMobile ? "none" : "translateZ(20px)" }}
          >
            <div className="flex items-center gap-3 mb-3">
              <motion.span
                className="text-xs font-mono text-primary/80 px-2 py-1 rounded border border-primary/20 bg-primary/5"
                whileHover={isMobile ? {} : { scale: 1.05 }}
                style={{ transform: isMobile ? "none" : "translateZ(10px)" }}
              >
                {exp.year}
              </motion.span>
              <motion.div
                style={{ transform: isMobile ? "none" : "translateZ(10px)" }}
                whileHover={isMobile ? {} : { rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                <exp.icon className="w-5 h-5 text-gray-500 group-hover/card:text-primary transition-colors" />
              </motion.div>
            </div>
            <motion.h3
              className="text-xl font-black text-white mb-1 group-hover/card:text-primary transition-colors"
              style={{ transform: isMobile ? "none" : "translateZ(15px)" }}
            >
              {exp.title}
            </motion.h3>
            <motion.div
              className="text-sm text-gray-400 mb-3 font-medium"
              style={{ transform: isMobile ? "none" : "translateZ(12px)" }}
            >
              {exp.company}
            </motion.div>
            <motion.p
              className="text-sm text-gray-500 leading-relaxed group-hover/card:text-gray-400 transition-colors"
              style={{ transform: isMobile ? "none" : "translateZ(8px)" }}
            >
              {exp.description}
            </motion.p>
          </div>
        </motion.div>
      </motion.div>
  );
}

export default function About() {
  const containerRef = useRef<HTMLElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 200,
    damping: 30,
    restDelta: 0.001,
    mass: 0.1,
  });

  const rotateX = useTransform(smoothProgress, [0, 1], [15, -15]);
  const rotateY = useTransform(smoothProgress, [0, 1], [-10, 10]);
  const scale = useTransform(smoothProgress, [0, 0.5, 1], [0.95, 1.02, 0.95]);

  // Timeline fill animation
  const timelineHeight = useTransform(scrollYProgress, [0.1, 0.8], [0, 100]);

  return (
    <section
      ref={containerRef}
      id="about"
      className="py-24 sm:py-32 relative overflow-hidden"
    >
      {/* Noise Texture Overlay */}
      <div className="absolute inset-0 opacity-[0.015] mix-blend-overlay pointer-events-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxwYXRoIGQ9Ik0wIDBoMzAwdjMwMEgweiIgZmlsdGVyPSJ1cmwoI2EpIiBvcGFjaXR5PSIuMDUiLz48L3N2Zz4=')] hidden md:block" />

      {/* Floating Orbs with Stronger Visibility */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-[200px] h-[200px] bg-primary/30 rounded-full blur-[120px] hidden md:block"
        whileInView={{
          x: [0, 100, 0],
          y: [0, -50, 0],
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        viewport={{ once: false }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-[200px] h-[200px] bg-secondary/30 rounded-full blur-[100px] hidden md:block"
        whileInView={{
          x: [0, -80, 0],
          y: [0, 60, 0],
          scale: [0.4, 1, 0.4],
          opacity: [0.2, 0.4, 0.2],
        }}
        viewport={{ once: false }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      />

      {/* Grid Pattern Overlay - More Visible */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.03)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          {/* Story Side */}
          <div className="relative">

              <motion.div
                className="relative z-10 transform-none md:transform"
                style={{
                  rotateX: isMobile ? 0 : rotateX,
                  rotateY: isMobile ? 0 : rotateY,
                  scale: isMobile ? 1 : scale,
                  transformStyle: isMobile ? "flat" : "preserve-3d",
                  perspective: isMobile ? "none" : "1000px",
                }}
              >
                
                <motion.h2
                  className="text-4xl sm:text-5xl  font-black mb-8 tracking-tight leading-tight"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  Every great{" "}
                  <span className="relative inline-block">
                    <span className="gradient-animated-text">developer</span>
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
                      developer
                    </motion.span>
                  </span>{" "}
                  begins with an even better{" "}
                  <span className="relative inline-block">
                    <span className="gradient-animated-text">story.</span>
                    <motion.span
                      className="absolute inset-0 gradient-animated-text blur-xl opacity-60"
                      animate={{
                        opacity: [0.4, 0.7, 0.4],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 0.5,
                      }}
                    >
                      story.
                    </motion.span>
                  </span>
                </motion.h2>

                <motion.div
                  className="space-y-6 text-lg text-gray-400 leading-relaxed"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  <p>
                    Embarking on the rollercoaster ride of my freelance software
                    development odyssey about 15 years ago, I&apos;ve been the
                    virtuoso of remote work for esteemed agencies, the go-to
                    consultant for ambitious startups, and the maestro of
                    collaboration.
                  </p>
                  <p>
                    Beneath my seemingly calm exterior lies a quiet confidence,
                    stirred with a natural curiosity that propels me into
                    perpetual learning endeavors.
                  </p>
                  <p>
                    Think of me as a silent wizard, weaving code spells and
                    conjuring up solutions, all while perfecting my craft in the
                    ever-ticking clock of time. And yes, I may just be the
                    humble architect of your next digital masterpiece!
                  </p>
                </motion.div>

                <motion.div
                  className="mt-12 flex gap-8"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  {[
                    { value: "15+", label: "Years Experience" },
                    { value: "63+", label: "Projects Completed" },
                  ].map((stat, i) => (
                    <motion.div
                      key={i}
                      className="relative group"
                      whileHover={{ scale: 1.05, y: -5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <div className="relative z-10">
                        <div className="text-3xl sm:text-4xl md:text-5xl font-black bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent mb-2">
                          {stat.value}
                        </div>
                        <div className="text-sm text-gray-500 uppercase tracking-wider">
                          {stat.label}
                        </div>
                      </div>
                      <motion.div
                        className="absolute inset-0 bg-primary/5 rounded-lg blur-xl -z-10 opacity-0 group-hover:opacity-100"
                        transition={{ duration: 0.3 }}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>

          </div>

          {/* Timeline Side */}
          <div className="relative">
            {/* Animated Timeline Line - Background */}
            <div className="absolute left-8 top-0 bottom-0 w-px bg-white/5 hidden sm:block" />

            {/* Animated Timeline Line - Fill */}
            <motion.div
              style={{ height: useTransform(timelineHeight, (v) => `${v}%`) }}
              className="absolute left-8 top-0 w-px bg-gradient-to-b from-primary via-primary-dark to-primary hidden sm:block origin-top"
            />

            <div className="space-y-4 sm:space-y-12">
              {experiences.map((exp, index) => (
                <ExperienceCard key={index} exp={exp} index={index} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


