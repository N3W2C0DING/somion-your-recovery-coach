import { Link } from "react-router-dom";
import { Logo } from "@/components/Logo";
import { ArrowLeft, Mail, MessageCircle } from "lucide-react";
import { GlassCard } from "@/components/GlassCard";

const Support = () => (
  <div className="mx-auto max-w-3xl px-5 py-12">
    <Link to="/" className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
      <ArrowLeft className="h-4 w-4" /> Back
    </Link>
    <Logo />
    <h1 className="mt-8 font-display text-4xl">Support</h1>
    <p className="mt-2 text-sm text-muted-foreground">We're here to help.</p>

    <div className="mt-8 grid gap-5 md:grid-cols-2">
      <GlassCard className="p-6">
        <Mail className="h-6 w-6 text-primary" />
        <h3 className="mt-4 font-display text-xl">Email Support</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          For account issues, bug reports, or general questions.
        </p>
        <a href="mailto:support@somion.app" className="mt-4 inline-block text-sm text-primary hover:underline">
          support@somion.app
        </a>
      </GlassCard>

      <GlassCard className="p-6">
        <MessageCircle className="h-6 w-6 text-primary" />
        <h3 className="mt-4 font-display text-xl">FAQ</h3>
        <div className="mt-4 space-y-4 text-sm">
          <div>
            <p className="font-medium text-foreground">Do I need an Oura Ring?</p>
            <p className="mt-1 text-muted-foreground">Yes — Somion uses your Oura data to generate personalized recovery-aware workouts. Without it, you'll see sample data only.</p>
          </div>
          <div>
            <p className="font-medium text-foreground">Which Oura Rings are supported?</p>
            <p className="mt-1 text-muted-foreground">Generation 2 and Generation 3, plus Gen 3 Horizon and Heritage.</p>
          </div>
          <div>
            <p className="font-medium text-foreground">Is my health data shared?</p>
            <p className="mt-1 text-muted-foreground">No. Your data is stored securely in your account and is never sold or shared with third parties. See our <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>.</p>
          </div>
          <div>
            <p className="font-medium text-foreground">How do I delete my account?</p>
            <p className="mt-1 text-muted-foreground">Visit the <Link to="/account-deletion" className="text-primary hover:underline">account deletion page</Link> or email support@somion.app.</p>
          </div>
        </div>
      </GlassCard>
    </div>
  </div>
);

export default Support;
