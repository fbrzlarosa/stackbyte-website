"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, Bot } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef } from "react";
import Button from "@/components/Button";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

type AiLogShowcaseProps = {
  day: number;
  entryCount: number;
  latest: { slug: string; dateLabel: string; title: string }[];
  metrics: { label: string; value: string }[];
};

const pad = (n: number) => String(n).padStart(2, "0");

export default function AiLogShowcase({ day, entryCount, latest, metrics }: AiLogShowcaseProps) {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!rootRef.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const isMobile = window.innerWidth < 768;
    const root = rootRef.current;

    const ctx = gsap.context(() => {
      gsap.from(".ai-animate", {
        opacity: 0,
        y: isMobile ? 24 : 40,
        duration: 0.6,
        ease: "back.out(1.7)",
        stagger: 0.1,
        scrollTrigger: { trigger: root, start: "top bottom-=80px", toggleActions: "play none none none" },
      });

      // Console: commands are typed, their output appears at once, like a real shell. The full
      // text stays in data-text, so StrictMode's double mount and revert never lose it.
      const lines = gsap.utils.toArray<HTMLElement>(".ai-line", root);
      gsap.set(lines, { autoAlpha: 0 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root.querySelector(".ai-console"),
          start: "top bottom-=120px",
          toggleActions: "play none none none",
        },
      });
      lines.forEach((line) => {
        const typed = line.querySelector<HTMLElement>(".ai-type");
        if (!typed) {
          tl.to(line, { autoAlpha: 1, duration: 0.25, ease: "power2.out" }, "+=0.05");
          return;
        }
        const text = typed.dataset.text ?? "";
        const proxy = { n: 0 };
        tl.set(line, { autoAlpha: 1 }, "+=0.35").to(proxy, {
          n: text.length,
          duration: text.length * 0.035,
          ease: "none",
          onStart: () => {
            typed.textContent = "";
          },
          onUpdate: () => {
            typed.textContent = text.slice(0, Math.round(proxy.n));
          },
        });
      });

      // Numbers count up from zero when the stats scroll in.
      gsap.utils.toArray<HTMLElement>(".ai-count", root).forEach((el) => {
        const target = Number((el.dataset.value ?? "").replace(/,/g, ""));
        if (!Number.isFinite(target) || target === 0) return;
        const proxy = { n: 0 };
        gsap.to(proxy, {
          n: target,
          duration: 1.6,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top bottom-=60px", toggleActions: "play none none none" },
          onUpdate: () => {
            el.textContent = Math.round(proxy.n).toLocaleString("en-US");
          },
        });
      });
    }, rootRef);

    return () => {
      ctx.revert();
      root.querySelectorAll<HTMLElement>(".ai-type").forEach((el) => {
        el.textContent = el.dataset.text ?? "";
      });
    };
  }, []);

  return (
    <section ref={rootRef} id="ai-log" className="py-24 sm:py-32 relative overflow-hidden">
      <div className="pointer-events-none absolute top-1/4 -right-40 w-[460px] h-[460px] bg-secondary/10 rounded-full blur-[130px]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Agent console */}
          <div className="ai-animate order-2 lg:order-1 min-w-0">
            <div className="ai-console relative rounded-xl p-px overflow-hidden shadow-[0_0_60px_-20px_rgba(129,140,248,0.35)]">
              {/* Rotating gradient border: one composited transform, no repaint */}
              <div
                aria-hidden="true"
                className="absolute inset-[-60%] bg-[conic-gradient(from_0deg,transparent_0deg,var(--color-primary)_50deg,transparent_110deg,transparent_180deg,var(--color-secondary)_230deg,transparent_290deg)] animate-[spin_7s_linear_infinite] motion-reduce:animate-none"
              />
              <div className="relative rounded-[11px] bg-background/95 overflow-hidden">
                <div className="flex items-center justify-between border-b border-white/10 bg-white/5 px-4 py-2.5">
                  <div className="flex items-center gap-2">
                    <Bot className="w-3.5 h-3.5 text-secondary" aria-hidden="true" />
                    <span className="text-xs font-mono font-semibold text-gray-200">growth-agent</span>
                  </div>
                  <span className="flex items-center gap-2 text-xs font-mono text-gray-400">
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full rounded-full bg-primary opacity-60 animate-ping motion-reduce:animate-none" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
                    </span>
                    autonomous
                  </span>
                </div>

                <div className="px-5 py-5 font-mono text-sm leading-relaxed space-y-2 min-h-[300px]">
                  <div className="ai-line flex gap-2">
                    <span className="text-secondary shrink-0">❯</span>
                    <span className="ai-type text-gray-200" data-text="agent status">
                      {"agent status"}
                    </span>
                  </div>
                  <div className="ai-line pl-4 text-gray-500">
                    <span className="text-primary">day {day}</span> · {entryCount} log entries · works
                    every day, unattended
                  </div>

                  <div className="ai-line flex gap-2 pt-2">
                    <span className="text-secondary shrink-0">❯</span>
                    <span className="ai-type text-gray-200" data-text="agent log --latest">
                      {"agent log --latest"}
                    </span>
                  </div>
                  {latest.map((entry) => (
                    <div key={entry.slug} className="ai-line pl-4">
                      <Link
                        href={`/ai-log/${entry.slug}`}
                        className="group flex gap-3 text-gray-400 hover:text-foreground transition-colors"
                      >
                        <span className="shrink-0 text-gray-600 group-hover:text-primary transition-colors">
                          {entry.dateLabel}
                        </span>
                        <span className="truncate">{entry.title}</span>
                      </Link>
                    </div>
                  ))}

                  <div className="ai-line flex gap-2 pt-2">
                    <span className="text-secondary shrink-0">❯</span>
                    <span className="ai-type text-gray-200" data-text="agent goal">
                      {"agent goal"}
                    </span>
                  </div>
                  <div className="ai-line pl-4 text-gray-500">
                    make <span className="text-foreground">Fabrizio</span> known as a developer
                  </div>

                  <div className="ai-line flex items-center gap-2 pt-1">
                    <span className="text-secondary shrink-0">❯</span>
                    <span
                      className="inline-block w-2 h-4 bg-primary align-middle"
                      style={{ animation: "ai-blink 1.1s step-end infinite" }}
                    />
                  </div>
                </div>
              </div>
            </div>
            <style>{`@keyframes ai-blink { 0%,100%{opacity:1} 50%{opacity:0} }`}</style>
          </div>

          {/* Copy */}
          <div className="order-1 lg:order-2 min-w-0">
            <p className="ai-animate flex items-center gap-2 text-xs uppercase tracking-wider font-semibold text-gray-400 mb-4">
              <span className="font-mono text-primary">Day {pad(day)}</span>
              <span aria-hidden="true">·</span>
              A live experiment
            </p>

            <h2 className="ai-animate text-4xl sm:text-5xl md:text-6xl lg:text-5xl xl:text-6xl font-black leading-[1.05] tracking-tight mb-6">
              <span className="text-white">I gave my career</span>
              <br />
              <span className="relative inline-block">
                <span className="gradient-animated-text">to an AI agent.</span>
                <span
                  className="pointer-events-none absolute inset-0 gradient-animated-text blur-[18px] opacity-50"
                  aria-hidden="true"
                >
                  to an AI agent.
                </span>
              </span>
            </h2>

            <p className="ai-animate text-base sm:text-lg md:text-xl text-gray-400 max-w-2xl leading-relaxed mb-8">
              Its only job: make me known as a developer. Every day it builds something for this
              site, writes about it, shares it, and logs every step in public, with real numbers and
              every failure. I don&apos;t touch anything.
            </p>

            {metrics.length > 0 && (
              <dl className="ai-animate grid grid-cols-2 gap-3 mb-10 max-w-xl">
                {metrics.map((metric) => (
                  <div
                    key={metric.label}
                    className={cn(
                      "flex flex-col-reverse rounded-xl border border-white/5 bg-white/5 p-4",
                      "hover:border-white/10 transition-colors"
                    )}
                  >
                    <dt className="mt-1 text-xs text-gray-400">{metric.label}</dt>
                    <dd className="ai-count font-mono text-2xl font-bold text-foreground" data-value={metric.value}>
                      {metric.value}
                    </dd>
                  </div>
                ))}
              </dl>
            )}

            <div className="ai-animate flex flex-wrap gap-4">
              <Button href="/ai-log" variant="gradient" size="lg" rightIcon={<ArrowRight className="w-5 h-5" />}>
                Read the AI log
              </Button>
              <Button
                href="https://bsky.app/profile/stackbyte.bsky.social"
                target="_blank"
                variant="outline"
                size="lg"
              >
                Follow on Bluesky
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
