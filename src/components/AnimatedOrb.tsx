"use client";

import { useBackground } from "@/context/BackgroundContext";
import { gsap } from "gsap";
import { useEffect, useRef, useState } from "react";

interface Particle {
  id: number;
  initialZ: number;
  initialY: number;
  initialX: number;
  pathX: number[];
  pathY: number[];
  duration: number;
  scaleVariations: number[];
}

export default function AnimatedOrb() {
  const containerRef = useRef<HTMLDivElement>(null);
  const orbRef = useRef<HTMLDivElement>(null);
  const coreGlowRef = useRef<HTMLDivElement>(null);
  const ring1Ref = useRef<HTMLDivElement>(null);
  const ring2Ref = useRef<HTMLDivElement>(null);
  const logoContainerRef = useRef<HTMLDivElement>(null);
  const logoTopGroupRef = useRef<SVGGElement>(null);
  const orbitingDotRef = useRef<HTMLDivElement>(null);
  const orbitingContainerRef = useRef<HTMLDivElement>(null);
  const particlesContainerRef = useRef<HTMLDivElement>(null);

  const [isHovered, setIsHovered] = useState(false);
  const { cycleTheme, currentTheme } = useBackground();
  const [isPressed, setIsPressed] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);

  const mousePos = useRef({ x: 0, y: 0 });
  const particleRefs = useRef<(HTMLDivElement | null)[]>([]);
  const particleAnimationsRef = useRef<gsap.core.Tween[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    
    const timer = setTimeout(() => {
      const newParticles = Array.from({ length: 5 }).map((_, i) => {
        const waypoints = 4;
        const pathX: number[] = [];
        const pathY: number[] = [];

        for (let j = 0; j < waypoints; j++) {
          pathX.push(Math.random() * 300 - 150);
          pathY.push(Math.random() * 300 - 150);
        }
        pathX.push(pathX[0]);
        pathY.push(pathY[0]);

        return {
          id: i,
          initialZ: Math.random() * 200,
          initialY: 0,
          initialX: 0,
          pathX,
          pathY,
          duration: Math.random() * 3 + 4,
          scaleVariations: Array.from(
            { length: waypoints + 1 },
            () => Math.random() * 0.5 + 0.5
          ),
        };
      });
      setParticles(newParticles);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!orbRef.current) return;

    const ctx = gsap.context(() => {
      let rafId: number;
      let lastUpdate = 0;
      const throttleMs = 16;

      const handleMouseMove = (e: MouseEvent) => {
        const now = performance.now();
        if (now - lastUpdate < throttleMs) return;
        lastUpdate = now;

        if (rafId) cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(() => {
          if (!containerRef.current) return;

          const rect = containerRef.current.getBoundingClientRect();
          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;
          mousePos.current = {
            x: e.clientX - centerX,
            y: e.clientY - centerY,
          };

          const distance = Math.sqrt(
            mousePos.current.x * mousePos.current.x +
              mousePos.current.y * mousePos.current.y
          );
          const maxDistance = 500;
          const intensity = maxDistance / (maxDistance + distance);

          if (orbRef.current) {
            gsap.to(orbRef.current, {
              rotateX: (mousePos.current.y / 1000) * -50 * intensity,
              rotateY: (mousePos.current.x / 1000) * 50 * intensity,
              duration: 0.5,
              ease: "power2.out",
            });
          }

          if (logoContainerRef.current) {
            gsap.to(logoContainerRef.current, {
              x: (mousePos.current.x / 1000) * -200 * intensity,
              y: (mousePos.current.y / 1000) * -200 * intensity,
              duration: 0.5,
              ease: "power2.out",
            });
          }

          if (coreGlowRef.current) {
            gsap.to(coreGlowRef.current, {
              x: (mousePos.current.x / 1000) * -25 * intensity,
              y: (mousePos.current.y / 1000) * -25 * intensity,
              duration: 0.5,
              ease: "power2.out",
            });
          }

          if (ring1Ref.current) {
            gsap.to(ring1Ref.current, {
              x: (mousePos.current.x / 1000) * -80 * intensity,
              y: (mousePos.current.y / 1000) * -80 * intensity,
              duration: 0.5,
              ease: "power2.out",
            });
          }

          if (ring2Ref.current) {
            gsap.to(ring2Ref.current, {
              x: (mousePos.current.x / 1000) * -60 * intensity,
              y: (mousePos.current.y / 1000) * -60 * intensity,
              duration: 0.5,
              ease: "power2.out",
            });
          }

          if (orbitingContainerRef.current) {
            gsap.to(orbitingContainerRef.current, {
              x: (mousePos.current.x / 1000) * -40 * intensity,
              y: (mousePos.current.y / 1000) * -40 * intensity,
              duration: 0.5,
              ease: "power2.out",
            });
          }

          if (particlesContainerRef.current) {
            gsap.to(particlesContainerRef.current, {
              x: (mousePos.current.x / 1000) * -90 * intensity,
              y: (mousePos.current.y / 1000) * -90 * intensity,
              duration: 0.5,
              ease: "power2.out",
            });
          }
        });
      };

      window.addEventListener("mousemove", handleMouseMove, { passive: true });

      if (coreGlowRef.current) {
        gsap.to(coreGlowRef.current, {
          scale: 0.8,
          opacity: 0.2,
          yoyo: true,
          repeat: -1,
          duration: 2,
          ease: "sine.inOut",
        });
        gsap.to(coreGlowRef.current, {
          scale: 1.2,
          opacity: 0.5,
          yoyo: true,
          repeat: -1,
          duration: 2,
          ease: "sine.inOut",
        });
      }

      if (ring1Ref.current) {
        gsap.to(ring1Ref.current, {
          rotateZ: -360,
          duration: 30,
          repeat: -1,
          ease: "none",
        });
      }

      if (ring2Ref.current) {
        gsap.to(ring2Ref.current, {
          rotateZ: 360,
          duration: 15,
          repeat: -1,
          ease: "none",
        });
      }

      if (orbitingContainerRef.current) {
        gsap.to(orbitingContainerRef.current, {
          rotate: 360,
          duration: 20,
          repeat: -1,
          ease: "none",
        });
      }

      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        if (rafId) cancelAnimationFrame(rafId);
      };
    }, containerRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (particles.length === 0) return;

    const ctx = gsap.context(() => {
      particleAnimationsRef.current = [];

      particles.forEach((p, i) => {
        const particle = particleRefs.current[i];
        if (!particle) return;

        const customEase = "power1.inOut";

        const animX = gsap.to(particle, {
          keyframes: p.pathX.map((x) => ({ x })),
          duration: p.duration,
          repeat: -1,
          ease: customEase,
          delay: i * 0.3,
        });

        const animY = gsap.to(particle, {
          keyframes: p.pathY.map((y) => ({ y })),
          duration: p.duration * 0.95,
          repeat: -1,
          ease: customEase,
          delay: i * 0.3,
        });

        const animScale = gsap.to(particle, {
          keyframes: p.scaleVariations.map((scale) => ({ scale })),
          duration: p.duration * 0.8,
          repeat: -1,
          ease: "sine.inOut",
          delay: i * 0.3,
        });

        const animOpacity = gsap.to(particle, {
          keyframes: [
            { opacity: 0.3 },
            { opacity: 1 },
            { opacity: 0.8 },
            { opacity: 1 },
            { opacity: 0.5 },
            { opacity: 1 },
            { opacity: 0.3 },
          ],
          duration: p.duration * 1.2,
          repeat: -1,
          ease: "sine.inOut",
          delay: i * 0.3,
        });

        particleAnimationsRef.current.push(
          animX,
          animY,
          animScale,
          animOpacity
        );
      });
    }, containerRef);

    return () => ctx.revert();
  }, [particles]);

  useEffect(() => {
    const timeScale = isHovered ? 3 : 1;
    particleAnimationsRef.current.forEach((anim) => {
      if (anim) {
        anim.timeScale(timeScale);
      }
    });
  }, [isHovered]);

  useEffect(() => {
    if (isHovered && ring1Ref.current && ring2Ref.current) {
      gsap.to(ring1Ref.current, { scale: 1.1, duration: 0.3 });
      gsap.to(ring1Ref.current, {
        rotateZ: -360,
        duration: 10,
        repeat: -1,
        ease: "none",
      });
      gsap.to(ring2Ref.current, { scale: 0.9, duration: 0.3 });
    } else if (ring1Ref.current && ring2Ref.current) {
      gsap.to(ring1Ref.current, { scale: 1, duration: 0.3 });
      gsap.to(ring1Ref.current, {
        rotateZ: -360,
        duration: 30,
        repeat: -1,
        ease: "none",
      });
      gsap.to(ring2Ref.current, { scale: 1, duration: 0.3 });
    }
  }, [isHovered]);

  useEffect(() => {
    if (logoTopGroupRef.current) {
      if (isPressed) {
        gsap.to(logoTopGroupRef.current, {
          y: 30,
          duration: 0.2,
          ease: "power2.out",
        });
      } else {
        gsap.to(logoTopGroupRef.current, {
          y: 0,
          duration: 0.2,
          ease: "power2.out",
        });
      }
    }
  }, [isPressed]);

  const handlePressStart = () => {
    setIsPressed(true);
  };

  const handlePressEnd = () => {
    setTimeout(() => {
      setIsPressed(false);
    }, 150);
  };

  return (
    <div ref={containerRef} className="pointer-events-auto">
      <div
        ref={orbRef}
        className="relative w-[400px] h-[400px]"
        style={{
          transformStyle: "preserve-3d",
        }}
      >
        <div
          ref={coreGlowRef}
          className="absolute inset-0 rounded-full blur-[80px]"
          style={{
            backgroundColor: currentTheme.primary + "10",
            transform: "translateZ(-100px)",
            transformStyle: "preserve-3d",
          }}
        />

        <div
          ref={ring1Ref}
          className="absolute inset-10 border-2 border-dashed rounded-full opacity-50"
          style={{
            borderColor: currentTheme.primary + "33",
            transform: "translateZ(80px)",
            transformStyle: "preserve-3d",
          }}
        />

        <div
          ref={ring2Ref}
          className="absolute inset-20 border border-dotted rounded-full"
          style={{
            borderColor: currentTheme.secondary + "4D",
            transform: "translateZ(100px)",
            transformStyle: "preserve-3d",
          }}
        />

        <div
          ref={particlesContainerRef}
          className="absolute inset-0"
          style={{
            transformStyle: "preserve-3d",
          }}
        >
          {particles.map((p, i) => (
            <div
              key={`p-${p.id}`}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
              style={{
                transform: `translateZ(${p.initialZ - 200}px) translate(${
                  p.initialX
                }px, ${p.initialY}px)`,
                transformStyle: "preserve-3d",
              }}
            >
              <div
                ref={(el) => {
                  particleRefs.current[i] = el;
                }}
                className="w-2 h-2 bg-white rounded-full mix-blend-overlay"
              />
            </div>
          ))}
        </div>

        <div
          ref={logoContainerRef}
          className="absolute inset-0 flex items-center justify-center"
          style={{
            transform: "translateZ(150px)",
            transformStyle: "preserve-3d",
          }}
        >
          <div
            className="relative w-48 h-48 flex items-center justify-center overflow-hidden group"
            style={{
              transform: "translateZ(0)",
              backfaceVisibility: "hidden",
              WebkitFontSmoothing: "antialiased",
            }}
          >
            <svg
              viewBox="-4 0 400 300"
              className="w-40 h-40 cursor-pointer pointer-events-auto"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => {
                setIsHovered(false);
                setIsPressed(false);
              }}
              onMouseDown={handlePressStart}
              onMouseUp={handlePressEnd}
              onClick={cycleTheme}
              style={{
                shapeRendering: "geometricPrecision",
                imageRendering: "auto",
                transform: "translateZ(0)",
                backfaceVisibility: "hidden",
                WebkitFontSmoothing: "antialiased",
                filter: isHovered
                  ? `drop-shadow(0 0 2px ${currentTheme.primary}80) drop-shadow(0 0 5px ${currentTheme.primary}99)`
                  : `drop-shadow(0 0 20px ${currentTheme.primary}33)`,
                transition: "filter 0.3s ease",
              }}
              preserveAspectRatio="xMidYMid meet"
            >
              <path
                d="M374.7,140.2c12.1,6.7,12.1,17.4,0,24.2L214,252.2c-12.1,6.6-32.1,6.6-44.2,0L9.1,164.4c-12.1-6.9-12.1-17.5,0-24.2l30.8-16.8c-3.8,5-2.1,11,5.3,15.1l129.1,70.4c9.7,5.3,25.7,5.3,35.4,0l129.1-70.4c7.4-4.1,9.1-10.1,5.3-15.1L374.7,140.2z"
                fill="none"
                stroke={currentTheme.primary}
                strokeWidth="8"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity={0.2}
                style={{ shapeRendering: "geometricPrecision" }}
              />
              <path
                d="M374.7,140.2c12.1,6.7,12.1,17.4,0,24.2L214,252.2c-12.1,6.6-32.1,6.6-44.2,0L9.1,164.4c-12.1-6.9-12.1-17.5,0-24.2l30.8-16.8c-3.8,5-2.1,11,5.3,15.1l129.1,70.4c9.7,5.3,25.7,5.3,35.4,0l129.1-70.4c7.4-4.1,9.1-10.1,5.3-15.1L374.7,140.2z"
                fill={currentTheme.primary}
                opacity="1"
                style={{ shapeRendering: "geometricPrecision" }}
              />

              <g ref={logoTopGroupRef}>
                <path
                  d="M209.6,3.9l129.1,70.4c9.7,5.4,9.7,14,0,19.4l-129.1,70.5c-9.7,5.3-25.7,5.3-35.4,0L45.2,93.8c-9.7-5.4-9.7-14,0-19.4L174.2,3.9C183.9-1.3,199.9-1.3,209.6,3.9L209.6,3.9z"
                  fill="none"
                  stroke={currentTheme.primary}
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity={0.2}
                  style={{ shapeRendering: "geometricPrecision" }}
                />
                <path
                  d="M209.6,3.9l129.1,70.4c9.7,5.4,9.7,14,0,19.4l-129.1,70.5c-9.7,5.3-25.7,5.3-35.4,0L45.2,93.8c-9.7-5.4-9.7-14,0-19.4L174.2,3.9C183.9-1.3,199.9-1.3,209.6,3.9L209.6,3.9z"
                  fill={currentTheme.primary}
                  opacity="1"
                  style={{ shapeRendering: "geometricPrecision" }}
                />
              </g>
            </svg>
          </div>
        </div>

        <div
          ref={orbitingContainerRef}
          className="absolute inset-0 pointer-events-none"
        >
          <div
            ref={orbitingDotRef}
            className="absolute top-0 left-1/2 w-4 h-4 rounded-full"
            style={{
              backgroundColor: currentTheme.primary,
              boxShadow: `0 0 20px ${currentTheme.primary}`,
              transform: "translateX(-50%) translateY(-50%) translateZ(200px)",
            }}
          />
        </div>
      </div>
    </div>
  );
}
