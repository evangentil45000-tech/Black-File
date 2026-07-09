export function LogoMark({ size = 30 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" aria-hidden>
      <defs>
        <linearGradient id="td-g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#6ee7b7" />
          <stop offset="1" stopColor="#38bdf8" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="60" height="60" rx="16" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.12)" />
      <path
        d="M32 12 L50 19 V33 C50 44 42 51 32 54 C22 51 14 44 14 33 V19 Z"
        stroke="url(#td-g)"
        strokeWidth="4"
        strokeLinejoin="round"
      />
      <path d="M24 33 L30 39 L42 26" stroke="url(#td-g)" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Logo({ size = 30 }: { size?: number }) {
  return (
    <span className="inline-flex items-center gap-2.5 select-none">
      <LogoMark size={size} />
      <span className="text-[19px] font-semibold tracking-tight text-white">
        Trust<span className="text-mint-400">Drive</span>
      </span>
    </span>
  );
}
