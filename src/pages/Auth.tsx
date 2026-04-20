import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Mail } from "lucide-react";
import { Logo } from "@/components/Logo";
import { GlassCard } from "@/components/GlassCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const AppleLogo = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
  </svg>
);

const GoogleLogo = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
  </svg>
);

const Auth = () => {
  const navigate = useNavigate();
  const { session } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup" | "forgot">("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (session) navigate("/app", { replace: true });
  }, [session, navigate]);

  const signInWithProvider = async (provider: "apple" | "google") => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/app`,
      },
    });
    if (error) toast.error(error.message);
  };

  const sendResetEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }
    setSubmitting(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      toast.success("Check your email for a password reset link");
    } catch (err: any) {
      toast.error(err.message ?? "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please enter your email and password");
      return;
    }
    setSubmitting(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/app` },
        });
        if (error) throw error;
        toast.success("Welcome to Somion");
        navigate("/onboarding");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Welcome back");
        navigate("/app");
      }
    } catch (err: any) {
      toast.error(err.message ?? "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative grid min-h-screen place-items-center px-5 py-10">
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute left-1/2 top-1/4 h-96 w-96 -translate-x-1/2 rounded-full bg-gradient-glow blur-3xl" />
      </div>

      <div className="w-full max-w-md">
        <Link to="/" className="mb-8 inline-flex"><Logo /></Link>

        <GlassCard strong className="p-8">
          <h1 className="font-display text-3xl">
            {mode === "forgot" ? "Reset your password" : mode === "signup" ? "Create your account" : "Welcome back"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {mode === "forgot"
              ? "Enter your email and we'll send you a reset link."
              : mode === "signup"
              ? "A calmer way to train. Start in two minutes."
              : "Sign in to see today's recommendation."}
          </p>

          {mode !== "forgot" && (
          <>
          {/* Social login buttons */}
          <div className="mt-6 grid gap-3">
            <Button
              type="button"
              variant="outline"
              className="w-full gap-2 bg-white text-black hover:bg-gray-100"
              onClick={() => signInWithProvider("apple")}
            >
              <AppleLogo className="h-5 w-5" />
              Continue with Apple
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full gap-2 bg-white text-black hover:bg-gray-100"
              onClick={() => signInWithProvider("google")}
            >
              <GoogleLogo className="h-5 w-5" />
              Continue with Google
            </Button>
          </div>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border/60" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-3 text-muted-foreground">or continue with email</span>
            </div>
          </div>
          </>
          )}

          {mode === "forgot" ? (
            <form onSubmit={sendResetEmail} className="mt-6 space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@somion.app"
                    className="pl-9"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
              <Button type="submit" disabled={submitting} className="w-full bg-gradient-moon text-primary-foreground hover:opacity-90">
                {submitting ? "Sending…" : "Send reset link"} <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
              <div className="text-center">
                <button onClick={() => setMode("signin")} className="text-sm text-primary underline-offset-4 hover:underline">Back to sign in</button>
              </div>
            </form>
          ) : (

          <form onSubmit={submit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@somion.app"
                  className="pl-9"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                autoComplete={mode === "signup" ? "new-password" : "current-password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <Button type="submit" disabled={submitting} className="w-full bg-gradient-moon text-primary-foreground hover:opacity-90">
              {submitting ? "Please wait…" : mode === "signup" ? "Create account" : "Sign in"} <ArrowRight className="ml-1 h-4 w-4" />
            </Button>

            {mode === "signin" && (
              <div className="text-center">
                <button onClick={() => setMode("forgot")} className="text-xs text-muted-foreground underline-offset-4 hover:text-primary hover:underline">Forgot your password?</button>
              </div>
            )}
          </form>
          )}

          {mode !== "forgot" && (
          <div className="mt-6 text-center text-sm text-muted-foreground">
            {mode === "signup" ? (
              <>Already have an account?{" "}
                <button onClick={() => setMode("signin")} className="text-primary underline-offset-4 hover:underline">Sign in</button>
              </>
            ) : (
              <>New to Somion?{" "}
                <button onClick={() => setMode("signup")} className="text-primary underline-offset-4 hover:underline">Create an account</button>
              </>
            )}
          </div>
          )}
        </GlassCard>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          By continuing you agree to Somion's{" "}
          <Link to="/terms" className="text-primary hover:underline">Terms of Service</Link>{" "}
          and{" "}
          <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>.
        </p>
      </div>
    </div>
  );
};

export default Auth;
