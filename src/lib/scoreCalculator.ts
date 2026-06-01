import { isFresher } from "@/data/surveyQuestions";
import { getFieldMatchScore } from "@/lib/fieldMatch";
import type { OfferRouting, ScoreResult, SurveyAnswers, UtmData } from "@/lib/types";

function clamp(value: number, min = 0, max = 100) {
  return Math.min(Math.max(value, min), max);
}

function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "");
}

const repliesBaseScore: Record<string, number> = {
  "0 replies": 20,
  "1-2 replies total": 35,
  "1-2 replies per week": 65,
  "3-5 replies per week": 85,
  "Mostly irrelevant or scam calls": 35,
  "Calls, but not from good companies": 50
};

const effortPenalty: Record<string, number> = {
  "0-10 jobs": 0,
  "10+ jobs": -5,
  "50+ jobs": -10,
  "100+ jobs": -15,
  "300+ jobs": -20,
  "I've lost count": -20
};

const applicationOutcomeScore: Record<string, number> = {
  "No response at all": 15,
  "Rejection email after a few days": 35,
  "Application gets viewed but no reply": 25,
  "Recruiter calls then disappears": 45,
  "I clear first call but don't move ahead": 65,
  "I don't know what happens": 40
};

const resumeUsageScore: Record<string, number> = {
  "Yes, same resume for every job": 20,
  "I change only job title or objective": 30,
  "I make small edits sometimes": 50,
  "I customize it properly for each role": 85,
  "I don't know how to customize my resume": 35
};

const atsAwarenessScore: Record<string, number> = {
  "I don't know what ATS means": 20,
  "I've heard of ATS but never checked": 30,
  "I checked once but didn't understand the score": 45,
  "Yes, but I still don't get replies": 55
};

const triedBeforeScore: Record<string, number> = {
  "Free resume templates": 35,
  "YouTube videos": 45,
  ChatGPT: 45,
  "Resume advice from friends or seniors": 50,
  "Paid resume service": 60,
  "Nothing properly yet": 40
};

const aiProficiencyScore: Record<string, number> = {
  "Just starting - Beginner": 35,
  "Have used ChatGPT - Need to explore other tools": 55,
  "Actively using multiple AI tools": 75,
  "Expert in AI - Can execute live projects": 85
};

const digitalMarketingTrainingModifier: Record<string, number> = {
  Yes: 4,
  "Studied in college": 2,
  "Watched YouTube videos": 0,
  No: -4
};

function getEffortOutcomeScore(answers: SurveyAnswers) {
  if (answers.jobs_applied === "0-10 jobs" && answers.replies_received === "0 replies") return 45;
  return clamp((repliesBaseScore[answers.replies_received ?? ""] ?? 40) + (effortPenalty[answers.jobs_applied ?? ""] ?? 0), 10, 100);
}

function getScoreLabel(score: number) {
  if (score <= 35) return "Critical Visibility Problem";
  if (score <= 55) return "Low Resume Visibility";
  if (score <= 70) return "Moderate Visibility";
  if (score <= 85) return "Good, But Needs Optimization";
  return "Strong Visibility";
}

export function calculateResumeScore(answers: SurveyAnswers): ScoreResult {
  const effortOutcomeScore = getEffortOutcomeScore(answers);
  const outcomeScore = applicationOutcomeScore[answers.application_outcome ?? ""] ?? 40;
  const usageScore = resumeUsageScore[answers.resume_usage ?? ""] ?? 40;
  const atsScore = atsAwarenessScore[answers.ats_awareness ?? ""] ?? 40;
  const triedScore = triedBeforeScore[answers.tried_before ?? ""] ?? 40;
  const fieldMatchScore = getFieldMatchScore(answers.field_of_study, answers.target_field);
  const aiScore = aiProficiencyScore[answers.ai_proficiency ?? ""] ?? 40;

  let resumeVisibilityScore = Math.round(
    effortOutcomeScore * 0.28 +
      outcomeScore * 0.14 +
      usageScore * 0.18 +
      atsScore * 0.18 +
      triedScore * 0.08 +
      fieldMatchScore * 0.04 +
      aiScore * 0.1
  );

  const dmModifier =
    isFresher(answers.user_segment) && answers.target_field === "Digital Marketing"
      ? digitalMarketingTrainingModifier[answers.digital_marketing_training ?? ""] ?? 0
      : 0;

  resumeVisibilityScore = clamp(resumeVisibilityScore + dmModifier);
  const scoreLabel = getScoreLabel(resumeVisibilityScore);

  return {
    resume_visibility_score: resumeVisibilityScore,
    score_label: scoreLabel,
    score_slug: slugify(scoreLabel),
    subscores: {
      effortOutcomeScore,
      applicationOutcomeScore: outcomeScore,
      resumeUsageScore: usageScore,
      atsAwarenessScore: atsScore,
      triedBeforeScore: triedScore,
      fieldMatchScore,
      aiProficiencyScore: aiScore,
      digitalMarketingTrainingModifier: dmModifier
    }
  };
}

export function getOfferRouting(answers: SurveyAnswers): OfferRouting {
  void answers;

  const offerSegment = "fresher";
  const offerPrice = 999;
  const videoOfferUrl = process.env.NEXT_PUBLIC_GHL_FRESHER_VIDEO_OFFER_URL ?? "";

  return {
    offer_segment: offerSegment,
    offer_price: offerPrice,
    video_offer_url: videoOfferUrl,
    razorpay_product: "Interview Accelerator Kit"
  };
}

export function getTags(answers: SurveyAnswers, scoreResult: ScoreResult) {
  const tags = [scoreResult.score_label.replace("Critical Visibility Problem", "Resume Score - Critical").replace("Low Resume Visibility", "Resume Score - Low").replace("Moderate Visibility", "Resume Score - Moderate").replace("Good, But Needs Optimization", "Resume Score - Good").replace("Strong Visibility", "Resume Score - Strong")];

  if (answers.user_segment?.includes("Fresher")) tags.push("Fresher");
  if (answers.user_segment?.includes("0-2") || answers.user_segment?.includes("2-5")) tags.push("Experienced");
  if (answers.user_segment?.includes("Career gap")) tags.push("Career Gap");
  if (answers.target_field === "Digital Marketing") tags.push("Digital Marketing Lead");
  if (isFresher(answers.user_segment) && answers.target_field === "Digital Marketing" && answers.digital_marketing_training === "Yes") tags.push("DM Trained Fresher");
  if (answers.resume_usage === "Yes, same resume for every job") tags.push("Same Resume User");
  if (["100+ jobs", "300+ jobs", "I've lost count"].includes(answers.jobs_applied ?? "")) tags.push("High Intent - 100+ Applications");
  if (answers.replies_received === "0 replies") tags.push("High Pain - 0 Replies");
  if (answers.ats_awareness === "I don't know what ATS means") tags.push("ATS Unaware");
  if (answers.ats_awareness === "I've heard of ATS but never checked") tags.push("ATS Not Checked");
  if (answers.ai_proficiency === "Just starting - Beginner") tags.push("AI Beginner");
  if (["Actively using multiple AI tools", "Expert in AI - Can execute live projects"].includes(answers.ai_proficiency ?? "")) tags.push("AI Advanced");

  return tags;
}

export function buildReadableSurveyAnswers(answers: SurveyAnswers) {
  const city = answers.city === "Other" ? answers.custom_city : answers.city;

  return {
    what_best_describes_you: answers.user_segment,
    why_do_you_want_to_change: answers.reason_for_change,
    how_many_jobs_did_you_apply_to: answers.jobs_applied,
    how_many_replies_did_you_get: answers.replies_received,
    what_happens_after_you_apply: answers.application_outcome,
    which_city_are_you_applying_from: city,
    state: answers.state,
    what_is_your_education: answers.education_background,
    when_did_you_graduate: answers.graduation_year,
    what_did_you_study: answers.field_of_study,
    which_field_do_you_want_to_work_in: answers.target_field,
    any_digital_marketing_training: answers.digital_marketing_training,
    same_resume_for_every_job: answers.resume_usage,
    job_application_strategies_tried: answers.tried_before,
    have_you_checked_ats_fit: answers.ats_awareness,
    how_good_are_you_with_ai: answers.ai_proficiency
  };
}

export function buildReadableQuestionList(answers: SurveyAnswers) {
  const readableAnswers = buildReadableSurveyAnswers(answers);

  return [
    { question: "What best describes you?", answer: readableAnswers.what_best_describes_you },
    { question: "Why do you want to change?", answer: readableAnswers.why_do_you_want_to_change },
    { question: "How many jobs did you apply to?", answer: readableAnswers.how_many_jobs_did_you_apply_to },
    { question: "How many replies did you get?", answer: readableAnswers.how_many_replies_did_you_get },
    { question: "What happens after you apply?", answer: readableAnswers.what_happens_after_you_apply },
    { question: "Which city are you applying from?", answer: readableAnswers.which_city_are_you_applying_from },
    { question: "State", answer: readableAnswers.state },
    { question: "What is your education?", answer: readableAnswers.what_is_your_education },
    { question: "When did you graduate?", answer: readableAnswers.when_did_you_graduate },
    { question: "What did you study?", answer: readableAnswers.what_did_you_study },
    { question: "Which field do you want to work in?", answer: readableAnswers.which_field_do_you_want_to_work_in },
    { question: "Any Digital Marketing training?", answer: readableAnswers.any_digital_marketing_training },
    { question: "Same resume for every job?", answer: readableAnswers.same_resume_for_every_job },
    { question: "What Job application strategies have you tried?", answer: readableAnswers.job_application_strategies_tried },
    { question: "Have you checked ATS fit?", answer: readableAnswers.have_you_checked_ats_fit },
    { question: "How good are you with AI?", answer: readableAnswers.how_good_are_you_with_ai }
  ].filter((item) => item.answer);
}

export function buildWebhookPayload(
  answers: SurveyAnswers,
  scoreResult: ScoreResult,
  routing: OfferRouting,
  utm: UtmData,
  tags: string[]
) {
  const firstName = answers.first_name?.trim() ?? "";
  const lastName = answers.last_name?.trim() ?? "";
  const name = [firstName, lastName].filter(Boolean).join(" ");

  return {
    source: "AI Growth Studio Resume Visibility Score Survey",
    contact: {
      first_name: firstName,
      last_name: lastName,
      name,
      email: answers.email,
      phone: answers.whatsapp_number,
      whatsapp_number: answers.whatsapp_number
    },
    survey: answers,
    question_answers: buildReadableSurveyAnswers(answers),
    questions: buildReadableQuestionList(answers),
    score: {
      resume_visibility_score: scoreResult.resume_visibility_score,
      score_label: scoreResult.score_label
    },
    routing,
    utm,
    tags,
    result_page_url: "/resume-score-result",
    submitted_at: new Date().toISOString()
  };
}
