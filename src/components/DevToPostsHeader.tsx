"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef, useState } from "react";

gsap.registerPlugin(ScrollTrigger);

export default function DevToPostsHeader() {
  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const h2Ref = useRef<HTMLHeadingElement>(null);
  const pRef = useRef<HTMLParagraphElement>(null);
  const glowRef = useRef<HTMLSpanElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      // 3D Scroll Animation
      if (!isMobile && headerRef.current) {
        ScrollTrigger.create({
          trigger: containerRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
          onUpdate: (self) => {
            const progress = self.progress;

            if (headerRef.current) {
              gsap.set(headerRef.current, {
                rotateX: 15 - progress * 40,
                rotateY: -10 + progress * 30,
                scale:
                  0.95 +
                  (progress < 0.5 ? progress * 0.3 : (1 - progress) * 0.3),
                transformPerspective: 1000,
              });
            }
          },
        });
      }

      if (glowRef.current) {
        gsap.fromTo(
          glowRef.current,
          { opacity: 0.4 },
          {
            opacity: 0.7,
            duration: 1.5,
            delay: 0.5,
            yoyo: true,
            repeat: -1,
            ease: "sine.inOut",
          }
        );
      }

    }, containerRef);

    return () => ctx.revert();
  }, [isMobile]);

  return (
    <div ref={containerRef} className="perspective-1000">
      <div
        ref={headerRef}
        className="text-center mb-16 sm:mb-24 transform-none md:transform"
        style={{
          transformStyle: isMobile ? "flat" : "preserve-3d",
        }}
      >
        <h2
          ref={h2Ref}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl leading-relaxed font-black sm:mb-6 gradient-animated-text"
          style={{ transform: "translateZ(20px)" }}
        >
          <span className="relative inline-block">
            <span className="gradient-animated-text">My Posts</span>
            <span
              ref={glowRef}
              className="absolute inset-0 gradient-animated-text blur-xl opacity-60"
            >
              My Posts
            </span>
          </span>
        </h2>
        <p
          ref={pRef}
          className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mt-4"
          style={{ transform: "translateZ(10px)" }}
        >
          Tutorials, tips, and insights on tech and productivity
        </p>
      </div>
    </div>
  );
}
