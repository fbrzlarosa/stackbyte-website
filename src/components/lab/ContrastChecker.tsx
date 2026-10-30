"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

// WCAG 2.x relative luminance and contrast ratio, computed from sRGB channels.
const parseHex = (value: string): [number, number, number] | null => {
  const hex = value.trim().replace(/^#/, "");
  if (!/^([0-9a-f]{3}|[0-9a-f]{6})$/i.test(hex)) return null;
  const full = hex.length === 3 ? hex.split("").map((c) => c + c).join("") : hex;
  const n = parseInt(full, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};

const toHex = (rgb: [number, number, number]) =>
  `#${rgb.map((v) => v.toString(16).padStart(2, "0")).join("")}`;

const channel = (v: number) => {
  const c = v / 255;
  return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
};

const luminance = ([r, g, b]: [number, number, number]) =>
  0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);

const contrastRatio = (a: [number, number, number], b: [number, number, number]) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

type Grade = { label: string; pass: boolean };

const grades = (ratio: number): { normal: Grade[]; large: Grade[] } => ({
  normal: [
    { label: "AA", pass: ratio >= 4.5 },
    { label: "AAA", pass: ratio >= 7 },
  ],
  large: [
    { label: "AA", pass: ratio >= 3 },
    { label: "AAA", pass: ratio >= 4.5 },
  ],
});

const DEFAULTS = { fg: "#f3f4f6", bg: "#0d1117" };

function ColorField({
  id,
  label,
  value,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const rgb = parseHex(value);
  return (
    <div>
      <label htmlFor={`${id}-text`} className="text-xs font-semibold text-gray-400">
        {label}
      </label>
      <div className="mt-2 flex items-center gap-3">
        <input
          id={`${id}-picker`}
          type="color"
          aria-label={`${label} picker`}
          value={rgb ? toHex(rgb) : "#000000"}
          onChange={(e) => onChange(e.target.value)}
          className="h-10 w-12 cursor-pointer rounded-lg border border-white/10 bg-transparent p-1"
        />
        <input
          id={`${id}-text`}
          type="text"
          spellCheck={false}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={!rgb}
          className={cn(
            "h-10 w-full rounded-lg border bg-background/60 px-3 font-mono text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50",
            rgb ? "border-white/10" : "border-red-500/60"
          )}
        />
      </div>
    </div>
  );
}

function Badge({ grade }: { grade: Grade }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-xs",
        grade.pass
          ? "border-primary/40 bg-primary/10 text-primary-light"
          : "border-white/10 bg-white/5 text-gray-400"
      )}
    >
      {grade.label} {grade.pass ? "pass" : "fail"}
    </span>
  );
}

export default function ContrastChecker() {
  const [fg, setFg] = useState(DEFAULTS.fg);
  const [bg, setBg] = useState(DEFAULTS.bg);

  const fgRgb = parseHex(fg);
  const bgRgb = parseHex(bg);
  const valid = fgRgb && bgRgb;
  const ratio = valid ? contrastRatio(fgRgb, bgRgb) : null;
  const g = ratio ? grades(ratio) : null;

  const previewStyle = valid ? { color: fg, backgroundColor: bg } : undefined;

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr]">
      <div className="space-y-6 rounded-2xl border border-white/5 bg-white/5 p-6">
        <ColorField id="fg" label="Text colour" value={fg} onChange={setFg} />
        <ColorField id="bg" label="Background colour" value={bg} onChange={setBg} />
        <button
          type="button"
          onClick={() => {
            setFg(bg);
            setBg(fg);
          }}
          className="text-sm text-primary-light hover:text-primary transition-colors"
        >
          Swap colours
        </button>
        {!valid && (
          <p className="text-sm text-red-400">Use a hex colour such as #06b6d4 or #fff.</p>
        )}
      </div>

      <div className="space-y-6">
        <div
          className="rounded-2xl border border-white/10 p-6 transition-colors"
          style={previewStyle}
          aria-label="Colour preview"
        >
          <p className="text-base">Body text: the quick brown fox jumps over the lazy dog.</p>
          <p className="mt-3 text-2xl font-semibold">Large text: the quick brown fox.</p>
        </div>

        <div className="rounded-2xl border border-white/5 bg-white/5 p-6" aria-live="polite">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Contrast ratio</p>
          <p className="mt-2 font-mono text-4xl font-bold text-foreground">
            {ratio ? `${ratio.toFixed(2)}:1` : "—"}
          </p>
          {g && (
            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              <div>
                <p className="text-sm text-gray-300">Normal text</p>
                <div className="mt-2 flex gap-2">
                  {g.normal.map((grade) => (
                    <Badge key={grade.label} grade={grade} />
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-300">Large text (18pt, or 14pt bold)</p>
                <div className="mt-2 flex gap-2">
                  {g.large.map((grade) => (
                    <Badge key={grade.label} grade={grade} />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
