import type { SurveyAnswers } from "@/lib/types";

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
  }
}

export function trackDataLayerEvent(event: string, payload: SurveyAnswers | Record<string, unknown>) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event,
    landing_page_url: window.location.href,
    ...payload
  });
}

export function trackPageView(stage: string, payload: Record<string, unknown> = {}) {
  trackDataLayerEvent("page_view", {
    page_stage: stage,
    page_path: window.location.pathname,
    page_title: document.title,
    ...payload
  });
}

export function trackLeadEvent(payload: Record<string, unknown> = {}) {
  trackDataLayerEvent("generate_lead", {
    lead_source: "Resume Visibility Score Survey",
    ...payload
  });
}

export function trackCtaClickEvent(payload: Record<string, unknown> = {}) {
  trackDataLayerEvent("cta_click", payload);
}

export function trackPurchaseEvent(payload: Record<string, unknown> = {}) {
  trackDataLayerEvent("purchase", payload);
}
