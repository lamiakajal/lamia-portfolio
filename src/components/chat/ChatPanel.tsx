// ==========================================
// Component: ChatPanel - message bubbles + a box to write a message.
// Used by the visitor's /inbox and by the admin's conversation view.
// ==========================================

"use client";

import React, { useEffect, useRef, useState } from "react";
import { Loader2, Send } from "lucide-react";
import { timeAgo, } from "@/lib/engagement-types";
import { MAX_CHAT_LENGTH, type ChatMessage } from "@/lib/chat-types";

interface ChatPanelProps {
  messages: ChatMessage[];
  /** Which side of the conversation is "me" (my bubbles are pink and on the right) */
  me: "user" | "admin";
  onSend: (text: string) => Promise<boolean>;
  placeholder?: string;
  emptyText?: string;
  className?: string;
}

export default function ChatPanel({
  messages,
  me,
  onSend,
  placeholder = "Write a message...",
  emptyText = "No messages yet. Say hello!",
  className = "",
}: ChatPanelProps) {
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  // Scroll to the newest message
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages.length]);

  const send = async () => {
    const value = text.trim();
    if (!value || sending) return;
    setSending(true);
    const ok = await onSend(value);
    if (ok) setText("");
    setSending(false);
  };

  return (
    <div className={`flex flex-col ${className}`}>
      <div className="flex-1 min-h-64 max-h-[52vh] overflow-y-auto space-y-3 p-4 sm:p-5">
        {messages.length === 0 ? (
          <p className="py-10 text-center text-sm text-slate-500">{emptyText}</p>
        ) : (
          messages.map((m) => {
            const mine = m.from === me;
            return (
              <div key={m.id} className={`skill-pop flex ${mine ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 ${
                    mine
                      ? "rounded-br-md bg-linear-to-br from-pink-600 to-fuchsia-500 text-white"
                      : "rounded-bl-md bg-card border border-line text-slate-200"
                  }`}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">{m.text}</p>
                  <p className={`mt-1 text-[10px] ${mine ? "text-white/70" : "text-slate-500"}`} suppressHydrationWarning>
                    {timeAgo(m.createdAt)}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={endRef} />
      </div>

      <div className="border-t border-line p-3 sm:p-4 flex items-end gap-3">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            // Enter sends, Shift+Enter makes a new line
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              void send();
            }
          }}
          rows={2}
          maxLength={MAX_CHAT_LENGTH}
          placeholder={placeholder}
          className="flex-1 resize-none rounded-xl bg-card border border-line px-4 py-3 text-sm text-strong placeholder:text-slate-500 outline-none transition-all focus:border-pink-500/70 focus:ring-4 focus:ring-pink-500/15"
        />
        <button
          type="button"
          onClick={send}
          disabled={sending || text.trim().length < 1}
          aria-label="Send message"
          className="shrink-0 w-12 h-12 rounded-full bg-linear-to-r from-pink-600 to-fuchsia-500 text-white flex items-center justify-center shadow-[0_0_20px_rgba(236,72,153,0.45)] hover:scale-110 active:scale-90 disabled:opacity-50 disabled:hover:scale-100 transition-all"
        >
          {sending ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
        </button>
      </div>
    </div>
  );
}
