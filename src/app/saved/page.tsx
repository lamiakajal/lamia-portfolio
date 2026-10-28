// ==========================================
// Page: Saved posts  (/saved)  - the posts a logged-in visitor bookmarked
// ==========================================

import React from "react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Outfit } from "next/font/google";
import { Bookmark } from "lucide-react";
import Link from "next/link";
import BlogCard from "@/components/blog/BlogCard";
import { getSession } from "@/lib/session";
import { getPublishedPostsByIds } from "@/lib/blog";
import { listSavedPostIds } from "@/lib/engagement";
import type { Post } from "@/lib/blog-types";

const outfit = Outfit({ subsets: ["latin"], weight: ["600", "700", "800"], display: "swap" });

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Saved posts | Lamia Kajal", robots: { index: false } };

export default async function SavedPage() {
  const session = await getSession();
  if (!session) redirect("/login?next=/saved");

  let posts: Post[] = [];
  let problem = "";
  try {
    posts = await getPublishedPostsByIds(await listSavedPostIds(session.user.id));
  } catch {
    problem = "Could not load your saved posts right now.";
  }

  return (
    <section className="w-full pt-6 pb-24">
      <div className="w-full max-w-6xl mx-auto px-4 xs:px-5 sm:px-6 relative z-10">
        <h1 className={`flex items-center gap-3 text-3xl font-extrabold text-strong mb-8 ${outfit.className}`}>
          <Bookmark className="text-pink-400" /> Saved posts
        </h1>
        {problem ? (
          <p className="rounded-xl bg-red-500/10 border border-red-500/30 px-4 py-3 text-sm text-red-500">{problem}</p>
        ) : posts.length === 0 ? (
          <p className="rounded-2xl bg-card border border-line p-8 text-center text-sm text-slate-300">
            You have not saved anything yet. Open an article and press <strong className="text-strong">Save</strong>.{" "}
            <Link href="/blog" className="text-pink-400 font-semibold">Browse the blog</Link>
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {posts.map((post, i) => (
              <BlogCard key={post.id} post={post} index={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
