"use client";

import { useEffect, useState } from "react";

// Snippets of "fun" code to display in the background
const codeSnippets = [
  "function coffee() { return '☕' + '💻'; }",
  "while (alive) { code(); eat(); sleep(); }",
  "if (bug) { fixIt(); } else { celebrate(); }",
  "const life = new Promise((resolve) => resolve('success'));",
  "git commit -m 'Fixed the bug I created 5 min ago'",
  "try { beAwesome(); } catch (e) { beAwesomeAnyway(); }",
  "import { Magic } from 'stackbyte';",
  "const stackbyte = { quality: 100, speed: 100 };",
  "// TODO: Rule the world with code",
  "404: Sleep not found",
  "console.log('Hello, World!');",
  "return (<div>🚀</div>);",
  "npm install universe",
  "sudo make me a sandwich",
  "Array(10).fill('🌮').join('')",
  "const developer = { caffeineLevel: 'critical' };",
];

export default function CodeRain() {
  const [columns, setColumns] = useState<
    { delay: string; duration: string; opacity: number }[]
  >([]);

  useEffect(() => {
    // Use a timeout to push the state update to the next tick
    // avoiding synchronous setState warning in useEffect
    const timer = setTimeout(() => {
      const cols = Array.from({ length: 40 }).map(() => ({
        delay: `${Math.random() * -30}s`,
        duration: `${30 + Math.random() * 20}s`,
        opacity: Math.random() * 0.5 + 0.3,
      }));
      setColumns(cols);
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  // Render placeholder or null until hydrated to avoid hydration mismatch
  if (columns.length === 0)
    return <div className="absolute inset-0 bg-background -z-10" />;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
      {/* Gradient Mask to fade out edges */}
      <div className="absolute inset-0 bg-linear-to-b from-background via-transparent to-background z-10" />

      <div className="absolute inset-0 flex justify-between opacity-15 px-2">
        {columns.map((col, i) => (
          <div
            key={i}
            className="flex flex-col gap-4 text-[10px] md:text-xs font-mono text-primary whitespace-nowrap pt-[100vh] animate-code-rain"
            style={{
              animationDelay: col.delay,
              animationDuration: col.duration,
              opacity: col.opacity,
            }}
          >
            {/* Repeat snippets enough times to fill vertical space seamlessly */}
            {Array.from({ length: 10 }).map((_, k) => (
              <div key={k}>
                {[...codeSnippets, ...codeSnippets]
                  .sort(() => Math.random() - 0.5)
                  .map((snippet, j) => (
                    <div key={j} className="transform rotate-0 mb-4">
                      {snippet}
                    </div>
                  ))}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
