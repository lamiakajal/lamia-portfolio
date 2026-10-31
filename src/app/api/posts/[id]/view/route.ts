// POST /api/posts/[id]/view -> +1 view for a published post (the admin's own visits are not counted)
import { NextResponse } from "next/server";
import { getSession, isAdminUser } from "@/lib/session";
import { addPostView } from "@/lib/blog";

type Context = { params: Promise<{ id: string }> };

export async function POST(_request: Request, { params }: Context) {
  const { id } = await params;
  try {
    const session = await getSession().catch(() => null);
    if (!isAdminUser(session?.user)) await addPostView(id);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
