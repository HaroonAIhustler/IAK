import Link from "next/link";
import { RotateCcw } from "lucide-react";
import { LogoHeader } from "@/components/LogoHeader";

export function MissingSessionState() {
  return (
    <main className="survey-page">
      <section className="survey-shell">
        <LogoHeader />
        <div className="survey-card missing-session">
          <h1>Your Resume Visibility Score is not available anymore.</h1>
          <p>Please answer the questions again so we can calculate your personalized score.</p>
          <Link className="primary-button primary-button--link" href="/resume-score">
            <RotateCcw size={18} />
            Restart Resume Score Check
          </Link>
        </div>
      </section>
    </main>
  );
}
