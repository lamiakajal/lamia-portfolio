// ==========================================
// Numbers for the admin dashboard (server only).
// Registered people live in the "user" collection created by the login system.
// ==========================================

import { db } from "@/lib/mongodb";
import { getBlogStats } from "@/lib/blog";
import { countUnreadThreads } from "@/lib/chat";
import { countUnreadMessages } from "@/lib/engagement";

interface UserDoc {
  name?: string;
  email?: string;
  image?: string | null;
  emailVerified?: boolean;
  createdAt?: Date;
}

export interface RecentUser {
  name: string;
  email: string;
  image: string | null;
  verified: boolean;
  joined: string | null;
}

export async function getDashboardStats() {
  const users = db.collection<UserDoc>("user");
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const [totalUsers, newUsers, recent, blog, reactions, comments, saves, unreadChats, unreadMessages] =
    await Promise.all([
      users.countDocuments(),
      users.countDocuments({ createdAt: { $gte: weekAgo } }),
      users.find({}).sort({ createdAt: -1 }).limit(8).toArray(),
      getBlogStats(),
      db.collection("reactions").countDocuments(),
      db.collection("comments").countDocuments(),
      db.collection("saves").countDocuments(),
      countUnreadThreads(),
      countUnreadMessages(),
    ]);

  const recentUsers: RecentUser[] = recent.map((u) => ({
    name: u.name ?? "Unknown",
    email: u.email ?? "",
    image: u.image ?? null,
    verified: Boolean(u.emailVerified),
    joined: u.createdAt ? new Date(u.createdAt).toISOString() : null,
  }));

  return {
    totalUsers,
    newUsers,
    recentUsers,
    blog,
    reactions,
    comments,
    saves,
    unread: unreadChats + unreadMessages,
  };
}
