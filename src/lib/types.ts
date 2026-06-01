export type SurveyAnswers = {
  user_segment?: string;
  experience_years?: string;
  reason_for_change?: string;
  jobs_applied?: string;
  replies_received?: string;
  application_outcome?: string;
  city?: string;
  state?: string;
  custom_city?: string;
  education_background?: string;
  graduation_year?: string;
  field_of_study?: string;
  target_field?: string;
  digital_marketing_training?: string;
  resume_usage?: string;
  tried_before?: string;
  ats_awareness?: string;
  ai_proficiency?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  whatsapp_number?: string;
  [key: string]: string | undefined;
};

export type UtmData = {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  platform?: string;
  landing_page_url?: string;
};

export type ScoreResult = {
  resume_visibility_score: number;
  score_label: string;
  score_slug: string;
  subscores: {
    effortOutcomeScore: number;
    applicationOutcomeScore: number;
    resumeUsageScore: number;
    atsAwarenessScore: number;
    triedBeforeScore: number;
    fieldMatchScore: number;
    aiProficiencyScore: number;
    digitalMarketingTrainingModifier: number;
  };
};

export type OfferRouting = {
  offer_segment: "fresher" | "experienced";
  offer_price: 999;
  video_offer_url: string;
  razorpay_product: string;
};

export type WebhookStatus = {
  ok: boolean;
  attempts: number;
  message: string;
  completed_at: string;
};
