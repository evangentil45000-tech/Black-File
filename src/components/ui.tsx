import { useEffect, useRef, useState, type ReactNode, type MouseEvent } from "react";
import { motion, useInView } from "framer-motion";
import { Link } from "react-router-dom";

/* ---------- Boutons ---------- */

const btnBase =
  "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-200 active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mint-400 cursor-pointer";

export function PrimaryButton({
  to,
  onClick,
  children,
  size = "md",
  className = "",
}: {
  to?: string;
  onClick?: () => void;
  children: ReactNode;
  size?: "md" | "lg";
  className?: string;
}) {
  const cls = `${btnBase} bg-gradient-to-b from-mint-300 to-mint-500 text-night-950 glow-mint hover:brightness-110 ${
    size === "lg" ? "px-7 py-3.5 text-[15px]" : "px-5 py-2.5 text-sm"
  } ${className}`;
  if (to) {
    return (
      <Link to={to} className={cls}>
        {children}
      </Link>
    );
  }
  return (
    <button onClick={onClick} className={cls}>
      {children}
    </button>
  );
}

export function GhostButton({
  to,
  onClick,
  children,
  size = "md",
  className = "",
}: {
  to?: string;
  onClick?: () => void;
  children: ReactNode;
  size?: "md" | "lg";
  className?: string;
}) {
  const cls = `${btnBase} glass text-white/90 hover:bg-white/10 hover:text-white ${
    size === "lg" ? "px-7 py-3.5 text-[15px]" : "px-5 py-2.5 text-sm"
  } ${className}`;
  if (to) {
    return (
      <Link to={to} className={cls}>
        {children}
      </Link>
    );
  }
  return (
    <button onClick={onClick} className={cls}>
      {children}
    </button>
  );
}

/* ---------- Révélation au scroll ---------- */

export function Reveal({
  children,
  delay = 0,
  y = 26,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay, ease: [0.21, 0.65, 0.32, 1] }}
    >
      {children}
    </motion.div>
  );
}

/* ---------- Carte spotlight (halo qui suit la souris) ---------- */

export function SpotlightCard({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: -400, y: -400 });

  function onMove(e: MouseEvent<HTMLDivElement>) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  }

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={() => setPos({ x: -400, y: -400 })}
      className={`group relative overflow-hidden glass rounded-3xl ${className}`}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(420px circle at ${pos.x}px ${pos.y}px, rgba(52,211,153,0.09), transparent 65%)`,
        }}
      />
      {children}
    </div>
  );
}

/* ---------- Compteur animé ---------- */

export function CountUp({
  value,
  suffix = "",
  prefix = "",
  duration = 1.6,
}: {
  value: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / (duration * 1000));
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(Math.round(value * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value, duration]);

  return (
    <span ref={ref}>
      {prefix}
      {display.toLocaleString("fr-FR")}
      {suffix}
    </span>
  );
}

/* ---------- Badge de section ---------- */

export function SectionBadge({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full glass px-3.5 py-1.5 text-[12.5px] font-medium tracking-wide text-mint-300">
      <span className="size-1.5 rounded-full bg-mint-400 animate-pulse-dot" />
      {children}
    </span>
  );
}
