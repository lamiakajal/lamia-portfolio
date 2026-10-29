// ==========================================
// Component: PostEngagement - reactions, save button and comments under a blog post
// Logged-in visitors can react, save and comment. Guests are asked to log in.
// Updates appear instantly (optimistic) and are undone if the server says no.
// ==========================================

"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bookmark, Loader2, MessageCircle, Send, Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/ToastProvider";
import {
  REACTIONS,
  timeAgo,
  type CommentItem,
  type Engagement,
  type ReactionType,
} from "@/lib/engagement-types";

interface PostEngagementProps {
  postId: string;
  slug: string;
  initial: Engagement;
  initialComments: CommentItem[];
  /** null = visitor is not logged in */
  user: { id: string; name: string; isAdmin: boolean } | null;
}

export default function PostEngagement({
  postId,
  slug,
  initial,
  initialComments,
  user,
}: PostEngagementProps) {
  const router = useRouter();
  const toast = useToast();

  const [eng, setEng] = useState<Engagement>(initial);
  const [comments, setComments] = useState<CommentItem[]>(initialComments);
  const [text, setText] = useState("");
  const [posting, setPosting] = useState(false);
  const [popped, setPopped] = useState<ReactionType | null>(null);

  const loginUrl = `/login?next=${encodeURIComponent(`/blog/${slug}`)}`;

  // Guests: friendly toast, then go to the login page
  const needLogin = (what: string) => {
    toast.info(`Please log in to ${what}.`, { title: "Login needed" });
    router.push(loginUrl);
  };

  /* ------------------------------ reactions ------------------------------ */
  const react = async (type: ReactionType) => {
    if (!user) return needLogin("react to this post");
    const before = eng;
    const next = type === eng.mine ? null : type; // clicking your reaction again removes it

    // instant update
    const counts = { ...eng.counts };
    if (eng.mine) counts[eng.mine] = Math.max(0, counts[eng.mine] - 1);
    if (next) counts[next] += 1;
    setEng({ ...eng, counts, mine: next });
    if (next) {
      setPopped(next);
      setTimeout(() => setPopped(null), 600);
    }

    try {
      const res = await fetch(`/api/posts/${postId}/reaction`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: next }),
      });
      const data = (await res.json().catch(() => ({}))) as { engagement?: Engagement; error?: string };
      if (!res.ok || !data.engagement) throw new Error(data.error ?? "failed");
      setEng(data.engagement);
    } catch (e) {
      setEng(before);
      toast.error(e instanceof Error && e.message !== "failed" ? e.message : "Could not save your reaction.");
    }
  };

  /* -------------------------------- save -------------------------------- */
  const toggleSave = async () => {
    if (!user) return needLogin("save posts");
    const before = eng;
    const saved = !eng.saved;
    setEng({ ...eng, saved });
    try {
      const res = await fetch(`/api/posts/${postId}/save`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ saved }),
      });
      const data = (await res.json().catch(() => ({}))) as { engagement?: Engagement; error?: string };
      if (!res.ok || !data.engagement) throw new Error(data.error ?? "failed");
      setEng(data.engagement);
      toast.success(saved ? "Saved to your reading list." : "Removed from saved posts.", {
        title: saved ? "Saved" : "Removed",
      });
    } catch {
      setEng(before);
      toast.error("Could not update your saved posts.");
    }
  };

  /* ------------------------------- comments ------------------------------ */
  const postComment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return needLogin("comment");
    if (text.trim().length < 2) return;
    setPosting(true);
    try {
      const res = await fetch(`/api/posts/${postId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: text }),
      });
      const data = (await res.json().catch(() => ({}))) as { comment?: CommentItem; error?: string };
      if (!res.ok || !data.comment) throw new Error(data.error ?? "Could not post your comment.");
      setComments((list) => [data.comment as CommentItem, ...list]);
      setEng((s) => ({ ...s, commentCount: s.commentCount + 1 }));
      setText("");
      toast.success("Your comment is live.", { title: "Comment posted" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not post your comment.");
    } finally {
      setPosting(false);
    }
  };

  const removeComment = async (id: string) => {
    if (!window.confirm("Delete this comment?")) return;
    const before = comments;
    setComments((list) => list.filter((c) => c.id !== id));
    try {
      const res = await fetch(`/api/posts/${postId}/comments?commentId=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("failed");
      setEng((s) => ({ ...s, commentCount: Math.max(0, s.commentCount - 1) }));
      toast.success("Comment deleted.");
    } catch {
      setComments(before);
      toast.error("Could not delete the comment.");
    }
  };

  const totalReactions = Object.values(eng.counts).reduce((a, b) => a + b, 0);

  return (
    <div className="space-y-10">
      {/* Reactions + save */}
      <div>
        <div className="flex flex-wrap items-center gap-3">
          {REACTIONS.map((r) => {
            const active = eng.mine === r.type;
            return (
              <button
                key={r.type}
                type="button"
                onClick={() => react(r.type)}
                aria-pressed={active}
                aria-label={`${r.label} (${eng.counts[r.type]})`}
                title={r.label}
                className={`group flex items-center gap-2 h-11 px-4 rounded-full border text-sm font-semibold transition-all duration-300 hover:-translate-y-1 active:scale-90 ${
                  active
                    ? "border-pink-500/70 bg-pink-500/15 text-strong shadow-[0_0_18px_rgba(236,72,153,0.4)]"
                    : "border-line bg-card text-slate-300 hover:border-pink-500/40"
                }`}
              >
                <span
                  className={`text-lg leading-none transition-transform duration-300 group-hover:scale-125 ${
                    popped === r.type ? "react-pop" : ""
                  }`}
                >
                  {r.emoji}
                </span>
                <span className="tabular-nums">{eng.counts[r.type]}</span>
              </button>
            );
          })}

          <button
            type="button"
            onClick={toggleSave}
            aria-pressed={eng.saved}
            className={`ml-auto flex items-center gap-2 h-11 px-4 rounded-full border text-sm font-semibold transition-all duration-300 hover:-translate-y-1 active:scale-90 ${
              eng.saved
                ? "border-pink-500/70 bg-pink-500/15 text-pink-400"
                : "border-line bg-card text-slate-300 hover:border-pink-500/40"
            }`}
          >
            <Bookmark size={17} className={eng.saved ? "fill-current" : ""} />
            {eng.saved ? "Saved" : "Save"}
          </button>
        </div>
        <p className="mt-3 text-xs text-slate-500">
          {totalReactions === 0
            ? "Be the first to react to this article."
            : `${totalReactions} ${totalReactions === 1 ? "reaction" : "reactions"}`}
        </p>
      </div>

      {/* Comments */}
      <section aria-labelledby="comments-title">
        <h2 id="comments-title" className="flex items-center gap-2 text-xl font-bold text-strong mb-5">
          <MessageCircle size={20} className="text-pink-400" />
          Comments ({eng.commentCount})
        </h2>

        {user ? (
          <form onSubmit={postComment} className="mb-8">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={3}
              maxLength={1000}
              placeholder="Share your thoughts..."
              className="w-full rounded-2xl bg-card border border-line px-4 py-3 text-sm text-strong placeholder:text-slate-500 outline-none transition-all focus:border-pink-500/70 focus:ring-4 focus:ring-pink-500/15 resize-y"
            />
            <div className="mt-3 flex items-center justify-between gap-3">
              <span className="text-xs text-slate-500">{text.length}/1000 • commenting as {user.name}</span>
              <button
                type="submit"
                disabled={posting || text.trim().length < 2}
                className="btn-shine relative overflow-hidden inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-linear-to-r from-pink-600 via-fuchsia-500 to-pink-500 text-white text-sm font-semibold shadow-[0_0_20px_rgba(236,72,153,0.45)] hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 transition-all"
              >
                {posting ? <Loader2 size={15} className="relative z-10 animate-spin" /> : <Send size={15} className="relative z-10" />}
                <span className="relative z-10">Post comment</span>
              </button>
            </div>
          </form>
        ) : (
          <div className="mb-8 rounded-2xl bg-card border border-line p-5 text-center">
            <p className="text-sm text-slate-300 mb-3">Log in to join the conversation.</p>
            <Link
              href={loginUrl}
              className="inline-flex px-5 py-2.5 rounded-full border border-pink-500/50 bg-pink-500/10 text-sm font-semibold text-strong hover:bg-pink-500/20 active:scale-95 transition-all"
            >
              Log in or sign up
            </Link>
          </div>
        )}

        {comments.length === 0 ? (
          <p className="text-sm text-slate-500">No comments yet. Start the conversation!</p>
        ) : (
          <ul className="space-y-4">
            {comments.map((c) => {
              const canDelete = user && (user.isAdmin || user.id === c.userId);
              return (
                <li key={c.id} className="skill-pop flex gap-3 p-4 rounded-2xl bg-card border border-line">
                  <span className="shrink-0 w-10 h-10 rounded-full bg-linear-to-br from-pink-500 to-fuchsia-500 text-white text-sm font-bold flex items-center justify-center">
                    {c.userName.charAt(0).toUpperCase()}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                      <span className="text-sm font-bold text-strong">{c.userName}</span>
                      <span className="text-xs text-slate-500" suppressHydrationWarning>
                        {timeAgo(c.createdAt)}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-slate-300 leading-relaxed whitespace-pre-wrap break-words">
                      {c.content}
                    </p>
                  </div>
                  {canDelete && (
                    <button
                      type="button"
                      onClick={() => removeComment(c.id)}
                      aria-label="Delete comment"
                      className="shrink-0 self-start w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-red-500 hover:bg-red-500/10 transition-colors"
                    >
                      <Trash2 size={15} />
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
