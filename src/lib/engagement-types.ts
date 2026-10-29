// ==========================================
// Reactions / comments / messages: types and pure helpers (safe for server AND browser).
// ==========================================

export const REACTIONS = [
  { type: "like", emoji: "👍", label: "Like" },
  { type: "love", emoji: "❤️", label: "Love" },
  { type: "clap", emoji: "👏", label: "Clap" },
  { type: "insight", emoji: "💡", label: "Insightful" },
  { type: "fire", emoji: "🔥", label: "Fire" },
] as const;

export type ReactionType = (typeof REACTIONS)[number]["type"];

export const isReactionType = (v: unknown): v is ReactionType =>
  REACTIONS.some((r) => r.type === v);

export interface Engagement {
  /** How many people chose each reaction */
  counts: Record<ReactionType, number>;
  /** The reaction of the current visitor (null = none) */
  mine: ReactionType | null;
  saved: boolean;
  commentCount: number;
}

export interface CommentItem {
  id: string;
  userId: string;
  userName: string;
  content: string;
  createdAt: string;
}

export interface MessageItem {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  source: "blog" | "contact";
  read: boolean;
  createdAt: string;
}

export const emptyCounts = (): Record<ReactionType, number> => ({
  like: 0,
  love: 0,
  clap: 0,
  insight: 0,
  fire: 0,
});

/** "5 minutes ago", "2 days ago", or a date for older items */
export function timeAgo(iso: string): string {
  const seconds = Math.max(1, Math.floor((Date.now() - new Date(iso).getTime()) / 1000));
  const steps: [number, string][] = [
    [60, "second"],
    [3600, "minute"],
    [86400, "hour"],
    [604800, "day"],
  ];
  let divisor = 1;
  for (const [limit, unit] of steps) {
    if (seconds < limit) {
      const n = Math.floor(seconds / divisor);
      return `${n} ${unit}${n === 1 ? "" : "s"} ago`;
    }
    divisor = limit;
  }
  return new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}
