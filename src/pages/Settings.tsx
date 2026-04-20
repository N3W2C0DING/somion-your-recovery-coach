import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppShell } from "@/components/AppShell";
import { GlassCard } from "@/components/GlassCard";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Check, Link2, Unlink, LogOut, ExternalLink, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const tones = ["Calm & quiet", "Direct & clear", "Warm & encouraging", "Minimal — just the data"] as const;
const goals = ["Build muscle", "Lose fat", "Cardio fitness", "Wellness & longevity"] as const;

const Settings = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [tone, setTone] = useState<string>("Calm & quiet");
  const [goal, setGoal] = useState<string>("Build muscle");
  const [morningPing, setMorningPing] = useState(true);
  const [restNudge, setRestNudge] = useState(true);
  const [weeklySummary, setWeeklySummary] = useState(false);

  // Oura state
  const [ouraConnected, setOuraConnected] = useState(false);
  const [lastSync, setLastSync] = useState<string | null>(null);
  const [token, setToken] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();
      if (data) {
        setProfile(data);
        if (data.coaching_tone) setTone(data.coaching_tone);
        if (data.goal) setGoal(data.goal);
      }
      const { data: conn } = await supabase
        .from("oura_connections")
        .select("connected_at, last_synced_at")
        .eq("user_id", user.id)
        .maybeSingle();
      setOuraConnected(!!conn);
      setLastSync(conn?.last_synced_at ?? null);
    })();
  }, [user]);

  const saveTone = async (next: string) => {
    setTone(next);
    if (user) await supabase.from("profiles").update({ coaching_tone: next }).eq("user_id", user.id);
  };
  const saveGoal = async (next: string) => {
    setGoal(next);
    if (user) await supabase.from("profiles").update({ goal: next }).eq("user_id", user.id);
  };

  const connectOura = async () => {
    if (!token.trim()) {
      toast.error("Paste your Oura Personal Access Token first");
      return;
    }
    setBusy(true);
    try {
      const { data, error } = await supabase.functions.invoke("oura-sync", {
        body: { token: token.trim() },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      toast.success(`Oura connected · ${data.days_synced ?? 0} days synced`);
      setOuraConnected(true);
      setLastSync(new Date().toISOString());
      setToken("");
    } catch (err: any) {
      toast.error(err.message ?? "Could not connect Oura");
    } finally {
      setBusy(false);
    }
  };

  const resync = async () => {
    setBusy(true);
    try {
      const { data, error } = await supabase.functions.invoke("oura-sync", { body: {} });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      toast.success(`Synced · ${data.days_synced ?? 0} days`);
      setLastSync(new Date().toISOString());
    } catch (err: any) {
      toast.error(err.message ?? "Sync failed");
    } finally {
      setBusy(false);
    }
  };

  const disconnectOura = async () => {
    setBusy(true);
    try {
      const { error } = await supabase.functions.invoke("oura-disconnect", { body: {} });
      if (error) throw error;
      setOuraConnected(false);
      setLastSync(null);
      toast("Oura disconnected");
    } catch (err: any) {
      toast.error(err.message ?? "Could not disconnect");
    } finally {
      setBusy(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const initial = (profile?.display_name ?? user?.email ?? "?").charAt(0).toUpperCase();

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
            <div className="grid h-14 w-14 place-items-center rounded-full bg-gradient-moon text-xl font-medium text-primary-foreground">
              {initial}
            </div>
            <div>
              <div>{profile?.display_name ?? "—"}</div>
              <div className="text-sm text-muted-foreground">{user?.email}</div>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="mt-4" onClick={handleSignOut}>
            <LogOut className="mr-2 h-4 w-4" /> Sign out
          </Button>
        </GlassCard>

        {/* Oura */}
        <GlassCard className={cn("p-6 animate-fade-up", ouraConnected && "ring-1 ring-primary/30")}>
          <div className="flex items-center justify-between">
            <h3 className="font-display text-2xl">Oura Ring</h3>
            <span className={cn(
              "rounded-full px-2 py-0.5 text-[10px] uppercase tracking-wider",
              ouraConnected ? "bg-success/10 text-success ring-1 ring-success/30" : "bg-muted text-muted-foreground ring-1 ring-border"
            )}>
              {ouraConnected ? "Connected" : "Disconnected"}
            </span>
          </div>

          {ouraConnected ? (
            <>
              <p className="mt-2 text-sm text-muted-foreground">
                {lastSync ? `Last sync · ${new Date(lastSync).toLocaleString()}` : "Connected · awaiting first sync"}
              </p>
              <div className="mt-4 flex gap-2">
                <Button variant="outline" size="sm" onClick={resync} disabled={busy}>
                  <RefreshCw className={cn("mr-2 h-4 w-4", busy && "animate-spin")} /> Sync now
                </Button>
                <Button variant="ghost" size="sm" onClick={disconnectOura} disabled={busy}>
                  <Unlink className="mr-2 h-4 w-4" /> Disconnect
                </Button>
              </div>
            </>
          ) : (
            <>
              <p className="mt-2 text-sm text-muted-foreground">
                Paste your Oura Personal Access Token. It's stored securely server-side and never exposed to the browser.
              </p>
              <a
                href="https://cloud.ouraring.com/personal-access-tokens"
                target="_blank"
                rel="noreferrer"
                className="mt-2 inline-flex items-center gap-1 text-xs text-primary hover:underline"
              >
                Generate a token <ExternalLink className="h-3 w-3" />
              </a>
              <div className="mt-3 space-y-2">
                <Label htmlFor="oura-token" className="text-xs">Personal Access Token</Label>
                <Input
                  id="oura-token"
                  type="password"
                  placeholder="OURA_..."
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                />
                <Button
                  className="bg-gradient-moon text-primary-foreground hover:opacity-90"
                  onClick={connectOura}
                  disabled={busy}
                >
                  <Link2 className="mr-2 h-4 w-4" /> {busy ? "Connecting…" : "Connect Oura"}
                </Button>
              </div>
            </>
          )}
        </GlassCard>

        {/* Goals */}
        <GlassCard className="p-6 animate-fade-up">
          <h3 className="font-display text-2xl">Primary goal</h3>
          <div className="mt-4 grid grid-cols-2 gap-2">
            {goals.map(g => (
              <button
                key={g}
                onClick={() => saveGoal(g)}
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
                onClick={() => saveTone(t)}
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
