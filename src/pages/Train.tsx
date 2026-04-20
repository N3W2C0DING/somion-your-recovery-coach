import { useState, useMemo } from "react";
import { AppShell } from "@/components/AppShell";
import { GlassCard } from "@/components/GlassCard";
import { Button } from "@/components/ui/button";
import { Clock, Flame, Repeat, Shuffle, Check, Zap, Loader2, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useOuraMetrics } from "@/hooks/useOuraMetrics";
import { useDailySession } from "@/hooks/useDailySession";

const Train = () => {
  const { today: todayMetric, last30 } = useOuraMetrics();
  const metrics = useMemo(
    () => ({
      readiness: todayMetric.readiness,
      sleepScore: todayMetric.sleepScore,
      sleepHours: todayMetric.sleepHours,
      hrv: todayMetric.hrv,
      rhr: todayMetric.rhr,
      hrvTrend: last30.slice(-7).map((d) => d.hrv),
    }),
    [todayMetric, last30],
  );

  const { session, loading, generating, regenerate, markComplete } = useDailySession(metrics);
  const [shortened, setShortened] = useState(false);
  const [completed, setCompleted] = useState<Set<number>>(new Set());

  const toggleDone = (i: number) => {
    const next = new Set(completed);
    next.has(i) ? next.delete(i) : next.add(i);
    setCompleted(next);
  };

  if (loading || (!session && generating)) {
    return (
      <AppShell>
        <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 text-muted-foreground">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <p className="text-sm">Designing today's session…</p>
        </div>
      </AppShell>
    );
  }

  if (!session) {
    return (
      <AppShell>
        <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
          <p className="text-muted-foreground">No session yet.</p>
          <Button onClick={() => regenerate()} disabled={generating}>
            <Sparkles className="mr-2 h-4 w-4" /> Generate today's session
          </Button>
        </div>
      </AppShell>
    );
  }

  const detail = session.exercises;
  const duration = shortened
    ? Math.max(15, Math.round(session.duration_minutes * 0.65))
    : session.duration_minutes;
  const intensityLabel =
    session.intensity === "high"
      ? "High"
      : session.intensity === "moderate"
      ? "Moderate"
      : session.intensity === "low"
      ? "Low"
      : "Rest";

  return (
    <AppShell>
      <header className="mb-8 animate-fade-up">
        <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Today's session</p>
        <h1 className="mt-1 font-display text-4xl md:text-5xl">{detail.title}</h1>
        <p className="mt-2 text-muted-foreground">{session.recovery_label} · {session.focus}</p>
      </header>

      <div className="grid gap-5 lg:grid-cols-3">
        <GlassCard strong className="lg:col-span-2 p-6 animate-fade-up">
          <div className="grid grid-cols-3 gap-4 border-b border-border/50 pb-5">
            <Stat icon={Clock} label="Duration" value={`${duration} min`} />
            <Stat icon={Flame} label="Intensity" value={intensityLabel} />
            <Stat icon={Zap} label="Focus" value={session.focus.split(" ")[0]} />
          </div>

          {detail.exercises.length === 0 ? (
            <div className="py-12 text-center">
              <h3 className="font-display text-2xl">No training today</h3>
              <p className="mt-2 text-muted-foreground">Your body is asking for a full reset. Honor that.</p>
            </div>
          ) : (
            <>
              <div className="mt-5">
                <div className="text-xs uppercase tracking-wider text-muted-foreground">Warm-up</div>
                <ul className="mt-2 space-y-1 text-sm text-foreground/85">
                  {detail.warmup.map((w) => (
                    <li key={w} className="flex items-start gap-2">
                      <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-primary" /> {w}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6">
                <div className="text-xs uppercase tracking-wider text-muted-foreground">Workout</div>
                <div className="mt-3 divide-y divide-border/50 overflow-hidden rounded-xl border border-border/60">
                  {detail.exercises.map((ex, i) => {
                    const done = completed.has(i);
                    return (
                      <button
                        key={`${ex.name}-${i}`}
                        onClick={() => toggleDone(i)}
                        className={cn(
                          "flex w-full items-center justify-between gap-4 px-4 py-3 text-left transition-colors",
                          done ? "bg-primary/5" : "hover:bg-secondary/40",
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={cn(
                              "grid h-7 w-7 shrink-0 place-items-center rounded-full border text-xs",
                              done
                                ? "border-primary bg-primary text-primary-foreground"
                                : "border-border text-muted-foreground",
                            )}
                          >
                            {done ? <Check className="h-3.5 w-3.5" /> : i + 1}
                          </div>
                          <div>
                            <div className={cn("text-sm", done && "line-through opacity-60")}>{ex.name}</div>
                            {ex.note && <div className="text-xs text-muted-foreground">{ex.note}</div>}
                          </div>
                        </div>
                        <div className="text-right text-xs text-muted-foreground">
                          <div className="text-foreground">
                            {ex.sets} × {ex.reps}
                          </div>
                          <div>rest {ex.rest}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </GlassCard>

        <div className="space-y-5">
          <GlassCard className="p-6 animate-fade-up">
            <div className="text-xs uppercase tracking-wider text-muted-foreground">Why today</div>
            <ul className="mt-3 space-y-2 text-sm text-foreground/85">
              {detail.why.map((w, i) => (
                <li key={i} className="flex items-start gap-2">
                  <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                  <span>{w}</span>
                </li>
              ))}
            </ul>
          </GlassCard>

          <GlassCard className="p-6 animate-fade-up">
            <div className="text-xs uppercase tracking-wider text-muted-foreground">Adjust</div>
            <div className="mt-3 space-y-2">
              <Button variant="ghost" className="w-full justify-start" onClick={() => setShortened((s) => !s)}>
                <Clock className="mr-2 h-4 w-4" /> {shortened ? "Use full session" : "Shorten by 35%"}
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => regenerate()}
                disabled={generating}
              >
                {generating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Shuffle className="mr-2 h-4 w-4" />}
                {generating ? "Regenerating…" : "Regenerate session"}
              </Button>
              <Button variant="ghost" className="w-full justify-start" onClick={() => toast("Saved as alternative")}>
                <Repeat className="mr-2 h-4 w-4" /> Save as alternative
              </Button>
            </div>
          </GlassCard>

          <Button
            className="w-full bg-gradient-moon text-primary-foreground shadow-glow hover:opacity-90"
            size="lg"
            onClick={markComplete}
            disabled={session.completed}
          >
            {session.completed ? "Completed ✓" : "Mark session complete"}
          </Button>
        </div>
      </div>
    </AppShell>
  );
};

const Stat = ({ icon: Icon, label, value }: { icon: any; label: string; value: string }) => (
  <div>
    <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-muted-foreground">
      <Icon className="h-3 w-3" /> {label}
    </div>
    <div className="mt-1 font-display text-2xl">{value}</div>
  </div>
);

export default Train;
