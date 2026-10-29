// ==========================================
// Component: InboxList - the admin inbox (messages from the blog and the contact form)
// ==========================================

"use client";

import React, { useState } from "react";
import { Check, Mail, MailOpen, Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/ToastProvider";
import { timeAgo, type MessageItem } from "@/lib/engagement-types";

export default function InboxList({ initial }: { initial: MessageItem[] }) {
  const toast = useToast();
  const [items, setItems] = useState(initial);

  const toggleRead = async (m: MessageItem) => {
    const read = !m.read;
    setItems((l) => l.map((x) => (x.id === m.id ? { ...x, read } : x)));
    try {
      const res = await fetch(`/api/admin/messages/${m.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ read }),
      });
      if (!res.ok) throw new Error("failed");
    } catch {
      setItems((l) => l.map((x) => (x.id === m.id ? { ...x, read: m.read } : x)));
      toast.error("Could not update the message.");
    }
  };

  const remove = async (m: MessageItem) => {
    if (!window.confirm(`Delete the message from ${m.name}?`)) return;
    const before = items;
    setItems((l) => l.filter((x) => x.id !== m.id));
    try {
      const res = await fetch(`/api/admin/messages/${m.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("failed");
      toast.success("Message deleted.");
    } catch {
      setItems(before);
      toast.error("Could not delete the message.");
    }
  };

  if (items.length === 0) {
    return (
      <p className="rounded-2xl bg-card border border-line p-8 text-center text-sm text-slate-300">
        Your inbox is empty. Messages from the blog and the contact form will appear here.
      </p>
    );
  }

  return (
    <ul className="space-y-4">
      {items.map((m) => (
        <li
          key={m.id}
          className={`skill-pop rounded-2xl border p-5 ${
            m.read ? "bg-card border-line" : "bg-pink-500/8 border-pink-500/40"
          }`}
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="flex items-center gap-2 font-bold text-strong">
                {!m.read && <span className="w-2.5 h-2.5 rounded-full bg-pink-500 shadow-[0_0_10px_rgba(236,72,153,0.8)]" aria-label="Unread" />}
                {m.subject}
              </p>
              <p className="text-xs text-slate-400 mt-1 break-all">
                {m.name} • {m.email} •{" "}
                <span className="uppercase tracking-widest">{m.source}</span> •{" "}
                <span suppressHydrationWarning>{timeAgo(m.createdAt)}</span>
              </p>
            </div>
            <div className="flex items-center gap-2">
              <a
                href={`mailto:${m.email}?subject=${encodeURIComponent(`Re: ${m.subject}`)}`}
                className="inline-flex items-center gap-1.5 px-3 h-9 rounded-lg border border-pink-500/40 bg-pink-500/10 text-xs font-semibold text-strong hover:bg-pink-500/20"
              >
                <Mail size={14} /> Reply
              </a>
              <button
                type="button"
                onClick={() => toggleRead(m)}
                aria-label={m.read ? "Mark as unread" : "Mark as read"}
                title={m.read ? "Mark as unread" : "Mark as read"}
                className="w-9 h-9 rounded-lg border border-line bg-card flex items-center justify-center text-slate-300 hover:text-pink-400"
              >
                {m.read ? <MailOpen size={15} /> : <Check size={15} />}
              </button>
              <button
                type="button"
                onClick={() => remove(m)}
                aria-label="Delete message"
                className="w-9 h-9 rounded-lg border border-red-500/30 bg-red-500/10 flex items-center justify-center text-red-500 hover:bg-red-500/20"
              >
                <Trash2 size={15} />
              </button>
            </div>
          </div>
          <p className="mt-3 text-sm text-slate-300 leading-relaxed whitespace-pre-wrap break-words">{m.message}</p>
        </li>
      ))}
    </ul>
  );
}
