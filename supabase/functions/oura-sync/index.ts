import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface OuraDailyReadiness {
  day: string;
  score: number | null;
}
interface OuraSleep {
  day: string;
  score: number | null;
  total_sleep_duration: number | null;
  average_hrv: number | null;
  average_heart_rate: number | null;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return json({ error: "Unauthorized" }, 401);
    }

    // User-scoped client to validate the JWT
    const userClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } },
    );
    const { data: claims, error: claimsErr } = await userClient.auth.getClaims(authHeader.replace("Bearer ", ""));
    if (claimsErr || !claims?.claims?.sub) return json({ error: "Unauthorized" }, 401);
    const userId = claims.claims.sub as string;

    // Body: optional { token } to save+sync; otherwise just sync existing token
    let saveToken: string | null = null;
    if (req.method === "POST") {
      try {
        const body = await req.json();
        if (typeof body?.token === "string" && body.token.trim().length > 10) {
          saveToken = body.token.trim();
        }
      } catch { /* no body */ }
    }

    // Service-role client for token storage + writes
    const admin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    if (saveToken) {
      const { error: upErr } = await admin
        .from("oura_connections")
        .upsert({
          user_id: userId,
          access_token: saveToken,
          token_type: "personal",
          connected_at: new Date().toISOString(),
        }, { onConflict: "user_id" });
      if (upErr) return json({ error: `Failed to save token: ${upErr.message}` }, 500);
    }

    // Fetch the user's token
    const { data: conn, error: connErr } = await admin
      .from("oura_connections")
      .select("access_token")
      .eq("user_id", userId)
      .maybeSingle();
    if (connErr) return json({ error: connErr.message }, 500);
    if (!conn?.access_token) return json({ error: "No Oura token connected" }, 400);

    const token = conn.access_token;
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - 30);
    const fmt = (d: Date) => d.toISOString().slice(0, 10);
    const qs = `start_date=${fmt(start)}&end_date=${fmt(end)}`;

    const headers = { Authorization: `Bearer ${token}` };

    const [readinessRes, sleepRes] = await Promise.all([
      fetch(`https://api.ouraring.com/v2/usercollection/daily_readiness?${qs}`, { headers }),
      fetch(`https://api.ouraring.com/v2/usercollection/daily_sleep?${qs}`, { headers }),
    ]);

    if (readinessRes.status === 401 || sleepRes.status === 401) {
      return json({ error: "Oura rejected the token. Please reconnect with a valid Personal Access Token." }, 401);
    }
    if (!readinessRes.ok) return json({ error: `Oura readiness ${readinessRes.status}` }, 502);
    if (!sleepRes.ok) return json({ error: `Oura sleep ${sleepRes.status}` }, 502);

    const readinessData = await readinessRes.json();
    const sleepData = await sleepRes.json();

    const byDay = new Map<string, any>();
    for (const r of (readinessData.data ?? []) as OuraDailyReadiness[]) {
      byDay.set(r.day, { ...byDay.get(r.day), readiness_score: r.score, day: r.day });
    }
    for (const s of (sleepData.data ?? []) as any[]) {
      const cur = byDay.get(s.day) ?? { day: s.day };
      cur.sleep_score = s.score ?? null;
      cur.total_sleep_minutes = s.total_sleep_duration ? Math.round(s.total_sleep_duration / 60) : null;
      cur.hrv_avg = s.average_hrv ?? null;
      cur.resting_hr = s.average_heart_rate ?? null;
      byDay.set(s.day, cur);
    }

    const rows = [...byDay.values()].map((r) => ({
      user_id: userId,
      metric_date: r.day,
      readiness_score: r.readiness_score ?? null,
      sleep_score: r.sleep_score ?? null,
      total_sleep_minutes: r.total_sleep_minutes ?? null,
      hrv_avg: r.hrv_avg ?? null,
      resting_hr: r.resting_hr ?? null,
      raw: r,
    }));

    if (rows.length) {
      const { error: insErr } = await admin
        .from("oura_daily")
        .upsert(rows, { onConflict: "user_id,metric_date" });
      if (insErr) return json({ error: insErr.message }, 500);
    }

    await admin
      .from("oura_connections")
      .update({ last_synced_at: new Date().toISOString() })
      .eq("user_id", userId);

    return json({ ok: true, days_synced: rows.length });
  } catch (err: any) {
    console.error("oura-sync error", err);
    return json({ error: err?.message ?? "Unknown error" }, 500);
  }
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
