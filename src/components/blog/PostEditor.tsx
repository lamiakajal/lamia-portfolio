// ==========================================
// Component: PostEditor - write or edit a blog post (admin only)
// Markdown text box with a toolbar, live preview, cover image upload, tags and status.
// ==========================================

"use client";

import React, { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Bold,
  Italic,
  Heading2,
  Link2,
  Quote,
  List,
  Code,
  ImagePlus,
  Eye,
  Pencil,
  Loader2,
  AlertCircle,
  UploadCloud,
} from "lucide-react";
import { renderMarkdown } from "@/lib/markdown";
import { slugify, type Post, type PostStatus } from "@/lib/blog-types";

const inputClass =
  "w-full rounded-xl bg-card border border-line px-4 py-3 text-sm text-strong placeholder:text-slate-500 outline-none transition-all duration-300 focus:border-pink-500/70 focus:ring-4 focus:ring-pink-500/15";
const labelClass = "block text-xs font-semibold text-slate-300 mb-1.5";

export default function PostEditor({ post }: { post?: Post }) {
  const router = useRouter();
  const editing = Boolean(post);

  const [title, setTitle] = useState(post?.title ?? "");
  const [slug, setSlug] = useState(post?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(editing);
  const [excerpt, setExcerpt] = useState(post?.excerpt ?? "");
  const [tags, setTags] = useState(post?.tags.join(", ") ?? "");
  const [coverImage, setCoverImage] = useState(post?.coverImage ?? "");
  const [content, setContent] = useState(post?.content ?? "");
  const [status, setStatus] = useState<PostStatus>(post?.status ?? "draft");

  const [preview, setPreview] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const textRef = useRef<HTMLTextAreaElement>(null);

  const onTitle = (value: string) => {
    setTitle(value);
    if (!slugTouched) setSlug(slugify(value));
  };

  // Wrap the selected text (or insert a placeholder) with Markdown symbols
  const wrap = (before: string, after = before, placeholder = "text") => {
    const el = textRef.current;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const selected = content.slice(start, end) || placeholder;
    setContent(content.slice(0, start) + before + selected + after + content.slice(end));
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(start + before.length, start + before.length + selected.length);
    });
  };

  // Put a Markdown snippet at the cursor
  const insertAtCursor = (snippet: string) => {
    const el = textRef.current;
    const pos = el ? el.selectionStart : content.length;
    setContent(content.slice(0, pos) + snippet + content.slice(pos));
  };

  const upload = async (file: File): Promise<string | null> => {
    setError("");
    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: form });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; url?: string; error?: string };
      if (!res.ok || !data.url) {
        setError(data.error ?? "Upload failed.");
        return null;
      }
      return data.url;
    } catch {
      setError("Upload failed. Check your connection.");
      return null;
    } finally {
      setUploading(false);
    }
  };

  const onCoverFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    const url = await upload(file);
    if (url) setCoverImage(url);
  };

  const onInlineImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    const url = await upload(file);
    if (url) insertAtCursor(`\n\n![${file.name.replace(/\.[^.]+$/, "")}](${url})\n\n`);
  };

  const save = async (nextStatus?: PostStatus) => {
    setError("");
    setSaving(true);
    const finalStatus = nextStatus ?? status;
    try {
      const res = await fetch(editing ? `/api/blog/${post?.id}` : "/api/blog", {
        method: editing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          slug,
          excerpt,
          coverImage,
          content,
          status: finalStatus,
          tags: tags.split(",").map((t) => t.trim()),
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) {
        setError(data.error ?? "Could not save the post.");
        setSaving(false);
        return;
      }
      router.push("/admin/blog");
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
      setSaving(false);
    }
  };

  const tool =
    "w-9 h-9 rounded-lg border border-line bg-card flex items-center justify-center text-slate-300 hover:text-pink-400 hover:border-pink-500/50 active:scale-90 transition-all";

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <label className="block md:col-span-2">
          <span className={labelClass}>Title</span>
          <input className={inputClass} value={title} onChange={(e) => onTitle(e.target.value)} placeholder="My first article" maxLength={150} />
        </label>
        <label className="block">
          <span className={labelClass}>Link name (slug)</span>
          <input
            className={inputClass}
            value={slug}
            onChange={(e) => {
              setSlug(slugify(e.target.value));
              setSlugTouched(true);
            }}
            placeholder="my-first-article"
          />
        </label>
        <label className="block">
          <span className={labelClass}>Tags (comma separated)</span>
          <input className={inputClass} value={tags} onChange={(e) => setTags(e.target.value)} placeholder="nextjs, learning, tips" />
        </label>
        <label className="block md:col-span-2">
          <span className={labelClass}>Short summary (shown on the card and when sharing)</span>
          <textarea className={`${inputClass} resize-y`} rows={2} maxLength={300} value={excerpt} onChange={(e) => setExcerpt(e.target.value)} />
        </label>
      </div>

      {/* Cover image */}
      <div>
        <span className={labelClass}>Cover image</span>
        <div className="flex flex-wrap items-center gap-3">
          <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-pink-500/40 bg-pink-500/10 text-sm font-semibold text-strong cursor-pointer hover:bg-pink-500/20 transition-colors">
            {uploading ? <Loader2 size={16} className="animate-spin" /> : <UploadCloud size={16} />}
            Upload image
            <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="sr-only" onChange={onCoverFile} />
          </label>
          <input
            className={`${inputClass} flex-1 min-w-48`}
            value={coverImage}
            onChange={(e) => setCoverImage(e.target.value)}
            placeholder="...or paste an image link (https://...)"
          />
        </div>
        {coverImage && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={coverImage} alt="Cover preview" className="mt-3 max-h-48 rounded-xl border border-line" />
        )}
      </div>

      {/* Content */}
      <div>
        <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
          <span className={labelClass + " mb-0"}>Article (Markdown)</span>
          <button
            type="button"
            onClick={() => setPreview((p) => !p)}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-line bg-card text-xs font-semibold text-slate-200 hover:text-pink-400"
          >
            {preview ? <Pencil size={14} /> : <Eye size={14} />}
            {preview ? "Edit" : "Preview"}
          </button>
        </div>

        {!preview && (
          <div className="flex flex-wrap gap-2 mb-2">
            <button type="button" className={tool} onClick={() => wrap("## ", "", "Heading")} aria-label="Heading" title="Heading"><Heading2 size={16} /></button>
            <button type="button" className={tool} onClick={() => wrap("**")} aria-label="Bold" title="Bold"><Bold size={16} /></button>
            <button type="button" className={tool} onClick={() => wrap("*")} aria-label="Italic" title="Italic"><Italic size={16} /></button>
            <button type="button" className={tool} onClick={() => wrap("[", "](https://)", "link text")} aria-label="Link" title="Link"><Link2 size={16} /></button>
            <button type="button" className={tool} onClick={() => wrap("> ", "", "quote")} aria-label="Quote" title="Quote"><Quote size={16} /></button>
            <button type="button" className={tool} onClick={() => wrap("- ", "", "list item")} aria-label="List" title="List"><List size={16} /></button>
            <button type="button" className={tool} onClick={() => wrap("`")} aria-label="Code" title="Code"><Code size={16} /></button>
            <label className={`${tool} cursor-pointer`} title="Insert image">
              {uploading ? <Loader2 size={16} className="animate-spin" /> : <ImagePlus size={16} />}
              <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="sr-only" onChange={onInlineImage} />
            </label>
          </div>
        )}

        {preview ? (
          <div className="rounded-xl bg-card border border-line p-5 min-h-64">
            <div className="prose-blog" dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }} />
          </div>
        ) : (
          <textarea
            ref={textRef}
            className={`${inputClass} font-mono resize-y min-h-80`}
            rows={16}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={"Write your article here.\n\n## A heading\nSome **bold** and *italic* text."}
          />
        )}
      </div>

      {error && (
        <p role="alert" className="flex items-start gap-2 rounded-xl bg-red-500/10 border border-red-500/30 px-4 py-3 text-sm text-red-500">
          <AlertCircle size={16} className="shrink-0 mt-0.5" />
          {error}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-2 text-sm text-slate-300">
          Status
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as PostStatus)}
            className="rounded-lg bg-card border border-line px-3 py-2 text-sm text-strong outline-none focus:border-pink-500/70"
          >
            <option value="draft">Draft (only me)</option>
            <option value="published">Published (everyone)</option>
          </select>
        </label>

        <button
          type="button"
          disabled={saving || uploading}
          onClick={() => save()}
          className="btn-shine relative overflow-hidden inline-flex items-center gap-2 px-6 py-3 rounded-full bg-linear-to-r from-pink-600 via-fuchsia-500 to-pink-500 text-white font-semibold text-sm shadow-[0_0_25px_rgba(236,72,153,0.5)] hover:scale-105 active:scale-95 disabled:opacity-60 transition-all"
        >
          {saving && <Loader2 size={16} className="relative z-10 animate-spin" />}
          <span className="relative z-10">{editing ? "Save changes" : "Save post"}</span>
        </button>
      </div>
    </div>
  );
}
