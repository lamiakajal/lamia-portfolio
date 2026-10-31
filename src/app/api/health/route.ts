// ==========================================
// GET /api/health
// A safe checkup page: shows which settings are filled in, which address login uses for
// Google/GitHub redirects, and whether the database connects.
// It never shows passwords or keys: only true / false and short reasons.
// Works on localhost AND on the live site (https://lamiakajal.com/api/health).
// ==========================================

import { NextResponse } from "next/server";
import { client } from "@/lib/mongodb";
import { resolveBaseUrl } from "@/lib/base-url";

export const dynamic = "force-dynamic";

// Turns a raw database error into a short, safe hint
function explain(message: string): string {
  const m = message.toLowerCase();
  if (m.includes("authentication failed") || m.includes("bad auth"))
    return "wrong database username or password in MONGODB_URI";
  if (m.includes("whitelist") || m.includes("not allowed") || m.includes("server selection") || m.includes("timed out"))
    return "Atlas is blocking this server: open Atlas -> Network Access and allow 0.0.0.0/0";
  if (m.includes("querysrv") || m.includes("enotfound") || m.includes("econnrefused"))
    return "DNS / network problem reaching the database address";
  if (m.includes("invalid scheme") || m.includes("invalid connection string"))
    return "MONGODB_URI is not a valid connection string";
  return "unknown database error";
}

export async function GET() {
  const filled = (name: string) => Boolean(process.env[name]);
  const settings = {
    MONGODB_URI: filled("MONGODB_URI"),
    BETTER_AUTH_SECRET: filled("BETTER_AUTH_SECRET"),
    ADMIN_EMAILS: filled("ADMIN_EMAILS"),
    GITHUB_login_keys: filled("GITHUB_CLIENT_ID") && filled("GITHUB_CLIENT_SECRET"),
    GOOGLE_login_keys: filled("GOOGLE_CLIENT_ID") && filled("GOOGLE_CLIENT_SECRET"),
    CLOUDINARY_keys:
      filled("CLOUDINARY_CLOUD_NAME") && filled("CLOUDINARY_API_KEY") && filled("CLOUDINARY_API_SECRET"),
    RESEND_API_KEY: filled("RESEND_API_KEY"),
  };

  // The login redirect address that Google and GitHub will receive
  const base = resolveBaseUrl();
  const loginRedirects = base
    ? {
        github: `${base}/api/auth/callback/github`,
        google: `${base}/api/auth/callback/google`,
      }
    : "taken from the browser address (localhost)";

  let database = "not configured (MONGODB_URI is empty)";
  if (settings.MONGODB_URI) {
    try {
      await client.db("admin").command({ ping: 1 });
      database = "connected";
    } catch (error) {
      database = `FAILED: ${explain(error instanceof Error ? error.message : "")}`;
    }
  }

  return NextResponse.json({
    environment: process.env.NODE_ENV,
    settings,
    loginRedirects,
    database,
  });
}
