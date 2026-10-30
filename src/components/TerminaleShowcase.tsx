"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, Github } from "lucide-react";
import { useEffect, useRef } from "react";
import Button from "@/components/Button";
import TerminalChrome from "@/components/terminale/TerminalChrome";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

const chips = [
  "Rust + wgpu",
  "Windows · macOS · Linux",
  "100% prompt-engineered",
  "MIT / Apache-2.0",
];

export default function TerminaleShowcase() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!rootRef.current) return;

    const isMobile = window.innerWidth < 768;

    const ctx = gsap.context(() => {
      gsap.from(".t-animate", {
        opacity: 0,
        y: isMobile ? 24 : 40,
        duration: 0.6,
        ease: "back.out(1.7)",
        stagger: 0.1,
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top bottom-=80px",
          toggleActions: "play none none none",
        },
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      id="terminale"
      className="py-24 sm:py-32 relative overflow-hidden"
    >
      {/* Orb decorations */}
      <div className="pointer-events-none absolute -top-40 -left-40 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[140px]" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 w-[420px] h-[420px] bg-secondary/10 rounded-full blur-[120px]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left: copy */}
          <div>
            {/* Eyebrow */}
            <p className="t-animate text-xs uppercase tracking-wider font-semibold text-gray-400 mb-4">
              Open Source Project
            </p>

            {/* Heading */}
            <h2 className="t-animate text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-[1.05] tracking-tight mb-6">
              <span className="text-white">terminale</span>
              <br />
              <span className="relative inline-block">
                <span className="gradient-animated-text">
                  the terminal that doesn&apos;t suck.
                </span>
                <span
                  className="pointer-events-none absolute inset-0 gradient-animated-text blur-[18px] opacity-50"
                  aria-hidden="true"
                >
                  the terminal that doesn&apos;t suck.
                </span>
              </span>
            </h2>

            {/* Lead */}
            <p className="t-animate text-base sm:text-lg md:text-xl text-gray-400 max-w-2xl leading-relaxed mb-8">
              A native, GPU-accelerated, cross-platform terminal written in Rust.
              Multi-tab, split panes, inline AI, Quake mode. No Electron. No
              telemetry.
            </p>

            {/* Chips */}
            <div className="t-animate flex flex-wrap gap-2 mb-10">
              {chips.map((chip) => (
                <span
                  key={chip}
                  className={cn(
                    "font-mono text-xs px-3 py-1 rounded-full",
                    "border border-white/10 bg-white/5 text-gray-300"
                  )}
                >
                  {chip}
                </span>
              ))}
            </div>

            {/* CTAs */}
            <div className="t-animate flex flex-wrap gap-4">
              <Button
                href="/terminale"
                variant="gradient"
                size="lg"
                rightIcon={<ArrowRight className="w-5 h-5" />}
              >
                Explore terminale
              </Button>
              <Button
                href="https://github.com/fbrzlarosa/terminale"
                target="_blank"
                variant="outline"
                size="lg"
                rightIcon={<Github className="w-5 h-5" />}
              >
                GitHub
              </Button>
            </div>
          </div>

          {/* Right: fake terminal window */}
          <div className="t-animate">
            <div
              className={cn(
                "rounded-xl border border-white/10 bg-background/80 backdrop-blur-xl overflow-hidden",
                "shadow-[0_0_60px_-20px_rgba(6,182,212,0.15)]"
              )}
            >
              {/* Title bar */}
              <TerminalChrome path="~" />

              {/* Terminal body */}
              <div className="px-5 py-5 font-mono text-sm leading-relaxed space-y-2">
                <div className="flex items-center gap-2 text-gray-500">
                  <span className="text-primary font-bold">terminale</span>
                  <span>—</span>
                  <span>GPU-accelerated · Rust · wgpu</span>
                </div>

                <div className="pt-2 flex items-start gap-2">
                  <span className="text-secondary shrink-0">❯</span>
                  <span className="text-gray-300">cargo build --release</span>
                </div>

                <div className="text-gray-500 pl-4 space-y-1">
                  <div>
                    <span className="text-green-400">Compiling</span>
                    {" terminale"}
                  </div>
                  <div>
                    <span className="text-green-400">Finished</span>
                    {" release [optimized] target"}
                  </div>
                </div>

                <div className="flex items-start gap-2 pt-1">
                  <span className="text-secondary shrink-0">❯</span>
                  <span className="text-gray-300">./terminale --quake-mode</span>
                </div>

                <div className="text-gray-500 pl-4">
                  <span className="text-primary">Quake mode active</span>
                  {" — press ` to toggle"}
                </div>

                {/* Blinking cursor line */}
                <div className="flex items-center gap-2 pt-1">
                  <span className="text-secondary shrink-0">❯</span>
                  <span
                    className="inline-block w-2 h-4 bg-primary align-middle"
                    style={{ animation: "blink 1.1s step-end infinite" }}
                  />
                </div>
              </div>
            </div>

            {/* Inline keyframe for cursor blink — scoped via style tag */}
            <style>{`@keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }`}</style>
          </div>
        </div>
      </div>
    </section>
  );
}
