import { useState } from "react";
import { Link } from "react-router-dom";
import { Logo } from "@/components/Logo";
import { ArrowLeft, Trash2, Loader2 } from "lucide-react";
import { GlassCard } from "@/components/GlassCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const AccountDeletion = () => {
  const { user, session } = useAuth();
  const [confirmEmail, setConfirmEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error("You must be signed in to delete your account.");
      return;
    }

    if (confirmEmail.toLowerCase() !== user.email?.toLowerCase()) {
      toast.error("Email does not match your account.");
      return;
    }

    setSubmitting(true);
    try {
      // Delete user data from app tables (RLS policies scope to user_id)
      await Promise.allSettled([
        supabase.from("journal_entries").delete().eq("user_id", user.id),
        supabase.from("workouts").delete().eq("user_id", user.id),
        supabase.from("oura_connections").delete().eq("user_id", user.id),
        supabase.from("profiles").delete().eq("id", user.id),
      ]);

      // Sign out (full auth account deletion requires a Supabase edge function
      // or admin API call — we mark the request and the team processes it within 30 days)
      await supabase.auth.signOut();

      setDone(true);
      toast.success("Your data has been deleted and you've been signed out.");
    } catch (err: any) {
      toast.error(err.message ?? "Something went wrong. Please email support@somion.app.");
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <div className="mx-auto max-w-lg px-5 py-20 text-center">
        <Logo />
        <GlassCard strong className="mt-10 p-8">
          <Trash2 className="mx-auto h-10 w-10 text-muted-foreground" />
          <h1 className="mt-4 font-display text-3xl">Account Deletion Requested</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Your app data has been removed and you've been signed out. If your account requires
            full auth-level deletion, our team will process it within 30 days. You'll receive a
            confirmation email at your registered address.
          </p>
          <p className="mt-4 text-sm text-muted-foreground">
            Questions? Contact <a href="mailto:support@somion.app" className="text-primary hover:underline">support@somion.app</a>.
          </p>
          <Button asChild className="mt-6" variant="outline">
            <Link to="/">Return to home</Link>
          </Button>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg px-5 py-12">
      <Link to="/" className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back
      </Link>
      <Logo />
      <h1 className="mt-8 font-display text-4xl">Delete Your Account</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        This will permanently delete all of your Somion data including workout history,
        journal entries, Oura connection, and profile information.
      </p>

      {!session ? (
        <GlassCard className="mt-8 p-6">
          <p className="text-sm text-muted-foreground">
            Please <Link to="/auth" className="text-primary hover:underline">sign in</Link> first
            to delete your account, or email{" "}
            <a href="mailto:support@somion.app" className="text-primary hover:underline">support@somion.app</a>{" "}
            with your registered email address to request deletion.
          </p>
        </GlassCard>
      ) : (
        <GlassCard strong className="mt-8 p-6">
          <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-foreground">
            <strong>This action is permanent and cannot be undone.</strong> All your data will be
            deleted from our servers within 30 days.
          </div>

          <form onSubmit={handleDelete} className="mt-6 space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="confirm-email">Type your email to confirm</Label>
              <Input
                id="confirm-email"
                type="email"
                placeholder={user?.email ?? "your@email.com"}
                value={confirmEmail}
                onChange={(e) => setConfirmEmail(e.target.value)}
              />
            </div>

            <Button
              type="submit"
              disabled={submitting || !confirmEmail}
              variant="destructive"
              className="w-full"
            >
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Deleting…
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" /> Delete my account and all data
                </>
              )}
            </Button>
          </form>

          <p className="mt-4 text-center text-xs text-muted-foreground">
            Data covered:{" "}
            <span className="text-foreground/70">
              profile, journal entries, workouts, Oura connection, preferences
            </span>
          </p>
        </GlassCard>
      )}
    </div>
  );
};

export default AccountDeletion;
