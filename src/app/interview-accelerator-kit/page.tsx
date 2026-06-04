"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import {
  ClipboardCheck,
  FileSearch,
  Linkedin,
  ListChecks,
  MessagesSquare,
  ShieldCheck,
  Star,
  Target,
  Trophy,
  UserRoundCheck
} from "lucide-react";
import { trackCtaClickEvent, trackDataLayerEvent, trackPageView, trackPurchaseEvent } from "@/lib/analytics";
import { sendSurveyWebhook } from "@/lib/ghlWebhook";
import { createMetaEventId, trackMetaCustomEvent, trackMetaInitiateCheckout, trackMetaPageView, trackMetaPurchase } from "@/lib/metaPixel";
import { buildReadableQuestionList, buildReadableSurveyAnswers, getOfferRouting } from "@/lib/scoreCalculator";
import { readSurveySession } from "@/lib/storage";
import type { OfferRouting, ScoreResult, SurveyAnswers, UtmData } from "@/lib/types";

type OfferSession = {
  answers: SurveyAnswers;
  scoreResult: ScoreResult | null;
  routing: OfferRouting;
  utm: UtmData | null;
};

const razorpayPaymentButtonId = "pl_StLvnKaWIS1GzX";

const valueStack = [
  {
    title: "Resume Rejection Decoder",
    value: "₹599",
    icon: FileSearch,
    desc: "Why your resume gets ignored",
    items: ["Resume mistake checklist", "ATS risk indicators", "Before/after resume examples"]
  },
  {
    title: "Tailored Resume Building",
    value: "₹1,499",
    icon: ClipboardCheck,
    desc: "ATS-friendly templates and editor",
    items: ["ATS-friendly templates", "Fresher and experienced formats", "Editable resume sections"]
  },
  {
    title: "JD Match + Review",
    value: "₹1,999",
    icon: Target,
    desc: "Customize per role, fast",
    items: ["JD keyword extraction method", "Resume matching checklist", "Role-specific wording prompts"]
  },
  {
    title: "LinkedIn Profile Builder + Optimizer",
    value: "₹799",
    icon: Linkedin,
    desc: "Recruiter-friendly profile structure",
    items: ["Headline templates", "About section prompts", "Recruiter-friendly profile structure"]
  },
  {
    title: "Real Interview Practice",
    value: "₹999 /-",
    icon: ListChecks,
    desc: "STAR framework and HR questions",
    items: ["Common HR questions", "STAR answer structure", "Confidence-building templates"]
  }
];

const stats = [
  { value: "10,000+", label: "Job seekers helped", icon: UserRoundCheck },
  { value: "95%", label: "Resume Match rate", icon: Trophy },
  { value: "70%", label: "More Responses", icon: Target },
  { value: "4.9/5", label: "Student Rating", icon: Star }
];

const featureCards = [
  {
    title: "Resume Rejection Decoder",
    copy: "Find the hidden reasons your resume is getting ignored",
    icon: FileSearch
  },
  {
    title: "Tailored Resume Building",
    copy: "Build a sharper resume for the exact role you want",
    icon: ClipboardCheck
  },
  {
    title: "JD Match + Review",
    copy: "Match your resume to job descriptions before applying",
    icon: Target
  },
  {
    title: "LinkedIn Profile Builder + Optimizer",
    copy: "Improve your profile so recruiters can trust your fit faster",
    icon: Linkedin
  },
  {
    title: "Real Interview Practice",
    copy: "Experience actual interview questions and scenarios",
    icon: MessagesSquare
  }
];

const stories = [
  {
    quote: "The mock interviews and feedback helped me gain so much confidence. I started getting interview calls within days.",
    name: "Neha Subramani",
    role: "Software Engineer, TCS",
    image: "/assets/testimonial-neha-final.png"
  },
  {
    quote: "Resume building and LinkedIn support were game changers. I stood out and got shortlisted by top companies.",
    name: "Rohan Bopanna",
    role: "Data Analyst, Deloitte",
    image: "/assets/testimonial-rohan-final.png"
  },
  {
    quote: "The structured preparation and expert guidance made cracking interviews so much easier. Highly recommended.",
    name: "Ananya Venkat",
    role: "Associate Consultant, Accenture",
    image: "/assets/testimonial-ananya-final.png"
  }
];

const faqs = [
  {
    question: "Will this guarantee a job?",
    answer:
      "No course or toolkit can honestly guarantee a job. This kit helps you improve resume visibility, customize applications, and prepare better so you can increase your chances of getting replies and interviews."
  },
  {
    question: "I am a fresher. Will this work for me?",
    answer:
      "Yes. The fresher version helps you present projects, skills, education, internships, and training in a more job-ready way, even without full-time experience."
  },
  {
    question: "I already have experience. Is this too basic?",
    answer:
      "No. The experienced version focuses on stronger positioning, role-specific resume customization, LinkedIn optimization, and interview preparation for better opportunities."
  },
  {
    question: "How quickly can I start using the kit?",
    answer:
      "You get instant access after checkout, so you can start improving your resume, LinkedIn profile, and interview preparation the same day."
  },
  {
    question: "Do I need technical skills to use this?",
    answer:
      "No. The kit is designed as a simple step-by-step system with templates, prompts, and examples you can follow even if you are not technical."
  },
  {
    question: "Will this help if I am applying in a competitive city?",
    answer:
      "Yes. The system helps you make your resume sharper, more role-matched, and easier for recruiters to scan even when many candidates are applying."
  }
];

const sideFaqs = faqs.filter(
  (faq) => !["How quickly can I start using the kit?", "Do I need technical skills to use this?"].includes(faq.question)
);

function readQueryParams() {
  if (typeof window === "undefined") return new URLSearchParams();
  return new URLSearchParams(window.location.search);
}

function getFallbackRouting(params: URLSearchParams): OfferRouting {
  void params;

  const segment = "fresher";
  const price = 999;

  return {
    offer_segment: segment,
    offer_price: price,
    video_offer_url: "",
    razorpay_product: "Interview Accelerator Kit"
  };
}

function getHeroCopy(session: OfferSession | null) {
  const firstName = session?.answers.first_name?.trim();
  const hasSurveyData = Boolean(session?.answers.first_name || session?.answers.email || session?.answers.user_segment);

  return {
    firstName,
    hasSurveyData,
    support: "Turn your applications into real interview with a proven system that gets 70% more invites."
  };
}

function getOfferHook(segment: OfferRouting["offer_segment"], price: number) {
  if (segment === "experienced") {
    return `Upgrade your job search system for ₹${price} /- - less than 1% of your first improved salary.`;
  }

  void price;
  return "Costs less than a dinner date.";
}

function getSafeQueryPayload(session: OfferSession | null) {
  if (!session) return {};

  return {
    offer_segment: session.routing.offer_segment,
    offer_price: session.routing.offer_price,
    resume_visibility_score: session.scoreResult?.resume_visibility_score,
    score_label: session.scoreResult?.score_label,
    target_field: session.answers.target_field,
    city: session.answers.city === "Other" ? session.answers.custom_city : session.answers.city,
    utm_source: session.utm?.utm_source,
    utm_medium: session.utm?.utm_medium,
    utm_campaign: session.utm?.utm_campaign,
    utm_content: session.utm?.utm_content,
    utm_term: session.utm?.utm_term,
    platform: session.utm?.platform
  };
}

function webhookString(value: unknown) {
  if (value === undefined || value === null) return "";
  return String(value);
}

function getPaymentContact(session: OfferSession | null) {
  const firstName = session?.answers.first_name?.trim() ?? "";
  const lastName = session?.answers.last_name?.trim() ?? "";
  const fullName = [firstName, lastName].filter(Boolean).join(" ");
  const city = session?.answers.city === "Other" ? session.answers.custom_city : session?.answers.city;

  return {
    first_name: firstName,
    last_name: lastName,
    name: fullName || "AI Growth Studio Learner",
    email: session?.answers.email?.trim() ?? "",
    phone: session?.answers.whatsapp_number?.trim() ?? "",
    whatsapp_number: session?.answers.whatsapp_number?.trim() ?? "",
    resume_score: webhookString(session?.scoreResult?.resume_visibility_score),
    which_city: webhookString(city),
    why_do_you_want_to_change: webhookString(session?.answers.reason_for_change),
    utm_campaign: webhookString(session?.utm?.utm_campaign),
    utm_source: webhookString(session?.utm?.utm_source),
    utm_term: webhookString(session?.utm?.utm_term),
    medium: webhookString(session?.utm?.utm_medium),
    content: webhookString(session?.utm?.utm_content)
  };
}

function buildPaymentWebhookPayload(
  session: OfferSession | null,
  routing: OfferRouting,
  paymentStatus: string,
  extra: Record<string, unknown> = {}
) {
  const contact = getPaymentContact(session);

  return {
    source: "AI Growth Studio Interview Accelerator Payment",
    event_type: "payment_event",
    payment_status: paymentStatus,
    contact,
    questions: {
      resume_score: session?.scoreResult?.resume_visibility_score,
      score_label: session?.scoreResult?.score_label,
      ...buildReadableSurveyAnswers(session?.answers ?? {}),
      list: buildReadableQuestionList(session?.answers ?? {})
    },
    utm: {
      campaign: session?.utm?.utm_campaign,
      source: session?.utm?.utm_source,
      term: session?.utm?.utm_term,
      medium: session?.utm?.utm_medium,
      content: session?.utm?.utm_content,
      platform: session?.utm?.platform,
      landing_page_url: session?.utm?.landing_page_url
    },
    payments: {
      status: paymentStatus,
      provider: "razorpay",
      payment_button_id: razorpayPaymentButtonId,
      product: routing.razorpay_product,
      amount: routing.offer_price,
      currency: "INR",
      submitted_at: new Date().toISOString(),
      ...extra
    }
  };
}

type RazorpayPaymentButtonProps = {
  label: string;
  className?: string;
  onPaymentClick: () => void;
};

function RazorpayPaymentButton({ label, className = "", onPaymentClick }: RazorpayPaymentButtonProps) {
  const formRef = useRef<HTMLFormElement | null>(null);

  useEffect(() => {
    const form = formRef.current;

    if (!form) return;

    form.querySelectorAll("script, .razorpay-payment-button").forEach((node) => node.remove());
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/payment-button.js";
    script.async = true;
    script.setAttribute("data-payment_button_id", razorpayPaymentButtonId);
    script.onload = () => {
      const button = form.querySelector<HTMLButtonElement | HTMLInputElement>(".razorpay-payment-button");

      if (button) {
        button.setAttribute("aria-label", label);
      }
    };
    form.appendChild(script);

    return () => {
      form.querySelectorAll("script, .razorpay-payment-button").forEach((node) => node.remove());
    };
  }, [label]);

  return (
    <form
      className={`razorpay-payment-form ${className}`.trim()}
      ref={formRef}
      onClick={onPaymentClick}
      onSubmit={(event) => event.preventDefault()}
      aria-label={label}
    >
      <span className="razorpay-payment-form__label">{label}</span>
    </form>
  );
}

export default function InterviewAcceleratorKitPage() {
  const [session, setSession] = useState<OfferSession | null>(null);
  const [activeStory, setActiveStory] = useState(0);
  const trackedReturnRef = useRef(false);

  useEffect(() => {
    const stored = readSurveySession();
    const params = readQueryParams();
    const fallbackRouting = getFallbackRouting(params);
    const answers = stored.answers ?? {};
    const routing = stored.answers ? getOfferRouting(stored.answers) : fallbackRouting;
    const nextSession = {
      answers,
      scoreResult: stored.scoreResult,
      routing,
      utm: stored.utm
    };

    queueMicrotask(() => {
      setSession(nextSession);
    });
    trackPageView("stage_3_offer", {
      funnel_stage: "stage_3",
      page_name: "Interview Accelerator Kit",
      ...getSafeQueryPayload(nextSession)
    });
    trackDataLayerEvent("stage_3_page_view", {
      funnel_stage: "stage_3",
      ...getSafeQueryPayload(nextSession)
    });
    trackMetaPageView();
    trackDataLayerEvent("offer_page_viewed", getSafeQueryPayload(nextSession));
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveStory((current) => (current + 1) % stories.length);
    }, 4200);

    return () => window.clearInterval(timer);
  }, []);

  const heroCopy = useMemo(() => getHeroCopy(session), [session]);
  const routing = session?.routing ?? getFallbackRouting(readQueryParams());
  const offerPrice = routing.offer_price;
  const formattedOfferPrice = `₹${offerPrice} /-`;
  const ctaLabel = `Get the Kit for ${formattedOfferPrice}`;
  const totalValue = 5895;
  const savings = totalValue - offerPrice;

  const sendPaymentEvent = useCallback((paymentStatus: string, extra: Record<string, unknown> = {}) => {
    const payload = buildPaymentWebhookPayload(session, routing, paymentStatus, extra);

    trackDataLayerEvent(`razorpay_${paymentStatus}`, payload);
    if (paymentStatus === "payment_success") {
      trackPurchaseEvent({
        transaction_id: extra.razorpay_payment_id,
        value: routing.offer_price,
        currency: "INR",
        item_name: routing.razorpay_product,
        payment_provider: "razorpay",
        funnel_stage: "stage_3",
        event_id: typeof extra.event_id === "string" ? extra.event_id : undefined,
        meta_event_id: typeof extra.event_id === "string" ? extra.event_id : undefined
      });
      trackMetaPurchase({
        content_name: routing.razorpay_product,
        value: routing.offer_price,
        currency: "INR",
        ...getSafeQueryPayload(session)
      }, getPaymentContact(session), typeof extra.event_id === "string" ? extra.event_id : undefined);
    }
    if (paymentStatus === "payment_failed") {
      trackDataLayerEvent("payment_failed", {
        value: routing.offer_price,
        currency: "INR",
        item_name: routing.razorpay_product,
        payment_provider: "razorpay",
        funnel_stage: "stage_3",
        ...extra
      });
      trackMetaCustomEvent("PaymentFailed", {
        content_name: routing.razorpay_product,
        value: routing.offer_price,
        currency: "INR",
        ...extra
      });
    }
    void sendSurveyWebhook(payload);
  }, [routing, session]);

  useEffect(() => {
    if (!session || trackedReturnRef.current) return;

    const params = readQueryParams();
    const paymentId = params.get("razorpay_payment_id") ?? params.get("payment_id");
    const paymentLinkStatus = params.get("razorpay_payment_link_status") ?? params.get("payment_status");
    const failureReason = params.get("error_reason") ?? params.get("error_description");

    if (!paymentId && !paymentLinkStatus && !failureReason) return;

    trackedReturnRef.current = true;
    const normalizedStatus =
      paymentLinkStatus?.toLowerCase() === "paid" || paymentId
        ? "payment_success"
        : "payment_failed";

    if (normalizedStatus === "payment_success") {
      window.sessionStorage.setItem(`aigs_payment_success_tracked:${paymentId ?? "unknown"}`, "1");
    }

    const paymentEventId = createMetaEventId("Purchase");
    sendPaymentEvent(normalizedStatus, {
      razorpay_payment_id: paymentId,
      razorpay_payment_link_status: paymentLinkStatus,
      failure_reason: failureReason,
      callback_params: Object.fromEntries(params.entries()),
      event_id: paymentEventId,
      meta_event_id: paymentEventId
    });

    if (normalizedStatus === "payment_success") {
      window.setTimeout(() => {
        window.location.replace(`/payment-success${window.location.search}`);
      }, 300);
    }
  }, [sendPaymentEvent, session]);

  function handleCheckoutClick(location: string) {
    const checkoutEventId = createMetaEventId("InitiateCheckout");
    const payload = {
      ...getSafeQueryPayload(session),
      cta_location: location,
      razorpay_product: routing.razorpay_product,
      event_id: checkoutEventId,
      meta_event_id: checkoutEventId
    };

    trackDataLayerEvent("payment_cta_clicked", payload);
    trackCtaClickEvent({
      funnel_stage: "stage_3",
      cta_name: "Payment CTA",
      ...payload
    });
    trackMetaInitiateCheckout({
      content_name: routing.razorpay_product,
      value: offerPrice,
      currency: "INR",
      ...payload
    }, getPaymentContact(session), checkoutEventId);
    sendPaymentEvent("checkout_opened", { cta_location: location });
    sendPaymentEvent("payment_button_clicked", { cta_location: location });
  }

  return (
    <main className="offer-page offer-page--stage3">
      <section className="offer-shell">
        <header className="accelerator-header">
          <a className="accelerator-brand" href="#top" aria-label="AI Growth Studio">
            <Image src="/assets/logo-aigs-v2.png" alt="AI Growth Studio" width={168} height={54} priority />
          </a>
          <span className="accelerator-audience">For Active Job Seekers</span>
        </header>

        <section className="stage3-hero" id="top">
          <div className="stage3-hero__intro">
            {heroCopy.firstName ? <p className="stage3-hero__name">{heroCopy.firstName},</p> : null}
            {heroCopy.hasSurveyData ? (
              <h1>
                What if 5 AI Agents <span>line up 10+ interviews</span> within 7 days?
              </h1>
            ) : (
              <h1>What if 5 AI Agents could get you interview calls in 7 days</h1>
            )}
            <p>{heroCopy.support}</p>
            <div className="stage3-without-list" aria-label="What this helps you avoid">
              <span><ShieldCheck size={17} /> Without applying to 100+ jobs daily</span>
              <span><ShieldCheck size={17} /> Without waiting for weeks to get replies</span>
              <span><ShieldCheck size={17} /> Without getting filtered out by ATS</span>
            </div>
          </div>

          <div className="stage3-hero__grid">
            <div className="stage3-hero-image" aria-label="Interview Accelerator Kit preview">
              <Image src="/assets/interview-accelerator-hero.png" alt="" fill sizes="(max-width: 900px) 100vw, 720px" priority />
            </div>

            <aside className="stage3-offer-card">
              <div className="stage3-offer-card__top">
                <span className="stage3-badge stage3-badge--success">Limited period offer</span>
                <small>Save ₹{savings}</small>
              </div>
              <h2>Interview Accelerator Kit</h2>
              <p><strong>Get lifetime access</strong> to Job application system that gets 70% more responses.</p>
              <div className="stage3-price">
                <span>₹{totalValue}</span>
                <strong>{formattedOfferPrice}</strong>
                <em>-{Math.round((savings / totalValue) * 100)}%</em>
              </div>
              <small className="stage3-offer-note">
                Costs less than a dinner date.
              </small>
              <RazorpayPaymentButton
                label="Get Interview Accelerator Kit"
                className="stage3-razorpay-cta"
                onPaymentClick={() => handleCheckoutClick("hero_offer")}
              />
              <div className="stage3-proof">
                <span><ShieldCheck size={13} /> 7-Day Money Back Guarantee</span>
                <span>Instant Access</span>
                <span>Razorpay</span>
              </div>
            </aside>
          </div>
        </section>

        <section className="accelerator-stats" aria-label="Program stats">
          {stats.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label}>
                <span><Icon size={26} /></span>
                <strong>{item.value}</strong>
                <p>{item.label}</p>
              </div>
            );
          })}
        </section>

        <section className="accelerator-inside" id="inside">
          <div className="accelerator-section-title">
            <p>What&apos;s inside</p>
            <h2>Everything You Need to Get Interview Calls & <span>Get Hired</span></h2>
          </div>
          <p className="stage3-section-copy">Built specifically for Indian job seekers.</p>
          <div className="stage3-stack-layout">
            <div className="stage3-stack">
              {valueStack.map((item) => {
                const Icon = item.icon;
                return (
                  <div className="stage3-stack-row" key={item.title}>
                    <span><Icon size={22} /></span>
                    <div>
                      <strong>{item.title}</strong>
                      <small>{item.desc}</small>
                    </div>
                    <em>{item.value}</em>
                  </div>
                );
              })}
              <div className="stage3-stack-total">
                <div>
                  <span>Total value</span>
                  <strong>₹{totalValue}</strong>
                </div>
                <div>
                  <span>You pay today</span>
                  <strong>{formattedOfferPrice}</strong>
                  <em>Save ₹{savings}</em>
                </div>
              </div>
            </div>

            <aside className="stage3-side">
              <div className="stage3-guarantee">
                <span><ShieldCheck size={24} /></span>
                <h3>7-Day Money Back Guarantee</h3>
                <p>Try the Kit for 7 days. If it is not useful, email us and we will refund you.</p>
              </div>
              <div className="stage3-mini-faq">
                {sideFaqs.map((faq, index) => (
                  <details key={faq.question} open={index === 0}>
                    <summary>{faq.question}</summary>
                    <p>{faq.answer}</p>
                  </details>
                ))}
              </div>
            </aside>
            <RazorpayPaymentButton
              label={ctaLabel}
              className="stage3-wide-cta stage3-razorpay-cta"
              onPaymentClick={() => handleCheckoutClick("value_stack")}
            />
          </div>
        </section>

        <section className="accelerator-features" id="features">
          <div className="accelerator-section-title">
            <p className="accelerator-section-title__green">All-in-one support</p>
            <h2>All the tools you need to<br /><span>get interview invites within 7 days</span></h2>
          </div>
          <div className="accelerator-feature-grid">
            {featureCards.map((feature) => {
              const Icon = feature.icon;
              return (
                <article key={feature.title}>
                  <span><Icon size={28} /></span>
                  <h3>{feature.title}</h3>
                  <p>{feature.copy}</p>
                </article>
              );
            })}
          </div>
        </section>

        <section className="accelerator-stories" id="stories">
          <div className="accelerator-section-title">
            <p>Success stories</p>
            <h2>From Preparation to Placement</h2>
          </div>
          <div className="accelerator-story-grid accelerator-story-slider">
            {stories.map((story, index) => (
              <article className={index === activeStory ? "is-active" : ""} key={story.name}>
                <p>&quot;{story.quote}&quot;</p>
                <div>
                  <Image src={story.image} alt={story.name} width={56} height={56} />
                  <strong>{story.name}<small>{story.role}</small></strong>
                </div>
              </article>
            ))}
          </div>
          <div className="accelerator-dots" aria-label="Success story slides">
            {stories.map((story, index) => (
              <button
                type="button"
                className={index === activeStory ? "is-active" : ""}
                key={story.name}
                onClick={() => setActiveStory(index)}
                aria-label={`Show ${story.name} story`}
              />
            ))}
          </div>
        </section>

        <section className="accelerator-pricing" id="pricing">
          <div>
            <p>Total value</p>
            <strong>₹{totalValue}</strong>
          </div>
          <div>
            <p>Today</p>
            <strong>{formattedOfferPrice}</strong>
          </div>
          <p>{getOfferHook(routing.offer_segment, offerPrice)}</p>
          <RazorpayPaymentButton
            label={ctaLabel}
            className="stage3-razorpay-cta"
            onPaymentClick={() => handleCheckoutClick("pricing")}
          />
        </section>

        <section className="offer-faq accelerator-faq" id="faq">
          <div className="accelerator-section-title">
            <p>FAQ</p>
            <h2>Common questions</h2>
          </div>
          {faqs.map((faq) => (
            <details key={faq.question}>
              <summary>{faq.question}</summary>
              <p>{faq.answer}</p>
            </details>
          ))}
        </section>

        <section className="accelerator-final">
          <div>
            <h2>Ready to start getting interview calls?</h2>
            <p>Get the complete system, apply smarter, and build momentum within the next 7 days.</p>
            <RazorpayPaymentButton
              label="Get Interview Accelerator Kit Now"
              className="stage3-razorpay-cta"
              onPaymentClick={() => handleCheckoutClick("final_cta")}
            />
          </div>
          <div className="accelerator-final__image accelerator-final__image--mobile-hidden">
            <Image
              className="accelerator-final__asset"
              src="/assets/stage3-final-cta.png"
              alt=""
              width={520}
              height={520}
            />
          </div>
        </section>
      </section>

    </main>
  );
}
