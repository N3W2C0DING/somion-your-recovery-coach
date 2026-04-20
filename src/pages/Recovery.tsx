import { AppShell } from "@/components/AppShell";
import { GlassCard } from "@/components/GlassCard";
import type { DayMetric } from "@/lib/somion-data";
import { useOuraMetrics } from "@/hooks/useOuraMetrics";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const TrendChart = ({ data, dataKey, color, domain }: { data: DayMetric[]; dataKey: keyof DayMetric; color: string; domain?: [number, number] }) => (
  <div className="h-48 w-full">
    <ResponsiveContainer>
      <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id={`g-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.4} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="2 4" vertical={false} />
        <XAxis dataKey="date" tick={false} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} axisLine={false} tickLine={false} domain={domain || ["dataMin - 5", "dataMax + 5"]} />
        <Tooltip
          contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: 12, fontSize: 12 }}
          labelStyle={{ color: "hsl(var(--muted-foreground))" }}
        />
        <Area type="monotone" dataKey={dataKey as string} stroke={color} strokeWidth={2} fill={`url(#g-${dataKey})`} />
      </AreaChart>
    </ResponsiveContainer>
  </div>
);

const cards = [
  { title: "Readiness", sub: "Composite of HRV, RHR, sleep, and recovery", key: "readiness", color: "hsl(var(--primary))", domain: [40, 100] as [number, number] },
  { title: "Sleep score", sub: "Combined depth, length, and efficiency", key: "sleepScore", color: "hsl(var(--accent))", domain: [50, 100] as [number, number] },
  { title: "Heart rate variability", sub: "Higher HRV usually signals stronger recovery", key: "hrv", color: "hsl(var(--success))" },
  { title: "Resting heart rate", sub: "Lower resting HR generally tracks fitness gains", key: "rhr", color: "hsl(var(--warning))" },
];

const Recovery = () => {
  const { last30, hasRealData } = useOuraMetrics();
  return (
    <AppShell>
      <header className="mb-8 animate-fade-up">
        <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Last 30 days</p>
        <h1 className="mt-1 font-display text-4xl md:text-5xl">Recovery</h1>
        <p className="mt-2 text-muted-foreground">
          {hasRealData ? "Your Oura data, last 30 days." : "Sample data — connect Oura in Settings to see your own."}
        </p>
      </header>

      <div className="grid gap-5 md:grid-cols-2">
        {cards.map(c => (
          <GlassCard key={c.title} className="p-6 animate-fade-up">
            <div className="flex items-baseline justify-between">
              <h3 className="font-display text-2xl">{c.title}</h3>
              <span className="text-xs text-muted-foreground">30d</span>
            </div>
            <p className="text-xs text-muted-foreground">{c.sub}</p>
            <div className="mt-4">
              <TrendChart data={last30} dataKey={c.key as any} color={c.color} domain={c.domain} />
            </div>
          </GlassCard>
        ))}
      </div>
    </AppShell>
  );
};

export default Recovery;
