// ==========================================
// Component: AdminChats - all visitor conversations, with in-site replies (admin only)
// Left: list of conversations (unread first by time). Right: the chosen conversation.
// The list and the open conversation refresh by themselves.
// ==========================================

"use client";

import React, { useCallback, useEffect, useState } from "react";
import { ArrowLeft, MessageSquare } from "lucide-react";
import { useToast } from "@/components/ui/ToastProvider";
import ChatPanel from "@/components/chat/ChatPanel";
import { timeAgo } from "@/lib/engagement-types";
import type { ChatMessage, ThreadSummary } from "@/lib/chat-types";

function Avatar({ t }: { t: ThreadSummary }) {
  return t.userImage ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={t.userImage} alt="" className="w-10 h-10 rounded-full object-cover shrink-0" />
  ) : (
    <span className="w-10 h-10 rounded-full bg-linear-to-br from-pink-500 to-fuchsia-500 text-white text-sm font-bold flex items-center justify-center shrink-0">
      {t.userName.charAt(0).toUpperCase()}
    </span>
  );
}

export default function AdminChats({ initial }: { initial: ThreadSummary[] }) {
  const toast = useToast();
  const [threads, setThreads] = useState(initial);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const selected = threads.find((t) => t.id === selectedId) ?? null;

  const loadThreads = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/chat", { cache: "no-store" });
      const data = (await res.json()) as { ok?: boolean; threads?: ThreadSummary[] };
      if (data.ok && data.threads) setThreads(data.threads);
    } catch {
      /* try again next time */
    }
  }, []);

  const loadConversation = useCallback(async (id: string) => {
    try {
      const res = await fetch(`/api/admin/chat/${id}`, { cache: "no-store" });
      const data = (await res.json()) as { ok?: boolean; messages?: ChatMessage[] };
      if (data.ok && data.messages) {
        setMessages(data.messages);
        // opening it marked it as read
        setThreads((list) => list.map((t) => (t.id === id ? { ...t, unreadForAdmin: 0 } : t)));
      }
    } catch {
      /* try again next time */
    }
  }, []);

  // Refresh the list every 10 seconds and the open conversation every 6 seconds
  useEffect(() => {
    const id = setInterval(loadThreads, 10000);
    return () => clearInterval(id);
  }, [loadThreads]);

  useEffect(() => {
    if (!selectedId) return;
    const id = setInterval(() => void loadConversation(selectedId), 6000);
    return () => clearInterval(id);
  }, [selectedId, loadConversation]);

  const open = (id: string) => {
    setSelectedId(id);
    setMessages([]);
    void loadConversation(id);
  };

  const reply = async (text: string) => {
    if (!selectedId) return false;
    try {
      const res = await fetch(`/api/admin/chat/${selectedId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const data = (await res.json().catch(() => ({}))) as { message?: ChatMessage; error?: string };
      if (!res.ok || !data.message) throw new Error(data.error ?? "Could not send the reply.");
      setMessages((list) => [...list, data.message as ChatMessage]);
      void loadThreads();
      return true;
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not send the reply.");
      return false;
    }
  };

  if (threads.length === 0) {
    return (
      <p className="rounded-2xl bg-card border border-line p-8 text-center text-sm text-slate-300">
        No conversations yet. When a logged-in visitor writes to you from their Inbox, it appears here.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
      {/* conversation list */}
      <div className={`lg:col-span-4 ${selected ? "hidden lg:block" : ""}`}>
        <ul className="space-y-2 max-h-[70vh] overflow-y-auto pr-1">
          {threads.map((t) => (
            <li key={t.id}>
              <button
                type="button"
                onClick={() => open(t.id)}
                className={`w-full text-left flex items-center gap-3 p-3 rounded-2xl border transition-all duration-300 hover:-translate-y-0.5 ${
                  t.id === selectedId
                    ? "bg-pink-500/15 border-pink-500/60"
                    : t.unreadForAdmin > 0
                      ? "bg-pink-500/8 border-pink-500/40"
                      : "bg-card border-line hover:border-pink-500/40"
                }`}
              >
                <Avatar t={t} />
                <span className="min-w-0 flex-1">
                  <span className="flex items-center justify-between gap-2">
                    <span className="truncate text-sm font-bold text-strong">{t.userName}</span>
                    <span className="shrink-0 text-[10px] text-slate-500" suppressHydrationWarning>
                      {timeAgo(t.lastAt)}
                    </span>
                  </span>
                  <span className="block truncate text-xs text-slate-400">{t.lastMessage}</span>
                </span>
                {t.unreadForAdmin > 0 && (
                  <span className="shrink-0 min-w-5 h-5 px-1 rounded-full bg-pink-500 text-[10px] font-bold text-white flex items-center justify-center">
                    {t.unreadForAdmin}
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* open conversation */}
      <div className={`lg:col-span-8 ${selected ? "" : "hidden lg:flex"} flex-col`}>
        {selected ? (
          <div className="rounded-3xl bg-card border border-line overflow-hidden">
            <div className="flex items-center gap-3 px-4 py-3 border-b border-line">
              <button
                type="button"
                onClick={() => setSelectedId(null)}
                aria-label="Back to conversations"
                className="lg:hidden w-9 h-9 rounded-full border border-line flex items-center justify-center text-slate-300"
              >
                <ArrowLeft size={16} />
              </button>
              <Avatar t={selected} />
              <div className="min-w-0">
                <p className="text-sm font-bold text-strong truncate">{selected.userName}</p>
                <p className="text-xs text-slate-400 truncate">{selected.userEmail}</p>
              </div>
            </div>
            <ChatPanel me="admin" messages={messages} onSend={reply} placeholder="Write your reply..." />
          </div>
        ) : (
          <div className="flex-1 hidden lg:flex flex-col items-center justify-center rounded-3xl bg-card border border-line p-10 text-center text-slate-400">
            <MessageSquare size={34} className="text-pink-400 mb-3" />
            <p className="text-sm">Choose a conversation on the left.</p>
          </div>
        )}
      </div>
    </div>
  );
}
