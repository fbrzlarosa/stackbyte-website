"use client";

import {
  motion,
  MotionValue,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import {
  ArrowRight,
  Bot,
  CloudCog,
  Coins,
  Globe,
  LucideIcon,
  Server,
} from "lucide-react";
import Link from "next/link";
import { MouseEvent, useRef } from "react";

const skills = [
  {
    id: "frontend",
    title: "FRONTEND",
    subtitle: "Digital Experience",
    description:
      "Crafting immersive digital journeys that captivate and convert. From high-performance landing pages to complex web applications, I build pixel-perfect interfaces that users love.",
    details: [
      "React / React Native",
      "Next.js / Remix",
      "Angular / Vue",
      "WordPress / Elementor",
    ],
    icon: Globe,
    color: "#06B6D4",
    gradient: "from-cyan-500 to-blue-600",
  },
  {
    id: "backend",
    title: "BACKEND",
    subtitle: "System Architecture",
    description:
      "Designing robust, scalable server-side solutions that power your business logic. Secure APIs, efficient databases, and microservices architecture built for high availability.",
    details: [
      "Node.js / TypeScript",
      "Python / Go",
      "PHP / Laravel",
      "System Design",
    ],
    icon: Server,
    color: "#8B5CF6",
    gradient: "from-purple-500 to-indigo-600",
  },
  {
    id: "web3",
    title: "WEB3",
    subtitle: "Decentralized Future",
    description:
      "Pioneering the next generation of the internet. Smart contract development, DApp integration, and blockchain solutions that bring transparency and trust to your applications.",
    details: [
      "Blockchain / Crypto",
      "Smart Contracts",
      "DeFi Protocols",
      "DApps Architecture",
    ],
    icon: Coins,
    color: "#F59E0B",
    gradient: "from-amber-500 to-orange-600",
  },
  {
    id: "ai",
    title: "AI",
    subtitle: "Intelligent Solutions",
    description:
      "Integrating cutting-edge artificial intelligence to automate processes and create smarter applications. Leveraging LLMs and predictive models to unlock new possibilities.",
    details: [
      "LLM Integration",
      "OpenAI / Anthropic",
      "AI Agents",
      "Predictive Models",
    ],
    icon: Bot,
    color: "#EC4899",
    gradient: "from-pink-500 to-rose-600",
  },
  {
    id: "devops",
    title: "DEVOPS",
    subtitle: "Cloud Infrastructure",
    description:
      "Automating the bridge between code and deployment. CI/CD pipelines, container orchestration, and cloud infrastructure management ensuring your software runs smoothly everywhere.",
    details: [
      "Docker / Kubernetes",
      "CI / CD Pipelines",
      "Agile Methodology",
      "Robot Framework",
    ],
    icon: CloudCog,
    color: "#10B981",
    gradient: "from-emerald-500 to-teal-600",
  },
];

interface SkillCardProps {
  skill: {
    id: string;
    title: string;
    subtitle: string;
    description: string;
    details: string[];
    icon: LucideIcon;
    color: string;
    gradient: string;
  };
  index: number;
  smoothProgress: MotionValue<number>;
}

function SkillCard({ skill, index, smoothProgress }: SkillCardProps) {
  const rangeStart = index * 0.2 + 0.1;
  const rangeEnd = (index + 1) * 0.2 + 0.1;

  const enterStart = rangeStart - 0.1;
  const enterEnd = rangeStart + 0.05;
  const exitStart = rangeEnd - 0.05;
  const exitEnd = rangeEnd + 0.1;

  const opacity = useTransform(
    smoothProgress,
    [enterStart, enterEnd, exitStart, exitEnd],
    [0, 1, 1, 0]
  );

  const x = useTransform(
    smoothProgress,
    [enterStart, enterEnd, exitStart, exitEnd],
    ["100%", "5%", "-5%", "-100%"]
  );

  const y = useTransform(
    smoothProgress,
    [enterStart, enterEnd, exitStart, exitEnd],
    ["50%", "2%", "-2%", "-50%"]
  );

  const rotateY = useTransform(
    smoothProgress,
    [enterStart, enterEnd, exitStart, exitEnd],
    [45, 5, -5, -45]
  );

  const rotateZ = useTransform(
    smoothProgress,
    [enterStart, enterEnd, exitStart, exitEnd],
    [10, 2, -2, -10]
  );

  const z = useTransform(
    smoothProgress,
    [enterStart, enterEnd, exitStart, exitEnd],
    [-1200, 0, 100, -1200]
  );

  const scale = useTransform(
    smoothProgress,
    [enterStart, enterEnd, exitStart, exitEnd],
    [0.6, 1, 1.05, 0.6]
  );

  // Parallax effect for internal content based on scroll
  const contentParallaxX = useTransform(
    smoothProgress,
    [enterStart, exitEnd],
    ["15%", "-15%"]
  );

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rafId = useRef<number | null>(null);
  const lastUpdate = useRef(0);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const now = performance.now();
    if (now - lastUpdate.current < 32) return;
    lastUpdate.current = now;

    if (rafId.current) cancelAnimationFrame(rafId.current);
    rafId.current = requestAnimationFrame(() => {
      const rect = e.currentTarget.getBoundingClientRect();
      const xPos = e.clientX - rect.left - rect.width / 2;
      const yPos = e.clientY - rect.top - rect.height / 2;
      mouseX.set(xPos);
      mouseY.set(yPos);
    });
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const contentRotateX = useSpring(useTransform(mouseY, [-300, 300], [5, -5]), {
    stiffness: 200,
    damping: 25,
    mass: 0.2,
  });
  const contentRotateY = useSpring(useTransform(mouseX, [-300, 300], [-5, 5]), {
    stiffness: 200,
    damping: 25,
    mass: 0.2,
  });

  return (
    <motion.div
      className="absolute top-32 md:top-auto w-[85vw] sm:w-[90vw] max-w-6xl h-[70vh] sm:h-[70vh] md:h-[70vh] flex flex-col lg:flex-row overflow-hidden rounded-2xl sm:rounded-3xl bg-[#0D1117] border border-white/10 shadow-2xl origin-center perspective-1000"
      style={{
        opacity,
        scale,
        x,
        y,
        rotateY,
        rotateZ,
        z,
        zIndex: 10 - index,
        willChange: 'transform, opacity',
        transformStyle: 'preserve-3d',
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Left Content Side */}
      <motion.div
        className="flex-1 p-6 sm:p-8 md:p-12 lg:p-16 flex flex-col justify-center relative z-10"
        style={{
          rotateX: contentRotateX,
          rotateY: contentRotateY,
          transformStyle: "preserve-3d",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`inline-flex self-start items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-linear-to-r ${skill.gradient} bg-opacity-10 text-white text-xs sm:text-sm font-bold tracking-wider mb-4 sm:mb-6`}
          style={{ translateZ: 20, x: contentParallaxX }}
        >
          <skill.icon className="w-3 h-3 sm:w-4 sm:h-4" />
          {skill.subtitle}
        </motion.div>

        <motion.h2
          className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl xl:text-7xl font-black mb-4 sm:mb-6 md:mb-8 tracking-tighter text-white"
          style={{ translateZ: 40, x: contentParallaxX }}
        >
          {skill.title}
        </motion.h2>

        <motion.p
          className="text-base sm:text-lg md:text-xl text-gray-400 leading-relaxed mb-6 sm:mb-8 md:mb-12 max-w-2xl"
          style={{ translateZ: 30, x: contentParallaxX }}
        >
          {skill.description}
        </motion.p>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8 md:mb-12"
          style={{ translateZ: 25, x: contentParallaxX }}
        >
          {skill.details.map((detail, i) => (
            <div
              key={i}
              className="flex items-center gap-2 sm:gap-3 text-sm sm:text-base text-gray-300"
            >
              <div
                className={`w-1.5 h-1.5 rounded-full bg-linear-to-r ${skill.gradient} shrink-0`}
              />
              <span>{detail}</span>
            </div>
          ))}
        </motion.div>

        <motion.div style={{ translateZ: 35, x: contentParallaxX }}>
          <Link
            href="#contact"
            className={`inline-flex items-center gap-2 sm:gap-3 text-base sm:text-lg font-bold hover:gap-4 sm:hover:gap-6 transition-all duration-300 bg-linear-to-r ${skill.gradient} bg-clip-text text-transparent group w-fit cursor-pointer`}
          >
            Start Project{" "}
            <ArrowRight
              className={`w-6 h-6 text-${skill.color}`}
              style={{ color: skill.color }}
            />
          </Link>
        </motion.div>
      </motion.div>

      {/* Right Visual Side */}
      <div className="flex-1 relative hidden lg:block overflow-hidden">
        {/* Gradient Background */}
        <div
          className={`absolute inset-0 bg-linear-to-br ${skill.gradient} opacity-20`}
        />

        {/* Animated Icon Container */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            animate={{
              rotate: 360,
              scale: [1, 1.1, 1],
            }}
            transition={{
              rotate: {
                duration: 20,
                repeat: Infinity,
                ease: "linear",
              },
              scale: {
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              },
            }}
            className="relative w-96 h-96"
          >
            {/* Decorative Rings */}
            <div className="absolute inset-0 border-2 border-dashed border-white/20 rounded-full" />
            <div className="absolute inset-12 border border-white/10 rounded-full" />

            {/* Center Icon */}
            <div className="absolute inset-0 flex items-center justify-center">
              <skill.icon
                className="w-48 h-48 text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.3)]"
                strokeWidth={1}
              />
            </div>
          </motion.div>
        </div>

        {/* Overlay Gradient for text readability if needed */}
        <div className="absolute inset-0 bg-linear-to-l from-transparent to-[#0D1117]" />
      </div>
    </motion.div>
  );
}

interface NavigationDotProps {
  skill: {
    id: string;
    title: string;
    color: string;
  };
  index: number;
  smoothProgress: MotionValue<number>;
}

function NavigationDot({ skill, index, smoothProgress }: NavigationDotProps) {
  const backgroundColor = useTransform(
    smoothProgress,
    [index * 0.2, index * 0.2 + 0.2],
    ["rgba(255,255,255,0.2)", skill.color]
  );

  const scale = useTransform(
    smoothProgress,
    [index * 0.2, index * 0.2 + 0.2],
    [1, 1.5]
  );

  return (
    <motion.button
      key={skill.id}
      className="relative group"
      onClick={() => {
        // Scroll to specific section logic
      }}
    >
      <motion.div
        className="w-3 h-3 rounded-full bg-white/20 group-hover:bg-white/50 transition-colors"
        style={{
          backgroundColor,
          scale,
        }}
      />
      <div className="absolute bottom-full mb-4 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-xs font-mono whitespace-nowrap bg-black px-2 py-1 rounded border border-white/10">
        {skill.title}
      </div>
    </motion.button>
  );
}

export default function SkillsShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 50vh", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 200,
    damping: 30,
    restDelta: 0.002,
    mass: 0.2,
  });

  return (
    <section
      ref={containerRef}
      className="relative h-[600vh] bg-[#0D1117]"
      id="services"
    >
      <div className="sticky top-0 h-screen overflow-hidden flex items-center justify-center">
        {/* Navigation Dots / Menu */}
        <div className="absolute bottom-6 sm:bottom-12 left-4 sm:left-1/2 sm:-translate-x-1/2 z-50 flex items-center gap-4 sm:gap-4 bg-black/40 backdrop-blur-md px-3 sm:px-6 py-2 sm:py-3 rounded-full border border-white/10">
          {skills.map((skill, index) => (
            <NavigationDot
              key={skill.id}
              skill={skill}
              index={index}
              smoothProgress={smoothProgress}
            />
          ))}
        </div>

        {/* Giant Background Text - UPDATED */}
        <motion.div
          className="absolute bottom-8 sm:bottom-auto sm:-top-52 whitespace-nowrap text-[15vh] sm:text-[30vw] md:text-[40vw] font-black text-transparent stroke-text select-none pointer-events-none left-0 opacity-50 sm:opacity-100"
          style={{
            x: useTransform(smoothProgress, [0, 1], ["10%", "-100%"]),
            WebkitTextStroke: "2px rgba(255,255,255,0.08)",
          }}
        >
          CODE &bull; COFFEE &bull;{" "}
          <span className="text-primary/10" style={{ WebkitTextStroke: "0px" }}>
            INNOVATION
          </span>{" "}
          &bull; CREATIVITY &bull;{" "}
          <span className="text-primary/10" style={{ WebkitTextStroke: "0px" }}>
            PASSION &bull;
          </span>{" "}
        </motion.div>

        {/* Cards Container - UPDATED ANIMATION */}
        <div className="relative w-full h-full flex items-center justify-center perspective-distant">
          {skills.map((skill, index) => (
            <SkillCard
              key={skill.id}
              skill={skill}
              index={index}
              smoothProgress={smoothProgress}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
