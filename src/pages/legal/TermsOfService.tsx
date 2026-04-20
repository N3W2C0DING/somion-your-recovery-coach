import { Link } from "react-router-dom";
import { Logo } from "@/components/Logo";
import { ArrowLeft } from "lucide-react";

const TermsOfService = () => (
  <div className="mx-auto max-w-3xl px-5 py-12">
    <Link to="/" className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
      <ArrowLeft className="h-4 w-4" /> Back
    </Link>
    <Logo />
    <h1 className="mt-8 font-display text-4xl">Terms of Service</h1>
    <p className="mt-2 text-sm text-muted-foreground">Last updated: {new Date().toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })}</p>

    <div className="mt-8 space-y-6 text-sm leading-relaxed text-foreground/85">
      <section>
        <h2 className="font-display text-xl">1. Acceptance of Terms</h2>
        <p className="mt-2">By accessing or using Somion ("the App"), you agree to be bound by these Terms of Service. If you do not agree, do not use the App.</p>
      </section>

      <section>
        <h2 className="font-display text-xl">2. Description of Service</h2>
        <p className="mt-2">Somion is a recovery-aware workout recommendation app. It uses data from your Oura Ring and self-reported inputs to suggest daily training intensity and exercises. Somion is a fitness tool, not a medical device or healthcare provider.</p>
      </section>

      <section>
        <h2 className="font-display text-xl">3. Health Disclaimer</h2>
        <p className="mt-2 rounded-lg border border-warning/30 bg-warning/5 p-4 text-foreground">
          <strong>Somion does not provide medical advice.</strong> The recommendations, workout plans, and recovery assessments provided by Somion are for informational and fitness purposes only. They are not intended to diagnose, treat, cure, or prevent any disease or health condition. Always consult a qualified healthcare professional before starting any exercise program, especially if you have pre-existing health conditions. If you experience pain, dizziness, or discomfort during exercise, stop immediately and seek medical attention.
        </p>
      </section>

      <section>
        <h2 className="font-display text-xl">4. Account Responsibilities</h2>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>You must be at least 16 years old to use Somion.</li>
          <li>You are responsible for maintaining the security of your account credentials.</li>
          <li>You are responsible for all activity that occurs under your account.</li>
          <li>You agree to provide accurate information during registration.</li>
        </ul>
      </section>

      <section>
        <h2 className="font-display text-xl">5. Oura Integration</h2>
        <p className="mt-2">Somion integrates with the Oura API to access your health metrics. By connecting your Oura account, you authorize Somion to read the data categories you approve. You can revoke this access at any time through the Settings page or your Oura account. Somion is not affiliated with, endorsed by, or sponsored by Oura Health Oy.</p>
      </section>

      <section>
        <h2 className="font-display text-xl">6. Subscriptions and Payments</h2>
        <p className="mt-2">Somion may offer premium features through paid subscriptions. Subscription terms, pricing, and billing cycles will be clearly presented before purchase. Subscriptions purchased through the Apple App Store are subject to Apple's terms and refund policies.</p>
      </section>

      <section>
        <h2 className="font-display text-xl">7. Intellectual Property</h2>
        <p className="mt-2">All content, design, code, and branding in Somion are owned by the Somion team. You may not copy, modify, distribute, or reverse-engineer any part of the App without written permission.</p>
      </section>

      <section>
        <h2 className="font-display text-xl">8. Limitation of Liability</h2>
        <p className="mt-2">Somion is provided "as is" without warranties of any kind. To the maximum extent permitted by law, we are not liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the App, including but not limited to injuries sustained during exercise.</p>
      </section>

      <section>
        <h2 className="font-display text-xl">9. Termination</h2>
        <p className="mt-2">We reserve the right to suspend or terminate your account if you violate these terms. You may delete your account at any time by contacting <a href="mailto:support@somion.app" className="text-primary hover:underline">support@somion.app</a>.</p>
      </section>

      <section>
        <h2 className="font-display text-xl">10. Changes to Terms</h2>
        <p className="mt-2">We may update these Terms from time to time. Continued use of the App after changes constitutes acceptance of the updated Terms.</p>
      </section>

      <section>
        <h2 className="font-display text-xl">11. Contact</h2>
        <p className="mt-2">For questions about these Terms, contact <a href="mailto:support@somion.app" className="text-primary hover:underline">support@somion.app</a>.</p>
      </section>
    </div>
  </div>
);

export default TermsOfService;
