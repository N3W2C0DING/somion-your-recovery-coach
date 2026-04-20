import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { GlassCard } from "@/components/GlassCard";
import { cn } from "@/lib/utils";
import { Check, Clock, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { recentSessions as mockSessions } from "@/lib/somion-data";

type WorkoutRow = {
  id: string;
  workout_date: string;
  recovery_label: string | null;
  focus: string | null;
  intensity: string | null;
  duration_minutes: number | null;
  completed: boolean;
};

const ranges = [7, 14, 30] as const;

const History = () => {
  const { user } = useAuth();
  const [range, setRange] = useState<(typeof ranges)[number]>(14);
  const [sessions, setSessions] = useState<WorkoutRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasReal, setHasReal] = useState(false);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    (async () => {
      const since = new Date();
      since.setDate(since.getDate() - range);
      const { data, error } = await supabase
        .from("workouts")
        .select("id, workout_date, recovery_label, focus, intensity, duration_minutes, completed")
        .eq("user_id", user.id)
        .gte("workout_date", since.toISOString().slice(0, 10))
        .order("workout_date", { ascending: false });

      if (cancelled) return;
      if (!error && data && data.length > 0) {
        setSessions(data as WorkoutRow[]);
        setHasReal(true);
      }
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [user, range]);

  const completed = hasReal
    ? sessions.filter((s) => s.completed).length
    : Math.round(range * 0.78);
  const total = hasReal ? sessions.length : range;
  const consistency = total > 0 ? Math.round((completed / total) * 100) : 0;

  const displaySessions = hasReal
    ? sessions.map((s) => ({
        date: s.workout_date,
        title: s.recovery_label ?? s.focus ?? "Session",
        duration: s.duration_minutes ?? 0,
        completed: s.completed,
        intensity: s.intensity,
      }))
    : mockSessions.map((s) => ({
        date: s.date,
        title: s.title,
        duration: s.duration,
        completed: true,
        intensity: null,
      }));

  return (
    <AppShell>
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4 animate-fade-up">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Your record</p>
          <h1 className="mt-1 font-display text-4xl md:text-5xl">History</h1>
          <p className="mt-2 text-xs text-muted-foreground">
            {hasReal ? "From your saved workouts" : "Sample data — complete sessions to build history"}
          </p>
        </div>
        <div className="inline-flex rounded-full border border-border bg-secondary/40 p-1">
          {ranges.map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={cn(
                "rounded-full px-4 py-1.5 text-xs uppercase tracking-wider transition-colors",
                range === r
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {r} days
            </button>
          ))}
        </div>
      </header>

      <div className="grid gap-5 md:grid-cols-3">
        <Stat title="Completed sessions" value={`${completed}`} sub={`of ${total} planned`} />
        <Stat title="Consistency" value={`${consistency}%`} sub="Earned, not enforced" />
        <Stat
          title="Data source"
          value={hasReal ? "Live" : "Sample"}
          sub={hasReal ? "From Supabase workouts table" : "Mock data fallback"}
        />
      </div>

      {loading ? (
        <div className="mt-12 flex items-center justify-center gap-2 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
          <span className="text-sm">Loading history…</span>
        </div>
      ) : (
        <GlassCard className="mt-6 p-6 animate-fade-up">
          <h3 className="font-display text-2xl">Recent sessions</h3>
          {displaySessions.length === 0 ? (
            <p className="mt-4 text-sm text-muted-foreground">
              No sessions in this window yet. Complete a workout to start building your history.
            </p>
          ) : (
            <div className="mt-4 divide-y divide-border/50 overflow-hidden rounded-xl border border-border/60">
              {displaySessions.map((s, i) => (
                <div
                  key={`${s.date}-${i}`}
                  className="flex items-center justify-between gap-4 px-4 py-3 text-sm"
                >
                  <div className="flex items-center gap-3">
                    <div className="grid h-8 w-8 place-items-center rounded-full bg-primary/10 ring-1 ring-primary/20">
                      {s.completed ? (
                        <Check className="h-4 w-4 text-primary" />
                      ) : (
                        <Clock className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                    <div>
                      <div>{s.title}</div>
                      <div className="text-xs text-muted-foreground">
                        {s.date} · {s.duration > 0 ? `${s.duration} min` : "Recovery"}
                      </div>
                    </div>
                  </div>
                  <div className="text-right text-xs">
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5",
                        s.completed
                          ? "bg-success/10 text-success ring-1 ring-success/30"
                          : "bg-muted text-muted-foreground ring-1 ring-border",
                      )}
                    >
                      {s.completed ? "Done" : "Skipped"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </GlassCard>
      )}
    </AppShell>
  );
};

const Stat = ({
  title,
  value,
  sub,
}: {
  title: string;
  value: string;
  sub: string;
}) => (
  <GlassCard className="p-6 animate-fade-up">
    <div className="text-xs uppercase tracking-wider text-muted-foreground">{title}</div>
    <div className="mt-2 font-display text-4xl">{value}</div>
    <div className="text-xs text-muted-foreground">{sub}</div>
  </GlassCard>
);

export default History;
