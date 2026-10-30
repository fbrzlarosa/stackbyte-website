"use client";

import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";

type Field = { name: string; min: number; max: number };

const FIELDS: Field[] = [
  { name: "Minute", min: 0, max: 59 },
  { name: "Hour", min: 0, max: 23 },
  { name: "Day of month", min: 1, max: 31 },
  { name: "Month", min: 1, max: 12 },
  { name: "Day of week", min: 0, max: 7 },
];

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const PRESETS = [
  { label: "Every 5 minutes", expr: "*/5 * * * *" },
  { label: "Weekdays at 09:00", expr: "0 9 * * 1-5" },
  { label: "Every 15 min, 9 to 17 on weekdays", expr: "*/15 9-17 * * 1-5" },
  { label: "First day of the month", expr: "0 0 1 * *" },
  { label: "Sundays at 02:30", expr: "30 2 * * 0" },
];

const DEFAULT_EXPR = PRESETS[1].expr;

// Parses one cron field: "*", "5", "1-5", "*/10", "1-30/5", "2/15" and comma lists of those.
const parseField = (raw: string, { name, min, max }: Field): Set<number> => {
  const values = new Set<number>();
  for (const part of raw.split(",")) {
    const [range, stepRaw] = part.split("/");
    const step = stepRaw === undefined ? 1 : Number(stepRaw);
    if (!Number.isInteger(step) || step < 1) throw new Error(`${name}: "${part}" has a bad step`);

    let start: number;
    let end: number;
    if (range === "*") {
      start = min;
      end = max;
    } else if (/^\d+-\d+$/.test(range)) {
      [start, end] = range.split("-").map(Number);
    } else if (/^\d+$/.test(range)) {
      start = Number(range);
      end = stepRaw === undefined ? start : max;
    } else {
      throw new Error(`${name}: "${part}" is not a number, a range or a step`);
    }
    if (start < min || end > max || start > end) {
      throw new Error(`${name}: "${part}" must stay within ${min}-${max}`);
    }
    for (let v = start; v <= end; v += step) values.add(v);
  }
  return values;
};

type Parsed = { raw: string[]; sets: Set<number>[] };

const parseCron = (expr: string): Parsed => {
  const raw = expr.trim().split(/\s+/);
  if (raw.length !== 5) {
    throw new Error(`A cron expression has 5 fields, got ${expr.trim() ? raw.length : 0}.`);
  }
  const sets = raw.map((field, i) => parseField(field, FIELDS[i]));
  // Sunday can be written as 0 or 7.
  if (sets[4].has(7)) {
    sets[4].delete(7);
    sets[4].add(0);
  }
  return { raw, sets };
};

const sorted = (set: Set<number>) => [...set].sort((a, b) => a - b);
const pad = (n: number) => n.toString().padStart(2, "0");

// Standard cron rule: when both day fields are restricted, a day matches if either one does.
const dayMatches = ({ raw, sets }: Parsed, date: Date) => {
  const dom = sets[2].has(date.getDate());
  const dow = sets[4].has(date.getDay());
  if (raw[2] === "*") return dow;
  if (raw[4] === "*") return dom;
  return dom || dow;
};

const RUN_LIMIT_YEARS = 5;

const nextRuns = (parsed: Parsed, from: Date, count: number): Date[] => {
  const runs: Date[] = [];
  const limit = from.getTime() + RUN_LIMIT_YEARS * 366 * 24 * 60 * 60 * 1000;
  let t = new Date(from);
  t.setSeconds(0, 0);
  t = new Date(t.getTime() + 60_000);

  while (runs.length < count && t.getTime() < limit) {
    if (!parsed.sets[3].has(t.getMonth() + 1) || !dayMatches(parsed, t)) {
      t = new Date(t.getFullYear(), t.getMonth(), t.getDate() + 1);
    } else if (!parsed.sets[1].has(t.getHours())) {
      t = new Date(t.getFullYear(), t.getMonth(), t.getDate(), t.getHours() + 1);
    } else {
      if (parsed.sets[0].has(t.getMinutes())) runs.push(new Date(t));
      t = new Date(t.getTime() + 60_000);
    }
  }
  return runs;
};

// Plain-English reading of the expression, built from the parsed sets.
const describe = ({ raw, sets }: Parsed) => {
  const [minute, hour, dom, month, dow] = raw;
  const mins = sorted(sets[0]);
  const hrs = sorted(sets[1]);

  let time: string;
  if (mins.length === 1 && hrs.length === 1) {
    time = `At ${pad(hrs[0])}:${pad(mins[0])}`;
  } else if (hour === "*") {
    if (minute === "*") time = "Every minute";
    else if (minute.startsWith("*/")) time = `Every ${minute.slice(2)} minutes`;
    else time = `At minute ${mins.join(", ")} of every hour`;
  } else {
    const minutePart =
      minute === "*"
        ? "every minute"
        : minute.startsWith("*/")
          ? `every ${minute.slice(2)} minutes`
          : `at minute ${mins.join(", ")}`;
    const hourPart = hour.startsWith("*/")
      ? `every ${hour.slice(2)} hours`
      : `during hours ${hrs.join(", ")}`;
    time = `${minutePart.charAt(0).toUpperCase()}${minutePart.slice(1)}, ${hourPart}`;
  }

  const domText = `on day ${sorted(sets[2]).join(", ")} of the month`;
  const dowText = `on ${sorted(sets[4]).map((d) => DAY_NAMES[d]).join(", ")}`;
  let days = "";
  if (dom !== "*" && dow !== "*") days = `${domText} or ${dowText}`;
  else if (dom !== "*") days = domText;
  else if (dow !== "*") days = dowText;

  const monthText =
    month === "*" ? "" : `in ${sorted(sets[3]).map((m) => MONTH_NAMES[m - 1]).join(", ")}`;

  return [time, days, monthText].filter(Boolean).join(" ") + ".";
};

// Shows the values a field resolves to, so the reader can see what the expression matches.
const matchesText = (set: Set<number>, field: Field, dayName = false) => {
  const values = sorted(set).map((v) => (dayName ? DAY_NAMES[v] : field.name === "Month" ? MONTH_NAMES[v - 1] : String(v)));
  if (values.length <= 14) return values.join(", ");
  return `${values.slice(0, 12).join(", ")}, … (${values.length} values)`;
};

function FieldRow({ label, raw, value }: { label: string; raw: string; value: string }) {
  return (
    <div className="grid gap-1 border-t border-white/5 py-3 first:border-t-0 first:pt-0 sm:grid-cols-[9rem_6rem_1fr] sm:items-baseline sm:gap-4">
      <p className="text-sm text-gray-300">{label}</p>
      <p className="font-mono text-sm text-primary-light">{raw}</p>
      <p className="text-sm text-gray-400">{value}</p>
    </div>
  );
}

export default function CronExplainer() {
  const [expr, setExpr] = useState(DEFAULT_EXPR);
  const [runs, setRuns] = useState<string[]>([]);

  const result = useMemo(() => {
    try {
      const parsed = parseCron(expr);
      return { parsed, error: null as string | null };
    } catch (err) {
      return { parsed: null, error: err instanceof Error ? err.message : "Invalid expression." };
    }
  }, [expr]);

  // Run times depend on the clock and the viewer's time zone, so they are computed after mount.
  useEffect(() => {
    if (!result.parsed) {
      setRuns([]);
      return;
    }
    const formatter = new Intl.DateTimeFormat(undefined, {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
    setRuns(nextRuns(result.parsed, new Date(), 5).map((d) => formatter.format(d)));
  }, [result]);

  const parsed = result.parsed;

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr]">
      <div className="space-y-6 rounded-2xl border border-white/5 bg-white/5 p-6">
        <div>
          <label htmlFor="cron-expr" className="text-xs font-semibold text-gray-400">
            Cron expression (minute hour day-of-month month day-of-week)
          </label>
          <input
            id="cron-expr"
            type="text"
            spellCheck={false}
            value={expr}
            onChange={(e) => setExpr(e.target.value)}
            aria-invalid={!parsed}
            aria-describedby="cron-error"
            className={cn(
              "mt-2 h-10 w-full rounded-lg border bg-background/60 px-3 font-mono text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50",
              parsed ? "border-white/10" : "border-red-500/60"
            )}
          />
          {!parsed && (
            <p id="cron-error" className="mt-2 text-sm text-red-400">
              {result.error}
            </p>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {PRESETS.map((preset) => (
            <button
              key={preset.expr}
              type="button"
              onClick={() => setExpr(preset.expr)}
              className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-gray-300 transition-colors hover:border-primary/40 hover:text-primary-light"
            >
              {preset.label}
            </button>
          ))}
        </div>

        <p className="text-xs text-gray-500">
          Supports <span className="font-mono">*</span>, lists (<span className="font-mono">1,15</span>),
          ranges (<span className="font-mono">9-17</span>) and steps (<span className="font-mono">*/10</span>).
          Names such as <span className="font-mono">MON</span> and <span className="font-mono">@daily</span> are not supported.
        </p>
      </div>

      <div className="space-y-6">
        <div className="rounded-2xl border border-white/10 p-6" aria-live="polite">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">In plain words</p>
          <p className="mt-2 text-xl font-semibold text-foreground">
            {parsed ? describe(parsed) : "—"}
          </p>
        </div>

        {parsed && (
          <div className="rounded-2xl border border-white/5 bg-white/5 p-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">What each field matches</p>
            <div className="mt-4">
              {FIELDS.map((field, i) => (
                <FieldRow
                  key={field.name}
                  label={field.name}
                  raw={parsed.raw[i]}
                  value={matchesText(parsed.sets[i], field, i === 4)}
                />
              ))}
            </div>
          </div>
        )}

        <div className="rounded-2xl border border-white/5 bg-white/5 p-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Next 5 runs (your time zone)</p>
          {runs.length > 0 ? (
            <ol className="mt-3 space-y-2 font-mono text-sm text-gray-200">
              {runs.map((run) => (
                <li key={run}>{run}</li>
              ))}
            </ol>
          ) : (
            <p className="mt-3 text-sm text-gray-500">
              {parsed ? "No run in the next five years." : "Fix the expression to see its next runs."}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
