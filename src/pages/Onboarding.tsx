import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { Logo } from "@/components/Logo";
import { GlassCard } from "@/components/GlassCard";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

type Step = {
  key: string;
  question: string;
  helper?: string;
  options: string[];
  multi?: boolean;
};

const steps: Step[] = [
  {
    key: "goal",
    question: "What's your main goal?",
    helper: "We'll bias programming toward this.",
    options: ["Build muscle", "Lose fat", "Cardio fitness", "Wellness & longevity"],
  },
  {
    key: "experience",
    question: "How would you describe your experience?",
    options: ["New to training", "1–3 years", "3–5 years", "Advanced (5+)"],
  },
  {
    key: "split",
    question: "Preferred training split",
    options: ["Full body", "Upper / Lower", "Push / Pull / Legs", "Let Somion decide"],
  },
  {
    key: "equipment",
    question: "What do you have access to?",
    helper: "Pick all that apply.",
    multi: true,
    options: ["Full gym", "Home dumbbells", "Barbell", "Bodyweight only", "Bands", "Cardio machine"],
  },
  {
    key: "days",
    question: "Training days per week",
    options: ["2", "3", "4", "5", "6"],
  },
  {
    key: "length",
    question: "Preferred session length",
    options: ["20–30 min", "30–45 min", "45–60 min", "60+ min"],
  },
  {
    key: "tone",
    question: "How should your coach speak to you?",
    helper: "We'll match the tone of recommendations and check-ins.",
    options: ["Calm & quiet", "Direct & clear", "Warm & encouraging", "Minimal — just the data"],
  },
  {
    key: "soreness",
    question: "How sore do you usually feel after training?",
    options: ["Rarely sore", "Mild day-after", "Often noticeably sore", "Easily overtrained"],
  },
];

const Onboarding = () => {
  const navigate = useNavigate();
  const [stepIdx, setStepIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const step = steps[stepIdx];

  const select = (opt: string) => {
    if (step.multi) {
      const cur = (answers[step.key] as string[]) || [];
      setAnswers({ ...answers, [step.key]: cur.includes(opt) ? cur.filter(x => x !== opt) : [...cur, opt] });
    } else {
      setAnswers({ ...answers, [step.key]: opt });
    }
  };

  const isSelected = (opt: string) => {
    const v = answers[step.key];
    return Array.isArray(v) ? v.includes(opt) : v === opt;
  };

  const canNext = step.multi
    ? ((answers[step.key] as string[])?.length ?? 0) > 0
    : !!answers[step.key];

  const next = () => {
    if (stepIdx < steps.length - 1) setStepIdx(stepIdx + 1);
    else {
      toast.success("Your plan is ready");
      navigate("/app");
    }
  };

  const progress = ((stepIdx + 1) / steps.length) * 100;

  return (
    <div className="relative min-h-screen px-5 py-8">
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-gradient-glow blur-3xl" />
      </div>

      <div className="mx-auto flex max-w-xl items-center justify-between">
        <Logo />
        <span className="text-xs text-muted-foreground">{stepIdx + 1} of {steps.length}</span>
      </div>

      <div className="mx-auto mt-4 max-w-xl">
        <div className="h-1 w-full overflow-hidden rounded-full bg-secondary">
          <div
            className="h-full bg-gradient-moon transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="mx-auto mt-10 max-w-xl">
        <GlassCard strong className="p-8 animate-fade-up" key={step.key}>
          <h1 className="font-display text-3xl md:text-4xl">{step.question}</h1>
          {step.helper && <p className="mt-2 text-sm text-muted-foreground">{step.helper}</p>}

          <div className={cn(
            "mt-6 grid gap-2",
            step.options.length > 4 ? "sm:grid-cols-2" : ""
          )}>
            {step.options.map(opt => (
              <button
                key={opt}
                onClick={() => select(opt)}
                className={cn(
                  "group relative flex items-center justify-between rounded-xl border px-4 py-3 text-left text-sm transition-all",
                  isSelected(opt)
                    ? "border-primary/60 bg-primary/10 ring-1 ring-primary/30"
                    : "border-border bg-secondary/40 hover:border-border/80 hover:bg-secondary/70"
                )}
              >
                <span>{opt}</span>
                {isSelected(opt) && <Check className="h-4 w-4 text-primary" />}
              </button>
            ))}
          </div>
        </GlassCard>

        <div className="mt-6 flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => setStepIdx(Math.max(0, stepIdx - 1))}
            disabled={stepIdx === 0}
          >
            <ArrowLeft className="mr-1 h-4 w-4" /> Back
          </Button>
          <Button
            onClick={next}
            disabled={!canNext}
            className="bg-gradient-moon text-primary-foreground hover:opacity-90"
          >
            {stepIdx === steps.length - 1 ? "Finish" : "Continue"} <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
