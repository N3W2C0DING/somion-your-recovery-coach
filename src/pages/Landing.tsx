import { Link } from "react-router-dom";
import { ArrowRight, Moon, Activity, Brain, Sparkles, ShieldCheck } from "lucide-react";
import heroMoon from "@/assets/hero-moon.jpg";
import { Logo } from "@/components/Logo";
import { GlassCard } from "@/components/GlassCard";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: Moon,
    title: "Reads your night",
    body: "Sleep score, HRV, resting heart rate, and total sleep — pulled directly from your Oura Ring.",
  },
  {
    icon: Brain,
    title: "Decides your day",
    body: "A recovery-aware engine turns last night's data into today's session — no second-guessing.",
  },
  {
    icon: Activity,
    title: "Trains the right amount",
    body: "Volume, intensity, and rest adjust to readiness, soreness, and recent strain.",
  },
  {
    icon: ShieldCheck,
    title: "Protects your progress",
    body: "Stop overreaching on red days. Stop wasting green days. Compound the effort that counts.",
  },
];

const labels = [
  "Primed for Strength",
  "Good Day to Train",
  "Train, but Keep It Moderate",
  "Lower the Intensity Today",
  "Recovery Should Lead Today",
  "Light Movement Only",
  "Rest Without Guilt",
];

const Landing = () => {
  return (
    <div className="relative overflow-hidden">
      {/* Hero */}
      <header className="relative">
        <div className="absolute inset-0 -z-10">
          <img
            src={heroMoon}
            alt=""
            width={1920}
            height={1080}
            className="h-full w-full object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/70 to-background" />
        </div>

        <div className="container flex items-center justify-between py-6">
          <Logo />
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm">
              <Link to="/auth">Sign in</Link>
            </Button>
            <Button asChild size="sm" className="bg-gradient-moon text-primary-foreground hover:opacity-90">
              <Link to="/auth">Get started</Link>
            </Button>
          </div>
        </div>

        <div className="container relative grid place-items-center pb-24 pt-16 text-center md:pb-40 md:pt-28">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border/60 bg-secondary/40 px-3 py-1 text-xs text-muted-foreground backdrop-blur animate-fade-in">
            <Sparkles className="h-3 w-3 text-primary" />
            Powered by your Oura Ring
          </div>

          <h1 className="font-display text-5xl leading-[1.05] tracking-tight md:text-7xl animate-fade-up">
            Train with your <em className="text-gradient-moon not-italic">recovery</em>,
            <br className="hidden md:block" /> not against it.
          </h1>

          <p className="mt-6 max-w-xl text-balance text-base text-muted-foreground md:text-lg animate-fade-up" style={{ animationDelay: "0.1s" }}>
            Somion turns last night's sleep, HRV, and readiness into today's workout.
            Calm, intelligent coaching — built for people who train for the long run.
          </p>

          <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row animate-fade-up" style={{ animationDelay: "0.2s" }}>
            <Button asChild size="lg" className="bg-gradient-moon text-primary-foreground shadow-glow hover:opacity-90">
              <Link to="/auth">
                Start free <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="ghost" className="text-foreground/80">
              <a href="#how">How it works</a>
            </Button>
          </div>

          {/* Floating recommendation card */}
          <GlassCard strong className="mt-20 w-full max-w-md p-6 text-left animate-fade-up shadow-elegant" >
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Today · Thu</span>
              <span className="rounded-full bg-success/10 px-2 py-0.5 text-[10px] uppercase tracking-wider text-success ring-1 ring-success/30">
                Readiness 87
              </span>
            </div>
            <h3 className="mt-3 font-display text-3xl">Primed for Strength</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Deep sleep recovered HRV by 12%. Push your top set today — your body's ready.
            </p>
            <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
              <Stat k="Sleep" v="8.2h" />
              <Stat k="HRV" v="68ms" />
              <Stat k="Strain" v="9.1" />
            </div>
          </GlassCard>
        </div>
      </header>

      {/* How it works */}
      <section id="how" className="container py-20 md:py-32">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs uppercase tracking-[0.25em] text-primary">How Somion works</p>
          <h2 className="mt-3 font-display text-4xl md:text-5xl">A coach that listens before it speaks.</h2>
          <p className="mt-4 text-muted-foreground">
            Most apps tell you what to do. Somion asks how you slept first.
          </p>
        </div>

        <div className="mt-14 grid gap-4 md:grid-cols-2">
          {features.map(f => (
            <GlassCard key={f.title} className="p-6">
              <f.icon className="h-6 w-6 text-primary" />
              <h3 className="mt-4 text-lg font-medium">{f.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{f.body}</p>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* Recommendation labels */}
      <section className="container py-20">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs uppercase tracking-[0.25em] text-primary">Seven honest answers</p>
          <h2 className="mt-3 font-display text-4xl md:text-5xl">No streaks. No guilt. Just signal.</h2>
          <p className="mt-4 text-muted-foreground">
            Every morning, Somion gives you one of seven recommendations — each grounded in your own data.
          </p>
        </div>

        <div className="mt-12 flex flex-wrap justify-center gap-3">
          {labels.map((l, i) => (
            <div
              key={l}
              className="glass rounded-full px-4 py-2 text-sm text-foreground/90 animate-fade-up"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              {l}
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container pb-32 pt-12">
        <GlassCard strong className="relative overflow-hidden p-10 text-center md:p-16">
          <div aria-hidden className="absolute -top-20 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-gradient-moon opacity-30 blur-3xl" />
          <h2 className="font-display text-4xl md:text-5xl">Train smarter, not harder.</h2>
          <p className="mx-auto mt-4 max-w-md text-muted-foreground">
            Connect your Oura, set your goals, and let Somion handle the rest.
          </p>
          <Button asChild size="lg" className="mt-8 bg-gradient-moon text-primary-foreground shadow-glow hover:opacity-90">
            <Link to="/auth">Start with Somion <ArrowRight className="ml-1 h-4 w-4" /></Link>
          </Button>
        </GlassCard>
      </section>

      <footer className="border-t border-border/40 py-10">
        <div className="container flex flex-col items-center justify-between gap-4 text-xs text-muted-foreground md:flex-row">
          <Logo />
          <div>© {new Date().getFullYear()} Somion. Train with your recovery.</div>
        </div>
      </footer>
    </div>
  );
};

const Stat = ({ k, v }: { k: string; v: string }) => (
  <div className="rounded-lg border border-border/60 bg-secondary/40 p-2 text-center">
    <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{k}</div>
    <div className="mt-0.5 font-medium">{v}</div>
  </div>
);

export default Landing;
