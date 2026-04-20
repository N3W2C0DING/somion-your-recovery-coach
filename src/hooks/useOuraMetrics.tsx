import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { last30 as mockLast30, type DayMetric } from "@/lib/somion-data";

type OuraRow = {
  metric_date: string;
  readiness_score: number | null;
  sleep_score: number | null;
  total_sleep_minutes: number | null;
  hrv_avg: number | null;
  resting_hr: number | null;
};

const isoDay = (offset: number) => {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return d.toISOString().slice(0, 10);
};

export function useOuraMetrics() {
  const { user } = useAuth();
  const [last30, setLast30] = useState<DayMetric[]>(mockLast30);
  const [hasRealData, setHasRealData] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    (async () => {
      const since = isoDay(-29);
      const { data, error } = await supabase
        .from("oura_daily")
        .select("metric_date, readiness_score, sleep_score, total_sleep_minutes, hrv_avg, resting_hr")
        .gte("metric_date", since)
        .order("metric_date", { ascending: true });

      if (cancelled) return;
      if (error || !data || data.length === 0) {
        setLoading(false);
        return;
      }

      const byDate = new Map<string, OuraRow>();
      data.forEach((r: any) => byDate.set(r.metric_date, r));

      // Build 30-day series aligned to today, falling back to mock per-day
      const merged: DayMetric[] = Array.from({ length: 30 }, (_, i) => {
        const date = isoDay(i - 29);
        const row = byDate.get(date);
        const mock = mockLast30[i];
        if (!row) return { ...mock, date };
        return {
          date,
          readiness: row.readiness_score ?? mock.readiness,
          sleepScore: row.sleep_score ?? mock.sleepScore,
          sleepHours: row.total_sleep_minutes
            ? Math.round((row.total_sleep_minutes / 60) * 10) / 10
            : mock.sleepHours,
          hrv: row.hrv_avg ? Math.round(Number(row.hrv_avg)) : mock.hrv,
          rhr: row.resting_hr ?? mock.rhr,
          strainYesterday: mock.strainYesterday,
        };
      });

      setLast30(merged);
      setHasRealData(true);
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [user]);

  return { last30, today: last30[last30.length - 1], hasRealData, loading };
}
