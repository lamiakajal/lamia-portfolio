// ==========================================
// Extra profile details (username, bio, location, date of birth). Server only.
// Name, email, password and picture are handled by the login system (BetterAuth).
// Collection: profiles
// ==========================================

import { db } from "@/lib/mongodb";
import { emptyProfile, type ProfileData } from "@/lib/chat-types";

interface ProfileDoc {
  userId: string;
  username: string;
  usernameLower: string;
  bio: string;
  location: string;
  dob: string;
  updatedAt: Date;
}

const profiles = () => db.collection<ProfileDoc>("profiles");

let indexReady: Promise<unknown> | null = null;
function ensureIndexes() {
  indexReady ??= Promise.all([
    profiles().createIndex({ userId: 1 }, { unique: true }),
    // usernames must be unique, but empty usernames are allowed many times
    profiles().createIndex(
      { usernameLower: 1 },
      { unique: true, partialFilterExpression: { usernameLower: { $gt: "" } } },
    ),
  ]).catch(() => {
    indexReady = null;
  });
  return indexReady;
}

export async function getProfile(userId: string): Promise<ProfileData> {
  await ensureIndexes();
  const doc = await profiles().findOne({ userId });
  return doc
    ? { username: doc.username, bio: doc.bio, location: doc.location, dob: doc.dob }
    : emptyProfile;
}

export async function saveProfile(
  userId: string,
  data: ProfileData,
): Promise<{ ok: true } | { ok: false; error: string }> {
  await ensureIndexes();
  try {
    await profiles().updateOne(
      { userId },
      { $set: { ...data, usernameLower: data.username.toLowerCase(), updatedAt: new Date() } },
      { upsert: true },
    );
    return { ok: true };
  } catch (error) {
    // 11000 = duplicate key: somebody already uses this username
    if (typeof error === "object" && error !== null && (error as { code?: number }).code === 11000) {
      return { ok: false, error: "That username is already taken." };
    }
    throw error;
  }
}
