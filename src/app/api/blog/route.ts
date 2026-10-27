// POST /api/blog  (admin only) -> create a post
import { NextResponse } from "next/server";
import { parsePostInput } from "@/lib/blog-types";
import { createPost } from "@/lib/blog";
import { requireAdmin } from "@/lib/session";

export async function POST(request: Request) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ ok: false, error: "Not authorized." }, { status: 401 });
  }

  const parsed = parsePostInput(await request.json().catch(() => null));
  if (!parsed.ok) {
    return NextResponse.json({ ok: false, error: parsed.error }, { status: 400 });
  }

  try {
    const post = await createPost(parsed.data, {
      name: session.user.name,
      email: session.user.email,
    });
    return NextResponse.json({ ok: true, post });
  } catch {
    return NextResponse.json({ ok: false, error: "Could not save the post." }, { status: 500 });
  }
}
