import type { ScoreResult, SurveyAnswers, UtmData, WebhookStatus } from "@/lib/types";

export const storageKeys = {
  answers: "ags_resume_survey_answers",
  utm: "ags_resume_utm",
  result: "ags_resume_score_result",
  submission: "ags_resume_submission_status"
} as const;

export function saveSurveySession(answers: SurveyAnswers, scoreResult: ScoreResult, utm: UtmData) {
  sessionStorage.setItem(storageKeys.answers, JSON.stringify(answers));
  sessionStorage.setItem(storageKeys.result, JSON.stringify(scoreResult));
  sessionStorage.setItem(storageKeys.utm, JSON.stringify(utm));
}

export function saveSubmissionStatus(status: WebhookStatus) {
  sessionStorage.setItem(storageKeys.submission, JSON.stringify(status));
}

function readJson<T>(key: string): T | null {
  try {
    const raw = sessionStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

export function readSurveySession() {
  return {
    answers: readJson<SurveyAnswers>(storageKeys.answers),
    scoreResult: readJson<ScoreResult>(storageKeys.result),
    utm: readJson<UtmData>(storageKeys.utm),
    submissionStatus: readJson<WebhookStatus>(storageKeys.submission)
  };
}
