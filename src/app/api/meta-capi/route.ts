import { createHash } from "crypto";
import { NextResponse } from "next/server";

type MetaCapiRequest = {
  event_name?: string;
  event_id?: string;
  event_source_url?: string;
  custom_data?: Record<string, unknown>;
  user_data?: {
    email?: string;
    phone?: string;
    first_name?: string;
    last_name?: string;
    fbp?: string;
    fbc?: string;
    client_user_agent?: string;
  };
};

function sha256(value?: string) {
  const normalized = value?.trim().toLowerCase();

  if (!normalized) return undefined;
  return createHash("sha256").update(normalized).digest("hex");
}

function normalizePhone(value?: string) {
  if (!value) return undefined;
  const digits = value.replace(/\D/g, "");

  if (!digits) return undefined;
  return digits.startsWith("91") ? digits : `91${digits}`;
}

export async function POST(request: Request) {
  const pixelId = process.env.META_PIXEL_ID;
  const accessToken = process.env.META_CAPI_ACCESS_TOKEN;

  if (!pixelId || !accessToken) {
    return NextResponse.json({
      ok: false,
      skipped: true,
      message: "Meta Pixel ID or CAPI access token is not configured."
    });
  }

  const body = (await request.json()) as MetaCapiRequest;

  if (!body.event_name) {
    return NextResponse.json({ ok: false, message: "event_name is required." }, { status: 400 });
  }

  const userData = body.user_data ?? {};
  const payload = {
    data: [
      {
        event_name: body.event_name,
        event_time: Math.floor(Date.now() / 1000),
        event_id: body.event_id,
        action_source: "website",
        event_source_url: body.event_source_url,
        user_data: {
          em: sha256(userData.email),
          ph: sha256(normalizePhone(userData.phone)),
          fn: sha256(userData.first_name),
          ln: sha256(userData.last_name),
          fbp: userData.fbp,
          fbc: userData.fbc,
          client_user_agent: userData.client_user_agent
        },
        custom_data: body.custom_data ?? {}
      }
    ]
  };

  const response = await fetch(`https://graph.facebook.com/v20.0/${pixelId}/events?access_token=${accessToken}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  const result = (await response.json().catch(() => ({}))) as Record<string, unknown>;

  return NextResponse.json({ ok: response.ok, status: response.status, result }, { status: response.ok ? 200 : 502 });
}
