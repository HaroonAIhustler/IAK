"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { LogoHeader } from "@/components/LogoHeader";
import { MissingSessionState } from "@/components/MissingSessionState";
import { ScoreCard } from "@/components/ScoreCard";
import { StickyCTA } from "@/components/StickyCTA";
import { trackCtaClickEvent, trackDataLayerEvent, trackPageView } from "@/lib/analytics";
import { trackMetaCustomEvent, trackMetaPageView } from "@/lib/metaPixel";
import { getOfferRouting } from "@/lib/scoreCalculator";
import { buildVideoOfferUrl } from "@/lib/routing";
import { readSurveySession } from "@/lib/storage";
import type { ScoreResult, SurveyAnswers, UtmData } from "@/lib/types";

const scoreMeanings: Record<string, string> = {
  "Critical Visibility Problem":
    "Your resume may be getting submitted, but it is probably not creating recruiter interest yet. This usually happens when the resume is generic, not ATS-ready, or not matched to the role.",
  "Low Resume Visibility":
    "Your resume has some visibility, but it may not be strong enough to consistently turn applications into replies.",
  "Moderate Visibility": "Your resume has a base, but it may still be missing sharper keywords, positioning, or customization.",
  "Good, But Needs Optimization":
    "Your resume is not weak, but optimization can help you attract better-quality recruiter conversations.",
  "Strong Visibility": "Your resume visibility looks strong. The next step is to optimize for better roles and stronger companies."
};

type ResultSession = {
  answers: SurveyAnswers;
  scoreResult: ScoreResult;
  utm: UtmData | null;
};

function getReplyGapInsight(answers: SurveyAnswers) {
  const jobsApplied = answers.jobs_applied ?? "your job";
  const repliesReceived = answers.replies_received ?? "low replies";
  const replyGap = `${repliesReceived} after ${jobsApplied} applications`;
  const isHighVolume = ["50+ jobs", "100+ jobs", "300+ jobs", "I've lost count"].includes(jobsApplied);

  if (repliesReceived === "0 replies" && isHighVolume) {
    return {
      highlight: replyGap,
      message: "means your resume is likely getting filtered or ignored before recruiters see your fit."
    };
  }

  if (repliesReceived === "0 replies") {
    return {
      highlight: replyGap,
      message: "means your resume needs stronger visibility before you send more applications."
    };
  }

  if (repliesReceived === "1-2 replies total" && isHighVolume) {
    return {
      highlight: replyGap,
      message: "shows your resume is creating very limited recruiter interest despite high effort."
    };
  }

  if (repliesReceived === "1-2 replies total") {
    return {
      highlight: replyGap,
      message: "shows your resume is getting some attention, but not enough to build interview momentum."
    };
  }

  if (repliesReceived === "1-2 replies per week") {
    return {
      highlight: replyGap,
      message: "is a good start, but a sharper resume can help you get more consistent interview calls."
    };
  }

  if (repliesReceived === "3-5 replies per week") {
    return {
      highlight: replyGap,
      message: "shows you have traction, and optimization can help you attract better-fit companies."
    };
  }

  if (repliesReceived === "Mostly irrelevant or scam calls") {
    return {
      highlight: repliesReceived,
      message: "means your resume may be attracting the wrong opportunities instead of serious recruiter interest."
    };
  }

  if (repliesReceived === "Calls, but not from good companies") {
    return {
      highlight: repliesReceived,
      message: "means your resume positioning needs to target stronger roles and better companies."
    };
  }

  return {
    highlight: replyGap,
    message: "shows your resume needs stronger visibility."
  };
}

function getScoreTone(score: number) {
  if (score <= 35) return "critical";
  if (score <= 55) return "warning";
  if (score <= 70) return "moderate";
  return "success";
}

export default function ResumeScoreResultPage() {
  const [session, setSession] = useState<ResultSession | null>(null);
  const [hasCheckedSession, setHasCheckedSession] = useState(false);

  useEffect(() => {
    const stored = readSurveySession();
    const nextSession =
      stored.answers && stored.scoreResult
        ? {
            answers: stored.answers,
            scoreResult: stored.scoreResult,
            utm: stored.utm
          }
        : null;

    queueMicrotask(() => {
      setSession(nextSession);
      setHasCheckedSession(true);
    });

    trackPageView("stage_2_result", {
      funnel_stage: "stage_2",
      page_name: "Resume Score Result",
      resume_visibility_score: nextSession?.scoreResult.resume_visibility_score,
      score_label: nextSession?.scoreResult.score_label
    });
    trackDataLayerEvent("stage_2_page_view", {
      funnel_stage: "stage_2",
      has_survey_session: Boolean(nextSession)
    });
    trackMetaPageView();

    if (nextSession) {
      trackDataLayerEvent("result_page_viewed", {
        ...stored.answers,
        ...stored.utm,
        ...stored.scoreResult,
        ...getOfferRouting(nextSession.answers)
      });
    }
  }, []);

  const routing = useMemo(() => (session ? getOfferRouting(session.answers) : null), [session]);

  function handleVideoClick() {
    if (!session || !routing) return;

    const destination = buildVideoOfferUrl(routing, session.answers, session.scoreResult, session.utm);

    trackDataLayerEvent("vsl_cta_clicked", {
      ...session.answers,
      ...session.utm,
      ...session.scoreResult,
      ...routing,
      destination_url: destination
    });
    trackCtaClickEvent({
      funnel_stage: "stage_2",
      cta_name: "Access Interview Accelerator Kit Now",
      cta_location: "stage_2_result",
      destination_url: destination,
      resume_visibility_score: session.scoreResult.resume_visibility_score,
      score_label: session.scoreResult.score_label
    });
    trackMetaCustomEvent("Stage2CTAClick", {
      cta_name: "Access Interview Accelerator Kit Now",
      destination_url: destination,
      value: routing.offer_price,
      currency: "INR"
    });

    window.location.href = destination;
  }

  if (!hasCheckedSession) {
    return (
      <main className="survey-page">
        <section className="survey-shell">
          <LogoHeader />
          <div className="survey-card result-loading">Loading your score...</div>
        </section>
      </main>
    );
  }

  if (!session) {
    return <MissingSessionState />;
  }

  const replyGapInsight = getReplyGapInsight(session.answers);

  return (
    <main className="result-page result-page--stage2">
      <section className="result-shell">
        <LogoHeader />

        <div className="result-stage2">
          <section className="result-stage2__hero">
            <span className={`result-stage2__badge result-stage2__badge--${getScoreTone(session.scoreResult.resume_visibility_score)}`}>
              <ShieldCheck size={15} />
              Your results are private
            </span>
            <h1>
              Hi {session.answers.first_name || "there"},
              <span>
                Getting <b>{replyGapInsight.highlight}</b> {replyGapInsight.message}
              </span>
            </h1>
          </section>

          <div className="result-stage2__grid">
            <ScoreCard scoreResult={session.scoreResult} />

            <aside className="result-stage2__side">
              <div className="result-stage2__insight">
                <div className="result-stage2__insight-icon">!</div>
                <div>
                  <h2>Effort is not the problem</h2>
                  <p>
                    You are applying. The bigger issue is that your resume is not converting applications into recruiter
                    conversations yet.
                  </p>
                </div>
              </div>

              <section className="result-stage2__cta" id="result-final-cta">
                <span className="result-stage2__cta-kicker">Next steps</span>
                <h2>Want to start receiving interview invites in 7 days?</h2>
                <p>Access our proven system to start getting responses faster.</p>
                <button type="button" onClick={handleVideoClick}>
                  Access Interview Accelerator Kit Now
                  <ArrowRight size={18} />
                </button>
              </section>

            
            </aside>
          </div>

          <section className="score-meaning result-stage2__meaning">
            <p>What this means</p>
            <strong>{scoreMeanings[session.scoreResult.score_label]}</strong>
          </section>
        </div>
        <StickyCTA onClick={handleVideoClick} />
      </section>
    </main>
  );
}
