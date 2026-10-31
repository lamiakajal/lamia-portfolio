// ==========================================
// Page: Inbox  (/admin/inbox)  - admin only
// ==========================================

import React from "react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Outfit } from "next/font/google";
import { Inbox } from "lucide-react";
import AdminInboxTabs from "@/components/chat/AdminInboxTabs";
import NotAdmin from "@/components/blog/NotAdmin";
import { getSession, isAdminEmail, isAdminUser } from "@/lib/session";
import { listMessages } from "@/lib/engagement";
import { listThreads } from "@/lib/chat";
import type { MessageItem } from "@/lib/engagement-types";
import type { ThreadSummary } from "@/lib/chat-types";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  display: "swap",
});

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Inbox | Lamia Kajal",
  robots: { index: false },
};

export default async function InboxPage() {
  const session = await getSession();
  if (!session) redirect("/login?next=/admin/inbox");
  if (!isAdminUser(session.user)) {
    return (
      <NotAdmin
        email={session.user.email}
        verified={Boolean(session.user.emailVerified)}
        listed={isAdminEmail(session.user.email)}
      />
    );
  }

  let messages: MessageItem[] = [];
  let threads: ThreadSummary[] = [];
  let problem = "";
  try {
    [messages, threads] = await Promise.all([listMessages(), listThreads()]);
  } catch {
    problem = "Could not load messages. Is MONGODB_URI set correctly?";
  }

  return (
    <section className="w-full pt-6 pb-24">
      <div className="w-full max-w-5xl mx-auto px-4 xs:px-5 sm:px-6 relative z-10">
        <h1
          className={`flex items-center gap-3 text-3xl font-extrabold text-strong mb-8 ${outfit.className}`}
        >
          <Inbox className="text-pink-400" /> Inbox
        </h1>
        {problem ? (
          <p className="rounded-xl bg-red-500/10 border border-red-500/30 px-4 py-3 text-sm text-red-500">
            {problem}
          </p>
        ) : (
          <AdminInboxTabs threads={threads} messages={messages} />
        )}
      </div>
    </section>
  );
}
