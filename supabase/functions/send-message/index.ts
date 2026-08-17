// ============================================================
// Supabase Edge Function: send-message
//
// Purpose:
// - Receive public website contact/newsletter/access requests.
// - Store a durable copy in public.contact_messages.
// - Send the notification to headsupweb@gmail.com through Resend.
// - For access requests, create a single-use review token and place
//   Review & Approve / Review & Reject buttons in the Gmail message.
//
// The Gmail links do NOT immediately change access. They open the
// Heads Up website, display the submitted information, and require a
// second confirmation click. This protects against email link scanners.
//
// Deploy publicly:
//   npx supabase functions deploy send-message --no-verify-jwt
//
// Required secrets:
//   RESEND_API_KEY
//   TO_EMAIL=headsupweb@gmail.com
//   FROM_EMAIL=Heads Up Website <website@headsupgl.org>
//   REVIEW_PAGE_URL=https://headsupgl.org/
//   ALLOWED_ORIGINS=https://headsupgl.org,https://www.headsupgl.org
//
// 2026-08-17 CUSTOM DOMAIN UPDATE:
// Verify headsupgl.org in Resend, set these Supabase secrets to the values
// above, and redeploy this function. Secrets remain server-side.
//
// Supabase provides SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.
// Never place any secret above in browser JavaScript.
// ============================================================

import { createClient } from "supabase";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY") ?? "";

const TO_EMAIL = Deno.env.get("TO_EMAIL") ?? "headsupweb@gmail.com";
const FROM_EMAIL =
  Deno.env.get("FROM_EMAIL") ??
  "Heads Up Website <website@headsupgl.org>";
const REVIEW_PAGE_URL =
  Deno.env.get("REVIEW_PAGE_URL") ?? "https://headsupgl.org/";

const REVIEW_LINK_TTL_HOURS = Math.min(
  Math.max(Number(Deno.env.get("REVIEW_LINK_TTL_HOURS") ?? "48"), 1),
  168,
);

const allowedOrigins = (
  Deno.env.get("ALLOWED_ORIGINS") ??
  "https://headsupgl.org,https://www.headsupgl.org"
)
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

const cleanSingleLine = (value: unknown, maxLength: number) =>
  String(value ?? "")
    .replace(/[\r\n\t]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);

const cleanMultiline = (value: unknown, maxLength: number) =>
  String(value ?? "")
    .replace(/\u0000/g, "")
    .trim()
    .slice(0, maxLength);

const isEmail = (value: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

const isUuid = (value: string) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    .test(value);

const escapeHtml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

const toBase64Url = (bytes: Uint8Array) => {
  let binary = "";

  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }

  return btoa(binary)
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replace(/=+$/g, "");
};

const createReviewToken = () => {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return toBase64Url(bytes);
};

const sha256Hex = async (value: string) => {
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(value),
  );

  return [...new Uint8Array(digest)]
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
};

const normalizeRequestedRole = (value: string) => {
  const role = value.toLowerCase();
  const allowed = new Set(["family", "volunteer", "staff", "researcher"]);
  return allowed.has(role) ? role : "family";
};

const buildReviewUrl = (token: string, action: "approve" | "reject") => {
  const reviewUrl = new URL(REVIEW_PAGE_URL);
  reviewUrl.searchParams.set("headsup_review_token", token);
  reviewUrl.searchParams.set("headsup_review_action", action);
  reviewUrl.hash = "portal";
  return reviewUrl.toString();
};

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

  if (request.method === "GET") {
    return json(
      {
        ok: true,
        service: "send-message",
        requestId,
        databaseConfigured: Boolean(SUPABASE_URL && SERVICE_ROLE_KEY),
        emailProviderConfigured: Boolean(RESEND_API_KEY),
        reviewPageConfigured: Boolean(REVIEW_PAGE_URL),
        destination: TO_EMAIL,
        allowedOriginsConfigured: allowedOrigins.length > 0,
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

  // Honeypot: silently accept automated spam without storing/sending.
  if (cleanSingleLine(input.website, 200)) {
    return json({ ok: true, emailSent: true, requestId }, 200, origin);
  }

/*
 * Normalize the incoming message classification.
 *
 * The workflow value provides an additional safeguard so portal
 * access requests cannot accidentally be rendered as ordinary
 * contact messages.
 */

const rawKind = cleanSingleLine(input.kind, 40)
  .toLowerCase()
  .replace(/[_\s]+/g, "-");

const workflow = cleanSingleLine(input.workflow, 80)
  .toLowerCase();

const name = cleanSingleLine(input.name, 100);

const email = cleanSingleLine(
  input.email,
  254,
).toLowerCase();

const audience = cleanSingleLine(
  input.audience,
  100,
);

const subject = cleanSingleLine(
  input.subject,
  160,
);

const message = cleanMultiline(
  input.message,
  5000,
);

const pageUrl = cleanSingleLine(
  input.page,
  1000,
);

const rawAuthUserId = cleanSingleLine(
  input.authUserId,
  80,
);

const authUserId = isUuid(rawAuthUserId)
  ? rawAuthUserId
  : null;

/*
 * Treat the request as an access review when any of these are true:
 *
 * 1. The browser explicitly sends kind = access-request.
 * 2. The browser sends the dedicated workflow marker.
 * 3. A valid Supabase user ID accompanies a portal-access subject.
 */

const isAccessRequest =
  rawKind === "access-request"
  || workflow === "portal-access-review"
  || (
    Boolean(authUserId)
    && /portal access request|access request awaiting review/i.test(
      subject,
    )
  );

const kind = isAccessRequest
  ? "access-request"
  : rawKind;

const allowedKinds = new Set([
  "contact",
  "newsletter",
  "access-request",
]);

if (!allowedKinds.has(kind)) {
  return json(
    {
      ok: false,
      error: "Invalid message type.",
      requestId,
    },
    400,
    origin,
  );
}

/*
 * This log intentionally avoids names, email addresses, reasons,
 * and other submitted personal information.
 */

console.log("Heads Up request classification", {
  requestId,
  rawKind,
  workflow,
  finalKind: kind,
  hasAuthUserId: Boolean(authUserId),
  reviewPageConfigured: Boolean(REVIEW_PAGE_URL),
});

  const relationship = cleanSingleLine(
    input.relationship ?? audience,
    100,
  );
  const requestedRole = normalizeRequestedRole(
    cleanSingleLine(input.requestedRole ?? audience, 40),
  );
  const requestReason = cleanMultiline(
    input.requestReason ?? message,
    1000,
  );

  if (!name || !isEmail(email) || !subject || !message) {
    return json(
      {
        ok: false,
        error: "Name, valid email, subject, and message are required.",
        requestId,
      },
      400,
      origin,
    );
  }

  if (kind === "access-request" && !authUserId) {
    return json(
      {
        ok: false,
        error:
          "The access request is missing its Supabase account identifier.",
        requestId,
      },
      400,
      origin,
    );
  }

  if (kind === "access-request" && !REVIEW_PAGE_URL) {
    return json(
      {
        ok: false,
        error:
          "REVIEW_PAGE_URL is missing from Edge Function Secrets. Add the exact index.html URL used by Heads Up staff.",
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

  const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000).toISOString();

  const { count, error: countError } = await admin
    .from("contact_messages")
    .select("id", { count: "exact", head: true })
    .eq("email", email)
    .gte("created_at", tenMinutesAgo);

  if (countError) {
    console.error("Rate-limit query failed", { requestId, countError });
  } else if ((count ?? 0) >= 5) {
    return json(
      {
        ok: false,
        error: "Too many recent requests. Please wait and try again.",
        requestId,
      },
      429,
      origin,
    );
  }

  if (kind === "access-request" && authUserId) {
    const { data: authResult, error: authLookupError } =
      await admin.auth.admin.getUserById(authUserId);

    if (authLookupError || !authResult.user) {
      console.error("Auth user lookup failed", {
        requestId,
        authLookupError,
      });

      return json(
        {
          ok: false,
          error: "The Supabase account could not be verified.",
          requestId,
        },
        400,
        origin,
      );
    }

    if ((authResult.user.email ?? "").toLowerCase() !== email) {
      return json(
        {
          ok: false,
          error: "The submitted email does not match the Supabase account.",
          requestId,
        },
        400,
        origin,
      );
    }
  }

  const { data: stored, error: insertError } = await admin
    .from("contact_messages")
    .insert({
      kind,
      name,
      email,
      audience,
      subject,
      message,
      page_url: pageUrl || null,
      auth_user_id: authUserId,
      delivery_status: "received",
    })
    .select("id")
    .single();

  if (insertError) {
    console.error("contact_messages insert failed", { requestId, insertError });

    return json(
      {
        ok: false,
        error:
          "The secure message record could not be created. Run the latest supabase-setup.sql and check Function logs.",
        requestId,
      },
      500,
      origin,
    );
  }

  let reviewRequestId: string | null = null;
  let approveUrl = "";
  let rejectUrl = "";
  let expiresAt = "";

  if (kind === "access-request" && authUserId) {
    const reviewToken = createReviewToken();
    const tokenHash = await sha256Hex(reviewToken);
    expiresAt = new Date(
      Date.now() + REVIEW_LINK_TTL_HOURS * 60 * 60 * 1000,
    ).toISOString();

    // A fresh resend invalidates older unused links for the same person.
    await admin
      .from("access_review_requests")
      .update({
        status: "expired",
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", authUserId)
      .eq("status", "pending");

    const { data: reviewRecord, error: reviewInsertError } = await admin
      .from("access_review_requests")
      .insert({
        user_id: authUserId,
        requester_name: name,
        requester_email: email,
        relationship,
        requested_role: requestedRole,
        request_reason: requestReason,
        token_hash: tokenHash,
        status: "pending",
        expires_at: expiresAt,
      })
      .select("id")
      .single();

    if (reviewInsertError) {
      console.error("access_review_requests insert failed", {
        requestId,
        reviewInsertError,
      });

      await admin
        .from("contact_messages")
        .update({ delivery_status: "review-token-failed" })
        .eq("id", stored.id);

      return json(
        {
          ok: false,
          error:
            "The Gmail review link could not be created. Run the latest supabase-setup.sql and inspect Function logs.",
          requestId,
        },
        500,
        origin,
      );
    }

    reviewRequestId = reviewRecord.id;
    approveUrl = buildReviewUrl(reviewToken, "approve");
    rejectUrl = buildReviewUrl(reviewToken, "reject");
  }

  if (!RESEND_API_KEY) {
    await admin
      .from("contact_messages")
      .update({ delivery_status: "stored-no-email-key" })
      .eq("id", stored.id);

    return json(
      {
        ok: true,
        emailSent: false,
        messageId: stored.id,
        reviewRequestId,
        requestId,
        warning:
          "Message stored, but RESEND_API_KEY is not configured in Edge Function Secrets.",
      },
      202,
      origin,
    );
  }

  const label =
    kind === "access-request"
      ? "Portal Access Request"
      : kind === "newsletter"
        ? "Newsletter Request"
        : "Website Contact";

  const emailSubject = `[Heads Up ${label}] ${subject}`;

  const reviewText =
    kind === "access-request"
      ? [
        "",
        `Relationship: ${relationship || "Not provided"}`,
        `Requested role: ${requestedRole}`,
        `Reason: ${requestReason || "Not provided"}`,
        `Review link expires: ${expiresAt}`,
        "",
        `REVIEW & APPROVE: ${approveUrl}`,
        `REVIEW & REJECT: ${rejectUrl}`,
        "",
        "The link opens the Heads Up website and requires a second confirmation click.",
      ]
      : [];

  const text = [
    `Type: ${label}`,
    `Name: ${name}`,
    `Email: ${email}`,
    `Audience: ${audience || "Not provided"}`,
    `Page: ${pageUrl || "Not provided"}`,
    `Request ID: ${requestId}`,
    ...reviewText,
    "",
    "Message:",
    message,
  ].join("\n");

  const accessRequestHtml =
    kind === "access-request"
      ? `
        <div style="margin:24px 0;padding:20px;border:1px solid #d8e4f2;border-radius:14px;background:#f8fbff">
          <h3 style="margin:0 0 14px;color:#004aad">Portal request details</h3>
          <p><strong>Relationship:</strong> ${escapeHtml(relationship || "Not provided")}</p>
          <p><strong>Requested role:</strong> ${escapeHtml(requestedRole)}</p>
          <p><strong>Reason:</strong><br>${escapeHtml(requestReason || "Not provided").replaceAll("\n", "<br>")}</p>
          <p><strong>Review link expires:</strong> ${escapeHtml(expiresAt)}</p>
        </div>

        <div style="margin:28px 0">
          <a href="${escapeHtml(approveUrl)}"
             style="display:inline-block;margin:0 10px 10px 0;padding:14px 22px;border-radius:999px;background:#4c872b;color:#ffffff;text-decoration:none;font-weight:800">
             Review &amp; Approve
          </a>

          <a href="${escapeHtml(rejectUrl)}"
             style="display:inline-block;margin:0 10px 10px 0;padding:14px 22px;border-radius:999px;background:#ef2021;color:#ffffff;text-decoration:none;font-weight:800">
             Review &amp; Reject
          </a>
        </div>

        <p style="font-size:13px;color:#5c6b7d">
          For safety, opening a link does not make the decision. The Heads Up website will display the request again and require a confirmation click.
        </p>
      `
      : "";

  let emailResponse: Response;

  try {
    emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
        "Idempotency-Key": `headsup-message-${stored.id}`,
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [TO_EMAIL],
        reply_to: email,
        subject: emailSubject,
        text,
        html: `
          <div style="font-family:Arial,sans-serif;line-height:1.6;color:#1f2e43;max-width:680px;margin:auto">
            <div style="padding:18px 22px;background:linear-gradient(90deg,#004aad,#4d94a6);color:white;border-radius:16px 16px 0 0">
              <h2 style="margin:0">${escapeHtml(label)}</h2>
            </div>
            <div style="padding:22px;border:1px solid #dce6f2;border-top:0;border-radius:0 0 16px 16px">
              <p><strong>Name:</strong> ${escapeHtml(name)}</p>
              <p><strong>Email:</strong> ${escapeHtml(email)}</p>
              <p><strong>Audience:</strong> ${escapeHtml(audience || "Not provided")}</p>
              <p><strong>Subject:</strong> ${escapeHtml(subject)}</p>
              <p><strong>Page:</strong> ${escapeHtml(pageUrl || "Not provided")}</p>
              <p><strong>Request ID:</strong> ${escapeHtml(requestId)}</p>
              ${accessRequestHtml}
              <hr style="border:0;border-top:1px solid #dce6f2;margin:24px 0">
              <p style="white-space:pre-wrap">${escapeHtml(message)}</p>
            </div>
          </div>
        `,
      }),
    });
  } catch (networkError) {
    console.error("Resend network request failed", { requestId, networkError });

    await admin
      .from("contact_messages")
      .update({ delivery_status: "email-network-failed" })
      .eq("id", stored.id);

    return json(
      {
        ok: true,
        emailSent: false,
        messageId: stored.id,
        reviewRequestId,
        requestId,
        warning:
          "Message stored, but the email provider could not be reached. Check Function logs.",
      },
      202,
      origin,
    );
  }

  const providerData = await emailResponse.json().catch(() => ({}));

  if (!emailResponse.ok) {
    console.error("Resend delivery failed", {
      requestId,
      status: emailResponse.status,
      providerData,
    });

    await admin
      .from("contact_messages")
      .update({ delivery_status: `email-failed-${emailResponse.status}` })
      .eq("id", stored.id);

    return json(
      {
        ok: true,
        emailSent: false,
        messageId: stored.id,
        reviewRequestId,
        requestId,
        warning:
          typeof providerData?.message === "string"
            ? providerData.message
            : "Message stored, but the email provider rejected the notification. Check the verified sender/domain and Resend logs.",
      },
      202,
      origin,
    );
  }

  await admin
    .from("contact_messages")
    .update({
      delivery_status: "email-sent",
      provider_message_id:
        typeof providerData?.id === "string" ? providerData.id : null,
    })
    .eq("id", stored.id);

  return json(
    {
      ok: true,
      emailSent: true,
      messageId: stored.id,
      reviewRequestId,
      providerMessageId: providerData?.id ?? null,
      requestId,
    },
    200,
    origin,
  );
});
