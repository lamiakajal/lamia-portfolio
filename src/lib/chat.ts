// ==========================================
// Inbox / chat between a visitor and Lamia (server only).
// One conversation ("thread") per visitor. Collections: threads, chat_messages
// ==========================================

import { ObjectId } from "mongodb";
import { db } from "@/lib/mongodb";
import type { ChatMessage, ThreadSummary } from "@/lib/chat-types";

interface ThreadDoc {
  userId: string;
  userName: string;
  userEmail: string;
  userImage: string | null;
  lastMessage: string;
  lastAt: Date;
  unreadForAdmin: number;
  unreadForUser: number;
  createdAt: Date;
}
interface ChatMsgDoc {
  threadId: string;
  from: "user" | "admin";
  text: string;
  createdAt: Date;
}

const threads = () => db.collection<ThreadDoc>("threads");
const chatMessages = () => db.collection<ChatMsgDoc>("chat_messages");

let indexReady: Promise<unknown> | null = null;
function ensureIndexes() {
  indexReady ??= Promise.all([
    threads().createIndex({ userId: 1 }, { unique: true }),
    threads().createIndex({ lastAt: -1 }),
    chatMessages().createIndex({ threadId: 1, createdAt: 1 }),
  ]).catch(() => {
    indexReady = null;
  });
  return indexReady;
}

const toMessage = (d: ChatMsgDoc & { _id: ObjectId }): ChatMessage => ({
  id: d._id.toHexString(),
  from: d.from,
  text: d.text,
  createdAt: d.createdAt.toISOString(),
});

const toThread = (d: ThreadDoc & { _id: ObjectId }): ThreadSummary => ({
  id: d._id.toHexString(),
  userId: d.userId,
  userName: d.userName,
  userEmail: d.userEmail,
  userImage: d.userImage,
  lastMessage: d.lastMessage,
  lastAt: d.lastAt.toISOString(),
  unreadForAdmin: d.unreadForAdmin,
});

const preview = (text: string) => (text.length > 90 ? `${text.slice(0, 90)}...` : text);

/* ------------------------------- visitor side ------------------------------- */

/** The visitor's messages. Opening the chat marks Lamia's replies as read. */
export async function getUserChat(userId: string): Promise<ChatMessage[]> {
  await ensureIndexes();
  const thread = await threads().findOne({ userId });
  if (!thread) return [];
  const threadId = thread._id.toHexString();
  if (thread.unreadForUser > 0) {
    await threads().updateOne({ _id: thread._id }, { $set: { unreadForUser: 0 } });
  }
  const docs = await chatMessages().find({ threadId }).sort({ createdAt: 1 }).limit(500).toArray();
  return docs.map(toMessage);
}

export async function sendUserMessage(
  user: { id: string; name: string; email: string; image?: string | null },
  text: string,
): Promise<ChatMessage> {
  await ensureIndexes();
  const now = new Date();
  await threads().updateOne(
    { userId: user.id },
    {
      $set: {
        userName: user.name,
        userEmail: user.email,
        userImage: user.image ?? null,
        lastMessage: preview(text),
        lastAt: now,
      },
      $inc: { unreadForAdmin: 1 },
      $setOnInsert: { unreadForUser: 0, createdAt: now },
    },
    { upsert: true },
  );
  const thread = await threads().findOne({ userId: user.id });
  const threadId = (thread as { _id: ObjectId })._id.toHexString();
  const doc: ChatMsgDoc = { threadId, from: "user", text, createdAt: now };
  const result = await chatMessages().insertOne(doc);
  return toMessage({ ...doc, _id: result.insertedId });
}

export async function countUnreadForUser(userId: string): Promise<number> {
  const thread = await threads().findOne({ userId });
  return thread ? thread.unreadForUser : 0;
}

/* -------------------------------- admin side -------------------------------- */

export async function listThreads(): Promise<ThreadSummary[]> {
  await ensureIndexes();
  const docs = await threads().find({}).sort({ lastAt: -1 }).limit(200).toArray();
  return docs.map(toThread);
}

export async function getThreadMessages(
  threadId: string,
): Promise<{ thread: ThreadSummary; messages: ChatMessage[] } | null> {
  if (!ObjectId.isValid(threadId)) return null;
  await ensureIndexes();
  const thread = await threads().findOne({ _id: new ObjectId(threadId) });
  if (!thread) return null;
  if (thread.unreadForAdmin > 0) {
    await threads().updateOne({ _id: thread._id }, { $set: { unreadForAdmin: 0 } });
    thread.unreadForAdmin = 0;
  }
  const docs = await chatMessages().find({ threadId }).sort({ createdAt: 1 }).limit(500).toArray();
  return { thread: toThread(thread), messages: docs.map(toMessage) };
}

export async function sendAdminReply(threadId: string, text: string): Promise<ChatMessage | null> {
  if (!ObjectId.isValid(threadId)) return null;
  const now = new Date();
  const result0 = await threads().updateOne(
    { _id: new ObjectId(threadId) },
    { $set: { lastMessage: `You: ${preview(text)}`, lastAt: now }, $inc: { unreadForUser: 1 } },
  );
  if (result0.matchedCount !== 1) return null;
  const doc: ChatMsgDoc = { threadId, from: "admin", text, createdAt: now };
  const result = await chatMessages().insertOne(doc);
  return toMessage({ ...doc, _id: result.insertedId });
}

export async function countUnreadThreads(): Promise<number> {
  return threads().countDocuments({ unreadForAdmin: { $gt: 0 } });
}
