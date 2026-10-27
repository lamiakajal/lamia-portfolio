// ==========================================
// Page: Manage posts  (/admin/blog)  - admin only
// ==========================================

import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Outfit } from "next/font/google";
import { Pencil, Plus, ExternalLink } from "lucide-react";
import DeletePostButton from "@/components/blog/DeletePostButton";
import NotAdmin from "@/components/blog/NotAdmin";
import { formatDate } from "@/components/blog/BlogCard";
import { getSession, isAdminUser } from "@/lib/session";
import { listAllPosts } from "@/lib/blog";
import type { Post } from "@/lib/blog-types";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  display: "swap",
});

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Manage posts | Lamia Kajal", robots: { index: false } };

const badge: Record<string, string> = {
  published: "bg-emerald-500/10 border-emerald-500/30 text-emerald-500",
  draft: "bg-slate-500/10 border-slate-500/30 text-slate-400",
  pending: "bg-amber-500/10 border-amber-500/30 text-amber-500",
};

export default async function AdminBlogPage() {
  const session = await getSession();
  if (!session) redirect("/login?next=/admin/blog");
  if (!isAdminUser(session.user)) return <NotAdmin email={session.user.email} />;

  let posts: Post[] = [];
  let problem = "";
  try {
    posts = await listAllPosts();
  } catch {
    problem = "Could not load posts. Is MONGODB_URI set correctly?";
  }

  return (
    <section className="w-full pt-6 pb-24">
      <div className="w-full max-w-5xl mx-auto px-4 xs:px-5 sm:px-6 relative z-10">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <h1 className={`text-3xl font-extrabold text-strong ${outfit.className}`}>Manage posts</h1>
          <Link
            href="/admin/blog/new"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-linear-to-r from-pink-600 via-fuchsia-500 to-pink-500 text-white text-sm font-semibold shadow-[0_0_20px_rgba(236,72,153,0.45)] hover:scale-105 active:scale-95 transition-all"
          >
            <Plus size={16} /> New post
          </Link>
        </div>

        {problem && <p className="rounded-xl bg-red-500/10 border border-red-500/30 px-4 py-3 text-sm text-red-500 mb-6">{problem}</p>}

        {!problem && posts.length === 0 && (
          <p className="rounded-2xl bg-card border border-line p-8 text-center text-sm text-slate-300">
            No posts yet. Click <strong className="text-strong">New post</strong> to write your first article.
          </p>
        )}

        <div className="space-y-3">
          {posts.map((post) => (
            <div key={post.id} className="flex flex-wrap items-center gap-4 p-4 rounded-2xl bg-card border border-line">
              <div className="flex-1 min-w-56">
                <p className="font-bold text-strong leading-snug">{post.title}</p>
                <p className="text-xs text-slate-400 mt-1">
                  /blog/{post.slug} • updated {formatDate(post.updatedAt)}
                </p>
              </div>
              <span className={`px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-widest border ${badge[post.status] ?? badge.draft}`}>
                {post.status}
              </span>
              <div className="flex items-center gap-2">
                {post.status === "published" && (
                  <Link href={`/blog/${post.slug}`} aria-label="View post" className="w-9 h-9 rounded-lg border border-line bg-card flex items-center justify-center text-slate-300 hover:text-pink-400">
                    <ExternalLink size={15} />
                  </Link>
                )}
                <Link href={`/admin/blog/${post.id}/edit`} aria-label="Edit post" className="w-9 h-9 rounded-lg border border-line bg-card flex items-center justify-center text-slate-300 hover:text-pink-400">
                  <Pencil size={15} />
                </Link>
                <DeletePostButton id={post.id} title={post.title} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
