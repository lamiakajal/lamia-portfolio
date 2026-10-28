// POST /api/messages  { subject, message }
// A logged-in visitor sends a private message to Lamia (it lands in /admin/inbox,
// and also arrives by email when RESEND_API_KEY is set).
import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { addMessage } from "@/lib/engagement";
import { contactInfo } from "@/data/portfolioData";

const escapeHtml = (v: string) =>
  v.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// Max 3 messages per person per 10 minutes
const recent = new Map<string, number[]>();
function tooMany(userId: string) {
  const now = Date.now();
  const list = (recent.get(userId) ?? []).filter((t) => now - t < 10 * 60_000);
  list.push(now);
  recent.set(userId, list);
  return list.length > 3;
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ ok: false, error: "Please log in to send a message." }, { status: 401 });
  }
  const body = (await request.json().catch(() => null)) as { subject?: unknown; message?: unknown } | null;
  const subject = typeof body?.subject === "string" ? body.subject.trim() : "";
  const message = typeof body?.message === "string" ? body.message.trim() : "";
  if (subject.length < 2 || subject.length > 150) {
    return NextResponse.json({ ok: false, error: "Please enter a subject." }, { status: 400 });
  }
  if (message.length < 10 || message.length > 3000) {
    return NextResponse.json({ ok: false, error: "Your message should be 10 to 3000 characters." }, { status: 400 });
  }
  if (tooMany(session.user.id)) {
    return NextResponse.json({ ok: false, error: "Too many messages. Please try again later." }, { status: 429 });
  }

  const name = session.user.name || "Reader";
  const email = session.user.email;

  try {
    await addMessage({ name, email, subject, message, userId: session.user.id, source: "blog" });
  } catch {
    return NextResponse.json({ ok: false, error: "Could not send your message." }, { status: 500 });
  }

  // Email copy (best effort: the message is already saved in the inbox)
  const apiKey = process.env.RESEND_API_KEY;
  if (apiKey) {
    try {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from: process.env.CONTACT_FROM || "Portfolio <onboarding@resend.dev>",
          to: [process.env.CONTACT_TO || contactInfo.email],
          reply_to: email,
          subject: `[Blog message] ${subject}`,
          html: `<p><strong>${escapeHtml(name)}</strong> (${escapeHtml(email)}) sent you a message from the blog:</p><p style="white-space:pre-wrap">${escapeHtml(message)}</p>`,
        }),
      });
    } catch {
      /* ignore: inbox copy exists */
    }
  }
  return NextResponse.json({ ok: true });
}
