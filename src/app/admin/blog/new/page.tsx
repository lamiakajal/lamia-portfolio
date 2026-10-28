// Page: Write a new post  (/admin/blog/new)  - admin only
import React from "react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Outfit } from "next/font/google";
import PostEditor from "@/components/blog/PostEditor";
import NotAdmin from "@/components/blog/NotAdmin";
import { getSession, isAdminEmail, isAdminUser } from "@/lib/session";

const outfit = Outfit({ subsets: ["latin"], weight: ["600", "700", "800"], display: "swap" });

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "New post | Lamia Kajal", robots: { index: false } };

export default async function NewPostPage() {
  const session = await getSession();
  if (!session) redirect("/login?next=/admin/blog/new");
  if (!isAdminUser(session.user)) return <NotAdmin
        email={session.user.email}
        verified={Boolean(session.user.emailVerified)}
        listed={isAdminEmail(session.user.email)}
      />;

  return (
    <section className="w-full pt-6 pb-24">
      <div className="w-full max-w-4xl mx-auto px-4 xs:px-5 sm:px-6 relative z-10">
        <h1 className={`text-3xl font-extrabold text-strong mb-8 ${outfit.className}`}>Write a new post</h1>
        <PostEditor />
      </div>
    </section>
  );
}
