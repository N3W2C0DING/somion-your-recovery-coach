import { cn } from "@/lib/utils";

interface ScoreRingProps {
  value: number; // 0-100
  size?: number;
  label?: string;
  sublabel?: string;
  className?: string;
}

export const ScoreRing = ({ value, size = 140, label, sublabel, className }: ScoreRingProps) => {
  const stroke = 8;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (value / 100) * c;
  const color =
    value >= 85 ? "hsl(var(--success))" :
    value >= 70 ? "hsl(var(--primary))" :
    value >= 55 ? "hsl(var(--warning))" :
    "hsl(var(--danger))";

  return (
    <div className={cn("relative inline-grid place-items-center", className)} style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <defs>
          <linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="1" />
            <stop offset="100%" stopColor="hsl(var(--primary-glow))" stopOpacity="0.9" />
          </linearGradient>
        </defs>
        <circle cx={size / 2} cy={size / 2} r={r} stroke="hsl(var(--border))" strokeWidth={stroke} fill="none" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke="url(#ringGrad)"
          strokeWidth={stroke}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={c}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 1s ease" }}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center">
        <div>
          <div className="font-display text-4xl leading-none">{value}</div>
          {label && <div className="mt-1 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{label}</div>}
          {sublabel && <div className="mt-0.5 text-xs text-muted-foreground">{sublabel}</div>}
        </div>
      </div>
    </div>
  );
};
