// PUT /api/blog/[id]    (admin only) -> update a post
// DELETE /api/blog/[id] (admin only) -> delete a post
import { NextResponse } from "next/server";
import { parsePostInput } from "@/lib/blog-types";
import { deletePost, updatePost } from "@/lib/blog";
import { requireAdmin } from "@/lib/session";

type Context = { params: Promise<{ id: string }> };

export async function PUT(request: Request, { params }: Context) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ ok: false, error: "Not authorized." }, { status: 401 });
  }
  const { id } = await params;

  const parsed = parsePostInput(await request.json().catch(() => null));
  if (!parsed.ok) {
    return NextResponse.json({ ok: false, error: parsed.error }, { status: 400 });
  }

  try {
    const post = await updatePost(id, parsed.data);
    if (!post) {
      return NextResponse.json({ ok: false, error: "Post not found." }, { status: 404 });
    }
    return NextResponse.json({ ok: true, post });
  } catch {
    return NextResponse.json({ ok: false, error: "Could not save the post." }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: Context) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ ok: false, error: "Not authorized." }, { status: 401 });
  }
  const { id } = await params;
  try {
    const deleted = await deletePost(id);
    return deleted
      ? NextResponse.json({ ok: true })
      : NextResponse.json({ ok: false, error: "Post not found." }, { status: 404 });
  } catch {
    return NextResponse.json({ ok: false, error: "Could not delete the post." }, { status: 500 });
  }
}
