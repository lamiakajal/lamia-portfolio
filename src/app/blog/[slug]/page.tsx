// ==========================================
// Page: One blog post  (/blog/[slug])
// ==========================================

import React from "react";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Outfit } from "next/font/google";
import { ArrowLeft, Clock, Calendar, User } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import ShareButtons from "@/components/blog/ShareButtons";
import PostEngagement from "@/components/blog/PostEngagement";
import MessageMe from "@/components/blog/MessageMe";
import { getSession, isAdminUser } from "@/lib/session";
import { getEngagement, listComments } from "@/lib/engagement";
import { emptyCounts } from "@/lib/engagement-types";
import { formatDate } from "@/components/blog/BlogCard";
import { getPublishedPostBySlug } from "@/lib/blog";
import { renderMarkdown } from "@/lib/markdown";
import { contactInfo } from "@/data/portfolioData";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  display: "swap",
});

export const dynamic = "force-dynamic";

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const post = await getPublishedPostBySlug(slug);
    if (!post) return { title: "Article not found" };
    return {
      title: `${post.title} | Lamia Kajal`,
      description: post.excerpt || undefined,
      openGraph: {
        title: post.title,
        description: post.excerpt || undefined,
        type: "article",
        images: post.coverImage ? [post.coverImage] : undefined,
      },
      twitter: { card: "summary_large_image" },
    };
  } catch {
    return { title: "Blog | Lamia Kajal" };
  }
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug).catch(() => null);
  if (!post) notFound();

  // Reactions, saves and comments (the page still opens if this part fails)
  const session = await getSession().catch(() => null);
  const userId = session?.user?.id ?? null;
  const [engagement, comments] = await Promise.all([
    getEngagement(post.id, userId).catch(() => ({
      counts: emptyCounts(),
      mine: null,
      saved: false,
      commentCount: 0,
    })),
    listComments(post.id).catch(() => []),
  ]);

  const url = `${contactInfo.website}/blog/${post.slug}`;
  const html = renderMarkdown(post.content);

  return (
    <article className="relative w-full pt-6 pb-20 sm:pb-28 overflow-hidden">
      <div className="absolute top-20 right-0 translate-x-1/2 w-72 sm:w-96 h-72 sm:h-96 bg-pink-600/10 blur-[130px] pointer-events-none rounded-full animate-pulse-glow" />

      <div className="w-full max-w-3xl mx-auto px-4 xs:px-5 sm:px-6 relative z-10">
        <Reveal direction="right">
          <Link
            href="/blog"
            className="group inline-flex items-center gap-2 text-sm font-medium text-slate-300 hover:text-pink-400 transition-colors mb-8"
          >
            <ArrowLeft size={16} className="transition-transform duration-300 group-hover:-translate-x-1" />
            Back to Blog
          </Link>
        </Reveal>

        <Reveal direction="down">
          <header className="mb-8">
            {post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {post.tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/blog?tag=${encodeURIComponent(tag)}`}
                    className="px-3 py-1 rounded-full text-xs font-semibold bg-pink-500/10 border border-pink-500/30 text-pink-400 hover:bg-pink-500/20"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            )}
            <h1 className={`text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-strong leading-tight mb-5 ${outfit.className}`}>
              {post.title}
            </h1>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-slate-400">
              <span className="inline-flex items-center gap-1.5"><User size={14} />{post.authorName}</span>
              <span className="inline-flex items-center gap-1.5"><Calendar size={14} />{formatDate(post.publishedAt)}</span>
              <span className="inline-flex items-center gap-1.5"><Clock size={14} />{post.readingMinutes} min read</span>
            </div>
          </header>
        </Reveal>

        {post.coverImage && (
          <Reveal direction="zoom" delay={100}>
            <div className="relative aspect-video w-full rounded-3xl overflow-hidden border border-line shadow-2xl shadow-pink-500/15 mb-10">
              <Image src={post.coverImage} alt={post.title} fill unoptimized priority sizes="768px" className="object-cover" />
            </div>
          </Reveal>
        )}

        {/* Safe: the Markdown converter escapes all HTML before adding its own tags */}
        <Reveal direction="up" threshold={0.02}>
          <div className="prose-blog" dangerouslySetInnerHTML={{ __html: html }} />
        </Reveal>

        <Reveal direction="up">
          <div className="mt-12 pt-8 border-t border-line">
            <ShareButtons url={url} title={post.title} />
          </div>
        </Reveal>

        <Reveal direction="up">
          <div className="mt-10">
            <PostEngagement
              postId={post.id}
              slug={post.slug}
              initial={engagement}
              initialComments={comments}
              user={
                session
                  ? {
                      id: session.user.id,
                      name: session.user.name || "Reader",
                      isAdmin: isAdminUser(session.user),
                    }
                  : null
              }
            />
          </div>
        </Reveal>

        <Reveal direction="up">
          <div className="mt-12">
            <MessageMe
              loggedIn={Boolean(session)}
              loginUrl={`/login?next=${encodeURIComponent(`/blog/${post.slug}`)}`}
            />
          </div>
        </Reveal>
      </div>
    </article>
  );
}
