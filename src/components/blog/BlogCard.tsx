// ==========================================
// Component: BlogCard - one post card on the /blog page
// ==========================================

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Outfit } from "next/font/google";
import { ArrowRight, Clock } from "lucide-react";
import type { Post } from "@/lib/blog-types";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  display: "swap",
});

export const formatDate = (iso: string | null) =>
  iso
    ? new Date(iso).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "";

export default function BlogCard({ post, index = 0 }: { post: Post; index?: number }) {
  return (
    <article
      className="glow-card loop-bob group relative h-full flex flex-col rounded-2xl bg-card border border-line overflow-hidden"
      style={{ "--bob-delay": `${index * 0.5}s`, "--bob-dur": "7s" } as React.CSSProperties}
    >
      <Link href={`/blog/${post.slug}`} aria-label={post.title} className="block">
        <div className="relative aspect-16/10 w-full overflow-hidden bg-linear-to-br from-pink-600/40 via-fuchsia-600/30 to-purple-700/40">
          {post.coverImage ? (
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              unoptimized
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className={`text-6xl font-extrabold text-white/70 ${outfit.className}`}>
                {post.title.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
        </div>
      </Link>

      <div className="flex flex-col flex-1 p-5 sm:p-6">
        <div className="flex flex-wrap items-center gap-2 mb-3 text-xs text-slate-400">
          <span>{formatDate(post.publishedAt)}</span>
          <span aria-hidden>•</span>
          <span className="inline-flex items-center gap-1">
            <Clock size={12} />
            {post.readingMinutes} min read
          </span>
        </div>

        <h2 className={`text-lg sm:text-xl font-bold text-strong mb-2 leading-snug ${outfit.className}`}>
          {post.title}
        </h2>
        {post.excerpt && (
          <p className="text-sm text-slate-300 leading-relaxed mb-4 line-clamp-3">{post.excerpt}</p>
        )}

        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-5">
            {post.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-pink-500/10 border border-pink-500/25 text-pink-400"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        <Link
          href={`/blog/${post.slug}`}
          className="mt-auto inline-flex items-center gap-2 text-sm font-semibold text-pink-400 hover:text-pink-300"
        >
          Read article
          <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      </div>
    </article>
  );
}
