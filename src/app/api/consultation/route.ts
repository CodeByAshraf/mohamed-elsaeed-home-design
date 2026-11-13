import nodemailer from "nodemailer";
import { consultationSchema } from "@/lib/consultation";
import {
  consultationHtml,
  consultationSubject,
  consultationText,
  formatReceivedAt,
} from "@/lib/email-template";
import { clientKey, createRateLimiter, readBodyLimited, trustedProxyHops } from "@/lib/rate-limit";

export const runtime = "nodejs";

/* Limits are in memory and per process (see src/lib/rate-limit.ts): with several instances
   each enforces its own, and a restart resets them.
   - Per client: 5 requests per 10 minutes, only when TRUSTED_PROXY_HOPS identifies the
     client. At the default of 0 no forwarded header is trusted and there is no per-client
     limit, because a route handler has no trustworthy client address.
   - Send budget: 20 validated send attempts per hour per process, whatever the client.
   - Body: 16 KiB, enforced before JSON parsing. */
const BODY_LIMIT_BYTES = 16 * 1024;
const clientLimiter = createRateLimiter({ limit: 5, windowMs: 10 * 60 * 1000, maxKeys: 10_000 });
const sendBudget = createRateLimiter({ limit: 20, windowMs: 60 * 60 * 1000, maxKeys: 1 });

function getTransport() {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_HOST) return null;
  const port = Number(SMTP_PORT ?? 465);
  return nodemailer.createTransport({
    host: SMTP_HOST,
    port,
    secure: port === 465,
    auth: SMTP_USER && SMTP_PASS ? { user: SMTP_USER, pass: SMTP_PASS } : undefined,
  });
}

const json = (body: unknown, status = 200) => Response.json(body, { status });

export async function POST(request: Request) {
  const client = clientKey(request.headers.get("x-forwarded-for"), trustedProxyHops());
  if (client !== null && !clientLimiter.allow(client)) {
    return json({ ok: false, message: "Too many requests. Wait a few minutes, then send again." }, 429);
  }

  let payload: unknown;
  try {
    const body = await readBodyLimited(request, BODY_LIMIT_BYTES);
    if (body === null) {
      return json({ ok: false, message: "The request is too large. Shorten your notes and send again." }, 413);
    }
    payload = JSON.parse(body);
  } catch {
    return json({ ok: false, message: "The request could not be read. Refresh the page and try again." }, 400);
  }

  const parsed = consultationSchema.safeParse(payload);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0]);
      if (!fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    // Honeypot filled in: pretend success so bots learn nothing.
    if (fieldErrors.website) return json({ ok: true });
    return json({ ok: false, message: "Check the highlighted fields.", fieldErrors }, 422);
  }

  const data = parsed.data;
  const transport = getTransport();
  if (!transport) {
    console.error("[consultation] SMTP_HOST is not set; email not sent.");
    return json({ ok: false, message: "Booking is temporarily unavailable. Contact us on WhatsApp instead." }, 503);
  }

  // Checked last, so invalid and honeypot requests never use the budget. Fails closed.
  if (!sendBudget.allow("send")) {
    console.error("[consultation] Hourly send budget reached; email not sent.");
    return json({ ok: false, message: "Booking is temporarily unavailable. Contact us on WhatsApp instead." }, 503);
  }

  const receivedAt = formatReceivedAt();
  try {
    await transport.sendMail({
      from: process.env.MAIL_FROM || `"Mohamed Elsaeed – Website" <${process.env.SMTP_USER}>`,
      to: process.env.MAIL_TO || "a4rfmagdy@gmail.com",
      replyTo: { name: data.fullName, address: data.email },
      subject: consultationSubject(data),
      text: consultationText(data, receivedAt),
      html: consultationHtml(data, receivedAt),
    });
  } catch (error) {
    console.error("[consultation] sendMail failed:", error);
    return json({ ok: false, message: "Your request wasn't sent. Try again in a moment, or contact us on WhatsApp." }, 502);
  }

  return json({ ok: true });
}
