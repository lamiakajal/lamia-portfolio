// ==========================================
// Blog database functions (server only: they talk to MongoDB).
// Collection name: "posts"
// ==========================================

import { ObjectId } from "mongodb";
import { db } from "@/lib/mongodb";
import {
  readingMinutes,
  slugify,
  type Post,
  type PostInput,
  type PostStatus,
} from "@/lib/blog-types";

interface PostDoc {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  tags: string[];
  status: PostStatus;
  authorName: string;
  authorEmail: string;
  createdAt: Date;
  updatedAt: Date;
  publishedAt: Date | null;
  views?: number;
}

const posts = () => db.collection<PostDoc>("posts");

let indexReady: Promise<unknown> | null = null;
function ensureIndexes() {
  // slugs must be unique, and listing by date should be fast
  indexReady ??= Promise.all([
    posts().createIndex({ slug: 1 }, { unique: true }),
    posts().createIndex({ status: 1, publishedAt: -1 }),
  ]).catch(() => {
    indexReady = null;
  });
  return indexReady;
}

// Database record -> plain object that is safe to send to the browser
function toPost(doc: PostDoc & { _id: ObjectId }): Post {
  return {
    id: doc._id.toHexString(),
    slug: doc.slug,
    title: doc.title,
    excerpt: doc.excerpt,
    content: doc.content,
    coverImage: doc.coverImage,
    tags: doc.tags,
    status: doc.status,
    authorName: doc.authorName,
    authorEmail: doc.authorEmail,
    createdAt: doc.createdAt.toISOString(),
    updatedAt: doc.updatedAt.toISOString(),
    publishedAt: doc.publishedAt ? doc.publishedAt.toISOString() : null,
    readingMinutes: readingMinutes(doc.content),
    views: doc.views ?? 0,
  };
}

// If "my-post" already exists, use "my-post-2", "my-post-3", ...
async function uniqueSlug(wanted: string, ignoreId?: string): Promise<string> {
  const base = slugify(wanted) || "post";
  let candidate = base;
  let n = 2;
  for (;;) {
    const found = await posts().findOne({ slug: candidate });
    if (!found || (ignoreId && found._id.toHexString() === ignoreId)) {
      return candidate;
    }
    candidate = `${base}-${n}`;
    n++;
  }
}

/* ---------------------------- public reading ---------------------------- */

export async function listPublishedPosts(tag?: string): Promise<Post[]> {
  await ensureIndexes();
  const filter = tag
    ? { status: "published" as const, tags: tag }
    : { status: "published" as const };
  const docs = await posts().find(filter).sort({ publishedAt: -1 }).toArray();
  return docs.map(toPost);
}

export async function getPublishedPostBySlug(
  slug: string,
): Promise<Post | null> {
  await ensureIndexes();
  const doc = await posts().findOne({ slug, status: "published" });
  return doc ? toPost(doc) : null;
}

export async function listAllTags(): Promise<string[]> {
  const tags = await posts().distinct("tags", { status: "published" });
  return tags.sort();
}

/* ------------------------------ admin only ------------------------------ */

export async function listAllPosts(): Promise<Post[]> {
  await ensureIndexes();
  const docs = await posts().find({}).sort({ updatedAt: -1 }).toArray();
  return docs.map(toPost);
}

export async function getPostById(id: string): Promise<Post | null> {
  if (!ObjectId.isValid(id)) return null;
  const doc = await posts().findOne({ _id: new ObjectId(id) });
  return doc ? toPost(doc) : null;
}

export async function createPost(
  input: PostInput,
  author: { name: string; email: string },
): Promise<Post> {
  await ensureIndexes();
  const now = new Date();
  const doc: PostDoc = {
    slug: await uniqueSlug(input.slug),
    title: input.title,
    excerpt: input.excerpt,
    content: input.content,
    coverImage: input.coverImage,
    tags: input.tags,
    status: input.status,
    authorName: author.name,
    authorEmail: author.email,
    createdAt: now,
    updatedAt: now,
    publishedAt: input.status === "published" ? now : null,
  };
  const result = await posts().insertOne(doc);
  return toPost({ ...doc, _id: result.insertedId });
}

export async function updatePost(
  id: string,
  input: PostInput,
): Promise<Post | null> {
  if (!ObjectId.isValid(id)) return null;
  const _id = new ObjectId(id);
  const existing = await posts().findOne({ _id });
  if (!existing) return null;

  const now = new Date();
  // keep the first publish date; set it when a draft is published for the first time
  const publishedAt =
    input.status === "published"
      ? (existing.publishedAt ?? now)
      : existing.publishedAt;

  const changes = {
    slug: await uniqueSlug(input.slug, id),
    title: input.title,
    excerpt: input.excerpt,
    content: input.content,
    coverImage: input.coverImage,
    tags: input.tags,
    status: input.status,
    updatedAt: now,
    publishedAt,
  };
  await posts().updateOne({ _id }, { $set: changes });
  return toPost({ ...existing, ...changes, _id });
}

export async function deletePost(id: string): Promise<boolean> {
  if (!ObjectId.isValid(id)) return false;
  const result = await posts().deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount === 1;
}

/** Is there a PUBLISHED post with this id? (used before saving a reaction / comment) */
export async function isPublishedPostId(id: string): Promise<boolean> {
  if (!ObjectId.isValid(id)) return false;
  const doc = await posts().findOne({
    _id: new ObjectId(id),
    status: "published",
  });
  return Boolean(doc);
}

/** Published posts for a list of ids, in the same order as the ids (used by the Saved page) */
export async function getPublishedPostsByIds(ids: string[]): Promise<Post[]> {
  const valid = ids.filter((id) => ObjectId.isValid(id));
  if (valid.length === 0) return [];
  const docs = await posts()
    .find({
      _id: { $in: valid.map((id) => new ObjectId(id)) },
      status: "published",
    })
    .toArray();
  const byId = new Map(docs.map((d) => [d._id.toHexString(), toPost(d)]));
  return valid.map((id) => byId.get(id)).filter((p): p is Post => Boolean(p));
}

/** +1 view (the browser calls this once per visitor session) */
export async function addPostView(id: string): Promise<void> {
  if (!ObjectId.isValid(id)) return;
  await posts().updateOne(
    { _id: new ObjectId(id), status: "published" },
    { $inc: { views: 1 } },
  );
}

/** Numbers for the admin dashboard */
export async function getBlogStats() {
  const [published, drafts, top, all] = await Promise.all([
    posts().countDocuments({ status: "published" }),
    posts().countDocuments({ status: { $ne: "published" } }),
    posts()
      .find({ status: "published" })
      .sort({ views: -1 })
      .limit(5)
      .toArray(),
    posts().find({ status: "published" }).toArray(),
  ]);
  const views = all.reduce((sum, d) => sum + (d.views ?? 0), 0);
  return { published, drafts, views, top: top.map(toPost) };
}
