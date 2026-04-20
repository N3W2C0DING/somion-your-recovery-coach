import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { GlassCard } from "@/components/GlassCard";
import { recentSessions, last30 } from "@/lib/somion-data";
import { cn } from "@/lib/utils";
import { Check, Clock } from "lucide-react";

const ranges = [7, 14, 30] as const;

const History = () => {
  const [range, setRange] = useState<typeof ranges[number]>(14);
  const slice = last30.slice(-range);
  const completed = Math.round(slice.length * 0.78);
  const consistency = Math.round((completed / slice.length) * 100);
  const alignment = 92;

  return (
    <AppShell>
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4 animate-fade-up">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Your record</p>
          <h1 className="mt-1 font-display text-4xl md:text-5xl">History</h1>
        </div>
        <div className="inline-flex rounded-full border border-border bg-secondary/40 p-1">
          {ranges.map(r => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={cn(
                "rounded-full px-4 py-1.5 text-xs uppercase tracking-wider transition-colors",
                range === r ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {r} days
            </button>
          ))}
        </div>
      </header>

      <div className="grid gap-5 md:grid-cols-3">
        <Stat title="Completed sessions" value={`${completed}`} sub={`of ${slice.length} planned`} />
        <Stat title="Consistency" value={`${consistency}%`} sub="Earned, not enforced" />
        <Stat title="Recovery alignment" value={`${alignment}%`} sub="Sessions matched your readiness" />
      </div>

      <GlassCard className="mt-6 p-6 animate-fade-up">
        <h3 className="font-display text-2xl">Recent sessions</h3>
        <div className="mt-4 divide-y divide-border/50 overflow-hidden rounded-xl border border-border/60">
          {recentSessions.map(s => (
            <div key={s.date} className="flex items-center justify-between gap-4 px-4 py-3 text-sm">
              <div className="flex items-center gap-3">
                <div className="grid h-8 w-8 place-items-center rounded-full bg-primary/10 ring-1 ring-primary/20">
                  {s.duration > 0 ? <Check className="h-4 w-4 text-primary" /> : <Clock className="h-4 w-4 text-muted-foreground" />}
                </div>
                <div>
                  <div>{s.title}</div>
                  <div className="text-xs text-muted-foreground">{s.date} · {s.duration > 0 ? `${s.duration} min` : "Recovery"}</div>
                </div>
              </div>
              <div className="text-right text-xs text-muted-foreground">
                <div className="text-foreground">Readiness {s.readiness}</div>
                <div className="text-success">{s.alignment}</div>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    </AppShell>
  );
};

const Stat = ({ title, value, sub }: { title: string; value: string; sub: string }) => (
  <GlassCard className="p-6 animate-fade-up">
    <div className="text-xs uppercase tracking-wider text-muted-foreground">{title}</div>
    <div className="mt-2 font-display text-4xl">{value}</div>
    <div className="text-xs text-muted-foreground">{sub}</div>
  </GlassCard>
);

export default History;
