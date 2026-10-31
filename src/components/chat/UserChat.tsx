// ==========================================
// Component: UserChat - a visitor's private conversation with Lamia (/inbox)
// New replies appear by themselves (checked every 8 seconds while the page is open).
// ==========================================

"use client";

import React, { useEffect, useState } from "react";
import { useToast } from "@/components/ui/ToastProvider";
import ChatPanel from "@/components/chat/ChatPanel";
import type { ChatMessage } from "@/lib/chat-types";

export default function UserChat({ initial }: { initial: ChatMessage[] }) {
  const toast = useToast();
  const [messages, setMessages] = useState(initial);

  // Check for new replies
  useEffect(() => {
    let stop = false;
    const load = async () => {
      try {
        const res = await fetch("/api/chat", { cache: "no-store" });
        const data = (await res.json()) as { ok?: boolean; messages?: ChatMessage[] };
        if (!stop && data.ok && data.messages) setMessages(data.messages);
      } catch {
        /* try again next time */
      }
    };
    const id = setInterval(load, 8000);
    return () => {
      stop = true;
      clearInterval(id);
    };
  }, []);

  const send = async (text: string) => {
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const data = (await res.json().catch(() => ({}))) as { message?: ChatMessage; error?: string };
      if (!res.ok || !data.message) throw new Error(data.error ?? "Could not send your message.");
      setMessages((list) => [...list, data.message as ChatMessage]);
      return true;
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not send your message.");
      return false;
    }
  };

  return (
    <ChatPanel
      me="user"
      messages={messages}
      onSend={send}
      placeholder="Write a message to Lamia..."
      emptyText="This is your private chat with Lamia. Write your first message below."
      className="rounded-3xl bg-card border border-line overflow-hidden"
    />
  );
}
