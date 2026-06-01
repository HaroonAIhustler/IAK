"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { CheckCircle2 } from "lucide-react";
import { trackDataLayerEvent, trackPageView, trackPurchaseEvent } from "@/lib/analytics";
import { sendSurveyWebhook } from "@/lib/ghlWebhook";
import { createMetaEventId, trackMetaPageView, trackMetaPurchase } from "@/lib/metaPixel";
import { buildReadableQuestionList, buildReadableSurveyAnswers, getOfferRouting } from "@/lib/scoreCalculator";
import { readSurveySession } from "@/lib/storage";

const razorpayPaymentButtonId = "pl_SsYUUaylulQoBn";

function readPaymentParams() {
  if (typeof window === "undefined") return new URLSearchParams();
  return new URLSearchParams(window.location.search);
}

function webhookString(value: unknown) {
  if (value === undefined || value === null) return "";
  return String(value);
}

export default function PaymentSuccessPage() {
  const trackedRef = useRef(false);

  useEffect(() => {
    if (trackedRef.current) return;

    trackedRef.current = true;
    const stored = readSurveySession();
    const answers = stored.answers ?? {};
    const routing = getOfferRouting(answers);
    const params = readPaymentParams();
    const paymentId = params.get("razorpay_payment_id") ?? params.get("payment_id");
    const paymentLinkStatus = params.get("razorpay_payment_link_status") ?? params.get("payment_status") ?? "paid";
    const paymentAlreadyTracked = window.sessionStorage.getItem(`aigs_payment_success_tracked:${paymentId ?? "unknown"}`) === "1";
    const firstName = answers.first_name?.trim() ?? "";
    const lastName = answers.last_name?.trim() ?? "";
    const name = [firstName, lastName].filter(Boolean).join(" ");
    const utm = stored.utm ?? {};
    const city = answers.city === "Other" ? answers.custom_city : answers.city;

    const payload = {
      source: "AI Growth Studio Interview Accelerator Payment",
      event_type: "payment_event",
      payment_status: "payment_success",
      contact: {
        first_name: firstName,
        last_name: lastName,
        name,
        email: answers.email,
        phone: answers.whatsapp_number,
        whatsapp_number: answers.whatsapp_number,
        resume_score: webhookString(stored.scoreResult?.resume_visibility_score),
        which_city: webhookString(city),
        why_do_you_want_to_change: webhookString(answers.reason_for_change),
        utm_campaign: webhookString(utm.utm_campaign),
        utm_source: webhookString(utm.utm_source),
        utm_term: webhookString(utm.utm_term),
        medium: webhookString(utm.utm_medium),
        content: webhookString(utm.utm_content)
      },
      questions: {
        resume_score: stored.scoreResult?.resume_visibility_score,
        score_label: stored.scoreResult?.score_label,
        ...buildReadableSurveyAnswers(answers),
        list: buildReadableQuestionList(answers)
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
        status: "payment_success",
        provider: "razorpay",
        payment_button_id: razorpayPaymentButtonId,
        payment_id: paymentId,
        payment_link_status: paymentLinkStatus,
        callback_params: Object.fromEntries(params.entries()),
        product: routing.razorpay_product,
        amount: routing.offer_price,
        currency: "INR",
        submitted_at: new Date().toISOString()
      }
    };

    trackPageView("payment_success", {
      funnel_stage: "thank_you",
      page_name: "Payment Success",
      payment_status: "payment_success",
      value: routing.offer_price,
      currency: "INR"
    });
    trackDataLayerEvent("payment_success_page_view", {
      funnel_stage: "thank_you",
      payment_status: "payment_success"
    });
    trackMetaPageView();
    if (!paymentAlreadyTracked) {
      const purchaseEventId = createMetaEventId("Purchase");
      trackDataLayerEvent("razorpay_payment_success", payload);
      trackPurchaseEvent({
        transaction_id: paymentId,
        value: routing.offer_price,
        currency: "INR",
        item_name: routing.razorpay_product,
        payment_provider: "razorpay",
        funnel_stage: "thank_you",
        event_id: purchaseEventId,
        meta_event_id: purchaseEventId
      });
      trackMetaPurchase({
        content_name: routing.razorpay_product,
        value: routing.offer_price,
        currency: "INR",
        status: "payment_success"
      }, {
        email: answers.email,
        phone: answers.whatsapp_number,
        first_name: firstName,
        last_name: lastName
      }, purchaseEventId);
      void sendSurveyWebhook(payload);
    }
  }, []);

  return (
    <main className="payment-success-page">
      <section className="payment-success-shell" aria-label="Payment success">
        <Image src="/assets/logo-aigs-v2.png" alt="AI Growth Studio" width={168} height={54} priority />
        <div className="payment-success-card">
          <span>
            <CheckCircle2 size={34} />
          </span>
          <h1>Your payment is successful</h1>
          <p>
            Access to <strong>Interview Accelerator Kit</strong> will be shared on email and WhatsApp.
          </p>
          <p className="payment-success-card__close">You can now close this page</p>
          <small>Note: If you do not received an email in 5 next minutes - check your spam folder or contact our support team.</small>
        </div>
      </section>
    </main>
  );
}
