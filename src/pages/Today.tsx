import { Link } from "react-router-dom";
import { ArrowRight, BedDouble, Heart, Activity, Flame, Check, Circle } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { GlassCard } from "@/components/GlassCard";
import { ScoreRing } from "@/components/ScoreRing";
import { Button } from "@/components/ui/button";
import { sorenessToday, getRecommendation, weeklyPlan } from "@/lib/somion-data";
import { LineChart, Line, ResponsiveContainer, YAxis } from "recharts";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useOuraMetrics } from "@/hooks/useOuraMetrics";

const Today = () => {
  const { last30, today: todayMetric, hasRealData } = useOuraMetrics();
  const rec = getRecommendation(todayMetric, sorenessToday);
  const [soreness, setSoreness] = useState(sorenessToday);
  const [energy, setEnergy] = useState(7);
  const [motivation, setMotivation] = useState(7);

  const trend = last30.slice(-14).map(d => ({ v: d.readiness }));

  return (
    <AppShell>
      <header className="mb-8 animate-fade-up">
        <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
          {new Date().toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })}
        </p>
        <h1 className="mt-1 font-display text-4xl md:text-5xl">{(() => {
          const h = new Date().getHours();
          if (h < 5) return "Good night.";
          if (h < 12) return "Good morning.";
          if (h < 17) return "Good afternoon.";
          if (h < 22) return "Good evening.";
          return "Good night.";
        })()}</h1>
        <p className="mt-2 text-xs text-muted-foreground">
          {hasRealData ? "Live Oura data" : "Sample data — connect Oura in Settings"}
        </p>
      </header>

      <div className="grid gap-5 lg:grid-cols-3">
        {/* Recommendation hero */}
        <GlassCard strong className="lg:col-span-2 p-7 md:p-9 animate-fade-up">
          <div className="flex items-center gap-2">
            <span className={cn("inline-block h-2 w-2 rounded-full", rec.intensity === "high" ? "bg-success" : rec.intensity === "moderate" ? "bg-primary" : rec.intensity === "low" ? "bg-warning" : "bg-danger")} />
            <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Today's recommendation</span>
          </div>
          <h2 className={cn("mt-3 font-display text-4xl md:text-5xl", rec.accent)}>{rec.label}</h2>
          <p className="mt-2 max-w-md text-muted-foreground">{rec.focus} · ~{rec.durationMin} min</p>

          <div className="mt-6 grid gap-2 text-sm text-foreground/80">
            <div className="text-xs uppercase tracking-wider text-muted-foreground">Why this recommendation</div>
            {rec.why.map((w, i) => (
              <div key={i} className="flex items-start gap-2">
                <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                <span>{w}</span>
              </div>
            ))}
          </div>

          <Button asChild className="mt-7 bg-gradient-moon text-primary-foreground hover:opacity-90">
            <Link to="/app/train">See today's session <ArrowRight className="ml-1 h-4 w-4" /></Link>
          </Button>
        </GlassCard>

        {/* Readiness ring */}
        <GlassCard className="flex flex-col items-center p-7 animate-fade-up" >
          <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Readiness</span>
          <ScoreRing value={todayMetric.readiness} size={170} sublabel={todayMetric.readiness >= 80 ? "Above baseline" : "Within range"} className="mt-3" />
          <div className="mt-5 h-12 w-full">
            <ResponsiveContainer>
              <LineChart data={trend}>
                <YAxis hide domain={["dataMin - 5", "dataMax + 5"]} />
                <Line type="monotone" dataKey="v" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">14-day trend</div>
        </GlassCard>

        {/* Sleep summary */}
        <GlassCard className="p-6 animate-fade-up">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Sleep</span>
            <BedDouble className="h-4 w-4 text-primary" />
          </div>
          <div className="mt-3 flex items-end gap-2">
            <span className="font-display text-4xl">{todayMetric.sleepHours}</span>
            <span className="mb-1 text-sm text-muted-foreground">hours</span>
          </div>
          <div className="mt-1 text-sm text-foreground/80">Score {todayMetric.sleepScore}/100</div>
          <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
            <Mini k="Deep" v="1h 22m" />
            <Mini k="REM" v="1h 48m" />
            <Mini k="Eff." v="92%" />
          </div>
        </GlassCard>

        {/* HRV / RHR */}
        <GlassCard className="p-6 animate-fade-up">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Heart</span>
            <Heart className="h-4 w-4 text-primary" />
          </div>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">HRV</div>
              <div className="font-display text-3xl">{todayMetric.hrv}<span className="text-sm text-muted-foreground"> ms</span></div>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Resting HR</div>
              <div className="font-display text-3xl">{todayMetric.rhr}<span className="text-sm text-muted-foreground"> bpm</span></div>
            </div>
          </div>
          <div className="mt-4 h-12">
            <ResponsiveContainer>
              <LineChart data={last30.slice(-14).map(d => ({ v: d.hrv }))}>
                <YAxis hide domain={["dataMin - 5", "dataMax + 5"]} />
                <Line type="monotone" dataKey="v" stroke="hsl(var(--accent))" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* Recovery trend */}
        <GlassCard className="p-6 animate-fade-up">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Recovery trend</span>
            <Activity className="h-4 w-4 text-primary" />
          </div>
          <div className="mt-2 text-sm text-foreground/80">Trending up · last 7 days</div>
          <div className="mt-2 h-24">
            <ResponsiveContainer>
              <LineChart data={last30.slice(-14).map(d => ({ v: d.readiness }))}>
                <YAxis hide domain={[40, 100]} />
                <Line type="monotone" dataKey="v" stroke="hsl(var(--success))" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* Journal check-in */}
        <GlassCard className="lg:col-span-2 p-6 animate-fade-up">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Morning check-in</span>
            <Flame className="h-4 w-4 text-primary" />
          </div>
          <p className="mt-1 text-sm text-muted-foreground">Three quick reads. We'll fold them into today's plan.</p>

          <div className="mt-5 space-y-5">
            <Slider label="Soreness" value={soreness} onChange={setSoreness} hint={soreness >= 7 ? "Significant" : soreness >= 4 ? "Mild" : "Minimal"} />
            <Slider label="Energy" value={energy} onChange={setEnergy} hint={energy >= 7 ? "Sharp" : energy >= 4 ? "Steady" : "Foggy"} />
            <Slider label="Motivation" value={motivation} onChange={setMotivation} hint={motivation >= 7 ? "Eager" : motivation >= 4 ? "Willing" : "Reluctant"} />
          </div>
        </GlassCard>

        {/* Weekly plan */}
        <GlassCard className="p-6 animate-fade-up lg:col-span-3">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">This week</span>
            <span className="text-xs text-muted-foreground">Adjusts daily</span>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7">
            {weeklyPlan.map(d => (
              <div
                key={d.day}
                className={cn(
                  "rounded-xl border p-3 text-sm transition-colors",
                  d.status === "today" ? "border-primary/50 bg-primary/10" : "border-border bg-secondary/30"
                )}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-wider text-muted-foreground">{d.day}</span>
                  {d.status === "done" ? <Check className="h-3.5 w-3.5 text-success" /> : <Circle className="h-3 w-3 text-muted-foreground" />}
                </div>
                <div className="mt-1 text-foreground">{d.focus}</div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </AppShell>
  );
};

const Mini = ({ k, v }: { k: string; v: string }) => (
  <div className="rounded-lg border border-border/60 bg-secondary/30 p-2 text-center">
    <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{k}</div>
    <div className="text-sm">{v}</div>
  </div>
);

const Slider = ({ label, value, onChange, hint }: { label: string; value: number; onChange: (n: number) => void; hint: string }) => (
  <div>
    <div className="flex items-center justify-between text-sm">
      <span>{label}</span>
      <span className="text-muted-foreground">{value}/10 · {hint}</span>
    </div>
    <input
      type="range"
      min={0}
      max={10}
      value={value}
      onChange={(e) => onChange(parseInt(e.target.value))}
      className="mt-2 w-full accent-[hsl(var(--primary))]"
    />
  </div>
);

export default Today;
