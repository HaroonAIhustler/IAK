import { ArrowRight, ShieldCheck } from "lucide-react";
import type { SurveyAnswers } from "@/lib/types";

type ContactSlideProps = {
  answers: SurveyAnswers;
  error?: string;
  onChange: (key: keyof SurveyAnswers, value: string) => void;
  onSubmit: (answers: SurveyAnswers) => void;
};

export function ContactSlide({ answers, error, onChange, onSubmit }: ContactSlideProps) {
  function handlePhoneChange(value: string) {
    const digits = value.replace(/\D/g, "");
    const localDigits = digits.startsWith("91") ? digits.slice(2) : digits;
    onChange("whatsapp_number", `+91 ${localDigits.slice(0, 10)}`);
  }

  return (
    <form
      className="question-slide contact-slide"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit(answers);
      }}
    >
      <p className="eyebrow">Final step</p>
      <h1>Where can we share the score?</h1>
      <p className="question-copy">No spam. Your details are used only to generate and save your resume score report.</p>

      <div className="contact-grid">
        <label className="text-field">
          <span>First name</span>
          <input value={answers.first_name ?? ""} onChange={(event) => onChange("first_name", event.target.value)} autoComplete="given-name" />
        </label>
        <label className="text-field">
          <span>Last name</span>
          <input value={answers.last_name ?? ""} onChange={(event) => onChange("last_name", event.target.value)} autoComplete="family-name" />
        </label>
        <label className="text-field contact-grid__wide">
          <span>Email</span>
          <input value={answers.email ?? ""} onChange={(event) => onChange("email", event.target.value)} type="email" autoComplete="email" />
        </label>
        <label className="text-field contact-grid__wide">
          <span>WhatsApp number</span>
          <input
            value={answers.whatsapp_number ?? "+91 "}
            onChange={(event) => handlePhoneChange(event.target.value)}
            inputMode="tel"
            autoComplete="tel"
            pattern="^\+91\s?\d{10}$"
            placeholder="+91 98765 43210"
          />
        </label>
      </div>

      {error ? <p className="form-error">{error}</p> : null}

      <button className="primary-button" type="submit">
        Calculate My Resume Score <ArrowRight size={18} />
      </button>
      <p className="secure-note">
        <ShieldCheck size={16} />
        Your result is private. No spam.
      </p>
    </form>
  );
}
