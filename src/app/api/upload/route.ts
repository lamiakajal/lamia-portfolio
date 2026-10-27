// ==========================================
// POST /api/upload  (admin only)
// Uploads one image to Cloudinary and returns its https link.
// Needs CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET.
// No npm package is needed: we call the Cloudinary REST API directly.
// ==========================================

import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/session";

export const runtime = "nodejs";

const MAX_BYTES = 5 * 1024 * 1024; // 5 MB
const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export async function POST(request: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ ok: false, error: "Not authorized." }, { status: 401 });
  }

  const cloud = process.env.CLOUDINARY_CLOUD_NAME;
  const key = process.env.CLOUDINARY_API_KEY;
  const secret = process.env.CLOUDINARY_API_SECRET;
  if (!cloud || !key || !secret) {
    return NextResponse.json(
      { ok: false, error: "Image upload is not set up yet (Cloudinary keys missing)." },
      { status: 503 },
    );
  }

  const form = await request.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ ok: false, error: "No image received." }, { status: 400 });
  }
  if (!ALLOWED.includes(file.type)) {
    return NextResponse.json(
      { ok: false, error: "Only JPG, PNG, WebP or GIF images are allowed." },
      { status: 400 },
    );
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ ok: false, error: "Image must be 5 MB or smaller." }, { status: 400 });
  }

  // Signed upload: signature = sha1("folder=...&timestamp=..." + api_secret)
  const folder = "lamia-portfolio/blog";
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const signature = createHash("sha1")
    .update(`folder=${folder}&timestamp=${timestamp}${secret}`)
    .digest("hex");

  const body = new FormData();
  body.append("file", file);
  body.append("api_key", key);
  body.append("timestamp", timestamp);
  body.append("folder", folder);
  body.append("signature", signature);

  try {
    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloud}/image/upload`, {
      method: "POST",
      body,
    });
    const data = (await res.json().catch(() => ({}))) as { secure_url?: string };
    if (!res.ok || !data.secure_url) {
      return NextResponse.json({ ok: false, error: "Upload failed. Please try again." }, { status: 502 });
    }
    return NextResponse.json({ ok: true, url: data.secure_url });
  } catch {
    return NextResponse.json({ ok: false, error: "Upload failed. Please try again." }, { status: 500 });
  }
}
