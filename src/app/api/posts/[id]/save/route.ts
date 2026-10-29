// POST /api/posts/[id]/save  { saved: boolean }  - bookmark a post (logged-in visitors only)
import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { isPublishedPostId } from "@/lib/blog";
import { getEngagement, setSaved } from "@/lib/engagement";

type Context = { params: Promise<{ id: string }> };

export async function POST(request: Request, { params }: Context) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ ok: false, error: "Please log in to save posts." }, { status: 401 });
  }
  const { id } = await params;
  const body = (await request.json().catch(() => null)) as { saved?: unknown } | null;
  if (typeof body?.saved !== "boolean") {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  try {
    if (!(await isPublishedPostId(id))) {
      return NextResponse.json({ ok: false, error: "Post not found." }, { status: 404 });
    }
    await setSaved(id, session.user.id, body.saved);
    return NextResponse.json({ ok: true, engagement: await getEngagement(id, session.user.id) });
  } catch {
    return NextResponse.json({ ok: false, error: "Could not update your saved posts." }, { status: 500 });
  }
}
