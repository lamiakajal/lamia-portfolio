// ==========================================
// Page: My Inbox  (/inbox) - a logged-in visitor's private chat with Lamia
// ==========================================

import React from "react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Outfit } from "next/font/google";
import { MessageSquare } from "lucide-react";
import UserChat from "@/components/chat/UserChat";
import { getSession } from "@/lib/session";
import { getUserChat } from "@/lib/chat";
import type { ChatMessage } from "@/lib/chat-types";

const outfit = Outfit({ subsets: ["latin"], weight: ["600", "700", "800"], display: "swap" });

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Inbox | Lamia Kajal", robots: { index: false } };

export default async function InboxPage() {
  const session = await getSession();
  if (!session) redirect("/login?next=/inbox");

  let messages: ChatMessage[] = [];
  let problem = "";
  try {
    messages = await getUserChat(session.user.id);
  } catch {
    problem = "Could not load your messages right now.";
  }

  return (
    <section className="w-full pt-6 pb-24">
      <div className="w-full max-w-3xl mx-auto px-4 xs:px-5 sm:px-6 relative z-10">
        <h1 className={`flex items-center gap-3 text-3xl font-extrabold text-strong mb-2 ${outfit.className}`}>
          <MessageSquare className="text-pink-400" /> My Inbox
        </h1>
        <p className="text-sm text-slate-400 mb-6">
          Your private conversation with Lamia. Replies appear here by themselves.
        </p>
        {problem ? (
          <p className="rounded-xl bg-red-500/10 border border-red-500/30 px-4 py-3 text-sm text-red-500">{problem}</p>
        ) : (
          <UserChat initial={messages} />
        )}
      </div>
    </section>
  );
}
