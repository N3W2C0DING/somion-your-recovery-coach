import { cn } from "@/lib/utils";

export const Logo = ({ className, withWord = true }: { className?: string; withWord?: boolean }) => (
  <div className={cn("flex items-center gap-2.5", className)}>
    <div className="relative grid h-8 w-8 place-items-center rounded-xl bg-gradient-moon shadow-glow">
      {/* Stylized pulse / waveform mark */}
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="hsl(var(--primary-foreground))" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 12h4l2-6 4 12 3-9 2 3h5" />
      </svg>
    </div>
    {withWord && (
      <span className="font-display text-2xl tracking-tight">Somion</span>
    )}
  </div>
);
