"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight } from "lucide-react";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import Button from "./Button";

const AnimatedOrb = dynamic(() => import("./AnimatedOrb"), {
  loading: () => null,
  ssr: false,
});

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const h1Ref = useRef<HTMLHeadingElement>(null);
  const paraRef = useRef<HTMLParagraphElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const orbRef = useRef<HTMLDivElement>(null);
  const span1Ref = useRef<HTMLSpanElement>(null);
  const span2Ref = useRef<HTMLSpanElement>(null);
  const span3Ref = useRef<HTMLSpanElement>(null);
  const span4Ref = useRef<HTMLSpanElement>(null);

  const [isMobile, setIsMobile] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile, { passive: true });
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (!sectionRef.current || isMobile || prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.set(h1Ref.current, {
        opacity: 0,
        rotateX: 20,
        z: -200,
        x: -100,
        scale: 0.8,
        transformPerspective: 1500,
      });

      gsap.set(paraRef.current, {
        opacity: 0,
        y: 20,
        z: -100,
        rotateX: 10,
        transformPerspective: 1000,
      });

      gsap.set(buttonsRef.current, {
        opacity: 0,
        y: 20,
        z: -50,
      });

      gsap.set(statsRef.current, {
        opacity: 0,
        y: 20,
        rotateX: 20,
      });

      gsap.set(
        [
          span1Ref.current,
          span2Ref.current,
          span3Ref.current,
          span4Ref.current,
        ],
        {
          opacity: 0,
          y: 30,
          rotateX: 15,
          scale: 0.9,
        }
      );

      const tl = gsap.timeline({
        defaults: { ease: "power2.out" },
        delay: 0.5,
      });

      tl.to(sectionRef.current, {
        opacity: 1,
        duration: 0.5,
      })
        .to(
          h1Ref.current,
          {
            opacity: 1,
            rotateX: 0,
            z: 0,
            x: 0,
            scale: 1,
            duration: 0.8,
            ease: "back.out(1.2)",
          },
          "-=0.3"
        )
        .to(
          [
            span1Ref.current,
            span2Ref.current,
            span3Ref.current,
            span4Ref.current,
          ],
          {
            opacity: 1,
            y: 0,
            rotateX: 0,
            scale: 1,
            duration: 0.7,
            stagger: 0.1,
            ease: "back.out(1.5)",
          },
          "-=0.5"
        )
        .to(
          paraRef.current,
          {
            opacity: 1,
            y: 0,
            z: 0,
            rotateX: 0,
            duration: 0.8,
            ease: "back.out(1.2)",
          },
          "-=0.6"
        )
        .to(
          buttonsRef.current,
          {
            opacity: 1,
            y: 0,
            z: 0,
            duration: 0.8,
            ease: "back.out(1.2)",
          },
          "-=0.6"
        )
        .to(
          statsRef.current,
          {
            opacity: 1,
            y: 0,
            rotateX: 0,
            duration: 0.8,
            ease: "back.out(1.2)",
          },
          "-=0.6"
        );

      if (orbRef.current) {
        gsap.fromTo(
          orbRef.current,
          { opacity: 0, scale: 0.8 },
          {
            opacity: 1,
            scale: 1,
            duration: 1,
            delay: 0.5,
            ease: "back.out(1.2)",
          }
        );
      }

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: "bottom top",
        scrub: 1,
        onUpdate: (self) => {
          const progress = self.progress;

          if (containerRef.current) {
            gsap.set(containerRef.current, {
              y: -progress * 200,
            });
          }

          if (h1Ref.current) {
            gsap.set(h1Ref.current, {
              rotateX: progress * 20,
              x: -progress * 100,
              z: -progress * 200,
              scale: 1 - progress * 0.2,
              opacity: 1 - progress * 0.3,
              transformPerspective: 1500,
            });
          }

          if (paraRef.current) {
            gsap.set(paraRef.current, {
              rotateX: progress * 10,
              y: progress * 20,
              z: -progress * 100,
              opacity: 1 - progress * 0.4,
            });
          }

          if (span1Ref.current) {
            gsap.set(span1Ref.current, {
              rotateX: progress * 15,
              y: progress * 30,
              scale: 1 - progress * 0.1,
              opacity: 1 - progress * 0.3,
            });
          }
          if (span2Ref.current) {
            gsap.set(span2Ref.current, {
              rotateX: progress * 15,
              y: progress * 30,
              scale: 1 - progress * 0.1,
              opacity: 1 - progress * 0.3,
            });
          }
          if (span3Ref.current) {
            gsap.set(span3Ref.current, {
              rotateX: progress * 15,
              y: progress * 30,
              scale: 1 - progress * 0.1,
              opacity: 1 - progress * 0.3,
            });
          }
          if (span4Ref.current) {
            gsap.set(span4Ref.current, {
              rotateX: progress * 15,
              y: progress * 30,
              scale: 1 - progress * 0.1,
              opacity: 1 - progress * 0.3,
            });
          }

          if (buttonsRef.current) {
            gsap.set(buttonsRef.current, {
              y: progress * 20,
              z: -progress * 50,
              opacity: 1 - progress * 0.5,
            });
          }

          if (statsRef.current) {
            gsap.set(statsRef.current, {
              rotateX: progress * 20,
              y: progress * 20,
              opacity: 1 - progress * 0.5,
            });
          }
        },
      });

      const statElements = statsRef.current?.querySelectorAll("[data-stat]");
      statElements?.forEach((el) => {
        gsap.to(el, {
          y: -5,
          scale: 1.05,
          duration: 0.3,
          ease: "power2.out",
          paused: true,
          onComplete: function () {
            gsap.to(el, { y: 0, scale: 1, duration: 0.3, ease: "power2.out" });
          },
        });

        el.addEventListener("mouseenter", () => {
          gsap.to(el, {
            y: -5,
            scale: 1.05,
            duration: 0.3,
            ease: "power2.out",
          });
        });

        el.addEventListener("mouseleave", () => {
          gsap.to(el, { y: 0, scale: 1, duration: 0.3, ease: "power2.out" });
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [isMobile, prefersReducedMotion]);

  useEffect(() => {
    if (isMobile || prefersReducedMotion) {
      gsap.set(
        [
          sectionRef.current,
          h1Ref.current,
          paraRef.current,
          buttonsRef.current,
          statsRef.current,
        ],
        {
          clearProps: "all",
        }
      );

      const tl = gsap.timeline({ delay: 0.5 });
      tl.fromTo(
        sectionRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.5 }
      ).fromTo(
        [h1Ref.current, paraRef.current, buttonsRef.current, statsRef.current],
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: "power2.out" },
        "-=0.3"
      );

      if (orbRef.current) {
        gsap.fromTo(
          orbRef.current,
          { opacity: 0, scale: 0.8 },
          { opacity: 1, scale: 1, duration: 1, delay: 0.5 }
        );
      }

      return () => {
        tl.kill();
      };
    }
  }, [isMobile, prefersReducedMotion]);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center pt-24 sm:pt-28 md:pt-32 pb-16 sm:pb-20 md:pb-6 perspective-1000"
      style={{ opacity: 0 }}
    >
      <div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full grid lg:grid-cols-[80%_20%] gap-8 items-center"
        style={{ perspective: "1200px" }}
      >
        <div
          ref={containerRef}
          className="max-w-4xl relative z-10 max-md:opacity-100! max-md:translate-y-0! max-md:transform-none!"
        >
          <h1
            ref={h1Ref}
            style={{
              transformStyle: isMobile ? "flat" : "preserve-3d",
              perspective: isMobile ? "none" : "1500px",
            }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-6xl 2xl:text-8xl font-black tracking-tight leading-[1.1] mb-6 md:mb-8 max-md:opacity-100! max-md:translate-y-0! max-md:transform-none!"
          >
            <span
              ref={span1Ref}
              style={{
                display: "inline-block",
                transformStyle: isMobile ? "flat" : "preserve-3d",
              }}
            >
              Crafting efficient,
            </span>
            <br />
            <span
              ref={span2Ref}
              style={{
                display: "inline-block",
                transformStyle: isMobile ? "flat" : "preserve-3d",
              }}
            >
              scalable solutions
            </span>{" "}
            <br />
            <span
              ref={span3Ref}
              style={{
                display: "inline-block",
                transformStyle: isMobile ? "flat" : "preserve-3d",
              }}
            >
              in
            </span>{" "}
            <span className="relative inline-block">
              <span
                ref={span4Ref}
                style={{
                  display: "inline-block",
                  transformStyle: isMobile ? "flat" : "preserve-3d",
                }}
                className="gradient-animated-text"
              >
                software & web.
              </span>
            </span>
          </h1>

          <p
            ref={paraRef}
            style={{
              transformStyle: isMobile ? "flat" : "preserve-3d",
            }}
            className="text-base sm:text-lg md:text-xl text-gray-400 max-w-2xl mb-8 md:mb-10 leading-relaxed max-md:opacity-100! max-md:translate-y-0! max-md:transform-none!"
          >
            I&apos;m Fabrizio La Rosa — full-stack engineer, code artisan,
            digital problem solver. Turning complex problems into elegant,
            user-centric digital experiences.
          </p>

          <div
            ref={buttonsRef}
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-12 max-md:opacity-100! max-md:translate-y-0!"
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
          </div>

          <div
            ref={statsRef}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 border-t border-white/10 pt-6 md:pt-8"
          >
            {[
              { value: "15+", label: "Years Experience" },
              { value: "63+", label: "Projects Completed" },
              { value: "100%", label: "Client Satisfaction" },
            ].map((stat, i) => (
              <div key={i} data-stat>
                <div className="text-3xl sm:text-4xl md:text-5xl font-black mb-1 bg-linear-to-r from-white to-gray-400 bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="hidden lg:flex items-center justify-end relative z-0">
          <div
            ref={orbRef}
            className="w-full h-full flex items-center justify-end"
          >
            <AnimatedOrb />
          </div>
        </div>
      </div>
    </section>
  );
}
