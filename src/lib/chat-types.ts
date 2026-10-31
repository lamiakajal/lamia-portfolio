// ==========================================
// Chat (inbox) and profile types + validation. Safe for server AND browser.
// ==========================================

export interface ChatMessage {
  id: string;
  from: "user" | "admin";
  text: string;
  createdAt: string;
}

export interface ThreadSummary {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userImage: string | null;
  lastMessage: string;
  lastAt: string;
  unreadForAdmin: number;
}

export interface ProfileData {
  username: string;
  bio: string;
  location: string;
  /** Date of birth as YYYY-MM-DD (private: only the owner and the admin can see it) */
  dob: string;
}

export const emptyProfile: ProfileData = { username: "", bio: "", location: "", dob: "" };

/** Checks the profile form (used by the API route) */
export function parseProfileInput(
  body: unknown,
): { ok: true; data: ProfileData } | { ok: false; error: string } {
  if (!body || typeof body !== "object") return { ok: false, error: "Invalid data." };
  const b = body as Record<string, unknown>;
  const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");

  const username = str(b.username).toLowerCase();
  const bio = str(b.bio);
  const location = str(b.location);
  const dob = str(b.dob);

  if (username && !/^[a-z0-9_.]{3,20}$/.test(username))
    return { ok: false, error: "Username: 3 to 20 letters, numbers, dots or underscores." };
  if (bio.length > 200) return { ok: false, error: "Bio can be 200 characters at most." };
  if (location.length > 80) return { ok: false, error: "Location can be 80 characters at most." };
  if (dob) {
    const d = new Date(dob);
    const valid = /^\d{4}-\d{2}-\d{2}$/.test(dob) && !Number.isNaN(d.getTime());
    if (!valid || d.getFullYear() < 1900 || d > new Date())
      return { ok: false, error: "Please enter a valid date of birth." };
  }
  return { ok: true, data: { username, bio, location, dob } };
}

export const MAX_CHAT_LENGTH = 2000;
