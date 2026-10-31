// POST /api/upload/avatar  (any logged-in person)
// Uploads a profile picture to Cloudinary (max 2 MB) and returns a square 256px link.
import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";

export const runtime = "nodejs";

const MAX_BYTES = 2 * 1024 * 1024;
const ALLOWED = ["image/jpeg", "image/png", "image/webp"];

export async function POST(request: Request) {
  if (!(await getSession())) {
    return NextResponse.json({ ok: false, error: "Please log in." }, { status: 401 });
  }
  const cloud = process.env.CLOUDINARY_CLOUD_NAME;
  const key = process.env.CLOUDINARY_API_KEY;
  const secret = process.env.CLOUDINARY_API_SECRET;
  if (!cloud || !key || !secret) {
    return NextResponse.json({ ok: false, error: "Picture upload is not set up yet." }, { status: 503 });
  }

  const form = await request.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ ok: false, error: "No picture received." }, { status: 400 });
  }
  if (!ALLOWED.includes(file.type)) {
    return NextResponse.json({ ok: false, error: "Use a JPG, PNG or WebP picture." }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ ok: false, error: "Picture must be 2 MB or smaller." }, { status: 400 });
  }

  const folder = "lamia-portfolio/avatars";
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
    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloud}/image/upload`, { method: "POST", body });
    const data = (await res.json().catch(() => ({}))) as { secure_url?: string };
    if (!res.ok || !data.secure_url) {
      return NextResponse.json({ ok: false, error: "Upload failed. Please try again." }, { status: 502 });
    }
    // Ask Cloudinary for a face-centred 256x256 version
    const url = data.secure_url.replace("/upload/", "/upload/c_fill,g_face,w_256,h_256,q_auto,f_auto/");
    return NextResponse.json({ ok: true, url });
  } catch {
    return NextResponse.json({ ok: false, error: "Upload failed. Please try again." }, { status: 500 });
  }
}
