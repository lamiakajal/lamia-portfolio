// ==========================================
// Blog types and pure helpers (safe to import in BOTH server and client code).
// Do not import "mongodb" here, because this file is also used in the browser.
// ==========================================

// "draft"     = only the admin can see it
// "pending"   = written by another author, waiting for the admin to approve (used in phase 3)
// "published" = visible to everyone
export type PostStatus = "draft" | "pending" | "published";

export interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  /** Post body written in Markdown */
  content: string;
  coverImage: string;
  tags: string[];
  status: PostStatus;
  authorName: string;
  authorEmail: string;
  createdAt: string; // ISO date text
  updatedAt: string;
  publishedAt: string | null;
  readingMinutes: number;
  /** How many times readers opened the post */
  views: number;
}

/** What the editor sends to the API */
export interface PostInput {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  tags: string[];
  status: PostStatus;
}

/** "Hello World!" -> "hello-world" */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

/** About 200 words per minute */
export function readingMinutes(content: string): number {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

const isHttpUrl = (value: string) => /^https?:\/\/\S+$/i.test(value);

/** Checks and cleans the data coming from the editor (used by the API routes) */
export function parsePostInput(
  body: unknown,
): { ok: true; data: PostInput } | { ok: false; error: string } {
  if (!body || typeof body !== "object") {
    return { ok: false, error: "Invalid data." };
  }
  const b = body as Record<string, unknown>;
  const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");

  const title = str(b.title);
  const content = typeof b.content === "string" ? b.content : "";
  const excerpt = str(b.excerpt);
  const coverImage = str(b.coverImage);
  const status = b.status;
  const rawTags = Array.isArray(b.tags) ? b.tags : [];

  if (title.length < 3 || title.length > 150)
    return { ok: false, error: "Title must be 3 to 150 characters." };
  if (content.trim().length < 20)
    return { ok: false, error: "Please write at least a few sentences." };
  if (content.length > 100000)
    return { ok: false, error: "The post is too long." };
  if (excerpt.length > 300)
    return {
      ok: false,
      error: "The short summary can be 300 characters at most.",
    };
  if (coverImage && !isHttpUrl(coverImage))
    return { ok: false, error: "Cover image must be a full https:// link." };
  if (status !== "draft" && status !== "published" && status !== "pending")
    return { ok: false, error: "Invalid status." };

  const slug = slugify(str(b.slug) || title);
  if (!slug) return { ok: false, error: "Please enter a valid slug." };

  const tags = Array.from(
    new Set(
      rawTags
        .filter((t): t is string => typeof t === "string")
        .map((t) => t.trim().toLowerCase())
        .filter((t) => t.length > 0 && t.length <= 30),
    ),
  ).slice(0, 8);

  return {
    ok: true,
    data: { title, slug, excerpt, content, coverImage, tags, status },
  };
}
