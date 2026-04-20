import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { GlassCard } from "@/components/GlassCard";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Check, Link2, Unlink } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const tones = ["Calm & quiet", "Direct & clear", "Warm & encouraging", "Minimal — just data"] as const;
const goals = ["Build muscle", "Lose fat", "Cardio fitness", "Wellness"] as const;

const Settings = () => {
  const [oura, setOura] = useState(true);
  const [tone, setTone] = useState<typeof tones[number]>("Calm & quiet");
  const [goal, setGoal] = useState<typeof goals[number]>("Build muscle");
  const [morningPing, setMorningPing] = useState(true);
  const [restNudge, setRestNudge] = useState(true);
  const [weeklySummary, setWeeklySummary] = useState(false);

  return (
    <AppShell>
      <header className="mb-8 animate-fade-up">
        <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Account</p>
        <h1 className="mt-1 font-display text-4xl md:text-5xl">Settings</h1>
      </header>

      <div className="grid gap-5 lg:grid-cols-2">
        {/* Profile */}
        <GlassCard className="p-6 animate-fade-up">
          <h3 className="font-display text-2xl">Profile</h3>
          <div className="mt-4 flex items-center gap-4">
            <div className="grid h-14 w-14 place-items-center rounded-full bg-gradient-moon text-xl font-medium text-primary-foreground">A</div>
            <div>
              <div>Alex Carter</div>
              <div className="text-sm text-muted-foreground">alex@somion.app</div>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="mt-4">Edit profile</Button>
        </GlassCard>

        {/* Oura */}
        <GlassCard className={cn("p-6 animate-fade-up", oura && "ring-1 ring-primary/30")}>
          <div className="flex items-center justify-between">
            <h3 className="font-display text-2xl">Oura Ring</h3>
            <span className={cn(
              "rounded-full px-2 py-0.5 text-[10px] uppercase tracking-wider",
              oura ? "bg-success/10 text-success ring-1 ring-success/30" : "bg-muted text-muted-foreground ring-1 ring-border"
            )}>
              {oura ? "Connected" : "Disconnected"}
            </span>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            {oura ? "Last sync · 6 minutes ago" : "Connect your Oura to unlock daily recommendations."}
          </p>
          <Button
            className={cn("mt-4", oura ? "" : "bg-gradient-moon text-primary-foreground hover:opacity-90")}
            variant={oura ? "outline" : "default"}
            onClick={() => {
              setOura(!oura);
              toast(oura ? "Oura disconnected" : "Oura connected");
            }}
          >
            {oura ? <><Unlink className="mr-2 h-4 w-4" /> Disconnect</> : <><Link2 className="mr-2 h-4 w-4" /> Connect Oura</>}
          </Button>
        </GlassCard>

        {/* Goals */}
        <GlassCard className="p-6 animate-fade-up">
          <h3 className="font-display text-2xl">Primary goal</h3>
          <div className="mt-4 grid grid-cols-2 gap-2">
            {goals.map(g => (
              <button
                key={g}
                onClick={() => setGoal(g)}
                className={cn(
                  "flex items-center justify-between rounded-xl border px-3 py-2.5 text-sm transition-all",
                  goal === g ? "border-primary/60 bg-primary/10" : "border-border bg-secondary/40 hover:bg-secondary/70"
                )}
              >
                <span>{g}</span>
                {goal === g && <Check className="h-4 w-4 text-primary" />}
              </button>
            ))}
          </div>
        </GlassCard>

        {/* Coaching tone */}
        <GlassCard className="p-6 animate-fade-up">
          <h3 className="font-display text-2xl">Coaching tone</h3>
          <div className="mt-4 space-y-2">
            {tones.map(t => (
              <button
                key={t}
                onClick={() => setTone(t)}
                className={cn(
                  "flex w-full items-center justify-between rounded-xl border px-3 py-2.5 text-sm transition-all",
                  tone === t ? "border-primary/60 bg-primary/10" : "border-border bg-secondary/40 hover:bg-secondary/70"
                )}
              >
                <span>{t}</span>
                {tone === t && <Check className="h-4 w-4 text-primary" />}
              </button>
            ))}
          </div>
        </GlassCard>

        {/* Notifications */}
        <GlassCard className="p-6 animate-fade-up lg:col-span-2">
          <h3 className="font-display text-2xl">Notifications</h3>
          <div className="mt-4 space-y-4">
            <Toggle id="morning" label="Morning recommendation" desc="A quiet ping when your day's plan is ready." checked={morningPing} onChange={setMorningPing} />
            <Toggle id="rest" label="Rest-day nudge" desc="Encourages recovery on low readiness mornings." checked={restNudge} onChange={setRestNudge} />
            <Toggle id="weekly" label="Weekly summary" desc="A Sunday recap of training and recovery." checked={weeklySummary} onChange={setWeeklySummary} />
          </div>
        </GlassCard>
      </div>
    </AppShell>
  );
};

const Toggle = ({ id, label, desc, checked, onChange }: { id: string; label: string; desc: string; checked: boolean; onChange: (b: boolean) => void }) => (
  <div className="flex items-start justify-between gap-4 border-t border-border/50 pt-4 first:border-t-0 first:pt-0">
    <div>
      <Label htmlFor={id} className="text-sm">{label}</Label>
      <p className="text-xs text-muted-foreground">{desc}</p>
    </div>
    <Switch id={id} checked={checked} onCheckedChange={onChange} />
  </div>
);

export default Settings;
