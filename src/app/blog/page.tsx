// ==========================================
// Page: Blog list  (/blog)
// Shows every published post. Optional filter: /blog?tag=nextjs
// ==========================================

import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import { BookOpen } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import BlogCard from "@/components/blog/BlogCard";
import { isDbConfigured } from "@/lib/mongodb";
import { listAllTags, listPublishedPosts } from "@/lib/blog";
import type { Post } from "@/lib/blog-types";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  display: "swap",
});

// Always read fresh data from the database
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Blog | Lamia Kajal",
  description: "Articles about web development, learning and building things, by Lamia Kajal.",
};

type PageProps = { searchParams: Promise<{ tag?: string }> };

export default async function BlogPage({ searchParams }: PageProps) {
  const { tag } = await searchParams;

  let posts: Post[] = [];
  let tags: string[] = [];
  let problem = "";

  if (!isDbConfigured) {
    problem = "The blog database is not connected yet. Add MONGODB_URI to .env.local.";
  } else {
    try {
      [posts, tags] = await Promise.all([listPublishedPosts(tag), listAllTags()]);
    } catch {
      problem = "Could not load the posts right now. Please try again in a moment.";
    }
  }

  return (
    <section className="relative w-full pt-6 pb-20 sm:pb-28 overflow-hidden">
      <div className="absolute top-20 right-0 translate-x-1/2 w-72 sm:w-96 h-72 sm:h-96 bg-pink-600/10 blur-[130px] pointer-events-none rounded-full animate-pulse-glow" />
      <div className="absolute bottom-40 left-0 -translate-x-1/2 w-72 sm:w-96 h-72 sm:h-96 bg-fuchsia-600/10 blur-[130px] pointer-events-none rounded-full animate-pulse-glow" />

      <div className="w-full max-w-6xl mx-auto px-4 xs:px-5 sm:px-6 relative z-10">
        <Reveal direction="down">
          <div className="flex flex-col gap-4 items-center text-center mb-10 sm:mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pink-500/10 border border-pink-500/30 text-xs sm:text-sm font-medium text-pink-300 backdrop-blur-md">
              <BookOpen size={16} />
              <span>My Blog</span>
            </div>
            <h1 className={`text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-strong leading-tight ${outfit.className}`}>
              Thoughts &amp;{" "}
              <span className="animate-gradient-flow bg-linear-to-r from-pink-400 via-pink-200 to-fuchsia-400 bg-clip-text text-transparent">
                Articles
              </span>
            </h1>
            <p className="max-w-xl text-sm sm:text-base text-slate-400">
              Things I learn, build and want to share about web development and life as a developer.
            </p>
          </div>
        </Reveal>

        {tags.length > 0 && (
          <Reveal direction="up">
            <div className="flex flex-wrap justify-center gap-3 mb-10">
              <Link
                href="/blog"
                className={`px-5 py-2 rounded-full text-sm font-semibold border transition-all ${
                  !tag ? "bg-pink-500/15 border-pink-500/60 text-strong" : "bg-card border-line text-slate-300 hover:text-pink-400"
                }`}
              >
                All
              </Link>
              {tags.map((t) => (
                <Link
                  key={t}
                  href={`/blog?tag=${encodeURIComponent(t)}`}
                  className={`px-5 py-2 rounded-full text-sm font-semibold border transition-all ${
                    tag === t ? "bg-pink-500/15 border-pink-500/60 text-strong" : "bg-card border-line text-slate-300 hover:text-pink-400"
                  }`}
                >
                  #{t}
                </Link>
              ))}
            </div>
          </Reveal>
        )}

        {problem ? (
          <p className="text-center text-sm text-slate-300 rounded-2xl bg-card border border-line p-6 max-w-xl mx-auto">
            {problem}
          </p>
        ) : posts.length === 0 ? (
          <p className="text-center text-sm text-slate-300 rounded-2xl bg-card border border-line p-6 max-w-xl mx-auto">
            No articles yet. Please check back soon!
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {posts.map((post, i) => (
              <Reveal key={post.id} direction="up" delay={(i % 3) * 120}>
                <BlogCard post={post} index={i} />
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
