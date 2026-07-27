// ============================================================
// Supabase Edge Function: review-access
//
// Purpose:
// - Validate the one-time token included in the Heads Up Gmail message.
// - Return request details to the existing Heads Up website.
// - Apply Approve or Reject only after the staff member confirms there.
// - Optionally email the requester after the decision.
//
// Deploy publicly because the one-time token is the authorization secret:
//   npx supabase functions deploy review-access --no-verify-jwt
//
// Required/Recommended secrets:
//   RESEND_API_KEY
//   FROM_EMAIL=Heads Up Website <website@YOUR-VERIFIED-DOMAIN.org>
//   ALLOWED_ORIGINS=http://127.0.0.1:5500,https://YOUR-SITE.example
//
// Supabase provides SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.
// ============================================================

import { createClient } from "supabase";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY") ?? "";
const FROM_EMAIL =
  Deno.env.get("FROM_EMAIL") ??
  "Heads Up Website <onboarding@resend.dev>";

const GMAIL_DECISION_WEBHOOK_URL =
  Deno.env.get("GMAIL_DECISION_WEBHOOK_URL") ?? "";

const GMAIL_DECISION_WEBHOOK_SECRET =
  Deno.env.get("GMAIL_DECISION_WEBHOOK_SECRET") ?? "";

const allowedOrigins = (Deno.env.get("ALLOWED_ORIGINS") ?? "")
  .split(",")
  .map((value) => value.trim().replace(/\/$/, ""))
  .filter(Boolean);

const normalizeOrigin = (origin: string | null) =>
  origin ? origin.replace(/\/$/, "") : null;

const isOriginAllowed = (origin: string | null) => {
  const normalized = normalizeOrigin(origin);

  if (allowedOrigins.length === 0) return true;
  if (!normalized) return false;

  return allowedOrigins.includes(normalized);
};

const corsHeaders = (origin: string | null) => {
  const normalized = normalizeOrigin(origin);
  const allowOrigin =
    allowedOrigins.length === 0
      ? "*"
      : normalized && allowedOrigins.includes(normalized)
        ? normalized
        : "null";

  return {
    "Access-Control-Allow-Origin": allowOrigin,
    "Access-Control-Allow-Headers":
      "authorization, x-client-info, apikey, content-type, x-requested-with",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Max-Age": "86400",
    "Content-Type": "application/json; charset=utf-8",
    "Vary": "Origin",
  };
};

const json = (
  body: Record<string, unknown>,
  status: number,
  origin: string | null,
) =>
  new Response(JSON.stringify(body), {
    status,
    headers: corsHeaders(origin),
  });

const cleanToken = (value: unknown) =>
  String(value ?? "").trim().slice(0, 200);

const sha256Hex = async (value: string) => {
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(value),
  );

  return [...new Uint8Array(digest)]
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
};

const escapeHtml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

Deno.serve(async (request) => {
  const origin = request.headers.get("Origin");
  const requestId = crypto.randomUUID();

  if (request.method === "OPTIONS") {
    if (!isOriginAllowed(origin)) {
      return json(
        { ok: false, error: "Origin not allowed.", requestId },
        403,
        origin,
      );
    }

    return new Response(null, {
      status: 204,
      headers: corsHeaders(origin),
    });
  }

  if (!isOriginAllowed(origin)) {
    return json(
      { ok: false, error: "Origin not allowed.", requestId },
      403,
      origin,
    );
  }

  if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
    return json(
      {
        ok: false,
        error: "Server database configuration is incomplete.",
        requestId,
      },
      500,
      origin,
    );
  }

  const admin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  if (request.method === "GET") {
    const url = new URL(request.url);
    const token = cleanToken(url.searchParams.get("token"));

    if (token.length < 30) {
      return json(
        { ok: false, error: "The review link is invalid.", requestId },
        400,
        origin,
      );
    }

    const tokenHash = await sha256Hex(token);

    const { data: review, error } = await admin
      .from("access_review_requests")
      .select(
        "id, requester_name, requester_email, relationship, requested_role, request_reason, status, expires_at, created_at",
      )
      .eq("token_hash", tokenHash)
      .maybeSingle();

    if (error) {
      console.error("Review lookup failed", { requestId, error });

      return json(
        {
          ok: false,
          error:
            "The request could not be loaded. Run the latest SQL and inspect review-access logs.",
          requestId,
        },
        500,
        origin,
      );
    }

    if (!review) {
      return json(
        {
          ok: false,
          error: "This review link is invalid or no longer available.",
          requestId,
        },
        404,
        origin,
      );
    }

    if (review.status !== "pending") {
      return json(
        {
          ok: false,
          error:
            review.status === "approved"
              ? "This request has already been approved."
              : review.status === "rejected"
                ? "This request has already been rejected."
                : "This review link has expired.",
          currentStatus: review.status,
          requestId,
        },
        409,
        origin,
      );
    }

    if (new Date(review.expires_at).getTime() <= Date.now()) {
      await admin
        .from("access_review_requests")
        .update({
          status: "expired",
          updated_at: new Date().toISOString(),
        })
        .eq("id", review.id)
        .eq("status", "pending");

      return json(
        {
          ok: false,
          error:
            "This review link has expired. Ask the requester to use Resend approval request from the portal.",
          requestId,
        },
        410,
        origin,
      );
    }

    return json(
      {
        ok: true,
        requestId,
        request: {
          requesterName: review.requester_name,
          requesterEmail: review.requester_email,
          relationship: review.relationship,
          requestedRole: review.requested_role,
          requestReason: review.request_reason,
          status: review.status,
          expiresAt: review.expires_at,
          createdAt: review.created_at,
        },
      },
      200,
      origin,
    );
  }

  if (request.method !== "POST") {
    return json(
      { ok: false, error: "Method not allowed.", requestId },
      405,
      origin,
    );
  }

  let input: Record<string, unknown>;

  try {
    input = await request.json();
  } catch {
    return json(
      { ok: false, error: "Invalid JSON request body.", requestId },
      400,
      origin,
    );
  }

  const token = cleanToken(input.token);
  const action = String(input.action ?? "").trim().toLowerCase();

  if (token.length < 30 || !["approve", "reject"].includes(action)) {
    return json(
      { ok: false, error: "Invalid review token or action.", requestId },
      400,
      origin,
    );
  }

  const tokenHash = await sha256Hex(token);

  const { data: decisionRows, error: decisionError } = await admin.rpc(
    "headsup_apply_access_decision",
    {
      p_token_hash: tokenHash,
      p_action: action,
    },
  );

  if (decisionError) {
    console.error("Decision RPC failed", { requestId, decisionError });

    return json(
      {
        ok: false,
        error: decisionError.message || "The decision could not be applied.",
        requestId,
      },
      400,
      origin,
    );
  }

  const decision = Array.isArray(decisionRows)
    ? decisionRows[0]
    : decisionRows;

  if (!decision) {
    return json(
      {
        ok: false,
        error: "The decision returned no account information.",
        requestId,
      },
      500,
      origin,
    );
  }

  if (decision.outcome === "expired") {
    return json(
      {
        ok: false,
        error:
          "This review link expired. Ask the requester to use Resend approval request from the portal.",
        requestId,
      },
      410,
      origin,
    );
  }

  const approved = decision.outcome === "approved";
  let decisionEmailSent = false;
  let warning = "";
  let providerMessageId: string | null = null;

  if (
  !GMAIL_DECISION_WEBHOOK_URL ||
  !GMAIL_DECISION_WEBHOOK_SECRET
) {
  warning =
    "The access status changed, but the Gmail decision-email service is not configured.";
} else {
  try {
    const gmailResponse = await fetch(
      GMAIL_DECISION_WEBHOOK_URL,
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          secret:
            GMAIL_DECISION_WEBHOOK_SECRET,

          to:
            decision.requester_email,

          name:
            decision.requester_name ||
            "there",

          outcome:
            approved
              ? "approved"
              : "rejected",

          role:
            decision.requested_role_text ||
            "member",
        }),
      },
    );

    const gmailResult =
      await gmailResponse
        .json()
        .catch(() => ({
          ok: false,
          error:
            `Gmail service returned HTTP ${gmailResponse.status}.`,
        }));

    if (
      gmailResponse.ok &&
      gmailResult?.ok === true
    ) {
      decisionEmailSent = true;
    } else {
      warning =
        typeof gmailResult?.error === "string"
          ? `The access status changed, but the requester email failed: ${gmailResult.error}`
          : "The access status changed, but the Gmail service rejected the requester email.";
    }
  } catch (gmailError) {
    console.error(
      "Gmail decision email failed",
      {
        requestId,
        gmailError,
      },
    );

    warning =
      "The access status changed, but the requester email could not be sent.";
  }
}

  await admin
    .from("access_review_requests")
    .update({
      decision_email_status: decisionEmailSent
        ? "email-sent"
        : "email-not-sent",
      provider_message_id: providerMessageId,
      updated_at: new Date().toISOString(),
    })
    .eq("id", decision.request_id);

  return json(
    {
      ok: true,
      requestId,
      outcome: decision.outcome,
      decisionEmailSent,
      warning: warning || null,
    },
    200,
    origin,
  );
});
