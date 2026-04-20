// Mock recovery data + recommendation engine for Somion MVP.

export type RecoveryLabel =
  | "Primed for Strength"
  | "Good Day to Train"
  | "Train, but Keep It Moderate"
  | "Lower the Intensity Today"
  | "Recovery Should Lead Today"
  | "Light Movement Only"
  | "Rest Without Guilt";

export type DayMetric = {
  date: string; // ISO
  readiness: number; // 0-100
  sleepScore: number; // 0-100
  sleepHours: number;
  hrv: number; // ms
  rhr: number; // bpm
  strainYesterday: number; // 0-21
};

export type Recommendation = {
  label: RecoveryLabel;
  intensity: "high" | "moderate" | "low" | "rest";
  focus: string;
  durationMin: number;
  why: string[];
  accent: string; // tailwind class
};

export type Exercise = {
  name: string;
  sets: number;
  reps: string;
  rest: string;
  note?: string;
};

export type Workout = {
  title: string;
  type: string;
  durationMin: number;
  warmup: string[];
  exercises: Exercise[];
};

const today = new Date();
const isoDay = (offset: number) => {
  const d = new Date(today);
  d.setDate(d.getDate() + offset);
  return d.toISOString().slice(0, 10);
};

// Realistic 30-day mock series (slight wave + noise)
function gen(base: number, amp: number, seed: number) {
  return Array.from({ length: 30 }, (_, i) => {
    const v = base + Math.sin((i + seed) / 3.2) * amp + (Math.cos(i * 1.7 + seed) * amp * 0.4);
    return Math.round(v * 10) / 10;
  });
}

const readinessSeries = gen(78, 10, 1);
const sleepScoreSeries = gen(82, 8, 3);
const hrvSeries = gen(58, 14, 2);
const rhrSeries = gen(56, 5, 4).map(v => Math.round(v));

export const last30: DayMetric[] = Array.from({ length: 30 }, (_, i) => ({
  date: isoDay(i - 29),
  readiness: Math.round(readinessSeries[i]),
  sleepScore: Math.round(sleepScoreSeries[i]),
  sleepHours: Math.round((6.5 + Math.sin(i / 4) * 1.1 + Math.random() * 0.4) * 10) / 10,
  hrv: Math.round(hrvSeries[i]),
  rhr: rhrSeries[i],
  strainYesterday: Math.round((9 + Math.cos(i / 2.5) * 4) * 10) / 10,
}));

export const todayMetric = last30[last30.length - 1];

// Soreness reported by user 0-10 (mocked)
export const sorenessToday = 3;

export function getRecommendation(m: DayMetric, soreness: number): Recommendation {
  const r = m.readiness;
  const sleep = m.sleepScore;
  const strain = m.strainYesterday;

  // Composite penalties
  const sorenessPenalty = soreness >= 7 ? 12 : soreness >= 5 ? 6 : 0;
  const strainPenalty = strain >= 15 ? 10 : strain >= 12 ? 5 : 0;
  const score = r - sorenessPenalty - strainPenalty - (sleep < 60 ? 8 : 0);

  const why: string[] = [];
  why.push(`Readiness ${r} (${r >= 85 ? "excellent" : r >= 75 ? "strong" : r >= 65 ? "moderate" : "below baseline"})`);
  why.push(`Sleep score ${sleep} • ${m.sleepHours}h in bed`);
  why.push(`HRV ${m.hrv}ms • resting HR ${m.rhr}bpm`);
  if (strain >= 12) why.push(`Yesterday's strain was elevated (${strain}/21)`);
  if (soreness >= 5) why.push(`You reported notable soreness today (${soreness}/10)`);

  if (score >= 88) return { label: "Primed for Strength", intensity: "high", focus: "Heavy compound lift", durationMin: 60, why, accent: "text-success" };
  if (score >= 78) return { label: "Good Day to Train", intensity: "high", focus: "Full strength session", durationMin: 55, why, accent: "text-success" };
  if (score >= 68) return { label: "Train, but Keep It Moderate", intensity: "moderate", focus: "Hypertrophy, controlled load", durationMin: 45, why, accent: "text-primary" };
  if (score >= 58) return { label: "Lower the Intensity Today", intensity: "moderate", focus: "Lighter volume, technique focus", durationMin: 40, why, accent: "text-primary" };
  if (score >= 48) return { label: "Recovery Should Lead Today", intensity: "low", focus: "Mobility + zone 2", durationMin: 30, why, accent: "text-warning" };
  if (score >= 38) return { label: "Light Movement Only", intensity: "low", focus: "Walk, stretch, breathe", durationMin: 25, why, accent: "text-warning" };
  return { label: "Rest Without Guilt", intensity: "rest", focus: "Full recovery day", durationMin: 0, why, accent: "text-danger" };
}

export function getWorkout(rec: Recommendation): Workout {
  if (rec.intensity === "rest") {
    return {
      title: "Recovery Day",
      type: "Rest",
      durationMin: 0,
      warmup: ["Optional 10–15 min easy walk", "5 min nasal breathing"],
      exercises: [],
    };
  }
  if (rec.intensity === "low") {
    return {
      title: "Restorative Flow",
      type: "Mobility + Zone 2",
      durationMin: rec.durationMin,
      warmup: ["3 min joint circles", "5 min easy bike or walk"],
      exercises: [
        { name: "Zone 2 cardio", sets: 1, reps: "20 min @ nasal pace", rest: "—" },
        { name: "Hip 90/90", sets: 2, reps: "8 / side", rest: "30s" },
        { name: "Thoracic openers", sets: 2, reps: "10", rest: "30s" },
        { name: "Box breathing", sets: 1, reps: "5 min", rest: "—" },
      ],
    };
  }
  if (rec.intensity === "moderate") {
    return {
      title: "Push — Moderate",
      type: "Upper body, controlled",
      durationMin: rec.durationMin,
      warmup: ["5 min row", "Band pull-aparts 2×15", "Scap push-ups 2×10"],
      exercises: [
        { name: "Incline DB Press", sets: 4, reps: "8–10", rest: "90s", note: "Stop 2 reps in reserve" },
        { name: "Seated Row", sets: 4, reps: "10", rest: "75s" },
        { name: "Overhead Press", sets: 3, reps: "8", rest: "90s" },
        { name: "Lateral Raise", sets: 3, reps: "12–15", rest: "45s" },
        { name: "Triceps Pushdown", sets: 3, reps: "12", rest: "45s" },
      ],
    };
  }
  return {
    title: "Lower — Strength",
    type: "Heavy compound",
    durationMin: rec.durationMin,
    warmup: ["5 min bike", "Goblet squat 2×8", "Hip airplane 2×6/side"],
    exercises: [
      { name: "Back Squat", sets: 5, reps: "5", rest: "2:30", note: "Top set @ RPE 8" },
      { name: "Romanian Deadlift", sets: 4, reps: "6", rest: "2:00" },
      { name: "Walking Lunge", sets: 3, reps: "10 / leg", rest: "75s" },
      { name: "Standing Calf Raise", sets: 3, reps: "12", rest: "45s" },
      { name: "Hanging Knee Raise", sets: 3, reps: "10", rest: "60s" },
    ],
  };
}

export const weeklyPlan = [
  { day: "Mon", focus: "Lower — Strength", status: "done" as const },
  { day: "Tue", focus: "Push — Moderate", status: "done" as const },
  { day: "Wed", focus: "Recovery", status: "done" as const },
  { day: "Thu", focus: "Pull — Strength", status: "today" as const },
  { day: "Fri", focus: "Conditioning", status: "upcoming" as const },
  { day: "Sat", focus: "Full Body", status: "upcoming" as const },
  { day: "Sun", focus: "Rest", status: "upcoming" as const },
];

export const recentSessions = [
  { date: "Yesterday", title: "Push — Moderate", duration: 48, readiness: 79, alignment: "Aligned" },
  { date: "2 days ago", title: "Recovery Flow", duration: 28, readiness: 62, alignment: "Aligned" },
  { date: "3 days ago", title: "Lower — Strength", duration: 58, readiness: 87, alignment: "Aligned" },
  { date: "4 days ago", title: "Pull — Moderate", duration: 46, readiness: 74, alignment: "Aligned" },
  { date: "5 days ago", title: "Rest", duration: 0, readiness: 55, alignment: "Aligned" },
  { date: "6 days ago", title: "Conditioning", duration: 35, readiness: 81, alignment: "Aligned" },
];
