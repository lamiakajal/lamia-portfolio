// POST /api/posts/[id]/reaction  { type: "like" | "love" | "clap" | "insight" | "fire" | null }
// Logged-in visitors only. One reaction per person per post; null removes it.
import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { isPublishedPostId } from "@/lib/blog";
import { getEngagement, setReaction } from "@/lib/engagement";
import { isReactionType } from "@/lib/engagement-types";

type Context = { params: Promise<{ id: string }> };

export async function POST(request: Request, { params }: Context) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ ok: false, error: "Please log in to react." }, { status: 401 });
  }
  const { id } = await params;
  const body = (await request.json().catch(() => null)) as { type?: unknown } | null;
  const type = body?.type ?? null;
  if (type !== null && !isReactionType(type)) {
    return NextResponse.json({ ok: false, error: "Invalid reaction." }, { status: 400 });
  }

  try {
    if (!(await isPublishedPostId(id))) {
      return NextResponse.json({ ok: false, error: "Post not found." }, { status: 404 });
    }
    await setReaction(id, session.user.id, type);
    return NextResponse.json({ ok: true, engagement: await getEngagement(id, session.user.id) });
  } catch {
    return NextResponse.json({ ok: false, error: "Could not save your reaction." }, { status: 500 });
  }
}
