import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import { VERDICT_META } from "../lib/data";
import type { MarketSample, Verdict } from "../lib/types";
import { euro } from "../lib/store";

/* ---------- Jauge de score circulaire ---------- */

export function ScoreGauge({ score, verdict, size = 168 }: { score: number; verdict: Verdict; size?: number }) {
  const meta = VERDICT_META[verdict];
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / 1400);
      setProgress(1 - Math.pow(1 - p, 3));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView]);

  const stroke = 11;
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const arc = 0.76; // portion du cercle utilisée (jauge ouverte en bas)
  const filled = circ * arc * (score / 100) * progress;

  return (
    <div ref={ref} className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-[227deg]">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={stroke}
          strokeDasharray={`${circ * arc} ${circ}`}
          strokeLinecap="round"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={meta.color}
          strokeWidth={stroke}
          strokeDasharray={`${filled} ${circ}`}
          strokeLinecap="round"
          style={{ filter: `drop-shadow(0 0 10px ${meta.color}66)` }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-[42px] font-bold leading-none tracking-tight text-white tabular-nums">
          {Math.round(score * progress)}
        </span>
        <span className="mt-1 text-[11px] font-medium uppercase tracking-[0.18em] text-white/45">Score / 100</span>
      </div>
    </div>
  );
}

/* ---------- Badge verdict ---------- */

export function VerdictBadge({ verdict, size = "md" }: { verdict: Verdict; size?: "sm" | "md" | "lg" }) {
  const meta = VERDICT_META[verdict];
  const cls =
    size === "lg"
      ? "px-5 py-2.5 text-[15px]"
      : size === "sm"
        ? "px-2.5 py-1 text-[11.5px]"
        : "px-3.5 py-1.5 text-[13px]";
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full font-semibold ${cls}`}
      style={{ color: meta.color, background: meta.bg, border: `1px solid ${meta.border}` }}
    >
      <span className="size-1.5 rounded-full animate-pulse-dot" style={{ background: meta.color }} />
      {meta.label}
    </span>
  );
}

/* ---------- Positionnement marché (barres horizontales) ---------- */

export function MarketChart({ samples }: { samples: MarketSample[] }) {
  const max = Math.max(...samples.map((s) => s.price)) * 1.06;
  return (
    <div className="space-y-3">
      {samples.map((s) => (
        <div key={s.label} className="group">
          <div className="mb-1 flex items-baseline justify-between gap-3">
            <span className={`truncate text-[13px] ${s.isCurrent ? "font-semibold text-mint-300" : "text-white/60"}`}>
              {s.label}
            </span>
            <span className={`shrink-0 text-[13px] tabular-nums ${s.isCurrent ? "font-semibold text-white" : "text-white/50"}`}>
              {euro(s.price)}
            </span>
          </div>
          <div className="h-2.5 overflow-hidden rounded-full bg-white/6">
            <div
              className="h-full rounded-full transition-[width] duration-1000 ease-out"
              style={{
                width: `${(s.price / max) * 100}%`,
                background: s.isCurrent
                  ? "linear-gradient(90deg, #34d399, #38bdf8)"
                  : "rgba(255,255,255,0.16)",
                boxShadow: s.isCurrent ? "0 0 14px rgba(52,211,153,0.45)" : undefined,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

/* ---------- Radar de sous-scores (comparateur) ---------- */

export function RadarChart({
  axes,
  series,
  size = 300,
}: {
  axes: string[];
  series: { name: string; color: string; values: number[] }[];
  size?: number;
}) {
  const cx = size / 2;
  const cy = size / 2;
  const R = size / 2 - 54;
  const n = axes.length;

  const point = (i: number, v: number) => {
    const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
    return [cx + Math.cos(angle) * R * (v / 100), cy + Math.sin(angle) * R * (v / 100)];
  };

  const ringPath = (v: number) =>
    axes.map((_, i) => point(i, v).map((c) => c.toFixed(1)).join(",")).join(" ");

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="max-w-full">
      {[25, 50, 75, 100].map((v) => (
        <polygon key={v} points={ringPath(v)} fill="none" stroke="rgba(255,255,255,0.07)" />
      ))}
      {axes.map((a, i) => {
        const [x, y] = point(i, 100);
        const [lx, ly] = point(i, 126);
        return (
          <g key={a}>
            <line x1={cx} y1={cy} x2={x} y2={y} stroke="rgba(255,255,255,0.07)" />
            <text
              x={lx}
              y={ly}
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-white/50 text-[11px] font-medium"
            >
              {a}
            </text>
          </g>
        );
      })}
      {series.map((s) => (
        <g key={s.name}>
          <polygon
            points={s.values.map((v, i) => point(i, v).map((c) => c.toFixed(1)).join(",")).join(" ")}
            fill={s.color + "22"}
            stroke={s.color}
            strokeWidth="2"
            strokeLinejoin="round"
          />
          {s.values.map((v, i) => {
            const [x, y] = point(i, v);
            return <circle key={i} cx={x} cy={y} r="3" fill={s.color} />;
          })}
        </g>
      ))}
    </svg>
  );
}

/* ---------- Vignette véhicule (silhouette SVG) ---------- */

export function CarThumb({ accent, className = "" }: { accent: string; className?: string }) {
  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden rounded-2xl ${className}`}
      style={{
        background: `radial-gradient(120% 130% at 30% 20%, ${accent}26, transparent 60%), linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0.01))`,
        border: "1px solid rgba(255,255,255,0.09)",
      }}
    >
      <svg viewBox="0 0 200 90" className="w-[78%]" fill="none" aria-hidden>
        <path
          d="M28 62 C30 48 40 42 58 40 L72 28 C76 24 82 22 90 22 L128 22 C138 22 146 26 152 33 L160 41 C174 43 184 48 186 56 C188 60 186 64 182 64 L170 64"
          stroke={accent}
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        <path d="M62 64 L134 64" stroke={accent} strokeWidth="3.5" strokeLinecap="round" />
        <circle cx="48" cy="64" r="12" stroke={accent} strokeWidth="3.5" />
        <circle cx="150" cy="64" r="12" stroke={accent} strokeWidth="3.5" />
        <path d="M88 24 L86 40 M124 24 L128 40" stroke={accent} strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />
      </svg>
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-px"
        style={{ background: `linear-gradient(90deg, transparent, ${accent}88, transparent)` }}
      />
    </div>
  );
}

/* ---------- Barre de sous-score ---------- */

export function SubscoreBar({ label, value }: { label: string; value: number }) {
  const color = value >= 75 ? "#34d399" : value >= 45 ? "#fbbf24" : "#fb7185";
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <span className="text-[13px] text-white/65">{label}</span>
        <span className="text-[13px] font-semibold tabular-nums" style={{ color }}>
          {value}
        </span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-white/6">
        <div
          className="h-full rounded-full transition-[width] duration-1000 ease-out"
          style={{ width: `${value}%`, background: color, boxShadow: `0 0 10px ${color}55` }}
        />
      </div>
    </div>
  );
}
