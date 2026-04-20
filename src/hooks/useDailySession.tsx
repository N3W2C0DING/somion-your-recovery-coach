import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

export type AISessionExercise = {
  name: string;
  sets: number;
  reps: string;
  rest: string;
  note?: string;
};

export type AISession = {
  id: string;
  workout_date: string;
  recovery_label: string;
  focus: string;
  intensity: "high" | "moderate" | "low" | "rest";
  duration_minutes: number;
  completed: boolean;
  exercises: {
    title: string;
    warmup: string[];
    exercises: AISessionExercise[];
    why: string[];
  };
};

type Metrics = {
  readiness?: number;
  sleepScore?: number;
  sleepHours?: number;
  hrv?: number;
  rhr?: number;
  hrvTrend?: number[];
};

type Journal = { soreness?: number; energy?: number; motivation?: number };

export function useDailySession(metrics?: Metrics, journal?: Journal) {
  const { user } = useAuth();
  const [session, setSession] = useState<AISession | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  const today = new Date().toISOString().slice(0, 10);

  const loadCached = useCallback(async () => {
    if (!user) return null;
    const { data } = await supabase
      .from("workouts")
      .select("*")
      .eq("user_id", user.id)
      .eq("workout_date", today)
      .maybeSingle();
    return (data as any) ?? null;
  }, [user, today]);

  const generate = useCallback(
    async (force = false) => {
      if (!user || !metrics) return;
      setGenerating(true);
      try {
        const { data, error } = await supabase.functions.invoke("generate-session", {
          body: { metrics, journal, force },
        });
        if (error) throw error;
        if (data?.error) throw new Error(data.error);
        setSession(data.session as AISession);
        if (force) toast.success("New session generated");
      } catch (e: any) {
        toast.error(e?.message ?? "Could not generate session");
      } finally {
        setGenerating(false);
      }
    },
    [user, metrics, journal],
  );

  useEffect(() => {
    let cancelled = false;
    if (!user || !metrics) {
      setLoading(false);
      return;
    }
    (async () => {
      const cached = await loadCached();
      if (cancelled) return;
      if (cached?.exercises) {
        setSession(cached as AISession);
        setLoading(false);
      } else {
        setLoading(false);
        await generate(false);
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, metrics?.readiness, metrics?.sleepScore]);

  const markComplete = useCallback(async () => {
    if (!session) return;
    const { error } = await supabase
      .from("workouts")
      .update({ completed: true })
      .eq("id", session.id);
    if (error) {
      toast.error("Could not mark complete");
      return;
    }
    setSession({ ...session, completed: true });
    toast.success("Session complete. Rest well tonight.");
  }, [session]);

  return { session, loading, generating, regenerate: () => generate(true), markComplete };
}
