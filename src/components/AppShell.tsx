import { NavLink, useLocation } from "react-router-dom";
import { Home, Dumbbell, Activity, History, Settings, HeartPulse, Unplug } from "lucide-react";
import { useEffect, useState } from "react";
import { Logo } from "./Logo";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const items = [
  { to: "/app", label: "Today", icon: Home, end: true },
  { to: "/app/train", label: "Train", icon: Dumbbell },
  { to: "/app/recovery", label: "Recovery", icon: Activity },
  { to: "/app/history", label: "History", icon: History },
  { to: "/app/settings", label: "Settings", icon: Settings },
];

export const AppShell = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const { user } = useAuth();
  const current = items.find(i => i.end ? location.pathname === i.to : location.pathname.startsWith(i.to));

  const [ouraStatus, setOuraStatus] = useState<{ connected: boolean; lastSync: string | null }>({ connected: false, lastSync: null });

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    (async () => {
      const { data } = await supabase
        .from("oura_connections")
        .select("last_synced_at")
        .eq("user_id", user.id)
        .maybeSingle();
      if (cancelled) return;
      setOuraStatus({
        connected: !!data,
        lastSync: data?.last_synced_at ?? null,
      });
    })();
    return () => { cancelled = true; };
  }, [user]);

  return (
    <div className="min-h-screen w-full">
      {/* Ambient backdrop */}
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -top-40 left-1/2 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-gradient-glow blur-3xl" />
      </div>

      <div className="mx-auto flex max-w-7xl">
        {/* Desktop sidebar */}
        <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-border/40 bg-sidebar/60 px-5 py-6 backdrop-blur-xl md:flex">
          <Logo />
          <nav className="mt-10 flex flex-col gap-1">
            {items.map(i => (
              <NavLink
                key={i.to}
                to={i.to}
                end={i.end}
                className={({ isActive }) => cn(
                  "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors",
                  isActive
                    ? "bg-secondary text-foreground ring-1 ring-border"
                    : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
                )}
              >
                <i.icon className="h-4 w-4" />
                <span>{i.label}</span>
              </NavLink>
            ))}
          </nav>
          <div className="mt-auto rounded-xl border border-border/60 bg-secondary/40 p-4">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              {ouraStatus.connected ? (
                <HeartPulse className="h-3.5 w-3.5 text-primary" />
              ) : (
                <Unplug className="h-3.5 w-3.5 text-muted-foreground" />
              )}
              {ouraStatus.connected ? "Synced from Oura" : "Oura not connected"}
            </div>
            <div className="mt-1 text-xs text-foreground/80">
              {ouraStatus.connected && ouraStatus.lastSync
                ? `Last sync · ${new Date(ouraStatus.lastSync).toLocaleString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}`
                : ouraStatus.connected
                ? "Connected · awaiting first sync"
                : "Connect in Settings"}
            </div>
          </div>
        </aside>

        {/* Main */}
        <main className="min-h-screen flex-1 px-5 pb-28 pt-6 md:px-10 md:pb-12 md:pt-10">
          <div className="md:hidden mb-4 flex items-center justify-between">
            <Logo />
            <span className="text-xs text-muted-foreground">{current?.label}</span>
          </div>
          {children}
        </main>
      </div>

      {/* Mobile bottom nav */}
      <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-border/40 bg-sidebar/80 backdrop-blur-xl md:hidden">
        <div className="mx-auto flex max-w-md items-center justify-around px-2 py-2">
          {items.map(i => (
            <NavLink
              key={i.to}
              to={i.to}
              end={i.end}
              className={({ isActive }) => cn(
                "flex min-w-[60px] flex-col items-center gap-1 rounded-lg px-3 py-1.5 text-[10px] uppercase tracking-wider transition-colors",
                isActive ? "text-primary" : "text-muted-foreground"
              )}
            >
              <i.icon className="h-5 w-5" />
              {i.label}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
};
