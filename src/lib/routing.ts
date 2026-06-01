import type { OfferRouting, ScoreResult, SurveyAnswers, UtmData } from "@/lib/types";

function normalizeParam(value?: string | number) {
  if (value === undefined || value === null || value === "") return undefined;
  return String(value)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "");
}

export function buildVideoOfferUrl(
  routing: OfferRouting,
  answers: SurveyAnswers,
  scoreResult: ScoreResult,
  utm: UtmData | null
) {
  const fallback = `/interview-accelerator-kit?segment=${routing.offer_segment}`;
  const baseUrl = routing.video_offer_url || fallback;
  const url = new URL(baseUrl, window.location.origin);
  const city = answers.city === "Other" ? answers.custom_city : answers.city;

  const params: Record<string, string | number | undefined> = {
    segment: routing.offer_segment,
    score: scoreResult.resume_visibility_score,
    score_label: normalizeParam(scoreResult.score_label),
    city: normalizeParam(city),
    target_field: normalizeParam(answers.target_field),
    jobs_applied: normalizeParam(answers.jobs_applied),
    replies: normalizeParam(answers.replies_received),
    offer_price: routing.offer_price,
    platform: utm?.platform,
    utm_source: utm?.utm_source,
    utm_medium: utm?.utm_medium,
    utm_campaign: utm?.utm_campaign,
    utm_content: utm?.utm_content,
    utm_term: utm?.utm_term
  };

  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== "") {
      url.searchParams.set(key, String(value));
    }
  }

  return url.toString();
}
