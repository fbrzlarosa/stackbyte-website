"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
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
import { useEffect, useRef, useState } from "react";
import ScrollingBackgroundText from "./ScrollingBackgroundText";

gsap.registerPlugin(ScrollTrigger);

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
    color: "#06b6d4",
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
    gradient: "from-violet-500 to-purple-600",
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
  isMobile: boolean;
}

function SkillCard({ skill, index, isMobile }: SkillCardProps) {
  const rangeStart = index * 0.2;
  const rangeEnd = (index + 1) * 0.2;

  const enterStart =
    index === 0
      ? isMobile
        ? -0.02
        : -0.05
      : isMobile
      ? rangeStart - 0.05
      : rangeStart - 0.1;
  const enterEnd =
    index === 0
      ? isMobile
        ? rangeStart + 0.05
        : rangeStart + 0.08
      : isMobile
      ? rangeStart + 0.03
      : rangeStart + 0.05;
  const exitStart = isMobile ? rangeEnd - 0.03 : rangeEnd - 0.05;
  const exitEnd = isMobile ? rangeEnd + 0.05 : rangeEnd + 0.05;

  const cardRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const paraRef = useRef<HTMLParagraphElement>(null);
  const detailsRef = useRef<HTMLDivElement>(null);
  const linkRef = useRef<HTMLDivElement>(null);
  const iconContainerRef = useRef<HTMLDivElement>(null);

  const mousePos = useRef({ x: 0, y: 0 });
  const contentRotateX = useRef(0);
  const contentRotateY = useRef(0);

  const lerp = (start: number, end: number, t: number) =>
    start + (end - start) * t;
  const mapRange = (
    value: number,
    inMin: number,
    inMax: number,
    outMin: number,
    outMax: number
  ) => {
    if (value <= inMin) return outMin;
    if (value >= inMax) return outMax;
    const t = (value - inMin) / (inMax - inMin);
    return lerp(outMin, outMax, t);
  };

  const getValue = (progress: number, ranges: number[], values: number[]) => {
    if (progress <= ranges[0]) return values[0];
    if (progress >= ranges[ranges.length - 1]) return values[values.length - 1];

    for (let i = 0; i < ranges.length - 1; i++) {
      if (progress >= ranges[i] && progress <= ranges[i + 1]) {
        return mapRange(
          progress,
          ranges[i],
          ranges[i + 1],
          values[i],
          values[i + 1]
        );
      }
    }
    return values[0];
  };

  useEffect(() => {
    if (!cardRef.current) return;

    const ctx = gsap.context(() => {
      const container = cardRef.current?.closest("section");
      if (!container) return;

      let targetRotateX = 0;
      let targetRotateY = 0;
      let rafId: number | null = null;

      const updateMouseRotation = () => {
        if (contentRef.current && !isMobile) {
          contentRotateX.current = lerp(
            contentRotateX.current,
            targetRotateX,
            0.1
          );
          contentRotateY.current = lerp(
            contentRotateY.current,
            targetRotateY,
            0.1
          );

          gsap.set(contentRef.current, {
            rotateX: contentRotateX.current,
            rotateY: contentRotateY.current,
          });
        }

        if (
          Math.abs(contentRotateX.current - targetRotateX) > 0.01 ||
          Math.abs(contentRotateY.current - targetRotateY) > 0.01
        ) {
          rafId = requestAnimationFrame(updateMouseRotation);
        } else {
          rafId = null;
        }
      };

      const handleMouseMove = (e: MouseEvent) => {
        if (!cardRef.current || isMobile) return;

        const rect = cardRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        mousePos.current = {
          x: e.clientX - centerX,
          y: e.clientY - centerY,
        };

        targetRotateX = mapRange(mousePos.current.y, -300, 300, 5, -5);
        targetRotateY = mapRange(mousePos.current.x, -300, 300, -5, 5);

        if (!rafId) {
          rafId = requestAnimationFrame(updateMouseRotation);
        }
      };

      ScrollTrigger.create({
        trigger: container,
        start: "top bottom",
        end: "bottom-=300vh top",
        scrub: true,
        onUpdate: (self) => {
          const p = self.progress;

          const opacity = getValue(
            p,
            [enterStart, enterEnd, exitStart, exitEnd],
            [0, 1, 1, 0]
          );
          const x = isMobile
            ? 0
            : getValue(
                p,
                [enterStart, enterEnd, exitStart, exitEnd],
                [1920, 96, -96, -1920]
              );
          const y = isMobile
            ? getValue(
                p,
                [enterStart, enterEnd, exitStart, exitEnd],
                [100, 0, 0, -100]
              )
            : getValue(
                p,
                [enterStart, enterEnd, exitStart, exitEnd],
                [540, 22, -22, -540]
              );
          const rotateY = isMobile
            ? 0
            : getValue(
                p,
                [enterStart, enterEnd, exitStart, exitEnd],
                [45, 5, -5, -45]
              );
          const rotateZ = isMobile
            ? 0
            : getValue(
                p,
                [enterStart, enterEnd, exitStart, exitEnd],
                [10, 2, -2, -10]
              );
          const z = isMobile
            ? 0
            : getValue(
                p,
                [enterStart, enterEnd, exitStart, exitEnd],
                [-1200, 0, 100, -1200]
              );
          const scale = isMobile
            ? getValue(
                p,
                [enterStart, enterEnd, exitStart, exitEnd],
                [0.9, 1, 1, 0.9]
              )
            : getValue(
                p,
                [enterStart, enterEnd, exitStart, exitEnd],
                [0.6, 1, 1.05, 0.6]
              );

          const contentParallaxX = isMobile
            ? 0
            : mapRange(p, enterStart, exitEnd, 100, -100);
          const titleParallaxX = isMobile
            ? 0
            : mapRange(p, enterStart, exitEnd, 200, -200);

          if (cardRef.current) {
            gsap.set(cardRef.current, {
              opacity,
              x,
              y,
              rotateY,
              rotateZ,
              z,
              scale,
              transformPerspective: 1000,
              zIndex: 10 - index,
            });
          }

          if (badgeRef.current) {
            gsap.set(badgeRef.current, {
              x: contentParallaxX,
              translateZ: 20,
            });
          }

          if (titleRef.current) {
            gsap.set(titleRef.current, {
              x: titleParallaxX,
              translateZ: 40,
            });
          }

          if (paraRef.current) {
            gsap.set(paraRef.current, {
              x: contentParallaxX,
              translateZ: 30,
            });
          }

          if (detailsRef.current) {
            gsap.set(detailsRef.current, {
              x: contentParallaxX,
              translateZ: 25,
            });
          }

          if (linkRef.current) {
            gsap.set(linkRef.current, {
              x: contentParallaxX,
              translateZ: 35,
            });
          }
        },
      });

      if (cardRef.current && !isMobile) {
        cardRef.current.addEventListener("mousemove", handleMouseMove, {
          passive: true,
        });
      }

      return () => {
        if (cardRef.current) {
          cardRef.current.removeEventListener("mousemove", handleMouseMove);
        }
        if (rafId) {
          cancelAnimationFrame(rafId);
        }
      };
    }, cardRef);

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, isMobile]);

  useEffect(() => {
    if (!badgeRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            gsap.fromTo(
              badgeRef.current,
              { opacity: 0, y: 20 },
              {
                opacity: 1,
                y: 0,
                duration: 0.6,
                delay: 0.2,
                ease: "power2.out",
              }
            );
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(badgeRef.current);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!iconContainerRef.current) return;

    gsap.to(iconContainerRef.current, {
      rotation: 360,
      duration: 20,
      repeat: -1,
      ease: "none",
    });

    gsap.to(iconContainerRef.current, {
      keyframes: [{ scale: 1 }, { scale: 1.1 }, { scale: 1 }],
      duration: 4,
      repeat: -1,
      ease: "sine.inOut",
    });
  }, []);

  return (
    <div
      ref={cardRef}
      className="absolute top-32 md:top-auto w-[85vw] sm:w-[90vw] max-w-6xl h-[70vh] sm:h-[70vh] md:h-[70vh] flex flex-col lg:flex-row overflow-visible rounded-2xl sm:rounded-3xl bg-[#0D1117] border border-white/10 shadow-2xl origin-center perspective-1000"
      style={{
        willChange: "transform, opacity",
        transformStyle: "preserve-3d",
      }}
    >
      <div
        ref={contentRef}
        className="flex-1 p-6 sm:p-8 md:p-12 lg:p-16 flex flex-col justify-center relative z-10"
        style={{
          transformStyle: "preserve-3d",
        }}
      >
        <div
          ref={badgeRef}
          className={`inline-flex self-start items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-gradient-to-r ${skill.gradient} bg-opacity-10 text-white text-xs sm:text-sm font-bold tracking-wider mb-4 sm:mb-6`}
          style={{ transformStyle: "preserve-3d" }}
        >
          <skill.icon className="w-3 h-3 sm:w-4 sm:h-4" />
          {skill.subtitle}
        </div>

        <h2
          ref={titleRef}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black mb-4 sm:mb-6 md:mb-8 tracking-tighter text-white"
          style={{ transformStyle: "preserve-3d" }}
        >
          {skill.title}
        </h2>

        <p
          ref={paraRef}
          className="text-base sm:text-lg md:text-xl text-gray-400 leading-relaxed mb-6 sm:mb-8 md:mb-12 max-w-2xl"
          style={{ transformStyle: "preserve-3d" }}
        >
          {skill.description}
        </p>

        <div
          ref={detailsRef}
          className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8 md:mb-12"
          style={{ transformStyle: "preserve-3d" }}
        >
          {skill.details.map((detail, i) => (
            <div
              key={i}
              className="flex items-center gap-2 sm:gap-3 text-sm sm:text-base text-gray-300"
            >
              <div
                className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${skill.gradient} shrink-0`}
              />
              <span>{detail}</span>
            </div>
          ))}
        </div>

        <div ref={linkRef} style={{ transformStyle: "preserve-3d" }}>
          <Link
            href="#contact"
            className="inline-flex items-center gap-2 sm:gap-3 text-base sm:text-lg font-bold hover:gap-4 sm:hover:gap-6 transition-all duration-300 group w-fit cursor-pointer"
            style={{ color: skill.color }}
          >
            Start Project{" "}
            <ArrowRight className="w-6 h-6" style={{ color: skill.color }} />
          </Link>
        </div>
      </div>

      <div className="flex-1 relative hidden lg:block overflow-visible">
        <div
          className={`absolute inset-0 bg-gradient-to-br ${skill.gradient} opacity-20 rounded-2xl sm:rounded-3xl overflow-hidden`}
        />

        <div className="absolute inset-0 flex items-center justify-center">
          <div
            ref={iconContainerRef}
            className="relative w-96 h-96"
            style={{ transformStyle: "preserve-3d" }}
          >
            <div className="absolute inset-0 border-2 border-dashed border-white/20 rounded-full" />
            <div className="absolute inset-12 border border-white/10 rounded-full" />

            <div className="absolute inset-0 flex items-center justify-center">
              <skill.icon
                className="w-48 h-48 text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.3)]"
                strokeWidth={1}
              />
            </div>
          </div>
        </div>

        <div className="absolute inset-0 bg-gradient-to-l from-transparent to-[#0D1117]" />
      </div>
    </div>
  );
}

interface NavigationDotProps {
  skill: {
    id: string;
    title: string;
    color: string;
  };
  index: number;
  containerRef: React.RefObject<HTMLElement | null>;
}

function NavigationDot({ skill, index, containerRef }: NavigationDotProps) {
  const dotRef = useRef<HTMLDivElement>(null);
  const rangeStart = index * 0.2;
  const rangeEnd = index * 0.2 + 0.2;

  const lerp = (start: number, end: number, t: number) =>
    start + (end - start) * t;

  useEffect(() => {
    if (!dotRef.current || !containerRef.current) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top bottom",
        end: "bottom-=300vh top",
        scrub: true,
        onUpdate: (self) => {
          if (!dotRef.current) return;

          const p = self.progress;

          const centerProgress = (rangeStart + rangeEnd) / 2;
          const distanceFromCenter = Math.abs(p - centerProgress);
          const maxDistance = (rangeEnd - rangeStart) / 2;

          const mappedProgress = Math.max(
            0,
            Math.min(1, 1 - distanceFromCenter / maxDistance)
          );

          const easedProgress = Math.pow(mappedProgress, 0.7);

          const scale = lerp(1, 1.5, easedProgress);

          const r1 = parseInt(skill.color.slice(1, 3), 16);
          const g1 = parseInt(skill.color.slice(3, 5), 16);
          const b1 = parseInt(skill.color.slice(5, 7), 16);

          const r = Math.round(lerp(255, r1, easedProgress));
          const g = Math.round(lerp(255, g1, easedProgress));
          const b = Math.round(lerp(255, b1, easedProgress));
          const a = lerp(0.2, 1, easedProgress);

          const backgroundColor = `rgba(${r},${g},${b},${a})`;

          gsap.set(dotRef.current, {
            scale: scale,
            backgroundColor: backgroundColor,
          });
        },
      });
    }, dotRef);

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, skill.color]);

  return (
    <button key={skill.id} className="relative group" onClick={() => {}}>
      <div
        ref={dotRef}
        className="w-3 h-3 rounded-full bg-white/20 group-hover:bg-white/50 transition-colors"
      />
      <div className="absolute bottom-full mb-4 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-xs font-mono whitespace-nowrap bg-black px-2 py-1 rounded border border-white/10">
        {skill.title}
      </div>
    </button>
  );
}

function ScrollingBackgroundTextWrapper({
  containerRef,
  children,
  className,
  style,
}: {
  containerRef: React.RefObject<HTMLElement | null>;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!containerRef.current) return;

    const scrollTrigger = ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top bottom",
      end: "bottom-=400vh top",
      scrub: true,
      onUpdate: (self) => {
        setProgress(self.progress);
      },
    });

    return () => {
      scrollTrigger.kill();
    };
  }, [containerRef]);

  return (
    <ScrollingBackgroundText
      progress={progress}
      className={className}
      style={style}
    >
      {children}
    </ScrollingBackgroundText>
  );
}

export default function SkillsShowcase() {
  const containerRef = useRef<HTMLElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <section ref={containerRef} className="relative h-[800vh]" id="services">
      <div className="sticky top-0 h-screen overflow-visible flex items-center justify-center">
        <div className="absolute bottom-6 sm:bottom-12 left-4 sm:left-1/2 sm:-translate-x-1/2 z-50 flex items-center gap-3 sm:gap-4 bg-black/40 backdrop-blur-md px-4 sm:px-6 py-2 sm:py-3 rounded-full border border-white/10 overflow-x-auto max-w-[calc(100vw-2rem)] sm:max-w-fit no-scrollbar">
          {skills.map((skill, index) => (
            <NavigationDot
              key={skill.id}
              skill={skill}
              index={index}
              containerRef={containerRef}
            />
          ))}
        </div>

        <ScrollingBackgroundTextWrapper
          containerRef={containerRef}
          className="absolute bottom-8 sm:bottom-auto sm:-top-0 whitespace-nowrap text-[15vh] sm:text-[30vw] md:text-[40vw] font-black text-transparent stroke-text select-none pointer-events-none left-0 opacity-50 sm:opacity-100"
          style={{
            WebkitTextStroke: "2px rgba(255,255,255,0.08)",
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
        </ScrollingBackgroundTextWrapper>

        <div className="relative w-full h-full flex items-center justify-center perspective-distant overflow-visible">
          {skills.map((skill, index) => (
            <SkillCard
              key={skill.id}
              skill={skill}
              index={index}
              isMobile={isMobile}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
