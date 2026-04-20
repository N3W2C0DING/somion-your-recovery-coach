import { Link } from "react-router-dom";
import { Logo } from "@/components/Logo";
import { ArrowLeft, AlertTriangle } from "lucide-react";

const HealthDisclaimer = () => (
  <div className="mx-auto max-w-3xl px-5 py-12">
    <Link to="/" className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
      <ArrowLeft className="h-4 w-4" /> Back
    </Link>
    <Logo />
    <h1 className="mt-8 font-display text-4xl">Health & Fitness Disclaimer</h1>

    <div className="mt-8 space-y-6 text-sm leading-relaxed text-foreground/85">
      <div className="flex gap-3 rounded-xl border border-warning/30 bg-warning/5 p-5">
        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-warning" />
        <div>
          <p className="font-medium text-foreground">Somion is not a medical device or healthcare service.</p>
          <p className="mt-2">All workout recommendations, recovery assessments, readiness scores, and training plans provided by Somion are generated algorithmically for general fitness guidance. They do not constitute medical advice, diagnosis, or treatment.</p>
        </div>
      </div>

      <section>
        <h2 className="font-display text-xl">Not a Substitute for Professional Advice</h2>
        <p className="mt-2">The information provided by Somion should not replace the advice of a qualified physician, physical therapist, certified personal trainer, or other healthcare professional. Always consult a healthcare provider before beginning, modifying, or discontinuing any fitness program.</p>
      </section>

      <section>
        <h2 className="font-display text-xl">Assumption of Risk</h2>
        <p className="mt-2">Exercise carries inherent risks including, but not limited to, injury, illness, disability, and death. By using Somion, you acknowledge these risks and assume full responsibility for your participation in any exercise or training activity suggested by the App.</p>
      </section>

      <section>
        <h2 className="font-display text-xl">Data Accuracy</h2>
        <p className="mt-2">Somion relies on data from your Oura Ring and self-reported inputs. Wearable sensor data can be inaccurate, and recommendations based on this data may not perfectly reflect your physiological state. Do not rely solely on Somion's assessments to make health decisions.</p>
      </section>

      <section>
        <h2 className="font-display text-xl">When to Stop</h2>
        <p className="mt-2">If you experience chest pain, shortness of breath, dizziness, nausea, unusual fatigue, or any other symptoms of concern during exercise, stop immediately and seek medical attention. Somion's recommendation to train does not override how your body feels.</p>
      </section>

      <section>
        <h2 className="font-display text-xl">Pre-existing Conditions</h2>
        <p className="mt-2">If you have any pre-existing medical conditions, are pregnant, or are recovering from illness or surgery, consult your doctor before using Somion's training recommendations.</p>
      </section>

      <section>
        <h2 className="font-display text-xl">No Guarantees</h2>
        <p className="mt-2">Somion does not guarantee specific fitness outcomes, weight loss, muscle gain, injury prevention, or health improvements. Results vary based on individual physiology, effort, nutrition, sleep, genetics, and many other factors outside the App's control.</p>
      </section>
    </div>
  </div>
);

export default HealthDisclaimer;
