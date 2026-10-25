// ==========================================
// API Route: POST /api/contact
// Description: Receives the contact form and emails it to Lamia using the Resend REST API.
//              No extra npm package is needed.
//
// SETUP (one time, in Vercel -> Project -> Settings -> Environment Variables):
//   RESEND_API_KEY   your API key from https://resend.com  (free plan is enough)
//   CONTACT_TO       (optional) where messages are delivered. Default: lamiakajal@gmail.com
//   CONTACT_FROM     (optional) sender, e.g. "Portfolio <contact@lamiakajal.com>"
//                    This needs lamiakajal.com to be verified in Resend.
//                    Default: "Portfolio <onboarding@resend.dev>" which works for testing
//                    when CONTACT_TO is the same email you used to sign up to Resend.
//
// If RESEND_API_KEY is missing, this route answers { fallback: true } and the form
// automatically opens the visitor's email app instead (so it never silently fails).
// ==========================================

import { NextResponse } from "next/server";
import { contactInfo } from "@/data/portfolioData";

export const runtime = "nodejs";

// Escape user text before putting it into the HTML email
const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const isEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

// Very small in-memory rate limit: max 5 messages per IP per 10 minutes
// (resets when the server restarts; good enough to stop simple spam)
const hits = new Map<string, number[]>();
function tooMany(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 10 * 60 * 1000);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > 5;
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const name = String(body.name ?? "").trim();
  const email = String(body.email ?? "").trim();
  const subject = String(body.subject ?? "").trim();
  const message = String(body.message ?? "").trim();
  const website = String(body.website ?? ""); // honeypot field (bots fill it in)

  // Bots: pretend everything is fine, but send nothing
  if (website) return NextResponse.json({ ok: true });

  if (name.length < 2 || name.length > 100)
    return NextResponse.json({ ok: false, error: "Please enter your name." }, { status: 400 });
  if (!isEmail(email) || email.length > 200)
    return NextResponse.json({ ok: false, error: "Please enter a valid email." }, { status: 400 });
  if (subject.length < 2 || subject.length > 150)
    return NextResponse.json({ ok: false, error: "Please enter a subject." }, { status: 400 });
  if (message.length < 10 || message.length > 5000)
    return NextResponse.json(
      { ok: false, error: "Your message should be 10 to 5000 characters." },
      { status: 400 },
    );

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (tooMany(ip))
    return NextResponse.json(
      { ok: false, error: "Too many messages. Please try again later." },
      { status: 429 },
    );

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    // Email service is not configured yet: let the form fall back to mailto:
    return NextResponse.json({ ok: false, fallback: true }, { status: 503 });
  }

  const to = process.env.CONTACT_TO || contactInfo.email;
  const from = process.env.CONTACT_FROM || "Portfolio <onboarding@resend.dev>";

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: email, // pressing "Reply" answers the visitor directly
        subject: `[Portfolio] ${subject}`,
        text: `From: ${name} <${email}>\n\n${message}`,
        html: `<div style="font-family:Arial,sans-serif;line-height:1.6">
          <h2 style="margin:0 0 8px">New message from your portfolio</h2>
          <p><strong>Name:</strong> ${escapeHtml(name)}<br/>
          <strong>Email:</strong> ${escapeHtml(email)}<br/>
          <strong>Subject:</strong> ${escapeHtml(subject)}</p>
          <p style="white-space:pre-wrap">${escapeHtml(message)}</p>
        </div>`,
      }),
    });

    if (!res.ok) {
      return NextResponse.json(
        { ok: false, error: "The email service could not send your message." },
        { status: 502 },
      );
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
