// ==========================================
// Component: AdminInboxTabs - switches between "Chats" (logged-in visitors, in-site replies)
// and "Contact form" (messages from people without an account).
// ==========================================

"use client";

import React, { useState } from "react";
import { MessageSquare, Mail } from "lucide-react";
import AdminChats from "@/components/chat/AdminChats";
import InboxList from "@/components/blog/InboxList";
import type { MessageItem } from "@/lib/engagement-types";
import type { ThreadSummary } from "@/lib/chat-types";

export default function AdminInboxTabs({
  threads,
  messages,
}: {
  threads: ThreadSummary[];
  messages: MessageItem[];
}) {
  const [tab, setTab] = useState<"chats" | "contact">("chats");
  const unreadChats = threads.reduce((n, t) => n + (t.unreadForAdmin > 0 ? 1 : 0), 0);
  const unreadContact = messages.filter((m) => !m.read).length;

  const btn = (active: boolean) =>
    `inline-flex items-center gap-2 px-5 h-10 rounded-full text-sm font-semibold border transition-all active:scale-95 ${
      active
        ? "spin-border bg-pink-500/15 border-pink-500/60 text-strong"
        : "bg-card border-line text-slate-300 hover:text-pink-400 hover:border-pink-500/40"
    }`;

  return (
    <div>
      <div className="flex flex-wrap gap-3 mb-6" role="tablist">
        <button type="button" role="tab" aria-selected={tab === "chats"} onClick={() => setTab("chats")} className={btn(tab === "chats")}>
          <MessageSquare size={16} /> Chats {unreadChats > 0 && <span className="rounded-full bg-pink-500 px-2 text-[11px] text-white">{unreadChats}</span>}
        </button>
        <button type="button" role="tab" aria-selected={tab === "contact"} onClick={() => setTab("contact")} className={btn(tab === "contact")}>
          <Mail size={16} /> Contact form {unreadContact > 0 && <span className="rounded-full bg-pink-500 px-2 text-[11px] text-white">{unreadContact}</span>}
        </button>
      </div>
      {tab === "chats" ? <AdminChats initial={threads} /> : <InboxList initial={messages} />}
    </div>
  );
}
