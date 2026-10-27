// Page: Edit a post  (/admin/blog/[id]/edit)  - admin only
import React from "react";
import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { Outfit } from "next/font/google";
import PostEditor from "@/components/blog/PostEditor";
import NotAdmin from "@/components/blog/NotAdmin";
import { getSession, isAdminUser } from "@/lib/session";
import { getPostById } from "@/lib/blog";

const outfit = Outfit({ subsets: ["latin"], weight: ["600", "700", "800"], display: "swap" });

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Edit post | Lamia Kajal", robots: { index: false } };

type PageProps = { params: Promise<{ id: string }> };

export default async function EditPostPage({ params }: PageProps) {
  const { id } = await params;
  const session = await getSession();
  if (!session) redirect(`/login?next=/admin/blog/${id}/edit`);
  if (!isAdminUser(session.user)) return <NotAdmin email={session.user.email} />;

  const post = await getPostById(id).catch(() => null);
  if (!post) notFound();

  return (
    <section className="w-full pt-6 pb-24">
      <div className="w-full max-w-4xl mx-auto px-4 xs:px-5 sm:px-6 relative z-10">
        <h1 className={`text-3xl font-extrabold text-strong mb-8 ${outfit.className}`}>Edit post</h1>
        <PostEditor post={post} />
      </div>
    </section>
  );
}
