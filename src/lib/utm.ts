import type { UtmData } from "@/lib/types";

const keys = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"] as const;

export function captureUtm(): UtmData {
  const params = new URLSearchParams(window.location.search);
  const data: UtmData = {
    landing_page_url: window.location.href,
    platform: params.get("platform") ?? (params.get("utm_source") === "facebook" ? "Meta" : undefined)
  };

  for (const key of keys) {
    data[key] = params.get(key) ?? undefined;
  }

  sessionStorage.setItem("ags_resume_utm", JSON.stringify(data));
  return data;
}
