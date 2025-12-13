"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLayoutEffect, useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

export default function TechStack3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const mm = gsap.matchMedia();

    // Animations only for Desktop/Tablet (> 768px)
    mm.add(
      "(min-width: 768px)",
      (context) => {
        // Entrance Animation
        gsap.from(".floating-card", {
          y: 100,
          opacity: 0,
          rotateX: -10,
          stagger: 0.1,
          duration: 1.2,
          ease: "back.out(1.2)",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top bottom-=20%",
            end: "center center",
            scrub: 1,
          },
        });

        // Floating Badges Loops
        gsap.to(".badge-react", {
          y: -15,
          duration: 3,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });

        gsap.to(".badge-flash", {
          y: -10,
          duration: 2.5,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: 0.5,
        });

        // Mouse Parallax Effect
        const handleMouseMove = (e: MouseEvent) => {
          if (!sceneRef.current) return;
          const { clientX, clientY } = e;
          const x = (clientX / window.innerWidth - 0.5) * 20;
          const y = (clientY / window.innerHeight - 0.5) * 20;

          gsap.to(sceneRef.current, {
            rotateY: x,
            rotateX: -y,
            duration: 1,
            ease: "power2.out",
          });
        };

        window.addEventListener("mousemove", handleMouseMove);

        return () => {
          window.removeEventListener("mousemove", handleMouseMove);
        };
      },
      containerRef
    );

    return () => mm.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full h-[550px] py-12 flex items-center justify-center relative overflow-hidden bg-transparent"
      style={{ perspective: "2000px" }}
    >
      {/* 3D Scene Container */}
      <div
        ref={sceneRef}
        className="relative w-full md:w-[800px] h-[500px] transition-transform ease-out"
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* 1. Main Code Editor Window (Center) */}
        <div
          className="floating-card absolute top-0 md:top-[5%] left-0 md:left-[20%] w-[80%] md:w-[60%] h-[300px] md:h-[80%] 
                          bg-black border border-primary/30 rounded-xl shadow-2xl z-20 
                          flex flex-col overflow-hidden"
          style={{ transform: "translateZ(40px)" }}
        >
          {/* Window Controls */}
          <div className="h-8 bg-slate-900/50 border-b border-primary/20 flex items-center px-4 gap-2 py-2">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <div className="w-3 h-3 rounded-full bg-green-500/80" />
            <div className="ml-4 text-[10px] text-slate-500 font-mono">
              MyStory.tsx
            </div>
          </div>
          {/* Code Content */}
          <div className="p-6 font-mono text-sm leading-relaxed text-slate-300">
            <div className="flex gap-4">
              <span className="text-slate-600 select-none">1</span>
              <p>
                <span className="text-secondary-light">const</span>{" "}
                <span className="text-primary-light">StackByte</span> ={" "}
                <span className="text-yellow-400">await</span>{" "}
                <span className="text-primary-light">Dev</span>.
                <span className="text-secondary-light">create</span>({`{`}
              </p>
            </div>
            <div className="flex gap-4">
              <span className="text-slate-600 select-none">2</span>
              <p className="pl-4">
                role:{" "}
                <span className="text-primary">
                  &quot;Full Stack Engineer&quot;
                </span>
                ,
              </p>
            </div>
            <div className="flex gap-4">
              <span className="text-slate-600 select-none">3</span>
              <p className="pl-4">stack: [</p>
            </div>
            <div className="flex gap-4">
              <span className="text-slate-600 select-none">4</span>
              <p className="pl-8">
                <span className="text-orange-400">&quot;Next.js&quot;</span>,{" "}
                <span className="text-secondary-light">
                  &quot;TypeScript&quot;
                </span>
                ,
              </p>
            </div>
            <div className="flex gap-4">
              <span className="text-slate-600 select-none">5</span>
              <p className="pl-8">
                <span className="text-primary">&quot;Tailwind&quot;</span>,{" "}
                <span className="text-primary-light">&quot;Node.js&quot;</span>
              </p>
            </div>
            <div className="flex gap-4">
              <span className="text-slate-600 select-none">6</span>
              <p className="pl-4">],</p>
            </div>
            <div className="flex gap-4">
              <span className="text-slate-600 select-none">7</span>
              <p className="pl-4">
                passion: <span className="text-secondary">Infinity</span>
              </p>
            </div>
            <div className="flex gap-4">
              <span className="text-slate-600 select-none">8</span>
              <p>{`});`}</p>
            </div>
            <div className="mt-4 flex gap-2 items-center text-slate-500 text-xs">
              <div className="animate-pulse w-2 h-4 bg-primary" />
              <span>Compiling...</span>
            </div>
          </div>
        </div>

        {/* 2. System Monitor Card (Right, Floating in front) */}
        <div
          className="floating-card absolute top-[20%] right-2 md:right-[5%] w-[240px] h-[260px] 
                          bg-[#0d1117] rounded-xl border-2 border-secondary/20 shadow-2xl z-30
                       flex flex-col overflow-hidden"
          style={{ transform: "translateZ(80px)" }}
        >
          {/* Header */}
          <div className="h-10 bg-slate-900/50 border-b border-secondary/10 flex items-center justify-between px-4">
            <span className="text-xs font-semibold text-slate-300 font-mono">
              System Monitor
            </span>
            <div className="flex gap-2 items-center ml-4">
              <span className="text-[10px] text-green-400">Online</span>
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
            </div>
          </div>

          {/* Dashboard Content */}
          <div className="p-4 flex flex-col gap-4 font-mono">
            {/* Server Status List */}
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 rounded-lg bg-white/5 border border-white/5">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded bg-primary" />
                  <span className="text-[10px] text-slate-300">
                    API Gateway
                  </span>
                </div>
                <span className="text-[10px] text-primary-light">24ms</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-white/5 border border-white/5">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded bg-secondary" />
                  <span className="text-[10px] text-slate-300">Database</span>
                </div>
                <span className="text-[10px] text-primary-light">
                  Connected
                </span>
              </div>
            </div>

            {/* Live Traffic Graph Simulation */}
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>Network Traffic</span>
                <span>1.2 GB/s</span>
              </div>
              <div className="h-16 flex items-end gap-1 border-b border-slate-800 pb-1">
                {[35, 55, 40, 70, 50, 85, 60, 75, 50, 65].map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 bg-gradient-to-t from-primary/10 to-primary/60 rounded-t-[1px]"
                    style={{ height: `${h}%`, opacity: 0.8 + i / 20 }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 3. Terminal/Log Window (Bottom Left, Floating behind) */}
        <div
          className="floating-card absolute bottom-0 left-[5%] w-[320px] h-[200px]
                          bg-[#0d1117] rounded-lg border border-primary/20 shadow-xl z-10 opacity-90"
          style={{ transform: "translateZ(-20px)" }}
        >
          <div className="h-6 bg-[#161b22] border-b border-primary/10 flex items-center px-2">
            <span className="text-[10px] text-slate-400">terminal — zsh</span>
          </div>
          <div className="p-3 font-mono text-[10px] text-primary-light">
            <p>➜ ~ git push origin master</p>
            <p className="text-slate-500">Enumerating objects: 15, done.</p>
            <p className="text-slate-500">
              Counting objects: 100% (15/15), done.
            </p>
            <p className="text-slate-500">
              Writing objects: 100% (9/9), 2.41 KiB, done.
            </p>
            <p className="text-secondary-light">🚀 Deployed to Production</p>
          </div>
        </div>
      </div>
    </div>
  );
}
