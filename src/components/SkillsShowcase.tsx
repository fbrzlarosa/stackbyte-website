"use client";

import {
  motion,
  MotionValue,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import {
  ArrowRight,
  CloudCog,
  Coins,
  Globe,
  LucideIcon,
  Server,
} from "lucide-react";
import Link from "next/link";
import { useRef } from "react";

const skills = [
  {
    id: "websites",
    title: "WEBSITES",
    subtitle: "Digital Experience",
    description:
      "Crafting immersive digital journeys that captivate and convert. From high-performance landing pages to complex web applications, I build pixel-perfect interfaces that users love.",
    details: [
      "React / Next.js",
      "Tailwind CSS",
      "Three.js / WebGL",
      "Performance Optimization",
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
      "Node.js / NestJS",
      "PostgreSQL / Redis",
      "System Design",
      "API Security",
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
      "Solidity",
      "Ethers.js / Viem",
      "Smart Contracts",
      "DeFi Protocols",
    ],
    icon: Coins,
    color: "#F59E0B",
    gradient: "from-amber-500 to-orange-600",
  },
  {
    id: "devops",
    title: "DEVOPS",
    subtitle: "Cloud Infrastructure",
    description:
      "Automating the bridge between code and deployment. CI/CD pipelines, container orchestration, and cloud infrastructure management ensuring your software runs smoothly everywhere.",
    details: [
      "Docker / Kubernetes",
      "AWS / Google Cloud",
      "CI/CD Pipelines",
      "Infrastructure as Code",
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
  const rangeStart = index * 0.25 + 0.1;
  const rangeEnd = (index + 1) * 0.25 + 0.1;

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

  return (
    <motion.div
      className="absolute w-[90vw] max-w-6xl h-[70vh] flex flex-col lg:flex-row overflow-hidden rounded-[3rem] bg-[#0D1117] border border-white/10 shadow-2xl origin-center"
      style={{
        opacity,
        scale,
        x,
        y,
        rotateY,
        rotateZ,
        z,
        zIndex: 10 - index,
      }}
    >
      {/* Left Content Side */}
      <div className="flex-1 p-8 lg:p-16 flex flex-col justify-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`inline-flex self-start items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${skill.gradient} bg-opacity-10 text-white text-sm font-bold tracking-wider mb-6`}
        >
          <skill.icon className="w-4 h-4" />
          {skill.subtitle}
        </motion.div>

        <h2 className="text-5xl lg:text-8xl font-black mb-8 tracking-tighter text-white">
          {skill.title}
        </h2>

        <p className="text-xl text-gray-400 leading-relaxed mb-12 max-w-2xl">
          {skill.description}
        </p>

        <div className="grid grid-cols-2 gap-4 mb-12">
          {skill.details.map((detail, i) => (
            <div key={i} className="flex items-center gap-3 text-gray-300">
              <div
                className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${skill.gradient}`}
              />
              {detail}
            </div>
          ))}
        </div>

        <Link
          href="#contact"
          className={`inline-flex items-center gap-3 text-lg font-bold hover:gap-6 transition-all duration-300 bg-gradient-to-r ${skill.gradient} bg-clip-text text-transparent group w-fit`}
        >
          Start Project{" "}
          <ArrowRight
            className={`w-6 h-6 text-${skill.color}`}
            style={{ color: skill.color }}
          />
        </Link>
      </div>

      {/* Right Visual Side */}
      <div className="flex-1 relative hidden lg:block overflow-hidden">
        {/* Gradient Background */}
        <div
          className={`absolute inset-0 bg-gradient-to-br ${skill.gradient} opacity-20`}
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
        <div className="absolute inset-0 bg-gradient-to-l from-transparent to-[#0D1117]" />
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
    [index * 0.25, index * 0.25 + 0.25],
    ["rgba(255,255,255,0.2)", skill.color]
  );

  const scale = useTransform(
    smoothProgress,
    [index * 0.25, index * 0.25 + 0.25],
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
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <section
      ref={containerRef}
      className="relative h-[500vh] bg-[#0D1117]"
      id="services"
    >
      <div className="sticky top-0 h-screen overflow-hidden flex items-center justify-center">
        {/* Navigation Dots / Menu */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4 bg-black/40 backdrop-blur-md px-6 py-3 rounded-full border border-white/10">
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
          className="absolute whitespace-nowrap text-[40vw] font-black text-transparent stroke-text select-none pointer-events-none left-0"
          style={{
            x: useTransform(smoothProgress, [0, 1], ["10%", "-100%"]),
            WebkitTextStroke: "2px rgba(255,255,255,0.05)",
          }}
        >
          CODE &bull; COFFEE &bull;{" "}
          <span className="text-primary/1" style={{ WebkitTextStroke: "0px" }}>
            INNOVATION
          </span>{" "}
          &bull; CREATIVITY &bull;{" "}
          <span className="text-primary/1" style={{ WebkitTextStroke: "0px" }}>
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
