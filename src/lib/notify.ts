// ==========================================
// Email copy of a new chat message to Lamia (best effort, never blocks the chat).
// Uses the same Resend settings as the contact form.
// ==========================================

import { contactInfo } from "@/data/portfolioData";

const escapeHtml = (v: string) =>
  v.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export async function emailAdminNewMessage(name: string, email: string, text: string) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return;
  try {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: process.env.CONTACT_FROM || "Portfolio <onboarding@resend.dev>",
        to: [process.env.CONTACT_TO || contactInfo.email],
        reply_to: email,
        subject: `[Inbox] New message from ${name}`,
        html: `<p><strong>${escapeHtml(name)}</strong> (${escapeHtml(email)}) wrote:</p><p style="white-space:pre-wrap">${escapeHtml(text)}</p><p>Reply here: ${contactInfo.website}/admin/inbox</p>`,
      }),
    });
  } catch {
    /* the message is already saved in the inbox */
  }
}
