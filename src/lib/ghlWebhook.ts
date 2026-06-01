import type { WebhookStatus } from "@/lib/types";

const backoff = [1000, 3000, 7000];

function wait(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

export async function sendSurveyWebhook(payload: unknown): Promise<WebhookStatus> {
  const webhookUrl = process.env.NEXT_PUBLIC_GHL_WEBHOOK_URL;

  if (!webhookUrl) {
    return {
      ok: false,
      attempts: 0,
      message: "GHL webhook URL is not configured.",
      completed_at: new Date().toISOString()
    };
  }

  let lastMessage = "Webhook request failed.";

  for (let index = 0; index < backoff.length; index += 1) {
    try {
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        return {
          ok: true,
          attempts: index + 1,
          message: "Webhook submitted.",
          completed_at: new Date().toISOString()
        };
      }

      lastMessage = `Webhook returned ${response.status}.`;
    } catch (error) {
      lastMessage = error instanceof Error ? error.message : "Webhook request failed.";
    }

    if (index < backoff.length - 1) {
      await wait(backoff[index]);
    }
  }

  return {
    ok: false,
    attempts: backoff.length,
    message: lastMessage,
    completed_at: new Date().toISOString()
  };
}
