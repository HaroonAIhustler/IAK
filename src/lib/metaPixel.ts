import type { ScoreResult, SurveyAnswers } from "@/lib/types";

type MetaUserData = {
  email?: string;
  phone?: string;
  first_name?: string;
  last_name?: string;
};

function getCookie(name: string) {
  if (typeof document === "undefined") return undefined;
  return document.cookie
    .split("; ")
    .find((item) => item.startsWith(`${name}=`))
    ?.split("=")[1];
}

export function createMetaEventId(eventName: string) {
  return `${eventName.toLowerCase()}_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

function sendMetaCapiEvent(eventName: string, customData: Record<string, unknown>, userData: MetaUserData, eventId: string) {
  if (typeof window === "undefined") return;

  void fetch("/api/meta-capi", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      event_name: eventName,
      event_id: eventId,
      event_source_url: window.location.href,
      custom_data: customData,
      user_data: {
        ...userData,
        fbp: getCookie("_fbp"),
        fbc: getCookie("_fbc"),
        client_user_agent: navigator.userAgent
      }
    })
  });
}

export function trackMetaLead(answers: SurveyAnswers, scoreResult: ScoreResult, eventId = createMetaEventId("Lead")) {
  if (typeof window === "undefined") return;

  const customData = {
    content_name: "Resume Visibility Score Survey",
    content_category: "Career Funnel",
    value: 0,
    currency: "INR",
    status: scoreResult.score_label,
    user_segment: answers.user_segment,
    city: answers.city === "Other" ? answers.custom_city : answers.city,
    state: answers.state,
    target_field: answers.target_field,
    resume_visibility_score: scoreResult.resume_visibility_score
  };
  const userData = {
    email: answers.email,
    phone: answers.whatsapp_number,
    first_name: answers.first_name,
    last_name: answers.last_name
  };

  sendMetaCapiEvent("Lead", customData, userData, eventId);
}

export function trackMetaPageView() {
  // Browser PageView is fired through GTM to avoid duplicate Meta Pixel events.
}

export function trackMetaCustomEvent(event: string, payload: Record<string, unknown> = {}) {
  // Browser custom events are fired through GTM dataLayer events.
  void event;
  void payload;
}

export function trackMetaInitiateCheckout(payload: Record<string, unknown> = {}, userData: MetaUserData = {}, eventId = createMetaEventId("InitiateCheckout")) {
  if (typeof window === "undefined") return;

  sendMetaCapiEvent("InitiateCheckout", payload, userData, eventId);
}

export function trackMetaPurchase(payload: Record<string, unknown> = {}, userData: MetaUserData = {}, eventId = createMetaEventId("Purchase")) {
  if (typeof window === "undefined") return;

  sendMetaCapiEvent("Purchase", payload, userData, eventId);
}
