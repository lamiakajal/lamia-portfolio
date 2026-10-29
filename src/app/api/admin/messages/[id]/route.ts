// PATCH  /api/admin/messages/[id]  { read: boolean }  (admin only)
// DELETE /api/admin/messages/[id]                     (admin only)
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/session";
import { deleteMessage, setMessageRead } from "@/lib/engagement";

type Context = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Context) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ ok: false, error: "Not authorized." }, { status: 401 });
  }
  const { id } = await params;
  const body = (await request.json().catch(() => null)) as { read?: unknown } | null;
  if (typeof body?.read !== "boolean") {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }
  try {
    const ok = await setMessageRead(id, body.read);
    return ok
      ? NextResponse.json({ ok: true })
      : NextResponse.json({ ok: false, error: "Message not found." }, { status: 404 });
  } catch {
    return NextResponse.json({ ok: false, error: "Could not update the message." }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: Context) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ ok: false, error: "Not authorized." }, { status: 401 });
  }
  const { id } = await params;
  try {
    const ok = await deleteMessage(id);
    return ok
      ? NextResponse.json({ ok: true })
      : NextResponse.json({ ok: false, error: "Message not found." }, { status: 404 });
  } catch {
    return NextResponse.json({ ok: false, error: "Could not delete the message." }, { status: 500 });
  }
}
