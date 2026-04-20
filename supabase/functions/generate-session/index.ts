import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `You are Somion, a recovery-aware strength & conditioning coach.
You design ONE training session for today, calibrated to the athlete's current readiness, sleep, HRV, soreness, energy, and motivation, AND personalized to their profile (goal, experience, training split, equipment, session length).

Rules:
- If readiness is very low (composite < 40) OR soreness ≥ 8 → prescribe a true rest day (intensity: "rest", empty exercises).
- If readiness is moderate-low → prescribe mobility / Zone 2 (intensity: "low").
- Match the requested session_length when possible (±10 min).
- Respect the user's available equipment. Do not prescribe machines they don't have.
- Keep exercise count reasonable: 4–7 movements for strength, 3–5 for recovery.
- "why" should be 2–4 short, specific bullets explaining the calibration in plain English (reference the actual numbers).
- Use a coaching tone that matches the user's preference (calm, direct, hype).
- Never include preamble. Only call the tool.`;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) return json({ error: "Unauthorized" }, 401);

    const userClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } },
    );
    const { data: claims, error: claimsErr } = await userClient.auth.getClaims(authHeader.replace("Bearer ", ""));
    if (claimsErr || !claims?.claims?.sub) return json({ error: "Unauthorized" }, 401);
    const userId = claims.claims.sub as string;

    const body = await req.json().catch(() => ({}));
    const { metrics, journal, force } = body as {
      metrics?: { readiness?: number; sleepScore?: number; sleepHours?: number; hrv?: number; rhr?: number; hrvTrend?: number[] };
      journal?: { soreness?: number; energy?: number; motivation?: number };
      force?: boolean;
    };

    const admin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const today = new Date().toISOString().slice(0, 10);

    // Cache: return existing workout for today unless force=true
    if (!force) {
      const { data: existing } = await admin
        .from("workouts")
        .select("*")
        .eq("user_id", userId)
        .eq("workout_date", today)
        .maybeSingle();
      if (existing && existing.exercises) {
        return json({ session: existing, cached: true });
      }
    }

    // Load profile for personalization
    const { data: profile } = await admin
      .from("profiles")
      .select("goal, experience, split, equipment, training_days, session_length, coaching_tone, soreness_baseline")
      .eq("user_id", userId)
      .maybeSingle();

    const userPrompt = `Athlete profile:
- Goal: ${profile?.goal ?? "general strength"}
- Experience: ${profile?.experience ?? "intermediate"}
- Split preference: ${profile?.split ?? "upper/lower"}
- Equipment: ${(profile?.equipment ?? ["full gym"]).join(", ")}
- Typical session length: ${profile?.session_length ?? "45 min"}
- Coaching tone: ${profile?.coaching_tone ?? "calm and direct"}

Today's biometrics:
- Readiness: ${metrics?.readiness ?? "unknown"}/100
- Sleep score: ${metrics?.sleepScore ?? "unknown"}/100 (${metrics?.sleepHours ?? "?"}h)
- HRV: ${metrics?.hrv ?? "?"} ms
- Resting HR: ${metrics?.rhr ?? "?"} bpm
${metrics?.hrvTrend?.length ? `- HRV trend (last 7d): ${metrics.hrvTrend.join(", ")} ms` : ""}

Self-report this morning:
- Soreness: ${journal?.soreness ?? 3}/10
- Energy: ${journal?.energy ?? 7}/10
- Motivation: ${journal?.motivation ?? 7}/10

Date: ${today}
Design today's session.`;

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) return json({ error: "AI not configured" }, 500);

    const aiResp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userPrompt },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "prescribe_session",
              description: "Return today's prescribed training session.",
              parameters: {
                type: "object",
                properties: {
                  label: {
                    type: "string",
                    description: "Short headline like 'Primed for Strength' or 'Recovery Should Lead Today'",
                  },
                  intensity: { type: "string", enum: ["high", "moderate", "low", "rest"] },
                  focus: { type: "string", description: "One-line focus, e.g. 'Heavy lower compound'" },
                  title: { type: "string", description: "Session title, e.g. 'Lower — Strength'" },
                  duration_minutes: { type: "number" },
                  warmup: { type: "array", items: { type: "string" }, description: "3–5 short warm-up items" },
                  exercises: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        name: { type: "string" },
                        sets: { type: "number" },
                        reps: { type: "string", description: "e.g. '8-10' or '5 min'" },
                        rest: { type: "string", description: "e.g. '90s'" },
                        note: { type: "string" },
                      },
                      required: ["name", "sets", "reps", "rest"],
                      additionalProperties: false,
                    },
                  },
                  why: {
                    type: "array",
                    items: { type: "string" },
                    description: "2–4 short bullets justifying the calibration",
                  },
                },
                required: ["label", "intensity", "focus", "title", "duration_minutes", "warmup", "exercises", "why"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "prescribe_session" } },
      }),
    });

    if (aiResp.status === 429) return json({ error: "Rate limit. Try again in a moment." }, 429);
    if (aiResp.status === 402) return json({ error: "AI credits exhausted. Add credits in Workspace settings." }, 402);
    if (!aiResp.ok) {
      const t = await aiResp.text();
      console.error("AI gateway error", aiResp.status, t);
      return json({ error: "AI gateway error" }, 502);
    }

    const aiData = await aiResp.json();
    const toolCall = aiData?.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) {
      console.error("No tool call in AI response", JSON.stringify(aiData));
      return json({ error: "AI returned no session" }, 502);
    }
    const args = JSON.parse(toolCall.function.arguments);

    // Persist (upsert by user_id + workout_date)
    const row = {
      user_id: userId,
      workout_date: today,
      focus: args.focus,
      intensity: args.intensity,
      duration_minutes: args.duration_minutes,
      recovery_label: args.label,
      exercises: {
        title: args.title,
        warmup: args.warmup,
        exercises: args.exercises,
        why: args.why,
      },
      completed: false,
    };

    // Try update first, then insert (no unique constraint on (user_id, workout_date))
    const { data: existing2 } = await admin
      .from("workouts")
      .select("id")
      .eq("user_id", userId)
      .eq("workout_date", today)
      .maybeSingle();

    let saved;
    if (existing2?.id) {
      const { data, error } = await admin
        .from("workouts")
        .update(row)
        .eq("id", existing2.id)
        .select()
        .single();
      if (error) return json({ error: error.message }, 500);
      saved = data;
    } else {
      const { data, error } = await admin
        .from("workouts")
        .insert(row)
        .select()
        .single();
      if (error) return json({ error: error.message }, 500);
      saved = data;
    }

    return json({ session: saved, cached: false });
  } catch (err: any) {
    console.error("generate-session error", err);
    return json({ error: err?.message ?? "Unknown error" }, 500);
  }
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
