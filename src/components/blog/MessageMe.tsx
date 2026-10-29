// ==========================================
// Component: MessageMe - a private message to Lamia (shown under every blog post)
// Logged-in visitors only. Messages appear in /admin/inbox.
// ==========================================

"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Loader2, Mail, Send } from "lucide-react";
import { useToast } from "@/components/ui/ToastProvider";

const inputClass =
  "w-full rounded-xl bg-card border border-line px-4 py-3 text-sm text-strong placeholder:text-slate-500 outline-none transition-all focus:border-pink-500/70 focus:ring-4 focus:ring-pink-500/15";

export default function MessageMe({ loggedIn, loginUrl }: { loggedIn: boolean; loginUrl: string }) {
  const toast = useToast();
  const [open, setOpen] = useState(false);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const send = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSending(true);
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, message }),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) throw new Error(data.error ?? "Could not send your message.");
      toast.success("Your message is in my inbox. I will reply by email.", { title: "Message sent" });
      setSubject("");
      setMessage("");
      setOpen(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not send your message.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="rounded-2xl bg-card border border-line p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="flex items-center gap-2 text-lg font-bold text-strong">
            <Mail size={18} className="text-pink-400" />
            Want to talk to me?
          </h2>
          <p className="text-sm text-slate-400 mt-1">Send me a private message. It goes straight to my inbox.</p>
        </div>
        {loggedIn ? (
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            className="px-5 py-2.5 rounded-full border border-pink-500/50 bg-pink-500/10 text-sm font-semibold text-strong hover:bg-pink-500/20 active:scale-95 transition-all"
          >
            {open ? "Close" : "Message me"}
          </button>
        ) : (
          <Link
            href={loginUrl}
            className="px-5 py-2.5 rounded-full border border-pink-500/50 bg-pink-500/10 text-sm font-semibold text-strong hover:bg-pink-500/20 active:scale-95 transition-all"
          >
            Log in to message me
          </Link>
        )}
      </div>

      {loggedIn && open && (
        <form onSubmit={send} className="skill-pop mt-5 space-y-4">
          <input className={inputClass} placeholder="Subject" value={subject} onChange={(e) => setSubject(e.target.value)} minLength={2} maxLength={150} required />
          <textarea className={`${inputClass} resize-y`} rows={5} placeholder="Your message..." value={message} onChange={(e) => setMessage(e.target.value)} minLength={10} maxLength={3000} required />
          <button
            type="submit"
            disabled={sending}
            className="btn-shine relative overflow-hidden inline-flex items-center gap-2 px-6 py-3 rounded-full bg-linear-to-r from-pink-600 via-fuchsia-500 to-pink-500 text-white text-sm font-semibold shadow-[0_0_20px_rgba(236,72,153,0.45)] hover:scale-105 active:scale-95 disabled:opacity-60 transition-all"
          >
            {sending ? <Loader2 size={15} className="relative z-10 animate-spin" /> : <Send size={15} className="relative z-10" />}
            <span className="relative z-10">Send message</span>
          </button>
        </form>
      )}
    </div>
  );
}
