// ==========================================
// Blog phase 2 database functions (server only):
// reactions, saved posts, comments and inbox messages.
// Collections: reactions, saves, comments, messages
// ==========================================

import { ObjectId } from "mongodb";
import { db } from "@/lib/mongodb";
import {
  emptyCounts,
  type CommentItem,
  type Engagement,
  type MessageItem,
  type ReactionType,
} from "@/lib/engagement-types";

interface ReactionDoc { postId: string; userId: string; type: ReactionType; createdAt: Date }
interface SaveDoc { postId: string; userId: string; createdAt: Date }
interface CommentDoc { postId: string; userId: string; userName: string; content: string; createdAt: Date }
interface MessageDoc {
  name: string;
  email: string;
  subject: string;
  message: string;
  userId: string | null;
  source: "blog" | "contact";
  read: boolean;
  createdAt: Date;
}

const reactions = () => db.collection<ReactionDoc>("reactions");
const saves = () => db.collection<SaveDoc>("saves");
const comments = () => db.collection<CommentDoc>("comments");
const messages = () => db.collection<MessageDoc>("messages");

let indexReady: Promise<unknown> | null = null;
function ensureIndexes() {
  // one reaction and one save per person per post; fast lookups by post
  indexReady ??= Promise.all([
    reactions().createIndex({ postId: 1, userId: 1 }, { unique: true }),
    saves().createIndex({ postId: 1, userId: 1 }, { unique: true }),
    saves().createIndex({ userId: 1, createdAt: -1 }),
    comments().createIndex({ postId: 1, createdAt: -1 }),
    messages().createIndex({ createdAt: -1 }),
  ]).catch(() => {
    indexReady = null;
  });
  return indexReady;
}

/* ------------------------------- engagement ------------------------------- */

export async function getEngagement(postId: string, userId: string | null): Promise<Engagement> {
  await ensureIndexes();
  const grouped = await reactions()
    .aggregate<{ _id: ReactionType; count: number }>([
      { $match: { postId } },
      { $group: { _id: "$type", count: { $sum: 1 } } },
    ])
    .toArray();

  const counts = emptyCounts();
  for (const g of grouped) {
    if (g._id in counts) counts[g._id] = g.count;
  }

  const [mine, saved, commentCount] = await Promise.all([
    userId ? reactions().findOne({ postId, userId }) : Promise.resolve(null),
    userId ? saves().findOne({ postId, userId }) : Promise.resolve(null),
    comments().countDocuments({ postId }),
  ]);

  return { counts, mine: mine ? mine.type : null, saved: Boolean(saved), commentCount };
}

/** type = null removes the reaction */
export async function setReaction(postId: string, userId: string, type: ReactionType | null) {
  await ensureIndexes();
  if (type === null) {
    await reactions().deleteOne({ postId, userId });
  } else {
    await reactions().updateOne(
      { postId, userId },
      { $set: { type, createdAt: new Date() } },
      { upsert: true },
    );
  }
}

export async function setSaved(postId: string, userId: string, saved: boolean) {
  await ensureIndexes();
  if (saved) {
    await saves().updateOne({ postId, userId }, { $set: { createdAt: new Date() } }, { upsert: true });
  } else {
    await saves().deleteOne({ postId, userId });
  }
}

/** Newest saved first */
export async function listSavedPostIds(userId: string): Promise<string[]> {
  await ensureIndexes();
  const docs = await saves().find({ userId }).sort({ createdAt: -1 }).toArray();
  return docs.map((d) => d.postId);
}

/* -------------------------------- comments -------------------------------- */

const toComment = (d: CommentDoc & { _id: ObjectId }): CommentItem => ({
  id: d._id.toHexString(),
  userId: d.userId,
  userName: d.userName,
  content: d.content,
  createdAt: d.createdAt.toISOString(),
});

export async function listComments(postId: string): Promise<CommentItem[]> {
  await ensureIndexes();
  const docs = await comments().find({ postId }).sort({ createdAt: -1 }).limit(200).toArray();
  return docs.map(toComment);
}

export async function addComment(
  postId: string,
  user: { id: string; name: string },
  content: string,
): Promise<CommentItem> {
  await ensureIndexes();
  const doc: CommentDoc = {
    postId,
    userId: user.id,
    userName: user.name,
    content,
    createdAt: new Date(),
  };
  const result = await comments().insertOne(doc);
  return toComment({ ...doc, _id: result.insertedId });
}

/** The author of a comment can delete it, and so can the admin */
export async function deleteComment(commentId: string, userId: string, isAdmin: boolean): Promise<boolean> {
  if (!ObjectId.isValid(commentId)) return false;
  const filter = isAdmin
    ? { _id: new ObjectId(commentId) }
    : { _id: new ObjectId(commentId), userId };
  const result = await comments().deleteOne(filter);
  return result.deletedCount === 1;
}

/* --------------------------------- inbox ---------------------------------- */

const toMessage = (d: MessageDoc & { _id: ObjectId }): MessageItem => ({
  id: d._id.toHexString(),
  name: d.name,
  email: d.email,
  subject: d.subject,
  message: d.message,
  source: d.source,
  read: d.read,
  createdAt: d.createdAt.toISOString(),
});

export async function addMessage(input: {
  name: string;
  email: string;
  subject: string;
  message: string;
  userId: string | null;
  source: "blog" | "contact";
}) {
  await ensureIndexes();
  await messages().insertOne({ ...input, read: false, createdAt: new Date() });
}

export async function listMessages(): Promise<MessageItem[]> {
  await ensureIndexes();
  const docs = await messages().find({}).sort({ createdAt: -1 }).limit(300).toArray();
  return docs.map(toMessage);
}

export async function countUnreadMessages(): Promise<number> {
  return messages().countDocuments({ read: false });
}

export async function setMessageRead(id: string, read: boolean): Promise<boolean> {
  if (!ObjectId.isValid(id)) return false;
  const result = await messages().updateOne({ _id: new ObjectId(id) }, { $set: { read } });
  return result.matchedCount === 1;
}

export async function deleteMessage(id: string): Promise<boolean> {
  if (!ObjectId.isValid(id)) return false;
  const result = await messages().deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount === 1;
}
