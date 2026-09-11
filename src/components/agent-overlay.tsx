import { useEffect, useMemo, useState } from "react";
import { LENDERS } from "@/lib/lenders";
import { rankLenders } from "@/lib/match";
import { ANALYZING_DURATION_MS, useSession } from "@/lib/session";
import { NG_STATES, type LenderKind } from "@/lib/types";
import { cn, currency, prefersReducedMotion } from "@/lib/utils";
import { AppIcon } from "./app-icon";

const STATUS_FRACTIONS: { at: number; text: string }[] = [
  { at: 0, text: "Opening the full lender file…" },
  { at: 0.06, text: "Checking digital banks…" },
  { at: 0.22, text: "Checking loan apps…" },
  { at: 0.42, text: "Checking microfinance banks…" },
  { at: 0.6, text: "Checking commercial banks…" },
  { at: 0.76, text: "Checking development finance…" },
  { at: 0.88, text: "Weighing rate, speed, and fit…" },
  { at: 0.95, text: "Finalizing your shortlist…" },
];

const KIND_ORDER: LenderKind[] = [
  "Digital bank",
  "Loan app",
  "Microfinance bank",
  "Commercial bank",
  "Development finance",
];

function buildLogs(): string[] {
  const logs: string[] = [`opening ${LENDERS.length} lender records`];
  for (const kind of KIND_ORDER) {
    const group = LENDERS.filter((l) => l.kind === kind);
    if (group.length === 0) continue;
    logs.push(`— scanning ${kind.toLowerCase()}s —`);
    for (const l of group) {
      logs.push(`${l.name} · ${l.operator}`);
    }
  }
  logs.push(
    "cross-checking rate bands",
    "checking CBN licensing per entry",
    "weighting speed against urgency",
    "dropping out-of-band entries",
    "sorting shortlist by composite fit",
    "drafting match reasons",
  );
  return logs;
}

const LOGS = buildLogs();
const LOG_INTERVAL_MS = Math.max(220, Math.floor(ANALYZING_DURATION_MS / (LOGS.length + 6)));

export function AgentOverlay() {
  const profile = useSession((s) => s.profile);
  const [elapsed, setElapsed] = useState(0);
  const reduced = prefersReducedMotion();

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  useEffect(() => {
    if (reduced) {
      setElapsed(ANALYZING_DURATION_MS);
      return;
    }
    const t0 = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      setElapsed(now - t0);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reduced]);

  const ranked = useMemo(() => (profile ? rankLenders(profile) : []), [profile]);
  const scoreById = useMemo(() => {
    const m = new Map(ranked.map((r) => [r.lender.id, r.score]));
    return m;
  }, [ranked]);

  const cards = useMemo(() => {
    const topIds = new Set(ranked.slice(0, 4).map((r) => r.lender.id));
    return LENDERS.slice(0, 8).map((lender, i) => ({
      lender,
      appearAt: 260 + i * 220,
      score: scoreById.get(lender.id) ?? 40 + ((i * 13) % 30),
      shortlist: topIds.has(lender.id),
    }));
  }, [ranked, scoreById]);

  const STATUS = useMemo(
    () => STATUS_FRACTIONS.map((s) => ({ at: s.at * ANALYZING_DURATION_MS, text: s.text })),
    [],
  );

  const status = [...STATUS].reverse().find((s) => elapsed >= s.at)?.text ?? STATUS[0].text;
  const typed = useTyped(status, elapsed < 40);
  const progress = Math.min(100, (elapsed / (ANALYZING_DURATION_MS * 0.97)) * 100);
  const confidence = Math.min(96, 10 + (elapsed / ANALYZING_DURATION_MS) * 86);
  const place = NG_STATES.find((s) => s.code === profile?.state)?.name ?? profile?.state;
  const logIndex = Math.min(LOGS.length - 1, Math.floor(elapsed / LOG_INTERVAL_MS));
  const scanned = Math.min(
    LENDERS.length,
    Math.round((elapsed / ANALYZING_DURATION_MS) * LENDERS.length),
  );

  return (
    <div
      className="grain fixed inset-0 z-50 flex flex-col overflow-hidden text-text"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="pointer-events-none absolute inset-0 bg-bg/85" />
      <div className="relative flex min-h-12 shrink-0 flex-wrap items-center justify-between gap-x-3 gap-y-1 px-4 py-2 sm:h-16 sm:px-5 sm:py-0">
        <p className="text-xs font-medium uppercase tracking-widest text-text-soft/70">
          Fathom agent · live
        </p>
        <p className="font-mono text-[11px] tabular-nums text-text-soft/60 sm:text-xs">
          {profile ? currency(profile.amount) : ""} {place ? `· ${place}` : ""}
        </p>
      </div>

      <div className="relative flex min-h-0 flex-1 flex-col items-center overflow-y-auto px-4 pb-6 sm:justify-center">
        <p className="mb-3 min-h-10 max-w-xl px-1 text-center font-display text-base font-semibold tracking-tight text-text sm:mb-6 sm:min-h-12 sm:text-2xl">
          {typed}
          <span className="caret-blink ml-0.5 inline-block h-4 w-px translate-y-0.5 bg-teal align-middle sm:h-5" />
        </p>

        <div className="flex w-full max-w-5xl items-center justify-center gap-8">
          <div className="hidden w-60 shrink-0 md:block">
            <EvalColumn items={cards.slice(0, 4)} elapsed={elapsed} />
          </div>
          <Radar progress={progress} />
          <div className="hidden w-60 shrink-0 md:block">
            <EvalColumn items={cards.slice(4, 8)} elapsed={elapsed} />
          </div>
        </div>

        <div className="mt-4 w-full max-w-md sm:mt-8">
          <div className="mb-2 flex items-center justify-between text-[11px] sm:text-xs">
            <span className="shimmer-text font-medium">
              Scanning {scanned}/{LENDERS.length} entries
            </span>
            <span className="font-mono tabular-nums text-text-soft/70">
              Confidence {confidence.toFixed(0)}%
            </span>
          </div>
          <div className="h-1 overflow-hidden rounded-full bg-surface-2">
            <div
              className="h-full rounded-full bg-teal transition-[width] duration-150 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="mt-2 truncate px-2 text-center font-mono text-[11px] text-muted sm:mt-3 sm:text-xs">
            {LOGS[logIndex]}
          </p>
        </div>

        <div className="mt-4 w-full max-w-sm md:hidden">
          <EvalColumn items={cards.slice(0, 3)} elapsed={elapsed} />
        </div>
      </div>
    </div>
  );
}

function EvalColumn({
  items,
  elapsed,
}: {
  items: {
    lender: (typeof LENDERS)[number];
    appearAt: number;
    score: number;
    shortlist: boolean;
  }[];
  elapsed: number;
}) {
  return (
    <ul className="flex flex-col gap-2">
      {items.map((item) => {
        const visible = elapsed >= item.appearAt;
        const scoring = elapsed >= ANALYZING_DURATION_MS * 0.2;
        const judgeAt = ANALYZING_DURATION_MS * 0.55;
        const selectAt = ANALYZING_DURATION_MS * 0.8;
        const judged = elapsed >= judgeAt;
        const scoreStart = ANALYZING_DURATION_MS * 0.2;
        const scoreSpan = ANALYZING_DURATION_MS * 0.45;
        const shownScore = scoring
          ? Math.min(item.score, 20 + ((elapsed - scoreStart) / scoreSpan) * item.score)
          : 0;
        const rejected = judged && !item.shortlist;
        const selected = elapsed >= selectAt && item.shortlist;
        return (
          <li
            key={item.lender.id}
            className={cn(
              "w-full rounded-xl border border-border bg-surface p-2.5 shadow-card transition-[opacity,transform] duration-500 ease-out-soft",
              visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-2 opacity-0",
              rejected && "opacity-35",
              selected && "shadow-glow",
            )}
          >
            <div className="flex items-center gap-2.5">
              <AppIcon iconUrl={item.lender.iconUrl} letters={item.lender.monogram} seed={item.lender.id} size="sm" />
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-2">
                  <p className="truncate text-sm font-medium text-text">{item.lender.name}</p>
                  <p className="font-mono text-xs tabular-nums text-teal">
                    {scoring ? shownScore.toFixed(0) : "—"}
                  </p>
                </div>
                <p className="truncate text-xs text-muted">
                  {selected ? "Shortlisted" : rejected ? "Passed" : item.lender.kind}
                </p>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

function Radar({ progress }: { progress: number }) {
  const dots = [
    { x: 62, y: 28, d: "0s" },
    { x: 78, y: 48, d: "0.4s" },
    { x: 70, y: 72, d: "0.8s" },
    { x: 38, y: 76, d: "0.2s" },
    { x: 22, y: 54, d: "0.6s" },
    { x: 30, y: 30, d: "1s" },
    { x: 52, y: 18, d: "1.2s" },
    { x: 50, y: 50, d: "0.1s" },
  ];
  return (
    <div className="relative size-28 shrink-0 overflow-hidden rounded-full sm:size-52 md:size-56">
      <div className="absolute inset-0 rounded-full border border-border" />
      <div className="radar-ring absolute inset-5 rounded-full border border-teal/30" />
      <div className="radar-ring absolute inset-10 rounded-full border border-border-strong [animation-delay:0.6s]" />
      <div className="radar-sweep absolute inset-0 rounded-full opacity-80" />
      <div className="absolute inset-0">
        {dots.map((d, i) => (
          <span
            key={i}
            className="radar-dot absolute size-1.5 rounded-full bg-teal"
            style={{ left: `${d.x}%`, top: `${d.y}%`, animationDelay: d.d }}
          />
        ))}
      </div>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <p className="font-mono text-[10px] uppercase tracking-widest text-text-soft/60 sm:text-xs">
          Scan
        </p>
        <p className="mt-1 font-display text-2xl font-semibold tabular-nums text-text sm:text-3xl">
          {Math.round(progress)}
        </p>
      </div>
    </div>
  );
}

function useTyped(text: string, instant: boolean) {
  const [out, setOut] = useState(text);
  useEffect(() => {
    if (instant || prefersReducedMotion()) {
      setOut(text);
      return;
    }
    setOut("");
    let i = 0;
    const id = window.setInterval(() => {
      i += 1;
      setOut(text.slice(0, i));
      if (i >= text.length) window.clearInterval(id);
    }, 16);
    return () => window.clearInterval(id);
  }, [text, instant]);
  return out;
}
