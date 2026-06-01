import type { SurveyAnswers } from "@/lib/types";

function getPainInsight(answers: SurveyAnswers) {
  if (
    ["100+ jobs", "300+ jobs", "I've lost count"].includes(answers.jobs_applied ?? "") &&
    answers.replies_received === "0 replies"
  ) {
    return "You are applying. Effort is not the issue. The bigger problem is that your resume may not be converting into recruiter conversations.";
  }

  if (answers.resume_usage === "Yes, same resume for every job") {
    return "Using the same resume everywhere can make you look generic, even when you have the right skills.";
  }

  if (["I don't know what ATS means", "I've heard of ATS but never checked"].includes(answers.ats_awareness ?? "")) {
    return "If you have not checked ATS compatibility, your resume may be filtered before a recruiter ever opens it.";
  }

  if (answers.field_of_study && answers.target_field && answers.field_of_study !== "Other" && answers.target_field !== "Other") {
    return `Since your education is in ${answers.field_of_study} and you want to work in ${answers.target_field}, your resume needs to clearly bridge that gap.`;
  }

  if (answers.reason_for_change) {
    return `Since you want to switch for ${answers.reason_for_change}, your resume needs to prove why you deserve that next opportunity.`;
  }

  return "Your resume can become much sharper when it is matched to the role, ATS-ready, and written for recruiter attention.";
}

export function PainInsightCard({ answers }: { answers: SurveyAnswers }) {
  return (
    <section className="pain-card">
      <p>Key insight</p>
      <strong>{getPainInsight(answers)}</strong>
    </section>
  );
}
