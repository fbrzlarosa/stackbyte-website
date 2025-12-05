"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef, useState } from "react";
import FullScreenSection from "./FullScreenSection";

gsap.registerPlugin(ScrollTrigger);

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
  const containerRef = useRef<HTMLDivElement>(null);
  const word1Ref = useRef<HTMLHeadingElement>(null);
  const word2Ref = useRef<HTMLHeadingElement>(null);
  const word3Ref = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const orb1Ref = useRef<HTMLDivElement>(null);
  const orb2Ref = useRef<HTMLDivElement>(null);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [smallParticles, setSmallParticles] = useState<SmallParticle[]>([]);
  const [isMobile, setIsMobile] = useState(false);
  const particleRefs = useRef<(HTMLDivElement | null)[]>([]);
  const smallParticleRefs = useRef<(HTMLDivElement | null)[]>([]);

  const word1BaseValues = useRef({
    rotateX: 0,
    rotateY: 0,
    translateZ: 0,
    y: 0,
  });
  const word2BaseValues = useRef({
    rotateX: 0,
    rotateY: 0,
    translateZ: 0,
    y: 0,
  });
  const word3BaseValues = useRef({
    rotateX: 0,
    rotateY: 0,
    translateZ: 0,
    y: 0,
  });
  const word1AnimValues = useRef({ rotateX: 0, rotateY: 0, translateZ: 0 });
  const word2AnimValues = useRef({ rotateX: 0, rotateY: 0, translateZ: 0 });
  const word3AnimValues = useRef({ rotateX: 0, rotateY: 0, translateZ: 0 });
  const updateCombinedRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile, { passive: true });
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    
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

    const newSmallParticles = Array.from({ length: 30 }).map((_, i) => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      return {
        id: i,
        initialX: Math.random() * width,
        initialY: Math.random() * height,
        animateY: [
          Math.random() * height,
          Math.random() * height,
          Math.random() * height,
        ],
        animateX: [
          Math.random() * width,
          Math.random() * width,
          Math.random() * width,
        ],
        duration: 15 + Math.random() * 10,
        delay: Math.random() * 5,
      };
    });

    setTimeout(() => {
      setSmallParticles(newSmallParticles);
    }, 0);
  }, []);

  useEffect(() => {
    if (!sectionRef.current || !containerRef.current) return;

    const ctx = gsap.context(() => {
      const lerp = (start: number, end: number, t: number) =>
        start + (end - start) * t;

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top bottom",
        end: "bottom top",
        scrub: 1,
        onUpdate: (self) => {
          const p = self.progress;

          if (containerRef.current) {
            const rotateX = isMobile ? 0 : lerp(20, -20, p);
            const rotateY = isMobile ? 0 : lerp(-15, 15, p);
            let scale = 1;
            if (!isMobile) {
              if (p <= 0.5) {
                scale = lerp(0.9, 1.1, p / 0.5);
              } else {
                scale = lerp(1.1, 0.9, (p - 0.5) / 0.5);
              }
            }
            const translateZ = isMobile ? 0 : lerp(-80, 80, p);
            const y = isMobile ? 0 : lerp(40, -40, p);

            gsap.set(containerRef.current, {
              rotateX,
              rotateY,
              scale,
              translateZ,
              y,
              transformPerspective: 2000,
            });
          }

          if (word1Ref.current) {
            word1BaseValues.current = {
              rotateX: isMobile ? 0 : lerp(25, -25, p),
              rotateY: isMobile ? 0 : lerp(-10, 10, p),
              translateZ: isMobile ? 0 : lerp(0, 100, p),
              y: isMobile ? 0 : lerp(30, -30, p),
            };
          }

          if (word2Ref.current) {
            word2BaseValues.current = {
              rotateX: isMobile ? 0 : lerp(-15, 15, p),
              rotateY: isMobile ? 0 : lerp(-20, 20, p),
              translateZ: isMobile ? 0 : lerp(100, -100, p),
              y: isMobile ? 0 : lerp(-20, 20, p),
            };
          }

          if (word3Ref.current) {
            word3BaseValues.current = {
              rotateX: isMobile ? 0 : lerp(-25, 25, p),
              rotateY: isMobile ? 0 : lerp(10, -10, p),
              translateZ: isMobile ? 0 : lerp(-100, 100, p),
              y: isMobile ? 0 : lerp(20, -20, p),
            };
          }

          if (updateCombinedRef.current) {
            updateCombinedRef.current();
          }

          if (subtitleRef.current) {
            const rotateX = isMobile ? 0 : lerp(8, -8, p);
            const translateZ = isMobile ? 0 : lerp(-30, 30, p);
            const y = isMobile ? 0 : lerp(15, -15, p);

            gsap.set(subtitleRef.current, {
              rotateX,
              translateZ,
              y,
            });
          }
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [isMobile]);

  useEffect(() => {
    if (!orb1Ref.current || !orb2Ref.current) return;

    const ctx = gsap.context(
      () => {
        gsap.to(orb1Ref.current, {
          keyframes: [
            { x: 0, y: 0, scale: 1, opacity: 0.2 },
            { x: 100, y: -40, scale: 1.2, opacity: 0.4 },
            { x: 0, y: 0, scale: 1, opacity: 0.2 },
          ],
          duration: 12,
          repeat: -1,
          ease: "sine.inOut",
        });

        gsap.to(orb2Ref.current, {
          keyframes: [
            { x: 0, y: 0, scale: 1, opacity: 0.2 },
            { x: -80, y: 50, scale: 1.25, opacity: 0.4 },
            { x: 0, y: 0, scale: 1, opacity: 0.2 },
          ],
          duration: 15,
          repeat: -1,
          ease: "sine.inOut",
          delay: 1,
        });
      },
      { current: orb1Ref.current }
    );

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (particles.length === 0) return;

    const ctx = gsap.context(
      () => {
        particles.forEach((p, i) => {
          const particle = particleRefs.current[i];
          if (!particle) return;

          gsap.to(particle, {
            keyframes: p.pathX.map((x) => ({ x })),
            duration: p.duration,
            repeat: -1,
            ease: "power1.inOut",
            delay: p.id * 0.2,
          });

          gsap.to(particle, {
            keyframes: p.pathY.map((y) => ({ y })),
            duration: p.duration * 0.95,
            repeat: -1,
            ease: "power1.inOut",
            delay: p.id * 0.2,
          });

          gsap.to(particle, {
            keyframes: p.scaleVariations.map((scale) => ({ scale })),
            duration: p.duration * 0.8,
            repeat: -1,
            ease: "sine.inOut",
            delay: p.id * 0.2,
          });

          gsap.to(particle, {
            keyframes: [
              { opacity: 0.2 },
              { opacity: 0.8 },
              { opacity: 0.6 },
              { opacity: 0.9 },
              { opacity: 0.4 },
              { opacity: 0.8 },
              { opacity: 0.2 },
            ],
            duration: p.duration * 1.2,
            repeat: -1,
            ease: "sine.inOut",
            delay: p.id * 0.2,
          });
        });
      },
      { current: particleRefs.current[0] }
    );

    return () => ctx.revert();
  }, [particles]);

  useEffect(() => {
    if (smallParticles.length === 0) return;

    const ctx = gsap.context(
      () => {
        smallParticles.forEach((p, i) => {
          const particle = smallParticleRefs.current[i];
          if (!particle) return;

          gsap.fromTo(
            particle,
            {
              x: p.initialX,
              y: p.initialY,
              opacity: 0,
              scale: 0.5,
            },
            {
              keyframes: [
                { y: p.animateY[0], x: p.animateX[0], opacity: 0, scale: 0.5 },
                {
                  y: p.animateY[1],
                  x: p.animateX[1],
                  opacity: 0.6,
                  scale: 1.2,
                },
                {
                  y: p.animateY[2],
                  x: p.animateX[2],
                  opacity: 0.3,
                  scale: 0.8,
                },
                { opacity: 0.7, scale: 1 },
                { opacity: 0, scale: 0.5 },
              ],
              duration: p.duration,
              repeat: -1,
              ease: "sine.inOut",
              delay: p.delay,
            }
          );
        });
      },
      { current: smallParticleRefs.current[0] }
    );

    return () => ctx.revert();
  }, [smallParticles]);

  useEffect(() => {
    if (!word1Ref.current || !word2Ref.current || !word3Ref.current || isMobile)
      return;

    const ctx = gsap.context(() => {
      const updateCombined = () => {
        if (word1Ref.current) {
          gsap.set(word1Ref.current, {
            rotateX:
              word1BaseValues.current.rotateX + word1AnimValues.current.rotateX,
            rotateY:
              word1BaseValues.current.rotateY + word1AnimValues.current.rotateY,
            translateZ:
              word1BaseValues.current.translateZ +
              word1AnimValues.current.translateZ,
            y: word1BaseValues.current.y,
          });
        }

        if (word2Ref.current) {
          gsap.set(word2Ref.current, {
            rotateX:
              word2BaseValues.current.rotateX + word2AnimValues.current.rotateX,
            rotateY:
              word2BaseValues.current.rotateY + word2AnimValues.current.rotateY,
            translateZ:
              word2BaseValues.current.translateZ +
              word2AnimValues.current.translateZ,
            y: word2BaseValues.current.y,
          });
        }

        if (word3Ref.current) {
          gsap.set(word3Ref.current, {
            rotateX:
              word3BaseValues.current.rotateX + word3AnimValues.current.rotateX,
            rotateY:
              word3BaseValues.current.rotateY + word3AnimValues.current.rotateY,
            translateZ:
              word3BaseValues.current.translateZ +
              word3AnimValues.current.translateZ,
            y: word3BaseValues.current.y,
          });
        }
      };

      updateCombinedRef.current = updateCombined;
      updateCombined();

      const word1AnimObj = { rotateX: 0, rotateY: 0, translateZ: 0 };
      const word2AnimObj = { rotateX: 0, rotateY: 0, translateZ: 0 };
      const word3AnimObj = { rotateX: 0, rotateY: 0, translateZ: 0 };

      gsap.to(word1AnimObj, {
        keyframes: [
          { rotateX: 0, rotateY: 0, translateZ: 0 },
          { rotateX: 5, rotateY: -4, translateZ: 25 },
          { rotateX: -5, rotateY: 4, translateZ: -25 },
          { rotateX: 0, rotateY: 0, translateZ: 0 },
        ],
        duration: 8,
        repeat: -1,
        ease: "sine.inOut",
        onUpdate: () => {
          word1AnimValues.current = { ...word1AnimObj };
          updateCombined();
        },
      });

      gsap.to(word2AnimObj, {
        keyframes: [
          { rotateX: 0, rotateY: 0, translateZ: 0 },
          { rotateX: -5, rotateY: 4, translateZ: -25 },
          { rotateX: 5, rotateY: -4, translateZ: 25 },
          { rotateX: 0, rotateY: 0, translateZ: 0 },
        ],
        duration: 10,
        repeat: -1,
        ease: "power2.inOut",
        delay: 1.2,
        onUpdate: () => {
          word2AnimValues.current = { ...word2AnimObj };
          updateCombined();
        },
      });

      gsap.to(word3AnimObj, {
        keyframes: [
          { rotateX: 0, rotateY: 0, translateZ: 0 },
          { rotateX: 4, rotateY: -5, translateZ: 20 },
          { rotateX: -4, rotateY: 5, translateZ: -20 },
          { rotateX: 0, rotateY: 0, translateZ: 0 },
        ],
        duration: 12,
        repeat: -1,
        ease: "sine.inOut",
        delay: 2,
        onUpdate: () => {
          word3AnimValues.current = { ...word3AnimObj };
          updateCombined();
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [isMobile]);

  return (
    <FullScreenSection
      ignoreOpacity={true}
      ref={sectionRef}
      id="ready"
      className="py-12 sm:py-32 md:py-40 overflow-hidden relative z-20 sm:pb-0"
    >
      <div
        ref={orb1Ref}
        className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[150px]"
      />
      <div
        ref={orb2Ref}
        className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-secondary/20 rounded-full blur-[120px]"
      />

      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {particles.map((p, i) => (
          <div
            key={p.id}
            className="absolute top-1/2 left-1/2"
            style={{
              transform: `translate(${p.initialX - window.innerWidth / 2}px, ${
                p.initialY - window.innerHeight / 2
              }px)`,
            }}
          >
            <div
              ref={(el) => {
                particleRefs.current[i] = el;
              }}
              className="w-3 h-3 bg-primary/40 rounded-full mix-blend-screen blur-[1px]"
            />
          </div>
        ))}

        {smallParticles.map((p, i) => (
          <div
            key={`small-${p.id}`}
            ref={(el) => {
              smallParticleRefs.current[i] = el;
            }}
            className="absolute w-1 h-1 bg-primary/30 rounded-full"
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col items-center justify-center min-h-[50vh] sm:min-h-[80vh]">
          <div
            ref={containerRef}
            className="text-center transform-none md:transform"
            style={{
              transformStyle: "preserve-3d",
            }}
          >
            <div className="mb-8 md:mb-12">
              <h2
                ref={word1Ref}
                className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl xl:text-[14rem] 2xl:text-[18rem] font-black leading-none mb-4 md:mb-6 transform-none md:transform relative"
                style={{
                  transformStyle: "preserve-3d",
                }}
              >
                <span className="relative z-10 gradient-animated-text">
                  CODE.
                </span>
              </h2>

              <h2
                ref={word2Ref}
                className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl xl:text-[14rem] 2xl:text-[18rem] font-black leading-none mb-4 md:mb-6 transform-none md:transform relative"
                style={{
                  transformStyle: "preserve-3d",
                }}
              >
                <span className="relative z-10 text-white">CREATE.</span>
              </h2>

              <h2
                ref={word3Ref}
                className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl xl:text-[14rem] 2xl:text-[18rem] font-black leading-none transform-none md:transform relative"
                style={{
                  transformStyle: "preserve-3d",
                }}
              >
                <span className="relative z-10 gradient-animated-text">
                  CONQUER.
                </span>
              </h2>
            </div>

            <p
              ref={subtitleRef}
              className="text-lg sm:text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto transform-none md:transform"
              style={{
                transformStyle: "preserve-3d",
              }}
            >
              Three words. Infinite possibilities. Every line of code is a step
              toward something extraordinary.
            </p>
          </div>
        </div>
      </div>
    </FullScreenSection>
  );
}
