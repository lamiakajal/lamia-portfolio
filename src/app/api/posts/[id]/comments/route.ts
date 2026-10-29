// GET    /api/posts/[id]/comments                 -> list comments (everyone)
// POST   /api/posts/[id]/comments  { content }    -> add a comment (logged-in)
// DELETE /api/posts/[id]/comments?commentId=...   -> delete (the author or the admin)
import { NextResponse } from "next/server";
import { getSession, isAdminUser } from "@/lib/session";
import { isPublishedPostId } from "@/lib/blog";
import { addComment, deleteComment, listComments } from "@/lib/engagement";

type Context = { params: Promise<{ id: string }> };

// Max 6 comments per person per minute (in memory; enough to stop simple spam)
const recent = new Map<string, number[]>();
function tooFast(userId: string) {
  const now = Date.now();
  const list = (recent.get(userId) ?? []).filter((t) => now - t < 60_000);
  list.push(now);
  recent.set(userId, list);
  return list.length > 6;
}

export async function GET(_request: Request, { params }: Context) {
  const { id } = await params;
  try {
    if (!(await isPublishedPostId(id))) return NextResponse.json({ ok: true, comments: [] });
    return NextResponse.json({ ok: true, comments: await listComments(id) });
  } catch {
    return NextResponse.json({ ok: false, error: "Could not load comments." }, { status: 500 });
  }
}

export async function POST(request: Request, { params }: Context) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ ok: false, error: "Please log in to comment." }, { status: 401 });
  }
  const { id } = await params;
  const body = (await request.json().catch(() => null)) as { content?: unknown } | null;
  const content = typeof body?.content === "string" ? body.content.trim() : "";
  if (content.length < 2 || content.length > 1000) {
    return NextResponse.json({ ok: false, error: "A comment must be 2 to 1000 characters." }, { status: 400 });
  }
  if (tooFast(session.user.id)) {
    return NextResponse.json({ ok: false, error: "You are commenting too fast. Please wait a moment." }, { status: 429 });
  }

  try {
    if (!(await isPublishedPostId(id))) {
      return NextResponse.json({ ok: false, error: "Post not found." }, { status: 404 });
    }
    const comment = await addComment(id, { id: session.user.id, name: session.user.name || "Reader" }, content);
    return NextResponse.json({ ok: true, comment });
  } catch {
    return NextResponse.json({ ok: false, error: "Could not post your comment." }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ ok: false, error: "Please log in." }, { status: 401 });
  }
  const commentId = new URL(request.url).searchParams.get("commentId") ?? "";
  try {
    const deleted = await deleteComment(commentId, session.user.id, isAdminUser(session.user));
    return deleted
      ? NextResponse.json({ ok: true })
      : NextResponse.json({ ok: false, error: "Comment not found." }, { status: 404 });
  } catch {
    return NextResponse.json({ ok: false, error: "Could not delete the comment." }, { status: 500 });
  }
}
