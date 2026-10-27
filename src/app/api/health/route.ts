// ==========================================
// GET /api/health  (development only)
// Shows which settings are filled in and whether the database connects.
// It never shows secret values, only true / false. Returns 404 on the live site.
// ==========================================

import { NextResponse } from "next/server";
import { client } from "@/lib/mongodb";

export const dynamic = "force-dynamic";

export async function GET() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const filled = (name: string) => Boolean(process.env[name]);
  const settings = {
    MONGODB_URI: filled("MONGODB_URI"),
    BETTER_AUTH_SECRET: filled("BETTER_AUTH_SECRET"),
    BETTER_AUTH_URL: process.env.BETTER_AUTH_URL ?? "(empty)",
    ADMIN_EMAILS: process.env.ADMIN_EMAILS ?? "lamiakajal@gmail.com (default)",
    GITHUB_login: filled("GITHUB_CLIENT_ID") && filled("GITHUB_CLIENT_SECRET"),
    GOOGLE_login: filled("GOOGLE_CLIENT_ID") && filled("GOOGLE_CLIENT_SECRET"),
    CLOUDINARY: filled("CLOUDINARY_CLOUD_NAME") && filled("CLOUDINARY_API_KEY") && filled("CLOUDINARY_API_SECRET"),
  };

  let database = "not configured (MONGODB_URI is empty)";
  if (settings.MONGODB_URI) {
    try {
      await client.db("admin").command({ ping: 1 });
      database = "connected";
    } catch (error) {
      database = `FAILED: ${error instanceof Error ? error.message : "unknown error"}`;
    }
  }

  return NextResponse.json({ settings, database });
}
