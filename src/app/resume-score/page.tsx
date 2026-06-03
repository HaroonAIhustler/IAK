"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowLeft, Check, Lock, Sparkles } from "lucide-react";
import { ContactSlide } from "@/components/ContactSlide";
import { LoadingAnalysis } from "@/components/LoadingAnalysis";
import { LogoHeader } from "@/components/LogoHeader";
import { OptionCardList } from "@/components/OptionCardList";
import { ProgressBar } from "@/components/ProgressBar";
import { SearchableCitySelect } from "@/components/SearchableCitySelect";
import { UnsupportedFieldSlide } from "@/components/UnsupportedFieldSlide";
import { getVisibleQuestions, surveyQuestions } from "@/data/surveyQuestions";
import { sendSurveyWebhook } from "@/lib/ghlWebhook";
import { trackDataLayerEvent, trackLeadEvent, trackPageView } from "@/lib/analytics";
import { createMetaEventId, trackMetaLead, trackMetaPageView } from "@/lib/metaPixel";
import { buildWebhookPayload, calculateResumeScore, getOfferRouting, getTags } from "@/lib/scoreCalculator";
import { saveSubmissionStatus, saveSurveySession } from "@/lib/storage";
import { captureUtm } from "@/lib/utm";
import { validateContact } from "@/lib/validation";
import type { SurveyAnswers } from "@/lib/types";

const initialAnswers: SurveyAnswers = {};
const unsupportedTargetFields = new Set(["Civil service or public service", "Government office"]);

export default function ResumeScorePage() {
  const router = useRouter();
  const [answers, setAnswers] = useState<SurveyAnswers>(initialAnswers);
  const [stepIndex, setStepIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [started, setStarted] = useState(false);
  const [unsupportedMode, setUnsupportedMode] = useState(false);
  const [unsupportedCollecting, setUnsupportedCollecting] = useState(false);
  const [unsupportedSubmitted, setUnsupportedSubmitted] = useState(false);
  const [unsupportedContact, setUnsupportedContact] = useState({ name: "", email: "" });
  const [unsupportedError, setUnsupportedError] = useState("");

  const visibleQuestions = useMemo(() => getVisibleQuestions(answers), [answers]);
  const currentQuestion = visibleQuestions[stepIndex];
  const isContactStep = stepIndex >= visibleQuestions.length;
  const totalSteps = visibleQuestions.length + 1;
  const progress = Math.min(((stepIndex + 1) / totalSteps) * 100, 100);

  useEffect(() => {
    trackPageView("stage_1_survey", { funnel_stage: "stage_1", page_name: "Resume Score Survey" });
    trackDataLayerEvent("stage_1_page_view", { funnel_stage: "stage_1" });
    trackMetaPageView();
  }, []);

  function updateAnswer(key: keyof SurveyAnswers, value: string) {
    if (!started) {
      setStarted(true);
      trackDataLayerEvent("survey_started", answers);
    }

    setAnswers((current) => {
      const next = { ...current, [key]: value };
      const stillVisible = getVisibleQuestions(next);
      const visibleKeys = new Set(stillVisible.map((question) => question.key));

      for (const question of surveyQuestions) {
        if (!visibleKeys.has(question.key)) {
          delete next[question.key];
        }
      }

      if (key === "city") {
        next.custom_city = "";
      }

      if (key === "target_field" && unsupportedTargetFields.has(value)) {
        setUnsupportedMode(true);
        setUnsupportedCollecting(false);
        setUnsupportedSubmitted(false);
        setUnsupportedError("");
      }

      return next;
    });
  }

  function completeDropdownStep(key: keyof SurveyAnswers, value: string) {
    updateAnswer(key, value);
    trackDataLayerEvent("survey_slide_completed", { ...answers, [key]: value, slide_key: key });
    window.setTimeout(() => {
      setStepIndex((current) => Math.min(current + 1, totalSteps - 1));
    }, 220);
  }

  function goBack() {
    setFormError("");
    setStepIndex((current) => Math.max(current - 1, 0));
  }

  function goForward() {
    if (!currentQuestion) return;
    trackDataLayerEvent("survey_slide_completed", {
      ...answers,
      slide_key: currentQuestion.key
    });
    setStepIndex((current) => Math.min(current + 1, totalSteps - 1));
  }

  async function submitSurvey(contactAnswers: SurveyAnswers) {
    const mergedAnswers = { ...answers, ...contactAnswers };
    const validation = validateContact(mergedAnswers);

    if (!validation.valid) {
      setFormError(validation.message);
      setAnswers(mergedAnswers);
      return;
    }

    setFormError("");
    setAnswers(mergedAnswers);
    setIsLoading(true);

    const utm = captureUtm();
    const scoreResult = calculateResumeScore(mergedAnswers);
    const routing = getOfferRouting(mergedAnswers);
    const tags = getTags(mergedAnswers, scoreResult);
    const leadEventId = createMetaEventId("Lead");

    saveSurveySession(mergedAnswers, scoreResult, utm);

    trackDataLayerEvent("survey_completed", {
      ...mergedAnswers,
      ...utm,
      ...scoreResult,
      ...routing
    });
    trackDataLayerEvent("resume_score_generated", {
      ...mergedAnswers,
      ...utm,
      ...scoreResult,
      ...routing
    });
    trackLeadEvent({
      funnel_stage: "stage_1",
      user_segment: mergedAnswers.user_segment,
      target_field: mergedAnswers.target_field,
      city: mergedAnswers.city === "Other" ? mergedAnswers.custom_city : mergedAnswers.city,
      resume_visibility_score: scoreResult.resume_visibility_score,
      score_label: scoreResult.score_label,
      offer_price: routing.offer_price,
      event_id: leadEventId,
      meta_event_id: leadEventId
    });
    trackMetaLead(mergedAnswers, scoreResult, leadEventId);

    const payload = buildWebhookPayload(mergedAnswers, scoreResult, routing, utm, tags);
    const status = await sendSurveyWebhook(payload);
    saveSubmissionStatus(status);

    const loadingDelay = 3000 + Math.floor(Math.random() * 2001);
    window.setTimeout(() => {
      router.push("/resume-score-result");
    }, loadingDelay);
  }

  async function submitUnsupportedContact() {
    const name = unsupportedContact.name.trim();
    const email = unsupportedContact.email.trim().toLowerCase();

    if (!name || !email) {
      setUnsupportedError("Please enter your name and email.");
      return;
    }

    if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
      setUnsupportedError("Please enter a valid email address.");
      return;
    }

    setUnsupportedError("");
    const utm = captureUtm();
    const payload = {
      source: "AI Growth Studio Unsupported Field Waitlist",
      event_type: "unsupported_field_waitlist",
      contact: {
        first_name: name,
        name,
        email,
        target_field: answers.target_field ?? "",
        utm_campaign: utm.utm_campaign ?? "",
        utm_source: utm.utm_source ?? "",
        utm_term: utm.utm_term ?? "",
        medium: utm.utm_medium ?? "",
        content: utm.utm_content ?? ""
      },
      questions: {
        what_best_describes_you: answers.user_segment,
        which_field_do_you_want_to_work_in: answers.target_field
      },
      utm: {
        campaign: utm.utm_campaign,
        source: utm.utm_source,
        term: utm.utm_term,
        medium: utm.utm_medium,
        content: utm.utm_content,
        platform: utm.platform,
        landing_page_url: utm.landing_page_url
      },
      payments: {
        status: "not_applicable",
        reason: "unsupported_target_field",
        submitted_at: new Date().toISOString()
      }
    };

    trackDataLayerEvent("unsupported_field_waitlist_submitted", payload);
    await sendSurveyWebhook(payload);
    setUnsupportedSubmitted(true);
  }

  return (
    <main className="survey-page survey-page--funnel">
      <section className="survey-shell" aria-label="Resume Visibility Score Survey">
        <LogoHeader />

        {isLoading ? (
          <div className="loading-bridge">
            <LoadingAnalysis />
          </div>
        ) : (
        <div className="survey-layout">
          <div className="survey-card">
            <div className="survey-visual" aria-hidden="true">
              <div className="survey-visual__copy">
                <strong>
                  <span>See what is keeping recruiters</span>
                  <span>from noticing you</span>
                </strong>
              </div>
              <div className="survey-visual__image">
                <Image src="/assets/survey-banner-stage-1.png" alt="" fill sizes="260px" priority />
              </div>
            </div>
            <ProgressBar value={progress} />

            <div className="survey-card__topline">
              {stepIndex > 0 && !unsupportedMode ? (
                <button className="icon-button" type="button" onClick={goBack} aria-label="Go back">
                  <ArrowLeft size={19} />
                </button>
              ) : (
                <span className="icon-button icon-button--ghost" aria-hidden="true">
                  <Sparkles size={19} />
                </span>
              )}
              <span className="privacy-pill">
                <Lock size={14} />
                Takes less than 60 seconds. Your result is private.
              </span>
            </div>

            {unsupportedMode ? (
              <UnsupportedFieldSlide
                contact={unsupportedContact}
                error={unsupportedError}
                isCollecting={unsupportedCollecting}
                isSubmitted={unsupportedSubmitted}
                selectedField={answers.target_field}
                onStartContact={() => setUnsupportedCollecting(true)}
                onChange={(key, value) => setUnsupportedContact((current) => ({ ...current, [key]: value }))}
                onSubmit={submitUnsupportedContact}
              />
            ) : isContactStep ? (
              <ContactSlide answers={answers} error={formError} onChange={updateAnswer} onSubmit={submitSurvey} />
            ) : currentQuestion?.type === "city" ? (
              <div className="question-slide">
                <h1>{currentQuestion.question}</h1>
                {currentQuestion.microcopy ? <p className="question-copy">{currentQuestion.microcopy}</p> : null}
                <SearchableCitySelect
                  selectedCity={answers.city}
                  customCity={answers.custom_city}
                  state={answers.state}
                  onSelect={(city, state) => {
                    updateAnswer("city", city);
                    updateAnswer("state", state);
                    if (city !== "Other") {
                      trackDataLayerEvent("survey_slide_completed", { ...answers, city, state, slide_key: "city" });
                      window.setTimeout(() => setStepIndex((current) => Math.min(current + 1, totalSteps - 1)), 220);
                    }
                  }}
                  onCustomCityChange={(value) => {
                    updateAnswer("custom_city", value);
                    updateAnswer("state", "Other");
                  }}
                />
                {answers.city === "Other" && answers.custom_city ? (
                  <button className="primary-button" type="button" onClick={goForward}>
                    Continue <Check size={18} />
                  </button>
                ) : answers.city && answers.city !== "Other" ? (
                  <button className="primary-button" type="button" onClick={goForward}>
                    Continue <Check size={18} />
                  </button>
                ) : null}
              </div>
            ) : (
              <div className="question-slide">
                <h1>{currentQuestion.question}</h1>
                {currentQuestion.microcopy ? <p className="question-copy">{currentQuestion.microcopy}</p> : null}
                <OptionCardList
                  value={answers[currentQuestion.key] ?? ""}
                  options={currentQuestion.options ?? []}
                  onSelect={(value) => completeDropdownStep(currentQuestion.key, value)}
                />
                {answers[currentQuestion.key] ? (
                  <button className="primary-button" type="button" onClick={goForward}>
                    Continue <Check size={18} />
                  </button>
                ) : null}
              </div>
            )}
          </div>
        </div>
        )}
      </section>
    </main>
  );
}
